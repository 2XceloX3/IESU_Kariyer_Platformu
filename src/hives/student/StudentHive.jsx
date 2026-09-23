import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { HiveProvider } from './HiveContext';
import useStudentStore from './store/useStudentStore';
import useAppStore from '../../store/useAppStore';

// Lazy-loaded feed and subviews
const StudentFeed = lazy(() => import('../../components/StudentFeed'));
const JobsAndInternships = lazy(() => import('../../components/JobsAndInternships'));
const UserProfile = lazy(() => import('../../components/UserProfile'));
const PublicUserProfile = lazy(() => import('../../components/PublicUserProfile'));
const ProfileUpdate = lazy(() => import('../../components/ProfileUpdate'));
const StudentKGBPanel = lazy(() => import('../../components/StudentKGBPanel'));
const StudentAnalytics = lazy(() => import('../../components/StudentAnalytics'));
const AICVBuilder = lazy(() => import('../../components/AICVBuilder'));
const InterviewSimulator = lazy(() => import('../../components/InterviewSimulator'));
const ApplicationsPanel = lazy(() => import('../../components/ApplicationsPanel'));
const CareerTest = lazy(() => import('../../components/CareerTest'));
const CareerRoadmap = lazy(() => import('../../components/CareerRoadmap'));
const StartupIncubator = lazy(() => import('../../components/StartupIncubator'));
const SmartCertificates = lazy(() => import('../../components/SmartCertificates'));
const DigitalPortfolio = lazy(() => import('../../components/DigitalPortfolio'));
const RewardStore = lazy(() => import('../../components/RewardStore'));
const MetaverseLibrary = lazy(() => import('../../components/MetaverseLibrary'));
const HackathonMarket = lazy(() => import('../../components/HackathonMarket'));
const StudentClubPortal = lazy(() => import('../../components/StudentClubPortal'));
const ClubAdminPanel = lazy(() => import('../../components/ClubAdminPanel'));
const SemPanel = lazy(() => import('../../components/SemPanel'));
const StajPanel = lazy(() => import('../../components/StajPanel'));
const ExploreFeed = lazy(() => import('../../components/ExploreFeed'));
const CareerNetwork = lazy(() => import('../../components/CareerNetwork'));
const GroupsPanel = lazy(() => import('../../components/GroupsPanel'));
const GroupProfile = lazy(() => import('../../components/GroupProfile'));
const NotificationsPanel = lazy(() => import('../../components/NotificationsPanel'));
const CalendarView = lazy(() => import('../../components/CalendarView'));
const MessagingInterface = lazy(() => import('../../components/MessagingInterface'));
const LeaderboardPanel = lazy(() => import('../../components/LeaderboardPanel'));
const LiveRoomsPanel = lazy(() => import('../../components/LiveRoomsPanel'));
const MentorMatch = lazy(() => import('../../components/MentorMatch'));
const MentorBooking = lazy(() => import('../../components/MentorBooking'));
const VirtualCareerFair = lazy(() => import('../../components/VirtualCareerFair'));
const IesuWallet = lazy(() => import('../../components/IesuWallet'));
const CampusMap = lazy(() => import('../../components/CampusMap'));
const AnkaChat = lazy(() => import('../../components/AnkaChat'));
const BMICalculatorModal = lazy(() => import('../../components/BMICalculatorModal'));
const SKSDBLunchWidget = lazy(() => import('../../components/SKSDBLunchWidget'));
const SKSDBClubsDirectory = lazy(() => import('../../components/SKSDBClubsDirectory'));
const BIDBSystemStatusCard = lazy(() => import('../../components/BIDBSystemStatusCard'));
const BIDBHelpdeskModal = lazy(() => import('../../components/BIDBHelpdeskModal'));
const KariyerJobBoard = lazy(() => import('../../components/KariyerJobBoard'));
const KnowledgePortal = lazy(() => import('../../components/KnowledgePortal'));
const OrganizationChart = lazy(() => import('../../components/OrganizationChart'));
const NewsEvents = lazy(() => import('../../components/NewsEvents'));
const EventsPage = lazy(() => import('../../components/EventsPage'));
const ContactPage = lazy(() => import('../../components/ContactPage'));
const AboutUsPage = lazy(() => import('../../components/AboutUsPage'));
const ServicesPage = lazy(() => import('../../components/ServicesPage'));
const DynamicContentPage = lazy(() => import('../../components/DynamicContentPage'));

/**
 * Student Hive Root Component.
 * Owns internal navigation and theming for the student portal.
 * Accepts only currentUser as prop from App.jsx.
 */
export default function StudentHive({ currentUser }) {
  const location = useLocation();
  const pathView = location?.pathname?.split('/').filter(Boolean).pop() || '';
  const activeView = useStudentStore((state) => state.activeView);
  const previousView = useStudentStore((state) => state.previousView);
  const setActiveView = useStudentStore((state) => state.setActiveView);

  const selectedUserId = useAppStore((state) => state.selectedUserId);
  const setSelectedUserId = useAppStore((state) => state.setSelectedUserId);
  const setSelectedGroupId = useAppStore((state) => state.setSelectedGroupId);
  const posts = useAppStore((state) => state.posts);

  const currentView = (pathView && pathView !== 'student') ? pathView : activeView;

  const renderActiveView = () => {
    switch (currentView) {
      case 'jobs':
        return <JobsAndInternships setView={setActiveView} previousView={previousView} currentUser={currentUser} userRole="student" />;
      case 'user_profile':
        return <UserProfile userId={selectedUserId} viewerHive="student" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'public_profile':
        return <PublicUserProfile userId={selectedUserId} viewerHive="student" setView={setActiveView} previousView={previousView} currentUser={currentUser} setSelectedUserId={setSelectedUserId} />;
      case 'profile_update':
        return <ProfileUpdate setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'student_kgb':
        return <StudentKGBPanel setView={setActiveView} previousView={previousView} currentUser={currentUser} userRole="student" />;
      case 'student_analytics':
        return <StudentAnalytics setView={setActiveView} currentUser={currentUser} />;
      case 'cvbuilder':
        return <AICVBuilder setView={setActiveView} currentUser={currentUser} />;
      case 'interview_sim':
        return <InterviewSimulator setView={setActiveView} currentUser={currentUser} />;
      case 'applications':
        return <ApplicationsPanel setView={setActiveView} currentUser={currentUser} />;
      case 'career_test':
        return <CareerTest setView={setActiveView} currentUser={currentUser} />;
      case 'career_roadmap':
        return <CareerRoadmap setView={setActiveView} currentUser={currentUser} />;
      case 'startup_incubator':
        return <StartupIncubator setView={setActiveView} currentUser={currentUser} />;
      case 'smart_certs':
        return <SmartCertificates setView={setActiveView} currentUser={currentUser} />;
      case 'digital_portfolio':
        return <DigitalPortfolio setView={setActiveView} currentUser={currentUser} />;
      case 'reward_store':
        return <RewardStore setView={setActiveView} currentUser={currentUser} />;
      case 'metaverse_library':
        return <MetaverseLibrary setView={setActiveView} currentUser={currentUser} />;
      case 'hackathon_market':
        return <HackathonMarket setView={setActiveView} currentUser={currentUser} />;
      case 'club_portal':
        return <StudentClubPortal setView={setActiveView} currentUser={currentUser} previousView="student" />;
      case 'club_admin':
        return <ClubAdminPanel setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'sem':
        return <SemPanel setView={setActiveView} currentUser={currentUser} />;
      case 'staj':
        return <StajPanel setView={setActiveView} currentUser={currentUser} />;
      case 'explore':
        return <ExploreFeed posts={posts} setView={setActiveView} currentUser={currentUser} />;
      case 'network':
        return <CareerNetwork setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'groups':
        return <GroupsPanel setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'group_profile':
        return <GroupProfile setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'notifications':
        return <NotificationsPanel setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'calendar':
        return <CalendarView setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'messaging':
        return <MessagingInterface setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'leaderboard':
        return <LeaderboardPanel setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'live_rooms':
        return <LiveRoomsPanel setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'mentor_match':
        return <MentorMatch setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'mentor_booking':
        return <MentorBooking setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'virtual_fair':
        return <VirtualCareerFair setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'wallet':
        return <IesuWallet setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'campus_map':
        return <CampusMap setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'anka_chat':
        return <AnkaChat setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'bmi_calculator':
        return <BMICalculatorModal setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'sksdb_lunch':
        return <SKSDBLunchWidget setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'sksdb_clubs':
        return <SKSDBClubsDirectory setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'bidb_status':
        return <BIDBSystemStatusCard setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'bidb_helpdesk':
        return <BIDBHelpdeskModal setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'kariyer_board':
        return <KariyerJobBoard setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'knowledge_portal':
        return <KnowledgePortal setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'organization':
        return <OrganizationChart setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'news':
      case 'haberler':
        return <NewsEvents setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'events':
      case 'events_list':
      case 'etkinlikler':
        return <EventsPage setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'contact':
      case 'contact_us':
        return <ContactPage setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'about_us':
        return <AboutUsPage setView={setActiveView} currentUser={currentUser} userRole="student" />;
      case 'services':
        return <ServicesPage setView={setActiveView} currentUser={currentUser} userRole="student" />;
      default:
        if (typeof activeView === 'string' && activeView.startsWith('inner_page_')) {
          return <DynamicContentPage contentId={activeView.replace('inner_page_', '')} setView={setActiveView} previousView="student" />;
        }
        return (
          <StudentFeed
            setView={setActiveView}
            setSelectedUserId={setSelectedUserId}
            currentUser={currentUser}
            userRole="student"
            academicRole="student"
            setSelectedGroupId={setSelectedGroupId}
          />
        );
    }
  };

  return (
    <HiveProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-[#990000] border-t-transparent rounded-full animate-spin" /></div>}>
        {renderActiveView()}
      </Suspense>
    </HiveProvider>
  );
}
