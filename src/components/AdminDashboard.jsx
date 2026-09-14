import React, { useState, useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import TopProfileMenu from './TopProfileMenu';

import { Megaphone, Star, Trophy, BookOpen as BookOpenKgb } from 'lucide-react';
import CMSEvents from './admin/CMSEvents';
import CMSGeneralEvents from './admin/CMSGeneralEvents';
import CMSNews from './admin/CMSNews';
import CMSAnnouncements from './admin/CMSAnnouncements';
import CMSJobs from './admin/CMSJobs';
import CMSCareerOpportunities from './admin/CMSCareerOpportunities';
import CMSFeatured from './admin/CMSFeatured';
import CMSMentorship from './admin/CMSMentorship';
import CMSStudents from './admin/CMSStudents';
import CMSAlumni from './admin/CMSAlumni';
import CMSCompanies from './admin/CMSCompanies';
import CMSMessages from './admin/CMSMessages';
import CMSIntegrations from './admin/CMSIntegrations';
import CMSAcademicStaff from './admin/CMSAcademicStaff';
import CMSVoluntaryInternships from './admin/CMSVoluntaryInternships';
import CMSSEMCourses from './admin/CMSSEMCourses';
import CMSAcademicCatalog from './admin/CMSAcademicCatalog';
import CMSAcademicApprovals from './admin/CMSAcademicApprovals';
import DataCleanup from './admin/DataCleanup';
import OfficialContentImport from './admin/OfficialContentImport';
import CMSSurveys from './admin/CMSSurveys';
import CMSAnalytics from './admin/CMSAnalytics';
import CMSCareerFair from './admin/CMSCareerFair';
import PlatformSettings from './admin/PlatformSettings';
import InstitutionalStatsManager from './admin/InstitutionalStatsManager';
import CMSAlumniAssoc from './admin/CMSAlumniAssoc';
import CMSAlumniCard from './admin/CMSAlumniCard';
import CMSGroups from './admin/CMSGroups';
import CMSSSP from './admin/CMSSSP';
import CMSDataPoolExport from './admin/CMSDataPoolExport';
import CMSStaff from './admin/CMSStaff';
import CMSSyncCenter from './admin/CMSSyncCenter';
import CMSMentorshipPool from './admin/CMSMentorshipPool';
import CMSCompanyEducationRequests from './admin/CMSCompanyEducationRequests';
import CMSCompanyEventMessages from './admin/CMSCompanyEventMessages';
import CMSCareerCounseling from './admin/CMSCareerCounseling';
import CMSCorporatePartnerships from './admin/CMSCorporatePartnerships';
import CMSAcademicRadar from './admin/CMSAcademicRadar';
import CMSCandidatePool from './admin/CMSCandidatePool';
import CMSApplicationsPool from './admin/CMSApplicationsPool';
import CMSUserTypeManager from './admin/CMSUserTypeManager';
import CMSAuditTrail from './admin/CMSAuditTrail';
import CMSSiteEditor from './admin/CMSSiteEditor';
import CMSGallery from './admin/CMSGallery';
import CMSPortfolios from './admin/CMSPortfolios';
import AkademikPanel from './admin/AkademikPanel';
import PanelHeader from './admin/PanelHeader';
import Logo from './Logo';
import {
  LayoutDashboard, Users, Briefcase, Calendar, Crown,
  MessageSquare, GraduationCap, Building2, CreditCard,
  BarChart3, Network, ClipboardList, LogOut,
  ChevronDown, ChevronUp, Search, Bell, BellIcon,
  CheckCircle, XCircle, Plus, Trash2, Send,
  UserCheck, BookOpen, FileText, Heart, Award, ShieldCheck, Library,
  TrendingUp, Activity, Eye, Edit, Newspaper, Database, UserPlus, ShieldAlert, Settings, MessageCircle, Wand2, Radio, Brain, Sparkles, Cloud, Code2, Palette,
  Camera
} from 'lucide-react';

import { STUDENTS, ALUMNI, COMPANIES, ALUMNI_CARDS, JOBS_INIT, MENTORSHIPS_INIT, VOLUNTEER_INIT, MESSAGES_INIT, SURVEYS_INIT, SEM_INIT, NEWS_INIT, EVENTS_INIT, ORG } from '../data/mockAdminData';
import { Badge, Card, StatCard, Progress, Tbl, BtnGreen, BtnRed, BtnPrimary } from './admin/AdminShared';

// ══════════════════════════════════════════════════════════════
//  PANELS
// ══════════════════════════════════════════════════════════════


// ── 1. Kontrol Merkezi ────────────────────────────────────────


function OverviewPanel({ students = [], alumni = [], jobs = [], events = [], announcements = [], mentorships = [], voluntaryInternships = [], surveys = [], academicApprovals = [], applications = [], setActiveTab, setView }) {
  const messages = useAppStore(state => state.messages);
  
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Kontrol Merkezi" sub="Sistemdeki genel durum ve özet veriler" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending approvals */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Bekleyen İşlemler</h3>
          <div className="space-y-2.5">
            {[
              { label:'İlan & Staj Başvuru Havuzu', val: (applications || []).filter(a=>a?.status==='Beklemede'||!a?.status).length, color:'purple', tab:'basvuru_havuzu' },
              { label:'Onay Bekleyen İlan',       val: (jobs || []).filter(j=>j?.status==='Beklemede').length,              color:'amber'   },
              { label:'Staj Onay Bekliyor',        val: (voluntaryInternships || []).filter(v=>v.status==='Taslak').length, color:'orange' },
              { label:'Akademik Profil Onayı',    val: (academicApprovals || []).filter(a=>a.status==='Beklemede').length, color:'red' },
              { label:'Mentor Eşleşme Bekliyor',  val: (mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length, color:'sky'  },
              { label:'Aktif Anket',               val: (surveys || []).filter(s=>s?.status==='Aktif').length,                color:'green'  },
            ].map(item => (
              <div 
                key={item.label} 
                onClick={() => item.tab && setActiveTab && setActiveTab(item.tab)}
                className={`flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 ${item.tab ? 'cursor-pointer hover:bg-amber-50/50' : ''}`}
              >
                <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                <span className={`text-lg font-black ${item.val>0?'text-red-600':'text-gray-500'}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Son Mesajlar</h3>
          <div className="space-y-3">
            {(messages || []).slice(0,4).map(m=>(
              <div key={m?.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m?.read?'bg-gray-300':'bg-red-500'}`}/>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{m?.from}</p>
                  <p className="text-xs text-gray-500 truncate">{m?.subject}</p>
                  <p className="text-xs text-gray-500">{m?.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Sistem Özeti</h3>
          <div className="space-y-4">
            <StatCard icon={<Users size={16}/>} label="Toplam Öğrenci" value={(students || []).length} color="blue" />
            <StatCard icon={<Award size={16}/>} label="Toplam Mezun" value={(alumni || []).length} color="emerald" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latest jobs */}
        <Card className="p-6">
          <h3 className="font-black text-gray-900 mb-4">Son Eklenen İlanlar</h3>
          <Tbl
            headers={['İlan','Firma','Tür','Durum']}
            rows={(jobs || []).slice(0,5).map(j=>[
              <span className="font-semibold text-gray-900">{j?.title}</span>,
              j?.company, <Badge status={j?.type}/>, <Badge status={j?.status}/>
            ])}
          />
        </Card>

        {/* Super Admin Activity Feed */}
        <Card className="p-6">
          <h3 className="font-black text-gray-900 mb-4">Sistem Aktivite Akışı</h3>
          <div className="space-y-4">
            {(events || []).slice(0, 2).map(e => (
              <div key={e.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Etkinlik Eklendi: {e?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e?.date || 'Yakın Zamanda'}</p>
                </div>
              </div>
            ))}
            {(announcements || []).slice(0, 2).map(a => (
              <div key={a.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Megaphone size={14} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Duyuru: {a?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a?.date || 'Yakın Zamanda'}</p>
                </div>
              </div>
            ))}
            {(students || []).slice(0, 1).map(s => (
              <div key={s?.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <UserPlus size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Yeni Öğrenci Kaydı: {s?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s?.department}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function OperasyonPanel({ jobs = [], setJobs, voluntaryInternships = [], setVoluntaryInternships, mentorships = [] }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Operasyon Özeti" sub="Günlük iş akışı ve onay gerektiren işlemler" />

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-amber-400">
          <p className="text-3xl font-black text-gray-900">{(jobs || []).filter(j=>j?.status==='Beklemede').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Onay Bekleyen İlan</p>
        </Card>
        <Card className="p-5 border-l-4 border-red-400">
          <p className="text-3xl font-black text-gray-900">{(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Staj Onay Bekliyor</p>
        </Card>
        <Card className="p-5 border-l-4 border-purple-400">
          <p className="text-3xl font-black text-gray-900">{(mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Mentor Eşleşme Bekliyor</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen İlanlar</h3>
        {(jobs || []).filter(j=>j?.status==='Beklemede').length===0
          ? <p className="text-gray-500 text-sm text-center py-6">✓ Onay bekleyen ilan yok</p>
          : <Tbl
              headers={['İlan','Firma','Tür','Tarih','İşlem']}
              rows={(jobs || []).filter(j=>j?.status==='Beklemede').map(j=>[
                <span className="font-bold text-gray-900">{j?.title}</span>,
                j?.company, <Badge status={j?.type}/>, j?.date,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setJobs((jobs || []).map(x=>x.id===j?.id?{...x,status:'Yayında'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setJobs((jobs || []).filter(x=>x.id!==j?.id))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>

      <Card className="p-6">
        <h3 className="font-black text-gray-900 mb-4">Onay Bekleyen Stajlar</h3>
        {(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').length===0
          ? <p className="text-gray-500 text-sm text-center py-6">✓ Onay bekleyen staj yok</p>
          : <Tbl
              headers={['Öğrenci','Firma','Pozisyon','Başlangıç','İşlem']}
              rows={(voluntaryInternships || []).filter(v=>v.status==='Onay Bekliyor').map(v=>[
                <span className="font-bold">{v.student}</span>,
                v.company, v.position, v.startDate,
                <div className="flex gap-2">
                  <BtnGreen onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Onaylı'}:x))}>Onayla</BtnGreen>
                  <BtnRed onClick={()=>setVoluntaryInternships((voluntaryInternships || []).map(x=>x.id===v.id?{...x,status:'Reddedildi'}:x))}>Reddet</BtnRed>
                </div>
              ])}
            />}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SIDEBAR NAVIGATION CONFIG
// ══════════════════════════════════════════════════════════════
const PANEL_CATEGORIES = [
  { id: 'genel', label: 'Genel Bakış', icon: <LayoutDashboard size={14}/>, panels: ['overview', 'basvuru_havuzu', 'operasyon', 'akademik'] },
  { id: 'kullanici', label: 'Kullanıcı Yönetimi', icon: <Users size={14}/>, panels: ['alumni', 'students', 'academic_staff', 'companies', 'cms_staff', 'mezun_dernek', 'kart', 'user_types'] },
  { id: 'icerik', label: 'İçerik & Platform', icon: <FileText size={14}/>, panels: ['cms_news', 'cms_ann', 'cms_events', 'etkinlik', 'cms_jobs', 'ilan', 'cms_feat', 'cms_portfolios', 'cms_gallery', 'gonullu', 'sem', 'academic_catalog', 'academic_approvals', 'cms_groups', 'kariyer_gunleri', 'mesajlar'] },
  { id: 'kgm_danismanlik', label: 'Kariyer Danışmanlığı & Sektör', icon: <UserCheck size={14}/>, panels: ['cms_ment', 'mentorluk', 'cms_mentorship_pool', 'cms_career_counseling', 'cms_corporate_partnerships', 'company_edu_requests', 'company_event_msgs'] },
  { id: 'sistem', label: 'Sistem & Analiz', icon: <Settings size={14}/>, panels: ['site_editor', 'institutional_stats', 'platform_ayarlari', 'cms_sync', 'data_cleanup', 'cms_datapool', 'content_import', 'analytics', 'anket', 'audit_log', 'akademik_radar', 'aday_havuzu', 'entegrasyon', 'cms_ssp'] }
];

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard({
  currentUser, userRole, academicRole,
  setView, setSelectedUserId
}) {
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const news = useAppStore(state => state.news);
  const setNews = useAppStore(state => state.setNews);
  const announcements = useAppStore(state => state.announcements);
  const setAnnouncements = useAppStore(state => state.setAnnouncements);
  const events = useAppStore(state => state.events);
  const setEvents = useAppStore(state => state.setEvents);
  const semCourses = useAppStore(state => state.semCourses);
  const setSemCourses = useAppStore(state => state.setSemCourses);
  const surveys = useAppStore(state => state.surveys);
  const setSurveys = useAppStore(state => state.setSurveys);
  const students = useAppStore(state => state.students);
  const setStudents = useAppStore(state => state.setStudents);
  const alumni = useAppStore(state => state.alumni);
  const setAlumni = useAppStore(state => state.setAlumni);
  const companies = useAppStore(state => state.companies);
  const setCompanies = useAppStore(state => state.setCompanies);
  const jobs = useAppStore(state => state.jobs);
  const setJobs = useAppStore(state => state.setJobs);
  const featuredOpportunities = useAppStore(state => state.featuredOpportunities);
  const setFeaturedOpportunities = useAppStore(state => state.setFeaturedOpportunities);
  const careerOpportunities = useAppStore(state => state.careerOpportunities);
  const setCareerOpportunities = useAppStore(state => state.setCareerOpportunities);
  const generalEvents = useAppStore(state => state.generalEvents);
  const setGeneralEvents = useAppStore(state => state.setGeneralEvents);
  const mentorships = useAppStore(state => state.mentorships);
  const setMentorships = useAppStore(state => state.setMentorships);
  const voluntaryInternships = useAppStore(state => state.voluntaryInternships);
  const setVoluntaryInternships = useAppStore(state => state.setVoluntaryInternships);
  const applications = useAppStore(state => state.applications);
  const setApplications = useAppStore(state => state.setApplications);
  const academicStaff = useAppStore(state => state.academicStaff);
  const setAcademicStaff = useAppStore(state => state.setAcademicStaff);
  const alumniCardApplications = useAppStore(state => state.alumniCardApplications);
  const setAlumniCardApplications = useAppStore(state => state.setAlumniCardApplications);
  const alumniCardForms = useAppStore(state => state.alumniCardForms);
  const setAlumniCardForms = useAppStore(state => state.setAlumniCardForms);
  const academicCatalog = useAppStore(state => state.academicCatalog);
  const setAcademicCatalog = useAppStore(state => state.setAcademicCatalog);
  const featureSurveys = useAppStore(state => state.featureSurveys);
  const setFeatureSurveys = useAppStore(state => state.setFeatureSurveys);

  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);
  const setFeatureAlumniCard = useAppStore(state => state.setFeatureAlumniCard);



  const featureSSPLeaderboard = useAppStore(state => state.featureSSPLeaderboard);
  const setFeatureSSPLeaderboard = useAppStore(state => state.setFeatureSSPLeaderboard);
  const showInstitutionalStats = useAppStore(state => state.showInstitutionalStats);
  const setShowInstitutionalStats = useAppStore(state => state.setShowInstitutionalStats);
  const institutionalStatsData = useAppStore(state => state.institutionalStatsData);
  const setInstitutionalStatsData = useAppStore(state => state.setInstitutionalStatsData);
  const academicApprovals = useAppStore(state => state.academicApprovals);
  const setAcademicApprovals = useAppStore(state => state.setAcademicApprovals);
  const groups = useAppStore(state => state.groups);
  const setGroups = useAppStore(state => state.setGroups);
  const sspEnabled = useAppStore(state => state.sspEnabled);
  const setSspEnabled = useAppStore(state => state.setSspEnabled);
  const sspUsers = useAppStore(state => state.sspUsers);
  const liveRooms = useAppStore(state => state.liveRooms);
  const setSspUsers = useAppStore(state => state.setSspUsers);
  const featureAlumniAssocToggle = useAppStore(state => state.featureAlumniAssocToggle);
  const setFeatureAlumniAssocToggle = useAppStore(state => state.setFeatureAlumniAssocToggle);
  const featureCareerCheckup = useAppStore(state => state.featureCareerCheckup);
  const setFeatureCareerCheckup = useAppStore(state => state.setFeatureCareerCheckup);
  const featureCareerFair = useAppStore(state => state.featureCareerFair);
  const setFeatureCareerFair = useAppStore(state => state.setFeatureCareerFair);
  const featureSEMAcademy = useAppStore(state => state.featureSEMAcademy);
  const setFeatureSEMAcademy = useAppStore(state => state.setFeatureSEMAcademy);
  const [activeTab, setActiveTab]       = useState('overview');

  React.useEffect(() => {
    if (activeTab === 'sem' && !featureSEMAcademy) {
      setActiveTab('cms_news');
    }
  }, [activeTab, featureSEMAcademy]);
  const [activeCategory, setActiveCategory] = useState('genel');
  const [searchQuery, setSearchQuery] = useState('');
  const [alumniCards]                    = useState(ALUMNI_CARDS);
  
  const [showMore,   setShowMore]        = useState(false);

  const messages = useAppStore(state => state.messages);
  const unread  = useMemo(() => (messages || []).filter(m=>!m?.read).length, [messages]);
  const pending = useMemo(() => (jobs || []).filter(j=>j?.status==='Beklemede').length + (voluntaryInternships || []).filter(v=>v.status==='Taslak').length, [jobs, voluntaryInternships]);

  const renderPanel = () => {
    const p = { students, alumni, companies, jobs, setJobs, mentorships, voluntaryInternships, setVoluntaryInternships, surveys, semCourses, newsEvents: news, setNewsEvents: setNews, alumniCards, events, setEvents, academicApprovals, alumniCardApplications, setAlumniCardApplications, alumniCardForms, setAlumniCardForms, posts, setPosts, currentUser, setView, applications, setApplications, setActiveTab };
    switch(activeTab) {
      case 'basvuru_havuzu': return <CMSApplicationsPool applications={applications || []} setApplications={setApplications} setSelectedUserId={setSelectedUserId} setView={setView} currentUser={currentUser} />;
      case 'academic_catalog': return <CMSAcademicCatalog academicCatalog={academicCatalog || []} setAcademicCatalog={setAcademicCatalog} />;
      case 'academic_approvals': return <CMSAcademicApprovals academicApprovals={academicApprovals || []} setAcademicApprovals={setAcademicApprovals} students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} />;
      case 'cms_events':  return <CMSGeneralEvents generalEvents={generalEvents} setGeneralEvents={setGeneralEvents} />;
      case 'cms_ann':     return <CMSAnnouncements announcements={announcements || []} setAnnouncements={setAnnouncements} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_jobs':    return <CMSCareerOpportunities careerOpportunities={careerOpportunities} setCareerOpportunities={setCareerOpportunities} />;
      case 'cms_feat':    return <CMSFeatured featuredOpportunities={featuredOpportunities || []} setFeaturedOpportunities={setFeaturedOpportunities} />;
      case 'cms_ment':    return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'cms_groups':  return <CMSGroups groups={groups || []} setGroups={setGroups} currentUser={currentUser} />;
      case 'cms_ssp':     return <CMSSSP sspEnabled={sspEnabled} setSspEnabled={setSspEnabled} sspUsers={sspUsers} setSspUsers={setSspUsers} />;
      case 'cms_datapool': return <CMSDataPoolExport />;
      case 'cms_staff': return <CMSStaff />;
      case 'cms_sync':    return <CMSSyncCenter />;
      case 'overview':    return <OverviewPanel {...p}/>;
      case 'operasyon':   return <OperasyonPanel {...p}/>;
      case 'akademik':    return <AkademikPanel {...p} setActiveTab={setActiveTab} />;
      case 'cms_news':    return <CMSNews news={p.newsEvents || []} setNews={p.setNewsEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'companies':   return <CMSCompanies companies={companies || []} setCompanies={setCompanies} />;
      case 'students':    return <CMSStudents students={students || []} setStudents={setStudents} />;
      case 'academic_staff': return <CMSAcademicStaff academicStaff={academicStaff || []} setAcademicStaff={setAcademicStaff} />;
      case 'alumni':      return <CMSAlumni alumni={alumni || []} setAlumni={setAlumni} surveys={surveys} setSurveys={setSurveys} currentUser={currentUser} setPosts={setPosts} posts={posts} setView={setView} />;
      case 'mezun_dernek':return <CMSAlumniAssoc setView={setView} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'kart':        return <CMSAlumniCard alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications} alumniCardForms={alumniCardForms} setAlumniCardForms={setAlumniCardForms} />;
      case 'ilan':        return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} setApplications={setApplications} setSelectedUserId={setSelectedUserId} setView={setView} />;
      case 'etkinlik':    return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'mentorluk':   return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'cms_mentorship_pool': return <CMSMentorshipPool />;
      case 'gonullu':     return <CMSVoluntaryInternships volunteerInterns={voluntaryInternships || []} setVolunteerInterns={setVoluntaryInternships} />;
      case 'sem':         return <CMSSEMCourses semCourses={semCourses || []} setSemCourses={setSemCourses} posts={posts} setPosts={setPosts} currentUser={currentUser} students={students || []} alumni={alumni || []} />;
      case 'mesajlar':    return <CMSMessages messages={messages || []} setMessages={useAppStore.getState().setMessages} />;
      case 'entegrasyon': return <CMSIntegrations />;
      case 'anket':       return <CMSSurveys surveys={surveys || []} setSurveys={setSurveys} posts={posts} setPosts={setPosts} currentUser={currentUser} announcements={announcements} setAnnouncements={setAnnouncements} students={students || []} alumni={alumni || []} />;
      case 'analytics':   return <CMSAnalytics students={students || []} alumni={alumni || []} companies={companies || []} jobs={jobs || []} applications={applications || []} />;
      case 'content_import': return <OfficialContentImport news={news || []} setNews={setNews} announcements={announcements || []} setAnnouncements={setAnnouncements} events={events || []} setEvents={setEvents} />;
      case 'kariyer_gunleri': return <CMSCareerFair />;
      case 'company_edu_requests': return <CMSCompanyEducationRequests />;
      case 'company_event_msgs': return <CMSCompanyEventMessages />;
      case 'cms_career_counseling': return <CMSCareerCounseling />;
      case 'cms_corporate_partnerships': return <CMSCorporatePartnerships />;
      case 'akademik_radar': return <CMSAcademicRadar />;
      case 'aday_havuzu': return <CMSCandidatePool />;
      case 'user_types': return <CMSUserTypeManager />;
      case 'audit_log': return <CMSAuditTrail />;
      case 'institutional_stats': return <InstitutionalStatsManager />;
      case 'platform_ayarlari': return <PlatformSettings featureSurveys={featureSurveys} setFeatureSurveys={setFeatureSurveys} featureAlumniCard={featureAlumniCard} setFeatureAlumniCard={setFeatureAlumniCard} showInstitutionalStats={showInstitutionalStats} setShowInstitutionalStats={setShowInstitutionalStats} institutionalStatsData={institutionalStatsData} setInstitutionalStatsData={setInstitutionalStatsData} featureAlumniAssocToggle={featureAlumniAssocToggle} setFeatureAlumniAssocToggle={setFeatureAlumniAssocToggle} featureCareerCheckup={featureCareerCheckup} setFeatureCareerCheckup={setFeatureCareerCheckup} featureCareerFair={featureCareerFair} setFeatureCareerFair={setFeatureCareerFair} featureSEMAcademy={featureSEMAcademy} setFeatureSEMAcademy={setFeatureSEMAcademy} />;

      case 'data_cleanup': return <DataCleanup students={students} setStudents={setStudents} alumni={alumni} setAlumni={setAlumni} companies={companies} setCompanies={setCompanies} messages={messages} setMessages={useAppStore.getState().setMessages} posts={posts} setPosts={setPosts} jobs={jobs} setJobs={setJobs} />;
      case 'cms_gallery': return <CMSGallery />;
      case 'cms_portfolios': return <CMSPortfolios />;
      case 'site_editor': return <CMSSiteEditor />;
      default:            return <OverviewPanel {...p}/>;
    }
  };

  const MAIN_TABS = [
    { id: 'overview', icon: <LayoutDashboard size={14}/>, label: 'Genel Bakış' },
    { id: 'basvuru_havuzu', icon: <Briefcase size={14}/>, label: 'İlan & Staj Başvuru Havuzu' },
    { id: 'cms_mentorship_pool', icon: <UserCheck size={14}/>, label: 'Mentörlük & Danışmanlık Havuzu' },
    { id: 'cms_datapool', icon: <Database size={14}/>, label: 'Veri Havuzu & Excel' },
    { id: 'operasyon', icon: <Activity size={14}/>, label: 'Operasyon' },
    { id: 'akademik', icon: <BookOpen size={14}/>, label: 'Akademik' },
    { id: 'alumni', icon: <Award size={14}/>, label: 'Mezun' },
    { id: 'students', icon: <GraduationCap size={14}/>, label: 'Öğrenci' },
    { id: 'academic_staff', icon: <Library size={14}/>, label: 'Akademik Personel' },
    { id: 'companies', icon: <Building2 size={14}/>, label: 'İşveren' },
    { id: 'cms_staff', icon: <Users size={14}/>, label: 'Kariyer Ofisi Kadrosu' },
    { id: 'mesajlar', icon: <MessageSquare size={14}/>, label: 'Mesajlar' },
  ];

  const MORE_TABS = [
    { id: 'data_cleanup', icon: <Trash2 size={14}/>, label: 'Demo Veri Temizliği', superAdminOnly: true },
    { id: 'ilan', icon: <Briefcase size={14}/>, label: 'İş & Staj İlanları' },
    { id: 'cms_feat', icon: <Star size={14}/>, label: 'Öne Çıkanlar' },
    { id: 'cms_jobs', icon: <TrendingUp size={14}/>, label: 'Kariyer Fırsatları' },
    { id: 'gonullu', icon: <Heart size={14}/>, label: 'Gönüllü Staj' },
    { id: 'mentorluk', icon: <Network size={14}/>, label: 'Mentorluk' },
    { id: 'etkinlik', icon: <Calendar size={14}/>, label: 'Kariyer Etkinlikleri' },
    { id: 'cms_events', icon: <Calendar size={14}/>, label: 'Genel Etkinlikler' },
    { id: 'kariyer_gunleri', icon: <Calendar size={14}/>, label: 'Geleneksel Kariyer Günleri' },
    { id: 'cms_news', icon: <Newspaper size={14}/>, label: 'Haberler' },
    { id: 'cms_ann', icon: <Megaphone size={14}/>, label: 'Duyurular' },
    { id: 'sem', icon: <BookOpen size={14}/>, label: 'Kariyer & Yetenek Akademisi' },
    { id: 'academic_catalog', icon: <BookOpen size={14}/>, label: 'Akademik Katalog' },
    { id: 'academic_approvals', icon: <CheckCircle size={14}/>, label: 'Akademik Onaylar' },
    { id: 'anket', icon: <ClipboardList size={14}/>, label: 'Anketler' },
    { id: 'analytics', icon: <BarChart3 size={14}/>, label: 'Analitik & Raporlar' },
    { id: 'entegrasyon', icon: <Radio size={14}/>, label: 'Entegrasyonlar' },
    { id: 'mezun_dernek', icon: <Users size={14}/>, label: 'Mezunlar Derneği' },
    { id: 'kart', icon: <CreditCard size={14}/>, label: 'Mezun Kartı' },
    { id: 'cms_groups', icon: <Users size={14}/>, label: 'Gruplar' },
    { id: 'cms_ssp', icon: <BookOpenKgb size={14}/>, label: 'KGB Sistemi' },
    { id: 'platform_ayarlari', icon: <Settings size={14}/>, label: 'Platform Ayarları', superAdminOnly: true },
    { id: 'akademik_radar', icon: <BookOpen size={14}/>, label: 'Akademik Radar & Onay Merkezi' },
    { id: 'aday_havuzu', icon: <Building2 size={14}/>, label: 'Aday Havuzunu Yönet & Takip Et' },
    { id: 'user_types', icon: <Users size={14}/>, label: 'Personel & Yetki Yönetimi', superAdminOnly: true },
    { id: 'audit_log', icon: <ShieldCheck size={14}/>, label: 'Denetim Logu & Aktivite Takibi', superAdminOnly: true },
    { id: 'site_editor', icon: <Palette size={14}/>, label: 'Site Düzenleyici', superAdminOnly: true },
    { id: 'cms_sync', icon: <Cloud size={14}/>, label: 'CMS Senkronizasyon', superAdminOnly: true },
    { id: 'institutional_stats', icon: <BarChart3 size={14}/>, label: 'Kurumsal İstatistikler', superAdminOnly: true },
    { id: 'cms_career_counseling', icon: <UserCheck size={14}/>, label: 'Bire Bir Kariyer Danışmanlığı & Randevular' },
    { id: 'cms_corporate_partnerships', icon: <Building2 size={14}/>, label: 'Sektör Protokolleri & Şirket Anlaşmaları' },
    { id: 'company_edu_requests', icon: <GraduationCap size={14}/>, label: 'Eğitim & Kampüs Etkinlik Talepleri' },
    { id: 'company_event_msgs', icon: <MessageSquare size={14}/>, label: 'Şirket Yönetici Mesaj Talepleri' },
    { id: 'content_import', icon: <FileText size={14}/>, label: 'Resmi İçerik Aktarımı' },
    { id: 'cms_ment', icon: <Network size={14}/>, label: 'Mentörlük Sistemi' },
    { id: 'cms_portfolios', icon: <FileText size={14}/>, label: 'CV & Portfolyo Onay Havuzu' },
    { id: 'cms_gallery', icon: <Camera size={14}/>, label: 'Medya & Etkinlik Galerisi' },
  ];

  const isSuperAdmin = academicRole === 'super_admin';

  const ALL_TABS = [...MAIN_TABS, ...MORE_TABS].filter(tab => {
    if (tab.id === 'anket' && !featureSurveys) return false;
    if (tab.id === 'kart' && !featureAlumniCard) return false;
    if (tab.id === 'cms_ssp' && !sspEnabled) return false;
    if (tab.id === 'sem' && !featureSEMAcademy) return false;
    if (tab.superAdminOnly && !isSuperAdmin) return false;
    return true;
  });

  // Arama filtresi
  const filteredPanels = searchQuery 
    ? ALL_TABS.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_TABS.filter(t => {
        const cat = PANEL_CATEGORIES.find(c => c.id === activeCategory);
        return cat ? cat.panels.includes(t.id) : false;
      });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 shrink-0 sticky top-0 z-40">
        
        <div className="flex items-center gap-3 pr-4 border-r border-gray-100 shrink-0">
          <Logo className="w-9 h-9 text-amber-700 bg-amber-50 rounded-xl p-1.5" />
          <div className="hidden sm:block">
            <h1 className="text-[14px] font-black text-gray-900 leading-tight">Yönetici Paneli</h1>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">{academicRole === 'super_admin' ? 'SÜPER ADMİN' : 'KARİYER OFİSİ'}</p>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-1.5 ml-4 flex-1 items-center">
          {PANEL_CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCategory(cat.id); setActiveTab(cat.panels[0]); setSearchQuery(''); }}
              className={`group flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold transition-all duration-300 whitespace-nowrap rounded-xl ${
                activeCategory === cat.id 
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border border-amber-500 font-black shadow-md shadow-amber-500/25'
                  : 'text-gray-500 hover:text-amber-800 hover:bg-amber-50/50 border border-transparent hover:shadow-sm'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${
                activeCategory === cat.id ? 'text-white font-black' : 'text-gray-500 group-hover:text-amber-600'
              }`}>
                {cat.icon}
              </span>
              <span className={activeCategory === cat.id ? 'text-white font-black' : ''}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            {pending>0&&(
              <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition" onClick={()=>{setSearchQuery(''); setActiveCategory('genel'); setActiveTab('operasyon');}}>
                <ClipboardList size={13}/> {pending} Onay
              </div>
            )}
            {unread>0&&(
              <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-red-100 transition" onClick={()=>{setSearchQuery(''); setActiveCategory('genel'); setActiveTab('mesajlar');}}>
                <Bell size={13}/> {unread} Mesaj
              </div>
            )}
          </div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="admin_cms" />
        </div>
      </header>

      {/* Alt Sekme Butonları (seçili kategorinin panelleri) */}
      <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 sticky top-[65px] z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap gap-2">
            {searchQuery && <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider self-center mr-1">"{searchQuery}" araması:</span>}
            {filteredPanels.map(tab => {
              const catId = PANEL_CATEGORIES.find(c => c.panels.includes(tab.id))?.id || 'genel';
              const activeThemeClass = 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black border-amber-500 shadow-md shadow-amber-500/25';
              const theme = {
                genel: { active: activeThemeClass, hoverText: 'group-hover:text-amber-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
                kullanici: { active: activeThemeClass, hoverText: 'group-hover:text-amber-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
                icerik: { active: activeThemeClass, hoverText: 'group-hover:text-amber-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
                sistem: { active: activeThemeClass, hoverText: 'group-hover:text-amber-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
              }[catId] || { active: activeThemeClass, hoverText: 'group-hover:text-amber-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' };

              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-300 border ${
                    activeTab === tab.id
                      ? theme.active
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === tab.id ? `text-white ${theme.iconGlow}` : `text-gray-500 ${theme.hoverText} ${theme.hoverGlow}`}`}>{tab.icon}</span>
                  <span className={activeTab === tab.id ? 'text-white' : theme.hoverText}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── İÇERİK ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full p-3 sm:p-4 lg:p-6 pb-28 sm:pb-20">
        <main className="flex-1 bg-transparent">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}


