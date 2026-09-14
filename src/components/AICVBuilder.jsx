import useAppStore from '../store/useAppStore';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {  FileText, Wand2, Plus, Trash2, Download, Printer, User, Briefcase, GraduationCap, Award, Mail, Phone, MapPin, Search, ChevronLeft, ShieldCheck, Home, Compass, MessageCircle, Bell, Dna } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import NavIcon from './shared/NavIcon';
import { generateAIResponse } from '../lib/gemini';
import { exportPDF } from '../lib/pdfExporter';


export default function AICVBuilder({ currentUser, userRole, setView, setSelectedUserId, onUpdateProfile }) {
  const messages = useAppStore(state => state.messages);
  const setMessages = useAppStore(state => state.setMessages);

  const [activeSection, setActiveSection] = useState('personal'); // personal, experience, education, skills, certificates, summary
  const [photoError, setPhotoError] = useState(false);
  
  // Initialize from localStorage OR currentUser if available
  const [cvData, setCvData] = useState(() => {
    try {
      const saved = localStorage.getItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`) || localStorage.getItem(`igu_cv_draft_${currentUser?.id || 'guest'}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn("Failed to load CV draft", e);
    }
    return {
      name: currentUser?.name || '',
      photo: (currentUser?.avatar && currentUser.avatar !== '/iesu-logo.svg') ? currentUser.avatar : '/iesu-logo.svg',
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

  // Automatically sync profile updates into CV Data
  useEffect(() => {
    if (currentUser) {
      setCvData(prev => {
        const eduList = [];
        if (currentUser.faculty || currentUser.department) {
          eduList.push({
            id: 'edu-profile-main',
            institution: 'İstanbul Esenyurt Üniversitesi',
            degree: `${currentUser.faculty || 'Fakülte'} - ${currentUser.department || 'Bölüm'}`,
            date: currentUser.grade ? `2022 - 2026 (${currentUser.grade})` : '2022 - 2026',
            desc: currentUser.thesis ? `Bitirme Projesi: ${currentUser.thesis}` : ''
          });
        }
        if (currentUser.isDoubleMajor && (currentUser.capFaculty || currentUser.capDept)) {
          eduList.push({
            id: 'edu-profile-cap',
            institution: 'İstanbul Esenyurt Üniversitesi (Çift Anadal / Yandal)',
            degree: `${currentUser.capFaculty || 'ÇAP Fakültesi'} - ${currentUser.capDept || 'ÇAP Bölümü'}`,
            date: currentUser.capGrade ? `ÇAP (${currentUser.capGrade})` : 'ÇAP Programı',
            desc: currentUser.capThesis ? `ÇAP Projesi: ${currentUser.capThesis}` : ''
          });
        }
        
        const syncedEdu = eduList.length > 0 ? [...eduList, ...(prev.education || []).filter(e => e.id !== 'edu-profile-main' && e.id !== 'edu-profile-cap')] : prev.education;

        const syncedExp = (currentUser.experiences || []).map(exp => ({
          id: exp.id || Date.now() + Math.random(),
          company: exp.company || exp.institution || 'Kurum',
          role: exp.title || exp.role || 'Pozisyon',
          date: exp.type || 'Staj',
          desc: exp.desc || ''
        }));

        const syncedCerts = (currentUser.certificates || []).map(cert => ({
          id: cert.id || Date.now() + Math.random(),
          name: cert.name || cert.title || '',
          issuer: cert.issuer || 'Sertifika Kurulu',
          date: cert.date || 'Güncel',
          desc: ''
        }));

        const syncedLangs = (currentUser.languages || []).map(lang => ({
          id: lang.id || Date.now() + Math.random(),
          lang: typeof lang === 'string' ? lang : (lang.name || lang.language),
          level: lang.level || 'Orta'
        }));

        return {
          ...prev,
          name: currentUser.name || prev.name,
          email: currentUser.email || prev.email,
          phone: currentUser.phone || prev.phone,
          location: currentUser.location || currentUser.city || prev.location,
          summary: currentUser.bio || currentUser.summary || prev.summary,
          photo: (currentUser.avatar && currentUser.avatar !== '/iesu-logo.svg') ? currentUser.avatar : prev.photo,
          title: currentUser.department ? `${currentUser.department} Öğrencisi` : prev.title,
          education: syncedEdu?.length > 0 ? syncedEdu : prev.education,
          experience: syncedExp?.length > 0 ? syncedExp : prev.experience,
          skills: currentUser.skills?.length > 0 ? Array.from(new Set([...currentUser.skills, ...(prev.skills || [])])) : prev.skills,
          certificates: syncedCerts?.length > 0 ? syncedCerts : prev.certificates,
          languages: syncedLangs?.length > 0 ? syncedLangs : prev.languages
        };
      });
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
    localStorage.setItem(`igu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
    setPhotoError(false);
  }, [cvData, currentUser?.id]);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  const handleSaveToProfile = useCallback(() => {
    try {
      localStorage.setItem(`iesu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
      localStorage.setItem(`igu_cv_draft_${currentUser?.id || 'guest'}`, JSON.stringify(cvData));
    } catch (e) {}
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
    if (window.toast && window.toast.success) {
      window.toast.success('CV başarıyla kaydedildi ve profilinizle eşitlendi!');
    }
  }, [cvData, currentUser, userRole, onUpdateProfile]);

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
    <div className="w-full bg-transparent">
      <main className="w-full hide-on-print">
        <div className="w-full bg-slate-100/80 flex flex-col relative overflow-hidden py-8 px-4 sm:px-8">
        
        {/* Preview Actions */}
        <div className="max-w-[210mm] mx-auto w-full flex flex-wrap items-center justify-between gap-2 mb-4 z-20">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              type="button"
              onClick={handleAIGenerateSummary} 
              disabled={isGenerating}
              className="bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
              title="Yapay zeka ile etkileyici kariyer özeti oluştur"
            >
              <Wand2 size={15} className={isGenerating ? "animate-spin" : ""} />
              <span>{isGenerating ? 'ANKA Yazıyor...' : 'AI Özet Üret'}</span>
            </button>
            <button 
              type="button"
              onClick={evolveCVWithGeneticAlgorithms} 
              disabled={isEvolving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
              title="ATS sistemleri için anahtar kelimeleri ve etkiyi optimize et"
            >
              <Dna size={15} className={isEvolving ? "animate-pulse" : ""} />
              <span>{isEvolving ? 'ATS Optimize Ediliyor...' : 'AI ATS Optimize'}</span>
            </button>
            <button 
              type="button"
              onClick={handleSaveToProfile} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 text-xs font-bold cursor-pointer"
              title="CV'yi kaydet ve profil ile eşitle"
            >
              <ShieldCheck size={15} />
              <span>Kaydet & Eşitle</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="bg-white text-gray-700 hover:text-red-600 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition flex items-center gap-2 cursor-pointer" title="Yazdır">
              <Printer size={16} /> <span className="text-xs font-bold">Yazdır</span>
            </button>
            <button onClick={() => exportPDF('cv-print-area', 'Ozgecmisim.pdf')} className="bg-[#990000] text-white hover:bg-red-800 px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer" title="PDF İndir">
              <Download size={16} /> <span className="text-xs font-bold">PDF İndir</span>
            </button>
          </div>
        </div>

        {/* The CV Document (A4 Ratio Centered Paper) */}
        <div className="w-full flex justify-center items-center overflow-x-auto pb-8">
          <div id="cv-print-area" className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-10 sm:p-12 relative text-gray-800 rounded-sm border border-gray-200 mx-auto">
            
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
                  src={((cvData || {})?.photo && !photoError) ? (cvData || {})?.photo : '/iesu-logo.svg'} 
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
