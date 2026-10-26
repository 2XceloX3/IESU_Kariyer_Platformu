import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContactInfoForm from '../ContactInfoForm';

describe('ContactInfoForm', () => {
  it('should handle error when onSave throws, hitting the catch block', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Save failed');
    const onSave = vi.fn().mockRejectedValue(error);

    render(<ContactInfoForm onSave={onSave} initialData={{ name: 'John Doe' }} />);

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({ name: 'John Doe' });
      // This assertion specifically targets the code in the catch block:
      // console.error('Error saving contact info:', error);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving contact info:', error);
    });

    consoleErrorSpy.mockRestore();
  });
});
