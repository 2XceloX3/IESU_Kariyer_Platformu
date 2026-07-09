import React, { useState } from 'react';
import { Users, Building2, Calendar, FileSpreadsheet, Activity, LayoutDashboard, Settings, LogOut, CheckCircle, XCircle, Send, Image as ImageIcon, Briefcase, ExternalLink, Globe, Newspaper, GraduationCap, Check, X, AlertTriangle, MessageSquareQuote } from 'lucide-react';

export default function AdminDashboard({ setView, posts, setPosts, news, setNews, events, setEvents, semCourses, setSemCourses, surveys, setSurveys }) {
  const [activeTab, setActiveTab] = useState('overview'); 
  // overview, cms, survey, news_events, sem, student_pool, alumni_pool, company

  // Form States (CMS Feed)
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [isJobPost, setIsJobPost] = useState(false);

  // Form States (Survey)
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyQuestion, setSurveyQuestion] = useState('');

  // Form States (News & Events)
  const [neType, setNeType] = useState('haber');
  const [neTitle, setNeTitle] = useState('');
  const [neDesc, setNeDesc] = useState('');
  const [neDate, setNeDate] = useState('');

  // Form States (SEM)
  const [semTitle, setSemTitle] = useState('');
  const [semDesc, setSemDesc] = useState('');
  
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: "Süper Admin (Kariyer Ofisi)",
        title: isJobPost ? "Öne Çıkan İlan" : "Resmi Duyuru",
        avatar: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png"
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
      avatar: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png"
    };
    setSurveys([newSurvey, ...(surveys || [])]);
    setSurveyTitle('');
    setSurveyQuestion('');
    alert("Anket yayınlandı. Öğrenciler/Mezunlar Likert (1-5) oylamasını görebilecek.");
  };

  const handleNewsSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), title: neTitle, description: neDesc, date: neDate };
    if (neType === 'haber') {
      setNews([newItem, ...(news || [])]);
    } else {
      setEvents([newItem, ...(events || [])]);
    }
    setNeTitle(''); setNeDesc(''); setNeDate('');
    alert("İçerik başarıyla vitrine eklendi!");
  };

  const handleSemSubmit = (e) => {
    e.preventDefault();
    setSemCourses([{ id: Date.now(), title: semTitle, description: semDesc }, ...(semCourses || [])]);
    setSemTitle(''); setSemDesc('');
    alert("SEM Kursu başarıyla oluşturuldu!");
  };

  const approvePost = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, isApproved: true, time: "Şimdi" } : p));
  };

  const rejectPost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const pendingPosts = (posts || []).filter(p => p.isApproved === false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      
      {/* Sidebar - Clean Corporate Design */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 relative overflow-hidden shadow-sm z-10">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-3xl font-black text-iesu-red drop-shadow-sm">İESÜ Admin</h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">Kariyer Kontrol Paneli</p>
        </div>
        
        <div className="p-6 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Portal Gezgini</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setView('student')} className="flex flex-col items-center justify-center bg-gray-50 hover:bg-iesu-red/5 hover:border-iesu-red/30 border border-gray-200 p-3 rounded-xl transition-all duration-300 text-[11px] font-bold gap-2 text-gray-600 hover:text-iesu-red">
              <Globe size={18} /> Öğrenci Ağı
            </button>
            <button onClick={() => setView('company')} className="flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-600/5 hover:border-blue-600/30 border border-gray-200 p-3 rounded-xl transition-all duration-300 text-[11px] font-bold gap-2 text-gray-600 hover:text-blue-600">
              <Building2 size={18} /> Firma Ağı
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 mt-2 px-2">Yönetim Modülleri</p>
          
          <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Gündem & Özet" pendingCount={pendingPosts?.length} />
          <SidebarButton active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} icon={<Send size={20} />} label="Ağa Gönderi Ekle" />
          <SidebarButton active={activeTab === 'survey'} onClick={() => setActiveTab('survey')} icon={<MessageSquareQuote size={20} />} label="Anket Yönetimi" />
          <SidebarButton active={activeTab === 'news_events'} onClick={() => setActiveTab('news_events')} icon={<Newspaper size={20} />} label="Vitrin Haber/Etkinlik" />
          <SidebarButton active={activeTab === 'sem'} onClick={() => setActiveTab('sem')} icon={<GraduationCap size={20} />} label="SEM Kurs Yönetimi" />
          <SidebarButton active={activeTab === 'student_pool'} onClick={() => setActiveTab('student_pool')} icon={<Users size={20} />} label="Öğrenci Havuzu" />
          <SidebarButton active={activeTab === 'alumni_pool'} onClick={() => setActiveTab('alumni_pool')} icon={<Users size={20} />} label="Mezun Havuzu" />
          <SidebarButton active={activeTab === 'company'} onClick={() => setActiveTab('company')} icon={<Building2 size={20} />} label="Firma Kayıt Onayları" badge={4} />
        </nav>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button onClick={() => setView('login')} className="flex items-center gap-3 text-gray-500 hover:text-iesu-red w-full px-4 py-3 transition-colors font-bold rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100">
            <LogOut size={20} /> Güvenli Çıkış
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-gray-50/50">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 shrink-0 border-b border-gray-200 bg-white shadow-sm relative z-20">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
            {activeTab === 'overview' && 'Sistem Gündemi ve Özet'}
            {activeTab === 'cms' && 'Ağa (Feed) Resmi Gönderi Ekle'}
            {activeTab === 'survey' && 'Anket Oluştur (Oylama Sistemi)'}
            {activeTab === 'news_events' && 'Haber, Duyuru ve Etkinlik Yönetimi'}
            {activeTab === 'sem' && 'Sürekli Eğitim Merkezi (SEM)'}
            {activeTab === 'student_pool' && 'Öğrenci Data Havuzu'}
            {activeTab === 'alumni_pool' && 'Mezun Data Havuzu'}
            {activeTab === 'company' && 'Bekleyen Firma Kayıtları'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-800">Süper Admin</span>
              <span className="text-xs text-iesu-coral font-bold">Tam Yetkili</span>
            </div>
            <div className="h-12 w-12 bg-iesu-red rounded-xl flex items-center justify-center text-white font-black shadow-md">
              SA
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10 relative z-10">
          
          {activeTab === 'overview' && (
            <div className="animate-fade-in max-w-6xl mx-auto">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Toplam Öğrenci" value="9,450" color="border-b-blue-500" icon={<Users className="text-blue-500" size={24} />} bg="bg-blue-50" />
                <StatCard title="Toplam Mezun" value="3,000" color="border-b-purple-500" icon={<Users className="text-purple-500" size={24} />} bg="bg-purple-50" />
                <StatCard title="Partner Firma" value="128" color="border-b-green-500" icon={<Building2 className="text-green-500" size={24} />} bg="bg-green-50" />
                <StatCard title="Onay Bekleyenler" value={(pendingPosts?.length || 0) + 4} color="border-b-iesu-red" icon={<AlertTriangle className="text-iesu-red animate-pulse" size={24} />} bg="bg-red-50" />
              </div>

              {/* Pending Approvals (Gündem) */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Activity className="text-iesu-coral" /> Firma Gönderi Onayları (Gündem)
                  </h3>
                  <span className="bg-red-100 text-iesu-red px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                    {pendingPosts?.length || 0} Gönderi Bekliyor
                  </span>
                </div>

                {(!pendingPosts || pendingPosts.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                      <CheckCircle size={32} />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">Gündem temiz. Onay bekleyen gönderi yok.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPosts.map(post => (
                      <div key={post.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4 w-full md:w-auto md:min-w-[250px]">
                          <img src={post.author.avatar} alt="Avatar" className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                          <div>
                            <p className="font-bold text-gray-900">{post.author.name}</p>
                            <p className="text-xs text-gray-500">{post.author.title}</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">"{post.content}"</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto justify-end shrink-0">
                          <button onClick={() => approvePost(post.id)} className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-xl font-bold text-sm transition-all border border-green-200">
                            <Check size={16} /> Onayla
                          </button>
                          <button onClick={() => rejectPost(post.id)} className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl font-bold text-sm transition-all border border-red-200">
                            <X size={16} /> Reddet
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
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-900">Kariyer Ağına Resmi Duyuru Gönder</h3>
                  <p className="text-gray-500 mt-2">Buradan paylaştığınız içerikler anında Öğrenci, Mezun ve Firma ağında "Resmi Duyuru" rozetiyle yayınlanır.</p>
                </div>
                <div className="p-8">
                  <form onSubmit={handlePostSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Duyuru Metni</label>
                      <textarea 
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Platformdaki herkese ne duyurmak istersiniz?" 
                        rows="5" 
                        className="w-full p-5 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none resize-none text-gray-900 placeholder-gray-400 transition-all shadow-sm"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Görsel URL (İsteğe Bağlı)</label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input 
                          type="url" 
                          value={newPostImage}
                          onChange={(e) => setNewPostImage(e.target.value)}
                          placeholder="https://... (Görsel linki)" 
                          className="w-full pl-12 pr-5 py-4 bg-white border border-gray-300 rounded-2xl focus:bg-gray-50 focus:ring-2 focus:ring-iesu-coral/30 outline-none text-gray-900 transition-all shadow-sm"
                        />
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
                      </label>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full flex items-center justify-center gap-2 bg-iesu-red text-white font-bold px-6 py-4 rounded-2xl hover:bg-iesu-darkRed transition-all shadow-md text-lg">
                        <Send size={22} /> Hemen Yayınla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'survey' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
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
            </div>
          )}

          {activeTab === 'news_events' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
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
                      </label>
                    </div>
                    
                    <input type="text" value={neTitle} onChange={e => setNeTitle(e.target.value)} placeholder="Başlık Giriniz" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm" required />
                    <input type="date" value={neDate} onChange={e => setNeDate(e.target.value)} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl text-gray-600 shadow-sm" required />
                    <textarea value={neDesc} onChange={e => setNeDesc(e.target.value)} placeholder="İçerik Detayları..." rows="4" className="w-full p-5 bg-white border border-gray-300 rounded-2xl resize-none shadow-sm" required></textarea>
                    
                    <button type="submit" className="bg-gray-800 text-white font-bold px-6 py-4 rounded-2xl hover:bg-gray-900 transition shadow-md w-full text-lg">
                      İçeriği Vitrine Ekle
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sem' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-900">SEM Kursu Tanımla</h3>
                  <p className="text-gray-500 mt-2">Sürekli Eğitim Merkezi (SEM) portalında yayınlanmak üzere yeni sertifika kursları ekleyin.</p>
                </div>
                <div className="p-8">
                  <form onSubmit={handleSemSubmit} className="space-y-6">
                    <input type="text" value={semTitle} onChange={e => setSemTitle(e.target.value)} placeholder="Eğitim veya Kurs Başlığı" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm" required />
                    <textarea value={semDesc} onChange={e => setSemDesc(e.target.value)} placeholder="Kurs Müfredatı ve Detaylar..." rows="4" className="w-full p-5 bg-white border border-gray-300 rounded-2xl resize-none shadow-sm" required></textarea>
                    
                    <button type="submit" className="bg-iesu-coral text-white font-bold px-6 py-4 rounded-2xl hover:bg-red-600 transition shadow-md w-full text-lg">
                      Kursu Oluştur
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'student_pool' && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Öğrenci Data Havuzu</h3>
                    <p className="text-gray-500 mt-1">Yalnızca "Aktif Öğrenci" statüsündeki kayıtlar.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-xl font-bold hover:bg-green-200 transition border border-green-200 shadow-sm">
                    <FileSpreadsheet size={18} /> Excel'e Aktar
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider">Ad Soyad</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Öğrenci No / T.C.</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Bölüm & Sınıf</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Kayıt Yılı</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">Ahmet Yılmaz</td>
                        <td className="p-5 text-gray-500 font-mono">1904050123</td>
                        <td className="p-5 text-gray-700">Yazılım Mühendisliği - 3. Sınıf</td>
                        <td className="p-5 text-gray-500">2021</td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">Zeynep Kaya</td>
                        <td className="p-5 text-gray-500 font-mono">2104010567</td>
                        <td className="p-5 text-gray-700">Psikoloji - 2. Sınıf</td>
                        <td className="p-5 text-gray-500">2023</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">Caner Çelik</td>
                        <td className="p-5 text-gray-500 font-mono">2005080999</td>
                        <td className="p-5 text-gray-700">İç Mimarlık - 4. Sınıf</td>
                        <td className="p-5 text-gray-500">2022</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alumni_pool' && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Mezun Data Havuzu</h3>
                    <p className="text-gray-500 mt-1">İESÜ Mezunlarının kayıtları ve güncel istihdam durumları.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-2.5 rounded-xl font-bold hover:bg-green-200 transition border border-green-200 shadow-sm">
                    <FileSpreadsheet size={18} /> Excel'e Aktar
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white text-gray-500 text-sm border-b border-gray-200">
                        <th className="p-5 font-bold uppercase tracking-wider">Ad Soyad</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Mezuniyet (Bölüm/Yıl)</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Çalıştığı Kurum</th>
                        <th className="p-5 font-bold uppercase tracking-wider">Pozisyon</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">Ayşe Demir</td>
                        <td className="p-5 text-gray-600">İşletme - 2022</td>
                        <td className="p-5 text-blue-600 font-bold">TechGlobal A.Ş.</td>
                        <td className="p-5 text-gray-700">İnsan Kaynakları Uzmanı</td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">Burak Tekin</td>
                        <td className="p-5 text-gray-600">Bilgisayar Müh. - 2021</td>
                        <td className="p-5 text-blue-600 font-bold">Google Turkey</td>
                        <td className="p-5 text-gray-700">Kıdemli Frontend Geliştirici</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-bold text-gray-900">Merve Aydın</td>
                        <td className="p-5 text-gray-600">Lojistik - 2023</td>
                        <td className="p-5 text-gray-400 italic">İş Arıyor</td>
                        <td className="p-5 text-gray-400">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-2xl font-bold text-gray-900">Bekleyen Firma Kayıtları</h3>
                  <p className="text-gray-500 mt-2">İşveren havuzuna katılmak için kayıt formu dolduran şirketleri inceleyin ve yetkilendirin.</p>
                </div>
                <div className="p-8 space-y-4">
                  {/* Mock Company Request */}
                  <div className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition">
                    <div className="flex gap-5 items-center w-full md:w-auto mb-4 md:mb-0">
                      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-gray-400 shrink-0">
                        <Building2 size={28} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">Getir Perakende Lojistik A.Ş.</h4>
                        <p className="text-sm text-gray-500 mt-1">Vergi No: 1234567890 • İK: Ayşe Yılmaz</p>
                        <p className="text-sm text-blue-600 mt-0.5">ayse.yilmaz@getir.com</p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 px-5 py-3 rounded-xl font-bold text-sm transition border border-green-200">
                        <CheckCircle size={18} /> Onayla
                      </button>
                      <button className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-5 py-3 rounded-xl font-bold text-sm transition border border-red-200">
                        <XCircle size={18} /> Reddet
                      </button>
                    </div>
                  </div>
                </div>
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
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 font-bold group border ${
        active 
          ? 'bg-iesu-red text-white border-iesu-red shadow-md' 
          : 'bg-transparent text-gray-600 hover:text-iesu-red hover:bg-red-50 border-transparent hover:border-red-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-white' : 'text-gray-400 group-hover:text-iesu-red'}`}>{icon}</span>
        {label}
      </div>
      {pendingCount > 0 && (
        <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
          {pendingCount}
        </span>
      )}
      {badge > 0 && (
        <span className="bg-gray-200 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-full">
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
    </div>
  );
}