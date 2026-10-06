import SafeAvatar from './shared/SafeAvatar';
import React, { useState } from 'react';
import { User, Users, Building2, Lock, ArrowRight, ArrowLeft, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';
import Logo from './Logo';
import { auth, db } from '../utils/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';
const EDevletObsModal = import.meta.env.DEV ? React.lazy(() => import('./modals/EDevletObsModal')) : null;

export default function Login({ setView, setUserRole, setAcademicRole, setCurrentUser }) {
  const { setRegisterAccountType } = useAppStore();
  const [loginRole, setLoginRole] = useState('alumni');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdevletModalOpen, setIsEdevletModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Süper admin yalnızca Firebase Auth + users/{uid}.role (veya custom claim) ile.
    // İstemci tarafında sabit kimlik bilgisi / VITE_ADMIN_* ile giriş yoktur.

    try {
      // FIREBASE AUTHENTICATION (The New Way)
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      const isKovanAdmin = (user.email && user.email.toLowerCase() === 'kariyer@iesu.edu.tr');

      let userData = null;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) userData = userDoc.data();
      } catch (fsErr) {
        console.warn('Firestore profil okunamadı:', fsErr?.code || fsErr?.message);
        if (!isKovanAdmin) {
          setError('Profil servisine ulaşılamıyor. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
          setIsLoading(false);
          return;
        }
      }

      if (userData) {
        if (userData.status === 'Onay Bekliyor' && !isKovanAdmin) {
          if (typeof signOut === 'function') {
            await signOut(auth);
          }
          setError('Hesabınız henüz onaylanmamıştır. Lütfen Kariyer Geliştirme Koordinatörlüğü onayını bekleyin.');
          setIsLoading(false);
          return;
        }
        const finalRole = isKovanAdmin ? 'admin' : (userData.role || loginRole);
        const loggedUser = { id: user.uid, ...userData, role: finalRole, email: user.email };
        try {
          localStorage.setItem('iesu_mock_user', JSON.stringify(loggedUser));
          localStorage.setItem('iesu_user_role_v1', finalRole);
          const s = useAppStore.getState();
          s.setUserRole?.(finalRole);
          s.setCurrentUser?.(loggedUser);
          const branchMap = { student: 'student', alumni: 'alumni', company: 'company', employer: 'company', academic: 'academic', admin: 'admin' };
          const targetBranch = branchMap[finalRole] || 'student';
          s.setActivePortalBranch?.(targetBranch);
        } catch (e) { /* intentional */ }
        setUserRole(finalRole);
        if (setCurrentUser) setCurrentUser(loggedUser);
        setView(finalRole === 'employer' ? 'company' : finalRole);
        setIsLoading(false);
        return;
      } else if (isKovanAdmin) {
        const finalRole = 'admin';
        const loggedUser = { id: user.uid, email: user.email, role: finalRole, name: 'Süper Admin' };
        try {
          localStorage.setItem('iesu_mock_user', JSON.stringify(loggedUser));
          localStorage.setItem('iesu_user_role_v1', finalRole);
          const s = useAppStore.getState();
          s.setUserRole?.(finalRole);
          s.setCurrentUser?.(loggedUser);
          s.setActivePortalBranch?.('admin');
        } catch (e) { /* intentional */ }
        setUserRole(finalRole);
        if (setCurrentUser) setCurrentUser(loggedUser);
        setView('admin');
        setIsLoading(false);
        return;
      } else {
        await signOut(auth);
        setError('Hesap profiliniz bulunamadı. Lütfen kayıt olun veya Kariyer Geliştirme Koordinatörlüğü ile iletişime geçin.');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Firebase giriş başarısız:', err?.code || err?.message);
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setError('E-posta veya şifre hatalı.');
      } else if (code === 'auth/too-many-requests') {
        setError('Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
      } else if (code === 'auth/network-request-failed') {
        setError('Ağ hatası: Firebase’e bağlanılamadı. İnternet/VPN veya engeli kontrol edin.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('Bu alan adı Firebase’de yetkili değil (localhost eklenmeli).');
      } else if (loginRole === 'admin') {
        setError('Yönetici girişi başarısız' + (code ? ' (' + code + ')' : '') + '.');
      } else {
        setError('Giriş servisine şu anda ulaşılamıyor' + (code ? ' (' + code + ')' : '') + '. Lütfen daha sonra tekrar deneyin.');
      }
            setIsLoading(false);
    }
  };

  const handleEDevlet = () => {
    setIsEdevletModalOpen(true);
  };

  const handleEDevletSuccessLogin = (profile) => {
    if (!import.meta.env.DEV) return;
    // Geliştirme: asla sahte yoksisVerified=true kalıcı yazılmaz.
    const safe = {
      ...profile,
      yoksisVerified: profile?.yoksisVerified === true && profile?.verificationSource === 'api' ? true : false,
      eDevletVerified: false,
      obsVerified: false,
    };
    try {
      localStorage.setItem('iesu_mock_user', JSON.stringify(safe));
      localStorage.setItem('iesu_user_role_v1', safe.role);
      const s = useAppStore.getState();
      s.setUserRole?.(safe.role);
      s.setCurrentUser?.(safe);
      s.setActivePortalBranch?.(safe.role);
    } catch (e) { /* intentional */ }
    setUserRole(safe.role);
    if (setCurrentUser) setCurrentUser(safe);
    setView(safe.role);
    setIsEdevletModalOpen(false);
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider text-center drop-shadow-md">
            İstanbul Esenyurt Üniversitesi
          </h1>
          <p className="text-[11px] text-red-200 font-extrabold tracking-widest mt-1 text-center">
            Kariyer Geliştirme Koordinatörlüğü
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setLoginRole('alumni')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'alumni' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Users size={15} /> <span>Mezun</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('student')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'student' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <GraduationCap size={15} /> <span>Öğrenci</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('academic')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'academic' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <ShieldCheck size={15} /> <span>Akademik</span>
            </button>
            <button 
              type="button"
              onClick={() => setLoginRole('employer')}
              className={`flex-1 py-2 px-3 text-[12px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${loginRole === 'employer' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Building2 size={15} /> <span>Firma</span>
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <label htmlFor="username" className="sr-only">E-Posta veya Kullanıcı Adı</label>
              <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                id="username"
                name="username"
                aria-label="E-Posta veya Kullanıcı Adı"
                type="text" 
                placeholder={loginRole === 'student' ? "E-posta veya kullanıcı adı" : "Kullanıcı Adı / E-Posta"} 
                className="w-full pl-11 pr-4 py-3 bg-white border border-red-300 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition text-sm font-semibold text-slate-800 placeholder:text-slate-400" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="sr-only">Şifre</label>
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input 
                id="password"
                name="password"
                aria-label="Şifre"
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
                Beni Hatırla
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
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="bg-[#fef2f2] rounded-3xl p-5 border border-red-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="text-center sm:text-left">
                <h4 className="text-[#dc2626] font-extrabold text-xs sm:text-sm">İlk Kez Mi Giriyorsunuz?</h4>
                <p className="text-slate-500 text-[11px] font-semibold mt-0.5 leading-snug">
                  {loginRole === 'employer'
                    ? 'İş veya staj ilanı vermek için kurumsal firma kaydınızı oluşturun.'
                    : 'Sisteme kayıt olmak ve şifre belirlemek için tıklayın.'}
                </p>
              </div>
              <button 
                onClick={() => {
                  if (setRegisterAccountType) {
                    setRegisterAccountType(loginRole === 'employer' ? 'employer' : loginRole === 'student' ? 'student' : (loginRole === 'admin' || loginRole === 'academic') ? 'academic' : 'alumni');
                  }
                  setView('register');
                }} 
                type="button" 
                className="w-full sm:w-auto px-5 py-3 bg-white text-[#dc2626] hover:bg-red-50 rounded-2xl font-extrabold text-xs shadow-md border border-red-100 transition-all active:scale-[0.98] shrink-0 cursor-pointer text-center whitespace-nowrap"
              >
                {loginRole === 'employer' ? 'Firma Kaydı Oluştur' : 'Hesabımı Aktifleştir'}
              </button>
            </div>
          </div>

          {/* e-Devlet: üretimde gösterilmez (sahte doğrulama yok). */}
          {import.meta.env.DEV && (loginRole === 'student' || loginRole === 'alumni' || loginRole === 'academic') && (
            <>
              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">veya</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                type="button"
                onClick={handleEDevlet}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-red-300 text-slate-700 py-3 px-4 rounded-2xl hover:bg-red-50/40 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <img src="/edevlet-vector.svg" alt="e-Devlet" className="h-4 w-auto object-contain" />
                <span className="font-bold text-xs">e-Devlet ile Giriş (yalnızca geliştirme)</span>
              </button>
            </>
          )}
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-red-200/60 text-[11px] font-medium mt-6">
          © 2026 Tüm Hakları Saklıdır. İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Koordinatörlüğü.
        </p>
      </div>

      {import.meta.env.DEV && EDevletObsModal && (
        <React.Suspense fallback={null}>
          <EDevletObsModal
            isOpen={isEdevletModalOpen}
            onClose={() => setIsEdevletModalOpen(false)}
            initialRole={loginRole === 'alumni' ? 'alumni' : 'student'}
            onSuccessLogin={handleEDevletSuccessLogin}
          />
        </React.Suspense>
      )}
    </div>
  );
}



