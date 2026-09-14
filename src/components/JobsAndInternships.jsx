import useAppStore from '../store/useAppStore';
import React, { useState } from 'react';
import { ExternalLink, Calendar, MapPin, Building2, Search, Briefcase, FileText, CheckCircle2, Download, Home, MessageCircle, Bell, Heart, X, Flame, Star, ArrowRight, Sparkles, Target, Users, TrendingUp, Clock, Crown, LayoutDashboard, ChevronRight, Scale } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import JobCreator from './JobCreator';
import FooterModals from './FooterModals';
import StudentDocumentSubmitModal from './StudentDocumentSubmitModal';
import AdminOmniDock from './AdminOmniDock';
import JobMatchScoreCard from './JobMatchScoreCard';
import SafeAvatar from './shared/SafeAvatar';
import AnkaCoverLetterModal from './AnkaCoverLetterModal';

export default function JobsAndInternships({ userRole, setView, currentUser, jobs: propsJobs }) {
  const previousView = useAppStore(state => state.previousView);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const isAdminUser = userRole === 'admin' || currentUser?.role === 'admin';
  const effectiveRole = (
    (['admin', 'admin_cms', 'yonetim_konsolu', 'admin_console'].includes(previousView) || activePortalBranch === 'admin' || (isAdminUser && previousView !== 'student' && previousView !== 'alumni' && activePortalBranch !== 'student' && activePortalBranch !== 'alumni')) ? 'admin' :
    (previousView === 'alumni' || activePortalBranch === 'alumni' || userRole === 'alumni') ? 'alumni' :
    (previousView === 'academic' || activePortalBranch === 'academic' || userRole === 'academic') ? 'academic' :
    (previousView === 'company' || activePortalBranch === 'company' || userRole === 'company' || userRole === 'employer') ? 'company' :
    (previousView === 'student' || activePortalBranch === 'student' || userRole === 'student') ? 'student' :
    (userRole || currentUser?.role || 'student')
  );

  const branchTargetId = (
    (currentUser?.id && currentUser.id !== 'admin_1513') ? currentUser.id :
    effectiveRole === 'student' ? 'STU-001' :
    effectiveRole === 'alumni' ? 'ALU-001' :
    effectiveRole === 'academic' ? 'ACAD-001' :
    (effectiveRole === 'employer' || effectiveRole === 'company') ? 'CMP-001' :
    (currentUser?.id || 'admin_1513')
  );

  const branchName = currentUser?.name || (effectiveRole === 'admin' ? 'Kariyer Geliştirme Merkezi' : 'Kullanıcı');

  const branchAvatar = currentUser?.avatar || (effectiveRole === 'admin' ? '/iesu-logo.svg' : '/iesu-logo.svg');

  const branchDept = currentUser?.department || (effectiveRole === 'admin' ? 'Kariyer Geliştirme Koordinatörlüğü' : 'Yazılım Mühendisliği');

  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const storeJobs = useAppStore(state => state.jobs);
  const jobs = (propsJobs && propsJobs.length) ? propsJobs : storeJobs;
  const setJobs = useAppStore(state => state.setJobs);
  const applications = useAppStore(state => state.applications) || [];
  const setApplications = useAppStore(state => state.setApplications);
  const setNotifications = useAppStore(state => state.setNotifications);
  const swipedJobs = useAppStore(state => state.swipedJobs) || [];
  const setSwipedJobs = useAppStore(state => state.setSwipedJobs);
  const notifications = useAppStore(state => state.notifications) || [];
  const [viewMode, setViewMode] = useState('list');
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('ilanlar');
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [showDocSubmitModal, setShowDocSubmitModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [footerModal, setFooterModal] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [appForm, setAppForm] = useState({ coverLetter: '', phone: currentUser?.phone || '', cvType: 'KGM Akredite İESÜ Dijital CV' });
  const [showAnkaModal, setShowAnkaModal] = useState(false);
  const addNotification = (notif) => { setNotifications(prev => [notif, ...prev]); };
  const getFeedView = () => {
    if (effectiveRole === 'admin') return 'admin';
    if (effectiveRole === 'employer' || effectiveRole === 'company') return 'company';
    if (effectiveRole === 'alumni') return 'alumni';
    if (effectiveRole === 'academic') return 'academic';
    return 'student';
  };

  const handleApproveJob = (jobId) => {
    if (setJobs) {
      setJobs(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Aktif' } : j));
    }
    window.toast?.success?.("✅ İlan onaylandı ve tüm üniversite portallarında yayına alındı.");
  };

  const handleRejectJob = (jobId) => {
    if (setJobs) {
      setJobs(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Reddedildi' } : j));
    }
    window.toast?.info?.("İlan reddedildi.");
  };

  const handleToggleJobStatus = (jobId, currentStatus) => {
    const newStatus = (currentStatus === 'Aktif' || !currentStatus) ? 'Pasif' : 'Aktif';
    if (setJobs) {
      setJobs(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    }
    window.toast?.success?.(`İlan durumu "${newStatus}" olarak güncellendi.`);
  };
  if (isCreatingJob) return <JobCreator setView={() => setIsCreatingJob(false)} currentUser={currentUser} jobs={jobs} setJobs={setJobs} addNotification={addNotification} />;
  
  const handleCompleteApplication = (e) => {
    e.preventDefault();
    if (!applyModalJob) return;
    if (effectiveRole !== 'student' && effectiveRole !== 'alumni' && userRole !== 'student' && userRole !== 'alumni') { window.toast?.error("Sadece öğrenciler ve mezunlar başvuru yapabilir."); return; }
    if (applications.some(a => a.jobId === applyModalJob.id && (a.applicantId === branchTargetId || a.applicantId === currentUser?.id))) { window.toast?.info("Bu ilana zaten başvurdunuz."); setApplyModalJob(null); return; }
    
    const newApp = { 
      id: 'APP-' + Date.now(), 
      jobId: applyModalJob.id, 
      jobTitle: applyModalJob.title, 
      company: applyModalJob.company, 
      applicantId: branchTargetId, 
      applicantName: branchName, 
      applicantEmail: currentUser?.email || (effectiveRole === 'alumni' ? 'mezun@esenyurt.edu.tr' : 'ogrenci@esenyurt.edu.tr'),
      applicantPhone: appForm.phone || '0555 000 0000',
      applicantDept: branchDept,
      coverLetter: appForm.coverLetter || 'İlanınızla yakından ilgileniyorum.',
      cvType: appForm.cvType,
      status: 'Beklemede', 
      companyContacted: false,
      date: new Date().toLocaleDateString('tr-TR') 
    };
    
    setApplications(prev => [...(prev || []), newApp]);
    window.toast?.success("İş & Staj başvurunuz KGM ve Firma Havuzuna başarıyla iletildi!");
    addNotification({ id:'N-'+Date.now(), userId:branchTargetId, text:`${applyModalJob.title} ilanına başvurunuz iletildi.`, read:false, time:'Az önce' });
    setApplyModalJob(null);
    setAppForm({ coverLetter: '', phone: currentUser?.phone || '', cvType: 'KGM Akredite İESÜ Dijital CV' });
  };
  const activeJobs = (jobs||[]).filter(j => j.status === 'Aktif' || !j.status);
  const pendingJobs = (jobs||[]).filter(j => j.status === 'Onay Bekliyor' || j.status === 'Pending');
  const myApplicationsCount = applications.filter(a => a.applicantId === branchTargetId || a.applicantId === currentUser?.id).length;
  const unreadNotifCount = notifications.filter(n => (n.userId === branchTargetId || n.userId === currentUser?.id) && !n.read).length;
  const roleTheme = {
    admin: {
      accentLine: 'from-amber-600 via-orange-500 to-amber-700',
      iconBox: 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-700 shadow-amber-500/20 text-white',
      activeTab: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white shadow-md shadow-amber-500/20',
      trendingIcon: 'text-amber-600',
      matchText: 'text-amber-700',
      matchBar: 'from-amber-500 via-orange-500 to-amber-600',
      hoverBorder: 'hover:border-amber-300',
      titleHover: 'group-hover:text-amber-700',
      detailHover: 'hover:text-amber-700',
      applyBtn: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white hover:shadow-md hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-95'
    },
    alumni: {
      accentLine: 'from-emerald-600 via-teal-600 to-emerald-800',
      iconBox: 'bg-gradient-to-tr from-emerald-600 to-teal-700 shadow-emerald-500/20 text-white',
      activeTab: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/20',
      trendingIcon: 'text-emerald-600',
      matchText: 'text-emerald-700',
      matchBar: 'from-emerald-500 to-teal-600',
      hoverBorder: 'hover:border-emerald-200',
      titleHover: 'group-hover:text-emerald-700',
      detailHover: 'hover:text-emerald-700',
      applyBtn: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white hover:shadow-md hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95'
    },
    academic: {
      accentLine: 'from-indigo-900 via-purple-900 to-slate-900',
      iconBox: 'bg-gradient-to-tr from-indigo-800 to-purple-900 shadow-purple-950/20 text-white',
      activeTab: 'bg-gradient-to-r from-indigo-800 to-purple-900 text-white shadow-md shadow-purple-950/20',
      trendingIcon: 'text-purple-600',
      matchText: 'text-purple-700',
      matchBar: 'from-indigo-600 to-purple-800',
      hoverBorder: 'hover:border-purple-200',
      titleHover: 'group-hover:text-purple-700',
      detailHover: 'hover:text-purple-700',
      applyBtn: 'bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white hover:shadow-md hover:shadow-purple-950/30 hover:-translate-y-0.5 active:scale-95'
    },
    company: {
      accentLine: 'from-blue-950 via-indigo-900 to-sky-900',
      iconBox: 'bg-gradient-to-tr from-blue-900 to-sky-800 shadow-blue-950/20 text-white',
      activeTab: 'bg-gradient-to-r from-blue-900 to-sky-800 text-white shadow-md shadow-blue-950/20',
      trendingIcon: 'text-sky-600',
      matchText: 'text-sky-700',
      matchBar: 'from-blue-600 to-sky-700',
      hoverBorder: 'hover:border-sky-200',
      titleHover: 'group-hover:text-sky-700',
      detailHover: 'hover:text-sky-700',
      applyBtn: 'bg-gradient-to-r from-blue-950 via-indigo-900 to-sky-900 text-white hover:shadow-md hover:shadow-blue-950/30 hover:-translate-y-0.5 active:scale-95'
    },
    student: {
      accentLine: 'from-red-900 via-[#990000] to-rose-700',
      iconBox: 'bg-gradient-to-tr from-red-800 to-[#990000] shadow-red-900/20 text-white',
      activeTab: 'bg-gradient-to-r from-red-900 to-[#990000] text-white shadow-md shadow-red-900/20',
      trendingIcon: 'text-[#990000]',
      matchText: 'text-[#990000]',
      matchBar: 'from-red-800 via-[#990000] to-rose-600',
      hoverBorder: 'hover:border-red-200',
      titleHover: 'group-hover:text-[#990000]',
      detailHover: 'hover:text-[#990000]',
      applyBtn: 'bg-gradient-to-r from-red-800 via-[#990000] to-rose-700 text-white hover:shadow-md hover:shadow-red-900/30 hover:-translate-y-0.5 active:scale-95'
    }
  };

  const theme = roleTheme[effectiveRole === 'admin' ? 'admin' : effectiveRole === 'alumni' ? 'alumni' : effectiveRole === 'academic' ? 'academic' : (effectiveRole === 'employer' || effectiveRole === 'company') ? 'company' : 'student'];
  const typeColors = { 'TAM ZAMANLI':'bg-blue-50 text-blue-700', 'STAJ':'bg-purple-50 text-purple-700', 'YARI ZAMANLI':'bg-amber-50 text-amber-700', 'UZAKTAN':'bg-emerald-50 text-emerald-700', 'SERBEST':'bg-rose-50 text-rose-700' };
  return (
    <div className="min-h-screen bg-[#f3f2ee] font-sans">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.currentTarget.click();}}} className="flex items-center gap-3 cursor-pointer" onClick={()=>setView(getFeedView())}>
            <Logo color={effectiveRole === 'admin' ? 'amber' : effectiveRole === 'alumni' ? 'emerald' : effectiveRole === 'academic' ? 'indigo' : (effectiveRole === 'employer' || effectiveRole === 'company') ? 'blue' : 'red'} className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${
                effectiveRole === 'admin' ? 'text-amber-800' :
                effectiveRole === 'alumni' ? 'text-emerald-800' :
                effectiveRole === 'academic' ? 'text-indigo-900' :
                (effectiveRole === 'company' || effectiveRole === 'employer') ? 'text-blue-900' : 'text-[#990000]'
              }`}>
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {effectiveRole === 'admin' ? 'KGM Süper Yönetici & Koordinasyon Merkezi' :
                 effectiveRole === 'alumni' ? 'İESÜ Mezunlar Portalı' :
                 effectiveRole === 'academic' ? 'Akademik Bilgi & Yönetim Portalı' :
                 (effectiveRole === 'company' || effectiveRole === 'employer') ? 'Kurumsal İnsan Kaynakları Portalı' :
                 'Kariyer Geliştirme Merkezi'}
              </p>
            </div>
          </div>

          {/* TOP CENTER ROLE PORTAL PILL BADGE */}
          <div className="hidden md:flex items-center justify-center pointer-events-none z-20">
            <div className={`px-4 py-1.5 rounded-full text-white font-black text-xs shadow-md border border-white/50 flex items-center gap-2 tracking-wider uppercase whitespace-nowrap shrink-0 bg-gradient-to-r ${theme.accentLine}`}>
              <span className="w-2 h-2 rounded-full animate-pulse shrink-0 bg-white"></span>
              {effectiveRole === 'admin' ? '👑 KGM MASTER İLAN & STAJ YÖNETİMİ' : '💼 İŞ & STAJ OLANAKLARI HAVUZU'}
            </div>
          </div>

          {effectiveRole ? (
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button onClick={()=>setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center ${effectiveRole === 'admin' ? 'hover:bg-amber-50 text-amber-700' : 'hover:bg-red-50 text-[#990000]'}`} title="Bildirimler">
                <div className="relative">
                  <Bell size={24} strokeWidth={2.5} className="fill-current opacity-10" />
                  {unreadNotifCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                </div>
              </button>
              <TopProfileMenu currentUser={currentUser || { name: 'Kullanici' }} userRole={effectiveRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="jobs" />
            </div>
          ) : <div className="w-10"></div>}
        </div>
      </nav>
      <div className="pt-20 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-28">
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="space-y-4" style={{position:'sticky',top:'88px'}}>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {effectiveRole === 'admin' ? (
                <div className="p-6 text-center">
                  <div className="relative inline-block mb-2">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm mx-auto p-2"><Logo size="lg" className="w-full h-full justify-center" /></div>
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white"><Crown size={14} /></div>
                  </div>
                  <h2 className="text-[16px] font-black text-gray-900 mt-4 leading-tight">Kariyer Geliştirme Merkezi</h2>
                  <p className="text-[12px] font-bold text-amber-600 mt-1 uppercase tracking-wider">SÜPER YÖNETİCİ & KOORDİNATÖR</p>
                  <div className="mt-4 space-y-2 text-left">
                    <button onClick={()=>setView('admin')} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-[13px] font-bold py-2.5 rounded-xl transition-all shadow-md cursor-pointer"><LayoutDashboard size={15}/> Yönetici Masası (Feed)</button>
                    <button onClick={()=>setView('yonetim_konsolu')} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-[12px] font-bold py-2 rounded-xl transition-all shadow-sm cursor-pointer"><Scale size={14}/> Karar & Talep Konsolu</button>
                    <button onClick={()=>setView('company_ats')} className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-900 text-[12px] font-bold py-2 rounded-xl transition-all border border-blue-200 cursor-pointer"><Briefcase size={14}/> ATS Aday Havuzu</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`h-20 bg-gradient-to-r ${theme.accentLine} relative`}>
                    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
                      <div className="w-[72px] h-[72px] rounded-full border-4 border-white overflow-hidden bg-white shadow-md flex items-center justify-center">
                        <SafeAvatar src={branchAvatar} name={branchName} size="xl" alt="User" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 pb-5 px-5 text-center">
                    <h2 onClick={() => { if (setSelectedUserId) setSelectedUserId(branchTargetId); setView('user_profile'); }} className="text-[17px] font-black text-gray-900 leading-none mb-1 cursor-pointer hover:underline">{branchName}</h2>
                    <p className="text-[12px] font-medium text-gray-500 mb-4">{branchDept}</p>
                    <div className="flex justify-center gap-5 border-y border-gray-50 py-3 mb-4">
                      <div className="text-center"><p className="text-gray-500 text-[11px] font-bold uppercase">Başvurum</p><p className="text-[18px] font-black text-gray-900">{myApplicationsCount}</p></div>
                      <div className="w-px bg-gray-100"></div>
                      <div className="text-center"><p className="text-gray-500 text-[11px] font-bold uppercase">Aktif İlan</p><p className="text-[18px] font-black text-gray-900">{activeJobs.length}</p></div>
                    </div>
                    <button onClick={() => { if (setSelectedUserId) setSelectedUserId(branchTargetId); setView('user_profile'); }} className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-colors cursor-pointer ${
                      effectiveRole === 'alumni' ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100' : 'bg-red-50 text-[#990000] hover:bg-red-100'
                    }`}>Profili Görüntüle</button>
                  </div>
                </>
              )}
            </div>
            <div className={`rounded-2xl p-5 shadow-xl text-white border relative overflow-hidden bg-gradient-to-br ${theme.accentLine}`}>
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Sparkles size={12} className="text-amber-300" /> Kariyer Merkezi</p>
              <h3 className="font-black text-base leading-tight mb-2 text-white">
                {effectiveRole === 'admin' ? 'İlan & Staj Koordinasyonu' : effectiveRole==='employer'?'İlan Oluşturun':"CV'nizi Güncelleyin"}
              </h3>
              <p className="text-[11px] text-white/80 font-medium mb-4 leading-relaxed">
                {effectiveRole === 'admin' ? 'Kurumsal ilanları denetleyin veya üniversite adına yeni ilan yayınlayın.' : effectiveRole==='employer'?'Üniversitenin yetenekli öğrencilerine ulaşın.':'AI destekli CV ile kariyer hedefinize ulaşın.'}
              </p>
              <button onClick={()=> (effectiveRole === 'admin' || effectiveRole === 'employer') ? setIsCreatingJob(true) : setView('mbs')} className="w-full py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                {(effectiveRole === 'admin' || effectiveRole === 'employer') ? 'Yeni İlan Oluştur' : 'Profili Düzenle'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 max-w-[680px] space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${theme.accentLine}`}></div>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 ${theme.iconBox}`}><Briefcase size={20} strokeWidth={2.5} /></div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">
                    {effectiveRole === 'admin' ? 'İlan & Staj Denetim Masası' : effectiveRole==='academic'?'İlanlar (Akademik Görünüm)':'İş ve Staj Olanakları'}
                  </h2>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                    {effectiveRole === 'admin' ? `${activeJobs.length} aktif ilan • ${pendingJobs.length} onay bekleyen` : `${activeJobs.length} aktif ilan - ${myApplicationsCount} başvurum`}
                  </p>
                </div>
              </div>
              {(effectiveRole==='employer' || effectiveRole === 'admin') && (
                <button onClick={()=>setIsCreatingJob(true)} className={`text-white px-4 py-2 rounded-xl font-black text-[13px] shadow-md hover:shadow-lg flex items-center gap-1.5 shrink-0 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer ${effectiveRole === 'admin' ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' : 'bg-blue-950 hover:bg-slate-900'}`}>
                  <span className="text-lg leading-none">+</span> <span className="hidden sm:inline">Yeni İlan Oluştur</span>
                </button>
              )}
            </div>
            <div className="px-5 pb-4 flex items-center gap-2 overflow-x-auto">
              {[
                {id:'ilanlar',label:'Aktif İlanlar',icon:<Briefcase size={14}/>},
                ...(effectiveRole === 'admin' ? [{id:'onay_bekleyen',label:`Onay Bekleyenler (${pendingJobs.length})`,icon:<Clock size={14}/>}] : []),
                {id:'ulusal',label:'Ulusal Staj',icon:<Target size={14}/>},
                {id:'gonullu',label:'İsteğe Bağlı Staj',icon:<Heart size={14}/>}
              ].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap active:scale-95 ${activeTab===tab.id?theme.activeTab:'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}

              <button 
                onClick={() => setShowDocSubmitModal(true)} 
                className={`px-4 py-2 bg-gradient-to-r ${theme.accentLine} text-white rounded-full text-[12px] font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ml-auto border border-white/30`}
              >
                <FileText size={14} /> Staj & Evrak Yükle (Havuz)
              </button>
            </div>
          </div>

          {activeTab==='ilanlar'&&(
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <p className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5"><TrendingUp size={15} className={theme.trendingIcon} />{activeJobs.length} guncel firsat</p>
              </div>
              {(()=>{
                if(activeJobs.length===0) return(<div className="flex flex-col items-center justify-center p-16 bg-white border border-gray-100 border-dashed rounded-2xl"><Briefcase size={44} className="text-gray-300 mb-4" /><p className="text-gray-900 font-black text-lg mb-1">Henuz ilan yok</p><p className="text-gray-500 font-medium text-center text-sm">Yeni ilanlar eklendiginde burada gorunecek.</p></div>);
                if(viewMode==='swipe'){
                  const unswipedJobs=activeJobs.filter(j=>!swipedJobs.includes(j.id));
                  const currentJob=unswipedJobs[swipeIndex];
                  if(!currentJob) return(<div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-2xl h-[400px] shadow-sm"><CheckCircle2 size={48} className="text-emerald-400 mb-4" /><p className="text-gray-900 font-black text-xl mb-2 text-center">Harikasin!</p><p className="text-gray-500 font-medium text-center">Butun ilanlari inceledin.</p><button onClick={()=>{setSwipedJobs([]);setSwipeIndex(0);}} className={`mt-6 text-sm font-bold hover:underline ${theme.matchText}`}>Basa Don</button></div>);
                  const hasApplied=applications.some(a=>a.jobId===currentJob.id&&(a.applicantId===branchTargetId||a.applicantId===currentUser?.id));
                  return(
                    <div className="flex flex-col items-center py-4">
                      <div className="w-full max-w-sm">
                        <div className="relative h-[460px] w-full bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                          <img src={currentJob.logo||`https://ui-avatars.com/api/?name=${encodeURIComponent(currentJob.company)}&background=random`} className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>
                          <div className="relative z-10 p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <img src={currentJob.logo||`https://ui-avatars.com/api/?name=${encodeURIComponent(currentJob.company)}&background=random`} className="w-16 h-16 rounded-2xl shadow-sm border border-gray-100 object-cover bg-white" alt="" />
                              <div className={`px-3 py-1 rounded-full text-xs font-black ${typeColors[currentJob.type]||'bg-gray-100 text-gray-700'}`}>{currentJob.type}</div>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{currentJob.title}</h2>
                            <p className="text-gray-600 font-bold mb-4 flex items-center gap-2"><Building2 size={15}/> {currentJob.company}</p>
                            <div className="space-y-2 mb-4">
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100"><MapPin size={15} className="text-red-500 shrink-0"/> {currentJob.location}</p>
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100"><Calendar size={15} className="text-amber-500 shrink-0"/> Son: {currentJob.deadline}</p>
                            </div>
                            <div className="w-full mb-5">
                              <div className="flex justify-between items-center mb-1"><span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Profil Eslesme</span><span className={`text-sm font-black ${theme.matchText}`}>%{((currentJob.id.length*7+currentJob.title.length*3)%30)+70}</span></div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${theme.matchBar} rounded-full`} style={{width:`${((currentJob.id.length*7+currentJob.title.length*3)%30)+70}%`}}></div></div>
                            </div>
                            <div className="mt-auto flex justify-center gap-6">
                              <button onClick={()=>setSwipedJobs([...swipedJobs,currentJob.id])} className="w-16 h-16 rounded-full bg-white border-2 border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-transform shadow-sm"><X size={28} strokeWidth={3} /></button>
                              <button onClick={()=>{if(!hasApplied)setApplyModalJob(currentJob);setSwipedJobs([...swipedJobs,currentJob.id]);}} className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform shadow-lg ${hasApplied?'bg-gray-200 text-gray-400 cursor-not-allowed':theme.applyBtn}`}>{hasApplied?<CheckCircle2 size={28}/>:<Heart size={28} strokeWidth={3} className="fill-emerald-500" />}</button>
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-gray-400 text-xs font-bold mt-4 animate-pulse">Sola gec, saga basvur!</p>
                      </div>
                    </div>
                  );
                }
                return(
                  <div className="space-y-3">
                    {activeJobs.map(job=>{
                      const hasApplied=applications.some(a=>a.jobId===job.id&&(a.applicantId===branchTargetId||a.applicantId===currentUser?.id));
                      const matchScore=((job.id.length*7+job.title.length*3)%30)+70;
                      return(
                        <div key={job.id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${theme.hoverBorder}`}>
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">{job.logo?<img src={job.logo} alt={job.company} className="w-full h-full object-cover" />:<Building2 size={24} className="text-gray-400" />}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                  <div>
                                    <h3 className={`text-[15px] font-black text-gray-900 leading-tight transition-colors cursor-pointer ${theme.titleHover}`} onClick={()=>setSelectedJob(job)}>{job.title}</h3>
                                    <p className="text-[13px] font-bold text-[#990000] mt-0.5">{job.company}</p>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md text-[10px] font-extrabold">🎓 Öğrenci Dostu</span>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${typeColors[job.type]||'bg-gray-100 text-gray-600'}`}>{job.type||'Ilan'}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  <span className="flex items-center gap-1 text-[12px] text-gray-500 font-medium"><MapPin size={12} className="text-gray-400"/> {job.location||'Belirtilmedi'}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="flex items-center gap-1 text-[12px] text-gray-500 font-medium"><Clock size={12} className="text-amber-500"/> Son: {job.deadline||'Belirtilmedi'}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${theme.matchBar} rounded-full`} style={{width:`${matchScore}%`}}></div></div><span className={`text-[11px] font-black shrink-0 ${theme.matchText}`}>%{matchScore} eslesme</span></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 gap-2 flex-wrap">
                              <button onClick={()=>setSelectedJob(job)} className={`text-[12px] font-bold text-gray-500 transition-colors flex items-center gap-1 ${theme.detailHover}`}>Detayları Gör <ChevronRight size={14} /></button>
                              {effectiveRole === 'admin' ? (
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setView('company_ats')} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition cursor-pointer flex items-center gap-1">
                                    <Briefcase size={13} /> ATS Adayları
                                  </button>
                                  <button onClick={() => handleToggleJobStatus(job.id, job.status)} className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${job.status === 'Pasif' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'}`}>
                                    {job.status === 'Pasif' ? 'Aktife Al' : 'Pasife Al'}
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => setApplyModalJob(job)} disabled={hasApplied} className={`px-5 py-2 rounded-xl font-black text-[13px] transition-all flex items-center gap-1.5 cursor-pointer ${hasApplied?'bg-gray-100 text-gray-400 cursor-not-allowed':theme.applyBtn}`}>{hasApplied?<><CheckCircle2 size={14}/> Başvuruldu</>:'Hemen Başvur'}</button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab==='onay_bekleyen' && effectiveRole === 'admin' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Onay Bekleyen Firma İlanları</h3>
                    <p className="text-xs text-slate-600 font-medium">{pendingJobs.length} ilan KGM onayı bekliyor.</p>
                  </div>
                </div>
              </div>

              {pendingJobs.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
                  <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
                  <p className="font-black text-gray-900">Tüm İlanlar İncelendi</p>
                  <p className="text-xs text-gray-500 mt-1">Şu anda onay bekleyen yeni firma ilanı bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingJobs.map(job => (
                    <div key={job.id} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                          {job.logo ? <img src={job.logo} alt="" className="w-full h-full object-cover rounded-xl" /> : <Building2 size={20} className="text-amber-600" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 text-sm truncate">{job.title}</h4>
                          <p className="text-xs font-bold text-amber-700">{job.companyName || job.company}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span>{job.location || 'Türkiye'}</span> • <span>{job.type || 'Staj / İş'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleRejectJob(job.id)} className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer">
                          Reddet
                        </button>
                        <button onClick={() => handleApproveJob(job.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer">
                          Onayla ve Yayınla
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab==='ulusal'&&(
            <div className="animate-fade-in space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Target size={20}/></div><div><h3 className="text-xl font-black text-gray-900">T.C. Ulusal Staj Programi</h3><p className="text-[12px] text-gray-500 font-medium">Cumhurbaskanligi Insan Kaynaklari Ofisi koordinasyonunda</p></div></div>
                <ul className="space-y-3 mb-6">
                  {['Kariyer Kapisi (ulusalstajprogrami.iskur.gov.tr) adresine gidin.','e-Devlet sifrenizle sisteme giris yapin.','Staj Basvurusu menuunden guncel yilin programina tiklayin.','Basvuru formunu eksiksiz doldurun.','Basvuru durumunuzu Kariyer Kapisi uzerinden takip edin.'].map((step,i)=>(
                    <li key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3 border border-gray-100"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[12px] flex-shrink-0">{i+1}</span><span className="text-[13px] text-gray-700 font-medium leading-relaxed">{step}</span></li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="font-extrabold text-[15px] text-gray-900 mb-4 flex items-center gap-2"><FileText size={18} className="text-[#990000]" /> Ilgili Formlar</h4>
                <div className="space-y-2.5">
                  {[{title:'Zorunlu Staj Formu',link:'/docs/zorunlu_staj.pdf'},{title:'Mesleki Egitim Sozlesmesi (SHMYO-SBF)',link:'/docs/mesleki_egitim.pdf'},{title:'Is Sagligi ve Guvenligi Belgesi (SHMYO)',link:'/docs/isg_shmyo.pdf'},{title:'Is Sagligi ve Guvenligi Belgesi (SBF)',link:'/docs/isg_sbf.pdf'},{title:'Ulusal Staj Basvuru Formu',link:'/docs/ulusal_staj.pdf'}].map((doc,i)=>(
                    <a key={i} href={doc.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition group cursor-pointer"><span className="font-semibold text-[13px] text-gray-700 group-hover:text-blue-700 transition">{doc.title}</span><Download size={16} className="text-gray-400 group-hover:text-blue-600 transition" /></a>
                  ))}
                </div>
                <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-100 text-[12px] text-amber-800 font-medium"><strong>Not:</strong> Istenilen evraklarin eksiksiz doldurulmasi zorunludur.</div>
              </div>
            </div>
          )}

          {activeTab==='gonullu'&&(
            <div className="animate-fade-in space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><Heart size={20}/></div><div><h3 className="text-xl font-black text-gray-900">İsteğe Bağlı Staj Başvuru Süreci</h3><p className="text-[12px] text-gray-500 font-medium">Zorunlu stajı olmayan öğrenciler için ek deneyim</p></div></div>
                <div className="relative border-l-2 border-emerald-100 ml-4 space-y-6 pb-4">
                  {[{num:1,title:'Basvuru Formunun Doldurulmasi',desc:'Uygulamali Egitim Basvuru Formu doldurulmalidir. Ogrenci, kurum yetkilisi ve bolum staj sorumlusu tarafindan islak imzali olmalidir.'},{num:2,title:'SGK Mustehaklik Belgesi',desc:'e-Devlet sistemi uzerinden barkodlu olarak guncel tarihli temin edilmelidir.',link:{href:'https://www.turkiye.gov.tr/spas-mustahaklik-sorgulama',label:'e-Devlet Sorgulama'}},{num:3,title:'Kimlik Fotokopisi',desc:'Ogrencinin gecerli T.C. Kimlik Karti fotokopisi dosyaya eklenmelidir.'},{num:4,title:'Evrak Teslimi (3 Suret)',desc:'Tum belgeler 3 takim halinde hazirlanmalidir.',done:true}].map((step,i)=>(
                    <div key={i} className="relative pl-8">
                      <span className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center font-black text-[13px] shadow-sm ${step.done?'bg-emerald-100 text-emerald-700':'bg-red-100 text-[#990000]'}`}>{step.done?<CheckCircle2 size={16}/>:step.num}</span>
                      <h5 className="font-extrabold text-gray-900 text-[15px] mb-1">{step.title}</h5>
                      <p className="text-gray-600 text-[13px] leading-relaxed mb-2">{step.desc}</p>
                      {step.link&&<a href={step.link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-900 transition">{step.link.label} <ExternalLink size={12}/></a>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-emerald-50 px-5 py-4 border-b border-emerald-100 flex items-center gap-2"><FileText size={16} className="text-emerald-700"/><h4 className="font-bold text-emerald-800 text-[14px]">Gorsel Kilavuz ve Formlar</h4></div>
                <div className="p-5 flex items-center justify-center bg-gray-50 h-52 overflow-hidden group">
                  <img src="https://www.esenyurt.edu.tr/uploads/2025/08/y2j65ag3nsq19-gonullu-staj-formu.jpg" alt="İsteğe Bağlı Staj İnfografik" className="w-full h-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-500" onError={(e)=>{if(e.target.src.includes('2025/08')){e.target.src='https://www.esenyurt.edu.tr/uploads/2023/11/y2j65ag3nsq19-gonullu-staj-formu.jpg';}}} />
                </div>
                <div className="p-5 border-t border-gray-100"><a href="https://www.esenyurt.edu.tr/icerik/4540-kariyer-gelistirme-ofisi-koordinatorlugu-formlar-ve-belgeler" target="_blank" rel="noreferrer" className="w-full bg-[#990000] hover:bg-red-800 text-white py-3 rounded-xl font-bold text-[13px] transition flex items-center justify-center gap-2">Tum Formlar Sayfasina Git <ExternalLink size={15}/></a></div>
              </div>
            </div>
          )}
        </div>
        <div className="hidden xl:block w-[280px] shrink-0">
          <div className="space-y-4" style={{position:'sticky',top:'88px'}}>
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-5">
              <h3 className="font-black text-gray-900 text-[14px] mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-purple-600" /> Ilan Havuzu</h3>
              <div className="space-y-3">
                {[{label:'Aktif Ilan',value:activeJobs.length,color:'text-purple-700 bg-purple-50',icon:<Briefcase size={16}/>},{label:'Staj Firsati',value:activeJobs.filter(j=>j.type==='STAJ').length,color:'text-indigo-700 bg-indigo-50',icon:<Target size={16}/>},{label:'Toplam Basvuru',value:applications.length,color:'text-emerald-700 bg-emerald-50',icon:<Users size={16}/>},{label:'Basvurularim',value:myApplicationsCount,color:'text-amber-700 bg-amber-50',icon:<CheckCircle2 size={16}/>}].map((item,i)=>(
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2"><span className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>{item.icon}</span><span className="text-[12px] font-semibold text-gray-700">{item.label}</span></div>
                    <span className="text-[16px] font-black text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-5">
              <h3 className="font-black text-gray-900 text-[14px] mb-4 flex items-center gap-2"><Star size={15} className="text-amber-500 fill-current" /> Isveren Partnerler</h3>
              <div className="space-y-3">
                {[...new Map((jobs||[]).map(j=>[j.company,j])).values()].slice(0,4).map((job,i)=>(
                  <div key={i} className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">{job.logo?<img src={job.logo} alt={job.company} className="w-full h-full object-cover"/>:<Building2 size={16} className="text-gray-400"/>}</div><div className="flex-1 min-w-0"><p className="text-[12px] font-bold text-gray-900 truncate">{job.company}</p><p className="text-[10px] text-gray-500">{(jobs||[]).filter(j=>j.company===job.company).length} acik pozisyon</p></div></div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-50 text-[11px] text-gray-400 flex flex-wrap gap-x-2 gap-y-1">
                <button onClick={()=>setFooterModal('about')} className="hover:text-red-600 transition-colors">Hakkinda</button> ·
                <button onClick={()=>setFooterModal('privacy')} className="hover:text-red-600 transition-colors">Gizlilik</button> ·
                <button onClick={()=>setFooterModal('help')} className="hover:text-red-600 transition-colors">Yardim</button>
                <p className="w-full mt-1.5 uppercase tracking-wider text-[9px] text-gray-500 font-bold">2026 ISTANBUL ESENYURT UNIVERSITESI KGM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {effectiveRole === 'admin' ? (
        <AdminOmniDock theme="amber" currentUser={currentUser} setView={setView} setSelectedUserId={setSelectedUserId} activeTab="cms_jobs" />
      ) : effectiveRole && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className={`bg-white/95 backdrop-blur-2xl p-2 sm:p-2.5 rounded-full flex items-center justify-between px-4 text-gray-800 border-2 ${
            effectiveRole === 'alumni' ? 'border-emerald-100 shadow-[0_15px_40px_rgba(5,150,105,0.18)]' :
            effectiveRole === 'academic' ? 'border-purple-100 shadow-[0_15px_40px_rgba(79,70,229,0.18)]' :
            (effectiveRole === 'employer' || effectiveRole === 'company') ? 'border-sky-100 shadow-[0_15px_40px_rgba(14,165,233,0.18)]' :
            'border-red-100 shadow-[0_15px_40px_rgba(153,0,0,0.18)]'
          }`}>
            {/* HOME / AKIŞ */}
            <button onClick={()=>setView(getFeedView())} className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
              effectiveRole === 'alumni' ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50' :
              effectiveRole === 'academic' ? 'text-slate-600 hover:text-purple-600 hover:bg-purple-50' :
              (effectiveRole === 'employer' || effectiveRole === 'company') ? 'text-slate-600 hover:text-sky-600 hover:bg-sky-50' :
              'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`} title="Ana Akışa Dön">
              <Home size={24} strokeWidth={2.2}/>
            </button>

            {/* JOBS - DYNAMIC VIBRANT GRADIENT BASED ON ROLE */}
            <button onClick={()=>setView('jobs')} className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer ${
              effectiveRole === 'alumni' ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-800 shadow-emerald-500/40' :
              effectiveRole === 'academic' ? 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 shadow-purple-950/40' :
              (effectiveRole === 'employer' || effectiveRole === 'company') ? 'bg-gradient-to-tr from-blue-950 via-indigo-900 to-sky-900 shadow-blue-950/40' :
              'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40'
            }`} title="İş & Staj Olanakları">
              <Briefcase size={22} strokeWidth={2.5}/>
            </button>

            {/* SEARCH / KEŞFET - DYNAMIC VIBRANT GRADIENT BASED ON ROLE */}
            <button onClick={()=>setView(getFeedView())} className={`w-12 h-10 sm:w-14 sm:h-11 rounded-2xl text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer ${
              effectiveRole === 'alumni' ? 'bg-gradient-to-tr from-teal-500 via-emerald-500 to-emerald-700 shadow-teal-500/40' :
              effectiveRole === 'academic' ? 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-indigo-900 shadow-purple-500/40' :
              (effectiveRole === 'employer' || effectiveRole === 'company') ? 'bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-900 shadow-sky-500/40' :
              'bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 shadow-red-900/40'
            }`} title="Keşfet'e Dön">
              <Search size={22} strokeWidth={2.8}/>
            </button>

            {/* PROFILE AVATAR */}
            <button onClick={()=>{ if (setSelectedUserId) setSelectedUserId(branchTargetId); setView('user_profile'); }} className={`w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer ${
              effectiveRole === 'alumni' ? 'border-emerald-500' :
              effectiveRole === 'academic' ? 'border-purple-600' :
              (effectiveRole === 'employer' || effectiveRole === 'company') ? 'border-sky-600' :
              'border-[#990000]'
            }`} title="Profilim">
              <SafeAvatar src={branchAvatar} name={branchName} size="xs" alt="Profile"/>
            </button>
          </div>
        </div>
      )}

      {selectedJob&&(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.currentTarget.click();}}} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={()=>setSelectedJob(null)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 flex flex-col">
            <div className="h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-t-2xl"></div>
            <div className="p-7">
              <button onClick={()=>setSelectedJob(null)} className="absolute top-5 right-5 w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors z-10"><X size={18}/></button>
              <div className="flex items-start gap-4 mb-6 pr-10">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">{selectedJob.logo?<img src={selectedJob.logo} alt="Logo" className="w-full h-full object-cover"/>:<Building2 className="text-gray-500" size={28}/>}</div>
                <div><h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{selectedJob.title}</h2><p className="text-[15px] font-bold text-[#990000]">{selectedJob.company}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"><MapPin size={13}/> {selectedJob.location}</span>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${typeColors[selectedJob.type]||'bg-gray-100 text-gray-700'}`}><Briefcase size={13}/> {selectedJob.type}</span>
                <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"><Calendar size={13}/> {selectedJob.deadline}</span>
              </div>

              {/* Handshake-Style AI Job Matchmaker Score Card */}
              <div className="mb-6">
                <JobMatchScoreCard studentProfile={currentUser} job={selectedJob} />
              </div>

              <div className="space-y-5">
                <div><h4 className="text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wide">Is Tanimi</h4><p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description||'Is tanimi belirtilmemis.'}</p></div>
                {selectedJob.requirements&&selectedJob.requirements.length>0&&(<div><h4 className="text-[13px] font-black text-gray-900 mb-3 uppercase tracking-wide">Aranan Nitelikler</h4><ul className="space-y-2">{selectedJob.requirements.map((req,i)=>(<li key={i} className="flex gap-2 items-start text-[13.5px] text-gray-700"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/><span>{req}</span></li>))}</ul></div>)}
              </div>
              <div className="mt-7 pt-5 border-t border-gray-100 flex gap-3">
                <button onClick={()=>setSelectedJob(null)} className="px-5 py-3 rounded-xl font-bold text-[14px] text-gray-600 hover:bg-gray-100 transition-all">Kapat</button>
                <button onClick={() => { const target = selectedJob; setSelectedJob(null); setApplyModalJob(target); }} disabled={applications.some(a=>a.jobId===selectedJob.id&&(a.applicantId===branchTargetId||a.applicantId===currentUser?.id))} className={`flex-1 py-3 rounded-xl font-black text-[14px] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${applications.some(a=>a.jobId===selectedJob.id&&(a.applicantId===branchTargetId||a.applicantId===currentUser?.id))?'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none':'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/30 hover:scale-[1.02]'}`}>
                  {applications.some(a=>a.jobId===selectedJob.id&&(a.applicantId===branchTargetId||a.applicantId===currentUser?.id))?<><CheckCircle2 size={16}/> Başvuruldu</>:'Hemen Başvur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── KGM İŞ & STAJ BAŞVURU FORM MODALI (Z-[9999] OVERLAY) ─── */}
      {applyModalJob && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] relative">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 text-purple-300 flex items-center justify-center font-black">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">İş & Staj Başvuru Formu</h3>
                  <p className="text-[11px] text-purple-200 font-medium">KGM & Firma Denetimli Başvuru Paneli</p>
                </div>
              </div>

              <button 
                onClick={() => setApplyModalJob(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCompleteApplication} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 bg-white custom-scrollbar">
              
              {/* Selected Job Banner */}
              <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white border border-purple-200 overflow-hidden flex items-center justify-center shrink-0">
                    {applyModalJob.logo ? <img src={applyModalJob.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={22} className="text-purple-600" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Başvurulan Pozisyon</p>
                    <h4 className="font-black text-slate-900 text-sm truncate">{applyModalJob.title}</h4>
                    <p className="text-[11px] text-slate-500 font-semibold truncate">{applyModalJob.company} • {applyModalJob.location}</p>
                  </div>
                </div>
                <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                  {applyModalJob.type || 'İlan'}
                </span>
              </div>

              {/* Student Identity Overview */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Başvuran Bilgileri</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Ad Soyad:</span>
                    <p className="font-bold text-slate-900">{branchName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Bölüm:</span>
                    <p className="font-bold text-slate-900">{branchDept}</p>
                  </div>
                </div>
              </div>

              {/* Field 1: Phone */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">İletişim Telefon Numarası *</label>
                <input 
                  type="text" 
                  required
                  value={appForm.phone}
                  onChange={e => setAppForm({ ...appForm, phone: e.target.value })}
                  placeholder="05xx xxx xx xx"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                />
              </div>

              {/* Field 2: CV Selection */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">Eklenecek Özgeçmiş / CV *</label>
                <select 
                  value={appForm.cvType}
                  onChange={e => setAppForm({ ...appForm, cvType: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600"
                >
                  <option value="KGM Akredite İESÜ Dijital CV">KGM Akredite İESÜ Dijital Özgeçmiş (Profilinizdeki Otomatik CV)</option>
                  <option value="Özel Yüklenen PDF CV">İESÜ Kariyer Havuzundaki Yüklenmiş PDF CV</option>
                </select>
              </div>

              {/* Field 3: Cover Letter */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black text-slate-800">Ön Yazı / Firmaya Mesajınız *</label>
                  <button
                    type="button"
                    onClick={() => setShowAnkaModal(true)}
                    className="text-[11px] font-black text-purple-700 hover:text-purple-900 flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition border border-purple-200 cursor-pointer shadow-xs"
                    title="Yapay zeka ile kişiselleştirilmiş profesyonel ön yazı üret"
                  >
                    <Sparkles size={13} className="text-purple-600 animate-pulse" /> Anka AI ile Otomatik Yaz
                  </button>
                </div>
                <textarea 
                  rows={4}
                  required
                  value={appForm.coverLetter}
                  onChange={e => setAppForm({ ...appForm, coverLetter: e.target.value })}
                  placeholder="Bu pozisyon ile neden ilgileniyorsunuz? Firmaya ve KGM'ye iletmek istediğiniz detayları belirtiniz..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                ></textarea>
              </div>

              {/* Info Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 font-medium">
                <CheckCircle2 size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>Bu başvuru formu otomatik olarak hem <b>KGM Yönetici Paneline</b> hem de <b>{applyModalJob.company} İlan Havuzuna</b> anlık kaydedilecektir.</span>
              </div>

              {/* Submit Action */}
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer"
                >
                  Başvuruyu Tamamla & İlet
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* STUDENT DOCUMENT SUBMIT MODAL */}
      <StudentDocumentSubmitModal
        isOpen={showDocSubmitModal}
        onClose={() => setShowDocSubmitModal(false)}
        currentUser={currentUser}
      />

      {/* ANKA AI COVER LETTER MODAL */}
      {showAnkaModal && applyModalJob && (
        <AnkaCoverLetterModal
          job={applyModalJob}
          currentUser={currentUser}
          onClose={() => setShowAnkaModal(false)}
          onConfirm={(generatedLetter) => {
            setAppForm(prev => ({ ...prev, coverLetter: generatedLetter }));
            setShowAnkaModal(false);
            window.toast?.success?.("✅ Anka AI ön yazınız başvuru formuna aktarıldı.");
          }}
        />
      )}

      {footerModal&&<FooterModals type={footerModal} onClose={()=>setFooterModal(null)}/>}
    </div>
  );
}
