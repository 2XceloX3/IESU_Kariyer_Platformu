import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import StudentFeed from './components/StudentFeed';
import CompanyFeed from './components/CompanyFeed';
import AdminDashboard from './components/AdminDashboard';
import OrganizationChart from './components/OrganizationChart';
import JobsAndInternships from './components/JobsAndInternships';
import NewsEvents from './components/NewsEvents';
import SemPanel from './components/SemPanel';
import StajPanel from './components/StajPanel';
import { generateStudents, generateAlumni, generateCompanies, initialSemCourses, initialJobs, initialFeatured, initialMentorships, initialVoluntaryInternships, initialAcademicCatalog, initialAcademicApprovals, initialNews, initialEvents, initialAnnouncements, academicStaff as mockAcademicStaff, initialInternships, initialGroups, initialSurveys } from './utils/mockData';
import useAppStore from './store/useAppStore';
import { contentData } from './components/NewsEvents';
import AlumniFeed from './components/AlumniFeed';
import AcademicStaffFeed from './components/AcademicStaffFeed';
import AcademicOnboarding from './components/AcademicOnboarding';
import ProfileUpdate from './components/ProfileUpdate';
import UserProfile from './components/UserProfile';
import GroupProfile from './components/GroupProfile';
import GroupsPanel from './components/GroupsPanel';
import NotificationsPanel from './components/NotificationsPanel';
import ApplicationsPanel from './components/ApplicationsPanel';
import AICVBuilder from './components/AICVBuilder';
import InterviewSimulator from './components/InterviewSimulator';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MessagingInterface from './components/MessagingInterface';
import CalendarView from './components/CalendarView';
import JobCreator from './components/JobCreator';
import ClubAdminPanel from './components/ClubAdminPanel';
import StudentClubPortal from './components/StudentClubPortal';
import AlumniInformationSystem from './components/AlumniInformationSystem';
import CommandPalette from './components/CommandPalette';
import { ToastContainer, toast } from './components/shared/Toast';

window.toast = toast;

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {style: {padding: '2rem', background: '#fee2e2', color: '#991b1b', height: '100vh', zIndex: 9999, position: 'relative'}},
        React.createElement('h1', null, 'CRASH!'),
        React.createElement('pre', null, this.state.error.stack)
      );
    }
    return this.props.children;
  }
}

function App() {
  const {
    viewState, setViewState, previousView, setPreviousView, userRole, setUserRole,
    selectedUserId, setSelectedUserId, selectedGroupId, setSelectedGroupId,
    posts, setPosts, stories, setStories, news, setNews, announcements, setAnnouncements,
    events, setEvents, semCourses, setSemCourses, jobs, setJobs, featuredOpportunities, setFeaturedOpportunities,
    mentorships, setMentorships, voluntaryInternships, setVoluntaryInternships,
    alumniCardApplications, setAlumniCardApplications, alumniCardForms, setAlumniCardForms,
    students, setStudents, alumni, setAlumni, companies, setCompanies, academicStaff, setAcademicStaff,
    messages, setMessages, notifications, setNotifications, applications, setApplications,
    surveys, setSurveys, academicCatalog, setAcademicCatalog, academicApprovals, setAcademicApprovals,
    liveInternships, setLiveInternships, groups, setGroups, featureSurveys, setFeatureSurveys,
    featureCareerCheckup, setFeatureCareerCheckup, featureAlumniCard, setFeatureAlumniCard,
    featureClubsShowcase, setFeatureClubsShowcase, featureClubApplications, setFeatureClubApplications,
    clubs, setClubs, clubApplications, setClubApplications
  } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const viewStr = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'landing';
  const validViews = ['landing', 'login', 'register', 'forgot_password', 'create_job', 'club_admin', 'club_portal', 'student', 'alumni', 'academic', 'company', 'admin', 'organization', 'jobs', 'haberler', 'duyurular', 'etkinlikler', 'sem', 'staj', 'profile_update', 'mbs', 'user_profile', 'groups', 'group_profile', 'notifications', 'calendar', 'applications', 'cvbuilder', 'messaging', 'interview_sim'];
  const view = validViews.includes(viewStr) ? viewStr : 'landing';
  const setView = (v) => {
    navigate(v === 'landing' ? '/' : '/' + v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mock_user');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && !parsed.id) {
         if (parsed.role === 'academic' || parsed.department === 'Bilgisayar Mühendisliği') parsed.id = 'ACAD-001';
         else if (parsed.role === 'student' || parsed.grade === 'Aktif') parsed.id = 1;
         else if (parsed.role === 'alumni') parsed.id = 1;
         else if (parsed.role === 'employer' || parsed.sector) parsed.id = 1;
         else parsed.id = 'admin_1513';
      }
      return parsed;
    } catch (e) {
      return null;
    }
  });
  const [academicRole, setAcademicRole] = useState('super_admin'); // 'super_admin', 'content_admin', 'mentor_admin', 'standard_academic'
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('iesu_mock_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Firebase Real User Hydration
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in to Firebase.
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({ id: user.uid, ...userData });
            if (userData.role) setUserRole(userData.role);
          } else {
            setCurrentUser(prev => prev || { id: user.uid, email: user.email, name: user.displayName || 'Kullanıcı' });
          }
        } catch (err) {
          console.error("Firebase data hydration error:", err);
        }
      } else {
        // No user is signed in to Firebase.
        // We do NOT clear currentUser here to allow the mock users (like admin) to remain logged in.
      }
    });

    return () => unsubscribe();
  }, []);

  // GLOBAL STATE: Canlı Akış Gönderileri (Feed Posts)

  // GLOBAL STATE: Haberler, Duyurular, Etkinlikler, SEM vs.
  
  // ALUMNI MODULES STATE

  // Phase 2: Students, Alumni, Companies, Academic Staff

  // Phase 4: Interactions (Messages, Notifications & Applications)

  // GLOBAL STATE: Anketler (Surveys)

  // Phase 10: Academic Data

  // FEATURE TOGGLES


  useEffect(() => {
    if (!localStorage.getItem('iesu_likes_reset_v4')) {
      setPosts(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setNews(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setEvents(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setAnnouncements(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      setJobs(prev => (prev || []).map(p => ({ ...p, likes: 0, comments: 0 })));
      localStorage.setItem('iesu_likes_reset_v4', 'true');
    }
  }, []);

  // Modal durumları açık kaldığında veya sayfa değiştiğinde scroll kilitlenmelerini engelle
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.classList.remove('overflow-hidden');
  }, [view]);

  // 🛑🛑🛑 LIVE DATA FILTER: Remove demo_seed records from all live-facing views 🛑🛑🛑
  const liveStudents = useMemo(() => (students || []).filter(item => item.source !== 'demo_seed'), [students]);
  const liveAlumni = useMemo(() => (alumni || []).filter(item => item.source !== 'demo_seed'), [alumni]);
  const liveCompanies = useMemo(() => (companies || []).filter(item => item.source !== 'demo_seed'), [companies]);
  const liveAcademicStaff = useMemo(() => (academicStaff || []).filter(item => item.source !== 'demo_seed'), [academicStaff]);
  const liveMessages = useMemo(() => (messages || []).filter(item => item.source !== 'demo_seed'), [messages]);

  return (
    <ErrorBoundary>
      <ToastContainer />
      {view === 'landing' && <LandingPage setView={setView} userRole={userRole} setUserRole={setUserRole} />}
      {view === 'login' && <Login setView={setView} setUserRole={setUserRole} setAcademicRole={setAcademicRole} setCurrentUser={setCurrentUser} />}
      {view === 'register' && <Register setView={setView} setCurrentUser={setCurrentUser} setStudents={setStudents} setAlumni={setAlumni} setAcademicStaff={setAcademicStaff} setCompanies={setCompanies} setUserRole={setUserRole} />}
      {view === 'forgot_password' && <ForgotPassword setView={setView} />}
      {view === 'create_job' && <JobCreator setView={setView} currentUser={currentUser} jobs={jobs} setJobs={setJobs} />}
      {view === 'club_admin' && <ClubAdminPanel setView={setView} currentUser={currentUser} clubs={clubs} setClubs={setClubs} posts={posts} setPosts={setPosts} />}
      {view === 'club_portal' && <StudentClubPortal setView={setView} currentUser={currentUser} clubs={clubs} setClubs={setClubs} previousView={userRole === 'student' ? 'student' : 'alumni'} />}
      {view === 'student' && <StudentFeed setView={setView} setSelectedUserId={setSelectedUserId} notifications={notifications} setNotifications={setNotifications} posts={posts} setPosts={setPosts} stories={stories} setStories={setStories} surveys={surveys} userRole={userRole} academicRole={academicRole} news={news} events={events} students={liveStudents} alumni={liveAlumni} companies={liveCompanies} currentUser={currentUser} featuredOpportunities={featuredOpportunities} mentorships={mentorships} voluntaryInternships={voluntaryInternships} messages={liveMessages} setMessages={setMessages} applications={applications} setApplications={setApplications} jobs={jobs} academicStaff={liveAcademicStaff} announcements={announcements} groups={groups} setGroups={setGroups} setSelectedGroupId={setSelectedGroupId} featureClubsShowcase={featureClubsShowcase} featureClubApplications={featureClubApplications} clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} />}
      {view === 'alumni' && <AlumniFeed setView={setView} setSelectedUserId={setSelectedUserId} notifications={notifications} setNotifications={setNotifications} posts={posts} setPosts={setPosts} stories={stories} setStories={setStories} surveys={surveys} userRole={userRole} academicRole={academicRole} news={news} events={events} students={liveStudents} alumni={liveAlumni} companies={liveCompanies} currentUser={currentUser} featuredOpportunities={featuredOpportunities} mentorships={mentorships} messages={liveMessages} setMessages={setMessages} applications={applications} setApplications={setApplications} jobs={jobs} academicStaff={liveAcademicStaff} announcements={announcements} alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications} alumniCardForms={alumniCardForms} groups={groups} setGroups={setGroups} setSelectedGroupId={setSelectedGroupId} featureSurveys={featureSurveys} featureCareerCheckup={featureCareerCheckup} featureAlumniCard={featureAlumniCard} featureClubsShowcase={featureClubsShowcase} featureClubApplications={featureClubApplications} clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} />}
      {view === 'academic' && (
        <ErrorBoundary>
          <AcademicStaffFeed 
            setView={setView} 
            setSelectedUserId={setSelectedUserId}
            currentUser={currentUser} 
            userRole={userRole}
            academicRole={academicRole}
            notifications={notifications} 
            setNotifications={setNotifications} 
            initialInternships={liveInternships || []} 
            academicApprovals={academicApprovals || []} 
            setAcademicApprovals={setAcademicApprovals}
            posts={posts || []} setPosts={setPosts}
            news={news || []} events={events || []} announcements={announcements || []} jobs={jobs || []}
            students={liveStudents || []} setStudents={setStudents} alumni={liveAlumni || []} companies={liveCompanies || []} academicStaff={liveAcademicStaff || []}
            surveys={surveys || []}
            groups={groups || []}
            setGroups={setGroups}
            setSelectedGroupId={setSelectedGroupId}
          />
        </ErrorBoundary>
      )}
      {view === 'company' && <CompanyFeed setView={setView} setSelectedUserId={setSelectedUserId} notifications={notifications} setNotifications={setNotifications} posts={posts} setPosts={setPosts} stories={stories} setStories={setStories} surveys={surveys} news={news} events={events} students={liveStudents} alumni={liveAlumni} companies={liveCompanies} messages={liveMessages} setMessages={setMessages} applications={applications} setApplications={setApplications} jobs={jobs} announcements={announcements} academicStaff={liveAcademicStaff} currentUser={currentUser} userRole={userRole} academicRole={academicRole} groups={groups} setGroups={setGroups} setSelectedGroupId={setSelectedGroupId} />}
      {view === 'admin' && <AdminDashboard 
        setView={setView} currentUser={currentUser} setSelectedUserId={setSelectedUserId}
        userRole={userRole} academicRole={academicRole}
        students={liveStudents} setStudents={setStudents} 
        alumni={liveAlumni} setAlumni={setAlumni} 
        companies={liveCompanies} setCompanies={setCompanies} 
        jobs={jobs} setJobs={setJobs} 
        featuredOpportunities={featuredOpportunities} setFeaturedOpportunities={setFeaturedOpportunities} 
        mentorships={mentorships} setMentorships={setMentorships} 
        voluntaryInternships={voluntaryInternships} setVoluntaryInternships={setVoluntaryInternships}
        messages={liveMessages} setMessages={setMessages}
        applications={applications} setApplications={setApplications}
        academicStaff={liveAcademicStaff} setAcademicStaff={setAcademicStaff}
        alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications}
        alumniCardForms={alumniCardForms} setAlumniCardForms={setAlumniCardForms}
        initialAcademicCatalog={academicCatalog}
        setAcademicCatalog={setAcademicCatalog}
        featureSurveys={featureSurveys}
        setFeatureSurveys={setFeatureSurveys}
        featureCareerCheckup={featureCareerCheckup}
        setFeatureCareerCheckup={setFeatureCareerCheckup}
        featureAlumniCard={featureAlumniCard}
        setFeatureAlumniCard={setFeatureAlumniCard}
        featureClubsShowcase={featureClubsShowcase}
        setFeatureClubsShowcase={setFeatureClubsShowcase}
        featureClubApplications={featureClubApplications}
        setFeatureClubApplications={setFeatureClubApplications}
        clubs={clubs}
        setClubs={setClubs}
        clubApplications={clubApplications}
        setClubApplications={setClubApplications}
        academicApprovals={academicApprovals} setAcademicApprovals={setAcademicApprovals}
        posts={posts} setPosts={setPosts}
        news={news} setNews={setNews}
        events={events} setEvents={setEvents}
        announcements={announcements} setAnnouncements={setAnnouncements}
        surveys={surveys} setSurveys={setSurveys}
        semCourses={semCourses} setSemCourses={setSemCourses}
        userRole={userRole} academicRole={academicRole}
        groups={groups} setGroups={setGroups}
      />}
      {view === 'organization' && <OrganizationChart setView={setView} userRole={userRole} />}
      {view === 'jobs' && <JobsAndInternships setView={setView} previousView={previousView} jobs={jobs} setJobs={setJobs} applications={applications} setApplications={setApplications} currentUser={currentUser} userRole={userRole} setSelectedUserId={setSelectedUserId} messages={messages} setMessages={setMessages} academicRole={academicRole} />}
      {view === 'haberler' && <NewsEvents setView={setView} category="haberler" news={news} announcements={announcements} events={events} currentUser={currentUser} userRole={userRole} />}
      {view === 'duyurular' && <NewsEvents setView={setView} category="duyurular" news={news} announcements={announcements} events={events} currentUser={currentUser} userRole={userRole} />}
      {view === 'etkinlikler' && <NewsEvents setView={setView} category="etkinlikler" news={news} announcements={announcements} events={events} currentUser={currentUser} userRole={userRole} />}
      {view === 'sem' && <SemPanel setView={setView} semCourses={semCourses} userRole={userRole} />}
      {view === 'staj' && <StajPanel setView={setView} userRole={userRole} />}
      {view === 'profile_update' && <ProfileUpdate 
        setView={setView} 
        currentUser={currentUser} setCurrentUser={setCurrentUser}
        userRole={userRole} 
        academicCatalog={academicCatalog} 
        academicApprovals={academicApprovals} setAcademicApprovals={setAcademicApprovals}
        students={students} setStudents={setStudents}
        alumni={alumni} setAlumni={setAlumni}
        academicStaff={liveAcademicStaff} setAcademicStaff={setAcademicStaff}
        companies={companies} setCompanies={setCompanies}
      />}
      {view === 'mbs' && <AlumniInformationSystem 
        currentUser={currentUser} 
        setView={setView} 
        setAlumni={setAlumni} 
      />}
      {view === 'user_profile' && <UserProfile 
            userId={selectedUserId} 
            setView={setView} setSelectedUserId={setSelectedUserId}
            previousView={previousView}
            students={liveStudents} 
            alumni={liveAlumni} 
            companies={liveCompanies} 
            academicStaff={liveAcademicStaff} 
            currentUser={currentUser}
            userRole={userRole}
            posts={posts}
            setPosts={setPosts}
            messages={liveMessages}
            setMessages={setMessages}
            notifications={notifications}
            news={news}
            events={events}
            announcements={announcements}
            jobs={jobs}
            setDirectMessageUser={setSelectedUserId}
          />}
      {view === 'groups' && <GroupsPanel previousView={previousView}
        groups={groups} 
        setGroups={setGroups} 
        currentUser={currentUser} 
        userRole={userRole} 
        setView={setView} 
        setSelectedGroupId={setSelectedGroupId}
        setSelectedUserId={setSelectedUserId}
      />}
      {view === 'group_profile' && <GroupProfile
        groupId={selectedGroupId}
        groupData={groups.find(g => g.id === selectedGroupId) || null}
        posts={posts}
        setPosts={setPosts}
        currentUser={currentUser}
        setView={setView}
        userRole={userRole}
        setSelectedUserId={setSelectedUserId}
      />}
      {view === 'notifications' && <NotificationsPanel previousView={previousView}
        notifications={notifications} 
        setNotifications={setNotifications} 
        currentUser={currentUser} 
        setView={setView}
        userRole={userRole}
        setSelectedUserId={setSelectedUserId}
      />}
      {view === 'calendar' && (
        <ErrorBoundary>
          <CalendarView 
            events={events} 
            mentorships={mentorships} 
            currentUser={currentUser} 
            userRole={userRole}
            setView={setView} 
            setEvents={setEvents} 
            setSelectedUserId={setSelectedUserId}
            messages={messages}
            setMessages={setMessages}
            academicRole={academicRole}
          />
        </ErrorBoundary>
      )}
      {view === 'applications' && <ApplicationsPanel applications={applications} currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
      {view === 'cvbuilder' && <AICVBuilder currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} messages={messages} setMessages={setMessages} academicRole={academicRole} />}
      {view === 'interview_sim' && <InterviewSimulator currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />}
      {view === 'messaging' && <MessagingInterface previousView={previousView} messages={messages} setMessages={setMessages} currentUser={currentUser} userRole={userRole} contacts={[...students, ...alumni, ...companies, ...academicStaff]} groups={groups} setView={setView} setSelectedUserId={setSelectedUserId} selectedGroupId={selectedGroupId} />}
      
      <PWAInstallPrompt />
    </ErrorBoundary>
  );
}



export default App;
