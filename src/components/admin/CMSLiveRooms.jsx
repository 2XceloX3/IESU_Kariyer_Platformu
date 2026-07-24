import React, { useState } from 'react';
import { Card, Badge, Tbl } from './AdminShared';
import { Radio, Search, Trash2, Plus, Volume2, Users, AlertCircle } from 'lucide-react';
import { toast } from '../shared/Toast';
import useAppStore from '../../store/useAppStore';

export default function CMSLiveRooms({ currentUser, userRole, liveRooms }) {
  const [searchTerm, setSearchTerm] = useState('');

  // If the user is a club president, only show their own rooms, otherwise show all
  const isSuperAdmin = userRole === 'admin' || userRole === 'super_admin';
  const filteredRooms = (liveRooms || []).filter(r => {
    if (!isSuperAdmin && r.host.id !== currentUser?.id) return false;
    return r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.host.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const activeCount = filteredRooms.length;
  const totalListeners = filteredRooms.reduce((acc, r) => acc + (r.listeners || 0), 0);

  const handleCloseRoom = (id) => {
    if (window.confirm("Bu canlı odayı kapatmak istediğinize emin misiniz?")) {
      // Find the room and remove it
      useAppStore.getState().setLiveRooms((liveRooms || []).filter(r => r.id !== id));
      toast.success("Oda başarıyla kapatıldı.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Radio className="text-rose-500 animate-pulse" />
            Canlı Oda Yönetimi
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {isSuperAdmin 
              ? 'Sistemdeki tüm aktif sesli odaları (Clubhouse/Discord tarzı) yönetin.' 
              : 'Kulübünüze ait aktif odaları yönetin.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-5 border-l-4 border-rose-500 flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-500 uppercase">Aktif Oda Sayısı</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-black text-gray-900">{activeCount}</p>
          </div>
        </Card>
        <Card className="p-5 border-l-4 border-indigo-500 flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-500 uppercase">Toplam Dinleyici</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{totalListeners}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-gray-900">Yayın Akışı</h3>
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Oda başlığı veya sunucu ara..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-rose-500 outline-none"
            />
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <Radio size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Şu An Aktif Oda Yok</h3>
            <p className="text-gray-500">Yayında olan herhangi bir oda bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRooms.map(room => (
              <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-rose-500 shadow-sm relative">
                    <img src={room.host?.logo || room.host?.avatar || 'https://ui-avatars.com/api/?name=Oda'} alt="Host" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-rose-500/20 animate-pulse"></div>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 flex items-center gap-2">
                      {room.title}
                      <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                        <Volume2 size={12}/> Canlı
                      </span>
                    </h4>
                    <p className="text-xs font-bold text-gray-600 mt-1">Yayıncı: <span className="text-gray-900">{room.host?.name}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <Users size={16} className="text-gray-500" />
                    <span className="font-bold text-gray-900">{room.listeners} Dinleyici</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toast.info('Odaya yönetici olarak giriş yapılıyor...')} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition">
                      Odaya Katıl
                    </button>
                    <button onClick={() => handleCloseRoom(room.id)} className="px-3 py-1.5 bg-red-50 text-red-700 font-bold text-xs rounded-lg hover:bg-red-100 transition flex items-center gap-1">
                      <Trash2 size={14} /> Kapat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      
      {isSuperAdmin && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Süper Admin Yetkisi</h4>
            <p className="text-[11px] text-amber-800/80 mt-1">
              Burada kapatılan odalar kalıcı olarak sonlandırılır ve yayındaki kullanıcılara "Oda yönetici tarafından kapatıldı" uyarısı gider.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
