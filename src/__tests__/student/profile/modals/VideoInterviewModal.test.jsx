import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VideoInterviewModal from '../../../../components/student/profile/modals/VideoInterviewModal';

describe('VideoInterviewModal', () => {
  let originalConsoleError;
  let originalFile;
  let originalBlob;

  beforeEach(() => {
    vi.clearAllMocks();

    originalFile = global.File;
    originalBlob = global.Blob;

    // Mock Blob and File which might not be available in jsdom environment
    global.Blob = vi.fn().mockImplementation((content, options) => ({ content, options }));
    global.File = vi.fn().mockImplementation((content, name, options) => {
      // Mock File creation failure for error path
      if (options?.type === 'video/webm' && name === 'interview.webm') {
        throw new Error('Simulated File creation error');
      }
      return { content, name, options };
    });

    originalConsoleError = console.error;
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    global.File = originalFile;
    global.Blob = originalBlob;
  });

  it('logs an error when File creation throws an exception', async () => {
    const mockOnSave = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <VideoInterviewModal
        isOpen={true}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    const recordBtn = screen.getByText('Record');
    fireEvent.click(recordBtn);

    const saveBtn = screen.getByText('Save');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error saving video:', expect.any(Error));
      expect(mockOnSave).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
