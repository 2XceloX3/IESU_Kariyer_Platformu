/**
 * virtualFairWorkflow.js
 * 
 * İstanbul Esenyurt Üniversitesi (İESÜ) Kariyer Geliştirme Koordinatörlüğü
 * Küresel İşverenler B2B Sanal Kariyer Fuarı & Canlı Mülakat Kuyruğu Motoru
 * (Global Virtual Fair Booth & Speed Interview Queue Engine)
 */

const STORAGE_KEY_QUEUES = 'iesu_virtual_fair_queues_v1';
const STORAGE_KEY_INTERVIEWS = 'iesu_virtual_fair_interviews_v1';

export const GLOBAL_FAIR_BOOTHS = [
  {
    id: 'aselsan',
    name: 'ASELSAN',
    sector: 'Savunma Sanayii & Mikroelektronik',
    location: 'Ankara / İstanbul',
    logo: null,
    boothRecruiter: {
      name: 'Dr. Emre Demir',
      title: 'Kıdemli Ar-Ge ve Yazılım Yetenek Lideri',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 4,
    currentServingTicket: 'ASEL-018',
    queueLength: 3,
    estimatedWaitPerPersonMinutes: 5,
    openPositions: [
      { id: 'asel-1', title: 'Gömülü Yazılım Mühendisi', type: 'Tam Zamanlı / Yeni Mezun' },
      { id: 'asel-2', title: 'Savunma Sistemleri Ar-Ge Stajyeri (SGK 3308)', type: 'Zorunlu Staj' }
    ],
    tags: ['C/C++', 'Gömülü Sistemler', 'Savunma Sanayii', 'Ar-Ge'],
    description: 'Türkiye\'nin teknoloji devi ASELSAN ile kritik milli projelerde yer almak isteyen İESÜ mühendislerini bekliyoruz.'
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz Tech Innovation',
    sector: 'Otomotiv & Otonom Sürüş',
    location: 'İstanbul / Stuttgart',
    logo: null,
    boothRecruiter: {
      name: 'Selin Yıldız',
      title: 'Global Tech Talent Acquisition Partner',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 3,
    currentServingTicket: 'MB-009',
    queueLength: 2,
    estimatedWaitPerPersonMinutes: 6,
    openPositions: [
      { id: 'mb-1', title: 'Connected Vehicle Cloud Developer', type: 'Hibrit / Global' },
      { id: 'mb-2', title: 'Data Analytics & AI Intern', type: 'Part-Time / Staj' }
    ],
    tags: ['Java', 'Cloud', 'Python', 'Connected Mobility'],
    description: 'Mercedes-Benz global yazılım merkezinde geleceğin otonom ve bağlantılı araç ekosistemini inşa ediyoruz.'
  },
  {
    id: 'baykar',
    name: 'BAYKAR Teknoloji',
    sector: 'Havacılık & İnsansız Hava Araçları',
    location: 'İstanbul Özdemir Bayraktar Kampüsü',
    logo: null,
    boothRecruiter: {
      name: 'Kadir Yalçın',
      title: 'Uçuş Yazılımları İK Koordinatörü',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 5,
    currentServingTicket: 'BYK-024',
    queueLength: 4,
    estimatedWaitPerPersonMinutes: 5,
    openPositions: [
      { id: 'byk-1', title: 'İHA Uçuş Kontrol Yazılım Mühendisi', type: 'Tam Zamanlı' },
      { id: 'byk-2', title: 'Yapay Zekâ ve Görüntü İşleme Stajyeri', type: 'Stajyer' }
    ],
    tags: ['Python', 'Computer Vision', 'Robotics', 'TEKNOFEST'],
    description: 'Milli Teknoloji Hamlesi\'nin öncüsü Baykar\'da insansız sistemler geliştirecek dinamik yetenekler arıyoruz.'
  },
  {
    id: 'siemens',
    name: 'Siemens Digital Industries',
    sector: 'Endüstri 4.0 & Otomasyon',
    location: 'İstanbul / Münih',
    logo: null,
    boothRecruiter: {
      name: 'Zeynep Kaya',
      title: 'Endüstriyel IoT Yetenek Danışmanı',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 3,
    currentServingTicket: 'SIE-012',
    queueLength: 1,
    estimatedWaitPerPersonMinutes: 5,
    openPositions: [
      { id: 'sie-1', title: 'Industrial Edge Software Engineer', type: 'Tam Zamanlı' },
      { id: 'sie-2', title: 'Smart Infrastructure Co-Op Engineer', type: 'Uzun Dönem Staj' }
    ],
    tags: ['IoT', 'Siemens PLC', 'Docker', 'Endüstri 4.0'],
    description: 'Dijital dönüşüm ve sürdürülebilir enerji altyapılarında küresel kariyer fırsatları.'
  },
  {
    id: 'getir',
    name: 'Getir',
    sector: 'Teknoloji & Hızlı Lojistik',
    location: 'İstanbul / Amsterdam',
    logo: null,
    boothRecruiter: {
      name: 'Ece Aydın',
      title: 'Global Tech Talent Lead',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 3,
    currentServingTicket: 'GET-005',
    queueLength: 2,
    estimatedWaitPerPersonMinutes: 5,
    openPositions: [
      { id: 'get-1', title: 'Backend Software Engineer (Node.js/Go)', type: 'Tam Zamanlı' },
      { id: 'get-2', title: 'Product Operations & Data Intern', type: 'Stajyer' }
    ],
    tags: ['Node.js', 'Go', 'Microservices', 'Logistics AI'],
    description: 'Dünyada bir ilki gerçekleştirerek dakikalar içinde teslimat modelini yarattık. Global ekibimize katılın.'
  },
  {
    id: 'ford',
    name: 'Ford Otosan',
    sector: 'Otomotiv & Otonom Araçlar',
    location: 'Kocaeli / İstanbul',
    logo: null,
    boothRecruiter: {
      name: 'Barış Koç',
      title: 'Ar-Ge ve Elektrikli Sistemler İK Danışmanı',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 4,
    currentServingTicket: 'FORD-014',
    queueLength: 3,
    estimatedWaitPerPersonMinutes: 5,
    openPositions: [
      { id: 'ford-1', title: 'Elektrikli Araç Batarya Sistemleri Mühendisi', type: 'Tam Zamanlı' },
      { id: 'ford-2', title: 'Otomotiv Ar-Ge Stajyeri (SGK 3308)', type: 'Zorunlu Staj' }
    ],
    tags: ['Elektrikli Araç', 'Gömülü Sistem', 'CAN Bus', 'Ar-Ge'],
    description: 'Geleceğin elektrikli ve bağlantılı ticari araçlarını geliştirmek için vizyoner yetenekler arıyoruz.'
  },
  {
    id: 'trendyol',
    name: 'Trendyol',
    sector: 'E-Ticaret & Bulut Mimarisi',
    location: 'İstanbul Maslak Kampüsü',
    logo: null,
    boothRecruiter: {
      name: 'Deniz Sönmez',
      title: 'Senior Tech Recruiter',
      role: 'recruiter',
      status: 'online'
    },
    activeRecruiters: 5,
    currentServingTicket: 'TRN-032',
    queueLength: 4,
    estimatedWaitPerPersonMinutes: 5,
    openPositions: [
      { id: 'trn-1', title: 'Junior Java / Kotlin Developer', type: 'Tam Zamanlı / Yeni Mezun' },
      { id: 'trn-2', title: 'Cloud Infrastructure & DevOps Intern', type: 'Stajyer' }
    ],
    tags: ['Java', 'Kotlin', 'Kafka', 'Kubernetes'],
    description: 'Türkiye\'nin ilk decacorn\'u olarak, teknolojiyi odağımıza alarak e-ticaret deneyimini yeniden tanımlıyoruz.'
  }
];

/**
 * Loads fair queues from localStorage
 */
export function getFairQueues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_QUEUES);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Returns fair booths list
 */
export function getFairBooths() {
  return GLOBAL_FAIR_BOOTHS;
}

export function getFairBoothById(id) {
  if (!id) return null;
  const strId = typeof id === 'object' ? (id.id || '') : String(id);
  const found = GLOBAL_FAIR_BOOTHS.find(b => b.id.toLowerCase() === strId.toLowerCase());
  if (found) return found;
  if (typeof id === 'object' && id.name) {
    return {
      ...id,
      id: strId || id.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      estimatedWaitPerPersonMinutes: id.estimatedWaitPerPersonMinutes || 5,
      boothRecruiter: id.boothRecruiter || { name: 'İK Yetkilisi', title: 'Yetkili', role: 'recruiter', status: 'online' }
    };
  }
  return null;
}

/**
 * Recalculates waiting positions and promotes the next student to 'ready'
 */
export function recalculateBoothQueue(queues, boothId) {
  if (!Array.isArray(queues) || !boothId) return queues;
  const booth = getFairBoothById(boothId);
  const waitPerPerson = booth?.estimatedWaitPerPersonMinutes || 5;

  const hasInInterview = queues.some(t => t.boothId === boothId && t.status === 'in_interview');

  let waitingIndex = 1;
  return queues.map(tkt => {
    if (tkt.boothId !== boothId) return tkt;
    if (tkt.status === 'in_interview' || tkt.status === 'completed') return tkt;

    const newPos = waitingIndex++;
    return {
      ...tkt,
      queuePosition: newPos,
      estimatedWaitMinutes: newPos * waitPerPerson,
      status: (newPos === 1 && !hasInInterview) ? 'ready' : 'waiting'
    };
  });
}

/**
 * Adds a student to a booth's live queue
 */
export function joinFairQueue(boothId, student) {
  if (!boothId || !student) {
    return { success: false, error: 'Stand ve öğrenci bilgileri eksik.' };
  }

  const booth = getFairBoothById(boothId);
  if (!booth) {
    return { success: false, error: 'Fuar standı bulunamadı.' };
  }

  const queues = getFairQueues();
  const studentId = student.id || student.uid || 'anon_student';

  // Check if student already has an active queue ticket
  const existingActive = queues.find(q =>
    (q.studentId === studentId) &&
    (q.status === 'waiting' || q.status === 'ready' || q.status === 'in_interview')
  );

  if (existingActive) {
    return {
      success: false,
      error: `Zaten aktif bir sıranız bulunmaktadır: "${existingActive.ticketNumber}" (${existingActive.boothName}). Lütfen önce mevcut görüşmenizi tamamlayın veya iptal edin.`,
      ticket: existingActive
    };
  }

  // Count active candidates ahead in this booth (ready, waiting, or in_interview)
  const activeAhead = queues.filter(q =>
    q.boothId === boothId &&
    (q.status === 'waiting' || q.status === 'ready' || q.status === 'in_interview')
  );
  const position = activeAhead.length + 1;
  const waitMinutes = position * booth.estimatedWaitPerPersonMinutes;

  const prefix = (booth.name.replace(/[^A-Za-z]/g, '').slice(0, 4) || 'FAIR').toUpperCase();
  const ticketNumber = `${prefix}-${String(100 + queues.length + 1).padStart(3, '0')}`;

  const newTicket = {
    ticketId: `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ticketNumber,
    boothId,
    boothName: booth.name,
    studentId,
    studentName: student.name || 'Öğrenci',
    studentDept: student.department || 'Mühendislik Fakültesi',
    studentEmail: student.email || '',
    queuePosition: position,
    estimatedWaitMinutes: waitMinutes,
    status: activeAhead.length === 0 ? 'ready' : 'waiting',
    recruiter: booth.boothRecruiter,
    joinedAt: new Date().toISOString()
  };

  queues.push(newTicket);
  try {
    localStorage.setItem(STORAGE_KEY_QUEUES, JSON.stringify(queues));
  } catch (e) {
    console.warn('[virtualFairWorkflow] Storage save failed:', e);
  }

  return {
    success: true,
    ticket: newTicket,
    booth
  };
}

/**
 * Removes or cancels a queue ticket and advances remaining queue
 */
export function leaveFairQueue(ticketId) {
  if (!ticketId) return false;
  try {
    const queues = getFairQueues();
    const target = queues.find(q => q.ticketId === ticketId);
    if (!target) return false;

    const remaining = queues.filter(q => q.ticketId !== ticketId);
    const updated = recalculateBoothQueue(remaining, target.boothId);
    localStorage.setItem(STORAGE_KEY_QUEUES, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets active ticket for student
 */
export function getStudentActiveTicket(studentId) {
  if (!studentId) return null;
  const queues = getFairQueues();
  return queues.find(q =>
    q.studentId === studentId &&
    (q.status === 'waiting' || q.status === 'ready' || q.status === 'in_interview')
  ) || null;
}

/**
 * Starts the live speed interview for a ticket
 */
export function startSpeedInterview(ticketId) {
  if (!ticketId) return { success: false, error: 'Bilet kimliği gerekli.' };
  const queues = getFairQueues();
  const ticketIndex = queues.findIndex(q => q.ticketId === ticketId);

  if (ticketIndex === -1) {
    return { success: false, error: 'Sıra bileti bulunamadı.' };
  }

  queues[ticketIndex].status = 'in_interview';
  queues[ticketIndex].interviewStartedAt = new Date().toISOString();

  const updatedQueues = recalculateBoothQueue(queues, queues[ticketIndex].boothId);

  try {
    localStorage.setItem(STORAGE_KEY_QUEUES, JSON.stringify(updatedQueues));
  } catch {}

  return {
    success: true,
    ticket: updatedQueues.find(q => q.ticketId === ticketId) || queues[ticketIndex]
  };
}

/**
 * Completes speed interview and saves recruiter evaluation scorecard
 */
export function completeSpeedInterview(ticketId, evaluation = {}) {
  if (!ticketId) return { success: false, error: 'Bilet kimliği gerekli.' };
  const queues = getFairQueues();
  const ticket = queues.find(q => q.ticketId === ticketId);

  if (!ticket) {
    return { success: false, error: 'Sıra bileti bulunamadı.' };
  }

  ticket.status = 'completed';
  ticket.interviewCompletedAt = new Date().toISOString();

  const record = {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ticketId,
    ticketNumber: ticket.ticketNumber,
    boothName: ticket.boothName,
    studentId: ticket.studentId,
    studentName: ticket.studentName,
    recruiterName: ticket.recruiter?.name || 'İK Yetkilisi',
    technicalRating: evaluation.technicalRating || 4,
    culturalFitRating: evaluation.culturalFitRating || 5,
    communicationRating: evaluation.communicationRating || 4,
    verdict: evaluation.verdict || 'next_round', // 'next_round' | 'internship_pool' | 'feedback_given'
    recruiterNotes: evaluation.recruiterNotes || 'Mülakat başarıyla tamamlandı. Öğrencinin teknik ve iletişim becerileri olumlu değerlendirildi.',
    completedAt: new Date().toISOString()
  };

  // Save to completed interviews
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERVIEWS);
    const history = raw ? JSON.parse(raw) : [];
    localStorage.setItem(STORAGE_KEY_INTERVIEWS, JSON.stringify([record, ...history]));

    // Update queue list and advance next candidates in this booth
    const remaining = queues.filter(q => q.ticketId !== ticketId);
    const updatedQueues = recalculateBoothQueue(remaining, ticket.boothId);
    localStorage.setItem(STORAGE_KEY_QUEUES, JSON.stringify(updatedQueues));
  } catch (e) {
    console.warn('[virtualFairWorkflow] Evaluation write failed:', e);
  }

  return {
    success: true,
    evaluation: record
  };
}

/**
 * Returns interview evaluation history for student
 */
export function getStudentInterviewHistory(studentId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERVIEWS);
    const history = raw ? JSON.parse(raw) : [];
    if (!studentId) return Array.isArray(history) ? history : [];
    return (Array.isArray(history) ? history : []).filter(h => h.studentId === studentId);
  } catch {
    return [];
  }
}

/**
 * Helper to reset test data
 */
export function resetVirtualFairData() {
  try {
    localStorage.removeItem(STORAGE_KEY_QUEUES);
    localStorage.removeItem(STORAGE_KEY_INTERVIEWS);
    return true;
  } catch {
    return false;
  }
}
