import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Award, BookOpen, Zap, ShieldCheck, TrendingUp, History, 
  ChevronLeft, CreditCard, Star, FileText, CheckCircle2, FileSignature, X
} from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const VERIFIED_SKILLS = [
  { id: 1, type: 'course', amount: 'Tamamlandı', desc: 'İleri Seviye Veri Analizi Eğitimi', date: 'Bugün, 14:30', icon: <BookOpen size={16}/> },
  { id: 2, type: 'achievement', amount: 'Onaylandı', desc: 'İESÜ Kariyer Zirvesi 2026 Katılımı', date: 'Dün, 09:15', icon: <Award size={16}/> },
  { id: 3, type: 'mentor', amount: 'Tamamlandı', desc: 'Sektör Lideri ile Mentorluk Seansı', date: '12 Eki, 16:00', icon: <Zap size={16}/> },
  { id: 4, type: 'certificate', amount: 'Doğrulandı', desc: 'Girişimcilik ve İnovasyon Sertifikası', date: '10 Eki, 18:45', icon: <ShieldCheck size={16}/> },
];

const CERTIFICATES = [
  { id: 1, name: 'Google Proje Yönetimi', issuer: 'Google (Coursera)', icon: 'G', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: 2, name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', icon: 'AWS', color: 'bg-orange-50 text-orange-500 border-orange-100' },
  { id: 3, name: 'Agile Metodolojileri', issuer: 'İESÜ SEM', icon: 'SEM', color: 'bg-slate-900 text-white border-slate-800' },
  { id: 4, name: 'Liderlik ve Yönetim', issuer: 'LinkedIn Learning', icon: 'in', color: 'bg-sky-50 text-sky-600 border-sky-100' },
];

export default function IesuWallet({ setView, currentUser, userRole, setSelectedUserId }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [readinessScore, setReadinessScore] = useState(80);

  const handleRunAnalysis = () => {
    window.toast && window.toast.info("AI: Blockchain üzerindeki sertifikalarınız analiz ediliyor...");
    setTimeout(() => {
      setReadinessScore(88);
      window.toast && window.toast.success("✅ Analiz Tamamlandı: Sektöre hazırlık endeksiniz %88 olarak güncellendi.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Wallet className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight">Yetkinlik Cüzdanı</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Wallet Balance Hero */}
        <div className="bg-slate-950 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-indigo-600/10 skew-x-12 transform origin-bottom pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left max-w-xl">
            <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center justify-center md:justify-start gap-2 bg-indigo-950/50 w-fit px-3 py-1.5 rounded-full border border-indigo-900/30">
              <ShieldCheck size={14} /> Doğrulanmış Profil Analizi
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
              Kariyer Yolculuğunuz <br/><span className="text-indigo-400">Tek Bir Yerde.</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-semibold">
              Katıldığınız etkinlikler, aldığınız eğitimler ve sertifikalar blockchain altyapısıyla doğrulanarak dijital portfolyonuza eklenir. İşe alım uzmanlarına kanıtlanmış yetkinliklerinizi sunun.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={handleRunAnalysis}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition shadow-lg w-full min-w-[220px]"
            >
              <Zap size={16} /> AI İstihdam Analizi
            </button>
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition w-full min-w-[220px] backdrop-blur-md"
            >
              <FileSignature size={16} /> Özgeçmişe Aktar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Certificates */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Award className="text-indigo-600" size={22} /> Doğrulanmış Sertifikalar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CERTIFICATES.map(cert => (
                  <div key={cert.id} className="bg-white rounded-3xl p-6 border border-slate-200/85 shadow-sm flex items-center gap-4 hover:shadow-md transition group cursor-pointer">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shadow-sm border ${cert.color} shrink-0`}>
                      {cert.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 group-hover:text-indigo-600 transition">{cert.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-500" /> {cert.issuer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress / Career Readiness */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/85 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-600" size={22}/> İstihdam Edilebilirlik Skoru
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-slate-600 text-xs uppercase">Sektöre Hazırlık Endeksi</span>
                <span className="font-black text-xs text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">%{readinessScore}</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/50">
                <motion.div initial={{ width: 0 }} animate={{ width: `${readinessScore}%` }} className="h-full bg-indigo-600" />
              </div>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed">Bu skoru artırmak için Sürekli Eğitim Merkezi'ndeki (SEM) açık eğitimleri inceleyebilirsiniz.</p>
            </div>
          </div>

          {/* Right Column: Transaction History -> Professional Activities */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <History className="text-indigo-600" size={22} /> Kayıtlı Aktiviteler
            </h3>
            
            <div className="bg-white rounded-3xl border border-slate-200/85 shadow-sm overflow-hidden flex flex-col">
              <div className="flex flex-col">
                {VERIFIED_SKILLS.map((trx, idx) => (
                  <div key={trx.id} className={`p-5 flex items-center justify-between hover:bg-slate-50 transition ${idx !== VERIFIED_SKILLS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${trx.type === 'certificate' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                        {trx.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-tight mb-1">{trx.desc}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{trx.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => window.toast && window.toast.info("Tüm aktiviteleriniz listeleniyor...")}
                className="w-full py-4 text-xs font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-50 transition border-t border-slate-100 flex items-center justify-center gap-2"
              >
                Tüm Aktiviteleri Görüntüle
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="font-black text-slate-950 text-sm">Özgeçmişe Aktar</h3>
                  <span className="text-[10px] text-slate-400 font-bold">Doğrulanmış Bilgilerinizi Çıkarın</span>
                </div>
                <button onClick={() => setShowExportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  Yetkinlik cüzdanınızdaki doğrulanmış sertifikaları, katıldığınız etkinlikleri ve projeleri akıllı CV oluşturucunuza aktarabilirsiniz.
                </p>
                <button 
                  onClick={() => {
                    setShowExportModal(false);
                    window.toast && window.toast.success("✅ Verileriniz başarıyla Özgeçmiş Paneline aktarıldı!");
                  }}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition"
                >
                  CV Oluşturucuya Aktar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
