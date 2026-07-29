import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Trophy, Zap, Star, Search, Plus, Bell, ChevronRight, 
  Map, Activity, Heart, MessageCircle, Share2, Play, Building2,
  Calendar, CheckCircle2, Award, Briefcase, Sparkles, Navigation,
  Globe, Radio, Mic, Headset, UserCircle2, X, Send, Crown, FileText,
  Bookmark, ExternalLink, ShieldCheck, ArrowRight, Compass
} from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SubPanelFooter from './SubPanelFooter';
import useAppStore from '../store/useAppStore';

export default function BirlikAgiPortal({ currentUser, setView, previousView, setSelectedGroupId, setSelectedUserId, userRole, academicRole }) {
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const alumniAssocBoard = useAppStore(state => state.alumniAssocBoard) || [];
  const alumniAssocApplications = useAppStore(state => state.alumniAssocApplications) || [];
  const featureAlumniAssocToggle = useAppStore(state => state.featureAlumniAssocToggle);
  const notifications = useAppStore(state => state.notifications) || [];
  const [activeTab, setActiveTab] = useState('feed'); // feed, network, events, board, apply
  const [searchQuery, setSearchQuery] = useState('');
  
  // Application Form State
  const [appForm, setAppForm] = useState({
    name: currentUser?.name || '',
    type: 'Asıl Üyelik',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    graduationYear: '2024',
    email: currentUser?.email || '',
    phone: '',
    note: ''
  });

  const [activeModal, setActiveModal] = useState(null); // story, postDetail
  const [selectedStory, setSelectedStory] = useState(null);

  // Mezun Derneği Resmî Hikâyeleri (Stories) - Google Stitch Style
  const assocStories = [
    { id: 1, name: 'Mezunlar Derneği', logo: '/iesu-logo.svg', tag: 'Resmî', hasUnseen: true, image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', caption: '2026 Mezunlar Buluşması ve Gala Yemeği detayları açıklandı!' },
    { id: 2, name: 'Kariyer Mentorluğu', logo: 'https://ui-avatars.com/api/?name=KM&background=990000&color=fff', tag: 'Program', hasUnseen: true, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', caption: 'Yeni dönem Mezun-Öğrenci Akran Mentorluğu eşleşmeleri başladı.' },
    { id: 3, name: 'Yurt Dışı Mezunlar', logo: 'https://ui-avatars.com/api/?name=YD&background=0A2342&color=fff', tag: 'Global', hasUnseen: false, image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80', caption: 'Avrupa ve Amerika komitelerimizle küresel ağımızı büyütüyoruz.' },
    { id: 4, name: 'Dernek Burs Fonu', logo: 'https://ui-avatars.com/api/?name=BF&background=059669&color=fff', tag: 'Sosyal', hasUnseen: false, image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80', caption: 'Başarılı öğrencilerimize sunduğumuz Dernek Burs Komisyonu başvuruları açıldı.' },
  ];

  // Mezun Derneği Resmî Akış Paylaşımları
  const assocPosts = useMemo(() => {
    return (posts || []).filter(p => p.category === 'Mezun Derneği' || p.author?.id === 'mezun_dernegi' || p.title?.includes('MEZUN DERNEĞİ'));
  }, [posts]);

  const defaultAssocFeed = [
    {
      id: 'assoc-feed-1',
      title: 'İESÜ Mezunlar Derneği 2026 Büyük Bahar Buluşması ve Kariyer Zirvesi',
      author: { name: 'İESÜ Mezunlar Derneği', role: 'Resmî Dernek Yönetimi', avatar: '/iesu-logo.svg' },
      date: 'Bugün, 14:30',
      content: 'Değerli Mezunlarımız ve Öğrencilerimiz! 🎓 2026 yılı geleneksel mezunlar buluşmamızı bu yıl dev bir Kariyer Zirvesi ile taçlandırıyoruz. Sektör lideri mezunlarımız deneyimlerini paylaşacak, yeni üyelikler kabul edilecek.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      likes: 184,
      comments: 32,
      category: 'Mezun Derneği'
    },
    {
      id: 'assoc-feed-2',
      title: 'Küresel Mezun Ağı & Profesyonel İş Birliği Portalı Hizmette!',
      author: { name: 'Mezun Derneği Yönetim Kurulu', role: 'Resmî Dernek Yöneticisi', avatar: 'https://ui-avatars.com/api/?name=Mezun+Dernegi&background=990000&color=fff' },
      date: 'Dün, 09:15',
      content: 'Dünyanın 40’tan fazla ülkesinde görev yapan İESÜ mezunlarını tek bir çatı altında birleştiriyoruz. Dernek üyelerimiz özel mentorluk verebilir ve dernek içi iş ilanları yayınlayabilir.',
      imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
      likes: 129,
      comments: 18,
      category: 'Mezun Derneği'
    }
  ];

  const displayPosts = assocPosts.length > 0 ? assocPosts : defaultAssocFeed;

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const setAlumniAssocApplications = useAppStore.getState().setAlumniAssocApplications;
    const currentApps = useAppStore.getState().alumniAssocApplications || [];
    
    const newApp = {
      id: `APP-${Date.now()}`,
      name: appForm.name,
      type: appForm.type,
      department: appForm.department,
      graduationYear: appForm.graduationYear,
      email: appForm.email,
      phone: appForm.phone,
      appliedAt: new Date().toLocaleDateString('tr-TR'),
      status: 'Beklemede'
    };

    setAlumniAssocApplications([newApp, ...currentApps]);
    alert('Tebrikler! Mezun Derneği başvurunuz başarıyla alınmıştır. Yönetim kurulumuz inceledikten sonra tarafınıza dönüş yapacaktır.');
    setAppForm({ ...appForm, phone: '', note: '' });
    setActiveTab('feed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* FULL STANDARD WHITE NAVBAR MATCHING ALUMNI FEED */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
            const currentRole = currentUser?.role || userRole;
            setView(currentRole === 'admin' ? 'admin' : (currentRole === 'employer' || currentRole === 'company') ? 'company' : currentRole === 'alumni' ? 'alumni' : currentRole === 'academic' ? 'academic' : 'student');
          }}>
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="hidden sm:block text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Portalı & Mezun Akışı</p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Öğrenci, firma, mezun veya içerik ara..." 
                className="w-full bg-[#EEF3F8] text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-red-500 focus:bg-white focus:outline-none block pl-10 p-2 transition-all"
              />
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
            <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} academicRole={academicRole} />
          </div>
        </div>
      </nav>

      <div className="pt-20"></div>

      <main className="flex-1 w-full max-w-[1300px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ULTRA-PREMIUM GOOGLE STITCH HERO BANNER */}
        <div className="bg-gradient-to-r from-slate-950 via-[#800000] to-red-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-red-900/40 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4 z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/40 flex items-center gap-1.5">
                <Crown size={12} className="text-amber-400" /> İESÜ MEZUNLAR DERNEĞİ RESMÎ PORTALI
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                Resmî Kuruluş
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Geleceği Birlikte İnşa Eden Büyük İESÜ Mezun Ailesi
            </h1>
            <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              İstanbul Esenyurt Üniversitesi Mezunlar Derneği; 77.000+ mezunumuz ile öğrencilerimiz arasında yaşam boyu köprü kurar, kariyer fıkirlerini destekler ve dayanışmayı büyütür.
            </p>
          </div>

          {(userRole === 'admin' || (alumniAssocBoard || []).some(m => m.email === currentUser?.email)) && (
            <div className="z-10 flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={() => setView('alumni_assoc_portal')}
                className="px-6 py-3.5 bg-white/10 backdrop-blur-md text-white font-bold text-xs rounded-2xl border border-white/20 hover:bg-white/20 transition text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} className="text-amber-400" /> Özel Yönetici Portalı →
              </button>
            </div>
          )}
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'feed', label: 'Dernek Akışı & Duyurular', icon: <FileText size={16} /> },
            { id: 'network', label: 'Küresel Mezun Ağı & Komiteler', icon: <Globe size={16} /> },
            { id: 'events', label: 'Dernek Etkinlikleri', icon: <Calendar size={16} /> },
            { id: 'board', label: 'Yönetim Kurulu & Tüzük', icon: <Users size={16} /> },
            { id: 'apply', label: 'Üyelik & Ekip Başvuru Formu', icon: <Award size={16} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition whitespace-nowrap ${
                activeTab === t.id 
                  ? 'bg-gradient-to-r from-[#990000] to-[#800000] text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DERNEK AKIŞI & PAYLAŞIMLAR */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {displayPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.author?.avatar || '/iesu-logo.svg'} alt={post.author?.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 bg-slate-900" />
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{post.author?.name || 'Mezun Derneği'}</h4>
                        <span className="text-[10px] font-bold text-[#990000] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          {post.author?.role || 'Resmî Duyuru'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">{post.date || 'Bugün'}</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-black text-slate-900">{post.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {post.content}
                    </p>
                    {post.imageUrl && (
                      <div className="rounded-2xl overflow-hidden max-h-96 border border-slate-100">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[#990000]"><Heart size={16} /> {post.likes || 140} Beğeni</span>
                      <span className="flex items-center gap-1.5"><MessageCircle size={16} /> {post.comments || 22} Yorum</span>
                    </div>
                    <button onClick={() => alert('Paylaşım bağlantısı kopyalandı!')} className="flex items-center gap-1 hover:text-[#990000]">
                      <Share2 size={16} /> Paylaş
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SAĞ YAN PANEL: DERNEK ÖZETİ & DUYURU paneli */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-red-950 text-white p-6 rounded-3xl border border-red-900/50 shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 className="font-black text-base">Dernek Hakkında Özet</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  İstanbul Esenyurt Üniversitesi Mezunlar Derneği, tüm mezunlarımızın haklarını gözeten, kariyer imkânları oluşturan ve sosyal dayanışmayı yüksek tutan resmi kurumsal yapıdır.
                </p>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-2 text-xs font-semibold">
                  <div className="flex justify-between"><span>Kayıtlı Üye Sayısı:</span> <strong className="text-amber-300">12.450+</strong></div>
                  <div className="flex justify-between"><span>Düzenlenen Etkinlik:</span> <strong className="text-emerald-300">140+</strong></div>
                  <div className="flex justify-between"><span>Dağıtılan Burs/Destek:</span> <strong className="text-cyan-300">₺450.000+</strong></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Bell size={16} className="text-[#990000]" /> Dernek İletişim Kanalları
                </h3>
                <div className="space-y-3 text-xs font-semibold text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900">E-posta</strong>
                    <span>mezundernegi@esenyurt.edu.tr</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <strong className="block text-slate-900">Ofis Adresi</strong>
                    <span>İESÜ Rektörlük Binası, Zemin Kat Mezun Derneği Odası</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KÜRESEL MEZUN AĞI & KOMİTELER */}
        {activeTab === 'network' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Sektörel Komiteler ve Küresel Ağlarımız</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Mesleğinize ve ilginize uygun mezun komitelerine katılarak sektör içi iş birliğinizi artırabilirsiniz.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Yazılım ve Teknoloji Komitesi', count: '1.850 Mezun', desc: 'Silikon Vadisi, Avrupa ve Türkiye teknoloji ekosistemindeki mezun yazılımcılar ağı.' },
                { title: 'Sağlık Bilimleri ve Hastaneler Ağı', count: '2.400 Mezun', desc: 'Tıp, fizyoterapi ve hemşirelik mezunlarımızın profesyonel deneyim paylaşım kulübü.' },
                { title: 'Uluslararası Ticaret & Lojistik Komitesi', count: '1.200 Mezun', desc: 'İthalat, ihracat ve global tedarik zincirinde görev yapan mezunlar dayanışması.' },
                { title: 'Sosyal Bilimler ve Hukuk Platformu', count: '980 Mezun', desc: 'Hukukçular, psikologlar ve kamu yönetimi mezunları akademisi.' },
                { title: 'Girişimcilik ve Yatırımcı Meclisi', count: '650 Mezun', desc: 'Kendi şirketini kuran girişimci mezunlar ve melek yatırımcılar fonu.' },
                { title: 'Avrupa ve Almanya Bölge Komitesi', count: '410 Mezun', desc: 'Avrupa ülkelerinde çalışan mezunlarımızın sosyal ve akademik yardımlaşma ağı.' },
              ].map((kom, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 hover:border-red-200 hover:shadow-md transition">
                  <span className="text-[10px] font-black text-[#990000] bg-red-100 px-2.5 py-1 rounded-md">{kom.count}</span>
                  <h4 className="text-base font-black text-slate-900">{kom.title}</h4>
                  <p className="text-xs font-medium text-slate-600 leading-relaxed">{kom.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DERNEK ETKİNLİKLERİ */}
        {activeTab === 'events' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Geleneksel Dernek Etkinlikleri Takvimi</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Mezunlar Derneğimizin organize ettiği gala yemekleri, kariyer konferansları ve network kahvaltıları.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: '2026 Olağan Mezunlar Genel Kurul Toplantısı', date: '18 Mayıs 2026', loc: 'Prof. Dr. Fuat Sezgin Konferans Salonu', desc: 'Yeni dönem dernek organlarının seçimi ve yıllık faaliyet raporlarının sunumu.' },
                { title: 'Sektör Liderleri ile Mezun-Öğrenci Buluşması', date: '02 Haziran 2026', loc: 'İESÜ Kampüs Kuluçka Merkezi', desc: 'CEO ve direktör pozisyonundaki mezunlarımızla birebir kariyer sohbetleri.' },
              ].map((ev, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-4">
                  <div className="p-4 bg-red-100 text-[#990000] rounded-2xl text-center flex-shrink-0 font-black">
                    <Calendar size={24} className="mx-auto mb-1" />
                    <span className="text-[10px] block">ETKİNLİK</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">{ev.date} — {ev.loc}</span>
                    <h4 className="text-base font-black text-slate-900">{ev.title}</h4>
                    <p className="text-xs font-medium text-slate-600">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: YÖNETİM KURULU */}
        {activeTab === 'board' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Dernek Yönetim Kurulu ve Tüzük</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                İstanbul Esenyurt Üniversitesi Mezunlar Derneği resmî idari organları.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(alumniAssocBoard || []).map((m) => (
                <div key={m.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#990000] to-red-900 text-white font-black flex items-center justify-center text-lg shadow">
                    {m.name?.substring(0, 2)?.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-[#990000] uppercase bg-red-100 px-2 py-0.5 rounded-md">{m.role}</span>
                    <h4 className="text-base font-black text-slate-900 mt-1">{m.name}</h4>
                    <p className="text-xs font-medium text-slate-500">{m.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ÜYELİK & EKİP BAŞVURU FORMU */}
        {activeTab === 'apply' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
            {featureAlumniAssocToggle === false ? (
              <div className="text-center py-12 bg-amber-50 rounded-2xl border border-amber-200 space-y-3">
                <ShieldCheck size={48} className="mx-auto text-amber-600" />
                <h3 className="text-xl font-black text-slate-900">Dernek Başvuru Dönemi Şu An Kapalıdır</h3>
                <p className="text-xs font-medium text-slate-600 max-w-md mx-auto">
                  Mezun Derneği üyelik ve yönetim ekibi başvuruları belirli dönemlerde açılmaktadır. Lütfen yeni duyuruları takip ediniz.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Mezun Derneği Üyelik & Ekip Başvuru Formu</h3>
                  <p className="text-xs font-medium text-slate-500">
                    Aşağıdaki formu doldurarak resmi dernek üyeliğinizi başlatabilir veya dernek yönetim organlarında görev alma talebinizi iletebilirsiniz.
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Ad Soyad</label>
                      <input 
                        type="text" 
                        required
                        value={appForm.name} 
                        onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Başvuru Türü</label>
                      <select 
                        value={appForm.type}
                        onChange={(e) => setAppForm({ ...appForm, type: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                      >
                        <option value="Asıl Üyelik">Asıl Dernek Üyeliği</option>
                        <option value="Yönetim Ekibi Adaylığı">Yönetim Ekibi & Komite Adaylığı</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mezun Olunan / Okunan Bölüm</label>
                      <input 
                        type="text" 
                        required
                        value={appForm.department} 
                        onChange={(e) => setAppForm({ ...appForm, department: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mezuniyet Yılı</label>
                      <input 
                        type="text" 
                        required
                        value={appForm.graduationYear} 
                        onChange={(e) => setAppForm({ ...appForm, graduationYear: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">E-posta</label>
                      <input 
                        type="email" 
                        required
                        value={appForm.email} 
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Telefon No</label>
                      <input 
                        type="tel" 
                        required
                        value={appForm.phone} 
                        placeholder="0532 000 0000"
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Başvuru Notu / Ekstra Mesajınız</label>
                    <textarea 
                      rows={4}
                      value={appForm.note}
                      onChange={(e) => setAppForm({ ...appForm, note: e.target.value })}
                      placeholder="Dernek bünyesinde üstlenmek istediğiniz görevler veya uzmanlık alanlarınız..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#990000] to-red-900 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Başvurumu Gönder ve Kaydet
                  </button>
                </form>
              </>
            )}
          </div>
        )}

      </main>

      {/* STORY FULLSCREEN MODAL */}
      {activeModal === 'story' && selectedStory && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-md w-full overflow-hidden relative shadow-2xl border border-slate-800">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-full z-10"
            >
              <X size={20} />
            </button>
            <div className="p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 inset-x-0 flex items-center gap-3 z-10">
              <img src={selectedStory.logo} alt="" className="w-10 h-10 rounded-full border border-amber-400" />
              <div>
                <h4 className="text-xs font-black">{selectedStory.name}</h4>
                <span className="text-[10px] text-amber-300 font-bold">{selectedStory.tag} Hikâyesi</span>
              </div>
            </div>
            <img src={selectedStory.image} alt="" className="w-full h-[450px] object-cover" />
            <div className="p-6 bg-slate-900 space-y-3">
              <p className="text-xs font-medium text-slate-200 leading-relaxed">{selectedStory.caption}</p>
              <button 
                onClick={() => { setActiveModal(null); setActiveTab('apply'); }}
                className="w-full py-3 bg-[#990000] text-white font-bold text-xs rounded-xl"
              >
                Başvuru Formuna Git
              </button>
            </div>
          </div>
        </div>
      )}

      <SubPanelFooter setView={setView} />
    </div>
  );
}
