import React, { useState } from 'react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, User, FileText, CheckCircle2, GraduationCap, KeyRound, Lock } from 'lucide-react';
import Logo from './Logo';

// IT Departmanı için Not: Firebase Kimlik Doğrulama (Auth) ve Veritabanı (Firestore) modülleri içeri aktarıldı.
import { auth, db } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';

export default function Register({ setView, setCurrentUser, setUserRole }) {
  const { setStudents, setAlumni, setAcademicStaff, setCompanies } = useAppStore();
  const [step, setStep] = useState(1); // 1: Info, 2: Success
  const [accountType, setAccountType] = useState('alumni'); // 'alumni', 'student', 'employer', 'academic'
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '', website: '', contactName: '', title: '', email: '', phone: '',
    studentName: '', studentId: '', studentEmail: '', password: '', passwordConfirm: '',
    academicName: '', academicEmail: '', academicTitle: '',
    alumniName: '', alumniId: '', alumniEmail: '', graduationYear: '', alumniDepartment: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (accountType === 'student') {
        if (formData.password !== formData.passwordConfirm) {
          setError("Şifreler eşleşmiyor! Lütfen kontrol edin.");
          return;
        }
        if (formData.password.length < 6) {
          setError("Şifre en az 6 karakter olmalıdır.");
          return;
        }

        // [FİREBASE AUTH] - Yeni Öğrenci Kullanıcısı Oluştur (Hata durumunda lokal veriyle devam et)
        let studentUid = `mock_stu_${Date.now()}`;
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.studentEmail, formData.password);
          studentUid = userCredential.user.uid;
        } catch(authErr) {
          console.warn("Firebase Auth bağlanamadı, lokal kayıt yapılıyor:", authErr.message);
          if (authErr.code === 'auth/email-already-in-use' || authErr.code === 'auth/weak-password') {
            throw authErr;
          }
        }

        // [FİREBASE FIRESTORE] - Kullanıcı Detaylarını Veritabanına Kaydet
        const newStudent = {
          id: studentUid, // Eşsiz UID
          name: formData.studentName || 'Yeni Öğrenci',
          studentId: formData.studentId,
          email: formData.studentEmail,
          department: 'Belirtilmedi',
          role: 'student',
          grade: 'Aktif',
          status: 'Aktif',
          internshipStatus: 'Arıyor',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.studentName || 'Öğrenci')}&background=0A2342&color=fff`,
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        };

        // Arayüzü güncelle (Geçici)
        if (setStudents) setStudents(prev => [...(prev || []), newStudent]);
        if (setCurrentUser) setCurrentUser(newStudent);
        if (setUserRole) setUserRole('student');

        // users koleksiyonuna uid ile kaydet (Firestore) - hata fırlatsa da uygulama devam etsin
        try {
          await setDoc(doc(db, "users", studentUid), newStudent);
        } catch(err) {
          console.warn("Firestore'a kayıt edilemedi, lokal storage ile devam ediliyor:", err);
        }
        
      } else if (accountType === 'employer') {
        // [FİREBASE AUTH] - Yeni Firma Kullanıcısı Oluştur
        if (!formData.password || formData.password.length < 6) {
          setError("Lütfen en az 6 karakterli bir şifre belirleyin.");
          setIsLoading(false);
          return;
        }
        
        let companyUid = `mock_cmp_${Date.now()}`;
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          companyUid = userCredential.user.uid;
        } catch(authErr) {
          console.warn("Firebase Auth bağlanamadı, lokal firma kaydı yapılıyor:", authErr.message);
          if (authErr.code === 'auth/email-already-in-use' || authErr.code === 'auth/weak-password') {
            throw authErr;
          }
        }

        // [FİREBASE FIRESTORE] - Firma Detaylarını Veritabanına Kaydet
        const newCompany = {
          id: companyUid,
          name: formData.companyName,
          username: formData.email,
          email: formData.email,
          phone: formData.phone,
          contactName: formData.contactName,
          title: formData.title,
          website: formData.website,
          sector: 'Belirtilmedi',
          role: 'employer',
          status: 'Onay Bekliyor',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.companyName)}&background=8B5CF6&color=fff`,
          createdAt: new Date().toISOString()
        };

        if (setCompanies) setCompanies(prev => [...(prev || []), newCompany]);

        try {
          await setDoc(doc(db, "users", companyUid), newCompany);
        } catch(err) {
          console.warn("Firestore'a kayıt edilemedi, lokal storage ile devam ediliyor:", err);
        }
      } else if (accountType === 'academic') {
        if (formData.password !== formData.passwordConfirm) {
          setError("Şifreler eşleşmiyor! Lütfen kontrol edin.");
          return;
        }
        if (formData.password.length < 6) {
          setError("Şifre en az 6 karakter olmalıdır.");
          return;
        }

        // [FİREBASE AUTH] - Yeni Akademik Kullanıcı Oluştur
        let academicUid = `mock_acad_${Date.now()}`;
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.academicEmail, formData.password);
          academicUid = userCredential.user.uid;
        } catch(authErr) {
          console.warn("Firebase Auth bağlanamadı, lokal akademik kaydı yapılıyor:", authErr.message);
          if (authErr.code === 'auth/email-already-in-use' || authErr.code === 'auth/weak-password') {
            throw authErr;
          }
        }

        // [FİREBASE FIRESTORE] - Akademik Detayları Veritabanına Kaydet
        const newAcademic = {
          id: academicUid,
          name: formData.academicName || 'Yeni Akademisyen',
          email: formData.academicEmail,
          title: formData.academicTitle || 'Akademisyen',
          role: 'academic',
          department: 'Belirtilmedi',
          status: 'Aktif',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.academicName || 'Akademisyen')}&background=0EA5E9&color=fff`,
          createdAt: new Date().toISOString()
        };

        if (setAcademicStaff) setAcademicStaff(prev => [...(prev || []), newAcademic]);
        if (setCurrentUser) setCurrentUser(newAcademic);
        if (setUserRole) setUserRole('academic');

        try {
          await setDoc(doc(db, "users", academicUid), newAcademic);
        } catch(err) {
          console.warn("Firestore'a kayıt edilemedi, lokal storage ile devam ediliyor:", err);
        }
      } else if (accountType === 'alumni') {
        if (formData.password !== formData.passwordConfirm) {
          setError("Şifreler eşleşmiyor! Lütfen kontrol edin.");
          return;
        }
        if (formData.password.length < 6) {
          setError("Şifre en az 6 karakter olmalıdır.");
          return;
        }

        // [FİREBASE AUTH] - Yeni Mezun Kullanıcı Oluştur
        let alumniUid = `mock_alum_${Date.now()}`;
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.alumniEmail, formData.password);
          alumniUid = userCredential.user.uid;
        } catch(authErr) {
          console.warn("Firebase Auth bağlanamadı, lokal mezun kaydı yapılıyor:", authErr.message);
          if (authErr.code === 'auth/email-already-in-use' || authErr.code === 'auth/weak-password') {
            throw authErr;
          }
        }

        // [FİREBASE FIRESTORE] - Mezun Detayları
        const newAlumni = {
          id: alumniUid,
          name: formData.alumniName || 'Yeni Mezun',
          studentId: formData.alumniId,
          email: formData.alumniEmail,
          department: formData.alumniDepartment || 'Belirtilmedi',
          graduationYear: formData.graduationYear || new Date().getFullYear().toString(),
          role: 'alumni',
          status: 'Aktif',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.alumniName || 'Mezun')}&background=F59E0B&color=fff`,
          createdAt: new Date().toISOString()
        };

        if (setAlumni) setAlumni(prev => [...(prev || []), newAlumni]);
        if (setCurrentUser) setCurrentUser(newAlumni);
        if (setUserRole) setUserRole('alumni');

        try {
          await setDoc(doc(db, "users", alumniUid), newAlumni);
        } catch(err) {
          console.warn("Firestore'a kayıt edilemedi, lokal storage ile devam ediliyor:", err);
        }
      }
      
      // Tüm caselerde başarılı olursa Success (Adım 2) göster
      setStep(2);

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Bu e-posta adresi zaten kullanımda!');
      else if (err.code === 'auth/weak-password') setError('Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin.');
      else setError("Kayıt olurken bir hata oluştu: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gray-900 py-10">
      {/* Background */}
      <img 
        src="https://panel.esenyurt.edu.tr/assets/2026/resimler/hitm/519cc07174684619b555d5bb4eecac4f_b54816bd1b5941a595a60eb469b5b4c7.jpg" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow fixed"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-iesu-navy/80 via-gray-900/80 to-gray-900/90 mix-blend-multiply fixed"></div>
      
      <button 
        onClick={() => setView('login')} 
        className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:block">Giriş Ekranına Dön</span>
      </button>

      <div className="relative z-10 w-full max-w-2xl p-4 sm:p-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-iesu-navy via-iesu-blue to-iesu-navy"></div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl font-bold animate-fade-in text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setAccountType('alumni')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${accountType === 'alumni' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <GraduationCap size={18} /> Mezun Kaydı
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAccountType('student')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${accountType === 'student' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <GraduationCap size={18} /> Öğrenci Kaydı
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAccountType('academic')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${accountType === 'academic' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <User size={18} /> Akademik Personel
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAccountType('employer')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${accountType === 'employer' ? 'bg-white text-[#990000] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Building2 size={18} /> Firma Kaydı
                  </button>
                </div>
              </div>

              {accountType === 'employer' ? (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Firma Kaydı Oluştur</h2>
                  <p className="text-center text-sm text-gray-500 font-medium mb-8">
                    Lütfen kurumunuzla ilgili bilgileri eksiksiz doldurun. Başvurunuz kariyer ofisimiz tarafından onaylandıktan sonra aktif edilecektir.
                  </p>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Kurum Adı & Logo */}
                      <div className="relative col-span-1 sm:col-span-2">
                        <label htmlFor="companyName" className="sr-only">Şirket / Kurum Adı</label>
                        <Building2 className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Şirket / Kurum Adı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative col-span-1 sm:col-span-2">
                        <label htmlFor="website" className="sr-only">Şirket Web Sayfası / İletişim URL</label>
                        <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="website" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="Şirket Web Sayfası / İletişim URL" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      {/* Yetkili Kişi & Unvan */}
                      <div className="relative">
                        <label htmlFor="contactName" className="sr-only">Yetkili Adı Soyadı</label>
                        <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="contactName" type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Yetkili Adı Soyadı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative">
                        <label htmlFor="title" className="sr-only">Firmadaki Görev Tanımı / Unvan</label>
                        <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Firmadaki Görev Tanımı / Unvan" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      {/* İletişim */}
                      <div className="relative">
                        <label htmlFor="email" className="sr-only">Yetkili Kurumsal E-Posta</label>
                        <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Yetkili Kurumsal E-Posta" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative">
                        <label htmlFor="phone" className="sr-only">Yetkili Telefon Numarası</label>
                        <Phone className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="phone" type="tel" pattern="[0-9]{10,11}" name="phone" value={formData.phone} onChange={handleChange} placeholder="Yetkili Telefon Numarası (05XX...)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative col-span-1 sm:col-span-2">
                        <label htmlFor="emp_password" className="sr-only">Şifre Belirleyin</label>
                        <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="emp_password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Şifre Belirleyin (En az 6 karakter)" minLength={6} className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      {/* Logo Yükleme */}
                      <div className="relative col-span-1 sm:col-span-2 mt-2">
                        <label htmlFor="companyLogo" className="block text-[13px] font-bold text-gray-700 mb-2">Firma Logosu Yükle</label>
                        <input id="companyLogo" type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#990000]/10 file:text-[#990000] hover:file:bg-[#990000]/20 transition-all cursor-pointer border border-gray-200 rounded-xl bg-gray-50" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#163B65] hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 group">
                        {isLoading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        Firma Kayıt Talebini Gönder
                      </button>
                    </div>
                  </form>
                </>
              ) : accountType === 'academic' ? (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">İlk Giriş (Şifre Belirleme)</h2>
                  <p className="text-center text-sm text-gray-500 font-medium mb-8">
                    Kurumsal bilgilerinizle akademik hesabınızı oluşturun.
                  </p>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <label htmlFor="academicName" className="sr-only">Ad Soyadı</label>
                        <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="academicName" type="text" name="academicName" value={formData.academicName} onChange={handleChange} placeholder="Ad Soyadı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="academicTitle" className="sr-only">Unvan</label>
                        <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="academicTitle" type="text" name="academicTitle" value={formData.academicTitle} onChange={handleChange} placeholder="Unvan (Prof. Dr., Doç. Dr., vb.)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <label htmlFor="academicEmail" className="sr-only">Kurumsal E-Posta Adresi</label>
                        <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="academicEmail" type="email" name="academicEmail" value={formData.academicEmail} onChange={handleChange} placeholder="Kurumsal E-Posta Adresi (@esenyurt.edu.tr)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative mt-4">
                        <label htmlFor="academicPassword" className="sr-only">Yeni Şifre</label>
                        <KeyRound className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="academicPassword" type="password" name="password" minLength={6} value={formData.password} onChange={handleChange} placeholder="Yeni Şifre (En az 6 karakter)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <label htmlFor="academicPasswordConfirm" className="sr-only">Yeni Şifre Tekrar</label>
                        <KeyRound className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="academicPasswordConfirm" type="password" name="passwordConfirm" minLength={6} value={formData.passwordConfirm} onChange={handleChange} placeholder="Yeni Şifre (Tekrar)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#163B65] hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 group">
                        {isLoading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        Akademik Hesabımı Aktifleştir
                      </button>
                    </div>
                  </form>
                </>
              ) : accountType === 'alumni' ? (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Mezun İlk Giriş (Şifre Belirleme)</h2>
                  <p className="text-center text-sm text-gray-500 font-medium mb-8">
                    Mezuniyet bilgilerinizle hesabınızı oluşturun ve Esenyurt Kariyer Ağına katılın.
                  </p>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <label htmlFor="alumniName" className="sr-only">Ad Soyadı</label>
                        <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="alumniName" type="text" name="alumniName" value={formData.alumniName} onChange={handleChange} placeholder="Ad Soyadı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="alumniId" className="sr-only">Öğrenci Numarası</label>
                        <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="alumniId" type="text" name="alumniId" pattern="[0-9]{9,11}" value={formData.alumniId} onChange={handleChange} placeholder="Öğrenci Numarası (Mezun olduğunuz)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label htmlFor="alumniDepartment" className="sr-only">Mezun Olunan Bölüm</label>
                          <MapPin className="absolute left-4 top-3.5 text-gray-500" size={18} />
                          <input id="alumniDepartment" type="text" name="alumniDepartment" value={formData.alumniDepartment} onChange={handleChange} placeholder="Mezun Olunan Bölüm" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                        </div>
                        <div className="relative">
                          <label htmlFor="graduationYear" className="sr-only">Mezuniyet Yılı</label>
                          <GraduationCap className="absolute left-4 top-3.5 text-gray-500" size={18} />
                          <input id="graduationYear" type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="Mezuniyet Yılı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="alumniEmail" className="sr-only">E-Posta Adresi</label>
                        <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="alumniEmail" type="email" name="alumniEmail" value={formData.alumniEmail} onChange={handleChange} placeholder="E-Posta Adresi" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative mt-4">
                        <label htmlFor="alumniPassword" className="sr-only">Yeni Şifre</label>
                        <KeyRound className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="alumniPassword" type="password" name="password" minLength={6} value={formData.password} onChange={handleChange} placeholder="Yeni Şifre (En az 6 karakter)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <label htmlFor="alumniPasswordConfirm" className="sr-only">Yeni Şifre Tekrar</label>
                        <KeyRound className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="alumniPasswordConfirm" type="password" name="passwordConfirm" minLength={6} value={formData.passwordConfirm} onChange={handleChange} placeholder="Yeni Şifre (Tekrar)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#163B65] hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 group">
                        {isLoading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        Mezun Hesabımı Aktifleştir
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">İlk Giriş (Şifre Belirleme)</h2>
                  <p className="text-center text-sm text-gray-500 font-medium mb-8">
                    Öğrenci numaranız ve bilgilerinizle kayıt oluşturun.
                  </p>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <label htmlFor="studentName" className="sr-only">Ad Soyadı</label>
                        <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="studentName" type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Ad Soyadı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="studentId" className="sr-only">Öğrenci Numarası</label>
                        <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="studentId" type="text" name="studentId" pattern="[0-9]{9,11}" value={formData.studentId} onChange={handleChange} placeholder="Öğrenci Numarası (9-11 hane)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <label htmlFor="studentEmail" className="sr-only">E-Posta Adresi</label>
                        <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="studentEmail" type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} placeholder="E-Posta Adresi" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative mt-4">
                        <label htmlFor="studentPassword" className="sr-only">Yeni Şifre</label>
                        <KeyRound className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="studentPassword" type="password" name="password" minLength={6} value={formData.password} onChange={handleChange} placeholder="Yeni Şifre (En az 6 karakter)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <label htmlFor="studentPasswordConfirm" className="sr-only">Yeni Şifre Tekrar</label>
                        <KeyRound className="absolute left-4 top-3.5 text-gray-500" size={18} />
                        <input id="studentPasswordConfirm" type="password" name="passwordConfirm" minLength={6} value={formData.passwordConfirm} onChange={handleChange} placeholder="Yeni Şifre (Tekrar)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-blue/30 outline-none text-[14px]" required />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#990000] text-white font-bold py-3.5 px-4 rounded-xl hover:bg-[#163B65] hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 group">
                        {isLoading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        Öğrenci Hesabımı Oluştur
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-gray-900 mb-2">İşlem Başarılı!</h2>
              <p className="text-gray-500 font-medium mb-8">
                {accountType === 'employer' 
                  ? "Firma kayıt talebiniz Kariyer Geliştirme Merkezine başarıyla iletilmiştir. Bilgileriniz incelendikten sonra hesabınız aktif edilecek ve e-posta adresinize bilgilendirme yapılacaktır."
                  : accountType === 'academic'
                  ? "Akademik hesabınız başarıyla oluşturuldu ve şifreniz belirlendi. Artık kurumsal e-postanız ve şifrenizle giriş yapabilirsiniz."
                  : accountType === 'alumni'
                  ? "Mezun hesabınız başarıyla oluşturuldu ve şifreniz belirlendi. Aramıza tekrar hoş geldiniz, artık giriş yapabilirsiniz."
                  : "Öğrenci hesabınız başarıyla oluşturuldu ve şifreniz belirlendi. Artık öğrenci numaranız ve şifrenizle giriş yapabilirsiniz."}
              </p>
              <button 
                onClick={() => setView('login')}
                className="inline-flex items-center justify-center bg-gray-900 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-black transition-all shadow-lg active:scale-[0.98]"
              >
                Giriş Ekranına Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

