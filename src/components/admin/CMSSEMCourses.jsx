import React, { useState } from 'react';
import { BookOpen, Users, BarChart3, Download, Plus, CheckCircle, Search, Eye, Trash2, ImagePlus, ChevronDown, ChevronUp, FileText, AlertCircle } from 'lucide-react';
import PostCard from '../PostCard';

const REAL_SEM_COURSES = [
  {
    id: 'SEM-REAL-1',
    title: 'Doğalgaz Yakıtlı Kalorifer Ateşçisi',
    content: 'Doğalgaz Yakıtlı Kalorifer Ateşçisi eğitimi, ısıtma sistemlerinin güvenli ve verimli şekilde işletilmesini amaçlayan uygulamaya dönük bir programdır.',
    imageUrl: 'https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863174303737663.jpeg',
    status: 'Yayında',
    enrolled: 45,
    applicants: 120
  },
  {
    id: 'SEM-REAL-2',
    title: 'Hijyen ve Sanitasyon',
    content: 'Hijyen ve Sanitasyon eğitimi, sağlıklı yaşamın ve güvenli çalışma ortamlarının temelini oluşturur. Kişisel hijyen, ortam temizliği ve bulaşıcı hastalıkların önlenmesine dair uygulamalar.',
    imageUrl: 'https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863169639302748.jpeg',
    status: 'Yayında',
    enrolled: 210,
    applicants: 350
  },
  {
    id: 'SEM-REAL-3',
    title: 'Bina ve Site Yöneticiliği',
    content: 'Bina ve Site Yöneticiliği eğitimi, toplu yaşam alanlarının düzenli, güvenli ve verimli şekilde yönetilmesini hedefler.',
    imageUrl: 'https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863175713016420.jpeg',
    status: 'Kapalı',
    enrolled: 30,
    applicants: 45
  },
  {
    id: 'SEM-REAL-4',
    title: 'Temel İlk Yardım Bilgilendirme',
    content: 'Temel İlk Yardım Bilgilendirme Semineri (Uzaktan Eğitim – Eş Zamansız), acil durumlarda doğru ve bilinçli müdahalenin önemini kazandırmayı amaçlar.',
    imageUrl: 'https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1863354459156114.jpeg',
    status: 'Yayında',
    enrolled: 510,
    applicants: 800
  },
  {
    id: 'SEM-REAL-5',
    title: 'Temel Aşçılık Eğitimi Kurs Programı',
    content: 'Temel Aşçılık Eğitimi Kurs Programı, mutfak dünyasına sağlam ve bilinçli bir başlangıç yapmayı hedefler. Katılımcılar; temel pişirme teknikleri öğrenir.',
    imageUrl: 'https://w3-s3-bucket.s3.us-east-1.amazonaws.com/SaaS/semonline/uploaded-files/1862985592663741.jpeg',
    status: 'Yayında',
    enrolled: 20,
    applicants: 60
  }
];

export default function CMSSEMCourses({ semCourses = [], setSemCourses, posts = [], setPosts, students = [], alumni = [], currentUser }) {
  const [activeTab, setActiveTab] = useState('havuz'); // havuz, katilimci, anket, rapor
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedSurvey, setExpandedSurvey] = useState(false);
  
  // Expanded rows for Katılımcı Takibi
  const [expandedUser, setExpandedUser] = useState(null);

  // Havuz Form State
  const [form, setForm] = useState({
    title: '',
    content: '',
    contentType: 'Sertifika Programı', // Sertifika Programı, Eğitim, Seminer
    visibility: 'public',
    imageUrl: ''
  });

  // Anket Form State
  const [surveyForm, setSurveyForm] = useState({
    title: '',
    targetCourse: 'Tümü',
    questions: [
      'Eğitmen konuya hakimdi.',
      'Eğitim materyalleri yeterliydi.',
      'Süreç beklentilerimi karşıladı.',
      'Bu eğitimi başkalarına tavsiye ederim.',
      'Platform üzerinden eğitime erişim kolaydı.'
    ],
    kvkkConfirmed: false
  });

  // Combine real ones with state if empty
  const activeCourses = semCourses.length > 0 ? semCourses : REAL_SEM_COURSES;
  const filteredCourses = activeCourses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  // Get all users
  const allUsers = [...(students || []), ...(alumni || [])].filter(u => u.source !== 'demo_seed');

  // Add a fake SEM participation history to REAL users based on their ID for demo tracking
  // In a real app this would come from a database relation
  const getUserSemHistory = (userId) => {
    const numChar = userId.charCodeAt(userId.length - 1);
    if (numChar % 3 === 0) return []; // Some have none
    
    return activeCourses.slice(0, (numChar % 3) + 1).map((c, i) => ({
      courseId: c.id,
      courseTitle: c.title,
      status: i === 0 ? 'Tamamlandı' : 'Devam Ediyor',
      enrollDate: '12.05.2026'
    }));
  };

  const usersWithHistory = allUsers.map(u => {
    const history = getUserSemHistory(u.id);
    return {
      ...u,
      semHistory: history,
      totalEnrolled: history.length,
      totalCompleted: history.filter(h => h.status === 'Tamamlandı').length
    };
  }).filter(u => u.totalEnrolled > 0); // Only show users who enrolled in at least 1 SEM course

  const handleAddCoursePost = (e) => {
    e.preventDefault();
    const newId = `SEM-${Date.now()}`;
    
    // 1. Add to semCourses
    const newCourse = {
      id: newId,
      title: form.title,
      content: form.content,
      imageUrl: form.imageUrl,
      status: 'Yayında',
      enrolled: 0,
      applicants: 0
    };
    if (setSemCourses) setSemCourses([newCourse, ...activeCourses]);

    // 2. Add to global posts (Social Feed)
    const newPost = {
      id: `POST-${newId}`,
      author: {
        id: 'sem',
        name: 'Sürekli Eğitim Merkezi',
        avatar: 'https://ui-avatars.com/api/?name=SEM&background=1e3a8a&color=fff',
        title: 'Kariyer Merkezi'
      },
      title: form.title,
      content: form.content,
      contentType: form.contentType,
      image: form.imageUrl,
      date: new Date().toLocaleDateString('tr-TR'),
      likes: 0,
      comments: 0,
      status: 'Yayında',
      source: 'sem'
    };
    if (setPosts) setPosts([newPost, ...posts]);
    
    setForm({ title: '', content: '', contentType: 'Sertifika Programı', visibility: 'public', imageUrl: '' });
    setShowForm(false);
    alert('SEM Programı başarıyla oluşturuldu ve sosyal akışta paylaşıldı!');
  };

  const exportToExcel = (tableId) => {
    let csv = [];
    if (tableId === 'havuz') {
      csv.push(['Program Adı', 'Başvuran', 'Kayıtlı', 'Durum'].join(','));
      activeCourses.forEach(c => csv.push([`"${c.title}"`, c.applicants, c.enrolled, c.status].join(',')));
    } else if (tableId === 'katilimci') {
      csv.push(['Kullanıcı Adı', 'Kullanıcı Rolü', 'Kayıtlı Program Sayısı', 'Tamamlanan Program Sayısı'].join(','));
      usersWithHistory.forEach(u => csv.push([`"${u.name}"`, u.role, u.totalEnrolled, u.totalCompleted].join(',')));
    } else if (tableId === 'anket' || tableId === 'anket_sonuclar') {
      // SPSS için sadeleştirilmiş dışa aktarım (Katılımcı ID ve Tarih olmadan sadece sorular)
      const headers = [...surveyForm.questions.map((q, i) => `S${i+1}: ${q}`)];
      if (surveyForm.kvkkConfirmed) headers.push('KVKK Onaylı');
      csv.push(headers.map(h => `"${h}"`).join(','));
      // Veri olmadığı için boş bırakıyoruz, sadece kolon başlıkları iniyor.
    }
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SEM_Raporu_${tableId}_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* TEPE ANALİTİK ALANI */}
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl text-white mb-8 group">
        {/* Zengin Arkaplan Tasarımı */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-900"></div>
        
        {/* Hareketli Işık / Glow Efektleri */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
        
        {/* İçerik Container'ı (z-index ile öne alma) */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <BookOpen size={28} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">SEM Kontrol Merkezi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-black">Pro</span></h2>
              <p className="text-blue-200 text-sm font-medium opacity-90">Sürekli Eğitim Merkezi gelişmiş operasyon ve analitik yönetim portalı.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">
            {/* Kart 1 */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-default shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"><BookOpen size={22} className="text-white"/></div>
                <div><p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Aktif Program</p><p className="text-2xl font-black drop-shadow-sm">{activeCourses.length}</p></div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-400 h-full w-3/4 rounded-full"></div></div>
            </div>
            {/* Kart 2 */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-default shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"><Users size={22} className="text-white"/></div>
                <div><p className="text-xs font-bold text-purple-200 uppercase tracking-wider">Toplam Başvuru</p><p className="text-2xl font-black drop-shadow-sm">{activeCourses.reduce((a,b)=>a+b.applicants,0)}</p></div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-400 h-full w-full rounded-full"></div></div>
            </div>
            {/* Kart 3 */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-default shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"><CheckCircle size={22} className="text-white"/></div>
                <div><p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Kesin Kayıt</p><p className="text-2xl font-black drop-shadow-sm">{activeCourses.reduce((a,b)=>a+b.enrolled,0)}</p></div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-400 h-full w-2/3 rounded-full"></div></div>
            </div>
            {/* Kart 4 */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-default shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30"><BarChart3 size={22} className="text-white"/></div>
                <div><p className="text-xs font-bold text-amber-200 uppercase tracking-wider">Anket Puanı</p><p className="text-2xl font-black drop-shadow-sm">4.8 <span className="text-sm font-bold text-amber-100">/ 5</span></p></div>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-400 h-full w-[96%] rounded-full"></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* SEKMELER */}
      <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 gap-2 overflow-x-auto">
        {[
          { id: 'havuz', label: 'Program Havuzu & Akış', icon: BookOpen },
          { id: 'katilimci', label: 'Katılımcı Takibi', icon: Users },
          { id: 'anket', label: 'Likert Anketleri', icon: FileText },
          { id: 'rapor', label: 'Raporlama', icon: BarChart3 }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PROGRAM HAVUZU */}
      {activeTab === 'havuz' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">SEM Eğitim Havuzu</h3>
            <div className="flex gap-2">
              <button onClick={() => exportToExcel('havuz')} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-bold transition">
                <Download size={16} /> Excel'e Aktar
              </button>
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                {showForm ? <Trash2 size={16}/> : <Plus size={16} />} {showForm ? 'İptal Et' : 'Yeni Program / Duyuru Ekle'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-[0_8px_30px_rgb(37,99,235,0.05)]">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* SOL: FORM */}
                <div className="lg:col-span-3 space-y-5">
                  <form id="sem-post-form" onSubmit={handleAddCoursePost} className="space-y-5">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Eğitim/Program Başlığı</label>
                      <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Örn: İleri Düzey Excel Eğitimi" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-900" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">İçerik Türü</label>
                        <select value={form.contentType} onChange={e => setForm({...form, contentType: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-gray-900">
                          <option value="Sertifika Programı">Sertifika Programı</option>
                          <option value="Eğitim">Eğitim</option>
                          <option value="Seminer">Seminer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Görünürlük</label>
                        <select value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium text-gray-900">
                          <option value="public">Herkes (Genel Akış)</option>
                          <option value="students">Sadece Öğrenciler</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Afiş/Görsel Yükle (Esenyurt SEM Sistemi İle Entegre)</label>
                      {!form.imageUrl ? (
                        <label className="w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-blue-300 transition-all group">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <ImagePlus size={24} className="text-gray-400 group-hover:text-blue-500" />
                          </div>
                          <span className="text-sm font-bold text-gray-700">Görsel seçmek için tıklayın</span>
                          <span className="text-xs font-medium text-gray-400 mt-1">Sistem gerçek afişleri işleyebilir</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setForm({...form, imageUrl: URL.createObjectURL(e.target.files[0])});
                            }
                          }} />
                        </label>
                      ) : (
                        <div className="relative w-full h-48 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden group">
                          <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button type="button" onClick={() => setForm({...form, imageUrl: ''})} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 hover:scale-110 transition-all flex items-center gap-2">
                              <Trash2 size={18} /> <span className="text-sm font-bold pr-2">Görseli Kaldır</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Program Detayı / Açıklama</label>
                      <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows="4" placeholder="Eğitim içeriğini ve şartlarını yazın..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none font-medium text-gray-900"></textarea>
                    </div>
                  </form>
                </div>

                {/* SAĞ: CANLI ÖN İZLEME */}
                <div className="lg:col-span-2">
                  <div className="sticky top-24">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Eye size={14} className="text-blue-500" /> Canlı Sosyal Akış Ön İzlemesi
                    </label>
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-dashed border-gray-200 pointer-events-none">
                      {(form.title || form.content || form.imageUrl) ? (
                        <PostCard 
                          post={{
                            id: 'preview',
                            author: {
                              name: 'Sürekli Eğitim Merkezi',
                              avatar: 'https://ui-avatars.com/api/?name=SEM&background=1e3a8a&color=fff',
                              title: 'Kariyer Merkezi',
                            },
                            title: form.title,
                            content: form.content,
                            contentType: form.contentType,
                            image: form.imageUrl,
                            date: 'Şimdi',
                            likes: 0,
                            comments: 0
                          }} 
                          currentUser={currentUser} 
                          setPosts={() => {}} 
                        />
                      ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400">
                          <Search size={24} className="text-gray-300 mb-2" />
                          <p className="text-xs font-bold">Ön izleme için içerik veya afiş girin</p>
                        </div>
                      )}
                    </div>
                    <button type="submit" form="sem-post-form" className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg transition-all flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Programı Kaydet & Akışta Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Programlarda ara..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-300 w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Afiş & Program Adı</th>
                    <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Başvuran</th>
                    <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Kayıtlı</th>
                    <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCourses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50/50 transition cursor-pointer">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-4">
                          <img src={course.imageUrl || 'https://via.placeholder.com/150'} alt={course.title} className="w-16 h-10 object-cover rounded shadow-sm" />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{course.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{course.content}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center font-bold text-gray-600">{course.applicants}</td>
                      <td className="py-4 px-5 text-center font-black text-blue-600">{course.enrolled}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${course.status === 'Yayında' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KATILIMCI TAKİBİ */}
      {activeTab === 'katilimci' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">Gerçek Kullanıcı Takip Sistemi</h3>
            <button onClick={() => exportToExcel('katilimci')} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-bold transition">
              <Download size={16} /> Listeyi İndir
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Kullanıcı Bilgisi</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Kayıtlı Olduğu Eğitimler</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tamamladığı</th>
                  <th className="py-3 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Detaylar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersWithHistory.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10 text-gray-400 font-bold">Hiçbir katılımcı bulunamadı.</td></tr>
                ) : usersWithHistory.map(user => (
                  <React.Fragment key={user.id}>
                    <tr 
                      onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                      className={`hover:bg-gray-50 transition cursor-pointer ${expandedUser === user.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                            <p className="text-[11px] font-bold text-gray-400 uppercase">{user.department || user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center font-black text-gray-700">{user.totalEnrolled}</td>
                      <td className="py-4 px-5 text-center font-black text-green-600">{user.totalCompleted}</td>
                      <td className="py-4 px-5 text-right">
                        <button className="p-2 rounded-full hover:bg-gray-200 transition text-gray-500">
                          {expandedUser === user.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                        </button>
                      </td>
                    </tr>
                    
                    {/* EXPANDED DETAY TABLOSU */}
                    {expandedUser === user.id && (
                      <tr className="bg-gray-50">
                        <td colSpan="4" className="p-0 border-t border-gray-200">
                          <div className="p-6">
                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">{user.name} - Aldığı SEM Programları</h4>
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                              <table className="w-full text-left">
                                <thead className="bg-gray-100 text-[11px] font-bold text-gray-500 uppercase">
                                  <tr>
                                    <th className="py-2 px-4">Program Adı</th>
                                    <th className="py-2 px-4">Kayıt Tarihi</th>
                                    <th className="py-2 px-4">Durum</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                  {user.semHistory.map((hist, idx) => (
                                    <tr key={idx}>
                                      <td className="py-3 px-4 font-semibold text-gray-900">{hist.courseTitle}</td>
                                      <td className="py-3 px-4 text-gray-500">{hist.enrollDate}</td>
                                      <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-[11px] font-bold ${hist.status === 'Tamamlandı' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                          {hist.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANKET */}
      {activeTab === 'anket' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900">Anketler</h3>
            <button onClick={() => exportToExcel('anket')} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-bold transition">
              <Download size={16} /> Excel İndir
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* SOL: FORM */}
              <div>
                <p className="text-sm font-bold text-gray-500 mb-6">Program katılımcıları için dinamik anketler oluşturun.</p>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 mb-6">
                  <AlertCircle size={20} className="text-amber-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm mb-1">KVKK Uyumluluğu</h4>
                    <p className="text-xs text-amber-700">Tüm anketlerde öğrencilerin açık rıza onayı zorunludur.</p>
                  </div>
                </div>

                <form className="space-y-5">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Anket Başlığı</label>
                    <input type="text" value={surveyForm.title} onChange={e => setSurveyForm({...surveyForm, title: e.target.value})} placeholder="Örn: Memnuniyet Anketi" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-medium" />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Anket Soruları (Likert Ölçeği)</label>
                      <button type="button" onClick={() => setSurveyForm({...surveyForm, questions: [...surveyForm.questions, 'Yeni Soru']})} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                        <Plus size={14} /> Soru Ekle
                      </button>
                    </div>

                    {surveyForm.questions.map((q, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0">S{i+1}</div>
                        <input type="text" value={q} onChange={(e) => {
                          const newQ = [...surveyForm.questions];
                          newQ[i] = e.target.value;
                          setSurveyForm({...surveyForm, questions: newQ});
                        }} className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 font-medium" />
                        <button type="button" onClick={() => {
                          const newQ = surveyForm.questions.filter((_, idx) => idx !== i);
                          setSurveyForm({...surveyForm, questions: newQ});
                        }} className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6 cursor-pointer hover:bg-gray-100 transition" onClick={() => setSurveyForm({...surveyForm, kvkkConfirmed: !surveyForm.kvkkConfirmed})}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${surveyForm.kvkkConfirmed ? 'bg-blue-600' : 'border-2 border-gray-300 bg-white'}`}>
                      {surveyForm.kvkkConfirmed && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold text-gray-700 select-none">Öğrenci anket öncesi KVKK onay metnini kabul etmek zorundadır.</span>
                  </div>

                  <button type="button" onClick={() => alert('Anket başarıyla oluşturuldu ve hedef kitleye atandı.')} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md transition-all">
                    Anketi Kaydet ve Aktifleştir
                  </button>
                </form>
              </div>

              {/* SAĞ: ÖN İZLEME */}
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-dashed border-gray-200 relative">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-6">
                  <Eye size={14} className="text-blue-500" /> Öğrenci Ekranı Ön İzlemesi
                </label>
                
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden pointer-events-none">
                  <div className="bg-blue-600 p-4 text-white">
                    <h4 className="font-black text-lg">{surveyForm.title || 'Anket Başlığı'}</h4>
                    <p className="text-blue-100 text-xs">Lütfen aşağıdaki ifadelere ne derece katıldığınızı belirtiniz.</p>
                  </div>
                  
                  <div className="p-5 space-y-6">
                    {surveyForm.questions.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4 font-bold">Henüz soru eklenmedi.</p>
                    ) : surveyForm.questions.map((q, i) => (
                      <div key={i} className="space-y-3">
                        <p className="text-sm font-bold text-gray-800">{i+1}. {q || 'Soru metni...'}</p>
                        <div className="flex justify-between items-center gap-1 text-[10px] font-bold text-gray-400 text-center">
                          <span>Kesinlikle Katılmıyorum</span>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <div key={rating} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">{rating}</div>
                            ))}
                          </div>
                          <span>Kesinlikle Katılıyorum</span>
                        </div>
                      </div>
                    ))}
                    
                    {surveyForm.kvkkConfirmed && (
                      <div className="mt-6 pt-6 border-t border-gray-100 flex items-start gap-3">
                        <div className="w-4 h-4 rounded border border-gray-300 shrink-0 mt-0.5"></div>
                        <p className="text-[10px] text-gray-500 font-medium">Bu ankete verdiğim yanıtların istatistiksel analiz amacıyla KVKK kapsamında işlenmesini onaylıyorum.</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl font-bold text-sm text-center">Gönder</div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* OLUŞTURULAN ANKETLER VE SONUÇ ANALİZİ (YÖK İÇİN) */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Oluşturulan Anketler ve Sonuç Analizi</h3>
                <p className="text-xs font-bold text-gray-500">YÖK akreditasyon süreçleri için katılımcı geri bildirim istatistikleri.</p>
              </div>
              <button onClick={() => exportToExcel('anket_sonuclar')} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition">
                <Download size={16} /> Excel Olarak İndir
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">Anket Başlığı</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider text-center border-b border-gray-100">Katılımcı Sayısı</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider text-center border-b border-gray-100">Ort. Memnuniyet</th>
                    <th className="py-4 px-6 text-xs font-black text-gray-400 uppercase tracking-wider text-right border-b border-gray-100">Rapor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  <tr 
                    className="hover:bg-blue-50/50 transition cursor-pointer group"
                    onClick={() => setExpandedSurvey(!expandedSurvey)}
                  >
                    <td className="py-5 px-6 font-bold text-gray-900 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-600 transition-transform duration-300" style={{ transform: expandedSurvey ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                          ▶
                        </span>
                        <p>{surveyForm.title || 'Yeni SEM Anketi'}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-bold ml-5">Taslak</span>
                    </td>
                    <td className="py-4 px-6 text-center font-black text-gray-700">0 Kişi</td>
                    <td className="py-4 px-6 text-center">
                      <span className="bg-gray-100 text-gray-500 font-black px-3 py-1 rounded-lg">- / 5</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Satırın açılmasını engelle
                          exportToExcel('anket_sonuclar');
                        }}
                        className="p-2 bg-gray-50 text-blue-600 hover:bg-blue-100 rounded-xl transition font-bold text-xs flex items-center justify-center gap-1 w-full"
                      >
                        <Download size={14}/> İndir
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Sorular */}
                  {expandedSurvey && (
                    <tr className="bg-slate-50/50 border-none">
                      <td colSpan="4" className="p-0">
                        <div className="px-12 py-6 border-l-2 border-blue-500 ml-4 mb-4 mt-2 bg-white rounded-r-xl shadow-sm">
                          <h4 className="text-xs font-black tracking-wider text-gray-400 mb-4 uppercase flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-500" />
                            Anket Soruları (SPSS Referansı)
                          </h4>
                          {surveyForm.questions.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Henüz soru eklenmedi.</p>
                          ) : (
                            <ul className="space-y-3">
                              {surveyForm.questions.map((q, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                  <span className="font-black text-blue-600 w-6">S{idx+1}.</span>
                                  <span className="text-gray-700 font-medium">{q}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RAPOR */}
      {activeTab === 'rapor' && (
        <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
          <BarChart3 size={64} className="text-gray-200 mb-4" />
          <h3 className="text-xl font-black text-gray-900">SEM İstatistik ve Rapor Merkezi</h3>
          <p className="text-gray-500 text-sm max-w-md text-center">Gelişmiş veri havuzu raporları hazırlanıyor. Ham datayı diğer sekmelerdeki "Excel İndir" butonlarıyla çekebilirsiniz.</p>
        </div>
      )}

    </div>
  );
}
