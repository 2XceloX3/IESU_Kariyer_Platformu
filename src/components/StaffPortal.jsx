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
import StaffBottomDock from './StaffBottomDock';
import FooterModals from './FooterModals';
import { combineFeedItems } from '../utils/feedCombiner';
import {
  STAFF_PERMISSION_GROUPS,
  resolveStaffPermissions
} from '../utils/staffAuth';
import {
  calculateProtocolStatus,
  exportBilateralProtocolDraftPdf,
  exportBilateralProtocolWord,
  exportPrintableReportHtml,
  PROTOCOL_STATUS_LABELS
} from '../services/protocolWorkflow';
import ProtocolEditorModal from './protocol/ProtocolEditorModal';
import { exportToCSV } from '../utils/export';
import {
  Bell, Briefcase, Building2, GraduationCap, Award,
  CheckCircle2, XCircle, Search, MessageSquare, FileText,
  Download, Plus, Trash2, CheckSquare, Square, Star,
  Send, Megaphone, Sparkles, ArrowUpRight,
  Users, Newspaper, ShieldCheck, Layers, Eye, Edit3, Printer, X, Settings2, Paperclip
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

  // Personel portalı aktifken kovan dalını 'staff' olarak sabitle (Süper Admin önizlemesinde de geri dönüşler StaffPortal'a kalır)
  useEffect(() => {
    if (setActivePortalBranch) {
      setActivePortalBranch('staff');
    }
    try { sessionStorage.removeItem('iesu_staff_cms_context'); } catch { /* intentional */ }
  }, [setActivePortalBranch]);

  // Sağ alttaki Personel Mesaj Alanından tam ekrana geçiş dinleyicisi
  useEffect(() => {
    const onOpenDesk = (ev) => {
      const target = ev?.detail?.desk;
      if (target) {
        setActiveTab('feed');
        setActiveDesk(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('iesu_open_staff_desk', onOpenDesk);
    return () => window.removeEventListener('iesu_open_staff_desk', onOpenDesk);
  }, []);

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
  const [activeDesk, setActiveDesk] = useState('stream'); // 'stream' | 'approvals' | 'students_staj' | 'alumni' | 'companies_jobs' | 'content' | 'messages' | 'reports_export' | 'staff_profile'
  const [approvalFilter, setApprovalFilter] = useState('all'); // 'all' | 'jobs' | 'staj' | 'protocols' | 'other'
  const [studentsSubTab, setStudentsSubTab] = useState('students'); // 'students' | 'staj'
  const [companiesSubTab, setCompaniesSubTab] = useState('protocols'); // 'protocols' | 'companies' | 'jobs'
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'announcements' | 'jobs' | 'community'
  const [visibleFeedCount, setVisibleFeedCount] = useState(10);
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [alumniFilter, setAlumniFilter] = useState('all');
  const [activeModal, setActiveModal] = useState(null);
  const [detailRecord, setDetailRecord] = useState(null); // { kind, title, subtitle, badge, fields: [{label, value}], body, raw }
  const [protocolEditorState, setProtocolEditorState] = useState({ open: false, mode: 'protocol', protocol: null });

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

  // Personel yetki grubundan doğrudan StaffPortal içi kendi masasına geçiş (Yönetici paneline atmaz!)
  const resolveDeskForPermissionGroup = (groupId) => {
    switch (groupId) {
      case 'students_staj': return 'students_staj';
      case 'alumni': return 'alumni';
      case 'companies_protocols':
      case 'jobs_applications': return 'companies_jobs';
      case 'content': return 'content';
      case 'messages': return 'messages';
      case 'reports_export': return 'reports_export';
      case 'mentorship':
      default: return 'approvals';
    }
  };

  // Protokol oluşturma / güncelleme (doğrudan Personel Portalı içinden)
  const handleSaveProtocol = (savedProtocol) => {
    setCorporateProtocols?.(prev => {
      const list = prev || [];
      const exists = list.some(p => p.id === savedProtocol.id);
      if (exists) {
        return list.map(p => (p.id === savedProtocol.id ? { ...p, ...savedProtocol } : p));
      }
      return [savedProtocol, ...list];
    });
    window.toast?.success?.(`${savedProtocol.companyName} protokolü kaydedildi.`);
  };

  // Tekil kayıt detayını indirme/yazdırma
  const handlePrintDetailRecord = (record) => {
    if (!record) return;
    const rows = (record.fields || []).map(f => [f.label, f.value || '—']);
    if (record.body) rows.push(['Açıklama / İçerik', record.body]);
    exportPrintableReportHtml({
      title: record.title || 'Kayıt Detayı',
      subtitle: record.subtitle || 'İESÜ Personel Portalı Kayıt Kartı',
      headers: ['Alan', 'Bilgi'],
      rows
    });
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
      { id: 'stream', label: 'Personel Ana Akışı', icon: Newspaper, badge: 0 },
      { id: 'approvals', label: 'Onay & İşlem Kuyruğu', icon: CheckCircle2, badge: totalPendingCount }
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
    items.push({ id: 'staff_profile', label: 'Personel Profilim', icon: ShieldCheck, badge: 0 });
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
              onClick={() => {
                setActivePortalBranch?.('staff');
                setView?.('notifications');
              }}
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

        {/* SOL SÜTUN: PERSONEL KİMLİK KARTI & YETKİLİ MASALAR (Bağımsız Kaydırılabilir) */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 sticky top-24 self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5 z-20 pb-24">
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
                  setActiveTab('feed');
                  setActiveDesk('staff_profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setActiveTab('feed');
                    setActiveDesk('staff_profile');
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

              {/* 3'lü Canlı Gösterge (Tıklanabilir Hızlı Özet) */}
              <div className="grid grid-cols-3 gap-1 border-y border-slate-100 dark:border-slate-800 py-3 my-4 text-center">
                <button type="button" onClick={() => setActiveDesk('approvals')} className="hover:bg-indigo-50/60 dark:hover:bg-slate-800 rounded-xl py-1 transition cursor-pointer">
                  <div className="text-base font-black text-slate-900 dark:text-white">{totalPendingCount}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Onay</div>
                </button>
                <button type="button" onClick={() => setActiveDesk('staff_profile')} className="border-x border-slate-100 dark:border-slate-800 hover:bg-indigo-50/60 dark:hover:bg-slate-800 py-1 transition cursor-pointer">
                  <div className="text-base font-black text-indigo-700 dark:text-indigo-400">{allowedGroups.length}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Yetki</div>
                </button>
                <button type="button" onClick={() => setActiveDesk('stream')} className="hover:bg-indigo-50/60 dark:hover:bg-slate-800 rounded-xl py-1 transition cursor-pointer">
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400">{openTasksCount}</div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Görev</div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('feed');
                  setActiveDesk('staff_profile');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white text-xs font-black transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck size={14} /> Profilim & Yetki Kartım
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
                    onClick={() => setActiveDesk('approvals')}
                    className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-black shrink-0 cursor-pointer"
                  >
                    Onaylar ({totalPendingCount})
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
                        onClick={() => setActiveDesk('approvals')}
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
                          onClick={() => setActiveDesk('approvals')}
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
                              <button type="button" onClick={() => setProtocolEditorState({ open: true, mode: 'protocol', protocol: p })} className="px-2 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-black cursor-pointer">Düzenle</button>
                              <button type="button" onClick={() => exportBilateralProtocolWord(p)} className="px-2 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold cursor-pointer">Word</button>
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

              {/* ── MASA 2: ÖĞRENCİ & STAJ MASASI (TAM İNCELEME & İNDİRME) ── */}
              {activeDesk === 'students_staj' && allowedSet.has('students_staj') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Öğrenci & Staj Masası</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{filteredStudents.length} kayıtlı öğrenci • {voluntaryInternships.length} staj dosyası ({pendingInternships.length} onay bekleyen)</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => exportToCSV(studentsSubTab === 'staj' ? voluntaryInternships : filteredStudents, studentsSubTab === 'staj' ? 'IESU_Staj_Basvurulari.csv' : 'IESU_Ogrenci_Listesi.csv')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} /> Excel (.csv)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (studentsSubTab === 'staj') {
                            exportPrintableReportHtml({
                              title: 'Staj & SGK Başvuru Raporu',
                              headers: ['Öğrenci', 'Kurum / İşletme', 'Pozisyon', 'Dönem / Tarih', 'Durum'],
                              rows: voluntaryInternships.map(v => [v.student || v.studentName || '—', v.company || v.companyName || '—', v.position || v.type || 'Staj', v.startDate || v.date || '—', v.status || 'Beklemede'])
                            });
                          } else {
                            exportPrintableReportHtml({
                              title: 'Öğrenci Havuzu Raporu',
                              headers: ['Ad Soyad', 'Bölüm', 'Sınıf / GNO', 'E-Posta', 'Staj Durumu'],
                              rows: filteredStudents.map(s => [s.name || '—', s.department || '—', `${s.year ? `${s.year}. Sınıf` : 'Aktif'}${s.gpa ? ` • ${s.gpa}` : ''}`, s.email || '—', s.internshipStatus || 'Staj Arayışında'])
                            });
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer size={13} /> PDF Rapor
                      </button>
                    </div>
                  </div>

                  {/* Alt Sekmeler: Öğrenciler | Staj & SGK Dosyaları */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setStudentsSubTab('students')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition ${studentsSubTab === 'students' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      Öğrenciler ({filteredStudents.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentsSubTab('staj')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition ${studentsSubTab === 'staj' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                    >
                      Staj & SGK ({voluntaryInternships.length})
                    </button>
                  </div>

                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder={studentsSubTab === 'staj' ? 'Öğrenci veya staj kurumu ara...' : 'Öğrenci adı, bölüm veya e-posta ara...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />

                  {studentsSubTab === 'students' ? (
                    <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                      {filteredStudents.slice(0, 40).map(s => (
                        <div key={s.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <SafeAvatar src={s.avatar} name={s.name} size="sm" className="w-9 h-9 rounded-full shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{s.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{s.department || 'Bölüm'} • {s.year ? `${s.year}. Sınıf` : 'Aktif'}{s.gpa ? ` • GNO: ${s.gpa}` : ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                              {s.internshipStatus || 'Staj Arayışında'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setDetailRecord({
                                kind: 'student',
                                title: s.name || 'Öğrenci Kaydı',
                                subtitle: `${s.department || 'İESÜ'} • Öğrenci Kartı`,
                                badge: s.internshipStatus || 'Aktif Öğrenci',
                                fields: [
                                  { label: 'Öğrenci No / ID', value: s.studentNo || s.id },
                                  { label: 'Fakülte / Bölüm', value: `${s.faculty ? `${s.faculty} / ` : ''}${s.department || '—'}` },
                                  { label: 'Sınıf / GNO', value: `${s.year || s.grade || '—'} • GNO: ${s.gpa || '—'}` },
                                  { label: 'E-Posta', value: s.email || '—' },
                                  { label: 'Telefon', value: s.phone || '—' },
                                  { label: 'Staj Durumu', value: s.internshipStatus || 'Staj Arayışında' },
                                  { label: 'Yetenekler', value: Array.isArray(s.skills) ? s.skills.join(', ') : (s.skills || '—') }
                                ],
                                body: s.bio || s.about || '',
                                raw: s
                              })}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-black hover:bg-indigo-50 flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> İncele
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                      {voluntaryInternships
                        .filter(v => {
                          const q = tableSearch.trim().toLocaleLowerCase('tr-TR');
                          return !q || (v.student || v.studentName || '').toLocaleLowerCase('tr-TR').includes(q) || (v.company || v.companyName || '').toLocaleLowerCase('tr-TR').includes(q);
                        })
                        .map(v => (
                          <div key={v.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{v.student || v.studentName || 'Öğrenci'} — {v.company || v.companyName || 'Kurum'}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                  v.status === 'Onaylı' ? 'bg-emerald-100 text-emerald-800' : v.status === 'Reddedildi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>{v.status || 'Beklemede'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{v.position || v.type || 'Gönüllü / Zorunlu Staj'} • {v.startDate || v.date || 'Dönem Belirtilmedi'}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDetailRecord({
                                  kind: 'staj',
                                  title: `${v.student || v.studentName || 'Öğrenci'} — Staj Dosyası`,
                                  subtitle: `${v.company || v.companyName || 'İşletme'} • ${v.position || 'Staj'}`,
                                  badge: v.status || 'Beklemede',
                                  fields: [
                                    { label: 'Dosya No', value: v.id },
                                    { label: 'Öğrenci', value: v.student || v.studentName || '—' },
                                    { label: 'Bölüm', value: v.department || '—' },
                                    { label: 'İşletme / Kurum', value: v.company || v.companyName || '—' },
                                    { label: 'Pozisyon / Tür', value: `${v.position || '—'} (${v.type || 'Staj'})` },
                                    { label: 'Tarih / Süre', value: `${v.startDate || v.date || '—'}${v.endDate ? ` — ${v.endDate}` : ''}` },
                                    { label: 'SGK / Durum', value: v.status || 'Beklemede' }
                                  ],
                                  body: v.notes || v.description || '',
                                  raw: v
                                })}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={12} /> Oku
                              </button>
                              {v.status !== 'Onaylı' && (
                                <button type="button" onClick={() => handleApproveInternship(v.id)} className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Onayla</button>
                              )}
                              {v.status !== 'Reddedildi' && (
                                <button type="button" onClick={() => handleRejectInternship(v.id)} className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold cursor-pointer">Reddet</button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── MASA 3: MEZUN & MBS MASASI (TAM İNCELEME & İNDİRME) ── */}
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
                        <Download size={13} /> Excel (.csv)
                      </button>
                      <button
                        type="button"
                        onClick={() => exportPrintableReportHtml({
                          title: 'İESÜ Mezun Bilgi Sistemi (MBS) Raporu',
                          headers: ['Ad Soyad', 'Bölüm', 'Mezuniyet', 'Çalıştığı Kurum / Pozisyon', 'Şehir / E-Posta'],
                          rows: filteredAlumni.map(a => [a.name || '—', a.department || '—', a.graduationYear || a.gradYear || '—', `${a.currentCompany || '—'}${a.position ? ` (${a.position})` : ''}`, `${a.city || a.location || '—'} • ${a.email || '—'}`])
                        })}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer size={13} /> PDF Rapor
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

                  <div className="space-y-2 max-h-[440px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredAlumni.slice(0, 40).map(a => (
                      <div key={a.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <SafeAvatar src={a.avatar} name={a.name} size="sm" className="w-9 h-9 rounded-full shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{a.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{a.department || 'Mezun'} • {a.currentCompany || 'Kariyer Ağı'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            {a.graduationYear || a.gradYear || 'Mezun'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setDetailRecord({
                              kind: 'alumni',
                              title: a.name || 'Mezun Kaydı',
                              subtitle: `${a.department || 'İESÜ Mezunu'} • MBS Kartı`,
                              badge: a.graduationYear || a.gradYear ? `${a.graduationYear || a.gradYear} Mezunu` : 'Mezun',
                              fields: [
                                { label: 'Mezun ID', value: a.id },
                                { label: 'Bölüm / Program', value: a.department || '—' },
                                { label: 'Mezuniyet Yılı', value: a.graduationYear || a.gradYear || '—' },
                                { label: 'Çalıştığı Kurum', value: a.currentCompany || '—' },
                                { label: 'Pozisyon / Unvan', value: a.position || a.title || '—' },
                                { label: 'Şehir / Ülke', value: a.city || a.location || '—' },
                                { label: 'E-Posta / Telefon', value: `${a.email || '—'}${a.phone ? ` • ${a.phone}` : ''}` },
                                { label: 'Mentörlük Durumu', value: (a.isMentor || a.mentorActive) ? 'Aktif Mentör' : 'Standart Üye' }
                              ],
                              body: a.bio || a.about || '',
                              raw: a
                            })}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-black hover:bg-indigo-50 flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> İncele
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MASA 4: FİRMA, İLAN & ÖZELLEŞTİRİLEBİLİR PROTOKOL STÜDYOSU ── */}
              {activeDesk === 'companies_jobs' && (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications')) && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Firma, İlan & Protokol Stüdyosu</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{corporateProtocols.length} protokol • {companies.length} firma • {jobs.length} ilan</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {allowedSet.has('companies_protocols') && (
                        <>
                          <button
                            type="button"
                            onClick={() => setProtocolEditorState({ open: true, mode: 'template', protocol: null })}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                          >
                            <Settings2 size={13} /> Şablonu Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => setProtocolEditorState({ open: true, mode: 'protocol', protocol: null })}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-800 hover:to-blue-800 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Plus size={13} /> Yeni Protokol
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Alt Sekmeler: Protokoller | Firmalar | İlanlar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                      {allowedSet.has('companies_protocols') && (
                        <button
                          type="button"
                          onClick={() => setCompaniesSubTab('protocols')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition ${companiesSubTab === 'protocols' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          Protokoller ({corporateProtocols.length})
                        </button>
                      )}
                      {allowedSet.has('companies_protocols') && (
                        <button
                          type="button"
                          onClick={() => setCompaniesSubTab('companies')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition ${companiesSubTab === 'companies' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          Firmalar ({companies.length})
                        </button>
                      )}
                      {allowedSet.has('jobs_applications') && (
                        <button
                          type="button"
                          onClick={() => setCompaniesSubTab('jobs')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition ${companiesSubTab === 'jobs' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          İlanlar ({jobs.length})
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (companiesSubTab === 'protocols') exportToCSV(corporateProtocols, 'IESU_Protokoller.csv');
                          else if (companiesSubTab === 'jobs') exportToCSV(jobs, 'IESU_Ilanlar.csv');
                          else exportToCSV(filteredCompanies, 'IESU_Firmalar.csv');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={12} /> Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (companiesSubTab === 'protocols') {
                            exportPrintableReportHtml({
                              title: 'Kurumsal İş Birliği Protokolleri',
                              headers: ['Kod', 'Firma / Kurum', 'Tür', 'Kontenjan', 'Geçerlilik', 'Durum'],
                              rows: corporateProtocols.map(p => [p.protocolCode || p.id, p.companyName || '—', p.protocolType || 'İş Birliği', p.committedQuota ?? p.internshipQuota ?? 0, `${p.signedDate || '—'} / ${p.validUntil || p.endDate || '—'}`, PROTOCOL_STATUS_LABELS[calculateProtocolStatus(p)] || p.status])
                            });
                          } else if (companiesSubTab === 'jobs') {
                            exportPrintableReportHtml({
                              title: 'İş & Staj İlanları Listesi',
                              headers: ['İlan Başlığı', 'Firma', 'Tür', 'Konum', 'Durum'],
                              rows: jobs.map(j => [j.title || '—', j.company || j.companyName || '—', j.type || 'İlan', j.location || 'İstanbul', j.status || 'Yayında'])
                            });
                          } else {
                            exportPrintableReportHtml({
                              title: 'Kayıtlı Kurumsal Firmalar',
                              headers: ['Firma Adı', 'Sektör', 'Konum', 'İletişim', 'Durum'],
                              rows: filteredCompanies.map(c => [c.name || '—', c.sector || '—', c.location || 'İstanbul', c.email || c.phone || '—', c.status || 'Onaylı'])
                            });
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Printer size={12} /> PDF
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder={companiesSubTab === 'protocols' ? 'Protokol kodu veya firma ara...' : companiesSubTab === 'jobs' ? 'İlan başlığı veya firma ara...' : 'Firma adı veya sektör ara...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  />

                  {/* ALT SEKME 4A: PROTOKOL STÜDYOSU LİSTESİ */}
                  {companiesSubTab === 'protocols' && allowedSet.has('companies_protocols') && (
                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto custom-scrollbar pr-1">
                      {corporateProtocols
                        .filter(p => {
                          const q = tableSearch.trim().toLocaleLowerCase('tr-TR');
                          return !q || (p.companyName || '').toLocaleLowerCase('tr-TR').includes(q) || (p.protocolCode || '').toLocaleLowerCase('tr-TR').includes(q);
                        })
                        .map(p => {
                          const st = calculateProtocolStatus(p);
                          return (
                            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 space-y-2.5">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200">{p.protocolCode || p.id}</span>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                      st === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : st === 'EXPIRED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {PROTOCOL_STATUS_LABELS[st] || p.status}
                                    </span>
                                    {p.attachedFile && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                                        <Paperclip size={10} /> {p.attachedFile.name}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">{p.companyName}</h4>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {p.protocolType || 'İş Birliği Protokolü'} • Kontenjan: {p.committedQuota ?? p.internshipQuota ?? 0} • Bitiş: {p.validUntil || p.endDate || '—'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-700">
                                <button
                                  type="button"
                                  onClick={() => setProtocolEditorState({ open: true, mode: 'protocol', protocol: p })}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 size={12} /> Protokolü Düzenle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => exportBilateralProtocolWord(p)}
                                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                                >
                                  <Download size={12} /> Word (.doc)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => exportBilateralProtocolDraftPdf(p)}
                                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Printer size={12} /> PDF
                                </button>
                                {st !== 'ACTIVE' && (
                                  <button
                                    type="button"
                                    onClick={() => handleProtocolDecision(p.id, 'ACTIVE')}
                                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer ml-auto"
                                  >
                                    Yürürlüğe Al
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* ALT SEKME 4B: FİRMALAR */}
                  {companiesSubTab === 'companies' && allowedSet.has('companies_protocols') && (
                    <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                      {filteredCompanies.slice(0, 30).map(c => (
                        <div key={c.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <SafeAvatar src={c.logo} name={c.name} size="sm" className="w-9 h-9 rounded-xl shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-900 dark:text-white truncate">{c.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.sector || 'Sektör'} • {c.location || 'İstanbul'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setDetailRecord({
                                kind: 'company',
                                title: c.name || 'Firma Kaydı',
                                subtitle: `${c.sector || 'Kurumsal İşveren'} • ${c.location || 'İstanbul'}`,
                                badge: c.status || 'Onaylı',
                                fields: [
                                  { label: 'Firma ID', value: c.id },
                                  { label: 'Sektör', value: c.sector || '—' },
                                  { label: 'Konum / Adres', value: c.address || c.location || '—' },
                                  { label: 'Yetkili / E-Posta', value: `${c.contactPerson || '—'} • ${c.email || '—'}` },
                                  { label: 'Telefon / Web', value: `${c.phone || '—'} • ${c.website || '—'}` },
                                  { label: 'Durum', value: c.status || 'Onaylı' }
                                ],
                                body: c.description || c.about || '',
                                raw: c
                              })}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={12} /> İncele
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleCompanyStatus(c)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black cursor-pointer ${
                                c.status === 'Onaylı'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {c.status || 'Onaylı'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ALT SEKME 4C: İŞ & STAJ İLANLARI */}
                  {companiesSubTab === 'jobs' && allowedSet.has('jobs_applications') && (
                    <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                      {jobs
                        .filter(j => {
                          const q = tableSearch.trim().toLocaleLowerCase('tr-TR');
                          return !q || (j.title || '').toLocaleLowerCase('tr-TR').includes(q) || (j.company || j.companyName || '').toLocaleLowerCase('tr-TR').includes(q);
                        })
                        .map(j => (
                          <div key={j.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate">{j.title}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                  j.status === 'Yayında' || j.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : j.status === 'Reddedildi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>{j.status || 'Yayında'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{j.company || j.companyName} • {j.location || 'İstanbul'} • {j.type || 'İlan'}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDetailRecord({
                                  kind: 'job',
                                  title: j.title || 'İlan Detayı',
                                  subtitle: `${j.company || j.companyName || 'Firma'} • ${j.location || 'İstanbul'}`,
                                  badge: j.status || 'Yayında',
                                  fields: [
                                    { label: 'İlan ID', value: j.id },
                                    { label: 'Firma', value: j.company || j.companyName || '—' },
                                    { label: 'Çalışma Türü', value: `${j.type || '—'}${j.workMode ? ` (${j.workMode})` : ''}` },
                                    { label: 'Konum', value: j.location || 'İstanbul' },
                                    { label: 'Başvuru Sayısı', value: String(applications.filter(a => a.jobId === j.id).length) },
                                    { label: 'Son Başvuru / Tarih', value: j.deadline || j.date || '—' }
                                  ],
                                  body: j.description || j.requirements || '',
                                  raw: j
                                })}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                              >
                                <Eye size={12} /> Oku
                              </button>
                              {j.status !== 'Yayında' && (
                                <button type="button" onClick={() => handleApproveJob(j.id)} className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Yayınla</button>
                              )}
                              {j.status !== 'Reddedildi' && (
                                <button type="button" onClick={() => handleRejectJob(j.id)} className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold cursor-pointer">Kaldır</button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

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

              {/* ── MASA 5: İÇERİK & DUYURU MASASI (YÖNETİCİYE GİTMEDEN TAM YÖNETİM) ── */}
              {activeDesk === 'content' && allowedSet.has('content') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">İçerik & Duyuru Masası</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Resmî duyuru, haber ve etkinlik içeriklerini doğrudan buradan yayınlayın ve okuyun.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportToCSV(announcements, 'IESU_Duyurular.csv')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Download size={13} /> Excel
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

                  <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    {announcements.slice(0, 20).map(a => (
                      <div key={a.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{a.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{a.category || 'Duyuru'} • {a.date || 'Yayında'}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setDetailRecord({
                              kind: 'announcement',
                              title: a.title || 'Duyuru',
                              subtitle: `${a.category || 'Resmî Duyuru'} • ${a.date || 'Yayında'}`,
                              badge: a.status || 'Yayında',
                              fields: [
                                { label: 'Kategori', value: a.category || 'Duyuru' },
                                { label: 'Yayın Tarihi', value: a.date || '—' },
                                { label: 'Yayınlayan', value: a.author || 'Kariyer Geliştirme Koordinatörlüğü' }
                              ],
                              body: a.content || a.summary || '',
                              raw: a
                            })}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 text-[11px] font-black cursor-pointer"
                          >
                            Oku
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAnnouncement(a.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                            title="Yayından Kaldır"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── MASA 6: GELEN TALEPLER & MESAJLAR (DETAYLI OKUMA & YANIT) ── */}
              {activeDesk === 'messages' && allowedSet.has('messages') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">Gelen Talepler & Mesajlar</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pendingMessages.length} bekleyen • {mergedContactMessages.length} toplam kayıt</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => exportToCSV(mergedContactMessages, 'IESU_Gelen_Talepler.csv')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Download size={13} /> Excel
                    </button>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                    {mergedContactMessages.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">Henüz gelen talep bulunmuyor.</p>
                    ) : (
                      mergedContactMessages.slice(0, 20).map(m => (
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

                  {selectedMsgId && (() => {
                    const activeMsg = mergedContactMessages.find(m => m.id === selectedMsgId);
                    if (!activeMsg) return null;
                    return (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-xs font-black text-slate-900 dark:text-white">{activeMsg.sender}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{activeMsg.email} • {activeMsg.date}</p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">{activeMsg.status}</span>
                          </div>
                          <p className="text-xs font-black text-indigo-700 dark:text-indigo-300">{activeMsg.subject}</p>
                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">{activeMsg.body || 'Mesaj içeriği bulunmuyor.'}</p>
                        </div>
                        <form onSubmit={handleReplyMessage} className="flex gap-2">
                          <input
                            type="text"
                            value={msgReplyText}
                            onChange={(e) => setMsgReplyText(e.target.value)}
                            placeholder="Seçili talebe kurumsal yanıtınızı yazın..."
                            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black cursor-pointer"
                          >
                            Yanıtla
                          </button>
                        </form>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── MASA 7: RAPOR & EXCEL / PDF MERKEZİ (TAM YEREL İNDİRME) ── */}
              {activeDesk === 'reports_export' && allowedSet.has('reports_export') && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Rapor, Excel & PDF Merkezi</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Yetkili olduğunuz tüm veri havuzlarını doğrudan buradan Excel (.csv) veya kurumsal PDF raporu olarak indirin.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allowedSet.has('students_staj') && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">Öğrenci & Staj Havuzu</div>
                          <div className="text-[11px] text-slate-500">{students.length} öğrenci • {voluntaryInternships.length} staj</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => exportToCSV(students, 'IESU_Ogrenciler.csv')} className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Excel (.csv)</button>
                          <button
                            type="button"
                            onClick={() => exportPrintableReportHtml({
                              title: 'Öğrenci Havuzu Özeti',
                              headers: ['Ad Soyad', 'Bölüm', 'E-Posta', 'Staj Durumu'],
                              rows: students.map(s => [s.name || '—', s.department || '—', s.email || '—', s.internshipStatus || 'Aktif'])
                            })}
                            className="flex-1 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black cursor-pointer"
                          >
                            PDF Rapor
                          </button>
                        </div>
                      </div>
                    )}
                    {allowedSet.has('alumni') && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">Mezun Havuzu (MBS)</div>
                          <div className="text-[11px] text-slate-500">{alumni.length} mezun kaydı</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => exportToCSV(alumni, 'IESU_Mezunlar.csv')} className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Excel (.csv)</button>
                          <button
                            type="button"
                            onClick={() => exportPrintableReportHtml({
                              title: 'Mezun Bilgi Sistemi (MBS) Raporu',
                              headers: ['Ad Soyad', 'Bölüm', 'Yıl', 'Kurum'],
                              rows: alumni.map(a => [a.name || '—', a.department || '—', a.graduationYear || a.gradYear || '—', a.currentCompany || '—'])
                            })}
                            className="flex-1 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black cursor-pointer"
                          >
                            PDF Rapor
                          </button>
                        </div>
                      </div>
                    )}
                    {allowedSet.has('companies_protocols') && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">Firmalar & Protokoller</div>
                          <div className="text-[11px] text-slate-500">{companies.length} firma • {corporateProtocols.length} protokol</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => exportToCSV(corporateProtocols, 'IESU_Protokoller.csv')} className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Excel (.csv)</button>
                          <button
                            type="button"
                            onClick={() => exportPrintableReportHtml({
                              title: 'Kurumsal İş Birliği Protokolleri Raporu',
                              headers: ['Kod', 'Firma', 'Kontenjan', 'Bitiş', 'Durum'],
                              rows: corporateProtocols.map(p => [p.protocolCode || p.id, p.companyName || '—', p.committedQuota ?? 0, p.validUntil || p.endDate || '—', PROTOCOL_STATUS_LABELS[calculateProtocolStatus(p)] || p.status])
                            })}
                            className="flex-1 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black cursor-pointer"
                          >
                            PDF Rapor
                          </button>
                        </div>
                      </div>
                    )}
                    {allowedSet.has('jobs_applications') && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">İlan & Başvuru Havuzu</div>
                          <div className="text-[11px] text-slate-500">{jobs.length} ilan • {applications.length} başvuru</div>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => exportToCSV(applications, 'IESU_Basvurular.csv')} className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black cursor-pointer">Excel (.csv)</button>
                          <button
                            type="button"
                            onClick={() => exportPrintableReportHtml({
                              title: 'İlan & Başvuru Özeti',
                              headers: ['İlan', 'Firma', 'Tür', 'Durum'],
                              rows: jobs.map(j => [j.title || '—', j.company || j.companyName || '—', j.type || 'İlan', j.status || 'Yayında'])
                            })}
                            className="flex-1 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-black cursor-pointer"
                          >
                            PDF Rapor
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ ÖZEL PERSONEL SAYFASI 1: ONAY & İŞLEM KUYRUĞU ═══ */}
              {activeDesk === 'approvals' && (
                <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-5" data-testid="staff-approvals-page">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-indigo-600" /> Personel Onay & İşlem Kuyruğu
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Yetkili olduğunuz tüm bekleyen ilan, staj, protokol ve fuar taleplerini buradan sonuçlandırın.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-700/40 text-xs font-black text-indigo-700 dark:text-indigo-300">
                      {totalPendingCount} Bekleyen
                    </span>
                  </div>

                  {/* Kategori Filtre Hapları */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: `Tümü (${totalPendingCount})` },
                      ...(allowedSet.has('jobs_applications') ? [{ id: 'jobs', label: `İlanlar (${pendingJobs.length})` }] : []),
                      ...(allowedSet.has('students_staj') ? [{ id: 'staj', label: `Stajlar (${pendingInternships.length})` }] : []),
                      ...(allowedSet.has('companies_protocols') ? [{ id: 'protocols', label: `Protokoller (${pendingProtocols.length})` }] : []),
                      ...((allowedSet.has('companies_protocols') || allowedSet.has('mentorship')) ? [{ id: 'other', label: `Fuar & Mentörlük (${(allowedSet.has('companies_protocols') ? pendingFairApps.length : 0) + (allowedSet.has('mentorship') ? pendingMentorships.length : 0)})` }] : [])
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setApprovalFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                          approvalFilter === tab.id
                            ? 'bg-indigo-700 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {totalPendingCount === 0 ? (
                    <div className="py-10 text-center bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 space-y-2">
                      <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">Bekleyen Onay Kalmadı</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Yetkili olduğunuz tüm operasyon kuyrukları güncel durumda.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Bekleyen İlanlar */}
                      {(approvalFilter === 'all' || approvalFilter === 'jobs') && allowedSet.has('jobs_applications') && pendingJobs.map(job => (
                        <div key={job.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">Firma İlanı Onayı</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{job.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{job.company || job.companyName} • {job.location || 'İstanbul'} • {job.type || 'İlan'}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => handleRejectJob(job.id)} className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer">Reddet</button>
                            <button type="button" onClick={() => handleApproveJob(job.id)} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer">Onayla & Yayınla</button>
                          </div>
                        </div>
                      ))}

                      {/* Bekleyen Staj Başvuruları */}
                      {(approvalFilter === 'all' || approvalFilter === 'staj') && allowedSet.has('students_staj') && pendingInternships.map(staj => (
                        <div key={staj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">Staj / SGK Başvurusu</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{staj.studentName || 'Öğrenci'} — {staj.companyName || staj.company || 'İşletme'}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{staj.department || 'İESÜ'} • {staj.type || 'Staj'} • {staj.startDate || 'Yakın Tarih'}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => handleRejectInternship(staj.id)} className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer">Reddet</button>
                            <button type="button" onClick={() => handleApproveInternship(staj.id)} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer">Onayla</button>
                          </div>
                        </div>
                      ))}

                      {/* Bekleyen Kurumsal Protokoller */}
                      {(approvalFilter === 'all' || approvalFilter === 'protocols') && allowedSet.has('companies_protocols') && pendingProtocols.map(proto => (
                        <div key={proto.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">Üniversite-Sanayi Protokolü</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{proto.companyName || proto.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Kontenjan: {proto.internshipQuota || 0} Stajyer • Bitiş: {proto.endDate || '-'}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            <button type="button" onClick={() => setProtocolEditorState({ open: true, mode: 'protocol', protocol: proto })} className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-black cursor-pointer">Düzenle</button>
                            <button type="button" onClick={() => exportBilateralProtocolWord(proto)} className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold cursor-pointer">Word</button>
                            <button type="button" onClick={() => exportBilateralProtocolDraftPdf?.(proto)} className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer">PDF</button>
                            <button type="button" onClick={() => handleProtocolDecision(proto.id, 'REVISION_REQUIRED')} className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold cursor-pointer">Revizyon</button>
                            <button type="button" onClick={() => handleProtocolDecision(proto.id, 'ACTIVE')} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer">Yürürlüğe Al</button>
                          </div>
                        </div>
                      ))}

                      {/* Fuar & Mentörlük */}
                      {(approvalFilter === 'all' || approvalFilter === 'other') && allowedSet.has('companies_protocols') && pendingFairApps.map(app => (
                        <div key={app.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">Kariyer Fuarı Stant Talebi</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{app.companyName || 'Kurumsal Firma'}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{app.contactName || 'Yetkili'} • {app.sector || 'Sektör'}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button type="button" onClick={() => handleFairDecision(app.id, 'Reddedildi')} className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer">Reddet</button>
                            <button type="button" onClick={() => handleFairDecision(app.id, 'Onaylandı')} className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer">Onayla</button>
                          </div>
                        </div>
                      ))}

                      {(approvalFilter === 'all' || approvalFilter === 'other') && allowedSet.has('mentorship') && pendingMentorships.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">Mentörlük Eşleştirmesi</span>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 truncate">{m.studentName || 'Öğrenci'} ↔ {m.mentorName || 'Mezun Mentör'}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{m.topic || 'Kariyer Mentörlüğü'}</p>
                          </div>
                          <button type="button" onClick={() => handleMatchMentorship(m.id)} className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black cursor-pointer shrink-0">Eşleştir</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ ÖZEL PERSONEL SAYFASI 2: PERSONEL PROFİLİ, YETKİ HARİTASI & ÖZET ═══ */}
              {activeDesk === 'staff_profile' && (
                <div className="space-y-5" data-testid="staff-profile-page">
                  <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="h-24 bg-gradient-to-r from-slate-900 via-indigo-800 to-blue-800 relative px-6 flex items-end pb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
                        İESÜ Kurumsal Personel Kimlik Kartı
                      </span>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl border-2 border-indigo-200 bg-white overflow-hidden shadow-sm shrink-0">
                          <SafeAvatar src={effectiveUser?.avatar} name={staffName} size="lg" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white">{staffName}</h3>
                          <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{staffTitle}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {effectiveUser?.email || 'kariyer@esenyurt.edu.tr'} {effectiveUser?.username ? `• @${effectiveUser.username}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {allowedSet.has('companies_protocols') && (
                          <button
                            type="button"
                            onClick={() => setProtocolEditorState({ open: true, mode: 'template', protocol: null })}
                            className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black transition shadow-sm cursor-pointer flex items-center gap-1.5"
                          >
                            <Settings2 size={14} /> Protokol Şablonu
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personel Yetki Matrisi */}
                  <div className="bg-white dark:bg-[#131c31] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">Atanmış Yetki Haritam</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Yalnızca Kariyer Geliştirme Koordinatörlüğü tarafından size tanımlanan modüller aktiftir.</p>
                      </div>
                      <span className="text-xs font-black text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
                        {allowedGroups.length} / {STAFF_PERMISSION_GROUPS.length} Aktif
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {STAFF_PERMISSION_GROUPS.map(group => {
                        const isAllowed = allowedSet.has(group.id);
                        return (
                          <div
                            key={group.id}
                            className={`p-4 rounded-2xl border transition ${
                              isAllowed
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-700/50'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="text-xs font-black text-slate-900 dark:text-white">{group.label}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isAllowed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                {isAllowed ? 'Yetkili' : 'Kapalı'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{group.desc}</p>
                            {isAllowed && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTab('feed');
                                  setActiveDesk(resolveDeskForPermissionGroup(group.id));
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="mt-2.5 text-[11px] font-black text-indigo-700 dark:text-indigo-300 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                Masayı Aç <ArrowUpRight size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* SAĞ SÜTUN: İNDİGO BENTO ÖZET, GÜNLÜK TAKİP NOTLARI & KGM HABERLERİ (Bağımsız Kaydırılabilir) */}
        <aside className="hidden xl:block w-[300px] shrink-0 space-y-5 sticky top-24 self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5 pb-24">
          {/* Dark Indigo Canlı Özet Kartı */}
          <div className="bg-gradient-to-br from-slate-950 via-[#1E1B4B] to-blue-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-300">Canlı Birim Özeti</span>
              <Layers size={15} className="text-indigo-300" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {allowedSet.has('students_staj') && (
                <button type="button" onClick={() => { setActiveDesk('students_staj'); setStudentsSubTab('students'); }} className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-left transition cursor-pointer">
                  <div className="text-lg font-black text-white">{students.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">Öğrenci</div>
                </button>
              )}
              {allowedSet.has('alumni') && (
                <button type="button" onClick={() => setActiveDesk('alumni')} className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-left transition cursor-pointer">
                  <div className="text-lg font-black text-white">{alumni.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">Mezun</div>
                </button>
              )}
              {allowedSet.has('companies_protocols') && (
                <button type="button" onClick={() => { setActiveDesk('companies_jobs'); setCompaniesSubTab('companies'); }} className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-left transition cursor-pointer">
                  <div className="text-lg font-black text-white">{companies.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">Firma</div>
                </button>
              )}
              {allowedSet.has('jobs_applications') && (
                <button type="button" onClick={() => { setActiveDesk('companies_jobs'); setCompaniesSubTab('jobs'); }} className="bg-white/10 hover:bg-white/15 rounded-2xl p-3 text-left transition cursor-pointer">
                  <div className="text-lg font-black text-white">{jobs.length}</div>
                  <div className="text-[10px] font-bold text-indigo-200">İlan</div>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setActiveDesk('approvals')}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black transition cursor-pointer shadow-md"
            >
              Onay & İşlem Kuyruğunu Aç ({totalPendingCount})
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

      {/* ── SADECE PERSONELE ÖZEL 4'LÜ İNDİGO YÜZEN ALT PANEL (Mesajlar sağ alttaki Personel Mesaj Alanında) ── */}
      <StaffBottomDock
        activeTab={activeTab}
        activeDesk={activeDesk}
        onSelectDesk={(deskId) => {
          setActiveTab('feed');
          setActiveDesk(deskId);
          setTableSearch('');
        }}
        pendingCount={totalPendingCount}
        primaryOpsDesk={
          (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications'))
            ? 'companies_jobs'
            : allowedSet.has('students_staj')
              ? 'students_staj'
              : allowedSet.has('alumni')
                ? 'alumni'
                : allowedSet.has('reports_export')
                  ? 'reports_export'
                  : allowedSet.has('content')
                    ? 'content'
                    : 'approvals'
        }
        primaryOpsLabel={
          (allowedSet.has('companies_protocols') || allowedSet.has('jobs_applications'))
            ? 'İlan & Firma'
            : allowedSet.has('students_staj')
              ? 'Stajlar'
              : allowedSet.has('alumni')
                ? 'Mezunlar'
                : allowedSet.has('reports_export')
                  ? 'Raporlar'
                  : allowedSet.has('content')
                    ? 'İçerikler'
                    : 'Masam'
        }
        staffAvatar={effectiveUser?.avatar}
        staffName={staffName}
      />

      {/* ── DETAYLI KAYIT OKUMA & İNDİRME MODALI (PERSONEL PORTALI İÇİ) ── */}
      {detailRecord && (
        <div
          className="fixed inset-0 z-[9998] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          data-testid="staff-detail-modal"
        >
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-slate-950 via-indigo-900 to-blue-900 text-white px-5 py-4 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-sky-200 mb-1">
                  {detailRecord.badge || 'Kayıt Detayı'}
                </span>
                <h3 className="text-base font-black truncate">{detailRecord.title}</h3>
                <p className="text-[11px] text-indigo-200 truncate">{detailRecord.subtitle}</p>
              </div>
              <button type="button" onClick={() => setDetailRecord(null)} aria-label="Kapat" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0">
                <X size={17} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(detailRecord.fields || []).map((f, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{f.label}</div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 break-words">{f.value || '—'}</div>
                  </div>
                ))}
              </div>
              {detailRecord.body && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Açıklama / Detay Metni</div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">{detailRecord.body}</p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintDetailRecord(detailRecord)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} /> PDF / Yazdır
                </button>
                <button
                  type="button"
                  onClick={() => exportToCSV([detailRecord.raw || detailRecord], `IESU_${detailRecord.kind || 'kayit'}.csv`)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> Excel (.csv)
                </button>
              </div>
              <button type="button" onClick={() => setDetailRecord(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ÖZELLEŞTİRİLEBİLİR PROTOKOL & KURUMSAL ŞABLON STÜDYOSU ── */}
      {protocolEditorState.open && (
        <ProtocolEditorModal
          isOpen={protocolEditorState.open}
          onClose={() => setProtocolEditorState({ open: false, mode: 'protocol', protocol: null })}
          initialMode={protocolEditorState.mode}
          protocol={protocolEditorState.protocol}
          existingCount={corporateProtocols.length}
          onSaveProtocol={handleSaveProtocol}
        />
      )}

      {activeModal && <FooterModals activeModal={activeModal} setActiveModal={setActiveModal} />}
    </div>
  );
}
