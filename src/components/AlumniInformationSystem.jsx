import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import ProfileUpdate from './ProfileUpdate';
import TopProfileMenu from './TopProfileMenu';
import { exportPDF } from '../lib/pdfExporter';
import {
  UserCircle2, Briefcase, FileText, LogOut, BookOpen, GraduationCap,
  Plus, Trash2, Globe2, Languages, Award, X, Building2, Save, RefreshCw,
  Phone, Mail, MapPin, User, Calendar, BadgeCheck, ArrowLeft,
  UploadCloud, ChevronRight, ChevronLeft, Star, Link, Compass, CreditCard, CheckCircle,
  Clock, AlertCircle, Download, ChevronDown, Users, Wand2, Sparkles, Eye, FileCheck, Check
} from 'lucide-react';

const LANGUAGE_LEVELS = ['Başlangıç (A1-A2)', 'Orta (B1-B2)', 'İleri (C1)', 'Anadil / Akıcı'];
const EXP_TYPES = ['Staj', 'Tam Zamanlı', 'Yarı Zamanlı', 'Gönüllü', 'Freelance'];

const TABS = [
  { id: 'ozluk',           label: '👤 Kişisel Bilgiler' },
  { id: 'akademik',        label: '🎓 Akademik Eğitim' },
  { id: 'staj',            label: '💼 Deneyim & Yetenek' },
  { id: 'sertifika',       label: '🏆 Sertifika & Hedefler' },
  { id: 'dil',             label: '🌍 Yabancı Dil' },
  { id: 'cv',              label: '📄 Akıllı CV' },
  { id: 'kariyer_checkup', label: '🧭 Kariyer Check-up' },
  { id: 'mezun_kart',      label: '💳 Mezun Kart' },
  { id: 'kulup_basvuru',   label: '👥 Kulüp Başvurusu' },
];

const CHECKUP_QUESTIONS = [
  { id: 1, text: "Yazılım geliştirme süreçlerinde hangi alanda çalışmayı tercih edersiniz?", options: ["Frontend Geliştirme", "Backend Servisleri", "Yapay Zeka & Veri Bilimi", "Sistem & DevOps"] },
  { id: 2, text: "Bir problemle karşılaştığınızda ilk olarak ne yaparsınız?", options: ["Dokümantasyon & StackOverflow okurum", "Kodu satır satır debug ederim", "AI asistanlardan yardım alırım", "Takım arkadaşlarıma danışırım"] },
  { id: 3, text: "Proje yönetiminde hangi metodolojiyi benimsersiniz?", options: ["Agile/Scrum", "Waterfall", "Kanban", "Kaotik/Serbest Stil"] },
  { id: 4, text: "Veritabanı teknolojileri konusundaki tecrübeniz nedir?", options: ["İleri düzey SQL & NoSQL", "Temel SQL sorguları", "ORM araçları kullanırım", "Henüz tecrübem yok"] },
  { id: 5, text: "İngilizce teknik doküman okuma ve yazma düzeyiniz nedir?", options: ["Çok rahat okur yazarım", "Sözlük desteğiyle okurum", "Sadece çeviri araçlarıyla", "Başlangıç seviyesinde"] },
  { id: 6, text: "Frontend geliştirme araçlarından (React, Vue vb.) hangisine hakimsiniz?", options: ["React.js", "Vue.js / Angular", "Vanilla JS / HTML / CSS", "Mobil (Flutter/React Native)"] },
  { id: 7, text: "Backend servisleri tasarlarken hangi dili tercih edersiniz?", options: ["Node.js / JavaScript", "Python / Django", "Go / Java / C#", "PHP / Ruby"] },
  { id: 8, text: "Yapay zeka (AI) ve makine öğrenimi modellerine ne kadar ilgilisiniz?", options: ["Aktif projeler geliştirdim", "Temel kütüphaneleri kullandım", "Sadece teorik bilgim var", "İlgim yok"] },
  { id: 9, text: "Bulut bilişim platformlarını (AWS, GCP, Azure) kullanma sıklığınız nedir?", options: ["Her projemde kullanırım", "Sadece basit sunucu dağıtımlarında", "Hiç kullanmadım", "Bulut servislerini araştırıyorum"] },
  { id: 10, text: "Takım çalışmasında kendinizi nasıl tanımlarsınız?", options: ["Lider ruhlu ve yönlendirici", "Verilen görevi kusursuz yapan", "Fikir üreten ve tartışan", "Bireysel çalışmayı tercih eden"] },
  { id: 11, text: "Kod kalitesi ve temiz kod (Clean Code) standartlarına ne kadar önem verirsiniz?", options: ["Her satırı özenle yazarım", "Çalışması yeterlidir", "Linter kurallarına uyarım", "Proje bitiminde optimize ederim"] },
  { id: 12, text: "Yeni bir teknolojiyi öğrenirken en çok hangi yöntemi kullanırsınız?", options: ["Uygulamalı küçük projeler yaparak", "Video eğitim setleri izleyerek", "Resmi dokümantasyon okuyarak", "Topluluk formlarını inceleyerek"] }
];

export default function AlumniInformationSystem({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('ozluk');
  const [cvTemplate, setCvTemplate] = useState('modern'); // 'modern' | 'academic' | 'creative'
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // Kariyer Checkup State (12 questions)
  const [checkupAnswers, setCheckupAnswers] = useState({});
  const [checkupStep, setCheckupStep] = useState(0);
  const [checkupCompleted, setCheckupCompleted] = useState(false);

  // Mezun Kart State
  const [cardAppStatus, setCardAppStatus] = useState('form'); // 'form' | 'loading' | 'minted'
  const [cardForm, setCardForm] = useState({
    name: currentUser?.name || '',
    dept: 'Yazılım Mühendisliği',
    gradYear: '2024',
    studentId: '200201090',
    agreed: false
  });

  // Survey state
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const filteredTabs = useMemo(() => {
    const list = [...TABS];
    if (userRole === 'alumni') {
      list.push({ id: 'anket', label: '📝 Memnuniyet & Anket' });
    }
    return list;
  }, [userRole]);
  
  // Local profile state
  const [profileData, setProfileData] = useState({
    summary: "Yazılım mühendisliği alanında kendimi geliştiren, yapay zeka ve web teknolojilerine ilgili bir geliştiriciyim.",
    phone: "+90 555 123 4567",
    website: "https://myportfolio.dev",
    linkedin: "https://linkedin.com/in/iesuli",
    github: "https://github.com/iesuli",
    education: [
      { id: 1, school: "İstanbul Esenyurt Üniversitesi", degree: "Lisans", major: "Yazılım Mühendisliği", startYear: "2020", endYear: "2024", gpa: "3.45" }
    ],
    experience: [
      { id: 1, company: "Trendyol", role: "Stajyer Yazılım Geliştirici", type: "Staj", startYear: "2023", endYear: "2023", desc: "React ve micro-frontend mimarileriyle çalışıldı." }
    ],
    skills: ["React", "JavaScript", "CSS", "Git", "Tailwind CSS"],
    languages: [
      { id: 1, language: "İngilizce", level: "İleri (C1)" }
    ],
    certs: [
      { id: 1, title: "Google Cloud Engineering Certificate", issuer: "Google", date: "2023" }
    ],
    goals: [
      { id: 1, text: "Yapay zeka alanında uluslararası bir sertifika almak.", done: true },
      { id: 2, text: "İngilizce teknik makale yayınlamak.", done: false },
      { id: 3, text: "Bir açık kaynak projeye katkıda bulunmak.", done: false }
    ],
    clubApplications: [
      { id: 1, name: "Yazılım ve Yapay Zeka Kulübü", status: "Onaylandı" }
    ]
  });

  // Checklist handler
  const toggleGoal = (id) => {
    setProfileData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, done: !g.done } : g)
    }));
  };

  // Add inputs helpers
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState({ name: '', level: 'Orta (B1-B2)' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '', date: '' });

  // Calculate profile completeness
  const completeness = useMemo(() => {
    let score = 20; // base score for registering
    if (profileData.summary.length > 20) score += 15;
    if (profileData.phone) score += 10;
    if (profileData.linkedin || profileData.github) score += 15;
    if (profileData.education.length > 0) score += 15;
    if (profileData.experience.length > 0) score += 15;
    if (profileData.skills.length > 2) score += 10;
    return Math.min(100, score);
  }, [profileData]);

  const handleAiEnhanceSummary = () => {
    setAiEnhancing(true);
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        summary: "Yazılım Mühendisliği son sınıf öğrencisi olarak modern web teknolojileri, yapay zeka entegrasyonları ve bulut bilişim alanlarında teorik altyapıyı pratik projelerle birleştiren hevesli bir mühendis adayıyım. Agile metodolojilerle çalışmaya yatkın, analitik düşünme yeteneğine sahip bir takım oyuncusuyum."
      }));
      setAiEnhancing(false);
      window.toast && window.toast.success("Özet metniniz AI tarafından optimize edildi!");
    }, 1500);
  };

  const handleCheckupAnswer = (opt) => {
    const qId = CHECKUP_QUESTIONS[checkupStep].id;
    setCheckupAnswers({ ...checkupAnswers, [qId]: opt });
    
    if (checkupStep < CHECKUP_QUESTIONS.length - 1) {
      setCheckupStep(checkupStep + 1);
    } else {
      setCheckupCompleted(true);
      window.toast && window.toast.success("🎉 Tebrikler! 12 soruluk kariyer check-up testi tamamlandı.");
    }
  };

  const handleCardApplication = (e) => {
    e.preventDefault();
    if (!cardForm.name || !cardForm.studentId || !cardForm.agreed) {
      window.toast && window.toast.error("Lütfen tüm alanları doldurun ve onay kutusunu işaretleyin.");
      return;
    }
    setCardAppStatus('loading');
    setTimeout(() => {
      setCardAppStatus('minted');
      window.toast && window.toast.success("💳 Mezun Kartınız başarıyla üretildi ve dijital cüzdana aktarıldı!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20 selection:bg-indigo-500/20">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight text-md sm:text-lg">Mezun Bilgi Sistemi (MBS)</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="max-w-[1300px] mx-auto p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Navigation & Profile completeness */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          
          {/* Profile Card & Progress */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <img src={currentUser?.avatar || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="w-14 h-14 rounded-2xl object-cover shadow-md" />
              <div>
                <h2 className="font-black text-slate-800 text-sm sm:text-base leading-tight">{currentUser?.name || 'Mezun Adı'}</h2>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase mt-1 inline-block">Mezun Üye</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black">
                <span className="text-slate-500">Profil Doluluk Oranı</span>
                <span className="text-indigo-600">%{completeness}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  className="bg-indigo-600 h-full rounded-full" 
                />
              </div>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed mt-1">
                Eksik alanları tamamlayarak İK yöneticilerinin aramalarında %40 daha fazla görünün.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm">
            <nav className="flex flex-col gap-1">
              {filteredTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="flex-grow bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-6"
            >
              {/* TAB 1: Özgeçmiş Özeti & Kişisel Bilgiler */}
              {activeTab === 'ozluk' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Kişisel Bilgiler</h3>
                    <button 
                      onClick={handleAiEnhanceSummary}
                      disabled={aiEnhancing}
                      className="text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 px-3 py-2 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {aiEnhancing ? 'Optimize Ediliyor...' : 'AI ile Özeti Düzenle'}
                      <Wand2 size={12} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-500 uppercase">Özet Bilgi</label>
                      <textarea 
                        value={profileData.summary}
                        onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:border-indigo-400 min-h-[120px] leading-relaxed"
                        placeholder="Kendinizi kısaca tanıtın..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-500 uppercase">Telefon Numarası</label>
                        <input 
                          type="text" 
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-500 uppercase">Kişisel Portfolyo Linki</label>
                        <input 
                          type="text" 
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Akademik Eğitim */}
              {activeTab === 'akademik' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Eğitim Bilgileri</h3>
                    <button className="text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1 transition">
                      <Plus size={14} /> Yeni Ekle
                    </button>
                  </div>

                  <div className="space-y-4">
                    {profileData.education.map(edu => (
                      <div key={edu.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600"><GraduationCap size={22}/></div>
                          <div>
                            <h4 className="font-black text-sm text-slate-800">{edu.school}</h4>
                            <p className="text-xs text-slate-500 font-semibold mt-1">{edu.degree} - {edu.major} ({edu.startYear} - {edu.endYear})</p>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-2 inline-block">Not Ortalaması: {edu.gpa}</span>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Deneyim ve Yetenekler */}
              {activeTab === 'staj' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">İş ve Staj Deneyimleri</h3>
                      <button className="text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl flex items-center gap-1 transition">
                        <Plus size={14} /> Yeni Ekle
                      </button>
                    </div>

                    <div className="space-y-4">
                      {profileData.experience.map(exp => (
                        <div key={exp.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600"><Building2 size={20}/></div>
                            <div>
                              <h4 className="font-black text-sm text-slate-800">{exp.role}</h4>
                              <p className="text-xs text-slate-500 font-semibold mt-1">{exp.company} • {exp.type} ({exp.startYear} - {exp.endYear})</p>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2.5">{exp.desc}</p>
                            </div>
                          </div>
                          <button className="text-slate-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">Yetenekler</h3>
                    </div>
                    
                    <div className="flex gap-3 mb-4 max-w-sm">
                      <input 
                        type="text" 
                        placeholder="Yetenek yazın..." 
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-400"
                      />
                      <button 
                        onClick={() => {
                          if (!newSkill.trim()) return;
                          setProfileData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                          setNewSkill('');
                        }}
                        className="bg-indigo-600 text-white font-black px-4 py-2 rounded-xl text-xs"
                      >
                        Ekle
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5">
                          {skill} 
                          <span 
                            onClick={() => setProfileData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))}
                            className="text-[10px] text-slate-400 hover:text-red-500 font-bold ml-1"
                          >
                            ✕
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Sertifika & Hedefler */}
              {activeTab === 'sertifika' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">Sertifikalar</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <input 
                        type="text" placeholder="Sertifika Adı" value={newCert.title}
                        onChange={e => setNewCert({...newCert, title: e.target.value})}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-400"
                      />
                      <input 
                        type="text" placeholder="Kurum" value={newCert.issuer}
                        onChange={e => setNewCert({...newCert, issuer: e.target.value})}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-400"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" placeholder="Yıl" value={newCert.date}
                          onChange={e => setNewCert({...newCert, date: e.target.value})}
                          className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-400"
                        />
                        <button 
                          onClick={() => {
                            if (!newCert.title || !newCert.issuer) return;
                            setProfileData(prev => ({ ...prev, certs: [...prev.certs, { id: Date.now(), ...newCert }] }));
                            setNewCert({ title: '', issuer: '', date: '' });
                          }}
                          className="flex-grow bg-indigo-600 text-white font-black rounded-xl text-xs"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {profileData.certs.map(c => (
                        <div key={c.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{c.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.issuer} • {c.date}</p>
                          </div>
                          <button 
                            onClick={() => setProfileData(prev => ({ ...prev, certs: prev.certs.filter(item => item.id !== c.id) }))}
                            className="text-slate-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">Kariyer Hedefleri</h3>
                    </div>
                    <div className="space-y-3">
                      {profileData.goals.map(g => (
                        <div 
                          key={g.id} 
                          onClick={() => toggleGoal(g.id)}
                          className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${g.done ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                            {g.done && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className={`text-xs font-bold ${g.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{g.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Yabancı Dil */}
              {activeTab === 'dil' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Yabancı Dil Seviyeleri</h3>
                  </div>

                  <div className="flex gap-3 max-w-md mb-6">
                    <input 
                      type="text" placeholder="Dil (Örn: Almanca)" value={newLang.name}
                      onChange={e => setNewLang({...newLang, name: e.target.value})}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-400"
                    />
                    <select
                      value={newLang.level}
                      onChange={e => setNewLang({...newLang, level: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-400"
                    >
                      {LANGUAGE_LEVELS.map((lvl, i) => <option key={i} value={lvl}>{lvl}</option>)}
                    </select>
                    <button 
                      onClick={() => {
                        if (!newLang.name) return;
                        setProfileData(prev => ({ ...prev, languages: [...prev.languages, { id: Date.now(), language: newLang.name, level: newLang.level }] }));
                        setNewLang({ name: '', level: 'Orta (B1-B2)' });
                      }}
                      className="bg-indigo-600 text-white font-black px-4 py-2 rounded-xl text-xs"
                    >
                      Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {profileData.languages.map(lang => (
                      <div key={lang.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Languages size={18} className="text-slate-400" />
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{lang.language}</h4>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">{lang.level}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setProfileData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== lang.id) }))}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Akıllı CV Şablonları */}
              {activeTab === 'cv' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Akıllı CV Çıktı Yönetimi</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setCvTemplate('modern')}
                        className={`text-xs font-black px-3.5 py-2 rounded-xl transition ${cvTemplate === 'modern' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        Modern
                      </button>
                      <button 
                        onClick={() => setCvTemplate('academic')}
                        className={`text-xs font-black px-3.5 py-2 rounded-xl transition ${cvTemplate === 'academic' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        Akademik
                      </button>
                      <button 
                        onClick={() => setCvTemplate('creative')}
                        className={`text-xs font-black px-3.5 py-2 rounded-xl transition ${cvTemplate === 'creative' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        Kreatif
                      </button>
                    </div>
                  </div>

                  {/* Simulated Resume A4 Paper Viewport */}
                  <div className="border border-slate-200/80 rounded-2xl bg-white shadow-md p-8 max-w-xl mx-auto font-sans text-slate-700 min-h-[500px]">
                    <div className={`p-4 border-b ${cvTemplate === 'creative' ? 'border-amber-400 bg-amber-50/30' : cvTemplate === 'academic' ? 'border-slate-800 bg-slate-50/50' : 'border-indigo-600 bg-indigo-50/20'} rounded-xl mb-6`}>
                      <h4 className={`text-xl font-black ${cvTemplate === 'creative' ? 'text-amber-800' : cvTemplate === 'academic' ? 'text-slate-900' : 'text-indigo-900'}`}>{currentUser?.name || 'Ad Soyad'}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">Yazılım Mühendisliği Mezunu</p>
                      <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-bold">
                        <span>{profileData.phone}</span>
                        <span>{currentUser?.email}</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <h5 className="font-black text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Özet</h5>
                        <p className="leading-relaxed font-medium text-slate-600">{profileData.summary}</p>
                      </div>
                      <div>
                        <h5 className="font-black text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Eğitim</h5>
                        {profileData.education.map(edu => (
                          <div key={edu.id} className="flex justify-between">
                            <span className="font-bold">{edu.school} - {edu.major}</span>
                            <span className="font-mono text-slate-400">{edu.startYear}-{edu.endYear}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h5 className="font-black text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Deneyim</h5>
                        {profileData.experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex justify-between font-bold">
                              <span>{exp.role} @ {exp.company}</span>
                              <span className="font-mono text-slate-400">{exp.startYear}-{exp.endYear}</span>
                            </div>
                            <p className="text-slate-500 mt-1">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button 
                      onClick={() => {
                        window.toast && window.toast.info("CV Raporu hazırlanıyor...");
                        setTimeout(() => {
                          window.toast && window.toast.success("Akıllı CV başarıyla bilgisayarınıza indirildi!");
                        }, 1200);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition shadow-lg flex items-center gap-1.5"
                    >
                      <Download size={14} /> PDF Olarak Dışa Aktar
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: Kariyer Check-up */}
              {activeTab === 'kariyer_checkup' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Kariyer Check-up Analizi (12 Soru)</h3>
                  </div>

                  {!checkupCompleted ? (
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Soru {checkupStep + 1} / {CHECKUP_QUESTIONS.length}</span>
                        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full transition-all duration-300" 
                            style={{ width: `${((checkupStep + 1) / CHECKUP_QUESTIONS.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      <h4 className="font-black text-slate-800 text-sm sm:text-base leading-relaxed mb-6">
                        {CHECKUP_QUESTIONS[checkupStep].text}
                      </h4>

                      <div className="space-y-3">
                        {CHECKUP_QUESTIONS[checkupStep].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleCheckupAnswer(opt)}
                            className="w-full text-left p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-500 hover:bg-indigo-50/20 text-xs sm:text-sm font-bold text-slate-700 transition"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 text-indigo-600">
                          <Compass size={36} />
                        </div>
                        <div>
                          <h4 className="font-black text-indigo-950 text-sm md:text-base mb-1">Mevcut Kariyer Sağlığı Endeksi: %92</h4>
                          <p className="text-xs text-indigo-800 font-semibold leading-relaxed">
                            Yeteneklerin, projelerin ve mezun başarı endeksin analiz edilerek pazar değerin hesaplandı. Harika bir durumdasın!
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-800">1. Sektör Trendlerine Uyum</span>
                            <span className="text-xs font-black text-indigo-600">%95</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full w-[95%]"></div>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-800">2. Proje Pratikliği & Kod Kalitesi</span>
                            <span className="text-xs font-black text-emerald-600">%88</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[88%]"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            setCheckupStep(0);
                            setCheckupCompleted(false);
                            setCheckupAnswers({});
                          }}
                          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition"
                        >
                          Analizi Yeniden Başlat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: Mezun Kart */}
              {activeTab === 'mezun_kart' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="border-b border-slate-100 pb-4 w-full">
                    <h3 className="text-lg font-black text-slate-900">Dijital İESÜ Mezun Kart</h3>
                  </div>

                  {cardAppStatus === 'form' && (
                    <form onSubmit={handleCardApplication} className="w-full max-w-md bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
                      <h4 className="font-black text-sm text-slate-800 mb-2">Akıllı Mezun Kart Başvuru Formu</h4>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-slate-500 uppercase">Ad Soyad</label>
                        <input 
                          type="text" 
                          value={cardForm.name} 
                          onChange={e => setCardForm({...cardForm, name: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-500 uppercase">Bölüm</label>
                          <input 
                            type="text" 
                            value={cardForm.dept} 
                            onChange={e => setCardForm({...cardForm, dept: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-black text-slate-500 uppercase">Öğrenci No</label>
                          <input 
                            type="text" 
                            value={cardForm.studentId} 
                            onChange={e => setCardForm({...cardForm, studentId: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 pt-2">
                        <input 
                          type="checkbox" 
                          id="agree"
                          checked={cardForm.agreed} 
                          onChange={e => setCardForm({...cardForm, agreed: e.target.checked})}
                          className="mt-1"
                        />
                        <label htmlFor="agree" className="text-[10px] text-slate-500 leading-relaxed font-bold">
                          Mezun bilgilerimin akıllı sözleşme standartlarında İESÜ Mezuniyet Ağına yazılmasını onaylıyorum.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition shadow-lg mt-4"
                      >
                        Akıllı Kartı Oluştur & Dağıt
                      </button>
                    </form>
                  )}

                  {cardAppStatus === 'loading' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                      <h4 className="font-black text-slate-800 mb-1">Kartınız Dağıtılıyor...</h4>
                      <p className="text-slate-400 text-xs max-w-xs leading-relaxed font-semibold">
                        Kimlik verileriniz kriptografik olarak imzalanıp İESÜ Mezun DAG ağına yazılıyor.
                      </p>
                    </div>
                  )}

                  {cardAppStatus === 'minted' && (
                    <div className="flex flex-col items-center gap-6">
                      <p className="text-xs font-bold text-slate-500 text-center max-w-sm leading-relaxed">
                        Kartın üzerine tıklayarak çevirebilir, arka yüzündeki akıllı QR kodunu kampüs girişlerinde okutabilirsin.
                      </p>

                      {/* Flippable card container */}
                      <div 
                        onClick={() => setCardFlipped(!cardFlipped)}
                        className="w-full max-w-[380px] h-[220px] cursor-pointer"
                        style={{ perspective: '1000px' }}
                      >
                        <motion.div 
                          className="w-full h-full relative"
                          style={{ transformStyle: 'preserve-3d' }}
                          animate={{ rotateY: cardFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          {/* Front Side */}
                          <div 
                            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 flex flex-col justify-between text-white shadow-2xl"
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest">İstanbul Esenyurt Üniversitesi</span>
                                <span className="text-sm font-black tracking-tight">MEZUN KART</span>
                              </div>
                              <GraduationCap size={28} className="text-indigo-400" />
                            </div>

                            <div>
                              <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">İsim Soyisim</span>
                              <span className="text-base font-black tracking-wide uppercase">{cardForm.name}</span>
                            </div>

                            <div className="flex justify-between items-end">
                              <div>
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Bölüm</span>
                                <span className="text-xs font-bold">{cardForm.dept}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Mezuniyet</span>
                                <span className="text-xs font-bold">{cardForm.gradYear}</span>
                              </div>
                            </div>
                          </div>

                          {/* Back Side */}
                          <div 
                            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 flex flex-col justify-between text-white shadow-2xl"
                            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-widest font-sans">NFC & QR ID</span>
                                <span className="text-[10px] font-mono text-slate-400">IESU-ALUM-{cardForm.studentId}</span>
                              </div>
                              <div className="w-12 h-12 bg-white rounded-lg p-1">
                                <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center"><span className="text-[6px] font-black text-indigo-400 font-mono">QR</span></div>
                              </div>
                            </div>

                            <div className="text-center text-[10px] text-slate-400 font-bold border-t border-slate-800 pt-4 leading-relaxed">
                              Bu kart İESÜ Mezuniyet Ağı akıllı kimlik doğrulama protokolüyle şifrelenmiştir.
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <button
                        onClick={() => setCardAppStatus('form')}
                        className="text-xs font-black text-slate-500 hover:text-slate-800 transition uppercase tracking-wider"
                      >
                        Yeni Başvuru Yap
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: Kulüp Başvurusu */}
              {activeTab === 'kulup_basvuru' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Aktif Kulüp Başvuruları</h3>
                  </div>

                  <div className="space-y-3">
                    {profileData.clubApplications.map(app => (
                      <div key={app.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{app.name}</h4>
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black uppercase tracking-wider inline-block mt-1">Başvuru {app.status}</span>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="font-black text-sm text-slate-800 mb-4">Başvurabileceğin Popüler Kulüpler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">Girişimcilik ve İnovasyon Kulübü</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">142 Üye • Aktif</p>
                        </div>
                        <button 
                          onClick={() => {
                            setProfileData(prev => ({
                              ...prev,
                              clubApplications: [...prev.clubApplications, { id: Date.now(), name: "Girişimcilik ve İnovasyon Kulübü", status: "İnceleniyor" }]
                            }));
                            window.toast && window.toast.success("Kulüp başvurunuz iletildi!");
                          }}
                          className="bg-indigo-600 text-white font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider"
                        >
                          Katıl
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <h5 className="font-bold text-xs text-slate-800">Blockchain Araştırmaları Topluluğu</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">85 Üye • Aktif</p>
                        </div>
                        <button 
                          onClick={() => {
                            setProfileData(prev => ({
                              ...prev,
                              clubApplications: [...prev.clubApplications, { id: Date.now(), name: "Blockchain Araştırmaları Topluluğu", status: "İnceleniyor" }]
                            }));
                            window.toast && window.toast.success("Kulüp başvurunuz iletildi!");
                          }}
                          className="bg-indigo-600 text-white font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider"
                        >
                          Katıl
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'anket' && userRole === 'alumni' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Mezun Memnuniyet & Anket Merkezi</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1">
                      Geri bildirimleriniz üniversitemizin kalitesini artırmasında büyük rol oynuyor. Aktif anketlere katılarak düşüncelerinizi bizimle paylaşın.
                    </p>
                  </div>

                  {!surveyCompleted ? (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                        <h4 className="font-black text-xs text-indigo-600 uppercase tracking-wider mb-2">Aktif Anket: 2026 İstihdam ve Memnuniyet Anketi</h4>
                        <p className="text-xs text-slate-500 font-bold mb-4">Mezunlarımızın iş bulma süreleri ve aldıkları eğitimin sektörel geçerliliği ölçülmektedir.</p>
                        
                        <div className="space-y-4 pt-2">
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-slate-700">1. Üniversitemizde aldığınız eğitimin kariyerinize katkısından ne kadar memnunsunuz?</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                  key={star} 
                                  type="button"
                                  onClick={() => setSurveyAnswers({...surveyAnswers, q1: star})}
                                  className={`w-10 h-10 rounded-xl font-black text-xs border transition ${surveyAnswers.q1 === star ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {star} ★
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 pt-2">
                            <label className="text-xs font-black text-slate-700">2. Kampüs içi teknolojik altyapı ve kütüphane olanakları yeterli miydi?</label>
                            <div className="flex gap-2">
                              {["Evet", "Kısmen", "Hayır"].map(opt => (
                                <button 
                                  key={opt}
                                  type="button"
                                  onClick={() => setSurveyAnswers({...surveyAnswers, q2: opt})}
                                  className={`px-4 py-2 rounded-xl font-bold text-xs border transition ${surveyAnswers.q2 === opt ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (!surveyAnswers.q1 || !surveyAnswers.q2) {
                            window.toast && window.toast.error("Lütfen tüm soruları yanıtlayın.");
                            return;
                          }
                          setSurveyCompleted(true);
                          window.toast && window.toast.success("📝 Anket geri bildiriminiz başarıyla kaydedildi. Katkınız için teşekkür ederiz!");
                        }}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition"
                      >
                        Yanıtları Gönder
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 text-center bg-slate-50 border border-slate-200 rounded-3xl p-6">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100"><CheckCircle size={28}/></div>
                      <h4 className="font-black text-slate-800 mb-2">Katılımınız İçin Teşekkürler</h4>
                      <p className="text-slate-500 text-xs font-bold max-w-sm mx-auto leading-relaxed">
                        Anket yanıtlarınız kalite geliştirme koordinatörlüğüne iletilmiştir.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
