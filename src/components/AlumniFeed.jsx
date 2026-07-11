import React, { useState } from 'react';
import { Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, UserCircle2, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, Home, ClipboardList } from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
import MessagingInterface from './MessagingInterface';
import PostComposer from './PostComposer';
import CareerShorts from './CareerShorts';
import StoriesBar from './StoriesBar';
import { combineFeedItems } from '../utils/feedCombiner';
import PostCard from './PostCard';
import CareerRadar from './CareerRadar';
import CareerNetwork from './CareerNetwork';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import CalendarPlanning from './CalendarPlanning';
import AICVBuilder from './AICVBuilder';
import ApplicationsPanel from './ApplicationsPanel';
import NavIcon from './shared/NavIcon';
import AlumniSurveys from './AlumniSurveys';

export default function AlumniFeed({ setView, setSelectedUserId, notifications = [], setNotifications, posts, setPosts, stories, setStories, surveys, userRole, news, events, students, alumni, companies, currentUser, featuredOpportunities, mentorships, messages, setMessages, applications, setApplications, jobs, academicStaff, announcements, alumniCardApplications, setAlumniCardApplications, alumniCardForms, academicRole }) {
  const [activeTab, setActiveTab] = useState('feed'); // feed, jobs, network
  const [showShorts, setShowShorts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ tc: '', phone: '' });
  const [showCareerStatus, setShowCareerStatus] = useState(true);
  const [careerStatusForm, setCareerStatusForm] = useState({ status: 'Çalışıyorum', company: '', isMatch: 'Evet' });

  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [mentorshipForm, setMentorshipForm] = useState({ title: '', hours: '', mode: 'Online', motivation: '' });

  const existingApp = (alumniCardApplications || []).find(a => a.tc === currentUser?.tc || a.email === currentUser?.email || a.name === currentUser?.name);
  const isFormActive = (alumniCardForms || []).length > 0 ? alumniCardForms[0]?.isActive : true;

  const handleCardSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      id: `KART-${Date.now()}`,
      name: currentUser?.name || 'Mezun',
      tc: cardForm.tc,
      department: currentUser?.department || 'Mezun',
      gradYear: currentUser?.graduationYear || '2023',
      email: currentUser?.email || 'mezun@esenyurt.edu.tr',
      phone: cardForm.phone,
      date: new Date().toLocaleDateString('tr-TR'),
      status: 'Bekliyor'
    };
    if (setAlumniCardApplications) {
      setAlumniCardApplications([newApp, ...(alumniCardApplications || [])]);
    }
    setShowCardModal(false);
  };

  // Removed mock stories and defaultPosts

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* LEFT: Star Icon for Post Creation */}
          <button onClick={() => setActiveTab('create_post')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-gray-100 ${activeTab === 'create_post' ? 'text-orange-500 bg-orange-50' : 'text-gray-600'}`} title="Gönderi Düzenle/Paylaş">
            <Star size={24} strokeWidth={activeTab === 'create_post' ? 2.5 : 2} className={activeTab === 'create_post' ? 'fill-current text-orange-500/10' : ''} />
          </button>
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-center">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-iesu-red`} title="Bildirimler">
              <div className="relative">
                <Heart size={24} strokeWidth={2.5} className="fill-current text-iesu-red/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=EA580C&color=fff' }} userRole={userRole || 'alumni'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="alumni" />
          </div>
        </div>
      </nav>

      {/* Main Container - Padded for Navbar */}
      <div className="pt-24 max-w-6xl mx-auto px-4 flex justify-center gap-6 pb-20">
        
        {/* LEFT PANEL: Profile (Fast Access) */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24">
            {userRole === 'admin' ? (
              <div className="p-6 text-center">
                <div className="relative inline-block mb-2">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mx-auto p-2">
                    <img src="/iesu-logo.svg" alt="Admin" className="w-full h-full object-contain" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-1.5 rounded-xl shadow-md border-2 border-white">
                    <Crown size={14} />
                  </div>
                </div>
                <h2 className="text-[16px] font-black text-gray-900 mt-4 leading-tight">Kariyer Geliştirme Ofisi</h2>
                <p className="text-[12px] font-bold text-orange-600 mt-1 uppercase tracking-wider">SÜPER YÖNETİCİ</p>
                
                <div className="mt-6 flex flex-col gap-2 text-left bg-gray-50 p-3 rounded-2xl">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sistem Yetkileri</p>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Tüm panellere tam erişim
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> İçerik yönetimi
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-gray-700">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Kullanıcı onayları
                  </div>
                </div>

                <button onClick={() => setView('admin')} className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-[13px] font-bold py-3 rounded-xl transition-all shadow-md">
                  <LayoutDashboard size={16} /> Yönetim Panelini Aç
                </button>
              </div>
            ) : (
              <>
                <div className="h-24 bg-gradient-to-r from-teal-600 to-emerald-700 relative">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                      <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Mezun')}&background=0F766E&color=fff`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6 text-center">
                  <h2 className="text-[18px] font-black text-gray-900 leading-none mb-1 cursor-pointer hover:text-teal-700 transition">{currentUser?.name || 'Mezun'}</h2>
                  <p className="text-[13px] font-medium text-gray-500 mb-4">
                    {`${currentUser?.department || 'Mezun'}${currentUser?.graduationYear ? `, ${currentUser.graduationYear}` : ''}`}
                  </p>
                  
                  <div className="flex justify-center gap-6 border-y border-gray-50 py-4 mb-4">
                    <div className="text-center cursor-pointer group">
                      <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">Ağım</p>
                      <p className="text-[16px] font-black text-gray-900 group-hover:text-teal-700 transition">120</p>
                    </div>
                    <div className="w-px bg-gray-100"></div>
                    <div className="text-center cursor-pointer group">
                      <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">Gönderi</p>
                      <p className="text-[16px] font-black text-gray-900 group-hover:text-teal-700 transition">15</p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-[13px] font-bold transition-colors">
                    Kariyer Durumunu Güncelle
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CENTER PANEL: Stories & Feed */}
        <div className="w-full max-w-[600px] shrink-0 space-y-6">
          
        {/* Create Post Native View */}
        {activeTab === 'create_post' && (
          <div className="bg-white rounded-3xl w-full p-4 sm:p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in mb-6">
             <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Star className="text-orange-500 fill-current" size={24} /> Gönderi Paylaş & Düzenle
             </h2>
             <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />
          </div>
        )}

        {/* Search Native View */}
        {activeTab === 'search' && (
          <div className="bg-white rounded-3xl w-full p-6 shadow-[var(--shadow-soft)] border border-[var(--border-soft)] animate-fade-in mb-6 min-h-[75vh]">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Search className="text-iesu-red" size={24} strokeWidth={2.5} /> Arama ve Keşfet
            </h2>
            <div className="relative group w-full mb-8">
              <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-iesu-red transition-colors" size={20} />
              <input 
                id="main-search"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={userRole === 'admin' ? "Öğrenci, mezun, firma, ilan veya başvuru ara..." : "İlan, staj, etkinlik veya mentorluk ara..."} 
                className="bg-gray-50 pl-12 pr-4 py-3.5 rounded-2xl text-[15px] w-full focus:outline-none focus:ring-2 focus:ring-iesu-red/20 border border-gray-200 transition-all shadow-inner" 
              />
            </div>
            
            <div className="text-center text-gray-500 py-12 mt-12 border-2 border-dashed border-gray-100 rounded-3xl">
              <Compass size={48} className="mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-gray-700 mb-2">Keşfetmeye Başlayın</h3>
              <p className="max-w-sm mx-auto text-sm">Öğrenciler, İlanlar, Firmalar veya Etkinlikleri aramak için yukarıdaki alanı kullanın.</p>
            </div>
          </div>
        )}


        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="w-full shrink-0 flex flex-col gap-6 animate-fade-in">
            {/* STORIES */}
            <StoriesBar currentUser={currentUser} setView={setView} stories={stories} setStories={setStories} />

          {/* FEED POSTS */}
          <div className="space-y-6">
            {(() => {
              const allItems = combineFeedItems(posts, events, news, announcements, jobs);
              const filtered = allItems.filter(post => post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
              
              if (filtered.length === 0) {
                return (
                  <div className="p-10 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-red-50 text-iesu-red rounded-2xl flex items-center justify-center mb-6 shadow-sm"><FileText size={32} /></div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2">Henüz görüntülenecek yayın bulunmuyor.</h3>
                    <p className="text-sm text-gray-500 font-medium max-w-sm leading-relaxed">Duyuru, etkinlik, staj ve mentorluk içerikleri yayınlandığında burada görünecek.</p>
                  </div>
                );
              }
              
              return filtered.map(post => (
                <PostCard key={post.id} post={post} currentUser={currentUser} setMessages={setMessages} students={students || []} alumni={alumni || []} setPosts={setPosts} />
              ));
            })()}
          </div>
          </div>
        )}

        {/* SURVEYS TAB */}
        {activeTab === 'surveys' && (
          <div className="w-full shrink-0 animate-fade-in mb-6">
            <AlumniSurveys surveys={surveys} currentUser={currentUser} />
          </div>
        )}
        </div>

        {/* RIGHT PANEL: Dynamic Data */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          
          {/* Career Status Widget (Kariyer Check-up) */}
          {showCareerStatus && (
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 p-6 shadow-[var(--shadow-soft)] animate-fade-in">
              <h3 className="font-black text-indigo-900 mb-2 flex items-center gap-2">
                <Compass size={18} className="text-indigo-500" /> Kariyer Check-up
              </h3>
              <p className="text-xs text-indigo-700 font-medium mb-4 leading-relaxed">Üniversitemizin istatistiklerine katkıda bulunmak için güncel çalışma durumunuzu paylaşır mısınız?</p>
              
              <div className="space-y-3 mb-4">
                <select 
                  value={careerStatusForm.status} 
                  onChange={e => setCareerStatusForm({...careerStatusForm, status: e.target.value})}
                  className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="Çalışıyorum">Çalışıyorum</option>
                  <option value="İş Arıyorum">İş Arıyorum</option>
                  <option value="Eğitimime Devam Ediyorum">Eğitimime Devam Ediyorum</option>
                  <option value="Çalışmıyorum">Çalışmıyorum</option>
                </select>
                
                {careerStatusForm.status === 'Çalışıyorum' && (
                  <>
                    <input 
                      type="text" 
                      placeholder="Şirket Adı" 
                      value={careerStatusForm.company}
                      onChange={e => setCareerStatusForm({...careerStatusForm, company: e.target.value})}
                      className="w-full bg-white border border-indigo-100 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none" 
                    />
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 mb-1">Kendi bölümünüzle alakalı mı çalışıyorsunuz?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setCareerStatusForm({...careerStatusForm, isMatch: 'Evet'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${careerStatusForm.isMatch === 'Evet' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-indigo-100'}`}>Evet</button>
                        <button onClick={() => setCareerStatusForm({...careerStatusForm, isMatch: 'Hayır'})} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border ${careerStatusForm.isMatch === 'Hayır' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-indigo-100'}`}>Hayır</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => setShowCareerStatus(false)}
                className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} /> Güncelle
              </button>
            </div>
          )}

          {/* Profile Completion / Quick Action */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-black text-gray-900 mb-2">Mentor Olun</h3>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-4">Mezun olarak tecrübelerinizi öğrencilerle paylaşın ve onlara yol gösterin.</p>
            <button 
              onClick={() => setShowMentorshipModal(true)}
              className="w-full py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl text-[13px] font-bold transition-colors"
            >
              Mentorluk Başvurusu Yap
            </button>
          </div>

          {/* Mezun Kartı Başvurusu Widget */}
          <div className="bg-gradient-to-br from-iesu-red to-iesu-darkRed rounded-3xl p-6 shadow-lg text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><CreditCard size={20}/></div>
              <h3 className="font-black text-lg leading-tight">Mezun Kartı</h3>
            </div>
            
            {existingApp ? (
              <div className="mt-4 bg-white/10 p-4 rounded-2xl border border-white/20">
                <p className="text-[11px] text-white/70 font-bold uppercase tracking-wider mb-1">Başvuru Durumu</p>
                <div className="flex items-center justify-between">
                  <p className="font-black text-sm">{existingApp.status}</p>
                  {existingApp.status === 'Onaylandı' ? <CheckCircle size={18} className="text-emerald-400" /> : <Clock size={18} className="text-orange-300" />}
                </div>
                <p className="text-xs text-white/60 mt-2">Başvuru Tarihi: {existingApp.date}</p>
              </div>
            ) : isFormActive ? (
              <>
                <p className="text-xs text-red-100 font-medium mb-4">Üniversite kampüsüne giriş ve kütüphane erişimi için Mezun Kartınızı hemen alın.</p>
                <button onClick={() => setShowCardModal(true)} className="w-full py-2.5 bg-white text-iesu-red hover:bg-red-50 rounded-xl text-[13px] font-bold transition-colors shadow-sm">Hemen Başvur</button>
              </>
            ) : (
              <p className="text-xs text-red-100 font-medium mt-2">Mezun kartı başvuruları şu an kapalıdır.</p>
            )}
          </div>

          {/* Featured Opportunities */}
          {featuredOpportunities && (featuredOpportunities || []).filter(f => f.status === 'Yayında').length > 0 && (
            <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <Star size={18} className="text-yellow-500 fill-current" /> Öne Çıkanlar
              </h3>
              <div className="space-y-4">
                {(featuredOpportunities || []).filter(f => f.status === 'Yayında').slice(0,2).map(feat => (
                  <div key={feat.id} className="group cursor-pointer">
                    <div className="h-24 bg-gray-200 rounded-xl overflow-hidden mb-3 relative">
                      {feat.banner ? <img src={feat.banner} className="w-full h-full object-cover group-hover:scale-105 transition" /> : <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-800"></div>}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <p className="text-white text-[12px] font-black truncate">{feat.title}</p>
                        <p className="text-white/80 text-[10px] font-medium truncate">{feat.organization}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentorships */}
          {mentorships && (mentorships || []).filter(m => m.status === 'Aktif').length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[var(--border-soft)] p-6 shadow-[var(--shadow-soft)]">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck size={18} className="text-blue-500" /> Mentorluk Başvuruları
              </h3>
              <div className="space-y-3">
                {(mentorships || []).filter(m => m.status === 'Aktif').slice(0,3).map(mnt => (
                  <div key={mnt.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 hover:border-blue-300 transition cursor-pointer group">
                    <p className="text-[12px] font-black text-gray-900 group-hover:text-blue-700 transition">{mnt.programTitle}</p>
                    <p className="text-[11px] text-gray-500">{mnt.mentorName} • {mnt.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'career_network' && (
            <CareerNetwork companies={companies} events={events} academicStaff={academicStaff} setView={setView} setSelectedUserId={setSelectedUserId} />
          )}

        </div>

        {/* Applications Interface Overlay */}
        {activeTab === 'applications' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <div className="p-4">
                <ApplicationsPanel 
                  applications={applications} 
                  setApplications={setApplications} 
                  jobs={jobs} 
                  currentUser={currentUser || { id: 'alm-1', name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=10B981&color=fff' }} 
                  userRole="student" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Messaging Interface Overlay */}
        {activeTab === 'messaging' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/60 flex flex-col items-center justify-center pt-16 pb-4 px-4 sm:p-6 backdrop-blur-sm">
            <div className="w-full max-w-5xl h-full sm:h-[85vh] relative flex flex-col">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute -top-12 right-0 z-50 p-2 bg-white/20 text-white hover:bg-white/30 rounded-full backdrop-blur-md shadow-lg transition flex items-center justify-center"
              >
                <X size={24} />
              </button>
              <div className="bg-white rounded-3xl w-full flex-1 overflow-hidden flex flex-col shadow-2xl animate-fade-in">
              <MessagingInterface 
                messages={messages} 
                setMessages={setMessages} 
                currentUser={currentUser || { id: 'alm-1', name: 'Mezun', avatar: 'https://ui-avatars.com/api/?name=Mezun&background=10B981&color=fff' }} 
                userRole={userRole} 
                contacts={[...(students || []), ...(alumni || []), ...(companies || []), ...(academicStaff || [])]} 
                setView={setView}
                setSelectedUserId={setSelectedUserId}
                isOverlay={true}
              />
              </div>
            </div>
          </div>
        )}

        {/* Calendar Overlay */}
        {activeTab === 'calendar' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <CalendarPlanning events={events} jobs={jobs} userRole={userRole} />
            </div>
          </div>
        )}

        {/* CV Builder Overlay */}
        {activeTab === 'cvbuilder' && (
          <div className="fixed inset-0 z-[60] bg-gray-900/50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in relative">
              <button 
                onClick={() => setActiveTab('feed')}
                className="absolute top-4 right-4 z-50 p-2 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full shadow-md transition border border-gray-100"
              >
                <X size={20} />
              </button>
              <div className="h-full mt-12">
                <AICVBuilder currentUser={currentUser} />
              </div>
            </div>
          </div>
        )}

        {/* Mezun Kartı Modal */}
        {showCardModal && (
          <div className="fixed inset-0 z-[100] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
              <div className="bg-gradient-to-r from-iesu-red to-iesu-darkRed p-6 text-white relative">
                <button onClick={() => setShowCardModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"><X size={16}/></button>
                <CreditCard size={32} className="mb-3 opacity-90"/>
                <h2 className="text-xl font-black">Mezun Kartı Başvurusu</h2>
                <p className="text-red-100 text-sm mt-1">Kartınızı almak için bilgilerinizi doğrulayın.</p>
              </div>
              <form onSubmit={handleCardSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Ad Soyad</label>
                  <input type="text" disabled value={currentUser?.name || 'Mezun'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Bölüm & Mezuniyet Yılı</label>
                  <input type="text" disabled value={`${currentUser?.department || 'Mezun'} - ${currentUser?.graduationYear || '2023'}`} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">E-posta Adresi</label>
                  <input type="email" disabled value={currentUser?.email || 'mezun@esenyurt.edu.tr'} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">TC Kimlik No (Zorunlu)</label>
                  <input type="text" required maxLength="11" pattern="\d{11}" value={cardForm.tc} onChange={e => setCardForm({...cardForm, tc: e.target.value.replace(/\D/g,'')})} placeholder="11 Haneli TC Kimlik No" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-300 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Telefon Numarası</label>
                  <input type="tel" required value={cardForm.phone} onChange={e => setCardForm({...cardForm, phone: e.target.value})} placeholder="05XX XXX XX XX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-300 outline-none" />
                </div>
                
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-start pt-1">
                      <input type="checkbox" required className="w-4 h-4 border-gray-300 rounded text-red-600 focus:ring-red-500 cursor-pointer" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition">
                      Kişisel verilerimin Mezun Kartı basımı ve işlemleri amacıyla işlenmesine dair <a href="#" className="text-red-600 font-bold hover:underline">KVKK Aydınlatma Metni'ni</a> okudum ve onaylıyorum.
                    </span>
                  </label>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100 flex gap-3">
                  <button type="button" onClick={() => setShowCardModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-200 transition">İptal</button>
                  <button type="submit" className="flex-[2] bg-iesu-red text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-sm">Başvuruyu Tamamla</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mentorship Application Modal */}
        {showMentorshipModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-lg">Mentorluk Başvurusu</h3>
                <button onClick={() => setShowMentorshipModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"><X size={20} /></button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newMentorship = {
                  id: Date.now(),
                  mentorName: currentUser?.name || 'Mezun',
                  department: currentUser?.department || 'Mezun',
                  programTitle: mentorshipForm.title,
                  status: 'Beklemede', // PENDING ADMIN APPROVAL
                  avatar: currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name || 'M'}&background=132A49&color=fff`,
                  hours: mentorshipForm.hours,
                  mode: mentorshipForm.mode,
                  motivation: mentorshipForm.motivation
                };
                
                // Direct save to localStorage for the mockup
                try {
                  const storedMentorships = JSON.parse(localStorage.getItem('iesu_mentorships_v2')) || [];
                  localStorage.setItem('iesu_mentorships_v2', JSON.stringify([newMentorship, ...storedMentorships]));
                } catch (err) {}

                alert("Başvurunuz başarıyla alınmıştır. Kariyer Geliştirme Ofisi yöneticisi tarafından onaylandıktan sonra ilan edilecektir.");
                setShowMentorshipModal(false);
                setMentorshipForm({ title: '', hours: '', mode: 'Online', motivation: '' });
              }} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Uzmanlık / Program Başlığı</label>
                  <input required type="text" value={mentorshipForm.title} onChange={e => setMentorshipForm({...mentorshipForm, title: e.target.value})} placeholder="Örn: Yazılım Mühendisliği Kariyer Rehberliği" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Haftalık Uygunluk (Saat)</label>
                    <input required type="number" min="1" max="20" value={mentorshipForm.hours} onChange={e => setMentorshipForm({...mentorshipForm, hours: e.target.value})} placeholder="Örn: 2" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Çalışma Şekli</label>
                    <select value={mentorshipForm.mode} onChange={e => setMentorshipForm({...mentorshipForm, mode: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500">
                      <option value="Online">Online</option>
                      <option value="Yüz Yüze">Yüz Yüze</option>
                      <option value="Hibrit">Hibrit</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Motivasyon / Kısa Özgeçmiş</label>
                  <textarea required rows={3} value={mentorshipForm.motivation} onChange={e => setMentorshipForm({...mentorshipForm, motivation: e.target.value})} placeholder="Öğrencilerimize nasıl destek olabileceğinizi kısaca anlatın..." className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"></textarea>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition-colors">Başvuruyu Gönder</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setActiveTab('feed')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'feed' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className="p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900" title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => { setActiveTab('search'); setTimeout(() => document.getElementById('main-search')?.focus(), 100); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Ara">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* SURVEYS */}
          <button onClick={() => setActiveTab('surveys')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'surveys' ? 'text-fuchsia-600' : 'text-gray-400 hover:text-gray-900'}`} title="Anketler">
            <ClipboardList size={24} strokeWidth={2} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setActiveTab('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'messaging' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=Mezun&background=EA580C&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
      
      {/* CAREER SHORTS FULLSCREEN MODAL */}
      {showShorts && <CareerShorts setView={setView} onClose={() => setShowShorts(false)} />}
    </div>
  );
}


