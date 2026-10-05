import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { toast } from '../shared/Toast';
import { verifyEDevlet } from '../../utils/integrationService';

/**
 * e-Devlet / YÖKSİS doğrulama modalı.
 * Üretimde Login/Register bu modülü yüklemez (import.meta.env.DEV guard).
 * yoksisVerified yalnızca gerçek API yanıtında true olabilir.
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
  const [tcNo, setTcNo] = useState('');
  const [phase, setPhase] = useState('form'); // form | verifying | success | error
  const [error, setError] = useState('');
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  if (!isOpen) return null;

  // Extra safety: never run fake verification outside DEV
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const cleanTc = tcNo.trim();
    if (!/^\d{11}$/.test(cleanTc)) {
      setError('T.C. Kimlik Numarası 11 haneli olmalıdır.');
      return;
    }

    setPhase('verifying');
    try {
      const verified = await verifyEDevlet(cleanTc);
      // verifyEDevlet returns true only on real API verified===true (mock unreachable in prod; DEV mock returns falsey path)
      if (verified !== true) {
        setPhase('form');
        setError('Doğrulama başarısız. Gerçek YÖKSİS/e-Devlet yanıtı alınamadı.');
        toast.error('YÖKSİS doğrulaması tamamlanamadı.');
        return;
      }

      const profilePayload = {
        id: `edevlet_${cleanTc.slice(-4)}`,
        name: 'Doğrulanmış Kullanıcı',
        role,
        tcKimlikMasked: `${cleanTc.slice(0, 3)}*****${cleanTc.slice(-2)}`,
        authProvider: 'e-devlet-sso',
        yoksisVerified: true,
        verificationSource: 'api',
        eDevletVerified: true,
        obsVerified: false,
        onboardingCompleted: false,
      };
      setVerifiedProfile(profilePayload);
      setPhase('success');
    } catch (err) {
      setPhase('form');
      setError(err?.message || 'Doğrulama servisine ulaşılamadı.');
      toast.error('Doğrulama servisine ulaşılamadı.');
    }
  };

  const handleFinalize = () => {
    if (!verifiedProfile || verifiedProfile.yoksisVerified !== true || verifiedProfile.verificationSource !== 'api') {
      toast.error('Geçerli bir API doğrulaması yok.');
      return;
    }
    if (mode === 'autofill' && onVerifiedData) {
      onVerifiedData(verifiedProfile);
      onClose();
      return;
    }
    if (onSuccessLogin) onSuccessLogin(verifiedProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-[#990000] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <h3 className="font-black text-sm">e-Devlet Doğrulama</h3>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer" aria-label="Kapat">
            <X size={16} />
          </button>
        </div>

        {phase === 'form' && (
          <form onSubmit={handleVerify} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 font-medium">
              Bu akış yalnızca geliştirme ortamında görünür. yoksisVerified yalnızca gerçek API yanıtında true olur.
            </p>
            <label className="block text-xs font-bold text-slate-700">
              T.C. Kimlik No
              <input
                value={tcNo}
                onChange={(e) => setTcNo(e.target.value)}
                className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                inputMode="numeric"
                autoComplete="off"
              />
            </label>
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 p-3 rounded-xl">
                <AlertCircle size={14} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
            <button type="submit" className="w-full py-3 rounded-xl bg-[#990000] text-white text-xs font-black cursor-pointer">
              Doğrula
            </button>
          </form>
        )}

        {phase === 'verifying' && (
          <div className="p-10 text-center text-sm font-bold text-slate-600 flex flex-col items-center gap-3">
            <Lock className="animate-pulse" /> API doğrulaması bekleniyor…
          </div>
        )}

        {phase === 'success' && verifiedProfile && (
          <div className="p-6 space-y-4">
            <p className="text-sm font-bold text-emerald-700">API doğrulaması başarılı.</p>
            <button type="button" onClick={handleFinalize} className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer">
              Devam Et
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
