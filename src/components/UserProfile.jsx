import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Mail, MessageSquare, ExternalLink, Calendar, Star, Building2, UserCircle2, Award, FileText, CheckCircle2, BookOpen, UserPlus, UserCheck, Users, ShieldCheck, Camera, Home, Compass, Bell, Search, MessageCircle, X, Heart, Crown, Activity, Globe, Volume2, PlayCircle, Sparkles, Settings, Clock, Tag, Tent, Flag, Plus, ChevronRight, BarChart2, Link2, Link, Radar, Target, LayoutDashboard, Download, Zap } from 'lucide-react';
import Logo from './Logo';
import { Badge } from './admin/AdminCMSLayout';
import PostCard from './PostCard';
import TopProfileMenu from './TopProfileMenu';
import { combineFeedItems } from '../utils/feedCombiner';
import NavIcon from './shared/NavIcon';
import useAppStore from '../store/useAppStore';
import SafeAvatar from './shared/SafeAvatar';
import AdminOmniDock from './AdminOmniDock';

export default function UserProfile({ userId, setView, setSelectedUserId, previousView, currentUser, setDirectMessageUser }) {
  const userRole = useAppStore(state => state.userRole);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const unlockedBadges = useAppStore(state => state.unlockedBadges);
  const companies = useAppStore(state => state.companies);
  const academicStaff = useAppStore(state => state.academicStaff);
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const notifications = useAppStore(state => state.notifications);
  const news = useAppStore(state => state.news);
  const events = useAppStore(state => state.events);
  const announcements = useAppStore(state => state.announcements);
  const jobs = useAppStore(state => state.jobs);
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const adminMessages = useAppStore(state => state.adminMessages) || [];

  // Aktif Portal Dalı (Ağacın Dalları) — Component seviyesinde hesaplanır
  const currentBranch = 
    (previousView === 'student' || activePortalBranch === 'student') ? 'student' :
    (previousView === 'alumni' || previousView === 'mbs' || previousView === 'mezun_dernek' || activePortalBranch === 'alumni') ? 'alumni' :
    (previousView === 'academic' || previousView === 'research_hub' || activePortalBranch === 'academic') ? 'academic' :
    (previousView === 'company' || previousView === 'company_ats' || previousView === 'create_job' || activePortalBranch === 'company') ? 'company' :
    (previousView === 'admin' || previousView === 'admin_cms' || previousView === 'yonetim_konsolu' || activePortalBranch === 'admin') ? 'admin' :
    (['academic', 'alumni', 'student', 'company', 'admin'].includes(userRole) ? userRole : 'student');

  // ─── KENDİ PROFİLİM vs ZİYARETÇİ KONTROLÜ (DAL BAZLI İZOLASYON) ───
  const isStudentBranch = currentBranch === 'student';
  const isAlumniBranch = currentBranch === 'alumni';
  const isAcademicBranch = currentBranch === 'academic';
  const isCompanyBranch = currentBranch === 'company';
  const isAdminBranch = currentBranch === 'admin';

  const isProfileSelf = (profileType) => {
    // 1. userId belirtilmediyse veya 'self' ise kullanıcının kendi profilidir
    if (!userId || userId === 'self') return true;

    // 2. userId oturum açan kullanıcının kendi ID'sine eşitse veya admin ise kendi profilidir
    if (currentUser?.id && (userId === currentUser.id || user?.id === currentUser.id)) {
      if (currentUser?.role === profileType || currentUser?.role === 'admin' || (profileType === 'admin' && isAdminBranch)) return true;
    }

    // 3. İlgili dalın varsayılan ID'si çağrılmışsa VE kullanıcı o daldaysa kendi profilidir:
    if (profileType === 'student' && isStudentBranch) {
      if (userId === 'STU-001' || user?.id === 'STU-001' || userId === 'admin_1513' || user?.id === 'admin_1513' || userId === 'admin') return true;
    }
    if (profileType === 'alumni' && isAlumniBranch) {
      if (userId === 'ALU-001' || userId === 'ALM-001' || user?.id === 'ALU-001' || userId === 'admin_1513' || user?.id === 'admin_1513' || userId === 'admin') return true;
    }
    if (profileType === 'academic' && isAcademicBranch) {
      if (userId === 'ACAD-001' || userId === 'ACD-001' || user?.id === 'ACAD-001' || userId === 'admin_1513' || user?.id === 'admin_1513' || userId === 'admin') return true;
    }
    if (profileType === 'company' && isCompanyBranch) {
      if (userId === 'CMP-001' || user?.id === 'CMP-001' || userId === 'admin_1513' || user?.id === 'admin_1513' || userId === 'admin') return true;
    }
    if (profileType === 'admin' && isAdminBranch) {
      if (userId === 'admin_1513' || userId === 'admin' || user?.id === 'admin_1513') return true;
    }

    // Aksi takdirde (ör. STU-002, ALU-002, ACAD-002 veya farklı bir roldeki kullanıcı) bu bir ZİYARETÇİ profildir!
    return false;
  };

  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('user_profile');
  const [searchQuery, setSearchQuery] = useState('');
  
  const setCompanies = useAppStore(state => state.setCompanies);
  const [followersModal, setFollowersModal] = useState({ isOpen: false, title: '', users: [] });
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('avatar'); // 'avatar' | 'cover'
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Mentörlük & Danışmanlık İsteği Form Modalı
  const [showMentorshipRequestModal, setShowMentorshipRequestModal] = useState(false);
  const [mentorshipReqForm, setMentorshipReqForm] = useState({
    topic: 'Kariyer Yol Haritası & Danışmanlık',
    mode: 'Yüz Yüze Kampüs Görüşmesi',
    platform: 'Yüz Yüze (Akademisyen Ofisi - B Blok 304)',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTimeSlot: '14:00 - 14:30',
    contactEmail: '',
    note: ''
  });

  // Firma ve Akademik Takip Etme State'leri
  const [followedCompanyIds, setFollowedCompanyIds] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_followed_companies_v1');
      return saved ? JSON.parse(saved) : ['CMP-001'];
    } catch(e) {
      return ['CMP-001'];
    }
  });

  const [followedAcademicIds, setFollowedAcademicIds] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_followed_academics_v1');
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });

  const [followedAlumniIds, setFollowedAlumniIds] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_followed_alumni_v1');
      return saved ? JSON.parse(saved) : [];
    } catch(e) {
      return [];
    }
  });

  // Likert Ölçekli Firma Değerlendirme Modalı State
  const [showCompanyReviewModal, setShowCompanyReviewModal] = useState(false);
  const [companyReviewForm, setCompanyReviewForm] = useState({
    rating: 5,
    programType: 'Zorunlu Staj',
    comment: ''
  });

  // Staj Süresi Düzenleme Modalı State
  const [showInternshipDurationEditModal, setShowInternshipDurationEditModal] = useState(false);
  const [tempInternshipDuration, setTempInternshipDuration] = useState('');

  // Akademik Personel Özel Düzenlenebilir Alanlar (Dersler, Yayınlar, Ofis Saatleri)
  const [academicData, setAcademicData] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_academic_info_v1');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      courses: [
        { id: 1, code: 'BM301', name: 'Yapay Zekaya Giriş', type: 'Lisans' },
        { id: 2, code: 'BM402', name: 'Yazılım Mühendisliği Mimarileri', type: 'Lisans' },
        { id: 3, code: 'YL505', name: 'İleri Derin Öğrenme Yöntemleri', type: 'Yüksek Lisans' }
      ],
      publications: [
        { id: 1, title: 'Derin Öğrenme Tabanlı Nesne Tespiti ve Otonom Sistemlerde Kullanımı', journal: 'IEEE Transactions on AI • 2025', badge: 'SCI-E Makale' },
        { id: 2, title: 'Üniversite-Sanayi İş Birliği Modeliyle Akıllı Stajyer Eşleştirme Algoritması', journal: 'TÜBİTAK 1001 Projesi • Yürütücü', badge: 'TÜBİTAK Projesi' }
      ],
      officeHours: {
        email: 'akademisyen@esenyurt.edu.tr',
        location: 'B-Blok Kat: 3 Oda: 304',
        hours: 'Salı & Perşembe 13:00 - 16:00'
      }
    };
  });

  const [showAcademicEditModal, setShowAcademicEditModal] = useState(false);
  const [academicEditTab, setAcademicEditTab] = useState('courses'); // 'courses' | 'publications' | 'office'

  const [newCourseForm, setNewCourseForm] = useState({ code: '', name: '', type: 'Lisans' });
  const [newPubForm, setNewPubForm] = useState({ title: '', journal: '', badge: 'SCI-E Makale' });
  const [officeForm, setOfficeForm] = useState(academicData.officeHours);

  const saveAcademicData = (updatedData) => {
    setAcademicData(updatedData);
    try {
      localStorage.setItem('iesu_academic_info_v1', JSON.stringify(updatedData));
    } catch(e) {}
  };

  const handleSendMentorshipRequest = (e) => {
    e.preventDefault();
    if (!mentorshipReqForm.note.trim()) {
      if (window.toast?.error) {
        window.toast.error("Lütfen mentöre iletmek istediğiniz detaylı talebinizi giriniz.");
      } else {
        alert("Lütfen mentöre iletmek istediğiniz detaylı talebinizi giriniz.");
      }
      return;
    }

    const newReq = {
      id: `DNT-${Date.now().toString().slice(-6)}`,
      studentId: currentUser?.id || 'STU-001',
      studentName: currentUser?.name || 'Öğrenci',
      studentDept: currentUser?.department || 'Yazılım Mühendisliği',
      studentEmail: currentUser?.email || 'ogrenci@esenyurt.edu.tr',
      studentAvatar: currentUser?.avatar || '',
      mentorId: user?.id || 'mnt_demo',
      mentorName: user?.name || 'Prof. Dr. Ahmet Yılmaz',
      mentorTitle: user?.title || 'Bölüm Başkanı',
      advisor: user?.name || 'Prof. Dr. Ahmet Yılmaz',
      topic: mentorshipReqForm.topic,
      subject: mentorshipReqForm.topic,
      mode: mentorshipReqForm.mode,
      platform: mentorshipReqForm.mode === 'Yüz Yüze Kampüs Görüşmesi' 
        ? 'Yüz Yüze (Akademisyen Ofisi - B Blok 304)' 
        : 'Online (Google Meet / Zoom)',
      preferredDate: mentorshipReqForm.preferredDate,
      preferredTimeSlot: mentorshipReqForm.preferredTimeSlot,
      contactEmail: mentorshipReqForm.contactEmail || currentUser?.email || '',
      note: mentorshipReqForm.note,
      details: mentorshipReqForm.note || `${mentorshipReqForm.topic} hakkında resmî danışmanlık ve randevu talebi.`,
      urgency: 'Normal',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Beklemede' // Beklemede, Onaylandı, Tamamlandı, Reddedildi
    };

    // Store LocalStorage + Global State
    try {
      const existing = JSON.parse(localStorage.getItem('iesu_mentorship_requests_v1') || '[]');
      localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify([newReq, ...existing]));
      window.dispatchEvent(new CustomEvent('iesu_counseling_updated', { detail: newReq }));
    } catch (err) {}

    if (window.toast?.success) {
      window.toast.success(`Resmî danışmanlık ve randevu talebiniz ${user?.name || 'Akademisyene'} ve KGM Evrak Havuzuna iletildi.`);
    } else {
      alert(`Resmî danışmanlık ve randevu talebiniz ${user?.name || 'Akademisyene'} ve KGM Evrak Havuzuna iletildi.`);
    }
    setShowMentorshipRequestModal(false);
    setMentorshipReqForm({
      topic: 'Kariyer Yol Haritası & Danışmanlık',
      mode: 'Yüz Yüze Kampüs Görüşmesi',
      platform: 'Yüz Yüze (Akademisyen Ofisi - B Blok 304)',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: '14:00 - 14:30',
      contactEmail: '',
      note: ''
    });
  };

  const renderBadges = (badgeData) => {
    let badges = [];
    if (typeof badgeData === 'string' && badgeData.trim() !== '') badges = [badgeData];
    else if (Array.isArray(badgeData)) badges = badgeData;
    
    if (badges.length === 0) return null;
    return (
      <div className="flex items-center gap-1.5 ml-1">
        {badges.map((badge, idx) => {
          if (badge === 'verified' || badge === 'Doğrulanmış') return <ShieldCheck key={idx} size={20} className="text-red-500" title="Doğrulanmış" />;
          if (badge === 'top_voice' || badge === 'Top Voice') return <Crown key={idx} size={20} className="text-amber-500" title="Top Voice" />;
          if (badge === 'president' || badge === 'Kulüp Başkanı') return <Crown key={idx} size={20} className="text-purple-600" title="Kulüp Başkanı" />;
          if (badge === 'rep' || badge === 'Sınıf Temsilcisi') return <Award key={idx} size={20} className="text-emerald-500" title="Sınıf Temsilcisi" />;
          return <span key={idx} className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase">{badge}</span>;
        })}
      </div>
    );
  };



  useEffect(() => {
    setIsLoading(true);
    let targetUserId = userId;

    // ─── DAL EGEMENLİĞİ & YABANCI ADMIN ID FİLTRESİ ───
    // Eğer öğrenci, mezun, akademik veya firma dalındaysak ama targetUserId 'admin_1513' veya 'admin' geldiyse,
    // o dalın kendi profiline yönlendir! (Süper admin profilinin diğer panelleri yutmasını engeller)
    if ((targetUserId === 'admin_1513' || targetUserId === 'admin') && currentBranch !== 'admin') {
      if (currentBranch === 'student') targetUserId = 'STU-001';
      else if (currentBranch === 'alumni') targetUserId = 'ALU-001';
      else if (currentBranch === 'academic') targetUserId = 'ACAD-001';
      else if (currentBranch === 'company') targetUserId = 'CMP-001';
    }

    // 1. Hedef admin ise (SADECE admin dalındayken veya admin profili istendiğinde)
    if (targetUserId === 'admin_1513' || targetUserId === 'admin') {
      setUser({
        id: 'admin_1513',
        name: (currentUser?.name && currentUser.name !== 'Mezun' && currentUser.name !== 'Öğrenci') ? currentUser.name : 'Kariyer Geliştirme Merkezi',
        role: 'admin',
        title: 'Süper Yönetici & Koordinatör',
        department: 'Kariyer Geliştirme Merkezi (KGM)',
        email: 'kgm@esenyurt.edu.tr',
        avatar: '/iesu-logo.svg',
        badges: ['verified', 'top_voice']
      });
      setUserType('admin');
      setIsLoading(false);
      return;
    }

    // 2. Özel ID Tanımlayıcıları (STU-, ALU-, ACAD-, CMP-)
    if (typeof targetUserId === 'string') {
      if (targetUserId.startsWith('STU-')) {
        let found = (students || []).find(s => s.id === targetUserId);
        const isSelfStudent = isStudentBranch && (
          targetUserId === 'STU-001' || 
          targetUserId === currentUser?.id || 
          targetUserId === 'admin_1513' || 
          targetUserId === 'admin' ||
          !targetUserId
        );
        const studentData = isSelfStudent ? {
          id: currentUser?.id || targetUserId || 'STU-001',
          name: currentUser?.name || found?.name || 'Alperen Yılmaz',
          role: 'student',
          department: currentUser?.department || found?.department || 'Yazılım Mühendisliği',
          grade: currentUser?.grade || currentUser?.year || found?.grade || found?.year || '3. Sınıf',
          gpa: currentUser?.gpa || found?.gpa || '3.84',
          avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : (found?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150')),
          email: currentUser?.email || found?.email || 'ogrenci@esenyurt.edu.tr',
          badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : (found?.badges || ['verified']))
        } : (found || {
          id: targetUserId || 'STU-001',
          name: 'Alperen Yılmaz',
          role: 'student',
          department: 'Yazılım Mühendisliği',
          grade: '3. Sınıf',
          gpa: '3.84',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          email: 'ogrenci@esenyurt.edu.tr',
          badges: ['verified']
        });
        setUser(studentData);
        setUserType('student');
        setIsLoading(false);
        return;
      }

      if (targetUserId.startsWith('ALU-') || targetUserId.startsWith('ALM-')) {
        let found = (alumni || []).find(a => a.id === targetUserId);
        const isSelfAlumni = isAlumniBranch && (
          targetUserId === 'ALU-001' || 
          targetUserId === 'ALM-001' || 
          targetUserId === currentUser?.id || 
          targetUserId === 'admin_1513' || 
          targetUserId === 'admin' ||
          !targetUserId
        );
        const alumniData = isSelfAlumni ? {
          id: currentUser?.id || targetUserId || 'ALU-001',
          name: currentUser?.name || found?.name || 'Caner Öztürk',
          role: 'alumni',
          department: currentUser?.department || found?.department || 'Yazılım Mühendisliği',
          graduationYear: currentUser?.graduationYear || currentUser?.gradYear || found?.graduationYear || found?.gradYear || '2023',
          gradYear: currentUser?.graduationYear || currentUser?.gradYear || found?.graduationYear || found?.gradYear || '2023',
          title: currentUser?.title || found?.title || 'Frontend Developer',
          company: currentUser?.company || (currentUser?.role === 'admin' ? 'İESÜ Kariyer Geliştirme Merkezi' : (found?.company || 'Trendyol')),
          avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : (found?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')),
          email: currentUser?.email || found?.email || 'caner@mezun.esenyurt.edu.tr',
          badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : (found?.badges || ['verified']))
        } : (found || {
          id: targetUserId || 'ALU-001',
          name: 'Caner Öztürk',
          role: 'alumni',
          department: 'Yazılım Mühendisliği',
          graduationYear: '2023',
          gradYear: '2023',
          title: 'Frontend Developer',
          company: 'Trendyol',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          email: 'caner@mezun.esenyurt.edu.tr',
          badges: ['verified']
        });
        setUser(alumniData);
        setUserType('alumni');
        setIsLoading(false);
        return;
      }

      if (targetUserId.startsWith('ACAD-') || targetUserId.startsWith('ACD-')) {
        let found = (academicStaff || []).find(a => a.id === targetUserId);
        const isSelfAcademic = isAcademicBranch && (
          targetUserId === 'ACAD-001' || 
          targetUserId === 'ACD-001' || 
          targetUserId === currentUser?.id || 
          targetUserId === 'admin_1513' || 
          targetUserId === 'admin' ||
          !targetUserId
        );
        const academicData = isSelfAcademic ? {
          id: currentUser?.id || targetUserId || 'ACAD-001',
          name: currentUser?.name || found?.name || 'Prof. Dr. Ahmet Yılmaz',
          role: 'academic',
          title: currentUser?.title || found?.title || 'Bölüm Başkanı & Profesör',
          department: currentUser?.department || (currentUser?.role === 'admin' ? 'Kariyer Geliştirme Merkezi (KGM)' : (found?.department || 'Bilgisayar Mühendisliği')),
          email: currentUser?.email || found?.email || 'ahmet.yilmaz@esenyurt.edu.tr',
          avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : (found?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150')),
          badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : (found?.badges || ['verified']))
        } : (found || {
          id: targetUserId || 'ACAD-001',
          name: 'Prof. Dr. Ahmet Yılmaz',
          role: 'academic',
          title: 'Bölüm Başkanı & Profesör',
          department: 'Bilgisayar Mühendisliği',
          email: 'ahmet.yilmaz@esenyurt.edu.tr',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          badges: ['verified']
        });
        setUser(academicData);
        setUserType('academic');
        setIsLoading(false);
        return;
      }

      if (targetUserId.startsWith('CMP-') || targetUserId === 'trendyol') {
        let found = (companies || []).find(c => c.id === targetUserId || (typeof c.name === 'string' && c.name.toLowerCase().includes('trendyol')));
        const isSelfCompany = isCompanyBranch && (
          targetUserId === 'CMP-001' || 
          targetUserId === currentUser?.id || 
          targetUserId === 'admin_1513' || 
          targetUserId === 'admin' ||
          !targetUserId
        );
        const companyData = isSelfCompany ? {
          id: currentUser?.id || targetUserId || 'CMP-001',
          name: currentUser?.name || found?.name || 'Trendyol',
          role: 'company',
          sector: currentUser?.sector || (currentUser?.role === 'admin' ? 'Kurumsal Yönetim & Kariyer Koordinasyonu' : (found?.sector || 'E-Ticaret & Teknoloji Ortaklığı')),
          location: currentUser?.location || found?.location || 'İstanbul Maslak Kampüsü',
          foundingYear: found?.foundingYear || '2010',
          description: currentUser?.description || found?.description || 'Türkiye\'nin önde gelen e-ticaret ve teknoloji ekosistemi. İESÜ Kariyer Geliştirme Merkezi akredite sanayi ve staj partneri.',
          alumniCount: found?.alumniCount || '42',
          hiringConversion: found?.hiringConversion || '%84',
          internshipDuration: found?.internshipDuration || '20 İş Günü (1 Ay)',
          avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : (found?.avatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150')),
          badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : (found?.badges || ['verified']))
        } : (found || {
          id: 'CMP-001',
          name: 'Trendyol',
          sector: 'E-Ticaret & Teknoloji Ortaklığı',
          location: 'İstanbul Maslak Kampüsü',
          foundingYear: '2010',
          description: 'Türkiye\'nin önde gelen e-ticaret ve teknoloji ekosistemi. İESÜ Kariyer Geliştirme Merkezi akredite sanayi ve staj partneri.',
          alumniCount: '42',
          hiringConversion: '%84',
          internshipDuration: '20 İş Günü (1 Ay)',
          avatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
          role: 'company'
        });
        setUser(companyData);
        setUserType('company');
        setIsLoading(false);
        return;
      }
    }

    // 3. Koleksiyonlarda Arama (Eğer başka bir spesifik kullanıcı aranıyorsa)
    if (targetUserId && targetUserId !== currentUser?.id && targetUserId !== 'admin_1513') {
      let found = (companies || []).find(c => c.id === targetUserId || c.id === parseInt(targetUserId));
      if (found) { setUser(found); setUserType('company'); setIsLoading(false); return; }

      found = (academicStaff || []).find(a => a.id === targetUserId || a.id === parseInt(targetUserId));
      if (found) { setUser(found); setUserType('academic'); setIsLoading(false); return; }

      found = (alumni || []).find(a => a.id === targetUserId || a.id === parseInt(targetUserId));
      if (found) { setUser(found); setUserType('alumni'); setIsLoading(false); return; }

      found = (students || []).find(s => s.id === targetUserId || s.id === parseInt(targetUserId));
      if (found) { setUser(found); setUserType('student'); setIsLoading(false); return; }
    }

    // 4. KENDİ PROFİLİM (SELF PROFILE) — HANGİ DALIN İÇİNDEYSEK O DALIN KENDİNE HAS PROFİLİ AÇILIR!
    if (currentBranch === 'alumni') {
      const aluData = {
        id: currentUser?.id || 'ALU-001',
        name: currentUser?.name || 'Caner Öztürk',
        role: 'alumni',
        department: currentUser?.department || 'Yazılım Mühendisliği',
        graduationYear: currentUser?.graduationYear || currentUser?.gradYear || '2023',
        gradYear: currentUser?.graduationYear || currentUser?.gradYear || '2023',
        title: currentUser?.title || 'Frontend Developer',
        company: currentUser?.company || (currentUser?.role === 'admin' ? 'İESÜ Kariyer Geliştirme Merkezi' : 'Trendyol'),
        avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        email: currentUser?.email || 'caner@mezun.esenyurt.edu.tr',
        badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : ['verified'])
      };
      setUser(aluData);
      setUserType('alumni');
      setIsLoading(false);
      return;
    }

    if (currentBranch === 'academic') {
      const acadData = {
        id: currentUser?.id || 'ACAD-001',
        name: currentUser?.name || 'Prof. Dr. Ahmet Yılmaz',
        role: 'academic',
        title: currentUser?.title || 'Bölüm Başkanı & Profesör',
        department: currentUser?.department || (currentUser?.role === 'admin' ? 'Kariyer Geliştirme Merkezi (KGM)' : 'Bilgisayar Mühendisliği'),
        email: currentUser?.email || 'ahmet.yilmaz@esenyurt.edu.tr',
        avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
        badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : ['verified'])
      };
      setUser(acadData);
      setUserType('academic');
      setIsLoading(false);
      return;
    }

    if (currentBranch === 'company') {
      const compData = {
        id: currentUser?.id || 'CMP-001',
        name: currentUser?.name || 'Trendyol',
        role: 'company',
        sector: currentUser?.sector || (currentUser?.role === 'admin' ? 'Kurumsal Yönetim & Kariyer Koordinasyonu' : 'E-Ticaret & Teknoloji Ortaklığı'),
        location: 'İstanbul Maslak Kampüsü',
        foundingYear: '2010',
        description: 'Türkiye\'nin önde gelen e-ticaret ve teknoloji ekosistemi. İESÜ Kariyer Geliştirme Merkezi akredite sanayi ve staj partneri.',
        alumniCount: '42',
        hiringConversion: '%84',
        internshipDuration: '20 İş Günü (1 Ay)',
        avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150'),
        badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : ['verified'])
      };
      setUser(compData);
      setUserType('company');
      setIsLoading(false);
      return;
    }

    if (currentBranch === 'admin') {
      setUser({
        id: currentUser?.id || 'admin_1513',
        name: (currentUser?.name && currentUser.name !== 'Mezun' && currentUser.name !== 'Öğrenci') ? currentUser.name : 'Kariyer Geliştirme Merkezi',
        role: 'admin',
        title: 'Süper Yönetici & Koordinatör',
        department: 'Kariyer Geliştirme Merkezi (KGM)',
        email: currentUser?.email || 'kgm@esenyurt.edu.tr',
        avatar: currentUser?.avatar || '/iesu-logo.svg',
        badges: currentUser?.badges || ['verified', 'top_voice']
      });
      setUserType('admin');
      setIsLoading(false);
      return;
    }

    // Varsayılan Dal: Öğrenci Portalı (Student)
    const stuData = {
      id: currentUser?.id || 'STU-001',
      name: currentUser?.name || 'Alperen Yılmaz',
      role: 'student',
      department: currentUser?.department || 'Yazılım Mühendisliği',
      grade: currentUser?.grade || currentUser?.year || '3. Sınıf',
      gpa: currentUser?.gpa || '3.84',
      avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
      email: currentUser?.email || 'ogrenci@esenyurt.edu.tr',
      badges: currentUser?.badges || (currentUser?.role === 'admin' ? ['verified', 'top_voice'] : ['verified'])
    };
    setUser(stuData);
    setUserType('student');
    setIsLoading(false);
  }, [userId, students, alumni, companies, academicStaff, currentUser, userRole, activePortalBranch, previousView]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-iesu-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
          <UserCircle2 size={40} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
        <p className="text-gray-500 mb-6">Aradığınız profil silinmiş veya mevcut olmayabilir.</p>
        <button onClick={() => setView(userRole === 'admin' ? 'admin' : (previousView === 'user_profile' ? (userRole || 'landing') : (previousView || 'landing')))} className="flex items-center gap-2 bg-[#990000] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-700 transition">
          <ArrowLeft size={18} /> Geri Dön
        </button>
      </div>
    );
  }

  const handleMessage = () => {
    if (setDirectMessageUser) {
      setDirectMessageUser(user.id);
    }
    setView('messaging');
  };

  const isMessageAllowed = (() => {
    if (userRole === 'admin') return true;
    if (!userType || !userRole) return false;
    if ((userRole === 'student' || userRole === 'alumni') && (userType === 'student' || userType === 'alumni' || userType === 'academic')) return true;
    if (userRole === 'academic' && (userType === 'company' || userType === 'student' || userType === 'alumni')) return true;
    if (userRole === 'company' && userType === 'academic') return true;
    return false;
  })();

  const renderStudentProfile = () => {
    // Ziyaretçi/Kendi profil kontrolü: dal bazlı isProfileSelf kullanılır
    const isSelf = isProfileSelf('student');
    const coverSrc = user?.coverImage || user?.cover;
    const studentFollowedCompanies = (companies || []).filter(c => followedCompanyIds.includes(c.id || 'CMP-001')).slice(0, 5);

    return (
      <div className="space-y-6">

        {/* ─── HERO BANNER & PROFILE CARD ─── */}
        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Cover */}
          <div className="h-44 sm:h-60 bg-gradient-to-r from-[#8F0808] via-gray-900 to-[#163B65] relative overflow-hidden group">
            {coverSrc && (
              <img src={coverSrc} alt="Cover Background" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Kapak Değiştir */}
            {isSelf && (
              <button
                onClick={() => {
                  setUploadType('cover');
                  setCustomImageUrl(coverSrc || '');
                  setShowImageUploadModal(true);
                }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 border border-white/20 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer z-10"
              >
                <Camera size={14} /> Kapak Değiştir
              </button>
            )}
          </div>

          {/* Profile Header Info */}
          <div className="px-6 sm:px-8 pb-8 relative">
            <div className="-mt-16 sm:-mt-20 mb-4 flex justify-between items-end">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-white bg-white shadow-2xl overflow-hidden flex items-center justify-center p-1.5 relative group">
                <SafeAvatar
                  src={user?.avatar}
                  name={user?.name || 'Öğrenci'}
                  size="full"
                  alt={user?.name || 'Profil fotoğrafı'}
                  className="w-full h-full rounded-2xl text-2xl"
                />
                {isSelf && (
                  <button 
                    onClick={() => { setUploadType('avatar'); setShowImageUploadModal(true); }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 rounded-2xl cursor-pointer"
                  >
                    <Camera size={18} /> Profil Fotosu
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {user?.name || 'Öğrenci Profili'}
                  </h1>
                  <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-500/10" title="Aktif Öğrenci" />
                  <span className="bg-red-50 text-[#990000] border border-red-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    ÖĞRENCİ PORTALI
                  </span>
                  {renderBadges(isSelf ? [...(user?.badges || []), ...unlockedBadges] : user?.badges)}
                </div>
                
                <p className="text-sm font-bold text-gray-700 mt-1 flex items-center gap-2 flex-wrap">
                  <GraduationCap size={16} className="text-[#990000]" />
                  {user?.department || 'Bilgisayar Mühendisliği'} • {user?.faculty || 'Mühendislik Fakültesi'}
                </p>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 font-semibold flex-wrap">
                  <span>🎓 Sınıf: <b>{user?.grade || user?.year || '3. Sınıf'}</b></span>
                  <span> GPA: <b className="text-emerald-600">{user?.gpa ? `${user.gpa} / 4.00` : '3.78 / 4.00'}</b></span>
                  {user?.doubleMajor && <span>• ÇAP: <b className="text-purple-600">{user.doubleMajor}</b></span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {isSelf ? (
                  <>
                    <button 
                      onClick={() => setView('profile_update')} 
                      className="flex-1 md:flex-none bg-gradient-to-r from-red-900 via-[#990000] to-red-800 hover:from-red-800 hover:to-red-700 text-white text-xs font-black px-5 py-3 rounded-2xl transition shadow-md shadow-red-950/20 border border-red-700/50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Settings size={15} /> Profili Düzenle
                    </button>
                    <button 
                      onClick={() => setView('cvbuilder')} 
                      className="flex-1 md:flex-none bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-black px-5 py-3 rounded-2xl transition shadow-md shadow-emerald-950/20 border border-emerald-500/50 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <FileText size={15} /> AI CV & Portfolyo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition shadow-sm cursor-pointer ${
                        isFollowing ? 'bg-emerald-600 text-white' : 'bg-[#0A66C2] text-white hover:bg-[#004182]'
                      }`}
                    >
                      {isFollowing ? <><UserCheck size={16} /> Takip Ediliyor</> : <><UserPlus size={16} /> Takip Et</>}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ─── ULTRA BENTO PRESTİJ & SOSYAL METRİKLER (INSTAGRAM AKIŞ TASARIMI) ─── */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 bg-gradient-to-br from-red-50/80 to-white border border-red-100 rounded-2xl text-center shadow-sm">
                <p className="text-lg font-black text-[#990000]">{user?.gpa || '3.78'}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Genel GPA (Onur)</p>
              </div>
              <div className="p-3.5 bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100 rounded-2xl text-center shadow-sm">
                <p className="text-lg font-black text-emerald-700">Tamamlandı</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">20 Gün Staj</p>
              </div>
              <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100 rounded-2xl text-center shadow-sm">
                <p className="text-lg font-black text-indigo-700">3 Lisans</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">Web3 / SBT</p>
              </div>
              
              {/* TAKİPÇİLER (INSTAGRAM STYLE) */}
              <div 
                role="button"
                onClick={() => setFollowersModal({ 
                  isOpen: true, 
                  title: isSelf ? 'Seni Takip Edenler (Takipçiler)' : `${user?.name || 'Öğrenci'} Takipçileri`, 
                  users: [
                    { id: 'STU-003', name: 'Zeynep Kaya', department: 'Bilgisayar Mühendisliği', role: 'student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', isMutual: true },
                    { id: 'STU-004', name: 'Mert Demir', department: 'Yazılım Mühendisliği', role: 'student', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isMutual: false },
                    { id: 'ALM-002', name: 'Elif Yılmaz', department: 'Endüstri Mühendisliği', role: 'alumni', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isMutual: true },
                    { id: 'STU-005', name: 'Alperen Çelik', department: 'Elektrik-Elektronik', role: 'student', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', isMutual: false }
                  ] 
                })}
                className="p-3.5 bg-gradient-to-br from-blue-50/80 to-white border border-blue-100 rounded-2xl text-center shadow-sm cursor-pointer hover:bg-blue-100/50 transition group"
                title="Takipçileri görün"
              >
                <p className="text-lg font-black text-blue-700 group-hover:scale-105 transition">128</p>
                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                  <Users size={12} /> Takipçi
                </p>
              </div>

              {/* TAKİP EDİLENLER (INSTAGRAM STYLE - FIRMA, HOCA, ÖĞRENCİ/MEZUN) */}
              <div 
                role="button"
                onClick={() => setFollowersModal({ 
                  isOpen: true, 
                  title: isSelf ? 'Takip Edilenler (Firmalar, Hocalar & Arkadaşlar)' : `${user?.name || 'Öğrenci'} Takip Ettikleri`, 
                  users: [
                    ...studentFollowedCompanies.map(c => ({ ...c, typeLabel: 'Kurumsal Partner' })),
                    { id: 'ACM-001', name: 'Dr. Öğr. Üyesi Mehmet Selim', department: 'Bilgisayar Mühendisliği', role: 'academic', typeLabel: 'Akademisyen Hoca' },
                    { id: 'ACM-002', name: 'Prof. Dr. Ayşe Yılmaz', department: 'Yazılım Mühendisliği', role: 'academic', typeLabel: 'Akademisyen Hoca' },
                    { id: 'STU-002', name: 'Caner Öztürk', department: 'Bilgisayar Mühendisliği', role: 'student', typeLabel: 'Öğrenci', isMutual: true }
                  ] 
                })}
                className="p-3.5 bg-gradient-to-br from-purple-50/80 to-white border border-purple-100 rounded-2xl text-center shadow-sm cursor-pointer hover:bg-purple-100/50 transition group"
                title="Takip ettiğiniz firma, akademisyen ve mezunları görün"
              >
                <p className="text-lg font-black text-purple-700 group-hover:scale-105 transition">
                  {followedCompanyIds.length + followedAcademicIds.length + 3}
                </p>
                <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mt-0.5 flex items-center justify-center gap-1">
                  <UserCheck size={12} /> Takip Edilen
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ─── DENGELİ 3-SÜTUNLU YERLEŞİM (SOL: 300px | ORTA: FLEX-1 | SAĞ: 320px) ─── */}
        <div className="flex flex-col lg:flex-row justify-center gap-6 w-full items-start">
          
          {/* 1. SOL SÜTUN (300px) */}
          <div className="w-full lg:w-[300px] shrink-0 space-y-5">
            
            {/* Biyografi Kartı */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <FileText size={16} className="text-[#990000]" /> Biyografi & Hakkında
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {user?.bio || 'İstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Yazılım mimarileri, yapay zeka ve web teknolojileri alanında kendimi geliştiriyorum.'}
              </p>
            </div>

            {/* İESÜ Lisans Eğitimi Kartı */}
            <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-[#990000] text-white rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
                <GraduationCap size={16} /> Lisans Derecesi
              </div>
              <div className="space-y-2">
                <p className="font-black text-white text-sm">İstanbul Esenyurt Üniversitesi</p>
                <p className="text-xs text-gray-300 font-medium">{user?.department || 'Bilgisayar Mühendisliği'}</p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                  <span className="text-gray-400">Beklenen Mezuniyet:</span>
                  <span className="font-bold text-amber-300">2026 Dönemi</span>
                </div>
              </div>
            </div>

            {/* Takip Edilen Akademisyenler Kartı */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" /> Takip Edilen Hocalar
                </h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2 Akademisyen</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { id: 'ACM-001', name: 'Dr. Öğr. Üyesi Mehmet Selim', title: 'Mühendislik Fakültesi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
                  { id: 'ACM-002', name: 'Prof. Dr. Ayşe Yılmaz', title: 'Bilgisayar Mühendisliği', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' }
                ].map(academic => (
                  <div key={academic.id} className="p-2.5 bg-blue-50/40 hover:bg-blue-50 rounded-2xl border border-blue-100/60 flex items-center gap-3 transition">
                    <img 
                      src={academic.avatar} 
                      alt={academic.name} 
                      className="w-9 h-9 rounded-xl object-cover border border-blue-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{academic.name}</h4>
                      <p className="text-[10px] text-blue-700 font-medium truncate">{academic.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Takip Edilen Akredite Firmalar Kartı */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} className="text-purple-600" /> Takip Edilen Firmalar
                </h3>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{followedCompanyIds.length} Firma</span>
              </div>
              <div className="space-y-2">
                {studentFollowedCompanies.map(comp => (
                  <div key={comp.id} className="p-2.5 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-slate-100 flex items-center gap-3 transition">
                    <SafeAvatar 
                      name={comp.name} 
                      src={comp.logo || comp.avatar} 
                      size="sm" 
                      rounded="rounded-xl" 
                      className="shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{comp.name}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{comp.sector || 'Kurumsal Partner'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 2. ORTA SÜTUN: GÖNDERİLER & AKIŞ (FLEX-1) ─── */}
          <div className="flex-1 space-y-5 w-full">
            
            {/* Gönderiler & Paylaşımlar Akışı */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <BookOpen size={16} className="text-[#990000]" /> Paylaşımlar & Etkinlik Katılımları
                </h3>
                <span className="bg-red-50 text-[#990000] text-xs font-bold px-2.5 py-1 rounded-full">
                  {(posts || []).length} Gönderi
                </span>
              </div>

              {(() => {
                const userPosts = (posts || []).filter(p => p.author?.id === user?.id || p.authorName === user?.name || p.author === user?.name);
                const listToRender = userPosts.length > 0 ? userPosts : (posts || []).slice(0, 3);

                return listToRender.map(post => (
                  <PostCard key={post.id} post={post} currentUser={currentUser} setPosts={setPosts} setSelectedUserId={setSelectedUserId} setView={setView} />
                ));
              })()}
            </div>

          </div>

          {/* 3. SAĞ SÜTUN (320px) ─── */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-5">
            
            {/* Rozetler & Yetkinlikler */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-2.5">
                <Award size={16} className="text-amber-500" /> Başarı Rozetleri
              </h3>
              <div className="flex flex-wrap gap-2">
                {['🏆 Derece Öğrencisi', '⚡ Yıldız Stajyer', '🚀 Top Voice', '💻 Hakaton Derecesi'].map((b, idx) => (
                  <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl">
                    {b}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  };

  const renderAlumniProfile = () => {
    const activeUser = user || currentUser || { name: currentUser?.name || 'Caner Öztürk', title: 'FRONTEND DEVELOPER', department: 'Yazılım Mühendisliği', gradYear: '2022' };
    // Ziyaretçi/Kendi profil kontrolü: dal bazlı isProfileSelf kullanılır
    const isSelf = isProfileSelf('alumni');
    const initials = (activeUser?.name || 'Caner Öztürk').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
      <>
      <div className="space-y-6">

        {/* ─── ZÜMRÜT MEZUN HERO KAPAK KARTI ─── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
          <div className="h-36 sm:h-44 bg-gradient-to-r from-teal-950 via-teal-800 to-emerald-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent"></div>
            {isSelf && (
              <button 
                onClick={() => { setUploadType('cover'); setShowImageUploadModal(true); }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera size={14} /> Kapak Değiştir
              </button>
            )}
          </div>

          <div className="px-6 sm:px-10 pb-6 relative">
            <div className="-mt-14 mb-3">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-[#D97706] shadow-xl overflow-hidden flex items-center justify-center p-1 relative group">
                <SafeAvatar
                  src={activeUser?.avatar}
                  name={activeUser?.name || 'Mezun'}
                  size="full"
                  rounded="rounded-xl"
                  className="text-2xl sm:text-3xl"
                  alt={activeUser?.name || 'Mezun profil fotoğrafı'}
                />
                {isSelf && (
                  <button 
                    onClick={() => { setUploadType('avatar'); setShowImageUploadModal(true); }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 rounded-xl cursor-pointer"
                  >
                    <Camera size={18} />
                    Değiştir
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{activeUser?.name || 'Caner Öztürk'}</h1>
                  <CheckCircle2 size={22} className="text-[#059669] fill-[#059669]/10" title="Onaylı İESÜ Mezunu" />
                  <span className="bg-emerald-50 text-[#059669] border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeUser?.title || 'FRONTEND DEVELOPER'}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-600 mt-1 flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-[#059669]" />
                  {activeUser?.department || 'Yazılım Mühendisliği'} • {activeUser?.gradYear || activeUser?.graduationYear || '2023'} Mezunu
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isSelf ? (
                  <>
                    <button 
                      onClick={() => setView('mbs')} 
                      className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black px-5 py-3 rounded-2xl transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      title="Resmi Mezun Bilgi Sistemi ve Mezun Kartı"
                    >
                      <GraduationCap size={16} /> Mezun Bilgi Sistemi & Kartım (MBS)
                    </button>
                    <button 
                      onClick={() => setView('profile_update')} 
                      className="flex-1 sm:flex-none bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-4 py-3 rounded-2xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Settings size={15} /> Profili Düzenle
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      const aluId = activeUser?.id || 'ALU-001';
                      const isFollowingAlu = followedAlumniIds.includes(aluId);
                      let updated;
                      if (isFollowingAlu) {
                        updated = followedAlumniIds.filter(id => id !== aluId);
                        window.toast?.info(`${activeUser?.name || 'Mezun'} takipten çıkarıldı.`);
                      } else {
                        updated = [...followedAlumniIds, aluId];
                        window.toast?.success(`${activeUser?.name || 'Mezun'} mezun ağı listenize eklendi! Paylaşımları akışınızda görünecektir.`);
                      }
                      setFollowedAlumniIds(updated);
                      try { localStorage.setItem('iesu_followed_alumni_v1', JSON.stringify(updated)); } catch(e) {}
                    }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition shadow-sm cursor-pointer hover:scale-105 ${
                      followedAlumniIds.includes(activeUser?.id || 'ALU-001')
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
                    }`}
                  >
                    {followedAlumniIds.includes(activeUser?.id || 'ALU-001') ? (
                      <><UserCheck size={16} /> Mezun Ağında</>
                    ) : (
                      <><UserPlus size={16} /> Bağlantı Kur & Takip Et</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── DENGELİ 3-SÜTUNLU YERLEŞİM (SOL: 270px | ORTA: FLEX-1 | SAĞ: 300px) ─── */}
        <div className="flex flex-col lg:flex-row justify-center gap-6 w-full items-start">
          
          {/* 1. SOL SÜTUN (270px) */}
          <div className="w-full lg:w-[270px] shrink-0 space-y-5">
            {/* Kariyer Hikayesi & Biyografi */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">Biyografi & Hikaye</h3>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed font-medium">
                  {activeUser?.bio || 'İstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği bölümünden dereceyle mezun oldum. Şu anda Trendyol Tech bünyesinde Kıdemli Yazılım Mühendisi olarak görev yapıyorum.'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Uzmanlık Etiketleri</p>
                <div className="flex flex-wrap gap-1.5">
                  {['#React', '#CloudArchitecture', '#NodeJS', '#SystemDesign', '#DevOps'].map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-gray-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* İESÜ Lisans Derecesi Kartı (Sol Sütunda Biyografinin Altında) */}
            <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white/10 text-teal-300 rounded-lg flex items-center justify-center">
                      <GraduationCap size={16} />
                    </div>
                    <h3 className="font-black text-white text-xs">İESÜ Lisans</h3>
                  </div>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Award size={10} /> Yüksek Onur
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Fakülte & Bölüm</p>
                    <p className="font-black text-white text-xs mt-0.5">{activeUser?.department || 'Bilgisayar Mühendisliği'}</p>
                    <p className="text-[11px] text-gray-300 font-medium">Mühendislik Fakültesi</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <p className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Mezuniyet & GPA</p>
                    <p className="font-black text-white text-xs mt-0.5">{activeUser?.gradYear || '2022'} Dönemi</p>
                    <p className="text-[11px] text-emerald-400 font-bold">GPA: 3.84 / 4.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ORTA SÜTUN: GÖNDERİLER AKIŞI & SEKTÖR DENEYİMİ (FLEX-1 MAX-620PX) */}
          <div className="w-full max-w-[620px] shrink-0 space-y-5">
            
            {/* Sektör & Kariyer Geçmişi */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Briefcase size={16} />
                </div>
                <h3 className="font-black text-gray-900 text-base">Sektör & Kariyer Geçmişi</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Kıdemli Yazılım Mimarı</h4>
                    <p className="text-xs font-semibold text-teal-700">Trendyol Tech • Tam Zamanlı</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">2023 - Halen (2 Yıl 6 Ay)</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full">Aktif Rol</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Full-Stack Software Developer</h4>
                    <p className="text-xs font-semibold text-gray-700">Aselsan A.Ş. • Tam Zamanlı</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">2022 - 2023 (1 Yıl 2 Ay)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GÖNDERİLER AKIŞI (TAM ORTADA KENDİ BÖLÜMÜNDE) */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <BookOpen size={18} className="text-teal-600" /> Paylaşımlar & Gönderiler
                </h3>
                <span className="bg-teal-50 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {(posts || []).length} Gönderi
                </span>
              </div>

              {(() => {
                const userPosts = (posts || []).filter(p => p.author?.id === activeUser?.id || p.authorName === activeUser?.name || p.author === activeUser?.name);
                const listToRender = userPosts.length > 0 ? userPosts : (posts || []).slice(0, 4);

                return listToRender.map(post => (
                  <PostCard key={post.id} post={post} currentUser={currentUser} setPosts={setPosts} setSelectedUserId={setSelectedUserId} setView={setView} />
                ));
              })()}
            </div>
          </div>

          {/* 3. SAĞ SÜTUN (300PX) */}
          <div className="hidden xl:block w-[300px] shrink-0 space-y-5">
            {/* Kariyer Metrikleri */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <BarChart2 size={16} />
                </div>
                <h3 className="font-black text-gray-900 text-sm">Kariyer Metrikleri</h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Sektör Deneyimi</span>
                  <span className="font-black text-teal-700 text-sm">4+ Yıl</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Mentörlük Edilen</span>
                  <span className="font-black text-emerald-600 text-sm">28 Öğrenci</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Tamamlanan Proje</span>
                  <span className="font-black text-purple-600 text-sm">14 Proje</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-gray-600">Ağ Sıralaması</span>
                  <span className="font-black text-amber-600 text-sm">Top %5</span>
                </div>
              </div>
            </div>

            {/* Mentörlük & Mezun Hizmetleri */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    {isSelf ? <ShieldCheck size={18} /> : <Clock size={16} />}
                  </div>
                  <h3 className="font-black text-gray-900 text-sm">
                    {isSelf ? 'Mezun İşlemleri & Servisler' : 'Mentörlük & İletişim'}
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  {isSelf ? (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                      <p className="font-bold text-emerald-900">Doğrulanmış Mezun Hesabı</p>
                      <p className="text-emerald-700 font-medium mt-0.5 text-[11px]">Resmî İESÜ Diploması Doğrulandı</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                      <p className="font-bold text-blue-900">Mentörlük Saatleri</p>
                      <p className="text-blue-700 font-medium mt-0.5 text-[11px]">Çarşamba & Cuma: 18:00 - 20:00</p>
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                    <p className="font-bold text-gray-800 flex items-center gap-1.5 truncate text-[11px]">
                      <Mail size={12} className="text-gray-400 shrink-0" /> {activeUser?.email || (activeUser?.name ? `${activeUser.name.toLowerCase().replace(/\s+/g, '.')}@mezun.esenyurt.edu.tr` : 'mezun@esenyurt.edu.tr')}
                    </p>
                    <p className="font-bold text-gray-800 flex items-center gap-1.5 truncate text-[11px]">
                      <Link2 size={12} className="text-blue-500 shrink-0" /> linkedin.com/in/{(activeUser?.name || 'mezun').toLowerCase().replace(/\s+/g, '-')}
                    </p>
                  </div>
                </div>
              </div>

              {isSelf ? (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <button 
                    onClick={() => setView('mbs')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <GraduationCap size={15} /> Mezun Bilgi Sistemi (MBS)
                  </button>
                  <button 
                    onClick={() => setView('alumni_card')}
                    className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2 rounded-xl text-[11px] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award size={14} /> Dijital Mezun Kartım
                  </button>
                  <button 
                    onClick={() => setView('cvbuilder')}
                    className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-2 rounded-xl text-[11px] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText size={14} /> Akıllı CV Oluşturucu
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowMentorshipRequestModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle size={15} /> Mentörlük İsteği Gönder
                </button>
              )}
            </div>
          </div>

        </div>

        {/* ─── MENTÖRLÜK & DANIŞMANLIK İSTEĞİ FORM MODALI (Z-200 OVERLAY) ─── */}
        {showMentorshipRequestModal && (
          <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] relative">
              
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-slate-950 via-[#7A0000] to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center font-black">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white">Mentörlük & Danışmanlık Talebi</h3>
                    <p className="text-[11px] text-slate-300 font-medium">KGM Denetimli Resmi Başvuru Formu</p>
                  </div>
                </div>

                <button 
                  onClick={() => setShowMentorshipRequestModal(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSendMentorshipRequest} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 bg-white custom-scrollbar">
                
                {/* Target Mentor Card info */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3">
                  <SafeAvatar
                    src={user?.avatar}
                    name={user?.name || 'Mentor'}
                    size="lg"
                    rounded="rounded-xl"
                    className="border border-slate-200 shadow-xs"
                    alt={user?.name || 'Mentor'}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#990000]">Seçilen Mentör</p>
                    <h4 className="font-extrabold text-slate-900 text-xs truncate">{user?.name || 'Caner Öztürk'}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{user?.title || 'Kıdemli Yazılım Mimarı @ Trendyol Tech'}</p>
                  </div>
                </div>

                {/* Field 1: Topic Select */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">Mentörlük / Danışmanlık Konusu</label>
                  <select 
                    value={mentorshipReqForm.topic}
                    onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, topic: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Kariyer Yol Haritası & Danışmanlık">Kariyer Yol Haritası & Danışmanlık</option>
                    <option value="CV & Portfolyo İncelemesi">CV & Portfolyo İncelemesi</option>
                    <option value="Mülakat Simülasyonu & Hazırlık">Mülakat Simülasyonu & Hazırlık</option>
                    <option value="Staj & Sektör Tavsiyeleri">Staj & Sektör Tavsiyeleri</option>
                    <option value="Yurt Dışı / Yüksek Lisans Fırsatları">Yurt Dışı / Yüksek Lisans Fırsatları</option>
                    <option value="Diğer Özel Destek">Diğer Özel Destek</option>
                  </select>
                </div>

                {/* Field 2: Mode Select */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">Resmî Görüşme Biçimi</label>
                  <select 
                    value={mentorshipReqForm.mode}
                    onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, mode: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#990000]"
                  >
                    <option value="Yüz Yüze Kampüs Görüşmesi">Yüz Yüze Kampüs Görüşmesi (Akademisyen Ofisi)</option>
                    <option value="Resmî Kurumsal E-Posta">Resmî Kurumsal E-Posta İletişimi</option>
                  </select>
                </div>

                {/* Field 3: Detailed Note */}
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">Mentöre Notunuz & Destek İsteğiniz</label>
                  <textarea 
                    rows={4}
                    required
                    value={mentorshipReqForm.note}
                    onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, note: e.target.value })}
                    placeholder="Mentörünüze kendinizden, mevcut durumunuzdan ve tam olarak hangi alanda yardım talep ettiğinizden bahsedin..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000]"
                  ></textarea>
                </div>

                {/* Info Notice */}
                <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 font-medium">
                  <ShieldCheck size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <span>Bu form Kariyer Geliştirme Merkezi (KGM) denetim havuzunda güvenli bir şekilde arşivlenecektir.</span>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer"
                  >
                    Talebi Mentöre & KGM Havuzuna Gönder
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>

      </>
    );
  };

  const renderCompanyProfile = () => {
    const activeCompanyUser = user && (user.sector || user.role === 'employer' || user.role === 'company' || user.id?.startsWith('CMP-') || user.name) 
      ? user 
      : (currentUser || {
          id: 'CMP-001',
          name: currentUser?.name || 'Trendyol',
          sector: currentUser?.sector || (currentUser?.role === 'admin' ? 'Kurumsal Yönetim & Kariyer Koordinasyonu' : 'E-Ticaret & Teknoloji Ortaklığı'),
          location: 'İstanbul Maslak Kampüsü',
          foundingYear: '2010',
          description: 'Türkiye\'nin önde gelen e-ticaret ve teknoloji ekosistemi. İESÜ Kariyer Geliştirme Merkezi akredite sanayi ve staj partneri.',
          alumniCount: '42',
          hiringConversion: '%84',
          internshipDuration: '20 İş Günü (1 Ay)'
        });
    const isOwnProfile = isProfileSelf('company');
    const isVisitor = !isOwnProfile;

    // Firma'ya ait fuar başvuruları
    const myFairApps = (careerFairApplications || []).filter(app =>
      app.companyName === activeCompanyUser?.name ||
      app.companyId === activeCompanyUser?.id ||
      app.userId === activeCompanyUser?.id ||
      app.email === activeCompanyUser?.email
    );

    // Firma'ya ait etkinlik katılımları (events)
    const myEvents = (events || []).filter(ev =>
      ev.registeredCompanies?.includes(user?.id) ||
      ev.registeredCompanies?.includes(user?.name) ||
      ev.sponsorCompany === user?.name ||
      ev.companyId === user?.id
    );

    // Gönderilmiş yönetici mesajları (adminMessages)
    const myMessages = adminMessages.filter(msg =>
      msg.companyId === user?.id ||
      msg.companyName === user?.name ||
      msg.email === user?.email
    );

    const fairStatusColor = (status) => {
      if (status === 'Onaylandı' || status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      if (status === 'Reddedildi' || status === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
      return 'bg-amber-50 text-amber-700 border-amber-200';
    };
    const fairStatusLabel = (status) => {
      if (status === 'Onaylandı' || status === 'approved') return 'Onaylandı';
      if (status === 'Reddedildi' || status === 'rejected') return 'Reddedildi';
      return 'İnceleniyor';
    };

    const coverSrc = user?.coverImage || user?.cover;

    return (
      <div className="space-y-5">

        {/* ─── HERO CARD (CORPORATE MIDNIGHT SAPPHIRE THEME #0A2342) ─── */}
        <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
          {/* Cover */}
          <div className="h-36 sm:h-52 bg-gradient-to-r from-slate-950 via-[#0A2342] to-[#1E3A8A] relative overflow-hidden group">
            {coverSrc && (
              <img src={coverSrc} alt="Cover Background" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(30,58,138,0.3)_0%,_transparent_70%)]"></div>
            <div className="absolute bottom-4 right-6 opacity-15 text-blue-300 pointer-events-none">
              <Building2 size={130} />
            </div>

            {/* Kapak Tasarımını Değiştir Butonu */}
            {isOwnProfile && (
              <button
                onClick={() => {
                  setUploadType('cover');
                  setCustomImageUrl(coverSrc || '');
                  setShowImageUploadModal(true);
                }}
                className="absolute top-4 right-4 bg-slate-950/70 hover:bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 border border-blue-400/30 shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer z-10"
              >
                <Camera size={14} /> Kapak Tasarımını Değiştir
              </button>
            )}
          </div>

          {/* Logo + Info */}
          <div className="px-5 sm:px-8 pb-6 relative">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white bg-white shadow-xl absolute -top-12 sm:-top-14 left-5 sm:left-8 overflow-hidden flex items-center justify-center p-1.5 group">
              {user?.role === 'admin' || user?.name === 'Kariyer Geliştirme Merkezi' ? (
                <Logo color="blue" size="xl" className="w-full h-full justify-center" />
              ) : (
                <>
                  <SafeAvatar
                    src={user?.logo || user?.avatar}
                    name={user?.name || 'Firma'}
                    size="full"
                    rounded="rounded-xl"
                    className="p-1"
                    alt={user?.name || 'Firma logosu'}
                  />
                  {isOwnProfile && (
                    <button
                      onClick={() => {
                        setUploadType('avatar');
                        setCustomImageUrl(user?.logo || user?.avatar || '');
                        setShowImageUploadModal(true);
                      }}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 rounded-xl cursor-pointer"
                    >
                      <Camera size={18} />
                      Logo Değiştir
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Name + Actions */}
            <div className="pt-16 sm:pt-18 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {activeCompanyUser?.name || 'Kurumsal Firma'}
                  </h1>
                  <span className="bg-gradient-to-r from-[#0A2342] to-blue-900 text-blue-200 border border-blue-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <ShieldCheck size={12} className="text-blue-400" /> İESÜ Akredite Kurumsal Partner
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
                  {activeCompanyUser?.sector && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-blue-50/80 px-3 py-1 rounded-lg border border-blue-100/60">
                      <Tag size={13} className="text-blue-700" />{activeCompanyUser.sector}
                    </span>
                  )}
                  {activeCompanyUser?.location && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
                      <MapPin size={13} className="text-blue-600" />{activeCompanyUser.location}
                    </span>
                  )}
                  {activeCompanyUser?.foundingYear && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-indigo-50/80 px-3 py-1 rounded-lg border border-indigo-100/60">
                      <Calendar size={13} className="text-indigo-600" />Kuruluş: {activeCompanyUser.foundingYear}
                    </span>
                  )}
                  {activeCompanyUser?.website && (
                    <a href={activeCompanyUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-800 font-black hover:underline bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                      <Link2 size={13} />{activeCompanyUser.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {activeCompanyUser?.description && (
                  <p className="text-xs sm:text-sm text-slate-700 mt-3.5 leading-relaxed max-w-2xl font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">{activeCompanyUser.description}</p>
                )}
              </div>

              {/* Butonlar - Rich Corporate Sapphire Styling */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {isOwnProfile ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setView('profile_update')}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 hover:from-slate-900 hover:to-blue-900 text-white rounded-2xl font-black text-xs transition shadow-lg shadow-blue-950/30 border border-blue-800/60 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Settings size={15} /> Kurumsal Bilgileri Düzenle
                    </button>
                    <button
                      onClick={() => setView('create_job')}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs transition shadow-lg shadow-blue-950/20 border border-blue-400/40 cursor-pointer hover:scale-[1.02] active:scale-95"
                    >
                      <Briefcase size={15} /> Yeni İlan Yayınla
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        const compId = activeCompanyUser?.id || 'CMP-001';
                        const isFollowing = followedCompanyIds.includes(compId);
                        let updated;
                        if (isFollowing) {
                          updated = followedCompanyIds.filter(id => id !== compId);
                          window.toast?.info(`${activeCompanyUser?.name || 'Firma'} takipten çıkarıldı.`);
                        } else {
                          updated = [...followedCompanyIds, compId];
                          window.toast?.success(`${activeCompanyUser?.name || 'Firma'} başarıyla takip edilmeye başlandı! İlan güncellemeleri bildirim akışınıza düşecektir.`);
                        }
                        setFollowedCompanyIds(updated);
                        try { localStorage.setItem('iesu_followed_companies_v1', JSON.stringify(updated)); } catch(e) {}
                      }}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-md cursor-pointer hover:scale-105 ${
                        followedCompanyIds.includes(activeCompanyUser?.id || 'CMP-001')
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#0A2342] hover:bg-blue-900 text-white'
                      }`}
                    >
                      {followedCompanyIds.includes(activeCompanyUser?.id || 'CMP-001') ? (
                        <><UserCheck size={16} /> Takip Ediliyorsun</>
                      ) : (
                        <><UserPlus size={16} /> Firmayı Takip Et</>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ─── CORPORATE SAPPHIRE PRESTİJ METRİKLERİ (4 METRİK) ─── */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 bg-gradient-to-br from-slate-950 via-[#0A2342] to-slate-900 text-white rounded-2xl text-center shadow-lg border border-blue-900/60 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400/10 rounded-full blur-md"></div>
                <p className="text-xl font-black text-white">{user?.employeeCount || '100-500'}</p>
                <p className="text-[10px] font-black text-blue-200 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <Users size={12} className="text-blue-400" /> Çalışan Sayısı
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 text-white rounded-2xl text-center shadow-lg border border-indigo-700/60 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-400/10 rounded-full blur-md"></div>
                <p className="text-xl font-black text-indigo-300">3 Aktif İlan</p>
                <p className="text-[10px] font-black text-indigo-100 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <Briefcase size={12} className="text-indigo-400" /> Canlı İESÜ İlanı
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 text-white rounded-2xl text-center shadow-lg border border-amber-600/60 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/10 rounded-full blur-md"></div>
                <p className="text-xl font-black text-amber-300">A+ Seviye</p>
                <p className="text-[10px] font-black text-amber-100 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <Award size={12} className="text-amber-400" /> Kurumsal Partner
                </p>
              </div>

              <div 
                role="button" 
                onClick={() => setFollowersModal({ isOpen: true, title: `${activeCompanyUser?.name || 'Firma'} Takipçileri`, users: (students || []).slice(0, 10) })}
                className="p-4 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white rounded-2xl text-center shadow-lg border border-slate-700/80 cursor-pointer hover:border-amber-400/60 transition group"
                title="Tıklayıp Takipçileri Görün"
              >
                <p className="text-xl font-black text-amber-400 group-hover:scale-105 transition">{340 + (followedCompanyIds.includes(activeCompanyUser?.id || 'CMP-001') ? 1 : 0)}</p>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <Users size={12} className="text-amber-400" /> Takipçi Kitle
                </p>
              </div>
            </div>

            {/* ─── CORPORATE MİSYON VE VİZYON (SAPPHIRE CORPORATE HARMONY) ─── */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MİSYON */}
              <div className="p-5 bg-gradient-to-br from-slate-950 via-[#0A2342] to-blue-950 text-white rounded-2xl space-y-2 shadow-lg border border-blue-900/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-2 text-blue-300 font-black text-xs uppercase tracking-wider">
                  <Target size={16} className="text-blue-400" /> Kurumsal Misyonumuz
                </div>
                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                  {user?.mission || 'Genç yeteneklerin potansiyellerini açığa çıkararak sektöre yenilikçi, etki odaklı ve sürdürülebilir teknolojik çözümler sunmaktır.'}
                </p>
              </div>

              {/* VİZYON */}
              <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl space-y-2 shadow-lg border border-indigo-900/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-2 text-indigo-300 font-black text-xs uppercase tracking-wider">
                  <Sparkles size={16} className="text-indigo-400" /> Gelecek Vizyonumuz
                </div>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                  {user?.vision || 'Türkiye’den doğup globale açılan, yetenek gelişimi ve stajyer akreditasyonunda öncü teknoloji markası olmaktır.'}
                </p>
              </div>
            </div>

            {/* ŞİRKET KÜLTÜRÜ & YAN HAKLAR (PERKS) */}
            <div className="mt-4 pt-3 border-t border-slate-200/80">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Çalışan Kültürü & Şirket Avantajları</span>
              <div className="flex flex-wrap gap-2">
                {[
                  '💻 Hibrit & Esnek Çalışma', 
                  '🎓 Sürekli Akademi & Eğitimi', 
                  '🚀 Hızlı Kariyer & Yükselme', 
                  '🍕 Özel Yan Haklar & Yemek', 
                  '⚡ Genç Yetenek Mentörlüğü'
                ].map((tag, idx) => (
                  <span key={idx} className="bg-blue-900/10 text-blue-950 text-[11px] font-extrabold px-3 py-1.5 rounded-xl border border-blue-200/80 shadow-2xs hover:bg-blue-900/20 transition">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ─── BENTO GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ─── CANLI İESÜ MEZUN & STAJYER BAŞARI RADARI (CORPORATE MIDNIGHT SAPPHIRE THEME #0A2342) ─── */}
        <div className="md:col-span-3 w-full bg-gradient-to-r from-slate-950 via-[#0A2342] to-[#163B65] text-white rounded-3xl p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-6 border border-blue-800/60 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-black shadow-inner">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-black text-base text-white tracking-tight flex items-center gap-2">
                  İESÜ Öğrenci & Mezun İstihdam Radarı
                </h3>
                <p className="text-xs text-blue-200 font-bold mt-0.5">İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi Canlı Verisi</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center relative z-10">
            {/* Kart 1: Kadroda Mezun */}
            <div className="p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 hover:border-amber-400/50 transition shadow-lg group-hover:bg-black/40">
              <p className="text-3xl font-black text-amber-300 drop-shadow-sm">{user?.alumniCount || '42'}</p>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wider mt-1">Kadroda İESÜ Mezunu</p>
            </div>

            {/* Kart 2: Stajdan Kadroya */}
            <div className="p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-400/50 transition shadow-lg group-hover:bg-black/40">
              <p className="text-3xl font-black text-emerald-400 drop-shadow-sm">{user?.hiringConversion || '%84'}</p>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wider mt-1">Stajdan Kadroya Geçiş Oranı</p>
            </div>

            {/* Kart 3: UYGULAMALI STAJ SÜRESİ */}
            <div 
              onClick={() => {
                if (isOwnProfile) {
                  setTempInternshipDuration(user?.internshipDuration || '20 İş Günü (1 Ay)');
                  setShowInternshipDurationEditModal(true);
                }
              }}
              className={`p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 hover:border-blue-400/50 transition shadow-lg group-hover:bg-black/40 ${isOwnProfile ? 'cursor-pointer group/card' : ''}`}
              title={isOwnProfile ? "Tıklayıp Staj Süresini Düzenleyin" : ""}
            >
              <p className="text-2xl sm:text-3xl font-black text-blue-300 drop-shadow-sm flex items-center justify-center gap-1.5">
                {user?.internshipDuration || '20 İş Günü (1 Ay)'}
                {isOwnProfile && <Settings size={14} className="text-blue-400 opacity-70 group-hover/card:opacity-100 group-hover/card:scale-125 transition-all" />}
              </p>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wider mt-1">
                Uygulamalı Staj Süresi
              </p>
            </div>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs text-slate-200 flex items-center gap-3 relative z-10">
            <Sparkles size={18} className="text-amber-300 shrink-0" />
            <span>Bu firma, İESÜ Mühendislik ve İşletme Fakülteleri stajyerlerinin en yüksek puan verdiği <b>KGM Akredite Top 5 Sanayi İş Ortağı</b> arasındadır.</span>
          </div>
        </div>

          {/* STAJYER & ÖĞRENCİ DENEYİM YORUMLARI (GLASSDOOR STİLİ - ULTRA MODERN SAPPHIRE DESIGN) */}
          <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Star size={18} className="text-amber-500 fill-amber-500" /> İESÜ Öğrenci & Stajyer Deneyimleri (Likert Ölçekli)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full shadow-2xs">
                  4.9 / 5.0 Memnuniyet Skoru
                </span>
                <button 
                  onClick={() => setShowCompanyReviewModal(true)} 
                  className="px-4 py-2 bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 hover:from-slate-900 hover:to-blue-800 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 border border-blue-800/60"
                >
                  <Star size={13} className="fill-amber-300 text-amber-300" /> ⭐ Firma Değerlendirmesi Yap
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-2xs hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center shadow-2xs border border-blue-200">AK</div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Ahmet K.</p>
                      <p className="text-[10px] text-slate-500 font-bold">Bilgisayar Mühendisliği • Yazılım Stajyeri (2025)</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200/60">
                  "Staj süresince mikroservis mimarileri ve canlı bulut projeleri üzerinde çalıştım. Mentörüm her aşamada bana rehberlik etti. Harika bir gelişim ortamı!"
                </p>
              </div>

              <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-2xs hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shadow-2xs border border-emerald-200">ZT</div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Zeynep T.</p>
                      <p className="text-[10px] text-slate-500 font-bold">Endüstri Müh. Mezunu • Süreç Geliştirme Uzmanı</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200/60">
                  "Zorunlu stajımı tamamladıktan sonra direkt tam zamanlı iş teklifi aldım. Şirket kültürünün genç yeteneklere verdiği değer gerçekten ilham verici."
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderAcademicProfile = () => {
    const activeUser = user || currentUser || { 
      id: 'ACAD-001', 
      name: currentUser?.name || 'Prof. Dr. Ahmet Yılmaz', 
      title: currentUser?.title || 'Bölüm Başkanı & Profesör', 
      department: currentUser?.department || 'Bilgisayar Mühendisliği',
      avatar: currentUser?.avatar || (currentUser?.role === 'admin' ? '/iesu-logo.svg' : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150')
    };
    
    // Ziyaretçi/Kendi profil kontrolü: dal bazlı isProfileSelf kullanılır
    const isSelf = isProfileSelf('academic');

    return (
      <div className="space-y-6">
        {/* ─── AKADEMİK HEADER & KART (EMERALD & TEAL FOREST PRESTIGE THEME #064E3B) ─── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
          
          {/* Arka Kapak Gradient */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-purple-950 via-[#4C1D95] to-indigo-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
            <div className="absolute -bottom-10 right-10 opacity-10 text-white font-black text-8xl pointer-events-none select-none">
              AKADEMİK
            </div>
            
            {/* Kapak Görseli Değiştir Butonu */}
            {isSelf && (
              <button 
                onClick={() => { setUploadType('cover'); setShowImageUploadModal(true); }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera size={14} /> Kapak Değiştir
              </button>
            )}
          </div>

          {/* Profile Header Content */}
          <div className="px-6 sm:px-10 pb-8 relative">
            
            {/* Avatar & Hover Change */}
            <div className="relative inline-block -top-16 sm:-top-20 -mb-12">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center p-1 relative group">
                <SafeAvatar
                  src={activeUser?.avatar}
                  name={activeUser?.name || 'Akademisyen'}
                  size="full"
                  rounded="rounded-2xl"
                  className="text-3xl"
                  alt={activeUser?.name || 'Akademisyen profil fotoğrafı'}
                />
                {isSelf && (
                  <>
                    <button 
                      onClick={() => { setUploadType('avatar'); setShowImageUploadModal(true); }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1 rounded-2xl cursor-pointer"
                    >
                      <Camera size={20} />
                      Fotoğraf Değiştir
                    </button>
                    <button 
                      onClick={() => { setUploadType('avatar'); setShowImageUploadModal(true); }}
                      className="absolute bottom-2 right-2 bg-[#4C1D95] hover:bg-purple-900 text-white p-2 rounded-xl shadow-lg border-2 border-white transition-all cursor-pointer flex items-center justify-center"
                      title="Profil Fotoğrafı Yükle / Değiştir"
                    >
                      <Camera size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Top Action Buttons & Name Line */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{activeUser?.name || 'Akademisyen'}</h1>
                  <ShieldCheck size={22} className="text-[#4C1D95]" title="Doğrulanmış Akademisyen Kadrosu" />
                  <span className="bg-purple-50 text-[#4C1D95] border border-purple-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {activeUser?.title || 'Bölüm Başkanı'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-600 mt-1 flex items-center gap-1.5">
                  <Building2 size={15} className="text-slate-400" />
                  {activeUser?.department || 'Bilgisayar Mühendisliği Bölümü'} • Mühendislik Fakültesi
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" /> İstanbul Esenyurt Üniversitesi - Ana Kampüs B-Blok
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                {isSelf ? (
                  <button 
                    onClick={() => setView('profile_update')} 
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-950 via-[#4C1D95] to-indigo-900 hover:from-purple-900 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-md transition cursor-pointer border border-purple-500/40"
                  >
                    <Settings size={15} /> Profili Düzenle
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition shadow-sm border ${
                        isFollowing
                          ? 'bg-purple-50 text-[#4C1D95] border-purple-200 hover:bg-purple-100'
                          : 'bg-[#4C1D95] hover:bg-purple-900 text-white border-[#4C1D95]'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={16} /> Takip Ediliyor
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} /> Hocayı Takip Et
                        </>
                      )}
                    </button>

                    <button 
                      onClick={() => setShowMentorshipRequestModal(true)} 
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-950 via-[#990000] to-rose-800 hover:from-red-900 hover:to-red-700 text-white rounded-2xl font-black text-xs shadow-md transition cursor-pointer border border-red-500/40"
                    >
                      <Mail size={16} /> Resmî Danışmanlık & Randevu Talebi İlet
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── BENTO GRID METRİKLER VE BİLGİ KARTLARI ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-[#4C1D95]" /> Akademik Özgeçmiş & Biyografi
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {user?.bio || 'İstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği Bölüm Başkanı. Yapay Zeka, Veri Madenciliği, Makine Öğrenmesi ve Yazılım Mimarileri alanında lisans ve lisansüstü düzeyinde dersler vermekte ve sanayi iş birliği projelerini yürütmektedir.'}
              </p>
            </div>

            {/* Uzmanlık Etiketleri (Tags) */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Tag size={14} className="text-[#4C1D95]" /> Uzmanlık & Araştırma Alanları
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Yapay Zeka & Derin Öğrenme', 
                  'Veri Madenciliği', 
                  'Yazılım Mimarisi', 
                  'Bulut Bilişim', 
                  'Siber Güvenlik', 
                  'Öğrenci Staj Koordinasyonu'
                ].map((tag, idx) => (
                  <span key={idx} className="bg-purple-50 text-[#4C1D95] border border-purple-200/80 text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-2xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KART 2: İSTATİSTİKLER & BÖLÜM METRİKLERİ (CANLI OTOMATİK SENKRONİZE) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <BarChart2 size={18} className="text-[#4C1D95]" /> Akademik Metrikler
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#4C1D95] px-2.5 py-0.5 rounded-full border border-purple-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span> Canlı KGM
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Sorumlu Öğrenci */}
              <div 
                onClick={() => {
                  if (userRole === 'academic' && setView) setView('academic');
                  else window.toast?.info('Sorumlu Öğrenci Havuzu: Bilgisayar Mühendisliği Bölümü 450 Kayıtlı Öğrenci');
                }}
                className="p-3.5 bg-purple-50/60 hover:bg-purple-100/70 transition rounded-2xl border border-purple-200 text-center cursor-pointer group"
                title="Bölüm Kayıtlı Öğrenci Listesi"
              >
                <p className="text-2xl font-black text-[#4C1D95] group-hover:scale-110 transition-transform">
                  {(students || []).length > 0 ? (students.length * 15 + 120) : 450}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Sorumlu Öğrenci</p>
              </div>

              {/* Aktif Stajyer */}
              <div 
                onClick={() => {
                  if (userRole === 'academic' && setView) setView('academic');
                  else window.toast?.info('Staj Radarı: 124 Öğrenci Aktif Kurumsal Stajda');
                }}
                className="p-3.5 bg-purple-50/60 hover:bg-purple-100/70 transition rounded-2xl border border-purple-200 text-center cursor-pointer group"
                title="Canlı Stajyer Radarı"
              >
                <p className="text-2xl font-black text-[#4C1D95] group-hover:scale-110 transition-transform">124</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Aktif Stajyer</p>
              </div>

              {/* Yayın & Makale */}
              <div 
                onClick={() => { setAcademicEditTab('publications'); setShowAcademicEditModal(true); }}
                className="p-3.5 bg-purple-50/60 hover:bg-purple-100/70 transition rounded-2xl border border-purple-200 text-center cursor-pointer group"
                title="Yayın ve TÜBİTAK Projeleri Yönetimi"
              >
                <p className="text-2xl font-black text-[#4C1D95] group-hover:scale-110 transition-transform">
                  {(academicData.publications || []).length || 18}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Yayın & Makale</p>
              </div>

              {/* Proje & Danışmanlık */}
              <div 
                onClick={() => { setAcademicEditTab('courses'); setShowAcademicEditModal(true); }}
                className="p-3.5 bg-purple-50/60 hover:bg-purple-100/70 transition rounded-2xl border border-purple-200 text-center cursor-pointer group"
                title="Dersler & Danışmanlıklar"
              >
                <p className="text-2xl font-black text-[#4C1D95] group-hover:scale-110 transition-transform">
                  {(academicData.courses || []).length + 3}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Proje & Danışmanlık</p>
              </div>
            </div>
          </div>

          {/* KART 3: VERİLEN DERSLER */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <GraduationCap size={18} className="text-[#4C1D95]" /> Yürüttüğü Dersler
              </h3>
              {isSelf && (
                <button 
                  onClick={() => { setAcademicEditTab('courses'); setShowAcademicEditModal(true); }}
                  className="text-[11px] font-bold text-[#4C1D95] bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Settings size={12} /> Düzenle
                </button>
              )}
            </div>
            <div className="space-y-2.5">
              {(academicData.courses || []).map((c, i) => (
                <div key={c.id || i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-black text-xs text-emerald-800">{c.code}</span>
                    <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                    {c.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KART 4: YAYINLAR & PROJELER */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Award size={18} className="text-emerald-700" /> Son Yayınlar & TÜBİTAK Projeleri
              </h3>
              {isSelf && (
                <button 
                  onClick={() => { setAcademicEditTab('publications'); setShowAcademicEditModal(true); }}
                  className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Settings size={12} /> Düzenle
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(academicData.publications || []).map((pub, idx) => (
                <div key={pub.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{pub.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{pub.journal}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 w-fit">
                    {pub.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KART 5: İLETİŞİM & OFİS SAATLERİ */}
          <div className="md:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Clock size={18} className="text-emerald-700" /> İletişim & Öğrenci Ofis Saatleri
              </h3>
              {isSelf && (
                <button 
                  onClick={() => { setOfficeForm(academicData.officeHours); setAcademicEditTab('office'); setShowAcademicEditModal(true); }}
                  className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Settings size={12} /> Bilgileri Güncelle
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-black text-slate-400 uppercase">E-POSTA ADRESİ</p>
                <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Mail size={14} className="text-emerald-700" /> {academicData.officeHours?.email || user?.email || 'akademisyen@esenyurt.edu.tr'}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-black text-slate-400 uppercase">OFİS KONUMU</p>
                <p className="text-xs font-bold text-slate-900 mt-1 flex items-center gap-1.5">
<Clock size={14} className="text-emerald-700" /> {academicData.officeHours?.hours || 'Salı & Perşembe 13:00 - 16:00'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const allItems = combineFeedItems(posts, events, news, announcements, jobs);
  
  const userPosts = allItems.filter(p => {
    const authorName = typeof p.author === 'string' ? p.author : p.author?.name;
    const authorRole = p.author?.role;
    const isMatch = authorName === user?.name || p.company === user?.name;
    const isAdminProfile = user?.role === 'admin' || userType === 'admin' || user?.name === 'Kariyer Geliştirme Merkezi' || userId === 'admin_1513';
    const isAdminPost = authorRole === 'admin' || authorName === 'Kariyer Geliştirme Merkezi';
    return isMatch || (isAdminProfile && isAdminPost);
  });

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1700px] mx-auto px-4 h-16 flex items-center justify-between">
          
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : (userRole === 'employer' || userRole === 'company') ? 'company' : 'student')}>
            <Logo 
              color={userType === 'alumni' ? 'emerald' : userType === 'academic' ? 'indigo' : userType === 'company' ? 'blue' : 'red'} 
              className="h-10 w-auto hover:scale-105 transition-transform shrink-0" 
            />
            <div className="hidden sm:block text-left">
              <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${
                userType === 'alumni' ? 'text-emerald-800' :
                userType === 'academic' ? 'text-indigo-900' :
                userType === 'company' ? 'text-blue-900' :
                'text-[#990000]'
              }`}>İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {userType === 'alumni' ? 'İESÜ Mezunlar Portalı' :
                 userType === 'academic' ? 'Akademik Bilgi & Yönetim Portalı' :
                 userType === 'company' ? 'Kurumsal İnsan Kaynakları Portalı' :
                 'Kariyer Geliştirme Merkezi'}
              </p>
            </div>
          </div>
          
          {/* TOP CENTER DYNAMIC ROLE PORTAL PILL BADGE */}
          <div className="hidden md:flex items-center justify-center pointer-events-none z-20">
            <div className={`px-4 py-1.5 rounded-full text-white font-black text-xs shadow-md border border-white/50 flex items-center gap-2 tracking-wider uppercase whitespace-nowrap shrink-0 ${
              userType === 'admin' ? 'bg-gradient-to-r from-slate-950 via-[#7A0000] to-slate-900 shadow-amber-900/40 border-amber-400/60 text-amber-300' :
              userType === 'alumni' ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-emerald-600/30 border-emerald-300/60' :
              userType === 'academic' ? 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 shadow-purple-950/40 border-purple-400/40' :
              userType === 'company' ? 'bg-gradient-to-r from-blue-950 via-indigo-900 to-sky-900 shadow-blue-950/40 border-sky-400/40' :
              'bg-gradient-to-r from-red-900 via-[#990000] to-red-700 shadow-red-900/30 border-red-300/60'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${userType === 'admin' ? 'bg-amber-400' : 'bg-white'}`}></span>
              {userType === 'admin' ? '👑 KGM SÜPER YÖNETİCİ PORTALI' : userType === 'alumni' ? '🎓 MEZUN PROFİLİ & KARİYER AĞI' : userType === 'academic' ? '🏛️ AKADEMİSYEN PROFİLİ (KGM)' : userType === 'company' ? '🏢 KURUMSAL FİRMA PROFİLİ' : '🎓 ÖĞRENCİ KARİYER PROFİLİ'}
            </div>
          </div>
          
          {/* RIGHT: Notifications & Profile Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-[#990000]`} title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-[#990000]/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu 
              currentUser={currentUser || { name: 'Kullanıcı' }} 
              userRole={userRole || currentUser?.role || 'student'} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              currentView={userType || currentBranch} 
            />
          </div>
          
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-[1320px] mx-auto px-4 lg:px-8 pt-24 pb-20 animate-fade-in">
        {userType === 'student' && renderStudentProfile()}
        {userType === 'alumni' && renderAlumniProfile()}
        {userType === 'company' && renderCompanyProfile()}
        {userType === 'academic' && renderAcademicProfile()}
        {userType === 'admin' && (
          <div className="space-y-6 animate-fade-in">
            {/* EXECUTIVE HERO BANNER (GOLD & ROYAL SLATE PRESTIGE THEME) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="h-48 sm:h-56 bg-gradient-to-r from-slate-950 via-[#0A2342] to-amber-900 relative overflow-hidden">
                <img 
                  src="https://panel.esenyurt.edu.tr/assets/2026/resimler/kurumsaliletisim/98a001cf03524bf49bd45bd3e4810c71_295b798c355c46abb92d8d4e0b02683a.jpg" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-30 scale-105" 
                  alt="Esenyurt University Campus" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>
                
                {/* Badge Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="bg-amber-500/90 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-md">
                    <Crown size={14} className="fill-current" /> SÜPER YÖNETİCİ LİSANSI
                  </span>
                  <span className="bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-md">
                    <ShieldCheck size={14} /> SİSTEM DOĞRULANDI
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-white bg-white shadow-2xl overflow-hidden p-2 flex items-center justify-center shrink-0 relative group -mt-16 sm:-mt-20">
                    <Logo size="xl" className="w-full h-full justify-center" />
                    <div className="absolute bottom-1 right-1 bg-amber-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                      <Crown size={14} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {user?.name || 'Kariyer Geliştirme Merkezi'}
                      </h1>
                      <ShieldCheck size={24} className="text-emerald-500 shrink-0" title="Tam Sistem Yetkilisi" />
                    </div>
                    <p className="text-sm font-bold text-amber-600 flex items-center gap-2">
                      <Crown size={15} className="text-amber-500" /> SÜPER YÖNETİCİ HESABI • İESÜ Kariyer Koordinatörlüğü
                    </p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-4 pt-1">
                      <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> İstanbul Esenyurt Üniversitesi Kampüsü</span>
                      <span className="flex items-center gap-1"><Mail size={13} className="text-slate-400" /> kgm@esenyurt.edu.tr</span>
                    </p>
                  </div>
                </div>

                {/* Quick Action Header Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto pt-2 md:pt-0">
                  <button 
                    onClick={() => setView?.('admin')} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer border border-amber-400/30"
                  >
                    <LayoutDashboard size={16} /> Yönetim Merkezini Aç
                  </button>
                  <button 
                    onClick={() => setView?.('cms_export')} 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download size={16} /> Data Pool Export
                  </button>
                  <button 
                    onClick={() => setView?.('profile_update')} 
                    className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer" 
                    title="Profili Düzenle"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* 3-COLUMN EXECUTIVE BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* COLUMN 1: System Privileges & Unit Information */}
              <div className="space-y-6">
                {/* System Privileges Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <ShieldCheck size={18} className="text-amber-600" /> Sistem Yetkileri & İdari Lisans
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Tüm Sistem Modüllerine Tam Erişim</p>
                        <p className="text-[11px] text-slate-500">Öğrenci, Mezun, Firma ve Akademik panellerin tamamı erişilebilir.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Kullanıcı & Mezun Onay Yetkisi</p>
                        <p className="text-[11px] text-slate-500">Diploma doğrulama ve kaydolma taleplerini onaylama yetkisi.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Firma İlan ve Staj Denetimi</p>
                        <p className="text-[11px] text-slate-500">Kurumsal şirket onayları ve ilan yayın denetimi.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">YÖK & Akreditasyon Raporlaması</p>
                        <p className="text-[11px] text-slate-500">Mezun istihdam verilerini Excel ve PDF çıktısı alabilme yetkisi.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit Details Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Building2 size={18} className="text-blue-600" /> Birim İletişim Bilgileri
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Birim Adı:</span>
                      <span className="font-bold text-slate-900">Kariyer Geliştirme Koordinatörlüğü</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Lokasyon:</span>
                      <span className="font-bold text-slate-900">Merkez Kampüs, Rektörlük Binası</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Resmî E-Posta:</span>
                      <span className="font-bold text-amber-700">kgm@esenyurt.edu.tr</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="font-semibold text-slate-500">Dahili Santral:</span>
                      <span className="font-bold text-slate-900">+90 212 699 00 00 (Dahili: 1040)</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="font-semibold text-slate-500">Çalışma Saatleri:</span>
                      <span className="font-bold text-emerald-600">Hafta içi 08:30 - 17:30</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Live Ecosystem Metrics & Announcements */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 4 Vibrant Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-rose-50 to-red-100/60 p-4 rounded-2xl border border-rose-200 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 shadow-xs">
                      <GraduationCap size={20} />
                    </div>
                    <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Öğrenci Ağı</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{students?.length || 0}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Aktif Öğrenci Kaydı</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-100/60 p-4 rounded-2xl border border-emerald-200 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
                      <Users size={20} />
                    </div>
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Mezun Ağı</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{alumni?.length || 0}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Kayıtlı Mezun Profili</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100/60 p-4 rounded-2xl border border-blue-200 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center mb-2 shadow-xs">
                      <Building2 size={20} />
                    </div>
                    <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Akredite Firma</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{companies?.length || 0}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Kurumsal İş Ortağı</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-100/60 p-4 rounded-2xl border border-amber-200 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 shadow-xs">
                      <Briefcase size={20} />
                    </div>
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Aktif İlanlar</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">{jobs?.length || 0}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Açık Kariyer Fırsatı</p>
                  </div>
                </div>

                {/* Fast Quick System Controls Banner */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                  <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-amber-400">
                    <Zap size={18} /> Hızlı Yönetim Komutları
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 max-w-xl">
                    Kariyer Geliştirme Merkezi üzerinden sistem modüllerini doğrudan yönetin, rapor oluşturun veya toplu işlemler başlatın.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button onClick={() => setView?.('admin')} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition flex flex-col items-center gap-1.5 border border-white/10 cursor-pointer">
                      <LayoutDashboard size={18} className="text-amber-400" /> Yönetim Paneli
                    </button>
                    <button onClick={() => setView?.('cms_export')} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition flex flex-col items-center gap-1.5 border border-white/10 cursor-pointer">
                      <Download size={18} className="text-emerald-400" /> Data Pool Export
                    </button>
                    <button onClick={() => setView?.('profile_update')} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition flex flex-col items-center gap-1.5 border border-white/10 cursor-pointer">
                      <Settings size={18} className="text-blue-400" /> Sistem Ayarları
                    </button>
                    <button onClick={() => setView?.('admin')} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-white transition flex flex-col items-center gap-1.5 border border-white/10 cursor-pointer">
                      <CheckCircle2 size={18} className="text-purple-400" /> Kullanıcı Onayları
                    </button>
                  </div>
                </div>

                {/* Official Announcements & Activity Posts */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={18} className="text-amber-600" /> KGM Resmî Paylaşımları & Duyuruları
                    </h3>
                    <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                      {userPosts.length} Gönderi
                    </span>
                  </div>

                  {userPosts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                      <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-bold">Henüz resmî paylaşım yapılmadı.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Süper Yönetici Akış sayfasından ilk duyuruyu yayınlayabilirsiniz.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPosts.map(post => (
                        <div key={post.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-amber-300 transition">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                              KGM
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900">{typeof post.author === 'object' ? (post.author?.name || 'Kariyer Geliştirme Merkezi') : (post.author || post.authorName || 'Kariyer Geliştirme Merkezi')}</h4>
                              <p className="text-[10px] text-slate-400 font-medium">{post.date || 'Yakın Zaman'}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* ─── RESMÎ DANIŞMANLIK & RANDEVU TALEBİ İLET MODALI (EMERALD FOREST PRESTIGE THEME #064E3B) ─── */}
      {showMentorshipRequestModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100 animate-slide-up relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-[#064E3B] to-[#0D9488] p-6 text-white shrink-0 relative border-b border-emerald-500/30">
              <button 
                onClick={() => setShowMentorshipRequestModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-black">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">Resmî Akademik Danışmanlık & Randevu Talebi</h3>
                  <p className="text-xs text-emerald-200 font-medium">İESÜ Akademisyen & Öğrenci/Mezun Resmi İletişim Havuzu</p>
                </div>
              </div>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSendMentorshipRequest} className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-700">
              {/* Target Academic Member Summary */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center gap-3">
                <SafeAvatar
                  src={user?.avatar}
                  name={user?.name || 'Akademisyen'}
                  size="lg"
                  rounded="rounded-xl"
                  className="border border-emerald-200 shadow-sm"
                  alt={user?.name || 'Akademisyen'}
                />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1">
                    {user?.name || 'Prof. Dr. Ahmet Yılmaz'} <ShieldCheck size={14} className="text-emerald-600" />
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{user?.title || 'Bölüm Başkanı'} • {user?.department || 'Bilgisayar Mühendisliği'}</p>
                </div>
              </div>

              {/* Subject Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Danışmanlık / Randevu Konusu</label>
                <select 
                  value={mentorshipReqForm.topic} 
                  onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, topic: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition"
                >
                  <option value="Bitirme Projesi & TÜBİTAK Danışmanlığı">Bitirme Projesi & TÜBİTAK Danışmanlığı</option>
                  <option value="Kariyer Yol Haritası & Danışmanlık">Kariyer Yol Haritası & Sektör Danışmanlığı</option>
                  <option value="Akademik Yüksek Lisans / Doktora Tavsiye Mektubu">Akademik Referans & Mektup Talebi</option>
                  <option value="Ders & Müfredat Randevusu">Ofis Saati & Ders Müfredat Randevusu</option>
                  <option value="Sanayi Proje Ortaklığı">Sanayi Proje Ortaklığı (Mezunlar İçin)</option>
                </select>
              </div>

              {/* Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Tercih Edilen Resmî Görüşme Biçimi</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Yüz Yüze Kampüs Görüşmesi', label: 'Yüz Yüze (Akademisyen Ofisi)', icon: '🏛️' },
                    { id: 'Resmî Kurumsal E-Posta', label: 'Resmî E-Posta İletişimi', icon: '✉️' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setMentorshipReqForm({ ...mentorshipReqForm, mode: mode.id })}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        mentorshipReqForm.mode === mode.id
                          ? 'bg-gradient-to-r from-slate-950 via-[#064E3B] to-[#0D9488] text-white border-emerald-500/40 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{mode.icon}</span>
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Slot Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Randevu Tarihi</label>
                  <input 
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={mentorshipReqForm.preferredDate}
                    onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, preferredDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Saat Dilimi</label>
                  <select
                    value={mentorshipReqForm.preferredTimeSlot}
                    onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, preferredTimeSlot: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition"
                  >
                    <option value="10:00 - 10:30">10:00 - 10:30 (Sabah)</option>
                    <option value="11:30 - 12:00">11:30 - 12:00 (Öğleden Önce)</option>
                    <option value="14:00 - 14:30">14:00 - 14:30 (Öğleden Sonra)</option>
                    <option value="15:30 - 16:00">15:30 - 16:00 (Akşamüstü)</option>
                    <option value="Ofis Saatleri İçerisinde">Ofis Saatleri İçerisinde (Esnek)</option>
                  </select>
                </div>
              </div>

              {/* Kurumsal E-Posta Adresi (Resmî İletişim İçin) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Kurumsal E-Posta Adresiniz (Resmî Dönüş İçin)</label>
                <input 
                  type="email"
                  required
                  placeholder="ad.soyad@esenyurt.edu.tr veya kurumsal e-posta"
                  value={mentorshipReqForm.contactEmail}
                  onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, contactEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              {/* Detailed Message / Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Görüşme Talebi ve Detaylı Açıklamanız</label>
                <textarea 
                  rows={3}
                  required
                  value={mentorshipReqForm.note}
                  onChange={e => setMentorshipReqForm({ ...mentorshipReqForm, note: e.target.value })}
                  placeholder="Görüşmek istediğiniz konu detayları, akademik beklentileriniz veya sorularınızı yazınız..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-emerald-900 text-[11px] font-medium leading-relaxed">
                ℹ️ <strong>KGM Resmî Bildirimi:</strong> Bu randevu talebi akademisyenin kurumsal e-posta adresine ve KGM Danışmanlık Kayıt Sistemine resmî evrak niteliğinde kaydedilir.
              </div>

              {/* Form Action Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowMentorshipRequestModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-xs font-black bg-[#990000] hover:bg-red-800 text-white shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Mail size={15} /> Talebi Resmî Olarak Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Followers Modal (Instagram Style Engine) */}
      {followersModal.isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-slate-50/80">
              <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                <Users className="text-[#990000]" size={18} />
                {followersModal.title}
              </h3>
              <button 
                onClick={() => setFollowersModal({isOpen: false, title: '', users: []})} 
                className="text-gray-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
              {followersModal.users?.length > 0 ? (
                <div className="space-y-2">
                  {followersModal.users.map((u, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition cursor-pointer group"
                      onClick={() => {
                        if (setSelectedUserId && u.id) setSelectedUserId(u.id);
                        setFollowersModal({isOpen: false, title: '', users: []});
                        setView('user_profile');
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SafeAvatar 
                          name={u.name} 
                          src={u.avatar || u.logo} 
                          isAdmin={u.role === 'admin'} 
                          size="md" 
                          rounded="rounded-2xl" 
                          className="shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-900 leading-tight truncate group-hover:text-[#990000] transition">{u.name}</p>
                          <p className="text-[10px] font-bold text-gray-500 truncate mt-0.5">
                            {u.typeLabel || u.department || u.title || (u.role === 'academic' ? 'Akademisyen Hoca' : u.role === 'company' ? 'Kurumsal Partner' : 'Öğrenci')}
                          </p>
                        </div>
                      </div>

                      {/* ROLE-SPECIFIC INSTAGRAM FOLLOW BUTTONS */}
                      <div className="shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                        {(u.role === 'student' || u.role === 'alumni') ? (
                          u.isMutual ? (
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-xl flex items-center gap-1">
                              <UserCheck size={12} /> Geri Takip Ediliyor
                            </span>
                          ) : (
                            <button 
                              onClick={() => {
                                window.toast?.success(`${u.name} takibe alındı! Karşılıklı takip başlatıldı.`);
                              }}
                              className="px-3 py-1.5 bg-[#990000] hover:bg-red-800 text-white text-[10px] font-black rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <UserPlus size={12} /> Geri Takip Et
                            </button>
                          )
                        ) : u.role === 'academic' ? (
                          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black rounded-xl flex items-center gap-1">
                            <BookOpen size={12} /> Hoca Takip Ediliyor
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black rounded-xl flex items-center gap-1">
                            <Building2 size={12} /> Takip Ediliyor
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 font-bold text-xs bg-slate-50 rounded-2xl">
                  Henüz kayıtlı üye veya takipçi bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload & Background Design Selection Modal */}
      {showImageUploadModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/80">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                <Camera className="text-[#990000]" size={22} />
                {uploadType === 'avatar' ? 'Firma Logosu / Profil Fotoğrafı Güncelle' : 'Kapak / Arka Tasarım Fotoğrafı Güncelle'}
              </h3>
              <button onClick={() => setShowImageUploadModal(false)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-xl hover:bg-red-50 transition"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto bg-[#F8F9FC]">
              
              {/* Preview Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Mevcut Önizleme</label>
                <div className={`relative w-full overflow-hidden bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center ${uploadType === 'cover' ? 'h-36 sm:h-44' : 'h-32 w-32 mx-auto rounded-2xl'}`}>
                  {customImageUrl ? (
                    <img src={customImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <Camera size={36} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-medium">Fotoğraf Yok / Seçilmedi</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 1. Local File Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Cihazınızdan Fotoğraf Yükleyin</label>
                <label className="w-full py-4 bg-white border-2 border-dashed border-red-200 rounded-2xl flex items-center justify-center gap-3 text-[#990000] cursor-pointer hover:bg-red-50/50 hover:border-[#990000] transition font-bold text-sm shadow-sm group">
                  <Camera size={20} className="group-hover:scale-110 transition-transform" />
                  Dosya Seç (PNG, JPG, WEBP)
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            setCustomImageUrl(evt.target.result);
                            window.toast?.success('Fotoğraf başarıyla yüklendi, kaydet butonuna tıklayabilirsiniz.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* 2. Custom URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Veya Fotoğraf Bağlantısı (URL) Girin</label>
                <div className="relative">
                  <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              {/* 3. Hazır Kurumsal Şablonlar (Preset Covers / Logos) */}
              <div className="space-y-2 pt-2 border-t border-gray-200/80">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block flex items-center justify-between">
                  {uploadType === 'cover' ? 'Hazır Arka Tasarım Şablonları' : 'Hazır Firma Logoları'}
                  <span className="text-[10px] text-[#990000] font-bold">1-Tıkla Seç</span>
                </label>
                
                {uploadType === 'cover' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Kurumsal Plaza & Finans Kulesi', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Teknoloji & İnovasyon Ofisi', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'İESÜ Kampüs & Ar-Ge Merkezi', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80' },
                      { name: 'Kırmızı Kurumsal Tema', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomImageUrl(preset.url)}
                        className={`group relative h-20 rounded-xl overflow-hidden border-2 text-left transition-all ${customImageUrl === preset.url ? 'border-[#990000] ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors p-2 flex items-end">
                          <span className="text-[10px] font-bold text-white leading-tight drop-shadow">{preset.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Geometrik Tech Logo', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80' },
                      { name: 'Kurumsal Amblem', url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80' },
                      { name: 'İESÜ Logo', url: '/iesu-logo.svg' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomImageUrl(preset.url)}
                        className={`p-2 bg-white rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${customImageUrl === preset.url ? 'border-[#990000] ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-400'}`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-12 h-12 object-contain" />
                        <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setShowImageUploadModal(false)} className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">İptal</button>
              <button
                onClick={() => {
                  if (!customImageUrl) {
                    window.toast?.info('Lütfen bir görsel yükleyin veya seçin.');
                    return;
                  }
                  const updatedUser = { ...user };
                  if (uploadType === 'cover') {
                    updatedUser.coverImage = customImageUrl;
                    updatedUser.cover = customImageUrl;
                  } else {
                    updatedUser.logo = customImageUrl;
                    updatedUser.avatar = customImageUrl;
                  }
                  setUser(updatedUser);
                  if (setCompanies) {
                    setCompanies(prev => (prev || []).map(c => (c.id === user?.id || c.name === user?.name) ? { ...c, ...updatedUser } : c));
                  }
                  try {
                    const stored = JSON.parse(localStorage.getItem('iesu_mock_user') || localStorage.getItem('igu_mock_user') || '{}');
                    if (stored) {
                      localStorage.setItem('iesu_mock_user', JSON.stringify({ ...stored, ...updatedUser }));
                      localStorage.setItem('igu_mock_user', JSON.stringify({ ...stored, ...updatedUser }));
                    }
                  } catch (e) {}
                  setShowImageUploadModal(false);
                  window.toast?.success(uploadType === 'cover' ? 'Kapak / Arka tasarım fotoğrafı güncellendi!' : 'Firma logosu güncellendi!');
                }}
                className="px-6 py-2.5 text-xs font-black bg-[#990000] hover:bg-red-800 text-white rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Görseli Kaydet ve Uygula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── AKADEMİK BİLGİ DÜZENLEME VE YÖNETİM MODALI (Z-[9999]) ─── */}
      {showAcademicEditModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-red-950 via-[#7A0000] to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center font-black">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Akademik Profil Bilgilerini Güncelle</h3>
                  <p className="text-[11px] text-red-200 font-medium">Yürüttüğünüz Dersler, Yayınlar ve Ofis İletişim Saatleri</p>
                </div>
              </div>

              <button 
                onClick={() => setShowAcademicEditModal(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Sub Nav Tabs */}
            <div className="flex border-b border-gray-100 bg-slate-50 p-2 gap-2 shrink-0">
              <button 
                onClick={() => setAcademicEditTab('courses')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${academicEditTab === 'courses' ? 'bg-[#990000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                📚 Yürüttüğü Dersler ({academicData.courses?.length || 0})
              </button>
              <button 
                onClick={() => setAcademicEditTab('publications')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${academicEditTab === 'publications' ? 'bg-[#990000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                🏆 Yayın & Projeler ({academicData.publications?.length || 0})
              </button>
              <button 
                onClick={() => setAcademicEditTab('office')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer ${academicEditTab === 'office' ? 'bg-[#990000] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                📍 İletişim & Ofis Saatleri
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white custom-scrollbar">
              
              {/* TAB 1: DERSLER */}
              {academicEditTab === 'courses' && (
                <div className="space-y-5">
                  <div className="bg-red-50/60 border border-red-100 p-4 rounded-2xl space-y-3">
                    <h4 className="font-black text-[#990000] text-xs uppercase tracking-wider">Yeni Ders Ekle</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input 
                        type="text" 
                        placeholder="Ders Kodu (Örn: BM301)" 
                        value={newCourseForm.code}
                        onChange={e => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                      />
                      <input 
                        type="text" 
                        placeholder="Ders Adı (Örn: Yapay Zekaya Giriş)" 
                        value={newCourseForm.name}
                        onChange={e => setNewCourseForm({ ...newCourseForm, name: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                      />
                      <select 
                        value={newCourseForm.type}
                        onChange={e => setNewCourseForm({ ...newCourseForm, type: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                      >
                        <option value="Lisans">Lisans</option>
                        <option value="Yüksek Lisans">Yüksek Lisans</option>
                        <option value="Doktora">Doktora</option>
                        <option value="Önlisans">Önlisans</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => {
                        if (!newCourseForm.code || !newCourseForm.name) {
                          window.toast?.info('Lütfen ders kodunu ve ders adını giriniz.');
                          return;
                        }
                        const updated = {
                          ...academicData,
                          courses: [
                            ...(academicData.courses || []),
                            { id: Date.now(), ...newCourseForm }
                          ]
                        };
                        saveAcademicData(updated);
                        setNewCourseForm({ code: '', name: '', type: 'Lisans' });
                        window.toast?.success('Yeni ders başarıyla eklendi!');
                      }}
                      className="w-full py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus size={15} /> Dersi Listeye Ekle
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-3">Mevcut Yürütülen Dersler</h4>
                    <div className="space-y-2">
                      {(academicData.courses || []).map((c, idx) => (
                        <div key={c.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <span className="font-black text-xs text-[#990000]">{c.code}</span> — <span className="font-bold text-slate-800 text-xs">{c.name}</span>
                            <span className="ml-2 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                              {c.type}
                            </span>
                          </div>
                          <button 
                            onClick={() => {
                              const updated = {
                                ...academicData,
                                courses: (academicData.courses || []).filter((_, i) => i !== idx)
                              };
                              saveAcademicData(updated);
                              window.toast?.success('Ders listeden kaldırıldı.');
                            }}
                            className="text-xs text-rose-600 font-bold hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer"
                          >
                            Sil ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: YAYIN & PROJELER */}
              {academicEditTab === 'publications' && (
                <div className="space-y-5">
                  <div className="bg-red-50/60 border border-red-100 p-4 rounded-2xl space-y-3">
                    <h4 className="font-black text-[#990000] text-xs uppercase tracking-wider">Yeni Yayın / TÜBİTAK Projesi Ekle</h4>
                    <input 
                      type="text" 
                      placeholder="Yayın veya Proje Başlığı" 
                      value={newPubForm.title}
                      onChange={e => setNewPubForm({ ...newPubForm, title: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Dergi / Kurum Bilgisi (Örn: IEEE Transactions • 2025)" 
                        value={newPubForm.journal}
                        onChange={e => setNewPubForm({ ...newPubForm, journal: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                      />
                      <select 
                        value={newPubForm.badge}
                        onChange={e => setNewPubForm({ ...newPubForm, badge: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                      >
                        <option value="SCI-E Makale">SCI-E Makale</option>
                        <option value="TÜBİTAK Projesi">TÜBİTAK Projesi</option>
                        <option value="Uluslararası Bildiri">Uluslararası Bildiri</option>
                        <option value="Akademik Kitap">Akademik Kitap</option>
                        <option value="Patent / Buluş">Patent / Buluş</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => {
                        if (!newPubForm.title || !newPubForm.journal) {
                          window.toast?.info('Lütfen yayın başlığı ve dergi bilgisini giriniz.');
                          return;
                        }
                        const updated = {
                          ...academicData,
                          publications: [
                            ...(academicData.publications || []),
                            { id: Date.now(), ...newPubForm }
                          ]
                        };
                        saveAcademicData(updated);
                        setNewPubForm({ title: '', journal: '', badge: 'SCI-E Makale' });
                        window.toast?.success('Yeni yayın / proje başarıyla eklendi!');
                      }}
                      className="w-full py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus size={15} /> Yayını Listeye Ekle
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-xs mb-3">Mevcut Yayın ve Projeler</h4>
                    <div className="space-y-2">
                      {(academicData.publications || []).map((pub, idx) => (
                        <div key={pub.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">{pub.title}</h5>
                            <p className="text-[11px] text-slate-500">{pub.journal} • <span className="font-bold text-[#990000]">{pub.badge}</span></p>
                          </div>
                          <button 
                            onClick={() => {
                              const updated = {
                                ...academicData,
                                publications: (academicData.publications || []).filter((_, i) => i !== idx)
                              };
                              saveAcademicData(updated);
                              window.toast?.success('Yayın listeden kaldırıldı.');
                            }}
                            className="text-xs text-rose-600 font-bold hover:bg-rose-50 px-2 py-1 rounded-lg transition cursor-pointer shrink-0"
                          >
                            Sil ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OFİS BİLGİLERİ */}
              {academicEditTab === 'office' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Kurumsal E-Posta Adresi</label>
                    <input 
                      type="email" 
                      value={officeForm.email || ''}
                      onChange={e => setOfficeForm({ ...officeForm, email: e.target.value })}
                      placeholder="akademisyen@esenyurt.edu.tr" 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ofis Konumu & Oda No</label>
                    <input 
                      type="text" 
                      value={officeForm.location || ''}
                      onChange={e => setOfficeForm({ ...officeForm, location: e.target.value })}
                      placeholder="Örn: B-Blok Kat: 3 Oda: 304" 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Öğrenci Ofis / Görüşme Saatleri</label>
                    <input 
                      type="text" 
                      value={officeForm.hours || ''}
                      onChange={e => setOfficeForm({ ...officeForm, hours: e.target.value })}
                      placeholder="Örn: Salı & Perşembe 13:00 - 16:00" 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#990000]"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const updated = {
                        ...academicData,
                        officeHours: officeForm
                      };
                      saveAcademicData(updated);
                      setShowAcademicEditModal(false);
                      window.toast?.success('İletişim ve ofis saatleri güncellendi!');
                    }}
                    className="w-full py-3 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md mt-2"
                  >
                    Ofis Bilgilerini Kaydet ve Güncelle
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ─── DİNAMİK ALT NAVİGASYON DOCK'U (HER DALA ÖZEL EGEMEN DOCK) ─── */}
      {isAdminBranch ? (
        /* 👑 SÜPER YÖNETİCİ & KGM ALTIN SARISI DOCK (Ana Akış ile %100 Birebir Uyumlu) */
        <AdminOmniDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId} 
          activeTab="profile"
          theme="amber" 
        />
      ) : isAcademicBranch ? (
        /* 🏛️ AKADEMİK KADROYA ÖZEL ASİL MOR DOCK (Ana Akış ile Birebir Uyumlu #4C1D95) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[340px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-purple-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(76,29,149,0.2)] flex items-center justify-around px-4 text-gray-800">
            {/* 1. Akademik Akış & Ana Sayfa */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('academic');
                if (setView) setView('academic');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="p-2.5 rounded-full bg-[#4C1D95] text-white shadow-md shadow-purple-900/30 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
              title="Akademik Akış & Ana Sayfa"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            
            {/* 2. Staj & Evrak Onayı */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('academic');
                if (setView) setView('academic');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#4C1D95] via-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/40 cursor-pointer" 
              title="Evrak & Staj Onayı"
            >
              <FileText size={22} strokeWidth={2.5} />
            </button>

            {/* 3. Araştırma OS Hub */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('academic');
                if (setView) setView('research_hub');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-50 to-indigo-100 text-purple-900 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/60 cursor-pointer" 
              title="Araştırma OS Hub"
            >
              <BookOpen size={20} strokeWidth={2.5} />
            </button>

            {/* 4. Akademik Profilim */}
            <button 
              onClick={() => {
                if (setSelectedUserId) setSelectedUserId(currentUser?.id || 'ACAD-001');
                if (setView) setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#4C1D95] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Akademik Profilim"
            >
              <SafeAvatar src={currentUser?.avatar} name={currentUser?.name || 'Akademik'} size="xs" alt="Akademisyen" />
            </button>
          </div>
        </div>
      ) : isCompanyBranch ? (
        /* 🏢 KURUMSAL FİRMAYA ÖZEL LACİVERT DOCK (Ana Akış ile Birebir Uyumlu #0A2342) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-blue-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(10,35,66,0.22)] flex items-center justify-between px-4 text-slate-800">
            {/* 1. Kurumsal Akış */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('company');
                if (setView) setView('company');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="p-2.5 rounded-full bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white shadow-md shadow-blue-950/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
              title="Kurumsal Akış & Ana Sayfa"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            
            {/* 2. Yeni İlan Yayınla */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('company');
                if (setView) setView('create_job');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-[#0A2342] to-indigo-800 text-white shadow-lg shadow-blue-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-blue-300/40 cursor-pointer" 
              title="Yeni İlan Yayınla"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
            
            {/* 3. ATS Aday Takip Panosu */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                if (store.setActivePortalBranch) store.setActivePortalBranch('company');
                if (setView) setView('company_ats');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
              title="ATS Aday Takip Panosu (Kanban)"
            >
              <Briefcase size={22} strokeWidth={2.5} />
            </button>
            
            {/* 4. Firma Profilim */}
            <button 
              onClick={() => {
                if (setSelectedUserId) setSelectedUserId(currentUser?.id || 'CMP-001');
                if (setView) setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#0A2342] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Kurumsal Firma Profilim"
            >
              <SafeAvatar src={currentUser?.avatar || currentUser?.logo} name={currentUser?.name || 'Firma'} size="xs" alt="Firma" />
            </button>
          </div>
        </div>
      ) : isAlumniBranch ? (
        /* 🌿 MEZUNLAR AĞINA ÖZEL ZÜMRÜT DOCK (#064E3B) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-emerald-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(6,78,59,0.18)] flex items-center justify-between px-4 text-gray-800">
            {/* 1. Mezun Akışı */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('alumni'); setView('alumni'); }} 
              className="p-2.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center cursor-pointer" 
              title="Mezun Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Mezun Kariyer & İş İlanları */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('alumni'); setView('jobs'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/40 cursor-pointer" 
              title="Mezun İş & Kariyer Olanakları"
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </button>
            {/* 3. Küresel Mezun Haritası */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('alumni'); setView('global_map'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-800 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/60 cursor-pointer" 
              title="Küresel Mezun Haritası & Ağı"
            >
              <Globe size={20} strokeWidth={2.5} />
            </button>
            {/* 4. Mezun Profilim */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('alumni');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-emerald-600 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Mezun Profilim"
            >
              <SafeAvatar 
                src={currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Mezun'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : (
        /* 🎓 ÖĞRENCİYE ÖZEL KIRMIZI DOCK (#990000) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(153,0,0,0.18)] flex items-center justify-between px-4 text-gray-800">
            {/* 1. Öğrenci Akışı */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('student'); setView('student'); }} 
              className="p-2.5 rounded-full text-slate-600 hover:text-[#990000] hover:bg-red-50 transition-all flex items-center justify-center cursor-pointer" 
              title="Öğrenci Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. İş & Staj Olanakları */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('student'); setView('jobs'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" 
              title="Öğrenci İş & Staj Olanakları"
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </button>
            {/* 3. Keşfet */}
            <button 
              onClick={() => { const store = useAppStore.getState(); store.setActivePortalBranch?.('student'); setView('explore'); }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-red-600 to-rose-700 text-white shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/60 cursor-pointer" 
              title="Keşfet & Sosyal Ağ"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>
            {/* 4. Öğrenci Profilim */}
            <button 
              onClick={() => {
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('student');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#990000] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
              title="Öğrenci Profilim"
            >
              <SafeAvatar 
                src={currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Öğrenci'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      )}

      {/* ─── LİKERT ÖLÇEKLİ ÖĞRENCİ FİRMA DEĞERLENDİRME MODALI (CORPORATE SAPPHIRE THEME #0A2342) ─── */}
      {showCompanyReviewModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative">
            <div className="p-5 bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 text-white flex items-center justify-between border-b border-blue-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black">
                  <Star size={22} className="fill-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">{user?.name || 'Firma'} Değerlendirmesi</h3>
                  <p className="text-[11px] text-blue-200 font-medium">1-5 Likert Ölçeği & Staj Deneyim Formu</p>
                </div>
              </div>
              <button onClick={() => setShowCompanyReviewModal(false)} className="w-8 h-8 rounded-xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Likert 1-5 Yıldız Seçimi */}
              <div className="text-center space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Genel Memnuniyet Puanı (1 - 5 Yıldız)</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setCompanyReviewForm({ ...companyReviewForm, rating: star })}
                      className="p-2 transition hover:scale-125 cursor-pointer text-2xl"
                    >
                      <Star size={32} className={star <= companyReviewForm.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"} />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/80 py-1 px-3 rounded-full inline-block">
                  {companyReviewForm.rating === 5 ? '5/5 - Mükemmel Deneyim' : companyReviewForm.rating === 4 ? '4/5 - Çok İyi' : companyReviewForm.rating === 3 ? '3/5 - Ortalama' : companyReviewForm.rating === 2 ? '2/5 - Geliştirilmeli' : '1/5 - Yetersiz'}
                </p>
              </div>

              {/* Katılınan Program Türü */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Katıldığınız Program / Deneyim Türü</label>
                <select 
                  value={companyReviewForm.programType} 
                  onChange={e => setCompanyReviewForm({ ...companyReviewForm, programType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-700 focus:bg-white transition"
                >
                  <option value="Zorunlu Staj">Zorunlu Staj Programı</option>
                  <option value="İsteğe Bağlı Staj">İsteğe Bağlı Staj</option>
                  <option value="Kariyer Fuarı / Festival">Kariyer Fuarı / Stant Mülakatı</option>
                  <option value="Tam Zamanlı Çalışan">Tam Zamanlı Çalışan / Mezun</option>
                </select>
              </div>

              {/* Detaylı Yorum */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Deneyim & Yorumunuz (KGM Yönetici Onaylı)</label>
                <textarea 
                  rows={3} 
                  value={companyReviewForm.comment}
                  onChange={e => setCompanyReviewForm({ ...companyReviewForm, comment: e.target.value })}
                  placeholder="Firma ortamı, mentörlük, staj olanakları ve öğrenme imkanları hakkındaki tarafsız görüşlerinizi yazın..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium outline-none focus:border-blue-700 focus:bg-white transition"
                />
              </div>

              <button 
                onClick={() => {
                  try {
                    const newRev = {
                      id: 'rev_' + Date.now(),
                      companyId: user?.id,
                      companyName: user?.name,
                      studentName: currentUser?.name || 'Anonim Öğrenci',
                      studentDepartment: currentUser?.department || 'Bilgisayar Mühendisliği',
                      rating: companyReviewForm.rating,
                      programType: companyReviewForm.programType,
                      comment: companyReviewForm.comment || 'Staj deneyimi başarıyla tamamlandı.',
                      createdAt: new Date().toISOString(),
                      status: 'pending'
                    };
                    const existing = JSON.parse(localStorage.getItem('iesu_company_reviews_v1') || '[]');
                    localStorage.setItem('iesu_company_reviews_v1', JSON.stringify([newRev, ...existing]));
                    setShowCompanyReviewModal(false);
                    window.toast?.success('Değerlendirmeniz KGM Yönetici Onay Havuzuna iletildi! Teşekkür ederiz.');
                  } catch (e) {
                    setShowCompanyReviewModal(false);
                  }
                }}
                className="w-full py-3.5 bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 hover:from-slate-900 hover:to-blue-800 text-white rounded-2xl font-black text-xs shadow-md transition cursor-pointer border border-blue-800/60"
              >
                Değerlendirmeyi KGM Yönetici Onayına Gönder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── UYGULAMALI STAJ SÜRESİ DÜZENLEME MODALI (CORPORATE NAVY THEME #0A2342) ─── */}
      {showInternshipDurationEditModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative">
            <div className="p-5 bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 text-white flex items-center justify-between border-b border-blue-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-blue-300 flex items-center justify-center font-black">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Uygulamalı Staj Süresini Düzenle</h3>
                  <p className="text-[11px] text-blue-200 font-medium">Şirketinizin staj modelini güncelleyin</p>
                </div>
              </div>
              <button onClick={() => setShowInternshipDurationEditModal(false)} className="w-8 h-8 rounded-xl bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition">✕</button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Staj Süresi / Modeli Tanımı</label>
                <input 
                  type="text" 
                  value={tempInternshipDuration}
                  onChange={e => setTempInternshipDuration(e.target.value)}
                  placeholder="Örn: 20 İş Günü (1 Ay)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0A2342]"
                />
              </div>

              {/* Hızlı Şablon Seçenekleri */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Hazır Şablonlar</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '20 İş Günü (1 Ay)',
                    '30 İş Günü (1.5 Ay)',
                    '60 İş Günü (3 Ay)',
                    '3 Ay Proje Stajı',
                    '6 Ay Uzun Dönem'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempInternshipDuration(preset)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#0A2342] text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowInternshipDurationEditModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  İptal
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const updated = { ...user, internshipDuration: tempInternshipDuration || '20 İş Günü (1 Ay)' };
                    setUser(updated);
                    try {
                      const stored = JSON.parse(localStorage.getItem('iesu_mock_user') || localStorage.getItem('igu_mock_user') || '{}');
                      localStorage.setItem('iesu_mock_user', JSON.stringify({ ...stored, ...updated }));
                      localStorage.setItem('igu_mock_user', JSON.stringify({ ...stored, ...updated }));
                    } catch(e) {}
                    setShowInternshipDurationEditModal(false);
                    window.toast?.success('Staj süresi başarıyla güncellendi!');
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-900 hover:from-slate-900 hover:to-blue-800 text-white shadow-md transition border border-blue-800/60"
                >
                  Kaydet ve Uygula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
