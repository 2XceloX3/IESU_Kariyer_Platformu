import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, User, BookOpen, Layers, Briefcase, FileText, Shield, 
  Save, Award, Star, Plus, Trash2, Target, UploadCloud, ChevronRight, 
  Camera, MapPin, Mail, Phone, Globe, Link, GraduationCap, 
  Clock, Compass, CheckCircle2, Sparkles, X, Eye
} from 'lucide-react';
import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL } from '../../utils/universityData';
import useAppStore from '../../store/useAppStore';
import { useAdminStore } from '../../brain/useAdminStore';
import Logo from '../Logo';
import SafeAvatar from '../shared/SafeAvatar';
import SubPanelFloatingDock from '../SubPanelFloatingDock';
import AICVBuilder from '../AICVBuilder';
import { toast } from '../shared/Toast';
import eventBus from '../../brain/eventBus';

export default function StudentProfileUpdate({ 
  setView, 
  currentUser, 
  setCurrentUser,
  userRole = 'student',
  setSelectedUserId
}) {
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'personal' | 'career' | 'skills' | 'clubs' | 'cv_links' | 'privacy'
  const [hasChanges, setHasChanges] = useState(false);
  const [showAICVModal, setShowAICVModal] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedCvName, setUploadedCvName] = useState(currentUser?.cvFileName || '');

  // Form State strictly customized for Student Hive
  const [formData, setFormData] = useState({
    // Personal info
    name: currentUser?.name || '',
    studentNo: currentUser?.studentNo || currentUser?.studentId || '2023010482',
    email: currentUser?.email || 'ogrenci@ogr.esenyurt.edu.tr',
    phone: currentUser?.phone || '0555 123 4567',
    birthDate: currentUser?.birthDate || '2003-05-14',
    city: currentUser?.city || 'İstanbul / Esenyurt',
    bio: currentUser?.bio || currentUser?.summary || 'Yazılım geliştirme ve yapay zeka alanlarında kendini geliştiren, takım çalışmasına yatkın lisans öğrencisi.',
    avatar: currentUser?.avatar || '',
    
    // Academic info
    faculty: currentUser?.faculty || 'Mühendislik ve Mimarlık Fakültesi',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    year: currentUser?.year || currentUser?.classLevel || '3. Sınıf',
    gpa: currentUser?.gpa || currentUser?.agno || 3.42,
    advisorName: currentUser?.advisorName || 'Dr. Öğr. Üyesi Deniz Demir',
    graduationExpectedYear: currentUser?.graduationExpectedYear || '2027',
    isDoubleMajor: currentUser?.isDoubleMajor || false,
    capFaculty: currentUser?.capFaculty || '',
    capDept: currentUser?.capDept || '',

    // Career & Internship preferences
    internshipStatus: currentUser?.internshipStatus || 'Devam Ediyor', // 'Yapıldı', 'Yapılmadı', 'Devam Ediyor'
    voluntaryInternshipInterest: currentUser?.voluntaryInternshipInterest !== undefined ? currentUser.voluntaryInternshipInterest : true,
    targetPosition: currentUser?.targetPosition || 'Frontend / Fullstack Developer',
    targetSector: currentUser?.targetSector || 'Teknoloji & Yazılım',
    workModelPreference: currentUser?.workModelPreference || 'Hibrit', // 'Hibrit', 'Uzaktan', 'Ofis'
    
    // Skills, Languages & Clubs
    skills: currentUser?.skills || ['React', 'JavaScript (ES6+)', 'Node.js', 'Tailwind CSS', 'Git & GitHub'],
    languages: currentUser?.languages || [
      { name: 'Türkçe', level: 'Ana Dil (C2)' },
      { name: 'İngilizce', level: 'Mesleki Yetkinlik (B2)' }
    ],
    clubs: currentUser?.clubs || ['İESÜ Yazılım ve İnovasyon Kulübü', 'IEEE İESÜ Öğrenci Kolu'],

    // Links & CV
    linkedin: currentUser?.linkedin || 'https://linkedin.com/in/ogrenci',
    github: currentUser?.github || 'https://github.com/ogrenci',
    portfolioUrl: currentUser?.portfolioUrl || 'https://ogrenci-portfolio.dev',
    cvUrl: currentUser?.cvUrl || null,
    cvFileName: currentUser?.cvFileName || '',

    // Privacy & Notifications
    visibilityToEmployers: currentUser?.visibilityToEmployers !== undefined ? currentUser.visibilityToEmployers : true,
    emailNewsletter: currentUser?.emailNewsletter !== undefined ? currentUser.emailNewsletter : true,
    smsAlerts: currentUser?.smsAlerts !== undefined ? currentUser.smsAlerts : false
  });

  // Modal helpers for new skill, language, experience
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Orta (B1-B2)');

  // Sync with currentUser prop updates
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        ...currentUser,
        studentNo: currentUser.studentNo || currentUser.studentId || prev.studentNo,
        skills: currentUser.skills || prev.skills,
        languages: currentUser.languages || prev.languages,
        clubs: currentUser.clubs || prev.clubs
      }));
      if (currentUser.cvFileName) {
        setUploadedCvName(currentUser.cvFileName);
      }
    }
  }, [currentUser]);

  // Handle Form Change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Skill actions
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (formData.skills.includes(newSkillInput.trim())) {
      toast.info('Bu yetkinlik zaten ekli.');
      return;
    }
    const updated = [...formData.skills, newSkillInput.trim()];
    handleChange('skills', updated);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = formData.skills.filter(s => s !== skillToRemove);
    handleChange('skills', updated);
  };

  // Language actions
  const handleAddLanguage = () => {
    if (!newLangName.trim()) return;
    const updated = [...formData.languages, { name: newLangName.trim(), level: newLangLevel }];
    handleChange('languages', updated);
    setNewLangName('');
  };

  const handleRemoveLanguage = (index) => {
    const updated = formData.languages.filter((_, idx) => idx !== index);
    handleChange('languages', updated);
  };

  // CV File Upload simulation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Özgeçmiş dosya boyutu 5 MB\'dan küçük olmalıdır.');
        return;
      }
      setUploadedCvName(file.name);
      handleChange('cvFileName', file.name);
      handleChange('cvUrl', URL.createObjectURL(file));
      toast.success(`${file.name} başarıyla seçildi.`);
    }
  };

  // Profile Completeness
  const completeness = useMemo(() => {
    let score = 0;
    if (formData.name && formData.name.length > 2) score += 15;
    if (formData.studentNo) score += 10;
    if (formData.faculty && formData.department) score += 20;
    if (formData.phone && formData.email) score += 15;
    if (formData.skills && formData.skills.length >= 3) score += 15;
    if (formData.languages && formData.languages.length >= 1) score += 10;
    if (formData.cvFileName || formData.cvUrl) score += 15;
    return Math.min(score, 100);
  }, [formData]);

  // Save handler with deep two-way synchronization
  const handleSave = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validation
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error('Lütfen geçerli bir Ad Soyad giriniz.');
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    const updatedUser = {
      ...(currentUser || {}),
      ...formData,
      role: 'student',
      profileCompleteness: completeness,
      lastUpdated: new Date().toLocaleDateString('tr-TR')
    };

    // 1. Update Core App Store & LocalStorage
    const appStore = useAppStore.getState();
    if (appStore.setCurrentUser) {
      appStore.setCurrentUser(updatedUser);
    }
    if (setCurrentUser) {
      setCurrentUser(updatedUser);
    }
    try {
      localStorage.setItem('iesu_user', JSON.stringify(updatedUser));
    } catch {}

    // 2. Synchronize with Admin Brain Student Directory (useAdminStore)
    try {
      const adminStore = useAdminStore.getState();
      if (adminStore.students && adminStore.setStudents) {
        const studentList = adminStore.students;
        const exists = studentList.some(s => s.id === updatedUser.id || s.studentNo === updatedUser.studentNo);
        if (exists) {
          adminStore.setStudents(studentList.map(s => 
            (s.id === updatedUser.id || s.studentNo === updatedUser.studentNo) ? { ...s, ...updatedUser } : s
          ));
        } else {
          adminStore.setStudents([updatedUser, ...studentList]);
        }
      }
    } catch (err) {
      console.warn('Admin student sync note:', err);
    }

    try {
      eventBus.emit('audit:logged', {
        action: 'Öğrenci Profil Bilgileri Güncellendi',
        user: updatedUser.name || 'Öğrenci',
        module: 'Profil',
        role: 'student'
      });
    } catch (_) {}

    setHasChanges(false);
    toast.success('Öğrenci profil bilgileriniz başarıyla kaydedildi ve senkronize edildi.');
  };

  const TABS = [
    { id: 'academic', label: 'Akademik Eğitim & ÇAP', icon: GraduationCap },
    { id: 'personal', label: 'Kişisel & İletişim', icon: User },
    { id: 'career', label: 'Kariyer & Staj Tercihleri', icon: Briefcase },
    { id: 'skills', label: 'Yetenekler & Diller', icon: Sparkles },
    { id: 'clubs', label: 'Kulüp & Topluluklar', icon: Layers },
    { id: 'cv_links', label: 'Özgeçmiş & Portfolyo', icon: FileText },
    { id: 'privacy', label: 'Gizlilik & İzinler', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 animate-fade-in">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('student')} 
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer"
              title="Öğrenci Akışına Dön"
            >
              <ArrowLeft size={18} />
            </button>
            <div 
              role="button" 
              tabIndex={0} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setView('student'); } }} 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setView('student')}
            >
              <Logo className="h-8 w-auto text-[#990000]" />
              <div className="border-l-2 border-slate-200 pl-3">
                <span className="text-xs font-black text-[#990000] uppercase tracking-wider block">Öğrenci Portalı</span>
                <h1 className="text-base font-black text-gray-900 leading-none">Öğrenci Bilgilerini Düzenle</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse hidden sm:inline-block">
                Kaydedilmemiş Değişiklikler Var
              </span>
            )}
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Save size={16} />
              <span>Kaydet</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER & PROFILE PROGRESS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <SafeAvatar 
                  src={formData.avatar} 
                  name={formData.name || 'Öğrenci'} 
                  className="w-20 h-20 rounded-2xl border-4 border-white/20 shadow-md text-2xl font-black bg-white/10" 
                />
                <button 
                  onClick={() => {
                    const url = prompt('Yeni profil fotoğrafı URL\'si giriniz:', formData.avatar);
                    if (url !== null) handleChange('avatar', url);
                  }}
                  className="absolute -bottom-2 -right-2 p-1.5 bg-white text-[#990000] rounded-xl shadow-md hover:bg-red-50 transition"
                  title="Fotoğrafı Değiştir"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-500/30 text-white border border-red-400/30 px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider">
                    ÖĞRENCİ BİLGİ SİSTEMİ
                  </span>
                  <span className="text-xs text-red-100 font-mono font-bold">No: {formData.studentNo}</span>
                </div>
                <h2 className="text-2xl font-black text-white">{formData.name || 'Öğrenci Adı'}</h2>
                <p className="text-red-100 text-sm font-medium">
                  {formData.faculty} • <span className="text-amber-300 font-bold">{formData.department}</span> ({formData.year})
                </p>
              </div>
            </div>

            {/* Completeness Bar */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-72 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-red-100">Profil Doluluk Oranı</span>
                <span className="text-white font-black text-sm">%{completeness}</span>
              </div>
              <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-[11px] text-red-200 mt-2">
                {completeness >= 80 ? 'Harika! Özgeçmişiniz işveren aramalarında öne çıkıyor.' : 'Yetkinlik ve staj tercihlerinizi tamamlayarak %100 yapın.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* SIDEBAR TABS */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs sticky top-24">
              <div className="p-3 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Profil Sekmeleri</p>
              </div>
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive 
                        ? 'bg-[#990000] text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-red-50/60 hover:text-[#990000]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-600'} />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  </button>
                );
              })}

              <div className="mt-4 pt-4 border-t border-slate-100 p-2">
                <button
                  onClick={() => setShowAICVModal(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 text-[#990000] border border-red-200 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <Sparkles size={15} className="text-amber-500" />
                  <span>Akıllı CV Sihirbazı</span>
                </button>
              </div>
            </div>
          </div>

          {/* FORM CONTENT AREA */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              
              {/* TAB 1: ACADEMIC */}
              {activeTab === 'academic' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <GraduationCap className="text-[#990000]" size={22} />
                      Akademik Eğitim & ÇAP Bilgileri
                    </h3>
                    <p className="text-sm text-slate-500">Üniversitemiz bünyesindeki resmî lisans/önlisans kayıt ve danışmanlık bilgileriniz.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fakülte / Yüksekokul *</label>
                      <select
                        value={formData.faculty}
                        onChange={(e) => {
                          handleChange('faculty', e.target.value);
                          handleChange('department', '');
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      >
                        {Object.keys(IESU_FACULTIES).map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Bölüm / Program *</label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      >
                        <option value="">Bölüm Seçiniz...</option>
                        {(IESU_FACULTIES[formData.faculty] || ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'İşletme']).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Sınıf Düzeyi *</label>
                      <select
                        value={formData.year}
                        onChange={(e) => handleChange('year', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      >
                        <option value="Hazırlık">İngilizce Hazırlık</option>
                        <option value="1. Sınıf">1. Sınıf</option>
                        <option value="2. Sınıf">2. Sınıf</option>
                        <option value="3. Sınıf">3. Sınıf</option>
                        <option value="4. Sınıf">4. Sınıf (Mezuniyet Adayı)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Genel Not Ortalaması (AGNO / GPA)</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0.00"
                          max="4.00"
                          value={formData.gpa}
                          onChange={(e) => handleChange('gpa', parseFloat(e.target.value) || 0)}
                          className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                        />
                        <span className="text-xs text-slate-500 font-medium">4.00 üzerinden sistemde kayıtlı akademik başarı puanınız.</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Akademik Danışman</label>
                      <input
                        type="text"
                        value={formData.advisorName}
                        onChange={(e) => handleChange('advisorName', e.target.value)}
                        placeholder="Örn: Dr. Öğr. Üyesi Deniz Demir"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tahmini Mezuniyet Yılı</label>
                      <input
                        type="text"
                        value={formData.graduationExpectedYear}
                        onChange={(e) => handleChange('graduationExpectedYear', e.target.value)}
                        placeholder="Örn: 2027"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>
                  </div>

                  {/* DOUBLE MAJOR / ÇAP SECTION */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Çift Anadal (ÇAP) veya Yandal Eğitimi</h4>
                        <p className="text-xs text-slate-500">Aktif olarak ikinci bir lisans veya yandal programına kayıtlı mısınız?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isDoubleMajor}
                          onChange={(e) => handleChange('isDoubleMajor', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#990000]"></div>
                      </label>
                    </div>

                    {formData.isDoubleMajor && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-red-50/40 rounded-2xl border border-red-100 animate-fade-in">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">İkinci Fakülte</label>
                          <select
                            value={formData.capFaculty}
                            onChange={(e) => handleChange('capFaculty', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none"
                          >
                            <option value="">Fakülte Seçiniz...</option>
                            {Object.keys(IESU_FACULTIES).map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">ÇAP / Yandal Bölümü</label>
                          <input
                            type="text"
                            value={formData.capDept}
                            onChange={(e) => handleChange('capDept', e.target.value)}
                            placeholder="Örn: Yazılım Mühendisliği"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PERSONAL */}
              {activeTab === 'personal' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <User className="text-[#990000]" size={22} />
                      Kişisel & İletişim Bilgileri
                    </h3>
                    <p className="text-sm text-slate-500">Kariyer Ofisi ve işveren aday iletişiminiz için güncel iletişim kanallarınız.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Ad Soyad *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Öğrenci Numarası</label>
                      <input
                        type="text"
                        value={formData.studentNo}
                        readOnly
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-500 outline-none cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Resmî Üniversite E-Postası *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Örn: ogrenci@ogr.esenyurt.edu.tr"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Telefon Numarası *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Örn: 0555 123 4567"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">İkamet / Şehir</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Örn: İstanbul / Beylikdüzü"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Doğum Tarihi</label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleChange('birthDate', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kariyer Hedefi & Biyografi Özeti</label>
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      placeholder="Kariyer hedefleriniz, ilgili olduğunuz alanlar ve projeleriniz hakkında kısa bir tanıtım..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: CAREER & INTERNSHIP */}
              {activeTab === 'career' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Briefcase className="text-[#990000]" size={22} />
                      Kariyer & Staj Tercihleri
                    </h3>
                    <p className="text-sm text-slate-500">Zorunlu ve gönüllü staj süreçleriniz ile hedeflediğiniz sektörel pozisyonlar.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Zorunlu Staj Durumu</label>
                      <select
                        value={formData.internshipStatus}
                        onChange={(e) => handleChange('internshipStatus', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      >
                        <option value="Yapıldı">Tamamlandı (Onaylandı)</option>
                        <option value="Devam Ediyor">Şu Anda Yapılıyor</option>
                        <option value="Yapılmadı">Henüz Yapılmadı / Staj Aranıyor</option>
                        <option value="Muaf">Muaf</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Çalışma Şekli Tercihi</label>
                      <select
                        value={formData.workModelPreference}
                        onChange={(e) => handleChange('workModelPreference', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      >
                        <option value="Hibrit">Hibrit (Ofis + Uzaktan)</option>
                        <option value="Uzaktan">Tamamen Uzaktan (Remote)</option>
                        <option value="Ofis">Ofisten / Yerinde</option>
                        <option value="Yarı Zamanlı">Yarı Zamanlı (Part-time)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hedef Pozisyon / Rol</label>
                      <input
                        type="text"
                        value={formData.targetPosition}
                        onChange={(e) => handleChange('targetPosition', e.target.value)}
                        placeholder="Örn: Frontend Developer, Veri Analisti, Ar-Ge Mühendisi"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">İlgilenilen Sektör</label>
                      <select
                        value={formData.targetSector}
                        onChange={(e) => handleChange('targetSector', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      >
                        <option value="Teknoloji & Yazılım">Teknoloji & Yazılım</option>
                        <option value="Savunma Sanayii & Havacılık">Savunma Sanayii & Havacılık</option>
                        <option value="Finans & Bankacılık">Finans & Bankacılık</option>
                        <option value="Sağlık & Biyomedikal">Sağlık & Biyomedikal</option>
                        <option value="Otomotiv & Üretim">Otomotiv & Üretim</option>
                        <option value="E-Ticaret & Lojistik">E-Ticaret & Lojistik</option>
                        <option value="Medya & Reklam">Medya & Reklam</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-950 text-sm">Gönüllü Staj ve Yarı Zamanlı İş Tekliflerine Açığım</h4>
                      <p className="text-xs text-emerald-700">İESÜ Kariyer Koordinatörlüğü onaylı partner firmaların stajyer çağrıları için profilinizi uygun olarak işaretler.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.voluntaryInternshipInterest}
                        onChange={(e) => handleChange('voluntaryInternshipInterest', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: SKILLS & LANGUAGES */}
              {activeTab === 'skills' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Sparkles className="text-[#990000]" size={22} />
                      Teknik Yetkinlikler & Yabancı Diller
                    </h3>
                    <p className="text-sm text-slate-500">Algoritmalar ve işveren ATS filtreleri bu yetkinlikleri tarayarak size uygun iş/staj ilanlarını eşleştirir.</p>
                  </div>

                  {/* Skills Section */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Teknik Beceriler & Araçlar</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                        placeholder="Örn: Docker, Python, Figma, PostgreSQL..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition flex items-center gap-1.5"
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="bg-red-50 text-[#990000] border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs"
                        >
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-800 transition cursor-pointer">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Section */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Yabancı Diller</label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={newLangName}
                        onChange={(e) => setNewLangName(e.target.value)}
                        placeholder="Dil Adı (Örn: Almanca, Fransızca)"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                      />
                      <select
                        value={newLangLevel}
                        onChange={(e) => setNewLangLevel(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 outline-none"
                      >
                        <option value="Başlangıç (A1-A2)">Başlangıç (A1-A2)</option>
                        <option value="Orta (B1-B2)">Orta (B1-B2)</option>
                        <option value="İleri (C1-C2)">İleri (C1-C2)</option>
                        <option value="Ana Dil">Ana Dil</option>
                      </select>
                      <button
                        onClick={handleAddLanguage}
                        className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5"
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    </div>

                    <div className="space-y-2">
                      {formData.languages.map((lang, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Globe size={18} className="text-slate-600" />
                            <span className="font-bold text-sm text-gray-900">{lang.name}</span>
                            <span className="text-xs text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-bold">{lang.level}</span>
                          </div>
                          <button onClick={() => handleRemoveLanguage(idx)} className="text-slate-500 hover:text-red-600 transition">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CLUBS & ACTIVITIES */}
              {activeTab === 'clubs' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Layers className="text-[#990000]" size={22} />
                      Kulüp & Öğrenci Toplulukları
                    </h3>
                    <p className="text-sm text-slate-600 font-medium">Üniversitemiz bünyesinde aktif üye veya yönetiminde olduğunuz kulüpler.</p>
                  </div>

                  <div className="space-y-3">
                    {formData.clubs.map(club => (
                      <div key={club} className="flex items-center justify-between p-4 bg-red-50/40 border border-red-100 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#990000] text-white flex items-center justify-center font-bold">
                            {club.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-900">{club}</h4>
                            <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Aktif Üye</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setView('club_portal')} 
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition"
                        >
                          Kulüp Sayfasına Git
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <p className="text-xs text-slate-600 mb-2">Başka bir kulübe katılmak veya yeni bir kulüp başvurusu yapmak ister misiniz?</p>
                    <button
                      onClick={() => setView('club_portal')}
                      className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
                    >
                      Öğrenci Kulüpleri Portalına Git
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: CV & PORTFOLIO LINKS */}
              {activeTab === 'cv_links' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <FileText className="text-[#990000]" size={22} />
                      Özgeçmiş (CV) & Dijital Portfolyo
                    </h3>
                    <p className="text-sm text-slate-500">İş ve staj başvurularınızda şirketlerin inceleyeceği resmî CV ve bağlantılarınız.</p>
                  </div>

                  {/* CV Upload Box */}
                  <div className="p-6 border-2 border-dashed border-red-200 bg-red-50/30 rounded-2xl text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <UploadCloud className="mx-auto text-[#990000] mb-3" size={36} />
                    <h4 className="font-bold text-gray-900 text-sm mb-1">
                      {uploadedCvName ? `Seçilen Dosya: ${uploadedCvName}` : 'Özgeçmişinizi (PDF) Buraya Yükleyin'}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">Maksimum dosya boyutu: 5 MB (PDF formatı önerilir)</p>
                    
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Dosya Seç
                      </button>
                      <button
                        onClick={() => setShowAICVModal(true)}
                        className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-[#990000] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                      >
                        <Sparkles size={14} className="text-amber-500" />
                        Akıllı CV Oluştur
                      </button>
                    </div>
                  </div>

                  {/* Portfolio & Social Links */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">LinkedIn Profil URL</label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/kullanici"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">GitHub / GitLab URL</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleChange('github', e.target.value)}
                        placeholder="https://github.com/kullanici"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Kişisel Web Sitesi / Portfolyo URL</label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                        placeholder="https://benim-portfolyom.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:border-[#990000]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Shield className="text-[#990000]" size={22} />
                      Gizlilik & İletişim Tercihleri
                    </h3>
                    <p className="text-sm text-slate-500">KVKK ve veri gizliliği kapsamında işverenlerin profilinizi görüntüleme izinleri.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">İşveren Taramalarında Profilim Görünsün</h4>
                        <p className="text-xs text-slate-500">Doğrulanmış partner şirketlerin staj ve iş aday havuzlarında profiliniz listelenir.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.visibilityToEmployers}
                          onChange={(e) => handleChange('visibilityToEmployers', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#990000]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Kariyer Bülteni & Staj Bildirimleri</h4>
                        <p className="text-xs text-slate-500">Bölümünüze özel açılan yeni staj olanakları haftalık e-posta ile iletilir.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.emailNewsletter}
                          onChange={(e) => handleChange('emailNewsletter', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#990000]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SAVE BUTTON AT BOTTOM */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setView('student')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition"
                >
                  İptal & Geri Dön
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-7 py-3 bg-[#990000] hover:bg-red-800 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* AI CV BUILDER MODAL */}
      {showAICVModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowAICVModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
            >
              <X size={20} />
            </button>
            <AICVBuilder 
              currentUser={currentUser} 
              setView={() => setShowAICVModal(false)}
              setSelectedUserId={setSelectedUserId}
            />
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM DOCK */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole={userRole}
      />
    </div>
  );
}
