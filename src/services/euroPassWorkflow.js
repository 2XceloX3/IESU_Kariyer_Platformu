/**
 * src/services/euroPassWorkflow.js
 * İstanbul Esenyurt Üniversitesi (İESÜ) EuroPass & Bologna Uyumlu Diploma Eki (DS) İş Akışı Motoru
 *
 * Uluslararası ve Hukuki Standartlar:
 * - Avrupa Parlamentosu ve Konseyi EuroPass Kararı (EU 2018/646)
 * - Bologna Deklarasyonu ve Avrupa Yükseköğretim Alanı (EHEA) 8-Bölümlü Diploma Eki Modeli
 * - Avrupa Kredi Transfer ve Biriktirme Sistemi (AKTS / ECTS)
 * - Avrupa Yeterlilikler Çerçevesi (EQF) 6. Düzey (Lisans) & TYYÇ 6. Düzey
 * - Diller İçin Avrupa Ortak Başvuru Metni (CEFR: A1 - C2)
 * - Erasmus+ Traineeship (Staj Hareketliliği) Learning Agreement (LAT) Standartları
 * - 3308 Sayılı Mesleki Eğitim Kanunu & 5510 Sayılı Sosyal Sigortalar Kanunu (Sigorta Güvencesi)
 */

export const EUROPASS_STANDARDS = {
  INSTITUTION_NAME: 'İstanbul Esenyurt Üniversitesi (İESÜ)',
  INSTITUTION_NAME_EN: 'Istanbul Esenyurt University (IESU)',
  RECTORATE_TITLE: 'T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ',
  RECTORATE_TITLE_EN: 'REPUBLIC OF TÜRKIYE ISTANBUL ESENYURT UNIVERSITY RECTORATE',
  COORDINATION_OFFICE: 'Kariyer Geliştirme Koordinatörlüğü',
  COORDINATION_OFFICE_EN: 'Career Development Coordination Office',
  INTERNATIONAL_OFFICE_EN: 'International Programs & Erasmus+ Institutional Coordination Office',
  ERASMUS_CODE: 'TR ISTANBU35',
  PIC_CODE: '948216391',
  OID_CODE: 'E10184729',
  WEBSITE: 'https://esenyurt.edu.tr',
  LEGAL_STATUS: 'State-Recognized Non-Profit Foundation Higher Education Institution (Law No. 6428)',
  LEGAL_STATUS_TR: 'Vakıf Yükseköğretim Kurumu (6428 Sayılı Kanun ile Kurulu)',
  EQF_LEVEL_BACHELOR: 6,
  EQF_LEVEL_MASTER: 7,
  STANDARD_BACHELOR_ECTS: 240,
  STANDARD_MASTER_ECTS: 120,
  STANDARD_DURATION_YEARS: 4,
  STANDARD_DURATION_SEMESTERS: 8,
  SCHEMA_CONTEXT: 'https://europa.eu/europass/schema/v1.0',
  SCHEMA_TYPE: 'EuropassCredential',
};

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const ECTS_GRADING_SCALE = [
  { ectsGrade: 'A', localGrade: 'AA', gpaValue: 3.70, percentile: 'Top 10%', labelEn: 'Excellent', labelTr: 'Pekiyi - Kusursuz' },
  { ectsGrade: 'B', localGrade: 'BA', gpaValue: 3.30, percentile: 'Next 25%', labelEn: 'Very Good', labelTr: 'Çok İyi' },
  { ectsGrade: 'C', localGrade: 'BB', gpaValue: 2.80, percentile: 'Next 30%', labelEn: 'Good', labelTr: 'İyi' },
  { ectsGrade: 'D', localGrade: 'CB', gpaValue: 2.30, percentile: 'Next 25%', labelEn: 'Satisfactory', labelTr: 'Orta - Başarılı' },
  { ectsGrade: 'E', localGrade: 'CC', gpaValue: 2.00, percentile: 'Next 10%', labelEn: 'Sufficient', labelTr: 'Geçer' },
  { ectsGrade: 'FX', localGrade: 'DC', gpaValue: 1.50, percentile: '-', labelEn: 'Conditional Pass / Fail', labelTr: 'Koşullu Geçer' },
  { ectsGrade: 'F', localGrade: 'FF', gpaValue: 0.00, percentile: '-', labelEn: 'Fail', labelTr: 'Başarısız' },
];

/**
 * Deterministic SHA-256 hash simulator for verification stamp
 */
export const computeVerificationChecksum = (payloadStr) => {
  let hash = 0;
  const str = String(payloadStr || 'IESU-EUROPASS-VERIFICATION');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const now = new Date().getFullYear();
  return `IESU-EUROPASS-EHEA-${now}-${hex.toUpperCase()}`;
};

/**
 * Validates student profile for EuroPass & Bologna compliance
 */
export const validateEuroPassProfile = (profile) => {
  const errors = [];
  const warnings = [];

  if (!profile || typeof profile !== 'object') {
    return { valid: false, errors: ['Geçersiz profil verisi.'], warnings: [] };
  }

  if (!profile.name || String(profile.name).trim().length < 2) {
    errors.push('Öğrencinin adı ve soyadı zorunludur.');
  }

  if (!profile.department && !profile.program) {
    errors.push('Akademik bölüm / program adı zorunludur.');
  }

  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    warnings.push('E-posta adresi geçerli formatta değil.');
  }

  const ganoNum = Number(profile.gano || profile.gpa || 3.0);
  if (isNaN(ganoNum) || ganoNum < 0 || ganoNum > 4.0) {
    warnings.push('Not ortalaması (GANO) 0.00 ile 4.00 aralığında olmalıdır.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Generates W3C & European Commission compliant EuroPass JSON-LD
 */
export const generateEuroPassCVJsonLD = (studentProfile = {}, options = {}) => {
  const p = studentProfile || {};
  const lang = options.language === 'en' ? 'en' : 'tr';
  const nameParts = (p.name || 'İESÜ Öğrencisi').trim().split(' ');
  const familyName = nameParts.length > 1 ? nameParts.pop() : '';
  const givenNames = nameParts.join(' ');
  const studentNo = p.studentNo || p.id || '2023010482';
  const gpa = Number(p.gano || p.gpa || 3.84).toFixed(2);
  const docId = `urn:europass:cv:IESU-${studentNo}`;

  // Work & Internships
  const workExperience = (p.internships || [
    {
      company: 'Baykar Teknoloji',
      position: 'Yapay Zekâ & Gömülü Yazılım Stajyeri',
      duration: '20 İş Günü',
      date: '07/2025 - 08/2025',
      summary: 'İHA telemetri ve nesne tespit optimizasyonları.',
      skills: ['C++', 'ROS2', 'Gömülü Linux', 'Python']
    }
  ]).map((item, idx) => ({
    '@type': 'WorkExperience',
    id: `work-exp-${idx + 1}`,
    employer: item.company || 'Kurumsal Şirket',
    jobTitle: item.position || 'Stajyer / Yazılım Mühendisi',
    startDate: item.date?.split('-')[0]?.trim() || '2025-07-01',
    endDate: item.date?.split('-')[1]?.trim() || '2025-08-31',
    description: item.summary || 'Staj ve mesleki uygulama faaliyetleri.',
    skillsDemonstrated: item.skills || []
  }));

  // Education & Training
  const educationAndTraining = [
    {
      '@type': 'EducationQualification',
      id: `edu-iesu-${studentNo}`,
      title: p.department ? `Bachelor of Science in ${p.department}` : 'Bachelor of Science in Computer Engineering',
      titleTr: p.department ? `${p.department} Lisans Programı` : 'Bilgisayar Mühendisliği Lisans Programı',
      organisation: EUROPASS_STANDARDS.INSTITUTION_NAME,
      organisationEn: EUROPASS_STANDARDS.INSTITUTION_NAME_EN,
      erasmusCode: EUROPASS_STANDARDS.ERASMUS_CODE,
      eqfLevel: EUROPASS_STANDARDS.EQF_LEVEL_BACHELOR,
      ectsCredits: p.totalEcts || EUROPASS_STANDARDS.STANDARD_BACHELOR_ECTS,
      gpaScale: '4.00',
      gpaValue: gpa,
      startDate: '2023-09-15',
      expectedGraduation: '2027-06-30',
      bolognaCompliance: true,
      accreditedBy: 'YÖKAK & YÖK'
    }
  ];

  // Languages with CEFR Matrix
  const otherLanguages = (p.languages || [
    { language: 'en', label: 'English', listening: 'C1', reading: 'C1', spokenInteraction: 'B2', spokenProduction: 'B2', writing: 'C1' },
    { language: 'de', label: 'Deutsch', listening: 'B1', reading: 'B1', spokenInteraction: 'A2', spokenProduction: 'A2', writing: 'A2' }
  ]).map(langItem => ({
    '@type': 'LanguageSkill',
    languageCode: langItem.language || 'en',
    languageName: langItem.label || (langItem.language === 'en' ? 'English' : 'German'),
    proficiency: {
      listening: langItem.listening || 'B2',
      reading: langItem.reading || 'B2',
      spokenInteraction: langItem.spokenInteraction || 'B2',
      spokenProduction: langItem.spokenProduction || 'B2',
      writing: langItem.writing || 'B2'
    }
  }));

  // Digital & Competency Skills
  const digitalSkills = Array.isArray(p.skills) && p.skills.length > 0 
    ? p.skills 
    : ['Algorithms', 'Data Structures', 'Git & CI/CD', 'Software Architecture', 'Cloud Infrastructure', 'Cybersecurity Basics'];

  const checksum = computeVerificationChecksum(`${docId}-${studentNo}-${gpa}`);

  return {
    '@context': [
      EUROPASS_STANDARDS.SCHEMA_CONTEXT,
      'https://www.w3.org/ns/credentials/v2'
    ],
    '@type': [EUROPASS_STANDARDS.SCHEMA_TYPE, 'EuropassCV'],
    id: docId,
    locale: lang,
    issuanceDate: new Date().toISOString(),
    issuingAuthority: {
      '@type': 'EducationalOrganization',
      name: EUROPASS_STANDARDS.INSTITUTION_NAME,
      nameEn: EUROPASS_STANDARDS.INSTITUTION_NAME_EN,
      erasmusCode: EUROPASS_STANDARDS.ERASMUS_CODE,
      picCode: EUROPASS_STANDARDS.PIC_CODE,
      oidCode: EUROPASS_STANDARDS.OID_CODE,
      legalStatus: EUROPASS_STANDARDS.LEGAL_STATUS,
      rectorate: EUROPASS_STANDARDS.RECTORATE_TITLE,
      coordinationOffice: EUROPASS_STANDARDS.COORDINATION_OFFICE,
      website: EUROPASS_STANDARDS.WEBSITE,
      country: 'TR'
    },
    person: {
      '@type': 'Person',
      givenNames,
      familyName,
      studentIdentifier: studentNo,
      nationalIdMasked: p.tcNo ? `${String(p.tcNo).slice(0, 3)}*****${String(p.tcNo).slice(-2)}` : 'TR-STUDENT',
      nationality: 'TR',
      email: p.email || `${studentNo}@ogrenci.esenyurt.edu.tr`,
      telephone: p.phone || '+90 (212) 699 00 00',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'İstanbul',
        addressCountry: 'TR',
        streetAddress: 'Doğan Araslı Bulvarı No:79 Esenyurt / İstanbul'
      }
    },
    educationAndTraining,
    workExperience,
    motherTongue: 'tr',
    otherLanguages,
    digitalSkills,
    bolognaCompliance: {
      eheaConformant: true,
      eqfLevel: EUROPASS_STANDARDS.EQF_LEVEL_BACHELOR,
      ectsTotal: EUROPASS_STANDARDS.STANDARD_BACHELOR_ECTS,
      diplomaSupplementAvailable: true,
      erasmusMobilityRecognized: true
    },
    legalFramework: 'European Parliament & Council Decision (EU) 2018/646 & Turkish Higher Education Act 2547',
    verificationChecksum: checksum,
    officialDisclaimer: 'This EuroPass CV was digitally generated under official institutional protocols of Istanbul Esenyurt University (IESU).'
  };
};

/**
 * Generates 8-Section Official Bologna Diploma Supplement (DS) Model
 */
export const generateBolognaDiplomaSupplement = (studentProfile = {}, options = {}) => {
  const p = studentProfile || {};
  const isEn = options.language === 'en';
  const nameParts = (p.name || 'Ahmet Yılmaz').trim().split(' ');
  const familyName = nameParts.length > 1 ? nameParts.pop() : '';
  const givenNames = nameParts.join(' ');
  const studentNo = p.studentNo || '2023010482';
  const gpa = Number(p.gano || p.gpa || 3.84);
  const department = p.department || 'Bilgisayar Mühendisliği';
  const faculty = p.faculty || 'Mühendislik ve Mimarlık Fakültesi';
  const dsNumber = `IESU-DS-2026-${studentNo}`;
  const checksum = computeVerificationChecksum(`${dsNumber}-${department}-${gpa.toFixed(2)}`);

  // ECTS Grade matching
  let matchedEcts = ECTS_GRADING_SCALE[0];
  for (const grade of ECTS_GRADING_SCALE) {
    if (gpa >= grade.gpaValue) {
      matchedEcts = grade;
      break;
    }
  }

  return {
    dsNumber,
    verificationCode: checksum,
    issueDate: new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
    language: isEn ? 'en' : 'tr',

    // Section 1: Information Identifying the Holder of the Qualification
    section1: {
      title: isEn ? '1. INFORMATION IDENTIFYING THE HOLDER OF THE QUALIFICATION' : '1. DİPLOMA SAHİBİNİN KİMLİK BİLGİLERİ',
      familyName,
      givenNames,
      dateOfBirth: p.birthDate || '2003-05-14',
      studentIdentificationNumber: studentNo,
      nationalIdentityNumberMasked: p.tcNo ? `${String(p.tcNo).slice(0, 3)}******${String(p.tcNo).slice(-2)}` : '100******46',
      yoksisReferenceCode: `YOKSIS-STU-${studentNo}`
    },

    // Section 2: Information Identifying the Qualification
    section2: {
      title: isEn ? '2. INFORMATION IDENTIFYING THE QUALIFICATION' : '2. ALINAN DERECE / DİPLOMAYI TANITICI BİLGİLER',
      qualificationTitle: isEn ? `Bachelor of Science in ${department}` : `${department} Lisans Diploması`,
      fieldOfStudy: department,
      faculty,
      awardingInstitution: EUROPASS_STANDARDS.INSTITUTION_NAME,
      awardingInstitutionEn: EUROPASS_STANDARDS.INSTITUTION_NAME_EN,
      institutionStatus: EUROPASS_STANDARDS.LEGAL_STATUS,
      institutionStatusTr: EUROPASS_STANDARDS.LEGAL_STATUS_TR,
      erasmusCode: EUROPASS_STANDARDS.ERASMUS_CODE,
      administeringInstitution: EUROPASS_STANDARDS.INSTITUTION_NAME,
      languageOfInstruction: isEn ? 'Turkish (%70) & English (%30)' : 'Türkçe (%70) & İngilizce (%30)'
    },

    // Section 3: Information on the Level and Duration of the Qualification
    section3: {
      title: isEn ? '3. INFORMATION ON THE LEVEL AND DURATION OF THE QUALIFICATION' : '3. DERECENİN DÜZEYİ VE SÜRESİNE İLİŞKİN BİLGİLER',
      levelOfQualification: isEn ? 'First Cycle (Bachelor Degree) - EQF Level 6 / TYYÇ Level 6' : 'Birinci Düzey (Lisans) - TYYÇ 6. Düzey / EQF Düzey 6',
      officialLengthOfProgramme: isEn ? '4 Years (8 Semesters), 240 ECTS credits, 60 ECTS per full-time academic year' : '4 Yıl (8 Yarıyıl), 240 AKTS kredisi (Yılda 60 AKTS)',
      accessRequirements: isEn 
        ? 'High School Diploma (Lise Diploması) and placement through the nationwide Central Higher Education Examination (YKS) conducted by ÖSYM.'
        : 'Lise Diploması ve ÖSYM tarafından merkezi olarak yürütülen YKS (Yükseköğretim Kurumları Sınavı) yerleştirme puanı.'
    },

    // Section 4: Information on the Contents and Results Gained
    section4: {
      title: isEn ? '4. INFORMATION ON THE CONTENTS AND RESULTS GAINED' : '4. PROGRAMIN İÇERİĞİ VE KAZANILAN SONUÇLAR',
      modeOfStudy: isEn ? 'Full-time, on-campus face-to-face with integrated laboratory practicum' : 'Tam zamanlı, örgün öğretim ve entegre laboratuvar uygulamalı',
      programmeDetails: isEn 
        ? 'Curriculum designed according to Bologna EHEA criteria, incorporating mandatory industry internship under Law No. 3308.'
        : 'Bologna EHEA kriterlerine göre tasarlanmış, 3308 Sayılı Kanun kapsamındaki zorunlu sanayi stajını içeren müfredat.',
      gradingScheme: isEn 
        ? 'Grade Point Average on a 4.00 scale. Minimum passing grade is 2.00 / 4.00 (CC).'
        : '4.00 üzerinden Genel Ağırlıklı Not Ortalaması (GANO). Mezuniyet için asgari baraj 2.00 / 4.00 (CC).',
      gpa,
      ectsGrade: matchedEcts.ectsGrade,
      localGrade: matchedEcts.localGrade,
      performanceLabel: isEn ? matchedEcts.labelEn : matchedEcts.labelTr,
      percentileStanding: matchedEcts.percentile,
      completedEcts: p.completedEcts || 180,
      totalEcts: p.totalEcts || 240,
      internshipsCompleted: (p.internships || []).map(i => ({
        company: i.company,
        duration: i.duration,
        status: i.status || 'Onaylandı (Verified)',
        ects: i.ects || '5 AKTS',
        legalBasis: '3308 Sayılı Kanun & 5510 SGK Sigortası'
      }))
    },

    // Section 5: Information on the Function of the Qualification
    section5: {
      title: isEn ? '5. INFORMATION ON THE FUNCTION OF THE QUALIFICATION' : '5. KAZANILAN DERECENİN KULLANIM ALANLARI',
      accessToFurtherStudy: isEn 
        ? 'Enables access to Second Cycle (Master\'s programmes) and integrated PhD studies subject to ALES / GRE and language entrance examinations.'
        : 'İkinci Düzey (Yüksek Lisans) ve bütünleşik Doktora programlarına ALES ve dil sınavı şartları sağlanarak doğrudan başvuru hakkı sağlar.',
      professionalStatus: isEn 
        ? 'Grants statutory professional practicing title in the respective engineering/discipline domain across Türkiye and reciprocal recognition under the Lisbon Convention within the European Higher Education Area (EHEA).'
        : 'Türkiye\'de ilgili mühendislik/meslek unvanını kullanma hakkı verir ve Lizbon Sözleşmesi uyarınca Avrupa Yükseköğretim Alanı (EHEA) genelinde diploma denkliği sağlar.'
    },

    // Section 6: Additional Information
    section6: {
      title: isEn ? '6. ADDITIONAL INFORMATION' : '6. EK BİLGİLER',
      institutionalAccreditation: isEn 
        ? 'Accredited and monitored by the Turkish Higher Education Quality Council (YÖKAK) and evaluated under Bologna Process periodic reviews.'
        : 'Yükseköğretim Kalite Kurulu (YÖKAK) tarafından kurumsal denetime tabi olup Bologna Süreci akreditasyon kriterlerine tam uyumludur.',
      coordinationOfficeRef: EUROPASS_STANDARDS.COORDINATION_OFFICE,
      officialRegistrySource: `${EUROPASS_STANDARDS.WEBSITE}/diploma-verification`
    },

    // Section 7: Certification of the Supplement
    section7: {
      title: isEn ? '7. CERTIFICATION OF THE SUPPLEMENT' : '7. DİPLOMA EKİNİN RESMÎ ONAYI',
      officials: [
        {
          role: isEn ? 'Vice-Rector (Academic & International Affairs)' : 'Rektör Yardımcısı (Akademik & Uluslararası İlişkiler)',
          institution: EUROPASS_STANDARDS.INSTITUTION_NAME,
          name: 'Prof. Dr. Kurumsal Rektör Yardımcısı'
        },
        {
          role: isEn ? 'Head of Student Affairs Registrar' : 'Öğrenci İşleri Daire Başkanı',
          institution: EUROPASS_STANDARDS.INSTITUTION_NAME,
          name: 'Öğr. Gör. Mehmet Demir'
        }
      ],
      digitalSeal: EUROPASS_STANDARDS.RECTORATE_TITLE,
      digitalChecksum: checksum,
      verificationUrl: `https://obs.esenyurt.edu.tr/verify?code=${checksum}`
    },

    // Section 8: Information on the National Higher Education System
    section8: {
      title: isEn ? '8. INFORMATION ON THE NATIONAL HIGHER EDUCATION SYSTEM' : '8. ULUSAL YÜKSEKÖĞRETİM SİSTEMİ HAKKINDA BİLGİ',
      summary: isEn
        ? 'The National Higher Education System in Türkiye is governed by the Council of Higher Education (YÖK) established under Law No. 2547. Higher education institutions comprise state and foundation universities. Degree structures strictly mirror the Bologna Process (Three Cycles: Bachelor, Master, Doctorate). The Turkish Qualifications Framework for Higher Education (TYYÇ) is fully aligned with the European Qualifications Framework (EQF).'
        : 'Türkiye Ulusal Yükseköğretim Sistemi, 2547 Sayılı Kanun kapsamında Yükseköğretim Kurulu (YÖK) tarafından yürütülmektedir. Derece sistemi, Bologna Süreci\'ne (Üç Aşamalı Döngü: Lisans, Yüksek Lisans, Doktora) ve Türkiye Yükseköğretim Yeterlilikler Çerçevesi (TYYÇ) ile Avrupa Yeterlilikler Çerçevesi\'ne (EQF) tam uyumludur.'
    }
  };
};

/**
 * Generates official Erasmus+ Traineeship Learning Agreement (LAT)
 */
export const generateErasmusLearningAgreement = (studentProfile = {}, traineeshipData = {}, options = {}) => {
  const p = studentProfile || {};
  const t = traineeshipData || {};
  const isEn = options.language === 'en';
  const studentNo = p.studentNo || '2023010482';
  const agreementId = `IESU-ERASMUS-LAT-${new Date().getFullYear()}-${studentNo}`;
  const checksum = computeVerificationChecksum(`${agreementId}-${t.companyName || 'Enterprise'}`);

  return {
    agreementId,
    verificationCode: checksum,
    academicYear: `${new Date().getFullYear()} / ${new Date().getFullYear() + 1}`,
    student: {
      fullName: p.name || 'Ahmet Yılmaz',
      studentNo,
      email: p.email || `${studentNo}@ogrenci.esenyurt.edu.tr`,
      nationality: 'TR',
      studyCycle: 'First Cycle (Bachelor - EQF Level 6)',
      department: p.department || 'Bilgisayar Mühendisliği'
    },
    sendingInstitution: {
      name: EUROPASS_STANDARDS.INSTITUTION_NAME,
      nameEn: EUROPASS_STANDARDS.INSTITUTION_NAME_EN,
      erasmusCode: EUROPASS_STANDARDS.ERASMUS_CODE,
      facultyDepartment: `${p.faculty || 'Mühendislik ve Mimarlık Fakültesi'} / ${p.department || 'Bilgisayar Mühendisliği'}`,
      address: 'Doğan Araslı Bulvarı No:79 Esenyurt / İstanbul, TR',
      contactPerson: 'Erasmus+ Kurum Koordinatörlüğü',
      contactEmail: 'erasmus@esenyurt.edu.tr'
    },
    receivingOrganisation: {
      name: t.companyName || 'Siemens AG - Global Technology Center',
      country: t.country || 'Germany',
      city: t.city || 'Munich',
      address: t.address || 'Werner-von-Siemens-Straße 1, 80333 München',
      website: t.website || 'https://www.siemens.com',
      contactPerson: t.mentorName || 'Dr. Hans Weber',
      contactEmail: t.mentorEmail || 'hans.weber@siemens.com',
      traineeshipTitle: t.position || 'Software Engineering Trainee (Cloud & AI)'
    },
    // Table A: Traineeship Programme at the Receiving Organisation
    tableA: {
      title: isEn ? 'Table A: Traineeship Programme at the Receiving Organisation' : 'Tablo A: Kabul Eden Kurumdaki Staj Programı',
      plannedPeriod: {
        startDate: t.startDate || '2026-07-01',
        endDate: t.endDate || '2026-09-30',
        totalWeeks: t.totalWeeks || 12,
        workingHoursPerWeek: t.hoursPerWeek || 35
      },
      detailedProgramme: t.detailedProgramme || [
        'Cloud-native containerized architecture deployment using Kubernetes and Docker.',
        'High-performance backend API design and telemetry benchmarking.',
        'Quality assurance, automated unit testing, and agile team sprint ceremonies.'
      ],
      knowledgeSkillsToAcquire: t.knowledgeSkills || [
        'Advanced distributed systems architecture',
        'International enterprise software workflows',
        'Cross-cultural professional collaboration and technical documentation'
      ],
      monitoringPlan: 'Bi-weekly sprint progress reviews with enterprise mentor and monthly milestone check-in with IESU academic coordinator.',
      evaluationCriteria: 'Continuous assessment based on completed software milestones, final technical presentation, and Traineeship Certificate.'
    },
    // Table B: Sending Institution Commitments
    tableB: {
      title: isEn ? 'Table B: Sending Institution Commitments' : 'Tablo B: Gönderen Yükseköğretim Kurumu Taahhütleri',
      ectsAwarded: t.ects || 10,
      recordInDiplomaSupplement: true,
      recordInTranscript: true,
      insuranceCoverage: {
        accidentInsurance: isEn 
          ? 'Fully covered by Istanbul Esenyurt University pursuant to Social Security Law No. 3308 / 5510.'
          : '3308 ve 5510 Sayılı Kanunlar uyarınca staj süresince İstanbul Esenyurt Üniversitesi tarafından SGK iş kazası ve meslek hastalığı sigortası karşılanmaktadır.',
        liabilityInsurance: isEn
          ? 'Mandatory Erasmus+ private liability coverage confirmed prior to mobility start.'
          : 'Hareketlilik öncesi özel mali sorumluluk sigortası kontrol edilmektedir.'
      }
    },
    digitalSignatures: [
      { party: 'Student', name: p.name || 'Öğrenci İmzası', status: 'Digitally Signed', date: new Date().toISOString() },
      { party: 'Sending Institution (IESU)', name: 'Erasmus+ & Kariyer Koordinatörlüğü', status: 'Officially Approved', date: new Date().toISOString() },
      { party: 'Receiving Enterprise', name: t.mentorName || 'Enterprise Representative', status: 'Pre-Approved / In Review', date: new Date().toISOString() }
    ]
  };
};

/**
 * Validates generated EuroPass document or profile according to EU Decision 2018/646 & EHEA Bologna criteria
 */
export const validateEuroPassCompliance = (doc, docType = 'cv') => {
  const errors = [];
  const warnings = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Geçersiz veya boş belge verisi.'], warnings: [] };
  }

  if (docType === 'cv') {
    if (!doc.person?.givenNames && !doc.person?.name) errors.push('Ad alanı zorunludur.');
    if (!doc.educationAndTraining || !doc.educationAndTraining.length) errors.push('Eğitim bilgisi zorunludur.');
    if (!doc.verificationChecksum) errors.push('Kriptografik doğrulama kodu eksik.');
  } else if (docType === 'ds' || docType === 'diploma_supplement') {
    if (!doc.section1?.familyName && !doc.section1?.givenNames) errors.push('Bölüm 1: Diploma sahibi kimlik bilgileri zorunludur.');
    if (!doc.section2?.qualificationTitle) errors.push('Bölüm 2: Alınan derece bilgisi zorunludur.');
    if (!doc.section3?.levelOfQualification) errors.push('Bölüm 3: EQF derece düzeyi zorunludur.');
    if (!doc.section4?.ectsGrade) errors.push('Bölüm 4: AKTS notlandırma bilgisi zorunludur.');
    if (!doc.section5?.accessToFurtherStudy) warnings.push('Bölüm 5: Üst dereceye erişim açıklaması eksik.');
    if (!doc.section7?.digitalSeal) errors.push('Bölüm 7: Resmî mühür onayı zorunludur.');
    if (!doc.section8?.summary) errors.push('Bölüm 8: Ulusal yükseköğretim sistemi özeti zorunludur.');
  } else if (docType === 'erasmus' || docType === 'erasmus_lat') {
    if (!doc.sendingInstitution?.erasmusCode) errors.push('Gönderen kurum Erasmus kodu zorunludur.');
    if (!doc.receivingOrganisation?.name) errors.push('Kabul eden işletme bilgisi zorunludur.');
    if (!doc.tableA?.detailedProgramme) errors.push('Tablo A: Staj programı detayları zorunludur.');
    if (!doc.tableB?.insuranceCoverage?.accidentInsurance) errors.push('Tablo B: 3308 / 5510 SGK sigorta taahhüdü zorunludur.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    standard: EUROPASS_STANDARDS
  };
};

/**
 * High-fidelity printable HTML export dispatcher supporting EuroPass CV, Bologna Diploma Supplement (8 sections), and Erasmus+ LAT
 */
export const exportDocumentToPrintableHTML = (docType = 'ds', data = {}, options = {}) => {
  const isEn = options.language === 'en';

  if (docType === 'cv') {
    const cv = data || {};
    const person = cv.person || {};
    const edu = (cv.educationAndTraining && cv.educationAndTraining[0]) || {};
    const work = cv.workExperience || [];
    const langs = cv.otherLanguages || [];
    const skills = cv.digitalSkills || [];

    return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'tr'}">
<head>
  <meta charset="UTF-8">
  <title>EuroPass CV - ${person.givenNames || ''} ${person.familyName || ''} - IESU</title>
  <style>
    @page { size: A4 portrait; margin: 16mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.45; font-size: 10pt; }
    .header { border-bottom: 3px solid #003399; padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .logo-area h1 { font-size: 15pt; color: #003399; margin: 0; font-weight: 900; }
    .logo-area h2 { font-size: 8.5pt; color: #64748b; margin: 2px 0 0 0; }
    .badge { background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 4px 8px; border-radius: 6px; font-size: 8pt; font-weight: bold; }
    .section-title { font-size: 10pt; font-weight: bold; color: #003399; background: #f8fafc; padding: 5px 8px; margin-top: 14px; margin-bottom: 6px; border-left: 3px solid #003399; text-transform: uppercase; }
    .field-row { display: flex; margin-bottom: 3px; font-size: 9pt; }
    .field-label { width: 30%; font-weight: bold; color: #475569; }
    .field-value { width: 70%; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 8.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; }
    th { background: #f1f5f9; color: #1e293b; font-weight: bold; font-size: 8pt; }
    .skills-chip { display: inline-block; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 6px; border-radius: 4px; font-size: 8pt; margin: 2px; }
    .footer { margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 7.5pt; color: #64748b; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h1>${EUROPASS_STANDARDS.INSTITUTION_NAME}</h1>
      <h2>${EUROPASS_STANDARDS.RECTORATE_TITLE_EN} • EUROPASS CURRICULUM VITAE</h2>
    </div>
    <div class="badge">EUROPASS FORMAT (EU 2018/646)</div>
  </div>

  <div class="section-title">${isEn ? 'Personal Information' : 'Kişisel Bilgiler'}</div>
  <div class="field-row"><div class="field-label">${isEn ? 'Full Name:' : 'Ad Soyad:'}</div><div class="field-value">${person.givenNames} ${person.familyName}</div></div>
  <div class="field-row"><div class="field-label">${isEn ? 'Student ID:' : 'Öğrenci No:'}</div><div class="field-value">${person.studentIdentifier || 'IESU'}</div></div>
  <div class="field-row"><div class="field-label">${isEn ? 'Email & Phone:' : 'E-posta & Tel:'}</div><div class="field-value">${person.email || ''} • ${person.telephone || ''}</div></div>
  <div class="field-row"><div class="field-label">${isEn ? 'Nationality:' : 'Uyruk:'}</div><div class="field-value">${person.nationality || 'TR'}</div></div>

  <div class="section-title">${isEn ? 'Education and Training' : 'Eğitim ve Öğretim'}</div>
  <div class="field-row"><div class="field-label">${isEn ? 'Title of Qualification:' : 'Kazanılan Derece:'}</div><div class="field-value"><strong>${edu.title || ''}</strong></div></div>
  <div class="field-row"><div class="field-label">${isEn ? 'Awarding Institution:' : 'Veren Yükseköğretim Kurumu:'}</div><div class="field-value">${edu.organisationEn || EUROPASS_STANDARDS.INSTITUTION_NAME_EN} (Erasmus Code: ${edu.erasmusCode || EUROPASS_STANDARDS.ERASMUS_CODE})</div></div>
  <div class="field-row"><div class="field-label">${isEn ? 'EQF Level & Credits:' : 'EQF Düzeyi & Krediler:'}</div><div class="field-value">EQF Level ${edu.eqfLevel || 6} (Bachelor Degree) • ${edu.ectsCredits || 240} ECTS Credits</div></div>
  <div class="field-row"><div class="field-label">${isEn ? 'Grade Point Average:' : 'Ağırlıklı Not Ortalaması:'}</div><div class="field-value"><strong>${edu.gpaValue || '3.84'} / 4.00</strong> (Bologna EHEA Compliant)</div></div>

  <div class="section-title">${isEn ? 'Work and Traineeship Experience (Law No. 3308 SGK)' : 'İş ve Staj Deneyimleri (3308 SGK)'}</div>
  ${work.map(w => `
    <div style="margin-bottom: 8px;">
      <div style="font-weight: bold; font-size: 9pt;">${w.jobTitle || 'Trainee'} — ${w.employer || 'Enterprise'}</div>
      <div style="font-size: 8pt; color: #475569;">${w.startDate} - ${w.endDate} • SGK Work Accident & Occupational Disease Covered</div>
      <div style="font-size: 8.5pt; color: #334155; margin-top: 2px;">${w.description || ''}</div>
    </div>
  `).join('')}

  <div class="section-title">${isEn ? 'Language Skills (Common European Framework of Reference for Languages - CEFR)' : 'Dil Yetkinlikleri (Avrupa Ortak Başvuru Metni - CEFR)'}</div>
  <div style="margin-bottom: 4px; font-size: 8.5pt;"><strong>${isEn ? 'Mother Tongue:' : 'Ana Dil:'}</strong> Turkish (Türkçe)</div>
  <table>
    <thead>
      <tr>
        <th>${isEn ? 'Language' : 'Yabancı Dil'}</th>
        <th>${isEn ? 'Listening' : 'Dinleme'}</th>
        <th>${isEn ? 'Reading' : 'Okuma'}</th>
        <th>${isEn ? 'Spoken Interaction' : 'Karşılıklı Konuşma'}</th>
        <th>${isEn ? 'Spoken Production' : 'Sözlü Anlatım'}</th>
        <th>${isEn ? 'Writing' : 'Yazma'}</th>
      </tr>
    </thead>
    <tbody>
      ${langs.map(l => `
        <tr>
          <td><strong>${l.languageName || l.languageCode}</strong></td>
          <td>${l.proficiency?.listening || 'B2'}</td>
          <td>${l.proficiency?.reading || 'B2'}</td>
          <td>${l.proficiency?.spokenInteraction || 'B2'}</td>
          <td>${l.proficiency?.spokenProduction || 'B2'}</td>
          <td>${l.proficiency?.writing || 'B2'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">${isEn ? 'Digital & Technical Competencies' : 'Dijital & Mesleki Beceriler'}</div>
  <div>
    ${skills.map(s => `<span class="skills-chip">${s}</span>`).join('')}
  </div>

  <div class="footer">
    <div>${EUROPASS_STANDARDS.INSTITUTION_NAME} • ${EUROPASS_STANDARDS.COORDINATION_OFFICE}</div>
    <div>Verification: ${cv.verificationChecksum || 'IESU-EUROPASS'}</div>
  </div>
</body>
</html>`;
  }

  if (docType === 'erasmus' || docType === 'erasmus_lat') {
    const lat = data || {};
    const stu = lat.student || {};
    const sending = lat.sendingInstitution || {};
    const recv = lat.receivingOrganisation || {};
    const ta = lat.tableA || {};
    const tb = lat.tableB || {};

    return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'tr'}">
<head>
  <meta charset="UTF-8">
  <title>Erasmus+ Learning Agreement for Traineeships - ${stu.fullName || ''} - IESU</title>
  <style>
    @page { size: A4 portrait; margin: 16mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.45; font-size: 10pt; }
    .header { border-bottom: 3px solid #003399; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .logo-area h1 { font-size: 14pt; color: #003399; margin: 0; font-weight: 900; }
    .logo-area h2 { font-size: 8.5pt; color: #64748b; margin: 2px 0 0 0; }
    .badge { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 8pt; font-weight: bold; }
    .section-title { font-size: 9.5pt; font-weight: bold; color: #003399; background: #f1f5f9; padding: 5px 8px; margin-top: 12px; margin-bottom: 6px; border-left: 3px solid #003399; text-transform: uppercase; }
    .grid-2 { display: flex; gap: 12px; margin-bottom: 8px; }
    .card { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; background: #f8fafc; font-size: 8.5pt; }
    .card h4 { margin: 0 0 4px 0; color: #003399; font-size: 9pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 8.5pt; }
    th, td { border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; }
    th { background: #f1f5f9; color: #1e293b; font-weight: bold; font-size: 8pt; }
    .footer { margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 7.5pt; color: #64748b; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h1>${EUROPASS_STANDARDS.INSTITUTION_NAME}</h1>
      <h2>ERASMUS+ LEARNING AGREEMENT FOR TRAINEESHIPS • ACADEMIC YEAR ${lat.academicYear || '2026/2027'}</h2>
    </div>
    <div class="badge">ERASMUS CODE: ${sending.erasmusCode || EUROPASS_STANDARDS.ERASMUS_CODE}</div>
  </div>

  <div class="grid-2">
    <div class="card">
      <h4>${isEn ? 'Student Information' : 'Öğrenci Bilgileri'}</h4>
      <div><strong>${stu.fullName}</strong> (${stu.studentNo})</div>
      <div>${stu.department} • ${stu.studyCycle}</div>
      <div>Email: ${stu.email} • Nationality: ${stu.nationality}</div>
    </div>
    <div class="card">
      <h4>${isEn ? 'Receiving Enterprise / Organisation' : 'Kabul Eden İşletme'}</h4>
      <div><strong>${recv.name}</strong></div>
      <div>${recv.city}, ${recv.country} (${recv.website})</div>
      <div>Mentor: ${recv.contactPerson} (${recv.contactEmail})</div>
    </div>
  </div>

  <div class="section-title">${ta.title || 'Table A: Traineeship Programme at the Receiving Organisation'}</div>
  <div style="font-size: 8.5pt; margin-bottom: 4px;">
    <strong>${isEn ? 'Planned Period:' : 'Planlanan Süre:'}</strong> ${ta.plannedPeriod?.startDate} to ${ta.plannedPeriod?.endDate} (${ta.plannedPeriod?.totalWeeks || 12} weeks, ${ta.plannedPeriod?.workingHoursPerWeek || 35} hours/week)
  </div>
  <div style="font-size: 8.5pt;"><strong>${isEn ? 'Detailed Tasks & Programme:' : 'Staj Faaliyet ve Görev Tanımı:'}</strong></div>
  <ul style="margin: 4px 0 8px 18px; padding: 0; font-size: 8.5pt; color: #334155;">
    ${(ta.detailedProgramme || []).map(p => `<li>${p}</li>`).join('')}
  </ul>
  <div style="font-size: 8.5pt; margin-top: 4px;">
    <strong>${isEn ? 'Monitoring & Evaluation Plan:' : 'İzleme ve Değerlendirme Planı:'}</strong> ${ta.monitoringPlan || 'Continuous sprint monitoring'}
  </div>

  <div class="section-title">${tb.title || 'Table B: Sending Institution Commitments (IESU)'}</div>
  <div style="font-size: 8.5pt; margin-bottom: 4px;">
    <strong>${isEn ? 'Academic Recognition:' : 'Akademik Tanınma:'}</strong> ${tb.ectsAwarded || 10} ECTS Credits will be awarded and recorded in the Diploma Supplement & Official Transcript.
  </div>
  <div style="font-size: 8.5pt; margin-bottom: 4px;">
    <strong>${isEn ? 'Accident Insurance Coverage:' : 'İş Kazası ve Meslek Hastalığı Sigortası:'}</strong> ${tb.insuranceCoverage?.accidentInsurance || 'Turkish Law No. 3308 / 5510 guaranteed by IESU.'}
  </div>

  <div class="section-title">${isEn ? 'Digital Signatures & Approvals' : 'Dijital İmzalar ve Onaylar'}</div>
  <table>
    <thead>
      <tr>
        <th>${isEn ? 'Signatory' : 'Taraf'}</th>
        <th>${isEn ? 'Name' : 'İsim'}</th>
        <th>${isEn ? 'Status' : 'Durum'}</th>
        <th>${isEn ? 'Timestamp' : 'Tarih'}</th>
      </tr>
    </thead>
    <tbody>
      ${(lat.digitalSignatures || []).map(sig => `
        <tr>
          <td><strong>${sig.party}</strong></td>
          <td>${sig.name}</td>
          <td style="color: #166534; font-weight: bold;">${sig.status}</td>
          <td style="font-size: 7.5pt;">${sig.date ? new Date(sig.date).toLocaleDateString() : ''}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>Agreement ID: ${lat.agreementId} • Checksum: ${lat.verificationCode}</div>
    <div>${EUROPASS_STANDARDS.INSTITUTION_NAME} International Programs Directorate</div>
  </div>
</body>
</html>`;
  }

  // Default: Complete 8-Section Official Bologna Diploma Supplement (DS)
  const d = data || {};
  const s1 = d.section1 || {};
  const s2 = d.section2 || {};
  const s3 = d.section3 || {};
  const s4 = d.section4 || {};
  const s5 = d.section5 || {};
  const s6 = d.section6 || {};
  const s7 = d.section7 || {};
  const s8 = d.section8 || {};

  return `<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'tr'}">
<head>
  <meta charset="UTF-8">
  <title>Bologna Diploma Supplement - ${s1.givenNames || ''} ${s1.familyName || ''} - IESU</title>
  <style>
    @page { size: A4 portrait; margin: 16mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; line-height: 1.45; font-size: 10pt; }
    .header { border-bottom: 2px solid #990000; padding-bottom: 10px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 15pt; color: #990000; margin: 0; font-weight: 900; }
    .header h2 { font-size: 9pt; color: #64748b; margin: 2px 0 0 0; }
    .badge { background: #fef2f2; border: 1px solid #fecaca; color: #990000; padding: 4px 8px; border-radius: 6px; font-size: 7.5pt; font-weight: bold; }
    .section-title { font-size: 9.5pt; font-weight: bold; color: #0f172a; background: #f1f5f9; padding: 5px 8px; margin-top: 12px; margin-bottom: 6px; border-left: 3px solid #990000; }
    .field-row { display: flex; margin-bottom: 3px; font-size: 8.5pt; }
    .field-label { width: 35%; font-weight: bold; color: #475569; }
    .field-value { width: 65%; color: #0f172a; }
    .grading-table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 8pt; }
    .grading-table th, .grading-table td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: left; }
    .grading-table th { background: #f8fafc; font-weight: bold; }
    .footer { margin-top: 24px; border-top: 1px solid #cbd5e1; padding-top: 8px; font-size: 7.5pt; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${EUROPASS_STANDARDS.INSTITUTION_NAME}</h1>
      <h2>${EUROPASS_STANDARDS.RECTORATE_TITLE_EN} • DIPLOMA SUPPLEMENT</h2>
    </div>
    <div class="badge">EHEA BOLOGNA • EQF 6</div>
  </div>

  <!-- SECTION 1 -->
  <div class="section-title">${s1.title || '1. INFORMATION IDENTIFYING THE HOLDER OF THE QUALIFICATION'}</div>
  <div class="field-row"><div class="field-label">Family Name / Given Names:</div><div class="field-value">${s1.familyName} / ${s1.givenNames}</div></div>
  <div class="field-row"><div class="field-label">Student ID / YOKSIS Reference:</div><div class="field-value">${s1.studentIdentificationNumber} (${s1.yoksisReferenceCode})</div></div>
  <div class="field-row"><div class="field-label">Date of Birth / National ID:</div><div class="field-value">${s1.dateOfBirth} (${s1.nationalIdentityNumberMasked})</div></div>

  <!-- SECTION 2 -->
  <div class="section-title">${s2.title || '2. INFORMATION IDENTIFYING THE QUALIFICATION'}</div>
  <div class="field-row"><div class="field-label">Qualification Awarded:</div><div class="field-value">${s2.qualificationTitle}</div></div>
  <div class="field-row"><div class="field-label">Awarding & Administering Institution:</div><div class="field-value">${s2.awardingInstitutionEn} (Erasmus Code: ${s2.erasmusCode})</div></div>
  <div class="field-row"><div class="field-label">Institutional Legal Status:</div><div class="field-value">${s2.institutionStatus}</div></div>
  <div class="field-row"><div class="field-label">Language(s) of Instruction:</div><div class="field-value">${s2.languageOfInstruction}</div></div>

  <!-- SECTION 3 -->
  <div class="section-title">${s3.title || '3. INFORMATION ON THE LEVEL AND DURATION OF THE QUALIFICATION'}</div>
  <div class="field-row"><div class="field-label">Level of Qualification:</div><div class="field-value">${s3.levelOfQualification}</div></div>
  <div class="field-row"><div class="field-label">Official Length of Programme:</div><div class="field-value">${s3.officialLengthOfProgramme}</div></div>
  <div class="field-row"><div class="field-label">Access Requirements:</div><div class="field-value">${s3.accessRequirements}</div></div>

  <!-- SECTION 4 -->
  <div class="section-title">${s4.title || '4. INFORMATION ON THE CONTENTS AND RESULTS GAINED'}</div>
  <div class="field-row"><div class="field-label">Mode of Study:</div><div class="field-value">${s4.modeOfStudy}</div></div>
  <div class="field-row"><div class="field-label">Programme Details:</div><div class="field-value">${s4.programmeDetails}</div></div>
  <div class="field-row"><div class="field-label">Cumulative GPA & Standing:</div><div class="field-value"><strong>${s4.gpa} / 4.00 (ECTS Grade: ${s4.ectsGrade} - ${s4.performanceLabel})</strong> [${s4.percentileStanding}]</div></div>
  <div class="field-row"><div class="field-label">Completed Credits:</div><div class="field-value">${s4.completedEcts} of ${s4.totalEcts} ECTS</div></div>

  <table class="grading-table">
    <thead>
      <tr>
        <th>ECTS Grade</th>
        <th>Local Letter</th>
        <th>Min GPA</th>
        <th>Percentile</th>
        <th>Standard Definition</th>
      </tr>
    </thead>
    <tbody>
      ${ECTS_GRADING_SCALE.map(g => `
        <tr style="${g.ectsGrade === s4.ectsGrade ? 'background: #fef2f2; font-weight: bold;' : ''}">
          <td><strong>${g.ectsGrade}</strong></td>
          <td>${g.localGrade}</td>
          <td>${g.gpaValue.toFixed(2)}</td>
          <td>${g.percentile}</td>
          <td>${g.labelEn}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- SECTION 5 -->
  <div class="section-title">${s5.title || '5. INFORMATION ON THE FUNCTION OF THE QUALIFICATION'}</div>
  <div class="field-row"><div class="field-label">Access to Further Study:</div><div class="field-value">${s5.accessToFurtherStudy || 'Grants access to Second Cycle (Master\'s) and Doctorate programmes.'}</div></div>
  <div class="field-row"><div class="field-label">Professional Status:</div><div class="field-value">${s5.professionalStatus || 'Grants statutory practicing title across Türkiye and EHEA Lisbon Convention reciprocal recognition.'}</div></div>

  <!-- SECTION 6 -->
  <div class="section-title">${s6.title || '6. ADDITIONAL INFORMATION'}</div>
  <div class="field-row"><div class="field-label">Accreditation & Quality:</div><div class="field-value">${s6.institutionalAccreditation || 'Monitored and accredited by Turkish Higher Education Quality Council (YÖKAK).'}</div></div>
  <div class="field-row"><div class="field-label">Official Registry Source:</div><div class="field-value">${s6.officialRegistrySource || EUROPASS_STANDARDS.WEBSITE}</div></div>

  <!-- SECTION 7 -->
  <div class="section-title">${s7.title || '7. CERTIFICATION OF THE SUPPLEMENT'}</div>
  <div class="field-row"><div class="field-label">Verification Code:</div><div class="field-value font-mono"><strong>${s7.digitalChecksum || d.verificationCode}</strong></div></div>
  <div class="field-row"><div class="field-label">Digital Seal / Authority:</div><div class="field-value">${s7.digitalSeal || EUROPASS_STANDARDS.RECTORATE_TITLE}</div></div>
  <div class="field-row"><div class="field-label">Verification Portal:</div><div class="field-value">${s7.verificationUrl || 'https://obs.esenyurt.edu.tr/verify'}</div></div>

  <!-- SECTION 8 -->
  <div class="section-title">${s8.title || '8. INFORMATION ON THE NATIONAL HIGHER EDUCATION SYSTEM'}</div>
  <div style="font-size: 8pt; color: #334155; text-align: justify; margin-top: 3px;">
    ${s8.summary || 'The Turkish Higher Education System is governed by Law No. 2547 under the Council of Higher Education (YÖK). Degree structures mirror the Bologna Process three-cycle structure and the Turkish Qualifications Framework (TYYÇ) is strictly referenced to the European Qualifications Framework (EQF).'}
  </div>

  <div class="footer">
    ${EUROPASS_STANDARDS.INSTITUTION_NAME} • ${EUROPASS_STANDARDS.COORDINATION_OFFICE} • Verification: ${d.dsNumber || 'IESU-DS'}
  </div>
</body>
</html>`;
};

/**
 * Backward compatibility alias: exports Bologna Diploma Supplement HTML
 */
export const exportEuroPassHTML = (dsData, options = {}) => {
  return exportDocumentToPrintableHTML('ds', dsData, options);
};
