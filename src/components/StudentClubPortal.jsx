import React, { useState, useMemo } from 'react';
import { 
  Users, Trophy, FileText, ChevronRight, CheckCircle2, 
  XCircle, Clock, Plus, Search, Building2, Calendar, 
  Wallet, ShieldCheck, MapPin, Activity, ArrowLeft, X, Bell,
  Zap, Heart, MessageCircle, Share2, Play, Download, Sparkles,
  Filter, ExternalLink, Mail, Phone, Check, Award
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import { toast } from './shared/Toast';
import useAppStore from '../store/useAppStore';
import { initialClubs, initialClubApplications } from '../data/mockClubsData';

export default function StudentClubPortal({ currentUser, setView, previousView, setSelectedUserId, userRole = 'student' }) {
  const { clubs, setClubs, clubApplications, setClubApplications } = useAppStore();
  const [activeTab, setActiveTab] = useState('discover');
  const [clubDetailTab, setClubDetailTab] = useState('overview'); // 'overview' | 'events' | 'board' | 'budget' | 'members'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', category: 'Bilim ve Teknoloji', description: '', purpose: '', advisor: '' });
  const [eventForm, setEventForm] = useState({ name: '', date: '', location: '', budget: '', description: '' });

  const isAdmin = currentUser?.role === 'admin';
  const isDean = currentUser?.title?.toLowerCase().includes('dekan');
  
  // Use global clubs & clubApplications, fall back to rich sample clubs
  const clubList = useMemo(() => (clubs && clubs.length > 0) ? clubs : initialClubs, [clubs]);
  const applications = useMemo(() => (clubApplications && clubApplications.length > 0) ? clubApplications : initialClubApplications, [clubApplications]);

  const myManagedClubs = useMemo(() => (clubList || []).filter(c => c.presidentId === currentUser?.id || (c.admins || []).includes(currentUser?.id)), [clubList, currentUser]);
  const myJoinedClubs = useMemo(() => (clubList || []).filter(c => (c.members || []).some(m => m.id === currentUser?.id)), [clubList, currentUser]);
  const filteredClubs = useMemo(() => (clubList || []).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description?.toLowerCase().includes(searchQuery.toLowerCase()) || c.category?.toLowerCase().includes(searchQuery.toLowerCase())), [clubList, searchQuery]);

  const isMemberOfClub = (club) => (club.members || []).some(m => m.id === currentUser?.id);
  const hasPendingRequest = (club) => (club.memberRequests || []).some(r => r.userId === currentUser?.id && r.status === 'pending');

  const handleMembershipRequest = (club) => {
    if (!currentUser) return;
    if (isMemberOfClub(club)) {
      toast.info('Bu kulübün zaten üyesisiniz.');
      return;
    }
    if (hasPendingRequest(club)) {
      toast.info('Bu kulüp için bekleyen bir üyelik talebiniz mevcut.');
      return;
    }
    const newRequest = { userId: currentUser.id, userName: currentUser.name, userAvatar: currentUser.avatar, status: 'pending', date: new Date().toLocaleDateString('tr-TR') };
    setClubs && setClubs(prev => prev.map(c => 
      c.id === club.id 
        ? { ...c, memberRequests: [...(c.memberRequests || []), newRequest] }
        : c
    ));
    // Update selected club view too
    setSelectedClub(prev => prev ? { ...prev, memberRequests: [...(prev.memberRequests || []), newRequest] } : prev);
    toast.success(`"${club.name}" kulübüne üyelik talebiniz gönderildi!`);
  };

  const handleApplyClub = () => {
    setShowCreateModal(true);
  };

  const handleSubmitClub = (e) => {
    e.preventDefault();
    const newApp = {
      id: Date.now().toString(),
      type: 'new_club',
      name: createForm.name,
      applicant: currentUser?.name || 'Öğrenci',
      status: 'pending',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      purpose: createForm.purpose,
      description: createForm.description,
      category: createForm.category,
      advisorName: createForm.advisor,
      userId: currentUser?.id,
    };
    const updatedApps = [newApp, ...(clubApplications || [])];
    if (setClubApplications) {
      setClubApplications(updatedApps);
    }
    setShowCreateModal(false);
    setCreateForm({ name: '', category: 'Bilim ve Teknoloji', description: '', purpose: '', advisor: '' });
    toast.success('Kulüp kurma başvurunuz Dekanlığa iletildi! En kısa sürede değerlendirilecektir.');
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      id: 'REQ-' + Date.now().toString(),
      type: 'event_budget',
      title: eventForm.name,
      eventName: eventForm.name,
      club: selectedClub?.name || 'Kulübüm',
      amount: eventForm.budget ? `${eventForm.budget} TL` : 'Bütçe İstenmiyor',
      location: eventForm.location || 'Merkez Kampüs',
      status: 'pending',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: eventForm.description || ''
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
    setShowEventModal(false);
    setEventForm({ name: '', date: '', location: '', budget: '', description: '' });
    toast.success('Etkinlik & Bütçe başvurunuz SKS Daire Başkanlığına iletildi!');
  };

  const handleApproveApplication = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'approved' } : a);
    if (setClubApplications) setClubApplications(updatedApps);
    
    if (app.type === 'new_club' && setClubs) {
      const newClub = {
        id: `club_${Date.now()}`,
        name: app.name,
        category: app.category || 'Genel',
        description: app.description || '',
        memberCount: 1,
        members: [{ id: currentUser?.id, name: app.applicant }],
        admins: [],
        presidentId: app.userId,
        advisor: app.advisor || '',
        createdAt: new Date().toISOString(),
      };
      setClubs(prev => [...prev, newClub]);
      toast.success(`"${app.name}" kulübü onaylandı ve sisteme eklendi!`);
    } else {
      toast.success('Başvuru onaylandı!');
    }
  };

  const handleRejectApplication = (appId) => {
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'rejected' } : a);
    if (setClubApplications) setClubApplications(updatedApps);
    toast.error('Başvuru reddedildi.');
  };

  // Mock Feed Posts (LinkedIn Style) for selected club
  const clubFeedPosts = [
    {
      id: 1,
      author: { name: selectedClub?.name || 'Kulüp', logo: selectedClub?.logo || 'https://ui-avatars.com/api/?name=KL&background=0f172a&color=fff' },
      time: '2 saat önce',
      content: 'Bahar dönemi ilk toplantımız için hazırız! Yönetim kurulu üyelerimizle dönem planlamasını tamamladık. Yeni etkinlikler çok yakında! 🚀',
      image: selectedClub?.coverImage || 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80',
      likes: 24,
      comments: 5
    }
  ];

  if (selectedClub) {
    const userIsMember = isMemberOfClub(selectedClub);
    const userHasPending = hasPendingRequest(selectedClub);

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-28 animate-fade-in">
        
        {/* NEW PROFESSIONAL CLUB PROFILE HEADER (LinkedIn Style) */}
        <div className="h-64 relative bg-red-950 border-b border-slate-200">
           <button onClick={() => setSelectedClub(null)} className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2.5 rounded-full transition-colors z-20">
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
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-400/20 backdrop-blur px-2.5 py-1 rounded-md uppercase tracking-wider">{selectedClub.category || 'Kulüp'}</span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1"><Users size={14}/> {selectedClub.memberCount || 0} Üye</span>
                </div>
                <h1 className="text-3xl font-black text-white">{selectedClub.name}</h1>
              </div>
            </div>
            
            <div className="pb-2 flex gap-3">
              {userIsMember ? (
                 <button className="px-6 py-3 bg-white text-red-900 font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
                   <CheckCircle2 size={18} className="text-emerald-500" /> Üyesiniz
                 </button>
               ) : userHasPending ? (
                 <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                   <Clock size={18} /> Talebiniz İncelemede
                 </button>
               ) : (
                 <button 
                   onClick={() => handleMembershipRequest(selectedClub)}
                   className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg flex items-center gap-2"
                 >
                   <Plus size={18}/> Katıl
                 </button>
               )}
            </div>
          </div>

          {/* CLUB DETAIL SUB-TABS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-6 shadow-xs flex gap-2 overflow-x-auto hide-scrollbar">
            {[
              { id: 'overview', label: 'Genel Bakış & Duyurular', icon: Activity },
              { id: 'events', label: `Etkinlikler (${selectedClub.events?.length || 0})`, icon: Calendar },
              { id: 'board', label: `Yönetim Kurulu (${selectedClub.boardMembers?.length || 0})`, icon: Users },
              { id: 'budget', label: 'Bütçe & SKS Talepleri', icon: Wallet },
              { id: 'members', label: `Üyeler & Tüzük (${selectedClub.memberCount || 0})`, icon: FileText }
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
            {/* LEFT COLUMN: About & Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-red-950 mb-3 flex items-center gap-2">Kulüp Hakkında</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{selectedClub.description || 'Bu kulüp için henüz bir açıklama girilmemiştir.'}</p>
                {selectedClub.purpose && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Misyon & Amaç</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedClub.purpose}</p>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500"><Users size={18}/></div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Danışman Öğretim Üyesi</p>
                      <p className="text-sm font-bold text-red-900">{selectedClub.advisor || 'Atanmadı'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500"><Trophy size={18}/></div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kulüp Başkanı</p>
                      <p className="text-sm font-bold text-red-900">{selectedClub.president?.name || 'Belirtilmedi'}</p>
                    </div>
                  </div>
                  {selectedClub.budget && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Wallet size={18}/></div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kalan Kullanılabilir Bütçe</p>
                        <p className="text-sm font-black text-emerald-700">{selectedClub.budget.remaining?.toLocaleString('tr-TR')} ₺ <span className="text-xs text-slate-400 font-normal">/ {selectedClub.budget.allocated?.toLocaleString('tr-TR')} ₺</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Broadcast Channel Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-900 to-[#990000] p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span className="font-bold text-sm">Resmî Duyuru & Yayın Kanalı</span>
                  </div>
                  <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{selectedClub.memberCount || 142} Üye</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none border border-slate-100 w-11/12">
                    <p className="text-xs text-red-900 font-medium">Bahar dönemi etkinlik takvimimiz ve sponsorluk görüşmelerimiz onaylanmıştır! Detaylar duyurular sekmesinde. 🚀</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Bugün, 11:20</span>
                  </div>
                  {userIsMember ? (
                    <button className="w-full py-2 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors">
                      Kanala Katıl
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleMembershipRequest(selectedClub)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition"
                    >
                      Kanala Katılmak İçin Üye Olun
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN: Tab Contents */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* TAB 1: OVERVIEW & ANNOUNCEMENTS */}
              {clubDetailTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  {/* ANNOUNCEMENTS PANEL */}
                  {selectedClub.announcements && selectedClub.announcements.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="font-bold text-gray-900 text-base mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-[#990000]" />
                        Güncel Kulüp Duyuruları
                      </h3>
                      <div className="space-y-3">
                        {selectedClub.announcements.map((ann, idx) => (
                          <div key={idx} className={`p-4 rounded-xl border ${ann.isImportant ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50/60 border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-sm text-gray-900">{ann.title}</span>
                              <span className="text-[11px] font-bold text-slate-400">{ann.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                            {ann.author && <p className="text-[10px] text-slate-400 font-bold mt-2">— {ann.author}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Write Post Box (Only for members) */}
                  {userIsMember && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex gap-3 items-center hover:border-slate-300 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex shrink-0 items-center justify-center text-[#990000] font-bold border border-red-200">
                        {currentUser?.name?.charAt(0) || 'Ö'}
                      </div>
                      <div className="flex-1 text-left px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-500 font-medium transition-colors hover:bg-slate-100">
                        Kulüp üyeleriyle bir şey paylaş...
                      </div>
                    </div>
                  )}

                  {/* Feed Posts */}
                  {clubFeedPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 cursor-pointer group">
                          <img src={post.author.logo} alt={post.author.name} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm" />
                          <div>
                            <h4 className="font-bold text-sm text-red-950 group-hover:text-[#990000] transition-colors">{post.author.name}</h4>
                            <p className="text-[11px] text-slate-500">{post.time}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 pb-3">
                        <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
                      </div>

                      {post.image && (
                        <div className="w-full h-64 bg-slate-100">
                          <img src={post.image} alt="Post cover" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="p-3 border-t border-slate-100 flex items-center justify-between px-6">
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors text-sm font-medium py-1 px-2 rounded-lg hover:bg-rose-50">
                          <Heart size={18} /> {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium py-1 px-2 rounded-lg hover:bg-red-50">
                          <MessageCircle size={18} /> {post.comments}
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-[#990000] transition-colors text-sm font-medium py-1 px-2 rounded-lg hover:bg-red-50">
                          <Share2 size={18} /> Paylaş
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: EVENTS & CALENDAR */}
              {clubDetailTab === 'events' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Kulüp Etkinlik Takvimi</h3>
                      <p className="text-xs text-slate-500">Yaklaşan hackathon, konferans ve atölye programları.</p>
                    </div>
                    <button
                      onClick={() => setShowEventModal(true)}
                      className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus size={16} /> Yeni Etkinlik Başvurusu
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(selectedClub.events || []).map((evt, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-red-200 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-red-50 text-[#990000] font-bold text-[11px] rounded-lg uppercase tracking-wider">
                              {evt.category || 'Etkinlik'}
                            </span>
                            <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${evt.status === 'Yaklaşan' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                              {evt.status}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Calendar size={14} /> {evt.date} • {evt.time || '14:00'}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-gray-900 mb-2">{evt.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">{evt.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs mb-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin size={15} className="text-[#990000] shrink-0" />
                            <span><strong>Konum:</strong> {evt.location}</span>
                          </div>
                          {evt.speaker && (
                            <div className="flex items-center gap-2 text-slate-600">
                              <Award size={15} className="text-amber-600 shrink-0" />
                              <span><strong>Konuk:</strong> {evt.speaker}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs text-slate-500 font-medium">
                            Kontenjan: <strong className="text-gray-900">{evt.registeredCount || 0} / {evt.quota || 100}</strong>
                          </div>
                          <button 
                            onClick={() => toast.success(`"${evt.title}" etkinliğine kaydınız başarıyla alındı!`)}
                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                          >
                            Katıl / Bilet Al
                          </button>
                        </div>
                      </div>
                    ))}

                    {(!selectedClub.events || selectedClub.events.length === 0) && (
                      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                        <Calendar size={40} className="mx-auto text-slate-300 mb-2" />
                        <h4 className="font-bold text-gray-800">Planlanmış Etkinlik Bulunmuyor</h4>
                        <p className="text-xs text-slate-500">Kulüp yöneticileri yeni bir etkinlik başvurusu oluşturabilir.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGEMENT BOARD */}
              {clubDetailTab === 'board' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-base">Yönetim Kurulu & Akademik Danışmanlık</h3>
                    <p className="text-xs text-slate-500">Kulübün resmî temsilcileri ve akademik danışman kadrosu.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(selectedClub.boardMembers || []).map((m, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-red-200 transition flex items-start gap-4">
                        <img 
                          src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=990000&color=fff`} 
                          alt={m.name} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-red-100 shadow-xs shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2 py-0.5 rounded-md inline-block mb-1">
                            {m.role}
                          </span>
                          <h4 className="font-black text-sm text-gray-900 truncate">{m.name}</h4>
                          <p className="text-xs text-slate-500 truncate mb-2">{m.department}</p>
                          {m.email && (
                            <a href={`mailto:${m.email}`} className="text-xs text-slate-600 hover:text-[#990000] flex items-center gap-1 font-medium transition">
                              <Mail size={12} /> {m.email}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: BUDGET & SKS REQUESTS */}
              {clubDetailTab === 'budget' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Budget Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tahsis Edilen Yıllık Bütçe</p>
                      <h4 className="text-xl font-black text-gray-900">{selectedClub.budget?.allocated?.toLocaleString('tr-TR') || '45.000'} ₺</h4>
                      <span className="text-[11px] text-slate-500">2026-2027 SKS Bütçesi</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Harcanan Bütçe</p>
                      <h4 className="text-xl font-black text-amber-700">{selectedClub.budget?.spent?.toLocaleString('tr-TR') || '16.500'} ₺</h4>
                      <span className="text-[11px] text-amber-600 font-medium">Onaylı Faturalar</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kalan Kullanılabilir Bütçe</p>
                      <h4 className="text-xl font-black text-emerald-700">{selectedClub.budget?.remaining?.toLocaleString('tr-TR') || '28.500'} ₺</h4>
                      <span className="text-[11px] text-emerald-600 font-bold">Harcanabilir Bakiye</span>
                    </div>
                  </div>

                  {/* SKS Budget Request Pool */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">SKS Bütçe & Etkinlik Talepleri</h3>
                        <p className="text-xs text-slate-500">Kulüp adına Dekanlığa iletilen resmî bütçe onay başvuruları.</p>
                      </div>
                      <button
                        onClick={() => setShowEventModal(true)}
                        className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={16} /> Yeni Bütçe Talebi
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3 px-3">Etkinlik / Talep Adı</th>
                            <th className="pb-3 px-3">Talep Tutarı</th>
                            <th className="pb-3 px-3">Tarih</th>
                            <th className="pb-3 px-3">Durum</th>
                            <th className="pb-3 px-3">SKS Karar Notu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {(selectedClub.budgetRequests || []).map((req, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-3 px-3 font-bold text-gray-900">{req.title || req.eventName}</td>
                              <td className="py-3 px-3 font-bold text-slate-700">{req.amount}</td>
                              <td className="py-3 px-3 text-slate-500">{req.requestedDate || req.date}</td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                  req.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {req.status === 'approved' ? 'Onaylandı' : req.status === 'rejected' ? 'Reddedildi' : 'İnceleniyor'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-500">{req.approvalNote || 'Değerlendirme aşamasında.'}</td>
                            </tr>
                          ))}
                          {(!selectedClub.budgetRequests || selectedClub.budgetRequests.length === 0) && (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400">Henüz bir bütçe talebi kaydı bulunmuyor.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MEMBERS & CONSTITUTION */}
              {clubDetailTab === 'members' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">Kayıtlı Üyeler ({selectedClub.memberCount || 248})</h3>
                      <p className="text-xs text-slate-500">İstanbul Esenyurt Üniversitesi aktif öğrenci üyeleri.</p>
                    </div>
                    {userIsMember ? (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5">
                        <Check size={14} /> Bu kulübün üyesisiniz
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMembershipRequest(selectedClub)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Kulübe Katıl
                      </button>
                    )}
                  </div>

                  {/* Registered members table */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                            <th className="pb-3 px-3">Öğrenci Adı</th>
                            <th className="pb-3 px-3">Bölüm</th>
                            <th className="pb-3 px-3">Kulüp Rolü</th>
                            <th className="pb-3 px-3">Katılım Tarihi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {(selectedClub.members || []).map((mem, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-3 px-3 font-bold text-gray-900">{mem.name}</td>
                              <td className="py-3 px-3 text-slate-600">{mem.department || 'Mühendislik'}</td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                                  {mem.role || 'Aktif Üye'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-400">{mem.joinedDate || '2024'}</td>
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
                      onClick={() => toast.success('Kulüp tüzüğü PDF olarak indirildi. (Mock)')}
                      className="px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-[#990000] font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 shrink-0"
                    >
                      <Download size={15} /> Tüzük İndir (PDF)
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* EVENT & BUDGET REQUEST MODAL */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up">
              <button 
                onClick={() => setShowEventModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-xs font-black text-[#990000] uppercase tracking-wider">SKS Daire Başkanlığı</span>
                <h3 className="text-xl font-black text-gray-900">Etkinlik & Bütçe Onay Başvurusu</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedClub.name} adına resmî talep oluşturun.</p>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Etkinlik Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.name}
                    onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                    placeholder="Örn: Yapay Zeka Hackathonu 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tarih *</label>
                    <input
                      type="date"
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Talep Edilen Bütçe (₺)</label>
                    <input
                      type="number"
                      value={eventForm.budget}
                      onChange={(e) => setEventForm({ ...eventForm, budget: e.target.value })}
                      placeholder="Örn: 15000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Etkinlik Konumu</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="Örn: Merkez Kampüs Konferans Salonu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Açıklama & Gerekçe</label>
                  <textarea
                    rows={3}
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Etkinlik amacı, konuşmacılar ve bütçenin nerede kullanılacağı..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000] resize-none"
                  />
                </div>

                <div className="pt-3 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEventModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={16} /> Talebi İlet
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
          <button onClick={() => setActiveTab('discover')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'discover' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-red-950'}`}>Keşfet</button>
          <button onClick={() => setActiveTab('my_clubs')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'my_clubs' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-red-950'}`}>
            Kulüplerim
            {myJoinedClubs.length > 0 && <span className="ml-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-full">{myJoinedClubs.length}</span>}
          </button>
          {(isAdmin || isDean) && (
            <button onClick={() => setActiveTab('admin')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'admin' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-red-950'}`}>
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={handleApplyClub} className="w-full md:w-auto px-6 py-3 bg-red-950 hover:bg-black text-white font-bold rounded-xl transition shadow flex items-center justify-center gap-2">
                <Plus size={20} /> Yeni Kulüp Kur
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
                      <div className="w-16 h-16 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform bg-white">
                        {club.logo ? <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-2xl" /> : <Building2 size={28} className="text-slate-300" />}
                      </div>
                      <div>
                        <h3 className="font-black text-red-950 leading-tight mb-1 group-hover:text-emerald-600 transition-colors">{club.name}</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{club.category || 'Genel'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 flex-1">{club.description || 'Öğrencilerin akademik ve sosyal gelişimlerini desteklemeyi amaçlamaktadır.'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Users size={14} className="text-slate-400" /> {club.memberCount || 45} Üye
                      </div>
                      {isMemberOfClub(club) && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Üyesiniz</span>}
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my_clubs' && (
          <div className="animate-fade-in space-y-8">
            {myManagedClubs.length > 0 && (
              <>
                <h2 className="text-2xl font-black text-red-950">Yönettiğim Kulüpler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myManagedClubs.map(club => (
                    <div key={club.id} className="bg-white rounded-xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-bl-xl shadow-sm">Yönetici</div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><Trophy size={24} /></div>
                        <div>
                          <h3 className="font-black text-lg text-red-950">{club.name}</h3>
                          <p className="text-sm text-slate-500">{(club.memberRequests || []).filter(r => r.status === 'pending').length} Yeni Üyelik Talebi</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setView('club_admin')} className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-colors text-sm">Paneli Aç</button>
                        <button onClick={() => { setSelectedClub(club); setShowEventModal(true); }} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm">Etkinlik Oluştur</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-2xl font-black text-red-950">Üye Olduğum Kulüpler</h2>
            {myJoinedClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJoinedClubs.map(club => (
                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  key={club.id} onClick={() => setSelectedClub(club)} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={club.logo} alt={club.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <h3 className="font-black text-red-950 group-hover:text-emerald-600 transition-colors">{club.name}</h3>
                        <p className="text-xs text-slate-500">{club.category || 'Genel'}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-200 text-center">
                 <Bell size={40} className="mx-auto text-slate-300 mb-4" />
                 <p className="text-slate-500 mb-4 font-medium">Henüz hiçbir kulübe üye değilsiniz.</p>
                 <button onClick={() => setActiveTab('discover')} className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">Kulüpleri Keşfet</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (isAdmin || isDean) && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-white rounded-xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h2 className="text-xl font-black text-red-950 mb-6 flex items-center gap-2"><ShieldCheck className="text-amber-500"/> Dekanlık Onay Bekleyenler</h2>
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
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${app.type === 'new_club' ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                           {app.type === 'new_club' ? <Building2 size={24} /> : <Wallet size={24} />}
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${app.type === 'new_club' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>
                               {app.type === 'new_club' ? 'Yeni Kulüp Başvurusu' : 'Bütçe Talebi'}
                             </span>
                             <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Clock size={12} /> {app.date}</span>
                           </div>
                           <h3 className="font-bold text-red-950 text-base">{app.name || app.eventName}</h3>
                           <p className="text-xs font-medium text-slate-500 mt-1">{app.applicant ? `Başvuran: ${app.applicant}` : `Kulüp: ${app.club}`} {app.amount && ` • Talep: ${app.amount}`}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         {app.status === 'pending' ? (
                           <>
                             <button 
                               onClick={() => handleApproveApplication(app.id)}
                               className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 font-bold rounded-lg transition-colors text-sm flex items-center gap-1"
                             >
                               <CheckCircle2 size={16} /> Onayla
                             </button>
                             <button 
                               onClick={() => handleRejectApplication(app.id)}
                               className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 font-bold rounded-lg transition-colors text-sm flex items-center gap-1"
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

      {/* CREATE CLUB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="absolute inset-0 bg-red-950/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-20">
              <div>
                <h2 className="text-xl font-black text-red-950">EK-1: Yeni Kulüp Kurma</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Öğrenci Kulübü Resmi Başvuru Formu</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-3 text-amber-800">
                <ShieldCheck className="shrink-0 mt-0.5 text-amber-500" size={20} />
                <div className="text-sm">
                  <p className="font-bold mb-1">Dekanlık Onayı Gerektirir</p>
                  <p className="opacity-90 leading-relaxed text-xs">Formu eksiksiz doldurduğunuzdan emin olun. Başvurunuz Öğrenci Dekanlığı tarafından incelenecek ve onaylandığında kulübünüz platformda aktif hale gelecektir.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitClub} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kulüp Adı *</label>
                  <input 
                    type="text" required value={createForm.name} onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    placeholder="Örn: Bilişim ve Robotik Kulübü" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kategori</label>
                    <select 
                      value={createForm.category} onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm appearance-none"
                    >
                      <option>Bilim ve Teknoloji</option>
                      <option>Kültür ve Sanat</option>
                      <option>Spor</option>
                      <option>Mesleki Esenyurt</option>
                      <option>Sosyal Sorumluluk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Danışman Önerisi</label>
                    <input 
                      type="text" value={createForm.advisor} onChange={(e) => setCreateForm({...createForm, advisor: e.target.value})}
                      placeholder="Örn: Dr. Öğr. Üyesi Ahmet Yılmaz" 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kulübün Amacı ve Hedefleri *</label>
                  <textarea 
                    required value={createForm.purpose} onChange={(e) => setCreateForm({...createForm, purpose: e.target.value})}
                    placeholder="Kulübün üniversite hayatına ve öğrencilere katacağı değerleri detaylıca açıklayınız..." 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm min-h-[100px] resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kısa Tanıtım (Ağda Görünecek) *</label>
                  <textarea 
                    required value={createForm.description} onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    placeholder="Diğer öğrencilerin göreceği kısa bir tanıtım yazısı..." 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm min-h-[80px] resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm">
                    İptal
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-red-950 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-md flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} /> Başvuruyu Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EVENT APPLICATION MODAL (EK-2) */}
      {showEventModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="absolute inset-0 bg-red-950/60 backdrop-blur-sm" onClick={() => setShowEventModal(false)}></div>
          <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-20">
              <div>
                <h2 className="text-xl font-black text-red-950">EK-2: Etkinlik Başvurusu</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Bütçe ve Mekan Talep Formu</p>
              </div>
              <button onClick={() => setShowEventModal(false)} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 mb-6 flex gap-3 text-sky-800">
                <Calendar className="shrink-0 mt-0.5 text-red-500" size={20} />
                <div className="text-sm">
                  <p className="font-bold mb-1">Dekanlık Onayı</p>
                  <p className="opacity-90 leading-relaxed text-xs">Etkinlik mekanının tahsisi ve varsa bütçe talebiniz Öğrenci Dekanlığı tarafından incelenecektir. Lütfen etkinlik tarihinden en az 15 gün önce başvurunuzu yapınız.</p>
                </div>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Etkinlik Adı *</label>
                  <input 
                    type="text" required value={eventForm.name} onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                    placeholder="Örn: Kariyer Zirvesi 2026" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tarih ve Saat *</label>
                    <input 
                      type="datetime-local" required value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Talep Edilen Mekan</label>
                    <input 
                      type="text" value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      placeholder="Örn: Ana Konferans Salonu" 
                      className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Bütçe Talebi (TL)</label>
                  <input 
                    type="number" value={eventForm.budget} onChange={(e) => setEventForm({...eventForm, budget: e.target.value})}
                    placeholder="Bütçe talebiniz yoksa boş bırakın" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">İçerik ve Amacı *</label>
                  <textarea 
                    required value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    placeholder="Etkinlikte neler yapılacak? Konuşmacılar kimler?" 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-red-900 rounded-xl px-4 py-3 outline-none transition-colors text-sm min-h-[100px] resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowEventModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm">
                    İptal
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-red-950 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-md flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} /> Gönder
                  </button>
                </div>
              </form>
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
