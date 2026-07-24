import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import MediaUploader from './MediaUploader';
import AttachmentUploader from './AttachmentUploader';
import { GraduationCap, Edit, Trash2, Plus, Search, Filter, UserCircle2, Mail, Briefcase, FileText, CheckCircle2, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';export default function CMSStudents({ students = [], setStudents }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    name: '',
    studentId: '',
    department: '',
    year: '',
    email: '',
    status: 'Aktif',
    internshipStatus: 'Arıyor',
    avatar: '',
    cvData: null,
    cvName: '',
    skills: ''
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      studentId: '',
      department: '',
      year: '',
      email: '',
      status: 'Aktif',
      internshipStatus: 'Arıyor',
      avatar: '',
      cvData: null,
      cvName: '',
      skills: ''
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (std) => {
    setForm({ 
      ...std, 
      skills: std.skills || '', 
      internshipStatus: std.internshipStatus || 'Arıyor' 
    });
    setCurrentId(std.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu öğrenciyi silmek/arşivlemek istediğinize emin misiniz?")) {
      setStudents(prev => (prev || []).filter(s => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.studentId) return window.toast.info("Ad Soyad ve Öğrenci No zorunludur.");

    if (currentId) {
      setStudents(prev => (prev || []).map(s => s.id === currentId ? { ...s, ...form, updatedAt: new Date().toISOString() } : s));
    } else {
      setStudents(prev => [{ ...form, id: 'STD-' + Date.now(), createdAt: new Date().toISOString() }, ...(prev || [])]);
    }
    setIsEditing(false);
  };

  const safeStudents = students || [];

  const filtered = safeStudents.filter(s => {
    const matchQ = (s.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (s.studentId||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (s.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = safeStudents.filter(s => s.status === 'Aktif').length;
  const internshipSeekers = safeStudents.filter(s => s.internshipStatus === 'Arıyor').length;

  const listView = (
    <div className="space-y-6">
      {/* HEADER & STATS */}
      <PanelHeader 
        title="Aktif Öğrenciler" 
        sub="Sisteme kayıtlı aktif öğrencileri yönetin ve staj durumlarını takip edin." 
        action={
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                const headers = ['Öğrenci ID', 'Ad Soyad', 'Bölüm', 'Sınıf', 'Staj Durumu'];
                const csvContent = [
                  headers.join(';'),
                  ...filtered.map(s => [
                    s.studentId, 
                    (s.name || '').replace(/;/g, ','), 
                    s.department, 
                    s.year, 
                    s.internshipStatus
                  ].join(';'))
                ].join('\n');
            
                const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Ogrenciler.csv';
                link.click();
              }}
              className="flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 border border-emerald-500/30"
            >
              <Download size={18} /> Excel'e Aktar
            </button>
            <button onClick={handleAddNew} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all backdrop-blur-md">
              <Plus size={18} /> Öğrenci Ekle
            </button>
          </div>
        } 
      />

      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><GraduationCap size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Öğrenci</p><p className="text-2xl font-black text-gray-900">{safeStudents.length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Aktif Kullanıcı</p><p className="text-2xl font-black text-gray-900">{activeCount}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Briefcase size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Staj Arayan</p><p className="text-2xl font-black text-gray-900">{internshipSeekers}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Ad Soyad veya Öğrenci No ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="aktif">Aktif</option>
            <option value="pasif">Pasif / Mezun</option>
          </select>
          <button aria-label="İşlem Butonu" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
          <button onClick={() => exportToCSV(filtered, 'ogrenciler.csv')} className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-sm font-bold">
            <Download size={18} /> Excel'e Aktar
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><GraduationCap size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun öğrenci bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Öğrenci</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Bölüm & Sınıf</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">İletişim</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum & Staj</th>
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
                        <p className="text-sm font-bold text-gray-900">{s.name}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">{s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700">{s.department || 'Belirtilmedi'}</p>
                    <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase">{s.year ? `${s.year}. Sınıf` : '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                      <Mail size={12} className="text-gray-500"/> {s.email || '-'}
                    </p>
                  </td>
                  <td className="py-3 px-5">
                    <div className="flex flex-col gap-1.5 items-start">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider
                        ${s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.status}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider bg-blue-50 text-blue-600 flex items-center gap-1">
                        <Briefcase size={10}/> {s.internshipStatus}
                      </span>
                    </div>
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
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Öğrenci Profili Düzenle' : 'Yeni Öğrenci Ekle'}</h3>
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
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Öğrenci Numarası <span className="text-red-500">*</span></label>
                <input type="text" value={form.studentId} onChange={e=>setForm({...form, studentId: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta</label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölüm / Fakülte</label>
                <input type="text" value={form.department} onChange={e=>setForm({...form, department: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Sınıf</label>
                <select value={form.year} onChange={e=>setForm({...form, year: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option value="">Seçiniz</option>
                  <option value="Hazırlık">Hazırlık</option>
                  <option value="1">1. Sınıf</option>
                  <option value="2">2. Sınıf</option>
                  <option value="3">3. Sınıf</option>
                  <option value="4">4. Sınıf</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Sistem Durumu</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option>Aktif</option>
                  <option>Pasif</option>
                  <option>Mezun</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Staj Durumu</label>
                <select value={form.internshipStatus} onChange={e=>setForm({...form, internshipStatus: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option>Arıyor</option>
                  <option>Stajda</option>
                  <option>Tamamladı</option>
                  <option>İlgilenmiyor</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Yetenekler & İlgi Alanları (Virgülle ayırın)</label>
          <input type="text" value={form.skills} onChange={e=>setForm({...form, skills: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Örn: React, Node.js, Dijital Pazarlama, AutoCAD" />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <AttachmentUploader 
            label="Öğrenci CV Dosyası (PDF)" 
            file={form.cvData} 
            onFileChange={(val) => setForm({...form, cvData: val})} 
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Kaydet</button>
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
