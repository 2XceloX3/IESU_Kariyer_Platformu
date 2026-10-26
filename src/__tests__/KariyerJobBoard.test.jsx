import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import KariyerJobBoard from '../components/KariyerJobBoard';
import useAppStore from '../store/useAppStore';

describe('KariyerJobBoard Component', () => {
  beforeEach(() => {
    window.toast = {
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn()
    };
    useAppStore.setState({ activePortalBranch: 'student' });
  });

  it('handles exceptions during job application (error path)', () => {
    // Force useAppStore.getState() to throw an error to hit the catch block
    const getStateSpy = vi.spyOn(useAppStore, 'getState').mockImplementation(() => {
      throw new Error('Simulated store error');
    });

    const currentUser = { id: 'STU-123', name: 'Test Student' };
    render(<KariyerJobBoard currentUser={currentUser} setView={vi.fn()} userRole="student" />);

    // Find apply buttons
    const applyButtons = screen.getAllByRole('button', { name: /1-Tıkla CV Gönder/i });
    expect(applyButtons.length).toBeGreaterThan(0);

    // Click the first job's apply button
    fireEvent.click(applyButtons[0]);

    // Ensure the catch block's error toast was triggered
    expect(window.toast.error).toHaveBeenCalledWith('Başvuru kaydı sırasında bir hata oluştu.');

    // Cleanup
    getStateSpy.mockRestore();
  });
});
