import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, Info, Plus, GraduationCap, Briefcase, Trash2, Send, Search, Home, Compass, MessageCircle, Bell } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';
import AdminOmniDock from './AdminOmniDock';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

export default function CalendarView({ currentUser, setView, userRole, setSelectedUserId, academicRole }) {
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const effectiveRole = (activePortalBranch === 'student') ? 'student' : (activePortalBranch === 'alumni' ? 'alumni' : (userRole || 'student'));
  const events = useAppStore(state => state.events);
  const setEvents = useAppStore(state => state.setEvents);
  const mentorships = useAppStore(state => state.mentorships);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [personalEvents, setPersonalEvents] = useState(() => {
    const saved = localStorage.getItem(`iesu_personal_events_${currentUser?.id}`) || localStorage.getItem(`igu_personal_events_${currentUser?.id}`);
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
      localStorage.setItem(`iesu_personal_events_${currentUser?.id}`, JSON.stringify(personalEvents));
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
  const roleTheme = {
    admin: { primary: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white', accent: 'text-amber-600', border: 'border-amber-200', bgSoft: 'bg-amber-50' },
    alumni: { primary: 'bg-emerald-700 text-white', accent: 'text-emerald-700', border: 'border-emerald-200', bgSoft: 'bg-emerald-50' },
    academic: { primary: 'bg-purple-900 text-white', accent: 'text-purple-900', border: 'border-purple-200', bgSoft: 'bg-purple-50' },
    company: { primary: 'bg-blue-950 text-white', accent: 'text-blue-950', border: 'border-blue-200', bgSoft: 'bg-blue-50' },
    student: { primary: 'bg-[#990000] text-white', accent: 'text-[#990000]', border: 'border-red-200', bgSoft: 'bg-red-50' }
  };
  const theme = roleTheme[userRole === 'admin' ? 'admin' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : (userRole === 'employer' || userRole === 'company') ? 'company' : 'student'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Modern Minimal Header */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shrink-0"
              title="Geri"
            >
              <ArrowLeft size={18} />
            </button>
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
              <Logo color={userRole === 'admin' ? 'amber' : 'red'} className="h-10 w-auto hover:scale-105 transition-transform" />
              <div className="hidden sm:block text-left">
                <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${userRole === 'admin' ? 'text-amber-800' : 'text-[#990000]'}`}>İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{userRole === 'admin' ? 'KGM Süper Yönetici Ajandası' : 'Kariyer Takvimi & Etkinlik Planlayıcı'}</p>
              </div>
            </div>
          </div>
          
          {/* RIGHT: Action & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition shadow-sm hover:scale-105 active:scale-95 text-xs uppercase tracking-wider cursor-pointer ${theme.primary}`}
            >
              <Plus size={16} strokeWidth={2.5} /> Etkinlik / Hatırlatıcı Ekle
            </button>
            
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="calendar" />
          </div>
        </div>
      </nav>

      <main className="max-w-[1100px] mx-auto px-4 lg:px-8 pt-24">
        {/* Page Title & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className={theme.accent} size={24} /> Kampüs & Kariyer Ajandası
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">Staj, mülakat, sınav ve resmi kariyer etkinliklerinizi buradan takip edin.</p>
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button className="px-4 py-1.5 bg-white text-gray-900 rounded-lg shadow-xs font-black">Aylık Görünüm</button>
            <button onClick={() => window.toast?.info("Bugün planlanan etkinlik listeniz sağ paneldadır.")} className="px-4 py-1.5 text-gray-500 hover:text-gray-900 transition">Bugün</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Panel: Calendar Grid */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              {/* Calendar Controls */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-gray-900">
                  {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer">Önceki</button>
                  <button onClick={() => setSelectedDate(new Date())} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-xl transition cursor-pointer">Bugün</button>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer">Sonraki</button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-3 text-center text-xs font-black text-gray-400 uppercase tracking-wider">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => <div key={d} className="py-1">{d}</div>)}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => {
                  const day = i - 2; // offset
                  if (day <= 0 || day > 31) return <div key={'empty-'+i} className="aspect-square rounded-2xl bg-gray-50/40 border border-transparent"></div>;
                  
                  const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                  const dStr = d.toISOString().split('T')[0];
                  const hasEvents = groupedEvents[dStr]?.length > 0;
                  const isSelected = selectedDateStr === dStr;
                  const isToday = new Date().toISOString().split('T')[0] === dStr;

                  return (
                    <button 
                      key={'day-'+i}
                      onClick={() => setSelectedDate(d)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all cursor-pointer border ${
                        isSelected ? `${theme.primary} font-black shadow-md border-transparent scale-105 z-10` : 
                        isToday ? `${theme.bgSoft} ${theme.accent} font-black ${theme.border}` :
                        'hover:bg-gray-50 text-gray-700 border-gray-100'
                      }`}
                    >
                      <span className="text-sm">{day}</span>
                      {hasEvents && !isSelected && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isToday ? theme.primary : 'bg-slate-800'}`}></div>
                      )}
                      {hasEvents && isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1 opacity-90"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Day's Events */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] min-h-[440px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <Clock className={theme.accent} size={18} /> 
                  {selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}
                </h3>
                <span className="text-[11px] font-bold text-gray-400">{dayEvents.length} Etkinlik</span>
              </div>
              
              <div className="space-y-3">
                {dayEvents.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
                    <CalendarIcon size={36} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-bold text-gray-700 mb-1">Etkinlik Bulunmuyor</p>
                    <p className="text-xs font-medium text-gray-400">Seçilen bu tarih için kayıtlı bir programınız yok.</p>
                  </div>
                ) : (
                  (dayEvents || []).map((item, idx) => {
                    let typeColor = 'bg-slate-100 text-slate-700';
                    if (item.calendarType !== 'personal') {
                      typeColor = item.type === 'Eğitim' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-slate-900 text-white font-bold';
                    } else {
                      switch (item.type) {
                        case 'Gönüllü Staj': typeColor = 'bg-purple-100 text-purple-800 font-bold'; break;
                        case 'Ulusal Staj': typeColor = 'bg-cyan-100 text-cyan-800 font-bold'; break;
                        case 'Zorunlu Staj': typeColor = 'bg-amber-100 text-amber-800 font-bold'; break;
                        case 'Dönem Stajı': typeColor = 'bg-indigo-100 text-indigo-800 font-bold'; break;
                        case 'Sınav': typeColor = 'bg-rose-100 text-rose-800 font-bold'; break;
                        case 'Mülakat': typeColor = 'bg-teal-100 text-teal-800 font-bold'; break;
                        default: typeColor = 'bg-slate-100 text-slate-800 font-bold'; break;
                      }
                    }

                    return (
                      <div key={'event-'+idx} className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 shadow-xs transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg ${typeColor}`}>
                            {item.type || 'Etkinlik'}
                          </span>
                          {item.calendarType === 'personal' && (
                            <button onClick={() => deletePersonalEvent(item.id)} className="text-gray-400 hover:text-rose-600 transition cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <h4 className="font-black text-gray-900 text-sm mb-2 leading-tight">{item.title}</h4>
                        {item.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mb-1 font-medium">
                            <MapPin size={13} className="text-gray-400" /> {item.location}
                          </p>
                        )}
                        {item.time && (
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                            <Clock size={13} className="text-gray-400" /> {item.time}
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
                                  window.toast.success("Mesaj Kariyer Geliştirme Merkezine iletildi.");
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              <Send size={14} className="text-slate-600" />
                              KGM'ye Evrak / Mesaj Bildir
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
                <input required type="date" value={newPersonalEvent.date} onChange={e => setNewPersonalEvent({...newPersonalEvent, date: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                <select value={newPersonalEvent.type} onChange={e => setNewPersonalEvent({...newPersonalEvent, type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000]">
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
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition cursor-pointer">İptal</button>
                <button type="submit" className={`px-6 py-2 text-white font-bold rounded-xl transition shadow-xs cursor-pointer ${theme.primary}`}>Ekle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Omni Dock */}
      {effectiveRole === 'admin' && (
        <AdminOmniDock theme="amber" currentUser={currentUser} setView={setView} setSelectedUserId={setSelectedUserId} activeTab="calendar" />
      )}
      {effectiveRole === 'student' && (
        <SubPanelFloatingDock currentUser={currentUser} setView={setView} setSelectedUserId={setSelectedUserId} userRole="student" />
      )}
    </div>
  );
}


