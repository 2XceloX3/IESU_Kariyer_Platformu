import React from 'react';
import { Megaphone, Calendar, Briefcase, GraduationCap, ChevronRight, Compass } from 'lucide-react';

export default function CareerRadar({ announcements = [], events = [], jobs = [], setView }) {
  // Sort and slice data to get the latest 2-3 items of each category
  const activeAnnouncements = (announcements || []).filter(a => a.status === 'Yayında').slice(0, 2);
  const activeEvents = (events || []).filter(e => e.status === 'Yayında').slice(0, 2);
  const activeJobs = (jobs || []).filter(j => j.status === 'Yayında').slice(0, 2);

  // Combine into a highlights array
  const highlights = [];
  
  activeAnnouncements.forEach(a => {
    highlights.push({ type: 'announcement', icon: <Megaphone size={18} />, title: a.title, desc: 'Kariyer Merkezi Duyurusu', color: 'bg-blue-50 text-blue-600', link: 'duyurular' });
  });

  activeEvents.forEach(e => {
    highlights.push({ type: 'event', icon: <Calendar size={18} />, title: e.title, desc: e.date || 'Yaklaşan Etkinlik', color: 'bg-emerald-50 text-emerald-600', link: 'etkinlikler' });
  });

  activeJobs.forEach(j => {
    highlights.push({ type: 'job', icon: <Briefcase size={18} />, title: j.title, desc: j.company, color: 'bg-purple-50 text-purple-600', link: 'jobs' });
  });

  // If no highlights, show a fallback card
  if (highlights.length === 0) {
    highlights.push({ type: 'welcome', icon: <Compass size={18} />, title: 'Profilinizi Tamamlayın', desc: 'Kariyer danışmanlığı randevusu alın.', color: 'bg-red-50 text-red-600', link: 'student' });
  }

  return (
    <div className="mb-8 bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-5 px-1">
        <Compass className="text-[var(--brand-pomegranate)]" size={22} />
        <h2 className="text-[17px] font-black text-gray-900 tracking-tight">Kariyer Radarı</h2>
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-red)] bg-[var(--brand-soft-red)] px-2 py-1 rounded-full ml-auto">Öne Çıkanlar</span>
      </div>
      
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
        {(highlights || []).map((item, idx) => (
          <div 
            key={idx}
            onClick={() => setView && setView(item.link)}
            className="flex-shrink-0 w-36 h-36 relative overflow-hidden rounded-[24px] border border-white/50 shadow-sm hover:shadow-md transition-all cursor-pointer snap-start group"
            style={{ background: 'linear-gradient(145deg, #ffffff 0%, #f9f9fb 100%)' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-[var(--brand-coral)] to-[var(--brand-red-dark)]"></div>
            
            <div className="flex flex-col h-full justify-between p-4 relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-white transition-transform duration-300 group-hover:-translate-y-1 ${item.color.replace('bg-', 'bg-white text-')}`}>
                {/* Ensure icon inherits color by overriding inner bg if needed, or just keep original color */}
                <div className={item.color.split(' ')[1]}>
                  {item.icon}
                </div>
              </div>
              
              <div>
                <h3 className="font-black text-[13px] text-gray-900 leading-tight line-clamp-2 mb-1 group-hover:text-[var(--brand-red)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 line-clamp-1 uppercase tracking-wide">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
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
