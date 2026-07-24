import React, { useState } from 'react';
import AdminCMSLayout from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { Star, Edit, Trash2, Plus, Search, Filter, Image as ImageIcon, ArrowRight, Building, CheckCircle2 } from 'lucide-react';

export default function CMSFeatured({ featuredOpportunities = [], setFeaturedOpportunities }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    title: '',
    organization: '',
    banner: '',
    pdf: null,
    description: '',
    ctaLink: '',
    status: 'Yayında'
  });

  const handleAddNew = () => {
    setForm({
      title: '',
      organization: '',
      banner: '',
      pdf: null,
      description: '',
      ctaLink: '',
      status: 'Yayında'
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (feat) => {
    setForm({ 
      ...feat,
      pdf: feat.pdf || null
    });
    setCurrentId(feat.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu öne çıkan fırsatı silmek istediğinize emin misiniz?")) {
      setFeaturedOpportunities((featuredOpportunities || []).filter(f => f.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title) return window.toast.info("Başlık zorunludur.");

    if (currentId) {
      setFeaturedOpportunities((featuredOpportunities || []).map(f => f.id === currentId ? { ...f, ...form, updatedAt: new Date().toISOString() } : f));
    } else {
      setFeaturedOpportunities([{ ...form, id: 'FEAT-' + Date.now(), createdAt: new Date().toISOString() }, ...featuredOpportunities]);
    }
    setIsEditing(false);
  };

  const filtered = (featuredOpportunities || []).filter(f => {
    const matchQ = (f.title||'').toLowerCase().includes(searchQuery.toLowerCase()) || (f.organization||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (f.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (featuredOpportunities || []).filter(f => f.status === 'Yayında').length;
  const draftCount = (featuredOpportunities || []).filter(f => f.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6">
      {/* STATS */}
      <div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Star size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Fırsat</p><p className="text-2xl font-black text-gray-900">{(featuredOpportunities || []).length}</p></div>
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
            type="text" placeholder="Fırsat veya kurum ara..." 
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

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><Star size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun öne çıkan fırsat bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fırsat Başlığı</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kurum / Organizasyon</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {f.banner ? <img src={f.banner} className="w-full h-full object-cover" /> : <Star size={18} className="text-gray-500"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 truncate max-w-[250px]">{f.title}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5 truncate max-w-[250px]">{f.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-1"><Building size={12}/> {f.organization || 'Belirtilmedi'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${(f.status === 'Yayında') ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(f)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(f.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
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
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'Fırsatı Düzenle' : 'Yeni Fırsat'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Fırsat Başlığı <span className="text-red-500">*</span></label>
              <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: %50 Kariyer Eğitimi İndirimi" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Kurum / Organizasyon Adı</label>
              <input type="text" value={form.organization} onChange={e=>setForm({...form, organization: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: X Eğitim Kurumu" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Aksiyon Linki (URL)</label>
              <input type="url" value={form.ctaLink} onChange={e=>setForm({...form, ctaLink: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="https://" />
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
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Detaylı Açıklama</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={5} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Fırsatın şartları ve detayları..."></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Kapak Görseli / Banner" 
              image={form.banner} 
              onImageChange={(val) => setForm({...form, banner: val})} 
              aspect="16:9" 
            />
            <AttachmentUploader 
              label="Ek Dosya / Bilgilendirme PDF" 
              file={form.pdf} 
              onFileChange={(val) => setForm({...form, pdf: val})} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Kaydet</button>
          </div>
        </form>
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="sticky top-6">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Canlı Önizleme</h4>
          
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="h-48 bg-white relative group border-b border-yellow-100">
              {form.banner ? (
                <img src={form.banner} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-yellow-300">
                  <Star size={40} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Görsel Yok</span>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-md shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Star size={10}/> ÖNE ÇIKAN FIRSAT
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-[18px] font-black text-gray-900 leading-tight mb-2">
                {form.title || 'Fırsat Başlığı'}
              </h3>
              
              <p className="text-[12px] font-bold text-red-600 mb-4 flex items-center gap-1">
                <Building size={12}/> {form.organization || 'Kurum Adı'}
              </p>

              <p className="text-[13px] font-medium text-gray-600 mb-6 line-clamp-3">
                {form.description || 'Fırsatın şartları, indirim oranları veya avantaj detayları burada yer alacaktır.'}
              </p>

              <button disabled className="w-full py-2.5 bg-yellow-500 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                Fırsatı Değerlendir <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminCMSLayout
      title={isEditing ? (currentId ? 'Fırsatı Düzenle' : 'Yeni Fırsat Ekle') : 'Öne Çıkan Fırsatlar'}
      sub={isEditing ? 'Fırsat detaylarını buradan yönetebilirsiniz.' : 'Öğrenci ve mezunların göreceği özel anlaşmaları, indirimleri ve dev fırsatları yönetin.'}
      headerAction={
        !isEditing ? (
          <button onClick={handleAddNew} className="bg-white text-orange-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={18} /> Yeni Fırsat Ekle
          </button>
        ) : null
      }
    >
      <div className="animate-fade-in">
        {isEditing ? formView : listView}
      </div>
    </AdminCMSLayout>
  );
}
