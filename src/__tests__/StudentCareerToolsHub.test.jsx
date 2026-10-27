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

  it('renders streamlined LinkedIn/Handshake style left sidebar shortcuts', () => {
    render(<StudentFeed currentUser={mockUser} setView={vi.fn()} />);

    // Header exists
    expect(screen.getByText(/Kariyer & Gelişim Araçları/i)).toBeInTheDocument();

    // Streamlined shortcuts
    expect(screen.getAllByText(/Başvuru Radarım/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Kaydedilen İlanlar')).toBeInTheDocument();
    expect(screen.getByText('Kulüp & Topluluklar')).toBeInTheDocument();

    // Launcher button for the full 8-tool cockpit
    expect(screen.getByText(/Gelişim Araçları Merkezi \(8 Araç\)/i)).toBeInTheDocument();
  });

  it('opens Career Hub Cockpit Modal with all 8 detailed modules and KGB points', async () => {
    const mockSetView = vi.fn();
    render(<StudentFeed currentUser={mockUser} setView={mockSetView} />);

    // Click Hub button
    const hubBtn = screen.getByText(/Gelişim Araçları Merkezi \(8 Araç\)/i);
    fireEvent.click(hubBtn);

    // Cockpit Modal is opened with all 8 tools
    expect(screen.getByText('Kariyer & Gelişim Araçları Merkezi')).toBeInTheDocument();
    expect(screen.getByText(/İESÜ Öğrenci Gelişim Ekosistemi/i)).toBeInTheDocument();
    expect(screen.getByText('Kariyer Haritası & Yol Planı')).toBeInTheDocument();
    expect(screen.getByText('AI Mülakat Simülatörü')).toBeInTheDocument();
    expect(screen.getByText('ATS CV Tarayıcı & Optimizasyon')).toBeInTheDocument();
    expect(screen.getByText('Holland Kariyer Eğilim Testi')).toBeInTheDocument();
    expect(screen.getByText('Resmî Staj Portalı')).toBeInTheDocument();
    expect(screen.getByText('Kuluçka Merkezi (TTO)')).toBeInTheDocument();
    expect(screen.getByText('Öğrenci Kulüpleri Portalı')).toBeInTheDocument();
    expect(screen.getByText(/\+10 KGB Puanı/i)).toBeInTheDocument();
    expect(screen.getByText(/\+15 KGB Üyelik/i)).toBeInTheDocument();

    // Direct action from inside Cockpit Modal
    const roadmapAction = screen.getByText('Yol Haritasına Git');
    fireEvent.click(roadmapAction);
    expect(mockSetView).toHaveBeenCalledWith('career_roadmap');
  });

  it('opens ATS Resume Scanner modal from inside Cockpit modal without unmounting feed', async () => {
    render(<StudentFeed currentUser={mockUser} setView={vi.fn()} />);

    // Open Cockpit Modal
    const hubBtn = screen.getByText(/Gelişim Araçları Merkezi \(8 Araç\)/i);
    fireEvent.click(hubBtn);

    // Click ATS CV Scan action
    const atsAction = screen.getByText(/CV'mi Tara \(Akışta Aç\)/i);
    fireEvent.click(atsAction);

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

  it('triggers quick radar navigation via student-feed-quick-radar-btn test id', () => {
    const mockSetView = vi.fn();
    render(<StudentFeed currentUser={mockUser} setView={mockSetView} />);

    const radarBtn = screen.getByTestId('student-feed-quick-radar-btn');
    fireEvent.click(radarBtn);
    expect(mockSetView).toHaveBeenCalledWith('radar');
  });
});
