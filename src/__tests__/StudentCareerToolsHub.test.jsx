import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StudentFeed from '../components/StudentFeed';
import useAppStore from '../store/useAppStore';

describe('Student Career Tools Hub & Left Sidebar Cockpit Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      currentUser: {
        id: 'STU-100',
        name: 'Deniz Kaya',
        role: 'student',
        department: 'Yazılım Mühendisliği',
        classLevel: '3. Sınıf',
        avatar: '/logo.png'
      },
      posts: [],
      applications: [],
      clubs: []
    });
  });

  const mockUser = {
    id: 'STU-100',
    name: 'Deniz Kaya',
    role: 'student',
    department: 'Yazılım Mühendisliği'
  };

  it('renders modern categorized 8-tool grid in the left sidebar', () => {
    render(<StudentFeed currentUser={mockUser} setView={vi.fn()} />);

    // Header & badge
    expect(screen.getByText(/Kariyer & Gelişim Araçları/i)).toBeInTheDocument();
    expect(screen.getByText('8 Araç')).toBeInTheDocument();

    // 8 tools are visible in the sidebar
    expect(screen.getByText('Kariyer Haritası')).toBeInTheDocument();
    expect(screen.getByText('Mülakat Simülatörü')).toBeInTheDocument();
    expect(screen.getByText('ATS CV Tarayıcı')).toBeInTheDocument();
    expect(screen.getByText('Kariyer Testi')).toBeInTheDocument();
    expect(screen.getAllByText(/Başvuru Radarı/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Staj Portalı')).toBeInTheDocument();
    expect(screen.getByText('Kuluçka Merkezi')).toBeInTheDocument();
    expect(screen.getByText('Kulüpler Portalı')).toBeInTheDocument();

    // Launcher button exists
    expect(screen.getByText(/Gelişim Hub'ı & Puan Rehberi/i)).toBeInTheDocument();
  });

  it('opens ATS Resume Scanner modal in-feed without unmounting the feed', async () => {
    render(<StudentFeed currentUser={mockUser} setView={vi.fn()} />);

    // Click ATS CV Tarayıcı in the sidebar
    const atsBtn = screen.getByText('ATS CV Tarayıcı');
    fireEvent.click(atsBtn);

    // ATS Modal should pop up directly over the feed
    await waitFor(() => {
      expect(screen.getByText(/Yapay Zekâ ATS Uyum Tarayıcısı & CV Optimizasyonu/i)).toBeInTheDocument();
    });

    // Close the ATS modal
    const closeBtn = screen.getByTitle('Kapat');
    fireEvent.click(closeBtn);

    // Modal unmounts, feed remains intact
    await waitFor(() => {
      expect(screen.queryByText(/Yapay Zekâ ATS Uyum Tarayıcısı & CV Optimizasyonu/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Kariyer & Gelişim Araçları/i)).toBeInTheDocument();
  });

  it('opens Career Hub Cockpit Modal with all 8 detailed modules and KGB points', async () => {
    const mockSetView = vi.fn();
    render(<StudentFeed currentUser={mockUser} setView={mockSetView} />);

    // Click Hub button
    const hubBtn = screen.getByText(/Gelişim Hub'ı & Puan Rehberi/i);
    fireEvent.click(hubBtn);

    // Cockpit Modal is opened
    expect(screen.getByText('Kariyer & Gelişim Araçları Merkezi')).toBeInTheDocument();
    expect(screen.getByText(/İESÜ Öğrenci Gelişim Ekosistemi/i)).toBeInTheDocument();
    expect(screen.getByText(/\+10 KGB Puanı/i)).toBeInTheDocument();
    expect(screen.getByText(/\+15 KGB Üyelik/i)).toBeInTheDocument();

    // Direct action from inside Cockpit Modal
    const roadmapAction = screen.getByText('Yol Haritasına Git');
    fireEvent.click(roadmapAction);
    expect(mockSetView).toHaveBeenCalledWith('career_roadmap');
  });

  it('triggers quick radar navigation via student-feed-quick-radar-btn test id', () => {
    const mockSetView = vi.fn();
    render(<StudentFeed currentUser={mockUser} setView={mockSetView} />);

    const radarBtn = screen.getByTestId('student-feed-quick-radar-btn');
    fireEvent.click(radarBtn);
    expect(mockSetView).toHaveBeenCalledWith('radar');
  });
});
