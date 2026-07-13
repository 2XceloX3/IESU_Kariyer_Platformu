import React, { useState, useMemo } from 'react';
import { 
  Users, Trophy, FileText, ChevronRight, CheckCircle2, 
  XCircle, Clock, Plus, Search, Building2, Calendar, 
  Wallet, ShieldCheck, MapPin, Activity, ArrowLeft, X, Bell
} from 'lucide-react';
import Logo from './Logo';
import { toast } from './shared/Toast';

export default function StudentClubPortal({ currentUser, clubs, setClubs, setView, previousView, clubApplications, setClubApplications }) {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', category: 'Bilim ve Teknoloji', description: '', purpose: '', advisor: '' });
  const [eventForm, setEventForm] = useState({ name: '', date: '', location: '', budget: '', description: '' });

  const isAdmin = currentUser?.role === 'admin' || window.localStorage.getItem('iesu_user_role_v1') === '"admin"';
  const isDean = currentUser?.title?.toLowerCase().includes('dekan');
  
  // Use global clubApplications from props, fall back to local sample data
  const applications = clubApplications || [
    { id: '1', type: 'new_club', name: 'Yapay Zeka ve Robotik Kulübü', applicant: 'Ahmet Yılmaz', status: 'pending', date: '10 Temmuz 2026' },
    { id: '2', type: 'event_budget', club: 'Müzik Kulübü', eventName: 'Bahar Şenliği Konseri', amount: '15.000 TL', status: 'approved', date: '8 Temmuz 2026' },
    { id: '3', type: 'new_club', name: 'Siber Güvenlik Kulübü', applicant: 'Ayşe Demir', status: 'rejected', date: '5 Temmuz 2026' },
  ];

  const myManagedClubs = useMemo(() => (clubs || []).filter(c => c.presidentId === currentUser?.id || (c.admins || []).includes(currentUser?.id)), [clubs, currentUser]);
  const myJoinedClubs = useMemo(() => (clubs || []).filter(c => (c.members || []).some(m => m.id === currentUser?.id)), [clubs, currentUser]);
  const filteredClubs = useMemo(() => (clubs || []).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description?.toLowerCase().includes(searchQuery.toLowerCase())), [clubs, searchQuery]);

  const isMemberOfClub = (club) => (club.members || []).some(m => m.id === currentUser?.id);
  const hasPendingRequest = (club) => (club.memberRequests || []).some(r => r.userId === currentUser?.id && r.status === 'pending');

  const handleMembershipRequest = (club) => {
    if (!currentUser) return;
    if (isMemberOfClub(club)) {
      toast.info('Bu kulübün zaten üyesisiniz.');
      return;
    }
    if (hasPendingRequest(club)) {
      toast.info('Bu kulüp için bekleyen bir üyelik talebiniz mevcut.');
      return;
    }
    const newRequest = { userId: currentUser.id, userName: currentUser.name, userAvatar: currentUser.avatar, status: 'pending', date: new Date().toLocaleDateString('tr-TR') };
    setClubs && setClubs(prev => prev.map(c => 
      c.id === club.id 
        ? { ...c, memberRequests: [...(c.memberRequests || []), newRequest] }
        : c
    ));
    // Update selected club view too
    setSelectedClub(prev => prev ? { ...prev, memberRequests: [...(prev.memberRequests || []), newRequest] } : prev);
    toast.success(`"${club.name}" kulübüne üyelik talebiniz gönderildi!`);
  };

  const handleApplyClub = () => {
    setShowCreateModal(true);
  };

  const handleSubmitClub = (e) => {
    e.preventDefault();
    const newApp = {
      id: Date.now().toString(),
      type: 'new_club',
      name: createForm.name,
      applicant: currentUser?.name || 'Öğrenci',
      status: 'pending',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      purpose: createForm.purpose,
      description: createForm.description,
      category: createForm.category,
      advisorName: createForm.advisor,
      userId: currentUser?.id,
    };
    const updatedApps = [newApp, ...(clubApplications || [])];
    if (setClubApplications) {
      setClubApplications(updatedApps);
    }
    setShowCreateModal(false);
    setCreateForm({ name: '', category: 'Bilim ve Teknoloji', description: '', purpose: '', advisor: '' });
    toast.success('Kulüp kurma başvurunuz Dekanlığa iletildi! En kısa sürede değerlendirilecektir.');
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      id: Date.now().toString(),
      type: 'event_budget',
      eventName: eventForm.name,
      club: selectedClub?.name || 'Kulübüm',
      amount: eventForm.budget ? `${eventForm.budget} TL` : 'Bütçe İstenmiyor',
      location: eventForm.location,
      status: 'pending',
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updatedApps = [newApp, ...(clubApplications || [])];
    if (setClubApplications) {
      setClubApplications(updatedApps);
    }
    setShowEventModal(false);
    setEventForm({ name: '', date: '', location: '', budget: '', description: '' });
    toast.success('Etkinlik başvurunuz Dekanlığa iletildi!');
  };

  // APPROVE/REJECT for admin - these actually work now
  const handleApproveApplication = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;
    
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'approved' } : a);
    if (setClubApplications) setClubApplications(updatedApps);
    
    // If it's a new club application, also create the club
    if (app.type === 'new_club' && setClubs) {
      const newClub = {
        id: `club_${Date.now()}`,
        name: app.name,
        category: app.category || 'Genel',
        description: app.description || '',
        memberCount: 1,
        members: [{ id: currentUser?.id, name: app.applicant }],
        admins: [],
        presidentId: null,
        advisor: app.advisor || '',
        createdAt: new Date().toISOString(),
      };
      setClubs(prev => [...prev, newClub]);
      toast.success(`"${app.name}" kulübü onaylandı ve sisteme eklendi!`);
    } else {
      toast.success('Başvuru onaylandı!');
    }
  };

  const handleRejectApplication = (appId) => {
    const updatedApps = applications.map(a => a.id === appId ? { ...a, status: 'rejected' } : a);
    if (setClubApplications) setClubApplications(updatedApps);
    toast.error('Başvuru reddedildi.');
  };

  if (selectedClub) {
    const userIsMember = isMemberOfClub(selectedClub);
    const userHasPending = hasPendingRequest(selectedClub);

    return (
      <div className="min-h-screen bg-[#F8F9FC] font-sans pb-20 animate-fade-in">
        <div className="h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
           <button onClick={() => setSelectedClub(null)} className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 backdrop-blur text-white p-2.5 rounded-full transition-colors z-10">
             <ArrowLeft size={20} />
           </button>
           <div className="absolute inset-0 bg-black/40"></div>
           <div className="absolute bottom-0 w-full p-8 flex items-end gap-6">
             <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white overflow-hidden shrink-0">
               {selectedClub.logo ? <img src={selectedClub.logo} alt={selectedClub.name} className="w-full h-full object-cover" /> : <Building2 size={40} className="text-blue-900" />}
             </div>
             <div className="text-white pb-2">
               <h1 className="text-3xl font-black">{selectedClub.name}</h1>
               <p className="text-blue-100 font-medium opacity-90">{selectedClub.memberCount || 0} Üye • Danışman: {selectedClub.advisor || 'Atanmadı'}</p>
             </div>
           </div>
        </div>

        <div className="max-w-5xl mx-auto mt-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Kulüp Hakkında</h2>
              <p className="text-gray-600 leading-relaxed">{selectedClub.description || 'Bu kulüp için henüz bir açıklama girilmemiştir.'}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><Calendar size={20} className="text-emerald-600"/> Yaklaşan Etkinlikler</h2>
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Yakın zamanda planlanmış bir etkinlik bulunmuyor.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md">
               <h3 className="font-bold mb-2">Kulübe Katıl</h3>
               <p className="text-sm text-blue-100 mb-6">Bu kulübün etkinliklerinden haberdar olmak ve yönetiminde yer almak için hemen katılın.</p>
               {userIsMember ? (
                 <div className="w-full py-3 bg-white/20 text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2">
                   <CheckCircle2 size={18} /> Üyesiniz
                 </div>
               ) : userHasPending ? (
                 <div className="w-full py-3 bg-white/20 text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2">
                   <Clock size={18} /> Talebiniz İncelemede
                 </div>
               ) : (
                 <button 
                   onClick={() => handleMembershipRequest(selectedClub)}
                   className="w-full py-3 bg-white text-blue-900 font-black rounded-xl hover:bg-blue-50 transition"
                 >
                   Üyelik Talebi Gönder
                 </button>
               )}
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-4">Yönetim Kurulu</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">B</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{selectedClub.president?.name || 'Belirtilmedi'}</p>
                  <p className="text-xs text-gray-500">Kulüp Başkanı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView || 'landing')}>
            <Logo className="h-8 w-auto text-blue-900" />
            <h1 className="text-lg font-black text-gray-900 border-l-2 border-gray-200 pl-3">Öğrenci Kulüpleri Havuzu</h1>
          </div>
          <button onClick={() => setView(previousView || 'landing')} className="text-sm font-bold text-gray-500 hover:text-gray-900">
            Geri Dön
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          <button onClick={() => setActiveTab('discover')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'discover' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Keşfet</button>
          <button onClick={() => setActiveTab('my_clubs')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'my_clubs' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
            Kulüplerim
            {myJoinedClubs.length > 0 && <span className="ml-1.5 bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{myJoinedClubs.length}</span>}
          </button>
          {(isAdmin || isDean) && (
            <button onClick={() => setActiveTab('admin')} className={`pb-4 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'admin' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              Dekanlık Onayları
              {applications.filter(a => a.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{applications.filter(a => a.status === 'pending').length}</span>
              )}
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'discover' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Kulüp adı veya anahtar kelime ara..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={handleApplyClub} className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2">
                <Plus size={20} /> Yeni Kulüp Kur
              </button>
            </div>
            {filteredClubs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Aramanıza uygun kulüp bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map(club => (
                  <div key={club.id} onClick={() => setSelectedClub(club)} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                        {club.logo ? <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-2xl" /> : <Building2 size={28} />}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{club.name}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{club.category || 'Genel'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">{club.description || 'Öğrencilerin akademik ve sosyal gelişimlerini desteklemeyi amaçlamaktadır.'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Users size={16} className="text-gray-400" /> {club.memberCount || 45} Üye
                      </div>
                      {isMemberOfClub(club) && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Üyesiniz</span>}
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my_clubs' && (
          <div className="animate-fade-in space-y-8">
            {myManagedClubs.length > 0 && (
              <>
                <h2 className="text-2xl font-black text-gray-900">Yönettiğim Kulüpler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myManagedClubs.map(club => (
                    <div key={club.id} className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-bl-xl">YÖNETİCİ</div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Trophy size={24} /></div>
                        <div>
                          <h3 className="font-black text-lg text-gray-900">{club.name}</h3>
                          <p className="text-sm text-gray-500">{(club.memberRequests || []).filter(r => r.status === 'pending').length} Yeni Üyelik Talebi</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setView('club_admin')} className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition text-sm">Paneli Aç</button>
                        <button onClick={() => { setSelectedClub(club); setShowEventModal(true); }} className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition text-sm">Etkinlik Oluştur</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-2xl font-black text-gray-900">Üye Olduğum Kulüpler</h2>
            {myJoinedClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJoinedClubs.map(club => (
                  <div key={club.id} onClick={() => setSelectedClub(club)} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Building2 size={22} /></div>
                      <div>
                        <h3 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{club.name}</h3>
                        <p className="text-xs text-gray-500">{club.category || 'Genel'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                      <CheckCircle2 size={14} /> Aktif Üye
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="col-span-full bg-white p-8 rounded-3xl border border-dashed border-gray-200 text-center">
                 <Bell size={40} className="mx-auto text-gray-300 mb-4" />
                 <p className="text-gray-500 mb-4">Henüz hiçbir kulübe üye değilsiniz.</p>
                 <button onClick={() => setActiveTab('discover')} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Kulüpleri Keşfet</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admin' && (isAdmin || isDean) && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
               <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> Dekanlık Onay Bekleyenler</h2>
               {applications.length === 0 ? (
                 <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
                   <p className="text-gray-500 font-medium">Bekleyen başvuru yok!</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {applications.map(app => (
                     <div key={app.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition bg-white">
                       <div className="flex items-start gap-4">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${app.type === 'new_club' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                           {app.type === 'new_club' ? <Building2 size={24} /> : <Wallet size={24} />}
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${app.type === 'new_club' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                               {app.type === 'new_club' ? 'Yeni Kulüp Başvurusu' : 'Bütçe Talebi'}
                             </span>
                             <span className="text-xs font-medium text-gray-400 flex items-center gap-1"><Clock size={12} /> {app.date}</span>
                           </div>
                           <h3 className="font-black text-gray-900 text-lg">{app.name || app.eventName}</h3>
                           <p className="text-sm text-gray-600">{app.applicant ? `Başvuran: ${app.applicant}` : `Kulüp: ${app.club}`} {app.amount && ` • Talep: ${app.amount}`}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                         {app.status === 'pending' ? (
                           <>
                             <button 
                               onClick={() => handleApproveApplication(app.id)}
                               className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg transition text-sm flex items-center gap-1"
                             >
                               <CheckCircle2 size={16} /> Onayla
                             </button>
                             <button 
                               onClick={() => handleRejectApplication(app.id)}
                               className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-lg transition text-sm flex items-center gap-1"
                             >
                               <XCircle size={16} /> Reddet
                             </button>
                           </>
                         ) : (
                           <span className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                             {app.status === 'approved' ? <><CheckCircle2 size={16}/> Onaylandı</> : <><XCircle size={16}/> Reddedildi</>}
                           </span>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      {/* CREATE CLUB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-100 p-6 flex items-center justify-between z-20">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Yeni Kulüp Kurma Başvurusu</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">EK-1 Öğrenci Kulübü Kurma Formu</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8 flex gap-4 text-blue-800">
                <ShieldCheck className="shrink-0 mt-1" size={24} />
                <div className="text-sm">
                  <p className="font-bold mb-1">Dekanlık Onayı Gerektirir</p>
                  <p className="opacity-90 leading-relaxed">Formu eksiksiz doldurduğunuzdan emin olun. Başvurunuz Öğrenci Dekanlığı tarafından incelenecek ve onaylandığında kulübünüz platformda aktif hale gelecektir.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitClub} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Kulüp Adı *</label>
                  <input 
                    type="text" 
                    required 
                    value={createForm.name}
                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                    placeholder="Örn: Yapay Zeka ve Robotik Kulübü" 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Kategori</label>
                    <select 
                      value={createForm.category}
                      onChange={(e) => setCreateForm({...createForm, category: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900 appearance-none"
                    >
                      <option>Bilim ve Teknoloji</option>
                      <option>Kültür ve Sanat</option>
                      <option>Spor</option>
                      <option>Mesleki Gelişim</option>
                      <option>Sosyal Sorumluluk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Akademik Danışman Önerisi</label>
                    <input 
                      type="text" 
                      value={createForm.advisor}
                      onChange={(e) => setCreateForm({...createForm, advisor: e.target.value})}
                      placeholder="Örn: Dr. Öğr. Üyesi Ahmet Yılmaz" 
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Kulübün Amacı ve Hedefleri *</label>
                  <textarea 
                    required 
                    value={createForm.purpose}
                    onChange={(e) => setCreateForm({...createForm, purpose: e.target.value})}
                    placeholder="Kulübün üniversite hayatına ve öğrencilere katacağı değerleri detaylıca açıklayınız..." 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900 min-h-[120px] resize-y"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Özet Açıklama (Platformda Görünecek) *</label>
                  <textarea 
                    required 
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    placeholder="Diğer öğrencilerin göreceği kısa bir tanıtım yazısı..." 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900 min-h-[80px] resize-y"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">
                    İptal
                  </button>
                  <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200 flex items-center gap-2">
                    <CheckCircle2 size={20} /> Başvuruyu Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EVENT APPLICATION MODAL (EK-2) */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEventModal(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in-up">
            <div className="sticky top-0 bg-white/80 backdrop-blur border-b border-gray-100 p-6 flex items-center justify-between z-20">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Etkinlik Başvurusu</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">EK-2 Etkinlik ve Bütçe Talep Formu</p>
              </div>
              <button onClick={() => setShowEventModal(false)} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full flex items-center justify-center transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-8 flex gap-4 text-emerald-800">
                <Calendar className="shrink-0 mt-1" size={24} />
                <div className="text-sm">
                  <p className="font-bold mb-1">Dekanlık Onayı ve Bütçe</p>
                  <p className="opacity-90 leading-relaxed">Etkinlik mekanının tahsisi ve varsa bütçe talebiniz Öğrenci Dekanlığı tarafından incelenecektir. Lütfen etkinlik tarihinden en az 15 gün önce başvurunuzu yapınız.</p>
                </div>
              </div>

              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Etkinlik Adı *</label>
                  <input 
                    type="text" 
                    required 
                    value={eventForm.name}
                    onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                    placeholder="Örn: Kariyer Zirvesi 2026" 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Planlanan Tarih ve Saat *</label>
                    <input 
                      type="datetime-local" 
                      required
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Talep Edilen Mekan</label>
                    <input 
                      type="text" 
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      placeholder="Örn: Ana Konferans Salonu" 
                      className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Talep Edilen Bütçe (TL)</label>
                  <input 
                    type="number" 
                    value={eventForm.budget}
                    onChange={(e) => setEventForm({...eventForm, budget: e.target.value})}
                    placeholder="Bütçe talebiniz yoksa boş bırakın" 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Etkinliğin Amacı ve İçeriği *</label>
                  <textarea 
                    required 
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    placeholder="Etkinlikte neler yapılacak? Konuşmacılar kimler?" 
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 outline-none transition font-medium text-gray-900 min-h-[120px] resize-y"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-4 justify-end">
                  <button type="button" onClick={() => setShowEventModal(false)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition">
                    İptal
                  </button>
                  <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-lg shadow-blue-200 flex items-center gap-2">
                    <CheckCircle2 size={20} /> Başvuruyu Gönder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
