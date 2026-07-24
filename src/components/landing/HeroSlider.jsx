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
      className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-[560px] bg-[#061121] overflow-hidden group shadow-md"
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      onFocus={() => setIsCarouselPaused(true)}
      onBlur={() => setIsCarouselPaused(false)}
    >
      {/* Arrow Left */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none shadow-lg"
        onClick={(e) => { e.preventDefault(); setCurrentSlide(p => p === 0 ? heroSlides.length - 1 : p - 1); }}
        aria-label="Önceki Slayt"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Arrow Right */}
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none shadow-lg"
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
          <a href={slide.actionLink || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-contain md:object-cover object-center cursor-pointer transition-transform duration-700"
            />
          </a>
        </div>
      ))}
      
      {/* Slider Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {heroSlides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 shadow-md ${idx === currentSlide ? 'w-8 bg-[#990000]' : 'w-2.5 bg-white/70 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
}
