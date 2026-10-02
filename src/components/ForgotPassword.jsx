import React, { useState } from 'react';
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';

export default function ForgotPassword({ setView }) {
  const [step, setStep] = useState(1); // 1: E-posta gir, 2: Doğrulama bağlantısı gönderildi
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStep(2);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Bu e-posta adresiyle kayıtlı hesap bulunamadı.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Geçersiz e-posta adresi.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
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
      <div className="absolute inset-0 bg-gradient-to-tr from-iesu-navy/80 via-gray-900/80 to-gray-900/90 mix-blend-multiply"></div>
      
      <button 
        onClick={() => setView('login')} 
        className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:block">Giriş Ekranına Dön</span>
      </button>

      <div className="relative z-10 w-full max-w-md p-4 sm:p-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-iesu-navy via-iesu-blue to-iesu-navy"></div>

          <div className="flex justify-center mb-6 text-[#990000]">
            {step === 2 ? <CheckCircle2 size={56} className="text-green-500" /> : <KeyRound size={56} />}
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">
            {step === 1 ? "Şifremi Unuttum" : "İşlem Başarılı!"}
          </h2>
          <p className="text-center text-sm text-gray-500 font-medium mb-6">
            {step === 1 && "Sisteme kayıtlı kurumsal e-posta adresinizi girin."}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-bold text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="relative">
                <label htmlFor="reset-email" className="sr-only">E-Posta Adresi</label>
                <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input 
                  id="reset-email"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Sistemde Kayıtlı E-Posta Adresiniz" 
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 focus:border-iesu-blue outline-none transition text-[14px] font-medium" 
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 font-medium leading-relaxed">
                Şifre sıfırlama bağlantısı <strong className="text-gray-900">{email}</strong> adresine gönderildi. E-postanızı kontrol edin ve bağlantıya tıklayın.
              </p>
              <button 
                type="button" 
                onClick={() => setView('login')}
                className="w-full flex items-center justify-center bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-red-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
