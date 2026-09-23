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
const DynamicContentPage = lazy(() => import('../../components/DynamicContentPage'));

/**
 * Academic Hive Root Component.
 * Owns internal navigation and theming for the academic staff portal.
 * Accepts currentUser and setView as props from App.jsx.
 */
export default function AcademicHive({ currentUser, setView }) {
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
    }
    setActiveView(v);
  }, [setView, navigate, setActiveView]);

  const currentView = (pathView && pathView !== 'academic') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreFeed posts={posts} setView={handleSetView} currentUser={currentUser} />;
      case 'research_hub':
        return <ResearchOSHub setView={handleSetView} currentUser={currentUser} userRole="academic" setSelectedUserId={setSelectedUserId} />;
      case 'jobs':
        return <JobsAndInternships setView={handleSetView} previousView={previousView} currentUser={currentUser} userRole="academic" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId} viewerHive="academic" setView={handleSetView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="academic" setView={handleSetView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'notifications':
        return <NotificationsPanel setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'calendar':
        return <CalendarView setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'messaging':
        return <MessagingInterface setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'network':
        return <CareerNetwork setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'groups':
        return <GroupsPanel setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'group_profile':
        return <GroupProfile setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'about_us':
        return <AboutUsPage setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      case 'services':
        return <ServicesPage setView={handleSetView} currentUser={currentUser} userRole="academic" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={handleSetView} previousView="academic" />;
        }
        return (
          <AcademicStaffFeed
            setView={handleSetView}
            setSelectedUserId={setSelectedUserId}
            currentUser={currentUser}
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
