import React, { useState } from 'react';
import { Trophy, Medal, Star, ChevronLeft, Award, Crown, TrendingUp, ShieldCheck, Briefcase, Users, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const MOCK_LEADERS = [
  { id: 1, name: "Ali Yılmaz", department: "Bilgisayar Mühendisliği", company: "Trendyol Group", role: "Software Engineer", endorsements: 145, avatar: "https://i.pravatar.cc/150?u=1", skills: ["React", "Microservices", "System Design"], topRank: true },
  { id: 2, name: "Zeynep Kaya", department: "Mimarlık", company: "Tabanlıoğlu Mimarlık", role: "Architectural Designer", endorsements: 123, avatar: "https://i.pravatar.cc/150?u=2", skills: ["AutoCAD", "BIM", "Sustainability"], topRank: true },
  { id: 3, name: "Burak Demir", department: "İşletme", company: "Unilever", role: "Brand Manager", endorsements: 98, avatar: "https://i.pravatar.cc/150?u=3", skills: ["Marketing Strategy", "FMCG", "Data Analytics"], topRank: true },
  { id: 4, name: "Ayşe Çelik", department: "Psikoloji", company: "Koç Üniversitesi", role: "Araştırma Görevlisi", endorsements: 84, avatar: "https://i.pravatar.cc/150?u=4", skills: ["Clinical Research", "Data Analysis", "SPSS"] },
  { id: 5, name: "Kaan Yılmaz", department: "Siber Güvenlik", company: "ASELSAN", role: "Security Analyst", endorsements: 72, avatar: "https://i.pravatar.cc/150?u=5", skills: ["Penetration Testing", "Network Security", "Cryptography"] },
  { id: 6, name: "Selin Çetin", department: "Grafik Tasarım", company: "TBWA\\Istanbul", role: "Art Director", endorsements: 65, avatar: "https://i.pravatar.cc/150?u=6", skills: ["UI/UX", "Brand Identity", "Figma"] },
];

export default function LeaderboardPanel({ setView, currentUser, userRole, setSelectedUserId }) {
  const [sectorFilter, setSectorFilter] = useState('all'); // all, tech, business, design

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans pb-20">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center shadow-sm">
              <TrendingUp className="text-white" size={16} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-gray-900 leading-tight">Öne Çıkan Yetenekler</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aylık Sektörel Liderler</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 lg:p-8">
        
        {/* Banner */}
        <div className="bg-[#990000] rounded-2xl p-8 mb-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-[#0A66C2]/20 skew-x-12 transform origin-bottom pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-black mb-3">Kariyerinde Fark Yaratanlar</h2>
            <p className="text-red-100 text-lg leading-relaxed">
              Kariyer Geliştirme Merkezi verilerine göre yetenek onayları (endorsements) ve sektörel etkileşimleriyle bu ay en çok öne çıkan Esenyurtliler.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex bg-white p-2 rounded-xl shadow-sm border border-gray-200 w-fit mb-6">
          {[
            { id: 'all', label: 'Tüm Sektörler' },
            { id: 'tech', label: 'Teknoloji & Mühendislik' },
            { id: 'business', label: 'İşletme & Finans' },
            { id: 'design', label: 'Tasarım & Mimarlık' }
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setSectorFilter(f.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${sectorFilter === f.id ? 'bg-[#0A66C2] text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        {/* Top Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {MOCK_LEADERS.filter(l => l.topRank).map((user) => (
            <div key={user.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 p-4">
                 <ShieldCheck className="text-[#0A66C2]" size={24} />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border border-gray-200 shadow-sm" />
                <div>
                  <h3 className="font-black text-lg text-gray-900 leading-tight group-hover:text-[#0A66C2] transition-colors">{user.name}</h3>
                  <p className="text-sm font-medium text-gray-500">{user.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Briefcase size={16} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">{user.role}</span>
                <span className="text-xs font-medium text-gray-500 ml-auto">@{user.company}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {user.skills.map(skill => (
                  <span key={skill} className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-4 gap-4">
                <div className="flex items-center gap-1.5 text-[#0A66C2] font-black">
                  <Users size={16} />
                  <span>{user.endorsements} Onay</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info(`"${user.name}" kullanıcısının kariyer geçmişi analiz ediliyor...`);
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ Analiz: Hedefinize ulaşmak için öğrenmeniz gereken 3 yeni yetkinlik haritanıza eklendi.");
                      }, 2500);
                    }}
                    className="flex-1 sm:flex-none text-[11px] font-bold bg-[#f0f7ff] text-[#0A66C2] hover:bg-[#dbeafe] px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                    title="Tersine Mühendislik (Kariyer Kopyalama)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    Kariyeri Modelle
                  </button>
                  <button className="flex-1 sm:flex-none text-sm font-bold text-gray-500 hover:text-[#0A66C2] bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1">
                    İncele
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The Rest of the List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2">
              <Star className="text-amber-500" size={18} /> Yükselen Yetenekler
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_LEADERS.filter(l => !l.topRank).map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 transition-colors gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border border-gray-200 shadow-sm" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-[15px]">{user.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{user.role} @ {user.company}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {user.skills.map(skill => (
                    <span key={skill} className="text-[11px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-sm">
                    <ShieldCheck size={16} /> {user.endorsements} Onay
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#0A66C2] hover:bg-red-50 rounded-lg transition-colors">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

