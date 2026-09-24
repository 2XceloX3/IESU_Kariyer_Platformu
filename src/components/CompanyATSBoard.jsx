import React, { useState, useMemo } from 'react';
import { 
  Briefcase, Search, Plus, MoreHorizontal, ShieldCheck, 
  MessageSquare, FileText, Clock, X, Phone, Mail, GraduationCap, CheckCircle2,
  Users, Download, LayoutGrid, List, MessageCircle, ExternalLink, Printer,
  Sparkles, Check, ChevronDown, Award, TrendingUp, Building2, Home
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import SafeAvatar from './shared/SafeAvatar';
import Logo from './Logo';

const INITIAL_COLUMNS = [
  { id: 'new', title: 'Yeni Başvuru', color: 'bg-blue-50 text-blue-900 border-blue-200' },
  { id: 'review', title: 'İnceleniyor', color: 'bg-amber-50 text-amber-900 border-amber-200' },
  { id: 'interview', title: 'Mülakat', color: 'bg-purple-50 text-purple-900 border-purple-200' },
  { id: 'offer', title: 'Teklif / Kabul', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
  { id: 'rejected', title: 'Reddedildi', color: 'bg-rose-50 text-rose-900 border-rose-200' }
];

const INITIAL_APPLICANTS = {
  'new': [
    { 
      id: 'app-1', 
      name: 'Ahmet Yılmaz', 
      role: 'Frontend Developer', 
      uni: 'İstanbul Esenyurt Üniversitesi', 
      dept: 'Bilgisayar Mühendisliği', 
      gpa: '3.75',
      date: 'Bugün', 
      avatar: 'https://ui-avatars.com/api/?name=AY&background=0A2342&color=fff', 
      match: 94, 
      coverLetter: 'React, Next.js ve Tailwind CSS ile kampüs içi ve freelance projeler geliştirdim. Firmanızın dinamik mühendislik ekibinde yer almak istiyorum.', 
      email: 'ahmet.yilmaz@ogr.esenyurt.edu.tr', 
      phone: '0532 111 2233',
      experiences: [
        { role: 'Stajyer Web Geliştirici', company: 'İESÜ BİDB', date: '2025 - 2026' }
      ],
      skills: ['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'Next.js', 'Git']
    },
    { 
      id: 'app-2', 
      name: 'Ayşe Demir', 
      role: 'UI/UX Tasarımcı', 
      uni: 'İstanbul Esenyurt Üniversitesi', 
      dept: 'Görsel İletişim Tasarımı', 
      gpa: '3.82',
      date: 'Dün', 
      avatar: 'https://ui-avatars.com/api/?name=AD&background=0A2342&color=fff', 
      match: 89, 
      coverLetter: 'Figma ile kullanıcı odaklı tasarım sistemleri ve interaktif prototipler geliştiriyorum. Tasarım ve ürün ekibinize katkı sağlayabilirim.', 
      email: 'ayse.demir@ogr.esenyurt.edu.tr', 
      phone: '0533 222 3344',
      experiences: [
        { role: 'UI/UX Stajyeri', company: 'Tasarım Ofisi', date: '2025' }
      ],
      skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping', 'Adobe XD']
    }
  ],
  'review': [
    { 
      id: 'app-3', 
      name: 'Mehmet Can', 
      role: 'Data Scientist', 
      uni: 'İstanbul Esenyurt Üniversitesi', 
      dept: 'Yazılım Mühendisliği', 
      gpa: '3.68',
      date: '2 gün önce', 
      avatar: 'https://ui-avatars.com/api/?name=MC&background=0A2342&color=fff', 
      match: 86, 
      coverLetter: 'Python, SQL ve Pandas ile veri madenciliği ve tahminleme modelleri üzerinde çalışıyorum. TÜBİTAK 2209-A projesi yürüttüm.', 
      email: 'mehmet.can@ogr.esenyurt.edu.tr', 
      phone: '0534 333 4455',
      experiences: [
        { role: 'Veri Analitiği Stajyeri', company: 'Teknopark Ar-Ge', date: '2025' }
      ],
      skills: ['Python', 'Pandas & NumPy', 'SQL', 'Scikit-Learn', 'Power BI']
    }
  ],
  'interview': [
    { 
      id: 'app-4', 
      name: 'Zeynep Kaya', 
      role: 'Backend Engineer', 
      uni: 'İstanbul Esenyurt Üniversitesi', 
      dept: 'Bilgisayar Mühendisliği', 
      gpa: '3.91',
      date: 'Geçen hafta', 
      avatar: 'https://ui-avatars.com/api/?name=ZK&background=0A2342&color=fff', 
      match: 96, 
      coverLetter: 'Node.js, PostgreSQL ve mikroservis mimarileri üzerine yoğunlaştım. Yüksek trafikli sistemlerde ölçeklenebilir backend çözümleri üretiyorum.', 
      email: 'zeynep.kaya@ogr.esenyurt.edu.tr', 
      phone: '0535 444 5566',
      experiences: [
        { role: 'Backend Geliştirici Stajyeri', company: 'Fintech Çözümleri', date: '2025' }
      ],
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Redis']
    }
  ],
  'offer': [
    { 
      id: 'app-5', 
      name: 'Can Özkan', 
      role: 'Product Manager Adayı', 
      uni: 'İstanbul Esenyurt Üniversitesi', 
      dept: 'İşletme', 
      gpa: '3.70',
      date: 'Geçen hafta', 
      avatar: 'https://ui-avatars.com/api/?name=CO&background=0A2342&color=fff', 
      match: 91, 
      coverLetter: 'Agile/Scrum metodolojileri ve ürün yaşam döngüsü yönetiminde aktifiz. Üniversite kulüp liderliği deneyimim bulunmaktadır.', 
      email: 'can.ozkan@mezun.esenyurt.edu.tr', 
      phone: '0536 555 6677',
      experiences: [
        { role: 'Proje Asistanı', company: 'Girişimcilik Merkezi', date: '2024 - 2025' }
      ],
      skills: ['Jira', 'Agile/Scrum', 'Pazar Analizi', 'KPI Takibi', 'Product Discovery']
    }
  ],
  'rejected': [
    { 
      id: 'app-6', 
      name: 'Elif Şahin', 
      role: 'Frontend Developer', 
      uni: 'İstanbul Esenyurt Üniversitesi', 
      dept: 'Bilişim Teknolojileri MYO', 
      gpa: '3.10',
      date: '2 hafta önce', 
      avatar: 'https://ui-avatars.com/api/?name=ES&background=0A2342&color=fff', 
      match: 55, 
      coverLetter: 'HTML ve temel CSS bilgim var, staj ortamında kendimi geliştirmek istiyorum.', 
      email: 'elif.sahin@ogr.esenyurt.edu.tr', 
      phone: '0537 666 7788',
      experiences: [],
      skills: ['HTML5', 'CSS3', 'Temel JS']
    }
  ]
};

function statusToColumnId(status) {
  if (!status) return 'new';
  const s = status.toLowerCase();
  if (s.includes('yeni') || s.includes('bekle') || s === 'new') return 'new';
  if (s.includes('incele') || s === 'review') return 'review';
  if (s.includes('mülakat') || s === 'interview') return 'interview';
  if (s.includes('teklif') || s.includes('kabul') || s === 'offer') return 'offer';
  if (s.includes('red') || s === 'rejected') return 'rejected';
  return 'new';
}

function columnIdToStatus(colId) {
  switch (colId) {
    case 'new': return 'Beklemede';
    case 'review': return 'İnceleniyor';
    case 'interview': return 'Mülakata Çağrıldı';
    case 'offer': return 'Kabul Edildi';
    case 'rejected': return 'Reddedildi';
    default: return 'Beklemede';
  }
}

export default function CompanyATSBoard({ setView, currentUser: propsCurrentUser }) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const currentUser = propsCurrentUser || storeCurrentUser;

  const [columns] = useState(INITIAL_COLUMNS);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [deptFilter, setDeptFilter] = useState('Tümü');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Connect to Zustand applications store for real-time applications
  const applications = useAppStore(state => state.applications) || [];
  const setApplications = useAppStore(state => state.setApplications);

  // Local overrides for initial static mock applicants (tracking their dragged moves)
  const [mockApplicants, setMockApplicants] = useState(INITIAL_APPLICANTS);

  // Combine static mock candidates with real-time Zustand applications
  const boardApplicants = useMemo(() => {
    const combined = {
      new: [...(mockApplicants.new || [])],
      review: [...(mockApplicants.review || [])],
      interview: [...(mockApplicants.interview || [])],
      offer: [...(mockApplicants.offer || [])],
      rejected: [...(mockApplicants.rejected || [])]
    };

    // Append applications from Zustand store
    applications.forEach(app => {
      const colId = statusToColumnId(app.status);
      const formattedApp = {
        id: app.id,
        name: app.applicantName || 'Öğrenci / Mezun',
        role: app.jobTitle || 'Açık Pozisyon Başvurusu',
        uni: 'İstanbul Esenyurt Üniversitesi',
        dept: app.applicantDept || 'Üniversite Adayı',
        gpa: app.gpa || '3.70',
        date: app.date || 'Bugün',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName || 'A')}&background=0A2342&color=fff`,
        match: app.match || 92,
        coverLetter: app.coverLetter || 'İlanınızla yakından ilgileniyorum.',
        email: app.applicantEmail || 'aday@esenyurt.edu.tr',
        phone: app.applicantPhone || '0555 000 0000',
        cvType: app.cvType || 'KGM Akredite İESÜ Dijital CV',
        isStoreApp: true,
        company: app.company,
        rawStatus: app.status,
        experiences: [
          { role: 'Stajyer / Proje Üyesi', company: 'İESÜ Kampüs İçi', date: '2025' }
        ],
        skills: ['İletişim', 'Takım Çalışması', 'Teknik Yetkinlik']
      };
      if (combined[colId]) {
        combined[colId].unshift(formattedApp);
      }
    });

    return combined;
  }, [applications, mockApplicants]);

  // Flatten all applicants for list view and metrics
  const allApplicants = useMemo(() => {
    return [
      ...(boardApplicants.new || []),
      ...(boardApplicants.review || []),
      ...(boardApplicants.interview || []),
      ...(boardApplicants.offer || []),
      ...(boardApplicants.rejected || [])
    ];
  }, [boardApplicants]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set(allApplicants.map(a => a.dept).filter(Boolean));
    return ['Tümü', ...Array.from(set)];
  }, [allApplicants]);

  // Filtered applicants for List view
  const filteredApplicantsList = useMemo(() => {
    return allApplicants.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.dept && app.dept.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const colId = statusToColumnId(app.rawStatus || app.status);
      const appStatus = columnIdToStatus(colId);
      const matchesStatus = statusFilter === 'Tümü' || appStatus === statusFilter || app.rawStatus === statusFilter;
      const matchesDept = deptFilter === 'Tümü' || app.dept === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [allApplicants, searchQuery, statusFilter, deptFilter]);

  // Drag and drop states
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedSourceCol, setDraggedSourceCol] = useState(null);

  const handleDragStart = (e, item, sourceColId) => {
    setDraggedItem(item);
    setDraggedSourceCol(sourceColId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDraggedSourceCol(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const updateCandidateStatus = (item, targetColId) => {
    const newStatus = columnIdToStatus(targetColId);

    if (item.isStoreApp) {
      setApplications(prev => (prev || []).map(a => a.id === item.id ? { ...a, status: newStatus } : a));
    } else {
      setMockApplicants(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(col => {
          next[col] = next[col].filter(a => a.id !== item.id);
        });
        next[targetColId] = [item, ...(next[targetColId] || [])];
        return next;
      });
    }

    if (window.toast) {
      window.toast.success(`${item.name} adlı adayın durumu "${newStatus}" olarak güncellendi.`);
    }
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedItem || draggedSourceCol === targetColId) return;
    updateCandidateStatus(draggedItem, targetColId);
  };

  const moveApplicant = (item, _sourceColId, targetColId) => {
    updateCandidateStatus(item, targetColId);
  };

  // Open Chat in Bottom-Right Widget
  const handleOpenCandidateChat = (candidate) => {
    window.dispatchEvent(new CustomEvent('iesu_open_chat', {
      detail: {
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAvatar: candidate.avatar,
        candidateDept: candidate.dept,
        candidateRole: candidate.role,
        initialMessage: `Merhaba ${candidate.name}, "${candidate.role}" pozisyonu başvurunuzu inceledik. Süreç hakkında sizinle görüşmek isteriz.`
      }
    }));
  };

  // CSV Export Function
  const handleExportCSV = () => {
    let csv = "data:text/csv;charset=utf-8,\uFEFF";
    csv += "İSTANBUL ESENYURT ÜNİVERSİTESİ - ADAY BAŞVURULARI & ATS RAPORU\n";
    csv += `Firma: ${currentUser?.name || 'Kurumsal Firma'}\n`;
    csv += `Tarih: ${new Date().toLocaleDateString('tr-TR')}\n\n`;
    csv += "Aday Adı;Bölüm;Başvurulan Pozisyon;Aşama;Uyum Skoru;E-Posta;Telefon;Tarih\n";

    allApplicants.forEach(app => {
      const colId = statusToColumnId(app.rawStatus || app.status);
      const stage = columnIdToStatus(colId);
      csv += `"${app.name}";"${app.dept}";"${app.role}";"${stage}";"%${app.match}";"${app.email}";"${app.phone}";"${app.date}"\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IESU_ATS_Aday_Havuzu_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (window.toast) window.toast.success("Aday havuzu Excel (.CSV) olarak indirildi.");
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-24 font-sans">
      {/* ─── 1. KURUMSAL ÜST NAVBAR (INSTITUTIONAL HEADER) ─── */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Sol: Üniversite Logo & Kurumsal Başlık */}
          <div 
            onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setView) setView('company');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
            title="Firma Paneline Dön"
          >
            <Logo color="blue" className="h-9 w-auto shrink-0 hover:scale-105 transition-transform" />
            <div className="text-left min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight truncate">
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider truncate">
                Kariyer Geliştirme Koordinatörlüğü • Kurumsal ATS Masası
              </p>
            </div>
          </div>

          {/* Sağ: Kurumsal Firma Etiketi & Üst Aksiyonlar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <Building2 size={14} className="text-blue-900 shrink-0" />
              <span className="font-black text-slate-900">{currentUser?.name || 'Kurumsal Firma'}</span>
            </span>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
              title="Aday listesini CSV olarak indir"
            >
              <Download size={14} className="text-blue-900" />
              <span className="hidden sm:inline">Excel (.CSV)</span>
            </button>

            <button 
              onClick={() => setView('create_job')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white rounded-xl text-xs font-black transition shadow-xs cursor-pointer"
            >
              <Plus size={15} />
              <span>Yeni İlan</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. ANA KURUMSAL HERO BANNER (GECE SAFİRİ #0A2342) ─── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-gradient-to-r from-slate-950 via-[#0A2342] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 border border-blue-400/40 text-blue-200">
                  Resmî ATS Portalı
                </span>
                <span className="text-xs text-blue-200/80 font-medium">• Gerçek Zamanlı Aday Akışı</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                {currentUser?.name || 'Kurumsal Firma'} — İlan Başvuruları & ATS Aday Havuzu
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 font-medium leading-relaxed">
                Üniversitemiz Kariyer Geliştirme Koordinatörlüğü onaylı öğrenci ve mezun başvurularını inceleyebilir, aşamalarını güncelleyebilir ve sağ alttaki panelle doğrudan iletişime geçebilirsiniz.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-right">
                <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Aktif Aday Havuzu</p>
                <p className="text-2xl font-black text-white leading-none mt-0.5">{allApplicants.length} Aday</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-600/30 text-blue-200 flex items-center justify-center font-black border border-blue-400/30">
                <Users size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. METRİK İSTATİSTİK KARTLARI (5 STAT CARDS) ─── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Toplam Başvuru</span>
              <Briefcase size={16} className="text-blue-900" />
            </div>
            <p className="text-2xl font-black text-slate-900">{allApplicants.length}</p>
            <p className="text-[10px] text-slate-500 font-bold mt-0.5">Tüm Açık Pozisyonlar</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">İnceleniyor</span>
              <Clock size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-700">{(boardApplicants.review || []).length}</p>
            <p className="text-[10px] text-amber-700/80 font-bold mt-0.5">Ön Değerlendirme</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Mülakata Çağrıldı</span>
              <Users size={16} className="text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-700">{(boardApplicants.interview || []).length}</p>
            <p className="text-[10px] text-purple-700/80 font-bold mt-0.5">Görüşme Aşaması</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">İletişime Geçildi</span>
              <MessageSquare size={16} className="text-sky-600" />
            </div>
            <p className="text-2xl font-black text-sky-700">
              {allApplicants.filter(a => a.status === 'İletişime Geçildi' || a.rawStatus === 'İletişime Geçildi' || a.companyContacted).length}
            </p>
            <p className="text-[10px] text-sky-700/80 font-bold mt-0.5">Mesaj İletilen Adaylar</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider">Kabul Edildi</span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700">{(boardApplicants.offer || []).length}</p>
            <p className="text-[10px] text-emerald-700/80 font-bold mt-0.5">Teklif & Onay</p>
          </div>

        </div>
      </div>

      {/* ─── 4. ARAMA, FİLTRELER & GÖRÜNÜM DEĞİŞTİRİCİ TOOLBAR ─── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Sol: Arama ve Bölüm Filtresi */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Aday adı, pozisyon, bölüm veya e-posta ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-900 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0">Bölüm:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sağ: Statü Hapları & Görünüm Switcher */}
          <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
            {/* Status Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {['Tümü', 'Beklemede', 'İnceleniyor', 'Mülakata Çağrıldı', 'Kabul Edildi', 'Reddedildi'].map(pill => (
                <button
                  key={pill}
                  onClick={() => setStatusFilter(pill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    statusFilter === pill
                      ? 'bg-blue-900 text-white shadow-2xs font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* View Mode Toggle: Kanban vs List */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white text-blue-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List size={14} />
                <span>Liste</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ─── 5. ANA İÇERİK GÖRÜNÜMÜ: KANBAN VEYA LİSTE ─── */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6">
        {viewMode === 'kanban' ? (
          // ── KANBAN PANOSU (SÜRÜKLE-BIRAK) ──
          <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar min-h-[calc(100vh-380px)]">
            {columns.map(column => {
              const columnApps = (boardApplicants[column.id] || []).filter(app => {
                const matchesSearch = 
                  app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (app.dept && app.dept.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesDept = deptFilter === 'Tümü' || app.dept === deptFilter;
                const colStatus = columnIdToStatus(column.id);
                const matchesStatus = statusFilter === 'Tümü' || colStatus === statusFilter;
                return matchesSearch && matchesDept && matchesStatus;
              });

              return (
                <div 
                  key={column.id} 
                  className="flex-shrink-0 w-[330px] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  {/* Column Header */}
                  <div className={`p-4 border-b flex justify-between items-center ${column.color}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-black text-xs uppercase tracking-wider truncate">
                        {column.title}
                      </h3>
                      <span className="bg-white/90 text-slate-800 px-2 py-0.5 rounded-full text-[11px] font-black shadow-2xs shrink-0">
                        {columnApps.length}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">Aşama</span>
                  </div>
                  
                  {/* Column Body */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-slate-50/50">
                    {columnApps.map(app => (
                      <div 
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app, column.id)}
                        onDragEnd={handleDragEnd}
                        className="bg-white p-4 rounded-2xl shadow-2xs border border-slate-200/80 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-blue-300 transition-all space-y-3 relative group"
                      >
                        {/* Header: Avatar, Name, Dept */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <SafeAvatar name={app.name} src={app.avatar} size="md" className="shrink-0 border border-slate-100" />
                            <div className="min-w-0">
                              <h4 className="font-black text-xs text-slate-900 leading-tight flex items-center gap-1 truncate">
                                {app.name}
                                <ShieldCheck size={14} className="text-blue-900 shrink-0" title="İESÜ Doğrulanmış Öğrenci" />
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{app.dept}</p>
                            </div>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                            app.match >= 90 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            app.match >= 75 ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            %{app.match} Uyum
                          </span>
                        </div>
                        
                        {/* Role & Date */}
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-blue-950 bg-blue-50/80 px-2.5 py-1 rounded-xl inline-block max-w-full truncate border border-blue-100">
                            {app.role}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                            <span className="flex items-center gap-1"><Clock size={11} /> {app.date}</span>
                            <span>{app.phone}</span>
                          </div>
                        </div>

                        {/* Cover Letter Snippet */}
                        {app.coverLetter && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
                            "{app.coverLetter}"
                          </p>
                        )}

                        {/* Action Buttons: CV İncele & Mesaj Gönder */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button 
                            onClick={() => setSelectedCandidate(app)}
                            className="flex-1 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText size={13} /> CV İncele
                          </button>
                          
                          {/* DIRECT MESAJ GÖNDER BUTTON -> DISPATCHES IESU_OPEN_CHAT */}
                          <button 
                            onClick={() => handleOpenCandidateChat(app)}
                            className="flex-1 py-1.5 text-xs font-black text-white bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                            title="Adaya sağ alttaki kutudan mesaj gönder"
                          >
                            <MessageCircle size={13} /> Mesaj Gönder
                          </button>
                        </div>

                        {/* Quick Mover Dropdown on Card */}
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold">Aşama Değiştir:</span>
                          <div className="flex items-center gap-1">
                            {column.id !== 'review' && (
                              <button onClick={() => moveApplicant(app, column.id, 'review')} className="hover:text-amber-700 font-bold px-1" title="İnceleme'ye Taşı">İnceleme'ye</button>
                            )}
                            {column.id !== 'interview' && (
                              <button onClick={() => moveApplicant(app, column.id, 'interview')} className="hover:text-purple-700 font-bold px-1" title="Mülakat'a Taşı">Mülakat</button>
                            )}
                            {column.id !== 'offer' && (
                              <button onClick={() => moveApplicant(app, column.id, 'offer')} className="hover:text-emerald-700 font-bold px-1" title="Kabul'e Taşı">Kabul</button>
                            )}
                            {column.id !== 'rejected' && (
                              <button onClick={() => moveApplicant(app, column.id, 'rejected')} className="hover:text-rose-700 font-bold px-1" title="Reddet">Red</button>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                    
                    {columnApps.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-xs font-bold text-slate-400 p-4 text-center">
                        <span>Aday bulunmuyor</span>
                        <span className="text-[10px] font-medium text-slate-300 mt-1">Kartı buraya sürükleyin</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // ── DETAYLI LİSTE / TABLO GÖRÜNÜMÜ ──
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Aday Değerlendirme & Başvuru Listesi ({filteredApplicantsList.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">Doğrudan Durum ve İletişim Yönetimi</span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredApplicantsList.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Users size={36} className="mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="font-bold text-sm text-slate-700">Aday Başvurusu Bulunamadı</p>
                  <p className="text-xs text-slate-400 mt-1">Arama terimlerinizi veya filtreleri temizlemeyi deneyin.</p>
                </div>
              ) : (
                filteredApplicantsList.map((app) => {
                  const colId = statusToColumnId(app.rawStatus || app.status);
                  const stage = columnIdToStatus(colId);

                  return (
                    <div key={app.id} className="p-5 hover:bg-blue-50/20 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Aday Bilgisi & Pozisyon */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <SafeAvatar name={app.name} src={app.avatar} size="lg" className="shrink-0 border border-slate-200" />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-black text-sm text-slate-900 leading-tight flex items-center gap-1">
                              {app.name}
                              <ShieldCheck size={15} className="text-blue-900 shrink-0" />
                            </h4>
                            <span className="bg-blue-50 text-blue-900 text-[11px] font-bold px-2 py-0.5 rounded-md border border-blue-200">
                              {app.dept}
                            </span>
                            <span className="text-[11px] font-bold text-slate-500">
                              GPA: <strong className="text-slate-800">{app.gpa || '3.70'}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                            <span className="font-bold text-slate-900">Pozisyon: <span className="text-blue-900">{app.role}</span></span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {app.email}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {app.phone}</span>
                            <span>•</span>
                            <span className="text-slate-400"><Clock size={12} className="inline mr-0.5" /> {app.date}</span>
                          </div>

                          {app.coverLetter && (
                            <p className="text-xs text-slate-500 italic line-clamp-1 mt-1 max-w-2xl">
                              "{app.coverLetter}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Statü, Uyum Skoru & Aksiyon Butonları */}
                      <div className="flex items-center gap-3 shrink-0 flex-wrap justify-between lg:justify-end">
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border shadow-2xs ${
                            stage === 'Kabul Edildi' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                            stage === 'Mülakata Çağrıldı' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                            stage === 'İnceleniyor' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                            stage === 'Reddedildi' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                            'bg-blue-50 text-blue-800 border-blue-300'
                          }`}>
                            {stage}
                          </span>
                          <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">
                            AI Uyum: %{app.match}
                          </span>
                        </div>

                        {/* Aksiyonlar */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCandidate(app)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText size={14} /> CV İncele
                          </button>

                          {/* MESAJ GÖNDER BUTONU -> DİREKT SAĞ ALT WIDGET'I AÇAR */}
                          <button
                            onClick={() => handleOpenCandidateChat(app)}
                            className="px-3.5 py-2 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <MessageCircle size={14} /> Mesaj Gönder
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── 6. AKREDİTE RESMÎ A4 DİJİTAL CV İNCELEME MODALI ─── */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={() => setSelectedCandidate(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-[#0A2342] to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-blue-900/40">
              <div className="flex items-center gap-3">
                <SafeAvatar name={selectedCandidate.name} src={selectedCandidate.avatar} size="lg" className="border-2 border-white/40" />
                <div>
                  <h3 className="font-black text-base text-white flex items-center gap-1.5">
                    {selectedCandidate.name}
                    <ShieldCheck size={18} className="text-blue-300" />
                  </h3>
                  <p className="text-xs text-blue-200/90 font-bold">{selectedCandidate.dept} • {selectedCandidate.uni}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white" 
                  title="Yazdır"
                >
                  <Printer size={16} />
                </button>
                <button 
                  onClick={() => setSelectedCandidate(null)} 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition text-white cursor-pointer font-bold"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Style CV */}
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 text-slate-800">
              
              {/* Başvurulan Pozisyon & Uyum Skoru */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-900 tracking-wider">Başvurulan Pozisyon</span>
                  <p className="font-black text-base text-slate-900 mt-0.5">{selectedCandidate.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Aday Uyum Skoru</span>
                  <p className="font-black text-lg text-emerald-700 mt-0.5">%{selectedCandidate.match}</p>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail size={14} className="text-blue-900 shrink-0" />
                  <span className="truncate font-bold">{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={14} className="text-blue-900 shrink-0" />
                  <span className="font-bold">{selectedCandidate.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 col-span-2">
                  <GraduationCap size={14} className="text-blue-900 shrink-0" />
                  <span className="font-bold">{selectedCandidate.uni} — Not Ortalaması (GPA): {selectedCandidate.gpa || '3.75'}</span>
                </div>
              </div>

              {/* Ön Yazı */}
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Ön Yazı & Motivasyon</span>
                <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-medium">
                  {selectedCandidate.coverLetter}
                </p>
              </div>

              {/* Deneyimler */}
              {selectedCandidate.experiences && selectedCandidate.experiences.length > 0 && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">Deneyim & Staj Geçmişi</span>
                  <div className="space-y-2">
                    {selectedCandidate.experiences.map((exp, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-black text-slate-900">{exp.role}</p>
                          <p className="text-slate-500 font-medium">{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{exp.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beceriler & Yetkinlikler */}
              {selectedCandidate.skills && (
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Teknik & Kişisel Beceriler</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Doğrulama Damgası */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü Akredite Dijital CV</span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button 
                onClick={() => {
                  const cand = selectedCandidate;
                  setSelectedCandidate(null);
                  handleOpenCandidateChat(cand);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <MessageCircle size={15} /> Mesaj Gönder (Sağ Alt Panel)
              </button>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    updateCandidateStatus(selectedCandidate, 'rejected');
                    setSelectedCandidate(null);
                  }}
                  className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Reddet
                </button>
                <button 
                  onClick={() => {
                    updateCandidateStatus(selectedCandidate, 'interview');
                    const cand = selectedCandidate;
                    setSelectedCandidate(null);
                    handleOpenCandidateChat(cand);
                  }}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black transition shadow-xs cursor-pointer"
                >
                  Mülakata Çağır & Mesaj At
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─── 8. KURUMSAL FİRMA ALT NAVİGASYON DOCK'U (ALT PANEL & FİRMA PANELİNE DÖNÜŞ) ─── */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[45] animate-fade-in-up w-[95%] max-w-[420px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-blue-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(10,35,66,0.22)] flex items-center justify-between px-4 text-slate-800">
          
          {/* 1. FİRMA PANELİNE / KURUMSAL AKIŞA DÖNÜŞ (ANA SAYFA BUTONU - İSİMSİZ, TEMİZ İKON) */}
          <button 
            onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setView) setView('company');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="p-2.5 rounded-full bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white shadow-md shadow-blue-950/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
            title="Kurumsal Akış & Ana Sayfaya Dön"
          >
            <Home size={22} strokeWidth={2.2} />
          </button>
          
          {/* 2. ATS GÖRÜNÜMÜ DEĞİŞTİR (KANBAN / LİSTE - İSİMSİZ, TEMİZ İKON) */}
          <button 
            onClick={() => {
              setViewMode(prev => prev === 'kanban' ? 'list' : 'kanban');
            }} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
            title={`Görünümü Değiştir (${viewMode === 'kanban' ? 'Kanban Görünümü' : 'Liste Görünümü'})`}
          >
            {viewMode === 'kanban' ? <LayoutGrid size={22} strokeWidth={2.5} /> : <List size={22} strokeWidth={2.5} />}
          </button>
          
          {/* 3. YENİ İLAN YAYINLA (İSİMSİZ, TEMİZ İKON) */}
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
          
          {/* 4. KURUMSAL PROFİL (İSİMSİZ, TEMİZ AVATAR) */}
          <button 
            onClick={() => { 
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('company');
              if (setSelectedUserId) setSelectedUserId((currentUser?.role === 'company' || currentUser?.role === 'employer') ? currentUser.id : 'CMP-001'); 
              if (setView) setView('user_profile'); 
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#0A2342] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Kurumsal Firma Profilim"
          >
            <SafeAvatar src={currentUser?.avatar || currentUser?.logo} name={currentUser?.name || 'Firma'} size="xs" alt="Profile" />
          </button>
        </div>
      </div>

    </div>
  );
}
