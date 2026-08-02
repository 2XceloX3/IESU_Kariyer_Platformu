import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronLeft, MapPin, Building2, Briefcase, Award, Star, MessageCircle, CheckCircle2, Search, Filter, CalendarCheck } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const MOCK_MENTORS = [
  {
    id: 'm1',
    name: 'Cemre Yılmaz',
    role: 'Senior Software Engineer',
    company: 'Google',
    location: 'Londra, UK',
    avatar: 'https://ui-avatars.com/api/?name=Cemre+Yılmaz&background=0A66C2&color=fff',
    tags: ['Yazılım', 'Yurtdışı', 'Mülakat Hazırlığı'],
    bio: 'İESÜ Bilgisayar Mühendisliği 2019 mezunuyum. Yurtdışında kariyer yapmak isteyen öğrencilere teknik mülakat ve CV konularında destek olabilirim.',
    rating: 4.9,
    sessions: 42
  },
  {
    id: 'm2',
    name: 'Ahmet Kaya',
    role: 'Marketing Manager',
    company: 'Unilever',
    location: 'İstanbul, TR',
    avatar: 'https://ui-avatars.com/api/?name=Ahmet+Kaya&background=0A2342&color=fff',
    tags: ['Pazarlama', 'Strateji', 'Staj'],
    bio: 'İşletme mezunuyum. FMCG sektöründe kariyer hedefleyen arkadaşlara staj bulma ve mülakat simülasyonları konusunda mentörlük yapıyorum.',
    rating: 4.8,
    sessions: 15
  },
  {
    id: 'm3',
    name: 'Selin Arslan',
    role: 'UX/UI Designer',
    company: 'Spotify',
    location: 'Stockholm, SE',
    avatar: 'https://ui-avatars.com/api/?name=Selin+Arslan&background=0284C7&color=fff',
    tags: ['Tasarım', 'Portfolyo', 'Yurtdışı'],
    bio: 'Grafik Tasarım mezunuyum. Ürün tasarımı alanında uzmanlaşmak isteyenlere portfolyo incelemesi ve kariyer haritası desteği sunuyorum.',
    rating: 5.0,
    sessions: 28
  },
  {
    id: 'm4',
    name: 'Kaan Demir',
    role: 'Financial Analyst',
    company: 'Deloitte',
    location: 'İstanbul, TR',
    avatar: 'https://ui-avatars.com/api/?name=Kaan+Demir&background=0A66C2&color=fff',
    tags: ['Finans', 'Danışmanlık', 'Kariyer Planlama'],
    bio: 'Ekonomi mezunuyum. Big4 şirketlerinde çalışmak isteyenler için case study çözümleri ve kariyer planlama yapıyorum.',
    rating: 4.7,
    sessions: 34
  }
];

export default function MentorMatch({ setView, currentUser, userRole, setSelectedUserId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tümü');
  const [requestedMentors, setRequestedMentors] = useState([]);

  const allTags = ['Tümü', ...new Set(MOCK_MENTORS.flatMap(m => m.tags))];

  const filteredMentors = MOCK_MENTORS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'Tümü' || m.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleRequest = (mentorId) => {
      setRequestedMentors([...requestedMentors, mentorId]);
      window.toast && window.toast.success("Mentorluk talebi iletildi.");
    };
    const cancelRequest = (mentorId) => {
      setRequestedMentors(requestedMentors.filter(id => id !== mentorId));
      window.toast && window.toast.info("Talep iptal edildi. Dilerseniz yeniden gönderebilirsiniz.");
          };

        return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4 w-full max-w-[1200px] mx-auto">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="flex items-center gap-2 text-gray-500 hover:text-[#990000] font-semibold transition-colors"
          >
            <ChevronLeft size={20} /> Ana Sayfa
          </button>
          
          <div className="hidden md:flex items-center gap-2 ml-4">
            <Award className="text-[#0A66C2]" size={24} />
            <h1 className="font-black text-[#990000] text-lg tracking-tight">Mezun Mentor Ağı</h1>
          </div>
          
          <div className="flex-1"></div>
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 lg:py-8">
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="flex flex-col sm:flex-row w-full gap-4 items-center">
            <div className="relative w-full md:w-96 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Mentor, unvan veya şirket ara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none transition text-sm font-medium"
              />
            </div>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.toast && window.toast.info("Öğrenme stiliniz ve kariyer hedefleriniz analiz ediliyor...");
                setTimeout(() => {
                  window.toast && window.toast.success("✅ Eşleşme: Kariyer hedeflerinize %95 uyumlu 2 mentör bulundu.");
                }, 2500);
              }}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md font-bold text-sm shadow-md transition-all shrink-0"
            >
              <Star size={16} className="fill-white/50" /> Eşleş
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="text-gray-400 shrink-0 mr-2" size={18} />
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedTag === tag ? 'bg-[#0A66C2] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={mentor.id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* Cover & Avatar */}
              <div className="h-24 bg-gradient-to-r from-[#990000] to-[#0A66C2] relative">
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
                  <span className="text-[10px] font-black text-[#0A66C2] uppercase tracking-wide">Uyum Skoru</span>
                  <span className="text-xs font-black text-emerald-600">%{(mentor.id.length * 15 + mentor.name.length * 3) % 15 + 85}</span>
                </div>
                <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
                  <img src={mentor.avatar} alt={mentor.name} className="w-20 h-20 rounded-full object-cover border-2 border-white" />
                </div>
              </div>
              
              <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg font-black text-gray-900 leading-tight">{mentor.name}</h2>
                    <p className="text-sm font-semibold text-gray-600">{mentor.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded">
                    <Star size={14} className="fill-current" /> {mentor.rating}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {mentor.company}</span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {mentor.location}</span>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed mb-4 flex-1 line-clamp-3">
                  {mentor.bio}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {mentor.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-[#f3f2ef] text-gray-600 text-[10px] font-bold rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="mt-auto border-t border-gray-100 pt-4 flex gap-3">
                  {requestedMentors.includes(mentor.id) ? (
                                      <div className="w-full flex items-center gap-2">
                                        <span className="flex-1 py-2 bg-gray-100 text-gray-500 font-bold rounded-md text-sm flex items-center justify-center gap-2">
                                          <CheckCircle2 size={16} /> Talep İletildi
                                        </span>
                                        <button onClick={() => cancelRequest(mentor.id)} className="py-2 px-3 bg-white border border-red-200 text-red-700 hover:bg-red-50 font-bold rounded-md text-sm transition-colors">İptal</button>
                                      </div>
                                    ) : (
                    <button 
                      onClick={() => handleRequest(mentor.id)}
                      className="w-full py-2 bg-[#0A66C2] hover:bg-red-800 text-white font-bold rounded-md text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CalendarCheck size={16} /> Mentorluk Talep Et
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredMentors.length === 0 && (
          <div className="text-center py-20">
            <Search className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900">Sonuç Bulunamadı</h3>
            <p className="text-gray-500">Arama kriterlerinize uygun mentor bulunamadı.</p>
          </div>
        )}
      </main>
    </div>
  );
}
