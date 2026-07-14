import React, { useState, useMemo, useRef } from 'react';
import {
  UserCircle2, Briefcase, FileText, LogOut, BookOpen, GraduationCap,
  Plus, Trash2, Globe2, Languages, Award, X, Building2, Save, RefreshCw,
  Phone, Mail, MapPin, User, Calendar, BadgeCheck, Map, ArrowLeft,
  UploadCloud, ChevronRight, Star, Link
} from 'lucide-react';

const LANGUAGE_LEVELS = ['Başlangıç (A1-A2)', 'Orta (B1-B2)', 'İleri (C1)', 'Anadil / Akıcı'];
const EXP_TYPES = ['Staj', 'Tam Zamanlı', 'Yarı Zamanlı', 'Gönüllü', 'Freelance'];

const TABS = [
  { id: 'ozluk',    label: 'Özlük Bilgileri',          icon: <User size={16} /> },
  { id: 'akademik', label: 'Akademik Eğitim',           icon: <GraduationCap size={16} /> },
  { id: 'staj',     label: 'İş / Staj Tecrübeleri',    icon: <Briefcase size={16} /> },
  { id: 'kurs',     label: 'Kurs / Seminer',            icon: <BookOpen size={16} /> },
  { id: 'sertifika',label: 'Sertifika ve Belgeler',     icon: <Award size={16} /> },
  { id: 'dil',      label: 'Yabancı Dil',               icon: <Languages size={16} /> },
  { id: 'cv',       label: 'Özgeçmiş / CV',             icon: <FileText size={16} /> },
  { id: 'map',      label: 'Dünyadaki Mezunlarımız',    icon: <Map size={16} /> },
];

export default function AlumniInformationSystem({ currentUser, setView }) {
  const [activeTab, setActiveTab] = useState('ozluk');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // ─── Form States ───
  const [ozluk, setOzluk] = useState({
    tc: currentUser?.tc || '',
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    linkedin: currentUser?.linkedin || '',
    website: currentUser?.website || '',
    bio: currentUser?.bio || '',
  });

  const [akademik, setAkademik] = useState({
    faculty: currentUser?.faculty || '',
    department: currentUser?.department || '',
    gpa: currentUser?.gpa || '',
    graduationYear: currentUser?.graduationYear || '',
    degree: currentUser?.degree || 'Lisans',
  });

  const [experiences, setExperiences] = useState(currentUser?.experiences || []);
  const [showExpModal, setShowExpModal] = useState(false);
  const [tempExp, setTempExp] = useState({ title: '', company: '', type: 'Staj', startDate: '', endDate: '' });

  const [certificates, setCertificates] = useState(currentUser?.certificates || []);
  const [showCertModal, setShowCertModal] = useState(false);
  const [tempCert, setTempCert] = useState({ name: '', issuer: '', year: '' });

  const [languages, setLanguages] = useState(currentUser?.languages || []);
  const [showLangModal, setShowLangModal] = useState(false);
  const [tempLang, setTempLang] = useState({ name: '', level: 'Başlangıç (A1-A2)' });

  const [courses, setCourses] = useState(currentUser?.courses || []);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [tempCourse, setTempCourse] = useState({ name: '', organizer: '', type: 'Kurs', year: '' });

  const [cvFileName, setCvFileName] = useState(currentUser?.attachmentName || '');

  // ─── Helpers ───
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (window.toast) window.toast.success('Bilgileriniz başarıyla güncellendi.');
    }, 1200);
  };

  const addItem = (setter, list, newItem, reset, close) => {
    const vals = Object.values(newItem).filter(Boolean);
    if (!vals.length) return;
    setter([...list, { id: Date.now(), ...newItem }]);
    reset();
    close(false);
  };

  const removeItem = (setter, list, id) => setter(list.filter(i => i.id !== id));

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFileName(file.name);
      if (window.toast) window.toast.success('CV dosyası yüklendi.');
    }
  };

  const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all";
  const lbl = "block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide";

  const sectionIcon = {
    ozluk: <User size={20} />,
    akademik: <GraduationCap size={20} />,
    staj: <Briefcase size={20} />,
    kurs: <BookOpen size={20} />,
    sertifika: <Award size={20} />,
    dil: <Languages size={20} />,
    cv: <FileText size={20} />,
    map: <Map size={20} />,
  };
  const sectionColor = {
    ozluk: 'blue', akademik: 'indigo', staj: 'emerald',
    kurs: 'amber', sertifika: 'purple', dil: 'sky',
    cv: 'rose', map: 'teal',
  };
  const colorMap = {
    blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    btn: 'bg-blue-600 hover:bg-blue-700' },
    indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  btn: 'bg-indigo-600 hover:bg-indigo-700' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', btn: 'bg-gray-900 hover:bg-black' },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   btn: 'bg-amber-500 hover:bg-amber-600' },
    purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  btn: 'bg-purple-600 hover:bg-purple-700' },
    sky:     { bg: 'bg-sky-50',     text: 'text-sky-600',     btn: 'bg-sky-600 hover:bg-sky-700' },
    rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    btn: 'bg-rose-600 hover:bg-rose-700' },
    teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',    btn: 'bg-teal-600 hover:bg-teal-700' },
  };

  const currentColor = colorMap[sectionColor[activeTab]];

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">

      {/* ═══════════ TOP HEADER BAR ═══════════ */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        {/* Title row */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('alumni')}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all"
            >
              <ArrowLeft size={17} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e60000] flex items-center justify-center shadow-sm shrink-0">
                <img src="/iesu-logo.svg" alt="IESU" className="w-6 h-6 object-contain" onError={e => { e.target.style.display='none'; }} />
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-900 leading-tight">Mezun Bilgi Sistemi</h1>
                <p className="text-[10px] text-gray-400 font-medium">İstanbul Esenyurt Üniversitesi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-green-700">MBS Bağlantısı Aktif</span>
            </div>
            {currentUser?.name && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shrink-0">
                  {currentUser.name[0]}
                </div>
                <span className="hidden md:block text-sm font-bold text-gray-700">{currentUser.name}</span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#e60000] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {isSaving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
              <span className="hidden sm:inline">Kaydet</span>
            </button>
          </div>
        </div>

        {/* Tab navigation row – like AdminDashboard */}
        <div className="px-4 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[#e60000] text-[#e60000]'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <span className={isActive ? 'text-[#e60000]' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 animate-fade-in">

          {/* Section header */}
          <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl ${currentColor.bg} ${currentColor.text} flex items-center justify-center`}>
                {sectionIcon[activeTab]}
              </div>
              <div>
                <h2 className="font-black text-gray-900 text-lg">{TABS.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Bu alandaki bilgilerinizi güncelleyin</p>
              </div>
            </div>

            {/* Add button for list sections */}
            {['staj','kurs','sertifika','dil'].includes(activeTab) && (
              <button
                onClick={() => {
                  if (activeTab === 'staj') setShowExpModal(true);
                  if (activeTab === 'kurs') setShowCourseModal(true);
                  if (activeTab === 'sertifika') setShowCertModal(true);
                  if (activeTab === 'dil') setShowLangModal(true);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-xs font-bold transition-all shadow-sm ${currentColor.btn}`}
              >
                <Plus size={14} />
                {activeTab === 'staj' && 'Tecrübe Ekle'}
                {activeTab === 'kurs' && 'Eğitim Ekle'}
                {activeTab === 'sertifika' && 'Sertifika Ekle'}
                {activeTab === 'dil' && 'Dil Ekle'}
              </button>
            )}
          </div>

          {/* ─── ÖZLÜK BİLGİLERİ ─── */}
          {activeTab === 'ozluk' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={lbl}>TC Kimlik No</label>
                <input type="text" value={ozluk.tc} disabled className={`${inp} bg-gray-50 text-gray-400 cursor-not-allowed`} />
              </div>
              <div>
                <label className={lbl}>Ad Soyad</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={ozluk.name} onChange={e => setOzluk({...ozluk, name: e.target.value})} className={`${inp} pl-9`} />
                </div>
              </div>
              <div>
                <label className={lbl}>E-Posta Adresi</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={ozluk.email} onChange={e => setOzluk({...ozluk, email: e.target.value})} className={`${inp} pl-9`} />
                </div>
              </div>
              <div>
                <label className={lbl}>Telefon Numarası</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={ozluk.phone} onChange={e => setOzluk({...ozluk, phone: e.target.value})} className={`${inp} pl-9`} placeholder="+90 555 555 5555" />
                </div>
              </div>
              <div>
                <label className={lbl}>LinkedIn Profili</label>
                <div className="relative">
                  <Link size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="url" value={ozluk.linkedin} onChange={e => setOzluk({...ozluk, linkedin: e.target.value})} className={`${inp} pl-9`} placeholder="linkedin.com/in/kullanici" />
                </div>
              </div>
              <div>
                <label className={lbl}>İkametgah İli / Şehir</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={ozluk.address} onChange={e => setOzluk({...ozluk, address: e.target.value})} className={`${inp} pl-9`} placeholder="Örn: İstanbul" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Hakkımda / Biyografi</label>
                <textarea rows={3} value={ozluk.bio} onChange={e => setOzluk({...ozluk, bio: e.target.value})} className={`${inp} resize-none`} placeholder="Kariyer hedeflerinizden ve kendinizden kısaca bahsedin..." />
              </div>
            </div>
          )}

          {/* ─── AKADEMİK EĞİTİM ─── */}
          {activeTab === 'akademik' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={lbl}>Fakülte / Enstitü</label>
                <input type="text" value={akademik.faculty} onChange={e => setAkademik({...akademik, faculty: e.target.value})} className={inp} placeholder="Örn: Mühendislik Fakültesi" />
              </div>
              <div>
                <label className={lbl}>Bölüm / Program</label>
                <input type="text" value={akademik.department} onChange={e => setAkademik({...akademik, department: e.target.value})} className={inp} placeholder="Örn: Bilgisayar Mühendisliği" />
              </div>
              <div>
                <label className={lbl}>Öğrenim Derecesi</label>
                <select value={akademik.degree} onChange={e => setAkademik({...akademik, degree: e.target.value})} className={inp}>
                  <option>Ön Lisans</option>
                  <option>Lisans</option>
                  <option>Yüksek Lisans</option>
                  <option>Doktora</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Mezuniyet Yılı</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={akademik.graduationYear} onChange={e => setAkademik({...akademik, graduationYear: e.target.value})} className={`${inp} pl-9`} placeholder="Örn: 2023" />
                </div>
              </div>
              <div>
                <label className={lbl}>Genel Not Ortalaması (GNO)</label>
                <input type="text" value={akademik.gpa} onChange={e => setAkademik({...akademik, gpa: e.target.value})} className={inp} placeholder="Örn: 3.45 / 4.00" />
              </div>
            </div>
          )}

          {/* ─── İŞ / STAJ TECRÜBELERİ ─── */}
          {activeTab === 'staj' && (
            experiences.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <Briefcase size={44} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">Henüz tecrübe eklenmemiş.</p>
                <button onClick={() => setShowExpModal(true)} className="mt-4 text-xs font-bold text-blue-600 hover:underline">+ İlk tecrübeyi ekle</button>
              </div>
            ) : (
              <div className="grid gap-3">
                {experiences.map(exp => (
                  <div key={exp.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between group hover:border-gray-200 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 shrink-0 shadow-sm">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{exp.title}</p>
                        <p className="text-xs text-blue-600 font-medium">{exp.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded uppercase">{exp.type}</span>
                          {exp.startDate && <span className="text-[10px] text-gray-400">{exp.startDate} – {exp.endDate || 'Devam ediyor'}</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(setExperiences, experiences, exp.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ─── KURS / SEMİNER ─── */}
          {activeTab === 'kurs' && (
            courses.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <BookOpen size={44} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">Henüz eğitim eklenmemiş.</p>
                <button onClick={() => setShowCourseModal(true)} className="mt-4 text-xs font-bold text-amber-600 hover:underline">+ İlk eğitimi ekle</button>
              </div>
            ) : (
              <div className="grid gap-3">
                {courses.map(c => (
                  <div key={c.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between group hover:border-gray-200 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.organizer}{c.year ? ` · ${c.year}` : ''}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase">{c.type}</span>
                      </div>
                    </div>
                    <button onClick={() => removeItem(setCourses, courses, c.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ─── SERTİFİKA VE BELGELER ─── */}
          {activeTab === 'sertifika' && (
            certificates.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <Award size={44} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">Henüz sertifika eklenmemiş.</p>
                <button onClick={() => setShowCertModal(true)} className="mt-4 text-xs font-bold text-purple-600 hover:underline">+ İlk sertifikayı ekle</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex items-start justify-between group hover:border-purple-100 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3">
                      <BadgeCheck size={18} className="text-purple-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>
                      </div>
                    </div>
                    <button onClick={() => removeItem(setCertificates, certificates, cert.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ─── YABANCI DİL ─── */}
          {activeTab === 'dil' && (
            languages.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <Globe2 size={44} className="mx-auto text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">Henüz dil bilgisi eklenmemiş.</p>
                <button onClick={() => setShowLangModal(true)} className="mt-4 text-xs font-bold text-sky-600 hover:underline">+ İlk dili ekle</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {languages.map(lang => (
                  <div key={lang.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center justify-between group hover:border-sky-100 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-sky-500 shrink-0 shadow-sm text-sm font-black">
                        {lang.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{lang.name}</p>
                        <p className="text-xs text-sky-600 font-medium">{lang.level}</p>
                      </div>
                    </div>
                    <button onClick={() => removeItem(setLanguages, languages, lang.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ─── ÖZGEÇMİŞ / CV ─── */}
          {activeTab === 'cv' && (
            <div className="space-y-6">
              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-rose-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer group transition-all hover:bg-rose-50/30"
              >
                <input type="file" ref={fileInputRef} onChange={handleCvUpload} accept=".pdf,.doc,.docx" className="hidden" />
                <div className="w-16 h-16 bg-rose-50 group-hover:bg-rose-100 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                  <UploadCloud size={28} className="text-rose-500" />
                </div>
                <p className="font-bold text-gray-900 text-base">CV / Özgeçmiş Yükle</p>
                <p className="text-sm text-gray-400 mt-1.5">PDF, DOC veya DOCX formatı desteklenir</p>
                {cvFileName && (
                  <div className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl flex items-center gap-2 shadow-sm">
                    <FileText size={15} className="text-rose-500" />
                    <span className="text-sm font-bold text-gray-700">{cvFileName}</span>
                  </div>
                )}
              </div>

              {/* CV tips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Star size={18} />, title: 'ATS Uyumlu', desc: 'CV\'nizin otomatik sistemlerde okunabilir olmasına dikkat edin.' },
                  { icon: <FileText size={18} />, title: 'Güncel Tutun', desc: 'Her başvuru öncesi CV\'nizi son deneyimlerinizle güncelleyin.' },
                  { icon: <Globe2 size={18} />, title: 'İngilizce Versiyon', desc: 'Uluslararası fırsatlar için İngilizce CV hazırlayın.' },
                ].map((tip, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-rose-500">{tip.icon}<span className="text-sm font-bold text-gray-800">{tip.title}</span></div>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                  </div>
                ))}
              </div>

              {/* Link to AI CV Builder */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Yapay Zeka Destekli</p>
                  <h3 className="text-white font-black text-lg">AI CV Oluşturucu</h3>
                  <p className="text-gray-400 text-sm mt-1">Bilgilerinizden otomatik profesyonel CV oluşturun.</p>
                </div>
                <button
                  onClick={() => setView('cvbuilder')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shrink-0 shadow-sm"
                >
                  Başla <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── MEZUN HARİTASI ─── */}
          {activeTab === 'map' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-base font-black text-gray-900">Global Mezun Ağımız</h3>
                  <p className="text-xs text-gray-400 mt-0.5">42.500+ mezunumuz dünya genelinde.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: 'bg-blue-500', label: 'K. Amerika (450)' },
                    { color: 'bg-emerald-500', label: 'Avrupa (1.200)' },
                    { color: 'bg-amber-500', label: 'Asya (300)' },
                    { color: 'bg-red-500', label: 'Türkiye (40.550)' },
                  ].map(d => (
                    <div key={d.label} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <span className={`w-2 h-2 rounded-full ${d.color}`}></span>
                      <span className="text-xs font-bold text-gray-600">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full aspect-video bg-[#0B1121] rounded-2xl relative overflow-hidden shadow-2xl border border-gray-800">
                <Globe2 size={500} className="text-blue-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" strokeWidth={0.4} />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

                {[
                  { top:'30%', left:'20%', color:'blue-400',    glowColor:'59,130,246',  city:'New York, ABD',       count:'450 Mezun' },
                  { top:'25%', left:'55%', color:'emerald-400', glowColor:'16,185,129',  city:'Berlin, Almanya',     count:'1.200 Mezun' },
                  { top:'40%', left:'75%', color:'amber-400',   glowColor:'245,158,11',  city:'Tokyo, Japonya',      count:'85 Mezun' },
                  { top:'55%', left:'28%', color:'rose-400',    glowColor:'244,63,94',   city:'São Paulo, Brezilya', count:'60 Mezun' },
                  { top:'30%', left:'65%', color:'violet-400',  glowColor:'167,139,250', city:'Dubai, BAE',          count:'320 Mezun' },
                ].map((dot, i) => (
                  <div key={i} className="absolute group cursor-pointer z-10" style={{ top: dot.top, left: dot.left }}>
                    <span className={`absolute w-4 h-4 bg-${dot.color} rounded-full animate-ping opacity-60`}></span>
                    <span className={`relative w-4 h-4 bg-${dot.color} rounded-full block border-2 border-[#0B1121]`} style={{ boxShadow: `0 0 12px rgba(${dot.glowColor},0.7)` }}></span>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none text-center z-20">
                      {dot.city}<br /><span className="text-gray-400 font-normal text-[10px]">{dot.count}</span>
                    </div>
                  </div>
                ))}

                {/* İstanbul merkez */}
                <div className="absolute top-[35%] left-[52%] group cursor-pointer z-20">
                  <span className="absolute w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75"></span>
                  <span className="relative w-6 h-6 bg-red-600 rounded-full block border-2 border-white" style={{ boxShadow: '0 0 20px rgba(220,38,38,0.9)' }}></span>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none text-center z-30">
                    İstanbul, Türkiye<br /><span className="text-gray-400 font-normal text-[10px]">Merkez · 40.550 Mezun</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">Noktaların üzerine gelerek bölge detaylarını inceleyin.</p>
            </div>
          )}

        </div>
      </main>

      {/* ═══════════ MODALS ═══════════ */}

      {/* Tecrübe Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Tecrübe Ekle</h3>
              <button onClick={() => setShowExpModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className={lbl}>Pozisyon / Ünvan</label><input autoFocus type="text" value={tempExp.title} onChange={e => setTempExp({...tempExp, title: e.target.value})} className={inp} placeholder="Örn: Yazılım Mühendisi" /></div>
              <div><label className={lbl}>Firma / Kurum</label><input type="text" value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} className={inp} placeholder="Örn: Google Türkiye" /></div>
              <div><label className={lbl}>Çalışma Tipi</label>
                <select value={tempExp.type} onChange={e => setTempExp({...tempExp, type: e.target.value})} className={inp}>
                  {EXP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Başlangıç</label><input type="month" value={tempExp.startDate} onChange={e => setTempExp({...tempExp, startDate: e.target.value})} className={inp} /></div>
                <div><label className={lbl}>Bitiş</label><input type="month" value={tempExp.endDate} onChange={e => setTempExp({...tempExp, endDate: e.target.value})} className={inp} /></div>
              </div>
            </div>
            <button onClick={() => addItem(setExperiences, experiences, tempExp, () => setTempExp({ title:'', company:'', type:'Staj', startDate:'', endDate:'' }), setShowExpModal)} className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors text-sm">Kaydet</button>
          </div>
        </div>
      )}

      {/* Kurs Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Eğitim Ekle</h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className={lbl}>Eğitim Adı</label><input autoFocus type="text" value={tempCourse.name} onChange={e => setTempCourse({...tempCourse, name: e.target.value})} className={inp} placeholder="Örn: Python ile Veri Bilimi" /></div>
              <div><label className={lbl}>Düzenleyen Kurum</label><input type="text" value={tempCourse.organizer} onChange={e => setTempCourse({...tempCourse, organizer: e.target.value})} className={inp} placeholder="Örn: Coursera" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={lbl}>Tür</label>
                  <select value={tempCourse.type} onChange={e => setTempCourse({...tempCourse, type: e.target.value})} className={inp}>
                    <option>Kurs</option><option>Seminer</option><option>Kongre</option><option>Sertifika Programı</option>
                  </select>
                </div>
                <div><label className={lbl}>Yıl</label><input type="text" value={tempCourse.year} onChange={e => setTempCourse({...tempCourse, year: e.target.value})} className={inp} placeholder="2024" /></div>
              </div>
            </div>
            <button onClick={() => addItem(setCourses, courses, tempCourse, () => setTempCourse({ name:'', organizer:'', type:'Kurs', year:'' }), setShowCourseModal)} className="w-full py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors text-sm">Kaydet</button>
          </div>
        </div>
      )}

      {/* Sertifika Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Sertifika Ekle</h3>
              <button onClick={() => setShowCertModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className={lbl}>Sertifika Adı</label><input autoFocus type="text" value={tempCert.name} onChange={e => setTempCert({...tempCert, name: e.target.value})} className={inp} placeholder="Örn: AWS Solutions Architect" /></div>
              <div><label className={lbl}>Veren Kurum</label><input type="text" value={tempCert.issuer} onChange={e => setTempCert({...tempCert, issuer: e.target.value})} className={inp} placeholder="Örn: Amazon Web Services" /></div>
              <div><label className={lbl}>Yıl</label><input type="text" value={tempCert.year} onChange={e => setTempCert({...tempCert, year: e.target.value})} className={inp} placeholder="2024" /></div>
            </div>
            <button onClick={() => addItem(setCertificates, certificates, tempCert, () => setTempCert({ name:'', issuer:'', year:'' }), setShowCertModal)} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors text-sm">Kaydet</button>
          </div>
        </div>
      )}

      {/* Dil Modal */}
      {showLangModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Dil Ekle</h3>
              <button onClick={() => setShowLangModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"><X size={15} /></button>
            </div>
            <div className="space-y-3">
              <div><label className={lbl}>Dil</label><input autoFocus type="text" value={tempLang.name} onChange={e => setTempLang({...tempLang, name: e.target.value})} onKeyDown={e => e.key==='Enter' && addItem(setLanguages, languages, tempLang, ()=>setTempLang({ name:'', level:'Başlangıç (A1-A2)' }), setShowLangModal)} className={inp} placeholder="Örn: İngilizce" /></div>
              <div><label className={lbl}>Seviye</label>
                <select value={tempLang.level} onChange={e => setTempLang({...tempLang, level: e.target.value})} className={inp}>
                  {LANGUAGE_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => addItem(setLanguages, languages, tempLang, ()=>setTempLang({ name:'', level:'Başlangıç (A1-A2)' }), setShowLangModal)} className="w-full py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors text-sm">Ekle</button>
          </div>
        </div>
      )}

    </div>
  );
}
