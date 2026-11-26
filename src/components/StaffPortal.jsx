import React, { useState, useMemo, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SafeAvatar from './shared/SafeAvatar';
import {
  STAFF_PERMISSION_GROUPS,
  resolveStaffPermissions
} from '../utils/staffAuth';
import { calculateProtocolStatus } from '../services/protocolWorkflow';
import {
  Briefcase,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Award,
  Building2,
  FileText,
  Users,
  MessageSquare,
  Database,
  ArrowRight,
  Send,
  Calendar,
  Home,
  UserCheck,
  Sparkles,
  Lock,
  ClipboardList,
  Megaphone
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

const GROUP_STYLES = {
  rose: 'bg-rose-50 text-[#990000] border-rose-200 hover:border-[#990000]',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-500',
  blue: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-500',
  amber: 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-500',
  violet: 'bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-500',
  teal: 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-500',
  sky: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-500',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-500'
};

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

  const students = useAppStore(state => state.students) || [];
  const alumni = useAppStore(state => state.alumni) || [];
  const companies = useAppStore(state => state.companies) || [];
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
  const messages = useAppStore(state => state.messages) || [];
  const notifications = useAppStore(state => state.notifications) || [];
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const storeProtocols = useAppStore(state => state.corporateProtocols) || [];

  const [quickAnnTitle, setQuickAnnTitle] = useState('');
  const [quickAnnBody, setQuickAnnBody] = useState('');

  useEffect(() => {
    useAppStore.getState().setActivePortalBranch?.('staff');
  }, []);

  const corporateProtocols = useMemo(() => {
    try {
      const local = JSON.parse(localStorage.getItem('iesu_corporate_protocols_v1') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        const ids = new Set(local.map(p => p.id));
        return [...local, ...storeProtocols.filter(p => !ids.has(p.id))];
      }
    } catch { /* intentional */ }
    return storeProtocols;
  }, [storeProtocols]);

  // Canlı yetki grupları — Süper Yönetici CMS'te yetki değiştirdiğinde anında yansır
  const allowedGroupIds = useMemo(() => resolveStaffPermissions(effectiveUser), [effectiveUser]);
  const allowedSet = useMemo(() => new Set(allowedGroupIds), [allowedGroupIds]);
  const allowedGroups = useMemo(
    () => STAFF_PERMISSION_GROUPS.filter(g => allowedSet.has(g.id)),
    [allowedSet]
  );

  const openCmsTab = (tabId) => {
    try {
      sessionStorage.setItem('iesu_cms_initial_tab', tabId);
    } catch { /* intentional */ }
    useAppStore.getState().setActivePortalBranch?.('staff');
    setView?.('admin_cms');
  };

  // Canlı bekleyen kuyruklar (yalnızca yetkili olduğu alanlar için)
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
  const pendingMentorships = useMemo(
    () => mentorships.filter(m => m?.status === 'Eşleştirme Bekliyor' || m?.status === 'Beklemede'),
    [mentorships]
  );
  const unreadMessages = useMemo(
    () => messages.filter(m => !m?.read),
    [messages]
  );

  const getGroupMetric = (groupId) => {
    switch (groupId) {
      case 'students_staj':
        return { value: students.length, sub: `${pendingInternships.length} staj onayı bekliyor` };
      case 'alumni':
        return { value: alumni.length, sub: 'Kayıtlı mezun (MBS)' };
      case 'companies_protocols':
        return { value: companies.length, sub: `${pendingProtocols.length} bekleyen protokol` };
      case 'jobs_applications':
        return { value: jobs.length, sub: `${pendingJobs.length} ilan • ${applications.length} başvuru` };
      case 'content':
        return { value: announcements.length, sub: 'Yayındaki duyuru & içerik' };
      case 'mentorship':
        return { value: mentorships.length, sub: `${pendingMentorships.length} eşleşme bekliyor` };
      case 'messages':
        return { value: messages.length, sub: `${unreadMessages.length} okunmamış mesaj` };
      case 'reports_export':
        return { value: students.length + alumni.length + companies.length, sub: 'Excel / JSON veri havuzu' };
      default:
        return { value: 0, sub: 'Aktif modül' };
    }
  };

  const handleApproveJob = (jobId) => {
    setJobs?.(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Yayında' } : j));
    window.toast?.success?.('İlan onaylandı ve yayına alındı.');
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

  const handlePublishQuickAnnouncement = (e) => {
    e.preventDefault();
    if (!quickAnnTitle.trim() || !quickAnnBody.trim()) {
      window.toast?.error?.('Lütfen duyuru başlığı ve içeriğini doldurun.');
      return;
    }
    const today = new Date().toLocaleDateString('tr-TR');
    const newAnn = {
      id: `ANN-STAFF-${Date.now()}`,
      title: quickAnnTitle.trim(),
      content: quickAnnBody.trim(),
      date: today,
      category: 'KGM Duyuru',
      author: effectiveUser?.name || 'Kariyer Geliştirme Merkezi',
      status: 'Yayında'
    };
    setAnnouncements?.(prev => [newAnn, ...(prev || [])]);
    setPosts?.(prev => [{
      id: `POST-STAFF-${Date.now()}`,
      author: {
        id: effectiveUser?.id || 'STAFF-POST',
        name: effectiveUser?.name || 'Kariyer Geliştirme Merkezi',
        title: effectiveUser?.staffTitle || 'Kurumsal Personel',
        avatar: effectiveUser?.avatar || '/iesu-logo.svg',
        role: 'staff'
      },
      title: newAnn.title,
      content: `${newAnn.title}\n\n${newAnn.content}`,
      date: today,
      likes: 0,
      comments: [],
      status: 'Yayında'
    }, ...(prev || [])]);
    setQuickAnnTitle('');
    setQuickAnnBody('');
    window.toast?.success?.('Kurumsal duyuru yayınlandı.');
  };

  const totalPendingInScope =
    (allowedSet.has('jobs_applications') ? pendingJobs.length : 0) +
    (allowedSet.has('students_staj') ? pendingInternships.length : 0) +
    (allowedSet.has('companies_protocols') ? pendingProtocols.length : 0) +
    (allowedSet.has('messages') ? unreadMessages.length : 0);

  const openOwnProfile = () => {
    const selfId = effectiveUser?.id || effectiveUser?.uid || 'self';
    setSelectedUserId?.(selfId);
    useAppStore.getState().setSelectedUserId?.(selfId);
    setView?.('user_profile');
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* ─── BESPOKE STAFF WORKSPACE NAVBAR (INDIGO SLATE IDENTITY) ─── */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-indigo-100 dark:border-slate-800 z-40">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onKeyDown={(e) => { if (e.key === 'Enter') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <Logo color="indigo" className="h-10 w-auto shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-indigo-950 dark:text-white tracking-tight leading-none mb-0.5">
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                KGM Personel Çalışma Portalı
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950 text-white text-[11px] font-black uppercase tracking-wider shadow-sm border border-indigo-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{effectiveUser?.staffTitle || 'KURUMSAL PERSONEL'}</span>
            <span className="text-indigo-300">•</span>
            <span className="text-indigo-200">{allowedGroups.length} Yetki Alanı</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setView?.('notifications')}
              className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-indigo-700 dark:text-indigo-300 transition relative cursor-pointer"
              title="Bildirimler"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
              )}
            </button>
            <TopProfileMenu
              currentUser={effectiveUser}
              userRole={userRole === 'admin' ? 'admin' : 'staff'}
              setView={setView}
              setSelectedUserId={setSelectedUserId}
              academicRole={academicRole || 'staff'}
              currentView="staff"
            />
          </div>
        </div>
      </nav>

      {/* ─── MAIN STAFF WORKSPACE ─── */}
      <main className="pt-24 pb-28 max-w-[1380px] mx-auto px-4 sm:px-6 space-y-6">
        {/* 1. PERSONALIZED EXECUTIVE STAFF HERO BANNER */}
        <section className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white p-6 sm:p-8 shadow-xl border border-indigo-800/50 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-indigo-300/40 p-1.5 backdrop-blur-md shrink-0 shadow-lg flex items-center justify-center">
                <SafeAvatar
                  src={effectiveUser?.avatar}
                  name={effectiveUser?.name || 'Kurumsal Personel'}
                  size="full"
                  rounded="rounded-xl"
                  className="w-full h-full"
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    Aktif Görev Oturumu
                  </span>
                  {effectiveUser?.username && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 font-mono text-[11px] font-bold">
                      @{effectiveUser.username}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Hoş geldiniz, {effectiveUser?.name || 'Kurumsal Personel'}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                  {effectiveUser?.staffTitle || 'Kurumsal Personel'} • {effectiveUser?.department || 'Kariyer Geliştirme Merkezi'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')}
                className="px-5 py-3 rounded-2xl bg-white text-indigo-950 hover:bg-indigo-50 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard size={16} /> Yetkili CMS Masasını Aç
              </button>
              <button
                type="button"
                onClick={() => setView?.('profile_update')}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition cursor-pointer"
              >
                Bilgilerimi Güncelle
              </button>
            </div>
          </div>

          {/* ASSIGNED PERMISSIONS RIBBON */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mr-1">
                <ShieldCheck size={14} className="text-emerald-400" /> Tanımlı Yetkileriniz:
              </span>
              {allowedGroups.length === 0 ? (
                <span className="text-xs font-bold text-amber-300">Henüz aktif modül yetkisi atanmamış — koordinatörlükle iletişime geçin.</span>
              ) : (
                allowedGroups.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => openCmsTab(g.primaryTab)}
                    className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-white transition cursor-pointer"
                  >
                    {g.shortLabel}
                  </button>
                ))
              )}
            </div>
            <div className="text-[11px] font-bold text-indigo-200 shrink-0">
              Bekleyen Görev: <span className="text-emerald-300 font-black">{totalPendingInScope}</span>
            </div>
          </div>
        </section>

        {/* 2. TWO-COLUMN OPERATIONAL DESK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / MAIN (8 COLS): GRANTED MODULES + LIVE ACTION QUEUES */}
          <div className="lg:col-span-8 space-y-6">
            {/* GRANTED MODULES GRID */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={17} className="text-indigo-600" /> Yetkili Olduğunuz Çalışma Modülleri
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Sadece Süper Yönetici tarafından size tanımlanan operasyon alanları listelenir.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-black">
                  {allowedGroups.length} / {STAFF_PERMISSION_GROUPS.length} Modül
                </span>
              </div>

              {allowedGroups.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                  <Lock size={28} className="mx-auto text-slate-400" />
                  <p className="text-sm font-black text-slate-700">Yetki Alanı Bulunmuyor</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Kariyer Geliştirme Koordinatörlüğü tarafından çalışma alanlarınız tanımlandığında modülleriniz burada otomatik açılacaktır.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {allowedGroups.map(group => {
                    const Icon = GROUP_ICONS[group.id] || LayoutDashboard;
                    const metric = getGroupMetric(group.id);
                    const badgeStyle = GROUP_STYLES[group.color] || GROUP_STYLES.indigo;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => openCmsTab(group.primaryTab)}
                        className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all text-left flex flex-col justify-between gap-3 cursor-pointer shadow-2xs hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${badgeStyle}`}>
                            <Icon size={19} />
                          </div>
                          <span className="text-xl font-black text-slate-900 dark:text-white">{metric.value}</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-700 transition">
                              {group.label}
                            </h4>
                            <ArrowRight size={14} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 line-clamp-2">{group.desc}</p>
                          <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 mt-2">{metric.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* LIVE APPROVAL QUEUE: JOBS (ONLY IF PERMITTED) */}
            {allowedSet.has('jobs_applications') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase size={16} className="text-amber-600" /> İlan Onay Kuyruğu ({pendingJobs.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => openCmsTab('ilan')}
                    className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Tüm İlanları Yönet →
                  </button>
                </div>
                {pendingJobs.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-2xl p-4 text-center font-medium">
                    ✓ Onay bekleyen iş veya staj ilanı bulunmuyor.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {pendingJobs.slice(0, 5).map(job => (
                      <div key={job.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{job.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{job.company} • {job.type || 'İlan'}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApproveJob(job.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 size={13} /> Onayla
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectJob(job.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle size={13} /> Reddet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LIVE APPROVAL QUEUE: INTERNSHIPS (ONLY IF PERMITTED) */}
            {allowedSet.has('students_staj') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap size={16} className="text-[#990000]" /> Staj Başvuru Onayları ({pendingInternships.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => openCmsTab('gonullu')}
                    className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Staj Havuzuna Git →
                  </button>
                </div>
                {pendingInternships.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-2xl p-4 text-center font-medium">
                    ✓ Onay bekleyen öğrenci staj talebi bulunmuyor.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {pendingInternships.slice(0, 5).map(item => (
                      <div key={item.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 truncate">{item.student || item.studentName || 'Öğrenci'}</p>
                          <p className="text-[11px] text-slate-500 font-medium">{item.company} • {item.position || 'Stajyer'}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleApproveInternship(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 size={13} /> Onayla
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectInternship(item.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle size={13} /> Reddet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* QUICK CONTENT PUBLISHER (ONLY IF PERMITTED) */}
            {allowedSet.has('content') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Megaphone size={16} className="text-violet-600" /> Hızlı Kurumsal Duyuru Yayınla
                  </h3>
                  <button
                    type="button"
                    onClick={() => openCmsTab('cms_ann')}
                    className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Duyuru Yönetimi →
                  </button>
                </div>
                <form onSubmit={handlePublishQuickAnnouncement} className="space-y-3">
                  <input
                    type="text"
                    value={quickAnnTitle}
                    onChange={(e) => setQuickAnnTitle(e.target.value)}
                    placeholder="Duyuru başlığı (Örn: 2026 Ulusal Staj Programı Başvuru Takvimi)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <textarea
                    rows={3}
                    value={quickAnnBody}
                    onChange={(e) => setQuickAnnBody(e.target.value)}
                    placeholder="Duyuru metnini yazın..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Send size={14} /> Duyuruyu Yayınla
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (4 COLS): SCOPE & QUICK OPERATIONS */}
          <aside className="lg:col-span-4 space-y-5">
            {/* STAFF PROTOCOL & REQUESTS SUMMARY (IF PERMITTED) */}
            {allowedSet.has('companies_protocols') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 size={14} className="text-blue-700" /> Firma & Protokol Durumu
                  </h4>
                  <button
                    type="button"
                    onClick={() => openCmsTab('cms_corporate_partnerships')}
                    className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    İncele
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="text-lg font-black text-blue-900">{pendingProtocols.length}</div>
                    <div className="text-[10px] font-bold text-blue-700">Bekleyen Protokol</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-lg font-black text-slate-900">{careerFairApplications.length}</div>
                    <div className="text-[10px] font-bold text-slate-600">Fuar / Etkinlik Talebi</div>
                  </div>
                </div>
              </div>
            )}

            {/* STAFF INBOX PREVIEW (IF PERMITTED) */}
            {allowedSet.has('messages') && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-sky-600" /> Son Mesajlar ({unreadMessages.length} yeni)
                  </h4>
                  <button
                    type="button"
                    onClick={() => openCmsTab('mesajlar')}
                    className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Aç
                  </button>
                </div>
                {messages.length === 0 ? (
                  <p className="text-xs text-slate-400">Gelen kutusu boş.</p>
                ) : (
                  <div className="space-y-2">
                    {messages.slice(0, 3).map((m, idx) => (
                      <div key={m.id || idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{m.senderName || m.from || 'Kullanıcı'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{m.content || m.subject || ''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ROLE BOUNDARY & SECURITY CARD */}
            <div className="bg-indigo-950 text-white rounded-3xl p-5 border border-indigo-800 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider">
                <ShieldCheck size={16} /> Yetki Kapsamı & Güvenlik (RBAC)
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Bu çalışma alanı yalnızca <strong className="text-white">{effectiveUser?.department || 'Kariyer Geliştirme Merkezi'}</strong> personel operasyonlarına özeldir.
                Öğrenci, Mezun ve Firma portallarına geçiş ile sistem ayarları yalnızca Süper Yönetici yetkisindedir.
              </p>
              <div className="pt-2 border-t border-indigo-800/80 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={openOwnProfile}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span>Kurumsal Personel Profilim</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setView?.('calendar')}
                  className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span>Kurumsal Takvim & Randevular</span>
                  <Calendar size={14} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ─── STAFF-EXCLUSIVE COMPACT INDIGO DOCK ─── */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[360px]">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-2 border-indigo-200 dark:border-indigo-700/60 p-2 rounded-full shadow-[0_15px_40px_rgba(49,46,129,0.22)] flex items-center justify-around px-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 rounded-full bg-indigo-700 text-white shadow-md flex items-center justify-center cursor-pointer"
            title="Personel Çalışma Masası"
          >
            <Home size={20} />
          </button>
          <button
            type="button"
            onClick={() => openCmsTab(allowedGroups[0]?.primaryTab || 'overview')}
            className="w-12 h-10 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-slate-800 text-white shadow-lg flex items-center justify-center hover:scale-105 transition cursor-pointer"
            title="Yetkili CMS Modülleri"
          >
            <LayoutDashboard size={20} />
          </button>
          <button
            type="button"
            onClick={() => setView?.('calendar')}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
            title="Kurumsal Takvim"
          >
            <Calendar size={20} />
          </button>
          <button
            type="button"
            onClick={openOwnProfile}
            className="w-9 h-9 rounded-full bg-white border-2 border-indigo-600 p-0.5 overflow-hidden hover:scale-105 transition cursor-pointer"
            title="Personel Profilim"
          >
            <SafeAvatar src={effectiveUser?.avatar} name={effectiveUser?.name || 'Personel'} size="xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
