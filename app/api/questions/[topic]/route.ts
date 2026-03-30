export async function GET(
  request: Request,
  { params }: { params: Promise<{ topic: string }> }
) {
  const { topic } = await params
  
  const questionsData: Record<string, any[]> = {
    'spring-boot': [
      {
        id: 1,
        text: 'Spring Boot khác gì Spring Framework?',
        level: 'basic',
        answer: '- Spring Framework: Core framework, cần config thủ công (XML/Java config)\n- Spring Boot: Built on top of Spring, auto-configuration, embedded server, starter dependencies\n- Spring Boot giảm boilerplate code, faster development, production-ready features (Actuator, metrics)\n- Spring Boot = Spring Framework + Auto-configuration + Embedded Server + Starter POMs'
      },
      {
        id: 2,
        text: '@SpringBootApplication annotation làm gì?',
        level: 'basic',
        answer: 'Là combination của 3 annotations:\n- @Configuration: Đánh dấu class là source of bean definitions\n- @EnableAutoConfiguration: Enable auto-configuration mechanism\n- @ComponentScan: Scan components trong package hiện tại và sub-packages\nThường đặt ở main class để bootstrap Spring Boot application'
      },
      {
        id: 3,
        text: 'Auto-configuration trong Spring Boot hoạt động như thế nào?',
        level: 'basic',
        answer: '- Spring Boot scan classpath và tự động config beans dựa trên dependencies có sẵn\n- Sử dụng @Conditional annotations để quyết định config nào được apply\n- Ví dụ: Nếu có H2 trong classpath → auto-config DataSource\n- Có thể exclude auto-config: @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})\n- File META-INF/spring.factories chứa danh sách auto-configuration classes'
      },
      {
        id: 4,
        text: 'Spring Boot Actuator là gì? Các endpoint quan trọng?',
        level: 'intermediate',
        answer: 'Production-ready features để monitor và manage application:\n- /actuator/health: Health check status\n- /actuator/metrics: Application metrics\n- /actuator/info: Application info\n- /actuator/env: Environment properties\n- /actuator/loggers: Log levels configuration\n- /actuator/threaddump: Thread dump\n- /actuator/heapdump: Heap dump\nEnable: spring-boot-starter-actuator dependency'
      },
      {
        id: 5,
        text: '@Transactional annotation hoạt động như thế nào?',
        level: 'intermediate',
        answer: '- Đánh dấu method/class cần transaction management\n- Spring tạo proxy around bean để intercept method calls\n- Transaction bắt đầu khi method được gọi, commit khi method return successfully\n- Rollback khi có RuntimeException (hoặc Error)\n- Attributes: propagation, isolation, timeout, readOnly, rollbackFor\n- Chỉ work với public methods và external calls (không work với internal method calls)'
      },
      {
        id: 6,
        text: 'Spring Security OAuth2 flow - giải thích chi tiết',
        level: 'advanced',
        answer: 'Authorization Code Flow (phổ biến nhất):\n1. Client redirect user đến Authorization Server\n2. User login và authorize\n3. Authorization Server redirect về với authorization code\n4. Client exchange code for access token\n5. Client dùng access token để call Resource Server\n6. Resource Server validate token và return data\n\nJWT Token: Self-contained, stateless, chứa claims\nRefresh Token: Dùng để lấy access token mới khi expire'
      },
      {
        id: 7,
        text: 'Spring Boot Profiles - khi nào và làm thế nào sử dụng?',
        level: 'intermediate',
        answer: 'Profiles cho phép config khác nhau cho từng environment (dev, test, prod)\n\nCách sử dụng:\n- application-dev.properties, application-prod.properties\n- Activate: spring.profiles.active=prod\n- @Profile("dev") annotation trên beans\n- Command line: java -jar app.jar --spring.profiles.active=prod\n\nUse cases: Database configs, logging levels, feature flags'
      },
      {
        id: 8,
        text: 'Microservices với Spring Boot - các patterns quan trọng?',
        level: 'advanced',
        answer: '1. Service Discovery: Eureka, Consul\n2. API Gateway: Spring Cloud Gateway, Zuul\n3. Circuit Breaker: Resilience4j, Hystrix (deprecated)\n4. Config Management: Spring Cloud Config\n5. Load Balancing: Ribbon, Spring Cloud LoadBalancer\n6. Distributed Tracing: Sleuth + Zipkin\n7. Message Queue: RabbitMQ, Kafka\n8. Security: OAuth2, JWT tokens\n\nBest practices: Database per service, async communication, saga pattern'
      },
      {
        id: 9,
        text: '@RestController vs @Controller - khác nhau gì?',
        level: 'intermediate',
        answer: '@Controller:\n- Dùng cho MVC pattern\n- Return view name (HTML pages)\n- Cần @ResponseBody để return data\n\n@RestController:\n- = @Controller + @ResponseBody\n- Return data directly (JSON/XML)\n- Dùng cho RESTful APIs\n- Không cần @ResponseBody trên methods\n\nBest practice: Dùng @RestController cho REST APIs'
      },
      {
        id: 10,
        text: 'Spring Boot caching strategies - Redis vs Caffeine?',
        level: 'advanced',
        answer: 'Caffeine (In-memory):\n- Fast, local cache\n- Good for single instance\n- Automatic eviction policies\n- Use @Cacheable, @CacheEvict\n\nRedis (Distributed):\n- Shared cache across instances\n- Persistence options\n- Pub/sub capabilities\n- Better for microservices\n\nHybrid approach: L1 (Caffeine) + L2 (Redis) caching'
      },
      {
        id: 11,
        text: 'Spring Boot với Reactive Programming - WebFlux vs MVC?',
        level: 'advanced',
        answer: 'Spring MVC (Traditional):\n- Blocking I/O, thread-per-request\n- Easier to understand và debug\n- Good for CRUD apps, traditional databases\n- Servlet-based (Tomcat, Jetty)\n\nSpring WebFlux (Reactive):\n- Non-blocking I/O, event-driven\n- Better scalability với high concurrency\n- Mono/Flux reactive types\n- Netty-based server\n- Use case: Streaming, real-time data, microservices\n\nTrade-off: Complexity vs Performance'
      },
      {
        id: 12,
        text: '@ConfigurationProperties vs @Value - khi nào dùng cái nào?',
        level: 'intermediate',
        answer: '@Value:\n- Inject single property\n- Simple use cases\n- @Value("${app.name}")\n- No validation support\n\n@ConfigurationProperties:\n- Type-safe configuration\n- Group related properties\n- Validation support (@Validated)\n- Better for complex configs\n- Relaxed binding (app.name = appName)\n\nBest practice: Use @ConfigurationProperties cho complex configs'
      },
      {
        id: 13,
        text: 'Spring Boot testing strategies - Unit vs Integration tests?',
        level: 'advanced',
        answer: 'Unit Tests:\n- @ExtendWith(MockitoExtension.class)\n- Mock dependencies với @Mock, @InjectMocks\n- Fast, isolated\n- Test business logic only\n\nIntegration Tests:\n- @SpringBootTest: Full application context\n- @WebMvcTest: Test controllers only\n- @DataJpaTest: Test repositories only\n- @TestContainers: Real database testing\n- Slower but more realistic\n\nBest practice: Pyramid - nhiều unit tests, ít integration tests'
      },
      {
        id: 14,
        text: 'Spring Boot exception handling - @ControllerAdvice?',
        level: 'intermediate',
        answer: '@ControllerAdvice: Global exception handler cho tất cả controllers\n\nExample:\n@ControllerAdvice\npublic class GlobalExceptionHandler {\n  @ExceptionHandler(ResourceNotFoundException.class)\n  public ResponseEntity handleNotFound(Exception e) {\n    return ResponseEntity.status(404).body(error);\n  }\n}\n\nBenefits: Centralized error handling, consistent responses, cleaner controllers'
      },
      {
        id: 15,
        text: 'Spring Boot performance tuning - các techniques quan trọng?',
        level: 'advanced',
        answer: '1. Database:\n- Connection pooling (HikariCP)\n- Lazy loading, fetch strategies\n- Query optimization, indexes\n\n2. Caching:\n- @Cacheable annotations\n- Redis/Caffeine\n\n3. Async Processing:\n- @Async methods\n- CompletableFuture\n\n4. Monitoring:\n- Actuator metrics\n- APM tools (New Relic, Datadog)\n\n5. JVM Tuning: Heap size, GC settings'
      },
      {
        id: 16,
        text: 'Spring Boot Starter Dependencies - cơ chế hoạt động?',
        level: 'intermediate',
        answer: 'Starters là pre-configured dependency descriptors giúp setup nhanh:\n\nVí dụ phổ biến:\n- spring-boot-starter-web: Tomcat, Spring MVC, Jackson\n- spring-boot-starter-data-jpa: Hibernate, JPA, JDBC\n- spring-boot-starter-security: Spring Security\n- spring-boot-starter-test: JUnit, Mockito, AssertJ\n\nLợi ích:\n- Tránh dependency conflicts\n- Version management tự động\n- Giảm boilerplate configuration\n\nCustom starter: Có thể tạo starter riêng cho team/company'
      },
      {
        id: 17,
        text: 'Spring Boot với Kafka - Producer/Consumer patterns?',
        level: 'advanced',
        answer: 'Producer:\n- KafkaTemplate.send(topic, key, value)\n- Async with callbacks\n- Idempotent producer (enable.idempotence=true)\n- Transactional producer cho exactly-once semantics\n\nConsumer:\n- @KafkaListener annotation\n- Manual vs auto commit\n- Error handling: @RetryableTopic, @DltHandler\n- Concurrency: Multiple threads per partition\n\nBest practices:\n- Use Avro/Protobuf for schema evolution\n- Monitor lag metrics\n- Implement dead letter topics'
      },
      {
        id: 18,
        text: 'Spring Boot Logging - SLF4J, Logback configuration?',
        level: 'intermediate',
        answer: 'Default: Spring Boot dùng Logback với SLF4J facade\n\nConfiguration:\n- application.properties: logging.level.com.example=DEBUG\n- logback-spring.xml cho advanced config\n- Rolling file appenders\n- JSON format cho centralized logging\n\nBest practices:\n- Use parameterized logging: log.info("User {} logged in", userId)\n- Different levels per environment (DEBUG dev, INFO prod)\n- Structured logging với MDC (Mapped Diagnostic Context)\n- Integration với ELK stack, Splunk'
      },
      {
        id: 19,
        text: 'Spring Boot Circuit Breaker - Resilience4j implementation?',
        level: 'advanced',
        answer: 'Circuit Breaker States:\n- CLOSED: Normal operation\n- OPEN: Failing, reject calls immediately\n- HALF_OPEN: Test if service recovered\n\nResilience4j annotations:\n- @CircuitBreaker(name = "backendA", fallbackMethod = "fallback")\n- @Retry(name = "backendA", fallbackMethod = "fallback")\n- @RateLimiter, @Bulkhead, @TimeLimiter\n\nConfiguration:\n- Failure rate threshold\n- Wait duration in open state\n- Sliding window size\n\nMonitoring: Actuator endpoints, Micrometer metrics'
      },
      {
        id: 20,
        text: 'Spring Data JPA - N+1 problem và cách giải quyết?',
        level: 'intermediate',
        answer: 'N+1 Problem:\n- 1 query lấy parent entities\n- N queries lấy từng child entity\n- Performance disaster với large datasets\n\nSolutions:\n1. @EntityGraph: Fetch associations in single query\n2. JOIN FETCH: JPQL với explicit join\n3. Batch fetching: @BatchSize annotation\n4. DTO projections: Chỉ lấy fields cần thiết\n5. FetchType.LAZY: Default, load on demand\n\nDetection: Enable hibernate.show_sql=true, check query count'
      },
      {
        id: 21,
        text: 'Production scenario: API slow under high load - troubleshooting steps?',
        level: 'advanced',
        answer: '1. Check Metrics:\n- CPU, memory, thread pool usage\n- Database connection pool exhaustion\n- Response time percentiles (p50, p95, p99)\n\n2. Database Issues:\n- Slow queries (enable query logging)\n- Missing indexes\n- Lock contention\n- Connection pool size too small\n\n3. Application Issues:\n- Synchronous blocking calls\n- N+1 queries\n- Large object serialization\n- Memory leaks\n\n4. Quick Fixes:\n- Add caching (Redis)\n- Increase connection pool\n- Add indexes\n- Use async processing'
      },
      {
        id: 22,
        text: 'Spring Boot với Docker - best practices?',
        level: 'intermediate',
        answer: 'Multi-stage build:\nFROM maven:3.8-openjdk-17 AS build\nCOPY . .\nRUN mvn clean package -DskipTests\n\nFROM openjdk:17-slim\nCOPY --from=build /target/*.jar app.jar\nENTRYPOINT ["java","-jar","/app.jar"]\n\nBest practices:\n- Use slim/alpine base images\n- Layer caching (dependencies first)\n- .dockerignore file\n- Non-root user\n- Health checks\n- Environment-specific configs'
      },
      {
        id: 23,
        text: 'Spring Boot distributed tracing - Sleuth + Zipkin implementation?',
        level: 'advanced',
        answer: 'Spring Cloud Sleuth:\n- Auto-generates trace IDs, span IDs\n- Propagates context across services\n- Integrates with logging (MDC)\n\nZipkin:\n- Distributed tracing UI\n- Visualize request flow\n- Identify latency bottlenecks\n\nSetup:\n- Add spring-cloud-starter-sleuth\n- Add spring-cloud-sleuth-zipkin\n- Configure: spring.zipkin.base-url\n- Sampling rate: spring.sleuth.sampler.probability\n\nUse case: Debug microservices performance issues'
      },
      {
        id: 24,
        text: 'Spring Boot validation - @Valid vs @Validated?',
        level: 'intermediate',
        answer: '@Valid (JSR-303):\n- Standard Java validation\n- Works on method parameters, fields\n- Nested object validation\n- No group validation support\n\n@Validated (Spring):\n- Spring-specific extension\n- Supports validation groups\n- Class-level annotation\n- Method-level validation\n\nCommon annotations:\n@NotNull, @NotEmpty, @NotBlank, @Size, @Min, @Max, @Email, @Pattern\n\nBest practice: Use @Validated for group validation, @Valid for simple cases'
      },
      {
        id: 25,
        text: 'Spring Boot production scenario: HashMap not thread-safe - fix?',
        level: 'advanced',
        answer: 'Problem:\n- Multiple threads updating HashMap\n- Data loss, inconsistency\n- Possible infinite loops (older Java)\n\nSolutions:\n1. ConcurrentHashMap: Thread-safe, best performance\n2. Collections.synchronizedMap(): Synchronized wrapper\n3. Hashtable: Legacy, slower (synchronized methods)\n\nBest practice:\nConcurrentHashMap map = new ConcurrentHashMap<>();\n\nWhy ConcurrentHashMap wins:\n- Lock striping (segment-level locking)\n- Better concurrency than synchronized\n- No locking for reads'
      },
      {
        id: 26,
        text: 'Tại sao retry mechanism đôi khi làm tình hình tệ hơn? Giải thích thundering herd.',
        level: 'advanced',
        answer: 'Problem: @Retryable không có jitter → tất cả clients retry cùng lúc\n→ Thundering herd: hàng nghìn requests đồng loạt đánh vào service đang fail\n\nSolutions:\n1. Exponential backoff + jitter (random delay)\n2. Circuit breaker (Resilience4j):\n   - OPEN state: Fail fast, không retry\n   - HALF_OPEN: Test recovery\n   - CLOSED: Normal operation\n3. Bulkheads: Isolate failures\n4. Rate limiting upstream\n\nReal scenario: "Retries amplified partial outage → total meltdown vì quên jitter"\n\nConfig example:\n@Retry(name = "backend", fallbackMethod = "fallback")\n@CircuitBreaker(name = "backend")\nresilience4j.retry.configs.default.waitDuration=1s\nresilience4j.retry.configs.default.enableRandomizedWait=true'
      },
      {
        id: 27,
        text: 'Virtual threads (Java 21+) tốt cho performance, nhưng khi nào chúng làm hại? Giải thích thread pinning.',
        level: 'advanced',
        answer: 'Virtual Threads (Java 21+):\n- Spawn millions without platform thread overhead\n- Perfect for I/O-bound work\n\nPinning Problem:\n- Happens when blocking inside synchronized blocks or native calls\n- Thread.sleep() in synchronized method pins carrier thread\n- Defeats the purpose of virtual threads\n\nWhen NOT to use:\n- CPU-bound work (use platform threads)\n- Inside synchronized blocks\n- Native method calls\n\nDebug pinning:\n-Djdk.tracePinnedThreads=full\n\nBest practice:\n- Use ReentrantLock instead of synchronized\n- Monitor with JFR (Java Flight Recorder)\n- Use for I/O: HTTP calls, DB queries, file operations'
      },
      {
        id: 28,
        text: 'GC đã tuned nhưng vẫn có 500ms pause mỗi 10 phút dưới high load. Debug như thế nào?',
        level: 'advanced',
        answer: 'Problem: Young GC pause 500ms chỉ xảy ra under load\n\nDebug steps:\n1. Enable GC logs: -Xlog:gc*\n2. Safepoint traces: -XX:+PrintSafepointStatistics\n3. Heap dump live objects: jcmd <pid> GC.heap_dump_live\n4. Correlate with allocation rate spikes\n\nCommon culprits:\n- Object pooling gone wrong\n- String concatenation in hot loops (use StringBuilder)\n- Large arrays allocated frequently\n- Finalizers blocking GC\n\nSolutions:\n- Switch to ZGC/Shenandoah for low-pause (<10ms)\n- Reduce allocation rate\n- Use -XX:MaxGCPauseMillis=200 (G1 target)\n- Monitor with Micrometer + Prometheus\n\nReal fix: "Found String concat in loop → 10x allocation rate → switched to StringBuilder"'
      },
      {
        id: 29,
        text: 'Spring Boot app leak connections dưới high load dù dùng HikariCP. Tại sao và fix thế nào?',
        level: 'advanced',
        answer: 'Common causes:\n1. Transactions never commit:\n   - Unchecked exceptions swallow rollback\n   - @Transactional missing or wrong propagation\n   \n2. Async methods misconfigured:\n   - @Async without @EnableAsync\n   - Wrong thread pool for transactions\n\n3. Long-running queries holding connections\n\nDetection:\nspring.datasource.hikari.leakDetectionThreshold=2000 (dev)\nspring.datasource.hikari.connectionTimeout=30000\nspring.datasource.hikari.maxLifetime=1800000\n\nMonitoring:\n- Micrometer + Prometheus: hikaricp_connections_active\n- Actuator: /actuator/metrics/hikaricp.connections\n\nFix checklist:\n✓ Always use try-with-resources for manual connections\n✓ Set proper transaction timeout\n✓ Use @Transactional(timeout = 30)\n✓ Monitor active connections in production\n✓ Set max pool size based on load testing'
      },
      {
        id: 30,
        text: 'Payment endpoint bị retry bởi gateway. Làm thế nào prevent double charging?',
        level: 'advanced',
        answer: 'Problem: Gateway retries → duplicate payment charges\n\nSolution: Idempotency Keys\n\nImplementation:\n1. Client sends unique idempotency key (UUID) in header\n2. Store key + outcome in DB with UNIQUE constraint\n3. Check before processing:\n   - Key exists + SUCCESS → return cached result\n   - Key exists + PROCESSING → wait/retry\n   - Key not exists → process payment\n\nSchema:\nCREATE TABLE idempotency_keys (\n  key VARCHAR(255) PRIMARY KEY,\n  status VARCHAR(20),\n  response TEXT,\n  created_at TIMESTAMP\n);\n\nCode:\n@Transactional\npublic PaymentResponse processPayment(String idempotencyKey, PaymentRequest req) {\n  var existing = repo.findByKey(idempotencyKey);\n  if (existing != null) return existing.getResponse();\n  \n  try (var lock = redisson.getLock("payment:" + idempotencyKey)) {\n    lock.lock(5, TimeUnit.SECONDS);\n    var result = paymentGateway.charge(req);\n    repo.save(new IdempotencyRecord(idempotencyKey, result));\n    return result;\n  }\n}\n\nBest practices:\n- TTL on keys (7-30 days)\n- Use Redlock only for critical section (low latency)\n- Return 409 Conflict if key exists with different payload'
      }
    ],
    'oracle': [
      {
        id: 1,
        text: 'VARCHAR2 vs CHAR - khác nhau gì?',
        level: 'basic',
        answer: '- VARCHAR2: Variable-length, chỉ lưu đúng số ký tự thực tế, max 4000 bytes\n- CHAR: Fixed-length, pad spaces nếu thiếu, max 2000 bytes\n- VARCHAR2 tiết kiệm space hơn\n- CHAR nhanh hơn cho fixed-length data (codes, flags)\n- Best practice: Dùng VARCHAR2 cho hầu hết cases'
      },
      {
        id: 2,
        text: 'Materialized View vs View - khác nhau gì?',
        level: 'intermediate',
        answer: 'View:\n- Virtual table, không lưu data\n- Query được execute mỗi lần access\n- Always up-to-date\n- Slower for complex queries\n\nMaterialized View:\n- Physical table, lưu data\n- Pre-computed results\n- Faster query performance\n- Cần refresh (ON COMMIT, ON DEMAND, hoặc scheduled)\n- Use case: Reporting, aggregations, data warehousing'
      },
      {
        id: 3,
        text: 'Làm thế nào để optimize slow query trong Oracle?',
        level: 'advanced',
        answer: '1. Analyze Explain Plan: Identify bottlenecks (full table scan, missing indexes)\n2. Add Indexes: B-tree, bitmap, function-based indexes\n3. Rewrite Query: Avoid SELECT *, use WHERE efficiently\n4. Use Hints: /*+ INDEX(table_name index_name) */\n5. Partitioning: Range, list, hash partitioning\n6. Statistics: ANALYZE TABLE, DBMS_STATS.GATHER_TABLE_STATS\n7. Avoid: Functions in WHERE, implicit conversions\n8. Use: Bind variables, bulk operations'
      },
      {
        id: 4,
        text: 'Oracle Data Guard - các loại standby database?',
        level: 'advanced',
        answer: '1. Physical Standby:\n- Exact block-for-block copy\n- Redo Apply (media recovery)\n- Read-only mode (Active Data Guard)\n- Best for disaster recovery\n\n2. Logical Standby:\n- SQL Apply (logical changes)\n- Open for read/write\n- Can have different schema\n- Good for reporting with modifications\n\n3. Snapshot Standby:\n- Fully updateable\n- For testing purposes\n- Can convert back to physical standby'
      },
      {
        id: 5,
        text: 'PL/SQL Collections - VARRAY vs Nested Table vs Associative Array?',
        level: 'intermediate',
        answer: 'VARRAY:\n- Fixed size, ordered\n- Dense (no gaps)\n- Can store in database\n- TYPE name_array IS VARRAY(10) OF VARCHAR2(50)\n\nNested Table:\n- Unlimited size, ordered\n- Can be sparse (gaps allowed)\n- Can store in database\n- TYPE name_table IS TABLE OF VARCHAR2(50)\n\nAssociative Array (Index-by):\n- Key-value pairs\n- Cannot store in database (PL/SQL only)\n- TYPE name_array IS TABLE OF VARCHAR2(50) INDEX BY PLS_INTEGER'
      },
      {
        id: 6,
        text: 'Oracle Partitioning strategies - khi nào dùng loại nào?',
        level: 'advanced',
        answer: '1. Range Partitioning:\n- Based on date ranges (monthly, yearly)\n- Use case: Time-series data, historical data\n- PARTITION BY RANGE (order_date)\n\n2. List Partitioning:\n- Based on discrete values\n- Use case: Regional data, status codes\n- PARTITION BY LIST (country)\n\n3. Hash Partitioning:\n- Even distribution\n- Use case: Large tables without natural ranges\n- PARTITION BY HASH (customer_id)\n\n4. Composite: Range-Hash, Range-List combinations'
      },
      {
        id: 7,
        text: 'Oracle Multitenant Architecture (CDB/PDB) - lợi ích?',
        level: 'advanced',
        answer: 'CDB (Container Database): Root container chứa metadata\nPDB (Pluggable Database): Isolated databases trong CDB\n\nLợi ích:\n- Consolidation: Multiple databases trên 1 instance\n- Resource sharing: Shared SGA, background processes\n- Easy cloning: CREATE PLUGGABLE DATABASE ... FROM ...\n- Patching: Patch CDB → all PDBs updated\n- Cost reduction: Fewer licenses needed\n- Fast provisioning: Plug/unplug PDBs\n\nUse case: SaaS applications, dev/test environments'
      },
      {
        id: 8,
        text: 'Oracle Indexes - B-tree vs Bitmap vs Function-based?',
        level: 'intermediate',
        answer: 'B-tree Index (Default):\n- High cardinality columns (unique/near-unique values)\n- Good for range scans, equality searches\n- Use case: Primary keys, foreign keys\n\nBitmap Index:\n- Low cardinality columns (few distinct values)\n- Excellent for data warehouses, read-heavy\n- Poor for OLTP (locking issues)\n- Use case: Gender, status flags, categories\n\nFunction-based Index:\n- Index on expressions/functions\n- CREATE INDEX idx ON table(UPPER(name))\n- Use case: Case-insensitive searches, computed values'
      },
      {
        id: 9,
        text: 'Oracle AWR (Automatic Workload Repository) - làm thế nào để analyze performance?',
        level: 'advanced',
        answer: 'AWR Report: Snapshot-based performance analysis\n\nKey sections to check:\n1. Top SQL: Identify expensive queries\n2. Wait Events: db file sequential read, log file sync\n3. Load Profile: Transactions/sec, logical reads\n4. Instance Efficiency: Buffer cache hit ratio, library cache hit ratio\n5. Time Model: DB CPU, DB time breakdown\n\nGenerate AWR:\n- @?/rdbms/admin/awrrpt.sql\n- DBMS_WORKLOAD_REPOSITORY.CREATE_SNAPSHOT()\n\nBest practice: Compare peak vs normal periods'
      },
      {
        id: 10,
        text: 'Oracle RMAN (Recovery Manager) - backup strategies?',
        level: 'intermediate',
        answer: 'Backup Types:\n- Full Backup: Entire database\n- Incremental Level 0: Base for incremental strategy\n- Incremental Level 1: Only changed blocks since last backup\n\nCommon Strategy:\n- Weekly Level 0 (Sunday)\n- Daily Level 1 (Mon-Sat)\n- Archive log backups every 4 hours\n\nRMAN Commands:\n- BACKUP DATABASE PLUS ARCHIVELOG;\n- BACKUP INCREMENTAL LEVEL 1 DATABASE;\n- RESTORE DATABASE; RECOVER DATABASE;\n\nBest practice: Test restores regularly'
      },
      {
        id: 11,
        text: 'Oracle BULK COLLECT và FORALL - performance optimization?',
        level: 'advanced',
        answer: 'BULK COLLECT:\n- Fetch multiple rows at once vào collection\n- Giảm context switches giữa SQL và PL/SQL engine\n- SELECT ... BULK COLLECT INTO collection LIMIT 1000;\n- Use LIMIT để tránh memory issues\n\nFORALL:\n- Bulk DML operations (INSERT, UPDATE, DELETE)\n- FORALL i IN collection.FIRST..collection.LAST\n- 10-100x faster than row-by-row processing\n\nBest practice: Combine BULK COLLECT + FORALL cho ETL processes'
      },
      {
        id: 12,
        text: 'Oracle Autonomous Transactions - use cases?',
        level: 'intermediate',
        answer: 'Definition: Independent transaction không bị ảnh hưởng bởi parent transaction\n\nDeclaration:\nPRAGMA AUTONOMOUS_TRANSACTION;\n\nUse cases:\n- Audit logging (commit log ngay cả khi main transaction rollback)\n- Error logging trong exception handlers\n- Sequence generation\n- Debugging/tracing\n\nImportant: Must explicitly COMMIT or ROLLBACK trước khi exit\nWarning: Có thể gây deadlocks nếu access cùng data với parent'
      },
      {
        id: 13,
        text: 'Oracle Real Application Clusters (RAC) - architecture và benefits?',
        level: 'advanced',
        answer: 'Architecture:\n- Multiple instances accessing single database\n- Shared storage (ASM, NFS, SAN)\n- Cache Fusion: Share data blocks across instances\n- Interconnect: High-speed network giữa nodes\n\nBenefits:\n- High availability: Node failure → automatic failover\n- Scalability: Add nodes để tăng capacity\n- Load balancing: Distribute connections\n\nChallenges:\n- Complex setup và maintenance\n- License cost\n- Network latency issues'
      },
      {
        id: 14,
        text: 'Oracle Analytic Functions - RANK vs DENSE_RANK vs ROW_NUMBER?',
        level: 'intermediate',
        answer: 'ROW_NUMBER():\n- Unique sequential number\n- Ties get different numbers\n- 1, 2, 3, 4, 5...\n\nRANK():\n- Same rank for ties\n- Gaps after ties\n- 1, 2, 2, 4, 5...\n\nDENSE_RANK():\n- Same rank for ties\n- No gaps\n- 1, 2, 2, 3, 4...\n\nExample: SELECT name, salary, RANK() OVER (ORDER BY salary DESC) FROM employees;'
      },
      {
        id: 15,
        text: 'Oracle Exadata - specialized features và use cases?',
        level: 'advanced',
        answer: 'Exadata: Engineered system - hardware + software optimization\n\nKey Features:\n- Smart Scan: Offload processing to storage cells\n- Hybrid Columnar Compression: 10-50x compression\n- Storage Indexes: Automatic in-memory indexes\n- Flash Cache: SSD caching layer\n- InfiniBand network: High-speed interconnect\n\nUse cases:\n- Data warehousing\n- OLTP with high concurrency\n- Mixed workloads\n\nTrade-off: Expensive but extreme performance'
      },
      {
        id: 16,
        text: 'Oracle Dynamic SQL - EXECUTE IMMEDIATE vs DBMS_SQL?',
        level: 'intermediate',
        answer: 'EXECUTE IMMEDIATE (Native Dynamic SQL):\n- Simpler syntax\n- Better performance\n- Single execution\n- EXECUTE IMMEDIATE \'SELECT * FROM \' || table_name INTO var;\n- Best for: Simple dynamic queries\n\nDBMS_SQL:\n- More control, complex scenarios\n- Reusable cursors\n- Dynamic column binding\n- Unknown number of columns at compile time\n- Best for: Complex dynamic queries, repeated execution\n\nSecurity: Both vulnerable to SQL injection - use bind variables!'
      },
      {
        id: 17,
        text: 'Oracle In-Memory Database - architecture và benefits?',
        level: 'advanced',
        answer: 'Oracle Database In-Memory:\n- Dual-format architecture (row + columnar)\n- Data stored in both formats simultaneously\n- Row format: OLTP operations\n- Columnar format: Analytics queries\n\nBenefits:\n- 100x faster analytics queries\n- No application changes needed\n- Automatic consistency between formats\n- SIMD vector processing\n\nConfiguration:\n- ALTER TABLE employees INMEMORY;\n- Set INMEMORY_SIZE parameter\n\nUse case: Real-time analytics on transactional data'
      },
      {
        id: 18,
        text: 'Oracle Flashback Technology - các loại và use cases?',
        level: 'intermediate',
        answer: '1. Flashback Query:\n- SELECT * FROM table AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL \'1\' HOUR);\n- View data at specific point in time\n\n2. Flashback Table:\n- FLASHBACK TABLE employees TO BEFORE DROP;\n- Recover dropped table from recycle bin\n\n3. Flashback Database:\n- Rewind entire database to past point\n- Faster than point-in-time recovery\n\n4. Flashback Transaction:\n- Undo specific transaction and dependencies\n\nRequirement: Undo retention, flashback logs enabled'
      },
      {
        id: 19,
        text: 'Oracle GoldenGate - replication architecture?',
        level: 'advanced',
        answer: 'GoldenGate: Real-time data replication and integration\n\nArchitecture:\n- Extract: Capture changes from source (redo logs)\n- Data Pump: Transfer trail files\n- Replicat: Apply changes to target\n- Trail files: Persistent queue\n\nFeatures:\n- Bidirectional replication\n- Heterogeneous support (Oracle to MySQL, etc.)\n- Conflict detection and resolution\n- Data transformation\n- Low latency (sub-second)\n\nUse cases:\n- Zero-downtime migration\n- Active-active replication\n- Real-time data integration'
      },
      {
        id: 20,
        text: 'Oracle SQL tuning - Explain Plan vs Autotrace vs SQL Monitor?',
        level: 'intermediate',
        answer: 'Explain Plan:\n- Shows estimated execution plan\n- EXPLAIN PLAN FOR SELECT...\n- SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY());\n- Doesn\'t execute query\n\nAutotrace:\n- Shows plan + statistics\n- SET AUTOTRACE ON\n- Executes query, shows actual stats\n\nSQL Monitor:\n- Real-time monitoring\n- SELECT * FROM TABLE(DBMS_SQLTUNE.REPORT_SQL_MONITOR());\n- Detailed execution statistics\n- Best for long-running queries\n\nBest practice: Use SQL Monitor for production issues'
      }
    ],
    'aws': [
      {
        id: 1,
        text: 'EC2 là gì? Các instance types phổ biến?',
        level: 'basic',
        answer: 'EC2 (Elastic Compute Cloud): Virtual servers in the cloud\n\nInstance Types:\n- t2/t3: General purpose, burstable (web servers, dev/test)\n- m5: Balanced compute/memory (app servers)\n- c5: Compute optimized (batch processing, HPC)\n- r5: Memory optimized (databases, caching)\n- p3: GPU instances (ML, deep learning)\n\nPricing: On-Demand, Reserved, Spot Instances'
      },
      {
        id: 2,
        text: 'Làm thế nào để deploy Spring Boot app lên AWS?',
        level: 'intermediate',
        answer: 'Option 1: EC2\n- Launch EC2 instance, install Java\n- Upload JAR file, run: java -jar app.jar\n- Setup systemd service for auto-restart\n\nOption 2: Elastic Beanstalk\n- Upload JAR/WAR file\n- Auto-handles deployment, scaling, monitoring\n\nOption 3: ECS/EKS (Container)\n- Dockerize app\n- Deploy to ECS (Fargate) or EKS (Kubernetes)\n\nBest Practice: Use Load Balancer, Auto Scaling, RDS for database'
      },
      {
        id: 3,
        text: 'AWS Lambda vs Fargate - khi nào dùng cái nào?',
        level: 'advanced',
        answer: 'Lambda (Serverless):\n- Event-driven, pay per invocation\n- Max 15 min execution time\n- Cold start latency\n- Best for: APIs, event processing, scheduled tasks\n\nFargate (Container):\n- Long-running processes\n- No time limit\n- More control over resources\n- Best for: Microservices, batch jobs, persistent apps\n\nTrade-offs: Lambda cheaper for sporadic workloads, Fargate better for consistent traffic'
      },
      {
        id: 4,
        text: 'AWS VPC - giải thích Subnets, Route Tables, Internet Gateway?',
        level: 'intermediate',
        answer: 'VPC (Virtual Private Cloud): Isolated network trong AWS\n\nSubnets:\n- Public subnet: Has route to Internet Gateway\n- Private subnet: No direct internet access\n- Use NAT Gateway for private subnet internet access\n\nRoute Tables: Define traffic routing rules\nInternet Gateway: Allows VPC to connect to internet\nSecurity Groups: Stateful firewall at instance level\nNACLs: Stateless firewall at subnet level'
      },
      {
        id: 5,
        text: 'AWS data lake architecture - services nào cần dùng?',
        level: 'advanced',
        answer: 'Storage Layer:\n- S3: Raw data storage (Bronze layer)\n- S3 Glacier: Long-term archival\n\nProcessing Layer:\n- AWS Glue: ETL, data catalog\n- EMR: Big data processing (Spark, Hadoop)\n- Lambda: Event-driven transformations\n\nAnalytics Layer:\n- Athena: SQL queries on S3\n- Redshift: Data warehouse\n- QuickSight: BI and visualization\n\nOrchestration: Step Functions, Airflow on MWAA'
      },
      {
        id: 6,
        text: 'AWS RDS vs DynamoDB - khi nào dùng cái nào?',
        level: 'intermediate',
        answer: 'RDS (Relational):\n- SQL databases (MySQL, PostgreSQL, Oracle)\n- ACID transactions\n- Complex queries, joins\n- Vertical scaling\n- Use case: Traditional apps, complex relationships\n\nDynamoDB (NoSQL):\n- Key-value, document store\n- Single-digit millisecond latency\n- Horizontal scaling\n- Serverless option\n- Use case: High-traffic apps, gaming, IoT, mobile backends'
      },
      {
        id: 7,
        text: 'AWS security best practices - IAM, KMS, Secrets Manager?',
        level: 'advanced',
        answer: 'IAM (Identity & Access Management):\n- Least privilege principle\n- Use roles instead of access keys\n- Enable MFA for root and privileged users\n- Regular access reviews\n\nKMS (Key Management Service):\n- Encrypt data at rest (S3, EBS, RDS)\n- Customer-managed keys (CMK)\n- Automatic key rotation\n\nSecrets Manager:\n- Store DB credentials, API keys\n- Automatic rotation\n- Integration with RDS, Lambda'
      },
      {
        id: 8,
        text: 'AWS CloudFormation vs Terraform - khác nhau gì?',
        level: 'intermediate',
        answer: 'CloudFormation:\n- AWS-native, free\n- JSON/YAML templates\n- Deep AWS integration\n- Automatic rollback on failure\n- AWS-only\n\nTerraform:\n- Multi-cloud (AWS, Azure, GCP)\n- HCL language\n- State management\n- Larger community, more modules\n- Better for hybrid/multi-cloud\n\nBest practice: CloudFormation cho AWS-only, Terraform cho multi-cloud'
      },
      {
        id: 9,
        text: 'AWS Step Functions - khi nào dùng thay vì Lambda?',
        level: 'advanced',
        answer: 'Step Functions: Orchestrate multiple Lambda functions và AWS services\n\nUse cases:\n- Complex workflows với branching, parallel execution\n- Long-running processes (>15 min)\n- Need retry logic, error handling\n- Visual workflow monitoring\n- State management across steps\n\nExample: Order processing (validate → charge → ship → notify)\n\nvs Lambda alone: Lambda tốt cho single-purpose functions, Step Functions cho orchestration'
      },
      {
        id: 10,
        text: 'AWS monitoring - CloudWatch vs X-Ray?',
        level: 'intermediate',
        answer: 'CloudWatch:\n- Metrics, logs, alarms\n- Infrastructure monitoring\n- Custom metrics\n- Dashboards\n- Use case: CPU usage, disk I/O, application logs\n\nX-Ray:\n- Distributed tracing\n- Request flow visualization\n- Performance bottleneck identification\n- Service map\n- Use case: Microservices debugging, latency analysis\n\nBest practice: Use both - CloudWatch cho metrics, X-Ray cho tracing'
      },
      {
        id: 11,
        text: 'AWS ECS vs EKS - khi nào dùng cái nào?',
        level: 'advanced',
        answer: 'ECS (Elastic Container Service):\n- AWS-native, simpler setup\n- Task definitions, services\n- Tight AWS integration\n- Fargate support (serverless containers)\n- Best for: AWS-only, simpler deployments\n\nEKS (Elastic Kubernetes Service):\n- Managed Kubernetes\n- Portable across clouds\n- Rich ecosystem (Helm, operators)\n- More complex, steeper learning curve\n- Best for: Multi-cloud, complex orchestration, existing K8s expertise\n\nCost: ECS cheaper, EKS control plane costs extra'
      },
      {
        id: 12,
        text: 'AWS S3 storage classes - khi nào dùng loại nào?',
        level: 'intermediate',
        answer: 'S3 Standard: Frequent access, low latency\nS3 Intelligent-Tiering: Auto-move between tiers based on access\nS3 Standard-IA: Infrequent access, lower cost\nS3 One Zone-IA: Single AZ, cheaper, non-critical data\nS3 Glacier Instant: Archive, millisecond retrieval\nS3 Glacier Flexible: Minutes-hours retrieval\nS3 Glacier Deep Archive: Lowest cost, 12h retrieval\n\nLifecycle policies: Auto-transition objects between classes\nBest practice: Use Intelligent-Tiering cho unknown access patterns'
      },
      {
        id: 13,
        text: 'AWS EventBridge vs SNS vs SQS - event-driven architecture?',
        level: 'advanced',
        answer: 'EventBridge:\n- Event bus, routing rules\n- Schema registry\n- 100+ AWS service integrations\n- Content-based filtering\n- Use case: Complex event routing, SaaS integrations\n\nSNS (Simple Notification Service):\n- Pub/sub messaging\n- Fan-out pattern\n- Push-based\n- Use case: Notifications, multiple subscribers\n\nSQS (Simple Queue Service):\n- Message queue\n- Pull-based\n- Decoupling, buffering\n- Use case: Work queues, async processing'
      },
      {
        id: 14,
        text: 'AWS Cost Optimization strategies?',
        level: 'intermediate',
        answer: '1. Right-sizing:\n- Use AWS Compute Optimizer\n- Downsize over-provisioned instances\n\n2. Reserved Instances/Savings Plans:\n- 1-3 year commitments, 30-70% savings\n\n3. Spot Instances:\n- Up to 90% discount\n- For fault-tolerant workloads\n\n4. Auto Scaling:\n- Scale down during off-peak\n\n5. S3 Lifecycle:\n- Move to cheaper storage classes\n\n6. Delete unused resources:\n- Unattached EBS, old snapshots, idle load balancers'
      },
      {
        id: 15,
        text: 'AWS Well-Architected Framework - 6 pillars?',
        level: 'advanced',
        answer: '1. Operational Excellence:\n- IaC, monitoring, continuous improvement\n\n2. Security:\n- IAM, encryption, detective controls\n\n3. Reliability:\n- Multi-AZ, backup/recovery, auto-scaling\n\n4. Performance Efficiency:\n- Right resources, monitoring, experimentation\n\n5. Cost Optimization:\n- Right-sizing, reserved capacity, usage tracking\n\n6. Sustainability:\n- Minimize environmental impact, efficient resources\n\nTool: AWS Well-Architected Tool for reviews'
      },
      {
        id: 16,
        text: 'AWS Kinesis vs SQS vs SNS - streaming data architecture?',
        level: 'intermediate',
        answer: 'Kinesis:\n- Real-time streaming data\n- Multiple consumers read same data\n- Ordered within shard\n- Data retention (24h-365 days)\n- Use case: Log aggregation, real-time analytics, IoT\n\nSQS:\n- Message queue, pull-based\n- Each message consumed once\n- No ordering guarantee (standard)\n- Use case: Decoupling, work queues\n\nSNS:\n- Pub/sub, push-based\n- Fan-out to multiple subscribers\n- Use case: Notifications, alerts'
      },
      {
        id: 17,
        text: 'AWS disaster recovery strategies - RPO/RTO trade-offs?',
        level: 'advanced',
        answer: '1. Backup & Restore (Cheapest):\n- RPO: Hours, RTO: Hours-Days\n- S3 backups, restore when needed\n\n2. Pilot Light:\n- RPO: Minutes, RTO: Hours\n- Core services running, scale up on disaster\n\n3. Warm Standby:\n- RPO: Seconds, RTO: Minutes\n- Scaled-down version running, scale up quickly\n\n4. Multi-Site Active/Active (Most expensive):\n- RPO: Near-zero, RTO: Near-zero\n- Full capacity in multiple regions\n\nTools: Route 53 health checks, CloudFormation, AWS Backup'
      },
      {
        id: 18,
        text: 'AWS Auto Scaling - target tracking vs step scaling?',
        level: 'intermediate',
        answer: 'Target Tracking:\n- Maintain specific metric value\n- Example: Keep CPU at 50%\n- Automatic scale up/down\n- Simpler, recommended for most cases\n\nStep Scaling:\n- Scale based on alarm thresholds\n- Different actions for different ranges\n- More control, complex setup\n- Example: +2 instances if CPU > 70%, +5 if > 90%\n\nScheduled Scaling:\n- Predictable load patterns\n- Scale at specific times\n\nBest practice: Start with target tracking'
      },
      {
        id: 19,
        text: 'AWS networking - VPC Peering vs Transit Gateway vs PrivateLink?',
        level: 'advanced',
        answer: 'VPC Peering:\n- 1-to-1 connection between VPCs\n- Non-transitive (no hub-and-spoke)\n- No single point of failure\n- Best for: Few VPCs, simple topology\n\nTransit Gateway:\n- Hub-and-spoke, connects multiple VPCs\n- Transitive routing\n- Centralized management\n- Best for: Many VPCs, complex networks\n\nPrivateLink:\n- Private connectivity to services\n- No internet gateway needed\n- Best for: SaaS integration, service exposure'
      },
      {
        id: 20,
        text: 'AWS database migration - DMS strategies?',
        level: 'intermediate',
        answer: 'AWS DMS (Database Migration Service):\n- Migrate databases with minimal downtime\n- Homogeneous (Oracle to Oracle) or heterogeneous (Oracle to PostgreSQL)\n\nMigration Types:\n- Full load: One-time migration\n- Full load + CDC: Continuous replication\n- CDC only: Ongoing replication\n\nProcess:\n1. Create replication instance\n2. Define source/target endpoints\n3. Create migration task\n4. Monitor and validate\n\nBest practice: Use SCT (Schema Conversion Tool) for heterogeneous migrations'
      }
    ],
    'angular': [
      {
        id: 1,
        text: 'Angular là gì? Khác gì React/Vue?',
        level: 'basic',
        answer: 'Angular: Full-featured framework by Google\n\nĐặc điểm:\n- TypeScript-based\n- Component-based architecture\n- Two-way data binding\n- Dependency injection\n- RxJS for reactive programming\n- CLI tool mạnh mẽ\n\nvs React: Angular = framework, React = library\nvs Vue: Angular phức tạp hơn, learning curve cao hơn'
      },
      {
        id: 2,
        text: 'Angular Services và Dependency Injection?',
        level: 'intermediate',
        answer: 'Services: Singleton classes để share data/logic giữa components\n\nDependency Injection:\n- Design pattern để inject dependencies vào class\n- Angular tự động inject services vào constructor\n- @Injectable() decorator đánh dấu service\n- providedIn: \'root\' → singleton across app\n\nExample:\n@Injectable({ providedIn: \'root\' })\nexport class DataService { }\n\nconstructor(private dataService: DataService) { }'
      },
      {
        id: 3,
        text: 'Angular Signals vs RxJS - khi nào dùng cái nào?',
        level: 'advanced',
        answer: 'Signals (Angular 16+):\n- Synchronous, fine-grained reactivity\n- No glitches (computed values update once)\n- Simpler for UI state\n- signal(), computed(), effect()\n- Best for: Local component state, derived values\n\nRxJS:\n- Asynchronous streams\n- Rich operators (debounce, retry, merge)\n- Best for: HTTP calls, events, complex async flows\n\nTrend 2026: Signals for state, RxJS for async operations'
      },
      {
        id: 4,
        text: 'Angular Change Detection - OnPush vs Default strategy?',
        level: 'intermediate',
        answer: 'Default Strategy:\n- Check all components on every event\n- Performance issues with large apps\n\nOnPush Strategy:\n- Only check when:\n  • @Input reference changes\n  • Event from component/children\n  • Async pipe emits\n  • Manual markForCheck()\n- Much better performance\n- Requires immutable data patterns\n\nBest practice: Use OnPush everywhere possible'
      },
      {
        id: 5,
        text: 'Angular architecture - Composition vs Inheritance?',
        level: 'advanced',
        answer: 'Inheritance (Anti-pattern):\n- BaseComponent với shared logic\n- Tight coupling, hard to test\n- "God class" problem\n\nComposition (Best practice):\n- Use Directives for reusable behaviors\n- Use Services for shared logic\n- Directive Composition API (Angular 15+)\n- Decoupled, testable, flexible\n\nExample: SearchableDirective thay vì BaseSearchComponent\nRule: "has-a" relationship > "is-a" relationship'
      },
      {
        id: 6,
        text: 'Angular RxJS operators - combineLatest vs forkJoin vs merge?',
        level: 'intermediate',
        answer: 'combineLatest:\n- Emits when ANY source emits (after all emit once)\n- Stays active, emits latest from all\n- Use case: Multi-source dashboard, live updates\n\nforkJoin:\n- Emits once when ALL complete\n- Like Promise.all()\n- Use case: Parallel API calls, wait for all\n\nmerge:\n- Emits from any source as they emit\n- Flattens multiple streams\n- Use case: Multiple event sources'
      },
      {
        id: 7,
        text: 'Angular performance optimization - lazy loading, preloading strategies?',
        level: 'advanced',
        answer: 'Lazy Loading:\n- Load modules on-demand\n- loadChildren in routes\n- Reduces initial bundle size\n\nPreloading Strategies:\n- NoPreloading: Default, no preload\n- PreloadAllModules: Preload all lazy modules\n- Custom: Preload based on conditions\n\nOther optimizations:\n- OnPush change detection\n- TrackBy in *ngFor\n- Pure pipes\n- Virtual scrolling (CDK)\n- Standalone components (Angular 14+)'
      },
      {
        id: 8,
        text: 'Angular Forms - Reactive vs Template-driven?',
        level: 'intermediate',
        answer: 'Reactive Forms:\n- FormControl, FormGroup in component\n- More control, testable\n- Synchronous access to data model\n- Better for complex forms\n- Validators in code\n\nTemplate-driven:\n- ngModel, directives in template\n- Simpler for basic forms\n- Asynchronous\n- Less testable\n\nBest practice: Use Reactive Forms for enterprise apps'
      },
      {
        id: 9,
        text: 'Angular state management - NgRx vs Signals vs Services?',
        level: 'advanced',
        answer: 'Services + Signals (2026 recommended):\n- Simple, lightweight\n- providedIn: \'root\' for global state\n- Signals for reactivity\n- Good for most apps\n\nNgRx (Redux pattern):\n- Actions, Reducers, Effects, Selectors\n- Great DevTools\n- Heavy boilerplate\n- Best for: Large teams, complex state, time-travel debugging\n\nTrade-off: Boilerplate vs Control'
      },
      {
        id: 10,
        text: 'Angular Guards - CanActivate, CanDeactivate, Resolve?',
        level: 'intermediate',
        answer: 'CanActivate:\n- Check before entering route\n- Use case: Authentication, authorization\n\nCanDeactivate:\n- Check before leaving route\n- Use case: Unsaved changes warning\n\nResolve:\n- Pre-fetch data before route activation\n- Use case: Load data before showing component\n\nOthers: CanLoad (lazy modules), CanActivateChild\nAngular 15+: Functional guards (simpler syntax)'
      },
      {
        id: 11,
        text: 'Angular DI Resolution Modifiers - @Self, @Host, @Optional, @SkipSelf?',
        level: 'advanced',
        answer: '@Self:\n- Only look at current injector\n- Don\'t search parent hierarchy\n- Use case: Directive must use its own element\'s provider\n\n@Host:\n- Search up to host component\n- Stop at component boundary\n- Use case: Directive needs service from host component\n\n@Optional:\n- Don\'t throw error if not found, returns null\n- Use case: Optional dependencies\n\n@SkipSelf:\n- Skip current injector, start from parent\n- Use case: Avoid circular dependencies'
      },
      {
        id: 12,
        text: 'Angular Pipes - Pure vs Impure?',
        level: 'intermediate',
        answer: 'Pure Pipes (Default):\n- Only execute when input reference changes\n- Cached results, better performance\n- Example: date, currency, uppercase\n\nImpure Pipes:\n- Execute on every change detection cycle\n- No caching, performance cost\n- @Pipe({ name: \'filter\', pure: false })\n- Use case: Filtering arrays, async operations\n\nWarning: Avoid impure pipes in large lists\nBest practice: Use pure pipes + immutable data patterns'
      },
      {
        id: 13,
        text: 'Angular NgZone - khi nào cần runOutsideAngular?',
        level: 'advanced',
        answer: 'NgZone: Angular\'s change detection trigger mechanism\n\nrunOutsideAngular() use cases:\n- High-frequency events (scroll, mousemove)\n- setInterval for background tasks\n- Third-party libraries triggering many events\n- Canvas animations, WebSocket streams\n\nPattern:\nngZone.runOutsideAngular(() => {\n  // Heavy work here\n  if (needsUIUpdate) {\n    ngZone.run(() => this.data = newData);\n  }\n});\n\nBenefit: Avoid unnecessary change detection cycles'
      },
      {
        id: 14,
        text: 'Angular Standalone Components (Angular 14+) - lợi ích?',
        level: 'intermediate',
        answer: 'Traditional (NgModule-based):\n- Declare components in @NgModule\n- Import/export modules, more boilerplate\n\nStandalone Components:\n- @Component({ standalone: true, imports: [...] })\n- No NgModule needed\n- Direct imports in component\n- Simpler, more explicit\n- Better tree-shaking\n- Easier lazy loading\n\nMigration: Angular 15+ provides automatic migration schematics\nFuture: NgModules becoming optional (Angular 19+)'
      },
      {
        id: 15,
        text: 'Angular RxJS flattening operators - switchMap vs mergeMap vs concatMap vs exhaustMap?',
        level: 'advanced',
        answer: 'switchMap:\n- Cancel previous, switch to new\n- Use case: Search typeahead, autocomplete\n\nmergeMap:\n- Run all in parallel, merge results\n- Use case: Independent API calls\n\nconcatMap:\n- Queue and execute in order\n- Wait for previous to complete\n- Use case: Sequential operations (upload then process)\n\nexhaustMap:\n- Ignore new until current completes\n- Use case: Prevent button spam, login requests\n\nRule: switchMap for latest, exhaustMap for first, concatMap for order, mergeMap for parallel'
      },
      {
        id: 16,
        text: 'Angular Content Projection - ng-content, ng-template, ng-container?',
        level: 'intermediate',
        answer: 'ng-content:\n- Project content from parent to child\n- Single slot: <ng-content></ng-content>\n- Multiple slots: <ng-content select=".header"></ng-content>\n- Use case: Reusable card, modal components\n\nng-template:\n- Define template without rendering\n- Use with structural directives, TemplateRef\n- Use case: Custom structural directives, dynamic templates\n\nng-container:\n- Grouping element, không tạo DOM node\n- Use case: Multiple structural directives, avoid extra divs'
      },
      {
        id: 17,
        text: 'Angular SSR (Server-Side Rendering) với Angular Universal - benefits và challenges?',
        level: 'advanced',
        answer: 'Benefits:\n- Better SEO (search engines see full content)\n- Faster initial page load (FCP, LCP)\n- Social media preview (Open Graph)\n- Better performance on slow devices\n\nChallenges:\n- No window/document on server\n- Need to handle browser-only APIs\n- State transfer between server/client\n- Increased server load\n\nImplementation:\n- ng add @nguniversal/express-engine\n- Use isPlatformBrowser/isPlatformServer\n- TransferState for data sharing'
      },
      {
        id: 18,
        text: 'Angular HTTP Interceptors - use cases và implementation?',
        level: 'intermediate',
        answer: 'Use cases:\n- Add authentication tokens to headers\n- Global error handling\n- Logging/monitoring requests\n- Caching responses\n- Request/response transformation\n- Loading indicators\n\nImplementation:\nexport class AuthInterceptor implements HttpInterceptor {\n  intercept(req: HttpRequest, next: HttpHandler) {\n    const cloned = req.clone({\n      headers: req.headers.set(\'Authorization\', token)\n    });\n    return next.handle(cloned);\n  }\n}'
      },
      {
        id: 19,
        text: 'Angular Custom Validators - sync vs async validators?',
        level: 'advanced',
        answer: 'Sync Validators:\n- Return ValidationErrors | null immediately\n- Use case: Format checks, required fields, pattern matching\n- Example: Email format, password strength\n\nAsync Validators:\n- Return Observable<ValidationErrors | null>\n- Use case: Backend validation (username availability, email exists)\n- Debounce để avoid excessive API calls\n- Run after sync validators pass\n\nImplementation:\nexport class UsernameValidator {\n  static checkAvailability(http: HttpClient): AsyncValidatorFn {\n    return (control) => http.get(...).pipe(\n      map(exists => exists ? {taken: true} : null)\n    );\n  }\n}'
      },
      {
        id: 20,
        text: 'Angular Testing - TestBed, ComponentFixture, DebugElement?',
        level: 'intermediate',
        answer: 'TestBed:\n- Configure testing module\n- TestBed.configureTestingModule({ declarations, imports, providers })\n- Create component instances for testing\n\nComponentFixture:\n- Wrapper around component instance\n- fixture.componentInstance: Access component properties\n- fixture.detectChanges(): Trigger change detection\n- fixture.nativeElement: Access DOM\n\nDebugElement:\n- Platform-independent abstraction of DOM\n- fixture.debugElement.query(By.css(\'.button\'))\n- Better for testing across platforms'
      },
      {
        id: 21,
        text: 'Angular RxJS expand operator - recursive API calls?',
        level: 'advanced',
        answer: 'expand operator: Recursive observable emissions\n\nUse case: Infinite scroll pagination\nthis.api.getPage(1).pipe(\n  expand((res, index) => {\n    return (res.hasNext && index < 3)\n      ? this.api.getPage(index + 2)\n      : EMPTY;\n  }),\n  reduce((acc, res) => [...acc, ...res.items], [])\n).subscribe(allData => this.list = allData);\n\nKey points:\n- Calls itself based on previous result\n- Use EMPTY to stop recursion\n- Combine with take() or condition to prevent infinite loops'
      },
      {
        id: 22,
        text: 'Angular lifecycle hooks - execution order?',
        level: 'intermediate',
        answer: 'Execution order:\n1. constructor: DI, basic initialization\n2. ngOnChanges: When @Input changes (before ngOnInit)\n3. ngOnInit: Component initialization (once)\n4. ngDoCheck: Custom change detection\n5. ngAfterContentInit: After ng-content projection (once)\n6. ngAfterContentChecked: After content checked\n7. ngAfterViewInit: After view initialized (once)\n8. ngAfterViewChecked: After view checked\n9. ngOnDestroy: Cleanup before destruction\n\nBest practices:\n- API calls in ngOnInit, not constructor\n- Unsubscribe in ngOnDestroy'
      },
      {
        id: 23,
        text: 'Angular Signals effect() - side effects management?',
        level: 'advanced',
        answer: 'effect(): Run side effects when signals change\n\nExample:\ncount = signal(0);\n\nconstructor() {\n  effect(() => {\n    console.log(\'Count changed:\', this.count());\n    // Auto-tracks count signal\n  });\n}\n\nKey features:\n- Automatic dependency tracking\n- Runs in injection context\n- Cleanup on destroy\n- Use allowSignalWrites: true for writing signals inside effect\n\nUse cases: Logging, localStorage sync, analytics'
      },
      {
        id: 24,
        text: 'Angular ViewChild vs ContentChild?',
        level: 'intermediate',
        answer: '@ViewChild:\n- Query elements in component\'s own template\n- Available in ngAfterViewInit\n- @ViewChild(\'myButton\') button: ElementRef;\n- Use case: Access child components, directives, template refs\n\n@ContentChild:\n- Query elements projected via ng-content\n- Available in ngAfterContentInit\n- @ContentChild(CardHeader) header: CardHeader;\n- Use case: Access projected content\n\nMultiple queries: @ViewChildren, @ContentChildren (returns QueryList)'
      },
      {
        id: 25,
        text: 'Angular performance - Virtual scrolling với CDK?',
        level: 'advanced',
        answer: 'Problem: Rendering 10,000+ items kills performance\n\nSolution: Virtual Scrolling\n- Only render visible items + buffer\n- Recycle DOM elements\n\nImplementation:\n<cdk-virtual-scroll-viewport itemSize="50" class="viewport">\n  <div *cdkVirtualFor="let item of items">\n    {{ item.name }}\n  </div>\n</cdk-virtual-scroll-viewport>\n\nBenefits:\n- Constant rendering time regardless of list size\n- Smooth scrolling\n- Lower memory usage\n\nPackage: @angular/cdk/scrolling'
      }
    ],
    'kafka': [
      {
        id: 1,
        text: 'Kafka khác gì traditional message queues?',
        level: 'basic',
        answer: 'Kafka: Distributed log, persistent, replay messages, high throughput. Traditional MQ: Delete after consume, lower throughput, simpler.'
      },
      {
        id: 2,
        text: 'Kafka broker goes down - what happens?',
        level: 'intermediate',
        answer: 'Leader election for affected partitions. Replicas take over. Producers/consumers reconnect. ISR (In-Sync Replicas) ensure no data loss.'
      },
      {
        id: 3,
        text: 'Kafka Partitions explained?',
        level: 'intermediate',
        answer: 'Parallel processing units. Messages with same key → same partition → order guaranteed. More partitions = more parallelism. Partition = ordered, immutable log.'
      },
      {
        id: 4,
        text: 'Consumer Groups trong Kafka?',
        level: 'intermediate',
        answer: 'Multiple consumers share workload. Each partition consumed by 1 consumer in group. Rebalancing when consumers join/leave. Enables horizontal scaling.'
      },
      {
        id: 5,
        text: 'Kafka Producer Acknowledgement (acks)?',
        level: 'advanced',
        answer: 'acks=0: No wait (fast, risky). acks=1: Leader confirms (balanced). acks=all: All replicas confirm (slow, safe). Trade-off: throughput vs durability.'
      },
      {
        id: 6,
        text: 'Kafka vs RabbitMQ - when to use?',
        level: 'advanced',
        answer: 'Kafka: High throughput, event streaming, replay, analytics. RabbitMQ: Complex routing, priority queues, request-reply, lower latency for small messages.'
      },
      {
        id: 7,
        text: 'Kafka Offset Management?',
        level: 'intermediate',
        answer: 'Tracks consumer position. Auto-commit vs manual commit. __consumer_offsets topic stores offsets. Reset: earliest, latest, specific offset.'
      },
      {
        id: 8,
        text: 'Kafka Replication Factor?',
        level: 'intermediate',
        answer: 'Number of copies per partition. RF=3 recommended. Leader handles reads/writes, followers replicate. ISR = replicas in sync with leader.'
      },
      {
        id: 9,
        text: 'Kafka Streams vs Kafka Connect?',
        level: 'advanced',
        answer: 'Streams: Process data in Kafka (transformations, aggregations). Connect: Move data in/out Kafka (sources/sinks). Different use cases.'
      },
      {
        id: 10,
        text: 'Handle Kafka lag in production?',
        level: 'advanced',
        answer: 'Monitor lag metrics. Scale consumers (add instances). Increase partitions. Optimize consumer processing. Check for slow consumers, network issues.'
      }
    ],
    'java': [
      {
        id: 1,
        text: 'Java 21 Virtual Threads là gì?',
        level: 'advanced',
        answer: 'Lightweight threads managed by JVM (Project Loom). Millions of threads possible. Better for I/O-bound tasks. Use Executors.newVirtualThreadPerTaskExecutor().'
      },
      {
        id: 2,
        text: 'Virtual Threads vs Platform Threads?',
        level: 'advanced',
        answer: 'Virtual: Cheap, millions possible, JVM-managed. Platform: OS threads, expensive, limited. Virtual threads mounted on platform threads (carrier threads).'
      },
      {
        id: 3,
        text: 'Pattern Matching for Switch (Java 21)?',
        level: 'intermediate',
        answer: 'Switch on types, not just primitives. Case patterns with guards. Exhaustiveness checking. More expressive than instanceof chains.'
      },
      {
        id: 4,
        text: 'Record Patterns (Java 21)?',
        level: 'intermediate',
        answer: 'Destructure records in pattern matching. Extract components directly. Nested patterns supported. Cleaner code for data extraction.'
      },
      {
        id: 5,
        text: 'Sequenced Collections (Java 21)?',
        level: 'intermediate',
        answer: 'New interfaces: SequencedCollection, SequencedSet, SequencedMap. Methods: addFirst(), addLast(), reversed(). Unified API for ordered collections.'
      },
      {
        id: 6,
        text: 'When NOT to use Virtual Threads?',
        level: 'advanced',
        answer: 'CPU-bound tasks (no benefit). Pinning issues (synchronized blocks, native calls). Thread-local heavy usage. Use platform threads for CPU work.'
      },
      {
        id: 7,
        text: 'Scoped Values (Java 21)?',
        level: 'advanced',
        answer: 'Alternative to ThreadLocal. Immutable, bounded lifetime. Better for virtual threads. Share data across call stack without parameters.'
      },
      {
        id: 8,
        text: 'String Templates (Preview Java 21)?',
        level: 'intermediate',
        answer: 'Type-safe string interpolation. STR."Hello \\{name}". Prevents injection attacks. Compile-time validation. Better than concatenation.'
      }
    ]
  }
  
  const questions = questionsData[topic] || []
  
  return Response.json(questions)
}
