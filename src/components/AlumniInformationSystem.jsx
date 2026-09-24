import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import ProfileUpdate from './ProfileUpdate';
import TopProfileMenu from './TopProfileMenu';
import SafeAvatar from './shared/SafeAvatar';
import AdminOmniDock from './AdminOmniDock';
import AICVBuilder from './AICVBuilder';
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
  { id: 'kariyer_checkup', label: '🧭 Mezun Kariyer Anketi' },
  { id: 'mezun_kart',      label: '💳 Mezun Kart' },
  { id: 'mezun_dernek_basvuru', label: '🏛️ Mezun Derneği Başvurusu' },
];

const CHECKUP_QUESTIONS = [
  { id: 1, text: "1. Şu anda aktif olarak çalışıyor musunuz?", type: "options", options: ["Evet", "Hayır"] },
  { id: 2, text: "2. İlk işinizi mezun olduktan ne kadar süre sonra buldunuz?", type: "options", options: ["Mezun Olmadan Önce", "0 - 3 Ay İçinde", "3 - 6 Ay İçinde", "6 Ay ve Üzeri"] },
  { id: 3, text: "3. Çalıştığınız sektör", type: "input", placeholder: "Örn: Teknoloji & Yazılım, Finans, Sağlık..." },
  { id: 4, text: "4. Çalıştığınız kurumun türü", type: "input", placeholder: "Örn: Özel Şirket, Kamu Kurumu, Kendi İşletmem..." },
  { id: 5, text: "5. Mevcut göreviniz / ünvanınız", type: "input", placeholder: "Örn: Yazılım Uzmanı, Ürün Yöneticisi..." },
  { id: 6, text: "6. Çalıştığınız iş mezun olduğunuz bölümle ilişkili mi?", type: "options", options: ["Evet", "Hayır"] },
  { id: 7, text: "7. Çalıştığınız il / ülke", type: "input", placeholder: "Örn: İstanbul / Türkiye, Berlin / Almanya..." },
  { id: 8, text: "8. Çalışma şekliniz", type: "options", options: ["Hibrit", "Uzaktan (Remote)", "Ofisten", "Serbest / Freelance"] },
  { id: 9, text: "9. Lisansüstü eğitim alıyor musunuz?", type: "options", options: ["Evet", "Hayır"] },
  { id: 10, text: "10. Telefon numaranız güncel mi?", type: "options", options: ["Evet", "Hayır"] },
  { id: 11, text: "11. E-posta adresiniz güncel mi?", type: "options", options: ["Evet", "Hayır"] },
  { id: 12, text: "12. Üniversitemize veya Kariyer Merkezimize iletmek istediğiniz görüş ve önerileriniz var mı?", type: "textarea", placeholder: "Görüş, istek ve önerilerinizi buraya yazabilirsiniz..." }
];

export default function AlumniInformationSystem({ setView, currentUser, userRole, setSelectedUserId }) {
  const addCheckupRecord = useAppStore(state => state.addCheckupRecord);
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
    tcNo: '',
    dept: currentUser?.department || 'İşletme ve Yönetim Bilimleri',
    gradYear: '2024',
    studentId: currentUser?.studentId || '200201090',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    deliveryType: 'digital', // 'digital' | 'physical'
    address: 'Esenyurt, İstanbul',
    agreed: false
  });

  const alumniAssocApplications = useAppStore(state => state.alumniAssocApplications) || [];
  const setAlumniAssocApplications = useAppStore(state => state.setAlumniAssocApplications);

  // Mezun Derneği Başvuru State
  const [assocAppSubmitted, setAssocAppSubmitted] = useState(false);
  const [assocForm, setAssocForm] = useState({
    type: 'Genel Üyelik', // 'Genel Üyelik' | 'Yönetim Ekibi Adaylığı'
    name: currentUser?.name || '',
    department: currentUser?.department || '',
    gradYear: '2024',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    notes: '',
    agreed: false
  });

  const featureAlumniCard = useAppStore(state => state.featureAlumniCard);
  const featureAlumniAssocToggle = useAppStore(state => state.featureAlumniAssocToggle);

  const filteredTabs = useMemo(() => {
    let list = TABS.filter(tab => tab.id !== 'mezun_kart' && tab.id !== 'mezun_dernek_basvuru');
    if (featureAlumniCard !== false) {
      list.push({ id: 'mezun_kart', label: '💳 Mezun Kart' });
    }
    if (featureAlumniAssocToggle) {
      list.push({ id: 'mezun_dernek_basvuru', label: '🏛️ Mezun Derneği Başvurusu' });
    }
    return list;
  }, [featureAlumniCard, featureAlumniAssocToggle]);
  
  // Local profile state (General University Structure)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    summary: currentUser?.summary || "İstanbul Esenyurt Üniversitesi öğrencisi / mezunu olarak kariyer hedefim doğrultusunda nitelikli projelerde yer almak ve kendimi geliştirmektir.",
    phone: currentUser?.phone || "+90 555 000 0000",
    city: "İstanbul",
    address: "Esenyurt, İstanbul",
    linkedin: "https://linkedin.com",
    website: "",
    education: [
      { id: 1, school: "İstanbul Esenyurt Üniversitesi", degree: "Lisans", major: currentUser?.department || "İşletme ve Yönetim Bilimleri", startYear: "2020", endYear: "2024", gpa: "3.20" }
    ],
    experience: [
      { id: 1, company: "Kurumsal Şirket / Kurum", role: "Uzman / Asistan", type: "Tam Zamanlı", startYear: "2023", endYear: "2024", desc: "Süreç takibi, proje organizasyonu ve kurumsal iletişim çalışmaları yürütüldü." }
    ],
    skills: ["İletişim & Sunum", "Proje Yönetimi", "Problem Çözme", "Zaman Yönetimi", "MS Office"],
    languages: [
      { id: 1, language: "İngilizce", level: "Orta (B1-B2)" }
    ],
    certs: [
      { id: 1, title: "Proje Yönetimi ve İletişim Sertifikası", issuer: "İESÜ Sürekli Eğitim Merkezi (SEM)", date: "2023" }
    ],
    goals: [
      { id: 1, text: "Sektörde uzmanlaşarak liderlik rolleri üstlenmek.", done: true },
      { id: 2, text: "Yabancı dil seviyemi akıcı düzeye ulaştırmak.", done: false },
      { id: 3, text: "Sertifika ve lisansüstü eğitimlerle mesleki donanımımı artırmak.", done: false }
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
  const [newEdu, setNewEdu] = useState({ school: '', major: '', degree: 'Lisans', startYear: '', endYear: '', gpa: '' });
  const [newExp, setNewExp] = useState({ company: '', role: '', type: 'Tam Zamanlı', startYear: '', endYear: '', desc: '' });

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20 selection:bg-emerald-500/20">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-emerald-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight text-md sm:text-lg">Mezun Bilgi Sistemi (MBS)</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="max-w-[1300px] mx-auto p-4 lg:p-8 space-y-6">
        
        {/* TOP HEADER SUMMARY & NAVIGATION TABS */}
        <div className="space-y-4">
          
          {/* Top Profile Summary Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SafeAvatar src={currentUser?.avatar} name={currentUser?.name || "Kariyer Geliştirme Merkezi"} size="lg" rounded="rounded-2xl" className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md border border-gray-100 shrink-0" />
              <div>
                <h2 className="font-black text-slate-900 text-base sm:text-lg leading-tight">{currentUser?.name || 'Mezun Adı'}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Mezun Üye</span>
                  <span className="text-xs text-slate-500 font-semibold">{currentUser?.department || profileData.education[0]?.major || 'Esenyurt Üniversitesi'}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs font-black">
                <span className="text-slate-500">Profil Doluluk Oranı</span>
                <span className="text-emerald-600">%{completeness}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completeness}%` }}
                  className="bg-emerald-600 h-full rounded-full" 
                />
              </div>
            </div>
          </div>

          {/* TOP HORIZONTAL NAVIGATION TABS BAR */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm sticky top-16 z-30 overflow-x-auto scrollbar-none">
            <nav className="flex items-center gap-1.5 min-w-max">
              {filteredTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20 scale-[1.02]' 
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* MAIN TAB CONTENT (FULL WIDTH) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
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
                    <div>
                      <h3 className="text-lg font-black text-slate-900">👤 Kişisel ve İletişim Bilgileri</h3>
                      <p className="text-xs text-slate-500 font-medium">Kimlik, iletişim ve profil özetinizi buradan güncelleyebilirsiniz.</p>
                    </div>
                    <button 
                      onClick={handleAiEnhanceSummary}
                      disabled={aiEnhancing}
                      className="text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      {aiEnhancing ? 'Optimize Ediliyor...' : 'Özeti Otomatik İyileştir'}
                      <Wand2 size={14} />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Kimlik & Genel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">Ad Soyad</label>
                        <input 
                          type="text" 
                          value={profileData.name || currentUser?.name || ''}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">E-Posta Adresi</label>
                        <input 
                          type="email" 
                          value={profileData.email || currentUser?.email || ''}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">Telefon Numarası</label>
                        <input 
                          type="text" 
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          placeholder="+90 5XX XXX XX XX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">Doğum Tarihi / Şehir</label>
                        <input 
                          type="text" 
                          value={profileData.birthCity || '15/05/2001 - İstanbul'}
                          onChange={(e) => setProfileData({...profileData, birthCity: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">LinkedIn Profili</label>
                        <input 
                          type="text" 
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({...profileData, linkedin: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          placeholder="https://linkedin.com/in/kullanici"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-600">Kişisel Web Sitesi / Portfolyo</label>
                        <input 
                          type="text" 
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          placeholder="https://kisiselsite.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">Profesyonel Özet / Biyografi</label>
                      <textarea 
                        value={profileData.summary}
                        onChange={(e) => setProfileData({...profileData, summary: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium focus:outline-none focus:border-emerald-500 min-h-[110px] leading-relaxed text-slate-800"
                        placeholder="Kariyer hedeflerinizi ve uzmanlık alanlarınızı detaylandırın..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => window.toast && window.toast.success('Kişisel bilgileriniz kaydedildi!')} 
                      className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-md"
                    >
                      <Save size={14} /> Bilgileri Kaydet
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: Akademik Eğitim */}
              {activeTab === 'akademik' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">🎓 Akademik Geçmiş & Eğitim</h3>
                      <p className="text-xs text-slate-500 font-medium">Üniversite, fakülte, bölüm ve not ortalamalarınızı ekleyin.</p>
                    </div>
                  </div>

                  {/* Add Education Form */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Plus size={14} className="text-emerald-700" /> Yeni Eğitim Bilgisi Ekle
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input 
                        type="text" placeholder="Üniversite / Okul Adı" 
                        value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                      <input 
                        type="text" placeholder="Fakülte & Bölüm" 
                        value={newEdu.major} onChange={e => setNewEdu({...newEdu, major: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                      <select 
                        value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="Lisans">Lisans</option>
                        <option value="Önlisans">Önlisans</option>
                        <option value="Yüksek Lisans">Yüksek Lisans</option>
                        <option value="Doktora">Doktora</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input 
                        type="text" placeholder="Başlangıç Yılı (Örn: 2020)" 
                        value={newEdu.startYear} onChange={e => setNewEdu({...newEdu, startYear: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                      />
                      <input 
                        type="text" placeholder="Mezuniyet Yılı (Örn: 2024)" 
                        value={newEdu.endYear} onChange={e => setNewEdu({...newEdu, endYear: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" placeholder="GPA (Örn: 3.45)" 
                          value={newEdu.gpa} onChange={e => setNewEdu({...newEdu, gpa: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <button 
                          onClick={() => {
                            if (!newEdu.school || !newEdu.major) return;
                            setProfileData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), ...newEdu }] }));
                            setNewEdu({ school: '', major: '', degree: 'Lisans', startYear: '', endYear: '', gpa: '' });
                            window.toast && window.toast.success('Eğitim bilgisi eklendi!');
                          }}
                          className="px-5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shrink-0"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Education List */}
                  <div className="space-y-3">
                    {profileData.education.map(edu => (
                      <div key={edu.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-start gap-4 shadow-sm hover:border-emerald-200 transition">
                        <div className="flex gap-4">
                          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><GraduationCap size={24}/></div>
                          <div>
                            <h4 className="font-black text-sm text-slate-900">{edu.school}</h4>
                            <p className="text-xs text-slate-600 font-bold mt-1">{edu.degree} - {edu.major}</p>
                            <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-slate-500">
                              <span>📅 {edu.startYear} - {edu.endYear}</span>
                              {edu.gpa && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black border border-emerald-100">GPA: {edu.gpa}</span>}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => setProfileData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                          className="text-slate-400 hover:text-emerald-600 transition p-1"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Navigation & Save Action Bar */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                    <button 
                      type="button"
                      onClick={() => setActiveTab('ozluk')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition flex items-center gap-1.5"
                    >
                      <ChevronLeft size={16} /> Önceki Adım
                    </button>

                    <div className="flex items-center gap-2.5">
                      <button 
                        type="button"
                        onClick={() => window.toast && window.toast.success('Akademik bilgileriniz başarıyla kaydedildi!')} 
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md shadow-emerald-900/10"
                      >
                        <Save size={14} /> Bilgileri Kaydet
                      </button>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('staj')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center gap-1.5"
                      >
                        Sonraki Adım <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Deneyim ve Yetenekler */}
              {activeTab === 'staj' && (
                <div className="space-y-8">
                  {/* Experience Section */}
                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">💼 İş, Staj ve Proje Deneyimleri</h3>
                      <p className="text-xs text-slate-500 font-medium">Çalıştığınız kurumlar, görev aldığınız projeler ve staj süreçleriniz.</p>
                    </div>

                    {/* Add Experience Form */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 mb-5">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Plus size={14} className="text-emerald-700" /> Yeni Deneyim Ekle
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input 
                          type="text" placeholder="Firma / Kurum Adı" 
                          value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <input 
                          type="text" placeholder="Pozisyon / Rol" 
                          value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <select 
                          value={newExp.type} onChange={e => setNewExp({...newExp, type: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        >
                          {EXP_TYPES.map((t, idx) => <option key={idx} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input 
                          type="text" placeholder="Başlangıç (Örn: 2022)" 
                          value={newExp.startYear} onChange={e => setNewExp({...newExp, startYear: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <input 
                          type="text" placeholder="Bitiş / Devam (Örn: 2023 veya Aktif)" 
                          value={newExp.endYear} onChange={e => setNewExp({...newExp, endYear: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <button 
                          onClick={() => {
                            if (!newExp.company || !newExp.role) return;
                            setProfileData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), ...newExp }] }));
                            setNewExp({ company: '', role: '', type: 'Tam Zamanlı', startYear: '', endYear: '', desc: '' });
                            window.toast && window.toast.success('Deneyim bilgisi eklendi!');
                          }}
                          className="bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
                        >
                          Deneyimi Ekle
                        </button>
                      </div>
                      <textarea 
                        placeholder="Görev tanımı ve başarılarınız..." 
                        value={newExp.desc} onChange={e => setNewExp({...newExp, desc: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none min-h-[60px]"
                      />
                    </div>

                    <div className="space-y-3">
                      {profileData.experience.map(exp => (
                        <div key={exp.id} className="p-5 rounded-2xl border border-slate-200 bg-white flex justify-between items-start gap-4 shadow-sm hover:border-emerald-200 transition">
                          <div className="flex gap-4">
                            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><Building2 size={22}/></div>
                            <div>
                              <h4 className="font-black text-sm text-slate-900">{exp.role}</h4>
                              <p className="text-xs text-slate-600 font-bold mt-0.5">{exp.company} • <span className="text-emerald-700">{exp.type}</span> ({exp.startYear} - {exp.endYear})</p>
                              {exp.desc && <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{exp.desc}</p>}
                            </div>
                          </div>
                          <button 
                            onClick={() => setProfileData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }))}
                            className="text-slate-400 hover:text-emerald-600 transition p-1"
                          >
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <div className="border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-base font-black text-slate-900">⚡ Teknik ve Sosyal Yetenekler</h3>
                    </div>
                    
                    <div className="flex gap-2 max-w-md mb-4">
                      <input 
                        type="text" 
                        placeholder="Yetenek ekle (Örn: Python, Liderlik, SQL)..." 
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                      <button 
                        onClick={() => {
                          if (!newSkill.trim()) return;
                          setProfileData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                          setNewSkill('');
                        }}
                        className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition"
                      >
                        Ekle
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs border border-slate-200 flex items-center gap-2">
                          {skill} 
                          <button 
                            onClick={() => setProfileData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))}
                            className="text-slate-400 hover:text-emerald-600 font-black ml-1 text-xs"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Sertifika & Hedefler */}
              {activeTab === 'sertifika' && (
                <div className="space-y-8">
                  {/* Certificates */}
                  <div>
                    <div className="border-b border-slate-100 pb-4 mb-4">
                      <h3 className="text-lg font-black text-slate-900">🏆 Sertifikalar ve Başarılar</h3>
                      <p className="text-xs text-slate-500 font-medium">Katıldığınız eğitimler, aldığınız resmi lisans ve rozetler.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <input 
                        type="text" placeholder="Sertifika / Belge Adı" value={newCert.title}
                        onChange={e => setNewCert({...newCert, title: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      />
                      <input 
                        type="text" placeholder="Veren Kurum (Örn: Coursera, Google)" value={newCert.issuer}
                        onChange={e => setNewCert({...newCert, issuer: e.target.value})}
                        className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input 
                          type="text" placeholder="Yıl" value={newCert.date}
                          onChange={e => setNewCert({...newCert, date: e.target.value})}
                          className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                        />
                        <button 
                          onClick={() => {
                            if (!newCert.title || !newCert.issuer) return;
                            setProfileData(prev => ({ ...prev, certs: [...prev.certs, { id: Date.now(), ...newCert }] }));
                            setNewCert({ title: '', issuer: '', date: '' });
                            window.toast && window.toast.success('Sertifika eklendi!');
                          }}
                          className="flex-1 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {profileData.certs.map(c => (
                        <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                            <Award className="text-emerald-700" size={22} />
                            <div>
                              <h4 className="font-black text-xs text-slate-900">{c.title}</h4>
                              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{c.issuer} • {c.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setProfileData(prev => ({ ...prev, certs: prev.certs.filter(item => item.id !== c.id) }))}
                            className="text-slate-400 hover:text-emerald-600 transition"
                          >
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Career Goals */}
                  <div>
                    <div className="border-b border-slate-100 pb-3 mb-4">
                      <h3 className="text-base font-black text-slate-900">🎯 Kariyer Hedefleri</h3>
                    </div>
                    <div className="space-y-2.5">
                      {profileData.goals.map(g => (
                        <div 
                          key={g.id} 
                          onClick={() => toggleGoal(g.id)}
                          className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition"
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${g.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'}`}>
                            {g.done && <Check size={14} strokeWidth={3} />}
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
                    <h3 className="text-lg font-black text-slate-900">🌍 Yabancı Dil Seviyeleri</h3>
                    <p className="text-xs text-slate-500 font-medium">Bildiğiniz dilleri ve yetkinlik seviyelerinizi tanımlayın.</p>
                  </div>

                  <div className="flex gap-3 max-w-lg mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <input 
                      type="text" placeholder="Dil Adı (Örn: Almanca, Fransızca)" value={newLang.name}
                      onChange={e => setNewLang({...newLang, name: e.target.value})}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                    <select
                      value={newLang.level}
                      onChange={e => setNewLang({...newLang, level: e.target.value})}
                      className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      {LANGUAGE_LEVELS.map((lvl, i) => <option key={i} value={lvl}>{lvl}</option>)}
                    </select>
                    <button 
                      onClick={() => {
                        if (!newLang.name) return;
                        setProfileData(prev => ({ ...prev, languages: [...prev.languages, { id: Date.now(), language: newLang.name, level: newLang.level }] }));
                        setNewLang({ name: '', level: 'Orta (B1-B2)' });
                        window.toast && window.toast.success('Dil eklendi!');
                      }}
                      className="bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-emerald-700 transition"
                    >
                      Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {profileData.languages.map(lang => (
                      <div key={lang.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <Languages size={22} className="text-emerald-700" />
                          <div>
                            <h4 className="font-black text-xs text-slate-900">{lang.language}</h4>
                            <p className="text-[11px] text-emerald-700 font-bold tracking-wider mt-0.5">{lang.level}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setProfileData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== lang.id) }))}
                          className="text-slate-400 hover:text-emerald-600 transition"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: Akıllı CV Şablonları & Sihirbazı */}
              {activeTab === 'cv' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                  <AICVBuilder currentUser={currentUser} userRole={userRole} setView={setView} />
                </div>
              )}

              {/* TAB 7: Mezun Kariyer Anketi */}
              {activeTab === 'kariyer_checkup' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#0A2342] via-[#0d2d54] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-blue-900/50">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider rounded-xl mb-3 shadow-md">
                          <Compass size={14} /> Mezunlara Özel Paneli
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                          Mezun Kariyer Anketi Formu
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-2xl leading-relaxed font-medium">
                          12 soruluk tek tık Mezun Kariyer Anketi formunu doldurarak istihdam durumunuzu, sektör konumunuzu ve kariyer hedeflerinizi Kariyer Geliştirme Merkezi'ne iletin.
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 text-center shrink-0">
                        <div className="text-2xl font-black text-amber-300">12 / 12</div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Tek Ekran Paneli</div>
                      </div>
                    </div>
                  </div>

                  {!checkupCompleted ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const record = {
                          id: `CHECKUP-${Date.now()}`,
                          name: currentUser?.name || 'Mezun',
                          graduationYear: currentUser?.graduationYear || '2024',
                          department: currentUser?.department || 'Bilgisayar Mühendisliği',
                          employed: checkupAnswers[1] || 'Evet',
                          jobTiming: checkupAnswers[2] || 'Belirtilmedi',
                          sector: checkupAnswers[3] || 'Belirtilmedi',
                          companyType: checkupAnswers[4] || 'Belirtilmedi',
                          title: checkupAnswers[5] || 'Belirtilmedi',
                          relatedToMajor: checkupAnswers[6] || 'Evet',
                          newJobTitleIfNo: checkupAnswers['6_sub'] || '-',
                          city: checkupAnswers[7] || 'Belirtilmedi',
                          workMode: checkupAnswers[8] || 'Belirtilmedi',
                          postgrad: checkupAnswers[9] || 'Hayır',
                          phoneUpdated: checkupAnswers[10] || 'Evet',
                          newPhone: checkupAnswers['10_sub'] || currentUser?.phone || '-',
                          emailUpdated: checkupAnswers[11] || 'Evet',
                          newEmail: checkupAnswers['11_sub'] || currentUser?.email || '-',
                          notes: checkupAnswers[12] || 'Görüş belirtilmedi.',
                          date: new Date().toLocaleString('tr-TR')
                        };

                        if (addCheckupRecord) {
                          addCheckupRecord(record);
                        }
                        setCheckupCompleted(true);
                        if (window.toast) window.toast.success("🧭 Mezun Kariyer Anketi yanıtlarınız kaydedildi ve yönetici paneline iletildi!");
                      }} 
                      className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Question 1 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            1. Şu anda aktif olarak çalışıyor musunuz?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Evet", "Hayır"].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCheckupAnswers({ ...checkupAnswers, 1: opt })}
                                className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${checkupAnswers[1] === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 2 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            2. İlk işinizi mezun olduktan ne kadar süre sonra buldunuz?
                          </label>
                          <select
                            value={checkupAnswers[2] || ''}
                            onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 2: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          >
                            <option value="">Seçiniz...</option>
                            <option value="Mezun Olmadan Önce">Mezun Olmadan Önce</option>
                            <option value="0 - 3 Ay İçinde">0 - 3 Ay İçinde</option>
                            <option value="3 - 6 Ay İçinde">3 - 6 Ay İçinde</option>
                            <option value="6 Ay ve Üzeri">6 Ay ve Üzeri</option>
                          </select>
                        </div>

                        {/* Question 3 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            3. Çalıştığınız sektör
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Teknoloji & Yazılım, Finans, Sağlık..."
                            value={checkupAnswers[3] || ''}
                            onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 3: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        {/* Question 4 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            4. Çalıştığınız kurumun türü
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Özel Şirket, Kamu Kurumu, Kendi İşletmem..."
                            value={checkupAnswers[4] || ''}
                            onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 4: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        {/* Question 5 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            5. Mevcut göreviniz / ünvanınız
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Yazılım Uzmanı, Ürün Yöneticisi..."
                            value={checkupAnswers[5] || ''}
                            onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 5: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        {/* Question 6 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            6. Çalıştığınız iş mezun olduğunuz bölümle ilişkili mi?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Evet", "Hayır"].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCheckupAnswers({ ...checkupAnswers, 6: opt })}
                                className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${checkupAnswers[6] === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                          {checkupAnswers[6] === 'Hayır' && (
                            <div className="pt-2 animate-fade-in">
                              <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                                Şu an ne iş yapıyorsunuz? (Mevcut Alan / Meslek)
                              </label>
                              <input
                                type="text"
                                placeholder="Örn: Gayrimenkul Danışmanı, Dijital İçerik Üreticisi..."
                                value={checkupAnswers['6_sub'] || ''}
                                onChange={(e) => setCheckupAnswers({ ...checkupAnswers, '6_sub': e.target.value })}
                                className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                                required
                              />
                            </div>
                          )}
                        </div>

                        {/* Question 7 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            7. Çalıştığınız il / ülke
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: İstanbul / Türkiye, Berlin / Almanya..."
                            value={checkupAnswers[7] || ''}
                            onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 7: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>

                        {/* Question 8 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            8. Çalışma şekliniz
                          </label>
                          <select
                            value={checkupAnswers[8] || ''}
                            onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 8: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          >
                            <option value="">Seçiniz...</option>
                            <option value="Hibrit">Hibrit</option>
                            <option value="Uzaktan (Remote)">Uzaktan (Remote)</option>
                            <option value="Ofisten">Ofisten</option>
                            <option value="Serbest / Freelance">Serbest / Freelance</option>
                          </select>
                        </div>

                        {/* Question 9 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            9. Lisansüstü eğitim alıyor musunuz?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Evet", "Hayır"].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCheckupAnswers({ ...checkupAnswers, 9: opt })}
                                className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${checkupAnswers[9] === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 10 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            10. Telefon numaranız güncel mi?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Evet", "Hayır"].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCheckupAnswers({ ...checkupAnswers, 10: opt })}
                                className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${checkupAnswers[10] === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                          {checkupAnswers[10] === 'Hayır' && (
                            <div className="pt-2 animate-fade-in">
                              <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                                Yeni Telefon Numarası
                              </label>
                              <input
                                type="text"
                                placeholder="+90 5XX XXX XX XX"
                                value={checkupAnswers['10_sub'] || ''}
                                onChange={(e) => setCheckupAnswers({ ...checkupAnswers, '10_sub': e.target.value })}
                                className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                                required
                              />
                            </div>
                          )}
                        </div>

                        {/* Question 11 */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                          <label className="text-xs font-black text-slate-900 block leading-snug">
                            11. E-posta adresiniz güncel mi?
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Evet", "Hayır"].map(opt => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCheckupAnswers({ ...checkupAnswers, 11: opt })}
                                className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${checkupAnswers[11] === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'}`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                          {checkupAnswers[11] === 'Hayır' && (
                            <div className="pt-2 animate-fade-in">
                              <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                                Yeni E-Posta Adresi
                              </label>
                              <input
                                type="email"
                                placeholder="yeni.eposta@gmail.com"
                                value={checkupAnswers['11_sub'] || ''}
                                onChange={(e) => setCheckupAnswers({ ...checkupAnswers, '11_sub': e.target.value })}
                                className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                                required
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Question 12 (Full width Textarea) */}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                        <label className="text-xs font-black text-slate-900 block leading-snug">
                          12. Üniversitemize veya Kariyer Merkezimize iletmek istediğiniz görüş ve önerileriniz var mı?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Görüş, istek ve önerilerinizi buraya yazabilirsiniz..."
                          value={checkupAnswers[12] || ''}
                          onChange={(e) => setCheckupAnswers({ ...checkupAnswers, 12: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest transition shadow-xl cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} /> Mezun Kariyer Anketi Formunu Gönder
                      </button>
                    </form>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-center shrink-0 font-black text-2xl">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-black text-emerald-950 text-base mb-1">Anketiniz Tamamlandı & Kaydedildi!</h4>
                          <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                            Formdaki yanıtlarınız Kariyer Geliştirme Merkezi mezun veri tabanına işlendi. İhtiyaç duyduğunuz anda koordinatörlük uzmanlarımız sizinle iletişime geçecektir.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-900">Sektörel İstihdam Derecesi</span>
                            <span className="text-xs font-black text-emerald-600">%95</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full w-[95%]"></div>
                          </div>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black text-slate-900">Profil & İletişim Güncelliği</span>
                            <span className="text-xs font-black text-emerald-700">%100</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full w-[100%]"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setCheckupCompleted(false);
                            setCheckupAnswers({});
                          }}
                          className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition cursor-pointer"
                        >
                          Formu Yeniden Düzenle
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
                    <h3 className="text-lg font-black text-slate-900">💳 Resmî İESÜ Mezun Kart Başvurusu</h3>
                    <p className="text-xs text-slate-500 font-medium">Kampüs geçişleri, kütüphane kullanımı, sosyal tesis ayrıcalıkları ve dijital cüzdan kimliği için Mezun Kart talebi oluşturabilirsiniz.</p>
                  </div>

                  {cardAppStatus === 'form' && (
                    <form onSubmit={handleCardApplication} className="w-full max-w-xl bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-2">
                        <CreditCard className="text-emerald-700" size={24} />
                        <div>
                          <h4 className="font-black text-sm text-slate-900">Mezun Kart Talep Formu</h4>
                          <p className="text-[11px] text-slate-500 font-medium">Bilgileriniz Öğrenci İşleri ve Mezun Takip Sistemi verileriyle doğrulanır.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Ad Soyad</label>
                          <input 
                            type="text" 
                            value={cardForm.name} 
                            onChange={e => setCardForm({...cardForm, name: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="Ad Soyad"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">T.C. Kimlik / Pasaport No</label>
                          <input 
                            type="text" 
                            value={cardForm.tcNo} 
                            onChange={e => setCardForm({...cardForm, tcNo: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="11 haneli T.C. No"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Mezun Olunan Bölüm</label>
                          <input 
                            type="text" 
                            value={cardForm.dept} 
                            onChange={e => setCardForm({...cardForm, dept: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Mezuniyet Yılı</label>
                          <input 
                            type="text" 
                            value={cardForm.gradYear} 
                            onChange={e => setCardForm({...cardForm, gradYear: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Öğrenci / Mezun No</label>
                          <input 
                            type="text" 
                            value={cardForm.studentId} 
                            onChange={e => setCardForm({...cardForm, studentId: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Telefon Numarası</label>
                          <input 
                            type="text" 
                            value={cardForm.phone} 
                            onChange={e => setCardForm({...cardForm, phone: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="+90 5XX XXX XX XX"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">E-Posta Adresi</label>
                          <input 
                            type="email" 
                            value={cardForm.email} 
                            onChange={e => setCardForm({...cardForm, email: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Teslimat Tercihi */}
                      <div className="flex flex-col gap-1.5 pt-2">
                        <label className="text-xs font-bold text-slate-700">Kart Formatı & Teslimat Tercihi</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${cardForm.deliveryType === 'digital' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                            <input 
                              type="radio" 
                              name="delivery" 
                              checked={cardForm.deliveryType === 'digital'}
                              onChange={() => setCardForm({...cardForm, deliveryType: 'digital'})}
                            />
                            <div>
                              <span className="block text-xs font-black">Dijital Kart (Anında Aktif)</span>
                              <span className="block text-[10px] opacity-75 font-medium">QR kod ile anında cüzdanıma eklensin</span>
                            </div>
                          </label>

                          <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition ${cardForm.deliveryType === 'physical' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                            <input 
                              type="radio" 
                              name="delivery" 
                              checked={cardForm.deliveryType === 'physical'}
                              onChange={() => setCardForm({...cardForm, deliveryType: 'physical'})}
                            />
                            <div>
                              <span className="block text-xs font-black">Fiziksel Kart + Dijital</span>
                              <span className="block text-[10px] opacity-75 font-medium">Adresime kargo ile gönderilsin</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 pt-2">
                        <input 
                          type="checkbox" 
                          id="agree"
                          checked={cardForm.agreed} 
                          onChange={e => setCardForm({...cardForm, agreed: e.target.checked})}
                          className="mt-1 accent-emerald-600"
                        />
                        <label htmlFor="agree" className="text-[11px] text-slate-600 leading-relaxed font-bold">
                          Mezuniyet beyanımın Öğrenci İşleri kayıtlarıyla doğrulanmasını ve İESÜ Mezun Kimlik Kartı şartlarını kabul ediyorum.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-md mt-4"
                      >
                        Mezun Kart Başvurusunu Tamamla
                      </button>
                    </form>
                  )}

                  {cardAppStatus === 'loading' && (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                      <h4 className="font-black text-slate-900 mb-1">Başvurunuz İşleniyor...</h4>
                      <p className="text-slate-500 text-xs max-w-xs leading-relaxed font-semibold">
                        Öğrenci İşleri ve Mezun Bilgi Sistemi kayıtları kontrol edilerek kartınız tanımlanıyor.
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
                            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 border border-emerald-800 p-6 flex flex-col justify-between text-white shadow-2xl"
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
                            className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800 p-6 flex flex-col justify-between text-white shadow-2xl"
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

                            <div className="text-center text-[10px] text-slate-400 font-bold border-t border-emerald-800/60 pt-4 leading-relaxed">
                              Bu kart İESÜ Mezuniyet Ağı akıllı kimlik doğrulama protokolüyle şifrelenmiştir.
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <button
                        onClick={() => setCardAppStatus('form')}
                        className="text-xs font-black text-slate-500 hover:text-red-900 transition uppercase tracking-wider"
                      >
                        Yeni Başvuru Yap
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Mezun Derneği Başvurusu */}
              {activeTab === 'mezun_dernek_basvuru' && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="border-b border-slate-100 pb-4 w-full">
                    <h3 className="text-lg font-black text-slate-900">🏛️ Mezunlar Derneği Üyelik & Ekip Başvurusu</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      İstanbul Esenyurt Üniversitesi Mezunlar Derneği'ne resmî üyelik başvurusu yapabilir veya dernek yönetim ekibinde görev almak için aday olabilirsiniz.
                    </p>
                  </div>

                  {assocAppSubmitted ? (
                    <div className="w-full max-w-xl py-12 px-6 bg-slate-50 border border-slate-200 rounded-3xl text-center space-y-4 shadow-sm">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                        <CheckCircle size={32} />
                      </div>
                      <h4 className="font-black text-slate-900 text-base">Başvurunuz Başarıyla İletildi!</h4>
                      <p className="text-slate-500 text-xs font-semibold max-w-md mx-auto leading-relaxed">
                        Mezunlar Derneği Yönetim Kurulu başvurunuzu inceledikten sonra e-posta ve telefon üzerinden sizinle iletişime geçecektir. Katkılarınız için teşekkür ederiz.
                      </p>
                      <button 
                        onClick={() => setAssocAppSubmitted(false)}
                        className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition"
                      >
                        Yeni Başvuru Formu Aç
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!assocForm.name || !assocForm.phone || !assocForm.email || !assocForm.agreed) {
                          window.toast && window.toast.error("Lütfen zorunlu alanları doldurun ve KVKK onayını işaretleyin.");
                          return;
                        }
                        const newApp = {
                          id: `app-assoc-${Date.now()}`,
                          name: assocForm.name,
                          type: assocForm.type,
                          department: assocForm.department || currentUser?.department || 'İşletme ve Yönetim Bilimleri',
                          graduationYear: assocForm.gradYear || '2024',
                          email: assocForm.email,
                          phone: assocForm.phone,
                          notes: assocForm.notes,
                          appliedAt: new Date().toLocaleDateString('tr-TR'),
                          status: 'Beklemede'
                        };
                        setAlumniAssocApplications([newApp, ...(alumniAssocApplications || [])]);
                        setAssocAppSubmitted(true);
                        window.toast && window.toast.success("🏛️ Mezun Derneği başvurunuz yönetim kuruluna iletildi!");
                      }} 
                      className="w-full max-w-xl bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-2">
                        <Users className="text-emerald-700" size={24} />
                        <div>
                          <h4 className="font-black text-sm text-slate-900">Dernek Katılım & Adaylık Formu</h4>
                          <p className="text-[11px] text-slate-500 font-medium">Resmî Dernek Tüzüğü ve Yönetim Kurulu değerlendirmesi için.</p>
                        </div>
                      </div>

                      {/* Başvuru Türü Seçimi */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Başvuru Niteliği</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition ${assocForm.type === 'Genel Üyelik' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                            <input 
                              type="radio" 
                              name="assoc_type" 
                              checked={assocForm.type === 'Genel Üyelik'}
                              onChange={() => setAssocForm({...assocForm, type: 'Genel Üyelik'})}
                            />
                            <div>
                              <span className="block text-xs font-black">Genel Dernek Üyeliği</span>
                              <span className="block text-[10px] opacity-75 font-medium">Dernek ağında resmi üye olarak yer al</span>
                            </div>
                          </label>

                          <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition ${assocForm.type === 'Yönetim Ekibi Adaylığı' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'}`}>
                            <input 
                              type="radio" 
                              name="assoc_type" 
                              checked={assocForm.type === 'Yönetim Ekibi Adaylığı'}
                              onChange={() => setAssocForm({...assocForm, type: 'Yönetim Ekibi Adaylığı'})}
                            />
                            <div>
                              <span className="block text-xs font-black">Yönetim Ekibi Adaylığı</span>
                              <span className="block text-[10px] opacity-75 font-medium">Dernek projelerinde aktif görev üstlen</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Ad Soyad</label>
                          <input 
                            type="text" 
                            value={assocForm.name} 
                            onChange={e => setAssocForm({...assocForm, name: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="Ad Soyad"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Bölüm & Program</label>
                          <input 
                            type="text" 
                            value={assocForm.department} 
                            onChange={e => setAssocForm({...assocForm, department: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="Örn: İşletme"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Mezuniyet Yılı</label>
                          <input 
                            type="text" 
                            value={assocForm.gradYear} 
                            onChange={e => setAssocForm({...assocForm, gradYear: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="Örn: 2023"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">Telefon Numarası</label>
                          <input 
                            type="text" 
                            value={assocForm.phone} 
                            onChange={e => setAssocForm({...assocForm, phone: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            placeholder="+90 5XX XXX XX XX"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-700">E-Posta Adresi</label>
                          <input 
                            type="email" 
                            value={assocForm.email} 
                            onChange={e => setAssocForm({...assocForm, email: e.target.value})}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700">Katkı & Motivasyon Notu (Opsiyonel)</label>
                        <textarea 
                          rows={3}
                          value={assocForm.notes} 
                          onChange={e => setAssocForm({...assocForm, notes: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                          placeholder="Dernek çatısı altında yürütmek istediğiniz projeler veya uzmanlık alanlarınız..."
                        />
                      </div>

                      <div className="flex items-start gap-2.5 pt-2">
                        <input 
                          type="checkbox" 
                          id="agree_assoc"
                          checked={assocForm.agreed} 
                          onChange={e => setAssocForm({...assocForm, agreed: e.target.checked})}
                          className="mt-1 accent-emerald-600"
                        />
                        <label htmlFor="agree_assoc" className="text-[11px] text-slate-600 leading-relaxed font-bold">
                          Mezunlar Derneği Tüzüğünü okuduğumu ve bilgilerimin Dernek Yönetim Kurulu ile paylaşılmasını onaylıyorum.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-md mt-4"
                      >
                        Dernek Başvurusunu Gönder
                      </button>
                    </form>
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
                          <h4 className="font-bold text-xs text-red-900">{app.name}</h4>
                          <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-black uppercase tracking-wider inline-block mt-1">Başvuru {app.status}</span>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="font-black text-sm text-red-900 mb-4">Başvurabileceğin Popüler Kulüpler</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <h5 className="font-bold text-xs text-red-900">Girişimcilik ve İnovasyon Kulübü</h5>
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
                          className="bg-red-600 text-white font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider"
                        >
                          Katıl
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <h5 className="font-bold text-xs text-red-900">Blockchain Araştırmaları Topluluğu</h5>
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
                          className="bg-red-600 text-white font-black px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider"
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
                        <h4 className="font-black text-xs text-emerald-600 uppercase tracking-wider mb-2">Aktif Anket: 2026 İstihdam ve Memnuniyet Anketi</h4>
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
                                  className={`w-10 h-10 rounded-xl font-black text-xs border transition ${surveyAnswers.q1 === star ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
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
                                  className={`px-4 py-2 rounded-xl font-bold text-xs border transition ${surveyAnswers.q2 === opt ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
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
                        className="px-6 py-3 bg-red-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition"
                      >
                        Yanıtları Gönder
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 text-center bg-slate-50 border border-slate-200 rounded-3xl p-6">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100"><CheckCircle size={28}/></div>
                      <h4 className="font-black text-red-900 mb-2">Katılımınız İçin Teşekkürler</h4>
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

      {/* Floating Bottom OmniDock */}
      <AdminOmniDock 
        setView={setView} 
        activeTab="alumni_info_system" 
        currentUser={currentUser} 
        setSelectedUserId={setSelectedUserId} 
        theme={useAppStore.getState().activePortalBranch === 'admin' ? 'amber' : 'emerald'} 
      />
    </div>
  );
}


