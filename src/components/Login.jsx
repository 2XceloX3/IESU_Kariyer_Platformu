import React, { useState } from 'react';
import { User, Users, Building2, Lock, ArrowRight, ArrowLeft, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';
import Logo from './Logo';
import { auth, db } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';



export default function Login({ setView, setUserRole, setAcademicRole, setCurrentUser }) {
  const { students, alumni, companies, academicStaff } = useAppStore();
  const [loginRole, setLoginRole] = useState('student');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // HARDCODED ADMIN CHECK
    if (username === 'Kariyer' && password === 'Z.s.1513') {
      setUserRole('admin');
      if (setAcademicRole) setAcademicRole('super_admin');
      
      if (setCurrentUser) {
        setCurrentUser({
          id: 'admin_1513',
          name: 'Kariyer Geliştirme Koordinatörlüğü',
          role: 'admin',
          grade: 'Süper Yönetici',
          avatar: '/logo.png',
          onboardingCompleted: true
        });
      }
      setView('admin');
      setIsLoading(false);
      return;
    }

    try {
      // FIREBASE AUTHENTICATION (The New Way)
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      
      // Fetch user role and data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const finalRole = userData.role || loginRole;
        setUserRole(finalRole);
        if (setCurrentUser) setCurrentUser({ id: user.uid, ...userData });
        setView(finalRole === 'employer' ? 'company' : finalRole);
        setIsLoading(false);
        return; // Success!
      } else {
        // If no Firestore document, fallback to basic auth info
        setUserRole(loginRole);
        if (setCurrentUser) setCurrentUser({ id: user.uid, email: user.email, name: user.displayName || 'Kullanıcı', role: loginRole, onboardingCompleted: true });
        setView(loginRole === 'employer' ? 'company' : loginRole);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.log("Firebase Login Failed, falling back to mock logic:", err.message);
    }
    
    // STRICT MOCK LOGIN LOGIC (No bypasses)
    if (loginRole === 'admin') {
      const adminUser = academicStaff.find(a => (a.email === username || a.id === username) && a.password === password);
      if (adminUser) {
        if (setAcademicRole) setAcademicRole(adminUser.role || 'standard_academic');
        setUserRole('academic');
        if (setCurrentUser) setCurrentUser({ ...adminUser, onboardingCompleted: true });
        setView('academic');
      } else {
        setError("Hatalı akademik personel kullanıcı adı veya şifresi!");
      }
    } else if (loginRole === 'alumni') {
      const alumniUser = alumni.find(a => (a.studentId === username || a.email === username) && a.password === password);
      
      if (alumniUser) {
        setUserRole('alumni');
        if (setCurrentUser) setCurrentUser({ ...alumniUser, onboardingCompleted: true });
        setView('alumni');
      } else {
        setError("Hatalı mezun numarası veya şifresi!");
      }
    } else if (loginRole === 'employer') {
      const companyUser = companies.find(c => c.username === username && c.password === password);
      
      if (companyUser) {
        setUserRole('employer');
        if (setCurrentUser) {
          setCurrentUser({
            ...companyUser,
            role: 'employer',
            avatar: companyUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(companyUser.name)}&background=8B5CF6&color=fff`,
            onboardingCompleted: true
          });
        }
        setView('company');
      } else {
        setError("Hatalı firma kullanıcı adı veya şifresi!");
      }
    } else {
      const studentUser = students.find(s => (s.studentId === username || s.email === username) && s.password === password);
      
      if (studentUser) {
        setUserRole('student');
        if (setCurrentUser) setCurrentUser({ ...studentUser, onboardingCompleted: true });
        setView('student');
      } else {
        setError("Hatalı öğrenci numarası veya şifresi!");
      }
    }
  };

  const handleEDevlet = () => {
    setError("e-Devlet Kapısı entegrasyonu şu anda bakımda. Lütfen şifreniz ile giriş yapınız.");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-slate-950 text-white">
      {/* Background Auditorium / Campus Image Overlay */}
      <img 
        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80" 
        alt="İESÜ Konferans Salonu" 
        className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90"></div>

      {/* Top Left Back Button */}
      <button 
        onClick={() => setView('landing')} 
        className="absolute top-8 left-8 text-white/90 hover:text-white flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={18} /> <span className="hidden sm:block">Ana Sayfaya Dön</span>
      </button>

      {/* Centered Container */}
      <div className="relative z-10 w-full max-w-lg p-4 sm:p-6">
        
        {/* Header Title with Official Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div 
            onClick={() => setView('landing')}
            className="mb-4 cursor-pointer hover:scale-105 transition-transform"
          >
            <Logo size="xl" variant="white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider text-center drop-shadow-md uppercase">
            İSTANBUL ESENYURT ÜNİVERSİTESİ
          </h1>
          <p className="text-[11px] text-red-200 font-extrabold uppercase tracking-widest mt-1 text-center">
            Kariyer Geliştirme Ofisi Koordinatörlüğü
          </p>
        </div>

        {/* Main Card with Curved Top Red Line */}
        <div className="bg-[#f8f9fa] text-slate-900 rounded-[32px] shadow-2xl p-6 sm:p-10 relative overflow-hidden border-t-4 border-[#dc2626]">

          <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center tracking-tight">
            Portala Giriş Yapın
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-r-xl font-bold text-sm flex items-center gap-2">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          {/* Role Selector Pill Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setLoginRole('student')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'student' ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <GraduationCap size={15} /> <span>Öğrenci</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('alumni')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'alumni' ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Users size={15} /> <span>Mezun</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('employer')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'employer' ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Building2 size={15} /> <span>Firma</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('admin')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'admin' ? 'bg-white text-red-600 shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ShieldCheck size={15} /> <span>Akademik</span>
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                id="username"
                type="text" 
                placeholder={loginRole === 'student' ? "T.C. Kimlik veya Öğrenci No" : "Kullanıcı Adı / E-Posta"} 
                className="w-full pl-11 pr-4 py-3 bg-white border border-red-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm font-semibold text-slate-800 placeholder:text-slate-400" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                id="password"
                type="password" 
                placeholder="Şifre" 
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm font-semibold text-slate-800 placeholder:text-slate-400" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label htmlFor="rememberMe" className="flex items-center gap-2 text-slate-600 font-bold cursor-pointer">
                <input id="rememberMe" type="checkbox" className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                Beni Unutma
              </label>
              <button type="button" onClick={() => setView('forgot_password')} className="text-red-600 font-extrabold hover:underline transition">
                Şifremi Unuttum
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-all shadow-lg hover:shadow-red-600/30 active:scale-[0.98] mt-3 group cursor-pointer disabled:opacity-70"
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* First Time Login Card (Soft Red Light Palette from Screenshot) */}
          {(loginRole === 'student' || loginRole === 'admin' || loginRole === 'alumni') && (
            <div className="mt-8 pt-6 border-t border-slate-200/80">
              <div className="bg-[#fef2f2] rounded-3xl p-5 border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="text-center sm:text-left">
                  <h4 className="text-[#dc2626] font-extrabold text-xs sm:text-sm">İlk Kez Mi Giriyorsunuz?</h4>
                  <p className="text-slate-500 text-[11px] font-semibold mt-0.5 leading-snug">
                    Sisteme kayıt olmak ve şifre belirlemek için tıklayın.
                  </p>
                </div>
                <button 
                  onClick={() => setView('register')} 
                  type="button" 
                  className="w-full sm:w-auto px-5 py-3 bg-white text-[#dc2626] hover:bg-red-50 rounded-2xl font-extrabold text-xs shadow-md border border-red-100 transition-all active:scale-[0.98] shrink-0 cursor-pointer text-center"
                >
                  Hesabımı Aktifleştir
                </button>
              </div>
            </div>
          )}

          {/* e-Devlet Login Button */}
          {loginRole === 'student' && (
            <>
              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">veya</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                onClick={handleEDevlet}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3 px-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <img src="/edevlet-vector.svg" alt="e-Devlet" className="h-6 w-auto object-contain" />
                <span className="font-bold text-xs">ile Giriş Yap</span>
              </button>
            </>
          )}
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-red-200/60 text-[11px] font-medium mt-6">
          © 2026 Tüm Hakları Saklıdır. İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü.
        </p>
      </div>
    </div>
  );
}


