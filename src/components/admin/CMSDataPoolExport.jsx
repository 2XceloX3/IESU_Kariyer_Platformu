import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { 
  Database, Download, Search, Activity, Server, Users, FlaskConical, Ticket, 
  FileText, CheckCircle2, Filter, Layers, ArrowUpRight, Sparkles, RefreshCw, 
  GraduationCap, MessageSquare, Building2, X, BookOpen, Check, Clock,
  Plus, Trash2, Edit3, Settings, ShieldCheck, AlertCircle, Send, MessageCircle, Eye
} from 'lucide-react';

export default function CMSDataPoolExport() {
  const [subTab, setSubTab] = useState('checkup'); // checkup, newsletter, bmi, helpdesk, labs, research_calls, manage_labs, manage_calls, edu_requests, company_msgs, surveys, alumni_assoc
  const [search, setSearch] = useState('');
  const [selectedCheckup, setSelectedCheckup] = useState(null);
  const [selectedGenericItem, setSelectedGenericItem] = useState(null);

  const bmiRecords = useAppStore(state => state.bmiRecords) || [];
  const helpdeskTickets = useAppStore(state => state.helpdeskTickets) || [];
  const labReservations = useAppStore(state => state.labReservations) || [];
  const updateLabReservationStatus = useAppStore(state => state.updateLabReservationStatus);
  const researchCallApplications = useAppStore(state => state.researchCallApplications) || [];
  const updateResearchCallApplicationStatus = useAppStore(state => state.updateResearchCallApplicationStatus);
  const eventRegistrations = useAppStore(state => state.eventRegistrations) || [];
  const surveys = useAppStore(state => state.surveys) || [];
  const checkupRecords = useAppStore(state => state.checkupRecords) || [];
  const newsletterSubscribers = useAppStore(state => state.newsletterSubscribers) || [];
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const alumniAssocApplications = useAppStore(state => state.alumniAssocApplications) || [];
  const alumniCardApplications = useAppStore(state => state.alumniCardApplications) || [];
  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);
  const setFeatureAlumniCard = useAppStore(state => state.setFeatureAlumniCard);

  // Ar-Ge & Proje Çağrıları Yönetimi Store Bağlantıları
  const researchLabs = useAppStore(state => state.researchLabs) || [];
  const addResearchLab = useAppStore(state => state.addResearchLab);
  const updateResearchLab = useAppStore(state => state.updateResearchLab);
  const deleteResearchLab = useAppStore(state => state.deleteResearchLab);

  const researchCalls = useAppStore(state => state.researchCalls) || [];
  const addResearchCall = useAppStore(state => state.addResearchCall);
  const updateResearchCall = useAppStore(state => state.updateResearchCall);
  const deleteResearchCall = useAppStore(state => state.deleteResearchCall);

  const researchConfig = useAppStore(state => state.researchConfig) || {};
  const updateResearchConfig = useAppStore(state => state.updateResearchConfig);
  const addNotification = useAppStore(state => state.addNotification);

  // Filter States for Labs and Calls
  const [labStatusFilter, setLabStatusFilter] = useState('Tümü');
  const [callStatusFilter, setCallStatusFilter] = useState('Tümü');

  // Revize Request Modal State
  const [reviseModalData, setReviseModalData] = useState(null); // { type: 'lab' | 'call', item: any }
  const [reviseNote, setReviseNote] = useState('');

  // Lab Edit/Create Modal State
  const [labModalOpen, setLabModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [labFormData, setLabFormData] = useState({
    id: '',
    name: '',
    location: '',
    equipment: '',
    capacity: '20 Araştırmacı',
    status: 'Aktif / Rezervasyona Açık'
  });

  // Call Edit/Create Modal State
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [editingCall, setEditingCall] = useState(null);
  const [callFormData, setCallFormData] = useState({
    id: '',
    title: '',
    lead: '',
    positions: '',
    deadline: '',
    budget: '',
    status: 'Aktif'
  });

  // New Time Slot State
  const [newTimeSlot, setNewTimeSlot] = useState('');

  // New Question Form State
  const [newLabQuestion, setNewLabQuestion] = useState({ label: '', options: '', required: true });
  const [newCallQuestion, setNewCallQuestion] = useState({ label: '', options: '', required: false });

  // Revize Submission Handler
  const handleSubmitRevise = (e) => {
    e.preventDefault();
    if (!reviseModalData) return;
    const { type, item } = reviseModalData;
    const note = reviseNote.trim() || 'Lütfen bilgilerinizi gözden geçirip revize ediniz.';

    if (type === 'lab') {
      if (updateLabReservationStatus) updateLabReservationStatus(item.id, 'Revize İstendi', note);
      if (addNotification) {
        addNotification({
          id: 'NOTIF-REV-' + Date.now(),
          type: 'warning',
          title: 'Laboratuvar Rezervasyonu Revize Talebi',
          message: `"${item.labName}" rezervasyonunuz için revize talep edildi: ${note}`
        });
      }
      window.toast && window.toast.success("Revize talebi ve açıklama akademisyene iletildi.");
    } else {
      if (updateResearchCallApplicationStatus) updateResearchCallApplicationStatus(item.id, 'Revize İstendi', note);
      if (addNotification) {
        addNotification({
          id: 'NOTIF-REV-' + Date.now(),
          type: 'warning',
          title: 'Proje Başvurusu Revize Talebi',
          message: `"${item.callTitle}" başvurunuz için revize talep edildi: ${note}`
        });
      }
      window.toast && window.toast.success("Revize talebi ve açıklama araştırmacıya/öğrenciye iletildi.");
    }
    setReviseModalData(null);
    setReviseNote('');
  };

  // Lab Management Handlers
  const handleOpenLabModal = (lab = null) => {
    if (lab) {
      setEditingLab(lab);
      setLabFormData({ ...lab });
    } else {
      setEditingLab(null);
      setLabFormData({
        id: 'LAB-' + (researchLabs.length + 1).toString().padStart(2, '0'),
        name: '',
        location: '',
        equipment: '',
        capacity: '20 Araştırmacı',
        status: 'Aktif / Rezervasyona Açık'
      });
    }
    setLabModalOpen(true);
  };

  const handleSaveLab = (e) => {
    e.preventDefault();
    if (!labFormData.name.trim()) {
      window.toast && window.toast.error("Lütfen laboratuvar adını giriniz.");
      return;
    }
    if (editingLab) {
      if (updateResearchLab) updateResearchLab(labFormData);
      window.toast && window.toast.success("Laboratuvar başarıyla güncellendi.");
    } else {
      if (addResearchLab) addResearchLab(labFormData);
      window.toast && window.toast.success("Yeni laboratuvar başarıyla eklendi.");
    }
    setLabModalOpen(false);
  };

  const handleDeleteLab = (id) => {
    if (window.confirm("Bu laboratuvarı katalogdan kaldırmak istediğinize emin misiniz?")) {
      if (deleteResearchLab) deleteResearchLab(id);
      window.toast && window.toast.success("Laboratuvar silindi.");
    }
  };

  // Call Management Handlers
  const handleOpenCallModal = (call = null) => {
    if (call) {
      setEditingCall(call);
      setCallFormData({ ...call });
    } else {
      setEditingCall(null);
      setCallFormData({
        id: 'CALL-' + (100 + researchCalls.length + 1),
        title: '',
        lead: '',
        positions: '',
        deadline: '',
        budget: '',
        status: 'Aktif'
      });
    }
    setCallModalOpen(true);
  };

  const handleSaveCall = (e) => {
    e.preventDefault();
    if (!callFormData.title.trim() || !callFormData.lead.trim()) {
      window.toast && window.toast.error("Lütfen çağrı başlığı ve yürütücü alanlarını doldurunuz.");
      return;
    }
    if (editingCall) {
      if (updateResearchCall) updateResearchCall(callFormData);
      window.toast && window.toast.success("Proje çağrısı güncellendi.");
    } else {
      if (addResearchCall) addResearchCall(callFormData);
      window.toast && window.toast.success("Yeni proje çağrısı başarıyla yayınlandı.");
    }
    setCallModalOpen(false);
  };

  const handleDeleteCall = (id) => {
    if (window.confirm("Bu proje çağrısını silmek istediğinize emin misiniz?")) {
      if (deleteResearchCall) deleteResearchCall(id);
      window.toast && window.toast.success("Proje çağrısı silindi.");
    }
  };

  // Time Slot Management Handlers
  const handleAddTimeSlot = (e) => {
    e.preventDefault();
    if (!newTimeSlot.trim()) return;
    const currentSlots = researchConfig.timeSlots || [
      "09:00 - 11:00 (Sabah Seansı)",
      "11:30 - 13:30 (Öğle Seansı)",
      "14:00 - 16:00 (Öğleden Sonra Seansı)",
      "16:30 - 18:30 (Akşam Seansı)"
    ];
    if (currentSlots.includes(newTimeSlot.trim())) {
      window.toast && window.toast.error("Bu seans saati zaten tanımlı.");
      return;
    }
    if (updateResearchConfig) {
      updateResearchConfig({ timeSlots: [...currentSlots, newTimeSlot.trim()] });
    }
    setNewTimeSlot('');
    window.toast && window.toast.success("Yeni seans saati eklendi.");
  };

  const handleDeleteTimeSlot = (slot) => {
    const currentSlots = researchConfig.timeSlots || [];
    if (updateResearchConfig) {
      updateResearchConfig({ timeSlots: currentSlots.filter(s => s !== slot) });
    }
    window.toast && window.toast.success("Seans saati kaldırıldı.");
  };

  // Custom Questions / Revision Criteria Handlers
  const handleAddLabQuestion = (e) => {
    e.preventDefault();
    if (!newLabQuestion.label.trim()) return;
    const currentQuestions = researchConfig.labCustomQuestions || [];
    const opts = newLabQuestion.options ? newLabQuestion.options.split(',').map(o => o.trim()).filter(Boolean) : [];
    const newQ = {
      id: 'q_' + Date.now().toString().slice(-4),
      label: newLabQuestion.label.trim(),
      type: opts.length > 0 ? 'select' : 'text',
      options: opts.length > 0 ? opts : undefined,
      required: newLabQuestion.required
    };
    if (updateResearchConfig) {
      updateResearchConfig({ labCustomQuestions: [...currentQuestions, newQ] });
    }
    setNewLabQuestion({ label: '', options: '', required: true });
    window.toast && window.toast.success("Yeni laboratuvar rezervasyon kriteri/sorusu eklendi.");
  };

  const handleDeleteLabQuestion = (id) => {
    const currentQuestions = researchConfig.labCustomQuestions || [];
    if (updateResearchConfig) {
      updateResearchConfig({ labCustomQuestions: currentQuestions.filter(q => q.id !== id) });
    }
    window.toast && window.toast.success("Kriter sorusu kaldırıldı.");
  };

  const handleAddCallQuestion = (e) => {
    e.preventDefault();
    if (!newCallQuestion.label.trim()) return;
    const currentQuestions = researchConfig.callCustomQuestions || [];
    const opts = newCallQuestion.options ? newCallQuestion.options.split(',').map(o => o.trim()).filter(Boolean) : [];
    const newQ = {
      id: 'cq_' + Date.now().toString().slice(-4),
      label: newCallQuestion.label.trim(),
      type: opts.length > 0 ? 'select' : 'text',
      options: opts.length > 0 ? opts : undefined,
      required: newCallQuestion.required
    };
    if (updateResearchConfig) {
      updateResearchConfig({ callCustomQuestions: [...currentQuestions, newQ] });
    }
    setNewCallQuestion({ label: '', options: '', required: false });
    window.toast && window.toast.success("Yeni proje çağrısı başvuru sorusu eklendi.");
  };

  const handleDeleteCallQuestion = (id) => {
    const currentQuestions = researchConfig.callCustomQuestions || [];
    if (updateResearchConfig) {
      updateResearchConfig({ callCustomQuestions: currentQuestions.filter(q => q.id !== id) });
    }
    window.toast && window.toast.success("Çağrı sorusu kaldırıldı.");
  };

  // UTF-8 BOM CSV / Excel Export Engine
  const exportToExcel = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) {
      window.toast && window.toast.error("Dışa aktarılacak veri bulunamadı.");
      return;
    }

    const headers = Object.keys(dataArray[0]);
    const csvRows = [];
    
    // Add Headers
    csvRows.push(headers.join(';'));

    // Add Rows
    for (const row of dataArray) {
      const values = headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(';'));
    }

    // Add UTF-8 BOM for Microsoft Excel Turkish character support
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.toast && window.toast.success(`"${filename}" Excel/CSV dosyası başarıyla indirildi.`);
  };

  const totalPoolRecords = checkupRecords.length + bmiRecords.length + helpdeskTickets.length + labReservations.length + researchCallApplications.length + eventRegistrations.length + surveys.length + newsletterSubscribers.length + careerFairApplications.length + adminMessages.length + alumniAssocApplications.length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Vibrant Fresh Glassmorphism Hero Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-teal-500/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow-sm">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white">
                <Database size={26} />
              </div>
              Veri Havuzu & Excel
            </h2>
            <p className="text-teal-50 text-xs md:text-sm font-medium mt-2 max-w-2xl leading-relaxed">
              Öğrenciler, akademisyenler ve mezunların sisteme gönderdiği tüm verileri canlı havuzda izleyin ve Microsoft Excel formatında indirin.
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">Toplam Havuz Kaydı</span>
              <span className="text-xl font-black text-white mt-0.5 block">{totalPoolRecords}</span>
            </div>
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">Aktif Veri Kanalları</span>
              <span className="text-xl font-black text-white mt-0.5 block">9 Havuz</span>
            </div>
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl col-span-2 sm:col-span-1 text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">Excel Uyum Formatı</span>
              <span className="text-xs font-black text-amber-200 mt-1 block">UTF-8 BOM (.csv/.xlsx)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap gap-1.5">
        <button
          onClick={() => { setSubTab('checkup'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'checkup' ? 'bg-[#990000] text-white shadow-md shadow-red-900/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity size={15} /> Kariyer Değerlendirme Analizleri ({checkupRecords.length})
        </button>

        <button
          onClick={() => { setSubTab('company_msgs'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'company_msgs' ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare size={15} /> Şirket Mesaj Talepleri ({adminMessages.length})
        </button>

        <button
          onClick={() => { setSubTab('edu_requests'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'edu_requests' ? 'bg-red-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 size={15} /> Eğitim & Etkinlik Talepleri ({careerFairApplications.length})
        </button>

        <button
          onClick={() => { setSubTab('newsletter'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'newsletter' ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={15} /> E-Bülten Aboneleri ({newsletterSubscribers.length})
        </button>

        <button
          onClick={() => { setSubTab('bmi'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'bmi' ? 'bg-teal-700 text-white shadow-md shadow-teal-900/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FlaskConical size={15} /> Vücut Kitle Endeksi & Sağlık ({bmiRecords.length})
        </button>

        <button
          onClick={() => { setSubTab('helpdesk'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'helpdesk' ? 'bg-blue-700 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Ticket size={15} /> BİDB Destek Talepleri ({helpdeskTickets.length})
        </button>

        <button
          onClick={() => { setSubTab('labs'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'labs' ? 'bg-cyan-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Server size={15} /> Lab Rezervasyonları ({labReservations.length})
        </button>

        <button
          onClick={() => { setSubTab('research_calls'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'research_calls' ? 'bg-purple-900 text-white shadow-md shadow-purple-950/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={15} /> Proje & Bursiyer Başvuruları ({researchCallApplications.length})
        </button>

        <button
          onClick={() => { setSubTab('manage_labs'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'manage_labs' ? 'bg-cyan-900 text-white shadow-md shadow-cyan-950/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings size={15} /> Ar-Ge Lab & Form Yönetimi ({researchLabs.length})
        </button>

        <button
          onClick={() => { setSubTab('manage_calls'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'manage_calls' ? 'bg-indigo-900 text-white shadow-md shadow-indigo-950/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings size={15} /> Proje Çağrıları & Soruları ({researchCalls.length})
        </button>

        <button
          onClick={() => { setSubTab('surveys'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'surveys' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText size={15} /> Mezun Anket Havuzu ({surveys.length})
        </button>

        <button
          onClick={() => { setSubTab('alumni_assoc'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'alumni_assoc' ? 'bg-rose-800 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap size={15} /> Mezun Derneği Başvuruları ({alumniAssocApplications.length})
        </button>

        <button
          onClick={() => { setSubTab('alumni_cards'); setSearch(''); }}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            subTab === 'alumni_cards' ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap size={15} /> Mezun Kart Başvuruları
        </button>
      </div>

      {/* Main Content Panels */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm min-h-[500px]">
        
        {/* SUB-PANEL: CHECK-UP ANALİZLERİ HAVUZU */}
        {subTab === 'checkup' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Öğrenci adı, fakülte veya bölüm ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(checkupRecords, 'IESU_Kariyer_Degerlendirme_Analizleri')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#990000] to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#990000] text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Analiz ID</th>
                    <th className="p-3.5">Öğrenci Ad Soyad</th>
                    <th className="p-3.5">Fakülte</th>
                    <th className="p-3.5">Bölüm / Sınıf</th>
                    <th className="p-3.5">Kariyer Skoru</th>
                    <th className="p-3.5">Seviye</th>
                    <th className="p-3.5">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {checkupRecords.filter(c => (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.department || '').toLowerCase().includes(search.toLowerCase())).map(c => (
                    <tr key={c.id} onClick={() => setSelectedCheckup(c)} className="hover:bg-red-50/50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-[#990000] font-black">{c.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-[#990000] flex items-center gap-1.5">{c.name} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                      <td className="p-3.5 text-slate-600">{c.faculty}</td>
                      <td className="p-3.5 font-semibold">{c.department} ({c.grade})</td>
                      <td className="p-3.5"><span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{c.score} / 100</span></td>
                      <td className="p-3.5 font-bold text-[#990000]">{c.level}</td>
                      <td className="p-3.5 text-slate-400 text-[10px]">{c.date}</td>
                    </tr>
                  ))}
                  {checkupRecords.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-gray-400 font-medium">Henüz kariyer değerlendirme analizi kaydı bulunmuyor.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: ŞİRKET YÖNETİCİ MESAJ TALEPLERİ HAVUZU */}
        {subTab === 'company_msgs' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input type="text" placeholder="Firma adı, konu veya mesaj içeriği ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" />
              </div>
              <button 
                onClick={() => exportToExcel(adminMessages.map(m => ({
                  ID: m.id,
                  Firma: m.companyName,
                  Konu: m.subject,
                  EPosta: m.email || '-',
                  Telefon: m.phone || '-',
                  Mesaj: m.message,
                  GonderimTarihi: m.date,
                  Durum: m.status,
                  Yanit: m.reply || '-'
                })), 'IESU_Sirket_Yonetici_Mesajlari')}
                className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-black text-xs rounded-2xl transition shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Şirket Mesajları Excel İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Firma Adı</th>
                    <th className="p-3.5">Konu</th>
                    <th className="p-3.5">E-Posta</th>
                    <th className="p-3.5">Telefon</th>
                    <th className="p-3.5">Mesaj</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {adminMessages.filter(m => (m.companyName || '').toLowerCase().includes(search.toLowerCase()) || (m.subject || '').toLowerCase().includes(search.toLowerCase()) || (m.message || '').toLowerCase().includes(search.toLowerCase())).map(m => (
                    <tr key={m.id} onClick={() => setSelectedGenericItem({ type: 'Şirket Yönetici Mesajı', data: m })} className="hover:bg-slate-50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-slate-600 font-black text-[10px]">{m.id}</td>
                      <td className="p-3.5 font-bold text-slate-900 group-hover:text-[#990000] flex items-center gap-1.5"><Building2 size={14} className="text-gray-400" /> {m.companyName} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                      <td className="p-3.5 font-bold text-[#990000]">{m.subject}</td>
                      <td className="p-3.5 text-slate-500">{m.email || '-'}</td>
                      <td className="p-3.5 text-slate-500">{m.phone || '-'}</td>
                      <td className="p-3.5 max-w-[220px] truncate text-slate-600">{m.message}</td>
                      <td className="p-3.5 text-slate-400 text-[10px]">{m.date}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          m.status === 'Yanıtlandı' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          m.status === 'Çözüldü' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>{m.status}</span>
                      </td>
                    </tr>
                  ))}
                  {adminMessages.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-gray-400 font-medium">Henüz şirket mesaj talebi yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: EĞİTİM & KAMPÜS ETKİNLİK TALEPLERİ HAVUZU */}
        {subTab === 'edu_requests' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input type="text" placeholder="Firma adı veya etkinlik türü ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" />
              </div>
              <button 
                onClick={() => exportToExcel(careerFairApplications.map(a => ({
                  ID: a.id,
                  Firma: a.companyName,
                  EtkinlikTuru: a.answers?.eventType || '-',
                  MekanTercihi: a.answers?.venueType || '-',
                  TemsilciSayisi: a.answers?.repCount || '-',
                  HedefBolumler: a.answers?.targetDepts || '-',
                  Notlar: a.answers?.notes || '-',
                  BasvuruTarihi: a.appliedAt ? new Date(a.appliedAt).toLocaleString('tr-TR') : '-',
                  Durum: a.status
                })), 'IESU_Egitim_Etkinlik_Talepleri')}
                className="px-6 py-3 bg-gradient-to-r from-[#990000] to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-red-900/20 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Eğitim Talepleri Excel İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#990000] text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Firma Adı</th>
                    <th className="p-3.5">Etkinlik Türü</th>
                    <th className="p-3.5">Mekan Tercihi</th>
                    <th className="p-3.5">Temsilci Sayısı</th>
                    <th className="p-3.5">Hedef Bölümler</th>
                    <th className="p-3.5">Başvuru Tarihi</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {careerFairApplications.filter(a => (a.companyName || '').toLowerCase().includes(search.toLowerCase()) || (a.answers?.eventType || '').toLowerCase().includes(search.toLowerCase())).map(a => (
                    <tr key={a.id} onClick={() => setSelectedGenericItem({ type: 'Eğitim / Etkinlik Talebi', data: a })} className="hover:bg-red-50/50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-[#990000] font-black">{a.id}</td>
                      <td className="p-3.5 font-bold text-slate-900 group-hover:text-[#990000] flex items-center gap-1.5"><Building2 size={14} className="text-gray-400" /> {a.companyName} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                      <td className="p-3.5 font-semibold">{a.answers?.eventType || '-'}</td>
                      <td className="p-3.5">{a.answers?.venueType || '-'}</td>
                      <td className="p-3.5 text-center font-bold">{a.answers?.repCount || '-'}</td>
                      <td className="p-3.5 max-w-[180px] truncate">{a.answers?.targetDepts || '-'}</td>
                      <td className="p-3.5 text-slate-500">{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('tr-TR') : '-'}</td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          a.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          a.status === 'Reddedildi' ? 'bg-red-50 text-red-700 border border-red-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                  {careerFairApplications.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-gray-400 font-medium">Henüz eğitim/etkinlik talebi kaydı yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: E-BÜLTEN ABONE HAVUZU */}
        {subTab === 'newsletter' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Abone adı, e-posta veya bölüm ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(newsletterSubscribers, 'IESU_EBulten_Abone_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Kayıt ID</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">E-Posta</th>
                    <th className="p-3.5">Fakülte / Birim</th>
                    <th className="p-3.5">Bölüm</th>
                    <th className="p-3.5">Sınıf</th>
                    <th className="p-3.5">Doğum Tarihi</th>
                    <th className="p-3.5">KVKK Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {newsletterSubscribers
                    .filter(s => 
                      !search || 
                      (s.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                      (s.email || '').toLowerCase().includes(search.toLowerCase()) || 
                      (s.department || '').toLowerCase().includes(search.toLowerCase())
                    )
                    .map(s => (
                      <tr key={s.id} onClick={() => setSelectedGenericItem({ type: 'E-Bülten Aboneliği', data: s })} className="hover:bg-slate-50 transition cursor-pointer group">
                        <td className="p-3.5 font-mono text-slate-600 font-black">{s.id}</td>
                        <td className="p-3.5 font-black text-slate-900 group-hover:text-[#990000] flex items-center gap-1.5">{s.fullName || 'Belirtilmedi'} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                        <td className="p-3.5 font-semibold text-indigo-700">{s.email}</td>
                        <td className="p-3.5">{s.faculty || 'Mühendislik ve Mimarlık Fakültesi'}</td>
                        <td className="p-3.5 font-bold">{s.department || 'Yazılım Müh.'}</td>
                        <td className="p-3.5 font-semibold">{s.grade || '1. Sınıf'}</td>
                        <td className="p-3.5">{s.birthDate || '2004-01-01'}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            <CheckCircle2 size={12} /> {s.status || 'Onaylı'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {newsletterSubscribers.length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-gray-400 font-medium">Henüz e-bülten abonesi yok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: BMI & SAĞLIK KAYITLARI HAVUZU */}
        {subTab === 'bmi' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Öğrenci adı veya kategori ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(bmiRecords, 'IESU_Ogrenci_BMI_ve_Saglik_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Kayıt No</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">Boy / Kilo</th>
                    <th className="p-3.5">Vücut Kitle Endeksi</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Diyetisyen Randevusu</th>
                    <th className="p-3.5">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {bmiRecords.filter(r => (r.name||'').toLowerCase().includes(search.toLowerCase()) || (r.category||'').toLowerCase().includes(search.toLowerCase())).map(r => (
                    <tr key={r.id} onClick={() => setSelectedGenericItem({ type: 'BMI & Sağlık Kaydı', data: r })} className="hover:bg-slate-50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-teal-700 font-black">{r.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-[#990000] flex items-center gap-1.5">{r.name} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                      <td className="p-3.5 font-medium">{r.height} cm / {r.weight} kg</td>
                      <td className="p-3.5 font-black text-slate-900">{r.bmi} kg/m²</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-emerald-200">{r.category}</span></td>
                      <td className="p-3.5">{r.dietitianRequested ? <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Randevu İstendi</span> : <span className="text-slate-400">Hayır</span>}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: BİDB HELPDESK TICKET HAVUZU */}
        {subTab === 'helpdesk' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input type="text" placeholder="Ad, e-posta veya konu ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" />
              </div>
              <button 
                onClick={() => exportToExcel(helpdeskTickets, 'IESU_BIDB_Destek_Talepleri')}
                className="px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-xs rounded-2xl transition shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Destek Taleplerini İndir (Excel)
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Talep No</th>
                    <th className="p-3.5">Talep Eden</th>
                    <th className="p-3.5">E-Posta</th>
                    <th className="p-3.5">Konu</th>
                    <th className="p-3.5">Detaylar</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {helpdeskTickets.filter(t => (t.name||'').toLowerCase().includes(search.toLowerCase()) || (t.subject||'').toLowerCase().includes(search.toLowerCase())).map(t => (
                    <tr key={t.id} onClick={() => setSelectedGenericItem({ type: 'BİDB Destek Talebi', data: t })} className="hover:bg-slate-50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-blue-700 font-black">{t.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-[#990000] flex items-center gap-1.5">{t.name} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                      <td className="p-3.5 text-slate-500">{t.email}</td>
                      <td className="p-3.5 font-bold text-slate-900">{t.subject}</td>
                      <td className="p-3.5 max-w-[200px] truncate text-slate-600">{t.details}</td>
                      <td className="p-3.5 text-slate-400 text-[10px]">{t.date}</td>
                      <td className="p-3.5"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-black text-[10px]">{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: LAB REZERVASYON HAVUZU */}
        {subTab === 'labs' && (
          <div className="space-y-5">
            {/* Top Toolbar: Search, Filters & Action Buttons */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="w-full sm:w-80 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                  <Search size={16} className="text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Akademisyen, bölüm veya lab ara..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                  />
                </div>

                {/* Status Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['Tümü', 'Onay Bekliyor', 'Onaylandı', 'Revize İstendi', 'Reddedildi'].map(st => (
                    <button
                      key={st}
                      onClick={() => setLabStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                        labStatusFilter === st
                          ? 'bg-cyan-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
                <button
                  onClick={() => setSubTab('manage_labs')}
                  className="px-4 py-2.5 bg-white hover:bg-cyan-50 border border-cyan-300 text-cyan-800 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Settings size={15} className="text-cyan-700" />
                  <span>Lab & Form Kriterleri</span>
                </button>
                <button 
                  onClick={() => exportToExcel(labReservations, 'IESU_Lab_Rezervasyon_Havuzu')}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-800 hover:to-blue-900 text-white font-black text-xs rounded-2xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Download size={15} /> 
                  <span>Excel İndir</span>
                </button>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-cyan-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Rezervasyon Sahibi & Bölüm</th>
                    <th className="p-3.5">Laboratuvar & Konu</th>
                    <th className="p-3.5">Tarih & Seans</th>
                    <th className="p-3.5">Kişi</th>
                    <th className="p-3.5">Özel Kriter Yanıtları</th>
                    <th className="p-3.5">Durum & Not</th>
                    <th className="p-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {labReservations.filter(l => {
                    const matchesSearch = (l.name||'').toLowerCase().includes(search.toLowerCase()) || 
                      (l.labName||'').toLowerCase().includes(search.toLowerCase()) ||
                      (l.department||'').toLowerCase().includes(search.toLowerCase()) ||
                      (l.projectSubject||'').toLowerCase().includes(search.toLowerCase());
                    const currentStatus = l.status || 'Onay Bekliyor';
                    const matchesStatus = labStatusFilter === 'Tümü' || currentStatus === labStatusFilter;
                    return matchesSearch && matchesStatus;
                  }).map(l => (
                    <tr key={l.id} onClick={() => setSelectedGenericItem({ type: 'Laboratuvar Rezervasyonu', data: l })} className="hover:bg-cyan-50/50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-cyan-800 font-black">{l.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-cyan-900">
                        <div className="flex items-center gap-1.5">
                          {l.name} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-cyan-700"/>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500">{l.academicTitle ? `${l.academicTitle} • ` : ''}{l.department || 'Akademik Birim'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-cyan-950">{l.labName}</div>
                        {l.projectSubject && <div className="text-[10px] text-slate-500 line-clamp-1">{l.projectSubject}</div>}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{l.date}</div>
                        <div className="text-[10px] text-slate-500">{l.timeSlot}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-bold">{l.attendeeCount ? `${l.attendeeCount} Kişi` : '1 Kişi'}</td>
                      <td className="p-3.5">
                        {l.customAnswers && Object.keys(l.customAnswers).length > 0 ? (
                          <span className="bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {Object.keys(l.customAnswers).length} Kriter Yanıtı
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div>
                          <span className={`px-2.5 py-1 rounded-full font-black text-[10px] border inline-flex items-center gap-1 ${
                            l.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            l.status === 'Revize İstendi' ? 'bg-amber-100 text-amber-900 border-amber-300 font-black' :
                            l.status === 'Reddedildi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {l.status === 'Revize İstendi' && <AlertCircle size={10} />}
                            {l.status || 'Onay Bekliyor'}
                          </span>
                          {l.adminNote && (
                            <div className="mt-1 text-[10px] text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded px-2 py-0.5 max-w-[170px] truncate" title={l.adminNote}>
                              ⚠️ {l.adminNote}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              if (updateLabReservationStatus) updateLabReservationStatus(l.id, 'Onaylandı');
                              window.toast && window.toast.success("Laboratuvar rezervasyonu onaylandı.");
                            }}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            title="Rezervasyonu Onayla"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setReviseModalData({ type: 'lab', item: l });
                              setReviseNote(l.adminNote || '');
                            }}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                            title="Revize İste (Açıklama Gönder)"
                          >
                            <AlertCircle size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (updateLabReservationStatus) updateLabReservationStatus(l.id, 'Reddedildi');
                              window.toast && window.toast.error("Rezervasyon reddedildi.");
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                            title="Reddet"
                          >
                            <X size={14} />
                          </button>
                          <button
                            onClick={() => setSelectedGenericItem({ type: 'Laboratuvar Rezervasyonu', data: l })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Detaylı İncele"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {labReservations.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">Kayıtlı laboratuvar rezervasyonu bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: PROJE & BURSİYER BAŞVURULARI HAVUZU */}
        {subTab === 'research_calls' && (
          <div className="space-y-5">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <div className="w-full sm:w-80 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                  <Search size={16} className="text-slate-400 mr-2.5 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Başvuran, proje veya rol ara..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                  />
                </div>

                {/* Status Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {['Tümü', 'Onay Bekliyor', 'Kabul Edildi', 'Mülakata Çağrıldı', 'Revize İstendi', 'Reddedildi'].map(st => (
                    <button
                      key={st}
                      onClick={() => setCallStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition cursor-pointer ${
                        callStatusFilter === st
                          ? 'bg-purple-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
                <button
                  onClick={() => setSubTab('manage_calls')}
                  className="px-4 py-2.5 bg-white hover:bg-purple-50 border border-purple-300 text-purple-800 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Settings size={15} className="text-purple-700" />
                  <span>Çağrı & Soru Kriterleri</span>
                </button>
                <button 
                  onClick={() => exportToExcel(researchCallApplications, 'IESU_Proje_Bursiyer_Basvuru_Havuzu')}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white font-black text-xs rounded-2xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Download size={15} /> 
                  <span>Excel İndir</span>
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-purple-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Başvuran Araştırmacı / Öğrenci</th>
                    <th className="p-3.5">İlgili Proje Çağrısı</th>
                    <th className="p-3.5">Başvurulan Rol</th>
                    <th className="p-3.5">Haftalık Süre</th>
                    <th className="p-3.5">Özel Yanıtlar</th>
                    <th className="p-3.5">Durum & Not</th>
                    <th className="p-3.5 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {researchCallApplications.filter(a => {
                    const matchesSearch = (a.applicantName||'').toLowerCase().includes(search.toLowerCase()) || 
                      (a.callTitle||'').toLowerCase().includes(search.toLowerCase()) ||
                      (a.department||'').toLowerCase().includes(search.toLowerCase()) ||
                      (a.appliedRole||'').toLowerCase().includes(search.toLowerCase());
                    const currentStatus = a.status || 'Onay Bekliyor';
                    const matchesStatus = callStatusFilter === 'Tümü' || currentStatus === callStatusFilter;
                    return matchesSearch && matchesStatus;
                  }).map(a => (
                    <tr key={a.id} onClick={() => setSelectedGenericItem({ type: 'Proje & Bursiyer Çağrısı Başvurusu', data: a })} className="hover:bg-purple-50/50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-purple-900 font-black">{a.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-purple-900">
                        <div className="flex items-center gap-1.5">
                          {a.applicantName} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-purple-900"/>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500">{a.applicantStatus || 'Araştırmacı'} • {a.department || 'İESÜ'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 line-clamp-1">{a.callTitle}</div>
                        <div className="text-[10px] text-purple-700 font-semibold">Yürütücü: {a.lead}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{a.appliedRole}</td>
                      <td className="p-3.5 text-slate-600 text-[11px] font-semibold">{a.weeklyHours}</td>
                      <td className="p-3.5">
                        {a.customAnswers && Object.keys(a.customAnswers).length > 0 ? (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            {Object.keys(a.customAnswers).length} Kriter Yanıtı
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <div>
                          <span className={`px-2.5 py-1 rounded-full font-black text-[10px] border inline-flex items-center gap-1 ${
                            a.status === 'Kabul Edildi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            a.status === 'Mülakata Çağrıldı' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                            a.status === 'Revize İstendi' ? 'bg-amber-100 text-amber-900 border-amber-300 font-black' :
                            a.status === 'Reddedildi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {a.status === 'Revize İstendi' && <AlertCircle size={10} />}
                            {a.status || 'Onay Bekliyor'}
                          </span>
                          {a.adminNote && (
                            <div className="mt-1 text-[10px] text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded px-2 py-0.5 max-w-[170px] truncate" title={a.adminNote}>
                              ⚠️ {a.adminNote}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              if (updateResearchCallApplicationStatus) updateResearchCallApplicationStatus(a.id, 'Kabul Edildi');
                              window.toast && window.toast.success("Başvuru kabul edildi.");
                            }}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                            title="Başvuruyu Kabul Et"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (updateResearchCallApplicationStatus) updateResearchCallApplicationStatus(a.id, 'Mülakata Çağrıldı', 'Aday mülakat görüşmesine davet edilmiştir.');
                              window.toast && window.toast.success("Aday mülakata çağrıldı.");
                            }}
                            className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition"
                            title="Mülakata Çağır"
                          >
                            <Users size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setReviseModalData({ type: 'call', item: a });
                              setReviseNote(a.adminNote || '');
                            }}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition"
                            title="Revize İste (Açıklama Gönder)"
                          >
                            <AlertCircle size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (updateResearchCallApplicationStatus) updateResearchCallApplicationStatus(a.id, 'Reddedildi');
                              window.toast && window.toast.error("Başvuru reddedildi.");
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                            title="Reddet"
                          >
                            <X size={14} />
                          </button>
                          <button
                            onClick={() => setSelectedGenericItem({ type: 'Proje & Bursiyer Çağrısı Başvurusu', data: a })}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Detaylı İncele"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {researchCallApplications.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">Kayıtlı proje veya bursiyer başvurusu bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: AR-GE LABORATUVAR & FORM KRİTERLERİ YÖNETİMİ */}
        {subTab === 'manage_labs' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-cyan-900 to-slate-900 text-white p-5 rounded-2xl shadow-md">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <FlaskConical size={20} className="text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Ar-Ge Laboratuvar Kataloğu & Rezervasyon Kriterleri</h3>
                    <p className="text-xs text-cyan-200/80 font-medium mt-0.5">Laboratuvar listesini, seans saatlerini ve akademisyenlerden istenen kriter sorularını buradan yapılandırın.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setSubTab('labs')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  📋 Rezervasyon Havuzuna Dön
                </button>
                <button
                  onClick={() => handleOpenLabModal()}
                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus size={16} /> Yeni Laboratuvar Ekle
                </button>
              </div>
            </div>

            {/* Section 1: Labs List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Server size={15} className="text-cyan-700" />
                  Kayıtlı Laboratuvarlar ({researchLabs.length})
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Laboratuvar Adı</th>
                      <th className="p-3.5">Lokasyon</th>
                      <th className="p-3.5">Kapasite</th>
                      <th className="p-3.5">Donanım & Altyapı</th>
                      <th className="p-3.5">Durum</th>
                      <th className="p-3.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {researchLabs.map(lab => (
                      <tr key={lab.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-mono text-cyan-800 font-black">{lab.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{lab.name}</td>
                        <td className="p-3.5 text-slate-600">{lab.location}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{lab.capacity}</td>
                        <td className="p-3.5 text-slate-500 max-w-[240px] truncate" title={lab.equipment}>{lab.equipment}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            lab.status.includes('Aktif') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {lab.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenLabModal(lab)}
                              className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg transition"
                              title="Düzenle"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteLab(lab.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                              title="Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {researchLabs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">Katalogda laboratuvar bulunmuyor. Yeni laboratuvar ekleyebilirsiniz.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Two-column configuration (Time Slots & Form Questions) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box A: Seans Saatleri Yönetimi */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan-700" />
                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Rezervasyon Seans Saatleri</h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{(researchConfig.timeSlots || []).length} Seans</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Akademisyenlerin rezervasyon yaparken seçebileceği zaman aralıkları.</p>

                {/* Existing Slots */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(researchConfig.timeSlots || [
                    "09:00 - 11:00 (Sabah Seansı)",
                    "11:30 - 13:30 (Öğle Seansı)",
                    "14:00 - 16:00 (Öğleden Sonra Seansı)",
                    "16:30 - 18:30 (Akşam Seansı)"
                  ]).map((slot, idx) => (
                    <span key={idx} className="bg-white border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
                      {slot}
                      <button 
                        onClick={() => handleDeleteTimeSlot(slot)}
                        className="text-slate-400 hover:text-rose-600 transition"
                        title="Seansı Kaldır"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Slot Form */}
                <form onSubmit={handleAddTimeSlot} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Örn: 19:00 - 21:00 (Gece Seansı)"
                    value={newTimeSlot}
                    onChange={e => setNewTimeSlot(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-600 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-800 hover:bg-cyan-900 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    ➕ Seans Ekle
                  </button>
                </form>
              </div>

              {/* Box B: Özel Rezervasyon Kriterleri ve Soruları */}
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-cyan-700" />
                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Rezervasyon Formu Özel Kriterleri</h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{(researchConfig.labCustomQuestions || []).length} Kriter</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Akademisyenin rezervasyon formunda cevaplaması gereken ek kriter soruları (etik kurul, kimyasal atık, bütçe kodu vb.).</p>

                {/* Existing Questions */}
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {(researchConfig.labCustomQuestions || []).map(q => (
                    <div key={q.id} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {q.label}
                          {q.required && <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-black border border-red-200">Zorunlu</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {q.type === 'select' ? `Seçim Alanı: [${(q.options || []).join(', ')}]` : 'Serbest Metin Girişi'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteLabQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Soruyu Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {(researchConfig.labCustomQuestions || []).length === 0 && (
                    <div className="text-slate-400 text-xs text-center py-3 bg-white rounded-xl border border-dashed border-slate-200">
                      Ek kriter sorusu tanımlanmamış. Aşağıdan ekleyebilirsiniz.
                    </div>
                  )}
                </div>

                {/* Add Question Form */}
                <form onSubmit={handleAddLabQuestion} className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Kriter / Soru başlığı (örn: Etik Kurul İzni)"
                      value={newLabQuestion.label}
                      onChange={e => setNewLabQuestion({ ...newLabQuestion, label: e.target.value })}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-600"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Seçenekler (virgülle ayırın, opsiyonel)"
                      value={newLabQuestion.options}
                      onChange={e => setNewLabQuestion({ ...newLabQuestion, options: e.target.value })}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-600"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLabQuestion.required}
                        onChange={e => setNewLabQuestion({ ...newLabQuestion, required: e.target.checked })}
                        className="rounded text-cyan-700"
                      />
                      Zorunlu Alan Olsun
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-800 hover:bg-cyan-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      ➕ Kriter Sorusu Ekle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SUB-PANEL: PROJE ÇAĞRILARI & BAŞVURU KRİTERLERİ YÖNETİMİ */}
        {subTab === 'manage_calls' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-950 to-indigo-950 text-white p-5 rounded-2xl shadow-md">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <BookOpen size={20} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-base">Proje & Bursiyer Çağrıları ve Başvuru Soru Kriterleri</h3>
                    <p className="text-xs text-purple-200/80 font-medium mt-0.5">Aktif araştırma çağrılarını, burs kontenjanlarını ve başvuranlardan istenen ek revize sorularını buradan yapılandırın.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setSubTab('research_calls')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  📋 Başvuru Havuzuna Dön
                </button>
                <button
                  onClick={() => handleOpenCallModal()}
                  className="px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus size={16} /> Yeni Proje Çağrısı Aç
                </button>
              </div>
            </div>

            {/* Calls Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers size={15} className="text-purple-800" />
                  Kayıtlı Proje & Bursiyer Çağrıları ({researchCalls.length})
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-black tracking-wider">
                    <tr>
                      <th className="p-3.5">ID</th>
                      <th className="p-3.5">Çağrı Başlığı</th>
                      <th className="p-3.5">Proje Yürütücüsü</th>
                      <th className="p-3.5">Açık Pozisyonlar</th>
                      <th className="p-3.5">Bütçe / Destek</th>
                      <th className="p-3.5">Son Başvuru</th>
                      <th className="p-3.5">Durum</th>
                      <th className="p-3.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {researchCalls.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition">
                        <td className="p-3.5 font-mono text-purple-900 font-black">{c.id}</td>
                        <td className="p-3.5 font-bold text-slate-900 max-w-[220px]">{c.title}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{c.lead}</td>
                        <td className="p-3.5 text-slate-600">{c.positions}</td>
                        <td className="p-3.5 font-bold text-purple-900">{c.budget}</td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">{c.deadline}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            c.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenCallModal(c)}
                              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg transition"
                              title="Düzenle"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCall(c.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                              title="Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {researchCalls.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">Kayıtlı proje çağrısı bulunmuyor. Yeni çağrı açabilirsiniz.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calls Custom Questions Form Card */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-purple-800" />
                  <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Proje Çağrısı Başvuru Formu Soruları & Revize Kriterleri</h4>
                </div>
                <span className="text-[11px] font-bold text-slate-500">{(researchConfig.callCustomQuestions || []).length} Kriter / Soru</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Bursiyer ve araştırmacı adaylarının başvuru formunda yanıtlaması istenen ek kriterler (örn: GitHub profili, referans hoca, not ortalaması vb.).</p>

              {/* List of current questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(researchConfig.callCustomQuestions || []).map(q => (
                  <div key={q.id} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {q.label}
                        {q.required && <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-black border border-red-200">Zorunlu</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {q.type === 'select' ? `Seçenekler: [${(q.options || []).join(', ')}]` : 'Serbest Metin Girişi'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCallQuestion(q.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Soruyu Sil"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {(researchConfig.callCustomQuestions || []).length === 0 && (
                  <div className="col-span-1 md:col-span-2 text-slate-400 text-xs text-center py-4 bg-white rounded-xl border border-dashed border-slate-200">
                    Ek başvuru sorusu tanımlanmamış. Aşağıdaki formdan yeni soru ekleyebilirsiniz.
                  </div>
                )}
              </div>

              {/* Add Question Form */}
              <form onSubmit={handleAddCallQuestion} className="space-y-2 pt-3 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Soru başlığı (örn: GitHub / Portfolyo Linki)"
                    value={newCallQuestion.label}
                    onChange={e => setNewCallQuestion({ ...newCallQuestion, label: e.target.value })}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-700"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Seçenekler (virgülle ayrılmış, opsiyonel)"
                    value={newCallQuestion.options}
                    onChange={e => setNewCallQuestion({ ...newCallQuestion, options: e.target.value })}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-700"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCallQuestion.required}
                      onChange={e => setNewCallQuestion({ ...newCallQuestion, required: e.target.checked })}
                      className="rounded text-purple-700"
                    />
                    Zorunlu Alan
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    ➕ Çağrı Sorusu Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SUB-PANEL: MEZUN ANKET HAVUZU */}
        {subTab === 'surveys' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Anket başlığı ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(surveys, 'IESU_Mezun_Memnuniyet_Anketleri')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs rounded-2xl transition shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Anket No</th>
                    <th className="p-3.5">Anket Başlığı</th>
                    <th className="p-3.5">Katılım Sayısı</th>
                    <th className="p-3.5">Memnuniyet Skoru</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {surveys.filter(s => (s.title||'').toLowerCase().includes(search.toLowerCase())).map(s => (
                    <tr key={s.id} onClick={() => setSelectedGenericItem({ type: 'Anket Bilgisi', data: s })} className="hover:bg-slate-50 transition cursor-pointer">
                      <td className="p-3.5 font-mono text-amber-700 font-black">{s.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{s.title}</td>
                      <td className="p-3.5 font-bold">{s.responsesCount || '142'} Yanıt</td>
                      <td className="p-3.5 font-black text-emerald-600">%94.8 İdeal</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-emerald-200">Yayında</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: MEZUN DERNEĞİ BAŞVURULARI HAVUZU */}
        {subTab === 'alumni_assoc' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input type="text" placeholder="Ad, e-posta veya bölüm ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" />
              </div>
              <button 
                onClick={() => exportToExcel(alumniAssocApplications, 'IESU_Mezun_Dernegi_Basvurulari')}
                className="px-6 py-3 bg-gradient-to-r from-red-800 to-rose-900 hover:from-red-900 hover:to-rose-950 text-white font-black text-xs rounded-2xl transition shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Dernek Başvuruları Excel İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#990000] text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Başvuru ID</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">Üyelik Türü</th>
                    <th className="p-3.5">Bölüm / Mezuniyet</th>
                    <th className="p-3.5">E-Posta / Telefon</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {alumniAssocApplications.filter(a => (a.name||'').toLowerCase().includes(search.toLowerCase()) || (a.department||'').toLowerCase().includes(search.toLowerCase())).map(a => (
                    <tr key={a.id} onClick={() => setSelectedGenericItem({ type: 'Mezun Derneği Başvurusu', data: a })} className="hover:bg-red-50/50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-[#990000] font-black">{a.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-[#990000] flex items-center gap-1.5">{a.name} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-[#990000]"/></td>
                      <td className="p-3.5 font-bold text-red-900">{a.type}</td>
                      <td className="p-3.5 text-slate-600">{a.department} ({a.graduationYear})</td>
                      <td className="p-3.5 text-slate-500">{a.email} <br/><span className="text-[10px] text-slate-400">{a.phone}</span></td>
                      <td className="p-3.5 text-slate-400 text-[10px]">{a.appliedAt}</td>
                      <td className="p-3.5"><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-black text-[10px]">{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL: MEZUN KART BAŞVURULARI & AYARLARI HAVUZU */}
        {subTab === 'alumni_cards' && (
          <div className="space-y-6">
            {/* Feature Toggle Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-indigo-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300 font-bold border border-indigo-400/30">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Mezun Kart Başvuru Formu Yönetim Yetkisi</h4>
                  <p className="text-xs text-indigo-200 font-medium">Öğrenci / Mezun panelinde Mezun Kart başvuru formunun görünürlüğünü kontrol edin.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20">
                <span className="text-xs font-black text-white">Form Erişime Açık:</span>
                <button
                  onClick={() => setFeatureAlumniCard(!featureAlumniCard)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${featureAlumniCard !== false ? 'bg-emerald-500' : 'bg-slate-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${featureAlumniCard !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input type="text" placeholder="Ad, öğrenci no veya bölüm ara..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" />
              </div>
              <button 
                onClick={() => exportToExcel(alumniCardApplications, 'IESU_Mezun_Kart_Basvurulari')}
                className="px-6 py-3 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs rounded-2xl transition shadow-lg flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Download size={16} /> Kart Başvuruları Excel İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-indigo-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Başvuru ID</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">T.C. / Öğrenci No</th>
                    <th className="p-3.5">Bölüm / Mezuniyet</th>
                    <th className="p-3.5">Kart Formatı</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {alumniCardApplications.filter(a => (a.name||'').toLowerCase().includes(search.toLowerCase()) || (a.studentId||'').toLowerCase().includes(search.toLowerCase())).map(a => (
                    <tr key={a.id} onClick={() => setSelectedGenericItem({ type: 'Mezun Kart Başvurusu', data: a })} className="hover:bg-indigo-50/50 transition cursor-pointer group">
                      <td className="p-3.5 font-mono text-indigo-900 font-black">{a.id}</td>
                      <td className="p-3.5 font-bold group-hover:text-indigo-900 flex items-center gap-1.5">{a.name} <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition text-indigo-900"/></td>
                      <td className="p-3.5 font-mono text-slate-600">{a.tcNo || '-'} / {a.studentId}</td>
                      <td className="p-3.5 text-slate-600">{a.dept} ({a.gradYear})</td>
                      <td className="p-3.5 font-bold text-indigo-900">{a.deliveryType === 'digital' ? 'Dijital Kart' : 'Fiziksel + Dijital'}</td>
                      <td className="p-3.5 text-slate-400 text-[10px]">{a.appliedAt || new Date().toLocaleDateString('tr-TR')}</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-black text-[10px]">{a.status || 'Onaylandı (Cüzdanda)'}</span></td>
                    </tr>
                  ))}
                  {alumniCardApplications.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-400 font-medium">Henüz gelen mezun kartı başvurusu bulunmuyor.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Universal Detail Modal Popup for all records */}
      {selectedGenericItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Database size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{selectedGenericItem.type} Detayı</h3>
                  <p className="text-[11px] text-slate-300 font-medium">Veri Havuzu Detaylı İnceleme Kartı</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGenericItem(null)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs">
              {/* Highlight Box if Message/Note exists */}
              {(selectedGenericItem.data.message || selectedGenericItem.data.details || selectedGenericItem.data.notes) && (
                <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl space-y-1.5">
                  <span className="font-black text-amber-900 uppercase text-[10px] tracking-wider block">Gelen Mesaj / Detaylı Açıklama:</span>
                  <p className="text-slate-800 text-xs font-semibold leading-relaxed whitespace-pre-wrap">
                    {selectedGenericItem.data.message || selectedGenericItem.data.details || selectedGenericItem.data.notes}
                  </p>
                </div>
              )}

              {/* Grid of Key-Value Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(selectedGenericItem.data).map(([key, value]) => {
                  if (['message', 'details', 'notes'].includes(key)) return null;
                  
                  if (typeof value === 'object' && value !== null) {
                    return (
                      <div key={key} className="col-span-1 md:col-span-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                        <span className="font-black text-slate-500 uppercase text-[10px] tracking-wider block mb-1.5">{key}</span>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                          {Object.entries(value).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-500">{k}:</span>
                              <span className="font-black text-slate-900">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-center">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">{key}</span>
                      <span className="font-black text-slate-900 text-xs mt-0.5 break-words">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedGenericItem(null)} 
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Checkup Detail Modal Popup */}
      {selectedCheckup && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-[#990000] to-red-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Activity size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">Kariyer Değerlendirme Analiz Raporu</h3>
                  <p className="text-[11px] text-red-100 font-medium">{selectedCheckup.name} ({selectedCheckup.id})</p>
                </div>
              </div>
              <button onClick={() => setSelectedCheckup(null)} className="p-2 text-red-200 hover:text-white hover:bg-white/10 rounded-full transition">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-sans text-xs">
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block">Kariyer Skoru</span>
                  <span className="text-2xl font-black text-[#990000]">{selectedCheckup.score} / 100</span>
                </div>
                <span className="px-3 py-1 bg-white text-[#990000] rounded-xl font-black text-xs shadow-sm border border-red-200">{selectedCheckup.level}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Fakülte</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCheckup.faculty}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Bölüm & Sınıf</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCheckup.department} ({selectedCheckup.grade})</p>
                </div>
              </div>

              {selectedCheckup.strengths && (
                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80">
                  <span className="font-black text-emerald-800 uppercase text-[10px] tracking-wider block mb-1">Güçlü Yönler:</span>
                  <p className="text-slate-700 font-semibold">{selectedCheckup.strengths}</p>
                </div>
              )}

              {selectedCheckup.improvements && (
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
                  <span className="font-black text-amber-800 uppercase text-[10px] tracking-wider block mb-1">Gelişim Alanları:</span>
                  <p className="text-slate-700 font-semibold">{selectedCheckup.improvements}</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end shrink-0">
              <button onClick={() => setSelectedCheckup(null)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revise Request Modal Popup */}
      {reviseModalData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <AlertCircle size={20} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">
                    {reviseModalData.type === 'lab' ? 'Laboratuvar Rezervasyonu Revize Talebi' : 'Proje Başvurusu Revize Talebi'}
                  </h3>
                  <p className="text-[11px] text-amber-100 font-medium">
                    {reviseModalData.type === 'lab' 
                      ? `${reviseModalData.item.name} • ${reviseModalData.item.labName}`
                      : `${reviseModalData.item.applicantName} • ${reviseModalData.item.callTitle}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setReviseModalData(null)} className="p-2 text-amber-200 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitRevise} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Revize Notu / Talep Edilen Düzeltmeler:
                </label>
                <textarea
                  value={reviseNote}
                  onChange={e => setReviseNote(e.target.value)}
                  placeholder="Başvuru sahibinden hangi bilgileri, tarihleri veya belgeleri revize etmesini istiyorsunuz? (Ayrıntılı açıklayınız)..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-600 transition"
                  required
                />
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Bu mesaj doğrudan başvuru sahibinin ekranında ve bildirim merkezinde görüntülenecektir.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReviseModalData(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white rounded-xl text-xs font-black transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={14} /> Revize Talebini Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Create/Edit Modal Popup */}
      {labModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-cyan-900 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FlaskConical size={20} className="text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{editingLab ? 'Laboratuvarı Düzenle' : 'Yeni Ar-Ge Laboratuvarı Ekle'}</h3>
                  <p className="text-[11px] text-cyan-200 font-medium">Katalogda akademisyenlerin rezervasyonuna sunulacak bilgiler</p>
                </div>
              </div>
              <button onClick={() => setLabModalOpen(false)} className="p-2 text-cyan-200 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLab} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Lab ID</label>
                  <input
                    type="text"
                    value={labFormData.id}
                    onChange={e => setLabFormData({ ...labFormData, id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Durum</label>
                  <select
                    value={labFormData.status}
                    onChange={e => setLabFormData({ ...labFormData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="Aktif / Rezervasyona Açık">Aktif / Rezervasyona Açık</option>
                    <option value="Bakımda / Geçici Kapalı">Bakımda / Geçici Kapalı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Laboratuvar Adı</label>
                <input
                  type="text"
                  value={labFormData.name}
                  onChange={e => setLabFormData({ ...labFormData, name: e.target.value })}
                  placeholder="Örn: Yapay Zeka ve Derin Öğrenme Araştırma Laboratuvarı"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Lokasyon / Bina & Oda</label>
                  <input
                    type="text"
                    value={labFormData.location}
                    onChange={e => setLabFormData({ ...labFormData, location: e.target.value })}
                    placeholder="Örn: Mühendislik Fakültesi B Blok Z-14"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Kapasite</label>
                  <input
                    type="text"
                    value={labFormData.capacity}
                    onChange={e => setLabFormData({ ...labFormData, capacity: e.target.value })}
                    placeholder="Örn: 20 Araştırmacı"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Donanım & Araştırma İmkanları (Virgülle veya serbest metin)</label>
                <textarea
                  value={labFormData.equipment}
                  onChange={e => setLabFormData({ ...labFormData, equipment: e.target.value })}
                  placeholder="Örn: 4x NVIDIA A100 GPU Sunucusu, 128 GB RAM İş İstasyonları, VR Gözlükleri..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLabModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-black transition shadow-md cursor-pointer"
                >
                  {editingLab ? 'Değişiklikleri Kaydet' : 'Laboratuvarı Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Call Create/Edit Modal Popup */}
      {callModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-purple-950 to-indigo-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <BookOpen size={20} className="text-purple-300" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{editingCall ? 'Proje Çağrısını Düzenle' : 'Yeni Proje / Bursiyer Çağrısı Aç'}</h3>
                  <p className="text-[11px] text-purple-200 font-medium">Öğrenci ve araştırmacıların başvuracağı açık pozisyon detayları</p>
                </div>
              </div>
              <button onClick={() => setCallModalOpen(false)} className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCall} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Çağrı ID</label>
                  <input
                    type="text"
                    value={callFormData.id}
                    onChange={e => setCallFormData({ ...callFormData, id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Durum</label>
                  <select
                    value={callFormData.status}
                    onChange={e => setCallFormData({ ...callFormData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tamamlandı / Kapandı">Tamamlandı / Kapandı</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Proje / Çağrı Başlığı</label>
                <input
                  type="text"
                  value={callFormData.title}
                  onChange={e => setCallFormData({ ...callFormData, title: e.target.value })}
                  placeholder="Örn: TÜBİTAK 1001 — Otonom İHA Sürüsü Derin Pekiştirmeli Öğrenme"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Proje Yürütücüsü</label>
                  <input
                    type="text"
                    value={callFormData.lead}
                    onChange={e => setCallFormData({ ...callFormData, lead: e.target.value })}
                    placeholder="Örn: Prof. Dr. Bahri Şahin"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Açık Pozisyonlar</label>
                  <input
                    type="text"
                    value={callFormData.positions}
                    onChange={e => setCallFormData({ ...callFormData, positions: e.target.value })}
                    placeholder="Örn: 2 Doktora / YL Bursiyeri"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Bütçe / Aylık Burs</label>
                  <input
                    type="text"
                    value={callFormData.budget}
                    onChange={e => setCallFormData({ ...callFormData, budget: e.target.value })}
                    placeholder="Örn: 18.500 ₺ / Ay"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Son Başvuru Tarihi</label>
                  <input
                    type="date"
                    value={callFormData.deadline}
                    onChange={e => setCallFormData({ ...callFormData, deadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-purple-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCallModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white rounded-xl text-xs font-black transition shadow-md cursor-pointer"
                >
                  {editingCall ? 'Değişiklikleri Kaydet' : 'Çağrıyı Yayınla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
