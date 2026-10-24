/**
 * src/components/composer/CoordinateTagPicker.jsx
 * Instagram Normalize Koordinatlı ([0.0000, 1.0000]) Kişi ve Kulüp Etiketleme
 * (Akıllı Kenar Çarpışma Fiziği / Edge Flip Physics)
 */

import React, { useState, useRef } from 'react';
import { Tag, X, User, Users, Check, Search, Sparkles } from 'lucide-react';
import { useComposerStore } from '../../store/useComposerStore';
import SafeAvatar from '../shared/SafeAvatar';

// Varsayılan Etiketlenebilir Mezun/Öğrenci ve Kulüp Örnekleri
const TAGGABLE_SUGGESTIONS = [
  { id: 'usr_caner', name: 'Caner Öztürk', username: 'caner_ozturk', role: 'alumni', title: 'Kıdemli Yazılım Mühendisi' },
  { id: 'usr_ayse', name: 'Ayşe Kaya', username: 'ayse_kaya', role: 'student', title: 'Bilgisayar Mühendisliği' },
  { id: 'clb_yazilim', name: 'İESÜ Yazılım Kulübü', username: 'iesu_yazilim', role: 'club', title: 'Öğrenci Kulübü' },
  { id: 'clb_kariyer', name: 'İESÜ Kariyer Kulübü', username: 'iesu_kariyer', role: 'club', title: 'Öğrenci Kulübü' },
  { id: 'cmp_trendyol', name: 'Trendyol Tech', username: 'trendyol', role: 'company', title: 'Sanayi Protokol Hamisi' },
  { id: 'cmp_aselsan', name: 'ASELSAN', username: 'aselsan', role: 'company', title: 'Savunma Sanayii Partneri' }
];

export default function CoordinateTagPicker() {
  const slides = useComposerStore(state => state.slides);
  const activeSlideIndex = useComposerStore(state => state.activeSlideIndex);
  const addTag = useComposerStore(state => state.addTag);
  const removeTag = useComposerStore(state => state.removeTag);

  const activeSlide = slides[activeSlideIndex] || slides[0];
  const imageRef = useRef(null);

  const [activePin, setActivePin] = useState(null); // { x, y } in [0, 1]
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  if (!activeSlide) return null;

  const currentTags = activeSlide.tags || [];

  /**
   * Görsel üzerine tıklandığında normalize koordinatları hesapla
   */
  const handleImageClick = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normalizedX = Math.max(0.02, Math.min(0.98, parseFloat((clickX / rect.width).toFixed(4))));
    const normalizedY = Math.max(0.02, Math.min(0.98, parseFloat((clickY / rect.height).toFixed(4))));

    setActivePin({ x: normalizedX, y: normalizedY });
    setShowSearch(true);
    setSearchQuery('');
  };

  /**
   * Kişi veya Kulüp Etiketini Onayla
   */
  const handleSelectEntity = (entity) => {
    if (!activePin) return;

    addTag(activeSlide.id, {
      entityId: entity.id,
      name: entity.name,
      username: entity.username,
      role: entity.role,
      x: activePin.x,
      y: activePin.y
    });

    setActivePin(null);
    setShowSearch(false);
    setSearchQuery('');
  };

  /**
   * Kenar Çarpışma Fiziği (Edge Flip Physics):
   * y < 0.15 ise baloncuk alta sarkar
   * x < 0.20 ise sola yaslanır, x > 0.80 ise sağa yaslanır
   */
  const getTooltipStyle = (x, y) => {
    const isTopEdge = y < 0.18;
    const isLeftEdge = x < 0.25;
    const isRightEdge = x > 0.75;

    let transform = 'translate(-50%, ';
    transform += isTopEdge ? '12px)' : 'calc(-100% - 12px))';

    if (isLeftEdge) transform = 'translate(0, ' + (isTopEdge ? '12px)' : 'calc(-100% - 12px))');
    if (isRightEdge) transform = 'translate(-100%, ' + (isTopEdge ? '12px)' : 'calc(-100% - 12px))');

    return {
      left: `${(x * 100).toFixed(2)}%`,
      top: `${(y * 100).toFixed(2)}%`,
      transform
    };
  };

  const filteredSuggestions = TAGGABLE_SUGGESTIONS.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-slate-900 text-white rounded-2xl overflow-hidden p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-red-500" />
          <span className="text-sm font-bold">Kişi ve Kulüp Etiketle</span>
        </div>
        <span className="text-xs text-slate-400">
          Fotoğrafta etiketlemek istediğiniz yere tıklayın
        </span>
      </div>

      {/* Tıklanabilir Görsel Alanı */}
      <div className="relative flex items-center justify-center bg-black/60 rounded-xl overflow-hidden select-none border border-slate-800">
        <div 
          ref={imageRef}
          onClick={handleImageClick}
          className="relative cursor-crosshair max-w-full max-h-[380px] overflow-hidden"
        >
          <img
            src={activeSlide.previewUrl}
            alt="Etiketleme Alanı"
            className="w-full h-auto max-h-[380px] object-contain pointer-events-none"
          />

          {/* Mevcut Etiket Rozetleri */}
          {currentTags.map((tag) => (
            <div
              key={tag.id}
              style={getTooltipStyle(tag.x, tag.y)}
              className="absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 text-white text-[11px] font-bold border border-white/20 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-75 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <span>@{tag.username}</span>
              <button
                type="button"
                onClick={() => removeTag(activeSlide.id, tag.id)}
                className="hover:text-red-400 p-0.5 rounded-full transition"
                title="Etiketi Kaldır"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Dokunulan Aktif Pin ve Arama Balonu */}
          {activePin && (
            <div
              style={getTooltipStyle(activePin.x, activePin.y)}
              className="absolute z-30 w-56 bg-slate-950 border border-slate-700 rounded-2xl p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
                <span className="text-[11px] font-bold text-slate-400">Kim bu?</span>
                <button
                  type="button"
                  onClick={() => { setActivePin(null); setShowSearch(false); }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Arama Input */}
              <div className="relative mb-2">
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Kişi veya kulüp ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Önerilen Kişiler Listesi */}
              <div className="max-h-36 overflow-y-auto space-y-1">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectEntity(item)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800 text-left transition"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">@{item.username}</p>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono shrink-0">
                      {item.role === 'club' ? 'Kulüp' : item.role === 'company' ? 'Şirket' : 'Mezun'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Eklenen Etiketler Listesi */}
      {currentTags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {currentTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700"
            >
              <span>@{tag.username}</span>
              <button
                type="button"
                onClick={() => removeTag(activeSlide.id, tag.id)}
                className="text-slate-400 hover:text-red-400"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
