import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  initialNews, initialEvents, initialAnnouncements, 
  initialSemCourses, initialJobs, initialFeatured, 
  initialMentorships, initialVoluntaryInternships, 
  initialAcademicCatalog, initialAcademicApprovals, 
  initialInternships, initialGroups, initialSurveys 
, generateStudents, generateAlumni, generateCompanies, generateAcademicStaff, initialPosts
} from '../utils/mockData';
import { liveEventData, liveAnnouncementData, liveNewsData } from '../utils/liveData';

const initialRealCompanies = [];

const initialClubs = [];
const initialClubApplications = [];

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

        chaosMode: false,
        setChaosMode: setter('chaosMode'),

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
        logAction: (user, action, module) => set((state) => {
          const now = new Date();
          const timeString = now.toLocaleTimeString("tr-TR");
          const newEntry = {
            id: 'log_' + Math.random().toString(36).substr(2, 9),
            timestamp: timeString,
            user: user || "Misafir",
            action: action,
            module: module || "Genel",
            ip: "192.168.1.101"
          };
          return { auditLogs: [newEntry, ...(state.auditLogs || [])].slice(0, 100) };
        }),
        
        sendMessage: (msg) => set((state) => ({
          messages: [...(state.messages || []), msg]
        })),

        viewState: 'landing',
        setViewState: setter('viewState'),
        
        sspEnabled: true,
        setSspEnabled: setter('sspEnabled'),
        
        sspUsers: [
          { id: 'STU-01', name: 'Ahmet Yılmaz', department: 'Yazılım Kulübü', points: 3450 },
          { id: 'STU-02', name: 'Zeynep Kaya', department: 'Kariyer Geliştirme Koordinatörlüğü', points: 2890 },
          { id: 'STU-03', name: 'Caner Demir', department: 'Tiyatro Kulübü', points: 2100 }
        ],
        setSspUsers: setter('sspUsers'),
        
        previousView: 'landing',
        setPreviousView: setter('previousView'),

        userRole: null,
        setUserRole: setter('userRole'),

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

        groups: initialGroups,
        setGroups: setter('groups'),
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

        clubApplications: initialClubApplications,
        setClubApplications: setter('clubApplications'),

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

        featuredItems: initialFeatured,
        setFeaturedItems: setter('featuredItems'),

        internships: initialInternships,
        setInternships: setter('internships'),

        voluntaryInternships: initialVoluntaryInternships,
        setVoluntaryInternships: setter('voluntaryInternships'),

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

        featureAlumniAssocToggle: true,
        setFeatureAlumniAssocToggle: setter('featureAlumniAssocToggle'),

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
          { id: 'RES-LAB-01', name: 'Dr. Ahmet Yılmaz', labName: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab', timeSlot: '14:00 - 16:00', date: '2026-07-21', status: 'Onaylandı' }
        ],
        setLabReservations: setter('labReservations'),
        addLabReservation: (res) => set(state => ({ labReservations: [res, ...(state.labReservations || [])] })),

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
        featureAlumniAssocToggle: false,
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
            console.error("Failed to refresh scraped data:", err);
            set({ isScraperLoading: false, status: 'error' });
            throw err;
          }
        }
      };
    },
    {
      name: 'iesu-career-store-v22',
      partialize: (state) => ({
        userRole: state.userRole,
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
        alumniAssocApplications: state.alumniAssocApplications,
        alumniAssocBoard: state.alumniAssocBoard,
        institutionalStatsData: state.institutionalStatsData,
        showInstitutionalStats: state.showInstitutionalStats,
        sspUsers: state.sspUsers,
        liveRooms: state.liveRooms
      })
    }
  )
);

export default useAppStore;
