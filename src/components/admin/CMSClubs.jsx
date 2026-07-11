import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { Users, Search, Download, ShieldCheck, X } from 'lucide-react';
import { exportToCSV } from '../../utils/export';

const CLUBS_DATA = [
  {
    id: 'CLB-001',
    name: 'Yazılım Kulübü',
    memberCount: 150,
    advisor: 'Dr. Ahmet Yılmaz',
    status: 'Aktif',
    board: [
      { role: 'Başkan', name: 'Caner Doğan' },
      { role: 'Başkan Yardımcısı', name: 'Ayşe Demir' },
      { role: 'Genel Sekreter', name: 'Burak Şahin' },
      { role: 'Sayman', name: 'Elif Yılmaz' },
      { role: 'Etkinlik Sorumlusu', name: 'Kaan Çelik' },
      { role: 'İletişim Sorumlusu', name: 'Zeynep Kaya' },
      { role: 'Eğitim Sorumlusu', name: 'Mert Öztürk' },
      { role: 'Üye', name: 'Selin Yıldız' },
    ]
  },
  {
    id: 'CLB-002',
    name: 'Girişimcilik Kulübü',
    memberCount: 120,
    advisor: 'Prof. Dr. Mehmet Aslan',
    status: 'Aktif',
    board: [
      { role: 'Başkan', name: 'Seda Korkmaz' },
      { role: 'Başkan Yardımcısı', name: 'Ozan Ercan' },
      { role: 'Genel Sekreter', name: 'Ece Tekin' },
      { role: 'Sayman', name: 'Efe Çetin' },
      { role: 'Etkinlik Sorumlusu', name: 'Ceren Koç' },
      { role: 'İletişim Sorumlusu', name: 'Emre Yıldırım' },
      { role: 'Eğitim Sorumlusu', name: 'İrem Şen' },
      { role: 'Üye', name: 'Barış Bulut' },
    ]
  },
  {
    id: 'CLB-003',
    name: 'IEEE Öğrenci Kolu',
    memberCount: 200,
    advisor: 'Doç. Dr. Ayhan Ak',
    status: 'Aktif',
    board: [
      { role: 'Başkan', name: 'Onur Acar' },
      { role: 'Başkan Yardımcısı', name: 'Deniz Polat' },
      { role: 'Genel Sekreter', name: 'Pelin Işık' },
      { role: 'Sayman', name: 'Ali Kurt' },
      { role: 'Etkinlik Sorumlusu', name: 'Melis Taş' },
      { role: 'İletişim Sorumlusu', name: 'Yasin Karaca' },
      { role: 'Eğitim Sorumlusu', name: 'Gizem Kaplan' },
      { role: 'Üye', name: 'Bora Güler' },
    ]
  },
  {
    id: 'CLB-004',
    name: 'Robotik Kulübü',
    memberCount: 80,
    advisor: 'Dr. Kemal Tunç',
    status: 'Aktif',
    board: [
      { role: 'Başkan', name: 'Tolga Seçkin' },
      { role: 'Başkan Yardımcısı', name: 'Hande Mutlu' },
      { role: 'Genel Sekreter', name: 'Cem Gül' },
      { role: 'Sayman', name: 'Bahar Sönmez' },
      { role: 'Etkinlik Sorumlusu', name: 'Doruk Dağ' },
      { role: 'İletişim Sorumlusu', name: 'Buse Erdem' },
      { role: 'Eğitim Sorumlusu', name: 'Volkan Kılıç' },
      { role: 'Üye', name: 'Aslı Can' },
    ]
  }
];

export default function CMSClubs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);

  const filtered = CLUBS_DATA.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const exportData = filtered.map(c => ({
      'Kulüp ID': c.id,
      'Kulüp Adı': c.name,
      'Üye Sayısı': c.memberCount,
      'Danışman': c.advisor,
      'Durum': c.status
    }));
    exportToCSV(exportData, 'kulupler.csv');
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <PanelHeader 
        title="Kulüpler Havuzu" 
        sub="Üniversite kulüplerini ve yönetim kurulu üyelerini görüntüleyin." 
        action={
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition text-sm font-bold shadow-sm active:scale-95">
            <Download size={16} /> Excel'e Aktar
          </button>
        }
      />
      
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Kulüp Adı veya ID ara..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500/20 transition-all"
            value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kulüp ID</th>
              <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Kulüp Adı</th>
              <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Danışman</th>
              <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Üye Sayısı</th>
              <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Durum</th>
              <th className="py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-5 text-sm font-medium text-gray-500">{c.id}</td>
                <td className="py-3 px-5 text-sm font-bold text-gray-900">{c.name}</td>
                <td className="py-3 px-5 text-sm text-gray-600">{c.advisor}</td>
                <td className="py-3 px-5 text-sm text-gray-600 font-bold">{c.memberCount}</td>
                <td className="py-3 px-5">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-bold">{c.status}</span>
                </td>
                <td className="py-3 px-5 text-right">
                  <button onClick={() => setSelectedClub(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center ml-auto gap-1 text-xs font-bold">
                    <ShieldCheck size={16} /> Yönetim Kurulu
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-blue-600" />
                {selectedClub.name} Yönetim Kurulu
              </h3>
              <button onClick={() => setSelectedClub(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <div className="space-y-3">
                {selectedClub.board.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-white hover:border-blue-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-blue-600 mb-0.5">{member.role}</p>
                      <p className="text-sm font-bold text-gray-900">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
