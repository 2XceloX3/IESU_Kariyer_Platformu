import React, { useState } from 'react';
import { BookOpen, User, Briefcase, ChevronRight, CheckCircle2, GraduationCap, X } from 'lucide-react';
import Logo from './Logo';
import { auth, db } from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';

/**
 * Student onboarding wizard. Writes onboardingCompleted on the users/{uid} doc,
 * local storage (iesu_mock_user, iesu_user), and Zustand store.
 * Supports both standalone page and modal overlay modes.
 */
export default function StudentOnboarding({ onComplete, currentUser, setView, isModal = false, onClose }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    department: currentUser?.department || '',
    customDepartment: '',
    classYear: currentUser?.classYear || currentUser?.year || '',
    studentNo: currentUser?.studentNo || currentUser?.studentId || '',
    careerGoal: currentUser?.careerGoal || '',
  });

  const DEPARTMENT_OPTIONS = [
    'Bilgisayar Mühendisliği',
    'Yazılım Mühendisliği',
    'Elektrik-Elektronik Mühendisliği',
    'Endüstri Mühendisliği',
    'Yönetim Bilişim Sistemleri',
    'İşletme',
    'Uluslararası Ticaret ve Lojistik',
    'Psikoloji',
    'Sosyoloji',
    'Siyaset Bilimi ve Uluslararası İlişkiler',
    'Çocuk Gelişimi',
    'Fizyoterapi ve Rehabilitasyon',
    'Hemşirelik',
    'Beslenme ve Diyetetik',
    'Mimarlık',
    'İç Mimarlık ve Çevre Tasarımı',
    'Adalet',
    'Diğer',
  ];

  const persistComplete = async (payload) => {
    const uid = auth?.currentUser?.uid || currentUser?.uid || currentUser?.id || 'self';
    setSaving(true);

    const resolvedDept = payload.department === 'Diğer' && payload.customDepartment
      ? payload.customDepartment.trim()
      : payload.department;

    const cleanPayload = {
      department: resolvedDept,
      classYear: payload.classYear,
      studentNo: payload.studentNo || null,
      careerGoal: payload.careerGoal || null,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    // 1. Try persisting to Firestore (safe merge mode)
    try {
      if (db && uid) {
        await setDoc(doc(db, 'users', uid), cleanPayload, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore onboarding sync skipped / fallback:', e?.message);
    }

    // 2. Always persist to localStorage for instant local reliability
    const updatedUser = {
      ...(currentUser || {}),
      ...cleanPayload,
      id: uid,
      uid,
    };

    try {
      localStorage.setItem('iesu_mock_user', JSON.stringify(updatedUser));
      localStorage.setItem('iesu_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.warn('localStorage onboarding save error:', err);
    }

    // 3. Update Zustand Store
    const store = useAppStore.getState();
    store.setCurrentUser?.(updatedUser);

    setSaving(false);
    window.toast?.success?.('Profil onboarding bilgileri başarıyla tamamlandı.');
    onComplete?.(updatedUser);
    if (!isModal && setView) {
      setView('feed');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.department.trim()) {
        window.toast?.error?.('Lütfen bölümünüzü seçin.');
        return;
      }
      if (formData.department === 'Diğer' && !formData.customDepartment.trim()) {
        window.toast?.error?.('Lütfen bölüm adınızı yazın.');
        return;
      }
      if (!formData.classYear.trim()) {
        window.toast?.error?.('Lütfen sınıfınızı seçin.');
        return;
      }
      setStep(2);
      return;
    }

    persistComplete({
      department: formData.department.trim(),
      customDepartment: formData.customDepartment.trim(),
      classYear: formData.classYear.trim(),
      studentNo: formData.studentNo.trim() || null,
      careerGoal: formData.careerGoal.trim() || null,
    });
  };

  const content = (
    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 relative">
      {isModal && (
        <button
          type="button"
          onClick={onClose || (() => onComplete?.({ skipped: true }))}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          title="Kapat"
        >
          <X size={18} />
        </button>
      )}

      {/* Sol Panel: Tanıtım & İlerleme */}
      <div className="bg-gradient-to-b from-red-950 via-[#990000] to-rose-900 w-full md:w-2/5 p-8 text-white flex flex-col justify-between">
        <div>
          <Logo className="h-8 w-auto mb-8 brightness-0 invert" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap size={14} /> Öğrenci Portalı
          </div>
          <h2 className="text-2xl font-black mb-3 leading-tight">
            Kariyer Yolculuğuna<br /><span className="text-amber-200">Hoş Geldiniz</span>
          </h2>
          <p className="text-rose-100/80 text-xs leading-relaxed font-medium">
            Profilinizi tamamlayarak size özel staj, etkinlik, mentorluk ve kulüp önerilerinden hemen yararlanmaya başlayın.
          </p>
        </div>

        <div className="space-y-4 mt-8 hidden md:block">
          <div className={`flex items-center gap-3 ${step >= 1 ? 'text-white' : 'text-rose-300/40'}`}>
            <CheckCircle2 size={18} className={step >= 1 ? 'text-amber-300' : ''} />
            <span className="text-xs font-bold">1. Akademik kimlik</span>
          </div>
          <div className={`flex items-center gap-3 ${step >= 2 ? 'text-white' : 'text-rose-300/40'}`}>
            <CheckCircle2 size={18} className={step >= 2 ? 'text-amber-300' : ''} />
            <span className="text-xs font-bold">2. Kariyer hedefi</span>
          </div>
        </div>
      </div>

      {/* Sağ Panel: Form */}
      <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Akademik Bilgileriniz</h3>
              <p className="text-xs text-slate-500 font-medium mb-3">Bölüm ve sınıf bilginiz kariyer ve staj eşleşmeleri için kullanılır.</p>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">Bölüm *</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#990000]/20"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Bölüm Seçin...</option>
                {DEPARTMENT_OPTIONS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {formData.department === 'Diğer' && (
                <input
                  type="text"
                  className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#990000]/20"
                  placeholder="Lütfen bölümünüzü yazın..."
                  value={formData.customDepartment}
                  onChange={(e) => setFormData({ ...formData, customDepartment: e.target.value })}
                />
              )}
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">Sınıf *</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#990000]/20"
                value={formData.classYear}
                onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
              >
                <option value="">Sınıf Seçin...</option>
                <option value="Hazırlık">Hazırlık</option>
                <option value="1. Sınıf">1. Sınıf</option>
                <option value="2. Sınıf">2. Sınıf</option>
                <option value="3. Sınıf">3. Sınıf</option>
                <option value="4. Sınıf">4. Sınıf</option>
                <option value="Mezun">Mezun</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">Öğrenci No (opsiyonel)</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#990000]/20"
                value={formData.studentNo}
                onChange={(e) => setFormData({ ...formData, studentNo: e.target.value })}
                placeholder="Örn. 202401234"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Kariyer Hedefiniz</h3>
              <p className="text-xs text-slate-500 font-medium mb-3">Hedeflediğiniz alanları yazın — yapay zeka kariyer asistanı size uygun fırsatları öne çıkarsın.</p>
            </div>

            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-[#990000]/20"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
              placeholder="Örn. Yazılım stajı yapmak, açık kaynak projelere katılmak ve veri bilimi alanında uzmanlaşmak istiyorum."
            />

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 font-medium">
              <Briefcase size={14} className="inline mr-1" />
              KGB ilerleme puanınız tamamladığınız profil, CV ve kulüp etkinlikleri ile otomatik yükselir.
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Geri
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isModal) {
                  onClose?.();
                } else if (setView) {
                  setView('feed');
                } else {
                  onComplete?.({ skipped: true });
                }
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Sonra tamamla
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-black cursor-pointer disabled:opacity-60 shadow-sm active:scale-95 transition-all"
          >
            {step < 2 ? 'Devam' : (saving ? 'Kaydediliyor…' : 'Tamamla')}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {content}
    </div>
  );
}
