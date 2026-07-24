import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, Search, Download, Settings, FileText } from 'lucide-react';
import PanelHeader from './PanelHeader';

export default function CMSAlumniCard({ alumniCardApplications = [], setAlumniCardApplications, alumniCardForms = [], setAlumniCardForms }) {
  const [search, setSearch] = useState('');
  const [isFormActive, setIsFormActive] = useState(
    (alumniCardForms || []).length > 0 ? alumniCardForms[0]?.isActive : true
  );

  const filtered = (alumniCardApplications || []).filter(app => 
    app.name?.toLowerCase().includes(search.toLowerCase()) || 
    app.email?.toLowerCase().includes(search.toLowerCase()) ||
    app.tc?.includes(search)
  );

  const toggleFormStatus = () => {
    const newState = !isFormActive;
    setIsFormActive(newState);
    setAlumniCardForms([{ id: 'FORM-1', isActive: newState, lastUpdated: new Date().toLocaleDateString('tr-TR') }]);
  };

  const updateStatus = (id, newStatus) => {
    setAlumniCardApplications((alumniCardApplications || []).map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    }));
  };

  const exportExcel = () => {
    const headers = ['Başvuru No', 'TC Kimlik', 'Ad Soyad', 'Bölüm', 'Mezuniyet Yılı', 'E-posta', 'Telefon', 'Başvuru Tarihi', 'Durum'];
    const csvContent = [
      headers.join(';'),
      ...(alumniCardApplications || []).map(app => [
        app.id, app.tc, app.name, app.department, app.gradYear, app.email, app.phone, app.date, app.status
      ].join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mezun_Karti_Basvurulari_${new Date().toLocaleDateString('tr-TR')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Mezun Kartı Başvuruları" 
        sub="Mezun kart taleplerini, formları ve KVKK onaylarını yönetin"
        action={
          <div className="flex gap-2">
            <button onClick={exportExcel} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
              <Download size={16} /> Excel İndir
            </button>
          </div>
        }
      />

      {/* İstatistikler & Form Ayarı */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between col-span-1 md:col-span-4 lg:col-span-1 border-l-4 border-red-500">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">Başvuru Formu Durumu</p>
            <p className="text-xs text-gray-500">Kullanıcılar başvuru yapabilir mi?</p>
          </div>
          <button 
            onClick={toggleFormStatus}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${isFormActive ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
          >
            {isFormActive ? 'Form Aktif' : 'Form Kapalı'}
          </button>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><FileText size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Toplam Başvuru</p><p className="text-2xl font-black text-gray-900">{(alumniCardApplications || []).length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600"><Clock size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Bekleyen</p><p className="text-2xl font-black text-gray-900">{(alumniCardApplications || []).filter(a => a.status === 'Bekliyor').length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600"><CheckCircle size={24}/></div>
          <div><p className="text-sm font-bold text-gray-500">Onaylanan/Verilen</p><p className="text-2xl font-black text-gray-900">{(alumniCardApplications || []).filter(a => ['Onaylandı', 'Verildi'].includes(a.status)).length}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-gray-900">Başvuru Listesi</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="İsim veya TC ara..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-300 w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Aday Bilgileri</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Bölüm & Mezuniyet</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">İletişim</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-gray-500 text-sm">Başvuru bulunamadı.</td></tr>
              ) : filtered.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-5">
                    <p className="font-bold text-gray-900 text-sm">{app.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">TC: {app.tc}</p>
                    <p className="text-[10px] text-gray-500 mt-1">Başvuru: {app.date}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs font-medium text-gray-900">{app.department}</p>
                    <p className="text-xs text-gray-500">{app.gradYear} Mezunu</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-xs text-blue-600 font-medium">{app.email}</p>
                    <p className="text-xs text-gray-500">{app.phone}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border 
                      ${app.status === 'Bekliyor' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                      ${app.status === 'Onaylandı' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${app.status === 'Verildi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                      ${app.status === 'Reddedildi' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    `}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <select 
                      value={app.status} 
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      <option value="Bekliyor">Bekliyor</option>
                      <option value="Onaylandı">Onayla</option>
                      <option value="Verildi">Teslim Edildi</option>
                      <option value="Reddedildi">Reddet</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
