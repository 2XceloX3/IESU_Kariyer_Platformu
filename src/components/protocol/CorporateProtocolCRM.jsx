import React, { useState, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';
import SafeAvatar from '../shared/SafeAvatar';
import {
  PROTOCOL_STANDARDS,
  PROTOCOL_TYPES,
  PROTOCOL_STATUS,
  PROTOCOL_STATUS_LABELS,
  PROTOCOL_SECTORS,
  generateProtocolCode,
  getDaysUntilExpiration,
  calculateProtocolStatus,
  calculateQuotaFulfillment,
  calculateProtocolAggregateStats,
  matchCandidateWithESBIM,
  matchSectorMentor,
  SAMPLE_CORPORATE_PROTOCOLS,
  SAMPLE_SECTOR_MENTORS,
  SAMPLE_ESBIM_EVENTS,
  SAMPLE_ISKUR_JOB_CLUB_COHORTS,
  SAMPLE_ESBIM_VACANCIES,
  exportSenateProtocolPdf,
  downloadSenateProtocolCsv,
} from '../../services/protocolWorkflow';
import {
  Building2,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  Users,
  Award,
  Download,
  Printer,
  TrendingUp,
  X,
  Briefcase,
  MapPin,
  GraduationCap,
  Sparkles,
  Send,
  Eye,
  Check,
} from 'lucide-react';

export default function CorporateProtocolCRM({ _currentUser = null }) {
  const storeProtocols = useAppStore((state) => state.corporateProtocols);
  const setCorporateProtocols = useAppStore((state) => state.setCorporateProtocols);
  const addCorporateProtocol = useAppStore((state) => state.addCorporateProtocol);
  const renewCorporateProtocol = useAppStore((state) => state.renewCorporateProtocol);
  const terminateCorporateProtocol = useAppStore((state) => state.terminateCorporateProtocol);
  const storeSectorMentors = useAppStore((state) => state.sectorMentors);
  const setSectorMentors = useAppStore((state) => state.setSectorMentors);
  const addSectorMentor = useAppStore((state) => state.addSectorMentor);
  const storeEsbimEvents = useAppStore((state) => state.esbimEvents);
  const storeIskurCohorts = useAppStore((state) => state.iskurJobClubCohorts);

  // Active Protocols Pool (store or sample fallback)
  const protocols = Array.isArray(storeProtocols) && storeProtocols.length > 0
    ? storeProtocols
    : SAMPLE_CORPORATE_PROTOCOLS;

  const sectorMentors = Array.isArray(storeSectorMentors) && storeSectorMentors.length > 0
    ? storeSectorMentors
    : SAMPLE_SECTOR_MENTORS;

  const esbimEvents = Array.isArray(storeEsbimEvents) && storeEsbimEvents.length > 0
    ? storeEsbimEvents
    : SAMPLE_ESBIM_EVENTS;

  const iskurCohorts = Array.isArray(storeIskurCohorts) && storeIskurCohorts.length > 0
    ? storeIskurCohorts
    : SAMPLE_ISKUR_JOB_CLUB_COHORTS;

  // Active Tab
  const [activeTab, setActiveTab] = useState('protocols'); // 'protocols' | 'iskur_esbim' | 'advisory_board' | 'senate_report'

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // New Protocol Form
  const [newProtocol, setNewProtocol] = useState({
    companyName: '',
    sector: PROTOCOL_SECTORS[0],
    protocolType: PROTOCOL_TYPES.COOPERATION,
    committedQuota: 20,
    placedCount: 0,
    signedDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    contactPerson: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    scope: '',
    assignedFaculty: 'Mühendislik ve Mimarlık Fakültesi',
    notes: '',
  });

  // Renewal Form
  const [renewalForm, setRenewalForm] = useState({
    additionalYears: 2,
    additionalQuota: 10,
    notes: '',
  });

  // ESBİM Aday Eşleştirme Masası State
  const [candidateForm, setCandidateForm] = useState({
    name: 'Ahmet Can Kaya',
    department: 'Lojistik Yönetimi',
    district: 'Esenyurt',
  });
  const [referredVacancies, setReferredVacancies] = useState({});

  // Sektörel Danışma Kurulu Arama & Filtre State
  const [advisorySearchTerm, setAdvisorySearchTerm] = useState('');
  const [advisorySelectedSector, setAdvisorySelectedSector] = useState('ALL');
  const [advisorySelectedDept, setAdvisorySelectedDept] = useState('ALL');
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [showSenatePreviewModal, setShowSenatePreviewModal] = useState(false);

  const [newMentor, setNewMentor] = useState({
    name: '',
    title: '',
    company: '',
    protocolCode: 'IESU-PRT-2026-001',
    sector: PROTOCOL_SECTORS[0],
    assignedDepartment: 'Bilgisayar Mühendisliği',
    expertise: '',
    email: '',
    menteeCapacity: 5,
    term: '2025-2027',
  });

  // Aggregate Stats
  const aggregateStats = useMemo(() => {
    return calculateProtocolAggregateStats(protocols);
  }, [protocols]);

  // Live ESBİM Matches
  const esbimMatches = useMemo(() => {
    return matchCandidateWithESBIM(candidateForm, SAMPLE_ESBIM_VACANCIES);
  }, [candidateForm]);

  const handleReferCandidate = (vacId, vacTitle) => {
    setReferredVacancies((prev) => ({ ...prev, [vacId]: true }));
    if (window.toast?.success) {
      window.toast.success(`${candidateForm.name} adayı "${vacTitle}" için ESBİM Masasına başarıyla sevk edildi.`);
    }
  };

  // Filtered Sector Mentors
  const filteredSectorMentors = useMemo(() => {
    return sectorMentors.filter((m) => {
      const term = advisorySearchTerm.toLowerCase();
      const matchText =
        (m.name || '').toLowerCase().includes(term) ||
        (m.title || '').toLowerCase().includes(term) ||
        (m.company || '').toLowerCase().includes(term) ||
        (m.protocolCode || '').toLowerCase().includes(term);

      const matchSec = advisorySelectedSector === 'ALL' || (m.sector || '') === advisorySelectedSector;
      const matchDept =
        advisorySelectedDept === 'ALL' ||
        matchSectorMentor(m, advisorySelectedDept);

      return matchText && matchSec && matchDept;
    });
  }, [sectorMentors, advisorySearchTerm, advisorySelectedSector, advisorySelectedDept]);

  // Filtered Protocols
  const filteredProtocols = useMemo(() => {
    return protocols.filter((p) => {
      const matchSearch =
        (p.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.protocolCode || p.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.scope || '').toLowerCase().includes(searchTerm.toLowerCase());

      const dynamicStatus = calculateProtocolStatus(p);
      const matchStatus =
        selectedStatus === 'ALL' ||
        dynamicStatus === selectedStatus ||
        (selectedStatus === 'ACTIVE' && (dynamicStatus === PROTOCOL_STATUS.ACTIVE || dynamicStatus === PROTOCOL_STATUS.EXPIRING_SOON));

      const matchType =
        selectedType === 'ALL' || (p.protocolType || PROTOCOL_TYPES.COOPERATION) === selectedType;

      const matchSector =
        selectedSector === 'ALL' || (p.sector || '') === selectedSector;

      return matchSearch && matchStatus && matchType && matchSector;
    });
  }, [protocols, searchTerm, selectedStatus, selectedType, selectedSector]);

  // Handler: Add New Protocol
  const handleCreateProtocol = (e) => {
    e.preventDefault();
    if (!newProtocol.companyName || !newProtocol.contactPerson) {
      if (window.toast?.error) {
        window.toast.error('Lütfen kurum adı ve yetkili kişi bilgilerini doldurunuz.');
      }
      return;
    }

    const nextSeq = protocols.length + 1;
    const protocolCode = generateProtocolCode(nextSeq);
    const createdItem = {
      ...newProtocol,
      id: `PRT-2026-${String(nextSeq).padStart(3, '0')}`,
      protocolCode,
      committedQuota: Number(newProtocol.committedQuota || 0),
      placedCount: Number(newProtocol.placedCount || 0),
      status: PROTOCOL_STATUS.ACTIVE,
      isOfficialSenateApproved: true,
      senateDecisionNo: `2026/${String(nextSeq).padStart(2, '0')}-01`,
    };

    if (addCorporateProtocol) {
      addCorporateProtocol(createdItem);
    }
    const updatedList = [createdItem, ...protocols];
    if (setCorporateProtocols) setCorporateProtocols(updatedList);

    setShowAddModal(false);
    if (window.toast?.success) {
      window.toast.success(`Resmî protokol oluşturuldu: ${protocolCode}`);
    }
  };

  // Handler: Renew Protocol
  const handleRenewProtocolSubmit = (e) => {
    e.preventDefault();
    if (!selectedProtocol) return;

    const currentExpiry = new Date(selectedProtocol.validUntil || new Date());
    const validUntilDate = isNaN(currentExpiry.getTime()) ? new Date() : currentExpiry;
    validUntilDate.setFullYear(validUntilDate.getFullYear() + Number(renewalForm.additionalYears || 1));
    const newValidUntil = validUntilDate.toISOString().split('T')[0];

    const updatedList = protocols.map((p) => {
      if (p.id === selectedProtocol.id || p.protocolCode === selectedProtocol.protocolCode) {
        return {
          ...p,
          validUntil: newValidUntil,
          committedQuota: Number(p.committedQuota || 0) + Number(renewalForm.additionalQuota || 0),
          status: PROTOCOL_STATUS.ACTIVE,
          notes: `${p.notes ? p.notes + ' | ' : ''}Yenilendi: +${renewalForm.additionalYears} yıl, +${renewalForm.additionalQuota} kontenjan (${new Date().toLocaleDateString('tr-TR')})`,
        };
      }
      return p;
    });

    if (renewCorporateProtocol) {
      renewCorporateProtocol(selectedProtocol.protocolCode || selectedProtocol.id, newValidUntil, Number(renewalForm.additionalQuota || 0));
    }
    if (setCorporateProtocols) setCorporateProtocols(updatedList);

    setShowRenewModal(false);
    setSelectedProtocol(null);
    if (window.toast?.success) {
      window.toast.success(`Protokol başarıyla uzatıldı ve yenilendi: ${selectedProtocol.protocolCode || selectedProtocol.companyName}`);
    }
  };

  // Handler: Terminate Protocol
  const handleTerminateProtocol = (protocol) => {
    if (!window.confirm(`${protocol.companyName} ile olan iş birliği protokolünü askıya almak / feshetmek istediğinize emin misiniz?`)) {
      return;
    }
    const updatedList = protocols.map((p) => {
      if (p.id === protocol.id || p.protocolCode === protocol.protocolCode) {
        return {
          ...p,
          status: PROTOCOL_STATUS.TERMINATED,
          terminatedAt: new Date().toISOString(),
          notes: `${p.notes ? p.notes + ' | ' : ''}Protokol feshedildi / askıya alındı (${new Date().toLocaleDateString('tr-TR')})`,
        };
      }
      return p;
    });

    if (terminateCorporateProtocol) {
      terminateCorporateProtocol(protocol.protocolCode || protocol.id, 'Feshedildi / Askıya Alındı');
    }
    if (setCorporateProtocols) setCorporateProtocols(updatedList);

    if (window.toast?.info) {
      window.toast.info(`Protokol askıya alındı: ${protocol.protocolCode || protocol.companyName}`);
    }
  };

  // Handler: Add Sector Mentor
  const handleAddSectorMentor = (e) => {
    e.preventDefault();
    if (!newMentor.name || !newMentor.company) {
      if (window.toast?.error) window.toast.error('Lütfen hami adı ve firma bilgilerini giriniz.');
      return;
    }
    const expList = typeof newMentor.expertise === 'string'
      ? newMentor.expertise.split(',').map((x) => x.trim()).filter(Boolean)
      : [];
    const createdMentor = {
      ...newMentor,
      id: `SM-${Date.now()}`,
      expertise: expList.length > 0 ? expList : ['Üniversite - Sanayi İş Birliği'],
      menteeCapacity: Number(newMentor.menteeCapacity || 5),
      activeMentees: 0,
      isAdvisoryBoardMember: true,
    };
    if (addSectorMentor) {
      addSectorMentor(createdMentor);
    }
    const updated = [createdMentor, ...sectorMentors];
    if (setSectorMentors) setSectorMentors(updated);

    setShowAddMentorModal(false);
    if (window.toast?.success) {
      window.toast.success(`Yeni sektör hamisi başarıyla kaydedildi: ${createdMentor.name}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0A2342] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-black tracking-wider uppercase">
                {PROTOCOL_STANDARDS.INSTITUTION_NAME}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold">
                {PROTOCOL_STANDARDS.COORDINATOR_UNIT}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kurumsal Protokol & Sanayi CRM
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Üniversite - sanayi resmî iş birliği protokolleri, taahhüt edilen stajyer & istihdam kontenjanları,
              İŞKUR İş Kulübü, ESBİM yerel istihdam köprüsü ve Senato raporlama masası.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                exportSenateProtocolPdf({
                  protocols,
                  sectorMentors,
                  esbimEvents,
                  iskurCohorts,
                  period: '2025-2026 Akademik Yılı',
                });
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center gap-2 shadow-sm cursor-pointer"
              title="Resmî Senato PDF Raporunu Yazdır / İndir"
            >
              <Printer size={15} />
              <span>Senato PDF Raporu</span>
            </button>
            <button
              type="button"
              onClick={() => {
                downloadSenateProtocolCsv({
                  protocols,
                  sectorMentors,
                  period: '2025-2026 Akademik Yılı',
                });
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              title="Excel / CSV Kütüğü İndir"
            >
              <Download size={15} />
              <span>Excel / CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-[#990000] hover:bg-[#b30000] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Yeni Protokol Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Toplam Protokol</span>
            <Building2 size={16} className="text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{aggregateStats.totalProtocols}</div>
          <p className="text-[10px] text-slate-400 mt-0.5">Resmî Senato onaylı</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Aktif Protokol</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800">{aggregateStats.activeProtocols}</div>
          <p className="text-[10px] text-emerald-600 mt-0.5">Yürürlükte olan anlaşmalar</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Süresi Yaklaşan</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800">
            {aggregateStats.expiringSoonProtocols + aggregateStats.renewalRequestedProtocols}
          </div>
          <p className="text-[10px] text-amber-600 mt-0.5">Son 30 gün & yenileme</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-blue-200/80 shadow-xs bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Taahhüt Kontenjan</span>
            <Briefcase size={16} className="text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-900">{aggregateStats.totalCommittedQuota}</div>
          <p className="text-[10px] text-blue-600 mt-0.5">Staj & İstihdam Kapasitesi</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-indigo-200/80 shadow-xs bg-indigo-50/20 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-indigo-700 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Yerleşen & Doluluk</span>
            <TrendingUp size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-900">{aggregateStats.totalPlacedCount}</span>
            <span className="text-xs font-bold text-indigo-600">(%{aggregateStats.overallFillRate})</span>
          </div>
          <div className="w-full bg-indigo-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, aggregateStats.overallFillRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('protocols')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'protocols'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 size={15} />
          <span>Protokoller & Kontenjan CRM ({protocols.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('iskur_esbim')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'iskur_esbim'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={15} />
          <span>İŞKUR & ESBİM Entegrasyon Köprüsü</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advisory_board')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'advisory_board'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award size={15} />
          <span>Sektörel Danışma Kurulu & Hamiler ({sectorMentors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('senate_report')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'senate_report'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText size={15} />
          <span>Senato & Rektörlük Rapor Masası</span>
        </button>
      </div>

      {/* ─── TAB 1: PROTOCOLS & CRM LIST ─── */}
      {activeTab === 'protocols' && (
        <div className="space-y-4">
          {/* SEARCH & FILTERS BAR */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Firma adı, protokol kodu veya sektör ara..."
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="ALL">Tüm Durumlar</option>
                <option value="ACTIVE">Aktif Protokoller</option>
                <option value="EXPIRING_SOON">Süresi Yaklaşan (30 Gün)</option>
                <option value="RENEWAL_REQUESTED">Yenileme Talep Edildi</option>
                <option value="EXPIRED">Süresi Dolanlar</option>
                <option value="TERMINATED">Feshedilenler</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="ALL">Tüm Protokol Türleri</option>
                {Object.values(PROTOCOL_TYPES).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="ALL">Tüm Sektörler</option>
                {PROTOCOL_SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PROTOCOLS TABLE / LIST */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Protokol Kodu & Kurum</th>
                    <th className="p-3.5">Sektör & Tür</th>
                    <th className="p-3.5">Geçerlilik Tarihi</th>
                    <th className="p-3.5 text-center">Taahhüt / Yerleşen</th>
                    <th className="p-3.5 text-center">Doluluk (%)</th>
                    <th className="p-3.5 text-center">Durum</th>
                    <th className="p-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProtocols.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Kriterlere uygun kurumsal protokol kaydı bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredProtocols.map((p) => {
                      const quota = calculateQuotaFulfillment(p.committedQuota || p.slots, p.placedCount);
                      const st = calculateProtocolStatus(p);
                      const daysLeft = getDaysUntilExpiration(p.validUntil);

                      let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      if (st === PROTOCOL_STATUS.EXPIRING_SOON) {
                        badgeColor = 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse';
                      } else if (st === PROTOCOL_STATUS.EXPIRED || st === PROTOCOL_STATUS.TERMINATED) {
                        badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                      } else if (st === PROTOCOL_STATUS.RENEWAL_REQUESTED) {
                        badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                      }

                      return (
                        <tr key={p.id || p.protocolCode} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <SafeAvatar
                                src={p.logo}
                                name={p.companyName}
                                size="md"
                                rounded="rounded-xl"
                                className="border border-slate-200 bg-white"
                              />
                              <div>
                                <div className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                                  <span>{p.companyName}</span>
                                  {p.isOfficialSenateApproved && (
                                    <span
                                      className="inline-flex items-center text-[9px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-bold"
                                      title={`Senato Karar No: ${p.senateDecisionNo || 'Onaylı'}`}
                                    >
                                      Senato Onaylı
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                  {p.protocolCode || p.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-slate-800 text-[11px]">{p.sector}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {p.protocolType || PROTOCOL_TYPES.COOPERATION}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="text-slate-700 font-bold text-[11px]">{p.validUntil}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {daysLeft !== null && daysLeft >= 0 ? (
                                <span className={daysLeft <= 30 ? 'text-amber-600 font-bold' : ''}>
                                  {daysLeft} gün kaldı
                                </span>
                              ) : daysLeft !== null ? (
                                <span className="text-rose-600 font-bold">
                                  {Math.abs(daysLeft)} gün önce doldu
                                </span>
                              ) : (
                                '-'
                              )}
                            </div>
                          </td>

                          <td className="p-3.5 text-center">
                            <span className="font-bold text-slate-800">{quota.placedCount}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="font-bold text-slate-500">{quota.committedQuota}</span>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Kalan: {quota.remainingQuota}
                            </div>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="font-black text-slate-900 text-xs">%{quota.fillRate}</div>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  quota.fillRate >= 80
                                    ? 'bg-emerald-500'
                                    : quota.fillRate >= 50
                                    ? 'bg-blue-500'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, quota.fillRate)}%` }}
                              />
                            </div>
                          </td>

                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeColor}`}
                            >
                              {PROTOCOL_STATUS_LABELS[st] || st}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProtocol(p);
                                  setShowDetailModal(true);
                                }}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                                title="Protokol Detayları"
                              >
                                Detay
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProtocol(p);
                                  setShowRenewModal(true);
                                }}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-[11px] transition-colors border border-amber-200 cursor-pointer"
                                title="Süreyi Uzat & Kontenjan Ekle"
                              >
                                Yenile
                              </button>
                              {st !== PROTOCOL_STATUS.TERMINATED && (
                                <button
                                  type="button"
                                  onClick={() => handleTerminateProtocol(p)}
                                  className="px-2 py-1 text-slate-400 hover:text-rose-600 font-bold text-[11px] transition-colors cursor-pointer"
                                  title="Feshet / Askıya Al"
                                >
                                  Askıya Al
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: İŞKUR & ESBİM INTEGRATION DESK ─── */}
      {activeTab === 'iskur_esbim' && (
        <div className="space-y-6">
          {/* Institutional Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ESBİM Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Building2 size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Yerel Yönetim & Kamu İstihdam Masası
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {PROTOCOL_STANDARDS.ESBIM_PARTNER}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Esenyurt sanayi bölgesindeki 4.000+ imalat, lojistik ve teknoloji firmasıyla üniversitemiz
                    öğrenci/mezun havuzunun doğrudan eşleştiği resmî yerel istihdam köprüsü.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-black text-slate-900">120</div>
                  <div className="text-[10px] font-bold text-slate-500">Taahhüt Kontenjan</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-black text-emerald-700">92</div>
                  <div className="text-[10px] font-bold text-slate-500">İstihdam Edilen</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-black text-blue-700">%76.7</div>
                  <div className="text-[10px] font-bold text-slate-500">Doluluk Oranı</div>
                </div>
              </div>
            </div>

            {/* İŞKUR Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    Kamu İstihdam Kurumu Protokolü
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    İŞKUR İş Kulübü & İstihdam Masası
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Öğrencilerimize mezuniyet öncesi mülakat simülasyonları, yetkinlik bazlı özgeçmiş tasarımı ve
                    resmî iş kulübü sertifikasyon programları sunan ulusal istihdam entegrasyonu.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-black text-slate-900">200</div>
                  <div className="text-[10px] font-bold text-slate-500">Yıllık Kontenjan</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-black text-blue-700">165</div>
                  <div className="text-[10px] font-bold text-slate-500">Sertifika Alan</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <div className="text-lg font-black text-emerald-700">%82.5</div>
                  <div className="text-[10px] font-bold text-slate-500">Başarı Oranı</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: İŞKUR İş Kulübü Eğitim Kohortları */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-600" />
                  İŞKUR İş Kulübü Eğitim Kohortları & Kontenjan Durumu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Her dönem 25 kişilik özel gruplar halinde uygulanan yoğun kariyer hazırlık kampı
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {iskurCohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{cohort.cohortName}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Eğitmen: {cohort.trainer}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cohort.status === 'Tamamlandı'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {cohort.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <span>
                      Tarih: <strong>{cohort.startDate}</strong> → <strong>{cohort.endDate}</strong>
                    </span>
                    <span>
                      Kapasite:{' '}
                      <strong>
                        {cohort.enrolledCount} / {cohort.capacity}
                      </strong>
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Tamamlanma Oranı</span>
                      <span>%{cohort.completionRate}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${cohort.completionRate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {cohort.modulesCompleted.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: ESBİM Toplu Mülakat & Kariyer Günleri Takvimi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-600" />
                  ESBİM Yerel Sanayi Toplu Mülakat Takvimi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esenyurt sanayi firmalarının kampüste gerçekleştirdiği doğrudan istihdam mülakatları
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {esbimEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{evt.title}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                        {evt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {evt.date} ({evt.time})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {evt.location}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 pt-1">
                      <strong>Katılımcı Firmalar:</strong> {evt.partnerCompanies.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-slate-200 sm:pl-4">
                    <div className="text-center">
                      <div className="text-lg font-black text-blue-700">{evt.openPositionsQuota}</div>
                      <div className="text-[10px] font-bold text-slate-400">Açık Kontenjan</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-black text-emerald-700">{evt.registeredCandidatesCount}</div>
                      <div className="text-[10px] font-bold text-slate-400">Başvuran Aday</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: ESBİM Yerel İstihdam & Aday Eşleştirme Masası (Canlı Eşleştirme Paneli) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  ESBİM Yerel Sanayi & Öğrenci/Mezun Eşleştirme Masası
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esenyurt, Avcılar, Beylikdüzü ve Hadımköy sanayi havzasındaki açık iş ilanlarıyla öğrenci bölüm ve ikamet uyum algoritması
                </p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                Canlı Eşleştirme Motoru Aktif
              </span>
            </div>

            {/* Aday Arama / Giriş Masası */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Aday Adı Soyadı</label>
                <input
                  type="text"
                  value={candidateForm.name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  placeholder="Örn: Ahmet Can Kaya"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Bölüm / Uzmanlık Alanı</label>
                <select
                  value={candidateForm.department}
                  onChange={(e) => setCandidateForm({ ...candidateForm, department: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Lojistik Yönetimi">Lojistik Yönetimi</option>
                  <option value="Bilgisayar">Bilgisayar / Yazılım Mühendisliği</option>
                  <option value="Makine">Makine / İmalat Mühendisliği</option>
                  <option value="İşletme">İşletme / İktisat / Finans</option>
                  <option value="Dış Ticaret">Dış Ticaret / Uluslararası Ticaret</option>
                  <option value="Endüstri">Endüstri Mühendisliği</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">İkamet İlçesi</label>
                <select
                  value={candidateForm.district}
                  onChange={(e) => setCandidateForm({ ...candidateForm, district: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Esenyurt">Esenyurt (Merkez Havza)</option>
                  <option value="Beylikdüzü">Beylikdüzü</option>
                  <option value="Avcılar">Avcılar</option>
                  <option value="Hadımköy">Hadımköy / Arnavutköy</option>
                  <option value="Başakşehir">Başakşehir</option>
                </select>
              </div>
            </div>

            {/* Eşleşen Pozisyonlar */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Eşleşen ESBİM Açık Pozisyonları ({esbimMatches.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">Aday: {candidateForm.name} ({candidateForm.department} — {candidateForm.district})</span>
              </div>

              {esbimMatches.map(({ vacancy: vac, matchScore, isRecommended }) => (
                <div
                  key={vac.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isRecommended ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{vac.title}</h4>
                      {isRecommended && (
                        <span className="text-[9.5px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.2 rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> Önerilen Eşleşme
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      <strong>{vac.company}</strong> — <span className="text-slate-600">{vac.district}, {vac.city}</span> ({vac.type}) | Alan: {vac.field}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-black text-slate-900">Uyum: %{matchScore}</div>
                      <div className="text-[10px] text-slate-400">Açık: {vac.openQuota} Kontenjan</div>
                    </div>
                    <button
                      type="button"
                      disabled={Boolean(referredVacancies[vac.id])}
                      onClick={() => handleReferCandidate(vac.id, vac.title)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        referredVacancies[vac.id]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {referredVacancies[vac.id] ? (
                        <>
                          <Check size={13} />
                          <span>Sevk Edildi</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>ESBİM'e Sevk Et</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SECTORAL ADVISORY BOARD & MENTORS ─── */}
      {activeTab === 'advisory_board' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Sektörel Danışma Kurulu & Hami Mentor Havuzu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Protokollü şirketlerin üst düzey yöneticileri ve fakültelerimizle eşleşen sektör hamileri
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-600">
                Görüntülenen: <strong className="text-slate-900">{filteredSectorMentors.length} / {sectorMentors.length} Hami</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowAddMentorModal(true)}
                className="px-3 py-1.5 bg-[#990000] hover:bg-[#b30000] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Yeni Hami Ekle</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar for Mentors */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={advisorySearchTerm}
                onChange={(e) => setAdvisorySearchTerm(e.target.value)}
                placeholder="Hami adı, unvan, firma veya uzmanlık ara..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={advisorySelectedSector}
                onChange={(e) => setAdvisorySelectedSector(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="ALL">Tüm Sektörler</option>
                {PROTOCOL_SECTORS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                value={advisorySelectedDept}
                onChange={(e) => setAdvisorySelectedDept(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-white font-medium text-slate-700"
              >
                <option value="ALL">Tüm Bölüm Eşleşmeleri</option>
                <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                <option value="Yazılım Mühendisliği">Yazılım Mühendisliği</option>
                <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                <option value="İşletme">İşletme</option>
                <option value="Psikoloji">Psikoloji</option>
                <option value="Lojistik">Lojistik</option>
              </select>
            </div>
          </div>

          {filteredSectorMentors.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Kriterlere uygun sektör danışma kurulu üyesi veya hami bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSectorMentors.map((m) => (
                <div
                  key={m.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <SafeAvatar
                        src={m.avatar}
                        name={m.name}
                        size="lg"
                        rounded="rounded-2xl"
                        className="border border-slate-200 bg-slate-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 text-xs truncate">{m.name}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{m.title}</p>
                        <p className="text-[11px] font-bold text-blue-900 mt-0.5 truncate">{m.company}</p>
                      </div>
                    </div>

                    <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span className="text-[11px]">Protokol Kodu:</span>
                        <code className="font-mono text-[11px] font-bold text-slate-800">{m.protocolCode}</code>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-[11px]">Eşleştiği Bölüm:</span>
                        <span className="font-bold text-slate-800 text-[11px]">{m.assignedDepartment}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-[11px]">Görev Dönemi:</span>
                        <span className="text-[11px] text-slate-700 font-medium">{m.term || '2025-2027'}</span>
                      </div>
                    </div>

                    {m.expertise && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(Array.isArray(m.expertise) ? m.expertise : [m.expertise]).map((exp) => (
                          <span
                            key={exp}
                            className="text-[9.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Hami Kontenjanı
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {m.activeMentees} / {m.menteeCapacity} Öğrenci
                      </span>
                    </div>
                    <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (m.activeMentees / m.menteeCapacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 4: SENATE & RECTORATE REPORT DESK ─── */}
      {activeTab === 'senate_report' && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Resmî Belge İhracı
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Senato & Rektörlük Resmî Protokol ve Kontenjan Denetim Raporu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  2547 Sayılı Kanun Ek Md. 35 ve YÖK Kurumsal İş Birliği Göstergesi Uyarınca Tanzim Edilmiştir
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSenatePreviewModal(true)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Eye size={15} />
                  <span>Belgeyi Önizle</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportSenateProtocolPdf({
                      protocols,
                      sectorMentors,
                      esbimEvents,
                      iskurCohorts,
                      period: '2025-2026 Akademik Yılı',
                    });
                  }}
                  className="px-4 py-2 bg-[#990000] hover:bg-[#b30000] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>Resmî PDF Yazdır / İhraç Et</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadSenateProtocolCsv({
                      protocols,
                      sectorMentors,
                      period: '2025-2026 Akademik Yılı',
                    });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Excel (CSV) İndir</span>
                </button>
              </div>
            </div>

            {/* Document Preview Snapshot */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4 font-mono text-xs">
              <div className="text-center space-y-0.5">
                <div className="font-bold text-slate-900">T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ</div>
                <div className="text-slate-600 text-[11px]">Kariyer Geliştirme Koordinatörlüğü</div>
                <div className="font-bold text-red-900 text-xs pt-1">
                  KURUMSAL PROTOKOL & SANAYİ CRM SENATO FAALİYET RAPORU (2025-2026)
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-slate-700 text-[11px]">
                <div>
                  <strong>Toplam Protokol:</strong> {aggregateStats.totalProtocols} Firma/Kurum
                </div>
                <div>
                  <strong>Aktif Protokol:</strong> {aggregateStats.activeProtocols} Protokol
                </div>
                <div>
                  <strong>Taahhüt Kontenjan:</strong> {aggregateStats.totalCommittedQuota} Kontenjan
                </div>
                <div>
                  <strong>Genel Doluluk:</strong> %{aggregateStats.overallFillRate}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                <span>Rapor Referans No: İESÜ-SENATO-PRT-2026-091</span>
                <span>Tanzim Tarihi: {new Date().toLocaleDateString('tr-TR')}</span>
                <span>Onay: Rektörlük Makamı & Senato</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: YENİ RESMÎ PROTOKOL EKLEME ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Yeni Resmî İş Birliği Protokolü</h3>
                <p className="text-xs text-slate-500">
                  Rektörlük / Kariyer Geliştirme Koordinatörlüğü adına imzalanan kurumsal sözleşme
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProtocol} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Firma / Kurum Adı *</label>
                <input
                  type="text"
                  required
                  value={newProtocol.companyName}
                  onChange={(e) => setNewProtocol({ ...newProtocol, companyName: e.target.value })}
                  placeholder="Örn: Baykar Teknoloji, THY Teknik A.Ş."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sektör *</label>
                  <select
                    value={newProtocol.sector}
                    onChange={(e) => setNewProtocol({ ...newProtocol, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {PROTOCOL_SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Protokol Türü *</label>
                  <select
                    value={newProtocol.protocolType}
                    onChange={(e) => setNewProtocol({ ...newProtocol, protocolType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {Object.values(PROTOCOL_TYPES).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taahhüt Kontenjan (Sayı) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProtocol.committedQuota}
                    onChange={(e) => setNewProtocol({ ...newProtocol, committedQuota: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Yerleşen (Başlangıç)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProtocol.placedCount}
                    onChange={(e) => setNewProtocol({ ...newProtocol, placedCount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">İmza Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={newProtocol.signedDate}
                    onChange={(e) => setNewProtocol({ ...newProtocol, signedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Geçerlilik Bitiş Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={newProtocol.validUntil}
                    onChange={(e) => setNewProtocol({ ...newProtocol, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Yetkili Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    value={newProtocol.contactPerson}
                    onChange={(e) => setNewProtocol({ ...newProtocol, contactPerson: e.target.value })}
                    placeholder="Örn: Dr. Mehmet Yılmaz"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Yetkili E-posta</label>
                  <input
                    type="email"
                    value={newProtocol.contactEmail}
                    onChange={(e) => setNewProtocol({ ...newProtocol, contactEmail: e.target.value })}
                    placeholder="ornek@firma.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Protokol Kapsamı</label>
                <textarea
                  rows={2}
                  value={newProtocol.scope}
                  onChange={(e) => setNewProtocol({ ...newProtocol, scope: e.target.value })}
                  placeholder="Staj ve istihdam kapsamı, burs imkanları ve akademik iş birliği maddeleri..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#b30000] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Protokolü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: PROTOKOL YENİLEME / UZATMA ─── */}
      {showRenewModal && selectedProtocol && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Protokol Süre ve Kontenjan Yenileme</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedProtocol.companyName}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRenewModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRenewProtocolSubmit} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <div className="font-bold">Mevcut Bitiş: {selectedProtocol.validUntil}</div>
                <div className="text-[11px] mt-0.5">
                  Mevcut Kontenjan: {selectedProtocol.committedQuota || selectedProtocol.slots} (Yerleşen:{' '}
                  {selectedProtocol.placedCount || 0})
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Eklenecek Süre (Yıl) *</label>
                <select
                  value={renewalForm.additionalYears}
                  onChange={(e) => setRenewalForm({ ...renewalForm, additionalYears: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  <option value={1}>+1 Yıl Uzat</option>
                  <option value={2}>+2 Yıl Uzat</option>
                  <option value={3}>+3 Yıl Uzat</option>
                  <option value={5}>+5 Yıl Uzat</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">İlave Edilecek Kontenjan (Sayı)</label>
                <input
                  type="number"
                  min="0"
                  value={renewalForm.additionalQuota}
                  onChange={(e) => setRenewalForm({ ...renewalForm, additionalQuota: e.target.value })}
                  placeholder="Örn: 10"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Yenileme Notu</label>
                <input
                  type="text"
                  value={renewalForm.notes}
                  onChange={(e) => setRenewalForm({ ...renewalForm, notes: e.target.value })}
                  placeholder="Senato karar no veya ek protokol maddesi..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Yenile ve Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: DETAY GÖRÜNÜMÜ ─── */}
      {showDetailModal && selectedProtocol && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <SafeAvatar
                  src={selectedProtocol.logo}
                  name={selectedProtocol.companyName}
                  size="lg"
                  rounded="rounded-2xl"
                  className="border border-slate-200"
                />
                <div>
                  <h3 className="font-black text-slate-900 text-base">{selectedProtocol.companyName}</h3>
                  <code className="text-xs text-slate-400 font-mono">
                    {selectedProtocol.protocolCode || selectedProtocol.id}
                  </code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sektör:</span>
                <span className="font-bold">{selectedProtocol.sector}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Protokol Türü:</span>
                <span className="font-bold">{selectedProtocol.protocolType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Geçerlilik:</span>
                <span className="font-bold">
                  {selectedProtocol.signedDate} → {selectedProtocol.validUntil}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Taahhüt Kontenjan:</span>
                <span className="font-bold text-slate-900">
                  {selectedProtocol.committedQuota || selectedProtocol.slots}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Yerleşen Öğrenci:</span>
                <span className="font-bold text-emerald-700">{selectedProtocol.placedCount || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">İletişim Sorumlusu:</span>
                <span className="font-bold">
                  {selectedProtocol.contactPerson} ({selectedProtocol.contactEmail || 'E-posta yok'})
                </span>
              </div>
              <div className="py-2 border-b border-slate-100">
                <span className="text-slate-500 block mb-0.5">Kapsam:</span>
                <p className="font-medium text-slate-800 leading-relaxed">{selectedProtocol.scope}</p>
              </div>
              {selectedProtocol.notes && (
                <div className="py-2">
                  <span className="text-slate-500 block mb-0.5">Notlar & Senato Kaydı:</span>
                  <p className="font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedProtocol.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: YENİ SEKTÖR HAMİSİ EKLEME ─── */}
      {showAddMentorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-base">Yeni Sektör Hamisi / Danışma Kurulu Üyesi</h3>
                <p className="text-xs text-slate-500">
                  Fakülte ve bölümlerimize atanan sektör lideri / kurumsal mentör
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMentorModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSectorMentor} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adı Soyadı *</label>
                  <input
                    type="text"
                    required
                    value={newMentor.name}
                    onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                    placeholder="Örn: Dr. Aslı Yılmaz"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unvan / Pozisyon *</label>
                  <input
                    type="text"
                    required
                    value={newMentor.title}
                    onChange={(e) => setNewMentor({ ...newMentor, title: e.target.value })}
                    placeholder="Örn: Ar-Ge Direktörü"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Firma / Kurum *</label>
                  <input
                    type="text"
                    required
                    value={newMentor.company}
                    onChange={(e) => setNewMentor({ ...newMentor, company: e.target.value })}
                    placeholder="Örn: Baykar, Turkcell"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Protokol Kodu</label>
                  <select
                    value={newMentor.protocolCode}
                    onChange={(e) => setNewMentor({ ...newMentor, protocolCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {protocols.map((p) => (
                      <option key={p.protocolCode || p.id} value={p.protocolCode || p.id}>
                        {p.protocolCode || p.id} ({p.companyName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sektör *</label>
                  <select
                    value={newMentor.sector}
                    onChange={(e) => setNewMentor({ ...newMentor, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {PROTOCOL_SECTORS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Eşleştiği Bölüm *</label>
                  <select
                    value={newMentor.assignedDepartment}
                    onChange={(e) => setNewMentor({ ...newMentor, assignedDepartment: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
                    <option value="Yazılım Mühendisliği">Yazılım Mühendisliği</option>
                    <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
                    <option value="Makine Mühendisliği">Makine Mühendisliği</option>
                    <option value="İşletme">İşletme</option>
                    <option value="Lojistik Yönetimi">Lojistik Yönetimi</option>
                    <option value="Psikoloji">Psikoloji</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Uzmanlık Alanları (Virgülle ayırın)</label>
                <input
                  type="text"
                  value={newMentor.expertise}
                  onChange={(e) => setNewMentor({ ...newMentor, expertise: e.target.value })}
                  placeholder="Örn: Yapay Zeka, Otonom Sistemler, Bulut Bilişim"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hami Kontenjanı (Öğrenci Sayısı)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={newMentor.menteeCapacity}
                    onChange={(e) => setNewMentor({ ...newMentor, menteeCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kurul Görev Dönemi</label>
                  <input
                    type="text"
                    value={newMentor.term}
                    onChange={(e) => setNewMentor({ ...newMentor, term: e.target.value })}
                    placeholder="2025-2027"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMentorModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#b30000] text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Hamiyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: RESMÎ SENATO RAPORU CANLI ÖNİZLEME ─── */}
      {showSenatePreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-scale-in max-h-[92vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#990000] text-white font-black flex items-center justify-center text-xs tracking-wider">
                  İESÜ
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    Senato & Rektörlük Resmî Protokol ve Kontenjan Denetim Raporu
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    2547 Sayılı Kanun Ek Md. 35 & YÖK Kurumsal İş Birliği Kriterleri
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    exportSenateProtocolPdf({
                      protocols,
                      sectorMentors,
                      esbimEvents,
                      iskurCohorts,
                    });
                  }}
                  className="px-3 py-1.5 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-[#b30000] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Yazdır / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSenatePreviewModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Document Header */}
            <div className="text-center space-y-1 pb-4 border-b border-slate-100">
              <div className="text-xs font-bold uppercase tracking-widest text-[#990000]">
                T.C. İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ
              </div>
              <div className="text-sm font-black text-slate-900">
                Kariyer Geliştirme Koordinatörlüğü — Senato & Rektörlük Protokol Masası
              </div>
              <div className="text-xs text-slate-500">
                Resmî Üniversite - Sanayi İş Birliği, İŞKUR & ESBİM İstihdam Kontenjanı Denetim Raporu
              </div>
            </div>

            {/* KPI Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Toplam Protokol</div>
                <div className="text-base font-black text-slate-900">{aggregateStats.totalProtocols}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-[10px] uppercase font-bold text-emerald-700">Aktif Protokol</div>
                <div className="text-base font-black text-emerald-800">{aggregateStats.activeProtocols}</div>
              </div>
              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-[10px] uppercase font-bold text-blue-700">Taahhüt Kontenjan</div>
                <div className="text-base font-black text-blue-900">{aggregateStats.totalCommittedQuota}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-[10px] uppercase font-bold text-emerald-700">Yerleşen Öğrenci</div>
                <div className="text-base font-black text-emerald-800">{aggregateStats.totalPlacedCount}</div>
              </div>
              <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-red-700">Doluluk Oranı</div>
                <div className="text-base font-black text-red-900">%{aggregateStats.overallFillRate}</div>
              </div>
            </div>

            {/* Protocol Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                1. Yürürlükteki Kurumsal İş Birliği Protokolleri
              </h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2">Kod</th>
                      <th className="p-2">Kurum / Firma</th>
                      <th className="p-2">Sektör</th>
                      <th className="p-2 text-center">Bitiş</th>
                      <th className="p-2 text-center">Taahhüt</th>
                      <th className="p-2 text-center">Yerleşen</th>
                      <th className="p-2 text-center">Doluluk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {protocols.slice(0, 8).map((p) => {
                      const q = calculateQuotaFulfillment(p.committedQuota || p.slots, p.placedCount);
                      return (
                        <tr key={p.id || p.protocolCode}>
                          <td className="p-2 font-mono font-bold text-slate-700">{p.protocolCode || p.id}</td>
                          <td className="p-2 font-bold text-slate-900">{p.companyName}</td>
                          <td className="p-2 text-slate-600">{p.sector}</td>
                          <td className="p-2 text-center text-slate-500">{p.validUntil}</td>
                          <td className="p-2 text-center font-bold text-slate-800">{q.committedQuota}</td>
                          <td className="p-2 text-center font-bold text-emerald-700">{q.placedCount}</td>
                          <td className="p-2 text-center font-bold text-slate-900">%{q.fillRate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resmî Onay ve İmza Blokları */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Raporu Tanzim Eden</div>
                <div className="font-bold text-slate-900 mt-1">Kariyer Geliştirme Koordinatörlüğü</div>
                <div className="text-[11px] text-slate-400 mt-0.5">İESÜ Kariyer Masası</div>
                <div className="mt-2 text-[10px] text-emerald-600 font-bold">[e-İmzalı / Paraflı]</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Tetkik Eden</div>
                <div className="font-bold text-slate-900 mt-1">Sanayi İş Birliği Komisyonu</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Senato Raportörlüğü</div>
                <div className="mt-2 text-[10px] text-emerald-600 font-bold">[e-İmzalı / Uygun Görüldü]</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-500">Makam Onayı / Tasdik</div>
                <div className="font-bold text-slate-900 mt-1">Prof. Dr. Süleyman Özdemir</div>
                <div className="text-[11px] text-slate-400 mt-0.5">İstanbul Esenyurt Üniversitesi Rektörü</div>
                <div className="mt-2 text-[10px] text-red-700 font-bold">[Mühürlü & Resmî Onaylı]</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              <span>Referans: İESÜ-SENATO-PRT-2026-091</span>
              <span>Sayfa 1 / 1 — 5070 Sayılı Elektronik İmza Kanunu Uyarınca Üretilmiştir</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
