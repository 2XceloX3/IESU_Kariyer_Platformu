import React, { useState, useMemo } from 'react';
import { Search, Bell, Briefcase, Bookmark, Plus, Users, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, FileText, Home, Radar, Target, UserCheck, ChevronRight, MessageCircle, MessageSquare, ChevronDown, ChevronUp, Compass, Heart, X, MoreHorizontal, BarChart2 } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { combineFeedItems } from '../utils/feedCombiner';
import CareerNetwork from './CareerNetwork';
import NavIcon from './shared/NavIcon';
import MessagingInterface from './MessagingInterface';

import useAppStore from '../store/useAppStore';

export default function AcademicStaffFeed({ 
  setView, setSelectedUserId, currentUser, userRole, academicRole
}) {
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const news = useAppStore(state => state.news);
  const events = useAppStore(state => state.events);
  const announcements = useAppStore(state => state.announcements);
  const jobs = useAppStore(state => state.jobs);
  const students = useAppStore(state => state.students);
  const setStudents = useAppStore(state => state.setStudents);
  const alumni = useAppStore(state => state.alumni);
  const academicStaff = useAppStore(state => state.academicStaff);
  const surveys = useAppStore(state => state.surveys);
  const groups = useAppStore(state => state.groups);
  const academicApprovals = useAppStore(state => state.academicApprovals);
  const setAcademicApprovals = useAppStore(state => state.setAcademicApprovals);
  const notifications = useAppStore(state => state.notifications);
  const setNotifications = useAppStore(state => state.setNotifications);
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);
  const setAdminMessages = useAppStore(state => state.setAdminMessages);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, approvals, radar, messaging
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internships, setInternships] = useState([]);
  const [approvals, setApprovals] = useState(academicApprovals || []);
  const adminMessages = useAppStore(state => state.adminMessages);
  const [showAdminMsgModal, setShowAdminMsgModal] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState('new'); // 'new' | 'history'
  const [adminMsgForm, setAdminMsgForm] = useState({ 
    subject: 'Akademik Kontenjan & Protokol Talebi', 
    message: '',
    priority: 'Normal',
    fileName: ''
  });

  const stats = useMemo(() => ({
    totalStudents: 450,
    activeInterns: 124,
    pendingApprovals: internships.filter(i => i.status === 'Onay Bekliyor').length + approvals.filter(a => a.status === 'Beklemede').length
  }), [internships, approvals]);

  const handleApproveInternship = (id) => {
    setInternships(internships.map(i => i.id === id ? { ...i, status: 'Onaylandı' } : i));
  };



  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 relative">
      
      {/* Hyper-Modern Navbar (Glassmorphism) - ALIGNED WITH STUDENT FEED */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-10"></div> {/* Spacer */}
          
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer" onClick={() => {
            const currentRole = currentUser?.role || userRole;
            setView(currentRole === 'admin' ? 'admin' : (currentRole === 'employer' || currentRole === 'company') ? 'company' : currentRole === 'alumni' ? 'alumni' : currentRole === 'academic' ? 'academic' : 'student');
          }}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" /><div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-[#990000]`} title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-[#990000]/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Akademik Personel', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Akademik Personel')}&background=0A2342&color=fff` }} userRole={userRole || 'academic'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="academic" />
          </div>
        </div>
      </nav>

      {/* Main Content Area (ORİJİNAL 3 SÜTUNLU DÜZEN) */}
      <main className="max-w-[1400px] mx-auto px-4 pt-24 pb-16 flex flex-col md:flex-row gap-6 relative justify-center items-start">
        
        {/* LEFT PANEL: Profile Mini-Card (SOLA GERİ ALINDI) */}
        <div className="hidden md:block w-[300px] shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden text-center">
            <div className="h-24 bg-[#990000] absolute top-0 left-0 w-full"></div>
            <div className="relative pt-8 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center p-1 mb-3">
                {userRole === 'admin' ? (
                  <img src="/iesu-logo.svg" alt="Admin Logo" className="w-full h-full object-contain" />
                ) : (
                  <img 
                    src={currentUser?.avatar || '/iesu-logo.svg'} 
                    onError={(e) => { e.target.onerror = null; e.target.src = '/iesu-logo.svg'; }}
                    className="w-full h-full object-cover rounded-xl" 
                    alt="Profile" 
                  />
                )}
              </div>
              
              <h2 className="text-base font-black text-gray-900 leading-tight">
                {userRole === 'admin' ? 'Kariyer Geliştirme Merkezi' : currentUser?.name || 'Akademik Personel'}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {userRole === 'admin' ? 'SÜPER YÖNETİCİ' : `${currentUser?.title || 'Bölüm Başkanı'} / ${currentUser?.department || 'Bilgisayar Mühendisliği'}`}
              </p>

              {/* Öğrenci & Stajyer Sayıları */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center w-full mt-6">
                <div>
                  <p className="text-xl font-black text-red-600">{stats.totalStudents}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">ÖĞRENCİ</p>
                </div>
                <div className="border-l border-slate-200">
                  <p className="text-xl font-black text-emerald-600">{stats.activeInterns}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">STAJYER</p>
                </div>
              </div>

              <button 
                onClick={() => setIsRadarOpen(!isRadarOpen)} 
                className="mt-6 w-full py-3 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Radar size={15} /> Radar & İstatistikler
              </button>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Feed & Welcome */}
        <div className="w-full md:flex-1 max-w-[600px] shrink-0 space-y-6">
          
          {/* Welcome Header (Orijinal İlk Fotoğraftaki Kart) */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900 mb-1">
                Hoş Geldiniz, {userRole === 'admin' ? 'Kariyer Geliştirme Merkezi' : currentUser?.name || 'Akademik Personel'}
              </h1>
              <p className="text-xs text-slate-500 font-medium">Bekleyen işlemleriniz ve onay havuzunuz.</p>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-2xl text-center border border-red-100 shrink-0">
              <div className="text-lg font-black text-red-600">{stats.pendingApprovals}</div>
              <div className="text-[10px] font-bold text-red-700 uppercase">Onay Bekliyor</div>
            </div>
          </div>

        {/* --- KIRMZII RADAR & AKADEMİK YÖNETİM PANELİ (GELİŞTİRİLDİ) --- */}
        {isRadarOpen && (
          <div className="mb-8 animate-fade-in bg-white rounded-2xl p-6 shadow-xl border-2 border-red-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7A0000] to-red-600 flex items-center justify-center text-white shadow-md">
                  <Radar size={26} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 leading-tight">Akademik Radar & Onay Yönetim Merkezi</h2>
                  <p className="text-xs text-gray-500 font-medium">Bölüm stajyer takip radarı, onay havuzu ve istatistik analitiği</p>
                </div>
              </div>
            </div>

            {/* Nav Tabs (Rozet Merkezi Kaldırıldı) */}
            <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar border-b border-gray-100">
              {[
                { id: 'approvals', label: `Onay Havuzu (${stats.pendingApprovals})`, icon: <FileText size={15} /> },
                { id: 'radar', label: 'Stajyer Radarı & Canlı Takip', icon: <Radar size={15} /> },
                { id: 'dashboard', label: 'Bölüm Analitiği & İstihdam', icon: <BarChart2 size={15} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#990000] text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="pt-5">
              
              {/* 1. ONAY HAVUZU */}
              {activeTab === 'approvals' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#990000]" /> Bekleyen Staj & Evrak Onayları
                    </h3>
                    <span className="text-xs font-bold text-gray-500">Toplam {stats.pendingApprovals} Talep</span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'app_1', name: 'Ahmet Yılmaz', no: '220401015', type: 'Zorunlu Yaz Stajı (30 Gün)', company: 'Aselsan A.Ş.', status: 'Onay Bekliyor', date: 'Bugün, 14:30' },
                      { id: 'app_2', name: 'Elif Kaya', no: '210401088', type: 'Aday Mühendislik Protokolü', company: 'Baykar Teknoloji', status: 'Onay Bekliyor', date: 'Dün, 09:15' },
                      { id: 'app_3', name: 'Canberk Demir', no: '220401102', type: 'Çift Anadal (ÇAP) Başvurusu', company: 'Yazılım Mühendisliği', status: 'Onay Bekliyor', date: '28 Temmuz' }
                    ].map(item => (
                      <div key={item.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-red-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-red-100 text-[#990000] font-black flex items-center justify-center text-sm shrink-0">
                            {item.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                              <span className="text-[10px] font-bold text-gray-400">({item.no})</span>
                            </div>
                            <p className="text-xs font-medium text-gray-600 mt-0.5">{item.company} • <span className="font-bold text-[#990000]">{item.type}</span></p>
                            <span className="text-[10px] text-gray-400 mt-1 inline-block">Talep Tarihi: {item.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button 
                            onClick={() => {
                              window.toast?.info(`${item.name} başvuru dosyası inceleniyor...`);
                            }}
                            className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition"
                          >
                            Evrakı İncele
                          </button>
                          <button 
                            onClick={() => {
                              window.toast?.success(`${item.name} staj başvurusu başarıyla onaylandı!`);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 size={15} /> Onayla
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. STAJYER RADARI (CANLI TAKİP TABLOSU) */}
              {activeTab === 'radar' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                      <Radar size={18} className="text-[#990000]" /> Bölüm Öğrencileri Canlı Staj Radarı
                    </h3>
                    <div className="relative">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Öğrenci veya firma ara..." 
                        className="bg-slate-100 text-xs font-medium pl-9 pr-4 py-2 rounded-xl outline-none border border-transparent focus:border-red-300 w-full sm:w-56"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-gray-700 font-black uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3.5">Öğrenci</th>
                          <th className="p-3.5">Firma / Kurum</th>
                          <th className="p-3.5">Staj Türü</th>
                          <th className="p-3.5">Devam Durumu</th>
                          <th className="p-3.5 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {[
                          { name: 'Zeynep Yılmaz', no: '210401012', company: 'Trendyol Tech', type: 'Zorunlu Yaz Stajı', status: 'Aktif Devam Ediyor', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                          { name: 'Mehmet Ali Kaya', no: '210401045', company: 'Aselsan A.Ş.', type: 'Aday Mühendislik', status: 'Rapor Bekleniyor', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
                          { name: 'Ayşe Şahin', no: '220401077', company: 'Turkcell Teknoloji', type: 'İsteğe Bağlı Staj', status: 'Tamamlandı', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
                          { name: 'Burak Öztürk', no: '220401090', company: 'HAVELSAN', type: 'Zorunlu Staj', status: 'Aktif Devam Ediyor', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition">
                            <td className="p-3.5 font-bold text-gray-900">
                              {row.name}
                              <span className="block text-[10px] text-gray-400 font-normal">{row.no}</span>
                            </td>
                            <td className="p-3.5 font-semibold text-gray-700">{row.company}</td>
                            <td className="p-3.5 text-gray-600">{row.type}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${row.statusColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button 
                                onClick={() => window.toast?.info(`${row.name} detay karnesi açılıyor.`)}
                                className="px-3 py-1.5 bg-red-50 hover:bg-[#990000] hover:text-white text-[#990000] font-bold rounded-lg transition"
                              >
                                Karnesi
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. BÖLÜM ANALİTİĞİ & İSTİHDAM GRAFİKLERİ */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
                      <p className="text-[11px] font-black text-red-600 uppercase tracking-wider">Mezun İstihdam Oranı</p>
                      <p className="text-3xl font-black text-gray-900 mt-1">%88.4</p>
                      <p className="text-[10px] font-semibold text-emerald-600 mt-1">↑ İlk 6 ayda işe yerleşme</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                      <p className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Aktif Staj Yapanlar</p>
                      <p className="text-3xl font-black text-gray-900 mt-1">124 Öğrenci</p>
                      <p className="text-[10px] font-semibold text-gray-500 mt-1">Bölüm mevcudunun %27'si</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <p className="text-[11px] font-black text-blue-700 uppercase tracking-wider">Anlaşmalı Kurum Sayısı</p>
                      <p className="text-3xl font-black text-gray-900 mt-1">42 Firma</p>
                      <p className="text-[10px] font-semibold text-blue-600 mt-1">Resmi Protokollü Kontenjan</p>
                    </div>
                  </div>

                  {/* Sektör Dağılım Çubukları */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Öğrenci Staj Yerleşimi Sektör Dağılımı</h4>
                    {[
                      { sector: 'Yazılım & Bilişim Teknoloji', ratio: '42%', color: 'bg-red-600' },
                      { sector: 'Savunma Sanayii & Havacılık', ratio: '28%', color: 'bg-amber-500' },
                      { sector: 'Telekomünikasyon & Ağ', ratio: '18%', color: 'bg-emerald-600' },
                      { sector: 'E-Ticaret & Fintek', ratio: '12%', color: 'bg-indigo-600' }
                    ].map((sec, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gray-700">
                          <span>{sec.sector}</span>
                          <span>{sec.ratio}</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${sec.color}`} style={{ width: sec.ratio }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. ÖĞRENCİ ROZET MERKEZİ */}
              {activeTab === 'badges' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                    <Crown size={18} className="text-amber-500" /> Başarılı Öğrencilere Rozet Tanımla
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">Bölüm başkanı onaylı rozetler öğrencilerin profillerinde resmi başarım olarak rozet modülünde gösterilir.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    {[
                      { title: 'Yapay Zeka & Veri Uzmanı', desc: 'Bölüm içi AI projelerinde üstün başarı', color: 'from-amber-500 to-orange-600' },
                      { title: 'Aday Mühendislik Başarısı', desc: 'Protokollü firmada 100 tam puan staj', color: 'from-red-600 to-rose-700' },
                      { title: 'Yüksek Akademik Başarım', desc: 'Dönem 1.si ve Akademik Onur Listesi', color: 'from-indigo-600 to-blue-700' }
                    ].map((badge, idx) => (
                      <div key={idx} className="p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition text-center flex flex-col justify-between">
                        <div>
                          <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-tr ${badge.color} text-white flex items-center justify-center shadow-md mb-3`}>
                            <Crown size={22} />
                          </div>
                          <h4 className="font-bold text-xs text-gray-900">{badge.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-1">{badge.desc}</p>
                        </div>
                        <button 
                          onClick={() => window.toast?.success(`"${badge.title}" rozeti öğrenciye tanımlandı.`)}
                          className="mt-4 w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          Rozet Tanımla
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* --- KARIYER AĞI (MOBİL İÇİN VEYA SEKME) --- */}
        {!isRadarOpen && activeTab === 'career_network' && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><Compass className="text-red-600" /> Kariyer Ağı</h2>
            <CareerNetwork companies={companies} students={students} alumni={alumni} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} hideHeader={true} />
          </div>
        )}
        
        {/* --- AKIŞ (FEED) --- */}
        {!isRadarOpen && activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="space-y-6">
              {(() => {
                const allItems = combineFeedItems(posts, events, news, announcements, jobs);
                const filteredItems = allItems.filter(item => 
                  (item.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.authorName || '').toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredItems.length === 0) {
                  return (
                    <div className="p-8 text-center bg-white rounded-xl border border-gray-100 flex flex-col items-center">
                      <MessageCircle size={32} className="text-gray-400 mb-4" />
                      <h3 className="text-gray-900 font-black mb-2">Henüz bir gönderi yok.</h3>
                    </div>
                  );
                }
                return filteredItems.map(post => (
                  <PostCard key={post.id} post={post} currentUser={currentUser} setPosts={setPosts} setSelectedUserId={setSelectedUserId} setView={setView} />
                ));
              })()}
            </div>
          </div>
        )}

        {activeTab === 'messaging' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/40 flex items-end sm:items-center justify-center p-0 sm:p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl h-[95vh] sm:h-[85vh] sm:rounded-xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up sm:animate-fade-in relative">
              {/* Modal Native Header */}
              <div className="h-12 w-full bg-white border-b border-gray-100 shrink-0 flex items-center justify-between px-4 z-50">
                <div className="w-10 h-1 bg-gray-200 rounded-full absolute left-1/2 -translate-x-1/2 top-2 sm:hidden"></div>
                <div className="font-bold text-gray-800 text-[15px] mx-auto sm:ml-2 mt-2 sm:mt-0">Mesajlar</div>
                <button onClick={() => setActiveTab('dashboard')} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition absolute right-3 top-2">
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>
              <div className="w-full flex-1 overflow-hidden flex flex-col relative">
              <MessagingInterface 
                messages={messages} 
                setMessages={setMessages} 
                currentUser={currentUser} 
                userRole={userRole} 
                contacts={[...(students || []), ...(alumni || []), ...(companies || []), ...(academicStaff || [])]}
                setView={setView}
                setSelectedUserId={setSelectedUserId}
                groups={groups}
                setSelectedGroupId={setSelectedGroupId}
                isOverlay={true}
                onClose={() => setActiveTab('dashboard')}
              />
              </div>
            </div>
          </div>
        )}
        
        </div>

        {/* RIGHT PANEL: Akademik İstatistikler (1. Resimdeki Sağ Panel) */}
        <div className="hidden lg:block w-[300px] shrink-0 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)]">
            <h3 className="font-black text-gray-900 text-[14px] mb-4 flex items-center gap-2"><Target size={16} className="text-red-600" /> Bölüm Özeti</h3>
            <div className="space-y-3">
              {[
                {label:'Toplam Öğrenci',value:stats.totalStudents,color:'text-red-700 bg-red-50',icon:<Users size={16}/>},
                {label:'Aktif Stajyer',value:stats.activeInterns,color:'text-emerald-700 bg-emerald-50',icon:<UserCheck size={16}/>},
                {label:'Onay Bekleyen',value:stats.pendingApprovals,color:'text-amber-700 bg-amber-50',icon:<FileText size={16}/>},
              ].map((item,i)=>(
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>{item.icon}</span>
                    <span className="text-[12px] font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-[16px] font-black text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* YÖNETİCİ İLETİŞİM HATTI KARTI (Hızlı İşlemler Yerine Değiştirildi) */}
          <div className="bg-gradient-to-br from-red-950 via-[#7A0000] to-red-900 rounded-2xl p-5 text-white border border-red-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1.5">KARİYER GELİŞTİRME MERKEZİ</p>
            <h4 className="font-black text-base leading-tight mb-2 text-white">Yönetici İletişim Hattı</h4>
            <p className="text-[11px] text-red-100 mb-4 leading-relaxed opacity-90">Özel protokoller, akademisyen onay süreçleri ve kontenjanlar için uzmanlarımızla iletişime geçin.</p>
            <button 
              onClick={() => setShowAdminMsgModal(true)} 
              className="w-full py-3 bg-white text-[#990000] hover:bg-slate-100 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-md"
            >
              <MessageSquare size={16} /> Yöneticiye Mesaj Gönder
            </button>
          </div>
        </div>

      </main>

      {/* GELİŞMİŞ YÖNETİCİ İLETİŞİM PORTALI MODAL (POP-UP) */}
      {showAdminMsgModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Head & Navigation Tabs */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-red-950 via-[#7A0000] to-red-900 text-white flex flex-col gap-4 relative">
              <button 
                onClick={() => setShowAdminMsgModal(false)} 
                className="absolute right-4 top-4 text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 font-bold shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-black text-white text-base leading-tight">Kariyer Merkezi Yönetici İletişim Portalı</h3>
                  <p className="text-[11px] text-red-100 opacity-80 mt-0.5">Resmi taleplerinizi ve staj protokol sorularınızı iletin</p>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex items-center gap-2 bg-black/20 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setAdminModalTab('new')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    adminModalTab === 'new' ? 'bg-white text-[#7A0000] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Yeni Mesaj Gönder
                </button>
                <button
                  onClick={() => setAdminModalTab('history')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    adminModalTab === 'history' ? 'bg-white text-[#7A0000] shadow-sm' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Mesaj Geçmişi & Yanıtlar 
                  <span className="bg-amber-400 text-red-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {adminMessages?.length || 2}
                  </span>
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto bg-slate-50/50 flex-1">
              
              {/* TAB 1: YENİ MESAJ FORMU */}
              {adminModalTab === 'new' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!adminMsgForm.message.trim()) {
                      window.toast?.info('Lütfen mesaj metnini girin.');
                      return;
                    }
                    const newMsg = {
                      id: 'ADMIN_MSG_' + Date.now(),
                      senderId: currentUser?.id,
                      senderName: currentUser?.name || 'Akademisyen',
                      senderType: 'academic',
                      subject: adminMsgForm.subject,
                      priority: adminMsgForm.priority,
                      message: adminMsgForm.message,
                      fileName: adminMsgForm.fileName,
                      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }),
                      status: 'İnceleniyor',
                      reply: null
                    };
                    if (setAdminMessages) {
                      setAdminMessages(prev => [newMsg, ...(prev || [])]);
                    }
                    setAdminMsgForm({ subject: 'Akademik Kontenjan & Protokol Talebi', message: '', priority: 'Normal', fileName: '' });
                    setAdminModalTab('history');
                    window.toast?.success('Talebiniz Kariyer Geliştirme Merkezi Yönetimine başarıyla iletildi!');
                  }}
                  className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider block mb-1">Konu Başlığı</label>
                      <select
                        value={adminMsgForm.subject}
                        onChange={(e) => setAdminMsgForm({ ...adminMsgForm, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-[#990000]"
                      >
                        <option value="Akademik Kontenjan & Protokol Talebi">Akademik Kontenjan & Protokol Talebi</option>
                        <option value="Öğrenci Staj Onay İstisnası">Öğrenci Staj Onay İstisnası</option>
                        <option value="Kariyer Fuarı & Seminer Katılımı">Kariyer Fuarı & Seminer Katılımı</option>
                        <option value="ÇAP / Yan Dal Programı Talebi">ÇAP / Yan Dal Programı Talebi</option>
                        <option value="Genel Sorular & İletişim">Genel Sorular & İletişim</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider block mb-1">Öncelik Seviyesi</label>
                      <select
                        value={adminMsgForm.priority}
                        onChange={(e) => setAdminMsgForm({ ...adminMsgForm, priority: e.target.value })}
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-[#990000]"
                      >
                        <option value="Normal">🟢 Normal</option>
                        <option value="Yüksek">🟡 Yüksek</option>
                        <option value="Acil 🔥">🔴 Acil 🔥</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-gray-700 uppercase tracking-wider block mb-1">Ayrıntılı Açıklama & Notunuz</label>
                    <textarea
                      rows={4}
                      value={adminMsgForm.message}
                      onChange={(e) => setAdminMsgForm({ ...adminMsgForm, message: e.target.value })}
                      placeholder="Kariyer Merkezi yöneticilerimize iletmek istediğiniz kontenjan detayını veya özel durumu yazınız..."
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3.5 text-xs font-medium text-gray-800 outline-none focus:border-[#990000] focus:ring-2 focus:ring-red-100 resize-none"
                      required
                    />
                  </div>

                  {/* Dosya / Taslak Belge Yükleyici */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">
                        {adminMsgForm.fileName ? adminMsgForm.fileName : 'Ek Belge / Taslak Protokol (Opsiyonel)'}
                      </span>
                    </div>
                    <label className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      {adminMsgForm.fileName ? 'Değiştir' : 'Dosya Seç'}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setAdminMsgForm({ ...adminMsgForm, fileName: e.target.files[0].name });
                            window.toast?.success('Belge eklendi: ' + e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowAdminMsgModal(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                    >
                      Kapat
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-black bg-[#990000] hover:bg-red-800 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Yöneticiye Gönder
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MESAJ GEÇMİŞİ & YANITLAR */}
              {adminModalTab === 'history' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Örnek Hazır Yönetici Yanıtlı Mesajlar */}
                  {[
                    {
                      id: 'msg_h1',
                      subject: 'Akademik Kontenjan & Protokol Talebi',
                      date: 'Bugün, 11:20',
                      priority: 'Yüksek',
                      message: 'Bilgisayar Mühendisliği son sınıf öğrencilerimiz için Aselsan A.Ş. ile imzalanacak aday mühendislik protokol kontenjanının 15 kişiye çıkarılması hususunda desteğinizi rica ederiz.',
                      status: 'Yanıtlandı',
                      reply: 'Kariyer Geliştirme Merkezi Koordinatörlüğü: Talebiniz üzerine Aselsan İK direktörlüğü ile görüşülmüş ve ek 5 kişilik kontenjan daha tanımlanmıştır.'
                    },
                    {
                      id: 'msg_h2',
                      subject: 'Kariyer Fuarı & Seminer Katılımı',
                      date: '27 Temmuz 2026',
                      priority: 'Normal',
                      message: 'Güz dönemi başlangıcında Yazılım Sektörü Zirvesi için salon tahsisi ve davetli konuşmacı listesi hakkında bilgi talep ediyorum.',
                      status: 'İnceleniyor',
                      reply: null
                    }
                  ].map(item => (
                    <div key={item.id} className="p-4 bg-white border border-gray-200/90 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xs">{item.subject}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.priority === 'Acil 🔥' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                              {item.priority}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium block mt-0.5">{item.date}</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'Yanıtlandı' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{item.message}"
                      </p>

                      {/* Yönetici Yanıt Paneli */}
                      {item.reply ? (
                        <div className="p-3 bg-red-50/80 border border-red-200/60 rounded-xl space-y-1">
                          <p className="text-[11px] font-black text-[#990000] flex items-center gap-1">
                            <CheckCircle2 size={13} /> Yönetici Yanıtı:
                          </p>
                          <p className="text-xs text-gray-800 font-semibold">{item.reply}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-600 font-bold italic flex items-center gap-1">
                          ⌛ Yönetici incelemesi devam ediyor. En kısa sürede geri dönüş yapılacaktır.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* FLOATING DOCK (3 İKONLU TEMİZ YAPILANDIRMA) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[90%] max-w-[320px]">
        <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100/80 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(30,41,59,0.18)] flex items-center justify-around px-5 text-gray-800">
          
          {/* 1. HOME (ANA SAYFA) */}
          <button 
            onClick={() => { setIsRadarOpen(false); setActiveTab('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'dashboard' && !isRadarOpen ? 'bg-[#990000] text-white shadow-md shadow-red-500/30' : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'}`} 
            title="Akış"
          >
            <Home size={24} strokeWidth={2.2} />
          </button>
          
          {/* 2. RADAR & ONAY HAVUZU (SAĞDAKİ İKONA AKTARILDI - KIRMIZI GRADIENT) */}
          <button 
            onClick={() => { setIsRadarOpen(!isRadarOpen); setActiveTab('approvals'); }} 
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#7A0000] via-[#990000] to-red-600 text-white shadow-lg shadow-red-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
            title="Akademik Radar & Onay Havuzu"
          >
            <Radar size={24} strokeWidth={2.5} />
          </button>
          
          {/* 3. PROFILE AVATAR */}
          <button 
            onClick={() => {
              if (setSelectedUserId && currentUser?.id) {
                setSelectedUserId(currentUser.id);
              }
              setView('user_profile');
            }} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-red-500 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer" 
            title="Akademik Profilim"
          >
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=Akademisyen&background=DC2626&color=fff`} className="w-full h-full rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}



