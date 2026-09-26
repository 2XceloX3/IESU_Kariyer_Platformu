import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Users, Check, X, Megaphone, MapPin, Send, FileText, 
  Image as ImageIcon, ArrowLeft, Building2, CheckCircle2, 
  Clock, Award, ChevronRight, UserCheck, AlertCircle, Sparkles
} from 'lucide-react';
import Logo from './Logo';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';
import { toast } from './shared/Toast';

export default function ClubAdminPanel({ 
  currentUser, 
  setView, 
  userRole = 'student', 
  previousView = 'club_portal' 
}) {
  const { clubs, setClubs, events, setEvents } = useAppStore();
  
  // 1. Yetkilendirme Mantık Kontrolü
  // managedClubs içinde, kullanıcının id veya ismine göre başkan/admin olup olmadığını tam kontrol ediyoruz.
  const managedClubs = useMemo(() => {
    if (currentUser?.role === 'admin') return clubs || []; // Süper Admin tüm kulüpleri yönetebilir
    return (clubs || []).filter(c => 
      c.presidentId === currentUser?.id || 
      c.president?.name === currentUser?.name || 
      (c.admins && c.admins.includes(currentUser?.id))
    );
  }, [clubs, currentUser]);

  // 2. Stale State Düzeltmesi: managedClubs değiştiğinde selectedClubId güncellenir.
  const [selectedClubId, setSelectedClubId] = useState(managedClubs.length > 0 ? managedClubs[0].id : null);
  
  useEffect(() => {
    if (managedClubs.length > 0 && (!selectedClubId || !managedClubs.find(c => c.id === selectedClubId))) {
      setSelectedClubId(managedClubs[0].id);
    }
  }, [managedClubs, selectedClubId]);

  const [activeTab, setActiveTab] = useState('requests');
  
  // Post states
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postImage, setPostImage] = useState('');

  const selectedClub = useMemo(() => {
    return (clubs || []).find(c => c.id === selectedClubId) || managedClubs[0] || {};
  }, [clubs, selectedClubId, managedClubs]);

  if (managedClubs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        {/* Navigation Header */}
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
                <div className="w-7 h-7 rounded-full bg-[#990000] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'Y'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{currentUser?.name || 'Kulüp Yöneticisi'}</p>
                  <p className="text-[10px] font-bold text-emerald-700 mt-0.5">{currentUser?.role === 'admin' ? 'Süper Admin' : 'Öğrenci'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State Body */}
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 animate-fade-in text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-center text-amber-600 mb-5 shadow-sm">
            <Shield size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Yönetim Yetkiniz Bulunmuyor</h2>
          <p className="text-sm font-medium text-slate-600 mt-2 max-w-md leading-relaxed">
            Herhangi bir öğrenci kulübünün başkanı veya yetkili yöneticisi değilsiniz. Yeni bir kulüp kurmak için EK-1 başvurusunda bulunabilir veya mevcut kulüpleri inceleyebilirsiniz.
          </p>
          <button
            onClick={() => {
              if (setView) setView(previousView || 'club_portal');
            }}
            className="mt-6 px-6 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-red-900/10 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Kulüpler Portalına Dön
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
          userId: req.userId || req.id,
          name: req.userName || req.name || 'İsimsiz Üye',
          department: req.department || '',
          joinedAt: new Date().toISOString()
        };
        const newMembers = [...(c.members || []), newMember];
        const newRequests = (c.memberRequests || []).filter(r => r.id !== req.id);
        return { ...c, members: newMembers, memberRequests: newRequests, memberCount: (c.memberCount || 0) + 1 };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.success(`${req.userName || req.name || 'Öğrenci'} kulübe kabul edildi.`);
  };

  const handleRejectRequest = (reqId) => {
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        const newRequests = (c.memberRequests || []).filter(r => r.id !== reqId);
        return { ...c, memberRequests: newRequests };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.info('Üyelik isteği reddedildi.');
  };

  const handleToggleAdmin = (userId) => {
    if (!isPresident) {
      toast.error('Sadece kulüp başkanı yetki verebilir!');
      return;
    }
    if (!userId) {
      toast.error('Kullanıcı kimliği bulunamadı.');
      return;
    }
    
    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        const currentAdmins = c.admins || [];
        const isAlreadyAdmin = currentAdmins.includes(userId);
        
        let newAdmins;
        if (isAlreadyAdmin) {
          newAdmins = currentAdmins.filter(id => id !== userId);
          toast.info('Yönetici yetkisi alındı.');
        } else {
          newAdmins = [...currentAdmins, userId];
          toast.success('Yönetici yetkisi verildi.');
        }
        
        return { ...c, admins: newAdmins };
      }
      return c;
    });
    setClubs(updatedClubs);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      toast.error('Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    const newEvent = {
      id: 'EVT-' + Date.now(),
      title: postTitle,
      description: postContent,
      location: postLocation || 'Kampüs İçi',
      date: new Date().toISOString().split('T')[0],
      organizer: selectedClub.name,
      organizerId: selectedClub.id,
      image: postImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      attendees: 0
    };

    if (setEvents) {
      setEvents(prev => [newEvent, ...(prev || [])]);
    }
    toast.success('Gönderi ve Etkinlik başarıyla paylaşıldı!');
    
    setPostTitle('');
    setPostContent('');
    setPostLocation('');
    setPostImage('');
    setActiveTab('requests');
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
              <div className="w-7 h-7 rounded-full bg-[#990000] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'Y'}
              </div>
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
        <div className="mb-8 bg-gradient-to-r from-red-950 via-[#990000] to-rose-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-red-800/40">
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
                Kulüp üyelerini, etkinlikleri, resmi başvuru belgelerini ve SKS bildirimlerini tek merkezden yönetin.
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

        {/* TABS CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* TAB BUTTONS */}
          <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('requests')} 
              className={`whitespace-nowrap py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'requests' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Shield size={16}/> 
              Katılım İstekleri
              {(selectedClub.memberRequests?.length > 0) && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 font-black animate-pulse">
                  {selectedClub.memberRequests.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('members')} 
              className={`whitespace-nowrap py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'members' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Users size={16}/> Üyeler ve Yetkiler
            </button>

            <button 
              onClick={() => setActiveTab('documents')} 
              className={`whitespace-nowrap py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'documents' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <FileText size={16}/> Belge Deposu
            </button>

            <button 
              onClick={() => setActiveTab('ek_forms')} 
              className={`whitespace-nowrap py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'ek_forms' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <FileText size={16}/> Resmi Başvuru Formları (EK)
            </button>

            <button 
              onClick={() => setActiveTab('post')} 
              className={`whitespace-nowrap py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'post' 
                  ? 'border-[#990000] text-[#990000] bg-white font-black' 
                  : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Send size={16}/> Gönderi & Etkinlik Paylaş
            </button>
          </div>

          <div className="p-6 lg:p-8">
            
            {/* 1. REQUESTS TAB */}
            {activeTab === 'requests' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 border border-emerald-200">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Bekleyen Katılım İstekleri</h3>
                    <p className="text-xs text-slate-600 font-medium">Kulübünüze katılmak isteyen öğrencileri onaylayın veya reddedin.</p>
                  </div>
                </div>

                {(!selectedClub.memberRequests || selectedClub.memberRequests.length === 0) ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Shield size={32} />
                    </div>
                    <h4 className="text-slate-900 font-bold text-base">Bekleyen Katılım İsteği Yok</h4>
                    <p className="text-slate-600 font-medium text-xs mt-1">Şu anda kulübünüze bekleyen katılım başvurusu bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedClub.memberRequests.map(req => (
                      <div key={req.id} className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-emerald-300 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{req.userName || req.name}</h4>
                            <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 inline-block px-2.5 py-1 rounded-md mt-1">{req.department}</p>
                          </div>
                          <span className="text-[10px] text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-md">{new Date(req.date || Date.now()).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="bg-slate-50 p-3.5 rounded-xl mb-4 border border-slate-200">
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
                    ))}
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs ${isMemberPresident ? 'bg-amber-500' : isMemberAdmin ? 'bg-[#990000]' : 'bg-slate-400'}`}>
                              {member.name ? member.name.charAt(0).toUpperCase() : 'Ü'}
                            </div>
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
                              onClick={() => handleToggleAdmin(member.userId)}
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
                      <p className="text-xs text-slate-600 font-medium">SKS Daire Başkanlığına iletilen onaylı resmi belgeler.</p>
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
                    <h2 className="text-lg font-black text-slate-900">Resmi Başvuru Formları (SKS Mevzuatı)</h2>
                    <p className="text-xs text-slate-600 font-medium">Öğrenci Dekanlığı ve SKS Başkanlığına sunulması gereken EK-2, EK-3 ve EK-4 belgelerini doldurun.</p>
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
            
            {/* 5. POST TAB */}
            {activeTab === 'post' && (
              <form onSubmit={handleCreatePost} className="animate-fade-in max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#990000] border border-red-100">
                    <Megaphone size={20} />
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Gönderi ve Etkinlik Paylaş</h3>
                      <p className="text-xs text-slate-600 font-medium">Kulüp adına duyuru, etkinlik veya haber yayınlayın.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        toast.info("Taslak Metin Oluşturuluyor...");
                        setTimeout(() => {
                          setPostTitle(prev => prev || 'Yeni Dönem Tanışma Toplantısı');
                          setPostContent('Merhaba Değerli Üyelerimiz,\n\nYeni döneme harika bir başlangıç yapmak için bir araya geliyoruz! Bu toplantıda yıllık planlarımızı konuşacak, vizyonumuzu paylaşacak ve sürpriz etkinliklerimizi duyuracağız.\n\nHerkesi bekliyoruz!');
                          setPostLocation('G Blok Konferans Salonu');
                        }, 500);
                      }}
                      className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition flex items-center gap-1.5 border border-emerald-200 shadow-2xs cursor-pointer"
                    >
                      <Sparkles size={13} /> Şablon Doldur
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Gönderi Başlığı</label>
                    <input 
                      type="text" 
                      value={postTitle} 
                      onChange={(e) => setPostTitle(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] transition-all outline-none" 
                      placeholder="Örn: Yeni Dönem Tanışma Toplantısı!" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">İçerik Metni</label>
                    <textarea 
                      value={postContent} 
                      onChange={(e) => setPostContent(e.target.value)} 
                      rows={5} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] transition-all outline-none resize-none" 
                      placeholder="Kulüp üyeleri ve öğrencilerle paylaşmak istediğiniz mesajınızı yazın..." 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1">
                        <MapPin size={13} className="text-[#990000]"/> Konum (Opsiyonel)
                      </label>
                      <input 
                        type="text" 
                        value={postLocation} 
                        onChange={(e) => setPostLocation(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] transition-all outline-none" 
                        placeholder="Örn: C Blok Konferans Salonu" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1">
                        <ImageIcon size={13} className="text-[#990000]"/> Görsel URL (Opsiyonel)
                      </label>
                      <input 
                        type="url" 
                        value={postImage} 
                        onChange={(e) => setPostImage(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] transition-all outline-none" 
                        placeholder="https://images.unsplash.com/..." 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#990000] hover:bg-red-800 text-white rounded-2xl py-3.5 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-red-900/10 mt-3 cursor-pointer"
                  >
                    <Send size={16} /> Gönderiyi Yayınla
                  </button>
                </div>
              </form>
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
