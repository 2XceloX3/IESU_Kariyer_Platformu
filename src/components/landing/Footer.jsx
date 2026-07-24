import React, { useState } from 'react';
import { ChevronRight, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function Footer({ setSelectedItem, legalData, setView }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if(email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-iesu-primary py-16 relative overflow-hidden">
      {/* Abstract Background Waves */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg className="absolute w-[150%] h-[150%] -top-[20%] -left-[10%] opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,50 C20,70 40,30 60,60 C80,90 100,50 100,50 L100,100 L0,100 Z" fill="#ffffff" />
        </svg>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-2 rounded-xl flex items-center justify-center shadow-sm">
                <img src="/iesu-logo.svg" alt="İESÜ" className="h-10 w-auto" />
              </div>
            </div>
            <p className="text-[14px] text-red-50 leading-relaxed mb-6 font-medium">
              İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi olarak amacımız; öğrencilerimizi ve mezunlarımızı; kişisel farkındalığı yüksek, gelişmeleri yakından takip eden, kurumsal ve toplumsal gelişime katma değer yaratan bireyler olmaları yönünde desteklemektir.
            </p>
            <div className="flex gap-3">
              <a href="https://tr-tr.facebook.com/iesuedu/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/iguiesu/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="https://www.youtube.com/@IesuUniversitesi" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://www.linkedin.com/school/iesuedu/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white flex items-center justify-center text-white hover:text-iesu-primary transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-iesu-accent"></span> Hızlı Bağlantılar</h3>
            <ul className="space-y-3 font-medium text-[14px]">
              <li><a href="https://obs.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-iesu-accent hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Öğrenci Bilgi Sistemi (OBS)</a></li>
              <li><a href="https://eslms.esenyurt.edu.tr/almsp" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-iesu-accent hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> İESÜZEM (Uzaktan Eğitim)</a></li>
              <li><a href="https://kutuphane.esenyurt.edu.tr/" target="_blank" rel="noopener noreferrer" className="text-red-100 hover:text-iesu-accent hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Merkez Kütüphane</a></li>
              <li><button onClick={() => setView('staj')} className="text-red-100 hover:text-iesu-accent hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> Gönüllü Staj Süreçleri</button></li>
              <li><button onClick={() => setView('sem')} className="text-red-100 hover:text-iesu-accent hover:translate-x-1 transition-all flex items-center gap-2"><ChevronRight size={14} /> SEM (Sürekli Eğitim Merkezi)</button></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col">
            <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-iesu-accent"></span> İletişim Bilgileri</h3>
            <ul className="space-y-4 font-medium text-[14px] text-red-50">
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg mt-0.5"><Mail size={16} className="text-white" /></div>
                <div>
                  <span className="block text-[11px] text-red-200 uppercase tracking-wider font-bold mb-0.5">E-Posta</span>
                  <a href="mailto:kariyer@esenyurt.edu.tr" className="hover:text-iesu-accent transition">kariyer@esenyurt.edu.tr</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                <div>
                  <span className="block text-[11px] text-red-200 uppercase tracking-wider font-bold mb-0.5">Telefon</span>
                  <a href="tel:+902124227000" className="hover:text-iesu-accent transition">0 (212) 422 70 00</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-lg mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div>
                  <span className="block text-[11px] text-red-200 uppercase tracking-wider font-bold mb-0.5">Adres</span>
                  <a href="https://maps.app.goo.gl/9QZJ2jXvP" target="_blank" rel="noopener noreferrer" className="hover:text-iesu-accent transition leading-snug">Cihangir Mah. Şehit Jandarma Komando Er Hakan Öner Sk. No:1 Avcılar / İSTANBUL</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <h3 className="text-[16px] font-black text-white mb-2">E-Bülten'e Kayıt Olun</h3>
              <p className="text-[13px] text-red-100 mb-5 leading-snug">Sektör buluşmaları, yeni staj programları ve duyurulardan ilk siz haberdar olun.</p>
              {isSubscribed ? (
                <div className="bg-green-500/20 border border-green-400/50 text-green-100 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-300" />
                  <p className="text-sm font-bold">Kayıt Başarılı! Aramıza hoş geldiniz.</p>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={handleSubscribe}>
                  <div className="relative">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta adresiniz..." className="w-full bg-white/10 border border-white/30 rounded-xl pl-4 pr-12 py-3 text-[14px] text-white placeholder-red-200 focus:outline-none focus:bg-white/20 transition" required />
                    <button aria-label="İşlem Butonu" type="submit" className="absolute right-1 top-1 bottom-1 bg-white text-iesu-primary px-3 rounded-lg hover:bg-gray-100 transition flex items-center justify-center shadow-sm">
                      <ArrowRight size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="flex items-start gap-2 text-[11px]">
                    <input type="checkbox" id="newsletter-kvkk" className="mt-0.5" required />
                    <label htmlFor="newsletter-kvkk" className="text-red-100 cursor-pointer leading-tight">
                      <button type="button" onClick={(e) => { e.preventDefault(); setSelectedItem(legalData.kvkk); }} className="underline font-bold hover:text-white">Aydınlatma Metni</button>'ni okudum, onaylıyorum.
                    </label>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
        
        {/* Copyright Row */}
        <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-red-200 font-medium tracking-wide">2026 © İstanbul Esenyurt Üniversitesi Bilgi İşlem Daire Başkanlığı tarafından hazırlanmıştır.</p>
          <div className="flex gap-6 text-[13px] text-red-200 font-medium">
            <button onClick={() => setSelectedItem(legalData.gizlilik)} className="hover:text-white transition cursor-pointer">Gizlilik Politikası</button>
            <button onClick={() => setSelectedItem(legalData.kullanim)} className="hover:text-white transition cursor-pointer">Kullanım Koşulları</button>
            <button onClick={() => setSelectedItem(legalData.kvkk)} className="hover:text-white transition cursor-pointer">KVKK</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
