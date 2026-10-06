import React, { Suspense, lazy, useCallback, useEffect } from 'react';
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
const AICVBuilder = lazy(() => import('../../components/AICVBuilder'));
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
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
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
  const groups = useAppStore((state) => state.groups) || [];
  const selectedGroupId = useAppStore((state) => state.selectedGroupId);

  const handleSetView = useCallback((v) => {
    if (typeof v === 'string') {
      const clean = v.replace(/^\//, '');
      if (PORTAL_ROUTES.has(clean) && clean !== 'alumni') {
        const store = useAppStore.getState();
        const isUserAdmin = effectiveCurrentUser?.role === 'admin' || store.userRole === 'admin';
        if (['student', 'company', 'academic'].includes(clean) && isUserAdmin) {
          store.setActivePortalBranch?.(clean);
        } else if ((clean === 'admin' || clean === 'admin_cms' || clean === 'yonetim_konsolu') && isUserAdmin) {
          store.setActivePortalBranch?.('admin');
        } else if (clean === 'login' || clean === 'register' || clean === 'landing' || clean === 'forgot_password') {
          // allow public auth routes
        }
        setActiveView('feed');
        if (setView) setView(clean);
        else navigate(clean === 'landing' ? '/' : '/' + clean);
        return;
      }
      const target = (clean === 'alumni' || clean === '' || clean === 'feed') ? 'feed' : clean;
      if (target === 'user_profile') {
        const selfId = effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'self';
        setSelectedUserId(selfId);
        useAppStore.getState().setSelectedUserId?.(selfId);
      }
      setActiveView(target);
      if (target === 'feed') {
        navigate('/alumni');
      } else {
        navigate('/' + target);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveView(v);
  }, [setView, navigate, setActiveView, effectiveCurrentUser, setSelectedUserId]);

  useEffect(() => {
    if (pathView && pathView !== 'alumni' && pathView !== 'feed') {
      setActiveView(pathView);
    }
  }, [pathView, setActiveView]);

  const currentView = (pathView && pathView !== 'alumni' && pathView !== 'feed') ? pathView : (activeView || 'feed');

  const renderActiveView = () => {
    switch (currentView) {
      case 'mbs':
        return <AlumniInformationSystem setView={handleSetView} currentUser={effectiveCurrentUser} />;
      case 'alumni_card':
        return <AlumniCardWallet setView={handleSetView} currentUser={effectiveCurrentUser} />;
      case 'alumni_assoc_portal':
        return <AlumniAssocPortal setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} academicRole="alumni" />;
      case 'mezun_dernek':
      case 'birlik_agi':
        return <BirlikAgiPortal setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} setSelectedGroupId={setSelectedGroupId} academicRole="alumni" />;
      case 'alumni_dao':
        return <AlumniDAO setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'global_map':
        return <GlobalAlumniMap setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} previousView={previousView} />;
      case 'jobs':
        return <JobsAndInternships setView={handleSetView} previousView={previousView || 'alumni'} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId || effectiveCurrentUser?.id || effectiveCurrentUser?.uid || 'self'} viewerHive="alumni" setView={handleSetView} previousView={previousView || 'alumni'} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="alumni" setView={handleSetView} previousView={previousView || 'alumni'} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'cvbuilder':
        return <AICVBuilder setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'explore':
        return <ExploreFeed posts={posts} setView={handleSetView} currentUser={effectiveCurrentUser} setSelectedUserId={setSelectedUserId} />;
      case 'network':
      case 'career_network':
        return <CareerNetwork setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" previousView={previousView || 'alumni'} setSelectedUserId={setSelectedUserId} academicStaff={useAppStore.getState().academicStaff || []} companies={useAppStore.getState().companies || []} />;
      case 'groups':
        return <GroupsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} />;
      case 'group_profile': {
        const groupData = groups.find(g => g.id === selectedGroupId) || {};
        return <GroupProfile 
          setView={handleSetView} 
          currentUser={effectiveCurrentUser} 
          userRole="alumni" 
          setSelectedUserId={setSelectedUserId}
          groupData={groupData}
          groupId={selectedGroupId}
        />;
      }
      case 'notifications':
        return <NotificationsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} />;
      case 'calendar':
        return <CalendarView setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} />;
      case 'messaging':
        return <MessagingInterface setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} selectedGroupId={useAppStore.getState().selectedGroupId} setSelectedGroupId={setSelectedGroupId} />;
      case 'live_rooms':
        return <LiveRoomsPanel setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'mentor_booking':
        return <MentorBooking setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'virtual_fair':
        return <VirtualCareerFair setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'wallet':
        return <IesuWallet setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'campus_map':
        return <CampusMap setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'about_us':
        return <AboutUsPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
      case 'services':
        return <ServicesPage setView={handleSetView} currentUser={effectiveCurrentUser} userRole="alumni" />;
            case 'gizlilik':
      case 'kvkk':
      case 'kullanim':
      case 'cerez':
      case 'aydinlatma-metni':
      case 'aydinlatma':
      case 'cerez-politikasi':
      case 'cerez-politikası': {
        const legalId = (
          activeView === 'aydinlatma-metni' || activeView === 'aydinlatma' ? 'kvkk' :
          activeView === 'cerez-politikasi' || activeView === 'cerez-politikası' ? 'cerez' :
          activeView
        );
        return <DynamicContentPage contentId={legalId} setView={handleSetView} previousView="alumni" />;
      }
default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={handleSetView} previousView="alumni" />;
        }
        return (
          <AlumniFeed
            setView={handleSetView}
            setSelectedUserId={setSelectedUserId}
            currentUser={effectiveCurrentUser}
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
