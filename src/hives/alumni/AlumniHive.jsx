import React, { Suspense, lazy, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useAlumniStore from './store/useAlumniStore';
import useAppStore from '../../store/useAppStore';

const PORTAL_ROUTES = new Set([
  'student', 'alumni', 'company', 'academic', 'admin', 'admin_cms', 
  'yonetim_konsolu', 'admin_console', 'audit_logs', 'login', 'register', 
  'landing', 'forgot_password'
]);

// Lazy-loaded feed and subviews
const AlumniFeed = lazy(() => import('../../components/AlumniFeed'));
const AlumniInformationSystem = lazy(() => import('../../components/AlumniInformationSystem'));
const AlumniCardWallet = lazy(() => import('../../components/AlumniCardWallet'));
const AlumniAssocPortal = lazy(() => import('../../components/AlumniAssocPortal'));
const BirlikAgiPortal = lazy(() => import('../../components/BirlikAgiPortal'));
const AlumniDAO = lazy(() => import('../../components/AlumniDAO'));
const GlobalAlumniMap = lazy(() => import('../../components/GlobalAlumniMap'));
const JobsAndInternships = lazy(() => import('../../components/JobsAndInternships'));
const UserProfile = lazy(() => import('../../components/UserProfile'));
const PublicUserProfile = lazy(() => import('../../components/PublicUserProfile'));
const ProfileUpdate = lazy(() => import('../../components/ProfileUpdate'));
const ExploreFeed = lazy(() => import('../../components/ExploreFeed'));
const CareerNetwork = lazy(() => import('../../components/CareerNetwork'));
const GroupsPanel = lazy(() => import('../../components/GroupsPanel'));
const GroupProfile = lazy(() => import('../../components/GroupProfile'));
const NotificationsPanel = lazy(() => import('../../components/NotificationsPanel'));
const CalendarView = lazy(() => import('../../components/CalendarView'));
const MessagingInterface = lazy(() => import('../../components/MessagingInterface'));
const LiveRoomsPanel = lazy(() => import('../../components/LiveRoomsPanel'));
const MentorBooking = lazy(() => import('../../components/MentorBooking'));
const VirtualCareerFair = lazy(() => import('../../components/VirtualCareerFair'));
const IesuWallet = lazy(() => import('../../components/IesuWallet'));
const CampusMap = lazy(() => import('../../components/CampusMap'));
const ContactPage = lazy(() => import('../../components/ContactPage'));
const AboutUsPage = lazy(() => import('../../components/AboutUsPage'));
const ServicesPage = lazy(() => import('../../components/ServicesPage'));
const NewsEvents = lazy(() => import('../../components/NewsEvents'));
const EventsPage = lazy(() => import('../../components/EventsPage'));
const DynamicContentPage = lazy(() => import('../../components/DynamicContentPage'));

/**
 * Alumni Hive Root Component.
 * Owns internal navigation and theming for the alumni portal.
 * Accepts only currentUser as prop from App.jsx.
 */
export default function AlumniHive({ currentUser, setView }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useAlumniStore((state) => state.activeView);
  const previousView = useAlumniStore((state) => state.previousView);
  const setActiveView = useAlumniStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const handleSetView = useCallback((v) => {
    if (typeof v === 'string') {
      const clean = v.replace(/^\//, '');
      if (PORTAL_ROUTES.has(clean) && clean !== 'alumni') {
        const store = useAppStore.getState();
        if (['student', 'company', 'academic'].includes(clean)) {
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

  const currentView = (pathView && pathView !== 'alumni') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'mbs':
        return <AlumniInformationSystem setView={handleSetView} currentUser={currentUser} />;
      case 'alumni_card':
        return <AlumniCardWallet setView={handleSetView} currentUser={currentUser} />;
      case 'alumni_assoc_portal':
        return <AlumniAssocPortal setView={handleSetView} currentUser={currentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} academicRole="alumni" />;
      case 'mezun_dernek':
      case 'birlik_agi':
        return <BirlikAgiPortal setView={handleSetView} currentUser={currentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} setSelectedGroupId={setSelectedGroupId} academicRole="alumni" />;
      case 'alumni_dao':
        return <AlumniDAO setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'global_map':
        return <GlobalAlumniMap setView={handleSetView} currentUser={currentUser} />;
      case 'jobs':
        return <JobsAndInternships setView={handleSetView} previousView={previousView} currentUser={currentUser} userRole="alumni" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId} viewerHive="alumni" setView={handleSetView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="alumni" setView={handleSetView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'explore':
        return <ExploreFeed posts={posts} setView={handleSetView} currentUser={currentUser} />;
      case 'network':
        return <CareerNetwork setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'groups':
        return <GroupsPanel setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'group_profile':
        return <GroupProfile setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'notifications':
        return <NotificationsPanel setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'calendar':
        return <CalendarView setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'messaging':
        return <MessagingInterface setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'live_rooms':
        return <LiveRoomsPanel setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'mentor_booking':
        return <MentorBooking setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'virtual_fair':
        return <VirtualCareerFair setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'wallet':
        return <IesuWallet setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'campus_map':
        return <CampusMap setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'about_us':
        return <AboutUsPage setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      case 'services':
        return <ServicesPage setView={handleSetView} currentUser={currentUser} userRole="alumni" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={handleSetView} previousView="alumni" />;
        }
        return (
          <AlumniFeed
            setView={handleSetView}
            setSelectedUserId={setSelectedUserId}
            currentUser={currentUser}
            userRole="alumni"
            academicRole="alumni"
            setSelectedGroupId={setSelectedGroupId}
          />
        );
    }
  };

  return (
    <HiveProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin" /></div>}>
        {renderActiveView()}
      </Suspense>
    </HiveProvider>
  );
}
