import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DOMPurify from 'dompurify';
import { 
  initialNews, initialEvents, initialAnnouncements, 
  initialSemCourses, initialJobs, initialFeatured, initialCareerOpportunities, initialGeneralEvents,
  initialMentorships, initialVoluntaryInternships, 
  initialAcademicCatalog, initialAcademicApprovals, 
  initialInternships, initialGroups, initialSurveys 
, generateStudents, generateAlumni, generateCompanies, generateAcademicStaff, initialPosts
} from '../utils/mockData';
import { liveEventData, liveAnnouncementData, liveNewsData } from '../utils/liveData';

const initialRealCompanies = [];

const initialClubs = [];
const initialClubApplications = [];

const initialApplications = [
  {
    id: 'APP-101',
    jobId: 'JOB-001',
    jobTitle: 'Ulusal Staj Programı',
    company: 'İESÜ Kariyer Geliştirme Koordinatörlüğü',
    applicantId: 'STU-002',
    applicantName: 'Zeynep Yılmaz',
    applicantEmail: 'zeynep.y@esenyurt.edu.tr',
    applicantPhone: '0532 111 2233',
    applicantDept: 'Yazılım Mühendisliği',
    coverLetter: 'Cumhurbaşkanlığı Ulusal Staj Programı kapsamında kamu ve savunma sanayii kurumlarında staj yapmak istiyorum.',
    cvType: 'KGM Akredite İESÜ Dijital CV',
    status: 'Beklemede',
    companyContacted: false,
    date: '11.09.2026'
  },
  {
    id: 'APP-102',
    jobId: 'JOB-002',
    jobTitle: 'Frontend Developer Stajyeri',
    company: 'Logo Yazılım',
    applicantId: 'STU-003',
    applicantName: 'Ahmet Kaya',
    applicantEmail: 'ahmet.k@esenyurt.edu.tr',
    applicantPhone: '0533 222 3344',
    applicantDept: 'Bilgisayar Mühendisliği',
    coverLetter: 'React ve modern web teknolojileri alanında geliştirdiğim projelerle değer üretmek istiyorum.',
    cvType: 'İESÜ Kariyer Havuzundaki Yüklenmiş PDF CV',
    status: 'Mülakat',
    companyContacted: true,
    date: '08.09.2026'
  },
  {
    id: 'APP-103',
    jobId: 'JOB-003',
    jobTitle: 'Yapay Zeka & Veri Analitiği Stajyeri',
    company: 'Trendyol',
    applicantId: 'STU-004',
    applicantName: 'Selin Öztürk',
    applicantEmail: 'selin.o@esenyurt.edu.tr',
    applicantPhone: '0536 555 6677',
    applicantDept: 'Veri Bilimi ve Analitiği',
    coverLetter: 'Python ve makine öğrenmesi algoritmaları üzerine staj deneyimi kazanmak istiyorum.',
    cvType: 'KGM Akredite İESÜ Dijital CV',
    status: 'Kabul Edildi',
    companyContacted: true,
    date: '05.09.2026'
  }
];

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

const useAppStore = create(
  persist(
    (set) => {
      const setter = (key) => (val) => set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));
      
      return {
        messages: [
          { id: 'msg_1', senderId: 'STU-001', receiverId: 'ALU-001', text: "Selam Caner! Portfolyonuzdaki Web3 projesini çok beğendim.", timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), read: true },
          { id: 'msg_2', senderId: 'ALU-001', receiverId: 'STU-001', text: "Çok teşekkürler Alperen! İESÜ kuluçka merkezinde geliştirmiştik.", timestamp: new Date(Date.now() - 3600000 * 23).toISOString(), read: true },
          { id: 'msg_3', senderId: 'STU-001', receiverId: 'CMP-001', text: "Yazılım mühendisliği staj başvurum hakkında bilgi alabilir miyim?", timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), read: false }
        ],
        setMessages: setter('messages'),
        
        adminMessages: [
          { id: 'ADM-MSG-1', companyName: 'Aselsan A.Ş.', email: 'kurumsal@aselsan.com.tr', phone: '0216 555 0000', subject: '2026 Mühendislik Staj Kontenjanı Protokolü', message: 'Üniversiteniz bilgisayar ve elektrik-elektronik mühendisliği öğrencileri için 15 adet staj kontenjanı tanımlamak istiyoruz.', date: '30.07.2026 10:30', status: 'Beklemede' }
        ],
        setAdminMessages: setter('adminMessages'),

        notifications: [],
        setNotifications: setter('notifications'),
        unreadNotificationsCount: 0,
        setUnreadNotificationsCount: setter('unreadNotificationsCount'),
        markAllNotificationsRead: () => set({ unreadNotificationsCount: 0 }),
        userRole: null,
        setUserRole: setter('userRole'),
        activePortalBranch: 'student',
        setActivePortalBranch: (branch) => set(() => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('iesu_active_portal_branch', branch);
            }
          } catch(e) {}
          return { activePortalBranch: branch };
        }),
        adminActiveTab: 'feed',
        setAdminActiveTab: setter('adminActiveTab'),
        addNotification: (notif) => set((state) => ({
          ...(notif ? { notifications: [notif, ...(state.notifications || [])].slice(0, 50) } : {}),
          unreadNotificationsCount: (state.unreadNotificationsCount || 0) + 1
        })),
        
        userBP: 150, // Starting BP
        setUserBP: setter('userBP'),
        
        purchasedItems: [],
        setPurchasedItems: setter('purchasedItems'),
        
        activeFrame: null,
        setActiveFrame: setter('activeFrame'),
        
        purchaseItem: (cost, itemObj) => set((state) => {
          if (state.userBP >= cost) {
            if (itemObj.type === 'frame') {
              return { 
                userBP: state.userBP - cost, 
                purchasedItems: [...(state.purchasedItems || []), itemObj],
                activeFrame: itemObj.frameClass
              };
            }
            return {
              userBP: state.userBP - cost,
              purchasedItems: [...(state.purchasedItems || []), itemObj]
            };
          }
          return state;
        }),
        
        unlockedBadges: [],
        setUnlockedBadges: setter('unlockedBadges'),

        showInstitutionalStats: false, // Default false until official real stats are entered
        setShowInstitutionalStats: setter('showInstitutionalStats'),

        institutionalStatsData: [
          { id: 1, title: 'Topluma Kazandırılan Mezun', val: '65.000+', icon: 'GraduationCap' },
          { id: 2, title: 'Uluslararası Akredite Program', val: '65+', icon: 'ShieldCheck' },
          { id: 3, title: 'Ar-Ge & Uygulama Laboratuvarı', val: '110+', icon: 'FlaskConical' },
          { id: 4, title: 'Farklı Ülkeden Uluslararası Öğrenci', val: '130+', icon: 'Users' }
        ],
        setInstitutionalStatsData: setter('institutionalStatsData'),

        auditLogs: [
          {
            id: 'log_initial',
            timestamp: new Date().toLocaleTimeString("tr-TR"),
            user: "Sistem Ajanı",
            action: "Hibrit İdari Portal başarıyla başlatıldı ve yüklendi.",
            module: "Sistem",
            ip: "192.168.1.101"
          }
        ],
        logAction: (user, action, module = 'Genel', severity = 'info', metadata = null) => set((state) => {
          const now = new Date();
          const cleanUser = typeof user === 'string' ? DOMPurify.sanitize(user.slice(0, 100)) : String(user || 'Misafir');
          const cleanAction = typeof action === 'string' ? DOMPurify.sanitize(action.slice(0, 500)) : String(action || '');
          const cleanModule = typeof module === 'string' ? DOMPurify.sanitize(module.slice(0, 50)) : 'Genel';
          const newEntry = {
            id: 'log_' + now.getTime() + '_' + Math.random().toString(36).substr(2, 6),
            timestamp: now.toLocaleTimeString("tr-TR"),
            isoTimestamp: now.toISOString(),
            user: cleanUser,
            action: cleanAction,
            module: cleanModule,
            severity: (severity === 'warning' || severity === 'critical') ? severity : 'info',
            ip: typeof window !== 'undefined' ? (window.location?.hostname || 'localhost') : 'server',
            metadata: metadata && typeof metadata === 'object' ? { ...metadata } : null
          };
          const logs = state.auditLogs || [];
          return { auditLogs: [newEntry, ...logs.slice(0, 199)] };
        }),
        
        sendMessage: (msg) => set((state) => ({
          messages: [...(state.messages || []), msg]
        })),

        viewState: 'landing',
        setViewState: setter('viewState'),

        registerAccountType: 'alumni',
        setRegisterAccountType: setter('registerAccountType'),

        featureSEMAcademy: false,
        setFeatureSEMAcademy: setter('featureSEMAcademy'),
        
        sspEnabled: true,
        setSspEnabled: setter('sspEnabled'),
        
        sspUsers: [
          { id: 'STU-01', name: 'Ahmet Yılmaz', department: 'Yazılım Kulübü', points: 3450 },
          { id: 'STU-02', name: 'Zeynep Kaya', department: 'Kariyer Geliştirme Koordinatörlüğü', points: 2890 },
          { id: 'STU-03', name: 'Caner Demir', department: 'Tiyatro Kulübü', points: 2100 }
        ],
        setSspUsers: setter('sspUsers'),

        // KGB — Kariyer Gelişim Belgesi
        kgbEnabled: true,
        setKgbEnabled: setter('kgbEnabled'),

        kgbStudentRecords: [
          {
            id: 'STU-01', name: 'Ahmet Yılmaz', department: 'Bilgisayar Mühendisliği',
            internships: 2, certifications: 3, workshopsAttended: 7, mentorMeetings: 4,
            cvCompleteness: 85, portfolioItems: 5, targetSector: 'Yazılım',
            lastActivity: '2024-03-15'
          },
          {
            id: 'STU-02', name: 'Zeynep Kaya', department: 'İşletme',
            internships: 1, certifications: 2, workshopsAttended: 12, mentorMeetings: 6,
            cvCompleteness: 92, portfolioItems: 3, targetSector: 'Finans',
            lastActivity: '2024-03-18'
          },
          {
            id: 'STU-03', name: 'Caner Demir', department: 'Grafik Tasarım',
            internships: 3, certifications: 1, workshopsAttended: 5, mentorMeetings: 2,
            cvCompleteness: 78, portfolioItems: 8, targetSector: 'Yaratıcı Endüstriler',
            lastActivity: '2024-03-10'
          }
        ],
        setKgbStudentRecords: setter('kgbStudentRecords'),

        kgbAlumniRecords: [
          {
            id: 'ALU-01', name: 'Selin Arslan', graduationYear: 2021, department: 'Yazılım Müh.',
            currentPosition: 'Senior Developer', company: 'TechCorp',
            mentoringSessions: 8, jobsShared: 15, eventsAttended: 4,
            menteeCount: 3, alumniCardActive: true, networkStrength: 'Güçlü'
          },
          {
            id: 'ALU-02', name: 'Burak Çelik', graduationYear: 2019, department: 'İşletme',
            currentPosition: 'Proje Yöneticisi', company: 'Startup A.Ş.',
            mentoringSessions: 12, jobsShared: 8, eventsAttended: 7,
            menteeCount: 5, alumniCardActive: true, networkStrength: 'Çok Güçlü'
          }
        ],
        setKgbAlumniRecords: setter('kgbAlumniRecords'),
        
        previousView: 'landing',
        setPreviousView: setter('previousView'),

        currentUser: null,
        setCurrentUser: setter('currentUser'),

        focusMode: false,
        setFocusMode: setter('focusMode'),

        ghostMode: false,
        setGhostMode: setter('ghostMode'),

        selectedUserId: null,
        setSelectedUserId: setter('selectedUserId'),

        selectedGroupId: null,
        setSelectedGroupId: setter('selectedGroupId'),

        posts: initialPosts,
        setPosts: setter('posts'),

        stories: [
          { id: 1, author: { name: 'Kariyer Geliştirme Koordinatörlüğü', avatar: '/logo.png', role: 'admin' }, content: 'İESÜ Kariyer Günleri başlıyor! 🎉', image: 'https://panel.esenyurt.edu.tr/assets/2025/resimler/hitdb/cd8eee1b7fa146fd8e952b0c7d012305_fcf735c1ca7f470c8fe6bd98923cf369.jpg', viewedBy: [], createdAt: new Date().toISOString() }
        ],
        setStories: setter('stories'),

        companies: generateCompanies(),
        setCompanies: setter('companies'),

        clubs: initialClubs,
        setClubs: setter('clubs'),

        students: generateStudents(),
        setStudents: setter('students'),
        alumni: generateAlumni(),
        setAlumni: setter('alumni'),
        academicStaff: generateAcademicStaff(),
        setAcademicStaff: setter('academicStaff'),

        // Birlik Ağı States
        missions: [
          { id: 101, title: 'Bahar Şenliği Sosyal Medya Tasarımı', club: 'Grafik Tasarım Kulübü', points: 150, type: 'Tasarım', time: 'Acil' },
          { id: 102, title: 'Robotik Atölyesi İçin Çeviri', club: 'Robotik Topluluğu', points: 75, type: 'Çeviri', time: '3 Gün' },
          { id: 103, title: 'Kariyer Zirvesi Karşılama Ekibi', club: 'Kariyer Kulübü', points: 200, type: 'Organizasyon', time: 'Yarın' },
        ],
        setMissions: setter('missions'),
        
        userMissions: [],
        setUserMissions: setter('userMissions'),

        liveRooms: [
          { id: 201, title: '🚀 React vs Vue Tartışması', host: 'Yazılım Kulübü', listeners: 124, speakers: 4, active: true },
          { id: 202, title: '💼 Mezunlar Anlatıyor: İlk İş Mülakatı', host: 'Kariyer Geliştirme Koordinatörlüğü', listeners: 342, speakers: 2, active: true },
          { id: 203, title: '🗣️ İngilizce Konuşma Pratiği (B2-C1)', host: 'Dil Kulübü', listeners: 45, speakers: 8, active: true },
        ],
        setLiveRooms: setter('liveRooms'),

        marketplaceItems: [
          { id: 1, title: 'Thomas Calculus 14th Edition', price: '250 ₺', category: 'Kitap', author: 'Ahmet Y.', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80', date: '2 saat önce' },
          { id: 2, title: 'Proje Arkadaşı Aranıyor (React)', price: 'Gönüllü', category: 'Proje', author: 'Zeynep K.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80', date: '5 saat önce' },
          { id: 3, title: 'Temel Tasarım Çizim Seti', price: '120 ₺', category: 'Malzeme', author: 'Caner D.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&q=80', date: '1 gün önce' },
        ],
        setMarketplaceItems: setter('marketplaceItems'),

        news: liveNewsData,
        setNews: setter('news'),

        events: liveEventData,
        setEvents: setter('events'),

        announcements: liveAnnouncementData,
        setAnnouncements: setter('announcements'),

        semCourses: initialSemCourses,
        setSemCourses: setter('semCourses'),

        jobs: initialJobs,
        setJobs: setter('jobs'),

        swipedJobs: [],
        setSwipedJobs: setter('swipedJobs'),

        internships: initialInternships,
        setInternships: setter('internships'),

        voluntaryInternships: initialVoluntaryInternships,
        setVoluntaryInternships: setter('voluntaryInternships'),

        // --- Eksik slice'lar (UI crash koruması) ---
        // Aşağıdakiler birçok bileşen/store'da okunuyor ya da set ediliyordu ama store'da yoktu
        // → options undefined => iken değerler undefined kalıyor, setter çağrıları TypeError atıyordu.
        applications: initialApplications,
        setApplications: setter('applications'),
        addApplication: (app) => set(state => ({ applications: [app, ...(state.applications || [])] })),

        // UI featuredOpportunities adını kullanıyor (featuredItems değil)
        featuredOpportunities: initialFeatured,
        setFeaturedOpportunities: setter('featuredOpportunities'),

        // Kariyer Fırsatları & Küresel Olanaklar Portalı (MT, Erasmus, Hackathon, Burs)
        careerOpportunities: initialCareerOpportunities,
        setCareerOpportunities: setter('careerOpportunities'),

        // Genel Etkinlikler & Kampüs Yaşamı Portalı (Rektörlük, Şenlik, Sempozyum, Spor)
        generalEvents: initialGeneralEvents,
        setGeneralEvents: setter('generalEvents'),

        alumniCardApplications: [],
        setAlumniCardApplications: setter('alumniCardApplications'),

        alumniCardForms: [],
        setAlumniCardForms: setter('alumniCardForms'),

        featureSSPLeaderboard: false,
        setFeatureSSPLeaderboard: setter('featureSSPLeaderboard'),

        // CMSDataPoolExport tarafından okunuyordu (guard'lı ama tanımsızdı)
        eventRegistrations: [],
        setEventRegistrations: setter('eventRegistrations'),

        mentorships: initialMentorships,
        setMentorships: setter('mentorships'),

        groups: initialGroups,
        setGroups: setter('groups'),

        surveys: initialSurveys,
        setSurveys: setter('surveys'),

        alumniAssocBoard: [
          { id: 'MEMBER-1', name: 'Dr. Caner ŞAHİN', role: 'Mezun Derneği Başkanı', email: 'csahin@esenyurt.edu.tr', phone: '444 9 123 (Dahili: 1105)' },
          { id: 'MEMBER-2', name: 'Alperen KAYA', role: 'Genel Sekreter & Bilişim Sorumlusu', email: 'alperen@esenyurt.edu.tr', phone: '444 9 123' }
        ],
        setAlumniAssocBoard: setter('alumniAssocBoard'),

        alumniAssocApplications: [
          { id: 'APP-101', name: 'Alperen YILMAZ', type: 'Asıl Üyelik', department: 'Bilgisayar Mühendisliği', graduationYear: '2024', email: 'alperen@gmail.com', phone: '0532 000 0000', appliedAt: '2026-07-24', status: 'Beklemede' },
          { id: 'APP-102', name: 'Selin DEMİR', type: 'Yönetim Ekibi Adaylığı', department: 'İşletme', graduationYear: '2023', email: 'selin@gmail.com', phone: '0533 111 2233', appliedAt: '2026-07-25', status: 'Beklemede' }
        ],
        setAlumniAssocApplications: setter('alumniAssocApplications'),

        academicCatalog: initialAcademicCatalog,
        setAcademicCatalog: setter('academicCatalog'),

        staffList: initialStaffList,
        setStaffList: setter('staffList'),
        addStaffMember: (member) => set((state) => ({ staffList: [member, ...(state.staffList || [])] })),
        updateStaffMember: (updated) => set((state) => ({ staffList: (state.staffList || []).map(s => s.id === updated.id ? updated : s) })),
        deleteStaffMember: (id) => set((state) => ({ staffList: (state.staffList || []).filter(s => s.id !== id) })),

        academicApprovals: initialAcademicApprovals,
        setAcademicApprovals: setter('academicApprovals'),

        // Enterprise Central Data Pools (Havuz)
        bmiRecords: [
          { id: 'BMI-101', name: 'Alperen Şahin', role: 'Öğrenci', height: 180, weight: 78, bmi: 24.1, bmr: 1820, targetCal: 2502, category: 'İdeal Kilo', dietitianRequested: true, date: '2026-07-21 10:15' },
          { id: 'BMI-102', name: 'Zeynep Kaya', role: 'Öğrenci', height: 165, weight: 54, bmi: 19.8, bmr: 1350, targetCal: 1856, category: 'İdeal Kilo', dietitianRequested: false, date: '2026-07-21 09:40' }
        ],
        setBmiRecords: setter('bmiRecords'),
        addBmiRecord: (rec) => set(state => ({ bmiRecords: [rec, ...(state.bmiRecords || [])] })),

        helpdeskTickets: [
          { id: 'BIDB-2026-849', name: 'Mert Demir', email: 'mert.d@esenyurt.edu.tr', subject: 'E-Posta / Wi-Fi Şifre Sıfırlama', details: 'Kampüs Wi-Fi şifrem kilitlendi.', status: 'Açık', date: '2026-07-21 10:02' },
          { id: 'BIDB-2026-850', name: 'Selin Yılmaz', email: 'selin.y@esenyurt.edu.tr', subject: 'LMS Ders Erişim Sorunu', details: 'Biyomedikal 101 dersi paneli görünmüyor.', status: 'İşlemde', date: '2026-07-21 09:15' }
        ],
        setHelpdeskTickets: setter('helpdeskTickets'),
        addHelpdeskTicket: (tkt) => set(state => ({ helpdeskTickets: [tkt, ...(state.helpdeskTickets || [])] })),

        clubApplications: [
          { id: 'APP-CLUB-101', name: 'Caner Öz', clubName: 'Yazılım ve Bilişim Kulübü', department: 'Bilgisayar Müh.', date: '2026-07-21 09:30', status: 'Onay Bekliyor' }
        ],
        setClubApplications: setter('clubApplications'),
        addClubApplication: (app) => set(state => ({ clubApplications: [app, ...(state.clubApplications || [])] })),

        labReservations: [
          { 
            id: 'RES-LAB-01', 
            name: 'Dr. Ahmet Yılmaz', 
            academicTitle: 'Dr. Öğr. Üyesi', 
            department: 'Bilgisayar Mühendisliği', 
            email: 'ahmet.yilmaz@esenyurt.edu.tr', 
            phone: '+90 532 111 2233', 
            labId: 'LAB-01', 
            labName: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab', 
            timeSlot: '14:00 - 16:00', 
            date: '2026-07-21', 
            projectSubject: 'TÜBİTAK 1001 Derin Öğrenme Model Eğitimi', 
            attendeeCount: 4, 
            specialRequests: '8x H100 GPU kümesi erişim yetkisi', 
            status: 'Onaylandı', 
            adminNote: 'Rezervasyon onaylandı. Laboratuvar sorumlusundan erişim kartınızı teslim alabilirsiniz.',
            createdAt: '2026-07-20T10:00:00Z' 
          }
        ],
        setLabReservations: setter('labReservations'),
        addLabReservation: (res) => set(state => ({ labReservations: [res, ...(state.labReservations || [])] })),
        updateLabReservationStatus: (id, status, adminNote = null) => set(state => ({
          labReservations: (state.labReservations || []).map(r => r.id === id ? { 
            ...r, 
            status, 
            ...(adminNote !== null ? { adminNote } : {}),
            updatedAt: new Date().toISOString()
          } : r)
        })),

        researchCallApplications: [
          {
            id: 'APP-CALL-01',
            callId: 'CALL-101',
            callTitle: 'TÜBİTAK 2209-A: Otonom İHA Kontrol Algoritmaları Bursiyer Çağrısı',
            lead: 'Dr. Öğr. Üyesi Mehmet Can',
            applicantName: 'Mert Demir',
            applicantStatus: 'Yüksek Lisans Öğrencisi',
            department: 'Bilgisayar Mühendisliği',
            email: 'mert.demir@ogr.esenyurt.edu.tr',
            phone: '+90 532 555 0192',
            appliedRole: 'Yüksek Lisans Bursiyeri',
            weeklyHours: '15 - 20 Saat / Hafta',
            skillsExperience: 'ROS2, C++, Python, Gazebo simülasyon deneyimi.',
            statementOfPurpose: 'İHA rota optimizasyonu üzerine tez çalışmamı bu TÜBİTAK projesinde sürdürmek istiyorum.',
            cvLink: 'https://iesu.edu.tr/cv/mert-demir',
            status: 'Onay Bekliyor',
            adminNote: '',
            submittedAt: '2026-07-21T14:30:00Z'
          }
        ],
        setResearchCallApplications: setter('researchCallApplications'),
        addResearchCallApplication: (app) => set(state => ({ researchCallApplications: [app, ...(state.researchCallApplications || [])] })),
        updateResearchCallApplicationStatus: (id, status, adminNote = null) => set(state => ({
          researchCallApplications: (state.researchCallApplications || []).map(a => a.id === id ? { 
            ...a, 
            status, 
            ...(adminNote !== null ? { adminNote } : {}),
            updatedAt: new Date().toISOString()
          } : a)
        })),

        // Ar-Ge Laboratuvarları Kataloğu (Yönetici Paneli Yönetilebilir)
        researchLabs: [
          {
            id: 'LAB-01',
            name: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab',
            location: 'J Blok 4. Kat / Lab 402',
            equipment: '8x NVIDIA H100 Tensor Core GPU Sunucu',
            capacity: '25 Araştırmacı',
            status: 'Aktif / Rezervasyona Açık'
          },
          {
            id: 'LAB-02',
            name: 'Otonom Sistemler & İHA Geliştirme Lab',
            location: 'Kuluçka Merkezi A Blok',
            equipment: 'Rüzgar Tüneli & 3D Metal Yazıcılar',
            capacity: '15 Araştırmacı',
            status: 'Aktif / Rezervasyona Açık'
          },
          {
            id: 'LAB-03',
            name: 'Biyomedikal Cihaz & Doku Mühendisliği Lab',
            location: 'C Blok Zemin Kat / Lab 104',
            equipment: 'Hücre Kültür İnkübatörleri & Mikroskoplar',
            capacity: '20 Araştırmacı',
            status: 'Bakımda (Yarın Açık)'
          }
        ],
        setResearchLabs: setter('researchLabs'),
        addResearchLab: (lab) => set(state => ({ researchLabs: [lab, ...(state.researchLabs || [])] })),
        updateResearchLab: (updated) => set(state => ({ researchLabs: (state.researchLabs || []).map(l => l.id === updated.id ? updated : l) })),
        deleteResearchLab: (id) => set(state => ({ researchLabs: (state.researchLabs || []).filter(l => l.id !== id) })),

        // Proje & Bursiyer Çağrıları Kataloğu (Yönetici Paneli Yönetilebilir)
        researchCalls: [
          {
            id: 'CALL-101',
            title: 'TÜBİTAK 2209-A: Otonom İHA Kontrol Algoritmaları Bursiyer Çağrısı',
            lead: 'Dr. Öğr. Üyesi Mehmet Can',
            positions: '2 Lisans / 1 Yüksek Lisans Öğrencisi',
            deadline: '15 Mart 2026',
            budget: '75.000 ₺ Destekli',
            status: 'Aktif'
          },
          {
            id: 'CALL-102',
            title: 'BAP Projesi: Sağlıkta LLM Destekli Tanı Asistanı Araştırmacı Alımı',
            lead: 'Prof. Dr. Bahri Şahin',
            positions: '3 Yazılım Araştırmacısı',
            deadline: '01 Nisan 2026',
            budget: '120.000 ₺ Destekli',
            status: 'Aktif'
          }
        ],
        setResearchCalls: setter('researchCalls'),
        addResearchCall: (call) => set(state => ({ researchCalls: [call, ...(state.researchCalls || [])] })),
        updateResearchCall: (updated) => set(state => ({ researchCalls: (state.researchCalls || []).map(c => c.id === updated.id ? updated : c) })),
        deleteResearchCall: (id) => set(state => ({ researchCalls: (state.researchCalls || []).filter(c => c.id !== id) })),

        // Ar-Ge & Çağrı Formu Soruları & Revize Ayarları (Yönetici Paneli Yapılandırması)
        researchConfig: {
          timeSlots: [
            "09:00 - 11:00 (Sabah Seansı)",
            "11:30 - 13:30 (Öğle Seansı)",
            "14:00 - 16:00 (Öğleden Sonra Seansı)",
            "16:30 - 18:30 (Akşam Seansı)"
          ],
          labCustomQuestions: [
            { 
              id: 'q_safety', 
              label: 'Laboratuvar İş Sağlığı & Güvenliği (İSG) Eğitimi Tamamlandı mı?', 
              type: 'select', 
              options: ['Evet (Sertifikalı)', 'Muaf (Öğretim Üyesi)', 'Henüz Tamamlanmadı'], 
              required: true 
            },
            { 
              id: 'q_ethics', 
              label: 'Etik Kurul Onayı Gerektiriyor mu?', 
              type: 'select', 
              options: ['Gerektirmiyor', 'Alındı (Karar No Mevcut)', 'Başvuru Aşamasında'], 
              required: false 
            }
          ],
          callCustomQuestions: [
            { 
              id: 'cq_availability', 
              label: 'Hafta Sonu / Saha Çalışmasına Katılım Durumu', 
              type: 'select', 
              options: ['Tamamen Uygun', 'Sadece Cumartesi', 'Yalnızca Hafta İçi'], 
              required: false 
            },
            { 
              id: 'cq_scholarship', 
              label: 'Daha Önce TÜBİTAK/BAP Bursiyeri Oldunuz mu?', 
              type: 'select', 
              options: ['Hayır (İlk Kez)', 'Evet (TÜBİTAK 2209)', 'Evet (BAP)', 'Evet (Diğer)'], 
              required: false 
            }
          ]
        },
        setResearchConfig: setter('researchConfig'),
        updateResearchConfig: (partial) => set(state => ({ researchConfig: { ...(state.researchConfig || {}), ...partial } })),

        newsletterSubscribers: [
          {
            id: 'SUB-2026-001',
            email: 'ogrenci@esenyurt.edu.tr',
            fullName: 'Ahmet Yılmaz',
            faculty: 'Mühendislik ve Mimarlık Fakültesi',
            department: 'Yazılım Mühendisliği',
            grade: '3. Sınıf',
            birthDate: '2004-05-15',
            date: '2026-07-21 11:20',
            status: 'Onaylandı (KVKK İzinli)'
          }
        ],
        setNewsletterSubscribers: setter('newsletterSubscribers'),
        addNewsletterSubscriber: (sub) => set(state => ({ newsletterSubscribers: [sub, ...(state.newsletterSubscribers || [])] })),

        checkupRecords: [
          {
            id: 'CHECKUP-101',
            name: 'Alperen YILMAZ',
            graduationYear: '2024',
            department: 'Bilgisayar Mühendisliği',
            employed: 'Evet',
            jobTiming: '0 - 3 Ay İçinde',
            sector: 'Yazılım & Bilişim',
            companyType: 'Özel Şirket',
            title: 'Kıdemli Yazılım Geliştirici',
            relatedToMajor: 'Evet',
            newJobTitleIfNo: '-',
            city: 'İstanbul / Türkiye',
            workMode: 'Hibrit',
            postgrad: 'Hayır',
            phoneUpdated: 'Hayır',
            newPhone: '+90 532 999 8877',
            emailUpdated: 'Hayır',
            newEmail: 'alperen.yeni@gmail.com',
            notes: 'Platform harika olmuş, teşekkürler.',
            date: '2026-07-27 10:25'
          }
        ],
        setCheckupRecords: setter('checkupRecords'),
        addCheckupRecord: (rec) => set(state => ({ checkupRecords: [rec, ...(state.checkupRecords || [])] })),

        // AI Swarm Intelligence Metrics
        swarmMetrics: {
          activeAgents: 25,
          dataNodesProcessed: 84392,
          evolutionCycle: 1,
        },
        incrementSwarmData: () => set((state) => ({
          swarmMetrics: { 
            ...state.swarmMetrics, 
            dataNodesProcessed: state.swarmMetrics.dataNodesProcessed + Math.floor(Math.random() * 100) + 50
          }
        })),

        featureSurveys: true,
        setFeatureSurveys: setter('featureSurveys'),
        featureCareerCheckup: true,
        setFeatureCareerCheckup: setter('featureCareerCheckup'),
        featureAlumniCard: false,
        setFeatureAlumniCard: setter('featureAlumniCard'),
        // duplicate key: 265'te true tanımlıydı, 369'da false aşıyordu → tutarlı hale: true
        featureAlumniAssocToggle: true,
        setFeatureAlumniAssocToggle: setter('featureAlumniAssocToggle'),
        featureClubsShowcase: true,
        setFeatureClubsShowcase: setter('featureClubsShowcase'),
        featureClubApplications: true,
        setFeatureClubApplications: setter('featureClubApplications'),
        featureCareerFair: false,
        setFeatureCareerFair: setter('featureCareerFair'),

        // Kariyer Günleri (Google Stitch Upgrade) States & Actions
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
        setCareerFairEvent: setter('careerFairEvent'),

        careerFairFormTemplate: [
          { id: 'q_1', label: 'Katılımcı Sayısı & Yetkili İsimleri', type: 'text', required: true, description: 'Stant başında duracak personel sayısı ve ad-soyad bilgileri', order: 1 },
          { id: 'q_2', label: 'Elektrik & İnternet İhtiyacı', type: 'select', required: true, options: ['Yalnızca Standart Priz (220V)', 'Yüksek Güç + Kablolu İnternet', 'İhtiyaç Yok'], order: 2 },
          { id: 'q_3', label: 'Özel Ekipman / Roll-up Detayları', type: 'textarea', required: false, description: 'Getirilecek görseller ve stand alan gereksinimleri', order: 3 },
          { id: 'q_4', label: 'Eşantiyon & Promosyon Dağıtımı', type: 'checkbox', required: false, description: 'Stantta promosyon ürün dağıtılacak mı?', order: 4 },
          { id: 'q_5', label: 'Firma Logosu (Vektörel/PNG)', type: 'file', required: true, description: 'Fuar kataloğu ve afişler için yüksek çözünürlüklü logo', order: 5 }
        ],
        setCareerFairFormTemplate: setter('careerFairFormTemplate'),

        careerFairApplications: [
          { id: 'APP-101', companyId: 'CMP-001', companyName: 'Baykar Teknoloji', appliedAt: '2026-07-20', status: 'Onaylandı', tableNumber: 'Stant A-01', answers: { q_1: '3 Personel - Ahmet Yılmaz, Ayşe Kaya', q_2: 'Yüksek Güç + Kablolu İnternet', q_3: '2 Adet Roll-up Banner', f_booth: 'Stant Katılımı', f_names: 'Ahmet Yılmaz, Ayşe Kaya', f_tc: '12345678901' } },
          { id: 'APP-102', companyId: 'CMP-002', companyName: 'Aselsan', appliedAt: '2026-07-21', status: 'Onaylandı', tableNumber: 'Stant A-02', answers: { q_1: '2 Personel - Mehmet Demir', q_2: 'Yalnızca Standart Priz (220V)', f_booth: 'Stant Katılımı', f_names: 'Mehmet Demir', f_tc: '98765432109' } },
          { id: 'APP-103', companyId: 'CMP-003', companyName: 'Trendyol Tech', appliedAt: '2026-07-22', status: 'Beklemede', tableNumber: null, answers: { q_1: '4 Personel - Caner Şahin', f_booth: 'Sponsorluk + Stant', f_names: 'Caner Şahin', f_tc: '45678912300' } },
          { id: 'APP-104', companyId: 'CMP-004', companyName: 'Havelsan', appliedAt: '2026-07-23', status: 'Onaylandı', tableNumber: null, answers: { q_1: '2 Personel - Zeynep Ak', f_booth: 'Stant Katılımı', f_names: 'Zeynep Ak', f_tc: '65432198700' } }
        ],
        setCareerFairApplications: setter('careerFairApplications'),

        careerFairStands: [
          // Zone A (A-01 to A-12)
          { id: 'A-01', code: 'Stant A-01', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-001', assignedCompanyName: 'Baykar Teknoloji', tableNumber: 'Stant A-01' },
          { id: 'A-02', code: 'Stant A-02', zone: 'A', status: 'Atandı', assignedCompanyId: 'CMP-002', assignedCompanyName: 'Aselsan', tableNumber: 'Stant A-02' },
          { id: 'A-03', code: 'Stant A-03', zone: 'A', status: 'Rezerve', assignedCompanyId: null, assignedCompanyName: 'Protokol Rezervasyonu', tableNumber: 'Stant A-03' },
          { id: 'A-04', code: 'Stant A-04', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-04' },
          { id: 'A-05', code: 'Stant A-05', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-05' },
          { id: 'A-06', code: 'Stant A-06', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-06' },
          { id: 'A-07', code: 'Stant A-07', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-07' },
          { id: 'A-08', code: 'Stant A-08', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-08' },
          { id: 'A-09', code: 'Stant A-09', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-09' },
          { id: 'A-10', code: 'Stant A-10', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-10' },
          { id: 'A-11', code: 'Stant A-11', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-11' },
          { id: 'A-12', code: 'Stant A-12', zone: 'A', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant A-12' },

          // Zone B (B-01 to B-12)
          { id: 'B-01', code: 'Stant B-01', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-01' },
          { id: 'B-02', code: 'Stant B-02', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-02' },
          { id: 'B-03', code: 'Stant B-03', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-03' },
          { id: 'B-04', code: 'Stant B-04', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-04' },
          { id: 'B-05', code: 'Stant B-05', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-05' },
          { id: 'B-06', code: 'Stant B-06', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-06' },
          { id: 'B-07', code: 'Stant B-07', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-07' },
          { id: 'B-08', code: 'Stant B-08', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-08' },
          { id: 'B-09', code: 'Stant B-09', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-09' },
          { id: 'B-10', code: 'Stant B-10', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-10' },
          { id: 'B-11', code: 'Stant B-11', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-11' },
          { id: 'B-12', code: 'Stant B-12', zone: 'B', status: 'Boş', assignedCompanyId: null, assignedCompanyName: null, tableNumber: 'Stant B-12' }
        ],
        setCareerFairStands: setter('careerFairStands'),

        addFormField: (field) => set((state) => ({
          careerFairFormTemplate: [...(state.careerFairFormTemplate || []), field]
        })),
        removeFormField: (id) => set((state) => ({
          careerFairFormTemplate: (state.careerFairFormTemplate || []).filter(f => f.id !== id)
        })),
        updateFormField: (id, updated) => set((state) => ({
          careerFairFormTemplate: (state.careerFairFormTemplate || []).map(f => f.id === id ? { ...f, ...updated } : f)
        })),
        reorderFormFields: (startIndex, endIndex) => set((state) => {
          const list = Array.from(state.careerFairFormTemplate || []);
          const [removed] = list.splice(startIndex, 1);
          list.splice(endIndex, 0, removed);
          return { careerFairFormTemplate: list };
        }),
        assignStandToCompany: (standId, companyName, companyId = null, newStatus = 'Atandı') => set((state) => {
          const targetStand = (state.careerFairStands || []).find(s => s.id === standId || s.code === standId);
          const standCode = targetStand ? targetStand.code : standId;

          const updatedStands = (state.careerFairStands || []).map(s => {
            if (s.id === standId || s.code === standId) {
              return {
                ...s,
                status: newStatus,
                assignedCompanyId: companyId,
                assignedCompanyName: newStatus === 'Boş' ? null : companyName
              };
            }
            if (companyName && newStatus !== 'Boş' && s.assignedCompanyName === companyName && s.code !== standCode) {
              return {
                ...s,
                status: 'Boş',
                assignedCompanyId: null,
                assignedCompanyName: null
              };
            }
            return s;
          });

          const updatedApps = (state.careerFairApplications || []).map(app => {
            if (companyName && app.companyName === companyName) {
              return { ...app, tableNumber: newStatus === 'Boş' ? null : standCode };
            }
            if (app.tableNumber === standCode && (newStatus === 'Boş' || app.companyName !== companyName)) {
              return { ...app, tableNumber: null };
            }
            return app;
          });

          const now = new Date();
          const timeString = now.toLocaleTimeString('tr-TR');
          const auditLog = {
            id: 'log_' + Math.random().toString(36).substr(2, 9),
            timestamp: timeString,
            user: 'Kariyer Ofisi Yöneticisi',
            action: `Kariyer Günleri: ${standCode} -> ${newStatus === 'Boş' ? 'Stant Boşaltıldı' : companyName + ' (' + newStatus + ')'}`,
            module: 'Kariyer Günleri',
            ip: '192.168.1.101'
          };

          const notif = {
            id: 'NOTIF-' + Math.random().toString(36).substr(2, 9),
            type: 'system',
            title: 'Stant Ataması Güncellendi',
            message: `${standCode} yerleşimi "${companyName || 'Boş'}" olarak güncellendi.`,
            read: false,
            date: new Date().toLocaleDateString('tr-TR')
          };

          return {
            careerFairStands: updatedStands,
            careerFairApplications: updatedApps,
            auditLogs: [auditLog, ...(state.auditLogs || [])].slice(0, 100),
            notifications: [notif, ...(state.notifications || [])].slice(0, 50),
            unreadNotificationsCount: (state.unreadNotificationsCount || 0) + 1
          };
        }),

        lastUpdated: new Date().toISOString(),
        setLastUpdated: setter('lastUpdated'),
        source: 'live',
        setSource: setter('source'),
        status: 'aktif',
        setStatus: setter('status'),
        isScraperLoading: false,
        setIsScraperLoading: setter('isScraperLoading'),
        refreshScrapedData: async (forceRefresh = false) => {
          set({ isScraperLoading: true });
          let lastErr = null;
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const { scrapeLiveOrFallback } = await import('../services/scraper');
              const data = await scrapeLiveOrFallback({ forceRefresh });
              set((state) => ({
                ...(data.announcements && data.announcements.length > 0 ? { announcements: data.announcements } : {}),
                ...(data.events && data.events.length > 0 ? { events: data.events } : {}),
                lastUpdated: data.lastUpdated || new Date().toISOString(),
                source: data.source || 'live',
                status: data.status || 'aktif',
                isScraperLoading: false
              }));
              return data;
            } catch (err) {
              lastErr = err;
              if (attempt === 0) {
                await new Promise((r) => setTimeout(r, 600));
              }
            }
          }
          console.error("Failed to refresh scraped data after retries:", lastErr);
          set({ isScraperLoading: false, status: 'error' });
          throw lastErr;
        },
        siteConfig: {
          heroBannerTitle: 'Kariyerini Şekillendir',
          heroBannerSub: 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.',
          ctaButtonText: 'Hemen Başla',
          maintenanceMode: false,
          announcementBanner: { visible: false, text: '', color: 'red' },
          primaryColor: '#990000',
          logoSubText: 'IESU KARİYER',
          footerMotto: 'Geleceğe açılan kapı.',
        },
        setSiteConfig: setter('siteConfig'),
      };
    },
    {
      name: 'iesu-career-store-v22',
      partialize: (state) => ({
        userRole: state.userRole,
        activePortalBranch: state.activePortalBranch,
        adminActiveTab: state.adminActiveTab,
        students: state.students,
        alumni: state.alumni,
        companies: state.companies,
        featureClubsShowcase: state.featureClubsShowcase,
        featureClubApplications: state.featureClubApplications,
        featureSSPLeaderboard: state.featureSSPLeaderboard,
        featureSEMAcademy: state.featureSEMAcademy,
        auditLogs: state.auditLogs,
        featureSurveys: state.featureSurveys,
        featureCareerCheckup: state.featureCareerCheckup,
        featureAlumniCard: state.featureAlumniCard,
        featureAlumniAssocToggle: state.featureAlumniAssocToggle,
        featureCareerFair: state.featureCareerFair,
        careerFairEvent: state.careerFairEvent,
        careerFairFormTemplate: state.careerFairFormTemplate,
        careerFairApplications: state.careerFairApplications,
        careerFairStands: state.careerFairStands,
        checkupRecords: state.checkupRecords,
        newsletterSubscribers: state.newsletterSubscribers,
        staffList: state.staffList,
        adminMessages: state.adminMessages,
        applications: state.applications,
        careerOpportunities: state.careerOpportunities,
        generalEvents: state.generalEvents,
        alumniCardApplications: state.alumniCardApplications,
        alumniCardForms: state.alumniCardForms,
        alumniAssocApplications: state.alumniAssocApplications,
        alumniAssocBoard: state.alumniAssocBoard,
        institutionalStatsData: state.institutionalStatsData,
        showInstitutionalStats: state.showInstitutionalStats,
        sspUsers: state.sspUsers,
        kgbEnabled: state.kgbEnabled,
        kgbStudentRecords: state.kgbStudentRecords,
        kgbAlumniRecords: state.kgbAlumniRecords,
        liveRooms: state.liveRooms,
        labReservations: state.labReservations,
        researchCallApplications: state.researchCallApplications,
        researchLabs: state.researchLabs,
        researchCalls: state.researchCalls,
        researchConfig: state.researchConfig,
        siteConfig: state.siteConfig
      })
    }
  )
);

export default useAppStore;
