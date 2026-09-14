import React, { useState } from 'react';
import AdminCMSLayout from './AdminCMSLayout';
import MediaUploader from './MediaUploader';
import { Building2, Edit, Trash2, Plus, Search, Mail, Phone, CheckCircle2, Clock, Download, ShieldCheck, Eye } from 'lucide-react';
import { exportToCSV } from '../../utils/export';
import useAppStore from '../../store/useAppStore';

export default function CMSCompanies({ companies = [], setCompanies }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const adminMessages = useAppStore(state => state.adminMessages) || [];
  const jobs = useAppStore(state => state.jobs) || [];

  const [form, setForm] = useState({
    name: '',
    sector: '',
    authorizedPerson: '',
    email: '',
    phone: '',
    location: '',
    status: 'Onaylı',
    logo: '',
    description: '',
    isProtocol: true,
    protocolDate: '2025-2028',
    protocolQuota: '25 Öğrenci'
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
      description: '',
      isProtocol: true,
      protocolDate: '2025-2028',
      protocolQuota: '25 Öğrenci'
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
    if (window.confirm("Bu firmayı silmek istediğinize emin misiniz?")) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Building2 size={24}/></div>
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

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Firma adı veya sektör ara..." 
            value={searchQuery} 
            onChange={e=>setSearchQuery(e.target.value)} 
            className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e=>setStatusFilter(e.target.value)} 
          className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500/20"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="onaylı">Onaylı</option>
          <option value="beklemede">Beklemede</option>
          <option value="reddedildi">Reddedildi</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
              <tr key={c.id} onClick={() => setSelectedCompany(c)} className="cursor-pointer hover:bg-red-50/20 transition group">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      {c.logo ? <img src={c.logo} className="w-full h-full object-cover" /> : <Building2 size={20} className="text-gray-400"/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition flex items-center gap-1.5">
                        {c.name} <Eye size={13} className="opacity-0 group-hover:opacity-100 transition text-red-600" />
                      </p>
                      <p className="text-[11px] font-medium text-gray-500">{c.sector || 'Sektör Belirtilmedi'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-5">
                  <p className="text-xs font-bold text-gray-700">{c.authorizedPerson || '-'}</p>
                  <p className="text-[10px] font-medium text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10}/> {c.email || '-'}</p>
                </td>
                <td className="py-3 px-5">
                  <span className="text-[11px] font-black bg-red-50 text-red-600 px-2 py-1 rounded-md">{c.activeJobs || 0} Aktif</span>
                </td>
                <td className="py-3 px-5">
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${c.status === 'Onaylı' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(c)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition">İptal</button>
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition">Firma Kaydet</button>
        </div>
      </form>
    </div>
  );

  return (
    <AdminCMSLayout 
      title="Firma Bilgi Havuzu" 
      description="Üniversite ile iş birliği yapan kurumsal firmaların liste ve detay yönetimi."
      actions={
        !isEditing && (
          <div className="flex items-center gap-2">
            <button onClick={() => exportToCSV(safeCompanies, 'Firma_Listesi')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"><Download size={14}/> CSV İndir</button>
            <button onClick={handleAddNew} className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-red-900/20"><Plus size={14}/> Yeni Firma Ekle</button>
          </div>
        )
      }
    >
      {isEditing ? formView : listView}

      {/* COMPANY DETAIL POPUP MODAL */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#990000] to-slate-900 p-6 text-white shrink-0 relative">
              <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white">✕</button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                  {selectedCompany.logo ? <img src={selectedCompany.logo} alt={selectedCompany.name} className="w-full h-full object-cover" /> : <Building2 size={28} className="text-[#990000]" />}
                </div>
                <div>
                  <h2 className="text-xl font-black">{selectedCompany.name}</h2>
                  <p className="text-red-200 text-xs mt-0.5">{selectedCompany.sector || 'Sektör Belirtilmedi'} • {selectedCompany.location || 'İstanbul / Türkiye'}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* General Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div><span className="font-bold text-gray-400 block">Yetkili Kişi</span><span className="font-black text-gray-900 text-sm">{selectedCompany.authorizedPerson || '-'}</span></div>
                <div><span className="font-bold text-gray-400 block">E-Posta</span><span className="font-semibold text-gray-800">{selectedCompany.email || '-'}</span></div>
                <div><span className="font-bold text-gray-400 block">Telefon</span><span className="font-semibold text-gray-800">{selectedCompany.phone || '-'}</span></div>
                <div><span className="font-bold text-gray-400 block">Sistem Durumu</span><span className="font-black text-emerald-600">{selectedCompany.status || 'Onaylı'}</span></div>
                <div><span className="font-bold text-gray-400 block">Aktif İlan Sayısı</span><span className="font-black text-[#990000]">{selectedCompany.activeJobs || 0} İlan</span></div>
                <div><span className="font-bold text-gray-400 block">Kayıt Tarihi</span><span className="font-semibold text-gray-600">{selectedCompany.createdAt ? new Date(selectedCompany.createdAt).toLocaleDateString('tr-TR') : 'Resmî Kayıt'}</span></div>
              </div>

              {/* Education / Event Requests from this company */}
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Building2 size={16} className="text-[#990000]"/> Kampüs Etkinlik & Eğitim Talepleri ({careerFairApplications.filter(a => a.companyName?.toLowerCase() === selectedCompany.name?.toLowerCase()).length})</h4>
                {careerFairApplications.filter(a => a.companyName?.toLowerCase() === selectedCompany.name?.toLowerCase()).length === 0 ? (
                  <p className="text-gray-400 italic bg-gray-50 p-3 rounded-xl">Bu firmaya ait etkinlik/eğitim talebi bulunmamaktadır.</p>
                ) : (
                  <div className="space-y-2">
                    {careerFairApplications.filter(a => a.companyName?.toLowerCase() === selectedCompany.name?.toLowerCase()).map(app => (
                      <div key={app.id} className="bg-red-50/50 border border-red-100 p-3 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-black text-[#990000]">{app.answers?.eventType || 'Eğitim Talebi'}</p>
                          <p className="text-[11px] text-gray-600">Mekan: {app.answers?.venueType || '-'} | Bölümler: {app.answers?.targetDepts || '-'}</p>
                        </div>
                        <span className="font-black text-[10px] bg-white px-2 py-1 rounded-md text-amber-700 border border-amber-200">{app.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Messages from this company */}
              <div>
                <h4 className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1.5"><Mail size={16} className="text-slate-700"/> KGM Yöneticisine Gönderilen Mesajlar ({adminMessages.filter(m => m.companyName?.toLowerCase() === selectedCompany.name?.toLowerCase()).length})</h4>
                {adminMessages.filter(m => m.companyName?.toLowerCase() === selectedCompany.name?.toLowerCase()).length === 0 ? (
                  <p className="text-gray-400 italic bg-gray-50 p-3 rounded-xl">Bu firmaya ait özel yönetici mesajı bulunmamaktadır.</p>
                ) : (
                  <div className="space-y-2">
                    {adminMessages.filter(m => m.companyName?.toLowerCase() === selectedCompany.name?.toLowerCase()).map(msg => (
                      <div key={msg.id} className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-gray-900">{msg.subject}</p>
                          <span className="text-[10px] text-gray-400">{msg.date}</span>
                        </div>
                        <p className="text-gray-600 mt-1">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-between items-center shrink-0">
              <button onClick={() => { handleEdit(selectedCompany); setSelectedCompany(null); }} className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition">Profil Düzenle</button>
              <button onClick={() => setSelectedCompany(null)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </AdminCMSLayout>
  );
}
