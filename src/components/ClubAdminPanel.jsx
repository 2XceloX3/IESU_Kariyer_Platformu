import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Users, Check, X, Megaphone, MapPin, Send, FileText, Image as ImageIcon } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { toast } from './shared/Toast';

export default function ClubAdminPanel({ currentUser, setView, userRole }) {
  const { clubs, setClubs, events, setEvents } = useAppStore();
  
  // 1. Yetkilendirme Mantık Hatası Düzeltmesi
  // managedClubs içinde, kullanıcının id veya ismine göre başkan/admin olup olmadığını tam kontrol ediyoruz.
  const managedClubs = useMemo(() => {
    if (currentUser?.role === 'admin') return clubs; // Süper Admin tüm kulüpleri yönetebilir
    return clubs.filter(c => 
      c.presidentId === currentUser?.id || 
      c.president?.name === currentUser?.name || 
      (c.admins && c.admins.includes(currentUser?.id))
    );
  }, [clubs, currentUser]);

  // 2. Stale State Düzeltmesi: managedClubs değiştiğinde selectedClubId güncellenir.
  const [selectedClubId, setSelectedClubId] = useState(managedClubs.length > 0 ? managedClubs[0].id : null);
  
  useEffect(() => {
    if (managedClubs.length > 0 && (!selectedClubId || !managedClubs.find(c => c.id === selectedClubId))) {
      setSelectedClubId(managedClubs[0].id);
    }
  }, [managedClubs, selectedClubId]);

  const [activeTab, setActiveTab] = useState('requests');
  
  // Post states
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postImage, setPostImage] = useState('');

  const selectedClub = useMemo(() => {
    return clubs.find(c => c.id === selectedClubId) || managedClubs[0];
  }, [clubs, selectedClubId, managedClubs]);

  if (managedClubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <Shield size={64} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-500">Yönetim Yetkiniz Bulunmuyor</h2>
        <p className="text-sm text-gray-500 mt-2 text-center max-w-md">Herhangi bir kulübün başkanı veya yöneticisi değilsiniz. Kulüp kurmak için Kariyer Merkezi ile iletişime geçin.</p>
      </div>
    );
  }
  
  // 1. Yetkilendirme Mantık Hatası Düzeltmesi (isPresident check)
  const isPresident = selectedClub.presidentId === currentUser?.id || selectedClub.president?.name === currentUser?.name;

  // 3. Veri Mutasyon Hatası Düzeltmesi: req objesinin id'si reqId iken üyenin userId'si olmalı
  const handleAcceptRequest = (req) => {
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        // Create proper member object
        const newMember = {
          id: 'MEM-' + Date.now(),
          userId: req.userId || req.id, // Ensure userId exists
          name: req.userName || req.name || 'İsimsiz Üye',
          department: req.department || '',
          joinedAt: new Date().toISOString()
        };
        const newMembers = [...(c.members || []), newMember];
        // 4. State İsimlendirme Tutarsızlığı Düzeltmesi: Hep memberRequests kullanıyoruz
        const newRequests = (c.memberRequests || []).filter(r => r.id !== req.id);
        return { ...c, members: newMembers, memberRequests: newRequests, memberCount: (c.memberCount || 0) + 1 };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.success(`${req.userName || req.name || 'Öğrenci'} kulübe kabul edildi.`);
  };

  const handleRejectRequest = (reqId) => {
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        const newRequests = (c.memberRequests || []).filter(r => r.id !== reqId);
        return { ...c, memberRequests: newRequests };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.info('Üyelik isteği reddedildi.');
  };

  const handleToggleAdmin = (userId) => {
    if (!isPresident) {
      toast.error('Sadece kulüp başkanı yetki verebilir!');
      return;
    }
    if (!userId) {
      toast.error('Kullanıcı kimliği bulunamadı.');
      return;
    }
    
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        const currentAdmins = c.admins || [];
        const isAlreadyAdmin = currentAdmins.includes(userId);
        
        let newAdmins;
        if (isAlreadyAdmin) {
          newAdmins = currentAdmins.filter(id => id !== userId);
          toast.info('Yönetici yetkisi alındı.');
        } else {
          newAdmins = [...currentAdmins, userId];
          toast.success('Yönetici yetkisi verildi.');
        }
        
        return { ...c, admins: newAdmins };
      }
      return c;
    });
    setClubs(updatedClubs);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle || !postContent) {
      toast.error('Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    const newEvent = {
      id: 'EVT-' + Date.now(),
      title: postTitle,
      description: postContent,
      location: postLocation || 'Kampüs İçi',
      date: new Date().toISOString().split('T')[0],
      organizer: selectedClub.name,
      organizerId: selectedClub.id,
      image: postImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      attendees: 0
    };

    setEvents(prev => [newEvent, ...prev]);
    toast.success('Gönderi ve Etkinlik başarıyla paylaşıldı!');
    
    setPostTitle('');
    setPostContent('');
    setPostLocation('');
    setPostImage('');
    setActiveTab('requests');
  };

  // 6. Fake Formlar Düzeltmesi (EK Formları)
  const handleEKFormSubmit = (formType, successMsg) => {
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        const newForm = {
          id: `FORM-${Date.now()}`,
          type: formType,
          date: new Date().toLocaleDateString('tr-TR'),
          status: 'Bekliyor'
        };
        return { ...c, forms: [...(c.forms || []), newForm] };
      }
      return c;
    });
    setClubs(updatedClubs);
    toast.success(successMsg);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-8">
      
      <div className="mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider backdrop-blur-sm">
                YÖNETİCİ PANELİ
              </span>
              {isPresident && (
                <span className="bg-amber-400/20 text-amber-100 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider backdrop-blur-sm">
                  BAŞKAN
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black">{selectedClub.name}</h1>
            <p className="text-emerald-100 mt-2 font-medium">Kulüp üyelerini, etkinlikleri ve belgeleri yönetin.</p>
          </div>
          
          {managedClubs.length > 1 && (
            <div className="shrink-0 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
              <select 
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer appearance-none px-4 py-2"
              >
                {managedClubs.map(c => (
                  <option key={c.id} value={c.id} className="text-gray-900">{c.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100 hide-scrollbar">
          <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'requests' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <Shield size={18}/> 
            Katılım İstekleri
            {/* 4. State İsimlendirme Tutarsızlığı Düzeltmesi: joinRequests yerine memberRequests */}
            {(selectedClub.memberRequests?.length > 0) && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1 animate-pulse">
                {selectedClub.memberRequests.length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('members')} className={`whitespace-nowrap py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'members' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <Users size={18}/> Üyeler ve Yetkiler
          </button>
          <button onClick={() => setActiveTab('documents')} className={`whitespace-nowrap py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'documents' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <FileText size={18}/> Belge Deposu
          </button>
          <button onClick={() => setActiveTab('ek_forms')} className={`whitespace-nowrap py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'ek_forms' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <FileText size={18}/> Resmi Başvuru Formları (EK)
          </button>
          <button onClick={() => setActiveTab('post')} className={`whitespace-nowrap py-4 px-6 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'post' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            <Send size={18}/> Gönderi Paylaş
          </button>
        </div>

        <div className="p-6 lg:p-8">
          
          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Bekleyen İstekler</h3>
                  <p className="text-sm text-gray-500">Kulübünüze katılmak isteyen öğrencileri onaylayın veya reddedin.</p>
                </div>
              </div>

              {(!selectedClub.memberRequests || selectedClub.memberRequests.length === 0) ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <Shield size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-gray-900 font-bold text-lg">Bekleyen İstek Yok</h4>
                  <p className="text-gray-500 text-sm mt-1">Şu anda kulübünüze katılım isteği bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedClub.memberRequests.map(req => (
                    <div key={req.id} className="p-5 border border-gray-200 rounded-2xl bg-white hover:border-emerald-200 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{req.userName || req.name}</h4>
                          <p className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-md mt-1">{req.department}</p>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-md">{new Date(req.date || Date.now()).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                        <p className="text-sm text-gray-600 italic">"{req.motivation}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleAcceptRequest(req)} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-sm">
                          <Check size={16} /> Onayla
                        </button>
                        <button onClick={() => handleRejectRequest(req.id)} className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                          <X size={16} /> Reddet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">Üyeler ve Yönetim Kadrosu</h3>
                  <p className="text-sm text-gray-500">Üye listenizi görüntüleyin ve yöneticileri atayın.</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-800 font-medium flex items-start gap-3">
                <Shield className="shrink-0 text-blue-500 mt-0.5" size={18} />
                <p>Kulüp başkanı olarak üyelerinize "Yönetici" yetkisi verebilirsiniz. Yöneticiler, katılım isteklerini onaylayabilir ve kulüp adına gönderi paylaşabilir.</p>
              </div>

              {(!selectedClub.members || selectedClub.members.length === 0) ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <Users size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-gray-900 font-bold text-lg">Henüz onaylanmış üye bulunmuyor.</h4>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedClub.members.map(member => {
                    const isMemberAdmin = (selectedClub.admins || []).includes(member.userId);
                    const isMemberPresident = selectedClub.presidentId === member.userId || selectedClub.president?.name === member.name;
                    
                    return (
                      <div key={member.id} className={`p-4 border rounded-2xl flex items-center justify-between transition-all ${isMemberPresident ? 'bg-amber-50 border-amber-200' : isMemberAdmin ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${isMemberPresident ? 'bg-amber-500' : isMemberAdmin ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                            {member.name ? member.name.charAt(0).toUpperCase() : 'Ü'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{member.name}</p>
                            <p className="text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                              {isMemberPresident ? <span className="text-amber-600">Başkan</span> : isMemberAdmin ? <span className="text-indigo-600">Yönetici</span> : <span className="text-gray-500">Üye</span>}
                            </p>
                          </div>
                        </div>
                        
                        {isPresident && !isMemberPresident && (
                          <button 
                            onClick={() => handleToggleAdmin(member.userId)}
                            className={`p-2 rounded-xl transition-colors ${isMemberAdmin ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200' : 'text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700'}`}
                            title={isMemberAdmin ? "Yöneticilikten Al" : "Yönetici Yap"}
                          >
                            <Shield size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Belge Deposu</h2>
                    <p className="text-sm text-gray-500">Sisteme yüklenen onaylı belgeler.</p>
                  </div>
                </div>
                <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                  Yeni Belge Yükle
                </button>
              </div>

              {(!selectedClub.forms || selectedClub.forms.length === 0) ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold">Sisteme yüklenmiş herhangi bir belge bulunamadı.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedClub.forms.map(form => (
                    <div key={form.id} className="p-5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between group hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer">
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{form.type}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-1">{form.date} - Dekanlığa İletildi</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${form.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : form.status === 'Bekliyor' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {form.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EK FORMS SECTION */}
          {activeTab === 'ek_forms' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Resmi Başvuru Formları</h2>
                  <p className="text-sm text-gray-500">Öğrenci Dekanlığına sunulması gereken EK-2, EK-3 ve EK-4 belgelerini doldurun.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-gray-200 rounded-xl bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-900/5 transition-all cursor-pointer group flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-gray-900 mb-2 group-hover:text-purple-600 text-lg">EK-2: Kurucu Üye Listesi</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">Kulübün kurucu yönetim kurulu ve denetleme kurulu üyelerini sisteme işleyin.</p>
                  </div>
                  <button onClick={() => handleEKFormSubmit('EK-2 Kurucu Üye Listesi', 'EK-2 Formu dolduruldu ve sisteme kaydedildi.')} className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition-colors">Formu Doldur</button>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-900/5 transition-all cursor-pointer group flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-gray-900 mb-2 group-hover:text-purple-600 text-lg">EK-3: Faaliyet Planı</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">Eğitim-Öğretim yılı içinde gerçekleştirmeyi planladığınız seminer ve etkinlikleri planlayın.</p>
                  </div>
                  <button onClick={() => handleEKFormSubmit('EK-3 Faaliyet Planı', 'EK-3 Yıllık Faaliyet planı başarıyla oluşturuldu ve onaya gönderildi.')} className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition-colors">Planı Oluştur</button>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-900/5 transition-all cursor-pointer group flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-gray-900 mb-2 group-hover:text-purple-600 text-lg">EK-4: Danışman Onay Formu</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">Akademik danışmanınızın resmi onay işlemlerini başlatın ve takip edin.</p>
                  </div>
                  <button onClick={() => handleEKFormSubmit('EK-4 Danışman Onayı', 'EK-4 onayı için Akademik Danışmanınıza bildirim gönderildi.')} className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition-colors">Onay Talebi Gönder</button>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 flex flex-col justify-between opacity-60">
                  <div>
                    <h3 className="font-black text-gray-900 mb-2 text-lg">EK-5 & EK-6</h3>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2">Genel kurul tutanakları ve yeni dönem seçim sonuçları. Sadece seçim döneminde aktif olur.</p>
                  </div>
                  <button disabled className="w-full py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed">Seçim Dönemi Dışı</button>
                </div>
              </div>
            </div>
          )}
          
          {/* POST TAB */}
          {activeTab === 'post' && (
            <form onSubmit={handleCreatePost} className="animate-fade-in max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Megaphone size={20} />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Gönderi Paylaş</h3>
                    <p className="text-sm text-gray-500">Kulüp adına duyuru, etkinlik veya haber paylaşın.</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("AI Metin Oluşturuluyor...");
                      setTimeout(() => {
                        setPostTitle(prev => prev || 'Yeni Dönem Tanışma Toplantısı');
                        setPostContent('Merhaba Değerli Üyelerimiz,\n\nYeni döneme harika bir başlangıç yapmak için bir araya geliyoruz! Bu toplantıda yıllık planlarımızı konuşacak, vizyonumuzu paylaşacak ve sürpriz etkinliklerimizi duyuracağız.\n\nHerkesi bekliyoruz!');
                        setPostLocation('G Blok Konferans Salonu');
                      }, 1000);
                    }}
                    className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition flex items-center gap-1.5 border border-emerald-200 shadow-sm"
                  >
                    <Check size={14} /> AI ile Oluştur
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Gönderi Başlığı</label>
                  <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="Örn: Yeni Dönem Tanışma Toplantısı!" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">İçerik</label>
                  <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none" placeholder="Öğrencilerle paylaşmak istediğiniz mesajınızı yazın..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1"><MapPin size={12}/> Konum (Opsiyonel)</label>
                    <input type="text" value={postLocation} onChange={(e) => setPostLocation(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="Örn: C Blok Konferans Salonu" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 flex items-center gap-1"><ImageIcon size={12}/> Görsel URL (Opsiyonel)</label>
                    <input type="url" value={postImage} onChange={(e) => setPostImage(e.target.value)} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="https://..." />
                  </div>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 mt-2 hover:-translate-y-0.5">
                  <Send size={18} /> Paylaş
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
