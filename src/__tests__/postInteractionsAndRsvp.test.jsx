import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from '../components/PostCard';
import eventBus from '../brain/eventBus';

describe('Step 1: Student Feed Interactions, Cross-Tab Sync & Event RSVP Suite', () => {
  const mockUser = {
    id: 'STU-101',
    name: 'Merve Aydın',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Merve+Aydin'
  };

  const mockEventPost = {
    id: 'POST-EVT-999',
    author: { id: 'CLUB-01', name: 'Yazılım Kulübü', role: 'club' },
    content: '🎉 Yıllık İnovasyon Hackathonu Başlıyor!',
    eventPost: true,
    eventTitle: 'İESÜ 2026 Yapay Zeka Hackathonu',
    eventDate: '15 Kasım 2026, 10:00',
    eventLocation: 'A Blok Konferans Salonu',
    eventDesc: 'Ödüllü 48 saatlik maraton.',
    likes: 5,
    likedBy: [],
    comments: 0,
    commentsList: [],
    attendees: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders interactive event RSVP ticket box and toggles attendance cleanly', () => {
    const setPosts = vi.fn();
    const emitSpy = vi.spyOn(eventBus, 'emit');

    render(
      <PostCard
        post={mockEventPost}
        currentUser={mockUser}
        setPosts={setPosts}
      />
    );

    expect(screen.getByText('İESÜ 2026 Yapay Zeka Hackathonu')).toBeInTheDocument();
    expect(screen.getByText('15 Kasım 2026, 10:00')).toBeInTheDocument();
    expect(screen.getByText(/0 öğrenci katılıyor/i)).toBeInTheDocument();

    const joinBtn = screen.getByText('Etkinliğe Katıl');
    expect(joinBtn).toBeInTheDocument();

    fireEvent.click(joinBtn);

    expect(setPosts).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('post:updated', expect.objectContaining({
      post: expect.objectContaining({
        attendees: ['STU-101']
      })
    }));
  });

  it('emits post:updated on like toggle allowing real-time multi-tab propagation', () => {
    const setPosts = vi.fn();
    const emitSpy = vi.spyOn(eventBus, 'emit');

    render(
      <PostCard
        post={mockEventPost}
        currentUser={mockUser}
        setPosts={setPosts}
      />
    );

    const likeBtn = screen.getByText('Beğen');
    fireEvent.click(likeBtn);

    expect(setPosts).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith('post:updated', expect.objectContaining({
      post: expect.objectContaining({
        likes: 6,
        likedBy: ['STU-101']
      })
    }));
  });
});
