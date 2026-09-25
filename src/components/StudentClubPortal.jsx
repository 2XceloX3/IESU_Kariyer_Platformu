import React, { useState, useMemo } from 'react';
import { 
  Users, Trophy, FileText, ChevronRight, CheckCircle2, 
  XCircle, Clock, Plus, Search, Building2, Calendar, 
  Wallet, ShieldCheck, MapPin, Activity, ArrowLeft, X, Bell,
  Zap, Heart, MessageCircle, Share2, Play, Pause, Download, Sparkles,
  Filter, ExternalLink, Mail, Phone, Check, Award, Lock, Music,
  Sliders, Camera, ChevronLeft, Bookmark, CornerDownRight, Send, UserCheck
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import { toast } from './shared/Toast';
import useAppStore from '../store/useAppStore';
import { initialClubs, initialClubApplications } from '../data/mockClubsData';

export default function StudentClubPortal({ 
  currentUser, 
  setView, 
  previousView, 
  setSelectedUserId, 
  userRole = 'student' 
}) {
  const { clubs, setClubs, clubApplications, setClubApplications } = useAppStore();
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'my_clubs' | 'admin'
  const [clubDetailTab, setClubDetailTab] = useState('overview'); // 'overview' | 'events' | 'board' | 'venue_requests' | 'members'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [showApplyMemberModal, setShowApplyMemberModal] = useState(false);
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [assignRoleModalMember, setAssignRoleModalMember] = useState(null);
  const [newAssignedRole, setNewAssignedRole] = useState('Mali Sorumlu');

  // Media / Instagram State
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postComments, setPostComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [activeImageIndices, setActiveImageIndices] = useState({});
  const [heartAnimId, setHeartAnimId] = useState(null);

  // Forms
  const [createForm, setCreateForm] = useState({ 
    name: '', 
    category: 'Bilim ve Teknoloji', 
    description: '', 
    purpose: '', 
    advisor: '' 
  });

  const [venueForm, setVenueForm] = useState({
    title: '',
    venue: 'Ömer Halisdemir Konferans Salonu & Fuaye',
    customVenue: '',
    eventDate: '',
    startTime: '10:00',
    endTime: '17:00',
    setupTime: '09:00',
    expectedAttendees: 100,
    equipment: ['Ses Sistemi & Kürsü Mikrofonu', 'Çift Projeksiyon & HDMI'],
    customEquipment: '',
    purpose: '',
    description: ''
  });

  const [applyMemberForm, setApplyMemberForm] = useState({
    name: currentUser?.name || '',
    studentNo: currentUser?.studentNo || '2024010891',
    tcKimlik: currentUser?.tcKimlik || '39281749102',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    grade: currentUser?.year || currentUser?.grade || '2. Sınıf',
    phone: currentUser?.phone || '0532 000 1122',
    email: currentUser?.email || 'ogrenci@ogr.esenyurt.edu.tr',
    reason: '',
    kvkkAccepted: true
  });

  const [postForm, setPostForm] = useState({
    caption: '',
    location: 'İESÜ Ömer Halisdemir Konferans Salonu',
    images: ['https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1000&q=80'],
    filter: 'vibrant',
    musicTitle: 'Campus Synthwave & Tech Beats',
    musicArtist: 'İESÜ Sound Studio'
  });

  const isAdmin = currentUser?.role === 'admin';
  const isDean = currentUser?.title?.toLowerCase().includes('dekan');
  
  // Use global clubs & clubApplications, fall back to rich sample clubs
  const clubList = useMemo(() => (clubs && clubs.length > 0) ? clubs : initialClubs, [clubs]);
  const applications = useMemo(() => (clubApplications && clubApplications.length > 0) ? clubApplications : initialClubApplications, [clubApplications]);

  const myManagedClubs = useMemo(() => (clubList || []).filter(c => 
    c.presidentId === currentUser?.id || 
    c.president?.email === currentUser?.email ||
    (c.authorizedOfficers || []).some(o => o.id === currentUser?.id || o.email === currentUser?.email) ||
    (c.admins || []).includes(currentUser?.id)
  ), [clubList, currentUser]);

  const myJoinedClubs = useMemo(() => (clubList || []).filter(c => 
    (c.members || []).some(m => m.id === currentUser?.id || m.email === currentUser?.email || m.name === currentUser?.name)
  ), [clubList, currentUser]);

  const filteredClubs = useMemo(() => (clubList || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ), [clubList, searchQuery]);

  // Authorization Check: President, Vice President, Secretary, Financial Officer
  const isAuthorizedOfficer = (club) => {
    if (!club || !currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (club.presidentId === currentUser.id || club.president?.email === currentUser.email) return true;
    if ((club.authorizedOfficers || []).some(o => o.id === currentUser.id || o.email === currentUser.email)) return true;
    if ((club.boardMembers || []).some(b => (b.id === currentUser.id || b.email === currentUser.email) && (
      b.role?.toLowerCase().includes('başkan') || 
      b.role?.toLowerCase().includes('sekreter') || 
      b.role?.toLowerCase().includes('mali') || 
      b.role?.toLowerCase().includes('sorumlu')
    ))) return true;
    return false;
  };

  const isMemberOfClub = (club) => (club.members || []).some(m => 
    m.id === currentUser?.id || m.email === currentUser?.email || m.name === currentUser?.name
  );

  const hasPendingRequest = (club) => (
    (club.memberRequests || []).some(r => r.userId === currentUser?.id && r.status === 'pending') ||
    (club.memberApplications || []).some(a => (a.studentId === currentUser?.id || a.email === currentUser?.email) && a.status === 'pending')
  );

  // Trigger SKS Venue & Request Modal (with permission gate)
  const handleOpenVenueModal = () => {
    if (!selectedClub) return;
    if (isAuthorizedOfficer(selectedClub)) {
      setShowVenueModal(true);
    } else {
      setShowUnauthorizedModal(true);
    }
  };

  // Submit Detailed Membership Application Form
  const handleSubmitMemberApplication = (e) => {
    e.preventDefault();
    if (!applyMemberForm.studentNo || !applyMemberForm.tcKimlik) {
      toast.error('Lütfen Öğrenci No ve T.C. Kimlik numaranızı eksiksiz giriniz.');
      return;
    }
    if (applyMemberForm.tcKimlik.length !== 11) {
      toast.error('T.C. Kimlik Numarası 11 haneli olmalıdır.');
      return;
    }

    const newApp = {
      id: 'APP-MEM-' + Date.now().toString(),
      studentId: currentUser?.id || 'STU-' + Date.now(),
      studentNo: applyMemberForm.studentNo,
      tcKimlik: applyMemberForm.tcKimlik,
      name: applyMemberForm.name,
      department: applyMemberForm.department,
      grade: applyMemberForm.grade,
      email: applyMemberForm.email,
      phone: applyMemberForm.phone,
      reason: applyMemberForm.reason,
      appliedAt: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'pending'
    };

    const updatedClub = {
      ...selectedClub,
      memberApplications: [newApp, ...(selectedClub.memberApplications || [])],
      memberRequests: [...(selectedClub.memberRequests || []), { userId: currentUser?.id, status: 'pending' }]
    };

    setSelectedClub(updatedClub);
    if (setClubs) {
      setClubs(prev => (prev || []).map(c => c.id === selectedClub.id ? updatedClub : c));
    }

    setShowApplyMemberModal(false);
    toast.success(`"${selectedClub.name}" kulübüne üyelik başvurunuz T.C. ve Öğrenci No ile kulüp başkanlığına iletildi!`);
  };

  // President / Officer: Approve Member Application
  const handleApproveMemberApplication = (appId) => {
    if (!selectedClub) return;
    const targetApp = (selectedClub.memberApplications || []).find(a => a.id === appId);
    if (!targetApp) return;

    const newMember = {
      id: targetApp.studentId,
      studentNo: targetApp.studentNo,
      tcKimlik: targetApp.tcKimlik,
      name: targetApp.name,
      department: targetApp.department,
      grade: targetApp.grade,
      role: 'Aktif Üye',
      phone: targetApp.phone,
      email: targetApp.email,
      joinedDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Aktif'
    };

    const updatedMembers = [newMember, ...(selectedClub.members || [])];
    const updatedApps = (selectedClub.memberApplications || []).filter(a => a.id !== appId);

    const updatedClub = {
      ...selectedClub,
      members: updatedMembers,
      memberApplications: updatedApps,
      memberCount: (selectedClub.memberCount || updatedMembers.length) + 1
    };

    setSelectedClub(updatedClub);
    if (setClubs) {
      setClubs(prev => (prev || []).map(c => c.id === selectedClub.id ? updatedClub : c));
    }

    toast.success(`"${targetApp.name}" kulüp üyeliğine kabul edildi!`);
  };

  // President / Officer: Reject Member Application
  const handleRejectMemberApplication = (appId) => {
    if (!selectedClub) return;
    const updatedApps = (selectedClub.memberApplications || []).filter(a => a.id !== appId);
    const updatedClub = {
      ...selectedClub,
      memberApplications: updatedApps
    };
    setSelectedClub(updatedClub);
    if (setClubs) {
      setClubs(prev => (prev || []).map(c => c.id === selectedClub.id ? updatedClub : c));
    }
    toast.error('Üyelik başvurusu reddedildi.');
  };

  // President: Assign Officer Role to Member
  const handleAssignRole = () => {
    if (!selectedClub || !assignRoleModalMember) return;
    const updatedMembers = (selectedClub.members || []).map(m => 
      m.id === assignRoleModalMember.id ? { ...m, role: newAssignedRole } : m
    );
    const updatedOfficers = [
      ...(selectedClub.authorizedOfficers || []),
      { id: assignRoleModalMember.id, name: assignRoleModalMember.name, role: newAssignedRole, email: assignRoleModalMember.email }
    ];

    const updatedClub = {
      ...selectedClub,
      members: updatedMembers,
      authorizedOfficers: updatedOfficers
    };

    setSelectedClub(updatedClub);
    if (setClubs) {
      setClubs(prev => (prev || []).map(c => c.id === selectedClub.id ? updatedClub : c));
    }

    setAssignRoleModalMember(null);
    toast.success(`${assignRoleModalMember.name} öğrencisine "${newAssignedRole}" yetkisi atandı.`);
  };

  // Submit SKS Venue & Request Form (NO MONEY INPUT)
  const handleVenueSubmit = (e) => {
    e.preventDefault();
    const finalVenue = venueForm.venue === 'Diğer (Özel Alan)' ? venueForm.customVenue : venueForm.venue;
    const finalEquipment = [...venueForm.equipment];
    if (venueForm.customEquipment) {
      finalEquipment.push(venueForm.customEquipment);
    }

    const newApp = {
      id: 'REQ-' + Date.now().toString(),
      type: 'event_budget',
      title: venueForm.title,
      eventName: venueForm.title,
      club: selectedClub?.name || 'Kulübüm',
      venue: finalVenue,
      requestedVenue: finalVenue,
      eventDate: venueForm.eventDate,
      startTime: venueForm.startTime,
      endTime: venueForm.endTime,
      setupTime: venueForm.setupTime,
      expectedAttendees: venueForm.expectedAttendees,
      equipment: finalEquipment,
      requesterName: currentUser?.name || 'Kulüp Yetkilisi',
      requesterRole: isAuthorizedOfficer(selectedClub) ? 'Kulüp Yönetim Kurulu' : 'Öğrenci',
      status: 'pending',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      requestedDate: new Date().toLocaleDateString('tr-TR'),
      description: venueForm.description || venueForm.purpose || '',
      approvalNote: 'SKS Daire Başkanlığı salon ve ekipman incelemesinde.'
    };

    const updatedApps = [newApp, ...(clubApplications || [])];
    if (setClubApplications) {
      setClubApplications(updatedApps);
    }

    if (selectedClub) {
      const updatedClub = {
        ...selectedClub,
        budgetRequests: [newApp, ...(selectedClub.budgetRequests || [])]
      };
      setSelectedClub(updatedClub);
      if (setClubs) {
        setClubs(prev => (prev || []).map(c => c.id === selectedClub.id ? updatedClub : c));
      }
    }

    setShowVenueModal(false);
    setVenueForm({
      title: '',
      venue: 'Ömer Halisdemir Konferans Salonu & Fuaye',
      customVenue: '',
      eventDate: '',
      startTime: '10:00',
      endTime: '17:00',
      setupTime: '09:00',
      expectedAttendees: 100,
      equipment: ['Ses Sistemi & Kürsü Mikrofonu'],
      customEquipment: '',
      purpose: '',
      description: ''
    });

    toast.success('Salon ve etkinlik tahsis talebiniz SKS Daire Başkanlığına iletildi! Bütçe ve teknik onay birim tarafından verilecektir.');
  };

  // Create New Instagram-Style Post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!selectedClub) return;

    const newPost = {
      id: 'POST-CLB-' + Date.now().toString(),
      author: {
        name: selectedClub.name,
        handle: `@${selectedClub.shortName?.toLowerCase() || 'iesukulup'}`,
        logo: selectedClub.logo || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=250&q=80',
        verified: true
      },
      location: postForm.location,
      images: postForm.images.filter(Boolean),
      filter: postForm.filter,
      music: {
        title: postForm.musicTitle,
        artist: postForm.musicArtist,
        duration: '02:40'
      },
      caption: postForm.caption,
      likes: 1,
      isLiked: true,
      comments: [],
      shares: 0,
      saved: false,
      createdAt: 'Az önce'
    };

    const updatedPosts = [newPost, ...(selectedClub.posts || [])];
    const updatedClub = {
      ...selectedClub,
      posts: updatedPosts
    };

    setSelectedClub(updatedClub);
    if (setClubs) {
      setClubs(prev => (prev || []).map(c => c.id === selectedClub.id ? updatedClub : c));
    }

    setShowCreatePostModal(false);
    setPostForm({
      caption: '',
      location: 'İESÜ Ömer Halisdemir Konferans Salonu',
      images: ['https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1000&q=80'],
      filter: 'vibrant',
      musicTitle: 'Campus Synthwave & Tech Beats',
      musicArtist: 'İESÜ Sound Studio'
    });

    toast.success('Kulüp etkinliği Instagram formatında başarıyla paylaşıldı!');
  };

  // Toggle Post Like with animated heart
  const handleToggleLike = (postId) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        setHeartAnimId(postId);
        setTimeout(() => setHeartAnimId(null), 900);
      }
      return next;
    });
  };

  // Add Comment to Post
  const handleAddComment = (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      user: currentUser?.id || 'ogrenci',
      name: currentUser?.name || 'Öğrenci',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      text,
      time: 'Şimdi'
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setNewCommentText(prev => ({ ...prev, [postId]: '' }));
    toast.success('Yorumunuz paylaşıldı!');
  };

  // Toggle Audio Playing
  const handleToggleAudio = (postId) => {
    if (playingAudioId === postId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(postId);
      toast.info('🎵 Müzik ambiyansı çalınıyor...');
    }
  };

  // Carousel Next/Prev image
  const handleSlideImage = (postId, totalImages, direction) => {
    setActiveImageIndices(prev => {
      const current = prev[postId] || 0;
      let next = current + direction;
      if (next < 0) next = totalImages - 1;
      if (next >= totalImages) next = 0;
      return { ...prev, [postId]: next };
    });
  };

  // Filter CSS style map
  const getFilterClass = (filterName) => {
    switch (filterName) {
      case 'vibrant': return 'contrast-110 saturate-125 brightness-105';
      case 'cyber': return 'hue-rotate-15 contrast-125 saturate-150';
      case 'vintage': return 'sepia-[0.25] contrast-105 brightness-95';
      case 'cinema': return 'contrast-120 saturate-110 brightness-90';
      default: return '';
    }
  };

  // Equipment toggle in venue modal
  const handleToggleEquipment = (item) => {
    setVenueForm(prev => {
      const exists = prev.equipment.includes(item);
      return {
        ...prev,
        equipment: exists 
          ? prev.equipment.filter(e => e !== item)
          : [...prev.equipment, item]
      };
    });
  };

  // ==============================================================
  // RENDER: SINGLE CLUB VIEW
  // ==============================================================
  if (selectedClub) {
    const userIsMember = isMemberOfClub(selectedClub);
    const userHasPending = hasPendingRequest(selectedClub);
    const authorized = isAuthorizedOfficer(selectedClub);
    const clubPosts = selectedClub.posts || [];
    const clubHighlights = selectedClub.highlights || [];
    const pendingMemberApps = selectedClub.memberApplications || [];

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-28 animate-fade-in">
        
        {/* NEW PROFESSIONAL CLUB PROFILE HEADER */}
        <div className="h-64 relative bg-red-950 border-b border-slate-200">
           <button 
             onClick={() => setSelectedClub(null)} 
             className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full transition-colors z-20 cursor-pointer shadow-md"
             title="Kulüp Listesine Dön"
           >
             <ArrowLeft size={20} />
           </button>
           {selectedClub.coverImage && (
             <img src={selectedClub.coverImage} alt={selectedClub.name} className="w-full h-full object-cover opacity-60" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/40 to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative -mt-20 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden shrink-0">
                {selectedClub.logo ? <img src={selectedClub.logo} alt={selectedClub.name} className="w-full h-full object-cover" /> : <Building2 size={48} className="text-slate-300" />}
              </div>
              <div className="pb-2">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-400/20 backdrop-blur px-2.5 py-1 rounded-md uppercase tracking-wider">{selectedClub.category || 'Kulüp'}</span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1"><Users size={14}/> {selectedClub.memberCount || (selectedClub.members?.length || 0)} Üye</span>
                  {authorized && (
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 backdrop-blur px-2.5 py-1 rounded-md flex items-center gap-1 border border-amber-300/30">
                      <ShieldCheck size={14} /> Yetkili Yönetici
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-white">{selectedClub.name}</h1>
              </div>
            </div>
            
            <div className="pb-2 flex gap-3 flex-wrap">
              {userIsMember ? (
                 <span className="px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl shadow-md flex items-center justify-center gap-2 border border-emerald-200">
                   <CheckCircle2 size={18} className="text-emerald-500" /> Üyesiniz
                 </span>
               ) : userHasPending ? (
                 <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                   <Clock size={18} /> Başvurunuz İncelemede
                 </button>
               ) : (
                 <button 
                   onClick={() => setShowApplyMemberModal(true)}
                   className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                 >
                   <Plus size={18}/> Kulübe Başvur & Katıl
                 </button>
               )}

              {/* SKS Venue Request Action Button */}
              <button
                onClick={handleOpenVenueModal}
                className="px-6 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Calendar size={18} /> Etkinlik & Yer Tahsis Talebi
              </button>
            </div>
          </div>

          {/* CLUB DETAIL SUB-TABS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-6 shadow-xs flex gap-2 overflow-x-auto hide-scrollbar">
            {[
              { id: 'overview', label: 'Genel Bakış & Medya Akışı', icon: Activity },
              { id: 'events', label: `Etkinlikler (${selectedClub.events?.length || 0})`, icon: Calendar },
              { id: 'board', label: `Yönetim Kurulu (${selectedClub.boardMembers?.length || 0})`, icon: Users },
              { id: 'venue_requests', label: `SKS Etkinlik & Yer Talepleri (${selectedClub.budgetRequests?.length || 0})`, icon: Building2 },
              { id: 'members', label: `Üyeler & Başvurular (${selectedClub.memberCount || selectedClub.members?.length || 0})`, icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = clubDetailTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setClubDetailTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-[#990000] text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: About, Advisor & Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* About Box */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-red-950 mb-3 flex items-center gap-2">
                  <Building2 size={18} className="text-[#990000]" /> Kulüp Hakkında
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{selectedClub.description || 'Bu kulüp için henüz bir açıklama girilmemiştir.'}</p>
                {selectedClub.purpose && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Misyon & Amaç</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedClub.purpose}</p>
                  </div>
                )}
              </div>

              {/* Advisor & Leadership */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-red-950 mb-1 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#990000]" /> Kulüp Rehberliği
                </h3>
                
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <span className="text-[10px] font-bold text-[#990000] uppercase tracking-wider block">Akademik Danışman</span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedClub.advisor || 'Danışman atanmadı'}</p>
                  {selectedClub.advisorEmail && (
                    <a href={`mailto:${selectedClub.advisorEmail}`} className="text-xs text-slate-500 hover:text-[#990000] flex items-center gap-1 mt-1 transition">
                      <Mail size={12} /> {selectedClub.advisorEmail}
                    </a>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kulüp Başkanı</span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedClub.president?.name || 'Başkan bilgisi yok'}</p>
                  <p className="text-xs text-slate-500">{selectedClub.president?.department} • {selectedClub.president?.year}</p>
                  {selectedClub.president?.phone && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Phone size={12} /> {selectedClub.president?.phone}
                    </p>
                  )}
                </div>

                {/* Authorized Officers Badge Box */}
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    SKS Yetkili Temsilcileri ({selectedClub.authorizedOfficers?.length || 2})
                  </span>
                  <div className="space-y-1">
                    {(selectedClub.authorizedOfficers || []).map((off, idx) => (
                      <div key={idx} className="text-xs flex items-center justify-between text-slate-700">
                        <span className="font-semibold">{off.name}</span>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-800 font-bold">{off.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Announcements Box */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-red-950 mb-3 flex items-center gap-2">
                  <Bell size={18} className="text-[#990000]" /> Resmî Duyurular
                </h3>
                <div className="space-y-3">
                  {(selectedClub.announcements || []).map((ann, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-400">{ann.date}</span>
                        {ann.isImportant && (
                          <span className="text-[9px] font-black uppercase bg-red-100 text-[#990000] px-1.5 py-0.5 rounded">Önemli</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 mb-1">{ann.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                  {(!selectedClub.announcements || selectedClub.announcements.length === 0) && (
                    <p className="text-xs text-slate-400 py-4 text-center">Henüz yayınlanmış duyuru bulunmuyor.</p>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Tab Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* TAB 1: OVERVIEW & INSTAGRAM MEDIA FEED */}
              {clubDetailTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* INSTAGRAM STORIES / HIGHLIGHTS BAR */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-1">
                      {clubHighlights.map(hl => (
                        <button
                          key={hl.id}
                          onClick={() => setActiveStoryModal(hl)}
                          className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none"
                        >
                          <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-[#990000] group-hover:scale-105 transition-transform shadow-xs">
                            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-100 flex items-center justify-center">
                              {hl.cover ? (
                                <img src={hl.cover} alt={hl.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xl">{hl.icon}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 max-w-[68px] truncate">{hl.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* INSTAGRAM FEED CONTROLS BAR */}
                  <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                        <Camera size={18} className="text-[#990000]" /> Kulüp Medya & Etkinlik Akışı
                      </h3>
                      <p className="text-[11px] text-slate-500">Instagram tarzı çoklu fotoğraf, müzik ambiyansı ve hikayeler.</p>
                    </div>
                    {authorized && (
                      <button
                        onClick={() => setShowCreatePostModal(true)}
                        className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={15} /> Yeni Gönderi
                      </button>
                    )}
                  </div>

                  {/* INSTAGRAM MODEL POST CARDS */}
                  <div className="space-y-6">
                    {clubPosts.map(post => {
                      const isPostLiked = likedPosts.has(post.id) || post.isLiked;
                      const activeImgIdx = activeImageIndices[post.id] || 0;
                      const currentImg = post.images?.[activeImgIdx] || post.images?.[0];
                      const totalImgs = post.images?.length || 1;
                      const isAudioPlaying = playingAudioId === post.id;
                      const comments = postComments[post.id] || post.comments || [];

                      return (
                        <div key={post.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          
                          {/* Post Header */}
                          <div className="p-4 flex items-center justify-between border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-[#990000]">
                                <img src={post.author.logo} alt={post.author.name} className="w-full h-full object-cover rounded-full border border-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <h4 className="font-bold text-xs text-gray-900 hover:text-[#990000] transition cursor-pointer">{post.author.name}</h4>
                                  {post.author.verified && <CheckCircle2 size={13} className="text-blue-500 fill-blue-500 text-white" />}
                                </div>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <MapPin size={10} className="text-[#990000]" /> {post.location} • {post.createdAt}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">•••</span>
                          </div>

                          {/* Post Media Carousel Container */}
                          <div className="relative aspect-4/3 bg-slate-950 overflow-hidden group select-none">
                            <img 
                              src={currentImg} 
                              alt="Club Post" 
                              className={`w-full h-full object-cover transition-all duration-500 ${getFilterClass(post.filter)}`}
                              onDoubleClick={() => handleToggleLike(post.id)}
                            />

                            {/* Floating Animated Heart on Double Tap */}
                            {heartAnimId === post.id && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                                <Heart size={84} className="text-rose-500 fill-rose-500 drop-shadow-2xl" />
                              </div>
                            )}

                            {/* Multiple Images Slider Navigation */}
                            {totalImgs > 1 && (
                              <>
                                <button 
                                  onClick={() => handleSlideImage(post.id, totalImgs, -1)}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <ChevronLeft size={18} />
                                </button>
                                <button 
                                  onClick={() => handleSlideImage(post.id, totalImgs, 1)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <ChevronRight size={18} />
                                </button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                                  {post.images.map((_, idx) => (
                                    <div 
                                      key={idx} 
                                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeImgIdx ? 'w-3 bg-white' : 'bg-white/50'}`} 
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Music Ambience Bar */}
                            {post.music && (
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-xs shadow-lg">
                                <button 
                                  onClick={() => handleToggleAudio(post.id)}
                                  className="cursor-pointer text-amber-300 hover:text-white transition"
                                >
                                  {isAudioPlaying ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <span className="font-semibold text-[11px] truncate max-w-[160px]">
                                  🎵 {post.music.title}
                                </span>
                                {isAudioPlaying && (
                                  <div className="flex items-end gap-0.5 h-3 ml-1">
                                    <span className="w-0.5 h-full bg-amber-400 animate-pulse"></span>
                                    <span className="w-0.5 h-2 bg-amber-400 animate-ping"></span>
                                    <span className="w-0.5 h-full bg-amber-400 animate-pulse"></span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Visual Filter Badge */}
                            {post.filter && post.filter !== 'normal' && (
                              <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] uppercase font-black px-2 py-0.5 rounded-md">
                                {post.filter}
                              </span>
                            )}
                          </div>

                          {/* Interaction Actions Bar */}
                          <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleToggleLike(post.id)}
                                  className={`flex items-center gap-1 text-sm font-bold transition cursor-pointer ${isPostLiked ? 'text-rose-600 scale-105' : 'text-slate-600 hover:text-rose-600'}`}
                                >
                                  <Heart size={20} className={isPostLiked ? 'fill-rose-600' : ''} />
                                  <span>{(post.likes || 0) + (isPostLiked && !post.isLiked ? 1 : 0)}</span>
                                </button>
                                <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 transition cursor-pointer">
                                  <MessageCircle size={20} />
                                  <span>{comments.length}</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    navigator.clipboard?.writeText(window.location.href);
                                    toast.success('Gönderi bağlantısı panoya kopyalandı!');
                                  }}
                                  className="text-slate-600 hover:text-emerald-600 transition cursor-pointer"
                                  title="Paylaş"
                                >
                                  <Share2 size={19} />
                                </button>
                              </div>
                              <button 
                                onClick={() => toast.success('Gönderi kaydedilenlere eklendi!')}
                                className="text-slate-400 hover:text-amber-600 transition cursor-pointer"
                              >
                                <Bookmark size={19} />
                              </button>
                            </div>

                            {/* Caption & Hashtags */}
                            <div className="text-xs leading-relaxed text-slate-800">
                              <span className="font-black text-gray-900 mr-1.5">{post.author.name}</span>
                              {post.caption}
                            </div>

                            {/* Comments Section */}
                            {comments.length > 0 && (
                              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                {comments.slice(-3).map((c, i) => (
                                  <div key={i} className="text-xs flex items-baseline gap-1.5 text-slate-700">
                                    <span className="font-bold text-gray-900">{c.name || c.user}:</span>
                                    <span className="text-slate-600">{c.text}</span>
                                    <span className="text-[10px] text-slate-400 ml-auto">{c.time}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Inline Comment */}
                            <div className="pt-2 flex items-center gap-2">
                              <input 
                                type="text"
                                placeholder="Kulüp etkinliğine yorum yap..."
                                value={newCommentText[post.id] || ''}
                                onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#990000] font-medium"
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="p-2 bg-[#990000] hover:bg-red-800 text-white rounded-xl transition cursor-pointer shadow-xs shrink-0"
                              >
                                <Send size={13} />
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}

                    {clubPosts.length === 0 && (
                      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                        <Camera size={36} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs text-slate-500 font-medium">Bu kulübe ait henüz fotoğraf ve medya gönderisi paylaşılmamış.</p>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: EVENTS */}
              {clubDetailTab === 'events' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-base">Kulüp Etkinlik Takvimi</h3>
                    {authorized && (
                      <button 
                        onClick={handleOpenVenueModal}
                        className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={15} /> Yeni Etkinlik / Salon Talebi
                      </button>
                    )}
                  </div>

                  {(selectedClub.events || []).map(event => (
                    <div key={event.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${event.status === 'Tamamlandı' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'}`}>
                            {event.status}
                          </span>
                          <span className="text-xs font-bold text-slate-400">{event.category}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Users size={14} className="text-slate-400" />
                          <span>{event.registeredCount} / {event.quota} Katılımcı</span>
                        </div>
                      </div>

                      <h4 className="text-lg font-black text-gray-900 mb-2">{event.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{event.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5"><Calendar size={14} className="text-[#990000]" /> {event.date} • {event.time}</div>
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-[#990000]" /> {event.location}</div>
                      </div>
                    </div>
                  ))}

                  {(!selectedClub.events || selectedClub.events.length === 0) && (
                    <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-200 text-center">
                      <Calendar size={40} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs text-slate-500 font-medium">Planlanmış bir etkinlik bulunmuyor.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BOARD MEMBERS */}
              {clubDetailTab === 'board' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(selectedClub.boardMembers || []).map(member => (
                      <div key={member.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <img src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-[#990000] uppercase tracking-wider block">{member.role}</span>
                          <h4 className="font-bold text-gray-900 text-sm">{member.name}</h4>
                          <p className="text-xs text-slate-500">{member.department}</p>
                          {member.studentNo && <span className="text-[10px] text-slate-400 font-mono">No: {member.studentNo}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SKS VENUE & ALLOCATION REQUESTS (NO MONEY COLUMN FOR STUDENT) */}
              {clubDetailTab === 'venue_requests' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Status Metric Cards (NO Currency - Only Status & Counts) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Toplam Tahsis Talebi</p>
                      <h4 className="text-xl font-black text-gray-900">{selectedClub.budgetRequests?.length || 0} Talep</h4>
                      <span className="text-[11px] text-slate-500">2026-2027 Dönemi</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Onaylanan Salon / Tahsis</p>
                      <h4 className="text-xl font-black text-emerald-700">
                        {(selectedClub.budgetRequests || []).filter(r => r.status === 'approved').length} Etkinlik
                      </h4>
                      <span className="text-[11px] text-emerald-600 font-medium">SKS Onaylı Rezervasyon</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">İncelemedeki Başvurular</p>
                      <h4 className="text-xl font-black text-amber-700">
                        {(selectedClub.budgetRequests || []).filter(r => r.status === 'pending').length} Talep
                      </h4>
                      <span className="text-[11px] text-amber-600 font-bold">Komisyon Değerlendirmesi</span>
                    </div>
                  </div>

                  {/* SKS Venue Requests Pool */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">SKS Etkinlik & Yer Tahsis Başvuruları</h3>
                        <p className="text-xs text-slate-500">Öğrenci Dekanlığı ve SKS Daire Başkanlığına iletilen resmî mekan ve teknik altyapı talepleri.</p>
                      </div>
                      <button
                        onClick={handleOpenVenueModal}
                        className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Plus size={16} /> Yeni Yer Tahsis Talebi
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3 px-3">Etkinlik / Organizasyon</th>
                            <th className="pb-3 px-3">Talep Edilen Salon / Yer</th>
                            <th className="pb-3 px-3">Tarih & Saat Aralığı</th>
                            <th className="pb-3 px-3">Yetkili Başvuran</th>
                            <th className="pb-3 px-3">Durum</th>
                            <th className="pb-3 px-3">SKS Karar Notu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {(selectedClub.budgetRequests || []).map((req, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-3 px-3 font-bold text-gray-900">{req.title || req.eventName}</td>
                              <td className="py-3 px-3 font-semibold text-slate-700">{req.venue || req.requestedVenue || req.location || 'Merkez Kampüs'}</td>
                              <td className="py-3 px-3 text-slate-500">{req.eventDate ? `${req.eventDate} (${req.startTime || '10:00'} - ${req.endTime || '17:00'})` : (req.requestedDate || req.date)}</td>
                              <td className="py-3 px-3 text-slate-600 font-medium">{req.requester || req.requesterName || 'Kulüp Başkanı'}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                  req.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {req.status === 'approved' ? 'Tahsis Onaylandı' : req.status === 'rejected' ? 'Reddedildi' : 'İnceleniyor'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-500">{req.approvalNote || 'SKS salon inceleme sürecinde.'}</td>
                            </tr>
                          ))}
                          {(!selectedClub.budgetRequests || selectedClub.budgetRequests.length === 0) && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400">Henüz iletilmiş bir mekan/tahsis talebi kaydı bulunmuyor.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MEMBERS & DETAILED MEMBERSHIP APPLICATIONS */}
              {clubDetailTab === 'members' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* PENDING MEMBER APPLICATIONS (Visible to President & Authorized Officers) */}
                  {authorized && pendingMemberApps.length > 0 && (
                    <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-amber-600" />
                          <h4 className="font-black text-amber-950 text-sm">
                            Onay Bekleyen Üyelik Başvuruları ({pendingMemberApps.length})
                          </h4>
                        </div>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          Yönetim Kurulu İncelemesi
                        </span>
                      </div>

                      <div className="space-y-3">
                        {pendingMemberApps.map(app => (
                          <div key={app.id} className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-bold text-gray-900 text-sm">{app.name}</h5>
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  No: {app.studentNo}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  TC: {app.tcKimlik ? `${app.tcKimlik.slice(0, 4)}*****${app.tcKimlik.slice(-2)}` : '11 Haneli'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600">{app.department} • {app.grade} • {app.email}</p>
                              {app.reason && (
                                <p className="text-xs text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  "{app.reason}"
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleApproveMemberApplication(app.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <Check size={14} /> Onayla
                              </button>
                              <button
                                onClick={() => handleRejectMemberApplication(app.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1 border border-rose-200 cursor-pointer"
                              >
                                <X size={14} /> Reddet
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registered Members Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">Kayıtlı Kulüp Üyeleri ({selectedClub.members?.length || selectedClub.memberCount || 0})</h3>
                        <p className="text-xs text-slate-500">T.C. Kimlik, Öğrenci No ve bölüm bazında onaylanmış resmi kulüp üyeleri.</p>
                      </div>
                      {!userIsMember && (
                        <button
                          onClick={() => setShowApplyMemberModal(true)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={15} /> Kulübe Başvur
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3 px-3">Öğrenci Bilgisi</th>
                            <th className="pb-3 px-3">Öğrenci No & TC</th>
                            <th className="pb-3 px-3">Bölüm & Sınıf</th>
                            <th className="pb-3 px-3">Kulüp Rolü</th>
                            <th className="pb-3 px-3">Kayıt Tarihi</th>
                            {authorized && <th className="pb-3 px-3 text-right">Yetki</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {(selectedClub.members || []).map((mem, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-3 px-3 font-bold text-gray-900">{mem.name}</td>
                              <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                                {mem.studentNo || '2023010***'}
                                {mem.tcKimlik && (
                                  <span className="block text-[10px] text-slate-400">
                                    TC: {mem.tcKimlik.slice(0, 3)}*****{mem.tcKimlik.slice(-2)}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-slate-600">
                                {mem.department} {mem.grade && <span className="block text-[10px] text-slate-400">{mem.grade}</span>}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  mem.role?.includes('Başkan') ? 'bg-red-100 text-[#990000]' :
                                  mem.role?.includes('Mali') ? 'bg-amber-100 text-amber-800' :
                                  mem.role?.includes('Sekreter') ? 'bg-purple-100 text-purple-800' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {mem.role || 'Aktif Üye'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-400">{mem.joinedDate || '2024'}</td>
                              {authorized && (
                                <td className="py-3 px-3 text-right">
                                  <button
                                    onClick={() => setAssignRoleModalMember(mem)}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition cursor-pointer"
                                  >
                                    Yetki Ata
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Club Constitution Box */}
                  <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <FileText size={18} className="text-[#990000]" />
                        İESÜ SKS Onaylı Resmî Kulüp Tüzüğü
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Bu kulüp Sağlık Kültür ve Spor Daire Başkanlığı Kulüp Kuruluş ve İşleyiş Yönergesi doğrultusunda {selectedClub.constitutionApprovedDate || '2021'} tarihinde akredite edilmiştir.
                      </p>
                    </div>
                    <button
                      onClick={() => toast.success('Kulüp tüzüğü PDF olarak indirildi.')}
                      className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-[#990000] font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Download size={15} /> Tüzük İndir (PDF)
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL 1: SKS VENUE & EQUIPMENT REQUEST MODAL (NO MONEY INPUT)   */}
        {/* ============================================================== */}
        {showVenueModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[92vh] overflow-y-auto">
              <button 
                onClick={() => setShowVenueModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-md inline-block mb-1">
                  SKS Daire Başkanlığı Mekan & Donanım Formu
                </span>
                <h3 className="text-xl font-black text-gray-900">Etkinlik & Yer Tahsis Talebi</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedClub.name} adına üniversite kampüsündeki salon, ses/ışık sistemi ve lojistik donanım talebinizi oluşturun.
                </p>
              </div>

              <form onSubmit={handleVenueSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Etkinlik / Organizasyon Adı *</label>
                  <input 
                    type="text" 
                    required 
                    value={venueForm.title} 
                    onChange={(e) => setVenueForm({ ...venueForm, title: e.target.value })} 
                    placeholder="Örn: Yapay Zeka Zirvesi & Panel" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]" 
                  />
                </div>

                {/* Venue Selection & Fill-in-the-blank */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Talep Edilen Yer / Salon *</label>
                  <select
                    value={venueForm.venue}
                    onChange={(e) => setVenueForm({ ...venueForm, venue: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                  >
                    <option>Ömer Halisdemir Konferans Salonu & Fuaye</option>
                    <option>A Blok Konferans Salonu</option>
                    <option>Mühendislik Fakültesi Amfi 1</option>
                    <option>Bilgisayar Lab 402</option>
                    <option>Merkez Kütüphane Seminer Salonu</option>
                    <option>Açık Amfi Kampüs Meydanı</option>
                    <option>Diğer (Özel Alan)</option>
                  </select>
                </div>

                {venueForm.venue === 'Diğer (Özel Alan)' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Özel Alanı Belirtiniz *</label>
                    <input 
                      type="text" 
                      required 
                      value={venueForm.customVenue} 
                      onChange={(e) => setVenueForm({ ...venueForm, customVenue: e.target.value })} 
                      placeholder="Örn: Spor Salonu Tribün Arkası veya B Blok Giriş" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                )}

                {/* Date and Time Intervals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Etkinlik Tarihi *</label>
                    <input 
                      type="date" 
                      required 
                      value={venueForm.eventDate} 
                      onChange={(e) => setVenueForm({ ...venueForm, eventDate: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Başlangıç Saati *</label>
                    <input 
                      type="time" 
                      required 
                      value={venueForm.startTime} 
                      onChange={(e) => setVenueForm({ ...venueForm, startTime: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bitiş Saati *</label>
                    <input 
                      type="time" 
                      required 
                      value={venueForm.endTime} 
                      onChange={(e) => setVenueForm({ ...venueForm, endTime: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahmini Katılımcı Sayısı *</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    value={venueForm.expectedAttendees} 
                    onChange={(e) => setVenueForm({ ...venueForm, expectedAttendees: parseInt(e.target.value) || 50 })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]" 
                  />
                </div>

                {/* Equipment Checkboxes & Needs */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Talep Edilen Teknik Donanım ve Hizmetler</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Ses Sistemi & Kürsü Mikrofonu',
                      'Çift Projeksiyon & HDMI Çoklayıcı',
                      'Telsiz Yaka & El Mikrofonları',
                      'Kokteyl & Grup Çalışma Masaları',
                      'Yaka Kartı & Katılım Belgesi Desteği',
                      'Kampüs İçi Afiş / Roll-up Asma İzni'
                    ].map(eq => (
                      <label key={eq} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                        <input 
                          type="checkbox" 
                          checked={venueForm.equipment.includes(eq)} 
                          onChange={() => handleToggleEquipment(eq)} 
                          className="rounded text-[#990000] focus:ring-0" 
                        />
                        <span className="text-slate-700 font-medium">{eq}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ekstra Malzeme & Özel İhtiyaçlar (Boşluk Doldurma)</label>
                  <input 
                    type="text" 
                    value={venueForm.customEquipment} 
                    onChange={(e) => setVenueForm({ ...venueForm, customEquipment: e.target.value })} 
                    placeholder="Örn: 2 adet uzatma kablosu, 40 adet plastik sandalye..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Etkinlik Amacı ve SKS Karar Açıklaması *</label>
                  <textarea 
                    rows={2} 
                    required 
                    value={venueForm.description} 
                    onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })} 
                    placeholder="Etkinliğin öğrencilere katkısı, program akışı ve konuk bilgileri..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] resize-none" 
                  />
                </div>

                {/* SKS Notice: Strictly informing that money/budget is handled by unit */}
                <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-900 leading-relaxed">
                  ℹ️ <strong>SKS Dairesi Notu:</strong> Öğrenci kulüp taleplerinde parasal maliyet gösterilmez. Gerekli teknik malzeme ve salon tahsisi SKS Daire Başkanlığı tarafından doğrudan tahsis edilir ve bütçelendirilir.
                </div>

                <div className="pt-2 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowVenueModal(false)} 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Talebi SKS'ye İlet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: DETAILED MEMBERSHIP APPLICATION FORM (TC & STUDENT NO) */}
        {/* ============================================================== */}
        {showApplyMemberModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[92vh] overflow-y-auto">
              <button 
                onClick={() => setShowApplyMemberModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-1">
                  Resmî Kulüp Üyelik Formu
                </span>
                <h3 className="text-xl font-black text-gray-900">{selectedClub.name} Başvurusu</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kulüp yönetmeliği gereği T.C. Kimlik ve Öğrenci No bilgileriniz kulüp başkanlığı ve SKS tarafından doğrulanacaktır.
                </p>
              </div>

              <form onSubmit={handleSubmitMemberApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ad Soyad *</label>
                  <input 
                    type="text" 
                    required 
                    value={applyMemberForm.name} 
                    onChange={(e) => setApplyMemberForm({ ...applyMemberForm, name: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Öğrenci Numarası *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Örn: 2023010482" 
                      value={applyMemberForm.studentNo} 
                      onChange={(e) => setApplyMemberForm({ ...applyMemberForm, studentNo: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">T.C. Kimlik Numarası (11 Hane) *</label>
                    <input 
                      type="text" 
                      maxLength={11} 
                      required 
                      placeholder="11 haneli kimlik no" 
                      value={applyMemberForm.tcKimlik} 
                      onChange={(e) => setApplyMemberForm({ ...applyMemberForm, tcKimlik: e.target.value.replace(/[^0-9]/g, '') })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fakülte & Bölüm *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Örn: Bilgisayar Mühendisliği" 
                      value={applyMemberForm.department} 
                      onChange={(e) => setApplyMemberForm({ ...applyMemberForm, department: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sınıf Seviyesi *</label>
                    <select
                      value={applyMemberForm.grade}
                      onChange={(e) => setApplyMemberForm({ ...applyMemberForm, grade: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                    >
                      <option>Hazırlık Sınıfı</option>
                      <option>1. Sınıf</option>
                      <option>2. Sınıf</option>
                      <option>3. Sınıf</option>
                      <option>4. Sınıf</option>
                      <option>Yüksek Lisans / Doktora</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası *</label>
                    <input 
                      type="tel" 
                      required 
                      value={applyMemberForm.phone} 
                      onChange={(e) => setApplyMemberForm({ ...applyMemberForm, phone: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Üniversite E-postası *</label>
                    <input 
                      type="email" 
                      required 
                      value={applyMemberForm.email} 
                      onChange={(e) => setApplyMemberForm({ ...applyMemberForm, email: e.target.value })} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kulübe Katılma Amacı & İlgi Duyduğunuz Alanlar</label>
                  <textarea 
                    rows={2} 
                    value={applyMemberForm.reason} 
                    onChange={(e) => setApplyMemberForm({ ...applyMemberForm, reason: e.target.value })} 
                    placeholder="Kulüp bünyesinde hangi komisyonlarda veya projelerde yer almak istiyorsunuz?" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] resize-none" 
                  />
                </div>

                <label className="flex items-start gap-2 pt-1 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required 
                    checked={applyMemberForm.kvkkAccepted} 
                    onChange={(e) => setApplyMemberForm({ ...applyMemberForm, kvkkAccepted: e.target.checked })} 
                    className="mt-0.5 rounded text-emerald-600 focus:ring-0" 
                  />
                  <span className="text-[11px] text-slate-600 leading-tight">
                    İESÜ Öğrenci Kulüpleri Tüzüğü ve KVKK Aydınlatma Metnini okudum, üyelik şartlarını kabul ediyorum.
                  </span>
                </label>

                <div className="pt-3 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowApplyMemberModal(false)} 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Başvuruyu İlet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: UNAUTHORIZED ROLE RESTRICTION NOTICE MODAL            */}
        {/* ============================================================== */}
        {showUnauthorizedModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-100 text-[#990000] flex items-center justify-center mx-auto mb-4 border border-red-200">
                <Lock size={30} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Yetkili Yönetici Kısıtlaması</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Üniversite SKS yönergesi uyarınca, etkinlik oluşturma ve yer tahsis talepleri yalnızca <strong>Kulüp Başkanı</strong>, <strong>Başkan Yardımcısı</strong>, <strong>Genel Sekreter</strong> veya <strong>Mali Sorumlu</strong> tarafından yapılabilmektedir.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 mb-6">
                <span className="font-bold block mb-1">Mevcut Kulüp Yetkilisi:</span>
                <p>• {selectedClub.president?.name} (Kulüp Başkanı)</p>
                <p>• {selectedClub.president?.email}</p>
              </div>
              <button
                onClick={() => setShowUnauthorizedModal(false)}
                className="w-full py-3 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
              >
                Anladım
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 4: INSTAGRAM-STYLE NEW POST COMPOSER MODAL               */}
        {/* ============================================================== */}
        {showCreatePostModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[92vh] overflow-y-auto">
              <button 
                onClick={() => setShowCreatePostModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-md inline-block mb-1">
                  Instagram Modeli Gönderi Paylaşımı
                </span>
                <h3 className="text-xl font-black text-gray-900">Kulüp Etkinlik Medyası</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fotoğraf galerisi, görsel filtre efekti ve arka plan müzik ambiyansı ekleyin.
                </p>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fotoğraf URL (Görsel Bağlantısı) *</label>
                  <input 
                    type="url" 
                    required 
                    value={postForm.images[0]} 
                    onChange={(e) => setPostForm({ ...postForm, images: [e.target.value] })} 
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Görsel Filtre Efekti</label>
                    <select
                      value={postForm.filter}
                      onChange={(e) => setPostForm({ ...postForm, filter: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                    >
                      <option value="normal">Normal (Orijinal)</option>
                      <option value="vibrant">Canlı & Parlak (Vibrant)</option>
                      <option value="cyber">Siber & Gece (Cyberpunk)</option>
                      <option value="vintage">Nostalji & Retro (Vintage)</option>
                      <option value="cinema">Sinematik Kontrast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Müzik / Ses Ambiyansı</label>
                    <select
                      value={postForm.musicTitle}
                      onChange={(e) => setPostForm({ ...postForm, musicTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                    >
                      <option>Campus Synthwave & Tech Beats</option>
                      <option>Cyberpunk Coding Lounge</option>
                      <option>Akademik İnovasyon Klasik</option>
                      <option>Kampüs Lo-Fi Akustik</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Konum Etiketi</label>
                  <input 
                    type="text" 
                    value={postForm.location} 
                    onChange={(e) => setPostForm({ ...postForm, location: e.target.value })} 
                    placeholder="Örn: İESÜ Ömer Halisdemir Konferans Salonu" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Açıklama & Hashtag'ler *</label>
                  <textarea 
                    rows={3} 
                    required 
                    value={postForm.caption} 
                    onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })} 
                    placeholder="Etkinlik hakkında heyecan verici bir yazı yazın... #İESÜ #YazılımKulübü #Hackathon2026" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] resize-none" 
                  />
                </div>

                <div className="pt-2 flex gap-3 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setShowCreatePostModal(false)} 
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={16} /> Paylaş
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 5: INSTAGRAM STORY VIEWER MODAL                          */}
        {/* ============================================================== */}
        {activeStoryModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="relative max-w-sm w-full bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-9/16 flex flex-col justify-between">
              
              {/* Progress bar */}
              <div className="p-3 w-full z-20">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-white animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between mt-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activeStoryModal.icon}</span>
                    <span className="font-bold text-xs">{activeStoryModal.title}</span>
                  </div>
                  <button onClick={() => setActiveStoryModal(null)} className="p-1 hover:bg-white/20 rounded-full transition">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Story Image */}
              <div className="absolute inset-0">
                <img src={activeStoryModal.cover} alt={activeStoryModal.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
              </div>

              {/* Story Bottom Caption */}
              <div className="p-6 relative z-20 text-white">
                <h4 className="text-lg font-black mb-1">{selectedClub.name}</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Öne çıkan etkinlik görüntüleri ve kulüp hafızası.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 6: ASSIGN OFFICER ROLE MODAL (PRESIDENT ONLY)            */}
        {/* ============================================================== */}
        {assignRoleModalMember && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-up">
              <h3 className="font-bold text-gray-900 text-base mb-1">Kulüp Yetkisi Ata</h3>
              <p className="text-xs text-slate-500 mb-4">{assignRoleModalMember.name} öğrencisine atanacak resmî kurul görevini seçiniz:</p>
              
              <select
                value={newAssignedRole}
                onChange={(e) => setNewAssignedRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-gray-800 outline-none focus:border-[#990000] mb-5"
              >
                <option>Mali Sorumlu</option>
                <option>Başkan Yardımcısı</option>
                <option>Genel Sekreter</option>
                <option>Etkinlik Koordinatörü</option>
                <option>Sponsorluk ve Dış İlişkiler</option>
                <option>Sosyal Medya ve Basın Sorumlusu</option>
                <option>Aktif Üye</option>
              </select>

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setAssignRoleModalMember(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  İptal
                </button>
                <button 
                  onClick={handleAssignRole}
                  className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Yetkiyi Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING BOTTOM DOCK */}
        <SubPanelFloatingDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole}
        />
      </div>
    );
  }

  // ==============================================================
  // RENDER: DISCOVERY & MAIN CLUBS DIRECTORY
  // ==============================================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView(previousView || 'student')} 
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-red-950 transition cursor-pointer"
              title="Geri Dön"
            >
              <ArrowLeft size={18} />
            </button>
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView || 'student')}>
              <Logo className="h-8 w-auto text-[#990000]" />
              <h1 className="text-lg font-black text-gray-900 border-l-2 border-slate-200 pl-3">Öğrenci Kulüpleri Portalı</h1>
            </div>
          </div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          <button onClick={() => setActiveTab('discover')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'discover' ? 'border-[#990000] text-[#990000]' : 'border-transparent text-slate-500 hover:text-red-950'}`}>Keşfet</button>
          <button onClick={() => setActiveTab('my_clubs')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'my_clubs' ? 'border-[#990000] text-[#990000]' : 'border-transparent text-slate-500 hover:text-red-950'}`}>
            Kulüplerim
            {myJoinedClubs.length > 0 && <span className="ml-1.5 bg-red-100 text-[#990000] text-[10px] font-black px-1.5 py-0.5 rounded-full">{myJoinedClubs.length}</span>}
          </button>
          {(isAdmin || isDean) && (
            <button onClick={() => setActiveTab('admin')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors cursor-pointer ${activeTab === 'admin' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-red-950'}`}>
              Dekanlık Onayları
              {applications.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{applications.filter(a => a.status === 'pending').length}</span>
              )}
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'discover' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Kulüp adı veya anahtar kelime ara..." 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none transition font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={() => setShowCreateModal(true)} className="w-full md:w-auto px-6 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer">
                <Plus size={20} /> Yeni Kulüp Kur (EK-1)
              </button>
            </div>

            {filteredClubs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Aramanıza uygun kulüp bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map(club => (
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  key={club.id} onClick={() => setSelectedClub(club)} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform bg-white overflow-hidden">
                        {club.logo ? <img src={club.logo} alt={club.name} className="w-full h-full object-cover" /> : <Building2 size={28} className="text-slate-300" />}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 leading-tight mb-1 group-hover:text-[#990000] transition-colors">{club.name}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{club.category || 'Genel'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">{club.description || 'Öğrencilerin akademik ve sosyal gelişimlerini desteklemeyi amaçlamaktadır.'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Users size={14} className="text-slate-400" /> {club.memberCount || club.members?.length || 45} Üye
                      </div>
                      {isMemberOfClub(club) && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Üyesiniz</span>}
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-[#990000] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY CLUBS TAB */}
        {activeTab === 'my_clubs' && (
          <div className="animate-fade-in space-y-8">
            {myManagedClubs.length > 0 && (
              <>
                <h2 className="text-2xl font-black text-gray-900">Yönettiğim Kulüpler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myManagedClubs.map(club => (
                    <div key={club.id} className="bg-white rounded-xl p-6 border border-red-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#990000] text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-bl-xl shadow-sm">Yönetici</div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-[#990000] border border-red-100"><Trophy size={24} /></div>
                        <div>
                          <h3 className="font-black text-lg text-gray-900">{club.name}</h3>
                          <p className="text-sm text-slate-500">{(club.memberApplications || []).filter(r => r.status === 'pending').length} Yeni Üyelik Başvurusu</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setSelectedClub(club)} className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-[#990000] font-bold rounded-xl transition-colors text-sm cursor-pointer">Yönetim Panelini Aç</button>
                        <button onClick={() => { setSelectedClub(club); setShowVenueModal(true); }} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm cursor-pointer">Yer & Donanım İste</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-2xl font-black text-gray-900">Üye Olduğum Kulüpler</h2>
            {myJoinedClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJoinedClubs.map(club => (
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} key={club.id} onClick={() => setSelectedClub(club)} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={club.logo} alt={club.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h3 className="font-black text-gray-900 group-hover:text-[#990000] transition-colors">{club.name}</h3>
                        <p className="text-xs text-slate-500">{club.category || 'Genel'}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-[#990000]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center">
                 <Bell size={40} className="mx-auto text-slate-300 mb-4" />
                 <p className="text-slate-500 mb-4 font-medium">Henüz hiçbir kulübe üye değilsiniz.</p>
                 <button onClick={() => setActiveTab('discover')} className="px-6 py-2.5 bg-[#990000] text-white font-bold rounded-xl hover:bg-red-800 transition-colors cursor-pointer">Kulüpleri Keşfet</button>
              </div>
            )}
          </div>
        )}

        {/* DEAN / SKS APPLICATION APPROVALS */}
        {activeTab === 'admin' && (isAdmin || isDean) && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-amber-500"/> SKS & Dekanlık Onay Bekleyenler</h2>
               {applications.length === 0 ? (
                 <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <CheckCircle2 size={40} className="mx-auto text-slate-300 mb-3" />
                   <p className="text-slate-500 font-medium">Bekleyen başvuru yok!</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {applications.map(app => (
                     <div key={app.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                       <div className="flex items-start gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${app.type === 'new_club' ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-red-50 text-[#990000] border-red-100'}`}>
                           {app.type === 'new_club' ? <Building2 size={24} /> : <Calendar size={24} />}
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${app.type === 'new_club' ? 'bg-violet-100 text-violet-700' : 'bg-red-100 text-[#990000]'}`}>
                               {app.type === 'new_club' ? 'Yeni Kulüp Kurma (EK-1)' : 'Mekan & Tahsis Talebi'}
                             </span>
                             <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {app.date}</span>
                           </div>
                           <h3 className="font-bold text-gray-900 text-base">{app.name || app.eventName}</h3>
                           <p className="text-xs font-medium text-slate-500 mt-1">
                             {app.applicant ? `Kurucu: ${app.applicant}` : `Kulüp: ${app.club}`} 
                             {app.venue && ` • Salon: ${app.venue}`}
                           </p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         {app.status === 'pending' ? (
                           <>
                             <button 
                               onClick={() => {
                                 const updated = applications.map(a => a.id === app.id ? { ...a, status: 'approved' } : a);
                                 if (setClubApplications) setClubApplications(updated);
                                 toast.success('Başvuru onaylandı!');
                               }}
                               className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 font-bold rounded-lg transition-colors text-sm flex items-center gap-1 cursor-pointer"
                             >
                               <CheckCircle2 size={16} /> Onayla
                             </button>
                             <button 
                               onClick={() => {
                                 const updated = applications.map(a => a.id === app.id ? { ...a, status: 'rejected' } : a);
                                 if (setClubApplications) setClubApplications(updated);
                                 toast.error('Başvuru reddedildi.');
                               }}
                               className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 font-bold rounded-lg transition-colors text-sm flex items-center gap-1 cursor-pointer"
                             >
                               <XCircle size={16} /> Reddet
                             </button>
                           </>
                         ) : (
                           <span className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 border ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                             {app.status === 'approved' ? <><CheckCircle2 size={16}/> Onaylandı</> : <><XCircle size={16}/> Reddedildi</>}
                           </span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      {/* CREATE NEW CLUB MODAL (EK-1) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-scale-up p-6 md:p-8">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-md inline-block mb-1">
                EK-1 Resmî Başvuru Formu
              </span>
              <h2 className="text-xl font-black text-gray-900">Yeni Öğrenci Kulübü Kurma</h2>
              <p className="text-xs text-slate-500 mt-1">SKS Daire Başkanlığı Kulüp Kuruluş ve İşleyiş Yönergesi başvuru protokolü.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newApp = {
                id: 'APP-CLB-' + Date.now().toString(),
                type: 'new_club',
                name: createForm.name,
                applicant: currentUser?.name || 'Kurucu Öğrenci',
                userId: currentUser?.id,
                status: 'pending',
                date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                purpose: createForm.purpose,
                description: createForm.description,
                category: createForm.category,
                advisorName: createForm.advisor,
                estimatedMembers: 20
              };
              const updatedApps = [newApp, ...(clubApplications || [])];
              if (setClubApplications) setClubApplications(updatedApps);
              setShowCreateModal(false);
              setCreateForm({ name: '', category: 'Bilim ve Teknoloji', description: '', purpose: '', advisor: '' });
              toast.success('EK-1 Kulüp kurma başvurunuz SKS Daire Başkanlığına iletildi!');
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kurulacak Kulübün Adı *</label>
                <input 
                  type="text" 
                  required 
                  value={createForm.name} 
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Örn: Yapay Zeka ve Siber Güvenlik Kulübü" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select 
                    value={createForm.category} 
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                  >
                    <option>Bilim ve Teknoloji</option>
                    <option>Kültür ve Sanat</option>
                    <option>Spor</option>
                    <option>Mesleki Gelişim</option>
                    <option>Sosyal Sorumluluk</option>
                    <option>Girişimcilik ve İnovasyon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Önerilen Akademik Danışman</label>
                  <input 
                    type="text" 
                    value={createForm.advisor} 
                    onChange={(e) => setCreateForm({ ...createForm, advisor: e.target.value })}
                    placeholder="Örn: Dr. Öğr. Üyesi Ahmet Yılmaz" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kulübün Amacı ve Misyonu *</label>
                <textarea 
                  required 
                  rows={3}
                  value={createForm.purpose} 
                  onChange={(e) => setCreateForm({ ...createForm, purpose: e.target.value })}
                  placeholder="Kulübün üniversitemize ve öğrencilere sağlayacağı vizyonu açıklayınız..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kısa Tanıtım Açıklaması *</label>
                <textarea 
                  required 
                  rows={2}
                  value={createForm.description} 
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Kulüp rehberinde öğrencilerin göreceği özet tanıtım metni..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] resize-none"
                />
              </div>

              <div className="pt-3 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={16} /> Başvuruyu İlet (EK-1)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM DOCK */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole={userRole}
      />
    </div>
  );
}
