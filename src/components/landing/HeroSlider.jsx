import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';
import { liveSliderData } from '../../utils/liveData';
import useAppStore from '../../store/useAppStore';

export default function HeroSlider({ onSelectSlide, setView }) {
  const siteConfig = useAppStore(state => state.siteConfig);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const heroSlides = liveSliderData;

  useEffect(() => {
    if (isCarouselPaused || !heroSlides || heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (heroSlides.length > 0 ? (prev + 1) % heroSlides.length : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, [isCarouselPaused, heroSlides?.length]);

  const handleSlideClick = (slide) => {
    let cleanTitle = (slide.title || '').replace(/^#+\s*/g, '').replace(/^\.\s*$/g, '').trim();
    if (!cleanTitle || cleanTitle === '.') {
      cleanTitle = "İstanbul Esenyurt Üniversitesi Resmi Duyurusu";
    }
    
    let cleanUrl = slide.actionLink || 'https://www.esenyurt.edu.tr';
    try {
      cleanUrl = decodeURIComponent(cleanUrl);
    } catch (e) {}

    if (onSelectSlide) {
      onSelectSlide({
        title: cleanTitle,
        date: "Güncel Duyuru",
        category: slide.badge || "Duyuru",
        description: `${cleanTitle} - İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi Resmi Duyurusu.`,
        content: slide.content || `İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi portalında yayınlanan bu duyuru ve afiş ile ilgili tüm detaylar, başvuru bilgileri ve akademik takvim güncellemeleri için öğrenci panellerimizi kullanabilirsiniz.\n\nİlgili Başvuru Bağlantısı: ${cleanUrl}`,
        imageUrl: slide.image,
        url: cleanUrl
      });
    } else if (slide.actionLink) {
      window.open(slide.actionLink, '_blank');
    }
  };

  return (
    <section 
      className="relative w-full aspect-[16/9] md:aspect-[16/8] lg:aspect-[21/9] min-h-[450px] max-h-[750px] bg-[#061121] overflow-hidden group shadow-md"
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      onFocus={() => setIsCarouselPaused(true)}
      onBlur={() => setIsCarouselPaused(false)}
    >
      {/* Arrow Left */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none shadow-lg"
        onClick={(e) => { e.preventDefault(); setCurrentSlide(p => heroSlides && heroSlides.length > 0 ? (p === 0 ? heroSlides.length - 1 : p - 1) : 0); }}
        aria-label="Önceki Slayt"
      >
        <ChevronLeft size={24} />
      </button>
      
      {/* Arrow Right */}
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none shadow-lg"
        onClick={(e) => { e.preventDefault(); setCurrentSlide(p => heroSlides && heroSlides.length > 0 ? (p + 1) % heroSlides.length : 0); }}
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
            aria-label={`${idx + 1}. slayta git`}
            aria-current={idx === currentSlide ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all duration-500 shadow-md ${idx === currentSlide ? 'w-8 bg-[#990000]' : 'w-2.5 bg-white/70 hover:bg-white'}`}
          />
        ))}
      </div>

      {/* Floating CMS Hero Banner Overlay (Customized via Super Admin CMSSiteEditor) */}
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-start px-6 sm:px-12 lg:px-20 bg-gradient-to-r from-black/85 via-black/40 to-transparent">
        <div className="max-w-xl text-white space-y-3 pointer-events-auto animate-fade-in drop-shadow-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-red-200 text-[11px] font-black uppercase tracking-wider border border-white/20">
            <Sparkles size={13} className="text-yellow-400" />
            <span>{siteConfig?.logoSubText || 'İstanbul Esenyurt Üniversitesi'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            {siteConfig?.heroBannerTitle || 'Kariyerini Şekillendir'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-3 leading-relaxed max-w-lg">
            {siteConfig?.heroBannerSub || 'İESÜ Kariyer Platformu ile fırsatları keşfet, ağını genişlet ve geleceğini inşa et.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                const target = siteConfig?.ctaButtonLink || 'jobs';
                if (setView) setView(target);
              }}
              style={{ backgroundColor: siteConfig?.primaryColor || '#990000' }}
              className="px-5 py-2.5 rounded-xl text-white font-black text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{siteConfig?.ctaButtonText || 'Hemen Başla'}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
