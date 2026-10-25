/**
 * src/services/studentRadarWorkflow.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) Canlı Başvuru Radarı & Mikro-Geri Bildirim İş Akışı Motoru
 *
 * Yasal ve Kurumsal Standartlar:
 * - 2547 Sayılı Kanun Ek Madde 35 (Sanayi Protokol Kontenjanı Önceliği)
 * - YÖKAK Mezun & İstihdam Geri Bildirim Şeffaflığı Kriteri (Kara Delik Başvuru Sendromu Önleme)
 * - 3308 Sayılı Mesleki Eğitim Kanunu Madde 25 Şeffaf Güvence Standartları
 */

import { SAMPLE_CORPORATE_PROTOCOLS } from './protocolWorkflow';

export const RADAR_STAGES = {
  SUBMITTED: {
    key: 'SUBMITTED',
    label: 'Başvuru İletildi',
    shortLabel: 'İletildi',
    stepNumber: 1,
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    description: 'Başvurunuz ve İESÜ onaylı dijital özgeçmişiniz firma yetenek havuzuna ulaştı.'
  },
  HR_VIEWED: {
    key: 'HR_VIEWED',
    label: 'İK Açtı ve İnceledi',
    shortLabel: 'İncelendi',
    stepNumber: 2,
    color: 'amber',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    description: 'Firma insan kaynakları yetkilisi özgeçmişinizi ve portfolyonuzu detaylı inceledi.'
  },
  SHORTLISTED_TOP_15: {
    key: 'SHORTLISTED_TOP_15',
    label: 'Ön Eleme Havuzunda - İlk %15',
    shortLabel: 'İlk %15 Aday',
    stepNumber: 3,
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    description: 'Teknik yetkinlik ve genel profil eşleşmesiyle en yüksek puanlı ilk %15 aday arasına seçildiniz.'
  },
  INTERVIEW_INVITE: {
    key: 'INTERVIEW_INVITE',
    label: 'Mülakat Daveti',
    shortLabel: 'Mülakat',
    stepNumber: 4,
    isTerminal: true,
    outcome: 'interview',
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    description: 'Tebrikler! Firma insan kaynakları sizinle teknik/yönetsel mülakat görüşmesi planladı.'
  },
  DETAILED_FEEDBACK: {
    key: 'DETAILED_FEEDBACK',
    label: 'Gerekçeli Geri Bildirim',
    shortLabel: 'Geri Bildirim',
    stepNumber: 4,
    isTerminal: true,
    outcome: 'feedback',
    color: 'rose',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    description: 'Süreç tamamlandı. Karar gerekçeleri ve kendinizi geliştirmeniz için nokta atışı tavsiyeler hazırlandı.'
  }
};

export const RADAR_STAGE_ORDER = [
  'SUBMITTED',
  'HR_VIEWED',
  'SHORTLISTED_TOP_15',
  'INTERVIEW_INVITE' // or 'DETAILED_FEEDBACK'
];

export const PROTOCOL_VIP_BADGE = {
  title: 'İESÜ Protokol Kontenjanı',
  shortTitle: 'VIP Protokol',
  tagline: 'Rektörlük Kurumsal Protokolü Kapsamında Öncelikli İnceleme',
  bgColor: 'bg-gradient-to-r from-amber-500 to-amber-600',
  textColor: 'text-white',
  borderColor: 'border-amber-300'
};

export const COFFEE_CHAT_TOPICS = [
  {
    id: 'cv_review',
    title: 'CV & Portfolyo İnceleme',
    duration: '15 Dakika',
    icon: 'FileText',
    description: 'Özgeçmişinizi ve GitHub / Behance projelerinizi sektör gözüyle değerlendirin.'
  },
  {
    id: 'industry_advice',
    title: 'Sektör Tavsiyesi & Kariyer Giriş Taktikleri',
    duration: '15 Dakika',
    icon: 'TrendingUp',
    description: 'Hedeflediğiniz sektörün güncel dinamikleri, şirket kültürü ve staj tüyoları.'
  },
  {
    id: 'abroad_master',
    title: 'Yurt Dışı / Yüksek Lisans Deneyimi',
    duration: '15 Dakika',
    icon: 'Globe',
    description: 'Yurt dışında kariyer, kabul süreçleri ve global fırsatlar üzerine mentörlük.'
  },
  {
    id: 'interview_mock',
    title: 'Mülakat Simülasyonu & Vaka Analizi',
    duration: '15 Dakika',
    icon: 'Users',
    description: 'İnsan kaynakları ve teknik mülakatlarda sorulan klasik/vaka soruları provası.'
  }
];

export const COFFEE_CHAT_STATUS = {
  PENDING: { key: 'PENDING', label: 'Onay Bekliyor', color: 'amber', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
  CONFIRMED: { key: 'CONFIRMED', label: 'Onaylandı (Link Hazır)', color: 'emerald', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  COMPLETED: { key: 'COMPLETED', label: 'Tamamlandı', color: 'blue', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' },
  CANCELLED: { key: 'CANCELLED', label: 'İptal Edildi', color: 'gray', badgeClass: 'bg-gray-50 text-gray-600 border-gray-200' }
};

/**
 * Normalizes text for lenient matching
 */
function normalize(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Checks whether a given company is a registered IESU Corporate Protocol Partner.
 * @param {string} companyName
 * @param {Array} protocols
 * @returns {object|null} Matched protocol or null
 */
export function isProtocolCompany(companyName, protocols = SAMPLE_CORPORATE_PROTOCOLS) {
  if (!companyName) return null;
  const cNorm = normalize(companyName);
  if (!cNorm || cNorm.length < 2) return null;
  const list = Array.isArray(protocols) && protocols.length > 0 ? protocols : (SAMPLE_CORPORATE_PROTOCOLS || []);

  const found = list.find((p) => {
    if (!p) return false;
    const pCompanyNorm = normalize(p.companyName || p.name || p.company);
    const pTitleNorm = normalize(p.title);
    return (
      (pCompanyNorm && pCompanyNorm.length >= 2 && (cNorm.includes(pCompanyNorm) || pCompanyNorm.includes(cNorm))) ||
      (pTitleNorm && pTitleNorm.length >= 2 && (cNorm.includes(pTitleNorm) || pTitleNorm.includes(cNorm)))
    );
  });

  if (found) return found;

  // Fallback well-known protocol partners if protocol array didn't match directly
  const knownPartners = [
    { name: 'Aselsan', sector: 'Savunma Sanayii', quota: 15 },
    { name: 'Baykar', sector: 'Havacılık & İHA', quota: 20 },
    { name: 'Trendyol', sector: 'E-Ticaret & Yazılım', quota: 25 },
    { name: 'Ford Otosan', sector: 'Otomotiv & Sanayi', quota: 10 },
    { name: 'Turkcell', sector: 'Telekomünikasyon & Bulut', quota: 12 },
    { name: 'Havelsan', sector: 'Savunma & Simülasyon', quota: 8 },
    { name: 'Roketsan', sector: 'Füze & Aviyonik', quota: 8 },
    { name: 'TUSAŞ', sector: 'Havacılık & Uzay', quota: 18 },
    { name: 'Türk Hava Yolları', sector: 'Havacılık & Ulaştırma', quota: 30 },
    { name: 'ESBİM', sector: 'Yerel İstihdam Masası', quota: 40 },
    { name: 'İŞKUR', sector: 'Kamu & İstihdam Masası', quota: 50 },
    { name: 'Siemens', sector: 'Endüstri 4.0 & Enerji', quota: 6 },
    { name: 'Şişecam', sector: 'Üretim & Malzeme', quota: 10 }
  ];

  const matchedKnown = knownPartners.find((kp) => {
    const kpNorm = normalize(kp.name);
    return kpNorm && kpNorm.length >= 2 && (cNorm.includes(kpNorm) || kpNorm.includes(cNorm));
  });

  if (matchedKnown) {
    return {
      companyName: matchedKnown.name,
      sector: matchedKnown.sector,
      quotaCount: matchedKnown.quota,
      status: 'ACTIVE',
      protocolCode: 'IESU-PRT-AUTO'
    };
  }

  return null;
}

/**
 * Enriches an application object with Radar, VIP Protocol, and timeline properties.
 */
export function enrichApplicationWithRadar(app, protocols = SAMPLE_CORPORATE_PROTOCOLS) {
  if (!app || typeof app !== 'object') return null;

  const company = app.company || app.companyName || 'Kurumsal Şirket';
  const protocol = isProtocolCompany(company, protocols);
  const isProtocolVIP = Boolean(protocol || app.isProtocolVIP);

  const stageKey = app.radarStage || (
    app.status === 'Mülakat' || app.status === 'Kabul Edildi' ? 'INTERVIEW_INVITE' :
    app.status === 'Reddedildi' ? 'DETAILED_FEEDBACK' :
    app.status === 'İncelendi' ? 'HR_VIEWED' :
    'SUBMITTED'
  );

  const stageMeta = RADAR_STAGES[stageKey] || RADAR_STAGES.SUBMITTED;

  // Build default timeline if missing
  const defaultTimeline = Array.isArray(app.timeline) && app.timeline.length > 0
    ? app.timeline
    : [
        {
          stage: 'SUBMITTED',
          title: 'Başvuru İletildi',
          timestamp: app.appliedDate || app.createdAt || '2026-10-18 10:30',
          note: 'İESÜ onaylı dijital özgeçmiş ve KGB karnesi başvuru havuzuna aktarıldı.'
        }
      ];

  // If stage is further along, ensure previous steps exist in timeline
  const stepNums = {
    SUBMITTED: 1,
    HR_VIEWED: 2,
    SHORTLISTED_TOP_15: 3,
    INTERVIEW_INVITE: 4,
    DETAILED_FEEDBACK: 4
  };

  const currentStep = stepNums[stageKey] || 1;
  const timelineStages = defaultTimeline.map((t) => t.stage);

  if (currentStep >= 2 && !timelineStages.includes('HR_VIEWED')) {
    defaultTimeline.push({
      stage: 'HR_VIEWED',
      title: 'İK Açtı ve İnceledi',
      timestamp: app.hrViewedAt || '2026-10-19 14:15',
      reviewer: 'Kıdemli Yetenek Kazanımı Uzmanı',
      note: 'Adayın profil ve portfolyo detayları incelendi. İnceleme süresi: 3 dk 45 sn.'
    });
  }

  if (currentStep >= 3 && !timelineStages.includes('SHORTLISTED_TOP_15')) {
    defaultTimeline.push({
      stage: 'SHORTLISTED_TOP_15',
      title: 'Ön Eleme Havuzunda - İlk %15',
      timestamp: app.shortlistedAt || '2026-10-20 16:00',
      note: `Aday teknik ve akademik eşleşme kriterleriyle ilk %${app.percentileRank || 12} dilimine girdi.`
    });
  }

  if (stageKey === 'INTERVIEW_INVITE' && !timelineStages.includes('INTERVIEW_INVITE')) {
    defaultTimeline.push({
      stage: 'INTERVIEW_INVITE',
      title: 'Mülakat Daveti',
      timestamp: app.interviewDate || '2026-10-22 11:00',
      meetingType: 'Online Video Görüşme (Google Meet)',
      meetingLink: app.meetingLink || 'https://meet.google.com/iesu-kariyer-mock',
      note: 'Teknik Değerlendirme & Kültür Uyumu Mülakatı için takvim daveti gönderildi.'
    });
  }

  if (stageKey === 'DETAILED_FEEDBACK' && !timelineStages.includes('DETAILED_FEEDBACK')) {
    defaultTimeline.push({
      stage: 'DETAILED_FEEDBACK',
      title: 'Gerekçeli Geri Bildirim',
      timestamp: app.feedbackDate || '2026-10-22 17:30',
      note: 'Süreç tamamlandı. İK değerlendirme notları ve gelişim tavsiyeleri sisteme yüklendi.'
    });
  }

  // Construct structured feedback if in DETAILED_FEEDBACK or provided
  const feedback = app.feedback || (
    stageKey === 'DETAILED_FEEDBACK'
      ? {
          strengths: [
            'İESÜ KGB Akademik transkript ve temel kuramsal bilgi düzeyi güçlü.',
            'React / Modern frontend temelleri ve takım çalışması motivasyonu yüksek.'
          ],
          missingSkills: [
            'Mikroservis mimarisi ve Docker konteynerizasyon tecrübesi pozisyon gereksiniminin altında kaldı.',
            'Büyük ölçekli veritabanı sorgu optimizasyonu (PostgreSQL / Redis) pratiği aranmaktadır.'
          ],
          actionableAdvice: 'Hedeflediğiniz pozisyon için İESÜ SEM Bulut Bilişim Sertifikasını tamamlamanız şansınızı %35 artıracaktır.',
          suggestedSemCourse: 'Bulut Mimarisi ve Docker Konteyner Eğitimi (İESÜ SEM)',
          suggestedSemView: 'sem',
          suggestedMentorAction: 'Sektörde çalışan bir İESÜ mezunuyla 15 Dk Kahve Randevusu alarak teknik mülakat provası yapınız.'
        }
      : null
  );

  return {
    ...app,
    id: app.id || 'RADAR-APP-' + Math.random().toString(36).substring(2, 8),
    jobTitle: app.jobTitle || app.title || 'Pozisyon',
    company,
    companyLogo: app.companyLogo || app.logo || null,
    radarStage: stageKey,
    stageMeta,
    isProtocolVIP,
    protocolDetails: protocol ? {
      code: protocol.protocolCode,
      sector: protocol.sector,
      quotaCount: protocol.quotaCount,
      institution: 'İstanbul Esenyurt Üniversitesi (İESÜ)'
    } : null,
    percentileRank: app.percentileRank || (isProtocolVIP ? 8 : 14),
    timeline: defaultTimeline,
    feedback,
    interviewDetails: stageKey === 'INTERVIEW_INVITE' ? {
      date: app.interviewDate || '28 Ekim 2026',
      time: '14:30 - 15:15',
      platform: 'Google Meet',
      link: app.meetingLink || 'https://meet.google.com/iesu-kariyer-mock',
      interviewer: 'İnsan Kaynakları & Kıdemli Takım Lideri'
    } : null
  };
}

/**
 * Safely advances an application's radar stage and generates appropriate timeline/feedback.
 */
export function advanceRadarStage(application, nextStage, options = {}) {
  if (!application) return null;
  const targetMeta = RADAR_STAGES[nextStage];
  if (!targetMeta) return application;

  const now = new Date();
  const timeStr = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;

  const currentTimeline = Array.isArray(application.timeline) ? [...application.timeline] : [];

  let newTimelineItem = {
    stage: nextStage,
    title: targetMeta.label,
    timestamp: timeStr,
    note: options.note || targetMeta.description
  };

  if (nextStage === 'HR_VIEWED') {
    newTimelineItem.reviewer = options.reviewer || 'Kıdemli Yetenek Kazanımı Uzmanı';
    newTimelineItem.note = options.note || 'Özgeçmiş ve transkript incelendi. Portfolyo başarıyla arşivlendi.';
  } else if (nextStage === 'SHORTLISTED_TOP_15') {
    newTimelineItem.note = options.note || 'Yetkinlik puanı ile ilk %12 havuzuna dahil edildi.';
  } else if (nextStage === 'INTERVIEW_INVITE') {
    newTimelineItem.meetingType = 'Online Video Görüşme';
    newTimelineItem.meetingLink = options.meetingLink || 'https://meet.google.com/iesu-mulakat-link';
  } else if (nextStage === 'DETAILED_FEEDBACK') {
    newTimelineItem.note = options.note || 'Süreç tamamlandı. Detaylı geri bildirim raporu oluşturuldu.';
  }

  const updatedTimeline = [...currentTimeline.filter((t) => t.stage !== nextStage), newTimelineItem];

  const updated = {
    ...application,
    radarStage: nextStage,
    stageMeta: targetMeta,
    timeline: updatedTimeline,
    ...(nextStage === 'HR_VIEWED' ? { hrViewedAt: timeStr } : {}),
    ...(nextStage === 'SHORTLISTED_TOP_15' ? { shortlistedAt: timeStr, percentileRank: options.percentileRank || 12 } : {}),
    ...(nextStage === 'INTERVIEW_INVITE' ? {
      interviewDate: timeStr,
      interviewDetails: {
        date: options.date || '3 Gün Sonra',
        time: options.time || '14:00',
        platform: 'Google Meet',
        link: options.meetingLink || 'https://meet.google.com/iesu-mulakat-link',
        interviewer: options.interviewer || 'İK Yöneticisi'
      }
    } : {}),
    ...(nextStage === 'DETAILED_FEEDBACK' ? {
      feedback: options.feedback || application.feedback || {
        strengths: ['Güçlü teknik temel', 'İESÜ KGB onaylı ders başarısı'],
        missingSkills: ['Sektörel proje ve bulut tecrübesi geliştirilmeli'],
        actionableAdvice: 'İESÜ SEM kurslarına katılarak profilinizi güçlendiriniz.',
        suggestedSemCourse: 'Bulut Bilişim Sertifikası',
        suggestedSemView: 'sem'
      }
    } : {})
  };

  return updated;
}

/**
 * Calculates aggregate radar statistics for a list of applications.
 */
export function calculateRadarStatistics(applications = []) {
  const safeList = Array.isArray(applications) ? applications.filter(Boolean) : [];

  let submitted = 0;
  let hrViewed = 0;
  let shortlisted = 0;
  let interview = 0;
  let feedbackGiven = 0;
  let protocolVIPCount = 0;

  safeList.forEach((app) => {
    const stage = app.radarStage || 'SUBMITTED';
    if (stage === 'SUBMITTED') submitted++;
    else if (stage === 'HR_VIEWED') hrViewed++;
    else if (stage === 'SHORTLISTED_TOP_15') shortlisted++;
    else if (stage === 'INTERVIEW_INVITE') interview++;
    else if (stage === 'DETAILED_FEEDBACK') feedbackGiven++;

    if (app.isProtocolVIP) protocolVIPCount++;
  });

  return {
    totalApplications: safeList.length,
    submittedCount: submitted,
    hrViewedCount: hrViewed,
    shortlistedCount: shortlisted,
    interviewCount: interview,
    feedbackCount: feedbackGiven,
    protocolVIPCount,
    activeProcessCount: submitted + hrViewed + shortlisted
  };
}

/**
 * Generates mock applications for students to experience the radar immediately.
 */
export function generateMockRadarApplications(currentUser = {}, protocols = SAMPLE_CORPORATE_PROTOCOLS) {
  const sName = currentUser?.name || 'Öğrenci';
  const sId = currentUser?.id || currentUser?.uid || 'STU-001';

  const mocks = [
    {
      id: 'RAD-APP-101',
      jobId: 'JOB-ASELSAN-01',
      jobTitle: 'Aday Mühendis & Gömülü Sistemler Stajyeri',
      company: 'Aselsan',
      companyLogo: 'https://ui-avatars.com/api/?name=Aselsan&background=0A2342&color=fff',
      applicantId: sId,
      applicantName: sName,
      appliedDate: '2026-10-20 09:30',
      radarStage: 'SHORTLISTED_TOP_15',
      percentileRank: 8,
      status: 'Onay Bekliyor',
      isProtocolVIP: true
    },
    {
      id: 'RAD-APP-102',
      jobId: 'JOB-TRENDYOL-02',
      jobTitle: 'Full-Stack Web Geliştirici Stajyeri',
      company: 'Trendyol',
      companyLogo: 'https://ui-avatars.com/api/?name=Trendyol&background=F97316&color=fff',
      applicantId: sId,
      applicantName: sName,
      appliedDate: '2026-10-18 14:10',
      radarStage: 'INTERVIEW_INVITE',
      percentileRank: 5,
      status: 'Mülakat',
      isProtocolVIP: true,
      interviewDate: '2026-10-25 15:00',
      meetingLink: 'https://meet.google.com/iesu-trendyol-tech'
    },
    {
      id: 'RAD-APP-103',
      jobId: 'JOB-BAYKAR-03',
      jobTitle: 'Otonom Sistemler & Yapay Zekâ Araştırmacısı',
      company: 'Baykar',
      companyLogo: 'https://ui-avatars.com/api/?name=Baykar&background=DC2626&color=fff',
      applicantId: sId,
      applicantName: sName,
      appliedDate: '2026-10-15 11:20',
      radarStage: 'DETAILED_FEEDBACK',
      status: 'Reddedildi',
      isProtocolVIP: true,
      feedback: {
        strengths: [
          'Python ve Makine Öğrenmesi temelleri çok kuvvetli.',
          'İESÜ TÜBİTAK proje deneyimi başvuruda öne çıktı.'
        ],
        missingSkills: [
          'ROS2 (Robot Operating System) ve C++ gerçek zamanlı kontrol deneyimi yetersiz bulundu.',
          'Gömülü Linux sistemleri üzerinde pratik çalışma örneği bulunamadı.'
        ],
        actionableAdvice: 'İESÜ SEM Robotik ve ROS2 programını tamamlayarak portfolyonuza eklemeniz durumunda bir sonraki dönem şansınız %40 artacaktır.',
        suggestedSemCourse: 'Robotik Kodlama ve ROS2 İleri Seviye (İESÜ SEM)',
        suggestedSemView: 'sem',
        suggestedMentorAction: 'Baykar bünyesinde çalışan İESÜ mezunuyla 15 Dk Kahve Sohbeti yaparak mülakat beklentilerini dinleyin.'
      }
    },
    {
      id: 'RAD-APP-104',
      jobId: 'JOB-FORD-04',
      jobTitle: 'Endüstri 4.0 ve Üretim Planlama Stajyeri',
      company: 'Ford Otosan',
      companyLogo: 'https://ui-avatars.com/api/?name=Ford&background=0284C7&color=fff',
      applicantId: sId,
      applicantName: sName,
      appliedDate: '2026-10-22 08:45',
      radarStage: 'HR_VIEWED',
      status: 'İncelendi',
      isProtocolVIP: true,
      hrViewedAt: '2026-10-22 13:20'
    },
    {
      id: 'RAD-APP-105',
      jobId: 'JOB-ESBIM-05',
      jobTitle: 'Bilişim & Veri Giriş Operasyon Stajyeri',
      company: 'ESBİM',
      companyLogo: 'https://ui-avatars.com/api/?name=ESBIM&background=0D9488&color=fff',
      applicantId: sId,
      applicantName: sName,
      appliedDate: '2026-10-23 10:15',
      radarStage: 'SUBMITTED',
      status: 'Onay Bekliyor',
      isProtocolVIP: true
    }
  ];

  return mocks.map((m) => enrichApplicationWithRadar(m, protocols));
}

/**
 * Calculates a dynamic 0-100 Career Readiness Score and smart advice recommendations.
 */
export function calculateCareerReadinessScore({
  student = {},
  internships = [],
  semCertificates = [],
  clubMemberships = [],
  coffeeChats = []
} = {}) {
  let score = 0;
  const missingItems = [];
  const breakdown = [];

  // 1. 3308 Resmî / İsteğe Bağlı Staj Durumu (25 Puan)
  const safeInternships = Array.isArray(internships) ? internships : [];
  const completedInternship = safeInternships.some(
    (i) => i.status === 'Başarılı (S / Geçti)' || i.status === 'Onaylandı' || i.status === 'SGK Girişi Yapıldı'
  );
  if (completedInternship) {
    score += 25;
    breakdown.push({ label: '3308 Sayılı SGK Onaylı Staj Güvencesi', points: 25, max: 25, completed: true });
  } else {
    breakdown.push({ label: '3308 Sayılı SGK Onaylı Staj', points: 0, max: 25, completed: false });
    missingItems.push({
      id: 'missing_internship',
      title: '3308 Sayılı Staj SGK Başvurusu Yapın (+25 Puan)',
      description: 'Zorunlu veya isteğe bağlı staj evraklarınızı tamamlayarak Rektörlük SGK onayınızı alın. Sanayi kuruluşlarının öğrenci seçiminde ilk baktığı kriterdir.',
      ctaText: 'Staj Masasına Git',
      targetView: 'staj',
      impactText: '+25% Hazırlık Artışı'
    });
  }

  // 2. İESÜ Sürekli Eğitim Merkezi (SEM) Sertifikaları (30 Puan max, her sertifika 10 puan)
  const safeCerts = Array.isArray(semCertificates) ? semCertificates : [];
  const certCount = safeCerts.length;
  const certPoints = Math.min(certCount * 10, 30);
  score += certPoints;
  breakdown.push({ label: `SEM Sertifikaları (${certCount} Adet)`, points: certPoints, max: 30, completed: certPoints >= 20 });
  if (certCount < 2) {
    missingItems.push({
      id: 'missing_sem',
      title: 'İESÜ SEM Akredite Sertifika Programı Tamamlayın (+10-20 Puan)',
      description: 'Hedeflediğiniz alan için Bulut Bilişim, PMP veya Yapay Zekâ SEM sertifikası alarak kurumsal şirketlerin ATS taramasında öne geçin.',
      ctaText: 'SEM Eğitimlerini Gör',
      targetView: 'sem',
      impactText: '+35% Eşleşme Oranı'
    });
  }

  // 3. Öğrenci Kulüpleri ve Liderlik (15 Puan)
  const safeClubs = Array.isArray(clubMemberships) ? clubMemberships : [];
  const hasClub = safeClubs.length > 0 || student.clubRole;
  if (hasClub) {
    score += 15;
    breakdown.push({ label: 'Kulüp Faaliyeti ve Takım Liderliği', points: 15, max: 15, completed: true });
  } else {
    breakdown.push({ label: 'Kulüp ve Sosyal Girişimcilik', points: 0, max: 15, completed: false });
    missingItems.push({
      id: 'missing_club',
      title: 'Bir Öğrenci Kulübüne Katılın veya Proje Üretin (+15 Puan)',
      description: 'Takım çalışması ve proje yürütme tecrübesi İK uzmanlarının aradığı en kritik yetkinlikler arasındadır.',
      ctaText: 'Kulüpler Portalına Git',
      targetView: 'club_portal',
      impactText: '+15% Hazırlık Artışı'
    });
  }

  // 4. İESÜ Dijital CV & Transkript Doğruluğu (20 Puan)
  const hasCV = Boolean(student.cvData || student.gpa || student.department);
  if (hasCV) {
    score += 20;
    breakdown.push({ label: 'İESÜ Dijital CV & Transkript Doğruluğu', points: 20, max: 20, completed: true });
  } else {
    breakdown.push({ label: 'İESÜ Dijital CV & Transkript', points: 5, max: 20, completed: false });
    score += 5;
    missingItems.push({
      id: 'missing_cv',
      title: 'İESÜ Akredite Dijital CV Oluşturun (+15 Puan)',
      description: 'İESÜ onaylı akredite şablon ile CV nizi tamamlayarak kurumsal havuzlara açılın.',
      ctaText: 'CV Oluşturucuya Git',
      targetView: 'cvbuilder',
      impactText: '+20% Hazırlık Artışı'
    });
  }

  // 5. Mezunla 15 Dakika Kahve Sohbeti / Mikro-Mentorluk (10 Puan)
  const safeChats = Array.isArray(coffeeChats) ? coffeeChats : [];
  const hasConfirmedChat = safeChats.some((c) => c.status === 'CONFIRMED' || c.status === 'COMPLETED');
  const hasPendingChat = safeChats.some((c) => c.status === 'PENDING');
  if (hasConfirmedChat) {
    score += 10;
    breakdown.push({ label: 'Mezunla 15 Dk Kahve Sohbeti / Mentorluk', points: 10, max: 10, completed: true });
  } else if (hasPendingChat) {
    score += 5;
    breakdown.push({ label: 'Mezun Kahve Randevusu (Onay Bekliyor)', points: 5, max: 10, completed: false });
    missingItems.push({
      id: 'missing_coffee_chat',
      title: 'Mezun Randevunuzu Onaylayın / Takip Edin (+5 Puan)',
      description: 'Bekleyen kahve sohbeti randevunuz onaylandığında mentorluk puanınız %100 tamamlanacaktır.',
      ctaText: 'Randevuları Gör',
      targetAction: 'open_coffee_chat',
      impactText: '+5% Mentor Gücü'
    });
  } else {
    breakdown.push({ label: 'Mezun Kahve Randevusu', points: 0, max: 10, completed: false });
    missingItems.push({
      id: 'missing_coffee_chat',
      title: 'Mezunla 15 Dk Kahve Sohbeti Randevusu Alın (+10 Puan)',
      description: 'Sektör lideri bir İESÜ mezunuyla 15 dakikalık görüşme yaparak portfolyonuzu inceletin ve mülakat tüyoları alın.',
      ctaText: 'Kahve Randevusu Al',
      targetAction: 'open_coffee_chat',
      impactText: '+10% Mentor Gücü'
    });
  }

  // Determine readiness level
  let level = 'Geliştirilmeli (Aday Başlangıç)';
  let levelColor = 'text-amber-600 bg-amber-50 border-amber-200';
  if (score >= 90) {
    level = 'Elit Aday (VIP Protokol & İstihdam Havuzu)';
    levelColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  } else if (score >= 70) {
    level = 'Sektöre Hazır (Yüksek Eşleşme)';
    levelColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (score >= 45) {
    level = 'Kariyer Rotasında (İyi Düzey)';
    levelColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  }

  return {
    score: Math.min(Math.max(score, 0), 100),
    level,
    levelColor,
    breakdown,
    missingItems: missingItems.slice(0, 2), // Pick top 2 most urgent actions
    allMissingItems: missingItems
  };
}
