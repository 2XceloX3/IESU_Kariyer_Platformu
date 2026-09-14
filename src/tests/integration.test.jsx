import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useAppStore from '../store/useAppStore';
import ScraperSyncBar from '../components/ScraperSyncBar';
import KgmNewsSection from '../components/KgmNewsSection';
import Events from '../components/Events';
import OfficeInfo from '../components/OfficeInfo';
import LandingPage from '../components/LandingPage';
import * as scraperService from '../services/scraper';

describe('Milestone 3 Integration Test Suite: Scraper & Component Wiring', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    const mockData = scraperService.MOCK_IESU_KARIYER_DATA;
    useAppStore.setState({
      scrapedData: mockData,
      announcements: mockData.announcements,
      news: mockData.announcements,
      events: mockData.events,
      officeInfo: mockData.officeInfo,
      lastUpdated: mockData.lastUpdated,
      source: 'fallback',
      status: 'success',
      isScraperLoading: false
    });
  });

  it('renders ScraperSyncBar with status badge, last updated time, and refresh button', () => {
    render(<ScraperSyncBar />);
    
    expect(screen.getByTestId('scraper-sync-bar')).toBeInTheDocument();
    expect(screen.getByTestId('scraper-source-badge')).toHaveTextContent(/Fallback|Canlı/i);
    expect(screen.getByTestId('scraper-last-updated')).toHaveTextContent(/Son Güncelleme/i);
    expect(screen.getByTestId('scraper-refresh-btn')).toHaveTextContent(/Canlı Veri Çek/i);
  });

  it('renders scraped announcements dynamically in KgmNewsSection', () => {
    render(<KgmNewsSection />);

    expect(screen.getByTestId('kgm-news-section')).toBeInTheDocument();
    const titleElements = screen.getAllByTestId('announcement-title');
    expect(titleElements.length).toBeGreaterThan(0);
    expect(titleElements[0].textContent).toContain('2026 Bahar Dönemi Kariyer & Staj Günleri');
  });

  it('renders scraped career events dynamically in Events section', () => {
    render(<Events />);

    expect(screen.getByTestId('events-section')).toBeInTheDocument();
    const eventTitles = screen.getAllByTestId('event-title');
    expect(eventTitles.length).toBeGreaterThan(0);
    expect(eventTitles[0].textContent).toContain(scraperService.MOCK_IESU_KARIYER_DATA.events[0].title);
  });

  it('renders office info, address, phone, email, and coordinators in OfficeInfo component', () => {
    render(<OfficeInfo />);

    expect(screen.getByTestId('office-info-section')).toBeInTheDocument();
    expect(screen.getByTestId('office-title')).toHaveTextContent(/İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi/i);
    expect(screen.getByTestId('office-address')).toHaveTextContent(/Zafer Mah/i);
    expect(screen.getByTestId('office-phone')).toHaveTextContent(/444 9 123/i);
    expect(screen.getByTestId('office-email')).toHaveTextContent(/kariyer@esenyurt.edu.tr/i);

    const coordinatorsList = screen.getByTestId('coordinators-list');
    expect(coordinatorsList).toBeInTheDocument();
  });

  it('updates state and DOM when user clicks refresh button ("esenyurt.edu.tr Canlı Veri Çek")', async () => {
    const updatedPayload = {
      officeInfo: {
        ...scraperService.MOCK_IESU_KARIYER_DATA.officeInfo,
        title: "Güncellenmiş İESU Kariyer Ofisi"
      },
      announcements: [
        {
          id: "ann-live-999",
          title: "YENİ CANLI DUYURU 2026",
          date: "2026-04-20",
          category: "Canlı Test",
          summary: "Esenyurt.edu.tr canlı veri yenileme testi.",
          content: "Canlı duyuru içeriği.",
          link: "https://www.esenyurt.edu.tr/duyuru/canli-test",
          isPinned: true
        }
      ],
      events: [
        {
          id: "evt-live-999",
          title: "YENİ CANLI ETKİNLİK ZİRVESİ",
          date: "2026-05-01 10:00",
          location: "B Blok Amfi 1",
          speaker: "Ahmet YILMAZ",
          link: "#",
          status: "Upcoming"
        }
      ],
      lastUpdated: new Date().toISOString(),
      source: "live",
      status: "success"
    };

    vi.spyOn(scraperService, 'scrapeLiveOrFallback').mockResolvedValue(updatedPayload);

    render(
      <div>
        <ScraperSyncBar />
        <KgmNewsSection />
      </div>
    );

    const refreshBtn = screen.getByTestId('scraper-refresh-btn');
    expect(refreshBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(refreshBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('scraper-source-badge')).toHaveTextContent(/Canlı Veri Sync/i);
      expect(screen.getByText('YENİ CANLI DUYURU 2026')).toBeInTheDocument();
    });
  });

  it('renders full LandingPage integrating hero slider, news, and official sections', () => {
    render(<LandingPage setView={() => {}} />);

    expect(screen.getByText(/Geleceğe Odaklan/i)).toBeInTheDocument();
    expect(screen.getByText(/Güncel İçerikler/i)).toBeInTheDocument();
  });
});
