import React from 'react';
import { Search } from 'lucide-react';

export function TopInfoCard({ title, count, icon, trend, color = 'blue' }) {
  const gradients = {
    blue: 'from-blue-500/10 to-blue-500/5 hover:from-blue-500/20 hover:to-blue-500/10 border-blue-100 text-blue-600',
    red: 'from-iesu-red/10 to-red-500/5 hover:from-iesu-red/20 hover:to-red-500/10 border-red-100 text-iesu-red',
    emerald: 'from-emerald-500/10 to-emerald-500/5 hover:from-emerald-500/20 hover:to-emerald-500/10 border-emerald-100 text-emerald-600',
    orange: 'from-orange-500/10 to-orange-500/5 hover:from-orange-500/20 hover:to-orange-500/10 border-orange-100 text-orange-600',
    purple: 'from-purple-500/10 to-purple-500/5 hover:from-purple-500/20 hover:to-purple-500/10 border-purple-100 text-purple-600'
  };

  const currentGradient = gradients[color] || gradients.blue;

  return (
    <div className={`bg-gradient-to-br ${currentGradient} rounded-3xl border p-5 shadow-sm transition-all duration-300 backdrop-blur-xl group cursor-pointer flex items-center justify-between`}>
      <div>
        <p className="text-[11px] font-black text-gray-600 uppercase tracking-widest mb-1 opacity-80 group-hover:opacity-100 transition-opacity">{title}</p>
        <p className="text-3xl font-black text-gray-900 flex items-center gap-2 drop-shadow-sm">
          {count}
          {trend && <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm ${trend > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{trend > 0 ? '+' : ''}{trend}</span>}
        </p>
      </div>
      <div className={`bg-white/60 p-3.5 rounded-2xl shadow-sm backdrop-blur-md group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </div>
  );
}

export function SearchFilterBar({ searchQuery, setSearchQuery, placeholder = "Ara..." }) {
  return (
    <div className="relative w-full md:max-w-md">
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-[14px] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
      />
    </div>
  );
}

export function Badge({ children, type = 'default' }) {
  const colors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${colors[type] || colors.default}`}>
      {children}
    </span>
  );
}

export function PanelHeader({ badge = 'İESÜ Kariyer', title, sub, action }) {
  const t = (title || '').toLowerCase();
  let theme = {
    bg: 'from-blue-950 via-indigo-900 to-slate-900',
    orb1: 'bg-blue-500',
    orb2: 'bg-purple-600',
    textGradient: 'from-blue-400 to-purple-400'
  };

  if (t.includes('etkinlik') || t.includes('duyuru')) {
    // Nar çiçeği / Kırmızı tonları
    theme = {
      bg: 'from-red-950 via-rose-900 to-slate-900',
      orb1: 'bg-red-500',
      orb2: 'bg-orange-600',
      textGradient: 'from-red-400 to-orange-400'
    };
  } else if (t.includes('mesaj') || t.includes('iletişim')) {
    theme = {
      bg: 'from-emerald-950 via-teal-900 to-slate-900',
      orb1: 'bg-emerald-500',
      orb2: 'bg-teal-600',
      textGradient: 'from-emerald-400 to-teal-400'
    };
  } else if (t.includes('ilan') || t.includes('iş') || t.includes('staj') || t.includes('başvuru')) {
    theme = {
      bg: 'from-orange-950 via-amber-900 to-slate-900',
      orb1: 'bg-orange-500',
      orb2: 'bg-yellow-600',
      textGradient: 'from-orange-400 to-yellow-400'
    };
  } else if (t.includes('firma') || t.includes('işveren')) {
    // Kurumsal ve ferah his için Camgöbeği/Gökyüzü Mavisi tonları
    theme = {
      bg: 'from-cyan-950 via-sky-900 to-slate-900',
      orb1: 'bg-cyan-500',
      orb2: 'bg-blue-600',
      textGradient: 'from-cyan-400 to-sky-400'
    };
  } else if (t.includes('kullanıcı') || t.includes('öğrenci') || t.includes('mezun')) {
    theme = {
      bg: 'from-purple-950 via-fuchsia-900 to-slate-900',
      orb1: 'bg-purple-500',
      orb2: 'bg-pink-600',
      textGradient: 'from-purple-400 to-pink-400'
    };
  } else if (t.includes('fırsat')) {
    // Fırsatlar için Enerjik Neon Yeşil / Sarı
    theme = {
      bg: 'from-lime-950 via-green-900 to-slate-900',
      orb1: 'bg-lime-500',
      orb2: 'bg-yellow-500',
      textGradient: 'from-lime-400 to-yellow-400'
    };
  } else if (t.includes('mentorluk')) {
    // Mentorluk için İnsani Bağ / Rehberlik (Sıcak Pembe ve Gül Kurusu / Pink & Rose)
    theme = {
      bg: 'from-pink-950 via-rose-900 to-slate-900',
      orb1: 'bg-pink-500',
      orb2: 'bg-rose-500',
      textGradient: 'from-pink-400 to-rose-400'
    };
  }

  return (
    <div className="relative bg-gray-900 rounded-3xl p-8 overflow-hidden text-white group mb-8 shadow-xl">
      {/* Zengin Arkaplan Tasarımı */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg}`}></div>
      
      {/* Hareketli Işık / Glow Efektleri */}
      <div className={`absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 ${theme.orb1} rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse`}></div>
      <div className={`absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 ${theme.orb2} rounded-full blur-[100px] opacity-30 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
      
      {/* İçerik Container'ı (z-index ile öne alma) */}
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

export default function AdminCMSLayout({ title, sub, isEditing, listView, formView, previewView, feedPreviewView, headerAction, tabs, children }) {
  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title={title} sub={sub} action={headerAction} />
      
      {tabs && (
        <div className="mb-2">
          {tabs}
        </div>
      )}
      
      {isEditing ? (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Form Alanı */}
          <div className="flex-1 w-full max-w-3xl bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h3 className="text-lg font-black text-gray-900 mb-6 border-b border-gray-100 pb-3">İçerik Düzenleyici</h3>
            {formView}
          </div>
          
          {/* Canlı Önizleme + Akış Önizleme */}
          <div className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-4 space-y-4">
            {/* Kart Önizleme */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Canlı Önizleme</h3>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 shadow-inner min-h-[300px] flex items-center justify-center relative overflow-hidden">
              <div className="w-full">
                 {previewView}
              </div>
            </div>

            {/* Akışta Nasıl Görünür? */}
            {feedPreviewView && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Akışta Görünüm</h3>
                </div>
                <div className="bg-[#F8F9FC] rounded-2xl border border-gray-200 p-3 shadow-inner relative overflow-hidden">
                  <div className="w-full">
                    {feedPreviewView}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {children ? children : (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              {listView}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
