import React, { useState, useEffect, useMemo, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import useAppStore from './store/useAppStore';
import ExploreFeed from './components/ExploreFeed';

const LandingPage = lazy(() => import('./components/LandingPage'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const StudentFeed = lazy(() => import('./components/StudentFeed'));
const CompanyFeed = lazy(() => import('./components/CompanyFeed'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AdminFeed = lazy(() => import('./components/AdminFeed'));
const OrganizationChart = lazy(() => import('./components/OrganizationChart'));
const JobsAndInternships = lazy(() => import('./components/JobsAndInternships'));
const NewsEvents = lazy(() => import('./components/NewsEvents'));
const PublicNewsView = lazy(() => import('./components/PublicNewsView'));
const SemPanel = lazy(() => import('./components/SemPanel'));
const StajPanel = lazy(() => import('./components/StajPanel'));
const AlumniFeed = lazy(() => import('./components/AlumniFeed'));
const FloatingChatWidget = lazy(() => import('./components/FloatingChatWidget'));
const AcademicStaffFeed = lazy(() => import('./components/AcademicStaffFeed'));
const ProfileUpdate = lazy(() => import('./components/ProfileUpdate'));
const CareerNetwork = lazy(() => import('./components/CareerNetwork'));
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

const AlumniInformationSystem = lazy(() => import('./components/AlumniInformationSystem'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const AICareerWingman = lazy(() => import('./components/AICareerWingman'));
const BirlikAgiPortal = lazy(() => import('./components/BirlikAgiPortal'));
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
const ClubAdminPanel = lazy(() => import('./components/ClubAdminPanel'));
const StudentClubPortal = lazy(() => import('./components/StudentClubPortal'));
const RewardStore = lazy(() => import('./components/RewardStore'));
const BMICalculatorModal = lazy(() => import('./components/BMICalculatorModal'));

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
const AboutUsPage = lazy(() => import('./components/AboutUsPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const EventsPage = lazy(() => import('./components/EventsPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const ResearchOSHub = lazy(() => import('./components/ResearchOSHub'));
const KnowledgePortal = lazy(() => import('./components/KnowledgePortal'));
const BIDBSystemStatusCard = lazy(() => import('./components/BIDBSystemStatusCard'));
const BIDBHelpdeskModal = lazy(() => import('./components/BIDBHelpdeskModal'));
const KariyerJobBoard = lazy(() => import('./components/KariyerJobBoard'));
const SurveyPopupModal = lazy(() => import('./components/SurveyPopupModal'));
const GlobalSearchOverlay = lazy(() => import('./components/GlobalSearchOverlay'));

import { ToastContainer, toast } from './components/shared/Toast';
import NotificationEngine from './components/NotificationEngine';
import ErrorBoundary from './components/ErrorBoundary';
import { AlertCircle } from 'lucide-react';

window.toast = toast;

const AlumniAssocPortal = lazy(() => import('./components/AlumniAssocPortal'));
const KGMManagementConsole = lazy(() => import('./components/admin/KGMManagementConsole'));
const PublicUserProfile = lazy(() => import('./components/PublicUserProfile'));
const StudentKGBPanel = lazy(() => import('./components/StudentKGBPanel'));

const validViews = ['explore', 'contact', 'gizlilik', 'kullanim', 'kvkk', 'network', 'bmi_calculator', 'mezun_dernek', 'alumni_assoc_portal', 'knowledge_portal', 'reward_store', 'student_analytics', 'student_kgb', 'landing', 'leaderboard', 'live_rooms', 'mentor_match', 'virtual_fair', 'alumni_card', 'career_test', 'career_roadmap', 'startup_incubator', 'login', 'register', 'forgot_password', 'create_job', 'student', 'alumni', 'academic', 'company', 'admin', 'admin_cms', 'yonetim_konsolu', 'admin_console', 'organization', 'jobs', 'haberler', 'duyurular', 'etkinlikler', 'sem', 'staj', 'profile_update', 'mbs', 'user_profile', 'public_profile', 'groups', 'group_profile', 'notifications', 'calendar', 'applications', 'cvbuilder', 'messaging', 'interview_sim', 'birlik_agi', 'idari_portal', 'audit_logs', 'wallet', 'mentor_booking', 'smart_certs', 'company_ats', 'digital_portfolio', 'metaverse_library', 'hackathon_market', 'alumni_dao', 'campus_map', 'anka_chat', 'global_map', 'sksdb_lunch', 'bidb_status', 'bidb_helpdesk', 'kariyer_board', 'about_us', 'services', 'events_list', 'contact_us', 'research_hub', 'club_admin', 'club_portal', 'news', 'events', 'sksdb_clubs'];

function App() {
  const previousView = useAppStore(state => state.previousView);
  const setPreviousView = useAppStore(state => state.setPreviousView);
  const userRole = useAppStore(state => state.userRole);
  const setUserRole = useAppStore(state => state.setUserRole);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const setActivePortalBranch = useAppStore(state => state.setActivePortalBranch);
  const selectedUserId = useAppStore(state => state.selectedUserId);
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const selectedGroupId = useAppStore(state => state.selectedGroupId);
  const setSelectedGroupId = useAppStore(state => state.setSelectedGroupId);
  const logAction = useAppStore(state => state.logAction);
  const siteConfig = useAppStore(state => state.siteConfig);
  const maintenanceMode = siteConfig?.maintenanceMode ?? false;

  const setJobs = useAppStore(state => state.setJobs);
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const setNews = useAppStore(state => state.setNews);
  const setEvents = useAppStore(state => state.setEvents);
  const events = useAppStore(state => state.events);
  const setAnnouncements = useAppStore(state => state.setAnnouncements);

  const students = useAppStore(state => state.students);
  const setStudents = useAppStore(state => state.setStudents);
  const alumni = useAppStore(state => state.alumni);
  const setAlumni = useAppStore(state => state.setAlumni);
  const companies = useAppStore(state => state.companies);
  const setCompanies = useAppStore(state => state.setCompanies);
  const academicStaff = useAppStore(state => state.academicStaff);
  const setAcademicStaff = useAppStore(state => state.setAcademicStaff);
  const featureCareerFair = useAppStore(state => state.featureCareerFair);
  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);

  const groups = useAppStore(state => state.groups);
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const viewStr = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mock_user') || localStorage.getItem('igu_mock_user');
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
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null);
  const [isAuthStateResolved, setIsAuthStateResolved] = useState(false);

  // The store is hydrated asynchronously, while the signed-in profile is restored
  // immediately. A production admin must additionally match the Firebase session;
  // browser storage is never a sufficient authorization source.
  const effectiveUserRole = currentUser?.role || userRole || null;
  const standardUserRoleView = effectiveUserRole === 'company' || effectiveUserRole === 'employer'
    ? 'company'
    : effectiveUserRole === 'academic'
      ? 'academic'
      : effectiveUserRole === 'alumni'
        ? 'alumni'
        : 'student';
  const defaultUserRoleView = effectiveUserRole === 'admin' ? 'admin' : standardUserRoleView;
  const isAdmin = !import.meta.env.DEV
    ? (Boolean(authenticatedUserId && (currentUser?.role === 'admin' || userRole === 'admin')) || currentUser?.id === 'admin_1513')
    : Boolean(effectiveUserRole === 'admin' || currentUser?.role === 'admin' || currentUser?.id === 'admin_1513');
  const view = validViews.includes(viewStr) ? viewStr : viewStr.startsWith('inner_page_') ? viewStr : (currentUser ? defaultUserRoleView : 'landing');

  const setView = useCallback((v) => {
    const nextView = typeof v === 'function' ? v(view) : v;
    if (nextView !== view && view !== 'login' && view !== 'register') {
      setPreviousView(view);
    }
    if (logAction) {
      logAction(currentUser?.name || 'Ziyaretçi', `Sayfa Değiştirildi -> ${nextView.toUpperCase()}`, "Navigasyon");
    }
    const targetPath = nextView === 'landing' ? '/' : '/' + nextView;
    navigate(targetPath, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, navigate, setPreviousView, logAction, currentUser]);

  const [academicRole, setAcademicRole] = useState('standard_academic'); 
  const isPWA = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;

  // Restore a previously authenticated profile's role after Zustand rehydrates.
  // Crucially, the requested URL must never be used as an authorization source.
  useEffect(() => {
    if (!userRole && currentUser?.role) {
      setUserRole(currentUser.role);
    }
  }, [currentUser?.role, setUserRole, userRole]);

  // Branch Context Retention: Sync activePortalBranch only when on branch-defining view
  useEffect(() => {
    if (!view) return;
    if (['academic', 'research_hub', 'academic_onboarding'].includes(view)) {
      setActivePortalBranch('academic');
    } else if (['company', 'company_ats', 'create_job'].includes(view)) {
      setActivePortalBranch('company');
    } else if (['alumni', 'mezun_dernek', 'alumni_assoc_portal', 'alumni_card', 'alumni_dao'].includes(view)) {
      setActivePortalBranch('alumni');
    } else if (['admin', 'admin_cms', 'yonetim_konsolu', 'admin_console', 'audit_logs'].includes(view)) {
      setActivePortalBranch('admin');
    } else if (['student', 'feed', 'club_portal', 'student_analytics', 'digital_portfolio', 'virtual_fair', 'career_roadmap', 'startup_incubator', 'sem', 'staj', 'career_test'].includes(view)) {
      setActivePortalBranch('student');
    }
  }, [view, setActivePortalBranch]);

  // Handle PWA installation & user persistence & store sync
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('iesu_mock_user', JSON.stringify(currentUser));
      localStorage.setItem('igu_mock_user', JSON.stringify(currentUser));
      try {
        useAppStore.getState().setCurrentUser(currentUser);
      } catch (e) {}
    } else {
      localStorage.removeItem('iesu_mock_user');
      localStorage.removeItem('igu_mock_user');
      localStorage.removeItem('iesu_user_role_v1');
      localStorage.removeItem('igu_user_role_v1');
      try {
        useAppStore.getState().setCurrentUser(null);
      } catch (e) {}
    }
  }, [currentUser]);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleGlobalK = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalK);
    return () => window.removeEventListener('keydown', handleGlobalK);
  }, []);



  // Firebase Real User Hydration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthenticatedUserId(user?.uid || null);

      if (!user) {
        setIsAuthStateResolved(true);
        return;
      }

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
      } finally {
        setIsAuthStateResolved(true);
      }
    }, () => {
      setAuthenticatedUserId(null);
      setIsAuthStateResolved(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Flush old cached stores to ensure fresh Esenyurt live data is loaded
    try {
      localStorage.removeItem('igu-career-store');
      localStorage.removeItem('iesu-kariyer-storage-v10');
      localStorage.removeItem('iesu-kariyer-storage-v11');
    } catch (err) {
      console.warn("Storage flush:", err);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('iesu_likes_reset_v4') && !localStorage.getItem('igu_likes_reset_v4')) {
      setPosts(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setNews(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setEvents(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setAnnouncements(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setJobs(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      localStorage.setItem('iesu_likes_reset_v4', 'true');
      localStorage.setItem('igu_likes_reset_v4', 'true');
    }
  }, []);

  useEffect(() => {
    const publicViews = ['landing', 'login', 'register', 'forgot_password', 'haberler', 'duyurular', 'etkinlikler', 'about_us', 'services', 'events_list', 'contact_us', 'contact', 'sksdb_lunch', 'sksdb_clubs', 'bidb_status', 'bidb_helpdesk', 'kariyer_board', 'metaverse_library', 'digital_portfolio', 'hackathon_market', 'campus_map', 'global_map', 'research_hub', 'staj', 'sem', 'mentor_match', 'bmi_calculator', 'network', 'gizlilik', 'kullanim', 'kvkk'];
    const isInnerPage = view && view.startsWith('inner_page_');
    if (!isAuthStateResolved && !currentUser && !publicViews.includes(view) && !isInnerPage) {
      return;
    }

    if (!import.meta.env.DEV && (currentUser?.role === 'admin' || userRole === 'admin') && currentUser?.id !== 'admin_1513' && !authenticatedUserId) {
      setCurrentUser(null);
      setUserRole(null);
      localStorage.removeItem('igu_mock_user');
      localStorage.removeItem('iesu_mock_user');
      setView('login');
      return;
    }

    if (!currentUser && !publicViews.includes(view) && !isInnerPage) {
      setView('login');
    } else if (currentUser && ['admin', 'admin_cms', 'yonetim_konsolu', 'admin_console'].includes(view) && !isAdmin) {
      if (window.toast) window.toast.error("Bu sayfaya erişim yetkiniz yok.");
      setView(standardUserRoleView || 'landing');
    } else if (currentUser) {
      // Rol bazlı erişim kontrolü — hassas paneller
      const roleRequiredViews = {
        audit_logs: ['admin'],
        idari_portal: ['admin'],
        club_admin: ['admin', 'student', 'alumni'],
        academic: ['admin', 'academic_staff'],
        company: ['admin', 'company', 'employer'],
        company_ats: ['admin', 'company', 'employer'],
        create_job: ['admin', 'company', 'employer'],
        yonetim_konsolu: ['admin'],
        admin_console: ['admin'],
      };
      const requiredRoles = roleRequiredViews[view];
      if (requiredRoles && !isAdmin && !requiredRoles.includes(effectiveUserRole)) {
        if (window.toast) window.toast.error("Bu sayfaya erişim yetkiniz yok.");
        setView(standardUserRoleView || 'landing');
      }
    }
  }, [view, currentUser, effectiveUserRole, isAdmin, isAuthStateResolved, setUserRole, setView, standardUserRoleView]);

  useEffect(() => {
    document.body.style.overflow = '';
    document.body.classList.remove('overflow-hidden');
  }, [view]);

  // Auto-refresh scraped data on mount (only if stale > 1 hour)
  useEffect(() => {
    const lastUpdate = useAppStore.getState().lastUpdated;
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (!lastUpdate || new Date(lastUpdate).getTime() < oneHourAgo) {
      const { refreshScrapedData } = useAppStore.getState();
      if (typeof refreshScrapedData === 'function') {
        refreshScrapedData(false).catch(() => {});
      }
    }
  }, []);

  const liveStudents = useMemo(() => (students || []).filter(item => item.source !== 'demo_seed'), [students]);
  const liveAlumni = useMemo(() => (alumni || []).filter(item => item.source !== 'demo_seed'), [alumni]);
  const liveCompanies = useMemo(() => (companies || []).filter(item => item.source !== 'demo_seed'), [companies]);
  const liveAcademicStaff = useMemo(() => (academicStaff || []).filter(item => item.source !== 'demo_seed'), [academicStaff]);

  return (
    <ErrorBoundary>
      <ToastContainer />
      <NotificationEngine />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#f8f9fc]"><div className="w-12 h-12 border-4 border-iesu-blue border-t-transparent rounded-full animate-spin shadow-lg"></div></div>}>
        {/* Emergency Maintenance Mode Screen (Non-admin users blocked) */}
        {maintenanceMode && !isAdmin && view !== 'login' ? (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center z-50">
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-6 shadow-2xl animate-pulse">
              <span className="text-3xl">🛠️</span>
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Sistem Geçici Olarak Bakımda</h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi platformunda planlı bakım ve iyileştirme çalışmaları yürütülmektedir. Kısa süre içinde tekrar hizmetinizdeyiz.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('login')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/10"
              >
                Yönetici Girişi Yap
              </button>
            </div>
          </div>
        ) : (
          <>
            {Boolean(currentUser?.id && !['landing', 'login', 'register', 'forgot_password', 'messaging'].includes(view) && !view.startsWith('inner_page_')) && (
              <Suspense fallback={null}>
                <FloatingChatWidget setView={setView} currentUser={currentUser} currentView={view} activeBranch={activePortalBranch} />
              </Suspense>
            )}
            {view === 'landing' && (
              <LandingPage
                setView={setView}
                currentUser={currentUser}
                userRole={userRole}
                setUserRole={setUserRole}
              />
            )}
            {view.startsWith('inner_page_') && <DynamicContentPage contentId={view.replace('inner_page_', '')} setView={setView} previousView="landing" />}
            {view === 'login' && <Login setView={setView} setUserRole={setUserRole} setAcademicRole={setAcademicRole} setCurrentUser={setCurrentUser} students={liveStudents} alumni={liveAlumni} companies={liveCompanies} academicStaff={liveAcademicStaff} />}
            {view === 'register' && <Register setView={setView} setCurrentUser={setCurrentUser} setStudents={setStudents} setAlumni={setAlumni} setAcademicStaff={setAcademicStaff} setCompanies={setCompanies} setUserRole={setUserRole} />}
        {view === 'forgot_password' && <ForgotPassword setView={setView} />}
        {view === 'create_job' && <JobCreator setView={setView} currentUser={currentUser} />}
        {view === 'club_admin' && currentUser && <ClubAdminPanel currentUser={currentUser} setView={setView} userRole={userRole} />}
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
        {view === 'alumni_assoc_portal' && <AlumniAssocPortal setView={setView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />}
        {view === 'mezun_dernek' && <BirlikAgiPortal setView={setView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} setSelectedGroupId={setSelectedGroupId} academicRole={academicRole} />}
        {view === 'birlik_agi' && <BirlikAgiPortal setView={setView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} setSelectedGroupId={setSelectedGroupId} academicRole={academicRole} />}
        {view === 'admin' && isAdmin && (
          <AdminFeed
            setView={setView}
            currentUser={currentUser}
            setSelectedUserId={setSelectedUserId}
            userRole="admin"
            academicRole={academicRole === 'super_admin' ? 'super_admin' : 'standard_academic'}
            setSelectedGroupId={setSelectedGroupId}
          />
        )}
        {view === 'admin_cms' && isAdmin && (
          <AdminDashboard
            setView={setView}
            currentUser={currentUser}
            setSelectedUserId={setSelectedUserId}
            userRole="admin"
            academicRole={academicRole || 'super_admin'}
          />
        )}
        {(view === 'yonetim_konsolu' || view === 'admin_console') && isAdmin && (
          <KGMManagementConsole
            setView={setView}
            currentUser={currentUser}
            setSelectedUserId={setSelectedUserId}
            academicRole={academicRole || 'super_admin'}
          />
        )}
        {view === 'organization' && <OrganizationChart setView={setView} userRole={userRole} />}
        {view === 'jobs' && <JobsAndInternships setView={setView} previousView={previousView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} />}
        {view === 'sem' && <SemPanel setView={setView} userRole={userRole} />}
        {view === 'staj' && <StajPanel setView={setView} userRole={userRole} />}
        {view === 'reward_store' && (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto w-full max-h-screen custom-scrollbar relative pb-safe">
            <div className="absolute top-4 left-4 z-50">
              <button onClick={() => setView(previousView || (userRole === 'admin' ? 'admin' : 'student'))} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-200">
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
          setSelectedUserId={setSelectedUserId}
        />}
        {view === 'mbs' && <AlumniInformationSystem 
          setView={setView} 
          currentUser={currentUser} 
          userRole={userRole} 
          setSelectedUserId={setSelectedUserId}
        />}
        {(view === 'haberler' || view === 'duyurular' || view === 'etkinlikler' || view === 'events' || view === 'news') && (
          <PublicNewsView setView={setView} currentUser={currentUser} userRole={userRole} />
        )}
        {view === 'bmi_calculator' && (
          <div className="min-h-screen bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <BMICalculatorModal isOpen={true} onClose={() => setView(previousView || (userRole === 'admin' ? 'admin' : 'student'))} />
          </div>
        )}
        {view === 'network' && (
          <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-12">
            <CareerNetwork 
              companies={companies} 
              events={events} 
              academicStaff={academicStaff} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
            />
          </div>
        )}
        {view === 'user_profile' && <UserProfile 
          userId={selectedUserId || currentUser?.id} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          previousView={previousView}
          currentUser={currentUser}
          setDirectMessageUser={setSelectedUserId}
        />}
        {view === 'public_profile' && <PublicUserProfile 
          userId={selectedUserId} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          previousView={previousView}
          currentUser={currentUser}
          setDirectMessageUser={setSelectedUserId}
        />}
        {view === 'student_analytics' && <StudentAnalytics setView={setView} currentUser={currentUser} userRole={userRole} previousView={previousView} />}
        {view === 'student_kgb' && <StudentKGBPanel setView={setView} currentUser={currentUser} userRole={userRole} previousView={previousView} />}
        {view === 'group_profile' && <GroupProfile
                  groupId={selectedGroupId}
                  groupData={groups.find(g => g.id === selectedGroupId) || null}
                  currentUser={currentUser}
                  setView={setView}
                  userRole={userRole}
                  setSelectedUserId={setSelectedUserId}
                />}
                {view === 'groups' && <GroupsPanel setView={setView} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} setSelectedGroupId={setSelectedGroupId} />}
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
        {view === 'live_rooms' && (
          siteConfig?.featureToggles?.liveRooms !== false ? (
            <LiveRoomsPanel currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
          ) : (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Canlı Mülakat & Yayın Odaları Devre Dışı</h3>
              <p className="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed">Bu özellik sistem yöneticisi tarafından bakım veya güncelleme nedeniyle geçici olarak kapatılmıştır.</p>
              <button onClick={() => setView('landing')} className="px-5 py-2.5 bg-[#990000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition cursor-pointer">Ana Sayfaya Dön</button>
            </div>
          )
        )}
        {view === 'mentor_match' && <MentorMatch currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'virtual_fair' && (
          (siteConfig?.featureToggles?.virtualFair !== false && featureCareerFair !== false) ? (
            <VirtualCareerFair currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
          ) : (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Sanal Kariyer Fuarı Devre Dışı</h3>
              <p className="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed">Bu özellik sistem yöneticisi tarafından geçici olarak kapatılmıştır.</p>
              <button onClick={() => setView('landing')} className="px-5 py-2.5 bg-[#990000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition cursor-pointer">Ana Sayfaya Dön</button>
            </div>
          )
        )}
        {view === 'alumni_card' && (
          (siteConfig?.featureToggles?.alumniCard !== false && featureAlumniCard !== false) ? (
            <AlumniCardWallet currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
          ) : (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#990000] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Dijital Mezun Kartı Devre Dışı</h3>
              <p className="text-xs text-gray-500 max-w-sm mb-5 leading-relaxed">Bu özellik sistem yöneticisi tarafından geçici olarak kapatılmıştır.</p>
              <button onClick={() => setView('landing')} className="px-5 py-2.5 bg-[#990000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition cursor-pointer">Ana Sayfaya Dön</button>
            </div>
          )
        )}
        {view === 'career_test' && <CareerTest currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'career_roadmap' && <CareerRoadmap currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'startup_incubator' && <StartupIncubator currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'wallet' && <IesuWallet currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'mentor_booking' && <MentorBooking currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'smart_certs' && <SmartCertificates currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'explore' && (
          (isAdmin || userRole === 'admin' || effectiveUserRole === 'admin' || activePortalBranch === 'admin') ? (
            <AdminFeed
              setView={setView}
              currentUser={currentUser}
              setSelectedUserId={setSelectedUserId}
              userRole="admin"
              academicRole={academicRole === 'super_admin' ? 'super_admin' : 'standard_academic'}
              setSelectedGroupId={setSelectedGroupId}
              initialTab="search"
            />
          ) : (
            <div className="max-w-[1200px] mx-auto px-4 pt-24 pb-24">
              <ExploreFeed posts={posts} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} />
            </div>
          )
        )}
        
        {/* New Hub Views */}
        {view === 'idari_portal' && <IdariPortal setView={setView} previousView={previousView} />}
        {view === 'audit_logs' && <AuditLogsPanel setView={setView} previousView={previousView} />}
        
        {/* Extra Active View Pages */}
        {view === 'digital_portfolio' && <DigitalPortfolio currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'metaverse_library' && <MetaverseLibrary currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'hackathon_market' && <HackathonMarket currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'alumni_dao' && <AlumniDAO currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'campus_map' && <CampusMap currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'global_map' && <GlobalAlumniMap currentUser={currentUser} userRole={userRole || effectiveUserRole} setView={setView} setSelectedUserId={setSelectedUserId} previousView={previousView} />}
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
        {(view === 'contact_us' || view === 'contact') && <ContactPage currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'research_hub' && <ResearchOSHub currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
        {view === 'knowledge_portal' && <KnowledgePortal currentUser={currentUser} userRole={userRole} setView={setView} />}
        {view === 'gizlilik' && <DynamicContentPage contentId="gizlilik" setView={setView} previousView={previousView || "landing"} />}
        {view === 'kullanim' && <DynamicContentPage contentId="kullanim" setView={setView} previousView={previousView || "landing"} />}
        {view === 'kvkk' && <DynamicContentPage contentId="kvkk" setView={setView} previousView={previousView || "landing"} />}

        {/* Gen Z UX Features & Auto Popup Survey - Sadece giriş yapan kullanıcılara */}
        <Suspense fallback={null}>
          {currentUser && (
            <SurveyPopupModal 
              currentUser={currentUser} 
              userRole={userRole || effectiveUserRole} 
              currentView={view} 
              activePortalBranch={activePortalBranch} 
            />
          )}
          <PWAInstallPrompt />
          <CommandPalette 
            isOpen={isCommandPaletteOpen} 
            setIsOpen={setIsCommandPaletteOpen} 
            currentUser={currentUser} 
            setView={setView} 
          />
          <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setView={setView} />
        </Suspense>
          </>
        )}
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
