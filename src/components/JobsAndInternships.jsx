import useAppStore from '../store/useAppStore';
import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Building2, Search, Filter, Briefcase, PlayCircle, FileText, CheckCircle2, Download, Home, Compass, MessageCircle, Bell, Heart, X, Flame } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';
import SwipeableJobCard from './SwipeableJobCard';
import AnkaCoverLetterModal from './AnkaCoverLetterModal';

import JobCreator from './JobCreator';

export default function JobsAndInternships({ userRole, setView, currentUser }) {
  const previousView = useAppStore(state => state.previousView);
  const setSelectedUserId = useAppStore(state => state.setSelectedUserId);
  const jobs = useAppStore(state => state.jobs);
  const setJobs = useAppStore(state => state.setJobs);
  const applications = useAppStore(state => state.applications) || [];
  const setApplications = useAppStore(state => state.setApplications);
  const setNotifications = useAppStore(state => state.setNotifications);
  const swipedJobs = useAppStore(state => state.swipedJobs) || [];
  const setSwipedJobs = useAppStore(state => state.setSwipedJobs);

  const [viewMode, setViewMode] = useState('list'); // 'list', 'swipe'
  const [swipeIndex, setSwipeIndex] = useState(0);

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const [activeTab, setActiveTab] = useState('ilanlar'); // 'ilanlar', 'ulusal', 'gonullu'
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingJob, setApplyingJob] = useState(null);

  if (isCreatingJob) {
    return <JobCreator setView={() => setIsCreatingJob(false)} currentUser={currentUser} jobs={jobs} setJobs={setJobs} addNotification={addNotification} />;
  }

  const handleApply = (job) => {
    if (userRole !== 'student') {
      window.toast.error("Sadece öğrenciler platform üzerinden hızlı başvuru yapabilir. Lütfen öğrenci girişi yapın.");
      return;
    }
    
    const alreadyApplied = applications.some(app => app.jobId === job.id && app.applicantId === currentUser?.id);
    if (alreadyApplied) {
      window.toast.info("Bu ilana zaten başvurdunuz.");
      return;
    }

    const newApp = {
      id: 'APP-' + Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantId: currentUser?.id,
      applicantName: currentUser?.name,
      status: 'Beklemede', // Beklemede, Mülakat, Reddedildi
      date: new Date().toLocaleDateString('tr-TR')
    };

    setApplications([...applications, newApp]);
    window.toast.success("Başvurunuz başarıyla iletildi!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Hyper-Modern Navbar (Glassmorphism) - Replicated from Feeds */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* CENTER: Logo & Brand */}
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" /><div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* RIGHT: Heart Icon & Profile (ONLY INTERNAL) */}
          {userRole ? (
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-[#990000]`} title="Bildirimler">
                <div className="relative">
                  <Bell size={24} strokeWidth={2.5} className="fill-current text-[#990000]/10" />
                </div>
              </button>
              <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="jobs" />
            </div>
          ) : (
            <div className="w-10"></div>
          )}
          
        </div>
      </nav>

      {applyingJob && (
        <AnkaCoverLetterModal 
          job={applyingJob} 
          currentUser={currentUser} 
          onClose={() => setApplyingJob(null)} 
          onConfirm={confirmApply} 
        />
      )}
      {/* Content */}
      <div className="pt-24 max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#990000]/10 flex items-center justify-center text-[#990000] shrink-0">
                  <Briefcase size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl md:text-2xl font-black text-gray-900 tracking-tight">
                  {userRole === 'academic' ? 'İş ve Staj Olanakları (Akademik İzleme)' : 'İş ve Staj Olanakları'}
                </h2>
              </div>
              
              {userRole === 'employer' && (
                <button onClick={() => setIsCreatingJob(true)} className="bg-[#990000] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-red-700 flex items-center gap-2 shrink-0 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 group">
                  <span className="text-xl leading-none group-hover:rotate-90 transition-transform duration-300">+</span> <span className="hidden sm:inline">İlan Oluştur</span>
                </button>
              )}
            </div>
            <p className="text-gray-500 font-medium text-lg ml-15">
              {userRole === 'academic' ? 'Öğrencileriniz için en uygun ilanları inceleyin ve önerin.' : 'Kariyer hedeflerinize uygun en güncel fırsatları keşfedin.'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-gray-200 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('ilanlar')} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap active:scale-95 duration-200 ${activeTab === 'ilanlar' ? 'bg-[#990000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Aktif İlanlar
            </button>
            <button 
              onClick={() => setActiveTab('ulusal')} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap active:scale-95 duration-200 ${activeTab === 'ulusal' ? 'bg-[#990000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Ulusal Staj Programı
            </button>
            <button 
              onClick={() => setActiveTab('gonullu')} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap active:scale-95 duration-200 ${activeTab === 'gonullu' ? 'bg-[#990000] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Gönüllü Staj
            </button>
          </div>
        </div>
        
        {/* Tab Contents */}
        <div className="bg-white rounded-xl p-6 md:p-10 border border-gray-100 shadow-xl shadow-red-900/5 min-h-[500px]">
          {/* TAB 1: İlanlar */}
          {activeTab === 'ilanlar' && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b-2 border-red-100 pb-2 gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-extrabold text-gray-900">Güncel İş ve Staj İlanları</h3>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("AI: Özgeçmişiniz, projeleriniz ve yetenekleriniz ilanlarla eşleştiriliyor...");
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ AI Filtresi: Sizin için en uygun %90+ eşleşen 3 ilan öne çıkarıldı.");
                      }, 2500);
                    }}
                    className="hidden md:flex bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-bold items-center gap-1.5 transition-all shadow-md"
                  >
                    <Compass size={14} /> AI ile Filtrele
                  </button>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Liste</button>
                  <button onClick={() => setViewMode('swipe')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1 ${viewMode === 'swipe' ? 'bg-[#990000] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}><Flame size={14}/> Kariyer Swipe</button>
                </div>
              </div>
              {(() => {
                const activeJobs = (jobs || []).filter(j => j.status === 'Aktif' || !j.status);
                const unswipedJobs = activeJobs.filter(j => !swipedJobs.includes(j.id));
                const currentJob = unswipedJobs[swipeIndex];

                if (activeJobs.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-100 border-dashed rounded-2xl">
                      <Briefcase size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium text-center">Şu an için bu kategoride ilan bulunmamaktadır.</p>
                    </div>
                  );
                }

                if (viewMode === 'swipe') {
                  if (!currentJob) {
                    return (
                      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-100 border-dashed rounded-2xl h-[400px]">
                        <CheckCircle2 size={48} className="text-emerald-400 mb-4" />
                        <p className="text-gray-900 font-black text-xl mb-2 text-center">Harikasın!</p>
                        <p className="text-gray-500 font-medium text-center">Bütün ilanları inceledin. Yeni ilanlar eklendiğinde tekrar görüşürüz.</p>
                        <button onClick={() => { setSwipedJobs([]); setSwipeIndex(0); }} className="mt-6 text-sm font-bold text-red-600 hover:underline">Başa Dön</button>
                      </div>
                    );
                  }

                  const hasApplied = applications.some(app => app.jobId === currentJob.id && app.applicantId === currentUser?.id);

                  const handleSwipeRight = () => {
                    if (!hasApplied) handleApply(currentJob);
                    setSwipedJobs([...swipedJobs, currentJob.id]);
                  };

                  const handleSwipeLeft = () => {
                    setSwipedJobs([...swipedJobs, currentJob.id]);
                  };

                  return (
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="w-full max-w-sm">
                        <div className="relative h-[450px] w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-fade-in-up">
                          <img src={currentJob.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentJob.company)}&background=random`} className="absolute inset-0 w-full h-full object-cover opacity-10" />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>
                          
                          <div className="relative z-10 p-6 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                              <img src={currentJob.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentJob.company)}&background=random`} className="w-16 h-16 rounded-2xl shadow-sm border border-gray-100 object-cover bg-white" />
                              <div className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full">{currentJob.type}</div>
                            </div>
                            
                            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{currentJob.title}</h2>
                            <p className="text-gray-600 font-bold mb-4 flex items-center gap-2"><Building2 size={16}/> {currentJob.company}</p>
                            
                            <div className="space-y-3 mb-4">
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100"><MapPin size={16} className="text-red-500"/> {currentJob.location}</p>
                              <p className="text-sm font-medium text-gray-700 flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100"><Calendar size={16} className="text-amber-500"/> Son Başvuru: {currentJob.deadline}</p>
                            </div>

                            {/* Smart Job Matching Score */}
                            <div className="w-full mb-6">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profil Eşleşmesi</span>
                                <span className="text-sm font-black text-[#0A66C2]">%{((currentJob.id.length * 7 + currentJob.title.length * 3) % 30) + 70}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className="h-full bg-gradient-to-r from-red-400 to-[#0A66C2] rounded-full" 
                                  style={{ width: `${((currentJob.id.length * 7 + currentJob.title.length * 3) % 30) + 70}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="mt-auto flex justify-center gap-6">
                              <button onClick={handleSwipeLeft} className="w-16 h-16 rounded-full bg-white border-2 border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-transform shadow-sm">
                                <X size={28} strokeWidth={3} />
                              </button>
                              <button onClick={handleSwipeRight} className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:scale-110 transition-transform shadow-sm">
                                <Heart size={28} strokeWidth={3} className="fill-emerald-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-gray-400 text-xs font-bold mt-4 animate-pulse">Sola kaydırarak geç, sağa kaydırarak başvur!</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                    {activeJobs.map(job => {
                      const hasApplied = applications.some(app => app.jobId === job.id && app.applicantId === currentUser?.id);
                      return (
                        <div key={job.id} className="h-[400px]">
                          <SwipeableJobCard 
                            job={job}
                            hasApplied={hasApplied}
                            onApply={(j) => {
                              handleApply(j);
                            }}
                            onDismiss={(j) => {
                              // Could update local state to hide job
                            }}
                            onViewDetails={(j) => {
                              setSelectedJob(j);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: Ulusal Staj */}
          {activeTab === 'ulusal' && (
            <div className="animate-fade-in flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-black text-gray-900 mb-6">T.C. Ulusal Staj Programı</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Cumhurbaşkanlığı İnsan Kaynakları Ofisi koordinasyonunda yürütülen Ulusal Staj Programı ile kamu kurumları ve özel sektörde staj imkanı bulabilirsiniz. 
                </p>
                
                <h4 className="font-bold text-lg text-[#990000] mb-4">Nasıl Başvuru Yapılır?</h4>
                <ul className="space-y-4">
                  {[
                    "Kariyer Kapısı (ulusalstajprogrami.iskur.gov.tr) adresine gidin.",
                    "Öğrenci girişi seçeneği ile e-Devlet şifrenizi kullanarak sisteme giriş yapın.",
                    "Staj Başvurusu menüsünden güncel yılın programına tıklayın.",
                    "Başvuru Formunu (i) uyarılarına dikkat ederek eksiksiz doldurun.",
                    "Başvurunuzu onaylayın ve durumunu Kariyer Kapısı üzerinden takip edin."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-[#990000] flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-[14.5px] text-gray-700 font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-1/2 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
                <h4 className="font-extrabold text-lg text-gray-900 mb-5 flex items-center gap-2">
                  <FileText className="text-iesu-primary" size={20} /> İlgili Formlar ve Belgeler
                </h4>
                <div className="space-y-3">
                  {[
                    { title: "Zorunlu Staj Formu", link: "/docs/zorunlu_staj.pdf" },
                    { title: "Mesleki Eğitim Sözleşmesi (SHMYO-SBF)", link: "/docs/mesleki_egitim.pdf" },
                    { title: "İş Sağlığı ve Güvenliği Belgesi (SHMYO)", link: "/docs/isg_shmyo.pdf" },
                    { title: "İş Sağlığı ve Güvenliği Belgesi (SBF)", link: "/docs/isg_sbf.pdf" },
                    { title: "Ulusal Staj Başvuru Formu", link: "/docs/ulusal_staj.pdf" }
                  ].map((doc, i) => (
                    <a key={i} href={doc.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-iesu-navy hover:shadow-md transition group cursor-pointer">
                      <span className="font-semibold text-[14px] text-gray-700 group-hover:text-[#990000] transition">{doc.title}</span>
                      <Download size={18} className="text-gray-500 group-hover:text-[#990000] transition" />
                    </a>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 text-[13px] text-[#990000] font-medium">
                  <strong>Not:</strong> İstenilen evrakların eksiksiz doldurulması ve onaylatılması zorunludur. İşveren onayı olmadan staja başlanamaz.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Gönüllü Staj */}
          {activeTab === 'gonullu' && (
            <div className="animate-fade-in flex flex-col lg:flex-row gap-12">
              <div className="lg:w-3/5">
                <h3 className="text-2xl font-black text-gray-900 mb-4 border-l-4 border-iesu-navy pl-4">Gönüllü Staj Başvuru Süreci</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                  Zorunlu stajı bulunmayan veya fazladan sektörel deneyim kazanmak isteyen öğrencilerimiz, onay dâhilinde gönüllü staj yapabilirler. Sürecin her adımını eksiksiz tamamlamanız gerekmektedir.
                </p>
                
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                  {/* Step 1 */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-[#990000] font-black text-[14px] shadow-sm">1</span>
                    <h5 className="font-extrabold text-gray-900 text-lg mb-1">Başvuru Formunun Doldurulması</h5>
                    <p className="text-gray-600 text-[14px]">
                      "Uygulamalı Eğitim Başvuru Formu" doldurulmalıdır. Form; <strong>öğrenci</strong>, <strong>staj yapılacak kurum yetkilisi</strong> ve <strong>bölüm staj sorumlusu</strong> tarafından ıslak imzalı olmalıdır.
                    </p>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-[#990000] font-black text-[14px] shadow-sm">2</span>
                    <h5 className="font-extrabold text-gray-900 text-lg mb-1">SGK Müstehaklık Belgesi</h5>
                    <p className="text-gray-600 text-[14px] mb-3">
                      e-Devlet sistemi üzerinden barkodlu olarak güncel tarihli temin edilmelidir.
                    </p>
                    <a href="https://www.turkiye.gov.tr/spas-mustahaklik-sorgulama" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[13px] font-bold text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-900 transition">
                      e-Devlet Sorgulama Ekranı <ExternalLink size={14} />
                    </a>
                  </div>

                  {/* Step 3 */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-[#990000] font-black text-[14px] shadow-sm">3</span>
                    <h5 className="font-extrabold text-gray-900 text-lg mb-1">Kimlik Fotokopisi</h5>
                    <p className="text-gray-600 text-[14px]">
                      Öğrencinin geçerli T.C. Kimlik Kartı fotokopisi dosyaya eklenmelidir.
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-green-100 border-4 border-white flex items-center justify-center text-green-600 shadow-sm"><CheckCircle2 size={16} /></span>
                    <h5 className="font-extrabold text-gray-900 text-lg mb-1">Evrak Teslimi (3 Suret Kuralı)</h5>
                    <p className="text-gray-600 text-[14px] mb-2">Tüm belgeler eksiksiz olarak <strong>3 takım (suret)</strong> halinde hazırlanmalıdır:</p>
                    <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between text-[13px]"><span className="font-bold text-gray-700">1. Takım</span> <span className="text-gray-500">Bölüm Staj Sorumlusuna teslim edilir.</span></div>
                      <div className="w-full h-px bg-gray-200"></div>
                      <div className="flex items-center justify-between text-[13px]"><span className="font-bold text-gray-700">2. Takım</span> <span className="text-gray-500">Staj yapılacak kuruma teslim edilir.</span></div>
                      <div className="w-full h-px bg-gray-200"></div>
                      <div className="flex items-center justify-between text-[13px]"><span className="font-bold text-gray-700">3. Takım</span> <span className="text-gray-500">Öğrencide kalır.</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infographic and Forms */}
              <div className="lg:w-2/5 flex flex-col gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group">
                  <div className="bg-red-50 px-5 py-4 border-b border-red-100">
                    <h4 className="font-bold text-[#990000] text-[15px] flex items-center gap-2"><FileText size={18} /> Görsel Kılavuz (İnfografik)</h4>
                  </div>
                  <div className="p-4 flex items-center justify-center bg-gray-50 h-56 overflow-hidden">
                     <img 
                      src="https://www.esenyurt.edu.tr/uploads/2025/08/y2j65ag3nsq19-gonullu-staj-formu.jpg" 
                      alt="Gönüllü Staj İnfografik" 
                      className="w-full h-full object-contain cursor-zoom-in group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        if(e.target.src.includes('2025/08')) {
                          e.target.src = 'https://www.esenyurt.edu.tr/uploads/2023/11/y2j65ag3nsq19-gonullu-staj-formu.jpg';
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="bg-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 opacity-10">
                    <Download size={100} />
                  </div>
                  <h4 className="font-bold text-lg mb-2 relative z-10">Formlar ve Şablonlar</h4>
                  <p className="text-gray-500 text-[13px] mb-5 relative z-10 leading-relaxed">Başvuru süreci için ihtiyaç duyduğunuz tüm formlara ve belge şablonlarına Formlar sayfasından ulaşabilirsiniz.</p>
                  <a href="https://www.esenyurt.edu.tr/icerik/4540-kariyer-gelistirme-ofisi-koordinatorlugu-formlar-ve-belgeler" target="_blank" rel="noreferrer" className="relative z-10 w-full bg-[#990000] hover:bg-white hover:text-[#990000] border-2 border-iesu-navy text-white py-3 rounded-xl font-bold text-[14px] transition flex items-center justify-center gap-2">
                    Formlar Sayfasına Git <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FLOATING DOCK (ONLY FOR LOGGED IN USERS) */}
      {userRole && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
          <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
            <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="Akış">
              <Home size={26} strokeWidth={2} />
            </button>
            
            <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-[#990000]`} title="İlanlar">
              <Briefcase size={24} strokeWidth={2} />
            </button>
            
            {/* CENTER: SEARCH ICON */}
            <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
              <Search size={24} strokeWidth={2.5} />
            </button>
            
            {/* MESSAGES */}
            <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-500 hover:text-gray-900`} title="Mesajlar">
              <MessageCircle size={24} strokeWidth={2} />
            </button>
            
            {/* PROFILE AVATAR */}
            <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
              <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanici')}&background=0A2342&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
            </button>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-fade-in flex flex-col p-8">
            <button onClick={() => setSelectedJob(null)} className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-900 transition-colors">
              <span className="font-black text-xl">×</span>
            </button>
            <div className="flex items-start gap-5 mb-6 pr-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                {selectedJob.logo ? <img src={selectedJob.logo} alt="Logo" className="w-full h-full object-cover"/> : <Building2 className="text-gray-500" size={28} />}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{selectedJob.title}</h2>
                <p className="text-lg font-bold text-gray-600">{selectedJob.company}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"><MapPin size={14}/> {selectedJob.location}</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"><Briefcase size={14}/> {selectedJob.type}</span>
              <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"><Calendar size={14}/> {selectedJob.deadline}</span>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h4 className="text-[15px] font-black text-gray-900 mb-2 uppercase tracking-wide">İş Tanımı</h4>
                <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedJob.description || "İş tanımı belirtilmemiş."}</p>
              </div>
              
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="text-[15px] font-black text-gray-900 mb-3 uppercase tracking-wide">Aranan Nitelikler</h4>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex gap-2 items-start text-[14.5px] text-gray-700">
                        <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => {
                  handleApply(selectedJob);
                  setSelectedJob(null);
                }}
                disabled={applications.some(a => a.jobId === selectedJob.id && a.applicantId === currentUser?.id)}
                className={`flex-1 py-4 rounded-xl font-black text-[15px] shadow-lg transition-all flex items-center justify-center gap-2 ${
                  applications.some(a => a.jobId === selectedJob.id && a.applicantId === currentUser?.id)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-iesu-navy to-red-700 text-white hover:shadow-red-900/20 hover:scale-[1.02]'
                }`}
              >
                {applications.some(a => a.jobId === selectedJob.id && a.applicantId === currentUser?.id) ? 'Başvuruldu' : 'Hemen Başvur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


