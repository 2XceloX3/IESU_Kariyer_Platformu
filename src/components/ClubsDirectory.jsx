import React, { useState } from 'react';
import { Users, Search, Target, Award, Plus, FileText, ChevronRight, X, UserPlus, Info } from 'lucide-react';

export default function ClubsDirectory({ clubs, setClubs, clubApplications, setClubApplications, currentUser, featureClubApplications }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({ name: '', purpose: '', advisorName: '' });
  const [joinForm, setJoinForm] = useState({ motivation: '', department: '' });

  const filteredClubs = (clubs || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyClub = (e) => {
    e.preventDefault();
    if(!featureClubApplications) {
      window.toast.info("Şu anda yeni kulüp başvuruları kapalıdır.");
      return;
    }
    const newApp = {
      id: 'APP-' + Date.now(),
      ...applicationForm,
      userId: currentUser?.id,
      date: new Date().toISOString().split('T')[0],
      status: 'Öğrenci Dekanlığı Onayı Bekliyor' // Initial status for EK-1
    };
    setClubApplications([...(clubApplications || []), newApp]);
    setShowApplicationModal(false);
    setApplicationForm({ name: '', purpose: '', advisorName: '' });
    window.toast.success("EK-1: Kulüp Kurulum Başvurunuz Öğrenci Dekanlığına iletilmiştir. Süreci bildirimlerinizden takip edebilirsiniz.");
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!selectedClub) return;

    const request = {
      id: 'REQ-' + Date.now(),
      userId: currentUser?.id,
      userName: currentUser?.name || 'Öğrenci',
      department: joinForm.department,
      motivation: joinForm.motivation,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedClubs = (clubs || []).map(c => {
      if (c.id === selectedClub.id) {
        return { ...c, joinRequests: [...(c.joinRequests || []), request] };
      }
      return c;
    });

    setClubs(updatedClubs);
    setSelectedClub({ ...selectedClub, joinRequests: [...(selectedClub.joinRequests || []), request] });
    setShowJoinModal(false);
    setJoinForm({ motivation: '', department: '' });
    window.toast.success(`${selectedClub.name} kulübüne katılım talebiniz kulüp başkanına iletildi.`);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="text-emerald-500" size={28} strokeWidth={2.5} /> Kulüpler Havuzu
          </h2>
          <p className="text-gray-500 font-medium mt-1">İlgi alanlarına göre kulüpleri keşfet ve üniversite hayatını canlandır.</p>
        </div>
        
        {featureClubApplications && (
          <button 
            onClick={() => setShowApplicationModal(true)}
            className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} /> Yeni Kulüp Başvurusu
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative group w-full mb-8">
        <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Kulüp adı veya kategori ara (Örn: Doğa, Yazılım)..." 
          className="bg-gray-50 pl-12 pr-4 py-3.5 rounded-2xl text-[15px] w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200 transition-all shadow-inner" 
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClubs.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl">
            <Target size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
            <h3 className="text-lg font-bold text-gray-700 mb-2">Kulüp Bulunamadı</h3>
            <p className="max-w-sm mx-auto text-sm text-gray-500">Arama kriterlerine uyan bir kulüp bulunamadı.</p>
          </div>
        ) : (
          filteredClubs.map(club => (
            <div key={club.id} className="group border border-gray-100 hover:border-emerald-200 rounded-3xl overflow-hidden transition-all hover:shadow-lg bg-white relative cursor-pointer" onClick={() => setSelectedClub(club)}>
              <div className="h-24 overflow-hidden relative">
                <img src={club.coverImage} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-5 pt-0 relative">
                <div className="w-14 h-14 bg-white rounded-2xl border-2 border-white shadow-md p-1 -mt-7 relative z-10 mb-3">
                  <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <h3 className="font-bold text-gray-900 text-[16px] mb-1 leading-tight group-hover:text-emerald-600 transition-colors">{club.name}</h3>
                <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">{club.category}</span>
                <p className="text-[13px] text-gray-500 font-medium line-clamp-2">{club.description}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                    <Users size={14} className="text-gray-400" /> {club.memberCount} Üye
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Club Modal */}
      {selectedClub && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in relative">
            <button onClick={() => setSelectedClub(null)} className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"><X size={18}/></button>
            
            <div className="h-48 relative">
              <img src={selectedClub.coverImage} alt={selectedClub.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-xl p-1">
                  <img src={selectedClub.logo} alt={selectedClub.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="pb-2">
                  <span className="inline-block px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[11px] font-bold uppercase tracking-wider mb-1">{selectedClub.category}</span>
                  <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">{selectedClub.name}</h2>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div>
                <h3 className="text-[14px] font-bold text-gray-400 uppercase tracking-wider mb-3">Kulüp Hakkında</h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-medium">{selectedClub.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Danışman</p>
                  <p className="text-[13px] font-bold text-gray-900">Dr. Öğr. Üyesi Ahmet Y.</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Başkan</p>
                  <p className="text-[13px] font-bold text-gray-900">Caner M. (Psikoloji)</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Üye Sayısı</p>
                  <p className="text-[18px] font-black text-emerald-700">{selectedClub.memberCount}</p>
                </div>
              </div>

              {selectedClub.status === 'Aktif' && (
                <div className="flex gap-3">
                  <button onClick={() => setShowJoinModal(true)} className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[14px] font-bold transition-all shadow-md flex items-center justify-center gap-2">
                    <UserPlus size={18} /> Kulübe Katıl
                  </button>
                  <button className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[14px] font-bold transition-all flex items-center justify-center">
                    İletişime Geç
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in relative">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative">
              <button onClick={() => setShowApplicationModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"><X size={16}/></button>
              <FileText size={32} className="mb-3 opacity-90"/>
              <h2 className="text-xl font-black">EK-1: Yeni Kulüp Kurma Başvurusu</h2>
              <p className="text-emerald-50 text-sm mt-1">Lütfen formu eksiksiz doldurun. Akademik yılın ilk 6 haftasında başvurular alınmaktadır.</p>
            </div>
            
            <form onSubmit={handleApplyClub} className="p-6 space-y-5">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex gap-3 text-[13px] font-medium leading-relaxed">
                <Info size={24} className="shrink-0 text-amber-500" />
                <p>Başvurunuz onaylandığında, <strong>EK-2, EK-3, EK-4, EK-5 ve EK-6</strong> formlarını doldurmanız için size özel bir <strong>"Başkan Yönetim Paneli"</strong> açılacaktır.</p>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Planlanan Kulüp Adı</label>
                <input 
                  required 
                  value={applicationForm.name} 
                  onChange={e => setApplicationForm({...applicationForm, name: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-[14px]" 
                  placeholder="Örn: Psikoloji Araştırmaları Kulübü" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Kulübün Amacı ve Hedefleri</label>
                <textarea 
                  required 
                  rows={4}
                  value={applicationForm.purpose} 
                  onChange={e => setApplicationForm({...applicationForm, purpose: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-[14px] resize-none" 
                  placeholder="Kulübün kurulum amacı, vizyonu ve yapılması planlanan genel faaliyetler..." 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Planlanan Danışman Öğretim Elemanı</label>
                <input 
                  required 
                  value={applicationForm.advisorName} 
                  onChange={e => setApplicationForm({...applicationForm, advisorName: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-[14px]" 
                  placeholder="Örn: Prof. Dr. Ahmet Yılmaz" 
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[14px] font-bold transition-all shadow-md">
                  Başvuruyu Gönder (Öğrenci Dekanlığına)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Request Modal */}
      {showJoinModal && selectedClub && (
        <div className="fixed inset-0 z-[110] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in relative">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white relative">
              <button onClick={() => setShowJoinModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"><X size={16}/></button>
              <UserPlus size={32} className="mb-3 opacity-90"/>
              <h2 className="text-xl font-black">Kulübe Katılım İsteği</h2>
              <p className="text-emerald-50 text-sm mt-1">{selectedClub.name} kulübüne katılmak için aşağıdaki formu doldurun.</p>
            </div>
            
            <form onSubmit={handleJoinSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Bölüm / Program</label>
                <input 
                  required 
                  value={joinForm.department} 
                  onChange={e => setJoinForm({...joinForm, department: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-[14px]" 
                  placeholder="Örn: Yazılım Mühendisliği" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Katılım Motivasyonunuz</label>
                <textarea 
                  required 
                  rows={4}
                  value={joinForm.motivation} 
                  onChange={e => setJoinForm({...joinForm, motivation: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-[14px] resize-none" 
                  placeholder="Bu kulübe neden katılmak istiyorsunuz? Hangi alanlarda katkı sağlayabilirsiniz?" 
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[14px] font-bold transition-all shadow-md">
                  İsteği Gönder (Kulüp Başkanına)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
