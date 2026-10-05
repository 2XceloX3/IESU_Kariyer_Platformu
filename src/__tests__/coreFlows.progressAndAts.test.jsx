import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { computeCareerProgress } from '../utils/careerProgress';
import useAppStore from '../store/useAppStore';

vi.mock('../utils/firebase', () => ({ auth: { currentUser: { uid: 'co-uid-1' } }, db: {} }));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(),
}));

describe('core flows — progress & ATS scoping', () => {
  beforeEach(() => {
    useAppStore.setState({ applications: [], jobs: [], currentUser: null });
  });

  it('career progress is 40% with profile + one application only', () => {
    const r = computeCareerProgress({
      user: { id: 'stu-1', name: 'A', department: 'Yazılım', email: 'a@x.com' },
      applications: [{ applicantId: 'stu-1', jobId: 'j1' }],
    });
    expect(r.percent).toBe(40);
    expect(r.signals.cvSaved).toBe(false);
  });

  it('CompanyATSBoard lists only applications for current company uid', async () => {
    const CompanyATSBoard = (await import('../components/CompanyATSBoard')).default;
    useAppStore.setState({
      applications: [
        { id: 'a1', companyId: 'co-uid-1', applicantName: 'Mine', jobTitle: 'Staj', status: 'Beklemede', applicantDept: 'Yazılım' },
        { id: 'a2', companyId: 'other-co', applicantName: 'Ali', jobTitle: 'Staj', status: 'Beklemede', applicantDept: 'İşletme' },
      ],
    });
    render(
      <CompanyATSBoard
        currentUser={{ id: 'co-uid-1', name: 'Firma A', role: 'company' }}
        userRole="company"
        setView={vi.fn()}
      />
    );
    expect(screen.getByText('Mine')).toBeInTheDocument();
    expect(screen.queryByText('Ali')).not.toBeInTheDocument();
  });
});

describe('Jobs post-apply CV link', () => {
  it('exposes CV builder link for students on jobs page', async () => {
    const JobsAndInternships = (await import('../components/JobsAndInternships')).default;
    useAppStore.setState({
      applications: [],
      jobs: [{ id: 'JOB-1', title: 'Staj', company: 'X', companyId: 'co1', status: 'Aktif' }],
      currentUser: { id: 'stu-9', name: 'Ogrenci', role: 'student', department: 'Yazılım' },
    });
    render(
      <JobsAndInternships
        userRole="student"
        currentUser={{ id: 'stu-9', name: 'Ogrenci', role: 'student', department: 'Yazılım' }}
        setView={vi.fn()}
      />
    );
    expect(screen.getByTestId('jobs-cvbuilder-link')).toBeInTheDocument();
  });
});
