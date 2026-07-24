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

  return (
    <div className="w-full shrink-0 animate-fade-in mb-6">
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-2">
          <Target className="text-indigo-600" size={28} />
          TeamUp & MentorMatch
        </h2>
        <p className="text-gray-500 font-medium">Hayalindeki projeyi hayata geçir veya kariyerin için doğru mentoru bul.</p>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 mt-6 gap-6">
          <button 
            onClick={() => setActiveTab('teams')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'teams' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span className="flex items-center gap-2"><Users size={18} /> Proje Arkadaşı Bul</span>
            {activeTab === 'teams' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></div>}
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
            <button className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm">
              İlan Ver
            </button>
          </div>
          {mockTeams.map(team => (
            <div key={team.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={team.author.avatar} alt={team.author.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{team.author.name}</h4>
                    <p className="text-xs text-gray-500">{team.author.department} • {team.time}</p>
                  </div>
                </div>
                <div className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full flex items-center shrink-0 h-7">
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
                  <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"><Heart size={16} /> Beğen</button>
                  <button className="text-gray-400 hover:text-indigo-500 transition-colors flex items-center gap-1 text-sm font-medium"><MessageCircle size={16} /> Sor</button>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("Anka AI: Profiliniz ve takımın teknik gereksinimleri analiz ediliyor...");
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ AI Analizi: Bu takıma katılım için %88 uyumlusunuz. Eksik görülen: D3.js deneyimi.");
                      }, 2500);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-1 px-3 py-2 rounded-xl transition-colors"
                  >
                    <Star size={14} /> AI Uyumluluk
                  </button>
                  <button className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">
                    Takıma Katıl <ArrowRight size={16} />
                  </button>
                </div>
              </div>
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
            {mockMentors.map(mentor => (
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
                <button className="w-full text-center py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-colors">
                  Mentorluk Talep Et
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
