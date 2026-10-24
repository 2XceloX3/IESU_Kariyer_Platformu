import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Send, 
  X, 
  Plus, 
  Calendar, 
  Smile, 
  BarChart2, 
  Crop, 
  Tag, 
  Users, 
  Layers, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import DOMPurify from 'dompurify';
import eventBus from '../brain/eventBus';
import SafeAvatar from './shared/SafeAvatar';
import { getClosestPreset } from '../services/mediaPreprocessor';
import { useComposerStore } from '../store/useComposerStore';
import AspectRatioCropModal from './composer/AspectRatioCropModal';
import CarouselFilmstrip from './composer/CarouselFilmstrip';
import CoordinateTagPicker from './composer/CoordinateTagPicker';
import CoAuthorSelector from './composer/CoAuthorSelector';
import OptimisticPublishCell from './composer/OptimisticPublishCell';

export default function PostComposer({ currentUser, userRole, posts, setPosts, asClub, setActiveTab }) {
  const logAction = useAppStore(state => state.logAction);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sub-modals: 'crop' | 'tag' | 'coauthor' | null
  const [activeSubModal, setActiveSubModal] = useState(null);

  // Store bindings
  const slides = useComposerStore(state => state.slides);
  const activeSlideIndex = useComposerStore(state => state.activeSlideIndex);
  const lockedAspectRatio = useComposerStore(state => state.lockedAspectRatio);
  const coAuthors = useComposerStore(state => state.coAuthors);
  const isPublishing = useComposerStore(state => state.isPublishing);
  const addFiles = useComposerStore(state => state.addFiles);
  const removeSlide = useComposerStore(state => state.removeSlide);
  const setStoreAspectRatio = useComposerStore(state => state.setAspectRatio);
  const resetStore = useComposerStore(state => state.reset);
  const publishPost = useComposerStore(state => state.publishPost);

  const activeSlide = slides[activeSlideIndex] || slides[0] || null;
  const currentAspect = lockedAspectRatio || activeSlide?.crop?.aspect || '1:1';
  const isVideo = activeSlide?.mimeType?.startsWith('video/');
  const isPdf = activeSlide?.mimeType === 'application/pdf';

  // Inline event creation form
  const [eventMode, setEventMode] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evDesc, setEvDesc] = useState('');

  const fileInputRef = useRef(null);

  /**
   * Etkinlik Yayınla (İyimser Akış ve RUpload Entegrasyonlu)
   */
  const publishEvent = async () => {
    const title = DOMPurify.sanitize(evTitle.trim());
    if (!title) { 
      if (window.toast?.info) window.toast.info('Etkinlik başlığı gerekli'); 
      return; 
    }

    setIsSubmitting(true);
    useComposerStore.getState().setContent(content.trim() || `📅 ${title}`);
    useComposerStore.getState().setEventData({
      title,
      date: evDate.trim(),
      location: evLocation.trim(),
      description: evDesc.trim()
    });

    try {
      await publishPost({
        currentUser,
        asClub,
        onOptimisticCreated: (optimisticPost) => {
          if (typeof setPosts === 'function') {
            setPosts(prev => [optimisticPost, ...(prev || [])]);
          }
        },
        onFinalPublished: (finalPost, tempId) => {
          if (typeof setPosts === 'function') {
            setPosts(prev => (prev || []).map(p => p.id === tempId ? finalPost : p));
          }
        }
      });
    } catch (_) {}

    setEventMode(false);
    setEvTitle('');
    setEvDate('');
    setEvLocation('');
    setEvDesc('');
    setContent('');
    setIsFocused(false);
    setActiveSubModal(null);
    setIsSubmitting(false);

    if (logAction) {
      logAction(currentUser?.name || 'Kullanıcı', `Yeni etkinlik paylaşıldı: ${title}`, 'Etkinlik', 'info');
    }
  };

  /**
   * Çoklu ve Yüksek Boyutlu Medya Yükleme (50MB'a kadar desteklenir, tek seferlik Web Worker ön işleme)
   */
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 50 * 1024 * 1024) {
        if (window.toast && typeof window.toast.error === 'function') {
          window.toast.error("Dosya boyutu en fazla 50 MB olabilir.");
        }
        return;
      }
    }

    setIsFocused(true);
    await addFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Gönderi Paylaş (İyimser Akış & RUpload Parçalı Yükleme Hattı)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanContent = DOMPurify.sanitize(content.trim()).slice(0, 3000);
    if (!cleanContent && slides.length === 0) return;
    setIsSubmitting(true);

    useComposerStore.getState().setContent(cleanContent);

    try {
      await publishPost({
        currentUser,
        asClub,
        onOptimisticCreated: (optimisticPost) => {
          if (typeof setPosts === 'function') {
            setPosts(prev => [optimisticPost, ...(prev || [])]);
          }
        },
        onFinalPublished: (finalPost, tempId) => {
          if (typeof setPosts === 'function') {
            setPosts(prev => (prev || []).map(p => p.id === tempId ? finalPost : p));
          }
        }
      });
    } catch (_) {}

    setContent('');
    setIsFocused(false);
    setActiveSubModal(null);
    setIsSubmitting(false);

    if (logAction) {
      logAction(currentUser?.name || 'Kullanıcı', 'Yeni gönderi paylaşıldı', 'Akış', 'info');
    }
  };

  const authorAvatar = asClub ? (asClub.logo || '/iesu-logo.svg') : (userRole === 'admin' || currentUser?.role === 'admin') ? "/iesu-logo.svg" : (currentUser?.avatar || '/iesu-logo.svg');

  // En-boy oranı kapsayıcısı (Besteci ve PostCard birebir uyumlu object-cover)
  const getAspectContainerClass = () => {
    switch (currentAspect) {
      case '4:5': return 'aspect-[4/5] max-h-[460px]';
      case '1.91:1': return 'aspect-[1.91/1] max-h-[300px]';
      case '1:1':
      default: return 'aspect-square max-h-[380px]';
    }
  };

  return (
    <div className="mb-4">
      {/* İyimser Yükleme Hücresi (Feed En Tepesi & SVG İlerleme Halkası) */}
      <OptimisticPublishCell />

      <div className={`transition-all duration-300 bg-white sm:rounded-[12px] ${isFocused ? 'shadow-md border border-gray-300 scale-[1.01]' : 'shadow-sm border border-gray-200'} overflow-hidden`}>
        <form onSubmit={handleSubmit} className="w-full flex flex-col pt-3 pb-2 px-4 bg-white">
          
          {/* TOP AREA: AVATAR & INPUT */}
          <div className="flex gap-3 items-start">
            <SafeAvatar 
              src={authorAvatar} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200" 
            />
            <div className="flex-1 min-w-0">
              {/* LINKEDIN STYLE INPUT */}
              <div className={`transition-all duration-200 ${isFocused ? 'bg-transparent' : 'bg-white rounded-full border border-gray-300 hover:bg-gray-50'}`}>
                <textarea 
                  value={content}
                  maxLength={2000}
                  onChange={(e) => {
                    setContent(e.target.value);
                    useComposerStore.getState().setContent(e.target.value);
                  }}
                  onFocus={() => setIsFocused(true)}
                  disabled={isSubmitting || isPublishing}
                  aria-label="Gönderi içeriği"
                  placeholder={isFocused ? "Ne hakkında konuşmak istiyorsunuz?" : "Gönderi başlat..."}
                  className={`w-full bg-transparent border-none outline-none text-[15px] sm:text-[16px] text-gray-800 placeholder-gray-500 font-medium resize-none transition-all disabled:opacity-50
                    ${isFocused ? 'min-h-[90px] pt-2 px-1 focus:ring-0' : 'min-h-[48px] pt-3 px-4 cursor-text'}`}
                />
              </div>

              {/* Ortak Yazar Rozetleri (Seçilmişse Görüntüle) */}
              {coAuthors && coAuthors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-gray-500">Ortak Yazarlar:</span>
                  {coAuthors.map(author => (
                    <span 
                      key={author.id} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200"
                    >
                      <SafeAvatar src={author.avatar} alt={author.name} className="w-3.5 h-3.5 rounded-full" />
                      <span>{author.name}</span>
                    </span>
                  ))}
                </div>
              )}
              
              {/* MEDYA ÖNİZLEME ALANI (Görsel Kırpma Uyuşmazlığı Giderildi) */}
              {activeSlide && (
                <div className="relative mt-3 rounded-2xl overflow-hidden bg-black border border-gray-200 group shadow-md flex items-center justify-center">
                  <button 
                    type="button"
                    aria-label="Medyayı Kaldır"
                    onClick={() => {
                      resetStore();
                      setActiveSubModal(null);
                    }}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black transition-all z-20 shadow cursor-pointer"
                  >
                    <X size={16} strokeWidth={2.5} />
                  </button>
                  
                  {!isVideo && !isPdf && (
                    <div className={`w-full ${getAspectContainerClass()} flex items-center justify-center overflow-hidden relative`}>
                      <img 
                        src={activeSlide.previewUrl} 
                        alt="Upload Preview" 
                        style={{
                          transform: `scale(${activeSlide.crop?.zoom || 1.0})`,
                          transition: 'transform 0.1s ease-out'
                        }}
                        className="w-full h-full object-cover" 
                      />

                      {/* Aktif Slayt Üzerindeki Etiket Rozetleri */}
                      {Array.isArray(activeSlide.tags) && activeSlide.tags.map(t => (
                        <div
                          key={t.id}
                          style={{
                            left: `${(t.x * 100).toFixed(2)}%`,
                            top: `${(t.y * 100).toFixed(2)}%`,
                            transform: 'translate(-50%, -100%)'
                          }}
                          className="absolute z-10 px-2 py-0.5 rounded-full bg-black/85 text-white text-[10px] font-bold border border-white/20 shadow-md backdrop-blur-xs pointer-events-none"
                        >
                          @{t.username}
                        </div>
                      ))}
                    </div>
                  )}

                  {isVideo && <video src={activeSlide.previewUrl} controls className="w-full max-h-[300px] bg-black" />}

                  {isPdf && (
                    <div className="flex flex-col items-center justify-center p-8 text-gray-500 bg-gray-50 w-full">
                      <FileText size={32} className="text-gray-400 mb-2" />
                      <p className="font-bold text-gray-800">PDF Eklendi</p>
                    </div>
                  )}
                </div>
              )}

              {/* ÇOKLU MEDYA FİLM ŞERİDİ (Carousel Filmstrip 1-10) */}
              {slides.length > 1 && (
                <div className="mt-3">
                  <CarouselFilmstrip onAddFiles={(files) => addFiles(files)} />
                </div>
              )}

              {/* EN-BOY ORANI, KIRPMA, ETİKET VE ORTAK YAZAR ALANLARI */}
              {!isVideo && !isPdf && slides.length > 0 && isFocused && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                    <Crop size={12} className="text-red-600" /> En-Boy:
                  </span>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-bold text-gray-700">
                    <button
                      type="button"
                      onClick={() => setStoreAspectRatio('1:1')}
                      className={`px-2 py-0.5 rounded-md transition ${currentAspect === '1:1' ? 'bg-white text-red-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      1:1 Kare
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreAspectRatio('4:5')}
                      className={`px-2 py-0.5 rounded-md transition ${currentAspect === '4:5' ? 'bg-white text-red-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      4:5 Dikey
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreAspectRatio('1.91:1')}
                      className={`px-2 py-0.5 rounded-md transition ${currentAspect === '1.91:1' ? 'bg-white text-red-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      1.91:1 Yatay
                    </button>
                  </div>

                  {/* Kırp & Yakınlaştır Modalı Butonu */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(activeSubModal === 'crop' ? null : 'crop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      activeSubModal === 'crop' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Maximize2 size={12} />
                    <span>Kırp & Yakınlaştır</span>
                  </button>

                  {/* Kişi Etiketle Butonu */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(activeSubModal === 'tag' ? null : 'tag')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      activeSubModal === 'tag' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Tag size={12} />
                    <span>Kişi Etiketle</span>
                  </button>

                  {/* Ortak Yazar Butonu */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(activeSubModal === 'coauthor' ? null : 'coauthor')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                      activeSubModal === 'coauthor' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Users size={12} />
                    <span>Ortak Yazar</span>
                  </button>
                </div>
              )}

              {/* Alt Modüller (Kırpma / Etiketleme / Ortak Yazarlık) */}
              {activeSubModal === 'crop' && (
                <div className="mt-3">
                  <AspectRatioCropModal 
                    onClose={() => setActiveSubModal(null)} 
                    onNext={() => setActiveSubModal(null)} 
                  />
                </div>
              )}

              {activeSubModal === 'tag' && (
                <div className="mt-3">
                  <CoordinateTagPicker />
                </div>
              )}

              {activeSubModal === 'coauthor' && (
                <div className="mt-3">
                  <CoAuthorSelector />
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM TOOLBAR (LINKEDIN STYLE) */}
          {eventMode && (
            <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50/60 p-3 space-y-2">
              <p className="text-[12px] font-extrabold text-orange-700 tracking-wide">📅 Etkinlik Oluştur</p>
              <input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder="Etkinlik başlığı *" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400" />
              <div className="flex flex-col sm:flex-row gap-2">
                <input value={evDate} onChange={(e) => setEvDate(e.target.value)} placeholder="Tarih (örn. 15 Mayıs 2026)" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400" />
                <input value={evLocation} onChange={(e) => setEvLocation(e.target.value)} placeholder="Yer" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400" />
              </div>
              <textarea value={evDesc} onChange={(e) => setEvDesc(e.target.value)} placeholder="Açıklama (opsiyonel)" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-[14px] outline-none focus:border-orange-400 resize-none" />
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setEventMode(false)} className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-gray-500 hover:bg-gray-100 transition">İptal</button>
                <button type="button" onClick={publishEvent} disabled={isSubmitting || isPublishing} className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition disabled:opacity-50">Yayınla</button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 transition-all duration-300">
            <div className="flex items-center justify-between w-full sm:w-auto px-1">
              <label className="flex items-center gap-2 px-3 py-2.5 text-gray-500 hover:bg-gray-100 rounded-md cursor-pointer transition-colors font-semibold text-[14px]">
                <ImageIcon size={20} className="text-red-500" /> 
                <span className="hidden sm:inline">Medya / Karusel</span>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple
                  accept="image/*,video/*,application/pdf" 
                  className="sr-only" 
                  onChange={handleFileUpload} 
                  disabled={isSubmitting || isPublishing} 
                />
              </label>
              <button 
                type="button" 
                onClick={() => setEventMode((v) => !v)} 
                className="flex items-center gap-2 px-3 py-2.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors font-semibold text-[14px]"
              >
                <Calendar size={20} className={eventMode ? 'text-red-600' : 'text-orange-500'} /> 
                <span className="hidden sm:inline">Etkinlik</span>
              </button>
            </div>
            
            <div className={`flex gap-2 shrink-0 transition-opacity duration-200 ${isFocused ? 'opacity-100 mt-3 sm:mt-0 w-full sm:w-auto justify-end' : 'opacity-0 hidden'}`}>
              <button 
                type="button" 
                onClick={() => {
                  setIsFocused(false);
                  setActiveSubModal(null);
                }} 
                className="px-4 py-1.5 rounded-full font-semibold text-[14px] text-gray-500 hover:bg-gray-100 transition"
              >
                İptal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || isPublishing || (!content.trim() && slides.length === 0)} 
                className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full font-semibold text-[14px] transition-all
                  ${(content.trim() || slides.length > 0) && !isSubmitting && !isPublishing ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
              >
                {isSubmitting || isPublishing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Gönder'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
