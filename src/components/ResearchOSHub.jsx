import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ArrowLeft, BookOpen, Search, Building, Users, 
  Calendar, ArrowRight, Download, FileText, CheckCircle2, Sparkles, 
  Filter, FlaskConical, Home, X, Clock, Check, AlertCircle, Info, ShieldCheck 
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SafeAvatar from './shared/SafeAvatar';
import useAppStore from '../store/useAppStore';

const PAPERS_DATA = [
  {
    id: 'PUB-2026-01',
    title: 'Akıllı Şehirlerde Yapay Zeka Tabanlı Trafik ve Enerji Optimizasyonu',
    authors: 'Prof. Dr. Bahri Şahin, Dr. Öğr. Üyesi Ahmet Yılmaz',
    department: 'Bilgisayar Mühendisliği',
    year: '2026',
    journal: 'IEEE Transactions on Smart Grid (Q1)',
    category: 'Yapay Zeka',
    citations: 42,
    abstract: 'Bu çalışmada derin öğrenme modelleri kullanılarak kentsel altyapı enerji tüketimi %28 oranında azaltılmıştır.'
  },
  {
    id: 'PUB-2026-02',
    title: 'Biyomedikal Sensörlerde Nanoteknoloji Tabanlı Biyo-Uyumlu Kaplamalar',
    authors: 'Doç. Dr. Ayşe Kaya, Arş. Gör. Mert Demir',
    department: 'Biyomedikal Mühendisliği',
    year: '2025',
    journal: 'Nature Biomedical Engineering',
    category: 'Biyomedikal',
    citations: 89,
    abstract: 'İmplante edilebilir medikal cihazların doku uyumunu artıran yenilikçi polimer nanokaplama tekniği sunulmaktadır.'
  },
  {
    id: 'PUB-2026-03',
    title: 'Sürdürülebilir Kampüs Yönetiminde Karbon Ayak İzi Analizi ve Sıfır Atık',
    authors: 'Prof. Dr. Nuri Kuruoğlu, Dr. Zeynep Arslan',
    department: 'Çevre Mühendisliği',
    year: '2026',
    journal: 'Journal of Cleaner Production',
    category: 'Sürdürülebilirlik',
    citations: 15,
    abstract: 'Üniversite yerleşkelerinde yenilenebilir güneş enerjisi ve yağmur suyu hasadı entegrasyon modeli.'
  }
];

const LABS_DATA = [
  {
    id: 'LAB-01',
    name: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab',
    location: 'J Blok 4. Kat / Lab 402',
    equipment: '8x NVIDIA H100 Tensor Core GPU Sunucu',
    capacity: '25 Araştırmacı',
    status: 'Aktif / Rezervasyona Açık'
  },
  {
    id: 'LAB-02',
    name: 'Otonom Sistemler & İHA Geliştirme Lab',
    location: 'Kuluçka Merkezi A Blok',
    equipment: 'Rüzgar Tüneli & 3D Metal Yazıcılar',
    capacity: '15 Araştırmacı',
    status: 'Aktif / Rezervasyona Açık'
  },
  {
    id: 'LAB-03',
    name: 'Biyomedikal Cihaz & Doku Mühendisliği Lab',
    location: 'C Blok Zemin Kat / Lab 104',
    equipment: 'Hücre Kültür İnkübatörleri & Mikroskoplar',
    capacity: '20 Araştırmacı',
    status: 'Bakımda (Yarın Açık)'
  }
];

const CALLS_DATA = [
  {
    id: 'CALL-101',
    title: 'TÜBİTAK 2209-A: Otonom İHA Kontrol Algoritmaları Bursiyer Çağrısı',
    lead: 'Dr. Öğr. Üyesi Mehmet Can',
    positions: '2 Lisans / 1 Yüksek Lisans Öğrencisi',
    deadline: '15 Mart 2026',
    budget: '75.000 ₺ Destekli'
  },
  {
    id: 'CALL-102',
    title: 'BAP Projesi: Sağlıkta LLM Destekli Tanı Asistanı Araştırmacı Alımı',
    lead: 'Prof. Dr. Bahri Şahin',
    positions: '3 Yazılım Araştırmacısı',
    deadline: '01 Nisan 2026',
    budget: '120.000 ₺ Destekli'
  }
];

export default function ResearchOSHub({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('papers'); // papers, labs, calls
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [bookedLabs, setBookedLabs] = useState([]);
  const [appliedCalls, setAppliedCalls] = useState([]);

  // Store connection
  const labReservations = useAppStore(state => state.labReservations) || [];
  const addLabReservation = useAppStore(state => state.addLabReservation);
  const researchCallApplications = useAppStore(state => state.researchCallApplications) || [];
  const addResearchCallApplication = useAppStore(state => state.addResearchCallApplication);
  const addNotification = useAppStore(state => state.addNotification);

  // Dynamic Catalog from Store (configured via Admin Panel)
  const storeResearchLabs = useAppStore(state => state.researchLabs);
  const researchLabs = (storeResearchLabs && storeResearchLabs.length > 0) ? storeResearchLabs : LABS_DATA;

  const storeResearchCalls = useAppStore(state => state.researchCalls);
  const researchCalls = (storeResearchCalls && storeResearchCalls.length > 0) ? storeResearchCalls : CALLS_DATA;

  const researchConfig = useAppStore(state => state.researchConfig) || {};
  const timeSlots = (researchConfig.timeSlots && researchConfig.timeSlots.length > 0) 
    ? researchConfig.timeSlots 
    : [
        "09:00 - 11:00 (Sabah Seansı)",
        "11:30 - 13:30 (Öğle Seansı)",
        "14:00 - 16:00 (Öğleden Sonra Seansı)",
        "16:30 - 18:30 (Akşam Seansı)"
      ];
  const labCustomQuestions = researchConfig.labCustomQuestions || [];
  const callCustomQuestions = researchConfig.callCustomQuestions || [];

  // Modal states
  const [bookingModalLab, setBookingModalLab] = useState(null);
  const [applyingModalCall, setApplyingModalCall] = useState(null);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [labReservationForm, setLabReservationForm] = useState({
    academicName: currentUser?.name || 'Prof. Dr. Bahri Şahin',
    academicTitle: currentUser?.role === 'academic' ? (currentUser?.title || 'Prof. Dr.') : 'Prof. Dr.',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    email: currentUser?.email || 'bahri.sahin@esenyurt.edu.tr',
    phone: currentUser?.phone || '+90 532 234 5678',
    date: '',
    timeSlot: '09:00 - 11:00 (Sabah Seansı)',
    projectSubject: '',
    attendeeCount: 2,
    specialEquipment: [],
    customAnswers: {},
    additionalNotes: ''
  });

  const [callApplicationForm, setCallApplicationForm] = useState({
    applicantName: currentUser?.name || 'Mert Demir',
    applicantStatus: 'Yüksek Lisans Öğrencisi',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    email: currentUser?.email || 'mert.demir@ogr.esenyurt.edu.tr',
    phone: currentUser?.phone || '+90 532 555 0192',
    appliedRole: '',
    weeklyHours: '15 - 20 Saat / Hafta',
    skillsExperience: '',
    statementOfPurpose: '',
    cvLink: '',
    customAnswers: {}
  });

  const isSlotBooked = useMemo(() => {
    if (!bookingModalLab) return false;
    const selectedDate = labReservationForm.date || tomorrowStr;
    const selectedSlotPrefix = (labReservationForm.timeSlot || '').split(' ')[0];
    return (labReservations || []).some(r => 
      r.labId === bookingModalLab.id && 
      r.date === selectedDate && 
      (r.timeSlot || '').includes(selectedSlotPrefix) &&
      r.status !== 'Reddedildi'
    );
  }, [bookingModalLab, labReservationForm.date, labReservationForm.timeSlot, labReservations, tomorrowStr]);

  const filteredPapers = PAPERS_DATA.filter(p => {
    const matchesCat = categoryFilter === 'Tümü' || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.authors.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleReturnToAcademic = () => {
    const store = useAppStore.getState();
    if (store.setActivePortalBranch) store.setActivePortalBranch('academic');
    if (setView) setView('academic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingModal = (lab) => {
    setBookingModalLab(lab);
    setLabReservationForm(prev => ({
      ...prev,
      academicName: currentUser?.name || prev.academicName,
      department: currentUser?.department || prev.department,
      email: currentUser?.email || prev.email,
      date: prev.date || tomorrowStr,
      specialEquipment: [lab.equipment ? lab.equipment.split('&')[0].trim() : 'Standart Lab Donanımı']
    }));
  };

  const handleSubmitLabReservation = (e) => {
    e.preventDefault();
    if (!labReservationForm.projectSubject.trim()) {
      if (window.toast?.error) window.toast.error("Lütfen araştırma konusunu ve kullanım amacını belirtiniz.");
      return;
    }

    const resDate = labReservationForm.date || tomorrowStr;
    const newReservation = {
      id: 'RES-LAB-' + Date.now().toString().slice(-4),
      name: labReservationForm.academicName,
      academicTitle: labReservationForm.academicTitle,
      department: labReservationForm.department,
      email: labReservationForm.email,
      phone: labReservationForm.phone,
      labId: bookingModalLab.id,
      labName: bookingModalLab.name,
      location: bookingModalLab.location,
      equipment: bookingModalLab.equipment,
      date: resDate,
      timeSlot: labReservationForm.timeSlot,
      projectSubject: labReservationForm.projectSubject.trim(),
      attendeeCount: Number(labReservationForm.attendeeCount) || 1,
      specialRequests: labReservationForm.specialEquipment.join(', ') + (labReservationForm.additionalNotes ? ` | Not: ${labReservationForm.additionalNotes}` : ''),
      customAnswers: labReservationForm.customAnswers || {},
      status: 'Onay Bekliyor',
      createdAt: new Date().toISOString()
    };

    if (addLabReservation) {
      addLabReservation(newReservation);
    }

    if (addNotification) {
      addNotification({
        id: 'NOTIF-LAB-' + Date.now(),
        type: 'info',
        title: 'Ar-Ge Lab Rezervasyon Talebi İletildi',
        message: `"${bookingModalLab.name}" için ${resDate} (${labReservationForm.timeSlot}) rezervasyon talebiniz yönetici onay havuzuna gönderildi.`
      });
    }

    setBookedLabs(prev => [...prev, bookingModalLab.id]);
    setBookingModalLab(null);

    if (window.toast?.success) {
      window.toast.success(`"${bookingModalLab.name}" laboratuvarı rezervasyon talebiniz yönetici onay havuzuna başarıyla iletildi.`);
    }
  };

  const handleOpenApplyingModal = (call) => {
    setApplyingModalCall(call);
    const defaultRole = call.positions.includes('Yazılım') ? 'Yazılım Araştırmacısı' : 
                        call.positions.includes('Lisans') ? 'Lisans Bursiyeri' : 'Araştırmacı';
    setCallApplicationForm(prev => ({
      ...prev,
      applicantName: currentUser?.name || prev.applicantName,
      department: currentUser?.department || prev.department,
      email: currentUser?.email || prev.email,
      appliedRole: defaultRole
    }));
  };

  const handleSubmitCallApplication = (e) => {
    e.preventDefault();
    if (!callApplicationForm.applicantName.trim() || !callApplicationForm.statementOfPurpose.trim()) {
      if (window.toast?.error) window.toast.error("Lütfen zorunlu alanları (Ad Soyad ve Motivasyon Beyanı) doldurunuz.");
      return;
    }

    const newApplication = {
      id: 'APP-CALL-' + Date.now().toString().slice(-4),
      callId: applyingModalCall.id,
      callTitle: applyingModalCall.title,
      lead: applyingModalCall.lead,
      applicantName: callApplicationForm.applicantName.trim(),
      applicantStatus: callApplicationForm.applicantStatus,
      department: callApplicationForm.department.trim(),
      email: callApplicationForm.email.trim(),
      phone: callApplicationForm.phone.trim(),
      appliedRole: callApplicationForm.appliedRole,
      weeklyHours: callApplicationForm.weeklyHours,
      skillsExperience: callApplicationForm.skillsExperience.trim(),
      statementOfPurpose: callApplicationForm.statementOfPurpose.trim(),
      cvLink: callApplicationForm.cvLink.trim() || '#',
      customAnswers: callApplicationForm.customAnswers || {},
      status: 'Onay Bekliyor',
      submittedAt: new Date().toISOString()
    };

    if (addResearchCallApplication) {
      addResearchCallApplication(newApplication);
    }

    if (addNotification) {
      addNotification({
        id: 'NOTIF-CALL-' + Date.now(),
        type: 'info',
        title: 'Proje Araştırmacı Başvurusu İletildi',
        message: `"${applyingModalCall.title}" projesine başvurunuz proje yürütücüsü ve yönetici havuzuna iletildi.`
      });
    }

    setAppliedCalls(prev => [...prev, applyingModalCall.id]);
    setApplyingModalCall(null);

    if (window.toast?.success) {
      window.toast.success(`"${applyingModalCall.title}" çağrısına başvurunuz yönetici havuzuna başarıyla iletildi.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans pb-28 animate-fade-in">
      
      {/* ─── 1. KURUMSAL ÜST NAVBAR (INSTITUTIONAL HEADER) ─── */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-purple-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Sol: Üniversite Logo & Başlık (Tıklanınca Akademik Akışa Döner) */}
          <div 
            onClick={handleReturnToAcademic}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
            title="Akademik Kadro & Araştırma Portalı Akışına Dön"
          >
            <Logo color="purple" className="h-9 w-auto shrink-0 group-hover:scale-105 transition-transform" />
            <div className="text-left min-w-0">
              <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight truncate">
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider truncate">
                Akademik Kadro & Bilimsel Araştırma Portalı
              </p>
            </div>
          </div>

          {/* Orta: Dal Rozeti */}
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-900 border border-purple-200 shadow-2xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4C1D95] animate-pulse" />
              🏛️ Akademik Kadro • Research OS Hub
            </span>
          </div>

          {/* Sağ: Aksiyon Butonları & Profil Menüsü */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
          </div>
        </div>
      </header>

      {/* ─── 2. ANA İÇERİK ALANI ─── */}
      <main className="flex-1 w-full max-w-[1150px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#4C1D95] to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-purple-800/60 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 bg-purple-900/70 px-3.5 py-1.5 rounded-full border border-purple-700/60 inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-purple-300" /> Enterprise Research OS Layer
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-3 mb-2 tracking-tight">
              Akademik Araştırma, Makale & Ar-Ge Ekosistemi
            </h2>
            <p className="text-purple-100/90 text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
              Üniversitemiz bünyesinde yayınlanan uluslararası makaleleri inceleyin, 110+ Ar-Ge laboratuvarından ekipman rezerve edin ve TÜBİTAK/BAP araştırma projelerine başvurun.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-3 mt-6 border-t border-purple-800/40 pt-6">
              <button 
                onClick={() => setActiveTab('papers')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'papers' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 border border-purple-400/40' 
                    : 'bg-purple-950/80 text-purple-200 hover:text-white hover:bg-purple-900/80 border border-purple-800/40'
                }`}
              >
                <BookOpen size={16} /> Makale & Bildiri İndeksi ({PAPERS_DATA.length})
              </button>
              <button 
                onClick={() => setActiveTab('labs')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'labs' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 border border-purple-400/40' 
                    : 'bg-purple-950/80 text-purple-200 hover:text-white hover:bg-purple-900/80 border border-purple-800/40'
                }`}
              >
                <FlaskConical size={16} /> Ar-Ge Laboratuvar Rezervasyonu ({researchLabs.length})
              </button>
              <button 
                onClick={() => setActiveTab('calls')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'calls' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 border border-purple-400/40' 
                    : 'bg-purple-950/80 text-purple-200 hover:text-white hover:bg-purple-900/80 border border-purple-800/40'
                }`}
              >
                <Users size={16} /> Proje & Bursiyer Çağrıları ({researchCalls.length})
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: PAPERS INDEX */}
        {activeTab === 'papers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition">
                <Search size={18} className="text-slate-400 mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Makale veya yazar ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs font-bold w-full focus:outline-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {['Tümü', 'Yapay Zeka', 'Biyomedikal', 'Sürdürülebilirlik'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                      categoryFilter === cat 
                        ? 'bg-[#4C1D95] text-white shadow-md shadow-purple-950/20' 
                        : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#4C1D95] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                        {paper.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400">• {paper.year} • {paper.journal}</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{paper.title}</h3>
                    <p className="text-xs font-medium text-slate-600">
                      <strong>Yazarlar:</strong> {paper.authors} ({paper.department})
                    </p>
                  </div>

                  <button 
                    onClick={() => setSelectedPaper(paper)}
                    className="px-5 py-3 bg-[#4C1D95] hover:bg-purple-800 text-white font-black text-xs rounded-2xl transition flex items-center gap-2 shrink-0 shadow-md shadow-purple-950/20 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <FileText size={16} /> Özeti Gör & İndir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LAB RESERVATIONS */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchLabs.map(lab => {
              const userRes = (labReservations || []).find(r => r.labId === lab.id && (r.name === currentUser?.name || r.email === currentUser?.email));
              const isRevisionRequested = userRes?.status === 'Revize İstendi';
              const isBooked = bookedLabs.includes(lab.id) || (labReservations || []).some(r => r.labId === lab.id && r.status !== 'Reddedildi');
              
              return (
                <div key={lab.id} className={`bg-white p-6 rounded-3xl border shadow-xs flex flex-col justify-between transition-all ${
                  isRevisionRequested ? 'border-amber-400 ring-2 ring-amber-100 shadow-md' : 'border-slate-200 hover:shadow-md hover:border-purple-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md border inline-block ${
                        isRevisionRequested 
                          ? 'bg-amber-50 text-amber-800 border-amber-300' 
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {isRevisionRequested ? 'Revize İstendi' : lab.status}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {lab.capacity}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-2">{lab.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-1">
                      <Building size={14} className="text-purple-600 shrink-0" />
                      {lab.location}
                    </p>
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs font-medium text-slate-700 space-y-1 mb-4">
                      <div><strong className="font-bold text-slate-900">Donanım:</strong> {lab.equipment}</div>
                      <div><strong className="font-bold text-slate-900">Kapasite:</strong> {lab.capacity}</div>
                    </div>

                    {isRevisionRequested && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium mb-4 space-y-1">
                        <strong className="font-black text-amber-950 flex items-center gap-1">
                          <AlertCircle size={13} className="text-amber-600" /> Yönetici Notu:
                        </strong>
                        <p>{userRes.adminNote || 'Rezervasyon talebinizde revize beklenmektedir.'}</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleOpenBookingModal(lab)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${
                      isRevisionRequested
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-900/20'
                        : isBooked 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs hover:bg-emerald-100' 
                          : 'bg-[#4C1D95] hover:bg-purple-800 text-white shadow-md shadow-purple-950/20 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {isRevisionRequested ? <AlertCircle size={16} /> : isBooked ? <CheckCircle2 size={16} /> : <Calendar size={16} />}
                    {isRevisionRequested ? 'Revizeyi Tamamla & Gönder' : isBooked ? 'Rezervasyon Talebi İletildi' : 'Çalışma Saati Rezerve Et'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: PROJECT CALLS */}
        {activeTab === 'calls' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchCalls.map(call => {
              const userApp = (researchCallApplications || []).find(a => a.callId === call.id && (a.applicantName === currentUser?.name || a.email === currentUser?.email));
              const isCallRevision = userApp?.status === 'Revize İstendi';
              const isCallInterview = userApp?.status === 'Mülakata Çağrıldı';
              const isApplied = appliedCalls.includes(call.id) || (researchCallApplications || []).some(a => a.callId === call.id);

              return (
                <div key={call.id} className={`bg-white p-6 rounded-3xl border shadow-xs flex flex-col justify-between transition-all ${
                  isCallRevision ? 'border-amber-400 ring-2 ring-amber-100 shadow-md' : 'border-slate-200 hover:shadow-md hover:border-purple-200'
                }`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block">
                        {call.budget}
                      </span>
                      {userApp && (
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isCallRevision ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          isCallInterview ? 'bg-purple-100 text-purple-900 border-purple-300' :
                          userApp.status === 'Kabul Edildi' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {userApp.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-slate-900 mb-3">{call.title}</h3>
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs font-semibold text-slate-600 space-y-1.5 mb-4">
                      <div>Yürütücü: <span className="font-bold text-purple-950">{call.lead}</span></div>
                      <div>Açık Pozisyonlar: <span className="font-bold text-purple-950">{call.positions}</span></div>
                      <div>Son Başvuru: <span className="font-bold text-purple-950">{call.deadline}</span></div>
                    </div>

                    {isCallRevision && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium mb-4 space-y-1">
                        <strong className="font-black text-amber-950 flex items-center gap-1">
                          <AlertCircle size={13} className="text-amber-600" /> Yönetici Revize Notu:
                        </strong>
                        <p>{userApp.adminNote || 'Başvurunuzda bazı eksik belgeler/bilgiler talep edilmiştir.'}</p>
                      </div>
                    )}

                    {isCallInterview && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900 font-medium mb-4 space-y-1">
                        <strong className="font-black text-purple-950 flex items-center gap-1">
                          <Sparkles size={13} className="text-purple-600" /> Mülakat Davet Notu:
                        </strong>
                        <p>{userApp.adminNote || 'Ön değerlendirmeyi geçtiniz, proje yürütücüsü ile mülakata davetlisiniz.'}</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => handleOpenApplyingModal(call)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer ${
                      isCallRevision
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-900/20'
                        : isCallInterview
                          ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-950/20'
                          : isApplied 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs hover:bg-emerald-100' 
                            : 'bg-[#4C1D95] hover:bg-purple-800 text-white shadow-md shadow-purple-950/20 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {isCallRevision ? <AlertCircle size={16} /> : isApplied ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                    {isCallRevision ? 'Revizeyi Tamamla & Gönder' : isCallInterview ? 'Mülakat Davetini Gör / Güncelle' : isApplied ? 'Başvurunuz İletildi (İnceleniyor)' : 'Araştırmacı Olarak Başvur'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL 1: ABSTRACT MODAL */}
        {selectedPaper && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedPaper(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-purple-100 space-y-4" onClick={e => e.stopPropagation()}>
              <span className="text-[10px] font-black uppercase text-[#4C1D95] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">{selectedPaper.category}</span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{selectedPaper.title}</h3>
              <p className="text-xs font-bold text-slate-500">{selectedPaper.authors} ({selectedPaper.year})</p>
              <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100 text-xs text-slate-700 font-medium leading-relaxed">
                <strong className="block mb-1 text-purple-950 font-bold">Özet (Abstract):</strong>
                {selectedPaper.abstract}
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    if (window.toast?.success) window.toast.success("Makale PDF indiriliyor...");
                    setSelectedPaper(null);
                  }}
                  className="flex-1 py-3 bg-[#4C1D95] hover:bg-purple-800 text-white font-black text-xs rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-950/20"
                >
                  <Download size={16} /> Tam Metin PDF İndir
                </button>
                <button 
                  onClick={() => setSelectedPaper(null)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-2xl transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: LAB REZERVASYON DETAYLI FORMU */}
        {bookingModalLab && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setBookingModalLab(null)}>
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden flex flex-col my-8" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-950 via-[#4C1D95] to-indigo-950 text-white p-6 relative">
                <button 
                  onClick={() => setBookingModalLab(null)} 
                  className="absolute right-4 top-4 text-purple-200 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
                  title="Kapat"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-900/80 text-purple-200 px-3 py-1 rounded-full border border-purple-700/60 inline-flex items-center gap-1.5">
                    <FlaskConical size={12} /> Ar-Ge Laboratuvar Rezervasyon Formu
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">{bookingModalLab.name}</h3>
                <p className="text-xs text-purple-200 mt-1 flex items-center gap-1.5">
                  <Building size={14} className="shrink-0 text-purple-300" /> {bookingModalLab.location} • Kapasite: {bookingModalLab.capacity}
                </p>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitLabReservation} className="p-6 space-y-5 text-xs font-sans max-h-[75vh] overflow-y-auto">
                
                {/* Lab Donanımı & Canlı Müsaitlik Durumu */}
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>Mevcut Donanım & Cihazlar:</span>
                    <span className="text-purple-900 font-extrabold">{bookingModalLab.equipment}</span>
                  </div>

                  {/* Dinamik Doluluk / Müsaitlik Bildirimi */}
                  {isSlotBooked ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Seans Doluluk Durumu:</strong> Seçilen tarih ve seans diliminde laboratuvarda planlanmış bir çalışma bulunmaktadır. Talebiniz <em>ek kontenjan / cihaz ortak çalışma talebi</em> olarak doğrudan birim yöneticisine iletilecektir.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <div>
                        <strong className="font-bold">Müsait:</strong> Seçilen tarih ve seans diliminde laboratuvar rezervasyona tamamen açıktır.
                      </div>
                    </div>
                  )}
                </div>

                {/* Tarih ve Seans Seçimi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Rezervasyon Tarihi *
                    </label>
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={labReservationForm.date || tomorrowStr}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, date: e.target.value })}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Çalışma Seansı (Saat Dilimi) *
                    </label>
                    <select 
                      value={labReservationForm.timeSlot}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, timeSlot: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sorumlu Akademisyen Bilgileri */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Sorumlu Akademisyen / Araştırmacı *
                    </label>
                    <input 
                      type="text"
                      value={labReservationForm.academicName}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, academicName: e.target.value })}
                      required
                      placeholder="Ad Soyad"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Akademik Unvan *
                    </label>
                    <select 
                      value={labReservationForm.academicTitle}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, academicTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="Prof. Dr.">Prof. Dr.</option>
                      <option value="Doç. Dr.">Doç. Dr.</option>
                      <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                      <option value="Arş. Gör.">Arş. Gör.</option>
                      <option value="Öğretim Görevlisi">Öğretim Görevlisi</option>
                      <option value="Araştırmacı">Araştırmacı</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Bağlı Olduğu Bölüm / Fakülte *
                    </label>
                    <input 
                      type="text"
                      value={labReservationForm.department}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, department: e.target.value })}
                      required
                      placeholder="Örn: Bilgisayar Mühendisliği"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Kurumsal E-Posta *
                    </label>
                    <input 
                      type="email"
                      value={labReservationForm.email}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, email: e.target.value })}
                      required
                      placeholder="ad.soyad@esenyurt.edu.tr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Araştırma Konusu ve Katılımcı Sayısı */}
                <div>
                  <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                    Araştırma Projesi / Çalışma Konusu & Kullanım Amacı *
                  </label>
                  <textarea 
                    rows={2}
                    value={labReservationForm.projectSubject}
                    onChange={(e) => setLabReservationForm({ ...labReservationForm, projectSubject: e.target.value })}
                    required
                    placeholder="Örn: TÜBİTAK 1001 Kapsamında Derin Öğrenme Model Eğitimi ve Veri Seti Benchmark Çalışması..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Katılacak Araştırmacı / Öğrenci Sayısı
                    </label>
                    <input 
                      type="number"
                      min={1}
                      max={30}
                      value={labReservationForm.attendeeCount}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, attendeeCount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      İletişim Telefonu
                    </label>
                    <input 
                      type="tel"
                      value={labReservationForm.phone}
                      onChange={(e) => setLabReservationForm({ ...labReservationForm, phone: e.target.value })}
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Yönetici Tarafından Tanımlanan Ek Sorular & Revize Kriterleri */}
                {labCustomQuestions && labCustomQuestions.length > 0 && (
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
                    <div className="text-[11px] font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-purple-700" /> Birim Yönetimi Ek Kriterleri & Revize Soruları
                    </div>
                    {labCustomQuestions.map(q => (
                      <div key={q.id}>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          {q.label} {q.required && <span className="text-red-500">*</span>}
                        </label>
                        {q.type === 'select' ? (
                          <select
                            value={labReservationForm.customAnswers?.[q.id] || (q.options ? q.options[0] : '')}
                            onChange={(e) => setLabReservationForm(prev => ({
                              ...prev,
                              customAnswers: { ...(prev.customAnswers || {}), [q.id]: e.target.value }
                            }))}
                            className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                          >
                            {(q.options || []).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={labReservationForm.customAnswers?.[q.id] || ''}
                            onChange={(e) => setLabReservationForm(prev => ({
                              ...prev,
                              customAnswers: { ...(prev.customAnswers || {}), [q.id]: e.target.value }
                            }))}
                            placeholder="Cevabınızı giriniz..."
                            className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Özel Donanım ve Altyapı Talepleri */}
                <div>
                  <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-2">
                    Özel Ekipman & Laboratuvar Altyapı Talepleri
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'NVIDIA Tensor Core GPU Kümesi Erişimi',
                      'Kesintisiz Güç Kaynağı & Özel Soğutma',
                      'Steril Kabin & Doku İnkübatörü',
                      '3D Metal Yazıcı & Rüzgar Tüneli',
                      'Laboratuvar Teknikeri / Asistan Refakati'
                    ].map(item => {
                      const isChecked = labReservationForm.specialEquipment.includes(item);
                      return (
                        <label 
                          key={item} 
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] font-bold cursor-pointer transition ${
                            isChecked ? 'bg-purple-50 border-purple-300 text-purple-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const list = isChecked 
                                ? labReservationForm.specialEquipment.filter(x => x !== item)
                                : [...labReservationForm.specialEquipment, item];
                              setLabReservationForm({ ...labReservationForm, specialEquipment: list });
                            }}
                            className="rounded text-purple-700 focus:ring-purple-500"
                          />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setBookingModalLab(null)}
                    className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#4C1D95] hover:bg-purple-800 text-white font-black text-xs rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/20"
                  >
                    <Check size={16} /> Rezervasyon Talebini Yönetici Paneline Gönder
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* MODAL 3: PROJE & BURSİYER ÇAĞRISI BAŞVURU DETAYLI FORMU */}
        {applyingModalCall && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setApplyingModalCall(null)}>
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden flex flex-col my-8" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-purple-950 via-[#4C1D95] to-indigo-950 text-white p-6 relative">
                <button 
                  onClick={() => setApplyingModalCall(null)} 
                  className="absolute right-4 top-4 text-purple-200 hover:text-white p-2 rounded-full hover:bg-white/10 transition cursor-pointer"
                  title="Kapat"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-900/80 text-purple-200 px-3 py-1 rounded-full border border-purple-700/60 inline-flex items-center gap-1.5">
                    <Sparkles size={12} /> Proje & Bursiyer Başvuru Formu
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                    {applyingModalCall.budget}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">{applyingModalCall.title}</h3>
                <p className="text-xs text-purple-200 mt-1">
                  Yürütücü: <strong>{applyingModalCall.lead}</strong> • Son Başvuru: <strong>{applyingModalCall.deadline}</strong>
                </p>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitCallApplication} className="p-6 space-y-5 text-xs font-sans max-h-[75vh] overflow-y-auto">
                
                {/* Proje Bilgileri Özeti */}
                <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Açık Pozisyonlar:</span>
                    <p className="font-extrabold text-purple-950">{applyingModalCall.positions}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Resmi Başvuru Havuzuna Aktarılacaktır
                  </span>
                </div>

                {/* Aday Bilgileri */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Başvuran Ad Soyad *
                    </label>
                    <input 
                      type="text"
                      value={callApplicationForm.applicantName}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, applicantName: e.target.value })}
                      required
                      placeholder="Ad Soyad"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Öğrenim / Akademik Durum *
                    </label>
                    <select 
                      value={callApplicationForm.applicantStatus}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, applicantStatus: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="Lisans Öğrencisi (3. / 4. Sınıf)">Lisans Öğrencisi (3. / 4. Sınıf)</option>
                      <option value="Yüksek Lisans Öğrencisi">Yüksek Lisans Öğrencisi</option>
                      <option value="Doktora Öğrencisi">Doktora Öğrencisi</option>
                      <option value="Araştırma Görevlisi / Doktora Sonrası">Araştırma Görevlisi / Doktora Sonrası</option>
                      <option value="Mezun / Bağımsız Araştırmacı">Mezun / Bağımsız Araştırmacı</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Bölüm / Fakülte *
                    </label>
                    <input 
                      type="text"
                      value={callApplicationForm.department}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, department: e.target.value })}
                      required
                      placeholder="Örn: Bilgisayar Mühendisliği"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Kurumsal / Kişisel E-Posta *
                    </label>
                    <input 
                      type="email"
                      value={callApplicationForm.email}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, email: e.target.value })}
                      required
                      placeholder="eposta@esenyurt.edu.tr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Başvurulan Rol ve Haftalık Çalışma Süresi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Başvurulan Rol / Pozisyon *
                    </label>
                    <input 
                      type="text"
                      value={callApplicationForm.appliedRole}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, appliedRole: e.target.value })}
                      required
                      placeholder="Örn: Yüksek Lisans Bursiyeri / Yazılım Araştırmacısı"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      Haftalık Ayrılacak Çalışma Süresi *
                    </label>
                    <select 
                      value={callApplicationForm.weeklyHours}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, weeklyHours: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    >
                      <option value="10 - 15 Saat / Hafta (Yarı Zamanlı Bursiyer)">10 - 15 Saat / Hafta (Yarı Zamanlı Bursiyer)</option>
                      <option value="15 - 20 Saat / Hafta (Yoğun Ar-Ge Katılımı)">15 - 20 Saat / Hafta (Yoğun Ar-Ge Katılımı)</option>
                      <option value="20+ Saat / Hafta (Tam Zamanlı Tez / Proje)">20+ Saat / Hafta (Tam Zamanlı Tez / Proje)</option>
                    </select>
                  </div>
                </div>

                {/* Yetkinlikler ve Deneyim */}
                <div>
                  <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                    İlgili Teknik Yetkinlikler & Araştırma Geçmişi
                  </label>
                  <textarea 
                    rows={2}
                    value={callApplicationForm.skillsExperience}
                    onChange={(e) => setCallApplicationForm({ ...callApplicationForm, skillsExperience: e.target.value })}
                    placeholder="Örn: Python, PyTorch, C++, ROS2, İHA kontrol algoritmaları, sensör füzyonu deneyimi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-none"
                  />
                </div>

                {/* Motivasyon ve Katkı Beyanı */}
                <div>
                  <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                    Motivasyon & Projeye Katkı Beyanı (Statement of Purpose) *
                  </label>
                  <textarea 
                    rows={3}
                    value={callApplicationForm.statementOfPurpose}
                    onChange={(e) => setCallApplicationForm({ ...callApplicationForm, statementOfPurpose: e.target.value })}
                    required
                    placeholder="Bu projede yer almayı neden istiyorsunuz? Projeye hangi spesifik katkıları sağlayacaksınız ve akademik hedefleriniz nelerdir?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 resize-none"
                  />
                </div>

                {/* CV / Profil Linki */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      İletişim Telefonu *
                    </label>
                    <input 
                      type="tel"
                      value={callApplicationForm.phone}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, phone: e.target.value })}
                      required
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">
                      CV / Portfolyo / GitHub Bağlantısı
                    </label>
                    <input 
                      type="url"
                      value={callApplicationForm.cvLink}
                      onChange={(e) => setCallApplicationForm({ ...callApplicationForm, cvLink: e.target.value })}
                      placeholder="https://github.com/... veya CV linki"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Yönetici Tarafından Tanımlanan Çağrı Soruları & Revize Kriterleri */}
                {callCustomQuestions && callCustomQuestions.length > 0 && (
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 space-y-3">
                    <div className="text-[11px] font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-700" /> Proje Değerlendirme & Ek Yetkinlik Soruları
                    </div>
                    {callCustomQuestions.map(q => (
                      <div key={q.id}>
                        <label className="block font-bold text-slate-800 text-xs mb-1">
                          {q.label} {q.required && <span className="text-red-500">*</span>}
                        </label>
                        {q.type === 'select' ? (
                          <select
                            value={callApplicationForm.customAnswers?.[q.id] || (q.options ? q.options[0] : '')}
                            onChange={(e) => setCallApplicationForm(prev => ({
                              ...prev,
                              customAnswers: { ...(prev.customAnswers || {}), [q.id]: e.target.value }
                            }))}
                            className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                          >
                            {(q.options || []).map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={callApplicationForm.customAnswers?.[q.id] || ''}
                            onChange={(e) => setCallApplicationForm(prev => ({
                              ...prev,
                              customAnswers: { ...(prev.customAnswers || {}), [q.id]: e.target.value }
                            }))}
                            placeholder="Cevabınızı giriniz..."
                            className="w-full bg-white border border-purple-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setApplyingModalCall(null)}
                    className="px-5 py-3 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#4C1D95] hover:bg-purple-800 text-white font-black text-xs rounded-2xl transition flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-950/20"
                  >
                    <Check size={16} /> Başvuruyu Proje Yürütücüsü & Yönetici Paneline Gönder
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </main>

      {/* ─── 3. AKADEMİK KADRO 4'LÜ ASİL MOR DOCK (#4C1D95) ─── */}
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
            className="p-2.5 rounded-full bg-purple-50 text-purple-900 hover:bg-[#4C1D95] hover:text-white transition flex items-center justify-center cursor-pointer hover:scale-105" 
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
            }} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-50 to-indigo-100 text-purple-900 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/40 cursor-pointer" 
            title="Evrak & Staj Onayı"
          >
            <FileText size={22} strokeWidth={2.5} />
          </button>

          {/* 3. Araştırma OS Hub (Aktif Sayfa) */}
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#4C1D95] via-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/60 cursor-pointer" 
            title="Araştırma OS Hub"
          >
            <BookOpen size={20} strokeWidth={2.5} />
          </button>

          {/* 4. Akademik Profilim */}
          <button 
            onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('academic');
              if (setSelectedUserId) setSelectedUserId(currentUser?.role === 'academic' ? currentUser.id : 'ACAD-001');
              if (setView) setView('user_profile');
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#4C1D95] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Akademik Profilim"
          >
            <SafeAvatar src={currentUser?.avatar} name={currentUser?.name || 'Akademik'} size="xs" alt="Akademisyen" />
          </button>
        </div>
      </div>

    </div>
  );
}
