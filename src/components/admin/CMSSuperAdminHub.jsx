import React, { useState, useEffect } from 'react';
import { Card, StatCard, Badge, BtnPrimary, BtnRed, BtnGreen } from './AdminShared';
import { ShieldAlert, Users, Database, CheckCircle, Activity, Download, RefreshCw } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function CMSSuperAdminHub({ academicRole, currentUser, setActiveTab }) {
  const siteConfig = useAppStore(state => state.siteConfig);
  const setSiteConfig = useAppStore(state => state.setSiteConfig);
  const maintenanceMode = siteConfig?.maintenanceMode ?? false;
  
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleClearCache = () => {
    setShowClearCacheModal(false);
    setToastMessage('Önbellek başarıyla temizlendi.');
  };

  const handleExport = () => {
    if (setActiveTab) {
      setActiveTab('data_export');
    } else if (window.setActiveTabGlobal) {
      window.setActiveTabGlobal('data_export');
    } else if (window.toast?.info) {
      window.toast.info("Veri Dışa Aktarım Merkezi'ne yönlendiriliyorsunuz...");
    } else {
      alert("Veri Dışa Aktarım Merkezi'ne yönlendiriliyorsunuz...");
    }
  };

  const dummyAdmins = [
    { id: 1, name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'Süper Admin', lastLogin: 'Bugün 14:30', photo: '/iesu-logo.svg' },
    { id: 2, name: 'Kariyer Merkezi Ofisi', role: 'Kariyer Ofisi', lastLogin: 'Dün 10:15', photo: 'https://ui-avatars.com/api/?name=Kariyer+Ofisi&background=990000&color=fff' },
  ];

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-50 text-green-700 px-4 py-2 rounded-xl shadow-lg border border-green-200 z-50 flex items-center gap-2">
          <CheckCircle size={18} />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#990000] to-red-950 rounded-2xl p-8 text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <ShieldAlert size={32} />
            Süper Admin Kontrol Merkezi
          </h1>
          <p className="text-red-100/80 font-medium">Platform Versiyonu: v2.4.0 • Son Yedekleme: 12.08.2026 • Aktif Admin: {dummyAdmins.length}</p>
        </div>
        <div className="flex flex-col items-center gap-2 border border-red-800/50 bg-red-900/30 p-4 rounded-xl">
          <span className="text-sm font-bold text-red-200 uppercase tracking-wider">Acil Bakım Modu</span>
          <button 
            onClick={() => setSiteConfig && setSiteConfig({ ...siteConfig, maintenanceMode: !maintenanceMode })}
            className={`w-14 h-8 rounded-full transition-colors flex items-center px-1 ${maintenanceMode ? 'bg-red-500' : 'bg-gray-400'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Toplam Kayıtlı Kullanıcı" value="12.450" sub="🟢 %5 artış" icon={<Users size={24}/>} color="blue" />
        <StatCard label="Aktif Oturum" value="342" sub="🟢 %12 artış" icon={<Activity size={24}/>} color="green" />
        <StatCard label="Bekleyen Onay" value="45" sub="🔴 %2 azalış" icon={<CheckCircle size={24}/>} color="orange" />
        <StatCard label="Sistem Yükü" value="%42" sub="🟢 Stabil" icon={<Database size={24}/>} color="red" />
      </div>

      {/* Admin Users */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-gray-900">Admin Üyeleri Yönetimi</h2>
          <BtnPrimary>+ Yeni Admin Davet Et</BtnPrimary>
        </div>
        <div className="space-y-4">
          {dummyAdmins.map(admin => (
            <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <img src={admin.photo} alt={admin.name} className="w-10 h-10 rounded-full shadow-sm" />
                <div>
                  <h3 className="font-bold text-gray-900">{admin.name}</h3>
                  <p className="text-xs text-gray-500">Son Giriş: {admin.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge status={admin.role === 'Süper Admin' ? 'Yayında' : 'Onaylı'} />
                <select className="text-sm font-bold border-gray-200 rounded-lg bg-white px-3 py-1.5 text-gray-700 outline-none focus:border-[#990000]">
                  <option>Süper Admin</option>
                  <option>Kariyer Ofisi</option>
                  <option>Pasif</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-2xl p-6 bg-red-50/30">
        <h2 className="text-lg font-black text-red-700 flex items-center gap-2 mb-4">
          <ShieldAlert size={20} />
          Tehlikeli Bölge (Danger Zone)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Önbelleği Temizle</h3>
              <p className="text-sm text-gray-500">Sistem önbelleğini temizler.</p>
            </div>
            <BtnRed onClick={() => setShowClearCacheModal(true)}>
              <span className="flex items-center gap-2"><RefreshCw size={14}/> Temizle</span>
            </BtnRed>
          </div>
          <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Veri Dışa Aktar</h3>
              <p className="text-sm text-gray-500">Tüm sistem verisini güvenli indir.</p>
            </div>
            <button onClick={handleExport} className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors">
              <Download size={14} /> Dışa Aktar
            </button>
          </div>
        </div>
      </div>

      {showClearCacheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-black text-gray-900 mb-2">Bu işlemi onaylıyor musunuz?</h3>
            <p className="text-sm text-gray-500 mb-6">Önbelleği temizlemek, kısa süreliğine platform performansını etkileyebilir.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClearCacheModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">İptal</button>
              <BtnRed onClick={handleClearCache}>Evet, Temizle</BtnRed>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
