import React, { useState } from 'react';
import AdminCMSLayout from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { Briefcase, CheckCircle2, Edit, Trash2, Plus, Search, Filter, Image as ImageIcon, MapPin, Calendar, Building2, Download, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { exportToCSV } from '../../utils/export';

export default function CMSJobs({ jobs = [], setJobs, applications = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedJobId, setExpandedJobId] = useState(null);

  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'TAM ZAMANLI', // 'TAM ZAMANLI', 'YARI ZAMANLI', 'STAJ', 'UZAKTAN'
    date: '',
    deadline: '',
    description: '',
    logo: '',
    pdf: null,
    applicationLink: '',
    status: 'Aktif',
    featured: false
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      company: '',
      location: '',
      type: 'TAM ZAMANLI',
      date: '',
      deadline: '',
      description: '',
      logo: '',
      pdf: null,
      applicationLink: '',
      status: 'Aktif',
      featured: false
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (job) => {
    setForm({ 
      ...job,
      deadline: job.deadline || '',
      pdf: job.pdf || null,
      featured: job.featured || false
    });
    setCurrentId(job.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
      setJobs((jobs || []).filter(j => j.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.company) return window.toast.info("Başlık ve şirket zorunludur.");

    if (currentId) {
      setJobs((jobs || []).map(job => job.id === currentId ? { ...job, ...form, updatedAt: new Date().toISOString() } : job));
    } else {
      setJobs([{ ...form, id: 'JOB-' + Date.now(), applicants: 0, createdAt: new Date().toISOString() }, ...jobs]);
    }
    setIsEditing(false);
  };

  const handleDownloadExcel = (job, apps) => {
    exportToCSV(apps, `${job.title}_basvurulari`);
    window.toast.success(`${job.title} ilanı için ${apps.length} başvuru verisi Excel olarak indirildi.`);
  };

  const filtered = (jobs || []).filter(j => {
    const matchQ = (j.title||'').toLowerCase().includes(searchQuery.toLowerCase()) || (j.company||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (j.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (jobs || []).filter(j => j.status === 'Aktif' || !j.status).length;
  const pendingCount = (jobs || []).filter(j => j.status === 'Beklemede').length;
  const draftCount = (jobs || []).filter(j => j.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">İş İlanları ve Onay Havuzu</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Sistemdeki aktif iş fırsatlarını ve firma onay havuzunu yönetin.</p>
          </div>
          <button onClick={handleAddNew} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md">
            <Plus size={18} /> Yeni İlan Ekle
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam İlan</p><p className="text-2xl font-black text-gray-900">{(jobs || []).length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Aktif İlanlar</p><p className="text-2xl font-black text-gray-900">{activeCount}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Edit size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Onay Bekleyen (Havuz)</p><p className="text-2xl font-black text-gray-900">{pendingCount}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="İlan başlığı veya firma ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
            <option value="beklemede">Beklemede (Onay Havuzu)</option>
            <option value="taslak">Taslak</option>
            <option value="kapalı">Kapalı</option>
          </select>
          <button aria-label="İşlem Butonu" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><Briefcase size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun iş ilanı bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">İlan / Firma</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Çalışma Türü</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Konum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(j => {
                const jobApplications = applications.filter(app => app.jobId === j.id);
                const isExpanded = expandedJobId === j.id;

                return (
                  <React.Fragment key={j.id}>
                    <tr className="hover:bg-gray-50/50 transition group cursor-pointer" onClick={() => setExpandedJobId(isExpanded ? null : j.id)}>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                            {j.logo ? <img src={j.logo} className="w-full h-full object-cover" /> : <Building2 size={18} className="text-gray-500"/>}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{j.title}</p>
                            <p className="text-[11px] font-bold text-red-600 mt-0.5 truncate max-w-[200px]">{j.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                          {j.type}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><MapPin size={12}/> {j.location || 'Belirtilmedi'}</p>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${(j.status === 'Aktif' || !j.status) ? 'bg-emerald-100 text-emerald-700' : j.status === 'Beklemede' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-gray-100 text-gray-700'}`}>
                            {j.status || 'Aktif'}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            <Users size={12} /> {jobApplications.length}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={(e) => { e.stopPropagation(); setExpandedJobId(isExpanded ? null : j.id); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Başvuruları Gör">
                            {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleEdit(j); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition tooltip" title="Düzenle"><Edit size={16}/></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(j.id); }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition tooltip" title="Sil"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* APPLICANT LIST EXPANDED ROW */}
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={5} className="p-0 border-b border-gray-100">
                          <div className="p-6 bg-slate-50 border-t-2 border-blue-500/20 shadow-inner">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-gray-900 flex items-center gap-2"><Users size={18} className="text-blue-600" /> Bu İlana Başvuranlar ({jobApplications.length})</h4>
                              {jobApplications.length > 0 && (
                                <button onClick={() => handleDownloadExcel(j, jobApplications)} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold text-xs transition border border-emerald-200 shadow-sm">
                                  <Download size={14} /> Excel İndir (KVKK)
                                </button>
                              )}
                            </div>
                            
                            {jobApplications.length === 0 ? (
                              <div className="text-center py-8 text-gray-500 text-sm font-medium">Henüz bu ilana başvuru yapılmamış.</div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                  <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-wider">
                                    <tr>
                                      <th className="px-4 py-3">Aday Adı</th>
                                      <th className="px-4 py-3">Öğrenci No / ID</th>
                                      <th className="px-4 py-3">Başvuru Tarihi</th>
                                      <th className="px-4 py-3">Durum</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {jobApplications.map(app => (
                                      <tr key={app.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 font-bold text-gray-900">{app.applicantName}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs font-mono">{app.applicantId}</td>
                                        <td className="px-4 py-3 text-gray-500">{app.date}</td>
                                        <td className="px-4 py-3">
                                          <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded uppercase">{app.status}</span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const actualFormView = (
    <div className="flex-1">
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'İlanı Düzenle' : 'Yeni İlan'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Pozisyon / Başlık <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Frontend Developer" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Firma Adı <span className="text-red-500">*</span></label>
              <input type="text" value={form.company} onChange={e=>setForm({...form, company: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Firma Adı" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalışma Türü</label>
              <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>TAM ZAMANLI</option>
                <option>YARI ZAMANLI</option>
                <option>UZAKTAN</option>
                <option>STAJ</option>
                <option>SERBEST</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Konum</label>
              <input type="text" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: İstanbul" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option value="Aktif">Aktif</option>
                <option value="Beklemede">Beklemede (Onay Bekliyor)</option>
                <option value="Taslak">Taslak</option>
                <option value="Kapalı">Kapalı</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Yayın Tarihi</label>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Son Başvuru Tarihi</label>
              <input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Harici Başvuru Linki (Varsa)</label>
            <input type="url" value={form.applicationLink} onChange={e=>setForm({...form, applicationLink: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="https://" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">İlan Açıklaması ve Nitelikler</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={5} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="İş tanımı, aranan özellikler, sosyal haklar..."></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Firma Logosu (İsteğe Bağlı)" 
              image={form.logo} 
              onImageChange={(val) => setForm({...form, logo: val})} 
              aspect="1:1" 
            />
            <AttachmentUploader 
              label="Ek Dosya (İlan PDF vs.)" 
              file={form.pdf} 
              onFileChange={(val) => setForm({...form, pdf: val})} 
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e=>setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20" />
              <span className="text-sm font-bold text-gray-700">Öne Çıkarılan İlan</span>
            </label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
              <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">İlanı Kaydet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const previewView = (
    <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
          {form.logo ? (
            <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Building2 size={20} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1">
          {form.featured && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 inline-block">ÖNE ÇIKAN</span>}
          <h3 className="text-[15px] font-black text-gray-900 leading-tight mb-0.5">
            {form.title || 'Pozisyon / İlan Başlığı'}
          </h3>
          <p className="text-[12px] font-bold text-red-600">{form.company || 'Firma Adı'}</p>
        </div>
      </div>

      <div className="p-5 bg-gray-50/50">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <MapPin size={10}/> {form.location || 'Konum'}
          </span>
          <span className="bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <Briefcase size={10}/> {form.type || 'Tür'}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">İlan Açıklaması</p>
          <p className="text-[12px] font-medium text-gray-600 line-clamp-3">
            {form.description || 'İş tanımı ve aranan özellikler burada görünecektir.'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar size={13} />
            <span className="text-[11px] font-bold">Yayın: {form.date ? form.date.split('-').reverse().join('.') : '-'}</span>
          </div>
          <button disabled className="text-[11px] font-bold bg-emerald-600/50 text-white px-4 py-2 rounded-lg cursor-not-allowed">
              Önizleme Modu (Kapalı)
          </button>
        </div>
      </div>
    </div>
  );

  const feedPreviewView = form.title ? (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center overflow-hidden">
            {form.logo ? (
              <img src={form.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 size={16} className="text-red-600" />
            )}
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900 flex items-center gap-1">Kariyer Geliştirme Merkezi <CheckCircle2 size={12} className="text-emerald-500" /></p>
            <p className="text-[10px] text-gray-500">Az önce • İlan Paylaşımı</p>
          </div>
        </div>
        <p className="text-[12px] font-bold text-gray-800 mb-1">{form.title}</p>
        <p className="text-[11px] text-gray-500 line-clamp-2">{form.description || ''}</p>
        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
          <span>📍 {form.location || '...'}</span>
          <span>💼 {form.type || '...'}</span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <AdminCMSLayout
      title="İlan ve Stajlar"
      sub="Sistemdeki iş, staj ve yarı zamanlı ilanları yönetin"
      isEditing={isEditing}
      listView={listView}
      formView={actualFormView}
      previewView={previewView}
      feedPreviewView={feedPreviewView}
    />
  );
}
