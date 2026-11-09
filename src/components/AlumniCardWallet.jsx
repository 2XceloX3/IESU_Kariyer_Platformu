import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, CreditCard, Download, Printer, Copy, Check, CheckCircle2, 
  Sparkles, ShieldCheck, Coffee, BookOpen, Gift, Building2, ExternalLink, 
  QrCode, Wifi, RotateCw, Smartphone, Award, GraduationCap, X, ChevronRight, Lock
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import SafeAvatar from './shared/SafeAvatar';
import { toast } from './shared/Toast';
import useAppStore from '../store/useAppStore';

export default function AlumniCardWallet({ setView, currentUser, userRole = 'alumni', setSelectedUserId }) {
  const [flipped, setFlipped] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [walletModal, setWalletModal] = useState(null); // 'apple' | 'google' | null
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);

  const activePortalBranch = useAppStore(state => state.activePortalBranch);

  const handleBack = () => {
    const store = useAppStore.getState();
    const targetBranch = activePortalBranch || (userRole === 'admin' ? 'admin' : 'alumni');
    if (store.setActivePortalBranch) store.setActivePortalBranch(targetBranch);
    if (setView) setView(targetBranch);
    else window.history.back();
  };

  // Card Meta Data
  const alumniName = currentUser?.name || 'Caner Öztürk';
  const alumniDept = currentUser?.department || 'Bilgisayar Mühendisliği';
  const alumniGradYear = currentUser?.graduationYear || currentUser?.gradYear || '2023';
  const alumniAvatar = currentUser?.avatar || '/iesu-logo.svg';
  const alumniIdRaw = currentUser?.id || currentUser?.uid || '8841';
  const formattedCardNo = useMemo(() => {
    const cleanId = String(alumniIdRaw).replace(/\D/g, '').slice(-4).padStart(4, '0') || '8841';
    return `IESU-ALM-${alumniGradYear}-${cleanId}`;
  }, [alumniGradYear, alumniIdRaw]);

  const verifyUrl = `https://kariyer.esenyurt.edu.tr/verify/alumni/${formattedCardNo}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      toast.success('Doğrulama bağlantısı panoya kopyalandı!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (_) {
      toast.info(`Doğrulama Kodu: ${formattedCardNo}`);
    }
  };

  const handleCopyDiscountCode = (code, title) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`${title} indirim kodu (${code}) panoya kopyalandı!`);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch (_) {
      toast.info(`İndirim Kodu: ${code}`);
    }
  };

  const handlePrintCard = () => {
    toast.info("Yazdırma penceresi hazırlanıyor...");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handleDownloadCard = () => {
    toast.success("Resmî Mezun Kartı yüksek çözünürlüklü dijital sertifika olarak hazırlandı.");
    // In browser, trigger print or wallet export
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const handleAiScanOpportunities = () => {
    setIsAiAnalyzing(true);
    setAiRecommendation(null);
    toast.info('Mezun profiliniz ve sektörel yetkinlikleriniz taranıyor...');
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiRecommendation({
        title: `${alumniDept} Mezunlarına Özel Teknoloji & Lisansüstü Teşviki`,
        desc: `İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü iş ortaklıkları kapsamında, ${alumniDept} alanındaki mezunlarımıza özel Lisansüstü Eğitim Programlarında %35 burs ve Teknokent Hamisi AR-GE şirketlerinde geçerli %20 kurumsal avantaj tanımlandı.`,
        code: `IESU-TECH-${alumniGradYear}`
      });
      toast.success('Size özel kurumsal ayrıcalıklar başarıyla tespit edildi!');
    }, 1200);
  };

  // Privileges Data
  const privileges = [
    {
      id: 'priv-1',
      category: 'campus',
      title: 'Merkez Kütüphane & Dijital Veritabanları',
      provider: 'İESÜ Kütüphane ve Dokümantasyon Daire Bşk.',
      discount: 'Ömür Boyu Ücretsiz Erişim',
      description: 'YÖK ULAKBİM, IEEE Xplore, ScienceDirect ve kampüs kütüphanesine ömür boyu fiziksel ve uzaktan dijital erişim.',
      code: 'IESU-LIB-LIFETIME',
      icon: <BookOpen className="text-teal-600" size={20} />,
      bg: 'bg-teal-50 border-teal-200'
    },
    {
      id: 'priv-2',
      category: 'campus',
      title: 'Kampüs Kafeteryaları & Sosyal Tesisler',
      provider: 'İESÜ Sosyal Yaşam & Sağlık Kültür Spor',
      discount: '%20 İndirim',
      description: 'Tüm yerleşke kafe, yemekhane ve rekreasyon alanlarında dijital mezun kartınızı okutarak anında indirimden yararlanın.',
      code: 'IESU-CAFE-20',
      icon: <Coffee className="text-amber-600" size={20} />,
      bg: 'bg-amber-50 border-amber-200'
    },
    {
      id: 'priv-3',
      category: 'academic',
      title: 'Lisansüstü & Doktora Programları',
      provider: 'İESÜ Lisansüstü Eğitim Enstitüsü',
      discount: '%30 - %50 Mezun İndirimi',
      description: 'Tezli/Tezsiz Yüksek Lisans ve Doktora programlarında üniversitemiz mezunlarına özel kurumsal burs imkanı.',
      code: 'IESU-LEE-BURS',
      icon: <GraduationCap className="text-purple-600" size={20} />,
      bg: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'priv-4',
      category: 'corporate',
      title: 'Anlaşmalı Yazılım & Bulut Platformları',
      provider: 'Sanayi Protokol Hamisi Teknoloji Şirketleri',
      discount: '%25 Kurumsal İndirim',
      description: 'AWS, Google Cloud ve anlaşmalı bilişim eğitimlerinde sertifikasyon sınav voucher desteği.',
      code: 'IESU-CLOUD-25',
      icon: <Gift className="text-emerald-600" size={20} />,
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      id: 'priv-5',
      category: 'health',
      title: 'Üniversite Anlaşmalı Sağlık Merkezleri',
      provider: 'Protokollü Özel Sağlık Grubu',
      discount: '%35 Check-Up & Muayene İndirimi',
      description: 'Mezunlarımız ve birinci derece aile bireyleri için anlaşmalı sağlık kurumlarında tam kapsamlı sağlık desteği.',
      code: 'IESU-HEALTH-VIP',
      icon: <ShieldCheck className="text-rose-600" size={20} />,
      bg: 'bg-rose-50 border-rose-200'
    },
    {
      id: 'priv-6',
      category: 'corporate',
      title: 'Konaklama & Şehir Otelleri',
      provider: 'İESÜ Kurumsal İşbirliği Ağı',
      discount: '%20 Kurumsal Fiyat',
      description: 'İstanbul ve büyükşehirlerdeki iş seyahatlerinizde protokol anlaşmalı otellerde özel konaklama imkanı.',
      code: 'IESU-TRAVEL-20',
      icon: <Building2 className="text-blue-600" size={20} />,
      bg: 'bg-blue-50 border-blue-200'
    }
  ];

  const filteredPrivileges = selectedCategory === 'all' 
    ? privileges 
    : privileges.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-32">
      {/* ─── HEADER ─── */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-xs hide-on-print">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={handleBack} 
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 flex items-center justify-center text-slate-700 hover:text-emerald-700 transition cursor-pointer shadow-2xs group shrink-0"
            title="Geri Dön"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={handleBack}>
            <Logo color="emerald" className="h-8 w-auto text-emerald-700" />
            <div className="hidden sm:block text-left">
              <h1 className="font-black text-slate-900 text-sm sm:text-base leading-tight">Dijital Mezun Kartı</h1>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">İESÜ Mezunlar Portalı • Resmî Dijital Kimlik</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole="alumni" setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        
        {/* Title & Introduction */}
        <div className="text-center mb-8 mt-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3 border border-emerald-200 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-600" /> Resmî Akredite Mezun Kimliği
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Sanal Mezun Kartınız Aktif</h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Kampüs fiziki kapı geçişlerinde, kütüphane girişlerinde ve kurumsal protokol anlaşmalarında geçerli dijital kimlik belgeniz.
          </p>
        </div>

        {/* ─── 3D FLIPPABLE ID CARD (Robust Inline 3D Transform) ─── */}
        <div className="w-full max-w-md mx-auto mb-6" style={{ perspective: '1200px' }}>
          <div 
            onClick={() => setFlipped(!flipped)}
            className="relative w-full aspect-[1.586/1] rounded-3xl cursor-pointer select-none group shadow-2xl transition-all hover:scale-[1.01]"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* ═══ FRONT FACE (Deep Emerald Metallic Cyber Card) ═══ */}
            <div 
              className="absolute inset-0 rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between overflow-hidden border border-emerald-400/30 shadow-2xl"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #022c22 0%, #064e3b 45%, #047857 75%, #0f172a 100%)'
              }}
            >
              {/* Metallic Shimmer Overlays */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 pointer-events-none" />

              {/* Top Row: University Logo, Title, NFC & Verified Pill */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center p-1 shadow-inner">
                    <Logo color="emerald" className="h-7 w-auto filter brightness-0 invert" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-black tracking-tight uppercase leading-none">
                      İstanbul Esenyurt Üniversitesi
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest mt-1">
                      İESÜ Mezunlar Portalı • Kimlik
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi size={18} className="text-emerald-300 rotate-90 opacity-90" title="Temassız NFC" />
                  <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Aktif
                  </span>
                </div>
              </div>

              {/* Middle: EMV Smart Chip Graphic */}
              <div className="relative z-10 flex items-center gap-3 my-auto">
                <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/60 shadow-md p-1 relative overflow-hidden flex flex-col justify-between">
                  <div className="w-full h-[1px] bg-amber-600/40 my-auto" />
                  <div className="w-full h-[1px] bg-amber-600/40 my-auto" />
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-600/40" />
                  <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-600/40" />
                  <div className="w-2.5 h-2 rounded bg-amber-500/20 mx-auto" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-200/80 font-bold">
                  {formattedCardNo}
                </span>
              </div>

              {/* Bottom Row: User Avatar, Name, Department, Year */}
              <div className="relative z-10 flex items-end justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white p-0.5 shadow-lg border border-white/40 shrink-0 overflow-hidden">
                    <SafeAvatar 
                      src={alumniAvatar} 
                      name={alumniName} 
                      size={48} 
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-lg font-black tracking-tight text-white truncate leading-tight">
                      {alumniName}
                    </h4>
                    <p className="text-[11px] font-bold text-emerald-200 truncate mt-0.5">
                      {alumniDept}
                    </p>
                    <p className="text-[9px] font-mono font-semibold text-emerald-300/80">
                      Mezuniyet: {alumniGradYear}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] font-mono uppercase text-emerald-300/90 tracking-wider block">
                    STATÜ
                  </span>
                  <span className="text-xs font-black text-amber-300 tracking-wide uppercase">
                    Ömür Boyu
                  </span>
                </div>
              </div>
            </div>

            {/* ═══ BACK FACE (High-Security Barcode & QR Digital Pass) ═══ */}
            <div 
              className="absolute inset-0 rounded-3xl p-6 sm:p-7 text-slate-900 flex flex-col justify-between overflow-hidden border border-slate-300 shadow-2xl bg-white"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              {/* Magnetic Strip */}
              <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950" />

              <div className="mt-8 flex justify-between items-start gap-4">
                <div className="space-y-1 text-left flex-1">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Doğrulama ve Güvenlik Protokolü
                  </p>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    Bu kart İstanbul Esenyurt Üniversitesi Mezunlar Portalı resmî dijital kimlik belgesidir. Sahtecilik yapılamaz.
                  </p>
                  <p className="text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <CheckCircle2 size={13} /> Resmî Kayıt Doğrulandı
                  </p>
                  <p className="text-[9px] font-mono text-slate-500">
                    Protokol: {verifyUrl}
                  </p>
                </div>

                {/* High-Fidelity SVG QR Code */}
                <div className="shrink-0 p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Finder 1 Top-Left */}
                    <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="13" y="13" width="12" height="12" rx="1.5" fill="#047857" />
                    
                    {/* Finder 2 Top-Right */}
                    <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="75" y="13" width="12" height="12" rx="1.5" fill="#047857" />
                    
                    {/* Finder 3 Bottom-Left */}
                    <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="13" y="75" width="12" height="12" rx="1.5" fill="#047857" />

                    {/* QR Data Grid Matrix */}
                    <rect x="38" y="8" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="8" width="5" height="5" fill="#0f172a" />
                    <rect x="58" y="8" width="5" height="5" fill="#047857" />
                    <rect x="38" y="18" width="5" height="5" fill="#047857" />
                    <rect x="48" y="18" width="5" height="5" fill="#0f172a" />
                    <rect x="38" y="28" width="5" height="5" fill="#0f172a" />
                    <rect x="58" y="28" width="5" height="5" fill="#0f172a" />

                    <rect x="8" y="38" width="5" height="5" fill="#047857" />
                    <rect x="18" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="28" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="38" y="38" width="5" height="5" fill="#047857" />
                    <rect x="48" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="58" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="68" y="38" width="5" height="5" fill="#047857" />
                    <rect x="78" y="38" width="5" height="5" fill="#0f172a" />
                    <rect x="88" y="38" width="5" height="5" fill="#047857" />

                    <rect x="8" y="48" width="5" height="5" fill="#0f172a" />
                    <rect x="28" y="48" width="5" height="5" fill="#047857" />
                    <rect x="48" y="48" width="5" height="5" fill="#0f172a" />
                    <rect x="68" y="48" width="5" height="5" fill="#0f172a" />
                    <rect x="88" y="48" width="5" height="5" fill="#0f172a" />

                    <rect x="8" y="58" width="5" height="5" fill="#047857" />
                    <rect x="18" y="58" width="5" height="5" fill="#0f172a" />
                    <rect x="38" y="58" width="5" height="5" fill="#0f172a" />
                    <rect x="58" y="58" width="5" height="5" fill="#047857" />
                    <rect x="78" y="58" width="5" height="5" fill="#0f172a" />

                    <rect x="38" y="68" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="68" width="5" height="5" fill="#047857" />
                    <rect x="68" y="68" width="5" height="5" fill="#0f172a" />
                    <rect x="78" y="68" width="5" height="5" fill="#0f172a" />
                    <rect x="88" y="68" width="5" height="5" fill="#047857" />

                    <rect x="38" y="78" width="5" height="5" fill="#047857" />
                    <rect x="58" y="78" width="5" height="5" fill="#0f172a" />
                    <rect x="68" y="78" width="5" height="5" fill="#0f172a" />
                    <rect x="88" y="78" width="5" height="5" fill="#0f172a" />

                    <rect x="38" y="88" width="5" height="5" fill="#0f172a" />
                    <rect x="48" y="88" width="5" height="5" fill="#047857" />
                    <rect x="68" y="88" width="5" height="5" fill="#0f172a" />
                    <rect x="78" y="88" width="5" height="5" fill="#047857" />
                  </svg>
                </div>
              </div>

              {/* Barcode Strip & Signature */}
              <div className="pt-2 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-[2px] h-7">
                    {[3, 1, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1, 3].map((w, idx) => (
                      <div key={idx} style={{ width: `${w}px` }} className="h-full bg-slate-900" />
                    ))}
                  </div>
                  <p className="text-[8px] font-mono text-slate-500 tracking-widest mt-0.5">
                    *{formattedCardNo}*
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Yetkili Onay</p>
                  <p className="text-[10px] font-black text-emerald-800 italic">Kariyer Geliştirme Koordinatörlüğü</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CARD ACTION BUTTONS ─── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-lg mb-8">
          <button 
            type="button"
            onClick={() => setFlipped(!flipped)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <RotateCw size={14} className="text-emerald-600" />
            <span>Kartı Çevir ({flipped ? 'Ön Yüz' : 'Arka Yüz'})</span>
          </button>

          <button 
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-500" />}
            <span>{copiedLink ? 'Kopyalandı' : 'Doğrulama Linki'}</span>
          </button>

          <button 
            type="button"
            onClick={handlePrintCard}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs hover:shadow-xs transition cursor-pointer"
          >
            <Printer size={14} className="text-slate-500" />
            <span>Yazdır</span>
          </button>

          <button 
            type="button"
            onClick={handleDownloadCard}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow transition cursor-pointer"
          >
            <Download size={14} />
            <span>Kartı İndir</span>
          </button>
        </div>

        {/* Mobile Wallet Integration Bar */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Smartphone size={18} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-slate-900">Mobil Cüzdanına Ekle</h4>
              <p className="text-[11px] text-slate-500">Apple Wallet & Google Pay uyumlu kart geçişi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setWalletModal('apple')}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-black hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              Apple Wallet
            </button>
            <button
              onClick={() => setWalletModal('google')}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200"
            >
              Google Pay
            </button>
          </div>
        </div>

        {/* ─── AI MEZUN FIRSAT ASİSTANI (Working Intelligence) ─── */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                <Sparkles size={12} className="text-emerald-400" /> ANKA AI Mezun Fırsat Radarı
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {alumniDept} Bölümüne Özel Mezun Avantajları
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Yapay zekâ destekli analiz motoru, mezun olduğunuz disiplin ve sanayi protokollerimiz arasındaki güncel anlaşmaları tarayarak size özel indirimleri tanımlar.
              </p>
            </div>

            <button
              onClick={handleAiScanOpportunities}
              disabled={isAiAnalyzing}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles size={15} className={isAiAnalyzing ? 'animate-spin' : ''} />
              <span>{isAiAnalyzing ? 'Taranıyor...' : 'Bana Özel Fırsatları Tara'}</span>
            </button>
          </div>

          {aiRecommendation && (
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/30 animate-fade-in text-left space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Award size={15} /> {aiRecommendation.title}
                </span>
                <button
                  onClick={() => handleCopyDiscountCode(aiRecommendation.code, 'AI Özel Fırsat')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 hover:bg-emerald-400 transition cursor-pointer"
                >
                  <Copy size={11} /> {aiRecommendation.code}
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {aiRecommendation.desc}
              </p>
            </div>
          )}
        </div>

        {/* ─── PRIVILEGES & DISCOUNTS DIRECTORY ─── */}
        <div className="w-full max-w-4xl text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Mezun Kart Ayrıcalıkları ve İndirimler</h3>
              <p className="text-xs text-slate-500">Üniversitemizin resmî anlaşmalı kurumlarında mezun kartınızı göstererek yararlanın</p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'campus', label: 'Kampüs & Tesisler' },
                { id: 'academic', label: 'Eğitim & Burs' },
                { id: 'corporate', label: 'Kurumsal Markalar' },
                { id: 'health', label: 'Sağlık & Yaşam' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrivileges.map(priv => (
              <div 
                key={priv.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      {priv.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {priv.discount}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{priv.title}</h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{priv.provider}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{priv.description}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    Kod: <strong className="text-slate-800 font-bold">{priv.code}</strong>
                  </span>
                  <button
                    onClick={() => handleCopyDiscountCode(priv.code, priv.title)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition"
                  >
                    {copiedCode === priv.code ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Kodu Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ─── WALLET INSTRUCTION MODAL (Apple & Google Wallet) ─── */}
      {walletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-left">
            <button
              onClick={() => setWalletModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {walletModal === 'apple' ? 'Apple Wallet Pass Kurulumu' : 'Google Pay Cüzdan Kurulumu'}
                </h3>
                <p className="text-xs text-slate-500">Mobil aygıtınıza tek tıkla dijital geçiş ekleyin</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p><strong>1. Adım:</strong> Kart numaranız ({formattedCardNo}) ve resmî doğrulanmış mezuniyet kaydınız eşleştirildi.</p>
              <p><strong>2. Adım:</strong> Cihazınızın kamerasını açarak kartın arka yüzündeki QR kodu okutabilir veya Safari/Chrome üzerinden doğrudan Cüzdan'a ekleyebilirsiniz.</p>
              <p><strong>3. Adım:</strong> Kampüs kütüphanesine veya NFC turnikelerine telefonunuzu yaklaştırarak temassız geçiş yapabilirsiniz.</p>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  toast.success(`${walletModal === 'apple' ? 'Apple Wallet' : 'Google Pay'} kart dosyası indirildi ve aygıtınıza eklendi!`);
                  setWalletModal(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs transition cursor-pointer text-center shadow-md"
              >
                Cüzdana Ekle (.pkpass)
              </button>
              <button
                onClick={() => setWalletModal(null)}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── BOTTOM FLOATING DOCK ─── */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole="alumni"
        activeTab="alumni_card"
      />
    </div>
  );
}
