import React, { useRef, useState, useMemo } from 'react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import StoryViewer from './StoryViewer';

export default function StoriesBar({ currentUser, stories = [], setStories }) {
  const scrollRef = useRef(null);
  const [viewingStoryIndex, setViewingStoryIndex] = useState(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const safeStories = Array.isArray(stories) ? stories : [];
  const { myStory, otherStories } = useMemo(() => {
    return {
      myStory: safeStories.find(s => s && s.author && s.author.name === currentUser?.name),
      otherStories: safeStories.filter(s => s && s.author && s.author.name !== currentUser?.name)
    };
  }, [safeStories, currentUser]);

  // Mark story as viewed when opened
  const handleOpenStory = (index) => {
    if (index === 'new') {
      setIsCreatingStory(true);
      setViewingStoryIndex(null);
      return;
    }
    setIsCreatingStory(false);
    setViewingStoryIndex(index);
    if (setStories && currentUser) {
      const story = index === -1 ? myStory : otherStories[index];
      if (story && !story.viewedBy?.includes(currentUser?.id)) {
        setStories(prev => prev.map(s => 
          s.id === story.id ? { ...s, viewedBy: [...(s.viewedBy || []), currentUser?.id] } : s
        ));
      }
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-xl border border-gray-100 p-4 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 animate-fade-in group">
        {/* Scroll Buttons */}
        <button aria-label="Sola Kaydır" onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden sm:flex hover:bg-gray-50">
          <ChevronLeft size={18} />
        </button>
        <button aria-label="Sağa Kaydır" onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex hover:bg-gray-50">
          <ChevronRight size={18} />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-2 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* OTHER STORIES */}
          {otherStories.map((story, index) => {
            const hasUnseen = !story.viewedBy?.includes(currentUser?.id);
            return (
              <div role="button" tabIndex={0} aria-label={`${story.author.name} hikayesi`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 w-[76px] cursor-pointer group/story snap-start" onClick={() => handleOpenStory(index)}>
                <div className="relative transition-transform duration-300 group-hover/story:scale-105">
                  <div className={`w-[68px] h-[68px] rounded-full p-[2.5px] ${hasUnseen ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-gray-200'}`}>
                    <div className="w-full h-full bg-white rounded-full p-[2.5px]">
                      <img 
                        src={story.author.avatar === '/logo.png' ? '/iesu-logo.svg' : (story.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(story.author.name || 'U')}&background=0A2342&color=fff`)} 
                        className="w-full h-full rounded-full object-contain p-0.5" 
                        alt={story.author.name} 
                      />
                    </div>
                  </div>
                  
                  {story.author.role === 'admin' && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm p-0.5 border border-red-100">
                      <img src="/iesu-logo.svg" className="w-full h-full object-contain" alt="Verified" />
                    </div>
                  )}
                </div>
                
                <span className="text-[11px] font-bold text-gray-700 truncate w-full text-center group-hover/story:text-gray-900 transition-colors">
                  {story.author.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {(viewingStoryIndex !== null || isCreatingStory) && (
        <StoryViewer 
          stories={isCreatingStory ? [] : viewingStoryIndex === -1 ? [myStory] : otherStories} 
          initialIndex={viewingStoryIndex === -1 ? 0 : viewingStoryIndex || 0}
          onClose={() => { setViewingStoryIndex(null); setIsCreatingStory(false); }} 
          isCreating={isCreatingStory}
          currentUser={currentUser}
          setStories={setStories}
        />
      )}
    </>
  );
}


