import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, UserCheck } from 'lucide-react';

export default function AIMatchmaker({ alumniList = [] }) {
  const [isMatching, setIsMatching] = useState(false);
  const [match, setMatch] = useState(null);

  const findMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      const bestMatch = alumniList[Math.floor(Math.random() * alumniList.length)] || { 
        name: 'Ahmet Yılmaz', 
        department: 'Yazılım Mühendisi', 
        avatar: 'https://ui-avatars.com/api/?name=Ahmet' 
      };
      setMatch(bestMatch);
      setIsMatching(false);
    }, 2500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm mb-6">
      <h3 className="text-[15px] font-black text-indigo-900 mb-2 flex items-center gap-2">
        <Wand2 className="text-indigo-600" size={18} /> AI Kariyer Eşleşmesi
      </h3>
      <p className="text-[12px] text-indigo-700 mb-4 font-medium leading-relaxed">
        Yapay zeka profilini ve yeteneklerini analiz ederek sana en uygun mentorü veya şirketi bulsun.
      </p>
      
      {!match ? (
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={findMatch}
          disabled={isMatching}
          className="w-full bg-indigo-600 text-white text-[13px] font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md relative overflow-hidden"
        >
          {isMatching ? 'Profiller Analiz Ediliyor...' : 'Yapay Zeka ile Eşleş'}
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
          <img src={match.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-100" alt="Mentor" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[13px] text-gray-900 truncate">{match.name}</h4>
            <p className="text-[11px] text-gray-500 truncate">{match.department}</p>
          </div>
          <button className="bg-indigo-50 text-indigo-700 p-2 rounded-lg hover:bg-indigo-100 transition-colors shrink-0">
            <UserCheck size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
