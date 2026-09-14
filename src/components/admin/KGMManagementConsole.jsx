import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Crown, Scale, Building2, GraduationCap, MessageSquare, Search, Filter, 
  CheckCircle2, XCircle, AlertCircle, Clock, Calendar, MapPin, User, 
  ChevronRight, ArrowLeft, RefreshCw, Download, FileText, ExternalLink, 
  ShieldCheck, Sparkles, Check, Send, Eye, ShieldAlert, Award, LayoutDashboard,
  ChevronDown, MessageCircle, Briefcase, Printer, Home
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const INITIAL_DEMO_POOL = [
  {
    id: 'req_corp_1',
    branch: 'company',
    branchLabel: 'Kurumsal Firma',
    sourceType: '🏢 Firma',
    senderName: 'Aselsan Savunma & Teknoloji',
    senderRole: 'İnsan Kaynakları Direktörlüğü',
    senderEmail: 'ik@aselsan.com.tr',
    title: 'Mühendislik Fakültesi Ortak Staj & Protokol Talebi',
    subject: 'Mühendislik Fakültesi Ortak Staj & Protokol Talebi',
    category: 'Kurumsal İş Birliği & Kontenjan',
    priority: 'Yüksek',
    status: 'Beklemede',
    date: 'Bugün 11:30',
    description: '2026-2027 Akademik yılı için Bilgisayar ve Yazılım Mühendisliği 3. ve 4. sınıf öğrencilerine yönelik 25 kişilik uzun dönem aday mühendislik ve Ar-Ge staj kontenjanı tahsis etmek istiyoruz. Resmî protokol taslağı hazırlanmış olup onayınıza sunulmuştur.',
    details: {
      quota: '25 Öğrenci',
      department: 'Bilgisayar & Yazılım Mühendisliği',
      duration: '1 Dönem (Uzun Dönem Staj)',
      location: 'Ankara / ODTÜ Teknokent Yerleşkesi'
    }
  },
  {
    id: 'req_acad_1',
    branch: 'academic',
    branchLabel: 'Akademik Kadro',
    sourceType: '🏛️ Akademi',
    senderName: 'Prof. Dr. Ahmet Yılmaz',
    senderRole: 'Mühendislik ve Mimarlık Fakültesi Dekanı',
    senderEmail: 'ayilmaz@esenyurt.edu.tr',
    title: '2026 Güz Dönemi Zorunlu Staj Komisyonu Onay Listesi',
    subject: '2026 Güz Dönemi Zorunlu Staj Komisyonu Onay Listesi',
    category: 'Staj Komisyonu & Akreditasyon',
    priority: 'Acil',
    status: 'Beklemede',
    date: 'Bugün 09:15',
    description: 'Fakültemiz bünyesinde stajını tamamlayan 142 mühendislik öğrencisinin SGK bildirimleri ve staj defteri değerlendirme raporları komisyonumuzca incelenmiştir. KGM merkezi sistemine nihai onay ve intibak işlemleri için iletilmiştir.',
    details: {
      faculty: 'Mühendislik ve Mimarlık Fakültesi',
      studentCount: '142 Öğrenci',
      commissionHead: 'Prof. Dr. Ahmet Yılmaz',
      academicYear: '2025-2026 Yaz / 2026 Güz'
    }
  },
  {
    id: 'req_counsel_1',
    branch: 'counseling',
    branchLabel: 'Öğrenci & Mezun',
    sourceType: '🎓 Öğrenci',
    senderName: 'Alperen Yılmaz',
    senderRole: 'Yazılım Mühendisliği • 4. Sınıf',
    senderEmail: 'alperen@ogr.esenyurt.edu.tr',
    title: 'Kariyer Danışmanlığı & Yurtdışı Tez Çalışması Randevusu',
    subject: 'Bitirme Projesi & Staj Denkleştirme',
    category: 'Bire Bir Kariyer Danışmanlığı',
    priority: 'Yüksek',
    status: 'Beklemede',
    date: 'Dün 14:20',
    description: 'Yaz stajım kapsamında geliştirdiğim yapay zeka modelini bitirme tezi konusu olarak kullanmak istiyorum. Üniversite Kariyer Koordinatörlüğü ve akademisyen onaylı denkleştirme görüşmesi talep ediyorum.',
    details: {
      preferredDate: '2026-08-15',
      preferredTimeSlot: '14:00 - 14:30',
      mode: 'Yüz Yüze (B Blok 304)',
      advisor: 'Prof. Dr. Ahmet Yılmaz'
    }
  },
  {
    id: 'req_corp_2',
    branch: 'company',
    branchLabel: 'Kurumsal Firma',
    sourceType: '🏢 Firma',
    senderName: 'Trendyol Tech Labs',
    senderRole: 'Üniversite İlişkileri Lideri',
    senderEmail: 'campus@trendyol.com',
    title: 'Güz Dönemi Hackathon & Kampüs Mülakat Günleri',
    subject: 'Güz Dönemi Hackathon & Kampüs Mülakat Günleri',
    category: 'Kariyer Etkinliği & Yarışma',
    priority: 'Normal',
    status: 'İnceleniyor',
    date: '2 gün önce',
    description: 'İESÜ öğrencilerine yönelik 48 saatlik e-ticaret algoritmaları hackathonu düzenlemek ve dereceye giren ilk 3 takıma doğrudan junior pozisyon teklifinde bulunmak istiyoruz. Kampüs fuaye alanı ve konferans salonu tahsis onayı talep ediyoruz.',
    details: {
      eventDate: '15-16 Ekim 2026',
      targetAudience: 'Tüm Mühendislik & Tasarım Öğrencileri',
      expectedParticipants: '200+ Öğrenci'
    }
  },
  {
    id: 'req_acad_2',
    branch: 'academic',
    branchLabel: 'Akademik Kadro',
    sourceType: '🏛️ Akademi',
    senderName: 'Doç. Dr. Seda Demir',
    senderRole: 'Sağlık Bilimleri Fakültesi Staj Koordinatörü',
    senderEmail: 'sdemir@esenyurt.edu.tr',
    title: 'Hastane ve Sağlık Kurumları Klinik Staj Kontenjanı',
    subject: 'Hastane ve Sağlık Kurumları Klinik Staj Kontenjanı',
    category: 'Klinik Protokol',
    priority: 'Normal',
    status: 'Onaylandı',
    date: '3 gün önce',
    description: 'Bölge araştırma hastaneleri ile imzalanan 60 kişilik klinik uygulama staj kontenjanı protokolü sisteme işlenmiş ve onaylanmıştır.',
    details: {
      faculty: 'Sağlık Bilimleri Fakültesi',
      quota: '60 Öğrenci',
      status: 'Yürürlükte'
    }
  }
];

export default function KGMManagementConsole({ setView, currentUser, academicRole, setSelectedUserId }) {
  // State from stores
  const adminMessages = useAppStore(state => state.adminMessages);
  const setAdminMessages = useAppStore(state => state.setAdminMessages);

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState('all'); // 'all' | 'company' | 'academic' | 'counseling' | 'candidate_chat'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Beklemede' | 'İnceleniyor' | 'Onaylandı' | 'Reddedildi'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'Acil' | 'Yüksek' | 'Normal'
  
  // Active Selected Item for Deep-Dive Inspection & Decision
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [decisionNote, setDecisionNote] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Helper toast
  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    if (window.toast) {
      if (type === 'success') window.toast.success(msg);
      else if (type === 'error') window.toast.error(msg);
      else window.toast.info(msg);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Synchronize Counseling Requests from localStorage
  const [counselingRequests, setCounselingRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mentorship_requests_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Synchronize ATS Candidate Chats from localStorage
  const [candidateChats, setCandidateChats] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_company_candidate_chats_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const refreshExternalData = useCallback(() => {
    try {
      const saved = localStorage.getItem('iesu_mentorship_requests_v1');
      if (saved) setCounselingRequests(JSON.parse(saved));
      const savedChats = localStorage.getItem('iesu_company_candidate_chats_v1');
      if (savedChats) setCandidateChats(JSON.parse(savedChats));
    } catch (e) {}
  }, []);

  useEffect(() => {
    window.addEventListener('iesu_counseling_updated', refreshExternalData);
    window.addEventListener('storage', refreshExternalData);
    return () => {
      window.removeEventListener('iesu_counseling_updated', refreshExternalData);
      window.removeEventListener('storage', refreshExternalData);
    };
  }, [refreshExternalData]);

  // Unified Evaluation Pool Construction
  const unifiedPool = useMemo(() => {
    const list = [...INITIAL_DEMO_POOL];

    // Merge in adminMessages (Company and Academic messages sent to KGM)
    (adminMessages || []).forEach(msg => {
      const isAcad = msg.senderType === 'academic' || msg.type === 'academic';
      const existing = list.find(item => item.id === msg.id);
      if (!existing) {
        list.push({
          id: msg.id || `admin_msg_${Math.random()}`,
          branch: isAcad ? 'academic' : 'company',
          branchLabel: isAcad ? 'Akademik Kadro' : 'Kurumsal Firma',
          sourceType: isAcad ? '🏛️ Akademi' : '🏢 Firma',
          senderName: msg.senderName || (isAcad ? 'Öğretim Görevlisi' : 'Kurumsal Şirket'),
          senderRole: isAcad ? (msg.department || 'Fakülte Danışmanı') : 'İnsan Kaynakları',
          senderEmail: msg.senderEmail || (isAcad ? 'akademik@esenyurt.edu.tr' : 'ik@sirket.com'),
          title: msg.subject || 'Resmî Başvuru & Koordinasyon Talebi',
          subject: msg.subject || 'Resmî Başvuru',
          category: isAcad ? 'Akademik Protokol' : 'Firma İş Birliği',
          priority: msg.priority || 'Normal',
          status: msg.status || 'Beklemede',
          date: msg.date || 'Bugün',
          description: msg.message || '',
          reply: msg.reply || '',
          decisionDate: msg.decisionDate,
          decisionAdmin: msg.decisionAdmin,
          details: {
            department: msg.department,
            senderType: msg.senderType
          }
        });
      }
    });

    // Merge in counseling requests (Student to Academic/Advisor)
    counselingRequests.forEach(req => {
      const existing = list.find(item => item.id === req.id);
      if (!existing) {
        list.push({
          id: req.id,
          branch: 'counseling',
          branchLabel: 'Öğrenci Danışmanlığı',
          sourceType: '🎓 Öğrenci',
          senderName: req.studentName || 'Öğrenci',
          senderRole: `${req.studentDept || 'Bölüm Belirtilmemiş'} • ${req.studentId || ''}`,
          senderEmail: req.studentEmail || 'ogrenci@ogr.esenyurt.edu.tr',
          title: req.topic || req.subject || 'Danışmanlık ve Randevu Talebi',
          subject: req.topic || req.subject || 'Randevu',
          category: 'Öğrenci Danışmanlık & Mülakat',
          priority: req.urgency || 'Normal',
          status: req.status || 'Beklemede',
          date: req.date || req.preferredDate || 'Bugün',
          description: req.note || 'Öğrenci randevu talebinde bulundu.',
          reply: req.replies?.[req.replies.length - 1]?.text || '',
          studentId: req.studentId,
          details: {
            preferredDate: req.preferredDate,
            preferredTimeSlot: req.preferredTimeSlot,
            mode: req.mode || req.platform,
            advisor: req.advisor || req.mentorName
          }
        });
      }
    });

    // Merge in ATS Candidate Chats (Company to Student interview traffic)
    candidateChats.forEach(chat => {
      const existing = list.find(item => item.id === chat.id);
      if (!existing) {
        const lastMsg = chat.messages?.[chat.messages.length - 1];
        list.push({
          id: chat.id,
          branch: 'candidate_chat',
          branchLabel: 'ATS Mülakat Trafiği',
          sourceType: '💬 ATS',
          senderName: `${chat.companyName} ↔ ${chat.candidateName}`,
          senderRole: `${chat.candidateRole} Pozisyonu • ${chat.candidateDept}`,
          senderEmail: 'ats-koordinasyon@esenyurt.edu.tr',
          title: `${chat.companyName} — ${chat.candidateName} Canlı Görüşmesi`,
          subject: `${chat.candidateRole} Aday Mülakatı`,
          category: 'İşveren - Aday Yazışması',
          priority: chat.status === 'Mülakat' ? 'Yüksek' : 'Normal',
          status: chat.status === 'Teklif Aşaması' ? 'Onaylandı' : (chat.status === 'Mülakat' ? 'İnceleniyor' : 'Beklemede'),
          date: chat.lastActive || 'Bugün',
          description: lastMsg ? `Son Mesaj (${lastMsg.senderName || 'İletişim'}): "${lastMsg.text}"` : 'Canlı aday mülakat akışı aktiftir.',
          candidateId: chat.candidateId,
          details: {
            candidateName: chat.candidateName,
            companyName: chat.companyName,
            status: chat.status,
            messageCount: chat.messages?.length || 0
          }
        });
      }
    });

    return list;
  }, [adminMessages, counselingRequests, candidateChats]);

  // Filtered List
  const filteredItems = useMemo(() => {
    return unifiedPool.filter(item => {
      // Branch filter
      if (selectedBranch !== 'all' && item.branch !== selectedBranch) return false;
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      // Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchSender = item.senderName?.toLowerCase().includes(q);
        const matchRole = item.senderRole?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchSubj = item.subject?.toLowerCase().includes(q);
        if (!matchTitle && !matchSender && !matchRole && !matchDesc && !matchSubj) return false;
      }
      return true;
    });
  }, [unifiedPool, selectedBranch, statusFilter, priorityFilter, searchQuery]);

  // Auto-select first item if none selected
  const activeItem = useMemo(() => {
    if (!selectedItemId && filteredItems.length > 0) {
      return filteredItems[0];
    }
    return unifiedPool.find(item => item.id === selectedItemId) || filteredItems[0] || null;
  }, [selectedItemId, filteredItems, unifiedPool]);

  // Live KPI Metrics
  const metrics = useMemo(() => {
    const total = unifiedPool.length;
    const pending = unifiedPool.filter(i => i.status === 'Beklemede').length;
    const reviewing = unifiedPool.filter(i => i.status === 'İnceleniyor').length;
    const approved = unifiedPool.filter(i => i.status === 'Onaylandı').length;
    const rejected = unifiedPool.filter(i => i.status === 'Reddedildi').length;
    const companyCount = unifiedPool.filter(i => i.branch === 'company').length;
    const academicCount = unifiedPool.filter(i => i.branch === 'academic').length;
    const counselingCount = unifiedPool.filter(i => i.branch === 'counseling').length;
    const atsCount = unifiedPool.filter(i => i.branch === 'candidate_chat').length;

    return { total, pending, reviewing, approved, rejected, companyCount, academicCount, counselingCount, atsCount };
  }, [unifiedPool]);

  // Decision Execution Handler
  const handleExecuteDecision = (targetStatus) => {
    if (!activeItem) return;

    const note = decisionNote.trim() || (
      targetStatus === 'Onaylandı' ? 'KGM Yönetimi tarafından incelenmiş, resmi protokol uygun görülerek onaylanmıştır.' :
      targetStatus === 'İnceleniyor' ? 'Talep ilgili fakülte ve komisyon değerlendirmesine alınmıştır.' :
      'Mevcut mevzuat ve kontenjan sınırları gereği talep onaylanamamıştır.'
    );

    const nowStr = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    // 1. Update in adminMessages (Zustand)
    if (activeItem.branch === 'company' || activeItem.branch === 'academic') {
      if (setAdminMessages) {
        setAdminMessages(prev => {
          const arr = prev || [];
          const exists = arr.some(m => m.id === activeItem.id);
          if (exists) {
            return arr.map(m => m.id === activeItem.id ? { 
              ...m, 
              status: targetStatus, 
              reply: note, 
              decisionDate: nowStr,
              decisionAdmin: currentUser?.name || 'KGM Süper Admin' 
            } : m);
          } else {
            return [
              ...arr,
              {
                id: activeItem.id,
                status: targetStatus,
                reply: note,
                decisionDate: nowStr,
                decisionAdmin: currentUser?.name || 'KGM Süper Admin',
                subject: activeItem.title,
                senderName: activeItem.senderName,
                senderType: activeItem.branch === 'academic' ? 'academic' : 'company'
              }
            ];
          }
        });
      }
    }

    // 2. Update in Counseling Requests (localStorage)
    if (activeItem.branch === 'counseling') {
      try {
        const saved = localStorage.getItem('iesu_mentorship_requests_v1');
        let arr = saved ? JSON.parse(saved) : [];
        arr = arr.map(r => r.id === activeItem.id ? {
          ...r,
          status: targetStatus,
          replies: [
            ...(r.replies || []),
            {
              sender: 'academic',
              senderName: `KGM Yönetici Kararı (${currentUser?.name || 'Süper Admin'})`,
              text: note,
              date: nowStr
            }
          ]
        } : r);
        localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify(arr));
        setCounselingRequests(arr);
        window.dispatchEvent(new CustomEvent('iesu_counseling_updated'));
      } catch (e) {}
    }

    // 3. Update in Candidate Chats (localStorage)
    if (activeItem.branch === 'candidate_chat') {
      try {
        const saved = localStorage.getItem('iesu_company_candidate_chats_v1');
        let arr = saved ? JSON.parse(saved) : [];
        arr = arr.map(c => c.id === activeItem.id ? {
          ...c,
          status: targetStatus === 'Onaylandı' ? 'Teklif Aşaması' : (targetStatus === 'İnceleniyor' ? 'Mülakat' : 'Reddedildi')
        } : c);
        localStorage.setItem('iesu_company_candidate_chats_v1', JSON.stringify(arr));
        setCandidateChats(arr);
      } catch (e) {}
    }

    // Update activeItem local state reflection
    activeItem.status = targetStatus;
    activeItem.reply = note;
    activeItem.decisionDate = nowStr;
    activeItem.decisionAdmin = currentUser?.name || 'KGM Süper Admin';

    showToast(`✓ Karar başarıyla işlendi: "${targetStatus}" statüsüne alındı.`, 'success');
    setDecisionNote('');
  };

  // Quick Decision Template
  const handleApplyTemplate = (text) => {
    setDecisionNote(text);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Kaynak Dal', 'Gönderen / Kurum', 'Rol/Bölüm', 'Konu', 'Öncelik', 'Durum', 'Tarih', 'Yönetici Notu'];
    const rows = filteredItems.map(i => [
      i.id,
      `"${i.branchLabel || i.sourceType}"`,
      `"${i.senderName || ''}"`,
      `"${i.senderRole || ''}"`,
      `"${i.title || ''}"`,
      i.priority || 'Normal',
      i.status || 'Beklemede',
      i.date || '',
      `"${(i.reply || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KGM_Degerlendirme_Havuzu_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📥 Değerlendirme havuzu Excel/CSV formatında indirildi.');
  };

  // Print Decision Report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-32 flex flex-col selection:bg-amber-500 selection:text-white">
      
      {/* ── TOP EXECUTIVE BANNER (VIBRANT ROYAL GOLD & AMBER) ──────────────── */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 border-b-2 border-yellow-300/50 px-6 py-4 sticky top-0 z-40 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding & Portal Title (Clean, NO top-left arrow) */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-yellow-300 via-amber-200 to-white text-slate-950 flex items-center justify-center font-black shadow-lg border border-white/50 shrink-0">
            <Crown size={26} className="text-amber-700 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950/50 text-yellow-300 px-2.5 py-0.5 rounded-full border border-yellow-300/30">
                MERKEZİ YÖNETİM & DEĞERLENDİRME MASASI
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-black text-white leading-tight truncate drop-shadow-sm">
              KGM Merkezi Yönetim Konsolu & Karar Masası
            </h1>
            <p className="text-xs text-amber-100 font-medium truncate">
              İstanbul Esenyurt Üniversitesi • Tüm Portalların Denetim & Onay Masası
            </p>
          </div>
        </div>

        {/* Right: Branch Quick-Switch Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => {
              if (setView) setView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition border border-white/20 shadow-xs cursor-pointer"
            title="Süper Yönetici Akışına Dön (Feed)"
          >
            <Home size={15} />
            <span>Yönetici Akışı (Feed)</span>
          </button>

          <button
            onClick={() => {
              if (setView) setView('admin_cms');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 text-yellow-300 hover:text-yellow-200 font-bold text-xs transition border border-yellow-300/30 shadow-xs cursor-pointer"
            title="Yönetici Paneline Geç (CMS & Veri Kontrol)"
          >
            <LayoutDashboard size={15} />
            <span>Yönetici Paneli (CMS)</span>
          </button>
        </div>
      </header>

      {/* ── TOAST NOTIFICATION POPUP ────────────────────────────────────────── */}
      {toastMessage && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-slide-down ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200' 
            : 'bg-red-950/95 border-red-500 text-red-200'
        }`}>
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage.msg}</span>
        </div>
      )}

      {/* ── VIBRANT LIVE KPI METRICS RIBBON (5 LIGHT CARDS) ──────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Card 1: Toplam Havuz */}
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-sm hover:border-amber-400 hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">TOPLAM HAVUZ</span>
              <Scale size={18} className="text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{metrics.total}</div>
            <div className="text-[10px] text-slate-500 font-bold mt-1">4 Portalın Ortak Havuzu</div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 2: Bekleyen İşlemler (Vibrant Amber) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 border-2 border-amber-300 shadow-sm hover:border-amber-400 hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">BEKLEYEN KARAR</span>
              <Clock size={18} className="text-amber-600 animate-spin-slow" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-2">{metrics.pending}</div>
            <div className="text-[10px] text-amber-700 font-bold mt-1">Acil İncelenmesi Gereken</div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 3: İnceleniyor (Vibrant Blue) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 border-2 border-blue-200 shadow-sm hover:border-blue-400 hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider">İNCELENMEKTE</span>
              <Search size={18} className="text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-900 mt-2">{metrics.reviewing}</div>
            <div className="text-[10px] text-blue-700 font-bold mt-1">Komisyon Değerlendirmesinde</div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/15 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 4: Onaylandı (Vibrant Emerald) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 border-2 border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">ONAYLANAN</span>
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-2">{metrics.approved}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-1">Yürürlüğe Alınan Protokoller</div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Card 5: Canlı ATS Mülakat Trafiği (Vibrant Purple) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 border-2 border-purple-200 shadow-sm hover:border-purple-400 hover:shadow-md transition col-span-2 sm:col-span-1 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider">ATS MÜLAKATLARI</span>
              <MessageSquare size={18} className="text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-900 mt-2">{metrics.atsCount}</div>
            <div className="text-[10px] text-purple-700 font-bold mt-1">Firma-Aday Canlı Görüşme</div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/15 rounded-full blur-xl pointer-events-none" />
          </div>

        </div>
      </div>

      {/* ── MAIN EVALUATION DESK & FILTER TOOLBAR ────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 flex-1 flex flex-col">
        
        {/* Filter Toolbar Card (Light Theme) */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-4 shadow-sm mb-6 space-y-3.5">
          
          {/* Row 1: Branch Tabs (Tree Leaves Filter) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs font-bold">
            <span className="text-slate-500 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter size={13} /> Kaynak Dal:
            </span>

            {[
              { id: 'all', label: '🌐 Tüm Ekosistem', count: metrics.total },
              { id: 'company', label: '🏢 Firma İş Birlikleri', count: metrics.companyCount, activeColor: 'bg-blue-600 text-white border-blue-600' },
              { id: 'academic', label: '🏛️ Akademik Talepler', count: metrics.academicCount, activeColor: 'bg-purple-600 text-white border-purple-600' },
              { id: 'counseling', label: '🎓 Öğrenci Danışmanlıkları', count: metrics.counselingCount, activeColor: 'bg-emerald-600 text-white border-emerald-600' },
              { id: 'candidate_chat', label: '💬 ATS Canlı Mülakatlar', count: metrics.atsCount, activeColor: 'bg-amber-600 text-white border-amber-600' },
            ].map(tab => {
              const isActive = selectedBranch === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedBranch(tab.id)}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                    isActive 
                      ? (tab.activeColor || 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-sm')
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Search, Status Filter & Priority */}
          <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-slate-100">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kurum, öğrenci, akademisyen adı veya konu ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  <XCircle size={15} />
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto shrink-0 text-xs">
              <span className="text-[11px] text-slate-500 font-bold uppercase hidden sm:inline-block">Durum:</span>
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'Beklemede', label: '⏳ Beklemede', activeBg: 'bg-amber-500 text-slate-950 font-black shadow-sm' },
                { id: 'İnceleniyor', label: '🔍 İnceleniyor', activeBg: 'bg-blue-600 text-white font-black shadow-sm' },
                { id: 'Onaylandı', label: '✅ Onaylandı', activeBg: 'bg-emerald-600 text-white font-black shadow-sm' },
                { id: 'Reddedildi', label: '❌ Reddedildi', activeBg: 'bg-red-600 text-white font-black shadow-sm' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs font-bold whitespace-nowrap ${
                    statusFilter === st.id
                      ? (st.activeBg || 'bg-slate-900 text-white font-black')
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto shrink-0">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer focus:border-amber-500 focus:bg-white"
              >
                <option value="all">Tüm Öncelikler</option>
                <option value="Acil">⚡ Yalnızca Acil</option>
                <option value="Yüksek">🔥 Yüksek Öncelik</option>
                <option value="Normal">🟢 Normal Öncelik</option>
              </select>
            </div>

          </div>

        </div>

        {/* ── WORKSPACE GRID: MASTER-DETAIL 2-PANE DESK ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          
          {/* ── LEFT PANE: REQUESTS STREAM (5 Cols) ─────────────────────────── */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-amber-600" />
                Gelen Talep & İşlem Akışı ({filteredItems.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Seçmek için karta tıklayın
              </span>
            </div>

            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredItems.map(item => {
                const isSelected = activeItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer space-y-2.5 relative group ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {/* Top Row: Branch & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          item.branch === 'company' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          item.branch === 'academic' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          item.branch === 'counseling' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {item.sourceType} {item.branchLabel}
                        </span>

                        {item.priority && item.priority !== 'Normal' && (
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            item.priority === 'Acil' ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' :
                            'bg-orange-50 text-orange-700 border border-orange-200'
                          }`}>
                            {item.priority}
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        item.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.status === 'İnceleniyor' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        item.status === 'Reddedildi' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Sender Info */}
                    <div>
                      <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-700 transition leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5 truncate">
                        {item.senderName} • <span className="text-slate-500">{item.senderRole}</span>
                      </p>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {item.description}
                    </p>

                    {/* Bottom Meta */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {item.date}
                      </span>
                      <span className={`font-black flex items-center gap-0.5 ${isSelected ? 'text-amber-700' : 'text-slate-500'}`}>
                        Karar Masasını Aç <ChevronRight size={12} />
                      </span>
                    </div>

                    {/* Selection Indicator Strip */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-r-full" />
                    )}
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                  <Scale size={36} className="mx-auto text-slate-400" />
                  <h4 className="text-sm font-black text-slate-900">Kriterlere Uygun Talep Bulunamadı</h4>
                  <p className="text-xs text-slate-500">
                    Filtreleri sıfırlayarak tüm havuz kayıtlarını görüntüleyebilirsiniz.
                  </p>
                  <button
                    onClick={() => { setSelectedBranch('all'); setStatusFilter('all'); setPriorityFilter('all'); setSearchQuery(''); }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-sm"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT PANE: ACTIVE DECISION & INSPECTION DESK (7 Cols) ───────── */}
          <div className="lg:col-span-7 sticky top-24">
            {activeItem ? (
              <div className="bg-white border-2 border-amber-400/80 rounded-3xl p-6 shadow-xl space-y-5">
                
                {/* Header of Active Item */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border ${
                      activeItem.branch === 'company' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      activeItem.branch === 'academic' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                      activeItem.branch === 'counseling' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {activeItem.branch === 'company' ? <Building2 size={24} /> :
                       activeItem.branch === 'academic' ? <GraduationCap size={24} /> :
                       activeItem.branch === 'counseling' ? <User size={24} /> :
                       <MessageSquare size={24} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                          {activeItem.category || activeItem.branchLabel}
                        </span>
                        <span className="text-[10px] text-slate-500">• {activeItem.date}</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                        {activeItem.title}
                      </h2>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-black px-3.5 py-1.5 rounded-full border shadow-sm ${
                      activeItem.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      activeItem.status === 'İnceleniyor' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                      activeItem.status === 'Reddedildi' ? 'bg-red-50 text-red-800 border-red-300' :
                      'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {activeItem.status}
                    </span>

                    <button
                      onClick={handlePrintReport}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition cursor-pointer"
                      title="Resmî Karar Tutanağını Yazdır"
                    >
                      <Printer size={16} />
                    </button>
                  </div>
                </div>

                {/* Sender Identity & Contact Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Talep Sahibi / Kurum</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">{activeItem.senderName}</span>
                    <span className="text-slate-600 font-medium">{activeItem.senderRole}</span>
                  </div>

                  <div className="sm:text-right space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Resmî İletişim & Profil</span>
                    <span className="text-amber-700 font-bold block truncate">{activeItem.senderEmail}</span>
                    
                    {/* Quick navigation to student profile or ATS */}
                    {activeItem.studentId && (
                      <button
                        onClick={() => {
                          if (setSelectedUserId) setSelectedUserId(activeItem.studentId);
                          if (setView) setView('user_profile');
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:underline cursor-pointer"
                      >
                        <User size={12} /> Öğrencinin Profilini İncele <ExternalLink size={10} />
                      </button>
                    )}

                    {activeItem.branch === 'candidate_chat' && (
                      <button
                        onClick={() => setView?.('company_ats')}
                        className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 hover:underline cursor-pointer"
                      >
                        <Briefcase size={12} /> ATS Aday Havuzunu Aç <ExternalLink size={10} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Content & Description */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-slate-700 tracking-wider block">
                    Talep Özeti & Resmî Başvuru Gerekçesi
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-3">
                    <p>{activeItem.description}</p>

                    {/* Specific details rendering */}
                    {activeItem.details && (
                      <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(activeItem.details).map(([k, v]) => (
                          <div key={k} className="p-2 rounded-xl bg-white border border-slate-200">
                            <span className="text-slate-500 uppercase text-[9px] font-bold block">{k}</span>
                            <span className="font-bold text-slate-800">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Previous Official Decisions (if any) */}
                {(activeItem.reply || activeItem.decisionDate) && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 border border-emerald-300 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck size={14} /> KGM Resmî Yönetici Kararı
                      </span>
                      <span className="text-slate-500 text-[10px]">{activeItem.decisionDate || 'Daha önce işlendi'}</span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                      "{activeItem.reply}"
                    </p>
                    {activeItem.decisionAdmin && (
                      <span className="text-[10px] text-emerald-800 font-bold block pt-1">
                        Kararı Veren: {activeItem.decisionAdmin}
                      </span>
                    )}
                  </div>
                )}

                {/* ── KGM OFFICIAL DECISION ISSUANCE FORM ────────────────────────── */}
                <div className="pt-3 border-t border-slate-100 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      KGM Resmî Yönetici Kararını İlet & İşle
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      Resmî Tutanak
                    </span>
                  </div>

                  {/* Quick Decision Template Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[10px] font-bold">
                    <button
                      onClick={() => handleApplyTemplate('KGM Koordinatörlüğü tarafından incelenmiş, resmi protokol uygun görülerek ONAYLANMIŞ ve yürürlüğe alınmıştır.')}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer whitespace-nowrap"
                    >
                      ✓ Onay Şablonu
                    </button>
                    <button
                      onClick={() => handleApplyTemplate('Ön inceleme tamamlandı. İlgili fakülte komisyonundan ek evrak ve protokol teyidi beklenmektedir.')}
                      className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 transition cursor-pointer whitespace-nowrap"
                    >
                      🔍 İnceleme Şablonu
                    </button>
                    <button
                      onClick={() => handleApplyTemplate('Fakülte kontenjan sınırları ve staj yönergesi şartları sağlanamadığından talep uygun bulunmamıştır.')}
                      className="px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 transition cursor-pointer whitespace-nowrap"
                    >
                      ❌ Red Gerekçesi
                    </button>
                  </div>

                  {/* Decision Note Textarea */}
                  <textarea
                    value={decisionNote}
                    onChange={(e) => setDecisionNote(e.target.value)}
                    rows={3}
                    placeholder="Resmî karar gerekçesi, protokol şartları veya koordinasyon notunuzu buraya yazın..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition"
                  />

                  {/* 3 Executive Action Buttons */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    <button
                      onClick={() => handleExecuteDecision('Onaylandı')}
                      className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 size={16} /> Onayla
                    </button>

                    <button
                      onClick={() => handleExecuteDecision('İnceleniyor')}
                      className="py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Search size={16} /> İncele
                    </button>

                    <button
                      onClick={() => handleExecuteDecision('Reddedildi')}
                      className="py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-xs rounded-2xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <XCircle size={16} /> Reddet
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-3xl border-2 border-slate-200 shadow-sm space-y-3">
                <Crown size={40} className="mx-auto text-amber-500/50" />
                <h3 className="text-base font-black text-slate-900">İncelenecek Bir Talep Seçin</h3>
                <p className="text-xs text-slate-500">
                  Sol taraftaki listeden bir talep veya protokol kartı seçerek resmi karar masasını açabilirsiniz.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── FLOATING BOTTOM EXECUTIVE NAVIGATION DOCK (ALT PANEL - PURE ICON BUTTONS) ── */}
      <nav 
        aria-label="Merkezi Yönetim Alt Navigasyon Paneli"
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up"
      >
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-amber-400/70 shadow-[0_15px_40px_rgba(217,119,6,0.25)] p-2 sm:p-2.5 rounded-full flex items-center gap-2 sm:gap-2.5 text-slate-800">
          
          {/* 1. Yönetici Akışına Geri Dön (Ev Butonu - Beyaz İkon) */}
          <button
            onClick={() => {
              if (setView) setView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-yellow-200/60"
            title="Ana Sayfa & Yönetici Akışına Dön (Feed)"
          >
            <Home size={22} className="text-white drop-shadow-xs" strokeWidth={2.3} />
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* 2. Full CMS Tabloları */}
          <button
            onClick={() => {
              if (setView) setView('admin_cms');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Tam CMS Yönetim Panelleri"
          >
            <Building2 size={20} strokeWidth={2.2} />
          </button>

          {/* 3. ATS Aday Takip Havuzu */}
          <button
            onClick={() => {
              if (setView) setView('company_ats');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="ATS Aday & Mülakat Panosu"
          >
            <Briefcase size={20} strokeWidth={2.2} />
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* 4. Excel / CSV Havuz İndir */}
          <button
            onClick={handleExportCSV}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Değerlendirme Havuzunu Excel/CSV Olarak İndir"
          >
            <Download size={20} strokeWidth={2.2} />
          </button>

        </div>
      </nav>

    </div>
  );
}
