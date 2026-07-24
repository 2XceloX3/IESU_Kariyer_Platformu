import React, { useState } from 'react';
import AdminCMSLayout from './AdminCMSLayout';
import { Users, Edit, Trash2, Plus, Calendar, Search, Filter, BookOpen, Clock, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';

export default function CMSMentorship({ mentorships = [], setMentorships }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    programTitle: '',
    mentorName: '',
    mentorType: 'Akademik Personel',
    department: '',
    targetAudience: '',
    deadline: '',
    quota: '',
    location: '',
    shortDescription: '',
    description: '',
    status: 'Taslak',
    image: '',
    pdf: null
  });

  const handleAddNew = () => {
    setForm({
      programTitle: '',
      mentorName: '',
      mentorType: 'Akademik Personel',
      department: '',
      targetAudience: '',
      deadline: '',
      quota: '',
      location: '',
      shortDescription: '',
      description: '',
      status: 'Taslak',
      image: '',
      pdf: null
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (mnt) => {
    setForm({ 
      ...mnt, 
      mentorType: mnt.mentorType || 'Akademik Personel',
      targetAudience: mnt.targetAudience || '',
      quota: mnt.quota || '',
      location: mnt.location || '',
      shortDescription: mnt.shortDescription || mnt.description?.substring(0, 50) || '',
      image: mnt.image || '',
      pdf: mnt.pdf || null
    });
    setCurrentId(mnt.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu mentorluk programını silmek istediğinize emin misiniz?")) {
      setMentorships((mentorships || []).filter(m => m.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.programTitle || !form.mentorName) return window.toast.info("Program adı ve mentor adı zorunludur.");

    if (currentId) {
      setMentorships((mentorships || []).map(m => m.id === currentId ? { ...m, ...form, updatedAt: new Date().toISOString() } : m));
    } else {
      setMentorships([{ ...form, id: 'MNT-' + Date.now(), createdAt: new Date().toISOString() }, ...mentorships]);
    }
    setIsEditing(false);
  };

  const filtered = (mentorships || []).filter(m => {
    const matchQ = m.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) || m.mentorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || m.status.toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = (mentorships || []).filter(m => m.status === 'Aktif' || m.status === 'Yayında').length;
  const draftCount = (mentorships || []).filter(m => m.status === 'Taslak').length;

  const listView = (
    <div className="space-y-6">
      {/* STATS */}
      <div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Target size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Program</p><p className="text-2xl font-black text-gray-900">{(mentorships || []).length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Aktif / Yayında</p><p className="text-2xl font-black text-gray-900">{activeCount}</p></div>
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
            type="text" placeholder="Program veya mentor ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
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
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><Users size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun mentorluk programı bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Program</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mentor</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tarih/Kota</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(mnt => (
                <tr key={mnt.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {mnt.image ? <img src={mnt.image} className="w-full h-full rounded-lg object-cover" /> : <BookOpen size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{mnt.programTitle}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{mnt.department || 'Genel'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-sm font-bold text-gray-700">{mnt.mentorName}</p>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">{mnt.mentorType || 'Akademik Personel'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                      <span className="flex items-center gap-1.5"><Calendar size={13} className="text-gray-500"/> {mnt.deadline || '-'}</span>
                      <span className="flex items-center gap-1.5"><Users size={13} className="text-gray-500"/> Kota: {mnt.quota || 'Sınırsız'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${(mnt.status === 'Aktif' || mnt.status === 'Yayında') ? 'bg-emerald-100 text-emerald-700' : 
                        (mnt.status === 'Beklemede') ? 'bg-blue-100 text-blue-700' :
                        mnt.status === 'Taslak' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {mnt.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      {mnt.status === 'Beklemede' && (
                        <button onClick={() => setMentorships(mentorships.map(m => m.id === mnt.id ? {...m, status: 'Aktif'} : m))} className="p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition" title="Onayla"><CheckCircle2 size={16}/></button>
                      )}
                      <button onClick={() => handleEdit(mnt)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(mnt.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
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
          <h3 className="text-lg font-black text-gray-900">{currentId ? 'Programı Düzenle' : 'Yeni Mentorluk Programı'}</h3>
          <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">İptal</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Program Başlığı <span className="text-red-500">*</span></label>
              <input type="text" value={form.programTitle} onChange={e=>setForm({...form, programTitle: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Kariyer Liderleri" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Mentor Adı <span className="text-red-500">*</span></label>
              <input type="text" value={form.mentorName} onChange={e=>setForm({...form, mentorName: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Mentor Türü</label>
              <select value={form.mentorType} onChange={e=>setForm({...form, mentorType: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Akademik Personel</option>
                <option>Sektör Uzmanı (Firma)</option>
                <option>Mezun</option>
                <option>Kariyer Merkezi</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">İlgili Bölüm / Fakülte</label>
              <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Mühendislik Fakültesi" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Son Başvuru Tarihi</label>
              <input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Kota</label>
              <input type="number" value={form.quota} onChange={e=>setForm({...form, quota: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: 10" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
              <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                <option>Yayında</option>
                <option>Aktif</option>
                <option>Taslak</option>
                <option>Kapalı</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Kısa Açıklama (Özet)</label>
            <input type="text" value={form.shortDescription} onChange={e=>setForm({...form, shortDescription: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Önizleme kartında görünecek kısa metin" maxLength={100} />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Tam Açıklama</label>
            <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={5} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Programın detaylı açıklaması..."></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
            <MediaUploader 
              label="Program Afişi / Görsel" 
              image={form.image} 
              onImageChange={(val) => setForm({...form, image: val})} 
              aspect="16:9" 
            />
            <AttachmentUploader 
              label="Ek Dosya (PDF)" 
              file={form.pdf} 
              onFileChange={(val) => setForm({...form, pdf: val})} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Programı Kaydet</button>
          </div>
        </form>
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="sticky top-6">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Canlı Önizleme</h4>
          
          {/* Card Preview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            {/* Image Area */}
            <div className="h-40 bg-gray-100 relative group">
              {form.image ? (
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <ImagePlaceholder />
                  <span className="text-[10px] font-bold uppercase tracking-wider mt-2">Görsel Yok</span>
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm">
                <span className={`text-[10px] font-black uppercase tracking-wider ${(form.status === 'Aktif' || form.status === 'Yayında') ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {form.status}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">{form.mentorType || 'MENTOR'}</span>
                {form.department && <span className="text-[10px] font-bold text-gray-500 uppercase">{form.department}</span>}
              </div>
              
              <h3 className="text-[16px] font-black text-gray-900 leading-tight mb-2">
                {form.programTitle || 'Program Başlığı'}
              </h3>
              
              <p className="text-[13px] font-medium text-gray-500 mb-4 line-clamp-2">
                {form.shortDescription || form.description || 'Program hakkında kısa bir açıklama veya özet bilgisi burada yer alacaktır.'}
              </p>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <span className="text-sm font-black text-gray-500">{form.mentorName ? form.mentorName.charAt(0) : 'M'}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">MENTOR</p>
                  <p className="text-[13px] font-bold text-gray-900 leading-tight">{form.mentorName || 'Mentor Adı Soyadı'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar size={14} />
                  <span className="text-[11px] font-bold">Son: {form.deadline ? form.deadline.split('-').reverse().join('.') : 'Belirtilmedi'}</span>
                </div>
                <button disabled className="text-[12px] font-bold bg-gray-900 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed">
                  Başvur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminCMSLayout
      title={isEditing ? (currentId ? 'Programı Düzenle' : 'Yeni Program Ekle') : 'Mentorluk Programları'}
      sub={isEditing ? 'Mentorluk programı detaylarını buradan yönetebilirsiniz.' : 'Sistemdeki aktif ve taslak mentorluk programlarını yönetin.'}
      headerAction={
        !isEditing ? (
          <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={18} /> Yeni Program Ekle
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

function ImagePlaceholder() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}
