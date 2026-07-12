import React, { useState } from 'react';
import { ArrowLeft, User, KeyRound, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function ForgotPassword({ setView }) {
  const [step, setStep] = useState(1); // 1: TC/No gir, 2: Kod Gir, 3: Yeni Şifre, 4: Başarılı

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 3) {
      const pass1 = e.target.elements[0]?.value;
      const pass2 = e.target.elements[1]?.value;
      if (pass1 !== pass2) {
        window.toast.error("Şifreler eşleşmiyor! Lütfen kontrol edin.");
        return;
      }
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gray-900">
      {/* Background */}
      <img 
        src="https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-iesu-red/80 via-gray-900/80 to-gray-900/90 mix-blend-multiply"></div>
      
      <button 
        onClick={() => setView('login')} 
        className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:block">Giriş Ekranına Dön</span>
      </button>

      <div className="relative z-10 w-full max-w-md p-4 sm:p-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-iesu-red via-iesu-coral to-iesu-red"></div>

          <div className="flex justify-center mb-6 text-iesu-red">
            {step === 4 ? <CheckCircle2 size={56} className="text-green-500" /> : <KeyRound size={56} />}
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
            {step === 1 && "Şifremi Unuttum"}
            {step === 2 && "Doğrulama Kodu"}
            {step === 3 && "Yeni Şifre Belirle"}
            {step === 4 && "İşlem Başarılı!"}
          </h2>
          <p className="text-center text-sm text-gray-500 font-medium mb-8">
            {step === 1 && "Sisteme kayıtlı kurumsal e-posta adresinizi girin."}
            {step === 2 && "E-posta adresinize gönderilen 6 haneli doğrulama kodunu girin."}
            {step === 3 && "Hesabınız için güçlü bir yeni şifre oluşturun."}
            {step === 4 && "Şifreniz başarıyla güncellendi. Artık giriş yapabilirsiniz."}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Sistemde Kayıtlı E-Posta Adresiniz" 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 focus:border-iesu-coral outline-none transition text-[14px] font-medium" 
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="E-Posta Onay Kodu (Örn: 123456)" 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 focus:border-iesu-coral outline-none transition text-[14px] font-medium tracking-widest text-center" 
                  required
                />
              </div>
            )}

            {step === 3 && (
              <>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="Yeni Şifreniz" 
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 focus:border-iesu-coral outline-none transition text-[14px] font-medium" 
                    required
                  />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    placeholder="Yeni Şifreniz (Tekrar)" 
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 focus:border-iesu-coral outline-none transition text-[14px] font-medium" 
                    required
                  />
                </div>
              </>
            )}

            {step < 4 ? (
              <button 
                type="submit" 
                className="w-full flex items-center justify-center bg-iesu-red text-white font-bold py-3.5 px-4 rounded-xl hover:bg-iesu-darkRed transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2"
              >
                {step === 1 ? "Devam Et" : step === 2 ? "Doğrula" : "Şifreyi Kaydet"}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Giriş Yapmaya Git
              </button>
            )}
          </form>
          
        </div>
      </div>
    </div>
  );
}
