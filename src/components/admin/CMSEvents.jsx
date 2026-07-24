import React, { useState } from 'react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { Calendar, CheckCircle2, MapPin, Edit, Trash2, Plus, Search, Filter, Image as ImageIcon, AlertCircle, Eye, Download, CheckCircle, FileText } from 'lucide-react';

export default function CMSEvents({ events = [], setEvents }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    hasSurvey: false,
    surveyQuestions: [{ id: 'q1', text: 'Etkinlikten genel olarak memnun kaldınız mı?', type: 'likert' }],
    description: '',
    imageUrl: '',
    attachmentData: null,
    attachmentName: '',
    registrationLink: '',
    status: 'Yayında'
  });

  const [activeTab, setActiveTab] = useState('havuz');
  const [expandedSurvey, setExpandedSurvey] = useState(false);
  const [surveyForm, setSurveyForm] = useState({
    title: '',
    targetCourse: 'Tümü',
    questions: [
      'Etkinlik mekanı yeterliydi.',
      'Konuşmacılar konuya hakimdi.',
      'İkramlar ve organizasyon başarılıydı.',
      'Bu etkinliği başkalarına tavsiye ederim.',
      'Etkinlik duyurusu zamanında yapıldı.'
    ],
    kvkkConfirmed: false
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      imageUrl: '',
      attachmentData: null,
      attachmentName: '',
      registrationLink: '',
      status: 'Yayında'
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (ev) => {
    setForm({ 
      ...ev,
      time: ev.time || ''
    });
    setCurrentId(ev.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
      setEvents(prev => (prev || []).filter(e => e.id !== id));
    }
  };

  
  const addSurveyQuestion = () => {
    setForm(prev => ({
      ...prev,
      surveyQuestions: [...prev.surveyQuestions, { id: 'q' + Date.now(), text: '', type: 'likert' }]
    }));
  };
  const updateSurveyQuestion = (id, text) => {
    setForm(prev => ({
      ...prev,
      surveyQuestions: prev.surveyQuestions.map(q => q.id === id ? { ...q, text } : q)
    }));
  };
  const removeSurveyQuestion = (id) => {
    setForm(prev => ({
      ...prev,
      surveyQuestions: prev.surveyQuestions.filter(q => q.id !== id)
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.date) return window.toast.info("Başlık ve tarih zorunludur.");

    const newId = currentId || ('NE-E' + Date.now());
    
    if (currentId) {
      setEvents((events || []).map(ev => ev.id === currentId ? { ...ev, ...form, updatedAt: new Date().toISOString() } : ev));
    } else {
      setEvents([{ ...form, id: newId, type: 'Etkinlik', createdAt: new Date().toISOString() }, ...events]);
    }
    setIsEditing(false);
  };

  const filtered = (events || []).filter(e => {
    const matchQ = (e.title||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (e.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (events || []).filter(e => e.status === 'Yayında').length;
  const draftCount = (events || []).filter(e => e.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Etkinlik Yönetimi</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Sistemdeki kariyer fuarları, seminerler ve etkinlikleri yönetin.</p>
          </div>
          <button onClick={handleAddNew} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md">
            <Plus size={18} /> Yeni Etkinlik Ekle
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TopInfoCard title="Toplam Etkinlik" count={(events || []).length} icon={<Calendar size={24} />} color="blue" />
          <TopInfoCard title="Yayında" count={activeCount} icon={<CheckCircle2 size={24} />} color="emerald" />
          <TopInfoCard title="Taslak Bekleyen" count={draftCount} icon={<Edit size={24} />} color="orange" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Etkinlik ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="yayında">Yayında</option>
            <option value="taslak">Taslak</option>
          </select>
          <button aria-label="İşlem Butonu" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><Calendar size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun etkinlik bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Etkinlik</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tarih & Saat</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Konum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {e.imageUrl ? <img src={e.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Calendar size={20} className="text-gray-500"/></div>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{e.title}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5 truncate max-w-[200px]">{e.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-sm font-bold text-gray-700">{e.date || 'Belirtilmedi'}</p>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{e.time || '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><MapPin size={12}/> {e.location || 'Belirtilmedi'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${(e.status === 'Yayında') ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(e)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(e.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const actualFormView = (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Etkinlik Başlığı <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Etkinlik adını girin..." required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Tarih <span className="text-red-500">*</span></label>
              <input type="text" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: 20 Eylül 2026" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Saat</label>
              <input type="text" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: 14:00" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Konum</label>
              <input type="text" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Konferans Salonu 1" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yayında</option>
                <option>Taslak</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Kayıt / Başvuru Linki (Varsa)</label>
            <input type="url" value={form.registrationLink} onChange={e=>setForm({...form, registrationLink: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="https://" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Açıklama</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={5} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Etkinlik detayları..."></textarea>
          </div>

          
          <div className="pt-6 border-t border-gray-100 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" id="hasSurvey" checked={form.hasSurvey} onChange={(e) => setForm({...form, hasSurvey: e.target.checked})} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
              <label htmlFor="hasSurvey" className="text-sm font-black text-gray-900">Etkinlik Sonrası Değerlendirme Anketi (Likert) Ekle</label>
            </div>
            
            {form.hasSurvey && (
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-indigo-900">Anket Soruları</h4>
                  <button type="button" onClick={addSurveyQuestion} className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 transition">+ Soru Ekle</button>
                </div>
                {form.surveyQuestions.map((q, index) => (
                  <div key={q.id} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-indigo-400 mt-2">{index+1}.</span>
                    <input type="text" value={q.text} onChange={(e) => updateSurveyQuestion(q.id, e.target.value)} placeholder="Likert sorusu (Örn: Eğitmen yeterliydi)" className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500" />
                    <button type="button" onClick={() => removeSurveyQuestion(q.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Etkinlik Afişi / Görsel" 
              image={form.imageUrl} 
              onImageChange={(val) => setForm({...form, imageUrl: val})} 
              aspect="16:9" 
            />
            <AttachmentUploader 
              label="Ek Dosya (PDF vs.)" 
              file={form.attachmentData} 
              onFileChange={(val) => setForm({...form, attachmentData: val, attachmentName: val ? 'Ek_Dosya' : ''})} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Etkinliği Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );

  const previewView = (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="h-48 bg-gray-100 relative group">
        {form.imageUrl ? (
          <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
            <ImageIcon size={32} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-2">Görsel Yok</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm">
          <span className={`text-[10px] font-black uppercase tracking-wider ${(form.status === 'Yayında') ? 'text-emerald-600' : 'text-orange-600'}`}>
            {form.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider inline-block mb-2">ETKİNLİK</span>
        
        <h3 className="text-[18px] font-black text-gray-900 leading-tight mb-3">
          {form.title || 'Etkinlik Başlığı'}
        </h3>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
            <Calendar size={14} className="text-red-500" />
            <span>{form.date || 'Tarih Belirtilmedi'} {form.time ? `- ${form.time}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
            <MapPin size={14} className="text-red-500" />
            <span>{form.location || 'Konum Belirtilmedi'}</span>
          </div>
        </div>

        <p className="text-[13px] font-medium text-gray-500 mb-5 line-clamp-3">
          {form.description || 'Etkinlik hakkında detaylı bilgi burada görünecektir.'}
        </p>

        <button disabled className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-[13px] font-bold opacity-50 cursor-not-allowed">
          Kayıt Ol / Detaylar
        </button>
      </div>
    </div>
  );

  const feedPreviewView = form.title ? (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <Calendar size={16} className="text-red-600" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900 flex items-center gap-1">Kariyer Geliştirme Merkezi <CheckCircle2 size={12} className="text-emerald-500" /></p>
            <p className="text-[10px] text-gray-500">Az önce • Etkinlik Paylaşımı</p>
          </div>
        </div>
        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3 h-28">
            <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <p className="text-[12px] font-bold text-gray-800 mb-1">{form.title}</p>
        <p className="text-[11px] text-gray-500 line-clamp-2">{form.description || ''}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
          <span>📅 {form.date || '...'}</span>
          <span>📍 {form.location || '...'}</span>
        </div>
      </div>
    </div>
  ) : null;

  const tabs = (
    <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 gap-2 overflow-x-auto w-max">
      <button 
        onClick={() => setActiveTab('havuz')}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'havuz' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <Calendar size={18} /> Etkinlik Havuzu
      </button>
      <button 
        onClick={() => setActiveTab('anket')}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'anket' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
      >
        <FileText size={18} /> Etkinlik Anketleri
      </button>
    </div>
  );

  return (
    <AdminCMSLayout
      title={activeTab === 'havuz' ? (isEditing ? (currentId ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle') : 'Etkinlikler') : 'Etkinlik Anketleri'}
      sub={activeTab === 'havuz' ? (isEditing ? 'Etkinlik detaylarını buradan güncelleyebilirsiniz.' : 'Sistemdeki yaklaşan etkinlikleri yönetin') : 'Etkinlik değerlendirme anketlerini oluşturun ve sonuçlarını inceleyin.'}
      headerAction={
        activeTab === 'havuz' && !isEditing ? (
          <button onClick={handleAddNew} className="bg-white text-red-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={18} /> Yeni Etkinlik Ekle
          </button>
        ) : null
      }
      tabs={!isEditing ? tabs : null}
      isEditing={activeTab === 'havuz' && isEditing}
      listView={activeTab === 'havuz' ? listView : null}
      formView={activeTab === 'havuz' ? actualFormView : null}
      previewView={activeTab === 'havuz' ? previewView : null}
      feedPreviewView={activeTab === 'havuz' ? feedPreviewView : null}
    >

      {activeTab === 'anket' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">Etkinlik Anketleri</h3>
            <button className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-bold transition">
              <Download size={16} /> Excel İndir
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div>
                <p className="text-sm font-bold text-gray-500 mb-6">Etkinlik katılımcıları için dinamik değerlendirme anketleri oluşturun.</p>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 mb-6">
                  <AlertCircle size={20} className="text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm mb-1">KVKK Uyumluluğu</h4>
                    <p className="text-xs text-amber-700">Tüm anketlerde öğrencilerin açık rıza onayı zorunludur.</p>
                  </div>
                </div>

                <form className="space-y-5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Anket Başlığı</label>
                    <input type="text" value={surveyForm.title} onChange={e => setSurveyForm({...surveyForm, title: e.target.value})} placeholder="Örn: Kariyer Fuarı Değerlendirmesi" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 outline-none font-medium" />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Anket Soruları (Likert Ölçeği)</label>
                      <button type="button" onClick={() => setSurveyForm({...surveyForm, questions: [...surveyForm.questions, 'Yeni Soru']})} className="text-xs font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                        <Plus size={14} /> Soru Ekle
                      </button>
                    </div>

                    {surveyForm.questions.map((q, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-red-100 text-red-700 font-black flex items-center justify-center shrink-0">S{i+1}</div>
                        <input type="text" value={q} onChange={(e) => {
                          const newQ = [...surveyForm.questions];
                          newQ[i] = e.target.value;
                          setSurveyForm({...surveyForm, questions: newQ});
                        }} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500 font-medium" />
                        <button type="button" onClick={() => {
                          const newQ = surveyForm.questions.filter((_, idx) => idx !== i);
                          setSurveyForm({...surveyForm, questions: newQ});
                        }} className="w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6 cursor-pointer hover:bg-gray-100 transition" onClick={() => setSurveyForm({...surveyForm, kvkkConfirmed: !surveyForm.kvkkConfirmed})}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${surveyForm.kvkkConfirmed ? 'bg-red-600' : 'border-2 border-gray-300 bg-white'}`}>
                      {surveyForm.kvkkConfirmed && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold text-gray-700 select-none">Öğrenci anket öncesi KVKK onay metnini kabul etmek zorundadır.</span>
                  </div>

                  <button type="button" onClick={() => window.toast.success('Etkinlik anketi başarıyla oluşturuldu!')} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 shadow-md transition-all">
                    Anketi Kaydet ve Aktifleştir
                  </button>
                </form>
              </div>

              <div className="bg-slate-50/50 rounded-2xl p-6 border border-dashed border-gray-200 relative">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-6">
                  <Eye size={14} className="text-red-500" /> Öğrenci Ekranı Ön İzlemesi
                </label>
                
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden pointer-events-none">
                  <div className="bg-red-600 p-4 text-white">
                    <h4 className="font-black text-lg">{surveyForm.title || 'Anket Başlığı'}</h4>
                    <p className="text-red-100 text-xs">Lütfen aşağıdaki ifadelere ne derece katıldığınızı belirtiniz.</p>
                  </div>
                  
                  <div className="p-5 space-y-6">
                    {surveyForm.questions.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4 font-bold">Henüz soru eklenmedi.</p>
                    ) : surveyForm.questions.map((q, i) => (
                      <div key={i} className="space-y-3">
                        <p className="text-sm font-bold text-gray-800">{i+1}. {q || 'Soru metni...'}</p>
                        <div className="flex justify-between items-center gap-1 text-[10px] font-bold text-gray-500 text-center">
                          <span>Kesinlikle Katılmıyorum</span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <div key={rating} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">{rating}</div>
                            ))}
                          </div>
                          <span>Kesinlikle Katılıyorum</span>
                        </div>
                      </div>
                    ))}
                    
                    {surveyForm.kvkkConfirmed && (
                      <div className="mt-6 pt-6 border-t border-gray-100 flex items-start gap-3">
                        <div className="w-4 h-4 rounded border border-gray-300 shrink-0 mt-0.5"></div>
                        <p className="text-[10px] text-gray-500 font-medium">Bu ankete verdiğim yanıtların istatistiksel analiz amacıyla KVKK kapsamında işlenmesini onaylıyorum.</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="w-full bg-gray-100 text-gray-500 py-2.5 rounded-xl font-bold text-sm text-center">Gönder</div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* OLUŞTURULAN ANKETLER VE SONUÇ ANALİZİ (YÖK İÇİN) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Oluşturulan Anketler ve Sonuç Analizi</h3>
                <p className="text-xs font-bold text-gray-500">YÖK kalite süreçleri için etkinlik katılımcı geri bildirim istatistikleri.</p>
              </div>
              <button className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition" onClick={() => {
                const headers = [...surveyForm.questions.map((q, i) => `S${i+1}: ${q}`)];
                if (surveyForm.kvkkConfirmed) headers.push('KVKK Onaylı');
                const csvData = headers.map(h => `"${h}"`).join(',');
                const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `Etkinlik_Anket_Raporu_${Date.now()}.csv`;
                link.click();
              }}>
                <Download size={16} /> Excel Olarak İndir
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-100">Etkinlik Başlığı</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Katılımcı Sayısı</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Ort. Memnuniyet</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-500 uppercase tracking-wider text-right border-b border-gray-100">Rapor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr 
                    className="hover:bg-red-50/50 transition cursor-pointer group"
                    onClick={() => setExpandedSurvey(!expandedSurvey)}
                  >
                    <td className="py-5 px-6 font-bold text-gray-900 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-600 transition-transform duration-300" style={{ transform: expandedSurvey ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                          ▶
                        </span>
                        <p>{surveyForm.title || 'Yeni Etkinlik Anketi'}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold ml-5">Taslak</span>
                    </td>
                    <td className="py-4 px-6 text-center font-black text-gray-700">0 Kişi</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-gray-100 text-gray-500 font-black px-3 py-1 rounded-lg">- / 5</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); 
                          const headers = [...surveyForm.questions.map((q, i) => `S${i+1}: ${q}`)];
                          if (surveyForm.kvkkConfirmed) headers.push('KVKK Onaylı');
                          const csvData = headers.map(h => `"${h}"`).join(',');
                          const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = `Etkinlik_Anket_Raporu_${Date.now()}.csv`;
                          link.click();
                        }}
                        className="p-2 bg-gray-50 text-red-600 hover:bg-red-100 rounded-xl transition font-bold text-xs flex items-center justify-center gap-1 w-full"
                      >
                        <Download size={14}/> İndir
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Sorular */}
                  {expandedSurvey && (
                    <tr className="bg-slate-50/50 border-none">
                      <td colSpan="4" className="p-0">
                        <div className="px-12 py-6 border-l-2 border-red-500 ml-4 mb-4 mt-2 bg-white rounded-r-xl shadow-sm">
                          <h4 className="text-xs font-black tracking-wider text-gray-500 mb-4 uppercase flex items-center gap-2">
                            <FileText size={14} className="text-red-500" />
                            Anket Soruları (SPSS Referansı)
                          </h4>
                          {surveyForm.questions.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Henüz soru eklenmedi.</p>
                          ) : (
                            <ul className="space-y-3">
                              {surveyForm.questions.map((q, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                  <span className="font-black text-red-600 w-6">S{idx+1}.</span>
                                  <span className="text-gray-700 font-medium">{q}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminCMSLayout>
  );
}
