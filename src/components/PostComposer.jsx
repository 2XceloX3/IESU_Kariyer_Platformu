import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon, FileText, Video, Send, X, Plus, Calendar, Smile,
  BarChart2, Crop, Tag, Users, Layers, Sparkles, MapPin, Award, Flame, CheckCircle2
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useComposerStore from '../store/useComposerStore';
import DOMPurify from 'dompurify';
import eventBus from '../brain/eventBus';
import { useTranslation } from '../i18n';
import SafeAvatar from './shared/SafeAvatar';
import AspectRatioCropModal from './composer/AspectRatioCropModal';
import CarouselFilmstrip from './composer/CarouselFilmstrip';
import CoordinateTagPicker from './composer/CoordinateTagPicker';
import CoAuthorSelector from './composer/CoAuthorSelector';
import OptimisticPublishCell from './composer/OptimisticPublishCell';

export const INSTAGRAM_FILTERS = [
  { id: 'none', name: 'Normal', css: 'none' },
  { id: 'clarendon', name: 'Clarendon', css: 'contrast(1.2) saturate(1.35)' },
  { id: 'juno', name: 'Juno', css: 'contrast(1.15) brightness(1.05) saturate(1.4) sepia(0.08)' },
  { id: 'lark', name: 'Lark', css: 'contrast(0.95) brightness(1.12) saturate(1.15)' },
  { id: 'valencia', name: 'Valencia', css: 'contrast(1.08) brightness(1.08) sepia(0.18)' },
  { id: 'gingham', name: 'Gingham', css: 'brightness(1.05) hue-rotate(-10deg) contrast(0.95)' },
  { id: 'iesu_warm', name: 'İESÜ Warm', css: 'contrast(1.1) saturate(1.25) sepia(0.12)' },
  { id: 'noir', name: 'Noir B&W', css: 'grayscale(1) contrast(1.2)' }
];

export const CAREER_MILESTONES = [
  { id: 'internship_accepted', label: '🎉 Staja Kabul Edildim!', color: 'from-[#990000] to-amber-600' },
  { id: 'new_job', label: '🚀 Yeni İşe Başladım!', color: 'from-[#1e3a5f] to-indigo-700' },
  { id: 'award_won', label: '🏆 Hackathon / Proje Ödülü!', color: 'from-amber-500 to-orange-600' },
  { id: 'certified', label: '📜 Yeni Sertifika & Yetkinlik', color: 'from-emerald-600 to-teal-700' },
  { id: 'graduation_project', label: '🎓 Bitirme / Araştırma Projesi', color: 'from-purple-700 to-[#1e3a5f]' }
];

export const CAMPUS_LOCATIONS = [
  'İESÜ Merkez Kampüs',
  'İESÜ Mühendislik Fakültesi',
  'Rektörlük Konferans Salonu',
  'TTO Kuluçka Merkezi',
  'Kampüs Teras Kafe',
  'Teknopark İstanbul',
  'Hibrit / Uzaktan Çalışma'
];

export const QUICK_HASHTAGS = [
  '#İESÜKariyer', '#Staj2026', '#KampüsNabzı', '#MezunAğı', '#ArGe', '#Teknoloji', '#Girişimcilik'
];

async function compressImageFile(file) {
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/gif') return file;
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1280;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressed);
            },
            'image/jpeg',
            0.78
          );
        };
        img.onerror = () => resolve(file);
        img.src = ev.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    } catch (_) {
      resolve(file);
    }
  });
}

export default function PostComposer({ currentUser, userRole, posts, setPosts, asClub, setActiveTab }) {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubModal, setActiveSubModal] = useState(null); // 'crop' | 'tag' | 'coauthor' | 'filter' | 'poll' | 'location' | 'milestone' | null

  // Instagram & LinkedIn Studio States
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [shareAsStory, setShareAsStory] = useState(false);

  // Interactive Poll States
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Evet, kesinlikle', 'Kararsızım / Geliştirilmeli']);

  // Event Post States
  const [eventMode, setEventMode] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evDesc, setEvDesc] = useState('');

  const fileInputRef = useRef(null);

  const slides = useComposerStore((s) => s.slides) || [];
  const activeSlideIndex = useComposerStore((s) => s.activeSlideIndex) || 0;
  const lockedAspectRatio = useComposerStore((s) => s.lockedAspectRatio) || '1:1';
  const coAuthors = useComposerStore((s) => s.coAuthors) || [];
  const isPublishing = useComposerStore((s) => s.isPublishing);
  const addFiles = useComposerStore((s) => s.addFiles);
  const removeSlide = useComposerStore((s) => s.removeSlide);
  const setActiveSlide = useComposerStore((s) => s.setActiveSlide || s.setActiveSlideIndex);
  const setStoreAspectRatio = useComposerStore((s) => s.setAspectRatio || s.setLockedAspectRatio);
  const updateSlide = useComposerStore((s) => s.updateSlide);
  const resetStore = useComposerStore((s) => s.reset || s.resetComposer);
  const publishPost = useComposerStore((s) => s.publishPost);

  const activeSlide = slides[activeSlideIndex] || slides[0] || null;
  const activeFilterCss = activeSlide?.filter || selectedFilter || 'none';

  const safeUpdatePosts = (updater) => {
    const storeState = useAppStore.getState();
    const currentList = Array.isArray(posts) ? posts : (storeState.posts || []);
    const nextList = typeof updater === 'function' ? updater(currentList) : updater;
    if (typeof setPosts === 'function') {
      try {
        setPosts(nextList);
      } catch (_) {}
    }
    if (typeof storeState.setPosts === 'function') {
      try {
        storeState.setPosts(nextList);
      } catch (_) {}
    }
  };

  const handleFileSelect = async (e) => {
    const rawFiles = Array.from(e.target.files || []);
    if (!rawFiles.length) return;
    const processed = await Promise.all(rawFiles.map((f) => compressImageFile(f)));
    if (typeof addFiles === 'function') {
      await addFiles(processed);
    }
    setIsFocused(true);
    e.target.value = '';
  };

  const applyFilterToSlide = (filterCss) => {
    setSelectedFilter(filterCss);
    if (typeof updateSlide === 'function' && slides.length > 0) {
      updateSlide(activeSlideIndex, { filter: filterCss });
    }
  };

  const handleAddHashtag = (tag) => {
    setContent((prev) => (prev.includes(tag) ? prev : `${prev.trim()} ${tag} `.trimStart()));
    setIsFocused(true);
  };

  const handlePublish = async (e) => {
    if (e) e.preventDefault();
    const cleanContent = DOMPurify.sanitize(content.trim()).slice(0, 3000);
    if (!cleanContent && slides.length === 0 && !selectedMilestone && !pollEnabled) return;

    setIsSubmitting(true);
    const finalLocation = customLocation.trim() || selectedLocation || '';
    const pollObject = pollEnabled && pollQuestion.trim()
      ? {
          question: pollQuestion.trim(),
          options: pollOptions
            .map((o) => o.trim())
            .filter(Boolean)
            .map((text, idx) => ({ id: `opt_${idx}`, text, votes: idx === 0 ? 1 : 0 })),
          totalVotes: 1,
          votedBy: {}
        }
      : null;

    const enrichPost = (basePost) => ({
      ...basePost,
      filter: activeFilterCss,
      location: finalLocation || basePost.eventLocation || '',
      milestone: selectedMilestone ? selectedMilestone.label : null,
      milestoneColor: selectedMilestone ? selectedMilestone.color : null,
      poll: pollObject,
      sharedAsStory: shareAsStory,
      slides: Array.isArray(basePost.slides)
        ? basePost.slides.map((s, idx) => ({
            ...s,
            filter: slides[idx]?.filter || activeFilterCss
          }))
        : basePost.slides,
      ...(eventMode && evTitle.trim()
        ? {
            eventPost: true,
            eventTitle: evTitle.trim(),
            eventDate: evDate || 'Yakında',
            eventLocation: evLocation || finalLocation || 'İESÜ Kampüs',
            eventDesc: evDesc.trim()
          }
        : {})
    });

    try {
      const store = useComposerStore.getState();
      if (typeof store.setContent === 'function') store.setContent(cleanContent);
      if (eventMode && typeof store.setEventData === 'function') {
        store.setEventData({ title: evTitle, date: evDate, location: evLocation, description: evDesc });
      }

      if (typeof publishPost === 'function') {
        await publishPost({
          currentUser,
          asClub,
          onOptimisticCreated: (optPost) => {
            const enriched = enrichPost(optPost);
            safeUpdatePosts((prev) => [enriched, ...(prev || [])]);
          },
          onFinalPublished: (finPost, tempId) => {
            const enriched = enrichPost(finPost);
            safeUpdatePosts((prev) =>
              (prev || []).map((p) => (p.id === tempId || p.tempId === tempId ? enriched : p))
            );
          }
        });
      } else {
        const fallbackPost = enrichPost({
          id: 'post_' + Date.now(),
          time: 'Az önce',
          createdAt: new Date().toISOString(),
          author: asClub
            ? { id: asClub.id, name: asClub.name, avatar: asClub.avatar, role: 'club' }
            : {
                id: currentUser?.id || 'stu-1',
                name: currentUser?.name || 'İESÜ Üyesi',
                avatar: currentUser?.avatar,
                title: currentUser?.department || currentUser?.title || 'İESÜ Kampüs',
                role: userRole || currentUser?.role || 'student'
              },
          coAuthors,
          content: cleanContent,
          image: slides[0]?.previewUrl || slides[0]?.url || null,
          slides: slides.length > 0 ? slides : undefined,
          aspectRatio: lockedAspectRatio || '1:1',
          likes: 0,
          likedBy: [],
          comments: 0,
          commentsList: []
        });
        safeUpdatePosts((prev) => [fallbackPost, ...(prev || [])]);
      }

      if (shareAsStory) {
        try {
          const existingStories = JSON.parse(localStorage.getItem('iesu_campus_stories_v1') || '[]');
          const newStory = {
            id: 'story_' + Date.now(),
            authorName: asClub ? asClub.name : (currentUser?.name || 'İESÜ Üyesi'),
            authorAvatar: asClub ? asClub.avatar : currentUser?.avatar,
            mediaUrl: slides[0]?.previewUrl || slides[0]?.url || '/official_pdf_logo.png',
            caption: cleanContent.slice(0, 120),
            filter: activeFilterCss,
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('iesu_campus_stories_v1', JSON.stringify([newStory, ...existingStories].slice(0, 30)));
          if (eventBus && typeof eventBus.emit === 'function') {
            eventBus.emit('story:created', newStory);
          }
        } catch (_) {}
      }

      setContent('');
      setSelectedFilter('none');
      setSelectedLocation('');
      setCustomLocation('');
      setSelectedMilestone(null);
      setPollEnabled(false);
      setPollQuestion('');
      setShareAsStory(false);
      setEventMode(false);
      setActiveSubModal(null);
      if (typeof resetStore === 'function') resetStore();
    } catch (_) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/90 shadow-[0_12px_36px_-12px_rgba(30,58,95,0.10)] p-4 sm:p-5 mb-6 transition-all">
      {/* Üst Başlık: Instagram & LinkedIn Hibrit Yaratıcı Stüdyosu */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#990000]/10 text-[#990000] text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Kampüs & Kariyer Stüdyosu
          </span>
          {selectedLocation && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
              <MapPin className="w-3 h-3 text-[#990000]" /> {selectedLocation}
              <button type="button" onClick={() => setSelectedLocation('')} className="ml-1 text-slate-400 hover:text-slate-700">×</button>
            </span>
          )}
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-semibold text-slate-600 hover:text-[#990000]">
          <input
            type="checkbox"
            checked={shareAsStory}
            onChange={(e) => setShareAsStory(e.target.checked)}
            className="rounded border-slate-300 text-[#990000] focus:ring-[#990000]"
          />
          <Flame className="w-3.5 h-3.5 text-amber-500" /> 24s Hikayeye (Story) Ekle
        </label>
      </div>

      {/* Seçili Kariyer Başarı Kartı (Milestone Banner) */}
      {selectedMilestone && (
        <div className={`mb-3 p-3.5 rounded-2xl bg-gradient-to-r ${selectedMilestone.color} text-white flex items-center justify-between shadow-md`}>
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-200 shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-white/80">Kariyer & Kampüs Kutlaması</div>
              <div className="text-sm font-extrabold">{selectedMilestone.label}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedMilestone(null)}
            className="p-1 rounded-lg bg-white/15 hover:bg-white/25 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ana Giriş Alanı */}
      <div className="flex items-start gap-3.5">
        <SafeAvatar
          src={asClub ? asClub.avatar : currentUser?.avatar}
          name={asClub ? asClub.name : (currentUser?.name || 'İESÜ')}
          className="w-11 h-11 rounded-2xl ring-2 ring-[#990000]/15 shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setContent(e.target.value)}
            rows={isFocused || content.length > 0 || slides.length > 0 ? 3 : 2}
            placeholder={
              asClub
                ? `${asClub.name} adına etkinlik, foto-galeri veya duyuru paylaş...`
                : 'Kampüsten bir kare, staj deneyimi, proje başarısı veya soru paylaş... (@kişi, #etiket)'
            }
            className="w-full rounded-2xl bg-slate-50/90 hover:bg-slate-50 focus:bg-white border border-slate-200/80 focus:border-[#990000] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all resize-none"
          />

          {/* Hızlı Hashtag Çubuğu */}
          {(isFocused || content.length > 0) && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2 pb-1">
              {QUICK_HASHTAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddHashtag(tag)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#990000]/10 text-slate-600 hover:text-[#990000] text-[11px] font-semibold whitespace-nowrap transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instagram Çoklu Medya Önizleme + Oran Kilidi + 8 Canlı Filtre Stüdyosu */}
      {slides.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-950/95 p-3 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> { activeSlideIndex + 1 } / { slides.length } Kare
              </span>
              {['1:1', '4:5', '16:9'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => typeof setStoreAspectRatio === 'function' && setStoreAspectRatio(ratio)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                    lockedAspectRatio === ratio
                      ? 'bg-[#990000] text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveSubModal(activeSubModal === 'crop' ? null : 'crop')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Crop className="w-3.5 h-3.5 text-amber-400" /> Kırp
              </button>
              <button
                type="button"
                onClick={() => setActiveSubModal(activeSubModal === 'tag' ? null : 'tag')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1"
              >
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Kişi Etiketle
              </button>
              <button
                type="button"
                onClick={() => typeof removeSlide === 'function' && removeSlide(activeSlideIndex)}
                className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300"
                title="Kareyi Kaldır"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Aktif Kare Önizlemesi */}
          {activeSlide && (
            <div className="relative mx-auto max-h-80 overflow-hidden rounded-xl bg-black flex items-center justify-center">
              <img
                src={activeSlide.previewUrl || activeSlide.url}
                alt="Önizleme"
                style={{ filter: activeFilterCss }}
                className="max-h-72 w-auto object-contain transition-all duration-200"
              />
            </div>
          )}

          {/* Instagram 8'li Filtre Şeridi */}
          <div className="mt-3 pt-2.5 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Instagram Görsel Filtreleri</div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {INSTAGRAM_FILTERS.map((f) => {
                const isSelected = activeFilterCss === f.css;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => applyFilterToSlide(f.css)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Çoklu Kare Film Şeridi (1-10 Fotoğraf Ekleme/Sıralama) */}
          <div className="mt-2.5">
            <CarouselFilmstrip onAddFiles={(files) => addFiles(files)} />
          </div>
        </div>
      )}

      {/* Alt Modallar: Kırpma, Pin Etiketleme, Ortak Yazar, Konum, Başarı Rozeti, Anket */}
      {activeSubModal === 'crop' && (
        <div className="mt-3">
          <AspectRatioCropModal onClose={() => setActiveSubModal(null)} onNext={() => setActiveSubModal(null)} />
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

      {activeSubModal === 'location' && (
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-[#1e3a5f] mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#990000]" /> Kampüs veya Şirket Konumu Ekle
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {CAMPUS_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setSelectedLocation(loc);
                  setCustomLocation('');
                  setActiveSubModal(null);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  selectedLocation === loc
                    ? 'bg-[#990000] text-white border-[#990000]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#990000]'
                }`}
              >
                📍 {loc}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Özel konum yazın (örn: B-Blok Lab 302)..."
              className="flex-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[#990000]"
            />
            <button
              type="button"
              onClick={() => {
                if (customLocation.trim()) setSelectedLocation(customLocation.trim());
                setActiveSubModal(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#1e3a5f] text-white text-xs font-bold"
            >
              Ekle
            </button>
          </div>
        </div>
      )}

      {activeSubModal === 'milestone' && (
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold text-[#1e3a5f] mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#990000]" /> Kariyer & Başarı Rozeti Seç
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CAREER_MILESTONES.map((ms) => (
              <button
                key={ms.id}
                type="button"
                onClick={() => {
                  setSelectedMilestone(ms);
                  setActiveSubModal(null);
                }}
                className="p-2.5 rounded-xl bg-white hover:bg-red-50/50 border border-slate-200 hover:border-[#990000] text-left text-xs font-bold text-slate-800 transition-all flex items-center justify-between"
              >
                <span>{ms.label}</span>
                <CheckCircle2 className="w-4 h-4 text-[#990000]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {pollEnabled && (
        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e3a5f] flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#990000]" /> Canlı Kampüs Anketi
            </span>
            <button type="button" onClick={() => setPollEnabled(false)} className="text-xs text-slate-400 hover:text-red-600">
              Kaldır
            </button>
          </div>
          <input
            type="text"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Anket sorunuzu yazın (örn: Hangi alanda staj yapmayı hedefliyorsunuz?)..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:border-[#990000]"
          />
          <div className="space-y-1.5">
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const copy = [...pollOptions];
                    copy[i] = e.target.value;
                    setPollOptions(copy);
                  }}
                  placeholder={`${i + 1}. Seçenek`}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:outline-none focus:border-[#990000]"
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-600 text-xs px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button
                type="button"
                onClick={() => setPollOptions([...pollOptions, ''])}
                className="text-xs font-semibold text-[#990000] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Seçenek Ekle
              </button>
            )}
          </div>
        </div>
      )}

      {isPublishing && (
        <div className="mt-3">
          <OptimisticPublishCell />
        </div>
      )}

      {/* Alt Araç Çubuğu & Paylaş Butonu */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-[#990000] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-4 h-4 text-[#990000]" />
            <span>Fotoğraf / Carousel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubModal(activeSubModal === 'milestone' ? null : 'milestone')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedMilestone ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>Başarı Kutla</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubModal(activeSubModal === 'location' ? null : 'location')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedLocation ? 'bg-red-100 text-[#990000]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#1e3a5f]" />
            <span>Konum</span>
          </button>

          <button
            type="button"
            onClick={() => setPollEnabled(!pollEnabled)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              pollEnabled ? 'bg-indigo-100 text-[#1e3a5f]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-[#1e3a5f]" />
            <span>Anket</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubModal(activeSubModal === 'coauthor' ? null : 'coauthor')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              coAuthors.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Ortak Etiketle {coAuthors.length > 0 ? `(${coAuthors.length})` : ''}</span>
          </button>
        </div>

        <button
          type="button"
          disabled={isSubmitting || (!content.trim() && slides.length === 0 && !selectedMilestone && !pollEnabled)}
          onClick={handlePublish}
          className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#990000] to-[#1e3a5f] hover:opacity-95 disabled:opacity-40 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Paylaşılıyor...' : 'Paylaş'}</span>
        </button>
      </div>
    </div>
  );
}
