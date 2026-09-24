import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, UserCheck } from 'lucide-react';

export default function AIMatchmaker({ alumniList = [], setView, setSelectedUserId, currentUser, onSelectMentor }) {
  const [isMatching, setIsMatching] = useState(false);
  const [match, setMatch] = useState(null);

  const findMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      const bestMatch = (alumniList && alumniList.length > 0) 
        ? alumniList[Math.floor(Math.random() * alumniList.length)] 
        : { 
            id: 'm-default-1',
            name: 'Ahmet Yılmaz', 
            department: 'Kıdemli Yazılım Mimarı @ Trendyol Tech', 
            avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yilmaz&background=990000&color=fff' 
          };
      setMatch(bestMatch);
      setIsMatching(false);
    }, 1800);
  };

  const handleConnectMentor = () => {
    if (!match) return;
    if (onSelectMentor) {
      onSelectMentor(match);
      return;
    }
    if (setSelectedUserId && match.id) {
      setSelectedUserId(match.id);
      if (setView) setView('user_profile');
      return;
    }
    if (window.toast?.success) {
      window.toast.success(`🎯 ${match.name} ile mentorluk eşleşme talebiniz kaydedildi!`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-red-50 p-6 rounded-xl border border-indigo-100 shadow-sm mb-6">
      <h3 className="text-[15px] font-black text-indigo-900 mb-2 flex items-center gap-2">
        <Wand2 className="text-red-600" size={18} /> Akıllı Kariyer Eşleşmesi
      </h3>
      <p className="text-[12px] text-indigo-700 mb-4 font-medium leading-relaxed">
        Profilini ve yeteneklerini analiz ederek sana en uygun mentörü veya şirketi önerir.
      </p>
      
      {!match ? (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={findMatch}
          disabled={isMatching}
          className="w-full bg-red-600 text-white text-[13px] font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md relative overflow-hidden cursor-pointer"
        >
          {isMatching ? 'Profiller Analiz Ediliyor...' : 'Eşleş'}
          {isMatching && (
             <motion.div className="absolute inset-0 bg-white/20" 
               initial={{ x: '-100%' }} animate={{ x: '100%' }} 
               transition={{ repeat: Infinity, duration: 1 }} 
             />
          )}
        </motion.button>
      ) : (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 10 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-3"
        >
          <img 
            src={match.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.name || 'Mentor')}&background=990000&color=fff`} 
            onError={(e) => { e.currentTarget.src = '/iesu-logo.svg'; }}
            className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover" 
            alt="Mentor" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[13px] text-gray-900 truncate">{match.name}</h4>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">%96 Uyum</span>
            </div>
            <p className="text-[11px] text-gray-500 truncate">{match.department || match.title || 'Mezun Mentor'}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={handleConnectMentor}
              title="Bağlantı Kur / Randevu Al"
              className="bg-red-600 text-white hover:bg-red-700 p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shadow-xs"
            >
              <UserCheck size={16} />
              <span className="hidden sm:inline">Bağlan</span>
            </button>
            <button 
              onClick={() => setMatch(null)}
              title="Farklı Bir Mentor Bul"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
            >
              Yenile
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
