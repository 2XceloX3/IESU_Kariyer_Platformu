import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// 1. Brain Layer Imports
import eventBus, { SUPPORTED_EVENTS } from '../brain/eventBus';
import useSharedStore, { initSharedStoreSubscriptions } from '../brain/useSharedStore';
import useAdminStore, { initAdminStoreSubscriptions } from '../brain/useAdminStore';
import HiveHealthMonitor from '../brain/HiveHealthMonitor';

// 2. Hive Store Imports
import useStudentStore from '../hives/student/store/useStudentStore';
import useAlumniStore from '../hives/alumni/store/useAlumniStore';
import useCompanyStore from '../hives/company/store/useCompanyStore';
import useAcademicStore from '../hives/academic/store/useAcademicStore';

// 3. Hive Context Imports
import { 
  HiveProvider as StudentProvider, 
  useHiveContext as useStudentContext,
  DEFAULT_STUDENT_HIVE 
} from '../hives/student/HiveContext';

import { 
  HiveProvider as AlumniProvider, 
  useHiveContext as useAlumniContext,
  DEFAULT_ALUMNI_HIVE 
} from '../hives/alumni/HiveContext';

import { 
  HiveProvider as CompanyProvider, 
  useHiveContext as useCompanyContext,
  DEFAULT_COMPANY_HIVE 
} from '../hives/company/HiveContext';

import { 
  HiveProvider as AcademicProvider, 
  useHiveContext as useAcademicContext,
  DEFAULT_ACADEMIC_HIVE 
} from '../hives/academic/HiveContext';

describe('Milestone 1: Beehive Brain & Hive Foundation Layer Test Suite', () => {

  beforeEach(() => {
    // 1. Reset event bus state
    eventBus.clear();

    // 2. Re-attach system store subscriptions
    initSharedStoreSubscriptions();
    initAdminStoreSubscriptions();

    // 3. Reset all stores to pristine state to eliminate cross-test leakage
    useSharedStore.getState().reset();
    useAdminStore.getState().reset();
    useStudentStore.getState().reset();
    useAlumniStore.getState().reset();
    useCompanyStore.getState().reset();
    useAcademicStore.getState().reset();
  });

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: EventBus Cross-Hive Pub/Sub Broker
  // ══════════════════════════════════════════════════════════════
  describe('1. eventBus.js (Requirement R1)', () => {
    it('supports all required typed events in catalog', () => {
      expect(SUPPORTED_EVENTS).toContain('post:created');
      expect(SUPPORTED_EVENTS).toContain('job:published');
      expect(SUPPORTED_EVENTS).toContain('event:announced');
      expect(SUPPORTED_EVENTS).toContain('application:status');
      expect(SUPPORTED_EVENTS).toContain('announcement:broadcast');
      expect(SUPPORTED_EVENTS).toContain('feature:toggled');
      expect(SUPPORTED_EVENTS).toContain('user:connected');
      expect(SUPPORTED_EVENTS).toContain('hive:error');
      expect(SUPPORTED_EVENTS).toContain('audit:logged');
    });

    it('subscribes with on() and receives published payload via emit()', () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.on('post:created', handler);

      const payload = { post: { id: 'P-1', content: 'Test post' }, senderHive: 'student' };
      const dispatched = eventBus.emit('post:created', payload);

      expect(dispatched).toBe(true);
      expect(handler).toHaveBeenCalledWith(payload);

      // Clean unsubscribe
      unsubscribe();
      eventBus.emit('post:created', { post: { id: 'P-2' } });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('handles once() for single execution', () => {
      const handler = vi.fn();
      eventBus.once('user:connected', handler);

      eventBus.emit('user:connected', { role: 'student' });
      eventBus.emit('user:connected', { role: 'alumni' });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ role: 'student' });
    });

    it('isolates subscriber errors so subsequent listeners still execute', () => {
      const throwingHandler = vi.fn(() => {
        throw new Error('Subscriber crash');
      });
      const healthyHandler = vi.fn();

      eventBus.on('job:published', throwingHandler);
      eventBus.on('job:published', healthyHandler);

      expect(() => {
        eventBus.emit('job:published', { title: 'Junior Dev' });
      }).not.toThrow();

      expect(throwingHandler).toHaveBeenCalled();
      expect(healthyHandler).toHaveBeenCalled();
    });

    it('calculates sliding 60-second throughput (EPM) accurately', () => {
      expect(eventBus.getThroughput()).toBe(0);

      eventBus.emit('feature:toggled', { feature: 'test-1' });
      eventBus.emit('feature:toggled', { feature: 'test-2' });
      eventBus.emit('feature:toggled', { feature: 'test-3' });

      expect(eventBus.getThroughput()).toBe(3);
      const stats = eventBus.getThroughputStats();
      expect(stats.epm).toBe(3);
      expect(stats.totalEvents).toBe(3);
      expect(stats.windowSeconds).toBe(60);
    });

    it('records bounded event history capped at 100 entries', () => {
      for (let i = 0; i < 110; i++) {
        eventBus.emit('feature:toggled', { count: i });
      }
      const history = eventBus.getEventHistory(200);
      expect(history.length).toBe(100);
      expect(history[history.length - 1].payload.count).toBe(109);
    });

    it('supports wildcard * event listener', () => {
      const wildcard = vi.fn();
      eventBus.on('*', wildcard);

      eventBus.emit('audit:logged', { action: 'LOGIN' });
      expect(wildcard).toHaveBeenCalledWith('audit:logged', { action: 'LOGIN' });
    });
  });

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: Shared Brain Store (useSharedStore.js)
  // ══════════════════════════════════════════════════════════════
  describe('2. useSharedStore.js (Requirement R1)', () => {
    it('initializes with default mock & live data collections', () => {
      const state = useSharedStore.getState();
      expect(Array.isArray(state.posts)).toBe(true);
      expect(Array.isArray(state.jobs)).toBe(true);
      expect(Array.isArray(state.events)).toBe(true);
      expect(Array.isArray(state.news)).toBe(true);
      expect(Array.isArray(state.announcements)).toBe(true);
      expect(Array.isArray(state.generalEvents)).toBe(true);
      expect(Array.isArray(state.careerOpportunities)).toBe(true);
      expect(state.innerPagesData).toBeDefined();
    });

    it('prepends items using addPost, addJob, addEvent, addAnnouncement', () => {
      const store = useSharedStore.getState();

      store.addPost({ id: 'P-NEW', content: 'New shared post' });
      expect(useSharedStore.getState().posts[0].id).toBe('P-NEW');

      store.addJob({ id: 'J-NEW', title: 'New shared job' });
      expect(useSharedStore.getState().jobs[0].id).toBe('J-NEW');

      store.addEvent({ id: 'E-NEW', title: 'New shared event' });
      expect(useSharedStore.getState().events[0].id).toBe('E-NEW');

      store.addAnnouncement({ id: 'A-NEW', title: 'New announcement' });
      expect(useSharedStore.getState().announcements[0].id).toBe('A-NEW');
    });

    it('reactively updates collections when EventBus emits events', () => {
      eventBus.emit('post:created', { post: { id: 'EVT-POST', content: 'From bus' } });
      expect(useSharedStore.getState().posts[0].id).toBe('EVT-POST');

      eventBus.emit('job:published', { job: { id: 'EVT-JOB', title: 'Bus job' } });
      expect(useSharedStore.getState().jobs[0].id).toBe('EVT-JOB');

      eventBus.emit('event:announced', { event: { id: 'EVT-EVENT', title: 'Bus event' } });
      expect(useSharedStore.getState().events[0].id).toBe('EVT-EVENT');

      eventBus.emit('announcement:broadcast', { announcement: { id: 'EVT-ANN', title: 'Bus ann' } });
      expect(useSharedStore.getState().announcements[0].id).toBe('EVT-ANN');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // SECTION 3: Admin Brain Store (useAdminStore.js)
  // ══════════════════════════════════════════════════════════════
  describe('3. useAdminStore.js (Requirement R1 & R7)', () => {
    it('initializes user registries, siteConfig, and hiveErrors', () => {
      const state = useAdminStore.getState();
      expect(Array.isArray(state.students)).toBe(true);
      expect(Array.isArray(state.alumni)).toBe(true);
      expect(Array.isArray(state.companies)).toBe(true);
      expect(Array.isArray(state.academicStaff)).toBe(true);
      expect(state.siteConfig).toBeDefined();
      expect(state.hiveErrors).toEqual({
        student: 0,
        alumni: 0,
        company: 0,
        academic: 0,
        admin: 0
      });
    });

    it('reports hive errors and increments hiveErrors counter', () => {
      useAdminStore.getState().reportHiveError('student', new Error('Student feed crash'));
      expect(useAdminStore.getState().hiveErrors.student).toBe(1);

      useAdminStore.getState().reportHiveError('company', 'Company ATS timeout');
      expect(useAdminStore.getState().hiveErrors.company).toBe(1);
    });

    it('sanitizes audit log entries with DOMPurify and handles circular metadata safely', () => {
      const store = useAdminStore.getState();

      // Circular reference object
      const circularMeta = { note: 'Safe metadata' };
      circularMeta.self = circularMeta;

      store.logAction(
        '<script>alert("XSS-USER")</script>Admin',
        '<b>Created</b> <img src=x onerror=alert(1)>Job',
        'CMS',
        'warning',
        circularMeta
      );

      const latestLog = useAdminStore.getState().auditLogs[0];
      expect(latestLog.user).not.toContain('<script>');
      expect(latestLog.action).not.toContain('onerror');
      expect(latestLog.severity).toBe('warning');
      expect(latestLog.metadata).toBeDefined();
    });

    it('guards siteConfig against prototype pollution attacks', () => {
      const store = useAdminStore.getState();
      store.setSiteConfig({
        heroBannerTitle: 'Updated Banner',
        __proto__: { polluted: true }
      });

      expect(useAdminStore.getState().siteConfig.heroBannerTitle).toBe('Updated Banner');
      expect(({}).polluted).toBeUndefined();
    });

    it('updates feature toggles and emits feature:toggled event', () => {
      const spy = vi.fn();
      eventBus.on('feature:toggled', spy);

      useAdminStore.getState().setFeatureToggle('featureCareerFair', true);
      expect(useAdminStore.getState().featureToggles.featureCareerFair).toBe(true);
      expect(useAdminStore.getState().featureCareerFair).toBe(true);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        feature: 'featureCareerFair',
        enabled: true
      }));
    });
  });

  // ══════════════════════════════════════════════════════════════
  // SECTION 4: 4 Isolated Per-Hive Stores (Requirement R2)
  // ══════════════════════════════════════════════════════════════
  describe('4. Per-Hive Isolated Stores (Requirement R2)', () => {
    describe('useStudentStore', () => {
      it('initializes with default values and routes views with history', () => {
        const state = useStudentStore.getState();
        expect(state.activeView).toBe('feed');
        expect(state.previousView).toBeNull();
        expect(state.activeTab).toBe('feed');
        expect(state.careerProgress).toBe(0);
        expect(state.dailyQuestProgress).toBe(0);
        expect(state.selectedJobId).toBeNull();

        useStudentStore.getState().setActiveView('jobs');
        expect(useStudentStore.getState().activeView).toBe('jobs');
        expect(useStudentStore.getState().previousView).toBe('feed');

        useStudentStore.getState().goBack();
        expect(useStudentStore.getState().activeView).toBe('feed');
        expect(useStudentStore.getState().previousView).toBe('jobs');
      });

      it('supports careerProgress, dailyQuestProgress, and selectedJobId', () => {
        useStudentStore.getState().setCareerProgress(75);
        expect(useStudentStore.getState().careerProgress).toBe(75);

        useStudentStore.getState().setDailyQuestProgress((prev) => prev + 4);
        expect(useStudentStore.getState().dailyQuestProgress).toBe(4);

        useStudentStore.getState().setSelectedJobId('JOB-999');
        expect(useStudentStore.getState().selectedJobId).toBe('JOB-999');
      });
    });

    describe('useAlumniStore', () => {
      it('initializes and manages mentorMode and alumniCardActive', () => {
        const state = useAlumniStore.getState();
        expect(state.activeView).toBe('feed');
        expect(state.mentorMode).toBe(false);
        expect(state.alumniCardActive).toBe(false);

        useAlumniStore.getState().setMentorMode(true);
        expect(useAlumniStore.getState().mentorMode).toBe(true);

        useAlumniStore.getState().setAlumniCardActive((prev) => !prev);
        expect(useAlumniStore.getState().alumniCardActive).toBe(true);
      });
    });

    describe('useCompanyStore', () => {
      it('initializes and manages atsBoard and activeJobListings', () => {
        const state = useCompanyStore.getState();
        expect(state.activeView).toBe('feed');
        expect(state.atsBoard).toEqual({});
        expect(state.activeJobListings).toEqual([]);

        useCompanyStore.getState().setAtsBoard({ stage: 'interview', count: 3 });
        expect(useCompanyStore.getState().atsBoard).toEqual({ stage: 'interview', count: 3 });

        useCompanyStore.getState().setActiveJobListings([{ id: 'JOB-1', title: 'React Dev' }]);
        expect(useCompanyStore.getState().activeJobListings).toHaveLength(1);
      });
    });

    describe('useAcademicStore', () => {
      it('initializes and manages researchMode', () => {
        const state = useAcademicStore.getState();
        expect(state.activeView).toBe('feed');
        expect(state.researchMode).toBe(false);

        useAcademicStore.getState().setResearchMode(true);
        expect(useAcademicStore.getState().researchMode).toBe(true);
      });
    });

    describe('Architectural Isolation Invariant (No cross-hive pollution)', () => {
      it('mutating student view does not affect alumni, company, or academic views', () => {
        useStudentStore.getState().setActiveView('cvbuilder');
        expect(useStudentStore.getState().activeView).toBe('cvbuilder');
        expect(useAlumniStore.getState().activeView).toBe('feed');
        expect(useCompanyStore.getState().activeView).toBe('feed');
        expect(useAcademicStore.getState().activeView).toBe('feed');
      });
    });
  });

  // ══════════════════════════════════════════════════════════════
  // SECTION 5: 4 Per-Hive Contexts (Requirement R3)
  // ══════════════════════════════════════════════════════════════
  describe('5. Per-Hive Contexts (Requirement R3)', () => {
    function ContextConsumer({ hook }) {
      const { hiveColor, hiveName, hiveAccent, lightBg, borderAccent } = hook();
      return (
        <div>
          <span data-testid="color">{hiveColor}</span>
          <span data-testid="name">{hiveName}</span>
          <span data-testid="accent">{hiveAccent}</span>
          <span data-testid="lightBg">{lightBg}</span>
          <span data-testid="border">{borderAccent}</span>
        </div>
      );
    }

    it('Student Hive Context provides #990000, student, red', () => {
      render(
        <StudentProvider>
          <ContextConsumer hook={useStudentContext} />
        </StudentProvider>
      );
      expect(screen.getByTestId('color').textContent).toBe('#990000');
      expect(screen.getByTestId('name').textContent).toBe('student');
      expect(screen.getByTestId('accent').textContent).toBe('red');
      expect(screen.getByTestId('lightBg').textContent).toBe('bg-red-50');
      expect(screen.getByTestId('border').textContent).toBe('border-red-200');
    });

    it('Student Hive Context provides safe fallback when invoked outside Provider', () => {
      render(<ContextConsumer hook={useStudentContext} />);
      expect(screen.getByTestId('color').textContent).toBe('#990000');
      expect(screen.getByTestId('name').textContent).toBe('student');
    });

    it('Alumni Hive Context provides #059669, alumni, emerald', () => {
      render(
        <AlumniProvider>
          <ContextConsumer hook={useAlumniContext} />
        </AlumniProvider>
      );
      expect(screen.getByTestId('color').textContent).toBe('#059669');
      expect(screen.getByTestId('name').textContent).toBe('alumni');
      expect(screen.getByTestId('accent').textContent).toBe('emerald');
    });

    it('Company Hive Context provides #1e3a5f, company, blue', () => {
      render(
        <CompanyProvider>
          <ContextConsumer hook={useCompanyContext} />
        </CompanyProvider>
      );
      expect(screen.getByTestId('color').textContent).toBe('#1e3a5f');
      expect(screen.getByTestId('name').textContent).toBe('company');
      expect(screen.getByTestId('accent').textContent).toBe('blue');
    });

    it('Academic Hive Context provides #7c3aed, academic, violet', () => {
      render(
        <AcademicProvider>
          <ContextConsumer hook={useAcademicContext} />
        </AcademicProvider>
      );
      expect(screen.getByTestId('color').textContent).toBe('#7c3aed');
      expect(screen.getByTestId('name').textContent).toBe('academic');
      expect(screen.getByTestId('accent').textContent).toBe('violet');
    });
  });

  // ══════════════════════════════════════════════════════════════
  // SECTION 6: HiveHealthMonitor Component (Requirement R7)
  // ══════════════════════════════════════════════════════════════
  describe('6. HiveHealthMonitor.jsx (Requirement R7)', () => {
    it('renders all 4 honeycomb cells and connected indicator', () => {
      render(<HiveHealthMonitor />);
      expect(screen.getByTestId('hive-health-monitor')).toBeInTheDocument();
      expect(screen.getByTestId('honeycomb-cell-student')).toBeInTheDocument();
      expect(screen.getByTestId('honeycomb-cell-alumni')).toBeInTheDocument();
      expect(screen.getByTestId('honeycomb-cell-company')).toBeInTheDocument();
      expect(screen.getByTestId('honeycomb-cell-academic')).toBeInTheDocument();
      expect(screen.getByTestId('all-hives-connected')).toBeInTheDocument();
      expect(screen.getByTestId('epm-counter')).toBeInTheDocument();
    });

    it('dispatches test ping event when clicking ping button', () => {
      const spy = vi.fn();
      eventBus.on('feature:toggled', spy);

      render(<HiveHealthMonitor />);
      const pingBtn = screen.getByTitle('EventBus test olayı tetikle');
      fireEvent.click(pingBtn);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        feature: 'health-monitor-ping'
      }));
    });
  });

});
