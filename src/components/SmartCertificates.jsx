import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, CheckCircle2, Link as LinkIcon, Download, Share2, Eye, Shield, ChevronLeft, Hexagon } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

const CERTIFICATES = [
  { id: 'CERT-8492-X', title: 'İleri Seviye React ve UI Mimarisi', issuer: 'Esenyurt Üniversitesi Bilgisayar Müh.', date: '12 Eki 2026', type: 'Akademik Başarı', hash: '0x8f3c...9b2a', verified: true },
  { id: 'CERT-1102-M', title: 'Yapay Zeka ve Veri Bilimi Bootcamp', issuer: 'Kariyer Merkezi & Google', date: '05 Eyl 2026', type: 'Sektörel Eğitim', hash: '0x4a1e...7c8f', verified: true },
  { id: 'CERT-5541-K', title: 'Agile Proje Yönetimi Sertifikası', issuer: 'Birlik Ağı Kulüpleri', date: '20 Ağu 2026', type: 'Yetkinlik', hash: '0x9b2d...1e3a', verified: true },
];

export default function SmartCertificates({ setView, currentUser, userRole, setSelectedUserId }) {
  const [selectedCert, setSelectedCert] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (cert) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setSelectedCert(cert);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-red-900 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (selectedCert) setSelectedCert(null);
              else setView(userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student');
            }} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={24} />
            <h1 className="font-black tracking-tight text-red-950">Akıllı Sertifikalar</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8 flex flex-col">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-red-950 to-red-900 rounded-xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-white mb-8">
          <div className="absolute right-0 top-0 w-64 h-full bg-white/5 skew-x-12 translate-x-16 pointer-events-none" />
          <Hexagon className="absolute -left-10 -bottom-10 w-48 h-48 text-emerald-500/20 blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-3xl font-black mb-4 tracking-tight">Blockchain Tabanlı<br/>Doğrulanabilir CV</h2>
              <p className="text-slate-300 text-lg leading-relaxed">Sahip olduğun tüm akademik ve sektörel sertifikalar, benzersiz bir blokzincir hash'i ile korunur ve işverenler tarafından %100 doğrulanabilir.</p>
            </div>
            <div className="flex-shrink-0 bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md text-center">
              <p className="text-slate-300 font-bold text-sm uppercase tracking-wider mb-2">Cüzdanındaki Sertifikalar</p>
              <p className="text-3xl font-black text-emerald-400">{CERTIFICATES.length}</p>
            </div>
          </div>
        </div>

        {selectedCert ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto w-full">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-slate-200 relative overflow-hidden">
              {/* Certificate Border Pattern */}
              <div className="absolute inset-2 border-2 border-slate-100 rounded-[1.5rem] pointer-events-none" />
              <div className="absolute inset-3 border border-slate-50/50 rounded-[1.2rem] pointer-events-none" />
              
              <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award size={40} />
                </div>
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-2">Başarı Sertifikası</h3>
                <h2 className="text-3xl md:text-2xl font-black text-red-950 mb-8">{selectedCert.title}</h2>
                
                <p className="text-slate-600 text-lg mb-2">Bu sertifika,</p>
                <p className="text-2xl font-bold text-indigo-700 mb-8">{currentUser?.name || "Kullanıcı"}</p>
                
                <p className="text-slate-600 text-lg mb-12 max-w-lg mx-auto">
                  tarafından gerekli tüm eğitim ve yetkinlikleri başarıyla tamamladığı için <strong>{selectedCert.issuer}</strong> tarafından verilmiştir.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left border-t border-b border-slate-100 py-6 mb-8">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Veriliş Tarihi</p>
                    <p className="text-sm font-bold text-red-900">{selectedCert.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Sertifika ID</p>
                    <p className="text-sm font-bold text-red-900">{selectedCert.id}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400 font-bold uppercase">Blockchain Hash</p>
                    <p className="text-sm font-mono text-emerald-600 truncate">{selectedCert.hash}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      window.toast && window.toast.info("Anka AI: Sertifika yetkinlikleri sektör standartlarına çevriliyor...");
                      setTimeout(() => {
                        window.toast && window.toast.success("✅ AI Çevirisi: Bu sertifika CV'nize 'Agile Methodology', 'Scrum' ve 'Product Management' yetkinlikleri olarak yansıtıldı.");
                      }, 2500);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
                    AI Yetkinlik Çevirmeni
                  </button>
                  <button className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2">
                    <Share2 size={18} /> LinkedIn'de Paylaş
                  </button>
                  <button className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-2">
                    <Download size={18} /> PDF İndir
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATES.map(cert => (
              <div key={cert.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
                {isVerifying ? (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                    <Shield className="text-emerald-500 animate-pulse mb-3" size={32} />
                    <p className="font-bold text-sm text-slate-700">Ağda Doğrulanıyor...</p>
                  </div>
                ) : null}

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-50 text-red-600 rounded-xl flex items-center justify-center">
                    <Award size={24} />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={12} /> Doğrulandı
                  </span>
                </div>
                
                <h3 className="font-black text-red-950 text-lg leading-tight mb-2">{cert.title}</h3>
                <p className="text-sm text-slate-500 font-medium mb-6 flex-1">{cert.issuer}</p>
                
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-4">
                    <span>{cert.date}</span>
                    <span className="flex items-center gap-1" title="Blockchain TX Hash"><LinkIcon size={12}/> {cert.hash}</span>
                  </div>
                  <button 
                    onClick={() => handleVerify(cert)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} /> İncele & Doğrula
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
