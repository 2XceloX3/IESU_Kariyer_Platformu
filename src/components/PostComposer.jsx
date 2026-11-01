import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  FileText, 
  Send, 
  X, 
  Calendar, 
  Crop, 
  Tag, 
  Users, 
  Sparkles,
  Maximize2,
  Hash
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import DOMPurify from 'dompurify';
import SafeAvatar from './shared/SafeAvatar';
import { useComposerStore } from '../store/useComposerStore';
import { useTranslation } from '../i18n';
import AspectRatioCropModal from './composer/AspectRatioCropModal';
import CarouselFilmstrip from './composer/CarouselFilmstrip';
import CoordinateTagPicker from './composer/CoordinateTagPicker';
import CoAuthorSelector from './composer/CoAuthorSelector';
import OptimisticPublishCell from './composer/OptimisticPublishCell';

const POST_CATEGORIES = [
  { id: 'duyuru', label: '📢 Duyuru & Gündem' },
  { id: 'kariyer', label: '🚀 Kariyer & Başarı' },
  { id: 'arge', label: '💡 Proje & Ar-Ge' },
  { id: 'staj', label: '💼 Staj & Deneyim' }
];

const QUICK_TAGS = ['#İESÜKariyer', '#StajFırsatı', '#MezunAğı', '#ÜniversiteSanayi', '#ArGe'];

export default function PostComposer({
  currentUser,
  userRole,
  posts,
  setPosts,
  asClub,
  setActiveTab,
  defaultExpanded = false,
  embedded = false
}) {
  const { t } = useTranslation();
  const logAction = useAppStore(state => state.logAction);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(Boolean(defaultExpanded));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(userRole === 'admin' ? 'duyuru' : 'kariyer');

  // Sub-modals: 'crop' | 'tag' | 'coauthor' | null
  const [activeSubModal, setActiveSubModal] = useState(null);

  // Store bindings
  const slides = useComposerStore(state => state.slides);
  const activeSlideIndex = useComposerStore(state => state.activeSlideIndex);
  const lockedAspectRatio = useComposerStore(state => state.lockedAspectRatio);
  const coAuthors = useComposerStore(state => state.coAuthors);
  const isPublishing = useComposerStore(state => state.isPublishing);
  const addFiles = useComposerStore(state => state.addFiles);
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

  const isAdmin = userRole === 'admin' || currentUser?.role === 'admin';
  const isAlumni = userRole === 'alumni' || currentUser?.role === 'alumni';
  const isAcademic = userRole === 'academic' || currentUser?.role === 'academic';
  const isCompany = userRole === 'company' || userRole === 'employer' || currentUser?.role === 'company';

  const authorName = asClub
    ? asClub.name
    : isAdmin
      ? 'Kariyer Geliştirme Koordinatörlüğü'
      : (currentUser?.name || 'İESÜ Kullanıcısı');

  const authorRoleLabel = asClub
    ? 'Öğrenci Kulübü'
    : isAdmin
      ? 'Süper Yönetici & Resmi Birim'
      : isAlumni
        ? 'İESÜ Mezunlar Portalı'
        : isAcademic
          ? 'Akademik Kadro'
          : isCompany
            ? 'Kurumsal İşveren Partner'
            : (currentUser?.department || 'İESÜ Öğrencisi');

  const authorAvatar = asClub
    ? (asClub.logo || '/iesu-logo.svg')
    : isAdmin
      ? '/iesu-logo.svg'
      : (currentUser?.avatar || '/iesu-logo.svg');

  /**
   * Etkinlik Yayınla (İyimser Akış ve RUpload Entegrasyonlu)
   */
  const publishEvent = async () => {
    const title = DOMPurify.sanitize(evTitle.trim());
    if (!title) { 
      if (window.toast?.info) window.toast.info(t('composer.eventTitle') || 'Etkinlik başlığı gerekli'); 
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
    if (!defaultExpanded) setIsFocused(false);
    setActiveSubModal(null);
    setIsSubmitting(false);

    if (logAction) {
      logAction(currentUser?.name || 'Kullanıcı', `Yeni etkinlik paylaşıldı: ${title}`, 'Etkinlik', 'info');
    }
    if (window.toast?.success) {
      window.toast.success('Etkinlik akışta yayınlandı!');
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
          window.toast.error(t('composer.maxFileSizeError') || "Dosya boyutu en fazla 50 MB olabilir.");
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
    if (!defaultExpanded) setIsFocused(false);
    setActiveSubModal(null);
    setIsSubmitting(false);

    if (logAction) {
      logAction(currentUser?.name || 'Kullanıcı', 'Yeni gönderi paylaşıldı', 'Akış', 'info');
    }
    if (window.toast?.success) {
      window.toast.success('Gönderiniz başarıyla yayınlandı!');
    }
  };

  const handleInsertTag = (tagText) => {
    const nextVal = content ? `${content.trimEnd()} ${tagText} ` : `${tagText} `;
    setContent(nextVal);
    useComposerStore.getState().setContent(nextVal);
    setIsFocused(true);
  };

  // En-boy oranı kapsayıcısı (Besteci ve PostCard birebir uyumlu object-cover)
  const getAspectContainerClass = () => {
    switch (currentAspect) {
      case '4:5': return 'aspect-[4/5] max-h-[460px]';
      case '1.91:1': return 'aspect-[1.91/1] max-h-[300px]';
      case '1:1':
      default: return 'aspect-square max-h-[380px]';
    }
  };

  const canSubmit = (content.trim().length > 0 || slides.length > 0) && !isSubmitting && !isPublishing;

  return (
    <div className={embedded ? 'w-full' : 'mb-4'}>
      {/* İyimser Yükleme Hücresi (Feed En Tepesi & SVG İlerleme Halkası) */}
      <OptimisticPublishCell />

      <div
        className={`transition-all duration-300 overflow-hidden ${
          embedded
            ? 'bg-transparent'
            : `bg-white dark:bg-[#131c31] rounded-2xl ${
                isFocused
                  ? 'shadow-lg border border-slate-300 dark:border-slate-700'
                  : 'shadow-xs border border-slate-200/90 dark:border-slate-800'
              }`
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className={`w-full flex flex-col ${
            embedded ? 'p-0 bg-transparent' : 'pt-4 pb-3 px-4 sm:px-5 bg-white dark:bg-[#131c31]'
          }`}
        >
          {/* AUTHOR & CATEGORY BAR (Visible when expanded or in full-page composer) */}
          {(isFocused || defaultExpanded) && (
            <div className="flex flex-col gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3 min-w-0">
                <SafeAvatar
                  src={authorAvatar}
                  name={authorName}
                  alt="Profile"
                  className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                      {authorName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                      {authorRoleLabel}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {isAdmin
                      ? 'Resmî KGM yayını olarak tüm üniversite akışında paylaşılır'
                      : 'Kampüs ve kariyer ağındaki bağlantılarınızla paylaşılır'}
                  </p>
                </div>
              </div>

              {/* Category Selector Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {POST_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer border ${
                      selectedCategory === cat.id
                        ? isAdmin
                          ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/50'
                          : isAlumni
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/50'
                            : 'bg-red-50 dark:bg-rose-950/50 text-[#990000] dark:text-rose-300 border-red-200 dark:border-rose-800/70'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-slate-200/70 dark:border-slate-700/70 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TOP AREA: AVATAR (when collapsed) & INPUT */}
          <div className="flex gap-3 items-start">
            {!isFocused && !defaultExpanded && (
              <SafeAvatar 
                src={authorAvatar} 
                name={authorName}
                alt="Profile" 
                className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
              />
            )}
            <div className="flex-1 min-w-0">
              {/* CLEAN DARK-AWARE COMPOSER INPUT BOX */}
              <div
                className={`transition-all duration-200 rounded-2xl border ${
                  isFocused
                    ? 'bg-slate-50/70 dark:bg-slate-900/70 border-slate-300 dark:border-slate-700 p-3'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 px-4 py-2.5'
                }`}
              >
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
                  placeholder={
                    isFocused && !defaultExpanded
                      ? (t('composer.placeholderFocused') || "Ne hakkında konuşmak istiyorsunuz?")
                      : (t('composer.placeholderStart') || "Gönderi başlat...")
                  }
                  className={`w-full bg-transparent border-none outline-none text-[14px] sm:text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium resize-none transition-all disabled:opacity-50 leading-relaxed ${
                    isFocused ? 'min-h-[110px] focus:ring-0' : 'min-h-[32px] h-8 cursor-text'
                  }`}
                />

                {/* Quick Hashtag Bar & Character Counter when focused */}
                {isFocused && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-slate-200/70 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-0.5 mr-1">
                        <Hash size={12} /> Etiket Ekle:
                      </span>
                      {QUICK_TAGS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleInsertTag(tag)}
                          className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                      {content.length} / 2000
                    </span>
                  </div>
                )}
              </div>

              {/* Ortak Yazar Rozetleri (Seçilmişse Görüntüle) */}
              {coAuthors && coAuthors.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{t('composer.coAuthors') || 'Ortak Yazarlar'}:</span>
                  {coAuthors.map(author => (
                    <span 
                      key={author.id} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-300 text-xs font-semibold border border-red-200 dark:border-rose-800/60"
                    >
                      <SafeAvatar src={author.avatar} alt={author.name} className="w-3.5 h-3.5 rounded-full" />
                      <span>{author.name}</span>
                    </span>
                  ))}
                </div>
              )}
              
              {/* MEDYA ÖNİZLEME ALANI */}
              {activeSlide && (
                <div className="relative mt-3 rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-700 group shadow-md flex items-center justify-center">
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
                    <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 w-full">
                      <FileText size={32} className="text-slate-400 mb-2" />
                      <p className="font-bold text-slate-800 dark:text-slate-100">PDF Eklendi</p>
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
                <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Crop size={12} className="text-red-600 dark:text-rose-400" /> {t('composer.aspectRatio') || 'En-Boy'}:
                  </span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200">
                    <button
                      type="button"
                      onClick={() => setStoreAspectRatio('1:1')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${currentAspect === '1:1' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-rose-300 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {t('composer.square') || '1:1 Kare'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreAspectRatio('4:5')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${currentAspect === '4:5' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-rose-300 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {t('composer.portrait') || '4:5 Dikey'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoreAspectRatio('1.91:1')}
                      className={`px-2 py-0.5 rounded-md transition cursor-pointer ${currentAspect === '1.91:1' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-rose-300 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {t('composer.landscape') || '1.91:1 Yatay'}
                    </button>
                  </div>

                  {/* Kırp & Yakınlaştır Modalı Butonu */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(activeSubModal === 'crop' ? null : 'crop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      activeSubModal === 'crop'
                        ? 'bg-red-50 dark:bg-rose-950/50 border-red-300 dark:border-rose-700 text-red-600 dark:text-rose-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Maximize2 size={12} />
                    <span>{t('composer.cropAndZoom') || 'Kırp & Yakınlaştır'}</span>
                  </button>

                  {/* Kişi Etiketle Butonu */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(activeSubModal === 'tag' ? null : 'tag')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      activeSubModal === 'tag'
                        ? 'bg-red-50 dark:bg-rose-950/50 border-red-300 dark:border-rose-700 text-red-600 dark:text-rose-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Tag size={12} />
                    <span>{t('composer.tagPeople') || 'Kişi Etiketle'}</span>
                  </button>

                  {/* Ortak Yazar Butonu */}
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(activeSubModal === 'coauthor' ? null : 'coauthor')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      activeSubModal === 'coauthor'
                        ? 'bg-red-50 dark:bg-rose-950/50 border-red-300 dark:border-rose-700 text-red-600 dark:text-rose-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Users size={12} />
                    <span>{t('composer.coAuthor') || 'Ortak Yazar'}</span>
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

          {/* INLINE EVENT CREATION FORM */}
          {eventMode && (
            <div className="mt-3 rounded-2xl border border-orange-200 dark:border-amber-700/60 bg-orange-50/60 dark:bg-amber-950/25 p-3.5 space-y-2.5">
              <p className="text-[12px] font-extrabold text-orange-700 dark:text-amber-300 tracking-wide">
                {t('composer.createEvent') || '📅 Etkinlik Oluştur'}
              </p>
              <input
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                placeholder={t('composer.eventTitle') || 'Etkinlik başlığı *'}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[13px] outline-none focus:border-orange-400"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={evDate}
                  onChange={(e) => setEvDate(e.target.value)}
                  placeholder={t('composer.eventDate') || 'Tarih (örn. 15 Mayıs 2026)'}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[13px] outline-none focus:border-orange-400"
                />
                <input
                  value={evLocation}
                  onChange={(e) => setEvLocation(e.target.value)}
                  placeholder={t('composer.eventLocation') || 'Yer (örn. İESÜ Konferans Salonu)'}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[13px] outline-none focus:border-orange-400"
                />
              </div>
              <textarea
                value={evDesc}
                onChange={(e) => setEvDesc(e.target.value)}
                placeholder={t('composer.eventDescription') || 'Açıklama (opsiyonel)'}
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[13px] outline-none focus:border-orange-400 resize-none"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEventMode(false)}
                  className="px-4 py-1.5 rounded-xl text-[12px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('composer.cancel') || 'İptal'}
                </button>
                <button
                  type="button"
                  onClick={publishEvent}
                  disabled={isSubmitting || isPublishing}
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {t('composer.publish') || 'Yayınla'}
                </button>
              </div>
            </div>
          )}

          {/* BOTTOM ACTION TOOLBAR (ALWAYS VISIBLE & DARK-MODE READY) */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-1 sm:gap-2">
              <label className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors font-bold text-xs sm:text-[13px]">
                <ImageIcon size={18} className="text-red-500 dark:text-rose-400 shrink-0" /> 
                <span>{t('composer.addMedia') || 'Medya / Karusel'}</span>
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
                onClick={() => {
                  setIsFocused(true);
                  setEventMode((v) => !v);
                }} 
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-bold text-xs sm:text-[13px] cursor-pointer ${
                  eventMode
                    ? 'bg-orange-50 dark:bg-amber-950/40 text-orange-700 dark:text-amber-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar size={18} className={eventMode ? 'text-red-600 dark:text-amber-400' : 'text-orange-500 dark:text-amber-400'} /> 
                <span>{t('composer.addEvent') || 'Etkinlik'}</span>
              </button>

              {slides.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(true);
                    setActiveSubModal(activeSubModal === 'coauthor' ? null : 'coauthor');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors font-bold text-xs sm:text-[13px] cursor-pointer ${
                    activeSubModal === 'coauthor'
                      ? 'bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-300'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users size={17} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Ortak Yazar</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {isFocused && !defaultExpanded && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsFocused(false);
                    setActiveSubModal(null);
                  }} 
                  className="px-3.5 py-2 rounded-xl font-bold text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {t('composer.cancel') || 'İptal'}
                </button>
              )}
              <button 
                type="submit" 
                disabled={!canSubmit} 
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                  canSubmit
                    ? isAdmin
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 shadow-md shadow-amber-500/20'
                      : isAlumni
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-[#990000] hover:bg-red-800 text-white shadow-md shadow-red-900/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/80 cursor-not-allowed'
                }`}
              >
                {isSubmitting || isPublishing ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>{t('composer.send') || 'Gönder'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
