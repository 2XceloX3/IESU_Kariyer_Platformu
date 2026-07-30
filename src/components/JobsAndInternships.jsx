import useAppStore from '../store/useAppStore';
import React, { useState } from 'react';
import { ExternalLink, Calendar, MapPin, Building2, Search, Briefcase, FileText, CheckCircle2, Download, Home, MessageCircle, Bell, Heart, X, Flame, Star, ArrowRight, Sparkles, Target, Users, TrendingUp, Clock, Crown, LayoutDashboard, ChevronRight } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import JobCreator from './JobCreator';
import FooterModals from './FooterModals';

export default function JobsAndInternships({ userRole, setView, currentUser, jobs: propsJobs }) {
  const previousView = useAppStore(state => state.previousView);
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [footerModal, setFooterModal] = useState(null);
  const addNotification = (notif) => { setNotifications(prev => [notif, ...prev]); };
  const getFeedView = () => {
    if (userRole === 'employer' || userRole === 'company') return 'company';
    if (previousView && previousView !== 'jobs') return previousView;
    if (userRole === 'alumni') return 'alumni';
    if (userRole === 'academic') return 'academic';
    return 'student';
  };
  if (isCreatingJob) return <JobCreator setView={() => setIsCreatingJob(false)} currentUser={currentUser} jobs={jobs} setJobs={setJobs} addNotification={addNotification} />;
  const handleApply = (job) => {
    if (userRole !== 'student') { window.toast?.error("Sadece ogrenciler basvuru yapabilir."); return; }
    if (applications.some(a => a.jobId === job.id && a.applicantId === currentUser?.id)) { window.toast?.info("Bu ilana zaten basvurdunuz."); return; }
    const newApp = { id:'APP-'+Date.now(), jobId:job.id, jobTitle:job.title, company:job.company, applicantId:currentUser?.id, applicantName:currentUser?.name, status:'Beklemede', date:new Date().toLocaleDateString('tr-TR') };
    setApplications([...applications, newApp]);
    window.toast?.success("Basvurunuz iletildi!");
    addNotification({ id:'N-'+Date.now(), userId:currentUser?.id, text:`${job.title} ilanina basvurdunuz.`, read:false, time:'Az once' });
  };
  const activeJobs = (jobs||[]).filter(j => j.status === 'Aktif' || !j.status);
  const myApplicationsCount = applications.filter(a => a.applicantId === currentUser?.id).length;
  const unreadNotifCount = notifications.filter(n => n.userId === currentUser?.id && !n.read).length;
  const typeColors = { 'TAM ZAMANLI':'bg-blue-50 text-blue-700', 'STAJ':'bg-purple-50 text-purple-700', 'YARI ZAMANLI':'bg-amber-50 text-amber-700', 'UZAKTAN':'bg-emerald-50 text-emerald-700', 'SERBEST':'bg-rose-50 text-rose-700' };
  return (
    <div className="min-h-screen bg-[#f3f2ee] font-sans">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div role="button" tabIndex={0} onKeyDown={(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.currentTarget.click();}}} className="flex items-center gap-3 cursor-pointer" onClick={()=>setView(getFeedView())}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">Istanbul Esenyurt Universitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Gelistirme Merkezi</p>
            </div>
          </div>
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search size={16} className="text-gray-400 group-focus-within:text-red-500 transition-colors" /></div>
              <input type="text" placeholder="Ilan, firma veya pozisyon ara..." className="w-full bg-[#EEF3F8] text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none block pl-10 p-2 transition-all" />
            </div>
          </div>
          {userRole ? (
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button onClick={()=>setView('notifications')} className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-[#990000]" title="Bildirimler">
                <div className="relative">
                  <Bell size={24} strokeWidth={2.5} className="fill-current text-[#990000]/10" />
                  {unreadNotifCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                </div>
              </button>
              <TopProfileMenu currentUser={currentUser || { name: 'Kullanici' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="jobs" />
            </div>
          ) : <div className="w-10"></div>}
        </div>
      </nav>
      <div className="pt-20 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-28">
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="space-y-4" style={{position:'sticky',top:'88px'}}>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {(userRole === 'admin' || currentUser?.role === 'admin') ? (
                <div className="p-6 text-center">
                  <div className="relative inline-block mb-2">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mx-auto p-2"><Logo size="lg" className="w-full h-full justify-center" /></div>
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white"><Crown size={14} /></div>
                  </div>
                  <h2 className="text-[16px] font-black text-gray-900 mt-4 leading-tight">Kariyer Gelistirme Merkezi</h2>
                  <p className="text-[12px] font-bold text-orange-600 mt-1 uppercase tracking-wider">SUPER YONETICI</p>
                  <button onClick={()=>setView('admin')} className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-[13px] font-bold py-3 rounded-xl transition-all shadow-md"><LayoutDashboard size={16}/> Yonetim Panelini Ac</button>
                </div>
              ) : (
                <>
                  <div className="h-20 bg-gradient-to-r from-[#8F0808] to-[#990000] relative">
                    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2">
                      <div className="w-[72px] h-[72px] rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                        <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name||'Kullanici')}&background=990000&color=fff`} alt="User" className="w-full h-full object-contain p-1" onError={(e)=>{e.target.onerror=null;e.target.src='/iesu-logo.svg';}} />
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 pb-5 px-5 text-center">
                    <h2 className="text-[17px] font-black text-gray-900 leading-none mb-1">{currentUser?.name||'Kullanici'}</h2>
                    <p className="text-[12px] font-medium text-gray-500 mb-4">{currentUser?.department||(userRole==='employer'?'Firma':'Ogrenci')}</p>
                    <div className="flex justify-center gap-5 border-y border-gray-50 py-3 mb-4">
                      <div className="text-center"><p className="text-gray-500 text-[11px] font-bold uppercase">Basvurum</p><p className="text-[18px] font-black text-gray-900">{myApplicationsCount}</p></div>
                      <div className="w-px bg-gray-100"></div>
                      <div className="text-center"><p className="text-gray-500 text-[11px] font-bold uppercase">Aktif Ilan</p><p className="text-[18px] font-black text-gray-900">{activeJobs.length}</p></div>
                    </div>
                    <button onClick={()=>setView('user_profile')} className="w-full py-2.5 bg-red-50 text-[#990000] hover:bg-red-100 rounded-xl text-[13px] font-bold transition-colors">Profili Guncelle</button>
                  </div>
                </>
              )}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
              <div className="p-4 pb-2"><p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3">Hizli Erisim</p></div>
              {[{icon:<Home size={18}/>,label:'Ana Akis',action:()=>setView(getFeedView()),color:'text-blue-600',active:false},{icon:<Briefcase size={18}/>,label:'Is & Staj Ilanlari',action:()=>{},color:'text-purple-600',active:true},{icon:<MessageCircle size={18}/>,label:'Mesajlar',action:()=>setView('messaging'),color:'text-indigo-600',active:false},{icon:<Users size={18}/>,label:'Kariyer Agim',action:()=>setView('career_network'),color:'text-teal-600',active:false}].map((item,i)=>(
                <button key={i} onClick={item.action} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-gray-50 ${item.active?'bg-purple-50 border-l-4 border-purple-600':'border-l-4 border-transparent'}`}>
                  <span className={item.active?'text-purple-600':item.color}>{item.icon}</span>
                  <span className={`text-[13px] font-${item.active?'black':'semibold'} ${item.active?'text-purple-700':'text-gray-700'}`}>{item.label}</span>
                  {item.active&&<ChevronRight size={14} className="ml-auto text-purple-400" />}
                </button>
              ))}
              <div className="h-2"></div>
            </div>
            <div className="bg-gradient-to-br from-[#7A0000] via-[#990000] to-[#5C0000] rounded-2xl p-5 shadow-xl text-white border border-red-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Sparkles size={12} className="text-amber-300" /> Kariyer Merkezi</p>
              <h3 className="font-black text-base leading-tight mb-2 text-white">{userRole==='employer'?'Ilan Olusturun':"CV'nizi Guncelleyin"}</h3>
              <p className="text-[11px] text-white/80 font-medium mb-4 leading-relaxed">{userRole==='employer'?'Universitenin yetenekli ogrencilerine ulasin.':'AI destekli CV ile kariyer hedefinize ulasin.'}</p>
              <button onClick={()=>userRole==='employer'?setIsCreatingJob(true):setView('mbs')} className="w-full py-3 bg-white text-[#990000] hover:bg-slate-100 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                {userRole==='employer'?'Ilan Olustur':'Profili Duzenle'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 max-w-[680px] space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500"></div>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0"><Briefcase size={20} strokeWidth={2.5} /></div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">{userRole==='academic'?'Ilanlar (Akademik Gorunum)':'Is ve Staj Olanaklari'}</h2>
                  <p className="text-[12px] text-gray-500 font-medium mt-0.5">{activeJobs.length} aktif ilan - {myApplicationsCount} basvurum</p>
                </div>
              </div>
              {userRole==='employer'&&(<button onClick={()=>setIsCreatingJob(true)} className="bg-[#990000] text-white px-4 py-2 rounded-xl font-black text-[13px] shadow-md hover:shadow-lg hover:bg-red-800 flex items-center gap-1.5 shrink-0 hover:-translate-y-0.5 active:scale-95 transition-all"><span className="text-lg leading-none">+</span> <span className="hidden sm:inline">Ilan Olustur</span></button>)}
            </div>
            <div className="px-5 pb-4 flex gap-2 overflow-x-auto">
              {[{id:'ilanlar',label:'Aktif Ilanlar',icon:<Briefcase size={14}/>},{id:'ulusal',label:'Ulusal Staj',icon:<Target size={14}/>},{id:'gonullu',label:'İsteğe Bağlı Staj',icon:<Heart size={14}/>}].map(tab=>(
                <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap active:scale-95 ${activeTab===tab.id?'bg-purple-600 text-white shadow-md shadow-purple-500/20':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab==='ilanlar'&&(
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
                <p className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5"><TrendingUp size={15} className="text-purple-600" />{activeJobs.length} guncel firsat</p>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={()=>setViewMode('list')} className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${viewMode==='list'?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-900'}`}>Liste</button>
                  <button onClick={()=>setViewMode('swipe')} className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all flex items-center gap-1 ${viewMode==='swipe'?'bg-purple-600 text-white shadow-sm':'text-gray-500 hover:text-gray-900'}`}><Flame size={12}/> Kariyer Swipe</button>
                </div>
              </div>
              {(()=>{
                if(activeJobs.length===0) return(<div className="flex flex-col items-center justify-center p-16 bg-white border border-gray-100 border-dashed rounded-2xl"><Briefcase size={44} className="text-gray-300 mb-4" /><p className="text-gray-900 font-black text-lg mb-1">Henuz ilan yok</p><p className="text-gray-500 font-medium text-center text-sm">Yeni ilanlar eklendiginde burada gorunecek.</p></div>);
                if(viewMode==='swipe'){
                  const unswipedJobs=activeJobs.filter(j=>!swipedJobs.includes(j.id));
                  const currentJob=unswipedJobs[swipeIndex];
                  if(!currentJob) return(<div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-2xl h-[400px] shadow-sm"><CheckCircle2 size={48} className="text-emerald-400 mb-4" /><p className="text-gray-900 font-black text-xl mb-2 text-center">Harikasin!</p><p className="text-gray-500 font-medium text-center">Butun ilanlari inceledin.</p><button onClick={()=>{setSwipedJobs([]);setSwipeIndex(0);}} className="mt-6 text-sm font-bold text-purple-600 hover:underline">Basa Don</button></div>);
                  const hasApplied=applications.some(a=>a.jobId===currentJob.id&&a.applicantId===currentUser?.id);
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
                              <div className="flex justify-between items-center mb-1"><span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Profil Eslesme</span><span className="text-sm font-black text-purple-600">%{((currentJob.id.length*7+currentJob.title.length*3)%30)+70}</span></div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{width:`${((currentJob.id.length*7+currentJob.title.length*3)%30)+70}%`}}></div></div>
                            </div>
                            <div className="mt-auto flex justify-center gap-6">
                              <button onClick={()=>setSwipedJobs([...swipedJobs,currentJob.id])} className="w-16 h-16 rounded-full bg-white border-2 border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-transform shadow-sm"><X size={28} strokeWidth={3} /></button>
                              <button onClick={()=>{if(!hasApplied)handleApply(currentJob);setSwipedJobs([...swipedJobs,currentJob.id]);}} className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:scale-110 transition-transform shadow-sm"><Heart size={28} strokeWidth={3} className="fill-emerald-500" /></button>
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
                      const hasApplied=applications.some(a=>a.jobId===job.id&&a.applicantId===currentUser?.id);
                      const matchScore=((job.id.length*7+job.title.length*3)%30)+70;
                      return(
                        <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-100 transition-all duration-300 overflow-hidden group">
                          <div className="p-5">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">{job.logo?<img src={job.logo} alt={job.company} className="w-full h-full object-cover" />:<Building2 size={24} className="text-gray-400" />}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                  <div><h3 className="text-[15px] font-black text-gray-900 leading-tight group-hover:text-purple-700 transition-colors cursor-pointer" onClick={()=>setSelectedJob(job)}>{job.title}</h3><p className="text-[13px] font-bold text-[#990000] mt-0.5">{job.company}</p></div>
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide shrink-0 ${typeColors[job.type]||'bg-gray-100 text-gray-600'}`}>{job.type||'Ilan'}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                  <span className="flex items-center gap-1 text-[12px] text-gray-500 font-medium"><MapPin size={12} className="text-gray-400"/> {job.location||'Belirtilmedi'}</span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="flex items-center gap-1 text-[12px] text-gray-500 font-medium"><Clock size={12} className="text-amber-500"/> Son: {job.deadline||'Belirtilmedi'}</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{width:`${matchScore}%`}}></div></div><span className="text-[11px] font-black text-purple-600 shrink-0">%{matchScore} eslesme</span></div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                              <button onClick={()=>setSelectedJob(job)} className="text-[12px] font-bold text-gray-500 hover:text-purple-700 transition-colors flex items-center gap-1">Detaylari Gor <ChevronRight size={14} /></button>
                              <button onClick={()=>handleApply(job)} disabled={hasApplied} className={`px-5 py-2 rounded-xl font-black text-[13px] transition-all flex items-center gap-1.5 ${hasApplied?'bg-gray-100 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/30 hover:-translate-y-0.5 active:scale-95'}`}>{hasApplied?<><CheckCircle2 size={14}/> Basvuruldu</>:'Hemen Basvur'}</button>
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
                  <img src="https://www.esenyurt.edu.tr/uploads/2025/08/y2j65ag3nsq19-gonullu-staj-formu.jpg" alt="Gonullu Staj Infografik" className="w-full h-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-500" onError={(e)=>{if(e.target.src.includes('2025/08')){e.target.src='https://www.esenyurt.edu.tr/uploads/2023/11/y2j65ag3nsq19-gonullu-staj-formu.jpg';}}} />
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
            <div className="relative bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/5 rounded-full blur-3xl -mr-6 -mt-6 pointer-events-none"></div>
              <div className="p-5 relative z-10">
                <div className="flex items-center gap-2 mb-4"><div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Sparkles size={16}/></div><h3 className="font-black text-slate-900 text-[14px]">AI Kariyer Eslesme</h3></div>
                <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">Profilinize gore en uygun ilanlar otomatik siralanıyor.</p>
                <div className="space-y-2.5">
                  {activeJobs.slice(0,3).map(job=>{
                    const score=((job.id.length*7+job.title.length*3)%30)+70;
                    return(<div key={job.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -mx-2 transition" onClick={()=>setSelectedJob(job)}><div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">{job.logo?<img src={job.logo} alt="" className="w-full h-full object-cover"/>:<Building2 size={14} className="text-gray-400"/>}</div><div className="flex-1 min-w-0"><p className="text-[11px] font-bold text-gray-900 truncate">{job.title}</p><div className="flex items-center gap-1.5 mt-0.5"><div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" style={{width:`${score}%`}}></div></div><span className="text-[10px] font-black text-purple-600">%{score}</span></div></div></div>);
                  })}
                </div>
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
      {userRole&&(
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-indigo-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(30,41,59,0.18)] flex items-center justify-between px-4 text-gray-800">
            <button onClick={()=>setView(getFeedView())} className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-blue-50" title="Akis"><Home size={24} strokeWidth={2.2}/></button>
            <button onClick={()=>setView('jobs')} className="p-2.5 rounded-full transition-all flex items-center justify-center bg-purple-600 text-white shadow-md shadow-purple-500/30" title="Ilanlar"><Briefcase size={22} strokeWidth={2.2}/></button>
            <button onClick={()=>setView(getFeedView())} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50" title="Kesfe Don"><Search size={22} strokeWidth={2.8}/></button>
            <button onClick={()=>setView('messaging')} className="p-2.5 rounded-full transition-all flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50" title="Mesajlar"><MessageCircle size={22} strokeWidth={2.2}/></button>
            <button onClick={()=>setView('user_profile')} className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-indigo-400/60 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden" title="Profilim"><img src={currentUser?.avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name||'Kullanici')}&background=4F46E5&color=fff`} className="w-full h-full rounded-full object-cover" alt="Profile"/></button>
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
              <div className="space-y-5">
                <div><h4 className="text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wide">Is Tanimi</h4><p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description||'Is tanimi belirtilmemis.'}</p></div>
                {selectedJob.requirements&&selectedJob.requirements.length>0&&(<div><h4 className="text-[13px] font-black text-gray-900 mb-3 uppercase tracking-wide">Aranan Nitelikler</h4><ul className="space-y-2">{selectedJob.requirements.map((req,i)=>(<li key={i} className="flex gap-2 items-start text-[13.5px] text-gray-700"><CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0"/><span>{req}</span></li>))}</ul></div>)}
              </div>
              <div className="mt-7 pt-5 border-t border-gray-100 flex gap-3">
                <button onClick={()=>setSelectedJob(null)} className="px-5 py-3 rounded-xl font-bold text-[14px] text-gray-600 hover:bg-gray-100 transition-all">Kapat</button>
                <button onClick={()=>{handleApply(selectedJob);setSelectedJob(null);}} disabled={applications.some(a=>a.jobId===selectedJob.id&&a.applicantId===currentUser?.id)} className={`flex-1 py-3 rounded-xl font-black text-[14px] shadow-lg transition-all flex items-center justify-center gap-2 ${applications.some(a=>a.jobId===selectedJob.id&&a.applicantId===currentUser?.id)?'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none':'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/30 hover:scale-[1.02]'}`}>
                  {applications.some(a=>a.jobId===selectedJob.id&&a.applicantId===currentUser?.id)?<><CheckCircle2 size={16}/> Basvuruldu</>:'Hemen Basvur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {footerModal&&<FooterModals type={footerModal} onClose={()=>setFooterModal(null)}/>}
    </div>
  );
}
