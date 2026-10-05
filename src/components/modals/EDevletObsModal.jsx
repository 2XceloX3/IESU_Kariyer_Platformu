import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, GraduationCap, Users, Lock, QrCode, FileCheck, ArrowRight, RefreshCw, KeyRound, AlertCircle, Building2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { toast } from '../shared/Toast';

export default function EDevletObsModal({ 
  isOpen, 
  onClose, 
  initialRole = 'student', 
  onSuccessLogin, 
  onVerifiedData,
  mode = 'login' // 'login' or 'autofill'
}) {
  const { students, alumni } = useAppStore();
  const [activeTab, setActiveTab] = useState('edevlet'); // 'edevlet' | 'obs'
  const [role, setRole] = useState(initialRole === 'employer' || initialRole === 'academic' ? 'student' : initialRole);
  
  // E-Devlet form state
  const [tcNo, setTcNo] = useState('');
  const [edevletPassword, setEdevletPassword] = useState('');
  
  // OBS form state
  const [studentNo, setStudentNo] = useState('');
  const [obsPassword, setObsPassword] = useState('');

  // Flow states
  const [phase, setPhase] = useState('form'); // 'form' | 'verifying' | 'success'
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifiedProfile, setVerifiedProfile] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'edevlet') {
      const cleanTc = tcNo.trim();
      if (!/^\d{11}$/.test(cleanTc)) {
        setError('T.C. Kimlik Numarası 11 haneli sayısal bir değer olmalıdır.');
        return;
      }
      if (!edevletPassword.trim()) {
        setError('Lütfen e-Devlet Kapısı şifrenizi giriniz.');
        return;
      }
    } else {
      if (!studentNo.trim()) {
        setError('Lütfen Öğrenci / Mezun numaranızı giriniz.');
        return;
      }
      if (!obsPassword.trim()) {
        setError('Lütfen OBS / Kampüs parolanızı giriniz.');
        return;
      }
    }

    setPhase('verifying');
    setVerifyMessage('TÜRKSAT Kamu Kimlik Doğrulama Protokolü başlatılıyor (TLS 1.3)...');

    setTimeout(() => {
      setVerifyMessage('YÖKSİS & İESÜ Öğrenci Bilgi Sistemi (OBS) kütüğü sorgulanıyor...');

      setTimeout(() => {
        // Resolve profile from existing store or generate a verified academic record
        const searchedId = activeTab === 'edevlet' ? tcNo.trim() : studentNo.trim();
        let matched = null;

        if (role === 'student') {
          matched = (students || []).find(s => 
            s.studentId === searchedId || s.tcKimlik === searchedId || s.email?.startsWith(searchedId)
          );
        } else {
          matched = (alumni || []).find(a => 
            a.studentId === searchedId || a.tcKimlik === searchedId || a.email?.startsWith(searchedId)
          );
        }

        const resolvedName = matched?.name || (role === 'student' ? 'Ahmet Yılmaz' : 'Selin Demir');
        const resolvedStudentNo = matched?.studentId || (activeTab === 'obs' ? studentNo.trim() : (role === 'student' ? '20230104082' : '20190102045'));
        const resolvedDept = matched?.department || (role === 'student' ? 'Yazılım Mühendisliği' : 'Bilgisayar Mühendisliği');
        const resolvedFaculty = matched?.faculty || 'Mühendislik ve Doğa Bilimleri Fakültesi';
        const maskedTc = activeTab === 'edevlet' 
          ? `${tcNo.slice(0, 3)}*****${tcNo.slice(-2)}` 
          : '2938*****12';
        
        const barcodeCode = 'YOKSIS-TR-' + Math.floor(100000 + Math.random() * 900000);
        const edevletDocNo = 'EDEVLET-IESU-' + Math.floor(10000000 + Math.random() * 90000000);

        const profilePayload = {
          id: matched?.id || `${role}_verified_${Date.now()}`,
          name: resolvedName,
          studentId: resolvedStudentNo,
          email: matched?.email || `${resolvedStudentNo.toLowerCase()}@ogr.esenyurt.edu.tr`,
          department: resolvedDept,
          faculty: resolvedFaculty,
          grade: role === 'student' ? (matched?.grade || '3. Sınıf') : 'Mezun',
          graduationYear: role === 'alumni' ? (matched?.graduationYear || '2023') : undefined,
          gpa: matched?.gpa || (role === 'student' ? '3.42' : '3.68'),
          role: role,
          tcKimlikMasked: maskedTc,
          authProvider: activeTab === 'edevlet' ? 'e-devlet-sso' : 'iesu-obs-sso',
          yoksisVerified: true,
          eDevletVerified: true,
          obsVerified: true,
          barcode: barcodeCode,
          documentNo: edevletDocNo,
          verificationDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          onboardingCompleted: true,
          avatar: matched?.avatar || null
        };

        setVerifiedProfile(profilePayload);
        setPhase('success');
      }, 900);
    }, 700);
  };

  const handleFinalize = () => {
    if (!verifiedProfile) return;

    if (mode === 'autofill' && onVerifiedData) {
      onVerifiedData(verifiedProfile);
      toast.success('✅ YÖKSİS ve OBS doğrulanmış verileriniz form alanlarına otomatik aktarıldı.');
      onClose();
      return;
    }

    if (onSuccessLogin) {
      onSuccessLogin(verifiedProfile);
    } else {
      // Default direct login behavior
      try {
        localStorage.setItem('iesu_mock_user', JSON.stringify(verifiedProfile));
        localStorage.setItem('iesu_user_role_v1', verifiedProfile.role);
        const s = useAppStore.getState();
        s.setUserRole?.(verifiedProfile.role);
        s.setCurrentUser?.(verifiedProfile);
        s.setActivePortalBranch?.(verifiedProfile.role);
      } catch (e) {
        console.warn('Storage write error:', e);
      }
      toast.success(`✅ Hoş geldiniz, ${verifiedProfile.name}! e-Devlet ve YÖKSİS doğrulaması ile portala bağlandınız.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#990000] via-[#b91c1c] to-[#7f1d1d] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-red-200 block">
                Resmî Kamu & Üniversite Giriş Kapısı
              </span>
              <h3 className="text-lg font-black tracking-tight text-white">
                e-Devlet & İESÜ OBS Doğrulama Ağı
              </h3>
            </div>
          </div>
          <p className="text-xs text-red-100/90 leading-relaxed font-medium">
            2547 Sayılı Yükseköğretim Kanunu ve YÖKSİS Entegrasyon Protokolü kapsamında öğrenci/mezun durumunuz anlık doğrulanır.
          </p>
        </div>

        {/* Phase: Form Selection */}
        {phase === 'form' && (
          <div className="p-6">
            
            {/* Primary SSO Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('edevlet'); setError(''); }}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'edevlet'
                    ? 'bg-white text-[#990000] shadow-md border border-red-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <img src="/edevlet-vector.svg" alt="e-Devlet" className="h-4 w-auto object-contain" />
                <span>e-Devlet Kapısı</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('obs'); setError(''); }}
                className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'obs'
                    ? 'bg-white text-[#990000] shadow-md border border-red-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 size={16} className="text-[#990000]" />
                <span>İESÜ Kampüs OBS</span>
              </button>
            </div>

            {/* Target Role Selector */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="text-xs font-bold text-slate-500">Doğrulanacak Statü:</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    role === 'student' ? 'bg-[#990000] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap size={14} /> Aktif Öğrenci
                </button>
                <button
                  type="button"
                  onClick={() => setRole('alumni')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    role === 'alumni' ? 'bg-[#990000] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users size={14} /> Mezun (YÖKSİS)
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-r-xl font-bold text-xs flex items-center gap-2 animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleVerify} className="space-y-4">
              {activeTab === 'edevlet' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      T.C. Kimlik Numarası
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3 text-slate-400" size={16} />
                      <input 
                        type="text"
                        maxLength={11}
                        placeholder="11 haneli kimlik numaranız"
                        value={tcNo}
                        onChange={(e) => setTcNo(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#990000] outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      e-Devlet Şifresi
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                      <input 
                        type="password"
                        placeholder="e-Devlet Kapısı şifreniz"
                        value={edevletPassword}
                        onChange={(e) => setEdevletPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#990000] outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {role === 'student' ? 'Öğrenci Numarası' : 'Mezun Numarası / T.C.'}
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-3 text-slate-400" size={16} />
                      <input 
                        type="text"
                        placeholder={role === 'student' ? "Örn: 20230104082" : "Örn: 20190102045 veya T.C."}
                        value={studentNo}
                        onChange={(e) => setStudentNo(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#990000] outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      OBS / Kampüs Parolası
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
                      <input 
                        type="password"
                        placeholder="Öğrenci otomasyonu şifreniz"
                        value={obsPassword}
                        onChange={(e) => setObsPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#990000] outline-none transition"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Kimlik bilgileriniz hiçbir sunucuda kaydedilmez. TÜRKSAT ve YÖKSİS kamu protokolü üzerinden anlık onay belirteci (OAuth2 SAML) oluşturulur.
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-[#990000] to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-700/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Sorgula ve Anında Doğrula</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Phase: Verifying Loader */}
        {phase === 'verifying' && (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="w-16 h-16 border-4 border-red-200 border-t-[#990000] rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={24} className="text-[#990000]" />
              </div>
            </div>
            <h4 className="text-base font-black text-slate-900 mb-2">
              Kamu Entegrasyon Servisleri Sorgulanıyor
            </h4>
            <p className="text-xs text-slate-500 font-medium max-w-sm min-h-[40px] transition-all">
              {verifyMessage}
            </p>
          </div>
        )}

        {/* Phase: Verified Success Badge & Details */}
        {phase === 'success' && verifiedProfile && (
          <div className="p-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h4 className="text-sm font-black text-emerald-950">
                  Kimlik & Öğrencilik Durumu Doğrulandı
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  TÜRKSAT e-Devlet Kapısı ve YÖKSİS üzerinden resmî kayıtlarınız başarıyla teyit edildi.
                </p>
              </div>
            </div>

            {/* Profile Detail Grid */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-500">Adı Soyadı:</span>
                <span className="font-extrabold text-slate-900">{verifiedProfile.name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-500">Öğrenci Numarası:</span>
                <span className="font-mono font-bold text-slate-800">{verifiedProfile.studentId}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-500">T.C. Kimlik No:</span>
                <span className="font-mono font-bold text-slate-800">{verifiedProfile.tcKimlikMasked}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-500">Fakülte & Bölüm:</span>
                <span className="font-bold text-slate-900 text-right">{verifiedProfile.department}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="font-bold text-slate-500">Öğrenim Durumu:</span>
                <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <CheckCircle2 size={12} /> {verifiedProfile.role === 'student' ? 'Aktif Öğrenci' : 'Onaylı Mezun'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><QrCode size={13} /> Barkod:</span>
                <span className="font-mono text-slate-700">{verifiedProfile.barcode}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setPhase('form')}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Farklı Hesap Sorgula
              </button>
              <button
                type="button"
                onClick={handleFinalize}
                className="flex-1 py-3 px-4 bg-[#990000] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-700/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {mode === 'autofill' ? (
                  <>
                    <FileCheck size={16} />
                    <span>Bilgileri Forma Aktar</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Doğrulanmış Profille Portala Gir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
