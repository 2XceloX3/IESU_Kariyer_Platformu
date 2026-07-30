import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, FileCheck, QrCode, Building, Award, ArrowLeft, Lock } from 'lucide-react';

export default function CertificateVerifyModal({ isOpen, onClose }) {
  const [certCode, setCertCode] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    if (!certCode.trim()) return;
    
    setIsLoading(true);
    setResult(null);

    // E-Devlet ve İESÜ Barkod Simülasyonu
    setTimeout(() => {
      setIsLoading(false);
      if (certCode.toUpperCase().includes('IESU') || certCode.length >= 6) {
        setResult({
          status: 'success',
          code: certCode.toUpperCase(),
          studentName: 'Ahmet Yılmaz',
          tcNo: '123******89',
          programName: 'Kariyer ve Yetenek Akademisi - İleri Düzey Proje Yönetimi Atölyesi',
          issueDate: '15 Mart 2026',
          edevletSync: true,
          barcode: 'EDV-2026-9874521'
        });
      } else {
        setResult({
          status: 'error',
          message: 'Girilen sertifika kodu veya e-Devlet barkod numarası sistemde bulunamadı. Lütfen kontrol edip tekrar deneyin.'
        });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Sertifika & Belge Doğrulama</h3>
              <p className="text-xs font-bold text-slate-500">İESÜ Kariyer & e-Devlet Otomasyonu</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Sertifika Kodu veya e-Devlet Barkod Numarası *
            </label>
            <div className="relative">
              <QrCode className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                required
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                placeholder="Örn: IESU-2026-9874 veya Barkod No"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? 'Doğrulanıyor...' : 'Belgeyi Sorgula & Doğrula'}
          </button>
        </form>

        {/* Result Area */}
        {result && result.status === 'success' && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs border-b border-emerald-200 pb-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> RESMÎ BELGE DOĞRULANDI
            </div>
            
            <div className="space-y-1.5 text-xs text-slate-700">
              <p><strong>Belge Sahibi:</strong> {result.studentName}</p>
              <p><strong>T.C. Kimlik No:</strong> {result.tcNo}</p>
              <p><strong>Program / Atölye:</strong> {result.programName}</p>
              <p><strong>Düzenlenme Tarihi:</strong> {result.issueDate}</p>
              <p className="flex items-center gap-1 text-emerald-700 font-bold mt-2">
                <FileCheck size={14} /> e-Devlet Barkod No: {result.barcode}
              </p>
            </div>
          </div>
        )}

        {result && result.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 text-xs font-bold animate-fade-in">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{result.message}</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
          <span className="flex items-center gap-1"><Lock size={12}/> 256-bit SSL Güvenlik</span>
          <span className="text-emerald-600">e-Devlet Entegre Altyapısı</span>
        </div>

      </div>
    </div>
  );
}
