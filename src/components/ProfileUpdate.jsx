import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, BookOpen, Layers, Briefcase, FileText, Shield, CheckCircle2, AlertCircle, Building2, Save, Settings, Award, Star, FileCheck, Plus, Trash2, Target } from 'lucide-react';
import Logo from './Logo';
import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU, getDepartmentsByFaculty, getAllFacultyNames } from '../utils/universityData';

export default function ProfileUpdate({ 
  setView, 
  currentUser, setCurrentUser,
  userRole, 
  academicCatalog, 
  academicApprovals, setAcademicApprovals,
  setStudents, setAlumni, setCompanies
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({ ...(currentUser || {}) });
  const [hasChanges, setHasChanges] = useState(false);

  // Dependent dropdown states for Academic Info
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Dependent dropdown states for Double Major
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

  const getTabsByRole = () => {
    if (userRole === 'student') return [
      { id: 'personal', label: 'Kişisel Bilgiler', icon: <User size={18} /> },
      { id: 'academic', label: 'Akademik Bilgiler', icon: <BookOpen size={18} /> },
      { id: 'experience', label: 'İş ve Staj Deneyimi', icon: <Briefcase size={18} /> },
      { id: 'skills', label: 'Yetenekler ve Yabancı Dil', icon: <Star size={18} /> },
      { id: 'certificates', label: 'Sertifika ve Kulüpler', icon: <Award size={18} /> },
      { id: 'cap_yandal', label: 'ÇAP / Yandal', icon: <Layers size={18} /> },
      { id: 'career', label: 'Kariyer Tercihleri', icon: <Target size={18} /> },
      { id: 'privacy', label: 'Gizlilik ve İzinler', icon: <Shield size={18} /> }
    ];
    if (userRole === 'alumni') return [
      { id: 'personal', label: 'Kişisel Bilgiler', icon: <User size={18} /> },
      { id: 'academic', label: 'Mezuniyet Bilgileri', icon: <BookOpen size={18} /> },
      { id: 'experience', label: 'İş ve Staj Deneyimi', icon: <Briefcase size={18} /> },
      { id: 'skills', label: 'Yetenekler ve Yabancı Dil', icon: <Star size={18} /> },
      { id: 'certificates', label: 'Sertifika ve Projeler', icon: <Award size={18} /> },
      { id: 'career', label: 'Kariyer Bilgileri', icon: <Target size={18} /> },
      { id: 'privacy', label: 'Gizlilik ve İzinler', icon: <Shield size={18} /> }
    ];
    if (userRole === 'academic') return [
      { id: 'personal', label: 'Kişisel Bilgiler', icon: <User size={18} /> },
      { id: 'academic', label: 'Akademik Bilgiler', icon: <BookOpen size={18} /> },
      { id: 'privacy', label: 'Gizlilik ve İzinler', icon: <Shield size={18} /> }
    ];
    if (userRole === 'company') return [
      { id: 'personal', label: 'Firma Bilgileri', icon: <Building2 size={18} /> },
      { id: 'rep', label: 'Yetkili Kişi', icon: <User size={18} /> },
      { id: 'privacy', label: 'Doğrulama Durumu', icon: <Shield size={18} /> }
    ];
    // Default fallback for admin or other roles (Adminler de test edebilsin diye tam CV görünümü)
    return [
      { id: 'personal', label: 'Kişisel Bilgiler', icon: <User size={18} /> },
      { id: 'academic', label: 'Akademik Bilgiler', icon: <BookOpen size={18} /> },
      { id: 'experience', label: 'İş ve Staj Deneyimi', icon: <Briefcase size={18} /> },
      { id: 'skills', label: 'Yetenekler ve Yabancı Dil', icon: <Star size={18} /> },
      { id: 'certificates', label: 'Sertifika ve Kulüpler', icon: <Award size={18} /> },
      { id: 'cap_yandal', label: 'ÇAP / Yandal', icon: <Layers size={18} /> },
      { id: 'career', label: 'Kariyer Tercihleri', icon: <Target size={18} /> },
      { id: 'privacy', label: 'Gizlilik ve İzinler', icon: <Shield size={18} /> }
    ];
  };

  const tabs = getTabsByRole();

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // If sensitive fields changed, generate an approval request
    // For this simulation, we just update currentUser directly and show a success message
    if (hasChanges) {
      setCurrentUser(formData);
      
      // Update global registry based on role so it persists to localStorage
      if (userRole === 'student' && setStudents) {
        setStudents(prev => (prev || []).map(s => s.id === formData.id ? formData : s));
      } else if (userRole === 'alumni' && setAlumni) {
        setAlumni(prev => (prev || []).map(a => a.id === formData.id ? formData : a));
      } else if (userRole === 'company' && setCompanies) {
        setCompanies(prev => (prev || []).map(c => c.id === formData.id ? formData : c));
      }

      setHasChanges(false);
      alert('Değişiklikleriniz başarıyla kaydedildi. Akademik alanlardaki değişiklikleriniz yönetici onayına gönderilmiştir.');
      
      // Simulate adding to academicApprovals if academic fields changed
      // In a real app, we'd check if specific fields changed compared to initial state.
      const newApproval = {
        id: `APP-${Date.now()}`,
        userId: currentUser.id,
        userName: formData.name,
        userType: userRole,
        fieldChanged: 'Profil Güncellemesi',
        oldValue: 'Eski Değer',
        newValue: 'Yeni Değer',
        submittedDate: new Date().toISOString().split('T')[0],
        status: 'Beklemede',
        adminNote: ''
      };
      setAcademicApprovals([newApproval, ...academicApprovals]);
    }
  };

  // Gerçek İESÜ fakülte verileri — academicCatalog yoksa fallback olarak kullanılır
  const allUnits = [...IESU_FACULTIES, ...IESU_MYO, ...IESU_YUKSEKOKUL, ...IESU_ENSTITU];
  const hasCatalog = (academicCatalog || []).filter(f => f.status === 'Aktif').length > 0;
  const activeFaculties = hasCatalog 
    ? (academicCatalog || []).filter(f => f.status === 'Aktif') 
    : allUnits.map((u, i) => ({ id: `fac-${i}`, name: u.name, status: 'Aktif', departments: u.departments.map((d, j) => ({ id: `dept-${i}-${j}`, name: d, status: 'Aktif', programs: [{ id: `prog-${i}-${j}`, name: d, level: 'Lisans', status: 'Aktif' }] })) }));
  const availableDepts = selectedFaculty ? (activeFaculties.find(f => f.id === selectedFaculty)?.departments || []).filter(d => d.status === 'Aktif') : [];
  const availablePrograms = selectedDept ? (availableDepts.find(d => d.id === selectedDept)?.programs || []).filter(p => p.status === 'Aktif') : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : userRole === 'employer' ? 'company' : userRole || 'landing')}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-iesu-red" />
            <h1 className="text-lg font-black text-gray-900">Bilgilerimi Güncelle</h1>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            hasChanges ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={16} />
          Değişiklikleri Kaydet
        </button>
      </nav>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 flex gap-8">
        
        {/* Sidebar Tabs */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-24">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8">
            
            {/* PERSONAL TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">Kişisel Bilgiler</h2>
                  <p className="text-sm text-gray-500 mt-1">Sistemdeki temel kimlik ve iletişim bilgileriniz.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5 flex items-center justify-between">
                      <span>Ad Soyad / Firma Adı</span>
                      <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Onaylı</span>
                    </label>
                    <input type="text" value={formData.name || ''} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">E-Posta</label>
                    <input type="email" value={formData.email || ''} onChange={e => handleInputChange('email', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Telefon</label>
                    <input type="tel" value={formData.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Şehir</label>
                    <input type="text" value={formData.city || ''} onChange={e => handleInputChange('city', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Doğum Tarihi</label>
                    <input type="date" value={formData.birthDate || ''} onChange={e => handleInputChange('birthDate', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Cinsiyet</label>
                    <select value={formData.gender || ''} onChange={e => handleInputChange('gender', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20">
                      <option value="">Seçiniz</option>
                      <option value="Kadin">Kadın</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Belirtmek Istemiyorum">Belirtmek İstemiyorum</option>
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">LinkedIn Profili</label>
                    <input type="url" placeholder="https://linkedin.com/in/..." value={formData.linkedin || ''} onChange={e => handleInputChange('linkedin', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Kişisel Web Sitesi veya GitHub</label>
                    <input type="url" placeholder="https://..." value={formData.portfolio || ''} onChange={e => handleInputChange('portfolio', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Kısa Özgeçmiş (Bio)</label>
                    <textarea rows="4" value={formData.bio || ''} onChange={e => handleInputChange('bio', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium resize-none focus:ring-2 focus:ring-blue-500/20" placeholder="Kendinizden kısaca bahsedin..."></textarea>
                  </div>
                  
                  <div className="col-span-2 border-t border-gray-100 pt-6 mt-2">
                    <label className="text-sm font-black text-gray-900 block mb-2">Hazır CV Yükle</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <FileText className="mx-auto text-gray-400 mb-3" size={32} />
                      <p className="text-sm font-medium text-gray-700">PDF veya DOCX formatında CV'nizi yüklemek için tıklayın</p>
                      <p className="text-xs text-gray-400 mt-1">Maksimum dosya boyutu: 5MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACADEMIC TAB (For non-companies) */}
            {activeTab === 'academic' && userRole !== 'company' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Akademik Bilgiler</h2>
                    <p className="text-sm text-gray-500 mt-1">Eğitim gördüğünüz veya mezun olduğunuz program bilgileri.</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 text-orange-800 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} /> Bu alandaki değişiklikler yönetici onayına tabidir.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {userRole === 'student' && (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-600 block mb-1.5 flex items-center justify-between">
                        <span>Öğrenci Numarası</span>
                        <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 size={12}/> Onaylı</span>
                      </label>
                      <input type="text" value={formData.studentNo || '2023123456'} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed" />
                    </div>
                  )}
                  {userRole === 'student' && (
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-600 block mb-1.5">Eğitim Düzeyi</label>
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20">
                        <option>Önlisans</option>
                        <option selected>Lisans</option>
                        <option>Yüksek Lisans</option>
                        <option>Doktora</option>
                      </select>
                    </div>
                  )}

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Fakülte / Yüksekokul</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20"
                      value={selectedFaculty}
                      onChange={(e) => { setSelectedFaculty(e.target.value); setSelectedDept(''); handleInputChange('faculty', e.target.value); }}
                    >
                      <option value="">Seçiniz</option>
                      {activeFaculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Bölüm</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      value={selectedDept}
                      onChange={(e) => { setSelectedDept(e.target.value); handleInputChange('department', e.target.value); }}
                      disabled={!selectedFaculty}
                    >
                      <option value="">Seçiniz</option>
                      {availableDepts.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Program</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={!selectedDept}
                      onChange={e => handleInputChange('program', e.target.value)}
                    >
                      <option value="">Seçiniz</option>
                      {availablePrograms.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.level})</option>
                      ))}
                    </select>
                  </div>

                  {(userRole === 'student' || userRole === 'alumni') && (
                    <>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-gray-600 block mb-1.5">Sınıf / Yıl</label>
                        <select onChange={e => handleInputChange('year', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20">
                          <option>Hazırlık</option>
                          <option>1. Sınıf</option>
                          <option>2. Sınıf</option>
                          <option>3. Sınıf</option>
                          <option selected>4. Sınıf</option>
                          <option>Mezun</option>
                        </select>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-gray-600 block mb-1.5">Genel Not Ortalaması (GNO/CGPA)</label>
                        <input type="number" step="0.01" min="0" max="4" placeholder="Örn: 3.25" value={formData.gpa || ''} onChange={e => handleInputChange('gpa', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-600 block mb-1.5">Mezun Olunan Lise</label>
                        <input type="text" placeholder="Lise adını giriniz..." value={formData.highSchool || ''} onChange={e => handleInputChange('highSchool', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* DENEYİM TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">İş ve Staj Deneyimleri</h2>
                    <p className="text-sm text-gray-500 mt-1">Geçmiş iş tecrübelerinizi ve stajlarınızı ekleyerek profilinizi güçlendirin.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                    <Plus size={16} /> Deneyim Ekle
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <Briefcase className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-500 font-medium">Henüz bir deneyim eklemediniz.</p>
                </div>
              </div>
            )}

            {/* YETENEKLER TAB */}
            {activeTab === 'skills' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Yetenekler ve Yabancı Dil</h2>
                    <p className="text-sm text-gray-500 mt-1">Yabancı dil seviyenizi ve teknik yeteneklerinizi (Örn: Excel, Python, SEO) belirtin.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">Yabancı Diller</h3>
                      <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Dil Ekle</button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                      <p className="text-gray-500 font-medium text-sm">Yabancı dil eklenmemiş.</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800">Teknik Yetenekler</h3>
                      <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Yetenek Ekle</button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                      <p className="text-gray-500 font-medium text-sm">Yetenek eklenmemiş.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SERTİFİKA TAB */}
            {activeTab === 'certificates' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Sertifikalar ve Kulüpler</h2>
                    <p className="text-sm text-gray-500 mt-1">Katıldığınız eğitimler, sertifika programları ve aktif rol aldığınız kulüpler.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                    <Plus size={16} /> Belge/Kulüp Ekle
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <Award className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-500 font-medium">Henüz bir sertifika veya kulüp bilgisi eklemediniz.</p>
                </div>
              </div>
            )}

            {/* ÇAP / YANDAL TAB */}
            {activeTab === 'cap_yandal' && userRole !== 'company' && userRole !== 'academic' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">Çift Anadal (ÇAP) ve Yandal</h2>
                  <p className="text-sm text-gray-500 mt-1">Eğer ÇAP veya Yandal yapıyorsanız resmi bilgilerinizi buradan güncelleyebilirsiniz.</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">ÇAP (Çift Anadal) Bilgileri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                        <span className="text-sm font-bold text-gray-700">Çift Anadal (ÇAP) Yapıyorum</span>
                      </label>
                    </div>
                    {/* Dependent dropdowns for double major would go here similarly */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-600 block mb-1.5">ÇAP Fakültesi</label>
                      <select 
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20"
                        value={selectedCapFaculty}
                        onChange={(e) => { setSelectedCapFaculty(e.target.value); setSelectedCapDept(''); handleInputChange('capFaculty', e.target.value); }}
                      >
                        <option value="">Seçiniz</option>
                        {activeFaculties.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-600 block mb-1.5">ÇAP Programı</label>
                      <select 
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        value={selectedCapDept}
                        onChange={(e) => { setSelectedCapDept(e.target.value); handleInputChange('capDepartment', e.target.value); }}
                        disabled={!selectedCapFaculty}
                      >
                        <option value="">Seçiniz</option>
                        {selectedCapFaculty && (activeFaculties.find(f => f.id === selectedCapFaculty)?.departments || []).filter(d => d.status === 'Aktif').map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COMPANY SPECIFIC TAB */}
            {activeTab === 'personal' && userRole === 'company' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">Firma Bilgileri</h2>
                  <p className="text-sm text-gray-500 mt-1">Kurumsal profil bilgileriniz.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Firma Unvanı</label>
                    <input type="text" value={formData.name || ''} onChange={e => handleInputChange('name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Sektör</label>
                    <input type="text" value={formData.sector || ''} onChange={e => handleInputChange('sector', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Web Sitesi</label>
                    <input type="url" placeholder="https://" onChange={e => handleInputChange('website', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
              </div>
            )}

            {/* KARİYER TERCİHLERİ TAB */}
            {activeTab === 'career' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">Kariyer Tercihleri</h2>
                  <p className="text-sm text-gray-500 mt-1">İş ve staj arayışınızla ilgili beklentilerinizi firmalarla paylaşın.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-600 block mb-3">Çalışma Şekli Tercihleri (Birden fazla seçilebilir)</label>
                    <div className="flex flex-wrap gap-3">
                      {['Tam Zamanlı', 'Yarı Zamanlı', 'Proje Bazlı', 'Uzaktan (Remote)', 'Hibrit', 'Staj'].map(type => (
                        <label key={type} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                          <span className="text-sm font-medium text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">Çalışmak İstenilen Şehirler</label>
                    <input type="text" placeholder="Örn: İstanbul, Ankara, İzmir..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs font-bold text-gray-600 block mb-1.5">İlgi Duyulan Sektörler</label>
                    <input type="text" placeholder="Örn: Yazılım, Finans, Sağlık..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                </div>
              </div>
            )}

            {/* GİZLİLİK VE İZİNLER TAB */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-lg font-black text-gray-900">Gizlilik ve İzinler</h2>
                  <p className="text-sm text-gray-500 mt-1">Profilinizin kimler tarafından görüntülenebileceğini ve bildirim tercihlerinizi yönetin.</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                    <div className="mt-0.5"><input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Profil Görünürlüğü (Firmalar)</h4>
                      <p className="text-xs text-gray-500 mt-1">Sistemimize kayıtlı ve doğrulanmış partner firmalar özgeçmişinizi (CV) inceleyebilir ve size iş/staj teklifi sunabilir.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                    <div className="mt-0.5"><input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Yeni Fırsat Bildirimleri (E-Posta & SMS)</h4>
                      <p className="text-xs text-gray-500 mt-1">Bölümünüzle ve kariyer tercihlerinizle eşleşen yeni iş ve staj ilanları yayınlandığında anında haberdar olmak istiyorum.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-100 transition">
                    <div className="mt-0.5"><input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Kariyer Merkezi Bültenleri</h4>
                      <p className="text-xs text-gray-500 mt-1">Kariyer fuarları, eğitimler ve SEM kurslarıyla ilgili periyodik bilgilendirmeler almak istiyorum.</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* OTHERS / FALLBACKS */}
            {['rep'].includes(activeTab) && (
              <div className="py-12 text-center animate-fade-in">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="text-gray-300" size={24} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Bu Alan Hazırlanıyor</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                  Bu sekmedeki güncellemeler yakında aktifleştirilecektir. Diğer sekmelerdeki işlemlerinize devam edebilirsiniz.
                </p>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
