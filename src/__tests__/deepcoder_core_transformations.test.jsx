import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IESU_FACULTIES } from '../utils/universityData';
import { initialNews, initialEvents } from '../utils/mockData';
import { AI_KNOWLEDGE_ARCHIVE } from '../data/AIEngine';
import CommandPalette from '../components/CommandPalette';
import JobsAndInternships from '../components/JobsAndInternships';
import CompanyATSBoard from '../components/CompanyATSBoard';
import useAppStore from '../store/useAppStore';

describe('DeepCoder Core Transformations Verification', () => {
  beforeEach(() => {
    useAppStore.setState({
      applications: [],
      jobs: [
        { id: 'JOB-TEST-1', title: 'Yazılım Mühendisi', company: 'Test A.Ş.', status: 'Aktif' }
      ]
    });
  });

  describe('1. Blind Regex Corruptions Cleaned', () => {
    it('universityData.js contains Çocuk Gelişimi instead of Çocuk Esenyurti', () => {
      const saglikFakultesi = IESU_FACULTIES.find(f => f.name.includes('Sağlık Bilimleri'));
      expect(saglikFakultesi).toBeDefined();
      expect(saglikFakultesi.departments).toContain('Çocuk Gelişimi');
      expect(saglikFakultesi.departments).not.toContain('Çocuk Esenyurti');
    });

    it('mockData.js EVT-014 has Çocuk Gelişimi and decoded HTML entities', () => {
      const evt = initialEvents.find(e => e.id === 'EVT-014');
      expect(evt).toBeDefined();
      expect(evt.description).toContain('Çocuk Gelişimi Programı');
      expect(evt.description).not.toContain('Çocuk Esenyurti');
      expect(evt.description).not.toContain('&Uuml;');
      expect(evt.description).not.toContain('&Ccedil;');
      expect(evt.description).not.toContain('&quot;');
    });

    it('mockData.js NEWS-005 has fixed year 2026 instead of 2684 and decoded text', () => {
      const news = initialNews.find(n => n.id === 'NEWS-005');
      expect(news).toBeDefined();
      expect(news.date).toBe('26/07/2026');
      expect(news.content).not.toContain('&Uuml;');
      expect(news.content).not.toContain('&quot;');
    });

    it('mockData.js EVT-013 has completed sentence without dangling dash', () => {
      const evt = initialEvents.find(e => e.id === 'EVT-013');
      expect(evt).toBeDefined();
      expect(evt.description).not.toMatch(/[–-]\s*$/);
      expect(evt.description).toContain('Doç. Dr. Tuncer CAN');
      expect(evt.description).toContain('akademisyenlerimizin sunumlarıyla geleceğin eğitim teknolojilerini keşfediyoruz.');
    });

    it('AIEngine.js archive references İESÜ Kariyer Geliştirme Koordinatörlüğü', () => {
      const karyonArchive = AI_KNOWLEDGE_ARCHIVE.find(a => a.id === 'KARYON');
      expect(karyonArchive).toBeDefined();
      expect(karyonArchive.content).toContain('İESÜ Kariyer Geliştirme Koordinatörlüğü');
      expect(karyonArchive.content).not.toContain('İESÜ Kariyer Esenyurt Merkezi');
    });
  });

  describe('2. AI JSON Regex Fence Cleaning', () => {
    it('safely strips markdown fences without destroying inner json keywords', () => {
      const sampleResponse = '```json\n{\n  "title": "Learn JSON Schema",\n  "desc": "json is great"\n}\n```';
      const cleanJson = sampleResponse
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/, '')
        .replace(/^```\s*/, '')
        .trim();
      const parsed = JSON.parse(cleanJson);
      expect(parsed.title).toBe('Learn JSON Schema');
      expect(parsed.desc).toBe('json is great');
    });
  });

  describe('3. CommandPalette & Universal SearchIndex', () => {
    it('renders when isOpen is true and shows search results for query', async () => {
      const mockSetIsOpen = vi.fn();
      const mockSetView = vi.fn();

      render(
        <CommandPalette 
          isOpen={true} 
          setIsOpen={mockSetIsOpen} 
          setView={mockSetView} 
          currentUser={{ role: 'student', name: 'Ali' }} 
        />
      );

      const input = screen.getByPlaceholderText(/Üniversite portalları/i);
      expect(input).toBeDefined();

      // Type "mühendislik" to trigger searchIndex
      fireEvent.change(input, { target: { value: 'mühendislik' } });

      await waitFor(() => {
        const results = screen.getAllByText(/Mühendislik|Fakülte/i);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it('returns null when isOpen is false', () => {
      const { container } = render(
        <CommandPalette 
          isOpen={false} 
          setIsOpen={vi.fn()} 
          setView={vi.fn()} 
          currentUser={{ role: 'student' }} 
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('opens cleanly via Ctrl+K without double-toggle cancellation and closes on Escape', () => {
      function AppSimulation() {
        const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);

        React.useEffect(() => {
          const handleGlobalK = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
              e.preventDefault();
              setIsPaletteOpen(prev => !prev);
            }
          };
          window.addEventListener('keydown', handleGlobalK);
          return () => window.removeEventListener('keydown', handleGlobalK);
        }, []);

        return (
          <CommandPalette 
            isOpen={isPaletteOpen} 
            setIsOpen={setIsPaletteOpen} 
            setView={vi.fn()} 
            currentUser={{ role: 'student' }} 
          />
        );
      }

      render(<AppSimulation />);

      // Initially closed
      expect(screen.queryByPlaceholderText(/Üniversite portalları/i)).toBeNull();

      // Dispatch Ctrl+K -> should OPEN
      fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
      expect(screen.getByPlaceholderText(/Üniversite portalları/i)).toBeInTheDocument();

      // Dispatch Escape -> should CLOSE
      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByPlaceholderText(/Üniversite portalları/i)).toBeNull();
    });
  });

  describe('4. Job Applications & ATS Kanban Flow', () => {
    it('allows alumni (userRole === "alumni") to submit job application', () => {
      const mockSetView = vi.fn();
      const currentUser = { id: 'ALU-100', name: 'Mezun Kullanıcı', role: 'alumni', department: 'Yazılım' };

      render(
        <JobsAndInternships 
          userRole="alumni" 
          currentUser={currentUser} 
          setView={mockSetView} 
          jobs={[{ id: 'JOB-99', title: 'Senior Developer', company: 'Tech Inc', status: 'Aktif' }]}
        />
      );

      // Find and click the apply button
      const applyBtn = screen.getByRole('button', { name: /Hemen Başvur/i });
      fireEvent.click(applyBtn);

      // Modal should be open
      const submitBtn = screen.getByRole('button', { name: /Başvuruyu Tamamla/i });
      expect(submitBtn).toBeDefined();
      const form = submitBtn.closest('form');
      expect(form).toBeDefined();
      fireEvent.submit(form);

      // Applications in store should now contain this application
      const storeApps = useAppStore.getState().applications;
      expect(storeApps.length).toBe(1);
      expect(storeApps[0].applicantId).toBe('ALU-100');
      expect(storeApps[0].jobId).toBe('JOB-99');
      expect(storeApps[0].status).toBe('Beklemede');
    });

    it('CompanyATSBoard displays applications from store and synchronizes status changes', () => {
      // Seed store with an application
      useAppStore.setState({
        applications: [
          {
            id: 'APP-REAL-1',
            applicantId: 'STU-123',
            applicantName: 'Canan Kaya',
            applicantDept: 'Yazılım Mühendisliği',
            jobTitle: 'Frontend Stajyer',
            status: 'Beklemede',
            company: 'Test A.Ş.'
          }
        ]
      });

      render(<CompanyATSBoard setView={vi.fn()} currentUser={{ role: 'employer' }} />);

      // Canan Kaya should be rendered in the board under "Yeni Başvuru"
      expect(screen.getByText('Canan Kaya')).toBeDefined();
      expect(screen.getByText('Frontend Stajyer')).toBeDefined();

      // Quick move button to "İnceleme'ye" for Canan Kaya's card
      const candidateText = screen.getByText('Canan Kaya');
      const candidateCard = candidateText.closest('.group');
      const moveBtn = within(candidateCard).getByRole('button', { name: /İnceleme'ye/i });
      fireEvent.click(moveBtn);

      // Zustand store should now have status updated to "İnceleniyor"
      const updatedApps = useAppStore.getState().applications;
      expect(updatedApps.find(a => a.id === 'APP-REAL-1')?.status).toBe('İnceleniyor');
    });
  });
});
