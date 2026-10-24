import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFairBooths,
  getFairBoothById,
  joinFairQueue,
  leaveFairQueue,
  getStudentActiveTicket,
  startSpeedInterview,
  completeSpeedInterview,
  getStudentInterviewHistory,
  recalculateBoothQueue,
  GLOBAL_FAIR_BOOTHS,
  resetVirtualFairData
} from '../services/virtualFairWorkflow';

describe('virtualFairWorkflow Unit Tests', () => {
  beforeEach(() => {
    resetVirtualFairData();
    localStorage.clear();
  });

  describe('getFairBooths & getFairBoothById', () => {
    it('returns global fair booths with active recruiters and open positions', () => {
      const booths = getFairBooths();
      expect(booths.length).toBeGreaterThanOrEqual(4);
      expect(booths.some(b => b.name === 'ASELSAN')).toBe(true);
      expect(booths.some(b => b.name.includes('Mercedes'))).toBe(true);
      expect(booths.some(b => b.name.includes('BAYKAR'))).toBe(true);
      expect(booths.some(b => b.name.includes('Siemens'))).toBe(true);
    });

    it('finds booth by id safely with case-insensitivity', () => {
      const aselsan = getFairBoothById('aselsan');
      expect(aselsan).not.toBeNull();
      expect(aselsan.name).toBe('ASELSAN');

      const upper = getFairBoothById('ASELSAN');
      expect(upper).not.toBeNull();
      expect(upper.id).toBe('aselsan');

      expect(getFairBoothById('non_existent')).toBeNull();
      expect(getFairBoothById(null)).toBeNull();
    });
  });

  describe('joinFairQueue & leaveFairQueue', () => {
    it('fails if boothId or student is missing', () => {
      const res1 = joinFairQueue(null, { id: 's1' });
      expect(res1.success).toBe(false);

      const res2 = joinFairQueue('aselsan', null);
      expect(res2.success).toBe(false);
    });

    it('assigns queue ticket and calculates position and wait time', () => {
      const student1 = { id: 's101', name: 'Zeynep Ak', department: 'Yazılım Mühendisliği' };
      const res = joinFairQueue('aselsan', student1);

      expect(res.success).toBe(true);
      expect(res.ticket).toBeDefined();
      expect(res.ticket.ticketNumber).toMatch(/^ASEL-\d+/);
      expect(res.ticket.queuePosition).toBe(1);
      expect(res.ticket.status).toBe('ready'); // 1st in queue is ready
      expect(res.ticket.studentName).toBe('Zeynep Ak');

      // Second student joining same booth
      const student2 = { id: 's102', name: 'Barış Demir', department: 'Elektrik-Elektronik' };
      const res2 = joinFairQueue('aselsan', student2);
      expect(res2.success).toBe(true);
      expect(res2.ticket.queuePosition).toBe(2);
      expect(res2.ticket.status).toBe('waiting');
    });

    it('prevents student from joining multiple active queues simultaneously', () => {
      const student = { id: 's200', name: 'Ahmet Yılmaz' };
      const first = joinFairQueue('aselsan', student);
      expect(first.success).toBe(true);

      // Attempt joining another booth while active ticket exists
      const second = joinFairQueue('baykar', student);
      expect(second.success).toBe(false);
      expect(second.error).toContain('Zaten aktif bir sıranız bulunmaktadır');
    });

    it('allows student to leave queue and frees up active slot', () => {
      const student = { id: 's300', name: 'Caner Kurt' };
      const joinRes = joinFairQueue('siemens', student);
      expect(joinRes.success).toBe(true);

      const activeBefore = getStudentActiveTicket('s300');
      expect(activeBefore).not.toBeNull();

      const left = leaveFairQueue(joinRes.ticket.ticketId);
      expect(left).toBe(true);

      const activeAfter = getStudentActiveTicket('s300');
      expect(activeAfter).toBeNull();
    });
  });

  describe('Speed Interview Lifecycle & Scorecard', () => {
    it('starts speed interview, transitions status to in_interview', () => {
      const student = { id: 's400', name: 'Deniz Yılmaz' };
      const join = joinFairQueue('mercedes', student);
      const ticketId = join.ticket.ticketId;

      const started = startSpeedInterview(ticketId);
      expect(started.success).toBe(true);
      expect(started.ticket.status).toBe('in_interview');
      expect(started.ticket.interviewStartedAt).toBeDefined();
    });

    it('completes speed interview and records evaluation scorecard', () => {
      const student = { id: 's500', name: 'Buse Çetin' };
      const join = joinFairQueue('baykar', student);
      const ticketId = join.ticket.ticketId;

      startSpeedInterview(ticketId);

      const evalData = {
        technicalRating: 5,
        culturalFitRating: 5,
        communicationRating: 4,
        verdict: 'next_round',
        recruiterNotes: 'Mükemmel TEKNOFEST ve Ar-Ge proje portföyü.'
      };

      const completed = completeSpeedInterview(ticketId, evalData);
      expect(completed.success).toBe(true);
      expect(completed.evaluation).toBeDefined();
      expect(completed.evaluation.verdict).toBe('next_round');
      expect(completed.evaluation.technicalRating).toBe(5);

      // Student active ticket should be cleared after completion
      expect(getStudentActiveTicket('s500')).toBeNull();

      // Interview history should record this session
      const history = getStudentInterviewHistory('s500');
      expect(history.length).toBe(1);
      expect(history[0].boothName).toBe('BAYKAR Teknoloji');
    });
  });

  describe('Edge Cases: 7 Global Booth IDs & Queue Advancement Flow', () => {
    it('verifies all 7 global fair booth companies are registered and retrievable', () => {
      const expectedIds = ['aselsan', 'mercedes', 'baykar', 'siemens', 'getir', 'ford', 'trendyol'];
      expectedIds.forEach(id => {
        const booth = getFairBoothById(id);
        expect(booth, `Booth ${id} should exist`).not.toBeNull();
        expect(booth.id).toBe(id);
        expect(booth.name.length).toBeGreaterThan(0);
        expect(booth.estimatedWaitPerPersonMinutes).toBeGreaterThan(0);
      });
      expect(GLOBAL_FAIR_BOOTHS.length).toBeGreaterThanOrEqual(7);
    });

    it('advances queue properly: promoting candidate 2 to ready when candidate 1 leaves', () => {
      const c1 = { id: 'c1', name: 'Caner 1' };
      const c2 = { id: 'c2', name: 'Caner 2' };
      const c3 = { id: 'c3', name: 'Caner 3' };

      const j1 = joinFairQueue('siemens', c1);
      const j2 = joinFairQueue('siemens', c2);
      const j3 = joinFairQueue('siemens', c3);

      expect(j1.ticket.queuePosition).toBe(1);
      expect(j1.ticket.status).toBe('ready');

      expect(j2.ticket.queuePosition).toBe(2);
      expect(j2.ticket.status).toBe('waiting');

      expect(j3.ticket.queuePosition).toBe(3);
      expect(j3.ticket.status).toBe('waiting');

      // Candidate 1 leaves queue
      leaveFairQueue(j1.ticket.ticketId);

      // Verify candidate 2 is now ready at position 1
      const activeC2 = getStudentActiveTicket('c2');
      expect(activeC2).not.toBeNull();
      expect(activeC2.queuePosition).toBe(1);
      expect(activeC2.status).toBe('ready');

      // Verify candidate 3 is now position 2 and waiting
      const activeC3 = getStudentActiveTicket('c3');
      expect(activeC3).not.toBeNull();
      expect(activeC3.queuePosition).toBe(2);
      expect(activeC3.status).toBe('waiting');
    });

    it('holds subsequent candidates as waiting while active candidate is in interview, promoting upon completion', () => {
      const c1 = { id: 'c10', name: 'Ali 1' };
      const c2 = { id: 'c20', name: 'Ali 2' };

      const j1 = joinFairQueue('ford', c1);
      const j2 = joinFairQueue('ford', c2);

      expect(j1.ticket.status).toBe('ready');
      expect(j2.ticket.status).toBe('waiting');

      // Candidate 1 enters interview room
      const started = startSpeedInterview(j1.ticket.ticketId);
      expect(started.success).toBe(true);
      expect(started.ticket.status).toBe('in_interview');

      // Candidate 2 must still be waiting
      const activeC2During = getStudentActiveTicket('c20');
      expect(activeC2During.status).toBe('waiting');

      // Candidate 1 completes interview
      completeSpeedInterview(j1.ticket.ticketId, { technicalRating: 5, verdict: 'next_round' });

      // Now candidate 2 must be promoted to ready at position 1
      const activeC2After = getStudentActiveTicket('c20');
      expect(activeC2After).not.toBeNull();
      expect(activeC2After.queuePosition).toBe(1);
      expect(activeC2After.status).toBe('ready');
    });
  });
});
