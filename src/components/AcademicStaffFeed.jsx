import React, { useState } from 'react';
import { Search, Bell, Briefcase, Bookmark, Plus, Users, ShieldCheck, Crown, CheckCircle2, LayoutDashboard, FileText, Home, Radar, Target, UserCheck, ChevronRight, MessageCircle, ChevronDown, ChevronUp, Compass, Heart, X } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import PostComposer from './PostComposer';
import PostCard from './PostCard';
import { combineFeedItems } from '../utils/feedCombiner';
import CareerNetwork from './CareerNetwork';
import NavIcon from './shared/NavIcon';
import MessagingInterface from './MessagingInterface';

export default function AcademicStaffFeed({ 
  setView, setSelectedUserId, currentUser, userRole, academicRole, 
  notifications, setNotifications, 
  initialInternships = [], academicApprovals = [], setAcademicApprovals,
  posts, setPosts, news, events, announcements, jobs,
  students, setStudents, alumni, companies, academicStaff, surveys,
  messages, setMessages, groups, setSelectedGroupId
}) {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, approvals, radar, messaging
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [internships, setInternships] = useState(initialInternships);
  const [approvals, setApprovals] = useState(academicApprovals);

  const stats = {
    totalStudents: 450,
    activeInterns: 124,
    pendingApprovals: internships.filter(i => i.status === 'Onay Bekliyor').length + approvals.filter(a => a.status === 'Beklemede').length
  };

  const handleApproveInternship = (id) => {
    setInternships(internships.map(i => i.id === id ? { ...i, status: 'Onaylandı' } : i));
  };



  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 relative">
      
      {/* Hyper-Modern Navbar (Glassmorphism) - ALIGNED WITH STUDENT FEED */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-10"></div> {/* Spacer */}
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Merkezi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={() => setView('notifications')} className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-red-50 text-iesu-red`} title="Bildirimler">
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-iesu-red/10" />
                {((notifications || []).filter(n => n.userId === currentUser?.id && !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>
            <TopProfileMenu currentUser={currentUser || { name: 'Akademik Personel', avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('Akademik Personel')}&background=132A49&color=fff` }} userRole={userRole || 'academic'} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} currentView="academic" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 pt-24 pb-12 flex flex-col md:flex-row gap-6 relative justify-center">
        
        {/* LEFT PANEL: Profile Mini-Card */}
        <div className="hidden md:block w-[300px] shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-900 to-slate-800"></div>
            <div className="relative pt-12 text-center">
              <div className="relative inline-block">
                {userRole === 'admin' ? (
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg mx-auto p-2">
                    <img src="/iesu-logo.svg" alt="Admin Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Akademik Personel')}&background=132A49&color=fff`} className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto object-cover bg-white" alt="Profile" />
                )}
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition">
                  <Crown size={14} />
                </button>
              </div>
              <h2 className="text-lg font-black text-gray-900 mt-4">{userRole === 'admin' ? 'Kariyer Merkezi' : currentUser?.name || 'Akademik Personel'}</h2>
              <p className="text-[13px] font-medium text-gray-500 mt-1">
                {userRole === 'admin' ? 'SÜPER YÖNETİCİ' : currentUser?.title || 'Bölüm Başkanı'} / {currentUser?.department || 'Bilgisayar Mühendisliği'}
              </p>
              
              <div className="mt-8 flex justify-between text-center px-2">
                <div>
                  <p className="text-2xl font-black text-blue-600">{stats.totalStudents}</p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Öğrenci</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div>
                  <p className="text-2xl font-black text-emerald-600">{stats.activeInterns}</p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Stajyer</p>
                </div>
              </div>

              <button onClick={() => setIsRadarOpen(true)} className="mt-8 w-full bg-slate-900 hover:bg-black text-white text-[14px] font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-[0.98]">
                Radar & İstatistikler
              </button>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Feed & Radar */}
        <div className="w-full max-w-[600px] shrink-0 space-y-6">
          
          {/* Welcome Header (Slimmer version for center column) */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-gray-900 mb-1">Hoş Geldiniz, {currentUser?.name}</h1>
                <p className="text-xs text-slate-500 font-medium">Bekleyen işlemleriniz ve onay havuzunuz.</p>
              </div>
              <div className="bg-red-50 px-4 py-2 rounded-2xl text-center border border-red-100">
                <div className="text-lg font-black text-red-600">{stats.pendingApprovals}</div>
                <div className="text-[10px] font-bold text-red-700 uppercase">Onay Bekliyor</div>
              </div>
            </div>
          </div>

        {/* --- RADAR / YÖNETİM PANELİ (COLLAPSIBLE) --- */}
        {isRadarOpen && (
          <div className="mb-8 animate-fade-in bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center gap-4 mb-4 mt-2">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-sm font-bold rounded-xl transition ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Genel İstatistikler</button>
              <button onClick={() => setActiveTab('approvals')} className={`px-4 py-2 text-sm font-bold rounded-xl transition ${activeTab === 'approvals' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Onay Havuzu ({stats.pendingApprovals})</button>
              <button onClick={() => setActiveTab('radar')} className={`px-4 py-2 text-sm font-bold rounded-xl transition ${activeTab === 'radar' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Stajyer Radarı</button>
              <button onClick={() => setActiveTab('badges')} className={`px-4 py-2 text-sm font-bold rounded-xl transition ${activeTab === 'badges' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Rozet Merkezi</button>
            </div>
            <div className="p-4 bg-slate-50/50 rounded-2xl">
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-gray-900 mb-4">Hızlı İşlemler</h3>
                    <button onClick={() => setActiveTab('approvals')} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-gray-900 text-sm">Onay Bekleyenler</div>
                          <div className="text-xs text-gray-500">Staj ve ÇAP başvuruları</div>
                        </div>
                      </div>
                      <div className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                        {stats.pendingApprovals}
                      </div>
                    </button>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
                      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Target size={18} className="text-blue-600" /> Bölüm Staj İstatistikleri</h3>
                      <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Users size={32} className="text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">Bölümünüze ait istatistik grafikleri burada gösterilecek.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'approvals' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-in">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Staj ve ÇAP Onay Havuzu</h3>
                  <div className="space-y-4">
                    {internships.map(internship => (
                      <div key={internship.id} className="flex flex-col sm:flex-row items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">{internship.studentName.charAt(0)}</div>
                          <div>
                            <h4 className="font-bold text-gray-900">{internship.studentName} <span className="text-xs text-gray-400 font-normal ml-2">({internship.studentNo})</span></h4>
                            <p className="text-sm text-gray-500">{internship.company} - {internship.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${internship.status === 'Onay Bekliyor' ? 'bg-amber-100 text-amber-700' : internship.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{internship.status}</span>
                          {internship.status === 'Onay Bekliyor' && (
                            <button onClick={() => handleApproveInternship(internship.id)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition tooltip" title="Onayla"><CheckCircle2 size={20} /></button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'radar' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-in">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg">Öğrenci Staj ve Kariyer Radarı</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 rounded-tl-xl">Öğrenci</th>
                          <th className="px-6 py-4">Firma / Kurum</th>
                          <th className="px-6 py-4">Durum / Tür</th>
                          <th className="px-6 py-4 rounded-tr-xl">Dönem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {internships.map(i => (
                          <tr key={i.id} className="hover:bg-slate-50/50 transition">
                            <td className="px-6 py-4 font-bold text-gray-900">{i.studentName} <span className="text-xs font-normal text-gray-400 block">{i.studentNo}</span></td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{i.company}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${i.status === 'Devam Ediyor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{i.type} ({i.status})</span></td>
                            <td className="px-6 py-4 text-gray-500">{i.term}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'badges' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><ShieldCheck className="text-iesu-red" size={24} /> Kurumsal Rozet Merkezi</h3>
                      <p className="text-sm text-gray-500 mt-1">Öğrencilere Sınıf Temsilcisi, Kulüp Başkanı vb. onaylı kurumsal rozetler atayın.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {students?.map(student => (
                      <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-slate-50 transition">
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                          <img src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`} className="w-12 h-12 rounded-full border border-gray-200 object-cover" alt="" />
                          <div>
                            <p className="font-bold text-gray-900 flex items-center gap-1.5">
                              {student.name}
                              {student.badge && <ShieldCheck size={16} className="text-blue-500" title={student.badge} />}
                            </p>
                            <p className="text-xs text-gray-500">{student.department || 'Bölüm Bilgisi Yok'} - {student.studentId || 'No Yok'}</p>
                            {student.badge && <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">{student.badge}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <select 
                            className="bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            onChange={(e) => {
                              if (!e.target.value) return;
                              if (setStudents) {
                                setStudents(students.map(s => s.id === student.id ? { ...s, badge: e.target.value } : s));
                              }
                              e.target.value = '';
                            }}
                          >
                            <option value="">Rozet Ata...</option>
                            <option value="Sınıf Temsilcisi">Sınıf Temsilcisi</option>
                            <option value="Kulüp Başkanı">Kulüp Başkanı</option>
                            <option value="Bölüm Birincisi">Bölüm Birincisi</option>
                            <option value="Onur Öğrencisi">Onur Öğrencisi</option>
                            <option value="">(Rozeti Kaldır)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-2">
              <button onClick={() => setIsRadarOpen(false)} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 p-2"><ChevronUp size={16} /> Radarı Gizle</button>
            </div>
          </div>
        )}

        {/* --- KARIYER AĞI (MOBİL İÇİN VEYA SEKME) --- */}
        {!isRadarOpen && activeTab === 'career_network' && (
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-fade-in">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><Compass className="text-blue-600" /> Kariyer Ağı</h2>
            <CareerNetwork companies={companies} students={students} alumni={alumni} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} hideHeader={true} />
          </div>
        )}
        
        {/* --- AKIŞ (FEED) --- */}
        {!isRadarOpen && activeTab === 'dashboard' && (
          <div className="space-y-6">
            <PostComposer currentUser={currentUser} userRole={userRole} posts={posts} setPosts={setPosts} />
            <div className="space-y-6">
              {(() => {
                const allItems = combineFeedItems(posts, events, news, announcements, jobs);
                const filteredItems = allItems.filter(item => 
                  (item.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (item.authorName || '').toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredItems.length === 0) {
                  return (
                    <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                      <MessageCircle size={32} className="text-gray-300 mb-4" />
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
            <div className="bg-white w-full max-w-5xl h-[95vh] sm:h-[85vh] sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl animate-slide-up sm:animate-fade-in relative">
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
              />
              </div>
            </div>
          </div>
        )}
        
        </div>

        {/* RIGHT PANEL: Dynamic Data */}
        <div className="hidden xl:block w-[300px] shrink-0 space-y-6">
          <CareerNetwork companies={companies} students={students} alumni={alumni} setView={setView} setSelectedUserId={setSelectedUserId} currentUser={currentUser} />
        </div>

      </main>

      {/* FLOATING DOCK (INSTAGRAM STYLE - LIGHT/BRAND THEME) */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[380px]">
        <div className="bg-white/90 backdrop-blur-2xl border border-gray-200/50 p-2 sm:p-2.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-between px-3">
          <button onClick={() => setActiveTab('dashboard')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'dashboard' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Akış">
            <Home size={26} strokeWidth={2} />
          </button>
          
          <button onClick={() => setView('jobs')} className="p-2.5 rounded-full transition-all flex items-center justify-center text-gray-400 hover:text-gray-900" title="İlanlar">
            <Briefcase size={24} strokeWidth={2} />
          </button>
          
          {/* CENTER: SEARCH ICON */}
          <button onClick={() => { setActiveTab('search'); setTimeout(() => document.getElementById('main-search')?.focus(), 100); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 text-gray-600 shadow-sm flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0" title="Ara">
            <Search size={24} strokeWidth={2.5} />
          </button>
          
          {/* MESSAGES */}
          <button onClick={() => setActiveTab('messaging')} className={`p-2.5 rounded-full transition-all flex items-center justify-center ${activeTab === 'messaging' ? 'text-iesu-red' : 'text-gray-400 hover:text-gray-900'}`} title="Mesajlar">
            <MessageCircle size={24} strokeWidth={2} />
          </button>
          
          {/* PROFILE AVATAR */}
          <button onClick={() => setView('user_profile')} className="p-1 rounded-full transition-all flex items-center justify-center border-2 border-transparent hover:border-gray-200" title="Profilim">
            <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=Akademisyen&background=DC2626&color=fff`} className="w-8 h-8 rounded-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </div>
  );
}
