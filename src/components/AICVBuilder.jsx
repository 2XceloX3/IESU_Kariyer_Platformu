import React, { useState } from 'react';
import {  FileText, Wand2, Plus, Trash2, Download, Printer, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Search, ChevronLeft, ShieldCheck, Home, Compass, MessageCircle, Bell } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';

const NavIcon = ({ icon, label, badge, active, onClick }) => {
  const getClasses = () => {
    switch (label) {
      case 'Akış': return { text: 'text-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
      case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
      case 'İş ve Staj': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'Mesajlar': return { text: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-500', glow: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' };
      case 'Bildirimler': return { text: 'text-rose-500', bg: 'bg-rose-50', badge: 'bg-rose-500', glow: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]' };
      default: return { text: 'text-iesu-red', bg: 'bg-red-50', badge: 'bg-iesu-red', glow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]' };
    }
  };
  const c = getClasses();
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-14 rounded-2xl transition-all duration-500 group ${active ? `${c.bg} ${c.text} shadow-sm` : `text-gray-400 hover:${c.text} hover:${c.bg}`}`}
      title={label}
    >
      {React.cloneElement(icon, { size: active ? 22 : 20, className: `mb-1 transition-all duration-500 ${active ? `scale-110 ${c.glow}` : `group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:${c.glow}`}` })}
      <span className={`text-[9px] font-bold tracking-wide transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block'}`}>
        {label}
      </span>
      {badge > 0 && (
        <span className={`absolute top-1 right-2 sm:right-3 w-4 h-4 ${c.badge} text-white text-[9px] flex items-center justify-center rounded-full font-bold shadow-sm ring-2 ring-white`}>
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  );
};

export default function AICVBuilder({ currentUser, userRole, setView }) {
  const [activeSection, setActiveSection] = useState('personal'); // personal, experience, education, skills, certificates, summary
  
  // Initialize from currentUser if available — no fake data
  const [cvData, setCvData] = useState({
    name: currentUser?.name || '',
    photo: currentUser?.avatar || '',
    title: currentUser?.department ? `${currentUser.department} Öğrencisi` : '',
    email: currentUser?.email || '',
    phone: '',
    location: 'İstanbul, Türkiye',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certificates: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newLang, setNewLang] = useState('');
  const [newLangLevel, setNewLangLevel] = useState('Orta');

  // Simulate AI text generation
  const handleAIGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const eduPart = cvData.education.length > 0
        ? `${cvData.education[0].institution} ${cvData.education[0].degree} bölümünde eğitimine devam eden, `
        : '';
      const skillPart = cvData.skills.length >= 2
        ? `${cvData.skills.slice(0,2).join(' ve ')} konularında yetkin, `
        : cvData.skills.length === 1
          ? `${cvData.skills[0]} konusunda yetkin, `
          : '';
      const generated = `${eduPart}${skillPart}gelişime açık ve motivasyonu yüksek bir öğrenci. Kariyer hedeflerine ulaşmak için değer katabileceği bir organizasyonda deneyim kazanmayı hedefliyor.`;
      setCvData(prev => ({ ...prev, summary: generated }));
      setIsGenerating(false);
    }, 1500);
  };

  // --- EXPERIENCE CRUD ---
  const handleAddExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', role: '', date: '', desc: '' }]
    }));
    setActiveSection('experience');
  };

  const updateExperience = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience?.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience?.filter(exp => exp.id !== id)
    }));
  };

  // --- EDUCATION CRUD ---
  const handleAddEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), institution: '', degree: '', date: '', desc: '' }]
    }));
    setActiveSection('education');
  };

  const updateEducation = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education?.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education?.filter(edu => edu.id !== id)
    }));
  };

  // --- SKILLS CRUD ---
  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !cvData.skills.includes(trimmed)) {
      setCvData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCvData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  // --- LANGUAGES CRUD ---
  const handleAddLanguage = () => {
    const trimmed = newLang.trim();
    if (trimmed) {
      setCvData(prev => ({
        ...prev,
        languages: [...prev.languages, { id: Date.now(), lang: trimmed, level: newLangLevel }]
      }));
      setNewLang('');
      setNewLangLevel('Orta');
    }
  };

  const handleRemoveLanguage = (id) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  // --- CERTIFICATES CRUD ---
  const handleAddCertificate = () => {
    setCvData(prev => ({
      ...prev,
      certificates: [...prev.certificates, { id: Date.now(), name: '', issuer: '', date: '', desc: '' }]
    }));
    setActiveSection('certificates');
  };

  const updateCertificate = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates?.map(cert => cert.id === id ? { ...cert, [field]: value } : cert)
    }));
  };

  const removeCertificate = (id) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates?.filter(cert => cert.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-20">
      {/* Hyper-Modern Navbar (Glassmorphism) */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 hide-on-print">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')}>
            <Logo className="h-10 w-auto text-iesu-red hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-[13px] font-black text-gray-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>
          
          {/* MIDDLE: Search Bar (Hidden on small screens) */}
          <div className="hidden md:flex relative group flex-1 max-w-md mx-auto shrink opacity-0 pointer-events-none">
            {/* Boş alan tutucu */}
          </div>
          
          {/* RIGHT: Navigation Icons & Profile */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" active={false} onClick={() => setView(userRole === 'admin' ? 'student' : userRole === 'employer' ? 'company' : userRole || 'landing')} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" active={false} onClick={() => {}} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={false} onClick={() => setView('jobs')} />
            <NavIcon icon={<MessageCircle />} label="Mesajlar" active={false} onClick={() => setView('messaging')} />
            
            <TopProfileMenu currentUser={currentUser || { name: 'Kullanıcı' }} userRole={userRole || 'student'} setView={setView} />
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-8 hide-on-print">
        <div className="bg-[#f8fafc] flex flex-col lg:flex-row h-[800px] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
      
      {/* LEFT PANE: Editor */}
      <div className="w-full lg:w-5/12 bg-white flex flex-col border-r border-gray-100 z-10 shrink-0">
        <div className="p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Wand2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-tight">Akıllı CV Oluşturucu</h2>
              <p className="text-xs font-bold text-indigo-600">Yapay Zekâ Destekli Asistan</p>
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
                <label className="text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Fotoğraf</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {(cvData || {})?.photo ? (
                      <img src={(cvData || {})?.photo} alt="CV Fotoğrafı" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition text-center inline-block">
                      Fotoğraf Seç
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (e) => setCvData({...cvData, photo: e.target.result});
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
              <Input label="Ad Soyad" value={(cvData || {})?.name} onChange={v => setCvData({...cvData, name: v})} />
              <Input label="Meslek / Unvan" value={(cvData || {})?.title} onChange={v => setCvData({...cvData, title: v})} placeholder="Örn: Yazılım Mühendisliği Öğrencisi" />
              <Input label="E-posta" value={(cvData || {})?.email} onChange={v => setCvData({...cvData, email: v})} />
              <Input label="Telefon" value={(cvData || {})?.phone} onChange={v => setCvData({...cvData, phone: v})} />
              <Input label="Konum" value={(cvData || {})?.location} onChange={v => setCvData({...cvData, location: v})} />
            </div>
          )}

          {/* SUMMARY */}
          {activeSection === 'summary' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black text-gray-900">Profesyonel Özet</h3>
                <button 
                  onClick={handleAIGenerateSummary}
                  disabled={isGenerating}
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Wand2 size={12} className={isGenerating ? "animate-pulse" : ""} /> 
                  {isGenerating ? 'Yazılıyor...' : 'AI ile Oluştur'}
                </button>
              </div>
              <textarea
                rows="6"
                value={(cvData || {})?.summary}
                onChange={e => setCvData({...cvData, summary: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 outline-none resize-none transition"
                placeholder="Kendinizi kısaca tanıtın..."
              ></textarea>
              <p className="text-[11px] text-gray-500 font-medium bg-blue-50 p-3 rounded-lg border border-blue-100">
                <span className="font-bold text-blue-700 block mb-1">İpucu:</span>
                Yapay Zekâ asistanımız, eğitim ve yetenek bilgilerinizi kullanarak size özel, profesyonel bir özet metni oluşturabilir.
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-900">İş Deneyimi & Stajlar</h3>
                <button onClick={handleAddExperience} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>

              {(cvData || {})?.experience.length === 0 ? (
                <div className="text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <Briefcase size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Henüz iş veya staj deneyimi eklenmemiş.</p>
                </div>
              ) : (
                (cvData || {})?.experience?.map((exp, i) => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 mt-2">
                      <Input label="Şirket / Kurum Adı" value={exp.company} onChange={v => updateExperience(exp.id, 'company', v)} />
                      <Input label="Pozisyon / Görev" value={exp.role} onChange={v => updateExperience(exp.id, 'role', v)} />
                      <Input label="Tarih Aralığı (Örn: Haz 2023 - Ağu 2023)" value={exp.date} onChange={v => updateExperience(exp.id, 'date', v)} />
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Açıklama</label>
                        <textarea
                          rows="3"
                          value={exp.desc}
                          onChange={e => updateExperience(exp.id, 'desc', e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
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
                <button onClick={handleAddEducation} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>

              {(cvData || {})?.education.length === 0 ? (
                <div className="text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <GraduationCap size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Henüz eğitim bilgisi eklenmemiş.</p>
                </div>
              ) : (
                (cvData || {})?.education?.map((edu) => (
                  <div key={edu.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 mt-2">
                      <Input label="Kurum Adı" value={edu.institution} onChange={v => updateEducation(edu.id, 'institution', v)} />
                      <Input label="Bölüm / Program" value={edu.degree} onChange={v => updateEducation(edu.id, 'degree', v)} />
                      <Input label="Tarih Aralığı (Örn: 2021 - Devam Ediyor)" value={edu.date} onChange={v => updateEducation(edu.id, 'date', v)} />
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Açıklama</label>
                        <textarea
                          rows="3"
                          value={edu.desc}
                          onChange={e => updateEducation(edu.id, 'desc', e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
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
                  <input
                    type="text"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                    placeholder="Yeni yetenek yazın..."
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} /> Ekle
                  </button>
                </div>
                {cvData.skills.length === 0 ? (
                  <div className="text-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <Award size={20} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Henüz yetenek eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {cvData.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm group">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-gray-400 hover:text-red-600 transition ml-0.5"
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
                  <input
                    type="text"
                    value={newLang}
                    onChange={e => setNewLang(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddLanguage()}
                    className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                    placeholder="Dil adı (Örn: İngilizce)"
                  />
                  <select
                    value={newLangLevel}
                    onChange={e => setNewLangLevel(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
                  >
                    <option value="Başlangıç">Başlangıç</option>
                    <option value="Orta">Orta</option>
                    <option value="İleri">İleri</option>
                    <option value="Ana Dil">Ana Dil</option>
                  </select>
                  <button
                    onClick={handleAddLanguage}
                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Plus size={14} /> Ekle
                  </button>
                </div>
                {cvData.languages.length === 0 ? (
                  <div className="text-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <p className="text-sm text-gray-500 font-medium">Henüz dil eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cvData.languages.map(lang => (
                      <div key={lang.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm group">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-800">{lang.lang}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{lang.level}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition opacity-0 group-hover:opacity-100"
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
                <button onClick={handleAddCertificate} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                  <Plus size={14} /> Yeni Ekle
                </button>
              </div>

              {(cvData || {})?.certificates.length === 0 ? (
                <div className="text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <ShieldCheck size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Henüz sertifika eklenmemiş.</p>
                </div>
              ) : (
                (cvData || {})?.certificates?.map((cert) => (
                  <div key={cert.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <button onClick={() => removeCertificate(cert.id)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3 mt-2">
                      <Input label="Sertifika Adı" value={cert.name} onChange={v => updateCertificate(cert.id, 'name', v)} />
                      <Input label="Veren Kurum" value={cert.issuer} onChange={v => updateCertificate(cert.id, 'issuer', v)} />
                      <Input label="Tarih (Örn: Ocak 2024)" value={cert.date} onChange={v => updateCertificate(cert.id, 'date', v)} />
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">Açıklama</label>
                        <textarea
                          rows="3"
                          value={cert.desc}
                          onChange={e => updateCertificate(cert.id, 'desc', e.target.value)}
                          className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
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
          <button onClick={() => window.print()} className="bg-white/80 backdrop-blur-md text-gray-700 hover:text-indigo-600 p-2.5 rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition flex items-center gap-2" title="Yazdır">
            <Printer size={16} /> <span className="text-xs font-bold hidden sm:inline">Yazdır</span>
          </button>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white hover:bg-indigo-700 p-2.5 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-2" title="PDF İndir">
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
              {(cvData || {})?.photo && (
                <div className="w-24 h-32 bg-gray-100 border-2 border-gray-200 rounded overflow-hidden flex items-center justify-center shrink-0">
                  <img src={(cvData || {})?.photo} className="w-full h-full object-cover" alt="CV" />
                </div>
              )}
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
        ${active === id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
    >
      {icon} {label}
    </button>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 block mb-1 uppercase tracking-wide">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition"
        placeholder={placeholder}
      />
    </div>
  );
}
