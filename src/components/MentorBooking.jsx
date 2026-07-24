import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, Star, Video, MessageSquare, ChevronLeft, CalendarCheck, CheckCircle2, Search } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const MENTORS = [
  { id: 1, name: 'Dr. Zeynep Kaya', role: 'Yapay Zeka Uzmanı', company: 'Google', rating: 4.9, sessions: 124, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', availability: 'Bugün, 14:00' },
  { id: 2, name: 'Ahmet Yılmaz', role: 'Kıdemli Ürün Yöneticisi', company: 'Spotify', rating: 4.8, sessions: 89, avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=150&q=80', availability: 'Yarın, 10:30' },
  { id: 3, name: 'Elif Demir', role: 'Kurucu Ortak', company: 'FinTech Startup', rating: 5.0, sessions: 42, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', availability: '12 Eki, 16:00' },
];

export default function MentorBooking({ setView, currentUser, userRole, setSelectedUserId }) {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: list, 2: calendar, 3: success
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookSession = () => {
    setBookingStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (bookingStep > 1) {
                setBookingStep(bookingStep - 1);
                if (bookingStep === 2) setSelectedMentor(null);
              } else {
                setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student');
              }
            }} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <CalendarCheck className="text-indigo-600" size={24} />
            <h1 className="font-black tracking-tight text-slate-900">Mentor Ajandası</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 lg:p-8 flex flex-col">
        
        {bookingStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-indigo-600 rounded-xl p-8 md:p-12 shadow-lg text-white relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-xl">
                <h2 className="text-3xl md:text-3xl font-black mb-4">Birebir Mentorluk<br/>Randevusu Al</h2>
                <p className="text-indigo-100 text-lg">Sektörün önde gelen profesyonellerinden kariyerin için 1'e 1 canlı mentorluk al.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Öne Çıkan Mentorlar</h3>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    window.toast && window.toast.info("AI: Özgeçmişiniz ve hedefleriniz analiz ediliyor...");
                    setTimeout(() => {
                      window.toast && window.toast.success("✅ AI Eşleşmesi: Zeynep Kaya (Google) ile %94 oranında kariyer hedefi uyumu tespit edildi.");
                      setSearchQuery("Zeynep");
                    }, 2500);
                  }}
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 border border-indigo-200 transition-colors shrink-0"
                >
                  <Star size={16} /> AI ile Eşleş
                </button>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Uzmanlık veya şirket ara..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENTORS.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.company.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase())).map(mentor => (
                <div key={mentor.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{mentor.name}</h4>
                      <p className="text-xs text-indigo-600 font-bold mb-1">{mentor.role}</p>
                      <p className="text-xs text-slate-500 font-medium">{mentor.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 font-medium mb-6">
                    <div className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500"/> {mentor.rating}</div>
                    <div className="flex items-center gap-1"><Video size={14}/> {mentor.sessions} Seans</div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-xs text-emerald-600 font-bold mb-3 flex items-center gap-1">
                      <Clock size={12} /> Yakın Uygunluk: {mentor.availability}
                    </p>
                    <button 
                      onClick={() => { setSelectedMentor(mentor); setBookingStep(2); }}
                      className="w-full py-3 bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white rounded-xl font-bold transition-colors"
                    >
                      Takvimi Görüntüle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {bookingStep === 2 && selectedMentor && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-20 h-20 rounded-full object-cover shadow-sm" />
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedMentor.name}</h2>
                  <p className="text-indigo-600 font-medium">{selectedMentor.role} @ {selectedMentor.company}</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CalendarIcon size={18} className="text-slate-400"/> Uygun Tarihler</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {['12 Eki Salı', '13 Eki Çar', '15 Eki Cuma'].map((day, i) => (
                  <div key={i} className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-colors ${i === 0 ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 hover:border-indigo-200 text-slate-600'}`}>
                    <span className="block text-xs uppercase tracking-wider mb-1 opacity-70">{day.split(' ')[2]}</span>
                    <span className="block text-lg">{day.split(' ')[0]} {day.split(' ')[1]}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-400"/> Saat Seçimi</h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                {['10:00', '11:30', '14:00', '16:30'].map((time, i) => (
                  <div key={i} className={`py-2 rounded-lg border text-center cursor-pointer font-bold transition-colors ${i === 2 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                    {time}
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Mentorluk Beklentiniz (Opsiyonel)</h3>
                <textarea rows="3" placeholder="Örn: Özgeçmiş incelemesi, mülakat taktikleri..." className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
              </div>

              <button onClick={handleBookSession} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2">
                Randevuyu Onayla (1 Saat)
              </button>
            </div>
          </motion.div>
        )}

        {bookingStep === 3 && selectedMentor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Randevu Onaylandı!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              <strong>{selectedMentor.name}</strong> ile 12 Ekim Salı, 14:00'da olan mentorluk görüşmen takvimine eklendi. Bağlantı linki e-posta adresine gönderildi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button onClick={() => setView('landing')} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Ana Sayfaya Dön
              </button>
              <button onClick={() => {setBookingStep(1); setSelectedMentor(null);}} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                Yeni Randevu Al
              </button>
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
