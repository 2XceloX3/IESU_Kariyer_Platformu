import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import KariyerJobBoard from '../components/KariyerJobBoard';
import useAppStore from '../store/useAppStore';

// Mock the store
vi.mock('../store/useAppStore', () => {
  const mockStore = vi.fn((selector) => { if (selector.toString().includes('activePortalBranch')) return 'student'; if (selector.toString().includes('alumniAssocBoard')) return []; return null; }); // default mock for the hook itself (returns activePortalBranch)
  mockStore.getState = vi.fn();
  return {
    default: mockStore
  };
});

describe('KariyerJobBoard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.toast = {
      success: vi.fn(),
      error: vi.fn(),
    };
  });

  const mockProps = {
    setView: vi.fn(),
    currentUser: { id: 'u1', name: 'Test User', email: 'test@example.com' },
    userRole: 'student',
    setSelectedUserId: vi.fn(),
    previousView: 'student'
  };

  it('renders successfully', () => {
    render(<KariyerJobBoard {...mockProps} />);
    expect(screen.getByText('Kariyer İş & Staj İlanları')).toBeInTheDocument();
  });

  it('handles apply success', async () => {
    const addApplicationMock = vi.fn();
    useAppStore.getState.mockReturnValue({ addApplication: addApplicationMock });

    render(<KariyerJobBoard {...mockProps} />);

    // Find the first apply button
    const applyButtons = screen.getAllByText('1-Tıkla CV Gönder');
    await act(async () => {
      fireEvent.click(applyButtons[0]);
    });

    expect(addApplicationMock).toHaveBeenCalled();
    expect(window.toast.success).toHaveBeenCalledWith(expect.stringContaining('ilanına CV\'niz başarıyla iletildi.'));
  });

  it('handles apply error path when store throws exception', async () => {
    // Force the error path by making getState throw
    useAppStore.getState.mockImplementation(() => {
      throw new Error('Simulated store error');
    });

    render(<KariyerJobBoard {...mockProps} />);

    const applyButtons = screen.getAllByText('1-Tıkla CV Gönder');
    await act(async () => {
      fireEvent.click(applyButtons[0]);
    });

    // The catch block in handleApply should catch it and show error toast
    expect(window.toast.error).toHaveBeenCalledWith('Başvuru kaydı sırasında bir hata oluştu.');
  });
});
