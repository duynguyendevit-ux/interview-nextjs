export default function SpringEventPublisherBlog() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Best Practices for Using ApplicationEventPublisher in Spring Monolithic Applications
        </h1>
        
        <div className="text-gray-600 mb-8">
          <time>April 16, 2026</time> • <span>Spring Boot</span>
        </div>

        <section className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
          <p className="mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded">ApplicationEventPublisher</code> is a powerful Spring Framework component that enables event-driven architecture within your application. 
            It allows different parts of your application to communicate through events without tight coupling, making your code more maintainable and testable.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">When to Use Event-Driven Architecture in Monoliths</h2>
          <p className="mb-4">Event-driven patterns are beneficial when:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>You need to decouple business logic across different modules</li>
            <li>Multiple components need to react to the same action</li>
            <li>You want to implement cross-cutting concerns (audit logging, notifications)</li>
            <li>You need to maintain transaction boundaries while triggering side effects</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Synchronous vs Asynchronous Event Handling</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Synchronous Events (Default)</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`// Event class
public class OrderCreatedEvent {
    private final Long orderId;
    private final String customerEmail;
    
    public OrderCreatedEvent(Long orderId, String customerEmail) {
        this.orderId = orderId;
        this.customerEmail = customerEmail;
    }
    // getters...
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
}`}
          </pre>

          <h3 className="text-xl font-semibold mt-6 mb-3">Asynchronous Events</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`// Enable async support
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
}`}
          </pre>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Transaction Boundaries and @TransactionalEventListener</h2>
          <p className="mb-4">
            One of the most common pitfalls is publishing events before the transaction commits. 
            Use <code className="bg-gray-100 px-2 py-1 rounded">@TransactionalEventListener</code> to control when events are processed:
          </p>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`@Component
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
}`}
          </pre>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Performance Considerations and Common Pitfalls</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">1. Too Many Synchronous Listeners</h3>
          <p className="mb-4">
            <strong>Problem:</strong> Each synchronous listener blocks the main thread, increasing response time.
          </p>
          <p className="mb-4">
            <strong>Solution:</strong> Use <code className="bg-gray-100 px-2 py-1 rounded">@Async</code> for non-critical operations:
          </p>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`// BAD: All listeners run synchronously
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
public void updateAnalytics(OrderCreatedEvent event) { /* non-critical, async */ }`}
          </pre>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Event Storms</h3>
          <p className="mb-4">
            <strong>Problem:</strong> Events triggering other events can create cascading chains or infinite loops.
          </p>
          <p className="mb-4">
            <strong>Solution:</strong> Use conditional listeners and avoid circular dependencies:
          </p>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`// Use conditions to filter events
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
}`}
          </pre>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Memory Overhead</h3>
          <p className="mb-4">
            <strong>Problem:</strong> Creating too many event objects can pressure the garbage collector.
          </p>
          <p className="mb-4">
            <strong>Solution:</strong> Keep event objects lightweight and consider object pooling for high-frequency events:
          </p>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`// BAD: Heavy event object
public class OrderEvent {
    private Order order; // Contains entire order with all relations
    private Customer customer; // Full customer object
    private List<Product> products; // All products
}

// GOOD: Lightweight event with IDs only
public class OrderEvent {
    private final Long orderId;
    private final Long customerId;
    // Listeners fetch full objects only if needed
}`}
          </pre>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Monitoring and Debugging</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
{`@Component
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
}`}
          </pre>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Best Practices Summary</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Use events for cross-cutting concerns</strong> - audit logging, notifications, analytics</li>
            <li><strong>Keep events lightweight</strong> - pass IDs, not full objects</li>
            <li><strong>Use @Async for non-critical operations</strong> - emails, notifications, analytics</li>
            <li><strong>Respect transaction boundaries</strong> - use @TransactionalEventListener appropriately</li>
            <li><strong>Avoid event storms</strong> - use conditions, batch processing, and avoid circular dependencies</li>
            <li><strong>Monitor event processing</strong> - track metrics and performance</li>
            <li><strong>Don't overuse events</strong> - direct method calls are simpler for core business logic</li>
            <li><strong>Consider message queues</strong> - for high-volume scenarios, use Kafka or RabbitMQ instead</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Conclusion</h2>
          <p className="mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded">ApplicationEventPublisher</code> is a powerful tool for building maintainable monolithic applications, 
            but it requires careful consideration of performance, transaction boundaries, and event flow. 
            By following these best practices, you can leverage event-driven patterns effectively without introducing complexity or performance issues.
          </p>
          <p className="mb-4">
            Remember: events are great for decoupling, but they add indirection. Use them judiciously for cross-cutting concerns 
            and side effects, but keep your core business logic straightforward with direct method calls.
          </p>
        </section>
      </article>
    </div>
  );
}
