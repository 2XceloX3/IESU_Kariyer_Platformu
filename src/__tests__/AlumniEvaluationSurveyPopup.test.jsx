/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SurveyPopupModal from '../components/SurveyPopupModal';
import AlumniFeed from '../components/AlumniFeed';
import AdminOmniDock from '../components/AdminOmniDock';
import useAppStore from '../store/useAppStore';

describe('Alumni Evaluation Survey Popup and Feed Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    window.toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };
    useAppStore.setState({
      currentUser: { id: 'admin_1513', name: 'KGM Super Admin', role: 'admin' },
      userRole: 'admin',
      activePortalBranch: 'alumni',
      posts: [],
      surveys: []
    });
  });

  it('renders official 10 evaluation questions when currentView is alumni even if user is admin', async () => {
    render(
      <SurveyPopupModal 
        currentUser={{ id: 'admin_1513', name: 'KGM Super Admin', role: 'admin' }}
        userRole="admin"
        currentView="alumni"
        activePortalBranch="alumni"
      />
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 650));
    });

    expect(screen.getByText(/Resmî Değerlendirme Anketi/i)).toBeTruthy();
    expect(screen.getByText(/İESÜ Mezun Kariyer ve Memnuniyet Değerlendirme Anketi/i)).toBeTruthy();
    expect(screen.getByText(/İESÜ akademik eğitiminin mesleki kariyerinize/i)).toBeTruthy();
  });

  it('immediately opens on open-survey-popup custom event', async () => {
    render(
      <SurveyPopupModal 
        currentUser={{ id: 'alumni_101', name: 'Caner Öztürk', role: 'alumni' }}
        userRole="alumni"
        currentView="alumni"
        activePortalBranch="alumni"
      />
    );

    act(() => {
      window.dispatchEvent(new CustomEvent('open-survey-popup'));
    });

    expect(screen.getByText(/Resmî Değerlendirme Anketi/i)).toBeTruthy();
    expect(screen.getAllByText(/1 - Yetersiz/i).length).toBe(10);
    expect(screen.getAllByText(/5 - Mükemmel/i).length).toBe(10);
  });

  it('renders Değerlendirme Anketi banner and sidebar button, but NOT redundant tab in AlumniFeed', () => {
    render(
      <AlumniFeed 
        setView={vi.fn()}
        setSelectedUserId={vi.fn()}
        currentUser={{ id: 'alumni_101', name: 'Caner Öztürk', role: 'alumni' }}
        userRole="alumni"
      />
    );

    // Sidebar button exists
    expect(screen.getAllByText(/Mezun Değerlendirme Anketi/i).length).toBeGreaterThan(0);
    // Banner card exists with Soruları Yanıtla button
    expect(screen.getByText(/Resmî Mezun Değerlendirme Anketi/i)).toBeTruthy();
    expect(screen.getByText(/Soruları Yanıtla/i)).toBeTruthy();

    // The feed filter tabs are clean: Senin İçin, Ağım, Mezunlar Derneği
    expect(screen.getByRole('button', { name: /^Senin İçin/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Ağım/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Mezunlar Derneği/i })).toBeTruthy();
    
    // There should be NO extra standalone "Değerlendirme Anketi" tab button in the feed tab row
    const tabs = screen.getAllByRole('button');
    const tabTexts = tabs.map(b => b.textContent?.trim());
    expect(tabTexts).not.toContain('Değerlendirme Anketi');
  });

  it('AdminOmniDock with theme emerald navigates to alumni feed instead of admin on Home button click', () => {
    const mockSetView = vi.fn();
    const mockSetActiveTab = vi.fn();
    useAppStore.setState({ activePortalBranch: 'alumni' });

    render(
      <AdminOmniDock 
        setView={mockSetView}
        setActiveTab={mockSetActiveTab}
        activeTab="board"
        theme="emerald"
        currentUser={{ id: 'admin_1513', name: 'KGM Super Admin', role: 'admin' }}
      />
    );

    const homeBtn = screen.getByTitle(/Akış & Ana Sayfa/i);
    fireEvent.click(homeBtn);

    expect(mockSetView).toHaveBeenCalledWith('alumni');
    expect(mockSetView).not.toHaveBeenCalledWith('admin');
    expect(useAppStore.getState().activePortalBranch).toBe('alumni');
  });
});
