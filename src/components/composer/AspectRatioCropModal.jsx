/**
 * src/components/composer/AspectRatioCropModal.jsx
 * Instagram En-Boy Oranı Kilidi & Etkileşimli Kırpma Modalı
 * (1:1 Kare, 4:5 Dikey, 1.91:1 Yatay & Kılavuz Çizgileri)
 */

import React, { useState } from 'react';
import { Square, Smartphone, Monitor, ZoomIn, ZoomOut, Check, X, Lock } from 'lucide-react';
import { useComposerStore } from '../../store/useComposerStore';
import { ASPECT_RATIOS, bakeSlideCrop } from '../../services/mediaPreprocessor';
import { useTranslation } from '../../i18n';

export default function AspectRatioCropModal({ onNext, onClose }) {
  const { t } = useTranslation();
  const slides = useComposerStore(state => state.slides);
  const activeSlideIndex = useComposerStore(state => state.activeSlideIndex);
  const lockedAspectRatio = useComposerStore(state => state.lockedAspectRatio);
  const setAspectRatio = useComposerStore(state => state.setAspectRatio);
  const updateSlideCrop = useComposerStore(state => state.updateSlideCrop);
  const updateSlide = useComposerStore(state => state.updateSlide);

  const activeSlide = slides[activeSlideIndex] || slides[0];
  const [zoom, setZoom] = useState(activeSlide?.crop?.zoom || 1.0);
  const currentAspect = lockedAspectRatio || activeSlide?.crop?.aspect || '1:1';

  if (!activeSlide) return null;

  const handleAspectChange = (aspectKey) => {
    setAspectRatio(aspectKey);
  };

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
    updateSlideCrop(activeSlide.id, { zoom: newZoom });
  };

  const handleApplyAndNext = () => {
    if (activeSlide) {
      updateSlideCrop(activeSlide.id, { aspect: currentAspect, zoom });
      const pan = { x: activeSlide?.crop?.x || 0, y: activeSlide?.crop?.y || 0 };
      bakeSlideCrop(activeSlide, currentAspect, zoom, pan)
        .then((baked) => {
          if (updateSlide && baked) {
            updateSlide(activeSlide.id, {
              blob: baked.blob,
              previewUrl: baked.previewUrl,
              width: baked.width,
              height: baked.height,
              mimeType: baked.mimeType,
              crop: baked.crop
            });
          }
        })
        .catch((err) => {
          console.warn('[AspectRatioCropModal] Bake crop exception:', err);
        });
    }
    if (onNext) onNext();
  };

  // En-boy oranına göre CSS stil sınıfları
  const getAspectClass = () => {
    switch (currentAspect) {
      case '4:5': return 'aspect-[4/5] max-h-[500px]';
      case '1.91:1': return 'aspect-[1.91/1] max-h-[360px]';
      case '1:1':
      default: return 'aspect-square max-h-[440px]';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-red-500" />
          <span className="text-sm font-bold tracking-tight">{t('composer.cropTitle') || 'Kırpma & En-Boy Oranı Kilidi'}</span>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button 
              type="button" 
              onClick={onClose} 
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-black/60 relative overflow-hidden select-none min-h-[320px]">
        <div className={`relative overflow-hidden bg-black rounded-lg transition-all duration-300 w-full max-w-[480px] flex items-center justify-center border border-slate-700/60 shadow-xl ${getAspectClass()}`}>
          {/* Rule of Thirds Grid Overlay */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 border border-white/20">
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-r border-b border-white/20" />
            <div className="border-b border-white/20" />
            <div className="border-r border-white/20" />
            <div className="border-r border-white/20" />
            <div />
          </div>

          {/* Active Image */}
          <img
            src={activeSlide.previewUrl}
            alt="Kırpma Önizleme"
            style={{
              transform: `scale(${zoom})`,
              transition: 'transform 0.1s ease-out'
            }}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Controls Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
        {/* Preset Selector */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => handleAspectChange('1:1')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentAspect === '1:1' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square size={14} /> {t('composer.square') || '1:1 Kare'}
            </button>
            <button
              type="button"
              onClick={() => handleAspectChange('4:5')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentAspect === '4:5' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} /> {t('composer.portrait') || '4:5 Dikey'}
            </button>
            <button
              type="button"
              onClick={() => handleAspectChange('1.91:1')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                currentAspect === '1.91:1' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={14} /> {t('composer.landscape') || '1.91:1 Yatay'}
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <ZoomOut size={14} className="text-slate-400" />
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={handleZoomChange}
              className="w-20 sm:w-28 accent-red-600 cursor-pointer"
            />
            <ZoomIn size={14} className="text-slate-400" />
            <span className="text-[11px] font-mono text-slate-300 min-w-[32px]">
              {zoom.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Lock Notice & Proceed Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lock size={12} className="text-amber-400" />
            {t('composer.lockNotice', { count: slides.length }) || `Bu oran karuseldeki tüm (${slides.length}) slayta kilitlendi (CLS = 0.00).`}
          </span>

          {onNext && (
            <button
              type="button"
              onClick={handleApplyAndNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>{t('composer.next') || t('common.next') || 'İleri'}</span>
              <Check size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
