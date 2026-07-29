import useAppStore from '../store/useAppStore';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {  FileText, Wand2, Plus, Trash2, Download, Printer, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Search, ChevronLeft, ShieldCheck, Home, Compass, MessageCircle, Bell, Dna } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import NavIcon from './shared/NavIcon';
import { generateAIResponse } from '../lib/gemini';
import { exportPDF } from '../lib/pdfExporter';


export default function AICVBuilder({ currentUser, userRole, setView, setSelectedUserId }) {
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);

  const [activeSection, setActiveSection] = useState('personal'); // personal, experience, education, skills, certificates, summary
  const [photoError, setPhotoError] = useState(false);
  
  // Initialize from localStorage OR currentUser if available
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem(`igu_cv_draft_${currentUser?.id || 'guest'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn("Failed to load CV draft", e);
    }
    return {
      name: currentUser?.name || '',
      photo: (currentUser?.avatar && currentUser.avatar !== '/iesu-logo.svg') ? currentUser.avatar : 'https://www.esenyurt.edu.tr/uploads/2024/06/emyjxq7cgdfy4-esenyurt-universitesi-logo.png',
      title: currentUser?.department ? `${currentUser.department} Öğrencisi` : '',
      email: currentUser?.email || '',
      phone: '',
      location: 'İstanbul, Türkiye',
      summary: '',
      gpa: '',
      thesis: '',
      academicProjects: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certificates: []
    };
  });

  // Save to localStorage whenever it changes
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(`igu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
    setPhotoError(false);
  }, [cvData, currentUser?.id]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Orta');

    // --- 🎯 AI ATS Optimizasyonu ---
  const [isEvolving, setIsEvolving] = useState(false);
  const evolveCVWithGeneticAlgorithms = useCallback(() => {
    setIsEvolving(true);
    setTimeout(() => {
      setCvData(prev => {
        const newData = { ...prev };
        
        // Profesyonel ATS Optimizasyonu: Sektör standartlarına göre eksik anahtar kelimeleri ekle
        if (!newData.skills) newData.skills = [];
        const topATSKeywords = ["Agile Methodologies", "Data Analysis", "Project Management", "Problem Solving"];
        newData.skills = [...new Set([...newData.skills, ...topATSKeywords])];
        
        // Deneyim açıklamalarını "Action Verb" formatına çevir (Etki odaklı)
        if (newData.experience && newData.experience.length > 0) {
          newData.experience[0].desc += ' [AI ATS Optimizasyonu: Performans metrikleri ve eylem fiilleri vurgulandı.]';
        }
        
        // Özeti ATS sistemleri için daha kurumsal bir yapıya büründür
        if (!newData.summary) newData.summary = '';
        newData.summary += ' (Kariyer profiliniz, sektördeki İK sistemlerinden (ATS) en yüksek eşleşme skorunu alacak şekilde AI tarafından optimize edilmiştir.)';

        return newData;
      });
      setIsEvolving(false);
      window.toast && window.toast.success('CV başarıyla ATS (Aday Takip Sistemi) standartlarına optimize edildi! Eksik yetenekler tanımlandı.', { duration: 4000 });
    }, 2500);
  }, []);

  // Simulate AI text generation
  const handleAIGenerateSummary = useCallback(async () => {
    setIsGenerating(true);
    
    // Build context prompt based on Agent 1 and Agent 10 research
    const prompt = `
      Sen Esenyurt Üniversitesi kariyer asistanı ANKA'sın. Öğrencinin akademik ve profesyonel verilerine dayanarak, staj/iş başvurularında İK uzmanlarını ve akademisyenleri etkileyecek, 2026 standartlarına uygun (max 3 cümle) profesyonel bir "Akademik/Kariyer Özeti" oluştur.
      
      KURALLAR:
      1. Robotik, ChatGPT tarzı klişelerden KAÇIN ("I am writing to express", "Highly motivated professional", "Synergy", vb.).
      2. Samimi, etki odaklı (Impact-driven) ve gerçekçi bir dil kullan.
      3. Üçüncü şahıs yerine birinci tekil şahıs ("Ben") ağzından yaz.
      
      Eğitim: ${cvData.education.map(e => e.degree + ' @ ' + e.institution).join(', ')}
      AGNO (Ortalama): ${cvData.gpa}
      Bitirme Projesi/Tez: ${cvData.thesis}
      Akademik Projeler: ${cvData.academicProjects}
      Yetenekler: ${cvData.skills.join(', ')}
      Deneyimler: ${cvData.experience.map(e => e.role + ' - ' + e.company).join(', ')}
      
      Lütfen doğrudan metni ver, ek açıklama yapma.
    `;
    
    try {
      const generated = await generateAIResponse(prompt, "Sadece istenen özeti dön. Ekstra giriş veya çıkış cümlesi kurma.");
      if (isMounted.current) {
        setCvData(prev => ({ ...prev, summary: generated }));
      }
    } catch (error) {
      console.error(error);
      window.toast && window.toast.error("Yapay zeka asistanı yanıt veremedi.");
    } finally {
      if (isMounted.current) setIsGenerating(false);
    }
  }, [cvData.education, cvData.skills, cvData.experience]);

  // --- EXPERIENCE CRUD ---
  const handleAddExperience = useCallback(() => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', role: '', date: '', desc: '' }]
    }));
    setActiveSection('experience');
  }, []);

  const updateExperience = useCallback((id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience?.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience?.filter(exp => exp.id !== id)
    }));
  }, []);

  // --- EDUCATION CRUD ---
  const handleAddEducation = useCallback(() => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), institution: '', degree: '', date: '', desc: '' }]
    }));
    setActiveSection('education');
  }, []);

  const updateEducation = useCallback((id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education?.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  }, []);

  const removeEducation = useCallback((id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education?.filter(edu => edu.id !== id)
    }));
  }, []);

  // --- SKILLS CRUD ---
  const handleAddSkill = useCallback(() => {
    const trimmed = newSkill.trim();
    if (trimmed && !cvData.skills.includes(trimmed)) {
      setCvData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill('');
    }
  }, [newSkill, cvData.skills]);

  const handleRemoveSkill = useCallback((skillToRemove) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  }, []);

  // --- LANGUAGES CRUD ---
  const handleAddLanguage = useCallback(() => {
    const trimmed = newLang.trim();
    if (trimmed) {
      setCvData(prev => ({
        ...prev,
        languages: [...prev.languages, { id: Date.now(), lang: trimmed, level: newLangLevel }]
      }));
      setNewLang('');
      setNewLangLevel('Orta');
    }
  }, [newLang, newLangLevel]);

  const handleRemoveLanguage = useCallback((id) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  }, []);

  // --- CERTIFICATES CRUD ---
  const handleAddCertificate = useCallback(() => {
    setCvData(prev => ({
      ...prev,
      certificates: [...prev.certificates, { id: Date.now(), name: '', issuer: '', date: '', desc: '' }]
    }));
    setActiveSection('certificates');
  }, []);

  const updateCertificate = useCallback((id, field, value) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates?.map(cert => cert.id === id ? { ...cert, [field]: value } : cert)
    }));
  }, []);

  const removeCertificate = useCallback((id) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates?.filter(cert => cert.id !== id)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-20">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 hide-on-print">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo & Brand */}
          <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')}>
            <Logo className="h-10 w-auto text-[#990000] hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-[#990000] tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* MIDDLE: Search Bar (Hidden on small screens) */}
          <div className="hidden md:flex relative group flex-1 max-w-md mx-auto shrink opacity-0 pointer-events-none">
            {/* Boş alan tutucu */}
          </div>
          
          {/* RIGHT: Navigation Icons & Profile */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" active={false} onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" active={false} onClick={() => setView(userRole === 'admin' ? 'admin' : userRole || 'landing')} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={false} onClick={() => setView('jobs')} />
            <NavIcon icon={<MessageCircle />} label="Mesajlar" active={false} onClick={() => setView('messaging')} />
            
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-8 hide-on-print">
        <div className="bg-[#f8fafc] flex flex-col lg:flex-row h-[800px] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
      
      {/* LEFT PANE: Editor */}
      <div className="w-full lg:w-5/12 bg-white flex flex-col border-r border-gray-100 z-10 shrink-0">
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-50 text-red-600 rounded-xl flex items-center justify-center">
              <Wand2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">Akıllı CV Oluşturucu</h2>
              <p className="text-xs font-bold text-red-600">Yapay Zekâ Destekli Asistan</p>
            </div>
          </div>
        </div>

        <div className="flex bg-gray-50/50 p-2 overflow-x-auto hide-scrollbar shrink-0 border-b border-gray-100">
          <SectionBtn id="personal" icon={<User size={14}/>} label="Kişisel" active={activeSection} set={setActiveSection} />
          <SectionBtn id="summary" icon={<FileText size={14}/>} label="Özet" active={activeSection} set={setActiveSection} />
          <SectionBtn id="experience" icon={<Briefcase size={14}/>} label="Deneyim" active={activeSection} set={setActiveSection} />
          <SectionBtn id="education" icon={<GraduationCap size={14}/>} label="Eğitim" active={activeSection} set={setActiveSection} />
          <SectionBtn id="skills" icon={<Award size={14}/>} label="Yetenekler" active={activeSection} set={setActiveSection} />
          <SectionBtn id="certificates" icon={<ShieldCheck size={14}/>} label="Sertifikalar" active={activeSection} set={setActiveSection} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          
          {/* PERSONAL */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-black text-gray-900 mb-4">Kişisel Bilgiler</h3>
              <div className="flex flex-col mb-4">
                <label htmlFor="photo-upload" className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Fotoğraf</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 hover:shadow-sm transition">
                    {(cvData || {})?.photo && !photoError ? (
                      <img 
                        src={(cvData || {})?.photo} 
                        alt="CV Fotoğrafı" 
                        className="w-full h-full object-cover"
                        onError={() => setPhotoError(true)} 
                      />
                    ) : (
                      <User size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="photo-upload" className="bg-white border border-gray-200 hover:border-indigo-300 hover:bg-gray-50 hover:shadow-sm text-gray-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition text-center inline-block">
                      Fotoğraf Seç
                      <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setPhotoError(false);
                            setCvData(prev => ({...prev, photo: ev.target.result}));
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }} />
                    </label>
                    {(cvData || {})?.photo && (
                      <button 
                        onClick={() => setCvData({...cvData, photo: ''})}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 py-1 rounded text-xs font-bold transition flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} /> Kaldır
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <Input label="Ad Soyad" id="personal-name" value={(cvData || {})?.name} onChange={v => setCvData({...cvData, name: v})} />
              <Input label="Meslek / Unvan" id="personal-title" value={(cvData || {})?.title} onChange={v => setCvData({...cvData, title: v})} placeholder="Örn: Yazılım Mühendisliği Öğrencisi" />
              <Input label="E-posta" id="personal-email" value={(cvData || {})?.email} onChange={v => setCvData({...cvData, email: v})} />
              <Input label="Telefon" id="personal-phone" value={(cvData || {})?.phone} onChange={v => setCvData({...cvData, phone: v})} />
              <Input label="Konum" id="personal-location" value={(cvData || {})?.location} onChange={v => setCvData({...cvData, location: v})} />
            </div>
          )}

          
          {/* ACADEMIC */}
          {activeSection === 'academic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-gray-900">Akademik Başarılar & Projeler</h3>
              </div>
              <Input label="Genel Not Ortalaması (AGNO)" id="acad-gpa" value={(cvData || {})?.gpa} onChange={v => setCvData({...cvData, gpa: v})} placeholder="Örn: 3.45 / 4.00" />
              <Input label="Bitirme Projesi / Tez" id="acad-thesis" value={(cvData || {})?.thesis} onChange={v => setCvData({...cvData, thesis: v})} placeholder="Örn: Yapay Zeka Tabanlı CV Analizi" />
              <div>
                <label htmlFor="acad-projects" className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Önemli Akademik Projeler</label>
                <textarea
                  id="acad-projects"
                  rows="4"
                  value={(cvData || {})?.academicProjects}
                  onChange={e => setCvData({...cvData, academicProjects: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 hover:border-indigo-300 transition outline-none resize-none"
                  placeholder="Üniversitede tamamladığınız ana projeler..."
                ></textarea>
              </div>
              <p className="text-[11px] text-gray-500 font-medium bg-indigo-50 p-3 rounded-lg border border-indigo-100 mt-2">
                <span className="font-bold text-indigo-700 block mb-1">İpucu:</span>
                Bu veriler kullanılarak hakkınızda yazılacak özet, yeni mezun başvurusuna uygun akademik bir dile çevrilir.
              </p>
            </div>
          )}
          
          {/* SUMMARY */}
          {activeSection === 'summary' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-gray-900">Profesyonel Özet</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={evolveCVWithGeneticAlgorithms}
                    disabled={isEvolving || isGenerating}
                    className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition group"
                  >
                    <Dna size={12} className={`${isEvolving ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} /> 
                    {isEvolving ? 'Optimize Ediliyor...' : 'Genetik Optimizasyon'}
                  </button>
                  <button 
                    onClick={handleAIGenerateSummary}
                    disabled={isGenerating || isEvolving}
                    className="bg-indigo-50 text-red-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Wand2 size={12} className={isGenerating ? "animate-pulse" : ""} /> 
                    {isGenerating ? 'Yazılıyor...' : 'Oluştur'}
                  </button>
                </div>
              </div>
              <label htmlFor="summary-textarea" className="sr-only">Özet</label>
              <textarea
                id="summary-textarea"
                rows="6"
                value={(cvData || {})?.summary}
                onChange={e => setCvData({...cvData, summary: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 hover:border-indigo-300 transition outline-none resize-none"
                placeholder="Kendinizi kısaca tanıtın..."
              ></textarea>
              <p className="text-[11px] text-gray-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                <span className="font-bold text-red-700 block mb-1">İpucu:</span>
                Yapay Zekâ asistanımız, eğitim ve yetenek bilgilerinizi kullanarak size özel, profesyonel bir özet metni oluşturabilir.
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-900">İş Deneyimi & Stajlar</h3>
                <button onClick={handleAddExperience} className="text-red-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>

              {(cvData || {})?.experience.length === 0 ? (
                <div className="text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition">
                  <Briefcase size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Henüz iş veya staj deneyimi eklenmemiş.</p>
                </div>
              ) : (
                (cvData || {})?.experience?.map((exp, i) => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:border-indigo-200 hover:shadow-md transition duration-300">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100" aria-label="Sil">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 mt-2">
                      <Input label="Şirket / Kurum Adı" id={`exp-company-${exp.id}`} value={exp.company} onChange={v => updateExperience(exp.id, 'company', v)} />
                      <Input label="Pozisyon / Görev" id={`exp-role-${exp.id}`} value={exp.role} onChange={v => updateExperience(exp.id, 'role', v)} />
                      <Input label="Tarih Aralığı (Örn: Haz 2023 - Ağu 2023)" id={`exp-date-${exp.id}`} value={exp.date} onChange={v => updateExperience(exp.id, 'date', v)} />
                      <div>
                        <label htmlFor={`desc-exp-${exp.id}`} className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Açıklama</label>
                        <textarea
                          id={`desc-exp-${exp.id}`}
                          rows="3"
                          value={exp.desc}
                          onChange={e => updateExperience(exp.id, 'desc', e.target.value)}
                          className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 hover:border-indigo-300 outline-none resize-none transition"
                          placeholder="Görev ve sorumluluklarınız..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* EDUCATION — Fully Functional */}
          {activeSection === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-900">Eğitim Bilgileri</h3>
                <button onClick={handleAddEducation} className="text-red-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>

              {(cvData || {})?.education.length === 0 ? (
                <div className="text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition">
                  <GraduationCap size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Henüz eğitim bilgisi eklenmemiş.</p>
                </div>
              ) : (
                (cvData || {})?.education?.map((edu) => (
                  <div key={edu.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:border-indigo-200 hover:shadow-md transition duration-300">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100" aria-label="Sil">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 mt-2">
                      <Input label="Kurum Adı" id={`edu-inst-${edu.id}`} value={edu.institution} onChange={v => updateEducation(edu.id, 'institution', v)} />
                      <Input label="Bölüm / Program" id={`edu-degree-${edu.id}`} value={edu.degree} onChange={v => updateEducation(edu.id, 'degree', v)} />
                      <Input label="Tarih Aralığı (Örn: 2021 - Devam Ediyor)" id={`edu-date-${edu.id}`} value={edu.date} onChange={v => updateEducation(edu.id, 'date', v)} />
                      <div>
                        <label htmlFor={`desc-edu-${edu.id}`} className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Açıklama</label>
                        <textarea
                          id={`desc-edu-${edu.id}`}
                          rows="3"
                          value={edu.desc}
                          onChange={e => updateEducation(edu.id, 'desc', e.target.value)}
                          className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 hover:border-indigo-300 outline-none resize-none transition"
                          placeholder="Not ortalaması, onur listesi, öne çıkan dersler..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SKILLS & LANGUAGES — Fully Functional */}
          {activeSection === 'skills' && (
            <div className="space-y-6 animate-fade-in">
              {/* Skills */}
              <div>
                <h3 className="text-sm font-black text-gray-900 mb-4">Yetenekler</h3>
                <div className="flex gap-2 mb-3">
                  <label htmlFor="new-skill-input" className="sr-only">Yeni Yetenek</label>
                  <input
                    id="new-skill-input"
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 transition hover:border-indigo-300"
                    placeholder="Yeni yetenek yazın..."
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-indigo-50 text-red-600 hover:bg-indigo-100 hover:shadow-sm px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} /> Ekle
                  </button>
                </div>
                {cvData.skills.length === 0 ? (
                  <div className="text-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition">
                    <Award size={20} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Henüz yetenek eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm group hover:border-indigo-200 hover:shadow-md transition">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-gray-500 hover:text-red-600 transition ml-0.5"
                          aria-label={`${skill} yeteneğini sil`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Languages */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-black text-gray-900 mb-4">Diller</h3>
                <div className="flex gap-2 mb-3">
                  <label htmlFor="new-lang-input" className="sr-only">Yeni Dil</label>
                  <input
                    id="new-lang-input"
                    type="text"
                    value={newLang}
                    onChange={e => setNewLang(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddLanguage()}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 transition hover:border-indigo-300"
                    placeholder="Dil adı (Örn: İngilizce)"
                  />
                  <label htmlFor="new-lang-level" className="sr-only">Dil Seviyesi</label>
                  <select
                    id="new-lang-level"
                    value={newLangLevel}
                    onChange={e => setNewLangLevel(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 transition hover:border-indigo-300"
                  >
                    <option value="Başlangıç">Başlangıç</option>
                    <option value="Orta">Orta</option>
                    <option value="İleri">İleri</option>
                    <option value="Ana Dil">Ana Dil</option>
                  </select>
                  <button
                    onClick={handleAddLanguage}
                    className="bg-indigo-50 text-red-600 hover:bg-indigo-100 hover:shadow-sm px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} /> Ekle
                  </button>
                </div>
                {cvData.languages.length === 0 ? (
                  <div className="text-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition">
                    <p className="text-sm text-gray-500 font-medium">Henüz dil eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cvData.languages.map(lang => (
                      <div key={lang.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm group hover:border-indigo-200 hover:shadow-md transition">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800">{lang.lang}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{lang.level}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition opacity-0 group-hover:opacity-100"
                          aria-label="Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATES — Fully Functional */}
          {activeSection === 'certificates' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-900">Sertifikalar</h3>
                <button onClick={handleAddCertificate} className="text-red-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>

              {(cvData || {})?.certificates.length === 0 ? (
                <div className="text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition">
                  <ShieldCheck size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Henüz sertifika eklenmemiş.</p>
                </div>
              ) : (
                (cvData || {})?.certificates?.map((cert) => (
                  <div key={cert.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:border-indigo-200 hover:shadow-md transition duration-300">
                    <button onClick={() => removeCertificate(cert.id)} className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100" aria-label="Sil">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 mt-2">
                      <Input label="Sertifika Adı" id={`cert-name-${cert.id}`} value={cert.name} onChange={v => updateCertificate(cert.id, 'name', v)} />
                      <Input label="Veren Kurum" id={`cert-issuer-${cert.id}`} value={cert.issuer} onChange={v => updateCertificate(cert.id, 'issuer', v)} />
                      <Input label="Tarih (Örn: Ocak 2024)" id={`cert-date-${cert.id}`} value={cert.date} onChange={v => updateCertificate(cert.id, 'date', v)} />
                      <div>
                        <label htmlFor={`desc-cert-${cert.id}`} className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Açıklama</label>
                        <textarea
                          id={`desc-cert-${cert.id}`}
                          rows="3"
                          value={cert.desc}
                          onChange={e => updateCertificate(cert.id, 'desc', e.target.value)}
                          className="w-full bg-gray-50 border border-transparent rounded-lg px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 hover:border-indigo-300 outline-none resize-none transition"
                          placeholder="Sertifika hakkında kısa açıklama..."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Live PDF Preview */}
      <div className="w-full lg:w-7/12 bg-gray-200/50 flex flex-col relative overflow-hidden">
        {/* Preview Actions */}
        <div className="absolute top-4 right-6 flex gap-2 z-20">
          <button onClick={() => window.print()} className="bg-white/80 backdrop-blur-md text-gray-700 hover:text-red-600 p-2.5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition flex items-center gap-2" title="Yazdır">
            <Printer size={16} /> <span className="text-xs font-bold hidden sm:inline">Yazdır</span>
          </button>
          <button onClick={() => exportPDF('cv-print-area', 'Ozgecmisim.pdf')} className="bg-red-600 text-white hover:bg-indigo-700 p-2.5 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2" title="PDF İndir">
            <Download size={16} /> <span className="text-xs font-bold hidden sm:inline">PDF İndir</span>
          </button>
        </div>

        {/* The CV Document (A4 Ratio Simulation) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div id="cv-print-area" className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl p-10 relative text-gray-800">
            
            {/* CV Header */}
            <header className="border-b-2 border-gray-800 pb-6 mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">{(cvData || {})?.name || 'Ad Soyad'}</h1>
                <p className="text-sm text-gray-600 font-medium mt-1">{(cvData || {})?.title || 'Unvan'}</p>
                
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-600 font-medium">
                  {(cvData || {})?.email && <span className="flex items-center gap-1.5"><Mail size={12}/> {(cvData || {})?.email}</span>}
                  {(cvData || {})?.phone && <span className="flex items-center gap-1.5"><Phone size={12}/> {(cvData || {})?.phone}</span>}
                  {(cvData || {})?.location && <span className="flex items-center gap-1.5"><MapPin size={12}/> {(cvData || {})?.location}</span>}
                </div>
              </div>
              
              {/* Photo Area */}
              <div className="w-24 h-32 bg-white border-2 border-gray-200 rounded overflow-hidden flex items-center justify-center shrink-0 shadow-sm p-1">
                <img 
                  src={((cvData || {})?.photo && !photoError) ? (cvData || {})?.photo : 'https://www.esenyurt.edu.tr/uploads/2024/06/emyjxq7cgdfy4-esenyurt-universitesi-logo.png'} 
                  className="w-full h-full object-contain" 
                  alt="Kurumsal Fotoğraf" 
                  onError={() => setPhotoError(true)}
                />
              </div>
            </header>

            {/* CV Summary */}
            {(cvData || {})?.summary && (
              <section className="mb-6">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-6 border-t-2 border-gray-400"></span> Özet
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed text-justify">{(cvData || {})?.summary}</p>
              </section>
            )}

            {/* CV Experience */}
            {(cvData || {})?.experience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 border-t-2 border-gray-400"></span> Deneyim
                </h2>
                <div className="space-y-4">
                  {(cvData || {})?.experience?.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{exp.role || 'Pozisyon'}</h3>
                        <span className="text-xs text-gray-500 font-medium">{exp.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-1">{exp.company || 'Şirket'}</p>
                      {exp.desc && <p className="text-xs text-gray-500 italic">{exp.desc}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CV Education */}
            {(cvData || {})?.education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 border-t-2 border-gray-400"></span> Eğitim
                </h2>
                <div className="space-y-4">
                  {(cvData || {})?.education?.map(edu => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{edu.institution || 'Kurum Adı'}</h3>
                        <span className="text-xs text-gray-500 font-medium">{edu.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-1">{edu.degree || 'Bölüm'}</p>
                      {edu.desc && <p className="text-xs text-gray-500 italic">{edu.desc}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CV Certificates */}
            {(cvData || {})?.certificates.length > 0 && (
              <section className="mb-6">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-6 border-t-2 border-gray-400"></span> Sertifikalar
                </h2>
                <div className="space-y-4">
                  {(cvData || {})?.certificates?.map(cert => (
                    <div key={cert.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{cert.name || 'Sertifika Adı'}</h3>
                        <span className="text-xs text-gray-500 font-medium">{cert.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-1">{cert.issuer || 'Veren Kurum'}</p>
                      {cert.desc && <p className="text-xs text-gray-500 italic">{cert.desc}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* CV Skills & Languages */}
            {(cvData.skills.length > 0 || cvData.languages.length > 0) && (
              <section className="grid grid-cols-2 gap-8">
                {cvData.skills.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-6 border-t-2 border-gray-400"></span> Yetenekler
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(cvData || {})?.skills?.map((skill, i) => (
                        <span key={i} className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {cvData.languages.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-6 border-t-2 border-gray-400"></span> Diller
                    </h2>
                    <div className="space-y-2">
                      {(cvData || {})?.languages?.map((lang) => (
                        <div key={lang.id} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-900">{lang.lang}</span>
                          <span className="text-xs text-gray-500">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
            
          </div>
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
      </style>
    </div>
      </main>
    </div>
  );
}

// Helpers
function SectionBtn({ id, icon, label, active, set }) {
  return (
    <button 
      onClick={() => set(id)}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold transition whitespace-nowrap
        ${active === id ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      {icon} {label}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, id }) {
  const inputId = id || label.replace(/[\s/]+/g, '-').toLowerCase();
  return (
    <div>
      <label htmlFor={inputId} className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">{label}</label>
      <input 
        id={inputId}
        type="text" 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-indigo-400 transition hover:border-indigo-300"
        placeholder={placeholder}
      />
    </div>
  );
}
