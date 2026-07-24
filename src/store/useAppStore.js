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

const initialClubs = [
  { id: 'CLUB-001', name: 'Genç Yeşilay Kulübü', category: 'Sosyal Sorumluluk', description: 'Bağımlılıklarla mücadele ve sağlıklı yaşam bilincini artırma.', presidentId: 'STU-001', advisorId: 'ACAD-001', status: 'Aktif', memberCount: 45, coverImage: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=500&q=80', logo: 'https://ui-avatars.com/api/?name=GY&background=10B981&color=fff', forms: [], admins: ['STU-002'], memberRequests: [] }
];

const initialClubApplications = [];

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
        
        notifications: [],
        setNotifications: setter('notifications'),
        addNotification: (notif) => set((state) => ({ notifications: [notif, ...(state.notifications || [])].slice(0, 50) })),
        
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

        academicCatalog: initialAcademicCatalog,
        setAcademicCatalog: setter('academicCatalog'),

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

        eventRegistrations: [
          { id: 'TKT-EVT-101', name: 'Elif Şahin', eventTitle: 'Yapay Zeka ve Geleceğin Meslekleri Paneli', ticketCode: 'IESU-AI-883', date: '2026-07-21 10:20', status: 'Aktif Bilet' }
        ],
        setEventRegistrations: setter('eventRegistrations'),
        addEventRegistration: (reg) => set(state => ({ eventRegistrations: [reg, ...(state.eventRegistrations || [])] })),

        isProfileDrawerOpen: false,
        setIsProfileDrawerOpen: setter('isProfileDrawerOpen'),

        unreadNotificationsCount: 3,
        setUnreadNotificationsCount: setter('unreadNotificationsCount'),

        addNotification: () => set((state) => ({
          unreadNotificationsCount: state.unreadNotificationsCount + 1
        })),

        markNotificationsRead: () => set({ unreadNotificationsCount: 0 }),

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

        resetStore: () => set({ 
          userRole: null, 
          viewState: 'landing',
          selectedUserId: null,
          selectedGroupId: null,
          focusMode: false,
          ghostMode: false
        }),

        
        liveRooms: [
          { id: 1, title: 'Yapay Zeka Mülakatları Nasıl Geçilir?', host: { id: 'AI-101', name: 'Yapay Zeka Kulübü', logo: 'https://ui-avatars.com/api/?name=AI&background=0f172a&color=fff' }, listeners: 124, isActive: true },
          { id: 2, title: 'Yurtdışı Staj Fırsatları Soru-Cevap', host: { id: 'GV-102', name: 'Girişimcilik Vakfı', logo: 'https://ui-avatars.com/api/?name=GV&background=16a34a&color=fff' }, listeners: 89, isActive: true },
          { id: 3, title: 'Diksiyon ve Etkili İletişim', host: { id: 'TK-103', name: 'Tiyatro Kulübü', logo: 'https://ui-avatars.com/api/?name=TK&background=9333ea&color=fff' }, listeners: 45, isActive: true },
        ],
        setLiveRooms: setter('liveRooms'),

        featureSurveys: true,
        setFeatureSurveys: setter('featureSurveys'),
        featureCareerCheckup: true,
        setFeatureCareerCheckup: setter('featureCareerCheckup'),
        featureAlumniCard: true,
        setFeatureAlumniCard: setter('featureAlumniCard'),
        featureClubsShowcase: true,
        setFeatureClubsShowcase: setter('featureClubsShowcase'),
        featureClubApplications: true,
        setFeatureClubApplications: setter('featureClubApplications'),
        featureCareerFair: false,
        setFeatureCareerFair: setter('featureCareerFair'),
        
        featureSSPLeaderboard: true,
        setFeatureSSPLeaderboard: setter('featureSSPLeaderboard'),
        
        careerFairEvent: {
          title: "İESÜ Geleneksel Kariyer Günleri 2026",
          date: "15-16 Mayıs 2026",
          description: "Öğrencilerimizle sektörün önde gelen firmalarını buluşturuyoruz.",
          banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
          isActive: false
        },
        setCareerFairEvent: setter('careerFairEvent'),

        careerFairFormTemplate: [
          { id: 'f_tc', label: 'Katılımcı TC Kimlik No(lar)', type: 'text', required: true, description: 'Kampüse giriş için gereklidir. Birden fazla kişi katılacaksa virgülle ayırabilirsiniz.' },
          { id: 'f_names', label: 'Katılımcı Ad Soyad(lar)', type: 'text', required: true, description: 'Görevli kartları için kullanılacaktır.' },
          { id: 'f_booth', label: 'Katılım Türü', type: 'select', options: ['Sadece Konuşmacı', 'Stant (Masa) Açılacak', 'Hem Konuşmacı Hem Stant'], required: true },
          { id: 'f_swag', label: 'Eşantiyon/Hediye Dağıtımı', type: 'textarea', required: false, description: 'Öğrencilerimize dağıtmayı planladığınız eşantiyon (promosyon) ürünlerini buraya yazabilirsiniz.' },
          { id: 'f_logo', label: 'Firma Logosu (URL veya Dosya)', type: 'text', required: true, description: 'Tanıtım materyallerinde kullanılmak üzere yüksek çözünürlüklü logo linkiniz.' }
        ],
        setCareerFairFormTemplate: setter('careerFairFormTemplate'),

        careerFairApplications: [
          { id: 'CFA-001', companyId: 'CMP-011', companyName: 'MACFİT', status: 'Onaylandı', tableNumber: 'A-12', appliedAt: '2026-05-01T10:00:00Z', answers: { f_tc: '12345678901', f_names: 'Ahmet Yılmaz', f_booth: 'Stant (Masa) Açılacak', f_swag: 'Protein tozu, spor havlusu', f_logo: 'https://logo.com/macfit.png' } }
        ],
        setCareerFairApplications: setter('careerFairApplications'),

        featuredOpportunities: initialFeatured,
        setFeaturedOpportunities: setter('featuredOpportunities')
      };
    },
    {
      name: 'iesu-career-store-v20',
      partialize: (state) => ({

        userRole: state.userRole,
        auditLogs: state.auditLogs,
        focusMode: state.focusMode,
        ghostMode: state.ghostMode,
        companies: state.companies,
        clubs: state.clubs,
        clubApplications: state.clubApplications,
        stories: state.stories,
        posts: state.posts,
        internships: state.internships,
        voluntaryInternships: state.voluntaryInternships,
        mentorships: state.mentorships,
        academicApprovals: state.academicApprovals,
        groups: state.groups,
        featureSurveys: state.featureSurveys,
        featureCareerCheckup: state.featureCareerCheckup,
        featureAlumniCard: state.featureAlumniCard,
        featureClubsShowcase: state.featureClubsShowcase,
        featureClubApplications: state.featureClubApplications,
        featureCareerFair: state.featureCareerFair,
        featureSSPLeaderboard: state.featureSSPLeaderboard,
        careerFairEvent: state.careerFairEvent,
        careerFairFormTemplate: state.careerFairFormTemplate,
        careerFairApplications: state.careerFairApplications
      })
    }
  )
);

export default useAppStore;
