import { describe, it, expect } from 'vitest';
import { computeKpi, isEligibleRecord, dedupeLatestByPerson } from '../kpi/compute';

const base = (over) => ({
  status: 'submitted',
  source: 'self_report',
  updatedAt: '2026-01-01T00:00:00.000Z',
  period: '2026-H1',
  departmentId: 'dept-yazilim',
  ...over,
});

describe('eligibility', () => {
  it('rejects draft and missing source', () => {
    expect(isEligibleRecord(base({ status: 'draft' }))).toBe(false);
    expect(isEligibleRecord(base({ source: '' }))).toBe(false);
    expect(isEligibleRecord(base({}))).toBe(true);
  });
});

describe('alumni_employment_rate', () => {
  it('Test1: 12 alumni 9 employed → ok 75.0 n=12', () => {
    const records = Array.from({ length: 12 }, (_, i) =>
      base({ alumniId: `a${i}`, employed: i < 9 })
    );
    const r = computeKpi('alumni_employment_rate', records, { period: '2026-H1' });
    expect(r.status).toBe('ok');
    expect(r.value).toBe(75.0);
    expect(r.denominator).toBe(12);
    expect(r.numerator).toBe(9);
  });

  it('Test2: 9 alumni → insufficient', () => {
    const records = Array.from({ length: 9 }, (_, i) =>
      base({ alumniId: `a${i}`, employed: true })
    );
    const r = computeKpi('alumni_employment_rate', records, {});
    expect(r.status).toBe('insufficient');
    expect(r.value).toBeNull();
    expect(r.denominator).toBe(9);
  });

  it('Test3: dedupe keeps latest employed:true', () => {
    const records = [
      base({ alumniId: 'x', employed: false, updatedAt: '2026-01-01T00:00:00.000Z' }),
      base({ alumniId: 'x', employed: true, updatedAt: '2026-02-01T00:00:00.000Z' }),
      ...Array.from({ length: 9 }, (_, i) => base({ alumniId: `b${i}`, employed: true })),
    ];
    const r = computeKpi('alumni_employment_rate', records, {});
    expect(r.denominator).toBe(10);
    expect(r.numerator).toBe(10);
    expect(r.status).toBe('ok');
    expect(r.value).toBe(100);
  });

  it('Test4: draft not counted', () => {
    const records = [
      base({ alumniId: 'd1', employed: true, status: 'draft' }),
      ...Array.from({ length: 10 }, (_, i) => base({ alumniId: `a${i}`, employed: true })),
    ];
    const r = computeKpi('alumni_employment_rate', records, {});
    expect(r.denominator).toBe(10);
  });

  it('Test5: other department excluded for academic scope', () => {
    const records = [
      ...Array.from({ length: 10 }, (_, i) =>
        base({ alumniId: `a${i}`, employed: true, departmentId: 'dept-yazilim' })
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        base({ alumniId: `o${i}`, employed: true, departmentId: 'dept-other' })
      ),
    ];
    const r = computeKpi('alumni_employment_rate', records, { departmentId: 'dept-yazilim' });
    expect(r.denominator).toBe(10);
  });

  it('empty → empty status', () => {
    const r = computeKpi('alumni_employment_rate', [], {});
    expect(r.status).toBe('empty');
    expect(r.value).toBeNull();
  });
});

describe('major_relevance_rate', () => {
  it('10 employed 6 related → 60.0; blank related stays in denom', () => {
    const records = Array.from({ length: 10 }, (_, i) =>
      base({
        alumniId: `a${i}`,
        employed: true,
        relatedToMajor: i < 6 ? true : i === 6 ? undefined : false,
      })
    );
    const r = computeKpi('major_relevance_rate', records, {});
    expect(r.status).toBe('ok');
    expect(r.denominator).toBe(10);
    expect(r.numerator).toBe(6);
    expect(r.value).toBe(60.0);
  });
});

describe('placement_90d_rate', () => {
  it('90th day inclusive, 91st exclusive', () => {
    const records = [
      base({
        alumniId: 'p1',
        employed: true,
        graduationDate: '2026-06-30',
        startDate: '2026-09-28', // 90 days
      }),
      base({
        alumniId: 'p2',
        employed: true,
        graduationDate: '2026-06-30',
        startDate: '2026-09-29', // 91 days
      }),
      ...Array.from({ length: 8 }, (_, i) =>
        base({
          alumniId: `p${i + 3}`,
          employed: true,
          graduationDate: '2026-06-30',
          startDate: '2026-07-15',
        })
      ),
    ];
    const r = computeKpi('placement_90d_rate', records, {});
    expect(r.denominator).toBe(10);
    expect(r.numerator).toBe(9); // p2 excluded
    expect(r.status).toBe('ok');
  });

  it('missing graduationDate excluded from denominator', () => {
    const records = [
      base({ alumniId: 'x', employed: true, startDate: '2026-07-01' }),
      ...Array.from({ length: 10 }, (_, i) =>
        base({
          alumniId: `y${i}`,
          employed: true,
          graduationDate: '2026-06-01',
          startDate: '2026-06-10',
        })
      ),
    ];
    const r = computeKpi('placement_90d_rate', records, {});
    expect(r.denominator).toBe(10);
  });
});

describe('internship_completion_rate', () => {
  it('6 internships → 66.7 with advisor filter', () => {
    const records = [
      { id: 1, advisorId: 'adv1', advisorStatus: 'approved', companyStatus: 'completed', status: 'active' },
      { id: 2, advisorId: 'adv1', advisorStatus: 'approved', companyStatus: 'completed', status: 'active' },
      { id: 3, advisorId: 'adv1', advisorStatus: 'approved', companyStatus: 'completed', status: 'active' },
      { id: 4, advisorId: 'adv1', advisorStatus: 'approved', companyStatus: 'completed', status: 'active' },
      { id: 5, advisorId: 'adv1', advisorStatus: 'pending', companyStatus: 'completed', status: 'active' },
      { id: 6, advisorId: 'adv1', advisorStatus: 'pending', companyStatus: 'pending', status: 'active' },
      { id: 7, advisorId: 'other', advisorStatus: 'approved', companyStatus: 'completed', status: 'active' },
    ];
    const r = computeKpi('internship_completion_rate', records, { advisorId: 'adv1' });
    expect(r.denominator).toBe(6);
    expect(r.numerator).toBe(4);
    expect(r.value).toBe(66.7);
    expect(r.status).toBe('ok');
  });
});

describe('placements_per_job', () => {
  it('4 jobs 6 accepted → 1.5', () => {
    const jobs = [
      { id: 'j1', status: 'Aktif' },
      { id: 'j2', status: 'Aktif' },
      { id: 'j3', status: 'Aktif' },
      { id: 'j4', status: 'Aktif' },
    ];
    const applications = Array.from({ length: 6 }, (_, i) => ({
      id: `a${i}`,
      jobId: jobs[i % 4].id,
      decision: 'accepted',
    }));
    const r = computeKpi('placements_per_job', { jobs, applications }, { jobs, applications });
    expect(r.status).toBe('ok');
    expect(r.value).toBe(1.5);
    expect(r.denominator).toBe(4);
    expect(r.numerator).toBe(6);
  });
});

describe('event_attendance_rate', () => {
  it('20 registered 13 check-in → 65; 4 → insufficient', () => {
    const twenty = Array.from({ length: 20 }, (_, i) => ({
      userId: `u${i}`,
      checkedInAt: i < 13 ? '2026-01-01' : null,
    }));
    const r = computeKpi('event_attendance_rate', twenty, {});
    expect(r.value).toBe(65.0);
    expect(r.status).toBe('ok');
    const four = twenty.slice(0, 4);
    const r2 = computeKpi('event_attendance_rate', four, {});
    expect(r2.status).toBe('insufficient');
    expect(r2.value).toBeNull();
  });
});

describe('survey_response_rate', () => {
  it('50 invites 0 responses → ok 0.0; 0 invites → empty', () => {
    const invites = Array.from({ length: 50 }, (_, i) => ({ userId: `u${i}` }));
    const r = computeKpi('survey_response_rate', invites, { responses: [] });
    expect(r.status).toBe('ok');
    expect(r.value).toBe(0.0);
    expect(r.denominator).toBe(50);
    const empty = computeKpi('survey_response_rate', [], { responses: [] });
    expect(empty.status).toBe('empty');
    expect(empty.value).toBeNull();
  });
});
