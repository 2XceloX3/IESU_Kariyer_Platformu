import React, { useState, useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import TopProfileMenu from './TopProfileMenu';

import { Megaphone, Star, Trophy } from 'lucide-react';
import CMSEvents from './admin/CMSEvents';
import CMSNews from './admin/CMSNews';
import CMSAnnouncements from './admin/CMSAnnouncements';
import CMSJobs from './admin/CMSJobs';
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
import CMSAlumniAssoc from './admin/CMSAlumniAssoc';
import CMSAlumniCard from './admin/CMSAlumniCard';
import CMSGroups from './admin/CMSGroups';
import CMSClubs from './admin/CMSClubs';
import CMSSSP from './admin/CMSSSP';
import CMSLiveRooms from './admin/CMSLiveRooms';
import CMSDataPoolExport from './admin/CMSDataPoolExport';


import PanelHeader from './admin/PanelHeader';
import Logo from './Logo';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  MessageSquare, GraduationCap, Building2, CreditCard,
  BarChart3, Network, ClipboardList, LogOut,
  ChevronDown, ChevronUp, Search, Bell, BellIcon,
  CheckCircle, XCircle, Plus, Trash2, Send,
  UserCheck, BookOpen, FileText, Heart, Award, ShieldCheck, Library,
  TrendingUp, Activity, Eye, Edit, Newspaper, Database, UserPlus, ShieldAlert, Settings, MessageCircle, Wand2, Radio, Brain
} from 'lucide-react';

import { STUDENTS, ALUMNI, COMPANIES, ALUMNI_CARDS, JOBS_INIT, MENTORSHIPS_INIT, VOLUNTEER_INIT, MESSAGES_INIT, SURVEYS_INIT, SEM_INIT, NEWS_INIT, EVENTS_INIT, ORG } from '../data/mockAdminData';
import { Badge, Card, StatCard, Progress, Tbl, BtnGreen, BtnRed, BtnPrimary } from './admin/AdminShared';

// ══════════════════════════════════════════════════════════════
//  PANELS
// ══════════════════════════════════════════════════════════════


// ── 1. Kontrol Merkezi ────────────────────────────────────────


function OverviewPanel({ students = [], alumni = [], jobs = [], events = [], announcements = [],  mentorships = [], voluntaryInternships = [], surveys = [], academicApprovals = [], setView }) {
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
              { label:'Onay Bekleyen İlan',       val: (jobs || []).filter(j=>j?.status==='Beklemede').length,              color:'amber'   },
              { label:'Staj Onay Bekliyor',        val: (voluntaryInternships || []).filter(v=>v.status==='Taslak').length, color:'orange' },
              { label:'Akademik Profil Onayı',    val: (academicApprovals || []).filter(a=>a.status==='Beklemede').length, color:'red' },
              { label:'Mentor Eşleşme Bekliyor',  val: (mentorships || []).filter(m=>m.status==='Eşleştirme Bekliyor').length, color:'sky'  },
              { label:'Aktif Anket',               val: (surveys || []).filter(s=>s?.status==='Aktif').length,                color:'green'  },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
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
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-blue-600" />
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
        <Card className="p-5 border-l-4 border-blue-400">
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

function AkademikPanel({ students = [] }) {
  const avg = students?.length ? ((students || []).reduce((a,s)=>a+parseFloat(s?.gpa||0),0)/students.length).toFixed(2) : "0.00";
  const honor = (students || []).filter(s=>s?.gpa>=3.5).length;
  const withCV = (students || []).filter(s=>s?.cv).length;
  const [search, setSearch] = useState('');
  const filtered = (students || []).filter(s=>s?.name.toLowerCase().includes(search.toLowerCase())||s?.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Akademik Performans" sub="GPA, bölüm dağılımı ve öğrenci özeti" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<BarChart3 size={20}/>} label="Ortalama GPA" value={avg} sub="Tüm öğrenciler" color="blue"/>
        <StatCard icon={<Award size={20}/>} label="Yüksek Onur" value={honor} sub="GPA ≥ 3.5" color="green"/>
        <StatCard icon={<FileText size={20}/>} label="CV Yüklemiş" value={withCV} sub={`${(students || []).length-withCV} eksik`} color="orange"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">GPA Dağılımı</h3>
          <div className="space-y-3">
            {[
              {label:'3.5 – 4.0 (Yüksek Onur)',val:(students || []).filter(s=>s?.gpa>=3.5).length,color:'green'},
              {label:'3.0 – 3.5 (Onur)',        val:(students || []).filter(s=>s?.gpa>=3.0&&s?.gpa<3.5).length,color:'blue'},
              {label:'2.5 – 3.0 (Geçer)',       val:(students || []).filter(s=>s?.gpa>=2.5&&s?.gpa<3.0).length,color:'orange'},
              {label:'2.0 – 2.5 (Alt Sınır)',   val:(students || []).filter(s=>s?.gpa<2.5).length,color:'red'},
            ].map(g=>(
              <div key={g.label}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>{g.label}</span><span className="font-black text-gray-900">{g.val}</span>
                </div>
                <Progress value={g.val} max={(students || []).length || 1} color={g.color}/>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Öğrenci Listesi</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ara..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300"/>
            </div>
          </div>
          <Tbl
            headers={['Ad Soyad','Bölüm','Sınıf','GPA','CV','Durum']}
            rows={filtered.map(s=>[
              <span className="font-bold text-gray-900">{s?.name}</span>,
              s?.dept,
              `${s?.year}. Sınıf`,
              <span className={`font-black ${s?.gpa>=3.5?'text-emerald-600':s?.gpa>=3.0?'text-blue-600':'text-orange-600'}`}>{s?.gpa}</span>,
              s?.cv?<CheckCircle size={15} className="text-emerald-500"/>:<XCircle size={15} className="text-gray-400"/>,
              <Badge status={s?.status}/>
            ])}
          />
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SIDEBAR NAVIGATION CONFIG
// ══════════════════════════════════════════════════════════════
const PANEL_CATEGORIES = [
  { id: 'genel', label: 'Genel Bakış', icon: <LayoutDashboard size={14}/>, panels: ['overview', 'cms_datapool', 'operasyon', 'akademik'] },
  { id: 'kullanici', label: 'Kullanıcı Yönetimi', icon: <Users size={14}/>, panels: ['students', 'alumni', 'companies', 'academic_staff', 'mezun_dernek', 'sem', 'cms_groups'] },
  { id: 'birlik', label: 'Birlik Paneli', icon: <ShieldCheck size={14}/>, panels: ['clubs_pool', 'cms_ssp', 'cms_live_rooms'] },
  { id: 'icerik', label: 'İçerik & Platform', icon: <FileText size={14}/>, panels: ['cms_news', 'cms_ann', 'cms_events', 'cms_jobs', 'cms_feat', 'cms_ment', 'kariyer_gunleri'] },
  { id: 'sistem', label: 'Sistem & Analiz', icon: <Settings size={14}/>, panels: ['cms_datapool', 'cleanup', 'content_import', 'analytics', 'anket', 'kart', 'platform_ayarlari'] }
];

const MAIN_TABS = [
  { id:'overview',   label:'Kontrol Merkezi',    icon:<LayoutDashboard size={17}/> },
  { id:'cms_datapool', label:'Veri Havuzu & Excel', icon:<Database size={17}/> },
  { id:'operasyon',  label:'Operasyon Özeti',    icon:<Activity size={17}/> },
  { id:'akademik',   label:'Akademik Performans',icon:<TrendingUp size={17}/> },
  { id:'academic_catalog', label:'Akademik Katalog', icon:<Library size={17}/> },
  { id:'academic_approvals', label:'Akademik Bilgi Onayları', icon:<ShieldCheck size={17}/> },
  { id:'cms_news',    label:'Haberler (CMS)',   icon:<FileText size={17}/> },
  { id:'students',   label:'Aktif Öğrenciler',   icon:<Users size={17}/> },
  { id:'academic_staff', label:'Akademik Personel', icon:<BookOpen size={17}/> },
  { id:'alumni',     label:'Mezun Bilgi Havuzu', icon:<GraduationCap size={17}/> },
  { id:'companies',  label:'Firma Bilgi Havuzu', icon:<Building2 size={17}/> },
  { id:'mezun_dernek',label:'Mezun Derneği',     icon:<Heart size={17}/> },
  { id:'kart',       label:'Kart Başvuruları',   icon:<CreditCard size={17}/> },
  { id:'cms_jobs',   label:'İlan & Başvuru Havuzu', icon:<Briefcase size={17}/> },
  { id:'kariyer_gunleri', label:'Kariyer Günleri', icon:<Briefcase size={17}/> },
  { id:'cms_events', label:'Etkinlikler (CMS)',  icon:<Calendar size={17}/> },
  { id:'cms_ann',    label:'Duyurular (CMS)',    icon:<Megaphone size={17}/> },
  { id:'cms_feat',   label:'Öne Çıkanlar (CMS)', icon:<Star size={17}/> },
  { id:'cms_groups', label:'Topluluklar ve Gruplar', icon:<Users size={17}/> },
  { id:'clubs_pool', label:'Başvuru Havuzu', icon:<Users size={17}/> },
  { id:'mesajlar',   label:'İletişim Havuzu (Loglar)', icon:<MessageSquare size={17}/> },
];

const MORE_TABS = [
  { id:'cms_ment',   label:'Mentorluk (CMS)', icon:<UserCheck size={17}/> },
  { id:'gonullu',    label:'Gönüllü Staj',        icon:<Award size={17}/> },
  { id:'sem',        label:'SEM Kurs Yönetimi',   icon:<BookOpen size={17}/> },
  
  { id:'anket',      label:'Anket & Veri Havuzu',      icon:<BarChart3 size={17}/> },
  { id:'cms_ssp',    label:'SSP Puan Havuzu',   icon:<Award size={17}/> },
  { id:'cleanup',    label:'Veri Temizliği',      icon:<ShieldAlert size={17}/> },
  { id:'platform_ayarlari', label:'Platform Ayarları', icon:<Settings size={17}/> },
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
  const featureCareerCheckup = useAppStore(state => state.featureCareerCheckup);
  const setFeatureCareerCheckup = useAppStore(state => state.setFeatureCareerCheckup);
  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);
  const setFeatureAlumniCard = useAppStore(state => state.setFeatureAlumniCard);
  const featureClubsShowcase = useAppStore(state => state.featureClubsShowcase);
  const setFeatureClubsShowcase = useAppStore(state => state.setFeatureClubsShowcase);
  const featureClubApplications = useAppStore(state => state.featureClubApplications);
  const setFeatureClubApplications = useAppStore(state => state.setFeatureClubApplications);
  const featureCareerFair = useAppStore(state => state.featureCareerFair);
  const setFeatureCareerFair = useAppStore(state => state.setFeatureCareerFair);
  const featureSSPLeaderboard = useAppStore(state => state.featureSSPLeaderboard);
  const setFeatureSSPLeaderboard = useAppStore(state => state.setFeatureSSPLeaderboard);
  const clubs = useAppStore(state => state.clubs);
  const setClubs = useAppStore(state => state.setClubs);
  const clubApplications = useAppStore(state => state.clubApplications);
  const setClubApplications = useAppStore(state => state.setClubApplications);
  const academicApprovals = useAppStore(state => state.academicApprovals);
  const setAcademicApprovals = useAppStore(state => state.setAcademicApprovals);
  const groups = useAppStore(state => state.groups);
  const setGroups = useAppStore(state => state.setGroups);
  const sspEnabled = useAppStore(state => state.sspEnabled);
  const setSspEnabled = useAppStore(state => state.setSspEnabled);
  const sspUsers = useAppStore(state => state.sspUsers);
  const liveRooms = useAppStore(state => state.liveRooms);
  const setSspUsers = useAppStore(state => state.setSspUsers);
  const [activeTab, setActiveTab]       = useState('overview');
  const [activeCategory, setActiveCategory] = useState('genel');
  const [searchQuery, setSearchQuery] = useState('');
  const [alumniCards]                    = useState(ALUMNI_CARDS);
  
  const [showMore,   setShowMore]        = useState(false);

  const messages = useAppStore(state => state.messages);
  const unread  = useMemo(() => (messages || []).filter(m=>!m?.read).length, [messages]);
  const pending = useMemo(() => (jobs || []).filter(j=>j?.status==='Beklemede').length + (voluntaryInternships || []).filter(v=>v.status==='Taslak').length, [jobs, voluntaryInternships]);

  const renderPanel = () => {
    const p = { students, alumni, companies, jobs, setJobs, mentorships, voluntaryInternships, setVoluntaryInternships,   surveys, semCourses, newsEvents: news, setNewsEvents: setNews, alumniCards, events, setEvents, academicApprovals, alumniCardApplications, setAlumniCardApplications, alumniCardForms, setAlumniCardForms, posts, setPosts, currentUser, setView };
    switch(activeTab) {
      case 'academic_catalog': return <CMSAcademicCatalog academicCatalog={academicCatalog || []} setAcademicCatalog={setAcademicCatalog} />;
      case 'academic_approvals': return <CMSAcademicApprovals academicApprovals={academicApprovals || []} setAcademicApprovals={setAcademicApprovals} students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} />;
      case 'cms_events':  return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_ann':     return <CMSAnnouncements announcements={announcements || []} setAnnouncements={setAnnouncements} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_jobs':    return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} />;
      case 'cms_feat':    return <CMSFeatured featuredOpportunities={featuredOpportunities || []} setFeaturedOpportunities={setFeaturedOpportunities} />;
      case 'cms_ment':    return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'cms_groups':  return <CMSGroups groups={groups || []} setGroups={setGroups} currentUser={currentUser} />;
      case 'clubs_pool':  return <CMSClubs clubs={clubs} setClubs={setClubs} clubApplications={clubApplications} setClubApplications={setClubApplications} currentUser={currentUser} />;
      case 'cms_ssp':     return <CMSSSP sspEnabled={sspEnabled} setSspEnabled={setSspEnabled} sspUsers={sspUsers} setSspUsers={setSspUsers} />;
      case 'cms_live_rooms': return <CMSLiveRooms currentUser={currentUser} userRole={userRole} liveRooms={liveRooms} />;
      case 'cms_datapool': return <CMSDataPoolExport />;
      case 'overview':    return <OverviewPanel {...p}/>;
      case 'operasyon':   return <OperasyonPanel {...p}/>;
      case 'akademik':    return <AkademikPanel {...p}/>;
      case 'cms_news':    return <CMSNews news={p.newsEvents || []} setNews={p.setNewsEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'companies':   return <CMSCompanies companies={companies || []} setCompanies={setCompanies} />;
      case 'students':    return <CMSStudents students={students || []} setStudents={setStudents} />;
      case 'academic_staff': return <CMSAcademicStaff academicStaff={academicStaff || []} setAcademicStaff={setAcademicStaff} />;
      case 'alumni':      return <CMSAlumni alumni={alumni || []} setAlumni={setAlumni} surveys={surveys} setSurveys={setSurveys} currentUser={currentUser} setPosts={setPosts} posts={posts} />;
      case 'mezun_dernek':return <CMSAlumniAssoc posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'kart':        return <CMSAlumniCard alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications} alumniCardForms={alumniCardForms} setAlumniCardForms={setAlumniCardForms} />;
      case 'ilan':        return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} />;
      case 'etkinlik':    return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'mentorluk':   return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'gonullu':     return <CMSVoluntaryInternships volunteerInterns={voluntaryInternships || []} setVolunteerInterns={setVoluntaryInternships} />;
      case 'sem':         return <CMSSEMCourses semCourses={semCourses || []} setSemCourses={setSemCourses} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'mesajlar':    return <CMSMessages messages={messages || []} />;
      case 'entegrasyon': return <CMSIntegrations />;
      case 'anket':       return <CMSSurveys surveys={surveys || []} setSurveys={setSurveys} posts={posts} setPosts={setPosts} currentUser={currentUser} announcements={announcements} setAnnouncements={setAnnouncements} students={students || []} alumni={alumni || []} />;
      case 'analytics':   return <CMSAnalytics students={students || []} alumni={alumni || []} companies={companies || []} jobs={jobs || []} applications={applications || []} />;
      case 'content_import': return <OfficialContentImport news={news || []} setNews={setNews} announcements={announcements || []} setAnnouncements={setAnnouncements} events={events || []} setEvents={setEvents} />;
      case 'cleanup':     return <DataCleanup students={students || []} setStudents={setStudents} alumni={alumni || []} setAlumni={setAlumni} companies={companies || []} setCompanies={setCompanies} messages={messages || []} posts={posts || []} setPosts={setPosts} jobs={jobs || []} setJobs={setJobs} />;
      case 'kariyer_gunleri': return <CMSCareerFair />;
      case 'platform_ayarlari': return <PlatformSettings featureSurveys={featureSurveys} setFeatureSurveys={setFeatureSurveys} featureCareerCheckup={featureCareerCheckup} setFeatureCareerCheckup={setFeatureCareerCheckup} featureAlumniCard={featureAlumniCard} setFeatureAlumniCard={setFeatureAlumniCard} featureClubsShowcase={featureClubsShowcase} setFeatureClubsShowcase={setFeatureClubsShowcase} featureClubApplications={featureClubApplications} setFeatureClubApplications={setFeatureClubApplications} featureCareerFair={featureCareerFair} setFeatureCareerFair={setFeatureCareerFair} featureSSPLeaderboard={featureSSPLeaderboard} setFeatureSSPLeaderboard={setFeatureSSPLeaderboard} sspEnabled={sspEnabled} setSspEnabled={setSspEnabled} />;
      case 'cms_datapool': return <CMSDataPoolExport />;

      default:            return <OverviewPanel {...p}/>;
    }
  };

  const MAIN_TABS = [
    { id: 'overview', icon: <LayoutDashboard size={14}/>, label: 'Genel Bakış' },
    { id: 'cms_datapool', icon: <Database size={14}/>, label: 'Veri Havuzu & Excel' },
    { id: 'operasyon', icon: <Activity size={14}/>, label: 'Operasyon' },
    { id: 'akademik', icon: <BookOpen size={14}/>, label: 'Akademik' },
    { id: 'students', icon: <GraduationCap size={14}/>, label: 'Öğrenci' },
    { id: 'alumni', icon: <Award size={14}/>, label: 'Mezun' },
    { id: 'companies', icon: <Building2 size={14}/>, label: 'İşveren' },
    { id: 'academic_staff', icon: <Library size={14}/>, label: 'Akademik Personel' },
    { id: 'mesajlar', icon: <MessageSquare size={14}/>, label: 'Mesajlar' },
  ];

  const MORE_TABS = [
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
    { id: 'sem', icon: <BookOpen size={14}/>, label: 'SEM Eğitimleri' },
    { id: 'academic_catalog', icon: <BookOpen size={14}/>, label: 'Akademik Katalog' },
    { id: 'academic_approvals', icon: <CheckCircle size={14}/>, label: 'Akademik Onaylar' },
    { id: 'anket', icon: <ClipboardList size={14}/>, label: 'Anketler' },
    { id: 'analytics', icon: <BarChart3 size={14}/>, label: 'Analitik & Raporlar' },
    { id: 'content_import', icon: <FileText size={14}/>, label: 'İçerik İçe Aktarma' },
    { id: 'entegrasyon', icon: <Radio size={14}/>, label: 'Entegrasyonlar' },
    { id: 'mezun_dernek', icon: <Users size={14}/>, label: 'Mezunlar Derneği' },
    { id: 'kart', icon: <CreditCard size={14}/>, label: 'Mezun Kartı' },
    { id: 'cms_groups', icon: <Users size={14}/>, label: 'Gruplar' },
    { id: 'clubs_pool', icon: <Users size={14}/>, label: 'Öğrenci Kulüpleri' },
    { id: 'cms_ssp', icon: <Trophy size={14}/>, label: 'SSP Puanlama' },
    { id: 'cms_live_rooms', icon: <Radio size={14}/>, label: 'Canlı Yayın Odaları' },
    { id: 'cleanup', icon: <Trash2 size={14}/>, label: 'Veri Temizliği' },
    { id: 'platform_ayarlari', icon: <Settings size={14}/>, label: 'Platform Ayarları' },

  ];

  const ALL_TABS = [...MAIN_TABS, ...MORE_TABS].filter(tab => {
    if (tab.id === 'anket' && !featureSurveys) return false;
    if (tab.id === 'kart' && !featureAlumniCard) return false;
    if (tab.id === 'cms_ssp' && !sspEnabled) return false;
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
          <Logo className="w-9 h-9 text-red-700 bg-red-50 rounded-xl p-1.5" />
          <div className="hidden sm:block">
            <h1 className="text-[14px] font-black text-gray-900 leading-tight">Yönetici Paneli</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{academicRole === 'super_admin' ? 'SÜPER ADMİN' : 'KARİYER OFİSİ'}</p>
          </div>
        </div>

        <div className="relative w-64 xl:w-80 ml-2 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Panel ara... (örn: ilan, öğrenci)" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[13px] font-medium text-gray-700 focus:outline-none focus:bg-white focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all placeholder:text-gray-500"
          />
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-1 flex-1 mx-2 justify-end">
          {PANEL_CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => { setActiveCategory(cat.id); setActiveTab(cat.panels[0]); setSearchQuery(''); }}
              className={`group flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold transition-all duration-300 whitespace-nowrap rounded-lg ${
                activeCategory === cat.id 
                  ? (() => {
                      switch (cat.id) {
                        case 'genel': return 'bg-slate-100 text-slate-800 border border-slate-300 shadow-sm';
                        case 'kullanici': return 'bg-slate-100 text-slate-800 border border-slate-300 shadow-sm';
                        case 'icerik': return 'bg-slate-100 text-slate-800 border border-slate-300 shadow-sm';
                        case 'sistem': return 'bg-slate-100 text-slate-800 border border-slate-300 shadow-sm';
                        case 'birlik': return 'bg-slate-100 text-slate-800 border border-slate-300 shadow-sm';
                        default: return 'bg-slate-100 text-slate-800 border border-slate-300 shadow-sm';
                      }
                    })()
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-transparent hover:shadow-sm'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${
                activeCategory === cat.id 
                  ? (() => {
                      switch (cat.id) {
                        case 'genel': return 'text-[#0A2342]';
                        case 'kullanici': return 'text-[#0A2342]';
                        case 'icerik': return 'text-[#0A2342]';
                        case 'sistem': return 'text-[#0A2342]';
                        case 'birlik': return 'text-[#0A2342]';
                        default: return 'text-red-600 shadow-sm';
                      }
                    })()
                  : (() => {
                      switch (cat.id) {
                        case 'genel': return 'text-gray-500 group-hover:text-blue-500 group-hover:shadow-sm';
                        case 'kullanici': return 'text-gray-500 group-hover:text-purple-500 group-hover:shadow-sm';
                        case 'icerik': return 'text-gray-500 group-hover:text-emerald-500 group-hover:shadow-sm';
                        case 'sistem': return 'text-gray-500 group-hover:text-amber-500 group-hover:shadow-sm';
                        case 'birlik': return 'text-gray-500 group-hover:text-pink-500 group-hover:shadow-sm';
                        default: return 'text-gray-500 group-hover:text-red-500 group-hover:shadow-sm';
                      }
                    })()
              }`}>
                {cat.icon}
              </span>
              {cat.label}
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
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />
        </div>
      </header>

      {/* Alt Sekme Butonları (seçili kategorinin panelleri) */}
      <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 sticky top-[65px] z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-2.5">
          <div className="flex flex-wrap gap-2">
            {searchQuery && <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider self-center mr-1">"{searchQuery}" araması:</span>}
            {filteredPanels.map(tab => {
              const catId = PANEL_CATEGORIES.find(c => c.panels.includes(tab.id))?.id || 'genel';
              const theme = {
                genel: { active: 'bg-[#0A2342] text-white border-[#0A2342] shadow-sm', hoverText: 'group-hover:text-blue-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
                kullanici: { active: 'bg-[#0A2342] text-white border-[#0A2342] shadow-sm', hoverText: 'group-hover:text-purple-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
                icerik: { active: 'bg-[#0A2342] text-white border-[#0A2342] shadow-sm', hoverText: 'group-hover:text-emerald-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
                sistem: { active: 'bg-[#0A2342] text-white border-[#0A2342] shadow-sm', hoverText: 'group-hover:text-amber-500', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' },
              }[catId] || { active: 'bg-[#0A2342] text-white border-[#0A2342] shadow-sm', hoverText: 'group-hover:text-red-600', iconGlow: 'shadow-sm', hoverGlow: 'group-hover:shadow-sm' };

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
                  <span className={activeTab === tab.id ? '' : theme.hoverText}>{tab.label}</span>
                </button>
              );
            })}
            {filteredPanels.length === 0 && (
              <p className="text-[13px] font-medium text-gray-500 p-2">Eşleşen panel bulunamadı.</p>
            )}
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


