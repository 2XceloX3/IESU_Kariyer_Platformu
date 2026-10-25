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

  it('does NOT automatically pop up on page load (only opens via explicit trigger)', async () => {
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

    // It must NOT pop up by itself!
    expect(screen.queryByText(/Resmî Değerlendirme Anketi/i)).not.toBeInTheDocument();
  });

  it('immediately opens on open-survey-popup custom event and renders 10 evaluation questions', async () => {
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
    expect(screen.getByText(/İESÜ Mezun Kariyer ve Memnuniyet Değerlendirme Anketi/i)).toBeTruthy();
    expect(screen.getAllByText(/1 - Yetersiz/i).length).toBe(10);
    expect(screen.getAllByText(/5 - Mükemmel/i).length).toBe(10);
  });

  it('renders Değerlendirme Anketi banner and transitions to completed state once filled', () => {
    const { unmount } = render(
      <AlumniFeed 
        setView={vi.fn()}
        setSelectedUserId={vi.fn()}
        currentUser={{ id: 'alumni_101', name: 'Caner Öztürk', role: 'alumni' }}
        userRole="alumni"
      />
    );

    // Initial state: Soruları Yanıtla button visible
    expect(screen.getByText(/Resmî Mezun Değerlendirme Anketi/i)).toBeTruthy();
    expect(screen.getByText(/Soruları Yanıtla/i)).toBeTruthy();

    unmount();

    // Mark survey as filled in localStorage
    localStorage.setItem('survey_filled_SRV-101', 'true');

    render(
      <AlumniFeed 
        setView={vi.fn()}
        setSelectedUserId={vi.fn()}
        currentUser={{ id: 'alumni_101', name: 'Caner Öztürk', role: 'alumni' }}
        userRole="alumni"
      />
    );

    // After completion: Soruları Yanıtla button is replaced by Katılımınız Alındı badge
    expect(screen.getByText(/Katılım Sağlandı ✓/i)).toBeTruthy();
    expect(screen.getByText(/Katılımınız Alındı/i)).toBeTruthy();
    expect(screen.queryByText(/Soruları Yanıtla/i)).toBeNull();
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

  it('does not re-open after user fills it (persists in localStorage and stays closed)', async () => {
    // Simulate user has already completed the survey
    localStorage.setItem('survey_filled_SRV-101', 'true');
    localStorage.setItem('iesu_survey_completed_alumni', 'true');

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

    // Should NOT open
    expect(screen.queryByText(/Resmî Değerlendirme Anketi/i)).not.toBeInTheDocument();
    expect(window.toast.info).toHaveBeenCalledWith(
      expect.stringContaining("Resmî mezun değerlendirme anketini daha önce tamamladınız")
    );
  });
});
