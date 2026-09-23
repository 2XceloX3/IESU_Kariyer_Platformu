import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useCompanyStore from './store/useCompanyStore';
import useAppStore from '../../store/useAppStore';

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
 * Accepts only currentUser as prop from App.jsx.
 */
export default function CompanyHive({ currentUser }) {
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useCompanyStore((state) => state.activeView);
  const previousView = useCompanyStore((state) => state.previousView);
  const setActiveView = useCompanyStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const currentView = (pathView && pathView !== 'company') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'explore':
        return <ExploreFeed posts={posts} setView={setActiveView} currentUser={currentUser} />;
      case 'company_ats':
        return <CompanyATSBoard setView={setActiveView} currentUser={currentUser} />;
      case 'create_job':
        return <JobCreator setView={setActiveView} currentUser={currentUser} />;
      case 'jobs':
        return <JobsAndInternships setView={setActiveView} previousView={previousView} currentUser={currentUser} userRole="company" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId} viewerHive="company" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="company" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'applications':
        return <ApplicationsPanel setView={setActiveView} currentUser={currentUser} />;
      case 'virtual_fair':
        return <VirtualCareerFair setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'notifications':
        return <NotificationsPanel setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'calendar':
        return <CalendarView setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'messaging':
        return <MessagingInterface setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'network':
        return <CareerNetwork setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'groups':
        return <GroupsPanel setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'group_profile':
        return <GroupProfile setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'about_us':
        return <AboutUsPage setView={setActiveView} currentUser={currentUser} userRole="company" />;
      case 'services':
        return <ServicesPage setView={setActiveView} currentUser={currentUser} userRole="company" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={setActiveView} previousView="company" />;
        }
        return (
          <CompanyFeed
            setView={setActiveView}
            setSelectedUserId={setSelectedUserId}
            currentUser={currentUser}
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
