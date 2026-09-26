import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SubPanelFooter from './SubPanelFooter';
import AdminOmniDock from './AdminOmniDock';
import SafeAvatar from './shared/SafeAvatar';
import { 
  Users, Megaphone, Calendar, ShieldCheck, Plus, CheckCircle2, XCircle, 
  Trash2, UserPlus, Eye, MessageSquare, Award, Clock, ArrowRight, Lock, 
  ChevronRight, Sparkles, Building, Phone, Mail, FileText, Send, Search, Bell, Star
} from 'lucide-react';

export default function AlumniAssocPortal({ setView, currentUser, userRole, setSelectedUserId, academicRole }) {
  const alumniAssocBoard = useAppStore(state => state.alumniAssocBoard) || [];
  const setAlumniAssocBoard = useAppStore(state => state.setAlumniAssocBoard);
  const alumniAssocApplications = useAppStore(state => state.alumniAssocApplications) || [];
  const setAlumniAssocApplications = useAppStore(state => state.setAlumniAssocApplications);
  const announcements = useAppStore(state => state.announcements) || [];
  const setAnnouncements = useAppStore(state => state.setAnnouncements);
  const events = useAppStore(state => state.events) || [];
  const setEvents = useAppStore(state => state.setEvents);
  const notifications = useAppStore(state => state.notifications) || [];
  const logAction = useAppStore(state => state.logAction);

  const [activeTab, setActiveTab] = useState('board'); // board, applications, announce, events, team_management
  const [newAnnounce, setNewAnnounce] = useState({ title: '', content: '', imageUrl: '' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', description: '', imageUrl: '' });
  const [newMember, setNewMember] = useState({ name: '', role: '', email: '', phone: '' });

  const readImageFile = (file, onLoad) => {
    if (!file || !file.type.startsWith('image/')) {
      window.toast?.error('Lütfen geçerli bir görsel dosyası seçin.');
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target?.result === 'string') onLoad(event.target.result);
    };
    reader.onerror = () => window.toast?.error('Görsel okunamadı. Lütfen tekrar deneyin.');
    reader.readAsDataURL(file);
  };

  // Authorization check
  const isSuperAdmin = userRole === 'admin' || currentUser?.role === 'admin';
  const isBoardMember = (alumniAssocBoard || []).some(m => 
    m.email === currentUser?.email || m.name === currentUser?.name
  );

  const hasAccess = isSuperAdmin || isBoardMember;

  const handleApproveApp = (appId) => {
    setAlumniAssocApplications(
      (alumniAssocApplications || []).map(a => a.id === appId ? { ...a, status: 'Onaylandı' } : a)
    );
    logAction?.(currentUser?.name || 'Dernek Yöneticisi', `Mezun Derneği Başvurusu Onaylandı (ID: ${appId})`, 'Mezun Derneği');
  };

  const handleRejectApp = (appId) => {
    setAlumniAssocApplications(
      (alumniAssocApplications || []).map(a => a.id === appId ? { ...a, status: 'Reddedildi' } : a)
    );
    logAction?.(currentUser?.name || 'Dernek Yöneticisi', `Mezun Derneği Başvurusu Reddedildi (ID: ${appId})`, 'Mezun Derneği');
  };

  const handleCreateAnnounce = (e) => {
    e.preventDefault();
    if (!newAnnounce.title || !newAnnounce.content) return;
    const created = {
      id: `ann-assoc-${Date.now()}`,
      title: `[MEZUN DERNEĞİ] ${newAnnounce.title}`,
      content: newAnnounce.content,
      imageUrl: newAnnounce.imageUrl,
      date: new Date().toLocaleDateString('tr-TR'),
      category: 'Mezun Derneği',
      publisher: currentUser?.name || 'Mezun Derneği Yönetimi'
    };
    setAnnouncements(current => [created, ...(current || [])]);
    setNewAnnounce({ title: '', content: '', imageUrl: '' });
    if (window.toast?.success) window.toast.success('Duyuru başarıyla yayınlandı ve platform akışına eklendi!');
    else alert('Duyuru başarıyla yayınlandı ve platform akışına eklendi!');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    const created = {
      id: `evt-assoc-${Date.now()}`,
      title: `[MEZUN DERNEĞİ] ${newEvent.title}`,
      date: newEvent.date,
      time: newEvent.time || '14:00',
      location: newEvent.location || 'Esenyurt Üniversitesi Kampüsü / Online',
      description: newEvent.description,
      imageUrl: newEvent.imageUrl,
      status: 'Aktif',
      category: 'Mezun Derneği'
    };
    setEvents(current => [created, ...(current || [])]);
    setNewEvent({ title: '', date: '', time: '', location: '', description: '', imageUrl: '' });
    if (window.toast?.success) window.toast.success('Etkinlik başarıyla oluşturuldu ve etkinlikler listesine yayınlandı!');
    else alert('Etkinlik başarıyla oluşturuldu ve etkinlikler listesine yayınlandı!');
  };

  const handleAddBoardMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;
    const created = {
      id: `MEMBER-${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      email: newMember.email || 'mezun@esenyurt.edu.tr',
      phone: newMember.phone || '444 9 123'
    };
    setAlumniAssocBoard([...(alumniAssocBoard || []), created]);
    setNewMember({ name: '', role: '', email: '', phone: '' });
    if (window.toast?.success) window.toast.success(`${newMember.name} kişisine Mezun Derneği Yönetici yetkisi başarıyla tanımlandı!`);
    else alert(`${newMember.name} kişisine Mezun Derneği Yönetici yetkisi başarıyla tanımlandı!`);
  };

  const handleRemoveBoardMember = (memberId) => {
    if (confirm('Bu üyenin dernek yönetim yetkisini kaldırmak istediğinize emin misiniz?')) {
      setAlumniAssocBoard((alumniAssocBoard || []).filter(m => m.id !== memberId));
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
          <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
              const store = useAppStore.getState();
              if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
              setView('alumni');
            }}>
              <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
              <div className="hidden sm:block text-left">
                <h1 className="text-[13px] font-black text-[#059669] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Portalı & Dernek Paneli</p>
              </div>
            </div>
            <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />
          </div>
        </nav>
        <main className="flex-1 w-full max-w-xl mx-auto p-8 pt-32 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Erişim Yetkisi Sınırlı</h2>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Mezun Derneği Özel Yönetim Portalı sadece yetkili dernek yönetim kurulu üyeleri ve koordinatörlük yöneticilerine açıktır.
          </p>
          <button 
            onClick={() => setView('mezun_dernek')}
            className="px-6 py-3 bg-[#059669] text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shadow-md cursor-pointer"
          >
            Mezun Derneği Kamusal Akışına Dön →
          </button>
        </main>
        <SubPanelFooter setView={setView} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* FULL STANDARD WHITE NAVBAR MATCHING ALUMNI FEED */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            const store = useAppStore.getState();
            if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
            setView('alumni');
          }}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#059669] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Portalı & Dernek Paneli</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-emerald-50 text-[#059669]`} title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-[#059669]/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />
          </div>
        </div>
      </nav>

      <div className="pt-20"></div>

      <main className="flex-1 w-full max-w-[1300px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-teal-950 via-[#059669] to-emerald-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 z-10 max-w-2xl">
            <span className="bg-emerald-800/80 text-emerald-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-700">
              ÖZEL YÖNETİM & AKIŞ KONTROL PORTALI
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              İstanbul Esenyurt Üniversitesi Mezunlar Derneği
            </h1>
            <p className="text-emerald-100 text-sm font-medium">
              Yetkili Yönetici: <strong>{currentUser?.name || 'Yönetim Kurulu Üyesi'}</strong> — Duyuru, etkinlik yayınlama ve üyelik havuzu yönetimi.
            </p>
          </div>
          <button 
            onClick={() => setView('mezun_dernek')}
            className="z-10 bg-white text-[#059669] font-black text-xs px-5 py-3 rounded-2xl hover:bg-emerald-50 transition shadow-lg whitespace-nowrap cursor-pointer"
          >
            Kamuya Açık Dernek Sayfasını Gör →
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'board', label: 'Yönetim Kurulu & Ekip', icon: <Users size={16} /> },
            { id: 'applications', label: `Üyelik Başvuruları (${(alumniAssocApplications || []).filter(a => a.status === 'Beklemede').length})`, icon: <FileText size={16} /> },
            { id: 'announce', label: 'Duyuru Yayınla', icon: <Megaphone size={16} /> },
            { id: 'events', label: 'Etkinlik Yayınla', icon: <Calendar size={16} /> },
            { id: 'team_management', label: 'Yetki Tanımlama', icon: <ShieldCheck size={16} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === t.id 
                  ? 'bg-[#059669] text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: YÖNETİM KURULU */}
        {activeTab === 'board' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Mezun Derneği Yönetim Kurulu Üyeleri</h3>
              <p className="text-xs font-semibold text-slate-500">
                Sistem genelinde duyuru ve etkinlik paylaşma yetkisine sahip aktif dernek kadrosu.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(alumniAssocBoard || []).map((m) => (
                <div key={m.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#059669] bg-emerald-100 px-2 py-0.5 rounded-md">
                      {m.role}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">{m.name}</h4>
                    <p className="text-xs font-medium text-slate-500">{m.email}</p>
                    <p className="text-[11px] text-slate-400">{m.phone}</p>
                  </div>
                  {isSuperAdmin && (
                    <button 
                      onClick={() => setAlumniAssocBoard((alumniAssocBoard || []).filter(item => item.id !== m.id))}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Yetkiyi Kaldır"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ÜYELİK & EKİP BAŞVURULARI HAVUZU */}
        {activeTab === 'applications' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Gelen Dernek Başvuruları Havuzu</h3>
              <p className="text-xs font-semibold text-slate-500">
                Açılan dönemlerde mezunlardan ve öğrencilerden gelen üyelik veya yönetim ekibi başvuruları.
              </p>
            </div>
            {(alumniAssocApplications || []).length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText size={40} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-bold text-slate-600">Henüz kaydedilmiş başvuru bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-100 text-slate-700 font-black uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Başvuran</th>
                      <th className="p-4">Başvuru Tipi</th>
                      <th className="p-4">Bölüm & Mezuniyet</th>
                      <th className="p-4">İletişim</th>
                      <th className="p-4">Tarih</th>
                      <th className="p-4">Durum</th>
                      <th className="p-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {(alumniAssocApplications || []).map(app => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-4 font-black text-slate-900">{app.name}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                            app.type === 'Yönetim Ekibi Adaylığı' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {app.type}
                          </span>
                        </td>
                        <td className="p-4">{app.department} ({app.graduationYear})</td>
                        <td className="p-4">{app.email} / {app.phone}</td>
                        <td className="p-4">{app.appliedAt}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                            app.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'Reddedildi' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {app.status === 'Beklemede' && (
                            <>
                              <button 
                                onClick={() => handleApproveApp(app.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Onayla
                              </button>
                              <button 
                                onClick={() => handleRejectApp(app.id)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Reddet
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DUYURU YAYINLAMA (AFİŞ YÜKLEME & SAĞ CANLI ÖN İZLEME PANELİ) */}
        {activeTab === 'announce' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Mezun Derneği Duyurusu Paylaş</h3>
              <p className="text-xs font-semibold text-slate-500">
                Burada yayınladığınız duyurular ana akışta "Mezun Derneği" etiketiyle tüm kullanıcılara gösterilir.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* SOL FORM */}
              <form onSubmit={handleCreateAnnounce} className="lg:col-span-3 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duyuru Başlığı</label>
                  <input 
                    type="text"
                    value={newAnnounce.title}
                    onChange={(e) => setNewAnnounce({ ...newAnnounce, title: e.target.value })}
                    placeholder="Örn: 2026 Olağan Genel Kurul Toplantısı ve Network Buluşması"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Afiş / Görsel Görsel Yükle (İsteğe Bağlı)</label>
                  {!newAnnounce.imageUrl ? (
                    <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                      <Plus size={20} className="text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-600">Afiş Seçmek İçin Tıklayın</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            readImageFile(e.target.files[0], imageUrl => setNewAnnounce(current => ({ ...current, imageUrl })));
                          }
                        }} 
                      />
                    </label>
                  ) : (
                    <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      <img src={newAnnounce.imageUrl} alt="Afiş" className="w-full h-full object-contain" />
                      <button 
                        type="button" 
                        onClick={() => setNewAnnounce({ ...newAnnounce, imageUrl: '' })}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full text-xs font-bold shadow cursor-pointer"
                      >
                        Kaldır
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duyuru Detayı ve Açıklaması</label>
                  <textarea 
                    rows={5}
                    value={newAnnounce.content}
                    onChange={(e) => setNewAnnounce({ ...newAnnounce, content: e.target.value })}
                    placeholder="Duyuru içeriğini detaylıca yazınız..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-800 via-[#059669] to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send size={16} /> Duyuruyu Akışa Yay
                </button>
              </form>

              {/* SAĞ CANLI ÖN İZLEME */}
              <div className="lg:col-span-2 sticky top-24 space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#059669]" /> Canlı Duyuru Ön İzlemesi
                </span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <SafeAvatar
                      src={currentUser?.avatar}
                      name={currentUser?.name || 'Mezun'}
                      size="md"
                      alt="Profil"
                      className="border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{currentUser?.name || 'Mezun Derneği'}</h4>
                      <span className="text-[9px] font-bold text-[#059669] bg-emerald-100 px-1.5 py-0.5 rounded">Resmî Duyuru</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{newAnnounce.title || 'Duyuru Başlığı Burada Görünecek'}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {newAnnounce.content || 'Duyuru metni buraya yazdıkça canlı olarak ön izlemede güncellenecektir.'}
                  </p>
                  {newAnnounce.imageUrl && (
                    <div className="rounded-xl overflow-hidden max-h-48 border border-slate-200">
                      <img src={newAnnounce.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ETKİNLİK YAYINLAMA (AFİŞ YÜKLEME & SAĞ CANLI ÖN İZLEME PANELİ) */}
        {activeTab === 'events' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Mezun Derneği Etkinliği Oluştur</h3>
              <p className="text-xs font-semibold text-slate-500">
                Mezunlar ve öğrenciler için özel organizasyon ve buluşma etkinlikleri tanımlayın.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* SOL FORM */}
              <form onSubmit={handleCreateEvent} className="lg:col-span-3 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Etkinlik Adı</label>
                  <input 
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Örn: Mühendislik Mezunları Zirvesi & Kokteyl"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Tarih</label>
                    <input 
                       type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Saat</label>
                    <input 
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="14:00"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mekân / Yer</label>
                  <input 
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Prof. Dr. Fuat Sezgin Konferans Salonu"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Etkinlik Afişi / Görsel Yükle (İsteğe Bağlı)</label>
                  {!newEvent.imageUrl ? (
                    <label className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition">
                      <Plus size={20} className="text-slate-400 mb-1" />
                      <span className="text-xs font-bold text-slate-600">Etkinlik Afişi Seçmek İçin Tıklayın</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            readImageFile(e.target.files[0], imageUrl => setNewEvent(current => ({ ...current, imageUrl })));
                          }
                        }} 
                      />
                    </label>
                  ) : (
                    <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                      <img src={newEvent.imageUrl} alt="Etkinlik Afişi" className="w-full h-full object-contain" />
                      <button 
                        type="button" 
                        onClick={() => setNewEvent({ ...newEvent, imageUrl: '' })}
                        className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full text-xs font-bold shadow cursor-pointer"
                      >
                        Kaldır
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Açıklama</label>
                  <textarea 
                    rows={4}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Etkinlik hakkında detaylar..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-800 via-[#059669] to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Calendar size={16} /> Etkinliği Yayınla
                </button>
              </form>

              {/* SAĞ CANLI ÖN İZLEME */}
              <div className="lg:col-span-2 sticky top-24 space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#059669]" /> Canlı Etkinlik Kartı Ön İzlemesi
                </span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#059669] bg-emerald-100 px-2 py-0.5 rounded">
                      {newEvent.date || 'Tarih Girilmedi'} — {newEvent.time || '14:00'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{newEvent.location || 'Mekân Girilmedi'}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{newEvent.title || 'Etkinlik Adı Burada Görünecek'}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {newEvent.description || 'Etkinlik açıklaması yazdıkça burada anlık olarak ön izlenecektir.'}
                  </p>
                  {newEvent.imageUrl && (
                    <div className="rounded-xl overflow-hidden max-h-48 border border-slate-200">
                      <img src={newEvent.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: YETKİ TANIMLAMA */}
        {activeTab === 'team_management' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Dernek Yönetim Kuruluna Yeni Üye / Yetkili Ekle</h3>
              <p className="text-xs font-semibold text-slate-500">
                Ekibinize yeni bir mezun ekleyerek dernek portalına erişim yetkisi tanımlayabilirsiniz.
              </p>
            </div>
            <form onSubmit={handleAddBoardMember} className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ad Soyad</label>
                <input 
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Örn: Dr. Caner ŞAHİN"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dernek Rolü / Unvanı</label>
                <input 
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Örn: Basın ve İletişim Sorumlusu"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">E-posta Adresi</label>
                <input 
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="caner@esenyurt.edu.tr"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#059669] outline-none"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-800 via-[#059669] to-teal-700 hover:from-emerald-900 hover:to-teal-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                <UserPlus size={16} /> Dernek Yetkisi Ver
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Floating Bottom Navigation Dock for easy return to main feed (Emerald Theme) */}
      <AdminOmniDock setView={setView} activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} setSelectedUserId={setSelectedUserId} theme="emerald" />

      <SubPanelFooter setView={setView} />
    </div>
  );
}
