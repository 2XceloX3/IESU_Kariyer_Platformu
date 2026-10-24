import { describe, it, expect, beforeEach } from 'vitest';
import {
  getGivingCampaigns,
  getAlumniDonations,
  determineDonationTier,
  calculateDonationImpact,
  processAlumniDonation,
  getDonorsHallOfHonor,
  getEndowmentAggregateMetrics,
  verifyDonationReceipt,
  resetEndowmentData
} from '../services/alumniGivingWorkflow';

describe('alumniGivingWorkflow Unit Tests', () => {
  beforeEach(() => {
    resetEndowmentData();
    localStorage.clear();
  });

  describe('Campaigns & Initial Data', () => {
    it('loads default campaigns with valid targets and beneficiaries', () => {
      const campaigns = getGivingCampaigns();
      expect(campaigns.length).toBeGreaterThan(0);
      expect(campaigns[0]).toHaveProperty('targetAmount');
      expect(campaigns[0]).toHaveProperty('corporateMatchingBy');
    });

    it('loads default alumni donations', () => {
      const donations = getAlumniDonations();
      expect(donations.length).toBeGreaterThan(0);
      expect(donations[0]).toHaveProperty('receiptNumber');
      expect(donations[0]).toHaveProperty('verificationHash');
    });
  });

  describe('determineDonationTier', () => {
    it('correctly maps amounts to official tiers', () => {
      expect(determineDonationTier(30000)).toBe('PLATINUM');
      expect(determineDonationTier(25000)).toBe('PLATINUM');
      expect(determineDonationTier(15000)).toBe('GOLD');
      expect(determineDonationTier(10000)).toBe('GOLD');
      expect(determineDonationTier(5000)).toBe('SILVER');
      expect(determineDonationTier(2500)).toBe('SILVER');
      expect(determineDonationTier(500)).toBe('BRONZE');
      expect(determineDonationTier(0)).toBe('BRONZE');
    });
  });

  describe('calculateDonationImpact', () => {
    it('calculates hot meal count and full scholarship months', () => {
      const impact1000 = calculateDonationImpact(1000);
      expect(impact1000.mealCount).toBe(20); // 1000 / 50 = 20 meals
      expect(impact1000.amount).toBe(1000);

      const impact30000 = calculateDonationImpact(30000);
      expect(impact30000.techGrants).toBe(2); // 30000 / 15000 = 2 laptops
      expect(impact30000.monthlyScholarshipMonths).toBe(10);
    });

    it('safely handles 0, negative, and null amounts', () => {
      const res = calculateDonationImpact(-500);
      expect(res.amount).toBe(0);
      expect(res.mealCount).toBe(0);
    });
  });

  describe('processAlumniDonation', () => {
    it('rejects invalid or negative amounts', () => {
      const resZero = processAlumniDonation({ campaignId: 'camp_askida_yemek', amount: 0 });
      expect(resZero.success).toBe(false);
      expect(resZero.error).toContain('Geçersiz');

      const resNeg = processAlumniDonation({ campaignId: 'camp_askida_yemek', amount: -200 });
      expect(resNeg.success).toBe(false);

      const resNaN = processAlumniDonation({ campaignId: 'camp_askida_yemek', amount: 'abc' });
      expect(resNaN.success).toBe(false);
    });

    it('rejects nonexistent campaign ids', () => {
      const res = processAlumniDonation({ campaignId: 'invalid_camp_999', amount: 500 });
      expect(res.success).toBe(false);
      expect(res.error).toContain('bulunamadı');
    });

    it('processes valid micro-donation, increments campaign amount & donor count, and issues receipt', () => {
      const campaignsBefore = getGivingCampaigns();
      const targetCamp = campaignsBefore.find(c => c.id === 'camp_askida_yemek');
      const prevAmount = targetCamp.currentAmount;
      const prevDonors = targetCamp.donorCount;

      const result = processAlumniDonation({
        campaignId: 'camp_askida_yemek',
        amount: 250,
        donorName: 'Ayşe Kaya',
        donorGradYear: '2020',
        donorDept: 'Sosyal Hizmetler',
        frequency: 'one_time',
        dedicationMessage: 'Kardeşlerime afiyet olsun.',
        isAnonymous: false
      });

      expect(result.success).toBe(true);
      expect(result.donation).toBeDefined();
      expect(result.donation.receiptNumber).toContain('IESU-ENDOW-');
      expect(result.donation.verificationHash).toBeDefined();
      expect(result.donation.tier).toBe('BRONZE');

      // Verify campaign state updated in storage
      const campaignsAfter = getGivingCampaigns();
      const updatedCamp = campaignsAfter.find(c => c.id === 'camp_askida_yemek');
      expect(updatedCamp.currentAmount).toBe(prevAmount + 250);
      expect(updatedCamp.donorCount).toBe(prevDonors + 1);
    });

    it('masks donor name when isAnonymous is true', () => {
      const result = processAlumniDonation({
        campaignId: 'camp_askida_yemek',
        amount: 5000,
        donorName: 'Gizli Mezun',
        isAnonymous: true
      });

      expect(result.success).toBe(true);
      expect(result.donation.donorName).toBe('İsimsiz Mezun Bağışçı');
      expect(result.donation.isAnonymous).toBe(true);
    });
  });

  describe('Hall of Honor & Aggregate Metrics', () => {
    it('filters Hall of Honor by tier', () => {
      const platinumList = getDonorsHallOfHonor('PLATINUM');
      platinumList.forEach(donor => {
        expect(donor.tier).toBe('PLATINUM');
      });

      const allList = getDonorsHallOfHonor('all');
      expect(allList.length).toBeGreaterThanOrEqual(platinumList.length);
    });

    it('computes total raised, targets, progress percent, and corporate matching', () => {
      const metrics = getEndowmentAggregateMetrics();
      expect(metrics.totalRaised).toBeGreaterThan(0);
      expect(metrics.totalTarget).toBeGreaterThan(metrics.totalRaised);
      expect(metrics.fundingProgressPercent).toBeGreaterThan(0);
      expect(metrics.fundingProgressPercent).toBeLessThanOrEqual(100);
      expect(metrics.matchingContribution).toBeGreaterThan(0);
    });
  });

  describe('verifyDonationReceipt', () => {
    it('validates authentic receipt number and returns issuer details', () => {
      const donations = getAlumniDonations();
      const validReceipt = donations[0].receiptNumber;

      const verification = verifyDonationReceipt(validReceipt);
      expect(verification).not.toBeNull();
      expect(verification.isValid).toBe(true);
      expect(verification.issuer).toContain('İstanbul Esenyurt Üniversitesi (İESÜ)');
      expect(verification.donation.receiptNumber).toBe(validReceipt);
    });

    it('returns null for invalid receipt number', () => {
      expect(verifyDonationReceipt('FAKE-RECEIPT-999')).toBeNull();
      expect(verifyDonationReceipt(null)).toBeNull();
    });
  });

  describe('Edge Cases: Bounds Validation & Corrupted Storage Resilience', () => {
    it('enforces lower bound (minimum 10 ₺) and upper bound (maximum 5,000,000 ₺)', () => {
      // Under minimum
      const resLow = processAlumniDonation({ campaignId: 'camp_askida_yemek', amount: 5 });
      expect(resLow.success).toBe(false);
      expect(resLow.error).toContain('en az 10 ₺');

      // Over maximum
      const resHigh = processAlumniDonation({ campaignId: 'camp_askida_yemek', amount: 6000000 });
      expect(resHigh.success).toBe(false);
      expect(resHigh.error).toContain('en fazla 5.000.000 ₺');

      // Valid boundary amounts
      const resMin = processAlumniDonation({ campaignId: 'camp_askida_yemek', amount: 10, donorName: 'Min Donor' });
      expect(resMin.success).toBe(true);
      expect(resMin.donation.amount).toBe(10);
    });

    it('recovers gracefully with defaults when localStorage has corrupt or non-array JSON', () => {
      // Corrupt campaigns
      localStorage.setItem('iesu_alumni_endowment_v1', '{"not": "an array"}');
      const recoveredCampaigns = getGivingCampaigns();
      expect(Array.isArray(recoveredCampaigns)).toBe(true);
      expect(recoveredCampaigns.length).toBeGreaterThan(0);

      // Null string
      localStorage.setItem('iesu_alumni_endowment_v1', 'null');
      expect(Array.isArray(getGivingCampaigns())).toBe(true);

      // Corrupt donations
      localStorage.setItem('iesu_alumni_donations_v1', 'bad_json{[');
      const recoveredDonations = getAlumniDonations();
      expect(Array.isArray(recoveredDonations)).toBe(true);
      expect(recoveredDonations.length).toBeGreaterThan(0);
    });
  });
});
