import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './utils/firebase';
import useAppStore from './store/useAppStore';
import { ToastContainer, toast } from './components/shared/Toast';
import NotificationEngine from './components/NotificationEngine';
import ErrorBoundary from './components/ErrorBoundary';
import { handleEDevletOAuthCallback } from './services/edevletGatewayService';
import { loadStaffAccounts } from './utils/staffAuth';

const LandingPage = lazy(() => import('./components/LandingPage')), Login = lazy(() => import('./components/Login')), Register = lazy(() => import('./components/Register')), ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const PublicNewsView = lazy(() => import('./components/PublicNewsView')), AdminFeed = lazy(() => import('./components/AdminFeed')), StaffPortal = lazy(() => import('./components/StaffPortal')), AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const StudentHive = lazy(() => import('./hives/student/StudentHive')), AlumniHive = lazy(() => import('./hives/alumni/AlumniHive')), CompanyHive = lazy(() => import('./hives/company/CompanyHive')), FloatingChatWidget = lazy(() => import('./components/FloatingChatWidget'));
const CommandPalette = lazy(() => import('./components/CommandPalette')), PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt')), SurveyPopupModal = lazy(() => import('./components/SurveyPopupModal')), GlobalSearchOverlay = lazy(() => import('./components/GlobalSearchOverlay'));
const UserProfile = lazy(() => import('./components/UserProfile')), PublicUserProfile = lazy(() => import('./components/PublicUserProfile')), JobsAndInternships = lazy(() => import('./components/JobsAndInternships'));
const NotificationsPanel = lazy(() => import('./components/NotificationsPanel')), CalendarView = lazy(() => import('./components/CalendarView')), MessagingInterface = lazy(() => import('./components/MessagingInterface'));
const ContactPage = lazy(() => import('./components/ContactPage')), ServicesPage = lazy(() => import('./components/ServicesPage'));
const AboutUsPage = lazy(() => import('./components/AboutUsPage')), EventsPage = lazy(() => import('./components/EventsPage'));
const DynamicContentPage = lazy(() => import('./components/DynamicContentPage'));
const GlobalAlumniMap = lazy(() => import('./components/GlobalAlumniMap'));
const ProfileUpdate = lazy(() => import('./components/ProfileUpdate'));
const JobCreator = lazy(() => import('./components/JobCreator'));

window.toast = toast;
const PUBLIC_NEWS = new Set(['haberler', 'duyurular', 'etkinlikler', 'news', 'events', 'events_list', 'etkinliklerimiz']);
const ADMIN_CMS = new Set([
  'admin_cms', 'yonetim_konsolu', 'admin_console', 'idari_portal',
  'overview', 'operasyon', 'mesajlar',
  'cms_students', 'cms_alumni', 'cms_companies', 'cms_mezun_dernek', 'cms_alumni_assoc', 'kart', 'user_types', 'cms_staff',
  'cms_ann', 'cms_news', 'etkinlik', 'cms_events', 'kariyer_gunleri', 'company_edu_requests',
  'ilan', 'basvuru_havuzu', 'gonullu', 'cms_corporate_partnerships', 'cms_jobs',
  'mentorluk', 'cms_mentorship_pool', 'cms_ssp', 'cms_career_counseling',
  'analytics', 'cms_datapool', 'anket', 'platform_ayarlari'
]);
const ALUMNI_ROUTES = new Set(['alumni', 'mbs', 'alumni_card', 'alumni_assoc_portal', 'mezun_dernek', 'birlik_agi', 'alumni_dao']), ACADEMIC_ROUTES = new Set(['academic', 'research_hub', 'academic_catalog', 'counseling_approvals', 'academic_onboarding']);
const STAFF_ROUTES = new Set(['staff', 'personel', 'personel_portali']);
const COMPANY_ROUTES = new Set(['company', 'company_ats', 'create_job', 'job_creator', 'post_job', 'post-job']);
const STUDENT_EXCLUSIVE_ROUTES = new Set([
  'student', 'feed', 'student_kgb', 'student_analytics', 'career_test', 
  'career_roadmap', 'startup_incubator', 'smart_certs', 'digital_portfolio', 
  'reward_store', 'metaverse_library', 'hackathon_market', 
  'sem', 'staj', 'anka_chat', 'skills', 'skill_tree', 'mentor_match', 'knowledge_portal', 'student_onboarding', 'onboarding', 'ats_scanner', 'ats_resume_scanner', 'ats_optimizer'
]);
const SHARED_ROUTES = new Set([
  'user_profile', 'public_profile', 'profile_update', 'messaging', 'notifications', 
  'calendar', 'groups', 'group_profile', 'network', 'career_network', 'live_rooms', 
  'mentor_booking', 'virtual_fair', 'wallet', 'campus_map', 'explore', 'leaderboard', 'global_map',
  'jobs', 'cvbuilder', 'interview_sim', 'applications', 'news', 'events', 'events_list', 'contact', 'contact_us', 'about_us', 'services', 'ats_scanner'
]);

const LEGAL_PAGE_ALIASES = {
  gizlilik: 'gizlilik',
  kvkk: 'kvkk',
  'aydinlatma-metni': 'kvkk',
  aydinlatma: 'kvkk',
  kullanim: 'kullanim',
  cerez: 'cerez',
  'cerez-politikasi': 'cerez',
  'cerez-politikası': 'cerez',
};
const resolveLegalContentId = (view) => LEGAL_PAGE_ALIASES[view] || null;



const NotFound = ({ setView, currentUser }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
      <span className="text-5xl">404</span>
    </div>
    <h1 className="text-2xl font-black text-slate-900">Sayfa Bulunamadı</h1>
    <p className="text-slate-500 text-center max-w-sm">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
    <button
      onClick={() => setView(currentUser ? (currentUser.role === 'admin' ? 'admin' : currentUser.role === 'staff' ? 'staff' : currentUser.role === 'student' ? 'student' : (currentUser.role === 'company' || currentUser.role === 'employer') ? 'company' : 'alumni') : 'landing')}
      className="bg-[#990000] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
    >
      Ana Sayfaya Dön
    </button>
  </div>
);


const Spinner = () => (<div className="flex items-center justify-center min-h-screen bg-[#f8f9fc]"><div className="w-12 h-12 border-4 border-[#990000] border-t-transparent rounded-full animate-spin shadow-lg" /></div>);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathView = location.pathname.split('/').filter(Boolean).pop() || '';

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
      const isRemembered = typeof window !== 'undefined' && localStorage.getItem('iesu_remember_me') === 'true';
      // Oturum Güvenliği (OWASP Session Management):
      // 1. Sekme/Oturum verisi (sessionStorage) aktif sekmedeki oturumu temsil eder.
      // 2. Kalıcı oturum (localStorage) yalnızca kullanıcı açıkça 'Beni Hatırla' işaretlediyse veya test modunda geçerlidir.
      // 3. Sıfırdan giriş yapıldığında (tarayıcı kapatılıp açıldığında) kullanıcı açık kalmaz.
      const savedSession = typeof window !== 'undefined' ? (sessionStorage.getItem('iesu_mock_user') || sessionStorage.getItem('iesu_user')) : null;
      const savedLocal = (isRemembered || isTest) && typeof window !== 'undefined'
        ? (localStorage.getItem('iesu_mock_user') || localStorage.getItem('iesu_user')) 
        : null;
      
      // Eski sahipsiz kalıntıları temizle (Beni Hatırla seçilmemişse localStorage'da açık oturum kalmamalı)
      if (!isRemembered && !isTest && typeof window !== 'undefined') {
        try {
          localStorage.removeItem('iesu_mock_user');
          localStorage.removeItem('iesu_user');
          localStorage.removeItem('iesu_user_role_v1');
          localStorage.removeItem('iesu_app_session_v1');
        } catch (_) {}
      }

      const saved = savedSession || savedLocal;
      let p = saved ? JSON.parse(saved) : null;
if (p && p.role !== 'admin') {
        localStorage.removeItem('iesu_admin_session');
        sessionStorage.removeItem('iesu_admin_session');
        localStorage.removeItem('iesu_coordinator_token');
        sessionStorage.removeItem('iesu_coordinator_token');
}

      const isProd = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.PROD);
      if (p && isProd && (p.role === 'admin' || p.role === 'super_admin' || p.isAdmin === true)) {
        const adminUser = import.meta.env.VITE_ADMIN_USER ? String(import.meta.env.VITE_ADMIN_USER).trim().toLowerCase() : 'kariyer';
        const adminPass = import.meta.env.VITE_ADMIN_PASS ? String(import.meta.env.VITE_ADMIN_PASS).trim() : 'Z.s.1513';
        const expectedToken = btoa(`${adminUser}:${adminPass}`);
        const sessToken = typeof window !== 'undefined' ? sessionStorage.getItem('iesu_coordinator_token') : null;
        const locToken = isRemembered && typeof window !== 'undefined' ? localStorage.getItem('iesu_coordinator_token') : null;
        const hasValidToken = sessToken === expectedToken || locToken === expectedToken;
        if (!hasValidToken) {
          p = { ...p, role: 'alumni', isAdmin: false, _pendingServerAuthVerify: true };
        }
      }
      if (p && !p.id) p.id = p.role === 'academic'
 ? 'ACAD-001' : p.role === 'student' ? 'STU-' + Date.now() : p.role === 'alumni' ? 'ALU-' + Date.now() : (p.role === 'employer' || p.sector) ? 'EMP-' + Date.now() : (p.role === 'admin' ? (p.uid || 'self') : 'self');
      return p;
    } catch { return null; }
  });
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null), [isAuthStateResolved, setIsAuthStateResolved] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false), [isSearchOpen, setIsSearchOpen] = useState(false);

  const userRole = useAppStore((state) => state.userRole);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const siteConfig = useAppStore((state) => state.siteConfig);
  const activePortalBranch = useAppStore((state) => state.activePortalBranch);
  const setActivePortalBranch = useAppStore((state) => state.setActivePortalBranch);
  const darkMode = useAppStore((state) => state.darkMode);
  const storeCurrentUser = useAppStore((state) => state.currentUser);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', Boolean(darkMode));
      document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    }
  }, [darkMode]);

  // Ana siteden (esenyurt.edu.tr) haber/duyuru/etkinlik aktarımı ve Firestore senkronizasyonu
  // yönetim paneli arayüzünü kalabalıklaştırmadan arka planda tamamen sessiz çalışır.
  useEffect(() => {
    const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
    if (isTest || typeof window === 'undefined') return undefined;
    let stopBgScraper = null;
    import('./services/backgroundScraperService').then(({ startBackgroundScraperService }) => {
      if (typeof startBackgroundScraperService === 'function') {
        stopBgScraper = startBackgroundScraperService({
          intervalMs: 15 * 60 * 1000,
          onUpdate: (data) => {
            if (!data) return;
            const st = useAppStore.getState();
            if (Array.isArray(data.news) && data.news.length > 0 && st.setNews) st.setNews(data.news);
            if (Array.isArray(data.announcements) && data.announcements.length > 0 && st.setAnnouncements) st.setAnnouncements(data.announcements);
            if (Array.isArray(data.events) && data.events.length > 0 && st.setEvents) st.setEvents(data.events);
          }
        });
      }
    }).catch(() => {});
    return () => {
      if (typeof stopBgScraper === 'function') stopBgScraper();
    };
  }, []);

  // Zustand store'daki currentUser null'a düştüğünde (logout) React local state'i de senkronize et.
  useEffect(() => {
    if (storeCurrentUser === null && currentUser !== null) {
      const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
      const isRemembered = typeof window !== 'undefined' && (localStorage.getItem('iesu_remember_me') === 'true' || isTest);
      const hasSession = typeof window !== 'undefined' && (sessionStorage.getItem('iesu_mock_user') || sessionStorage.getItem('iesu_user'));
      const hasValidLocal = isRemembered && typeof window !== 'undefined' && (localStorage.getItem('iesu_mock_user') || localStorage.getItem('iesu_user'));
      if (!hasSession && !hasValidLocal) {
        setCurrentUser(null);
      }
    } else if (storeCurrentUser && currentUser && storeCurrentUser.onboardingCompleted !== currentUser.onboardingCompleted) {
      setCurrentUser(storeCurrentUser);
    }
  }, [storeCurrentUser, currentUser]);
  const effectiveRole = currentUser?.role || userRole || null;
  const standardRoleHive = effectiveRole === 'student' ? 'student' : (effectiveRole === 'company' || effectiveRole === 'employer') ? 'company' : effectiveRole === 'staff' ? 'staff' : 'alumni';
  const verifyCoordinatorSession = useCallback(() => {
    try {
      const isVerifiedFirebaseAdmin = Boolean(
        (authenticatedUserId || auth?.currentUser) &&
        currentUser?.role === 'admin'
      );
      if (isVerifiedFirebaseAdmin) return true;

      // Authentic Coordinator verification
      const isAuthenticCoordinator = Boolean(
        (currentUser?.id === 'admin_1513' || currentUser?.name === 'Kariyer Geliştirme Koordinatörlüğü') &&
        (currentUser?.role === 'admin' || userRole === 'admin')
      );

      const isRemembered = typeof window !== 'undefined' && localStorage.getItem('iesu_remember_me') === 'true';
      const sessionToken = typeof window !== 'undefined' ? sessionStorage.getItem('iesu_coordinator_token') : null;
      const localToken = isRemembered && typeof window !== 'undefined' ? localStorage.getItem('iesu_coordinator_token') : null;
      const hasActiveAdminSession = typeof window !== 'undefined' && (
        sessionStorage.getItem('iesu_admin_session') === 'active' ||
        (isRemembered && localStorage.getItem('iesu_admin_session') === 'active')
      );
      
      const adminUser = import.meta.env.VITE_ADMIN_USER ? String(import.meta.env.VITE_ADMIN_USER).trim().toLowerCase() : 'kariyer';
      const adminPass = import.meta.env.VITE_ADMIN_PASS ? String(import.meta.env.VITE_ADMIN_PASS).trim() : 'Z.s.1513';
      const expected = btoa(`${adminUser}:${adminPass}`);

      if (sessionToken === expected || localToken === expected) return true;
      if (isAuthenticCoordinator && hasActiveAdminSession) return true;

      return false;
    } catch {
      return false;
    }
  }, [authenticatedUserId, currentUser, userRole]);

  const hasValidCoordinatorAuth = verifyCoordinatorSession();
  const isAdmin = Boolean(
    hasValidCoordinatorAuth &&
    (currentUser?.role === 'admin' || userRole === 'admin')
  );
  const isStaff = Boolean(
    !isAdmin &&
    (currentUser?.role === 'staff' || userRole === 'staff')
  );
  const currentBranch = isAdmin
    ? (activePortalBranch && ['admin', 'staff', 'student', 'alumni', 'company'].includes(activePortalBranch) ? activePortalBranch : 'admin')
    : (isStaff
      ? 'staff'
      : (['student', 'alumni', 'company', 'employer'].includes(effectiveRole)
        ? standardRoleHive
        : (activePortalBranch && ['student', 'alumni', 'company'].includes(activePortalBranch) ? activePortalBranch : 'alumni')));
  const loginInitialRole = STUDENT_EXCLUSIVE_ROUTES.has(pathView) ? 'student' : COMPANY_ROUTES.has(pathView) ? 'employer' : STAFF_ROUTES.has(pathView) ? 'staff' : 'alumni';

  const setView = useCallback((v) => {
    const raw = typeof v === 'function' ? v(pathView) : v;
    const clean = typeof raw === 'string' ? raw.replace(/^\//, '') : raw;
    if (clean === 'user_profile') {
      const s = useAppStore.getState();
      const selfId = currentUser?.id || currentUser?.uid || currentUser?.studentNo || 'self';
      s.setSelectedUserId?.(selfId);
    }
    navigate(clean === 'landing' || clean === '' ? '/' : '/' + clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate, pathView, currentUser]);

  useEffect(() => {
    const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
    const isRemembered = typeof window !== 'undefined' && (localStorage.getItem('iesu_remember_me') === 'true' || isTest);
    if (currentUser) {
      try {
        sessionStorage.setItem('iesu_mock_user', JSON.stringify(currentUser));
        if (isRemembered) {
          localStorage.setItem('iesu_mock_user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('iesu_mock_user');
        }
      } catch (_) {}
      try { useAppStore.getState().setCurrentUser(currentUser); } catch { /* store may not be ready */ }
      if (!userRole && currentUser.role) setUserRole(currentUser.role);
      const targetBranch = currentUser.role === 'admin' ? 'admin' : currentUser.role === 'staff' ? 'staff' : currentUser.role === 'student' ? 'student' : (currentUser.role === 'company' || currentUser.role === 'employer' ? 'company' : 'alumni');
      const currentStoredBranch = useAppStore.getState().activePortalBranch;
      // Süper Admin kasten başka bir portal dalına (alumni, student, company, staff) geçtiyse ezme!
      const keepSuperAdminBranch = currentUser.role === 'admin' && ['alumni', 'student', 'company', 'staff'].includes(currentStoredBranch);
      if (targetBranch && targetBranch !== 'undefined' && !keepSuperAdminBranch) {
        setActivePortalBranch?.(targetBranch);
      }
    } else {
      ['iesu_mock_user', 'iesu_user_role_v1', 'iesu_remember_me'].forEach(k => {
        try { sessionStorage.removeItem(k); } catch (_) {}
        try { localStorage.removeItem(k); } catch (_) {}
      });
      try { useAppStore.getState().setCurrentUser(null); } catch { /* store may not be ready */ }
    }
  }, [currentUser, userRole, setUserRole, setActivePortalBranch]);

  useEffect(() => {
    if (!pathView) return;
    if (COMPANY_ROUTES.has(pathView) && (['company', 'employer'].includes(effectiveRole) || ((isAdmin || isStaff) && !((activePortalBranch === 'admin' || activePortalBranch === 'staff') && (pathView === 'job_creator' || pathView === 'create_job' || pathView === 'post_job' || pathView === 'post-job'))))) setActivePortalBranch?.('company');
    else if (STUDENT_EXCLUSIVE_ROUTES.has(pathView) && (effectiveRole === 'student' || isAdmin || isStaff)) setActivePortalBranch?.('student');
    else if (ALUMNI_ROUTES.has(pathView) && (effectiveRole === 'alumni' || isAdmin || isStaff)) setActivePortalBranch?.('alumni');
    else if (STAFF_ROUTES.has(pathView) && (isStaff || isAdmin)) setActivePortalBranch?.('staff');
    else if ((ADMIN_CMS.has(pathView) || pathView === 'admin') && isAdmin) {
      const fromStaffCms = typeof window !== 'undefined' && sessionStorage.getItem('iesu_staff_cms_context') === '1' && pathView !== 'admin';
      setActivePortalBranch?.(fromStaffCms ? 'staff' : 'admin');
    }
    else if (ADMIN_CMS.has(pathView) && isStaff) setActivePortalBranch?.('staff');
  }, [pathView, setActivePortalBranch, isAdmin, isStaff, effectiveRole, activePortalBranch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isCallbackPath = location.pathname.includes('/auth/edevlet/callback') || pathView === 'callback';
    const params = new URLSearchParams(location.search || window.location.search || '');
    const code = params.get('code');
    const state = params.get('state');

    if (isCallbackPath && code) {
      handleEDevletOAuthCallback(code, state)
        .then((userProfile) => {
          const rawRole = userProfile?.role || 'alumni';
          const targetRole = rawRole === 'student' ? 'student' : (rawRole === 'company' || rawRole === 'employer') ? 'company' : rawRole === 'admin' ? 'admin' : 'alumni';
          setCurrentUser({ ...userProfile, role: targetRole });
          setUserRole(targetRole);
          setActivePortalBranch?.(targetRole);
          toast?.success?.(`Hoş geldiniz ${userProfile.name}, e-Devlet & YÖKSİS bilgileriniz otomatik aktarıldı.`);
          navigate('/' + targetRole, { replace: true });
        })
        .catch((err) => {
          toast?.error?.(err?.message || 'e-Devlet Kapısı doğrulaması tamamlanamadı.');
          navigate('/login', { replace: true });
        });
    }
  }, [location.pathname, location.search, pathView, navigate, setUserRole, setActivePortalBranch]);

  useEffect(() => {
    let isInitialBoot = true;
    if (!auth) {
      // Firebase Auth başlatılamadı (gizli mod / init hatası): session/storage tabanlı oturumu koru
      setIsAuthStateResolved(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthenticatedUserId(u?.uid || null);
      if (!u) { 
        setIsAuthStateResolved(true); 
        const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
        const isRemembered = typeof window !== 'undefined' && localStorage.getItem('iesu_remember_me') === 'true';
        const hasSession = typeof window !== 'undefined' && (sessionStorage.getItem('iesu_mock_user') || sessionStorage.getItem('iesu_user'));
        if (!hasSession && !isRemembered && !isTest) {
          setCurrentUser(null);
          setUserRole(null);
        }
        return; 
      }

      // Güvenlik Kontrolü: Yalnızca uygulamanın ilk açılış anında (initial boot)
      // eğer tarayıcı yeni bir sekmede sıfırdan açıldıysa ve kullanıcı 'Beni Hatırla' dememişse,
      // eski Firebase IndexedDB kalıntısı temizlenir.
      if (isInitialBoot) {
        isInitialBoot = false;
        const isTest = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test');
        const isRemembered = typeof window !== 'undefined' && localStorage.getItem('iesu_remember_me') === 'true';
        const hasSession = typeof window !== 'undefined' && (sessionStorage.getItem('iesu_mock_user') || sessionStorage.getItem('iesu_user'));
        if (!hasSession && !isRemembered && !isTest) {
          try { await signOut(auth); } catch (_) {}
          setCurrentUser(null);
          setUserRole(null);
          setAuthenticatedUserId(null);
          setIsAuthStateResolved(true);
          return;
        }
      }
      isInitialBoot = false;

      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) { const data = snap.data(); setCurrentUser({ id: u.uid, ...data }); if (data.role) setUserRole(data.role); }
        else { setCurrentUser(prev => prev || { id: u.uid, email: u.email, name: u.displayName || 'Kullanıcı' }); }
      } catch (e) { console.error('Auth sync error:', e); } finally { setIsAuthStateResolved(true); }
    }, () => { setAuthenticatedUserId(null); setIsAuthStateResolved(true); });
    return () => unsub();
  }, [setUserRole]);

  useEffect(() => {
    if (!isAuthStateResolved) return;
    // Forged admin removal: if role is admin but has NO valid coordinator auth and NO firebase admin
    if (
      (currentUser?.role === 'admin' || userRole === 'admin') &&
      !authenticatedUserId &&
      !(auth?.currentUser) &&
      !hasValidCoordinatorAuth
    ) {
      setCurrentUser(null);
      setUserRole(null);
      localStorage.removeItem('iesu_mock_user');
      localStorage.removeItem('iesu_coordinator_token');
      localStorage.removeItem('iesu_user_role_v1');
      localStorage.removeItem('iesu_admin_session');
      try { sessionStorage.removeItem('iesu_mock_user'); } catch (_) {}
      try { sessionStorage.removeItem('iesu_coordinator_token'); } catch (_) {}
      try { sessionStorage.removeItem('iesu_admin_session'); } catch (_) {}
      try { sessionStorage.removeItem('iesu_user_role_v1'); } catch (_) {}
      setView('login');
      return;
    }

    // Forged or suspended staff guard: verify local staff sessions against active staff registry
    if (
      (currentUser?.role === 'staff' || userRole === 'staff') &&
      !authenticatedUserId &&
      !(auth?.currentUser)
    ) {
      const staffAccounts = loadStaffAccounts();
      const matchedActiveStaff = staffAccounts.find(acc =>
        acc.status === 'Aktif' &&
        String(acc.typeId) !== '1' &&
        (
          (currentUser?.staffAccountId && String(acc.id) === String(currentUser.staffAccountId)) ||
          (currentUser?.id && (`STAFF-${acc.id}` === String(currentUser.id) || String(acc.id) === String(currentUser.id))) ||
          (currentUser?.username && acc.username && acc.username.toLowerCase() === String(currentUser.username).toLowerCase()) ||
          (currentUser?.email && acc.email && acc.email.toLowerCase() === String(currentUser.email).toLowerCase())
        )
      );
      if (!matchedActiveStaff) {
        setCurrentUser(null);
        setUserRole(null);
        localStorage.removeItem('iesu_mock_user');
        localStorage.removeItem('iesu_user_role_v1');
        try { sessionStorage.removeItem('iesu_mock_user'); } catch (_) {}
        try { sessionStorage.removeItem('iesu_user_role_v1'); } catch (_) {}
        setView('login');
      }
    }
  }, [isAuthStateResolved, currentUser, userRole, authenticatedUserId, hasValidCoordinatorAuth, setView, setUserRole]);

  const renderHive = () => {
    const s = useAppStore.getState();

    // 1. Doğrudan CMS Panelleri (Süper Yönetici: tam yetki | Çalışan Personel: RBAC sınırlı yetki)
    const isCmsRoute = ADMIN_CMS.has(pathView) || pathView.startsWith('cms_');
    if (isCmsRoute) {
      return (isAdmin || isStaff) ? (
        <AdminDashboard 
          initialTab={pathView === 'admin_cms' || pathView === 'yonetim_konsolu' || pathView === 'admin_console' || pathView === 'audit_logs' || pathView === 'idari_portal' ? undefined : pathView} 
          setView={setView} 
          currentUser={currentUser} 
          setSelectedUserId={s.setSelectedUserId} 
          userRole={isAdmin ? 'admin' : 'staff'} 
          academicRole={isAdmin ? 'super_admin' : 'staff'} 
        />
      ) : (
        <Login setView={setView} setUserRole={setUserRole} setAcademicRole={() => {}} setCurrentUser={setCurrentUser} students={s.students} alumni={s.alumni} companies={s.companies} academicStaff={s.academicStaff} initialRole={loginInitialRole} />
      );
    }

    // Positive whitelist fallback: render user's dedicated home portal hive when unauthorized
    // Aktif portallar: Öğrenci (Kulüpler hariç, Staj & Ulusal Staj), Mezun, Firma, Personel ve Süper Yönetici.
    // Akademik portal ve Kulüpler portalı kapalıdır.
    const renderHomeHiveForRole = () => {
      if (isAdmin) return <AdminFeed setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole="admin" academicRole="super_admin" setSelectedGroupId={s.setSelectedGroupId} />;
      if (isStaff) return <StaffPortal setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole="staff" academicRole="staff" />;
      if (effectiveRole === 'student') return <StudentHive currentUser={currentUser} setView={setView} />;
      if (effectiveRole === 'company' || effectiveRole === 'employer') return <CompanyHive currentUser={currentUser} setView={setView} />;
      return <AlumniHive currentUser={currentUser} setView={setView} />;
    };

    // Yasal & kurumsal bilgilendirme sayfaları (KVKK, Gizlilik, Kullanım Koşulları, Çerez) tüm oturumlarda erişilebilir
    const legalContentId = resolveLegalContentId(pathView);
    if (legalContentId) {
      const prevBranch = isAdmin ? 'admin' : isStaff ? 'staff' : (effectiveRole === 'student' ? 'student' : (effectiveRole === 'company' || effectiveRole === 'employer' ? 'company' : 'alumni'));
      return <DynamicContentPage contentId={legalContentId} setView={setView} previousView={prevBranch} currentUser={currentUser} userRole={effectiveRole} />;
    }

    // Kulüpler portalı kesin olarak kapatıldı
    if (pathView === 'clubs' || pathView === 'club_portal' || pathView === 'club_admin' || pathView === 'sksdb_clubs' || pathView === 'clubs_directory') {
      return renderHomeHiveForRole();
    }

    // 2. Küresel Mezun Haritası (Yalnızca Mezun, Firma ve Süper Yönetici — Öğrenci ve Personel rolüne kapalı)
    if (pathView === 'global_map' || pathView === 'alumni_map') {
      if ((effectiveRole === 'student' || isStaff) && !isAdmin) {
        return renderHomeHiveForRole();
      }
      return (
        <GlobalAlumniMap 
          setView={setView} 
          currentUser={currentUser} 
          userRole={isAdmin ? 'admin' : effectiveRole} 
          setSelectedUserId={s.setSelectedUserId} 
          previousView={currentBranch || (isAdmin ? 'admin' : 'alumni')} 
          onBack={() => setView(currentBranch || (isAdmin ? 'admin' : 'alumni'))} 
        />
      );
    }

    // Dedicated branch routes with positive whitelist gating
    // Öğrenci, Mezun ve Firma portallarına geçiş YALNIZCA kendi rolü veya Süper Yönetici (isAdmin) için açıktır; Personel kendi çalışma portalında kalır.
    if (pathView === 'admin') return isAdmin ? <AdminFeed setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole="admin" academicRole="super_admin" setSelectedGroupId={s.setSelectedGroupId} /> : renderHomeHiveForRole();
    if (STAFF_ROUTES.has(pathView)) return (isStaff || isAdmin) ? <StaffPortal setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole={isStaff ? 'staff' : 'admin'} academicRole={isStaff ? 'staff' : 'super_admin'} /> : renderHomeHiveForRole();
    if (STUDENT_EXCLUSIVE_ROUTES.has(pathView)) return (effectiveRole === 'student' || isAdmin) ? <StudentHive currentUser={currentUser} setView={setView} /> : renderHomeHiveForRole();
    if (ALUMNI_ROUTES.has(pathView)) return (effectiveRole === 'alumni' || isAdmin) ? <AlumniHive currentUser={currentUser} setView={setView} /> : renderHomeHiveForRole();
    if (COMPANY_ROUTES.has(pathView) && !((currentBranch === 'admin' || currentBranch === 'staff') && (isAdmin || isStaff) && (pathView === 'job_creator' || pathView === 'create_job' || pathView === 'post_job' || pathView === 'post-job'))) return (effectiveRole === 'company' || effectiveRole === 'employer' || isAdmin) ? <CompanyHive currentUser={currentUser} setView={setView} /> : renderHomeHiveForRole();
    // Kapatılan Akademik rotaları aktif ana portala yönlendirilir
    if (ACADEMIC_ROUTES.has(pathView)) return renderHomeHiveForRole();

    // Admin & Staff branch handling for shared / other views
    if ((currentBranch === 'admin' && isAdmin) || (currentBranch === 'staff' && (isStaff || isAdmin))) {
      const isStaffMode = Boolean((isStaff && !isAdmin) || currentBranch === 'staff');
      const workspaceRole = isStaffMode ? 'staff' : 'admin';
      const workspacePrev = isStaffMode ? 'staff' : 'admin';
      if (pathView === 'job_creator' || pathView === 'create_job' || pathView === 'post_job' || pathView === 'post-job') return <JobCreator setView={setView} currentUser={currentUser} userRole={workspaceRole} />;
      if (pathView === 'profile_update') return <ProfileUpdate setView={setView} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'jobs') return <JobsAndInternships setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} />;
      if (pathView === 'user_profile') {
        const ownId = currentUser?.role === 'admin' ? 'admin_1513' : (currentUser?.id || currentUser?.uid || 'self');
        return <UserProfile userId={ownId} viewerHive={workspacePrev} setView={setView} previousView={workspacePrev} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} />;
      }
      if (pathView === 'public_profile') return <PublicUserProfile userId={s.selectedUserId} viewerHive={workspacePrev} setView={setView} previousView={workspacePrev} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'notifications') return <NotificationsPanel setView={setView} previousView={workspacePrev} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole={workspaceRole} />;
      if (pathView === 'calendar') return <CalendarView setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'messaging') return <MessagingInterface setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} selectedGroupId={s.selectedGroupId} setSelectedGroupId={s.setSelectedGroupId} />;
      if (pathView === 'contact' || pathView === 'contact_us') return <ContactPage setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'about_us') return <AboutUsPage setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'services') return <ServicesPage setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'events_list' || pathView === 'events' || pathView === 'etkinlikler') return <EventsPage setView={setView} previousView={workspacePrev} currentUser={currentUser} userRole={workspaceRole} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'explore') return isStaffMode
        ? <StaffPortal setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole={workspaceRole} academicRole="staff" />
        : <AdminFeed portalMode="admin" initialTab="search" setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole={workspaceRole} academicRole="super_admin" setSelectedGroupId={s.setSelectedGroupId} />;
      const BENTO_MODULES = new Set([
        'cvbuilder', 'network', 'career_network', 'groups', 'group_profile', 'virtual_fair', 'virtual_career_fair',
        'wallet', 'campus_map', 'live_rooms', 'mentor_booking'
      ]);
      if (BENTO_MODULES.has(pathView) && isAdmin) return <AlumniHive currentUser={currentUser} setView={setView} />;
      return isStaffMode
        ? <StaffPortal setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole={workspaceRole} academicRole="staff" />
        : <AdminFeed portalMode="admin" setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole={workspaceRole} academicRole="super_admin" setSelectedGroupId={s.setSelectedGroupId} />;
    }

    // Active hive branch continuity for all shared routes (messaging, user_profile, public_profile, calendar, groups, etc.)
    if (currentBranch === 'student') return <StudentHive currentUser={currentUser} setView={setView} />;
    if (currentBranch === 'company') return <CompanyHive currentUser={currentUser} setView={setView} />;
    return <AlumniHive currentUser={currentUser} setView={setView} />;
  };

  const store = useAppStore.getState();
  return (
    <ErrorBoundary>
      <ToastContainer /><NotificationEngine />
      <Suspense fallback={<Spinner />}>
        {siteConfig?.maintenanceMode && !isAdmin && pathView !== 'login' ? (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center z-50">
            <h1 className="text-3xl font-black mb-2">Sistem Geçici Olarak Bakımda</h1>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">İESÜ Kariyer Platformu planlı bakım çalışmasındadır.</p>
            <button onClick={() => setView('login')} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">Yönetici Girişi</button>
          </div>
        ) : !currentUser ? (
          (pathView === 'contact' || pathView === 'contact_us') ? <ContactPage setView={setView} currentUser={null} userRole={null} />
          : (pathView === 'about_us') ? <AboutUsPage setView={setView} currentUser={null} userRole={null} />
          : (pathView === 'services') ? <ServicesPage setView={setView} currentUser={null} userRole={null} />
          : (pathView === 'events_list' || pathView === 'etkinliklerimiz') ? <EventsPage setView={setView} currentUser={null} userRole={null} />
          : (pathView === 'register') ? <Register setView={setView} setCurrentUser={setCurrentUser} setStudents={store.setStudents} setAlumni={store.setAlumni} setAcademicStaff={store.setAcademicStaff} setCompanies={store.setCompanies} setUserRole={setUserRole} />
          : (pathView === 'forgot_password') ? <ForgotPassword setView={setView} />
          : (pathView === 'jobs') ? <JobsAndInternships setView={setView} currentUser={null} userRole={null} />
          : PUBLIC_NEWS.has(pathView) ? <PublicNewsView setView={setView} currentUser={null} userRole={null} />
          : (pathView === '' || pathView === 'landing') ? <LandingPage setView={setView} currentUser={null} userRole={userRole} setUserRole={setUserRole} />
          : resolveLegalContentId(pathView) ? <DynamicContentPage contentId={resolveLegalContentId(pathView)} setView={setView} previousView="landing" currentUser={null} userRole={null} />
          : <Login setView={setView} setUserRole={setUserRole} setAcademicRole={store.setAcademicRole || (() => {})} setCurrentUser={setCurrentUser} students={store.students} alumni={store.alumni} companies={store.companies} academicStaff={store.academicStaff} initialRole={loginInitialRole} />
        ) : (
          (pathView === 'landing') ? (
            <LandingPage setView={setView} currentUser={currentUser} userRole={userRole} setUserRole={setUserRole} />
          ) : (
            <>
              <Suspense fallback={null}><FloatingChatWidget setView={setView} currentUser={currentUser} currentView={pathView} activeBranch={currentBranch} /></Suspense>
              {renderHive()}
              <Suspense fallback={null}>
                <SurveyPopupModal currentUser={currentUser} userRole={effectiveRole} currentView={pathView} activePortalBranch={currentBranch} />
                <PWAInstallPrompt /><CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} currentUser={currentUser} setView={setView} />
                <GlobalSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} setView={setView} />
              </Suspense>
            </>
          )
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
