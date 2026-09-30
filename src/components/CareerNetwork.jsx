import React, { useState, useMemo } from 'react';
import { 
  Building2, Calendar, Users, Briefcase, ExternalLink, ShieldCheck, 
  ChevronRight, BookOpen, X, Search, CheckCircle2, MapPin, Sparkles, 
  ArrowLeft, GraduationCap, Award, MessageCircle, Filter, Star, Check 
} from 'lucide-react';
import SafeAvatar from './shared/SafeAvatar';
import SubPanelFloatingDock from './SubPanelFloatingDock';
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
  embedded = false 
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
  const [showAllAcademics, setShowAllAcademics] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Talent Pool Search & Filters
  const [talentSearch, setTalentSearch] = useState('');
  const [talentRoleFilter, setTalentRoleFilter] = useState('all'); // 'all' | 'student' | 'alumni' | 'intern_seeking'
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [minGpaFilter, setMinGpaFilter] = useState('all');

  const homeView = previousView || (isAdmin ? 'admin' : isAlumni ? 'alumni' : isAcademic ? 'academic' : isCompany ? 'company' : 'student');

  const bannerGradient = 
    isAlumni ? 'bg-gradient-to-br from-[#065F46] via-[#059669] to-[#047857] border-emerald-900' :
    isAcademic ? 'bg-gradient-to-br from-[#4C1D95] via-[#7c3aed] to-[#5B21B6] border-purple-900' :
    isCompany ? 'bg-gradient-to-br from-[#0A2342] via-[#163B65] to-[#0F172A] border-blue-900' :
    isAdmin ? 'bg-gradient-to-br from-[#78350F] via-[#b45309] to-[#92400E] border-amber-900' :
    'bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] border-red-900';

  const backBtnHoverClass = 
    isAlumni ? 'hover:bg-emerald-50 text-gray-700 hover:text-[#059669]' :
    isAcademic ? 'hover:bg-purple-50 text-gray-700 hover:text-[#7c3aed]' :
    isCompany ? 'hover:bg-blue-50 text-gray-700 hover:text-[#1e3a5f]' :
    isAdmin ? 'hover:bg-amber-50 text-gray-700 hover:text-[#b45309]' :
    'hover:bg-red-50 text-gray-700 hover:text-[#990000]';

  const titleColor = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#7c3aed]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const actionBtnTextClass = 
    isAlumni ? 'text-[#059669]' :
    isAcademic ? 'text-[#7c3aed]' :
    isCompany ? 'text-[#1e3a5f]' :
    isAdmin ? 'text-[#b45309]' :
    'text-[#990000]';

  const primaryBtnClass = 
    isAlumni ? 'bg-[#059669] hover:bg-emerald-700' :
    isAcademic ? 'bg-[#7c3aed] hover:bg-purple-700' :
    isCompany ? 'bg-[#1e3a5f] hover:bg-slate-900' :
    isAdmin ? 'bg-[#b45309] hover:bg-amber-700' :
    'bg-[#990000] hover:bg-red-800';

  const cardIconBg = 
    isAlumni ? 'bg-emerald-50 text-[#059669]' :
    isAcademic ? 'bg-purple-50 text-[#7c3aed]' :
    isCompany ? 'bg-blue-50 text-[#1e3a5f]' :
    isAdmin ? 'bg-amber-50 text-[#b45309]' :
    'bg-red-50 text-[#990000]';

  const cardHoverBorder = 
    isAlumni ? 'hover:border-emerald-200' :
    isAcademic ? 'hover:border-purple-200' :
    isCompany ? 'hover:border-blue-200' :
    isAdmin ? 'hover:border-amber-200' :
    'hover:border-red-100';

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
    { id: 'cmp_p_1', name: 'Aselsan A.Ş.', sector: 'Savunma Sanayi & Bilişim', location: 'Ankara / İstanbul', protocolDate: '2025-2027', openPositions: 14, logo: 'https://ui-avatars.com/api/?name=Aselsan&background=990000&color=fff' },
    { id: 'cmp_p_2', name: 'Baykar Teknoloji', sector: 'Havacılık & İHA', location: 'İstanbul / Özdemir Bayraktar Kampüsü', protocolDate: '2025-2028', openPositions: 22, logo: 'https://ui-avatars.com/api/?name=Baykar&background=0A2342&color=fff' },
    { id: 'cmp_p_3', name: 'Trendyol Tech', sector: 'E-Ticaret & Yazılım', location: 'İstanbul Maslak', protocolDate: '2026-2027', openPositions: 8, logo: 'https://ui-avatars.com/api/?name=Trendyol&background=990000&color=fff' },
    { id: 'cmp_p_4', name: 'Turkcell Teknoloji', sector: 'Telekomünikasyon', location: 'İstanbul Küçükyalı', protocolDate: '2024-2027', openPositions: 19, logo: 'https://ui-avatars.com/api/?name=Turkcell&background=059669&color=fff' }
  ];

  const allCompanies = networkCompanies.length > 0 ? networkCompanies : defaultStitchCompanies;

  const defaultParticipants = [
    { id: 'part_1', name: 'Prof. Dr. Süleyman Özdemir', title: 'Rektör / Kurul Başkanı', unit: 'İESÜ Rektörlük', status: 'Katılımcı' },
    { id: 'part_2', name: 'Kariyer Geliştirme Merkezi', title: 'Resmî Merkez', unit: 'İESÜ KGM', status: 'Düzenleyen' },
    { id: 'part_3', name: 'Mühendislik & Mimarlık Fakültesi Dekanlığı', title: 'Fakülte Temsilcisi', unit: 'İESÜ MMF', status: 'Katılımcı' },
    { id: 'part_4', name: 'Esenyurt Sanayici ve İş İnsanları Derneği', title: 'Sektör Temsilcisi', unit: 'ESİDER', status: 'Protokol Ortağı' }
  ];

  const defaultInternships = [
    { id: 'int_p_1', title: 'Zorunlu Mühendislik Yaz Stajı Protokolü', company: 'Aselsan & Baykar Teknoloji', quota: '45 Öğrenci', deadline: '15 Mayıs 2026', type: 'Zorunlu / Gönüllü' },
    { id: 'int_p_2', title: 'Yazılım ve Yapay Zeka Aday Mühendislik', company: 'Trendyol & Turkcell', quota: '30 Öğrenci', deadline: '30 Nisan 2026', type: 'Aday Mühendislik' },
    { id: 'int_p_3', title: 'İktisadi ve İdari Bilimler Kurumsal Stajı', company: 'ESİDER Üye Firmaları', quota: '60 Öğrenci', deadline: '01 Haziran 2026', type: 'Kurumsal Staj' }
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
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-3 shadow-md">
                <ShieldCheck size={13} className="text-emerald-400" /> Resmî Protokol Ağı
              </div>
              
              <h2 className="text-2xl sm:text-[28px] font-black text-white mb-2 leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Akademik & Katılımcı Ağı
              </h2>
              
              <p className="text-white font-semibold text-[13px] leading-relaxed mb-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Üniversitemiz kurul üyeleri, akademisyenler ve resmi staj kontenjanı süreçlerine buradan ulaşabilirsiniz.
              </p>

              {/* Internal Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-1">
                <button 
                  onClick={() => { setModalSearch(''); setActiveModal('participants'); }}
                  className={`flex items-center justify-between bg-white ${actionBtnTextClass} hover:bg-slate-100 p-3 rounded-xl transition-all text-xs font-black uppercase tracking-wider w-full shadow-md border border-white cursor-pointer group`}
                >
                  <span className="flex items-center gap-2.5"><Calendar size={16} /> Katılımcılar & Kurullar</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => { setModalSearch(''); setActiveModal('internships'); }}
                  className="flex items-center justify-between bg-white/15 hover:bg-white/25 border border-white/30 p-3 rounded-xl transition-all text-white text-xs font-bold w-full shadow-sm backdrop-blur-md cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5"><Briefcase size={16} /> Staj İmkânları & Kontenjanlar</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Compact Participants List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-gray-900 text-sm">Resmi Kurul & Katılımcılar ({defaultParticipants.length})</h3>
              <button onClick={() => { setModalSearch(''); setActiveModal('participants'); }} className={`text-xs font-bold ${actionBtnTextClass} hover:underline cursor-pointer`}>Tümünü Gör</button>
            </div>

            <div className="space-y-3">
              {defaultParticipants.map(participant => (
                <div key={participant.id} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md ${cardHoverBorder} transition-all group`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${cardIconBg} rounded-xl flex items-center justify-center shrink-0 font-black text-sm`}>
                      <ShieldCheck size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{participant.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          {participant.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{participant.title} • {participant.unit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compact Academic List */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-gray-900 text-sm">Akademik Kadro ({networkAcademics.length})</h3>
              {networkAcademics.length > 0 && (
                <button onClick={() => setShowAllAcademics((v) => !v)} className={`text-xs font-bold ${actionBtnTextClass} hover:underline cursor-pointer`}>
                  {showAllAcademics ? 'Daralt' : 'Tümünü Gör'}
                </button>
              )}
            </div>

            {networkAcademics.length === 0 ? (
              <div className="text-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <BookOpen size={24} className="text-gray-400" />
                </div>
                <p className="text-[13px] font-bold text-gray-500 mb-1">Henüz akademik personel bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {networkAcademics.slice(0, showAllAcademics ? networkAcademics.length : 5).map(academic => {
                  const isSelf = !academic.id || academic.id === 'self' || academic.id === 'me' || (effectiveCurrentUser && (
                    String(academic.id) === String(effectiveCurrentUser.id) ||
                    String(academic.id) === String(effectiveCurrentUser.uid) ||
                    (effectiveCurrentUser.name && academic.name && effectiveCurrentUser.name.trim().toLowerCase() === academic.name.trim().toLowerCase())
                  ));
                  const targetId = isSelf ? (effectiveCurrentUser?.id || academic.id) : academic.id;
                  return (
                    <div 
                      key={academic.id} 
                      className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md ${cardHoverBorder} transition-all group cursor-pointer`} 
                      onClick={() => handleViewTalentProfile(targetId)}
                    >
                      <div className="flex items-center gap-3">
                        <SafeAvatar 
                          name={academic.name} 
                          src={academic.avatar} 
                          isAdmin={false} 
                          size="lg" 
                          rounded="rounded-full" 
                          className="w-12 h-12 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 text-sm truncate transition-colors">{academic.name}</h4>
                          <p className="text-[11px] font-bold text-gray-500 truncate mb-1">{academic.title || 'Akademisyen'} / {academic.department}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100">
                              Danışman
                            </span>
                          </div>
                        </div>
                        <button 
                          className={`w-8 h-8 rounded-full ${cardIconBg} flex items-center justify-center hover:${primaryBtnClass} hover:text-white transition-colors cursor-pointer`} 
                          title="Mesaj Gönder" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (setSelectedUserId) setSelectedUserId(academic.id);
                            useAppStore.getState().setSelectedUserId?.(academic.id);
                            if (setView) setView('messaging');
                          }}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ─── PROTOCOL MODALS ─── */}
      {activeModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-[#990000] rounded-2xl">
                  {activeModal === 'companies' && <Building2 size={24} />}
                  {activeModal === 'participants' && <Users size={24} />}
                  {activeModal === 'internships' && <Briefcase size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {activeModal === 'companies' && 'Resmi Protokol Ortakları'}
                    {activeModal === 'participants' && 'Katılımcılar & Resmî Kurullar'}
                    {activeModal === 'internships' && 'Staj İmkânları ve Kontenjanlar'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">İstanbul Esenyurt Üniversitesi Kariyer Ağı</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Modal Body */}
            {activeModal === 'participants' && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {defaultParticipants
                  .filter(p => p.name.toLowerCase().includes(modalSearch.toLowerCase()) || p.title.toLowerCase().includes(modalSearch.toLowerCase()))
                  .map(p => (
                    <div key={p.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                        <p className="text-xs text-slate-500">{p.title} • {p.unit}</p>
                      </div>
                      <span className={`text-[11px] font-black ${actionBtnTextClass} bg-slate-100 px-3 py-1 rounded-full border border-slate-200`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
              </div>
            )}

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
                        <span className={`${titleColor} font-black`}>Kontenjan: {i.quota}</span>
                      </p>
                      <button 
                        onClick={() => {
                          setActiveModal(null);
                          if (setView) setView('jobs');
                        }}
                        className={`w-full mt-2 py-2 ${primaryBtnClass} text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5`}
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

  if (embedded) {
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 pb-32 font-sans">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView ? setView(homeView) : null} 
            className={`w-10 h-10 rounded-full bg-white border border-gray-200 ${backBtnHoverClass} flex items-center justify-center shadow-xs transition cursor-pointer`}
            title="Geri Dön"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className={`text-xl font-black ${titleColor} tracking-tight leading-tight`}>{pageTitle}</h1>
            <p className="text-[11px] font-bold text-slate-400">{pageSubtitle}</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto">
        {content}
      </div>
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
