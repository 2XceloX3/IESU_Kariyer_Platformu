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
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-red-50 via-white to-gray-100">
      
      {/* Floating Elements (Abstract) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-iesu-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Top Left Back Button */}
      <button 
        onClick={() => setView('landing')} 
        className="absolute top-8 left-8 text-gray-500 hover:text-iesu-navy flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:block">Ana Sayfaya Dön</span>
      </button>

      {/* Centered Glass Card */}
      <div className="relative z-10 w-full max-w-lg p-4 sm:p-8">
        
        {/* Logo outside the card */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="mb-5 drop-shadow-sm">
            <Logo className="h-24 w-auto" />
          </div>
          <h1 className="text-2xl font-black text-iesu-navy tracking-tight text-center">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
          <p className="text-[12px] text-gray-500 font-bold uppercase tracking-widest mt-1 text-center">Kariyer Geliştirme Koordinatörlüğü</p>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Decorative Top Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-iesu-navy via-iesu-blue to-iesu-navy"></div>

          <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Portala Giriş Yapın</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-bold animate-fade-in text-sm flex items-center gap-2">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1.5 bg-gray-100/80 rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setLoginRole('student')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'student' ? 'bg-white text-[#990000] shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 hover:shadow-sm'}`}
            >
              <GraduationCap size={16} /> <span className="hidden sm:inline">Öğrenci</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('alumni')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'alumni' ? 'bg-white text-[#990000] shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 hover:shadow-sm'}`}
            >
              <Users size={16} /> <span className="hidden sm:inline">Mezun</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('employer')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'employer' ? 'bg-white text-[#990000] shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 hover:shadow-sm'}`}
            >
              <Building2 size={16} /> <span className="hidden sm:inline">İşveren</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('admin')}
              className={`py-2 text-[11px] sm:text-[12px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-300 ${loginRole === 'admin' ? 'bg-white text-[#990000] shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 hover:shadow-sm'}`}
            >
              <ShieldCheck size={16} /> <span className="hidden sm:inline">Akademik</span>
            </button>
          </div>

          {/* Standard Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                {loginRole === 'student' ? "T.C. Kimlik veya Öğrenci Numarası" : "Kullanıcı Adı veya E-Posta"}
              </label>
              <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input 
                id="username"
                type="text" 
                aria-label={loginRole === 'student' ? "T.C. Kimlik veya Öğrenci Numarası" : "Kullanıcı Adı veya E-Posta"}
                placeholder={loginRole === 'student' ? "T.C. Kimlik veya Öğrenci No" : "Kullanıcı Adı / E-Posta"} 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 focus:border-iesu-blue outline-none transition text-[14px] font-medium text-[#990000] placeholder:text-gray-400 placeholder:font-normal" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">Şifre</label>
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input 
                id="password"
                type="password" 
                aria-label="Şifre"
                placeholder="Şifre" 
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 focus:border-iesu-blue outline-none transition text-[14px] font-medium text-[#990000] placeholder:text-gray-400 placeholder:font-normal" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

              <div className="flex items-center justify-between text-sm">
                <label htmlFor="rememberMe" className="flex items-center gap-2 text-gray-600 font-medium">
                  <input id="rememberMe" type="checkbox" className="rounded border-gray-300 text-[#990000] focus:ring-iesu-navy" />
                  Beni Unutma
                </label>
                <button type="button" onClick={() => setView('forgot_password')} className="text-[#990000] font-bold hover:text-[#990000] hover:underline transition">
                  Şifremi Unuttum
                </button>
              </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#990000] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {(loginRole === 'student' || loginRole === 'admin' || loginRole === 'alumni') && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-gradient-to-r from-iesu-navy/5 to-iesu-blue/5 rounded-2xl p-5 border border-iesu-navy/10 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:border-iesu-navy/20 transition-all">
                <div className="text-center sm:text-left">
                  <h4 className="text-[#990000] font-bold text-sm">İlk Kez Mi Giriyorsunuz?</h4>
                  <p className="text-gray-500 text-xs mt-0.5">Sisteme kayıt olmak ve şifre belirlemek için tıklayın.</p>
                </div>
                <button 
                  onClick={() => setView('register')} 
                  type="button" 
                  className="w-full sm:w-auto px-5 py-2.5 bg-white text-[#990000] rounded-xl font-bold text-sm shadow-sm border border-iesu-navy/10 hover:bg-[#990000] hover:text-white transition-all active:scale-[0.98]"
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
                <span className="flex-shrink-0 mx-4 text-gray-500 text-[11px] font-bold uppercase tracking-wider">veya</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button 
                onClick={handleEDevlet}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-[#990000] py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all shadow-md active:scale-[0.98] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#990000]/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                
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
              <button onClick={() => setView('register')} type="button" className="mt-2 px-6 py-2 bg-red-50 text-[#990000] rounded-xl font-black hover:bg-red-100 transition-colors inline-block">
                Kayıt Ol
              </button>
            </div>
          )}
          
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-red-200/60 text-[11px] font-medium mt-8">
          © 2026 Tüm Hakları Saklıdır. İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü.
        </p>
      </div>
    </div>
  );
}


