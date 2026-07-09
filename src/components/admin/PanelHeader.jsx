import React from 'react';

export default function PanelHeader({ badge = 'İESÜ Kariyer', title, sub, action }) {
  const t = (title || '').toLowerCase();
  let theme = {
    bg: 'from-blue-950 via-indigo-900 to-slate-900',
    orb1: 'bg-blue-500',
    orb2: 'bg-indigo-600',
    textGradient: 'from-blue-400 to-indigo-400'
  };

  if (t.includes('etkinlik') || t.includes('duyuru') || t.includes('kontrol merkezi')) {
    theme = {
      bg: 'from-red-950 via-rose-900 to-slate-900',
      orb1: 'bg-red-500',
      orb2: 'bg-orange-600',
      textGradient: 'from-red-400 to-orange-400'
    };
  } else if (t.includes('mesaj') || t.includes('iletişim') || t.includes('anket') || t.includes('veri') || t.includes('organizasyon')) {
    theme = {
      bg: 'from-emerald-950 via-teal-900 to-slate-900',
      orb1: 'bg-emerald-500',
      orb2: 'bg-teal-600',
      textGradient: 'from-emerald-400 to-teal-400'
    };
  } else if (t.includes('ilan') || t.includes('iş') || t.includes('staj') || t.includes('başvuru') || t.includes('kart')) {
    theme = {
      bg: 'from-orange-950 via-amber-900 to-slate-900',
      orb1: 'bg-orange-500',
      orb2: 'bg-yellow-600',
      textGradient: 'from-orange-400 to-yellow-400'
    };
  } else if (t.includes('firma') || t.includes('işveren')) {
    theme = {
      bg: 'from-cyan-950 via-sky-900 to-slate-900',
      orb1: 'bg-cyan-500',
      orb2: 'bg-blue-600',
      textGradient: 'from-cyan-400 to-sky-400'
    };
  } else if (t.includes('kullanıcı') || t.includes('öğrenci') || t.includes('mezun') || t.includes('personel') || t.includes('akademik')) {
    theme = {
      bg: 'from-purple-950 via-fuchsia-900 to-slate-900',
      orb1: 'bg-purple-500',
      orb2: 'bg-pink-600',
      textGradient: 'from-purple-400 to-pink-400'
    };
  } else if (t.includes('fırsat') || t.includes('analiti') || t.includes('performans')) {
    theme = {
      bg: 'from-lime-950 via-green-900 to-slate-900',
      orb1: 'bg-lime-500',
      orb2: 'bg-yellow-500',
      textGradient: 'from-lime-400 to-yellow-400'
    };
  } else if (t.includes('mentorluk') || t.includes('operasyon')) {
    theme = {
      bg: 'from-pink-950 via-rose-900 to-slate-900',
      orb1: 'bg-pink-500',
      orb2: 'bg-rose-500',
      textGradient: 'from-pink-400 to-rose-400'
    };
  }

  return (
    <div className="relative bg-gray-900 rounded-3xl p-8 overflow-hidden text-white group mb-8 shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`}></div>
      <div className={`absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 ${theme.orb1} rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse`}></div>
      <div className={`absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 ${theme.orb2} rounded-full blur-[100px] opacity-30 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="inline-block text-[10px] font-black uppercase tracking-widest text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">{badge}</span>
             <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient} font-black text-xs uppercase tracking-widest`}>PRO YÖNETİM</span>
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow-md mb-2">{title}</h1>
          {sub && <p className="text-white/70 text-sm font-medium">{sub}</p>}
        </div>
        
        {action && (
          <div className="shrink-0 relative z-20 flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
