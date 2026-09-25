import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MessageCircle, X, Maximize2, Send, ChevronLeft, UserCheck, Calendar, Clock, 
  MapPin, ShieldCheck, CheckCircle2, ExternalLink, ChevronRight, User, Users, Briefcase,
  GraduationCap, Search, Sparkles, Building2, Award, Inbox, Layers, MessageSquare,
  Check, ArrowRight, Bell, Crown, Scale, FileText, CheckCircle, XCircle, AlertCircle,
  Filter, ShieldAlert, CheckCheck, LayoutDashboard
} from 'lucide-react';
import useAppStore from '../store/useAppStore';

const INITIAL_CANDIDATE_CHATS = [
  {
    id: 'chat_cand_1',
    candidateId: 'app-1',
    candidateName: 'Ahmet Yılmaz',
    candidateAvatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=0A2342&color=fff',
    candidateDept: 'Bilgisayar Mühendisliği',
    candidateRole: 'Frontend Developer',
    companyName: 'Aselsan Savunma & Teknoloji',
    lastActive: 'Bugün 12:40',
    unreadCount: 1,
    status: 'Mülakat',
    messages: [
      { id: 'm1', sender: 'candidate', senderName: 'Ahmet Yılmaz', text: 'Merhaba, firmanızın açtığı Frontend Developer ilanına başvuruda bulundum. Portfolyomu inceleyebildiniz mi?', time: 'Dün 14:15' },
      { id: 'm2', sender: 'company', senderName: 'İnsan Kaynakları (Aselsan)', text: 'Merhaba Ahmet Bey, React ve Tailwind projelerinizi inceledik, gayet başarılı. Cuma günü saat 14:00 için online ön mülakat ayarlamak isteriz.', time: 'Bugün 10:20' },
      { id: 'm3', sender: 'candidate', senderName: 'Ahmet Yılmaz', text: 'Harika bir haber! Cuma günü saat 14:00 için kesinlikle uygunum, toplantı bağlantısını bekliyorum.', time: 'Bugün 12:40' }
    ]
  },
  {
    id: 'chat_cand_2',
    candidateId: 'app-2',
    candidateName: 'Ayşe Demir',
    candidateAvatar: 'https://ui-avatars.com/api/?name=Ayşe+Demir&background=0A2342&color=fff',
    candidateDept: 'Görsel İletişim Tasarımı',
    candidateRole: 'UI/UX Tasarımcı',
    companyName: 'Trendyol Tech Labs',
    lastActive: 'Dün 16:30',
    unreadCount: 0,
    status: 'İletişime Geçildi',
    messages: [
      { id: 'm1', sender: 'company', senderName: 'Tasarım Ekip Lideri (Trendyol)', text: 'Merhaba Ayşe Hanım, Behance portfolyonuzdaki mobil tasarım case çalışmanızı çok beğendik.', time: 'Dün 15:10' },
      { id: 'm2', sender: 'candidate', senderName: 'Ayşe Demir', text: 'Çok teşekkürler! Figma prototiplerinin interaktif linklerini de paylaşabilirim.', time: 'Dün 16:30' }
    ]
  },
  {
    id: 'chat_cand_3',
    candidateId: 'app-4',
    candidateName: 'Zeynep Kaya',
    candidateAvatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=0A2342&color=fff',
    candidateDept: 'Bilgisayar Mühendisliği',
    candidateRole: 'Backend Engineer',
    companyName: 'Getir Core Platform',
    lastActive: '2 gün önce',
    unreadCount: 0,
    status: 'Teklif Aşaması',
    messages: [
      { id: 'm1', sender: 'company', senderName: 'İnsan Kaynakları (Getir)', text: 'Zeynep Hanım merhaba, teknik değerlendirme süreciniz başarıyla tamamlandı. Detayları görüşmek üzere hazırız.', time: '2 gün önce' }
    ]
  },
  {
    id: 'chat_peer_1',
    candidateId: 'ALU-001',
    candidateName: 'Caner Öztürk',
    candidateAvatar: 'https://ui-avatars.com/api/?name=Caner+Öztürk&background=EA580C&color=fff',
    candidateDept: 'Frontend Developer • Trendyol',
    candidateRole: 'alumni',
    candidateCompany: 'Trendyol',
    lastActive: '1 saat önce',
    unreadCount: 0,
    status: 'Mentörlük',
    messages: [
      { id: 'm1', sender: 'candidate', senderName: 'Alperen Yılmaz', text: 'Caner Bey merhaba, İESÜ Mezun Ağı üzerinden profilinize ulaştım. Frontend alanında mentörlük desteği alabilir miyim?', time: 'Dün 16:30' },
      { id: 'm2', sender: 'alumni', senderName: 'Caner Öztürk', text: 'Selam Alperen! Tabii ki, Trendyol frontend mimarisi ve React/Next.js mülakat süreçleri hakkında haftalık seans yapabiliriz.', time: '1 saat önce' }
    ]
  },
  {
    id: 'chat_peer_2',
    candidateId: 'ALU-002',
    candidateName: 'Seda Çelik',
    candidateAvatar: 'https://ui-avatars.com/api/?name=Seda+Çelik&background=EA580C&color=fff',
    candidateDept: 'Üretim ve Operasyon Yöneticisi • Ford Otosan',
    candidateRole: 'alumni',
    candidateCompany: 'Ford Otosan',
    lastActive: '3 saat önce',
    unreadCount: 0,
    status: 'Mezun Ağı',
    messages: [
      { id: 'm1', sender: 'alumni', senderName: 'Seda Çelik', text: 'Merhaba! Otomotiv sanayisinde tedarik zinciri ve yalın üretim süreçleri üzerine deneyimlerimi paylaşmaktan mutluluk duyarım.', time: '3 saat önce' }
    ]
  },
  {
    id: 'chat_peer_3',
    candidateId: 'STU-002',
    candidateName: 'Zeynep Kaya',
    candidateAvatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=0A2342&color=fff',
    candidateDept: 'Bilgisayar Mühendisliği (ÇAP)',
    candidateRole: 'student',
    candidateCompany: '',
    lastActive: 'Dün 18:20',
    unreadCount: 0,
    status: 'Akran Dayanışması',
    messages: [
      { id: 'm1', sender: 'candidate', senderName: 'Zeynep Kaya', text: 'Selam, bitirme tezi ve yapay zeka proje dökümanlarını kütüphane çalışma odasında birlikte inceleyebiliriz.', time: 'Dün 18:20' }
    ]
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'DNT-2026-101',
    studentId: 'STU-001',
    studentName: 'Alperen Yılmaz',
    studentDept: 'Yazılım Mühendisliği',
    studentEmail: 'alperen@ogr.esenyurt.edu.tr',
    studentAvatar: 'https://ui-avatars.com/api/?name=Alperen+Yılmaz&background=4C1D95&color=fff',
    advisor: 'Prof. Dr. Ahmet Yılmaz',
    mentorName: 'Prof. Dr. Ahmet Yılmaz',
    topic: 'Bitirme Projesi & Staj Denkleştirme',
    subject: 'Bitirme Projesi & Staj Denkleştirme',
    mode: 'Yüz Yüze Kampüs Görüşmesi',
    platform: 'Yüz Yüze (Akademisyen Ofisi - B Blok 304)',
    preferredDate: '2026-08-15',
    preferredTimeSlot: '14:00 - 14:30',
    date: '1 Ağustos 2026 14:20',
    status: 'Beklemede',
    urgency: 'Yüksek',
    note: 'Yaz stajım kapsamında geliştirdiğim yapay zeka modelini bitirme tezi konusu olarak kullanmak istiyorum. Ön inceleme ve görüşme talep ediyorum.',
    replies: []
  },
  {
    id: 'DNT-2026-102',
    studentId: 'STU-002',
    studentName: 'Zeynep Kaya',
    studentDept: 'Bilgisayar Mühendisliği',
    studentEmail: 'zeynep@ogr.esenyurt.edu.tr',
    studentAvatar: 'https://ui-avatars.com/api/?name=Zeynep+Kaya&background=4C1D95&color=fff',
    advisor: 'Doç. Dr. Seda Demir',
    mentorName: 'Doç. Dr. Seda Demir',
    topic: 'Yurtdışı Yüksek Lisans Referans Mektubu',
    subject: 'Yurtdışı Yüksek Lisans Referans Mektubu',
    mode: 'Online (Google Meet / Zoom)',
    platform: 'Online Görüşme',
    preferredDate: '2026-08-18',
    preferredTimeSlot: '11:00 - 11:30',
    date: '30 Temmuz 2026 11:15',
    status: 'Beklemede',
    urgency: 'Orta',
    note: 'Münih Teknik Üniversitesi yüksek lisans başvurum için niyet mektubu kontrolü ve akademik referans mektubu desteği rica ediyorum.',
    replies: []
  },
  {
    id: 'DNT-2026-103',
    studentId: 'STU-003',
    studentName: 'Mert Can',
    studentDept: 'İşletme',
    studentEmail: 'mert@ogr.esenyurt.edu.tr',
    studentAvatar: 'https://ui-avatars.com/api/?name=Mert+Can&background=4C1D95&color=fff',
    advisor: 'Dr. Öğr. Üyesi Mehmet Aksoy',
    mentorName: 'Dr. Öğr. Üyesi Mehmet Aksoy',
    topic: 'Kariyer Yönlendirme ve Çift Anadal (ÇAP)',
    subject: 'Kariyer Yönlendirme ve Çift Anadal (ÇAP)',
    mode: 'Yüz Yüze Kampüs Görüşmesi',
    platform: 'Yüz Yüze (Akademisyen Ofisi - B Blok 304)',
    preferredDate: '2026-08-20',
    preferredTimeSlot: '15:30 - 16:00',
    date: '28 Temmuz 2026 15:30',
    status: 'Onaylandı',
    urgency: 'Normal',
    note: 'Bilgisayar mühendisliği ÇAP ders eşdeğerlikleri ve mezuniyet sonrası veri bilimi alanında uzmanlaşma rehberliği.',
    replies: [
      { sender: 'academic', senderName: 'Dr. Öğr. Üyesi Mehmet Aksoy', text: 'Randevu onaylandı. Lütfen B Blok 304 nolu odama transkriptinizle geliniz.', date: '29 Temmuz 2026 10:00' }
    ]
  },
  {
    id: 'DNT-2026-104',
    studentId: 'STU-004',
    studentName: 'Elif Demir',
    studentDept: 'Mimarlık',
    studentEmail: 'elif@ogr.esenyurt.edu.tr',
    studentAvatar: 'https://ui-avatars.com/api/?name=Elif+Demir&background=4C1D95&color=fff',
    advisor: 'Prof. Dr. Ahmet Yılmaz',
    mentorName: 'Prof. Dr. Ahmet Yılmaz',
    topic: 'SGK Evrak Süreci & Geciken Onay',
    subject: 'SGK Evrak Süreci & Geciken Onay',
    mode: 'Yüz Yüze Kampüs Görüşmesi',
    platform: 'Yüz Yüze (Akademisyen Ofisi - B Blok 304)',
    preferredDate: '2026-08-12',
    preferredTimeSlot: '10:00 - 10:30',
    date: '2 Ağustos 2026 09:45',
    status: 'Beklemede',
    urgency: 'Acil',
    note: 'Staj başlama tarihime 5 gün kaldı fakat SGK işe giriş belgem sistemde henüz onaylanmadı. Geçici muafiyet belgesi talep ediyorum.',
    replies: []
  }
];

export default function FloatingChatWidget({ setView, currentUser: propsCurrentUser, currentView: propsCurrentView, activeBranch: propsActiveBranch }) {
  const [isOpen, setIsOpen] = useState(false);
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const storeUserRole = useAppStore(state => state.userRole);
  const storeActiveBranch = useAppStore(state => state.activePortalBranch);
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const setApplications = useAppStore(state => state.setApplications);

  // Multi-tier resolution for currentUser:
  const localCurrentUser = useMemo(() => {
    try {
      const saved = localStorage.getItem('iesu_mock_user') || localStorage.getItem('igu_mock_user') || localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const localRole = useMemo(() => {
    try {
      return localStorage.getItem('iesu_user_role_v1') || localStorage.getItem('igu_user_role_v1') || null;
    } catch {
      return null;
    }
  }, []);

  const localBranch = useMemo(() => {
    try {
      return localStorage.getItem('iesu_active_portal_branch') || null;
    } catch {
      return null;
    }
  }, []);

  const currentUser = propsCurrentUser || storeCurrentUser || localCurrentUser;

  // 1. Detect which portal the user is explicitly viewing right now:
  const activePortal = useMemo(() => {
    let v = propsCurrentView;
    if (!v && typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      v = parts.length > 0 ? parts[parts.length - 1] : '';
    }
    if (!v) return null;
    if (v === 'academic' || v === 'research_hub' || v === 'academic_onboarding' || v.startsWith('academic')) return 'academic';
    if (v === 'company' || v === 'company_ats' || v === 'create_job' || v.startsWith('company')) return 'company';
    if (v === 'alumni' || v === 'mezun_dernek' || v === 'alumni_assoc_portal' || v === 'alumni_card' || v === 'alumni_dao' || v.startsWith('alumni')) return 'alumni';
    if (v === 'admin' || v === 'admin_cms' || v === 'yonetim_konsolu' || v === 'admin_console' || v === 'audit_logs') return 'admin';
    if (v === 'student' || v === 'feed' || v === 'jobs' || v === 'club_portal' || v === 'student_analytics' || v === 'digital_portfolio' || v === 'virtual_fair' || v === 'career_roadmap' || v === 'startup_incubator' || v === 'sem' || v === 'staj' || v === 'career_test') return 'student';
    return null;
  }, [propsCurrentView]);

  // Portala girilmediyse (kullanıcı giriş yapmamışsa veya genel açılış sayfalarındaysa) sağ alttaki mesaj kutusu görünmez
  const isPublicPage = propsCurrentView === 'landing' || propsCurrentView === 'login' || propsCurrentView === 'register';
  if (!currentUser?.id || isPublicPage) {
    return null;
  }

  const resolvedRole = currentUser?.role || storeUserRole || localRole || 'student';
  const userRole = currentUser?.role || resolvedRole;
  const isSuperAdmin = currentUser?.role === 'admin' || currentUser?.id === 'admin_1513' || resolvedRole === 'admin';

  // Branch Context Retention:
  // Eğer kullanıcı doğrudan bir portal dalındaysa (ör: /academic), activePortal o daldır.
  // Eğer kullanıcı ortak/nötr bir sayfadaysa (ör: user_profile, profile_update, calendar, notifications),
  // kullanıcının geldiği aktif dal bağlamı (activePortalBranch) korunur.
  // Böylece Akademik panelden profil sayfasına giden Süper Admin, yine Akademik mesaj/danışmanlık kutusunu görür.
  const preservedBranch = propsActiveBranch || storeActiveBranch || localBranch;
  const branchContext = activePortal || preservedBranch || (isSuperAdmin ? 'admin' : (currentUser?.role || userRole || 'student'));

  const isCompany = branchContext === 'company' || branchContext === 'employer';
  const isAcademic = branchContext === 'academic' || branchContext === 'academic_staff';
  const isAlumni = branchContext === 'alumni';
  const isStudent = branchContext === 'student';
  const isAdmin = branchContext === 'admin';
  const effectiveRole = branchContext;

  // Mode:
  // - Super Admin: 'admin_eval' (Değerlendirme Havuzu - Kök Masası), 'admin_company', 'admin_academic', 'admin_ats'
  // Modes:
  // - Super Admin: 'admin_eval', 'admin_company', 'admin_academic', 'admin_ats'
  // - Company: 'candidate'
  // - Academic: 'counseling'
  // - Alumni: 'alumni_network' (Mezun & Mentörlük Ağı), 'alumni_company' (Kurumsal & Sektörel)
  // - Student: 'student_peer' (Akran & Mezun Sohbetleri), 'student_company' (Firma & Staj), 'student_counseling' (Akademik Danışmanlık)
  const [activeMode, setActiveMode] = useState(() => {
    if (isAdmin) return 'admin_eval';
    if (isCompany) return 'candidate';
    if (isAcademic) return 'counseling';
    if (isAlumni) return 'alumni_network';
    return 'student_peer';
  });

  useEffect(() => {
    if (isAdmin) setActiveMode('admin_eval');
    else if (isCompany) setActiveMode('candidate');
    else if (isAcademic) setActiveMode('counseling');
    else if (isAlumni) setActiveMode('alumni_network');
    else if (isStudent) setActiveMode('student_peer');
  }, [isAdmin, isCompany, isAcademic, isStudent, isAlumni]);

  // Store admin messages
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const setAdminMessages = useAppStore(state => state.setAdminMessages);

  // Super Admin Evaluation Pool states
  const [evalFilterTab, setEvalFilterTab] = useState('all'); // 'all', 'pending', 'reviewing', 'approved', 'rejected'
  const [evalSourceFilter, setEvalSourceFilter] = useState('all'); // 'all', 'company', 'academic', 'student'
  const [evalSearchQuery, setEvalSearchQuery] = useState('');
  const [selectedEvalItem, setSelectedEvalItem] = useState(null);
  const [evalDecisionNote, setEvalDecisionNote] = useState('');

  // Super Admin Company Messages view states
  const [selectedAdminCompanyMsg, setSelectedAdminCompanyMsg] = useState(null);
  const [adminCompanyReplyText, setAdminCompanyReplyText] = useState('');

  // Super Admin Academic Messages view states
  const [selectedAdminAcademicMsg, setSelectedAdminAcademicMsg] = useState(null);
  const [adminAcademicReplyText, setAdminAcademicReplyText] = useState('');

  // Academic Counseling states
  const [activeReq, setActiveReq] = useState(null);
  const [counselingFilterTab, setCounselingFilterTab] = useState('all');
  const [replyText, setReplyText] = useState('');

  // Candidate Chat states (for company & student)
  const [selectedCandidateChat, setSelectedCandidateChat] = useState(null);
  const [candidateMessageText, setCandidateMessageText] = useState('');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');

  // Student response states
  const [studentCompanyReplyText, setStudentCompanyReplyText] = useState('');
  const [studentCounselingReplyText, setStudentCounselingReplyText] = useState('');

  // 1. Academic Requests Storage
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mentorship_requests_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    try {
      localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify(INITIAL_REQUESTS));
    } catch (e) {}
    return INITIAL_REQUESTS;
  });

  // 2. Candidate Recruitment Chats Storage
  const [candidateChats, setCandidateChats] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_company_candidate_chats_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    try {
      localStorage.setItem('iesu_company_candidate_chats_v1', JSON.stringify(INITIAL_CANDIDATE_CHATS));
    } catch (e) {}
    return INITIAL_CANDIDATE_CHATS;
  });

  const saveCandidateChats = (updated) => {
    setCandidateChats(updated);
    try {
      localStorage.setItem('iesu_company_candidate_chats_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const saveCounselingRequests = (updated) => {
    setRequests(updated);
    try {
      localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('iesu_counseling_updated'));
    } catch (e) {}
  };

  const saveAdminMessages = (updated) => {
    if (setAdminMessages) setAdminMessages(updated);
    try {
      localStorage.setItem('iesu_admin_messages_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  // Ensure default academic request exists in adminMessages for evaluation desk demonstration if missing
  useEffect(() => {
    if (!adminMessages || adminMessages.length === 0 || !adminMessages.some(m => m.senderType === 'academic')) {
      const defaultAcadMsg = {
        id: 'ADMIN_MSG_ACAD_1',
        senderId: 'ACAD-001',
        senderName: 'Prof. Dr. Ahmet Yılmaz',
        senderType: 'academic',
        department: 'Mühendislik ve Doğa Bilimleri Fakültesi',
        subject: '2026-2027 Güz Staj Komisyonu ve Firma Kontenjan Protokolü',
        priority: 'Yüksek',
        message: 'Bölümümüz 4. sınıf öğrencilerinin savunma sanayii ve teknopark firmalarında uzun dönemli zorunlu staj yapabilmeleri için KGM koordinatörlüğünde 25 kişilik ilave kontenjan protokolü talep etmekteyiz.',
        date: '2 Ağustos 2026 11:30',
        status: 'Beklemede',
        reply: null
      };
      if (setAdminMessages) {
        setAdminMessages(prev => [defaultAcadMsg, ...(prev || [])]);
      }
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // SÜPER ADMİN: MERKEZİ DEĞERLENDİRME & KARAR HAVUZU (TÜM DALLARIN KÖKÜ)
  // ═══════════════════════════════════════════════════════════════════
  const combinedEvaluationPool = useMemo(() => {
    const pool = [];

    // 1. Firma / Kurumsal Talepler (adminMessages where senderType !== 'academic')
    (adminMessages || []).forEach(msg => {
      const isAcad = msg.senderType === 'academic' || msg.type === 'academic';
      if (!isAcad) {
        pool.push({
          id: msg.id,
          sourceType: 'company',
          sourceLabel: '🏢 Firma',
          sourceColor: 'text-blue-700 bg-blue-50 border-blue-200',
          senderName: msg.companyName || msg.senderName || 'Kurumsal Firma',
          senderSub: msg.email || msg.phone || 'Kurumsal İK',
          subject: msg.subject || 'Kurumsal İş Birliği & Staj Talebi',
          content: msg.message || '',
          date: msg.date || '30 Temmuz 2026',
          status: msg.status || 'Beklemede',
          priority: msg.priority || 'Normal',
          decisionNote: msg.adminDecisionNote || msg.reply || '',
          originalItem: msg
        });
      }
    });

    // 2. Akademik Kadro Talepleri (adminMessages where senderType === 'academic')
    (adminMessages || []).forEach(msg => {
      const isAcad = msg.senderType === 'academic' || msg.type === 'academic';
      if (isAcad) {
        pool.push({
          id: msg.id,
          sourceType: 'academic',
          sourceLabel: '🏛️ Akademi',
          sourceColor: 'text-purple-700 bg-purple-50 border-purple-200',
          senderName: msg.senderName || 'Öğretim Üyesi',
          senderSub: msg.department || 'Fakülte Koordinatörü',
          subject: msg.subject || 'Akademik Protokol & Kontenjan Talebi',
          content: msg.message || '',
          date: msg.date || 'Bugün',
          status: msg.status || 'Beklemede',
          priority: msg.priority || 'Normal',
          decisionNote: msg.adminDecisionNote || msg.reply || '',
          originalItem: msg
        });
      }
    });

    // 3. Öğrenci & Mezun Danışmanlık ve Randevu Talepleri (requests)
    (requests || []).forEach(req => {
      const adminReply = (req.replies || []).find(r => r.sender === 'admin' || r.sender === 'kgm');
      pool.push({
        id: req.id,
        sourceType: 'student',
        sourceLabel: '🎓 Öğrenci',
        sourceColor: 'text-rose-700 bg-rose-50 border-rose-200',
        senderName: req.studentName,
        senderSub: `${req.studentDept || ''} • Danışman: ${req.advisor || req.mentorName || 'KGM'}`,
        subject: req.topic || req.subject || 'KGM Danışmanlık & Randevu Talebi',
        content: req.note || req.details || '',
        date: req.date || req.preferredDate || 'Bugün',
        status: req.status || 'Beklemede',
        priority: req.urgency || 'Normal',
        decisionNote: adminReply?.text || '',
        studentId: req.studentId,
        originalItem: req
      });
    });

    return pool;
  }, [adminMessages, requests]);

  const evalMetrics = useMemo(() => {
    const total = combinedEvaluationPool.length;
    const pending = combinedEvaluationPool.filter(i => i.status === 'Beklemede').length;
    const reviewing = combinedEvaluationPool.filter(i => i.status === 'İnceleniyor' || i.status === 'İncelendi').length;
    const approved = combinedEvaluationPool.filter(i => i.status === 'Onaylandı').length;
    const rejected = combinedEvaluationPool.filter(i => i.status === 'Reddedildi').length;
    return { total, pending, reviewing, approved, rejected };
  }, [combinedEvaluationPool]);

  // Handler: Super Admin Karar Masası Aksiyonu (Onayla / İncele / Reddet)
  const handleUpdateEvaluation = (item, newStatus, decisionNote) => {
    if (!item) return;

    if (item.sourceType === 'company' || item.sourceType === 'academic') {
      const updatedMessages = (adminMessages || []).map(m => {
        if (m.id === item.id) {
          return {
            ...m,
            status: newStatus,
            adminDecisionNote: decisionNote || m.adminDecisionNote,
            reply: decisionNote || m.reply,
            decisionDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
          };
        }
        return m;
      });
      saveAdminMessages(updatedMessages);

      if (selectedEvalItem?.id === item.id) {
        setSelectedEvalItem(prev => ({
          ...prev,
          status: newStatus,
          decisionNote: decisionNote || prev.decisionNote
        }));
      }
    } else if (item.sourceType === 'student') {
      const newReply = decisionNote ? {
        sender: 'admin',
        senderName: 'KGM Süper Admin & Rektörlük',
        text: decisionNote,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
      } : null;

      const updatedRequests = requests.map(r => {
        if (r.id === item.id) {
          return {
            ...r,
            status: newStatus,
            replies: newReply ? [...(r.replies || []), newReply] : (r.replies || [])
          };
        }
        return r;
      });

      saveCounselingRequests(updatedRequests);

      if (selectedEvalItem?.id === item.id) {
        setSelectedEvalItem(prev => ({
          ...prev,
          status: newStatus,
          decisionNote: decisionNote || prev.decisionNote
        }));
      }
    }

    const statusText = newStatus === 'Onaylandı' ? '✅ Onaylandı' : newStatus === 'İnceleniyor' ? '🔍 İncelemeye alındı' : '❌ Reddedildi';
    window.toast?.success?.(`${item.senderName} talebi ${statusText} olarak güncellendi.`);
  };

  // Handler: Super Admin replies to Company request
  const handleAdminSendCompanyReply = (e) => {
    e.preventDefault();
    if (!adminCompanyReplyText.trim() || !selectedAdminCompanyMsg) return;

    const reply = adminCompanyReplyText.trim();
    const updated = (adminMessages || []).map(m => {
      if (m.id === selectedAdminCompanyMsg.id) {
        return {
          ...m,
          status: 'Yanıtlandı',
          reply: reply,
          replyDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        };
      }
      return m;
    });

    saveAdminMessages(updated);
    setSelectedAdminCompanyMsg(prev => ({
      ...prev,
      status: 'Yanıtlandı',
      reply: reply
    }));
    setAdminCompanyReplyText('');
    window.toast?.success?.(`💬 Yanıtınız ${selectedAdminCompanyMsg.companyName || 'Firmaya'} iletildi.`);
  };

  // Handler: Super Admin replies to Academic staff request
  const handleAdminSendAcademicReply = (e) => {
    e.preventDefault();
    if (!adminAcademicReplyText.trim() || !selectedAdminAcademicMsg) return;

    const reply = adminAcademicReplyText.trim();
    const updated = (adminMessages || []).map(m => {
      if (m.id === selectedAdminAcademicMsg.id) {
        return {
          ...m,
          status: 'Yanıtlandı',
          reply: reply,
          replyDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
        };
      }
      return m;
    });

    saveAdminMessages(updated);
    setSelectedAdminAcademicMsg(prev => ({
      ...prev,
      status: 'Yanıtlandı',
      reply: reply
    }));
    setAdminAcademicReplyText('');
    window.toast?.success?.(`💬 Resmî kararınız ${selectedAdminAcademicMsg.senderName || 'Öğretim Üyesine'} iletildi.`);
  };

  // Record messages to persistent audit log for Super Admin
  const recordMessageAudit = useCallback((senderId, senderName, senderRole, receiverId, receiverName, receiverRole, text) => {
    try {
      const raw = localStorage.getItem('iesu_platform_messages_audit_v1');
      const logs = raw ? JSON.parse(raw) : [];
      logs.push({
        id: 'AUDIT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        senderId: senderId || 'user',
        senderName: senderName || 'Kullanıcı',
        senderRole: senderRole || 'student',
        receiverId: receiverId || 'receiver',
        receiverName: receiverName || 'Kullanıcı',
        receiverRole: receiverRole || 'company',
        content: text,
        timestamp: Date.now()
      });
      localStorage.setItem('iesu_platform_messages_audit_v1', JSON.stringify(logs));
    } catch (e) {
      console.warn('Audit record error:', e);
    }
  }, []);

  // Listen to iesu_open_chat event from ANYWHERE in the app
  useEffect(() => {
    const handleOpenChat = (e) => {
      const detail = e.detail;
      if (!detail) return;

      setIsOpen(true);
      if (isAdmin) {
        setActiveMode('admin_ats');
      } else if (isAlumni) {
        setActiveMode(detail.candidateRole === 'company' ? 'alumni_company' : 'alumni_network');
      } else if (isStudent) {
        if (detail.candidateRole === 'company') {
          setActiveMode('student_company');
        } else if (detail.candidateRole === 'academic') {
          setActiveMode('student_counseling');
        } else {
          setActiveMode('student_peer');
        }
      } else {
        setActiveMode('candidate');
      }

      setCandidateChats(prev => {
        const existing = prev.find(c => 
          c.candidateId === detail.candidateId || 
          (detail.candidateName && c.candidateName.toLowerCase() === detail.candidateName.toLowerCase())
        );

        if (existing) {
          if (detail.initialMessage) {
            const updatedChat = {
              ...existing,
              candidateName: detail.candidateName || existing.candidateName,
              candidateDept: detail.candidateDept || existing.candidateDept,
              candidateRole: detail.candidateRole || existing.candidateRole,
              candidateAvatar: detail.candidateAvatar || existing.candidateAvatar,
              candidateCompany: detail.candidateCompany || existing.candidateCompany || '',
              messages: [
                ...(existing.messages || []),
                {
                  id: 'm_' + Date.now(),
                  sender: isCompany ? 'company' : (isAdmin ? 'admin' : 'candidate'),
                  senderName: currentUser?.name || (isCompany ? 'Kurumsal İK' : 'Siz'),
                  text: detail.initialMessage,
                  time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                }
              ]
            };
            const updatedAll = prev.map(c => c.id === existing.id ? updatedChat : c);
            localStorage.setItem('iesu_company_candidate_chats_v1', JSON.stringify(updatedAll));
            setSelectedCandidateChat(updatedChat);
            recordMessageAudit(
              currentUser?.id,
              currentUser?.name || 'Siz',
              currentUser?.role || 'user',
              detail.candidateId,
              detail.candidateName,
              detail.candidateRole,
              detail.initialMessage
            );
            return updatedAll;
          }
          setSelectedCandidateChat(existing);
          return prev;
        }

        const newChat = {
          id: 'chat_' + Date.now(),
          candidateId: detail.candidateId || 'cand_' + Date.now(),
          candidateName: detail.candidateName || 'İESÜ Üyesi',
          candidateAvatar: detail.candidateAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(detail.candidateName || 'U')}&background=0A2342&color=fff`,
          candidateDept: detail.candidateDept || 'İstanbul Esenyurt Üniversitesi',
          candidateRole: detail.candidateRole || 'İESÜ Üyesi',
          candidateCompany: detail.candidateCompany || '',
          companyName: detail.companyName || (isCompany ? currentUser?.name : (currentUser?.name || 'Kullanıcı')),
          lastActive: 'Şimdi',
          unreadCount: 0,
          status: 'Aktif Görüşme',
          messages: detail.initialMessage ? [
            {
              id: 'm_' + Date.now(),
              sender: isCompany ? 'company' : 'candidate',
              senderName: currentUser?.name || (isCompany ? 'Kurumsal İK' : 'Siz'),
              text: detail.initialMessage,
              time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            }
          ] : []
        };

        const updatedAll = [newChat, ...prev];
        localStorage.setItem('iesu_company_candidate_chats_v1', JSON.stringify(updatedAll));
        setSelectedCandidateChat(newChat);
        if (detail.initialMessage) {
          recordMessageAudit(
            currentUser?.id,
            currentUser?.name || 'Siz',
            currentUser?.role || 'user',
            detail.candidateId,
            detail.candidateName,
            detail.candidateRole,
            detail.initialMessage
          );
        }
        return updatedAll;
      });
    };

    window.addEventListener('iesu_open_chat', handleOpenChat);
    return () => window.removeEventListener('iesu_open_chat', handleOpenChat);
  }, [currentUser, isStudent, isAlumni, isAdmin, isCompany, recordMessageAudit]);

  // Sync counseling updates
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('iesu_mentorship_requests_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setRequests(parsed);
        }
      } catch (e) {}
    };
    window.addEventListener('iesu_counseling_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('iesu_counseling_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Handler: Company sends candidate message
  const handleSendCandidateMessage = (e) => {
    e.preventDefault();
    if (!candidateMessageText.trim() || !selectedCandidateChat) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'company',
      senderName: currentUser?.name || 'Kurumsal İK',
      text: candidateMessageText.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = candidateChats.map(c => {
      if (c.id === selectedCandidateChat.id) {
        return {
          ...c,
          lastActive: 'Şimdi',
          status: c.status === 'Beklemede' || c.status === 'Yeni' ? 'İletişime Geçildi' : c.status,
          messages: [...(c.messages || []), newMsg]
        };
      }
      return c;
    });

    saveCandidateChats(updatedChats);
    setSelectedCandidateChat(prev => ({
      ...prev,
      lastActive: 'Şimdi',
      status: prev.status === 'Beklemede' || prev.status === 'Yeni' ? 'İletişime Geçildi' : prev.status,
      messages: [...(prev.messages || []), newMsg]
    }));

    if (setApplications) {
      setApplications(prev => (prev || []).map(a => 
        (a.id === selectedCandidateChat.candidateId || a.applicantName === selectedCandidateChat.candidateName)
          ? { ...a, status: 'İletişime Geçildi', companyContacted: true }
          : a
      ));
    }

    recordMessageAudit(
      currentUser?.id,
      currentUser?.name || 'Kurumsal Firma',
      currentUser?.role || 'company',
      selectedCandidateChat.candidateId,
      selectedCandidateChat.candidateName,
      selectedCandidateChat.candidateRole || 'student',
      candidateMessageText.trim()
    );

    setCandidateMessageText('');
    window.toast?.success?.(`💬 Mesaj ${selectedCandidateChat.candidateName} adlı kullanıcıya iletildi.`);
  };

  // Handler: Student sends reply back to Company/User
  const handleStudentSendCompanyReply = (e) => {
    e.preventDefault();
    if (!studentCompanyReplyText.trim() || !selectedCandidateChat) return;

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'candidate',
      senderName: currentUser?.name || 'Siz',
      text: studentCompanyReplyText.trim(),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedChats = candidateChats.map(c => {
      if (c.id === selectedCandidateChat.id) {
        return {
          ...c,
          lastActive: 'Şimdi',
          messages: [...(c.messages || []), newMsg]
        };
      }
      return c;
    });

    saveCandidateChats(updatedChats);
    setSelectedCandidateChat(prev => ({
      ...prev,
      lastActive: 'Şimdi',
      messages: [...(prev.messages || []), newMsg]
    }));

    recordMessageAudit(
      currentUser?.id,
      currentUser?.name || 'Öğrenci',
      currentUser?.role || 'student',
      selectedCandidateChat.candidateId,
      selectedCandidateChat.candidateName || selectedCandidateChat.companyName,
      selectedCandidateChat.candidateRole || 'company',
      studentCompanyReplyText.trim()
    );

    setStudentCompanyReplyText('');
    window.toast?.success?.(`💬 Yanıtınız ${selectedCandidateChat.candidateName || selectedCandidateChat.companyName || 'muhatabınıza'} iletildi.`);
  };

  // Quick reply chip click for companies
  const handleQuickChipCompany = (text) => {
    setCandidateMessageText(text);
  };

  // Quick reply chip click for students
  const handleQuickChipStudent = (text) => {
    setStudentCompanyReplyText(text);
  };

  // Handler: Academic approves counseling
  const handleApproveCounseling = (reqId) => {
    const updated = requests.map(r => r.id === reqId ? { ...r, status: 'Onaylandı' } : r);
    saveCounselingRequests(updated);
    if (activeReq?.id === reqId) {
      setActiveReq(prev => ({ ...prev, status: 'Onaylandı' }));
    }
    window.toast?.success?.('✅ Randevu talebi onaylandı ve öğrenciye bildirildi.');
  };

  // Handler: Academic sends reply note
  const handleSendCounselingReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeReq) return;

    const newReply = {
      sender: 'academic',
      senderName: currentUser?.name || 'Danışman Öğretim Üyesi',
      text: replyText.trim(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    };

    const updated = requests.map(r => {
      if (r.id === activeReq.id) {
        return {
          ...r,
          status: 'Onaylandı',
          replies: [...(r.replies || []), newReply]
        };
      }
      return r;
    });

    saveCounselingRequests(updated);
    setActiveReq(prev => ({
      ...prev,
      status: 'Onaylandı',
      replies: [...(prev.replies || []), newReply]
    }));
    setReplyText('');
    window.toast?.success?.('💬 Yanıtınız ve görüşme notunuz öğrenciye iletildi.');
  };

  // Handler: Student sends reply note to Academic Advisor
  const handleStudentSendCounselingReply = (e) => {
    e.preventDefault();
    if (!studentCounselingReplyText.trim() || !activeReq) return;

    const newReply = {
      sender: 'student',
      senderName: currentUser?.name || 'Öğrenci',
      text: studentCounselingReplyText.trim(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    };

    const updated = requests.map(r => {
      if (r.id === activeReq.id) {
        return {
          ...r,
          replies: [...(r.replies || []), newReply]
        };
      }
      return r;
    });

    saveCounselingRequests(updated);
    setActiveReq(prev => ({
      ...prev,
      replies: [...(prev.replies || []), newReply]
    }));
    setStudentCounselingReplyText('');
    window.toast?.success?.('💬 Notunuz danışman hocanıza iletildi.');
  };

  const handleNavigateToStudent = (studentId) => {
    if (setSelectedUserId) setSelectedUserId(studentId);
    if (setView) setView('user_profile');
    setIsOpen(false);
  };

  const handleOpenBulkPanel = () => {
    if (isAdmin) {
      if (activeMode === 'admin_ats') {
        if (setView) setView('company_ats');
      } else {
        if (setView) setView('yonetim_konsolu');
      }
    } else if (isCompany || activeMode === 'candidate') {
      if (setView) setView('company_ats');
    } else if (isAcademic || activeMode === 'counseling') {
      window.dispatchEvent(new CustomEvent('iesu_open_counseling_tab'));
      if (setView) setView('academic');
    } else if (isStudent) {
      if (activeMode === 'student_company') setView?.('jobs');
      else setView?.('feed');
    }
    setIsOpen(false);
  };

  // Helper to distinguish corporate recruiter chats from peer/alumni chats
  const isCorporateChat = useCallback((c) => {
    return c.candidateRole === 'company' || 
           c.candidateRole === 'employer' || 
           c.isCompany === true || 
           (Boolean(c.companyName) && !['alumni', 'student'].includes(c.candidateRole));
  }, []);

  // 1. Alumni portal lists:
  const alumniNetworkChats = useMemo(() => {
    return candidateChats.filter(c => !isCorporateChat(c));
  }, [candidateChats, isCorporateChat]);

  const alumniCompanyChats = useMemo(() => {
    return candidateChats.filter(c => isCorporateChat(c));
  }, [candidateChats, isCorporateChat]);

  // 2. Student portal lists:
  const studentPeerChats = useMemo(() => {
    return candidateChats.filter(c => !isCorporateChat(c));
  }, [candidateChats, isCorporateChat]);

  const studentCompanyChats = useMemo(() => {
    return candidateChats.filter(c => isCorporateChat(c));
  }, [candidateChats, isCorporateChat]);

  const displayStudentChats = isAlumni 
    ? (activeMode === 'alumni_company' ? alumniCompanyChats : alumniNetworkChats)
    : (activeMode === 'student_company' ? studentCompanyChats : studentPeerChats);

  const studentRequests = requests.filter(r => 
    r.studentId === currentUser?.id || 
    (currentUser?.name && r.studentName.toLowerCase() === currentUser.name.toLowerCase())
  );
  const displayStudentRequests = studentRequests.length > 0 ? studentRequests : requests;

  // Notification badges
  const alumniNetworkUnread = alumniNetworkChats.filter(c => (c.unreadCount || 0) > 0).length;
  const alumniCompanyUnread = alumniCompanyChats.filter(c => (c.unreadCount || 0) > 0).length;

  const studentPeerUnread = studentPeerChats.filter(c => (c.unreadCount || 0) > 0).length;
  const studentCompanyUnread = studentCompanyChats.filter(c => (c.unreadCount || 0) > 0).length;
  const studentApprovedCounselingsCount = displayStudentRequests.filter(r => r.status === 'Onaylandı' && (r.replies || []).length > 0).length;

  const pendingCounselingCount = requests.filter(r => r.status === 'Beklemede').length;
  const pendingCandidateCount = candidateChats.filter(c => (c.unreadCount || 0) > 0).length;
  const studentUnreadChatsCount = isAlumni 
    ? (alumniNetworkUnread + alumniCompanyUnread) 
    : (studentPeerUnread + studentCompanyUnread);
  const pendingAdminMsgs = (adminMessages || []).filter(m => m.status === 'Beklemede').length;

  const totalBadge = isAdmin
    ? (pendingAdminMsgs + pendingCounselingCount + pendingCandidateCount)
    : isCompany 
    ? pendingCandidateCount 
    : isAcademic 
    ? pendingCounselingCount 
    : isAlumni
    ? (alumniNetworkUnread + alumniCompanyUnread)
    : isStudent
    ? (studentPeerUnread + studentCompanyUnread + (studentApprovedCounselingsCount > 0 ? 1 : 0))
    : (pendingCounselingCount + pendingCandidateCount);

  // Theme Gradients & Accents per Role (The Tree Leaves & The Central Root)
  const getHeaderGradient = () => {
    if (isAdmin) return 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 border-b-2 border-yellow-300/60 text-white shadow-lg';
    if (isCompany) return 'bg-gradient-to-r from-slate-950 via-[#0A2342] to-indigo-950 border-b border-blue-800/40';
    if (isAcademic) return 'bg-gradient-to-r from-purple-950 via-[#4C1D95] to-indigo-900 border-b border-purple-800/40';
    if (isAlumni) return 'bg-gradient-to-r from-slate-950 via-[#0F766E] to-emerald-950 border-b border-teal-800/40';
    if (isStudent) return 'bg-gradient-to-r from-slate-950 via-[#990000] to-rose-950 border-b border-rose-800/40';
    return 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-700';
  };

  const getLauncherGradient = () => {
    if (isAdmin) return 'bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 shadow-2xl shadow-amber-500/60 border-2 border-yellow-200 ring-4 ring-amber-400/40 hover:shadow-amber-400/80';
    if (isCompany) return 'bg-gradient-to-tr from-slate-950 via-[#0A2342] to-blue-600 shadow-blue-900/30 border-blue-400/40';
    if (isAcademic) return 'bg-gradient-to-tr from-indigo-900 via-[#4C1D95] to-purple-600 shadow-purple-900/30 border-purple-400/40';
    if (isAlumni) return 'bg-gradient-to-tr from-slate-950 via-[#0F766E] to-emerald-600 shadow-teal-900/30 border-teal-400/40';
    if (isStudent) return 'bg-gradient-to-tr from-slate-950 via-[#990000] to-rose-600 shadow-rose-900/30 border-rose-400/40';
    return 'bg-gradient-to-tr from-slate-950 via-slate-800 to-indigo-700 shadow-slate-900/30 border-slate-500/40';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 animate-fade-in font-sans">
      
      {/* ═══════════════════════════════════════════════════════════════════
          EXPANDED WIDGET CONTAINER
         ═══════════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div 
          className={`bg-white w-88 sm:w-[430px] rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all animate-slide-up ${
            isAdmin ? 'border-2 border-amber-400/90 shadow-[0_20px_60px_-15px_rgba(245,158,11,0.45)]' : 'border border-slate-200'
          }`} 
          style={{ height: '590px', maxHeight: '86vh' }}
        >
          {/* Top Header */}
          <div className={`text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-sm transition-colors ${getHeaderGradient()}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {(activeReq || selectedCandidateChat || selectedEvalItem || selectedAdminCompanyMsg || selectedAdminAcademicMsg) && (
                <button 
                  onClick={() => { 
                    setActiveReq(null); 
                    setSelectedCandidateChat(null); 
                    setSelectedEvalItem(null);
                    setSelectedAdminCompanyMsg(null);
                    setSelectedAdminAcademicMsg(null);
                  }} 
                  className="p-1.5 hover:bg-white/20 rounded-xl transition cursor-pointer shrink-0"
                  title="Listeye Dön"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-white truncate">
                    {isAdmin ? (
                      selectedEvalItem 
                        ? `Karar: ${selectedEvalItem.senderName}` 
                        : selectedAdminCompanyMsg
                        ? `Firma: ${selectedAdminCompanyMsg.companyName || selectedAdminCompanyMsg.senderName}`
                        : selectedAdminAcademicMsg
                        ? `Akademik: ${selectedAdminAcademicMsg.senderName}`
                        : selectedCandidateChat
                        ? `Aday: ${selectedCandidateChat.candidateName}`
                        : 'Kariyer Merkezi İletişim'
                    ) : isCompany ? (
                      selectedCandidateChat ? selectedCandidateChat.candidateName : 'Aday İletişimi & İşe Alım'
                    ) : isAcademic ? (
                      activeReq ? 'Danışmanlık Talebi' : 'Danışmanlık & Randevular'
                    ) : isAlumni ? (
                      selectedCandidateChat 
                        ? selectedCandidateChat.candidateName 
                        : 'İESÜ Mezun & Mentörlük İletişimi'
                    ) : isStudent ? (
                      selectedCandidateChat 
                        ? (selectedCandidateChat.candidateName || selectedCandidateChat.companyName) 
                        : activeReq 
                        ? (activeReq.advisor || activeReq.mentorName || 'Danışman Randevusu')
                        : 'Öğrenci & Akran İletişimi'
                    ) : (
                      'Mesajlar'
                    )}
                  </h3>
                  {isAdmin && selectedEvalItem?.status && (
                    <span className="bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {selectedEvalItem.status}
                    </span>
                  )}
                  {isCompany && selectedCandidateChat?.status && (
                    <span className="bg-blue-400/20 border border-blue-400/40 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {selectedCandidateChat.status}
                    </span>
                  )}
                  {(isStudent || isAlumni) && selectedCandidateChat?.status && (
                    <span className="bg-white/20 border border-white/30 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      {selectedCandidateChat.status}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 truncate font-medium">
                  {isAdmin ? (
                    selectedEvalItem
                      ? `${selectedEvalItem.sourceLabel} • ${selectedEvalItem.subject}`
                      : selectedAdminCompanyMsg
                      ? `${selectedAdminCompanyMsg.subject || 'Kurumsal İş Birliği'}`
                      : selectedAdminAcademicMsg
                      ? `${selectedAdminAcademicMsg.department || 'Akademik Birim'}`
                      : selectedCandidateChat
                      ? `${selectedCandidateChat.candidateRole} (${selectedCandidateChat.companyName || 'Kurumsal Firma'})`
                      : 'İstanbul Esenyurt Üniversitesi • Kariyer Geliştirme Koordinatörlüğü'
                  ) : isCompany ? (
                    selectedCandidateChat ? selectedCandidateChat.candidateRole : `${currentUser?.name || 'Kurumsal Firma'} • ATS Canlı Hat`
                  ) : isAcademic ? (
                    activeReq ? activeReq.studentName : 'İstanbul Esenyurt Üniversitesi • Fakülte Danışmanlığı'
                  ) : isAlumni ? (
                    selectedCandidateChat 
                      ? (selectedCandidateChat.candidateDept || selectedCandidateChat.candidateCompany || 'Mezun Ağı Sohbeti')
                      : 'Mezunlar Arası İletişim & Kariyer Dayanışması'
                  ) : isStudent ? (
                    selectedCandidateChat
                      ? (selectedCandidateChat.candidateDept || (selectedCandidateChat.candidateRole === 'company' ? 'Kurumsal İlan İletişimi' : 'Akran Sohbeti'))
                      : activeReq
                      ? `${activeReq.topic || activeReq.subject}`
                      : 'Akran Dayanışması & Kariyer Sohbeti'
                  ) : (
                    'Kariyer Koordinatörlüğü Süpervizör Görünümü'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={handleOpenBulkPanel} 
                className="p-2 hover:bg-white/20 rounded-xl transition cursor-pointer text-slate-300 hover:text-white"
                title={
                  isAdmin ? "KGM Yönetim Paneline Git" :
                  isCompany ? "ATS Aday Havuzunu Aç" :
                  isAcademic ? "Tüm Randevuları Akademik Portalda Aç" :
                  "Kariyer Portalını Aç"
                }
              >
                <Maximize2 size={16} />
              </button>
              <button 
                onClick={() => { 
                  setIsOpen(false); 
                  setActiveReq(null); 
                  setSelectedCandidateChat(null); 
                  setSelectedEvalItem(null);
                  setSelectedAdminCompanyMsg(null);
                  setSelectedAdminAcademicMsg(null);
                }}
                className="p-2 hover:bg-white/20 rounded-xl transition cursor-pointer text-slate-300 hover:text-white"
                title="Kapat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              ROLE-AWARE DUAL-WING TAB SWITCHERS (BRANCH SELECTORS)
             ═══════════════════════════════════════════════════════════════════ */}
          
          {/* A1. Mezun Portalı Özel Sekmeleri (Zümrüt Yeşili) */}
          {isAlumni && (
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 text-xs font-bold">
              <button 
                type="button"
                onClick={() => { setActiveMode('alumni_network'); setSelectedCandidateChat(null); }}
                className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'alumni_network'
                    ? 'bg-white text-[#0F766E] border-b-2 border-[#0F766E] font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users size={14} className="text-[#0F766E]" /> 
                <span>Mezun & Mentörlük Ağı</span>
                {alumniNetworkUnread > 0 && (
                  <span className="w-4 h-4 bg-[#0F766E] text-white rounded-full text-[9px] flex items-center justify-center font-black">
                    {alumniNetworkUnread}
                  </span>
                )}
              </button>
              <button 
                type="button"
                onClick={() => { setActiveMode('alumni_company'); setSelectedCandidateChat(null); }}
                className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'alumni_company'
                    ? 'bg-white text-[#0F766E] border-b-2 border-[#0F766E] font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 size={14} className="text-[#0F766E]" /> 
                <span>Kurumsal İletişim</span>
                {alumniCompanyUnread > 0 && (
                  <span className="w-4 h-4 bg-[#0F766E] text-white rounded-full text-[9px] flex items-center justify-center font-black">
                    {alumniCompanyUnread}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* A2. Öğrenci Portalı Özel Sekmeleri (Kurumsal Kırmızı) */}
          {isStudent && (
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 text-xs font-bold">
              <button 
                type="button"
                onClick={() => { setActiveMode('student_peer'); setSelectedCandidateChat(null); setActiveReq(null); }}
                className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'student_peer'
                    ? 'bg-white text-[#990000] border-b-2 border-[#990000] font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare size={13} /> 
                <span>Akran & Mezun</span>
                {studentPeerUnread > 0 && (
                  <span className="w-4 h-4 bg-[#990000] text-white rounded-full text-[9px] flex items-center justify-center font-black">
                    {studentPeerUnread}
                  </span>
                )}
              </button>
              <button 
                type="button"
                onClick={() => { setActiveMode('student_company'); setSelectedCandidateChat(null); setActiveReq(null); }}
                className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'student_company'
                    ? 'bg-white text-[#990000] border-b-2 border-[#990000] font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 size={13} /> 
                <span>Firma Mesajları</span>
                {studentCompanyUnread > 0 && (
                  <span className="w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-black">
                    {studentCompanyUnread}
                  </span>
                )}
              </button>
              <button 
                type="button"
                onClick={() => { setActiveMode('student_counseling'); setSelectedCandidateChat(null); setActiveReq(null); }}
                className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'student_counseling'
                    ? 'bg-white text-[#990000] border-b-2 border-[#990000] font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap size={13} /> 
                <span>Akademik Danışmanlık</span>
                {studentApprovedCounselingsCount > 0 && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                )}
              </button>
            </div>
          )}

          {/* B. Süper Admin 4 Kanatlı Kök Menüsü (Merkezi Ekosistem Kökü) */}
          {isAdmin && (
            <div className="flex border-b border-amber-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white shrink-0 text-[11px] font-black overflow-x-auto no-scrollbar p-1 gap-1">
              <button 
                onClick={() => { 
                  setActiveMode('admin_eval'); 
                  setSelectedEvalItem(null);
                  setSelectedAdminCompanyMsg(null);
                  setSelectedAdminAcademicMsg(null);
                  setSelectedCandidateChat(null);
                }}
                className={`px-3 py-2 whitespace-nowrap transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'admin_eval' 
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-md border border-yellow-200' 
                    : 'text-amber-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Scale size={13} />
                <span>Değerlendirme Havuzu</span>
                {evalMetrics.pending > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    activeMode === 'admin_eval' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {evalMetrics.pending}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { 
                  setActiveMode('admin_company'); 
                  setSelectedEvalItem(null);
                  setSelectedAdminCompanyMsg(null);
                  setSelectedAdminAcademicMsg(null);
                  setSelectedCandidateChat(null);
                }}
                className={`px-3 py-2 whitespace-nowrap transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'admin_company' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md border border-blue-300' 
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building2 size={13} />
                <span>Firma Talepleri</span>
                <span className="text-[9px] opacity-85 font-black">
                  ({(adminMessages || []).filter(m => m.senderType !== 'academic' && m.type !== 'academic').length})
                </span>
              </button>

              <button 
                onClick={() => { 
                  setActiveMode('admin_academic'); 
                  setSelectedEvalItem(null);
                  setSelectedAdminCompanyMsg(null);
                  setSelectedAdminAcademicMsg(null);
                  setSelectedCandidateChat(null);
                }}
                className={`px-3 py-2 whitespace-nowrap transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'admin_academic' 
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black shadow-md border border-purple-300' 
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <GraduationCap size={13} />
                <span>Akademik Talepler</span>
                <span className="text-[9px] opacity-85 font-black">
                  ({(adminMessages || []).filter(m => m.senderType === 'academic' || m.type === 'academic').length})
                </span>
              </button>

              <button 
                onClick={() => { 
                  setActiveMode('admin_ats'); 
                  setSelectedEvalItem(null);
                  setSelectedAdminCompanyMsg(null);
                  setSelectedAdminAcademicMsg(null);
                  setSelectedCandidateChat(null);
                }}
                className={`px-3 py-2 whitespace-nowrap transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMode === 'admin_ats' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-black shadow-md border border-yellow-200' 
                    : 'text-orange-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <MessageSquare size={13} />
                <span>ATS Aday Trafiği</span>
                <span className="text-[9px] opacity-85 font-black">({candidateChats.length})</span>
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOT HUB 1: DEĞERLENDİRME & KARAR MASASI (MERKEZİ HAVUZ)
             ═══════════════════════════════════════════════════════════════════ */}
          {isAdmin && activeMode === 'admin_eval' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {!selectedEvalItem ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Top Evaluation Pool Header & Metrics */}
                  <div className="p-3 bg-white border-b border-slate-200 shrink-0">
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <div className="p-2 bg-gradient-to-b from-amber-50 to-amber-100/90 border-2 border-amber-300 rounded-xl shadow-xs">
                        <span className="text-[9px] font-black text-amber-800 uppercase block">Bekleyen</span>
                        <span className="text-base font-black text-amber-900">{evalMetrics.pending}</span>
                      </div>
                      <div className="p-2 bg-gradient-to-b from-blue-50 to-blue-100/90 border-2 border-blue-300 rounded-xl shadow-xs">
                        <span className="text-[9px] font-black text-blue-800 uppercase block">İncelenen</span>
                        <span className="text-base font-black text-blue-900">{evalMetrics.reviewing}</span>
                      </div>
                      <div className="p-2 bg-gradient-to-b from-emerald-50 to-emerald-100/90 border-2 border-emerald-300 rounded-xl shadow-xs">
                        <span className="text-[9px] font-black text-emerald-800 uppercase block">Onaylanan</span>
                        <span className="text-base font-black text-emerald-900">{evalMetrics.approved}</span>
                      </div>
                      <div className="p-2 bg-gradient-to-b from-slate-100 to-slate-200/80 border-2 border-slate-300 rounded-xl shadow-xs">
                        <span className="text-[9px] font-black text-slate-700 uppercase block">Toplam</span>
                        <span className="text-base font-black text-slate-950">{evalMetrics.total}</span>
                      </div>
                    </div>

                    {/* Tree Branch Filter Pills */}
                    <div className="flex items-center gap-1 mt-2.5 overflow-x-auto no-scrollbar">
                      {[
                        { id: 'all', label: 'Tümü' },
                        { id: 'company', label: '🏢 Firmalar' },
                        { id: 'academic', label: '🏛️ Akademi' },
                        { id: 'student', label: '🎓 Öğrenciler' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setEvalSourceFilter(tab.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer shrink-0 ${
                            evalSourceFilter === tab.id
                              ? 'bg-slate-900 text-amber-400 shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex items-center gap-1 mt-1.5 overflow-x-auto no-scrollbar">
                      {[
                        { id: 'all', label: 'Tümü' },
                        { id: 'pending', label: '⏳ Bekleyen' },
                        { id: 'reviewing', label: '🔍 İncelenen' },
                        { id: 'approved', label: '✅ Onaylanan' },
                        { id: 'rejected', label: '❌ Reddedilen' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setEvalFilterTab(tab.id)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer shrink-0 ${
                            evalFilterTab === tab.id
                              ? 'bg-amber-500 text-slate-950 font-black'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative mt-2">
                      <Search size={13} className="absolute left-2.5 top-2 text-slate-600 font-bold" />
                      <input 
                        type="text"
                        value={evalSearchQuery}
                        onChange={(e) => setEvalSearchQuery(e.target.value)}
                        placeholder="Talep sahibi, kurum, konu veya içerik ara..."
                        className="w-full pl-7 pr-3 py-1 bg-slate-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Requests List */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                    {combinedEvaluationPool
                      .filter(item => {
                        if (evalSourceFilter !== 'all' && item.sourceType !== evalSourceFilter) return false;
                        if (evalFilterTab === 'pending' && item.status !== 'Beklemede') return false;
                        if (evalFilterTab === 'reviewing' && item.status !== 'İnceleniyor' && item.status !== 'İncelendi') return false;
                        if (evalFilterTab === 'approved' && item.status !== 'Onaylandı') return false;
                        if (evalFilterTab === 'rejected' && item.status !== 'Reddedildi') return false;
                        if (evalSearchQuery.trim()) {
                          const q = evalSearchQuery.toLowerCase();
                          const matchName = item.senderName?.toLowerCase().includes(q);
                          const matchSub = item.senderSub?.toLowerCase().includes(q);
                          const matchSubject = item.subject?.toLowerCase().includes(q);
                          const matchContent = item.content?.toLowerCase().includes(q);
                          if (!matchName && !matchSub && !matchSubject && !matchContent) return false;
                        }
                        return true;
                      })
                      .map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedEvalItem(item);
                            setEvalDecisionNote(item.decisionNote || '');
                          }}
                          className="p-3 bg-white hover:bg-amber-50/40 border border-slate-200/90 hover:border-amber-300 rounded-2xl transition cursor-pointer space-y-2 shadow-2xs group"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${item.sourceColor}`}>
                              {item.sourceLabel}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.priority && item.priority !== 'Normal' && (
                                <span className="px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded text-[9px] font-black">
                                  {item.priority}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${
                                item.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                item.status === 'Reddedildi' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                                item.status === 'İnceleniyor' || item.status === 'İncelendi' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-900 leading-snug">
                              {item.senderName}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-medium truncate">{item.senderSub}</p>
                            <p className="text-[11px] text-amber-950 font-bold mt-1 line-clamp-1">{item.subject}</p>
                          </div>

                          {item.content && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                              "{item.content}"
                            </p>
                          )}

                          {item.decisionNote && (
                            <div className="text-[10px] bg-amber-50/60 p-1.5 rounded-lg border border-amber-200/60 text-amber-900 font-medium">
                              <span className="font-bold">✓ KGM Kararı: </span>
                              <span className="line-clamp-1">{item.decisionNote}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                            <span>{item.date}</span>
                            <span className="font-black text-amber-700 hover:text-amber-900 flex items-center gap-0.5">
                              Talebi İncele <ChevronRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-t border-amber-200 flex items-center justify-between text-[11px] shrink-0">
                    <span className="font-black text-amber-950 flex items-center gap-1.5">
                      <Crown size={14} className="text-amber-600" /> Kariyer Değerlendirme
                    </span>
                    <button 
                      onClick={() => { setView?.('yonetim_konsolu'); setIsOpen(false); }}
                      className="font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm border border-amber-300 active:scale-95"
                    >
                      <LayoutDashboard size={13} /> Yönetim Konsoluna Git <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Single Item Decision Desk */
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                    {/* Source & Sender Header */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${selectedEvalItem.sourceColor}`}>
                          {selectedEvalItem.sourceLabel}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          selectedEvalItem.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          selectedEvalItem.status === 'Reddedildi' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                          selectedEvalItem.status === 'İnceleniyor' || selectedEvalItem.status === 'İncelendi' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          {selectedEvalItem.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900">{selectedEvalItem.senderName}</h4>
                        <p className="text-xs text-slate-600 font-medium">{selectedEvalItem.senderSub}</p>
                        <p className="text-[10px] text-slate-600 font-bold mt-0.5">{selectedEvalItem.date}</p>
                      </div>

                      {selectedEvalItem.studentId && (
                        <button
                          type="button"
                          onClick={() => handleNavigateToStudent(selectedEvalItem.studentId)}
                          className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <User size={13} /> Öğrenci Profilini Aç
                        </button>
                      )}
                    </div>

                    {/* Request Subject & Body */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 border-b border-slate-100 pb-1.5">
                        <FileText size={14} className="text-amber-600" />
                        <span>{selectedEvalItem.subject}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        {selectedEvalItem.content || 'Açıklama belirtilmemiş.'}
                      </p>
                    </div>

                    {/* Official Decision Section */}
                    <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-black text-amber-950">
                        <div className="flex items-center gap-1.5">
                          <Scale size={15} className="text-amber-700" />
                          <span>KGM Resmî Yönetici Kararı & Notu</span>
                        </div>
                        <span className="text-[9px] text-amber-700 font-medium">Süper Admin Yetkisi</span>
                      </div>

                      {/* Quick Template Chips */}
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <button
                          type="button"
                          onClick={() => setEvalDecisionNote('Talebiniz Kariyer Geliştirme Koordinatörlüğü tarafından incelenmiş olup ONAYLANMIŞTIR. İlgili birimlerle koordinasyon sağlanmıştır.')}
                          className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[9px] font-bold whitespace-nowrap cursor-pointer"
                        >
                          ✓ Onay Şablonu
                        </button>
                        <button
                          type="button"
                          onClick={() => setEvalDecisionNote('Talebiniz ön inceleme aşamasına alınmıştır. İlgili fakülte ve birim koordinatörümüz sizinle iletişime geçecektir.')}
                          className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded text-[9px] font-bold whitespace-nowrap cursor-pointer"
                        >
                          🔍 İnceleme Şablonu
                        </button>
                        <button
                          type="button"
                          onClick={() => setEvalDecisionNote('Mevcut kontenjan, takvim ve mevzuat gereği talebiniz bu dönem için onaylanamamıştır.')}
                          className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded text-[9px] font-bold whitespace-nowrap cursor-pointer"
                        >
                          ✕ Red Gerekçesi
                        </button>
                      </div>

                      <textarea
                        value={evalDecisionNote}
                        onChange={(e) => setEvalDecisionNote(e.target.value)}
                        placeholder="Resmî karar gerekçesi, onay notu veya geri bildirim yazın..."
                        rows={3}
                        className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                      />

                      {/* Decision Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateEvaluation(selectedEvalItem, 'Onaylandı', evalDecisionNote)}
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Onayla
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateEvaluation(selectedEvalItem, 'İnceleniyor', evalDecisionNote)}
                          className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Search size={14} /> İncele
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateEvaluation(selectedEvalItem, 'Reddedildi', evalDecisionNote)}
                          className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle size={14} /> Reddet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOT HUB 2: KURUMSAL FİRMA TALEPLERİ MASASI
             ═══════════════════════════════════════════════════════════════════ */}
          {isAdmin && activeMode === 'admin_company' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {!selectedAdminCompanyMsg ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs shrink-0">
                    <span className="font-black text-blue-950 flex items-center gap-1.5">
                      <Building2 size={15} className="text-blue-700" />
                      Kurumsal İletişim & Talepler
                    </span>
                    <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                      {(adminMessages || []).filter(m => m.senderType !== 'academic' && m.type !== 'academic').length} Talep
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                    {(adminMessages || [])
                      .filter(m => m.senderType !== 'academic' && m.type !== 'academic')
                      .map(msg => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedAdminCompanyMsg(msg)}
                          className="p-3.5 bg-white hover:bg-blue-50/40 border border-slate-200 rounded-2xl transition cursor-pointer space-y-2 shadow-2xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-black text-xs text-slate-900 group-hover:text-blue-900 truncate">
                                {msg.companyName || msg.senderName || 'Kurumsal Firma'}
                              </h4>
                              <p className="text-[10px] text-slate-600 font-bold truncate">{msg.email || msg.phone || 'Kurumsal İK'}</p>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                              msg.status === 'Onaylandı' || msg.status === 'Yanıtlandı' || msg.status === 'Çözüldü'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {msg.status || 'Beklemede'}
                            </span>
                          </div>

                          <p className="text-[11px] text-blue-950 font-bold line-clamp-1">{msg.subject}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                            "{msg.message}"
                          </p>

                          {msg.reply && (
                            <div className="text-[10px] bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 text-emerald-900 font-medium">
                              <span className="font-bold">✓ İletilen Yanıt: </span>
                              <span className="line-clamp-1">{msg.reply}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                            <span>{msg.date || 'Tarih belirtilmedi'}</span>
                            <span className="font-black text-blue-800 flex items-center gap-0.5">
                              İncele & Yanıtla <ChevronRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">Kurumsal İletişim</span>
                    <button 
                      onClick={() => { setView?.('yonetim_konsolu'); setIsOpen(false); }}
                      className="font-black text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Yönetim Konsolunu Aç <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                    <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Kurumsal Firma Bilgisi</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                          {selectedAdminCompanyMsg.status || 'Beklemede'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{selectedAdminCompanyMsg.companyName || 'Kurumsal Firma'}</h4>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>📧 {selectedAdminCompanyMsg.email || 'Belirtilmedi'}</p>
                        <p>📞 {selectedAdminCompanyMsg.phone || 'Belirtilmedi'}</p>
                        <p className="text-[10px] text-slate-600 font-bold">Tarih: {selectedAdminCompanyMsg.date}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <h5 className="font-black text-xs text-slate-800">{selectedAdminCompanyMsg.subject}</h5>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {selectedAdminCompanyMsg.message}
                      </p>
                    </div>

                    {selectedAdminCompanyMsg.reply && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                        <span className="font-bold block text-[10px] text-emerald-800 uppercase">Önceki KGM Yanıtı:</span>
                        <p>{selectedAdminCompanyMsg.reply}</p>
                      </div>
                    )}
                  </div>

                  {/* Reply input */}
                  <form onSubmit={handleAdminSendCompanyReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                    <input 
                      type="text"
                      value={adminCompanyReplyText}
                      onChange={(e) => setAdminCompanyReplyText(e.target.value)}
                      placeholder="Firmaya resmî KGM yanıtı veya koordinasyon notu yaz..."
                      className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      type="submit"
                      disabled={!adminCompanyReplyText.trim()}
                      className="w-9 h-9 bg-blue-900 hover:bg-blue-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                      title="Yanıt Gönder"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOT HUB 3: AKADEMİK PERSONEL TALEPLERİ MASASI
             ═══════════════════════════════════════════════════════════════════ */}
          {isAdmin && activeMode === 'admin_academic' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {!selectedAdminAcademicMsg ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-3 bg-purple-50/60 border-b border-purple-100 flex items-center justify-between text-xs shrink-0">
                    <span className="font-black text-purple-950 flex items-center gap-1.5">
                      <GraduationCap size={15} className="text-[#4C1D95]" />
                      Akademik Görüşmeler & Talepler
                    </span>
                    <span className="text-[10px] text-purple-800 font-bold bg-white px-2 py-0.5 rounded-full border border-purple-200">
                      {(adminMessages || []).filter(m => m.senderType === 'academic' || m.type === 'academic').length} Talep
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                    {(adminMessages || [])
                      .filter(m => m.senderType === 'academic' || m.type === 'academic')
                      .map(msg => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedAdminAcademicMsg(msg)}
                          className="p-3.5 bg-white hover:bg-purple-50/40 border border-slate-200 rounded-2xl transition cursor-pointer space-y-2 shadow-2xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-black text-xs text-slate-900 group-hover:text-purple-900 truncate">
                                {msg.senderName || 'Öğretim Görevlisi'}
                              </h4>
                              <p className="text-[10px] text-slate-600 font-bold truncate">{msg.department || 'Fakülte Danışmanı'}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {msg.priority && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                  {msg.priority}
                                </span>
                              )}
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                                msg.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {msg.status || 'Beklemede'}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-purple-950 font-bold line-clamp-1">{msg.subject}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                            "{msg.message}"
                          </p>

                          {msg.reply && (
                            <div className="text-[10px] bg-purple-50 p-1.5 rounded-lg border border-purple-200 text-purple-950 font-medium">
                              <span className="font-bold">✓ İletilen Yanıt: </span>
                              <span className="line-clamp-1">{msg.reply}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                            <span>{msg.date || 'Bugün'}</span>
                            <span className="font-black text-[#4C1D95] flex items-center gap-0.5">
                              Değerlendir <ChevronRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">KGM Fakülte & Rektörlük Koordinasyonu</span>
                    <button 
                      onClick={() => { setView?.('yonetim_konsolu'); setIsOpen(false); }}
                      className="font-black text-[#4C1D95] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Yönetim Konsolunu Aç <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                    <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-purple-800 uppercase tracking-wider">Akademisyen Bilgisi</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                          {selectedAdminAcademicMsg.status || 'Beklemede'}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{selectedAdminAcademicMsg.senderName || 'Öğretim Üyesi'}</h4>
                      <div className="text-xs text-slate-600 space-y-0.5">
                        <p>🏛️ {selectedAdminAcademicMsg.department || 'Mühendislik Fakültesi'}</p>
                        <p>⚡ Öncelik: {selectedAdminAcademicMsg.priority || 'Normal'}</p>
                        <p className="text-[10px] text-slate-600 font-bold">Tarih: {selectedAdminAcademicMsg.date}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <h5 className="font-black text-xs text-slate-800">{selectedAdminAcademicMsg.subject}</h5>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {selectedAdminAcademicMsg.message}
                      </p>
                    </div>

                    {selectedAdminAcademicMsg.reply && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-950 space-y-1">
                        <span className="font-bold block text-[10px] text-purple-800 uppercase">Önceki Resmî Karar Notu:</span>
                        <p>{selectedAdminAcademicMsg.reply}</p>
                      </div>
                    )}
                  </div>

                  {/* Reply input */}
                  <form onSubmit={handleAdminSendAcademicReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                    <input 
                      type="text"
                      value={adminAcademicReplyText}
                      onChange={(e) => setAdminAcademicReplyText(e.target.value)}
                      placeholder="Öğretim üyesine resmi karar veya protokol notu yaz..."
                      className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button 
                      type="submit"
                      disabled={!adminAcademicReplyText.trim()}
                      className="w-9 h-9 bg-[#4C1D95] hover:bg-purple-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                      title="Kararı İlet"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              ROOT HUB 4: ATS ADAY TRAFİĞİ DENETİM MASASI
             ═══════════════════════════════════════════════════════════════════ */}
          {isAdmin && activeMode === 'admin_ats' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {!selectedCandidateChat ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search */}
                  <div className="p-3 bg-white border-b border-slate-100 shrink-0">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-600 font-bold" />
                      <input 
                        type="text" 
                        value={candidateSearchQuery}
                        onChange={(e) => setCandidateSearchQuery(e.target.value)}
                        placeholder="Aday, firma veya pozisyona göre ara..." 
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500" 
                      />
                    </div>
                  </div>

                  {/* Supervisor Banner */}
                  <div className="px-3.5 py-2 bg-amber-50 border-b border-amber-200/80 flex items-center gap-2 text-[11px] text-amber-900 font-bold shrink-0">
                    <ShieldCheck size={14} className="text-amber-700 shrink-0" />
                    <span>Üniversite geneli mülakat ve aday görüşmeleri denetim kayıtları.</span>
                  </div>

                  {/* Candidate chats list */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {candidateChats
                      .filter(c => 
                        c.candidateName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) || 
                        c.candidateRole.toLowerCase().includes(candidateSearchQuery.toLowerCase()) ||
                        (c.companyName && c.companyName.toLowerCase().includes(candidateSearchQuery.toLowerCase()))
                      )
                      .map(chat => {
                        const lastMsg = chat.messages?.[chat.messages.length - 1];
                        return (
                          <div 
                            key={chat.id}
                            onClick={() => setSelectedCandidateChat(chat)}
                            className="p-3 bg-white hover:bg-amber-50/30 border border-slate-200/80 hover:border-amber-300 rounded-2xl transition cursor-pointer space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img 
                                  src={chat.candidateAvatar} 
                                  alt={chat.candidateName} 
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                                />
                                <div className="min-w-0">
                                  <h4 className="font-black text-xs text-slate-900 truncate leading-tight">{chat.candidateName}</h4>
                                  <p className="text-[10px] text-blue-700 font-bold truncate">{chat.candidateRole} • {chat.companyName}</p>
                                </div>
                              </div>
                              <span className="text-[9px] text-slate-600 font-bold shrink-0">{chat.lastActive}</span>
                            </div>

                            {lastMsg && (
                              <p className="text-[11px] text-slate-600 truncate pl-11">
                                <span className="font-bold text-slate-700">{lastMsg.senderName}: </span>
                                {lastMsg.text}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 pl-11 text-[10px]">
                              <span className="text-slate-600 font-bold truncate">{chat.candidateDept}</span>
                              <span className="font-bold text-amber-700 hover:underline flex items-center gap-0.5">
                                Görüşmeyi Denetle <ChevronRight size={12} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">KGM Aday Havuzu & ATS Trafiği</span>
                    <button 
                      onClick={() => { setView?.('company_ats'); setIsOpen(false); }}
                      className="font-black text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Aday Takip Panosunu Aç <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Single candidate chat inspector */
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button 
                        onClick={() => setSelectedCandidateChat(null)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer shrink-0"
                        title="Listeye Dön"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <img 
                        src={selectedCandidateChat.candidateAvatar} 
                        alt={selectedCandidateChat.candidateName} 
                        className="w-8 h-8 rounded-full object-cover border border-blue-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <h4 className="font-black text-xs text-slate-900 truncate leading-tight">{selectedCandidateChat.candidateName}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{selectedCandidateChat.companyName} • {selectedCandidateChat.candidateRole}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleNavigateToStudent(selectedCandidateChat.candidateId)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                    >
                      <User size={12} /> Profil
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                    {(selectedCandidateChat.messages || []).map((msg) => {
                      const isCompanySender = msg.sender === 'company' || msg.sender === 'admin';
                      return (
                        <div key={msg.id} className={`flex flex-col ${isCompanySender ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] text-slate-600 font-bold px-1 mb-0.5">
                            {msg.senderName}
                          </span>
                          <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isCompanySender 
                              ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-600 font-bold mt-0.5 px-1">{msg.time}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Super Admin Direct Message Form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!candidateMessageText.trim() || !selectedCandidateChat) return;
                      const newMsg = {
                        id: 'm_' + Date.now(),
                        sender: 'admin',
                        senderName: currentUser?.name || 'Süper Yönetici',
                        text: candidateMessageText.trim(),
                        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                      };
                      const updatedChats = candidateChats.map(c => {
                        if (c.id === selectedCandidateChat.id) {
                          return { ...c, lastActive: 'Şimdi', messages: [...(c.messages || []), newMsg] };
                        }
                        return c;
                      });
                      saveCandidateChats(updatedChats);
                      setSelectedCandidateChat(prev => ({
                        ...prev,
                        lastActive: 'Şimdi',
                        messages: [...(prev.messages || []), newMsg]
                      }));
                      recordMessageAudit(
                        currentUser?.id,
                        currentUser?.name || 'Süper Yönetici',
                        'admin',
                        selectedCandidateChat.candidateId,
                        selectedCandidateChat.candidateName,
                        selectedCandidateChat.candidateRole || 'student',
                        candidateMessageText.trim()
                      );
                      setCandidateMessageText('');
                      window.toast?.success?.(`💬 Mesajınız ${selectedCandidateChat.candidateName} kullanıcısına iletildi.`);
                    }}
                    className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
                  >
                    <input 
                      type="text" 
                      value={candidateMessageText}
                      onChange={(e) => setCandidateMessageText(e.target.value)}
                      placeholder={`${selectedCandidateChat.candidateName || 'Kullanıcıya'} resmî mesajınızı yazın...`}
                      className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    />
                    <button 
                      type="submit" 
                      disabled={!candidateMessageText.trim()}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Send size={13} /> Gönder
                    </button>
                  </form>

                  <div className="p-3 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs text-amber-900 shrink-0">
                    <span className="font-bold flex items-center gap-1">
                      <ShieldCheck size={14} className="text-amber-700" />
                      KGM Süper Admin Gözetim Kaydı
                    </span>
                    <button
                      onClick={() => { setView?.('company_ats'); setIsOpen(false); }}
                      className="font-black text-amber-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Tam ATS Görünümü <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              LEAF 1: KURUMSAL FİRMA / İŞVEREN KANADI (ATS ADAY İLETİŞİMİ)
             ═══════════════════════════════════════════════════════════════════ */}
          {isCompany && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              {!selectedCandidateChat ? (
                // Candidate Chat List
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Search Bar */}
                  <div className="p-3 bg-white border-b border-slate-100 shrink-0">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-600 font-bold" />
                      <input 
                        type="text" 
                        value={candidateSearchQuery}
                        onChange={(e) => setCandidateSearchQuery(e.target.value)}
                        placeholder="Aday adı veya pozisyona göre ara..." 
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {candidateChats
                      .filter(c => 
                        c.candidateName.toLowerCase().includes(candidateSearchQuery.toLowerCase()) || 
                        c.candidateRole.toLowerCase().includes(candidateSearchQuery.toLowerCase())
                      )
                      .map(chat => {
                        const lastMsg = chat.messages?.[chat.messages.length - 1];
                        return (
                          <div 
                            key={chat.id}
                            onClick={() => setSelectedCandidateChat(chat)}
                            className="p-3 bg-white hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 rounded-2xl transition-all cursor-pointer space-y-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img 
                                  src={chat.candidateAvatar} 
                                  alt={chat.candidateName} 
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                                />
                                <div className="min-w-0">
                                  <h4 className="font-black text-xs text-slate-900 truncate leading-tight">{chat.candidateName}</h4>
                                  <p className="text-[10px] text-blue-700 font-bold truncate">{chat.candidateRole}</p>
                                </div>
                              </div>
                              <span className="text-[9px] text-slate-600 font-bold shrink-0">{chat.lastActive}</span>
                            </div>

                            {lastMsg && (
                              <p className="text-[11px] text-slate-600 truncate pl-11">
                                <span className="font-bold text-slate-700">{lastMsg.sender === 'company' ? 'Siz: ' : ''}</span>
                                {lastMsg.text}
                              </p>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 pl-11 text-[10px]">
                              <span className="text-slate-600 font-bold truncate">{chat.candidateDept}</span>
                              <span className="font-bold text-blue-900 hover:underline flex items-center gap-0.5">
                                Görüş <ChevronRight size={12} />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                // Active Candidate Chat Conversation Thread
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  {/* Candidate Profile Bar */}
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={selectedCandidateChat.candidateAvatar} 
                        alt={selectedCandidateChat.candidateName} 
                        className="w-8 h-8 rounded-full object-cover border border-blue-200 shrink-0" 
                      />
                      <div className="min-w-0">
                        <h4 className="font-black text-xs text-slate-900 truncate leading-tight">{selectedCandidateChat.candidateName}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{selectedCandidateChat.candidateDept}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleNavigateToStudent(selectedCandidateChat.candidateId)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
                    >
                      <User size={12} /> Profil
                    </button>
                  </div>

                  {/* Messages Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                    {(selectedCandidateChat.messages || []).map((msg) => {
                      const isMe = msg.sender === 'company';
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] text-slate-600 font-bold px-1 mb-0.5">
                            {msg.senderName || (isMe ? 'Kurumsal İK' : selectedCandidateChat.candidateName)}
                          </span>
                          <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                            isMe 
                              ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-tr-none' 
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-600 font-bold mt-0.5 px-1">{msg.time}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Chips for Recruitment */}
                  <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                    <button 
                      onClick={() => handleQuickChipCompany('Merhaba, başvurunuz olumlu değerlendirildi. Mülakat tarihi belirlemek için uygunluk saatlerinizi iletir misiniz?')}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                    >
                      📅 Mülakata Çağır
                    </button>
                    <button 
                      onClick={() => handleQuickChipCompany('Merhaba, teknik portfolyonuz ve projeleriniz hakkında ek bilgi/GitHub linki paylaşabilir misiniz?')}
                      className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                    >
                      📄 Portfolyo İste
                    </button>
                    <button 
                      onClick={() => handleQuickChipCompany('Tebrik ederiz! Başvurunuz onaylanmıştır. Staj kabul evraklarınız Kariyer Geliştirme Koordinatörlüğüne iletilecektir.')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                    >
                      ✅ Kabul Bildir
                    </button>
                  </div>

                  {/* Message Input Form */}
                  <form onSubmit={handleSendCandidateMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                    <input 
                      type="text" 
                      value={candidateMessageText}
                      onChange={(e) => setCandidateMessageText(e.target.value)}
                      placeholder="Adaya kurumsal mesaj yaz..." 
                      className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                    <button 
                      type="submit"
                      disabled={!candidateMessageText.trim()}
                      className="w-9 h-9 bg-blue-900 hover:bg-blue-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                      title="Gönder"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}

              {/* Footer Bar */}
              <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                <span className="font-bold">İESÜ Kurumsal İK İletişim Hattı</span>
                <button 
                  onClick={() => { setView?.('company_ats'); setIsOpen(false); }}
                  className="font-black text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ATS Aday Havuzu <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              LEAF 2: AKADEMİK PERSONEL KANADI (DANIŞMANLIK & RANDEVULAR)
             ═══════════════════════════════════════════════════════════════════ */}
          {isAcademic && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {!activeReq ? (
                // Request List View
                <>
                  {/* Status Filter Tabs */}
                  <div className="flex border-b border-purple-100 bg-purple-50/50 p-2 gap-1.5 shrink-0">
                    {[
                      { id: 'all', label: 'Tümü' },
                      { id: 'pending', label: 'Bekleyenler' },
                      { id: 'approved', label: 'Onaylananlar' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCounselingFilterTab(tab.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                          counselingFilterTab === tab.id
                            ? 'bg-[#4C1D95] text-white shadow-xs'
                            : 'text-purple-900 hover:bg-purple-100/70'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* List Items */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                    {requests
                      .filter(r => {
                        if (counselingFilterTab === 'pending') return r.status === 'Beklemede';
                        if (counselingFilterTab === 'approved') return r.status === 'Onaylandı';
                        return true;
                      })
                      .map(req => (
                        <div 
                          key={req.id}
                          onClick={() => setActiveReq(req)}
                          className="p-3 bg-white hover:bg-purple-50/50 border border-slate-200/90 hover:border-purple-300 rounded-2xl transition-all cursor-pointer space-y-2 shadow-2xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img 
                                src={req.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.studentName)}&background=4C1D95&color=fff`} 
                                alt={req.studentName} 
                                className="w-9 h-9 rounded-full object-cover border border-purple-200 shrink-0" 
                              />
                              <div className="min-w-0">
                                <h4 className="font-black text-xs text-gray-900 truncate leading-tight group-hover:text-purple-900">
                                  {req.studentName}
                                </h4>
                                <p className="text-[10px] text-gray-500 font-medium truncate">{req.studentDept}</p>
                              </div>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                              req.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {req.status}
                            </span>
                          </div>

                          <div className="bg-purple-50/60 p-2 rounded-xl text-[11px] text-purple-950 font-bold border border-purple-100/60 flex items-center justify-between">
                            <span className="truncate">{req.topic || req.subject}</span>
                            <span className="text-[9px] text-purple-700 shrink-0 font-medium ml-2">{req.preferredDate}</span>
                          </div>

                          {req.note && (
                            <p className="text-[11px] text-gray-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                              "{req.note}"
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                // Request Detail & Reply Form
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {/* Student Card */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={activeReq.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeReq.studentName)}&background=4C1D95&color=fff`} 
                            alt={activeReq.studentName} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200" 
                          />
                          <div>
                            <h4 className="font-black text-sm text-gray-900">{activeReq.studentName}</h4>
                            <p className="text-xs text-purple-900 font-bold">{activeReq.studentDept}</p>
                            <p className="text-[10px] text-gray-400">{activeReq.studentEmail}</p>
                          </div>
                        </div>

                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          activeReq.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activeReq.status}
                        </span>
                      </div>

                      <button 
                        type="button"
                        onClick={() => handleNavigateToStudent(activeReq.studentId)}
                        className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-[#4C1D95] rounded-xl text-xs font-black transition flex items-center justify-center gap-2 border border-purple-200 cursor-pointer"
                      >
                        <User size={14} /> Öğrencinin Profiline Git →
                      </button>
                    </div>

                    {/* Appointment Details */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                      <div className="font-bold text-gray-700 flex items-center gap-1.5 border-b pb-2">
                        <ShieldCheck size={16} className="text-[#4C1D95]" />
                        <span>Talep Detayları</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-gray-400 block text-[9px] uppercase font-bold">Görüşme Tarihi</span>
                          <span className="font-black text-gray-800 flex items-center gap-1 mt-0.5">
                            <Calendar size={12} className="text-[#4C1D95]" /> {activeReq.preferredDate}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-gray-400 block text-[9px] uppercase font-bold">Saat Dilimi</span>
                          <span className="font-black text-gray-800 flex items-center gap-1 mt-0.5">
                            <Clock size={12} className="text-[#4C1D95]" /> {activeReq.preferredTimeSlot}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl text-[11px]">
                        <span className="text-gray-400 block text-[9px] uppercase font-bold">Platform / Yerleşke</span>
                        <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-[#4C1D95]" /> {activeReq.platform || activeReq.mode}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase font-bold mb-1">Öğrencinin Notu</span>
                        <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-gray-800 leading-relaxed">
                          {activeReq.note || activeReq.details || 'Açıklama belirtilmemiş.'}
                        </div>
                      </div>
                    </div>

                    {/* Replies Stream */}
                    {activeReq.replies && activeReq.replies.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">İletişim & Yanıt Geçmişi</span>
                        {activeReq.replies.map((rep, idx) => {
                          const isAcademicSender = rep.sender === 'academic';
                          return (
                            <div 
                              key={idx} 
                              className={`p-2.5 rounded-xl text-xs space-y-1 border ${
                                isAcademicSender 
                                  ? 'bg-purple-50 border-purple-200 text-purple-950' 
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                              }`}
                            >
                              <div className="flex justify-between text-[9px] font-bold">
                                <span className={isAcademicSender ? 'text-purple-800' : 'text-slate-600'}>
                                  {isAcademicSender ? '✓ Danışman Yanıtı' : `Öğrenci Notu (${rep.senderName || 'Öğrenci'})`}
                                </span>
                                <span className="text-slate-600 font-bold">{rep.date}</span>
                              </div>
                              <p>{rep.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeReq.status !== 'Onaylandı' && (
                      <button 
                        type="button"
                        onClick={() => handleApproveCounseling(activeReq.id)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 size={16} /> Bu Randevuyu Onayla
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendCounselingReply} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shrink-0">
                    <input 
                      type="text" 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Öğrenciye resmi yanıt veya görüşme linki yaz..." 
                      className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400" 
                    />
                    <button 
                      type="submit"
                      disabled={!replyText.trim()}
                      className="w-9 h-9 bg-[#4C1D95] hover:bg-purple-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer"
                      title="Gönder"
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              )}

              {/* Footer Bar */}
              <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
                <span className="font-bold">İESÜ Resmî Akademik Danışmanlık</span>
                <button 
                  onClick={handleOpenBulkPanel}
                  className="font-black text-[#4C1D95] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Toplu Panel <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              LEAF 3: ÖĞRENCİ & MEZUN KANADI (İKİ DALLI GELEN KUTUSU)
             ═══════════════════════════════════════════════════════════════════ */}
          {/* ═══════════════════════════════════════════════════════════════════
              LEAF 3: MEZUN PORTALI ÖZEL KANADI (ZÜMRÜT YEŞİLİ SOHBET MASASI)
             ═══════════════════════════════════════════════════════════════════ */}
          {isAlumni && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              
              {/* SUB-BRANCH 3A: MEZUN & MENTÖRLÜK AĞI SOHBETLERİ */}
              {activeMode === 'alumni_network' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {!selectedCandidateChat ? (
                    // Alumni Peer & Mentorship Chat List
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
                        <span className="font-black text-slate-800 flex items-center gap-1.5">
                          <Users size={15} className="text-[#0F766E]" />
                          Mezun & Mentörlük Ağı
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {alumniNetworkChats.length} Aktif Görüşme
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {alumniNetworkChats.map(chat => {
                          const lastMsg = chat.messages?.[chat.messages.length - 1];
                          const isStudentContact = chat.candidateRole === 'student';
                          return (
                            <div 
                              key={chat.id}
                              onClick={() => setSelectedCandidateChat(chat)}
                              className="p-3.5 bg-white hover:bg-emerald-50/30 border border-slate-200 hover:border-emerald-200 rounded-2xl transition cursor-pointer shadow-2xs space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {chat.candidateAvatar ? (
                                    <img 
                                      src={chat.candidateAvatar} 
                                      alt={chat.candidateName || 'Profil'} 
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 bg-gradient-to-br from-[#0F766E] to-emerald-900">
                                      <Users size={18} />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="font-black text-xs text-slate-900 truncate leading-tight group-hover:text-[#0F766E]">
                                      {chat.candidateName || 'İESÜ Üyesi'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5">
                                      {chat.candidateDept || (isStudentContact ? 'Öğrenci Mentee' : 'Mezun')}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                                  isStudentContact
                                    ? 'bg-rose-50 text-[#990000] border-rose-200'
                                    : 'bg-emerald-50 text-[#0F766E] border-emerald-200'
                                }`}>
                                  {isStudentContact ? 'Öğrenci Mentee' : 'Mezun Ağı'}
                                </span>
                              </div>

                              {lastMsg && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed font-medium">
                                  <span className="font-bold text-slate-800">{lastMsg.sender === 'candidate' ? `${chat.candidateName}: ` : 'Siz: '}</span>
                                  {lastMsg.text}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1"><Clock size={11} /> {chat.lastActive}</span>
                                <span className="font-black flex items-center gap-0.5 text-[#0F766E]">
                                  Sohbeti Aç <ChevronRight size={12} />
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {alumniNetworkChats.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                            <Users size={32} className="mx-auto text-emerald-300" />
                            <h4 className="text-xs font-black text-slate-800">Mezun Ağı Sohbetiniz Bulunmuyor</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Mezun ve öğrenci arkadaşlarımızın profillerini ziyaret ederek doğrudan kariyer ve mentörlük sohbeti başlatabilirsiniz.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Conversation View: Alumni Network Chat
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button 
                            type="button"
                            onClick={() => setSelectedCandidateChat(null)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
                            title="Listeye Dön"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          {selectedCandidateChat.candidateAvatar ? (
                            <img 
                              src={selectedCandidateChat.candidateAvatar} 
                              alt={selectedCandidateChat.candidateName || 'Profil'} 
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 bg-[#0F766E]">
                              <Users size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate leading-tight">
                              {selectedCandidateChat.candidateName || 'Görüşme'}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold truncate">
                              {selectedCandidateChat.candidateDept || 'İESÜ Üyesi'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F766E] border border-emerald-200 shrink-0">
                          {selectedCandidateChat.candidateRole === 'student' ? '🎓 Mentee' : '🤝 Mezun Ağı'}
                        </span>
                      </div>

                      {/* Messages Flow */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                        {(selectedCandidateChat.messages || []).map(msg => {
                          const isSelfMsg = msg.sender !== 'candidate' && msg.sender !== selectedCandidateChat.candidateId;
                          const senderDisplay = isSelfMsg ? 'Siz' : (msg.senderName || selectedCandidateChat.candidateName || 'Muhatap');
                          return (
                            <div key={msg.id} className={`flex flex-col ${isSelfMsg ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-slate-600 font-bold px-1 mb-0.5">
                                {senderDisplay}
                              </span>
                              <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                                isSelfMsg
                                  ? 'bg-gradient-to-r from-[#0F766E] to-emerald-900 text-white rounded-tr-none'
                                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-600 font-bold mt-0.5 px-1">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Chips for Alumni Mentorship */}
                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        <button 
                          onClick={() => handleQuickChipStudent('🤝 Memnuniyetle mentörlük desteği sağlayabilirim.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          🤝 Mentörlük verebilirim
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('💼 Sektörel deneyimlerimi ve açık pozisyonları paylaşabilirim.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          💼 Deneyimlerimi paylaşayım
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('☕ Kampüste veya online bir kahve sohbeti ayarlayalım.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          ☕ Kahve sohbeti yapalım
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('🚀 Başarılar dilerim, her zaman yazabilirsin.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          🚀 Başarılar dilerim
                        </button>
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleStudentSendCompanyReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                        <input 
                          type="text" 
                          value={studentCompanyReplyText}
                          onChange={(e) => setStudentCompanyReplyText(e.target.value)}
                          placeholder={`${selectedCandidateChat.candidateName || 'Kişiye'} mesajınızı yazın...`} 
                          className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F766E]" 
                        />
                        <button 
                          type="submit"
                          disabled={!studentCompanyReplyText.trim()}
                          className="w-9 h-9 bg-[#0F766E] hover:bg-emerald-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                          title="Yanıtı Gönder"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">İESÜ Mezunlar İletişim Ağı</span>
                    <button 
                      onClick={() => { setView?.('alumni'); setIsOpen(false); }}
                      className="font-black hover:underline flex items-center gap-1 cursor-pointer text-[#0F766E]"
                    >
                      Mezun Ağını Keşfet <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-BRANCH 3B: KURUMSAL İLETİŞİM & FİRMA MESAJLARI */}
              {activeMode === 'alumni_company' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {!selectedCandidateChat ? (
                    // Corporate Messages List for Alumni
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
                        <span className="font-black text-slate-800 flex items-center gap-1.5">
                          <Building2 size={15} className="text-[#0F766E]" />
                          Kurumsal İletişim Kutusu
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {alumniCompanyChats.length} Kurumsal Görüşme
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {alumniCompanyChats.map(chat => {
                          const lastMsg = chat.messages?.[chat.messages.length - 1];
                          return (
                            <div 
                              key={chat.id}
                              onClick={() => setSelectedCandidateChat(chat)}
                              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition cursor-pointer shadow-2xs space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {chat.candidateAvatar ? (
                                    <img 
                                      src={chat.candidateAvatar} 
                                      alt={chat.candidateName || chat.companyName || 'Profil'} 
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 bg-gradient-to-br from-[#0F766E] to-emerald-900">
                                      <Building2 size={18} />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="font-black text-xs text-slate-900 truncate leading-tight group-hover:text-blue-900">
                                      {chat.companyName || chat.candidateName || 'Kurumsal Firma'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5">
                                      {chat.candidateDept || 'Kurumsal İK & İşe Alım'}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                                  chat.status === 'Mülakat' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                  chat.status === 'Teklif Aşaması' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  'bg-blue-50 text-blue-800 border-blue-200'
                                }`}>
                                  {chat.status || 'Aktif Görüşme'}
                                </span>
                              </div>

                              {lastMsg && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed font-medium">
                                  <span className="font-bold text-slate-800">{lastMsg.sender === 'company' ? 'Firma: ' : 'Siz: '}</span>
                                  {lastMsg.text}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1"><Clock size={11} /> {chat.lastActive}</span>
                                <span className="font-black flex items-center gap-0.5 text-[#0F766E]">
                                  Mesajı Yanıtla <ChevronRight size={12} />
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {alumniCompanyChats.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                            <Building2 size={32} className="mx-auto text-slate-300" />
                            <h4 className="text-xs font-black text-slate-800">Gelen Kurumsal Mesaj Yok</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              İşverenler profilinizi ve sektörel deneyimlerinizi incelediğinde kurumsal teklif ve mesajlar burada listelenir.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Conversation View: Alumni talking to Company
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button 
                            type="button"
                            onClick={() => setSelectedCandidateChat(null)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
                            title="Listeye Dön"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          {selectedCandidateChat.candidateAvatar ? (
                            <img 
                              src={selectedCandidateChat.candidateAvatar} 
                              alt={selectedCandidateChat.candidateName || selectedCandidateChat.companyName || 'Profil'} 
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 bg-[#0F766E]">
                              <Building2 size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate leading-tight">
                              {selectedCandidateChat.companyName || selectedCandidateChat.candidateName || 'Kurumsal Görüşme'}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold truncate">
                              {selectedCandidateChat.candidateDept || 'İşe Alım Ekibi'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 shrink-0">
                          {selectedCandidateChat.status || 'Aktif Sohbet'}
                        </span>
                      </div>

                      {/* Messages Flow */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                        {(selectedCandidateChat.messages || []).map(msg => {
                          const isSelfMsg = msg.sender !== 'company';
                          const senderDisplay = isSelfMsg ? 'Siz' : (msg.senderName || selectedCandidateChat.companyName || 'Firma İK');
                          return (
                            <div key={msg.id} className={`flex flex-col ${isSelfMsg ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-slate-600 font-bold px-1 mb-0.5">
                                {senderDisplay}
                              </span>
                              <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                                isSelfMsg
                                  ? 'bg-gradient-to-r from-[#0F766E] to-emerald-900 text-white rounded-tr-none'
                                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-600 font-bold mt-0.5 px-1">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Chips for Alumni Corporate */}
                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        <button 
                          onClick={() => handleQuickChipStudent('Merhaba, güncel CV ve portfolyom profilimde yer almaktadır.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          📄 Portfolyom profilimde
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('Merhaba, pozisyon detayları hakkında görüşmeye hazırım.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          💼 Görüşmeye hazırım
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('İletişiminiz ve ilginiz için çok teşekkür ederim, detayları öğrenmek isterim.')}
                          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          🙏 İlginiz için teşekkürler
                        </button>
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleStudentSendCompanyReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                        <input 
                          type="text" 
                          value={studentCompanyReplyText}
                          onChange={(e) => setStudentCompanyReplyText(e.target.value)}
                          placeholder={`${selectedCandidateChat.companyName || selectedCandidateChat.candidateName || 'Firmaya'} yanıtınızı yazın...`} 
                          className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0F766E]" 
                        />
                        <button 
                          type="submit"
                          disabled={!studentCompanyReplyText.trim()}
                          className="w-9 h-9 bg-[#0F766E] hover:bg-emerald-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                          title="Yanıtı Gönder"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">İESÜ İstihdam İletişimi</span>
                    <button 
                      onClick={() => { setView?.('jobs'); setIsOpen(false); }}
                      className="font-black hover:underline flex items-center gap-1 cursor-pointer text-[#0F766E]"
                    >
                      Kariyer İlanları <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              LEAF 4: ÖĞRENCİ PORTALI ÖZEL KANADI (KURUMSAL KIRMIZI SOHBET MASASI)
             ═══════════════════════════════════════════════════════════════════ */}
          {isStudent && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              
              {/* SUB-BRANCH 4A: AKRAN & MEZUN SOHBETLERİ */}
              {activeMode === 'student_peer' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {!selectedCandidateChat ? (
                    // Student Peer & Alumni Chat List
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
                        <span className="font-black text-slate-800 flex items-center gap-1.5">
                          <MessageSquare size={15} className="text-[#990000]" />
                          Akran & Mezun İletişimi
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {studentPeerChats.length} Aktif Görüşme
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {studentPeerChats.map(chat => {
                          const lastMsg = chat.messages?.[chat.messages.length - 1];
                          const isAlumniContact = chat.candidateRole === 'alumni';
                          return (
                            <div 
                              key={chat.id}
                              onClick={() => setSelectedCandidateChat(chat)}
                              className="p-3.5 bg-white hover:bg-rose-50/30 border border-slate-200 hover:border-red-200 rounded-2xl transition cursor-pointer shadow-2xs space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {chat.candidateAvatar ? (
                                    <img 
                                      src={chat.candidateAvatar} 
                                      alt={chat.candidateName || 'Profil'} 
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 bg-gradient-to-br from-[#990000] to-rose-900">
                                      <MessageSquare size={18} />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="font-black text-xs text-slate-900 truncate leading-tight group-hover:text-[#990000]">
                                      {chat.candidateName || 'İESÜ Üyesi'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5">
                                      {chat.candidateDept || (isAlumniContact ? 'Mezun Mentörü' : 'Öğrenci Akran')}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                                  isAlumniContact
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-rose-50 text-[#990000] border-rose-200'
                                }`}>
                                  {isAlumniContact ? '🌟 Mezun Mentörü' : '💬 Akran Dayanışması'}
                                </span>
                              </div>

                              {lastMsg && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed font-medium">
                                  <span className="font-bold text-slate-800">{lastMsg.sender === 'candidate' ? `${chat.candidateName}: ` : 'Siz: '}</span>
                                  {lastMsg.text}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1"><Clock size={11} /> {chat.lastActive}</span>
                                <span className="font-black flex items-center gap-0.5 text-[#990000]">
                                  Sohbeti Aç <ChevronRight size={12} />
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {studentPeerChats.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                            <MessageSquare size={32} className="mx-auto text-rose-300" />
                            <h4 className="text-xs font-black text-slate-800">Akran veya Mezun Sohbetiniz Bulunmuyor</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Mezunlarımızın veya diğer öğrenci arkadaşlarımızın profillerini ziyaret ederek doğrudan soru sorabilir ve sohbet başlatabilirsiniz.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Conversation View: Student talking to Peer / Alumni
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button 
                            type="button"
                            onClick={() => setSelectedCandidateChat(null)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
                            title="Listeye Dön"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          {selectedCandidateChat.candidateAvatar ? (
                            <img 
                              src={selectedCandidateChat.candidateAvatar} 
                              alt={selectedCandidateChat.candidateName || 'Profil'} 
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 bg-[#990000]">
                              <MessageSquare size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate leading-tight">
                              {selectedCandidateChat.candidateName || 'Görüşme'}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold truncate">
                              {selectedCandidateChat.candidateDept || 'İESÜ Üyesi'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-[#990000] border border-rose-200 shrink-0">
                          {selectedCandidateChat.candidateRole === 'alumni' ? '🌟 Mezun Mentörü' : '💬 Akran'}
                        </span>
                      </div>

                      {/* Messages Flow */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                        {(selectedCandidateChat.messages || []).map(msg => {
                          const isSelfMsg = msg.sender !== 'candidate' && msg.sender !== selectedCandidateChat.candidateId;
                          const senderDisplay = isSelfMsg ? 'Siz' : (msg.senderName || selectedCandidateChat.candidateName || 'Muhatap');
                          return (
                            <div key={msg.id} className={`flex flex-col ${isSelfMsg ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-slate-600 font-bold px-1 mb-0.5">
                                {senderDisplay}
                              </span>
                              <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                                isSelfMsg
                                  ? 'bg-gradient-to-r from-[#990000] to-rose-900 text-white rounded-tr-none'
                                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-600 font-bold mt-0.5 px-1">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Chips for Student Peer Communication */}
                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        <button 
                          onClick={() => handleQuickChipStudent('👋 Merhaba, ders/proje veya staj süreci hakkında bilgi alabilir miyim?')}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          👋 Bilgi alabilir miyim?
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('📚 Not ve kaynak paylaşımı yapabiliriz.')}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          📚 Kaynak paylaşımı
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('🤝 Deneyimlerinizi ve tavsiyelerinizi dinlemeyi çok isterim.')}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          🤝 Tavsiyelerinizi dinlemek isterim
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('☕ Kampüste uygun bir zamanda görüşebilir miyiz?')}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          ☕ Kampüste buluşalım
                        </button>
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleStudentSendCompanyReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                        <input 
                          type="text" 
                          value={studentCompanyReplyText}
                          onChange={(e) => setStudentCompanyReplyText(e.target.value)}
                          placeholder={`${selectedCandidateChat.candidateName || 'Kişiye'} mesajınızı yazın...`} 
                          className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]" 
                        />
                        <button 
                          type="submit"
                          disabled={!studentCompanyReplyText.trim()}
                          className="w-9 h-9 bg-[#990000] hover:bg-rose-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                          title="Yanıtı Gönder"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">İESÜ Öğrenci Akran & Kariyer Dayanışması</span>
                    <button 
                      onClick={() => { setView?.('feed'); setIsOpen(false); }}
                      className="font-black hover:underline flex items-center gap-1 cursor-pointer text-[#990000]"
                    >
                      Öğrenci Akışına Dön <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-BRANCH 4B: FİRMA MESAJLARI & MÜLAKAT DAVETLERİ */}
              {activeMode === 'student_company' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  {!selectedCandidateChat ? (
                    // Company Messages List for Student
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
                        <span className="font-black text-slate-800 flex items-center gap-1.5">
                          <Building2 size={15} className="text-[#990000]" />
                          İşveren & Staj İletişim Kutusu
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {studentCompanyChats.length} Aktif Görüşme
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {studentCompanyChats.map(chat => {
                          const lastMsg = chat.messages?.[chat.messages.length - 1];
                          return (
                            <div 
                              key={chat.id}
                              onClick={() => setSelectedCandidateChat(chat)}
                              className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition cursor-pointer shadow-2xs space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {chat.candidateAvatar ? (
                                    <img 
                                      src={chat.candidateAvatar} 
                                      alt={chat.candidateName || chat.companyName || 'Profil'} 
                                      className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" 
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shrink-0 bg-gradient-to-br from-[#990000] to-rose-900">
                                      <Building2 size={18} />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="font-black text-xs text-slate-900 truncate leading-tight group-hover:text-blue-900">
                                      {chat.candidateName || chat.companyName || 'İletişim'}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5">
                                      {chat.candidateDept || chat.candidateRole || 'İESÜ Üyesi'}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                                  chat.status === 'Mülakat' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                                  chat.status === 'Teklif Aşaması' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  'bg-blue-50 text-blue-800 border-blue-200'
                                }`}>
                                  {chat.status}
                                </span>
                              </div>

                              {lastMsg && (
                                <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed font-medium">
                                  <span className="font-bold text-slate-800">{lastMsg.sender === 'company' ? 'Firma: ' : 'Siz: '}</span>
                                  {lastMsg.text}
                                </p>
                              )}

                              <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                                <span className="flex items-center gap-1"><Clock size={11} /> {chat.lastActive}</span>
                                <span className="font-black flex items-center gap-0.5 text-[#990000]">
                                  Mesajı Yanıtla <ChevronRight size={12} />
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {studentCompanyChats.length === 0 && (
                          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                            <Building2 size={32} className="mx-auto text-slate-300" />
                            <h4 className="text-xs font-black text-slate-800">Gelen Firma Mesajı Yok</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              İlanlara başvurduğunuzda firmaların mülakat davetleri ve mesajları burada listelenir.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Conversation View: Student talking to Company
                    <div className="flex-1 flex flex-col overflow-hidden bg-white">
                      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button 
                            type="button"
                            onClick={() => setSelectedCandidateChat(null)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer shrink-0"
                            title="Listeye Dön"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          {selectedCandidateChat.candidateAvatar ? (
                            <img 
                              src={selectedCandidateChat.candidateAvatar} 
                              alt={selectedCandidateChat.candidateName || selectedCandidateChat.companyName || 'Profil'} 
                              className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 bg-[#990000]">
                              <Building2 size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-black text-xs text-slate-900 truncate leading-tight">
                              {selectedCandidateChat.candidateName || selectedCandidateChat.companyName || 'Görüşme'}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-bold truncate">
                              {selectedCandidateChat.candidateDept || selectedCandidateChat.candidateRole || 'İESÜ Üyesi'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 shrink-0">
                          {selectedCandidateChat.status || 'Aktif Sohbet'}
                        </span>
                      </div>

                      {/* Messages Flow */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-50/40">
                        {(selectedCandidateChat.messages || []).map(msg => {
                          const isStudentMsg = msg.sender === 'candidate' || msg.sender === currentUser?.id;
                          const senderDisplay = isStudentMsg ? 'Siz' : (msg.senderName || selectedCandidateChat.candidateName || selectedCandidateChat.companyName || 'Muhatap');
                          return (
                            <div key={msg.id} className={`flex flex-col ${isStudentMsg ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-slate-600 font-bold px-1 mb-0.5">
                                {senderDisplay}
                              </span>
                              <div className={`max-w-[84%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                                isStudentMsg
                                  ? 'bg-gradient-to-r from-[#990000] to-rose-900 text-white rounded-tr-none'
                                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-600 font-bold mt-0.5 px-1">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Chips for Student Responses */}
                      <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        <button 
                          onClick={() => handleQuickChipStudent('Merhaba, ilginiz için teşekkürler! Belirtilen mülakat tarihi ve saati benim için uygundur.')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          ✓ Mülakat saatine uygunum
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('Merhaba, güncel portfolyom ve projelerim profilimde yer almaktadır.')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          📎 Portfolyom profilimde
                        </button>
                        <button 
                          onClick={() => handleQuickChipStudent('Davetiniz için çok teşekkür ederim, görüşmeyi heyecanla bekliyorum.')}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer shadow-2xs"
                        >
                          🙏 Teşekkürler
                        </button>
                      </div>

                      {/* Reply Form */}
                      <form onSubmit={handleStudentSendCompanyReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                        <input 
                          type="text" 
                          value={studentCompanyReplyText}
                          onChange={(e) => setStudentCompanyReplyText(e.target.value)}
                          placeholder={`${selectedCandidateChat.candidateName || selectedCandidateChat.companyName || 'Kişiye'} mesajınızı yazın...`} 
                          className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-900" 
                        />
                        <button 
                          type="submit"
                          disabled={!studentCompanyReplyText.trim()}
                          className="w-9 h-9 bg-[#990000] hover:bg-rose-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                          title="Yanıtı Gönder"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">İESÜ Kariyer & İstihdam Hattı</span>
                    <button 
                      onClick={() => { setView?.('jobs'); setIsOpen(false); }}
                      className="font-black hover:underline flex items-center gap-1 cursor-pointer text-[#990000]"
                    >
                      İlanları İncele <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* SUB-BRANCH 4C: AKADEMİK DANIŞMANLIK & RANDEVULARIM */}
              {activeMode === 'student_counseling' && (
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                  {!activeReq ? (
                    // Student's Academic Requests List
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs shrink-0">
                        <span className="font-black text-slate-800 flex items-center gap-1.5">
                          <GraduationCap size={15} className="text-[#4C1D95]" />
                          Danışmanlık Taleplerim & Randevular
                        </span>
                        <span className="text-[10px] text-slate-600 font-bold">
                          {displayStudentRequests.length} Talep
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
                        {displayStudentRequests.map(req => (
                          <div 
                            key={req.id}
                            onClick={() => setActiveReq(req)}
                            className="p-3.5 bg-white hover:bg-purple-50/40 border border-slate-200 rounded-2xl transition cursor-pointer shadow-2xs space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold shrink-0">
                                  <GraduationCap size={18} />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-black text-xs text-slate-900 truncate leading-tight group-hover:text-[#4C1D95]">
                                    {req.advisor || req.mentorName || 'Prof. Dr. Akademik Danışman'}
                                  </h4>
                                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{req.topic || req.subject}</p>
                                </div>
                              </div>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                                req.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {req.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 text-slate-600">
                              <span className="flex items-center gap-1 font-bold truncate">
                                <Calendar size={11} className="text-[#4C1D95]" /> {req.preferredDate}
                              </span>
                              <span className="flex items-center gap-1 font-bold truncate">
                                <Clock size={11} className="text-[#4C1D95]" /> {req.preferredTimeSlot}
                              </span>
                            </div>

                            {req.replies && req.replies.length > 0 && (
                              <div className="bg-emerald-50 text-emerald-900 p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border border-emerald-100">
                                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                                <span className="truncate">Hocanız yanıtladı: "{req.replies[req.replies.length - 1].text}"</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-slate-600 font-bold pt-1 border-t border-slate-100">
                              <span className="truncate">{req.platform || req.mode}</span>
                              <span className="font-bold text-[#4C1D95] flex items-center gap-0.5">
                                Detay & Yanıt <ChevronRight size={12} />
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Informational Guidance Tip */}
                        <div className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-2xl border border-purple-100 text-xs space-y-1.5">
                          <h5 className="font-black text-purple-950 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-purple-700" /> Yeni Danışmanlık Talebi Nasıl Gönderilir?
                          </h5>
                          <p className="text-[11px] text-purple-900/80 leading-relaxed">
                            Akademisyenlerinizin profiline gidip <span className="font-bold">"Danışmanlık & Randevu Talebi İlet"</span> butonuna tıklayarak ofis veya online görüşme randevusu talep edebilirsiniz.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Detail & Reply View for Student's Counseling Request
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                        {/* Advisor Info */}
                        <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-[#4C1D95] text-white flex items-center justify-center font-bold">
                              <GraduationCap size={20} />
                            </div>
                            <div>
                              <h4 className="font-black text-xs text-purple-950">
                                {activeReq.advisor || activeReq.mentorName || 'Danışman Öğretim Üyesi'}
                              </h4>
                              <p className="text-[10px] text-purple-700 font-bold">{activeReq.topic || activeReq.subject}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                            activeReq.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {activeReq.status}
                          </span>
                        </div>

                        {/* Appointment Meeting Info */}
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-[9px] text-slate-600 font-bold uppercase block">Tarih</span>
                              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                <Calendar size={12} className="text-[#4C1D95]" /> {activeReq.preferredDate}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] text-slate-600 font-bold uppercase block">Saat</span>
                              <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                <Clock size={12} className="text-[#4C1D95]" /> {activeReq.preferredTimeSlot}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200">
                            <span className="text-[9px] text-slate-600 font-bold uppercase block">Yerleşke / Kanal</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                              <MapPin size={12} className="text-[#4C1D95]" /> {activeReq.platform || activeReq.mode}
                            </span>
                          </div>

                          {activeReq.note && (
                            <div className="pt-2 border-t border-slate-200">
                              <span className="text-[9px] text-slate-600 font-bold uppercase block">Gönderdiğiniz Talep Notu</span>
                              <p className="text-[11px] text-slate-600 mt-0.5 italic">"{activeReq.note}"</p>
                            </div>
                          )}
                        </div>

                        {/* Replies Thread */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-black uppercase text-slate-600 font-bold tracking-wider">Danışman Görüşme Akışı</span>
                          
                          {(!activeReq.replies || activeReq.replies.length === 0) ? (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                              Danışman hocanız henüz geri bildirim notu eklemedi. Talep onaylandığında ve not iletildiğinde anında burada görebilirsiniz.
                            </div>
                          ) : (
                            activeReq.replies.map((rep, idx) => {
                              const isHoca = rep.sender === 'academic';
                              return (
                                <div 
                                  key={idx} 
                                  className={`p-3 rounded-2xl text-xs space-y-1 border ${
                                    isHoca 
                                      ? 'bg-purple-50/80 border-purple-200 text-purple-950' 
                                      : 'bg-white border-slate-200 text-slate-800'
                                  }`}
                                >
                                  <div className="flex justify-between text-[9px] font-bold">
                                    <span className={isHoca ? 'text-purple-800' : 'text-slate-600'}>
                                      {isHoca ? '✓ Danışman Hocanın Notu' : 'Sizin Notunuz'}
                                    </span>
                                    <span className="text-slate-600 font-bold">{rep.date}</span>
                                  </div>
                                  <p className="leading-relaxed">{rep.text}</p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Student Reply to Academic */}
                      <form onSubmit={handleStudentSendCounselingReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                        <input 
                          type="text" 
                          value={studentCounselingReplyText}
                          onChange={(e) => setStudentCounselingReplyText(e.target.value)}
                          placeholder="Danışman hocanıza ek not veya soru iletin..." 
                          className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-400" 
                        />
                        <button 
                          type="submit"
                          disabled={!studentCounselingReplyText.trim()}
                          className="w-9 h-9 bg-[#4C1D95] hover:bg-purple-950 text-white rounded-xl flex items-center justify-center transition shrink-0 disabled:opacity-40 cursor-pointer shadow-md"
                          title="İlet"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Footer Bar */}
                  <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
                    <span className="font-bold">İESÜ Öğrenci Danışmanlık Takibi</span>
                    <button 
                      onClick={() => { setView?.('feed'); setIsOpen(false); }}
                      className="font-black text-[#4C1D95] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Ana Akışa Dön <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          FLOATING BUTTON (ROLE-TAILORED TREE LEAF LAUNCHER)
         ═══════════════════════════════════════════════════════════════════ */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative group cursor-pointer border-2 border-white/40 ${getLauncherGradient()}`}
          title={
            isAdmin ? "Kariyer Geliştirme İletişim Merkezi" :
            isCompany ? "Aday Mesajları & İşe Alım" :
            isAcademic ? "Resmî Danışmanlık & Randevu Talepleri" :
            isStudent ? "Mesajlarım & Görüşmelerim (Firma & Danışman)" :
            isAlumni ? "Mezun İletişim & Ağ Merkezi" :
            "Mesajlar"
          }
        >
          {isAdmin ? (
            <Crown size={30} className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] group-hover:rotate-12 transition-transform duration-300" />
          ) : isCompany ? (
            <Briefcase size={26} className="group-hover:-rotate-12 transition-transform duration-300" />
          ) : isAcademic ? (
            <GraduationCap size={28} className="group-hover:-rotate-12 transition-transform duration-300" />
          ) : isAlumni ? (
            <Award size={26} className="group-hover:-rotate-12 transition-transform duration-300" />
          ) : (
            <MessageCircle size={28} className="group-hover:-rotate-12 transition-transform duration-300" />
          )}

          {totalBadge > 0 && (
            <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 bg-red-600 text-white rounded-full border-2 border-white flex items-center justify-center text-[11px] font-black shadow-md animate-bounce">
              {totalBadge}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
