/**
 * src/store/useComposerStore.js
 * Instagram Gönderi Paylaşım ve Karusel Durum Makinesi (State Machine)
 * (1-10 Slayt, İlk Slayt Oran Kilidi, Normalize Etiketleme, Ortak Yazarlık & İyimser Akış)
 */

import { create } from 'zustand';
import { preprocessMediaFile, getClosestPreset } from '../services/mediaPreprocessor';
import { saveDraft, getDraft, deleteDraft, storeBlob, getBlob, deleteBlob } from '../services/draftStorage';
import { uploadResumableMedia } from '../services/ruploadClient';
import eventBus from '../brain/eventBus';

const INITIAL_STATE = {
  isOpen: false,
  step: 'select', // 'select' | 'crop' | 'edit' | 'optimistic_publishing'
  slides: [],
  activeSlideIndex: 0,
  lockedAspectRatio: null, // '1:1' | '4:5' | '1.91:1'
  content: '',
  coAuthors: [],
  eventData: null,
  isPublishing: false,
  publishProgress: 0,
  publishStatus: 'idle', // 'idle' | 'preprocessing' | 'uploading' | 'committing' | 'success' | 'error'
  errorMessage: null,
  activeDraftId: null,
  optimisticPost: null,
  lastPublishArgs: null
};

export const useComposerStore = create((set, get) => ({
  ...INITIAL_STATE,

  openComposer: (initialStep = 'select') => {
    set({ isOpen: true, step: initialStep, errorMessage: null });
  },

  closeComposer: () => {
    // Eğer yayınlama işlemi sürüyorsa modalı kapat ama işlemi arka planda devam ettir
    const { isPublishing } = get();
    if (isPublishing) {
      set({ isOpen: false });
    } else {
      set({ isOpen: false });
    }
  },

  setStep: (step) => set({ step }),

  /**
   * Yeni Dosyaları Karusele Ekle (Maksimum 10 Slayt)
   */
  addFiles: async (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const currentSlides = get().slides;

    if (currentSlides.length >= 10) {
      if (typeof window !== 'undefined' && window.toast?.error) {
        window.toast.error('Bir gönderiye en fazla 10 medya eklenebilir.');
      }
      return;
    }

    const availableSlots = 10 - currentSlides.length;
    const filesToProcess = fileList.slice(0, availableSlots);

    const newSlides = [];
    let aspectLock = get().lockedAspectRatio;

    for (const file of filesToProcess) {
      try {
        const processed = await preprocessMediaFile(file);
        
        // İlk slayt en-boy oranını belirler
        if (!aspectLock && processed.width && processed.height) {
          const rawRatio = processed.width / processed.height;
          aspectLock = getClosestPreset(rawRatio);
        }

        const slideId = 'SLD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        newSlides.push({
          id: slideId,
          file,
          blob: processed.blob,
          previewUrl: processed.previewUrl,
          width: processed.width,
          height: processed.height,
          mimeType: processed.mimeType,
          crop: {
            aspect: aspectLock || '1:1',
            zoom: 1.0,
            x: 0,
            y: 0
          },
          tags: [],
          orderIndex: currentSlides.length + newSlides.length
        });
      } catch (err) {
        console.warn('[ComposerStore] Dosya işlenemedi:', err);
      }
    }

    if (newSlides.length > 0) {
      const updatedSlides = [...currentSlides, ...newSlides];
      set({
        slides: updatedSlides,
        lockedAspectRatio: aspectLock || '1:1',
        step: 'crop' // Medya seçildikten sonra otomatik kırpma adımına geç
      });
      await get().autoSaveDraft();
    }
  },

  /**
   * Slayt Sil
   */
  removeSlide: (slideId) => {
    const { slides, activeSlideIndex, activeDraftId } = get();
    if (activeDraftId && slideId) {
      deleteBlob('DRAFT_SLIDE_' + activeDraftId + '_' + slideId).catch(() => {});
    }
    if (slideId) {
      deleteBlob(slideId).catch(() => {});
    }
    const updated = slides.filter(s => s.id !== slideId).map((s, idx) => ({ ...s, orderIndex: idx }));
    const newIndex = Math.min(activeSlideIndex, Math.max(0, updated.length - 1));
    const newAspect = updated.length === 0 ? null : get().lockedAspectRatio;

    set({
      slides: updated,
      activeSlideIndex: newIndex,
      lockedAspectRatio: newAspect,
      step: updated.length === 0 ? 'select' : get().step
    });
    get().autoSaveDraft();
  },

  /**
   * Slayt Sırasını Değiştir (Filmstrip Reorder)
   */
  reorderSlides: (slideId, direction) => {
    const { slides } = get();
    const currentIndex = slides.findIndex(s => s.id === slideId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const temp = reordered[currentIndex];
    reordered[currentIndex] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const indexed = reordered.map((s, i) => ({ ...s, orderIndex: i }));
    set({ slides: indexed, activeSlideIndex: targetIndex });
    get().autoSaveDraft();
  },

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  /**
   * En-Boy Oranını Kilitle (Tüm Slaytlar İçin Günceller)
   */
  setAspectRatio: (aspect) => {
    const { slides } = get();
    const updated = slides.map(s => ({
      ...s,
      crop: { ...s.crop, aspect }
    }));
    set({ lockedAspectRatio: aspect, slides: updated });
    get().autoSaveDraft();
  },

  /**
   * Slayt Kırpma / Yakınlaştırma Verisini Güncelle
   */
  updateSlideCrop: (slideId, cropData) => {
    const { slides } = get();
    const updated = slides.map(s => {
      if (s.id === slideId) {
        return { ...s, crop: { ...s.crop, ...cropData } };
      }
      return s;
    });
    set({ slides: updated });
    get().autoSaveDraft();
  },

  updateSlide: (slideId, updatedFields) => {
    const { slides } = get();
    const updated = slides.map(s => {
      if (s.id === slideId) {
        return { ...s, ...updatedFields };
      }
      return s;
    });
    set({ slides: updated });
    get().autoSaveDraft();
  },

  /**
   * Normalize Koordinatlı ([0.0, 1.0]) Kişi Etiketi Ekle
   */
  addTag: (slideId, tag) => {
    const { slides } = get();
    const updated = slides.map(s => {
      if (s.id === slideId) {
        const tagWithId = {
          id: 'TAG-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          ...tag
        };
        return { ...s, tags: [...(s.tags || []), tagWithId] };
      }
      return s;
    });
    set({ slides: updated });
    get().autoSaveDraft();
  },

  /**
   * Etiket Sil
   */
  removeTag: (slideId, tagId) => {
    const { slides } = get();
    const updated = slides.map(s => {
      if (s.id === slideId) {
        return { ...s, tags: (s.tags || []).filter(t => t.id !== tagId) };
      }
      return s;
    });
    set({ slides: updated });
    get().autoSaveDraft();
  },

  /**
   * Ortak Yazar Ekle / Çıkar (Co-Author)
   */
  addCoAuthor: (author) => {
    const { coAuthors } = get();
    if (coAuthors.some(a => a.id === author.id)) return;
    set({ coAuthors: [...coAuthors, author] });
    get().autoSaveDraft();
  },

  removeCoAuthor: (authorId) => {
    set({ coAuthors: get().coAuthors.filter(a => a.id !== authorId) });
    get().autoSaveDraft();
  },

  setContent: (content) => {
    set({ content });
    get().autoSaveDraft();
  },

  setEventData: (eventData) => {
    set({ eventData });
    get().autoSaveDraft();
  },

  /**
   * Otomatik IndexedDB Taslak Kaydı (İkili Blob & Meta Bütünlüğü)
   */
  autoSaveDraft: async () => {
    const state = get();
    if (state.slides.length === 0 && !state.content.trim() && !state.eventData) return;

    const draftId = state.activeDraftId || ('DFT-' + Date.now());

    // Slaytların ikili Blob'larını IndexedDB'ye kaydet (Zaten kaydedilmişse mükerrer yazımı atla)
    for (const slide of state.slides) {
      if (slide.blob) {
        if (slide._persistedDraftId === draftId && slide._persistedBlobRef === slide.blob) {
          continue;
        }
        try {
          const blobKey = 'DRAFT_SLIDE_' + draftId + '_' + slide.id;
          await storeBlob(blobKey, slide.blob, {
            mimeType: slide.mimeType || slide.blob.type,
            size: slide.blob.size,
            slideId: slide.id,
            draftId
          });
          slide._persistedDraftId = draftId;
          slide._persistedBlobRef = slide.blob;
        } catch (e) {
          console.warn('[ComposerStore] Slide blob save error:', e);
        }
      }
    }

    const draftPayload = {
      id: draftId,
      content: state.content,
      lockedAspectRatio: state.lockedAspectRatio,
      coAuthors: state.coAuthors,
      eventData: state.eventData,
      slideCount: state.slides.length,
      slidesMeta: state.slides.map(s => ({
        id: s.id,
        crop: s.crop,
        tags: s.tags,
        mimeType: s.mimeType,
        width: s.width,
        height: s.height,
        orderIndex: s.orderIndex
      }))
    };

    try {
      await saveDraft(draftPayload);
      if (!state.activeDraftId) {
        set({ activeDraftId: draftId });
      }
    } catch (_) {}
  },

  /**
   * İyimser Gönderi Yayınlama Hattı (Optimistic Pipeline)
   */
  publishPost: async (publishArgs) => {
    const { currentUser, asClub, onOptimisticCreated, onFinalPublished } = publishArgs || {};
    const { slides, content, coAuthors, eventData, lockedAspectRatio } = get();

    if (slides.length === 0 && !content.trim() && !eventData) {
      return;
    }

    // Save publish arguments for genuine retry support
    set({ lastPublishArgs: publishArgs });

    const tempId = 'TEMP-POST-' + Date.now();
    const isEvent = Boolean(eventData?.title);
    const isVideo = slides[0]?.mimeType?.startsWith('video/');
    const isPdf = slides[0]?.mimeType === 'application/pdf';

    // 1. İyimser Gönderi Nesnesi (Optimistic Post Object)
    const optimisticPost = {
      id: tempId,
      tempId,
      status: 'publishing',
      isOptimistic: true,
      time: 'Az önce',
      createdAt: new Date().toISOString(),
      author: asClub ? {
        id: asClub.id, name: asClub.name, avatar: asClub.logo, title: 'Öğrenci Kulübü', role: 'club'
      } : {
        id: currentUser?.id || 'usr_curr',
        name: currentUser?.name || 'Kullanıcı',
        avatar: currentUser?.avatar || null,
        title: currentUser?.title || currentUser?.department || 'Öğrenci',
        role: currentUser?.role || 'student'
      },
      coAuthors: coAuthors || [],
      content: content.trim() || (isEvent ? `📅 ${eventData.title}` : ''),
      image: (!isVideo && !isPdf) ? (slides[0]?.previewUrl || null) : null,
      video: isVideo ? (slides[0]?.previewUrl || null) : null,
      pdf: isPdf ? (slides[0]?.previewUrl || null) : null,
      slides: slides.length > 0 ? slides.map((s, idx) => ({
        id: s.id,
        previewUrl: s.previewUrl,
        aspectRatio: s.crop?.aspect || lockedAspectRatio || '1:1',
        tags: s.tags || [],
        orderIndex: idx
      })) : undefined,
      likes: 0,
      comments: 0,
      aspectRatio: lockedAspectRatio || '1:1',
      ...(isEvent ? {
        eventPost: true,
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventLocation: eventData.location,
        eventDesc: eventData.description
      } : {})
    };

    // İyimser olarak hemen akışa yerleştir & besteciyi kapat
    set({
      isPublishing: true,
      publishStatus: 'preprocessing',
      publishProgress: 15,
      optimisticPost,
      isOpen: false
    });

    if (typeof onOptimisticCreated === 'function') {
      onOptimisticCreated(optimisticPost);
    }

    try {
      // 2. Web Worker Ön İşleme İlerlemesi (%15 -> %35)
      set({ publishStatus: 'uploading', publishProgress: 35 });

      // 3. RUpload İstemcisiyle Parçalı Yükleme (%35 -> %85)
      const uploadedUrls = [];
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (slide.blob) {
          const uploadRes = await uploadResumableMedia(slide.blob, {
            onProgress: ({ percent }) => {
              const base = 35 + Math.round((i / slides.length) * 50);
              const slice = Math.round((percent / 100) * (50 / slides.length));
              set({ publishProgress: Math.min(85, base + slice) });
            },
            metadata: {
              width: slide.width,
              height: slide.height,
              slideIndex: i
            }
          });
          uploadedUrls.push(uploadRes.url);
        } else {
          uploadedUrls.push(slide.previewUrl);
        }
      }

      // 4. Sunucu Commit (%85 -> %100)
      set({ publishStatus: 'committing', publishProgress: 95 });
      await new Promise(r => setTimeout(r, 200));

      // 5. Uzlaştırma (Reconciliation)
      const finalServerId = isEvent ? ('EVNT-' + Date.now()) : ('POST-' + Date.now());
      const reconciledPost = {
        ...optimisticPost,
        id: finalServerId,
        serverId: finalServerId,
        status: 'Yayında',
        isOptimistic: false,
        image: (!isVideo && !isPdf) ? (uploadedUrls[0] || optimisticPost.image) : null,
        video: isVideo ? (uploadedUrls[0] || optimisticPost.video) : null,
        pdf: isPdf ? (uploadedUrls[0] || optimisticPost.pdf) : null,
        slides: optimisticPost.slides ? optimisticPost.slides.map((s, idx) => ({
          ...s,
          previewUrl: uploadedUrls[idx] || s.previewUrl
        })) : undefined
      };

      set({
        publishStatus: 'success',
        publishProgress: 100,
        isPublishing: false,
        optimisticPost: null
      });

      // EventBus bildirimi
      try {
        if (isEvent) {
          eventBus.emit('event:announced', { event: reconciledPost });
        } else {
          eventBus.emit('post:created', { post: reconciledPost });
        }
      } catch (_) {}

      // Taslağı ve ilişkili Blob depolamasını temizle (bellek sızıntısı önleme)
      const currentDraftId = get().activeDraftId;
      if (currentDraftId) {
        deleteDraft(currentDraftId).catch(() => {});
      }
      for (const slide of slides) {
        if (currentDraftId && slide?.id) {
          deleteBlob('DRAFT_SLIDE_' + currentDraftId + '_' + slide.id).catch(() => {});
        }
        if (slide?.id) {
          deleteBlob(slide.id).catch(() => {});
        }
      }

      if (typeof onFinalPublished === 'function') {
        onFinalPublished(reconciledPost, tempId);
      }

      // Durumu sıfırla
      setTimeout(() => {
        get().reset();
      }, 500);

      if (typeof window !== 'undefined' && window.toast?.success) {
        window.toast.success(isEvent ? 'Etkinlik başarıyla yayınlandı!' : 'Gönderiniz paylaşıldı!');
      }

    } catch (err) {
      console.error('[ComposerStore] Yayınlama hatası:', err);
      set({
        publishStatus: 'error',
        errorMessage: err.message || 'Yükleme sırasında bir hata oluştu.',
        isPublishing: false
      });
      if (typeof window !== 'undefined' && window.toast?.error) {
        window.toast.error('Gönderi yüklenemedi. Tekrar deneyebilir veya taslak olarak saklayabilirsiniz.');
      }
    }
  },

  /**
   * Başarısız Yüklemeyi Tekrar Dene (Resumable Retry)
   */
  retryPublish: () => {
    const { optimisticPost, lastPublishArgs } = get();
    if (!optimisticPost && !lastPublishArgs) return;
    set({ publishStatus: 'uploading', errorMessage: null, isPublishing: true });
    if (lastPublishArgs) {
      get().publishPost(lastPublishArgs);
    }
  },

  /**
   * Taslak Geri Yükle (IndexedDB Draft Recovery & İkili Medya Ayağa Kaldırma)
   */
  loadDraft: async (draftId) => {
    if (!draftId) return null;
    try {
      const draft = await getDraft(draftId);
      if (draft) {
        const reconstructedSlides = [];
        for (const meta of (draft.slidesMeta || [])) {
          const blobKey = 'DRAFT_SLIDE_' + draft.id + '_' + meta.id;
          let blob = null;
          try {
            blob = await getBlob(blobKey);
          } catch (_) {}
          const previewUrl = blob && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
            ? URL.createObjectURL(blob)
            : '';
          reconstructedSlides.push({
            id: meta.id,
            blob,
            previewUrl,
            width: meta.width || 0,
            height: meta.height || 0,
            mimeType: meta.mimeType || blob?.type || 'image/webp',
            crop: meta.crop || {
              aspect: draft.lockedAspectRatio || '1:1',
              zoom: 1.0,
              x: 0,
              y: 0
            },
            tags: meta.tags || [],
            orderIndex: meta.orderIndex ?? reconstructedSlides.length
          });
        }

        set({
          activeDraftId: draft.id,
          content: draft.content || '',
          lockedAspectRatio: draft.lockedAspectRatio || '1:1',
          coAuthors: draft.coAuthors || [],
          eventData: draft.eventData || null,
          slides: reconstructedSlides,
          step: reconstructedSlides.length > 0 ? 'crop' : 'select',
          activeSlideIndex: 0
        });
        return draft;
      }
    } catch (_) {}
    return null;
  },

  /**
   * Durumu Sıfırla
   */
  reset: () => {
    set({ ...INITIAL_STATE });
  }
}));

export default useComposerStore;
