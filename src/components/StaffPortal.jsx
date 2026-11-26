import React, { useState, useMemo, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SafeAvatar from './shared/SafeAvatar';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import ExploreFeed from './ExploreFeed';
import BranchNewsWidget from './BranchNewsWidget';
import ConnectionSuggestions from './ConnectionSuggestions';
import AdminOmniDock from './AdminOmniDock';
import FooterModals from './FooterModals';
import { combineFeedItems } from '../utils/feedCombiner';
import {
  STAFF_PERMISSION_GROUPS,
  resolveStaffPermissions
} from '../utils/staffAuth';
import {
  calculateProtocolStatus,
  exportBilateralProtocolDraftPdf
} from '../services/protocolWorkflow';
import { exportToCSV } from '../utils/export';
import {
  Bell, Briefcase, Building2, GraduationCap, Award,
  CheckCircle2, XCircle, Search, MessageSquare, FileText,
  Download, Plus, Trash2, CheckSquare, Square, Star,
  Sliders, Send, Megaphone, Sparkles, ArrowUpRight,
  Users, Newspaper, ShieldCheck, Layers, Filter
} from 'lucide-react';

/**
 * StaffPortal — İESÜ Kurumsal Personel & KGM Portalı
 * Sitenin özgün 3 sütunlu sosyal akış + alt yüzen dock tasarım dilini Safir/İndigo kimliğiyle korur.
 * Granüler personel yetki matrisini (allowedModules) birebir uygular:
 *   - Personel yalnızca yetkili olduğu masaları, onay kuyruklarını, veri havuzlarını ve CMS modüllerini görür.
 *   - Alt yüzen dock ile Akış, İlan/CMS, Keşfet ve Profil arasında akıcı geçiş sağlar.
 */
export default function StaffPortal({
  currentUser,
  userRole,
  academicRole,
  setView,
  setSelectedUserId
}) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const setActivePortalBranch = useAppStore(state => state.setActivePortalBranch);
  const effectiveUser = currentUser || storeCurrentUser || {};

  const isSuperAdminViewing =
    userRole === 'admin' ||
    academicRole === 'super_admin' ||
    effectiveUser?.role === 'admin' ||
    effectiveUser?.academicRole === 'super_admin';

  // Store verileri
  const students = useAppStore(state => state.students) || [];
  const alumni = useAppStore(state => state.alumni) || [];
  const companies = useAppStore(state => state.companies) || [];
  const setCompanies = useAppStore(state => state.setCompanies);
  const jobs = useAppStore(state => state.jobs) || [];
  const setJobs = useAppStore(state => state.setJobs);
  const applications = useAppStore(state => state.applications) || [];
  const voluntaryInternships = useAppStore(state => state.voluntaryInternships) || [];
  const setVoluntaryInternships = useAppStore(state => state.setVoluntaryInternships);
  const corporateProtocols = useAppStore(state => state.corporateProtocols) || [];
  const setCorporateProtocols = useAppStore(state => state.setCorporateProtocols);
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);
  const mentorships = useAppStore(state => state.mentorships) || [];
  const setMentorships = useAppStore(state => state.setMentorships);
  const posts = useAppStore(state => state.posts) || [];
  const setPosts = useAppStore(state => state.setPosts);
  const announcements = useAppStore(state => state.announcements) || [];
  const setAnnouncements = useAppStore(state => state.setAnnouncements);
  const news = useAppStore(state => state.news) || [];
  const events = useAppStore(state => state.events) || [];
  const generalEvents = useAppStore(state => state.generalEvents) || [];
  const careerOpportunities = useAppStore(state => state.careerOpportunities) || [];
  const messages = useAppStore(state => state.messages) || [];
  const setMessages = useAppStore(state => state.setMessages);
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const setAdminMessages = useAppStore(state => state.setAdminMessages);
  const notifications = useAppStore(state => state.notifications) || [];
  const followedUserIds = useAppStore(state => state.followedUserIds) || [];

  // Sadece gerçek personel oturumunda dalı 'staff' olarak işaretle; Süper Yönetici dalını ezme
  useEffect(() => {
    if (!isSuperAdminViewing && setActivePortalBranch) {
      setActivePortalBranch('staff');
    }
  }, [isSuperAdminViewing, setActivePortalBranch]);

  // Yetki çözümleme (Süper Admin görüntülerken tüm 8 modül aktif; personel için yalnızca atanan yetkiler)
  const effectivePermIds = useMemo(() => {
    if (isSuperAdminViewing) return STAFF_PERMISSION_GROUPS.map(g => g.id);
    return resolveStaffPermissions(effectiveUser);
  }, [isSuperAdminViewing, effectiveUser]);

  const allowedSet = useMemo(() => new Set(effectivePermIds), [effectivePermIds]);
  const allowedGroups = useMemo(
    () => STAFF_PERMISSION_GROUPS.filter(g => allowedSet.has(g.id)),
    [allowedSet]
  );

  // Navigasyon & Görünüm Durumu
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'search'
  const [activeDesk, setActiveDesk] = useState('stream'); // 'stream' | 'students_staj' | 'alumni' | 'companies_jobs' | 'content' | 'messages' | 'reports_export'
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'announcements' | 'jobs' | 'community'
  const [visibleFeedCount, setVisibleFeedCount] = useState(10);
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [alumniFilter, setAlumniFilter] = useState('all');
  const [activeModal, setActiveModal] = useState(null);

  // Hızlı duyuru formu
  const [contentForm, setContentForm] = useState({
    category: 'Duyuru',
    title: '',
    content: ''
  });

  // Mesaj yanıtlama
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [msgReplyText, setMsgReplyText] = useState('');

  // Kişisel KGM Günlük Takip Notları (personel bazlı kalıcı)
  const taskStorageKey = `iesu_staff_tasks_${effectiveUser?.username || effectiveUser?.id || 'kgm'}`;
  const [dailyTasks, setDailyTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(taskStorageKey) || '[]');
      if (Array.isArray(saved) && saved.length > 0) return saved;
    } catch { /* intentional */ }
    return [
      { id: 't1', text: 'Bekleyen iş & staj ilanlarını kontrol et', done: false },
      { id: 't2', text: 'Gelen kurumsal talepleri yanıtla', done: false }
    ];
  });
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(taskStorageKey, JSON.stringify(dailyTasks));
    } catch { /* intentional */ }
  }, [dailyTasks, taskStorageKey]);

  const addDailyTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setDailyTasks(prev => [{ id: `t-${Date.now()}`, text: newTaskText.trim(), done: false }, ...prev]);
    setNewTaskText('');
  };

  const toggleDailyTask = (id) => {
    setDailyTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteDailyTask = (id) => {
    setDailyTasks(prev => prev.filter(t => t.id !== id));
  };

  // Bekleyen iş kuyrukları (gerçek canlı veriler)
  const pendingJobs = useMemo(
    () => jobs.filter(j => ['Beklemede', 'Onay Bekliyor', 'Pending'].includes(j?.status)),
    [jobs]
  );

  const pendingInternships = useMemo(
    () => voluntaryInternships.filter(v => ['Taslak', 'Onay Bekliyor', 'Beklemede'].includes(v?.status)),
    [voluntaryInternships]
  );

  const pendingProtocols = useMemo(
    () =>
      corporateProtocols.filter(p => {
        const st = calculateProtocolStatus(p);
        return st === 'PENDING_APPROVAL' || st === 'EXPIRING_SOON' || st === 'RENEWAL_REQUESTED';
      }),
    [corporateProtocols]
  );

  const pendingFairApps = useMemo(
    () => careerFairApplications.filter(a => a?.status === 'Beklemede' || a?.status === 'İnceleniyor'),
    [careerFairApplications]
  );

  const pendingMentorships = useMemo(
    () => mentorships.filter(m => m?.status === 'Eşleştirme Bekliyor' || m?.status === 'Beklemede'),
    [mentorships]
  );

  const mergedContactMessages = useMemo(() => {
    let localForms = [];
    try {
      const saved = JSON.parse(localStorage.getItem('iesu_admin_messages_v1') || '[]');
      if (Array.isArray(saved)) localForms = saved;
    } catch { /* intentional */ }

    const list = [
      ...adminMessages.map(m => ({
        id: m.id,
        source: 'admin_msg',
        sender: m.companyName || m.senderName || 'Kurumsal Firma',
        email: m.email || '-',
        subject: m.subject || 'Kurumsal Talep',
        body: m.message || m.content || '',
        date: m.date || 'Yeni',
        status: m.status || 'Beklemede'
      })),
      ...localForms
        .filter(lf => !adminMessages.some(am => am.id === lf.id))
        .map((m, idx) => ({
          id: m.id || `LOCAL-${idx}`,
          source: 'contact_form',
          sender: m.senderName || m.name || 'Web İletişim Formu',
          email: m.email || '-',
          subject: m.subject || 'İletişim Formu',
          body: m.message || m.content || '',
          date: m.date || 'Yeni',
          status: m.status || 'Beklemede'
        })),
      ...messages.slice(0, 12).map(m => ({
        id: m.id,
        source: 'dm',
        sender: m.senderName || m.from || 'Kullanıcı',
        email: '-',
        subject: m.subject || 'Doğrudan Mesaj',
        body: m.content || '',
        date: m.timestamp ? new Date(m.timestamp).toLocaleDateString('tr-TR') : (m.date || 'Yeni'),
        status: m.read ? 'Okundu' : 'Beklemede'
      }))
    ];
    return list;
  }, [adminMessages, messages]);

  const pendingMessages = useMemo(
    () => mergedContactMessages.filter(m => m.status === 'Beklemede'),
    [mergedContactMessages]
  );

  const totalPendingCount = useMemo(() => {
    let c = 0;
    if (allowedSet.has('jobs_applications')) c += pendingJobs.length;
    if (allowedSet.has('students_staj')) c += pendingInternships.length;
    if (allowedSet.has('companies_protocols')) c += pendingProtocols.length + pendingFairApps.length;
    if (allowedSet.has('mentorship')) c += pendingMentorships.length;
    return c;
  }, [allowedSet, pendingJobs.length, pendingInternships.length, pendingProtocols.length, pendingFairApps.length, pendingMentorships.length]);

  const unreadNotifCount = useMemo(
    () => notifications.filter(n => !n?.read).length,
    [notifications]
  );

  // Birleşik sosyal ve kurumsal akış
  const combinedFeed = useMemo(() => {
    const items = combineFeedItems({
      posts,
      clubs: [],
      events,
      news,
      announcements,
      jobs,
      generalEvents,
      careerOpportunities,
      user: effectiveUser,
      followedUserIds
    });

    if (feedFilter === 'announcements') {
      return items.filter(it => it.feedType === 'announcement' || it.feedType === 'news' || it.feedType === 'event');
    }
    if (feedFilter === 'jobs') {
      return items.filter(it => it.feedType === 'job' || it.feedType === 'career_opportunity');
    }
    if (feedFilter === 'community') {
      return items.filter(it => it.feedType === 'post' || !it.feedType);
    }
    return items;
  }, [posts, events, news, announcements, jobs, generalEvents, careerOpportunities, effectiveUser, followedUserIds, feedFilter]);

  // Yetkili CMS sekmesine geçiş
  const openCmsTab = (tabId) => {
    try {
      if (tabId) sessionStorage.setItem('iesu_cms_initial_tab', tabId);
    } catch { /* intentional */ }
    setView?.('admin_cms');
  };

  // Satır içi operasyon aksiyonları
  const handleApproveJob = (jobId) => {
    setJobs?.(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Yayında' } : j));
    window.toast?.success?.('İlan onaylanarak yayına alındı.');
  };

  const handleRejectJob = (jobId) => {
    setJobs?.(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Reddedildi' } : j));
    window.toast?.info?.('İlan reddedildi.');
  };

  const handleApproveInternship = (id) => {
    setVoluntaryInternships?.(prev => (prev || []).map(v => v.id === id ? { ...v, status: 'Onaylı' } : v));
    window.toast?.success?.('Staj başvurusu onaylandı.');
  };

  const handleRejectInternship = (id) => {
    setVoluntaryInternships?.(prev => (prev || []).map(v => v.id === id ? { ...v, status: 'Reddedildi' } : v));
    window.toast?.info?.('Staj başvurusu reddedildi.');
  };

  const handleProtocolDecision = (protocolId, nextStatus) => {
    setCorporateProtocols?.(prev =>
      (prev || []).map(p =>
        p.id === protocolId
          ? {
              ...p,
              status: nextStatus,
              approvedAt: nextStatus === 'ACTIVE' ? new Date().toISOString() : p.approvedAt,
              approvedBy: effectiveUser?.name || 'Kariyer Geliştirme Merkezi'
            }
          : p
      )
    );
    window.toast?.success?.(nextStatus === 'ACTIVE' ? 'Kurumsal protokol yürürlüğe alındı.' : 'Protokol revizyona gönderildi.');
  };

  const handleFairDecision = (appId, status) => {
    setCareerFairApplications?.(prev => (prev || []).map(a => a.id === appId ? { ...a, status } : a));
    window.toast?.success?.(`Başvuru "${status}" olarak güncellendi.`);
  };

  const handleMatchMentorship = (id) => {
    setMentorships?.(prev => (prev || []).map(m => m.id === id ? { ...m, status: 'Aktif' } : m));
    window.toast?.success?.('Mentörlük eşleştirmesi aktifleştirildi.');
  };

  const handleToggleCompanyStatus = (comp) => {
    const next = comp.status === 'Onaylı' ? 'Pasif' : 'Onaylı';
    setCompanies?.(prev => (prev || []).map(c => c.id === comp.id ? { ...c, status: next } : c));
    window.toast?.success?.(`${comp.name} durumu "${next}" olarak güncellendi.`);
  };

  const handleQuickPublishContent = (e) => {
    e.preventDefault();
    if (!contentForm.title.trim() || !contentForm.content.trim()) {
      window.toast?.info?.('Başlık ve içerik alanlarını doldurun.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
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
        title: effectiveUser?.staffTitle || 'Kurumsal Personel • KGM',
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

  // Yetkili operasyon masaları
  const deskNavItems = useMemo(() => {
    const items = [
      { id: 'stream', label: 'Akış & Onaylar', icon: Newspaper, badge: totalPendingCount }
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
  }, [allowedSet, totalPendingCount, pendingInternships.length, pendingJobs.length, pendingProtocols.length, pendingMessages.length]);

  useEffect(() => {
    if (!deskNavItems.some(i => i.id === activeDesk)) {
      setActiveDesk('stream');
    }
  }, [deskNavItems, activeDesk]);

  // Yetkili havuzlarda anlık arama
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
        .forEach(a => results.push({ id: `a-${a.id}`, tag: 'Mezun', title: a.name, sub: a.currentCompany || a.department || 'Mezun', desk: 'alumni' }));
    }
    if (allowedSet.has('companies_protocols')) {
      companies
        .filter(c => (c.name || '').toLocaleLowerCase('tr-TR').includes(q) || (c.sector || '').toLocaleLowerCase('tr-TR').includes(q))
        .slice(0, 3)
        .forEach(c => results.push({ id: `c-${c.id}`, tag: 'Firma', title: c.name, sub: c.sector || 'İşveren', desk: 'companies_jobs' }));
    }
    if (allowedSet.has('jobs_applications')) {
      jobs
        .filter(j => (j.title || '').toLocaleLowerCase('tr-TR').includes(q) || (j.company || '').toLocaleLowerCase('tr-TR').includes(q))
        .slice(0, 3)
        .forEach(j => results.push({ id: `j-${j.id}`, tag: 'İlan', title: j.title, sub: j.company || 'İlan', desk: 'companies_jobs' }));
    }
    return results;
  }, [globalSearch, allowedSet, students, alumni, companies, jobs]);

  // Tablo filtreleri
  const filteredStudents = useMemo(() => {
    const q = tableSearch.trim().toLocaleLowerCase('tr-TR');
    return students.filter(s =>
      !q ||
      (s.name || '').toLocaleLowerCase('tr-TR').includes(q) ||
      (s.department || '').toLocaleLowerCase('tr-TR').includes(q) ||
      (s.email || '').toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [students, tableSearch]);

  const filteredAlumni = useMemo(() => {
    const q = tableSearch.trim().toLocaleLowerCase('tr-TR');
    return alumni.filter(a => {
      const matchQ = !q ||
        (a.name || '').toLocaleLowerCase('tr-TR').includes(q) ||
        (a.department || '').toLocaleLowerCase('tr-TR').includes(q) ||
        (a.currentCompany || '').toLocaleLowerCase('tr-TR').includes(q);
      if (!matchQ) return false;
      if (alumniFilter === 'employed') return Boolean(a.currentCompany || a.employmentStatus === 'Çalışıyor');
      if (alumniFilter === 'mentors') return Boolean(a.isMentor || a.mentorActive);
      return true;
    });
  }, [alumni, tableSearch, alumniFilter]);

  const filteredCompanies = useMemo(() => {
    const q = tableSearch.trim().toLocaleLowerCase('tr-TR');
    return companies.filter(c =>
      !q ||
      (c.name || '').toLocaleLowerCase('tr-TR').includes(q) ||
      (c.sector || '').toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [companies, tableSearch]);

  const staffName = effectiveUser?.name || 'Kariyer Geliştirme Merkezi Personeli';
  const staffTitle = effectiveUser?.staffTitle || effectiveUser?.department || 'Kariyer Geliştirme Merkezi';
  const openTasksCount = dailyTasks.filter(t => !t.done).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b1120] text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* ── SİTEYE BİREBİR UYUMLU SABİT CAM ÜST NAVBAR ── */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 z-40">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* Sol: Hızlı Paylaş + Logo + Kurum Adı */}
          <div className="flex items-center gap-3">
            {allowedSet.has('content') && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('feed');
                  setActiveDesk('content');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-800 cursor-pointer ${
                  activeDesk === 'content' ? 'text-white bg-indigo-700 shadow-sm' : 'text-indigo-700 dark:text-indigo-400'
                }`}
                title="Duyuru & İçerik Yayınla"
              >
                <Star size={21} strokeWidth={activeDesk === 'content' ? 2.5 : 2} />
              </button>
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveTab('feed');
                setActiveDesk('stream');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setActiveTab('feed'); setActiveDesk('stream'); } }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Logo color="staff" className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
              <div className="hidden sm:block text-left">
                <h1 className="text-[13px] font-black text-indigo-900 dark:text-white tracking-tight leading-none mb-0.5">
                  İstanbul Esenyurt Üniversitesi
                </h1>
                <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                  Kariyer Geliştirme Koordinatörlüğü
                </p>
              </div>
            </div>
          </div>

          {/* Orta: İmza Portal Rozeti */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-none z-20">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-slate-900 via-indigo-700 to-blue-800 shadow-lg shadow-indigo-600/30 border border-indigo-300/60 flex items-center gap-2 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse shrink-0" />
              KURUMSAL PERSONEL PORTALI
            </span>
          </div>

          {/* Sağ: Bildirim + TopProfileMenu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setView?.('notifications')}
              className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-400 cursor-pointer"
              title="Bildirimler"
            >
              <div className="relative">
                <Bell size={23} strokeWidth={2.4} className="fill-current text-indigo-600/10" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                )}
              </div>
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

      {/* ── 3 SÜTUNLU SİTE ANA AKIŞ YERLEŞİMİ ── */}
      <div className="pt-24 max-w-[1320px] mx-auto px-4 flex items-start justify-center gap-6 pb-28 sm:pb-24">

        {/* SOL SÜTUN: PERSONEL KİMLİK KARTI & YETKİLİ MASALAR */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 sticky top-24 self-start h-fit max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar z-20 pb-6">
          <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="h-24 bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-900 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.35),transparent_65%)]" />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#131c31] bg-white shadow-lg overflow-hidden">
                  <SafeAvatar src={effectiveUser?.avatar} name={staffName} size="2xl" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="pt-12 pb-5 px-5 text-center">
              <h2
                role="button"
                tabIndex={0}
                onClick={() => {
                  const selfId = effectiveUser?.id || 'self';
                  setSelectedUserId?.(selfId);
                  setView?.('user_profile');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedUserId?.(effectiveUser?.id || 'self');
                    setView?.('user_profile');
                  }
                }}
                className="text-[16px] font-black text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300 transition cursor-pointer leading-snug"
              >
                {staffName}
              </h2>
              <p className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">
                {staffTitle}
              </p>

              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-700/40 text-[10px] font-black text-indigo-700 dark:text-indigo-300">
                <ShieldCheck size={12} /> {allowedGroups.length} / {STAFF_PERMISSION_GROUPS.length} Yetkili Modül
              </div>

              {/* 3'lü Canlı Gösterge */}
              <div className="grid grid-cols-3 gap-1 border-y border-slate-100 dark:border-slate-800 py-3 my-4 text-center">
                <div>
                  <div className="text-base font-black text-slate-900 dark:text-white">{totalPendingCount}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Onay</div>
                </div>
                <div className="border-x border-slate-100 dark:border-slate-800">
                  <div className="text-base font-black text-indigo-700 dark:text-indigo-400">{allowedGroups.length}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Yetki</div>
                </div>
                <div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{openTasksCount}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Görev</div>
                </div>
              </div>

              {/* Yetkili Çalışma Masaları */}
              <div className="space-y-1 text-left">
                {deskNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === 'feed' && activeDesk === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab('feed');
                        setActiveDesk(item.id);
                        setTableSearch('');
                      }}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-700 to-blue-700 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50/70 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Icon size={14} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')}
                className="mt-4 w-full py-2.5 px-3 bg-gradient-to-r from-slate-900 via-indigo-700 to-blue-700 hover:from-slate-800 hover:to-blue-800 text-white rounded-xl text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders size={14} /> Yetkili CMS Modülleri
              </button>
            </div>
          </div>
        </aside>

        {/* ORTA SÜTUN: ANA AKIŞ, ONAY KARTLARI & YETKİLİ MASALAR */}
        <main className="w-full max-w-[640px] shrink-0 space-y-5">
          {activeTab === 'search' ? (
            <ExploreFeed
              posts={posts}
              setView={setView}
              setSelectedUserId={setSelectedUserId}
              currentUser={effectiveUser}
              hideDock={true}
              onBack={() => setActiveTab('feed')}
            />
          ) : (
            <>
              {/* Mobil (< lg) Hızlı Personel Kokpiti */}
              <div className="lg:hidden bg-gradient-to-r from-slate-950 via-indigo-900 to-blue-950 text-white rounded-3xl p-4 shadow-lg border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeAvatar src={effectiveUser?.avatar} name={staffName} size="md" className="w-11 h-11 rounded-full border-2 border-indigo-300 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-black truncate">{staffName}</p>
                      <p className="text-[11px] text-indigo-200 truncate">{staffTitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-black shrink-0 cursor-pointer"
                  >
                    CMS
                  </button>
                </div>
                <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
                  {deskNavItems.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setActiveDesk(item.id); setTableSearch(''); }}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        activeDesk === item.id ? 'bg-white text-indigo-900 font-black' : 'bg-white/10 text-indigo-100'
                      }`}
                    >
                      {item.label} {item.badge > 0 ? `(${item.badge})` : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Şık İndigo Karşılama & Yetkili Anlık Arama Kartı */}
              <div className="bg-gradient-to-br from-slate-950 via-[#1E1B4B] to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-[10px] font-black uppercase tracking-wider text-sky-200 mb-2">
                        <Sparkles size={11} /> İESÜ Kariyer Geliştirme Merkezi
                      </span>
                      <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                        Hoş Geldiniz, {staffName}
                      </h2>
                      <p className="text-xs text-indigo-200/90 mt-0.5">
                        Yetkili olduğunuz {allowedGroups.length} alanda bekleyen onayları yönetin ve kurumsal akışı takip edin.
                      </p>
                    </div>
                    {totalPendingCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveDesk('stream')}
                        className="px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-black flex items-center gap-1.5 cursor-pointer hover:bg-amber-400/30 transition"
                      >
                        <CheckCircle2 size={14} /> {totalPendingCount} Bekleyen İşlem
                      </button>
                    )}
                  </div>

                  {/* Yetkili Anlık Arama */}
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300" />
                    <input
                      type="text"
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      placeholder="Yetkili olduğunuz öğrenci, mezun, firma veya ilanlarda hızlı ara..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs font-semibold text-white placeholder:text-indigo-200/70 focus:outline-none focus:bg-white/15 focus:border-sky-300/60 transition"
                    />
                    {instantSearchResults.length > 0 && (
                      <div className="absolute left-0 right-0 top-12 bg-white dark:bg-[#131c31] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 space-y-1">
                        {instantSearchResults.map(res => (
                          <button
                            key={res.id}
                            type="button"
                            onClick={() => {
                              setActiveDesk(res.desk);
                              setTableSearch(res.title);
                              setGlobalSearch('');
                            }}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-left transition cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-black text-slate-900 dark:text-white truncate">{res.title}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{res.sub}</div>
                            </div>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                              {res.tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* İçerik Yetkisi Varsa Doğrudan Akış Gönderi Oluşturucu */}
              {activeDesk === 'stream' && allowedSet.has('content') && (
                <PostComposer
                  currentUser={effectiveUser}
                  userRole={isSuperAdminViewing ? 'admin' : 'staff'}
                  posts={posts}
                  setPosts={setPosts}
                />
              )}

              {/* Masa Geçiş Şeridi (Masaüstü & Mobil Ortak Hızlı Geçiş) */}
              <div className="bg-white dark:bg-[#131c31] rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                {deskNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeDesk === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { setActiveDesk(item.id); setTableSearch(''); }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-700 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={13} />
                      <span>{item.label}</span>
                      {item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── MASA 1: AKIŞ & BEKLEYEN ONAYLAR ── */}
              {activeDesk === 'stream' && (
                <div className="space-y-5">
                  {/* Satır İçi Hızlı Onay Kuyruğu (Yalnızca Yetkili Alanlar) */}
                  {totalPendingCount > 0 && (
                    <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-indigo-200/80 dark:border-indigo-500/30 p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                          Hızlı Onay Kuyruğu ({totalPendingCount})
                        </h3>
                        <button
                          type="button"
                          onClick={() => openCmsTab('operasyon')}
                          className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Tümünü Aç <ArrowUpRight size={13} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {allowedSet.has('jobs_applications') && pendingJobs.slice(0, 3).map(job => (
                          <div key={job.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">İlan Onayı</span>
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{job.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{job.company}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button type="button" onClick={() => handleApproveJob(job.id)} className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Onayla</button>
                              <button type="button" onClick={() => handleRejectJob(job.id)} className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black cursor-pointer">Reddet</button>
                            </div>
                          </div>
                        ))}

                        {allowedSet.has('students_staj') && pendingInternships.slice(0, 2).map(v => (
                          <div key={v.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400">Staj Onayı</span>
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{v.student} — {v.company}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{v.position}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button type="button" onClick={() => handleApproveInternship(v.id)} className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Onayla</button>
                              <button type="button" onClick={() => handleRejectInternship(v.id)} className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black cursor-pointer">Reddet</button>
                            </div>
                          </div>
                        ))}

                        {allowedSet.has('companies_protocols') && pendingProtocols.slice(0, 2).map(p => (
                          <div key={p.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400">Kurumsal Protokol</span>
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{p.companyName}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Kontenjan: {p.committedQuota || 0}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button type="button" onClick={() => exportBilateralProtocolDraftPdf(p)} className="px-2 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-[11px] font-bold cursor-pointer">PDF</button>
                              <button type="button" onClick={() => handleProtocolDecision(p.id, 'ACTIVE')} className="px-2.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black cursor-pointer">Onayla</button>
                            </div>
                          </div>
                        ))}

                        {allowedSet.has('mentorship') && pendingMentorships.slice(0, 2).map(m => (
                          <div key={m.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[10px] font-black uppercase text-teal-700 dark:text-teal-400">Mentör Eşleşme</span>
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{m.title || m.mentorName || 'Mentörlük Talebi'}</p>
                            </div>
                            <button type="button" onClick={() => handleMatchMentorship(m.id)} className="px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-black shrink-0 cursor-pointer">Eşleştir</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Akış Filtre Çubuğu */}
                  <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800 px-2">
                    {[
                      { id: 'all', label: 'Tüm Akış' },
                      { id: 'announcements', label: 'Duyuru & Etkinlik' },
                      { id: 'jobs', label: 'İlanlar' },
                      { id: 'community', label: 'Paylaşımlar' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => { setFeedFilter(f.id); setVisibleFeedCount(10); }}
                        className={`pb-2.5 text-xs font-black relative transition cursor-pointer ${
                          feedFilter === f.id
                            ? 'text-indigo-700 dark:text-indigo-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {f.label}
                        {feedFilter === f.id && (
                          <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-indigo-700 dark:bg-indigo-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Canlı Topluluk & Kurumsal Akış */}
                  <div className="space-y-4">
                    {combinedFeed.length === 0 ? (
                      <div className="bg-white dark:bg-[#131c31] rounded-3xl p-10 text-center border border-slate-200/80 dark:border-slate-800">
                        <Newspaper size={32} className="mx-auto text-indigo-400 mb-2" />
                        <p className="text-sm font-black text-slate-800 dark:text-white">Akışta henüz gönderi bulunmuyor.</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yeni duyuru, etkinlik ve ilanlar yayınlandığında burada listelenir.</p>
                      </div>
                    ) : (
                      <>
                        {combinedFeed.slice(0, visibleFeedCount).map(item => (
                          <PostCard
                            key={item.id}
                            post={item}
                            currentUser={effectiveUser}
                            userRole={isSuperAdminViewing ? 'admin' : 'staff'}
                            setView={setView}
                            setSelectedUserId={setSelectedUserId}
                          />
                        ))}
                        {combinedFeed.length > visibleFeedCount && (
                          <button
                            type="button"
                            onClick={() => setVisibleFeedCount(v => v + 10)}
                            className="w-full py-3 rounded-2xl bg-white dark:bg-[#131c31] border border-slate-200 dark:border-slate-700 text-xs font-black text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition cursor-pointer"
                          >
                            Daha Fazla Göster ({combinedFeed.length - visibleFeedCount} içerik daha)
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ── MASA 2: ÖĞRENCİ & STAJ MASASI ── */}
              {activeDesk === 'students_staj' && allowedSet.has('students_staj') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Öğrenci & Staj Masası</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{filteredStudents.length} kayıtlı öğrenci • {pendingInternships.length} bekleyen staj</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => exportToCSV(filteredStudents, 'IESU_Ogrenci_Listesi.csv')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} /> Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => openCmsTab('gonullu')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                      >
                        Staj CMS →
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Öğrenci adı, bölüm veya e-posta ara..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredStudents.slice(0, 25).map(s => (
                      <div key={s.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <SafeAvatar src={s.avatar} name={s.name} size="sm" className="w-9 h-9 rounded-full shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{s.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{s.department || 'Bölüm'} • {s.year ? `${s.year}. Sınıf` : 'Aktif'}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shrink-0">
                          {s.internshipStatus || 'Staj Arayışında'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MASA 3: MEZUN & MBS MASASI ── */}
              {activeDesk === 'alumni' && allowedSet.has('alumni') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Mezun & MBS Masası</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{filteredAlumni.length} mezun kaydı</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => exportToCSV(filteredAlumni, 'IESU_Mezun_Listesi.csv')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} /> Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => openCmsTab('alumni')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                      >
                        Mezun CMS →
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Mezun adı, bölüm veya şirket ara..."
                      className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                    {[
                      { id: 'all', label: 'Tümü' },
                      { id: 'employed', label: 'Çalışanlar' },
                      { id: 'mentors', label: 'Mentörler' }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAlumniFilter(f.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                          alumniFilter === f.id ? 'bg-indigo-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredAlumni.slice(0, 25).map(a => (
                      <div key={a.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <SafeAvatar src={a.avatar} name={a.name} size="sm" className="w-9 h-9 rounded-full shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{a.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{a.department || 'Mezun'} • {a.currentCompany || 'Kariyer Ağı'}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0">
                          {a.graduationYear || a.gradYear || 'Mezun'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MASA 4: FİRMA, İLAN & PROTOKOL MASASI ── */}
              {activeDesk === 'companies_jobs' && (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications')) && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Firma, İlan & Protokol Masası</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{companies.length} firma • {corporateProtocols.length} protokol</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => exportToCSV(filteredCompanies, 'IESU_Firma_Listesi.csv')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} /> Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => openCmsTab('cms_corporate_partnerships')}
                        className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                      >
                        Protokol CRM →
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Firma adı veya sektör ara..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {filteredCompanies.slice(0, 20).map(c => (
                      <div key={c.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <SafeAvatar src={c.logo} name={c.name} size="sm" className="w-9 h-9 rounded-xl shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{c.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.sector || 'Sektör'} • {c.location || 'İstanbul'}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleCompanyStatus(c)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer shrink-0 ${
                            c.status === 'Onaylı'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {c.status || 'Onaylı'}
                        </button>
                      </div>
                    ))}
                  </div>

                  {allowedSet.has('companies_protocols') && pendingFairApps.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">Bekleyen Kariyer Fuarı Talepleri ({pendingFairApps.length})</h4>
                      {pendingFairApps.slice(0, 4).map(app => (
                        <div key={app.id} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{app.companyName || 'Firma'}</span>
                          <div className="flex gap-1.5 shrink-0">
                            <button type="button" onClick={() => handleFairDecision(app.id, 'Onaylandı')} className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black cursor-pointer">Onayla</button>
                            <button type="button" onClick={() => handleFairDecision(app.id, 'Reddedildi')} className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-[10px] font-black cursor-pointer">Reddet</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── MASA 5: İÇERİK & DUYURU MASASI ── */}
              {activeDesk === 'content' && allowedSet.has('content') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">İçerik & Duyuru Masası</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Hızlı resmi duyuru yayınlayın ve yayındaki kayıtları yönetin.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCmsTab('cms_ann')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                    >
                      Tam İçerik CMS →
                    </button>
                  </div>

                  <form onSubmit={handleQuickPublishContent} className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                    <div className="flex flex-wrap gap-1.5">
                      {['Duyuru', 'Haber', 'Etkinlik', 'Staj Takvimi'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setContentForm(f => ({ ...f, category: cat }))}
                          className={`px-3 py-1 rounded-lg text-[11px] font-black cursor-pointer transition ${
                            contentForm.category === cat ? 'bg-indigo-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={contentForm.title}
                      onChange={(e) => setContentForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Başlık yazın..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                    <textarea
                      rows={3}
                      value={contentForm.content}
                      onChange={(e) => setContentForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Duyuru veya içerik detayını yazın..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send size={13} /> Yayınla
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {announcements.slice(0, 12).map(a => (
                      <div key={a.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{a.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{a.date || 'Yayında'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteAnnouncement(a.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shrink-0"
                          title="Yayından Kaldır"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MASA 6: GELEN TALEPLER & MESAJLAR ── */}
              {activeDesk === 'messages' && allowedSet.has('messages') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Gelen Talepler & Mesajlar</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pendingMessages.length} bekleyen talep</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCmsTab('mesajlar')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                    >
                      Mesaj Merkezi →
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {mergedContactMessages.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">Henüz gelen talep bulunmuyor.</p>
                    ) : (
                      mergedContactMessages.slice(0, 12).map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setSelectedMsgId(m.id)}
                          className={`w-full text-left p-3 rounded-2xl border transition cursor-pointer ${
                            selectedMsgId === m.id
                              ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white truncate">{m.sender}</span>
                            <span className="text-[10px] font-bold text-slate-400 shrink-0">{m.date}</span>
                          </div>
                          <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 truncate">{m.subject}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{m.body}</p>
                        </button>
                      ))
                    )}
                  </div>

                  {selectedMsgId && (
                    <form onSubmit={handleReplyMessage} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <input
                        type="text"
                        value={msgReplyText}
                        onChange={(e) => setMsgReplyText(e.target.value)}
                        placeholder="Seçili talebe hızlı yanıt yazın..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                      >
                        Yanıtla
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ── MASA 7: RAPOR & EXCEL MERKEZİ ── */}
              {activeDesk === 'reports_export' && allowedSet.has('reports_export') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Rapor & Excel Merkezi</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Yalnızca yetkili olduğunuz havuzları KVKK maskeli Excel (.csv) olarak indirin.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCmsTab('cms_datapool')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                    >
                      Tam Rapor CMS →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allowedSet.has('students_staj') && (
                      <button type="button" onClick={() => exportToCSV(students, 'IESU_Ogrenciler.csv')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer transition">
                        <div className="text-left">
                          <div className="text-xs font-black text-slate-900 dark:text-white">Öğrenci Havuzu</div>
                          <div className="text-[11px] text-slate-500">{students.length} kayıt (.csv)</div>
                        </div>
                        <Download size={16} className="text-indigo-600" />
                      </button>
                    )}
                    {allowedSet.has('alumni') && (
                      <button type="button" onClick={() => exportToCSV(alumni, 'IESU_Mezunlar.csv')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer transition">
                        <div className="text-left">
                          <div className="text-xs font-black text-slate-900 dark:text-white">Mezun Havuzu (MBS)</div>
                          <div className="text-[11px] text-slate-500">{alumni.length} kayıt (.csv)</div>
                        </div>
                        <Download size={16} className="text-emerald-600" />
                      </button>
                    )}
                    {allowedSet.has('companies_protocols') && (
                      <button type="button" onClick={() => exportToCSV(corporateProtocols, 'IESU_Protokoller.csv')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer transition">
                        <div className="text-left">
                          <div className="text-xs font-black text-slate-900 dark:text-white">Kurumsal Protokoller</div>
                          <div className="text-[11px] text-slate-500">{corporateProtocols.length} kayıt (.csv)</div>
                        </div>
                        <Download size={16} className="text-blue-600" />
                      </button>
                    )}
                    {allowedSet.has('jobs_applications') && (
                      <button type="button" onClick={() => exportToCSV(applications, 'IESU_Basvurular.csv')} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer transition">
                        <div className="text-left">
                          <div className="text-xs font-black text-slate-900 dark:text-white">Başvuru Havuzu</div>
                          <div className="text-[11px] text-slate-500">{applications.length} kayıt (.csv)</div>
                        </div>
                        <Download size={16} className="text-amber-600" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* SAĞ SÜTUN: İNDİGO BENTO ÖZET, GÜNLÜK TAKİP NOTLARI & KGM HABERLERİ */}
        <aside className="hidden xl:block w-[300px] shrink-0 space-y-5 sticky top-24 self-start">
          {/* Dark Indigo Canlı Özet Kartı */}
          <div className="bg-gradient-to-br from-slate-950 via-[#1E1B4B] to-blue-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-300">Canlı Birim Özeti</span>
              <Layers size={15} className="text-indigo-300" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {allowedSet.has('students_staj') && (
                <div className="bg-white/10 rounded-2xl p-3">
                  <div className="text-lg font-black text-white">{students.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">Öğrenci</div>
                </div>
              )}
              {allowedSet.has('alumni') && (
                <div className="bg-white/10 rounded-2xl p-3">
                  <div className="text-lg font-black text-white">{alumni.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">Mezun</div>
                </div>
              )}
              {allowedSet.has('companies_protocols') && (
                <div className="bg-white/10 rounded-2xl p-3">
                  <div className="text-lg font-black text-white">{companies.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">Firma</div>
                </div>
              )}
              {allowedSet.has('jobs_applications') && (
                <div className="bg-white/10 rounded-2xl p-3">
                  <div className="text-lg font-black text-white">{jobs.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">İlan</div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black transition cursor-pointer shadow-md"
            >
              Yetkili CMS Paneline Git
            </button>
          </div>

          {/* Kişisel KGM Günlük Takip Notlarım */}
          <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Günlük Takip Notlarım</h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                {openTasksCount} açık
              </span>
            </div>
            <form onSubmit={addDailyTask} className="flex gap-1.5">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Yeni görev notu..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
              <button
                type="submit"
                aria-label="Görev Ekle"
                className="p-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer shrink-0"
              >
                <Plus size={14} />
              </button>
            </form>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {dailyTasks.map(task => (
                <div key={task.id} className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <button
                    type="button"
                    onClick={() => toggleDailyTask(task.id)}
                    className="flex items-start gap-2 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    {task.done ? (
                      <CheckSquare size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <Square size={14} className="text-slate-400 mt-0.5 shrink-0" />
                    )}
                    <span className={`text-xs leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200 font-semibold'}`}>
                      {task.text}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDailyTask(task.id)}
                    aria-label="Görevi Sil"
                    className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <BranchNewsWidget branch="staff" currentUser={effectiveUser} setView={setView} />

          <ConnectionSuggestions
            branch="staff"
            currentUser={effectiveUser}
            students={students}
            alumni={alumni}
            companies={companies}
            setView={setView}
            setSelectedUserId={setSelectedUserId}
            maxSuggestions={3}
          />

          <div className="px-2 text-[11px] text-slate-400 dark:text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
            <button type="button" onClick={() => setActiveModal('kvkk')} className="hover:text-indigo-700 cursor-pointer">KVKK</button>
            <button type="button" onClick={() => setActiveModal('gizlilik')} className="hover:text-indigo-700 cursor-pointer">Gizlilik</button>
            <button type="button" onClick={() => setActiveModal('kullanim')} className="hover:text-indigo-700 cursor-pointer">Kullanım Koşulları</button>
            <span className="w-full text-[10px] mt-1">İESÜ Kariyer Geliştirme Koordinatörlüğü © 2026</span>
          </div>
        </aside>
      </div>

      {/* ── SİTEYE ÖZGÜ İNDİGO YÜZEN ALT DOCK ── */}
      <AdminOmniDock
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setView={setView}
        setSelectedUserId={setSelectedUserId}
        currentUser={effectiveUser}
        theme="indigo"
        homeView="staff"
      />

      {activeModal && <FooterModals activeModal={activeModal} setActiveModal={setActiveModal} />}
    </div>
  );
}
