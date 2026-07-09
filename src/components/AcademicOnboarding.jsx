import React, { useState } from 'react';
import { BookOpen, User, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';
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
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Info */}
        <div className="bg-slate-900 w-full md:w-2/5 p-8 text-white flex flex-col justify-between">
          <div>
            <Logo className="h-8 w-auto text-white mb-12 brightness-0 invert" />
            <h2 className="text-2xl font-black mb-4 leading-tight">IESU Akademik <br/>Kariyer Paneline <br/><span className="text-blue-400">Hoş Geldiniz</span></h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Öğrencilerinizin kariyer yolculuğuna rehberlik edin, staj onaylarını yönetin ve bölümünüzün başarı istatistiklerini takip edin.
            </p>
          </div>
          <div className="space-y-4 mt-12 hidden md:block">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-white' : 'text-slate-600'}`}>
              <CheckCircle2 size={18} className={step >= 1 ? 'text-blue-400' : ''} />
              <span className="text-sm font-medium">Temel Bilgiler</span>
            </div>
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-white' : 'text-slate-600'}`}>
              <CheckCircle2 size={18} className={step >= 2 ? 'text-blue-400' : ''} />
              <span className="text-sm font-medium">Bölüm & Görev</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Akademik Ünvanınız</h3>
              <div className="space-y-3">
                {['Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi', 'Öğr. Gör.', 'Arş. Gör.'].map(t => (
                  <label key={t} className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.title === t ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input type="radio" name="title" className="hidden" checked={formData.title === t} onChange={() => setFormData({...formData, title: t})} />
                    <User size={18} className={formData.title === t ? 'text-blue-600' : 'text-gray-400'} />
                    <span className={`ml-3 font-medium ${formData.title === t ? 'text-blue-900' : 'text-gray-700'}`}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Görev Bilgileriniz</h3>
              
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 block mb-2">Bağlı Olduğunuz Bölüm</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/20"
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Bölüm Seçin...</option>
                  <option>Bilgisayar Mühendisliği</option>
                  <option>İşletme</option>
                  <option>Psikoloji</option>
                  <option>Hukuk</option>
                  <option>Mimarlık</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-2">Panel Yetkiniz</label>
                <div className="space-y-3">
                  <label className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.role === 'advisor' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input type="radio" name="role" className="hidden" checked={formData.role === 'advisor'} onChange={() => setFormData({...formData, role: 'advisor'})} />
                    <BookOpen size={20} className={`mt-0.5 ${formData.role === 'advisor' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="ml-3">
                      <span className={`block font-bold text-sm ${formData.role === 'advisor' ? 'text-blue-900' : 'text-gray-700'}`}>Akademik Danışman</span>
                      <span className="block text-xs text-gray-500 mt-1">Öğrencilerin staj defterlerini ve dilekçelerini onaylayın.</span>
                    </div>
                  </label>
                  <label className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.role === 'head' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                    <input type="radio" name="role" className="hidden" checked={formData.role === 'head'} onChange={() => setFormData({...formData, role: 'head'})} />
                    <Briefcase size={20} className={`mt-0.5 ${formData.role === 'head' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="ml-3">
                      <span className={`block font-bold text-sm ${formData.role === 'head' ? 'text-blue-900' : 'text-gray-700'}`}>Bölüm Başkanı</span>
                      <span className="block text-xs text-gray-500 mt-1">Bölüm istatistiklerini görün, stajları takip edin ve departmanı yönetin.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-end">
            <button 
              onClick={handleNext}
              disabled={(step === 1 && !formData.title) || (step === 2 && !formData.department)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {step === 2 ? 'Paneli Başlat' : 'İleri'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
