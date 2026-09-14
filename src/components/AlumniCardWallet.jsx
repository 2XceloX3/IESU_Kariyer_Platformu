import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ChevronLeft, Download, ShieldCheck, CreditCard, Gift, Coffee, BookOpen } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import useAppStore from '../store/useAppStore';

export default function AlumniCardWallet({ setView, currentUser, userRole, setSelectedUserId }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-[#990000]" />
            <div className="hidden sm:block">
              <h1 className="font-black text-[#990000] leading-tight">Dijital Mezun Kartı</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">İESÜ Mezunlar Derneği</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 lg:p-8 flex flex-col items-center">
        
        <div className="text-center mb-10 mt-6">
          <div className="w-16 h-16 bg-[#990000]/10 rounded-2xl flex items-center justify-center text-[#990000] mx-auto mb-4">
            <CreditCard size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Sanal Cüzdanınız Hazır</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Kampüs içi imkanlardan ve anlaşmalı markalardaki indirimlerden faydalanmak için kartınızı okutun.
          </p>
        </div>

        {/* 3D Flippable Card */}
        <div 
          className="relative w-full max-w-sm aspect-[1.586/1] cursor-pointer perspective-1000 mb-12"
          onClick={() => setFlipped(!flipped)}
        >
          <motion.div
            className="w-full h-full relative preserve-3d transition-all duration-500"
            animate={{ rotateY: flipped ? 180 : 0 }}
          >
            {/* FRONT FACE */}
            <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-[#990000] to-red-900 text-white p-6 shadow-2xl border border-white/10 overflow-hidden flex flex-col justify-between">
              {/* Abstract waves */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <Logo className="h-8 text-white filter brightness-0 invert opacity-90 mb-1" />
                  <p className="text-[8px] tracking-[0.2em] font-bold text-white/70 uppercase">Mezunlar Derneği</p>
                </div>
                <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
                  <ShieldCheck size={20} className="text-emerald-400" />
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-sm text-red-200 mb-1">Mezun ID: 9845 2311 0048</p>
                <h3 className="text-2xl font-black tracking-tight">{currentUser?.name || 'Değerli Mezunumuz'}</h3>
                <p className="text-xs text-red-300 mt-1">{currentUser?.department || 'İstanbul Esenyurt Üniversitesi'}</p>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 backface-hidden rounded-2xl bg-white text-gray-900 p-6 shadow-2xl border border-gray-200 overflow-hidden flex flex-col justify-between rotate-y-180">
              <div className="w-full h-12 bg-gray-100 -mx-6 mt-4 mb-4" />
              
              <div className="flex justify-between items-end pb-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Geçerlilik</p>
                  <p className="font-bold">Ömür Boyu</p>
                </div>
                <div className="bg-white p-2 border border-gray-100 rounded-xl shadow-sm">
                  {/* Fake QR */}
                  <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-16 h-16 bg-black p-1">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mb-12">
          <button className="flex-1 bg-black text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg shadow-black/20">
            Apple Wallet
          </button>
          <button className="flex-1 bg-black text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg shadow-black/20">
             Google Pay
          </button>
        </div>

        <div className="w-full max-w-3xl">
          <h3 className="text-lg font-black text-gray-900 mb-6">Ayrıcalıklar</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><Coffee size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Esenyurt Kafe</h4>
                <p className="text-xs text-gray-500 mt-1">%20 İndirim</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-red-50 text-red-600 p-3 rounded-xl"><BookOpen size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Kütüphane</h4>
                <p className="text-xs text-gray-500 mt-1">Ömür Boyu Erişim</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-xl"><Gift size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Boyner</h4>
                <p className="text-xs text-gray-500 mt-1">Kasa İndirimi</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm w-full">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-indigo-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M12 2v20"></path><path d="m17 5-5-3-5 3v14l5 3 5-3V5z"></path></svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-lg font-black text-indigo-950 mb-1">Dijital Cüzdan Asistanı</h4>
              <p className="text-sm text-indigo-800 font-medium leading-relaxed">
                Harcama ve kampüs kullanım alışkanlıklarınıza göre size özel tanımlanabilecek yeni indirim anlaşmalarını analiz edebilirim.
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.toast && window.toast.info("Profil verileriniz analiz ediliyor...");
                setTimeout(() => {
                  window.toast && window.toast.success("💡 Öneri: 'Teknoloji Marketleri' kampanyaları profilinize çok uygun! Size özel %15 indirim kodu tanımlandı.");
                }, 2500);
              }}
              className="bg-red-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-red-600/30 whitespace-nowrap"
            >
              Bana Özel Fırsat Bul
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
