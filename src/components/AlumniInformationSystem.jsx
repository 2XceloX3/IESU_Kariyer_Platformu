import React, { useState, useMemo } from 'react';
import {
  UserCircle2, Briefcase, FileText, LogOut, ChevronDown, ChevronRight,
  Save, RefreshCw, Globe2, BookOpen, GraduationCap, Plus, Trash2,
  Map, Languages, Award, X, Building2, Star, Phone, Mail, MapPin, User, Calendar, BadgeCheck
} from 'lucide-react';

const LANGUAGE_LEVELS = ['Başlangıç (A1-A2)', 'Orta (B1-B2)', 'İleri (C1)', 'Anadil / Akıcı'];
const EXP_TYPES = ['Staj', 'Tam Zamanlı', 'Yarı Zamanlı', 'Gönüllü', 'Freelance'];

export default function AlumniInformationSystem({ currentUser, setView }) {
  const [activeSection, setActiveSection] = useState('ozluk');
  const [isPersonalOpen, setIsPersonalOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- Form States ---
  const [ozluk, setOzluk] = useState({
    tc: currentUser?.tc || '',
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    linkedin: currentUser?.linkedin || '',
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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (window.toast) window.toast.success('Bilgileriniz başarıyla güncellendi.');
    }, 1200);
  };

  const addItem = (setter, list, newItem, resetItem, closeFn) => {
    if (!Object.values(newItem).some(v => v)) return;
    setter([...list, { id: Date.now(), ...newItem }]);
    resetItem();
    closeFn(false);
  };

  const removeItem = (setter, list, id) => setter(list.filter(i => i.id !== id));

  const NAV_SECTIONS = [
    {
      label: 'Kişisel Bilgiler', icon: UserCircle2, open: isPersonalOpen, toggle: () => setIsPersonalOpen(p => !p),
      children: [
        { id: 'ozluk', label: 'Özlük Bilgileri' },
        { id: 'akademik', label: 'Akademik Eğitim' },
        { id: 'staj', label: 'İş / Staj Tecrübeleri' },
        { id: 'kurs', label: 'Kurs / Seminer / Kongre' },
        { id: 'sertifika', label: 'Sertifika ve Belgeler' },
        { id: 'dil', label: 'Yabancı Dil Bilgileri' },
      ]
    }
  ];

  const sectionTitle = {
    ozluk: 'Özlük Bilgileri',
    akademik: 'Akademik Eğitim Bilgileri',
    staj: 'İş / Staj Tecrübeleri',
    kurs: 'Kurs / Seminer / Kongre',
    sertifika: 'Sertifika ve Belgeler',
    dil: 'Yabancı Dil Bilgileri',
    map: 'Dünyadaki Mezunlarımız',
  };

  const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">

      {/* ─── SIDEBAR ─── */}
      <div className="w-full md:w-64 bg-[#1f2937] text-white flex flex-col shrink-0 min-h-screen border-r border-gray-800">
        {/* Logo */}
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0">
              <img src="/iesu-logo.svg" alt="IESU" className="w-7 h-7 object-contain" onError={e => { e.target.style.display='none'; }} />
            </div>
            <div>
              <h1 className="text-xs font-bold leading-tight">İstanbul Esenyurt Üniversitesi</h1>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Mezun Bilgi Sistemi</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 space-y-0.5">
          {/* Personal accordion */}
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <button
                onClick={section.toggle}
                className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <section.icon size={15} />
                  {section.label}
                </div>
                {section.open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {section.open && (
                <div className="bg-[#111827] flex flex-col">
                  {section.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setActiveSection(child.id)}
                      className={`text-left px-10 py-2 text-xs font-medium transition-colors ${
                        activeSection === child.id
                          ? 'text-white border-l-2 border-blue-400 bg-gray-800'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Özgeçmiş (CV) */}
          <button
            onClick={() => setView('profile_update')}
            className="w-full flex items-center justify-between px-5 py-2.5 text-xs font-bold text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-2"><FileText size={15} /> Özgeçmiş / CV</div>
            <ChevronRight size={14} />
          </button>

          {/* Harita */}
          <button
            onClick={() => setActiveSection('map')}
            className={`w-full flex items-center justify-between px-5 py-2.5 text-xs font-bold transition-colors ${
              activeSection === 'map' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-2"><Map size={15} /> Dünyadaki Mezunlarımız</div>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900 space-y-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentUser?.name?.[0] || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Mezun'}</p>
              <p className="text-[10px] text-gray-400 truncate">{currentUser?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={() => setView('alumni')}
            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={13} /> Kariyer Portalı'na Dön
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">

        {/* Header */}
        <header className="h-14 border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white shadow-sm">
          <h2 className="text-base font-black text-gray-800">{sectionTitle[activeSection] || 'Profil Yönetimi'}</h2>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-blue-700">MBS Bağlantısı Aktif</span>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              Kaydet
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fa]">
          <div className={`mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 ${activeSection === 'map' ? 'max-w-6xl' : 'max-w-4xl'}`}>

            {/* ─── ÖZLÜK BİLGİLERİ ─── */}
            {activeSection === 'ozluk' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Temel Kimlik & İletişim Bilgileri</h3>
                    <p className="text-xs text-gray-500">Kişisel bilgilerinizi güncel tutun.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>TC Kimlik No</label>
                    <input type="text" value={ozluk.tc} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                  </div>
                  <div>
                    <label className={labelCls}>Ad Soyad</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={ozluk.name} onChange={e => setOzluk({...ozluk, name: e.target.value})} className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>E-Posta Adresi</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={ozluk.email} onChange={e => setOzluk({...ozluk, email: e.target.value})} className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Telefon Numarası</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" value={ozluk.phone} onChange={e => setOzluk({...ozluk, phone: e.target.value})} className={`${inputCls} pl-9`} placeholder="+90 555 555 5555" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>LinkedIn Profili</label>
                    <input type="url" value={ozluk.linkedin} onChange={e => setOzluk({...ozluk, linkedin: e.target.value})} className={inputCls} placeholder="linkedin.com/in/kullanici" />
                  </div>
                  <div>
                    <label className={labelCls}>İkametgah İli</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={ozluk.address} onChange={e => setOzluk({...ozluk, address: e.target.value})} className={`${inputCls} pl-9`} placeholder="Örn: İstanbul" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Hakkımda / Biyografi</label>
                    <textarea rows={3} value={ozluk.bio} onChange={e => setOzluk({...ozluk, bio: e.target.value})} className={`${inputCls} resize-none`} placeholder="Kariyer hedeflerinizden kısaca bahsedin..." />
                  </div>
                </div>
              </div>
            )}

            {/* ─── AKADEMİK EĞİTİM ─── */}
            {activeSection === 'akademik' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Akademik Eğitim Bilgileri</h3>
                    <p className="text-xs text-gray-500">Mezuniyet ve eğitim detaylarınız.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Mezun Olunan Fakülte / Enstitü</label>
                    <input type="text" value={akademik.faculty} onChange={e => setAkademik({...akademik, faculty: e.target.value})} className={inputCls} placeholder="Örn: Mühendislik Fakültesi" />
                  </div>
                  <div>
                    <label className={labelCls}>Bölüm / Program</label>
                    <input type="text" value={akademik.department} onChange={e => setAkademik({...akademik, department: e.target.value})} className={inputCls} placeholder="Örn: Bilgisayar Mühendisliği" />
                  </div>
                  <div>
                    <label className={labelCls}>Öğrenim Derecesi</label>
                    <select value={akademik.degree} onChange={e => setAkademik({...akademik, degree: e.target.value})} className={inputCls}>
                      <option>Ön Lisans</option>
                      <option>Lisans</option>
                      <option>Yüksek Lisans</option>
                      <option>Doktora</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Mezuniyet Yılı</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={akademik.graduationYear} onChange={e => setAkademik({...akademik, graduationYear: e.target.value})} className={`${inputCls} pl-9`} placeholder="Örn: 2023" />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Genel Not Ortalaması (GNO)</label>
                    <input type="text" value={akademik.gpa} onChange={e => setAkademik({...akademik, gpa: e.target.value})} className={inputCls} placeholder="Örn: 3.45 / 4.00" />
                  </div>
                </div>
              </div>
            )}

            {/* ─── İŞ / STAJ TECRÜBELERİ ─── */}
            {activeSection === 'staj' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">İş / Staj Tecrübeleri</h3>
                      <p className="text-xs text-gray-500">Profesyonel geçmişinizi ekleyin.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowExpModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
                    <Plus size={14} /> Tecrübe Ekle
                  </button>
                </div>

                {experiences.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                    <Briefcase size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">Henüz tecrübe eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {experiences.map(exp => (
                      <div key={exp.id} className="p-4 border border-gray-100 rounded-xl bg-white flex items-center justify-between group hover:border-gray-200 hover:shadow-sm transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{exp.title}</p>
                            <p className="text-xs text-blue-600 font-medium">{exp.company}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wide">{exp.type}</span>
                              {exp.startDate && <span className="text-[10px] text-gray-400">{exp.startDate} – {exp.endDate || 'Devam'}</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeItem(setExperiences, experiences, exp.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── KURS / SEMİNER ─── */}
            {activeSection === 'kurs' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Kurs / Seminer / Kongre</h3>
                      <p className="text-xs text-gray-500">Katıldığınız eğitimleri kaydedin.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowCourseModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors">
                    <Plus size={14} /> Eğitim Ekle
                  </button>
                </div>

                {courses.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                    <BookOpen size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">Henüz eğitim eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {courses.map(c => (
                      <div key={c.id} className="p-4 border border-gray-100 rounded-xl bg-white flex items-center justify-between group hover:border-gray-200 hover:shadow-sm transition-all">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{c.organizer} {c.year && `· ${c.year}`}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wide">{c.type}</span>
                        </div>
                        <button onClick={() => removeItem(setCourses, courses, c.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── SERTİFİKA VE BELGELER ─── */}
            {activeSection === 'sertifika' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Award size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Sertifika ve Belgeler</h3>
                      <p className="text-xs text-gray-500">Kazandığınız sertifikaları ekleyin.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowCertModal(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors">
                    <Plus size={14} /> Sertifika Ekle
                  </button>
                </div>

                {certificates.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                    <Award size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">Henüz sertifika eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certificates.map(cert => (
                      <div key={cert.id} className="p-4 border border-gray-100 rounded-xl bg-white flex items-start justify-between group hover:border-purple-100 hover:shadow-sm transition-all">
                        <div className="flex items-start gap-3">
                          <BadgeCheck size={18} className="text-purple-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{cert.name}</p>
                            <p className="text-xs text-gray-500">{cert.issuer} {cert.year && `· ${cert.year}`}</p>
                          </div>
                        </div>
                        <button onClick={() => removeItem(setCertificates, certificates, cert.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── YABANCI DİL ─── */}
            {activeSection === 'dil' && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                      <Languages size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Yabancı Dil Bilgileri</h3>
                      <p className="text-xs text-gray-500">Bildiğiniz dilleri ve seviyelerini ekleyin.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowLangModal(true)} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors">
                    <Plus size={14} /> Dil Ekle
                  </button>
                </div>

                {languages.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                    <Globe2 size={40} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">Henüz dil bilgisi eklenmemiş.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {languages.map(lang => (
                      <div key={lang.id} className="p-4 border border-gray-100 rounded-xl bg-white flex items-center justify-between group hover:border-sky-100 hover:shadow-sm transition-all">
                        <div>
                          <p className="font-bold text-gray-900">{lang.name}</p>
                          <p className="text-xs text-sky-600 font-medium mt-0.5">{lang.level}</p>
                        </div>
                        <button onClick={() => removeItem(setLanguages, languages, lang.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── MEZUN HARİTASI ─── */}
            {activeSection === 'map' && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Global Mezun Ağımız</h3>
                    <p className="text-sm text-gray-500 mt-1">42.500+ mezunumuz dünya genelinde aktif.</p>
                  </div>
                  <div className="flex flex-wrap gap-3 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-xs font-bold text-gray-700">Kuzey Amerika (450)</span></div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-xs font-bold text-gray-700">Avrupa (1.200)</span></div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-xs font-bold text-gray-700">Asya (300)</span></div>
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-xs font-bold text-gray-700">Türkiye (40.550)</span></div>
                  </div>
                </div>

                <div className="w-full aspect-video bg-[#0B1121] rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl border border-gray-800">
                  <Globe2 size={420} className="text-blue-900 absolute opacity-15" strokeWidth={0.5} />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>

                  {[
                    { top: '30%', left: '20%', color: 'blue', city: 'New York, ABD', count: '450 Mezun' },
                    { top: '25%', left: '55%', color: 'emerald', city: 'Berlin, Almanya', count: '1.200 Mezun' },
                    { top: '40%', left: '75%', color: 'amber', city: 'Tokyo, Japonya', count: '85 Mezun' },
                    { top: '35%', left: '60%', color: 'violet', city: 'Dubai, BAE', count: '320 Mezun' },
                    { top: '55%', left: '30%', color: 'rose', city: 'São Paulo, Brezilya', count: '60 Mezun' },
                  ].map((dot, i) => (
                    <div key={i} className="absolute group cursor-pointer z-10" style={{ top: dot.top, left: dot.left }}>
                      <span className={`absolute w-4 h-4 bg-${dot.color}-500 rounded-full animate-ping opacity-60`}></span>
                      <span className={`relative w-4 h-4 bg-${dot.color}-400 rounded-full block border-2 border-[#0B1121]`}></span>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none text-center">
                        {dot.city}<br /><span className="text-gray-500 text-[10px]">{dot.count}</span>
                      </div>
                    </div>
                  ))}

                  {/* İstanbul */}
                  <div className="absolute top-[35%] left-[50%] group cursor-pointer z-20">
                    <span className="absolute w-6 h-6 bg-red-600 rounded-full animate-ping opacity-75"></span>
                    <span className="relative w-6 h-6 bg-red-600 rounded-full block border-2 border-white shadow-[0_0_20px_rgba(220,38,38,0.8)]"></span>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-xl pointer-events-none text-center">
                      İstanbul, Türkiye<br /><span className="text-gray-500 text-[10px]">Merkez (40.550 Mezun)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-xs mt-4 text-center">
                  Ping noktalarının üzerine gelerek bölge detaylarını inceleyebilirsiniz.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ─── MODALS ─── */}

      {/* Tecrübe Modal */}
      {showExpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Tecrübe Ekle</h3>
              <button onClick={() => setShowExpModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelCls}>Pozisyon / Ünvan</label>
                <input autoFocus type="text" value={tempExp.title} onChange={e => setTempExp({...tempExp, title: e.target.value})} className={inputCls} placeholder="Örn: Yazılım Mühendisi" />
              </div>
              <div>
                <label className={labelCls}>Firma / Kurum</label>
                <input type="text" value={tempExp.company} onChange={e => setTempExp({...tempExp, company: e.target.value})} className={inputCls} placeholder="Örn: Google Türkiye" />
              </div>
              <div>
                <label className={labelCls}>Çalışma Tipi</label>
                <select value={tempExp.type} onChange={e => setTempExp({...tempExp, type: e.target.value})} className={inputCls}>
                  {EXP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Başlangıç</label>
                  <input type="month" value={tempExp.startDate} onChange={e => setTempExp({...tempExp, startDate: e.target.value})} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Bitiş</label>
                  <input type="month" value={tempExp.endDate} onChange={e => setTempExp({...tempExp, endDate: e.target.value})} className={inputCls} placeholder="Devam ediyor" />
                </div>
              </div>
            </div>
            <button onClick={() => addItem(setExperiences, experiences, tempExp, () => setTempExp({ title: '', company: '', type: 'Staj', startDate: '', endDate: '' }), setShowExpModal)} className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors text-sm">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Kurs Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Eğitim / Seminer Ekle</h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Eğitim Adı</label>
                <input autoFocus type="text" value={tempCourse.name} onChange={e => setTempCourse({...tempCourse, name: e.target.value})} className={inputCls} placeholder="Örn: Python ile Veri Bilimi" />
              </div>
              <div>
                <label className={labelCls}>Düzenleyen Kurum</label>
                <input type="text" value={tempCourse.organizer} onChange={e => setTempCourse({...tempCourse, organizer: e.target.value})} className={inputCls} placeholder="Örn: Coursera" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Tür</label>
                  <select value={tempCourse.type} onChange={e => setTempCourse({...tempCourse, type: e.target.value})} className={inputCls}>
                    <option>Kurs</option><option>Seminer</option><option>Kongre</option><option>Sertifika Programı</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Yıl</label>
                  <input type="text" value={tempCourse.year} onChange={e => setTempCourse({...tempCourse, year: e.target.value})} className={inputCls} placeholder="2024" />
                </div>
              </div>
            </div>
            <button onClick={() => addItem(setCourses, courses, tempCourse, () => setTempCourse({ name: '', organizer: '', type: 'Kurs', year: '' }), setShowCourseModal)} className="w-full py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-colors text-sm">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Sertifika Modal */}
      {showCertModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Sertifika Ekle</h3>
              <button onClick={() => setShowCertModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Sertifika Adı</label>
                <input autoFocus type="text" value={tempCert.name} onChange={e => setTempCert({...tempCert, name: e.target.value})} className={inputCls} placeholder="Örn: AWS Solutions Architect" />
              </div>
              <div>
                <label className={labelCls}>Veren Kurum</label>
                <input type="text" value={tempCert.issuer} onChange={e => setTempCert({...tempCert, issuer: e.target.value})} className={inputCls} placeholder="Örn: Amazon Web Services" />
              </div>
              <div>
                <label className={labelCls}>Yıl</label>
                <input type="text" value={tempCert.year} onChange={e => setTempCert({...tempCert, year: e.target.value})} className={inputCls} placeholder="2024" />
              </div>
            </div>
            <button onClick={() => addItem(setCertificates, certificates, tempCert, () => setTempCert({ name: '', issuer: '', year: '' }), setShowCertModal)} className="w-full py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors text-sm">
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Dil Modal */}
      {showLangModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900">Dil Ekle</h3>
              <button onClick={() => setShowLangModal(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Dil</label>
                <input autoFocus type="text" value={tempLang.name} onChange={e => setTempLang({...tempLang, name: e.target.value})} onKeyDown={e => e.key === 'Enter' && addItem(setLanguages, languages, tempLang, () => setTempLang({ name: '', level: 'Başlangıç (A1-A2)' }), setShowLangModal)} className={inputCls} placeholder="Örn: İngilizce" />
              </div>
              <div>
                <label className={labelCls}>Seviye</label>
                <select value={tempLang.level} onChange={e => setTempLang({...tempLang, level: e.target.value})} className={inputCls}>
                  {LANGUAGE_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button onClick={() => addItem(setLanguages, languages, tempLang, () => setTempLang({ name: '', level: 'Başlangıç (A1-A2)' }), setShowLangModal)} className="w-full py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors text-sm">
              Ekle
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
