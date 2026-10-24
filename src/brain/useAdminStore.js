/**
 * src/brain/useAdminStore.js
 * Admin Brain Store: Single source of truth for platform management, CMS,
 * user registries, feature toggles, audit logs, and hive error telemetry.
 * Part of Requirement R1 & R7 (Beehive Architecture).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DOMPurify from 'dompurify';
import eventBus from './eventBus';
import {
  generateStudents,
  generateAlumni,
  generateCompanies,
  generateAcademicStaff,
  initialSurveys,
  initialGroups,
  initialMentorships,
  initialAcademicCatalog,
  initialAcademicApprovals
} from '../utils/mockData';
import {
  initialClubs,
  initialClubApplications,
  initialCareerTestSubmissions
} from '../data/mockClubsData';
import {
  SAMPLE_CORPORATE_PROTOCOLS,
  SAMPLE_SECTOR_MENTORS,
  SAMPLE_ESBIM_EVENTS,
  SAMPLE_ISKUR_JOB_CLUB_COHORTS,
  PROTOCOL_STATUS
} from '../services/protocolWorkflow';

// Initial data pools
const initialApplications = []; // F-ATS-010: no fake seed without companyId

const initialStaffList = [
  {
    id: 'STAFF-1',
    name: 'Zuhal ŞAHİN',
    title: 'Kariyer Geliştirme Ofis Sorumlusu',
    phone: '444 9 123 (Dahili: 1102)',
    email: 'zsahin@esenyurt.edu.tr',
    photo: 'https://www.esenyurt.edu.tr/uploads/staffs/405.jpg',
    yokLink: 'https://www.esenyurt.edu.tr/kadro/kariyer-gelistirme-ofisi-kadro-1'
  },
  {
    id: 'STAFF-2',
    name: 'Mutlu Gülsev YAĞIZ',
    title: 'Kariyer Geliştirme Ofisi Sorumlusu',
    phone: '444 9 123 (Dahili: 1102)',
    email: 'myagiz@esenyurt.edu.tr',
    photo: 'https://www.esenyurt.edu.tr/uploads/staffs/278.jpg',
    yokLink: 'http://akademik.yok.gov.tr/AkademikArama/AkademisyenGorevOgrenimBilgileri?islem=direct&authorId=CAC066B35D650BC1'
  }
];

const initialCareerFairStands = [
  { id: 'A-01', code: 'Stant A-01', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-001', assignedCompanyName: 'Baykar Teknoloji', tableNumber: 'Stant A-01' },
  { id: 'A-02', code: 'Stant A-02', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-002', assignedCompanyName: 'Aselsan', tableNumber: 'Stant A-02' },
  { id: 'A-03', code: 'Stant A-03', zone: 'A', status: 'Rezerve', assignedCompanyId: null, assignedCompanyName: 'Protokol Rezervasyonu', tableNumber: 'Stant A-03' },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `A-${String(i + 4).padStart(2, '0')}`,
    code: `Stant A-${String(i + 4).padStart(2, '0')}`,
    zone: 'A',
    status: 'Boş',
    assignedCompanyId: null,
    assignedCompanyName: null,
    tableNumber: `Stant A-${String(i + 4).padStart(2, '0')}`
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `B-${String(i + 1).padStart(2, '0')}`,
    code: `Stant B-${String(i + 1).padStart(2, '0')}`,
    zone: 'B',
    status: 'Boş',
    assignedCompanyId: null,
    assignedCompanyName: null,
    tableNumber: `Stant B-${String(i + 1).padStart(2, '0')}`
  }))
];

/**
 * Returns fresh clone of initial admin state to prevent cross-test and cross-session contamination.
 */
export const getInitialAdminState = () => ({
  // User Directories
  students: generateStudents(),
  alumni: generateAlumni(),
  companies: generateCompanies(),
  academicStaff: generateAcademicStaff(),

  // Surveys
  surveys: Array.isArray(initialSurveys) ? [...initialSurveys] : [],

  // Site Configuration & Branding
  siteConfig: {
    heroBannerTitle: 'Kariyerini Şekillendir',
    heroBannerSub: 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.',
    ctaButtonText: 'Hemen Başla',
    maintenanceMode: false,
    announcementBanner: { visible: false, text: '', color: 'red' },
    primaryColor: '#990000',
    logoSubText: 'Kariyer Geliştirme Koordinatörlüğü',
    footerMotto: 'Geleceğe açılan kapı.'
  },

  // Audit Logging with DOMPurify sanitization & circular reference defense
  auditLogs: [
    {
      id: 'log_initial',
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      user: 'Sistem Ajanı',
      action: 'Hibrit İdari Portal başarıyla başlatıldı ve yüklendi.',
      module: 'Sistem',
      ip: '192.168.1.101'
    }
  ],

  // Feature Toggles (object and flat properties for 100% test compatibility)
  featureToggles: {
    featureSurveys: true,
    featureCareerCheckup: true,
    featureAlumniCard: false,
    featureAlumniAssocToggle: true,
    featureClubsShowcase: true,
    featureClubApplications: true,
    featureCareerFair: false,
    featureSEMAcademy: false,
    featureSSPLeaderboard: false
  },
  featureSurveys: true,
  featureCareerCheckup: true,
  featureAlumniCard: false,
  featureAlumniAssocToggle: true,
  featureClubsShowcase: true,
  featureClubApplications: true,
  featureCareerFair: false,
  featureSEMAcademy: false,
  featureSSPLeaderboard: false,

  // Hive Error Telemetry (Requirement R7: { student: 0, alumni: 0, company: 0, academic: 0, admin: 0 })
  hiveErrors: {
    student: 0,
    alumni: 0,
    company: 0,
    academic: 0,
    admin: 0
  },

  // Administrative Pools
  adminActiveTab: 'feed',
  adminMessages: [
    {
      id: 'ADM-MSG-1',
      companyName: 'Aselsan A.Ş.',
      email: 'kurumsal@aselsan.com.tr',
      phone: '0216 555 0000',
      subject: '2026 Mühendislik Staj Kontenjanı Protokolü',
      message: 'Üniversiteniz bilgisayar ve elektrik-elektronik mühendisliği öğrencileri için 15 adet staj kontenjanı tanımlamak istiyoruz.',
      date: '30.07.2026 10:30',
      status: 'Beklemede'
    }
  ],
  applications: Array.isArray(initialApplications) ? [...initialApplications] : [],
  staffList: Array.isArray(initialStaffList) ? [...initialStaffList] : [],

  // Career Fair (Stitch) Management
  careerFairEvent: {
    id: 'cfe-2026',
    title: 'İESÜ 2026 Bahar Kariyer Zirvesi & Fuarı',
    date: '15-18 Mayıs 2026',
    location: 'Merkez Kampüs Rektörlük Bahçesi & Fuaye Alanı',
    description: 'Esenyurt Üniversitesi öğrencilerini ve mezunlarını sektör lideri şirketlerle buluşturan resmî kariyer etkinliği.',
    banner: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg',
    isActive: true,
    quota: 50
  },
  careerFairFormTemplate: [
    { id: 'q_1', label: 'Katılımcı Sayısı & Yetkili İsimleri', type: 'text', required: true, description: 'Stant başında duracak personel sayısı ve ad-soyad bilgileri', order: 1 },
    { id: 'q_2', label: 'Elektrik & İnternet İhtiyacı', type: 'select', required: true, options: ['Yalnızca Standart Priz (220V)', 'Yüksek Güç + Kablolu İnternet', 'İhtiyaç Yok'], order: 2 },
    { id: 'q_3', label: 'Özel Ekipman / Roll-up Detayları', type: 'textarea', required: false, description: 'Getirilecek görseller ve stand alan gereksinimleri', order: 3 },
    { id: 'q_4', label: 'Eşantiyon & Promosyon Dağıtımı', type: 'checkbox', required: false, description: 'Stantta promosyon ürün dağıtılacak mı?', order: 4 },
    { id: 'q_5', label: 'Firma Logosu (Vektörel/PNG)', type: 'file', required: true, description: 'Fuar kataloğu ve afişler için yüksek çözünürlüklü logo', order: 5 }
  ],
  careerFairApplications: [
    { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', appliedAt: '2026-07-20', status: 'Onaylandı', tableNumber: 'Stant A-01', answers: {} },
    { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: 'Stant A-02', answers: {} }
  ],
  careerFairStands: Array.isArray(initialCareerFairStands) ? [...initialCareerFairStands] : [],

  // Research Labs & Calls
  researchLabs: [
    { id: 'LAB-01', name: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab', location: 'J Blok 4. Kat / Lab 402', equipment: '8x NVIDIA H100 Tensor Core GPU Sunucu', capacity: '25 Araştırmacı', status: 'Aktif / Rezervasyona Açık' },
    { id: 'LAB-02', name: 'Otonom Sistemler & İHA Geliştirme Lab', location: 'Kuluçka Merkezi A Blok', equipment: 'Rüzgar Tüneli & 3D Metal Yazıcılar', capacity: '15 Araştırmacı', status: 'Aktif / Rezervasyona Açık' },
    { id: 'LAB-03', name: 'Biyomedikal Cihaz & Doku Mühendisliği Lab', location: 'C Blok Zemin Kat / Lab 104', equipment: 'Hücre Kültür İnkübatörleri & Mikroskoplar', capacity: '20 Araştırmacı', status: 'Bakımda (Yarın Açık)' }
  ],
  researchCalls: [
    { id: 'CALL-101', title: 'TÜBİTAK 2209-A: Otonom İHA Kontrol Algoritmaları Bursiyer Çağrısı', lead: 'Dr. Öğr. Üyesi Mehmet Can', positions: '2 Lisans / 1 Yüksek Lisans Öğrencisi', deadline: '15 Mart 2026', budget: '75.000 ₺ Destekli', status: 'Aktif' },
    { id: 'CALL-102', title: 'BAP Projesi: Sağlıkta LLM Destekli Tanı Asistanı Araştırmacı Alımı', lead: 'Prof. Dr. Bahri Şahin', positions: '3 Yazılım Araştırmacısı', deadline: '01 Nisan 2026', budget: '120.000 ₺ Destekli', status: 'Aktif' }
  ],
  researchConfig: {
    timeSlots: [
      "09:00 - 11:00 (Sabah Seansı)",
      "11:30 - 13:30 (Öğle Seansı)",
      "14:00 - 16:00 (Öğleden Sonra Seansı)",
      "16:30 - 18:30 (Akşam Seansı)"
    ],
    labCustomQuestions: [
      { id: 'q_safety', label: 'Laboratuvar İş Sağlığı & Güvenliği (İSG) Eğitimi Tamamlandı mı?', type: 'select', options: ['Evet (Sertifikalı)', 'Muaf (Öğretim Üyesi)', 'Henüz Tamamlanmadı'], required: true },
      { id: 'q_ethics', label: 'Etik Kurul Onayı Gerektiriyor mu?', type: 'select', options: ['Gerektirmiyor', 'Alındı (Karar No Mevcut)', 'Başvuru Aşamasında'], required: false }
    ],
    callCustomQuestions: [
      { id: 'cq_availability', label: 'Hafta Sonu / Saha Çalışmasına Katılım Durumu', type: 'select', options: ['Tamamen Uygun', 'Sadece Cumartesi', 'Yalnızca Hafta İçi'], required: false },
      { id: 'cq_scholarship', label: 'Daha Önce TÜBİTAK/BAP Bursiyeri Oldunuz mu?', type: 'select', options: ['Hayır (İlk Kez)', 'Evet (TÜBİTAK 2209)', 'Evet (BAP)', 'Evet (Diğer)'], required: false }
    ]
  },
  labReservations: [],
  researchCallApplications: [],

  // Specialized Data Pools
  checkupRecords: [],
  employmentDeclarations: [],
  pukoScorecards: [],
  surveyResponses: [],
  newsletterSubscribers: [],
  bmiRecords: [],
  helpdeskTickets: [],
  corporateProtocols: Array.isArray(SAMPLE_CORPORATE_PROTOCOLS) ? [...SAMPLE_CORPORATE_PROTOCOLS] : [],
  sectorMentors: Array.isArray(SAMPLE_SECTOR_MENTORS) ? [...SAMPLE_SECTOR_MENTORS] : [],
  esbimEvents: Array.isArray(SAMPLE_ESBIM_EVENTS) ? [...SAMPLE_ESBIM_EVENTS] : [],
  iskurJobClubCohorts: Array.isArray(SAMPLE_ISKUR_JOB_CLUB_COHORTS) ? [...SAMPLE_ISKUR_JOB_CLUB_COHORTS] : [],
  clubApplications: Array.isArray(initialClubApplications) ? [...initialClubApplications] : [],
  careerTestSubmissions: Array.isArray(initialCareerTestSubmissions) ? [...initialCareerTestSubmissions] : [],
  alumniCardApplications: [],
  alumniCardForms: [],
  alumniAssocBoard: [],
  alumniAssocApplications: [],
  kgbEnabled: true,
  kgbStudentRecords: [],
  kgbAlumniRecords: [],
  sspEnabled: true,
  sspUsers: [],
  institutionalStatsData: [
    { id: 1, title: 'Topluma Kazandırılan Mezun', val: '65.000+', icon: 'GraduationCap' },
    { id: 2, title: 'Uluslararası Akredite Program', val: '65+', icon: 'ShieldCheck' },
    { id: 3, title: 'Ar-Ge & Uygulama Laboratuvarı', val: '110+', icon: 'FlaskConical' },
    { id: 4, title: 'Farklı Ülkeden Uluslararası Öğrenci', val: '130+', icon: 'Users' }
  ],
  showInstitutionalStats: false,
  groups: Array.isArray(initialGroups) ? [...initialGroups] : [],
  mentorships: Array.isArray(initialMentorships) ? [...initialMentorships] : [],
  clubs: Array.isArray(initialClubs) ? [...initialClubs] : [],
  academicCatalog: Array.isArray(initialAcademicCatalog) ? [...initialAcademicCatalog] : [],
  academicApprovals: Array.isArray(initialAcademicApprovals) ? [...initialAcademicApprovals] : [],
  eventRegistrations: [],
  coffeeChats: [
    {
      id: 'CHAT-MOCK-1',
      studentId: 'STU-001',
      studentName: 'Alperen Yılmaz',
      studentDept: 'Yazılım Mühendisliği',
      alumnusId: 'ALU-001',
      alumnusName: 'Caner Öztürk',
      alumnusCompany: 'Trendyol',
      alumnusTitle: 'Frontend Developer',
      topicId: 'cv_review',
      topicTitle: 'CV & Portfolyo İnceleme (15 Dk)',
      date: '2026-10-26',
      timeSlot: '18:00 - 18:15',
      note: 'Frontend portfolyom ve React projelerimi incelemenizi rica ederim.',
      status: 'CONFIRMED',
      meetingLink: 'https://meet.google.com/iesu-coffee-trendyol',
      createdAt: '2026-10-22 14:00'
    },
    {
      id: 'CHAT-MOCK-2',
      studentId: 'STU-002',
      studentName: 'Zeynep Kaya',
      studentDept: 'Endüstri Mühendisliği',
      alumnusId: 'ALU-002',
      alumnusName: 'Seda Çelik',
      alumnusCompany: 'Delivery Hero',
      alumnusTitle: 'Üretim ve Operasyon Yöneticisi',
      topicId: 'abroad_master',
      topicTitle: 'Yurt Dışı / Yüksek Lisans Deneyimi',
      date: '2026-10-27',
      timeSlot: '19:00 - 19:15',
      note: 'Almanya yüksek lisans başvuru süreci hakkında görüşmek isterim.',
      status: 'PENDING',
      meetingLink: null,
      createdAt: '2026-10-23 09:30'
    }
  ],
  swarmMetrics: { activeAgents: 25, dataNodesProcessed: 84392, evolutionCycle: 1 },

  // Communication Pools
  messages: [],
  notifications: [],
  unreadNotificationsCount: 0
});

export const useAdminStore = create(
  persist(
    (set, get) => {
      const setter = (key) => (val) =>
        set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));

      return {
        ...getInitialAdminState(),

        // User Directories Setters
        setStudents: setter('students'),
        setAlumni: setter('alumni'),
        setCompanies: setter('companies'),
        setAcademicStaff: setter('academicStaff'),

        // Surveys Setter
        setSurveys: setter('surveys'),

        // Site Configuration & Branding
        setSiteConfig: (config) =>
          set((state) => {
            const raw = typeof config === 'function' ? config(state.siteConfig) : config;
            if (!raw || typeof raw !== 'object') return state;
            // Guard against prototype pollution
            const clean = {};
            for (const [k, v] of Object.entries(raw)) {
              if (k !== '__proto__' && k !== 'constructor' && k !== 'prototype') {
                clean[k] = v;
              }
            }
            return { siteConfig: { ...state.siteConfig, ...clean } };
          }),

        // Audit Logging with DOMPurify sanitization & circular reference defense
        logAction: (user, action, module = 'Genel', severity = 'info', metadata = null) =>
          set((state) => {
            const now = new Date();
            const cleanUser = typeof user === 'string' ? DOMPurify.sanitize(user.slice(0, 100)) : String(user || 'Misafir');
            const cleanAction = typeof action === 'string' ? DOMPurify.sanitize(action.slice(0, 500)) : String(action || '');
            const cleanModule = typeof module === 'string' ? DOMPurify.sanitize(module.slice(0, 50)) : 'Genel';

            // Safe metadata handling (circular ref proof)
            let safeMeta = null;
            if (metadata && typeof metadata === 'object') {
              try {
                JSON.stringify(metadata);
                safeMeta = { ...metadata };
              } catch (_) {
                safeMeta = { info: '[Complex/Circular Object]' };
              }
            }

            const newEntry = {
              id: 'log_' + now.getTime() + '_' + Math.random().toString(36).substr(2, 6),
              timestamp: now.toLocaleTimeString('tr-TR'),
              isoTimestamp: now.toISOString(),
              user: cleanUser,
              action: cleanAction,
              module: cleanModule,
              severity: severity === 'warning' || severity === 'critical' ? severity : 'info',
              ip: typeof window !== 'undefined' ? window.location?.hostname || 'localhost' : 'server',
              metadata: safeMeta
            };

            const logs = state.auditLogs || [];
            eventBus.emit('audit:logged', newEntry);
            return { auditLogs: [newEntry, ...logs.slice(0, 199)] };
          }),
        logAuditAction: (user, action, module, severity, metadata) =>
          get().logAction(user, action, module, severity, metadata),

        // Feature Toggles Setters
        setFeatureSurveys: setter('featureSurveys'),
        setFeatureCareerCheckup: setter('featureCareerCheckup'),
        setFeatureAlumniCard: setter('featureAlumniCard'),
        setFeatureAlumniAssocToggle: setter('featureAlumniAssocToggle'),
        setFeatureClubsShowcase: setter('featureClubsShowcase'),
        setFeatureClubApplications: setter('featureClubApplications'),
        setFeatureCareerFair: setter('featureCareerFair'),
        setFeatureSEMAcademy: setter('featureSEMAcademy'),
        setFeatureSSPLeaderboard: setter('featureSSPLeaderboard'),

        setFeatureToggle: (key, val) =>
          set((state) => {
            const updatedToggles = { ...state.featureToggles, [key]: Boolean(val) };
            eventBus.emit('feature:toggled', { feature: key, enabled: Boolean(val), timestamp: new Date().toISOString() });
            return {
              featureToggles: updatedToggles,
              [key]: Boolean(val)
            };
          }),

        // Hive Error Telemetry
        reportHiveError: (hive, error) =>
          set((state) => {
            const validHives = ['student', 'alumni', 'company', 'academic', 'admin'];
            const targetHive = validHives.includes(hive) ? hive : 'admin';
            const updatedErrors = {
              ...state.hiveErrors,
              [targetHive]: (state.hiveErrors?.[targetHive] || 0) + 1
            };
            eventBus.emit('hive:error', {
              hive: targetHive,
              error: error?.message || String(error),
              timestamp: new Date().toISOString(),
              _fromAdminStore: true
            });
            return { hiveErrors: updatedErrors };
          }),
        recordHiveError: (hive, error) => get().reportHiveError(hive, error),

        // Administrative Pools Setters
        setAdminActiveTab: setter('adminActiveTab'),
        setAdminMessages: setter('adminMessages'),
        setApplications: setter('applications'),
        addApplication: (app) =>
          set((state) => {
            eventBus.emit('application:status', {
              applicationId: app.id,
              jobId: app.jobId,
              applicantId: app.applicantId,
              status: app.status || 'Beklemede',
              timestamp: new Date().toISOString()
            });
            return { applications: [app, ...(state.applications || [])] };
          }),

        setStaffList: setter('staffList'),
        addStaffMember: (member) => set((s) => ({ staffList: [member, ...(s.staffList || [])] })),
        updateStaffMember: (updated) => set((s) => ({ staffList: (s.staffList || []).map((m) => (m.id === updated.id ? updated : m)) })),
        deleteStaffMember: (id) => set((s) => ({ staffList: (s.staffList || []).filter((m) => m.id !== id) })),

        // Career Fair Management Setters
        setCareerFairEvent: setter('careerFairEvent'),
        setCareerFairFormTemplate: setter('careerFairFormTemplate'),
        addFormField: (field) => set((s) => ({ careerFairFormTemplate: [...(s.careerFairFormTemplate || []), field] })),
        removeFormField: (id) => set((s) => ({ careerFairFormTemplate: (s.careerFairFormTemplate || []).filter((f) => f.id !== id) })),
        updateFormField: (id, updated) => set((s) => ({ careerFairFormTemplate: (s.careerFairFormTemplate || []).map((f) => (f.id === id ? { ...f, ...updated } : f)) })),
        reorderFormFields: (startIndex, endIndex) =>
          set((s) => {
            const list = Array.from(s.careerFairFormTemplate || []);
            const [removed] = list.splice(startIndex, 1);
            list.splice(endIndex, 0, removed);
            return { careerFairFormTemplate: list };
          }),

        setCareerFairApplications: setter('careerFairApplications'),
        setCareerFairStands: setter('careerFairStands'),
        assignStandToCompany: (standId, companyName, companyId = null, newStatus = 'Atandı') =>
          set((state) => {
            const targetStand = (state.careerFairStands || []).find((s) => s.id === standId || s.code === standId);
            const standCode = targetStand ? targetStand.code : standId;
            const targetId = targetStand ? targetStand.id : standId;

            const updatedStands = (state.careerFairStands || []).map((s) => {
              if (s.id === targetId || s.code === standCode) {
                return {
                  ...s,
                  status: newStatus,
                  assignedCompanyId: companyId,
                  assignedCompanyName: newStatus === 'Boş' ? null : companyName
                };
              }
              if (
                companyName &&
                newStatus !== 'Boş' &&
                ((s.assignedCompanyName && s.assignedCompanyName.trim().toLowerCase() === companyName.trim().toLowerCase()) || (companyId && s.assignedCompanyId === companyId)) &&
                s.id !== targetId &&
                s.code !== standCode
              ) {
                return {
                  ...s,
                  status: 'Boş',
                  assignedCompanyId: null,
                  assignedCompanyName: null
                };
              }
              return s;
            });

            const updatedApps = (state.careerFairApplications || []).map((app) => {
              if (companyName && app.companyName === companyName) {
                return { ...app, tableNumber: newStatus === 'Boş' ? null : standCode };
              }
              if (app.tableNumber === standCode && (newStatus === 'Boş' || app.companyName !== companyName)) {
                return { ...app, tableNumber: null };
              }
              return app;
            });

            const now = new Date();
            const auditLog = {
              id: 'log_' + Math.random().toString(36).substr(2, 9),
              timestamp: now.toLocaleTimeString('tr-TR'),
              user: 'Kariyer Ofisi Yöneticisi',
              action: `Kariyer Günleri: ${standCode} -> ${newStatus === 'Boş' ? 'Stant Boşaltıldı' : companyName + ' (' + newStatus + ')'}`,
              module: 'Kariyer Günleri',
              ip: '192.168.1.101'
            };

            const newNotif = {
              id: 'notif_' + Math.random().toString(36).substr(2, 9),
              title: 'Stant Ataması Güncellendi',
              message: `${standCode} için stant durumu güncellendi: ${newStatus === 'Boş' ? 'Stant Boşaltıldı' : (companyName || '') + ' (' + newStatus + ')'}`,
              date: now.toLocaleDateString('tr-TR'),
              read: false
            };

            return {
              careerFairStands: updatedStands,
              careerFairApplications: updatedApps,
              auditLogs: [auditLog, ...(state.auditLogs || [])].slice(0, 100),
              notifications: [newNotif, ...(state.notifications || [])].slice(0, 50),
              unreadNotificationsCount: (state.unreadNotificationsCount || 0) + 1
            };
          }),

        // Research Labs & Calls Setters
        setResearchLabs: setter('researchLabs'),
        addResearchLab: (lab) => set((s) => ({ researchLabs: [lab, ...(s.researchLabs || [])] })),
        updateResearchLab: (updated) => set((s) => ({ researchLabs: (s.researchLabs || []).map((l) => (l.id === updated.id ? updated : l)) })),
        deleteResearchLab: (id) => set((s) => ({ researchLabs: (s.researchLabs || []).filter((l) => l.id !== id) })),

        setResearchCalls: setter('researchCalls'),
        addResearchCall: (call) => set((s) => ({ researchCalls: [call, ...(s.researchCalls || [])] })),
        updateResearchCall: (updated) => set((s) => ({ researchCalls: (s.researchCalls || []).map((c) => (c.id === updated.id ? updated : c)) })),
        deleteResearchCall: (id) => set((s) => ({ researchCalls: (s.researchCalls || []).filter((c) => c.id !== id) })),

        setResearchConfig: setter('researchConfig'),
        updateResearchConfig: (partial) => set((s) => ({ researchConfig: { ...(s.researchConfig || {}), ...partial } })),

        setLabReservations: setter('labReservations'),
        addLabReservation: (res) => set((s) => ({ labReservations: [res, ...(s.labReservations || [])] })),
        updateLabReservationStatus: (id, status, adminNote = null) =>
          set((s) => ({
            labReservations: (s.labReservations || []).map((r) =>
              r.id === id ? { ...r, status, ...(adminNote !== null ? { adminNote } : {}), updatedAt: new Date().toISOString() } : r
            )
          })),

        setResearchCallApplications: setter('researchCallApplications'),
        addResearchCallApplication: (app) => set((s) => ({ researchCallApplications: [app, ...(s.researchCallApplications || [])] })),
        updateResearchCallApplicationStatus: (id, status, adminNote = null) =>
          set((s) => ({
            researchCallApplications: (s.researchCallApplications || []).map((a) =>
              a.id === id ? { ...a, status, ...(adminNote !== null ? { adminNote } : {}), updatedAt: new Date().toISOString() } : a
            )
          })),

        // Specialized Data Pools Setters
        setCheckupRecords: setter('checkupRecords'),
        addCheckupRecord: (rec) => set((s) => ({ checkupRecords: [rec, ...(s.checkupRecords || [])] })),

        setEmploymentDeclarations: setter('employmentDeclarations'),
        addEmploymentDeclaration: (decl) => set((s) => ({ employmentDeclarations: [decl, ...(s.employmentDeclarations || [])] })),

        setPukoScorecards: setter('pukoScorecards'),
        updatePukoScorecard: (card) => set((s) => {
          const list = s.pukoScorecards || [];
          const exists = list.some(sc => sc.department === card.department);
          const updateItem = (item) => {
            const merged = { ...item, ...card };
            if (card.alumniScore != null || card.employerScore != null) {
              const aScore = Number(merged.alumniScore || 4.0);
              const eScore = Number(merged.employerScore || 4.0);
              const empRate = Number(merged.employmentRate || 80);
              const inRate = Number(merged.inFieldRate || 80);
              merged.pukoIndex = Math.min(100, Math.round(
                ((aScore / 5 * 30) + (eScore / 5 * 30) + (empRate * 0.25) + (inRate * 0.15)) * 10
              ) / 10);
            }
            return merged;
          };
          return {
            pukoScorecards: exists ? list.map(sc => sc.department === card.department ? updateItem(sc) : sc) : [updateItem(card), ...list]
          };
        }),

        setSurveyResponses: setter('surveyResponses'),
        addSurveyResponse: (resp) => set((s) => ({ surveyResponses: [resp, ...(s.surveyResponses || [])] })),

        setNewsletterSubscribers: setter('newsletterSubscribers'),
        addNewsletterSubscriber: (sub) => set((s) => ({ newsletterSubscribers: [sub, ...(s.newsletterSubscribers || [])] })),

        setBmiRecords: setter('bmiRecords'),
        addBmiRecord: (rec) => set((s) => ({ bmiRecords: [rec, ...(s.bmiRecords || [])] })),

        setHelpdeskTickets: setter('helpdeskTickets'),
        addHelpdeskTicket: (tkt) => set((s) => ({ helpdeskTickets: [tkt, ...(s.helpdeskTickets || [])] })),

        // Corporate Protocols & Industry CRM Actions
        setCorporateProtocols: setter('corporateProtocols'),
        addCorporateProtocol: (prot) => set((s) => ({ corporateProtocols: [prot, ...(s.corporateProtocols || [])] })),
        updateCorporateProtocol: (prot) => set((s) => ({
          corporateProtocols: (s.corporateProtocols || []).map(p =>
            (p.id === prot.id || p.protocolCode === prot.protocolCode) ? { ...p, ...prot } : p
          )
        })),
        renewCorporateProtocol: (id, newValidUntil, additionalQuota = 0) => set((s) => ({
          corporateProtocols: (s.corporateProtocols || []).map(p => {
            if (p.id === id || p.protocolCode === id) {
              return {
                ...p,
                validUntil: newValidUntil,
                committedQuota: Number(p.committedQuota || 0) + Number(additionalQuota),
                status: PROTOCOL_STATUS.ACTIVE
              };
            }
            return p;
          })
        })),
        terminateCorporateProtocol: (id, reason) => set((s) => ({
          corporateProtocols: (s.corporateProtocols || []).map(p => {
            if (p.id === id || p.protocolCode === id) {
              return {
                ...p,
                status: PROTOCOL_STATUS.TERMINATED,
                terminationReason: reason,
                terminatedAt: new Date().toISOString()
              };
            }
            return p;
          })
        })),

        setSectorMentors: setter('sectorMentors'),
        addSectorMentor: (mentor) => set((s) => ({ sectorMentors: [mentor, ...(s.sectorMentors || [])] })),

        setEsbimEvents: setter('esbimEvents'),
        addEsbimEvent: (evt) => set((s) => ({ esbimEvents: [evt, ...(s.esbimEvents || [])] })),

        setIskurJobClubCohorts: setter('iskurJobClubCohorts'),
        addIskurCohort: (cohort) => set((s) => ({ iskurJobClubCohorts: [cohort, ...(s.iskurJobClubCohorts || [])] })),

        setClubApplications: setter('clubApplications'),
        addClubApplication: (app) => set((s) => ({ clubApplications: [app, ...(s.clubApplications || [])] })),

        setCareerTestSubmissions: setter('careerTestSubmissions'),
        addCareerTestSubmission: (sub) => set((s) => ({ careerTestSubmissions: [sub, ...(s.careerTestSubmissions || [])] })),

        setAlumniCardApplications: setter('alumniCardApplications'),
        setAlumniCardForms: setter('alumniCardForms'),
        setAlumniAssocBoard: setter('alumniAssocBoard'),
        setAlumniAssocApplications: setter('alumniAssocApplications'),

        setKgbEnabled: setter('kgbEnabled'),
        setKgbStudentRecords: setter('kgbStudentRecords'),
        setKgbAlumniRecords: setter('kgbAlumniRecords'),

        setSspEnabled: setter('sspEnabled'),
        setSspUsers: setter('sspUsers'),

        setInstitutionalStatsData: setter('institutionalStatsData'),
        setShowInstitutionalStats: setter('showInstitutionalStats'),

        setGroups: setter('groups'),
        setMentorships: setter('mentorships'),
        setClubs: setter('clubs'),
        setAcademicCatalog: setter('academicCatalog'),
        setAcademicApprovals: setter('academicApprovals'),
        setEventRegistrations: setter('eventRegistrations'),

        // Mezunla 15 Dakika Kahve & Mikro-Mentorluk Randevuları
        setCoffeeChats: setter('coffeeChats'),
        addCoffeeChat: (chat) =>
          set((s) => ({
            coffeeChats: [chat, ...(s.coffeeChats || []).filter((c) => c?.id !== chat?.id)]
          })),
        updateCoffeeChatStatus: (chatId, newStatus, extraData = {}) =>
          set((s) => ({
            coffeeChats: (s.coffeeChats || []).map((c) =>
              c.id === chatId ? { ...c, status: newStatus, ...extraData } : c
            )
          })),

        incrementSwarmData: () =>
          set((s) => ({
            swarmMetrics: {
              ...s.swarmMetrics,
              dataNodesProcessed: s.swarmMetrics.dataNodesProcessed + Math.floor(Math.random() * 100) + 50
            }
          })),

        // Communication Pools Setters
        setMessages: setter('messages'),
        sendMessage: (msg) => set((s) => ({ messages: [...(s.messages || []), msg] })),

        setNotifications: setter('notifications'),
        setUnreadNotificationsCount: setter('unreadNotificationsCount'),
        markAllNotificationsRead: () => set((state) => ({
          unreadNotificationsCount: 0,
          notifications: (state.notifications || []).map(n => ({ ...n, read: true }))
        })),
        addNotification: (notif) =>
          set((state) => ({
            ...(notif ? { notifications: [notif, ...(state.notifications || [])].slice(0, 50) } : {}),
            unreadNotificationsCount: (state.unreadNotificationsCount || 0) + 1
          })),

        /**
         * Reset store to initial state (for tests and session logout).
         */
        reset: () => set(getInitialAdminState())
      };
    },
    {
      name: 'iesu-career-admin-store',
      partialize: (state) => {
        const sanitizeList = (arr) => {
          if (!Array.isArray(arr)) return [];
          return arr.map(item => {
            if (!item || typeof item !== 'object') return item;
            const { password, pass, token, secret, ...clean } = item;
            if (clean.tcKimlik && typeof clean.tcKimlik === 'string' && clean.tcKimlik.length === 11) {
              clean.tcKimlik = clean.tcKimlik.slice(0, 4) + '*****' + clean.tcKimlik.slice(-2);
            }
            return clean;
          });
        };

        return {
          students: sanitizeList(state.students),
          alumni: sanitizeList(state.alumni),
          companies: sanitizeList(state.companies),
          academicStaff: sanitizeList(state.academicStaff),
          surveys: state.surveys,
        siteConfig: state.siteConfig,
        auditLogs: state.auditLogs,
        featureToggles: state.featureToggles,
        featureSurveys: state.featureSurveys,
        featureCareerCheckup: state.featureCareerCheckup,
        featureAlumniCard: state.featureAlumniCard,
        featureAlumniAssocToggle: state.featureAlumniAssocToggle,
        featureClubsShowcase: state.featureClubsShowcase,
        featureClubApplications: state.featureClubApplications,
        featureCareerFair: state.featureCareerFair,
        featureSEMAcademy: state.featureSEMAcademy,
        featureSSPLeaderboard: state.featureSSPLeaderboard,
        hiveErrors: state.hiveErrors,
        adminActiveTab: state.adminActiveTab,
        adminMessages: Array.isArray(state.adminMessages) ? state.adminMessages.slice(0, 50) : [],
        applications: Array.isArray(state.applications) ? state.applications.slice(0, 100) : [],
        staffList: state.staffList,
        careerFairEvent: state.careerFairEvent,
        careerFairFormTemplate: state.careerFairFormTemplate,
        careerFairApplications: state.careerFairApplications,
        careerFairStands: state.careerFairStands,
        researchLabs: state.researchLabs,
        researchCalls: state.researchCalls,
        researchConfig: state.researchConfig,
        labReservations: state.labReservations,
        researchCallApplications: state.researchCallApplications,
        checkupRecords: Array.isArray(state.checkupRecords) ? state.checkupRecords.slice(0, 50) : [],
        employmentDeclarations: Array.isArray(state.employmentDeclarations) ? state.employmentDeclarations.slice(0, 100) : [],
        pukoScorecards: Array.isArray(state.pukoScorecards) ? state.pukoScorecards : [],
        surveyResponses: Array.isArray(state.surveyResponses) ? state.surveyResponses.slice(0, 100) : [],
        newsletterSubscribers: Array.isArray(state.newsletterSubscribers) ? state.newsletterSubscribers.slice(0, 50) : [],
        bmiRecords: Array.isArray(state.bmiRecords) ? state.bmiRecords.slice(0, 50) : [],
        helpdeskTickets: Array.isArray(state.helpdeskTickets) ? state.helpdeskTickets.slice(0, 50) : [],
        corporateProtocols: state.corporateProtocols,
        sectorMentors: state.sectorMentors,
        esbimEvents: state.esbimEvents,
        iskurJobClubCohorts: state.iskurJobClubCohorts,
        clubs: state.clubs,
        clubApplications: state.clubApplications,
        careerTestSubmissions: state.careerTestSubmissions,
        alumniCardApplications: state.alumniCardApplications,
        alumniCardForms: state.alumniCardForms,
        alumniAssocBoard: state.alumniAssocBoard,
        alumniAssocApplications: state.alumniAssocApplications,
        kgbEnabled: state.kgbEnabled,
        kgbStudentRecords: state.kgbStudentRecords,
        kgbAlumniRecords: state.kgbAlumniRecords,
        sspUsers: state.sspUsers,
        institutionalStatsData: state.institutionalStatsData,
        showInstitutionalStats: state.showInstitutionalStats,
        messages: Array.isArray(state.messages) ? state.messages.slice(-100) : [],
        mentorships: state.mentorships,
        coffeeChats: Array.isArray(state.coffeeChats) ? state.coffeeChats.slice(0, 50) : [],
        notifications: Array.isArray(state.notifications) ? state.notifications.slice(0, 50) : []
      };
    }
  }
)
);

// Managed subscriber tracking
let adminStoreUnsubscribers = [];

/**
 * Explicit subscriber initialization/re-attachment mechanism for useAdminStore.
 * Listens to cross-hive error events via eventBus and aggregates hive telemetry.
 * Can be called automatically on module import and explicitly in test setup.
 * @returns {Function} Clean unsubscribe function.
 */
export function initAdminStoreSubscriptions() {
  if (adminStoreUnsubscribers.length > 0) {
    adminStoreUnsubscribers.forEach((unsub) => {
      try {
        if (typeof unsub === 'function') unsub();
      } catch (_) { /* intentional */ }
    });
    adminStoreUnsubscribers = [];
  }

  const unsubError = eventBus.on('hive:error', (payload) => {
    if (payload && payload.hive && !payload._fromAdminStore) {
      const validHives = ['student', 'alumni', 'company', 'academic', 'admin'];
      const hive = validHives.includes(payload.hive) ? payload.hive : 'admin';
      const store = useAdminStore.getState();
      const currentCount = store.hiveErrors?.[hive] || 0;
      useAdminStore.setState({
        hiveErrors: {
          ...store.hiveErrors,
          [hive]: currentCount + 1
        }
      });
    }
  });

  const unsubCoffeeRequested = eventBus.on('coffee_chat:requested', (payload) => {
    if (payload && payload.chat) {
      useAdminStore.getState().addCoffeeChat(payload.chat);
    }
  });

  const unsubCoffeeStatus = eventBus.on('coffee_chat:status_changed', (payload) => {
    if (payload && payload.chatId && payload.status) {
      useAdminStore.getState().updateCoffeeChatStatus(payload.chatId, payload.status, payload.extraData || {});
    }
  });

  adminStoreUnsubscribers = [unsubError, unsubCoffeeRequested, unsubCoffeeStatus];

  return () => {
    adminStoreUnsubscribers.forEach((unsub) => {
      try {
        if (typeof unsub === 'function') unsub();
      } catch (_) { /* intentional */ }
    });
    adminStoreUnsubscribers = [];
  };
}

// Wire EventBus listener for cross-hive error telemetry on module load
initAdminStoreSubscriptions();

export default useAdminStore;
