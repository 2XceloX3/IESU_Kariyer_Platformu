import React, { Suspense, lazy, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useAcademicStore from './store/useAcademicStore';
import useAppStore from '../../store/useAppStore';

const PORTAL_ROUTES = new Set([
  'student', 'alumni', 'company', 'academic', 'admin', 'admin_cms', 
  'yonetim_konsolu', 'admin_console', 'audit_logs', 'login', 'register', 
  'landing', 'forgot_password'
]);

// Lazy-loaded feed and subviews
const AcademicStaffFeed = lazy(() => import('../../components/AcademicStaffFeed'));
const ExploreFeed = lazy(() => import('../../components/ExploreFeed'));
const ResearchOSHub = lazy(() => import('../../components/ResearchOSHub'));
const JobsAndInternships = lazy(() => import('../../components/JobsAndInternships'));
const UserProfile = lazy(() => import('../../components/UserProfile'));
const PublicUserProfile = lazy(() => import('../../components/PublicUserProfile'));
const ProfileUpdate = lazy(() => import('../../components/ProfileUpdate'));
const NotificationsPanel = lazy(() => import('../../components/NotificationsPanel'));
const CalendarView = lazy(() => import('../../components/CalendarView'));
const MessagingInterface = lazy(() => import('../../components/MessagingInterface'));
const CareerNetwork = lazy(() => import('../../components/CareerNetwork'));
const GroupsPanel = lazy(() => import('../../components/GroupsPanel'));
const GroupProfile = lazy(() => import('../../components/GroupProfile'));
const ContactPage = lazy(() => import('../../components/ContactPage'));
const AboutUsPage = lazy(() => import('../../components/AboutUsPage'));
const ServicesPage = lazy(() => import('../../components/ServicesPage'));
const NewsEvents = lazy(() => import('../../components/NewsEvents'));
const EventsPage = lazy(() => import('../../components/EventsPage'));
const AcademicOnboarding = lazy(() => import('../../components/AcademicOnboarding'));
const DynamicContentPage = lazy(() => import('../../components/DynamicContentPage'));

/**
 * Academic Hive Root Component.
 * Owns internal navigation and theming for the academic staff portal.
 * Accepts currentUser and setView as props from App.jsx.
 */
export default function AcademicHive({ currentUser, setView }) {
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useAcademicStore((state) => state.activeView);
  const previousView = useAcademicStore((state) => state.previousView);
  const setActiveView = useAcademicStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const handleSetView = useCallback((v) => {
    if (typeof v === 'string') {
      const clean = v.replace(/^\//, '');
      if (PORTAL_ROUTES.has(clean) && clean !== 'academic') {
        const store = useAppStore.getState();
        if (['student', 'alumni', 'company'].includes(clean)) {
          store.setActivePortalBranch?.(clean);
        } else if (clean === 'admin' || clean === 'admin_cms' || clean === 'yonetim_konsolu') {
          store.setActivePortalBranch?.('admin');
        }
        setActiveView('feed');
        if (setView) setView(clean);
        else navigate(clean === 'landing' ? '/' : '/' + clean);
        return;
      }
      if (clean === 'user_profile') {
        const selfId = effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'self';
        setSelectedUserId(selfId);
        useAppStore.getState().setSelectedUserId?.(selfId);
      }
    }
    setActiveView(v);
  }, [setView, navigate, setActiveView, effectiveCurrentUser, setSelectedUserId]);

  const currentView = (pathView && pathView !== 'academic') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreFeed posts={posts} setView={handleSetView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'research_hub':
        return <ResearchOSHub setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" setSelectedUserId={setSelectedUserId} />;
      case 'jobs':
        return <JobsAndInternships setView={handleSetView} previousView={previousView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId || effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'self'} viewerHive="academic" setView={handleSetView} previousView={previousView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="academic" setView={handleSetView} previousView={previousView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'notifications':
        return <NotificationsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'calendar':
        return <CalendarView setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'messaging':
        return <MessagingInterface setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'network':
      case 'career_network':
        return <CareerNetwork setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" setSelectedUserId={setSelectedUserId} />;
      case 'groups':
        return <GroupsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'group_profile':
        return <GroupProfile setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'about_us':
        return <AboutUsPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'services':
        return <ServicesPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="academic" />;
      case 'academic_onboarding':
        return <AcademicOnboarding onComplete={() => handleSetView('feed')} currentUser={effectiveCurrentUser} />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={handleSetView} previousView="academic" />;
        }
        return (
          <AcademicStaffFeed
            setView={handleSetView}
            setSelectedUserId={setSelectedUserId}
            currentUser={effectiveCurrentUser}
            userRole="academic"
            academicRole="standard_academic"
            setSelectedGroupId={setSelectedGroupId}
          />
        );
    }
  };

  return (
    <HiveProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" /></div>}>
        {renderActiveView()}
      </Suspense>
    </HiveProvider>
  );
}
