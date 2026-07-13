import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  initialNews, initialEvents, initialAnnouncements, 
  initialSemCourses, initialJobs, initialFeatured, 
  initialMentorships, initialVoluntaryInternships, 
  initialAcademicCatalog, initialAcademicApprovals, 
  initialInternships, initialGroups, initialSurveys 
} from '../utils/mockData';

const initialRealCompanies = [
  { id: 'CMP-001', name: 'AIESEC Batı İstanbul Şubesi', username: 'aiesec', sector: 'Genel', status: 'Onaylı' },
  { id: 'CMP-002', name: 'ALTERNATİF YAYINCILIK SAN.VE TİC.LTD.ŞT', username: 'alternatif', sector: 'Yayıncılık', status: 'Onaylı' },
  { id: 'CMP-003', name: 'Bayraktar Grup sağlık turizm Ltd şti', username: 'bayraktar', sector: 'Sağlık Turizm', status: 'Onaylı' },
  { id: 'CMP-004', name: 'BİLİMSEL ESERLER WACOM', username: 'wacom', sector: 'Genel', status: 'Onaylı' },
  { id: 'CMP-005', name: 'British Centre Dil Okulları', username: 'britishcentre', sector: 'Eğitim', status: 'Onaylı' },
  { id: 'CMP-006', name: 'CABRA COFFEE ROASTERS', username: 'cabra', sector: 'Gıda', status: 'Onaylı' },
  { id: 'CMP-007', name: 'DİJİTALDE BUGÜN YAYINCILIK', username: 'dijitalde', sector: 'Yayıncılık', status: 'Onaylı' },
  { id: 'CMP-008', name: 'G silva yapı', username: 'gsilva', sector: 'Yapı', status: 'Onaylı' },
  { id: 'CMP-009', name: 'İstanbul Gümrük Müşavirleri Derneği', username: 'igmd', sector: 'Dernek', status: 'Onaylı' },
  { id: 'CMP-010', name: 'Karınca Lojistik A.Ş.', username: 'karinca', sector: 'Lojistik', status: 'Onaylı' },
  { id: 'CMP-011', name: 'MACFİT', username: 'macfit', sector: 'Spor', status: 'Onaylı' },
  { id: 'CMP-012', name: 'PLUS İNSAN KAYNAKLARI VE DAN. HİZ.', username: 'plusik', sector: 'İnsan Kaynakları', status: 'Onaylı' },
  { id: 'CMP-013', name: 'Ramada Residences by Wyndham Istanbul Haramidere', username: 'ramada', sector: 'Otelcilik', status: 'Onaylı' },
  { id: 'CMP-014', name: 'Sivil Havacılık Genel Müdürlüğü', username: 'shgm', sector: 'Kamu', status: 'Onaylı' },
  { id: 'CMP-015', name: 'TAV Güvenlik', username: 'tavguvenlik', sector: 'Güvenlik', status: 'Onaylı' },
  { id: 'CMP-016', name: 'TÜRKİYE İŞ KURUMU BÜYÜKÇEKMECE HİZMET MERKEZİ', username: 'iskur', sector: 'Kamu', status: 'Onaylı' }
];

const initialClubs = [
  { id: 'CLUB-001', name: 'Genç Yeşilay Kulübü', category: 'Sosyal Sorumluluk', description: 'Bağımlılıklarla mücadele ve sağlıklı yaşam bilincini artırma.', presidentId: 'STU-001', advisorId: 'ACAD-001', status: 'Aktif', memberCount: 45, coverImage: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=500&q=80', logo: 'https://ui-avatars.com/api/?name=GY&background=10B981&color=fff', forms: [], admins: ['STU-002'], joinRequests: [] }
];

const initialClubApplications = [];

const useAppStore = create(
  persist(
    (set) => {
      const setter = (key) => (val) => set((state) => ({ [key]: typeof val === 'function' ? val(state[key]) : val }));
      
      return {
        viewState: 'landing',
        setViewState: setter('viewState'),
        
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

        posts: [],
        setPosts: setter('posts'),

        stories: [
          { id: 1, author: { name: 'Kariyer Ofisi', avatar: '/iesu-logo.svg', role: 'admin' }, content: 'Bugün Kariyer Günleri başlıyor! 🎉', image: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg', viewedBy: [], createdAt: new Date().toISOString() }
        ],
        setStories: setter('stories'),

        news: initialNews,
        setNews: setter('news'),

        announcements: initialAnnouncements,
        setAnnouncements: setter('announcements'),

        events: initialEvents,
        setEvents: setter('events'),

        semCourses: initialSemCourses,
        setSemCourses: setter('semCourses'),

        jobs: initialJobs,
        setJobs: setter('jobs'),

        featuredOpportunities: initialFeatured,
        setFeaturedOpportunities: setter('featuredOpportunities'),

        mentorships: initialMentorships,
        setMentorships: setter('mentorships'),

        voluntaryInternships: initialVoluntaryInternships,
        setVoluntaryInternships: setter('voluntaryInternships'),

        alumniCardApplications: [],
        setAlumniCardApplications: setter('alumniCardApplications'),

        alumniCardForms: [],
        setAlumniCardForms: setter('alumniCardForms'),

        students: [],
        setStudents: setter('students'),

        alumni: [],
        setAlumni: setter('alumni'),

        companies: initialRealCompanies,
        setCompanies: setter('companies'),

        academicStaff: [],
        setAcademicStaff: setter('academicStaff'),

        messages: [],
        setMessages: setter('messages'),

        notifications: [],
        setNotifications: setter('notifications'),

        applications: [],
        setApplications: setter('applications'),

        surveys: initialSurveys,
        setSurveys: setter('surveys'),

        academicCatalog: initialAcademicCatalog,
        setAcademicCatalog: setter('academicCatalog'),

        academicApprovals: initialAcademicApprovals,
        setAcademicApprovals: setter('academicApprovals'),

        liveInternships: initialInternships,
        setLiveInternships: setter('liveInternships'),

        groups: initialGroups,
        setGroups: setter('groups'),

        featureSurveys: true,
        setFeatureSurveys: setter('featureSurveys'),

        featureCareerCheckup: true,
        setFeatureCareerCheckup: setter('featureCareerCheckup'),

        featureAlumniCard: true,
        setFeatureAlumniCard: setter('featureAlumniCard'),

        featureClubsShowcase: true,
        setFeatureClubsShowcase: setter('featureClubsShowcase'),

        featureClubApplications: false,
        setFeatureClubApplications: setter('featureClubApplications'),

        clubs: initialClubs,
        setClubs: setter('clubs'),

        clubApplications: initialClubApplications,
        setClubApplications: setter('clubApplications')
      };
    },
    {
      name: 'iesu_global_store_v1', // unique name
      partialize: (state) => ({
        viewState: state.viewState,
        previousView: state.previousView,
        userRole: state.userRole,
        focusMode: state.focusMode,
        ghostMode: state.ghostMode
        // We INTENTIONALLY do NOT persist the massive arrays (posts, jobs, students, etc.) 
        // to prevent synchronous localStorage blocking (stuttering/UI lag) on every state change.
      })
    }
  )
);

export default useAppStore;
