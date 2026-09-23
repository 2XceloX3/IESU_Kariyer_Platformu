import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useAcademicStore from './store/useAcademicStore';
import useAppStore from '../../store/useAppStore';

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
 * Accepts only currentUser as prop from App.jsx.
 */
export default function AcademicHive({ currentUser }) {
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useAcademicStore((state) => state.activeView);
  const previousView = useAcademicStore((state) => state.previousView);
  const setActiveView = useAcademicStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const currentView = (pathView && pathView !== 'academic') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreFeed posts={posts} setView={setActiveView} currentUser={currentUser} />;
      case 'research_hub':
        return <ResearchOSHub setView={setActiveView} currentUser={currentUser} userRole="academic" setSelectedUserId={setSelectedUserId} />;
      case 'jobs':
        return <JobsAndInternships setView={setActiveView} previousView={previousView} currentUser={currentUser} userRole="academic" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId} viewerHive="academic" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="academic" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'notifications':
        return <NotificationsPanel setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'calendar':
        return <CalendarView setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'messaging':
        return <MessagingInterface setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'network':
        return <CareerNetwork setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'groups':
        return <GroupsPanel setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'group_profile':
        return <GroupProfile setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'about_us':
        return <AboutUsPage setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      case 'services':
        return <ServicesPage setView={setActiveView} currentUser={currentUser} userRole="academic" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={setActiveView} previousView="academic" />;
        }
        return (
          <AcademicStaffFeed
            setView={setActiveView}
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
