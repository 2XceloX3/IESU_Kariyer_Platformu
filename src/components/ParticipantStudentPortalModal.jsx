import React, { useState } from 'react';
import { Award, BookOpen, CheckCircle2, Clock, Download, FileText, MonitorPlay, QrCode, ShieldCheck, UserCheck } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ParticipantStudentPortalModal({ isOpen, onClose, currentUser }) {
  const [activeTab, setActiveTab] = useState('sertifikalarim');

  if (!isOpen) return null;

  const mockUserCertificates = [
    {
      id: 'CERT-101',
      title: 'İleri Düzey Proje Yönetimi Atölyesi',
      date: '15 Mart 2026',
      instructor: 'Dr. Öğr. Üyesi Mehmet Öztürk',
      status: 'Tamamlandı',
      code: 'IESU-2026-9874',
      edevletBarcode: 'EDV-2026-9874521',
      type: 'Ücretsiz'
    },
    {
      id: 'CERT-102',
      title: 'Yapay Zeka Destekli CV ve Mülakat Teknikleri',
      date: '02 Şubat 2026',
      instructor: 'Kariyer Geliştirme Merkezi',
      status: 'Tamamlandı',
      code: 'IESU-2026-4512',
      edevletBarcode: 'EDV-2026-4512988',
      type: 'Ücretsiz'
    }
  ];

  const mockOngoingPrograms = [
    {
      id: 'PROG-201',
      title: 'Sektörel Liderlik ve Dijital Pazarlama Eğitimi',
      startDate: '10 Ağustos 2026',
      progress: 65,
      type: 'Ücretli (Burslu)'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-100 mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 text-[#990000] rounded-2xl border border-red-100">
              <MonitorPlay size={24} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Katılımcı Öğrenci Paneli</h3>
              <p className="text-xs font-bold text-slate-500">Kariyer & Yetenek Akademisi Sertifika Portalı</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold transition"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6 shrink-0">
          <button
            onClick={() => setActiveTab('sertifikalarim')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sertifikalarim' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={16} /> Sertifikalarım ({mockUserCertificates.length})
          </button>
          <button
            onClick={() => setActiveTab('devam_edenler')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === 'devam_edenler' ? 'bg-[#990000] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={16} /> Devam Eden Programlarım ({mockOngoingPrograms.length})
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar space-y-4 pr-1 flex-1">
          {activeTab === 'sertifikalarim' && (
            <div className="space-y-4">
              {mockUserCertificates.map(cert => (
                <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-red-300 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block mb-1.5">
                        {cert.type} • {cert.status}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm">{cert.title}</h4>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">Eğitmen: {cert.instructor}</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">{cert.date}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                    <div className="text-slate-600">
                      <span>Kod: </span><span className="text-slate-900 font-black">{cert.code}</span>
                    </div>
                    
                    <button 
                      onClick={() => window.toast && window.toast.success(`PDF Sertifikası ve e-Devlet Barkod dosyası indiriliyor: ${cert.code}`)}
                      className="px-4 py-2 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Download size={14} /> Sertifikayı İndir (e-Devlet)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'devam_edenler' && (
            <div className="space-y-4">
              {mockOngoingPrograms.map(prog => (
                <div key={prog.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 inline-block mb-1.5">
                        {prog.type}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm">{prog.title}</h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">Başlangıç: {prog.startDate}</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Tamamlanma Oranı</span>
                      <span className="text-slate-900 font-black">%{prog.progress}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#990000] h-full rounded-full" style={{ width: `${prog.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

