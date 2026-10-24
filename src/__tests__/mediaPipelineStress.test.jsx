/**
 * src/__tests__/mediaPipelineStress.test.jsx
 * Instagram Gönderi Paylaşım ve Medya Dağıtım Hattı Kapsamlı Birim ve Stres Testi
 * 
 * Kapsam:
 * 1. Faz 1: İkili Medya Depolama, IndexedDB Draft Motoru, EXIF & KVKK Boyutlandırma, useSharedStore Quota Koruması
 * 2. Faz 2: Karusel Durum Makinesi, 1-10 Slayt, İlk Slayt En-Boy Oranı Kilidi (CLS = 0.00)
 * 3. Faz 3: Normalize Koordinatlı ([0.0, 1.0]) Kişi Etiketleme, Kenar Fiziği & Ortak Yazarlık (Co-Author)
 * 4. Faz 4: İyimser Akış (Optimistic UI), SVG İlerleme Halkası & RUpload Parçalı Aktarım
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { 
  openDraftDB, 
  saveDraft, 
  getDraft, 
  getAllDrafts, 
  deleteDraft, 
  storeBlob, 
  getBlob, 
  deleteBlob, 
  clearOldDrafts 
} from '../services/draftStorage';
import { 
  preprocessMediaFile, 
  clampAspectRatio, 
  getClosestPreset, 
  readExifOrientation,
  ASPECT_RATIOS 
} from '../services/mediaPreprocessor';
import { 
  createUploadSession, 
  getResumeOffset, 
  uploadResumableMedia, 
  getAdaptiveChunkSize 
} from '../services/ruploadClient';
import { useComposerStore } from '../store/useComposerStore';
import { combineFeedItems } from '../utils/feedCombiner';
import useSharedStore from '../brain/useSharedStore';
import PostCard from '../components/PostCard';
import OptimisticPublishCell from '../components/composer/OptimisticPublishCell';
import CoordinateTagPicker from '../components/composer/CoordinateTagPicker';
import CoAuthorSelector from '../components/composer/CoAuthorSelector';
import AspectRatioCropModal from '../components/composer/AspectRatioCropModal';
import CarouselFilmstrip from '../components/composer/CarouselFilmstrip';

describe('Instagram Media Pipeline & Delivery Suite (Reverse Engineering Verification)', () => {
  beforeEach(() => {
    localStorage.clear();
    useComposerStore.getState().reset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Faz 1: İkili Medya Depolama & Bellek Güvenliği', () => {
    it('saves, retrieves, lists, and deletes drafts in draftStorage', async () => {
      const draft = {
        id: 'DFT-TEST-001',
        content: 'Yazılım Kulübü ile Hackathon Etkinliği',
        lockedAspectRatio: '4:5',
        coAuthors: [{ id: 'clb_yazilim', name: 'İESÜ Yazılım Kulübü' }]
      };

      const saved = await saveDraft(draft);
      expect(saved.id).toBe('DFT-TEST-001');

      const retrieved = await getDraft('DFT-TEST-001');
      expect(retrieved.content).toBe('Yazılım Kulübü ile Hackathon Etkinliği');

      const allDrafts = await getAllDrafts();
      expect(allDrafts.length).toBeGreaterThanOrEqual(1);

      await deleteDraft('DFT-TEST-001');
      const afterDelete = await getDraft('DFT-TEST-001');
      expect(afterDelete).toBeNull();
    });

    it('stores and retrieves binary blobs safely without memory leak', async () => {
      const mockBlob = new Blob(['binary-image-data-sample'], { type: 'image/webp' });
      const record = await storeBlob('blob_sample_123', mockBlob, { width: 1080, height: 1350 });

      expect(record.id).toBe('blob_sample_123');
      expect(record.mimeType).toBe('image/webp');

      const retrievedBlob = await getBlob('blob_sample_123');
      expect(retrievedBlob).toBeDefined();

      await deleteBlob('blob_sample_123');
      const afterDelete = await getBlob('blob_sample_123');
      expect(afterDelete).toBeNull();
    });

    it('clears expired drafts older than maxAgeDays', async () => {
      await saveDraft({ id: 'OLD-DRAFT', content: 'Eski taslak', updatedAt: Date.now() - 10 * 86400 * 1000 });
      await saveDraft({ id: 'NEW-DRAFT', content: 'Yeni taslak', updatedAt: Date.now() });

      await clearOldDrafts(7);
      expect(await getDraft('OLD-DRAFT')).toBeNull();
      expect(await getDraft('NEW-DRAFT')).toBeDefined();
    });

    it('parses EXIF orientation header safely from buffers', () => {
      // Boş veya geçersiz buffer
      expect(readExifOrientation(new ArrayBuffer(10))).toBe(1);

      // JPEG SOI (0xFFD8) içeren minimal buffer
      const buffer = new ArrayBuffer(20);
      const view = new DataView(buffer);
      view.setUint16(0, 0xFFD8, false);
      expect(readExifOrientation(buffer)).toBe(1);
    });

    it('clamps aspect ratios within Instagram bounds [0.80, 1.91]', () => {
      expect(clampAspectRatio(0.5)).toBe(0.8);
      expect(clampAspectRatio(2.5)).toBe(1.91);
      expect(clampAspectRatio(1.0)).toBe(1.0);
    });

    it('detects closest Instagram preset for portrait, square, and landscape', () => {
      expect(getClosestPreset(0.8)).toBe('4:5');
      expect(getClosestPreset(1.0)).toBe('1:1');
      expect(getClosestPreset(1.85)).toBe('1.91:1');
    });

    it('prevents QuotaExceededError in useSharedStore by sanitizing large Base64 strings', () => {
      const storeState = useSharedStore.getState();
      const largeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(80000);

      const fakePost = {
        id: 'POST-HUGE',
        content: 'Büyük görsel testi',
        image: largeBase64,
        slides: [{ previewUrl: largeBase64 }]
      };

      // Partialize doğrudan çalıştırılarak kontrol edilir
      // @ts-ignore
      const persisted = useSharedStore.persist.getOptions().partialize({
        ...storeState,
        posts: [fakePost]
      });

      expect(persisted.posts[0].image.length).toBeLessThan(5000);
      expect(persisted.posts[0].slides[0].previewUrl.length).toBeLessThan(5000);
    });

    it('retains published events and optimistic posts in feedCombiner', () => {
      const posts = [
        { id: 'p1', content: 'Normal post', status: 'Yayında' },
        { id: 'p2', content: 'Etkinlik', status: 'Yayında', eventPost: true },
        { id: 'p3', content: 'Yayınlanan İyimser Gönderi', status: 'publishing', isOptimistic: true },
        { id: 'p4', content: 'Reddedilmiş Gönderi', status: 'Reddedildi' }
      ];

      const feed = combineFeedItems(posts, [], [], [], []);
      const feedIds = feed.map(item => item.id);

      expect(feedIds).toContain('p1');
      expect(feedIds).toContain('p2');
      expect(feedIds).toContain('p3');
      expect(feedIds).not.toContain('p4');
    });
  });

  describe('Faz 2: En-Boy Oranı Kilidi & Karusel Durum Makinesi', () => {
    it('manages 1-10 slides and locks aspect ratio on the first slide', async () => {
      const store = useComposerStore.getState();

      const fakeFile1 = new File(['fake-img-1'], 'photo1.jpg', { type: 'image/jpeg' });
      const fakeFile2 = new File(['fake-img-2'], 'photo2.jpg', { type: 'image/jpeg' });

      await store.addFiles([fakeFile1, fakeFile2]);

      const state = useComposerStore.getState();
      expect(state.slides.length).toBe(2);
      expect(state.lockedAspectRatio).toBeDefined();

      // Slayt silme
      store.removeSlide(state.slides[0].id);
      expect(useComposerStore.getState().slides.length).toBe(1);
    });

    it('reorders slides in filmstrip while preserving order indices', async () => {
      const store = useComposerStore.getState();
      const file1 = new File(['1'], 'slide1.jpg', { type: 'image/jpeg' });
      const file2 = new File(['2'], 'slide2.jpg', { type: 'image/jpeg' });

      await store.addFiles([file1, file2]);
      const initialSlides = useComposerStore.getState().slides;
      const firstId = initialSlides[0].id;

      store.reorderSlides(firstId, 'right');
      const updated = useComposerStore.getState().slides;
      expect(updated[1].id).toBe(firstId);
    });

    it('renders AspectRatioCropModal with 1:1, 4:5, 1.91:1 presets and zoom controls', async () => {
      const store = useComposerStore.getState();
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      await store.addFiles([file]);

      const onNext = vi.fn();
      render(<AspectRatioCropModal onNext={onNext} />);

      expect(screen.getByText(/1:1 Kare/i)).toBeInTheDocument();
      expect(screen.getByText(/4:5 Dikey/i)).toBeInTheDocument();
      expect(screen.getByText(/1.91:1 Yatay/i)).toBeInTheDocument();

      // En-boy oranı değiştir
      const portraitBtn = screen.getByText(/4:5 Dikey/i);
      fireEvent.click(portraitBtn);
      expect(useComposerStore.getState().lockedAspectRatio).toBe('4:5');

      // İleri butonu
      const nextBtn = screen.getByText('İleri');
      fireEvent.click(nextBtn);
      expect(onNext).toHaveBeenCalled();
    });
  });

  describe('Faz 3: Normalize Koordinatlı Kişi Etiketleme & Ortak Yazarlık (Co-Author)', () => {
    it('adds and removes normalized tags on active slide', async () => {
      const store = useComposerStore.getState();
      const file = new File(['img'], 'test.jpg', { type: 'image/jpeg' });
      await store.addFiles([file]);

      const slideId = useComposerStore.getState().slides[0].id;

      store.addTag(slideId, {
        username: 'caner_ozturk',
        name: 'Caner Öztürk',
        x: 0.4520,
        y: 0.3015
      });

      const updatedSlide = useComposerStore.getState().slides[0];
      expect(updatedSlide.tags.length).toBe(1);
      expect(updatedSlide.tags[0].x).toBe(0.4520);
      expect(updatedSlide.tags[0].username).toBe('caner_ozturk');

      store.removeTag(slideId, updatedSlide.tags[0].id);
      expect(useComposerStore.getState().slides[0].tags.length).toBe(0);
    });

    it('adds and removes co-authors in CoAuthorSelector', () => {
      const store = useComposerStore.getState();

      store.addCoAuthor({
        id: 'clb_yazilim',
        name: 'İESÜ Yazılım ve İnovasyon Kulübü',
        title: 'Öğrenci Kulübü',
        role: 'club'
      });

      expect(useComposerStore.getState().coAuthors.length).toBe(1);
      expect(useComposerStore.getState().coAuthors[0].name).toContain('Yazılım ve İnovasyon Kulübü');

      store.removeCoAuthor('clb_yazilim');
      expect(useComposerStore.getState().coAuthors.length).toBe(0);
    });

    it('renders PostCard with carousel navigation, pagination dots, and co-authors header', () => {
      const mockPost = {
        id: 'POST-CAROUSEL-01',
        content: 'Yapay Zeka Zirvesi 2026',
        author: { name: 'Ahmet Yılmaz', avatar: null, role: 'student', title: 'Öğrenci' },
        coAuthors: [{ id: 'clb_yazilim', name: 'İESÜ Yazılım Kulübü' }],
        aspectRatio: '4:5',
        slides: [
          { id: 's1', previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', tags: [{ id: 't1', username: 'caner_ozturk', x: 0.5, y: 0.5 }] },
          { id: 's2', previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', tags: [] }
        ],
        time: 'Az önce',
        likes: 12,
        comments: 3
      };

      render(<PostCard post={mockPost} />);

      // Co-author header kontrolü: "... ve İESÜ Yazılım Kulübü"
      expect(screen.getByText(/İESÜ Yazılım Kulübü/i)).toBeInTheDocument();

      // Karusel sayaç ve sonraki slayt butonu kontrolü
      expect(screen.getByText('1/2')).toBeInTheDocument();
      const nextBtn = screen.getByLabelText('Sonraki Slayt');
      expect(nextBtn).toBeInTheDocument();

      fireEvent.click(nextBtn);
      expect(screen.getByText('2/2')).toBeInTheDocument();
    });

    it('renders and toggles tag bubbles on PostCard image', () => {
      const mockPost = {
        id: 'POST-TAGGED',
        content: 'Teknoloji Fuarı Hatırası',
        author: { name: 'Zeynep Kaya', avatar: null },
        slides: [
          { id: 's1', previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', tags: [{ id: 't1', username: 'caner_ozturk', x: 0.5, y: 0.5 }] }
        ]
      };

      render(<PostCard post={mockPost} />);

      const tagToggleBtn = screen.getByLabelText('Kişi Etiketlerini Göster');
      expect(tagToggleBtn).toBeInTheDocument();

      fireEvent.click(tagToggleBtn);
      expect(screen.getByText('@caner_ozturk')).toBeInTheDocument();
    });
  });

  describe('Faz 4: İyimser Akış (Optimistic UI) & RUpload Kesintiye Dayanıklılık', () => {
    it('creates upload sessions and executes chunked resumable upload with progress', async () => {
      const mockBlob = new Blob(['A'.repeat(5000)], { type: 'image/webp' });
      const onProgress = vi.fn();

      const result = await uploadResumableMedia(mockBlob, {
        chunkSize: 2000,
        onProgress
      });

      expect(result.uploadId).toBeDefined();
      expect(result.totalBytes).toBe(5000);
      expect(onProgress).toHaveBeenCalled();
    });

    it('renders OptimisticPublishCell during active publishing with SVG progress', () => {
      useComposerStore.setState({
        isPublishing: true,
        publishProgress: 65,
        publishStatus: 'uploading',
        optimisticPost: { id: 'TEMP-1', content: 'Yüklenen içerik' }
      });

      render(<OptimisticPublishCell />);

      expect(screen.getByText('Gönderiniz Paylaşılıyor')).toBeInTheDocument();
      expect(screen.getByText('%65')).toBeInTheDocument();
      expect(screen.getByText(/RUpload parçalı yükleme sürüyor/i)).toBeInTheDocument();
    });

    it('renders error state with retry and save draft actions in OptimisticPublishCell', () => {
      const onRetry = vi.fn();
      const onSaveDraft = vi.fn();

      useComposerStore.setState({
        isPublishing: false,
        publishStatus: 'error',
        errorMessage: 'Ağ bağlantısı koptu (Simülasyon)',
        optimisticPost: { id: 'TEMP-ERR', content: 'Kurtarılacak içerik' }
      });

      render(<OptimisticPublishCell onRetry={onRetry} onSaveDraft={onSaveDraft} />);

      expect(screen.getByText('Paylaşım Başarısız Oldu')).toBeInTheDocument();
      expect(screen.getByText('Ağ bağlantısı koptu (Simülasyon)')).toBeInTheDocument();

      const retryBtn = screen.getByText('Tekrar Dene');
      fireEvent.click(retryBtn);
      expect(onRetry).toHaveBeenCalled();

      const saveDraftBtn = screen.getByText('Taslağa Kaydet');
      fireEvent.click(saveDraftBtn);
      expect(onSaveDraft).toHaveBeenCalled();
    });

    it('executes full publishPost flow with optimistic injection and reconciliation', async () => {
      const store = useComposerStore.getState();
      const file = new File(['image-content-here'], 'photo.jpg', { type: 'image/jpeg' });
      await store.addFiles([file]);
      store.setContent('Mezuniyet Töreni 2026!');

      const onOptimisticCreated = vi.fn();
      const onFinalPublished = vi.fn();

      await store.publishPost({
        currentUser: { id: 'usr_stu_1', name: 'Ahmet Öğrenci', role: 'student' },
        onOptimisticCreated,
        onFinalPublished
      });

      expect(onOptimisticCreated).toHaveBeenCalled();
      const optArg = onOptimisticCreated.mock.calls[0][0];
      expect(optArg.content).toBe('Mezuniyet Töreni 2026!');
      expect(optArg.isOptimistic).toBe(true);

      expect(onFinalPublished).toHaveBeenCalled();
      const finalArg = onFinalPublished.mock.calls[0][0];
      expect(finalArg.status).toBe('Yayında');
      expect(finalArg.isOptimistic).toBe(false);
    });
  });
});
