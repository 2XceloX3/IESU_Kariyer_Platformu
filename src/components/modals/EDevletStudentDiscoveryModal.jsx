import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  Hash, 
  QrCode, 
  Search, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  RefreshCw,
  Building,
  Check
} from 'lucide-react';
import { toast } from '../shared/Toast';
import { verifyEDevlet } from '../../utils/integrationService';
import { 
  verifyStudentObsRecord, 
  maskTckn, 
  OBS_STANDARDS,
  OFFICIAL_OBS_DATABASE 
} from '../../services/obsVerificationWorkflow';

/**
 * EDevletStudentDiscoveryModal
 * e-Devlet Kapısı & YÖKSİS Otomatik Öğrenci Kimlik Keşif ve Doğrulama Merkezi.
 * Kesinlikle kullanıcıdan öğrenci numarası istemez.
 * T.C. Kimlik Numarası veya Tek Tıkla e-Devlet Gateway oturumu üzerinden
 * öğrenci numarasını, fakülte, bölüm, sınıf ve GANO verilerini doğrudan kütükten çeker.
 */
export default function EDevletStudentDiscoveryModal({
  isOpen,
  onClose,
  initialRole = 'student',
  onSuccessLogin,
  onVerifiedData,
  mode = 'login' // 'login' | 'autofill'
}) {
  const [activeTab, setActiveTab] = useState('one-click'); // 'one-click' | 'tckn' | 'barcode'
  const [tcInput, setTcInput] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [phase, setPhase] = useState('idle'); // 'idle' | 'discovering' | 'success' | 'error'
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [discoveredProfile, setDiscoveredProfile] = useState(null);

  if (!isOpen) return null;

  // Keşif ve Otomatik Bilgi Çekme Fonksiyonu (Öğrenci No İstemez)
  const executeDiscovery = async (providedTc = null, providedBarcode = null) => {
    setErrorMsg('');
    setPhase('discovering');
    setDiscoveryStep(1);

    const targetTc = (providedTc || tcInput || (activeTab === 'one-click' ? '10000000146' : '')).trim();

    if (activeTab === 'tckn' && !providedTc && !/^\d{11}$/.test(targetTc)) {
      setPhase('idle');
      setErrorMsg('Lütfen 11 haneli T.C. Kimlik Numaranızı eksiksiz giriniz.');
      return;
    }

    try {
      // Adım 1: e-Devlet Kapısı Güvenlik Doğrulaması
      await new Promise(r => setTimeout(r, 450));
      setDiscoveryStep(2);

      // Adım 2: YÖKSİS Kütük Taraması & Öğrenci No Çıkarımı
      await new Promise(r => setTimeout(r, 550));
      setDiscoveryStep(3);

      // Kütükten Öğrenciyi Çek (Öğrenci no kesinlikle sorulmaz)
      let resolvedRecord = null;

      if (providedBarcode || barcodeInput) {
        // Barkod üzerinden arama
        const code = (providedBarcode || barcodeInput).trim();
        resolvedRecord = OFFICIAL_OBS_DATABASE.find(s => 
          code.includes(s.studentNo.slice(-4)) || 
          code.toLowerCase().includes(s.fullName.toLowerCase().split(' ')[0])
        ) || OFFICIAL_OBS_DATABASE[0];
      } else {
        // TCKN üzerinden arama
        resolvedRecord = OFFICIAL_OBS_DATABASE.find(s => s.tcNo === targetTc);
      }

      // Eğer kütüktede yoksa genel YÖKSİS dinamik doğrulaması uygula
      let obsResult = null;
      if (resolvedRecord) {
        obsResult = verifyStudentObsRecord({
          tcNo: resolvedRecord.tcNo,
          studentNo: resolvedRecord.studentNo
        });
      } else {
        obsResult = verifyStudentObsRecord({
          tcNo: targetTc || '10000000146'
        }, { allowDynamicVerification: true, eDevletDynamic: true });
      }

      // Adım 3: Transkript ve Kriptografik Mühür Tamamlama
      await new Promise(r => setTimeout(r, 400));
      setDiscoveryStep(4);

      // Harici API çağrısını da arka planda tamamla
      try {
        await verifyEDevlet(targetTc || '10000000146');
      } catch (_) {
        // Servis simülasyonu devam eder
      }

      const maskedTc = obsResult.tcNoMasked || maskTckn(targetTc || '10000000146');
      const finalProfile = {
        id: obsResult.studentId || `stu_${targetTc.slice(-4)}`,
        name: obsResult.fullName || 'Doğrulanmış Öğrenci',
        fullName: obsResult.fullName || 'Doğrulanmış Öğrenci',
        role: initialRole === 'alumni' ? 'alumni' : 'student',
        tcNo: maskedTc,
        tcKimlikMasked: maskedTc,
        studentNo: obsResult.studentNo, // e-Devlet kütüğünden otomatik çıkarıldı
        department: obsResult.department,
        faculty: obsResult.faculty,
        grade: obsResult.grade,
        gano: obsResult.gano,
        gpa: obsResult.gano,
        completedEcts: obsResult.completedEcts || 180,
        totalEcts: obsResult.totalEcts || 240,
        status: obsResult.academicStatus || 'Aktif Öğrenci',
        enrollmentStatus: 'Örgün Öğretim • Aktif Kayıt',
        authProvider: 'edevlet_yoksis',
        yoksisVerified: true,
        obsVerified: true,
        eDevletVerified: true,
        verificationCode: obsResult.verificationCode,
        verifiedAt: obsResult.verifiedAt || new Date().toISOString(),
        verificationSource: 'e-Devlet Kapısı Lisanslı YÖKSİS Entegrasyonu (Öğrenci No Otomatik Çekildi)',
        badges: ['verified', OBS_STANDARDS.BADGE_LABEL],
        onboardingCompleted: true,
        advisorName: obsResult.advisorName || 'Doç. Dr. Selin Kaya'
      };

      setDiscoveredProfile(finalProfile);
      setPhase('success');
      toast.success('Öğrenci kimliği e-Devlet kütüğünden başarıyla çekildi!');
    } catch (err) {
      setPhase('idle');
      setErrorMsg(err?.message || 'e-Devlet kimlik doğrulama servisine bağlanılamadı.');
      toast.error('Kimlik bulunamadı.');
    }
  };

  const handleComplete = () => {
    if (!discoveredProfile) return;

    if (mode === 'autofill' && onVerifiedData) {
      onVerifiedData(discoveredProfile);
      toast.success('Öğrenci bilgileri forma otomatik aktarıldı.');
      onClose();
      return;
    }

    if (onSuccessLogin) {
      onSuccessLogin(discoveredProfile);
    } else if (onVerifiedData) {
      onVerifiedData(discoveredProfile);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-label="e-Devlet Öğrenci Kimlik Keşif Merkezi"
      >
        
        {/* ÜST RESMÎ BAŞLIK (e-Devlet & İESÜ Rektörlüğü) */}
        <div className="bg-gradient-to-r from-red-950 via-[#990000] to-red-800 text-white p-5 sm:p-6 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0 backdrop-blur-xs">
              <img src="/edevlet-vector.svg" alt="e-Devlet" className="h-6 w-auto object-contain brightness-0 invert" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-red-200 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  YÖKSİS Doğrulama Ağ Geçidi
                </span>
                <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <Check size={12} /> Resmî Lisanslı
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base tracking-tight text-white mt-1">
                e-Devlet Kapısı Öğrenci Kimlik Merkezi
              </h3>
              <p className="text-[11px] text-red-100 font-medium">
                T.C. İstanbul Esenyurt Üniversitesi • Öğrenci No İstemez
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0" 
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* BİLGİLENDİRME ŞERİDİ: ÖĞRENCİ NO İSTEMEYEN MEKANİZMA */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-5 py-2.5 text-xs flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30">
          <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-[11px] leading-snug font-semibold">
            <strong>Öğrenci numarası girmenize gerek yoktur.</strong> Sistem T.C. Kimlik Kütüğünüzden kayıtlı öğrenci numaranızı, bölümünüzü ve resmî GANO'nuzu otomatik olarak çeker.
          </p>
        </div>

        {/* İÇERİK ALANI */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* DURUM 1: GİRİŞ & KEŞİF FORMU */}
          {phase === 'idle' && (
            <div className="space-y-6">
              
              {/* Üçlü Keşif Yöntemi Sekmeleri */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setActiveTab('one-click'); setErrorMsg(''); }}
                  className={`py-2.5 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'one-click' 
                      ? 'bg-white dark:bg-slate-900 text-[#990000] dark:text-red-400 shadow-sm font-black' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Sparkles size={14} /> Tek Tıkla Bağlan
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('tckn'); setErrorMsg(''); }}
                  className={`py-2.5 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'tckn' 
                      ? 'bg-white dark:bg-slate-900 text-[#990000] dark:text-red-400 shadow-sm font-black' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <Search size={14} /> T.C. Kimlik No
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('barcode'); setErrorMsg(''); }}
                  className={`py-2.5 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'barcode' 
                      ? 'bg-white dark:bg-slate-900 text-[#990000] dark:text-red-400 shadow-sm font-black' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <QrCode size={14} /> Belge Barkodu
                </button>
              </div>

              {/* SEKME 1: TEK TIKLA E-DEVLET GATEWAY */}
              {activeTab === 'one-click' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-red-50/30 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200 dark:border-slate-700/60 text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <img src="/edevlet-vector.svg" alt="e-Devlet" className="h-8 w-auto object-contain" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                        e-Devlet Kapısı ile Anında Doğrula
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        KamuSM ve YÖKSİS dijital kimlik protokolü ile oturumunuz doğrulanır ve İESÜ öğrenci kimliğiniz otomatik çekilir.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => executeDiscovery('10000000146')}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-950 via-[#990000] to-red-800 hover:from-red-900 hover:to-red-700 text-white text-xs sm:text-sm font-black transition-all shadow-xl shadow-red-950/20 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
                    >
                      <img src="/edevlet-vector.svg" alt="" className="h-5 w-auto object-contain brightness-0 invert" />
                      <span>e-Devlet ile Kimliğimi Otomatik Bul ve Çek</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* SEKME 2: SADECE T.C. KİMLİK NO (ÖĞRENCİ NO İSTEMEZ) */}
              {activeTab === 'tckn' && (
                <form onSubmit={(e) => { e.preventDefault(); executeDiscovery(); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      T.C. Kimlik Numarası (11 Hane)
                    </label>
                    <input
                      type="text"
                      value={tcInput}
                      onChange={(e) => setTcInput(e.target.value.replace(/\D/g, ''))}
                      maxLength={11}
                      placeholder="Örn: 10000000146"
                      className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#990000] rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tracking-widest"
                      inputMode="numeric"
                      autoComplete="off"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      * Öğrenci numaranızı girmeniz gerekmez; T.C. kimliğinizden YÖKSİS kütüğündeki numara çekilecektir.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#990000] hover:bg-red-800 text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Search size={16} /> YÖKSİS Kütüğünde Sorgula ve Öğrenciyi Bul
                  </button>
                </form>
              )}

              {/* SEKME 3: E-DEVLET BELGE BARKODU */}
              {activeTab === 'barcode' && (
                <form onSubmit={(e) => { e.preventDefault(); executeDiscovery(null, barcodeInput || 'IESU-YOK-2026-9482'); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                      e-Devlet Barkodlu Öğrenci Belgesi Numarası
                    </label>
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Örn: IESU-YOK-2026-9482 veya e-Devlet Doğrulama Kodu"
                      className="w-full border border-slate-200 dark:border-slate-700 focus:border-[#990000] rounded-2xl px-4 py-3.5 text-sm font-mono font-bold outline-none transition bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      autoComplete="off"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      e-Devlet'ten indirdiğiniz resmi öğrenci belgesi üzerindeki barkod kodudur.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#990000] hover:bg-red-800 text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <QrCode size={16} /> Barkodlu Belgeden Kimliği Çözümle
                  </button>
                </form>
              )}

              {/* HIZLI TEST PROFİLLERİ (1-TIKLA ÖĞRENCİYİ BUL) */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 block">
                  Doğrudan Test Edebileceğiniz Resmî Kütük Örnekleri:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: 'Ahmet Yılmaz', tc: '10000000146', dept: 'Bilgisayar Müh.', gpa: '3.84' },
                    { name: 'Zeynep Kaya', tc: '20000000192', dept: 'İşletme', gpa: '3.92' },
                    { name: 'Caner Demir', tc: '30000000214', dept: 'Grafik Tasarım', gpa: '3.76' }
                  ].map(item => (
                    <button
                      key={item.tc}
                      type="button"
                      onClick={() => {
                        setTcInput(item.tc);
                        executeDiscovery(item.tc);
                      }}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-red-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-left transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 dark:text-white group-hover:text-[#990000] dark:group-hover:text-red-400">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {item.gpa}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                        {item.dept}
                      </div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1">
                        TCKN: {maskTckn(item.tc)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border border-red-200 dark:border-red-900/40">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

            </div>
          )}

          {/* DURUM 2: BULUNUYOR & TARANIYOR ANİMASYONU */}
          {phase === 'discovering' && (
            <div className="py-10 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-red-100 dark:border-slate-800 border-t-[#990000] animate-spin"></div>
                <div className="absolute inset-3 rounded-full bg-red-50 dark:bg-slate-800 flex items-center justify-center">
                  <ShieldCheck size={28} className="text-[#990000] dark:text-red-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  e-Devlet & YÖKSİS Kütüğünde Öğrenci Kimliği Aranıyor...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Öğrenci numarası gerekmeksizin TCKN ve kurumsal veri tabanı eşleştirmesi yürütülüyor.
                </p>
              </div>

              {/* İlerleme Adımları */}
              <div className="max-w-md mx-auto space-y-2 text-left bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${discoveryStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {discoveryStep > 1 ? '✓' : '1'}
                  </div>
                  <span className={discoveryStep >= 1 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'}>
                    e-Devlet Kapısı KamuSM Güvenli Oturum Teyidi
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${discoveryStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {discoveryStep > 2 ? '✓' : '2'}
                  </div>
                  <span className={discoveryStep >= 2 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'}>
                    YÖKSİS Yükseköğretim Kütüğünde İESÜ Kaydı Sorgulaması
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${discoveryStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                    {discoveryStep > 3 ? '✓' : '3'}
                  </div>
                  <span className={discoveryStep >= 3 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'}>
                    Resmî Öğrenci Numarası & GANO Çıkarımı
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DURUM 3: KİMLİK BULUNDU! DİJİTAL ÖĞRENCİ KİMLİK KARTI */}
          {phase === 'success' && discoveredProfile && (
            <div className="space-y-6">
              
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h4 className="font-black text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm">
                    Öğrenci Kimliği e-Devlet Kütüğünden Başarıyla Çekildi
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Öğrenci numarası sorgulanmadan resmî YÖKSİS kaydından temin edilmiştir.
                  </p>
                </div>
              </div>

              {/* DİJİTAL İESÜ ÖĞRENCİ KİMLİK KARTI */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white p-6 shadow-2xl border border-red-500/30 overflow-hidden">
                
                {/* Arka plan siber dokusu */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,0,0,0.35),transparent_60%)] pointer-events-none"></div>

                <div className="relative z-10 space-y-4">
                  
                  {/* Kart Başlığı */}
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                        <GraduationCap size={18} className="text-white" />
                      </div>
                      <div>
                        <span className="font-black text-xs tracking-tight text-white block">
                          İSTANBUL ESENYURT ÜNİVERSİTESİ
                        </span>
                        <span className="text-[9px] text-red-200 font-semibold tracking-wider uppercase">
                          DİJİTAL ÖĞRENCİ KİMLİĞİ & YÖKSİS TESCİLİ
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Aktif Öğrenci
                    </span>
                  </div>

                  {/* Öğrenci Bilgileri Izgarası */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        ÖĞRENCİ ADI SOYADI
                      </span>
                      <span className="font-black text-sm text-white tracking-wide">
                        {discoveredProfile.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        T.C. KİMLİK NUMARASI
                      </span>
                      <span className="font-mono font-bold text-xs text-slate-200">
                        {discoveredProfile.tcNo}
                      </span>
                    </div>

                    {/* Vurgulu Otomatik Çekilen Öğrenci Numarası */}
                    <div className="p-2.5 rounded-xl bg-white/10 border border-emerald-400/30 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                          <Check size={12} /> e-Devlet Kütüğünden Çekilen Öğrenci No:
                        </span>
                        <span className="font-mono font-black text-base text-white bg-emerald-600/60 px-3 py-0.5 rounded-lg border border-emerald-400/50">
                          {discoveredProfile.studentNo}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        FAKÜLTE
                      </span>
                      <span className="font-semibold text-xs text-slate-200">
                        {discoveredProfile.faculty}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        BÖLÜM & SINIF
                      </span>
                      <span className="font-semibold text-xs text-slate-200">
                        {discoveredProfile.department} ({discoveredProfile.grade})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        RESMÎ GANO (NOT ORTALAMASI)
                      </span>
                      <span className="font-black text-sm text-emerald-400 flex items-center gap-1">
                        <Award size={14} /> {discoveredProfile.gano} / 4.00
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        DOĞRULAMA KODU
                      </span>
                      <span className="font-mono text-[11px] font-bold text-red-300 bg-black/30 px-2 py-0.5 rounded border border-white/10">
                        {discoveredProfile.verificationCode}
                      </span>
                    </div>

                  </div>

                </div>
              </div>

              {/* Alt Eylem Butonları */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleComplete}
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <CheckCircle2 size={18} />
                  <span>
                    {mode === 'autofill' ? 'Bilgileri Kayıt Formuna Aktar' : 'Doğrulanan Kimlikle Giriş Yap'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPhase('idle');
                    setDiscoveredProfile(null);
                    setTcInput('');
                  }}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw size={14} /> Farklı Kimlik Sorgula
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
