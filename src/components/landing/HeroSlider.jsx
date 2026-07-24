import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { liveSliderData } from '../../utils/liveData';

export default function HeroSlider({ onSelectSlide }) {
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

  const handleSlideClick = (slide) => {
    if (onSelectSlide) {
      onSelectSlide({
        title: slide.title,
        date: "Güncel Duyuru",
        category: slide.badge || "Duyuru",
        description: `${slide.title} - İstanbul Esenyurt Üniversitesi Resmi Duyurusudur.`,
        content: `### ${slide.title}\n\nİstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü portalında yayınlanan bu duyuru ve görsel ile ilgili tüm detaylar ve etkinlik takvimi için öğrenci panellerimizi kullanabilirsiniz.\n\nİlgili Başvuru Adresi: ${slide.actionLink || 'https://www.esenyurt.edu.tr'}`,
        imageUrl: slide.image,
        url: slide.actionLink
      });
    } else if (slide.actionLink) {
      window.open(slide.actionLink, '_blank');
    }
  };

  return (
    <section 
      className="relative w-full aspect-[16/7] min-h-[300px] max-h-[580px] bg-[#061121] overflow-hidden group shadow-md"
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
          <div 
            onClick={() => handleSlideClick(slide)}
            className="w-full h-full cursor-pointer"
          >
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
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
