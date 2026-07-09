import React, { useState } from 'react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, User, FileText, CheckCircle2, GraduationCap, KeyRound } from 'lucide-react';
import Logo from './Logo';

export default function Register({ setView, setCurrentUser, setStudents, setCompanies, setUserRole }) {
  const [step, setStep] = useState(1); // 1: Info, 2: Success
  const [accountType, setAccountType] = useState('student'); // 'student' or 'employer'

  // Form State
  const [formData, setFormData] = useState({
    companyName: '', website: '', contactName: '', title: '', email: '', phone: '',
    studentName: '', studentId: '', studentEmail: '', password: '', passwordConfirm: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountType === 'student') {
      if (formData.password !== formData.passwordConfirm) {
        alert("Şifreler eşleşmiyor! Lütfen kontrol edin.");
        return;
      }
      if (formData.password.length < 6) {
        alert("Şifre en az 6 karakter olmalıdır.");
        return;
      }
      const newStudent = {
        id: 'STD-' + Date.now(),
        name: formData.studentName || 'Yeni Öğrenci',
        studentId: formData.studentId,
        email: formData.studentEmail,
        department: 'Belirtilmedi',
        role: 'student',
        grade: 'Aktif',
        password: formData.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.studentName || 'Öğrenci')}&background=132A49&color=fff`,
        onboardingCompleted: false
      };
      if (setStudents) setStudents(prev => [...(prev || []), newStudent]);
      if (setCurrentUser) setCurrentUser(newStudent);
      if (setUserRole) setUserRole('student');
    } else {
      const newCompany = {
        id: 'CMP-' + Date.now(),
        name: formData.companyName,
        username: formData.email, // using email as username
        email: formData.email,
        phone: formData.phone,
        contactName: formData.contactName,
        title: formData.title,
        website: formData.website,
        sector: 'Belirtilmedi',
        role: 'employer',
        status: 'Onay Bekliyor',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.companyName)}&background=8B5CF6&color=fff`,
      };
      if (setCompanies) setCompanies(prev => [...(prev || []), newCompany]);
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-gray-900 py-10">
      {/* Background */}
      <img 
        src="https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow fixed"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-iesu-red/80 via-gray-900/80 to-gray-900/90 mix-blend-multiply fixed"></div>
      
      <button 
        onClick={() => setView('login')} 
        className="absolute top-8 left-8 text-white/70 hover:text-white flex items-center gap-2 font-bold transition-all z-20 hover:-translate-x-1"
      >
        <ArrowLeft size={20} /> <span className="hidden sm:block">Giriş Ekranına Dön</span>
      </button>

      <div className="relative z-10 w-full max-w-2xl p-4 sm:p-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-iesu-red via-iesu-coral to-iesu-red"></div>

          {step === 1 ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setAccountType('student')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${accountType === 'student' ? 'bg-white text-iesu-red shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <GraduationCap size={18} /> Öğrenci Numarası ile Kayıt
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAccountType('employer')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${accountType === 'employer' ? 'bg-white text-iesu-red shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
                        <Building2 className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Şirket / Kurum Adı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative col-span-1 sm:col-span-2">
                        <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="Şirket Web Sayfası / İletişim URL" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>

                      {/* Yetkili Kişi & Unvan */}
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Yetkili Adı Soyadı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Firmadaki Görev Tanımı / Unvan" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>

                      {/* İletişim */}
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Yetkili Kurumsal E-Posta" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="tel" pattern="[0-9]{10,11}" name="phone" value={formData.phone} onChange={handleChange} placeholder="Yetkili Telefon Numarası (05XX...)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>

                      {/* Logo Yükleme */}
                      <div className="relative col-span-1 sm:col-span-2 mt-2">
                        <label className="block text-[13px] font-bold text-gray-700 mb-2">Firma Logosu Yükle</label>
                        <input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-iesu-red/10 file:text-iesu-red hover:file:bg-iesu-red/20 transition-all cursor-pointer border border-gray-200 rounded-xl bg-gray-50" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full flex items-center justify-center bg-iesu-red text-white font-bold py-3.5 px-4 rounded-xl hover:bg-iesu-darkRed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                        Firma Kayıt Talebini Gönder
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
                        <User className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Ad Soyadı" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>
                      
                      <div className="relative">
                        <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="text" name="studentId" pattern="[0-9]{9,11}" value={formData.studentId} onChange={handleChange} placeholder="Öğrenci Numarası (9-11 hane)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} placeholder="E-Posta Adresi" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative mt-4">
                        <KeyRound className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="password" name="password" minLength={6} value={formData.password} onChange={handleChange} placeholder="Yeni Şifre (En az 6 karakter)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>

                      <div className="relative">
                        <KeyRound className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input type="password" name="passwordConfirm" minLength={6} value={formData.passwordConfirm} onChange={handleChange} placeholder="Yeni Şifre (Tekrar)" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-iesu-coral/30 outline-none text-[14px]" required />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full flex items-center justify-center bg-iesu-red text-white font-bold py-3.5 px-4 rounded-xl hover:bg-iesu-darkRed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
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
                  ? "Firma kayıt talebiniz Kariyer Geliştirme Ofisine başarıyla iletilmiştir. Bilgileriniz incelendikten sonra hesabınız aktif edilecek ve e-posta adresinize bilgilendirme yapılacaktır."
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
