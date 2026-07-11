import React, { useState } from 'react';
import { Target, Search, Plus, CheckCircle, XCircle, Clock, FileText, X, Folder, Eye, Download, Users } from 'lucide-react';

export default function CMSClubs({ clubs, setClubs, clubApplications, setClubApplications, currentUser }) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'active_clubs'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null); // For viewing a specific club's forms/pool

  const handleApproveApp = (app) => {
    // Approve EK-1 application, move to active clubs
    const newClub = {
      id: 'CLUB-' + Date.now(),
      name: app.name,
      category: 'Genel', // Default category
      description: app.purpose,
      presidentId: app.userId,
      advisorId: app.advisorName, // Store name for now or map to ID
      status: 'Aktif',
      memberCount: 8, // Kurucu ekip
      coverImage: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=500&q=80',
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name.substring(0,2))}&background=10B981&color=fff`,
      forms: [
        { id: 'FORM-' + Date.now(), type: 'EK-1', title: 'Yeni Kulüp Kurma Başvurusu', date: app.date, status: 'Onaylandı', pdfUrl: null }
      ]
    };
    
    setClubs([...(clubs || []), newClub]);
    
    // Update application status
    setClubApplications((clubApplications || []).map(a => a.id === app.id ? { ...a, status: 'Onaylandı' } : a));
    alert(`${app.name} kulübü onaylandı ve aktif kulüpler havuzuna eklendi.`);
  };

  const handleRejectApp = (app) => {
    setClubApplications((clubApplications || []).map(a => a.id === app.id ? { ...a, status: 'Reddedildi' } : a));
    alert("Başvuru reddedildi.");
  };

  const handleTransferPresident = (clubId) => {
    const newPresident = prompt("Yeni kulüp başkanının ID'sini (örn: STU-005) girin:");
    if (!newPresident) return;
    
    if (window.confirm(`Bu kulübün başkanlığını ${newPresident} ID'li öğrenciye devretmek istediğinize emin misiniz?`)) {
      setClubs((clubs || []).map(c => c.id === clubId ? { ...c, presidentId: newPresident } : c));
      alert("Kulüp başkanı başarıyla değiştirildi.");
    }
  };

  const pendingApps = (clubApplications || []).filter(a => a.status === 'Öğrenci Dekanlığı Onayı Bekliyor');
  const pastApps = (clubApplications || []).filter(a => a.status !== 'Öğrenci Dekanlığı Onayı Bekliyor');

  return (
    <div className="w-full bg-white rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-xl shadow-gray-200/50 animate-fade-in relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          <Target size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Kulüpler Havuzu Yönetimi</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-200/60 w-fit">
        <button 
          onClick={() => setActiveTab('applications')} 
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'applications' ? 'bg-amber-100 text-amber-700 shadow-sm border border-amber-200' : 'bg-white text-gray-500 hover:bg-amber-50 hover:text-amber-600 border border-transparent'}`}
        >
          <FileText size={16} /> Başvurular
          {pendingApps.length > 0 && <span className="bg-amber-200 text-amber-800 py-0.5 px-2 rounded-full text-[11px]">{pendingApps.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('active_clubs')} 
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'active_clubs' ? 'bg-emerald-100 text-emerald-700 shadow-sm border border-emerald-200' : 'bg-white text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent'}`}
        >
          <Users size={16} /> Aktif Kulüpler ve Form Havuzu
        </button>
      </div>

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-fade-in">
          {pendingApps.length > 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Clock size={18} className="text-amber-500" /> Bekleyen Kurulum Başvuruları</h3>
              <div className="space-y-4">
                {pendingApps.map(app => (
                  <div key={app.id} className="p-5 border border-amber-100 bg-amber-50/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">KURULUM BAŞVURUSU</span>
                        <span className="text-xs font-bold text-gray-500">{app.date}</span>
                      </div>
                      <h4 className="text-[16px] font-bold text-gray-900">{app.name}</h4>
                      <p className="text-[13px] text-gray-600 font-medium mt-1">Danışman: {app.advisorName} | Başvuran ID: {app.userId}</p>
                      <p className="text-[13px] text-gray-500 mt-2 bg-white p-3 rounded-xl border border-gray-100">"{app.purpose}"</p>
                    </div>
                    <div className="flex gap-2 md:flex-col lg:flex-row shrink-0">
                      <button onClick={() => handleApproveApp(app)} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm">
                        <CheckCircle size={16}/> Onayla
                      </button>
                      <button onClick={() => handleRejectApp(app)} className="px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all">
                        <XCircle size={16}/> Reddet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
               <CheckCircle size={48} className="mx-auto text-emerald-300 mb-3" />
               <h3 className="font-bold text-gray-900 text-lg">Bekleyen Başvuru Yok</h3>
               <p className="text-gray-500">Tüm kulüp kurulum başvuruları değerlendirilmiş.</p>
             </div>
          )}

          {/* Past Applications */}
          {pastApps.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mt-8">
              <h3 className="font-bold text-gray-900 mb-6">Geçmiş Başvurular</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                      <th className="pb-3 px-4">Kulüp Adı</th>
                      <th className="pb-3 px-4">Tarih</th>
                      <th className="pb-3 px-4">Danışman</th>
                      <th className="pb-3 px-4 text-right">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    {pastApps.map(app => (
                      <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4 font-bold text-gray-900">{app.name}</td>
                        <td className="py-4 px-4 text-gray-500 font-medium">{app.date}</td>
                        <td className="py-4 px-4 text-gray-500">{app.advisorName}</td>
                        <td className="py-4 px-4 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${app.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE CLUBS TAB */}
      {activeTab === 'active_clubs' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(clubs || []).map(club => (
              <div key={club.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                <div className="h-20 bg-emerald-600 relative">
                  <div className="absolute -bottom-6 left-6 w-14 h-14 bg-white rounded-2xl p-1 shadow-md">
                    <img src={club.logo} alt={club.name} className="w-full h-full rounded-xl object-cover" />
                  </div>
                </div>
                <div className="pt-10 p-6">
                  <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{club.name}</h3>
                  <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-4">{club.category}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 font-medium mb-6">
                    <span className="flex items-center gap-1.5"><Users size={16}/> {club.memberCount} Üye</span>
                    <span className="flex items-center gap-1.5"><FileText size={16}/> {(club.forms || []).length} Belge</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedClub(club)}
                      className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-[13px] font-bold transition-all border border-gray-200 flex items-center justify-center gap-2"
                    >
                      <Folder size={16} className="text-emerald-500" /> Havuz
                    </button>
                    <button 
                      onClick={() => handleTransferPresident(club.id)}
                      className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-[13px] font-bold transition-all border border-amber-200 flex items-center justify-center gap-2"
                    >
                      Devret
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(clubs || []).length === 0 && (
               <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100">
                 <p className="text-gray-500 font-medium">Henüz aktif bir kulüp bulunmuyor.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* CLUB FORMS POOL MODAL */}
      {selectedClub && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
            <div className="h-16 border-b border-gray-100 bg-gray-50/80 shrink-0 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <img src={selectedClub.logo} className="w-8 h-8 rounded-lg object-cover shadow-sm" alt="Logo"/>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedClub.name}</h3>
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">İç Form Havuzu</p>
                </div>
              </div>
              <button onClick={() => setSelectedClub(null)} className="p-2 hover:bg-gray-200 text-gray-500 rounded-full transition"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Folder className="text-blue-500" size={18}/> Doldurulan ve Yüklenen Formlar</h4>
                
                {(selectedClub.forms || []).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Bu kulübe ait henüz gönderilmiş bir form bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(selectedClub.forms || []).map(form => (
                      <div key={form.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-blue-50/50 transition cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3 sm:mb-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 text-sm">{form.type}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${form.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : form.status === 'Bekliyor' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{form.status}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">{form.title} • {form.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pl-12 sm:pl-0">
                          <button className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1.5">
                            <Eye size={14}/> Görüntüle
                          </button>
                          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1.5">
                            <Download size={14}/> İndir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Quick info widgets */}
                 <div className="bg-white rounded-2xl border border-gray-200 p-5">
                   <h5 className="font-bold text-gray-900 text-sm mb-3">Kulüp Başkanı Bilgileri</h5>
                   <p className="text-[13px] text-gray-600">Öğrenci ID: <span className="font-bold text-gray-900">{selectedClub.presidentId}</span></p>
                 </div>
                 <div className="bg-white rounded-2xl border border-gray-200 p-5">
                   <h5 className="font-bold text-gray-900 text-sm mb-3">Danışman Bilgileri</h5>
                   <p className="text-[13px] text-gray-600">İsim/ID: <span className="font-bold text-gray-900">{selectedClub.advisorId}</span></p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
