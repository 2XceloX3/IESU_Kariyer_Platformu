import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, GraduationCap, Award, Briefcase, Calendar, CheckCircle2,
  Download, ExternalLink, FileText, Share2, Sparkles, Star, Users,
  Building2, ShieldCheck, Check, Clock, QrCode, BookOpen, AlertCircle,
  Copy, Printer, ChevronRight, BarChart3, Layers, Compass, Plus,
  Search, Filter, CheckCircle, Info, FileCheck, Bookmark
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

  // Match student record from store or fallback to currentUser
  const studentData = useMemo(() => {
    const match = kgbStudentRecords.find(r => r.id === currentUser?.id || r.name === currentUser?.name);
    return {
      id: currentUser?.id || match?.id || 'STU-2026-001',
      name: currentUser?.name || match?.name || 'Öğrenci Adı',
      department: currentUser?.department || match?.department || 'Yazılım Mühendisliği',
      faculty: currentUser?.faculty || 'Mühendislik ve Mimarlık Fakültesi',
      grade: currentUser?.grade || '3. Sınıf',
      studentNo: currentUser?.studentNo || '2023010482',
      targetSector: match?.targetSector || currentUser?.targetSector || 'Yazılım & Bilişim Mimarisi',
      internshipsCount: match?.internships ?? (currentUser?.internships ?? 2),
      certificationsCount: match?.certifications ?? (currentUser?.certifications ?? 3),
      workshopsCount: match?.workshopsAttended ?? (currentUser?.workshopsAttended ?? 7),
      mentorMeetingsCount: match?.mentorMeetings ?? (currentUser?.mentorMeetings ?? 4),
      cvCompleteness: match?.cvCompleteness ?? (currentUser?.cvCompleteness ?? 88),
      portfolioItems: match?.portfolioItems ?? 5,
      accreditationScore: 88, // A Seviyesi
      verificationCode: 'İESÜ-KGB-2026-9941',
    };
  }, [currentUser, kgbStudentRecords]);

  const [activeTab, setActiveTab] = useState('ozet'); // 'ozet' | 'stajlar' | 'sertifikalar' | 'etkinlikler' | 'transkript'
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequestType, setNewRequestType] = useState('staj');
  const [newRequestTitle, setNewRequestTitle] = useState('');
  const [newRequestOrg, setNewRequestOrg] = useState('');
  const [newRequestHours, setNewRequestHours] = useState('');

  // Static rich records for the student's portfolio
  const [internships] = useState([
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
  ]);

  const [certifications] = useState([
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
  ]);

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
    toast.info('YÖK Uyumlu Resmi KGB Belgesi (PDF) Hazırlanıyor...');
    setTimeout(() => {
      window.print();
      if (logAction) {
        logAction(studentData.name, 'Resmi KGB Kariyer Karnesi PDF olarak yazdırıldı/indirildi.', 'KGB');
      }
    }, 500);
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 pb-20 selection:bg-red-100">
      
      {/* ── ÜST SABİT GEZİNME ÇUBUĞU ───────────────────────────────── */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Sol: Geri Dön Butonu ve Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView(previousView || 'student')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-[#990000] border border-gray-200 transition font-bold text-xs group cursor-pointer"
              title="Öğrenci Portalına Dön"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-gray-500 group-hover:text-[#990000]" />
              <span className="hidden sm:inline">Öğrenci Portalına Dön</span>
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 text-[#990000]" />
              <div>
                <h1 className="text-sm font-black text-gray-900 leading-tight">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] text-[#990000] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={10} className="animate-pulse" /> Kariyer Gelişim Belgesi & Yetenek Karnesi
                </p>
              </div>
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
          <div className="h-28 bg-gradient-to-r from-[#7A0606] via-[#990000] to-[#B31B1B] relative p-6 flex items-start justify-between">
            <div className="flex items-center gap-2 text-red-100 text-xs font-bold bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>YÖK 2026 Kariyer ve İstihdam Akreditasyon Standartlarına Uygun</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs font-mono bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              <QrCode size={14} />
              <span>Doğrulama No: {studentData.verificationCode}</span>
              <button onClick={handleCopyCode} className="hover:text-white p-0.5" title="Kodu Kopyala">
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-12 mb-6">
              
              {/* Profil & Bilgi */}
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden shrink-0">
                  <SafeAvatar
                    src={currentUser?.avatar}
                    name={studentData.name}
                    size="2xl"
                    className="w-full h-full"
                    alt={studentData.name}
                  />
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                      {studentData.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                      KGB Onaylı
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                    {studentData.faculty} • <span className="text-[#990000] font-bold">{studentData.department}</span> ({studentData.grade})
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Öğrenci No: {studentData.studentNo} • Hedef Alan: <strong className="text-gray-700 font-bold">{studentData.targetSector}</strong>
                  </p>
                </div>
              </div>

              {/* Sağ: KGB Genel Puanı & Durum */}
              <div className="flex items-center gap-4 bg-red-50/70 border border-red-100 rounded-2xl p-4 self-stretch md:self-auto justify-between md:justify-start">
                <div className="text-center sm:text-right">
                  <p className="text-[10px] font-bold text-red-950 uppercase tracking-wider">KGB Genel Skoru</p>
                  <div className="flex items-baseline gap-1 justify-center sm:justify-end">
                    <span className="text-3xl font-black text-[#990000]">{studentData.accreditationScore}</span>
                    <span className="text-xs font-bold text-gray-400">/ 100</span>
                  </div>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#990000] text-white text-[10px] font-black">
                    A+ Düzeyi (Pekiyi)
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-red-200 text-[#990000] shrink-0">
                  <Award size={26} />
                </div>
              </div>
            </div>

            {/* Hızlı İlerleme Çubuğu */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-gray-700 flex items-center gap-1.5">
                  <Compass size={14} className="text-[#990000]" /> Mezuniyet Kariyer Yeterliliği ve Yetenek Karnesi İlerlemesi
                </span>
                <span className="text-[#990000] font-black">%88 Tamamlandı</span>
              </div>
              <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-800 via-[#990000] to-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: '88%' }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500 font-medium">
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
              <p className="text-2xl font-black text-gray-900">{studentData.internshipsCount}</p>
              <p className="text-xs font-bold text-gray-500">Onaylı Staj</p>
              <span className="text-[10px] text-emerald-600 font-bold">50 İş Günü Tamam</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
              <Award size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{studentData.certificationsCount}</p>
              <p className="text-xs font-bold text-gray-500">Akredite Sertifika</p>
              <span className="text-[10px] text-amber-600 font-bold">108 Saat Eğitim</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{studentData.workshopsCount}</p>
              <p className="text-xs font-bold text-gray-500">Workshop & Atölye</p>
              <span className="text-[10px] text-blue-600 font-bold">34 Saat Katılım</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center gap-4 hover:border-red-200 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{studentData.mentorMeetingsCount}</p>
              <p className="text-xs font-bold text-gray-500">Mentor Seansı</p>
              <span className="text-[10px] text-purple-600 font-bold">Bire Bir Sektör Rehberi</span>
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
                      <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <BarChart3 size={18} className="text-[#990000]" />
                        Temel Kariyer Yetkinlikleri Dökümü
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
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
                          <span className="text-gray-800">{sk.name}</span>
                          <span className="text-gray-500">{sk.level} • <strong>%{sk.val}</strong></span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${sk.color} rounded-full`} style={{ width: `${sk.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zaman Çizelgesi */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
                  <h3 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-[#990000]" />
                    Kariyer Gelişim Kronolojisi
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
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
                            <span className="text-xs font-black text-gray-900">{ev.title}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{ev.type}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{ev.desc}</p>
                          <span className="text-[10px] text-gray-400 font-semibold">{ev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sağ Kolon: Mühür & Danışman Bilgileri */}
              <div className="space-y-6">
                
                {/* Resmi Onay ve E-Devlet Entegrasyonu */}
                <div className="bg-gradient-to-br from-red-900 via-[#990000] to-black rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Resmi Üniversite Onayı</h4>
                      <p className="text-[10px] text-red-200">Kariyer Geliştirme Koordinatörlüğü</p>
                    </div>
                  </div>

                  <p className="text-xs text-red-100 leading-relaxed mb-4">
                    Bu belge, İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi ve Rektörlük yönergeleri gereği öğrencinin mezuniyet transkriptine ek olarak resmi kariyer karnesi niteliği taşımaktadır.
                  </p>

                  <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 text-center mb-4">
                    <p className="text-[10px] text-red-200 uppercase font-bold tracking-wider">E-İmza & Doğrulama Barkodu</p>
                    <div className="flex items-center justify-center my-2">
                      <div className="bg-white p-2 rounded-xl">
                        <QrCode size={64} className="text-gray-900" />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-white tracking-widest">{studentData.verificationCode}</span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="w-full py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={13} /> Doğrulama Kodunu Kopyala
                  </button>
                </div>

                {/* Danışman Notu */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#990000] flex items-center justify-center font-black text-sm border border-red-100">
                      AY
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Dr. Öğr. Üyesi Ahmet Yılmaz</h4>
                      <p className="text-[10px] text-gray-500">Akademik & Kariyer Danışmanı</p>
                    </div>
                  </div>

                  <blockquote className="text-xs text-gray-600 italic bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-3">
                    "Öğrencimiz Ahmet Yılmaz, Ar-Ge stajlarında gösterdiği üstün performans ve uluslararası bulut sertifikasyonu ile bölüm standartlarının üzerinde bir kariyer hazırlığına ulaşmıştır."
                  </blockquote>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                    <span>Son Onay Tarihi:</span>
                    <span className="font-bold text-gray-800">18 Mart 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEKME 2: STAJ VE İŞ DENEYİMLERİ */}
        {activeTab === 'stajlar' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">Kayıtlı ve Onaylı Staj Deneyimleri</h3>
                <p className="text-xs text-gray-500">Kariyer Koordinatörlüğü ve Bölüm Başkanlığı tarafından tescil edilen stajlar.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                Toplam: 50 İş Günü
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
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Süre / Kredi</span>
                      <span className="font-bold text-gray-800">{intern.duration} ({intern.ects})</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Değerlendirme Notu</span>
                      <span className="font-bold text-emerald-700">{intern.score}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">Staj Danışmanı</span>
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
                        <span className="text-gray-400">Veriliş:</span>
                        <span className="font-semibold text-gray-800">{cert.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Eğitim Süresi:</span>
                        <span className="font-semibold text-gray-800">{cert.hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Akreditasyon:</span>
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

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
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
            <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">Workshop, Atölye ve Seminer Katılımları</h3>
                <p className="text-xs text-gray-500">Üniversite bünyesinde ve sektör iş birlikleriyle tamamlanan mesleki gelişim faaliyetleri.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black">
                34 Saat Yetkinlik
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
              <div className="divide-y divide-gray-100">
                {workshops.map((w, idx) => (
                  <div key={w.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-gray-900">{w.title}</h4>
                        <p className="text-[11px] text-gray-500">
                          Eğitmen / Konuşmacı: <strong className="text-gray-700">{w.speaker}</strong> • {w.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
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
            <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">Resmi Kariyer Gelişim Belgesi (KGB Transkripti)</h3>
                <p className="text-xs text-gray-500">Mezuniyette diplomanın yanında verilecek YÖK uyumlu kariyer eki formatı.</p>
              </div>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-[#990000] text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-red-800 transition cursor-pointer shadow-xs"
              >
                <Printer size={14} /> Resmi Belgeyi Yazdır
              </button>
            </div>

            {/* Resmi Belge Tasarımı */}
            <div className="bg-white rounded-3xl border-2 border-red-900/20 p-8 sm:p-12 shadow-md max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
              
              {/* Belge Üst Başlığı */}
              <div className="text-center border-b-2 border-red-900/30 pb-6 space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <Logo className="w-12 h-12 text-[#990000]" />
                  <div className="text-center">
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-gray-900 uppercase">
                      T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ
                    </h2>
                    <p className="text-xs font-bold text-[#990000] tracking-wider uppercase">
                      Kariyer Geliştirme Koordinatörlüğü & Yetenek Akademisi
                    </p>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight pt-2">
                  RESMİ KARİYER GELİŞİM BELGESİ (KGB) VE YETENEK KARNESİ
                </h3>
                <p className="text-[11px] text-gray-500 font-mono">
                  Belge Kayıt No: İESÜ-KGB-2026/0941 • YÖKSİS Entegrasyon Kodu: TR-34-IESU-KGB
                </p>
              </div>

              {/* Öğrenci Resmi Bilgileri */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Adı Soyadı</span>
                  <span className="font-black text-gray-900">{studentData.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Öğrenci Numarası</span>
                  <span className="font-black text-gray-900">{studentData.studentNo}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Fakülte / Bölüm</span>
                  <span className="font-black text-gray-900">{studentData.department}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">Genel Başarı Seviyesi</span>
                  <span className="font-black text-emerald-700">A+ (%88 Pekiyi)</span>
                </div>
              </div>

              {/* Özet Faaliyet Listesi */}
              <div className="space-y-4 text-xs">
                <h4 className="font-black text-gray-900 text-sm border-b border-gray-200 pb-1">
                  1. Tamamlanan Kurumsal ve Ar-Ge Stajları
                </h4>
                <div className="space-y-2">
                  {internships.map((int, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span>• <strong>{int.company}</strong> — {int.position} ({int.duration})</span>
                      <span className="font-bold text-emerald-700">{int.score}</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-black text-gray-900 text-sm border-b border-gray-200 pb-1 pt-2">
                  2. Kazanılan Akredite Mesleki Sertifikalar
                </h4>
                <div className="space-y-2">
                  {certifications.map((crt, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <span>• <strong>{crt.title}</strong> ({crt.issuer})</span>
                      <span className="font-mono text-gray-500">{crt.hours} • Onaylı</span>
                    </div>
                  ))}
                </div>

                <h4 className="font-black text-gray-900 text-sm border-b border-gray-200 pb-1 pt-2">
                  3. Mesleki Atölye, Seminer ve Vaka Çalışmaları
                </h4>
                <p className="text-gray-600">
                  Öğrenci eğitim süresince toplam <strong>7 adet</strong> resmi atölye ve seminer programına katılmış, <strong>34 saatlik</strong> mesleki yetkinlik kazanımını tamamlamıştır.
                </p>
              </div>

              {/* İmza ve Mühür Alanı */}
              <div className="pt-8 border-t-2 border-red-900/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center">
                <div>
                  <p className="text-xs font-black text-gray-900">Dr. Öğr. Üyesi Ahmet Yılmaz</p>
                  <p className="text-[10px] text-gray-500">Kariyer Danışmanı & Bölüm Temsilcisi</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1">✓ E-İmzalanmıştır</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-2 border-dashed border-[#990000] rounded-full flex items-center justify-center p-1 text-[9px] font-black text-[#990000] text-center">
                    İESÜ MÜHÜR & ONAY
                  </div>
                  <span className="text-[8px] text-gray-400 mt-1">2026 Resmî İESÜ Damgası</span>
                </div>

                <div>
                  <p className="text-xs font-black text-gray-900">Kariyer Geliştirme Koordinatörlüğü</p>
                  <p className="text-[10px] text-gray-500">İstanbul Esenyurt Üniversitesi Rektörlüğü</p>
                  <p className="text-[9px] text-emerald-600 font-bold mt-1">✓ Resmi Belge Olarak Tescillidir</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── YENİ BELGE / FAALİYET EKLEME MODALI ─────────────────── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Award size={18} className="text-[#990000]" /> Yeni Faaliyet / Belge Onayı İste
              </h3>
              <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Faaliyet Türü</label>
                <select
                  value={newRequestType}
                  onChange={e => setNewRequestType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                >
                  <option value="staj">Staj & İş Deneyimi</option>
                  <option value="sertifika">Mesleki Sertifika</option>
                  <option value="workshop">Workshop & Konferans</option>
                  <option value="proje">Ar-Ge / TÜBİTAK Projesi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Faaliyet / Belge Başlığı</label>
                <input
                  type="text"
                  placeholder="Örn: Yapay Zekâ Eğitimi, Gönüllü Staj..."
                  value={newRequestTitle}
                  onChange={e => setNewRequestTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Kurum / Organizasyon Adı</label>
                <input
                  type="text"
                  placeholder="Örn: Havelsan, Google, Coursera..."
                  value={newRequestOrg}
                  onChange={e => setNewRequestOrg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Eğitim Saati veya Staj Gün Sayısı</label>
                <input
                  type="text"
                  placeholder="Örn: 30 Saat veya 20 İş Günü"
                  value={newRequestHours}
                  onChange={e => setNewRequestHours(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 font-semibold outline-none focus:border-[#990000]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 transition"
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

    </div>
  );
}
