import React, { useState } from 'react';
import AdminCMSLayout from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import { Building2, Edit, Trash2, Plus, Search, Filter, Mail, Phone, MapPin, CheckCircle2, Clock, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
export default function CMSCompanies({ companies = [], setCompanies }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    name: '',
    sector: '',
    authorizedPerson: '',
    email: '',
    phone: '',
    location: '',
    status: 'Onaylı', // Onaylı, Beklemede, Reddedildi, Pasif
    logo: '',
    description: ''
  });

  const handleAddNew = () => {
    setForm({
      name: '',
      sector: '',
      authorizedPerson: '',
      email: '',
      phone: '',
      location: '',
      status: 'Onaylı',
      logo: '',
      description: ''
    });
    setCurrentId(null);
    setIsEditing(true);
  };

  const handleEdit = (comp) => {
    setForm({ ...comp });
    setCurrentId(comp.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bu firmayı silmek istediğinize emin misiniz? (Firmaya ait ilanlar da etkilenebilir)")) {
      setCompanies(prev => (prev || []).filter(c => c.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return window.toast.info("Firma Adı ve E-Posta zorunludur.");

    if (currentId) {
      setCompanies(prev => (prev || []).map(c => c.id === currentId ? { ...c, ...form, updatedAt: new Date().toISOString() } : c));
    } else {
      setCompanies(prev => [{ ...form, id: 'CMP-' + Date.now(), activeJobs: 0, createdAt: new Date().toISOString() }, ...(prev || [])]);
    }
    setIsEditing(false);
  };

  const safeCompanies = companies || [];

  const filtered = safeCompanies.filter(c => {
    const matchQ = (c.name||'').toLowerCase().includes(searchQuery.toLowerCase()) || (c.sector||'').toLowerCase().includes(searchQuery.toLowerCase());
    const matchS = statusFilter === 'all' || (c.status||'').toLowerCase() === statusFilter.toLowerCase();
    return matchQ && matchS;
  });

  const activeCount = safeCompanies.filter(c => c.status === 'Onaylı').length;
  const pendingCount = safeCompanies.filter(c => c.status === 'Beklemede').length;

  const listView = (
    <div className="space-y-6">
      {/* STATS */}
      <div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Building2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Toplam Firma</p><p className="text-2xl font-black text-gray-900">{safeCompanies.length}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Onaylı Firma</p><p className="text-2xl font-black text-gray-900">{activeCount}</p></div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center"><Clock size={24}/></div>
            <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Onay Bekleyen</p><p className="text-2xl font-black text-gray-900">{pendingCount}</p></div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" placeholder="Firma adı veya sektör ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-gray-50 border-none text-sm font-medium rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500/20 outline-none cursor-pointer">
            <option value="all">Tüm Durumlar</option>
            <option value="onaylı">Onaylı</option>
            <option value="beklemede">Beklemede</option>
            <option value="reddedildi">Reddedildi</option>
          </select>
          <button aria-label="İşlem Butonu" className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition"><Filter size={18}/></button>
          <button onClick={() => exportToCSV(filtered, 'firmalar.csv')} className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition text-sm font-bold">
            <Download size={18} /> Excel'e Aktar
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mb-4"><Building2 size={32}/></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Kayıt Bulunamadı</h3>
            <p className="text-sm text-gray-500">Arama kriterlerine uygun firma bulunmuyor.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Firma</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">İletişim</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">İlan Sayısı</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition group">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                        {c.logo ? <img src={c.logo} className="w-full h-full object-contain" /> : <Building2 size={24} className="text-gray-400"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{c.name}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">{c.sector || 'Sektör Belirtilmedi'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-bold text-gray-700">{c.authorizedPerson || 'Yetkili Belirtilmedi'}</p>
                    <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mt-1"><Mail size={10}/> {c.email || '-'}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                      {c.activeJobs || 0} Aktif İlan
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${c.status === 'Onaylı' ? 'bg-emerald-100 text-emerald-700' : 
                        c.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(c)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
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
        <h3 className="text-xl font-black text-gray-900">{currentId ? 'Firma Profilini Düzenle' : 'Yeni Firma Ekle'}</h3>
        <button type="button" onClick={() => setIsEditing(false)} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">Listeye Dön</button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          <div className="w-full sm:w-1/3 shrink-0">
            <MediaUploader 
              label="Firma Logosu" 
              image={form.logo} 
              onImageChange={(val) => setForm({...form, logo: val})} 
              aspect="1:1" 
            />
          </div>
          
          <div className="w-full sm:w-2/3 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Firma Adı <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Sektör</label>
                <input type="text" value={form.sector} onChange={e=>setForm({...form, sector: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Yetkili Kişi</label>
                <input type="text" value={form.authorizedPerson} onChange={e=>setForm({...form, authorizedPerson: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">E-posta <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Telefon</label>
                <input type="text" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1.5">Sistem Durumu</label>
                <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20">
                  <option>Onaylı</option>
                  <option>Beklemede</option>
                  <option>Reddedildi</option>
                  <option>Pasif</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Merkez / Konum</label>
          <input type="text" value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20" placeholder="Açık adres veya şehir..." />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-600 block mb-1.5">Firma Hakkında</label>
          <textarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} rows={4} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 resize-none" placeholder="Firma profili, vizyon ve misyon..."></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Firma Kaydet</button>
        </div>
      </form>
    </div>
  );

  return (
    <AdminCMSLayout
      title={isEditing ? (currentId ? 'Firma Profilini Düzenle' : 'Yeni Firma Ekle') : 'Firma & İşveren Yönetimi'}
      sub={isEditing ? 'Firma verilerini buradan güncelleyebilirsiniz.' : 'Sisteme kayıtlı firmaları ve işveren profillerini yönetin.'}
      headerAction={
        !isEditing ? (
          <div className="flex items-center gap-2">
            <button onClick={handleAddNew} className="bg-white text-purple-600 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-all">
              <Plus size={18} /> Yeni Firma Ekle
            </button>
          </div>
        ) : null
      }
    >
      <div className="animate-fade-in">
        {isEditing ? formView : listView}
      </div>
    </AdminCMSLayout>
  );
}
