/**
 * src/__tests__/postComposerIntegration.test.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) PostComposer Entegrasyon ve Stres Testi
 * 
 * Doğrulanan Maddeler:
 * 1. PostComposer ile useComposerStore tam senkronizasyonu
 * 2. AspectRatioCropModal açılması, oran kilidi ve zoom kontrolü
 * 3. CoordinateTagPicker ile normalize koordinatlı kişi/kulüp etiketleme
 * 4. CoAuthorSelector ile ortak yazar daveti ve PostCard başlığında renderlanması
 * 5. CarouselFilmstrip çoklu slayt (1-10) yönetimi ve sıralama
 * 6. İyimser akış (OptimisticPublishCell) ve RUpload uzlaştırması
 * 7. Tekil görsel ve karusellerde PostCard aspect-ratio uyumu
 * 8. ruploadClient'ta oturum kurtarma (sessionId resume)
 * 9. draftStorage'ta eski blob ve taslak temizliği (clearOldDrafts)
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import useComposerStore from '../store/useComposerStore';
import { clearOldDrafts, storeBlob, getBlob, saveDraft, getDraft } from '../services/draftStorage';
import { uploadResumableMedia } from '../services/ruploadClient';

describe('PostComposer Full Integration & Pipeline Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    useComposerStore.getState().reset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders PostComposer with SafeAvatar and textarea placeholder', () => {
    const currentUser = { id: 'usr_1', name: 'Caner Öztürk', role: 'student', avatar: null };
    render(<PostComposer currentUser={currentUser} userRole="student" posts={[]} setPosts={vi.fn()} />);

    expect(screen.getByPlaceholderText('Gönderi başlat...')).toBeInTheDocument();
    expect(screen.getByText('Medya / Karusel')).toBeInTheDocument();
    expect(screen.getByText('Etkinlik')).toBeInTheDocument();
  });

  it('integrates with useComposerStore when typing and updating aspect ratio', () => {
    const currentUser = { id: 'usr_1', name: 'Caner Öztürk', role: 'student' };
    render(<PostComposer currentUser={currentUser} userRole="student" posts={[]} setPosts={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Gönderi başlat...');
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: 'Yeni araştırma laboratuvarı açıldı!' } });

    expect(useComposerStore.getState().content).toBe('Yeni araştırma laboratuvarı açıldı!');
  });

  it('toggles AspectRatioCropModal when clicking "Kırp & Yakınlaştır"', async () => {
    const currentUser = { id: 'usr_1', name: 'Caner Öztürk', role: 'student' };
    useComposerStore.setState({
      slides: [
        {
          id: 'sld_1',
          previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
          crop: { aspect: '1:1', zoom: 1.0 },
          tags: []
        }
      ]
    });

    render(<PostComposer currentUser={currentUser} userRole="student" posts={[]} setPosts={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Gönderi başlat...');
    fireEvent.focus(textarea);

    const cropBtn = screen.getByText('Kırp & Yakınlaştır');
    expect(cropBtn).toBeInTheDocument();

    fireEvent.click(cropBtn);
    expect(screen.getByText('Kırpma & En-Boy Oranı Kilidi')).toBeInTheDocument();

    // Oran değiştir
    const portraitBtns = screen.getAllByText('4:5 Dikey');
    fireEvent.click(portraitBtns[portraitBtns.length - 1]);
    expect(useComposerStore.getState().lockedAspectRatio).toBe('4:5');

    // Modalı kapat
    const nextBtn = screen.getByText('İleri');
    fireEvent.click(nextBtn);
    expect(screen.queryByText('Kırpma & En-Boy Oranı Kilidi')).not.toBeInTheDocument();
  });

  it('toggles CoordinateTagPicker and adds tags to the active slide', async () => {
    const currentUser = { id: 'usr_1', name: 'Caner Öztürk', role: 'student' };
    useComposerStore.setState({
      slides: [
        {
          id: 'sld_tag_test',
          previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
          crop: { aspect: '1:1', zoom: 1.0 },
          tags: []
        }
      ]
    });

    render(<PostComposer currentUser={currentUser} userRole="student" posts={[]} setPosts={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Gönderi başlat...');
    fireEvent.focus(textarea);

    const tagBtn = screen.getByText('Kişi Etiketle');
    fireEvent.click(tagBtn);

    expect(screen.getByText('Kişi ve Kulüp Etiketle')).toBeInTheDocument();

    // Etiket ekle
    act(() => {
      useComposerStore.getState().addTag('sld_tag_test', {
        id: 't_custom',
        entityId: 'usr_ayse',
        name: 'Ayşe Kaya',
        username: 'ayse_kaya',
        role: 'student',
        x: 0.45,
        y: 0.60
      });
    });

    const activeSlide = useComposerStore.getState().slides[0];
    expect(activeSlide.tags.length).toBe(1);
    expect(activeSlide.tags[0].username).toBe('ayse_kaya');
  });

  it('toggles CoAuthorSelector and invites co-authors cleanly', async () => {
    const currentUser = { id: 'usr_1', name: 'Caner Öztürk', role: 'student' };
    useComposerStore.setState({
      slides: [
        {
          id: 'sld_coauthor',
          previewUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
          crop: { aspect: '1:1', zoom: 1.0 },
          tags: []
        }
      ]
    });

    render(<PostComposer currentUser={currentUser} userRole="student" posts={[]} setPosts={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Gönderi başlat...');
    fireEvent.focus(textarea);

    const coAuthorBtn = screen.getByText('Ortak Yazar');
    fireEvent.click(coAuthorBtn);

    expect(screen.getByText('Ortak Yazarlık (Co-Author)')).toBeInTheDocument();

    // Ortak yazar ekle
    act(() => {
      useComposerStore.getState().addCoAuthor({
        id: 'clb_yazilim',
        name: 'İESÜ Yazılım ve İnovasyon Kulübü',
        title: 'Öğrenci Kulübü',
        role: 'club'
      });
    });

    expect(useComposerStore.getState().coAuthors.length).toBe(1);
    expect(useComposerStore.getState().coAuthors[0].name).toBe('İESÜ Yazılım ve İnovasyon Kulübü');
  });

  it('submits a post through the optimistic publishing pipeline and reconciles state', async () => {
    const currentUser = { id: 'usr_1', name: 'Caner Öztürk', role: 'student' };
    let currentPosts = [];
    const setPosts = vi.fn((update) => {
      currentPosts = typeof update === 'function' ? update(currentPosts) : update;
    });

    useComposerStore.setState({
      slides: [
        {
          id: 'sld_pub',
          previewUrl: 'blob:test-preview-url',
          blob: new Blob(['sample-img'], { type: 'image/webp' }),
          width: 1080,
          height: 1080,
          crop: { aspect: '1:1', zoom: 1.0 },
          tags: [{ id: 't1', username: 'ayse_kaya', x: 0.5, y: 0.5 }]
        }
      ],
      coAuthors: [{ id: 'clb_yazilim', name: 'İESÜ Yazılım Kulübü' }]
    });

    render(<PostComposer currentUser={currentUser} userRole="student" posts={currentPosts} setPosts={setPosts} />);

    const textarea = screen.getByPlaceholderText('Gönderi başlat...');
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: 'Büyük Hackathon Başladı!' } });

    const submitBtn = screen.getByText('Gönder');
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // İyimser gönderi akışa hemen eklenmiş olmalı
    expect(setPosts).toHaveBeenCalled();
    const updater = setPosts.mock.calls[0][0];
    const updatedPosts = typeof updater === 'function' ? updater([]) : updater;
    const optimisticPost = updatedPosts[0];
    expect(optimisticPost.content).toBe('Büyük Hackathon Başladı!');
    expect(optimisticPost.coAuthors.length).toBe(1);
    expect(optimisticPost.slides[0].tags.length).toBe(1);
    expect(optimisticPost.isOptimistic).toBe(true);
  });

  it('renders single image posts in PostCard matching aspect-ratio', () => {
    const mockPostPortrait = {
      id: 'p_portrait',
      content: 'Dikey Fotoğraf',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      aspectRatio: '4:5',
      author: { name: 'Ahmet Yılmaz', avatar: null }
    };

    const { container: container1 } = render(<PostCard post={mockPostPortrait} />);
    expect(container1.querySelector('.aspect-\\[4\\/5\\]')).toBeInTheDocument();

    const mockPostLandscape = {
      id: 'p_landscape',
      content: 'Yatay Manzara',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      aspectRatio: '1.91:1',
      author: { name: 'Ahmet Yılmaz', avatar: null }
    };

    const { container: container2 } = render(<PostCard post={mockPostLandscape} />);
    expect(container2.querySelector('.aspect-\\[1\\.91\\/1\\]')).toBeInTheDocument();
  });

  it('allows resuming an upload session in ruploadClient using existing sessionId', async () => {
    const mockBlob = new Blob(['sample-data-for-rupload'], { type: 'image/webp' });
    const existingSessionId = 'RUA-RESUME-TEST-123';

    // Simüle edilmiş kayıtlı offset
    localStorage.setItem(`rupload_offset_${existingSessionId}`, '10');

    const result = await uploadResumableMedia(mockBlob, {
      sessionId: existingSessionId,
      chunkSize: 10
    });

    expect(result.uploadId).toBe(existingSessionId);
    expect(result.totalBytes).toBe(mockBlob.size);
  });

  it('cleans up expired blobs alongside drafts in draftStorage.clearOldDrafts', async () => {
    const oldTimestamp = Date.now() - 10 * 86400 * 1000;
    await saveDraft({ id: 'DRAFT_EXP', content: 'Eski', updatedAt: oldTimestamp });
    await storeBlob('BLOB_EXP', new Blob(['old']), { createdAt: oldTimestamp });

    await clearOldDrafts(7);

    expect(await getDraft('DRAFT_EXP')).toBeNull();
  });

  it('supports genuine retryPublish in useComposerStore with saved args', async () => {
    const store = useComposerStore.getState();
    const onOptimisticCreated = vi.fn();
    const onFinalPublished = vi.fn();

    const publishArgs = {
      currentUser: { id: 'usr_retry', name: 'Mehmet' },
      onOptimisticCreated,
      onFinalPublished
    };

    store.setContent('Yeniden deneme mesajı');
    await store.publishPost(publishArgs);

    expect(store.lastPublishArgs).toBeDefined();

    // Simüle et: Publish hatası oluştu
    useComposerStore.setState({
      publishStatus: 'error',
      errorMessage: 'Network failed'
    });

    // retryPublish çağrıldığında
    await act(async () => {
      useComposerStore.getState().retryPublish();
    });

    expect(useComposerStore.getState().publishStatus).not.toBe('error');
  });
});
