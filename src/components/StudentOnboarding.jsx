import React, { useState } from 'react';
import { BookOpen, User, Briefcase, ChevronRight, CheckCircle2, GraduationCap } from 'lucide-react';
import Logo from './Logo';
import { auth, db } from '../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';

/**
 * Student onboarding wizard. Writes onboardingCompleted on the users/{uid} doc
 * (never from Login). Does not touch Register.
 */
export default function StudentOnboarding({ onComplete, currentUser, setView }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    department: currentUser?.department || '',
    classYear: currentUser?.classYear || currentUser?.year || '',
    studentNo: currentUser?.studentNo || currentUser?.studentId || '',
    careerGoal: '',
  });

  const persistComplete = async (payload) => {
    const uid = auth?.currentUser?.uid || currentUser?.uid || currentUser?.id;
    if (!uid) {
      window.toast?.error?.('Oturum gerekli — onboarding kaydedilemedi.');
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...payload,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      });
      const store = useAppStore.getState();
      store.setCurrentUser?.({
        ...(store.currentUser || currentUser || {}),
        ...payload,
        id: uid,
        uid,
        onboardingCompleted: true,
      });
      window.toast?.success?.('Öğrenci onboarding tamamlandı.');
      onComplete?.({ ...payload, onboardingCompleted: true });
    } catch (e) {
      window.toast?.error?.(e?.message || 'Onboarding Firestore yazılamadı');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.department.trim() || !formData.classYear.trim()) {
        window.toast?.error?.('Bölüm ve sınıf zorunlu.');
        return;
      }
      setStep(2);
      return;
    }
    persistComplete({
      department: formData.department.trim(),
      classYear: formData.classYear.trim(),
      studentNo: formData.studentNo.trim() || null,
      careerGoal: formData.careerGoal.trim() || null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        <div className="bg-gradient-to-b from-red-950 via-[#990000] to-rose-900 w-full md:w-2/5 p-8 text-white flex flex-col justify-between">
          <div>
            <Logo className="h-8 w-auto mb-10 brightness-0 invert" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-bold uppercase tracking-wider mb-4">
              <GraduationCap size={14} /> Öğrenci Kovanı
            </div>
            <h2 className="text-2xl font-black mb-4 leading-tight">
              Kariyer Yolculuğuna<br /><span className="text-amber-200">Hoş Geldiniz</span>
            </h2>
            <p className="text-rose-100/80 text-xs leading-relaxed font-medium">
              Profilinizi gerçek verilerle tamamlayın. İlerleme skoru yalnızca profil, CV, başvuru ve etkinlik sinyallerinden türetilir — sahte yüzde yok.
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

        <div className="w-full md:w-3/5 p-8 md:p-10">
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="text-xl font-black text-slate-900 mb-1">Akademik Bilgileriniz</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Bölüm ve sınıf bilgisi kariyer önerileri için kullanılır.</p>
              <div>
                <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wider">Bölüm</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="">Bölüm Seçin...</option>
                  <option>Bilgisayar Mühendisliği</option>
                  <option>Yazılım Mühendisliği</option>
                  <option>Endüstri Mühendisliği</option>
                  <option>İşletme</option>
                  <option>Psikoloji</option>
                  <option>Diğer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wider">Sınıf</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800"
                  value={formData.classYear}
                  onChange={(e) => setFormData({ ...formData, classYear: e.target.value })}
                >
                  <option value="">Sınıf Seçin...</option>
                  <option>1. Sınıf</option>
                  <option>2. Sınıf</option>
                  <option>3. Sınıf</option>
                  <option>4. Sınıf</option>
                  <option>Hazırlık</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wider">Öğrenci No (opsiyonel)</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800"
                  value={formData.studentNo}
                  onChange={(e) => setFormData({ ...formData, studentNo: e.target.value })}
                  placeholder="Örn. 202401234"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <h3 className="text-xl font-black text-slate-900 mb-1">Kariyer Hedefiniz</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">Kısa bir hedef yazın — ilerleme skoruna sinyal olarak girer.</p>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-800 min-h-[120px]"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                placeholder="Örn. Yazılım stajı ve açık kaynak katkıları"
              />
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 font-medium">
                <Briefcase size={14} className="inline mr-1" />
                KGB ilerlemesi profil, CV, başvuru, etkinlik ve hedef sinyallerinden türetilir.
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">
                Geri
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setView?.('student') || onComplete?.({ skipped: true })}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Sonra tamamla
              </button>
            )}
            <button
              type="button"
              disabled={saving}
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#990000] hover:bg-red-800 text-white text-xs font-black cursor-pointer disabled:opacity-60"
            >
              {step < 2 ? 'Devam' : (saving ? 'Kaydediliyor…' : 'Tamamla')}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
