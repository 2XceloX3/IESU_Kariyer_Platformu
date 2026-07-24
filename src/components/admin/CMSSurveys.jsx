import React, { useState } from 'react';
import { ClipboardList, Edit, Trash2, Plus, Search, Filter, CheckCircle2, Download, Table, BarChart3, Target, Share2, Eye, X, ChevronDown, ChevronUp, Users } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard, Badge } from './AdminCMSLayout';
import PanelHeader from './PanelHeader';

export default function CMSSurveys({ surveys = [], setSurveys, students = [], isAlumniTab = false, posts, setPosts, currentUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewSurvey, setPreviewSurvey] = useState(null);
  const [expandedSurveyId, setExpandedSurveyId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    date: '',
    status: 'Aktif',
    type: 'Genel Anket', // 'Genel Anket', 'Etkinlik Değerlendirme'
    targetAudience: 'Tümü', // 'Öğrenciler', 'Mezunlar', 'Tümü'
    description: '',
    questions: [
      { id: 'q1', text: 'Kariyer Merkezi hizmetlerinden genel olarak memnun musunuz?', type: 'likert' }
    ]
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Aktif',
      type: 'Etkinlik Değerlendirme',
      targetAudience: isAlumniTab ? 'Mezunlar' : 'Tümü',
      description: '',
      questions: [{ id: 'q1', text: 'Etkinlikten genel olarak memnun kaldınız mı?', type: 'likert' }]
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (survey) => {
    setForm({ 
      ...survey,
      questions: survey.questions || [{ id: 'q1', text: 'Soru 1', type: 'likert' }]
    });
    setCurrentId(survey.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu anketi silmek istediğinize emin misiniz?")) {
      setSurveys((surveys || []).filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) return window.toast.info("Anket başlığı zorunludur.");

    if (currentId) {
      setSurveys((surveys || []).map(s => s.id === currentId ? { ...s, ...form, updatedAt: new Date().toISOString() } : s));
    } else {
      setSurveys([{ 
        ...form, 
        id: 'SRV-' + Date.now(), 
        responses: 0, 
        total: 100, // Dummy target
        createdAt: new Date().toISOString() 
      }, ...surveys]);
    }
    setIsEditing(true);
    window.toast.info('Anket kaydedildi.');
    setIsEditing(false);
  };

  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, { id: 'q' + Date.now(), text: '', type: 'likert' }]
    }));
  };

  const updateQuestion = (id, text) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, text } : q)
    }));
  };

  const removeQuestion = (id) => {
    if (form.questions.length === 1) return window.toast.info("En az 1 soru olmalıdır.");
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const handleSpssExport = (survey) => {
    // Generate dummy SPSS/CSV content
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Cinsiyet,Bolum,Soru1_Likert,Soru2_Likert,Soru3_Likert\n"
      + "1,1,Bilgisayar,5,4,5\n"
      + "2,2,Isletme,3,4,4\n"
      + "3,1,Endustri,5,5,4\n"
      + "4,2,Mimarlik,4,2,3\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SPSS_Export_${survey.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.toast.success("SPSS / Excel uyumlu veri başarıyla indirildi. (Mock Data)");
  };

  const handleKVKKExport = (survey) => {
    const csvContent = [];
    // KVKK & SPSS İsteği: İsim/ID yok, sadece soruların skorları (Sütun: Q1, Q2, Q3 vb., Satır: Katılımcı Yanıtları)
    const headerRow = ["Katilimci_No", ...survey.questions.map((q, i) => `Soru_${i+1}_Skor`)];
    csvContent.push(headerRow.join(","));
    
    for(let i = 0; i < (survey.responses || 15); i++) {
      const row = [`K_${i+1}`]; // Katılımcı ID (Anonim)
      survey.questions.forEach(q => {
        const score = Math.floor(Math.random() * 5) + 1; // 1-5 Mock data
        row.push(score);
      });
      csvContent.push(row.join(","));
    }

    const blob = new Blob(["\ufeff" + csvContent.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SPSS_Export_${survey.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareToFeed = (survey) => {
    if(!setPosts) { window.toast.info('Feed entegrasyonu bulunamadı!'); return; }
    const newPost = {
      id: Date.now(),
      author: currentUser || { name: 'Kariyer Merkezi', role: 'admin', avatar: `https://ui-avatars.com/api/?name=Kariyer&background=0D8ABC&color=fff` },
      content: `📢 **Yeni Anket:** ${survey.title}\n\nLütfen değerlendirme anketimize katılarak bize geri bildirimde bulunun. Desteğiniz için teşekkürler!\n\n[Ankete Katıl]`,
      timestamp: 'Az önce',
      likes: 0,
      comments: [],
      type: 'anket',
      surveyId: survey.id,
      surveyData: survey
    };
    setPosts([newPost, ...posts]);
    window.toast.success('Anket başarıyla ana akışta (Feed) paylaşıldı! Öğrenciler ve firmalar görebilir.');
  };

  const safeSurveys = (surveys || []);
  const filtered = safeSurveys.filter(s => {
    const matchQ = (s.title||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (s.status||'').toLowerCase() === statusFilter.toLowerCase();
    const matchAlumni = isAlumniTab ? (s.targetAudience === 'Mezunlar' || s.targetAudience === 'Tümü') : true;
    return matchQ && matchS && matchAlumni;
  });

  const activeCount = safeSurveys.filter(s => s.status === 'Aktif').length;

  const headerView = isAlumniTab ? null : (
    <PanelHeader 
      title="Form ve Anket Yönetimi" 
      sub="Öğrenci ve mezun anketlerini yönetin, SPSS uyumlu dışa aktarın." 
      action={
        <button onClick={handleAddNew} className="bg-white text-emerald-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
          <Plus size={18} /> Yeni Anket
        </button>
      } 
    />
  );

  const topStatsView = isAlumniTab ? (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="font-bold text-gray-700">Mezun Anketleri Yöneticisi</div>
      <button onClick={handleAddNew} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
        <Plus size={18} /> Yeni Mezun Anketi Ekle
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TopInfoCard icon={<ClipboardList size={20} />} title="Toplam Anket" value={safeSurveys.length} color="blue" />
      <TopInfoCard icon={<CheckCircle2 size={20} />} title="Aktif Anketler" value={activeCount} color="emerald" />
      <TopInfoCard icon={<BarChart3 size={20} />} title="Toplam Yanıt" value={safeSurveys.reduce((acc, s) => acc + (s.responses || 0), 0)} color="purple" />
    </div>
  );

  const listView = (
    <div className="space-y-6">
      {headerView}
      {topStatsView}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 bg-gray-50/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input type="text" placeholder="Anket başlığında ara..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20" />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
              <option value="all">Tüm Durumlar</option>
              <option value="Aktif">Aktif</option>
              <option value="Kapandı">Kapandı</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Anket Başlığı</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4">Yanıt / Hedef</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 rounded-tr-2xl text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => {
                const isExpanded = expandedSurveyId === s.id;
                // Gerçek öğrenci datasını kullanarak yanıtları simüle et (yalan veri olmaması için)
                const respondents = students.slice(0, Math.min(s.responses || 0, students.length));

                return (
                <React.Fragment key={s.id}>
                  <tr className="hover:bg-slate-50/80 transition group cursor-pointer" onClick={() => setExpandedSurveyId(isExpanded ? null : s.id)}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{s.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.id}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{s.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">{s.responses || 0}</span>
                        <span className="text-gray-500">/ {s.total || 0}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, ((s.responses || 0) / (s.total || 1)) * 100)}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge status={s.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setExpandedSurveyId(isExpanded ? null : s.id); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Yanıtları Gör">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setPreviewSurvey(s); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition tooltip" title="Önizleme">
                          <Eye size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleShareToFeed(s); }} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition tooltip" title="Akışta Paylaş">
                          <Share2 size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(s); }} className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Düzenle">
                          <Edit size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* RESPONSE LIST ACCORDION */}
                  {isExpanded && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={5} className="p-0 border-b border-gray-100">
                        <div className="p-6 bg-slate-50 border-t-2 border-blue-500/20 shadow-inner">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} className="text-blue-600" /> Havuz: Anket Yanıtları ({s.responses || 0})</h4>
                            {(s.responses > 0) && (
                              <button onClick={() => handleKVKKExport(s)} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition border border-emerald-200 shadow-sm">
                                <Download size={14} /> Excel İndir (KVKK)
                              </button>
                            )}
                          </div>
                          
                          {s.responses === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm font-medium">Henüz bu ankete yanıt verilmemiş.</div>
                          ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                              <tr>
                                <th className="px-4 py-3">Katılımcı (Anonim)</th>
                                {s.questions?.slice(0, 3).map((q, i) => (
                                  <th key={i} className="px-4 py-3" title={q.text}>Soru {i+1} Skoru</th>
                                ))}
                                <th className="px-4 py-3">Durum</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {[...Array(Math.min(5, s.responses || 0))].map((_, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition">
                                  <td className="px-4 py-3 font-bold text-gray-900">Katılımcı {index + 1}</td>
                                  {s.questions?.slice(0, 3).map((q, i) => (
                                    <td key={i} className="px-4 py-3">
                                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded">{(index % 3) + 3} / 5</span>
                                    </td>
                                  ))}
                                  <td className="px-4 py-3 text-emerald-600 font-bold text-xs">Tamamlandı</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {(s.responses > 5) && (
                            <div className="p-3 text-center text-xs font-bold text-gray-500 bg-gray-50/50 border-t border-gray-100">
                              + {s.responses - 5} yanıt daha (Tümünü görmek için Excel indirin)
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
                    <p className="font-medium">Kayıt bulunamadı.</p>
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
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'Anketi Düzenle' : 'Yeni Anket Oluştur'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Anket Başlığı <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Mezun İstihdam Anketi" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Anket Tipi</label>
              <select value={form.type || 'Genel Anket'} onChange={e=>setForm({...form, type: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option value="Genel Anket">Genel Anket</option>
                <option value="Etkinlik Değerlendirme">Etkinlik Değerlendirme</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Hedef Kitle</label>
              <select value={form.targetAudience} onChange={e=>setForm({...form, targetAudience: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Tümü</option>
                <option>Öğrenciler</option>
                <option>Mezunlar</option>
                <option>Firmalar</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Aktif</option>
                <option>Kapandı</option>
                <option>Taslak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Açıklama</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={3} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Anketin amacı..."></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-black text-gray-900 block flex items-center gap-2"><Target size={18} className="text-blue-600" /> Değerlendirme Soruları</label>
              <button type="button" onClick={addQuestion} className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition flex items-center gap-1">
                <Plus size={14} /> Soru Ekle
              </button>
            </div>
            
            <div className="space-y-3">
              {(form.questions || []).map((q, index) => (
                <div key={q.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={q.text} 
                      onChange={(e) => updateQuestion(q.id, e.target.value)} 
                      placeholder="Soru metnini giriniz..." 
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 font-medium ml-1">Tip: 1'den 5'e Likert (Kesinlikle Katılmıyorum ➜ Kesinlikle Katılıyorum)</p>
                  </div>
                  <button type="button" onClick={() => removeQuestion(q.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition mt-0.5">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition shadow-sm">
              {currentId ? 'Değişiklikleri Kaydet' : 'Anketi Oluştur'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="w-full lg:w-96 space-y-4">
        {/* CANLI ÖNİZLEME (LIVE PREVIEW) */}
        <div className="bg-white border-2 border-indigo-100 rounded-2xl shadow-sm overflow-hidden sticky top-6">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
            <h4 className="font-bold text-indigo-900 flex items-center gap-2 text-sm">
              <Eye size={16} /> Canlı Önizleme
            </h4>
            <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Öğrenci Akışı</span>
          </div>
          
          <div className="p-5">
            {form.title ? (
              <h3 className="text-base font-bold text-gray-900 mb-1">{form.title}</h3>
            ) : (
              <div className="h-5 bg-gray-100 rounded w-3/4 mb-2"></div>
            )}
            
            {form.description ? (
              <p className="text-xs text-gray-500 mb-5">{form.description}</p>
            ) : (
              <div className="h-3 bg-gray-50 rounded w-full mb-5"></div>
            )}

            <div className="space-y-5 border-t border-gray-100 pt-5">
              {form.questions.map((q, i) => (
                <div key={q.id}>
                  <p className="text-xs font-bold text-gray-800 mb-3">{i+1}. {q.text || 'Soru metni girilmedi...'}</p>
                  
                  {q.type === 'likert' && (
                    <div className="flex justify-between gap-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <div key={val} className="flex-1 py-1.5 text-center bg-gray-50 border border-gray-200 rounded text-xs font-medium text-gray-500">
                          {val}
                        </div>
                      ))}
                    </div>
                  )}
                  {q.type === 'text' && (
                    <div className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg"></div>
                  )}
                </div>
              ))}
            </div>
            
            <button disabled className="w-full mt-6 bg-gray-200 text-gray-500 font-bold py-2 rounded-lg text-xs cursor-not-allowed">
              Gönder (Test)
            </button>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-xs"><Table size={14} /> SPSS Formatı</h4>
          <p className="text-[11px] text-emerald-800/80 mt-1.5 leading-relaxed">
            İndirilecek Excel raporlarında KVKK gereği kimlik bilgileri <b>yer almaz</b>. Sadece 1-5 arasındaki sayısal cevap skalası aktarılır.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {isEditing ? formView : listView}
    </div>
  );
}
