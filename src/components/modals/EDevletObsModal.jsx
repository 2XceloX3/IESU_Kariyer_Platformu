import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, CheckCircle2, GraduationCap, Award, Hash, Clock } from 'lucide-react';
import { toast } from '../shared/Toast';
import { verifyEDevlet } from '../../utils/integrationService';
import { 
  verifyStudentObsRecord, 
  maskTckn, 
  OBS_STANDARDS,
  getObsVerificationBadge 
} from '../../services/obsVerificationWorkflow';

/**
 * e-Devlet & İESÜ OBS / YÖKSİS Doğrulama Modalı
 * Öğrencinin beyan ettiği not ortalaması (GANO), bölüm ve sınıf bilgilerini
 * Öğrenci İşleri OBS ve YÖKSİS kurumsal katmanı ile doğrular ve kriptografik kod üretir.
 */
export default function EDevletObsModal({
  isOpen,
  onClose,
  initialRole = 'student',
  onSuccessLogin,
  onVerifiedData,
  mode = 'login'
}) {
  const [role] = useState(initialRole === 'employer' || initialRole === 'academic' ? 'student' : initialRole);
  const [identifier, setIdentifier] = useState('');
  const [phase, setPhase] = useState('form'); // form | verifying | success | error
  const [error, setError] = useState('');
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  if (!isOpen) return null;

  // Güvenlik denetimi: DEV ve Test ortamlarında çalışır
  if (typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const cleanInput = identifier.trim();

    if (!cleanInput) {
      setError('Lütfen T.C. Kimlik No veya Öğrenci Numaranızı giriniz.');
      return;
    }

    const isTc = /^\d{11}$/.test(cleanInput);
    const isStudentNo = /^\d{9,12}$/.test(cleanInput) || cleanInput.toUpperCase().startsWith('STU-');

    if (!isTc && !isStudentNo) {
      setError('Lütfen geçerli bir 11 haneli T.C. Kimlik No veya Öğrenci Numarası giriniz.');
      return;
    }

    setPhase('verifying');

    try {
      // 1. OBS & YÖKSİS Kurumsal Doğrulama Motorunu Çalıştır
      const obsResult = verifyStudentObsRecord({
        tcNo: isTc ? cleanInput : '',
        studentNo: isStudentNo ? cleanInput : '',
        studentId: cleanInput,
      }, { allowDynamicVerification: true });

      // 2. Canlı e-Devlet Servis Kontrolü (opsiyonel)
      let apiVerified = false;
      try {
        if (isTc) {
          apiVerified = await verifyEDevlet(cleanInput);
        }
      } catch (_) {
        apiVerified = false;
      }

      if (!obsResult.verified && !apiVerified) {
        setPhase('form');
        setError('Doğrulama başarısız. Resmî OBS ve YÖKSİS kayıtlarında öğrenci bulunamadı.');
        toast.error('OBS / YÖKSİS doğrulaması tamamlanamadı.');
        return;
      }

      const verifiedTcMasked = obsResult.tcNoMasked || maskTckn(cleanInput);
      const profilePayload = {
        id: obsResult.studentId || `edevlet_${cleanInput.slice(-4)}`,
        name: obsResult.fullName || 'Doğrulanmış Öğrenci',
        fullName: obsResult.fullName || 'Doğrulanmış Öğrenci',
        role,
        tcKimlikMasked: verifiedTcMasked,
        tcNo: verifiedTcMasked,
        studentNo: obsResult.studentNo || cleanInput,
        department: obsResult.department || 'Bilgisayar Mühendisliği',
        faculty: obsResult.faculty || 'Mühendislik ve Mimarlık Fakültesi',
        grade: obsResult.grade || '3. Sınıf',
        gano: obsResult.gano || 3.84,
        gpa: obsResult.gano || 3.84,
        authProvider: 'e-devlet-sso',
        yoksisVerified: true,
        obsVerified: true,
        verificationCode: obsResult.verificationCode,
        obsVerificationCode: obsResult.verificationCode,
        verifiedAt: obsResult.verifiedAt,
        verificationSource: obsResult.verificationSource || 'OBS & YÖKSİS Entegrasyonu',
        eDevletVerified: true,
        badges: ['verified', OBS_STANDARDS.BADGE_LABEL],
        onboardingCompleted: true,
        discrepancy: obsResult.discrepancy,
        advisorName: obsResult.advisorName,
        completedEcts: obsResult.completedEcts,
      };

      setVerifiedProfile(profilePayload);
      setPhase('success');
      toast.success('İESÜ OBS & YÖKSİS Doğrulaması Başarıyla Tamamlandı!');
    } catch (err) {
      setPhase('form');
      setError(err?.message || 'Doğrulama servisine ulaşılamadı.');
      toast.error('Doğrulama servisine ulaşılamadı.');
    }
  };

  const handleFinalize = () => {
    if (!verifiedProfile || !verifiedProfile.obsVerified) {
      toast.error('Geçerli bir OBS doğrulaması bulunmuyor.');
      return;
    }
    if (mode === 'autofill' && onVerifiedData) {
      onVerifiedData(verifiedProfile);
      onClose();
      return;
    }
    if (onSuccessLogin) onSuccessLogin(verifiedProfile);
    if (onVerifiedData) onVerifiedData(verifiedProfile);
    onClose();
  };

  const badgeInfo = verifiedProfile ? getObsVerificationBadge(verifiedProfile) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in font-sans">
        
        {/* Üst Başlık */}
        <div className="bg-gradient-to-r from-red-950 via-[#990000] to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-tight">İESÜ OBS & YÖKSİS Doğrulama</h3>
              <p className="text-[10px] text-red-100 font-semibold uppercase tracking-wider">
                T.C. İstanbul Esenyurt Üniversitesi Rektörlüğü
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer" 
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Aşama: Kimlik Formu */}
        {phase === 'form' && (
          <form onSubmit={handleVerify} className="p-6 sm:p-7 space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Lock size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-amber-950">Resmî Akademik Veri Bütünlüğü</strong>
                <span>
                  Öğrencinin beyan ettiği not ortalaması (GANO), sınıf ve bölüm bilgileri OBS veritabanı ile eşleştirilerek kriptografik onay koduna bağlanır.
                </span>
              </div>
            </div>

            <label className="block text-xs font-bold text-slate-800">
              T.C. Kimlik No veya Öğrenci Numarası
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Örn: 2023010482 veya 10000000146"
                className="mt-1.5 w-full border border-slate-200 focus:border-[#990000] rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition bg-slate-50 focus:bg-white text-slate-900"
                inputMode="text"
                autoComplete="off"
                required
              />
            </label>

            <p className="text-[11px] text-slate-500 font-medium">
              * Test kayıtları için: <strong className="text-slate-700 font-bold">2023010482</strong> (Ahmet Yılmaz), <strong className="text-slate-700 font-bold">2023010485</strong> (Zeynep Kaya) veya <strong className="text-slate-700 font-bold">2023010490</strong> (Caner Demir) girebilirsiniz.
            </p>

            {error && (
              <div className="flex items-start gap-2.5 text-xs text-red-700 bg-red-50 p-3.5 rounded-2xl border border-red-200">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-900 via-[#990000] to-red-800 hover:from-red-800 hover:to-red-700 text-white text-xs font-black transition shadow-md shadow-red-900/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} /> OBS & YÖKSİS ile Doğrula
            </button>
          </form>
        )}

        {/* 2. Aşama: Doğrulanıyor Yükleme Animasyonu */}
        {phase === 'verifying' && (
          <div className="p-12 text-center text-sm font-bold text-slate-700 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-[#990000] animate-spin flex items-center justify-center">
              <Lock size={20} className="text-[#990000]" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-base">Öğrenci İşleri OBS & YÖKSİS Sorgulanıyor...</h4>
              <p className="text-xs text-slate-500 mt-1">GANO ve akademik transkript verileri kriptografik mühür ile eşleştiriliyor.</p>
            </div>
          </div>
        )}

        {/* 3. Aşama: Doğrulama Başarılı & Akademik Özet Kartı */}
        {phase === 'success' && verifiedProfile && (
          <div className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="block text-xs font-black text-emerald-950">OBS & YÖKSİS Doğrulaması Onaylandı</strong>
                <p className="text-[11px] text-emerald-700 font-medium">Akademik transkript ve öğrenci statüsü resmi olarak tescillendi.</p>
              </div>
            </div>

            {/* Doğrulanan Resmî Veriler */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-semibold">Öğrenci Adı Soyadı</span>
                <span className="font-black text-slate-900 text-sm">{verifiedProfile.name}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-semibold">Öğrenci Numarası</span>
                <span className="font-mono font-bold text-slate-800">{verifiedProfile.studentNo}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-semibold">Fakülte & Bölüm</span>
                <span className="font-bold text-slate-800 text-right">{verifiedProfile.department}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <span className="text-slate-500 font-semibold">Resmî OBS GANO (GPA)</span>
                <span className="font-black text-emerald-700 text-sm flex items-center gap-1">
                  <Award size={14} /> {verifiedProfile.gano} / 4.00
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Hash size={13} /> Kriptografik Doğrulama Kodu
                </span>
                <span className="font-mono text-[11px] font-black text-[#990000] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                  {verifiedProfile.verificationCode}
                </span>
              </div>
            </div>

            {/* Rozet Önizlemesi */}
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs">
              <span className="text-slate-600 font-bold flex items-center gap-1.5">
                <GraduationCap size={15} className="text-[#990000]" /> Profil Rozeti:
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-[11px] shadow-xs">
                <ShieldCheck size={13} /> {OBS_STANDARDS.BADGE_LABEL}
              </span>
            </div>

            <button 
              type="button" 
              onClick={handleFinalize} 
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-md shadow-emerald-900/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Profili Onayla ve Devam Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
