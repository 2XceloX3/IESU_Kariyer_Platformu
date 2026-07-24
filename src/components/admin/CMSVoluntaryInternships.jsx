import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { Users, Edit, Trash2, Plus, Calendar, Search, Filter, Briefcase, MapPin, CheckCircle2, Building2 } from 'lucide-react';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';

export default function CMSVoluntaryInternships({ volunteerInterns = [], setVolunteerInterns }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    company: '',
    department: '',
    internshipType: 'Zorunlu Olmayan (Gönüllü)',
    location: '',
    workModel: 'Hibrit',
    startDate: '',
    endDate: '',
    deadline: '',
    quota: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    applicationInstructions: '',
    status: 'Taslak',
    featured: false,
    image: '',
    pdf: null
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      company: '',
      department: '',
      internshipType: 'Zorunlu Olmayan (Gönüllü)',
      location: '',
      workModel: 'Hibrit',
      startDate: '',
      endDate: '',
      deadline: '',
      quota: '',
      requirements: '',
      responsibilities: '',
      benefits: '',
      applicationInstructions: '',
      status: 'Taslak',
      featured: false,
      image: '',
      pdf: null
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (internship) => {
    setForm({ 
      ...internship, 
      internshipType: internship.internshipType || 'Zorunlu Olmayan (Gönüllü)',
      workModel: internship.workModel || 'Hibrit',
      location: internship.location || '',
      requirements: internship.requirements || '',
      responsibilities: internship.responsibilities || '',
      benefits: internship.benefits || '',
      image: internship.image || '',
      pdf: internship.pdf || null
    });
    setCurrentId(internship.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu staj ilanını silmek istediğinize emin misiniz?")) {
      setVolunteerInterns((volunteerInterns || []).filter(v => v.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title || !form.company) return window.toast.info("Staj başlığı ve firma adı zorunludur.");

    if (currentId) {
      setVolunteerInterns((volunteerInterns || []).map(v => v.id === currentId ? { ...v, ...form, updatedAt: new Date().toISOString() } : v));
    } else {
      setVolunteerInterns([{ ...form, id: 'VI-' + Date.now(), createdAt: new Date().toISOString() }, ...volunteerInterns]);
    }
    setIsEditing(false);
  };

  const filtered = (volunteerInterns || []).filter(v => {
    const matchQ = (v.title||'').toLowerCase().includes(searchQuery.toLowerCase()) || (v.company||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (v.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (volunteerInterns || []).filter(v => v.status === 'Yayında').length;
  const draftCount = (volunteerInterns || []).filter(v => v.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <PanelHeader 
        title="Gönüllü Staj İlanları" 
        sub="Öğrencilere yönelik gönüllü staj programlarını yönetin." 
        action={
          <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={18} /> Yeni Staj Ekle
          </button>
        } 
      />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam İlan</p><p className="text-2xl font-black text-gray-900">{(volunteerInterns || []).length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Yayında</p><p className="text-2xl font-black text-gray-900">{activeCount}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Edit size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Taslak Bekleyen</p><p className="text-2xl font-black text-gray-900">{draftCount}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Staj başlığı veya firma ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="yayında">Yayında</option>
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
            <p className="text-sm text-gray-500">Arama kriterlerine uygun gönüllü staj ilanı bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">İlan Başlığı / Firma</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tarih / Son Başvuru</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Konum / Model</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                        {v.image ? <img src={v.image} className="w-full h-full object-cover" /> : <Building2 size={18} className="text-gray-500"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{v.title}</p>
                        <p className="text-[11px] font-bold text-gray-500 mt-0.5">{v.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                      <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-500"/> Başvuru: {v.deadline || '-'}</span>
                      <span className="text-gray-500 text-[10px] uppercase">Staj: {v.startDate || '?'} - {v.endDate || '?'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><MapPin size={12}/> {v.location || 'Belirtilmedi'}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{v.workModel}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${(v.status === 'Yayında') ? 'bg-emerald-100 text-emerald-700' : 
                        v.status === 'Taslak' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(v)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
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

  const formView = (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT: FORM */}
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'İlanı Düzenle' : 'Yeni Staj İlanı'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">İlan Başlığı <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Pazarlama Stajyeri" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Firma / Kurum Adı <span className="text-red-500">*</span></label>
              <input type="text" value={form.company} onChange={e=>setForm({...form, company: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Firma Adı" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalışma Modeli</label>
              <select value={form.workModel} onChange={e=>setForm({...form, workModel: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yerinde</option>
                <option>Hibrit</option>
                <option>Uzaktan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Şehir / Konum</label>
              <input type="text" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: İstanbul" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">İlgili Bölüm</label>
              <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: İşletme" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Başlangıç</label>
              <input type="date" value={form.startDate} onChange={e=>setForm({...form, startDate: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Bitiş</label>
              <input type="date" value={form.endDate} onChange={e=>setForm({...form, endDate: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Son Başvuru</label>
              <input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yayında</option>
                <option>Taslak</option>
                <option>Kapalı</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Aranan Nitelikler (Requirements)</label>
              <textarea value={form.requirements} onChange={e=>setForm({...form, requirements: e.target.value})} rows={3} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Örn: 3. veya 4. sınıf öğrencisi olmak..."></textarea>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Sorumluluklar (Responsibilities)</label>
              <textarea value={form.responsibilities} onChange={e=>setForm({...form, responsibilities: e.target.value})} rows={3} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Stajyerin yapacağı işler..."></textarea>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Faydalar ve Kazanımlar (Benefits)</label>
            <input type="text" value={form.benefits} onChange={e=>setForm({...form, benefits: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Yol ve yemek desteği..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Firma Logosu / Görsel" 
              image={form.image} 
              onImageChange={(val) => setForm({...form, image: val})} 
              aspect="1:1" 
            />
            <AttachmentUploader 
              label="Ek Dosya (PDF / Ek Bilgi)" 
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

      {/* RIGHT: LIVE PREVIEW */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="sticky top-6">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Canlı Önizleme</h4>
          
          {/* Card Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Header Area */}
            <div className="p-5 border-b border-gray-50 flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                {form.image ? (
                  <img src={form.image} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                {form.featured && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider mb-1 inline-block">ÖNE ÇIKAN</span>}
                <h3 className="text-[15px] font-black text-gray-900 leading-tight mb-0.5">
                  {form.title || 'İlan Başlığı'}
                </h3>
                <p className="text-[12px] font-bold text-gray-500">{form.company || 'Firma Adı'}</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 bg-gray-50/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Konum</p>
                  <p className="text-[12px] font-bold text-gray-800 flex items-center gap-1"><MapPin size={12} className="text-gray-500"/> {form.location || 'Belirtilmedi'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Çalışma Modeli</p>
                  <p className="text-[12px] font-bold text-gray-800 flex items-center gap-1"><Briefcase size={12} className="text-gray-500"/> {form.workModel || 'Belirtilmedi'}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Aranan Nitelikler Özeti</p>
                <p className="text-[12px] font-medium text-gray-600 line-clamp-2">
                  {form.requirements || 'İlan nitelikleri bu alanda görüntülenecektir.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar size={13} />
                  <span className="text-[11px] font-bold">Son Başvuru: {form.deadline ? form.deadline.split('-').reverse().join('.') : '-'}</span>
                </div>
                <button disabled className="text-[11px] font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed">
                  Hemen Başvur
                </button>
              </div>
            </div>
          </div>
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
