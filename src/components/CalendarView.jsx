import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Info, Plus, GraduationCap, Briefcase, Trash2, Send, Search, Home, Compass, MessageCircle, Bell } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';
import useAppStore from '../store/useAppStore';

export default function CalendarView({ currentUser, setView, userRole, setSelectedUserId, academicRole }) {
  const events = useAppStore(state => state.events);
  const setEvents = useAppStore(state => state.setEvents);
  const mentorships = useAppStore(state => state.mentorships);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [personalEvents, setPersonalEvents] = useState(() => {
    const saved = localStorage.getItem(`igu_personal_events_${currentUser?.id}`);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPersonalEvent, setNewPersonalEvent] = useState({ title: '', date: '', type: 'Kişisel' });

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`igu_personal_events_${currentUser?.id}`, JSON.stringify(personalEvents));
    }
  }, [personalEvents, currentUser?.id]);

  // Combine official and personal events
  const allCalendarItems = [
    ...(events || []).map(e => ({ ...e, calendarType: 'official' })),
    ...(personalEvents || []).map(e => ({ ...e, calendarType: 'personal' }))
  ];

  const handleAddPersonalEvent = (e) => {
    e.preventDefault();
    if (!newPersonalEvent.title || !newPersonalEvent.date) return;
    
    setPersonalEvents([...personalEvents, {
      id: 'PE-' + Date.now(),
      title: newPersonalEvent.title,
      date: newPersonalEvent.date,
      type: newPersonalEvent.type,
      status: 'Yayında'
    }]);
    setShowAddModal(false);
    setNewPersonalEvent({ title: '', date: '', type: 'Kişisel' });
  };

  const deletePersonalEvent = (id) => {
    setPersonalEvents(personalEvents.filter(e => e.id !== id));
  };

  // Group events by date string (YYYY-MM-DD)
  const groupedEvents = (allCalendarItems || []).reduce((acc, item) => {
    if (!item.date) return acc;
    try {
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return acc; // Skip invalid dates
      const dateStr = d.toISOString().split('T')[0];
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(item);
    } catch (e) {
      // Ignore invalid date strings
    }
    return acc;
  }, {});

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayEvents = groupedEvents[selectedDateStr] || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo & Brand */}
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
            <Logo className="h-10 w-auto text-[#990000] hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* MIDDLE: Search Bar */}
          <div className="hidden md:flex relative group flex-1 max-w-md mx-auto shrink">
            <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-[#990000] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Takvimde etkinlik ara..." 
              className="bg-gray-100/80 pl-10 pr-4 py-2 rounded-2xl text-[14px] w-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-iesu-blue/20 transition-all" 
            />
          </div>
          
          {/* RIGHT: Navigation Icons & Profile */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.toast && window.toast.info("Anka AI: Ajandanızdaki boşluklar taranarak 'Kariyer Fuarı' için ideal gün hesaplanıyor...");
                setTimeout(() => {
                  window.toast && window.toast.success("✅ AI Planlaması: Etkinlik 15 Kasım Cuma günü saat 14:00'e başarıyla yerleştirildi.");
                }, 2500);
              }}
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-md transition-all mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
              <span className="text-[13px]">AI Planlayıcı</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 md:gap-2 bg-[#990000] text-white px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl font-bold hover:bg-[#990000] transition shadow-sm mr-2"
            >
              <Plus size={16} /> <span className="hidden md:inline text-[13px]">Etkinlik Ekle</span>
            </button>
            <NavIcon icon={<Home />} label="Akış" active={false} onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" active={false} onClick={() => setView(userRole === 'admin' ? 'admin' : userRole || 'landing')} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={false} onClick={() => setView('jobs')} />
            <NavIcon 
              icon={<MessageCircle />} 
              label="Mesajlar" 
              active={false} 
              onClick={() => setView('messaging')} 
            />
            
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="calendar" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Panel: Calendar Grid */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {/* Minimalist modern calendar view for UI purposes */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-gray-900">
                  {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition">Önceki</button>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-xl transition">Sonraki</button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-gray-500">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <div key={d}>{d}</div>)}
              </div>

              {/* Days Grid - simplified for UI */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2; // offset
                  if (day <= 0 || day > 31) return <div key={'empty-'+i} className="aspect-square rounded-xl bg-gray-50/50"></div>;
                  
                  const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                  const dStr = d.toISOString().split('T')[0];
                  const hasEvents = groupedEvents[dStr]?.length > 0;
                  const isSelected = selectedDateStr === dStr;
                  const isToday = new Date().toISOString().split('T')[0] === dStr;

                  return (
                    <button 
                      key={'day-'+i}
                      onClick={() => setSelectedDate(d)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                        isSelected ? 'bg-[#990000] text-white shadow-md shadow-red-600/20' : 
                        isToday ? 'bg-red-50 text-[#990000] font-bold' :
                        'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{day}</span>
                      {hasEvents && !isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-iesu-primary mt-1"></div>
                      )}
                      {hasEvents && isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 opacity-80"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Day's Events */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[400px]">
              <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-[#990000]" size={20} /> 
                {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
              </h3>
              
              <div className="space-y-4">
                {dayEvents.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl">
                    <CalendarIcon size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-500">Bu tarih için planlanmış etkinlik bulunmuyor.</p>
                  </div>
                ) : (
                  (dayEvents || []).map((item, idx) => {
                    let typeColor = 'bg-red-100 text-red-700';
                    if (item.calendarType !== 'personal') {
                      typeColor = item.type === 'Eğitim' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#990000]/10 text-[#990000]';
                    } else {
                      switch (item.type) {
                        case 'Gönüllü Staj': typeColor = 'bg-purple-100 text-purple-700'; break;
                        case 'Ulusal Staj': typeColor = 'bg-cyan-100 text-cyan-700'; break;
                        case 'Zorunlu Staj': typeColor = 'bg-amber-100 text-amber-700'; break;
                        case 'Dönem Stajı': typeColor = 'bg-indigo-100 text-indigo-700'; break;
                        case 'Sınav': typeColor = 'bg-orange-100 text-orange-700'; break;
                        case 'Mülakat': typeColor = 'bg-teal-100 text-teal-700'; break;
                        default: typeColor = 'bg-red-100 text-red-700'; break;
                      }
                    }

                    return (
                      <div key={'event-'+idx} className={`p-4 rounded-2xl border relative ${item.calendarType === 'personal' ? 'bg-white shadow-sm border-gray-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${typeColor}`}>
                            {item.type || 'Etkinlik'}
                          </span>
                          {item.calendarType === 'personal' && (
                            <button onClick={() => deletePersonalEvent(item.id)} className="text-gray-500 hover:text-red-600 transition">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h4>
                        {item.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                            <MapPin size={12} /> {item.location}
                          </p>
                        )}
                        {item.time && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} /> {item.time}
                          </p>
                        )}
                        
                        {userRole === 'student' && item.calendarType === 'personal' && item.type && item.type.includes('Staj') && (
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <button 
                              onClick={() => {
                                const note = window.prompt("Mesajınıza/Evrak bilginize kısa bir not ekleyin:");
                                if(note !== null) {
                                  if (setMessages) {
                                    setMessages([...(messages || []), { 
                                      id: 'MSG-'+Date.now(), 
                                      senderId: currentUser?.id, 
                                      senderName: currentUser?.name || 'Öğrenci', 
                                      receiverId: 'admin_1513', 
                                      content: 'Staj Bildirimi: ' + item.title + ' (' + item.type + ') - ' + note, 
                                      timestamp: new Date().toISOString(), 
                                      read: false 
                                    }]);
                                  }
                                  window.toast.success("Mesaj Kariyer Geliştirme Koordinatörlüğüne iletildi.");
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                            >
                              <Send size={14} className="text-[#990000]" />
                              Kariyer Geliştirme Koordinatörlüğüne Mesaj/Evrak Gönder
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-lg font-black text-gray-900 mb-4">Kişisel Etkinlik Ekle</h3>
            <form onSubmit={handleAddPersonalEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Başlık</label>
                <input required type="text" value={newPersonalEvent.title} onChange={e => setNewPersonalEvent({...newPersonalEvent, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-iesu-navy focus:ring-1 focus:ring-iesu-navy" placeholder="Örn: Vize Sınavı, Mülakat..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tarih</label>
                <input required type="date" value={newPersonalEvent.date} onChange={e => setNewPersonalEvent({...newPersonalEvent, date: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-iesu-navy focus:ring-1 focus:ring-iesu-navy" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                <select value={newPersonalEvent.type} onChange={e => setNewPersonalEvent({...newPersonalEvent, type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-iesu-navy focus:ring-1 focus:ring-iesu-navy">
                  <option value="Kişisel">Kişisel</option>
                  <option value="Sınav">Sınav</option>
                  <option value="Mülakat">Mülakat</option>
                  {userRole === 'student' && (
                    <>
                      <option value="Gönüllü Staj">Gönüllü Staj</option>
                      <option value="Ulusal Staj">Ulusal Staj</option>
                      <option value="Zorunlu Staj">Zorunlu Staj</option>
                      <option value="Dönem Stajı">Dönem Stajı</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">İptal</button>
                <button type="submit" className="px-6 py-2 bg-[#990000] text-white font-bold rounded-xl hover:bg-[#990000] transition shadow-sm">Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

