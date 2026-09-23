import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import eventBus, { SUPPORTED_EVENTS } from '../brain/eventBus';
import useSharedStore from '../brain/useSharedStore';
import useAdminStore from '../brain/useAdminStore';

describe('Adversarial Challenger M1-1: Brain & Hive Foundation Stress Suite', () => {
  // ══════════════════════════════════════════════════════════════
  // GROUP 1: EventBus High Volume Emits & Scalability
  // ══════════════════════════════════════════════════════════════
  describe('Group 1: EventBus High Volume Emits & Scalability', () => {
    it('handles 500 rapid synchronous emits without listener lag or data loss', () => {
      eventBus.clear();
      const eventCount = 500;
      const received = [];
      const handler = (payload) => received.push(payload.seq);

      const unsubscribe = eventBus.on('feature:toggled', handler);

      const startTime = performance.now();
      for (let i = 0; i < eventCount; i++) {
        eventBus.emit('feature:toggled', { seq: i, timestamp: Date.now() });
      }
      const durationMs = performance.now() - startTime;

      expect(received.length).toBe(500);
      expect(received[0]).toBe(0);
      expect(received[499]).toBe(499);
      expect(durationMs).toBeLessThan(1500);
      expect(eventBus.getThroughput()).toBe(500);
      expect(eventBus.totalEventCount).toBe(500);

      const history = eventBus.getEventHistory(200);
      expect(history.length).toBe(100);
      expect(history[0].payload.seq).toBe(400);
      expect(history[99].payload.seq).toBe(499);

      unsubscribe();
    });

    it('handles 500 rapid emits across 10 concurrent listeners (5,000 invocations)', () => {
      eventBus.clear();
      const listenerCount = 10;
      const emitCount = 500;
      const counters = new Array(listenerCount).fill(0);
      const unsubscribers = [];

      for (let i = 0; i < listenerCount; i++) {
        const idx = i;
        const un = eventBus.on('post:created', () => {
          counters[idx]++;
        });
        unsubscribers.push(un);
      }

      for (let i = 0; i < emitCount; i++) {
        eventBus.emit('post:created', { id: 'P-' + i });
      }

      for (let i = 0; i < listenerCount; i++) {
        expect(counters[i]).toBe(500);
      }

      unsubscribers.forEach((fn) => fn());
    });

    it('handles 1,000 rapid emits with wildcard listener (*)', () => {
      eventBus.clear();
      const eventsReceived = [];
      const unsub = eventBus.on('*', (eventName, data) => {
        eventsReceived.push({ eventName, data });
      });

      for (let i = 0; i < 1000; i++) {
        eventBus.emit('user:connected', { userId: 'user_' + i });
      }

      expect(eventsReceived.length).toBe(1000);
      expect(eventsReceived[999].data.userId).toBe('user_999');
      expect(eventBus.getThroughput()).toBe(1000);

      unsub();
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 2: Concurrent Subscribe & Unsubscribe Mutability
  // ══════════════════════════════════════════════════════════════
  describe('Group 2: Concurrent Subscribe & Unsubscribe Mutability', () => {
    it('allows a listener to safely unsubscribe itself during execution without breaking iteration', () => {
      eventBus.clear();
      let executionCount = 0;
      let unsubscribe;

      const selfUnsubscribingHandler = vi.fn(() => {
        executionCount++;
        if (unsubscribe) {
          unsubscribe();
        }
      });

      const secondHandler = vi.fn();

      unsubscribe = eventBus.on('application:status', selfUnsubscribingHandler);
      eventBus.on('application:status', secondHandler);

      eventBus.emit('application:status', { status: 'pending' });
      expect(selfUnsubscribingHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledTimes(1);

      eventBus.emit('application:status', { status: 'approved' });
      expect(selfUnsubscribingHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledTimes(2);
    });

    it('allows a listener to subscribe a new listener during dispatch without infinite loop', () => {
      eventBus.clear();
      const callLog = [];
      let newListenerCalled = false;

      eventBus.on('event:announced', () => {
        callLog.push('first');
        eventBus.on('event:announced', () => {
          newListenerCalled = true;
          callLog.push('dynamically-added');
        });
      });

      eventBus.emit('event:announced', { title: 'First Event' });
      expect(callLog).toEqual(['first']);
      expect(newListenerCalled).toBe(false);

      callLog.length = 0;
      eventBus.emit('event:announced', { title: 'Second Event' });
      expect(callLog).toContain('first');
      expect(callLog).toContain('dynamically-added');
    });

    it('survives rapid random subscribe and unsubscribe churn across 100 iterations', () => {
      eventBus.clear();
      const activeUnsubs = [];
      let totalReceived = 0;

      for (let step = 0; step < 100; step++) {
        for (let j = 0; j < 3; j++) {
          const un = eventBus.on('feature:toggled', () => {
            totalReceived++;
          });
          activeUnsubs.push(un);
        }

        if (activeUnsubs.length > 0) {
          const randIndex = Math.floor(Math.random() * activeUnsubs.length);
          const [removedUnsub] = activeUnsubs.splice(randIndex, 1);
          removedUnsub();
        }

        expect(() => {
          eventBus.emit('feature:toggled', { step });
        }).not.toThrow();
      }

      activeUnsubs.forEach((un) => un());
      expect(activeUnsubs.length).toBeGreaterThan(0);
    });

    it('handles idempotent unsubscribe calls without errors', () => {
      eventBus.clear();
      const handler = vi.fn();
      const unsub = eventBus.on('job:published', handler);

      expect(() => {
        unsub();
        unsub();
        unsub();
        unsub();
      }).not.toThrow();

      eventBus.emit('job:published', { id: 'J-1' });
      expect(handler).not.toHaveBeenCalled();
    });

    it('handles off() for unregistered handlers or non-existent events safely', () => {
      eventBus.clear();
      expect(eventBus.off('non:existent', () => {})).toBe(false);
      expect(eventBus.off('post:created', null)).toBe(false);
      expect(eventBus.off(null, () => {})).toBe(false);
    });

    it('ignores non-function handlers passed to on() and once() gracefully', () => {
      eventBus.clear();
      const unsub1 = eventBus.on('post:created', null);
      const unsub2 = eventBus.on('post:created', 'not-a-func');
      const unsub3 = eventBus.on(null, () => {});
      const unsub4 = eventBus.once('post:created', undefined);

      expect(typeof unsub1).toBe('function');
      expect(typeof unsub2).toBe('function');
      expect(typeof unsub3).toBe('function');
      expect(typeof unsub4).toBe('function');

      expect(() => {
        unsub1();
        unsub2();
        unsub3();
        unsub4();
      }).not.toThrow();

      expect(() => {
        eventBus.emit('post:created', { data: 1 });
      }).not.toThrow();
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 3: Error Isolation & Blast Radius Resistance
  // ══════════════════════════════════════════════════════════════
  describe('Group 3: Error Isolation & Blast Radius Resistance', () => {
    it('isolates diverse subscriber exceptions (Error, String, null) and continues execution', () => {
      eventBus.clear();
      const results = [];

      eventBus.on('announcement:broadcast', () => {
        results.push('sub-1-pass');
      });

      eventBus.on('announcement:broadcast', () => {
        throw new Error('Standard error explosion');
      });

      eventBus.on('announcement:broadcast', () => {
        results.push('sub-3-pass');
      });

      eventBus.on('announcement:broadcast', () => {
        throw 'String crash exception';
      });

      eventBus.on('announcement:broadcast', () => {
        throw null;
      });

      eventBus.on('announcement:broadcast', () => {
        results.push('sub-6-pass');
      });

      expect(() => {
        eventBus.emit('announcement:broadcast', { msg: 'Test broadcast' });
      }).not.toThrow();

      expect(results).toEqual(['sub-1-pass', 'sub-3-pass', 'sub-6-pass']);
    });

    it('prevents infinite recursion when a hive:error subscriber throws an exception', () => {
      eventBus.clear();
      let hiveErrorCount = 0;

      eventBus.on('hive:error', () => {
        hiveErrorCount++;
        throw new Error('Explosion inside hive:error listener');
      });

      expect(() => {
        eventBus.emit('hive:error', { hive: 'admin', error: 'Initial trigger' });
      }).not.toThrow();

      expect(hiveErrorCount).toBe(1);
    });

    it('gracefully handles invalid emit arguments without throwing', () => {
      eventBus.clear();
      expect(eventBus.emit(null, { data: 1 })).toBe(false);
      expect(eventBus.emit(undefined, { data: 1 })).toBe(false);
      expect(eventBus.emit(12345, { data: 1 })).toBe(false);
      expect(eventBus.emit({}, { data: 1 })).toBe(false);
      expect(eventBus.emit('', { data: 1 })).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 4: Sliding Window Throughput Calculation Accuracy
  // ══════════════════════════════════════════════════════════════
  describe('Group 4: Sliding Window Throughput Calculation Accuracy', () => {
    it('prunes entries older than 60 seconds with millisecond precision', () => {
      eventBus.clear();
      const realDateNow = Date.now;
      let simulatedTime = 1000000;

      try {
        global.Date.now = () => simulatedTime;

        for (let i = 0; i < 10; i++) {
          eventBus.emit('feature:toggled', { i });
        }
        expect(eventBus.getThroughput()).toBe(10);

        simulatedTime += 30000;
        for (let i = 0; i < 15; i++) {
          eventBus.emit('feature:toggled', { i });
        }
        expect(eventBus.getThroughput()).toBe(25);

        simulatedTime += 31000;
        expect(eventBus.getThroughput()).toBe(15);

        simulatedTime += 35000;
        expect(eventBus.getThroughput()).toBe(0);

        const stats = eventBus.getThroughputStats();
        expect(stats.epm).toBe(0);
        expect(stats.totalEvents).toBe(25);
        expect(stats.windowSeconds).toBe(60);
      } finally {
        global.Date.now = realDateNow;
      }
    });

    it('cleans throughputLog on high burst to prevent memory leak', () => {
      eventBus.clear();
      const realDateNow = Date.now;
      let simulatedTime = 5000000;

      try {
        global.Date.now = () => simulatedTime;

        for (let i = 0; i < 500; i++) {
          eventBus.emit('user:connected', { i });
        }
        expect(eventBus.throughputLog.length).toBe(500);

        simulatedTime += 65000;
        eventBus.emit('user:connected', { i: 501 });

        expect(eventBus.throughputLog.length).toBe(1);
        expect(eventBus.getThroughput()).toBe(1);
        expect(eventBus.totalEventCount).toBe(501);
      } finally {
        global.Date.now = realDateNow;
      }
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 5: EMPIRICAL DISCOVERY — The eventBus.clear() Architecture Bug
  // ══════════════════════════════════════════════════════════════
  describe('Group 5: EMPIRICAL DISCOVERY — The eventBus.clear() Architecture Bug', () => {
    it('proves that eventBus.clear() severs useSharedStore reactive bindings', () => {
      eventBus.clear();

      eventBus.emit('post:created', { post: { id: 'STRESS-POST-1', content: 'Should reach store' } });

      const currentPosts = useSharedStore.getState().posts;
      const received = currentPosts.some((p) => p.id === 'STRESS-POST-1');

      // The listener was destroyed by eventBus.clear(), so received is false.
      // This confirms the empirical flaw.
      expect(received).toBe(false);
    });

    it('proves that eventBus.clear() severs useAdminStore hive:error telemetry listener', () => {
      const initialErrors = useAdminStore.getState().hiveErrors.student;

      eventBus.clear();

      eventBus.emit('hive:error', { hive: 'student', error: 'Student crash' });

      const currentErrors = useAdminStore.getState().hiveErrors.student;
      expect(currentErrors).toBe(initialErrors);
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 6: AdminStore Prototype Pollution Defense Tests
  // ══════════════════════════════════════════════════════════════
  describe('Group 6: AdminStore Prototype Pollution Defense Tests', () => {
    afterEach(() => {
      delete Object.prototype.polluted;
      delete Object.prototype.isAdmin;
      delete Object.prototype.hacked;
      delete Object.prototype.exploit;
    });

    it('neutralizes __proto__ prototype pollution attack on setSiteConfig', () => {
      const payload = JSON.parse('{"__proto__": {"polluted": "yes"}, "heroBannerTitle": "Safe Title"}');

      useAdminStore.getState().setSiteConfig(payload);

      expect(Object.prototype.polluted).toBeUndefined();
      expect(({}).polluted).toBeUndefined();
      expect(useAdminStore.getState().siteConfig.heroBannerTitle).toBe('Safe Title');
      expect(useAdminStore.getState().siteConfig.__proto__.polluted).toBeUndefined();
    });

    it('neutralizes constructor.prototype pollution attack on setSiteConfig', () => {
      const payload = JSON.parse('{"constructor": {"prototype": {"isAdmin": true}}, "ctaButtonText": "Join"}');

      useAdminStore.getState().setSiteConfig(payload);

      expect(Object.prototype.isAdmin).toBeUndefined();
      expect(({}).isAdmin).toBeUndefined();
      expect(useAdminStore.getState().siteConfig.ctaButtonText).toBe('Join');
    });

    it('neutralizes prototype property pollution attack on setSiteConfig', () => {
      const payload = JSON.parse('{"prototype": {"hacked": true}}');

      useAdminStore.getState().setSiteConfig(payload);

      expect(Object.prototype.hacked).toBeUndefined();
      expect(({}).hacked).toBeUndefined();
    });

    it('handles nested objects without leaking prototype pollution', () => {
      const nestedPayload = {
        announcementBanner: JSON.parse('{"visible": true, "__proto__": {"exploit": true}}')
      };

      useAdminStore.getState().setSiteConfig(nestedPayload);

      expect(Object.prototype.exploit).toBeUndefined();
      expect(({}).exploit).toBeUndefined();
      expect(useAdminStore.getState().siteConfig.announcementBanner.visible).toBe(true);
    });

    it('handles non-object and malicious inputs safely in setSiteConfig', () => {
      const store = useAdminStore.getState();
      const currentConfig = { ...store.siteConfig };

      expect(() => {
        store.setSiteConfig(null);
        store.setSiteConfig(undefined);
        store.setSiteConfig('malicious string');
        store.setSiteConfig(12345);
        store.setSiteConfig([1, 2, 3]);
        store.setSiteConfig(() => null);
        store.setSiteConfig(() => 'invalid');
      }).not.toThrow();

      expect(useAdminStore.getState().siteConfig.primaryColor).toBe(currentConfig.primaryColor);
    });

    it('handles functional update containing prototype pollution attempt', () => {
      useAdminStore.getState().setSiteConfig((prev) => ({
        ...prev,
        ...JSON.parse('{"__proto__": {"polluted": "func_hack"}}'),
        heroBannerSub: 'Functional Update Tested'
      }));

      expect(Object.prototype.polluted).toBeUndefined();
      expect(({}).polluted).toBeUndefined();
      expect(useAdminStore.getState().siteConfig.heroBannerSub).toBe('Functional Update Tested');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 7: AdminStore XSS & Circular Reference Defense in logAuditAction
  // ══════════════════════════════════════════════════════════════
  describe('Group 7: AdminStore XSS & Circular Reference Defense in logAuditAction', () => {
    it('sanitizes script tags from user, action, and module', () => {
      const store = useAdminStore.getState();

      store.logAction(
        '<script>alert("XSS_USER")</script>AdminUser',
        '<script src="http://malicious.js"></script>Deleted Database',
        '<script>evil()</script>SecurityModule'
      );

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.user).not.toContain('<script>');
      expect(log.user).not.toContain('</script>');
      expect(log.action).not.toContain('<script');
      expect(log.module).not.toContain('<script>');
      expect(log.user).toBe('AdminUser');
      expect(log.action).toBe('Deleted Database');
      expect(log.module).toBe('SecurityModule');
    });

    it('strips dangerous event handlers (onerror, onload, onclick, onfocus)', () => {
      const store = useAdminStore.getState();

      store.logAction(
        '<img src=x onerror=alert(1)>Hacker',
        '<svg onload="alert(1)">Action',
        '<div onclick="alert(2)">Module</div>'
      );

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.user).not.toContain('onerror');
      expect(log.action).not.toContain('onload');
      expect(log.module).not.toContain('onclick');
    });

    it('strips javascript: pseudo-protocol URIs', () => {
      const store = useAdminStore.getState();

      store.logAction(
        '<a href="javascript:alert(1)">LinkUser</a>',
        '<a href="javascript:void(0)">LinkAction</a>',
        'Module'
      );

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.user).not.toContain('javascript:');
      expect(log.action).not.toContain('javascript:');
    });

    it('survives self-referential circular metadata without throwing TypeError', () => {
      const store = useAdminStore.getState();

      const circularObj = { name: 'RootNode' };
      circularObj.self = circularObj;

      expect(() => {
        store.logAction('Auditor', 'Inspecting circular object', 'System', 'warning', circularObj);
      }).not.toThrow();

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.metadata).toEqual({ info: '[Complex/Circular Object]' });

      expect(() => {
        JSON.stringify(useAdminStore.getState().auditLogs);
      }).not.toThrow();
    });

    it('survives indirect circular metadata (A -> B -> A)', () => {
      const store = useAdminStore.getState();

      const nodeA = { name: 'A' };
      const nodeB = { name: 'B', refA: nodeA };
      nodeA.refB = nodeB;

      expect(() => {
        store.logAction('Auditor', 'Mutual circular reference', 'System', 'info', nodeA);
      }).not.toThrow();

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.metadata).toEqual({ info: '[Complex/Circular Object]' });
      expect(() => {
        JSON.stringify(useAdminStore.getState().auditLogs);
      }).not.toThrow();
    });

    it('handles BigInt and unstringifiable values in metadata without crashing', () => {
      const store = useAdminStore.getState();

      const bigIntMeta = { transactionId: 9007199254740991000n };

      expect(() => {
        store.logAction('Auditor', 'BigInt action', 'Finance', 'info', bigIntMeta);
      }).not.toThrow();

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.metadata).toEqual({ info: '[Complex/Circular Object]' });
    });

    it('enforces string length boundaries to prevent memory exhaustion log flooding', () => {
      const store = useAdminStore.getState();

      const hugeUser = 'U'.repeat(1000);
      const hugeAction = 'A'.repeat(5000);
      const hugeModule = 'M'.repeat(500);

      store.logAction(hugeUser, hugeAction, hugeModule);

      const log = useAdminStore.getState().auditLogs[0];
      expect(log.user.length).toBeLessThanOrEqual(100);
      expect(log.action.length).toBeLessThanOrEqual(500);
      expect(log.module.length).toBeLessThanOrEqual(50);
    });

    it('maintains bounded ring-buffer capped at max 200 audit logs', () => {
      const store = useAdminStore.getState();

      for (let i = 0; i < 250; i++) {
        store.logAction('User-' + i, 'Action-' + i, 'Bench');
      }

      const logs = useAdminStore.getState().auditLogs;
      expect(logs.length).toBeLessThanOrEqual(200);
      expect(logs[0].action).toBe('Action-249');
    });

    it('tolerates null, undefined, and non-string arguments gracefully', () => {
      const store = useAdminStore.getState();

      expect(() => {
        store.logAction(null, null, null);
        store.logAction(undefined, undefined, undefined);
        store.logAction(12345, { obj: true }, ['arr']);
      }).not.toThrow();

      const latestLog = useAdminStore.getState().auditLogs[0];
      expect(latestLog.user).toBe('12345');
      expect(latestLog.action).toBe('[object Object]');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // GROUP 8: AdminStore Hive Error Telemetry Boundary Stress
  // ══════════════════════════════════════════════════════════════
  describe('Group 8: AdminStore Hive Error Telemetry Boundary Stress', () => {
    it('increments error count for valid hives and falls back to admin for invalid hives', () => {
      const store = useAdminStore.getState();
      const initialAdmin = store.hiveErrors.admin;
      const initialAlumni = store.hiveErrors.alumni;

      store.reportHiveError('alumni', new Error('Alumni network timeout'));
      expect(useAdminStore.getState().hiveErrors.alumni).toBe(initialAlumni + 1);

      store.reportHiveError('nonexistent_hive', 'Unknown error');
      expect(useAdminStore.getState().hiveErrors.admin).toBe(initialAdmin + 1);

      store.reportHiveError(null, 'Null hive error');
      expect(useAdminStore.getState().hiveErrors.admin).toBe(initialAdmin + 2);
    });

    it('survives 500 rapid error reports across all hives without dropping counts', () => {
      const store = useAdminStore.getState();
      const hives = ['student', 'alumni', 'company', 'academic', 'admin'];
      const baselines = { ...store.hiveErrors };

      for (let i = 0; i < 500; i++) {
        const h = hives[i % hives.length];
        store.reportHiveError(h, 'Stress error ' + i);
      }

      const finalErrors = useAdminStore.getState().hiveErrors;
      for (const h of hives) {
        expect(finalErrors[h]).toBe(baselines[h] + 100);
      }
    });
  });
});