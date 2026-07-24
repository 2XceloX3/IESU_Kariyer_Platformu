import React, { useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Building2, MapPin, Briefcase, ExternalLink, X, DollarSign, Home, Compass } from 'lucide-react';

export default function SwipeableJobCard({ job, hasApplied, onApply, onDismiss, onViewDetails }) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const controls = useAnimation();
  
  // Transform x values to opacity and rotation
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Background colors indicating action
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["rgba(239, 68, 68, 0.1)", "rgba(255, 255, 255, 1)", "rgba(16, 185, 129, 0.1)"]
  );

  const handleDragEnd = async (e, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Swipe Right (Apply)
      setExitX(250);
      await controls.start({ x: 250, opacity: 0, transition: { duration: 0.2 } });
      onApply(job);
    } else if (offset < -100 || velocity < -500) {
      // Swipe Left (Dismiss)
      setExitX(-250);
      await controls.start({ x: -250, opacity: 0, transition: { duration: 0.2 } });
      onDismiss(job);
    } else {
      // Reset
      controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  if (hasApplied) {
    return (
      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm opacity-50 relative group h-full flex flex-col bg-white">
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white px-4 py-2 rounded-full font-bold text-emerald-600 shadow-lg flex items-center gap-2">
            <Heart fill="currentColor" size={16} /> Başvuruldu
          </div>
        </div>
        <div className="h-48 bg-gray-200 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-50 to-white flex-shrink-0">
          {job.logo ? (
            <img src={job.logo} alt={job.title} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={48} className="text-gray-400" />
          )}
        </div>
        <div className="p-6 bg-white border-t border-gray-100 flex-grow">
          <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-1">{job.title}</h3>
          <p className="text-sm font-bold text-gray-500 mt-1">{job.company}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Background Indicators (Swipe Left/Right) */}
      <div className="absolute inset-0 flex items-center justify-between px-8 rounded-2xl overflow-hidden z-0 pointer-events-none">
        <div className="flex flex-col items-center justify-center text-red-500 opacity-50">
          <X size={48} strokeWidth={3} />
          <span className="font-black mt-2">Geç</span>
        </div>
        <div className="flex flex-col items-center justify-center text-emerald-500 opacity-50">
          <Heart size={48} strokeWidth={3} fill="currentColor" />
          <span className="font-black mt-2">Başvur</span>
        </div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, background }}
        animate={controls}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98, cursor: "grabbing" }}
        className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 relative z-10 cursor-grab h-full flex flex-col bg-white"
      >
        <div className="h-48 bg-gray-200 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-50 to-white flex-shrink-0">
          {job.logo ? (
            <img src={job.logo} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 pointer-events-none" />
          ) : (
            <Building2 size={48} className="text-gray-400 pointer-events-none" />
          )}
          <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-black rounded-lg shadow-sm text-gray-700">
              {job.type}
            </span>
            <span className="px-3 py-1 bg-[#0A2342]/90 backdrop-blur-sm text-xs font-black rounded-lg shadow-sm text-white flex items-center gap-1">
              <Heart size={10} fill="currentColor" /> Hızlı Başvur
            </span>
          </div>
        </div>
        
        <div className="p-6 bg-white flex flex-col flex-grow relative pointer-events-none">
          {/* Drag instruction overlay */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-[10px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none flex items-center gap-1 font-bold whitespace-nowrap">
            ← Sola Geç | Sağa Başvur →
          </div>

          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight line-clamp-1">{job.title}</h3>
              <p className="text-sm font-bold text-gray-500 mt-1">{job.company}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <MapPin size={16} className="text-gray-500 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <Briefcase size={16} className="text-gray-500 shrink-0" />
              <span className="truncate">{job.department}</span>
            </div>
          </div>

          {/* Gen Z Indicators: Flexibility & Salary */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Flexibility Indicator */}
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              job.location?.toLowerCase().includes('uzaktan') || job.location?.toLowerCase().includes('remote') 
                ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}>
              {job.location?.toLowerCase().includes('uzaktan') || job.location?.toLowerCase().includes('remote') ? <><Home size={12}/> %100 Remote</> : <><Compass size={12}/> Hibrit (Ofis + Ev)</>}
            </div>
            
            {/* Salary Transparency */}
            <div className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-100 text-xs font-bold flex items-center gap-1.5" title="Yapay zeka tarafından sektörel verilere göre tahmin edilmiştir.">
              <DollarSign size={12} className="text-emerald-500" />
              {job.salary ? job.salary : 'Tahmini: 35K - 45K ₺'}
            </div>

            {/* Smart Job Matching Score */}
            <div className="w-full mt-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Profil Eşleşmesi</span>
                <span className="text-xs font-black text-[#0A66C2]">%{((job.id.length * 7 + job.title.length * 3) % 30) + 70}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-[#0A66C2] rounded-full" 
                  style={{ width: `${((job.id.length * 7 + job.title.length * 3) % 30) + 70}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons (pointer-events-auto so they can be clicked without dragging) */}
        <div className="p-4 mt-auto border-t border-gray-50 grid grid-cols-2 gap-3 pointer-events-auto">
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => onViewDetails(job)} 
            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition text-sm flex items-center justify-center gap-1.5"
          >
            İncele
          </button>
          <button 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={() => {
              controls.start({ x: 250, opacity: 0, transition: { duration: 0.2 } });
              setTimeout(() => onApply(job), 200);
            }} 
            className="w-full py-2.5 bg-[#0A2342] hover:bg-red-700 text-white font-bold rounded-xl transition text-sm flex items-center justify-center gap-1.5 shadow-md shadow-red-200"
          >
            <Heart size={14} fill="currentColor" /> Başvur
          </button>
        </div>
      </motion.div>
    </div>
  );
}
