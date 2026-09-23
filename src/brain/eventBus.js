/**
 * src/brain/eventBus.js
 * Asynchronous, subscriber-safe cross-hive publish/subscribe event broker.
 * Part of Requirement R1 & R7 (Beehive Architecture).
 */

export const SUPPORTED_EVENTS = [
  'post:created',
  'job:published',
  'event:announced',
  'application:status',
  'announcement:broadcast',
  'feature:toggled',
  'user:connected',
  'hive:error',
  'audit:logged'
];

class EventBus {
  constructor() {
    this.listeners = new Map();
    this.throughputLog = []; // array of timestamps (ms)
    this.eventHistory = [];  // bounded ring-buffer (max 100)
    this.totalEventCount = 0;
  }

  /**
   * Publish an event to all registered subscribers.
   * Subscriber-safe: listeners are executed defensively with error isolation.
   */
  emit(event, payload = null) {
    if (!event || typeof event !== 'string') {
      console.warn('[EventBus] emit called with invalid event name:', event);
      return false;
    }

    const now = Date.now();
    const isoTimestamp = new Date(now).toISOString();

    // 1. Throughput tracking
    this.throughputLog.push(now);
    this.totalEventCount++;

    // Prune entries older than 60 seconds
    const cutoff = now - 60000;
    while (this.throughputLog.length > 0 && this.throughputLog[0] < cutoff) {
      this.throughputLog.shift();
    }

    // 2. Event History recording
    this.eventHistory.push({
      id: `evt_${now}_${Math.random().toString(36).substring(2, 7)}`,
      event,
      payload,
      timestamp: isoTimestamp,
      time: now
    });
    if (this.eventHistory.length > 100) {
      this.eventHistory.shift();
    }

    // 3. Dispatch to subscribers
    const handlers = this.listeners.get(event);
    const wildcardHandlers = this.listeners.get('*');
    let dispatched = false;

    // Combine specific and wildcard handlers defensively
    const targets = [];
    if (handlers && handlers.size > 0) {
      targets.push(...Array.from(handlers));
    }
    if (wildcardHandlers && wildcardHandlers.size > 0) {
      targets.push(...Array.from(wildcardHandlers).map(fn => (data) => fn(event, data)));
    }

    for (const handler of targets) {
      try {
        handler(payload);
        dispatched = true;
      } catch (err) {
        console.error(`[EventBus] Handler exception for event "${event}":`, err);
        // Safely record hive error if not already handling hive:error to prevent recursion
        if (event !== 'hive:error') {
          try {
            this.emit('hive:error', {
              hive: 'admin',
              error: err?.message || String(err),
              context: `EventBus listener for "${event}"`,
              timestamp: isoTimestamp
            });
          } catch (_) {}
        }
      }
    }

    return dispatched;
  }

  /**
   * Subscribe a handler to an event.
   * Returns a clean unsubscribe function.
   */
  on(event, handler) {
    if (!event || typeof handler !== 'function') {
      return () => {};
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(handler);

    // Unsubscribe callback
    return () => this.off(event, handler);
  }

  /**
   * Explicitly remove a handler subscription.
   */
  off(event, handler) {
    if (!this.listeners.has(event)) return false;
    const handlers = this.listeners.get(event);
    const removed = handlers.delete(handler);
    if (handlers.size === 0) {
      this.listeners.delete(event);
    }
    return removed;
  }

  /**
   * Subscribe a handler for a single event dispatch.
   */
  once(event, handler) {
    if (typeof handler !== 'function') return () => {};
    const wrapped = (payload) => {
      this.off(event, wrapped);
      handler(payload);
    };
    return this.on(event, wrapped);
  }

  /**
   * Get Events Per Minute (EPM) based on sliding 60-second window.
   */
  getThroughput() {
    const cutoff = Date.now() - 60000;
    while (this.throughputLog.length > 0 && this.throughputLog[0] < cutoff) {
      this.throughputLog.shift();
    }
    return this.throughputLog.length;
  }

  /**
   * Get detailed throughput metrics.
   */
  getThroughputStats() {
    return {
      epm: this.getThroughput(),
      totalEvents: this.totalEventCount,
      windowSeconds: 60
    };
  }

  /**
   * Retrieve bounded event history.
   */
  getEventHistory(limit = 50) {
    return this.eventHistory.slice(-Math.min(limit, 100));
  }

  /**
   * Reset all state (useful for Vitest test teardown).
   * @param {Object} [options]
   * @param {boolean} [options.keepSubscribers=false] - If true, keeps registered listeners intact.
   */
  clear(options = {}) {
    const keepSubscribers = Boolean(options?.keepSubscribers);
    if (!keepSubscribers) {
      this.listeners.clear();
    }
    this.throughputLog = [];
    this.eventHistory = [];
    this.totalEventCount = 0;
  }

  /**
   * Reset only throughput metrics and event history without clearing subscriber listeners.
   */
  resetMetrics() {
    this.throughputLog = [];
    this.eventHistory = [];
    this.totalEventCount = 0;
  }
}

export const eventBus = new EventBus();
export default eventBus;
