/**
 * atsScannerWorkflow.js
 * 
 * İstanbul Esenyurt Üniversitesi (İESÜ) Kariyer Geliştirme Koordinatörlüğü
 * Yapay Zekâ Destekli ATS Uyum Tarayıcısı & CV Optimizasyon Motoru
 * 
 * Kurumsal ATS Sistemleri Uyumluluğu:
 * - Workday ATS
 * - Taleo (Oracle)
 * - Greenhouse
 * - Lever
 * - SAP SuccessFactors
 */

const STORAGE_KEY_SCANS = 'iesu_ats_scans_v1';
export const MAX_INPUT_CHARS = 50000;

// Popular technical and soft skills dictionary for multilingual matching
export const ATS_KEYWORD_DICTIONARY = {
  frontend: [
    'React', 'Vue', 'Angular', 'Next.js', 'JavaScript', 'TypeScript', 'HTML5',
    'CSS3', 'Tailwind CSS', 'Redux', 'Zustand', 'Webpack', 'Vite', 'GraphQL', 'REST API'
  ],
  backend: [
    'Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot',
    'C#', 'C++', 'C/C++', 'Rust', 'Go', 'Golang', 'PHP', 'Laravel', 'PostgreSQL',
    'MySQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', '.NET Core'
  ],
  mobile: [
    'Flutter', 'React Native', 'Kotlin', 'Swift', 'iOS', 'Android'
  ],
  devops_cloud: [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Git', 'GitHub Actions',
    'Terraform', 'Linux', 'Nginx', 'Microservices'
  ],
  data_ai: [
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy',
    'SQL', 'Data Analysis', 'NLP', 'Big Data', 'Power BI', 'Tableau', 'Computer Vision'
  ],
  soft_skills: [
    'Problem Solving', 'Teamwork', 'Communication', 'Leadership', 'Time Management',
    'Agile', 'Scrum', 'Critical Thinking', 'Adaptability', 'Project Management',
    'Analitik Düşünme', 'Takım Çalışması', 'Etkili İletişim', 'Liderlik', 'Zaman Yönetimi',
    'Stres Yönetimi', 'Sunum Becerisi', 'Çözüm Odaklılık', 'Kritik Düşünme', 'Proje Yönetimi'
  ],
  certifications_standards: [
    'EuroPass', 'Bologna', 'YÖK', 'SGK 3308', 'PMP', 'Scrum Master', 'AWS Certified',
    'IELTS', 'TOEFL', 'ISTQB', 'CISSP', 'MÜDEK', 'ABET', 'ISO 9001'
  ]
};

// Recognized standard resume section titles
export const STANDARD_RESUME_SECTIONS = [
  { key: 'contact', title: 'İletişim Bilgileri', keywords: ['email', 'e-posta', 'telefon', 'phone', 'linkedin', 'github', 'adres', 'address'] },
  { key: 'summary', title: 'Özet / Kariyer Hedefi', keywords: ['özet', 'summary', 'hakkımda', 'about me', 'kariyer hedefi', 'profile', 'ozet', 'hakkimda'] },
  { key: 'experience', title: 'İş & Staj Deneyimi', keywords: ['deneyim', 'experience', 'iş tecrübesi', 'staj', 'internship', 'çalışma geçmişi', 'is tecrubesi', 'calisma'] },
  { key: 'education', title: 'Eğitim', keywords: ['eğitim', 'education', 'üniversite', 'lisans', 'bachelor', 'master', 'lise', 'fakülte', 'egitim', 'universite', 'fakulte'] },
  { key: 'skills', title: 'Yetkinlikler & Beceriler', keywords: ['yetkinlik', 'beceriler', 'skills', 'teknik beceriler', 'technical skills', 'diller', 'languages'] },
  { key: 'projects', title: 'Projeler & Sertifikalar', keywords: ['projeler', 'projects', 'sertifikalar', 'certifications', 'başarılar', 'awards', 'basarilar'] }
];

// Strong action verbs that ATS engines reward
export const ATS_ACTION_VERBS = [
  'Geliştirdi', 'Yönetti', 'Tasarladı', 'Optimize etti', 'Entegre etti',
  'Artırdı', 'Azalttı', 'Kurdu', 'Analiz etti', 'Yeniledi', 'Liderlik etti',
  'Koordine etti', 'Otomatikleştirdi', 'Sunduk', 'Geliştirildi',
  'Implemented', 'Developed', 'Designed', 'Engineered', 'Architected',
  'Optimized', 'Spearheaded', 'Led', 'Streamlined', 'Delivered', 'Automated'
];

/**
 * Normalizes text for robust Turkish/English keyword matching
 * Handles casing peculiarities like 'İ' and 'ı'.
 */
export function normalizeAtsText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[•\-*_\t\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Counts exact keyword occurrences using word boundaries to prevent substring false positives
 * (e.g. 'Java' inside 'JavaScript' or 'Go' inside 'algorithm').
 */
export function countKeywordOccurrences(normalizedText, rawTerm) {
  if (!normalizedText || !rawTerm) return 0;
  const normTerm = normalizeAtsText(rawTerm);
  if (!normTerm) return 0;
  const escaped = normTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match with leading start/non-alphanumeric and trailing end/non-alphanumeric lookahead
  const boundaryRegex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?=[^a-z0-9]|$)`, 'gi');
  const matches = normalizedText.match(boundaryRegex);
  return matches ? matches.length : 0;
}

/**
 * Extracts candidate keywords from job description text
 */
export function extractKeywordsFromJobDescription(jobDesc) {
  if (!jobDesc || typeof jobDesc !== 'string') return [];
  const safeText = jobDesc.slice(0, MAX_INPUT_CHARS);
  const normalizedDesc = normalizeAtsText(safeText);
  const detected = [];

  // Flatten dictionary
  const allDictEntries = [];
  Object.entries(ATS_KEYWORD_DICTIONARY).forEach(([category, terms]) => {
    terms.forEach(term => {
      allDictEntries.push({ term, category });
    });
  });

  // Check matching dictionary terms with boundary checks
  allDictEntries.forEach(({ term, category }) => {
    const occurrences = countKeywordOccurrences(normalizedDesc, term);
    if (occurrences > 0) {
      detected.push({
        keyword: term,
        category,
        countInJob: occurrences,
        importance: occurrences > 2 ? 'Kritik' : 'Önemli'
      });
    }
  });

  // Fallback if no dictionary match found (e.g. customized terms)
  if (detected.length === 0) {
    const commonWords = new Set(['ve', 'ile', 'için', 'bir', 'olan', 'gibi', 'bu', 'da', 'de', 'en', 'the', 'and', 'with', 'for', 'are', 'you']);
    const words = normalizedDesc.split(/\s+/).filter(w => w.length >= 4 && !commonWords.has(w));
    const counts = {};
    words.forEach(w => counts[w] = (counts[w] || 0) + 1);
    const topWords = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    topWords.forEach(([word, count]) => {
      detected.push({
        keyword: word.charAt(0).toUpperCase() + word.slice(1),
        category: 'domain',
        countInJob: count,
        importance: 'Önemli'
      });
    });
  }

  // De-duplicate by keyword name
  const seen = new Set();
  return detected.filter(item => {
    const key = item.keyword.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Checks resume format and structure against standard ATS criteria
 */
export function checkResumeAtsFormatting(resumeText) {
  const norm = normalizeAtsText(resumeText);
  const issues = [];
  let formatScore = 100;

  if (!norm || norm.length < 50) {
    return {
      formatScore: 10,
      hasEmail: false,
      hasPhone: false,
      hasLinkedin: false,
      detectedSections: [],
      missingSections: STANDARD_RESUME_SECTIONS.map(s => s.title),
      metricsFound: [],
      detectedActionVerbs: [],
      issues: [
        {
          rule: 'İçerik Yetersizliği',
          status: 'fail',
          description: 'CV içeriği çok kısa veya boş görünüyor. ATS sistemleri en az 200 kelimelik yapılandırılmış metin bekler.',
          fixSuggestion: 'Lütfen detaylı iş tecrübenizi, projelerinizi ve yetkinliklerinizi ekleyin.'
        }
      ]
    };
  }

  // 1. Contact info verification
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/.test(resumeText) || /\d{10,11}/.test(resumeText);
  const hasLinkedin = /linkedin\.com|linkedin/i.test(resumeText);

  if (!hasEmail) {
    formatScore -= 15;
    issues.push({
      rule: 'E-Posta Adresi',
      status: 'fail',
      description: 'CV metninde geçerli bir kurumsal veya kişisel e-posta adresi tespit edilemedi.',
      fixSuggestion: 'İletişim bilgilerinizin başına belirgin bir e-posta adresi yazın.'
    });
  }

  if (!hasPhone) {
    formatScore -= 10;
    issues.push({
      rule: 'Telefon Numarası',
      status: 'warning',
      description: 'CV metninde açık telefon numarası bulunamadı.',
      fixSuggestion: 'Telefon numaranızı standart formatta (+90 5XX XXX XX XX) ekleyin.'
    });
  }

  // 2. Sections check
  const detectedSections = [];
  const missingSections = [];

  STANDARD_RESUME_SECTIONS.forEach(sec => {
    const found = sec.keywords.some(kw => {
      const normKw = normalizeAtsText(kw);
      return norm.includes(normKw) || norm.includes(kw);
    });
    if (found) {
      detectedSections.push(sec.title);
    } else {
      missingSections.push(sec.title);
      formatScore -= 8;
      issues.push({
        rule: `Bölüm Başlığı: ${sec.title}`,
        status: 'warning',
        description: `Standart "${sec.title}" başlığı CV'nizde açıkça algılanamadı.`,
        fixSuggestion: `Bölüm başlıklarınızı standartlaştırın (Örn: "İş Deneyimi", "Eğitim", "Yetkinlikler").`
      });
    }
  });

  // 3. Measurable Impact / Metrics Check (Percentages, numbers, metrics, currency)
  const metricRegex = /(?:[₺$€%]\s*\d+(?:[.,]\d+)?\s*(?:[kmbt]|milyon|bin)?|\b\d+(?:[.,]\d+)?\s*(?:%|kat|₺|\$|€|tl|eur|usd|k|m|b|\+|adet|proje|kullanıcı|kişilik|milyon|bin))/gi;
  const metricsFound = resumeText.match(metricRegex) || [];
  if (metricsFound.length < 2) {
    formatScore -= 12;
    issues.push({
      rule: 'Ölçülebilir Başarı Metrikleri (KPI & Rakamlar)',
      status: 'warning',
      description: 'Deneyimlerinizde ölçülebilir sonuç (% artış, kullanıcı sayısı, tasarruf) oranı düşük.',
      fixSuggestion: 'Görevlerinizi rakamlarla taçlandırın (Örn: "Sayfa yükleme hızını %40 artırdı", "5 kişilik ekiple 3 proje tamamladı").'
    });
  }

  // 4. Action Verbs Check
  const detectedActionVerbs = [];
  ATS_ACTION_VERBS.forEach(verb => {
    const normVerb = normalizeAtsText(verb);
    const escaped = normVerb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
    if (regex.test(norm)) {
      detectedActionVerbs.push(verb);
    }
  });

  if (detectedActionVerbs.length < 3) {
    formatScore -= 10;
    issues.push({
      rule: 'Eylem Odaklı Fiiller (Action Verbs)',
      status: 'warning',
      description: 'Deneyim maddelerinde güçlü aksiyon fiilleri (Geliştirdi, Yönetti, Optimize etti vb.) yetersiz.',
      fixSuggestion: 'Cümlelerinize edilgen değil, güçlü etken eylem fiilleriyle başlayın.'
    });
  }

  // 5. Special Character & Table Traps
  if (resumeText.includes('<table>') || resumeText.includes('column-break') || (resumeText.match(/\|/g) || []).length > 25) {
    formatScore -= 8;
    issues.push({
      rule: 'Karmaşık Tablo / Çoklu Kolon Tuzağı',
      status: 'warning',
      description: 'Yoğun tablo veya çoklu kolon yapısı bazı ATS sistemlerinde (özellikle Taleo ve Workday) okuma sırasını bozabilir.',
      fixSuggestion: 'Tek sütunlu, akıcı dikey hiyerarşi tercih edin.'
    });
  }

  const clampedScore = Math.max(10, Math.min(100, formatScore));

  return {
    formatScore: clampedScore,
    hasEmail,
    hasPhone,
    hasLinkedin,
    detectedSections,
    missingSections,
    metricsFound: Array.from(new Set(metricsFound)),
    detectedActionVerbs: Array.from(new Set(detectedActionVerbs)),
    issues
  };
}

/**
 * Performs full ATS Scan comparing a resume text against a job description
 */
export function scanResumeAgainstJob(resumeText, jobDescription, options = {}) {
  const rawResume = typeof resumeText === 'string' ? resumeText : '';
  const rawJob = typeof jobDescription === 'string' ? jobDescription : '';
  const safeResume = rawResume.slice(0, MAX_INPUT_CHARS);
  const safeJob = rawJob.slice(0, MAX_INPUT_CHARS);

  const jobKeywords = extractKeywordsFromJobDescription(safeJob);
  const normResume = normalizeAtsText(safeResume);
  const formattingResult = checkResumeAtsFormatting(safeResume);

  const matchedKeywords = [];
  const missingKeywords = [];

  jobKeywords.forEach(item => {
    const occurrences = countKeywordOccurrences(normResume, item.keyword);
    
    if (occurrences > 0) {
      matchedKeywords.push({
        ...item,
        countInResume: occurrences
      });
    } else {
      missingKeywords.push({
        ...item,
        countInResume: 0,
        recommendation: `Bu anahtar kelimeyi "${item.category === 'soft_skills' ? 'Yetkinlikler veya Özet' : 'İş Deneyimi veya Projeler'}" bölümüne dahil edin.`
      });
    }
  });

  // Calculate Keyword Match Rate
  const totalKeywords = jobKeywords.length;
  const matchedCount = matchedKeywords.length;
  const keywordMatchPercent = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 75;

  // Weighted overall score
  // 40% Keyword Match + 25% Experience/Education Structure + 20% Impact Metrics + 15% ATS Format
  const experienceScore = (formattingResult?.detectedSections || []).includes('İş & Staj Deneyimi') ? 90 : 40;
  const metricsCount = (formattingResult?.metricsFound || []).length;
  const actionVerbsCount = (formattingResult?.detectedActionVerbs || []).length;
  const impactScore = Math.min(100, metricsCount * 25 + actionVerbsCount * 15);
  const atsFormatScore = formattingResult?.formatScore || 50;

  const rawOverall = Math.round(
    (keywordMatchPercent * 0.40) +
    (experienceScore * 0.25) +
    (impactScore * 0.20) +
    (atsFormatScore * 0.15)
  );
  const overallScore = Math.max(5, Math.min(100, rawOverall));

  // Determine ATS System Compatibility
  const systemCompatibility = {
    workday: {
      name: 'Workday ATS',
      compatibility: Math.round(overallScore * 0.98),
      verdict: overallScore >= 75 ? 'Yüksek Uyum' : overallScore >= 50 ? 'Orta Risk' : 'Otomatik Eleme Riski',
      notes: 'Workday anahtar kelime frekansına ve net unvan eşleşmelerine duyarlıdır.'
    },
    taleo: {
      name: 'Oracle Taleo',
      compatibility: Math.round(overallScore * 0.92),
      verdict: overallScore >= 70 ? 'Yüksek Uyum' : overallScore >= 48 ? 'Orta Risk' : 'Format Uyumsuzluğu Riski',
      notes: 'Taleo standart bölüm başlıklarına ve kronolojik sıra tutarlılığına bakar.'
    },
    greenhouse: {
      name: 'Greenhouse',
      compatibility: Math.round(overallScore * 1.02 > 100 ? 100 : overallScore * 1.02),
      verdict: overallScore >= 80 ? 'Mükemmel Uyum' : overallScore >= 55 ? 'Kabul Edilebilir' : 'Geliştirilmeli',
      notes: 'Greenhouse modern start-up ve teknoloji şirketlerinde yetkinlik etiketlerini tarar.'
    },
    lever: {
      name: 'Lever ATS',
      compatibility: Math.round(overallScore * 0.96),
      verdict: overallScore >= 75 ? 'Yüksek Uyum' : overallScore >= 50 ? 'Orta Risk' : 'Düşük Puan',
      notes: 'Lever sosyal profil linklerini (GitHub, LinkedIn) ve portfolyoyu önceler.'
    }
  };

  const scanReport = {
    id: `ats_scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    scannedAt: new Date().toISOString(),
    overallScore,
    breakdown: {
      keywordMatchPercent,
      experienceScore,
      impactScore,
      atsFormatScore
    },
    totalJobKeywords: totalKeywords,
    matchedCount,
    missingCount: missingKeywords.length,
    matchedKeywords,
    missingKeywords,
    formattingResult,
    systemCompatibility,
    targetRole: options.jobTitle || 'Hedef İlan Pozisyonu'
  };

  return scanReport;
}

/**
 * Generates tailored AI optimization recommendations and bullet points
 */
export function generateAtsOptimizationSuggestions(scanReport, jobTitle = 'Yazılım Geliştirici') {
  if (!scanReport) return null;
  const missing = scanReport.missingKeywords || [];
  const topMissingTechnical = missing.filter(m => m.category !== 'soft_skills').slice(0, 5);
  const topMissingSoft = missing.filter(m => m.category === 'soft_skills').slice(0, 3);

  const suggestedSummary = `İstanbul Esenyurt Üniversitesi mezunu, ${topMissingTechnical.map(k => k.keyword).join(', ')} teknolojilerinde uygulamalı deneyime sahip, analitik düşünme ve ${topMissingSoft.map(k => k.keyword).join(', ')} odaklı ${jobTitle}.`;

  const suggestedBulletPoints = topMissingTechnical.map(item => {
    return `${item.keyword} teknolojisini kullanarak yüksek performanslı mimari çözümler geliştirdi ve operasyonel verimliliği %25 artırdı.`;
  });

  return {
    jobTitle,
    suggestedSummary,
    suggestedBulletPoints,
    quickFixCount: missing.length + (scanReport.formattingResult?.issues?.length || 0)
  };
}

/**
 * LocalStorage management for scan history
 */
export function saveAtsScanResult(scanReport) {
  if (!scanReport || !scanReport.id) return false;
  try {
    const history = getAtsScanHistory();
    const updated = [scanReport, ...history.filter(h => h.id !== scanReport.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY_SCANS, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.warn('[atsScannerWorkflow] Failed to save scan to localStorage:', e);
    return false;
  }
}

export function getAtsScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCANS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearAtsScanHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY_SCANS);
    return true;
  } catch {
    return false;
  }
}
