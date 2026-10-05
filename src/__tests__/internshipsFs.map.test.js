
import { describe, it, expect } from 'vitest';
import { mapInternshipToPanelStatus } from '../services/internshipMap';

describe('mapInternshipToPanelStatus', () => {
  it('returns null for empty', () => {
    expect(mapInternshipToPanelStatus(null)).toBeNull();
  });

  it('maps Firestore row to panel status', () => {
    const mapped = mapInternshipToPanelStatus({
      id: 'INT-1',
      studentId: 'uid1',
      company: 'Acme',
      type: 'Zorunlu Staj',
      status: 'Onaylandı',
      reviewerName: 'Dr. X',
      reviewedAt: '2026-10-01T12:00:00.000Z',
    });
    expect(mapped.company).toBe('Acme');
    expect(mapped.role).toBe('Zorunlu Staj');
    expect(mapped.status).toBe('Onaylandı');
    expect(mapped.advisor).toBe('Dr. X');
    expect(mapped.studentId).toBe('uid1');
    expect(typeof mapped.approvedDate).toBe('string');
    expect(mapped.approvedDate.length).toBeGreaterThan(0);
  });
});
