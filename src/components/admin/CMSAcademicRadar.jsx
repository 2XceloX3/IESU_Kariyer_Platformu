import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  GraduationCap,
  FileText,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
  Plus,
  Eye,
  RefreshCw,
  FileCheck,
  FileWarning,
  FileClock,
  MessageSquare,
  ChevronRight,
  Send,
  Check,
  X,
  UserCheck,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Info,
  Calendar,
  CheckSquare,
  User,
  Building2,
  Award,
  Layers,
  ChevronDown,
  Download
} from 'lucide-react';

// --- INITIAL DEMO DATA ---
const defaultApprovals = [
  {
    id: 'RAD-2026-001',
    studentName: 'Ahmet Yılmaz',
    studentId: '20210401012',
    dept: 'Bilgisayar Mühendisliği Bölümü',
    company: 'ASELSAN A.Ş.',
    type: 'Zorunlu',
    startDate: '2026-06-15',
    endDate: '2026-08-15',
    status: 'Bekleyen',
    advisor: 'Prof. Dr. Mehmet Kaya',
    appliedDate: '2026-07-28',
    gpa: '3.42',
    note: 'Zorunlu staj başvuru formu ve onaylı SGK beyannamesi ektedir.'
  },
  {
    id: 'RAD-2026-002',
    studentName: 'Zeynep Kaya',
    studentId: '20210202044',
    dept: 'İşletme',
    company: 'Garanti BBVA Genel Müd.',
    type: 'Gönüllü',
    startDate: '2026-07-01',
    endDate: '2026-08-30',
    status: 'Bekleyen',
    advisor: 'Doç. Dr. Ayşe Demir',
    appliedDate: '2026-07-29',
    gpa: '3.18',
    note: 'İnsan Kaynakları departmanında yaz dönemi gönüllü stajı.'
  },
  {
    id: 'RAD-2026-003',
    studentName: 'Caner Erkin',
    studentId: '20200305088',
    dept: 'Endüstri Mühendisliği Bölümü',
    company: 'Trendyol Tech HQ',
    type: 'Zorunlu',
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    status: 'Bekleyen',
    advisor: 'Dr. Öğr. Üyesi Ali Serper',
    appliedDate: '2026-07-30',
    gpa: '3.65',
    note: 'Tedarik zinciri analizi ve envanter optimizasyonu stajı.'
  },
  {
    id: 'RAD-2026-004',
    studentName: 'Elif Şahin',
    studentId: '20220101033',
    dept: 'Elektrik ve Elektronik Mühendisliği (İngilizce) Bölümü',
    company: 'Siemens Türkiye Ar-Ge',
    type: 'Zorunlu',
    startDate: '2026-07-10',
    endDate: '2026-09-10',
    status: 'Bekleyen',
    advisor: 'Prof. Dr. Selim Öz',
    appliedDate: '2026-07-31',
    gpa: '3.29',
    note: 'Gömülü sistemler ve otomasyon stajı onay talebi.'
  },
  {
    id: 'RAD-2026-005',
    studentName: 'Burak Özkan',
    studentId: '20210504019',
    dept: 'Yazılım Geliştirme Bölümü',
    company: 'HAVELSAN Siber Güvenlik',
    type: 'Zorunlu',
    startDate: '2026-06-20',
    endDate: '2026-08-20',
    status: 'Bekleyen',
    advisor: 'Doç. Dr. Seda Bulut',
    appliedDate: '2026-08-01',
    gpa: '3.80',
    note: 'Ağ güvenliği ve sızma testleri ekibinde zorunlu staj.'
  },
  {
    id: 'RAD-2026-006',
    studentName: 'Ece Tekin',
    studentId: '20210303015',
    dept: 'Mimarlık Bölümü',
    company: 'Tabanlıoğlu Mimarlık',
    type: 'Zorunlu',
    startDate: '2026-05-15',
    endDate: '2026-07-15',
    status: 'Onaylanan',
    advisor: 'Prof. Dr. Kenan Doğan',
    appliedDate: '2026-05-10',
    gpa: '3.50',
    note: 'Şantiye ve proje stajı eksiksiz onaylanmıştır.'
  },
  {
    id: 'RAD-2026-007',
    studentName: 'Deniz Arslan',
    studentId: '20220401099',
    dept: 'Bilgisayar Programcılığı',
    company: 'Bilinmeyen Yazılım A.Ş.',
    type: 'Gönüllü',
    startDate: '2026-06-01',
    endDate: '2026-07-01',
    status: 'Reddedildi',
    advisor: 'Prof. Dr. Mehmet Kaya',
    appliedDate: '2026-05-20',
    gpa: '2.10',
    note: 'Firma faaliyet alanı akademik kriterlere uygun bulunmadı.'
  }
];

const defaultMentorshipRequests = [
  {
    id: 'DNT-2026-101',
    studentName: 'Selin Yıldız',
    studentId: '20210401055',
    dept: 'Bilgisayar Mühendisliği Bölümü',
    advisor: 'Prof. Dr. Mehmet Kaya',
    subject: 'Bitirme Projesi & Staj Denkleştirme',
    requestDate: '2026-08-01',
    status: 'Beklemede',
    urgency: 'Yüksek',
    details: 'Yaz stajım kapsamında geliştirdiğim yapay zeka modelini bitirme tezi konusu olarak kullanmak istiyorum. Ön inceleme ve görüşme talep ediyorum.'
  },
  {
    id: 'DNT-2026-102',
    studentName: 'Mert Aksoy',
    studentId: '20220202011',
    dept: 'İşletme',
    advisor: 'Doç. Dr. Ayşe Demir',
    subject: 'Yurtdışı Yüksek Lisans Referans Mektubu',
    requestDate: '2026-07-30',
    status: 'İnceleniyor',
    urgency: 'Orta',
    details: 'Münih Teknik Üniversitesi yüksek lisans başvurum için niyet mektubu kontrolü ve akademik referans mektubu desteği rica ediyorum.'
  },
  {
    id: 'DNT-2026-103',
    studentName: 'Gamze Çelik',
    studentId: '20200305012',
    dept: 'Endüstri Mühendisliği Bölümü',
    advisor: 'Dr. Öğr. Üyesi Ali Serper',
    subject: 'Kariyer Yönlendirme ve Çift Anadal (ÇAP)',
    requestDate: '2026-07-28',
    status: 'Tamamlandı',
    urgency: 'Normal',
    details: 'Bilgisayar mühendisliği ÇAP ders eşdeğerlikleri ve mezuniyet sonrası veri bilimi alanında uzmanlaşma rehberliği.'
  },
  {
    id: 'DNT-2026-104',
    studentName: 'Oğuzhan Tekin',
    studentId: '20210101099',
    dept: 'Elektrik ve Elektronik Mühendisliği (İngilizce) Bölümü',
    advisor: 'Prof. Dr. Selim Öz',
    subject: 'SGK Evrak Süreci & Geciken Onay',
    requestDate: '2026-08-02',
    status: 'Beklemede',
    urgency: 'Acil',
    details: 'Staj başlama tarihime 5 gün kaldı fakat SGK işe giriş belgem sistemde henüz onaylanmadı. Geçici muafiyet belgesi talep ediyorum.'
  },
  {
    id: 'DNT-2026-105',
    studentName: 'Melis Vural',
    studentId: '20220504077',
    dept: 'Yazılım Geliştirme Bölümü',
    advisor: 'Doç. Dr. Seda Bulut',
    subject: 'TÜBİTAK 2209-A Proje Danışmanlığı',
    requestDate: '2026-07-25',
    status: 'İnceleniyor',
    urgency: 'Yüksek',
    details: 'Öğrenci projeleri destekleme programına başvuracağız. Akademik danışman olarak projemize liderlik etmenizi rica ediyoruz.'
  }
];

const facultyStatsData = [
  {
    id: 'iybf',
    facultyName: 'İşletme ve Yönetim Bilimleri Fakültesi',
    code: 'İYBF',
    type: 'Fakülte',
    activeCount: 112,
    completedCount: 35,
    pendingCount: 12,
    successRate: '%96.4',
    jobPlacementRate: '%84.2',
    avgDuration: '30 Gün',
    color: 'from-amber-600 to-orange-700',
    departments: [
      { name: 'Ekonomi ve Finans (İngilizce)', active: 22, completed: 8, pending: 2 },
      { name: 'Elektronik Ticaret ve Yönetimi', active: 18, completed: 6, pending: 2 },
      { name: 'Havacılık Yönetimi', active: 24, completed: 9, pending: 3 },
      { name: 'İşletme', active: 42, completed: 14, pending: 5 },
      { name: 'İşletme (İngilizce)', active: 20, completed: 7, pending: 2 },
      { name: 'Siyaset Bilimi ve Uluslararası İlişkiler', active: 18, completed: 5, pending: 2 },
      { name: 'Siyaset Bilimi ve Uluslararası İlişkiler (İngilizce)', active: 14, completed: 4, pending: 1 },
      { name: 'Lojistik Yönetimi', active: 26, completed: 9, pending: 3 },
      { name: 'Uluslararası Ticaret ve Finansman', active: 28, completed: 10, pending: 4 },
      { name: 'Yönetim Bilişim Sistemleri', active: 38, completed: 12, pending: 4 }
    ]
  },
  {
    id: 'mmf',
    facultyName: 'Mühendislik ve Mimarlık Fakültesi',
    code: 'MMF',
    type: 'Fakülte',
    activeCount: 147,
    completedCount: 42,
    pendingCount: 17,
    successRate: '%98.1',
    jobPlacementRate: '%91.5',
    avgDuration: '40 Gün',
    color: 'from-[#990000] to-rose-800',
    departments: [
      { name: 'Bilgisayar Mühendisliği Bölümü', active: 45, completed: 18, pending: 5, placement: '%94', rate: '%98' },
      { name: 'Elektrik ve Elektronik Mühendisliği (İngilizce) Bölümü', active: 28, completed: 10, pending: 4, placement: '%91', rate: '%97' },
      { name: 'Endüstri Mühendisliği Bölümü', active: 24, completed: 8, pending: 3, placement: '%88', rate: '%96' },
      { name: 'Endüstriyel Tasarım Bölümü', active: 16, completed: 5, pending: 2, placement: '%85', rate: '%95' },
      { name: 'Mimarlık Bölümü', active: 22, completed: 7, pending: 3, placement: '%86', rate: '%96' },
      { name: 'İç Mimarlık Bölümü', active: 20, completed: 6, pending: 2, placement: '%87', rate: '%95' },
      { name: 'İç Mimarlık ve Çevre Tasarımı Bölümü', active: 18, completed: 5, pending: 2, placement: '%84', rate: '%94' },
      { name: 'İnşaat Mühendisliği Bölümü', active: 26, completed: 9, pending: 3, placement: '%89', rate: '%96' },
      { name: 'Makine Mühendisliği Bölümü', active: 24, completed: 8, pending: 3, placement: '%90', rate: '%97' },
      { name: 'Yazılım Mühendisliği Bölümü', active: 40, completed: 15, pending: 5, placement: '%96', rate: '%99' }
    ]
  },
  {
    id: 'sbf',
    facultyName: 'Sağlık Bilimleri Fakültesi',
    code: 'SBF',
    type: 'Fakülte',
    activeCount: 130,
    completedCount: 50,
    pendingCount: 14,
    successRate: '%99.2',
    jobPlacementRate: '%89.0',
    avgDuration: '45 Gün',
    color: 'from-emerald-600 to-teal-700',
    departments: [
      { name: 'Beslenme ve Diyetetik Bölümü', active: 28, completed: 11, pending: 3 },
      { name: 'Çocuk Gelişimi Bölümü', active: 22, completed: 8, pending: 2 },
      { name: 'Fizyoterapi ve Rehabilitasyon Bölümü', active: 34, completed: 14, pending: 4 },
      { name: 'Hemşirelik Bölümü', active: 58, completed: 22, pending: 6 },
      { name: 'Sosyal Hizmet Bölümü', active: 18, completed: 6, pending: 2 }
    ]
  },
  {
    id: 'ssbf',
    facultyName: 'Sanat ve Sosyal Bilimler Fakültesi',
    code: 'SSBF',
    type: 'Fakülte',
    activeCount: 98,
    completedCount: 30,
    pendingCount: 10,
    successRate: '%94.8',
    jobPlacementRate: '%78.4',
    avgDuration: '30 Gün',
    color: 'from-indigo-600 to-purple-700',
    departments: [
      { name: 'Gastronomi ve Mutfak Sanatları Bölümü', active: 30, completed: 10, pending: 3 },
      { name: 'Halkla İlişkiler ve Reklamcılık Bölümü', active: 22, completed: 7, pending: 2 },
      { name: 'İngiliz Dili ve Edebiyatı (İngilizce) Bölümü', active: 18, completed: 5, pending: 2 },
      { name: 'Psikoloji Bölümü', active: 44, completed: 14, pending: 4 },
      { name: 'Psikoloji (İngilizce) Bölümü', active: 20, completed: 6, pending: 2 },
      { name: 'Radyo, Televizyon ve Sinema Bölümü', active: 16, completed: 5, pending: 2 },
      { name: 'Sosyoloji Bölümü', active: 14, completed: 4, pending: 1 },
      { name: 'Yeni Medya ve İletişim Bölümü', active: 20, completed: 6, pending: 2 }
    ]
  },
  {
    id: 'spo',
    facultyName: 'Spor Bilimleri Fakültesi',
    code: 'SPO',
    type: 'Fakülte',
    activeCount: 48,
    completedCount: 15,
    pendingCount: 6,
    successRate: '%95.0',
    jobPlacementRate: '%82.0',
    avgDuration: '30 Gün',
    color: 'from-cyan-600 to-blue-700',
    departments: [
      { name: 'Antrenörlük Eğitimi Bölümü', active: 28, completed: 9, pending: 4 },
      { name: 'Spor Yöneticiliği Bölümü', active: 20, completed: 6, pending: 2 }
    ]
  },
  {
    id: 'ubf',
    facultyName: 'Uygulamalı Bilimler Fakültesi',
    code: 'UBF',
    type: 'Fakülte',
    activeCount: 62,
    completedCount: 20,
    pendingCount: 7,
    successRate: '%97.5',
    jobPlacementRate: '%88.6',
    avgDuration: '40 Gün',
    color: 'from-rose-700 to-pink-800',
    departments: [
      { name: 'Bilişim Sistemleri ve Teknolojileri Bölümü', active: 28, completed: 9, pending: 3 },
      { name: 'Veri Bilimi ve Analitiği Bölümü', active: 24, completed: 8, pending: 3 },
      { name: 'Yazılım Geliştirme Bölümü', active: 32, completed: 11, pending: 4 }
    ]
  },
  {
    id: 'btmyo',
    facultyName: 'Bilişim Teknolojileri Meslek Yüksekokulu',
    code: 'BTMYO',
    type: 'Meslek Yüksekokulu',
    activeCount: 110,
    completedCount: 45,
    pendingCount: 15,
    successRate: '%98.5',
    jobPlacementRate: '%93.0',
    avgDuration: '30 Gün',
    color: 'from-[#990000] to-slate-900',
    departments: [
      { name: 'Bilgisayar Destekli Tasarım ve Animasyon', active: 22, completed: 8, pending: 3 },
      { name: 'Bilişim Güvenliği Teknolojisi', active: 30, completed: 12, pending: 4 },
      { name: 'Bilgisayar Programcılığı', active: 48, completed: 20, pending: 6 },
      { name: 'Bilgisayar Teknolojisi', active: 24, completed: 9, pending: 3 },
      { name: 'İnsansız Hava Aracı Teknolojisi ve Operatörlüğü', active: 18, completed: 6, pending: 2 },
      { name: 'İnternet ve Ağ Teknolojileri', active: 20, completed: 7, pending: 2 },
      { name: 'Oyun Geliştirme ve Programlama', active: 32, completed: 11, pending: 4 },
      { name: 'Robotik ve Yapay Zeka', active: 26, completed: 9, pending: 3 }
    ]
  },
  {
    id: 'myo',
    facultyName: 'Meslek Yüksekokulu',
    code: 'MYO',
    type: 'Meslek Yüksekokulu',
    activeCount: 124,
    completedCount: 52,
    pendingCount: 18,
    successRate: '%96.0',
    jobPlacementRate: '%85.5',
    avgDuration: '30 Gün',
    color: 'from-slate-700 to-[#990000]',
    departments: [
      { name: 'Aşçılık', active: 28, completed: 10, pending: 3 },
      { name: 'Dış Ticaret', active: 38, completed: 16, pending: 5 },
      { name: 'Grafik Tasarımı', active: 30, completed: 12, pending: 4 },
      { name: 'Lojistik', active: 32, completed: 14, pending: 5 },
      { name: 'Sivil Havacılık Kabin Hizmetleri', active: 30, completed: 11, pending: 4 }
    ]
  },
  {
    id: 'shmyo',
    facultyName: 'Sağlık Hizmetleri Meslek Yüksekokulu',
    code: 'SHMYO',
    type: 'Meslek Yüksekokulu',
    activeCount: 165,
    completedCount: 82,
    pendingCount: 19,
    successRate: '%99.0',
    jobPlacementRate: '%90.2',
    avgDuration: '45 Gün',
    color: 'from-teal-700 to-[#990000]',
    departments: [
      { name: 'Ağız ve Diş Sağlığı Programı', active: 32, completed: 14, pending: 4 },
      { name: 'Ameliyathane Hizmetleri Programı', active: 38, completed: 18, pending: 4 },
      { name: 'Anestezi Programı', active: 35, completed: 16, pending: 4 },
      { name: 'İlk ve Acil Yardım Programı', active: 52, completed: 28, pending: 6 },
      { name: 'Tıbbi Görüntüleme Teknikleri Programı', active: 40, completed: 20, pending: 5 }
    ]
  }
];

const defaultDocumentTracking = [
  {
    id: 'DOC-101',
    studentName: 'Ahmet Yılmaz',
    dept: 'Bilgisayar Mühendisliği Bölümü',
    sgk: 'Yüklendi',
    attendance: 'İnceleniyor',
    notebook: 'Eksik',
    evaluation: 'Eksik',
    lastUpdate: '01.08.2026'
  },
  {
    id: 'DOC-102',
    studentName: 'Zeynep Kaya',
    dept: 'İşletme',
    sgk: 'Yüklendi',
    attendance: 'Yüklendi',
    notebook: 'İnceleniyor',
    evaluation: 'Eksik',
    lastUpdate: '30.07.2026'
  },
  {
    id: 'DOC-103',
    studentName: 'Caner Erkin',
    dept: 'Endüstri Mühendisliği Bölümü',
    sgk: 'Yüklendi',
    attendance: 'Yüklendi',
    notebook: 'Yüklendi',
    evaluation: 'Yüklendi',
    lastUpdate: '28.07.2026'
  },
  {
    id: 'DOC-104',
    studentName: 'Elif Şahin',
    dept: 'Elektrik ve Elektronik Mühendisliği (İngilizce) Bölümü',
    sgk: 'İnceleniyor',
    attendance: 'Eksik',
    notebook: 'Eksik',
    evaluation: 'Eksik',
    lastUpdate: '02.08.2026'
  },
  {
    id: 'DOC-105',
    studentName: 'Burak Özkan',
    dept: 'Yazılım Geliştirme Bölümü',
    sgk: 'Yüklendi',
    attendance: 'Yüklendi',
    notebook: 'Yüklendi',
    evaluation: 'İnceleniyor',
    lastUpdate: '01.08.2026'
  },
  {
    id: 'DOC-106',
    studentName: 'Ece Tekin',
    dept: 'Mimarlık Bölümü',
    sgk: 'Yüklendi',
    attendance: 'Yüklendi',
    notebook: 'Yüklendi',
    evaluation: 'Yüklendi',
    lastUpdate: '25.07.2026'
  }
];

export default function CMSAcademicRadar() {
  const [approvals, setApprovals] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_academic_radar_v1');
      return saved ? JSON.parse(saved) : defaultApprovals;
    } catch {
      return defaultApprovals;
    }
  });

  const [mentorshipRequests, setMentorshipRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_mentorship_requests_v1');
      return saved ? JSON.parse(saved) : defaultMentorshipRequests;
    } catch {
      return defaultMentorshipRequests;
    }
  });

  const [documentTracking, setDocumentTracking] = useState(() => {
    try {
      const saved = localStorage.getItem('iesu_document_tracking_v1');
      return saved ? JSON.parse(saved) : defaultDocumentTracking;
    } catch {
      return defaultDocumentTracking;
    }
  });

  const [approvalTab, setApprovalTab] = useState('Bekleyen'); // Bekleyen | Onaylanan | Reddedilen
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('Tümü');
  const [selectedApprovalModal, setSelectedApprovalModal] = useState(null);
  const [selectedMentorshipModal, setSelectedMentorshipModal] = useState(null);
  const [selectedFacultyModal, setSelectedFacultyModal] = useState(null);
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('iesu_academic_radar_v1', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify(mentorshipRequests));
  }, [mentorshipRequests]);

  useEffect(() => {
    localStorage.setItem('iesu_document_tracking_v1', JSON.stringify(documentTracking));
  }, [documentTracking]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type });
    if (window.toast) {
      if (type === 'error') window.toast.error(msg);
      else window.toast.success(msg);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateApprovalStatus = (id, newStatus, actionNote = '') => {
    setApprovals(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              actionDate: new Date().toLocaleDateString('tr-TR'),
              adminNote: actionNote || item.adminNote
            }
          : item
      )
    );
    setSelectedApprovalModal(null);
    showToast(
      `Staj talebi (${id}) ${newStatus === 'Onaylanan' ? 'onaylandı.' : 'reddedildi.'}`,
      newStatus === 'Onaylanan' ? 'success' : 'error'
    );
  };

  const handleUpdateMentorshipStatus = (id, newStatus) => {
    setMentorshipRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
    );
    setSelectedMentorshipModal(null);
    showToast(`Danışmanlık talebi (${id}) durumu '${newStatus}' olarak güncellendi.`);
  };

  const handleToggleDocStatus = (docId, docField) => {
    const nextStatusMap = {
      Eksik: 'İnceleniyor',
      İnceleniyor: 'Yüklendi',
      Yüklendi: 'Eksik'
    };

    setDocumentTracking(prev =>
      prev.map(item => {
        if (item.id === docId) {
          const currentStatus = item[docField];
          const newStatus = nextStatusMap[currentStatus] || 'Yüklendi';
          return {
            ...item,
            [docField]: newStatus,
            lastUpdate: new Date().toLocaleDateString('tr-TR')
          };
        }
        return item;
      })
    );
    showToast('Belge durumu güncellendi.');
  };

  const [expandedDeptClasses, setExpandedDeptClasses] = useState({});

  const handleExportFacultyExcel = (faculty) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += `FAKÜLTE / YÜKSEKOKUL: ${faculty.facultyName} (${faculty.code})\n`;
    csvContent += `Tür;Başarı Oranı;İstihdam Oranı;Ortalama Süre;Aktif Staj;Tamamlanan;Bekleyen\n`;
    csvContent += `${faculty.type};${faculty.successRate || '%96'};${faculty.jobPlacementRate || '%85'};${faculty.avgDuration || '30 Gün'};${faculty.activeCount};${faculty.completedCount};${faculty.pendingCount}\n\n`;
    
    csvContent += `Bölüm / Program Adı;1. Sınıf;2. Sınıf;3. Sınıf;4. Sınıf;Aktif Staj;Tamamlanan;Bekleyen;İstihdam Yüzdesi\n`;

    faculty.departments.forEach(dept => {
      const maxGrade = faculty.type === 'Meslek Yüksekokulu' ? 2 : 4;
      const g1 = Math.round(dept.active * 0.15);
      const g2 = Math.round(dept.active * 0.35);
      const g3 = maxGrade >= 3 ? Math.round(dept.active * 0.30) : '-';
      const g4 = maxGrade >= 4 ? (dept.active - (g1 + g2 + (typeof g3 === 'number' ? g3 : 0))) : '-';

      csvContent += `"${dept.name}";${g1};${g2};${g3};${g4};${dept.active};${dept.completed};${dept.pending};${dept.placement || '%88'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${faculty.code}_Akademik_Staj_Raporu.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`"${faculty.facultyName}" detaylı Excel raporu indirildi.`);
  };

  const handleExportAllFacultiesExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += `İSTANBUL ESENYURT ÜNİVERSİTESİ - TÜM AKADEMİK BİRİMLER STAJ & AKADEMİK RADAR RAPORU\n`;
    csvContent += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n`;
    csvContent += `Fakülte Kodu;Fakülte/MYO Adı;Tür;Başarı Oranı;İstihdam Oranı;Ortalama Süre;Aktif Staj;Tamamlanan;Bekleyen;Toplam Program Sayısı\n`;

    facultyStatsData.forEach(fac => {
      csvContent += `${fac.code};"${fac.facultyName}";${fac.type};${fac.successRate || '%96'};${fac.jobPlacementRate || '%85'};${fac.avgDuration || '30 Gün'};${fac.activeCount};${fac.completedCount};${fac.pendingCount};${fac.departments.length}\n`;
    });

    csvContent += `\n\nDETAYLI BÖLÜM VE SINIF DAĞILIMI:\n`;
    csvContent += `Fakülte Kodu;Bölüm/Program Adı;1. Sınıf;2. Sınıf;3. Sınıf;4. Sınıf;Aktif Staj;Tamamlanan;Bekleyen\n`;

    facultyStatsData.forEach(fac => {
      const maxGrade = fac.type === 'Meslek Yüksekokulu' ? 2 : 4;
      fac.departments.forEach(dept => {
        const g1 = Math.round(dept.active * 0.15);
        const g2 = Math.round(dept.active * 0.35);
        const g3 = maxGrade >= 3 ? Math.round(dept.active * 0.30) : '-';
        const g4 = maxGrade >= 4 ? (dept.active - (g1 + g2 + (typeof g3 === 'number' ? g3 : 0))) : '-';

        csvContent += `${fac.code};"${dept.name}";${g1};${g2};${g3};${g4};${dept.active};${dept.completed};${dept.pending}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IESU_Tum_Fakulteler_Akademik_Radar_Raporu.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Tüm akademik birimler toplu Excel raporu başarıyla indirildi.");
  };

  const filteredApprovals = approvals.filter(item => {
    const matchesTab = item.status === approvalTab;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentId.includes(searchTerm);
    const matchesDept = selectedDeptFilter === 'Tümü' || item.dept === selectedDeptFilter;
    return matchesTab && matchesSearch && matchesDept;
  });

  const pendingCount = approvals.filter(a => a.status === 'Bekleyen').length;
  const approvedCount = approvals.filter(a => a.status === 'Onaylanan').length;
  const rejectedCount = approvals.filter(a => a.status === 'Reddedildi').length;

  const filteredDocTracking = documentTracking.filter(item => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'Tümü' || item.dept === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const totalDocs = documentTracking.length * 4;
  let uploadedDocsCount = 0;
  documentTracking.forEach(doc => {
    if (doc.sgk === 'Yüklendi') uploadedDocsCount++;
    if (doc.attendance === 'Yüklendi') uploadedDocsCount++;
    if (doc.notebook === 'Yüklendi') uploadedDocsCount++;
    if (doc.evaluation === 'Yüklendi') uploadedDocsCount++;
  });
  const docCompletionRate = Math.round((uploadedDocsCount / totalDocs) * 100);

  return (
    <div className="space-y-8 font-sans pb-12">
      
      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 transition-all animate-bounce ${
            toastMessage.type === 'error' ? 'bg-rose-700' : 'bg-emerald-600'
          }`}
        >
          {toastMessage.type === 'error' ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
          <span className="text-xs">{toastMessage.msg}</span>
        </div>
      )}

      {/* Vibrant Hero Banner */}
      <div className="bg-gradient-to-r from-[#990000] via-red-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-red-800/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow-sm">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white">
                <ShieldCheck size={26} />
              </div>
              Akademik Radar & Onay Merkezi
            </h2>
            <p className="text-red-100 text-xs md:text-sm font-medium mt-2 max-w-2xl leading-relaxed">
              İstanbul Esenyurt Üniversitesi fakülte ve meslek yüksekokullarına ait zorunlu/gönüllü staj onayları, akademisyen danışmanlık talepleri ve SGK evrak takibini canlı yönetin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm min-w-[130px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 block">Bekleyen Onay</span>
              <span className="text-xl font-black text-amber-300 mt-0.5 block">{pendingCount} Başvuru</span>
            </div>
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm min-w-[130px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 block">Danışmanlık Talebi</span>
              <span className="text-xl font-black text-white mt-0.5 block">{mentorshipRequests.length} Randevu</span>
            </div>
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm min-w-[130px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-100 block">Evrak Tamamlanma</span>
              <span className="text-xl font-black text-emerald-300 mt-0.5 block">%{docCompletionRate} Tamam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-96 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 shadow-inner focus-within:ring-2 focus-within:ring-[#990000]/20 focus-within:border-[#990000] transition">
          <Search size={16} className="text-slate-400 mr-2.5" />
          <input
            type="text"
            placeholder="Öğrenci adı, no, firma veya bölüm ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border border-slate-200 rounded-2xl w-full sm:w-auto">
            <Filter size={15} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600 shrink-0">Akademik Birim:</span>
            <select
              value={selectedDeptFilter}
              onChange={e => setSelectedDeptFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              <option value="Tümü">Tüm Fakülte & Birimler (9 Birim)</option>
              <optgroup label="Fakülteler">
                <option value="Bilgisayar Mühendisliği Bölümü">Bilgisayar Mühendisliği (MMF)</option>
                <option value="Yazılım Mühendisliği Bölümü">Yazılım Mühendisliği (MMF)</option>
                <option value="Elektrik ve Elektronik Mühendisliği (İngilizce) Bölümü">Elektrik-Elektronik Müh. (MMF)</option>
                <option value="Endüstri Mühendisliği Bölümü">Endüstri Mühendisliği (MMF)</option>
                <option value="Mimarlık Bölümü">Mimarlık (MMF)</option>
                <option value="İşletme">İşletme (İYBF)</option>
                <option value="Hemşirelik Bölümü">Hemşirelik (SBF)</option>
                <option value="Psikoloji Bölümü">Psikoloji (SSBF)</option>
              </optgroup>
              <optgroup label="Meslek Yüksekokulları">
                <option value="Bilgisayar Programcılığı">Bilgisayar Programcılığı (BTMYO)</option>
                <option value="Yazılım Geliştirme Bölümü">Yazılım Geliştirme (UBF)</option>
                <option value="Dış Ticaret">Dış Ticaret (MYO)</option>
                <option value="İlk ve Acil Yardım Programı">İlk ve Acil Yardım (SHMYO)</option>
              </optgroup>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDeptFilter('Tümü');
            }}
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition shrink-0 cursor-pointer"
            title="Filtreleri Temizle"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* SECTION 1: STAJ ONAY KUYRUKLARI */}
      <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#990000]"></span>
              <h3 className="text-base font-black text-slate-900">1. Staj Onay Kuyrukları</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">Öğrencilerin Fakülte/MYO Staj Komisyonuna sunduğu belgelerin değerlendirme ekranı.</p>
          </div>

          {/* Status Segmented Controls */}
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 self-start sm:self-auto">
            <button
              onClick={() => setApprovalTab('Bekleyen')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                approvalTab === 'Bekleyen' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={14} /> Bekleyen ({pendingCount})
            </button>

            <button
              onClick={() => setApprovalTab('Onaylanan')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                approvalTab === 'Onaylanan' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 size={14} /> Onaylanan ({approvedCount})
            </button>

            <button
              onClick={() => setApprovalTab('Reddedildi')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                approvalTab === 'Reddedildi' ? 'bg-rose-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <XCircle size={14} /> Reddedilen ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#990000] to-red-900 text-white uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="p-4">Başvuru ID</th>
                <th className="p-4">Öğrenci Ad Soyad / No</th>
                <th className="p-4">Fakülte / Bölüm</th>
                <th className="p-4">Staj Firması</th>
                <th className="p-4">Tür</th>
                <th className="p-4">Staj Tarihleri</th>
                <th className="p-4">Danışman Akademisyen</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredApprovals.map(item => (
                <tr key={item.id} className="hover:bg-red-50/30 transition group">
                  <td className="p-4 font-mono font-black text-[#990000] text-xs">{item.id}</td>
                  <td className="p-4">
                    <div className="font-black text-slate-900 group-hover:text-[#990000] transition text-xs">{item.studentName}</div>
                    <div className="text-[10px] font-mono text-slate-400 font-semibold">{item.studentId}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-700">{item.dept}</td>
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 w-fit">
                      <Building2 size={13} className="text-[#990000] shrink-0" />
                      <span>{item.company}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      item.type === 'Zorunlu' ? 'bg-red-50 text-[#990000] border border-red-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px] font-semibold text-slate-600">
                    {item.startDate} <span className="text-slate-300">→</span> {item.endDate}
                  </td>
                  <td className="p-4 text-slate-700 font-bold">{item.advisor}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedApprovalModal(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={13} /> İncele
                      </button>

                      {item.status === 'Bekleyen' && (
                        <>
                          <button
                            onClick={() => handleUpdateApprovalStatus(item.id, 'Onaylanan')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Check size={13} /> Onayla
                          </button>
                          <button
                            onClick={() => handleUpdateApprovalStatus(item.id, 'Reddedildi')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-[11px] transition border border-rose-200 flex items-center gap-1 cursor-pointer"
                          >
                            <X size={13} /> Reddet
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApprovals.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                    Bu kategoride gösterilecek staj başvurusu bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: FAKÜLTE & PROGRAM AKADEMİK RADARİ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#990000]"></span> 2. Fakülte & Program Akademik Radarı (9 Akademik Birim)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Üniversitemize bağlı 6 fakülte ve 3 meslek yüksekokulunun canlı staj yük dağılımı.</p>
          </div>

          <button
            onClick={handleExportAllFacultiesExcel}
            className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
          >
            <Download size={15} /> Tüm Birimleri Toplu Excele Aktar (.CSV)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facultyStatsData.map(fac => {
            const totalStaj = fac.activeCount + fac.completedCount + fac.pendingCount;
            const completedPercent = Math.round((fac.completedCount / totalStaj) * 100);

            return (
              <div
                key={fac.id}
                onClick={() => setSelectedFacultyModal(fac)}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${fac.color} absolute top-0 left-0`} />
                
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#990000] uppercase bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                        {fac.code} • {fac.type}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-2.5 group-hover:text-[#990000] transition line-clamp-1">
                        {fac.facultyName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">{fac.departments.length} Kayıtlı Program / Bölüm</p>
                    </div>
                    <div className="p-2.5 bg-slate-50 group-hover:bg-[#990000] text-slate-400 group-hover:text-white rounded-2xl transition shrink-0">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* High Level Stats Row */}
                  <div className="flex items-center justify-between text-[11px] font-bold bg-slate-50 px-3 py-2 rounded-xl mb-3 border border-slate-100">
                    <span className="text-slate-500">Staj Tamamlama Oranı</span>
                    <span className="text-[#990000] font-black">{completedPercent}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(fac.activeCount / totalStaj) * 100}%` }} className="bg-blue-600 h-full" title="Aktif Staj" />
                      <div style={{ width: `${(fac.completedCount / totalStaj) * 100}%` }} className="bg-emerald-500 h-full" title="Tamamlandı" />
                      <div style={{ width: `${(fac.pendingCount / totalStaj) * 100}%` }} className="bg-amber-400 h-full" title="Bekleyen" />
                    </div>
                  </div>

                  {/* Main Metrics 3-Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-red-50/60 p-3 rounded-2xl text-center border border-red-100/60">
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 block uppercase">Aktif</span>
                      <span className="text-sm font-black text-blue-600">{fac.activeCount}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 block uppercase">Biten</span>
                      <span className="text-sm font-black text-emerald-600">{fac.completedCount}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 block uppercase">Bekleyen</span>
                      <span className="text-sm font-black text-amber-600">{fac.pendingCount}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Statistical Analytics Footer */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px] text-center font-bold text-slate-600">
                  <div className="bg-emerald-50 text-emerald-900 p-1.5 rounded-xl border border-emerald-100">
                    <span className="block text-[8px] uppercase text-emerald-600">Başarı</span>
                    <span>{fac.successRate || '%97.0'}</span>
                  </div>
                  <div className="bg-blue-50 text-blue-900 p-1.5 rounded-xl border border-blue-100">
                    <span className="block text-[8px] uppercase text-blue-600">İstihdam</span>
                    <span>{fac.jobPlacementRate || '%85.0'}</span>
                  </div>
                  <div className="bg-purple-50 text-purple-900 p-1.5 rounded-xl border border-purple-100">
                    <span className="block text-[8px] uppercase text-purple-600">Ort. Süre</span>
                    <span>{fac.avgDuration || '30 Gün'}</span>
                  </div>
                </div>

                {/* Quick Action Footer: Single Click Excel & Grade Details Indicator */}
                <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-dashed border-slate-200">
                  <span className="text-[10px] text-[#990000] font-black group-hover:underline flex items-center gap-1">
                    <Layers size={13} /> Sınıf Dağılımları (1-{fac.type === 'Meslek Yüksekokulu' ? '2' : '4'}. Sınıf)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportFacultyExcel(fac);
                    }}
                    title={`${fac.code} Excel Raporu İndir`}
                    className="p-1.5 bg-red-50 hover:bg-[#990000] text-[#990000] hover:text-white rounded-xl transition border border-red-100 flex items-center gap-1 text-[10px] font-black cursor-pointer"
                  >
                    <Download size={13} /> Excel
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 & 4 GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 3: AKADEMİSYEN DANIŞMANLIK TALEPLERİ */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span> 3. Akademisyen Danışmanlık Talepleri
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Tez, ÇAP ve staj denkleştirme görüşme istekleri.</p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-black text-xs">
              {mentorshipRequests.length} Talep
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {mentorshipRequests.map(req => (
              <div
                key={req.id}
                onClick={() => setSelectedMentorshipModal(req)}
                className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition cursor-pointer group flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{req.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      req.urgency === 'Acil' ? 'bg-rose-100 text-rose-800' :
                      req.urgency === 'Yüksek' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {req.urgency} Öncelik
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-xs group-hover:text-indigo-900 transition">{req.subject}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{req.studentName} ({req.studentId}) • {req.dept}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                    req.status === 'Beklemede' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    req.status === 'İnceleniyor' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {req.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">{req.requestDate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: EVRAK & SGK RADARİ */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span> 4. Evrak & SGK Takip Radarı
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">SGK İşe Giriş, Defter ve Anket Durumları.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                %{docCompletionRate} Genel Uyum
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[9px] font-black">
                <tr>
                  <th className="p-2.5">Öğrenci</th>
                  <th className="p-2.5">SGK</th>
                  <th className="p-2.5">Puantaj</th>
                  <th className="p-2.5">Defter</th>
                  <th className="p-2.5">Anket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredDocTracking.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition cursor-pointer group">
                    <td onClick={() => setSelectedDocModal(doc)} className="p-2.5 font-bold text-slate-900 max-w-[140px] truncate group-hover:text-[#990000]">
                      <div className="flex items-center gap-1">
                        <span>{doc.studentName}</span>
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition text-[#990000]" />
                      </div>
                      <span className="block text-[9px] font-normal text-slate-400 truncate">{doc.dept}</span>
                    </td>
                    
                    {['sgk', 'attendance', 'notebook', 'evaluation'].map(field => {
                      const status = doc[field];
                      return (
                        <td key={field} className="p-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleDocStatus(doc.id, field);
                            }}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition cursor-pointer ${
                              status === 'Yüklendi' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                              status === 'İnceleniyor' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                              'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {status}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* MODAL 1: STAJ ONAY DETAY POPUP */}
      {selectedApprovalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-[#990000] to-red-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Staj Başvuru Dosyası</h3>
                  <p className="text-[11px] text-red-100 font-medium">{selectedApprovalModal.studentName} ({selectedApprovalModal.id})</p>
                </div>
              </div>
              <button onClick={() => setSelectedApprovalModal(null)} className="p-2 text-red-200 hover:text-white hover:bg-white/10 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-600 uppercase text-[10px]">Öğrenci Numarası</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedApprovalModal.studentId}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-600 uppercase text-[10px]">Fakülte / Bölüm</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedApprovalModal.dept}</p>
                </div>
              </div>

              <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 space-y-1">
                <span className="font-black text-[#990000] uppercase text-[10px] tracking-wider block">Staj Yapılacak Firma:</span>
                <p className="font-black text-slate-900 text-sm">{selectedApprovalModal.company}</p>
                <p className="text-slate-600 font-semibold">{selectedApprovalModal.type} Staj • {selectedApprovalModal.startDate} / {selectedApprovalModal.endDate}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-600 uppercase text-[10px] block mb-1">Öğrenci Açıklama Notu:</span>
                <p className="text-slate-700 font-medium leading-relaxed">{selectedApprovalModal.note}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-600 uppercase text-[10px]">Atanmış Akademik Danışman:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedApprovalModal.advisor}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button onClick={() => setSelectedApprovalModal(null)} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 transition">
                Kapat
              </button>

              {selectedApprovalModal.status === 'Bekleyen' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateApprovalStatus(selectedApprovalModal.id, 'Reddedildi')}
                    className="px-4 py-2.5 bg-rose-100 text-rose-700 rounded-xl text-xs font-black hover:bg-rose-200 transition"
                  >
                    Reddet
                  </button>
                  <button
                    onClick={() => handleUpdateApprovalStatus(selectedApprovalModal.id, 'Onaylanan')}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition shadow-md"
                  >
                    Stajı Onayla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DANIŞMANLIK TALEP DETAY POPUP */}
      {selectedMentorshipModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-indigo-700 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Danışman Görüşme Talebi</h3>
                  <p className="text-[11px] text-indigo-200 font-medium">{selectedMentorshipModal.studentName} ({selectedMentorshipModal.id})</p>
                </div>
              </div>
              <button onClick={() => setSelectedMentorshipModal(null)} className="p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-1">
                <span className="font-black text-indigo-900 uppercase text-[10px] tracking-wider block">Görüşme Konusu:</span>
                <p className="font-black text-slate-900 text-sm">{selectedMentorshipModal.subject}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-600 uppercase text-[10px] block">Talep Detayları:</span>
                <p className="text-slate-800 font-medium leading-relaxed">{selectedMentorshipModal.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-600 uppercase text-[10px]">Öğrenci & Bölüm</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedMentorshipModal.studentName} • {selectedMentorshipModal.dept}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-600 uppercase text-[10px]">Danışman Akademisyen</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedMentorshipModal.advisor}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button onClick={() => setSelectedMentorshipModal(null)} className="px-5 py-2.5 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-300 transition">
                Kapat
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateMentorshipStatus(selectedMentorshipModal.id, 'İnceleniyor')}
                  className="px-4 py-2.5 bg-blue-100 text-blue-800 rounded-xl text-xs font-black hover:bg-blue-200 transition"
                >
                  İncelemeye Al
                </button>
                <button
                  onClick={() => handleUpdateMentorshipStatus(selectedMentorshipModal.id, 'Tamamlandı')}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition shadow-md"
                >
                  Görüşmeyi Tamamla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FAKÜLTE PROGRAM DETAY POPUP */}
      {selectedFacultyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className={`bg-gradient-to-r ${selectedFacultyModal.color} text-white p-5 flex items-center justify-between shrink-0`}>
              <div>
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded">
                  {selectedFacultyModal.code} • {selectedFacultyModal.type}
                </span>
                <h3 className="font-black text-lg text-white mt-1">{selectedFacultyModal.facultyName}</h3>
              </div>
              <button onClick={() => setSelectedFacultyModal(null)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Analytics Header Summary */}
              <div className="grid grid-cols-3 gap-3 bg-red-50/70 p-4 rounded-2xl text-center border border-red-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Fakülte Başarı Oranı</span>
                  <span className="text-base font-black text-emerald-600">{selectedFacultyModal.successRate || '%97.2'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Staj İle İstihdam</span>
                  <span className="text-base font-black text-blue-600">{selectedFacultyModal.jobPlacementRate || '%88.5'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Ortalama Staj Süresi</span>
                  <span className="text-base font-black text-purple-700">{selectedFacultyModal.avgDuration || '35 Gün'}</span>
                </div>
              </div>

              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <BarChart3 size={15} className="text-[#990000]" /> Bağlı Bölüm & Programların Canlı Analiz Dağılımı:
              </h4>

              <div className="space-y-3">
                {selectedFacultyModal.departments.map((dept, idx) => {
                  const deptTotal = dept.active + dept.completed + dept.pending;
                  const isMYO = selectedFacultyModal.type === 'Meslek Yüksekokulu';
                  const isExpanded = expandedDeptClasses[idx];

                  // Grade breakdown calculations
                  const g1 = Math.round(dept.active * 0.15);
                  const g2 = Math.round(dept.active * 0.35);
                  const g3 = isMYO ? 0 : Math.round(dept.active * 0.30);
                  const g4 = isMYO ? 0 : (dept.active - (g1 + g2 + g3));

                  return (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 hover:border-slate-300 transition">
                      <div
                        onClick={() => setExpandedDeptClasses(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="flex items-center justify-between gap-4 cursor-pointer group/dept"
                      >
                        <span className="font-black text-slate-900 text-xs group-hover/dept:text-[#990000] transition flex items-center gap-1.5">
                          <span>{dept.name}</span>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-[#990000]' : ''}`} />
                        </span>
                        <span className="font-mono font-bold text-[11px] text-slate-500">{deptTotal} Kayıtlı Öğrenci</span>
                      </div>

                      {/* Mini Bar */}
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div style={{ width: `${(dept.active / deptTotal) * 100}%` }} className="bg-blue-600 h-full" title="Aktif" />
                        <div style={{ width: `${(dept.completed / deptTotal) * 100}%` }} className="bg-emerald-500 h-full" title="Tamamlandı" />
                        <div style={{ width: `${(dept.pending / deptTotal) * 100}%` }} className="bg-amber-400 h-full" title="Bekleyen" />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-bold pt-1">
                        <div className="flex gap-2">
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{dept.active} Aktif Staj</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{dept.completed} Tamamlandı</span>
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{dept.pending} Bekleyen</span>
                        </div>
                        {dept.placement && (
                          <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-black">
                            {dept.placement} İstihdam
                          </span>
                        )}
                      </div>

                      {/* Grade Breakdown (Lisans 4 Sınıf, MYO 2 Sınıf) */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-in fade-in duration-200">
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <span className="text-[9px] font-bold text-slate-600 uppercase block">1. Sınıf Stajyer</span>
                            <span className="text-xs font-black text-slate-800">{g1} Öğrenci</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <span className="text-[9px] font-bold text-slate-600 uppercase block">2. Sınıf Stajyer</span>
                            <span className="text-xs font-black text-slate-800">{g2} Öğrenci</span>
                          </div>

                          {!isMYO && (
                            <>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                                <span className="text-[9px] font-bold text-slate-600 uppercase block">3. Sınıf Stajyer</span>
                                <span className="text-xs font-black text-slate-800">{g3} Öğrenci</span>
                              </div>

                              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                                <span className="text-[9px] font-bold text-slate-600 uppercase block">4. Sınıf Stajyer</span>
                                <span className="text-xs font-black text-slate-800">{g4} Öğrenci</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleExportFacultyExcel(selectedFacultyModal)}
                className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Download size={14} /> Bu Fakülteyi Excele Aktar (.CSV)
              </button>

              <button onClick={() => setSelectedFacultyModal(null)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ÖĞRENCİ YÜKLENEN EVRAK VE SGK KONTROL POPUP */}
      {selectedDocModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FileCheck size={22} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Staj Evrak & SGK Kontrol Paneli</h3>
                  <p className="text-[11px] text-emerald-200 font-medium">{selectedDocModal.studentName} ({selectedDocModal.id})</p>
                </div>
              </div>
              <button onClick={() => setSelectedDocModal(null)} className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs font-sans">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Öğrenci & Bölüm</span>
                  <p className="font-black text-slate-900 text-sm mt-0.5">{selectedDocModal.studentName}</p>
                  <p className="text-slate-500 font-semibold">{selectedDocModal.dept}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Son Güncelleme</span>
                  <span className="font-mono font-bold text-slate-700">{selectedDocModal.lastUpdate}</span>
                </div>
              </div>

              {/* Uploaded Documents List with Preview & Status Action Controls */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Layers size={14} className="text-emerald-600" /> Yüklenen Evraklar ve Komisyon İncelemesi:
                </h4>

                {[
                  { key: 'sgk', label: 'SGK İşe Giriş Bildirgesi', filename: `${selectedDocModal.studentName.replace(/\s+/g, '_')}_SGK_Bildirgesi.pdf`, size: '245 KB' },
                  { key: 'attendance', label: 'Staj Devam & Puantaj Çizelgesi', filename: `${selectedDocModal.studentName.replace(/\s+/g, '_')}_Puantaj.pdf`, size: '180 KB' },
                  { key: 'notebook', label: 'Staj Defteri ve Günlük Raporlar', filename: `${selectedDocModal.studentName.replace(/\s+/g, '_')}_Staj_Defteri.pdf`, size: '1.4 MB' },
                  { key: 'evaluation', label: 'Kurum İletişim & İşveren Anketi', filename: `${selectedDocModal.studentName.replace(/\s+/g, '_')}_Isveren_Anketi.pdf`, size: '120 KB' }
                ].map(docItem => {
                  const currentStatus = selectedDocModal[docItem.key];
                  return (
                    <div key={docItem.key} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[#990000] shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-xs">{docItem.label}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">{docItem.filename} ({docItem.size})</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            showToast(`"${docItem.filename}" belgesi indiriliyor...`, 'info');
                          }}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={13} /> Belgeyi Aç
                        </button>

                        <button
                          onClick={() => handleToggleDocStatus(selectedDocModal.id, docItem.key)}
                          className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition cursor-pointer shadow-sm ${
                            currentStatus === 'Yüklendi' ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                            currentStatus === 'İnceleniyor' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                            'bg-rose-600 text-white hover:bg-rose-700'
                          }`}
                        >
                          {currentStatus}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">Durum butonuna tıklayarak onay durumunu değiştirebilirsiniz.</span>
              <button onClick={() => setSelectedDocModal(null)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition">
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
