# Redis Streams: Production-Ready Pattern with Spring Boot

**Date:** April 16, 2026  
**Topic:** Redis, Spring Boot  
**Author:** Interview Prep Team

---

## Introduction

Redis Streams provides a powerful message queue and event streaming solution, but implementing it correctly in production requires careful attention to consumer scaling, retry logic, dead-letter queues, and latency tracking. This guide shows you a battle-tested pattern using Spring Boot and `StringRedisTemplate`.

## Understanding Redis Streams Guarantees

**Important:** Redis Streams does **NOT** automatically deduplicate messages across multiple consumers.

### What Redis Streams Provides

- **At-least-once delivery** (not exactly-once)
- **Load balancing** within a consumer group
- **Pending Entries List (PEL)** for tracking unacknowledged messages
- Each message delivered to only one consumer within a group

### What Can Still Cause Duplicates

- Consumer crashes before ACK
- Message reclaimed via `XCLAIM` / `XAUTOCLAIM`
- Multiple consumer groups reading the same stream
- Producer retries sending the same event

**Key Takeaway:** You must implement idempotency yourself.

## Architecture Overview

```
Producers → Main Stream → Consumer Group → Workers
                              ↓
                         Retry (XAUTOCLAIM)
                              ↓
                         Dead Letter Queue
                              ↓
                         Monitoring + Metrics
```

### Stream Design

Use separate streams for different purposes:

- `tasks:stream` → main processing
- `tasks:dlq` → permanently failed messages

Each message should include:

```json
{
  "event_id": "uuid",
  "payload": "...",
  "created_at": 1710000000,
  "retry_count": 0
}
```

## Spring Boot Implementation

### Dependencies

```gradle
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

### Constants

```java
public class StreamConstants {
    public static final String STREAM = "tasks:stream";
    public static final String GROUP = "workers";
    public static final String DLQ = "tasks:dlq";
    public static final int MAX_RETRY = 5;
    public static final long CLAIM_IDLE_MS = 60_000;
}
```

### Create Consumer Group on Startup

```java
@Bean
ApplicationRunner initRedis(StreamOperations<String, String, String> streamOps) {
    return args -> {
        try {
            streamOps.createGroup(
                StreamConstants.STREAM, 
                ReadOffset.latest(), 
                StreamConstants.GROUP
            );
        } catch (Exception e) {
            // group exists → ignore
        }
    };
}
```

### Unique Consumer Name Per Instance

**Critical:** Never use the same consumer name across multiple instances.

```java
@Bean
public String consumerName() {
    return "worker-" + UUID.randomUUID();
}
```

**Why unique names matter:**

- Same name = treated as one consumer
- Breaks load balancing
- Increases duplicate processing risk
- Makes debugging impossible

## Producer Implementation

```java
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskProducer {
    
    private final StringRedisTemplate redisTemplate;
    
    public void publish(String eventId, String payload) {
        Map<String, String> message = Map.of(
            "event_id", eventId,
            "payload", payload,
            "created_at", String.valueOf(System.currentTimeMillis()),
            "retry_count", "0"
        );
        
        redisTemplate.opsForStream().add(StreamConstants.STREAM, message);
    }
}
```

## Lifecycle-Managed Worker (Recommended Pattern)

Instead of using `@Scheduled`, use `SmartLifecycle` + `TaskExecutor` for better control:

### Thread Pool Configuration

```java
@Configuration
public class RedisConfig {
    
    @Bean
    public ThreadPoolTaskExecutor streamExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4); // number of workers
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(0); // no queue → backpressure
        executor.setThreadNamePrefix("stream-worker-");
        executor.initialize();
        return executor;
    }
}
```

### Worker with SmartLifecycle

```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.SmartLifecycle;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisStreamWorker implements SmartLifecycle {
    
    private final ThreadPoolTaskExecutor streamExecutor;
    private final StringRedisTemplate redisTemplate;
    private final String consumerName = "worker-" + UUID.randomUUID();
    
    private volatile boolean running = false;
    
    @Override
    public void start() {
        running = true;
        int workers = streamExecutor.getCorePoolSize();
        
        for (int i = 0; i < workers; i++) {
            streamExecutor.execute(this::runLoop);
        }
        
        log.info("Started {} Redis Stream workers", workers);
    }
    
    private void runLoop() {
        while (running) {
            try {
                var messages = redisTemplate.opsForStream().read(
                    Consumer.from(StreamConstants.GROUP, consumerName),
                    StreamReadOptions.empty()
                        .count(10)
                        .block(Duration.ofSeconds(2)),
                    StreamOffset.create(StreamConstants.STREAM, ReadOffset.lastConsumed())
                );
                
                if (messages == null || messages.isEmpty()) {
                    continue;
                }
                
                for (var msg : messages) {
                    handleMessage(msg);
                }
            } catch (Exception e) {
                log.error("Error in worker loop", e);
                sleep(100); // avoid tight error loop
            }
        }
    }
    
    private void handleMessage(MapRecord<String, Object, Object> msg) {
        String msgId = msg.getId().getValue();
        Map<Object, Object> value = msg.getValue();
        String eventId = (String) value.get("event_id");
        
        // Idempotency check
        Boolean first = redisTemplate.opsForValue()
            .setIfAbsent("processed:" + eventId, "1", Duration.ofHours(24));
        
        if (Boolean.FALSE.equals(first)) {
            log.debug("Duplicate message detected: {}", eventId);
            ack(msgId);
            return;
        }
        
        // Latency tracking
        long createdAt = Long.parseLong((String) value.get("created_at"));
        long latency = System.currentTimeMillis() - createdAt;
        
        try {
            // Process business logic
            processTask(value);
            
            // Track metrics
            redisTemplate.opsForHash().increment("metrics:latency", "count", 1);
            redisTemplate.opsForHash().increment("metrics:latency", "total_ms", latency);
            
            ack(msgId);
            log.info("Processed message {} in {}ms", eventId, latency);
            
        } catch (Exception ex) {
            log.error("Failed to process message {}", eventId, ex);
            handleFailure(msg, value, ex);
        }
    }
    
    private void processTask(Map<Object, Object> value) {
        // Your business logic here
        String payload = (String) value.get("payload");
        // ... process payload
    }
    
    private void ack(String msgId) {
        redisTemplate.opsForStream()
            .acknowledge(StreamConstants.STREAM, StreamConstants.GROUP, msgId);
    }
    
    private void handleFailure(MapRecord<String, Object, Object> msg,
                               Map<Object, Object> value,
                               Exception ex) {
        int retryCount = Integer.parseInt((String) value.get("retry_count"));
        
        if (retryCount < StreamConstants.MAX_RETRY) {
            // Retry
            Map<String, String> retryMsg = Map.of(
                "event_id", (String) value.get("event_id"),
                "payload", (String) value.get("payload"),
                "created_at", (String) value.get("created_at"),
                "retry_count", String.valueOf(retryCount + 1)
            );
            
            redisTemplate.opsForStream().add(StreamConstants.STREAM, retryMsg);
            log.warn("Retrying message {} (attempt {})", value.get("event_id"), retryCount + 1);
            
        } else {
            // Send to DLQ
            Map<String, String> dlqMsg = Map.of(
                "event_id", (String) value.get("event_id"),
                "payload", (String) value.get("payload"),
                "created_at", (String) value.get("created_at"),
                "retry_count", String.valueOf(retryCount),
                "error", ex.getMessage(),
                "failed_at", String.valueOf(System.currentTimeMillis())
            );
            
            redisTemplate.opsForStream().add(StreamConstants.DLQ, dlqMsg);
            log.error("Message {} moved to DLQ after {} retries", value.get("event_id"), retryCount);
        }
        
        ack(msg.getId().getValue());
    }
    
    @Override
    public void stop() {
        running = false;
        log.info("Stopping Redis Stream workers");
    }
    
    @Override
    public boolean isRunning() {
        return running;
    }
    
    private void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }
    }
}
```

## Retry Worker with XAUTOCLAIM

Separate component to reclaim stuck messages:

```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisStreamReclaimer {
    
    private final StringRedisTemplate redisTemplate;
    private final String consumerName = "reclaimer-" + UUID.randomUUID();
    
    @Scheduled(fixedDelay = 5000)
    public void reclaimStuckMessages() {
        try {
            var result = redisTemplate.opsForStream().autoClaim(
                StreamConstants.STREAM,
                Consumer.from(StreamConstants.GROUP, consumerName),
                Duration.ofMillis(StreamConstants.CLAIM_IDLE_MS),
                ReadOffset.from("0")
            );
            
            if (result == null || result.getMessages().isEmpty()) {
                return;
            }
            
            log.info("Reclaimed {} stuck messages", result.getMessages().size());
            
            for (var msg : result.getMessages()) {
                // Process same as normal worker
                // handleMessage((MapRecord<String, Object, Object>) msg);
            }
            
        } catch (Exception e) {
            log.error("Error reclaiming messages", e);
        }
    }
}
```

## Monitoring and Observability

```java
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.stream.PendingMessagesSummary;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StreamMonitoringService {
    
    private final StringRedisTemplate redisTemplate;
    
    public Long getStreamSize() {
        return redisTemplate.opsForStream().size(StreamConstants.STREAM);
    }
    
    public PendingMessagesSummary getPendingMessages() {
        return redisTemplate.opsForStream()
            .pending(StreamConstants.STREAM, StreamConstants.GROUP);
    }
    
    public Long getDLQSize() {
        return redisTemplate.opsForStream().size(StreamConstants.DLQ);
    }
    
    public Map<String, Object> getLatencyMetrics() {
        Map<Object, Object> metrics = redisTemplate.opsForHash()
            .entries("metrics:latency");
        
        long count = Long.parseLong((String) metrics.getOrDefault("count", "0"));
        long totalMs = Long.parseLong((String) metrics.getOrDefault("total_ms", "0"));
        
        return Map.of(
            "count", count,
            "total_ms", totalMs,
            "avg_ms", count > 0 ? totalMs / count : 0
        );
    }
}
```

## Configuration

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    lettuce:
      pool:
        max-active: 50
        max-idle: 10
        min-idle: 5
```

## Best Practices Summary

### Do's

- **Use unique consumer names** per instance (`worker-${uuid}`)
- **Implement idempotency** with `SETNX` or database unique constraints
- **Use SmartLifecycle + TaskExecutor** for worker management
- **Track latency** at message level
- **Monitor PEL size** for backlog detection
- **Use XAUTOCLAIM** for stuck message recovery
- **Implement DLQ** for permanent failures
- **Set retry limits** to avoid infinite loops

### Don'ts

- **Never use same consumer name** across instances
- **Don't rely on Redis** for deduplication
- **Don't use @Scheduled** for main worker loop (use lifecycle)
- **Don't block indefinitely** (use reasonable timeout)
- **Don't ignore PEL** (hidden backlog indicator)
- **Don't skip monitoring** (stream size, latency, DLQ)

## Common Pitfalls

### 1. Same Consumer Name

**Problem:** Multiple instances with same name break load balancing

**Solution:** Use unique names per instance

### 2. No Idempotency

**Problem:** At-least-once delivery causes duplicates

**Solution:** Check `processed:{event_id}` before processing

### 3. No Retry Cap

**Problem:** Infinite retry loops

**Solution:** Set `MAX_RETRY` and use DLQ

### 4. No DLQ

**Problem:** Silent data loss

**Solution:** Always implement dead-letter queue

### 5. Blocking Too Long

**Problem:** Slow failover

**Solution:** Use reasonable block timeout (2-5 seconds)

## Performance Tuning

### Latency vs Throughput

| Setting | Effect |
|---------|--------|
| Small COUNT (10) | Lower latency |
| Large COUNT (50-100) | Higher throughput |
| More threads | Higher throughput |
| Blocking read | Efficient CPU usage |

### Backpressure Strategy

```java
// Option 1: No queue (fail fast)
executor.setQueueCapacity(0);

// Option 2: Bounded queue
executor.setQueueCapacity(1000);
```

## Conclusion

Redis Streams is a powerful tool for event-driven architectures, but it requires careful implementation to handle production scenarios correctly. By using Spring Boot's lifecycle management, proper idempotency, retry logic, and monitoring, you can build a robust and scalable message processing system.

Remember: Redis Streams provides **at-least-once delivery**, so **idempotency is your responsibility**. Always implement proper deduplication, retry limits, and dead-letter queues to handle edge cases gracefully.

---

**Related Topics:**
- Spring Boot Task Execution
- Redis Data Structures
- Event-Driven Architecture
- Message Queue Patterns
- Distributed Systems Reliability
