import React, { useState } from 'react';
import { User, Lock, ArrowRight, ArrowLeft, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';
import Logo from './Logo';

// IT Departmanı için Not: Firebase Kimlik Doğrulama ve Veritabanı modülleri
import { auth, db } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';



export default function Login({ setView, setUserRole, setAcademicRole, setCurrentUser }) {
  const [loginRole, setLoginRole] = useState('student');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // HARDCODED ADMIN CHECK (Kariyer Merkezi için Arka Kapı / Backdoor)
    if (username === 'Kariyer' && password === 'Z.s.1513') {
      setUserRole('admin');
      if (setAcademicRole) setAcademicRole('super_admin');
      if (setCurrentUser) {
        setCurrentUser({
          id: 'admin_1513',
          name: 'Kariyer Geliştirme Koordinatörlüğü',
          role: 'admin',
          grade: 'Süper Yönetici',
          avatar: '/iesu-logo.svg',
          onboardingCompleted: true
        });
      }
      setView('admin');
      return;
    }
    
    try {
      // 1. Firebase Auth ile giriş yap (E-posta doğrulaması)
      // Not: Kullanıcı T.C. veya Numara girdiyse ve e-posta değilse, sahte bir domain eklenebilir veya kullanıcıdan sadece E-Posta istenebilir.
      // Şimdilik doğrudan E-Posta olarak kabul ediyoruz.
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      // 2. Firestore'dan kullanıcının detaylı rol ve profil bilgilerini çek
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Firestore'daki role göre uygulamayı yönlendir
        setUserRole(userData.role);
        if (setCurrentUser) setCurrentUser(userData);
        
        if (userData.role === 'student') setView('student');
        else if (userData.role === 'employer') setView('company');
        else if (userData.role === 'alumni') setView('alumni');
        else if (userData.role === 'academic') {
           if (setAcademicRole) setAcademicRole('standard_academic');
           setView('academic');
        } else {
           setView('landing'); // Bilinmeyen rol
        }
      } else {
        // Eğer Firebase Auth'da var ama Firestore'da kaydı yoksa (Eski/Hatalı kayıt)
        alert("Kullanıcı profil bilgileri bulunamadı. Lütfen yöneticiyle iletişime geçin.");
        auth.signOut();
      }

    } catch (error) {
      console.error("Firebase Giriş Hatası:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        alert("E-posta adresiniz veya şifreniz hatalı!");
      } else if (error.code === 'auth/invalid-email') {
        alert("Lütfen sisteme kayıt olurken kullandığınız geçerli bir E-Posta adresini giriniz.");
      } else {
        alert("Giriş sırasında bir hata oluştu: " + error.message);
      }
    }
  };

  const handleEDevlet = () => {
    alert("e-Devlet Kapısı kimlik doğrulama sistemine yönlendiriliyorsunuz...");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gray-900">
      
      {/* Full Screen Background */}
      <img 
        src="https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-iesu-red/80 via-gray-900/80 to-gray-900/90 mix-blend-multiply"></div>
      
      {/* Floating Elements (Abstract) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-iesu-coral/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Left Back Button */}
      <button 
        onClick={() => setView('landing')} 
        className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:block">Ana Sayfaya Dön</span>
      </button>

      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-lg p-4 sm:p-8">
        
        {/* Logo outside the card */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="mb-5 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Logo className="h-20 w-auto text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-lg text-center">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
          <p className="text-[12px] text-red-200 font-bold uppercase tracking-widest mt-1 text-center">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-iesu-red via-iesu-coral to-iesu-red"></div>

          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Portala Giriş Yapın</h2>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1.5 bg-gray-100/80 rounded-xl mb-8">
            <button 
              onClick={() => setLoginRole('student')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'student' ? 'bg-white text-iesu-red shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <GraduationCap size={14} /> Öğrenci
            </button>
            <button 
              onClick={() => setLoginRole('alumni')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'alumni' ? 'bg-white text-iesu-red shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <User size={14} /> Mezun
            </button>
            <button 
              onClick={() => setLoginRole('employer')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'employer' ? 'bg-white text-iesu-red shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Briefcase size={14} /> Firma
            </button>
            <button 
              onClick={() => setLoginRole('admin')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'admin' ? 'bg-white text-iesu-red shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <ShieldCheck size={14} /> Akademik
            </button>
          </div>

          {/* Standard Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder={loginRole === 'student' ? "Öğrenci E-Posta Adresi" : "Kayıtlı E-Posta Adresi"} 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 focus:border-iesu-coral outline-none transition text-[14px] font-medium placeholder:font-normal" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Şifre" 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 focus:border-iesu-coral outline-none transition text-[14px] font-medium placeholder:font-normal" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 font-medium">
                  <input type="checkbox" className="rounded border-gray-300 text-iesu-red focus:ring-iesu-red" />
                  Beni Unutma
                </label>
                <button type="button" onClick={() => setView('forgot_password')} className="text-iesu-red font-bold hover:text-iesu-darkRed hover:underline transition">
                  Şifremi Unuttum
                </button>
              </div>
            
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-iesu-red text-white font-bold py-3.5 px-4 rounded-xl hover:bg-iesu-darkRed transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2 group"
            >
              Giriş Yap <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {loginRole === 'student' && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-iesu-red/5 to-iesu-coral/5 rounded-2xl p-5 border border-iesu-red/10 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-iesu-red/20 transition-all">
                <div className="text-center sm:text-left">
                  <h4 className="text-iesu-red font-bold text-sm">İlk Kez Mi Giriyorsunuz?</h4>
                  <p className="text-gray-500 text-xs mt-0.5">Sisteme kayıt olmak ve şifre belirlemek için tıklayın.</p>
                </div>
                <button 
                  onClick={() => setView('register')} 
                  type="button" 
                  className="w-full sm:w-auto px-5 py-2.5 bg-white text-iesu-red rounded-xl font-bold text-sm shadow-sm border border-iesu-red/10 hover:bg-iesu-red hover:text-white transition-all active:scale-[0.98]"
                >
                  Hesabımı Aktifleştir
                </button>
              </div>
            </div>
          )}

          {/* e-Devlet Login Button (Moved BELOW the form, Only for Students) */}
          {loginRole === 'student' && (
            <>
              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-[11px] font-bold uppercase tracking-wider">veya</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button 
                onClick={handleEDevlet}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-[#132A49] py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all shadow-md active:scale-[0.98] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#132A49]/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                
                <img src="/edevlet-vector.svg" alt="e-Devlet" className="h-7 w-auto object-contain drop-shadow-sm" />
                <span className="font-bold text-[15px] tracking-wide">ile Giriş Yap</span>
              </button>
            </>
          )}
          
          {loginRole === 'employer' && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm font-medium">
                Sistemde kaydınız yok mu?
              </p>
              <button onClick={() => setView('register')} className="mt-2 px-6 py-2 bg-red-50 text-iesu-red rounded-xl font-black hover:bg-red-100 transition-colors inline-block">
                Kayıt Ol
              </button>
            </div>
          )}
          
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-red-200/60 text-[11px] font-medium mt-8">
          © 2026 Tüm Hakları Saklıdır. İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi Koordinatörlüğü.
        </p>
      </div>
    </div>
  );
}
