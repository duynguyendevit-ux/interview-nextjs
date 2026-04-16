# Best Practices for Using ApplicationEventPublisher in Spring Monolithic Applications

**Date:** April 16, 2026  
**Topic:** Spring Boot  
**Author:** Interview Prep Team

---

## Introduction

`ApplicationEventPublisher` is a powerful Spring Framework component that enables event-driven architecture within your application. It allows different parts of your application to communicate through events without tight coupling, making your code more maintainable and testable.

## When to Use Event-Driven Architecture in Monoliths

Event-driven patterns are beneficial when:

- You need to decouple business logic across different modules
- Multiple components need to react to the same action
- You want to implement cross-cutting concerns (audit logging, notifications)
- You need to maintain transaction boundaries while triggering side effects

## Synchronous vs Asynchronous Event Handling

### Synchronous Events (Default)

```java
// Event class
import lombok.Value;

@Value
public class OrderCreatedEvent {
    Long orderId;
    String customerEmail;
}

// Publisher
@Service
public class OrderService {
    private final ApplicationEventPublisher eventPublisher;
    
    public OrderService(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }
    
    public void createOrder(Order order) {
        // Save order
        orderRepository.save(order);
        
        // Publish event (synchronous by default)
        eventPublisher.publishEvent(
            new OrderCreatedEvent(order.getId(), order.getCustomerEmail())
        );
    }
}

// Listener
@Component
public class OrderEventListener {
    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        // This runs synchronously in the same thread
        log.info("Order created: {}", event.getOrderId());
        // Send confirmation email
    }
}
```

### Asynchronous Events

```java
// Enable async support
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("event-");
        executor.initialize();
        return executor;
    }
}

// Async listener
@Component
public class NotificationListener {
    @Async
    @EventListener
    public void handleOrderCreatedAsync(OrderCreatedEvent event) {
        // This runs in a separate thread
        // Non-critical operations like sending emails
        emailService.sendOrderConfirmation(event.getCustomerEmail());
    }
}
```

## Transaction Boundaries and @TransactionalEventListener

One of the most common pitfalls is publishing events before the transaction commits. Use `@TransactionalEventListener` to control when events are processed:

```java
@Component
public class TransactionalEventHandler {
    
    // Only runs if transaction commits successfully
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleAfterCommit(OrderCreatedEvent event) {
        // Safe to call external APIs here
        // Transaction is already committed
        paymentService.processPayment(event.getOrderId());
    }
    
    // Runs before transaction commits
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleBeforeCommit(OrderCreatedEvent event) {
        // Still within transaction
        // Can perform additional DB operations
        auditRepository.save(new AuditLog(event));
    }
    
    // Runs if transaction rolls back
    @TransactionalEventListener(phase = TransactionPhase.AFTER_ROLLBACK)
    public void handleRollback(OrderCreatedEvent event) {
        // Cleanup or compensation logic
        log.error("Order creation failed: {}", event.getOrderId());
    }
}
```

## Performance Considerations and Common Pitfalls

### 1. Too Many Synchronous Listeners

**Problem:** Each synchronous listener blocks the main thread, increasing response time.

**Solution:** Use `@Async` for non-critical operations:

```java
// BAD: All listeners run synchronously
@EventListener
public void sendEmail(OrderCreatedEvent event) { /* slow */ }

@EventListener
public void updateAnalytics(OrderCreatedEvent event) { /* slow */ }

@EventListener
public void notifyWarehouse(OrderCreatedEvent event) { /* slow */ }

// GOOD: Non-critical operations are async
@EventListener
public void saveOrder(OrderCreatedEvent event) { /* critical, sync */ }

@Async
@EventListener
public void sendEmail(OrderCreatedEvent event) { /* non-critical, async */ }

@Async
@EventListener
public void updateAnalytics(OrderCreatedEvent event) { /* non-critical, async */ }
```

### 2. Event Storms

**Problem:** Events triggering other events can create cascading chains or infinite loops.

**Solution:** Use conditional listeners and avoid circular dependencies:

```java
// Use conditions to filter events
@EventListener(condition = "#event.amount > 1000")
public void handleLargeOrder(OrderCreatedEvent event) {
    // Only process orders over $1000
}

// Batch events instead of publishing individually
@Scheduled(fixedDelay = 5000)
public void publishBatchEvents() {
    List<Order> pendingOrders = orderRepository.findPending();
    if (!pendingOrders.isEmpty()) {
        eventPublisher.publishEvent(new BatchOrderEvent(pendingOrders));
    }
}
```

### 3. Memory Overhead

**Problem:** Creating too many event objects can pressure the garbage collector.

**Solution:** Keep event objects lightweight and consider object pooling for high-frequency events:

```java
// BAD: Heavy event object
import lombok.Data;

@Data
public class OrderEvent {
    private Order order; // Contains entire order with all relations
    private Customer customer; // Full customer object
    private List<Product> products; // All products
}

// GOOD: Lightweight event with IDs only
import lombok.Value;

@Value
public class OrderEvent {
    Long orderId;
    Long customerId;
    // Listeners fetch full objects only if needed
}
```

## Monitoring and Debugging

```java
@Component
@Slf4j
public class EventMonitor {
    
    @EventListener
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public void logAllEvents(ApplicationEvent event) {
        log.debug("Event published: {} at {}", 
            event.getClass().getSimpleName(), 
            System.currentTimeMillis());
    }
    
    @Async
    @EventListener
    public void trackEventMetrics(ApplicationEvent event) {
        metricsService.incrementCounter(
            "events.published", 
            "type", event.getClass().getSimpleName()
        );
    }
}
```

## Best Practices Summary

- **Use events for cross-cutting concerns** - audit logging, notifications, analytics
- **Keep events lightweight** - pass IDs, not full objects
- **Use @Async for non-critical operations** - emails, notifications, analytics
- **Respect transaction boundaries** - use @TransactionalEventListener appropriately
- **Avoid event storms** - use conditions, batch processing, and avoid circular dependencies
- **Monitor event processing** - track metrics and performance
- **Don't overuse events** - direct method calls are simpler for core business logic
- **Consider message queues** - for high-volume scenarios, use Kafka or RabbitMQ instead

## Conclusion

`ApplicationEventPublisher` is a powerful tool for building maintainable monolithic applications, but it requires careful consideration of performance, transaction boundaries, and event flow. By following these best practices, you can leverage event-driven patterns effectively without introducing complexity or performance issues.

Remember: events are great for decoupling, but they add indirection. Use them judiciously for cross-cutting concerns and side effects, but keep your core business logic straightforward with direct method calls.

---

**Related Topics:**
- Spring Boot Transaction Management
- Asynchronous Processing in Spring
- Event-Driven Architecture Patterns
- Spring Boot Performance Optimization
