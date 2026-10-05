import { describe, it, expect } from 'vitest';
import { computeCareerProgress, gradeFromPercent } from '../utils/careerProgress';

describe('computeCareerProgress', () => {
  it('returns null percent without user id', () => {
    expect(computeCareerProgress({}).percent).toBeNull();
    expect(computeCareerProgress({ user: { name: 'X' } }).percent).toBeNull();
  });

  it('scores 0 when user has id but no signals', () => {
    const r = computeCareerProgress({ user: { id: 'u1' } });
    expect(r.percent).toBe(0);
    expect(r.done).toBe(0);
  });

  it('counts each of the five signals once (20% each)', () => {
    const user = {
      id: 'u1',
      name: 'Ali',
      department: 'Yazılım',
      email: 'a@test.com',
      careerTestCompleted: true,
      mapTaskDone: true,
      cvSaved: true,
    };
    const apps = [{ applicantId: 'u1', jobId: 'j1' }];
    const r = computeCareerProgress({ user, applications: apps });
    expect(r.percent).toBe(100);
    expect(r.done).toBe(5);
  });

  it('does not invent score from empty applications', () => {
    const r = computeCareerProgress({
      user: { id: 'u1', name: 'Ali', department: 'Yazılım', email: 'a@x.com' },
      applications: [],
    });
    expect(r.percent).toBe(20); // profile only
    expect(r.signals.hasApplication).toBe(false);
  });
});

describe('gradeFromPercent', () => {
  it('maps null to Veri yok', () => {
    expect(gradeFromPercent(null).letter).toBe('—');
  });
  it('maps 80+ to A+', () => {
    expect(gradeFromPercent(80).letter).toBe('A+');
  });
});
