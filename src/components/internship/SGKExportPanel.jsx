import React, { useState } from 'react';
import { 
  Download, FileSpreadsheet, FileCode, CheckCircle2, ShieldCheck, 
  Search, Filter, Users, Building2, CheckSquare, Square, RefreshCw, 
  Barcode, AlertCircle, Info, ExternalLink 
} from 'lucide-react';
import { 
  generateSGKBulkExportData, 
  exportSGKToCSV, 
  exportSGKToJSON, 
  advanceInternshipStatus, 
  INTERNSHIP_STATUS, 
  LAW_REFERENCES 
} from '../../services/internshipWorkflow';

export default function SGKExportPanel({ 
  internships = [], 
  onUpdateInternship,
  currentUser 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'REGISTERED'
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Eligible internships for SGK desk (Commission approved or later)
  const eligibleInternships = internships.filter(item => 
    item && (
      item.status === INTERNSHIP_STATUS.COMMISSION_APPROVED ||
      item.status === INTERNSHIP_STATUS.SGK_REGISTERED ||
      item.status === INTERNSHIP_STATUS.IN_PROGRESS ||
      item.status === INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED ||
      item.status === INTERNSHIP_STATUS.EMPLOYER_EVALUATED ||
      item.status === INTERNSHIP_STATUS.GRADED_PASSED ||
      (item.status === INTERNSHIP_STATUS.GRADED_FAILED && item.sgkBarcode)
    )
  );

  const filtered = eligibleInternships.filter(item => {
    const matchesSearch = 
      (item.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tcNo || '').includes(searchTerm) ||
      (item.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.department || '').toLowerCase().includes(searchTerm.toLowerCase());

    const isRegistered = Boolean(item.sgkBarcode);
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'PENDING' ? !isRegistered :
      statusFilter === 'REGISTERED' ? isRegistered : true;

    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(f => f.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDownloadCSV = () => {
    const targetList = selectedIds.length > 0 
      ? internships.filter(i => selectedIds.includes(i.id))
      : filtered;

    if (!targetList.length) {
      window.toast?.info?.('Dışa aktarılacak staj kaydı bulunamadı.');
      return;
    }

    const csvContent = exportSGKToCSV(targetList);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IESU_SGK_5510_5b_Toplu_Ise_Giris_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.toast?.success?.(`✅ ${targetList.length} öğrencinin SGK 5510/5-b e-Sigorta CSV dosyası indirildi.`);
  };

  const handleDownloadJSON = () => {
    const targetList = selectedIds.length > 0 
      ? internships.filter(i => selectedIds.includes(i.id))
      : filtered;

    if (!targetList.length) {
      window.toast?.info?.('Dışa aktarılacak staj kaydı bulunamadı.');
      return;
    }

    const jsonStr = exportSGKToJSON(targetList);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IESU_SGK_WebServis_Verisi_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.toast?.success?.(`📄 ${targetList.length} öğrencinin SGK Web Servis JSON çıktısı indirildi.`);
  };

  const handleBatchRegisterSGK = () => {
    const toRegister = filtered.filter(i => selectedIds.includes(i.id) && !i.sgkBarcode);
    if (!toRegister.length) {
      window.toast?.info?.('Seçili öğrenciler arasında SGK tescili bekleyen bulunmamaktadır.');
      return;
    }

    setIsProcessing(true);
    let successCount = 0;

    toRegister.forEach(item => {
      try {
        const updated = advanceInternshipStatus(item, 'SGK_REGISTER_ENTRY', {
          officerName: currentUser?.name || 'Personel Daire SGK Şefi',
        });
        if (onUpdateInternship) {
          onUpdateInternship(updated);
        }
        successCount++;
      } catch (e) {
        console.warn('SGK registration error:', e);
      }
    });

    setIsProcessing(false);
    setSelectedIds([]);
    window.toast?.success?.(`🎉 ${successCount} öğrencinin SGK 5510/5-b Sigortalı İşe Giriş Bildirgesi tescil edildi ve barkodları üretildi!`);
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-blue-300 flex items-center justify-center shrink-0 shadow-inner">
              <Building2 size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
                  Personel Dairesi Başkanlığı
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  5510 / 5-b SGK İşe Giriş Masası
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Toplu SGK Bildirge İhraç ve Tescil Konsolu
              </h2>
              <p className="text-xs text-blue-200/80 mt-1 max-w-xl">
                Bölüm staj komisyonları tarafından onaylanan öğrencilerin SGK Sigortalı İşe Giriş Bildirgelerini hazırlayın, toplu Excel/CSV ihraç edin ve sisteme tescilleyin.
              </p>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-700/25 cursor-pointer"
            >
              <FileSpreadsheet size={16} />
              <span>Toplu SGK CSV (Excel)</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black transition flex items-center gap-2 cursor-pointer"
            >
              <FileCode size={16} />
              <span>SGK WebServis JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legal Info Card */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
        <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <b>5510 Sayılı Kanun Madde 5/b & SGK e-Sigorta Yasal Bildirim Süresi:</b> Yükseköğrenimleri sırasında staja tabi tutulan öğrencilerin işe giriş bildirgeleri, <b>staj başlangıç tarihinden en az bir gün önce</b> SGK portalına verilmelidir. Anne/babasından sağlık güvencesi bulunmayan öğrencilerin Genel Sağlık Sigortası (GSS) primleri (%6) üniversitemiz Personel Dairesi Başkanlığı bütçesinden karşılanmaktadır.
        </div>
      </div>

      {/* Control Bar: Selection count, search & batch actions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {selectedIds.length > 0 && selectedIds.length === filtered.length ? (
              <CheckSquare size={16} className="text-[#990000]" />
            ) : (
              <Square size={16} className="text-slate-400" />
            )}
            <span>Tümünü Seç ({selectedIds.length}/{filtered.length})</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              disabled={isProcessing}
              onClick={handleBatchRegisterSGK}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              <Barcode size={15} />
              <span>Seçilenleri SGK'ya Tescil Et</span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${statusFilter === 'PENDING' ? 'bg-[#990000] text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Tescil Bekleyen
            </button>
            <button
              onClick={() => setStatusFilter('REGISTERED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${statusFilter === 'REGISTERED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Tescil Edilenler
            </button>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="TCKN, Öğrenci veya Firma Ara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* SGK Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-bold">SGK bildirge havuzunda kriterlere uygun öğrenci bulunamadı.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-3 w-10 text-center">#</th>
                  <th className="py-3.5 px-4">T.C. Kimlik & Ad Soyad</th>
                  <th className="py-3.5 px-4">Bölüm & No</th>
                  <th className="py-3.5 px-4">Sigorta Kolu (5510 5/b)</th>
                  <th className="py-3.5 px-4">GSS Sağlık Durumu</th>
                  <th className="py-3.5 px-4">İşe Giriş / Bitiş</th>
                  <th className="py-3.5 px-4">İşyeri Sicil No</th>
                  <th className="py-3.5 px-4">SGK Barkod Durumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  const isRegistered = Boolean(item.sgkBarcode);

                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/50 transition ${isSelected ? 'bg-blue-50/30' : ''}`}>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(item.id)}
                          className="cursor-pointer text-slate-400 hover:text-slate-700"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-[#990000]" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-sm">{item.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-500">TCKN: {item.tcNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{item.department}</div>
                        <div className="text-[10px] text-slate-400">{item.studentNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 text-[10px]">
                          07 - Çırak / Stajyer
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {item.hasFamilyGss ? (
                          <div className="text-emerald-700 font-bold text-[11px]">
                            1 - Sağlık Yardımı Alıyor
                            <span className="block text-[9px] text-slate-400 font-normal">%1 İş Kazası Primi</span>
                          </div>
                        ) : (
                          <div className="text-blue-700 font-bold text-[11px]">
                            2 - Sağlık Yardımı Almıyor
                            <span className="block text-[9px] text-blue-500 font-normal">%6 İK/MH + GSS Primi İESÜ'ce Ödenir</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{item.startDate}</div>
                        <div className="text-[10px] text-slate-500">{item.workDays} İş Günü (Bitiş: {item.endDate})</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 truncate max-w-[140px]">{item.companyName}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">{item.sgkSicilNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isRegistered ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                              {item.sgkBarcode}
                            </span>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                            Tescil Bekliyor
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
