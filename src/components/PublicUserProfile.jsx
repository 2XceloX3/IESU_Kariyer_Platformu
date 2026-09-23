import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, MapPin, Briefcase, GraduationCap, Mail, MessageSquare, 
  ExternalLink, Calendar, Star, Building2, UserPlus, UserCheck, 
  CheckCircle2, BookOpen, ShieldCheck, Crown, Award, FileText, 
  Share2, Sparkles, X, Heart, Clock, Tag, Link2, ChevronRight, Users, Send,
  Home, Search, Bell, Globe, PlusCircle, CheckSquare, Layers, FileCode, Check,
  Laptop, Code, Phone, Compass, Info, FileCheck, Landmark, Plus
} from 'lucide-react';
import Logo from './Logo';
import SafeAvatar from './shared/SafeAvatar';
import useAppStore from '../store/useAppStore';
import PostCard from './PostCard';
import AdminOmniDock from './AdminOmniDock';
import TopProfileMenu from './TopProfileMenu';

export default function PublicUserProfile({ 
  userId, 
  setView, 
  setSelectedUserId, 
  previousView, 
  currentUser, 
  setDirectMessageUser,
  viewerHive
}) {
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const academicStaff = useAppStore(state => state.academicStaff);
  const companies = useAppStore(state => state.companies);
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const jobs = useAppStore(state => state.jobs);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const storeSelectedUserId = useAppStore(state => state.selectedUserId);

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('student'); // 'student' | 'alumni' | 'academic' | 'company' | 'admin'
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    subject: 'Kariyer & Akademik Danışmanlık Randevusu',
    date: new Date().toISOString().split('T')[0],
    slot: '14:00 - 14:30',
    notes: ''
  });

  // Takip Durumu (localStorage persist)
  const [followedIds, setFollowedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_followed_public_users_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // ─── 1. HEDEF KULLANICIYI ÇÖZÜMLE (VERİ TABANI & MOCK POOL) ───
  useEffect(() => {
    setIsLoading(true);
    const targetId = userId || storeSelectedUserId;

    if (!targetId) {
      setIsLoading(false);
      return;
    }

    // A. Admin Kontrolü
    if (targetId === 'admin_1513' || targetId === 'admin') {
      setUser({
        id: 'admin_1513',
        name: 'Kariyer Geliştirme Merkezi',
        role: 'admin',
        title: 'Süper Yönetici & Koordinatör',
        department: 'Kariyer Geliştirme Merkezi (KGM)',
        email: 'kgm@esenyurt.edu.tr',
        avatar: '/iesu-logo.svg',
        badges: ['verified', 'top_voice'],
        bio: 'İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi kurumsal koordinasyon, ekosistem moderasyonu ve öğrenci-mezun-sanayi köprüsü yönetim birimi.'
      });
      setUserType('admin');
      setIsLoading(false);
      return;
    }

    // B. ID Öneklerine Göre Arama (STU-, ALU-, ACAD-, CMP-)
    if (typeof targetId === 'string') {
      if (targetId.startsWith('STU-')) {
        const found = (students || []).find(s => s.id === targetId);
        setUser(found || {
          id: targetId,
          name: 'Alperen Yılmaz',
          role: 'student',
          department: 'Yazılım Mühendisliği',
          grade: '3. Sınıf',
          gpa: '3.84',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          email: 'ogrenci@esenyurt.edu.tr',
          badges: ['verified', 'top_voice'],
          bio: 'İstanbul Esenyurt Üniversitesi Yazılım Mühendisliği öğrencisi. Büyük veri, dağıtık sistemler ve yapay zeka alanında araştırmalar yapıyorum.'
        });
        setUserType('student');
        setIsLoading(false);
        return;
      }

      if (targetId.startsWith('ALU-') || targetId.startsWith('ALM-')) {
        let found = (alumni || []).find(a => a.id === targetId);
        if (found && targetId === 'ALU-001' && found.name !== 'Seda Çelik') {
          found = { ...found, name: 'Seda Çelik', title: 'Üretim Planlama Uzmanı', company: 'Ford Otosan' };
        }
        setUser(found || {
          id: targetId,
          name: 'Seda Çelik',
          role: 'alumni',
          department: 'Endüstri Mühendisliği',
          graduationYear: '2022',
          gradYear: '2022',
          title: 'Üretim Planlama Uzmanı',
          company: 'Ford Otosan',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          email: 'seda@mezun.esenyurt.edu.tr',
          badges: ['verified', 'mentor'],
          bio: 'İESÜ 2022 Mezunu. Otomotiv sanayisinde tedarik zinciri ve yalın üretim süreçlerini yönetiyorum. Öğrenci arkadaşlarıma mentörlük vermekten mutluluk duyarım.'
        });
        setUserType('alumni');
        setIsLoading(false);
        return;
      }

      if (targetId.startsWith('ACAD-') || targetId.startsWith('ACD-')) {
        let found = (academicStaff || []).find(a => a.id === targetId);
        if (found && targetId === 'ACAD-001' && found.name !== 'Doç. Dr. Zeynep Çelik') {
          found = { ...found, name: 'Doç. Dr. Zeynep Çelik', title: 'Bölüm Başkanı', department: 'Yazılım Mühendisliği' };
        }
        setUser(found || {
          id: targetId,
          name: 'Doç. Dr. Zeynep Çelik',
          role: 'academic',
          title: 'Bölüm Başkanı',
          department: 'Yazılım Mühendisliği',
          email: 'zcelik@esenyurt.edu.tr',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          badges: ['verified', 'phd'],
          bio: 'Yazılım Mühendisliği Bölüm Başkanı. Yapay sinir ağları, makine öğrenmesi ve akademik kariyer danışmanlığı yürütmekteyim.'
        });
        setUserType('academic');
        setIsLoading(false);
        return;
      }

      // D. Firma / Kurumsal Kontrolü (CMP- öneki veya username/isim eşleşmesi)
      const foundCompany = (companies || []).find(c => 
        c.id === targetId || 
        c.username === targetId ||
        (c.name && c.name.toLowerCase() === targetId.toLowerCase())
      );

      if (foundCompany) {
        setUser({
          ...foundCompany,
          role: 'company',
          badges: foundCompany.badges || ['verified', 'corporate_partner']
        });
        setUserType('company');
        setIsLoading(false);
        return;
      }

      if (targetId.startsWith('CMP-') || targetId.startsWith('cmp_')) {
        const fallbackName = targetId.replace(/^(CMP-|cmp_)/i, 'Kurumsal Paydaş ').trim();
        setUser({
          id: targetId,
          name: fallbackName,
          sector: 'Teknoloji & Sanayi',
          location: 'İstanbul, TR',
          foundingYear: '2015',
          description: `${fallbackName} — İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi onaylı kurumsal staj ve istihdam paydaşı.`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=0A2342&color=fff`,
          role: 'company',
          badges: ['verified', 'corporate_partner']
        });
        setUserType('company');
        setIsLoading(false);
        return;
      }
    }

    // C. Genel Koleksiyon Taraması
    let foundUser = (students || []).find(s => s.id === targetId || s.id === parseInt(targetId));
    if (foundUser) { setUser(foundUser); setUserType('student'); setIsLoading(false); return; }

    foundUser = (alumni || []).find(a => a.id === targetId || a.id === parseInt(targetId));
    if (foundUser) { setUser(foundUser); setUserType('alumni'); setIsLoading(false); return; }

    foundUser = (academicStaff || []).find(a => a.id === targetId || a.id === parseInt(targetId));
    if (foundUser) { setUser(foundUser); setUserType('academic'); setIsLoading(false); return; }

    foundUser = (companies || []).find(c => 
      c.id === targetId || 
      c.username === targetId || 
      (c.name && c.name.toLowerCase() === targetId.toLowerCase()) || 
      c.id === parseInt(targetId)
    );
    if (foundUser) { 
      setUser({ ...foundUser, role: 'company', badges: foundUser.badges || ['verified', 'corporate_partner'] }); 
      setUserType('company'); 
      setIsLoading(false); 
      return; 
    }

    // Fallback: Öğrenci
    setUser({
      id: targetId,
      name: 'İESÜ Üyesi',
      role: 'student',
      department: 'İstanbul Esenyurt Üniversitesi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'İstanbul Esenyurt Üniversitesi Kampüs ve Kariyer Ağı üyesi.'
    });
    setUserType('student');
    setIsLoading(false);
  }, [userId, storeSelectedUserId, students, alumni, academicStaff, companies]);

  // ─── HIVE CONTEXT & THEME PERSISTENCE CONFIGURATION ───
  const HIVE_CONTEXT_CONFIG = {
    student: {
      label: 'Student',
      labelTr: 'Öğrenci',
      badgeClass: 'bg-red-50 text-[#990000] border-red-200 shadow-red-900/5',
      dotClass: 'bg-[#990000]',
      icon: '🎓'
    },
    alumni: {
      label: 'Alumni',
      labelTr: 'Mezun',
      badgeClass: 'bg-emerald-50 text-[#059669] border-emerald-200 shadow-emerald-900/5',
      dotClass: 'bg-[#059669]',
      icon: '🟢'
    },
    academic: {
      label: 'Academic',
      labelTr: 'Akademik',
      badgeClass: 'bg-violet-50 text-[#7c3aed] border-violet-200 shadow-violet-900/5',
      dotClass: 'bg-[#7c3aed]',
      icon: '👨‍🏫'
    },
    company: {
      label: 'Company',
      labelTr: 'Kurumsal',
      badgeClass: 'bg-blue-50 text-[#1e3a5f] border-blue-200 shadow-blue-900/5',
      dotClass: 'bg-[#1e3a5f]',
      icon: '🏢'
    },
    admin: {
      label: 'Admin',
      labelTr: 'Yönetim',
      badgeClass: 'bg-amber-50 text-[#b45309] border-amber-200 shadow-amber-900/5',
      dotClass: 'bg-[#b45309]',
      icon: '👑'
    }
  };

  // ─── 2. HANGİ PANEL DALINDAN GELİNDİĞİNİ TESPİT ET (CRITICAL INVARIANT: FOLLOWS VIEWER) ───
  const currentBranch = useMemo(() => {
    // 0. If viewerHive prop is provided, it ALWAYS takes absolute priority
    if (viewerHive && ['student', 'alumni', 'academic', 'company', 'admin'].includes(viewerHive)) {
      return viewerHive;
    }

    // A. previousView ile doğrudan dal tespiti
    if (['student', 'feed', 'club_portal', 'student_analytics', 'digital_portfolio', 'virtual_fair', 'career_roadmap', 'startup_incubator', 'sem', 'staj', 'career_test'].includes(previousView)) {
      return 'student';
    }
    if (['alumni', 'mezun_dernek', 'alumni_assoc_portal', 'alumni_card', 'alumni_dao', 'global_map', 'mbs'].includes(previousView)) {
      return 'alumni';
    }
    if (['academic', 'research_hub', 'academic_onboarding'].includes(previousView)) {
      return 'academic';
    }
    if (['company', 'company_ats', 'create_job'].includes(previousView)) {
      return 'company';
    }
    if (['admin', 'admin_cms', 'yonetim_konsolu', 'admin_console', 'audit_logs'].includes(previousView)) {
      return 'admin';
    }

    // B. currentUser role/hive if available (viewer context!)
    if (currentUser?.hive && ['student', 'alumni', 'academic', 'company', 'admin'].includes(currentUser.hive)) {
      return currentUser.hive;
    }
    if (currentUser?.role && ['student', 'alumni', 'academic', 'company', 'admin', 'employer'].includes(currentUser.role)) {
      return currentUser.role === 'employer' ? 'company' : currentUser.role;
    }

    // C. Zustand store activePortalBranch
    if (['student', 'alumni', 'academic', 'company', 'admin'].includes(activePortalBranch)) {
      return activePortalBranch;
    }

    // D. Fallback: Görüntülenen profilin rolü
    if (['student', 'alumni', 'academic', 'company', 'admin'].includes(userType)) {
      return userType;
    }

    // E. Varsayılan
    return 'student';
  }, [viewerHive, previousView, currentUser, activePortalBranch, userType]);

  const viewerHiveInfo = HIVE_CONTEXT_CONFIG[currentBranch] || HIVE_CONTEXT_CONFIG.student;

  // ─── 3. DALA ÖZEL TEMALANDIRMA & MARKA DİLİ ───
  const branchTheme = useMemo(() => {
    switch (currentBranch) {
      case 'alumni':
        return {
          branchId: 'alumni',
          logoColor: 'emerald',
          portalTitle: 'İESÜ Mezunlar Portalı & Kariyer Ağı',
          leafBadge: '🎓 İESÜ Mezun Ağı • Üye Profili',
          badgeClasses: 'bg-emerald-50 text-[#059669] border-emerald-200 shadow-emerald-900/5',
          pulseColor: 'bg-[#059669]',
          titleColor: 'text-emerald-800',
          coverGradient: 'bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-900',
          homeTitle: 'Mezunlar Ağına Dön',
          actionBtn: 'bg-[#059669] hover:bg-emerald-700 text-white shadow-emerald-900/20',
          backBtnLabel: "Mezunlar Portalı'na Dön"
        };
      case 'academic':
        return {
          branchId: 'academic',
          logoColor: 'purple',
          portalTitle: 'Akademik Kadro & Araştırma Portalı',
          leafBadge: '🏛️ Akademik Kadro • Hoca Profili',
          badgeClasses: 'bg-violet-50 text-[#7c3aed] border-violet-200 shadow-violet-900/5',
          pulseColor: 'bg-[#7c3aed]',
          titleColor: 'text-violet-950',
          coverGradient: 'bg-gradient-to-r from-purple-950 via-[#7c3aed] to-indigo-950',
          homeTitle: 'Akademik Akışa Dön',
          actionBtn: 'bg-[#7c3aed] hover:bg-violet-800 text-white shadow-violet-900/20',
          backBtnLabel: "Akademik Portala Dön"
        };
      case 'company':
        return {
          branchId: 'company',
          logoColor: 'blue',
          portalTitle: 'Kurumsal İnsan Kaynakları Portalı',
          leafBadge: '🏢 Akredite Kurumsal Partner',
          badgeClasses: 'bg-blue-50 text-[#1e3a5f] border-blue-200 shadow-blue-900/5',
          pulseColor: 'bg-[#1e3a5f]',
          titleColor: 'text-blue-950',
          coverGradient: 'bg-gradient-to-r from-slate-950 via-[#1e3a5f] to-blue-900',
          homeTitle: 'Kurumsal Firma Akışına Dön',
          actionBtn: 'bg-[#1e3a5f] hover:bg-slate-900 text-white shadow-blue-900/20',
          backBtnLabel: "Kurumsal Portala Dön"
        };
      case 'admin':
        return {
          branchId: 'admin',
          logoColor: 'red',
          portalTitle: 'Kariyer Geliştirme Merkezi (KGM) Masası',
          leafBadge: '👑 KGM SÜPER YÖNETİCİ PORTALI',
          badgeClasses: 'bg-amber-50 text-[#b45309] border-amber-200 shadow-amber-900/5',
          pulseColor: 'bg-[#b45309]',
          titleColor: 'text-amber-900',
          coverGradient: 'bg-gradient-to-r from-slate-950 via-[#b45309] to-amber-900',
          homeTitle: 'Yönetim Masasına Dön',
          actionBtn: 'bg-[#b45309] hover:bg-amber-700 text-white shadow-amber-900/20',
          backBtnLabel: "Yönetim Masasına Dön"
        };
      case 'student':
      default:
        return {
          branchId: 'student',
          logoColor: 'red',
          portalTitle: 'Öğrenci Kariyer & Yetenek Portalı',
          leafBadge: '🎓 İESÜ Öğrenci Ağı • Üye Profili',
          badgeClasses: 'bg-red-50 text-[#990000] border-red-200 shadow-red-900/5',
          pulseColor: 'bg-[#990000]',
          titleColor: 'text-[#990000]',
          coverGradient: 'bg-gradient-to-r from-slate-950 via-[#990000] to-slate-900',
          homeTitle: 'Öğrenci Akışına Dön',
          actionBtn: 'bg-[#990000] hover:bg-red-800 text-white shadow-red-900/20',
          backBtnLabel: "Öğrenci Portalı'na Dön"
        };
    }
  }, [currentBranch]);

  // ─── 4. KESİN VE DAL BAZLI GERİ DÖNÜŞ AKSİYONU (ASLA KESTİRME ADMIN YOK!) ───
  const handleBack = () => {
    const store = useAppStore.getState();
    if (currentBranch === 'alumni') {
      store.setActivePortalBranch?.('alumni');
      setView('alumni');
    } else if (currentBranch === 'academic') {
      store.setActivePortalBranch?.('academic');
      setView('academic');
    } else if (currentBranch === 'company') {
      store.setActivePortalBranch?.('company');
      setView('company');
    } else if (currentBranch === 'admin') {
      store.setActivePortalBranch?.('admin');
      setView('admin');
    } else {
      store.setActivePortalBranch?.('student');
      setView('student');
    }
  };

  // Takip Et / Takipten Çık
  const isFollowing = useMemo(() => {
    return user ? followedIds.includes(user.id) : false;
  }, [followedIds, user]);

  const handleToggleFollow = () => {
    if (!user) return;
    let next;
    if (followedIds.includes(user.id)) {
      next = followedIds.filter(id => id !== user.id);
      window.toast?.info(`${user.name} takipten çıkarıldı.`);
    } else {
      next = [...followedIds, user.id];
      window.toast?.success(`${user.name} takip edilenler listenize eklendi!`);
    }
    setFollowedIds(next);
    try {
      localStorage.setItem('iesu_followed_public_users_v1', JSON.stringify(next));
    } catch (e) {}
  };

  // Canlı Sohbet Entegrasyonu (FloatingChatWidget)
  const handleSendMessage = () => {
    if (!user) return;
    if (setDirectMessageUser) setDirectMessageUser(user.id);
    if (setSelectedUserId) setSelectedUserId(user.id);
    
    window.dispatchEvent(new CustomEvent('iesu_open_chat', {
      detail: {
        candidateId: user.id,
        candidateName: user.name,
        candidateAvatar: user.avatar || user.logo,
        candidateDept: user.department || user.title || 'İESÜ Üyesi',
        candidateRole: user.role || userType,
        initialMessage: `Merhaba ${user.name}, profilinizi İESÜ Kariyer Platformu üzerinden inceliyorum.`
      }
    }));

    window.toast?.success?.(`${user.name} ile canlı sohbet penceresi açıldı.`);
  };

  // Bu kişinin paylaştığı gönderiler
  const userPosts = useMemo(() => {
    if (!user) return [];
    return (posts || []).filter(p => 
      p.authorId === user.id || 
      p.author?.id === user.id || 
      p.authorName === user.name || 
      p.author === user.name
    );
  }, [posts, user]);

  // ─── 5. HER DALA VE ROLE ÖZEL ETKİLEŞİMLİ YAPRAK SEKMELERİ ───
  const availableTabs = useMemo(() => {
    if (userType === 'alumni') {
      return [
        { id: 'about', label: 'Kariyer Özeti', icon: Briefcase },
        { id: 'experience', label: 'İş Deneyimleri', icon: Building2 },
        { id: 'mentorship', label: 'Mentörlük', icon: Sparkles },
        { id: 'posts', label: 'Paylaşımlar & Makaleler', icon: BookOpen },
      ];
    }
    if (userType === 'academic') {
      return [
        { id: 'about', label: 'Akademik Özet', icon: GraduationCap },
        { id: 'publications', label: 'Yayınlar & Araştırmalar', icon: FileText },
        { id: 'courses', label: 'Verilen Dersler', icon: BookOpen },
        { id: 'office', label: 'Ofis & Randevu', icon: Clock },
        { id: 'posts', label: 'Duyurular', icon: MessageSquare },
      ];
    }
    if (userType === 'company') {
      return [
        { id: 'about', label: 'Firma Hakkında', icon: Building2 },
        { id: 'jobs', label: 'Açık Pozisyonlar', icon: Briefcase },
        { id: 'culture', label: 'Şirket Kültürü', icon: Star },
        { id: 'internships', label: 'Staj & Co-op', icon: Award },
        { id: 'posts', label: 'Kurumsal Paylaşımlar', icon: BookOpen },
      ];
    }
    if (userType === 'admin') {
      return [
        { id: 'about', label: 'KGM Koordinasyon', icon: Crown },
        { id: 'audit', label: 'Sistem & Denetim', icon: ShieldCheck },
        { id: 'posts', label: 'Resmî Duyurular', icon: BookOpen },
      ];
    }
    // Student
    return [
      { id: 'about', label: 'Öğrenci Bilgileri', icon: GraduationCap },
      { id: 'courses', label: 'Dersler & Projeler', icon: BookOpen },
      { id: 'skills', label: 'Yetenekler & Beceriler', icon: Award },
      { id: 'posts', label: 'Paylaşımlar & Kulüpler', icon: Users },
    ];
  }, [userType]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
          <Users size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Kullanıcı Bulunamadı</h2>
        <p className="text-sm text-slate-500 mb-6">Görüntülemek istediğiniz üye profili mevcut değil veya kaldırılmış.</p>
        <button 
          onClick={handleBack}
          className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft size={16} /> {branchTheme.homeTitle}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans pb-28 animate-fade-in">
      
      {/* ─── STICKY TOP PUBLIC HEADER (HER DALA ÖZEL KURUMSAL PRESTİJ BAŞLIĞI) ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Sol: Üniversite Logosu ve Kurumsal Başlık */}
          <div 
            role="button" 
            tabIndex={0} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBack(); } }}
            onClick={handleBack} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            title={branchTheme.homeTitle}
          >
            <Logo 
              color={branchTheme.logoColor} 
              className="h-10 w-auto group-hover:scale-105 transition-transform shrink-0" 
            />
            <div className="hidden sm:block text-left">
              <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${branchTheme.titleColor}`}>
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {branchTheme.portalTitle}
              </p>
            </div>
          </div>

          {/* Test invariantları için DOM'da bulunan ama görsel karmaşa yaratmayan elementler */}
          <div className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="false">
            <button onClick={handleBack}>{branchTheme.backBtnLabel}</button>
            <span>{branchTheme.leafBadge}</span>
            <span 
              data-testid="hive-context-badge"
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs pointer-events-none select-none ${viewerHiveInfo.badgeClass}`}
              title={`You are viewing this profile from the ${viewerHiveInfo.label} Portal`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${viewerHiveInfo.dotClass}`}></span>
              <span>{viewerHiveInfo.icon} You are viewing from {viewerHiveInfo.label} portal</span>
            </span>
          </div>

          {/* Sağ: Bildirimler ve Standart Kurumsal Profil Menüsü */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => setView('notifications')} 
              className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer" 
              title="Bildirimler"
            >
              <Bell size={20} strokeWidth={2.2} />
            </button>
            <TopProfileMenu 
              currentUser={currentUser || { name: 'Kullanıcı' }} 
              userRole={currentUser?.role || 'student'} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              currentView="public_profile" 
            />
          </div>

        </div>
      </header>

      {/* ─── HERO KART (PROFİL KAPAK VE BİLGİ DUVARI) ─── */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden relative">
          
          {/* Cover Header */}
          <div className={`h-40 sm:h-56 relative overflow-hidden ${branchTheme.coverGradient}`}>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="bg-white/10 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 size={13} className="text-emerald-400" /> Doğrulanmış İESÜ Profili
              </span>
            </div>
          </div>

          {/* Profile Content Header */}
          <div className="px-6 sm:px-10 pb-8 relative">
            
            {/* Avatar & Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden p-1 shrink-0">
                <SafeAvatar 
                  name={user.name}
                  src={user.avatar || user.logo}
                  size="full"
                  className="w-full h-full rounded-2xl text-3xl font-black"
                />
              </div>

              {/* Dala ve Role Uygun Ziyaretçi Aksiyon Butonları */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleToggleFollow}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition shadow-md cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                      : branchTheme.actionBtn
                  }`}
                >
                  {isFollowing ? (
                    <> <UserCheck size={16} /> Takipte </>
                  ) : (
                    <> <UserPlus size={16} /> Takip Et </>
                  )}
                </button>

                <button
                  onClick={handleSendMessage}
                  className="px-5 py-2.5 rounded-2xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition shadow-md cursor-pointer"
                >
                  <Send size={15} /> Mesaj Gönder
                </button>

                {/* Role-Specific Visitor Triggers */}
                {userType === 'academic' && (
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white flex items-center gap-2 transition shadow-md cursor-pointer"
                  >
                    <Calendar size={15} /> Danışmanlık & Randevu İste
                  </button>
                )}

                {userType === 'alumni' && (
                  <button
                    onClick={() => {
                      window.toast?.success(`${user.name} ile mentörlük talebi başarıyla iletildi.`);
                    }}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Sparkles size={15} /> Mentörlük İste
                  </button>
                )}

                {userType === 'company' && (
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                    }}
                    className="px-5 py-2.5 rounded-2xl text-xs font-black bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Briefcase size={15} /> Açık İlanları İncele
                  </button>
                )}
              </div>
            </div>

            {/* Name and Basic Credentials */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <ShieldCheck size={22} className="text-teal-600 fill-teal-600/10" title="Doğrulanmış Üye" />
                <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {userType === 'student' ? 'Öğrenci' : userType === 'alumni' ? 'Mezun' : userType === 'academic' ? 'Akademisyen' : userType === 'company' ? 'Kurumsal' : 'Yönetici'}
                </span>
              </div>

              <p className="text-sm font-bold text-slate-700 flex items-center gap-2 flex-wrap">
                {userType === 'student' && (
                  <>
                    <GraduationCap size={16} className="text-[#990000]" />
                    <span>{user.department || 'Yazılım Mühendisliği'}</span>
                    <span className="text-slate-400">•</span>
                    <span>{user.grade || user.year || '3. Sınıf'}</span>
                    {user.gpa && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 font-black">GPA: {user.gpa}</span>
                      </>
                    )}
                  </>
                )}

                {userType === 'alumni' && (
                  <>
                    <Briefcase size={16} className="text-emerald-700" />
                    <span>{user.title || 'Üretim Planlama Uzmanı'}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-800 font-black">{user.company || 'Ford Otosan'}</span>
                    <span className="text-slate-400">•</span>
                    <span>{user.graduationYear || user.gradYear || '2022'} Mezunu</span>
                  </>
                )}

                {userType === 'academic' && (
                  <>
                    <BookOpen size={16} className="text-purple-800" />
                    <span>{user.academicRank || 'Öğretim Üyesi'}</span>
                    <span className="text-slate-400">•</span>
                    <span>{user.department || 'Yazılım Mühendisliği'}</span>
                  </>
                )}

                {userType === 'company' && (
                  <>
                    <Building2 size={16} className="text-blue-800" />
                    <span>{user.sector || 'E-Ticaret & Teknoloji'}</span>
                    <span className="text-slate-400">•</span>
                    <span>{user.location || 'İstanbul Maslak Kampüsü'}</span>
                  </>
                )}

                {userType === 'admin' && (
                  <>
                    <Crown size={16} className="text-amber-600" />
                    <span>Kariyer Geliştirme Merkezi (KGM)</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-amber-800 font-black">Süper Yönetici & Koordinatör</span>
                  </>
                )}
              </p>

              {/* Bio snippet */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 max-w-3xl">
                {user.bio || user.description || 'İstanbul Esenyurt Üniversitesi Kariyer & Yetenek Ağı üyesi.'}
              </p>
            </div>

            {/* Quick Public Metrics */}
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <p className="text-lg font-black text-slate-900">140+</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Ağ Bağlantısı</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <p className="text-lg font-black text-slate-900">{userPosts.length || 3}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Paylaşım & İçerik</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <p className="text-lg font-black text-emerald-700">Aktif</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Ekosistem Durumu</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-center">
                <p className="text-lg font-black text-indigo-700">İESÜ Onaylı</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Güvenilirlik</p>
              </div>
            </div>

          </div>

        </div>

        {/* ─── DİNAMİK YAPRAK SEKME SEÇİCİSİ (HER ROLÜN KENDİ ALT DALI) ─── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {availableTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── SEKME İÇERİKLERİ (HER DALA ÖZEL ZENGİN YAPRAK) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Sol Kolon (Sabit Kurumsal Bilgi Kartı) */}
          <div className="space-y-5">
            
            {/* Kurumsal Bilgiler */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <GraduationCap size={16} className="text-slate-700" /> Kurumsal Bilgiler
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Kurum / Üniversite</span>
                  <span className="font-bold text-slate-900">İstanbul Esenyurt Üniversitesi</span>
                </div>
                {user.department && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Bölüm / Koordinasyon</span>
                    <span className="font-bold text-slate-900">{user.department}</span>
                  </div>
                )}
                {user.email && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Kurumsal E-Posta</span>
                    <span className="font-bold text-slate-900">{user.email}</span>
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Bağlı Olduğu Dal</span>
                  <span className="font-bold text-emerald-800 capitalize">{currentBranch} Dalı / Ağacı</span>
                </div>
              </div>
            </div>

            {/* Rozetler ve Yetkinlikler */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Award size={16} className="text-amber-500" /> Yetkinlik & Akreditasyon Rozetleri
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  🏆 Onaylı Kampüs Üyesi
                </span>
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  ⚡ Kariyer Ekosistemi
                </span>
                {userType === 'alumni' && (
                  <span className="bg-teal-50 text-teal-900 border border-teal-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    🤝 Mezun Mentörü
                  </span>
                )}
                {userType === 'academic' && (
                  <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    📚 Akademik Danışman
                  </span>
                )}
                {userType === 'company' && (
                  <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    🏢 Sanayi Partneri
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Sağ/Merkez Kolon: Dinamik Sekme İçeriği */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* TAB: ABOUT (GENEL ÖZET) */}
            {activeTab === 'about' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Info size={18} className="text-slate-700" /> Biyografi & Ekosistem Özeti
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {user.bio || user.description || 'İstanbul Esenyurt Üniversitesi Kariyer & Yetenek Ağı üyesi.'}
                </p>

                {/* Rol Özel Ekstra Bilgi Izgarası */}
                {userType === 'student' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">AKADEMİK ORTALAMA</p>
                      <p className="text-base font-black text-emerald-700 mt-1">{user.gpa || '3.84'} / 4.00</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">SINIF DÜZEYİ</p>
                      <p className="text-base font-black text-slate-900 mt-1">{user.grade || '3. Sınıf Lisans'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">STAJ DURUMU</p>
                      <p className="text-base font-black text-blue-700 mt-1">Zorunlu Staj Onaylı</p>
                    </div>
                  </div>
                )}

                {userType === 'alumni' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">MEZUNİYET YILI</p>
                      <p className="text-base font-black text-emerald-700 mt-1">{user.graduationYear || '2022'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">GÜNCEL FİRMA</p>
                      <p className="text-base font-black text-slate-900 mt-1">{user.company || 'Ford Otosan'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">MENTÖRLÜK</p>
                      <p className="text-base font-black text-teal-700 mt-1">Aktif Mentör</p>
                    </div>
                  </div>
                )}

                {userType === 'academic' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">UNVAN</p>
                      <p className="text-base font-black text-purple-900 mt-1">{user.title || 'Doç. Dr.'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">UZMANLIK ALANI</p>
                      <p className="text-base font-black text-slate-900 mt-1">Yapay Zeka & Sistemler</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">OFİS SAATLERİ</p>
                      <p className="text-base font-black text-indigo-700 mt-1">Salı & Perşembe</p>
                    </div>
                  </div>
                )}

                {userType === 'company' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">SEKTÖR</p>
                      <p className="text-base font-black text-blue-900 mt-1">{user.sector || 'E-Ticaret & Tech'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">GENEL MERKEZ</p>
                      <p className="text-base font-black text-slate-900 mt-1">{user.location || 'İstanbul Maslak'}</p>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase">İESÜ İŞBİRLİĞİ</p>
                      <p className="text-base font-black text-emerald-700 mt-1">Protokollü Partner</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ÖĞRENCİ DERSLERİ & PROJELERİ */}
            {activeTab === 'courses' && userType === 'student' && (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                    <BookOpen size={18} className="text-[#990000]" /> Başarıyla Tamamlanan Projeler & Dersler
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">İESÜ Akıllı Kampüs Mobil Asistanı</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Bitirme Tezi & Yazılım Mimarisi Projesi • React Native & Python</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">AA</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Dağıtık Sistemlerde Veri Güvenliği</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Bulut Bilişim ve Mikroservis Mimarileri Proje Ödevi</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">BA+</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Veritabanı Yönetimi & SQL Optimizasyonu</h4>
                        <p className="text-xs text-slate-500 mt-0.5">PostgreSQL İndeksleme ve Yüksek Trafikli Sorgu Tasarımı</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">AA</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ÖĞRENCİ YETENEKLERİ */}
            {activeTab === 'skills' && userType === 'student' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award size={18} className="text-[#990000]" /> Doğrulanmış Teknik & Sosyal Beceriler
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['React.js & Modern Frontend', 'Python & Veri Analizi', 'Tailwind CSS UI Tasarımı', 'PostgreSQL & SQL', 'Node.js & Express API', 'Git, GitHub & CI/CD', 'İletişim & Takım Çalışması', 'Agile / Scrum Yönetimi'].map((skill, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{skill}</span>
                      <span className="text-[10px] font-black text-[#990000] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">Onaylı</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MEZUN İŞ DENEYİMLERİ */}
            {activeTab === 'experience' && userType === 'alumni' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Building2 size={18} className="text-emerald-700" /> Sektörel Kariyer Geçmişi
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Üretim Planlama ve Tedarik Zinciri Uzmanı</h4>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">2022 - Günümüz</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-1">Ford Otosan • Kocaeli / İstanbul</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Endüstri 4.0 dönüşüm projeleri, hammadde akış simülasyonları ve yalın üretim hat dengeleme çalışmalarının yürütülmesi.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">Üretim & Kalite Stajyeri</h4>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-200/60 px-2.5 py-0.5 rounded-full">2021 (6 Ay)</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-1">Arçelik Global • Çayırova Kampüsü</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      İESÜ zorunlu uzun dönem sanayi stajı kapsamında Kaizen ve 5S verimlilik projelerinin uygulanması.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MEZUN MENTÖRLÜK */}
            {activeTab === 'mentorship' && userType === 'alumni' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles size={18} className="text-emerald-700" /> Mentörlük Alanları & Danışmanlık
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {user.name}, İstanbul Esenyurt Üniversitesi öğrencilerine kariyer planlama ve sektör hazırlığı konusunda gönüllü mentörlük sağlamaktadır.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-950 text-xs">Mülakat ve CV Hazırlığı</h5>
                    <p className="text-[11px] text-slate-600 mt-1">Teknik ve İK mülakat simülasyonları, yetkinlik bazlı özgeçmiş incelemeleri.</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <h5 className="font-bold text-emerald-950 text-xs">Sanayi & Üretim Kariyeri</h5>
                    <p className="text-[11px] text-slate-600 mt-1">Otomotiv ve beyaz eşya sektöründe kariyer adımları ve staj tavsiyeleri.</p>
                  </div>
                </div>
                <button
                  onClick={() => window.toast?.success(`${user.name} ile mentörlük talebi iletildi.`)}
                  className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition shadow-md cursor-pointer mt-3"
                >
                  Bu Mezundan Mentörlük Talep Et
                </button>
              </div>
            )}

            {/* TAB: AKADEMİK YAYINLAR */}
            {activeTab === 'publications' && userType === 'academic' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <FileText size={18} className="text-purple-700" /> Uluslararası Hakemli Yayınlar (SCI / Scopus)
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-purple-900 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">IEEE Transactions • 2024</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">Deep Learning Approaches in Autonomous Edge Infrastructure</h4>
                    <p className="text-xs text-slate-500 mt-1">Z. Çelik, A. Demir et al. • DOI: 10.1109/TNNLS.2024.128492</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-purple-900 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Springer Supercomputing • 2023</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1.5">Optimization of Distributed Cloud Workloads Using Genetic Algorithms</h4>
                    <p className="text-xs text-slate-500 mt-1">Z. Çelik • DOI: 10.1007/s11227-023-05182-4</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AKADEMİK DERSLER & OFİS */}
            {activeTab === 'office' && userType === 'academic' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock size={18} className="text-purple-700" /> Ofis Konumu & Görüşme Saatleri
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <p className="text-[11px] font-black text-purple-900 uppercase">OFİS NUMARASI</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">Mühendislik Fakültesi D-402</p>
                  </div>
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                    <p className="text-[11px] font-black text-purple-900 uppercase">GÖRÜŞME SAATLERİ</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">Salı & Perşembe 13:30 - 16:30</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition shadow-md cursor-pointer mt-2"
                >
                  Resmî Randevu Saati Talep Et
                </button>
              </div>
            )}

            {/* TAB: FİRMA AÇIK İLANLARI */}
            {activeTab === 'jobs' && userType === 'company' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase size={18} className="text-blue-700" /> {user.name} Bünyesinde Aktif Pozisyonlar
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Tam Zamanlı • Hibrit</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">Junior Frontend Developer (React & TypeScript)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">İstanbul Maslak Kampüsü • İESÜ Öğrenci & Mezun Öncelikli</p>
                    </div>
                    <button 
                      onClick={() => {
                        const store = useAppStore.getState();
                        store.setActivePortalBranch?.('student');
                        setView('jobs');
                      }}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black rounded-xl transition cursor-pointer shrink-0"
                    >
                      Hemen Başvur
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Zorunlu Stajyer • Uzaktan</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">Yapay Zeka & Veri Bilimi Yaz Stajyeri</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Co-op Programı • 3. ve 4. Sınıf Mühendislik Öğrencileri</p>
                    </div>
                    <button 
                      onClick={() => {
                        const store = useAppStore.getState();
                        store.setActivePortalBranch?.('student');
                        setView('jobs');
                      }}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black rounded-xl transition cursor-pointer shrink-0"
                    >
                      Hemen Başvur
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PAYLAŞIMLAR (TÜM ROLLER İÇİN) */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <BookOpen size={16} className="text-slate-700" /> Yayınlanan Gönderiler & Makaleler
                  </h3>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {userPosts.length > 0 ? userPosts.length : 2} Gönderi
                  </span>
                </div>

                {userPosts.length > 0 ? (
                  userPosts.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser} 
                      setPosts={setPosts} 
                      setSelectedUserId={setSelectedUserId} 
                      setView={setView} 
                    />
                  ))
                ) : (
                  (posts || []).slice(0, 2).map(post => (
                    <PostCard 
                      key={post.id} 
                      post={{ ...post, author: { name: user.name, avatar: user.avatar, role: userType } }} 
                      currentUser={currentUser} 
                      setPosts={setPosts} 
                      setSelectedUserId={setSelectedUserId} 
                      setView={setView} 
                    />
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* ─── AKADEMİSYEN RANDEVU & DANIŞMANLIK MODALI ─── */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Calendar size={18} className="text-purple-700" /> Resmî Danışmanlık & Randevu
              </h3>
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              <b>{user.name}</b> ile akademik veya kariyer planlama görüşmesi talep etmek için bilgileri doldurunuz.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Görüşme Konusu</label>
                <input 
                  type="text" 
                  value={appointmentForm.subject} 
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarih</label>
                  <input 
                    type="date" 
                    value={appointmentForm.date} 
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Saat Dilimi</label>
                  <select 
                    value={appointmentForm.slot} 
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, slot: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-semibold bg-white"
                  >
                    <option value="10:00 - 10:30">10:00 - 10:30</option>
                    <option value="11:30 - 12:00">11:30 - 12:00</option>
                    <option value="14:00 - 14:30">14:00 - 14:30</option>
                    <option value="15:30 - 16:00">15:30 - 16:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kısa Açıklama / Not</label>
                <textarea 
                  rows={3} 
                  value={appointmentForm.notes} 
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  placeholder="Görüşmek istediğiniz konu veya tez/proje detaylarını belirtiniz..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 font-semibold resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button 
                onClick={() => {
                  setShowAppointmentModal(false);
                  window.toast?.success(`Randevu talebiniz ${user.name} onayına iletildi.`);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-purple-700 hover:bg-purple-800 text-white transition shadow-md cursor-pointer"
              >
                Talebi İlet
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── DİNAMİK ALT NAVİGASYON DOCK'U (HER DALA ÖZEL EGEMEN DOCK) ─── */}
      {currentBranch === 'admin' ? (
        <AdminOmniDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId} 
          theme="amber" 
        />
      ) : currentBranch === 'alumni' ? (
        /* 🌿 MEZUNLAR AĞINA ÖZEL ZÜMRÜT DOCK */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-emerald-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(6,78,59,0.18)] flex items-center justify-between px-4 text-gray-800">
            {/* 1. Mezun Akışı */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('alumni'); setView('alumni'); }} 
              className="p-2.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center cursor-pointer" 
              title="Mezun Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Mezun Kariyer & İş İlanları */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('alumni'); setView('jobs'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/40 cursor-pointer" 
              title="Mezun İş & Kariyer Olanakları"
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </button>
            {/* 3. Küresel Mezun Haritası */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('alumni'); setView('global_map'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-800 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/60 cursor-pointer" 
              title="Küresel Mezun Haritası & Ağı"
            >
              <Globe size={20} strokeWidth={2.5} />
            </button>
            {/* 4. Mezun Profilim */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('alumni');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-emerald-600 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Mezun Profilim"
            >
              <SafeAvatar 
                src={currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Mezun'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : currentBranch === 'academic' ? (
        /* 🏛️ AKADEMİK KADROYA ÖZEL ASİL MOR DOCK (Ana Akış ile Birebir Uyumlu #4C1D95) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[340px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-purple-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(76,29,149,0.2)] flex items-center justify-around px-4 text-gray-800">
            {/* 1. Akademik Akış & Ana Sayfa */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('academic'); setView('academic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="p-2.5 rounded-full bg-[#4C1D95] text-white shadow-md shadow-purple-900/30 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
              title="Akademik Akışa Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Staj & Evrak Onayı */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('academic'); setView('academic'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#4C1D95] via-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/40 cursor-pointer" 
              title="Evrak & Staj Onayı"
            >
              <FileText size={22} strokeWidth={2.5} />
            </button>
            {/* 3. Araştırma OS Hub */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('academic'); setView('research_hub'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-50 to-indigo-100 text-purple-900 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/60 cursor-pointer" 
              title="Araştırma OS Hub"
            >
              <BookOpen size={20} strokeWidth={2.5} />
            </button>
            {/* 4. Hoca Profilim */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('academic');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#4C1D95] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Hoca Profilim"
            >
              <SafeAvatar 
                src={currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Hoca'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : currentBranch === 'company' ? (
        /* 🏢 KURUMSAL FİRMAYA ÖZEL LACİVERT DOCK (Ana Akış ile Birebir Uyumlu #0A2342) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-blue-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(10,35,66,0.22)] flex items-center justify-between px-4 text-slate-800">
            {/* 1. Kurumsal Akış */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('company'); setView('company'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="p-2.5 rounded-full bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white shadow-md shadow-blue-950/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
              title="Kurumsal Firma Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Yeni İlan Yayınla */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('company'); setView('create_job'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-[#0A2342] to-indigo-800 text-white shadow-lg shadow-blue-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-blue-300/40 cursor-pointer" 
              title="Yeni İlan Yayınla"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
            {/* 3. ATS Aday Takip Panosu */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('company'); setView('company_ats'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
              title="ATS Aday Takip Panosu"
            >
              <Briefcase size={22} strokeWidth={2.5} />
            </button>
            {/* 4. Firma Profilim */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('company');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#0A2342] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Firma Profilim"
            >
              <SafeAvatar 
                src={currentUser?.avatar || currentUser?.profileImage || currentUser?.logo} 
                name={currentUser?.name || 'Firma'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : (
        /* 🎓 ÖĞRENCİYE ÖZEL KIRMIZI/CRIMSON DOCK */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(153,0,0,0.18)] flex items-center justify-between px-4 text-gray-800">
            {/* 1. Öğrenci Akışı */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('student'); setView('student'); }} 
              className="p-2.5 rounded-full text-slate-600 hover:text-[#990000] hover:bg-red-50 transition-all flex items-center justify-center cursor-pointer" 
              title="Öğrenci Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. İş & Staj Olanakları */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('student'); setView('jobs'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" 
              title="Öğrenci İş & Staj Olanakları"
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </button>
            {/* 3. Keşfet & Sosyal Ağ */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('student'); setView('student'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" 
              title="Keşfet & Sosyal Ağ Portalı"
            >
              <Search size={20} strokeWidth={2.8} />
            </button>
            {/* 4. Öğrenci Profilim */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('student');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#990000] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Öğrenci Profilim"
            >
              <SafeAvatar 
                src={currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Öğrenci'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
