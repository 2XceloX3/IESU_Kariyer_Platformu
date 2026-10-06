import React, { useState, useMemo } from 'react';
import { 
  Building2, Calendar, Users, Briefcase, ExternalLink, ShieldCheck, 
  ChevronRight, BookOpen, X, Search, CheckCircle2, MapPin, Sparkles, 
  ArrowLeft, GraduationCap, Award, MessageCircle, Filter, Star, Check,
  Building, Phone, Mail, FileCheck2, Handshake, Eye, Info
} from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import useAppStore from '../store/useAppStore';
import { generateStudents, generateAlumni } from '../utils/mockData';

export default function CareerNetwork({ 
  companies = [], 
  academicStaff = [], 
  setView, 
  setSelectedUserId, 
  currentUser, 
  userRole = 'student', 
  previousView, 
  embedded = false,
  hideHeader = false
}) {
  const store = useAppStore?.getState ? useAppStore.getState() : {};
  const effectiveCurrentUser = currentUser || store.currentUser;
  const effectiveRole = userRole || effectiveCurrentUser?.role || store.userRole || store.activePortalBranch || 'student';
  const isAlumni = effectiveRole === 'alumni';
  const isAcademic = effectiveRole === 'academic' || effectiveRole === 'academic_staff';
  const isCompany = effectiveRole === 'company' || effectiveRole === 'employer';
  const isAdmin = effectiveRole === 'admin';
  const isStudent = !isAlumni && !isAcademic && !isCompany && !isAdmin;

  // Active top-level tab (Companies default to talent_pool, others to protocols)
  const [activeNetworkTab, setActiveNetworkTab] = useState(isCompany ? 'talent_pool' : 'protocols');

  // Modals for protocols tab
  const [activeModal, setActiveModal] = useState(null); // 'companies', 'participants', 'internships'
  const [selectedParticipantModal, setSelectedParticipantModal] = useState(null);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);
  const [selectedInternshipModal, setSelectedInternshipModal] = useState(null);
  const [showAllAcademics, setShowAllAcademics] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Talent Pool Search & Filters
  const [talentSearch, setTalentSearch] = useState('');
  const [talentRoleFilter, setTalentRoleFilter] = useState('all'); // 'all' | 'student' | 'alumni' | 'intern_seeking'
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [minGpaFilter, setMinGpaFilter] = useState('all');

  const homeView = previousView || (isAcademic ? 'academic' : isAlumni ? 'alumni' : isCompany ? 'company' : isAdmin ? 'admin' : 'student');

  const handleNavigateToJobs = () => {
    const targetBranch = isAcademic ? 'academic' : isAlumni ? 'alumni' : isCompany ? 'company' : isAdmin ? 'admin' : 'student';
    useAppStore.getState().setActivePortalBranch?.(targetBranch);
    if (setView) setView('jobs');
  };

  const bannerGradient = 
    isAlumni ? 'bg-gradient-to-br from-[#065F46] via-[#059669] to-[#047857] border-emerald-900' :
    isAcademic ? 'bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b] border-indigo-950' :
    isCompany ? 'bg-gradient-to-br from-[#0A2342] via-[#163B65] to-[#0F172A] border-blue-900' :
    isAdmin ? 'bg-gradient-to-br from-[#78350F] via-[#b45309] to-[#92400E] border-amber-900' :
    'bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] border-red-900';

  const titleColor = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#312e81]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const actionBtnTextClass = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#312e81]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const primaryBtnClass = 
    isAlumni ? 'bg-[#059669] hover:bg-emerald-700' :
    isAcademic ? 'bg-[#312e81] hover:bg-indigo-900' :
    isCompany ? 'bg-[#1e3a5f] hover:bg-slate-900' :
    isAdmin ? 'bg-[#b45309] hover:bg-amber-700' :
    'bg-[#990000] hover:bg-red-800';

  const cardIconBg = 
    isAlumni ? 'bg-emerald-50 text-[#059669]' :
    isAcademic ? 'bg-indigo-50 text-[#312e81]' :
    isCompany ? 'bg-blue-50 text-[#1e3a5f]' :
    isAdmin ? 'bg-amber-50 text-[#b45309]' :
    'bg-red-50 text-[#990000]';

  const cardHoverBorder = 
    isAlumni ? 'hover:border-emerald-200' :
    isAcademic ? 'hover:border-indigo-200' :
    isCompany ? 'hover:border-blue-200' :
    isAdmin ? 'hover:border-amber-200' :
    'hover:border-red-200';

  // ─── TALENT POOL CANDIDATES DATA ───
  const storeStudents = useAppStore(state => state.students);
  const storeAlumni = useAppStore(state => state.alumni);

  const rawStudents = (storeStudents && storeStudents.length > 0) ? storeStudents : generateStudents();
  const rawAlumni = (storeAlumni && storeAlumni.length > 0) ? storeAlumni : generateAlumni();

  const allTalents = useMemo(() => {
    const studentList = (rawStudents || []).map(s => ({
      id: s.id,
      name: s.name,
      department: s.department || 'Yazılım Mühendisliği',
      type: 'student',
      typeLabel: 'Öğrenci',
      grade: s.year ? `${s.year}. Sınıf` : 'Lisans',
      gpa: s.gpa ? Number(s.gpa).toFixed(2) : '3.40',
      avatar: s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0A2342&color=fff`,
      email: s.email,
      skills: s.skills || ['React', 'Python', 'SQL', 'İngilizce (B2)'],
      internshipStatus: s.internshipStatus || 'Staj Arıyor',
      doubleMajor: s.doubleMajor || null,
      badge: s.gpa && Number(s.gpa) >= 3.5 ? 'Yüksek Başarı' : 'Doğrulanmış Öğrenci'
    }));

    const alumniList = (rawAlumni || []).map(a => ({
      id: a.id,
      name: a.name,
      department: a.department || 'Bilgisayar Mühendisliği',
      type: 'alumni',
      typeLabel: 'Mezun',
      grade: a.gradYear ? `${a.gradYear} Mezunu` : 'Mezun',
      gpa: a.gpa ? Number(a.gpa).toFixed(2) : '3.65',
      avatar: a.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name)}&background=059669&color=fff`,
      email: a.email,
      skills: a.skills || ['Fullstack Dev', 'Node.js', 'AWS', 'Docker'],
      internshipStatus: a.company ? `${a.company} • ${a.title || 'Uzman'}` : 'Açık Profil',
      currentCompany: a.company,
      currentTitle: a.title,
      badge: 'İESÜ Mezun Ağı'
    }));

    return [...studentList, ...alumniList];
  }, [rawStudents, rawAlumni]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set(allTalents.map(t => t.department).filter(Boolean));
    return Array.from(depts);
  }, [allTalents]);

  const filteredTalents = useMemo(() => {
    return allTalents.filter(talent => {
      // Role filter
      if (talentRoleFilter === 'student' && talent.type !== 'student') return false;
      if (talentRoleFilter === 'alumni' && talent.type !== 'alumni') return false;
      if (talentRoleFilter === 'intern_seeking' && (talent.type !== 'student' || talent.internshipStatus === 'Tamamlandı')) return false;

      // Department filter
      if (selectedDeptFilter !== 'all' && talent.department !== selectedDeptFilter) return false;

      // Min GPA filter
      if (minGpaFilter === '3.5' && Number(talent.gpa) < 3.5) return false;
      if (minGpaFilter === '3.0' && Number(talent.gpa) < 3.0) return false;

      // Search term
      if (talentSearch.trim()) {
        const q = talentSearch.toLowerCase();
        const matchesName = talent.name.toLowerCase().includes(q);
        const matchesDept = talent.department.toLowerCase().includes(q);
        const matchesSkills = (talent.skills || []).some(s => s.toLowerCase().includes(q));
        const matchesCompany = (talent.currentCompany || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDept && !matchesSkills && !matchesCompany) return false;
      }

      return true;
    });
  }, [allTalents, talentRoleFilter, selectedDeptFilter, minGpaFilter, talentSearch]);

  const handleOpenDirectChatWithTalent = (talent) => {
    const targetId = talent.id || 'usr_' + Date.now();
    const targetName = talent.name;
    const targetAvatar = talent.avatar;
    const targetDept = talent.department;
    const targetRole = talent.type;

    if (setSelectedUserId) setSelectedUserId(targetId);
    useAppStore.getState().setSelectedUserId?.(targetId);

    window.dispatchEvent(new CustomEvent('iesu_open_chat', {
      detail: {
        candidateId: targetId,
        candidateName: targetName,
        candidateAvatar: targetAvatar,
        candidateDept: targetDept,
        candidateRole: targetRole,
        candidateCompany: '',
        initialMessage: `Merhaba ${targetName}, profilinizi İESÜ Yetenek Havuzu üzerinden inceledik. Kurumumuzdaki staj / iş olanakları hakkında görüşmek isteriz.`
      }
    }));

    window.toast?.success?.(`${targetName} ile mesajlaşma paneli açıldı.`);
  };

  const handleViewTalentProfile = (userId) => {
    const isSelf = !userId || userId === 'self' || userId === 'me' || (effectiveCurrentUser && (
      String(userId) === String(effectiveCurrentUser.id) ||
      String(userId) === String(effectiveCurrentUser.uid) ||
      (effectiveCurrentUser.name && String(userId).trim().toLowerCase() === effectiveCurrentUser.name.trim().toLowerCase())
    ));
    const targetId = isSelf ? (effectiveCurrentUser?.id || userId) : userId;
    if (setSelectedUserId) setSelectedUserId(targetId);
    useAppStore.getState().setSelectedUserId?.(targetId);
    if (setView) setView(isSelf ? 'user_profile' : 'public_profile');
  };

  // ─── PROTOCOL NETWORK DATA (COMPANIES, ACADEMICS, PARTICIPANTS) ───
  const networkCompanies = (companies || []).filter(c => (c.status === 'Onaylı' || c.status?.toLowerCase().includes('onay')) && c.source !== 'demo_seed');
  const networkAcademics = (academicStaff || []).filter(a => a.source !== 'demo_seed');

  const defaultStitchCompanies = [
    { 
      id: 'cmp_p_1', 
      name: 'Aselsan A.Ş.', 
      sector: 'Savunma Sanayii & Bilişim', 
      location: 'Ankara / İstanbul', 
      protocolDate: '2025-2027', 
      openPositions: 14, 
      scope: 'Zorunlu Mühendislik & Aday Mühendislik Protokolü',
      badge: 'Savunma Sanayii',
      logo: 'https://ui-avatars.com/api/?name=Aselsan&background=990000&color=fff',
      desc: 'Haberleşme, radar ve elektronik harp sistemleri üzerine aday mühendislik ve staj kontenjanı tahsis edilmiştir.'
    },
    { 
      id: 'cmp_p_2', 
      name: 'Baykar Teknoloji', 
      sector: 'Havacılık, Uzay & İHA', 
      location: 'İstanbul / Özdemir Bayraktar Kampüsü', 
      protocolDate: '2025-2028', 
      openPositions: 22, 
      scope: 'İnsansız Sistemler & Gömülü Yazılım Stajı',
      badge: 'Havacılık & İHA',
      logo: 'https://ui-avatars.com/api/?name=Baykar&background=0A2342&color=fff',
      desc: 'İHA aviyonik sistemleri, yapay zeka ve kompozit imalat alanında yıllık kontenjan tahsisi bulunmaktadır.'
    },
    { 
      id: 'cmp_p_3', 
      name: 'Trendyol Tech', 
      sector: 'E-Ticaret & Büyük Veri', 
      location: 'İstanbul Maslak', 
      protocolDate: '2026-2027', 
      openPositions: 8, 
      scope: 'Bulut Bilişim & Backend Geliştirici Protokolü',
      badge: 'Teknoloji',
      logo: 'https://ui-avatars.com/api/?name=Trendyol&background=990000&color=fff',
      desc: 'Mikroservis mimarileri, DevOps ve mobil yazılım geliştirmede üstün başarılı öğrencilere staj hakkı.'
    },
    { 
      id: 'cmp_p_4', 
      name: 'Turkcell Teknoloji', 
      sector: 'Telekomünikasyon & Bulut', 
      location: 'İstanbul Küçükyalı', 
      protocolDate: '2024-2027', 
      openPositions: 19, 
      scope: '5G, Siber Güvenlik & Ağ Altyapı Protokolü',
      badge: 'Telekom',
      logo: 'https://ui-avatars.com/api/?name=Turkcell&background=059669&color=fff',
      desc: 'Veri merkezleri, fiber altyapı ve ağ güvenliği alanında teknik staj ve istihdam köprüsü.'
    },
    { 
      id: 'cmp_p_5', 
      name: 'ESİDER Üye Sanayi Tesisleri', 
      sector: 'Üretim, Otomasyon & Kimya', 
      location: 'İstanbul Esenyurt Sanayi Bölgesi', 
      protocolDate: '2025-2028', 
      openPositions: 35, 
      scope: 'Fabrika İçi Saha & Kalite Kontrol Stajı',
      badge: 'Bölgesel Sanayi',
      logo: 'https://ui-avatars.com/api/?name=ESIDER&background=1e3a5f&color=fff',
      desc: 'Esenyurt sanayi bölgesindeki tesislerde mühendislik ve işletme öğrencilerine servis ve yemek imkânlı staj tahsisi.'
    },
    { 
      id: 'cmp_p_6', 
      name: 'Havelsan A.Ş.', 
      sector: 'Yazılım, Komuta Kontrol & Simülasyon', 
      location: 'Ankara / İstanbul Bilişim Vadisi', 
      protocolDate: '2024-2026', 
      openPositions: 12, 
      scope: 'Siber Güvenlik & Sanal Gerçeklik Protokolü',
      badge: 'Savunma & Yazılım',
      logo: 'https://ui-avatars.com/api/?name=Havelsan&background=b45309&color=fff',
      desc: 'Savunma yazılımları, siber tatbikatlar ve yapay zeka tabanlı komuta kontrol projelerinde yer alma olanağı.'
    }
  ];

  const allCompanies = networkCompanies.length > 0 ? networkCompanies : defaultStitchCompanies;

  const defaultParticipants = [
    { 
      id: 'part_1', 
      name: 'Prof. Dr. Süleyman Özdemir', 
      title: 'Rektör / Kurul Başkanı', 
      unit: 'İESÜ Rektörlük', 
      status: 'Kurul Başkanı',
      roleType: 'rector',
      email: 'rektorluk@esenyurt.edu.tr',
      desc: 'Üniversite-sanayi iş birliği ve akademik protokollerin en üst düzeyde koordinasyonunu ve resmî onay süreçlerini yürütür.',
      initiatives: ['Cumhurbaşkanlığı İK Ofisi Entegrasyonu', 'Sanayi Protokolleri Onay Mercii', 'Akademik Danışma Kurulu']
    },
    { 
      id: 'part_2', 
      name: 'Kariyer Geliştirme Koordinatörlüğü', 
      title: 'Resmî Koordinatörlük Birimi', 
      unit: 'İESÜ KGK', 
      status: 'Yürütücü & Düzenleyen',
      roleType: 'career_center',
      email: 'kariyer@esenyurt.edu.tr',
      desc: 'Öğrenci ve mezunların staj, istihdam, mentorluk ve yetenek havuzu süreçlerini yöneten ana merkezdir.',
      initiatives: ['Yetenek Kapısı Entegrasyonu', 'Ulusal Staj Programı Koordinasyonu', 'Sektör Buluşmaları']
    },
    { 
      id: 'part_3', 
      name: 'Mühendislik & Mimarlık Fakültesi Dekanlığı', 
      title: 'Fakülte Temsilciliği', 
      unit: 'İESÜ MMF', 
      status: 'Akademik Kurul',
      roleType: 'faculty',
      email: 'mmf@esenyurt.edu.tr',
      desc: 'Bilgisayar, Yazılım, Elektrik-Elektronik ve Endüstri Mühendisliği zorunlu ve aday mühendislik staj protokollerini onaylar.',
      initiatives: ['Savunma Sanayii Ar-Ge Protokolü', 'Aday Mühendislik Programı', 'Bitirme Projeleri Sanayi Eşleşmesi']
    },
    { 
      id: 'part_4', 
      name: 'Esenyurt Sanayici ve İş İnsanları Derneği (ESİDER)', 
      title: 'Sanayi & Üretim Sektörü Temsilcisi', 
      unit: 'ESİDER Yönetim Kurulu', 
      status: 'Stratejik Protokol Ortağı',
      roleType: 'industry',
      email: 'iletisim@esider.org.tr',
      desc: 'Bölgedeki 300+ sanayi kuruluşu ve üretim tesisinde İESÜ öğrencilerine öncelikli staj ve istihdam kotası sağlar.',
      initiatives: ['Bölgesel Sanayi Staj Havuzu', 'Mühendislik İstihdam Garantisi', 'Fabrika Teknik Gezileri']
    },
    { 
      id: 'part_5', 
      name: 'İktisadi, İdari ve Sosyal Bilimler Fakültesi Dekanlığı', 
      title: 'Fakülte Temsilciliği', 
      unit: 'İESÜ İİSBF', 
      status: 'Akademik Kurul',
      roleType: 'faculty',
      email: 'iisbf@esenyurt.edu.tr',
      desc: 'İşletme, Uluslararası Ticaret ve Finans alanında kurumsal ortaklıklar ve denetim firmaları staj protokollerini yürütür.',
      initiatives: ['Finans & Denetim Staj Kotası', 'Dış Ticaret Protokolleri', 'Borsa İstanbul Ziyaretleri']
    },
    { 
      id: 'part_6', 
      name: 'İstanbul Ticaret Odası (İTO) Üniversite Masası', 
      title: 'İş Dünyası & Ticaret Temsilcisi', 
      unit: 'İTO Girişimcilik & İK', 
      status: 'Protokol Ortağı',
      roleType: 'commerce',
      email: 'kariyer@ito.org.tr',
      desc: 'Ticari işletmeler ve KOBİ ölçeğindeki ihracatçı firmalarda staj ve dış ticaret uzmanlığı kontenjanlarını koordine eder.',
      initiatives: ['İhracat Danışmanlığı Stajı', 'Genç Girişimcilik Desteği', 'KOBİ Mentorluk Ağı']
    },
    { 
      id: 'part_7', 
      name: 'Teknoloji Transfer Ofisi (TTO) & Girişimcilik', 
      title: 'Ar-Ge ve İnovasyon Koordinatörlüğü', 
      unit: 'İESÜ TTO', 
      status: 'Teknoloji Ortağı',
      roleType: 'tto',
      email: 'tto@esenyurt.edu.tr',
      desc: 'TÜBİTAK, Teknofest ve patent odaklı öğrenci projelerinin sanayi şirketleriyle ticarileşme protokollerini yönetir.',
      initiatives: ['Teknopark Ön Kuluçka Ofisi', 'TÜBİTAK 2244 Sanayi Doktora & Lisans', 'Patent Masası']
    },
    { 
      id: 'part_8', 
      name: 'İŞKUR & Kamu İstihdam İrtibat Noktası', 
      title: 'Kamu Kurumu Temsilciliği', 
      unit: 'İŞKUR Kampüs İrtibat', 
      status: 'Resmî Kurum',
      roleType: 'public',
      email: 'esenyurt@iskur.gov.tr',
      desc: 'Öğrencilerin mezuniyet öncesi İş Kulübü eğitimleri almasını ve kamu istihdam teşviklerinden faydalanmasını sağlar.',
      initiatives: ['İş Kulübü Sertifika Programı', 'Kamu İstihdam Danışmanlığı', 'İşbaşı Eğitim Teşvikleri']
    }
  ];

  const defaultInternships = [
    { 
      id: 'int_p_1', 
      title: 'Zorunlu Mühendislik Yaz Stajı Protokolü', 
      company: 'Aselsan & Baykar Teknoloji', 
      quota: '45 Öğrenci', 
      deadline: '15 Mayıs 2026', 
      type: 'Zorunlu / Gönüllü',
      department: 'Bilgisayar, Yazılım, Elektrik-Elektronik, Endüstri Müh.',
      requirements: '3. veya 4. sınıf öğrencisi olmak, GNO en az 2.50'
    },
    { 
      id: 'int_p_2', 
      title: 'Yazılım ve Yapay Zeka Aday Mühendislik', 
      company: 'Trendyol, Turkcell & Havelsan', 
      quota: '30 Öğrenci', 
      deadline: '30 Nisan 2026', 
      type: 'Aday Mühendislik',
      department: 'Bilgisayar Müh., Yazılım Müh., Yönetim Bilişim Sistemleri',
      requirements: '4. sınıf öğrencisi olmak, haftada en az 3 gün devam'
    },
    { 
      id: 'int_p_3', 
      title: 'İktisadi ve İdari Bilimler Kurumsal Stajı', 
      company: 'ESİDER Üye Firmaları & İTO', 
      quota: '60 Öğrenci', 
      deadline: '01 Haziran 2026', 
      type: 'Kurumsal Staj',
      department: 'İşletme, Uluslararası Ticaret ve Lojistik, İktisat',
      requirements: '2., 3. veya 4. sınıf öğrencisi olmak'
    },
    { 
      id: 'int_p_4', 
      title: 'Sağlık Yönetimi & Klinik Destek Stajı', 
      company: 'Protokollü Şehir Hastaneleri & Medikal Merkezler', 
      quota: '40 Öğrenci', 
      deadline: '20 Mayıs 2026', 
      type: 'Klinik / Saha Stajı',
      department: 'Sağlık Yönetimi, Hemşirelik, Beslenme ve Diyetetik',
      requirements: '3. veya 4. sınıf öğrencisi olmak'
    }
  ];

  const content = (
    <div className="w-full flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* ─── DUAL TAB SWITCHER (Yetenek Havuzu vs Protokol Ağı) ─── */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1">
        <button
          onClick={() => setActiveNetworkTab('talent_pool')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeNetworkTab === 'talent_pool'
              ? (isCompany ? 'bg-[#0A2342] text-white shadow-md' : 'bg-[#990000] text-white shadow-md')
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users size={16} /> Öğrenci & Mezun Yetenek Havuzu ({allTalents.length})
        </button>

        <button
          onClick={() => setActiveNetworkTab('protocols')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeNetworkTab === 'protocols'
              ? (isCompany ? 'bg-[#0A2342] text-white shadow-md' : 'bg-[#990000] text-white shadow-md')
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck size={16} /> Resmî Protokol & Kurullar ({defaultParticipants.length})
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 1: ÖĞRENCİ & MEZUN YETENEK HAVUZU (COMPANY FOCUS)          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeNetworkTab === 'talent_pool' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Hero Banner with Corporate Theme */}
          <div className={`rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden ${bannerGradient}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/25 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-black uppercase tracking-wider text-amber-300 mb-3 shadow-xs">
                <Sparkles size={12} className="text-amber-300" /> İESÜ Kurumsal İstihdam & Staj Platformu
              </div>

              <h2 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">
                {isCompany ? 'İESÜ Kurumsal Yetenek Havuzu' : 'Öğrenci & Mezun Yetenek Ağı'}
              </h2>
              
              <p className="text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6 font-medium">
                İstanbul Esenyurt Üniversitesi'nin farklı fakülte ve bölümlerindeki yetenekli öğrencileri, stajyer adaylarını ve mezun profesyonelleri inceleyebilir; doğrudan mülakat veya iş birliği daveti gönderebilirsiniz.
              </p>

              {/* Quick Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-slate-300 block">Toplam Yetenek</span>
                  <span className="text-xl font-black text-white">{allTalents.length} Aday</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">Staj Arayanlar</span>
                  <span className="text-xl font-black text-emerald-300">
                    {allTalents.filter(t => t.type === 'student' && t.internshipStatus !== 'Tamamlandı').length} Öğrenci
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">Mezun Uzmanlar</span>
                  <span className="text-xl font-black text-amber-300">
                    {allTalents.filter(t => t.type === 'alumni').length} Mezun
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] uppercase font-bold text-sky-300 block">Yüksek GNO (3.5+)</span>
                  <span className="text-xl font-black text-sky-300">
                    {allTalents.filter(t => Number(t.gpa) >= 3.5).length} Derece
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={talentSearch}
                  onChange={(e) => setTalentSearch(e.target.value)}
                  placeholder="İsim, bölüm, teknoloji veya uzmanlık ara... (ör: React, Finans, Python, Havacılık)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                {talentSearch && (
                  <button 
                    onClick={() => setTalentSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Department Dropdown */}
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Tüm Bölümler ({uniqueDepartments.length})</option>
                {uniqueDepartments.map((dept, idx) => (
                  <option key={idx} value={dept}>{dept}</option>
                ))}
              </select>

              {/* GPA Filter */}
              <select
                value={minGpaFilter}
                onChange={(e) => setMinGpaFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Tüm Not Ortalamaları</option>
                <option value="3.5">3.50+ Üstün Başarı</option>
                <option value="3.0">3.00+ Başarılı</option>
              </select>
            </div>

            {/* Quick Status Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'Tüm Adaylar', count: allTalents.length },
                { id: 'student', label: 'Öğrenciler', count: allTalents.filter(t => t.type === 'student').length },
                { id: 'alumni', label: 'Mezunlar', count: allTalents.filter(t => t.type === 'alumni').length },
                { id: 'intern_seeking', label: 'Staj Arayanlar', count: allTalents.filter(t => t.type === 'student' && t.internshipStatus !== 'Tamamlandı').length }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setTalentRoleFilter(chip.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    talentRoleFilter === chip.id
                      ? (isCompany ? 'bg-[#0A2342] text-white shadow-xs' : 'bg-[#990000] text-white shadow-xs')
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{chip.label}</span>
                  <span className="text-[10px] opacity-75">({chip.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Talents Results Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Eşleşen Adaylar ({filteredTalents.length})
              </p>
              <span className="text-xs font-semibold text-slate-400">
                {isCompany ? 'Kurumsal İK Erişim Modu' : 'Üniversite Ekosistem Görünümü'}
              </span>
            </div>

            {filteredTalents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                  <Users size={28} />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Aradığınız kriterlere uygun aday bulunamadı</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Farklı bir arama terimi deneyebilir veya filtreleri sıfırlayarak tüm İESÜ adaylarını görüntüleyebilirsiniz.
                </p>
                <button
                  onClick={() => { setTalentSearch(''); setTalentRoleFilter('all'); setSelectedDeptFilter('all'); setMinGpaFilter('all'); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredTalents.map(talent => (
                  <div
                    key={talent.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Top Row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <SafeAvatar
                              name={talent.name}
                              src={talent.avatar}
                              size="lg"
                              rounded="rounded-2xl"
                            />
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              talent.type === 'alumni' ? 'bg-emerald-500' : 'bg-blue-600'
                            }`} title={talent.typeLabel} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 
                                onClick={() => handleViewTalentProfile(talent.id)}
                                className="font-black text-slate-900 text-sm hover:text-blue-700 transition cursor-pointer truncate"
                              >
                                {talent.name}
                              </h4>
                              <ShieldCheck size={14} className="text-blue-600 shrink-0" title="Doğrulanmış İESÜ Profili" />
                            </div>
                            <p className="text-xs font-bold text-slate-600 truncate mt-0.5">
                              {talent.department}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {talent.grade}
                            </p>
                          </div>
                        </div>

                        {/* GPA / Status Badge */}
                        <div className="text-right shrink-0">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-black border border-slate-200">
                            GNO: {talent.gpa}
                          </span>
                        </div>
                      </div>

                      {/* Status & Double Major Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap my-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          talent.type === 'alumni'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {talent.typeLabel}
                        </span>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                          {talent.internshipStatus}
                        </span>

                        {talent.doubleMajor && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            ÇAP: {talent.doubleMajor}
                          </span>
                        )}
                      </div>

                      {/* Skills Chips */}
                      {talent.skills && talent.skills.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {talent.skills.map((skill, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] font-semibold bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleViewTalentProfile(talent.id)}
                        className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                      >
                        <GraduationCap size={14} /> Profili İncele
                      </button>

                      <button
                        onClick={() => handleOpenDirectChatWithTalent(talent)}
                        className={`flex-1 py-2 px-3 ${primaryBtnClass} text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs`}
                      >
                        <MessageCircle size={14} /> İletişime Geç
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 2: RESMÎ PROTOKOL & KURULLAR AĞI                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeNetworkTab === 'protocols' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Hero Card */}
          <div className={`rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden ${bannerGradient}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/25 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-3 shadow-md">
                <ShieldCheck size={13} className="text-emerald-400" /> Resmî Üniversite Protokol Ekosistemi
              </div>
              
              <h2 className="text-2xl sm:text-[28px] font-black text-white mb-2 leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Akademik & Katılımcı Ağı
              </h2>
              
              <p className="text-white font-medium text-[13px] leading-relaxed mb-6 max-w-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                İstanbul Esenyurt Üniversitesi Rektörlüğü, fakülte dekanlıkları, sanayi odaları ve savunma sanayii ortaklığıyla akredite staj ve istihdam protokolü süreçleri.
              </p>

              {/* Internal Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-1">
                <button 
                  onClick={() => { setModalSearch(''); setActiveModal('participants'); }}
                  className={`flex items-center justify-between bg-white text-slate-900 hover:bg-slate-100 p-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider w-full shadow-md border border-white cursor-pointer group`}
                >
                  <span className="flex items-center gap-2"><Users size={16} className="text-[#990000]" /> Katılımcılar & Kurullar</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform text-slate-400" />
                </button>

                <button 
                  onClick={() => { setModalSearch(''); setActiveModal('companies'); }}
                  className="flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 p-3 rounded-xl transition-all text-white text-xs font-black uppercase tracking-wider w-full shadow-sm backdrop-blur-md cursor-pointer group"
                >
                  <span className="flex items-center gap-2"><Building2 size={16} className="text-amber-300" /> Sanayi Ortakları</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform text-white/70" />
                </button>

                <button 
                  onClick={() => { setModalSearch(''); setActiveModal('internships'); }}
                  className="flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 p-3 rounded-xl transition-all text-white text-xs font-black uppercase tracking-wider w-full shadow-sm backdrop-blur-md cursor-pointer group"
                >
                  <span className="flex items-center gap-2"><Briefcase size={16} className="text-emerald-300" /> Staj & Kontenjanlar</span>
                  <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform text-white/70" />
                </button>
              </div>
            </div>
          </div>

          {/* 1. RESMİ KURUL & KATILIMCILAR BÖLÜMÜ */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#990000]" />
                  Resmî Kurul & Protokol Katılımcıları ({defaultParticipants.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Yetkili kurullar, birim başkanları ve üniversite-sanayi protokol temsilcileri.</p>
              </div>
              <button 
                onClick={() => { setModalSearch(''); setActiveModal('participants'); }} 
                className="text-xs font-bold text-[#990000] hover:underline cursor-pointer shrink-0"
              >
                Tümünü Gör ({defaultParticipants.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {defaultParticipants.map(participant => (
                <div 
                  key={participant.id} 
                  onClick={() => setSelectedParticipantModal(participant)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-red-200 transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0 border border-red-100 font-black shadow-2xs group-hover:scale-105 transition-transform">
                      {participant.roleType === 'rector' ? <GraduationCap size={22} /> :
                       participant.roleType === 'career_center' ? <Award size={22} /> :
                       participant.roleType === 'industry' ? <Building2 size={22} /> :
                       <ShieldCheck size={22} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#990000] transition-colors truncate">
                          {participant.name}
                        </h4>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {participant.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5 truncate">
                        {participant.title} • {participant.unit}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                        {participant.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1 text-[#990000]">
                      <Info size={13} /> Protokol İnisiyatiflerini İncele
                    </span>
                    <span className="text-slate-400 group-hover:text-[#990000] group-hover:translate-x-0.5 transition-all">
                      Detay &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. RESMÎ SANAYİ & TEKNOLOJİ PROTOKOL ORTAKLARI (DEV KURUMLAR) */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <Building2 size={18} className="text-[#990000]" />
                  Resmî Protokollü Sanayi & Teknoloji Ortakları ({allCompanies.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">İESÜ öğrencilerine öncelikli kontenjan ve istihdam garantisi sunan akredite kurumlar.</p>
              </div>
              <button 
                onClick={() => { setModalSearch(''); setActiveModal('companies'); }} 
                className="text-xs font-bold text-[#990000] hover:underline cursor-pointer shrink-0"
              >
                Tüm Ortakları Gör
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {allCompanies.map(company => (
                <div 
                  key={company.id} 
                  onClick={() => setSelectedCompanyModal(company)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-red-200 transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={20} className="text-slate-600" />
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-[#990000] border border-red-200">
                        {company.openPositions ? `${company.openPositions} Kontenjan` : 'Protokollü'}
                      </span>
                    </div>

                    <h4 className="font-black text-gray-900 text-sm group-hover:text-[#990000] transition-colors truncate">
                      {company.name}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-500 truncate mt-0.5">
                      {company.sector}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium mt-1.5 line-clamp-2">
                      {company.scope || company.desc || 'Staj ve istihdam protokolü çerçevesinde akredite edilmiştir.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar size={12} /> {company.protocolDate || '2025-2027'}
                    </span>
                    <span className="text-[#990000] group-hover:translate-x-0.5 transition-transform">
                      Protokol Detayı &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. STAJ İMKÂNLARI & RESMÎ KONTENJAN HAVUZU */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <Briefcase size={18} className="text-[#990000]" />
                  Staj İmkânları & Protokol Kontenjanları ({defaultInternships.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Bölümlere göre ayrılmış zorunlu ve aday mühendislik staj tahsisleri.</p>
              </div>
              <button 
                onClick={() => { setModalSearch(''); setActiveModal('internships'); }} 
                className="text-xs font-bold text-[#990000] hover:underline cursor-pointer shrink-0"
              >
                Tümünü Listele
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {defaultInternships.map(internship => (
                <div 
                  key={internship.id}
                  onClick={() => setSelectedInternshipModal(internship)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-red-200 transition-all group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {internship.type}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> Son Başvuru: {internship.deadline}
                      </span>
                    </div>

                    <h4 className="font-black text-gray-900 text-sm sm:text-base group-hover:text-[#990000] transition-colors">
                      {internship.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      Ortaklar: <span className="text-slate-900 font-black">{internship.company}</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">
                      Uygun Bölümler: {internship.department}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-black text-[#990000] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                      Kontenjan: {internship.quota}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInternshipModal(internship);
                      }}
                      className="px-3 py-1.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Sparkles size={13} /> Başvur & İncele
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. DANIŞMAN AKADEMİK KADRO */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#990000]" />
                  Danışman Akademik Kadro ({networkAcademics.length})
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Bölüm başkanları ve staj koordinatörü öğretim üyeleri.</p>
              </div>
              {networkAcademics.length > 0 && (
                <button 
                  onClick={() => setShowAllAcademics((v) => !v)} 
                  className="text-xs font-bold text-[#990000] hover:underline cursor-pointer shrink-0"
                >
                  {showAllAcademics ? 'Daralt' : 'Tümünü Gör'}
                </button>
              )}
            </div>

            {networkAcademics.length === 0 ? (
              <div className="text-center p-6 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2.5">
                  <BookOpen size={22} className="text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-600 mb-0.5">Henüz akademik personel listelenmedi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {networkAcademics.slice(0, showAllAcademics ? networkAcademics.length : 4).map(academic => {
                  const isSelf = !academic.id || academic.id === 'self' || academic.id === 'me' || (effectiveCurrentUser && (
                    String(academic.id) === String(effectiveCurrentUser.id) ||
                    String(academic.id) === String(effectiveCurrentUser.uid) ||
                    (effectiveCurrentUser.name && academic.name && effectiveCurrentUser.name.trim().toLowerCase() === academic.name.trim().toLowerCase())
                  ));
                  const targetId = isSelf ? (effectiveCurrentUser?.id || academic.id) : academic.id;
                  return (
                    <div 
                      key={academic.id} 
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-red-200 transition-all group cursor-pointer flex items-center justify-between gap-3" 
                      onClick={() => handleViewTalentProfile(targetId)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <SafeAvatar 
                          name={academic.name} 
                          src={academic.avatar} 
                          isAdmin={false} 
                          size="md" 
                          rounded="rounded-2xl" 
                          className="w-11 h-11 shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#990000] transition-colors">{academic.name}</h4>
                          <p className="text-[11px] font-bold text-slate-500 truncate">{academic.title || 'Akademisyen'} • {academic.department}</p>
                          <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                            Staj Koordinatörü & Danışman
                          </span>
                        </div>
                      </div>
                      <button 
                        className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#990000] hover:text-white hover:border-[#990000] transition-colors cursor-pointer shrink-0" 
                        title="Mesaj Gönder" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (setSelectedUserId) setSelectedUserId(academic.id);
                          useAppStore.getState().setSelectedUserId?.(academic.id);
                          if (setView) setView('messaging');
                        }}
                      >
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ─── MODAL: KURUL & KATILIMCI DETAYI ─── */}
      {selectedParticipantModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-scale-up space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0 border border-red-100 font-black">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                    {selectedParticipantModal.status}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    {selectedParticipantModal.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">{selectedParticipantModal.title} • {selectedParticipantModal.unit}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedParticipantModal(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Görev & Protokol Tanımı</label>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedParticipantModal.desc}
                </p>
              </div>

              {selectedParticipantModal.initiatives && (
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Yürütülen Resmî İnisiyatifler</label>
                  <div className="space-y-1.5">
                    {selectedParticipantModal.initiatives.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-red-50/50 p-2 rounded-lg border border-red-100">
                        <CheckCircle2 size={14} className="text-[#990000] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedParticipantModal.email && (
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400" /> Resmî İletişim:</span>
                  <a href={`mailto:${selectedParticipantModal.email}`} className="text-[#990000] hover:underline font-black">{selectedParticipantModal.email}</a>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setSelectedParticipantModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  setSelectedParticipantModal(null);
                  if (setView) setView('messaging');
                }}
                className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle size={14} /> İletişime Geç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: SANAYİ PROTOKOL ORTAĞI DETAYI ─── */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-scale-up space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                  {selectedCompanyModal.logo ? (
                    <img src={selectedCompanyModal.logo} alt={selectedCompanyModal.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={24} className="text-slate-700" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block mb-1">
                    {selectedCompanyModal.badge || 'Resmî Protokol'}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                    {selectedCompanyModal.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">{selectedCompanyModal.sector}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCompanyModal(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Protokol Süresi</span>
                  <span className="font-black text-slate-800">{selectedCompanyModal.protocolDate || '2025-2028'}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Tahsis Kontenjan</span>
                  <span className="font-black text-[#990000]">{selectedCompanyModal.openPositions || 15} Öğrenci / Dönem</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Protokol Kapsamı</label>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedCompanyModal.desc || selectedCompanyModal.scope}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" /> Yerleşke / Tesis:</span>
                <span className="font-bold text-slate-800">{selectedCompanyModal.location}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setSelectedCompanyModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  setSelectedCompanyModal(null);
                  handleNavigateToJobs();
                }}
                className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Briefcase size={14} /> İlanları & Kontenjanları İncele
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: STAJ KONTENJANI DETAYI ─── */}
      {selectedInternshipModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-scale-up space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 inline-block mb-1">
                  {selectedInternshipModal.type}
                </span>
                <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                  {selectedInternshipModal.title}
                </h3>
                <p className="text-xs text-slate-600 font-bold mt-0.5">Kurumlar: {selectedInternshipModal.company}</p>
              </div>
              <button 
                onClick={() => setSelectedInternshipModal(null)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Ayrılan Kontenjan:</span>
                  <span className="font-black text-[#990000]">{selectedInternshipModal.quota}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Son Başvuru Tarihi:</span>
                  <span className="font-black text-slate-800">{selectedInternshipModal.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Hedef Bölümler:</span>
                  <span className="font-bold text-slate-800 text-right max-w-[240px]">{selectedInternshipModal.department}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">Başvuru Koşulları</label>
                <p className="text-slate-700 font-medium bg-red-50/40 p-3 rounded-xl border border-red-100 leading-relaxed">
                  {selectedInternshipModal.requirements || 'Öğrenci belgesi, transkript ve bölüm staj komisyonu uygunluk onayı aranmaktadır.'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setSelectedInternshipModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
              <button 
                onClick={() => {
                  setSelectedInternshipModal(null);
                  handleNavigateToJobs();
                }}
                className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} /> Yetenek Kapısı Üzerinden Başvur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── GENEL LİSTE MODALLARI (Tümünü Gör) ─── */}
      {activeModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-5 animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-[#990000] rounded-2xl border border-red-100">
                  {activeModal === 'companies' && <Building2 size={24} />}
                  {activeModal === 'participants' && <Users size={24} />}
                  {activeModal === 'internships' && <Briefcase size={24} />}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {activeModal === 'companies' && 'Resmî Protokollü Sanayi & Teknoloji Ortakları'}
                    {activeModal === 'participants' && 'Katılımcılar & Resmî Protokol Kurulları'}
                    {activeModal === 'internships' && 'Staj İmkânları ve Kontenjan Havuzu'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">İstanbul Esenyurt Üniversitesi Kariyer & Protokol Ağı</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search within Modal */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Listede arama yapın..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#990000]"
              />
            </div>

            {/* Modal Body: Participants */}
            {activeModal === 'participants' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {defaultParticipants
                  .filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()) || p.title.toLowerCase().includes(modalSearch.toLowerCase()) || p.unit.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => {
                        setActiveModal(null);
                        setSelectedParticipantModal(p);
                      }}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-red-50/30 hover:border-red-200 transition cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#990000] transition-colors">{p.name}</h4>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{p.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{p.title} • {p.unit}</p>
                      </div>
                      <span className="text-xs font-bold text-[#990000] shrink-0">Detay &rarr;</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Modal Body: Companies */}
            {activeModal === 'companies' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {allCompanies
                  .filter(c => c.name.toLowerCase().includes(modalSearch.toLowerCase()) || (c.sector || '').toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        setActiveModal(null);
                        setSelectedCompanyModal(c);
                      }}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-red-50/30 hover:border-red-200 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {c.logo ? <img src={c.logo} alt={c.name} className="w-full h-full object-cover" /> : <Building2 size={18} className="text-slate-600" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#990000] transition-colors">{c.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{c.sector} • {c.location}</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#990000] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 shrink-0">
                        {c.openPositions ? `${c.openPositions} Kontenjan` : 'İncele'}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* Modal Body: Internships */}
            {activeModal === 'internships' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {defaultInternships
                  .filter(i => i.title.toLowerCase().includes(modalSearch.toLowerCase()) || i.company.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(i => (
                    <div key={i.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          {i.type}
                        </span>
                        <span className="text-xs font-bold text-slate-400">Son Başvuru: {i.deadline}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900">{i.title}</h4>
                      <p className="text-xs text-slate-600 font-medium flex items-center justify-between">
                        <span>Anlaşmalı Firmalar: <strong>{i.company}</strong></span>
                        <span className="text-[#990000] font-black">Kontenjan: {i.quota}</span>
                      </p>
                      <button 
                        onClick={() => {
                          setActiveModal(null);
                          handleNavigateToJobs();
                        }}
                        className="w-full mt-2 py-2.5 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Sparkles size={14} /> Yetenek Kapısı Üzerinden Başvur
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  if (embedded || hideHeader) {
    return content;
  }

  const pageTitle = (activeNetworkTab === 'talent_pool' && isCompany)
    ? 'İESÜ Kurumsal Yetenek Havuzu'
    : (activeNetworkTab === 'talent_pool')
    ? 'Öğrenci & Mezun Yetenek Ağı'
    : 'Akademik & Katılımcı Protokol Ağı';

  const pageSubtitle = (activeNetworkTab === 'talent_pool')
    ? 'Öğrenci & Mezun Aday Veritabanı'
    : 'Resmî Kurullar & İş Birlikleri';

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col pb-40">
      {/* ─── CORPORATE STICKY TOP NAVBAR ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Sol: Resmî Kurumsal Logo + Üniversite & Koordinatörlük Unvanı (Tıklanınca Geri Döner) */}
          <div 
            role="button" 
            tabIndex={0} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} 
            onClick={() => setView ? setView(homeView) : null} 
            className="flex items-center gap-3 cursor-pointer group"
            title="Geri Dön"
          >
            <Logo 
              color={isAcademic ? 'indigo' : isAlumni ? 'emerald' : isCompany ? 'blue' : isAdmin ? 'amber' : 'red'} 
              size="sm"
              className="hover:scale-105 transition-transform shrink-0" 
            />
            <div className="hidden sm:block text-left">
              <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${
                isAcademic ? 'text-indigo-900' :
                isAlumni ? 'text-emerald-800' :
                isCompany ? 'text-blue-900' :
                isAdmin ? 'text-amber-800' :
                'text-[#990000]'
              }`}>
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-bold text-gray-500 tracking-wider">
                Kariyer Geliştirme Koordinatörlüğü
              </p>
            </div>
          </div>

          {/* Orta: Sayfa & Dal Rozeti (Pill Badge) */}
          <div className="hidden md:flex items-center justify-center pointer-events-none">
            <div className={`px-4 py-1.5 rounded-full text-white font-black text-xs shadow-md border border-white/40 flex items-center gap-2 tracking-wider uppercase whitespace-nowrap shrink-0 ${
              isAcademic ? 'bg-gradient-to-r from-purple-950 via-[#4C1D95] to-indigo-900 border-purple-400/40' :
              isAlumni ? 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 border-emerald-400/40' :
              isCompany ? 'bg-gradient-to-r from-blue-950 via-[#1e3a5f] to-slate-900 border-blue-400/40' :
              isAdmin ? 'bg-gradient-to-r from-amber-950 via-amber-800 to-yellow-900 border-amber-400/40' :
              'bg-gradient-to-r from-red-950 via-[#990000] to-rose-900 border-red-400/40'
            }`}>
              <span className={`w-2 h-2 rounded-full shrink-0 ${isAcademic ? 'bg-amber-400' : 'bg-white'} animate-pulse`} />
              {isAcademic ? '🏛️ ' : isAlumni ? '🎓 ' : isCompany ? '🏢 ' : isAdmin ? '👑 ' : '🤝 '}
              {pageTitle}
            </div>
          </div>

          {/* Sağ: Profil Menüsü */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <TopProfileMenu 
              currentUser={currentUser} 
              userRole={effectiveRole} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              currentView="career_network" 
            />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
        {content}
      </main>

      {/* Persistent Bottom Floating Dock */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId} 
        userRole={effectiveRole} 
        activeTab="network"
      />
    </div>
  );
}
