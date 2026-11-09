import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  FileText, Wand2, Plus, Trash2, Download, Printer, User, Briefcase, 
  GraduationCap, Award, Mail, Phone, MapPin, Search, ChevronLeft, 
  ShieldCheck, Home, Compass, MessageCircle, Bell, Dna, Sparkles,
  Link2, Globe, Check, Eye, Edit3, CheckCircle2, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import { toast } from './shared/Toast';
import { generateAIResponse } from '../lib/gemini';
import { exportPDF } from '../lib/pdfExporter';
import EuroPassExportModal from './global/EuroPassExportModal';

export default function AICVBuilder({ currentUser, userRole, setView, setSelectedUserId, onUpdateProfile, previousView, messages, academicRole }) {
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const backTarget = previousView || (
    activePortalBranch && ['student', 'alumni', 'academic', 'company', 'admin'].includes(activePortalBranch) ? activePortalBranch :
    (userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')
  );

  const [showEuroPassModal, setShowEuroPassModal] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'certificates'
  const [mobileViewMode, setMobileViewMode] = useState('editor'); // 'editor' | 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern' | 'ats' | 'executive'
  const [photoError, setPhotoError] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);

  // New Skill & Language state
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('B2 (Orta - İleri)');

  // Initialize from localStorage OR currentUser
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn("Failed to load CV draft", e);
    }

    const defaultRole = userRole === 'alumni' || currentUser?.role === 'alumni' ? 'alumni' : 'student';
    const defaultTitle = defaultRole === 'alumni'
      ? (currentUser?.department ? `${currentUser.department} Mezunu` : 'İESÜ Mezunu')
      : (currentUser?.department ? `${currentUser.department} Öğrencisi` : 'İESÜ Öğrencisi');

    return {
      name: currentUser?.name || 'Caner Öztürk',
      photo: currentUser?.avatar || '/iesu-logo.svg',
      title: currentUser?.title || defaultTitle,
      email: currentUser?.email || 'caner@esenyurt.edu.tr',
      phone: currentUser?.phone || '+90 532 000 00 00',
      location: currentUser?.location || currentUser?.city || 'İstanbul, Türkiye',
      linkedin: currentUser?.linkedin || 'linkedin.com/in/canerozturk',
      github: currentUser?.github || 'github.com/canerozturk',
      website: '',
      summary: currentUser?.bio || currentUser?.summary || 'İstanbul Esenyurt Üniversitesi bünyesinde edindiğim teorik ve uygulamalı yetkinliklerle; teknoloji, inovasyon ve problem çözme odaklı projelerde aktif değer üretmeyi hedefliyorum.',
      gpa: currentUser?.gpa || '3.42',
      thesis: currentUser?.thesis || '',
      academicProjects: '',
      experience: [
        {
          id: 1,
          company: 'Teknoloji & Yazılım Çözümleri A.Ş.',
          role: 'Stajyer Yazılım Geliştirici',
          type: 'Zorunlu Staj',
          date: 'Temmuz 2025 - Eylül 2025',
          desc: 'Modern web uygulamalarında React ve Node.js entegrasyonu sağlandı. RESTful API servisleri geliştirildi ve test otomasyon süreçlerine katkı sunuldu.'
        }
      ],
      education: [
        {
          id: 1,
          institution: 'İstanbul Esenyurt Üniversitesi',
          degree: `${currentUser?.faculty || 'Mühendislik ve Mimarlık Fakültesi'} - ${currentUser?.department || 'Bilgisayar Mühendisliği'}`,
          date: '2022 - 2026',
          gpa: '3.42 / 4.00',
          desc: 'Yapay Zekâ ve Dağıtık Sistemler odaklı lisans eğitimi.'
        }
      ],
      skills: currentUser?.skills?.length > 0 
        ? currentUser.skills 
        : ['JavaScript (ES6+)', 'React.js', 'Python', 'SQL & Veri Modelleme', 'Git & GitHub', 'Agile / Scrum Metodolojileri'],
      languages: [
        { id: 1, lang: 'Türkçe', level: 'Ana Dil' },
        { id: 2, lang: 'İngilizce', level: 'B2 (Profesyonel Çalışma)' }
      ],
      certificates: (currentUser?.certificates || []).map((c, i) => ({
        id: c.id || i + 1,
        name: c.name || c.title || 'Sertifika',
        issuer: c.issuer || 'İESÜ Sürekli Eğitim Merkezi',
        date: c.date || '2025',
        desc: ''
      }))
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
    } catch (_) {}
    setPhotoError(false);
  }, [cvData, currentUser?.id]);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  // Calculate CV Health / Completeness Score
  const cvScore = useMemo(() => {
    let score = 20; // base
    if (cvData.name && cvData.name.trim().length > 3) score += 10;
    if (cvData.email && cvData.email.includes('@')) score += 10;
    if (cvData.phone && cvData.phone.length > 7) score += 10;
    if (cvData.summary && cvData.summary.trim().length > 40) score += 15;
    if (cvData.education && cvData.education.length > 0) score += 15;
    if (cvData.experience && cvData.experience.length > 0) score += 10;
    if (cvData.skills && cvData.skills.length >= 3) score += 10;
    return Math.min(100, score);
  }, [cvData]);

  // ─── AI HANDLERS ───
  const handleAIGenerateSummary = useCallback(async (tone = 'professional') => {
    setIsGenerating(true);
    toast.info('ANKA AI kariyer özetinizi hazırlıyor...');

    const prompt = `
Sen İstanbul Esenyurt Üniversitesi (İESÜ) Kariyer Geliştirme Koordinatörlüğü asistanı ANKA'sın.
Aday Bilgileri:
- Ad: ${cvData.name}
- Alan / Bölüm: ${cvData.title}
- Eğitim: ${cvData.education.map(e => `${e.degree} (${e.institution})`).join(', ')}
- Yetenekler: ${cvData.skills.join(', ')}
- Deneyimler: ${cvData.experience.map(e => `${e.role} @ ${e.company}`).join(', ')}

İstenen Ton: ${tone === 'impact' ? 'Sonuç ve başarı odaklı (Impact-driven)' : tone === 'ats' ? 'ATS anahtar kelime optimizasyonlu ve net' : 'Yeni mezun ve gelişim odaklı'}

Lütfen adayın CV'sinde kullanılacak, profesyonel, yapay klişelerden uzak, birinci tekil şahıs ("Ben") veya üçüncü şahıs nesnel dilinde en fazla 3 cümlelik etkileyici bir kariyer özeti üret. Sadece saf metin ver.
    `;

    try {
      const response = await generateAIResponse(prompt, "Sadece özet metnini ver. Ekstra açıklama yapma.");
      if (response && typeof response === 'string' && !response.includes('ulaşılamıyor')) {
        const cleanText = response.replace(/^["']|["']$/g, '').trim();
        setCvData(prev => ({ ...prev, summary: cleanText }));
        toast.success('Yapay zekâ destekli kariyer özeti başarıyla oluşturuldu!');
      } else {
        throw new Error('AI fallback');
      }
    } catch {
      const fallbackSummary = `${cvData.title || 'Alanında'} edindiğim kurumsal ve akademik yetkinliklerle, dinamik çalışma ortamlarında analitik çözümler üreten ve sürekli gelişime açık profesyonel bir adayım.`;
      setCvData(prev => ({ ...prev, summary: fallbackSummary }));
      toast.success('Örnek kariyer özeti uygulandı!');
    } finally {
      if (isMounted.current) setIsGenerating(false);
    }
  }, [cvData.name, cvData.title, cvData.education, cvData.skills, cvData.experience]);

  const evolveCVWithGeneticAlgorithms = useCallback(async () => {
    setIsEvolving(true);
    toast.info('ATS anahtar kelimeleri ve etki analizi yürütülüyor...');
    const department = cvData.title || currentUser?.department || 'Genel';
    const currentSkills = (cvData.skills || []).join(', ') || 'Yok';

    const prompt = `Öğrencinin alanı: ${department}. Mevcut yetkinlikleri: ${currentSkills}.
Bu öğrencinin CV'sini ATS (Aday Takip Sistemi) filtrelerinden başarıyla geçirecek, sektör standardı en güncel 5 adet teknik ve metodolojik yetkinliği JSON formatında üret.
JSON formatı: { "skills": ["Yetkinlik 1", "Yetkinlik 2", "Yetkinlik 3", "Yetkinlik 4", "Yetkinlik 5"] }`;

    try {
      const response = await generateAIResponse(prompt, 'Sadece saf JSON formatında cevap ver.');
      let parsed = null;
      if (response) {
        try {
          const clean = response.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
          parsed = JSON.parse(clean);
        } catch (_) {}
      }

      const recommendedSkills = Array.isArray(parsed?.skills) && parsed.skills.length > 0
        ? parsed.skills
        : ["Agile & Scrum", "Veri Analitiği", "REST API Mimarisi", "Çözüm Odaklı Problem Çözme", "CI/CD & DevOps"];

      setCvData(prev => ({
        ...prev,
        skills: [...new Set([...(prev.skills || []), ...recommendedSkills])]
      }));
      toast.success('CV başarıyla ATS anahtar kelimeleriyle zenginleştirildi!');
    } catch {
      setCvData(prev => ({
        ...prev,
        skills: [...new Set([...(prev.skills || []), "Agile & Scrum", "Veri Analitiği", "Proje Yönetimi", "Problem Çözme"])]
      }));
      toast.success('ATS yetkinlikleri başarıyla eklendi!');
    } finally {
      if (isMounted.current) setIsEvolving(false);
    }
  }, [cvData.title, cvData.skills, currentUser?.department]);

  const handleSaveToProfile = useCallback(() => {
    try {
      localStorage.setItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
    } catch (_) {}

    if (onUpdateProfile) {
      onUpdateProfile(cvData);
    } else {
      const store = useAppStore.getState();
      if (currentUser?.id && store.setCurrentUser) {
        const updated = {
          ...currentUser,
          cv: true,
          bio: cvData.summary || currentUser.bio,
          skills: cvData.skills?.length ? cvData.skills : currentUser.skills
        };
        store.setCurrentUser(updated);
        if (store.setStudents && userRole === 'student' && store.students) {
          store.setStudents(store.students.map(s => s.id === currentUser.id ? { ...s, ...updated } : s));
        } else if (store.setAlumni && userRole === 'alumni' && store.alumni) {
          store.setAlumni(store.alumni.map(a => a.id === currentUser.id ? { ...a, ...updated } : a));
        }
      }
    }
    toast.success('Özgeçmişiniz başarıyla kaydedildi ve profilinizle eşitlendi!');
  }, [cvData, currentUser, userRole, onUpdateProfile]);

  // ─── CRUD OPERATIONS ───
  const handleAddExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), company: '', role: '', type: 'Zorunlu Staj', date: '2025', desc: '' }
      ]
    }));
    setActiveTab('experience');
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    toast.info('Deneyim kaydı silindi.');
  };

  const handleAddEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), institution: 'İstanbul Esenyurt Üniversitesi', degree: '', date: '2022 - 2026', gpa: '', desc: '' }
      ]
    }));
    setActiveTab('education');
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    toast.info('Eğitim kaydı silindi.');
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !cvData.skills.includes(trimmed)) {
      setCvData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill('');
      toast.success(`'${trimmed}' yeteneği eklendi.`);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleAddLanguage = () => {
    const trimmed = newLang.trim();
    if (trimmed) {
      setCvData(prev => ({
        ...prev,
        languages: [...prev.languages, { id: Date.now(), lang: trimmed, level: newLangLevel }]
      }));
      setNewLang('');
      setNewLangLevel('B2 (Orta - İleri)');
      toast.success(`'${trimmed}' dili eklendi.`);
    }
  };

  const handleRemoveLanguage = (id) => {
    setCvData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  };

  const handleAddCertificate = () => {
    setCvData(prev => ({
      ...prev,
      certificates: [
        ...prev.certificates,
        { id: Date.now(), name: '', issuer: '', date: '2025', desc: '' }
      ]
    }));
    setActiveTab('certificates');
  };

  const updateCertificate = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates.map(cert => cert.id === id ? { ...cert, [field]: value } : cert)
    }));
  };

  const removeCertificate = (id) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== id)
    }));
    toast.info('Sertifika kaydı silindi.');
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-28 font-sans">
      {/* ─── HEADER ─── */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-xs hide-on-print">
        <div className="flex items-center gap-3.5 shrink-0">
          <button
            onClick={() => setView && setView(backTarget)}
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shadow-2xs group shrink-0"
            title="Geri Dön"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView && setView(backTarget)}>
            <Logo className="h-8 w-auto text-[#990000]" />
            <div className="hidden sm:block text-left">
              <h1 className="font-black text-slate-900 text-sm sm:text-base leading-tight">Akıllı CV Stüdyosu</h1>
              <p className="text-[10px] font-bold text-[#990000] uppercase tracking-wider">İESÜ Kariyer Geliştirme Koordinatörlüğü • ATS Uyumlu Özgeçmiş</p>
            </div>
          </div>
        </div>

        {/* CV Completeness Score Badge & Top Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">CV Doluluk</span>
            <div className="w-16 h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${cvScore}%` }} />
            </div>
            <span className="text-xs font-black text-emerald-700 font-mono">%{cvScore}</span>
          </div>

          <TopProfileMenu currentUser={currentUser} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} />
        </div>
      </header>

      {/* ─── ACTION TOOLBAR ─── */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 sticky top-16 z-30 shadow-2xs hide-on-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Mobile View Switcher & Template Select */}
          <div className="flex items-center gap-2">
            {/* Mobile View Toggle */}
            <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setMobileViewMode('editor')}
                className={`px-3 py-1.5 rounded-lg transition ${mobileViewMode === 'editor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                <Edit3 size={13} className="inline mr-1" /> Düzenle
              </button>
              <button
                onClick={() => setMobileViewMode('preview')}
                className={`px-3 py-1.5 rounded-lg transition ${mobileViewMode === 'preview' ? 'bg-white text-[#990000] shadow-xs' : 'text-slate-600'}`}
              >
                <Eye size={13} className="inline mr-1" /> Önizleme
              </button>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1.5 hidden sm:inline">Şablon:</span>
              <button
                onClick={() => setSelectedTemplate('modern')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${selectedTemplate === 'modern' ? 'bg-white text-[#990000] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Modern İESÜ
              </button>
              <button
                onClick={() => setSelectedTemplate('ats')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${selectedTemplate === 'ats' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ATS Minimal
              </button>
              <button
                onClick={() => setSelectedTemplate('executive')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${selectedTemplate === 'executive' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Mezun Zümrüt
              </button>
            </div>
          </div>

          {/* Right: Export & Save Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEuroPassModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#003399] hover:bg-[#002266] text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="EuroPass JSON-LD & Bologna Diploma Eki"
            >
              <Award size={14} className="text-amber-300" />
              <span className="hidden sm:inline">EuroPass İhracı</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Yazdır"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Yazdır</span>
            </button>

            <button
              onClick={() => exportPDF('cv-print-area', `${cvData.name || 'Ozgecmisim'}_CV.pdf`)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#990000] hover:bg-red-800 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Yüksek Çözünürlüklü PDF İndir"
            >
              <Download size={14} />
              <span>PDF İndir</span>
            </button>

            <button
              onClick={handleSaveToProfile}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Profil ile eşitle ve kaydet"
            >
              <ShieldCheck size={14} />
              <span>Kaydet & Eşitle</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MAIN DUAL PANEL WORKSPACE ─── */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ══════════ LEFT COLUMN: INTERACTIVE CV EDITOR ══════════ */}
          <div className={`lg:col-span-5 space-y-6 ${mobileViewMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            
            {/* Editor Tab Navigation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'personal', label: 'Kişisel', icon: <User size={13} /> },
                { id: 'summary', label: 'Özet (AI)', icon: <Sparkles size={13} /> },
                { id: 'experience', label: 'Deneyim', icon: <Briefcase size={13} /> },
                { id: 'education', label: 'Eğitim', icon: <GraduationCap size={13} /> },
                { id: 'skills', label: 'Yetenekler', icon: <Dna size={13} /> },
                { id: 'languages', label: 'Diller', icon: <Globe size={13} /> },
                { id: 'certificates', label: 'Sertifikalar', icon: <Award size={13} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-[#990000] border border-red-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: 1. Kişisel & İletişim */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <User size={16} className="text-[#990000]" /> Kişisel & İletişim Bilgileri
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adım 1 / 7</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">Ad Soyad *</label>
                    <input
                      type="text"
                      value={cvData.name}
                      onChange={e => setCvData({ ...cvData, name: e.target.value })}
                      placeholder="Adınız ve Soyadınız"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">Profesyonel Unvan / Pozisyon *</label>
                    <input
                      type="text"
                      value={cvData.title}
                      onChange={e => setCvData({ ...cvData, title: e.target.value })}
                      placeholder="Örn: Bilgisayar Mühendisliği Mezunu | Frontend Developer"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">E-posta Adresi *</label>
                      <input
                        type="email"
                        value={cvData.email}
                        onChange={e => setCvData({ ...cvData, email: e.target.value })}
                        placeholder="ad@esenyurt.edu.tr"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">Telefon Numarası *</label>
                      <input
                        type="tel"
                        value={cvData.phone}
                        onChange={e => setCvData({ ...cvData, phone: e.target.value })}
                        placeholder="+90 5xx xxx xx xx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">Şehir / Konum</label>
                      <input
                        type="text"
                        value={cvData.location}
                        onChange={e => setCvData({ ...cvData, location: e.target.value })}
                        placeholder="İstanbul, Türkiye"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">LinkedIn Profili</label>
                      <input
                        type="text"
                        value={cvData.linkedin}
                        onChange={e => setCvData({ ...cvData, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/profiliniz"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">GitHub / Portfolyo Web Sitesi</label>
                    <input
                      type="text"
                      value={cvData.github}
                      onChange={e => setCvData({ ...cvData, github: e.target.value })}
                      placeholder="github.com/kullaniciadi veya portfolyo adresi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 2. Özet & Yapay Zeka */}
            {activeTab === 'summary' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-600" /> Profesyonel Kariyer Özeti
                  </h3>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                    ANKA AI Destekli
                  </span>
                </div>

                {/* AI Prompt Buttons */}
                <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl space-y-2">
                  <p className="text-[11px] font-bold text-purple-900">
                    ✨ Tek Tıkla Yapay Zekâ Kariyer Özeti Üret:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleAIGenerateSummary('professional')}
                      disabled={isGenerating}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-purple-800 hover:bg-purple-100 border border-purple-200 transition cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <Sparkles size={12} className={isGenerating ? 'animate-spin' : ''} />
                      Profesyonel & Net
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAIGenerateSummary('impact')}
                      disabled={isGenerating}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <Award size={12} />
                      Etki & Sonuç Odaklı
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAIGenerateSummary('ats')}
                      disabled={isGenerating}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-800 hover:bg-indigo-100 border border-indigo-200 transition cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <Dna size={12} />
                      ATS Filtresi Uyumlu
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">
                    Özet Metniniz (İstediğiniz gibi düzenleyebilirsiniz):
                  </label>
                  <textarea
                    rows={5}
                    value={cvData.summary}
                    onChange={e => setCvData({ ...cvData, summary: e.target.value })}
                    placeholder="Kendinizi, kariyer hedeflerinizi ve güçlü yetkinliklerinizi özetleyen profesyonel metin..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-[#990000] outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">İpucu: 2-3 cümlelik net ve somut özetler İK inceleme oranını %40 artırır.</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 3. Deneyim & Staj */}
            {activeTab === 'experience' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Briefcase size={16} className="text-[#990000]" /> İş & Staj Deneyimleri
                  </h3>
                  <button
                    onClick={handleAddExperience}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-[#990000] hover:bg-red-100 text-xs font-bold border border-red-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} /> Yeni Deneyim Ekle
                  </button>
                </div>

                {cvData.experience.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Henüz iş veya staj deneyimi eklenmedi. "Yeni Deneyim Ekle" butonuna tıklayın.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cvData.experience.map((exp, index) => (
                      <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 relative group hover:border-slate-300 transition space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Deneyim #{index + 1}</span>
                          <button
                            onClick={() => removeExperience(exp.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={exp.role}
                            onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                            placeholder="Pozisyon (Örn: Yazılım Stajyeri)"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                          />
                          <input
                            type="text"
                            value={exp.company}
                            onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Kurum / Şirket Adı"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            value={exp.date}
                            onChange={e => updateExperience(exp.id, 'date', e.target.value)}
                            placeholder="Tarih (Örn: Temmuz 2025 - Eylül 2025)"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                          />
                          <select
                            value={exp.type}
                            onChange={e => updateExperience(exp.id, 'type', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                          >
                            <option value="Zorunlu Staj">Zorunlu Staj</option>
                            <option value="Gönüllü Staj">Gönüllü Staj</option>
                            <option value="Tam Zamanlı">Tam Zamanlı</option>
                            <option value="Yarı Zamanlı (Part-Time)">Yarı Zamanlı (Part-Time)</option>
                            <option value="Proje Bazlı / Serbest">Proje Bazlı / Serbest</option>
                          </select>
                        </div>

                        <textarea
                          rows={2}
                          value={exp.desc}
                          onChange={e => updateExperience(exp.id, 'desc', e.target.value)}
                          placeholder="Üstlendiğiniz temel görevler ve elde ettiğiniz başarılar..."
                          className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:border-[#990000] outline-none leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: 4. Eğitim */}
            {activeTab === 'education' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <GraduationCap size={16} className="text-[#990000]" /> Eğitim Bilgileri
                  </h3>
                  <button
                    onClick={handleAddEducation}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-[#990000] hover:bg-red-100 text-xs font-bold border border-red-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} /> Yeni Eğitim Ekle
                  </button>
                </div>

                <div className="space-y-4">
                  {cvData.education.map((edu, index) => (
                    <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 relative group hover:border-slate-300 transition space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Eğitim #{index + 1}</span>
                        {cvData.education.length > 1 && (
                          <button
                            onClick={() => removeEducation(edu.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={e => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="Üniversite / Kurum Adı"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                        />
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Fakülte - Bölüm"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={edu.date}
                          onChange={e => updateEducation(edu.id, 'date', e.target.value)}
                          placeholder="Tarih (Örn: 2022 - 2026)"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                        />
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={e => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="AGNO / Ortalama (Örn: 3.42 / 4.00)"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                        />
                      </div>

                      <input
                        type="text"
                        value={edu.desc || ''}
                        onChange={e => updateEducation(edu.id, 'desc', e.target.value)}
                        placeholder="Bitirme Projesi / Tez veya Özel Akademik Başarı"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 5. Yetenekler & ATS Optimizasyonu */}
            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Dna size={16} className="text-indigo-600" /> Yetkinlikler & Araçlar
                  </h3>
                  <button
                    onClick={evolveCVWithGeneticAlgorithms}
                    disabled={isEvolving}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={13} className={isEvolving ? 'animate-spin' : ''} />
                    ATS Optimize Et
                  </button>
                </div>

                {/* Add New Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="Yetenek ekleyin (Örn: React, Python, SQL) ve Enter'a basın"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>

                {/* Active Skills Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {cvData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 hover:border-red-300 transition"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Suggested Common Skills */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Hızlı Öneri Yetenekler (Tıklayıp Ekleyin):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Figma', 'Node.js', 'TypeScript', 'Docker', 'REST API', 'PostgreSQL', 'Problem Çözme', 'Proje Yönetimi', 'Veri Analizi'].filter(s => !cvData.skills.includes(s)).map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => setCvData(prev => ({ ...prev, skills: [...prev.skills, sug] }))}
                        className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 text-[11px] font-bold transition cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: 6. Diller */}
            {activeTab === 'languages' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Globe size={16} className="text-[#990000]" /> Yabancı Diller
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newLang}
                    onChange={e => setNewLang(e.target.value)}
                    placeholder="Dil adı (Örn: İngilizce, Almanca)"
                    className="sm:col-span-6 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white outline-none"
                  />
                  <select
                    value={newLangLevel}
                    onChange={e => setNewLangLevel(e.target.value)}
                    className="sm:col-span-4 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:bg-white outline-none"
                  >
                    <option value="Ana Dil">Ana Dil</option>
                    <option value="C2 (Yetkin / İleri)">C2 (Yetkin / İleri)</option>
                    <option value="C1 (İleri Düzey)">C1 (İleri Düzey)</option>
                    <option value="B2 (Orta - İleri)">B2 (Orta - İleri)</option>
                    <option value="B1 (Orta Düzey)">B1 (Orta Düzey)</option>
                    <option value="A2 (Temel Düzey)">A2 (Temel Düzey)</option>
                  </select>
                  <button
                    onClick={handleAddLanguage}
                    className="sm:col-span-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {cvData.languages.map(lang => (
                    <div key={lang.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-xs font-black text-slate-900">{lang.lang}</span>
                        <span className="text-[11px] text-slate-500 ml-2">({lang.level})</span>
                      </div>
                      <button
                        onClick={() => handleRemoveLanguage(lang.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: 7. Sertifikalar */}
            {activeTab === 'certificates' && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 animate-fade-in text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Award size={16} className="text-[#990000]" /> Sertifikalar & Lisanslar
                  </h3>
                  <button
                    onClick={handleAddCertificate}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-[#990000] hover:bg-red-100 text-xs font-bold border border-red-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} /> Sertifika Ekle
                  </button>
                </div>

                {cvData.certificates.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    Henüz sertifika eklenmedi. "Sertifika Ekle" butonuna tıklayın.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cvData.certificates.map(cert => (
                      <div key={cert.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 relative space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={e => updateCertificate(cert.id, 'name', e.target.value)}
                            placeholder="Sertifika Başlığı"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:border-[#990000] outline-none"
                          />
                          <button
                            onClick={() => removeCertificate(cert.id)}
                            className="p-1.5 ml-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={e => updateCertificate(cert.id, 'issuer', e.target.value)}
                            placeholder="Veren Kurum"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-semibold focus:border-[#990000] outline-none"
                          />
                          <input
                            type="text"
                            value={cert.date}
                            onChange={e => updateCertificate(cert.id, 'date', e.target.value)}
                            placeholder="Tarih (Örn: 2025)"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs font-semibold focus:border-[#990000] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ══════════ RIGHT COLUMN: LIVE A4 PREVIEW ══════════ */}
          <div className={`lg:col-span-7 flex flex-col items-center ${mobileViewMode === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
            
            <div className="w-full flex items-center justify-between text-xs text-slate-500 font-bold mb-3 px-2">
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-[#990000]" /> A4 Canlı Önizleme ({selectedTemplate === 'modern' ? 'Modern İESÜ' : selectedTemplate === 'ats' ? 'ATS Standart' : 'Mezun Zümrüt'})
              </span>
              <span className="text-[11px] text-slate-400 font-mono">210mm × 297mm</span>
            </div>

            {/* The Actual A4 CV Document */}
            <div className="w-full overflow-x-auto pb-8 flex justify-center">
              <div 
                id="cv-print-area" 
                className={`bg-white w-[210mm] min-h-[297mm] shadow-2xl p-10 sm:p-12 relative text-slate-800 rounded-md border border-slate-200 text-left transition-all ${
                  selectedTemplate === 'executive' ? 'border-t-8 border-t-emerald-800' : selectedTemplate === 'ats' ? 'border-t-4 border-t-slate-900' : 'border-t-8 border-t-[#990000]'
                }`}
              >
                {/* ═══ CV HEADER ═══ */}
                <header className="border-b-2 border-slate-800 pb-6 mb-6 flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                      {cvData.name || 'Ad Soyad'}
                    </h1>
                    <p className={`text-sm font-bold mt-1 ${selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-700' : 'text-[#990000]'}`}>
                      {cvData.title || 'Profesyonel Unvan'}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600 font-medium">
                      {cvData.email && (
                        <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400"/> {cvData.email}</span>
                      )}
                      {cvData.phone && (
                        <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400"/> {cvData.phone}</span>
                      )}
                      {cvData.location && (
                        <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400"/> {cvData.location}</span>
                      )}
                      {cvData.linkedin && (
                        <span className="flex items-center gap-1"><Link2 size={12} className="text-blue-600"/> {cvData.linkedin}</span>
                      )}
                      {cvData.github && (
                        <span className="flex items-center gap-1"><Globe size={12} className="text-slate-500"/> {cvData.github}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Photo with fallback */}
                  <div className="w-24 h-28 bg-white border border-slate-300 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-sm p-0.5">
                    <SafeAvatar
                      src={cvData.photo}
                      name={cvData.name}
                      size={96}
                      className="w-full h-full rounded-md object-cover"
                    />
                  </div>
                </header>

                {/* ═══ SUMMARY ═══ */}
                {cvData.summary && (
                  <section className="mb-6">
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${
                      selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-900' : 'text-[#990000]'
                    }`}>
                      <span className={`w-5 border-t-2 ${selectedTemplate === 'executive' ? 'border-emerald-700' : selectedTemplate === 'ats' ? 'border-slate-800' : 'border-[#990000]'}`}></span> 
                      Kariyer Özeti
                    </h2>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      {cvData.summary}
                    </p>
                  </section>
                )}

                {/* ═══ EXPERIENCE ═══ */}
                {cvData.experience?.length > 0 && (
                  <section className="mb-6">
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
                      selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-900' : 'text-[#990000]'
                    }`}>
                      <span className={`w-5 border-t-2 ${selectedTemplate === 'executive' ? 'border-emerald-700' : selectedTemplate === 'ats' ? 'border-slate-800' : 'border-[#990000]'}`}></span> 
                      İş & Staj Deneyimi
                    </h2>
                    <div className="space-y-3.5">
                      {cvData.experience.map(exp => (
                        <div key={exp.id} className="text-left">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="font-black text-slate-900 text-xs sm:text-sm">{exp.role || 'Pozisyon'}</h3>
                            <span className="text-[11px] font-mono text-slate-500 font-bold">{exp.date}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 mb-1">
                            {exp.company || 'Kurum'} <span className="text-[10px] text-slate-400 font-normal">({exp.type})</span>
                          </p>
                          {exp.desc && <p className="text-xs text-slate-600 leading-relaxed">{exp.desc}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ═══ EDUCATION ═══ */}
                {cvData.education?.length > 0 && (
                  <section className="mb-6">
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 ${
                      selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-900' : 'text-[#990000]'
                    }`}>
                      <span className={`w-5 border-t-2 ${selectedTemplate === 'executive' ? 'border-emerald-700' : selectedTemplate === 'ats' ? 'border-slate-800' : 'border-[#990000]'}`}></span> 
                      Eğitim
                    </h2>
                    <div className="space-y-3">
                      {cvData.education.map(edu => (
                        <div key={edu.id} className="text-left">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className="font-black text-slate-900 text-xs sm:text-sm">{edu.institution || 'Üniversite'}</h3>
                            <span className="text-[11px] font-mono text-slate-500 font-bold">{edu.date}</span>
                          </div>
                          <div className="flex justify-between items-baseline">
                            <p className="text-xs font-bold text-slate-600">{edu.degree}</p>
                            {edu.gpa && <span className="text-[11px] font-mono font-bold text-emerald-800">AGNO: {edu.gpa}</span>}
                          </div>
                          {edu.desc && <p className="text-xs text-slate-500 mt-0.5 italic">{edu.desc}</p>}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ═══ SKILLS & LANGUAGES ═══ */}
                {(cvData.skills?.length > 0 || cvData.languages?.length > 0) && (
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {cvData.skills?.length > 0 && (
                      <div>
                        <h2 className={`text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${
                          selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-900' : 'text-[#990000]'
                        }`}>
                          <span className={`w-5 border-t-2 ${selectedTemplate === 'executive' ? 'border-emerald-700' : selectedTemplate === 'ats' ? 'border-slate-800' : 'border-[#990000]'}`}></span> 
                          Yetkinlikler
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                          {cvData.skills.map((skill, i) => (
                            <span key={i} className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvData.languages?.length > 0 && (
                      <div>
                        <h2 className={`text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${
                          selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-900' : 'text-[#990000]'
                        }`}>
                          <span className={`w-5 border-t-2 ${selectedTemplate === 'executive' ? 'border-emerald-700' : selectedTemplate === 'ats' ? 'border-slate-800' : 'border-[#990000]'}`}></span> 
                          Yabancı Diller
                        </h2>
                        <div className="space-y-1 text-xs">
                          {cvData.languages.map(lang => (
                            <div key={lang.id} className="flex justify-between items-center py-0.5 border-b border-slate-100">
                              <span className="font-bold text-slate-800">{lang.lang}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{lang.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* ═══ CERTIFICATES ═══ */}
                {cvData.certificates?.length > 0 && (
                  <section className="mb-4">
                    <h2 className={`text-xs font-black uppercase tracking-widest mb-2.5 flex items-center gap-2 ${
                      selectedTemplate === 'executive' ? 'text-emerald-800' : selectedTemplate === 'ats' ? 'text-slate-900' : 'text-[#990000]'
                    }`}>
                      <span className={`w-5 border-t-2 ${selectedTemplate === 'executive' ? 'border-emerald-700' : selectedTemplate === 'ats' ? 'border-slate-800' : 'border-[#990000]'}`}></span> 
                      Sertifikalar
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {cvData.certificates.map(cert => (
                        <div key={cert.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-left">
                          <p className="font-bold text-slate-900">{cert.name}</p>
                          <p className="text-[10px] text-slate-500">{cert.issuer} • {cert.date}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Footer Brand Seal */}
                <footer className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span>İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü</span>
                  <span className="font-mono">ATS Onaylı CV Formatı</span>
                </footer>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ─── FLOATING BOTTOM DOCK ─── */}
      {setView && (
        <div className="hide-on-print">
          <SubPanelFloatingDock 
            currentUser={currentUser} 
            setView={setView} 
            setSelectedUserId={setSelectedUserId}
            userRole={userRole || 'student'}
          />
        </div>
      )}

      {/* ─── EUROPASS EXPORT MODAL ─── */}
      <EuroPassExportModal
        isOpen={showEuroPassModal}
        onClose={() => setShowEuroPassModal(false)}
        studentProfile={{
          name: cvData.name,
          department: cvData.title?.replace(/ (Öğrencisi|Mezunu)$/, '') || currentUser?.department,
          faculty: currentUser?.faculty,
          email: cvData.email,
          phone: cvData.phone,
          skills: cvData.skills,
          internships: (cvData.experience || []).map(e => ({
            company: e.company,
            position: e.role,
            date: e.date,
            summary: e.desc
          }))
        }}
      />
    </div>
  );
}
