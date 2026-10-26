import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MessagingInterface from '../components/MessagingInterface';

const dummyUser = { id: 'usr-1', name: 'Current User' };
const dummyContacts = [
  { id: 'usr-2', name: 'Contact 1', year: '4', department: 'Computer Science' },
];
const dummyMessages = [];

describe('MessagingInterface Video Recording Error Path', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock navigator.mediaDevices
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }]
        }),
      },
      writable: true,
    });

    // Mock console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  it('handles error path when starting recording fails', async () => {
    // We mock MediaRecorder to throw when start is called
    const mockError = new Error('Not allowed');
    global.MediaRecorder = class {
      constructor(stream) {
        this.stream = stream;
        this.state = 'inactive';
      }
      start() {
        throw mockError;
      }
      stop() {}
    };

    render(
      <MemoryRouter>
        <MessagingInterface
          currentUser={dummyUser}
          userRole="student"
          contacts={dummyContacts}
          messages={dummyMessages}
          setMessages={vi.fn()}
          onClose={() => {}}
        />
      </MemoryRouter>
    );

    const contactElements = screen.getAllByText('Contact 1');
    await act(async () => {
        fireEvent.click(contactElements[0]);
    });

    const attachmentBtn = screen.getByPlaceholderText(/Bir mesaj yazın/i).parentElement.previousSibling.querySelectorAll('button')[1];
    if (attachmentBtn) {
        await act(async () => {
            fireEvent.click(attachmentBtn);
        });
    }

    const cameraBtn = screen.getByText(/Kamera Aç/i);
    await act(async () => {
        fireEvent.click(cameraBtn);
    });

    // Start recording
    const startRecordBtn = screen.getByText(/Bas Çek - Basılı Tut Video/i).parentElement.querySelector('button');

    await act(async () => {
        fireEvent.mouseDown(startRecordBtn);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error starting recording:', mockError);
    });
  });
});
