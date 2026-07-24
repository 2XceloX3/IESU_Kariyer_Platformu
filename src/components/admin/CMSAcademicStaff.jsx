import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import MediaUploader from './MediaUploader';
import { UserCircle2, Edit, Trash2, Plus, Search, Filter, Star, BookOpen, MapPin, CheckCircle2, Award } from 'lucide-react';

export default function CMSAcademicStaff({ academicStaff = [], setAcademicStaff }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    name: '',
    title: '',
    faculty: '',
    department: '',
    email: '',
    expertise: '',
    status: 'Aktif',
    isMentor: false,
    avatar: ''
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      title: '',
      faculty: '',
      department: '',
      email: '',
      expertise: '',
      status: 'Aktif',
      isMentor: false,
      avatar: ''
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (st) => {
    setForm({ ...st });
    setCurrentId(st.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu akademik personeli silmek istediğinize emin misiniz?")) {
      setAcademicStaff((academicStaff || []).filter(a => a.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.department) return window.toast.info("Ad Soyad ve Bölüm zorunludur.");

    if (currentId) {
      setAcademicStaff((academicStaff || []).map(a => a.id === currentId ? { ...a, ...form, updatedAt: new Date().toISOString() } : a));
    } else {
      setAcademicStaff([{ ...form, id: 'ACA-' + Date.now(), createdAt: new Date().toISOString() }, ...academicStaff]);
    }
    setIsEditing(false);
  };

  const safeStaff = academicStaff || [];

  const filtered = safeStaff.filter(s => {
    const matchQ = (s.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (s.faculty||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (s.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = safeStaff.filter(s => s.status === 'Aktif').length;
  const mentorCount = safeStaff.filter(s => s.isMentor).length;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <PanelHeader 
        title="Akademik Kadro Yönetimi" 
        sub="Sisteme kayıtlı akademisyenleri ve mentorluk durumlarını yönetin." 
        action={
          <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={18} /> Akademisyen Ekle
          </button>
        } 
      />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><BookOpen size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Personel</p><p className="text-2xl font-black text-gray-900">{safeStaff.length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Aktif Görevde</p><p className="text-2xl font-black text-gray-900">{activeCount}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Award size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Akademik Mentor</p><p className="text-2xl font-black text-gray-900">{mentorCount}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Ad Soyad veya Fakülte ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif</option>
          </select>
          <button aria-label="İşlem Butonu" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><UserCircle2 size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun akademik personel bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Akademisyen</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fakülte & Bölüm</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Uzmanlık</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {s.avatar ? <img src={s.avatar} className="w-full h-full object-cover" /> : <UserCircle2 size={20} className="text-gray-500"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          {s.title} {s.name}
                          {s.isMentor && <Star size={12} className="text-yellow-500 fill-current" />}
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">{s.email || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700">{s.faculty || 'Belirtilmedi'}</p>
                    <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">{s.department || '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs text-gray-600 font-medium truncate max-w-[150px]">{s.expertise || '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(s)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
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
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Akademisyen Profili Düzenle' : 'Yeni Akademisyen Ekle'}</h3>
        <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">Listeye Dön</button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="w-full sm:w-1/3 shrink-0">
            <MediaUploader 
              label="Profil Fotoğrafı" 
              image={form.avatar} 
              onImageChange={(val) => setForm({...form, avatar: val})} 
              aspect="1:1" 
            />
          </div>
          
          <div className="w-full sm:w-2/3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Unvan</label>
                <input type="text" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Prof. Dr." />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Fakülte</label>
                <input type="text" value={form.faculty} onChange={e=>setForm({...form, faculty: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölüm <span className="text-red-500">*</span></label>
                <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option>Aktif</option>
                  <option>Pasif</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Uzmanlık Alanları (Virgülle ayırın)</label>
          <input type="text" value={form.expertise} onChange={e=>setForm({...form, expertise: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: Yapay Zekâ, Veri Bilimi" />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isMentor} onChange={e=>setForm({...form, isMentor: e.target.checked})} className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20" />
            <span className="text-sm font-bold text-gray-700">Kariyer Merkezi Akademik Mentor Havuzunda</span>
          </label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Kaydet</button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {isEditing ? formView : listView}
    </div>
  );
}
