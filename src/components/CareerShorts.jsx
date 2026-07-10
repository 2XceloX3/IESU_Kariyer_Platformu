import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, X, Play, Pause, ChevronUp, ChevronDown, UserPlus, FileText } from 'lucide-react';

const DUMMY_SHORTS = [
  {
    id: 1,
    author: { name: 'TechCorp A.Ş.', avatar: 'https://ui-avatars.com/api/?name=TC&background=0F766E&color=fff', role: 'Firma' },
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Yazılım Stajyerlerimiz Bir Gününü Nasıl Geçiriyor?',
    description: 'Ofis turu, günlük stand-up toplantıları ve kahve molaları! Sen de ekibimize katılmak istersen ilanımıza başvur.',
    likes: 1245,
    comments: 89,
    shares: 42,
    hasApplied: false
  },
  {
    id: 2,
    author: { name: 'Girişimcilik Kulübü', avatar: 'https://ui-avatars.com/api/?name=GK&background=DC2626&color=fff', role: 'Kulüp' },
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Girişimcilik Zirvesi 2026',
    description: 'Sektörün devleriyle buluştuğumuz muhteşem zirvenin kısa bir özeti. Yeni etkinliklerde görüşmek üzere!',
    likes: 856,
    comments: 34,
    shares: 112,
    hasApplied: false
  }
];

export default function CareerShorts({ setView, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState({});
  const videoRefs = useRef([]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex && isPlaying) {
        video.play().catch(e => console.log('Autoplay prevented:', e));
      } else {
        video.pause();
      }
    });
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    if (currentIndex < DUMMY_SHORTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const toggleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentShort = DUMMY_SHORTS[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center animate-fade-in">
      
      {/* CLOSE BUTTON */}
      <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition">
        <X size={24} />
      </button>

      {/* MOBILE OPTIMIZED CONTAINER */}
      <div className="relative w-full max-w-[450px] h-[100dvh] sm:h-[90vh] sm:rounded-3xl bg-gray-900 overflow-hidden shadow-2xl flex flex-col">
        
        {/* VIDEO PLAYER */}
        <div className="absolute inset-0 cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
          <video
            ref={el => videoRefs.current[currentIndex] = el}
            src={currentShort.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
          
          {/* Pause Indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
              <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center">
                <Play size={40} className="text-white fill-white ml-2" />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-20 items-center">
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <img src={currentShort.author.avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt="Author" />
            <button className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-iesu-red text-white rounded-full p-1 shadow-lg">
              <UserPlus size={14} />
            </button>
          </div>
          
          {/* Like */}
          <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={(e) => { e.stopPropagation(); toggleLike(currentShort.id); }}>
            <div className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/40 transition">
              <Heart size={26} className={liked[currentShort.id] ? "fill-iesu-red text-iesu-red" : "text-white"} />
            </div>
            <span className="text-white text-xs font-bold">{liked[currentShort.id] ? currentShort.likes + 1 : currentShort.likes}</span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/40 transition">
              <MessageCircle size={26} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold">{currentShort.comments}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <div className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black/40 transition">
              <Share2 size={26} className="text-white" />
            </div>
            <span className="text-white text-xs font-bold">{currentShort.shares}</span>
          </div>
        </div>

        {/* BOTTOM CONTENT (TITLE & DESCRIPTION) */}
        <div className="absolute bottom-0 left-0 w-full p-6 pb-12 sm:pb-8 z-20 pointer-events-none">
          <h2 className="text-white font-black text-xl mb-2 drop-shadow-md">{currentShort.author.name} <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg ml-2">{currentShort.author.role}</span></h2>
          <p className="text-white font-bold text-lg mb-2 drop-shadow-md">{currentShort.title}</p>
          <p className="text-gray-200 text-sm mb-4 line-clamp-2 drop-shadow-md">{currentShort.description}</p>
          
          <button className="w-full bg-white text-gray-900 hover:bg-gray-100 font-black py-3.5 rounded-xl transition shadow-[0_4px_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 pointer-events-auto">
            <FileText size={18} /> {currentShort.author.role === 'Firma' ? 'Hemen Başvur' : 'Kulübe Katıl'}
          </button>
        </div>

        {/* NAVIGATION CONTROLS (Desktop) */}
        <div className="hidden sm:flex absolute right-[-80px] top-1/2 -translate-y-1/2 flex-col gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className="w-14 h-14 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md rounded-full flex items-center justify-center text-white transition">
            <ChevronUp size={30} />
          </button>
          <button onClick={handleNext} disabled={currentIndex === DUMMY_SHORTS.length - 1} className="w-14 h-14 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md rounded-full flex items-center justify-center text-white transition">
            <ChevronDown size={30} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
