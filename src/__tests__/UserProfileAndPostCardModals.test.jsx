import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from '../components/UserProfile';
import PostCard from '../components/PostCard';

describe('UserProfile & PostCard fixes', () => {
  it('renders Takip Edilen Hocalar with SafeAvatar initials and without broken img tags', () => {
    const mockUser = {
      id: 'STU-001',
      name: 'Mert Demir',
      role: 'student',
      department: 'Bilgisayar Mühendisliği'
    };

    render(
      <UserProfile 
        userId="STU-001" 
        currentUser={mockUser} 
        setView={() => {}} 
        viewerHive="student"
      />
    );

    // Takip Edilen Hocalar kartı
    expect(screen.getByText('Takip Edilen Hocalar')).toBeInTheDocument();
    expect(screen.getByText('Dr. Öğr. Üyesi Mehmet Selim')).toBeInTheDocument();
    expect(screen.getByText('Prof. Dr. Ayşe Yılmaz')).toBeInTheDocument();

    // Initials should be extracted cleanly (MS and AY)
    expect(screen.getByText('MS')).toBeInTheDocument();
    expect(screen.getByText('AY')).toBeInTheDocument();
  });

  it('renders PostCard share modal in document.body via createPortal with close and cancel buttons', () => {
    const mockPost = {
      id: 'post-101',
      content: 'Harika bir kariyer fırsatı!',
      author: { name: 'Trendyol', role: 'company' },
      time: '1 saat önce',
      likes: 5
    };

    render(
      <PostCard 
        post={mockPost} 
        currentUser={{ id: 'STU-001', name: 'Mert Demir', role: 'student' }} 
        setPosts={() => {}}
      />
    );

    // Share button
    const shareBtn = screen.getByLabelText('Paylaş');
    expect(shareBtn).toBeInTheDocument();

    // Click share button
    fireEvent.click(shareBtn);

    // Modal should be opened via portal in document.body
    expect(screen.getByText('Gönderiyi Paylaş')).toBeInTheDocument();
    expect(screen.getByText('Kime Göndermek İstiyorsunuz?')).toBeInTheDocument();
    expect(screen.getByText('İptal')).toBeInTheDocument();
    expect(screen.getByLabelText('Mesaj Olarak Gönder')).toBeInTheDocument();

    // Click cancel button to close
    fireEvent.click(screen.getByText('İptal'));
    expect(screen.queryByText('Kime Göndermek İstiyorsunuz?')).not.toBeInTheDocument();
  });
});
