import React, { useState, useMemo } from 'react';
import {
  GraduationCap, Award, Briefcase, Calendar, CheckCircle2,
  Download, ExternalLink, FileText, Share2, Sparkles, Star, Users,
  Building2, ShieldCheck, Check, Clock, QrCode, BookOpen, AlertCircle,
  Copy, Printer, ChevronRight, BarChart3, Layers, Compass, Plus,
  Search, Filter, CheckCircle, Info, FileCheck, Bookmark, Home, User
} from 'lucide-react';
import Logo from './Logo';
import SafeAvatar from './shared/SafeAvatar';
import TopProfileMenu from './TopProfileMenu';
import useAppStore from '../store/useAppStore';
import { toast } from './shared/Toast';

export default function StudentKGBPanel({ setView, currentUser, userRole, previousView }) {
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const kgbStudentRecords = useAppStore(state => state.kgbStudentRecords) || [];
  const addNotification = useAppStore(state => state.addNotification);
  const logAction = useAppStore(state => state.logAction);

  const isAdmin = userRole === 'admin' || currentUser?.role === 'admin' || currentUser?.id === 'admin_1513';

  // Fallback student profiles with tailored department data
  const DEFAULT_STUDENT_PROFILES = useMemo(() => ({
    'STU-01': {
      id: 'STU-01',
      name: 'Ahmet Yılmaz',
      department: 'Bilgisayar Mühendisliği',
      faculty: 'Mühendislik ve Mimarlık Fakültesi',
      grade: '3. Sınıf',
      studentNo: '2023010482',
      targetSector: 'Yazılım & Bilişim Mimarisi',
      accreditationScore: 88,
      internshipsCount: 2,
      certificationsCount: 3,
      workshopsCount: 7,
      mentorMeetingsCount: 4,
      cvCompleteness: 88,
      portfolioItems: 5,
      verificationCode: 'İESÜ-KGB-2026-9941',
      advisorName: 'Doç. Dr. Selin Kaya',
      internships: [
        {
          id: 'INT-01',
          company: 'Baykar Teknoloji',
          position: 'Yapay Zekâ & Gömülü Yazılım Stajyeri',
          duration: '20 İş Günü (Zorunlu Staj)',
          date: 'Temmuz 2025 - Ağustos 2025',
          mentor: 'Mehmet Yılmaz (Kıdemli Ar-Ge Mühendisi)',
          status: 'Onaylandı',
          ects: '5 AKTS',
          score: '100 / 100 (Pekiyi)',
          skills: ['C++', 'ROS2', 'Gömülü Linux', 'Python'],
          summary: 'İHA telemetri ve yapay zeka nesne tespit algoritmaları optimizasyonunda aktif görev alındı.'
        },
        {
          id: 'INT-02',
          company: 'Aselsan A.Ş.',
          position: 'Yazılım Geliştirme Stajyeri',
          duration: '30 İş Günü (İsteğe Bağlı Ar-Ge Stajı)',
          date: 'Şubat 2026 - Mart 2026',
          mentor: 'Dr. Selin Kaya (Yazılım Proje Yöneticisi)',
          status: 'Onaylandı',
          ects: '6 AKTS',
          score: '95 / 100 (Pekiyi)',
          skills: ['React', 'TypeScript', 'Mikroservis', 'Docker'],
          summary: 'Savunma sanayii gerçek zamanlı izleme kokpiti web arayüz bileşenleri geliştirildi.'
        }
      ],
      certifications: [
        {
          id: 'CRT-01',
          title: 'İleri Seviye Full-Stack Web ve Bulut Mimarisi',
          issuer: 'İESÜ Kariyer & Yetenek Akademisi',
          issueDate: '12 Ocak 2026',
          validUntil: 'Süresiz',
          code: 'IESU-CRT-2026-9941',
          hours: '48 Saat',
          accreditedBy: 'YÖK & Pearson BTEC Uyumlu',
          skills: ['React', 'Node.js', 'PostgreSQL', 'Cloud Deployment']
        },
        {
          id: 'CRT-02',
          title: 'AWS Certified Cloud Practitioner Hazırlık Sertifikası',
          issuer: 'Amazon Web Services (AWS) Academy',
          issueDate: '04 Mart 2026',
          validUntil: 'Mart 2029',
          code: 'AWS-ACA-88412',
          hours: '36 Saat',
          accreditedBy: 'Global Sanayi Standartları',
          skills: ['AWS EC2', 'S3', 'IAM', 'Cloud Architecture']
        },
        {
          id: 'CRT-03',
          title: 'Çevik Proje Yönetimi ve Scrum Master Eğitimi',
          issuer: 'İESÜ Sürekli Eğitim Merkezi & PMI Uyumlu',
          issueDate: '18 Kasım 2025',
          validUntil: 'Süresiz',
          code: 'IESU-SCRUM-4412',
          hours: '24 Saat',
          accreditedBy: 'Uluslararası Proje Standartları',
          skills: ['Scrum', 'Kanban', 'Sprint Planning', 'Jira']
        }
      ]
    },
    'STU-02': {
      id: 'STU-02',
      name: 'Zeynep Kaya',
      department: 'İşletme',
      faculty: 'İktisadi, İdari ve Sosyal Bilimler Fakültesi',
      grade: '4. Sınıf',
      studentNo: '2023010485',
      targetSector: 'Kurumsal Finans & Denetim',
      accreditationScore: 92,
      internshipsCount: 1,
      certificationsCount: 2,
      workshopsCount: 12,
      mentorMeetingsCount: 6,
      cvCompleteness: 92,
      portfolioItems: 3,
      verificationCode: 'İESÜ-KGB-2026-9942',
      advisorName: 'Prof. Dr. Murat Doğan',
      internships: [
        {
          id: 'INT-21',
          company: 'Türkiye İş Bankası A.Ş.',
          position: 'Kurumsal Finans & Risk Analitiği Stajyeri',
          duration: '30 İş Günü (Zorunlu Staj)',
          date: 'Haziran 2025 - Temmuz 2025',
          mentor: 'Kemal Akın (Kıdemli Portföy Yöneticisi)',
          status: 'Onaylandı',
          ects: '6 AKTS',
          score: '98 / 100 (Pekiyi)',
          skills: ['Finansal Modelleme', 'Risk Yönetimi', 'Excel VBA', 'Power BI'],
          summary: 'Kredi risk derecelendirmesi ve kurumsal portföy analiz modellerinin oluşturulmasında aktif görev alındı.'
        }
      ],
      certifications: [
        {
          id: 'CRT-21',
          title: 'SPK Düzey 1 Sermaye Piyasası Faaliyetleri Lisansı',
          issuer: 'Sermaye Piyasası Lisanslama Sicil ve Eğitim Kuruluşu',
          issueDate: '15 Kasım 2025',
          validUntil: 'Kasım 2028',
          code: 'SPK-LIS-2025-4102',
          hours: '40 Saat',
          accreditedBy: 'Sermaye Piyasası Kurulu (SPK)',
          skills: ['Sermaye Piyasaları', 'Hisse Senetleri', 'Mevzuat', 'Finansal Tablolar']
        },
        {
          id: 'CRT-22',
          title: 'Bloomberg Market Concepts (BMC) Sertifikası',
          issuer: 'Bloomberg LP Financial Markets',
          issueDate: '08 Şubat 2026',
          validUntil: 'Süresiz',
          code: 'BLM-BMC-99021',
          hours: '24 Saat',
          accreditedBy: 'Bloomberg Institute Global',
          skills: ['Makroekonomi', 'Emtia & Döviz Piyasaları', 'Sabit Getirili Menkul Kıymetler']
        }
      ]
    },
    'STU-03': {
      id: 'STU-03',
      name: 'Caner Demir',
      department: 'Grafik Tasarım',
      faculty: 'Sanat ve Tasarım Fakültesi',
      grade: '2. Sınıf',
      studentNo: '2023010490',
      targetSector: 'Dijital Tasarım & Yaratıcı Endüstriler',
      accreditationScore: 78,
      internshipsCount: 3,
      certificationsCount: 1,
      workshopsCount: 5,
      mentorMeetingsCount: 2,
      cvCompleteness: 78,
      portfolioItems: 8,
      verificationCode: 'İESÜ-KGB-2026-9943',
      advisorName: 'Doç. Dr. Emre Çelik',
      internships: [
        {
          id: 'INT-31',
          company: 'TBWA\\Istanbul',
          position: 'UI/UX & Dijital Tasarım Stajyeri',
          duration: '25 İş Günü (Zorunlu Staj)',
          date: 'Ağustos 2025 - Eylül 2025',
          mentor: 'Ayşe Yıldız (Kreatif Tasarım Direktörü)',
          status: 'Onaylandı',
          ects: '5 AKTS',
          score: '96 / 100 (Pekiyi)',
          skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
          summary: 'Kullanıcı deneyimi araştırmaları ve mobil arayüz prototiplerinin tasarım süreçlerinde çalışıldı.'
        },
        {
          id: 'INT-32',
          company: 'Rafineri Reklam Ajansı',
          position: 'Kreatif Sanat & Konsept Tasarım Stajyeri',
          duration: '20 İş Günü (Gönüllü Staj)',
          date: 'Ocak 2026 - Şubat 2026',
          mentor: 'Kerem Öztürk (Art Direktör)',
          status: 'Onaylandı',
          ects: '4 AKTS',
          score: '92 / 100 (Pekiyi)',
          skills: ['Adobe Photoshop', 'Illustrator', 'Motion Graphics'],
          summary: 'Büyük ölçekli kurumsal marka lansman kampanyaları için görsel kimlik varlıkları üretildi.'
        },
        {
          id: 'INT-33',
          company: 'Tribal Worldwide Istanbul',
          position: 'Görsel İletişim Tasarımı Stajyeri',
          duration: '20 İş Günü (Proje Stajı)',
          date: 'Haziran 2024 - Temmuz 2024',
          mentor: 'Selin Erdem (Kıdemli İllüstratör)',
          status: 'Onaylandı',
          ects: '4 AKTS',
          score: '90 / 100 (Pekiyi)',
          skills: ['Tipografi', 'Vektör Sanatı', 'Sosyal Medya Tasarımı'],
          summary: 'Dijital reklam kampanyaları için dinamik banner ve görsel materyal üretimi gerçekleştirildi.'
        }
      ],
      certifications: [
        {
          id: 'CRT-31',
          title: 'Adobe Certified Professional in Visual Design',
          issuer: 'Adobe Inc. & Certiport',
          issueDate: '20 Aralık 2025',
          validUntil: 'Aralık 2028',
          code: 'ADOBE-ACP-77218',
          hours: '36 Saat',
          accreditedBy: 'Adobe Worldwide Accreditation',
          skills: ['Photoshop', 'Illustrator', 'Typography', 'Visual Composition']
        }
      ]
    }
  }), []);

  const fallbackRecordsList = useMemo(() => Object.values(DEFAULT_STUDENT_PROFILES), [DEFAULT_STUDENT_PROFILES]);
  const activeStudentList = kgbStudentRecords.length > 0 ? kgbStudentRecords : fallbackRecordsList;

  const defaultStudentId = useMemo(() => {
    if (isAdmin) {
      return activeStudentList[0]?.id || 'STU-01';
    }
    const match = activeStudentList.find(r => r.id === currentUser?.id || r.name === currentUser?.name);
    return match?.id || currentUser?.id || 'STU-01';
  }, [isAdmin, currentUser, activeStudentList]);

  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudentId);

  const currentStudentRecord = useMemo(() => {
    if (isAdmin) {
      return activeStudentList.find(r => r.id === selectedStudentId) || activeStudentList[0];
    }
    return activeStudentList.find(r => r.id === currentUser?.id || r.name === currentUser?.name);
  }, [isAdmin, selectedStudentId, currentUser, activeStudentList]);

  // Match student record from store or fallback to currentUser
  const studentData = useMemo(() => {
    if (isAdmin) {
      const rec = currentStudentRecord || DEFAULT_STUDENT_PROFILES['STU-01'];
      const profileData = DEFAULT_STUDENT_PROFILES[rec.id] || DEFAULT_STUDENT_PROFILES['STU-01'];
      const score = rec.cvCompleteness ?? profileData.accreditationScore;

      return {
        id: rec.id,
        name: rec.name || profileData.name,
        department: rec.department || profileData.department,
        faculty: profileData.faculty || 'Mühendislik ve Mimarlık Fakültesi',
        grade: profileData.grade || '3. Sınıf',
        studentNo: profileData.studentNo || '2023010482',
        targetSector: profileData.targetSector || rec.targetSector || 'Kurumsal Finans & Denetim',
        internshipsCount: typeof rec.internships === 'number' ? rec.internships : (rec.internshipsCount ?? (Array.isArray(rec.internships) ? rec.internships.length : profileData.internshipsCount)),
        certificationsCount: typeof rec.certifications === 'number' ? rec.certifications : (rec.certificationsCount ?? (Array.isArray(rec.certifications) ? rec.certifications.length : profileData.certificationsCount)),
        workshopsCount: typeof rec.workshopsAttended === 'number' ? rec.workshopsAttended : (rec.workshopsCount ?? profileData.workshopsCount),
        mentorMeetingsCount: typeof rec.mentorMeetings === 'number' ? rec.mentorMeetings : (rec.mentorMeetingsCount ?? profileData.mentorMeetingsCount),
        cvCompleteness: score,
        portfolioItems: rec.portfolioItems ?? profileData.portfolioItems,
        accreditationScore: score,
        verificationCode: profileData.verificationCode || `İESÜ-KGB-2026-${(rec.id || 'STU-01').replace('STU-', '994')}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(rec.name || profileData.name)}&background=990000&color=fff&size=120`,
        advisorName: profileData.advisorName,
        internships: Array.isArray(profileData.internships) ? profileData.internships : [],
        certifications: Array.isArray(profileData.certifications) ? profileData.certifications : []
      };
    }

    const match = currentStudentRecord;
    const profileData = DEFAULT_STUDENT_PROFILES[currentUser?.id || match?.id] || DEFAULT_STUDENT_PROFILES['STU-01'];
    const score = currentUser?.cvCompleteness || match?.cvCompleteness || profileData.accreditationScore || 88;
    return {
      id: currentUser?.id || match?.id || profileData.id || 'STU-2026-001',
      name: currentUser?.name || match?.name || profileData.name,
      department: currentUser?.department || match?.department || profileData.department,
      faculty: currentUser?.faculty || profileData.faculty,
      grade: currentUser?.grade || (currentUser?.graduationYear ? `${currentUser.graduationYear} Mezun Adayı` : profileData.grade),
      studentNo: currentUser?.studentNo || profileData.studentNo,
      targetSector: profileData.targetSector || match?.targetSector || currentUser?.targetSector || 'Yazılım & Bilişim Mimarisi',
      internshipsCount: typeof match?.internships === 'number' ? match.internships : (typeof currentUser?.internships === 'number' ? currentUser.internships : (match?.internshipsCount ?? profileData.internshipsCount)),
      certificationsCount: typeof match?.certifications === 'number' ? match.certifications : (typeof currentUser?.certifications === 'number' ? currentUser.certifications : (match?.certificationsCount ?? profileData.certificationsCount)),
      workshopsCount: typeof match?.workshopsAttended === 'number' ? match.workshopsAttended : (typeof currentUser?.workshopsAttended === 'number' ? currentUser.workshopsAttended : (match?.workshopsCount ?? profileData.workshopsCount)),
      mentorMeetingsCount: typeof match?.mentorMeetings === 'number' ? match.mentorMeetings : (typeof currentUser?.mentorMeetings === 'number' ? currentUser.mentorMeetings : (match?.mentorMeetingsCount ?? profileData.mentorMeetingsCount)),
      cvCompleteness: score,
      portfolioItems: match?.portfolioItems ?? (currentUser?.portfolioItems ?? profileData.portfolioItems),
      accreditationScore: score,
      verificationCode: currentUser?.verificationCode || profileData.verificationCode || `İESÜ-KGB-2026-${String(currentUser?.id || match?.id || '9941').replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '9941'}`,
      avatar: currentUser?.avatar || profileData.avatar,
      advisorName: currentUser?.advisorName || profileData.advisorName || 'Doç. Dr. Selin Kaya',
      internships: profileData.internships,
      certifications: profileData.certifications
    };
  }, [isAdmin, currentStudentRecord, currentUser, DEFAULT_STUDENT_PROFILES]);

  const [activeTab, setActiveTab] = useState('ozet'); // 'ozet' | 'stajlar' | 'sertifikalar' | 'etkinlikler' | 'transkript'
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequestType, setNewRequestType] = useState('staj');
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestOrg, setNewRequestOrg] = useState('');
  const [newRequestHours, setNewRequestHours] = useState('');

  const internships = studentData.internships || DEFAULT_STUDENT_PROFILES['STU-01'].internships;
  const certifications = studentData.certifications || DEFAULT_STUDENT_PROFILES['STU-01'].certifications;

  const [workshops] = useState([
    { id: 'W1', title: 'Sektör Liderleriyle Yapay Zekâ Zirvesi 2026', category: 'Konferans', hours: 8, date: '15 Şubat 2026', speaker: 'Prof. Dr. Hakan Demir' },
    { id: 'W2', title: 'TÜBİTAK 2209-A Proje Hazırlama & Ar-Ge Metodolojisi', category: 'Araştırma', hours: 6, date: '22 Ocak 2026', speaker: 'Dr. Öğr. Üyesi Caner Kurt' },
    { id: 'W3', title: 'Teknik Mülakat Simülasyonu & Canlı Kodlama Atölyesi', category: 'Kariyer Becerisi', hours: 4, date: '10 Mart 2026', speaker: 'Trendyol Tech İK Ekibi' },
    { id: 'W4', title: 'Siber Güvenlik Farkındalığı & KVKK Veri Güvenliği', category: 'Hukuk & Bilişim', hours: 4, date: '05 Aralık 2025', speaker: 'Av. Mert Şahin' },
    { id: 'W5', title: 'Git & GitHub ile Büyük Ölçekli Ekip İşbirliği', category: 'Teknik Atölye', hours: 4, date: '18 Ekim 2025', speaker: 'Kariyer Kulübü Mentörleri' },
    { id: 'W6', title: 'Fintech Trendleri & Açık Bankacılık API Entegrasyonları', category: 'Sektör Analizi', hours: 4, date: '28 Eylül 2025', speaker: 'Garanti BBVA Teknoloji' },
    { id: 'W7', title: 'Profesyonel Sunum Teknikleri ve Müzakere Becerileri', category: 'Kişisel Gelişim', hours: 4, date: '12 Eylül 2025', speaker: 'Kariyer Danışmanlığı Masası' },
  ]);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(studentData.verificationCode);
    toast.success('Doğrulama Kodu Panoya Kopyalandı: ' + studentData.verificationCode);
  };

  const handleExportPDF = () => {
    setActiveTab('transkript');
    toast.info('YÖK Uyumlu Resmi KGB Belgesi (PDF) Hazırlanıyor...');
    setTimeout(() => {
      window.print();
      if (logAction) {
        logAction(studentData.name, 'Resmi KGB Kariyer Karnesi PDF olarak yazdırıldı/indirildi.', 'KGB');
      }
    }, 400);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!newRequestTitle.trim()) {
      toast.error('Lütfen belge veya faaliyet adını giriniz.');
      return;
    }
    setShowRequestModal(false);
    toast.success('KGB Belge Onay Talebiniz Kariyer Ofisi Koordinatörlüğü\'ne İletildi.');
    if (addNotification) {
      addNotification({
        id: 'NOTIF-' + Date.now(),
        type: 'system',
        title: 'KGB Belge Onay Talebi Alındı',
        message: `"${newRequestTitle}" başlıklı kaydınız incelenmek üzere akademik koordinatörlüğe sevk edildi.`,
        date: new Date().toLocaleDateString('tr-TR'),
        read: false
      });
    }
    setNewRequestTitle('');
    setNewRequestOrg('');
    setNewRequestHours('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-32 selection:bg-red-100">
      
      {/* ── ÜST SABİT GEZİNME ÇUBUĞU ───────────────────────────────── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Sol: Üniversite Logosu ve Kurumsal Başlık (Tıklanınca Ana Akışa Dönüş) */}
          <div 
            onClick={() => setView(previousView || (userRole === 'admin' ? 'admin' : 'student'))}
            className="flex items-center gap-3 cursor-pointer group"
            title={isAdmin ? "Yönetim Paneline Dön" : "Öğrenci Portalına Dön"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView(previousView || (userRole === 'admin' ? 'admin' : 'student')); } }}
          >
            <Logo className="w-8 h-8 text-[#990000] group-hover:scale-105 transition-transform shrink-0" />
            <div>
              <h1 className="text-sm font-black text-gray-900 leading-tight group-hover:text-[#990000] transition-colors">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] text-[#990000] font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} className="animate-pulse" /> Kariyer Gelişim Belgesi & Yetenek Karnesi
              </p>
            </div>
          </div>

          {/* Sağ: Belge İndir, Doğrulama & Menü */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-900 via-[#990000] to-red-700 hover:from-red-800 hover:to-red-600 text-white font-black text-xs transition shadow-sm flex items-center gap-2 cursor-pointer border border-red-400/20"
            >
              <Printer size={14} />
              <span className="hidden md:inline">Resmi KGB Çıktısı (PDF)</span>
              <span className="md:hidden">PDF</span>
            </button>

            <TopProfileMenu
              currentUser={currentUser || { name: studentData.name, role: 'student' }}
              userRole={userRole || 'student'}
              setView={setView}
              setSelectedUserId={setSelectedUserId}
              currentView="student_kgb"
            />
          </div>
        </div>
      </header>

      {/* ── ANA İÇERİK ALANI ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* ── 1. KARNE PASAPORT KARTI (HERO STUDENT PASSPORT) ─────── */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgb(0,0,0,0.03)] overflow-hidden">
          {/* Üst Kırmızı Kimlik Bandı */}
          <div className="bg-gradient-to-r from-[#7A0606] via-[#990000] to-[#8F0808] px-6 sm:px-8 py-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              {/* Sol: Avatar, İsim (BEYAZ) & Bölüm Bilgileri */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-3 border-white/40 bg-white shadow-xl overflow-hidden shrink-0">
                  <SafeAvatar
                    src={studentData.avatar || currentUser?.avatar}
                    name={studentData.name}
                    size="2xl"
                    className="w-full h-full"
                    alt={studentData.name}
                  />
                </div>

                <div>
                  {/* Öğrenci İsmi: Bembeyaz, Kontrastlı ve Okunaklı */}
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
                      {studentData.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-black shadow-xs flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-300" /> KGB Onaylı
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-bold text-red-100/90">
                    <span>{studentData.faculty}</span>
                    <span className="text-red-300/60">•</span>
                    <span className="text-white font-black">{studentData.department}</span>
                    <span className="text-red-300/60">•</span>
                    <span>{studentData.grade}</span>
                  </div>
                </div>
              </div>

              {/* Sağ: KGB Genel Puanı & Durum (Kırmızı Bandın İçinde Şık Cam Kart) */}
              <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-white self-start md:self-auto">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-red-200 uppercase tracking-wider">KGB Genel Skoru</p>
                  <div className="flex items-baseline gap-1 justify-start md:justify-end">
                    <span className="text-3xl font-black text-white">{studentData.accreditationScore}</span>
                    <span className="text-xs font-bold text-red-200">/ 100</span>
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black shadow-xs">
                    {studentData.accreditationScore >= 85 ? 'A+ Düzeyi (Pekiyi)' : studentData.accreditationScore >= 75 ? 'A Düzeyi (Pekiyi)' : 'B+ Düzeyi (İyi)'}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Award size={26} />
                </div>
              </div>

            </div>
          </div>

          {/* Alt Beyaz Bölüm: Öğrenci No, Hedef Alan & İlerleme Çubuğu */}
          <div className="px-6 sm:px-8 py-5 space-y-4">
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                <span className="text-slate-500 font-bold">Öğrenci No:</span>
                <span className="font-black text-slate-900">{studentData.studentNo}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-slate-800 border border-red-100 font-medium">
                <span className="text-slate-500 font-bold">Hedef Kariyer Alanı:</span>
                <strong className="font-black text-[#990000]">{studentData.targetSector}</strong>
              </div>
            </div>

            {/* Hızlı İlerleme Çubuğu */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-gray-700 flex items-center gap-1.5">
                  <Compass size={14} className="text-[#990000]" /> Mezuniyet Kariyer Yeterliliği ve Yetenek Karnesi İlerlemesi
                </span>
                <span className="text-[#990000] font-black">%{studentData.accreditationScore} Tamamlandı</span>
              </div>
              <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-800 via-[#990000] to-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${studentData.accreditationScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600 font-semibold">
                <span>Başlangıç Yılı (2023)</span>
                <span>Zorunlu Stajlar Tamamlandı</span>
                <span>Mesleki Sertifikalar Eklendi</span>
                <span className="text-emerald-700 font-bold">Mezuniyet Akreditasyonuna Hazır</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. DÖRT ANA KARNE GÖSTERGESİ ───────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#990000] border border-red-100 flex items-center justify-center shrink-0">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{studentData.internshipsCount}</p>
              <p className="text-xs font-bold text-slate-700">Onaylı Staj</p>
              <span className="text-[10px] text-emerald-700 font-bold">{studentData.internshipsCount * 25} İş Günü Tamam</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
              <Award size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{studentData.certificationsCount}</p>
              <p className="text-xs font-bold text-slate-700">Akredite Sertifika</p>
              <span className="text-[10px] text-amber-700 font-bold">{studentData.certificationsCount * 36} Saat Eğitim</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{studentData.workshopsCount}</p>
              <p className="text-xs font-bold text-slate-700">Workshop & Atölye</p>
              <span className="text-[10px] text-blue-700 font-bold">{studentData.workshopsCount * 4} Saat Katılım</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{studentData.mentorMeetingsCount}</p>
              <p className="text-xs font-bold text-slate-700">Mentor Seansı</p>
              <span className="text-[10px] text-purple-700 font-bold">{studentData.mentorMeetingsCount * 2} Saat Bire Bir Danışmanlık</span>
            </div>
          </div>
        </section>

        {/* ── 3. KARNE SEKME GEZİNTİSİ & TALEP BUTONU ────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto hide-scrollbar">
            {[
              { id: 'ozet', label: 'Genel Karne Özeti', icon: BookOpen },
              { id: 'stajlar', label: 'Staj & Deneyimler', icon: Briefcase, count: internships.length },
              { id: 'sertifikalar', label: 'Sertifikalar', icon: Award, count: certifications.length },
              { id: 'etkinlikler', label: 'Workshop & Atölyeler', icon: Calendar, count: workshops.length },
              { id: 'transkript', label: 'Resmi Transkript Önizlemesi', icon: FileCheck },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-[#990000] text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-[#990000] border border-red-200 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus size={14} /> Yeni Faaliyet / Belge Onayı İste
          </button>
        </div>

        {/* ── 4. SEKME İÇERİKLERİ ─────────────────────────────────── */}
        
        {/* SEKME 1: GENEL KARNE ÖZETİ */}
        {activeTab === 'ozet' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sol 2 Kolon: Kariyer Yetkinlik Matrisi & Zaman Çizelgesi */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Yetkinlik Radar Matrisi */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <BarChart3 size={18} className="text-[#990000]" />
                        Temel Kariyer Yetkinlikleri Dökümü
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Üniversite akademik kurulu ve sektör danışmanları tarafından değerlendirilen yetkinlik karnesi.
                      </p>
                    </div>
                    <span className="text-xs font-black text-[#990000] bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                      Bölüm Ortalaması Üzerinde
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Teknik Kodlama & Yazılım Mimarisi', val: 94, level: 'İleri Düzey', color: 'bg-emerald-500' },
                      { name: 'Bulut Bilişim & Altyapı Çözümleri', val: 86, level: 'Yetkin', color: 'bg-[#990000]' },
                      { name: 'Çevik Proje Yönetimi & Scrum', val: 88, level: 'Yetkin', color: 'bg-blue-600' },
                      { name: 'Teknik İletişim & Ekip Çalışması', val: 92, level: 'İleri Düzey', color: 'bg-purple-600' },
                      { name: 'Analitik Düşünme & Problem Çözme', val: 90, level: 'İleri Düzey', color: 'bg-amber-500' },
                    ].map(sk => (
                      <div key={sk.name}>
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-slate-800">{sk.name}</span>
                          <span className="text-slate-600 font-semibold">{sk.level} • <strong>%{sk.val}</strong></span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${sk.color} rounded-full`} style={{ width: `${sk.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zaman Çizelgesi */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
                  <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-[#990000]" />
                    Kariyer Gelişim Kronolojisi
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {[
                      { title: 'Aselsan A.Ş. Ar-Ge Stajı Başarıyla Tamamlandı', date: 'Mart 2026', type: 'Staj', desc: '30 iş günü savunma sanayii yazılım stajı 95/100 notuyla tamamlandı.' },
                      { title: 'AWS Cloud Practitioner Sertifikasyonu Kazanıldı', date: 'Ocak 2026', type: 'Sertifika', desc: 'Amazon Web Services küresel akreditasyon sınavı başarıyla geçildi.' },
                      { title: 'Baykar Teknoloji Stajı & Savunma Sanayi Akreditasyonu', date: 'Ağustos 2025', type: 'Staj', desc: '20 iş günü zorunlu staj başarıyla onaylandı.' },
                      { title: 'KGB Sistemi Kaydı ve Kariyer Yol Haritası Başlangıcı', date: 'Ekim 2023', type: 'Sistem', desc: 'Öğrenci kariyer karnesi ve yetenek danışmanlığı protokolü aktive edildi.' },
                    ].map((ev, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#990000] border-2 border-white shadow-xs"></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">{ev.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{ev.type}</span>
                          </div>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">{ev.desc}</p>
                          <span className="text-[10px] text-slate-600 font-bold">{ev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sağ Kolon: Mühür & Danışman Bilgileri */}
              <div className="space-y-6">
                
                {/* Danışman Notu & Akademik Onay */}

                {/* Danışman Notu */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#990000] flex items-center justify-center font-black text-sm border border-red-100">
                      {studentData.advisorName.split(' ').map(n => n[0]).filter(Boolean).slice(-2).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{studentData.advisorName}</h4>
                      <p className="text-[10px] text-slate-600 font-bold">Akademik & Kariyer Danışmanı</p>
                    </div>
                  </div>

                  <blockquote className="text-xs text-slate-700 font-medium italic bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-3 leading-relaxed">
                    "Öğrencimiz {studentData.name}, {studentData.department} alanındaki akademik ve uygulamalı çalışmalarında gösterdiği üstün performans ile bölüm standartlarının üzerinde bir kariyer hazırlığına ulaşmıştır."
                  </blockquote>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                    <span>Son Onay Tarihi:</span>
                    <span className="font-bold text-slate-900">18 Mart 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 2: STAJ VE İŞ DENEYİMLERİ */}
        {activeTab === 'stajlar' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Kayıtlı ve Onaylı Staj Deneyimleri</h3>
                <p className="text-xs text-slate-600 font-medium">Kariyer Koordinatörlüğü ve Bölüm Başkanlığı tarafından tescil edilen stajlar.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                Toplam: {studentData.internshipsCount * 25} İş Günü
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {internships.map(intern => (
                <div key={intern.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:border-red-200 transition space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#990000] border border-red-100 flex items-center justify-center shrink-0">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-gray-900">{intern.company}</h4>
                        <p className="text-xs font-bold text-[#990000]">{intern.position}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black shrink-0">
                      ✓ {intern.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {intern.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div>
                      <span className="block text-[10px] text-slate-600 font-bold uppercase">Süre / Kredi</span>
                      <span className="font-bold text-gray-800">{intern.duration} ({intern.ects})</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-600 font-bold uppercase">Değerlendirme Notu</span>
                      <span className="font-bold text-emerald-700">{intern.score}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="block text-[10px] text-slate-600 font-bold uppercase">Staj Danışmanı</span>
                      <span className="font-semibold text-gray-700">{intern.mentor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {intern.skills.map(sk => (
                      <span key={sk} className="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-bold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKME 3: SERTİFİKALAR VE AKREDİTASYONLAR */}
        {activeTab === 'sertifikalar' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">Akredite Sertifikalar ve Yetkinlik Belgeleri</h3>
                <p className="text-xs text-gray-500">YÖK ve uluslararası mesleki standartlar çerçevesinde tescillenen başarı belgeleri.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                {certifications.length} Aktif Sertifika
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {certifications.map(cert => (
                <div key={cert.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:border-red-200 transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center">
                        <Award size={20} />
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                        Geçerli
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-gray-900 mb-1 leading-snug">{cert.title}</h4>
                    <p className="text-xs font-bold text-[#990000] mb-3">{cert.issuer}</p>

                    <div className="space-y-1.5 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Veriliş:</span>
                        <span className="font-semibold text-gray-800">{cert.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Eğitim Süresi:</span>
                        <span className="font-semibold text-gray-800">{cert.hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-medium">Akreditasyon:</span>
                        <span className="font-bold text-emerald-700">{cert.accreditedBy}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {cert.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[9px] font-bold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono font-semibold">
                    <span>Kod: {cert.code}</span>
                    <button onClick={() => toast.success('Sertifika Doğrulandı: ' + cert.code)} className="text-[#990000] font-bold hover:underline cursor-pointer">
                      Doğrula
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKME 4: WORKSHOP VE ETKİNLİK KATILIMLARI */}
        {activeTab === 'etkinlikler' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Workshop, Atölye ve Seminer Katılımları</h3>
                <p className="text-xs text-slate-600 font-medium">Üniversite bünyesinde ve sektör iş birlikleriyle tamamlanan mesleki gelişim faaliyetleri.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black">
                34 Saat Yetkinlik
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100">
                {workshops.map((w, idx) => (
                  <div key={w.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{w.title}</h4>
                        <p className="text-[11px] text-slate-600 font-medium">
                          Eğitmen / Konuşmacı: <strong className="text-slate-900 font-bold">{w.speaker}</strong> • {w.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {w.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black">
                        {w.hours} Saat
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEKME 5: RESMİ TRANSKRİPT ÖNİZLEMESİ */}
        {activeTab === 'transkript' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Resmi Kariyer Gelişim Belgesi (KGB Transkripti)</h3>
                <p className="text-xs text-slate-600 font-medium">Mezuniyette diplomanın yanında verilecek YÖK uyumlu kariyer eki formatı.</p>
              </div>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-[#990000] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-800 transition cursor-pointer shadow-xs"
              >
                <Printer size={14} /> Resmi Belgeyi Yazdır
              </button>
            </div>

            {/* Resmi Belge Tasarımı */}
            <div id="kgb-print-area" className="bg-white rounded-3xl border-2 border-red-900/20 p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
              
              {/* Belge Üst Başlığı */}
              <div className="text-center border-b-2 border-red-900/30 pb-6 space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <Logo className="w-12 h-12 text-[#990000]" />
                  <div className="text-center">
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                      T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ
                    </h2>
                    <p className="text-xs font-bold text-[#990000] tracking-wider uppercase">
                      Kariyer Geliştirme Koordinatörlüğü & Yetenek Akademisi
                    </p>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-2">
                  RESMİ KARİYER GELİŞİM BELGESİ (KGB) VE YETENEK KARNESİ
                </h3>
                <p className="text-[11px] text-slate-600 font-mono font-semibold">
                  Belge Kayıt No: İESÜ-KGB-2026/0941 • YÖKSİS Entegrasyon Kodu: TR-34-IESU-KGB
                </p>
              </div>

              {/* Öğrenci Resmi Bilgileri */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="block text-[10px] text-slate-700 font-bold uppercase">Adı Soyadı</span>
                  <span className="font-black text-slate-900">{studentData.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 font-bold uppercase">Öğrenci Numarası</span>
                  <span className="font-black text-slate-900">{studentData.studentNo}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 font-bold uppercase">Fakülte / Bölüm</span>
                  <span className="font-black text-slate-900">{studentData.faculty} / {studentData.department}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-700 font-bold uppercase">Genel Başarı Seviyesi</span>
                  <span className="font-black text-emerald-800">{studentData.accreditationScore >= 88 ? 'A+' : 'A'} (%{studentData.accreditationScore} Pekiyi)</span>
                </div>
              </div>

              {/* Özet Faaliyet Listesi */}
              <div className="space-y-4 text-xs">
                <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-1">
                  1. Tamamlanan Kurumsal ve Ar-Ge Stajları
                </h4>
                <div className="space-y-2">
                  {internships.map((int, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-700 font-medium">
                      <span>• <strong className="text-slate-900 font-bold">{int.company}</strong> — {int.position} ({int.duration})</span>
                      <span className="font-bold text-emerald-800">{int.score}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-1 pt-2">
                  2. Kazanılan Akredite Mesleki Sertifikalar
                </h4>
                <div className="space-y-2">
                  {certifications.map((crt, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 text-slate-700 font-medium">
                      <span>• <strong className="text-slate-900 font-bold">{crt.title}</strong> ({crt.issuer})</span>
                      <span className="font-mono text-slate-700 font-semibold">{crt.hours} • Onaylı</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-1 pt-2">
                  3. Mesleki Atölye, Seminer ve Vaka Çalışmaları
                </h4>
                <p className="text-slate-700 font-medium leading-relaxed">
                  Öğrenci eğitim süresince toplam <strong className="text-slate-900 font-bold">{studentData.workshopsCount} adet</strong> resmi atölye ve seminer programına katılmış, <strong className="text-slate-900 font-bold">{studentData.workshopsCount * 4} saatlik</strong> mesleki yetkinlik kazanımını tamamlamıştır.
                </p>
              </div>

              {/* İmza ve Mühür Alanı */}
              <div className="pt-8 border-t-2 border-red-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
                <div>
                  <p className="text-xs font-black text-slate-900">{studentData.advisorName}</p>
                  <p className="text-[10px] text-slate-600 font-bold">Kariyer Danışmanı & Bölüm Temsilcisi</p>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ E-İmzalanmıştır</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-2 border-dashed border-[#990000] rounded-full flex items-center justify-center p-1 text-[9px] font-black text-[#990000] text-center">
                    İESÜ MÜHÜR & ONAY
                  </div>
                  <span className="text-[8px] text-slate-600 font-bold mt-1">2026 Resmî İESÜ Damgası</span>
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900">Kariyer Geliştirme Koordinatörlüğü</p>
                  <p className="text-[10px] text-slate-600 font-bold">İstanbul Esenyurt Üniversitesi Rektörlüğü</p>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Resmi Belge Olarak Tescillidir</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── YENİ BELGE / FAALİYET EKLEME MODALI ─────────────────── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[10000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award size={18} className="text-[#990000]" /> Yeni Faaliyet / Belge Onayı İste
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-500 hover:text-slate-800 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Faaliyet Türü</label>
                <select
                  value={newRequestType}
                  onChange={e => setNewRequestType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-[#990000] text-slate-900 bg-slate-50 focus:bg-white transition"
                >
                  <option value="staj">Staj & İş Deneyimi</option>
                  <option value="sertifika">Mesleki Sertifika</option>
                  <option value="workshop">Workshop & Konferans</option>
                  <option value="proje">Ar-Ge / TÜBİTAK Projesi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Faaliyet / Belge Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: Yapay Zekâ Eğitimi, Gönüllü Staj..."
                  value={newRequestTitle}
                  onChange={e => setNewRequestTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-[#990000] text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Kurum / Organizasyon Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Havelsan, Google, Coursera..."
                  value={newRequestOrg}
                  onChange={e => setNewRequestOrg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-[#990000] text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Eğitim Saati veya Staj Gün Sayısı</label>
                <input
                  type="text"
                  placeholder="Örn: 30 Saat veya 20 İş Günü"
                  value={newRequestHours}
                  onChange={e => setNewRequestHours(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold outline-none focus:border-[#990000] text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white transition"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white font-black transition shadow-sm"
                >
                  Onaya Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── 5. FLOATING DOCK (KURUMSAL ÖĞRENCİ DOCK'U) ─────────────── */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(153,0,0,0.18)] flex items-center justify-between px-4 text-gray-800">
          
          {/* Akış */}
          <button 
            onClick={() => setView(previousView || (userRole === 'admin' ? 'admin' : 'student'))} 
            className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-[#990000] hover:bg-red-50 cursor-pointer" 
            title="Akış"
          >
            <Home size={22} strokeWidth={2.2} />
          </button>
          
          {/* KGB Karnesi - ACTIVE */}
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveTab('ozet');
            }}
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center mx-1 shrink-0 border border-red-300/40 cursor-pointer" 
            title="KGB Karnesi"
          >
            <GraduationCap size={22} strokeWidth={2.5} />
          </button>

          {/* Kariyer Fırsatları */}
          <button 
            onClick={() => setView('jobs')} 
            className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-[#990000] hover:bg-red-50 cursor-pointer" 
            title="Kariyer Fırsatları"
          >
            <Briefcase size={22} strokeWidth={2.2} />
          </button>
          
          {/* Profil */}
          <button 
            onClick={() => {
              if (setSelectedUserId) setSelectedUserId(studentData.id);
              setView('user_profile');
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#990000] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Profilim"
          >
            <SafeAvatar src={studentData.avatar || currentUser?.avatar} name={studentData.name} size="xs" alt="Profile" />
          </button>
        </div>
      </div>

    </div>
  );
}
