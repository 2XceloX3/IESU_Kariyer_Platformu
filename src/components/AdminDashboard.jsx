import CMSFirestoreBackup from './admin/CMSFirestoreBackup';
import KGMManagementConsole from './admin/KGMManagementConsole';
import React, { useState, useMemo, useEffect } from 'react';
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
const CMSMessageAudit = React.lazy(() => import('./admin/CMSMessageAudit'));
const CMSIntegrations = React.lazy(() => import('./admin/CMSIntegrations'));
const CMSAcademicStaff = React.lazy(() => import('./admin/CMSAcademicStaff'));
const CMSVoluntaryInternships = React.lazy(() => import('./admin/CMSVoluntaryInternships'));
const CMSSEMCourses = React.lazy(() => import('./admin/CMSSEMCourses'));
const CMSAcademicCatalog = React.lazy(() => import('./admin/CMSAcademicCatalog'));
const CMSAcademicApprovals = React.lazy(() => import('./admin/CMSAcademicApprovals'));
const DataCleanup = React.lazy(() => import('./admin/DataCleanup'));
const OfficialContentImport = React.lazy(() => import('./admin/OfficialContentImport'));
const CMSSurveys = React.lazy(() => import('./admin/CMSSurveys'));
const CMSAnalytics = React.lazy(() => import('./admin/CMSAnalytics'));
const CMSCareerFair = React.lazy(() => import('./admin/CMSCareerFair'));
const PlatformSettings = React.lazy(() => import('./admin/PlatformSettings'));
const InstitutionalStatsManager = React.lazy(() => import('./admin/InstitutionalStatsManager'));
const CMSAlumniAssoc = React.lazy(() => import('./admin/CMSAlumniAssoc'));
const CMSAlumniCard = React.lazy(() => import('./admin/CMSAlumniCard'));
const CMSGroups = React.lazy(() => import('./admin/CMSGroups'));
const CMSSSP = React.lazy(() => import('./admin/CMSSSP'));
const CMSDataPoolExport = React.lazy(() => import('./admin/CMSDataPoolExport'));
const CMSStaff = React.lazy(() => import('./admin/CMSStaff'));
const CMSSyncCenter = React.lazy(() => import('./admin/CMSSyncCenter'));
const CMSMentorshipPool = React.lazy(() => import('./admin/CMSMentorshipPool'));
const CMSCompanyEducationRequests = React.lazy(() => import('./admin/CMSCompanyEducationRequests'));
const CMSCompanyEventMessages = React.lazy(() => import('./admin/CMSCompanyEventMessages'));
const CMSCareerCounseling = React.lazy(() => import('./admin/CMSCareerCounseling'));
const CMSCorporatePartnerships = React.lazy(() => import('./admin/CMSCorporatePartnerships'));
import { calculateProtocolStatus } from '../services/protocolWorkflow';
const CMSAcademicRadar = React.lazy(() => import('./admin/CMSAcademicRadar'));
const CMSCandidatePool = React.lazy(() => import('./admin/CMSCandidatePool'));
const CMSApplicationsPool = React.lazy(() => import('./admin/CMSApplicationsPool'));
const CMSUserTypeManager = React.lazy(() => import('./admin/CMSUserTypeManager'));
const CMSAuditTrail = React.lazy(() => import('./admin/CMSAuditTrail'));
const CMSSiteEditor = React.lazy(() => import('./admin/CMSSiteEditor'));
const CMSGallery = React.lazy(() => import('./admin/CMSGallery'));
const CMSPortfolios = React.lazy(() => import('./admin/CMSPortfolios'));
const CMSClubs = React.lazy(() => import('./admin/CMSClubs'));
const CMSIncubator = React.lazy(() => import('./admin/CMSIncubator'));
const CMSWorldMap = React.lazy(() => import('./admin/CMSWorldMap'));
const CMSKalbis = React.lazy(() => import('./admin/CMSKalbis'));
const AkademikPanel = React.lazy(() => import('./admin/AkademikPanel'));
import PanelHeader from './admin/PanelHeader';
import Logo from './Logo';
import {
  LayoutDashboard, Users, Briefcase, Calendar, Crown,
  MessageSquare, GraduationCap, Building2, CreditCard,
  BarChart3, Network, ClipboardList, LogOut,
  ChevronDown, ChevronUp, Search, Bell, BellIcon,
  CheckCircle, XCircle, Plus, Trash2, Send, ArrowRight,
  UserCheck, BookOpen, FileText, Heart, Award, ShieldCheck, Library,
  TrendingUp, Activity, Eye, Edit, Newspaper, Database, UserPlus, ShieldAlert, Settings, MessageCircle, Wand2, Radio, Brain, Sparkles, Cloud, Code2, Palette,
  Camera, Rocket, Globe
} from 'lucide-react';

import { STUDENTS, ALUMNI, COMPANIES, ALUMNI_CARDS, JOBS_INIT, MENTORSHIPS_INIT, VOLUNTEER_INIT, MESSAGES_INIT, SURVEYS_INIT, SEM_INIT, NEWS_INIT, EVENTS_INIT, ORG } from '../data/mockAdminData';
import { Badge, Card, StatCard, Progress, Tbl, BtnGreen, BtnRed, BtnPrimary } from './admin/AdminShared';

// ══════════════════════════════════════════════════════════════
//  PANELS
// ══════════════════════════════════════════════════════════════


// ── 1. Kontrol Merkezi ────────────────────────────────────────


function OverviewPanel({ students = [], alumni = [], jobs = [], events = [], announcements = [], mentorships = [], voluntaryInternships = [], surveys = [], academicApprovals = [], applications = [], setActiveTab, setView }) {
  const messages = useAppStore(state => state.messages);
  const companies = useAppStore(state => state.companies) || [];
  const academicStaff = useAppStore(state => state.academicStaff) || [];
  const corporateProtocols = useAppStore(state => state.corporateProtocols) || [];
  
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
              { label:'Süresi Yaklaşan Protokol', val: (corporateProtocols || []).filter(p => { const st = calculateProtocolStatus(p); return st === 'EXPIRING_SOON' || st === 'RENEWAL_REQUESTED'; }).length, color:'rose', tab:'cms_corporate_partnerships' },
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
              <span key="title" className="font-semibold text-gray-900">{j?.title}</span>,
              j?.company, <Badge key="type" status={j?.type}/>, <Badge key="status" status={j?.status}/>
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
                <span key="title" className="font-bold text-gray-900">{j?.title}</span>,
                j?.company, <Badge key="type" status={j?.type}/>, j?.date,
                <div key="actions" className="flex gap-2">
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
                <span key="student" className="font-bold">{v.student}</span>,
                v.company, v.position, v.startDate,
                <div key="actions" className="flex gap-2">
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
  { 
    id: 'genel', 
    label: 'Genel Bakış', 
    icon: <LayoutDashboard size={14}/>, 
    panels: ['overview', 'cms_kalbis', 'operasyon', 'basvuru_havuzu', 'aday_havuzu', 'mesajlar', 'cms_datapool', 'world_map'] 
  },
  { 
    id: 'kullanici', 
    label: 'Kullanıcı Yönetimi', 
    icon: <Users size={14}/>, 
    panels: ['students', 'alumni', 'companies', 'academic_staff', 'cms_staff', 'cms_clubs', 'cms_mezun_dernek', 'kart', 'cms_groups', 'user_types'] 
  },
  { 
    id: 'icerik', 
    label: 'İçerik & Platform', 
    icon: <FileText size={14}/>, 
    panels: ['cms_news', 'cms_ann', 'cms_events', 'etkinlik', 'cms_jobs', 'ilan', 'cms_feat', 'cms_portfolios', 'cms_gallery', 'gonullu', 'sem', 'academic_catalog', 'academic_approvals', 'kariyer_gunleri', 'content_import', 'mesajlar'] 
  },
  { 
    id: 'kgm_danismanlik', 
    label: 'Kariyer Danışmanlığı & Sektör', 
    icon: <UserCheck size={14}/>, 
    panels: ['cms_career_counseling', 'mentorluk', 'cms_ment', 'cms_mentorship_pool', 'cms_incubator', 'cms_corporate_partnerships', 'company_edu_requests', 'company_event_msgs', 'akademik', 'akademik_radar', 'cms_ssp'] 
  },
  { 
    id: 'sistem', 
    label: 'Sistem & Analiz', 
    icon: <Settings size={14}/>, 
    panels: ['cms_kalbis', 'site_editor', 'institutional_stats', 'platform_ayarlari', 'cms_sync', 'data_cleanup', 'cms_datapool', 'content_import', 'analytics', 'anket', 'audit_log', 'akademik_radar', 'aday_havuzu', 'entegrasyon', 'cms_ssp'] 
  }
];

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard({
  currentUser, userRole, academicRole,
  setView, setSelectedUserId, initialTab
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
  const clubs = useAppStore(state => state.clubs);
  const setClubs = useAppStore(state => state.setClubs);
  const clubApplications = useAppStore(state => state.clubApplications);
  const setClubApplications = useAppStore(state => state.setClubApplications);
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
  const initialCategory = React.useMemo(() => {
    if (!initialTab) return 'genel';
    const foundCat = PANEL_CATEGORIES.find(c => c.panels?.includes(initialTab));
    return foundCat ? foundCat.id : 'genel';
  }, [initialTab]);

  const [activeTab, setActiveTab]       = useState(() => initialTab || 'overview');
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      const foundCat = PANEL_CATEGORIES.find(c => c.panels?.includes(initialTab));
      if (foundCat) setActiveCategory(foundCat.id);
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (activeTab === 'sem' && !featureSEMAcademy) {
      setActiveTab('cms_news');
    }
  }, [activeTab, featureSEMAcademy]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alumniCards]                    = useState(ALUMNI_CARDS);
  
  const [showMore,   setShowMore]        = useState(false);

  // 389834 Gizli Güvenlik Protokolü (İletişim & Mesajlaşma Denetimi)
  const [isAuditUnlocked, setIsAuditUnlocked] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretError, setSecretError] = useState(false);

  // 389834 Klavye dizilimi dinleyicisi: Yönetici panelindeyken 389834 yazıldığında aktifleşir / tekrar yazıldığında kilitlenir
  useEffect(() => {
    let digitBuffer = '';
    const handleKeySequence = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

      if (e.key === 'Escape') {
        setIsAuditUnlocked(false);
        setShowSecretModal(false);
        setSecretInput('');
        return;
      }

      if (isInputFocused) return;

      if (e.key >= '0' && e.key <= '9') {
        digitBuffer = (digitBuffer + e.key).slice(-6);
        const validSecurityCode = import.meta.env.VITE_AUDIT_SECURITY_CODE || '389834';
        if (digitBuffer === validSecurityCode) {
          setIsAuditUnlocked(prev => {
            const next = !prev;
            if (next) {
              setActiveTab('cms_message_audit');
              if (window.toast) window.toast.success('🔒 Gizli İletişim Denetim Protokolü Açıldı (389834)');
            } else {
              setActiveTab('overview');
              if (window.toast) window.toast.info('🔒 İletişim Denetim Protokolü Kilitlendi ve Gizlendi');
            }
            return next;
          });
          digitBuffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeySequence);
    return () => window.removeEventListener('keydown', handleKeySequence);
  }, []);

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
      case 'cms_mezun_dernek': case 'cms_alumni_assoc': case 'mezun_dernek': return <CMSAlumniAssoc setView={setView} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
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
      case 'firestore_backup': return <CMSFirestoreBackup />;
      case 'kgm_console': return <KGMManagementConsole setView={setView} currentUser={currentUser} academicRole={academicRole} setSelectedUserId={setSelectedUserId} />;
      case 'institutional_stats': return <InstitutionalStatsManager />;
      case 'platform_ayarlari': return <PlatformSettings featureSurveys={featureSurveys} setFeatureSurveys={setFeatureSurveys} featureAlumniCard={featureAlumniCard} setFeatureAlumniCard={setFeatureAlumniCard} showInstitutionalStats={showInstitutionalStats} setShowInstitutionalStats={setShowInstitutionalStats} institutionalStatsData={institutionalStatsData} setInstitutionalStatsData={setInstitutionalStatsData} featureAlumniAssocToggle={featureAlumniAssocToggle} setFeatureAlumniAssocToggle={setFeatureAlumniAssocToggle} featureCareerCheckup={featureCareerCheckup} setFeatureCareerCheckup={setFeatureCareerCheckup} featureCareerFair={featureCareerFair} setFeatureCareerFair={setFeatureCareerFair} featureSEMAcademy={featureSEMAcademy} setFeatureSEMAcademy={setFeatureSEMAcademy} />;

      case 'data_cleanup': return <DataCleanup students={students} setStudents={setStudents} alumni={alumni} setAlumni={setAlumni} companies={companies} setCompanies={setCompanies} messages={messages} setMessages={useAppStore.getState().setMessages} posts={posts} setPosts={setPosts} jobs={jobs} setJobs={setJobs} />;
      case 'cms_gallery': return <CMSGallery />;
      case 'cms_portfolios': return <CMSPortfolios />;
      case 'cms_clubs': return <CMSClubs clubs={clubs || []} setClubs={setClubs} clubApplications={clubApplications || []} setClubApplications={setClubApplications} currentUser={currentUser} />;
      case 'cms_incubator': return <CMSIncubator />;
      case 'cms_message_audit': 
        if (!isAuditUnlocked) {
          return (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto my-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Yetkilendirilmemiş Güvenli Alan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Bu denetim masası özel güvenlik yetki protokolü ile korunmaktadır.</p>
              <button
                onClick={() => setShowSecretModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Güvenlik Protokol Kodunu Doğrula
              </button>
            </div>
          );
        }
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 border border-amber-500/30 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-amber-400 tracking-wider">GİZLİ İLETİŞİM DENETİM MASASI</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">Panelden çıktığınızda veya sayfayı yenilediğinizde bu alan otomatik kilitlenecektir.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAuditUnlocked(false);
                  setActiveTab('overview');
                  if (window.toast) window.toast.info('🔒 İletişim Denetim Masası Kilitlendi ve Gizlendi');
                }}
                className="px-3.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow cursor-pointer shrink-0"
                title="Şimdi Kilitle ve Gizle"
              >
                <span>Kilitle & Gizle</span>
              </button>
            </div>
            <CMSMessageAudit currentUser={currentUser} setView={setView} />
          </div>
        );
      case 'site_editor': return <CMSSiteEditor />;
      case 'world_map': return <CMSWorldMap />;
      case 'cms_kalbis': case 'kalbis': return <CMSKalbis currentUser={currentUser} setView={setView} />;
      default:            return <OverviewPanel {...p}/>;
    }
  };

  const MAIN_TABS = [
    { id: 'overview', icon: <LayoutDashboard size={14}/>, label: 'Genel Bakış' },
    { id: 'cms_kalbis', icon: <ShieldCheck size={14}/>, label: 'KALBİS Kalite Yönetim Sistemi' },
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
    { id: 'cms_mezun_dernek', icon: <Users size={14}/>, label: 'Mezunlar Portalı (CMS)' },
    { id: 'kart', icon: <CreditCard size={14}/>, label: 'Mezun Kartı' },
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
    { id: 'cms_incubator', icon: <Rocket size={14}/>, label: 'Kuluçka & Girişimcilik Projeleri' },
    { id: 'cms_clubs', icon: <Users size={14}/>, label: 'Öğrenci Kulüpleri & EK-1 Onay' },
    { id: 'cms_gallery', icon: <Camera size={14}/>, label: 'Medya & Etkinlik Galerisi' },
    { id: 'cms_message_audit', icon: <MessageSquare size={14}/>, label: 'Mesajlaşma & İletişim Denetimi', superAdminOnly: true },
    { id: 'world_map', icon: <Globe size={14}/>, label: 'Dünyadaki Mezunlarımız' },
  ];

  const [superAdminOverride, setSuperAdminOverride] = useState(false);
  const isSuperAdmin = superAdminOverride || userRole === 'superadmin' || userRole === 'super_admin' || userRole === 'admin' || academicRole === 'super_admin' || currentUser?.role === 'super_admin' || currentUser?.role === 'admin' || currentUser?.id === 'admin_1513' || currentUser?.name === 'Kariyer Geliştirme Koordinatörlüğü' || currentUser?.email === 'kariyer@iesu.edu.tr';

  const ALL_TABS = [...MAIN_TABS, ...MORE_TABS].filter(tab => {
    if (tab.id === 'cms_message_audit') return isAuditUnlocked;
    if (tab.id === 'anket' && !featureSurveys) return false;
    if (tab.id === 'kart' && !featureAlumniCard) return false;
    if (tab.id === 'cms_ssp' && !sspEnabled) return false;
    if (tab.id === 'sem' && !featureSEMAcademy) return false;
    if (tab.superAdminOnly && !isSuperAdmin) return false;
    return true;
  });

  // Arama filtresi (cms_message_audit asla standart kategori listesinde görünmez, yalnızca 389834 koduyla açıldığında aktif görünümdeyse listelenir)
  const filteredPanels = searchQuery 
    ? ALL_TABS.filter(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [
        ...ALL_TABS.filter(t => {
          if (t.id === 'cms_message_audit') return false;
          const cat = PANEL_CATEGORIES.find(c => c.id === activeCategory);
          return cat ? cat.panels.includes(t.id) : false;
        }),
        ...(isAuditUnlocked && activeTab === 'cms_message_audit' ? [
          { id: 'cms_message_audit', icon: <MessageSquare size={14}/>, label: '🔒 İletişim Denetim Masası' }
        ] : [])
      ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 shrink-0 sticky top-0 z-40">
        
        <div className="flex items-center gap-3 pr-4 border-r border-gray-100 shrink-0">
          <Logo className="w-9 h-9 text-amber-700 bg-amber-50 rounded-xl p-1.5" />
          <div 
            role="button"
            tabIndex={0}
            onClick={() => setShowSecretModal(true)}
            onKeyDown={(e) => { if (e.key === 'Enter') setShowSecretModal(true); }}
            className="hidden sm:block cursor-pointer select-none group"
            title="Güvenlik Doğrulama Kodu"
          >
            <h1 className="text-[14px] font-black text-gray-900 leading-tight group-hover:text-amber-800 transition">Yönetici Paneli</h1>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>{academicRole === 'super_admin' ? 'SÜPER ADMİN' : 'KARİYER OFİSİ'}</span>
              {isAuditUnlocked && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Denetim Masası Aktif" />}
            </p>
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
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full p-3 sm:p-4 lg:p-6 pb-8">
        <main className="flex-1 bg-transparent">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#990000] border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {renderPanel()}
          </React.Suspense>
        </main>
      </div>

      {/* ── COVERT PROTOCOL MODAL (389834) ── */}
      {showSecretModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-red-600" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200">GÜVENLİK YETKİ PROTOKOLÜ</h3>
                  <p className="text-[10px] text-slate-500 font-mono">DENETİM MASASI KİLİDİ</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowSecretModal(false); setSecretInput(''); setSecretError(false); }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs transition"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Özel denetim protokolünü etkinleştirmek için 6 haneli güvenlik yetki kodunu tuşlayınız:
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              const validSecurityCode = import.meta.env.VITE_AUDIT_SECURITY_CODE || '389834';
    if (secretInput.trim() === validSecurityCode) {
                setIsAuditUnlocked(true);
                setActiveTab('cms_message_audit');
                setShowSecretModal(false);
                setSecretInput('');
                setSecretError(false);
                if (window.toast) window.toast.success('🔒 Yetki Doğrulandı: İletişim Denetim Merkezi Açıldı');
              } else {
                setSecretError(true);
              }
            }} className="space-y-3">
              <input
                type="password"
                autoFocus
                maxLength={8}
                placeholder="••••••"
                value={secretInput}
                onChange={(e) => { setSecretInput(e.target.value); setSecretError(false); }}
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-center font-mono text-base tracking-[0.3em] text-amber-400 placeholder-slate-600 focus:outline-none transition"
              />
              {secretError && (
                <p className="text-[11px] font-bold text-rose-400 text-center animate-shake">Geçersiz güvenlik kodu.</p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowSecretModal(false); setSecretInput(''); setSecretError(false); }}
                  className="flex-1 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  Yetkilendir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


