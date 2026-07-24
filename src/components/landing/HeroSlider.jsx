import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, GraduationCap, Building2, Monitor, Calendar, MessageSquare } from 'lucide-react';
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
    <div className="relative w-full">
      {/* Hero Banner Slider */}
      <section 
        className="relative h-[380px] md:h-[480px] bg-gray-900 overflow-hidden group"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onFocus={() => setIsCarouselPaused(true)}
        onBlur={() => setIsCarouselPaused(false)}
      >
        {/* Arrow Left */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none"
          onClick={(e) => { e.preventDefault(); setCurrentSlide(p => p === 0 ? heroSlides.length - 1 : p - 1); }}
          aria-label="Önceki Slayt"
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Arrow Right */}
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none"
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
            <a href={slide.actionLink || '#'} target="_blank" rel="noopener noreferrer">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="absolute inset-0 w-full h-full object-cover cursor-pointer hover:scale-[1.01] transition-transform duration-700"
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
              className={`h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-[#990000]' : 'w-2 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>
      </section>

      {/* Official Esenyurt Quick Access Bar (Matching User's Screenshot) */}
      <div className="bg-[#0A2342] py-3.5 px-4 shadow-2xl border-t-2 border-[#990000] relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Floating Orange Badge: Aday Öğrenci */}
          <a 
            href="https://aday.esenyurt.edu.tr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#F58220] hover:bg-[#d96f16] text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            <GraduationCap size={18} /> ADAY ÖĞRENCİ
          </a>

          {/* 4 Quick Access Blue Cards matching Esenyurt University official layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full max-w-4xl">
            <a 
              href="https://aday.esenyurt.edu.tr/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#124B8E] hover:bg-[#1656a2] text-white p-3 rounded-xl flex items-center gap-3 transition-colors shadow-sm group"
            >
              <GraduationCap size={22} className="text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider leading-none">ADAY ÖĞRENCİ</span>
              </div>
            </a>

            <a 
              href="https://www.esenyurt.edu.tr/icerik/1269-ogrenci-isleri-daire-baskanligi" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#1957A3] hover:bg-[#1e64b9] text-white p-3 rounded-xl flex items-center gap-3 transition-colors shadow-sm group"
            >
              <Building2 size={22} className="text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider leading-none">ÖĞRENCİ İŞLERİ</span>
              </div>
            </a>

            <a 
              href="https://obs.esenyurt.edu.tr/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#2166B8] hover:bg-[#2873cf] text-white p-3 rounded-xl flex items-center gap-3 transition-colors shadow-sm group"
            >
              <Monitor size={22} className="text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider leading-none">ÖĞRENCİ BİLGİ SİSTEMİ</span>
              </div>
            </a>

            <a 
              href="https://www.esenyurt.edu.tr/icerik/1031-akademik-takvim" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#0097D7] hover:bg-[#00abf3] text-white p-3 rounded-xl flex items-center gap-3 transition-colors shadow-sm group"
            >
              <Calendar size={22} className="text-blue-200 group-hover:scale-110 transition-transform shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider leading-none">AKADEMİK TAKVİM</span>
              </div>
            </a>
          </div>

          {/* Floating Green Badge: Bize Ulaşın */}
          <a 
            href="https://api.whatsapp.com/send?phone=905529130909" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            <MessageSquare size={18} /> BİZE ULAŞIN
          </a>

        </div>
      </div>
    </div>
  );
}
