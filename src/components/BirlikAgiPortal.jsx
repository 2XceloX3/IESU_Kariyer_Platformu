import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Trophy, Zap, Star, Search, Plus, Bell, ChevronRight, 
  Map, Activity, Heart, MessageCircle, Share2, Play, Building2,
  Calendar, CheckCircle2, Award, Briefcase, Sparkles, Navigation,
  Globe, Radio, Mic, Headset, UserCircle2, X, Send
} from 'lucide-react';
import Logo from './Logo';
import { toast } from './shared/Toast';
import useAppStore from '../store/useAppStore';

export default function BirlikAgiPortal({ currentUser, setView, previousView, setSelectedGroupId, setSelectedUserId }) {
  const { clubs, groups, posts, setPosts, missions, userMissions, setUserMissions, liveRooms, marketplaceItems, sspEnabled, featureSSPLeaderboard, userRole } = useAppStore();
  const [activeTab, setActiveTab] = useState('feed'); // feed, marketplace, map, live
  const [searchQuery, setSearchQuery] = useState('');
  
  // MODAL STATES
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeRepostModal, setActiveRepostModal] = useState(null);
  const [activeShareModal, setActiveShareModal] = useState(null);
  const [shareTarget, setShareTarget] = useState('');
  const [shareText, setShareText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [repostComment, setRepostComment] = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const [activeMapNode, setActiveMapNode] = useState(null);

  

  const [availableUsers, setAvailableUsers] = useState([]);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('igu_students_v3')) || [];
      const a = JSON.parse(localStorage.getItem('igu_alumni_v3')) || [];
      setAvailableUsers([...s, ...a].filter(u => u.source !== 'demo_seed'));
    } catch(e){}
  }, []);

  const handleLike = (postId) => {
    setFeedPosts(prev => prev.map(p => {
      if(p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.likes + (p.isLiked ? -1 : 1) };
      }
      return p;
    }));
  };

  // 1. HİKAYELER (STORIES) - Instagram Style
  const mockStories = [
    { id: 1, name: 'Yapay Zeka Kulübü', logo: 'https://ui-avatars.com/api/?name=AI&background=0f172a&color=fff', hasUnseen: true },
    { id: 2, name: 'Robotik Topluluğu', logo: 'https://ui-avatars.com/api/?name=ROB&background=e11d48&color=fff', hasUnseen: true },
    { id: 3, name: 'Girişimcilik Vakfı', logo: 'https://ui-avatars.com/api/?name=GV&background=16a34a&color=fff', hasUnseen: false },
    { id: 4, name: 'Münazara Kulübü', logo: 'https://ui-avatars.com/api/?name=MK&background=0284c7&color=fff', hasUnseen: false },
    { id: 5, name: 'Google DSC', logo: 'https://ui-avatars.com/api/?name=GDSC&background=ea4335&color=fff', hasUnseen: false },
    { id: 6, name: 'Tiyatro Kulübü', logo: 'https://ui-avatars.com/api/?name=TK&background=9333ea&color=fff', hasUnseen: false },
  ];

  // 4. FEED POSTS - LinkedIn Style
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 301,
      author: { name: 'Girişimcilik Vakfı', role: 'Öğrenci Topluluğu', logo: 'https://ui-avatars.com/api/?name=GV&background=16a34a&color=fff' },
      time: '1 saat önce',
      content: 'Büyük gün geldi! 🚀 Yılın en büyük Girişimcilik Zirvesi için biletler tükendi. Katılım sağlayan herkese teşekkür ederiz. Yarın sabah 09:00\'da Ana Kampüs Konferans Salonu\'nda görüşmek üzere! #Girişimcilik #İnovasyon',
      image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80',
      likes: 156, comments: 24, shares: 12,
      isLiked: false
    },
    {
      id: 302,
      author: { name: 'Ahmet Yılmaz', role: 'Bilgisayar Mühendisliği (3. Sınıf)', logo: 'https://ui-avatars.com/api/?name=AY&background=f59e0b&color=fff' },
      time: '3 saat önce',
      content: 'Yapay Zeka Kulübü\'nün düzenlediği "PyTorch ile Derin Öğrenme" atölyesinden harika bir sertifika ile ayrılıyorum. Emeği geçen tüm eğitmenlere teşekkürler! 💻🧠',
      image: null,
      likes: 89, comments: 5, shares: 1,
      isLiked: true
    }
  ]);

  const handleApplyMission = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    
    // Zaten üstlenmiş mi?
    if (userMissions.some(um => um.id === missionId)) {
      toast.info('Bu görevi zaten üstlendiniz.');
      return;
    }

    setUserMissions([...userMissions, { ...mission, status: 'Devam Ediyor', acceptedAt: new Date().toISOString() }]);
    toast.success('Görevi üstlendiniz! Profilinizdeki Görevler sekmesinden takip edebilirsiniz.');
  };

  
  const handleSubmitRepost = () => {
    if (!activeRepostModal) return;
    const newPost = {
      id: Date.now(),
      author: { name: currentUser?.name || 'Ben', role: currentUser?.department || 'Öğrenci', logo: currentUser?.avatar || 'https://ui-avatars.com/api/?name=CU&background=random' },
      time: 'Az önce',
      content: repostComment,
      repostedFrom: activeRepostModal,
      likes: 0, comments: 0, shares: 0,
      isLiked: false
    };
    setFeedPosts([newPost, ...feedPosts]);
    toast.success('Gönderi başarıyla paylaşıldı!');
    setActiveRepostModal(null);
    setRepostComment('');
  };

  const handleJoinRoom = (roomId) => {
    const room = liveRooms.find(r => r.id === roomId);
    if (room) {
      setActiveRoom(room);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans pb-20">
      
      {/* 🌟 PREMIUM NAVBAR 🌟 */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer group" onClick={() => {
              if (previousView && previousView !== 'birlik_agi' && previousView !== 'login') {
                setView(previousView);
              } else if (currentUser) {
                const roles = { 'admin': 'admin', 'company': 'company', 'academic': 'academic', 'alumni': 'alumni' };
                setView(roles[userRole] || 'student');
              } else {
                setView('landing');
              }
            }}>
              <Logo className="w-auto h-8 text-indigo-600 group-hover:scale-105 transition-transform" />
            </div>
            
            <div className="hidden md:flex relative ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Kulüp, kişi, etkinlik veya görev ara..." 
                className="w-80 pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors">
              <MessageCircle size={20} />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <button className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
              <img src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=CU'} alt="User" className="w-8 h-8 rounded-full shadow-sm" />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{currentUser?.name || 'Kullanıcı'}</p>
                <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1"><Zap size={10} className="fill-emerald-600"/> 1250 SSP</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* CANLI AKTİVİTELER BANTI (TICKER) */}
      <div className="bg-indigo-900 text-indigo-100 py-1.5 overflow-hidden border-b border-indigo-950 flex items-center relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-indigo-900 to-transparent z-10 flex items-center pl-4 font-black text-xs uppercase tracking-widest text-white shadow-lg">CANLI</div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-indigo-900 to-transparent z-10"></div>
        <div className="whitespace-nowrap flex animate-[marquee_20s_linear_infinite] gap-12 text-[13px] font-semibold pl-24">
          <span className="flex items-center gap-2"><Trophy size={14} className="text-yellow-400"/> Ahmet Y. "Bahar Şenliği" görevinden 150 SSP kazandı!</span>
          <span className="flex items-center gap-2"><Mic size={14} className="text-red-400"/> Yazılım Kulübü'nün Canlı Odası 124 dinleyiciye ulaştı!</span>
          <span className="flex items-center gap-2"><Star size={14} className="text-orange-400"/> Kariyer Merkezi yeni Birlik Pazarı ürünleri ekledi.</span>
          <span className="flex items-center gap-2"><Users size={14} className="text-emerald-400"/> Robotik Topluluğu'na 12 yeni üye katıldı.</span>
          {/* Double it for infinite loop effect */}
          <span className="flex items-center gap-2"><Trophy size={14} className="text-yellow-400"/> Ahmet Y. "Bahar Şenliği" görevinden 150 SSP kazandı!</span>
          <span className="flex items-center gap-2"><Mic size={14} className="text-red-400"/> Yazılım Kulübü'nün Canlı Odası 124 dinleyiciye ulaştı!</span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}} />

      {/* 🚀 STORIES BAR (Instagram Style) 🚀 */}
      <div className="bg-white border-b border-gray-200/50 shadow-sm overflow-x-auto hide-scrollbar">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 flex gap-4">
          <div className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors relative">
              <Plus size={24} className="text-gray-500" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-white">
                <Plus size={12} strokeWidth={4} />
              </div>
            </div>
            <span className="text-[11px] font-bold text-gray-600">Durum Ekle</span>
          </div>
          
          {mockStories.map(story => (
            <div key={story.id} onClick={() => setActiveStory(story)} className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group">
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.hasUnseen ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600' : 'bg-gray-200'} transition-all`}>
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <img src={story.logo} alt={story.name} className="w-full h-full rounded-full object-cover group-hover:scale-95 transition-transform" />
                </div>
              </div>
              <span className={`text-[11px] w-16 truncate text-center ${story.hasUnseen ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 💎 MAIN CONTENT GRID 💎 */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile & Missions */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          
          {/* User Gamification Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
            <div className="h-16 bg-gradient-to-r from-indigo-600 to-violet-600"></div>
            <div className="px-5 pb-5">
              <div className="relative -mt-8 flex justify-between items-end mb-4">
                <img src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=CU'} alt="User" className="w-16 h-16 rounded-2xl border-4 border-white shadow-md bg-white object-cover" />
                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 border border-amber-200 shadow-sm">
                  <Trophy size={14} /> Elit Üye
                </div>
              </div>
              <h2 className="font-black text-lg text-gray-900">{currentUser?.name || 'Kullanıcı'}</h2>
              <p className="text-xs text-gray-500 mb-4">{currentUser?.department || 'Öğrenci'} • {currentUser?.title || '3. Sınıf'}</p>
              
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-4">
                {sspEnabled && (<div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase">Sosyal Sorumluluk</p>
                  <p className="text-xl font-black text-indigo-900 flex items-center gap-1">1,250 <Zap size={18} className="text-amber-500 fill-amber-500"/></p>
                </div>)}
                <div className="h-8 w-px bg-indigo-200"></div>
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase">Görevler</p>
                  <p className="text-xl font-black text-indigo-900">12</p>
                </div>
              </div>

              <div className="space-y-1">
                <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">Kulüplerim</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-700">3</span>
                </button>
                <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600">Etkinliklerim</span>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-700">5</span>
                </button>
              </div>
            </div>
          </div>

          {sspEnabled && (<>
          {/* Micro-Missions (Sosyal Sorumluluk) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-black text-gray-900 flex items-center gap-2"><TargetIcon size={18} className="text-rose-500"/> Sosyal Sorumluluk</h3>
               <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Tümü</button>
             </div>
             <p className="text-xs text-gray-500 mb-4">Sosyal sorumluluk projelerine katıl, Gönüllülük Puanı kazan!</p>
             
             <div className="space-y-3">
               {missions.map(mission => (
                 <div key={mission.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200">{mission.type}</span>
                     <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{mission.time}</span>
                   </div>
                   <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{mission.title}</h4>
                   <p className="text-[11px] text-gray-500 mb-3">{mission.club}</p>
                   
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-black text-amber-600 flex items-center gap-1"><Zap size={12} className="fill-amber-600"/> {mission.points} GP</span>
                     <button onClick={() => handleApplyMission(mission.id)} className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                       Üstlen
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          </>)}

        </div>

        {/* MIDDLE COLUMN: Feed */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1.5 flex gap-1 sticky top-20 z-40">
            <button onClick={() => setActiveTab('feed')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'feed' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
              <Activity size={18} /> Ağ Akışı
            </button>
            
            
            <button onClick={() => setView('club_portal')} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
              <Building2 size={18} /> Kulüp Dizini
            </button>
          </div>

          {activeTab === 'feed' && (
            <div className="animate-fade-in-up space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                <div className="flex gap-3">
                  <img src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=CU'} alt="User" className="w-10 h-10 rounded-full bg-gray-100 object-cover" />
                  <button className="flex-1 text-left px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-sm font-medium text-gray-500">
                    Ağınızla bir şeyler paylaşın...
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex gap-1">
                    <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold">
                      <Image size={18} /> <span className="hidden sm:inline">Medya</span>
                    </button>
                    <button className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold">
                      <Calendar size={18} /> <span className="hidden sm:inline">Etkinlik</span>
                    </button>
                    <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold">
                      <Briefcase size={18} /> <span className="hidden sm:inline">Fırsat</span>
                    </button>
                  </div>
                  <button className="px-4 py-1.5 bg-gray-900 text-white text-sm font-bold rounded-lg opacity-50 cursor-not-allowed">
                    Gönder
                  </button>
                </div>
              </div>

              {/* Feed Items */}
              {feedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 flex justify-between items-start">
                    <div className="flex gap-3">
                      <img src={post.author.logo} alt={post.author.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight flex items-center gap-1 hover:text-indigo-600 cursor-pointer">
                          {post.author.name}
                          {post.author.role.includes('Topluluğu') && <CheckCircle2 size={14} className="text-blue-500" />}
                        </h4>
                        <p className="text-[11px] text-gray-500">{post.author.role}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{post.time}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <div className="px-4 pb-3">
                    <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
                  </div>

                  
                  {post.repostedFrom && (
                    <div className="mx-4 mb-3 p-3 border border-gray-200 rounded-xl bg-gray-50/50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex gap-2 items-center mb-2">
                        <img src={post.repostedFrom.author.logo} alt="" className="w-5 h-5 rounded-full" />
                        <span className="text-xs font-bold text-gray-800">{post.repostedFrom.author.name}</span>
                        <span className="text-[10px] text-gray-500">{post.repostedFrom.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-3">{post.repostedFrom.content}</p>
                      {post.repostedFrom.image && (
                        <img src={post.repostedFrom.image} className="w-full h-32 object-cover rounded-lg mt-2" alt="Original" />
                      )}
                    </div>
                  )}

                  {post.image && !post.repostedFrom && (
                    <div className="w-full bg-gray-100 max-h-[400px] overflow-hidden">
                      <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="px-4 py-2 flex items-center justify-between text-[11px] text-gray-500 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center"><Heart size={8} className="text-white fill-white"/></div>
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center"><Zap size={8} className="text-white fill-white"/></div>
                      </div>
                      <span className="ml-1">{post.likes}</span>
                    </div>
                    <div className="flex gap-3">
                      <span>{post.comments} Yorum</span>
                      <span>{post.shares} Paylaşım</span>
                    </div>
                  </div>

                  <div className="px-2 py-1 flex justify-between items-center bg-gray-50/50">
                    <button onClick={() => handleLike(post.id)} className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-xl transition-colors font-bold text-sm ${post.isLiked ? 'text-rose-600' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <Heart size={20} className={post.isLiked ? "fill-rose-600" : ""} /> Beğen
                    </button>
                    <button onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)} className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl transition-colors font-bold text-sm text-gray-600 hover:bg-gray-100">
                      <MessageCircle size={20} /> Yorum
                    </button>
                    <button onClick={() => setActiveRepostModal(post)} className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl transition-colors font-bold text-sm text-gray-600 hover:bg-gray-100">
                      <Share2 size={20} /> Paylaş
                    </button>
                    <button onClick={() => setActiveShareModal(post)} className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl transition-colors font-bold text-sm text-gray-600 hover:bg-gray-100">
                      <Send size={20} /> Gönder
                    </button>
                  </div>

                  {activeCommentPost === post.id && (
                    <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center gap-3">
                      <img src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=CU'} alt="" className="w-8 h-8 rounded-full" />
                      <input 
                        type="text" 
                        placeholder="Bir yorum yaz..." 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && commentText.trim()) {
                            toast.success('Yorumunuz eklendi!');
                            setFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments: p.comments + 1 } : p));
                            setCommentText('');
                            setActiveCommentPost(null);
                          }
                        }}
                        className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
                      />
                      <button 
                        disabled={!commentText.trim()}
                        onClick={() => {
                          toast.success('Yorumunuz eklendi!');
                          setFeedPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments: p.comments + 1 } : p));
                          setCommentText('');
                          setActiveCommentPost(null);
                        }}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-gray-300"
                      >
                        <Send size={14} className="ml-0.5" />
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          

        </div>

        {/* RIGHT COLUMN: Live Rooms & Networking */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          
          {/* Canlı Sesli Odalar (Discord/Clubhouse Style) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><Radio size={18} className="text-rose-500 animate-pulse"/> Canlı Odalar</h3>
              {(userRole === 'admin' || userRole === 'club_president') ? <button className="text-gray-400 hover:text-gray-600"><Plus size={20}/></button> : <button className="text-gray-300 cursor-not-allowed opacity-50" title="Sadece Yöneticiler Oda Açabilir"><Plus size={20}/></button>}
            </div>
            
            <div className="p-2 space-y-2 bg-gray-50">
              {liveRooms.map(room => (
                <div key={room.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group" onClick={() => setActiveRoom(room)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">{room.host?.name || room.host}</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> CANLI
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 leading-snug mb-3 group-hover:text-indigo-600">{room.title}</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      <img src={room.host?.logo || "https://ui-avatars.com/api/?name=A&background=random"} className="w-6 h-6 rounded-full border-2 border-white relative z-30 object-cover" alt=""/>
                      <img src="https://ui-avatars.com/api/?name=B&background=random" className="w-6 h-6 rounded-full border-2 border-white relative z-20" alt=""/>
                      <img src="https://ui-avatars.com/api/?name=C&background=random" className="w-6 h-6 rounded-full border-2 border-white relative z-10" alt=""/>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <span className="flex items-center gap-1"><Mic size={12}/> {room.speakers || Math.floor(Math.random() * 5) + 1}</span>
                      <span className="flex items-center gap-1"><Headset size={12}/> {room.listeners}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-white text-center border-t border-gray-100">
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Tüm Odaları Gör</button>
            </div>
          </div>

          {sspEnabled && featureSSPLeaderboard && (<>
          {/* Leaderboard (Haftanın En Aktifleri) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="font-black text-amber-900 flex items-center gap-2"><Trophy size={18} className="text-amber-500"/> Haftanın Liderleri</h3>
            </div>
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-md">1</div>
                   <div>
                     <p className="text-sm font-bold text-gray-900">Ahmet Yılmaz</p>
                     <p className="text-[10px] text-gray-500">Yazılım Kulübü</p>
                   </div>
                 </div>
                 <div className="text-sm font-black text-amber-600">3450 SSP</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center font-black text-sm shadow-inner">2</div>
                   <div>
                     <p className="text-sm font-bold text-gray-900">Zeynep Kaya</p>
                     <p className="text-[10px] text-gray-500">Kariyer Merkezi</p>
                   </div>
                 </div>
                 <div className="text-sm font-black text-gray-600">2890 SSP</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-300 text-white flex items-center justify-center font-black text-sm shadow-inner">3</div>
                   <div>
                     <p className="text-sm font-bold text-gray-900">Caner Demir</p>
                     <p className="text-[10px] text-gray-500">Tiyatro Kulübü</p>
                   </div>
                 </div>
                 <div className="text-sm font-black text-gray-600">2100 SSP</div>
              </div>
              
              {/* Current User Rank */}
              <div className="mt-2 border-t border-gray-100 pt-2 px-3 pb-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Sizin Sıranız</span>
                  <span className="text-xs font-black text-indigo-600">#42 (1250 SSP)</span>
                </div>
              </div>
            </div>
          </div>
          </>)}

          {/* AI Eşleşme Widget */}
          <div className="bg-gradient-to-br from-indigo-900 to-violet-900 rounded-2xl border border-indigo-700 shadow-lg p-5 relative overflow-hidden mt-6 group cursor-pointer hover:shadow-indigo-500/20 transition-all">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1"><Sparkles size={12}/> AI Mentor Önerisi</span>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm">%94 Uyum</span>
              </div>
              <h3 className="font-black text-white text-lg leading-tight mb-1">Yapay Zeka Kulübü</h3>
              <p className="text-indigo-200 text-xs font-medium mb-4">"İlgilendiğin Python ve Makine Öğrenimi alanlarında aktif projeler geliştiriyorlar."</p>
              <button className="w-full bg-white text-indigo-900 text-sm font-bold py-2 rounded-xl hover:bg-indigo-50 transition shadow-sm">Kulübe Katıl</button>
            </div>
          </div>


          {/* Ağındaki Yeni Üyeler / Öneriler */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-black text-gray-900 mb-4">Ağınıza Ekleyin</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=User+${i}&background=random`} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">Yazılımcı {i}</h4>
                      <p className="text-[10px] text-gray-500">Yazılım Kulübü Üyesi</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-600 transition-colors border border-gray-200">
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CANLI ODA MODALI */}
      {activeRoom && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 rounded-xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-700 relative">
            
            {/* Kapat Butonu */}
            <button onClick={() => setActiveRoom(null)} className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-full transition z-10">
              <span className="sr-only">Kapat</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-800 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="w-16 h-16 bg-gray-800 rounded-xl mx-auto flex items-center justify-center mb-4 border border-gray-700 shadow-inner">
                <Mic size={32} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-black text-white leading-tight mb-1">{activeRoom.title}</h2>
              <p className="text-sm font-medium text-gray-400">{activeRoom.host}</p>
            </div>
            
            {/* Speakers / Listeners Area */}
            <div className="p-6 bg-gray-900/50 min-h-[250px] max-h-[400px] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konuşmacılar</span>
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Headset size={14}/> {activeRoom.listeners} Dinleyici</span>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Host */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeRoom.host)}&background=4f46e5&color=fff`} className="w-16 h-16 rounded-full border-2 border-indigo-500 p-0.5 object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1 border-2 border-gray-900">
                      <Mic size={10} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-300 truncate w-20 text-center">Moderatör</span>
                </div>
                
                {/* Speaker 2 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <img src="https://ui-avatars.com/api/?name=Ahmet+Y.&background=374151&color=fff" className="w-16 h-16 rounded-full border-2 border-transparent p-0.5 object-cover" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 truncate w-20 text-center">Ahmet Y.</span>
                </div>
                
                {/* Speaker 3 */}
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <div className="relative">
                    <img src="https://ui-avatars.com/api/?name=Zeynep+K.&background=374151&color=fff" className="w-16 h-16 rounded-full border-2 border-transparent p-0.5 object-cover" />
                    <div className="absolute -bottom-1 -right-1 bg-gray-700 text-gray-400 rounded-full p-1 border-2 border-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-500 truncate w-20 text-center">Zeynep K.</span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer Controls */}
            <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
              <button className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-700 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                Notlar
              </button>
              <button onClick={() => { toast.success("Söz hakkı istendi. Moderatör onayladığında konuşabilirsiniz."); }} className="px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-700 text-white hover:bg-gray-600 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Söz İste
              </button>
              <button onClick={() => setActiveRoom(null)} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition">
                Ayrıl
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HİKAYE (STORY) MODALI */}
      {activeStory && (
        <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center">
          <div className="w-full max-w-sm h-[90vh] sm:h-[800px] bg-gray-900 rounded-xl overflow-hidden relative shadow-2xl animate-fade-in-up">
            
            {/* Story Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
              <div className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                <div className="h-full bg-white w-1/3"></div>
              </div>
              <div className="h-1 bg-white/30 rounded-full flex-1"></div>
            </div>
            
            {/* Story Header */}
            <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20">
              <div className="flex items-center gap-2">
                <img src={activeStory.logo} className="w-8 h-8 rounded-full border border-white/20" />
                <span className="text-white text-sm font-bold drop-shadow-md">{activeStory.name}</span>
                <span className="text-white/70 text-xs ml-1">2s</span>
              </div>
              <button onClick={() => setActiveStory(null)} className="text-white/80 hover:text-white transition p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Story Content Background */}
            <img src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
            
            {/* Story Interactivity */}
            <div className="absolute bottom-16 left-6 right-6">
              <h2 className="text-white text-2xl font-black mb-2 drop-shadow-lg">Girişimcilik Zirvesi'ne Son 1 Gün!</h2>
              <p className="text-white/90 text-sm font-medium drop-shadow-md">Kayıt olmayanlar için son biletler profildeki linkte.</p>
            </div>

            {/* Story Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-20">
              <input type="text" placeholder="Mesaj gönder..." className="flex-1 bg-black/40 border border-white/20 rounded-full px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 backdrop-blur-md" />
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition">
                <Heart size={20} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition">
                <Send size={20} />
              </button>
            </div>
            
          </div>
        </div>
      )}


      
      {/* SHARE MODAL */}
      {activeShareModal && (
        <div className="fixed inset-0 z-[120] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2"><Send size={18} className="text-indigo-600"/> Gönderiyi Paylaş</h2>
              <button onClick={() => setActiveShareModal(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={20}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Kime Göndermek İstiyorsunuz?</label>
                <select value={shareTarget} onChange={e=>setShareTarget(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20">
                  <option value="">Kişi Seçin...</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.department || u.companyName || u.title})</option>
                  ))}
                  {availableUsers.length === 0 && <option value="demo_user">Demo Kullanıcı - Ahmet Yılmaz</option>}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mesajınız (İsteğe Bağlı)</label>
                <textarea 
                  value={shareText} onChange={e=>setShareText(e.target.value)}
                  placeholder="Bu gönderi ilgini çekebilir..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex gap-3 opacity-80 pointer-events-none">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  {activeShareModal.image ? <img src={activeShareModal.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-500 font-bold">Resimsiz</span></div>}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{activeShareModal.author?.name}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1 break-words">{activeShareModal.content}</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
              <button onClick={() => { setActiveShareModal(null); setShareTarget(''); setShareText(''); }} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition active:scale-95">İptal</button>
              <button 
                disabled={!shareTarget && availableUsers.length > 0} 
                onClick={() => {
                  toast.success('Mesaj başarıyla gönderildi!');
                  setActiveShareModal(null);
                  setShareTarget('');
                  setShareText('');
                }} 
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition shadow-md active:scale-95"
              >
                Mesaj Olarak Gönder
              </button>
            </div>
          </div>
        </div>
      )}


      {/* REPOST MODAL */}
      {activeRepostModal && (
        <div className="fixed inset-0 z-[120] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-gray-900">Alıntılayarak Paylaş</h2>
              <button onClick={() => setActiveRepostModal(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={20}/></button>
            </div>
            <div className="p-4">
              <div className="flex gap-3 mb-4">
                <img src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=CU'} alt="" className="w-10 h-10 rounded-full" />
                <textarea 
                  autoFocus
                  placeholder="Bu gönderi hakkında düşüncelerinizi ekleyin..." 
                  className="flex-1 resize-none h-24 border-none outline-none text-gray-800"
                  value={repostComment}
                  onChange={(e) => setRepostComment(e.target.value)}
                />
              </div>
              <div className="p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                <div className="flex gap-2 items-center mb-2">
                  <img src={activeRepostModal.author.logo} alt="" className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-bold text-gray-800">{activeRepostModal.author.name}</span>
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">{activeRepostModal.content}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
              <button onClick={() => { setActiveRepostModal(null); setRepostComment(''); }} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
              <button onClick={handleSubmitRepost} disabled={!repostComment.trim()} className="px-4 py-2 font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">Paylaş</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Helper icons that aren't imported directly
function TargetIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
}
function Image(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function MoreHorizontal(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
}
