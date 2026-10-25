import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, User, BookOpen, Layers, Briefcase, FileText, Shield, 
  Save, Award, Star, Plus, Trash2, Target, UploadCloud, ChevronRight, 
  Camera, MapPin, Mail, Phone, Globe, Link, GraduationCap, 
  Clock, Compass, CheckCircle2, Sparkles, X, Eye, Download,
  Code2, ExternalLink, Calendar, Building, Users, ShieldCheck,
  Check, AlertCircle, FileCheck, Info
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
  const [activeTab, setActiveTab] = useState('academic'); 
  const [hasChanges, setHasChanges] = useState(false);
  const [showAICVModal, setShowAICVModal] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedCvName, setUploadedCvName] = useState(currentUser?.cvFileName || '');

  // Form State strictly customized for Student Hive with LinkedIn & Kariyer.net Standards
  const [formData, setFormData] = useState({
    // 1. Personal & Contact Info
    name: currentUser?.name || '',
    studentNo: currentUser?.studentNo || currentUser?.studentId || '2023010482',
    email: currentUser?.email || 'ogrenci@ogr.esenyurt.edu.tr',
    phone: currentUser?.phone || '0555 123 4567',
    birthDate: currentUser?.birthDate || '2003-05-14',
    city: currentUser?.city || 'İstanbul / Esenyurt',
    bio: currentUser?.bio || currentUser?.summary || 'Yazılım geliştirme ve yapay zeka alanlarında kendini geliştiren, takım çalışmasına yatkın lisans öğrencisi.',
    avatar: currentUser?.avatar || '',
    nationality: currentUser?.nationality || 'T.C.',

    // 2. HR Legal & Mobility (Kariyer.net Core Standards)
    militaryStatus: currentUser?.militaryStatus || 'Tecilli', // 'Tecilli', 'Yapıldı', 'Muaf', 'Muaf (Kadın Aday)'
    militaryDate: currentUser?.militaryDate || '2028-07-01',
    hasDrivingLicense: currentUser?.hasDrivingLicense !== undefined ? currentUser.hasDrivingLicense : true,
    drivingLicenseClasses: currentUser?.drivingLicenseClasses || ['B'],
    hasSrc: currentUser?.hasSrc || false,
    travelObstacle: currentUser?.travelObstacle || 'Seyahat Engeli Yok', // 'Seyahat Engeli Yok', 'Yurtiçi Seyahat Edebilir', 'Seyahat Edemez'

    // 3. Academic Info
    faculty: currentUser?.faculty || 'Mühendislik ve Mimarlık Fakültesi',
    department: currentUser?.department || 'Bilgisayar Mühendisliği',
    year: currentUser?.year || currentUser?.classLevel || '3. Sınıf',
    gpa: currentUser?.gpa || currentUser?.agno || 3.42,
    advisorName: currentUser?.advisorName || 'Dr. Öğr. Üyesi Deniz Demir',
    graduationExpectedYear: currentUser?.graduationExpectedYear || '2027',
    isDoubleMajor: currentUser?.isDoubleMajor || false,
    capFaculty: currentUser?.capFaculty || '',
    capDept: currentUser?.capDept || '',

    // 4. Work & Internship Experiences (LinkedIn & Kariyer.net Core)
    experiences: Array.isArray(currentUser?.experiences) && currentUser.experiences.length > 0 
      ? currentUser.experiences 
      : [
          {
            id: 'exp-1',
            company: 'Teknopark İstanbul Bilişim A.Ş.',
            role: 'Stajyer Yazılım Geliştirici (Frontend)',
            type: 'Staj', // 'Staj' | 'Yarı Zamanlı' | 'Tam Zamanlı' | 'Gönüllü'
            location: 'İstanbul (Hibrit)',
            startDate: '2025-06-15',
            endDate: '2025-08-30',
            isCurrent: false,
            description: 'React ve Tailwind CSS kullanılarak kurumsal dashboard arayüzlerinin geliştirilmesi, REST API entegrasyonu ve Git sürüm kontrolü süreçlerine aktif katılım sağlandı.',
            skills: ['React', 'JavaScript', 'Tailwind CSS', 'Git']
          }
        ],

    // 5. Projects & Capstone (LinkedIn Project Showcase)
    projects: Array.isArray(currentUser?.projects) && currentUser.projects.length > 0
      ? currentUser.projects
      : [
          {
            id: 'proj-1',
            title: 'İESÜ Akıllı Kampüs ve Kariyer Portalı',
            role: 'Proje Lideri & Frontend Geliştirici',
            date: '2025 - 2026',
            liveUrl: 'https://kariyer.esenyurt.edu.tr',
            githubUrl: 'https://github.com/ogrenci/iesu-kariyer-portal',
            description: 'Öğrencilerin staj bulmasını ve mezun ağını güçlendirmeyi hedefleyen web uygulaması. Gerçek zamanlı mesajlaşma ve yapay zeka destekli CV oluşturucu içerir.',
            technologies: ['React', 'Tailwind CSS', 'Vite', 'Firebase']
          }
        ],

    // 6. Certifications & Licenses (Coursera, BTK, AWS, Cisco)
    certificates: Array.isArray(currentUser?.certificates) && currentUser.certificates.length > 0
      ? currentUser.certificates
      : [
          {
            id: 'cert-1',
            title: 'İleri Seviye Web Geliştirme (Full Stack)',
            issuer: 'BTK Akademi & Bilgi Teknolojileri Kurumu',
            issueDate: '2025-03',
            credentialId: 'BTK-9941-REACT-2025',
            credentialUrl: 'https://btkakademi.gov.tr/sertifika/BTK-9941'
          }
        ],

    // 7. Skills & Languages
    skills: currentUser?.skills || ['React', 'JavaScript (ES6+)', 'Node.js', 'Tailwind CSS', 'Git & GitHub'],
    languages: currentUser?.languages || [
      { name: 'Türkçe', level: 'Ana Dil (C2)' },
      { name: 'İngilizce', level: 'Mesleki Yetkinlik (B2)' }
    ],
    // Standardized Official Language Exams (YDS, TOEFL, IELTS, YÖKDİL)
    languageExams: Array.isArray(currentUser?.languageExams) && currentUser.languageExams.length > 0
      ? currentUser.languageExams
      : [
          {
            id: 'lexam-1',
            examType: 'YDS (Yabancı Dil Bilgisi Seviye Tespit Sınavı)',
            score: '82.5',
            year: '2025',
            status: 'Doğrulandı'
          }
        ],

    // 8. Career Goals & Cover Letter
    internshipStatus: currentUser?.internshipStatus || 'Devam Ediyor', // 'Yapıldı', 'Yapılmadı', 'Devam Ediyor'
    voluntaryInternshipInterest: currentUser?.voluntaryInternshipInterest !== undefined ? currentUser.voluntaryInternshipInterest : true,
    targetPosition: currentUser?.targetPosition || 'Frontend / Fullstack Developer',
    targetSector: currentUser?.targetSector || 'Teknoloji & Yazılım',
    workModelPreference: currentUser?.workModelPreference || 'Hibrit', // 'Hibrit', 'Uzaktan', 'Ofis', 'Yarı Zamanlı'
    coverLetter: currentUser?.coverLetter || 'Sayın Yetkili,\n\nİstanbul Esenyurt Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Üniversite eğitimim boyunca hem teorik temellerimi güçlendirdim hem de modern web teknolojileri (React, Node.js) üzerine somut projeler geliştirdim.\n\nŞirketinizin dinamik ve yenilikçi mühendislik ekibinde stajyer / aday mühendis olarak yer almaktan, katma değer üretirken kendimi sektörel anlamda geliştirmekten büyük mutluluk duyarım.\n\nİlginiz ve değerlendirmeniz için teşekkür ederim.\n\nSaygılarımla.',

    // 9. Academic & Professional References
    references: Array.isArray(currentUser?.references) && currentUser.references.length > 0
      ? currentUser.references
      : [
          {
            id: 'ref-1',
            fullName: 'Prof. Dr. Deniz Demir',
            organization: 'İstanbul Esenyurt Üniversitesi',
            title: 'Bilgisayar Mühendisliği Bölüm Başkanı / Akademik Danışman',
            phone: '0212 911 00 00',
            email: 'denizdemir@esenyurt.edu.tr',
            type: 'Akademik'
          }
        ],

    // 10. Student Clubs & Social Activities
    clubs: currentUser?.clubs || ['İESÜ Yazılım ve İnovasyon Kulübü', 'IEEE İESÜ Öğrenci Kolu'],

    // 11. Links & CV File
    linkedin: currentUser?.linkedin || 'https://linkedin.com/in/ogrenci',
    github: currentUser?.github || 'https://github.com/ogrenci',
    portfolioUrl: currentUser?.portfolioUrl || 'https://ogrenci-portfolio.dev',
    cvUrl: currentUser?.cvUrl || null,
    cvFileName: currentUser?.cvFileName || '',

    // 12. Privacy & Notifications
    visibilityToEmployers: currentUser?.visibilityToEmployers !== undefined ? currentUser.visibilityToEmployers : true,
    emailNewsletter: currentUser?.emailNewsletter !== undefined ? currentUser.emailNewsletter : true,
    smsAlerts: currentUser?.smsAlerts !== undefined ? currentUser.smsAlerts : false
  });

  // Modal / Inline Form State Helpers
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Orta (B1-B2)');

  // Form add modals
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  const [tempExp, setTempExp] = useState({
    company: '',
    role: '',
    type: 'Staj',
    location: 'İstanbul',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    skills: ''
  });

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [tempProject, setTempProject] = useState({
    title: '',
    role: '',
    date: '',
    liveUrl: '',
    githubUrl: '',
    description: '',
    technologies: ''
  });

  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [tempCert, setTempCert] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [tempExam, setTempExam] = useState({
    examType: 'YDS (Yabancı Dil Bilgisi Seviye Tespit Sınavı)',
    score: '',
    year: new Date().getFullYear().toString()
  });

  const [showAddRefModal, setShowAddRefModal] = useState(false);
  const [tempRef, setTempRef] = useState({
    fullName: '',
    organization: '',
    title: '',
    phone: '',
    email: '',
    type: 'Akademik'
  });

  // Sync with currentUser prop updates
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        ...currentUser,
        studentNo: currentUser.studentNo || currentUser.studentId || prev.studentNo,
        skills: currentUser.skills || prev.skills,
        languages: currentUser.languages || prev.languages,
        clubs: currentUser.clubs || prev.clubs,
        experiences: Array.isArray(currentUser.experiences) && currentUser.experiences.length > 0 ? currentUser.experiences : prev.experiences,
        projects: Array.isArray(currentUser.projects) && currentUser.projects.length > 0 ? currentUser.projects : prev.projects,
        certificates: Array.isArray(currentUser.certificates) && currentUser.certificates.length > 0 ? currentUser.certificates : prev.certificates,
        references: Array.isArray(currentUser.references) && currentUser.references.length > 0 ? currentUser.references : prev.references,
        languageExams: Array.isArray(currentUser.languageExams) && currentUser.languageExams.length > 0 ? currentUser.languageExams : prev.languageExams
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

  // Language Exam Actions
  const handleAddExam = () => {
    if (!tempExam.score.trim()) {
      toast.error('Lütfen sınav puanı giriniz.');
      return;
    }
    const newEntry = {
      id: `lexam-${Date.now()}`,
      examType: tempExam.examType,
      score: tempExam.score.trim(),
      year: tempExam.year || '2025',
      status: 'Doğrulandı'
    };
    handleChange('languageExams', [...(formData.languageExams || []), newEntry]);
    setTempExam({
      examType: 'YDS (Yabancı Dil Bilgisi Seviye Tespit Sınavı)',
      score: '',
      year: new Date().getFullYear().toString()
    });
    setShowAddExamModal(false);
    toast.success('Dil sınavı başarıyla eklendi.');
  };

  const handleRemoveExam = (id) => {
    handleChange('languageExams', (formData.languageExams || []).filter(e => e.id !== id));
    toast.info('Dil sınavı kaldırıldı.');
  };

  // Experience Actions
  const handleAddExperience = () => {
    if (!tempExp.company.trim() || !tempExp.role.trim()) {
      toast.error('Şirket/Kurum adı ve Pozisyon alanları zorunludur.');
      return;
    }
    const newEntry = {
      id: `exp-${Date.now()}`,
      company: tempExp.company.trim(),
      role: tempExp.role.trim(),
      type: tempExp.type,
      location: tempExp.location || 'İstanbul',
      startDate: tempExp.startDate,
      endDate: tempExp.isCurrent ? '' : tempExp.endDate,
      isCurrent: tempExp.isCurrent,
      description: tempExp.description.trim(),
      skills: tempExp.skills ? tempExp.skills.split(',').map(s => s.trim()).filter(Boolean) : []
    };
    handleChange('experiences', [...(formData.experiences || []), newEntry]);
    setTempExp({
      company: '',
      role: '',
      type: 'Staj',
      location: 'İstanbul',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      skills: ''
    });
    setShowAddExpModal(false);
    toast.success('İş/Staj deneyimi başarıyla eklendi.');
  };

  const handleRemoveExperience = (id) => {
    handleChange('experiences', (formData.experiences || []).filter(e => e.id !== id));
    toast.info('Deneyim kaydı kaldırıldı.');
  };

  // Project Actions
  const handleAddProject = () => {
    if (!tempProject.title.trim()) {
      toast.error('Proje başlığı zorunludur.');
      return;
    }
    const newEntry = {
      id: `proj-${Date.now()}`,
      title: tempProject.title.trim(),
      role: tempProject.role.trim() || 'Geliştirici',
      date: tempProject.date || '2025',
      liveUrl: tempProject.liveUrl.trim(),
      githubUrl: tempProject.githubUrl.trim(),
      description: tempProject.description.trim(),
      technologies: tempProject.technologies ? tempProject.technologies.split(',').map(s => s.trim()).filter(Boolean) : []
    };
    handleChange('projects', [...(formData.projects || []), newEntry]);
    setTempProject({
      title: '',
      role: '',
      date: '',
      liveUrl: '',
      githubUrl: '',
      description: '',
      technologies: ''
    });
    setShowAddProjectModal(false);
    toast.success('Proje başarıyla eklendi.');
  };

  const handleRemoveProject = (id) => {
    handleChange('projects', (formData.projects || []).filter(p => p.id !== id));
    toast.info('Proje kaldırıldı.');
  };

  // Certificate Actions
  const handleAddCertificate = () => {
    if (!tempCert.title.trim() || !tempCert.issuer.trim()) {
      toast.error('Sertifika adı ve Veren kurum alanları zorunludur.');
      return;
    }
    const newEntry = {
      id: `cert-${Date.now()}`,
      title: tempCert.title.trim(),
      issuer: tempCert.issuer.trim(),
      issueDate: tempCert.issueDate || '2025',
      credentialId: tempCert.credentialId.trim(),
      credentialUrl: tempCert.credentialUrl.trim()
    };
    handleChange('certificates', [...(formData.certificates || []), newEntry]);
    setTempCert({
      title: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
      credentialUrl: ''
    });
    setShowAddCertModal(false);
    toast.success('Sertifika başarıyla eklendi.');
  };

  const handleRemoveCertificate = (id) => {
    handleChange('certificates', (formData.certificates || []).filter(c => c.id !== id));
    toast.info('Sertifika kaldırıldı.');
  };

  // Reference Actions
  const handleAddReference = () => {
    if (!tempRef.fullName.trim() || !tempRef.organization.trim()) {
      toast.error('Referans kişi adı ve Kurum bilgisi zorunludur.');
      return;
    }
    const newEntry = {
      id: `ref-${Date.now()}`,
      fullName: tempRef.fullName.trim(),
      organization: tempRef.organization.trim(),
      title: tempRef.title.trim(),
      phone: tempRef.phone.trim(),
      email: tempRef.email.trim(),
      type: tempRef.type
    };
    handleChange('references', [...(formData.references || []), newEntry]);
    setTempRef({
      fullName: '',
      organization: '',
      title: '',
      phone: '',
      email: '',
      type: 'Akademik'
    });
    setShowAddRefModal(false);
    toast.success('Referans başarıyla eklendi.');
  };

  const handleRemoveReference = (id) => {
    handleChange('references', (formData.references || []).filter(r => r.id !== id));
    toast.info('Referans kaydı kaldırıldı.');
  };

  // Driving License class toggle
  const toggleLicenseClass = (cls) => {
    const current = formData.drivingLicenseClasses || [];
    const updated = current.includes(cls) 
      ? current.filter(c => c !== cls)
      : [...current, cls];
    handleChange('drivingLicenseClasses', updated);
  };

  // CV File Upload with persistent Base64 Data URI
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Özgeçmiş dosya boyutu 5 MB\'dan küçük olmalıdır.');
        return;
      }
      setUploadedCvName(file.name);
      handleChange('cvFileName', file.name);

      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64Data = evt.target.result;
        handleChange('cvUrl', base64Data);
        toast.success(`${file.name} başarıyla yüklendi.`);
      };
      reader.onerror = () => {
        handleChange('cvUrl', URL.createObjectURL(file));
        toast.success(`${file.name} seçildi.`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Comprehensive ATS Profile Completeness Calculation (0 - 100)
  const completeness = useMemo(() => {
    let score = 0;
    if (formData.name && formData.name.length > 2) score += 10;
    if (formData.studentNo) score += 5;
    if (formData.faculty && formData.department) score += 10;
    if (formData.phone && formData.email) score += 10;
    if (formData.experiences && formData.experiences.length > 0) score += 15; // Experience weight
    if (formData.projects && formData.projects.length > 0) score += 10; // Project weight
    if (formData.certificates && formData.certificates.length > 0) score += 10; // Certificate weight
    if (formData.skills && formData.skills.length >= 3) score += 10;
    if (formData.languages && formData.languages.length >= 1) score += 5;
    if (formData.references && formData.references.length > 0) score += 5; // Reference weight
    if (formData.cvFileName || formData.cvUrl) score += 10;
    return Math.min(score, 100);
  }, [formData]);

  // Save handler with deep two-way synchronization
  const handleSave = (showToast = true) => {
    if (showToast && typeof showToast === 'object' && showToast.preventDefault) {
      showToast.preventDefault();
      showToast = true;
    }

    // Validation
    if (!formData.name || formData.name.trim().length < 2) {
      if (showToast) toast.error('Lütfen geçerli bir Ad Soyad giriniz.');
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      if (showToast) toast.error('Lütfen geçerli bir e-posta adresi giriniz.');
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
      localStorage.setItem('iesu_mock_user', JSON.stringify(updatedUser));
    } catch { /* intentional */}

    // Firestore synchronization for authenticated student accounts
    const studentUid = updatedUser?.uid || updatedUser?.id;
    if (studentUid && !String(studentUid).startsWith('mock_')) {
      import('../../utils/firebase').then(({ db }) => {
        import('firebase/firestore').then(({ doc, setDoc }) => {
          setDoc(doc(db, 'users', studentUid), updatedUser, { merge: true }).catch(() => {});
        }).catch(() => {});
      }).catch(() => {});
    }

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
        action: 'Öğrenci Kapsamlı Profil Bilgileri Güncellendi',
        user: updatedUser.name || 'Öğrenci',
        module: 'Profil',
        role: 'student'
      });
      window.dispatchEvent(new CustomEvent('iesu_user_profile_updated', { detail: updatedUser }));
    } catch (_) {}

    setHasChanges(false);
    if (showToast) {
      toast.success('Öğrenci profil bilgileriniz LinkedIn & Kariyer.net standartlarında kaydedildi.');
    }
  };

  // Comprehensive 11 TABS Architecture
  const TABS = [
    { id: 'academic', label: 'Akademik Eğitim & ÇAP', icon: GraduationCap },
    { id: 'personal', label: 'Kişisel, Askerlik & Ehliyet', icon: User },
    { id: 'experiences', label: 'İş & Staj Deneyimleri', icon: Briefcase, count: formData.experiences?.length || 0 },
    { id: 'projects', label: 'Projeler & Bitirme Tezi', icon: Code2, count: formData.projects?.length || 0 },
    { id: 'certificates', label: 'Sertifikalar & Lisanslar', icon: Award, count: formData.certificates?.length || 0 },
    { id: 'skills', label: 'Yetkinlikler & Dil Sınavları', icon: Sparkles },
    { id: 'career', label: 'Kariyer & Ön Yazı (Kapak)', icon: Target },
    { id: 'references', label: 'Referanslar', icon: Users, count: formData.references?.length || 0 },
    { id: 'clubs', label: 'Kulüp & Topluluklar', icon: Layers },
    { id: 'cv_links', label: 'Özgeçmiş (PDF) & Portfolyo', icon: FileText },
    { id: 'privacy', label: 'Gizlilik & İzinler', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28 animate-fade-in">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (hasChanges) handleSave(false);
                setView('student');
              }} 
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer"
              title="Öğrenci Akışına Dön"
            >
              <ArrowLeft size={18} />
            </button>
            <div 
              role="button" 
              tabIndex={0} 
              onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') { 
                  e.preventDefault(); 
                  if (hasChanges) handleSave(false);
                  setView('student'); 
                } 
              }} 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {
                if (hasChanges) handleSave(false);
                setView('student');
              }}
            >
              <Logo className="h-8 w-auto text-[#990000]" />
              <div className="border-l-2 border-slate-200 pl-3">
                <span className="text-xs font-black text-[#990000] uppercase tracking-wider block">Öğrenci Portalı</span>
                <h1 className="text-base font-black text-gray-900 leading-none">Öğrenci Bilgilerini Düzenle</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasChanges ? (
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Bekleyen Değişiklik</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Güncel ve Senkron</span>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* HERO BANNER & ATS PROGRESS BAR */}
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
                  className="absolute -bottom-2 -right-2 p-1.5 bg-white text-[#990000] rounded-xl shadow-md hover:bg-red-50 transition cursor-pointer"
                  title="Fotoğrafı Değiştir"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-red-500/30 text-white border border-red-400/30 px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider">
                    ÖĞRENCİ BİLGİ SİSTEMİ
                  </span>
                  <span className="text-xs text-red-100 font-mono font-bold">No: {formData.studentNo}</span>
                  <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                    ATS & LinkedIn Uyumlu
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">{formData.name || 'Öğrenci Adı'}</h2>
                <p className="text-red-100 text-sm font-medium">
                  {formData.faculty} • <span className="text-amber-300 font-bold">{formData.department}</span> ({formData.year})
                </p>
              </div>
            </div>

            {/* Completeness Bar */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full md:w-80 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-red-100 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-300" />
                  ATS Profil Doluluk Skoru
                </span>
                <span className="text-white font-black text-sm">%{completeness}</span>
              </div>
              <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 via-teal-300 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-[11px] text-red-200 mt-2">
                {completeness >= 85 
                  ? 'Mükemmel! Özgeçmişiniz kurumsal işveren filtrelerinde en üst sırada listelenir.' 
                  : 'Staj deneyimleri, projeler ve sertifikalarınızı ekleyerek %100 yapın.'}
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
              <div className="p-3 border-b border-slate-100 mb-1 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Profil Sekmeleri</p>
                <span className="text-[11px] font-bold text-slate-500">11 Bölüm</span>
              </div>
              {TABS.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (hasChanges) handleSave(false);
                      setActiveTab(tab.id);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#990000] text-white shadow-sm' 
                        : 'text-slate-600 hover:bg-red-50/60 hover:text-[#990000]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-slate-600'} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          isActive ? 'bg-white/20 text-white' : 'bg-red-50 text-[#990000]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                      <ChevronRight size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                    </div>
                  </button>
                );
              })}

              <div className="mt-4 pt-4 border-t border-slate-100 p-2">
                <button
                  onClick={() => setShowAICVModal(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 text-[#990000] border border-red-200 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
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
                        {IESU_FACULTIES.map(f => (
                          <option key={f.name} value={f.name}>{f.name}</option>
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
                        {((IESU_FACULTIES.find(f => f.name === formData.faculty)?.departments) || ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'İşletme']).map(d => (
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
                            {IESU_FACULTIES.map(f => (
                              <option key={f.name} value={f.name}>{f.name}</option>
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

              {/* TAB 2: PERSONAL & HR LEGAL (Askerlik, Ehliyet - Kariyer.net Standardı) */}
              {activeTab === 'personal' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <User className="text-[#990000]" size={22} />
                      Kişisel, İletişim & Yasal Bilgiler
                    </h3>
                    <p className="text-sm text-slate-500">Kariyer.net ve kurumsal işveren filtrelerinde zorunlu olan iletişim, askerlik ve sürücü belgesi detayları.</p>
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

                  {/* KARIYER.NET HR LEGAL BLOCK: ASKERLİK, EHLİYET, SEYAHAT */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck size={20} className="text-[#990000]" />
                      <h4 className="font-black text-gray-900 text-sm">Resmî İK & Çalışma Uygunluk Kriterleri (Kariyer.net Filtreleri)</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      {/* Askerlik Durumu */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Askerlik Durumu *</label>
                        <select
                          value={formData.militaryStatus}
                          onChange={(e) => handleChange('militaryStatus', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-[#990000]"
                        >
                          <option value="Tecilli">Tecilli (Öğrenci / Mezun)</option>
                          <option value="Yapıldı">Yapıldı (Tamamlandı)</option>
                          <option value="Muaf">Muaf</option>
                          <option value="Muaf (Kadın Aday)">Muaf (Kadın Aday)</option>
                        </select>
                      </div>

                      {/* Tecil Tarihi (Eğer Tecilli ise) */}
                      {formData.militaryStatus === 'Tecilli' && (
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tecil Bitiş Tarihi</label>
                          <input
                            type="date"
                            value={formData.militaryDate}
                            onChange={(e) => handleChange('militaryDate', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none focus:border-[#990000]"
                          />
                        </div>
                      )}

                      {/* Seyahat Durumu */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Seyahat Uygunluğu</label>
                        <select
                          value={formData.travelObstacle}
                          onChange={(e) => handleChange('travelObstacle', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none focus:border-[#990000]"
                        >
                          <option value="Seyahat Engeli Yok">Seyahat Engeli Yok (Yurtiçi/Yurtdışı)</option>
                          <option value="Yurtiçi Seyahat Edebilir">Yalnızca Yurtiçi Seyahat Edebilir</option>
                          <option value="Seyahat Edemez">Seyahat Edemez</option>
                        </select>
                      </div>
                    </div>

                    {/* Sürücü Belgesi (Ehliyet) Seçimi */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-black text-gray-900">Sürücü Belgesi (Ehliyet) Var mı?</p>
                          <p className="text-[11px] text-slate-500">Saha, teknik ve lojistik rollerde işveren aramalarında filtrelenir.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasDrivingLicense}
                            onChange={(e) => handleChange('hasDrivingLicense', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#990000]"></div>
                        </label>
                      </div>

                      {formData.hasDrivingLicense && (
                        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 animate-fade-in">
                          <span className="text-xs font-bold text-slate-600 mr-2">Ehliyet Sınıfları:</span>
                          {['B (Otomobil)', 'A2 (Motosiklet)', 'C (Kamyon)', 'D (Otobüs)', 'SRC 1-2-3-4'].map(cls => {
                            const isSelected = (formData.drivingLicenseClasses || []).includes(cls);
                            return (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => toggleLicenseClass(cls)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#990000] text-white shadow-2xs' 
                                    : 'bg-white border border-slate-200 text-slate-700 hover:border-red-300'
                                }`}
                              >
                                {isSelected && <Check size={12} />}
                                <span>{cls}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
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

              {/* TAB 3: WORK & INTERNSHIP EXPERIENCES (LinkedIn & Kariyer.net) */}
              {activeTab === 'experiences' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Briefcase className="text-[#990000]" size={22} />
                        İş & Staj Deneyimleri (Work Experience)
                      </h3>
                      <p className="text-sm text-slate-500">Daha önce tamamladığınız veya devam eden tüm staj ve çalışma geçmişiniz.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddExpModal(true)}
                      className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus size={16} /> Yeni Deneyim Ekle
                    </button>
                  </div>

                  {/* Experience List */}
                  {(!formData.experiences || formData.experiences.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <Briefcase className="mx-auto text-slate-400 mb-2" size={36} />
                      <h4 className="font-bold text-gray-800 text-sm mb-1">Henüz Deneyim Kaydı Eklenmemiş</h4>
                      <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                        Tamamladığınız zorunlu/gönüllü stajlarınızı veya yarı zamanlı işlerinizi ekleyerek CV puanınızı artırın.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddExpModal(true)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#990000] font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        İlk Staj/İş Deneyimini Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.experiences.map((exp) => (
                        <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-red-200 transition space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0">
                                <Building size={20} />
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900 text-sm">{exp.role}</h4>
                                <p className="text-xs font-bold text-slate-700">{exp.company} • <span className="text-[#990000]">{exp.type}</span></p>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {exp.startDate} - {exp.isCurrent ? <b className="text-emerald-600">Devam Ediyor</b> : (exp.endDate || 'Tamamlandı')}
                                  </span>
                                  {exp.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin size={12} /> {exp.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(exp.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                              title="Deneyimi Sil"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {exp.description && (
                            <p className="text-xs text-slate-600 leading-relaxed pl-13">
                              {exp.description}
                            </p>
                          )}

                          {Array.isArray(exp.skills) && exp.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pl-13 pt-1">
                              {exp.skills.map((sk, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Experience Modal / Form Dialog */}
                  {showAddExpModal && (
                    <div className="p-6 bg-red-50/50 border border-red-200 rounded-2xl space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-red-100 pb-3">
                        <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                          <Plus size={16} className="text-[#990000]" />
                          Yeni İş / Staj Deneyimi Ekle
                        </h4>
                        <button onClick={() => setShowAddExpModal(false)} className="text-slate-500 hover:text-slate-800">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Şirket / Kurum Adı *</label>
                          <input
                            type="text"
                            value={tempExp.company}
                            onChange={(e) => setTempExp({ ...tempExp, company: e.target.value })}
                            placeholder="Örn: Aselsan, Getir, Türk Telekom"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Pozisyon / Rol *</label>
                          <input
                            type="text"
                            value={tempExp.role}
                            onChange={(e) => setTempExp({ ...tempExp, role: e.target.value })}
                            placeholder="Örn: Stajyer Yazılım Mühendisi"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Çalışma Türü</label>
                          <select
                            value={tempExp.type}
                            onChange={(e) => setTempExp({ ...tempExp, type: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          >
                            <option value="Staj">Zorunlu / Gönüllü Staj</option>
                            <option value="Yarı Zamanlı">Yarı Zamanlı (Part-time)</option>
                            <option value="Tam Zamanlı">Tam Zamanlı (Full-time)</option>
                            <option value="Serbest / Proje">Serbest (Freelance) / Proje Bazlı</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Şehir / Lokasyon</label>
                          <input
                            type="text"
                            value={tempExp.location}
                            onChange={(e) => setTempExp({ ...tempExp, location: e.target.value })}
                            placeholder="Örn: İstanbul (Hibrit)"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Başlangıç Tarihi</label>
                          <input
                            type="date"
                            value={tempExp.startDate}
                            onChange={(e) => setTempExp({ ...tempExp, startDate: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Bitiş Tarihi</label>
                          <div className="space-y-1.5">
                            <input
                              type="date"
                              disabled={tempExp.isCurrent}
                              value={tempExp.endDate}
                              onChange={(e) => setTempExp({ ...tempExp, endDate: e.target.value })}
                              className={`w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none ${tempExp.isCurrent ? 'bg-slate-100 cursor-not-allowed opacity-60' : ''}`}
                            />
                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={tempExp.isCurrent}
                                onChange={(e) => setTempExp({ ...tempExp, isCurrent: e.target.checked })}
                                className="rounded text-[#990000] focus:ring-[#990000]"
                              />
                              <span className="text-xs text-slate-700 font-bold">Halen burada çalışıyorum / stajım devam ediyor</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">İş / Görev Tanımı ve Kazanımlar</label>
                        <textarea
                          rows={3}
                          value={tempExp.description}
                          onChange={(e) => setTempExp({ ...tempExp, description: e.target.value })}
                          placeholder="Üstlendiğiniz sorumluluklar, kullandığınız araçlar ve katma değeriniz..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Kullanılan Yetkinlikler (Virgülle ayırın)</label>
                        <input
                          type="text"
                          value={tempExp.skills}
                          onChange={(e) => setTempExp({ ...tempExp, skills: e.target.value })}
                          placeholder="Örn: React, Node.js, Git, Figma, Docker"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddExpModal(false)}
                          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          onClick={handleAddExperience}
                          className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Deneyimi Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PROJECTS & CAPSTONE (LinkedIn Project Showcase) */}
              {activeTab === 'projects' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Code2 className="text-[#990000]" size={22} />
                        Projeler & Bitirme Çalışmaları (Projects)
                      </h3>
                      <p className="text-sm text-slate-500">Teknofest, TÜBİTAK, mezuniyet projesi veya açık kaynak GitHub çalışmalarınız.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddProjectModal(true)}
                      className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus size={16} /> Yeni Proje Ekle
                    </button>
                  </div>

                  {/* Project List */}
                  {(!formData.projects || formData.projects.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <Code2 className="mx-auto text-slate-400 mb-2" size={36} />
                      <h4 className="font-bold text-gray-800 text-sm mb-1">Henüz Proje Eklenmemiş</h4>
                      <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                        Teknik yeteneklerinizi kanıtlayan projeleri ekleyin; işverenler kod ve canlı demo linklerini incelesin.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddProjectModal(true)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#990000] font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        İlk Projeyi Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.projects.map((proj) => (
                        <div key={proj.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-red-200 transition space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-black text-gray-900 text-sm leading-snug">{proj.title}</h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveProject(proj.id)}
                                className="text-slate-400 hover:text-red-600 transition p-1"
                                title="Projeyi Sil"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p className="text-xs font-bold text-[#990000]">{proj.role} <span className="text-slate-400 font-normal">({proj.date})</span></p>
                            <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                          </div>

                          <div className="space-y-3 pt-2 border-t border-slate-100">
                            {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {proj.technologies.map((t, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              {proj.liveUrl && (
                                <a
                                  href={proj.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <ExternalLink size={12} /> Canlı Demo
                                </a>
                              )}
                              {proj.githubUrl && (
                                <a
                                  href={proj.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                                >
                                  <Code2 size={12} /> GitHub Kodu
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Project Form */}
                  {showAddProjectModal && (
                    <div className="p-6 bg-red-50/50 border border-red-200 rounded-2xl space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-red-100 pb-3">
                        <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                          <Plus size={16} className="text-[#990000]" />
                          Yeni Proje Kaydı Ekle
                        </h4>
                        <button onClick={() => setShowAddProjectModal(false)} className="text-slate-500 hover:text-slate-800">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Proje Adı *</label>
                          <input
                            type="text"
                            value={tempProject.title}
                            onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
                            placeholder="Örn: Akıllı Tarım İHA Sistemi"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Projedeki Rolünüz</label>
                          <input
                            type="text"
                            value={tempProject.role}
                            onChange={(e) => setTempProject({ ...tempProject, role: e.target.value })}
                            placeholder="Örn: Takım Kaptanı / Gömülü Yazılımcı"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Canlı Demo / Yayın Linki</label>
                          <input
                            type="url"
                            value={tempProject.liveUrl}
                            onChange={(e) => setTempProject({ ...tempProject, liveUrl: e.target.value })}
                            placeholder="https://proje-demo.com"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">GitHub / GitLab Repository URL</label>
                          <input
                            type="url"
                            value={tempProject.githubUrl}
                            onChange={(e) => setTempProject({ ...tempProject, githubUrl: e.target.value })}
                            placeholder="https://github.com/kullanici/repo"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Proje Açıklaması ve Çözülen Problem</label>
                        <textarea
                          rows={3}
                          value={tempProject.description}
                          onChange={(e) => setTempProject({ ...tempProject, description: e.target.value })}
                          placeholder="Projenin amacı, kullanılan mimari ve elde edilen sonuç..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium text-gray-800 outline-none resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Kullanılan Teknolojiler (Virgülle ayırın)</label>
                        <input
                          type="text"
                          value={tempProject.technologies}
                          onChange={(e) => setTempProject({ ...tempProject, technologies: e.target.value })}
                          placeholder="Örn: Python, OpenCV, Raspberry Pi, FastAPI"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddProjectModal(false)}
                          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          onClick={handleAddProject}
                          className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Projeyi Ekle
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: CERTIFICATES & LICENSES */}
              {activeTab === 'certificates' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Award className="text-[#990000]" size={22} />
                        Sertifikalar & Lisanslar (Licenses & Certifications)
                      </h3>
                      <p className="text-sm text-slate-500">BTK Akademi, Coursera, Cisco, Google, AWS ve üniversite onaylı sertifikalarınız.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddCertModal(true)}
                      className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus size={16} /> Yeni Sertifika Ekle
                    </button>
                  </div>

                  {(!formData.certificates || formData.certificates.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <Award className="mx-auto text-slate-400 mb-2" size={36} />
                      <h4 className="font-bold text-gray-800 text-sm mb-1">Henüz Sertifika Eklenmemiş</h4>
                      <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                        Yetkinliklerinizi resmîleştiren sertifika ve eğitim belgelerini ekleyin.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddCertModal(true)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#990000] font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        İlk Sertifikayı Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.certificates.map((cert) => (
                        <div key={cert.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-red-200 transition flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <Award size={20} />
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 text-sm">{cert.title}</h4>
                              <p className="text-xs font-bold text-slate-700">{cert.issuer} • <span className="text-slate-400 font-normal">{cert.issueDate}</span></p>
                              {cert.credentialId && (
                                <p className="text-[11px] font-mono text-slate-500 mt-0.5">ID: {cert.credentialId}</p>
                              )}
                              {cert.credentialUrl && (
                                <a
                                  href={cert.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-[#990000] hover:underline flex items-center gap-1 mt-1"
                                >
                                  <ExternalLink size={12} /> Sertifikayı Doğrula
                                </a>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificate(cert.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                            title="Sertifikayı Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Certificate Modal */}
                  {showAddCertModal && (
                    <div className="p-6 bg-red-50/50 border border-red-200 rounded-2xl space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-red-100 pb-3">
                        <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                          <Plus size={16} className="text-[#990000]" />
                          Yeni Sertifika / Lisans Ekle
                        </h4>
                        <button onClick={() => setShowAddCertModal(false)} className="text-slate-500 hover:text-slate-800">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Sertifika / Eğitim Adı *</label>
                          <input
                            type="text"
                            value={tempCert.title}
                            onChange={(e) => setTempCert({ ...tempCert, title: e.target.value })}
                            placeholder="Örn: AWS Certified Cloud Practitioner"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Veren Kurum / Organizasyon *</label>
                          <input
                            type="text"
                            value={tempCert.issuer}
                            onChange={(e) => setTempCert({ ...tempCert, issuer: e.target.value })}
                            placeholder="Örn: Amazon Web Services / Coursera"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Alınma Tarihi</label>
                          <input
                            type="month"
                            value={tempCert.issueDate}
                            onChange={(e) => setTempCert({ ...tempCert, issueDate: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Sertifika No / Credential ID</label>
                          <input
                            type="text"
                            value={tempCert.credentialId}
                            onChange={(e) => setTempCert({ ...tempCert, credentialId: e.target.value })}
                            placeholder="Örn: AWS-CCP-987452"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">Doğrulama URL'si (Credential URL)</label>
                        <input
                          type="url"
                          value={tempCert.credentialUrl}
                          onChange={(e) => setTempCert({ ...tempCert, credentialUrl: e.target.value })}
                          placeholder="https://aws.amazon.com/verify/..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCertModal(false)}
                          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          onClick={handleAddCertificate}
                          className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Sertifikayı Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SKILLS & OFFICIAL LANGUAGE EXAMS */}
              {activeTab === 'skills' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Sparkles className="text-[#990000]" size={22} />
                      Yetkinlikler & Yabancı Dil Sınavları
                    </h3>
                    <p className="text-sm text-slate-500">Teknik yetenekler ve kurumsal işe alımlarda aranan resmî YDS / TOEFL / IELTS sınav skorları.</p>
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
                        className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(Array.isArray(formData.skills) ? formData.skills : []).map(skill => (
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
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">Yabancı Diller (Konuşma & Yazma Seviyesi)</label>
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
                        className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={16} /> Ekle
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(Array.isArray(formData.languages) ? formData.languages : []).map((lang, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <Globe size={18} className="text-slate-600" />
                            <span className="font-bold text-sm text-gray-900">{lang.name}</span>
                            <span className="text-xs text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-bold">{lang.level}</span>
                          </div>
                          <button onClick={() => handleRemoveLanguage(idx)} className="text-slate-500 hover:text-red-600 transition cursor-pointer">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* OFFICIAL STANDARDIZED LANGUAGE EXAMS (YDS / TOEFL / IELTS) */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Resmî Dil Sınav Skorları (YDS, YÖKDİL, TOEFL, IELTS)</label>
                        <p className="text-[11px] text-slate-500">Savunma sanayii, bankacılık ve kurumsal firmaların ATS filtrelerinde zorunludur.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAddExamModal(true)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#990000] font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} /> Sınav Puanı Ekle
                      </button>
                    </div>

                    {(!formData.languageExams || formData.languageExams.length === 0) ? (
                      <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                        Henüz sınav skoru girilmedi. YDS, TOEFL veya IELTS belgeniz varsa ekleyiniz.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {formData.languageExams.map((exam) => (
                          <div key={exam.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileCheck size={18} className="text-emerald-600" />
                              <div>
                                <span className="font-black text-xs text-gray-900">{exam.examType}</span>
                                <span className="text-xs text-slate-500 ml-2">({exam.year})</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-black">
                                Puan: {exam.score}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveExam(exam.id)}
                                className="text-slate-400 hover:text-red-600 transition"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {showAddExamModal && (
                      <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Sınav Türü</label>
                            <select
                              value={tempExam.examType}
                              onChange={(e) => setTempExam({ ...tempExam, examType: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-bold text-gray-800 outline-none"
                            >
                              <option value="YDS (Yabancı Dil Seviye Tespit Sınavı)">YDS (ÖSYM)</option>
                              <option value="YÖKDİL (Yükseköğretim Kurumları Dil Sınavı)">YÖKDİL</option>
                              <option value="TOEFL IBT">TOEFL IBT</option>
                              <option value="IELTS Academic">IELTS Academic</option>
                              <option value="PTE Academic">PTE Academic</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Puan</label>
                            <input
                              type="text"
                              value={tempExam.score}
                              onChange={(e) => setTempExam({ ...tempExam, score: e.target.value })}
                              placeholder="Örn: 85 veya 7.5"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-black text-gray-800 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Sınav Yılı</label>
                            <input
                              type="text"
                              value={tempExam.year}
                              onChange={(e) => setTempExam({ ...tempExam, year: e.target.value })}
                              placeholder="2025"
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-gray-800 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddExamModal(false)}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg cursor-pointer"
                          >
                            İptal
                          </button>
                          <button
                            type="button"
                            onClick={handleAddExam}
                            className="px-4 py-1.5 bg-[#990000] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                          >
                            Puanı Ekle
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 7: CAREER GOALS & COVER LETTER (Kariyer.net Kapak Mektubu) */}
              {activeTab === 'career' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <Target className="text-[#990000]" size={22} />
                      Kariyer Hedefleri & Ön Yazı (Kapak Mektubu)
                    </h3>
                    <p className="text-sm text-slate-500">Zorunlu ve gönüllü staj süreçleriniz, hedeflediğiniz roller ve iş başvurularında otomatik iletilecek ön yazı şablonunuz.</p>
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

                  {/* KARIYER.NET STANDARD COVER LETTER (ÖN YAZI / KAPAK MEKTUBU) */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Resmî Ön Yazı / Kapak Mektubu (Cover Letter)
                      </label>
                      <span className="text-[11px] text-slate-500 font-medium">Tek tıkla iş başvurularında kullanılır</span>
                    </div>
                    <textarea
                      rows={6}
                      value={formData.coverLetter}
                      onChange={(e) => handleChange('coverLetter', e.target.value)}
                      placeholder="İşverenlere hitaben kendinizi tanıtan ve motivasyonunuzu açıklayan kurumsal ön yazı metniniz..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-gray-800 focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 8: REFERENCES (Akademik & Sektörel Referanslar) */}
              {activeTab === 'references' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <Users className="text-[#990000]" size={22} />
                        Akademik & Sektörel Referanslar (References)
                      </h3>
                      <p className="text-sm text-slate-500">Sizi tanıyan ve referans olabilecek danışman hocalarınız veya eski staj amirleriniz.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddRefModal(true)}
                      className="px-4 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus size={16} /> Yeni Referans Ekle
                    </button>
                  </div>

                  {(!formData.references || formData.references.length === 0) ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                      <Users className="mx-auto text-slate-400 mb-2" size={36} />
                      <h4 className="font-bold text-gray-800 text-sm mb-1">Henüz Referans Eklenmemiş</h4>
                      <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                        Kurumsal şirketlerin işe alım süreçlerinde aradığı akademik veya profesyonel referanslarınızı ekleyin.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowAddRefModal(true)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#990000] font-bold text-xs rounded-xl transition cursor-pointer"
                      >
                        İlk Referansı Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.references.map((ref) => (
                        <div key={ref.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-red-200 transition space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                                {ref.fullName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900 text-sm">{ref.fullName}</h4>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                                  ref.type === 'Akademik' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {ref.type}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveReference(ref.id)}
                              className="text-slate-400 hover:text-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                            <p className="font-bold text-gray-800">{ref.title}</p>
                            <p className="text-slate-500">{ref.organization}</p>
                            {ref.email && <p className="text-slate-500 flex items-center gap-1.5"><Mail size={12} /> {ref.email}</p>}
                            {ref.phone && <p className="text-slate-500 flex items-center gap-1.5"><Phone size={12} /> {ref.phone}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Reference Modal */}
                  {showAddRefModal && (
                    <div className="p-6 bg-red-50/50 border border-red-200 rounded-2xl space-y-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-red-100 pb-3">
                        <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                          <Plus size={16} className="text-[#990000]" />
                          Yeni Referans Ekle
                        </h4>
                        <button onClick={() => setShowAddRefModal(false)} className="text-slate-500 hover:text-slate-800">
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Referans Adı Soyadı *</label>
                          <input
                            type="text"
                            value={tempRef.fullName}
                            onChange={(e) => setTempRef({ ...tempRef, fullName: e.target.value })}
                            placeholder="Örn: Prof. Dr. Ayşe Yılmaz"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Referans Türü</label>
                          <select
                            value={tempRef.type}
                            onChange={(e) => setTempRef({ ...tempRef, type: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 outline-none"
                          >
                            <option value="Akademik">Akademik Referans (Hoca / Danışman)</option>
                            <option value="Sektörel / Profesyonel">Sektörel (Eski Staj Amiri / Yönetici)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Kurum / Üniversite / Şirket *</label>
                          <input
                            type="text"
                            value={tempRef.organization}
                            onChange={(e) => setTempRef({ ...tempRef, organization: e.target.value })}
                            placeholder="Örn: İstanbul Esenyurt Üniversitesi"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Unvanı / Pozisyonu</label>
                          <input
                            type="text"
                            value={tempRef.title}
                            onChange={(e) => setTempRef({ ...tempRef, title: e.target.value })}
                            placeholder="Örn: Bölüm Başkanı / Kıdemli Yazılım Mühendisi"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">İletişim E-Postası</label>
                          <input
                            type="email"
                            value={tempRef.email}
                            onChange={(e) => setTempRef({ ...tempRef, email: e.target.value })}
                            placeholder="Örn: hoca@esenyurt.edu.tr"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">İletişim Telefonu</label>
                          <input
                            type="tel"
                            value={tempRef.phone}
                            onChange={(e) => setTempRef({ ...tempRef, phone: e.target.value })}
                            placeholder="Örn: 0212 911 00 00"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddRefModal(false)}
                          className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          onClick={handleAddReference}
                          className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                        >
                          Referansı Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 9: CLUBS & ACTIVITIES */}
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
                    {(Array.isArray(formData.clubs) ? formData.clubs : []).map(club => (
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
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
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
                      className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Öğrenci Kulüpleri Portalına Git
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 10: CV FILE & DIGITAL PORTFOLIO LINKS */}
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
                    
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        {uploadedCvName ? 'Farklı Bir Dosya Seç' : 'Dosya Seç'}
                      </button>
                      <button
                        onClick={() => setShowAICVModal(true)}
                        className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-[#990000] font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles size={14} className="text-amber-500" />
                        Akıllı CV Oluştur
                      </button>
                    </div>

                    {/* Active Uploaded CV Information Card */}
                    {(uploadedCvName || formData.cvUrl) && (
                      <div className="mt-5 p-3.5 bg-white border border-emerald-200 rounded-xl flex items-center justify-between text-left max-w-lg mx-auto shadow-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={20} />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-black text-gray-900 truncate">
                              {uploadedCvName || formData.cvFileName || 'Aktif Özgeçmiş'}
                            </p>
                            <span className="text-[10px] font-bold text-emerald-600 block">
                              Sistemde Kayıtlı & Başvurulara Açık
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          {formData.cvUrl && (
                            <a
                              href={formData.cvUrl}
                              download={uploadedCvName || formData.cvFileName || 'iesu_ozgecmis.pdf'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                              title="CV'yi İndir / İncele"
                            >
                              <Download size={14} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              handleChange('cvUrl', null);
                              handleChange('cvFileName', '');
                              setUploadedCvName('');
                              toast.info('Yüklü CV kaldırıldı.');
                            }}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer"
                            title="CV'yi Kaldır"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
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

              {/* TAB 11: PRIVACY & PERMISSIONS */}
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
                  onClick={() => {
                    if (hasChanges) handleSave(false);
                    setView('student');
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer"
                >
                  İptal & Geri Dön
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="px-7 py-3 bg-[#990000] hover:bg-red-800 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
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
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
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
