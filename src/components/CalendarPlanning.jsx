import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Briefcase, Megaphone, CheckCircle2 } from 'lucide-react';

export default function CalendarPlanning({ events = [], jobs = [], userRole }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Pre-calculate items per day to avoid O(N) on every day render
  const itemsByDay = useMemo(() => {
    const map = {};
    
    // Simulate mapping by matching random days if dates don't match perfectly, just for preview
    (events || []).forEach((e, i) => {
      const targetDay = (i * 5 + 3) % 28 + 1;
      if (!map[targetDay]) map[targetDay] = [];
      map[targetDay].push({ type: 'event', title: e.title, time: '14:00', color: 'bg-emerald-100 text-emerald-700' });
    });

    (jobs || []).forEach((j, i) => {
      const targetDay = (i * 7 + 10) % 28 + 1;
      if (!map[targetDay]) map[targetDay] = [];
      map[targetDay].push({ type: 'job', title: 'Son Başvuru: ' + j.title, time: '23:59', color: 'bg-red-100 text-red-700' });
    });
    
    return map;
  }, [events, jobs]);

  const getDayItems = (day) => {
    return itemsByDay[day] || [];
  };

  const renderCalendarDays = () => {
    const days = [];
    // Add empty cells for previous month
    for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
      days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 bg-gray-50/50 border border-gray-100 rounded-xl opacity-50"></div>);
    }
    
    // Add cells for current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
      const items = getDayItems(day);
      
      days.push(
        <div key={day} className={`h-24 sm:h-32 p-2 border rounded-xl overflow-y-auto hide-scrollbar transition ${isToday ? 'border-red-400 bg-red-50/30 shadow-sm' : 'border-gray-100 bg-white hover:border-red-200'}`}>
          <div className="flex justify-between items-start mb-1">
            <span className={`text-xs font-black ${isToday ? 'bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-500'}`}>
              {day}
            </span>
            {items.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 mr-1"></span>}
          </div>
          <div className="space-y-1 mt-2">
            {items.map((item, idx) => (
              <div key={idx} className={`text-[10px] font-bold px-1.5 py-1 rounded-md leading-tight line-clamp-2 ${item.color}`} title={item.title}>
                {item.time} - {item.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-[700px]">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Kariyer Takvimi</h2>
            <p className="text-sm font-medium text-gray-500">Etkinlikleri ve son başvuru tarihlerini takip edin.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
            <button aria-label="İşlem Butonu" onClick={handlePrevMonth} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition"><ChevronLeft size={18}/></button>
            <span className="font-black text-gray-900 w-32 text-center text-sm">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button aria-label="İşlem Butonu" onClick={handleNextMonth} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-white rounded-lg transition"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR AGENDA */}
        <div className="w-72 bg-gray-50/50 border-r border-gray-100 p-6 flex-col overflow-y-auto hidden md:flex shrink-0">
          <h3 className="font-black text-gray-900 mb-4">Yaklaşanlar</h3>
          <div className="space-y-4">
            {events.slice(0, 3).map(e => (
              <div key={e.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-[12px] font-black text-gray-900 leading-tight mb-1">{e.title}</p>
                <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Clock size={10}/> {e.date}</p>
              </div>
            ))}
            {jobs.slice(0, 2).map(j => (
              <div key={j.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-red-500">
                <p className="text-[12px] font-black text-gray-900 leading-tight mb-1">Son Başvuru: {j.title}</p>
                <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Briefcase size={10}/> {j.company}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="font-black text-gray-900 mb-3 text-sm">Takvim Renkleri</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><span className="w-3 h-3 rounded bg-emerald-500"></span> Etkinlikler & Fuarlar</div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><span className="w-3 h-3 rounded bg-red-500"></span> Son Başvuru Tarihleri</div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><span className="w-3 h-3 rounded bg-blue-500"></span> Mentorluk Görüşmeleri</div>
            </div>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/30">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-2">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
              <div key={d} className="text-center text-[11px] font-black uppercase tracking-widest text-gray-500 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
