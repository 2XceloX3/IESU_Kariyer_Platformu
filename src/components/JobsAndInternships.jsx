import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Building2, Search, Filter, Briefcase, PlayCircle, FileText, CheckCircle2, Download, Home, Compass, MessageCircle, Bell, Heart } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import NavIcon from './shared/NavIcon';

import JobCreator from './JobCreator';

export default function JobsAndInternships({ userRole, setView, previousView, jobs = [], applications = [], setApplications = () => {}, currentUser, setSelectedUserId, setJobs, addNotification }) {
  const [activeTab, setActiveTab] = useState('ilanlar'); // 'ilanlar', 'ulusal', 'gonullu'
  const [isCreatingJob, setIsCreatingJob] = useState(false);

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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* RIGHT: Heart Icon & Profile (ONLY INTERNAL) */}
          {userRole ? (
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-iesu-red`} title="Bildirimler">
                <div className="relative">
                  <Bell size={24} strokeWidth={2.5} className="fill-current text-iesu-red/10" />
                </div>
              </button>
              <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} currentView="jobs" />
            </div>
          ) : (
            <div className="w-10"></div>
          )}
          
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="mb-8 w-full">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-iesu-red/10 flex items-center justify-center text-iesu-red shrink-0">
                  <Briefcase size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  {userRole === 'academic' ? 'İş ve Staj Olanakları (Akademik İzleme)' : 'İş ve Staj Olanakları'}
                </h2>
              </div>
              
              {userRole === 'employer' && (
                <button onClick={() => setIsCreatingJob(true)} className="bg-iesu-red text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-red-700 transition flex items-center gap-2 shrink-0">
                  <span className="text-xl leading-none">+</span> <span className="hidden sm:inline">İlan Oluştur</span>
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
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap ${activeTab === 'ilanlar' ? 'bg-iesu-red text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Aktif İlanlar
            </button>
            <button 
              onClick={() => setActiveTab('ulusal')} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap ${activeTab === 'ulusal' ? 'bg-iesu-red text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Ulusal Staj Programı
            </button>
            <button 
              onClick={() => setActiveTab('gonullu')} 
              className={`px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap ${activeTab === 'gonullu' ? 'bg-iesu-red text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Gönüllü Staj
            </button>
          </div>
        </div>
        
        {/* Tab Contents */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl shadow-red-900/5 min-h-[500px]">
          
          {/* TAB 1: İlanlar */}
          {activeTab === 'ilanlar' && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-extrabold text-gray-900 mb-6 border-b-2 border-red-100 pb-2 inline-block">Güncel İş ve Staj İlanları</h3>
              {(() => {
                const activeJobs = (jobs || []).filter(j => j.status === 'Aktif' || !j.status);
                if (activeJobs.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-gray-100 border-dashed rounded-2xl">
                      <Briefcase size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium text-center">Şu an için bu kategoride ilan bulunmamaktadır.</p>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeJobs.map(job => {

                      const hasApplied = applications.some(app => app.jobId === job.id && app.applicantId === currentUser?.id);
                      return (
                        <div key={job.id} className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition duration-300">
                          <div className="h-48 bg-gray-200 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
                            {job.logo ? (
                              <img src={job.logo} alt={job.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                            ) : (
                              <Briefcase size={40} className="text-red-200" />
                            )}
                            <div className={`absolute top-3 left-3 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow ${job.type === 'STAJ' ? 'bg-iesu-coral' : 'bg-iesu-red'}`}>
                              {job.type}
                            </div>
                          </div>
                          <div className="p-5">
                            <h4 className="font-extrabold text-lg text-gray-900 mb-2 truncate">{job.title}</h4>
                            <p className="text-gray-500 text-[13px] mb-1 font-bold">{job.company}</p>
                            <p className="text-gray-400 text-[12px] mb-4">{job.location} • Son Başvuru: {job.date}</p>
                            <p className="text-gray-500 text-[13px] mb-4 line-clamp-2">{job.description}</p>
                            
                            <div className="flex items-center justify-between">
                              {userRole === 'academic' ? (
                                <button 
                                  onClick={() => window.toast.info("Bu ilan öğrencilerinize önerildi!")}
                                  className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                                >
                                  <CheckCircle2 size={14} /> Öğrenciye Öner
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleApply(job)}
                                  disabled={hasApplied}
                                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition ${hasApplied ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                                >
                                  {hasApplied ? <><CheckCircle2 size={14} /> Başvuruldu</> : 'Hızlı Başvur'}
                                </button>
                              )}
                              {job.applicationLink && job.applicationLink !== '#' && (
                                <a href={job.applicationLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-iesu-red transition" title="Dış Bağlantı (İşveren Sitesi)">
                                  <ExternalLink size={16} />
                                </a>
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

          {/* TAB 2: Ulusal Staj */}
          {activeTab === 'ulusal' && (
            <div className="animate-fade-in flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-black text-gray-900 mb-6">T.C. Ulusal Staj Programı</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Cumhurbaşkanlığı İnsan Kaynakları Ofisi koordinasyonunda yürütülen Ulusal Staj Programı ile kamu kurumları ve özel sektörde staj imkanı bulabilirsiniz. 
                </p>
                
                <h4 className="font-bold text-lg text-iesu-red mb-4">Nasıl Başvuru Yapılır?</h4>
                <ul className="space-y-4">
                  {[
                    "Kariyer Kapısı (ulusalstajprogrami.iskur.gov.tr) adresine gidin.",
                    "Öğrenci girişi seçeneği ile e-Devlet şifrenizi kullanarak sisteme giriş yapın.",
                    "Staj Başvurusu menüsünden güncel yılın programına tıklayın.",
                    "Başvuru Formunu (i) uyarılarına dikkat ederek eksiksiz doldurun.",
                    "Başvurunuzu onaylayın ve durumunu Kariyer Kapısı üzerinden takip edin."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-iesu-red flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-[14.5px] text-gray-700 font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-1/2 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100">
                <h4 className="font-extrabold text-lg text-gray-900 mb-5 flex items-center gap-2">
                  <FileText className="text-iesu-coral" size={20} /> İlgili Formlar ve Belgeler
                </h4>
                <div className="space-y-3">
                  {[
                    { title: "Zorunlu Staj Formu", link: "#" },
                    { title: "Mesleki Eğitim Sözleşmesi (SHMYO-SBF)", link: "#" },
                    { title: "İş Sağlığı ve Güvenliği Belgesi (SHMYO)", link: "#" },
                    { title: "İş Sağlığı ve Güvenliği Belgesi (SBF)", link: "#" },
                    { title: "Ulusal Staj Başvuru Formu", link: "#" }
                  ].map((doc, i) => (
                    <a key={i} href={doc.link} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-iesu-red hover:shadow-md transition group cursor-pointer">
                      <span className="font-semibold text-[14px] text-gray-700 group-hover:text-iesu-red transition">{doc.title}</span>
                      <Download size={18} className="text-gray-400 group-hover:text-iesu-red transition" />
                    </a>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 text-[13px] text-iesu-red font-medium">
                  <strong>Not:</strong> İstenilen evrakların eksiksiz doldurulması ve onaylatılması zorunludur. İşveren onayı olmadan staja başlanamaz.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Gönüllü Staj */}
          {activeTab === 'gonullu' && (
            <div className="animate-fade-in flex flex-col lg:flex-row gap-12">
              <div className="lg:w-3/5">
                <h3 className="text-2xl font-black text-gray-900 mb-4 border-l-4 border-iesu-red pl-4">Gönüllü Staj Başvuru Süreci</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                  Zorunlu stajı bulunmayan veya fazladan sektörel deneyim kazanmak isteyen öğrencilerimiz, onay dâhilinde gönüllü staj yapabilirler. Sürecin her adımını eksiksiz tamamlamanız gerekmektedir.
                </p>
                
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                  {/* Step 1 */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-iesu-red font-black text-[14px] shadow-sm">1</span>
                    <h5 className="font-extrabold text-gray-900 text-lg mb-1">Başvuru Formunun Doldurulması</h5>
                    <p className="text-gray-600 text-[14px]">
                      "Uygulamalı Eğitim Başvuru Formu" doldurulmalıdır. Form; <strong>öğrenci</strong>, <strong>staj yapılacak kurum yetkilisi</strong> ve <strong>bölüm staj sorumlusu</strong> tarafından ıslak imzalı olmalıdır.
                    </p>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-iesu-red font-black text-[14px] shadow-sm">2</span>
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
                    <span className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-red-100 border-4 border-white flex items-center justify-center text-iesu-red font-black text-[14px] shadow-sm">3</span>
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
                    <h4 className="font-bold text-iesu-red text-[15px] flex items-center gap-2"><FileText size={18} /> Görsel Kılavuz (İnfografik)</h4>
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
                  <p className="text-gray-400 text-[13px] mb-5 relative z-10 leading-relaxed">Başvuru süreci için ihtiyaç duyduğunuz tüm formlara ve belge şablonlarına Formlar sayfasından ulaşabilirsiniz.</p>
                  <a href="https://www.esenyurt.edu.tr/icerik/4540-kariyer-gelistirme-ofisi-koordinatorlugu-formlar-ve-belgeler" target="_blank" rel="noreferrer" className="relative z-10 w-full bg-iesu-red hover:bg-white hover:text-iesu-red border-2 border-iesu-red text-white py-3 rounded-xl font-bold text-[14px] transition flex items-center justify-center gap-2">
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
            <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="Akış">
              <Home size={26} strokeWidth={2} />
            </button>
            
            <button onClick={() => setView('jobs')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-iesu-red`} title="İlanlar">
              <Briefcase size={24} strokeWidth={2} />
            </button>
            
            {/* CENTER: SEARCH ICON */}
            <button onClick={() => setView(previousView === 'academic' ? 'academic' : previousView === 'admin' ? 'admin' : previousView === 'student' ? 'student' : previousView === 'alumni' ? 'alumni' : previousView === 'company' ? 'company' : userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Keşfet'e Dön">
              <Search size={24} strokeWidth={2.5} />
            </button>
            
            {/* MESSAGES */}
            <button onClick={() => setView('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900`} title="Mesajlar">
              <MessageCircle size={24} strokeWidth={2} />
            </button>
            
            {/* PROFILE AVATAR */}
            <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
              <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Kullanici')}&background=132A49&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


