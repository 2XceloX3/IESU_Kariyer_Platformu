import React, { Suspense, lazy, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useCompanyStore from './store/useCompanyStore';
import useAppStore from '../../store/useAppStore';

const PORTAL_ROUTES = new Set([
  'student', 'alumni', 'company', 'academic', 'admin', 'admin_cms', 
  'yonetim_konsolu', 'admin_console', 'audit_logs', 'login', 'register', 
  'landing', 'forgot_password'
]);

// Lazy-loaded feed and subviews
const CompanyFeed = lazy(() => import('../../components/CompanyFeed'));
const ExploreFeed = lazy(() => import('../../components/ExploreFeed'));
const CompanyATSBoard = lazy(() => import('../../components/CompanyATSBoard'));
const JobCreator = lazy(() => import('../../components/JobCreator'));
const JobsAndInternships = lazy(() => import('../../components/JobsAndInternships'));
const UserProfile = lazy(() => import('../../components/UserProfile'));
const PublicUserProfile = lazy(() => import('../../components/PublicUserProfile'));
const ProfileUpdate = lazy(() => import('../../components/ProfileUpdate'));
const ApplicationsPanel = lazy(() => import('../../components/ApplicationsPanel'));
const VirtualCareerFair = lazy(() => import('../../components/VirtualCareerFair'));
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
 * Company Hive Root Component.
 * Owns internal navigation and theming for the company/employer portal.
 * Accepts currentUser and setView as props from App.jsx.
 */
export default function CompanyHive({ currentUser, setView }) {
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const navigate = useNavigate();
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useCompanyStore((state) => state.activeView);
  const previousView = useCompanyStore((state) => state.previousView);
  const setActiveView = useCompanyStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const handleSetView = useCallback((v) => {
    if (typeof v === 'string') {
      const clean = v.replace(/^\//, '');
      if (PORTAL_ROUTES.has(clean) && clean !== 'company') {
        const store = useAppStore.getState();
        if (['student', 'alumni', 'academic'].includes(clean)) {
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

  const currentView = (pathView && pathView !== 'company') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreFeed posts={posts} setView={handleSetView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'company_ats':
        return <CompanyATSBoard setView={handleSetView} currentUser={effectiveCurrentUser} />;
      case 'create_job':
        return <JobCreator setView={handleSetView} currentUser={effectiveCurrentUser} />;
      case 'jobs':
        return <JobsAndInternships setView={handleSetView} previousView={previousView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId || effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'self'} viewerHive="company" setView={handleSetView} previousView={previousView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="company" setView={handleSetView} previousView={previousView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'applications':
        return <ApplicationsPanel setView={handleSetView} currentUser={effectiveCurrentUser} />;
      case 'virtual_fair':
        return <VirtualCareerFair setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'notifications':
        return <NotificationsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'calendar':
        return <CalendarView setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'messaging':
        return <MessagingInterface setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'network':
      case 'career_network':
        return <CareerNetwork setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" setSelectedUserId={setSelectedUserId} />;
      case 'groups':
        return <GroupsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'group_profile':
        return <GroupProfile setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'about_us':
        return <AboutUsPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      case 'services':
        return <ServicesPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="company" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={handleSetView} previousView="company" />;
        }
        return (
          <CompanyFeed
            setView={handleSetView}
            setSelectedUserId={setSelectedUserId}
            currentUser={effectiveCurrentUser}
            userRole="company"
            academicRole="company"
            setSelectedGroupId={setSelectedGroupId}
          />
        );
    }
  };

  return (
    <HiveProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" /></div>}>
        {renderActiveView()}
      </Suspense>
    </HiveProvider>
  );
}
