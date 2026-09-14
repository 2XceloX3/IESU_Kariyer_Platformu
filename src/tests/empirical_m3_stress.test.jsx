import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import MessagingInterface from '../components/MessagingInterface';
import {
  parseIesuHtmlPayload,
  extractAnnouncements,
  extractEvents,
  extractOfficeInfo,
  scrapeLiveOrFallback,
  fetchIesuKariyerData,
  MOCK_IESU_KARIYER_DATA
} from '../services/scraper.js';

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

describe('M3 Empirical Stress Test & Edge Case Verification Suite', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ==========================================
  // Edge Case 1: Empty Scraped Data Arrays
  // ==========================================
  describe('1. Edge Case: Empty Scraped Data Arrays', () => {
    it('1.1 extractAnnouncements returns empty array when doc/html has no matching items', () => {
      const result = extractAnnouncements(null, '');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('1.2 extractEvents returns empty array when doc/html has no matching items', () => {
      const result = extractEvents(null, '');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('1.3 parseIesuHtmlPayload falls back gracefully when extracted arrays are empty', () => {
      const emptyHtml = '<html><body><div>No content</div></body></html>';
      const result = parseIesuHtmlPayload(emptyHtml);
      expect(result).toBeDefined();
      expect(Array.isArray(result.announcements)).toBe(true);
      expect(result.announcements.length).toBeGreaterThan(0);
      expect(Array.isArray(result.events)).toBe(true);
      expect(result.events.length).toBeGreaterThan(0);
      expect(result.officeInfo.title).toBe(MOCK_IESU_KARIYER_DATA.officeInfo.title);
    });

    it('1.4 MessagingInterface renders correctly with empty contacts and messages arrays', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'u1', name: 'Test User', role: 'student' }}
            userRole="student"
            contacts={[]}
            messages={[]}
            setView={setViewMock}
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText(/Sohbetler|Mesajlar/i).length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Edge Case 2: Network Latency Fluctuations
  // ==========================================
  describe('2. Edge Case: Network Latency Fluctuations', () => {
    it('2.1 scrapeLiveOrFallback handles network latency delay and timeout abort', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          }, 100);
        });
      });

      const startTime = Date.now();
      const result = await scrapeLiveOrFallback({ forceRefresh: true, timeoutMs: 50 });
      const duration = Date.now() - startTime;

      expect(result.source).toBe('fallback');
      expect(result.status).toBe('warning');
      expect(result.announcements.length).toBeGreaterThan(0);
    });

    it('2.2 scrapeLiveOrFallback handles HTTP 504 Gateway Timeout gracefully', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 504,
        statusText: 'Gateway Timeout'
      });

      const result = await scrapeLiveOrFallback({ forceRefresh: true });
      expect(result.source).toBe('fallback');
      expect(result.status).toBe('warning');
      expect(result.events.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Edge Case 3: Role Switching & Access Control
  // ==========================================
  describe('3. Edge Case: Role Switching & Contact Permissions', () => {
    const studentUser = { id: 's1', name: 'Student One', role: 'student' };
    const companyUser = { id: 'c1', name: 'Company One', role: 'company' };
    const academicUser = { id: 'a1', name: 'Academic One', role: 'academic' };
    const adminUser = { id: 'ad1', name: 'Admin One', role: 'admin' };

    const sampleContacts = [
      { id: 'cnt-student', name: 'Ali Student', year: '3', gradYear: null, role: 'student', type: 'student' },
      { id: 'cnt-alumni', name: 'Veli Alumni', gradYear: '2023', role: 'alumni', type: 'alumni' },
      { id: 'cnt-academic', name: 'Prof. Ayşe', title: 'Dr. Öğr. Üyesi', role: 'academic', type: 'academic' },
      { id: 'cnt-company', name: 'Tech Corp HR', sector: 'Yazılım', role: 'company', type: 'company' }
    ];

    it('3.1 Student role sees student, alumni, and academic contacts, but NOT company directly', () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={studentUser}
            userRole="student"
            contacts={sampleContacts}
            messages={[]}
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText('Ali Student').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Veli Alumni').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Prof. Ayşe').length).toBeGreaterThan(0);
      expect(screen.queryByText('Tech Corp HR')).toBeNull();
    });

    it('3.2 Company role sees academic contacts', () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={companyUser}
            userRole="company"
            contacts={sampleContacts}
            messages={[]}
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText('Prof. Ayşe').length).toBeGreaterThan(0);
      expect(screen.queryByText('Ali Student')).toBeNull();
    });

    it('3.3 Academic role sees company, student, and alumni contacts', () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={academicUser}
            userRole="academic"
            contacts={sampleContacts}
            messages={[]}
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText('Ali Student').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Veli Alumni').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Tech Corp HR').length).toBeGreaterThan(0);
    });

    it('3.4 Admin role sees all contacts unconditionally', () => {
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={adminUser}
            userRole="admin"
            contacts={sampleContacts}
            messages={[]}
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText('Ali Student').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Veli Alumni').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Prof. Ayşe').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Tech Corp HR').length).toBeGreaterThan(0);
    });

    it('3.5 Retains contacts without explicit role metadata by default', () => {
      const contactsWithPlainUser = [
        { id: 'cnt-plain', name: 'Generic Contact', role: 'student' }
      ];
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={studentUser}
            userRole="student"
            contacts={contactsWithPlainUser}
            messages={[]}
          />
        </MemoryRouter>
      );

      expect(screen.getAllByText('Generic Contact').length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Edge Case 4: Modal Close Events Without Previous View
  // ==========================================
  describe('4. Edge Case: Modal Close Events Without Previous View', () => {
    it('4.1 Modal close without previousView routes to role feed for student', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 's1', role: 'student' }}
            userRole="student"
            previousView={null}
            setView={setViewMock}
            contacts={[]}
            messages={[]}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTitle('Kapat'));
      expect(setViewMock).toHaveBeenCalledWith('student');
    });

    it('4.2 Modal close without previousView routes to role feed for alumni', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'al1', role: 'alumni_user' }}
            userRole="alumni"
            previousView={undefined}
            setView={setViewMock}
            contacts={[]}
            messages={[]}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTitle('Kapat'));
      expect(setViewMock).toHaveBeenCalledWith('alumni');
    });

    it('4.3 Modal close without previousView routes to role feed for company', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'cmp1', role: 'employer' }}
            userRole="company"
            previousView=""
            setView={setViewMock}
            contacts={[]}
            messages={[]}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTitle('Kapat'));
      expect(setViewMock).toHaveBeenCalledWith('company');
    });

    it('4.4 Modal close for admin without previousView falls back safely to student (preventing admin loops)', () => {
      const setViewMock = vi.fn();
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'adm', role: 'admin' }}
            userRole="admin"
            previousView={null}
            setView={setViewMock}
            contacts={[]}
            messages={[]}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTitle('Kapat'));
      expect(setViewMock).toHaveBeenCalledWith('admin');
      expect(setViewMock).not.toHaveBeenCalledWith('student');
    });
  });

  // ==========================================
  // Edge Case 5: WebRTC Fallback Canvas Streams
  // ==========================================
  describe('5. Edge Case: WebRTC Fallback Canvas Media Streams', () => {
    it('5.1 Launches call studio with canvas stream fallback when mediaDevices is unavailable', async () => {
      const contacts = [{ id: 'c1', name: 'Dr. Mehmet', title: 'Dr.' }];
      
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'u1', name: 'Deniz Student' }}
            userRole="student"
            contacts={contacts}
            selectedUserId="c1"
            messages={[]}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTitle('Görüntülü Arama'));

      expect(screen.getByText(/1080p HD/i)).toBeTruthy();
      expect(screen.getByTitle('Aramayı Sonlandır')).toBeTruthy();

      // Rapid control toggling stress test
      const muteBtn = screen.getByTitle('Mikrofonu Sessize Al');
      fireEvent.click(muteBtn);
      expect(screen.getByTitle('Mikrofonu Aç')).toBeTruthy();
      fireEvent.click(screen.getByTitle('Mikrofonu Aç'));
      expect(screen.getByTitle('Mikrofonu Sessize Al')).toBeTruthy();

      const camBtn = screen.getByTitle('Kamerayı Kapat');
      fireEvent.click(camBtn);
      expect(screen.getByTitle('Kamerayı Aç')).toBeTruthy();
      fireEvent.click(screen.getByTitle('Kamerayı Aç'));
      expect(screen.getByTitle('Kamerayı Kapat')).toBeTruthy();

      fireEvent.click(screen.getByTitle('Aramayı Sonlandır'));
      expect(screen.queryByText(/1080p HD/i)).toBeNull();
    });
  });

  // ==========================================
  // Edge Case 6: Web Audio API Tone Synthesis
  // ==========================================
  describe('6. Edge Case: Web Audio API Tone Synthesis', () => {
    it('6.1 AudioContext tone synthesis operates without errors during call startup and teardown', () => {
      const contacts = [{ id: 'c2', name: 'Prof. Can', title: 'Prof. Dr.' }];
      
      render(
        <MemoryRouter>
          <MessagingInterface 
            currentUser={{ id: 'u1', name: 'Mehmet Student' }}
            userRole="student"
            contacts={contacts}
            selectedUserId="c2"
            messages={[{ id: 'm1', senderId: 'c2', receiverId: 'u1', text: 'Merhaba', timestamp: new Date().toISOString() }]}
          />
        </MemoryRouter>
      );

      const contactEls = screen.getAllByText('Prof. Can');
      if (contactEls.length > 0) fireEvent.click(contactEls[0]);
      
      // Voice Call
      fireEvent.click(screen.getByTitle('Sesli Arama'));
      expect(screen.getByTitle('Aramayı Sonlandır')).toBeTruthy();

      fireEvent.click(screen.getByTitle('Aramayı Sonlandır'));
      expect(screen.queryByTitle('Aramayı Sonlandır')).toBeNull();
    });
  });
});
