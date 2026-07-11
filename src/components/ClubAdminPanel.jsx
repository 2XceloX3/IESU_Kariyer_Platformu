import React, { useState } from 'react';
import { Crown, Users, FileText, Send, CheckCircle, XCircle, Shield, UserPlus, Target } from 'lucide-react';
import PostComposer from './PostComposer';

export default function ClubAdminPanel({ currentUser, clubs, setClubs, posts, setPosts, setView, overrideClubId }) {
  const managedClubs = overrideClubId 
    ? (clubs || []).filter(c => c.id === overrideClubId)
    : (clubs || []).filter(c => c.presidentId === currentUser?.id || (c.admins || []).includes(currentUser?.id));
  const [selectedClubId, setSelectedClubId] = useState(managedClubs[0]?.id);
  const [activeTab, setActiveTab] = useState('requests');

  if (managedClubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <Target size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Yetkiniz Yok</h2>
        <p className="text-gray-500 max-w-md">Herhangi bir kulüpte yönetici yetkisine sahip değilsiniz.</p>
        <button onClick={() => setView('landing')} className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold">Ana Sayfaya Dön</button>
      </div>
    );
  }

  const selectedClub = managedClubs.find(c => c.id === selectedClubId) || managedClubs[0];

  const handleAcceptRequest = (req) => {
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        const newMembers = [...(c.members || []), req];
        const newRequests = (c.joinRequests || []).filter(r => r.id !== req.id);
        return { ...c, members: newMembers, joinRequests: newRequests, memberCount: (c.memberCount || 0) + 1 };
      }
      return c;
    });
    setClubs(updatedClubs);
  };

  const handleRejectRequest = (reqId) => {
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        const newRequests = (c.joinRequests || []).filter(r => r.id !== reqId);
        return { ...c, joinRequests: newRequests };
      }
      return c;
    });
    setClubs(updatedClubs);
  };

  const handleToggleAdmin = (memberId) => {
    // Only president can toggle admin status
    if (selectedClub.presidentId !== currentUser?.id) {
      alert("Sadece Kulüp Başkanı admin yetkisi verebilir.");
      return;
    }
    
    const updatedClubs = clubs.map(c => {
      if (c.id === selectedClub.id) {
        let newAdmins = [...(c.admins || [])];
        if (newAdmins.includes(memberId)) {
          newAdmins = newAdmins.filter(id => id !== memberId);
        } else {
          newAdmins.push(memberId);
        }
        return { ...c, admins: newAdmins };
      }
      return c;
    });
    setClubs(updatedClubs);
  };

  const isPresident = selectedClub.presidentId === currentUser?.id;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <img src={selectedClub.logo} alt={selectedClub.name} className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white object-cover" />
          <div>
            <h1 className="text-2xl font-black text-gray-900">{selectedClub.name}</h1>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              <Crown size={14} /> {overrideClubId ? 'Süper Admin Paneli' : (isPresident ? 'Kulüp Başkanı' : 'Kulüp Yöneticisi Paneli')}
            </p>
          </div>
        </div>
        
        {managedClubs.length > 1 && (
          <select 
            value={selectedClubId} 
            onChange={(e) => setSelectedClubId(e.target.value)}
            className="p-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {managedClubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-100 mb-6 overflow-x-auto hide-scrollbar w-full">
        <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'requests' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          <UserPlus size={16}/> Katılım İstekleri
          {(selectedClub.joinRequests?.length > 0) && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{selectedClub.joinRequests.length}</span>
          )}
        </button>
        <button onClick={() => setActiveTab('members')} className={`whitespace-nowrap py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'members' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          <Users size={16}/> Üyeler ve Yetkiler
        </button>
        <button onClick={() => setActiveTab('documents')} className={`whitespace-nowrap py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'documents' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          <FileText size={16}/> Belge Deposu
        </button>
        <button onClick={() => setActiveTab('post')} className={`whitespace-nowrap py-3 px-4 font-bold text-sm border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'post' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
          <Send size={16}/> Gönderi Paylaş
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--border-soft)]">
        
        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <UserPlus className="text-emerald-500" /> Bekleyen Katılım Talepleri
            </h3>
            
            {(!selectedClub.joinRequests || selectedClub.joinRequests.length === 0) ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <Target size={48} className="text-gray-300 mx-auto mb-3" />
                <h4 className="text-gray-500 font-bold">Bekleyen istek yok.</h4>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedClub.joinRequests.map(req => (
                  <div key={req.id} className="p-5 border border-gray-100 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-50/30 hover:bg-white transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-[15px]">{req.userName}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{req.department}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 bg-white p-3 rounded-xl border border-gray-100">
                        "{req.motivation}"
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold mt-2">{req.date} tarihinde başvurdu.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto shrink-0 mt-3 md:mt-0">
                      <button onClick={() => handleAcceptRequest(req)} className="w-full md:w-auto px-4 py-2 bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Kabul Et
                      </button>
                      <button onClick={() => handleRejectRequest(req.id)} className="w-full md:w-auto px-4 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                        <XCircle size={16} /> Reddet
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
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Users className="text-emerald-500" /> Üyeler ve Yönetim Kadrosu
            </h3>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-800 font-medium flex items-start gap-3">
              <Shield className="shrink-0 text-blue-500" size={20} />
              <p>Kulüp başkanı olarak üyelerinize "Yönetici" yetkisi verebilirsiniz. Yöneticiler, katılım isteklerini onaylayabilir ve kulüp adına gönderi paylaşabilir.</p>
            </div>

            {(!selectedClub.members || selectedClub.members.length === 0) ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <Users size={48} className="text-gray-300 mx-auto mb-3" />
                <h4 className="text-gray-500 font-bold">Henüz onaylanmış üye bulunmuyor.</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedClub.members.map(member => {
                  const isMemberAdmin = (selectedClub.admins || []).includes(member.userId);
                  
                  return (
                    <div key={member.id} className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between bg-white hover:border-gray-200 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate flex items-center gap-1.5">
                          {member.userName} 
                          {isMemberAdmin && <Crown size={14} className="text-amber-500 shrink-0" title="Yönetici"/>}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{member.department}</p>
                      </div>
                      
                      {isPresident && (
                        <button 
                          onClick={() => handleToggleAdmin(member.userId)}
                          className={`ml-3 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isMemberAdmin ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {isMemberAdmin ? 'Yetkiyi Al' : 'Yönetici Yap'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* POST TAB */}
        {activeTab === 'post' && (
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <Send className="text-emerald-500" /> Kulüp Adına Gönderi/Etkinlik Paylaş
            </h3>
            
            <div className="bg-gray-50/50 p-1 rounded-[1.8rem] border border-gray-100">
              <PostComposer currentUser={currentUser} userRole="club" posts={posts} setPosts={setPosts} asClub={selectedClub} />
            </div>
            
            <p className="text-xs text-gray-400 font-medium text-center mt-4">
              Paylaştığınız gönderiler ana sayfadaki tüm öğrencilerin akışında, kulübünüzün logosu ve ismiyle (Onaylı Kulüp rozetiyle) anında yayınlanacaktır.
            </p>
          </div>
        )}
        
        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="text-emerald-500" /> Kulüp Belge Deposu
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* İndirilebilir Formlar */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4">Gerekli Formlar (Boş PDF)</h4>
                <div className="space-y-3">
                  {['Kulüp Kurulum Formu', 'Genel Kurul Tutanağı', 'Etkinlik Başvuru Formu', 'Sponsorluk Anlaşması', 'Faaliyet Raporu'].map((formName, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-emerald-600" />
                        <span className="text-sm font-bold text-gray-800">{formName}</span>
                      </div>
                      <button className="text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">İndir</button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Belge Yükleme Alanı */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <h4 className="font-bold text-gray-900 mb-4">Doldurulmuş Belge Yükle</h4>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const docType = formData.get('docType');
                    const fileInput = e.target.elements.fileInput;
                    
                    if (fileInput.files.length === 0) {
                      alert("Lütfen yüklemek için bir PDF dosyası seçin.");
                      return;
                    }
                    
                    const newForm = {
                      id: 'FORM-' + Date.now(),
                      type: docType,
                      status: 'Bekliyor',
                      date: new Date().toLocaleDateString('tr-TR')
                    };
                    
                    const updatedClubs = clubs.map(c => {
                      if (c.id === selectedClub.id) {
                        return { ...c, forms: [...(c.forms || []), newForm] };
                      }
                      return c;
                    });
                    
                    setClubs(updatedClubs);
                    e.target.reset();
                    alert("Belge başarıyla Öğrenci Dekanlığı iç havuzuna iletildi!");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Belge Türü</label>
                    <select name="docType" required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500">
                      <option value="Kulüp Kurulum Formu">Kulüp Kurulum Formu</option>
                      <option value="Genel Kurul Tutanağı">Genel Kurul Tutanağı</option>
                      <option value="Etkinlik Başvuru Formu">Etkinlik Başvuru Formu</option>
                      <option value="Sponsorluk Anlaşması">Sponsorluk Anlaşması</option>
                      <option value="Faaliyet Raporu">Faaliyet Raporu</option>
                      <option value="Diğer (Dilekçe)">Diğer (Dilekçe)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">PDF Dosyası Seç</label>
                    <input type="file" name="fileInput" accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                  </div>
                  
                  <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors mt-2">
                    Belgeyi Yükle ve Gönder
                  </button>
                </form>
              </div>
            </div>
            
            {/* Gönderilen Belgeler */}
            <div className="mt-8">
              <h4 className="font-bold text-gray-900 mb-4">Sisteme Yüklenmiş Belgeleriniz</h4>
              {(!selectedClub.forms || selectedClub.forms.length === 0) ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                  <p className="text-sm text-gray-500">Henüz dekanlığa iletilmiş bir belgeniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedClub.forms.map(form => (
                    <div key={form.id} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between group hover:border-emerald-200 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{form.type}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">{form.date} - Dekanlığa İletildi</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${form.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : form.status === 'Bekliyor' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {form.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}
