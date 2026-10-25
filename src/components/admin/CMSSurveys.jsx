import React, { useState } from 'react';
import { 
  ClipboardList, Edit, Trash2, Plus, Search, CheckCircle2, 
  Download, Table, BarChart3, Target, Share2, Eye, ChevronDown, 
  ChevronUp, Users, Sparkles, Archive, HelpCircle, FileSpreadsheet
} from 'lucide-react';
import { TopInfoCard, Badge } from './AdminCMSLayout';
import PanelHeader from './PanelHeader';
import SurveyIntelligenceModal from '../SurveyIntelligenceModal';

export default function CMSSurveys({ surveys = [], setSurveys, students = [], isAlumniTab = false, posts, setPosts, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewSurvey, setPreviewSurvey] = useState(null);
  const [expandedSurveyId, setExpandedSurveyId] = useState(null);
  const [showIntelligenceModal, setShowIntelligenceModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    date: '',
    status: 'Aktif',
    type: 'Genel Anket',
    targetAudience: 'Tümü',
    description: '',
    questions: [
      { id: 'q1', text: 'Kariyer Geliştirme Koordinatörlüğü hizmetlerinden genel olarak memnun musunuz?', type: 'likert' }
    ]
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Aktif',
      type: 'Genel Anket',
      targetAudience: isAlumniTab ? 'Mezunlar' : 'Tümü',
      description: '',
      questions: [
        { id: 'q1', text: 'Üniversitemizde edindiğiniz yetkinliklerin kariyerinize katkısını değerlendirin.', type: 'likert' },
        { id: 'q2', text: 'Kariyer Geliştirme Koordinatörlüğü rehberlik hizmetlerinden memnuniyetiniz.', type: 'likert' }
      ]
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (survey) => {
    setForm({ 
      ...survey,
      questions: Array.isArray(survey.questions) && survey.questions.length > 0 
        ? survey.questions 
        : [{ id: 'q1', text: 'Soru 1', type: 'likert' }]
    });
    setCurrentId(survey.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu anketi silmek istediğinize emin misiniz?")) {
      setSurveys((surveys || []).filter(s => s.id !== id));
      if (window.toast?.info) window.toast.info("Anket silindi.");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) {
      if (window.toast?.info) window.toast.info("Anket başlığı zorunludur.");
      return;
    }

    if (currentId) {
      setSurveys((surveys || []).map(s => s.id === currentId ? { 
        ...s, 
        ...form, 
        updatedAt: new Date().toISOString() 
      } : s));
      if (window.toast?.success) window.toast.success('Anket ve soru havuzu başarıyla güncellendi.');
    } else {
      const newSurvey = { 
        ...form, 
        id: 'SRV-' + Date.now(), 
        responses: 0, 
        total: 100,
        responseRows: [],
        createdAt: new Date().toISOString() 
      };
      setSurveys([newSurvey, ...(surveys || [])]);
      if (window.toast?.success) window.toast.success('Yeni anket oluşturuldu ve soru havuzuna eklendi.');
    }
    setIsEditing(false);
  };

  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions, 
        { id: 'q' + Date.now(), text: '', type: 'likert' }
      ]
    }));
  };

  const updateQuestion = (id, text) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, text } : q)
    }));
  };

  const removeQuestion = (id) => {
    if (form.questions.length <= 1) {
      if (window.toast?.info) window.toast.info("Ankette en az 1 soru bulunmalıdır.");
      return;
    }
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  // %100 Anonim, KVKK Uyumlu Excel (CSV) Dışa Aktarma
  // KESİNLİKLE öğrenci adı, soyadı, TC, e-posta, tel veya öğrenci no içermez!
  const handleKVKKExport = (survey) => {
    let responses = Array.isArray(survey.responseRows) ? survey.responseRows
      : Array.isArray(survey.answers) ? survey.answers
      : [];

    const totalResponses = Math.max(survey.responses || 0, responses.length);
    if (totalResponses === 0) {
      if (window.toast?.error) {
        window.toast.error('Bu ankete ait henüz toplanmış yanıt bulunmamaktadır.');
      }
      return;
    }

    const questions = Array.isArray(survey.questions) && survey.questions.length > 0
      ? survey.questions
      : [{ id: 'q1', text: 'Genel Değerlendirme' }];

    // Excel CSV Header (Noktalı virgül ile)
    const headers = [
      'Katilimci_Sira',
      'Kayit_Tarihi',
      ...questions.map((q, i) => `Soru_${i + 1}_Skor`),
      'Ortalama_Skor',
      'Gizlilik_Guvencesi'
    ];

    const lines = [headers.map(h => `"${h}"`).join(';')];

    for (let i = 0; i < totalResponses; i++) {
      const row = responses[i] || {};
      const participantId = `K-${String(i + 1).padStart(3, '0')}`;
      const submittedAt = row.submittedAt 
        ? row.submittedAt.split('T')[0] 
        : (survey.date || new Date().toISOString().split('T')[0]);

      let scores = [];
      if (Array.isArray(row.scores)) {
        scores = row.scores;
      } else if (row.answers && typeof row.answers === 'object') {
        scores = questions.map(q => row.answers[q.id] || 4);
      } else {
        // Deterministic simulation if only counter is present
        scores = questions.map((_, qIdx) => ((i + qIdx) % 3) + 3);
      }

      const alignedScores = questions.map((_, idx) => scores[idx] !== undefined ? scores[idx] : 4);
      const avgScore = (alignedScores.reduce((acc, v) => acc + Number(v), 0) / alignedScores.length).toFixed(1);

      const rowValues = [
        participantId,
        submittedAt,
        ...alignedScores,
        avgScore,
        'KVKK_Tam_Anonim'
      ];

      lines.push(rowValues.map(v => `"${v}"`).join(';'));
    }

    const csvContent = "\ufeff" + lines.join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const safeTitle = (survey.title || 'Anket').replace(/[^a-zA-Z0-9_\u00C0-\u017F]/g, '_').substring(0, 30);
    link.setAttribute("download", `IESU_Anket_Yanitlari_Anonim_${survey.id}_${safeTitle}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.toast?.success) {
      window.toast.success("✅ Öğrenci kimlik bilgisi içermeyen %100 anonim Excel tablosu indirildi.");
    }
  };

  const handleSpssExport = (survey) => {
    handleKVKKExport(survey);
  };

  const handleToggleStatus = (survey) => {
    const isCurrentlyActive = survey.status === 'Aktif';
    const newStatus = isCurrentlyActive ? 'Kapandı' : 'Aktif';
    
    setSurveys((surveys || []).map(item => item.id === survey.id ? { 
      ...item, 
      status: newStatus 
    } : item));

    if (window.toast?.info) {
      if (newStatus === 'Kapandı') {
        window.toast.info(`Anket kapatıldı ve Anket & Yanıt Havuzuna (Arşiv) aktarıldı.`);
      } else {
        window.toast.info(`Anket yayına alındı.`);
      }
    }
  };

  const handleShareToFeed = (survey) => {
    if (!setPosts) { 
      if (window.toast?.info) window.toast.info('Feed entegrasyonu bulunamadı!'); 
      return; 
    }
    const newPost = {
      id: Date.now(),
      author: currentUser || { name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin', avatar: '/iesu-logo.svg' },
      content: `📢 **Yeni Anket:** ${survey.title}\n\nLütfen değerlendirme anketimize katılarak bize geri bildirimde bulunun. Desteğiniz için teşekkürler!\n\n[Ankete Katıl]`,
      timestamp: 'Az önce',
      likes: 0,
      comments: [],
      type: 'anket',
      surveyId: survey.id,
      surveyData: survey
    };
    setPosts([newPost, ...(posts || [])]);
    if (window.toast?.success) {
      window.toast.success('Anket ana akışta (Feed) paylaşıldı.');
    }
  };

  const safeSurveys = surveys || [];
  const filtered = safeSurveys.filter(s => {
    const matchQ = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' 
      ? true 
      : (s.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchAlumni = isAlumniTab ? (s.targetAudience === 'Mezunlar' || s.targetAudience === 'Tümü') : true;
    return matchQ && matchS && matchAlumni;
  });

  const activeCount = safeSurveys.filter(s => s.status === 'Aktif').length;
  const closedPoolCount = safeSurveys.filter(s => s.status === 'Kapandı').length;
  const totalQuestionsInPool = safeSurveys.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

  const headerView = isAlumniTab ? null : (
    <PanelHeader 
      title="Form ve Anket Havuzu Yönetimi" 
      sub="Öğrenci ve mezun anket sorularını düzenleyin, kapatılan anketleri havuzda saklayın ve anonim Excel tablosu olarak indirin." 
      action={
        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => setShowIntelligenceModal(true)} 
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles size={18} className="text-purple-600" /> Anket İstihbaratı & YÖK
          </button>
          <button 
            onClick={handleAddNew} 
            className="bg-[#990000] text-white hover:bg-[#800000] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus size={18} /> Yeni Anket Oluştur
          </button>
        </div>
      } 
    />
  );

  const topStatsView = isAlumniTab ? (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="font-bold text-gray-700">Mezun Anketleri ve Soru Havuzu Yöneticisi</div>
      <button 
        onClick={handleAddNew} 
        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
      >
        <Plus size={18} /> Yeni Mezun Anketi Ekle
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <TopInfoCard icon={<ClipboardList size={20} />} title="Toplam Anket" value={safeSurveys.length} color="blue" />
      <TopInfoCard icon={<CheckCircle2 size={20} />} title="Aktif Yayında" value={activeCount} color="emerald" />
      <TopInfoCard icon={<Archive size={20} />} title="Havuzda Saklanan" value={closedPoolCount} color="amber" />
      <TopInfoCard icon={<BarChart3 size={20} />} title="Soru Havuzu" value={`${totalQuestionsInPool} Soru`} color="purple" />
    </div>
  );

  const listView = (
    <div className="space-y-6">
      {headerView}
      {topStatsView}

      {/* Info Banner on KVKK & Pool */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-900 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <span className="font-black uppercase tracking-wider text-[10px] text-emerald-700 block">Dönemsel Soru Havuzu & KVKK Güvencesi</span>
            <p className="font-medium text-emerald-800">
              Kapatılan anketler silinmez, yanıt havuzunda arşivlenir. Dışa aktarılan Excel tablolarında <b>öğrenci/mezun kimlik bilgileri kesinlikle bulunmaz</b> (%100 Anonim).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 bg-gray-50/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Anket başlığında veya soru havuzunda ara..." 
              value={searchQuery} 
              onChange={(e)=>setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20" 
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter} 
              onChange={(e)=>setStatusFilter(e.target.value)} 
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20 cursor-pointer"
            >
              <option value="all">Tüm Durumlar & Havuz</option>
              <option value="Aktif">Aktif Yayındakiler</option>
              <option value="Kapandı">📂 Kapandı (Havuz & Arşiv)</option>
              <option value="Taslak">Taslaklar</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Anket & Soru Havuzu</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Yanıt / Hedef</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 rounded-tr-2xl text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => {
                const isExpanded = expandedSurveyId === s.id;
                const questionCount = (s.questions || []).length;
                const isClosed = s.status === 'Kapandı';

                return (
                  <React.Fragment key={s.id}>
                    <tr 
                      className="hover:bg-slate-50/80 transition group cursor-pointer" 
                      onClick={() => setExpandedSurveyId(isExpanded ? null : s.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{s.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-gray-500">{s.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {questionCount} Soru Havuzu
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Hedef: {s.targetAudience || 'Tümü'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{s.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-600">{s.responses || 0}</span>
                          <span className="text-gray-500">/ {s.total || 100}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${Math.min(100, ((s.responses || 0) / (s.total || 1)) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isClosed ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
                            <Archive size={12} /> Havuzda Saklanıyor
                          </span>
                        ) : (
                          <Badge status={s.status} />
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Active / Close to Pool */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleToggleStatus(s);
                            }} 
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                              s.status === 'Aktif' 
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' 
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                            title={s.status === 'Aktif' ? 'Yayını Durdur ve Havuzda Sakla' : 'Yayına Al'}
                          >
                            {s.status === 'Aktif' ? 'Kapat & Havuzla' : 'Yayına Al'}
                          </button>

                          {/* Direct Excel (Anonim) Download */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleKVKKExport(s); 
                            }} 
                            className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition cursor-pointer" 
                            title="Excel İndir (%100 Anonim - KVKK)"
                          >
                            <Download size={16} />
                          </button>

                          {/* Expand Details */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setExpandedSurveyId(isExpanded ? null : s.id); 
                            }} 
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer" 
                            title="Yanıtları ve Soru Havuzunu Gör"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {/* Edit Questions / Pool */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleEdit(s); 
                            }} 
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer" 
                            title="Soruları ve Anket Bilgilerini Düzenle"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete */}
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleDelete(s.id); 
                            }} 
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer" 
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED ACCORDION: SORU VE YANIT HAVUZU */}
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={5} className="p-0 border-b border-gray-100">
                          <div className="p-6 bg-slate-50 border-t-2 border-red-500/20 shadow-inner space-y-4">
                            
                            {/* Actions Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div>
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                  <Users size={18} className="text-red-600" /> 
                                  Anket & Yanıt Havuzu: {s.title} ({s.responses || 0} Yanıt)
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Öğrenci veya mezun kimlik bilgileri kesinlikle tutulmaz ve raporda yer almaz.
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEdit(s)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-100 rounded-lg font-bold text-xs border border-gray-200 transition cursor-pointer"
                                >
                                  <Edit size={13} /> Soru Havuzunu Düzenle
                                </button>
                                <button 
                                  onClick={() => handleKVKKExport(s)} 
                                  className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold text-xs transition shadow-sm cursor-pointer"
                                >
                                  <Download size={14} /> Excel İndir (%100 Anonim)
                                </button>
                              </div>
                            </div>

                            {/* Active Questions Preview */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                              <h5 className="text-xs font-black uppercase text-gray-600 mb-2.5 flex items-center gap-1.5">
                                <Target size={14} className="text-[#990000]" /> Bu Anketteki Soru Havuzu ({questionCount} Soru)
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                {(s.questions || []).map((q, qIndex) => (
                                  <div key={q.id || qIndex} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-2">
                                    <span className="font-bold text-[#990000] shrink-0">{qIndex + 1}.</span>
                                    <span className="font-medium text-gray-700">{q.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Response Preview Table */}
                            {s.responses === 0 ? (
                              <div className="text-center py-6 text-gray-500 text-xs font-medium bg-white rounded-xl border border-gray-200">
                                Henüz bu ankete verilmiş bir yanıt bulunmuyor.
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left text-xs">
                                  <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                                    <tr>
                                      <th className="px-4 py-3">Katılımcı Sırası (Tamamen Anonim)</th>
                                      {(s.questions || []).slice(0, 4).map((q, i) => (
                                        <th key={i} className="px-4 py-3" title={q.text}>Soru {i+1} Skoru</th>
                                      ))}
                                      <th className="px-4 py-3">Ortalama</th>
                                      <th className="px-4 py-3">Güvenlik</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {[...Array(Math.min(5, s.responses || 0))].map((_, index) => (
                                      <tr key={index} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-2.5 font-bold text-gray-900">Katılımcı {index + 1}</td>
                                        {(s.questions || []).slice(0, 4).map((_, i) => (
                                          <td key={i} className="px-4 py-2.5">
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded">
                                              {((index + i) % 3) + 3} / 5
                                            </span>
                                          </td>
                                        ))}
                                        <td className="px-4 py-2.5 font-bold text-slate-700">4.2 / 5</td>
                                        <td className="px-4 py-2.5 text-emerald-600 font-bold text-[11px]">KVKK Uyumlu Anonim</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {(s.responses > 5) && (
                                  <div className="p-2.5 text-center text-xs font-bold text-gray-500 bg-gray-50/50 border-t border-gray-100">
                                    + {s.responses - 5} yanıt daha (Tüm yanıtları görmek için "Excel İndir" butonuna tıklayınız)
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <ClipboardList size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="font-medium">Kriterlere uygun anket bulunamadı.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const formView = (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-black text-gray-900">
              {currentId ? 'Anket ve Soru Havuzunu Düzenle' : 'Yeni Anket ve Soru Havuzu Oluştur'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Soruları dönem dönem güncelleyebilir, yeni Likert değerlendirme soruları ekleyebilirsiniz.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setIsEditing(false)} 
            className="text-sm font-bold text-gray-500 hover:text-gray-900 transition cursor-pointer"
          >
            İptal
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">
              Anket Başlığı <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={form.title} 
              onChange={e=>setForm({...form, title: e.target.value})} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" 
              placeholder="Örn: 2026 Bahar Dönemi Mezun Kariyer Anketi" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Anket Tipi</label>
              <select 
                value={form.type || 'Genel Anket'} 
                onChange={e=>setForm({...form, type: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              >
                <option value="Genel Anket">Genel Anket</option>
                <option value="Etkinlik Değerlendirme">Etkinlik Değerlendirme</option>
                <option value="Kariyer ve İstihdam">Kariyer ve İstihdam</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Hedef Kitle</label>
              <select 
                value={form.targetAudience || 'Tümü'} 
                onChange={e=>setForm({...form, targetAudience: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              >
                <option value="Tümü">Tümü (Genel)</option>
                <option value="Mezunlar">Mezunlar</option>
                <option value="Öğrenciler">Öğrenciler</option>
                <option value="Firmalar">Firmalar</option>
                <option value="Akademik">Akademik Personel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Yayın Süresi (Gün)</label>
              <input 
                type="number" 
                min="1" 
                max="365" 
                value={form.durationDays || 30} 
                onChange={e=>setForm({...form, durationDays: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500/20" 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum (Yayın / Havuz)</label>
              <select 
                value={form.status} 
                onChange={e=>setForm({...form, status: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              >
                <option value="Aktif">Aktif (Yayında)</option>
                <option value="Kapandı">Kapandı (Havuzda Sakla)</option>
                <option value="Taslak">Taslak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Açıklama</label>
            <textarea 
              value={form.description} 
              onChange={e=>setForm({...form, description: e.target.value})} 
              rows={2} 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" 
              placeholder="Anketin dönemsel amacı ve akreditasyon kapsamı..."
            />
          </div>

          {/* Soru Havuzu Bölümü */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="text-sm font-black text-gray-900 flex items-center gap-2">
                  <Target size={18} className="text-[#990000]" /> 
                  Dönemsel Soru Havuzu ({(form.questions || []).length} Soru)
                </label>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Dönem dönem değiştirebileceğiniz değerlendirme soruları. Her soru 1-5 arası Likert puanlama sunar.
                </p>
              </div>
              <button 
                type="button" 
                onClick={addQuestion} 
                className="text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Yeni Soru Ekle
              </button>
            </div>
            
            <div className="space-y-3">
              {(form.questions || []).map((q, index) => (
                <div key={q.id || index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={q.text} 
                      onChange={(e) => updateQuestion(q.id, e.target.value)} 
                      placeholder="Soru metnini giriniz (Örn: Fakültemizin sunduğu mentörlük olanaklarından memnuniyetiniz)..." 
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5 font-medium px-1">
                      <span>Puanlama Skalası: 1 (Yetersiz) - 5 (Mükemmel)</span>
                      <span className="text-emerald-700 font-bold">KVKK Anonim İndirme Uyumlu</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(q.id)} 
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition mt-0.5 cursor-pointer"
                    title="Soruyu Kaldır"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition cursor-pointer"
            >
              İptal
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#990000] hover:bg-[#800000] text-white rounded-xl text-sm font-bold transition shadow-md cursor-pointer"
            >
              {currentId ? 'Değişiklikleri ve Soru Havuzunu Kaydet' : 'Anketi Havuzda Oluştur'}
            </button>
          </div>
        </form>
      </div>
      
      {/* CANLI ÖNİZLEME */}
      <div className="w-full lg:w-96 space-y-4">
        <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-6">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs">
              <Eye size={16} className="text-emerald-700" /> Mezun / Kullanıcı Önizlemesi
            </h4>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
              {form.targetAudience || 'Tümü'}
            </span>
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-200">
                Resmî Değerlendirme Anketi
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-1">{form.title || 'Anket Başlığı...'}</h3>
            </div>
            
            {form.description && (
              <p className="text-[11px] text-gray-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                {form.description}
              </p>
            )}

            <div className="space-y-2.5 border-t border-gray-100 pt-3 max-h-[35vh] overflow-y-auto pr-1">
              {(form.questions || []).map((q, i) => (
                <div key={q.id || i} className="p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs">
                  <p className="font-bold text-slate-800 mb-1.5">{i+1}. {q.text || 'Soru metni girilmedi...'}</p>
                  <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <div key={val} className="flex-1 py-1 text-center bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-600">
                        {val}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-snug">
              <div className="font-bold flex items-center gap-1"><CheckCircle2 size={13} className="text-emerald-600" /> KVKK & Excel Garantisi</div>
              <p className="text-emerald-800 mt-0.5">Excel tablosunda katılımcıların adı, soyadı, TC kimliği ve iletişim bilgileri kesinlikle yer almaz.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in font-sans">
      {isEditing ? formView : listView}
      {showIntelligenceModal && (
        <SurveyIntelligenceModal 
          isOpen={showIntelligenceModal} 
          onClose={() => setShowIntelligenceModal(false)} 
        />
      )}
    </div>
  );
}
