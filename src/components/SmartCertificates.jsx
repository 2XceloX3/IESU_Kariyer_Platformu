import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Download, QrCode, Search, FileCheck, Lock, ChevronLeft, ArrowRight, AlertCircle, Building, Sparkles, MonitorPlay } from 'lucide-react';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';

export default function SmartCertificates({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('dogrulama'); // dogrulama, sertifikalarim, devam_edenler
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const mockUserCertificates = [
    {
      id: 'CERT-101',
      title: 'İleri Düzey Proje Yönetimi Atölyesi',
      issuer: 'Kariyer ve Yetenek Akademisi',
      date: '15 Mart 2026',
      instructor: 'Dr. Öğr. Üyesi Mehmet Öztürk',
      status: 'Tamamlandı',
      code: 'IESU-2026-9874',
      edevletBarcode: 'EDV-2026-9874521',
      type: 'Ücretsiz',
      hash: '0x8f3c...9b2a'
    },
    {
      id: 'CERT-102',
      title: 'Yapay Zeka Destekli CV ve Mülakat Teknikleri',
      issuer: 'Kariyer Geliştirme Merkezi',
      date: '02 Şubat 2026',
      instructor: 'Kariyer Geliştirme Merkezi Ekibi',
      status: 'Tamamlandı',
      code: 'IESU-2026-4512',
      edevletBarcode: 'EDV-2026-4512988',
      type: 'Ücretsiz',
      hash: '0x4a1e...7c8f'
    }
  ];

  const mockOngoingPrograms = [
    {
      id: 'PROG-201',
      title: 'Sektörel Liderlik ve Dijital Pazarlama Eğitimi',
      startDate: '10 Ağustos 2026',
      progress: 65,
      type: 'Ücretli (Burslu)',
      instructor: 'Sektör Uzmanları'
    }
  ];

  const handleSearchVerify = (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    
    setIsVerifying(true);
    setVerifyResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      if (verifyCode.toUpperCase().includes('IESU') || verifyCode.length >= 5) {
        setVerifyResult({
          status: 'success',
          code: verifyCode.toUpperCase(),
          studentName: currentUser?.name || 'Ahmet Yılmaz',
          tcNo: '123******89',
          programName: 'Kariyer ve Yetenek Akademisi - Resmî Yetkinlik Sertifikası',
          issueDate: '15 Mart 2026',
          edevletSync: true,
          barcode: 'EDV-2026-' + Math.floor(1000000 + Math.random() * 9000000)
        });
      } else {
        setVerifyResult({
          status: 'error',
          message: 'Girilen sertifika kodu veya e-Devlet barkod numarası bulunamadı. Lütfen kodu kontrol edin.'
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      
      {/* Top Main Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (setView) {
                if (!userRole) { setView('sem'); return; }
                const target = userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student';
                setView(target);
              }
            }} 
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-[#990000] hover:text-white transition flex items-center gap-2 font-bold text-xs cursor-pointer"
          >
            <ChevronLeft size={18} /> <span className="hidden sm:inline">Geri Dön</span>
          </button>
          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={24} />
            <div>
              <h1 className="font-black text-sm sm:text-base text-slate-900 leading-tight">Katılımcı & Sertifika Portalı</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kariyer ve Yetenek Akademisi</p>
            </div>
          </div>
        </div>
        
        {currentUser || userRole ? (
          <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
        ) : (
          <button 
            onClick={() => setView && setView('login')}
            className="px-4 py-2 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition shadow-sm cursor-pointer"
          >
            Portala Giriş Yap
          </button>
        )}
      </header>

      {/* Main Dedicated Page Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Banner Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-[#7A0000] to-[#990000] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-white border border-red-900">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3 py-1 rounded-full inline-block mb-3">
                RESMÎ e-DEVLET OTOMASYONU
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                Sertifika & Belge Yönetim Merkezi
              </h2>
              <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                Katıldığınız tüm kariyer atölyelerinin sertifikalarına buradan ulaşabilir, e-Devlet barkodlu doğrulamaları yapabilir veya sertifika sorgulayabilirsiniz.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md text-center shrink-0 min-w-[130px]">
                <p className="text-slate-300 font-bold text-[11px] uppercase tracking-wider mb-1">Sertifikalarım</p>
                <p className="text-3xl font-black text-amber-300">{mockUserCertificates.length}</p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md text-center shrink-0 min-w-[130px]">
                <p className="text-slate-300 font-bold text-[11px] uppercase tracking-wider mb-1">Devam Eden</p>
                <p className="text-3xl font-black text-emerald-400">{mockOngoingPrograms.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Nav Tabs */}
        <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-full max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('dogrulama')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'dogrulama' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`}
          >
            <ShieldCheck size={16} /> Belge Doğrulama (e-Devlet)
          </button>

          <button
            onClick={() => setActiveTab('sertifikalarim')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sertifikalarim' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`}
          >
            <Award size={16} /> Sertifikalarım
          </button>

          <button
            onClick={() => setActiveTab('devam_edenler')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'devam_edenler' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-600 hover:text-[#990000] hover:bg-red-50'
            }`}
          >
            <MonitorPlay size={16} /> Devam Eden Atölyeler
          </button>
        </div>

        {/* Dynamic Tab Contents */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: Sertifikalarım */}
          {activeTab === 'sertifikalarim' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {mockUserCertificates.map(cert => (
                <div key={cert.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        {cert.type} • {cert.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{cert.date}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#990000] transition-colors leading-snug mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 mb-4">Düzenleyen: {cert.issuer}</p>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-6">
                      <p><strong>Eğitmen:</strong> {cert.instructor}</p>
                      <p><strong>Sertifika Kodu:</strong> <span className="font-black text-slate-900">{cert.code}</span></p>
                      <p><strong>e-Devlet Barkod:</strong> <span className="font-bold text-emerald-700">{cert.edevletBarcode}</span></p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Doğrulanmış Dijital Belge</span>
                    <button 
                      onClick={() => window.toast && window.toast.success(`PDF Sertifikası ve e-Devlet Barkodu indiriliyor: ${cert.code}`)}
                      className="px-5 py-2.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Download size={15} /> Belgeyi İndir (PDF)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Belge Doğrulama Sayfası (Özel Ekran) */}
          {activeTab === 'dogrulama' && (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl animate-fade-in space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Sertifika & Belge Doğrulama</h3>
                <p className="text-xs font-bold text-slate-500">
                  İESÜ Kariyer ve Yetenek Akademisi tarafından verilen sertifikaları veya e-Devlet barkod numaralarını buradan sorgulayabilirsiniz.
                </p>
              </div>

              <form onSubmit={handleSearchVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Sertifika Kodu veya e-Devlet Barkod No *
                  </label>
                  <div className="relative">
                    <QrCode className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                      type="text"
                      required
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="Örn: IESU-2026-9874 veya Barkod No"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#990000]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-4 bg-[#990000] hover:bg-red-800 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isVerifying ? 'Sorgulanıyor...' : 'Belgeyi Sorgula & Doğrula'}
                </button>
              </form>

              {/* Sorgulama Sonucu */}
              {verifyResult && verifyResult.status === 'success' && (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm border-b border-emerald-200 pb-3">
                    <CheckCircle2 size={20} className="text-emerald-600" /> RESMÎ BELGE DOĞRULANDI
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-700">
                    <p><strong>Belge Sahibi:</strong> {verifyResult.studentName}</p>
                    <p><strong>T.C. Kimlik No:</strong> {verifyResult.tcNo}</p>
                    <p><strong>Program / Atölye:</strong> {verifyResult.programName}</p>
                    <p><strong>Düzenlenme Tarihi:</strong> {verifyResult.issueDate}</p>
                    <p className="flex items-center gap-1.5 text-emerald-800 font-bold mt-2">
                      <FileCheck size={16} /> e-Devlet Barkod No: {verifyResult.barcode}
                    </p>
                  </div>
                </div>
              )}

              {verifyResult && verifyResult.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3 text-red-700 text-xs font-bold animate-fade-in">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>{verifyResult.message}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Devam Eden Atölyeler */}
          {activeTab === 'devam_edenler' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {mockOngoingPrograms.map(prog => (
                <div key={prog.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      {prog.type}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Başlangıç: {prog.startDate}</span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">{prog.title}</h3>
                  <p className="text-xs font-bold text-slate-500">Eğitmen: {prog.instructor}</p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Tamamlanma İlerlemesi</span>
                      <span className="text-slate-900 font-black">%{prog.progress}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#990000] h-full rounded-full transition-all" style={{ width: `${prog.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}


