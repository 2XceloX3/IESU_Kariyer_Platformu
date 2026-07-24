import React, { useState } from 'react';
import { 
  Users, Search, Plus, FileText, X, UserPlus, Info, 
  Play, Star, Briefcase, Zap, Heart, MessageCircle, Share2, 
  MapPin, Calendar, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { toast } from './shared/Toast';

export default function ClubsDirectory({ 
  clubs, setClubs, 
  clubApplications, setClubApplications, 
  currentUser, featureClubApplications 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({ name: '', purpose: '', advisorName: '' });
  const [joinForm, setJoinForm] = useState({ department: '', motivation: '', skills: '' });

  // Mock Stories Data (Instagram Style)
  const mockStories = [
    { id: 1, club: 'Doğa ve Kamp', image: 'https://images.unsplash.com/photo-1504280387969-a14af12b4041?auto=format&fit=crop&w=150&q=80', active: true },
    { id: 2, club: 'Girişimcilik', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=150&q=80', active: true },
    { id: 3, club: 'Müzik', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=150&q=80', active: false },
    { id: 4, club: 'Robotik', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=150&q=80', active: true },
    { id: 5, club: 'Tiyatro', image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=150&q=80', active: false },
  ];

  // Mock Feed Posts (LinkedIn Style)
  const feedPosts = [
    {
      id: 1,
      author: { name: 'Genç Yeşilay Kulübü', logo: 'https://ui-avatars.com/api/?name=GY&background=10B981&color=fff' },
      time: '2 saat önce',
      content: 'Bağımlılıkla mücadele seminerimiz için son hazırlıklar tamamlandı! Yarın saat 14:00\'te A Blok Konferans Salonu\'nda görüşmek üzere. 🚀',
      image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80',
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      author: { name: 'Yazılım Geliştiricileri', logo: 'https://ui-avatars.com/api/?name=YG&background=2563EB&color=fff' },
      time: '5 saat önce',
      content: 'Bahar dönemi Hackathon kayıtları açıldı! Ekibini kur, projeni geliştir ve büyük ödülü kazan. Kayıt linki profilde. 💻✨',
      likes: 128,
      comments: 34
    }
  ];

  // Mock Missions (Görev Havuzu)
  const missions = [
    { id: 1, title: 'Fotoğrafçı Aranıyor', club: 'Medya Kulübü', points: 50, time: 'Yarın 14:00', icon: <Play size={16} /> },
    { id: 2, title: 'Stand Görevlisi', club: 'Kariyer Kulübü', points: 30, time: 'Perşembe 10:00', icon: <Users size={16} /> },
  ];

  const handleApplyClub = (e) => {
    e.preventDefault();
    const newApp = {
      id: `APP-${Date.now()}`,
      ...applicationForm,
      userId: currentUser?.id || 'STU-999',
      date: new Date().toISOString(),
      status: 'Öğrenci Dekanlığı Onayı Bekliyor'
    };
    setClubApplications([...(clubApplications || []), newApp]);
    setShowApplicationModal(false);
    setApplicationForm({ name: '', purpose: '', advisorName: '' });
    toast.success('Kulüp başvurunuz Öğrenci Dekanlığına iletildi.');
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!selectedClub) return;
    
    const request = {
      id: `REQ-${Date.now()}`,
      userId: currentUser?.id || 'STU-999',
      userName: currentUser?.name || 'Öğrenci',
      department: joinForm.department,
      motivation: joinForm.motivation,
      skills: joinForm.skills,
      status: 'pending',
      date: new Date().toISOString()
    };

    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        return { ...c, memberRequests: [...(c.memberRequests || []), request] };
      }
      return c;
    });

    setClubs(updatedClubs);
    setSelectedClub({ ...selectedClub, memberRequests: [...(selectedClub.memberRequests || []), request] });
    setShowJoinModal(false);
    setJoinForm({ department: '', motivation: '', skills: '' });
    toast.success(`${selectedClub.name} kulübüne katılım talebiniz (yetenek profili ile) iletildi.`);
  };

  const takeMission = (mission) => {
    toast.success(`Tebrikler! "${mission.title}" görevini üstlendiniz. Tamamlandığında +${mission.points} Birlik Puanı kazanacaksınız.`);
  };

  const filteredClubs = (clubs || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-50 min-h-screen rounded-xl overflow-hidden shadow-inner border border-slate-200">
      
      {/* 1. STORIES BAR (Instagram Style) */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Birlik Ağı <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Yeni</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Kulüpler, topluluklar ve senin için fırsatlar.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.toast && window.toast.info("Anka AI: Profilinizdeki yetkinlikler ve ilgi alanlarınız taranıyor...");
                setTimeout(() => {
                  window.toast && window.toast.success("✅ AI Eşleşmesi: İlgi alanlarınıza en uygun kulüp '%95 eşleşme' ile 'Yapay Zeka ve Yazılım Kulübü'. Kulüp daveti size iletildi.");
                }, 2500);
              }}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 rounded-xl text-sm font-bold transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
              AI ile Bana Kulüp Bul
            </button>
            {featureClubApplications && (
              <button 
                onClick={() => setShowApplicationModal(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold transition shadow flex items-center gap-2"
              >
                <Plus size={16} /> Kulüp Kur
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide">
          <div className="flex flex-col items-center gap-1 cursor-pointer shrink-0">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 hover:bg-slate-200 transition-colors">
              <Plus className="text-slate-400" />
            </div>
            <span className="text-xs font-bold text-slate-600">Hikaye Ekle</span>
          </div>
          
          {mockStories.map(story => (
            <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group">
              <div className={`w-16 h-16 rounded-full p-[2px] ${story.active ? 'bg-gradient-to-tr from-emerald-400 to-teal-600' : 'bg-slate-300'} transition-transform group-hover:scale-105`}>
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-white">
                  <img src={story.image} alt={story.club} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 truncate w-16 text-center">{story.club}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: User Profile & Missions */}
        <div className="lg:col-span-3 space-y-6">
          {/* Professional Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
            <div className="h-16 bg-gradient-to-r from-slate-800 to-slate-700 relative">
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full p-1 border border-slate-200">
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                  {currentUser?.name?.charAt(0) || 'Ö'}
                </div>
              </div>
            </div>
            <div className="pt-8 pb-4 text-center px-4">
              <h3 className="font-bold text-slate-900">{currentUser?.name || 'Öğrenci'}</h3>
              <p className="text-xs text-slate-500 mb-4">{currentUser?.department || 'Bilgisayar Mühendisliği'}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="fill-current" /> 450 Birlik Puanı
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between text-xs font-medium text-slate-500 px-2">
                <span className="flex flex-col items-center"><strong className="text-slate-800 text-sm">2</strong> Üye Olunan</span>
                <span className="flex flex-col items-center"><strong className="text-slate-800 text-sm">5</strong> Görevler</span>
              </div>
            </div>
          </div>

          {/* Micro-Missions (Görev Havuzu) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-colors">
            <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Zap size={16} className="text-amber-500 fill-amber-500" /> Görev Havuzu
            </h3>
            <p className="text-xs text-slate-500 mb-4">Kulüplere destek ol, puan kazan.</p>
            
            <div className="space-y-3">
              {missions.map(m => (
                <div key={m.id} className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-100 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">{m.title}</h4>
                      <p className="text-[11px] text-slate-500">{m.club}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">+{m.points}p</span>
                  </div>
                  <button onClick={() => takeMission(m)} className="w-full py-1.5 bg-white border border-slate-200 group-hover:border-emerald-300 group-hover:text-emerald-700 group-hover:bg-emerald-50 rounded-lg text-xs font-bold text-slate-600 transition-colors">
                    Görevi Al
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Feed (LinkedIn Style) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Post Composer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex gap-3 items-center hover:border-slate-300 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex shrink-0 items-center justify-center text-emerald-600 font-bold border border-emerald-200">
              {currentUser?.name?.charAt(0) || 'Ö'}
            </div>
            <div className="flex-1 text-left px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-500 font-medium transition-colors hover:bg-slate-100">
              Kulüplerle bir fikir paylaş...
            </div>
          </div>

          {/* Feed Posts */}
          {feedPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <img src={post.author.logo} alt={post.author.name} className="w-10 h-10 rounded-xl border border-slate-100 shadow-sm group-hover:scale-105 transition-transform" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">{post.author.name}</h4>
                    <p className="text-[11px] text-slate-500">{post.time}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-emerald-600 p-2 rounded-full hover:bg-emerald-50 transition-colors"><Plus size={20}/></button>
              </div>
              
              <div className="px-4 pb-3">
                <p className="text-sm text-slate-700 leading-relaxed">{post.content}</p>
              </div>

              {post.image && (
                <div className="w-full h-48 bg-slate-100">
                  <img src={post.image} alt="Post cover" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-3 border-t border-slate-100 flex items-center justify-between px-6">
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors text-sm font-medium py-1 px-2 rounded-lg hover:bg-rose-50">
                  <Heart size={18} /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors text-sm font-medium py-1 px-2 rounded-lg hover:bg-blue-50">
                  <MessageCircle size={18} /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium py-1 px-2 rounded-lg hover:bg-emerald-50">
                  <Share2 size={18} /> Paylaş
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT COLUMN: Clubs Directory */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm sticky top-28">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Keşfet</h3>
              <div className="relative group w-40 sm:w-48">
                <Search className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kulüp ara..." 
                  className="bg-slate-50 pl-8 pr-3 py-2 rounded-xl text-xs w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-200 transition-colors" 
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredClubs.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm">Kulüp bulunamadı.</div>
              ) : (
                filteredClubs.map(club => (
                  <div key={club.id} onClick={() => setSelectedClub(club)} className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-all group">
                    <img src={club.logo} alt={club.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">{club.name}</h4>
                      <p className="text-[11px] text-slate-500 mb-1">{club.category}</p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 w-fit px-1.5 py-0.5 rounded">
                        <Users size={10} /> {club.memberCount} Üye
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Selected Club Modal (LinkedIn Company Page Style) */}
      {selectedClub && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            <button onClick={() => setSelectedClub(null)} className="absolute top-4 right-4 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-md"><X size={18}/></button>
            
            <div className="h-48 relative bg-slate-800">
              {selectedClub.coverImage && <img src={selectedClub.coverImage} alt={selectedClub.name} className="w-full h-full object-cover opacity-70" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="px-6 sm:px-8 pb-8 relative -mt-16">
              <div className="flex justify-between items-end mb-4">
                <div className="w-28 h-28 bg-white rounded-2xl border-4 border-white shadow-xl p-1 relative z-10">
                  <img src={selectedClub.logo} alt={selectedClub.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                {selectedClub.status === 'Aktif' && (
                  <button onClick={() => setShowJoinModal(true)} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all hover:shadow-lg flex items-center gap-2 mb-2">
                    <UserPlus size={16} /> Katıl
                  </button>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedClub.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">{selectedClub.category}</span>
                  <span className="text-sm font-bold text-slate-500 flex items-center gap-1"><Users size={16}/> {selectedClub.memberCount} Üye</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Info size={18} className="text-slate-400"/> Hakkımızda</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{selectedClub.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border border-slate-200 bg-white rounded-2xl p-4 flex items-center gap-4 hover:border-emerald-200 transition-colors">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-500"><Users size={20}/></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Danışman</p>
                    <p className="text-sm font-bold text-slate-800">Dr. Öğr. Üyesi Ahmet Y.</p>
                  </div>
                </div>
                <div className="border border-slate-200 bg-white rounded-2xl p-4 flex items-center gap-4 hover:border-emerald-200 transition-colors">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-500"><Briefcase size={20}/></div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Başkan</p>
                    <p className="text-sm font-bold text-slate-800">Caner M. (Psikoloji)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Request Modal (Skills Based) */}
      {showJoinModal && selectedClub && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in relative">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex justify-between items-start">
              <div>
                <UserPlus size={28} className="mb-2 opacity-90"/>
                <h2 className="text-xl font-black">{selectedClub.name}</h2>
                <p className="text-sm text-emerald-50 mt-1 opacity-90">Yetenek Bazlı Katılım Başvurusu</p>
              </div>
              <button onClick={() => setShowJoinModal(false)} className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleJoinSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Bölüm / Program</label>
                <input 
                  required value={joinForm.department} onChange={e => setJoinForm({...joinForm, department: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all" 
                  placeholder="Örn: Yazılım Mühendisliği" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Hangi Yetenekleri Katabilirsin?</label>
                <input 
                  value={joinForm.skills} onChange={e => setJoinForm({...joinForm, skills: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all" 
                  placeholder="Örn: Tasarım, Fotoğrafçılık, Organizasyon" 
                />
                <p className="text-[11px] text-slate-500 mt-1.5">Yeteneklerini belirterek kulüp projelerinde "Görev Havuzuna" dahil olabilirsin.</p>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Katılım Motivasyonunuz</label>
                <textarea 
                  required rows={3} value={joinForm.motivation} onChange={e => setJoinForm({...joinForm, motivation: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm resize-none transition-all" 
                  placeholder="Bu kulübe neden katılmak istiyorsunuz?" 
                />
              </div>

              <div className="pt-3">
                <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Profili Gönder ve Başvur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Application Modal (EK-1) */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in relative">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
              <div>
                <FileText size={28} className="mb-2 text-emerald-400"/>
                <h2 className="text-xl font-black">EK-1: Yeni Kulüp Kurma</h2>
                <p className="text-sm text-slate-300 mt-1">Öğrenci Dekanlığı Resmi Başvuru Formu</p>
              </div>
              <button onClick={() => setShowApplicationModal(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X size={16}/></button>
            </div>
            
            <form onSubmit={handleApplyClub} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Planlanan Kulüp Adı</label>
                <input required value={applicationForm.name} onChange={e => setApplicationForm({...applicationForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm transition-all" placeholder="Örn: Yapay Zeka Kulübü" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Kulübün Amacı</label>
                <textarea required rows={4} value={applicationForm.purpose} onChange={e => setApplicationForm({...applicationForm, purpose: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm resize-none transition-all" placeholder="Kurulum amacı ve hedefleri detaylıca açıklayınız..." />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Planlanan Danışman</label>
                <input required value={applicationForm.advisorName} onChange={e => setApplicationForm({...applicationForm, advisorName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm transition-all" placeholder="Örn: Prof. Dr. Ahmet Yılmaz" />
              </div>
              <div className="pt-3">
                <button type="submit" className="w-full py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  Dekanlığa Gönder <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
