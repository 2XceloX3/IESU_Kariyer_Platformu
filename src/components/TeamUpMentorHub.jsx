import React, { useState } from 'react';
import { Search, Users, Target, UserCheck, Star, ArrowRight, MessageCircle, Heart, Share2, MapPin, Briefcase, GraduationCap } from 'lucide-react';

const mockTeams = [
  {
    id: 1,
    title: 'NASA Space Apps Challenge 2026',
    role: 'React / Frontend Geliştirici Aranıyor',
    author: { name: 'Ahmet Yılmaz', avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=random', department: 'Bilgisayar Mühendisliği' },
    description: 'Uzay verilerini görselleştirecek projemiz için acil frontend bilen birine ihtiyacımız var. 3 kişilik takımız.',
    tags: ['React', 'D3.js', 'Hackathon'],
    time: '2 saat önce'
  },
  {
    id: 2,
    title: 'FinTech Girişimi (TÜBİTAK 1512)',
    role: 'Ortak (Co-founder) & Backend Geliştirici',
    author: { name: 'Zeynep Kaya', avatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=random', department: 'İşletme' },
    description: 'Yapay zeka tabanlı kişisel finans asistanı projemiz için teknik kurucu ortak (Node.js/Python) arıyorum.',
    tags: ['FinTech', 'Girişim', 'Node.js'],
    time: '5 saat önce'
  }
];

const mockMentors = [
  {
    id: 1,
    name: 'Caner Demir',
    role: 'Senior Software Engineer @ Google',
    avatar: 'https://ui-avatars.com/api/?name=Caner+Demir&background=random',
    department: 'Yazılım Mühendisliği (2020 Mezunu)',
    expertise: ['Sistem Mimarisi', 'Yurtdışı Kariyer', 'Mülakat Hazırlığı'],
    available: true
  },
  {
    id: 2,
    name: 'Ayşe Yıldız',
    role: 'Product Manager @ Trendyol',
    avatar: 'https://ui-avatars.com/api/?name=Ayse+Yildiz&background=random',
    department: 'Endüstri Mühendisliği (2018 Mezunu)',
    expertise: ['Ürün Yönetimi', 'Agile', 'Kariyer Planlama'],
    available: true
  }
];

export default function TeamUpMentorHub({ currentUser }) {
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' or 'mentors'
  const [teams, setTeams] = useState(mockTeams);
  const [mentors, setMentors] = useState(mockMentors);
  const [likedTeams, setLikedTeams] = useState(new Set());
  const [joinReq, setJoinReq] = useState(new Set());
  const [mentorReq, setMentorReq] = useState(new Set());
  const [questMark, setQuestMark] = useState(new Set());
  const [qText, setQText] = useState({});
  const [qInput, setQInput] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postRole, setPostRole] = useState('');
  const [postDesc, setPostDesc] = useState('');

  const toggleLike = (id) => setLikedTeams((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const sendQuestion = (id) => {
    const txt = (qText[id] || '').trim();
    if (!txt) { window.toast?.info('Soru yaz'); return; }
    setQText((s) => ({ ...s, [id]: '' })); setQInput(null);
    window.toast.success('Soru gönderildi — kullanıcı en kısa sürede yanıtlar.');
  };
  const publishTeam = () => {
    if (!postTitle.trim()) { window.toast?.info('İlan başlığı gerekli'); return; }
    const t = {
      id: Date.now(),
      title: postTitle.trim(),
      role: postRole.trim() || 'Takım Arkadaşı Aranıyor',
      author: { name: currentUser?.name || 'Kullanıcı', avatar: currentUser?.avatar || '/iesu-logo.svg', department: currentUser?.department || '' },
      description: postDesc.trim() || 'Açıklama eklenmedi.',
      tags: [],
      time: 'Az önce'
    };
    setTeams([t, ...teams]);
    setShowPost(false); setPostTitle(''); setPostRole(''); setPostDesc('');
    window.toast.success('İlanınız yayınlandı!');
  };

  return (
    <div className="w-full shrink-0 animate-fade-in mb-6">
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-2">
          <Target className="text-red-600" size={28} />
          TeamUp & MentorMatch
        </h2>
        <p className="text-gray-500 font-medium">Hayalindeki projeyi hayata geçir veya kariyerin için doğru mentoru bul.</p>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 mt-6 gap-6">
          <button 
            onClick={() => setActiveTab('teams')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'teams' ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span className="flex items-center gap-2"><Users size={18} /> Proje Arkadaşı Bul</span>
            {activeTab === 'teams' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('mentors')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'mentors' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span className="flex items-center gap-2"><UserCheck size={18} /> Mentor Ağı (Mezunlar)</span>
            {activeTab === 'mentors' && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">Aktif Takım Arayışları</h3>
                        <button onClick={() => setShowPost((v) => !v)} className="text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-all shadow-sm">
                          {showPost ? 'Kapat' : 'İlan Ver'}
                        </button>
                      </div>
                      {showPost && (
                        <div className="bg-white border border-red-100 rounded-2xl p-4 mb-4 space-y-2 shadow-sm">
                          <p className="text-[12px] font-extrabold text-red-700">Yeni Takım İlanı</p>
                          <input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Proje / takım başlığı *" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-red-400" />
                          <input value={postRole} onChange={(e) => setPostRole(e.target.value)} placeholder="Aranan rol (örn. Frontend Dev)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-red-400" />
                          <textarea value={postDesc} onChange={(e) => setPostDesc(e.target.value)} placeholder="Proje hakkında kısa açıklama" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-red-400 resize-none" />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setShowPost(false)} className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-gray-500 hover:bg-gray-100">İptal</button>
                            <button onClick={publishTeam} className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold">Yayınla</button>
                          </div>
                        </div>
                      )}
                      {teams.map(team => (
            <div key={team.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={team.author.avatar} alt={team.author.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{team.author.name}</h4>
                    <p className="text-xs text-gray-500">{team.author.department} • {team.time}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full flex items-center shrink-0 h-7">
                  Aranan: {team.role}
                </div>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{team.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{team.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {team.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">#{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2 flex-wrap gap-2">
                <div className="flex gap-4">
                                  <button onClick={() => toggleLike(team.id)} className={`${likedTeams.has(team.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition-colors flex items-center gap-1 text-sm font-medium`}><Heart size={16} className={likedTeams.has(team.id) ? 'fill-red-500' : ''} /> {likedTeams.has(team.id) ? 'Beğenildi' : 'Beğen'}</button>
                                  <button onClick={() => setQInput(qInput === team.id ? null : team.id)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"><MessageCircle size={16} /> Sor</button>
                                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("Profiliniz ve takımın teknik gereksinimleri analiz ediliyor...");
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ Analiz: Bu takıma katılım için %88 uyumlusunuz. Eksik görülen: D3.js deneyimi.");
                      }, 2500);
                    }}
                    className="text-red-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Star size={14} /> AI Uyumluluk
                  </button>
                  <button 
                                    onClick={(e) => { e.preventDefault(); setJoinReq((s) => new Set(s).add(team.id)); window.toast.success(`"${team.title}" için katılım talebiniz iletildi.`); }}
                                    className={`${joinReq.has(team.id) ? 'bg-emerald-600 text-white' : 'text-red-600 hover:bg-red-100 bg-indigo-50'} font-bold text-sm flex items-center gap-1 px-4 py-2 rounded-xl transition-colors`}
                                  >
                                    {joinReq.has(team.id) ? '✓ Talebiniz Alındı' : 'Takıma Katıl'} <ArrowRight size={16} />
                                  </button>
                </div>
                              </div>
                              {qInput === team.id && (
                                <div className="mt-3 flex gap-2 border-t border-gray-50 pt-3">
                                  <input value={qText[team.id] || ''} onChange={(e) => setQText((s) => ({ ...s, [team.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') sendQuestion(team.id); }} placeholder="Takım üyesine sorunuz..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-[13px] outline-none focus:border-red-400" />
                                  <button onClick={() => sendQuestion(team.id)} className="px-4 py-2 rounded-xl bg-red-600 text-white text-[13px] font-bold hover:bg-red-700">Gönder</button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">Sektördeki Mezun Mentorler</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Şirket, pozisyon veya isim ara..." className="text-sm bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mentors.map(mentor => (
              <div key={mentor.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img src={mentor.avatar} alt={mentor.name} className="w-14 h-14 rounded-2xl object-cover" />
                    {mentor.available && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 flex items-center gap-1 truncate">{mentor.name} <Star size={14} className="fill-emerald-500 text-emerald-500 shrink-0" /></h4>
                    <p className="text-xs text-emerald-600 font-semibold mb-1 flex items-center gap-1 truncate"><Briefcase size={12} className="shrink-0"/> <span className="truncate">{mentor.role}</span></p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate"><GraduationCap size={12} className="shrink-0"/> <span className="truncate">{mentor.department}</span></p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {mentor.expertise.map((exp, i) => (
                    <span key={i} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">{exp}</span>
                  ))}
                </div>
                <button onClick={() => { setMentorReq((s) => new Set(s).add(mentor.id)); window.toast.success(`"${mentor.name}" için mentorluk talebi iletildi.`); }} className={`w-full text-center py-2.5 ${mentorReq.has(mentor.id) ? 'bg-emerald-600' : 'bg-gray-900 hover:bg-gray-800'} text-white font-bold text-sm rounded-xl transition-colors`}>
                                  {mentorReq.has(mentor.id) ? '✓ Talep İletildi' : 'Mentorluk Talep Et'}
                                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
