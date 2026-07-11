import React, { useState, useEffect } from 'react';
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
import useLocalStorageState from './utils/useLocalStorageState';
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
import MessagingInterface from './components/MessagingInterface';
import CalendarView from './components/CalendarView';
import JobCreator from './components/JobCreator';
import ClubAdminPanel from './components/ClubAdminPanel';

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

const initialClubs = [
  { id: 'CLUB-001', name: 'Genç Yeşilay Kulübü', category: 'Sosyal Sorumluluk', description: 'Bağımlılıklarla mücadele ve sağlıklı yaşam bilincini artırma.', presidentId: 'STU-001', advisorId: 'ACAD-001', status: 'Aktif', memberCount: 45, coverImage: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=500&q=80', logo: 'https://ui-avatars.com/api/?name=GY&background=10B981&color=fff', forms: [], admins: ['STU-002'], joinRequests: [] }
];
const initialClubApplications = [];

const initialRealCompanies = [
  { id: 'CMP-001', name: 'AIESEC Batı İstanbul Şubesi', username: 'aiesec', password: 'IESU2026!aiesec', sector: 'Genel', status: 'Onaylı' },
  { id: 'CMP-002', name: 'ALTERNATİF YAYINCILIK SAN.VE TİC.LTD.ŞT', username: 'alternatif', password: 'IESU2026!alternatif', sector: 'Yayıncılık', status: 'Onaylı' },
  { id: 'CMP-003', name: 'Bayraktar Grup sağlık turizm Ltd şti', username: 'bayraktar', password: 'IESU2026!bayraktar', sector: 'Sağlık Turizm', status: 'Onaylı' },
  { id: 'CMP-004', name: 'BİLİMSEL ESERLER WACOM', username: 'wacom', password: 'IESU2026!wacom', sector: 'Genel', status: 'Onaylı' },
  { id: 'CMP-005', name: 'British Centre Dil Okulları', username: 'britishcentre', password: 'IESU2026!british', sector: 'Eğitim', status: 'Onaylı' },
  { id: 'CMP-006', name: 'CABRA COFFEE ROASTERS', username: 'cabra', password: 'IESU2026!cabra', sector: 'Gıda', status: 'Onaylı' },
  { id: 'CMP-007', name: 'DİJİTALDE BUGÜN YAYINCILIK', username: 'dijitalde', password: 'IESU2026!dijital', sector: 'Yayıncılık', status: 'Onaylı' },
  { id: 'CMP-008', name: 'G silva yapı', username: 'gsilva', password: 'IESU2026!gsilva', sector: 'Yapı', status: 'Onaylı' },
  { id: 'CMP-009', name: 'İstanbul Gümrük Müşavirleri Derneği', username: 'igmd', password: 'IESU2026!igmd', sector: 'Dernek', status: 'Onaylı' },
  { id: 'CMP-010', name: 'Karınca Lojistik A.Ş.', username: 'karinca', password: 'IESU2026!karinca', sector: 'Lojistik', status: 'Onaylı' },
  { id: 'CMP-011', name: 'MACFİT', username: 'macfit', password: 'IESU2026!macfit', sector: 'Spor', status: 'Onaylı' },
  { id: 'CMP-012', name: 'PLUS İNSAN KAYNAKLARI VE DAN. HİZ.', username: 'plusik', password: 'IESU2026!plusik', sector: 'İnsan Kaynakları', status: 'Onaylı' },
  { id: 'CMP-013', name: 'Ramada Residences by Wyndham Istanbul Haramidere', username: 'ramada', password: 'IESU2026!ramada', sector: 'Otelcilik', status: 'Onaylı' },
  { id: 'CMP-014', name: 'Sivil Havacılık Genel Müdürlüğü', username: 'shgm', password: 'IESU2026!shgm', sector: 'Kamu', status: 'Onaylı' },
  { id: 'CMP-015', name: 'TAV Güvenlik', username: 'tavguvenlik', password: 'IESU2026!tavguvenlik', sector: 'Güvenlik', status: 'Onaylı' },
  { id: 'CMP-016', name: 'TÜRKİYE İŞ KURUMU BÜYÜKÇEKMECE HİZMET MERKEZİ', username: 'iskur', password: 'IESU2026!iskur', sector: 'Kamu', status: 'Onaylı' }
];

function App() {
  const [viewState, setViewState] = useLocalStorageState('iesu_view_v1', 'landing'); 
  const [previousView, setPreviousView] = useLocalStorageState('iesu_prev_view_v1', 'landing');
  const view = viewState;
  const setView = (newView) => {
    if (['student', 'alumni', 'company', 'academic', 'admin'].includes(view)) {
      setPreviousView(view);
    }
    setViewState(newView);
  };
  const [userRole, setUserRole] = useLocalStorageState('iesu_user_role_v1', null); 
  const [selectedUserId, setSelectedUserId] = useLocalStorageState('iesu_selected_user_id_v1', null);
  const [selectedGroupId, setSelectedGroupId] = useLocalStorageState('iesu_selected_group_id_v1', null);
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

  React.useEffect(() => {
    if (currentUser) {
      localStorage.setItem('iesu_mock_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // GLOBAL STATE: Canlı Akış Gönderileri (Feed Posts)
  const [posts, setPosts] = useLocalStorageState('iesu_posts_v2', []);
  const [stories, setStories] = useLocalStorageState('iesu_stories_v1', [
    { id: 1, author: { name: 'Kariyer Ofisi', avatar: '/iesu-logo.svg', role: 'admin' }, content: 'Bugün Kariyer Günleri başlıyor! 🎉', image: 'https://www.esenyurt.edu.tr/uploads/2026/05/wuyeismnf35tr-bahar-senligi.jpg', viewedBy: [], createdAt: new Date().toISOString() }
  ]);

  // GLOBAL STATE: Haberler, Duyurular, Etkinlikler, SEM vs.
  const [news, setNews] = useLocalStorageState('iesu_news_v4', initialNews);
  const [announcements, setAnnouncements] = useLocalStorageState('iesu_announcements_v4', initialAnnouncements);
  const [events, setEvents] = useLocalStorageState('iesu_events_v4', initialEvents);
  const [semCourses, setSemCourses] = useLocalStorageState('iesu_sem_courses_v5', initialSemCourses);
  const [jobs, setJobs] = useLocalStorageState('iesu_jobs_v4', initialJobs);
  const [featuredOpportunities, setFeaturedOpportunities] = useLocalStorageState('iesu_featured_v2', initialFeatured);
  const [mentorships, setMentorships] = useLocalStorageState('iesu_mentorships_v2', initialMentorships);
  const [voluntaryInternships, setVoluntaryInternships] = useLocalStorageState('iesu_voluntary_internships_v1', initialVoluntaryInternships);
  
  // ALUMNI MODULES STATE
  const [alumniCardApplications, setAlumniCardApplications] = useLocalStorageState('iesu_alumni_card_apps_v1', []);
  const [alumniCardForms, setAlumniCardForms] = useLocalStorageState('iesu_alumni_card_forms_v1', []);

  // Phase 2: Students, Alumni, Companies, Academic Staff
  const [students, setStudents] = useLocalStorageState('iesu_students_v3', []);
  const [alumni, setAlumni] = useLocalStorageState('iesu_alumni_v3', []);
  const [companies, setCompanies] = useLocalStorageState('iesu_companies_v3', initialRealCompanies);
  const [academicStaff, setAcademicStaff] = useLocalStorageState('iesu_academic_staff_v4', []);

  // Phase 4: Interactions (Messages, Notifications & Applications)
  const [messages, setMessages] = useLocalStorageState('iesu_messages_v2', []);
  const [notifications, setNotifications] = useLocalStorageState('iesu_notifications_v2', []);
  const [applications, setApplications] = useLocalStorageState('iesu_applications_v3', []);

  // GLOBAL STATE: Anketler (Surveys)
  const [surveys, setSurveys] = useLocalStorageState('iesu_surveys_v2', initialSurveys);

  // Phase 10: Academic Data
  const [academicCatalog, setAcademicCatalog] = useLocalStorageState('iesu_academic_catalog_v2', initialAcademicCatalog);
  const [academicApprovals, setAcademicApprovals] = useLocalStorageState('iesu_academic_approvals_v2', initialAcademicApprovals);
  const [liveInternships, setLiveInternships] = useLocalStorageState('iesu_internships_v2', initialInternships);
  const [groups, setGroups] = useLocalStorageState('iesu_groups_v1', initialGroups);

  // FEATURE TOGGLES
  const [featureSurveys, setFeatureSurveys] = useLocalStorageState('iesu_feature_surveys', true);
  const [featureCareerCheckup, setFeatureCareerCheckup] = useLocalStorageState('iesu_feature_career_checkup', true);
  const [featureAlumniCard, setFeatureAlumniCard] = useLocalStorageState('iesu_feature_alumni_card', true);
  const [featureClubsShowcase, setFeatureClubsShowcase] = useLocalStorageState('iesu_feature_clubs_showcase', true);
  const [featureClubApplications, setFeatureClubApplications] = useLocalStorageState('iesu_feature_club_applications', false);

  const [clubs, setClubs] = useLocalStorageState('iesu_clubs_v1', initialClubs);
  const [clubApplications, setClubApplications] = useLocalStorageState('iesu_club_apps_v1', initialClubApplications);

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

  // ─── LIVE DATA FILTER: Remove demo_seed records from all live-facing views ───
  const filterLive = (arr) => (arr || []).filter(item => item.source !== 'demo_seed');
  const liveStudents = filterLive(students);
  const liveAlumni = filterLive(alumni);
  const liveCompanies = filterLive(companies);
  const liveAcademicStaff = filterLive(academicStaff);
  const liveMessages = filterLive(messages);

  return (
    <ErrorBoundary>
      {view === 'landing' && <LandingPage setView={setView} userRole={userRole} setUserRole={setUserRole} />}
      {view === 'login' && <Login setView={setView} setUserRole={setUserRole} setAcademicRole={setAcademicRole} setCurrentUser={setCurrentUser} />}
      {view === 'register' && <Register setView={setView} setCurrentUser={setCurrentUser} setStudents={setStudents} setAlumni={setAlumni} setAcademicStaff={setAcademicStaff} setCompanies={setCompanies} setUserRole={setUserRole} />}
      {view === 'forgot_password' && <ForgotPassword setView={setView} />}
      {view === 'create_job' && <JobCreator setView={setView} currentUser={currentUser} jobs={jobs} setJobs={setJobs} />}
      {view === 'club_admin' && <ClubAdminPanel setView={setView} currentUser={currentUser} clubs={clubs} setClubs={setClubs} posts={posts} setPosts={setPosts} />}
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
      {view === 'company' && <CompanyFeed setView={setView} setSelectedUserId={setSelectedUserId} notifications={notifications} setNotifications={setNotifications} posts={posts} setPosts={setPosts} surveys={surveys} news={news} events={events} students={liveStudents} alumni={liveAlumni} companies={liveCompanies} messages={liveMessages} setMessages={setMessages} applications={applications} setApplications={setApplications} jobs={jobs} announcements={announcements} academicStaff={liveAcademicStaff} currentUser={currentUser} userRole={userRole} academicRole={academicRole} groups={groups} setGroups={setGroups} setSelectedGroupId={setSelectedGroupId} />}
      {view === 'admin' && <AdminDashboard 
        setView={setView} currentUser={currentUser} setSelectedUserId={setSelectedUserId}
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
      {view === 'messaging' && <MessagingInterface previousView={previousView} messages={messages} setMessages={setMessages} currentUser={currentUser} userRole={userRole} contacts={[...students, ...alumni, ...companies, ...academicStaff]} groups={groups} setView={setView} setSelectedUserId={setSelectedUserId} selectedGroupId={selectedGroupId} />}
    </ErrorBoundary>
  );
}



export default App;
