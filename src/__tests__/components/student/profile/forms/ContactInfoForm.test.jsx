import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContactInfoForm from '../../../../../components/student/profile/forms/ContactInfoForm';

describe('ContactInfoForm', () => {
  it('calls form.handleSubmit when submitted', async () => {
    const form = { handleSubmit: vi.fn() };
    const { getByTestId } = render(<ContactInfoForm form={form} />);

    fireEvent.click(getByTestId('submit-button'));

    await waitFor(() => {
      expect(form.handleSubmit).toHaveBeenCalled();
    });
  });

  it('logs an error when form validation fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Validation error');
    const form = {
      handleSubmit: vi.fn().mockRejectedValue(error)
    };

    const { getByTestId } = render(<ContactInfoForm form={form} />);

    fireEvent.click(getByTestId('submit-button'));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Form validation failed:', error);
    });

    consoleSpy.mockRestore();
  });
});
