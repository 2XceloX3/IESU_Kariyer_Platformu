import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InternshipCommissionPanel from '../components/internship/InternshipCommissionPanel';
import * as internshipWorkflow from '../services/internshipWorkflow';

describe('InternshipCommissionPanel Error Path', () => {
  const mockInternships = [
    {
      id: 'INT123',
      studentName: 'Test Student',
      studentNo: '123456',
      department: 'Bilgisayar Mühendisliği',
      companyName: 'Test Company',
      status: 'COMMISSION_PENDING'
    }
  ];

  beforeEach(() => {
    window.toast = { error: vi.fn(), success: vi.fn(), info: vi.fn() };
  });

  it('triggers the generic error message on decision error', async () => {
    const props = {
      internships: mockInternships,
      currentUser: { id: 'admin1', name: 'Admin' },
      onUpdateInternship: vi.fn()
    };

    // We will spy on advanceInternshipStatus to throw
    vi.spyOn(internshipWorkflow, 'advanceInternshipStatus').mockImplementation(() => {
      throw new Error('Simulated specific error');
    });

    render(<InternshipCommissionPanel {...props} />);

    // Open the modal by clicking 'İncele & Karar'
    const kararBtn = screen.getByRole('button', { name: /İncele & Karar/i });
    fireEvent.click(kararBtn);

    // Select 'Revizyon İstensin' mode inside modal
    const reviseBtns = screen.getAllByRole('button');
    const reviseBtn = reviseBtns.find(b => b.textContent.includes('Revizyon İstensin'));
    if (reviseBtn) {
      fireEvent.click(reviseBtn);
    }

    // Change note
    const noteInputs = screen.getAllByRole('textbox');
    const noteInput = noteInputs.find(i => i.tagName === 'TEXTAREA' || i.placeholder?.includes('Örn'));
    if (noteInput) {
      fireEvent.change(noteInput, { target: { value: 'Valid note min 5 chars' } });
    }

    // Click 'Kararı Kaydet ve Uygula'
    const executeBtns = screen.getAllByRole('button');
    const executeBtn = executeBtns.find(b => b.textContent.includes('Kaydet ve Uygula'));
    if (executeBtn) {
      fireEvent.click(executeBtn);
    }

    // Wait for the specific error message to appear in the DOM
    await waitFor(() => {
      expect(screen.getByText('Simulated specific error')).toBeInTheDocument();
    });
  });
});
