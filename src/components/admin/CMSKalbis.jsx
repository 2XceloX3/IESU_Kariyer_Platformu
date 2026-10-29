import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck, FileText, CheckCircle2, AlertCircle, Clock, Search, Plus,
  Layers, Download, Filter, ExternalLink, Calendar, Users, Building2,
  TreePine, Droplets, Cloud, FileCheck, Check, X, RefreshCw, Eye,
  BookOpen, MessageSquare, Bell, Star, AlertTriangle, ArrowRight,
  ChevronRight, ChevronDown, Award, Trash2, Printer, Sparkles, Send,
  HelpCircle, Settings, UserCheck, CheckCircle, Info, ChevronLeft,
  Flame, Zap, Laptop, ArrowUpRight
} from 'lucide-react';
import { toast } from '../shared/Toast';
import Logo from '../Logo';
import SafeAvatar from '../shared/SafeAvatar';
import {
  KALBIS_ENVIRONMENTAL_METRICS,
  KALBIS_ROLES,
  KALBIS_COMMISSIONS,
  KALBIS_DOIF_RECORDS,
  KALBIS_COURSE_FILES,
  KALBIS_DATA_TASKS,
  KALBIS_PROCESS_CARDS,
  KALBIS_NOTIFICATIONS
} from '../../data/mockKalbisData';

export default function CMSKalbis({ currentUser, setView }) {
  // Navigation & Sub-modules
  const [activeMenu, setActiveMenu] = useState('dashboard'); // dashboard, komisyonlar, doif, ders_dosyasi, veri_toplama, beyanlar, fikir, gorev_tanimlari, mentorluk, yardim
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  // Active Role Switcher State
  const [activeRole, setActiveRole] = useState(KALBIS_ROLES[0]);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_kalbis_notifications_v1');
      return saved ? JSON.parse(saved) : KALBIS_NOTIFICATIONS;
    } catch {
      return KALBIS_NOTIFICATIONS;
    }
  });
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [notificationTab, setNotificationTab] = useState('uyarilar'); // 'uyarilar' | 'duyurular'

  // Personal Notes (Not Defteri) State
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_kalbis_notes_v1');
      return saved ? JSON.parse(saved) : [
        {
          id: 'NOTE-1',
          title: 'YÖKAK KİDR Kanıtları Kontrolü',
          content: 'Sivil Havacılık programı mezun izleme anket sonuçları ve sektör danışma kurulu kararları kanıt kataloğuna yüklenecek.',
          targetDate: '2026-11-05',
          alertType: 'Anlık + Mesajlı',
          pinned: true
        },
        {
          id: 'NOTE-2',
          title: 'Ders Dosyası İnceleme Toplantısı',
          content: 'Ara sınav rubrik ve öğrenme çıktısı puan eşleştirmeleri Tutarlılık Komisyonu öncesi gözden geçirilecek.',
          targetDate: '2026-11-12',
          alertType: 'Anlık',
          pinned: false
        }
      ];
    } catch {
      return [];
    }
  });
  const [showNotesMenu, setShowNotesMenu] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newNoteForm, setNewNoteForm] = useState({
    title: '',
    content: '',
    targetDate: '',
    alertType: 'Anlık + Mesajlı (Varsayılan)',
    pinned: false
  });

  // Modals State
  const [showSurecKartModal, setShowSurecKartModal] = useState(false);
  const [selectedProcessCard, setSelectedProcessCard] = useState(KALBIS_PROCESS_CARDS[0]);
  const [showYardimModal, setShowYardimModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocTitle, setPreviewDocTitle] = useState('');
  const [showMessagesDrawer, setShowMessagesDrawer] = useState(false);

  // DÖİF (Düzeltici ve Önleyici Faaliyet) State
  const [doifList, setDoifList] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_kalbis_doif_v1');
      return saved ? JSON.parse(saved) : KALBIS_DOIF_RECORDS;
    } catch {
      return KALBIS_DOIF_RECORDS;
    }
  });
  const [doifFilter, setDoifFilter] = useState('all'); // all, P, U, K, O
  const [showNewDoifModal, setShowNewDoifModal] = useState(false);
  const [newDoifForm, setNewDoifForm] = useState({
    title: '',
    department: 'Sivil Hava Ulaştırma İşletmeciliği',
    responsible: activeRole.name,
    pukoLetter: 'P',
    priority: 'Orta',
    targetDate: '',
    rootCause: '',
    plannedAction: ''
  });

  // Commissions State
  const [commissions, setCommissions] = useState(KALBIS_COMMISSIONS);
  const [commissionTypeFilter, setCommissionTypeFilter] = useState('Tümü');

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('iesu_kalbis_notes_v1', JSON.stringify(notes));
    } catch {}
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem('iesu_kalbis_doif_v1', JSON.stringify(doifList));
    } catch {}
  }, [doifList]);

  useEffect(() => {
    try {
      localStorage.setItem('iesu_kalbis_notifications_v1', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  // Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Tüm bildirimleriniz okundu olarak işaretlendi.');
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteForm.title.trim()) {
      toast.error('Lütfen not başlığını giriniz.');
      return;
    }
    const newNote = {
      id: 'NOTE-' + Date.now(),
      title: newNoteForm.title.trim(),
      content: newNoteForm.content.trim(),
      targetDate: newNoteForm.targetDate || new Date().toISOString().split('T')[0],
      alertType: newNoteForm.alertType,
      pinned: newNoteForm.pinned
    };
    setNotes(prev => [newNote, ...prev]);
    setShowNewNoteModal(false);
    setNewNoteForm({
      title: '',
      content: '',
      targetDate: '',
      alertType: 'Anlık + Mesajlı (Varsayılan)',
      pinned: false
    });
    toast.success('Notunuz kişisel not defterinize kaydedildi.');
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.info('Not silindi.');
  };

  const handleCreateDoif = (e) => {
    e.preventDefault();
    if (!newDoifForm.title.trim()) {
      toast.error('Lütfen DÖİF konusunu belirtiniz.');
      return;
    }
    const pukoLetterMap = { P: 'Planla', U: 'Uygula', K: 'Kontrol Et', Ö: 'Önlem Al' };
    const record = {
      id: `DOIF-2026-${String(doifList.length + 90).padStart(3, '0')}`,
      title: newDoifForm.title.trim(),
      source: 'İç Paydaş Kalite Bildirimi',
      department: newDoifForm.department,
      responsible: newDoifForm.responsible || activeRole.name,
      pukoLetter: newDoifForm.pukoLetter,
      pukoPhase: pukoLetterMap[newDoifForm.pukoLetter] || 'Planla',
      status: 'Açık',
      targetDate: newDoifForm.targetDate || '2026-12-01',
      evidenceCount: 1,
      priority: newDoifForm.priority,
      rootCause: newDoifForm.rootCause.trim() || 'Kök neden analizi devam ediyor.',
      plannedAction: newDoifForm.plannedAction.trim() || 'Faaliyet planı onay aşamasında.'
    };
    setDoifList(prev => [record, ...prev]);
    setShowNewDoifModal(false);
    setNewDoifForm({
      title: '',
      department: 'Sivil Hava Ulaştırma İşletmeciliği',
      responsible: activeRole.name,
      pukoLetter: 'P',
      priority: 'Orta',
      targetDate: '',
      rootCause: '',
      plannedAction: ''
    });
    toast.success(`DÖİF kaydı (${record.id}) başarıyla oluşturuldu ve Kalite Komisyonu havuzuna iletildi.`);
  };

  const handleOpenDocPreview = (title) => {
    setPreviewDocTitle(title);
    setShowPreviewModal(true);
  };

  // Filtered Lists
  const filteredCommissions = useMemo(() => {
    return commissions.filter(c => {
      const matchesType = commissionTypeFilter === 'Tümü' || c.type === commissionTypeFilter;
      const matchesSearch = !globalSearch || c.name.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [commissions, commissionTypeFilter, globalSearch]);

  const filteredDoif = useMemo(() => {
    return doifList.filter(d => {
      const matchesPuko = doifFilter === 'all' || d.pukoLetter === doifFilter;
      const matchesSearch = !globalSearch || d.title.toLowerCase().includes(globalSearch.toLowerCase()) || d.id.toLowerCase().includes(globalSearch.toLowerCase());
      return matchesPuko && matchesSearch;
    });
  }, [doifList, doifFilter, globalSearch]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-[#f4f7fb] text-slate-900 min-h-screen flex flex-col font-sans relative antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. ÜST GEZİNME VE KONTROL ÇUBUĞU (KALBİS HEADER)
         ───────────────────────────────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        {/* Sol Logo ve Başlık */}
        <div className="flex items-center gap-3.5 shrink-0">
          <Logo className="h-9 w-auto text-[#990000]" />
          <div className="border-l border-slate-200 pl-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm tracking-tight">ESENYURT KALBİS</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black tracking-wide uppercase">
                YÖKAK Akredite
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 hidden sm:block">
              Kalite Güvencesi Bilgi Yönetim Sistemi • v2.3.7
            </p>
          </div>
        </div>

        {/* Orta Arama Barı (Ctrl+K) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Süreç kartı, ölçüt, komisyon veya DÖİF ara... (Ctrl+K)"
              className="w-full pl-9 pr-16 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#990000] focus:ring-2 focus:ring-red-100 text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Sağ Araç Butonları & Profil Çipi */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rol Seçici Menüsü */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Kullanıcı Rolü Değiştir"
            >
              <Users className="w-3.5 h-3.5 text-[#990000]" />
              <span className="hidden lg:inline">{activeRole.title}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
                <div className="p-2 border-b border-slate-100 mb-1">
                  <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Aktif Rol Değiştir</span>
                </div>
                {KALBIS_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role);
                      setShowRoleMenu(false);
                      toast.success(`Rol "${role.title}" olarak değiştirildi.`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                      activeRole.id === role.id ? 'bg-red-50 text-[#990000] font-black' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div>{role.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{role.department}</div>
                    </div>
                    {activeRole.id === role.id && <Check className="w-4 h-4 text-[#990000]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mesajlaşma Çekmecesi Butonu */}
          <button
            onClick={() => setShowMessagesDrawer(true)}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer relative"
            title="Komisyon Mesajları"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Not Defteri Butonu */}
          <div className="relative">
            <button
              onClick={() => setShowNotesMenu(!showNotesMenu)}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer relative"
              title="Notlarım & Hatırlatmalar"
            >
              <FileText className="w-4 h-4" />
              {notes.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {notes.length}
                </span>
              )}
            </button>

            {/* Notlarım Açılır Paneli */}
            {showNotesMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span className="font-black text-sm">Notlarım & Hatırlatıcı</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowNotesMenu(false);
                      setShowNewNoteModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Yeni Not
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                  {notes.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">Henüz kayıtlı bir notunuz yok.</div>
                  ) : (
                    notes.map(note => (
                      <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-slate-900">{note.title}</span>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition"
                            title="Notu Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{note.content}</p>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#990000]" /> {note.targetDate}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{note.alertType}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bildirimler Butonu */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer relative"
              title="Bildirimler"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#990000] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Bildirimler Açılır Paneli */}
            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                <div className="bg-gradient-to-r from-red-900 to-slate-900 p-4 text-white flex items-center justify-between">
                  <div className="font-black text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-300" />
                    <span>Bildirimler</span>
                  </div>
                  <button
                    onClick={handleMarkAllNotificationsRead}
                    className="text-[11px] font-bold text-amber-200 hover:underline"
                  >
                    Tümünü Okundu Say
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl border text-xs transition ${n.read ? 'bg-white border-slate-200 text-slate-600' : 'bg-red-50/50 border-red-200 text-slate-900'}`}>
                      <div className="font-bold flex items-center justify-between mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{n.date}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kullanıcı Profili Çipi (Ekran Görüntüsü Uyumu) */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-red-100 text-[#990000] font-black text-xs flex items-center justify-center shrink-0 border border-red-200 shadow-2xs">
              {activeRole.initials}
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-black text-slate-900">{activeRole.name}</span>
              <span className="text-[10px] font-bold text-slate-500 truncate max-w-[150px]">{activeRole.department}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. GÖVDE DÜZENİ: SOL MENÜ (METRONIC / KALBİS) + SAĞ İÇERİK
         ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sol Menü (Sidebar) */}
        <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Menüde Ara Inputu */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Menüde ara"
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Navigasyon Listesi */}
            <nav className="space-y-1">
              {[
                { id: 'dashboard', label: 'Ana Sayfa', icon: <Layers size={16} /> },
                { id: 'komisyonlar', label: 'Komisyon İşlemleri', icon: <Users size={16} />, badge: commissions.length },
                { id: 'doif', label: 'DÖİF Taleplerim', icon: <ShieldCheck size={16} />, badge: doifList.filter(d => d.status !== 'Tamamlandı').length },
                { id: 'ders_dosyasi', label: 'Ders Dosyası İnceleme', icon: <BookOpen size={16} /> },
                { id: 'veri_toplama', label: 'Veri Toplama Görevleri', icon: <FileCheck size={16} /> },
                { id: 'fikir', label: 'Bir Fikrim Var', icon: <Sparkles size={16} /> },
                { id: 'gorev_tanimlari', label: 'Görev Tanımlarım', icon: <Award size={16} /> },
                { id: 'mentorluk', label: 'Mentorluk Eşleşmelerim', icon: <UserCheck size={16} /> },
                { id: 'yardim', label: 'Yardım & Dokümanlar', icon: <HelpCircle size={16} /> }
              ]
                .filter(item => !sidebarSearch || item.label.toLowerCase().includes(sidebarSearch.toLowerCase()))
                .map(item => {
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#990000] text-white shadow-md shadow-red-950/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </nav>
          </div>

          {/* Alt Sürüm & Sağlayıcı Bilgisi */}
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 font-semibold space-y-1">
            <div className="flex items-center justify-between">
              <span>Connexium Yazılım</span>
              <span className="text-slate-400">v2.3.7</span>
            </div>
            <div className="text-[10px] text-slate-600">İESÜ Kalite Güvencesi Portalı</div>
          </div>
        </aside>

        {/* Sağ Ana Çalışma Alanı (Main Workspace) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Toolbar / Breadcrumb Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-bold">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {activeMenu === 'dashboard' && 'KALBİS Kalite Yönetim Sistemi • Ana Sayfa'}
                  {activeMenu === 'komisyonlar' && 'Komisyon İşlemleri & Karar Defteri'}
                  {activeMenu === 'doif' && 'Düzeltici ve Önleyici Faaliyetler (DÖİF) Masası'}
                  {activeMenu === 'ders_dosyasi' && 'Ders Dosyası İnceleme & Ölçme Değerlendirme'}
                  {activeMenu === 'veri_toplama' && 'KİDR & Akreditasyon Veri Toplama Görevleri'}
                  {activeMenu === 'fikir' && 'Bir Fikrim Var • İç Paydaş Kalite İnovasyonu'}
                  {activeMenu === 'gorev_tanimlari' && 'Akademik ve İdari Görev Tanımları'}
                  {activeMenu === 'mentorluk' && 'Araştırma & Akademik Mentorluk Eşleşmeleri'}
                  {activeMenu === 'yardim' && 'KALBİS Yardım ve Eğitim Dokümanları'}
                </h1>
                <p className="text-[11px] font-semibold text-slate-500">
                  İstanbul Esenyurt Üniversitesi • YÖKAK Kurumsal Akreditasyon & PUKÖ İzleme
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSurecKartModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Layers className="w-3.5 h-3.5 text-[#990000]" />
                <span>Süreç Bilgisi</span>
              </button>
              <button
                onClick={() => setShowYardimModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Yardım ve Eğitim</span>
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 1: ANA SAYFA (DASHBOARD)
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* YEŞİL İKLİM VE SÜRDÜRÜLEBİLİRLİK HERO KARTI (BİREBİR KALBİS KOPYASI) */}
              <div
                className="rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden"
                style={{ background: 'linear-gradient(112deg, #0b3d2e 0%, #14624a 45%, #1a9e63 100%)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                      <TreePine size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-0.5">
                        Dijitalleşme Çevresel Etkisi
                      </h2>
                      <p className="text-xs text-white/80 font-medium">
                        Dijital doküman yönetiminin kuruma kazandırdıkları ve yeşil kampüs kazanımları
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold self-start">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>LCA Onaylı Katsayılar</span>
                  </div>
                </div>

                {/* 6'lı Metrik Kartları */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div className="rounded-2xl p-4 text-center bg-white/10 backdrop-blur-md border border-white/15">
                    <FileCheck className="w-6 h-6 text-white/80 mx-auto mb-1.5" />
                    <div className="text-2xl font-black">{KALBIS_ENVIRONMENTAL_METRICS.digitalDocuments}</div>
                    <div className="text-[11px] text-white/75 font-semibold mt-0.5">Dijital Belge</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider">
                      Ölçülen
                    </span>
                  </div>

                  <div className="rounded-2xl p-4 text-center bg-white/10 backdrop-blur-md border border-white/15">
                    <BookOpen className="w-6 h-6 text-white/80 mx-auto mb-1.5" />
                    <div className="text-2xl font-black">{KALBIS_ENVIRONMENTAL_METRICS.digitalPages}</div>
                    <div className="text-[11px] text-white/75 font-semibold mt-0.5">Dijital Sayfa</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider">
                      Ölçülen
                    </span>
                  </div>

                  <div className="rounded-2xl p-4 text-center bg-white/10 backdrop-blur-md border border-white/15">
                    <FileText className="w-6 h-6 text-white/80 mx-auto mb-1.5" />
                    <div className="text-2xl font-black">{KALBIS_ENVIRONMENTAL_METRICS.paperSavedKg}</div>
                    <div className="text-[11px] text-white/75 font-semibold mt-0.5">Kâğıt Tasarrufu</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider">
                      Tahmin
                    </span>
                  </div>

                  <div className="rounded-2xl p-4 text-center bg-white/10 backdrop-blur-md border border-white/15">
                    <Cloud className="w-6 h-6 text-white/80 mx-auto mb-1.5" />
                    <div className="text-2xl font-black">{KALBIS_ENVIRONMENTAL_METRICS.co2ReducedKg}</div>
                    <div className="text-[11px] text-white/75 font-semibold mt-0.5">CO₂e Azaltımı</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider">
                      Tahmin
                    </span>
                  </div>

                  <div className="rounded-2xl p-4 text-center bg-white/10 backdrop-blur-md border border-white/15">
                    <Droplets className="w-6 h-6 text-white/80 mx-auto mb-1.5" />
                    <div className="text-2xl font-black">{KALBIS_ENVIRONMENTAL_METRICS.waterSavedL}</div>
                    <div className="text-[11px] text-white/75 font-semibold mt-0.5">Su Tasarrufu</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider">
                      Tahmin
                    </span>
                  </div>

                  <div className="rounded-2xl p-4 text-center bg-white/10 backdrop-blur-md border border-white/15">
                    <TreePine className="w-6 h-6 text-white/80 mx-auto mb-1.5" />
                    <div className="text-2xl font-black">{KALBIS_ENVIRONMENTAL_METRICS.treeEquivalent}</div>
                    <div className="text-[11px] text-white/75 font-semibold mt-0.5">Ağaç Eşdeğeri</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider">
                      Tahmin
                    </span>
                  </div>
                </div>

                <div className="mt-5 text-[11px] text-white/70 leading-relaxed border-t border-white/10 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>{KALBIS_ENVIRONMENTAL_METRICS.footnote}</span>
                  <span className="font-bold text-white shrink-0">YÖK Yeşil Üniversite Endeksi Uyumlu</span>
                </div>
              </div>

              {/* BİLDİRİMLER KARTI (EKRAN GÖRÜNTÜSÜYLE BİREBİR) */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-bold">
                      <Bell size={18} />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">Sistem Bildirimleri</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} /> Tümünü okundu yap
                    </button>
                    <button
                      onClick={() => setShowNotificationsMenu(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      Tüm bildirimler
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  {notifications.filter(n => !n.read).length === 0 ? (
                    <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 flex items-center gap-3 text-red-700">
                      <Info className="w-5 h-5 shrink-0" />
                      <span className="text-xs font-bold">Okunmamış bildirim bulunamadı.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.filter(n => !n.read).map(n => (
                        <div key={n.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <div className="font-black text-xs text-slate-900">{n.title}</div>
                              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 shrink-0">{n.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PUKÖ DÖNGÜSÜ & HIZLI İZLEME PANOLARI */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { phase: 'Planla (P)', count: doifList.filter(d => d.pukoLetter === 'P').length, desc: 'Hedef, kaynak ve zaman planı', color: 'border-blue-200 bg-blue-50/50 text-blue-800' },
                  { phase: 'Uygula (U)', count: doifList.filter(d => d.pukoLetter === 'U').length, desc: 'Süreç ve kanıt yürütme', color: 'border-amber-200 bg-amber-50/50 text-amber-800' },
                  { phase: 'Kontrol Et (K)', count: doifList.filter(d => d.pukoLetter === 'K').length, desc: 'Komisyon denetim ve analizi', color: 'border-purple-200 bg-purple-50/50 text-purple-800' },
                  { phase: 'Önlem Al (Ö)', count: doifList.filter(d => d.pukoLetter === 'Ö').length, desc: 'Kalıcı iyileştirme ve standart', color: 'border-emerald-200 bg-emerald-50/50 text-emerald-800' }
                ].map(p => (
                  <div
                    key={p.phase}
                    onClick={() => {
                      setDoifFilter(p.phase.charAt(p.phase.indexOf('(') + 1));
                      setActiveMenu('doif');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${p.color}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs">{p.phase}</span>
                      <span className="text-xl font-black">{p.count}</span>
                    </div>
                    <p className="text-[11px] opacity-80">{p.desc}</p>
                  </div>
                ))}
              </div>

              {/* AKTİF SÜREÇ KARTLARI TABLOSU */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">Öncelikli Kalite Süreç Kartları</h3>
                    <p className="text-xs text-slate-500">YÖKAK KAP kapsamında akredite edilmiş temel kurumsal süreçler</p>
                  </div>
                  <button
                    onClick={() => setShowSurecKartModal(true)}
                    className="text-xs font-bold text-[#990000] hover:underline flex items-center gap-1"
                  >
                    Tüm Süreç Kartları <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {KALBIS_PROCESS_CARDS.map(card => (
                    <div
                      key={card.id}
                      onClick={() => {
                        setSelectedProcessCard(card);
                        setShowSurecKartModal(true);
                      }}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#990000] hover:bg-white transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-[#990000] text-[10px] font-black">{card.code}</span>
                        <span className="text-[10px] font-bold text-slate-400">{card.cycleTime}</span>
                      </div>
                      <h4 className="font-black text-xs text-slate-900 group-hover:text-[#990000] transition line-clamp-1">{card.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Sorumlu: {card.owner}</p>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold">
                        <span className="text-emerald-700">{card.puko}</span>
                        <span className="text-[#990000] group-hover:translate-x-1 transition-transform">İncele →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 2: KOMİSYON İŞLEMLERİ
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'komisyonlar' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {['Tümü', 'Rektörlük', 'Akademik Birim', 'Program', 'Tutarlılık', 'İdari Birim', 'UYGAR'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCommissionTypeFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        commissionTypeFilter === cat
                          ? 'bg-[#990000] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommissions.map(comm => (
                  <div key={comm.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{comm.type}</span>
                        <h3 className="font-black text-sm text-slate-900 mt-1">{comm.name}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                        {comm.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{comm.description}</p>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                      <div>
                        <div className="text-xs font-black text-slate-900">{comm.membersCount}</div>
                        <div className="text-[10px] text-slate-400 font-bold">Üye</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{comm.meetingsThisYear}</div>
                        <div className="text-[10px] text-slate-400 font-bold">Toplantı</div>
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#990000]">{comm.pukoPhase}</div>
                        <div className="text-[10px] text-slate-400 font-bold">PUKÖ Fazı</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400 text-[11px]">Son Karar: <strong className="text-slate-700">{comm.lastDecisionDate}</strong></span>
                      <button
                        onClick={() => handleOpenDocPreview(`${comm.name} 2026 Toplantı Kararları ve Tutanakları`)}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#990000] hover:text-white text-slate-700 font-bold text-xs transition cursor-pointer"
                      >
                        Kararları Gör
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 3: DÖİF TALEPLERİM (PUKÖ MASASI)
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'doif' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {['all', 'P', 'U', 'K', 'Ö'].map(f => (
                    <button
                      key={f}
                      onClick={() => setDoifFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        doifFilter === f
                          ? 'bg-[#990000] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {f === 'all' ? "Tüm DÖİF'ler" : `${f} Fazı`}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewDoifModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start"
                >
                  <Plus size={16} /> Yeni DÖİF Talebi Aç
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">DÖİF No & Konu</th>
                        <th className="py-3 px-4">Sorumlu Birim</th>
                        <th className="py-3 px-4">Hedef Tarih</th>
                        <th className="py-3 px-4">PUKÖ Harfi</th>
                        <th className="py-3 px-4">Öncelik</th>
                        <th className="py-3 px-4">Durum</th>
                        <th className="py-3 px-4 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredDoif.map(doif => (
                        <tr key={doif.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-black text-[#990000]">{doif.id}</span>
                            <div className="font-bold text-slate-900 mt-0.5 line-clamp-1">{doif.title}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{doif.department}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-600">{doif.targetDate}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs">
                              {doif.pukoLetter}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              doif.priority === 'Kritik' ? 'bg-red-100 text-red-800' :
                              doif.priority === 'Yüksek' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {doif.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              doif.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-800' :
                              doif.status === 'Uygulamada' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {doif.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenDocPreview(`${doif.id} DÖİF Dosyası ve Kök Neden Analizi`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#990000] hover:text-white transition font-bold text-[11px]"
                            >
                              Dosya
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 4: DERS DOSYASI İNCELEME
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'ders_dosyasi' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base">Ders Dosyası İnceleme Listesi</h3>
                    <p className="text-xs text-slate-500">Program Değerlendirme Komisyonu onay durumları</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    2026 Güz Dönemi
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Ders Kodu & Adı</th>
                        <th className="py-3 px-4">Öğretim Elemanı</th>
                        <th className="py-3 px-4">Ders İzlencesi</th>
                        <th className="py-3 px-4">Sınav Anahtarı</th>
                        <th className="py-3 px-4">Öğrenci Örnekleri</th>
                        <th className="py-3 px-4">Kalite Skoru</th>
                        <th className="py-3 px-4 text-right">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {KALBIS_COURSE_FILES.map(course => (
                        <tr key={course.code} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-900">{course.code}</span>
                            <div className="text-[11px] text-slate-500 font-semibold">{course.name}</div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{course.instructor}</td>
                          <td className="py-3.5 px-4">
                            {course.syllabusReady ? (
                              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                                <Check size={14} /> Yüklendi
                              </span>
                            ) : (
                              <span className="text-red-500 font-bold">Eksik</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {course.examKeyUploaded ? (
                              <span className="text-emerald-600 flex items-center gap-1 font-bold">
                                <Check size={14} /> Onaylı
                              </span>
                            ) : (
                              <span className="text-amber-500 font-bold">Beklemede</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{course.samplePapersCount} Dosya</td>
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-900 text-sm">%{course.score}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleOpenDocPreview(`${course.code} - ${course.name} Ders Dosyası ve Rubrik İncelemesi`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#990000] hover:text-white transition font-bold text-[11px]"
                            >
                              İncele
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 5: VERİ TOPLAMA & KİDR GÖREVLERİ
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'veri_toplama' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {KALBIS_DATA_TASKS.map(task => (
                  <div key={task.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>{task.category}</span>
                      <span className="text-[#990000]">{task.pukoCode}</span>
                    </div>
                    <h4 className="font-black text-xs text-slate-900 leading-snug">{task.title}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Tamamlanma</span>
                        <span className="text-slate-900">%{task.progress}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-[#990000] rounded-full" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Bitiş: {task.deadline}</span>
                      <button
                        onClick={() => handleOpenDocPreview(`${task.title} Kanıt Dokümanları`)}
                        className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        Kanıt Ekle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 6: BİR FİKRİM VAR (İÇ PAYDAŞ İNOVASYONU)
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'fikir' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Bir Fikrim Var • Süreç İyileştirme Önerisi</h3>
                  <p className="text-xs text-slate-500">Üniversitemizin eğitim ve operasyonel kalitesini artıracak önerinizi Rektörlük Kalite Komisyonuna iletin.</p>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); toast.success('Öneriniz Kalite Güvencesi Komisyonuna iletildi.'); setActiveMenu('dashboard'); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Öneri Başlığı *</label>
                  <input required type="text" placeholder="Örn: Kampüs içi staj mülakat odalarının rezervasyon sistemine bağlanması" className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#990000]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İlgili Alan / Süreç *</label>
                  <select className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#990000]">
                    <option>Eğitim-Öğretim ve Müfredat</option>
                    <option>Staj ve Kariyer Hizmetleri</option>
                    <option>Ar-Ge ve Laboratuvar Altyapısı</option>
                    <option>Dijitalleşme ve Çevre (Yeşil Kampüs)</option>
                    <option>Öğrenci Yaşamı ve Kulüpler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detaylı Açıklama & Beklenen Fayda *</label>
                  <textarea rows={4} required placeholder="Mevcut durumdaki aksaklık ve önerinizin sağlayacağı ölçülebilir faydayı açıklayınız..." className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#990000] resize-none" />
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white font-bold text-xs transition shadow-md flex items-center gap-2">
                    <Send size={14} /> Öneriyi İlet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 7: GÖREV TANIMLARI
             ───────────────────────────────────────────────────────────── */}
          {activeMenu === 'gorev_tanimlari' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <h3 className="font-black text-base text-slate-900">Kurumsal Görev ve Yetki Dağılım Matrisi</h3>
              <p className="text-xs text-slate-500">YÖKAK Akreditasyon Standartları Doğrultusunda Resmi Yetki ve Sorumluluklar</p>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Program Değerlendirme Komisyonu Üyeliği', scope: 'Sivil Hava Ulaştırma İşletmeciliği ders planları, öğrenme çıktısı matrisleri ve yıllık özdeğerlendirme raporu hazırlığı.' },
                  { title: 'Ders Dosyası İnceleme Sorumluluğu', scope: 'Her yarıyıl sonunda program derslerinin syllabus, vize/final rubrikleri ve kanıt dosyalarının KALBİS üzerinden onaylanması.' },
                  { title: 'Staj ve Sektör İşbirlikleri Komisyon Koordinasyonu', scope: 'Öğrenci staj yerleştirme oranları, 5510 SGK tescil teyitleri ve sektör danışma kurulu toplantılarının yürütülmesi.' }
                ].map((gt, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="font-black text-xs text-slate-900 mb-1">{gt.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{gt.scope}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              GÖRÜNÜM 8: YARDIM & DOKÜMANLAR
             ───────────────────────────────────────────────────────────── */}
          {(activeMenu === 'yardim' || activeMenu === 'mentorluk') && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
              <h3 className="font-black text-base text-slate-900">Yardım Videoları ve Akreditasyon Kılavuzları</h3>
              <p className="text-xs text-slate-500">KALBİS Kalite Güvencesi Sistemini etkin kullanmak için rehber dokümanlar</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'KİDR Birim Kanıtı Yükleme Kılavuzu', format: 'PDF', size: '1.8 MB' },
                  { title: 'DÖİF Açma ve PUKÖ Çevrimi Eğitimi', format: 'Video', size: '12 dk' },
                  { title: 'Ders Dosyası ve Rubrik Oluşturma Rehberi', format: 'PDF', size: '2.4 MB' },
                  { title: 'LCA Sürdürülebilirlik Metrikleri Açıklaması', format: 'PDF', size: '950 KB' }
                ].map((doc, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100 transition cursor-pointer" onClick={() => handleOpenDocPreview(doc.title)}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#990000]" />
                      <div>
                        <div className="font-black text-xs text-slate-900">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{doc.format} • {doc.size}</div>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ALT BİLGİ (FOOTER - BİREBİR HTML UYUMU)
         ───────────────────────────────────────────────────────────── */}
      <footer className="h-12 bg-white border-t border-slate-200/80 px-4 sm:px-8 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>2026 ©</span>
          <span className="font-bold text-slate-700">Connexium Yazılım</span>
          <span className="text-slate-400 hidden sm:inline">• İstanbul Esenyurt Üniversitesi</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <span>v2.3.7</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-emerald-700 font-bold">LCA & PUKÖ Aktif</span>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          4. MODALLAR (SÜREÇ KARTI, YARDIM, DOSYA ÖNİZLEME, YENİ DÖİF, NOT)
         ───────────────────────────────────────────────────────────── */}
      {/* SÜREÇ KARTI BİLGİSİ MODALI (SurecKartBilgiModal) */}
      {showSurecKartModal && selectedProcessCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-sm">{selectedProcessCard.code} • Süreç Bilgisi</h3>
                  <p className="text-[11px] text-slate-300">{selectedProcessCard.title}</p>
                </div>
              </div>
              <button onClick={() => setShowSurecKartModal(false)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Süreç Sahibi</span>
                  <div className="font-black text-slate-900 mt-0.5">{selectedProcessCard.owner}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Döngü Süresi</span>
                  <div className="font-black text-slate-900 mt-0.5">{selectedProcessCard.cycleTime}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">PUKÖ Kapsamı</span>
                  <div className="font-black text-emerald-700 mt-0.5">{selectedProcessCard.puko}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Risk Seviyesi</span>
                  <div className="font-black text-red-600 mt-0.5">{selectedProcessCard.riskLevel}</div>
                </div>
              </div>

              <div>
                <span className="font-black text-slate-900 block mb-1.5">Süreç Girdileri:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {selectedProcessCard.inputs.map((inp, idx) => <li key={idx}>{inp}</li>)}
                </ul>
              </div>

              <div>
                <span className="font-black text-slate-900 block mb-1.5">Süreç Çıktıları:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {selectedProcessCard.outputs.map((out, idx) => <li key={idx}>{out}</li>)}
                </ul>
              </div>

              {/* Diyagram Akış Şeması */}
              <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800">
                <span className="font-mono text-[10px] font-black text-emerald-400 uppercase tracking-wider block mb-2">
                  PUKÖ Akış Şeması & Kontrol Noktaları:
                </span>
                <div className="flex items-center justify-between text-center gap-1 font-mono text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex-1">[1. Planla]</div>
                  <span>→</span>
                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex-1">[2. Uygula]</div>
                  <span>→</span>
                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex-1">[3. Kontrol]</div>
                  <span>→</span>
                  <div className="p-2 rounded bg-slate-900 border border-slate-700 flex-1">[4. Önlem Al]</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowSurecKartModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YARDIM VE EĞİTİM MODALI (YardimIcerikModal) */}
      {showYardimModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-950 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-red-400" />
                <h3 className="font-black text-sm">KALBİS Yardım ve Eğitim Dokümanları</h3>
              </div>
              <button onClick={() => setShowYardimModal(false)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-xs text-slate-700">
              <p className="leading-relaxed">
                KALBİS Kalite Güvencesi Bilgi Yönetim Sistemi, YÖKAK Kurumsal Akreditasyon Programı standartlarıyla uyumlu olarak çalışmaktadır.
              </p>
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900 font-medium">
                Ölçüt kanıtları eklerken dosya adı ve uzantısına dikkat ediniz (Maksimum 50 MB, PDF/DOCX formatında olmalıdır).
              </div>
              <div className="space-y-1.5 pt-2">
                <a href="#yardim-video" onClick={(e) => { e.preventDefault(); toast.info('Eğitim videosu başlatılıyor...'); }} className="block p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold flex items-center justify-between text-slate-800">
                  <span>🎥 KALBİS Genel Kullanım Eğitimi (15 dk)</span>
                  <ArrowUpRight size={14} className="text-[#990000]" />
                </a>
                <a href="#kidr-rehber" onClick={(e) => { e.preventDefault(); toast.info('KİDR rehberi indiriliyor...'); }} className="block p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold flex items-center justify-between text-slate-800">
                  <span>📄 KİDR Kanıt Yükleme ve Değerlendirme Kılavuzu (PDF)</span>
                  <ArrowUpRight size={14} className="text-[#990000]" />
                </a>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setShowYardimModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* DOSYA ÖNİZLEME MODALI (PreviewDosyaModal) */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-black text-xs truncate max-w-md">{previewDocTitle}</span>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-white hover:text-red-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-[#990000] flex items-center justify-center border border-slate-200 shadow-inner">
                <FileText size={32} />
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">{previewDocTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Bu belge İESÜ KALBİS Kalite Güvencesi e-İmza ve doğrulama motoru tarafından güvenle indekslenmiştir.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left w-full max-w-md text-xs space-y-1 font-mono text-slate-600">
                <div>Doğrulama Kodu: <strong className="text-slate-900">IESU-KAL-2026-X88</strong></div>
                <div>Zaman Damgası: <strong className="text-slate-900">{new Date().toLocaleString('tr-TR')}</strong></div>
                <div>Güvenlik Durumu: <strong className="text-emerald-700">Virüs Taraması Temiz (Pass)</strong></div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success('Belge bilgisayarınıza indirildi.')}
                  className="px-4 py-2 rounded-xl bg-[#990000] hover:bg-red-800 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Download size={14} /> Belgeyi İndir (PDF)
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YENİ DÖİF MODALI */}
      {showNewDoifModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-900 to-slate-900 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm">Yeni DÖİF Talebi Oluştur</h3>
              </div>
              <button onClick={() => setShowNewDoifModal(false)} className="text-white hover:text-red-300">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDoif} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">DÖİF Konusu & Tanımı *</label>
                <input
                  required
                  type="text"
                  value={newDoifForm.title}
                  onChange={(e) => setNewDoifForm({ ...newDoifForm, title: e.target.value })}
                  placeholder="Örn: Ders izlencelerinde ölçme araçlarının Bologna uyumu"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PUKÖ Harfi *</label>
                  <select
                    value={newDoifForm.pukoLetter}
                    onChange={(e) => setNewDoifForm({ ...newDoifForm, pukoLetter: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] text-xs font-semibold"
                  >
                    <option value="P">P - Planla</option>
                    <option value="U">U - Uygula</option>
                    <option value="K">K - Kontrol Et</option>
                    <option value="Ö">Ö - Önlem Al</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Öncelik Derecesi *</label>
                  <select
                    value={newDoifForm.priority}
                    onChange={(e) => setNewDoifForm({ ...newDoifForm, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] text-xs font-semibold"
                  >
                    <option>Düşük</option>
                    <option>Orta</option>
                    <option>Yüksek</option>
                    <option>Kritik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hedef Tamamlanma Tarihi *</label>
                <input
                  type="date"
                  required
                  value={newDoifForm.targetDate}
                  onChange={(e) => setNewDoifForm({ ...newDoifForm, targetDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kök Neden Açıklaması</label>
                <textarea
                  rows={2}
                  value={newDoifForm.rootCause}
                  onChange={(e) => setNewDoifForm({ ...newDoifForm, rootCause: e.target.value })}
                  placeholder="Uygunsuzluğun kök nedeni nedir?"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] text-xs font-semibold resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Planlanan İyileştirme Faaliyeti</label>
                <textarea
                  rows={2}
                  value={newDoifForm.plannedAction}
                  onChange={(e) => setNewDoifForm({ ...newDoifForm, plannedAction: e.target.value })}
                  placeholder="Hangi düzeltici/önleyici adım atılacaktır?"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#990000] text-xs font-semibold resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewDoifModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#990000] hover:bg-red-800 text-white font-bold"
                >
                  DÖİF Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YENİ NOT EKLEME MODALI (Not Defteri) */}
      {showNewNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex items-center justify-between">
              <span className="font-black text-sm">Yeni Not Oluştur</span>
              <button onClick={() => setShowNewNoteModal(false)} className="text-white hover:text-red-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddNote} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Not Başlığı *</label>
                <input
                  required
                  type="text"
                  value={newNoteForm.title}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, title: e.target.value })}
                  placeholder="Örn: Komisyon toplantı hazırlığı"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#990000]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Not Metni</label>
                <textarea
                  rows={3}
                  value={newNoteForm.content}
                  onChange={(e) => setNewNoteForm({ ...newNoteForm, content: e.target.value })}
                  placeholder="Çalışma notlarınızı buraya yazın..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#990000] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hedef Tarih</label>
                  <input
                    type="date"
                    value={newNoteForm.targetDate}
                    onChange={(e) => setNewNoteForm({ ...newNoteForm, targetDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Uyarı Tipi</label>
                  <select
                    value={newNoteForm.alertType}
                    onChange={(e) => setNewNoteForm({ ...newNoteForm, alertType: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option>Anlık + Mesajlı (Varsayılan)</option>
                    <option>Anlık</option>
                    <option>Sessiz</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewNoteModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">Vazgeç</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#990000] text-white font-bold">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MESAJLAŞMA ÇEKMECESİ (SignalR Simülasyonu) */}
      {showMessagesDrawer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm">KALBİS Komisyon Mesajlaşması</h3>
                <p className="text-[10px] text-slate-400">Komisyon üyeleriyle anlık ve grup yazışmaları</p>
              </div>
              <button onClick={() => setShowMessagesDrawer(false)} className="text-white hover:text-red-400">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700">
                <div className="font-bold text-slate-900 mb-1">Rektörlük Kalite Komisyonu Grubu</div>
                <p className="text-[11px]">2026 KİDR taslağı sistem kanıt havuzuna eklenmiştir. Lütfen inceleyiniz.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Dün, 16:45</span>
              </div>
              <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200 text-slate-800">
                <div className="font-bold text-[#990000] mb-1">Doç. Dr. Kalite Koordinatörü</div>
                <p className="text-[11px]">Sivil Havacılık programı simülatör DÖİF planı onaylandı.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">Bugün, 11:10</span>
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 flex gap-2">
              <input type="text" placeholder="Mesaj yazın... (Enter gönderir)" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#990000]" />
              <button onClick={() => toast.success('Mesajınız komisyon üyelerine iletildi.')} className="px-4 py-2 rounded-xl bg-[#990000] text-white text-xs font-bold">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
