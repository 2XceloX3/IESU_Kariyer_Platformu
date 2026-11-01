import React, { useState, useEffect, useMemo } from 'react';
import SafeAvatar from './shared/SafeAvatar';
import { 
  Shield, Users, Check, X, Megaphone, MapPin, Send, FileText, 
  Image as ImageIcon, ArrowLeft, Building2, CheckCircle2, 
  Clock, Award, ChevronRight, UserCheck, AlertCircle, Sparkles,
  Calendar, Lock, ExternalLink, HelpCircle, Trash2, Edit3, Eye, Globe
} from 'lucide-react';
import Logo from './Logo';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';
import { toast } from './shared/Toast';
import { canManageClub, syncClubEventAcrossSurfaces } from '../utils/clubSocialNetwork';

export default function ClubAdminPanel({ 
  currentUser, 
  setView, 
  userRole = 'student', 
  previousView = 'club_portal' 
}) {
  const { clubs, setClubs, events, setEvents, posts, setPosts } = useAppStore();
  
  // 1. Yetkilendirme Mantık Kontrolü
  const managedClubs = useMemo(() => {
    if (currentUser?.role === 'admin') return clubs || []; // Süper Admin tüm kulüpleri yönetebilir
    return (clubs || []).filter(c => canManageClub(c, currentUser));
  }, [clubs, currentUser]);

  // 2. Stale State Düzeltmesi: managedClubs değiştiğinde selectedClubId güncellenir.
  const [selectedClubId, setSelectedClubId] = useState(managedClubs.length > 0 ? managedClubs[0].id : null);
  
  useEffect(() => {
    if (managedClubs.length > 0 && (!selectedClubId || !managedClubs.find(c => c.id === selectedClubId))) {
      setSelectedClubId(managedClubs[0].id);
    }
  }, [managedClubs, selectedClubId]);

  const [activeTab, setActiveTab] = useState('requests');
  
  // Post & Event composer states
  const [publishMode, setPublishMode] = useState('post'); // 'post' | 'event'
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postVisibility, setPostVisibility] = useState('public'); // 'public' | 'members_only'
  const [postStatus, setPostStatus] = useState('published'); // 'published' | 'draft'
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('14:00');

  const selectedClub = useMemo(() => {
    return (clubs || []).find(c => c.id === selectedClubId) || managedClubs[0] || {};
  }, [clubs, selectedClubId, managedClubs]);

  // Club Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    category: '',
    description: '',
    purpose: '',
    advisor: '',
    email: '',
    logo: '',
    coverImage: ''
  });

  useEffect(() => {
    if (selectedClub && selectedClub.id) {
      setProfileForm({
        name: selectedClub.name || '',
        category: selectedClub.category || 'Bilim & Teknoloji',
        description: selectedClub.description || '',
        purpose: selectedClub.purpose || '',
        advisor: selectedClub.advisor || '',
        email: selectedClub.email || selectedClub.president?.email || 'kulup@esenyurt.edu.tr',
        logo: selectedClub.logo || '',
        coverImage: selectedClub.coverImage || ''
      });
    }
  }, [selectedClub?.id]);

  // Combined Membership Requests & Detailed Applications
  const combinedRequests = useMemo(() => {
    if (!selectedClub) return [];
    const list = [...(selectedClub.memberRequests || [])];
    (selectedClub.memberApplications || []).forEach(app => {
      if (app.status === 'pending' && !list.some(r => r.id === app.id || r.userId === app.studentId)) {
        list.push({
          id: app.id,
          userId: app.studentId,
          userName: app.name,
          name: app.name,
          studentNo: app.studentNo,
          tcKimlik: app.tcKimlik,
          department: app.department,
          grade: app.grade,
          motivation: app.reason || 'Kulüp faaliyetlerine aktif katılmak istiyorum.',
          date: app.appliedAt || new Date().toISOString()
        });
      }
    });
    return list;
  }, [selectedClub]);

  if (managedClubs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col justify-between font-sans">
        {/* Navigation Header */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <Logo className="h-8 w-auto hidden xs:block" />
                <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight">Kulüp Yönetim Paneli</h1>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Öğrenci Kulüpleri & Topluluk İdaresi</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                <SafeAvatar 
                  src={currentUser?.avatar} 
                  name={currentUser?.name || 'Kulüp Yöneticisi'} 
                  size={28} 
                  className="w-7 h-7 rounded-full shadow-2xs" 
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{currentUser?.name || 'Kulüp Yöneticisi'}</p>
                  <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{currentUser?.role === 'admin' ? 'Süper Admin' : 'Öğrenci'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State Body */}
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 animate-fade-in text-center">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/40 rounded-3xl border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 shadow-sm">
            <Shield size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Yönetim Yetkiniz Bulunmuyor</h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2 max-w-md leading-relaxed">
            Herhangi bir öğrenci kulübünün başkanı veya yetkili yöneticisi değilsiniz. Yeni bir kulüp kurmak için EK-1 başvurusunda bulunabilir veya mevcut kulüpleri inceleyebilirsiniz.
          </p>
          <button
            onClick={() => {
              if (setView) setView(previousView || 'club_portal');
            }}
            className="mt-6 px-6 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-red-900/10 flex items-center gap-2"
          >
            Kulüpler Portalına Geç
          </button>
        </div>

        {setView && (
          <SubPanelFloatingDock currentView="club_admin" setView={setView} currentUser={currentUser} userRole={userRole} />
        )}
      </div>
    );
  }
  
  const isPresident = selectedClub.presidentId === currentUser?.id || selectedClub.president?.name === currentUser?.name;

  const handleAcceptRequest = (req) => {
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        const newMember = {
          id: 'MEM-' + Date.now(),
          userId: req.userId || req.studentId || req.id,
          studentNo: req.studentNo || '',
          tcKimlik: req.tcKimlik || '',
          name: req.userName || req.name || 'İsimsiz Üye',
          department: req.department || '',
          grade: req.grade || '',
          role: 'Aktif Üye',
          joinedAt: new Date().toISOString()
        };
        const newMembers = [...(c.members || []), newMember];
        const newRequests = (c.memberRequests || []).filter(r => r.id !== req.id && r.userId !== (req.userId || req.studentId));
        const newApplications = (c.memberApplications || []).filter(a => a.id !== req.id && a.studentId !== (req.userId || req.studentId));
        return { 
          ...c, 
          members: newMembers, 
          memberRequests: newRequests, 
          memberApplications: newApplications,
          memberCount: (c.memberCount || 0) + 1 
        };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.success(`${req.userName || req.name || 'Öğrenci'} kulübe kabul edildi ve üye kadrosuna eklendi.`);
  };

  const handleRejectRequest = (reqId) => {
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        const newRequests = (c.memberRequests || []).filter(r => r.id !== reqId);
        const newApplications = (c.memberApplications || []).filter(a => a.id !== reqId);
        return { ...c, memberRequests: newRequests, memberApplications: newApplications };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.info('Üyelik isteği reddedildi.');
  };

  const handleToggleAdmin = (userId, memberId) => {
    if (!isPresident) {
      toast.error('Sadece kulüp başkanı yetki verebilir!');
      return;
    }
    const resolvedId = userId || memberId;
    if (!resolvedId) {
      toast.error('Kullanıcı kimliği bulunamadı.');
      return;
    }
    
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        const currentAdmins = c.admins || [];
        const isAlreadyAdmin = currentAdmins.includes(resolvedId);
        
        let newAdmins;
        if (isAlreadyAdmin) {
          newAdmins = currentAdmins.filter(id => id !== resolvedId);
          toast.info('Yönetici yetkisi alındı.');
        } else {
          newAdmins = [...currentAdmins, resolvedId];
          toast.success('Yönetici yetkisi verildi.');
        }
        
        return { ...c, admins: newAdmins };
      }
      return c;
    });
    setClubs(updatedClubs);
  };

  const handleSaveClubProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Kulüp adı boş bırakılamaz.');
      return;
    }
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        return {
          ...c,
          name: profileForm.name.trim(),
          category: profileForm.category,
          description: profileForm.description.trim(),
          purpose: profileForm.purpose.trim(),
          advisor: profileForm.advisor.trim(),
          email: profileForm.email.trim(),
          logo: profileForm.logo.trim() || c.logo,
          coverImage: profileForm.coverImage.trim() || c.coverImage
        };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.success('Kulüp profili ve kurumsal bilgileri güncellendi!');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      toast.error('Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    if (publishMode === 'event') {
      const eventDraft = {
        id: 'EVT-' + Date.now(),
        title: postTitle.trim(),
        description: postContent.trim(),
        location: postLocation.trim() || 'Kampüs İçi Konferans Salonu',
        date: eventDate || new Date().toISOString().split('T')[0],
        time: eventTime || '14:00',
        image: postImage.trim() || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        visibility: postVisibility,
        status: postStatus === 'draft' ? 'draft' : 'published',
        approvalStatus: postStatus === 'draft' ? 'draft' : 'approved',
        attendees: 0
      };

      const synced = syncClubEventAcrossSurfaces({
        clubs: clubs || [],
        globalEvents: events || [],
        clubId: selectedClub.id,
        eventPayload: eventDraft,
        action: 'upsert'
      });

      setClubs(synced.clubs);
      if (typeof setEvents === 'function') {
        setEvents(synced.globalEvents);
      }

      toast.success(
        postStatus === 'draft'
          ? 'Kulüp etkinliği taslak olarak kaydedildi.'
          : 'Kulüp etkinliği yayınlandı ve tüm kampüs yüzeyleriyle senkronize edildi!'
      );
    } else {
      const newClubPost = {
        id: 'CPOST-' + Date.now(),
        title: postTitle.trim(),
        caption: `${postTitle.trim()} — ${postContent.trim()}`,
        content: postContent.trim(),
        location: postLocation.trim() || 'İESÜ Merkez Kampüs',
        images: postImage.trim() ? [postImage.trim()] : [],
        visibility: postVisibility,
        status: postStatus,
        likes: 1,
        comments: [],
        createdAt: 'Az önce',
        createdAtMs: Date.now()
      };

      const updatedClubs = (clubs || []).map(c => {
        if (c.id === selectedClub.id) {
          return {
            ...c,
            posts: [newClubPost, ...(c.posts || [])]
          };
        }
        return c;
      });
      setClubs(updatedClubs);

      if (postStatus === 'published' && postVisibility === 'public' && typeof setPosts === 'function') {
        const globalPost = {
          id: newClubPost.id,
          clubId: selectedClub.id,
          clubName: selectedClub.name,
          visibility: postVisibility,
          status: postStatus,
          author: {
            id: `club-${selectedClub.id}`,
            name: selectedClub.name,
            role: `${selectedClub.category || 'Öğrenci Kulübü'} • Resmî Kulüp Paylaşımı`,
            avatar: selectedClub.logo || '/official_pdf_logo.png',
            isClub: true,
            clubId: selectedClub.id
          },
          content: `📢 **${postTitle.trim()}**\n\n${postContent.trim()}`,
          image: postImage.trim() || null,
          likes: 1,
          comments: [],
          shares: 0,
          timestamp: 'Az önce',
          createdAtMs: Date.now(),
          category: 'Kulüp Duyurusu'
        };
        setPosts([globalPost, ...(posts || [])]);
      }

      toast.success(
        postStatus === 'draft'
          ? 'Kulüp paylaşımı taslak olarak kaydedildi.'
          : postVisibility === 'members_only'
          ? 'Kulüp paylaşımı sadece kulüp üyelerine özel olarak yayınlandı!'
          : 'Kulüp paylaşımı yayınlandı ve sosyal akışa eklendi!'
      );
    }
    
    setPostTitle('');
    setPostContent('');
    setPostLocation('');
    setPostImage('');
  };

  const handleDeleteClubPost = (postId) => {
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        return {
          ...c,
          posts: (c.posts || []).filter(p => p.id !== postId)
        };
      }
      return c;
    });
    setClubs(updatedClubs);
    if (typeof setPosts === 'function') {
      setPosts((posts || []).filter(p => p.id !== postId));
    }
    toast.info('Kulüp gönderisi silindi.');
  };

  const handleCancelClubEvent = (eventId) => {
    const synced = syncClubEventAcrossSurfaces({
      clubs: clubs || [],
      globalEvents: events || [],
      clubId: selectedClub.id,
      eventPayload: { id: eventId },
      action: 'cancel'
    });
    setClubs(synced.clubs);
    if (typeof setEvents === 'function') {
      setEvents(synced.globalEvents);
    }
    toast.info('Etkinlik iptal edildi ve öğrenci akışlarından kaldırıldı.');
  };

  const handleEKFormSubmit = (formType, successMsg) => {
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        const newForm = {
          id: `FORM-${Date.now()}`,
          type: formType,
          date: new Date().toLocaleDateString('tr-TR'),
          status: 'Bekliyor'
        };
        return { ...c, forms: [...(c.forms || []), newForm] };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.success(successMsg);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      
      {/* 1. TOP PRESTIGE HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                if (setView) setView(previousView || 'club_portal');
                else if (window?.history?.back) window.history.back();
              }}
              className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-[#990000] flex items-center justify-center transition-all cursor-pointer shadow-2xs group"
              title="Kulüpler Portalına Dön"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-auto hidden xs:block" />
              <div className="hidden sm:block h-6 w-px bg-slate-200" />
              <div>
                <h1 className="text-base font-black text-slate-900 leading-tight">Kulüp Yönetim Paneli</h1>
                <p className="text-[11px] font-bold text-slate-600">Öğrenci Kulüpleri & Topluluk İdaresi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <SafeAvatar 
                src={currentUser?.avatar} 
                name={currentUser?.name || 'Kulüp Yöneticisi'} 
                size={28} 
                className="w-7 h-7 rounded-full shadow-2xs" 
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{currentUser?.name || 'Kulüp Yöneticisi'}</p>
                <p className="text-[10px] font-bold text-emerald-700 mt-0.5">{currentUser?.role === 'admin' ? 'Süper Admin' : 'Kulüp Başkanı'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 pb-28">
        
        {/* BANNER CARD */}
        <div className="mb-6 bg-gradient-to-r from-red-950 via-[#990000] to-rose-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-red-800/40">
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black tracking-wider backdrop-blur-sm border border-white/20">
                  YÖNETİCİ PANELİ
                </span>
                {isPresident && (
                  <span className="bg-amber-400 text-amber-950 font-black px-3 py-1 rounded-full text-xs tracking-wider shadow-xs">
                    BAŞKAN
                  </span>
                )}
                <span className="bg-black/30 text-white/90 font-bold px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                  {selectedClub.category || 'Öğrenci Kulübü'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{selectedClub.name}</h1>
              <p className="text-red-100/90 mt-2 font-medium text-xs sm:text-sm max-w-2xl">
                Kulüp üyelerini, etkinlikleri, resmi başvuru belgelerini ve resmî üniversite bildirimlerini tek merkezden yönetin.
              </p>
            </div>
            
            {managedClubs.length > 1 && (
              <div className="shrink-0 bg-white/15 p-2 rounded-2xl backdrop-blur-md border border-white/20">
                <label className="block text-[10px] font-bold text-red-200 uppercase tracking-wider mb-1 px-2">Yönetilen Kulüp</label>
                <select 
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                  className="bg-white text-slate-900 font-bold text-xs rounded-xl outline-none cursor-pointer px-4 py-2 border border-white shadow-sm"
                >
                  {managedClubs.map(c => (
                    <option key={c.id} value={c.id} className="text-slate-900 font-bold">{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* KULÜP BAŞKANI YETKİ ALANLARI & ETKİLEŞİM METRİKLERİ */}
        <div className="mb-4 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800">
            <Shield size={16} className="text-[#990000]" />
            <span>Kulüp Başkanı Resmî Yetki Alanları & SKS İş Akışı</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100">Üye Onayı</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100">Duyuru & Etkinlik Yayını</span>
            <span className="px-2.5 py-1 rounded-lg bg-red-50 text-[#990000]">SKS Salon Tahsisi</span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kayıtlı Üye</span>
            <strong className="text-2xl font-black text-slate-900 mt-0.5 block">
              {selectedClub.memberCount || selectedClub.members?.length || 0}
            </strong>
            <span className="text-[11px] text-emerald-700 font-semibold">Aktif öğrenci kadrosu</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bekleyen Başvuru</span>
            <strong className="text-2xl font-black text-amber-600 mt-0.5 block">
              {combinedRequests.length}
            </strong>
            <span className="text-[11px] text-slate-600 font-semibold">Onay bekleyen aday</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kulüp Gönderileri</span>
            <strong className="text-2xl font-black text-[#990000] mt-0.5 block">
              {(selectedClub.posts || []).length}
            </strong>
            <span className="text-[11px] text-slate-600 font-semibold">Duyuru & medya</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Aktif Etkinlik</span>
            <strong className="text-2xl font-black text-blue-700 mt-0.5 block">
              {(selectedClub.events || []).filter(e => e.status !== 'cancelled').length}
            </strong>
            <span className="text-[11px] text-slate-600 font-semibold">Takvimde yayında</span>
          </div>
        </div>

        {/* TABS CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* TAB BUTTONS */}
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('requests')} 
              className={`whitespace-nowrap py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'requests' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Shield size={16}/> 
              Katılım İstekleri
              {(combinedRequests?.length > 0) && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-black animate-pulse">
                  {combinedRequests.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('post')} 
              className={`whitespace-nowrap py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'post' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Send size={16}/> Gönderi & Etkinlik Yönetimi
            </button>

            <button 
              onClick={() => setActiveTab('profile')} 
              className={`whitespace-nowrap py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'profile' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Edit3 size={16}/> Kulüp Profili & Bilgileri
            </button>

            <button 
              onClick={() => setActiveTab('members')} 
              className={`whitespace-nowrap py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'members' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Users size={16}/> Üyeler ve Yetkiler
            </button>

            <button 
              onClick={() => setActiveTab('venue_requests')} 
              className={`whitespace-nowrap py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'venue_requests' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Building2 size={16}/> 
              SKS Mekan Talepleri
              {(selectedClub.budgetRequests?.length > 0) && (
                <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold">
                  {selectedClub.budgetRequests.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('ek_forms')} 
              className={`whitespace-nowrap py-4 px-5 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'ek_forms' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <FileText size={16}/> Resmi Formlar (EK)
            </button>
          </div>

          <div className="p-6 lg:p-8">
            
            {/* 1. REQUESTS TAB */}
            {activeTab === 'requests' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 border border-emerald-200">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Bekleyen Katılım İstekleri</h3>
                      <p className="text-xs text-slate-600 font-medium">Kulübünüze katılmak isteyen öğrencileri onaylayın veya reddedin.</p>
                    </div>
                  </div>
                  {combinedRequests.length > 0 && (
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                      {combinedRequests.length} Yeni Başvuru
                    </span>
                  )}
                </div>

                {(!combinedRequests || combinedRequests.length === 0) ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Shield size={32} />
                    </div>
                    <h4 className="text-slate-900 font-bold text-base">Bekleyen Katılım İsteği Yok</h4>
                    <p className="text-slate-600 font-medium text-xs mt-1">Şu anda kulübünüze bekleyen katılım başvurusu bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {combinedRequests.map(req => {
                      const displayTc = req.tcKimlik ? `${req.tcKimlik.slice(0, 3)}*****${req.tcKimlik.slice(-2)}` : null;
                      return (
                        <div key={req.id} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-emerald-300 hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-slate-900 text-base">{req.userName || req.name}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {req.department && (
                                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                    {req.department} {req.grade ? `(${req.grade})` : ''}
                                  </span>
                                )}
                                {req.studentNo && (
                                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                    No: {req.studentNo}
                                  </span>
                                )}
                                {displayTc && (
                                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                                    TC: {displayTc}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                              {new Date(req.date || Date.now()).toLocaleDateString('tr-TR')}
                            </span>
                          </div>

                          <div className="bg-slate-50 p-3.5 rounded-xl mb-4 border border-slate-200">
                            <span className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Başvuru Motivasyonu:</span>
                            <p className="text-xs text-slate-700 font-medium italic">"{req.motivation}"</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button onClick={() => handleAcceptRequest(req)} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                              <Check size={14} /> Onayla
                            </button>
                            <button onClick={() => handleRejectRequest(req.id)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer">
                              <X size={14} /> Reddet
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. MEMBERS TAB */}
            {activeTab === 'members' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#990000] border border-red-100">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Üyeler ve Yönetim Kadrosu</h3>
                    <p className="text-xs text-slate-600 font-medium">Üye listenizi görüntüleyin ve yöneticileri atayın.</p>
                  </div>
                </div>
                
                <div className="mb-6 p-4 bg-red-50/70 border border-red-100 rounded-2xl text-xs text-red-900 font-medium flex items-start gap-3">
                  <Shield className="shrink-0 text-[#990000] mt-0.5" size={18} />
                  <p>Kulüp başkanı olarak üyelerinize "Yönetici" yetkisi verebilirsiniz. Yöneticiler, katılım isteklerini onaylayabilir ve kulüp adına gönderi ve etkinlik paylaşabilir.</p>
                </div>

                {(!selectedClub.members || selectedClub.members.length === 0) ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Users size={32} />
                    </div>
                    <h4 className="text-slate-900 font-bold text-base">Henüz onaylanmış üye bulunmuyor</h4>
                    <p className="text-slate-600 font-medium text-xs mt-1">Katılım istekleri onaylandıkça üyeleriniz burada listelenecektir.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedClub.members.map(member => {
                      const isMemberAdmin = (selectedClub.admins || []).includes(member.userId);
                      const isMemberPresident = selectedClub.presidentId === member.userId || selectedClub.president?.name === member.name;
                      
                      return (
                        <div key={member.id} className={`p-4 border rounded-2xl flex items-center justify-between transition-all ${isMemberPresident ? 'bg-amber-50/60 border-amber-200' : isMemberAdmin ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                          <div className="flex items-center gap-3">
                            <SafeAvatar 
                              src={member.avatar} 
                              name={member.name} 
                              size={40} 
                              className={`w-10 h-10 rounded-xl ${isMemberPresident ? 'ring-2 ring-amber-400' : isMemberAdmin ? 'ring-2 ring-[#990000]' : ''}`} 
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs sm:text-sm">{member.name}</p>
                              <p className="text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                                {isMemberPresident ? (
                                  <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Başkan</span>
                                ) : isMemberAdmin ? (
                                  <span className="text-[#990000] bg-red-100 px-2 py-0.5 rounded">Yönetici</span>
                                ) : (
                                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Aktif Üye</span>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          {isPresident && !isMemberPresident && (
                            <button 
                              onClick={() => handleToggleAdmin(member.userId, member.id)}
                              className={`p-2 rounded-xl transition-colors cursor-pointer ${isMemberAdmin ? 'text-[#990000] bg-red-100 hover:bg-red-200' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900'}`}
                              title={isMemberAdmin ? "Yöneticilikten Al" : "Yönetici Yap"}
                            >
                              <Shield size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SKS VENUE & EVENT REQUESTS TAB */}
            {activeTab === 'venue_requests' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#990000] border border-red-200">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">SKS Mekan & Etkinlik Tahsis Talepleri</h3>
                      <p className="text-xs text-slate-600 font-medium">Sağlık Kültür ve Spor (SKS) Daire Başkanlığı ve Öğrenci Dekanlığına iletilen resmi salon ve ekipman başvuruları.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      toast.info("Resmi Salon Tahsis Formu (EK-3) için Öğrenci Kulüpleri Portalındaki 'Etkinlik & Yer Tahsis Talebi' modalına yönlendiriliyorsunuz.");
                      if (onBack) onBack();
                    }}
                    className="bg-[#990000] hover:bg-red-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Building2 size={15} /> Yeni Salon / Etkinlik Talebi Gönder
                  </button>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">Toplam Tahsis Başvurusu</p>
                    <h4 className="text-xl font-black text-slate-900">{selectedClub.budgetRequests?.length || 0} Talep</h4>
                    <span className="text-[11px] text-slate-600 font-medium">2026-2027 Faaliyet Dönemi</span>
                  </div>
                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Tahsis Edilen Mekanlar</p>
                    <h4 className="text-xl font-black text-emerald-800">
                      {(selectedClub.budgetRequests || []).filter(r => r.status === 'approved').length} Onaylı
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-medium">SKS Daire Onayı Alındı</span>
                  </div>
                  <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Komisyon İncelemesinde</p>
                    <h4 className="text-xl font-black text-amber-800">
                      {(selectedClub.budgetRequests || []).filter(r => r.status === 'pending').length} Bekleyen
                    </h4>
                    <span className="text-[11px] text-amber-700 font-medium">Dekanlık Değerlendirmesinde</span>
                  </div>
                </div>

                {/* Venue Requests List */}
                {(!selectedClub.budgetRequests || selectedClub.budgetRequests.length === 0) ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Building2 size={32} />
                    </div>
                    <h4 className="text-slate-900 font-bold text-base">Henüz Salon/Etkinlik Talebi İletilmedi</h4>
                    <p className="text-slate-600 font-medium text-xs mt-1">Ömer Halisdemir Salonu, Amfi veya Fuaye alanı tahsisleri için talep formu oluşturabilirsiniz.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-600 tracking-wider">
                        <tr>
                          <th className="py-3.5 px-4">Etkinlik & Program Adı</th>
                          <th className="py-3.5 px-4">Talep Edilen Mekan</th>
                          <th className="py-3.5 px-4">Tarih & Saat</th>
                          <th className="py-3.5 px-4">Başvuran Yetkili</th>
                          <th className="py-3.5 px-4">SKS Durumu</th>
                          <th className="py-3.5 px-4">SKS Onay & Tahsis Notu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium bg-white">
                        {selectedClub.budgetRequests.map((req, idx) => (
                          <tr key={req.id || idx} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {req.title || req.eventName}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800">
                              <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-800">
                                <MapPin size={12} className="text-[#990000]" />
                                {req.venue || req.requestedVenue || req.location || 'Merkez Kampüs'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">
                              {req.eventDate ? `${req.eventDate} (${req.startTime || '10:00'} - ${req.endTime || '17:00'})` : (req.requestedDate || req.date || 'Belirtilmedi')}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700">
                              {req.requester || req.requesterName || 'Kulüp Başkanı'}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                req.status === 'approved' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : req.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {req.status === 'approved' ? (
                                  <><Check size={11} /> Tahsis Onaylandı</>
                                ) : req.status === 'rejected' ? (
                                  <><X size={11} /> Reddedildi</>
                                ) : (
                                  <><Clock size={11} /> SKS İncelemesinde</>
                                )}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 text-xs">
                              {req.approvalNote || 'Mekan ve teknik altyapı komisyonca değerlendiriliyor.'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-700 border border-amber-200">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Belge Deposu</h2>
                      <p className="text-xs text-slate-600 font-medium">Öğrenci Dekanlığına iletilen onaylı resmi belgeler.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toast.info('Belge yükleme ekranı açılıyor...')}
                    className="bg-[#990000] hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Yeni Belge Yükle
                  </button>
                </div>

                {(!selectedClub.forms || selectedClub.forms.length === 0) ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <FileText size={32} />
                    </div>
                    <p className="text-slate-900 font-bold text-base">Sisteme yüklenmiş herhangi bir belge bulunamadı.</p>
                    <p className="text-slate-600 font-medium text-xs mt-1">EK formları doldurulduğunda otomatik olarak burada arşivlenir.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedClub.forms.map(form => (
                      <div key={form.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">{form.type}</p>
                          <p className="text-[11px] text-slate-600 font-medium mt-1">{form.date} - Dekanlığa İletildi</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${form.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : form.status === 'Bekliyor' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                          {form.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. EK FORMS SECTION */}
            {activeTab === 'ek_forms' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-700 border border-purple-200">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Resmi Başvuru Formları (Kulüpler Mevzuatı)</h2>
                    <p className="text-xs text-slate-600 font-medium">Öğrenci Dekanlığına sunulması gereken EK-2, EK-3 ve EK-4 belgelerini doldurun.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 mb-2 group-hover:text-purple-700 text-base">EK-2: Kurucu Üye Listesi</h3>
                      <p className="text-xs text-slate-600 font-medium mb-6 line-clamp-2 leading-relaxed">Kulübün kurucu yönetim kurulu ve denetleme kurulu üyelerini sisteme işleyin.</p>
                    </div>
                    <button onClick={() => handleEKFormSubmit('EK-2 Kurucu Üye Listesi', 'EK-2 Formu dolduruldu ve sisteme kaydedildi.')} className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 group-hover:bg-purple-50 group-hover:text-purple-800 group-hover:border-purple-200 transition-colors cursor-pointer">Formu Doldur</button>
                  </div>

                  <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 mb-2 group-hover:text-purple-700 text-base">EK-3: Faaliyet Planı</h3>
                      <p className="text-xs text-slate-600 font-medium mb-6 line-clamp-2 leading-relaxed">Eğitim-Öğretim yılı içinde gerçekleştirmeyi planladığınız seminer ve etkinlikleri planlayın.</p>
                    </div>
                    <button onClick={() => handleEKFormSubmit('EK-3 Faaliyet Planı', 'EK-3 Yıllık Faaliyet planı başarıyla oluşturuldu ve onaya gönderildi.')} className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 group-hover:bg-purple-50 group-hover:text-purple-800 group-hover:border-purple-200 transition-colors cursor-pointer">Planı Oluştur</button>
                  </div>

                  <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 mb-2 group-hover:text-purple-700 text-base">EK-4: Danışman Onay Formu</h3>
                      <p className="text-xs text-slate-600 font-medium mb-6 line-clamp-2 leading-relaxed">Akademik danışmanınızın resmi onay işlemlerini başlatın ve takip edin.</p>
                    </div>
                    <button onClick={() => handleEKFormSubmit('EK-4 Danışman Onayı', 'EK-4 onayı için Akademik Danışmanınıza bildirim gönderildi.')} className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 group-hover:bg-purple-50 group-hover:text-purple-800 group-hover:border-purple-200 transition-colors cursor-pointer">Onay Talebi Gönder</button>
                  </div>

                  <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col justify-between opacity-70">
                    <div>
                      <h3 className="font-black text-slate-700 mb-2 text-base">EK-5 & EK-6 (Seçim Tutanakları)</h3>
                      <p className="text-xs text-slate-600 font-medium mb-6 line-clamp-2 leading-relaxed">Genel kurul tutanakları ve yeni dönem seçim sonuçları. Sadece resmî seçim döneminde aktif olur.</p>
                    </div>
                    <button disabled className="w-full py-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed">Seçim Dönemi Dışı</button>
                  </div>
                </div>
              </div>
            )}
            
            {/* CLUB PROFILE & DETAILS EDIT TAB */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveClubProfile} className="animate-fade-in max-w-3xl space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#990000] border border-red-100">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Kulüp Profili & Kurumsal Bilgileri</h3>
                    <p className="text-xs text-slate-600 font-medium">Kulübünüzün rehberde, profil sayfasında ve keşfet vitrininde görünen bilgilerini güncelleyin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kulüp Resmî Adı *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                    <select
                      value={profileForm.category}
                      onChange={(e) => setProfileForm({ ...profileForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                    >
                      <option>Bilim & Teknoloji</option>
                      <option>Girişimcilik & İnovasyon</option>
                      <option>Kültür & Sanat</option>
                      <option>Mühendislik & Robotik</option>
                      <option>Sosyal Sorumluluk & Yaşam</option>
                      <option>Spor & Sağlık</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kulüp Açıklaması & Tanıtım Metni</label>
                  <textarea
                    rows={3}
                    value={profileForm.description}
                    onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kuruluş Amacı & Misyon</label>
                  <input
                    type="text"
                    value={profileForm.purpose}
                    onChange={(e) => setProfileForm({ ...profileForm, purpose: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Akademik Danışman</label>
                    <input
                      type="text"
                      value={profileForm.advisor}
                      onChange={(e) => setProfileForm({ ...profileForm, advisor: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kulüp İletişim E-postası</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Logo Görsel URL</label>
                    <input
                      type="url"
                      value={profileForm.logo}
                      onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kapak Görseli URL</label>
                    <input
                      type="url"
                      value={profileForm.coverImage}
                      onChange={(e) => setProfileForm({ ...profileForm, coverImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#990000] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Kulüp Bilgilerini Kaydet
                  </button>
                </div>
              </form>
            )}
            
            {/* 5. POST & EVENT MANAGEMENT TAB */}
            {activeTab === 'post' && (
              <div className="animate-fade-in space-y-8">
                <form onSubmit={handleCreatePost} className="max-w-3xl bg-slate-50/70 p-6 rounded-2xl border border-slate-200/90 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#990000] border border-red-100">
                        <Megaphone size={20} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900">Yeni Kulüp Duyurusu veya Etkinlik Yayınla</h3>
                        <p className="text-xs text-slate-600 font-medium">Yayınlanan içerikler kulüp sayfasında, üye akışlarında ve Keşfet vitrininde senkronize görünür.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setPublishMode('post')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          publishMode === 'post' ? 'bg-[#990000] text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Gönderi / Duyuru
                      </button>
                      <button
                        type="button"
                        onClick={() => setPublishMode('event')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          publishMode === 'event' ? 'bg-[#990000] text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Takvim Etkinliği
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Görünürlük Kapsamı</label>
                      <select
                        value={postVisibility}
                        onChange={(e) => setPostVisibility(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#990000]"
                      >
                        <option value="public">🌐 Herkese Açık (Keşfet & Tüm Kampüs Akışı)</option>
                        <option value="members_only">🔒 Sadece Kulüp Üyelerine Özel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Yayın Durumu</label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-[#990000]"
                      >
                        <option value="published">✅ Hemen Yayınla</option>
                        <option value="draft">📝 Taslak Olarak Kaydet (Akışta Gizli)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        {publishMode === 'event' ? 'Etkinlik Adı *' : 'Gönderi / Duyuru Başlığı *'}
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          setPostTitle(publishMode === 'event' ? 'Yeni Dönem Teknoloji & Kariyer Atölyesi' : 'Yeni Dönem Tanışma Toplantısı Duyurusu');
                          setPostContent('Merhaba Değerli Üyelerimiz,\n\nYeni döneme harika bir başlangıç yapmak için bir araya geliyoruz! Bu etkinlikte yıllık proje takvimimizi paylaşacak ve çalışma takımlarımızı oluşturacağız.\n\nTüm üyelerimizi ve ilgilenen öğrenci arkadaşlarımızı bekliyoruz!');
                          setPostLocation('Ömer Halisdemir Konferans Salonu');
                        }}
                        className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition flex items-center gap-1 border border-emerald-200 cursor-pointer"
                      >
                        <Sparkles size={12} /> Örnek Şablon Doldur
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={postTitle} 
                      onChange={(e) => setPostTitle(e.target.value)} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#990000] outline-none" 
                      placeholder={publishMode === 'event' ? 'Örn: Yapay Zeka & Prompt Mühendisliği Atölyesi' : 'Örn: Yeni Dönem Tanışma Toplantısı!'} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">İçerik ve Detaylar *</label>
                    <textarea 
                      value={postContent} 
                      onChange={(e) => setPostContent(e.target.value)} 
                      rows={4} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#990000] outline-none resize-none" 
                      placeholder="Kulüp üyeleri ve öğrencilerle paylaşmak istediğiniz detayları yazın..." 
                    />
                  </div>

                  {publishMode === 'event' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Etkinlik Tarihi</label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#990000]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Başlangıç Saati</label>
                        <input
                          type="time"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#990000]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin size={13} className="text-[#990000]"/> Konum / Salon
                      </label>
                      <input 
                        type="text" 
                        value={postLocation} 
                        onChange={(e) => setPostLocation(e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#990000] outline-none" 
                        placeholder="Örn: C Blok Konferans Salonu" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <ImageIcon size={13} className="text-[#990000]"/> Görsel URL (Opsiyonel)
                      </label>
                      <input 
                        type="url" 
                        value={postImage} 
                        onChange={(e) => setPostImage(e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#990000] outline-none" 
                        placeholder="https://images.unsplash.com/..." 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#990000] hover:bg-red-800 text-white rounded-xl py-3 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-red-900/10 cursor-pointer"
                  >
                    <Send size={16} />
                    {publishMode === 'event' ? 'Etkinliği Yayınla & Takvime İşle' : 'Kulüp Gönderisini Yayınla'}
                  </button>
                </form>

                {/* EXISTING CLUB POSTS & EVENTS MANAGEMENT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <Megaphone size={16} className="text-[#990000]" />
                      Kulüp Gönderileri & Duyuruları ({(selectedClub.posts || []).length})
                    </h4>
                    {(selectedClub.posts || []).length === 0 ? (
                      <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">Henüz kulüp gönderisi paylaşılmamış.</p>
                    ) : (
                      (selectedClub.posts || []).map(p => (
                        <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                p.visibility === 'members_only' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}>
                                {p.visibility === 'members_only' ? 'Üyelere Özel' : 'Herkese Açık'}
                              </span>
                              {p.status === 'draft' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Taslak</span>
                              )}
                              <span className="text-[10px] text-slate-400 font-semibold">{p.createdAt || 'Yeni'}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 line-clamp-2">{p.caption || p.content || p.title}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteClubPost(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                            title="Gönderiyi Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <Calendar size={16} className="text-[#990000]" />
                      Kulüp Etkinlikleri ({(selectedClub.events || []).length})
                    </h4>
                    {(selectedClub.events || []).length === 0 ? (
                      <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">Henüz kulüp etkinliği planlanmamış.</p>
                    ) : (
                      (selectedClub.events || []).map(ev => (
                        <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ev.status === 'cancelled'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {ev.status === 'cancelled' ? 'İptal Edildi' : 'Aktif Etkinlik'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold">{ev.date} {ev.time ? `• ${ev.time}` : ''}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-900 truncate">{ev.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">{ev.location || 'Kampüs'}</p>
                          </div>
                          {ev.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => handleCancelClubEvent(ev.id)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition cursor-pointer shrink-0"
                            >
                              İptal Et
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* 3. SUBPANEL FLOATING DOCK */}
      {setView && (
        <SubPanelFloatingDock 
          currentView="club_admin" 
          setView={setView} 
          currentUser={currentUser} 
          userRole={userRole} 
        />
      )}
    </div>
  );
}
