import React, { useState, useEffect } from 'react';
import { downloadReportPdf } from '../utils/downloadPdf';
import { 
  FileText, CheckCircle, Clock, Download, Briefcase, FileSignature, 
  ArrowRight, ShieldCheck, HelpCircle, LogIn, Search, ChevronLeft, 
  Building2, CheckCircle2, UserCheck, Calendar, Plus, BookOpen, 
  Barcode, Award, FileSpreadsheet, RotateCcw, AlertCircle 
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import Logo from './Logo';
import SubPanelFooter from './SubPanelFooter';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SEO from './SEO';
import Form1InternshipModal from './internship/Form1InternshipModal';
import DigitalInternshipNotebook from './internship/DigitalInternshipNotebook';
import InternshipCommissionPanel from './internship/InternshipCommissionPanel';
import SGKExportPanel from './internship/SGKExportPanel';
import { 
  SAMPLE_ENTERPRISE_INTERNSHIPS, 
  INTERNSHIP_STATUS, 
  LAW_REFERENCES 
} from '../services/internshipWorkflow';

export default function StajPanel({ setView, userRole = 'student', currentUser, previousView, setSelectedUserId }) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const storeInternships = useAppStore(state => state.internships) || [];
  const setStoreInternships = useAppStore(state => state.setInternships);

  const [activeTab, setActiveTab] = useState('surec'); // 'surec' | 'belgeler' | 'takip' | 'defter' | 'komisyon' | 'sgk_export'
  const [internshipStatus, setInternshipStatus] = useState(null);
  const [internshipLoading, setInternshipLoading] = useState(true);
  const [isForm1ModalOpen, setIsForm1ModalOpen] = useState(false);

  // Local state for all internships, fallback to enterprise samples if store is empty
  const [internshipsList, setInternshipsList] = useState(() => {
    if (Array.isArray(storeInternships) && storeInternships.length > 0) {
      return storeInternships;
    }
    return SAMPLE_ENTERPRISE_INTERNSHIPS;
  });

  // Keep synced with store
  useEffect(() => {
    if (Array.isArray(storeInternships) && storeInternships.length > 0) {
      setInternshipsList(storeInternships);
    }
  }, [storeInternships]);

  // Load latest internship for signed-in student from Firestore or in-memory list
  useEffect(() => {
    let cancelled = false;
    try { localStorage.removeItem('iesu_internship_status_v1'); } catch (_) {}
    (async () => {
      const uid = effectiveCurrentUser?.uid || effectiveCurrentUser?.id || null;
      if (!uid) {
        if (!cancelled) { setInternshipStatus(null); setInternshipLoading(false); }
        return;
      }
      try {
        const { fetchInternshipsForStudent, mapInternshipToPanelStatus } = await import('../services/internshipsFs');
        const rows = await fetchInternshipsForStudent(uid);
        if (cancelled) return;
        if (rows.length > 0) {
          const sorted = [...rows].sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
          setInternshipStatus(mapInternshipToPanelStatus(sorted[0]));
        } else {
          // Check local internships list for current user
          const studentMatches = internshipsList.filter(i => i.studentId === uid || i.studentName === effectiveCurrentUser?.name);
          if (studentMatches.length > 0) {
            setInternshipStatus(mapInternshipToPanelStatus(studentMatches[0]));
          } else {
            setInternshipStatus(null);
          }
        }
      } catch (e) {
        console.warn('StajPanel load failed', e?.message);
        if (!cancelled) setInternshipStatus(null);
      } finally {
        if (!cancelled) setInternshipLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [effectiveCurrentUser?.id, effectiveCurrentUser?.uid, internshipsList]);

  useEffect(() => {
    const handleApproved = (e) => {
      const detail = e?.detail;
      if (!detail) return;
      setInternshipStatus(prev => ({
        ...(prev || {}),
        company: detail.company || prev?.company || '',
        status: detail.status || 'Onaylandı',
        advisor: detail.approvedBy || prev?.advisor || '',
        approvedDate: new Date().toLocaleDateString('tr-TR'),
      }));
    };
    window.addEventListener('iesu_internship_approved', handleApproved);
    return () => window.removeEventListener('iesu_internship_approved', handleApproved);
  }, []);

  const handleSaveForm1Internship = (newInternship) => {
    const updatedList = [newInternship, ...internshipsList.filter(i => i.id !== newInternship.id)];
    setInternshipsList(updatedList);
    if (setStoreInternships) {
      setStoreInternships(updatedList);
    }
    // Update active status for panel
    import('../services/internshipMap').then(({ mapInternshipToPanelStatus }) => {
      setInternshipStatus(mapInternshipToPanelStatus(newInternship));
      setActiveTab('takip');
    });
  };

  const handleUpdateInternship = (updatedItem) => {
    const updatedList = internshipsList.map(i => i.id === updatedItem.id ? updatedItem : i);
    setInternshipsList(updatedList);
    if (setStoreInternships) {
      setStoreInternships(updatedList);
    }
    if (internshipStatus && internshipStatus.id === updatedItem.id) {
      import('../services/internshipMap').then(({ mapInternshipToPanelStatus }) => {
        setInternshipStatus(mapInternshipToPanelStatus(updatedItem));
      });
    }
  };

  const handleDownloadSGKDeclarationPdf = () => {
    const sName = effectiveCurrentUser?.name || internshipStatus?.studentName || 'Öğrenci Adı Soyadı';
    const sNo = effectiveCurrentUser?.studentNo || internshipStatus?.studentNo || '20220101001';
    const sCompany = internshipStatus?.company || 'Staj Yapılan Kurum';
    const sBarcode = internshipStatus?.sgkBarcode || 'IESU-SGK-5510-8842193';

    downloadReportPdf(
      'sgk-5510-ise-giris-bildirgesi',
      `${sName.replace(/\s+/g, '_')}_SGK_5510_Ise_Giris_Bildirgesi`,
      [
        'T.C. SOSYAL GÜVENLİK KURUMU BAŞKANLIĞI',
        'SİGORTALI İŞE GİRİŞ BİLDİRGESİ',
        '5510 Sayılı Kanun Madde 5/b & 3308 Sayılı Kanun Kapsamında',
        '------------------------------------------------------------',
        `Barkod Referans No: ${sBarcode}`,
        `Tescil Tarihi: ${new Date().toLocaleDateString('tr-TR')}`,
        `İşveren Kurum: İSTANBUL ESENYURT ÜNİVERSİTESİ REKTÖRLÜĞÜ`,
        `İşyeri SGK Sicil No: 2.1234.01.01.0001923.034.01-00`,
        '------------------------------------------------------------',
        `Sigortalı Adı Soyadı: ${sName}`,
        `Öğrenci Numarası: ${sNo}`,
        `Sigorta Kolu Kodu: 07 (Çırak, Stajyer ve Kursiyer)`,
        `Staj Yapılacak İşletme: ${sCompany}`,
        `Prim Ödeme Durumu: Üniversitemiz Bütçesinden Karşılanmaktadır.`,
        'Genel Sağlık Sigortası (GSS): e-Devlet Kapısı Üzerinden Tescillidir.',
        '------------------------------------------------------------',
        'Bu belge e-Devlet ve Sosyal Güvenlik Kurumu sistemi ile uyumlu resmi',
        'sigortalı işe giriş bildirgesi özetidir. e-İmzalıdır.'
      ]
    );
    window.toast?.success?.('📄 Resmî SGK 5510/5-b Sigortalı İşe Giriş Bildirgesi PDF olarak indirildi.');
  };

  const adimlar = [
    {
      icon: <FileText className="text-[#990000]" size={26} />,
      title: "1. Form-1 (Staj Kabul ve SGK Taahhüt Formu) Doldurulması",
      desc: "Öğrenci, staj yapacağı kurumu bulduktan sonra sistem üzerinden Form-1'i doldurur, 5510/5-b SGK sağlık beyanını ve 3308 sayılı kanun işveren kabulünü onaylar."
    },
    {
      icon: <FileSignature className="text-[#990000]" size={26} />,
      title: "2. Bölüm Staj Komisyonu Kararı",
      desc: "İmzalı kabul formu ve SGK beyanı Bölüm Staj Komisyonu'na iletilir; komisyon uygunluk incelemesi yaparak onay, revizyon veya ret kararını sisteme işler."
    },
    {
      icon: <Clock className="text-[#990000]" size={26} />,
      title: "3. Personel Dairesi SGK 5510/5-b Tescil ve Giriş İşlemleri",
      desc: "Staja başlamadan önce SGK iş kazası, meslek hastalığı ve bakmakla yükümlü olunmayanlar için GSS giriş bildirgesi Personel Dairesi tarafından SGK'ya tescil edilir."
    },
    {
      icon: <BookOpen className="text-[#990000]" size={26} />,
      title: "4. Dijital Staj Defteri Doldurma ve Final Notlandırma",
      desc: "Staj süresince günlük çalışmalar dijital deftere kaydedilir; staj bitiminde işyeri değerlendirme notu ve komisyon incelemesiyle OBS'ye işlenecek final notu verilir."
    }
  ];

  const dokumanlar = [
    { 
      title: "Form-1: Resmî Staj Kabul ve SGK Taahhüt Formu (3308 / 5510)", 
      size: "145 KB", 
      ext: "PDF",
      isForm1: true 
    },
    { 
      title: "Dijital Staj Defteri Resmî Şablonu", 
      size: "215 KB", 
      ext: "PDF",
      isNotebook: true
    },
    { 
      title: "3308 Sayılı Kanun Staj Ücretlerine İşsizlik Fonu Katkısı Formu", 
      size: "142 KB", 
      ext: "PDF" 
    },
    { 
      title: "İşveren Stajyer Performans ve Yetkinlik Değerlendirme Formu", 
      size: "86 KB", 
      ext: "DOCX" 
    }
  ];

  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const backTarget = previousView || (
    activePortalBranch === 'student' ? 'student' :
    activePortalBranch === 'alumni' ? 'alumni' :
    activePortalBranch === 'academic' ? 'academic' :
    activePortalBranch === 'company' ? 'company' :
    (userRole === 'admin' ? 'admin' : 'student')
  );

  const isStaffOrAdmin = userRole === 'admin' || userRole === 'academic';

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-sans flex flex-col justify-between">
      <SEO 
        title="Staj & SGK 5510/3308 Süreçleri | İESÜ" 
        description="İstanbul Esenyurt Üniversitesi Form-1 Staj Kabulü, 5510/5-b SGK taahhüt işlemleri, Bölüm Staj Komisyonu ve Dijital Staj Defteri platformu."
      />

      <div>
        {/* Clean Institutional Subpanel Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 shrink-0">
            <button 
              onClick={() => setView(backTarget)}
              className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shadow-2xs group shrink-0"
              title="Geri Dön"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(backTarget)}>
              <Logo className="h-8 w-auto text-[#990000]" />
              <div>
                <h1 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-[#990000] tracking-wider uppercase">Kariyer Geliştirme Koordinatörlüğü • Resmî Staj Portalı</p>
              </div>
            </div>
          </div>

          {/* Right Group */}
          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto py-1 shrink-0">
            <div className="hidden lg:flex items-center gap-4 text-xs font-bold text-slate-600">
              <button onClick={() => setView(backTarget)} className="hover:text-[#990000] transition">Akış</button>
              <button onClick={() => setView('jobs')} className="hover:text-[#990000] transition">İş & Staj</button>
              <button onClick={() => setView('student_kgb')} className="hover:text-[#990000] transition">KGB Karnesi</button>
            </div>

            <button
              onClick={() => setIsForm1ModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <Plus size={14} /> Form-1 Başvurusu
            </button>

            {effectiveCurrentUser ? (
              <TopProfileMenu currentUser={effectiveCurrentUser} userRole={userRole || 'student'} setView={setView} setSelectedUserId={setSelectedUserId} />
            ) : (
              <button 
                onClick={() => setView('login')}
                className="flex items-center gap-1.5 bg-[#990000] text-white hover:bg-red-800 px-4 py-2 rounded-xl text-xs font-black transition shadow-xs whitespace-nowrap cursor-pointer"
              >
                <LogIn size={15} /> Giriş Yap
              </button>
            )}
          </div>
        </header>

        {/* Corporate Hero Header */}
        <div className="bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 text-white py-14 px-4 sm:px-8 relative overflow-hidden shadow-xl border-b border-red-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-bold text-red-200 mb-6">
              <button onClick={() => setView(backTarget)} className="hover:text-white hover:underline transition cursor-pointer">Öğrenci Akışı</button>
              <span>/</span>
              <button onClick={() => setView('student_hub')} className="hover:text-white hover:underline transition cursor-pointer">Kariyer & Gelişim Araçları</button>
              <span>/</span>
              <span className="text-white font-black">Staj ve 3308 / 5510 Resmî SGK İş Akışı</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black text-white mb-4 border border-white/20 uppercase tracking-widest">
                  <Briefcase size={14} className="text-red-200" /> Resmî Yasal Staj & SGK Sistemi
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white leading-tight drop-shadow-md">
                  Staj ve Resmî SGK İş Akışı
                </h1>
                <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed opacity-95">
                  3308 Sayılı Mesleki Eğitim Kanunu ve 5510 Sayılı Kanunun 5/b maddesi uyarınca Form-1 kabul işlemleri, Bölüm Staj Komisyonu onayı, toplu SGK bildirgesi ve dijital defter değerlendirmesi.
                </p>

                {/* Form-1 Action CTA */}
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => setIsForm1ModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-white text-[#990000] hover:bg-red-50 text-xs font-black transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>Form-1 Staj Başvurusu Yap</span>
                  </button>

                  {internshipStatus?.sgkBarcode && (
                    <button
                      onClick={handleDownloadSGKDeclarationPdf}
                      className="px-5 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-black transition flex items-center gap-2 cursor-pointer"
                    >
                      <Barcode size={16} className="text-emerald-300" />
                      <span>SGK 5510 Bildirgenizi İndirin</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-black/30 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl shrink-0 flex-wrap gap-1">
                <button 
                  onClick={() => setActiveTab('surec')}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'surec' ? 'bg-white text-[#990000] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  Süreç Adımları
                </button>
                <button 
                  onClick={() => setActiveTab('belgeler')}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'belgeler' ? 'bg-white text-[#990000] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  Resmî Belgeler
                </button>
                <button 
                  onClick={() => setActiveTab('takip')}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'takip' ? 'bg-white text-[#990000] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  Staj & Komisyon Takibi
                </button>
                <button 
                  onClick={() => setActiveTab('defter')}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'defter' ? 'bg-white text-[#990000] shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
                >
                  Dijital Staj Defteri
                </button>
                {isStaffOrAdmin && (
                  <button 
                    onClick={() => setActiveTab('komisyon')}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'komisyon' ? 'bg-white text-[#990000] shadow-md' : 'text-amber-300 hover:bg-white/10'}`}
                  >
                    Staj Komisyonu Masası
                  </button>
                )}
                {userRole === 'admin' && (
                  <button 
                    onClick={() => setActiveTab('sgk_export')}
                    className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'sgk_export' ? 'bg-white text-[#990000] shadow-md' : 'text-emerald-300 hover:bg-white/10'}`}
                  >
                    SGK Bildirge Masası
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          
          {/* TAB: SÜREÇ ADIMLARI */}
          {activeTab === 'surec' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
              <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 bg-[#990000] rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Yasal Başvuru ve Uygulama Adımları</h2>
                    <p className="text-xs text-slate-500 mt-0.5">3308 Sayılı Mesleki Eğitim Kanunu & 5510 Sayılı Kanunun 5/b Maddesi</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {adimlar.map((adim, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex items-start gap-6 hover:shadow-xl hover:border-red-100 transition-all group">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                        {adim.icon}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 group-hover:text-[#990000] transition-colors">{adim.title}</h3>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">{adim.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Info Card */}
              <div className="lg:col-span-4">
                <div className="bg-gradient-to-br from-[#990000] via-[#800000] to-[#660000] rounded-3xl p-8 text-white shadow-2xl border border-red-800 sticky top-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/20 pb-4">
                    <ShieldCheck className="text-red-200 shrink-0" size={28} />
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-white">Yasal Mevzuat Notları</h3>
                      <p className="text-[10px] font-extrabold text-red-200 uppercase tracking-widest">3308 & 5510 SK</p>
                    </div>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-red-200 shrink-0 mt-0.5" size={18} />
                      <span className="text-xs font-semibold text-white/95 leading-relaxed">
                        <b>5510/5-b:</b> Stajyer öğrencilerin iş kazası ve meslek hastalığı sigorta primleri Üniversitemiz Personel Dairesi Başkanlığı tarafından SGK'ya yatırılır.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-red-200 shrink-0 mt-0.5" size={18} />
                      <span className="text-xs font-semibold text-white/95 leading-relaxed">
                        <b>GSS Güvencesi:</b> Anne/baba üzerinden sağlık güvencesi bulunmayan öğrencilerin GSS primleri de Üniversitemiz bütçesinden karşılanır.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-red-200 shrink-0 mt-0.5" size={18} />
                      <span className="text-xs font-semibold text-white/95 leading-relaxed">
                        <b>3308 Madde 25:</b> İşletmelerde staj yapan öğrencilere net asgari ücretin belirli oranında stajyer ücreti ve İŞKUR İşsizlik Fonu Devlet Katkısı uygulanır.
                      </span>
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-white/20 space-y-2">
                    <p className="text-xs font-extrabold text-red-200 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle size={14} /> Sorularınız İçin:
                    </p>
                    <a href="mailto:kariyer@esenyurt.edu.tr" className="text-white font-black text-sm hover:underline block truncate">
                      kariyer@esenyurt.edu.tr
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESMÎ BELGELER */}
          {activeTab === 'belgeler' && (
            <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-8 bg-[#990000] rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resmî Formlar ve Belgeler</h2>
                    <p className="text-xs text-slate-500 mt-0.5">3308 ve 5510 Sayılı Kanunlara Uygun İESÜ Resmî Şablonları</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden divide-y divide-slate-100">
                {dokumanlar.map((doc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-red-50/30 transition-colors gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-[#990000] group-hover:scale-110 transition-transform shrink-0">
                        <Download size={22} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-slate-900 mb-1 group-hover:text-[#990000] transition-colors">{doc.title}</h4>
                        <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">{doc.ext} • {doc.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
                      {doc.isForm1 ? (
                        <button 
                          onClick={() => setIsForm1ModalOpen(true)}
                          className="px-4 py-2.5 rounded-xl bg-[#990000] text-white font-black text-xs hover:bg-red-800 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus size={15} /> Dijital Başvuru Yap
                        </button>
                      ) : doc.isNotebook ? (
                        <button 
                          onClick={() => setActiveTab('defter')}
                          className="px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 font-bold text-xs hover:bg-purple-100 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <BookOpen size={15} /> Defteri Aç
                        </button>
                      ) : null}

                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          const sName = effectiveCurrentUser?.name || 'Öğrenci Adı Soyadı';
                          const sNo = effectiveCurrentUser?.studentNo || '20220101001';
                          const sDept = effectiveCurrentUser?.department || 'Bölüm';
                          downloadReportPdf('staj-resmi-belge', `${doc.title.replace(/\s+/g, '_')}`, [
                            'İSTANBUL ESENYURT ÜNİVERSİTESİ',
                            'KARİYER GELİŞTİRME KOORDİNATÖRLÜĞÜ',
                            doc.title.toUpperCase(),
                            '------------------------------------------------------------',
                            `Öğrenci Adı Soyadı: ${sName}`,
                            `Öğrenci Numarası: ${sNo}`,
                            `Fakülte / Bölüm: ${sDept}`,
                            `Tarih: ${new Date().toLocaleDateString('tr-TR')}`,
                            'Kurum Yetkili Onayı: [Kaşe ve Islak İmza]',
                            'Fakülte Staj Komisyonu: [Onaylandı]'
                          ]);
                          window.toast?.success?.(`✅ "${doc.title}" PDF olarak indirildi.`);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer shadow-sm"
                      >
                        PDF İndir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: STAJ & KOMİSYON TAKİBİ */}
          {activeTab === 'takip' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Aktif Staj Dosyası</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">Staj & Fakülte Komisyon Takip Kartı</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" /> {internshipStatus?.status || (internshipLoading ? 'Yükleniyor…' : 'Henüz staj kaydı yok')}
                  </span>
                  {!internshipStatus && (
                    <button
                      onClick={() => setIsForm1ModalOpen(true)}
                      className="px-4 py-1.5 rounded-xl bg-[#990000] text-white text-xs font-black hover:bg-red-800 transition cursor-pointer"
                    >
                      Form-1 Doldur
                    </button>
                  )}
                </div>
              </div>

              {/* 3308 Sayılı Kanun Şeffaf Stajyer Güvencesi Rozetleri & Bilgilendirme */}
              <div className="bg-gradient-to-r from-blue-900/10 via-slate-900/5 to-emerald-900/10 p-5 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4" data-testid="staj-panel-3308-banner">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900">
                        3308 Sayılı Kanun Şeffaf Stajyer Güvencesi
                      </h4>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md text-[10px] font-black">
                        Mevzuat Koruma Kalkanı
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                      Öğrencilerimiz bedava ve güvencesiz staj sömürüsünden yasal olarak korunmaktadır.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-white text-blue-900 border border-blue-200 rounded-lg text-xs font-black shadow-xs flex items-center gap-1">
                    ⚖️ 3308 Ücret Güvenceli
                  </span>
                  <span className="px-2.5 py-1 bg-white text-emerald-900 border border-emerald-200 rounded-lg text-xs font-black shadow-xs flex items-center gap-1">
                    🏛️ Üniversite SGK Onaylı
                  </span>
                  <span className="px-2.5 py-1 bg-white text-amber-900 border border-amber-200 rounded-lg text-xs font-black shadow-xs flex items-center gap-1">
                    🍽️ Yol & Yemek Karşılanıyor
                  </span>
                </div>
              </div>

              {/* Status Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kabul Edilen Kurum</span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{internshipStatus?.company || '—'}</h3>
                    <p className="text-xs font-bold text-slate-500 mt-1">{internshipStatus?.role || '3308 / 5510 Staj'}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Staj Süresi:</span>
                    <span className="text-[#990000] font-black">{internshipStatus?.duration || '22 İş Günü'}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Akademik Staj Komisyonu</span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">{internshipStatus?.advisor || 'Bölüm Staj Komisyonu'}</h3>
                    <p className="text-xs font-bold text-emerald-600 mt-1">✓ Komisyon İnceleme Sürecinde</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Onay / Başvuru Tarihi:</span>
                    <span className="text-slate-900 font-black">{internshipStatus?.approvedDate || new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">SGK 5510/5-b Güvencesi</span>
                    <h3 className="text-lg font-black text-slate-900 mt-0.5">
                      {internshipStatus?.sgkBarcode || 'SGK Tescil Bekliyor'}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mt-1">✓ Prim İESÜ Rektörlüğü Tarafından Karşılanmaktadır</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>SGK Statüsü:</span>
                    <span className="text-emerald-700 font-black">{internshipStatus?.sgkStatus || 'Aktif'}</span>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <h4 className="font-black text-base">Dijital Staj Defterinizi Hazırladınız mı?</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Stajınız süresince günlük çalışmalarınızı sisteme girin, yetkinliklerinizi belgeleyin ve komisyon onayına sunun.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => setActiveTab('defter')}
                    className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <BookOpen size={15} />
                    <span>Dijital Defteri Aç</span>
                  </button>
                  {internshipStatus?.sgkBarcode && (
                    <button 
                      onClick={handleDownloadSGKDeclarationPdf}
                      className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Barcode size={15} />
                      <span>SGK Bildirgesi İndir</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DİJİTAL STAJ DEFTERİ */}
          {activeTab === 'defter' && (
            <DigitalInternshipNotebook 
              internship={internshipStatus?.raw || internshipStatus || {
                companyName: 'Aselsan A.Ş.',
                studentName: effectiveCurrentUser?.name || 'Ayşe Kaya',
                studentNo: effectiveCurrentUser?.studentNo || '20220101001',
                faculty: effectiveCurrentUser?.faculty || 'Mühendislik ve Doğa Bilimleri Fakültesi',
                department: effectiveCurrentUser?.department || 'Bilgisayar Mühendisliği',
                workDays: 22,
                startDate: '2026-07-01',
                endDate: '2026-07-31'
              }}
              onUpdateInternship={handleUpdateInternship}
              currentUser={effectiveCurrentUser}
              isAdvisorOrAdmin={isStaffOrAdmin}
            />
          )}

          {/* TAB: BÖLÜM STAJ KOMİSYONU MASASI (Staff/Admin) */}
          {activeTab === 'komisyon' && isStaffOrAdmin && (
            <InternshipCommissionPanel 
              internships={internshipsList}
              onUpdateInternship={handleUpdateInternship}
              currentUser={effectiveCurrentUser}
            />
          )}

          {/* TAB: SGK BİLDİRGE MASASI (Admin) */}
          {activeTab === 'sgk_export' && userRole === 'admin' && (
            <SGKExportPanel 
              internships={internshipsList}
              onUpdateInternship={handleUpdateInternship}
              currentUser={effectiveCurrentUser}
            />
          )}

        </div>
      </div>

      {/* Form-1 Modal */}
      <Form1InternshipModal 
        isOpen={isForm1ModalOpen}
        onClose={() => setIsForm1ModalOpen(false)}
        currentUser={effectiveCurrentUser}
        onSaveInternship={handleSaveForm1Internship}
      />

      {/* SubPanelFooter */}
      <SubPanelFooter setView={setView} />

      {/* Floating Bottom Dock */}
      {setView && (
        <SubPanelFloatingDock 
          currentUser={effectiveCurrentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
          activeTab="jobs"
        />
      )}
    </div>
  );
}
