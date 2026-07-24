import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { liveSliderData } from '../../utils/liveData';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const heroSlides = liveSliderData;

  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPaused, heroSlides.length]);

  return (
    <section 
      className="relative h-[400px] md:h-[480px] bg-gray-900 overflow-hidden group"
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      onFocus={() => setIsCarouselPaused(true)}
      onBlur={() => setIsCarouselPaused(false)}
    >
      {/* Arrow Left */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={(e) => { e.preventDefault(); setCurrentSlide(p => p === 0 ? heroSlides.length - 1 : p - 1); }}
        aria-label="Önceki Slayt"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Arrow Right */}
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={(e) => { e.preventDefault(); setCurrentSlide(p => (p + 1) % heroSlides.length); }}
        aria-label="Sonraki Slayt"
      >
        <ChevronRight size={24} />
      </button>

      {heroSlides.map((slide, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-700"
            onClick={slide.action}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-12 left-6 md:left-12 right-6 md:right-12 z-10 text-white max-w-3xl pointer-events-none">
            {slide.badge && (
              <span className="inline-block text-[11px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-500/30 mb-3">
                {slide.badge}
              </span>
            )}
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
              {slide.title}
            </h2>
          </div>
        </div>
      ))}
      
      {/* Slider Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {heroSlides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slayt ${idx + 1}`}
            aria-current={idx === currentSlide ? "true" : "false"}
            className={`h-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/50 ${idx === currentSlide ? 'w-10 bg-[#0A2342]' : 'w-2 bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
}
