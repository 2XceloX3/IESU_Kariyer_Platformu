import React, { useState, useEffect } from 'react';
import { X, FileText, Upload, CheckCircle2, ShieldCheck, Building2, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function StudentDocumentSubmitModal({ isOpen, onClose, currentUser }) {
  const internships = useAppStore(state => state.internships) || [];
  const setInternships = useAppStore(state => state.setInternships);
  const applications = useAppStore(state => state.applications) || [];
  const setApplications = useAppStore(state => state.setApplications);
  const addNotification = useAppStore(state => state.addNotification);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [form, setForm] = useState({
    type: 'Zorunlu Yaz Stajı (30 Gün)',
    company: 'Aselsan A.Ş.',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    sgkBarcode: '2026-SGK-' + Math.floor(10000 + Math.random() * 90000),
  });

  const [files, setFiles] = useState({
    doc1: { name: 'FR.KGM.12_IslakImzaliForm.pdf', size: '2.4 MB', uploaded: true, title: '1. İmzalı Başvuru Formu' },
    doc2: { name: 'eDevlet_SGK_Barkodlu.pdf', size: '1.1 MB', uploaded: true, title: '2. SGK Müstahaklık Belgesi' },
    doc3: { name: 'TC_Kimlik_Fotokopisi.pdf', size: '850 KB', uploaded: true, title: '3. T.C. Kimlik Fotokopisi' },
    doc4: { name: 'ISG_Egitim_Sertifikasi.pdf', size: '1.8 MB', uploaded: true, title: '4. İSG Eğitimi Belgesi / Sözleşme' }
  });

  if (!isOpen) return null;

  const handleFileChange = (docKey, event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
      const formattedSize = Number(sizeInMB) < 0.1 ? `${(selectedFile.size / 1024).toFixed(0)} KB` : `${sizeInMB} MB`;
      
      setFiles(prev => ({
        ...prev,
        [docKey]: {
          ...prev[docKey],
          name: selectedFile.name,
          size: formattedSize,
          uploaded: true
        }
      }));
      window.toast?.success(`✅ ${selectedFile.name} evrakı başarıyla yüklendi!`);
    }
  };

  const uploadedCount = Object.values(files).filter(f => f.uploaded).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim()) {
      window.toast?.error("Lütfen firma veya kurum adını girin.");
      return;
    }

    // GANO (GPA) Validation Rule: ONLY for CBİKO Ulusal Staj Programı
    if (form.type === 'CBİKO Ulusal Staj Programı') {
      const isAssociateDegree1stYear = (currentUser?.degreeType === 'Ön Lisans' || currentUser?.degreeType === 'Önlisans' || currentUser?.programType === 'Ön Lisans') && (currentUser?.classYear === '1. Sınıf' || currentUser?.classYear === '1');
      const studentGpa = parseFloat(currentUser?.gpa || currentUser?.gno || '2.50');

      if (!isAssociateDegree1stYear && studentGpa < 2.00) {
        window.toast?.error("Ulusal Staj Programı başvurularında GANO ortalamasının 4.00 üzerinden en az 2.00 olması gerekmektedir (Ön Lisans 1. Sınıf öğrencileri hariç).");
        return;
      }
    }

    const newApp = {
      id: 'app_' + Date.now(),
      userId: currentUser?.id || 'STU-001',
      studentId: currentUser?.studentId || '20240001',
      name: currentUser?.name || 'Alperen Yılmaz',
      no: currentUser?.studentId || '220401015',
      department: currentUser?.department || 'Yazılım Mühendisliği',
      type: form.type,
      company: form.company,
      status: 'Onay Bekliyor',
      date: 'Bugün, ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      startDate: form.startDate,
      endDate: form.endDate,
      sgkBarcode: form.sgkBarcode,
      sgkStatus: 'e-Devlet Barkodlu Doğrulandı',
      fileUrl: files.doc1.name,
      uploadedFiles: files
    };

    if (setInternships) {
      setInternships([newApp, ...internships]);
    }
    if (setApplications) {
      const unifiedApp = {
        ...newApp,
        jobTitle: `Staj Evrak Paketi (${form.type})`,
        applicantName: currentUser?.name || newApp.name,
        applicantId: currentUser?.id || newApp.userId,
        applicantEmail: currentUser?.email || 'ogrenci@esenyurt.edu.tr',
        applicantPhone: currentUser?.phone || '0555 000 0000',
        applicantDept: currentUser?.department || newApp.department,
        status: 'Beklemede'
      };
      setApplications([unifiedApp, ...applications]);
    }

    if (addNotification) {
      addNotification({
        id: 'NOTIF-' + Date.now(),
        type: 'success',
        message: `📄 ${form.type} evrak paketi (${uploadedCount} Belge) başarıyla Akademisyen ve KGM Yönetici Onay Havuzuna iletildi!`
      });
    }

    window.toast?.success(`✅ Toplam ${uploadedCount} adet resmî staj evrakınız başarıyla yüklendi! Hem Akademisyen Hem de Yönetici Onay Havuzuna iletildi.`);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] relative"
      >
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-red-800 via-[#990000] to-rose-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center font-black border border-white/20">
              <FileText size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Resmî Evrak Gönderme Portalı (FR.KGM.12)
              </span>
              <h3 className="font-black text-lg text-white mt-1 leading-snug">Staj & Başvuru Evrakı Gönder</h3>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-700 bg-slate-50/50">
          
          {/* Student Info Card */}
          <div className="p-4 bg-red-50/60 rounded-2xl border border-red-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#990000] text-white font-black flex items-center justify-center text-sm shrink-0">
              {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'ST'}
            </div>
            <div className="text-xs">
              <p className="font-black text-slate-900">{currentUser?.name || 'Alperen Yılmaz'} ({currentUser?.studentId || '20240001'})</p>
              <p className="text-slate-600 font-medium">{currentUser?.department || 'Yazılım Mühendisliği'} • Fakülte Onayı İçin Hazır</p>
            </div>
          </div>

          {/* Evrak Türü */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              Staj / Evrak Başvuru Türü
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="Zorunlu Yaz Stajı (30 Gün)">Zorunlu Yaz Stajı (30 İş Günü)</option>
              <option value="CBİKO Ulusal Staj Programı">CBİKO Ulusal Staj Programı (Cumhurbaşkanlığı İK Ofisi)</option>
              <option value="Aday Mühendislik Protokolü">Aday Mühendislik Protokolü (Uzun Dönem)</option>
              <option value="İsteğe Bağlı Staj">İsteğe Bağlı Staj</option>
              <option value="SHMYO-SBF Mesleki Eğitim">SHMYO - SBF Mesleki Uygulamalı Eğitim</option>
            </select>

            {form.type === 'CBİKO Ulusal Staj Programı' && (
              <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Sparkles size={14} className="text-amber-600" />
                  <span>Ulusal Staj Programı GANO Not Şartı Bilgilendirmesi</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  • Ulusal Staj Programı başvurularında GANO 4.00 üzerinden <b>en az 2.00</b> olması gerekmektedir.<br/>
                  • <b>Ön Lisans 1. Sınıf öğrencileri</b> bu not şartından muaf tutulmaktadır.<br/>
                  • Genel firma başvurularında ve normal stajlarda GANO şartı aranmaz.
                </p>
              </div>
            )}
          </div>

          {/* Firma Adı */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              Staj Yapılacak Kurum / Firma Adı
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Örn: Aselsan A.Ş., Baykar, Trendyol..."
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Staj Tarihleri */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5">Başlangıç Tarihi</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-700 uppercase mb-1.5">Bitiş Tarihi</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* SGK e-Devlet Barkod No */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              e-Devlet SGK Müstahaklık Barkod Numarası
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 text-emerald-600" size={18} />
              <input
                type="text"
                value={form.sgkBarcode}
                onChange={(e) => setForm({ ...form, sgkBarcode: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 4 ADET RESMÎ STAJ EVRAKI YÜKLEME ALANI */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Yüklenecek Resmî Staj Evrakları (Toplam 4 Belge)
              </label>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${uploadedCount === 4 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
                {uploadedCount} / 4 Belge Yüklendi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Belge 1: FR.KGM.12 Staj Formu */}
              <label htmlFor="file-input-doc1" className={`bg-white border-2 border-dashed ${files.doc1.uploaded ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-300'} hover:border-[#990000] rounded-2xl p-3.5 transition relative group cursor-pointer block`}>
                <input type="file" id="file-input-doc1" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange('doc1', e)} className="hidden" />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0 font-bold group-hover:scale-110 transition-transform">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">1. İmzalı Başvuru Formu</p>
                    <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">{files.doc1.name}</p>
                    <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 size={11} /> {files.doc1.size} • Yüklendi (Değiştir)
                    </span>
                  </div>
                </div>
              </label>

              {/* Belge 2: SGK Müstahaklık Belgesi */}
              <label htmlFor="file-input-doc2" className={`bg-white border-2 border-dashed ${files.doc2.uploaded ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-300'} hover:border-[#990000] rounded-2xl p-3.5 transition relative group cursor-pointer block`}>
                <input type="file" id="file-input-doc2" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange('doc2', e)} className="hidden" />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold group-hover:scale-110 transition-transform">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">2. SGK Müstahaklık Belgesi</p>
                    <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">{files.doc2.name}</p>
                    <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 size={11} /> {files.doc2.size} • Yüklendi (Değiştir)
                    </span>
                  </div>
                </div>
              </label>

              {/* Belge 3: T.C. Kimlik Kartı Fotokopisi */}
              <label htmlFor="file-input-doc3" className={`bg-white border-2 border-dashed ${files.doc3.uploaded ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-300'} hover:border-[#990000] rounded-2xl p-3.5 transition relative group cursor-pointer block`}>
                <input type="file" id="file-input-doc3" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange('doc3', e)} className="hidden" />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold group-hover:scale-110 transition-transform">
                    <Upload size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">3. T.C. Kimlik Fotokopisi</p>
                    <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">{files.doc3.name}</p>
                    <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 size={11} /> {files.doc3.size} • Yüklendi (Değiştir)
                    </span>
                  </div>
                </div>
              </label>

              {/* Belge 4: İSG Eğitimi Sertifikası */}
              <label htmlFor="file-input-doc4" className={`bg-white border-2 border-dashed ${files.doc4.uploaded ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-300'} hover:border-[#990000] rounded-2xl p-3.5 transition relative group cursor-pointer block`}>
                <input type="file" id="file-input-doc4" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange('doc4', e)} className="hidden" />
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 font-bold group-hover:scale-110 transition-transform">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">4. İSG Eğitimi Belgesi / Sözleşme</p>
                    <p className="text-[10px] text-slate-600 font-medium truncate mt-0.5">{files.doc4.name}</p>
                    <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle2 size={11} /> {files.doc4.size} • Yüklendi (Değiştir)
                    </span>
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Sparkles size={14} className="text-amber-500" /> {uploadedCount} Belge Canlı Onay Havuzuna Aktarılır
            </span>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-red-900 to-[#990000] hover:from-red-800 hover:to-red-700 text-white rounded-xl text-xs font-black shadow-lg shadow-red-900/30 transition flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 size={16} /> {uploadedCount} Evrakı Gönder
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
