const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

const startIdx = code.indexOf('{/* Job Publishing Modal */}');
const endIdx = code.lastIndexOf('</div>\n  );\n}');

const newModals = `
      {/* Job Publishing Modal (Live Preview & File Upload) */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl my-8 shadow-2xl overflow-hidden relative flex flex-col md:flex-row">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 z-10"></div>
            
            {/* Form Column */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 border-r border-gray-100 flex flex-col max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{editingJob ? 'İlanı Düzenle' : 'Yeni İlan Yayınla'}</h3>
                  <p className="text-gray-500 text-sm mt-1">{editingJob ? 'İlan bilgilerini güncelleyin.' : 'Öğrenci ve mezunların akışına yeni bir ilan ekleyin.'}</p>
                </div>
                <button onClick={() => setShowJobModal(false)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Başlığı</label>
                    <input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required placeholder="Örn: Frontend Geliştirici" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Firma / Kurum Adı</label>
                    <input type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required placeholder="Örn: TechNova Inc." />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Çalışma Türü</label>
                    <select value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                      <option value="TAM ZAMANLI">Tam Zamanlı</option>
                      <option value="YARI ZAMANLI">Yarı Zamanlı</option>
                      <option value="STAJ">Staj</option>
                      <option value="GÖNÜLLÜ">Gönüllü</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Konum (Şehir/İlçe)</label>
                    <input type="text" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Örn: İstanbul, Şişli" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Afiş / Görsel (Opsiyonel)</label>
                  <div className="relative group">
                    <input type="file" id="job-poster-upload" accept="image/*" className="hidden" onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                        setJobForm({...jobForm, poster: fileUrl});
                      }
                    }} />
                    <label htmlFor="job-poster-upload" className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all">
                      <UploadCloud className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" size={28} />
                      <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">Görsel Yüklemek İçin Tıklayın</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG veya WEBP (Maks. 2MB)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Detayı / Açıklama</label>
                  <textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" required placeholder="İş tanımı, aranan nitelikler ve diğer detaylar..."></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-auto">
                  <button type="button" onClick={() => setShowJobModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
                    <CheckCircle size={18} /> {editingJob ? 'Güncelle' : 'Yayınla ve Havuza Ekle'}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="hidden md:flex w-1/2 bg-gray-50 p-6 sm:p-8 flex-col max-h-[85vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Eye size={20} className="text-blue-500"/> Canlı Ön İzleme</h3>
                <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-4 transform scale-95 origin-top">
                <div className="p-5 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Briefcase className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Süper Admin (Kariyer Ofisi)</h4>
                      <p className="text-xs text-gray-500">İlan / Duyuru • Şimdi</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-xl text-gray-900">{jobForm.title || 'İlan Başlığı'}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Building size={16} />
                        <span className="font-medium text-sm">{jobForm.company || 'Firma Adı'}</span>
                        {jobForm.location && (
                          <>
                            <span className="text-gray-300">•</span>
                            <MapPin size={16} />
                            <span className="text-sm">{jobForm.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{jobForm.type || 'TAM ZAMANLI'}</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1"><CheckCircle size={12}/> Aktif İlan</span>
                  </div>

                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{jobForm.description || 'İlan açıklaması burada görünecek...'}</p>
                </div>

                {jobForm.poster && (
                  <div className="w-full h-48 bg-gray-100 border-t border-gray-100 relative">
                    <img src={jobForm.poster} alt="İlan Afişi" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm opacity-50 cursor-not-allowed">Başvur</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Voluntary Internship Modal */}
      {showVoluntaryInternshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-green-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Gönüllü Staj Duyurusu Yayınla</h3>
                    <p className="text-gray-500 text-xs mt-1">Bu ilan tüm öğrenci ve mezun akışlarında paylaşılır.</p>
                  </div>
                </div>
                <button onClick={() => setShowVoluntaryInternshipModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setShowVoluntaryInternshipModal(false);
                // Havuza Ekleme Mantığı Burada Çalışır
                alert("Gönüllü Staj İlanı Başarıyla Yayınlandı!");
              }} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Pozisyon / Başlık</label>
                    <input type="text" value={voluntaryForm.title} onChange={e => setVoluntaryForm({...voluntaryForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" required placeholder="Gönüllü Yazılım Stajyeri" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Firma Adı</label>
                    <input type="text" value={voluntaryForm.company} onChange={e => setVoluntaryForm({...voluntaryForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" required placeholder="XYZ Teknoloji" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Staj Açıklaması</label>
                  <textarea value={voluntaryForm.description} onChange={e => setVoluntaryForm({...voluntaryForm, description: e.target.value})} rows="4" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none" required placeholder="Stajyerden beklentiler, stajın içeriği..."></textarea>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Başvuru Linki veya Ek Bilgi</label>
                  <div className="relative">
                    <Link className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="url" placeholder="https://ornek.com/basvuru" value={voluntaryForm.link} onChange={e => setVoluntaryForm({...voluntaryForm, link: e.target.value})} className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Bu ilan yayınlandığında otomatik olarak <strong>Gönüllü Staj Başvuru Havuzu</strong>na eklenecektir. İlanın detayında sigorta işlemleriyle ilgili yasal metinler gizli tutulacak, sadece firmanın bilgileri görünecektir. Öğrenciler başvurularını yaptığında, listeyi dışa aktarıp firmalara Excel olarak gönderebilirsiniz.
    if(window.confirm('Bu eşleştirmeyi silmek istediğinize emin misiniz?')) {
      setMentorships(mentorships.filter(m => m.id !== id));
    }
  };

  const handleDeleteIntern = (id) => {
    if(window.confirm('Bu staj başvurusunu silmek istediğinize emin misiniz?')) {
      setVolunteerInterns(volunteerInterns.filter(v => v.id !== id));
    }
  };

  const [alumniAssocMembers, setAlumniAssocMembers] = useState([]);
  const [alumniCardRequests, setAlumniCardRequests] = useState([]);
  const [orgChartMembers, setOrgChartMembers] = useState([]);
  
  const handleDeleteAlumniAssoc = (id) => {
    if(window.confirm('Bu dernek üyeliğini silmek istediğinize emin misiniz?')) {
      setAlumniAssocMembers(alumniAssocMembers.filter(a => a.id !== id));
    }
  };

  const handleDeleteAlumniCard = (id) => {
    if(window.confirm('Bu kart başvurusunu silmek istediğinize emin misiniz?')) {
      setAlumniCardRequests(alumniCardRequests.filter(c => c.id !== id));
    }
  };

  const handleDeleteOrgChart = (id) => {
    if(window.confirm('Bu personeli şemadan silmek istediğinize emin misiniz?')) {
      setOrgChartMembers(orgChartMembers.filter(o => o.id !== id));
    }
  };
  const [newPostImage, setNewPostImage] = useState('');
  const [isJobPost, setIsJobPost] = useState(false);

  // Form States (Survey)
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyQuestion, setSurveyQuestion] = useState('');

  const handleDeleteSurvey = (id) => {
    if(window.confirm('Bu anketi silmek istediğinize emin misiniz?')) {
      setSurveys(surveys.filter(s => s.id !== id));
    }
  };

  // Form States (News & Events)
  const [neType, setNeType] = useState('haber');
  const [neTitle, setNeTitle] = useState('');
  const [neDesc, setNeDesc] = useState('');
  const [neDate, setNeDate] = useState('');
  const [neImage, setNeImage] = useState('');

  // Form States (SEM)
  const [semTitle, setSemTitle] = useState('');
  const [semDesc, setSemDesc] = useState('');
  const [semImage, setSemImage] = useState('');
  const [semIsFree, setSemIsFree] = useState(true);
  const [semPrice, setSemPrice] = useState('');
  
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: "Süper Admin (Kariyer Ofisi)",
        title: isJobPost ? "Öne Çıkan İlan" : "Resmi Duyuru",
        avatar: "/iesu-logo.svg"
      },
      time: "Şimdi",
      image: newPostImage || null,
      content: newPostContent,
      likes: 0,
      comments: 0,
      isJob: isJobPost,
      isApproved: true
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage('');
    setIsJobPost(false);
    alert("Gönderi başarıyla Öğrenci/Mezun Ağına (Feed) gönderildi!");
  };

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    if(!surveyTitle || !surveyQuestion) return;
    const newSurvey = {
      id: Date.now(),
      title: surveyTitle,
      question: surveyQuestion,
      time: "Şimdi",
      author: "Süper Admin (Kariyer Ofisi)",
      avatar: "/iesu-logo.svg"
    };
    setSurveys([newSurvey, ...(surveys || [])]);
    setSurveyTitle('');
    setSurveyQuestion('');
    setNeDesc('');
    setNeDate('');
    setNeImage('');
    alert('Haber/Etkinlik başarıyla eklendi!');
  };

  const handleSemSubmit = (e) => {
    e.preventDefault();
    setSemCourses([{ id: Date.now(), title: semTitle, desc: semDesc, image: semImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", isFree: semIsFree, price: semPrice }, ...(semCourses || [])]);
    setSemTitle(''); setSemDesc(''); setSemIsFree(true); setSemPrice(''); setSemImage('');
    alert("SEM Kursu başarıyla oluşturuldu!");
  };

  const approvePost = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, isApproved: true, time: "Şimdi" } : p));
  };

  const rejectPost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const pendingPosts = (posts || []).filter(p => p.isApproved === false);

  const SidebarButton = ({ active, onClick, icon, label, badge, pendingCount }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${active ? 'bg-white text-iesu-red shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
      {icon} {label}
      {(badge > 0 || pendingCount > 0) && (
        <span className="ml-auto bg-white text-iesu-red text-[10px] px-2 py-0.5 rounded-full font-black min-w-[20px] text-center">
          {badge || pendingCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-serif text-gray-900">
      <div className="w-[280px] bg-gradient-to-br from-iesu-red via-red-700 to-rose-950 flex flex-col shrink-0 relative overflow-hidden shadow-2xl z-10 text-red-100">
        <div className="p-6 border-b border-white/10 flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex justify-center mt-2 relative z-10">
            <Logo className="h-12 w-auto text-white" />
          </div>
          <p className="text-white/80 text-[10px] uppercase tracking-[0.25em] font-black relative z-10 mt-3">Kariyer Merkezi Paneli</p>
        </div>
        <div className="p-5 border-b border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setView('student')} className="flex flex-col items-center justify-center bg-white/5 hover:bg-white/20 hover:border-white/30 border border-white/10 p-3 rounded-2xl transition-all duration-300 text-[10px] font-bold gap-2 text-white hover:text-white shadow-sm backdrop-blur-sm">
              <Globe size={18} /> Öğrenci Ağı
            </button>
            <button onClick={() => setView('company')} className="flex flex-col items-center justify-center bg-white/5 hover:bg-white/20 hover:border-white/30 border border-white/10 p-3 rounded-2xl transition-all duration-300 text-[10px] font-bold gap-2 text-white hover:text-white shadow-sm backdrop-blur-sm">
              <Building2 size={18} /> Firma Ağı
            </button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar relative z-10">
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/50"></div> Analiz & Özet
            </p>
            <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} label="Gündem & İstatistikler" pendingCount={pendingPosts?.length} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/50"></div> Kullanıcı Havuzları
            </p>
            <SidebarButton active={activeTab === 'student_pool'} onClick={() => setActiveTab('student_pool')} icon={<Users size={18} />} label="Öğrenci Bilgi Havuzu" badge={students?.length} />
            <SidebarButton active={activeTab === 'alumni_pool'} onClick={() => setActiveTab('alumni_pool')} icon={<GraduationCap size={18} />} label="Mezun Bilgi Havuzu" badge={alumni?.length} />
            <SidebarButton active={activeTab === 'company'} onClick={() => setActiveTab('company')} icon={<Building2 size={18} />} label="Firma & İşveren Onayları" badge={companies?.filter(c => c.status === 'Onay Bekliyor')?.length || 0} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/50"></div> Kariyer & Gelişim
            </p>
            <SidebarButton active={activeTab === 'mentorship'} onClick={() => setActiveTab('mentorship')} icon={<Heart size={18} />} label="Mentorluk Programı" badge={mentorships?.filter(m => m.status === 'Eşleştirme Bekliyor')?.length || 0} />
            <SidebarButton active={activeTab === 'job_intern_approvals'} onClick={() => setActiveTab('job_intern_approvals')} icon={<Briefcase size={18} />} label="İş ve Staj İlanları" />
            <SidebarButton active={activeTab === 'volunteer_intern'} onClick={() => setActiveTab('volunteer_intern')} icon={<FileCheck size={18} />} label="Gönüllü Staj Başvuruları" badge={volunteerInterns?.filter(v => v.status === 'Onay Bekliyor')?.length || 0} />
            <SidebarButton active={activeTab === 'sem'} onClick={() => setActiveTab('sem')} icon={<Award size={18} />} label="SEM Kurs Yönetimi" />
          </div>
          <div className="space-y-1 mt-6">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40 px-4 mb-2">Destek & İletişim</h4>
            <SidebarButton active={activeTab === 'counseling'} onClick={() => setActiveTab('counseling')} icon={<MessageSquareQuote size={18} />} label="Danışmanlık Talepleri" badge={counselingRequests?.filter(r => r.status === 'Bekliyor')?.length || 0} />
            <SidebarButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<Heart size={18} />} label="Gelen Mesajlar" badge={messages?.filter(m => m.status === 'Okunmadı')?.length || 0} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/50"></div> Mezunlar Ofisi
            </p>
            <SidebarButton active={activeTab === 'alumni_assoc'} onClick={() => setActiveTab('alumni_assoc')} icon={<Network size={18} />} label="Mezun Derneği Paneli" />
            <SidebarButton active={activeTab === 'alumni_card'} onClick={() => setActiveTab('alumni_card')} icon={<CreditCard size={18} />} label="Mezun Kart Başvuruları" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/50"></div> İletişim & İçerik
            </p>
            <SidebarButton active={activeTab === 'news_events'} onClick={() => setActiveTab('news_events')} icon={<Newspaper size={18} />} label="Ana Vitrin (Haber/Etkinlik)" />
            <SidebarButton active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} icon={<Send size={18} />} label="Kariyer Ağı Gönderileri" />
            <SidebarButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<MessageSquareQuote size={18} />} label="Anket Yönetimi" />
            <SidebarButton active={activeTab === 'org_chart'} onClick={() => setActiveTab('org_chart')} icon={<Users size={18} />} label="Organizasyon Şeması" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/50"></div> Sistem
            </p>
            <SidebarButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Genel Ayarlar" />
          </div>
        </nav>
        <div className="p-5 border-t border-white/10 bg-black/10">
          <button onClick={() => setView('login')} className="flex items-center justify-center gap-3 text-red-200 hover:text-white w-full px-4 py-3.5 transition-all duration-300 font-bold rounded-2xl hover:bg-white/10 border border-transparent">
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-red-50/80 via-white to-gray-50">
        <header className="h-24 flex items-center justify-between px-10 shrink-0 bg-transparent relative z-20 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-800 rounded-full"></div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-wide">
              {{
                overview: 'Sistem Gündemi ve Özet',
                cms: 'Ağa (Feed) Resmi Gönderi Ekle',
                survey: 'Anket Oluştur (Oylama Sistemi)',
                news_events: 'Haber, Duyuru ve Etkinlik Yönetimi',
                sem: 'Sürekli Eğitim Merkezi (SEM)',
                student_pool: 'Öğrenci Data Havuzu',
                alumni_pool: 'Mezun Data Havuzu',
                company: 'Bekleyen Firma Kayıtları'
              }[activeTab] || 'Yönetici Paneli'}
            </h2>
          </div>
          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/50 shadow-lg shadow-slate-200/50 transition-all hover:shadow-xl hover:bg-white/80 cursor-pointer">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-black text-gray-900">Süper Admin</span>
              <span className="text-[11px] uppercase tracking-wider text-red-500 font-bold">Tam Yetkili</span>
            </div>
            <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-800 rounded-full flex items-center justify-center text-white font-black shadow-inner shadow-red-900/50 border-2 border-white">
              SA
            </div>
          </div>
        </header>

                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Platformdaki herkese ne duyurmak istersiniz?" 
                          rows="5" 
                          className="w-full p-5 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none resize-none text-gray-900 placeholder-gray-400 transition-all shadow-sm"
            <div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3 px-2 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/50"></div> Sistem
              </p>
              <SidebarButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Genel Ayarlar" />
              <SidebarButton active={activeTab === 'staff_management'} onClick={() => setActiveTab('staff_management')} icon={<ShieldCheck size={18} />} label="Yetkili Kadro Yönetimi" />
            </div>
          )}
        </nav>
        <div className="p-5 border-t border-white/10 bg-black/10">
          <button onClick={() => setView('login')} className="flex items-center justify-center gap-3 text-red-200 hover:text-white w-full px-4 py-3.5 transition-all duration-300 font-bold rounded-2xl hover:bg-white/10 border border-transparent">
            <LogOut size={18} /> Güvenli Çıkış
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative bg-gradient-to-br from-red-50/80 via-white to-gray-50">
        <header className="h-24 flex items-center justify-between px-10 shrink-0 bg-transparent relative z-20 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-red-500 to-red-800 rounded-full"></div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-wide">
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                        <input 
                          type="checkbox" 
                          id="isJob" 
                          checked={isJobPost}
                          onChange={(e) => setIsJobPost(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300 text-iesu-red focus:ring-iesu-red" 
                        />
                        <label htmlFor="isJob" className="font-bold text-gray-700 cursor-pointer flex items-center gap-2">
                          <Briefcase size={20} className="text-iesu-coral" /> Bu Gönderiyi İş/Staj İlanı Olarak İşaretle
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Afiş / Görsel Seç (İsteğe Bağlı)</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-3 px-4 max-w-sm mx-auto">
                        <span>Hiç Katılmıyorum</span>
                        <span>Tamamen Katılıyorum</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'news_events' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Sol Taraf: İçerik Yönetimi Formu */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">Ana Vitrine Haber / Etkinlik Ekle</h3>
                    <p className="text-gray-500 mt-2">Bu içerikler genel websitesi (vitrin) arayüzündeki Haberler ve Etkinlikler sekmesinde yayınlanır.</p>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleNewsSubmit} className="space-y-6">
                      <div className="flex gap-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                          <input type="radio" name="type" checked={neType === 'haber'} onChange={() => setNeType('haber')} className="text-iesu-red focus:ring-iesu-red w-5 h-5" /> Haber / Duyuru
                        </label>
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                          <input type="radio" name="type" checked={neType === 'etkinlik'} onChange={() => setNeType('etkinlik')} className="text-iesu-red focus:ring-iesu-red w-5 h-5" /> Etkinlik
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 transition-all duration-300 h-full max-w-sm mx-auto">
                    <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img 
                        src={neImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"} 
                        alt="News Preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider text-gray-900 uppercase shadow-sm">
                        {neType === 'haber' ? 'HABER' : 'ETKİNLİK'}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-iesu-red font-bold text-xs mb-3">
                        <Calendar size={14} /> {neDate ? new Date(neDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Seçilmedi'}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {neTitle || "Haber Başlığı Buraya Gelecek"}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                        {neDesc || "İçerik açıklaması burada yer alacak..."}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-2 text-iesu-red font-bold text-sm group-hover:gap-3 transition-all">
                          Detayları İncele <ArrowRight size={16} />
                        </span>
                    <Activity className="text-red-500" size={28} /> Firma Gönderi Onayları (Gündem)
                  </h3>
                  <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold border border-red-200 shadow-sm">
                    {pendingPosts?.length || 0} Gönderi Bekliyor
                  </span>
                </div>
                {(!pendingPosts || pendingPosts.length === 0) ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full shadow-inner flex items-center justify-center mb-6 border border-white/60">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-800 mb-3">Gündem Temiz</h4>
                    <p className="text-gray-500 max-w-md font-medium">Harika! Onay bekleyen hiçbir gönderi bulunmuyor. Her şey kontrol altında.</p>
                  </div>
                ) : (
                  <div className="p-8 space-y-4">
                    {pendingPosts.map(post => (
                      <div key={post.id} className="bg-white/80 border border-white rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-white transition-all shadow-md hover:shadow-lg">
                        <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[280px]">
                          <img src={post.author.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                          <div>
                            <p className="font-black text-gray-900 text-lg">{post.author.name}</p>
                            <p className="text-sm font-bold text-gray-500">{post.author.title}</p>
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                          <p className="text-base text-gray-700 font-medium italic">"{post.content}"</p>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto justify-end shrink-0">
                          <button onClick={() => approvePost(post.id)} className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5">
                            <Check size={18} /> Onayla
                          </button>
                          <button onClick={() => rejectPost(post.id)} className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-5 py-3 rounded-xl font-bold shadow-sm transition-all">
                            <X size={18} /> Reddet
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">Kariyer Ağına Resmi Duyuru Gönder</h3>
                    <p className="text-gray-500 mt-2">Buradan paylaştığınız içerikler anında Öğrenci, Mezun ve Firma ağında "Resmi Duyuru" rozetiyle yayınlanır.</p>
                      <div>
          {activeTab === 'survey' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Sol Taraf: İçerik Yönetimi Formu */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">Öğrenci & Mezun Ağına Anket Yolla</h3>
                    <p className="text-gray-500 mt-2">Oluşturduğunuz anket, kullanıcıların sosyal ağında (Feed) çıkacak ve "1 ile 5 arası" Likert ölçeğinde oylanabilecektir.</p>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleSurveySubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Anket Başlığı</label>
                        <input 
                          type="text" 
                          value={surveyTitle}
                          onChange={(e) => setSurveyTitle(e.target.value)}
                          placeholder="Örn: Kariyer Fuarı Geri Bildirimi" 
                          className="w-full p-4 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none text-gray-900 transition-all shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sorunuz (Likert Ölçekli Cevaplanacak)</label>
                        <textarea 
                          value={surveyQuestion}
                          onChange={(e) => setSurveyQuestion(e.target.value)}
                          placeholder="Örn: Katıldığınız fuardan ne derece memnun kaldınız? (1: Çok Kötü, 5: Çok İyi)" 
                          rows="3" 
                          className="w-full p-5 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none resize-none text-gray-900 transition-all shadow-sm"
                          required
                        ></textarea>
                      </div>
                      <div className="pt-2">
                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-6 py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-md text-lg">
                          <MessageSquareQuote size={22} /> Anketi Feed'de Yayınla
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Sağ Taraf: Canlı Önizleme */}
                <div className="bg-gray-100 rounded-3xl p-6 border border-gray-200 h-fit">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={16} /> Canlı Önizleme (Öğrenci Akışı)
                  </h3>

                  {/* PREVIEW CARD - SURVEY BİREBİR KOPYA */}
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-6 max-w-sm mx-auto">
                    <div className="p-4 flex items-center gap-3 border-b border-gray-100 bg-blue-50/30">
                      <img src="https://ui-avatars.com/api/?name=Kariyer&background=D32F2F&color=fff" alt="Author" className="w-10 h-10 rounded-full border border-gray-200" />
                      <div>
                        <h3 className="font-bold text-gray-900 text-[14px]">İESÜ Kariyer Merkezi</h3>
                        <p className="text-blue-600 text-[11px] font-bold">Yeni Anket • Şimdi</p>
                      </div>
                    </div>
                    <div className="p-6 text-center">
                      <h4 className="text-xl font-black text-gray-900 mb-2">{surveyTitle || "Anket Başlığı"}</h4>
                      <p className="text-gray-600 mb-6 font-medium">{surveyQuestion || "Sorunuz burada görüntülenecektir..."}</p>
                      
                      <div className="flex justify-center gap-2 sm:gap-4 pointer-events-none">
                        {[1, 2, 3, 4, 5].map(score => (
                          <div 
                            key={score}
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 border-gray-200 text-gray-400 bg-white"
                          >
                            {score}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-3 px-4 max-w-sm mx-auto">
                        <span>Hiç Katılmıyorum</span>
                        <span>Tamamen Katılıyorum</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Yayındaki Anketler Tablosu */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Yayındaki Anketler</h3>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{surveys?.length || 0} Anket</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-4 font-bold uppercase tracking-wider w-12 text-center">ID</th>
                        <th className="p-4 font-bold uppercase tracking-wider">Anket Soru & Başlığı</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-center">Oluşturan</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {surveys?.map((survey) => (
                        <tr key={survey.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-400 font-mono text-center">#{survey.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900">{survey.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{survey.question}</p>
                          </td>
                          <td className="p-4 text-center">
                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">{survey.author}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-blue-100 hover:text-blue-600 transition tooltip" title="Düzenle">
                                <MoreHorizontal size={16} />
                              </button>
                              <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition tooltip" title="Sil">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

                        <Calendar size={14} /> {neDate ? new Date(neDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tarih Seçilmedi'}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                        {neTitle || "Haber Başlığı Buraya Gelecek"}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                        {neDesc || "İçerik açıklaması burada yer alacak..."}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-2 text-iesu-red font-bold text-sm group-hover:gap-3 transition-all">
                          Detayları İncele <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Yayındaki Haberler ve Etkinlikler Tablosu */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">Yayındaki Haberler ve Etkinlikler</h3>
                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{[...(news || []), ...(events || [])].length} İçerik</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-4 font-bold uppercase tracking-wider w-12 text-center">ID</th>
                        <th className="p-4 font-bold uppercase tracking-wider w-20">Afiş</th>
                        <th className="p-4 font-bold uppercase tracking-wider">Başlık & Açıklama</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-center">Tür</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[...(news || []), ...(events || [])].map((item) => (
                        <tr key={item.id + item.type} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-400 font-mono text-center">#{item.id}</td>
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900 line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.desc}</p>
                          </td>
                          <td className="p-4 text-center">
                            {item.type === 'haber' ? (
                              <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">Haber</span>
                            ) : (
                              <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">Etkinlik</span>
                            )}
                          </td>
                          <td className="p-4 text-center text-gray-600 font-medium whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-blue-100 hover:text-blue-600 transition tooltip" title="Düzenle">
                                <MoreHorizontal size={16} />
                              </button>
                              <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition tooltip" title="Sil">
                                <X size={16} />






















































          {activeTab === 'sem' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Sol Taraf: Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="p-8 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-2xl font-bold text-gray-900">SEM Kursu Tanımla</h3>
                    <p className="text-gray-500 mt-2">Sürekli Eğitim Merkezi (SEM) portalında yayınlanmak üzere yeni sertifika kursları ekleyin.</p>
                  </div>
                  <div className="p-8">
                    <form onSubmit={handleSemSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Eğitim Başlığı</label>
                        <input type="text" value={semTitle} onChange={e => setSemTitle(e.target.value)} placeholder="Örn: İleri Excel ve Veri Analizi Eğitimi" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none" required />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Afiş / Görsel Seç</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setSemImage(URL.createObjectURL(file));
                              }
                            }}
                            className="w-full pl-5 pr-5 py-3 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral outline-none text-gray-700 transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-white hover:file:bg-gray-900 file:cursor-pointer file:transition-colors cursor-pointer"
                          />
                          {semImage && (
                            <button type="button" onClick={() => setSemImage('')} className="absolute right-4 top-4 text-gray-400 hover:text-red-500 font-bold text-sm">
                              Görseli Kaldır
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Eğitim İçeriği</label>
                        <textarea value={semDesc} onChange={e => setSemDesc(e.target.value)} placeholder="Kurs Müfredatı, eğitmen bilgileri ve kazanımlar..." rows="5" className="w-full p-5 bg-white border border-gray-300 rounded-2xl resize-none shadow-sm focus:ring-2 focus:ring-iesu-coral outline-none" required></textarea>
                      </div>
                      
                      <button type="submit" className="bg-iesu-coral text-white font-bold px-6 py-4 rounded-2xl hover:bg-red-600 transition shadow-md w-full text-lg">
                        Kursu Yayına Al
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sağ Taraf: Canlı Önizleme */}
                <div className="bg-gray-100 rounded-3xl p-6 border border-gray-200 h-fit">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={16} /> Canlı Önizleme (SEM Kartı)
            </div>
          )}

          {activeTab === 'student_pool' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mb-8 overflow-hidden">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Database className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={32} /> Öğrenci Data Havuzu
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Yalnızca "Aktif Öğrenci" statüsündeki kayıtlar ({students?.length || 0} kayıt).</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                    <input type="text" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} placeholder="Öğrenci Ara..." className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-iesu-coral outline-none text-sm w-full md:w-64 shadow-sm" />
                    <label className={`flex items-center gap-2 bg-gradient-to-r from-iesu-red to-iesu-coral text-white px-6 py-3 rounded-xl font-bold transition-all border border-transparent w-full md:w-auto justify-center ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-red-500/30 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Excel Verisi İşleniyor...' : "Excel'den Toplu İçe Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('students'); }} disabled={isSyncing} />
                    </label>
                    {students?.length > 0 && (
                      <button className="flex items-center gap-2 bg-white text-green-600 px-5 py-3 rounded-xl font-bold hover:bg-green-50 transition border border-green-200 shadow-sm shrink-0 w-full md:w-auto justify-center">
                        <FileSpreadsheet size={18} /> Excel Olarak İndir
                      </button>
                    )}
                  </div>
                </div>
                
                {students?.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center bg-white/40">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Database size={40} className="text-iesu-coral" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Veritabanı Şu An Boş</h4>
                    <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">Öğrenciler portala E-Devlet ile giriş yaptıklarında otomatik olarak bu havuza yansıyacaklardır. Dilerseniz elinizdeki güncel listeyi Excel formatında toplu olarak içeri aktarabilirsiniz.</p>
                    <label className={`flex items-center gap-2 bg-white border-2 border-iesu-red text-iesu-red px-8 py-3 rounded-full font-bold transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-iesu-red hover:text-white cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <FileSpreadsheet size={20} />}
                      {isSyncing ? 'Veri İşleniyor...' : "Excel'den Toplu Aktar"}
                      <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { if(e.target.files.length) handleSync('students'); }} disabled={isSyncing} />
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-4 font-bold uppercase tracking-wider w-12 text-center">ID</th>
                        <th className="p-4 font-bold uppercase tracking-wider w-24 text-center">Afiş</th>
                        <th className="p-4 font-bold uppercase tracking-wider">Eğitim Başlığı & İçerik Özeti</th>
                        <th className="p-4 font-bold uppercase tracking-wider text-center">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {semCourses?.map((course) => (
                        <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-gray-400 font-mono text-center">#{course.id}</td>
                          <td className="p-4">
                            <div className="w-16 h-12 rounded bg-gray-100 mx-auto overflow-hidden border border-gray-200">
                              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-900 line-clamp-1">{course.title}</p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{course.desc}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-blue-100 hover:text-blue-600 transition tooltip" title="Düzenle">
                                <MoreHorizontal size={16} />
                              </button>
                              <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition tooltip" title="Sil">
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'student_pool' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 mb-8 overflow-hidden">
                <div className="p-8 border-b border-gray-200/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-red-50/50 to-transparent gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      <Database className="text-iesu-coral" size={28} /> Öğrenci Data Havuzu
                    </h3>
              </div>
            </div>
          )}

          {activeTab === 'alumni_pool' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 mb-8 overflow-hidden">
                <div className="p-8 border-b border-gray-200/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-blue-50/50 to-transparent gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      <GraduationCap className="text-blue-500" size={28} /> Mezun Data Havuzu
                    </h3>
                    <p className="text-gray-500 mt-2 font-medium">İESÜ Mezunlarının kayıtları ve güncel istihdam durumları ({alumni?.length || 0} kayıt).</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                    <button 
                      onClick={() => handleSync('alumni')}
                      disabled={isSyncing}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all border border-transparent disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                    >
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 
                      {isSyncing ? 'Excel Verisi İşleniyor...' : "Excel'den Toplu İçe Aktar"}
                    </button>
                    {alumni?.length > 0 && (
                      <button className="flex items-center gap-2 bg-white text-green-600 px-5 py-3 rounded-xl font-bold hover:bg-green-50 transition border border-green-200 shadow-sm shrink-0 w-full md:w-auto justify-center">
                        <FileSpreadsheet size={18} /> Excel Olarak İndir
                      </button>
                    )}
                  </div>
                </div>
                
                {alumni?.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center bg-white/40">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <GraduationCap size={40} className="text-blue-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Mezun Havuzu Şu An Boş</h4>
                    <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">Mezunlar portal üzerinden E-Devlet ile kayıt olduklarında otomatik olarak bu havuza düşeceklerdir. Alternatif olarak mevcut mezun listenizi Excel ile sisteme yükleyebilirsiniz.</p>
                    <button 
                      onClick={() => handleSync('alumni')}
                      disabled={isSyncing}
                      className="flex items-center gap-2 bg-white border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-sm"
                    >
                      {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <FileSpreadsheet size={20} />}
                      Excel'den Toplu Aktar
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto bg-white/40">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider w-16 text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Ad Soyad</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Mezuniyet (Bölüm/Yıl)</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Çalıştığı Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Pozisyon</th>
                        <th className="p-5 font-bold uppercase tracking-wider">İletişim</th>
                </div>
                )}
              </div>
            </div>
          )}

          {/* İş ve Staj İlanları (Yönetim Paneli) */}
          {activeTab === 'job_intern_approvals' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Briefcase className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={32} /> İş ve Staj İlanları Havuzu
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Sistemde yayınlanan ve onay bekleyen ilanları yönetin ({jobs.length} İlan).</p>
                  </div>
                  <div className="relative z-10">
                    <button onClick={() => alert('Yeni İlan ekleme paneli yapım aşamasında.')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
                      <Briefcase size={18} /> Yeni İlan Ekle
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white/40 max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">İlan Başlığı & Türü</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Firma / Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">



















                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                      <Building2 className="text-gray-700" size={28} /> Firma Veritabanı & Onaylar
                    </h3>
                    <p className="text-gray-500 mt-2 font-medium">Sisteme kayıtlı veya onay bekleyen şirketler ({companies?.length || 0} kayıt).</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-10">
                    <input type="text" value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} placeholder="Şirket Ara..." className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none text-sm w-full md:w-64 shadow-sm" />
                    <label className={`flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-xl font-bold transition-all border border-transparent w-full md:w-auto justify-center ${isSyncing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-gray-900/30 cursor-pointer'}`}>
                      {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <FileSpreadsheet size={18} />} 

          {/* Mentorluk Programı Yönetimi */}
          {activeTab === 'mentorship' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-red-950 via-gray-900 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Heart className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" size={32} /> Mentorluk Programı
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Mentor (Uzman) ve Menti (Öğrenci) eşleştirmelerini ve program süreçlerini yönetin ({mentorships.length} Kayıt).</p>
                  </div>
                  <div className="relative z-10">
                    <button onClick={() => alert('Yeni eşleştirme paneli yapım aşamasında.')} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 w-full md:w-auto justify-center border border-red-400/50">
                      <Heart size={18} /> Yeni Eşleştirme
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/50 border-b border-white">
                      <tr className="text-gray-600 text-sm">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Mentor (Uzman)</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Menti (Öğrenci)</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {mentorships.map((m) => (
                        <tr key={m.id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{m.id}</td>
                          <td className="p-5 font-bold text-gray-900">{m.mentor}</td>
                          <td className="p-5 text-gray-700 font-medium">{m.mentee}</td>
                          <td className="p-5 text-gray-600 font-mono text-center">{m.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              <Building2 size={18} />
                            </div>
                            <div>
                              <p>{company.name}</p>
                              <p className="text-xs text-gray-500 font-medium">{company.sector}</p>
                            </div>
                          </td>
                          <td className="p-5">
                            <p className="font-medium text-gray-700">{company.representative}</p>
                            <p className="text-xs text-blue-600">{company.email}</p>
                          </td>
                          <td className="p-5 text-center font-bold text-gray-700">{company.jobCount}</td>
                          <td className="p-5 text-center">
                            {company.status === 'Onaylı' ? (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center justify-center gap-1 w-max mx-auto">
                                <CheckCircle size={12} /> Onaylı
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 flex items-center justify-center gap-1 w-max mx-auto animate-pulse">
                                <AlertTriangle size={12} /> Bekliyor
                              </span>
                            )}
                          </td>
                          <td className="p-5">
                            <div className="flex justify-center gap-2">
                              {company.status === 'Onay Bekliyor' ? (
                                <>
                                  <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition tooltip" title="Onayla">
                                    <Check size={18} />
            </div>
          )}

          {/* İş ve Staj İlanları (Yönetim Paneli) */}
          {activeTab === 'job_intern_approvals' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Briefcase className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={32} /> İş ve Staj İlanları Havuzu
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Sistemde yayınlanan ve onay bekleyen ilanları yönetin ({jobs.length} İlan).</p>
                  </div>
                                    <div className="relative z-10 flex flex-wrap gap-3">
                    <button onClick={() => {
                      setEditingJob(null);
                      setJobForm({ title: '', company: '', type: 'TAM ZAMANLI', location: '', description: '', poster: '' });
                      setShowJobModal(true);
                    }} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm justify-center">
                      <Briefcase size={18} /> Yeni İlan Ekle
                    </button>
                    <button onClick={() => setShowVoluntaryInternshipModal(true)} className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-600 transition shadow-sm justify-center">
                      <Globe size={18} /> Gönüllü Staj Duyurusu
                    </button>
                    <button onClick={() => alert('Başvuru Havuzu Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm justify-center">
                      <Download size={18} /> Havuzu Dışa Aktar
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto bg-white/40 max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className="text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider text-center">ID</th>
                        <th className="p-5 font-bold uppercase tracking-wider">İlan Başlığı & Türü</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Firma / Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Tarih</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-center">Durum</th>
                        <th className="p-5 font-bold uppercase tracking-wider text-right">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-5 text-gray-400 font-mono text-center">#{job.id}</td>
                          <td className="p-5 font-bold text-gray-900">
                            {job.title}
                            <span className={`block mt-1 w-max px-2 py-0.5 rounded text-[10px] font-bold ${job.type === 'STAJ' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {job.type}
                            </span>
                          </td>
                          <td className="p-5 text-gray-600 font-medium">{job.company}</td>
                          <td className="p-5 text-gray-500 font-mono text-center">{job.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {job.status === 'Beklemede' && (
                              <button onClick={() => setJobs(jobs.map(j => j.id === job.id ? { ...j, status: 'Yayında' } : j))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Yayınla</button>
                            )}
                            <button onClick={() => handleEditJob(job)} className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Düzenle</button>
                            <button onClick={() => handleDeleteJob(job.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Mentorluk Programı Yönetimi */}
          {activeTab === 'mentorship' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-red-950 via-gray-900 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Heart className="text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" size={32} /> Mentorluk Programı
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Mentor (Uzman) ve Menti (Öğrenci) eşleştirmelerini ve program süreçlerini yönetin ({mentorships.length} Kayıt).</p>
                  </div>
                                    <div className="relative z-10 flex gap-3 flex-col md:flex-row w-full md:w-auto flex-wrap">
                    <button onClick={() => setShowMentorCallModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 justify-center border border-red-400/50">
                      <Send size={18} /> Çağrı Yayınla
                    </button>
                    <button onClick={() => setShowMentorFormBuilder(true)} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 justify-center border border-purple-400/50">
                      <Edit3 size={18} /> Formu Düzenle
                    </button>
                    <button onClick={() => alert('Başvurular Excel olarak indiriliyor...')} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 justify-center border border-emerald-400/50">
                      <Download size={18} /> Excel'e Aktar
                    </button>
                  </div>
                            <button onClick={() => handleDeleteMentorship(m.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Gönüllü Staj Başvuruları */}
          {activeTab === 'volunteer_intern' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                          <td className="p-5 text-gray-600 font-mono text-center">{m.date}</td>
                          <td className="p-5 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="p-5 text-right flex items-center justify-end gap-2">
                            {m.status === 'Eşleştirme Bekliyor' && (
                              <button onClick={() => setMentorships(mentorships.map(x => x.id === m.id ? { ...x, status: 'Aktif' } : x))} className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Onayla</button>
                            )}
                            <button onClick={() => handleDeleteMentorship(m.id)} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Gönüllü Staj Başvuruları */}
          {activeTab === 'volunteer_intern' && (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">















































































            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 overflow-hidden mb-8">
                <div className="p-10 border-b border-gray-700/50 flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-gray-900 via-gray-800 to-black gap-4 relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white flex items-center gap-3">
                      <Users className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={32} /> Organizasyon Şeması
                    </h3>
                    <p className="text-gray-300 mt-2 font-medium">Kariyer merkezi ekibini, yönetici ve danışmanları düzenleyin.</p>
                  </div>
                  <div>
                    <button onClick={() => alert('Personel ekleme formu yapım aşamasında')} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center">
                      <Plus size={18} /> Personel Ekle
                  Öğrencilerin ve mezunların kariyer danışmanlık randevuları ve talepleri bu alanda listelenecektir. Takvim entegrasyonu ve onay süreçleri aktif edildiğinde bu panel kullanıma açılacaktır.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto animate-fade-in p-12 text-center bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/60 mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-lg shadow-blue-500/20">
                  <Heart size={40} />
                </div>
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-4">Gelen Mesajlar (Yakında)</h2>
                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed font-medium">
                  Öğrencilerden, firmalardan veya diğer paydaşlardan gelen doğrudan mesajlar burada toplanacaktır. İletişim altyapısı kurulduğunda mesaj paneli devreye alınacaktır.
                </p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// Helper Components
function SidebarButton({ active, onClick, icon, label, pendingCount, badge }) {
  return (
        <span className="bg-black/20 text-white/90 text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, color, icon, bg }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border border-gray-100 ${color} border-b-4 shadow-sm relative overflow-hidden group`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{title}</p>
          <h3 className={`text-4xl font-black mt-2 text-gray-900`}>{value}</h3>
        </div>
        <div className={`p-4 rounded-2xl ${bg}`}>
          {icon}
        </div>
      </div>

      {/* Job Publishing Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{editingJob ? 'İlanı Düzenle' : 'Yeni İlan Yayınla'}</h3>
                  <p className="text-gray-500 text-sm mt-1">{editingJob ? 'İlan bilgilerini güncelleyin.' : 'Öğrenci ve mezunların akışına yeni bir ilan ekleyin.'}</p>
                </div>
                <button onClick={() => setShowJobModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">İlan Başlığı</label>
                    <input type="text" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Firma / Kurum Adı</label>
                    <input type="text" value={jobForm.company} onChange={e => setJobForm({...jobForm, company: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" required />



















































































































































































                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-3 items-start">
                  <Info className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Bu ilan yayınlandığında otomatik olarak <strong>Gönüllü Staj Başvuru Havuzu</strong>na eklenecektir. İlanın detayında sigorta işlemleriyle ilgili yasal metinler gizli tutulacak, sadece firmanın bilgileri görünecektir. Öğrenciler başvurularını yaptığında, listeyi dışa aktarıp firmalara Excel olarak gönderebilirsiniz.
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setShowVoluntaryInternshipModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">İptal</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm hover:shadow-lg transition-all flex items-center gap-2">
                    <Send size={18} /> Akışta Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mentor Form Builder Modal */}
      {showMentorFormBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-fuchsia-600"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Mentorluk Başvuru Formu Düzenleyicisi</h3>
                    <p className="text-gray-500 text-xs mt-1">Öğrencilerin dolduracağı formu buradan özelleştirin.</p>
                  </div>
                </div>
                <button onClick={() => setShowMentorFormBuilder(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {mentorFormFields.map((field, idx) => (
                  <div key={field.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 relative group">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg" onClick={() => {
                        setMentorFormFields(mentorFormFields.filter(f => f.id !== field.id));
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Soru Metni</label>
                          <input type="text" value={field.label} onChange={(e) => {
                            const newFields = [...mentorFormFields];
                            newFields[idx].label = e.target.value;
                            setMentorFormFields(newFields);
                          }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" />
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="w-1/2">
                            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Cevap Tipi</label>
                            <select value={field.type} onChange={(e) => {
                              const newFields = [...mentorFormFields];
                              newFields[idx].type = e.target.value;
                              setMentorFormFields(newFields);
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none">
                              <option value="text">Kısa Metin</option>
                              <option value="textarea">Uzun Paragraf</option>
                              <option value="select">Çoktan Seçmeli (Açılır Menü)</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2 mt-5">
                            <input type="checkbox" id={`req-${field.id}`} checked={field.required} onChange={(e) => {
                              const newFields = [...mentorFormFields];
                              newFields[idx].required = e.target.checked;
                              setMentorFormFields(newFields);
                            }} className="w-4 h-4 text-purple-600 rounded" />
                            <label htmlFor={`req-${field.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">Zorunlu Alan</label>
                          </div>
                        </div>
                        {field.type === 'select' && (
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Seçenekler (Virgülle Ayırın)</label>
                            <input type="text" value={field.options || ''} onChange={(e) => {
                              const newFields = [...mentorFormFields];
                              newFields[idx].options = e.target.value;
                              setMentorFormFields(newFields);
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="Örn: A, B, C" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => {




















































































