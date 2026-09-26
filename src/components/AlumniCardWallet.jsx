import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ArrowLeft, Download, ShieldCheck, CreditCard, Gift, Coffee, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

export default function AlumniCardWallet({ setView, currentUser, userRole = 'alumni', setSelectedUserId }) {
  const [flipped, setFlipped] = useState(false);

  const handleBack = () => {
    const store = useAppStore.getState();
    if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
    if (setView) setView('alumni');
    else window.history.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-32">
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-2xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack} 
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#059669] transition cursor-pointer shadow-2xs shrink-0"
            title="Mezun Akışına Dön"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <Logo color="emerald" className="h-8 w-auto text-[#059669]" />
            <div className="hidden sm:block">
              <h1 className="font-black text-[#059669] leading-tight">Dijital Mezun Kartı</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">İESÜ Mezunlar Derneği</p>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole="alumni" setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 lg:p-8 flex flex-col items-center">
        
        <div className="text-center mb-10 mt-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#059669] mx-auto mb-4 border border-emerald-100 shadow-sm">
            <CreditCard size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Sanal Mezun Kartınız Hazır</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Kampüs içi imkanlardan, kütüphane erişiminden ve anlaşmalı kurumsal markalardaki mezun indirimlerinden faydalanmak için kartınızı okutun.
          </p>
        </div>

        {/* 3D Flippable Card */}
        <div 
          className="relative w-full max-w-sm aspect-[1.586/1] cursor-pointer perspective-1000 mb-10"
          onClick={() => setFlipped(!flipped)}
        >
          <motion.div
            className="w-full h-full relative preserve-3d transition-all duration-500"
            animate={{ rotateY: flipped ? 180 : 0 }}
          >
            {/* FRONT FACE (Prestigious Emerald Gradient) */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-[#059669] to-emerald-900 text-white p-6 shadow-2xl border border-white/20 overflow-hidden flex flex-col justify-between">
              {/* Abstract waves */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <Logo color="emerald" className="h-8 text-white filter brightness-0 invert opacity-95 mb-1" />
                  <p className="text-[8px] tracking-[0.25em] font-black text-emerald-200 uppercase">İESÜ MEZUNLAR DERNEĞİ</p>
                </div>
                <div className="bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={16} className="text-emerald-300" />
                  <span className="text-[10px] font-black tracking-wide uppercase text-white">Aktif Üye</span>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-xs font-mono font-bold text-emerald-200/90 mb-1 tracking-wider">KART NO: 9845 2311 0048</p>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{currentUser?.name || 'Caner Öztürk'}</h3>
                <p className="text-xs text-emerald-100/80 mt-0.5">{currentUser?.department || 'Yazılım Mühendisliği'} • {currentUser?.graduationYear || '2023'} Mezunu</p>
              </div>
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-white text-gray-900 p-6 shadow-2xl border border-gray-200 overflow-hidden flex flex-col justify-between rotate-y-180">
              <div className="w-full h-10 bg-slate-900 -mx-6 mt-2 mb-3" />
              
              <div className="flex justify-between items-end pb-2">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Geçerlilik Statüsü</p>
                  <p className="font-extrabold text-sm text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={15} /> Ömür Boyu Aktif
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">Doğrulama: iesu.edu.tr/verify</p>
                </div>
                <div className="bg-white p-2 border border-gray-200 rounded-2xl shadow-sm">
                  {/* QR Pattern */}
                  <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-16 h-16 bg-black p-1 rounded-lg">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={`bg-white ${[0, 2, 3, 5, 8, 10, 12, 15].includes(i) ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="text-xs font-bold text-gray-400 mb-8 flex items-center gap-1">
          <Sparkles size={14} className="text-emerald-600" /> Kartın arkasını görüntülemek için kartın üzerine dokunun
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mb-12">
          <button 
            onClick={() => window.toast?.success?.("Apple Wallet kart geçişi hazırlandı.")}
            className="flex-1 bg-black text-white px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg shadow-black/20 cursor-pointer"
          >
            Apple Wallet Ekle
          </button>
          <button 
            onClick={() => window.toast?.success?.("Google Pay kart geçişi hazırlandı.")}
            className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 cursor-pointer"
          >
            Google Pay Ekle
          </button>
        </div>

        <div className="w-full max-w-3xl">
          <h3 className="text-lg font-black text-gray-900 mb-4">Mezun Kart Ayrıcalıkları</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition">
              <div className="bg-emerald-50 text-[#059669] p-3 rounded-xl border border-emerald-100"><Coffee size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Kampüs Kafeleri</h4>
                <p className="text-xs text-gray-500 mt-1">%20 Mezun İndirimi</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition">
              <div className="bg-teal-50 text-teal-600 p-3 rounded-xl border border-teal-100"><BookOpen size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Merkez Kütüphane</h4>
                <p className="text-xs text-gray-500 mt-1">Ömür Boyu Dijital & Fiziksel Erişim</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-xl border border-purple-100"><Gift size={20} /></div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Anlaşmalı Markalar</h4>
                <p className="text-xs text-gray-500 mt-1">Özel İndirim ve Kampanyalar</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs w-full">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-100 text-[#059669]">
              <Sparkles size={28} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-base font-black text-emerald-950 mb-1">Mezun Kart Asistanı</h4>
              <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                Mezuniyet alanınıza ve sektörel çalışma profilinize uygun kurumsal indirim anlaşmalarını ve ayrıcalıkları analiz edebilirim.
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.toast && window.toast.info("Mezun profil verileriniz analiz ediliyor...");
                setTimeout(() => {
                  window.toast && window.toast.success("💡 Öneri: 'Teknoloji & Yazılım' iş ortaklıklarında geçerli %15 mezun indirimi kartınıza tanımlandı.");
                }, 1500);
              }}
              className="bg-[#059669] hover:bg-emerald-700 text-white font-black text-xs px-6 py-3 rounded-2xl transition shadow-lg shadow-emerald-700/25 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
            >
              Bana Özel Fırsat Bul
            </button>
          </div>
        </div>

      </main>

      {/* Floating Bottom Navigation Dock for Alumni Hive */}
      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole="alumni"
        activeTab="alumni_card"
      />
    </div>
  );
}
