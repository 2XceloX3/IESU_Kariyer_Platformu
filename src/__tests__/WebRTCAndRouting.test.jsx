import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import MessagingInterface from '../components/MessagingInterface';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function() {};
  if (!window.MediaStream) {
    window.MediaStream = class MediaStream {
      constructor() { this.tracks = []; }
      addTrack(t) { this.tracks.push(t); }
      getTracks() { return this.tracks; }
      getVideoTracks() { return []; }
      getAudioTracks() { return []; }
    };
  }
  class MockAudioContext {
    constructor() {
      this.state = 'running';
      this.currentTime = 0;
      this.destination = {};
    }
    resume() { return Promise.resolve(); }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { value: 440, setValueAtTime: vi.fn() },
        start: vi.fn(),
        stop: vi.fn(),
        connect: vi.fn()
      };
    }
    createGain() {
      return {
        gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn()
      };
    }
    createMediaStreamDestination() {
      return {
        stream: new window.MediaStream()
      };
    }
  }
  window.AudioContext = MockAudioContext;
  window.webkitAudioContext = MockAudioContext;
});

const dummyUser = { id: 'usr-1', name: 'Zeynep Yılmaz', role: 'student' };
const dummyContacts = [
  { id: 'usr-2', name: 'Ahmet Hoca', title: 'Prof. Dr.', year: '2024' },
];
const dummyMessages = [
  { id: 'm1', senderId: 'usr-1', receiverId: 'usr-2', content: 'Merhaba Hocam', timestamp: Date.now() },
];

describe('MessagingInterface - WebRTC Call Studio & Close Button Routing', () => {
  
  describe('R2: Navigation Routing & Close Button', () => {
    it('executes onClose callback when onClose prop is provided', () => {
      const onCloseMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={dummyUser}
            userRole="student"
            contacts={dummyContacts}
            messages={dummyMessages}
            onClose={onCloseMock}
          />
        </MemoryRouter>
      );

      const closeButton = screen.getByTitle('Kapat');
      fireEvent.click(closeButton);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('redirects to previousView when previousView is valid role feed', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={dummyUser}
            userRole="student"
            previousView="alumni"
            setView={setViewMock}
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      const closeButton = screen.getByTitle('Kapat');
      fireEvent.click(closeButton);
      expect(setViewMock).toHaveBeenCalledWith('alumni');
    });

    it('routes based on normalized role mapping for company / employer', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'c1', role: 'employer' }}
            userRole="company"
            setView={setViewMock}
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      const closeButton = screen.getByTitle('Kapat');
      fireEvent.click(closeButton);
      expect(setViewMock).toHaveBeenCalledWith('company');
    });

    it('routes based on normalized role mapping for academic_staff', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'a1', role: 'academic_staff' }}
            userRole="academic"
            setView={setViewMock}
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      const closeButton = screen.getByTitle('Kapat');
      fireEvent.click(closeButton);
      expect(setViewMock).toHaveBeenCalledWith('academic');
    });

    it('STRICTLY prevents redirect to admin panel and defaults to student', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'admin1', role: 'admin' }}
            userRole="admin"
            setView={setViewMock}
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      const closeButton = screen.getByTitle('Kapat');
      fireEvent.click(closeButton);
      expect(setViewMock).toHaveBeenCalledWith('student');
      expect(setViewMock).not.toHaveBeenCalledWith('admin');
    });
  });

  describe('R1: Ultra-Professional WebRTC Voice & Video Call Studio', () => {
    it('renders WebRTC overlay studio modal with network quality badge and call controls when video call starts', async () => {
      const { container } = render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={dummyUser}
            userRole="student"
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      // Select contact
      const contactElement = screen.getByText('Ahmet Hoca');
      fireEvent.click(contactElement);

      // Trigger video call button
      const videoCallBtn = screen.getByTitle('Görüntülü Arama');
      fireEvent.click(videoCallBtn);

      // Check modal overlay elements
      expect(screen.getByText(/1080p HD/i)).toBeTruthy();
      expect(screen.getByText(/60 FPS/i)).toBeTruthy();
      expect(screen.getByText(/Mükemmel/i)).toBeTruthy();

      // Check controls (Mute, Camera, Screen Share, End Call)
      expect(screen.getByTitle('Mikrofonu Sessize Al')).toBeTruthy();
      expect(screen.getByTitle('Kamerayı Kapat')).toBeTruthy();
      expect(screen.getByTitle('Ekran Paylaş')).toBeTruthy();
      expect(screen.getByTitle('Aramayı Sonlandır')).toBeTruthy();
    });

    it('toggles microphone mute state when mic button is clicked', async () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={dummyUser}
            userRole="student"
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Ahmet Hoca'));
      fireEvent.click(screen.getByTitle('Görüntülü Arama'));

      const muteBtn = screen.getByTitle('Mikrofonu Sessize Al');
      fireEvent.click(muteBtn);

      // Now title should change to "Mikrofonu Aç"
      expect(screen.getByTitle('Mikrofonu Aç')).toBeTruthy();
    });

    it('toggles camera off/on state when camera button is clicked', async () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={dummyUser}
            userRole="student"
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Ahmet Hoca'));
      fireEvent.click(screen.getByTitle('Görüntülü Arama'));

      const cameraBtn = screen.getByTitle('Kamerayı Kapat');
      fireEvent.click(cameraBtn);

      expect(screen.getByTitle('Kamerayı Aç')).toBeTruthy();
    });

    it('ends the active call when call end button is clicked', async () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={dummyUser}
            userRole="student"
            contacts={dummyContacts}
            messages={dummyMessages}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('Ahmet Hoca'));
      fireEvent.click(screen.getByTitle('Görüntülü Arama'));

      const endBtn = screen.getByTitle('Aramayı Sonlandır');
      fireEvent.click(endBtn);

      // Modal overlay should be closed
      expect(screen.queryByText(/1080p HD/i)).toBeNull();
    });
  });
});
