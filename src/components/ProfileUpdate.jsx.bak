import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, User, BookOpen, Layers, Briefcase, FileText, Shield, CheckCircle2, AlertCircle, Building2, Save, Settings, Award, Star, FileCheck, Plus, Trash2, Target, UploadCloud, ChevronRight, Check, UserCircle2, X } from 'lucide-react';
import Logo from './Logo';
import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU } from '../utils/universityData';

export default function ProfileUpdate({ 
  setView, 
  currentUser, setCurrentUser,
  userRole, 
  academicCatalog, 
  academicApprovals, setAcademicApprovals,
  setStudents, setAlumni, setCompanies
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({ 
    skills: [],
    languages: [],
    experiences: [],
    certificates: [],
    careerPreferences: [],
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
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCapFaculty, setSelectedCapFaculty] = useState('');
  const [selectedCapDept, setSelectedCapDept] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.faculty) setSelectedFaculty(currentUser.faculty);
      if (currentUser.department) setSelectedDept(currentUser.department);
      if (currentUser.capFaculty) setSelectedCapFaculty(currentUser.capFaculty);
      if (currentUser.capDept) setSelectedCapDept(currentUser.capDept);
    }
  }, [currentUser]);

  // Profile Completeness Calculation
  const completeness = useMemo(() => {
    let score = 0;
    let total = 0;
    const checkField = (val) => { total++; if (val && val.toString().trim() !== '') score++; };
    const checkArray = (arr) => { total++; if (arr && arr.length > 0) score++; };

    checkField(formData.email);
    checkField(formData.phone);
    checkField(formData.city);
    checkField(formData.bio);
    if (userRole === 'student' || userRole === 'alumni') {
      checkField(formData.faculty);
      checkField(formData.department);
      checkField(formData.gpa);
      checkArray(formData.skills);
      checkArray(formData.languages);
      checkArray(formData.experiences);
      checkArray(formData.careerPreferences);
    }
    
    return total === 0 ? 0 : Math.round((score / total) * 100);
  }, [formData, userRole]);

  const tabs = useMemo(() => {
    if (userRole === 'company') return [
      { id: 'personal', label: 'Firma Bilgileri', icon: <Building2 size={18} /> },
      { id: 'rep', label: 'Yetkili Kişi', icon: <User size={18} /> },
      { id: 'privacy', label: 'Doğrulama Durumu', icon: <Shield size={18} /> }
    ];
    return [
      { id: 'personal', label: 'Kişisel Bilgiler', icon: <User size={18} /> },
      { id: 'academic', label: 'Akademik Bilgiler', icon: <BookOpen size={18} /> },
      { id: 'experience', label: 'İş ve Staj Deneyimi', icon: <Briefcase size={18} /> },
      { id: 'skills', label: 'Yetenekler ve Diller', icon: <Star size={18} /> },
      { id: 'certificates', label: 'Sertifika ve Kulüpler', icon: <Award size={18} /> },
      { id: 'cap_yandal', label: 'ÇAP / Yandal', icon: <Layers size={18} /> },
      { id: 'career', label: 'Kariyer Tercihleri', icon: <Target size={18} /> },
      { id: 'privacy', label: 'Gizlilik ve İzinler', icon: <Shield size={18} /> }
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
      setCurrentUser(formData);
      if (userRole === 'student' && setStudents) setStudents(prev => (prev || []).map(s => s.id === formData.id ? formData : s));
      else if (userRole === 'alumni' && setAlumni) setAlumni(prev => (prev || []).map(a => a.id === formData.id ? formData : a));
      else if ((userRole === 'company' || userRole === 'employer') && setCompanies) setCompanies(prev => (prev || []).map(c => c.id === formData.id ? formData : c));
      else if (userRole === 'academic' && setAcademicStaff) setAcademicStaff(prev => (prev || []).map(a => a.id === formData.id ? formData : a));

      setHasChanges(false);
      window.toast.success('Profiliniz başarıyla güncellendi.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setHasChanges(true);
      window.toast.success('CV dosyası belleğe alındı, kaydet butonuna basmayı unutmayın.');
    }
  };

  // Add Item Handlers
  const addExperience = () => {
    if (tempExp.title && tempExp.company) {
      handleInputChange('experiences', [...(formData.experiences || []), { id: Date.now(), ...tempExp }]);
      setShowExpModal(false);
      setTempExp({ title: '', company: '', type: 'Staj' });
    } else {
      window.toast.error('Lütfen ünvan ve firma alanlarını doldurun.');
    }
  };

  const addSkill = () => {
    if (tempSkill) {
      handleInputChange('skills', [...(formData.skills || []), tempSkill]);
      setShowSkillModal(false);
      setTempSkill('');
    }
  };

  const addLanguage = () => {
    if (tempLang.name) {
      handleInputChange('languages', [...(formData.languages || []), { id: Date.now(), ...tempLang }]);
      setShowLangModal(false);
      setTempLang({ name: '', level: 'Başlangıç (A1-A2)' });
    }
  };

  const addCert = () => {
    if (tempCert.name) {
      handleInputChange('certificates', [...(formData.certificates || []), { id: Date.now(), ...tempCert }]);
      setShowCertModal(false);
      setTempCert({ name: '', issuer: '' });
    }
  };

  const removeItem = (arrayName, indexOrId) => {
    const arr = formData[arrayName] || [];
    const newArr = typeof arr[0] === 'string' ? arr.filter((_, i) => i !== indexOrId) : arr.filter(item => item.id !== indexOrId);
    handleInputChange(arrayName, newArr);
  };

  // Faculty Data
  const allUnits = [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU];
  const activeFaculties = allUnits.map((u, i) => ({ id: `fac-${i}`, name: u.name, status: 'Aktif', departments: u.departments.map((d, j) => ({ id: `dept-${i}-${j}`, name: d, status: 'Aktif', programs: [{ id: `prog-${i}-${j}`, name: d, level: 'Lisans', status: 'Aktif' }] })) }));
  const availableDepts = selectedFaculty ? (activeFaculties.find(f => f.id === selectedFaculty)?.departments || []) : [];

  return (
    <div className="min-h-[100dvh] bg-[#f4f7fb] font-sans flex flex-col relative overflow-x-hidden">
      
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'company' ? 'company' : userRole || 'landing')}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:scale-105 transition shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
              <UserCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-tight">Profil Merkezi</h1>
              <p className="text-xs text-gray-500 font-medium hidden sm:block">Kariyer bilgilerinizi güncel tutun</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md transform ${
            hasChanges ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
          }`}
        >
          <Save size={18} />
          <span className="hidden sm:inline">Değişiklikleri Kaydet</span>
          <span className="sm:hidden">Kaydet</span>
        </button>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar & Progress */}
        <aside className="w-full md:w-72 shrink-0 flex flex-col gap-6">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000" style={{ width: `${completeness}%` }}></div>
            </div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <h3 className="font-bold text-gray-900">Profil Doluluğu</h3>
              <span className={`text-sm font-black ${completeness === 100 ? 'text-green-600' : 'text-blue-600'}`}>%{completeness}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Profilinizi %100 doldurarak iş bulma şansınızı artırın.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-3xl p-3 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-28">
            <nav className="space-y-1.5">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </div>
                    {isActive && <ChevronRight size={16} className="text-blue-500" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 min-h-[600px]">
            
            {/* PERSONAL TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-black text-gray-900">Kişisel Bilgiler</h2>
                  <p className="text-sm text-gray-500 mt-1">Sistemdeki temel kimlik ve iletişim bilgileriniz.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center justify-between">
                      <span>Ad Soyad</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-md flex items-center gap-1"><CheckCircle2 size={12}/> Resmi Kayıt</span>
                    </label>
                    <input type="text" value={formData.name || ''} readOnly className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-bold text-gray-500 cursor-not-allowed" />
                  </div>

                  {userRole !== 'company' && (
                    <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Zamir (Pronoun)</label>
                        <select value={formData.pronouns || ''} onChange={e => handleInputChange('pronouns', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-all appearance-none">
                          <option value="">Belirtmek İstemiyorum</option>
                          <option value="she/her">she/her</option>
                          <option value="he/him">he/him</option>
                          <option value="they/them">they/them</option>
                        </select>
                      </div>
                      
                      <div className="relative group flex items-center gap-3">
                        <button type="button" className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
                          <UploadCloud size={18} />
                          İsim Telaffuzu Yükle (Ses)
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">E-Posta</label>
                    <input type="email" value={formData.email || ''} onChange={e => handleInputChange('email', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                  </div>
                  
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Telefon</label>
                    <input type="tel" value={formData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all" />
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Şehir</label>
                    <input type="text" value={formData.city || ''} onChange={e => handleInputChange('city', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all" />
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Doğum Tarihi</label>
                    <input type="date" value={formData.birthDate || ''} onChange={e => handleInputChange('birthDate', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all" />
                  </div>

                  <div className="relative group col-span-1 md:col-span-2 mt-4">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Kısa Özgeçmiş (Bio)</label>
                    <textarea rows="4" value={formData.bio || ''} onChange={e => handleInputChange('bio', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Kendinizden etkileyici bir şekilde bahsedin..."></textarea>
                  </div>

                  {/* CV UPLOAD AREA */}
                  <div className="col-span-1 md:col-span-2 mt-4">
                    <label className="text-sm font-bold text-gray-900 block mb-3">Hazır CV Yükle</label>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${uploadedFileName ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                    >
                      {uploadedFileName ? (
                        <>
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600 shadow-inner">
                            <FileCheck size={32} />
                          </div>
                          <p className="text-base font-bold text-blue-700">{uploadedFileName}</p>
                          <p className="text-sm text-blue-500 mt-1">Değiştirmek için tıklayın</p>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-50 rounded-full flex items-center justify-center mb-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                            <UploadCloud size={32} />
                          </div>
                          <p className="text-base font-bold text-gray-700">PDF veya DOCX formatında CV'nizi seçin</p>
                          <p className="text-sm text-gray-400 mt-1">veya sürükleyip bırakın (Max 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ACADEMIC TAB */}
            {activeTab === 'academic' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Akademik Bilgiler</h2>
                    <p className="text-sm text-gray-500 mt-1">Eğitim bilgilerinizi eksiksiz doldurun.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Eğitim Düzeyi</label>
                    <select value={formData.educationLevel || ''} onChange={e => handleInputChange('educationLevel', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all appearance-none">
                      <option value="">Seçiniz</option>
                      <option value="Önlisans">Önlisans</option>
                      <option value="Lisans">Lisans</option>
                      <option value="Yüksek Lisans">Yüksek Lisans</option>
                    </select>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Fakülte</label>
                    <select value={selectedFaculty} onChange={(e) => { setSelectedFaculty(e.target.value); setSelectedDept(''); handleInputChange('faculty', e.target.value); }} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all appearance-none">
                      <option value="">Seçiniz</option>
                      {activeFaculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Bölüm</label>
                    <select disabled={!selectedFaculty} value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); handleInputChange('department', e.target.value); }} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 disabled:bg-gray-50 outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Seçiniz</option>
                      {availableDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>

                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Sınıf / Yıl</label>
                    <select value={formData.year || ''} onChange={e => handleInputChange('year', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 outline-none transition-all appearance-none">
                      <option value="">Seçiniz</option>
                      <option>Hazırlık</option>
                      <option>1. Sınıf</option>
                      <option>2. Sınıf</option>
                      <option>3. Sınıf</option>
                      <option>4. Sınıf</option>
                      <option>Mezun</option>
                    </select>
                  </div>

                  <div className="relative group md:col-span-2">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">Genel Not Ortalaması (GNO)</label>
                    <input type="number" step="0.01" max="4" min="0" placeholder="Örn: 3.25" value={formData.gpa || ''} onChange={e => handleInputChange('gpa', e.target.value)} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 hover:border-gray-300 focus:border-blue-500 outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Deneyimler</h2>
                    <p className="text-sm text-gray-500 mt-1">İş ve staj geçmişiniz.</p>
                  </div>
                  <button onClick={() => setShowExpModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all hover:scale-105">
                    <Plus size={18} strokeWidth={3} /> Ekle
                  </button>
                </div>

                {formData.experiences?.length > 0 ? (
                  <div className="space-y-4">
                    {formData.experiences.map((exp) => (
                      <div key={exp.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex justify-between items-center hover:border-blue-300 transition-colors">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{exp.title}</h4>
                            <p className="text-gray-500 text-sm">{exp.company} • <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs ml-1">{exp.type}</span></p>
                          </div>
                        </div>
                        <button onClick={() => removeItem('experiences', exp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Briefcase size={36} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Henüz deneyim eklemediniz</h3>
                    <p className="text-gray-500 text-sm">Staj ve iş tecrübelerinizi ekleyerek öne çıkın.</p>
                  </div>
                )}
              </div>
            )}

            {/* SKILLS & LANGUAGES TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-10 animate-fade-in">
                {/* Languages Section */}
                <div>
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Yabancı Diller</h2>
                      <p className="text-sm text-gray-500 mt-1">Bildiğiniz dilleri ve seviyelerini ekleyin.</p>
                    </div>
                    <button onClick={() => setShowLangModal(true)} className="flex items-center gap-1.5 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors text-sm border border-blue-100">
                      <Plus size={18} strokeWidth={3} /> Dil Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {formData.languages?.map(lang => (
                      <div key={lang.id} className="bg-white border border-gray-200 pl-4 pr-2 py-2 rounded-xl shadow-sm flex items-center gap-3">
                        <span className="font-bold text-gray-800">{lang.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{lang.level}</span>
                        <button onClick={() => removeItem('languages', lang.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={14}/></button>
                      </div>
                    ))}
                    {(!formData.languages || formData.languages.length === 0) && <p className="text-sm text-gray-400 italic">Kayıtlı dil bulunmuyor.</p>}
                  </div>
                </div>

                {/* Technical Skills Section */}
                <div>
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">Teknik Yetenekler</h2>
                      <p className="text-sm text-gray-500 mt-1">Öne çıkan yeteneklerinizi (Örn: React, SEO, Excel) ekleyin.</p>
                    </div>
                    <button onClick={() => setShowSkillModal(true)} className="flex items-center gap-1.5 text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors text-sm border border-indigo-100">
                      <Plus size={18} strokeWidth={3} /> Yetenek Ekle
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills?.map((skill, idx) => (
                      <div key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-700 pl-4 pr-2 py-2 rounded-xl flex items-center gap-2 font-medium">
                        {skill}
                        <button onClick={() => removeItem('skills', idx)} className="text-indigo-400 hover:text-red-500 transition-colors p-1"><X size={14}/></button>
                      </div>
                    ))}
                    {(!formData.skills || formData.skills.length === 0) && <p className="text-sm text-gray-400 italic">Yetenek eklenmemiş.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* CERTIFICATES TAB */}
            {activeTab === 'certificates' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Sertifika ve Belgeler</h2>
                    <p className="text-sm text-gray-500 mt-1">Sahip olduğunuz sertifikaları ekleyin.</p>
                  </div>
                  <button onClick={() => setShowCertModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all hover:scale-105">
                    <Plus size={18} strokeWidth={3} /> Ekle
                  </button>
                </div>

                {formData.certificates?.length > 0 ? (
                  <div className="space-y-4">
                    {formData.certificates.map((cert) => (
                      <div key={cert.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex justify-between items-center hover:border-blue-300 transition-colors">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Award size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{cert.name}</h4>
                            <p className="text-gray-500 text-sm">Veren Kurum: <span className="font-medium text-gray-700">{cert.issuer}</span></p>
                          </div>
                        </div>
                        <button onClick={() => removeItem('certificates', cert.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center bg-gray-50/50">
                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Award size={36} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Henüz sertifika eklemediniz</h3>
                    <p className="text-gray-500 text-sm">Eğitimlerinizi ve başarı belgelerinizi buraya ekleyin.</p>
                  </div>
                )}
              </div>
            )}

            {/* CAREER PREFERENCES TAB */}
            {activeTab === 'career' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-black text-gray-900">Kariyer Tercihleri</h2>
                  <p className="text-sm text-gray-500 mt-1">İş ve staj arayışınızla ilgili beklentilerinizi firmalarla paylaşın.</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-900 block mb-4">Çalışma Şekli (Birden fazla seçilebilir)</label>
                  <div className="flex flex-wrap gap-3">
                    {['Tam Zamanlı', 'Yarı Zamanlı', 'Proje Bazlı', 'Uzaktan (Remote)', 'Hibrit', 'Staj'].map(type => {
                      const isSelected = formData.careerPreferences?.includes(type);
                      return (
                        <button 
                          key={type} 
                          onClick={() => toggleArrayItem('careerPreferences', type)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all border-2 ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50'}`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'}`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-black text-gray-900">Gizlilik ve İzinler</h2>
                  <p className="text-sm text-gray-500 mt-1">Hesap görünürlüğünüzü ve bildirim tercihlerinizi yönetin.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'visibility', title: 'Profil Görünürlüğü', desc: 'Firmalar profilimi inceleyebilir.' },
                    { key: 'emailNotifications', title: 'Fırsat Bildirimleri', desc: 'Bana uygun iş ilanlarında e-posta gönder.' },
                    { key: 'newsletters', title: 'Kariyer Bültenleri', desc: 'Etkinlik ve seminerlerden haberdar et.' }
                  ].map(setting => (
                    <div key={setting.key} className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer" onClick={() => handleNestedChange('privacySettings', setting.key, !formData.privacySettings?.[setting.key])}>
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors mt-0.5 ${formData.privacySettings?.[setting.key] ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'}`}>
                        {formData.privacySettings?.[setting.key] && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-base">{setting.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{setting.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ÇAP TAB */}
            {activeTab === 'cap_yandal' && (
              <div className="space-y-8 animate-fade-in">
                <div className="border-b border-gray-100 pb-5">
                  <h2 className="text-2xl font-black text-gray-900">Çift Anadal (ÇAP)</h2>
                  <p className="text-sm text-gray-500 mt-1">ÇAP yapıyorsanız lütfen bu alanı işaretleyip bilgileri doldurun.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-6 cursor-pointer" onClick={() => handleInputChange('isDoubleMajor', !formData.isDoubleMajor)}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${formData.isDoubleMajor ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 border-2 border-gray-300'}`}>
                      {formData.isDoubleMajor && <Check size={18} strokeWidth={3} />}
                    </div>
                    <span className="text-lg font-black text-gray-900">Çift Anadal (ÇAP) Yapıyorum</span>
                  </div>

                  {formData.isDoubleMajor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 animate-slide-up mt-2">
                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">ÇAP Fakültesi</label>
                        <select value={selectedCapFaculty} onChange={(e) => { setSelectedCapFaculty(e.target.value); handleInputChange('capFaculty', e.target.value); }} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 outline-none appearance-none focus:border-blue-500">
                          <option value="">Seçiniz</option>
                          {activeFaculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>
                      <div className="relative group">
                        <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600 transition-all">ÇAP Bölümü</label>
                        <input type="text" placeholder="Bölüm adını yazın..." onChange={(e) => handleInputChange('capDept', e.target.value)} value={formData.capDept || ''} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* OTHERS / FALLBACKS */}
            {['rep'].includes(activeTab) && (
              <div className="py-8 animate-fade-in flex flex-col h-full min-h-[400px]">
                <h3 className="text-xl font-black text-gray-900 mb-6">Topluluk Temsilciliği / Gönüllülük</h3>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-8">
                  <p className="text-blue-800 text-sm font-medium leading-relaxed">Topluluk Temsilcisi veya Öğrenci Elçisi olarak üniversitemizi ve bölümünüzü temsil edebilirsiniz. Başvurunuz kariyer ofisimiz tarafından değerlendirilecektir.</p>
                </div>
                
                <div className="space-y-6 max-w-2xl">
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Başvurulan Rol</label>
                    <select className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 appearance-none">
                      <option>Öğrenci Elçisi</option>
                      <option>Bölüm Temsilcisi</option>
                      <option>Kariyer Kulübü Yöneticisi</option>
                    </select>
                  </div>
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Neden Temsilci Olmak İstiyorsunuz?</label>
                    <textarea rows="4" className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-500 resize-none" placeholder="Motivasyonunuzu kısaca açıklayın..."></textarea>
                  </div>
                  <button onClick={() => window.toast.success("Temsilcilik başvurunuz Kariyer Ofisine iletildi!")} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">Başvuruyu Gönder</button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* --- MODALS --- */}
      {/* Experience Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><Briefcase size={22} className="text-blue-600"/> Deneyim Ekle</h3>
              <button onClick={() => setShowExpModal(false)} className="text-gray-400 hover:text-gray-900 transition bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Ünvan / Pozisyon</label>
                <input type="text" value={tempExp.title} onChange={e => setTempExp({...tempExp, title: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Örn: Yazılım Stajyeri" />
              </div>
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Firma / Kurum</label>
                <input type="text" value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Örn: İESÜ Kariyer" />
              </div>
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Çalışma Tipi</label>
                <select value={tempExp.type} onChange={e => setTempExp({...tempExp, type: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500 appearance-none">
                  <option>Staj</option><option>Tam Zamanlı</option><option>Yarı Zamanlı</option>
                </select>
              </div>
              <button onClick={addExperience} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mt-4 hover:bg-blue-700 transition-colors shadow-md">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><Star size={22} className="text-indigo-600"/> Yetenek Ekle</h3>
              <button onClick={() => setShowSkillModal(false)} className="text-gray-400 hover:text-gray-900 transition bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-indigo-600">Yetenek Adı</label>
                <input type="text" autoFocus value={tempSkill} onChange={e => setTempSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-indigo-500" placeholder="Örn: React.js, SEO, Liderlik" />
              </div>
              <button onClick={addSkill} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-md">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Yabancı Dil Ekle</h3>
              <button onClick={() => setShowLangModal(false)} className="text-gray-400 hover:text-gray-900 transition bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Dil Adı</label>
                <input type="text" autoFocus value={tempLang.name} onChange={e => setTempLang({...tempLang, name: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Örn: İngilizce" />
              </div>
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Seviye</label>
                <select value={tempLang.level} onChange={e => setTempLang({...tempLang, level: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500 appearance-none">
                  <option>Başlangıç (A1-A2)</option><option>Orta (B1-B2)</option><option>İleri (C1-C2)</option><option>Anadil</option>
                </select>
              </div>
              <button onClick={addLanguage} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-md">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900">Sertifika Ekle</h3>
              <button onClick={() => setShowCertModal(false)} className="text-gray-400 hover:text-gray-900 transition bg-white p-2 rounded-full shadow-sm"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Sertifika / Eğitim Adı</label>
                <input type="text" autoFocus value={tempCert.name} onChange={e => setTempCert({...tempCert, name: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Örn: Dijital Pazarlama Eğitimi" />
              </div>
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 bg-white px-2 text-[11px] font-bold text-blue-600">Veren Kurum</label>
                <input type="text" value={tempCert.issuer} onChange={e => setTempCert({...tempCert, issuer: e.target.value})} className="w-full bg-transparent border-2 border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-blue-500" placeholder="Örn: Google" />
              </div>
              <button onClick={addCert} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-md">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
