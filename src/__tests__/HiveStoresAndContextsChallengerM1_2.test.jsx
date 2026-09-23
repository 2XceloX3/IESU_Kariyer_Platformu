import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

// 4 Hive Stores
import useStudentStore from '../hives/student/store/useStudentStore';
import useAlumniStore from '../hives/alumni/store/useAlumniStore';
import useCompanyStore from '../hives/company/store/useCompanyStore';
import useAcademicStore from '../hives/academic/store/useAcademicStore';

// 4 Hive Contexts & Providers
import {
  HiveContext as StudentHiveContext,
  HiveProvider as StudentHiveProvider,
  useHiveContext as useStudentContext,
  DEFAULT_STUDENT_HIVE,
} from '../hives/student/HiveContext';

import {
  HiveContext as AlumniHiveContext,
  HiveProvider as AlumniHiveProvider,
  useHiveContext as useAlumniContext,
  DEFAULT_ALUMNI_HIVE,
} from '../hives/alumni/HiveContext';

import {
  HiveContext as CompanyHiveContext,
  HiveProvider as CompanyHiveProvider,
  useHiveContext as useCompanyContext,
  DEFAULT_COMPANY_HIVE,
} from '../hives/company/HiveContext';

import {
  HiveContext as AcademicHiveContext,
  HiveProvider as AcademicHiveProvider,
  useHiveContext as useAcademicContext,
  DEFAULT_ACADEMIC_HIVE,
} from '../hives/academic/HiveContext';

describe('Challenger M1-2: Empirical Stress Test Suite for 4 Hive Stores & 4 Hive Contexts', () => {
  beforeEach(() => {
    useStudentStore.getState().reset();
    useAlumniStore.getState().reset();
    useCompanyStore.getState().reset();
    useAcademicStore.getState().reset();
  });

  // ═════════════════════════════════════════════════════════════════
  // PART 1: HIVE STORES STATE TRANSITION & ROBUSTNESS STRESS TEST
  // ═════════════════════════════════════════════════════════════════
  describe('1. Hive Stores State Transitions & Edge Cases', () => {
    const stores = [
      { name: 'Student', store: useStudentStore },
      { name: 'Alumni', store: useAlumniStore },
      { name: 'Company', store: useCompanyStore },
      { name: 'Academic', store: useAcademicStore },
    ];

    stores.forEach(({ name, store }) => {
      describe(`${name} Hive Store Transition Invariants`, () => {
        it('handles valid sequential navigation and sets previousView accurately', () => {
          const s = store.getState();
          expect(s.activeView).toBe('feed');
          expect(s.previousView).toBeNull();

          store.getState().setActiveView('profile');
          expect(store.getState().activeView).toBe('profile');
          expect(store.getState().previousView).toBe('feed');

          store.getState().setActiveView('settings');
          expect(store.getState().activeView).toBe('settings');
          expect(store.getState().previousView).toBe('profile');

          store.getState().setActiveView('feed');
          expect(store.getState().activeView).toBe('feed');
          expect(store.getState().previousView).toBe('settings');
        });

        it('ignores identical view calls without corrupting previousView', () => {
          store.getState().setActiveView('jobs');
          expect(store.getState().activeView).toBe('jobs');
          expect(store.getState().previousView).toBe('feed');

          // Repeated identical view calls
          store.getState().setActiveView('jobs');
          expect(store.getState().activeView).toBe('jobs');
          expect(store.getState().previousView).toBe('feed');

          store.getState().setActiveView('jobs');
          expect(store.getState().activeView).toBe('jobs');
          expect(store.getState().previousView).toBe('feed');
        });

        it('ignores invalid, null, undefined, empty string, and falsy values safely', () => {
          store.getState().setActiveView('dashboard');

          // null
          store.getState().setActiveView(null);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // undefined
          store.getState().setActiveView(undefined);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // empty string
          store.getState().setActiveView('');
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // false
          store.getState().setActiveView(false);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // 0
          store.getState().setActiveView(0);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // NaN
          store.getState().setActiveView(NaN);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // Function updater returning null or undefined
          store.getState().setActiveView(() => null);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          store.getState().setActiveView(() => undefined);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // Function updater returning same view
          store.getState().setActiveView((prev) => prev);
          expect(store.getState().activeView).toBe('dashboard');
          expect(store.getState().previousView).toBe('feed');

          // Function updater returning valid view
          store.getState().setActiveView((prev) => `${prev}_custom`);
          expect(store.getState().activeView).toBe('dashboard_custom');
          expect(store.getState().previousView).toBe('dashboard');
        });

        it('handles goBack() when previousView is null gracefully', () => {
          // At initial state: activeView = 'feed', previousView = null
          expect(store.getState().activeView).toBe('feed');
          expect(store.getState().previousView).toBeNull();

          // Calling goBack() when at root with previousView null must NOT crash
          // and should safely remain at 'feed'
          store.getState().goBack();
          expect(store.getState().activeView).toBe('feed');
          expect(store.getState().previousView).toBeNull();

          // If store is somehow at another view with previousView null (forced/custom)
          store.setState({ activeView: 'orphan_view', previousView: null });
          store.getState().goBack();
          expect(store.getState().activeView).toBe('feed');
          expect(store.getState().previousView).toBe('orphan_view');
        });

        it('handles rapid repeated goBack() calls (100x oscillation) without crashing or corruption', () => {
          store.getState().setActiveView('events');
          expect(store.getState().activeView).toBe('events');
          expect(store.getState().previousView).toBe('feed');

          // Call goBack 100 times consecutively (ping-pong stability)
          for (let i = 0; i < 100; i++) {
            store.getState().goBack();
            const current = store.getState();
            expect(current.activeView).toBeDefined();
            expect(current.activeView).not.toBeNull();
            expect(['feed', 'events']).toContain(current.activeView);
            expect(['feed', 'events']).toContain(current.previousView);
          }
        });

        it('supports setActiveTab with static value and functional updater', () => {
          expect(store.getState().activeTab).toBe('feed');

          store.getState().setActiveTab('announcements');
          expect(store.getState().activeTab).toBe('announcements');

          store.getState().setActiveTab((prev) => `tab_${prev}`);
          expect(store.getState().activeTab).toBe('tab_announcements');
        });
      });
    });

    // ═══════════════════════════════════════════════════════════════
    // PART 2: CROSS-STORE COMPLETE STATE ISOLATION
    // ═══════════════════════════════════════════════════════════════
    describe('2. Strict Cross-Store Isolation Invariant', () => {
      it('mutating student store NEVER affects alumni, company, or academic store', () => {
        // Mutate every student property
        useStudentStore.getState().setActiveView('student_special_view');
        useStudentStore.getState().setActiveTab('student_special_tab');
        useStudentStore.getState().setCareerProgress(88);
        useStudentStore.getState().setDailyQuestProgress(9);
        useStudentStore.getState().setSelectedJobId('JOB-TEST-123');

        // Check Student store
        expect(useStudentStore.getState().activeView).toBe('student_special_view');
        expect(useStudentStore.getState().careerProgress).toBe(88);
        expect(useStudentStore.getState().dailyQuestProgress).toBe(9);
        expect(useStudentStore.getState().selectedJobId).toBe('JOB-TEST-123');

        // Verify Alumni store remains 100% pristine
        const alumniState = useAlumniStore.getState();
        expect(alumniState.activeView).toBe('feed');
        expect(alumniState.previousView).toBeNull();
        expect(alumniState.activeTab).toBe('feed');
        expect(alumniState.mentorMode).toBe(false);
        expect(alumniState.alumniCardActive).toBe(false);

        // Verify Company store remains 100% pristine
        const companyState = useCompanyStore.getState();
        expect(companyState.activeView).toBe('feed');
        expect(companyState.previousView).toBeNull();
        expect(companyState.activeTab).toBe('feed');
        expect(companyState.atsBoard).toEqual({});
        expect(companyState.activeJobListings).toEqual([]);

        // Verify Academic store remains 100% pristine
        const academicState = useAcademicStore.getState();
        expect(academicState.activeView).toBe('feed');
        expect(academicState.previousView).toBeNull();
        expect(academicState.activeTab).toBe('feed');
        expect(academicState.researchMode).toBe(false);
      });

      it('mutating alumni store NEVER affects student, company, or academic store', () => {
        useAlumniStore.getState().setActiveView('alumni_mentorship');
        useAlumniStore.getState().setMentorMode(true);
        useAlumniStore.getState().setAlumniCardActive(true);

        expect(useStudentStore.getState().activeView).toBe('feed');
        expect(useCompanyStore.getState().activeView).toBe('feed');
        expect(useAcademicStore.getState().activeView).toBe('feed');
      });

      it('mutating company store NEVER affects student, alumni, or academic store', () => {
        useCompanyStore.getState().setActiveView('company_ats_pipeline');
        useCompanyStore.getState().setAtsBoard({ stage: 'screening', candidates: ['S-1'] });
        useCompanyStore.getState().setActiveJobListings([{ id: 'JOB-99', title: 'Architect' }]);

        expect(useStudentStore.getState().activeView).toBe('feed');
        expect(useAlumniStore.getState().activeView).toBe('feed');
        expect(useAcademicStore.getState().activeView).toBe('feed');
      });

      it('mutating academic store NEVER affects student, alumni, or company store', () => {
        useAcademicStore.getState().setActiveView('academic_grants');
        useAcademicStore.getState().setResearchMode(true);

        expect(useStudentStore.getState().activeView).toBe('feed');
        expect(useAlumniStore.getState().activeView).toBe('feed');
        expect(useCompanyStore.getState().activeView).toBe('feed');
      });

      it('survives high-frequency interleaved concurrent mutations across all 4 stores', () => {
        for (let i = 0; i < 500; i++) {
          useStudentStore.getState().setActiveView(`student_view_${i}`);
          useStudentStore.getState().setCareerProgress(i % 100);

          useAlumniStore.getState().setActiveView(`alumni_view_${i}`);
          useAlumniStore.getState().setMentorMode(i % 2 === 0);

          useCompanyStore.getState().setActiveView(`company_view_${i}`);
          useCompanyStore.getState().setAtsBoard({ count: i });

          useAcademicStore.getState().setActiveView(`academic_view_${i}`);
          useAcademicStore.getState().setResearchMode(i % 3 === 0);
        }

        expect(useStudentStore.getState().activeView).toBe('student_view_499');
        expect(useStudentStore.getState().careerProgress).toBe(99);

        expect(useAlumniStore.getState().activeView).toBe('alumni_view_499');
        expect(useAlumniStore.getState().mentorMode).toBe(false);

        expect(useCompanyStore.getState().activeView).toBe('company_view_499');
        expect(useCompanyStore.getState().atsBoard).toEqual({ count: 499 });

        expect(useAcademicStore.getState().activeView).toBe('academic_view_499');
        expect(useAcademicStore.getState().researchMode).toBe(false);
      });

      it('store resets are strictly isolated and do not clear sibling stores', () => {
        useStudentStore.getState().setActiveView('student_active');
        useAlumniStore.getState().setActiveView('alumni_active');
        useCompanyStore.getState().setActiveView('company_active');
        useAcademicStore.getState().setActiveView('academic_active');

        // Reset only Student
        useStudentStore.getState().reset();
        expect(useStudentStore.getState().activeView).toBe('feed');
        expect(useAlumniStore.getState().activeView).toBe('alumni_active');
        expect(useCompanyStore.getState().activeView).toBe('company_active');
        expect(useAcademicStore.getState().activeView).toBe('academic_active');

        // Reset only Company
        useCompanyStore.getState().reset();
        expect(useCompanyStore.getState().activeView).toBe('feed');
        expect(useAlumniStore.getState().activeView).toBe('alumni_active');
        expect(useAcademicStore.getState().activeView).toBe('academic_active');
      });

      it('company store atsBoard and activeJobListings handle invalid/non-object arguments defensively', () => {
        // Non-object board
        useCompanyStore.getState().setAtsBoard(null);
        expect(useCompanyStore.getState().atsBoard).toEqual({});

        useCompanyStore.getState().setAtsBoard(undefined);
        expect(useCompanyStore.getState().atsBoard).toEqual({});

        // Non-array listings
        useCompanyStore.getState().setActiveJobListings(null);
        expect(useCompanyStore.getState().activeJobListings).toEqual([]);

        useCompanyStore.getState().setActiveJobListings('not-an-array');
        expect(useCompanyStore.getState().activeJobListings).toEqual([]);

        useCompanyStore.getState().setActiveJobListings({ test: true });
        expect(useCompanyStore.getState().activeJobListings).toEqual([]);
      });
    });
  });

  // ═════════════════════════════════════════════════════════════════
  // PART 3: CONTEXT HOOK FALLBACK & IMMUTABILITY STRESS TEST
  // ═════════════════════════════════════════════════════════════════
  describe('3. Hive Context Hook Fallback & Robustness Stress Test', () => {
    function UniversalConsumer({ hook, testIdPrefix }) {
      const {
        hiveColor,
        hiveName,
        hiveAccent,
        lightBg,
        borderAccent,
        textColor,
        primaryBg,
        hoverBg,
        badgeClass,
        ringColor,
        label,
        labelTr,
        icon,
      } = hook();

      return (
        <div data-testid={`${testIdPrefix}-container`}>
          <span data-testid={`${testIdPrefix}-color`}>{hiveColor}</span>
          <span data-testid={`${testIdPrefix}-name`}>{hiveName}</span>
          <span data-testid={`${testIdPrefix}-accent`}>{hiveAccent}</span>
          <span data-testid={`${testIdPrefix}-lightBg`}>{lightBg}</span>
          <span data-testid={`${testIdPrefix}-borderAccent`}>{borderAccent}</span>
          <span data-testid={`${testIdPrefix}-textColor`}>{textColor}</span>
          <span data-testid={`${testIdPrefix}-primaryBg`}>{primaryBg}</span>
          <span data-testid={`${testIdPrefix}-hoverBg`}>{hoverBg}</span>
          <span data-testid={`${testIdPrefix}-badgeClass`}>{badgeClass}</span>
          <span data-testid={`${testIdPrefix}-ringColor`}>{ringColor}</span>
          <span data-testid={`${testIdPrefix}-label`}>{label}</span>
          <span data-testid={`${testIdPrefix}-labelTr`}>{labelTr}</span>
          <span data-testid={`${testIdPrefix}-icon`}>{icon}</span>
        </div>
      );
    }

    const hiveContextMatrix = [
      {
        hive: 'student',
        hook: useStudentContext,
        Provider: StudentHiveProvider,
        RawContext: StudentHiveContext,
        defaultObj: DEFAULT_STUDENT_HIVE,
        expectedColor: '#990000',
        expectedAccent: 'red',
        expectedLightBg: 'bg-red-50',
        expectedBorderAccent: 'border-red-200',
        expectedTextColor: 'text-[#990000]',
        expectedPrimaryBg: 'bg-[#990000]',
        expectedLabel: 'Student',
        expectedLabelTr: 'Öğrenci',
        expectedIcon: '🎓',
      },
      {
        hive: 'alumni',
        hook: useAlumniContext,
        Provider: AlumniHiveProvider,
        RawContext: AlumniHiveContext,
        defaultObj: DEFAULT_ALUMNI_HIVE,
        expectedColor: '#059669',
        expectedAccent: 'emerald',
        expectedLightBg: 'bg-emerald-50',
        expectedBorderAccent: 'border-emerald-200',
        expectedTextColor: 'text-[#059669]',
        expectedPrimaryBg: 'bg-[#059669]',
        expectedLabel: 'Alumni',
        expectedLabelTr: 'Mezun',
        expectedIcon: '🟢',
      },
      {
        hive: 'company',
        hook: useCompanyContext,
        Provider: CompanyHiveProvider,
        RawContext: CompanyHiveContext,
        defaultObj: DEFAULT_COMPANY_HIVE,
        expectedColor: '#1e3a5f',
        expectedAccent: 'blue',
        expectedLightBg: 'bg-blue-50',
        expectedBorderAccent: 'border-blue-200',
        expectedTextColor: 'text-[#1e3a5f]',
        expectedPrimaryBg: 'bg-[#1e3a5f]',
        expectedLabel: 'Company',
        expectedLabelTr: 'Kurumsal',
        expectedIcon: '🏢',
      },
      {
        hive: 'academic',
        hook: useAcademicContext,
        Provider: AcademicHiveProvider,
        RawContext: AcademicHiveContext,
        defaultObj: DEFAULT_ACADEMIC_HIVE,
        expectedColor: '#7c3aed',
        expectedAccent: 'violet',
        expectedLightBg: 'bg-violet-50',
        expectedBorderAccent: 'border-violet-200',
        expectedTextColor: 'text-[#7c3aed]',
        expectedPrimaryBg: 'bg-[#7c3aed]',
        expectedLabel: 'Academic',
        expectedLabelTr: 'Akademik',
        expectedIcon: '👨‍🏫',
      },
    ];

    describe('Direct hook invocation OUTSIDE of any HiveProvider (Zero Provider Fallback Test)', () => {
      hiveContextMatrix.forEach((cfg) => {
        it(`${cfg.hive} Hive context safely returns full token contract without crashing`, () => {
          const { unmount } = render(<UniversalConsumer hook={cfg.hook} testIdPrefix={`outside-${cfg.hive}`} />);

          expect(screen.getByTestId(`outside-${cfg.hive}-color`).textContent).toBe(cfg.expectedColor);
          expect(screen.getByTestId(`outside-${cfg.hive}-name`).textContent).toBe(cfg.hive);
          expect(screen.getByTestId(`outside-${cfg.hive}-accent`).textContent).toBe(cfg.expectedAccent);
          expect(screen.getByTestId(`outside-${cfg.hive}-lightBg`).textContent).toBe(cfg.expectedLightBg);
          expect(screen.getByTestId(`outside-${cfg.hive}-borderAccent`).textContent).toBe(cfg.expectedBorderAccent);
          expect(screen.getByTestId(`outside-${cfg.hive}-textColor`).textContent).toBe(cfg.expectedTextColor);
          expect(screen.getByTestId(`outside-${cfg.hive}-primaryBg`).textContent).toBe(cfg.expectedPrimaryBg);
          expect(screen.getByTestId(`outside-${cfg.hive}-label`).textContent).toBe(cfg.expectedLabel);
          expect(screen.getByTestId(`outside-${cfg.hive}-labelTr`).textContent).toBe(cfg.expectedLabelTr);
          expect(screen.getByTestId(`outside-${cfg.hive}-icon`).textContent).toBe(cfg.expectedIcon);

          unmount();
        });
      });
    });

    describe('Provider invocation with empty object value prop (value={{}})', () => {
      hiveContextMatrix.forEach((cfg) => {
        it(`${cfg.hive} Provider preserves default tokens when value is an empty object`, () => {
          const { Provider, hook, hive, expectedColor } = cfg;
          const { unmount } = render(
            <Provider value={{}}>
              <UniversalConsumer hook={hook} testIdPrefix={`empty-${hive}`} />
            </Provider>
          );

          expect(screen.getByTestId(`empty-${hive}-color`).textContent).toBe(expectedColor);
          expect(screen.getByTestId(`empty-${hive}-name`).textContent).toBe(hive);

          unmount();
        });
      });
    });

    describe('Provider invocation with null / undefined value prop (Adversarial Value Props)', () => {
      hiveContextMatrix.forEach((cfg) => {
        it(`${cfg.hive} Provider preserves default tokens when value is null`, () => {
          const { Provider, hook, hive, expectedColor } = cfg;
          const { unmount } = render(
            <Provider value={null}>
              <UniversalConsumer hook={hook} testIdPrefix={`null-${hive}`} />
            </Provider>
          );

          expect(screen.getByTestId(`null-${hive}-color`).textContent).toBe(expectedColor);
          expect(screen.getByTestId(`null-${hive}-name`).textContent).toBe(hive);

          unmount();
        });

        it(`${cfg.hive} Provider preserves default tokens when value is undefined`, () => {
          const { Provider, hook, hive, expectedColor } = cfg;
          const { unmount } = render(
            <Provider value={undefined}>
              <UniversalConsumer hook={hook} testIdPrefix={`undef-${hive}`} />
            </Provider>
          );

          expect(screen.getByTestId(`undef-${hive}-color`).textContent).toBe(expectedColor);
          expect(screen.getByTestId(`undef-${hive}-name`).textContent).toBe(hive);

          unmount();
        });
      });
    });

    describe('Raw Context Provider with explicit value={null} (Hook Null Defense)', () => {
      hiveContextMatrix.forEach((cfg) => {
        it(`${cfg.hive} useHiveContext hook safely recovers default tokens when raw context value is null`, () => {
          const { RawContext, hook, hive, expectedColor } = cfg;
          const { unmount } = render(
            <RawContext.Provider value={null}>
              <UniversalConsumer hook={hook} testIdPrefix={`raw-null-${hive}`} />
            </RawContext.Provider>
          );

          expect(screen.getByTestId(`raw-null-${hive}-color`).textContent).toBe(expectedColor);
          expect(screen.getByTestId(`raw-null-${hive}-name`).textContent).toBe(hive);

          unmount();
        });
      });
    });

    describe('Partial Overrides merged seamlessly with Default Tokens', () => {
      hiveContextMatrix.forEach((cfg) => {
        it(`${cfg.hive} Provider correctly merges partial overrides without losing core identity tokens`, () => {
          const { Provider, hook, hive, expectedColor } = cfg;
          const { unmount } = render(
            <Provider value={{ customToken: 'ACTIVE', label: 'OverriddenLabel' }}>
              <UniversalConsumer hook={hook} testIdPrefix={`override-${hive}`} />
            </Provider>
          );

          // Core color and name are preserved
          expect(screen.getByTestId(`override-${hive}-color`).textContent).toBe(expectedColor);
          expect(screen.getByTestId(`override-${hive}-name`).textContent).toBe(hive);
          // Overridden field is updated
          expect(screen.getByTestId(`override-${hive}-label`).textContent).toBe('OverriddenLabel');

          unmount();
        });
      });
    });

    describe('Cross-Context Isolation (Alien Provider Nesting)', () => {
      it('Student hook inside Alumni Provider still resolves Student tokens via separate context channel', () => {
        const { unmount } = render(
          <AlumniHiveProvider value={{ hiveColor: '#059669', hiveName: 'alumni' }}>
            <UniversalConsumer hook={useStudentContext} testIdPrefix="alien-student" />
          </AlumniHiveProvider>
        );

        expect(screen.getByTestId('alien-student-color').textContent).toBe('#990000');
        expect(screen.getByTestId('alien-student-name').textContent).toBe('student');

        unmount();
      });

      it('Company hook inside Academic Provider still resolves Company tokens', () => {
        const { unmount } = render(
          <AcademicHiveProvider value={{ hiveColor: '#7c3aed', hiveName: 'academic' }}>
            <UniversalConsumer hook={useCompanyContext} testIdPrefix="alien-company" />
          </AcademicHiveProvider>
        );

        expect(screen.getByTestId('alien-company-color').textContent).toBe('#1e3a5f');
        expect(screen.getByTestId('alien-company-name').textContent).toBe('company');

        unmount();
      });
    });

    describe('Default Token Object Immutability and Freeze Check', () => {
      hiveContextMatrix.forEach((cfg) => {
        it(`${cfg.hive} DEFAULT token object is frozen and tamper-proof`, () => {
          expect(Object.isFrozen(cfg.defaultObj)).toBe(true);

          // Verify attempting mutation throws in strict mode
          expect(() => {
            'use strict';
            cfg.defaultObj.hiveColor = '#000000';
          }).toThrow();

          expect(() => {
            'use strict';
            cfg.defaultObj.newInjectedField = 'hack';
          }).toThrow();

          // Value remains unmodified
          expect(cfg.defaultObj.hiveColor).toBe(cfg.expectedColor);
        });
      });
    });
  });
});
