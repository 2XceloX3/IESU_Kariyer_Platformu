import React, { useState, useEffect, useMemo, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import useAppStore from './store/useAppStore';

const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const StudentFeed = lazy(() => import('./components/StudentFeed'));
const CompanyFeed = lazy(() => import('./components/CompanyFeed'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const OrganizationChart = lazy(() => import('./components/OrganizationChart'));
const JobsAndInternships = lazy(() => import('./components/JobsAndInternships'));
const NewsEvents = lazy(() => import('./components/NewsEvents'));
const SemPanel = lazy(() => import('./components/SemPanel'));
const StajPanel = lazy(() => import('./components/StajPanel'));
const AlumniFeed = lazy(() => import('./components/AlumniFeed'));
const FloatingChatWidget = lazy(() => import('./components/FloatingChatWidget'));
const AcademicStaffFeed = lazy(() => import('./components/AcademicStaffFeed'));
const AcademicOnboarding = lazy(() => import('./components/AcademicOnboarding'));
const ProfileUpdate = lazy(() => import('./components/ProfileUpdate'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const StudentAnalytics = lazy(() => import('./components/StudentAnalytics'));
const GroupProfile = lazy(() => import('./components/GroupProfile'));
const GroupsPanel = lazy(() => import('./components/GroupsPanel'));
const NotificationsPanel = lazy(() => import('./components/NotificationsPanel'));
const ApplicationsPanel = lazy(() => import('./components/ApplicationsPanel'));
const AICVBuilder = lazy(() => import('./components/AICVBuilder'));
const InterviewSimulator = lazy(() => import('./components/InterviewSimulator'));
const PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt'));
const MessagingInterface = lazy(() => import('./components/MessagingInterface'));
const CalendarView = lazy(() => import('./components/CalendarView'));
const JobCreator = lazy(() => import('./components/JobCreator'));
const ClubAdminPanel = lazy(() => import('./components/ClubAdminPanel'));
const StudentClubPortal = lazy(() => import('./components/StudentClubPortal'));
const AlumniInformationSystem = lazy(() => import('./components/AlumniInformationSystem'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const AICareerWingman = lazy(() => import('./components/AICareerWingman'));
const BirlikAgiPortal = lazy(() => import('./components/BirlikAgiPortal'));
const AIAssistantBot = lazy(() => import('./components/AIAssistantBot'));
const LeaderboardPanel = lazy(() => import('./components/LeaderboardPanel'));
const MentorMatch = lazy(() => import('./components/MentorMatch'));
const VirtualCareerFair = lazy(() => import('./components/VirtualCareerFair'));
const AlumniCardWallet = lazy(() => import('./components/AlumniCardWallet'));
const CareerTest = lazy(() => import('./components/CareerTest'));
const CareerRoadmap = lazy(() => import('./components/CareerRoadmap'));
const StartupIncubator = lazy(() => import('./components/StartupIncubator'));
const LiveRoomsPanel = lazy(() => import('./components/LiveRoomsPanel'));
const IesuWallet = lazy(() => import('./components/IesuWallet'));
const MentorBooking = lazy(() => import('./components/MentorBooking'));
const SmartCertificates = lazy(() => import('./components/SmartCertificates'));
const DynamicContentPage = lazy(() => import('./components/DynamicContentPage'));
const CompanyATSBoard = lazy(() => import('./components/CompanyATSBoard'));

// New Hybrid Portal Components
const IdariPortal = lazy(() => import('./components/IdariPortal'));
const AuditLogsPanel = lazy(() => import('./components/AuditLogsPanel'));

// Extra active view pages
const DigitalPortfolio = lazy(() => import('./components/DigitalPortfolio'));
const MetaverseLibrary = lazy(() => import('./components/MetaverseLibrary'));
const HackathonMarket = lazy(() => import('./components/HackathonMarket'));
const AlumniDAO = lazy(() => import('./components/AlumniDAO'));
const CampusMap = lazy(() => import('./components/CampusMap'));
const AnkaChat = lazy(() => import('./components/AnkaChat'));
const GlobalAlumniMap = lazy(() => import('./components/GlobalAlumniMap'));

// Stitch UI Components
const SKSDBLunchWidget = lazy(() => import('./components/SKSDBLunchWidget'));
const SKSDBClubsDirectory = lazy(() => import('./components/SKSDBClubsDirectory'));
const BIDBSystemStatusCard = lazy(() => import('./components/BIDBSystemStatusCard'));
const BIDBHelpdeskModal = lazy(() => import('./components/BIDBHelpdeskModal'));
const KariyerJobBoard = lazy(() => import('./components/KariyerJobBoard'));
const AboutUsPage = lazy(() => import('./components/AboutUsPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const ResearchOSHub = lazy(() => import('./components/ResearchOSHub'));
import GlobalSearchOverlay from './components/GlobalSearchOverlay';

import { ToastContainer, toast } from './components/shared/Toast';
import NotificationEngine from './components/NotificationEngine';

window.toast = toast;

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {style: {padding: '2rem', background: '#fee2e2', color: '#991b1b', height: '100vh', zIndex: 9999, position: 'relative'}},
        React.createElement('h1', null, 'CRASH!'),
        React.createElement('pre', null, this.state.error.stack)
      );
    }
    return this.props.children;
  }
}

const RewardStore = lazy(() => import('./components/RewardStore'));

const validViews = ['reward_store', 'student_analytics', 'landing', 'leaderboard', 'live_rooms', 'mentor_match', 'virtual_fair', 'alumni_card', 'career_test', 'career_roadmap', 'startup_incubator', 'login', 'register', 'forgot_password', 'create_job', 'club_admin', 'club_portal', 'student', 'alumni', 'academic', 'company', 'admin', 'organization', 'jobs', 'haberler', 'duyurular', 'etkinlikler', 'sem', 'staj', 'profile_update', 'mbs', 'user_profile', 'groups', 'group_profile', 'notifications', 'calendar', 'applications', 'cvbuilder', 'messaging', 'interview_sim', 'birlik_agi', 'idari_portal', 'audit_logs', 'wallet', 'mentor_booking', 'smart_certs', 'company_ats', 'digital_portfolio', 'metaverse_library', 'hackathon_market', 'alumni_dao', 'campus_map', 'anka_chat', 'global_map', 'sksdb_lunch', 'sksdb_clubs', 'bidb_status', 'bidb_helpdesk', 'kariyer_board', 'about_us', 'services', 'events_list', 'contact_us', 'research_hub'];

function App() {
  const viewState = useAppStore(state => state.viewState);
  const setViewState = useAppStore(state => state.setViewState);
  const previousView = useAppStore(state => state.previousView);
  const setPreviousView = useAppStore(state => state.setPreviousView);
  const userRole = useAppStore(state => state.userRole);
  const setUserRole = useAppStore(state => state.setUserRole);
  const selectedUserId = useAppStore(state => state.selectedUserId);
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const selectedGroupId = useAppStore(state => state.selectedGroupId);
  const setSelectedGroupId = useAppStore(state => state.setSelectedGroupId);
  const logAction = useAppStore(state => state.logAction);

  const setJobs = useAppStore(state => state.setJobs);
  const setPosts = useAppStore(state => state.setPosts);
  const setNews = useAppStore(state => state.setNews);
  const setEvents = useAppStore(state => state.setEvents);
  const setAnnouncements = useAppStore(state => state.setAnnouncements);

  const students = useAppStore(state => state.students);
  const setStudents = useAppStore(state => state.setStudents);
  const alumni = useAppStore(state => state.alumni);
  const setAlumni = useAppStore(state => state.setAlumni);
  const companies = useAppStore(state => state.companies);
  const setCompanies = useAppStore(state => state.setCompanies);
  const academicStaff = useAppStore(state => state.academicStaff);
  const setAcademicStaff = useAppStore(state => state.setAcademicStaff);

  const groups = useAppStore(state => state.groups);
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const viewStr = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'landing';
  const view = validViews.includes(viewStr) ? viewStr : 'landing';

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('igu_mock_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && !parsed.id) {
         if (parsed.role === 'academic' || parsed.department === 'Bilgisayar Mühendisliği') parsed.id = 'ACAD-001';
         else if (parsed.role === 'student' || parsed.grade === 'Aktif') parsed.id = 'STU-' + Date.now();
         else if (parsed.role === 'alumni') parsed.id = 'ALU-' + Date.now();
         else if (parsed.role === 'employer' || parsed.sector) parsed.id = 'EMP-' + Date.now();
         else parsed.id = 'admin_1513';
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });

  const setView = useCallback((v) => {
    const nextView = typeof v === 'function' ? v(view) : v;
    if (nextView !== view && view !== 'login' && view !== 'register') {
      setPreviousView(view);
    }
    if (logAction) {
      logAction(currentUser?.name || 'Ziyaretçi', `Sayfa Değiştirildi -> ${nextView.toUpperCase()}`, "Navigasyon");
    }
    navigate(nextView === 'landing' ? '/' : '/' + nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, navigate, setPreviousView, logAction, currentUser]);

  const [academicRole, setAcademicRole] = useState('standard_academic'); 
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  useEffect(() => {
    if (currentUser?.role === 'admin' && currentUser?.avatar?.includes('ui-avatars')) {
      setCurrentUser({
        ...currentUser,
        avatar: '/logo.png'
      });
    }
  }, [currentUser, setCurrentUser]);

  // Handle PWA installation & user persistence
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('igu_mock_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('igu_mock_user');
      localStorage.removeItem('igu_user_role_v1');
    }
  }, [currentUser]);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleGlobalK = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalK);
    return () => window.removeEventListener('keydown', handleGlobalK);
  }, []);

  // Firebase Real User Hydration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({ id: user.uid, ...userData });
            if (userData.role) setUserRole(userData.role);
          } else {
            setCurrentUser(prev => prev || { id: user.uid, email: user.email, name: user.displayName || 'Kullanıcı' });
          }
        } catch (err) {
          console.error("Firebase data hydration error:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('igu_likes_reset_v4')) {
      setPosts(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setNews(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setEvents(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setAnnouncements(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setJobs(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      localStorage.setItem('igu_likes_reset_v4', 'true');
    }
  }, []);

  useEffect(() => {
    const publicViews = ['landing', 'login', 'register', 'forgot_password', 'haberler', 'duyurular', 'etkinlikler', 'about_us', 'services', 'events_list', 'contact_us', 'sksdb_lunch', 'sksdb_clubs', 'bidb_status', 'bidb_helpdesk', 'kariyer_board', 'metaverse_library', 'digital_portfolio', 'hackathon_market', 'campus_map', 'global_map', 'research_hub'];
    const isInnerPage = view && view.startsWith('inner_page_');
    if (!currentUser && !publicViews.includes(view) && !isInnerPage) {
      if (window.toast) window.toast.error("Bu sayfayı görüntülemek için giriş yapmalısınız.");
      setView('landing');
    } else if (currentUser && view === 'admin' && userRole !== 'admin') {
      if (window.toast) window.toast.error("Bu sayfaya erişim yetkiniz yok.");
      setView(userRole === 'academic' ? 'academic' : userRole === 'company' ? 'company' : userRole === 'alumni' ? 'alumni' : 'student');
    }
  }, [view, currentUser, userRole]);

  useEffect(() => {
    document.body.style.overflow = '';
    document.body.classList.remove('overflow-hidden');
  }, [view]);

  const liveStudents = useMemo(() => (students || []).filter(item => item.source !== 'demo_seed'), [students]);
  const liveAlumni = useMemo(() => (alumni || []).filter(item => item.source !== 'demo_seed'), [alumni]);
  const liveCompanies = useMemo(() => (companies || []).filter(item => item.source !== 'demo_seed'), [companies]);
  const liveAcademicStaff = useMemo(() => (academicStaff || []).filter(item => item.source !== 'demo_seed'), [academicStaff]);

  return (
    <ErrorBoundary>
      <ToastContainer />
      <NotificationEngine />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#f8f9fc]"><div className="w-12 h-12 border-4 border-iesu-blue border-t-transparent rounded-full animate-spin shadow-lg"></div></div>}>
        {currentUser && view !== 'messaging' && <FloatingChatWidget setView={setView} />}
        {view === 'landing' && <LandingPage setView={setView} userRole={userRole} setUserRole={setUserRole} />}
        {view.startsWith('inner_page_') && <DynamicContentPage contentId={view.replace('inner_page_', '')} setView={setView} previousView="landing" />}
        {view === 'login' && <Login setView={setView} setUserRole={setUserRole} setAcademicRole={setAcademicRole} setCurrentUser={setCurrentUser} students={liveStudents} alumni={liveAlumni} companies={liveCompanies} academicStaff={liveAcademicStaff} />}
        {view === 'register' && <Register setView={setView} setCurrentUser={setCurrentUser} setStudents={setStudents} setAlumni={setAlumni} setAcademicStaff={setAcademicStaff} setCompanies={setCompanies} setUserRole={setUserRole} />}
        {view === 'forgot_password' && <ForgotPassword setView={setView} />}
        {view === 'create_job' && <JobCreator setView={setView} currentUser={currentUser} />}
        {view === 'club_admin' && currentUser && <ClubAdminPanel currentUser={currentUser} />}
        {view === 'club_portal' && <StudentClubPortal setView={setView} currentUser={currentUser} previousView={userRole === 'student' ? 'student' : 'alumni'} />}
        {view === 'student' && <StudentFeed setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} userRole={userRole} academicRole={academicRole} setSelectedGroupId={setSelectedGroupId} />}
        {view === 'alumni' && <AlumniFeed setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} userRole={userRole} academicRole={academicRole} setSelectedGroupId={setSelectedGroupId} />}
        {view === 'academic' && (
          <ErrorBoundary>
            <AcademicStaffFeed 
              setView={setView} 
              setSelectedUserId={setSelectedUserId}
              currentUser={currentUser} 
              userRole={userRole}
              academicRole={academicRole}
              setSelectedGroupId={setSelectedGroupId}
            />
          </ErrorBoundary>
        )}
        {view === 'company' && <CompanyFeed setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} userRole={userRole} academicRole={academicRole} setSelectedGroupId={setSelectedGroupId} />}
        {view === 'company_ats' && <CompanyATSBoard setView={setView} currentUser={currentUser} />}
        {view === 'admin' && currentUser && userRole === 'admin' && <AdminDashboard 
          setView={setView} currentUser={currentUser} setSelectedUserId={setSelectedUserId}
          userRole={userRole} academicRole={academicRole}
        />}
        {view === 'organization' && <OrganizationChart setView={setView} userRole={userRole} />}
        {view === 'jobs' && <JobsAndInternships setView={setView} previousView={previousView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} />}
        {view === 'haberler' && <NewsEvents setView={setView} category="haberler" currentUser={currentUser} userRole={userRole} />}
        {view === 'duyurular' && <NewsEvents setView={setView} category="duyurular" currentUser={currentUser} userRole={userRole} />}
        {view === 'etkinlikler' && <NewsEvents setView={setView} category="etkinlikler" currentUser={currentUser} userRole={userRole} />}
        {view === 'sem' && <SemPanel setView={setView} userRole={userRole} />}
        {view === 'staj' && <StajPanel setView={setView} userRole={userRole} />}
        {view === 'reward_store' && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto w-full max-h-screen custom-scrollbar relative pb-safe">
            <div className="absolute top-4 left-4 z-50">
              <button onClick={() => setView(previousView || 'student')} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            </div>
            <div className="pt-16 pb-20">
              <RewardStore />
            </div>
          </div>
        )}
        {view === 'profile_update' && <ProfileUpdate 
          setView={setView} 
          currentUser={currentUser} setCurrentUser={setCurrentUser}
          userRole={userRole} 
        />}
        {view === 'mbs' && <AlumniInformationSystem 
          currentUser={currentUser} 
          setView={setView} 
        />}
        {view === 'user_profile' && <UserProfile 
          userId={selectedUserId} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          previousView={previousView}
          currentUser={currentUser}
          setDirectMessageUser={setSelectedUserId}
        />}
        {view === 'student_analytics' && <StudentAnalytics setView={setView} currentUser={currentUser} userRole={userRole} previousView={previousView} />}
        {view === 'group_profile' && <GroupProfile
          groupId={selectedGroupId}
          groupData={groups.find(g => g.id === selectedGroupId) || null}
          currentUser={currentUser}
          setView={setView}
          userRole={userRole}
          setSelectedUserId={setSelectedUserId}
        />}
        {view === 'notifications' && <NotificationsPanel previousView={previousView}
          currentUser={currentUser} 
          setView={setView}
          userRole={userRole}
          setSelectedUserId={setSelectedUserId}
        />}
        {view === 'calendar' && (
          <ErrorBoundary>
            <CalendarView 
              currentUser={currentUser} 
              userRole={userRole}
              setView={setView} 
              setSelectedUserId={setSelectedUserId}
              academicRole={academicRole}
            />
          </ErrorBoundary>
        )}
        {view === 'applications' && <ApplicationsPanel currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'cvbuilder' && <AICVBuilder currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId}  academicRole={academicRole} />}
        {view === 'interview_sim' && <InterviewSimulator currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'messaging' && <MessagingInterface previousView={previousView}  currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} selectedUserId={selectedUserId} selectedGroupId={selectedGroupId} />}
        {view === 'leaderboard' && <LeaderboardPanel currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'live_rooms' && <LiveRoomsPanel currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'mentor_match' && <MentorMatch currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'virtual_fair' && <VirtualCareerFair currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'alumni_card' && <AlumniCardWallet currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'career_test' && <CareerTest currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'career_roadmap' && <CareerRoadmap currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'startup_incubator' && <StartupIncubator currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'wallet' && <IesuWallet currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'mentor_booking' && <MentorBooking currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'smart_certs' && <SmartCertificates currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'birlik_agi' && <BirlikAgiPortal currentUser={currentUser} setView={setView} previousView={previousView} setSelectedGroupId={setSelectedGroupId} setSelectedUserId={setSelectedUserId} />}
        
        {/* New Hub Views */}
        {view === 'idari_portal' && <IdariPortal setView={setView} previousView={previousView} />}
        {view === 'audit_logs' && <AuditLogsPanel setView={setView} previousView={previousView} />}
        
        {/* Extra Active View Pages */}
        {view === 'digital_portfolio' && <DigitalPortfolio currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'metaverse_library' && <MetaverseLibrary currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'hackathon_market' && <HackathonMarket currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'alumni_dao' && <AlumniDAO currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'campus_map' && <CampusMap currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'anka_chat' && <AnkaChat currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {/* Stitch UI View Pages */}
        {view === 'sksdb_lunch' && <SKSDBLunchWidget currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'sksdb_clubs' && <SKSDBClubsDirectory currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'bidb_status' && <BIDBSystemStatusCard currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'bidb_helpdesk' && <BIDBHelpdeskModal currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'kariyer_board' && <KariyerJobBoard currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'about_us' && <AboutUsPage currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'services' && <ServicesPage currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'events_list' && <EventsPage currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'contact_us' && <ContactPage currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'research_hub' && <ResearchOSHub currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}

        {/* Gen Z UX Features */}
        <PWAInstallPrompt />
        <CommandPalette setView={setView} />
        <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setView={setView} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
