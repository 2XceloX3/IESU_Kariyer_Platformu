/**
 * alumniGivingWorkflow.js
 * 
 * İstanbul Esenyurt Üniversitesi (İESÜ) Mezunlar Portalı & Rektörlük
 * Mezun Bağış, Burs Fonu & Sosyal Etki Motoru (Alumni Giving & Endowment Fund)
 * 
 * Küresel ölçekte Harvard, Oxford, Koç ve Sabancı gibi öncü üniversitelerin
 * mezun bağış ekosistemi model alınarak geliştirilmiştir.
 */

const STORAGE_KEY_CAMPAIGNS = 'iesu_alumni_endowment_v1';
const STORAGE_KEY_DONATIONS = 'iesu_alumni_donations_v1';

export const DONATION_TIERS = {
  PLATINUM: { label: 'Platin Şeref Kürsüsü', min: 25000, badge: '💎 Platin Bağışçı', color: 'from-amber-400 to-yellow-600' },
  GOLD: { label: 'Altın Bağışçı', min: 10000, badge: '🥇 Altın Bağışçı', color: 'from-yellow-400 to-amber-500' },
  SILVER: { label: 'Gümüş Bağışçı', min: 2500, badge: '🥈 Gümüş Bağışçı', color: 'from-slate-300 to-slate-400' },
  BRONZE: { label: 'Mezun Destekçi', min: 100, badge: '🥉 Mezun Destekçi', color: 'from-emerald-400 to-teal-600' }
};

export const INITIAL_CAMPAIGNS = [
  {
    id: 'camp_muhendislik_100',
    title: 'Cumhuriyetin 100. Yılı Geleceğin Mühendisleri Burs Fonu',
    category: 'Mühendislik & Teknoloji',
    targetAmount: 500000,
    currentAmount: 395000,
    donorCount: 148,
    daysLeft: 42,
    beneficiaryCount: 25,
    corporateMatchingBy: 'Baykar & Aselsan Mezunlar Ağı (1:1 Eşleşme)',
    description: 'Mühendislik Fakültesi bünyesinde Ar-Ge ve TEKNOFEST projeleri geliştiren başarılı öğrencilere 9 aylık tam burs ve donanım desteği sağlar.',
    status: 'active'
  },
  {
    id: 'camp_askida_yemek',
    title: 'Askıda Sıcak Yemek: Öğrenci Yemekhane Fonu',
    category: 'Sosyal Dayanışma',
    targetAmount: 150000,
    currentAmount: 122500,
    donorCount: 312,
    daysLeft: 60,
    beneficiaryCount: 150,
    corporateMatchingBy: 'İESÜ Vakıf Heyeti Eşleşmesi (1:1 Katkı)',
    description: 'Her 50 ₺ bağışınız, ihtiyaç sahibi bir öğrencimizin kampüs yemekhanesinde 1 sıcak ve sağlıklı tabldot öğününü karşılar.',
    status: 'active'
  },
  {
    id: 'camp_barinma_destek',
    title: 'Deprem Bölgesi Öğrencileri Barınma & Yaşam Desteği',
    category: 'Acil Barınma & Afet Desteği',
    targetAmount: 750000,
    currentAmount: 640000,
    donorCount: 226,
    daysLeft: 30,
    beneficiaryCount: 45,
    corporateMatchingBy: 'Global Alumni Alliance London Hub',
    description: 'Afet bölgesinden gelen öğrencilerimizin İstanbul’daki yurt, kira ve temel yaşam giderlerine doğrudan nakdi burs sağlar.',
    status: 'active'
  },
  {
    id: 'camp_erasmus_global',
    title: 'Global Erasmus & Uluslararası Konferans Seyahat Fonu',
    category: 'Uluslararasılaşma',
    targetAmount: 300000,
    currentAmount: 210000,
    donorCount: 89,
    daysLeft: 45,
    beneficiaryCount: 18,
    corporateMatchingBy: 'EuroPass & Bologna Alumni Guild',
    description: 'Avrupa ve ABD üniversitelerine Erasmus veya IEEE/ACM bildiri sunumu için giden öğrencilere vize, uçak bileti ve harcırah desteği sağlar.',
    status: 'active'
  },
  {
    id: 'camp_yapay_zeka_lab',
    title: 'Yapay Zekâ ve İleri Robotik Laboratuvarı Donanım Fonu',
    category: 'Ar-Ge Altyapı',
    targetAmount: 400000,
    currentAmount: 320000,
    donorCount: 104,
    daysLeft: 18,
    beneficiaryCount: 200,
    corporateMatchingBy: 'Siemens & Mercedes Ar-Ge Konsorsiyumu',
    description: 'Öğrencilerimizin açık kaynak derin öğrenme ve robotik projelerinde kullanmaları için yüksek performanslı GPU ve sensör kiti alım fonu.',
    status: 'active'
  }
];

export const INITIAL_DONORS = [
  {
    id: 'don_01',
    campaignId: 'camp_muhendislik_100',
    donorName: 'Dr. Selim Aktaş',
    donorGradYear: '2016',
    donorDept: 'Bilgisayar Mühendisliği',
    amount: 35000,
    frequency: 'one_time',
    dedicationMessage: 'Geleceğin Türk mühendislerine feda olsun. Başarılar dilerim.',
    isAnonymous: false,
    tier: 'PLATINUM',
    receiptNumber: 'IESU-ENDOW-2026-0041',
    verificationHash: '9a8f4c2e1b0d7a6e5f3c2b1a',
    donatedAt: '2026-10-18T14:20:00Z'
  },
  {
    id: 'don_02',
    campaignId: 'camp_askida_yemek',
    donorName: 'Merve Demir',
    donorGradYear: '2019',
    donorDept: 'İşletme',
    amount: 15000,
    frequency: 'monthly',
    dedicationMessage: 'Hiçbir kardeşimiz amfide ders dinlerken aç kalmasın.',
    isAnonymous: false,
    tier: 'GOLD',
    receiptNumber: 'IESU-ENDOW-2026-0042',
    verificationHash: '8b7e3d1c0a9f6e5d4c3b2a1f',
    donatedAt: '2026-10-19T09:15:00Z'
  },
  {
    id: 'don_03',
    campaignId: 'camp_barinma_destek',
    donorName: 'İsimsiz Mezun Bağışçı',
    donorGradYear: '2014',
    donorDept: 'Mimarlık',
    amount: 5000,
    frequency: 'one_time',
    dedicationMessage: 'Birlik ve dayanışma ile her zorluğu aşacağız.',
    isAnonymous: true,
    tier: 'SILVER',
    receiptNumber: 'IESU-ENDOW-2026-0043',
    verificationHash: '7c6d2b0a9e8f5d4c3b2a1e0d',
    donatedAt: '2026-10-20T11:45:00Z'
  },
  {
    id: 'don_04',
    campaignId: 'camp_erasmus_global',
    donorName: 'Kemal Öztürk',
    donorGradYear: '2021',
    donorDept: 'Uluslararası Ticaret',
    amount: 2500,
    frequency: 'one_time',
    dedicationMessage: 'Dünyayı keşfeden ve bayrağımızı dalgalandıran gençlere selamlar.',
    isAnonymous: false,
    tier: 'SILVER',
    receiptNumber: 'IESU-ENDOW-2026-0044',
    verificationHash: '6b5c1a9f8e7d4c3b2a1e0f9c',
    donatedAt: '2026-10-22T16:30:00Z'
  }
];

/**
 * Loads campaigns from localStorage or initializes with defaults
 */
export function getGivingCampaigns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
    return INITIAL_CAMPAIGNS;
  } catch {
    return INITIAL_CAMPAIGNS;
  }
}

/**
 * Loads all donations
 */
export function getAlumniDonations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DONATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(INITIAL_DONORS));
    return INITIAL_DONORS;
  } catch {
    return INITIAL_DONORS;
  }
}

/**
 * Determines badge tier from amount
 */
export function determineDonationTier(amount) {
  const num = Number(amount) || 0;
  if (num >= DONATION_TIERS.PLATINUM.min) return 'PLATINUM';
  if (num >= DONATION_TIERS.GOLD.min) return 'GOLD';
  if (num >= DONATION_TIERS.SILVER.min) return 'SILVER';
  return 'BRONZE';
}

/**
 * Calculates concrete, student-facing impact metrics for a given amount
 */
export function calculateDonationImpact(amount) {
  const val = Math.max(0, Number(amount) || 0);

  const mealCount = Math.floor(val / 50); // 50 ₺ per meal
  const monthlyScholarshipMonths = (val / 3000).toFixed(1); // 3,000 ₺ full monthly grant
  const booksOrSuppliesCount = Math.floor(val / 400); // 400 ₺ textbook/supplies
  const techGrants = Math.floor(val / 15000); // 15,000 ₺ student laptop grant

  return {
    amount: val,
    mealCount,
    monthlyScholarshipMonths: Number(monthlyScholarshipMonths),
    booksOrSuppliesCount,
    techGrants,
    summary: val >= 15000
      ? `${techGrants} öğrenciye tam dizüstü bilgisayar donanım desteği sağlar.`
      : val >= 3000
      ? `${Math.floor(val / 3000)} öğrencinin 1 aylık tam yaşam ve eğitim bursunu karşılar.`
      : val >= 50
      ? `Kampüs yemekhanesinde ${mealCount} sıcak ve sağlıklı öğün tabldot desteği sağlar.`
      : 'Burs fonuna anlamlı bir katkı sağlar.'
  };
}

/**
 * Processes a new alumni micro-donation
 */
export function processAlumniDonation({
  campaignId,
  amount,
  donorName = 'İsimsiz Mezun',
  donorGradYear = '2022',
  donorDept = 'Mühendislik Fakültesi',
  frequency = 'one_time',
  dedicationMessage = '',
  isAnonymous = false,
  paymentMethod = 'credit_card'
}) {
  const numAmount = Math.round(Number(amount) * 100) / 100;
  if (!numAmount || numAmount < 10 || isNaN(numAmount)) {
    return {
      success: false,
      error: 'Geçersiz bağış tutarı. Lütfen en az 10 ₺ miktar giriniz.'
    };
  }

  if (numAmount > 5000000) {
    return {
      success: false,
      error: 'Tek seferde en fazla 5.000.000 ₺ bağış yapılabilir. Daha yüksek kurumsal katkılar için lütfen Rektörlük ile iletişime geçiniz.'
    };
  }

  const campaigns = getGivingCampaigns();
  const targetCampaignIndex = campaigns.findIndex(c => c.id === campaignId);

  if (targetCampaignIndex === -1) {
    return {
      success: false,
      error: 'Seçilen burs kampanyası sistemde bulunamadı.'
    };
  }

  const tier = determineDonationTier(numAmount);
  const now = new Date();
  const receiptNumber = `IESU-ENDOW-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Safe crypto random bytes generation with math fallback
  const randomBytes = (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues)
    ? Array.from(globalThis.crypto.getRandomValues(new Uint8Array(12)))
    : Array.from({ length: 12 }, () => Math.floor(Math.random() * 256));
  const verificationHash = randomBytes
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const newDonation = {
    id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    campaignId,
    donorName: isAnonymous ? 'İsimsiz Mezun Bağışçı' : donorName,
    donorGradYear,
    donorDept,
    amount: numAmount,
    frequency,
    dedicationMessage: dedicationMessage.trim() || 'Öğrenci kardeşlerime başarılar dilerim.',
    isAnonymous: Boolean(isAnonymous),
    paymentMethod,
    tier,
    receiptNumber,
    verificationHash,
    donatedAt: now.toISOString()
  };

  // Update campaign amounts and dynamic beneficiaries
  campaigns[targetCampaignIndex].currentAmount += numAmount;
  campaigns[targetCampaignIndex].donorCount += 1;
  const addedBeneficiaries = Math.floor(numAmount / 5000);
  if (addedBeneficiaries > 0) {
    campaigns[targetCampaignIndex].beneficiaryCount = (campaigns[targetCampaignIndex].beneficiaryCount || 0) + addedBeneficiaries;
  }

  // Persist both
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    const donations = getAlumniDonations();
    const updatedDonations = [newDonation, ...donations];
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(updatedDonations));
  } catch (e) {
    console.warn('[alumniGivingWorkflow] Storage write error:', e);
  }

  return {
    success: true,
    donation: newDonation,
    campaign: campaigns[targetCampaignIndex],
    impact: calculateDonationImpact(numAmount)
  };
}

/**
 * Returns Donors Hall of Honor (Şeref Kürsüsü) filterable by tier
 */
export function getDonorsHallOfHonor(filterTier = 'all') {
  const donations = getAlumniDonations();
  const list = Array.isArray(donations) ? donations : [];
  if (filterTier === 'all') return list;
  return list.filter(d => d.tier === filterTier.toUpperCase());
}

/**
 * Computes high-level endowment metrics for university board & leadership
 */
export function getEndowmentAggregateMetrics() {
  const campaigns = Array.isArray(getGivingCampaigns()) ? getGivingCampaigns() : [];
  const donations = Array.isArray(getAlumniDonations()) ? getAlumniDonations() : [];

  const totalRaised = campaigns.reduce((acc, c) => acc + (c.currentAmount || 0), 0);
  const totalTarget = campaigns.reduce((acc, c) => acc + (c.targetAmount || 0), 0);
  const totalDonors = donations.length;
  const totalStudentsSupported = campaigns.reduce((acc, c) => acc + (c.beneficiaryCount || 0), 0);

  // 1:1 Corporate and Foundation matching contribution
  const matchingContribution = Math.round(totalRaised * 0.45);

  return {
    totalRaised,
    totalTarget,
    fundingProgressPercent: totalTarget > 0 ? Math.round((totalRaised / totalTarget) * 100) : 0,
    totalDonors,
    totalStudentsSupported,
    matchingContribution,
    activeCampaignsCount: campaigns.filter(c => c.status === 'active').length
  };
}

/**
 * Verifies an official donation receipt token
 */
export function verifyDonationReceipt(receiptNumber) {
  if (!receiptNumber || typeof receiptNumber !== 'string') return null;
  const donations = getAlumniDonations();
  const list = Array.isArray(donations) ? donations : [];
  const found = list.find(d => d.receiptNumber.toLowerCase() === receiptNumber.trim().toLowerCase());
  if (!found) return null;

  const campaigns = getGivingCampaigns();
  const campaignList = Array.isArray(campaigns) ? campaigns : [];
  const campaign = campaignList.find(c => c.id === found.campaignId);

  return {
    isValid: true,
    donation: found,
    campaignTitle: campaign?.title || 'İESÜ Öğrenci Burs Fonu',
    issuer: 'İstanbul Esenyurt Üniversitesi (İESÜ) Rektörlüğü & Mezunlar Koordinatörlüğü'
  };
}

/**
 * Helper to reset endowment test data
 */
export function resetEndowmentData() {
  try {
    localStorage.removeItem(STORAGE_KEY_CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEY_DONATIONS);
    return true;
  } catch {
    return false;
  }
}
