import React, { useState } from 'react';
import { Mic, Headphones, Users, ChevronLeft, Plus, Play, MoreHorizontal, MessageSquare, Hand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const MOCK_ROOMS = [
  {
    id: 'room_1',
    title: 'Mülakat Stratejileri',
    host: 'Kariyer Geliştirme Koordinatörlüğü',
    type: 'official', // official, club, student
    speakers: [
      { name: 'Dr. Ahmet Yılmaz', avatar: 'https://i.pravatar.cc/150?u=12', role: 'Host' },
      { name: 'Zeynep Kaya', avatar: 'https://i.pravatar.cc/150?u=2', role: 'Speaker' },
      { name: 'Anka AI', avatar: '/logo.png', role: 'AI Assistant' }
    ],
    listenersCount: 145,
    tags: ['Yapay Zeka', 'Mülakat', 'Kariyer']
  },
  {
    id: 'room_2',
    title: 'Silikon Vadisi Staj Deneyimleri',
    host: 'Yazılım Kulübü',
    type: 'club',
    speakers: [
      { name: 'Can Özkan', avatar: 'https://i.pravatar.cc/150?u=44', role: 'Host' },
      { name: 'Elif Demir', avatar: 'https://i.pravatar.cc/150?u=15', role: 'Speaker' }
    ],
    listenersCount: 89,
    tags: ['Yurtdışı', 'Staj', 'Yazılım']
  },
  {
    id: 'room_3',
    title: 'Vize Öncesi Stres Atıyoruz',
    host: 'Açık Sohbet',
    type: 'student',
    speakers: [
      { name: 'Burak', avatar: 'https://i.pravatar.cc/150?u=3', role: 'Host' }
    ],
    listenersCount: 34,
    tags: ['Sohbet', 'Üniversite']
  }
];

export default function LiveRoomsPanel({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeRoom, setActiveRoom] = useState(null);

  const joinRoom = (room) => {
    setActiveRoom(room);
  };

  const leaveRoom = () => {
    setActiveRoom(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-[#990000]" />
            <div className="hidden sm:block">
              <h1 className="font-black text-[#990000] leading-tight">Canlı Kariyer Odaları</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">İESÜ Spaces</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-8">
        {!activeRoom ? (
          <>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Keşfet</h2>
                <p className="text-gray-500 text-sm">Şu an aktif olan sesli odalara katıl veya kendi odanı oluştur.</p>
              </div>
              <button className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-red-500/20">
                <Plus size={18} /> Oda Kur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_ROOMS.map(room => (
                <button
                  key={room.id}
                  onClick={() => joinRoom(room)}
                  className="bg-white rounded-xl p-6 text-left border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Background decoration */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${room.type === 'official' ? 'bg-red-500' : room.type === 'club' ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${room.type === 'official' ? 'bg-indigo-50 text-indigo-700' : room.type === 'club' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {room.host}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-red-500 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> CANLI
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-6 group-hover:text-red-600 transition-colors pr-8">
                    {room.title}
                  </h3>

                  <div className="flex items-end justify-between">
                    <div className="flex -space-x-2">
                      {room.speakers.map((s, i) => (
                        <img key={i} src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm font-bold">
                      <div className="flex items-center gap-1"><Users size={16} /> {room.listenersCount}</div>
                      <div className="flex items-center gap-1"><Mic size={16} /> {room.speakers.length}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden relative">
                {/* Gradient Header */}
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-[#990000] p-8 lg:p-12 text-white relative">
                  <button onClick={leaveRoom} className="absolute top-6 left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="text-center mt-6">
                    <span className="inline-flex items-center gap-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" /> CANLI
                    </span>
                    <h2 className="text-3xl lg:text-2xl font-black mb-4">{activeRoom.title}</h2>
                    <p className="text-indigo-200">{activeRoom.host}</p>
                  </div>
                </div>

                {/* Speakers Area */}
                <div className="p-8 lg:p-12 bg-white">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Konuşmacılar</h3>
                  <div className="flex flex-wrap gap-8 justify-center mb-12">
                    {activeRoom.speakers.map((speaker, i) => (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <div className="relative">
                          {/* Pulse effect for talking (simulated for host) */}
                          {speaker.role === 'Host' && (
                            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-30" />
                          )}
                          <img src={speaker.avatar} alt={speaker.name} className={`w-24 h-24 rounded-full object-cover border-4 ${speaker.role === 'Host' ? 'border-red-500' : 'border-gray-100'}`} />
                          <div className="absolute -bottom-2 right-0 bg-white p-1.5 rounded-full shadow-md text-gray-400">
                            <Mic size={14} />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-gray-900 text-sm">{speaker.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{speaker.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-t border-gray-100 pt-8">Dinleyiciler ({activeRoom.listenersCount})</h3>
                  <div className="flex flex-wrap gap-4">
                    {[...Array(12)].map((_, i) => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=${i+50}`} className="w-12 h-12 rounded-full border-2 border-gray-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition" alt="listener" />
                    ))}
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs font-bold">
                      +{activeRoom.listenersCount - 12}
                    </div>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button onClick={leaveRoom} className="text-red-500 font-bold text-sm px-6 py-3 rounded-full hover:bg-red-50 transition">
                      Sessizce Ayrıl
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        window.toast && window.toast.info("Anka AI: Odanın şu ana kadarki ses kaydı analiz ediliyor...");
                        setTimeout(() => {
                          window.toast && window.toast.success("✅ AI Özeti: 'Kariyer mülakatlarında stres yönetimi üzerine konuşuluyor...' (Özet Anka Chat'e gönderildi)");
                        }, 3000);
                      }}
                      className="text-red-600 font-bold text-sm px-6 py-3 rounded-full bg-red-50 hover:bg-red-100 transition flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M13 8H7"></path><path d="M17 12H7"></path></svg>
                      Kaçırdıklarımı Özetle
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm transition">
                      <Plus size={20} />
                    </button>
                    <button className="px-6 py-3 rounded-full bg-[#990000] text-white font-bold text-sm shadow-xl shadow-indigo-900/20 hover:scale-105 transition flex items-center gap-2">
                      <Hand size={18} /> Söz İste
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
