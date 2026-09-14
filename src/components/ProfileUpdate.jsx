import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, User, BookOpen, Layers, Briefcase, FileText, Shield, Building2, 
  Save, Settings, Award, Star, Plus, Trash2, Target, UploadCloud, ChevronRight, 
  UserCircle2, X, Camera, MapPin, Mail, Phone, Globe, Link, GraduationCap, 
  Clock, Compass, CheckCircle2, CheckCircle, HelpCircle, Send, Home, Sparkles, Search
} from 'lucide-react';
import { IESU_FACULTIES, IESU_MYO, IESU_YUKSEKOKUL, IESU_ENSTITU } from '../utils/universityData';
import useAppStore from '../store/useAppStore';
import AICVBuilder from './AICVBuilder';
import Logo from './Logo';
import SafeAvatar from './shared/SafeAvatar';
import AdminOmniDock from './AdminOmniDock';
import { SUPPORTED_COUNTRIES, geocodeLocation } from '../utils/alumniGeoData';

export const BRANCH_CONFIGS = {
  alumni: {
    name: 'Mezun Portalı',
    subHeader: 'İESÜ Mezunlar Portalı • Mezun Bilgi Sistemi (MBS)',
    badgeLabel: 'MEZUN PORTALI (BİLGİLERİMİ DÜZENLE)',
    badgeGradient: 'from-emerald-700 via-teal-700 to-emerald-800',
    badgeBorder: 'border-emerald-300/50',
    badgePulse: 'bg-emerald-300',
    logoColor: 'emerald',
    logoTextClass: 'text-emerald-800',
    themeColor: '#047857',
    primaryBg: 'bg-emerald-700 hover:bg-emerald-800',
    primaryBorder: 'border-emerald-700',
    primaryFocusRing: 'focus:ring-emerald-500/20 focus:border-emerald-600',
    accentBgLight: 'bg-gradient-to-r from-emerald-50/70 via-white to-slate-50',
    accentBorderLight: 'border-emerald-200',
    accentText: 'text-emerald-700',
    tabActiveStyle: 'bg-emerald-700 text-white shadow-sm shadow-emerald-950/20',
    pillText: '🎓 Mezun Bilgi Sistemi (MBS)',
    pillStyle: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    subText: 'Mezuniyet bilgilerinizi, 12 soruluk kariyer anketinizi, mevcut çalıştığınız kurumu ve mentörlük tercihlerinizi MBS üzerinden yönetin.',
    backView: 'alumni',
    backLabel: 'Mezun Portalı',
  },
  student: {
    name: 'Öğrenci Portalı',
    subHeader: 'Kariyer Geliştirme Merkezi • Öğrenci Bilgi Sistemi',
    badgeLabel: 'ÖĞRENCİ PORTALI (BİLGİLERİMİ DÜZENLE)',
    badgeGradient: 'from-red-900 via-[#990000] to-red-700',
    badgeBorder: 'border-red-400/40',
    badgePulse: 'bg-amber-400',
    logoColor: 'red',
    logoTextClass: 'text-[#990000]',
    themeColor: '#990000',
    primaryBg: 'bg-[#990000] hover:bg-red-800',
    primaryBorder: 'border-[#990000]',
    primaryFocusRing: 'focus:ring-red-500/20 focus:border-red-600',
    accentBgLight: 'bg-gradient-to-r from-red-50/70 via-white to-slate-50',
    accentBorderLight: 'border-red-100',
    accentText: 'text-[#990000]',
    tabActiveStyle: 'bg-[#990000] text-white shadow-sm shadow-red-950/20',
    pillText: '🎓 Öğrenci Bilgi Düzenleme Paneli',
    pillStyle: 'bg-red-50 text-[#990000] border border-red-200',
    subText: 'Öğrenci bilgilerinizi, yeteneklerinizi ve akademik geçmişinizi güncelleyerek özgeçmişinizi güçlendirin.',
    backView: 'student',
    backLabel: 'Öğrenci Portalı',
  },
  academic: {
    name: 'Akademik Portal',
    subHeader: 'Akademik Kadro & Araştırma Bilgi Portalı',
    badgeLabel: 'AKADEMİK PORTAL (KADRO BİLGİLERİ)',
    badgeGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    badgeBorder: 'border-purple-400/40',
    badgePulse: 'bg-cyan-400',
    logoColor: 'indigo',
    logoTextClass: 'text-indigo-900',
    themeColor: '#4C1D95',
    primaryBg: 'bg-indigo-800 hover:bg-indigo-900',
    primaryBorder: 'border-indigo-800',
    primaryFocusRing: 'focus:ring-purple-500/20 focus:border-purple-600',
    accentBgLight: 'bg-gradient-to-r from-indigo-50/70 via-white to-slate-50',
    accentBorderLight: 'border-indigo-200',
    accentText: 'text-indigo-800',
    tabActiveStyle: 'bg-indigo-800 text-white shadow-sm shadow-purple-950/20',
    pillText: '🏫 Akademik Kadro Düzenleme Paneli',
    pillStyle: 'bg-purple-50 text-purple-900 border border-purple-200',
    subText: 'Üniversite bünyesindeki akademik unvanınızı, idari görevlerinizi, yürüttüğünüz dersleri ve ofis saatlerinizi yönetin.',
    backView: 'academic',
    backLabel: 'Akademik Portal',
  },
  company: {
    name: 'Firma Portalı',
    subHeader: 'Kurumsal İnsan Kaynakları & İşveren Portalı',
    badgeLabel: 'FİRMA PORTALI (ŞİRKET BİLGİLERİ)',
    badgeGradient: 'from-blue-950 via-indigo-900 to-sky-900',
    badgeBorder: 'border-sky-400/40',
    badgePulse: 'bg-emerald-400',
    logoColor: 'blue',
    logoTextClass: 'text-blue-900',
    themeColor: '#0A2342',
    primaryBg: 'bg-blue-900 hover:bg-blue-950',
    primaryBorder: 'border-blue-900',
    primaryFocusRing: 'focus:ring-blue-500/20 focus:border-blue-600',
    accentBgLight: 'bg-gradient-to-r from-blue-50/70 via-white to-slate-50',
    accentBorderLight: 'border-blue-200',
    accentText: 'text-blue-900',
    tabActiveStyle: 'bg-blue-900 text-white shadow-sm shadow-blue-950/20',
    pillText: '🏢 Kurumsal Firma Profil Yönetimi',
    pillStyle: 'bg-blue-50 text-blue-900 border border-blue-200',
    subText: 'Firma kurumsal bilgilerinizi, yetkili İK iletişim detaylarını ve stajyer/istihdam tercihlerinizi yönetin.',
    backView: 'company',
    backLabel: 'Firma Portalı',
  },
  admin: {
    name: 'Süper Admin',
    subHeader: 'Kariyer Geliştirme Merkezi • Üst Yönetici Konsolu',
    badgeLabel: 'SÜPER ADMİN PORTALI (YÖNETİCİ BİLGİLERİ)',
    badgeGradient: 'from-amber-900 via-stone-900 to-amber-950',
    badgeBorder: 'border-amber-400/60',
    badgePulse: 'bg-amber-300',
    logoColor: 'amber',
    logoTextClass: 'text-amber-900',
    themeColor: '#D97706',
    primaryBg: 'bg-amber-700 hover:bg-amber-800',
    primaryBorder: 'border-amber-700',
    primaryFocusRing: 'focus:ring-amber-500/20 focus:border-amber-600',
    accentBgLight: 'bg-gradient-to-r from-amber-50/70 via-white to-slate-50',
    accentBorderLight: 'border-amber-200',
    accentText: 'text-amber-800',
    tabActiveStyle: 'bg-amber-700 text-white shadow-sm shadow-amber-950/20',
    pillText: '⚡ KGM Süper Yönetici Profil Yönetimi',
    pillStyle: 'bg-amber-50 text-amber-900 border border-amber-200',
    subText: 'Kariyer Geliştirme Merkezi yönetici kimliğinizi, birim bilgilerinizi ve kurumsal iletişim detaylarınızı yapılandırın.',
    backView: 'admin',
    backLabel: 'Yönetici Konsolu',
  }
};

export const ALUMNI_12_QUESTIONS = [
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

export default function ProfileUpdate({ 
  setView, 
  currentUser, setCurrentUser,
  userRole,
  setSelectedUserId
}) {
  const setStudents = useAppStore(state => state.setStudents);
  const setAlumni = useAppStore(state => state.setAlumni);
  const setCompanies = useAppStore(state => state.setCompanies);
  const setAcademicStaff = useAppStore(state => state.setAcademicStaff);
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const previousView = useAppStore(state => state.previousView);

  // Compute effective branch strictly adhering to user's active portal location
  const effectiveBranch = useMemo(() => {
    // 1. If activePortalBranch is set and valid, prioritize it:
    if (activePortalBranch && ['alumni', 'student', 'academic', 'company', 'admin'].includes(activePortalBranch)) {
      return activePortalBranch;
    }

    // 2. Check previousView
    if (['alumni', 'mbs', 'mezun_dernek', 'alumni_assoc_portal', 'alumni_card', 'alumni_dao'].includes(previousView)) return 'alumni';
    if (['academic', 'research_hub', 'academic_onboarding'].includes(previousView)) return 'academic';
    if (['company', 'company_ats', 'create_job'].includes(previousView)) return 'company';
    if (['student', 'feed', 'club_portal', 'student_analytics', 'virtual_fair', 'career_roadmap', 'sem', 'staj'].includes(previousView)) return 'student';
    if (['admin', 'admin_cms', 'yonetim_konsolu', 'admin_console', 'audit_logs'].includes(previousView)) return 'admin';

    // 3. Fallback to userRole or currentUser.role
    const role = userRole || currentUser?.role;
    if (role === 'alumni') return 'alumni';
    if (role === 'academic' || role === 'academic_staff') return 'academic';
    if (role === 'company' || role === 'employer') return 'company';
    if (role === 'admin') return 'admin';

    return 'student';
  }, [activePortalBranch, previousView, userRole, currentUser]);

  const cfg = BRANCH_CONFIGS[effectiveBranch] || BRANCH_CONFIGS.student;

  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({ 
    skills: [], languages: [], experiences: [], certificates: [], careerPreferences: [],
    privacySettings: { visibility: true, emailNotifications: true, newsletters: true },
    isDoubleMajor: false,
    checkupAnswers: {},
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
      setFormData(prev => ({ 
        ...prev, 
        ...currentUser,
        checkupAnswers: currentUser.checkupAnswers || prev.checkupAnswers || {
          1: currentUser.employed !== undefined ? (currentUser.employed ? 'Evet' : 'Hayır') : 'Evet',
          2: currentUser.jobTiming || '0 - 3 Ay İçinde',
          3: currentUser.sector || 'Teknoloji & Yazılım',
          4: currentUser.companyType || 'Özel Şirket',
          5: currentUser.title || currentUser.currentRole || 'Kıdemli Uzman',
          6: 'Evet',
          7: currentUser.city || 'İstanbul / Türkiye',
          8: currentUser.workMode || 'Hibrit',
          9: 'Hayır',
          10: 'Evet',
          11: 'Evet',
          12: currentUser.alumniNotes || ''
        }
      }));
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
    if (formData.attachmentName || formData.checkupAnswers?.[1]) score += 10;
    return Math.min(score, 100);
  }, [formData]);

  const tabs = useMemo(() => {
    if (effectiveBranch === 'company') return [
      { id: 'personal', label: 'Kurumsal Firma Bilgileri', icon: Building2 },
      { id: 'company_preferences', label: 'Stajyer & İstihdam Tercihleri', icon: Target }
    ];
    if (effectiveBranch === 'academic') return [
      { id: 'personal', label: 'Kişisel & İletişim', icon: User },
      { id: 'academic_staff_info', label: 'Dersler, Yayınlar & Ofis Saatleri', icon: BookOpen },
      { id: 'academic', label: 'Üniversite & Unvan', icon: GraduationCap }
    ];
    if (effectiveBranch === 'admin') return [
      { id: 'personal', label: 'Yönetici Kimliği & İletişim', icon: User },
      { id: 'admin_unit', label: 'Birim & Koordinatörlük', icon: Shield },
      { id: 'admin_notifications', label: 'Sistem & Bildirim Tercihleri', icon: Settings }
    ];
    if (effectiveBranch === 'alumni') return [
      { id: 'personal', label: 'Kişisel & İletişim', icon: User },
      { id: 'alumni_education', label: 'Mezuniyet & Eğitim (MBS)', icon: GraduationCap },
      { id: 'alumni_career', label: 'Kariyer & Şirket Bilgileri', icon: Briefcase },
      { id: 'alumni_location', label: 'Küresel Konum & Harita', icon: Globe },
      { id: 'alumni_checkup', label: '12 Soruluk Mezun Kariyer Anketi', icon: Compass },
      { id: 'certificates', label: 'Sertifika & Yetenekler', icon: Award }
    ];

    return [
      { id: 'personal', label: 'Kişisel & Gizlilik', icon: User },
      { id: 'academic', label: 'Akademik Eğitim & ÇAP', icon: GraduationCap },
      { id: 'experience', label: 'Kariyer & Yetenekler', icon: Briefcase },
      { id: 'certificates', label: 'Sertifika & Hedefler', icon: Award },
      { id: 'cvbuilder', label: 'Akıllı CV', icon: FileText }
    ];
  }, [effectiveBranch]);

  useEffect(() => {
    if (!tabs.some(t => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'personal');
    }
  }, [tabs, activeTab]);

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

  const handleCheckupAnswerChange = (qId, value) => {
    setFormData(prev => ({
      ...prev,
      checkupAnswers: {
        ...(prev.checkupAnswers || {}),
        [qId]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = (showToast = true) => {
    if (formData.name && formData.name.trim().length < 2) {
      if (window.toast?.error) window.toast.error('Ad Soyad / Firma Adı alanı en az 2 karakter olmalıdır.');
      else if (window.alert) window.alert('Ad Soyad / Firma Adı alanı en az 2 karakter olmalıdır.');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      if (window.toast?.error) window.toast.error('Lütfen geçerli bir e-posta adresi giriniz.');
      else if (window.alert) window.alert('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    const resolvedCountry = formData.country || 'Türkiye';
    const resolvedCity = formData.city || (formData.checkupAnswers?.[7] ? formData.checkupAnswers[7].split('/')[0].trim() : 'İstanbul');
    const geocoded = geocodeLocation(resolvedCountry, resolvedCity);

    const finalData = { 
      ...currentUser,
      ...formData, 
      faculty: selectedFaculty || formData.faculty, 
      department: selectedDept || formData.department, 
      capFaculty: selectedCapFaculty || formData.capFaculty, 
      capDept: selectedCapDept || formData.capDept,
      country: resolvedCountry,
      city: resolvedCity,
      showOnGlobalMap: formData.showOnGlobalMap !== false,
      coordinates: formData.coordinates || geocoded.coordinates,
      updatedAt: new Date().toISOString()
    };

    // If alumni checkup answers exist, map to standard profile fields
    if (finalData.checkupAnswers) {
      const ca = finalData.checkupAnswers;
      if (ca[1]) finalData.employed = ca[1] === 'Evet';
      if (ca[3]) finalData.sector = ca[3];
      if (ca[4]) finalData.companyType = ca[4];
      if (ca[5]) finalData.title = ca[5];
      ca[7] = `${resolvedCity} / ${resolvedCountry}`;
      finalData.city = resolvedCity;
      finalData.country = resolvedCountry;
      if (ca[8]) finalData.workMode = ca[8];
    }

    if (setCurrentUser) setCurrentUser(finalData);
    const store = useAppStore.getState();
    if (store.setCurrentUser) store.setCurrentUser(finalData);

    // Root store sync by effective branch:
    if (effectiveBranch === 'student' && setStudents) {
      setStudents(prev => (prev || []).map(s => s.id === finalData.id ? { ...s, ...finalData } : s));
    } else if (effectiveBranch === 'alumni' && setAlumni) {
      setAlumni(prev => {
        const list = prev || [];
        const index = list.findIndex(a => a.id === finalData.id || a.email === finalData.email);
        if (index >= 0) {
          const updated = [...list];
          updated[index] = { ...updated[index], ...finalData };
          return updated;
        }
        return [finalData, ...list];
      });
    } else if (effectiveBranch === 'academic' && setAcademicStaff) {
      setAcademicStaff(prev => (prev || []).map(ac => ac.id === finalData.id ? { ...ac, ...finalData } : ac));
    } else if (effectiveBranch === 'company' && setCompanies) {
      setCompanies(prev => (prev || []).map(c => c.id === finalData.id ? { ...c, ...finalData } : c));
    }

    // Cross-sync if finalData.id exists in any pool so Super Admin user pool stays 100% updated:
    if (finalData.id) {
      if (setStudents) setStudents(prev => (prev || []).map(s => s.id === finalData.id ? { ...s, ...finalData } : s));
      if (setAlumni) setAlumni(prev => (prev || []).map(a => a.id === finalData.id ? { ...a, ...finalData } : a));
      if (setAcademicStaff) setAcademicStaff(prev => (prev || []).map(ac => ac.id === finalData.id ? { ...ac, ...finalData } : ac));
      if (setCompanies) setCompanies(prev => (prev || []).map(c => c.id === finalData.id ? { ...c, ...finalData } : c));
    }

    // Store checkup record for CMSAnalytics
    if (effectiveBranch === 'alumni' && finalData.checkupAnswers && store.addCheckupRecord) {
      const ca = finalData.checkupAnswers;
      store.addCheckupRecord({
        id: `CHECKUP-${Date.now()}`,
        userId: finalData.id,
        name: finalData.name,
        graduationYear: finalData.graduationYear || '2024',
        department: finalData.department || 'Mezun',
        employed: ca[1] || 'Evet',
        jobTiming: ca[2] || '0 - 3 Ay İçinde',
        sector: ca[3] || 'Teknoloji',
        companyType: ca[4] || 'Özel Şirket',
        title: ca[5] || 'Uzman',
        relatedToMajor: ca[6] || 'Evet',
        newJobTitleIfNo: ca['6_sub'] || '-',
        city: ca[7] || 'İstanbul',
        workMode: ca[8] || 'Hibrit',
        postgrad: ca[9] || 'Hayır',
        notes: ca[12] || '',
        date: new Date().toLocaleString('tr-TR')
      });
    }

    try {
      localStorage.setItem('iesu_mock_user', JSON.stringify(finalData));
      localStorage.setItem('igu_mock_user', JSON.stringify(finalData));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }

    window.dispatchEvent(new CustomEvent('iesu_user_profile_updated', { detail: finalData }));

    // Firebase Firestore background persistence for authenticated users
    if (finalData?.id && !String(finalData.id).startsWith('mock_')) {
      import('../utils/firebase').then(({ db }) => {
        import('firebase/firestore').then(({ doc, setDoc }) => {
          setDoc(doc(db, 'users', finalData.id), finalData, { merge: true }).catch(() => {});
        }).catch(() => {});
      }).catch(() => {});
    }

    setHasChanges(false);
    if (showToast) {
      if (window.toast?.success) window.toast.success(`✅ ${cfg.name} profil bilgileriniz başarıyla güncellendi!`);
      else if (window.alert) window.alert(`✅ ${cfg.name} profil bilgileriniz başarıyla güncellendi!`);
    }
  };

  const renderSaveActionBar = (canGoToCV = false) => (
    <div className="pt-6 border-t border-gray-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-500">Profil Doluluk:</span>
        <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${completeness}%` }}
          />
        </div>
        <span className="text-xs font-black text-gray-700">%{completeness}</span>
        {hasChanges && (
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
            Kaydedilmemiş Değişiklikler Var
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => handleSave(true)}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl ${cfg.primaryBg} text-white text-xs font-black shadow-md transition-all transform active:scale-95 cursor-pointer`}
        >
          <Save size={15} /> Bilgileri Kaydet
        </button>
        {canGoToCV && effectiveBranch === 'student' && (
          <button
            type="button"
            onClick={() => {
              handleSave(false);
              setActiveTab('cvbuilder');
              if (window.toast?.success) window.toast.success('Bilgileriniz kaydedildi ve Akıllı CV hazırlandı!');
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black shadow-md transition-all transform active:scale-95 cursor-pointer"
          >
            <FileText size={15} /> Akıllı CV'ye Git
          </button>
        )}
      </div>
    </div>
  );

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      handleInputChange('attachmentData', fileUrl);
      handleInputChange('attachmentName', file.name);
      if (window.toast?.success) window.toast.success('CV dosyası eklendi, kaydet butonuna basmayı unutmayın.');
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

  
  const renderAlumniLocationSection = () => (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-[#0A2342] to-slate-950 text-white rounded-3xl border border-cyan-500/30 shadow-xl space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Globe size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-white">Küresel Mezun Haritası & Diaspora Konumu</h4>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider">
                Canlı Harita
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Dünya çapındaki 3.800+ İESÜ mezunu arasında yerinizi alın. Seçtiğiniz ülke ve şehir haritada ışıldayacaktır.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-2xl self-start sm:self-center">
          <label htmlFor="showOnGlobalMap" className="text-xs font-bold text-slate-300 cursor-pointer select-none">
            Haritada Görün
          </label>
          <input 
            type="checkbox" 
            id="showOnGlobalMap" 
            checked={formData.showOnGlobalMap !== false} 
            onChange={(e) => handleInputChange('showOnGlobalMap', e.target.checked)} 
            className="w-4 h-4 text-cyan-500 rounded cursor-pointer accent-cyan-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ülke Seçimi (Bayraklı Dropdown) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
            Ülke (Diaspora Konumu)
          </label>
          <select
            value={formData.country || 'Türkiye'}
            onChange={(e) => {
              const val = e.target.value;
              handleInputChange('country', val);
              const geocoded = geocodeLocation(val, formData.city || '');
              handleInputChange('coordinates', geocoded.coordinates);
            }}
            className="w-full bg-[#0f172a] border border-white/20 rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 cursor-pointer"
          >
            {SUPPORTED_COUNTRIES.map(c => (
              <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Şehir Girişi */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
            Şehir / Bölge
          </label>
          <input 
            type="text" 
            value={formData.city || ''} 
            onChange={(e) => {
              const val = e.target.value;
              handleInputChange('city', val);
              const geocoded = geocodeLocation(formData.country || 'Türkiye', val);
              handleInputChange('coordinates', geocoded.coordinates);
            }} 
            className="w-full bg-[#0f172a] border border-white/20 rounded-2xl px-4 py-3.5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 placeholder:text-slate-500" 
            placeholder="Örn: Berlin, Londra, San Francisco, İstanbul, Dubai, Tokyo..." 
          />
        </div>
      </div>

      {/* Hızlı Şehir Önerileri */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[11px] font-bold text-slate-400">Popüler Merkezler:</span>
        {['İstanbul', 'Berlin', 'Londra', 'San Francisco', 'Dubai', 'Tokyo', 'Amsterdam', 'Zürih'].map(c => (
          <button
            key={c}
            type="button"
            onClick={() => {
              const geocoded = geocodeLocation('', c);
              handleInputChange('city', geocoded.city);
              handleInputChange('country', geocoded.country);
              handleInputChange('coordinates', geocoded.coordinates);
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-cyan-300 transition text-[11px] font-medium"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Canlı Harita Önizleme Rozeti */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <div>
            <p className="text-xs font-bold text-cyan-200">
              📍 Harita Durumu: <strong className="text-white font-black">{formData.city || 'İstanbul'}, {formData.country || 'Türkiye'}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {formData.showOnGlobalMap !== false 
                ? 'Küresel Mezun Haritasında bu konum ışıldayacak ve profiliniz yerel ağda gösterilecek.' 
                : 'Harita görünürlüğü kapalı. Profiliniz küresel haritada gizlenecek.'}
            </p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => {
            handleSave(false);
            setView('global_map');
          }}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-black transition shadow-md shadow-cyan-600/30 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Globe size={14} /> Haritada İncele
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col relative overflow-x-hidden selection:bg-red-500/30 min-h-screen bg-gray-50/50 pb-28">

      {/* FIXED TOP NAVIGATION BAR (RESMİ HEADER NAVBAR) */}
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 z-40 shadow-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          
          {/* LEFT: Logo & Role-Specific Dynamic Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={(e) => {
              e.preventDefault();
              if (hasChanges) handleSave(false);
              setView(cfg.backView);
            }}
            title="Ana Akışa Dönmek İçin Tıklayın"
          >
            <Logo 
              color={cfg.logoColor} 
              className="h-9 w-auto hover:scale-105 transition-transform shrink-0" 
            />
            <div className="text-left">
              <h1 className={`text-[12px] font-black tracking-tight leading-none mb-0.5 ${cfg.logoTextClass}`}>
                İstanbul Esenyurt Üniversitesi
              </h1>
              <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">
                {cfg.subHeader}
              </p>
            </div>
          </div>

          {/* CENTER: Dynamic Colorful Portal Badge Based on Effective Branch */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 pointer-events-none">
            <span className={`px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white bg-gradient-to-r ${cfg.badgeGradient} shadow-md border ${cfg.badgeBorder} flex items-center gap-2`}>
              <span className={`w-2 h-2 rounded-full ${cfg.badgePulse} animate-pulse`}></span>
              {cfg.badgeLabel}
            </span>
          </div>

          {/* RIGHT: Portala Dön (Ana Akış) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (hasChanges) handleSave(false);
                setView(cfg.backView);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition shadow-sm flex items-center gap-1.5 cursor-pointer text-white ${cfg.primaryBg} hover:scale-105 active:scale-95`}
            >
              <ArrowLeft size={14} />
              <span>{cfg.backLabel}na Dön</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 z-10 relative px-4 pt-6">
        
        {/* ÜST YATAY SEKME ŞERİDİ (TOP TAB BAR) */}
        <div className="bg-white rounded-2xl p-2 border border-gray-200/80 shadow-md shadow-gray-200/40 w-full">
          <nav className="flex items-center justify-start sm:justify-between gap-1 overflow-x-auto hide-scrollbar">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon || Layers;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (hasChanges) handleSave(false);
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive 
                      ? cfg.tabActiveStyle 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <TabIcon size={14} className={isActive ? 'text-white' : 'text-gray-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="w-full min-h-[600px] bg-white border border-gray-200/80 rounded-3xl shadow-xl p-6 md:p-10 relative overflow-hidden">
          
          <div className="mb-8 pb-6 border-b border-gray-100/80">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${cfg.pillStyle}`}>
                {cfg.pillText}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {cfg.subText}
            </p>
          </div>

          <div className="animate-fade-in space-y-8">
            
            {/* PERSONAL & PRIVACY TAB */}
            {activeTab === 'personal' && (
              <div className="space-y-8">

                {/* UNIVERSAL PROFIL FOTOĞRAFI YÜKLEME ALANI (TÜM ROLLER İÇİN DINAMIK TEMA) */}
                <div className={`p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-center gap-6 ${cfg.accentBgLight} ${cfg.accentBorderLight}`}>
                  <div className="relative group shrink-0">
                    <SafeAvatar
                      src={formData.avatar || currentUser?.avatar}
                      name={currentUser?.name || 'Kullanıcı'}
                      size="xl"
                      className="border-4 border-white shadow-md group-hover:opacity-90 transition"
                      alt="Profile Avatar"
                    />
                    <label htmlFor="photo-upload-input-universal" className={`absolute bottom-0 right-0 w-8 h-8 rounded-full text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform ${cfg.primaryBg}`}>
                      <Camera size={16} />
                    </label>
                    <input 
                      type="file" 
                      id="photo-upload-input-universal" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const newAvatar = evt.target.result;
                            handleInputChange('avatar', newAvatar);
                            const updatedUser = { ...(currentUser || {}), avatar: newAvatar };
                            if (setCurrentUser) setCurrentUser(updatedUser);
                            localStorage.setItem('iesu_mock_user', JSON.stringify(updatedUser));
                            localStorage.setItem('igu_mock_user', JSON.stringify(updatedUser));
                            if (window.toast?.success) window.toast.success('✅ Profil fotoğrafınız başarıyla yenilendi ve kaydedildi!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="hidden" 
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="text-base font-black text-gray-900">Profil Fotoğrafı & Marka Kimliği</h4>
                    <p className="text-xs text-gray-500 max-w-md">
                      Yüksek çözünürlüklü ve net bir fotoğraf eklemeniz, {cfg.name} üzerindeki profilinizin görünürlüğünü %40 artırır.
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                      <label htmlFor="photo-upload-input-universal" className={`px-3 py-1.5 text-xs font-bold rounded-xl text-white cursor-pointer shadow-xs transition ${cfg.primaryBg}`}>
                        Fotoğraf Değiştir
                      </label>
                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={() => handleInputChange('avatar', '')}
                          className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* TEMEL KİMLİK & İLETİŞİM ALANLARI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                      {effectiveBranch === 'company' ? 'Firma / Kurum Ticari Ünvanı *' : 'Ad Soyad *'}
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.name || ''} 
                        onChange={(e) => handleInputChange('name', e.target.value)} 
                        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                        placeholder={effectiveBranch === 'company' ? 'Örn: Aselsan A.Ş.' : 'Örn: Prof. Dr. Ayşe Yılmaz veya Ahmet Çelik'} 
                        required 
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                      {effectiveBranch === 'company' ? 'Kurumsal İletişim E-Postası *' : 'Resmî / İletişim E-Postası *'}
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={formData.email || ''} 
                        onChange={(e) => handleInputChange('email', e.target.value)} 
                        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                        placeholder="ad.soyad@esenyurt.edu.tr veya info@sirket.com" 
                        required 
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Telefon Numarası</label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        value={formData.phone || ''} 
                        onChange={(e) => handleInputChange('phone', e.target.value)} 
                        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                        placeholder="+90 5XX XXX XX XX" 
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Lokasyon / Şehir</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.city || formData.location || 'İstanbul, Türkiye'} 
                        onChange={(e) => {
                          handleInputChange('city', e.target.value);
                          handleInputChange('location', e.target.value);
                        }} 
                        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                        placeholder="Örn: İstanbul, Türkiye" 
                      />
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">LinkedIn / Web Profili</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        value={formData.linkedin || ''} 
                        onChange={(e) => handleInputChange('linkedin', e.target.value)} 
                        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                        placeholder="https://linkedin.com/in/profil" 
                      />
                      <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                      {effectiveBranch === 'company' ? 'Firma Web Sitesi' : 'Kişisel Portfolyo / GitHub'}
                    </label>
                    <div className="relative">
                      <input 
                        type="url" 
                        value={formData.website || formData.github || ''} 
                        onChange={(e) => {
                          handleInputChange('website', e.target.value);
                          handleInputChange('github', e.target.value);
                        }} 
                        className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                        placeholder="https://sitem.com" 
                      />
                      <Link className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                </div>

                {/* ÖZET VE HAKKINDA BÖLÜMÜ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                    {effectiveBranch === 'company' ? 'Firma Tanıtımı & Hakkımızda Özeti' : 'Hakkımda / Profesyonel Kariyer Özeti'}
                  </label>
                  <textarea 
                    rows={4} 
                    value={formData.bio || formData.summary || ''} 
                    onChange={(e) => {
                      handleInputChange('bio', e.target.value);
                      handleInputChange('summary', e.target.value);
                    }} 
                    className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all resize-none`} 
                    placeholder={
                      effectiveBranch === 'company' 
                        ? 'Firma faaliyet alanları, teknoloji ekosistemi ve istihdam hedefleriniz...' 
                        : 'Kariyer hedefleriniz, uzmanlık alanlarınız ve vizyonunuz hakkında kısa bir özet...'
                    } 
                  />
                </div>

                {renderSaveActionBar(true)}
              </div>
            )}

            {/* TAB: ALUMNI EDUCATION (MEZUNİYET & EĞİTİM - MBS) */}
            {activeTab === 'alumni_education' && (
              <div className="space-y-8">
                <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-start gap-4">
                  <GraduationCap className="text-emerald-700 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-emerald-900">Mezun Bilgi Sistemi (MBS) Resmî Kaydı</h4>
                    <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                      İstanbul Esenyurt Üniversitesi mezuniyet durumunuz, diplomanız ve bölüm kaydınız aşağıda listelenmiştir.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mezun Olunan Fakülte / Yüksekokul</label>
                    <select 
                      value={selectedFaculty} 
                      onChange={(e) => {
                        setSelectedFaculty(e.target.value);
                        setSelectedDept('');
                        handleInputChange('faculty', e.target.value);
                      }} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    >
                      <option value="">Fakülte Seçiniz</option>
                      {activeFaculties.map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mezun Olunan Bölüm / Program</label>
                    <select 
                      value={selectedDept} 
                      onChange={(e) => {
                        setSelectedDept(e.target.value);
                        handleInputChange('department', e.target.value);
                      }} 
                      disabled={!selectedFaculty} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all disabled:opacity-50"
                    >
                      <option value="">Bölüm Seçiniz</option>
                      {availableDepts.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mezuniyet Yılı</label>
                    <input 
                      type="text" 
                      value={formData.graduationYear || '2024'} 
                      onChange={(e) => handleInputChange('graduationYear', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" 
                      placeholder="Örn: 2023 veya 2024" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mezuniyet Derecesi (AGNO / GPA)</label>
                    <input 
                      type="text" 
                      value={formData.gpa || '3.42'} 
                      onChange={(e) => handleInputChange('gpa', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" 
                      placeholder="Örn: 3.45 / 4.00" 
                    />
                  </div>
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB: ALUMNI CAREER (KARİYER & ŞİRKET BİLGİLERİ - MENTÖRLÜK) */}
            {activeTab === 'alumni_career' && (
              <div className="space-y-8">
                <div className="p-6 rounded-3xl border bg-emerald-50/60 border-emerald-200 flex items-start gap-4">
                  <Briefcase className="text-emerald-700 shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Mevcut İstihdam & Şirket Bilgisi</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Şu anda çalıştığınız şirket, pozisyonunuz ve üniversite öğrencilerine rehberlik/mentörlük verme durumunuzu belirleyin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mevcut Şirket / Kurum Adı</label>
                    <input 
                      type="text" 
                      value={formData.company || formData.currentCompany || ''} 
                      onChange={(e) => {
                        handleInputChange('company', e.target.value);
                        handleInputChange('currentCompany', e.target.value);
                      }} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" 
                      placeholder="Örn: Aselsan, Trendyol, Siemens vb." 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Pozisyon / Ünvan</label>
                    <input 
                      type="text" 
                      value={formData.title || formData.currentPosition || ''} 
                      onChange={(e) => {
                        handleInputChange('title', e.target.value);
                        handleInputChange('currentPosition', e.target.value);
                      }} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" 
                      placeholder="Örn: Kıdemli Yazılım Geliştirici" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Sektör</label>
                    <input 
                      type="text" 
                      value={formData.sector || 'Bilişim & Yazılım'} 
                      onChange={(e) => handleInputChange('sector', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" 
                      placeholder="Örn: Finans, Sağlık, Bilişim" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Çalışma Şekli</label>
                    <select 
                      value={formData.workType || formData.workMode || 'Hibrit'} 
                      onChange={(e) => {
                        handleInputChange('workType', e.target.value);
                        handleInputChange('workMode', e.target.value);
                      }} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      <option value="Hibrit">Hibrit (Ofis + Uzaktan)</option>
                      <option value="Uzaktan">Tamamen Uzaktan (Remote)</option>
                      <option value="Ofis">Ofiste (Yüz Yüze)</option>
                      <option value="Freelance">Serbest Zamanlı / Freelance</option>
                    </select>
                  </div>
                </div>

                {/* Küresel Lokasyon Entegrasyonu */}
                {renderAlumniLocationSection()}

                {/* Mentörlük Kutusu */}
                <div className="p-6 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <Compass size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">İESÜ Öğrencilerine Mentörlük Desteği</h4>
                        <p className="text-xs text-slate-500">Kariyer başlangıcındaki öğrencilere tecrübelerinizle ışık tutun.</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      id="willMentor" 
                      checked={formData.willMentor !== false} 
                      onChange={(e) => handleInputChange('willMentor', e.target.checked)} 
                      className="w-5 h-5 text-emerald-600 rounded cursor-pointer accent-emerald-600" 
                    />
                  </div>

                  {formData.willMentor !== false && (
                    <div className="pt-3 border-t border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mentörlük Sağlayabileceğiniz Alan</label>
                        <input 
                          type="text" 
                          value={formData.mentorshipField || 'Yazılım Kariyeri & Mülakat Simülasyonu'} 
                          onChange={(e) => handleInputChange('mentorshipField', e.target.value)} 
                          className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-emerald-600" 
                          placeholder="Örn: Frontend, Veri Bilimi, Ürün Yönetimi" 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Haftalık Ayrılabilir Süre</label>
                        <select 
                          value={formData.mentorshipHours || 'Haftada 1-2 Saat'} 
                          onChange={(e) => handleInputChange('mentorshipHours', e.target.value)} 
                          className="w-full bg-white border border-emerald-200 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-emerald-600"
                        >
                          <option value="Haftada 1 Saat">Haftada 1 Saat</option>
                          <option value="Haftada 1-2 Saat">Haftada 1-2 Saat</option>
                          <option value="Ayda 2-3 Görüşme">Ayda 2-3 Görüşme</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            
            {/* TAB: ALUMNI GLOBAL LOCATION & MAP */}
            {activeTab === 'alumni_location' && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-gradient-to-br from-[#020817] via-[#0A2342] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-cyan-500/30">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-600 text-white text-[11px] font-black uppercase tracking-wider rounded-xl mb-3 shadow-md">
                        <Globe size={14} /> Mezunlar Küresel Diaspora Ağı
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                        Küresel Mezun Haritası & Lokasyon Yönetimi
                      </h3>
                      <p className="text-xs sm:text-sm text-cyan-100/90 mt-2 max-w-2xl leading-relaxed font-medium">
                        Yaşadığınız ve çalıştığınız ülkeyi belirterek İESÜ'nün canlı küresel haritasında yerinizi alın. Konumunuz haritada ışıldayacak ve diaspora ağında listelenecektir.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSave(false);
                        setView('global_map');
                      }}
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-cyan-500/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Globe size={16} /> Canlı Haritayı Aç
                    </button>
                  </div>
                </div>

                {renderAlumniLocationSection()}

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB: ALUMNI CHECKUP (12 SORULUK MEZUN KARİYER & İSTİHDAM ANKETİ) */}
            {activeTab === 'alumni_checkup' && (
              <div className="space-y-8 animate-fade-in">
                {/* 12 Soru Özel Gradient Header Banner */}
                <div className="bg-gradient-to-br from-[#0A2342] via-[#047857] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-500/30">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider rounded-xl mb-3 shadow-md">
                        <Compass size={14} /> Mezunlara Özel Paneli (MBS)
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                        12 Soruluk Mezun İstihdam & Kariyer Anketi
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed font-medium">
                        12 soruluk tek tık Mezun Kariyer Anketi formunu doldurarak istihdam durumunuzu, sektör konumunuzu ve kariyer hedeflerinizi Kariyer Geliştirme Merkezi'ne iletin.
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 text-center shrink-0">
                      <div className="text-3xl font-black text-amber-300">12 / 12</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Tek Ekran Paneli</div>
                    </div>
                  </div>
                </div>

                {/* 12 Questions Form */}
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Soru 1 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        1. Şu anda aktif olarak çalışıyor musunuz?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Evet", "Hayır"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleCheckupAnswerChange(1, opt)}
                            className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${
                              (formData.checkupAnswers?.[1] || 'Evet') === opt 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Soru 2 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        2. İlk işinizi mezun olduktan ne kadar süre sonra buldunuz?
                      </label>
                      <select
                        value={formData.checkupAnswers?.[2] || '0 - 3 Ay İçinde'}
                        onChange={(e) => handleCheckupAnswerChange(2, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Mezun Olmadan Önce">Mezun Olmadan Önce</option>
                        <option value="0 - 3 Ay İçinde">0 - 3 Ay İçinde</option>
                        <option value="3 - 6 Ay İçinde">3 - 6 Ay İçinde</option>
                        <option value="6 Ay ve Üzeri">6 Ay ve Üzeri</option>
                      </select>
                    </div>

                    {/* Soru 3 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        3. Çalıştığınız sektör
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Teknoloji & Yazılım, Finans, Sağlık..."
                        value={formData.checkupAnswers?.[3] || formData.sector || ''}
                        onChange={(e) => handleCheckupAnswerChange(3, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Soru 4 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        4. Çalıştığınız kurumun türü
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Özel Şirket, Kamu Kurumu, Kendi İşletmem..."
                        value={formData.checkupAnswers?.[4] || formData.companyType || ''}
                        onChange={(e) => handleCheckupAnswerChange(4, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Soru 5 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        5. Mevcut göreviniz / ünvanınız
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Yazılım Uzmanı, Ürün Yöneticisi..."
                        value={formData.checkupAnswers?.[5] || formData.title || formData.currentPosition || ''}
                        onChange={(e) => handleCheckupAnswerChange(5, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Soru 6 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        6. Çalıştığınız iş mezun olduğunuz bölümle ilişkili mi?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Evet", "Hayır"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleCheckupAnswerChange(6, opt)}
                            className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${
                              (formData.checkupAnswers?.[6] || 'Evet') === opt 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {formData.checkupAnswers?.[6] === 'Hayır' && (
                        <div className="pt-2 animate-fade-in">
                          <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                            Şu an ne iş yapıyorsunuz? (Mevcut Alan / Meslek)
                          </label>
                          <input
                            type="text"
                            placeholder="Örn: Gayrimenkul Danışmanı, Dijital İçerik Üreticisi..."
                            value={formData.checkupAnswers?.['6_sub'] || ''}
                            onChange={(e) => handleCheckupAnswerChange('6_sub', e.target.value)}
                            className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Soru 7 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        7. Çalıştığınız il / ülke
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: İstanbul / Türkiye, Berlin / Almanya..."
                        value={formData.checkupAnswers?.[7] || formData.city || ''}
                        onChange={(e) => handleCheckupAnswerChange(7, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Soru 8 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        8. Çalışma şekliniz
                      </label>
                      <select
                        value={formData.checkupAnswers?.[8] || formData.workMode || 'Hibrit'}
                        onChange={(e) => handleCheckupAnswerChange(8, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Hibrit">Hibrit</option>
                        <option value="Uzaktan (Remote)">Uzaktan (Remote)</option>
                        <option value="Ofisten">Ofisten</option>
                        <option value="Serbest / Freelance">Serbest / Freelance</option>
                      </select>
                    </div>

                    {/* Soru 9 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        9. Lisansüstü eğitim alıyor musunuz?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Evet", "Hayır"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleCheckupAnswerChange(9, opt)}
                            className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${
                              (formData.checkupAnswers?.[9] || 'Hayır') === opt 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Soru 10 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        10. Telefon numaranız güncel mi?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Evet", "Hayır"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleCheckupAnswerChange(10, opt)}
                            className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${
                              (formData.checkupAnswers?.[10] || 'Evet') === opt 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {formData.checkupAnswers?.[10] === 'Hayır' && (
                        <div className="pt-2 animate-fade-in">
                          <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                            Yeni Telefon Numarası
                          </label>
                          <input
                            type="text"
                            placeholder="+90 5XX XXX XX XX"
                            value={formData.checkupAnswers?.['10_sub'] || ''}
                            onChange={(e) => handleCheckupAnswerChange('10_sub', e.target.value)}
                            className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Soru 11 */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <label className="text-xs font-black text-slate-900 block leading-snug">
                        11. E-posta adresiniz güncel mi?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Evet", "Hayır"].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleCheckupAnswerChange(11, opt)}
                            className={`py-3 px-4 rounded-xl text-xs font-black transition border cursor-pointer ${
                              (formData.checkupAnswers?.[11] || 'Evet') === opt 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {formData.checkupAnswers?.[11] === 'Hayır' && (
                        <div className="pt-2 animate-fade-in">
                          <label className="text-[11px] font-bold text-emerald-700 block mb-1">
                            Yeni E-Posta Adresi
                          </label>
                          <input
                            type="email"
                            placeholder="yeni.eposta@gmail.com"
                            value={formData.checkupAnswers?.['11_sub'] || ''}
                            onChange={(e) => handleCheckupAnswerChange('11_sub', e.target.value)}
                            className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Soru 12 */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <label className="text-xs font-black text-slate-900 block leading-snug">
                      12. Üniversitemize veya Kariyer Merkezimize iletmek istediğiniz görüş ve önerileriniz var mı?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Görüş, istek ve önerilerinizi buraya yazabilirsiniz..."
                      value={formData.checkupAnswers?.[12] || ''}
                      onChange={(e) => handleCheckupAnswerChange(12, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      handleSave(false);
                      if (window.toast?.success) window.toast.success("🧭 12 soruluk Mezun Kariyer Anketi başarıyla kaydedildi ve sisteme işlendi!");
                      else if (window.alert) window.alert("🧭 12 soruluk Mezun Kariyer Anketi başarıyla kaydedildi!");
                    }}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm uppercase tracking-widest transition shadow-xl cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> 12 Soruluk Mezun Anketini Kaydet & Güncelle
                  </button>

                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB: ACADEMIC STAFF INFO (DERSLER, YAYINLAR & OFİS SAATLERİ) */}
            {activeTab === 'academic_staff_info' && (
              <div className="space-y-8">
                <div className="p-5 bg-purple-50/70 rounded-2xl border border-purple-200/80 flex items-start gap-4">
                  <BookOpen className="text-purple-700 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-purple-900">Akademik Kadro & Ders Bilgileri</h4>
                    <p className="text-xs text-purple-700 mt-0.5 leading-relaxed">
                      Öğrencilerin ve araştırmacıların sizinle iletişim kurabilmesi için derslerinizi ve ofis saatlerinizi güncel tutun.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Akademik Unvan</label>
                    <input 
                      type="text" 
                      value={formData.academicTitle || formData.title || 'Doç. Dr.'} 
                      onChange={(e) => {
                        handleInputChange('academicTitle', e.target.value);
                        handleInputChange('title', e.target.value);
                      }} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600" 
                      placeholder="Örn: Prof. Dr., Doç. Dr., Dr. Öğr. Üyesi" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Ofis Lokasyonu / Oda No</label>
                    <input 
                      type="text" 
                      value={formData.officeLocation || 'A Blok 4. Kat No: 408'} 
                      onChange={(e) => handleInputChange('officeLocation', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600" 
                      placeholder="Örn: Mühendislik Fakültesi A-302" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Haftalık Ofis / Danışmanlık Saatleri</label>
                    <input 
                      type="text" 
                      value={formData.officeHours || 'Salı 14:00 - 16:00, Perşembe 10:00 - 12:00'} 
                      onChange={(e) => handleInputChange('officeHours', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600" 
                      placeholder="Örn: Pazartesi 13:00 - 15:00" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">YÖKSİS No / ORCID ID</label>
                    <input 
                      type="text" 
                      value={formData.orcid || '0000-0002-1825-0097'} 
                      onChange={(e) => handleInputChange('orcid', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600" 
                      placeholder="Örn: 0000-0002-XXXX-XXXX" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Verilen Güncel Dersler</label>
                  <textarea 
                    rows={3} 
                    value={formData.coursesGiven || 'YAZ301 Yazılım Mimarisi, BLM101 Programlamaya Giriş, YAZ491 Bitirme Tezi'} 
                    onChange={(e) => handleInputChange('coursesGiven', e.target.value)} 
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 resize-none" 
                    placeholder="Virgülle ayırarak yürüttüğünüz dersleri yazınız..." 
                  />
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB: COMPANY PREFERENCES (FİRMA STAJYER & İSTİHDAM TERCİHLERİ) */}
            {activeTab === 'company_preferences' && (
              <div className="space-y-8">
                <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex items-start gap-4">
                  <Target className="text-blue-900 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-blue-950">Stajyer & Mezun İstihdam Tercihleri</h4>
                    <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                      Kurumunuzun staj ve iş ilanlarında aradığı temel yetkinlikleri ve çalışma modellerini belirleyin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Öncelikli Mezun/Stajyer Bölümleri</label>
                    <input 
                      type="text" 
                      value={formData.preferredDepartments || 'Bilgisayar Mühendisliği, Yönetim Bilişim, İşletme'} 
                      onChange={(e) => handleInputChange('preferredDepartments', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" 
                      placeholder="Örn: Bilgisayar, Elektrik-Elektronik, Makine" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">İstihdam Türü</label>
                    <select 
                      value={formData.employmentType || 'Zorunlu ve Gönüllü Staj & Tam Zamanlı'} 
                      onChange={(e) => handleInputChange('employmentType', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value="Zorunlu ve Gönüllü Staj & Tam Zamanlı">Zorunlu ve Gönüllü Staj & Tam Zamanlı</option>
                      <option value="Sadece Zorunlu Staj">Sadece Zorunlu Staj</option>
                      <option value="Sadece Yeni Mezun İstihdamı">Sadece Yeni Mezun İstihdamı</option>
                      <option value="Yarı Zamanlı Öğrenci Çalışması">Yarı Zamanlı Öğrenci Çalışması</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Yetkili İK Yöneticisi Adı</label>
                    <input 
                      type="text" 
                      value={formData.hrContactName || 'İK Direktörlüğü'} 
                      onChange={(e) => handleInputChange('hrContactName', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" 
                      placeholder="Örn: Zeynep Kaya" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">İK İletişim Telefonu / Dahili</label>
                    <input 
                      type="text" 
                      value={formData.hrPhone || '+90 212 555 0000'} 
                      onChange={(e) => handleInputChange('hrPhone', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" 
                      placeholder="Örn: +90 212 000 0000 / 123" 
                    />
                  </div>
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB: ADMIN UNIT & NOTIFICATIONS */}
            {activeTab === 'admin_unit' && (
              <div className="space-y-8">
                <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-4">
                  <Shield className="text-amber-800 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-amber-950">Yönetim Birimi & Yetki Alanı</h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Süper Admin olarak bağlı bulunduğunuz koordinatörlük ve resmi üniversite birimi ayarları.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bağlı Olduğu Koordinatörlük</label>
                    <input 
                      type="text" 
                      value={formData.adminUnit || 'Kariyer Geliştirme Koordinatörlüğü'} 
                      onChange={(e) => handleInputChange('adminUnit', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600" 
                      placeholder="Örn: Kariyer Geliştirme Koordinatörlüğü" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Yönetici Sicil / ID No</label>
                    <input 
                      type="text" 
                      value={formData.adminId || 'ADM-2026-001'} 
                      onChange={(e) => handleInputChange('adminId', e.target.value)} 
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600" 
                      placeholder="Örn: ADM-2026-01" 
                    />
                  </div>
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {activeTab === 'admin_notifications' && (
              <div className="space-y-8">
                <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-start gap-4">
                  <Settings className="text-amber-800 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-amber-950">Sistem & Bildirim Tercihleri</h4>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      Yeni kayıtlar, staj başvuruları ve sistem logları ile ilgili anlık bildirim tercihleri.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <h5 className="text-sm font-black text-gray-800">Yeni Öğrenci & Mezun Kayıt Bildirimleri</h5>
                      <p className="text-xs text-gray-500">Yeni bir profil oluşturulduğunda SMS ve sistem bildirimi al.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-600 cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                    <div>
                      <h5 className="text-sm font-black text-gray-800">Ar-Ge & Proje Revize Talepleri</h5>
                      <p className="text-xs text-gray-500">Akademisyenler veya bursiyerler revize gönderdiğinde e-posta ile uyar.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-600 cursor-pointer" />
                  </div>
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB 2: ACADEMIC EDUCATION (ÖĞRENCİ VE AKADEMİK İÇİN) */}
            {activeTab === 'academic' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fakülte / Yüksekokul *</label>
                    <select 
                      value={selectedFaculty} 
                      onChange={(e) => {
                        setSelectedFaculty(e.target.value);
                        setSelectedDept('');
                        handleInputChange('faculty', e.target.value);
                      }} 
                      className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`}
                    >
                      <option value="">Fakülte Seçiniz</option>
                      {activeFaculties.map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bölüm / Program *</label>
                    <select 
                      value={selectedDept} 
                      onChange={(e) => {
                        setSelectedDept(e.target.value);
                        handleInputChange('department', e.target.value);
                      }} 
                      disabled={!selectedFaculty} 
                      className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all disabled:opacity-50`}
                    >
                      <option value="">Bölüm Seçiniz</option>
                      {availableDepts.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Sınıf Düzeyi</label>
                    <select 
                      value={formData.classLevel || '1. Sınıf'} 
                      onChange={(e) => handleInputChange('classLevel', e.target.value)} 
                      className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`}
                    >
                      <option>Hazırlık</option>
                      <option>1. Sınıf</option>
                      <option>2. Sınıf</option>
                      <option>3. Sınıf</option>
                      <option>4. Sınıf</option>
                      <option>Mezun</option>
                      <option>Yüksek Lisans</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Akademik Ortalama (AGNO / GPA)</label>
                    <input 
                      type="text" 
                      value={formData.gpa || ''} 
                      onChange={(e) => handleInputChange('gpa', e.target.value)} 
                      className={`w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} transition-all`} 
                      placeholder="Örn: 3.45 / 4.00" 
                    />
                  </div>

                </div>

                {/* ÇİFT ANADAL / YANDAL (ÇAP) AYARLARI */}
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-gray-900">Çift Anadal / Yandal (ÇAP) Programı</h4>
                      <p className="text-xs text-gray-500">Üniversitemizde ikinci bir anadal veya yandal eğitimi alıyorsanız işaretleyiniz.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      id="isDoubleMajor" 
                      checked={formData.isDoubleMajor || false} 
                      onChange={(e) => handleInputChange('isDoubleMajor', e.target.checked)} 
                      className={`w-5 h-5 ${cfg.primaryBg} rounded cursor-pointer accent-red-600`} 
                    />
                  </div>

                  {formData.isDoubleMajor && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 animate-fade-in">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">2. Fakülte (ÇAP)</label>
                        <select 
                          value={selectedCapFaculty} 
                          onChange={(e) => {
                            setSelectedCapFaculty(e.target.value);
                            setSelectedCapDept('');
                            handleInputChange('capFaculty', e.target.value);
                          }} 
                          className={`w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 outline-none ${cfg.primaryFocusRing}`}
                        >
                          <option value="">Fakülte Seçiniz</option>
                          {activeFaculties.map(f => (
                            <option key={f.id} value={f.name}>{f.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">2. Bölüm (ÇAP)</label>
                        <select 
                          value={selectedCapDept} 
                          onChange={(e) => {
                            setSelectedCapDept(e.target.value);
                            handleInputChange('capDept', e.target.value);
                          }} 
                          disabled={!selectedCapFaculty} 
                          className={`w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-700 outline-none ${cfg.primaryFocusRing} disabled:opacity-50`}
                        >
                          <option value="">Bölüm Seçiniz</option>
                          {availableCapDepts.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB 3: CAREER & SKILLS (ÖĞRENCİ) */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                
                {/* DENEYİMLER */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-gray-900">İş & Staj Deneyimleri</h4>
                      <p className="text-xs text-gray-500">Daha önce tamamladığınız staj ve çalışma geçmişinizi ekleyin.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowExpModal(true)}
                      className={`px-3 py-1.5 text-xs font-black rounded-xl text-white ${cfg.primaryBg} shadow-sm transition flex items-center gap-1 cursor-pointer`}
                    >
                      <Plus size={14} /> Deneyim Ekle
                    </button>
                  </div>

                  {(!formData.experiences || formData.experiences.length === 0) ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Briefcase className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-xs text-gray-500 font-bold">Henüz bir deneyim eklenmemiş.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.experiences.map(exp => (
                        <div key={exp.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-black text-gray-900">{exp.title}</h5>
                            <p className="text-xs font-bold text-gray-600">{exp.company}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-black bg-white rounded border border-gray-200 text-gray-600">
                              {exp.type}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem('experiences', exp.id)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* YETENEKLER & DİLLER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  
                  {/* Yetenekler */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-gray-900">Teknik & Sosyal Yetenekler</h4>
                      <button
                        type="button"
                        onClick={() => setShowSkillModal(true)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Ekle
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(formData.skills || []).map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl">
                          {skill}
                          <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeItem('skills', skill)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Diller */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-gray-900">Yabancı Diller</h4>
                      <button
                        type="button"
                        onClick={() => setShowLangModal(true)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Ekle
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(formData.languages || []).map(lang => (
                        <div key={lang.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                          <div>
                            <span className="text-xs font-black text-gray-900">{lang.name}</span>
                            <span className="text-[11px] font-semibold text-gray-500 ml-2">({lang.level})</span>
                          </div>
                          <Trash2 size={14} className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => removeItem('languages', lang.id)} />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {renderSaveActionBar(false)}
              </div>
            )}

            {/* TAB 4: CERTIFICATES & GOALS */}
            {activeTab === 'certificates' && (
              <div className="space-y-8">
                
                {/* SERTİFİKALAR */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-gray-900">Sertifikalar & Lisanslar</h4>
                      <p className="text-xs text-gray-500">SEM, Coursera, BTK vb. platformlardan aldığınız belgeleri ekleyin.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCertModal(true)}
                      className={`px-3 py-1.5 text-xs font-black rounded-xl text-white ${cfg.primaryBg} shadow-sm transition flex items-center gap-1 cursor-pointer`}
                    >
                      <Plus size={14} /> Sertifika Ekle
                    </button>
                  </div>

                  {(!formData.certificates || formData.certificates.length === 0) ? (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <Award className="mx-auto text-gray-300 mb-2" size={32} />
                      <p className="text-xs text-gray-500 font-bold">Henüz sertifika eklenmemiş.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.certificates.map(cert => (
                        <div key={cert.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-black text-gray-900">{cert.name}</h5>
                            <p className="text-xs font-bold text-gray-600">{cert.issuer}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem('certificates', cert.id)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CV YÜKLEME ALANI (PDF) */}
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-gray-900">Hazır CV Yükleme (PDF)</h4>
                      <p className="text-xs text-gray-500">İşverenlerin ve yöneticilerin görüntüleyebileceği güncel PDF özgeçmişiniz.</p>
                    </div>
                    <label className={`px-4 py-2 text-xs font-black rounded-xl text-white ${cfg.primaryBg} shadow-sm transition flex items-center gap-1.5 cursor-pointer`}>
                      <UploadCloud size={16} /> CV Dosyası Seç
                      <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {uploadedFileName ? (
                    <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="text-red-600" size={18} />
                        <span className="text-xs font-bold text-gray-800">{uploadedFileName}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Yüklendi</span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Henüz harici bir PDF özgeçmiş yüklenmedi.</p>
                  )}
                </div>

                {/* KARİYER HEDEFLERİ (ÖĞRENCİ İÇİN) */}
                <div className="space-y-3">
                   <h4 className="text-sm font-black text-gray-900">Hedeflenen Çalışma Alanları</h4>
                   <div className="flex flex-wrap gap-2">
                     {[
                       'Yazılım & Bilişim', 'Yapay Zeka & Veri', 'Siber Güvenlik', 
                       'Mobil Uygulama', 'UI/UX Tasarım', 'Proje Yönetimi',
                       'Finans & Bankacılık', 'Sağlık Yönetimi', 'Dış Ticaret'
                     ].map((item, idx) => (
                       <button
                         key={idx}
                         type="button"
                         onClick={() => toggleArrayItem('careerPreferences', item)}
                         className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                           (formData.careerPreferences || []).includes(item)
                             ? `${cfg.primaryBg} text-white border-transparent shadow-xs`
                             : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                         }`}
                       >
                         {item}
                       </button>
                     ))}
                   </div>
                </div>

                {renderSaveActionBar(false)}
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

      {/* FLOATING BOTTOM DOCK (HER PANELİN NORMAL AKIŞTAKİ İLE BİREBİR AYNI 4'LÜ DOCK'U) */}
      {effectiveBranch === 'admin' ? (
        <AdminOmniDock 
          activeTab="feed"
          setView={setView} 
          setSelectedUserId={setSelectedUserId} 
          currentUser={currentUser}
          theme="amber" 
        />
      ) : effectiveBranch === 'alumni' ? (
        /* 🌿 MEZUNLAR AĞINA ÖZEL ZÜMRÜT DOCK (Normal Akıştaki ile Birebir) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-emerald-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(6,78,59,0.18)] flex items-center justify-between px-4 text-gray-800">
            {/* 1. Mezun Akışı */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('alumni');
                setView('alumni');
              }} 
              className="p-2.5 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center cursor-pointer" 
              title="Mezun Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Mezun Kariyer & İş İlanları */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('alumni');
                setView('jobs');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 text-white shadow-lg shadow-emerald-900/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/40 cursor-pointer" 
              title="Mezun İş & Kariyer Olanakları"
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </button>
            {/* 3. Küresel Mezun Haritası */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('alumni');
                setView('global_map');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-800 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-emerald-300/60 cursor-pointer" 
              title="Küresel Mezun Haritası & Ağı"
            >
              <Globe size={20} strokeWidth={2.5} />
            </button>
            {/* 4. Mezun Profilim */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('alumni');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-emerald-600 shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer ring-2 ring-emerald-400" 
              title="Mezun Profilim"
            >
              <SafeAvatar 
                src={formData.avatar || currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Mezun'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : effectiveBranch === 'academic' ? (
        /* 🏛️ AKADEMİK KADROYA ÖZEL ASİL MOR DOCK (Normal Akıştaki ile Birebir) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[340px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-purple-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(76,29,149,0.2)] flex items-center justify-around px-4 text-gray-800">
            {/* 1. Akademik Akış & Ana Sayfa */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('academic');
                setView('academic');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="p-2.5 rounded-full bg-[#4C1D95] text-white shadow-md shadow-purple-900/30 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
              title="Akademik Akışa Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Staj & Evrak Onayı */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('academic');
                setView('academic');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#4C1D95] via-purple-700 to-indigo-600 text-white shadow-lg shadow-purple-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/40 cursor-pointer" 
              title="Evrak & Staj Onayı"
            >
              <FileText size={22} strokeWidth={2.5} />
            </button>
            {/* 3. Araştırma OS Hub */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('academic');
                setView('research_hub');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-purple-50 to-indigo-100 text-purple-900 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-purple-300/60 cursor-pointer" 
              title="Araştırma OS Hub"
            >
              <BookOpen size={20} strokeWidth={2.5} />
            </button>
            {/* 4. Hoca Profilim */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('academic');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#4C1D95] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer ring-2 ring-purple-400" 
              title="Hoca Profilim"
            >
              <SafeAvatar 
                src={formData.avatar || currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Hoca'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : effectiveBranch === 'company' ? (
        /* 🏢 KURUMSAL FİRMAYA ÖZEL LACİVERT DOCK (Normal Akıştaki ile Birebir) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-blue-200 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(10,35,66,0.22)] flex items-center justify-between px-4 text-slate-800">
            {/* 1. Kurumsal Akış */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('company');
                setView('company');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="p-2.5 rounded-full bg-gradient-to-r from-slate-950 via-[#0A2342] to-blue-950 text-white shadow-md shadow-blue-950/40 flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
              title="Kurumsal Firma Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. Yeni İlan Yayınla */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('company');
                setView('create_job');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-[#0A2342] to-indigo-800 text-white shadow-lg shadow-blue-950/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-blue-300/40 cursor-pointer" 
              title="Yeni İlan Yayınla"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
            {/* 3. ATS Aday Takip Panosu */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('company');
                setView('company_ats');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-white/50 cursor-pointer" 
              title="ATS Aday Takip Panosu"
            >
              <Briefcase size={22} strokeWidth={2.5} />
            </button>
            {/* 4. Firma Profilim */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('company');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#0A2342] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer ring-2 ring-blue-400" 
              title="Firma Profilim"
            >
              <SafeAvatar 
                src={formData.avatar || currentUser?.avatar || currentUser?.profileImage || currentUser?.logo} 
                name={currentUser?.name || 'Firma'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      ) : (
        /* 🎓 ÖĞRENCİYE ÖZEL KIRMIZI/CRIMSON DOCK (Normal Akıştaki ile Birebir) */
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up w-[95%] max-w-[420px]">
          <div className="bg-white/95 backdrop-blur-2xl border-2 border-red-100 p-2 sm:p-2.5 rounded-full shadow-[0_15px_40px_rgba(153,0,0,0.18)] flex items-center justify-between px-4 text-gray-800">
            {/* 1. Öğrenci Akışı */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('student');
                setView('student');
              }} 
              className="p-2.5 rounded-full text-slate-600 hover:text-[#990000] hover:bg-red-50 transition-all flex items-center justify-center cursor-pointer" 
              title="Öğrenci Akışına Dön"
            >
              <Home size={22} strokeWidth={2.2} />
            </button>
            {/* 2. İş & Staj Olanakları */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('student');
                setView('jobs');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" 
              title="Öğrenci İş & Staj Olanakları"
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </button>
            {/* 3. Keşfet & Sosyal Ağ */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('student');
                setView('student');
              }} 
              className="w-12 h-10 sm:w-14 sm:h-11 rounded-2xl bg-gradient-to-tr from-red-900 via-[#990000] to-rose-700 text-white shadow-lg shadow-red-900/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mx-1 shrink-0 border border-red-300/40 cursor-pointer" 
              title="Keşfet & Sosyal Ağ Portalı"
            >
              <Search size={20} strokeWidth={2.8} />
            </button>
            {/* 4. Öğrenci Profilim */}
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                const store = useAppStore.getState();
                store.setActivePortalBranch?.('student');
                if (setSelectedUserId && currentUser?.id) setSelectedUserId(currentUser.id);
                setView('user_profile');
              }} 
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#990000] shadow-sm hover:scale-105 transition-all shrink-0 p-0.5 overflow-hidden cursor-pointer ring-2 ring-red-400" 
              title="Öğrenci Profilim"
            >
              <SafeAvatar 
                src={formData.avatar || currentUser?.avatar || currentUser?.profileImage} 
                name={currentUser?.name || 'Öğrenci'} 
                size="xs" 
                alt="Profile" 
              />
            </button>
          </div>
        </div>
      )}

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
