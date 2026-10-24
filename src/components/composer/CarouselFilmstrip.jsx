/**
 * src/components/composer/CarouselFilmstrip.jsx
 * 1-10 Slayt Destekli Karusel Film Şeridi (Filmstrip)
 * (Sıralama Değiştirme, Slayt Silme, Yeni Medya Ekleme & İndis Gösterimi)
 */

import React, { useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { useComposerStore } from '../../store/useComposerStore';
import { useTranslation } from '../../i18n';

export default function CarouselFilmstrip({ onAddFiles }) {
  const { t } = useTranslation();
  const slides = useComposerStore(state => state.slides);
  const activeSlideIndex = useComposerStore(state => state.activeSlideIndex);
  const setActiveSlide = useComposerStore(state => state.setActiveSlide);
  const removeSlide = useComposerStore(state => state.removeSlide);
  const reorderSlides = useComposerStore(state => state.reorderSlides);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onAddFiles) {
        onAddFiles(e.target.files);
      } else {
        useComposerStore.getState().addFiles(e.target.files);
      }
      e.target.value = '';
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/90 border-t border-slate-800 p-2.5">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          {t('composer.filmstripTitle', { count: slides.length }) || `Karusel Slaytları (${slides.length} / 10)`}
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          {t('composer.activeSlide', { current: activeSlideIndex + 1, total: slides.length }) || `Aktif: ${activeSlideIndex + 1} / ${slides.length}`}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
        {slides.map((slide, index) => {
          const isActive = index === activeSlideIndex;
          return (
            <div
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              className={`relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                isActive 
                  ? 'border-red-600 ring-2 ring-red-500/30 scale-105 z-10 shadow-lg' 
                  : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
              }`}
            >
              <img
                src={slide.previewUrl}
                alt={`Slayt ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Slayt Numarası Rozeti */}
              <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                {index + 1}
              </span>

              {/* Sıralama Okları (Hover ile görünür) */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-0.5 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderSlides(slide.id, 'left');
                    }}
                    title={t('composer.moveLeft') || 'Sola Taşı'}
                    className="p-0.5 hover:bg-white/20 rounded text-white"
                  >
                    <ChevronLeft size={12} />
                  </button>
                ) : <span className="w-3" />}

                {/* Sil Butonu */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(slide.id);
                  }}
                  title={t('composer.removeSlide') || 'Slaytı Kaldır'}
                  className="p-0.5 hover:bg-red-600 rounded text-white transition"
                >
                  <X size={12} />
                </button>

                {index < slides.length - 1 ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderSlides(slide.id, 'right');
                    }}
                    title={t('composer.moveRight') || 'Sağa Taşı'}
                    className="p-0.5 hover:bg-white/20 rounded text-white"
                  >
                    <ChevronRight size={12} />
                  </button>
                ) : <span className="w-3" />}
              </div>
            </div>
          );
        })}

        {/* Yeni Medya Ekle Butonu (+ en fazla 10) */}
        {slides.length < 10 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={t('composer.addMedia') || 'Yeni Medya Ekle (Karusel)'}
            className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 hover:border-red-500 hover:bg-red-500/10 flex flex-col items-center justify-center text-slate-400 hover:text-red-400 transition cursor-pointer"
          >
            <Plus size={18} />
            <span className="text-[9px] font-bold mt-0.5">{t('composer.addMore') || 'Ekle'}</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>
        )}
      </div>
    </div>
  );
}
