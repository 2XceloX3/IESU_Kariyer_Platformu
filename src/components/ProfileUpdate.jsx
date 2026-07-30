import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, User, BookOpen, Layers, Briefcase, FileText, Shield, Building2, Save, Settings, Award, Star, Plus, Trash2, Target, UploadCloud, ChevronRight, UserCircle2, X, Camera, MapPin, Mail, Phone, Globe, Link } from 'lucide-react';
import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU } from '../utils/universityData';
import useAppStore from '../store/useAppStore';
import AICVBuilder from './AICVBuilder';
import Logo from './Logo';

export default function ProfileUpdate({ 
  setView, 
  currentUser, setCurrentUser,
  userRole
}) {
  const setStudents = useAppStore(state => state.setStudents);
  const setAlumni = useAppStore(state => state.setAlumni);
  const setCompanies = useAppStore(state => state.setCompanies);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({ 
    skills: [], languages: [], experiences: [], certificates: [], careerPreferences: [],
    privacySettings: { visibility: true, emailNotifications: true, newsletters: true },
    isDoubleMajor: false,
    ...currentUser 
  });
  const [hasChanges, setHasChanges] = useState(false);
  
  // File Upload State
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Modal States
  const [showExpModal, setShowExpModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Temporary Modal Form Data
  const [tempExp, setTempExp] = useState({ title: '', company: '', type: 'Staj' });
  const [tempSkill, setTempSkill] = useState('');
  const [tempLang, setTempLang] = useState({ name: '', level: 'Başlangıç (A1-A2)' });
  const [tempCert, setTempCert] = useState({ name: '', issuer: '' });

  // Dependent dropdown states for Academic Info
  const [selectedFaculty, setSelectedFaculty] = useState(currentUser?.faculty || '');
  const [selectedDept, setSelectedDept] = useState(currentUser?.department || '');
  const [selectedCapFaculty, setSelectedCapFaculty] = useState(currentUser?.capFaculty || '');
  const [selectedCapDept, setSelectedCapDept] = useState(currentUser?.capDept || '');

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({ ...prev, ...currentUser }));
      if (currentUser.faculty) setSelectedFaculty(currentUser.faculty);
      if (currentUser.department) setSelectedDept(currentUser.department);
      if (currentUser.capFaculty) setSelectedCapFaculty(currentUser.capFaculty);
      if (currentUser.capDept) setSelectedCapDept(currentUser.capDept);
      if (currentUser.attachmentName) setUploadedFileName(currentUser.attachmentName);
    }
  }, [currentUser]);

  // Profile Completeness Calculation
  const completeness = useMemo(() => {
    let score = 0;
    if (formData.email) score += 15;
    if (formData.phone) score += 15;
    if (formData.faculty || formData.sector) score += 10;
    if (formData.experiences?.length > 0) score += 20;
    if (formData.skills?.length > 0) score += 10;
    if (formData.languages?.length > 0) score += 10;
    if (formData.certificates?.length > 0) score += 10;
    if (formData.attachmentName) score += 10;
    return Math.min(score, 100);
  }, [formData]);

  const tabs = useMemo(() => {
    if (userRole === 'company' || userRole === 'employer') return [
      { id: 'personal', label: '🏢 Firma Bilgileri' }
    ];
    return [
      { id: 'personal', label: '👤 Kişisel & Gizlilik' },
      { id: 'academic', label: '🎓 Akademik Eğitim' },
      { id: 'experience', label: '💼 Kariyer & Yetenekler' },
      { id: 'certificates', label: '🏆 Sertifika & Hedefler' },
      { id: 'cvbuilder', label: '📄 Akıllı CV' }
    ];
  }, [userRole]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
    setHasChanges(true);
  };

  const toggleArrayItem = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field] || [];
      const newArray = currentArray.includes(value) 
        ? currentArray.filter(i => i !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (hasChanges) {
      const finalData = { ...formData, faculty: selectedFaculty, department: selectedDept, capFaculty: selectedCapFaculty, capDept: selectedCapDept };
      setCurrentUser(finalData);
      if (userRole === 'student' && setStudents) setStudents(prev => (prev || []).map(s => s.id === finalData.id ? finalData : s));
      else if (userRole === 'alumni' && setAlumni) setAlumni(prev => (prev || []).map(a => a.id === finalData.id ? finalData : a));
      else if ((userRole === 'company' || userRole === 'employer') && setCompanies) setCompanies(prev => (prev || []).map(c => c.id === finalData.id ? finalData : c));

      setHasChanges(false);
      window.toast.success('Profiliniz başarıyla güncellendi.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      handleInputChange('attachmentData', fileUrl);
      handleInputChange('attachmentName', file.name);
      window.toast.success('CV dosyası eklendi, kaydet butonuna basmayı unutmayın.');
    }
  };

  // Item Handlers
  const addExperience = () => {
    if (tempExp.title && tempExp.company) {
      handleInputChange('experiences', [...(formData.experiences || []), { id: Date.now(), ...tempExp }]);
      setShowExpModal(false);
      setTempExp({ title: '', company: '', type: 'Staj' });
    }
  };
  const addSkill = () => {
    if (tempSkill) {
      handleInputChange('skills', [...(formData.skills || []), tempSkill]);
      setShowSkillModal(false); setTempSkill('');
    }
  };
  const addLanguage = () => {
    if (tempLang.name) {
      handleInputChange('languages', [...(formData.languages || []), { id: Date.now(), ...tempLang }]);
      setShowLangModal(false); setTempLang({ name: '', level: 'Başlangıç (A1-A2)' });
    }
  };
  const addCert = () => {
    if (tempCert.name) {
      handleInputChange('certificates', [...(formData.certificates || []), { id: Date.now(), ...tempCert }]);
      setShowCertModal(false); setTempCert({ name: '', issuer: '' });
    }
  };
  const removeItem = (arrayName, idOrValue) => {
    const arr = formData[arrayName] || [];
    const newArr = typeof arr[0] === 'string' ? arr.filter(item => item !== idOrValue) : arr.filter(item => item.id !== idOrValue);
    handleInputChange(arrayName, newArr);
  };

  const { activeFaculties, availableDepts, availableCapDepts } = useMemo(() => {
    const allUnits = [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU];
    const faculties = allUnits.map((u, i) => ({ 
      id: `fac-${i}`, name: u.name, status: 'Aktif', 
      departments: u.departments.map((d, j) => ({ id: `dept-${i}-${j}`, name: d, status: 'Aktif', programs: [{ id: `prog-${i}-${j}`, name: d, level: 'Lisans', status: 'Aktif' }] })) 
    }));
    const depts = selectedFaculty ? (faculties.find(f => f.name === selectedFaculty)?.departments || []) : [];
    const capDepts = selectedCapFaculty ? (faculties.find(f => f.name === selectedCapFaculty)?.departments || []) : [];
    
    return { activeFaculties: faculties, availableDepts: depts, availableCapDepts: capDepts };
  }, [selectedFaculty, selectedCapFaculty]);

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden selection:bg-red-500/30 min-h-screen bg-gray-50/50">

      {/* FIXED TOP NAVIGATION BAR (RESMİ HEADER NAVBAR) */}
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              const target = userRole === 'academic' ? 'academic' : (userRole === 'company' || userRole === 'employer') ? 'company' : userRole === 'alumni' ? 'alumni' : 'student';
              setView(target);
            }}
            title="Ana Akışa Dönmek İçin Tıklayın"
          >
            <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
            <div className="text-left">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Merkezi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const target = userRole === 'academic' ? 'academic' : (userRole === 'company' || userRole === 'employer') ? 'company' : userRole === 'alumni' ? 'alumni' : 'student';
                setView(target);
              }}
              className="px-4 py-2 bg-[#990000] text-white rounded-xl text-xs font-black hover:bg-red-800 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              🏠 Portala Dön
            </button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 z-10 relative px-4 pt-6 pb-20">
        
        {/* ÜST YATAY SEKME ŞERİDİ (TOP TAB BAR) */}
        <div className="bg-white rounded-2xl p-3 border border-gray-200/80 shadow-md shadow-gray-200/40 w-full">
          <nav className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive 
                      ? 'bg-[#990000] text-white shadow-md shadow-red-950/20' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="w-full min-h-[600px] bg-white border border-gray-200/80 rounded-3xl shadow-xl p-6 md:p-10 relative overflow-hidden">
          
          <div className="mb-8 pb-6 border-b border-gray-100/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-red-50 text-[#990000] text-xs font-black rounded-full uppercase tracking-wider">
                  {userRole === 'alumni' ? '🎓 Mezun Bilgi Sistemi (MBS)' : userRole === 'student' ? '🎓 Öğrenci Bilgi Düzenleme Paneli' : '🏢 Kurumsal Bilgi Yönetimi'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {userRole === 'alumni' 
                  ? "Kariyer Check-up, Mezun Kartı ve profil güncellemelerinizi MBS üzerinden kolayca yönetin." 
                  : "Öğrenci bilgilerinizi, yeteneklerinizi ve akademik geçmişinizi güncelleyerek özgeçmişinizi güçlendirin."}
              </p>
            </div>
          </div>

          <div className="animate-fade-in space-y-8">
            
            {/* PERSONAL & PRIVACY TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-12">

                {/* (FİRMA ÖZEL) KURUMSAL GÖRSEL & ARKA TASARIM YÖNETİMİ */}
                {(userRole === 'company' || userRole === 'employer') && (
                  <div className="p-6 bg-gradient-to-br from-red-50/50 via-white to-gray-50 rounded-3xl border border-red-100/80 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                          <Camera className="text-[#990000]" size={20} />
                          Kurumsal Görsel & Arka Kapak Tasarımı
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Firma logosu ve profilinizin arka plan kapak fotoğrafını güncelleyin.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Logo Yükleme */}
                      <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200/80">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Firma Logosu</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
                            <img src={formData.logo || formData.avatar || '/iesu-logo.svg'} alt="Logo" className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#990000] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                              <Camera size={14} /> Logo Yükle (PNG/JPG)
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      if (evt.target?.result) {
                                        handleInputChange('logo', evt.target.result);
                                        handleInputChange('avatar', evt.target.result);
                                        window.toast?.success('Logo seçildi! Sayfayı kaydetmeyi unutmayın.');
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="url"
                              placeholder="Logo URL: https://..."
                              value={formData.logo || formData.avatar || ''}
                              onChange={(e) => {
                                handleInputChange('logo', e.target.value);
                                handleInputChange('avatar', e.target.value);
                              }}
                              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Arka Kapak Yükleme */}
                      <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200/80">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Arka Kapak Fotoğrafı</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-16 rounded-xl border border-gray-200 bg-gray-900 overflow-hidden shrink-0">
                            {formData.coverImage || formData.cover ? (
                              <img src={formData.coverImage || formData.cover} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-950 flex items-center justify-center text-[10px] text-red-200 font-bold">Default</div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition">
                              <Camera size={14} /> Kapak Yükle
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (evt) => {
                                      if (evt.target?.result) {
                                        handleInputChange('coverImage', evt.target.result);
                                        handleInputChange('cover', evt.target.result);
                                        window.toast?.success('Kapak fotoğrafı seçildi!');
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="url"
                              placeholder="Kapak URL: https://..."
                              value={formData.coverImage || formData.cover || ''}
                              onChange={(e) => {
                                handleInputChange('coverImage', e.target.value);
                                handleInputChange('cover', e.target.value);
                              }}
                              className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-medium"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Hazır Kapak Şablonları */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Hazır Arka Kapak Şablonları (Tek Tıkla Uygula)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { name: 'Kurumsal Plaza', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Teknoloji Ofisi', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'İESÜ Kampüs', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80' },
                          { name: 'Kırmızı Tema', url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              handleInputChange('coverImage', preset.url);
                              handleInputChange('cover', preset.url);
                              window.toast?.success(`${preset.name} kapak olarak seçildi!`);
                            }}
                            className={`group relative h-16 rounded-xl overflow-hidden border-2 text-left transition-all ${formData.coverImage === preset.url ? 'border-[#990000] ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-400'}`}
                          >
                            <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 p-1.5 flex items-end">
                              <span className="text-[10px] font-bold text-white leading-tight drop-shadow">{preset.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{userRole === 'company' ? 'Firma Adı' : 'Ad Soyad'}</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="text" value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">E-Posta Adresi</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="email" value={formData.email || ''} onChange={e => handleInputChange('email', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Telefon Numarası</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="tel" value={formData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none" placeholder="+90 555 555 5555" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kişisel Web Sitesi / Portfolyo</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input type="url" value={formData.website || ''} onChange={(e) => handleInputChange('website', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="https://www.example.com" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">GitHub / Behance / Proje Bağlantısı</label>
                    <div className="relative">
                      <Link className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input type="url" value={formData.github || ''} onChange={(e) => handleInputChange('github', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="https://github.com/username" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Konum / Şehir</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input type="text" value={formData.location || ''} onChange={e => handleInputChange('location', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none" placeholder="Örn: İstanbul, Türkiye" />
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 mt-4 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Hakkımda / Biyografi</label>
                    <textarea rows={4} value={formData.bio || ''} onChange={e => handleInputChange('bio', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none resize-none" placeholder="Kendinizden, kariyer hedeflerinizden ve ilgi alanlarınızdan bahsedin..." />
                  </div>

                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">LinkedIn Profili</label>
                      <div className="relative">
                        <Link size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="url" value={formData.linkedin || ''} onChange={e => handleInputChange('linkedin', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none" placeholder="linkedin.com/in/username" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Kişisel Web Sitesi</label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="url" value={formData.website || ''} onChange={e => handleInputChange('website', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none" placeholder="https://www.example.com" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100/80 pt-8 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Gizlilik ve İzinler</h3>
                  <div className="p-5 border border-gray-100 rounded-2xl bg-white flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-gray-900">Profil Görünürlüğü</h4>
                      <p className="text-sm text-gray-500 mt-1">Profilinizin işverenler ve diğer öğrenciler tarafından görünürlüğünü açıp kapatabilirsiniz.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.privacySettings?.visibility} onChange={e => handleNestedChange('privacySettings', 'visibility', e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                  <div className="p-5 border border-gray-100 rounded-2xl bg-white flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-bold text-gray-900">E-Posta Bildirimleri</h4>
                      <p className="text-sm text-gray-500 mt-1">İş başvuruları ve mesajlarla ilgili e-posta bildirimleri alın.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={formData.privacySettings?.emailNotifications} onChange={e => handleNestedChange('privacySettings', 'emailNotifications', e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMIC & CAP_YANDAL TAB */}
            {activeTab === 'academic' && (
              <div className="space-y-12">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-red-600 shrink-0">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Temel Eğitim Bilgileri</h3>
                    <p className="text-sm text-gray-500 mt-1">Ana bölümünüze ait eğitim bilgilerinizi buradan güncelleyebilirsiniz.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fakülte / Enstitü</label>
                    <select 
                      value={selectedFaculty} 
                      onChange={(e) => {
                        setSelectedFaculty(e.target.value);
                        setSelectedDept('');
                        setHasChanges(true);
                      }} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <option value="">Fakülte Seçiniz</option>
                      {activeFaculties.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bölüm / Program</label>
                    <select 
                      value={selectedDept} 
                      onChange={(e) => {
                        setSelectedDept(e.target.value);
                        setHasChanges(true);
                      }}
                      disabled={!selectedFaculty} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 disabled:opacity-50"
                    >
                      <option value="">Bölüm Seçiniz</option>
                      {availableDepts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Sınıf</label>
                    <input type="text" value={formData.grade || ''} onChange={(e) => handleInputChange('grade', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="Örn: 3. Sınıf" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Genel Not Ortalaması (GNO)</label>
                    <input type="text" value={formData.gpa || ''} onChange={(e) => handleInputChange('gpa', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="Örn: 3.45 / 4.00" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bitirme Tezi / Akademik Proje Başlığı</label>
                    <input type="text" value={formData.thesis || ''} onChange={(e) => handleInputChange('thesis', e.target.value)} className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" placeholder="Örn: Yapay Zeka Destekli Otonom Kariyer Eşleştirme Sistemi" />
                  </div>
                </div>

                <div className="border-t border-gray-100/80 pt-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="doubleMajor" checked={formData.isDoubleMajor} onChange={(e) => handleInputChange('isDoubleMajor', e.target.checked)} className="w-5 h-5 text-red-600 rounded" />
                    <label htmlFor="doubleMajor" className="text-lg font-bold text-gray-900">Çift Anadal / Yandal Yapıyorum</label>
                  </div>
                  
                  {formData.isDoubleMajor && (
                    <div className="bg-slate-50/80 p-6 rounded-3xl border border-gray-200/80 space-y-6 animate-fade-in">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                        <span className="w-3 h-3 rounded-full bg-[#990000]"></span>
                        <h4 className="font-black text-gray-900 text-sm">Çift Anadal / Yandal Detaylı Akademik Bilgileri</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ÇAP/Yandal Fakültesi</label>
                          <select 
                            value={selectedCapFaculty} 
                            onChange={(e) => {
                              setSelectedCapFaculty(e.target.value);
                              setSelectedCapDept('');
                              setHasChanges(true);
                            }} 
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm"
                          >
                            <option value="">Fakülte Seçiniz</option>
                            {activeFaculties.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ÇAP/Yandal Bölümü</label>
                          <select 
                            value={selectedCapDept} 
                            onChange={(e) => {
                              setSelectedCapDept(e.target.value);
                              setHasChanges(true);
                            }}
                            disabled={!selectedCapFaculty} 
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 disabled:opacity-50 shadow-sm"
                          >
                            <option value="">Bölüm Seçiniz</option>
                            {availableCapDepts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ÇAP / Yandal Sınıfı</label>
                          <input 
                            type="text" 
                            value={formData.capGrade || ''} 
                            onChange={(e) => handleInputChange('capGrade', e.target.value)} 
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm" 
                            placeholder="Örn: 2. Sınıf" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ÇAP / Yandal Not Ortalaması (GNO)</label>
                          <input 
                            type="text" 
                            value={formData.capGpa || ''} 
                            onChange={(e) => handleInputChange('capGpa', e.target.value)} 
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm" 
                            placeholder="Örn: 3.65 / 4.00" 
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ÇAP / Yandal Bitirme Projesi & Çalışmaları</label>
                          <input 
                            type="text" 
                            value={formData.capThesis || ''} 
                            onChange={(e) => handleInputChange('capThesis', e.target.value)} 
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm" 
                            placeholder="Örn: İkinci Anadal Veri Tabanı ve Siber Güvenlik Projesi" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EXPERIENCE & SKILLS TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">İş ve Staj Deneyimleri</h3>
                      <p className="text-sm text-gray-500 max-w-xl">Staj ve profesyonel iş deneyimlerinizi buradan yönetebilirsiniz.</p>
                    </div>
                    <button onClick={() => setShowExpModal(true)} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors shrink-0">
                      <Plus size={16} /> Yeni Deneyim
                    </button>
                  </div>

                  <div className="p-6 border border-gray-200 border-dashed rounded-xl bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-600">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">CV / Özgeçmiş Belgesi</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{uploadedFileName ? uploadedFileName : 'Henüz PDF yüklenmedi'}</p>
                      </div>
                    </div>
                    <div>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.doc,.docx" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                        <UploadCloud size={18} className="text-gray-500" />
                        Yükle
                      </button>
                    </div>
                  </div>

                  {(!formData.experiences || formData.experiences.length === 0) ? (
                    <div className="text-center py-12 border border-gray-100 rounded-xl bg-white shadow-sm">
                      <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-500 font-medium">Henüz bir deneyim eklenmemiş.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {formData.experiences.map((exp) => (
                        <div key={exp.id} className="p-5 border border-gray-100 rounded-2xl bg-white flex items-start justify-between group hover:border-indigo-100 hover:shadow-md transition-all">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 shrink-0">
                              <Building2 size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-base">{exp.title}</h4>
                              <p className="text-sm font-medium text-red-600 mt-0.5">{exp.company}</p>
                              <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">{exp.type}</span>
                            </div>
                          </div>
                          <button onClick={() => removeItem('experiences', exp.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100/80 pt-8 space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Star size={20} className="text-amber-500"/> Yetenekler</h3>
                      <button onClick={() => setShowSkillModal(true)} className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-indigo-800 transition-colors">
                        <Plus size={16} /> Ekle
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(!formData.skills || formData.skills.length === 0) ? (
                        <p className="text-sm text-gray-500 italic">Yetenek eklenmemiş.</p>
                      ) : (
                        formData.skills.map((skill) => (
                          <div key={skill} className="pl-4 pr-1.5 py-1.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 text-sm font-bold text-gray-700 shadow-sm group">
                            {skill}
                            <button onClick={() => removeItem('skills', skill)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-500 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Globe size={20} className="text-red-500"/> Yabancı Diller</h3>
                      <button onClick={() => setShowLangModal(true)} className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-indigo-800 transition-colors">
                        <Plus size={16} /> Ekle
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(!formData.languages || formData.languages.length === 0) ? (
                        <p className="text-sm text-gray-500 italic col-span-2">Dil bilgisi eklenmemiş.</p>
                      ) : (
                        formData.languages.map((lang) => (
                          <div key={lang.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm group hover:border-red-100 transition-colors">
                            <div>
                              <p className="font-bold text-gray-900">{lang.name}</p>
                              <p className="text-xs text-red-600 font-medium mt-0.5">{lang.level}</p>
                            </div>
                            <button onClick={() => removeItem('languages', lang.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CERTIFICATES & CAREER TAB */}
            {activeTab === 'certificates' && (
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Eğitim ve Sertifikalar</h3>
                      <p className="text-sm text-gray-500 max-w-xl">Katıldığınız eğitimler ve sertifikalarınızı buradan ekleyebilirsiniz.</p>
                    </div>
                    <button onClick={() => setShowCertModal(true)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shrink-0 shadow-md">
                      <Plus size={16} /> Sertifika Ekle
                    </button>
                  </div>

                  {(!formData.certificates || formData.certificates.length === 0) ? (
                    <div className="text-center py-12 border border-gray-100 rounded-xl bg-white shadow-sm">
                      <Award size={48} className="mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-500 font-medium">Henüz bir sertifika eklenmemiş.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.certificates.map((cert) => (
                        <div key={cert.id} className="p-5 border border-gray-100 rounded-2xl bg-white flex items-start justify-between group hover:border-indigo-100 hover:shadow-md transition-all">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{cert.name}</h4>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">{cert.issuer}</p>
                          </div>
                          <button onClick={() => removeItem('certificates', cert.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100/80 pt-8 space-y-6">
                   <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Çalışma Şekli Tercihleri</h3>
                   <div className="flex flex-wrap gap-3">
                     {['Uzaktan (Remote)', 'Hibrit', 'Ofisten', 'Serbest Zamanlı', 'Proje Bazlı'].map(pref => (
                       <button 
                         key={pref} 
                         onClick={() => toggleArrayItem('careerPreferences', pref)}
                         className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                           (formData.careerPreferences || []).includes(pref) 
                             ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                             : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                         }`}
                       >
                         {pref}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {/* TAB 5: AI CV Builder / CV Oluşturucu */}
            {activeTab === 'cvbuilder' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
                <AICVBuilder currentUser={{ ...currentUser, ...formData }} userRole={userRole} setView={setView} />
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODALS - Redesigned to look like macOS Dialogs */}
      {showExpModal && (
        <div className="fixed inset-0 bg-red-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up transform transition-all">
            <div className="px-6 py-5 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Yeni Deneyim</h3>
              <button onClick={() => setShowExpModal(false)} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors p-1.5 rounded-full"><X size={18}/></button>
            </div>
            <div className="p-6 space-y-5 pt-0">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Ünvan / Pozisyon</label>
                <input type="text" autoFocus onKeyDown={e => e.key === 'Enter' && addExperience()} value={tempExp.title} onChange={e => setTempExp({...tempExp, title: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm" placeholder="Örn: Yazılım Stajyeri" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Firma / Kurum</label>
                <input type="text" onKeyDown={e => e.key === 'Enter' && addExperience()} value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm" placeholder="Örn: Google Türkiye" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Çalışma Tipi</label>
                <select value={tempExp.type} onChange={e => setTempExp({...tempExp, type: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm appearance-none">
                  <option>Staj</option><option>Tam Zamanlı</option><option>Yarı Zamanlı</option><option>Gönüllü</option>
                </select>
              </div>
              <button onClick={addExperience} className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-black transition-all shadow-lg hover:shadow-gray-900/20">Deneyimi Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {showSkillModal && (
        <div className="fixed inset-0 bg-red-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up transform transition-all">
            <div className="px-6 py-5 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Yetenek Ekle</h3>
              <button onClick={() => setShowSkillModal(false)} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors p-1.5 rounded-full"><X size={18}/></button>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <input type="text" autoFocus value={tempSkill} onChange={e => setTempSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm" placeholder="Örn: React.js, Liderlik..." />
              <button onClick={addSkill} className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md">Ekle</button>
            </div>
          </div>
        </div>
      )}

      {showLangModal && (
        <div className="fixed inset-0 bg-red-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up transform transition-all">
            <div className="px-6 py-5 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Dil Ekle</h3>
              <button onClick={() => setShowLangModal(false)} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors p-1.5 rounded-full"><X size={18}/></button>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Dil</label>
                <input type="text" autoFocus onKeyDown={e => e.key === 'Enter' && addLanguage()} value={tempLang.name} onChange={e => setTempLang({...tempLang, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm" placeholder="Örn: İngilizce" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Seviye</label>
                <select value={tempLang.level} onChange={e => setTempLang({...tempLang, level: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm appearance-none">
                  <option>Başlangıç (A1-A2)</option><option>Orta (B1-B2)</option><option>İleri (C1-C2)</option><option>Anadil</option>
                </select>
              </div>
              <button onClick={addLanguage} className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-red-700 transition-all shadow-md">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

      {showCertModal && (
        <div className="fixed inset-0 bg-red-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up transform transition-all">
            <div className="px-6 py-5 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">Sertifika Ekle</h3>
              <button onClick={() => setShowCertModal(false)} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors p-1.5 rounded-full"><X size={18}/></button>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Sertifika Adı</label>
                <input type="text" autoFocus onKeyDown={e => e.key === 'Enter' && addCert()} value={tempCert.name} onChange={e => setTempCert({...tempCert, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm" placeholder="Örn: Dijital Pazarlama Eğitimi" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Veren Kurum</label>
                <input type="text" onKeyDown={e => e.key === 'Enter' && addCert()} value={tempCert.issuer} onChange={e => setTempCert({...tempCert, issuer: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm" placeholder="Örn: Google" />
              </div>
              <button onClick={addCert} className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl mt-2 hover:bg-indigo-700 transition-all shadow-md">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
