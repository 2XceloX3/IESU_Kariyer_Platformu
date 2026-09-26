import React, { useState } from 'react';
import { BookOpen, User, Briefcase, ChevronRight, CheckCircle2, GraduationCap, Award } from 'lucide-react';
import Logo from './Logo';

export default function AcademicOnboarding({ onComplete, currentUser }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    role: 'advisor' // advisor or head
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      // Complete onboarding
      onComplete({ ...formData, onboardingCompleted: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Left Side - Info */}
        <div className="bg-gradient-to-b from-[#2e1065] via-[#4c1d95] to-[#581c87] w-full md:w-2/5 p-8 text-white flex flex-col justify-between">
          <div>
            <Logo className="h-8 w-auto text-white mb-10 brightness-0 invert" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-300/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-4">
              <GraduationCap size={14} /> Akademik Kovan
            </div>
            <h2 className="text-2xl font-black mb-4 leading-tight">İESÜ Akademik <br/>Kariyer Paneline <br/><span className="text-purple-300">Hoş Geldiniz</span></h2>
            <p className="text-purple-200/80 text-xs leading-relaxed font-medium">
              Öğrencilerinizin kariyer yolculuğuna rehberlik edin, staj onaylarını yönetin ve bölümünüzün başarı istatistiklerini takip edin.
            </p>
          </div>
          <div className="space-y-4 mt-8 hidden md:block">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-white' : 'text-purple-300/40'}`}>
              <CheckCircle2 size={18} className={step >= 1 ? 'text-purple-300' : ''} />
              <span className="text-xs font-bold">1. Temel Akademik Bilgiler</span>
            </div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-white' : 'text-purple-300/40'}`}>
              <CheckCircle2 size={18} className={step >= 2 ? 'text-purple-300' : ''} />
              <span className="text-xs font-bold">2. Bölüm & Görev Tanımı</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-10">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-black text-slate-900 mb-2">Akademik Unvanınız</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Lütfen üniversitedeki resmi akademik kadro unvanınızı seçin.</p>
              <div className="space-y-3">
                {['Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi', 'Öğr. Gör.', 'Arş. Gör.'].map(t => (
                  <label key={t} className={`flex items-center p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${formData.title === t ? 'border-[#7c3aed] bg-purple-50/70 shadow-xs' : 'border-slate-200 hover:border-purple-200 bg-white'}`}>
                    <input type="radio" name="title" className="hidden" checked={formData.title === t} onChange={() => setFormData({...formData, title: t})} />
                    <User size={18} className={formData.title === t ? 'text-[#7c3aed]' : 'text-slate-400'} />
                    <span className={`ml-3 text-xs font-bold ${formData.title === t ? 'text-[#4c1d95]' : 'text-slate-700'}`}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-black text-slate-900 mb-2">Görev Bilgileriniz</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Bağlı olduğunuz akademik birimi ve panel yetkinizi tanımlayın.</p>
              
              <div className="mb-6">
                <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wider">Bağlı Olduğunuz Bölüm</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Bölüm Seçin...</option>
                  <option>Bilgisayar Mühendisliği</option>
                  <option>Yazılım Mühendisliği</option>
                  <option>İşletme</option>
                  <option>Psikoloji</option>
                  <option>Hukuk</option>
                  <option>Mimarlık</option>
                  <option>İç Mimarlık ve Çevre Tasarımı</option>
                  <option>Elektrik-Elektronik Mühendisliği</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wider">Panel Yetkiniz</label>
                <div className="space-y-3">
                  <label className={`flex items-start p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${formData.role === 'advisor' ? 'border-[#7c3aed] bg-purple-50/70 shadow-xs' : 'border-slate-200 hover:border-purple-200 bg-white'}`}>
                    <input type="radio" name="role" className="hidden" checked={formData.role === 'advisor'} onChange={() => setFormData({...formData, role: 'advisor'})} />
                    <BookOpen size={20} className={`mt-0.5 shrink-0 ${formData.role === 'advisor' ? 'text-[#7c3aed]' : 'text-slate-400'}`} />
                    <div className="ml-3">
                      <span className={`block font-bold text-xs ${formData.role === 'advisor' ? 'text-[#4c1d95]' : 'text-slate-800'}`}>Akademik Danışman</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">Öğrencilerin staj defterlerini, başvuru evraklarını ve dilekçelerini onaylayın.</span>
                    </div>
                  </label>
                  <label className={`flex items-start p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${formData.role === 'head' ? 'border-[#7c3aed] bg-purple-50/70 shadow-xs' : 'border-slate-200 hover:border-purple-200 bg-white'}`}>
                    <input type="radio" name="role" className="hidden" checked={formData.role === 'head'} onChange={() => setFormData({...formData, role: 'head'})} />
                    <Briefcase size={20} className={`mt-0.5 shrink-0 ${formData.role === 'head' ? 'text-[#7c3aed]' : 'text-slate-400'}`} />
                    <div className="ml-3">
                      <span className={`block font-bold text-xs ${formData.role === 'head' ? 'text-[#4c1d95]' : 'text-slate-800'}`}>Bölüm Başkanı</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">Bölüm istatistiklerini izleyin, stajları takip edin ve departmanı yönetin.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={(step === 1 && !formData.title) || (step === 2 && !formData.department)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4C1D95] via-[#7c3aed] to-indigo-600 hover:from-[#3b1277] hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-500/25 cursor-pointer"
            >
              {step === 2 ? 'Paneli Başlat' : 'İleri'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
