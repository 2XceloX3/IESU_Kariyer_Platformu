import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './utils/firebase';
import useAppStore from './store/useAppStore';
import { ToastContainer, toast } from './components/shared/Toast';
import NotificationEngine from './components/NotificationEngine';
import ErrorBoundary from './components/ErrorBoundary';

const LandingPage = lazy(() => import('./components/LandingPage')), Login = lazy(() => import('./components/Login')), Register = lazy(() => import('./components/Register')), ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const PublicNewsView = lazy(() => import('./components/PublicNewsView')), AdminFeed = lazy(() => import('./components/AdminFeed')), AdminDashboard = lazy(() => import('./components/AdminDashboard')), StudentHive = lazy(() => import('./hives/student/StudentHive'));
const AlumniHive = lazy(() => import('./hives/alumni/AlumniHive')), CompanyHive = lazy(() => import('./hives/company/CompanyHive')), AcademicHive = lazy(() => import('./hives/academic/AcademicHive')), FloatingChatWidget = lazy(() => import('./components/FloatingChatWidget'));
const CommandPalette = lazy(() => import('./components/CommandPalette')), PWAInstallPrompt = lazy(() => import('./components/PWAInstallPrompt')), SurveyPopupModal = lazy(() => import('./components/SurveyPopupModal')), GlobalSearchOverlay = lazy(() => import('./components/GlobalSearchOverlay'));
const UserProfile = lazy(() => import('./components/UserProfile')), PublicUserProfile = lazy(() => import('./components/PublicUserProfile')), JobsAndInternships = lazy(() => import('./components/JobsAndInternships'));

window.toast = toast;
const PUBLIC_NEWS = new Set(['haberler', 'duyurular', 'etkinlikler', 'news', 'events']), ADMIN_CMS = new Set(['admin_cms', 'yonetim_konsolu', 'admin_console', 'audit_logs', 'idari_portal']);
const ALUMNI_ROUTES = new Set(['alumni', 'mbs', 'alumni_card', 'alumni_assoc_portal', 'mezun_dernek', 'birlik_agi', 'alumni_dao', 'global_map']), ACADEMIC_ROUTES = new Set(['academic', 'research_hub', 'academic_catalog', 'counseling_approvals', 'academic_onboarding']);
const COMPANY_ROUTES = new Set(['company', 'company_ats', 'create_job']), STUDENT_ROUTES = new Set(['student', 'feed', 'student_kgb', 'student_analytics', 'cvbuilder', 'interview_sim', 'career_test', 'career_roadmap', 'startup_incubator', 'applications', 'smart_certs', 'digital_portfolio', 'reward_store', 'metaverse_library', 'hackathon_market', 'club_portal', 'club_admin', 'sem', 'staj', 'explore', 'network', 'groups', 'group_profile', 'notifications', 'calendar', 'messaging', 'leaderboard', 'live_rooms', 'mentor_match', 'mentor_booking', 'virtual_fair', 'wallet', 'campus_map', 'anka_chat', 'skills', 'skill_tree', 'profile_update', 'user_profile', 'public_profile', 'knowledge_portal']);

const Spinner = () => (<div className="flex items-center justify-center min-h-screen bg-[#f8f9fc]"><div className="w-12 h-12 border-4 border-[#990000] border-t-transparent rounded-full animate-spin shadow-lg" /></div>);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathView = location.pathname.split('/').filter(Boolean).pop() || '';

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mock_user') || localStorage.getItem('igu_mock_user');
      const p = saved ? JSON.parse(saved) : null;
      if (p && !p.id) p.id = p.role === 'academic' ? 'ACAD-001' : p.role === 'student' ? 'STU-' + Date.now() : p.role === 'alumni' ? 'ALU-' + Date.now() : (p.role === 'employer' || p.sector) ? 'EMP-' + Date.now() : 'admin_1513';
      return p;
    } catch { return null; }
  });
  const [authenticatedUserId, setAuthenticatedUserId] = useState(null), [isAuthStateResolved, setIsAuthStateResolved] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false), [isSearchOpen, setIsSearchOpen] = useState(false);

  const { userRole, setUserRole, siteConfig, activePortalBranch, setActivePortalBranch } = useAppStore();
  const effectiveRole = currentUser?.role || userRole || null;
  const standardRoleHive = effectiveRole === 'company' || effectiveRole === 'employer' ? 'company' : effectiveRole === 'academic' ? 'academic' : effectiveRole === 'alumni' ? 'alumni' : 'student';
  const isAdmin = !import.meta.env.DEV ? (Boolean(authenticatedUserId && (currentUser?.role === 'admin' || userRole === 'admin')) || currentUser?.id === 'admin_1513') : Boolean(effectiveRole === 'admin' || currentUser?.role === 'admin' || currentUser?.id === 'admin_1513');
  const currentBranch = isAdmin ? (activePortalBranch || 'admin') : (['student', 'alumni', 'academic', 'company', 'employer'].includes(effectiveRole) ? standardRoleHive : (activePortalBranch || 'student'));

  const setView = useCallback((v) => {
    const raw = typeof v === 'function' ? v(pathView) : v;
    const clean = typeof raw === 'string' ? raw.replace(/^\//, '') : raw;
    navigate(clean === 'landing' || clean === '' ? '/' : '/' + clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate, pathView]);

  useEffect(() => {
    if (currentUser) {
      ['iesu_mock_user', 'igu_mock_user'].forEach(k => localStorage.setItem(k, JSON.stringify(currentUser)));
      try { useAppStore.getState().setCurrentUser(currentUser); } catch {}
      if (!userRole && currentUser.role) setUserRole(currentUser.role);
      if (currentUser.role !== 'admin') setActivePortalBranch?.(currentUser.role === 'company' || currentUser.role === 'employer' ? 'company' : currentUser.role);
    } else {
      ['iesu_mock_user', 'igu_mock_user', 'iesu_user_role_v1', 'igu_user_role_v1'].forEach(k => localStorage.removeItem(k));
      try { useAppStore.getState().setCurrentUser(null); } catch {}
    }
  }, [currentUser, userRole, setUserRole, setActivePortalBranch]);

  useEffect(() => {
    if (!pathView) return;
    if (ACADEMIC_ROUTES.has(pathView)) setActivePortalBranch?.('academic');
    else if (COMPANY_ROUTES.has(pathView)) setActivePortalBranch?.('company');
    else if (ALUMNI_ROUTES.has(pathView)) setActivePortalBranch?.('alumni');
    else if ((ADMIN_CMS.has(pathView) || pathView === 'admin') && isAdmin) setActivePortalBranch?.('admin');
    else if (STUDENT_ROUTES.has(pathView) && !isAdmin) setActivePortalBranch?.('student');
  }, [pathView, setActivePortalBranch, isAdmin]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setAuthenticatedUserId(u?.uid || null);
      if (!u) { setIsAuthStateResolved(true); return; }
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) { const data = snap.data(); setCurrentUser({ id: u.uid, ...data }); if (data.role) setUserRole(data.role); }
        else { setCurrentUser(prev => prev || { id: u.uid, email: u.email, name: u.displayName || 'Kullanıcı' }); }
      } catch (e) { console.error('Auth sync error:', e); } finally { setIsAuthStateResolved(true); }
    }, () => { setAuthenticatedUserId(null); setIsAuthStateResolved(true); });
    return () => unsub();
  }, [setUserRole]);

  useEffect(() => {
    if (!isAuthStateResolved && !currentUser) return;
    if (!import.meta.env.DEV && (currentUser?.role === 'admin' || userRole === 'admin') && currentUser?.id !== 'admin_1513' && !authenticatedUserId) {
      setCurrentUser(null); setUserRole(null);
      ['igu_mock_user', 'iesu_mock_user'].forEach(k => localStorage.removeItem(k));
      setView('login');
    }
  }, [isAuthStateResolved, currentUser, userRole, authenticatedUserId, setView, setUserRole]);

  const renderHive = () => {
    const s = useAppStore.getState();
    if (ADMIN_CMS.has(pathView)) return isAdmin ? <AdminDashboard setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole="admin" academicRole="super_admin" /> : <Login setView={setView} setUserRole={setUserRole} setAcademicRole={() => {}} setCurrentUser={setCurrentUser} students={s.students} alumni={s.alumni} companies={s.companies} academicStaff={s.academicStaff} />;
    if (currentBranch === 'admin' && isAdmin) {
      if (pathView === 'jobs') return <JobsAndInternships setView={setView} previousView="admin" currentUser={currentUser} userRole="admin" />;
      if (pathView === 'user_profile') return <UserProfile userId={s.selectedUserId || currentUser?.id} viewerHive="admin" setView={setView} previousView="admin" currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} />;
      if (pathView === 'public_profile') return <PublicUserProfile userId={s.selectedUserId} viewerHive="admin" setView={setView} previousView="admin" currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} />;
      const BENTO_MODULES = new Set(['cvbuilder', 'interview_sim', 'career_test', 'career_roadmap', 'startup_incubator', 'club_portal', 'sem', 'applications']);
      if (BENTO_MODULES.has(pathView)) return <StudentHive currentUser={currentUser} setView={setView} />;
      return <AdminFeed setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole="admin" academicRole="super_admin" setSelectedGroupId={s.setSelectedGroupId} />;
    }
    if (pathView === 'admin') return isAdmin ? <AdminFeed setView={setView} currentUser={currentUser} setSelectedUserId={s.setSelectedUserId} userRole="admin" academicRole="super_admin" setSelectedGroupId={s.setSelectedGroupId} /> : <StudentHive currentUser={currentUser} setView={setView} />;
    if (ALUMNI_ROUTES.has(pathView)) return <AlumniHive currentUser={currentUser} setView={setView} />;
    if (STUDENT_ROUTES.has(pathView)) return <StudentHive currentUser={currentUser} setView={setView} />;
    if (ACADEMIC_ROUTES.has(pathView)) return <AcademicHive currentUser={currentUser} setView={setView} />;
    if (COMPANY_ROUTES.has(pathView)) return <CompanyHive currentUser={currentUser} setView={setView} />;
    if (currentBranch === 'alumni') return <AlumniHive currentUser={currentUser} setView={setView} />;
    if (currentBranch === 'company') return <CompanyHive currentUser={currentUser} setView={setView} />;
    if (currentBranch === 'academic') return <AcademicHive currentUser={currentUser} setView={setView} />;
    return <StudentHive currentUser={currentUser} setView={setView} />;
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
          PUBLIC_NEWS.has(pathView) ? <PublicNewsView setView={setView} currentUser={null} userRole={null} />
          : (pathView === 'login' || ADMIN_CMS.has(pathView)) ? <Login setView={setView} setUserRole={setUserRole} setAcademicRole={() => {}} setCurrentUser={setCurrentUser} students={store.students} alumni={store.alumni} companies={store.companies} academicStaff={store.academicStaff} />
          : pathView === 'register' ? <Register setView={setView} setCurrentUser={setCurrentUser} setStudents={store.setStudents} setAlumni={store.setAlumni} setAcademicStaff={store.setAcademicStaff} setCompanies={store.setCompanies} setUserRole={setUserRole} />
          : pathView === 'forgot_password' ? <ForgotPassword setView={setView} />
          : <LandingPage setView={setView} currentUser={null} userRole={userRole} setUserRole={setUserRole} />
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
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
