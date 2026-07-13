import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Flame } from 'lucide-react';

export default function StreakBadge({ streakCount = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleConfetti = () => {
    // Fire confetti from the badge location
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.1, x: 0.9 }, // Top right roughly
      colors: ['#FF4500', '#FFA500', '#FFD700'] // Fire colors
    });
    
    // Haptic feedback if supported
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  if (streakCount <= 0) return null;

  return (
    <motion.div 
      className="flex items-center gap-1 bg-orange-50 border border-orange-100 px-2 py-1 rounded-xl cursor-pointer mr-1 md:mr-2 shadow-[0_2px_10px_rgba(255,165,0,0.15)]"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleConfetti}
      title={`${streakCount} Günlük Gelişim Serisi! Her gün giriş yaparak serini koru.`}
    >
      <motion.div
        animate={isHovered ? {
          rotate: [0, -15, 15, -15, 15, 0],
          scale: [1, 1.2, 1]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        <Flame 
          size={16} 
          className="text-orange-500 fill-orange-500" 
        />
      </motion.div>
      <span className="text-orange-600 font-black text-[13px] md:text-sm tracking-tight">{streakCount}</span>
    </motion.div>
  );
}
