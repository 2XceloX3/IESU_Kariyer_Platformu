import React, { useState } from 'react';
import { ChevronRight, Calendar, ArrowRight, Mail, Menu } from 'lucide-react';

export default function LandingPage({ setView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 animate-fade-in">
      {/* Top Bar - Contact Info */}
      <div className="bg-iesu-red text-white text-[13px] py-2 px-4 hidden md:flex justify-between items-center w-full">
        <div className="flex gap-6 max-w-7xl mx-auto w-full justify-between font-medium">
          <div className="flex gap-6">
            <span>T: +90 (212) 699 09 90</span>
            <span>E: info@esenyurt.edu.tr</span>
          </div>
          <div className="flex gap-6">
            <a href="https://obs.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition-colors duration-300">Öğrenci Bilgi Sistemi</a>
            <a href="#" className="hover:text-red-200 transition-colors duration-300">İletişim</a>
          </div>
        </div>
      </div>

      {/* Main Header & Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-4 border-iesu-coral">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Official High-Res Logo */}
            <img 
              src="https://www.esenyurt.edu.tr/uploads/2024/06/emyjxq7cgdfy4-esenyurt-universitesi-logo.png" 
              alt="İESÜ Logo" 
              className="h-14 md:h-16 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-[1.35rem] font-extrabold text-gray-900 leading-tight tracking-tight">İSTANBUL ESENYURT ÜNİVERSİTESİ</h1>
              <p className="text-[13px] text-iesu-coral font-bold uppercase tracking-wide mt-0.5">Kariyer Geliştirme Ofisi Koordinatörlüğü</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-bold text-gray-700">
            <a href="#" className="text-iesu-red border-b-2 border-iesu-red pb-1 transition-all duration-300">Ana Sayfa</a>
            <a href="#" className="hover:text-iesu-coral transition-colors duration-300">Hakkımızda</a>
            <a href="#" className="hover:text-iesu-coral transition-colors duration-300">Organizasyon Şeması</a>
            <a href="#" className="hover:text-iesu-coral transition-colors duration-300">İş ve Staj</a>
            <button 
              onClick={() => setView('login')}
              className="ml-2 bg-iesu-red text-white px-6 py-2.5 rounded-full hover:bg-iesu-darkRed hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow flex items-center gap-2 border border-transparent hover:border-red-300"
            >
              Portala Giriş <ArrowRight size={18} />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-iesu-red hover:scale-110 transition-transform duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={32} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b-4 border-iesu-coral p-4 flex flex-col gap-4 shadow-xl absolute w-full z-40 animate-fade-in">
          <a href="#" className="text-iesu-red font-bold text-[15px] hover:translate-x-1 transition-transform duration-300">Ana Sayfa</a>
          <a href="#" className="text-gray-700 font-semibold hover:text-iesu-coral text-[15px] hover:translate-x-1 transition-all duration-300">Hakkımızda</a>
          <a href="#" className="text-gray-700 font-semibold hover:text-iesu-coral text-[15px] hover:translate-x-1 transition-all duration-300">İş ve Staj</a>
          <button onClick={() => setView('login')} className="bg-iesu-red text-white font-bold px-4 py-3 rounded-lg w-full mt-2 shadow hover:shadow-lg hover:bg-iesu-darkRed transition-all duration-300">Portala Giriş</button>
        </div>
      )}

      {/* Hero Slider Area */}
      <section className="relative h-[400px] md:h-[480px] bg-iesu-red overflow-hidden">
        <img 
          src="https://www.esenyurt.edu.tr/uploads/2026/01/7vnjt36bkvvot-2026-ulusal-staj.PNG" 
          alt="2026 Ulusal Staj" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-iesu-darkRed/95 to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start">
          <span className="inline-block px-4 py-1.5 bg-white text-iesu-red text-[13px] font-extrabold rounded-full mb-5 uppercase tracking-wider shadow-sm">Öne Çıkan Kariyer Fırsatı</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 max-w-2xl leading-tight drop-shadow-md animate-fade-in-up">2026 Ulusal Staj Programı Başvuruları Başladı</h2>
          <button className="bg-iesu-coral text-white border-2 border-white px-7 py-3 rounded-full font-bold text-[15px] hover:bg-white hover:text-iesu-red hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center gap-2 shadow-lg group">
            Detayları İncele <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* 3-Column Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Haberler */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="w-3 h-7 bg-iesu-red rounded-sm"></span> Haberler
              </h3>
              <a href="#" className="text-[14px] font-bold text-iesu-coral hover:text-iesu-red transition">Tüm Haberler</a>
            </div>
            <div className="space-y-6 flex-grow">
              {/* Haber 1 */}
              <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="h-44 bg-gray-200 overflow-hidden relative">
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-iesu-red text-[13px] font-bold px-3 py-1 rounded-full z-10 shadow-sm">01/07/2026</div>
                  <img src="https://www.esenyurt.edu.tr/uploads/2026/07/hzzl9zmqxgrc0--20.jpg" alt="Mezuniyet" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <div className="p-5">
                  <h4 className="font-extrabold text-[16px] text-gray-900 mb-2 group-hover:text-iesu-red transition-colors duration-300 line-clamp-2 leading-snug">İstanbul Esenyurt Üniversitesi 2025–2026 Akademik Yılı Mezuniyet Töreni Büyük Bir Coşkuyla Gerçekleşti!</h4>
                  <span className="text-[14px] text-iesu-coral font-bold flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300 mt-3">Devamını Oku <ArrowRight size={16} /></span>
                </div>
              </div>
              
              {/* Haber 2 */}
              <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 flex">
                <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-200 overflow-hidden relative">
                  <img src="https://www.esenyurt.edu.tr/uploads/2026/06/x8tmt8wmcq3wt--19.jpg" alt="News" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <p className="text-[13px] font-bold text-gray-400 mb-1">21/06/2026</p>
                  <h4 className="font-extrabold text-[15px] text-gray-900 group-hover:text-iesu-red transition-colors duration-300 line-clamp-2 leading-snug">Babalar gününüz kutlu olsun!</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Duyurular */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="w-3 h-7 bg-iesu-coral rounded-sm"></span> Duyurular
              </h3>
              <a href="#" className="text-[14px] font-bold text-iesu-coral hover:text-iesu-red transition">Tüm Duyurular</a>
            </div>
            <div className="bg-red-50/50 rounded-2xl p-2 border border-red-50 flex-grow">
              {[
                { date: "24", month: "HAZ", title: "2025-2026 Yaz Okulu Başvuruları Başladı!", desc: "Detaylı bilgi için tıklayınız..." },
                { date: "19", month: "HAZ", title: "2026-2027 Güz Dönemi Yüksek Lisans ve Doktora Başvuruları BAŞLADI!", desc: "Akademik kariyerinize İESÜ ile adım atın." },
                { date: "15", month: "HAZ", title: "2025-2026 Eğitim Öğretim Yılı Bahar Dönemi Final Sınav Programları", desc: "Sınav takvimi yayınlanmıştır." }
              ]?.map((item, i) => (
                <div key={i} className="flex gap-4 p-4 hover:bg-white rounded-xl transition-all duration-300 cursor-pointer border-b border-red-50 last:border-0 group hover:-translate-y-1 hover:shadow-md mb-2">
                  <div className="flex flex-col items-center justify-center min-w-[56px] bg-white rounded-lg shadow-sm group-hover:bg-iesu-red transition-colors duration-300 p-2">
                    <span className="text-xl font-black text-iesu-red group-hover:text-white transition-colors duration-300 leading-none">{item.date}</span>
                    <span className="text-[11px] font-bold text-gray-500 group-hover:text-red-100 transition-colors duration-300 uppercase tracking-widest mt-1">{item.month}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-[15px] text-gray-900 group-hover:text-iesu-red transition-colors duration-300 leading-snug mb-1">{item.title}</h4>
                    <p className="text-[13px] text-gray-500 line-clamp-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Etkinlikler */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 pb-3 border-b-2 border-gray-100">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                <span className="w-3 h-7 bg-gray-900 rounded-sm"></span> Etkinlikler
              </h3>
              <a href="#" className="text-[14px] font-bold text-iesu-coral hover:text-iesu-red transition">Tüm Etkinlikler</a>
            </div>
            <div className="space-y-4 flex-grow">
              {[
                { date: "11 MAYIS | 11:00", title: "İESU BAHAR ŞENLİĞİ 26’ BAŞLIYOR", img: "https://www.esenyurt.edu.tr/uploads/2026/06/1hh79tp8rgliu-iesu-bahar-senligi-26'-basliyor.jpeg" },
                { date: "18 MAYIS | 11:00", title: "Mezunlarımızla Söyleşi Serisi Başlıyor!", img: "https://www.esenyurt.edu.tr/uploads/2026/06/x124bn4cr3rmz-mezunlarimizla-soylesi-serisi-basliyor.jpeg" },
                { date: "28 HAZİRAN | 14:00", title: "Üniversite Hayatınızı Gururla Taçlandırma Vakti Geldi!", img: "https://www.esenyurt.edu.tr/uploads/2026/07/quyp1ceryua96-buyuk-bir-emek-ve-ozveriyle-tamamladiginiz-universite-hayatinizi-gururla-taclandirma-vakti-geldi.jpg" }
              ]?.map((item, index) => (
                <div key={index} className="flex bg-white rounded-xl shadow border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-28 sm:w-36 flex-shrink-0 bg-gray-200 relative overflow-hidden">
                    <img src={item.img} alt="Event" className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[12px] text-iesu-coral font-black mb-1.5 tracking-wide">
                      <Calendar size={13} className="text-iesu-red group-hover:scale-110 transition-transform duration-300" /> {item.date}
                    </div>
                    <h4 className="font-extrabold text-[14px] text-gray-900 line-clamp-2 group-hover:text-iesu-red transition-colors duration-300 leading-snug">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter & Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-[6px] border-iesu-red relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-iesu-red rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white p-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                 <img 
                  src="https://www.esenyurt.edu.tr/uploads/2024/06/emyjxq7cgdfy4-esenyurt-universitesi-logo.png" 
                  alt="İESÜ Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Kariyer Geliştirme Ofisi</h2>
                <p className="text-iesu-coral font-bold text-[14px]">İstanbul Esenyurt Üniversitesi</p>
              </div>
            </div>
            <p className="text-[14.5px] text-gray-400 max-w-md leading-relaxed border-l-2 border-iesu-red pl-4">
              Öğrencilerimizin kariyer planlamalarına destek olmak ve iş dünyası ile aralarında köprü kurmak amacıyla hizmet vermekteyiz. Geleceğinize giden yolda yanınızdayız.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-iesu-red opacity-10">
              <Mail size={120} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 relative z-10">E-Bülten'e Kayıt Olun</h3>
            <p className="text-[14px] text-gray-400 mb-6 relative z-10">Yeni etkinliklerden, iş ve staj ilanlarından anında haberdar olun.</p>
            
            <form className="space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="email" placeholder="E-posta adresiniz..." className="flex-grow bg-gray-800/80 border border-gray-600 rounded-xl px-4 py-3 text-[15px] text-white focus:outline-none focus:border-iesu-coral focus:ring-1 focus:ring-iesu-coral transition-all shadow-inner" />
                <button className="bg-iesu-red hover:bg-iesu-darkRed hover:-translate-y-0.5 text-white px-8 py-3 rounded-xl font-bold text-[15px] transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap">Abone Ol</button>
              </div>
              <div className="flex items-start gap-3 text-[13px] bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <input type="checkbox" id="kvkk" className="mt-0.5 w-4 h-4 rounded border-gray-500 text-iesu-red focus:ring-iesu-red bg-gray-700" required />
                <label htmlFor="kvkk" className="text-gray-400 cursor-pointer leading-tight">
                  <span className="text-gray-300 font-semibold hover:text-white transition">Kariyer Merkezi Aydınlatma Metni</span>'ni okudum ve kampanya, etkinlik ve bülten e-postaları almayı onaylıyorum.
                </label>
              </div>
            </form>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-gray-500 font-medium">© 2026 İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Ofisi.</p>
          <div className="flex gap-6 text-[13px] text-gray-500 font-medium">
            <a href="#" className="hover:text-white transition">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition">Kullanım Koşulları</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
