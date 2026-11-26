import React, { useState, useMemo, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SafeAvatar from './shared/SafeAvatar';
import {
  STAFF_PERMISSION_GROUPS,
  DEFAULT_PERMISSIONS_BY_TYPE,
  resolveStaffPermissions
} from '../utils/staffAuth';
import {
  calculateProtocolStatus,
  exportBilateralProtocolDraftPdf
} from '../services/protocolWorkflow';
import { exportToCSV } from '../utils/export';
import {
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Award,
  Building2,
  MessageSquare,
  Database,
  ArrowRight,
  Send,
  UserCheck,
  Lock,
  Megaphone,
  Search,
  Download,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  FileText,
  Crown,
  SlidersHorizontal,
  RefreshCw,
  Mail,
  ExternalLink
} from 'lucide-react';

const GROUP_ICONS = {
  students_staj: GraduationCap,
  alumni: Award,
  companies_protocols: Building2,
  jobs_applications: Briefcase,
  content: Megaphone,
  mentorship: UserCheck,
  messages: MessageSquare,
  reports_export: Database
};

const PREVIEW_ROLE_OPTIONS = [
  { id: 'all', label: 'Tüm Personel Yetkileri (8/8)' },
  { id: '2', label: 'Önizle: İçerik Editörü (İçerik & Mesaj)' },
  { id: '3', label: 'Önizle: Mezun İlişkileri Sorumlusu' },
  { id: '4', label: 'Önizle: İşveren & Protokol Sorumlusu' },
  { id: '5', label: 'Önizle: Gözlemci / Raporcu' }
];

export default function StaffPortal({
  setView,
  setSelectedUserId,
  currentUser,
  userRole,
  academicRole
}) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveUser = currentUser || storeCurrentUser || {
    id: 'STAFF-104',
    name: 'Kurumsal Personel',
    role: 'staff',
    staffTitle: 'Kariyer Uzmanı',
    department: 'Kariyer Geliştirme Merkezi'
  };

  // Süper Yönetici önizlemesi ile gerçek Personel oturumunu kesin olarak ayır
  const isSuperAdminViewing = Boolean(
    userRole === 'admin' ||
    effectiveUser?.role === 'admin' ||
    academicRole === 'super_admin'
  );
  const [adminPreviewRole, setAdminPreviewRole] = useState('all');

  const students = useAppStore(state => state.students) || [];
  const alumni = useAppStore(state => state.alumni) || [];
  const companies = useAppStore(state => state.companies) || [];
  const setCompanies = useAppStore(state => state.setCompanies);
  const jobs = useAppStore(state => state.jobs) || [];
  const setJobs = useAppStore(state => state.setJobs);
  const applications = useAppStore(state => state.applications) || [];
  const voluntaryInternships = useAppStore(state => state.voluntaryInternships) || [];
  const setVoluntaryInternships = useAppStore(state => state.setVoluntaryInternships);
  const announcements = useAppStore(state => state.announcements) || [];
  const setAnnouncements = useAppStore(state => state.setAnnouncements);
  const posts = useAppStore(state => state.posts) || [];
  const setPosts = useAppStore(state => state.setPosts);
  const mentorships = useAppStore(state => state.mentorships) || [];
  const setMentorships = useAppStore(state => state.setMentorships);
  const messages = useAppStore(state => state.messages) || [];
  const setMessages = useAppStore(state => state.setMessages);
  const storeAdminMessages = useAppStore(state => state.adminMessages) || [];
  const setAdminMessages = useAppStore(state => state.setAdminMessages);
  const notifications = useAppStore(state => state.notifications) || [];
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);
  const storeProtocols = useAppStore(state => state.corporateProtocols) || [];
  const setCorporateProtocols = useAppStore(state => state.setCorporateProtocols);

  // Sadece gerçek personel oturumunda branch'i 'staff' yap — Süper Admin'i asla staff dalına kilitleme!
  useEffect(() => {
    if (!isSuperAdminViewing) {
      useAppStore.getState().setActivePortalBranch?.('staff');
    }
  }, [isSuperAdminViewing]);

  // Canlı protokol listesi (localStorage + store)
  const [localProtocols, setLocalProtocols] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('iesu_corporate_protocols_v1') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const corporateProtocols = useMemo(() => {
    const ids = new Set(localProtocols.map(p => p.id));
    return [...localProtocols, ...storeProtocols.filter(p => !ids.has(p.id))];
  }, [localProtocols, storeProtocols]);

  // Birleşik iletişim mesajları (web formu + firma talepleri + mesajlar)
  const mergedContactMessages = useMemo(() => {
    let localContacts = [];
    try {
      const saved = JSON.parse(localStorage.getItem('iesu_admin_messages_v1') || '[]');
      if (Array.isArray(saved)) {
        localContacts = saved.map((m, idx) => ({
          id: m.id || `CONTACT-${idx}`,
          sender: m.senderName || m.companyName || m.name || 'Web İletişim Formu',
          subject: m.subject || m.topic || 'Genel Talep',
          email: m.email || '-',
          content: m.message || m.content || '',
          date: m.date || 'Yeni',
          status: m.status || 'Beklemede',
          source: 'contact'
        }));
      }
    } catch { /* intentional */ }

    const corpMsgs = storeAdminMessages.map(m => ({
      id: m.id,
      sender: m.companyName || 'Kurumsal Firma',
      subject: m.subject || 'Firma Talebi',
      email: m.email || '-',
      content: m.message || '',
      date: m.date || 'Güncel',
      status: m.status || 'Beklemede',
      source: 'admin_msg'
    }));

    const dmMsgs = messages.map(m => ({
      id: m.id,
      sender: m.senderName || m.from || 'Kullanıcı',
      subject: m.subject || 'Platform Mesajı',
      email: m.email || '-',
      content: m.content || m.text || '',
      date: m.timestamp ? new Date(m.timestamp).toLocaleDateString('tr-TR') : (m.date || ''),
      status: m.read ? 'İncelendi' : 'Beklemede',
      source: 'dm'
    }));

    const seen = new Set();
    return [...corpMsgs, ...localContacts, ...dmMsgs].filter(item => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [storeAdminMessages, messages]);

  // Yetkili modüller (Süper Admin önizlemesinde rol simülasyonu desteklenir)
  const allowedGroupIds = useMemo(() => {
    if (isSuperAdminViewing) {
      if (adminPreviewRole === 'all') return STAFF_PERMISSION_GROUPS.map(g => g.id);
      return DEFAULT_PERMISSIONS_BY_TYPE[adminPreviewRole] || ['reports_export'];
    }
    return resolveStaffPermissions(effectiveUser);
  }, [isSuperAdminViewing, adminPreviewRole, effectiveUser]);

  const allowedSet = useMemo(() => new Set(allowedGroupIds), [allowedGroupIds]);
  const allowedGroups = useMemo(
    () => STAFF_PERMISSION_GROUPS.filter(g => allowedSet.has(g.id)),
    [allowedSet]
  );

  // Çalışma masası aktif sekmesi
  const [activeDesk, setActiveDesk] = useState('queue');
  const [globalSearch, setGlobalSearch] = useState('');
  const [deskSearch, setDeskSearch] = useState('');
  const [alumniFilter, setAlumniFilter] = useState('all'); // all | employed | mentor
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [msgReplyText, setMsgReplyText] = useState('');

  // Duyuru & içerik yayınlama formu
  const [contentForm, setContentForm] = useState({
    category: 'Duyuru',
    title: '',
    content: ''
  });

  // Personele özel kalıcı Günlük Görev / Takip Defteri
  const taskStorageKey = `iesu_staff_tasks_${effectiveUser?.username || effectiveUser?.id || 'default'}`;
  const [dailyTasks, setDailyTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(taskStorageKey) || 'null');
      if (Array.isArray(saved)) return saved;
    } catch { /* intentional */ }
    return [
      { id: 't1', text: 'Bekleyen firma ilanlarını kontrol edip yayına al', done: false, priority: 'Yüksek' },
      { id: 't2', text: 'Gönüllü / zorunlu staj başvurularının SGK belgelerini incele', done: false, priority: 'Normal' }
    ];
  });
  const [newTaskText, setNewTaskText] = useState('');

  const persistTasks = (next) => {
    setDailyTasks(next);
    try {
      localStorage.setItem(taskStorageKey, JSON.stringify(next));
    } catch { /* intentional */ }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    persistTasks([
      { id: `task-${Date.now()}`, text: newTaskText.trim(), done: false, priority: 'Normal' },
      ...dailyTasks
    ]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    persistTasks(dailyTasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    persistTasks(dailyTasks.filter(t => t.id !== id));
  };

  // Yetkili CMS sekmesini doğrudan aç
  const openCmsTab = (tabId) => {
    try {
      sessionStorage.setItem('iesu_cms_initial_tab', tabId);
    } catch { /* intentional */ }
    if (!isSuperAdminViewing) {
      useAppStore.getState().setActivePortalBranch?.('staff');
    }
    setView?.('admin_cms');
  };

  // Canlı bekleyen kuyruklar
  const pendingJobs = useMemo(
    () => jobs.filter(j => j?.status === 'Beklemede' || j?.status === 'Onay Bekliyor' || j?.status === 'Pending'),
    [jobs]
  );
  const pendingInternships = useMemo(
    () => voluntaryInternships.filter(v => v?.status === 'Taslak' || v?.status === 'Onay Bekliyor' || v?.status === 'Beklemede'),
    [voluntaryInternships]
  );
  const pendingProtocols = useMemo(
    () => corporateProtocols.filter(p => {
      const st = calculateProtocolStatus(p);
      return st === 'PENDING_APPROVAL' || st === 'UNDER_REVIEW' || st === 'RENEWAL_REQUESTED';
    }),
    [corporateProtocols]
  );
  const pendingFairApps = useMemo(
    () => careerFairApplications.filter(a => a?.status === 'Beklemede' || !a?.status),
    [careerFairApplications]
  );
  const pendingMentorships = useMemo(
    () => mentorships.filter(m => m?.status === 'Eşleştirme Bekliyor' || m?.status === 'Beklemede'),
    [mentorships]
  );
  const pendingMessages = useMemo(
    () => mergedContactMessages.filter(m => m.status === 'Beklemede'),
    [mergedContactMessages]
  );

  // Operasyon aksiyonları
  const handleJobDecision = (jobId, status) => {
    setJobs?.(prev => (prev || []).map(j => j.id === jobId ? { ...j, status } : j));
    window.toast?.success?.(status === 'Yayında' ? 'İlan onaylandı ve yayına alındı.' : 'İlan reddedildi.');
  };

  const handleInternshipDecision = (id, status) => {
    setVoluntaryInternships?.(prev => (prev || []).map(v => v.id === id ? { ...v, status } : v));
    window.toast?.success?.(status === 'Onaylı' ? 'Staj başvurusu onaylandı.' : 'Staj başvurusu reddedildi.');
  };

  const handleProtocolDecision = (protoId, nextStatus) => {
    const updated = corporateProtocols.map(p =>
      p.id === protoId
        ? { ...p, status: nextStatus, reviewedBy: effectiveUser?.name || 'KGM Personeli', reviewedAt: new Date().toISOString() }
        : p
    );
    setLocalProtocols(updated);
    setCorporateProtocols?.(updated);
    try {
      localStorage.setItem('iesu_corporate_protocols_v1', JSON.stringify(updated));
    } catch { /* intentional */ }
    window.toast?.success?.(
      nextStatus === 'ACTIVE'
        ? 'Kurumsal protokol onaylandı ve yürürlüğe alındı.'
        : nextStatus === 'REVISION_REQUESTED'
          ? 'Protokol için firmadan revizyon talep edildi.'
          : 'Protokol başvurusu reddedildi.'
    );
  };

  const handleFairDecision = (appId, status) => {
    setCareerFairApplications?.(prev => (prev || []).map(a => a.id === appId ? { ...a, status } : a));
    window.toast?.success?.(`Etkinlik/fuar talebi "${status}" olarak güncellendi.`);
  };

  const handleCompanyStatusToggle = (comp) => {
    const nextStatus = comp.status === 'Onaylı' ? 'Pasif' : 'Onaylı';
    setCompanies?.(prev => (prev || []).map(c => c.id === comp.id ? { ...c, status: nextStatus } : c));
    window.toast?.success?.(`${comp.name} durumu "${nextStatus}" olarak güncellendi.`);
  };

  const handleMentorshipApprove = (id) => {
    setMentorships?.(prev => (prev || []).map(m => m.id === id ? { ...m, status: 'Aktif' } : m));
    window.toast?.success?.('Mentörlük eşleşmesi onaylandı.');
  };

  const handlePublishContent = (e) => {
    e.preventDefault();
    if (!contentForm.title.trim() || !contentForm.content.trim()) {
      window.toast?.error?.('Başlık ve içerik alanları zorunludur.');
      return;
    }
    const today = new Date().toLocaleDateString('tr-TR');
    const newItem = {
      id: `STAFF-CNT-${Date.now()}`,
      title: contentForm.title.trim(),
      content: contentForm.content.trim(),
      category: contentForm.category,
      date: today,
      author: effectiveUser?.name || 'Kariyer Geliştirme Merkezi',
      status: 'Yayında'
    };
    setAnnouncements?.(prev => [newItem, ...(prev || [])]);
    setPosts?.(prev => [{
      id: `POST-${Date.now()}`,
      author: {
        id: effectiveUser?.id || 'STAFF',
        name: effectiveUser?.name || 'Kariyer Geliştirme Merkezi',
        title: effectiveUser?.staffTitle || 'Kurumsal Personel',
        avatar: effectiveUser?.avatar || '/iesu-logo.svg',
        role: isSuperAdminViewing ? 'admin' : 'staff'
      },
      title: newItem.title,
      content: `[${newItem.category}] ${newItem.title}\n\n${newItem.content}`,
      date: today,
      likes: 0,
      comments: [],
      status: 'Yayında'
    }, ...(prev || [])]);
    setContentForm({ category: 'Duyuru', title: '', content: '' });
    window.toast?.success?.(`${newItem.category} başarıyla yayınlandı.`);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements?.(prev => (prev || []).filter(a => a.id !== id));
    window.toast?.info?.('Duyuru yayından kaldırıldı.');
  };

  const handleReplyMessage = (e) => {
    e.preventDefault();
    const target = mergedContactMessages.find(m => m.id === selectedMsgId);
    if (!target || !msgReplyText.trim()) return;
    if (target.source === 'admin_msg') {
      setAdminMessages?.(prev => (prev || []).map(m => m.id === target.id ? { ...m, status: 'Yanıtlandı', reply: msgReplyText.trim() } : m));
    } else if (target.source === 'dm') {
      setMessages?.(prev => [
        ...(prev || []).map(m => m.id === target.id ? { ...m, read: true } : m),
        {
          id: `MSG-${Date.now()}`,
          senderId: effectiveUser?.id || 'staff',
          senderName: effectiveUser?.name || 'Kariyer Geliştirme Merkezi',
          receiverName: target.sender,
          content: msgReplyText.trim(),
          timestamp: Date.now(),
          read: true
        }
      ]);
    }
    setMsgReplyText('');
    window.toast?.success?.(`${target.sender} alıcısına yanıt kaydedildi.`);
  };

  // Yetkili alanlara göre sol navigasyon masaları
  const deskNavItems = useMemo(() => {
    const items = [
      {
        id: 'queue',
        label: 'Günlük İş Kuyruğu',
        icon: CheckSquare,
        badge:
          (allowedSet.has('jobs_applications') ? pendingJobs.length : 0) +
          (allowedSet.has('students_staj') ? pendingInternships.length : 0) +
          (allowedSet.has('companies_protocols') ? pendingProtocols.length + pendingFairApps.length : 0) +
          (allowedSet.has('mentorship') ? pendingMentorships.length : 0)
      }
    ];
    if (allowedSet.has('students_staj')) {
      items.push({ id: 'students_staj', label: 'Öğrenci & Staj Masası', icon: GraduationCap, badge: pendingInternships.length });
    }
    if (allowedSet.has('alumni')) {
      items.push({ id: 'alumni', label: 'Mezun & MBS Masası', icon: Award, badge: 0 });
    }
    if (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications')) {
      items.push({
        id: 'companies_jobs',
        label: 'Firma, İlan & Protokol',
        icon: Building2,
        badge: (allowedSet.has('jobs_applications') ? pendingJobs.length : 0) + (allowedSet.has('companies_protocols') ? pendingProtocols.length : 0)
      });
    }
    if (allowedSet.has('content')) {
      items.push({ id: 'content', label: 'İçerik & Duyuru Masası', icon: Megaphone, badge: 0 });
    }
    if (allowedSet.has('messages')) {
      items.push({ id: 'messages', label: 'Gelen Talepler & Mesajlar', icon: MessageSquare, badge: pendingMessages.length });
    }
    if (allowedSet.has('reports_export')) {
      items.push({ id: 'reports_export', label: 'Rapor & Excel Merkezi', icon: Download, badge: 0 });
    }
    return items;
  }, [allowedSet, pendingJobs.length, pendingInternships.length, pendingProtocols.length, pendingFairApps.length, pendingMentorships.length, pendingMessages.length]);

  useEffect(() => {
    if (!deskNavItems.some(i => i.id === activeDesk)) {
      setActiveDesk('queue');
    }
  }, [deskNavItems, activeDesk]);

  // Yetkili havuzlarda anlık çapraz arama
  const instantSearchResults = useMemo(() => {
    const q = globalSearch.trim().toLocaleLowerCase('tr-TR');
    if (q.length < 2) return [];
    const results = [];
    if (allowedSet.has('students_staj')) {
      students
        .filter(s => (s.name || '').toLocaleLowerCase('tr-TR').includes(q) || (s.department || '').toLocaleLowerCase('tr-TR').includes(q))
        .slice(0, 3)
        .forEach(s => results.push({ id: `s-${s.id}`, tag: 'Öğrenci', title: s.name, sub: s.department || 'Öğrenci', desk: 'students_staj' }));
    }
    if (allowedSet.has('alumni')) {
      alumni
        .filter(a => (a.name || '').toLocaleLowerCase('tr-TR').includes(q) || (a.currentCompany || '').toLocaleLowerCase('tr-TR').includes(q))
        .slice(0, 3)
        .forEach(a => results.push({ id: `a-${a.id}`, tag: 'Mezun', title: a.name, sub: `${a.department || ''} ${a.currentCompany ? '• ' + a.currentCompany : ''}`, desk: 'alumni' }));
    }
    if (allowedSet.has('companies_protocols')) {
      companies
        .filter(c => (c.name || '').toLocaleLowerCase('tr-TR').includes(q) || (c.sector || '').toLocaleLowerCase('tr-TR').includes(q))
        .slice(0, 3)
        .forEach(c => results.push({ id: `c-${c.id}`, tag: 'Firma', title: c.name, sub: c.sector || 'Kurumsal İşveren', desk: 'companies_jobs' }));
    }
    if (allowedSet.has('jobs_applications')) {
      jobs
        .filter(j => (j.title || '').toLocaleLowerCase('tr-TR').includes(q) || (j.company || '').toLocaleLowerCase('tr-TR').includes(q))
        .slice(0, 3)
        .forEach(j => results.push({ id: `j-${j.id}`, tag: 'İlan', title: j.title, sub: `${j.company || ''} • ${j.status || 'Yayında'}`, desk: 'companies_jobs' }));
    }
    return results;
  }, [globalSearch, allowedSet, students, alumni, companies, jobs]);

  const selectedMessage = mergedContactMessages.find(m => m.id === selectedMsgId) || mergedContactMessages[0] || null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* ─── TOP OPERATIONAL NAVBAR ─── */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-40">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Logo color={isSuperAdminViewing ? 'amber' : 'indigo'} className="h-10 w-auto shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-none mb-0.5">
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 tracking-wider uppercase">
                KGM Personel Operasyon İstasyonu
              </p>
            </div>
          </div>

          {/* INSTANT AUTHORIZED SEARCH BAR */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Yetkili olduğunuz kayıtlarda anlık ara (öğrenci, mezun, firma, ilan)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:bg-white focus:border-indigo-500 transition"
            />
            {instantSearchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                {instantSearchResults.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setActiveDesk(r.desk);
                      setDeskSearch(globalSearch);
                      setGlobalSearch('');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">{r.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{r.sub}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                      {r.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black shadow-xs transition cursor-pointer"
            >
              <LayoutDashboard size={14} /> Detaylı CMS
            </button>
            <button
              type="button"
              onClick={() => setView?.('notifications')}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition relative cursor-pointer"
              title="Bildirimler"
            >
              <Bell size={19} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
              )}
            </button>
            <TopProfileMenu
              currentUser={effectiveUser}
              userRole={isSuperAdminViewing ? 'admin' : 'staff'}
              setView={setView}
              setSelectedUserId={setSelectedUserId}
              academicRole={isSuperAdminViewing ? 'super_admin' : 'staff'}
              currentView="staff"
            />
          </div>
        </div>
      </nav>

      {/* ─── SUPER ADMIN PREVIEW BAR (SÜPER ADMİN ASLA PERSONEL GİBİ İNDİRGENMEZ) ─── */}
      {isSuperAdminViewing && (
        <div className="pt-16">
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white border-b border-amber-500">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-black">
                <Crown size={16} className="text-yellow-200 shrink-0" />
                <span>Süper Yönetici Modu — Personel Operasyon İstasyonunu test ediyorsunuz.</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={adminPreviewRole}
                  onChange={(e) => setAdminPreviewRole(e.target.value)}
                  className="bg-slate-950/30 border border-white/30 rounded-xl px-3 py-1.5 text-[11px] font-bold text-white focus:outline-none cursor-pointer"
                  title="Farklı personel yetki paketlerini canlı test et"
                >
                  {PREVIEW_ROLE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id} className="text-slate-900">{opt.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => openCmsTab('user_types')}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-[11px] font-black transition cursor-pointer"
                >
                  Personel Yetkilerini Yönet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    useAppStore.getState().setActivePortalBranch?.('admin');
                    setView?.('admin');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-[11px] font-black shadow-xs transition cursor-pointer"
                >
                  ← Süper Admin Merkezine Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN WORKSTATION LAYOUT (LEFT RAIL + INTERACTIVE DESK) ─── */}
      <div className={`${isSuperAdminViewing ? 'pt-6' : 'pt-22'} pb-12 max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-6 items-start`}>
        {/* ─── LEFT OPERATIONAL RAIL (260px) ─── */}
        <aside className="w-full lg:w-[265px] shrink-0 space-y-4 lg:sticky lg:top-20">
          {/* Staff Identity Card */}
          <div className="bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white rounded-2xl p-4 shadow-md border border-indigo-800/60">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/25 p-1 shrink-0 overflow-hidden">
                <SafeAvatar src={effectiveUser?.avatar} name={effectiveUser?.name || 'Personel'} size="full" rounded="rounded-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{effectiveUser?.name || 'Kurumsal Personel'}</p>
                <p className="text-[11px] font-bold text-indigo-200 truncate">
                  {isSuperAdminViewing ? 'Süper Yönetici (Önizleme)' : (effectiveUser?.staffTitle || 'Kurumsal Personel')}
                </p>
                {effectiveUser?.username && !isSuperAdminViewing && (
                  <p className="text-[10px] font-mono text-emerald-300 mt-0.5">@{effectiveUser.username}</p>
                )}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px]">
              <span className="text-indigo-200 font-semibold">Yetki Kapsamı</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-black">
                {allowedGroups.length} / {STAFF_PERMISSION_GROUPS.length} Alan
              </span>
            </div>
          </div>

          {/* Navigation Masaları (Yalnızca Yetkili Alanlar) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-1">
            <p className="px-3 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Operasyon Masaları
            </p>
            {deskNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeDesk === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveDesk(item.id);
                    setDeskSearch('');
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-700 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={isActive ? 'text-white shrink-0' : 'text-indigo-600 dark:text-indigo-400 shrink-0'} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kişisel KGM Günlük Görev & Not Defteri */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare size={14} className="text-indigo-600" /> Günlük Takip Notlarım
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                {dailyTasks.filter(t => t.done).length}/{dailyTasks.length}
              </span>
            </div>
            <form onSubmit={handleAddTask} className="flex gap-1.5">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Görev / takip notu ekle..."
                className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer shrink-0"
                title="Görev Ekle"
              >
                <Plus size={14} />
              </button>
            </form>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {dailyTasks.map(task => (
                <div key={task.id} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 group">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-2 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    {task.done ? (
                      <CheckSquare size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Square size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    )}
                    <span className={`text-[11px] leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200 font-semibold'}`}>
                      {task.text}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition cursor-pointer shrink-0"
                    title="Notu Sil"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── RIGHT INTERACTIVE OPERATIONAL WORKSPACE ─── */}
        <section className="flex-1 min-w-0 w-full space-y-5">
          {/* ─── DESK 1: GÜNLÜK İŞ KUYRUĞU (UNIFIED ACTION CENTER) ─── */}
          {activeDesk === 'queue' && (
            <div className="space-y-5">
              {/* KPI Strip (Strictly Permitted Metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {allowedGroups.slice(0, 4).map(group => {
                  const Icon = GROUP_ICONS[group.id] || LayoutDashboard;
                  const count =
                    group.id === 'students_staj' ? students.length :
                    group.id === 'alumni' ? alumni.length :
                    group.id === 'companies_protocols' ? companies.length :
                    group.id === 'jobs_applications' ? jobs.length :
                    group.id === 'content' ? announcements.length :
                    group.id === 'mentorship' ? mentorships.length :
                    group.id === 'messages' ? mergedContactMessages.length :
                    students.length + alumni.length + companies.length;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        if (group.id === 'companies_protocols' || group.id === 'jobs_applications') setActiveDesk('companies_jobs');
                        else if (deskNavItems.some(d => d.id === group.id)) setActiveDesk(group.id);
                        else openCmsTab(group.primaryTab);
                      }}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 shadow-xs text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 mb-2">
                        <Icon size={18} />
                        <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{count}</div>
                      <div className="text-[11px] font-bold text-slate-500 mt-1 truncate">{group.label}</div>
                    </button>
                  );
                })}
              </div>

              {allowedGroups.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-dashed border-slate-300 text-center space-y-2">
                  <Lock size={32} className="mx-auto text-slate-400" />
                  <h3 className="text-base font-black text-slate-800">Yetkili Çalışma Alanı Atanmamış</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Kariyer Geliştirme Koordinatörlüğü tarafından size çalışma modülleri tanımlandığında operasyon masalarınız burada açılacaktır.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {/* Onay Bekleyen İlanlar */}
                  {allowedSet.has('jobs_applications') && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Briefcase size={16} className="text-amber-600" /> Onay Bekleyen İlanlar ({pendingJobs.length})
                        </h3>
                        <button type="button" onClick={() => setActiveDesk('companies_jobs')} className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer">
                          Masayı Aç →
                        </button>
                      </div>
                      {pendingJobs.length === 0 ? (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 font-semibold">✓ Onay bekleyen ilan yok.</p>
                      ) : (
                        <div className="space-y-2">
                          {pendingJobs.slice(0, 4).map(job => (
                            <div key={job.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">{job.title}</p>
                                <p className="text-[11px] text-slate-500 truncate">{job.company} • {job.type || 'İlan'}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button type="button" onClick={() => handleJobDecision(job.id, 'Yayında')} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Onayla</button>
                                <button type="button" onClick={() => handleJobDecision(job.id, 'Reddedildi')} className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black cursor-pointer">Reddet</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Onay Bekleyen Stajlar */}
                  {allowedSet.has('students_staj') && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <GraduationCap size={16} className="text-[#990000]" /> Onay Bekleyen Staj Talepleri ({pendingInternships.length})
                        </h3>
                        <button type="button" onClick={() => setActiveDesk('students_staj')} className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer">
                          Masayı Aç →
                        </button>
                      </div>
                      {pendingInternships.length === 0 ? (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 font-semibold">✓ Bekleyen staj başvurusu yok.</p>
                      ) : (
                        <div className="space-y-2">
                          {pendingInternships.slice(0, 4).map(v => (
                            <div key={v.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">{v.student || v.studentName || 'Öğrenci'}</p>
                                <p className="text-[11px] text-slate-500 truncate">{v.company} • {v.position || 'Stajyer'}</p>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button type="button" onClick={() => handleInternshipDecision(v.id, 'Onaylı')} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Onayla</button>
                                <button type="button" onClick={() => handleInternshipDecision(v.id, 'Reddedildi')} className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black cursor-pointer">Reddet</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kurumsal Protokol & Fuar Talepleri */}
                  {allowedSet.has('companies_protocols') && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Building2 size={16} className="text-blue-800" /> Bekleyen Protokol & Fuar Talepleri ({pendingProtocols.length + pendingFairApps.length})
                        </h3>
                        <button type="button" onClick={() => setActiveDesk('companies_jobs')} className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer">
                          Tümünü Gör →
                        </button>
                      </div>
                      {pendingProtocols.length === 0 && pendingFairApps.length === 0 ? (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 font-semibold">✓ Bekleyen protokol veya fuar talebi yok.</p>
                      ) : (
                        <div className="space-y-2">
                          {pendingProtocols.slice(0, 3).map(proto => (
                            <div key={proto.id} className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">{proto.companyName}</p>
                                <p className="text-[11px] text-blue-800 font-semibold truncate">{proto.protocolType || 'İş Birliği Protokolü'} • {proto.committedQuota || 0} Kontenjan</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button type="button" onClick={() => exportBilateralProtocolDraftPdf(proto)} className="px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-[10px] font-black cursor-pointer" title="Taslak PDF">PDF</button>
                                <button type="button" onClick={() => handleProtocolDecision(proto.id, 'ACTIVE')} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black cursor-pointer">Onayla</button>
                              </div>
                            </div>
                          ))}
                          {pendingFairApps.slice(0, 2).map(app => (
                            <div key={app.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">{app.companyName || 'Firma Fuar Talebi'}</p>
                                <p className="text-[11px] text-slate-500 truncate">{app.answers?.eventType || 'Kariyer Günleri / Stant'}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button type="button" onClick={() => handleFairDecision(app.id, 'Onaylandı')} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black cursor-pointer">Onayla</button>
                                <button type="button" onClick={() => handleFairDecision(app.id, 'Reddedildi')} className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-black cursor-pointer">Reddet</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mentörlük Eşleşme Kuyruğu */}
                  {allowedSet.has('mentorship') && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <UserCheck size={16} className="text-teal-600" /> Mentörlük Eşleşmeleri ({pendingMentorships.length})
                        </h3>
                        <button type="button" onClick={() => openCmsTab('cms_career_counseling')} className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer">
                          Randevu Masası →
                        </button>
                      </div>
                      {pendingMentorships.length === 0 ? (
                        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 font-semibold">✓ Bekleyen mentör eşleşmesi yok.</p>
                      ) : (
                        <div className="space-y-2">
                          {pendingMentorships.slice(0, 4).map(m => (
                            <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900 truncate">{m.mentor || m.mentorName || 'Mentör'} ↔ {m.mentee || m.studentName || 'Aday'}</p>
                                <p className="text-[11px] text-slate-500 truncate">{m.topic || m.field || 'Kariyer Mentörlüğü'}</p>
                              </div>
                              <button type="button" onClick={() => handleMentorshipApprove(m.id)} className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black cursor-pointer shrink-0">Eşleştir</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Yetkili Tüm Modüllere Hızlı Erişim Şeridi */}
              {allowedGroups.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Yetkili Olduğunuz Tüm Modüller ({allowedGroups.length})
                    </h3>
                    <button type="button" onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')} className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer">
                      Detaylı CMS’de Aç →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {allowedGroups.map(group => {
                      const Icon = GROUP_ICONS[group.id] || LayoutDashboard;
                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => openCmsTab(group.primaryTab)}
                          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/40 text-left transition flex items-start gap-2.5 cursor-pointer"
                        >
                          <Icon size={16} className="text-indigo-700 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">{group.label}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{group.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── DESK 2: ÖĞRENCİ & STAJ MASASI ─── */}
          {activeDesk === 'students_staj' && allowedSet.has('students_staj') && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <GraduationCap size={18} className="text-[#990000]" /> Öğrenci & Staj Operasyon Masası
                    </h2>
                    <p className="text-xs text-slate-500">Kayıtlı öğrencileri arayın, staj başvurularını onaylayın veya listeyi Excel’e aktarın.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => exportToCSV(students, 'IESU_Personel_Ogrenci_Listesi.csv')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={14} /> Öğrenci Excel (.CSV)
                    </button>
                    <button
                      type="button"
                      onClick={() => openCmsTab('gonullu')}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black cursor-pointer"
                    >
                      Staj CMS →
                    </button>
                  </div>
                </div>

                <div className="relative max-w-md">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={deskSearch}
                    onChange={(e) => setDeskSearch(e.target.value)}
                    placeholder="Öğrenci adı, bölüm veya e-posta ara..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                      <tr>
                        <th className="p-3">Ad Soyad</th>
                        <th className="p-3">Bölüm</th>
                        <th className="p-3">Sınıf</th>
                        <th className="p-3">AGNO</th>
                        <th className="p-3">E-Posta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students
                        .filter(s => {
                          const q = deskSearch.trim().toLocaleLowerCase('tr-TR');
                          if (!q) return true;
                          return (s.name || '').toLocaleLowerCase('tr-TR').includes(q) || (s.department || '').toLocaleLowerCase('tr-TR').includes(q) || (s.email || '').toLocaleLowerCase('tr-TR').includes(q);
                        })
                        .slice(0, 12)
                        .map(s => (
                          <tr key={s.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{s.name}</td>
                            <td className="p-3 text-slate-600">{s.department || '-'}</td>
                            <td className="p-3 font-semibold">{s.classLevel || s.grade || s.year || '-'}</td>
                            <td className="p-3 font-black text-emerald-700">{s.gpa || '-'}</td>
                            <td className="p-3 text-slate-500">{s.email || '-'}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── DESK 3: MEZUN & MBS MASASI ─── */}
          {activeDesk === 'alumni' && allowedSet.has('alumni') && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Award size={18} className="text-emerald-600" /> Mezun & MBS Operasyon Masası ({alumni.length})
                  </h2>
                  <p className="text-xs text-slate-500">Mezun istihdam bilgilerini inceleyin, mentörleri filtreleyin ve Excel listesi çekin.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportToCSV(alumni, 'IESU_Personel_Mezun_Listesi.csv')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} /> Mezun Excel (.CSV)
                  </button>
                  <button
                    type="button"
                    onClick={() => openCmsTab('alumni')}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black cursor-pointer"
                  >
                    Mezun CMS →
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={deskSearch}
                    onChange={(e) => setDeskSearch(e.target.value)}
                    placeholder="Mezun adı, bölüm, şirket veya şehir ara..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-1.5">
                  {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'employed', label: 'Çalışanlar' },
                    { id: 'mentor', label: 'Mentörler' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAlumniFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                        alumniFilter === f.id ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-900 text-white uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="p-3">Ad Soyad</th>
                      <th className="p-3">Bölüm / Yıl</th>
                      <th className="p-3">Şirket / Unvan</th>
                      <th className="p-3">Konum</th>
                      <th className="p-3">Mentör</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alumni
                      .filter(a => {
                        if (alumniFilter === 'employed' && !a.currentCompany && a.careerStatus !== 'Çalışıyorum') return false;
                        if (alumniFilter === 'mentor' && !a.isMentor) return false;
                        const q = deskSearch.trim().toLocaleLowerCase('tr-TR');
                        if (!q) return true;
                        return (a.name || '').toLocaleLowerCase('tr-TR').includes(q) || (a.department || '').toLocaleLowerCase('tr-TR').includes(q) || (a.currentCompany || '').toLocaleLowerCase('tr-TR').includes(q) || (a.city || '').toLocaleLowerCase('tr-TR').includes(q);
                      })
                      .slice(0, 12)
                      .map(a => (
                        <tr key={a.id} className="hover:bg-emerald-50/40">
                          <td className="p-3 font-bold text-slate-900">{a.name}</td>
                          <td className="p-3 text-slate-600">{a.department || '-'} {a.graduationYear ? `(${a.graduationYear})` : ''}</td>
                          <td className="p-3 font-semibold text-slate-800">{a.currentCompany || a.company || '-'} {a.currentPosition ? `• ${a.currentPosition}` : ''}</td>
                          <td className="p-3 text-slate-500">{a.city || 'İstanbul'}{a.country ? `, ${a.country}` : ''}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${a.isMentor ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                              {a.isMentor ? 'Mentör' : 'Standart'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── DESK 4: FİRMA, İLAN & PROTOKOL MASASI ─── */}
          {activeDesk === 'companies_jobs' && (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications')) && (
            <div className="space-y-5">
              {allowedSet.has('companies_protocols') && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 size={18} className="text-blue-800" /> Firma & Kurumsal Protokol Masası
                      </h2>
                      <p className="text-xs text-slate-500">Firma onay durumlarını yönetin, bekleyen iş birliği protokollerini inceleyip karara bağlayın.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => exportToCSV(corporateProtocols, 'IESU_Personel_Protokoller.csv')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={14} /> Protokol Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => openCmsTab('cms_corporate_partnerships')}
                        className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-black cursor-pointer"
                      >
                        Protokol CRM →
                      </button>
                    </div>
                  </div>

                  {/* Protokol Onay Tablosu */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0A2342] text-white uppercase text-[10px] font-black tracking-wider">
                        <tr>
                          <th className="p-3">Firma</th>
                          <th className="p-3">Tür & Kontenjan</th>
                          <th className="p-3">Durum</th>
                          <th className="p-3 text-right">Karar & Taslak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {corporateProtocols.slice(0, 8).map(p => {
                          const st = calculateProtocolStatus(p);
                          return (
                            <tr key={p.id} className="hover:bg-blue-50/40">
                              <td className="p-3 font-bold text-slate-900">{p.companyName}</td>
                              <td className="p-3 text-slate-600">{p.protocolType || 'İş Birliği'} • <strong>{p.committedQuota || 0}</strong> kontenjan</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                  st === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                                  st === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800' :
                                  st === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {st === 'ACTIVE' ? 'Yürürlükte' : st === 'PENDING_APPROVAL' ? 'Onay Bekliyor' : st === 'REVISION_REQUESTED' ? 'Revizyon' : st}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button type="button" onClick={() => exportBilateralProtocolDraftPdf(p)} className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black cursor-pointer">PDF</button>
                                  {st !== 'ACTIVE' && (
                                    <button type="button" onClick={() => handleProtocolDecision(p.id, 'ACTIVE')} className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black cursor-pointer">Onayla</button>
                                  )}
                                  {st === 'PENDING_APPROVAL' && (
                                    <button type="button" onClick={() => handleProtocolDecision(p.id, 'REVISION_REQUESTED')} className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black cursor-pointer">Revizyon</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Firmalar Hızlı Durum Yönetimi */}
                  <div className="pt-2 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Kayıtlı Kurumsal İşverenler ({companies.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {companies.slice(0, 6).map(comp => (
                        <div key={comp.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">{comp.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{comp.sector || 'Sektör Belirtilmedi'}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCompanyStatusToggle(comp)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer shrink-0 ${
                              comp.status === 'Onaylı'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-amber-100 hover:text-amber-800'
                                : 'bg-amber-100 text-amber-800 hover:bg-emerald-600 hover:text-white'
                            }`}
                          >
                            {comp.status === 'Onaylı' ? '✓ Onaylı' : 'Onayla'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── DESK 5: İÇERİK & DUYURU MASASI ─── */}
          {activeDesk === 'content' && allowedSet.has('content') && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone size={18} className="text-violet-600" /> Hızlı İçerik & Duyuru Yayınla
                </h2>
                <form onSubmit={handlePublishContent} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Yayın Türü</label>
                    <select
                      value={contentForm.category}
                      onChange={(e) => setContentForm({ ...contentForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    >
                      <option value="Duyuru">Resmî Duyuru</option>
                      <option value="Haber">KGM Haberi</option>
                      <option value="Etkinlik">Etkinlik / Seminer</option>
                      <option value="Staj Takvimi">Staj / USP Takvimi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Başlık *</label>
                    <input
                      type="text"
                      required
                      value={contentForm.title}
                      onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                      placeholder="Örn: 2026 Yaz Dönemi Staj Başvuru Takvimi Açıklandı"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">İçerik *</label>
                    <textarea
                      rows={5}
                      required
                      value={contentForm.content}
                      onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                      placeholder="Öğrenci ve mezunlarla paylaşılacak duyuru metnini yazın..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={14} /> Hemen Yayınla
                  </button>
                </form>
              </div>

              <div className="xl:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Yayındaki Son Duyurular ({announcements.length})</h3>
                  <button type="button" onClick={() => openCmsTab('cms_ann')} className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer">
                    Detaylı İçerik CMS →
                  </button>
                </div>
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
                  {announcements.slice(0, 10).map(a => (
                    <div key={a.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-violet-100 text-violet-800">{a.category || 'Duyuru'}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{a.date}</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 mt-1">{a.title}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{a.content}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                        title="Yayından Kaldır"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── DESK 6: İLETİŞİM & GELEN TALEPLER ─── */}
          {activeDesk === 'messages' && allowedSet.has('messages') && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              <div className="md:col-span-5 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Gelen Talepler ({mergedContactMessages.length})
                  </h3>
                  <button type="button" onClick={() => openCmsTab('mesajlar')} className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer">
                    Tam Mesaj Merkezi
                  </button>
                </div>
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[420px]">
                  {mergedContactMessages.length === 0 ? (
                    <p className="p-6 text-xs text-slate-400 text-center">Gelen mesaj bulunmuyor.</p>
                  ) : (
                    mergedContactMessages.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMsgId(m.id)}
                        className={`w-full text-left p-3.5 hover:bg-indigo-50/50 transition cursor-pointer ${
                          selectedMessage?.id === m.id ? 'bg-indigo-50 border-l-4 border-indigo-700' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-900 truncate">{m.sender}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">{m.date}</span>
                        </div>
                        <p className="text-[11px] font-bold text-indigo-700 truncate mt-0.5">{m.subject}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{m.content}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="md:col-span-7 p-5 flex flex-col justify-between gap-4">
                {selectedMessage ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{selectedMessage.subject}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{selectedMessage.sender} • {selectedMessage.email}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black">
                          {selectedMessage.status}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.content || 'Mesaj içeriği yok.'}
                      </div>
                    </div>
                    <form onSubmit={handleReplyMessage} className="space-y-2 pt-3 border-t border-slate-100">
                      <textarea
                        rows={3}
                        value={msgReplyText}
                        onChange={(e) => setMsgReplyText(e.target.value)}
                        placeholder="Kurumsal yanıtınızı buraya yazın..."
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium resize-none focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer">
                          <Send size={13} /> Yanıtı Gönder
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                    İncelemek için soldan bir talep seçin.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── DESK 7: RAPOR & EXCEL ÇIKTI MERKEZİ ─── */}
          {activeDesk === 'reports_export' && allowedSet.has('reports_export') && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Database size={18} className="text-indigo-700" /> Yetkili Veri & Excel Rapor Merkezi
                  </h2>
                  <p className="text-xs text-slate-500">Yalnızca yetkiniz bulunan havuzlardan KVKK maskeli, Türkçe Excel uyumlu (.csv) rapor çekebilirsiniz.</p>
                </div>
                <button type="button" onClick={() => openCmsTab('cms_datapool')} className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer">
                  Gelişmiş Veri Havuzu →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { perm: 'students_staj', label: 'Öğrenci Listesi (.CSV)', count: students.length, run: () => exportToCSV(students, 'IESU_Ogrenci_Listesi.csv') },
                  { perm: 'students_staj', label: 'Staj Başvuruları (.CSV)', count: voluntaryInternships.length, run: () => exportToCSV(voluntaryInternships, 'IESU_Staj_Basvurulari.csv') },
                  { perm: 'alumni', label: 'Mezun Havuzu / MBS (.CSV)', count: alumni.length, run: () => exportToCSV(alumni, 'IESU_Mezun_Listesi.csv') },
                  { perm: 'companies_protocols', label: 'Kurumsal Firmalar (.CSV)', count: companies.length, run: () => exportToCSV(companies, 'IESU_Firma_Listesi.csv') },
                  { perm: 'companies_protocols', label: 'İş Birliği Protokolleri (.CSV)', count: corporateProtocols.length, run: () => exportToCSV(corporateProtocols, 'IESU_Protokoller.csv') },
                  { perm: 'jobs_applications', label: 'İş & Staj İlanları (.CSV)', count: jobs.length, run: () => exportToCSV(jobs, 'IESU_Ilanlar.csv') }
                ]
                  .filter(item => allowedSet.has(item.perm) || allowedSet.has('reports_export'))
                  .map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={item.run}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/50 text-left transition flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div>
                        <p className="text-lg font-black text-slate-900">{item.count}</p>
                        <p className="text-xs font-bold text-slate-700 mt-0.5">{item.label}</p>
                      </div>
                      <Download size={18} className="text-emerald-700 group-hover:scale-110 transition" />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
