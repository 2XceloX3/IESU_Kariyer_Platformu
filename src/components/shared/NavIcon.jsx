import React from 'react';

const NavIcon = ({ icon, label, badge, active, onClick }) => {
  const getClasses = () => {
    switch(label) {
      case 'Ana Akış':
      case 'Akış': return { text: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
      case 'Radar & Onaylar': return { text: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-500', glow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' };
      case 'Gündem': 
      case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
      case 'İlanlar': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'Yeni İlan': return { text: 'text-orange-500', bg: 'bg-orange-50', badge: 'bg-orange-500', glow: 'drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]' };
      case 'Topluluklar': return { text: 'text-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-500', glow: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.8)]' };
      case 'Anketler': return { text: 'text-fuchsia-500', bg: 'bg-fuchsia-50', badge: 'bg-fuchsia-500', glow: 'drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]' };
      case 'Mesajlar': return { text: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-500', glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' };
      case 'Bildirimler': return { text: 'text-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-500', glow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' };
      default: return { text: 'text-[#0A2342]', bg: 'bg-red-50', badge: 'bg-[#0A2342]', glow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]' };
    }
  };
  const c = getClasses();
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-14 rounded-2xl transition-all duration-500 group ${active ? `${c.bg} ${c.text} shadow-sm` : `text-gray-500 hover:${c.text} hover:${c.bg}`}`}
      title={label}
    >
      {React.cloneElement(icon, { size: active ? 22 : 20, className: `mb-1 transition-all duration-500 ${active ? `scale-110 ${c.glow}` : `group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:${c.glow}`}` })}
      <span className={`text-[9px] font-bold tracking-wide transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block'}`}>
        {label}
      </span>
      {badge > 0 && (
        <span className={`absolute top-1 right-2 sm:right-3 w-4 h-4 ${c.badge} text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white`}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

export default NavIcon;
