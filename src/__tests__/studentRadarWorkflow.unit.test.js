import { describe, it, expect } from 'vitest';
import {
  RADAR_STAGES,
  RADAR_STAGE_ORDER,
  PROTOCOL_VIP_BADGE,
  COFFEE_CHAT_TOPICS,
  COFFEE_CHAT_STATUS,
  isProtocolCompany,
  enrichApplicationWithRadar,
  advanceRadarStage,
  calculateRadarStatistics,
  generateMockRadarApplications,
  calculateCareerReadinessScore
} from '../services/studentRadarWorkflow';

describe('studentRadarWorkflow Unit Tests', () => {
  describe('Constants & Configuration', () => {
    it('defines all 5 stages in RADAR_STAGES with required metadata', () => {
      expect(RADAR_STAGES.SUBMITTED).toBeDefined();
      expect(RADAR_STAGES.HR_VIEWED).toBeDefined();
      expect(RADAR_STAGES.SHORTLISTED_TOP_15).toBeDefined();
      expect(RADAR_STAGES.INTERVIEW_INVITE).toBeDefined();
      expect(RADAR_STAGES.DETAILED_FEEDBACK).toBeDefined();

      expect(RADAR_STAGES.SUBMITTED.stepNumber).toBe(1);
      expect(RADAR_STAGES.HR_VIEWED.stepNumber).toBe(2);
      expect(RADAR_STAGES.SHORTLISTED_TOP_15.stepNumber).toBe(3);
      expect(RADAR_STAGES.INTERVIEW_INVITE.stepNumber).toBe(4);
      expect(RADAR_STAGES.DETAILED_FEEDBACK.stepNumber).toBe(4);

      expect(RADAR_STAGES.INTERVIEW_INVITE.isTerminal).toBe(true);
      expect(RADAR_STAGES.DETAILED_FEEDBACK.isTerminal).toBe(true);
    });

    it('contains institutional Protocol VIP badge specification', () => {
      expect(PROTOCOL_VIP_BADGE.title).toBe('İESÜ Protokol Kontenjanı');
      expect(PROTOCOL_VIP_BADGE.tagline).toContain('Rektörlük Kurumsal Protokolü');
    });

    it('defines 15-minute coffee chat topics and statuses', () => {
      expect(COFFEE_CHAT_TOPICS.length).toBeGreaterThanOrEqual(4);
      expect(COFFEE_CHAT_TOPICS.some((t) => t.id === 'cv_review')).toBe(true);
      expect(COFFEE_CHAT_TOPICS.some((t) => t.id === 'industry_advice')).toBe(true);
      expect(COFFEE_CHAT_STATUS.PENDING.label).toBe('Onay Bekliyor');
      expect(COFFEE_CHAT_STATUS.CONFIRMED.label).toContain('Onaylandı');
    });
  });

  describe('isProtocolCompany matcher', () => {
    it('identifies official protocol partners like Aselsan, Baykar, Trendyol', () => {
      const p1 = isProtocolCompany('Aselsan A.Ş.');
      expect(p1).not.toBeNull();
      expect(p1.companyName).toMatch(/Aselsan/i);

      const p2 = isProtocolCompany('Baykar Teknoloji');
      expect(p2).not.toBeNull();

      const p3 = isProtocolCompany('Trendyol');
      expect(p3).not.toBeNull();
    });

    it('identifies local employment desk protocols (ESBİM, İŞKUR)', () => {
      const esbim = isProtocolCompany('Esenyurt Belediyesi İstihdam Merkezi (ESBİM)');
      expect(esbim).not.toBeNull();

      const iskur = isProtocolCompany('İŞKUR');
      expect(iskur).not.toBeNull();
    });

    it('returns null for unknown independent companies', () => {
      expect(isProtocolCompany('Bilinmeyen Butik Kafe')).toBeNull();
      expect(isProtocolCompany('')).toBeNull();
      expect(isProtocolCompany(null)).toBeNull();
    });
  });

  describe('enrichApplicationWithRadar', () => {
    it('correctly tags protocol companies with VIP status and timeline', () => {
      const app = {
        id: 'APP-1',
        title: 'Yazılım Stajyeri',
        company: 'Aselsan',
        status: 'Onay Bekliyor'
      };

      const enriched = enrichApplicationWithRadar(app);
      expect(enriched.isProtocolVIP).toBe(true);
      expect(enriched.radarStage).toBe('SUBMITTED');
      expect(enriched.timeline).toBeInstanceOf(Array);
      expect(enriched.timeline.length).toBeGreaterThanOrEqual(1);
      expect(enriched.timeline[0].stage).toBe('SUBMITTED');
      expect(enriched.percentileRank).toBeLessThanOrEqual(15);
    });

    it('auto-builds intermediate steps if stage is already advanced', () => {
      const app = {
        id: 'APP-2',
        title: 'Frontend Stajyeri',
        company: 'Örnek Teknoloji',
        radarStage: 'SHORTLISTED_TOP_15'
      };

      const enriched = enrichApplicationWithRadar(app);
      expect(enriched.timeline.some((t) => t.stage === 'SUBMITTED')).toBe(true);
      expect(enriched.timeline.some((t) => t.stage === 'HR_VIEWED')).toBe(true);
      expect(enriched.timeline.some((t) => t.stage === 'SHORTLISTED_TOP_15')).toBe(true);
    });

    it('attaches structured feedback when stage is DETAILED_FEEDBACK', () => {
      const app = {
        id: 'APP-3',
        title: 'Veri Analisti',
        company: 'Baykar',
        radarStage: 'DETAILED_FEEDBACK'
      };

      const enriched = enrichApplicationWithRadar(app);
      expect(enriched.feedback).toBeDefined();
      expect(enriched.feedback.strengths).toBeInstanceOf(Array);
      expect(enriched.feedback.missingSkills).toBeInstanceOf(Array);
      expect(enriched.feedback.suggestedSemCourse).toBeDefined();
    });

    it('handles null/undefined gracefully', () => {
      expect(enrichApplicationWithRadar(null)).toBeNull();
      expect(enrichApplicationWithRadar(undefined)).toBeNull();
    });
  });

  describe('advanceRadarStage', () => {
    it('transitions an application to HR_VIEWED and records inspection note', () => {
      const initial = enrichApplicationWithRadar({ id: 'APP-TEST', company: 'Trendyol' });
      const updated = advanceRadarStage(initial, 'HR_VIEWED', {
        reviewer: 'İK Uzmanı Melis Kaya',
        note: 'Özgeçmiş 5 dakika incelendi.'
      });

      expect(updated.radarStage).toBe('HR_VIEWED');
      expect(updated.hrViewedAt).toBeDefined();
      const lastTimeline = updated.timeline[updated.timeline.length - 1];
      expect(lastTimeline.stage).toBe('HR_VIEWED');
      expect(lastTimeline.reviewer).toBe('İK Uzmanı Melis Kaya');
    });

    it('transitions to INTERVIEW_INVITE with meeting link', () => {
      const initial = enrichApplicationWithRadar({ id: 'APP-TEST-2', company: 'Ford Otosan' });
      const updated = advanceRadarStage(initial, 'INTERVIEW_INVITE', {
        meetingLink: 'https://meet.google.com/test-meet'
      });

      expect(updated.radarStage).toBe('INTERVIEW_INVITE');
      expect(updated.interviewDetails).toBeDefined();
      expect(updated.interviewDetails.link).toBe('https://meet.google.com/test-meet');
    });

    it('ignores invalid stage names without crashing', () => {
      const initial = enrichApplicationWithRadar({ id: 'APP-TEST-3', company: 'Turkcell' });
      const updated = advanceRadarStage(initial, 'INVALID_UNKNOWN_STAGE');
      expect(updated.radarStage).toBe('SUBMITTED');
    });
  });

  describe('calculateRadarStatistics', () => {
    it('accurately computes summary metrics', () => {
      const apps = [
        { radarStage: 'SUBMITTED', isProtocolVIP: true },
        { radarStage: 'HR_VIEWED', isProtocolVIP: true },
        { radarStage: 'SHORTLISTED_TOP_15', isProtocolVIP: false },
        { radarStage: 'INTERVIEW_INVITE', isProtocolVIP: false },
        { radarStage: 'DETAILED_FEEDBACK', isProtocolVIP: true }
      ];

      const stats = calculateRadarStatistics(apps);
      expect(stats.totalApplications).toBe(5);
      expect(stats.submittedCount).toBe(1);
      expect(stats.hrViewedCount).toBe(1);
      expect(stats.shortlistedCount).toBe(1);
      expect(stats.interviewCount).toBe(1);
      expect(stats.feedbackCount).toBe(1);
      expect(stats.protocolVIPCount).toBe(3);
      expect(stats.activeProcessCount).toBe(3); // submitted + hrViewed + shortlisted
    });

    it('handles empty and undefined inputs safely', () => {
      const stats = calculateRadarStatistics([]);
      expect(stats.totalApplications).toBe(0);
      expect(stats.protocolVIPCount).toBe(0);

      const nullStats = calculateRadarStatistics(null);
      expect(nullStats.totalApplications).toBe(0);
    });
  });

  describe('generateMockRadarApplications', () => {
    it('creates diverse mock radar applications for student', () => {
      const user = { id: 'STU-100', name: 'Alperen Yılmaz' };
      const mocks = generateMockRadarApplications(user);

      expect(mocks.length).toBeGreaterThanOrEqual(4);
      expect(mocks.some((m) => m.company === 'Aselsan')).toBe(true);
      expect(mocks.some((m) => m.company === 'Trendyol')).toBe(true);
      expect(mocks.some((m) => m.radarStage === 'INTERVIEW_INVITE')).toBe(true);
      expect(mocks.some((m) => m.radarStage === 'DETAILED_FEEDBACK')).toBe(true);
    });
  });

  describe('calculateCareerReadinessScore', () => {
    it('calculates 100% score when student has all credentials', () => {
      const result = calculateCareerReadinessScore({
        student: { department: 'Yazılım Mühendisliği', gpa: 3.8, cvData: { summary: 'Dev' } },
        internships: [{ status: 'Başarılı (S / Geçti)' }],
        semCertificates: [{ id: 1 }, { id: 2 }, { id: 3 }],
        clubMemberships: [{ id: 'club-1' }],
        coffeeChats: [{ status: 'CONFIRMED' }]
      });

      expect(result.score).toBe(100);
      expect(result.level).toContain('Elit Aday');
      expect(result.missingItems.length).toBe(0);
    });

    it('awards 25 points for 3308 SGK internship and produces smart recommendations when missing', () => {
      const missingInternship = calculateCareerReadinessScore({
        student: { department: 'İşletme' },
        internships: [],
        semCertificates: [],
        clubMemberships: [],
        coffeeChats: []
      });

      expect(missingInternship.score).toBeLessThanOrEqual(30);
      expect(missingInternship.missingItems.length).toBeGreaterThan(0);
      expect(missingInternship.missingItems.some((item) => item.id === 'missing_internship')).toBe(true);
      expect(missingInternship.missingItems.find((i) => i.id === 'missing_internship').targetView).toBe('staj');
    });

    it('suggests 15-minute coffee chat when student has not engaged with alumni', () => {
      const noChat = calculateCareerReadinessScore({
        student: { department: 'Bilgisayar Mühendisliği' },
        internships: [{ status: 'SGK Girişi Yapıldı' }],
        semCertificates: [{ id: 1 }],
        clubMemberships: [{ id: 1 }],
        coffeeChats: []
      });

      expect(noChat.score).toBeGreaterThan(50);
      expect(noChat.allMissingItems.some((m) => m.id === 'missing_coffee_chat')).toBe(true);
    });

    it('awards 5 partial points for pending coffee chat request', () => {
      const pendingResult = calculateCareerReadinessScore({
        student: { department: 'Yazılım Mühendisliği', cvData: { title: 'Junior' } },
        internships: [{ status: 'Onaylandı' }],
        semCertificates: [{ id: 1 }, { id: 2 }],
        clubMemberships: [{ id: 'club-dev' }],
        coffeeChats: [{ status: 'PENDING' }]
      });

      expect(pendingResult.score).toBe(85); // 20 (CV) + 25 (internship) + 20 (2 SEM) + 15 (club) + 5 (pending chat)
      const chatItem = pendingResult.breakdown.find((b) => b.label.includes('Onay Bekliyor'));
      expect(chatItem).toBeDefined();
      expect(chatItem.points).toBe(5);
    });

    it('handles completely empty or null arguments safely', () => {
      const emptyResult = calculateCareerReadinessScore();
      expect(emptyResult.score).toBe(5); // Baseline minimal
      expect(emptyResult.level).toContain('Geliştirilmeli');
      expect(emptyResult.missingItems.length).toBeGreaterThan(0);
    });
  });

  describe('Adversarial & Edge Cases', () => {
    it('isProtocolCompany handles unconventional protocol structures gracefully', () => {
      const customProtocols = [
        { name: 'TUSAŞ Türk Havacılık', protocolCode: 'TUSAS-01', sector: 'Havacılık' },
        { company: 'Roketsan Füze Sanayii', protocolCode: 'ROKET-01', sector: 'Savunma' }
      ];

      expect(isProtocolCompany('tusas', customProtocols)).not.toBeNull();
      expect(isProtocolCompany('ROKETSAN', customProtocols)).not.toBeNull();
      expect(isProtocolCompany('   ', customProtocols)).toBeNull();
    });

    it('calculateRadarStatistics handles 100+ applications accurately without overflow or NaN', () => {
      const heavyList = Array.from({ length: 150 }, (_, i) => ({
        id: `APP-${i}`,
        radarStage: i % 4 === 0 ? 'SUBMITTED' : i % 4 === 1 ? 'HR_VIEWED' : i % 4 === 2 ? 'SHORTLISTED_TOP_15' : 'INTERVIEW_INVITE',
        isProtocolVIP: i % 3 === 0
      }));

      const stats = calculateRadarStatistics(heavyList);
      expect(stats.totalApplications).toBe(150);
      expect(stats.protocolVIPCount).toBe(50);
      expect(stats.activeProcessCount).toBeGreaterThan(100);
    });
  });
});
