import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostCard from '../components/PostCard';
import UserProfile from '../components/UserProfile';
import PublicUserProfile from '../components/PublicUserProfile';
import Login from '../components/Login';
import useAppStore from '../store/useAppStore';
import { 
  verifyStudentObsRecord, 
  generateOfficialKgbDocument, 
  OBS_VERIFICATION_STATUS 
} from '../services/obsVerificationWorkflow';

vi.mock('../utils/firebase', () => ({ auth: {}, db: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(),
}));

describe('Security Remediation & IDOR Hardening Audit Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('1. PostCard IDOR & Comment Deletion Guard', () => {
    it('denies edit and delete controls to a user with the same name but different authorId', () => {
      const mockPost = {
        id: 'post-sec-1',
        authorId: 'victim-user-123',
        author: { id: 'victim-user-123', name: 'Alperen Yılmaz', role: 'student' },
        content: 'Hedef kullanıcının orijinal paylaşımı.',
        time: '10 dk önce',
        likes: 0,
        comments: 0
      };

      // Attacker has identical name 'Alperen Yılmaz' but attacker ID 'attacker-999'
      const attackerUser = {
        id: 'attacker-999',
        name: 'Alperen Yılmaz',
        role: 'student'
      };

      render(
        <PostCard 
          post={mockPost} 
          currentUser={attackerUser} 
          setPosts={vi.fn()} 
        />
      );

      // Open menu
      const menuBtn = screen.getByLabelText('Menüyü Aç');
      fireEvent.click(menuBtn);

      // Should not see Edit or Delete buttons
      expect(screen.queryByLabelText('Düzenle')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Sil')).not.toBeInTheDocument();
    });

    it('grants edit and delete controls to the authentic author with matching authorId', () => {
      const mockPost = {
        id: 'post-sec-2',
        authorId: 'legit-author-456',
        author: { id: 'legit-author-456', name: 'Zeynep Akın', role: 'student' },
        content: 'Yazarın kendi gönderisi.',
        time: '5 dk önce',
        likes: 2,
        comments: 0
      };

      const legitUser = {
        id: 'legit-author-456',
        name: 'Zeynep Akın',
        role: 'student'
      };

      render(
        <PostCard 
          post={mockPost} 
          currentUser={legitUser} 
          setPosts={vi.fn()} 
        />
      );

      const menuBtn = screen.getByLabelText('Menüyü Aç');
      fireEvent.click(menuBtn);

      expect(screen.getByLabelText('Düzenle')).toBeInTheDocument();
      expect(screen.getByLabelText('Sil')).toBeInTheDocument();
    });

    it('denies comment deletion to unauthorized third-party users even if name matches', () => {
      const mockPost = {
        id: 'post-sec-3',
        authorId: 'post-owner-001',
        author: { id: 'post-owner-001', name: 'Post Sahibi' },
        content: 'Gönderi içeriği',
        time: '1 saat önce',
        likes: 0,
        comments: 1,
        commentsList: [
          {
            id: 'comment-101',
            authorId: 'comment-owner-002',
            author: 'Yorum Sahibi',
            text: 'Bu bir yorumdur.',
            time: '30 dk önce'
          }
        ]
      };

      const thirdPartyUser = {
        id: 'unauthorized-intruder-003',
        name: 'Yorum Sahibi', // Name spoofing attempt
        role: 'student'
      };

      render(
        <PostCard 
          post={mockPost} 
          currentUser={thirdPartyUser} 
          setPosts={vi.fn()} 
        />
      );

      // Open comments section
      const commentsToggleBtn = screen.getByLabelText('Yorumları Aç');
      fireEvent.click(commentsToggleBtn);

      // Comment text is visible
      expect(screen.getByText('Bu bir yorumdur.')).toBeInTheDocument();

      // Delete button for comment should NOT be rendered for unauthorized intruder
      expect(screen.queryByTitle('Yorumu Sil')).not.toBeInTheDocument();
    });

    it('permits comment deletion to the comment author', () => {
      const mockPost = {
        id: 'post-sec-4',
        authorId: 'post-owner-001',
        author: { id: 'post-owner-001', name: 'Post Sahibi' },
        content: 'Gönderi içeriği',
        time: '1 saat önce',
        likes: 0,
        comments: 1,
        commentsList: [
          {
            id: 'comment-102',
            authorId: 'comment-owner-002',
            author: 'Yorum Sahibi',
            text: 'Kendi yorumum.',
            time: '20 dk önce'
          }
        ]
      };

      const commentOwner = {
        id: 'comment-owner-002',
        name: 'Yorum Sahibi',
        role: 'student'
      };

      render(
        <PostCard 
          post={mockPost} 
          currentUser={commentOwner} 
          setPosts={vi.fn()} 
        />
      );

      const commentsToggleBtn = screen.getByLabelText('Yorumları Aç');
      fireEvent.click(commentsToggleBtn);

      expect(screen.getByTitle('Yorumu Sil')).toBeInTheDocument();
    });
  });

  describe('2. UserProfile IDOR & Impersonation Prevention', () => {
    it('does NOT grant self/editing privileges when viewing another profile with identical name', async () => {
      const victimStudent = {
        id: 'STU-VICTIM-1',
        name: 'Alperen Yılmaz',
        role: 'student',
        department: 'Bilgisayar Mühendisliği',
        gpa: '3.80'
      };

      // Attacker has identical name 'Alperen Yılmaz' but different ID
      const attackerStudent = {
        id: 'STU-ATTACKER-2',
        name: 'Alperen Yılmaz',
        role: 'student'
      };

      useAppStore.setState({
        students: [victimStudent],
        currentUser: attackerStudent,
        userRole: 'student'
      });

      render(
        <UserProfile 
          userId="STU-VICTIM-1" 
          currentUser={attackerStudent} 
          setView={vi.fn()} 
          viewerHive="student"
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Alperen Yılmaz').length).toBeGreaterThan(0);
      });

      // Self-only action buttons like "Profili Düzenle", "Fotoğrafı Değiştir", "CV Güncelle" must NOT be rendered
      expect(screen.queryByRole('button', { name: /profili düzenle/i })).not.toBeInTheDocument();
      expect(screen.queryByTitle(/fotoğraf yükle/i)).not.toBeInTheDocument();
    });

    it('does NOT grant self privileges via generic fallback IDs (ALU-001, ACAD-001, CMP-001)', async () => {
      const regularStudent = {
        id: 'STU-REGULAR-9',
        name: 'Normal Öğrenci',
        role: 'student'
      };

      useAppStore.setState({
        currentUser: regularStudent,
        userRole: 'student'
      });

      render(
        <PublicUserProfile 
          userId="ALU-001" 
          currentUser={regularStudent} 
          viewerHive="student"
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Caner Öztürk/i)).toBeInTheDocument();
      });

      // Must NOT be treated as self
      expect(screen.queryByRole('button', { name: /profili düzenle/i })).not.toBeInTheDocument();
    });
  });

  describe('3. OBS Dynamic GPA & Accredited Seal Security', () => {
    it('flags unverified student dynamic input as UNVERIFIED_PENDING_REGISTRAR and denies official verified seal', () => {
      const unverifiedInput = {
        studentNo: '2025999999', // Not in registrar whitelist
        name: 'Sahte Notlu Öğrenci',
        gano: 3.99,
        gpa: 3.99
      };

      const verificationResult = verifyStudentObsRecord(unverifiedInput, { allowDynamicVerification: true });

      expect(verificationResult.verified).toBe(false);
      expect(verificationResult.status).toBe(OBS_VERIFICATION_STATUS.UNVERIFIED_PENDING_REGISTRAR);
      expect(verificationResult.verificationCode).toBeNull();
      expect(verificationResult.badge).toBeNull();
      expect(verificationResult.discrepancy.detected).toBe(true);
    });

    it('generates a draft document without official rectorate seals or QR SVG for unverified students', () => {
      const unverifiedStudent = {
        studentNo: '9998887771',
        name: 'Kayıtsız Aday',
        gano: 3.95
      };

      const doc = generateOfficialKgbDocument(unverifiedStudent);

      expect(doc.verification.isOfficial).toBe(false);
      expect(doc.verification.isDraft).toBe(true);
      expect(doc.verification.qrSvg).toBeNull();
      expect(doc.rectorateTitle).toBeNull();
      expect(doc.sealText).toMatch(/TASLAK BELGE/i);
      expect(doc.verification.signatures.rectorate.signed).toBe(false);
    });
  });

});
