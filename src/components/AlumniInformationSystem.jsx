import React, { useState, useRef } from 'react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import GlobeMap from './GlobeMap';
import ProfileUpdate from './ProfileUpdate';
import {
  UserCircle2, Briefcase, FileText, LogOut, BookOpen, GraduationCap,
  Plus, Trash2, Globe2, Languages, Award, X, Building2, Save, RefreshCw,
  Phone, Mail, MapPin, User, Calendar, BadgeCheck, Map, ArrowLeft,
  UploadCloud, ChevronRight, Star, Link, Compass, CreditCard, CheckCircle,
  Clock, AlertCircle, Download, ChevronDown, Users
} from 'lucide-react';

const LANGUAGE_LEVELS = ['Başlangıç (A1-A2)', 'Orta (B1-B2)', 'İleri (C1)', 'Anadil / Akıcı'];
const EXP_TYPES = ['Staj', 'Tam Zamanlı', 'Yarı Zamanlı', 'Gönüllü', 'Freelance'];

const TABS = [
  { id: 'ozluk',           label: '👤 Profil & Ayarlar',         icon: <User size={16} /> },
  { id: 'kariyer_checkup', label: '🧭 Kariyer Check-up',         icon: <Compass size={16} /> },
  { id: 'mezun_kart',      label: '💳 Mezun Kart Başvurusu',     icon: <CreditCard size={16} /> },
  { id: 'kulup_basvuru',   label: '👥 Öğrenci Kulübü Başvurusu', icon: <Users size={16} /> },
  { id: 'map',             label: '🌍 Dünyadaki Mezunlarımız',   icon: <Map size={16} /> },
];

const CV_SUB_TABS = [
  { id: 'cv_yukle', label: 'CV Yükle' },
  { id: 'cv_ai',    label: 'AI CV Oluşturucu' },
  { id: 'cv_ipucu', label: 'CV İpuçları' },
];

const LIKERT_OPTIONS = [
  { value: 1, label: 'Kesinlikle Hayır' },
  { value: 2, label: 'Hayır' },
  { value: 3, label: 'Kısmen' },
  { value: 4, label: 'Evet' },
  { value: 5, label: 'Kesinlikle Evet' },
];

export default function AlumniInformationSystem({ currentUser, setView, alumniCardApplications, setAlumniCardApplications }) {
  const { alumniSurveyResponses, setAlumniSurveyResponses, clubApplications, setClubApplications } = useAppStore();
  const [activeTab, setActiveTab] = useState('ozluk');
  const [activeCvTab, setActiveCvTab] = useState('cv_yukle');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // ─── Club Application State ───
  const [clubForm, setClubForm] = useState({
    name: '',
    purpose: '',
    advisorName: ''
  });
  const [clubSubmitted, setClubSubmitted] = useState(false);

  // ─── Kariyer Check-up Survey State ───
  const [surveyForm, setSurveyForm] = useState({
    q1_calisma: '',           // Çalışıyor mu?
    q2_sure: '',              // İlk iş ne kadar sürede bulundu
    q3_sektor: '',            // Sektör
    q4_kurum_turu: '',        // Kurum türü
    q5_gorev: '',             // Görev/ünvan
    q6_iliskili: 0,           // Likert 1-5 - bölümle ilgili mi
    q7_il: '',                // Çalıştığı il/ülke
    q8_calisma_sekli: '',     // Uzaktan/Hibrit/Ofis
    q9_lisansustu: '',        // Lisansüstü eğitim
    q10_telefon: '',          // Telefon güncel mi
    q11_eposta: '',           // E-posta güncel mi
    q12_oneri: '',            // Görüş ve öneriler
  });
  const [surveySubmitted, setSurveySubmitted] = useState(false);

  // ─── Mezun Kart State ───
  const [cardForm, setCardForm] = useState({
    tc: currentUser?.tc || '',
    phone: currentUser?.phone || '',
    kvkk: false,
  });
  const existingCardApp = (alumniCardApplications || []).find(
    a => a.email === currentUser?.email || a.name === currentUser?.name
  );


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
    kulup_basvuru: <Users size={20} />,
    kariyer_checkup: <Compass size={20} />,
    mezun_kart: <CreditCard size={20} />
  };
  const sectionColor = {
    ozluk: 'blue', akademik: 'indigo', staj: 'emerald',
    kurs: 'amber', sertifika: 'purple', dil: 'sky',
    cv: 'rose', map: 'teal',
    kariyer_checkup: 'indigo', mezun_kart: 'rose', kulup_basvuru: 'emerald'
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
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0 border border-red-100">
                <Logo className="w-6 h-6 object-contain text-[#e60000]" />
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
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className={`flex-1 ${activeTab === 'ozluk' ? '' : 'p-4 md:p-8 max-w-5xl mx-auto w-full'}`}>
        {activeTab === 'ozluk' ? (
          <ProfileUpdate currentUser={currentUser} setView={setView} />
        ) : (
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

          {/* ─── ÖĞRENCİ KULÜBÜ BAŞVURUSU ─── */}
          {activeTab === 'kulup_basvuru' && (
            <div className="space-y-6">
              {clubSubmitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Başvurunuz Alındı!</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">Kulüp kurma başvurunuz (EK-1) merkeze iletildi. Onay durumu e-posta adresinize bildirilecektir.</p>
                </div>
              ) : (
                <>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                    <Users size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-900">Yeni Öğrenci Kulübü Kurma Başvurusu (EK-1 Formu)</p>
                      <p className="text-xs text-amber-700 mt-0.5">Kurmak istediğiniz kulübün bilgilerini eksiksiz doldurun. Başvurunuz onaylandığında bu kulübün başkanı olarak yetkilendirileceksiniz.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className={lbl}>Kulüp Adı</label>
                      <input type="text" value={clubForm.name} onChange={e => setClubForm({...clubForm, name: e.target.value})} className={inp} placeholder="Örn: Yapay Zeka Kulübü" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={lbl}>Danışman Öğretim Elemanı (Ad Soyad)</label>
                      <input type="text" value={clubForm.advisorName} onChange={e => setClubForm({...clubForm, advisorName: e.target.value})} className={inp} placeholder="Örn: Dr. Ahmet Yılmaz" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={lbl}>Kuruluş Amacı ve Faaliyet Alanı</label>
                      <textarea rows={4} value={clubForm.purpose} onChange={e => setClubForm({...clubForm, purpose: e.target.value})} className={`${inp} resize-none`} placeholder="Kulübünüzün temel amacı ve faaliyetleri nelerdir?" />
                    </div>
                  </div>
                  <button
                    disabled={!clubForm.name || !clubForm.purpose || !clubForm.advisorName}
                    onClick={() => {
                      const newApp = {
                        id: `APP-${Date.now()}`,
                        name: clubForm.name,
                        purpose: clubForm.purpose,
                        advisorName: clubForm.advisorName,
                        userId: currentUser?.tc || 'ÖĞRENCİ',
                        date: new Date().toLocaleDateString('tr-TR'),
                        status: 'pending'
                      };
                      if (setClubApplications) setClubApplications([...(clubApplications || []), newApp]);
                      setClubSubmitted(true);
                      if (window.toast) window.toast.success('Kulüp başvurunuz gönderildi.');
                    }}
                    className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Başvuruyu Gönder
                  </button>
                </>
              )}
            </div>
          )}

          {/* ─── KARİYER CHECK-UP ─── */}
          {activeTab === 'kariyer_checkup' && (
            <div className="space-y-6">
              {surveySubmitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">Teşekkürler!</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">Yanıtlarınız başarıyla kaydedildi ve üniversitemizin istatistik havuzuna eklendi. Katkınız için teşekkürler.</p>
                  <button onClick={() => setSurveySubmitted(false)} className="mt-6 text-xs font-bold text-blue-600 hover:underline">Tekrar doldurmak istiyorum</button>
                </div>
              ) : (
                <>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex gap-3">
                    <Compass size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-indigo-900">Üniversitemizin İstatistiklerine Katkıda Bulunun</p>
                      <p className="text-xs text-indigo-700 mt-0.5">Mezun durumunuza ilişkin bilgiler anonim olarak toplanır ve KVKK kapsamında korunur. Hiçbir kişisel veri işverenlerle paylaşılmaz.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* S1 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">1. Şu anda aktif olarak çalışıyor musunuz?</p>
                      <div className="flex flex-wrap gap-2">
                        {['Çalışıyorum', 'Kısmi Zamanlı', 'Stajda', 'Hayr, Arıyorum', 'Hayır, Aramıyorum'].map(opt => (
                          <button key={opt} onClick={() => setSurveyForm({...surveyForm, q1_calisma: opt})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${ surveyForm.q1_calisma === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300' }`}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    {/* S2 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">2. İlk işinizi mezun olduktan ne kadar süre sonra buldunuz?</p>
                      <select value={surveyForm.q2_sure} onChange={e => setSurveyForm({...surveyForm, q2_sure: e.target.value})} className={inp}>
                        <option value="">Seçiniz</option>
                        {['Mezun olmadan buldum', '0-3 Ay', '3-6 Ay', '6-12 Ay', '1-2 Yıl', '2 Yıldan Fazla', 'Henüz bulamadım'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>

                    {/* S3 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">3. Çalıştığınız sektör</p>
                      <select value={surveyForm.q3_sektor} onChange={e => setSurveyForm({...surveyForm, q3_sektor: e.target.value})} className={inp}>
                        <option value="">Seçiniz</option>
                        {['Bilgi Teknolojileri', 'Sağlık', 'Eğitim', 'Finans / Bankacılık', 'İnşaat / Gayrimenkul', 'Lojistik / Taşımacılık', 'Perakende / Ticaret', 'Kamu / Devlet', 'Medya / İletişim', 'Turizm / Otelcilik', 'Sanayi / Üretim', 'Diğer'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>

                    {/* S4 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">4. Çalıştığınız kurumun türü</p>
                      <div className="flex flex-wrap gap-2">
                        {['Kamu', 'Özel Sektör', 'NGO / Sivil Toplum', 'Kendi İşim (Serbest)', 'Uluslararası Kurum'].map(opt => (
                          <button key={opt} onClick={() => setSurveyForm({...surveyForm, q4_kurum_turu: opt})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${ surveyForm.q4_kurum_turu === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300' }`}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    {/* S5 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">5. Mevcut göreviniz / ünvanınız</p>
                      <input type="text" value={surveyForm.q5_gorev} onChange={e => setSurveyForm({...surveyForm, q5_gorev: e.target.value})} className={inp} placeholder="Örn: Yazılım Mühendisi, Müdire, Analist..." />
                    </div>

                    {/* S6 - LİKERT */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-4">6. Çalıştığınız iş mezun olduğunuz bölümle ne kadar ilişkili?</p>
                      <div className="flex gap-2 justify-between">
                        {LIKERT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setSurveyForm({...surveyForm, q6_iliskili: opt.value})}
                            className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-xs font-bold transition-all ${
                              surveyForm.q6_iliskili === opt.value
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <span className="text-lg">{opt.value}</span>
                            <span className="text-center leading-tight" style={{fontSize: '9px'}}>{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* S7 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">7. Çalıştığınız il / ülke</p>
                      <input type="text" value={surveyForm.q7_il} onChange={e => setSurveyForm({...surveyForm, q7_il: e.target.value})} className={inp} placeholder="Örn: İstanbul, Almanya, Dubai..." />
                    </div>

                    {/* S8 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">8. Çalışma şekliniz</p>
                      <div className="flex flex-wrap gap-2">
                        {['Uzaktan (Remote)', 'Hibrit', 'Ofisten', 'Saha / Seyahat'].map(opt => (
                          <button key={opt} onClick={() => setSurveyForm({...surveyForm, q8_calisma_sekli: opt})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${ surveyForm.q8_calisma_sekli === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300' }`}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    {/* S9 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">9. Lisansüstü eğitim alıyor musunuz?</p>
                      <div className="flex gap-2">
                        {['Evet, Yüksek Lisans', 'Evet, Doktora', 'Hayır, Planım Var', 'Hayır'].map(opt => (
                          <button key={opt} onClick={() => setSurveyForm({...surveyForm, q9_lisansustu: opt})} className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold border text-center transition-all ${ surveyForm.q9_lisansustu === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300' }`}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    {/* S10 + S11 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-bold text-gray-900 mb-3">10. Telefon numaranız güncel mi?</p>
                        <div className="flex gap-2">
                          {['Evet', 'Hayır'].map(opt => (
                            <button key={opt} onClick={() => setSurveyForm({...surveyForm, q10_telefon: opt})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${ surveyForm.q10_telefon === opt ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200' }`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-bold text-gray-900 mb-3">11. E-posta adresiniz güncel mi?</p>
                        <div className="flex gap-2">
                          {['Evet', 'Hayır'].map(opt => (
                            <button key={opt} onClick={() => setSurveyForm({...surveyForm, q11_eposta: opt})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${ surveyForm.q11_eposta === opt ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200' }`}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* S12 */}
                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900 mb-3">12. Üniversitemize veya Kariyer Merkezimize iletmek istediğiniz görüş ve önerileriniz var mı?</p>
                      <textarea rows={3} value={surveyForm.q12_oneri} onChange={e => setSurveyForm({...surveyForm, q12_oneri: e.target.value})} className={`${inp} resize-none`} placeholder="Görüşlerinizi bizimle paylaşın..." />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const response = {
                        id: Date.now(),
                        respondedAt: new Date().toISOString(),
                        department: currentUser?.department || '',
                        graduationYear: currentUser?.graduationYear || '',
                        faculty: currentUser?.faculty || '',
                        ...surveyForm,
                      };
                      setAlumniSurveyResponses([response, ...alumniSurveyResponses]);
                      setSurveySubmitted(true);
                      if (window.toast) window.toast.success('Yanıtlarınız kaydedildi. Teşekkürler!');
                    }}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-md"
                  >
                    Yanıtlarımı Gönder
                  </button>
                </>
              )}
            </div>
          )}

          {/* ─── MEZUN KART BAŞVURUSU ─── */}
          {activeTab === 'mezun_kart' && (
            <div className="space-y-5">
              {existingCardApp ? (
                <div className="text-center py-12">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    existingCardApp.status === 'Onaylandı' || existingCardApp.status === 'Verildi' ? 'bg-green-50' : 'bg-amber-50'
                  }`}>
                    {existingCardApp.status === 'Onaylandı' || existingCardApp.status === 'Verildi'
                      ? <CheckCircle size={40} className="text-green-500" />
                      : <Clock size={40} className="text-amber-500" />
                    }
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{existingCardApp.status}</h3>
                  <p className="text-gray-500 text-sm">Başvuru Tarihi: {existingCardApp.date}</p>
                  <p className="text-xs text-gray-400 mt-2">Başvurunuz yapılmıştır. Onay süreci için beklemeye devam edin.</p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-5 flex gap-3">
                    <CreditCard size={20} className="text-[#e60000] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-gray-900">Mezun Kartı Nedir?</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">Üniversite kampüsüne giriş, kütüphane, spor tesisleri ve partner kurumlardan indirim sağlar. Fiziksel kart kapsamlı mezun ayrıcalıkları sunar.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>Ad Soyad</label>
                      <input type="text" disabled value={currentUser?.name || ''} className={`${inp} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                    </div>
                    <div>
                      <label className={lbl}>Bölüm &amp; Mezuniyet Yılı</label>
                      <input type="text" disabled value={`${currentUser?.department || 'Mezun'} - ${currentUser?.graduationYear || '2023'}`} className={`${inp} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                    </div>
                    <div>
                      <label className={lbl}>E-posta Adresi</label>
                      <input type="text" disabled value={currentUser?.email || ''} className={`${inp} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                    </div>
                    <div>
                      <label className={lbl}>TC Kimlik No (Zorunlu)</label>
                      <input
                        type="text"
                        maxLength="11"
                        value={cardForm.tc}
                        onChange={e => setCardForm({...cardForm, tc: e.target.value.replace(/\D/g,'')})}
                        className={inp}
                        placeholder="11 Haneli TC Kimlik No"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={lbl}>Telefon Numarası</label>
                      <input
                        type="tel"
                        value={cardForm.phone}
                        onChange={e => setCardForm({...cardForm, phone: e.target.value})}
                        className={inp}
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cardForm.kvkk}
                      onChange={e => setCardForm({...cardForm, kvkk: e.target.checked})}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-red-600"
                    />
                    <span className="text-xs text-gray-500 leading-relaxed">
                      Kişisel verilerimin Mezun Kartı basımı amacıyla işlenmesine dair KVKK Aydınlatma Metni'ni okudum ve onaylıyorum.
                    </span>
                  </label>

                  <button
                    disabled={!cardForm.tc || cardForm.tc.length !== 11 || !cardForm.phone || !cardForm.kvkk}
                    onClick={() => {
                      if (!cardForm.kvkk) return;
                      const newApp = {
                        id: `KART-${Date.now()}`,
                        name: currentUser?.name || 'Mezun',
                        tc: cardForm.tc,
                        department: currentUser?.department || 'Mezun',
                        gradYear: currentUser?.graduationYear || '2023',
                        email: currentUser?.email || '',
                        phone: cardForm.phone,
                        date: new Date().toLocaleDateString('tr-TR'),
                        status: 'Bekliyor'
                      };
                      if (setAlumniCardApplications) {
                        setAlumniCardApplications([newApp, ...(alumniCardApplications || [])]);
                      }
                      if (window.toast) window.toast.success('Başvurunuz alındı! En kısa sürede değerlendirilecektir.');
                    }}
                    className="w-full py-3.5 bg-[#e60000] hover:bg-red-700 text-white rounded-xl font-black text-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Başvuruyu Tamamla
                  </button>
                </>
              )}
            </div>
          )}

          {/* ─── MEZUN HARİTASI ─── */}

          {activeTab === 'map' && (
            <div className="w-full flex flex-col h-[700px]">
              <GlobeMap />
            </div>
          )}

          </div>
        )}
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
