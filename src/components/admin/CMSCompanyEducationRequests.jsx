import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { GraduationCap, CheckCircle2, XCircle, Clock, Building2, MapPin, Users, Search, Filter, Eye, ChevronDown } from 'lucide-react';

const CMSCompanyEducationRequests = () => {
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailModal, setDetailModal] = useState(null);

  const filtered = careerFairApplications.filter(app => {
    const matchSearch = (app.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.answers?.eventType || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.answers?.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, newStatus) => {
    setCareerFairApplications(careerFairApplications.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    ));
    setDetailModal(null);
    window.toast?.success?.(`Başvuru durumu "${newStatus}" olarak güncellendi.`);
  };

  const stats = {
    total: careerFairApplications.length,
    pending: careerFairApplications.filter(a => a.status === 'Beklemede').length,
    approved: careerFairApplications.filter(a => a.status === 'Onaylandı').length,
    rejected: careerFairApplications.filter(a => a.status === 'Reddedildi').length,
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#990000] via-[#7A0000] to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap size={28} className="text-amber-300" />
            <h1 className="text-2xl font-black">Eğitim & Kampüs Etkinlik Talepleri Havuzu</h1>
          </div>
          <p className="text-red-200 text-sm max-w-xl">Şirketlerin üniversitede düzenlemek istediği seminer, atölye, vaka çalışması ve mülakat günü talepleri burada listelenir ve yönetilir.</p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
          {[
            { label: 'Toplam Talep', val: stats.total, color: 'bg-white/10' },
            { label: 'Beklemede', val: stats.pending, color: 'bg-amber-500/20 text-amber-200' },
            { label: 'Onaylandı', val: stats.approved, color: 'bg-emerald-500/20 text-emerald-200' },
            { label: 'Reddedildi', val: stats.rejected, color: 'bg-red-400/20 text-red-200' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
              <div className="text-2xl font-black">{s.val}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Firma adı, etkinlik türü veya konu ara..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-200 focus:border-[#990000] outline-none"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 bg-white focus:ring-2 focus:ring-red-200 outline-none">
          <option value="all">Tüm Durumlar</option>
          <option value="Beklemede">Beklemede</option>
          <option value="Onaylandı">Onaylandı</option>
          <option value="Reddedildi">Reddedildi</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700 text-lg">Henüz eğitim veya etkinlik talebi yok</h3>
          <p className="text-sm text-gray-400 mt-1">Şirketler kampüs etkinlik taleplerini gönderdiğinde burada listelenecektir.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Firma</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Etkinlik Türü</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Mekan Tercihi</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Hedef Bölümler</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 text-[#990000] rounded-lg flex items-center justify-center font-black text-xs">
                          <Building2 size={16} />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{app.companyName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-700">{app.answers?.eventType || 'Belirtilmedi'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{app.answers?.venueType || '-'}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 max-w-[200px] truncate">{app.answers?.targetDepts || '-'}</td>
                    <td className="px-5 py-4 text-xs text-gray-400">{new Date(app.appliedAt).toLocaleDateString('tr-TR')}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        app.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        app.status === 'Reddedildi' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setDetailModal(app)} className="text-xs font-bold text-[#990000] hover:text-red-800 flex items-center gap-1 cursor-pointer">
                        <Eye size={14} /> Detay & İşlem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
            <div className="bg-gradient-to-r from-[#990000] to-slate-900 p-6 text-white shrink-0">
              <h2 className="text-lg font-black">Talep Detayı</h2>
              <p className="text-red-200 text-xs mt-1">{detailModal.companyName} — {detailModal.answers?.eventType || 'Eğitim Talebi'}</p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs font-bold text-gray-400 block">Firma</span><span className="font-bold text-gray-900">{detailModal.companyName}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Etkinlik Türü</span><span className="font-bold text-gray-900">{detailModal.answers?.eventType || '-'}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Mekan Tercihi</span><span className="font-bold text-gray-900">{detailModal.answers?.venueType || '-'}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Temsilci Sayısı</span><span className="font-bold text-gray-900">{detailModal.answers?.repCount || '-'}</span></div>
                <div className="col-span-2"><span className="text-xs font-bold text-gray-400 block">Hedef Bölümler & Sınıflar</span><span className="font-semibold text-gray-800">{detailModal.answers?.targetDepts || 'Belirtilmedi'}</span></div>
                <div className="col-span-2"><span className="text-xs font-bold text-gray-400 block">Açıklama & Notlar</span><p className="font-semibold text-gray-800 text-xs leading-relaxed mt-1">{detailModal.answers?.notes || 'Belirtilmedi'}</p></div>
                <div><span className="text-xs font-bold text-gray-400 block">Başvuru Tarihi</span><span className="font-bold text-gray-900">{new Date(detailModal.appliedAt).toLocaleString('tr-TR')}</span></div>
                <div><span className="text-xs font-bold text-gray-400 block">Mevcut Durum</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    detailModal.status === 'Onaylandı' ? 'bg-emerald-50 text-emerald-700' :
                    detailModal.status === 'Reddedildi' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>{detailModal.status}</span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t border-gray-100 flex items-center gap-3 shrink-0">
              <button onClick={() => updateStatus(detailModal.id, 'Onaylandı')} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer"><CheckCircle2 size={15} /> Onayla</button>
              <button onClick={() => updateStatus(detailModal.id, 'Reddedildi')} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer"><XCircle size={15} /> Reddet</button>
              <button onClick={() => setDetailModal(null)} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSCompanyEducationRequests;
