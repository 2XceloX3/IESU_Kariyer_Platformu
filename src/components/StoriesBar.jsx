import React, { useRef } from 'react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';

const DUMMY_STORIES = [
  { id: 1, type: 'user', name: 'Hikayen', avatar: 'https://ui-avatars.com/api/?name=Öğrenci&background=132A49&color=fff', hasUnseen: false, isAdd: true },
  { id: 2, type: 'company', name: 'TechCorp A.Ş.', avatar: 'https://ui-avatars.com/api/?name=TC&background=2563EB&color=fff', hasUnseen: true },
  { id: 3, type: 'club', name: 'Yazılım Kulübü', avatar: 'https://ui-avatars.com/api/?name=YK&background=DC2626&color=fff', hasUnseen: true },
  { id: 4, type: 'admin', name: 'Kariyer Ofisi', avatar: '/iesu-logo.svg', hasUnseen: true, isOfficial: true },
  { id: 5, type: 'company', name: 'Global Tech', avatar: 'https://ui-avatars.com/api/?name=GT&background=059669&color=fff', hasUnseen: true },
  { id: 6, type: 'alumni', name: 'Ahmet Yılmaz', avatar: 'https://ui-avatars.com/api/?name=AY&background=7C3AED&color=fff', hasUnseen: false },
  { id: 7, type: 'club', name: 'Girişimcilik', avatar: 'https://ui-avatars.com/api/?name=G&background=EA580C&color=fff', hasUnseen: false },
];

export default function StoriesBar({ currentUser }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 animate-fade-in group">
      {/* Scroll Buttons */}
      <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden sm:flex hover:bg-gray-50">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex hover:bg-gray-50">
        <ChevronRight size={18} />
      </button>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-2 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DUMMY_STORIES.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 w-[72px] cursor-pointer group/story snap-start">
            <div className="relative">
              {/* Story Ring */}
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.hasUnseen ? 'bg-gradient-to-tr from-iesu-red to-iesu-coral' : 'bg-gray-200'}`}>
                <div className="w-full h-full bg-white rounded-full p-0.5">
                  <img 
                    src={story.isAdd ? (currentUser?.avatar || story.avatar) : story.avatar} 
                    className="w-full h-full rounded-full object-cover" 
                    alt={story.name} 
                  />
                </div>
              </div>
              
              {/* Add Icon for User */}
              {story.isAdd && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                  <Plus size={12} strokeWidth={3} />
                </div>
              )}

              {/* Official Badge */}
              {story.isOfficial && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <img src="/iesu-logo.svg" className="w-4 h-4" alt="Verified" />
                </div>
              )}
            </div>
            
            {/* Story Name */}
            <span className="text-[11px] font-bold text-gray-700 truncate w-full text-center group-hover/story:text-gray-900 transition-colors">
              {story.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
