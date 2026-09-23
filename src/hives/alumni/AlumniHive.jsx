import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useAlumniStore from './store/useAlumniStore';
import useAppStore from '../../store/useAppStore';

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
export default function AlumniHive({ currentUser }) {
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useAlumniStore((state) => state.activeView);
  const previousView = useAlumniStore((state) => state.previousView);
  const setActiveView = useAlumniStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const currentView = (pathView && pathView !== 'alumni') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'mbs':
        return <AlumniInformationSystem setView={setActiveView} currentUser={currentUser} />;
      case 'alumni_card':
        return <AlumniCardWallet setView={setActiveView} currentUser={currentUser} />;
      case 'alumni_assoc_portal':
        return <AlumniAssocPortal setView={setActiveView} currentUser={currentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} academicRole="alumni" />;
      case 'mezun_dernek':
      case 'birlik_agi':
        return <BirlikAgiPortal setView={setActiveView} currentUser={currentUser} userRole="alumni" setSelectedUserId={setSelectedUserId} setSelectedGroupId={setSelectedGroupId} academicRole="alumni" />;
      case 'alumni_dao':
        return <AlumniDAO setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'global_map':
        return <GlobalAlumniMap setView={setActiveView} currentUser={currentUser} />;
      case 'jobs':
        return <JobsAndInternships setView={setActiveView} previousView={previousView} currentUser={currentUser} userRole="alumni" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId} viewerHive="alumni" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="alumni" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'explore':
        return <ExploreFeed posts={posts} setView={setActiveView} currentUser={currentUser} />;
      case 'network':
        return <CareerNetwork setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'groups':
        return <GroupsPanel setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'group_profile':
        return <GroupProfile setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'notifications':
        return <NotificationsPanel setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'calendar':
        return <CalendarView setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'messaging':
        return <MessagingInterface setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'live_rooms':
        return <LiveRoomsPanel setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'mentor_booking':
        return <MentorBooking setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'virtual_fair':
        return <VirtualCareerFair setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'wallet':
        return <IesuWallet setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'campus_map':
        return <CampusMap setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'about_us':
        return <AboutUsPage setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      case 'services':
        return <ServicesPage setView={setActiveView} currentUser={currentUser} userRole="alumni" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={setActiveView} previousView="alumni" />;
        }
        return (
          <AlumniFeed
            setView={setActiveView}
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
