import React, { useState } from 'react';
import { Users, Search, Plus, ShieldCheck, CheckCircle2, XCircle, Eye, Trash2, Calendar, MapPin, AlignLeft, Download, User } from 'lucide-react';
import PanelHeader from './PanelHeader';

export default function CMSGroups({ groups, setGroups, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const filteredGroups = (groups || []).filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (groupId) => {
    setGroups((groups || []).map(g => {
      if (g.id === groupId) {
        return { ...g, status: g.status === 'Aktif' ? 'Pasif' : 'Aktif' };
      }
      return g;
    }));
  };

  const handleToggleVerified = (groupId) => {
    setGroups((groups || []).map(g => {
      if (g.id === groupId) {
        return { ...g, verified: !g.verified };
      }
      return g;
    }));
  };

  const handleDelete = (groupId) => {
    if(window.confirm('Bu topluluğu silmek istediğinize emin misiniz?')) {
      setGroups((groups || []).filter(g => g.id !== groupId));
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Topluluklar ve Gruplar (CMS)" 
        sub="Platformdaki öğrenci kulüpleri, mezun ağları ve çalışma gruplarının yönetimi." 
        action={
          <button 
            onClick={() => {
              const headers = ['ID', 'Topluluk Adi', 'Tur', 'Uye Sayisi', 'Onayli', 'Durum'];
              const csvContent = [
                headers.join(';'),
                ...filteredGroups.map(g => [
                  g.id, 
                  g.name.replace(/;/g, ','), 
                  g.type, 
                  g.memberCount, 
                  g.verified ? 'Evet' : 'Hayir', 
                  g.status
                ].join(';'))
              ].join('\n');
          
              const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'Kulupler_Faaliyet_Raporu.csv';
              link.click();
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Download size={16} /> Excel'e Aktar
          </button>
        }
      />

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Topluluk ara..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:ring-2 focus:ring-iesu-red outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Topluluk</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Tür</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Üye / Onay</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px]">Durum</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[11px] text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGroups.map(group => (
                <tr key={group.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={group.logo} alt="logo" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 flex items-center gap-1.5">
                          {group.name} 
                          {group.verified && <ShieldCheck size={14} className="text-blue-500" title="Resmi Onaylı" />}
                        </p>
                        <p className="text-[11px] font-medium text-gray-500 mt-0.5">ID: {group.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">{group.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-gray-900">{group.memberCount} Üye</p>
                    <button 
                      onClick={() => handleToggleVerified(group.id)}
                      className={`text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center gap-1 ${group.verified ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                    >
                      {group.verified ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 
                      {group.verified ? 'Onaylı' : 'Onaysız'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleStatus(group.id)} className={`px-2.5 py-1 rounded-full text-xs font-bold border transition ${group.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {group.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedGroup(group)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition" title="Detaylar & Etkinlikler">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(group.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition" title="Sil">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGroups.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">Kayıt bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            <div className="relative h-48 bg-gray-200 shrink-0">
              <img src={selectedGroup.cover} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <button onClick={() => setSelectedGroup(null)} className="absolute top-4 right-4 text-white hover:text-red-400 bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-sm transition">
                <XCircle size={24} />
              </button>
              
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-md">
                  <img src={selectedGroup.logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div className="text-white pb-1">
                  <h2 className="text-2xl font-black flex items-center gap-2">
                    {selectedGroup.name}
                    {selectedGroup.verified && <ShieldCheck size={20} className="text-blue-400" />}
                  </h2>
                  <p className="text-white/80 font-medium text-sm">{selectedGroup.type} • {selectedGroup.memberCount} Üye</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2"><AlignLeft size={18} className="text-iesu-red" /> Genel Açıklama</h3>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                    {selectedGroup.description || 'Açıklama girilmemiş.'}
                  </p>

                  <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2"><Users size={18} className="text-iesu-red" /> Yönetim Ekibi (8 Kişi)</h3>
                  <div className="space-y-2">
                    {selectedGroup.boardMembers?.length > 0 ? selectedGroup.boardMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-iesu-red/10 flex items-center justify-center text-iesu-red shrink-0">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 leading-none">{member.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium mt-1">{member.department}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md whitespace-nowrap">
                          {member.role}
                        </span>
                      </div>
                    )) : (
                      <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-xl border border-gray-100">Yönetim ekibi bilgisi bulunmuyor.</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2"><Calendar size={18} className="text-iesu-red" /> Etkinlikler</h3>
                  <div className="space-y-3">
                    {selectedGroup.events?.length > 0 ? selectedGroup.events.map(evt => (
                      <div key={evt.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p className="font-bold text-gray-900 text-sm mb-1">{evt.title}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {evt.date} {evt.time}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {evt.location}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center text-sm text-gray-500">
                        Bu grubun henüz bir etkinliği yok.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
