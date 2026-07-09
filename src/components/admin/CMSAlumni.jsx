import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { GraduationCap, Edit, Trash2, Plus, Search, Filter, UserCircle2, Mail, Briefcase, FileText, Star, CheckCircle2 } from 'lucide-react';

export default function CMSAlumni({ alumni = [], setAlumni }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    name: '',
    department: '',
    graduationYear: '',
    currentCompany: '',
    currentPosition: '',
    email: '',
    status: 'Mezun',
    isMentor: false,
    avatar: '',
    cvData: null,
    cvName: '',
    skills: ''
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      department: '',
      graduationYear: '',
      currentCompany: '',
      currentPosition: '',
      email: '',
      status: 'Mezun',
      isMentor: false,
      avatar: '',
      cvData: null,
      cvName: '',
      skills: ''
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (al) => {
    setForm({ ...al, skills: al.skills || '', isMentor: al.isMentor || false });
    setCurrentId(al.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu mezun kaydını silmek/arşivlemek istediğinize emin misiniz?")) {
      setAlumni(prev => (prev || []).filter(a => a.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.graduationYear) return alert("Ad Soyad ve Mezuniyet Yılı zorunludur.");

    if (currentId) {
      setAlumni(prev => (prev || []).map(a => a.id === currentId ? { ...a, ...form, updatedAt: new Date().toISOString() } : a));
    } else {
      setAlumni(prev => [{ ...form, id: 'ALM-' + Date.now(), createdAt: new Date().toISOString() }, ...(prev || [])]);
    }
    setIsEditing(false);
  };

  const safeAlumni = alumni || [];

  const filtered = safeAlumni.filter(a => {
    const matchQ = (a.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (a.currentCompany||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (a.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const mentorCount = safeAlumni.filter(a => a.isMentor).length;
  const employedCount = safeAlumni.filter(a => a.currentCompany).length;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <PanelHeader 
        title="Mezun Havuzu" 
        sub="Sisteme kayıtlı mezunları yönetin ve kariyer durumlarını takip edin." 
        action={
          <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
            <Plus size={18} /> Mezun Ekle
          </button>
        } 
      />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><GraduationCap size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Toplam Mezun</p><p className="text-2xl font-black text-gray-900">{safeAlumni.length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Briefcase size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Çalışan Mezun</p><p className="text-2xl font-black text-gray-900">{employedCount}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Star size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gönüllü Mentor</p><p className="text-2xl font-black text-gray-900">{mentorCount}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Ad Soyad veya Firma ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="mezun">Mezun</option>
            <option value="pasif">Pasif</option>
          </select>
          <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4"><GraduationCap size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun mezun bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mezun</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bölüm & Yıl</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kariyer Durumu</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sistem Durumu</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {a.avatar ? <img src={a.avatar} className="w-full h-full object-cover" /> : <UserCircle2 size={20} className="text-gray-400"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          {a.name}
                          {a.isMentor && <Star size={12} className="text-yellow-500 fill-current" />}
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">{a.email || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700">{a.department || 'Belirtilmedi'}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase">{a.graduationYear ? `${a.graduationYear} Mezunu` : '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    {a.currentCompany ? (
                      <div>
                        <p className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit uppercase">{a.currentCompany}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-1">{a.currentPosition}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Belirtilmedi</span>
                    )}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${a.status === 'Mezun' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(a)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
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
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Mezun Profili Düzenle' : 'Yeni Mezun Ekle'}</h3>
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
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezun Olduğu Bölüm</label>
                <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezuniyet Yılı <span className="text-red-500">*</span></label>
                <input type="number" value={form.graduationYear} onChange={e=>setForm({...form, graduationYear: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required placeholder="Örn: 2024" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalıştığı Firma</label>
                <input type="text" value={form.currentCompany} onChange={e=>setForm({...form, currentCompany: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Pozisyon / Unvan</label>
                <input type="text" value={form.currentPosition} onChange={e=>setForm({...form, currentPosition: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-gray-100">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Yetenekler & Uzmanlıklar</label>
            <input type="text" value={form.skills} onChange={e=>setForm({...form, skills: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Virgülle ayırın" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">Durum</label>
            <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
              <option>Mezun</option>
              <option>Pasif</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <AttachmentUploader 
            label="CV / Özgeçmiş (PDF)" 
            file={form.cvData} 
            onFileChange={(val) => setForm({...form, cvData: val})} 
          />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isMentor} onChange={e=>setForm({...form, isMentor: e.target.checked})} className="w-4 h-4 rounded text-red-600 focus:ring-red-500/20" />
            <span className="text-sm font-bold text-gray-700">Öğrencilere Gönüllü Mentorluk Yapıyor</span>
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
