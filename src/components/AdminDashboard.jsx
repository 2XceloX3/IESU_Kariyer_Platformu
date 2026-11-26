import React, { useState, useMemo, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import TopProfileMenu from './TopProfileMenu';
import OperasyonPanel from './admin/OperasyonPanel';
import CMSEvents from './admin/CMSEvents';
import CMSGeneralEvents from './admin/CMSGeneralEvents';
import CMSNews from './admin/CMSNews';
import CMSAnnouncements from './admin/CMSAnnouncements';
import CMSJobs from './admin/CMSJobs';
import CMSCareerOpportunities from './admin/CMSCareerOpportunities';
import CMSMentorship from './admin/CMSMentorship';
import CMSStudents from './admin/CMSStudents';
import CMSAlumni from './admin/CMSAlumni';
import CMSCompanies from './admin/CMSCompanies';
import CMSMessages from './admin/CMSMessages';
import PanelHeader from './admin/PanelHeader';
import Logo from './Logo';
import { calculateProtocolStatus } from '../services/protocolWorkflow';
import { canStaffAccessTab } from '../utils/staffAuth';
import { Badge, Card, StatCard, Tbl } from './admin/AdminShared';
import {
  LayoutDashboard, Users, Briefcase, Calendar,
  MessageSquare, GraduationCap, Building2, CreditCard,
  BarChart3, Network, ClipboardList, Search, Bell,
  UserCheck, FileText, Heart, Award, ShieldCheck,
  TrendingUp, Activity, Newspaper, Database, UserPlus,
  Settings, Megaphone, BookOpen as BookOpenKgb, Globe, X
} from 'lucide-react';

const CMSVoluntaryInternships = React.lazy(() => import('./admin/CMSVoluntaryInternships'));
const CMSSurveys = React.lazy(() => import('./admin/CMSSurveys'));
const CMSAnalytics = React.lazy(() => import('./admin/CMSAnalytics'));
const CMSCareerFair = React.lazy(() => import('./admin/CMSCareerFair'));
const PlatformSettings = React.lazy(() => import('./admin/PlatformSettings'));
const CMSAlumniAssoc = React.lazy(() => import('./admin/CMSAlumniAssoc'));
const CMSAlumniCard = React.lazy(() => import('./admin/CMSAlumniCard'));
const CMSSSP = React.lazy(() => import('./admin/CMSSSP'));
const CMSDataPoolExport = React.lazy(() => import('./admin/CMSDataPoolExport'));
const CMSStaff = React.lazy(() => import('./admin/CMSStaff'));
const CMSMentorshipPool = React.lazy(() => import('./admin/CMSMentorshipPool'));
const CMSCompanyEducationRequests = React.lazy(() => import('./admin/CMSCompanyEducationRequests'));
const CMSCareerCounseling = React.lazy(() => import('./admin/CMSCareerCounseling'));
const CMSCorporatePartnerships = React.lazy(() => import('./admin/CMSCorporatePartnerships'));
const CMSApplicationsPool = React.lazy(() => import('./admin/CMSApplicationsPool'));
const CMSUserTypeManager = React.lazy(() => import('./admin/CMSUserTypeManager'));

// ══════════════════════════════════════════════════════════════
//  KONTROL MERKEZİ (GENEL BAKIŞ)
// ══════════════════════════════════════════════════════════════
function OverviewPanel({
  students = [],
  alumni = [],
  jobs = [],
  events = [],
  announcements = [],
  mentorships = [],
  voluntaryInternships = [],
  surveys = [],
  applications = [],
  featureSurveys = true,
  isTabPermitted,
  navigateToTab,
  setView
}) {
  const messages = useAppStore(state => state.messages) || [];
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const companies = useAppStore(state => state.companies) || [];
  const corporateProtocols = useAppStore(state => state.corporateProtocols) || [];

  const pendingItems = [
    {
      label: 'İlan & Staj Başvuru Havuzu',
      val: (applications || []).filter(a => a?.status === 'Beklemede' || !a?.status).length,
      tab: 'basvuru_havuzu'
    },
    {
      label: 'Onay Bekleyen İlan',
      val: (jobs || []).filter(j => j?.status === 'Beklemede' || j?.status === 'Onay Bekliyor').length,
      tab: 'ilan'
    },
    {
      label: 'Staj Onay Bekliyor',
      val: (voluntaryInternships || []).filter(v => v?.status === 'Taslak' || v?.status === 'Onay Bekliyor').length,
      tab: 'gonullu'
    },
    {
      label: 'Mentor Eşleşme Bekliyor',
      val: (mentorships || []).filter(m => m?.status === 'Eşleştirme Bekliyor').length,
      tab: 'mentorluk'
    },
    {
      label: 'Bekleyen / Yaklaşan Protokol',
      val: (corporateProtocols || []).filter(p => {
        const st = calculateProtocolStatus(p);
        return st === 'PENDING_APPROVAL' || st === 'EXPIRING_SOON' || st === 'RENEWAL_REQUESTED';
      }).length,
      tab: 'cms_corporate_partnerships'
    },
    ...(featureSurveys ? [{
      label: 'Aktif Anket',
      val: (surveys || []).filter(s => s?.status === 'Aktif').length,
      tab: 'anket'
    }] : [])
  ].filter(item => !isTabPermitted || isTabPermitted(item.tab));

  const recentRequests = [
    ...(adminMessages || []).slice(0, 3).map(m => ({
      id: `adm-${m.id}`,
      read: m.status && m.status !== 'Beklemede',
      from: m.companyName || 'Kurumsal Firma',
      subject: m.subject || m.message || 'Kurumsal Talep',
      date: m.date || 'Yeni'
    })),
    ...(messages || []).slice(0, 3).map(m => ({
      id: `msg-${m.id}`,
      read: Boolean(m.read),
      from: m.senderName || m.from || 'Kullanıcı',
      subject: m.subject || m.content || '',
      date: m.date || (m.timestamp ? new Date(m.timestamp).toLocaleDateString('tr-TR') : '')
    }))
  ].slice(0, 4);

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader
        title="Kontrol Merkezi"
        sub="İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü günlük operasyon ve özet verileri"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {(!isTabPermitted || isTabPermitted('operasyon')) && (
              <button
                type="button"
                onClick={() => navigateToTab('operasyon')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black transition cursor-pointer flex items-center gap-1.5"
              >
                <Activity size={14} /> Onay & SGK Masası
              </button>
            )}
            {(!isTabPermitted || isTabPermitted('cms_datapool')) && (
              <button
                type="button"
                onClick={() => navigateToTab('cms_datapool')}
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-black transition cursor-pointer flex items-center gap-1.5"
              >
                <Database size={14} /> Excel Dışa Aktar
              </button>
            )}
            {setView && (
              <button
                type="button"
                onClick={() => setView('global_map')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition cursor-pointer flex items-center gap-1.5"
              >
                <Globe size={14} /> Küresel Mezun Haritası
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bekleyen İşlemler */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Bekleyen İşlemler</h3>
          <div className="space-y-2.5">
            {pendingItems.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">Yetkili olduğunuz alanlarda bekleyen işlem yok.</p>
            ) : (
              pendingItems.map(item => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => navigateToTab(item.tab)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-amber-50/70 transition-colors duration-200 cursor-pointer text-left"
                >
                  <span className="text-sm text-gray-700 font-semibold">{item.label}</span>
                  <span className={`text-lg font-black ${item.val > 0 ? 'text-red-600' : 'text-gray-400'}`}>{item.val}</span>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Son Talepler & Mesajlar */}
        <Card className="p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Son Talepler & Mesajlar</h3>
            {(!isTabPermitted || isTabPermitted('mesajlar')) && (
              <button
                type="button"
                onClick={() => navigateToTab('mesajlar')}
                className="text-xs font-bold text-[#990000] hover:underline cursor-pointer"
              >
                Tümünü Gör
              </button>
            )}
          </div>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">Henüz mesaj veya kurumsal talep bulunmuyor.</p>
            ) : (
              recentRequests.map(m => (
                <div key={m.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${m.read ? 'bg-gray-300' : 'bg-red-500'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{m.from}</p>
                    <p className="text-xs text-gray-500 truncate">{m.subject}</p>
                    <p className="text-[11px] text-gray-400">{m.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Platform Özeti */}
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">Paydaş Özeti</h3>
          <div className="space-y-3">
            <StatCard icon={<GraduationCap size={16} />} label="Aktif Öğrenci" value={(students || []).length} color="rose" />
            <StatCard icon={<Award size={16} />} label="Toplam Mezun" value={(alumni || []).length} color="emerald" />
            <StatCard icon={<Building2 size={16} />} label="Kurumsal İşveren" value={(companies || []).length} color="blue" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Son Eklenen İlanlar */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Son Eklenen İlanlar</h3>
            {(!isTabPermitted || isTabPermitted('ilan')) && (
              <button
                type="button"
                onClick={() => navigateToTab('ilan')}
                className="text-xs font-bold text-[#990000] hover:underline cursor-pointer"
              >
                İlanları Yönet
              </button>
            )}
          </div>
          <Tbl
            headers={['İlan', 'Firma', 'Tür', 'Durum']}
            rows={(jobs || []).slice(0, 5).map(j => [
              <span key="title" className="font-semibold text-gray-900">{j?.title}</span>,
              j?.company,
              <Badge key="type" status={j?.type} />,
              <Badge key="status" status={j?.status} />
            ])}
          />
        </Card>

        {/* Güncel Yayın & Kayıt Özeti */}
        <Card className="p-6">
          <h3 className="font-black text-gray-900 mb-4">Güncel Yayınlar & Kayıtlar</h3>
          <div className="space-y-4">
            {(events || []).slice(0, 2).map(e => (
              <div key={e.id} className="flex items-start gap-3 border-b border-gray-50 pb-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <Calendar size={14} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Etkinlik: {e?.title}</p>
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
                  <p className="text-sm font-bold text-gray-900">Duyuru: {a?.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a?.date || 'Yakın Zamanda'}</p>
                </div>
              </div>
            ))}
            {(alumni || []).slice(0, 1).map(a => (
              <div key={a?.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <UserPlus size={14} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Mezun Kaydı: {a?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a?.department}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SADELEŞTİRİLMİŞ, SIFIR MÜKERRER NAVİGASYON KATEGORİLERİ
//  (Arka plan aktarımları, senkronizasyon, sahte entegrasyon ve
//   geliştirici araçları yönetim paneli menüsünde gösterilmez.)
// ══════════════════════════════════════════════════════════════
const PANEL_CATEGORIES = [
  {
    id: 'genel',
    label: 'Genel Bakış',
    icon: <LayoutDashboard size={14} />,
    panels: ['overview', 'operasyon', 'mesajlar']
  },
  {
    id: 'kullanici',
    label: 'Öğrenci, Mezun & Firma',
    icon: <Users size={14} />,
    panels: ['students', 'alumni', 'companies', 'cms_mezun_dernek', 'kart', 'user_types', 'cms_staff']
  },
  {
    id: 'icerik',
    label: 'İçerik & Etkinlikler',
    icon: <FileText size={14} />,
    panels: ['cms_ann', 'cms_news', 'etkinlik', 'cms_events', 'kariyer_gunleri', 'company_edu_requests']
  },
  {
    id: 'kgm_danismanlik',
    label: 'İlan, Staj & Protokol',
    icon: <UserCheck size={14} />,
    panels: [
      'ilan',
      'basvuru_havuzu',
      'gonullu',
      'cms_corporate_partnerships',
      'cms_jobs',
      'mentorluk',
      'cms_mentorship_pool',
      'cms_ssp',
      'cms_career_counseling'
    ]
  },
  {
    id: 'sistem',
    label: 'Raporlama & Ayarlar',
    icon: <BarChart3 size={14} />,
    panels: ['analytics', 'cms_datapool', 'anket', 'platform_ayarlari']
  }
];

const TAB_ALIASES = {
  cms_ment: 'mentorluk',
  cms_alumni_assoc: 'cms_mezun_dernek',
  mezun_dernek: 'cms_mezun_dernek',
  site_editor: 'platform_ayarlari',
  institutional_stats: 'platform_ayarlari',
  company_event_msgs: 'mesajlar',
  aday_havuzu: 'basvuru_havuzu'
};

const SUPER_ADMIN_ONLY_TABS = new Set(['platform_ayarlari', 'user_types', 'cms_staff']);

const CLOSED_OR_BACKGROUND_TABS = new Set([
  'academic_staff', 'cms_clubs', 'academic_catalog', 'academic_approvals',
  'akademik', 'akademik_radar', 'cms_incubator', 'sem', 'cms_message_audit',
  'entegrasyon', 'cms_sync', 'content_import', 'firestore_backup',
  'data_cleanup', 'audit_log', 'world_map', 'cms_gallery', 'cms_portfolios',
  'cms_feat', 'cms_groups', 'kgm_console'
]);

const ALL_TAB_DEFINITIONS = [
  // 1. Genel Bakış
  { id: 'overview', icon: <LayoutDashboard size={14} />, label: 'Genel Bakış' },
  { id: 'operasyon', icon: <Activity size={14} />, label: 'Onay & SGK Masası' },
  { id: 'mesajlar', icon: <MessageSquare size={14} />, label: 'Gelen Talepler & Mesajlar' },

  // 2. Öğrenci, Mezun & Firma
  { id: 'students', icon: <GraduationCap size={14} />, label: 'Öğrenciler' },
  { id: 'alumni', icon: <Award size={14} />, label: 'Mezunlar' },
  { id: 'companies', icon: <Building2 size={14} />, label: 'Firmalar' },
  { id: 'cms_mezun_dernek', icon: <Users size={14} />, label: 'İESÜ Mezunlar Portalı' },
  { id: 'kart', icon: <CreditCard size={14} />, label: 'Mezun Kartı' },
  { id: 'user_types', icon: <ShieldCheck size={14} />, label: 'Personel & Yetki Yönetimi', superAdminOnly: true },
  { id: 'cms_staff', icon: <Users size={14} />, label: 'Web Ekip Kartları', superAdminOnly: true },

  // 3. İçerik & Etkinlikler
  { id: 'cms_ann', icon: <Megaphone size={14} />, label: 'Duyurular' },
  { id: 'cms_news', icon: <Newspaper size={14} />, label: 'Haberler' },
  { id: 'etkinlik', icon: <Calendar size={14} />, label: 'Kariyer Etkinlikleri' },
  { id: 'cms_events', icon: <Calendar size={14} />, label: 'Genel Etkinlikler' },
  { id: 'kariyer_gunleri', icon: <Calendar size={14} />, label: 'Kariyer Günleri' },
  { id: 'company_edu_requests', icon: <GraduationCap size={14} />, label: 'Firma Eğitim Talepleri' },

  // 4. İlan, Staj & Protokol
  { id: 'ilan', icon: <Briefcase size={14} />, label: 'İş & Staj İlanları' },
  { id: 'basvuru_havuzu', icon: <ClipboardList size={14} />, label: 'Başvuru Havuzu' },
  { id: 'gonullu', icon: <Heart size={14} />, label: 'Gönüllü Staj' },
  { id: 'cms_corporate_partnerships', icon: <Building2 size={14} />, label: 'Sektör Protokolleri' },
  { id: 'cms_jobs', icon: <TrendingUp size={14} />, label: 'Kariyer Fırsatları' },
  { id: 'mentorluk', icon: <Network size={14} />, label: 'Mentörlük Sistemi' },
  { id: 'cms_mentorship_pool', icon: <UserCheck size={14} />, label: 'Mentörlük Talepleri' },
  { id: 'cms_ssp', icon: <BookOpenKgb size={14} />, label: 'KGB Sistemi' },
  { id: 'cms_career_counseling', icon: <UserCheck size={14} />, label: 'Kariyer Danışmanlığı' },

  // 5. Raporlama & Ayarlar
  { id: 'analytics', icon: <BarChart3 size={14} />, label: 'Analitik & YÖKAK Raporları' },
  { id: 'cms_datapool', icon: <Database size={14} />, label: 'Veri Havuzu & Excel' },
  { id: 'anket', icon: <ClipboardList size={14} />, label: 'Anketler' },
  { id: 'platform_ayarlari', icon: <Settings size={14} />, label: 'Platform Ayarları', superAdminOnly: true }
];

// ══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard({
  currentUser,
  userRole,
  academicRole,
  setView,
  setSelectedUserId,
  initialTab
}) {
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const news = useAppStore(state => state.news);
  const setNews = useAppStore(state => state.setNews);
  const announcements = useAppStore(state => state.announcements);
  const setAnnouncements = useAppStore(state => state.setAnnouncements);
  const events = useAppStore(state => state.events);
  const setEvents = useAppStore(state => state.setEvents);
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
  const alumniCardApplications = useAppStore(state => state.alumniCardApplications);
  const setAlumniCardApplications = useAppStore(state => state.setAlumniCardApplications);
  const alumniCardForms = useAppStore(state => state.alumniCardForms);
  const setAlumniCardForms = useAppStore(state => state.setAlumniCardForms);
  const featureSurveys = useAppStore(state => state.featureSurveys);
  const setFeatureSurveys = useAppStore(state => state.setFeatureSurveys);
  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);
  const setFeatureAlumniCard = useAppStore(state => state.setFeatureAlumniCard);
  const showInstitutionalStats = useAppStore(state => state.showInstitutionalStats);
  const setShowInstitutionalStats = useAppStore(state => state.setShowInstitutionalStats);
  const institutionalStatsData = useAppStore(state => state.institutionalStatsData);
  const setInstitutionalStatsData = useAppStore(state => state.setInstitutionalStatsData);
  const sspEnabled = useAppStore(state => state.sspEnabled);
  const setSspEnabled = useAppStore(state => state.setSspEnabled);
  const sspUsers = useAppStore(state => state.sspUsers);
  const setSspUsers = useAppStore(state => state.setSspUsers);
  const featureAlumniAssocToggle = useAppStore(state => state.featureAlumniAssocToggle);
  const setFeatureAlumniAssocToggle = useAppStore(state => state.setFeatureAlumniAssocToggle);
  const featureCareerCheckup = useAppStore(state => state.featureCareerCheckup);
  const setFeatureCareerCheckup = useAppStore(state => state.setFeatureCareerCheckup);
  const featureCareerFair = useAppStore(state => state.featureCareerFair);
  const setFeatureCareerFair = useAppStore(state => state.setFeatureCareerFair);
  const messages = useAppStore(state => state.messages);
  const adminMessages = useAppStore(state => state.adminMessages) || [];

  const normalizeTabId = (rawTab) => {
    if (!rawTab) return 'overview';
    return TAB_ALIASES[rawTab] || rawTab;
  };

  const [activeTab, setActiveTab] = useState(() => {
    if (initialTab) return normalizeTabId(initialTab);
    try {
      const queued = sessionStorage.getItem('iesu_cms_initial_tab');
      if (queued) {
        sessionStorage.removeItem('iesu_cms_initial_tab');
        return normalizeTabId(queued);
      }
    } catch { /* intentional */ }
    return 'overview';
  });

  const [activeCategory, setActiveCategory] = useState(() => {
    const startTab = normalizeTabId(initialTab || activeTab);
    const foundCat = PANEL_CATEGORIES.find(c => c.panels.includes(startTab));
    return foundCat ? foundCat.id : 'genel';
  });

  const [searchQuery, setSearchQuery] = useState('');

  const navigateToTab = (targetTabId) => {
    const resolved = normalizeTabId(targetTabId);
    setActiveTab(resolved);
    const foundCat = PANEL_CATEGORIES.find(c => c.panels.includes(resolved));
    if (foundCat) setActiveCategory(foundCat.id);
    setSearchQuery('');
  };

  useEffect(() => {
    if (initialTab) {
      navigateToTab(initialTab);
    }
  }, [initialTab]);

  // KVKK Gereği: Eski gizli mesaj izleme kalıntısı varsa yerel depolamadan temizlenir
  useEffect(() => {
    try { localStorage.removeItem('iesu_platform_messages_audit_v1'); } catch { /* intentional */ }
  }, []);

  const unread = useMemo(
    () =>
      (messages || []).filter(m => !m?.read).length +
      (adminMessages || []).filter(m => m?.status === 'Beklemede').length,
    [messages, adminMessages]
  );

  const pending = useMemo(
    () =>
      (jobs || []).filter(j => j?.status === 'Beklemede' || j?.status === 'Onay Bekliyor').length +
      (voluntaryInternships || []).filter(v => v?.status === 'Taslak' || v?.status === 'Onay Bekliyor').length,
    [jobs, voluntaryInternships]
  );

  // Sıkı RBAC: Yalnızca gerçek Süper Yönetici (admin) oturumu superAdminOnly modüllere erişebilir; Personel (staff) sınırlı operasyonel yetkiye sahiptir
  const isStaffSession = userRole === 'staff' || currentUser?.role === 'staff';
  const isSuperAdmin = !isStaffSession && Boolean(
    userRole === 'superadmin' ||
    userRole === 'super_admin' ||
    userRole === 'admin' ||
    academicRole === 'super_admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'admin'
  );

  const isTabPermittedForSession = (tabId) => {
    const resolved = normalizeTabId(tabId);
    if (CLOSED_OR_BACKGROUND_TABS.has(resolved)) return false;
    if (resolved === 'anket' && !featureSurveys) return false;
    if (resolved === 'kart' && !featureAlumniCard) return false;
    if (SUPER_ADMIN_ONLY_TABS.has(resolved) && !isSuperAdmin) return false;
    if (isStaffSession && !canStaffAccessTab(currentUser, resolved)) return false;
    return true;
  };

  const ALL_TABS = useMemo(
    () =>
      ALL_TAB_DEFINITIONS.filter(tab => {
        if (CLOSED_OR_BACKGROUND_TABS.has(tab.id)) return false;
        if (tab.id === 'anket' && !featureSurveys) return false;
        if (tab.id === 'kart' && !featureAlumniCard) return false;
        if ((tab.superAdminOnly || SUPER_ADMIN_ONLY_TABS.has(tab.id)) && !isSuperAdmin) return false;
        if (isStaffSession && !canStaffAccessTab(currentUser, tab.id)) return false;
        return true;
      }),
    [featureSurveys, featureAlumniCard, isSuperAdmin, isStaffSession, currentUser]
  );

  const VISIBLE_CATEGORIES = useMemo(
    () => PANEL_CATEGORIES.filter(cat => cat.panels.some(p => ALL_TABS.some(t => t.id === p))),
    [ALL_TABS]
  );

  const filteredPanels = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase('tr-TR');
    if (q) {
      return ALL_TABS.filter(t => t.label.toLocaleLowerCase('tr-TR').includes(q));
    }
    const cat = VISIBLE_CATEGORIES.find(c => c.id === activeCategory) || VISIBLE_CATEGORIES[0];
    if (!cat) return [];
    return cat.panels
      .map(id => ALL_TABS.find(t => t.id === id))
      .filter(Boolean);
  }, [searchQuery, ALL_TABS, VISIBLE_CATEGORIES, activeCategory]);

  const renderPanel = () => {
    const overviewProps = {
      students,
      alumni,
      jobs,
      events,
      announcements,
      mentorships,
      voluntaryInternships,
      surveys,
      applications,
      featureSurveys,
      isTabPermitted: isTabPermittedForSession,
      navigateToTab,
      setView
    };

    const resolvedTab = normalizeTabId(activeTab);
    if (!isTabPermittedForSession(resolvedTab)) {
      return <OverviewPanel {...overviewProps} />;
    }

    switch (resolvedTab) {
      case 'overview':
        return <OverviewPanel {...overviewProps} />;
      case 'operasyon':
        return <OperasyonPanel />;
      case 'mesajlar':
        return <CMSMessages messages={messages || []} setMessages={useAppStore.getState().setMessages} />;
      case 'students':
        return <CMSStudents students={students || []} setStudents={setStudents} />;
      case 'alumni':
        return <CMSAlumni alumni={alumni || []} setAlumni={setAlumni} surveys={surveys} setSurveys={setSurveys} currentUser={currentUser} setPosts={setPosts} posts={posts} setView={setView} />;
      case 'companies':
        return <CMSCompanies companies={companies || []} setCompanies={setCompanies} />;
      case 'cms_mezun_dernek':
        return <CMSAlumniAssoc setView={setView} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'kart':
        return <CMSAlumniCard alumniCardApplications={alumniCardApplications} setAlumniCardApplications={setAlumniCardApplications} alumniCardForms={alumniCardForms} setAlumniCardForms={setAlumniCardForms} />;
      case 'user_types':
        return <CMSUserTypeManager />;
      case 'cms_staff':
        return <CMSStaff />;
      case 'cms_ann':
        return <CMSAnnouncements announcements={announcements || []} setAnnouncements={setAnnouncements} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_news':
        return <CMSNews news={news || []} setNews={setNews} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'etkinlik':
        return <CMSEvents events={events || []} setEvents={setEvents} posts={posts} setPosts={setPosts} currentUser={currentUser} />;
      case 'cms_events':
        return <CMSGeneralEvents generalEvents={generalEvents} setGeneralEvents={setGeneralEvents} />;
      case 'kariyer_gunleri':
        return <CMSCareerFair />;
      case 'company_edu_requests':
        return <CMSCompanyEducationRequests />;
      case 'ilan':
        return <CMSJobs jobs={jobs || []} setJobs={setJobs} applications={applications || []} setApplications={setApplications} setSelectedUserId={setSelectedUserId} setView={setView} />;
      case 'basvuru_havuzu':
        return <CMSApplicationsPool applications={applications || []} setApplications={setApplications} setSelectedUserId={setSelectedUserId} setView={setView} currentUser={currentUser} />;
      case 'gonullu':
        return <CMSVoluntaryInternships volunteerInterns={voluntaryInternships || []} setVolunteerInterns={setVoluntaryInternships} />;
      case 'cms_corporate_partnerships':
        return <CMSCorporatePartnerships />;
      case 'cms_jobs':
        return <CMSCareerOpportunities careerOpportunities={careerOpportunities} setCareerOpportunities={setCareerOpportunities} />;
      case 'mentorluk':
        return <CMSMentorship mentorships={mentorships || []} setMentorships={setMentorships} />;
      case 'cms_mentorship_pool':
        return <CMSMentorshipPool />;
      case 'cms_ssp':
        return <CMSSSP sspEnabled={sspEnabled} setSspEnabled={setSspEnabled} sspUsers={sspUsers} setSspUsers={setSspUsers} />;
      case 'cms_career_counseling':
        return <CMSCareerCounseling />;
      case 'analytics':
        return <CMSAnalytics students={students || []} alumni={alumni || []} companies={companies || []} jobs={jobs || []} applications={applications || []} />;
      case 'cms_datapool':
        return <CMSDataPoolExport />;
      case 'anket':
        return <CMSSurveys surveys={surveys || []} setSurveys={setSurveys} posts={posts} setPosts={setPosts} currentUser={currentUser} announcements={announcements} setAnnouncements={setAnnouncements} students={students || []} alumni={alumni || []} />;
      case 'platform_ayarlari':
        return (
          <PlatformSettings
            featureSurveys={featureSurveys}
            setFeatureSurveys={setFeatureSurveys}
            featureAlumniCard={featureAlumniCard}
            setFeatureAlumniCard={setFeatureAlumniCard}
            showInstitutionalStats={showInstitutionalStats}
            setShowInstitutionalStats={setShowInstitutionalStats}
            institutionalStatsData={institutionalStatsData}
            setInstitutionalStatsData={setInstitutionalStatsData}
            featureAlumniAssocToggle={featureAlumniAssocToggle}
            setFeatureAlumniAssocToggle={setFeatureAlumniAssocToggle}
            featureCareerCheckup={featureCareerCheckup}
            setFeatureCareerCheckup={setFeatureCareerCheckup}
            featureCareerFair={featureCareerFair}
            setFeatureCareerFair={setFeatureCareerFair}
          />
        );
      default:
        return <OverviewPanel {...overviewProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="bg-white dark:bg-[#131c31] border-b border-gray-100 dark:border-slate-800 px-5 py-3 flex items-center gap-4 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3 pr-4 border-r border-gray-100 dark:border-slate-800 shrink-0">
          <Logo className="w-9 h-9 text-amber-700 bg-amber-50 dark:bg-amber-500/15 rounded-xl p-1.5" />
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigateToTab('overview')}
            onKeyDown={(e) => { if (e.key === 'Enter') navigateToTab('overview'); }}
            className="hidden sm:block cursor-pointer select-none group"
            title="Genel Bakışa Dön"
          >
            <h1 className="text-[14px] font-black text-gray-900 dark:text-slate-100 leading-tight group-hover:text-amber-800 dark:group-hover:text-amber-300 transition">
              {isStaffSession ? 'Personel Çalışma Paneli' : 'Yönetici Paneli'}
            </h1>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>{isStaffSession ? (currentUser?.staffTitle || 'KURUMSAL PERSONEL') : (academicRole === 'super_admin' ? 'SÜPER YÖNETİCİ' : 'KARİYER OFİSİ')}</span>
            </p>
          </div>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar gap-1.5 ml-2 flex-1 items-center">
          {VISIBLE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                const firstAllowed = cat.panels.find(p => ALL_TABS.some(t => t.id === p)) || 'overview';
                setActiveTab(firstAllowed);
                setSearchQuery('');
              }}
              className={`group flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold transition-all duration-300 whitespace-nowrap rounded-xl cursor-pointer ${
                activeCategory === cat.id
                  ? (isStaffSession
                      ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-800 text-white border border-indigo-500 font-black shadow-md shadow-indigo-500/25'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white border border-amber-500 font-black shadow-md shadow-amber-500/25')
                  : 'text-gray-600 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-slate-800 border border-transparent hover:shadow-sm'
              }`}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${
                activeCategory === cat.id ? 'text-white font-black' : 'text-gray-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300'
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
          <div className="hidden lg:flex items-center gap-2 mr-1">
            {pending > 0 && isTabPermittedForSession('operasyon') && (
              <button
                type="button"
                className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/25 transition"
                onClick={() => navigateToTab('operasyon')}
              >
                <ClipboardList size={13} /> {pending} Onay
              </button>
            )}
            {unread > 0 && isTabPermittedForSession('mesajlar') && (
              <button
                type="button"
                className="flex items-center gap-1.5 bg-red-50 dark:bg-rose-500/15 border border-red-200 dark:border-rose-500/30 text-red-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-red-100 dark:hover:bg-rose-500/25 transition"
                onClick={() => navigateToTab('mesajlar')}
              >
                <Bell size={13} /> {unread} Mesaj
              </button>
            )}
          </div>
          {isStaffSession && (
            <button
              type="button"
              onClick={() => setView?.('staff')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px] font-black transition cursor-pointer"
            >
              ← Çalışma Masam
            </button>
          )}
          <TopProfileMenu
            currentUser={currentUser}
            userRole={userRole}
            setView={setView}
            setSelectedUserId={setSelectedUserId}
            academicRole={academicRole}
            currentView="admin_cms"
          />
        </div>
      </header>

      {/* Alt Sekme Butonları + Hızlı Modül Filtresi */}
      <div className="bg-white dark:bg-[#131c31] border-b border-gray-200 dark:border-slate-800 shadow-sm shrink-0 sticky top-[65px] z-30">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {searchQuery && (
              <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider self-center mr-1">
                "{searchQuery}" sonuçları:
              </span>
            )}
            {filteredPanels.length === 0 ? (
              <span className="text-xs text-gray-400 font-medium py-1">Eşleşen modül bulunamadı.</span>
            ) : (
              filteredPanels.map(tab => {
                const isSelected = normalizeTabId(activeTab) === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => navigateToTab(tab.id)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? (isStaffSession
                            ? 'bg-gradient-to-r from-indigo-700 to-slate-800 text-white font-black border-indigo-500 shadow-md shadow-indigo-500/20'
                            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-black border-amber-500 shadow-md shadow-amber-500/25')
                        : 'bg-white dark:bg-slate-800/80 text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/80 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className={`transition-transform duration-200 group-hover:scale-110 ${isSelected ? 'text-white' : 'text-gray-500 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-300'}`}>
                      {tab.icon}
                    </span>
                    <span className={isSelected ? 'text-white' : 'group-hover:text-amber-700 dark:group-hover:text-amber-300'}>
                      {tab.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="relative w-full sm:w-56 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Modül ara..."
              aria-label="Yönetim modülü ara"
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-800 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Aramayı temizle"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── İÇERİK ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full p-3 sm:p-4 lg:p-6 pb-8">
        <main className="flex-1 bg-transparent">
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#990000] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            {renderPanel()}
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
