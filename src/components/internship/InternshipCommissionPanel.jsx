import React, { useState } from 'react';
import { 
  Search, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, 
  Clock, Building2, Eye, RotateCcw, Check, Award, Download 
} from 'lucide-react';
import { 
  INTERNSHIP_STATUS, 
  advanceInternshipStatus 
} from '../../services/internshipWorkflow';
import { downloadReportPdf } from '../../utils/downloadPdf';

export default function InternshipCommissionPanel({ 
  internships = [], 
  onUpdateInternship,
  currentUser,
  reviewerRole = 'Bölüm Staj Komisyonu Başkanı'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [selectedInternship, setSelectedInternship] = useState(null);
  
  // Decision Dialog State
  const [decisionModalMode, setDecisionModalMode] = useState(null); // 'APPROVE' | 'REVISE' | 'REJECT' | 'GRADE'
  const [decisionNote, setDecisionNote] = useState('');
  const [commissionDecisionNo, setCommissionDecisionNo] = useState(() => `KMS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [commissionScore, setCommissionScore] = useState(85);
  const [decisionError, setDecisionError] = useState('');

  // Statistics
  const pendingCount = internships.filter(i => i.status === INTERNSHIP_STATUS.COMMISSION_PENDING).length;
  const revisionCount = internships.filter(i => i.status === INTERNSHIP_STATUS.REVISION_REQUESTED).length;
  const approvedCount = internships.filter(i => 
    i.status === INTERNSHIP_STATUS.COMMISSION_APPROVED || 
    i.status === INTERNSHIP_STATUS.SGK_REGISTERED || 
    i.status === INTERNSHIP_STATUS.IN_PROGRESS ||
    i.status === INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED ||
    i.status === INTERNSHIP_STATUS.EMPLOYER_EVALUATED
  ).length;
  const gradedCount = internships.filter(i => i.status === INTERNSHIP_STATUS.GRADED_PASSED || i.status === INTERNSHIP_STATUS.GRADED_FAILED).length;

  const filtered = internships.filter(item => {
    if (!item) return false;
    const matchesSearch = 
      (item.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.studentNo || '').includes(searchTerm) ||
      (item.companyName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'PENDING' ? (item.status === INTERNSHIP_STATUS.COMMISSION_PENDING) :
      statusFilter === 'REVISION' ? (item.status === INTERNSHIP_STATUS.REVISION_REQUESTED) :
      statusFilter === 'APPROVED' ? (
        item.status === INTERNSHIP_STATUS.COMMISSION_APPROVED || 
        item.status === INTERNSHIP_STATUS.SGK_REGISTERED || 
        item.status === INTERNSHIP_STATUS.IN_PROGRESS ||
        item.status === INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED ||
        item.status === INTERNSHIP_STATUS.EMPLOYER_EVALUATED
      ) :
      statusFilter === 'GRADED' ? (item.status === INTERNSHIP_STATUS.GRADED_PASSED || item.status === INTERNSHIP_STATUS.GRADED_FAILED) :
      true;

    const matchesDept = departmentFilter === 'ALL' ? true : item.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleExecuteDecision = () => {
    setDecisionError('');
    if (!selectedInternship) return;

    try {
      let updated;
      const reviewerName = currentUser?.name || reviewerRole;
      const reviewerId = currentUser?.id || currentUser?.uid || 'KOMISYON_BASKANI';

      if (decisionModalMode === 'APPROVE') {
        updated = advanceInternshipStatus(selectedInternship, 'COMMISSION_APPROVE', {
          reviewerName,
          reviewerId,
          decisionNo: commissionDecisionNo,
          note: decisionNote || 'Bölüm Staj Komisyonu incelemesi sonucunda onaylandı.'
        });
        window.toast?.success?.(`✅ ${selectedInternship.studentName} için Staj Komisyon Onayı verildi!`);
      } else if (decisionModalMode === 'REVISE') {
        if (!decisionNote || decisionNote.trim().length < 5) {
          setDecisionError('Lütfen öğrenciye iletilecek revizyon/düzeltme gerekçesini en az 5 karakter olarak giriniz.');
          return;
        }
        updated = advanceInternshipStatus(selectedInternship, 'COMMISSION_REQUEST_REVISION', {
          reviewerName,
          reviewerId,
          revisionNote: decisionNote
        });
        window.toast?.info?.(`⚠️ ${selectedInternship.studentName} için revizyon talebi öğrenciye iletildi.`);
      } else if (decisionModalMode === 'REJECT') {
        if (!decisionNote || decisionNote.trim().length < 5) {
          setDecisionError('Lütfen ret karar gerekçesini en az 5 karakter olarak giriniz.');
          return;
        }
        updated = advanceInternshipStatus(selectedInternship, 'COMMISSION_REJECT', {
          reviewerName,
          reviewerId,
          rejectionNote: decisionNote
        });
        window.toast?.error?.(`❌ ${selectedInternship.studentName} staj başvurusu komisyonca reddedildi.`);
      } else if (decisionModalMode === 'GRADE') {
        updated = advanceInternshipStatus(selectedInternship, 'COMMISSION_FINAL_GRADE', {
          commissionScore: Number(commissionScore),
          graderName: reviewerName,
          tutanakNo: commissionDecisionNo,
          note: decisionNote || 'Staj defteri ve mülakat değerlendirmesi tamamlandı.'
        });
        window.toast?.success?.(`🎓 ${selectedInternship.studentName} için Final Notlandırma (S/U) tamamlandı!`);
      }

      if (onUpdateInternship && updated) {
        onUpdateInternship(updated);
      }

      setSelectedInternship(null);
      setDecisionModalMode(null);
      setDecisionNote('');
    } catch (err) {
      setDecisionError(err.message || 'İşlem sırasında bir hata oluştu.');
    }
  };

  const handleDownloadMinutesPdf = (item) => {
    const lines = [
      'İSTANBUL ESENYURT ÜNİVERSİTESİ',
      'BÖLÜM STAJ VE UYGULAMA KOMİSYONU',
      'RESMÎ KARAR TUTANAĞI',
      '------------------------------------------------------------',
      `Karar / Tutanak No: ${item.commissionDecisionNo || item.commissionDecisionTutanakNo || 'KMS-2026-001'}`,
      `Karar Tarihi: ${new Date(item.reviewedAt || Date.now()).toLocaleDateString('tr-TR')}`,
      `Fakülte: ${item.faculty || 'Mühendislik ve Doğa Bilimleri Fakültesi'}`,
      `Bölüm: ${item.department || ''}`,
      '------------------------------------------------------------',
      `Öğrenci Adı Soyadı: ${item.studentName}`,
      `Öğrenci Numarası: ${item.studentNo}`,
      `T.C. Kimlik No: ${item.tcNo}`,
      `Staj Yapılan Kurum: ${item.companyName}`,
      `SGK İşyeri Sicil No: ${item.sgkSicilNo}`,
      `Staj Başlangıç - Bitiş: ${item.startDate} / ${item.endDate} (${item.workDays} İş Günü)`,
      '------------------------------------------------------------',
      `SGK 5510/5-b Durumu: ${item.hasFamilyGss ? 'Sağlık Yardımı Alıyor (GSS Hariç, %1)' : 'Sağlık Yardımı Almıyor (GSS Dahil, %6)'}`,
      `Komisyon Kararı: ${item.status}`,
      `Komisyon Değerlendirme Notu: ${item.commissionNote || item.revisionNote || 'Uygundur.'}`,
      `İncelenen / Onaylayan: ${item.reviewerName || reviewerRole}`,
      '------------------------------------------------------------',
      'Komisyon Başkanı: ............................................ [İmza]',
      'Komisyon Üyesi: ................................................ [İmza]',
      'Komisyon Üyesi: ................................................ [İmza]'
    ];

    downloadReportPdf('komisyon-karar-tutanagi', `${item.studentName.replace(/\s+/g, '_')}_Komisyon_Karari`, lines);
    window.toast?.success?.('📄 Bölüm Staj Komisyonu Karar Tutanağı indirildi.');
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">
                  Akademik İnceleme
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  3308 & 5510 Onay Masası
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Bölüm Staj Komisyonu Onay Paneli
              </h2>
              <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
                Öğrencilerin Form-1 başvurularını, SGK 5510/5-b beyanlarını ve işyeri taahhütlerini inceleyip karar bağlayın.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
            <div className="px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-center">
              <span className="text-lg font-black text-amber-300 block">{pendingCount}</span>
              <span className="text-[9px] font-bold text-amber-200 uppercase tracking-wider">Bekleyen</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-orange-400/15 border border-orange-400/30 text-center">
              <span className="text-lg font-black text-orange-300 block">{revisionCount}</span>
              <span className="text-[9px] font-bold text-orange-200 uppercase tracking-wider">Revizyon</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-400/15 border border-emerald-400/30 text-center">
              <span className="text-lg font-black text-emerald-300 block">{approvedCount}</span>
              <span className="text-[9px] font-bold text-emerald-200 uppercase tracking-wider">Onaylı</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'Tümü' },
            { id: 'PENDING', label: `Onay Bekleyen (${pendingCount})` },
            { id: 'REVISION', label: `Revizyon (${revisionCount})` },
            { id: 'APPROVED', label: `Onaylanan (${approvedCount})` },
            { id: 'GRADED', label: `Notlandırılan (${gradedCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap cursor-pointer ${statusFilter === tab.id ? 'bg-[#990000] text-white shadow-md shadow-red-900/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Department & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#990000]"
          >
            <option value="ALL">Tüm Bölümler</option>
            <option value="Bilgisayar Mühendisliği">Bilgisayar Mühendisliği</option>
            <option value="Yazılım Mühendisliği">Yazılım Mühendisliği</option>
            <option value="Endüstri Mühendisliği">Endüstri Mühendisliği</option>
            <option value="İşletme">İşletme</option>
          </select>

          <div className="relative w-full md:w-60">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text"
              placeholder="Öğrenci, No veya Kurum Ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
            />
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Clock size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-bold">Kriterlere uygun staj başvurusu bulunamadı.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Öğrenci & Bölüm</th>
                  <th className="py-3.5 px-4">Staj Yeri & Kurum</th>
                  <th className="py-3.5 px-4">Tarih / İş Günü</th>
                  <th className="py-3.5 px-4">SGK 5510 Beyanı</th>
                  <th className="py-3.5 px-4">3308 Ücret</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm">{item.studentName}</div>
                      <div className="text-[11px] text-slate-500">{item.studentNo} • {item.department}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Building2 size={13} className="text-slate-400 shrink-0" />
                        <span>{item.companyName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[180px]">
                        Sicil: {item.sgkSicilNo}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{item.startDate} / {item.endDate}</div>
                      <div className="text-[10px] font-black text-emerald-700">{item.workDays} İş Günü {item.includeSaturdays ? '(6 Gün)' : ''}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.hasFamilyGss ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Aile GSS'li (%1 İK)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          GSS Yok (%6 Üniversite)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">
                        {item.isPaid ? `${item.monthlyWage || 0} ₺/Ay` : 'Ücretsiz'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black inline-flex items-center gap-1 ${
                        item.status === INTERNSHIP_STATUS.COMMISSION_PENDING ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        item.status === INTERNSHIP_STATUS.REVISION_REQUESTED ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                        item.status === INTERNSHIP_STATUS.COMMISSION_APPROVED || item.status === INTERNSHIP_STATUS.SGK_REGISTERED ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        item.status === INTERNSHIP_STATUS.GRADED_PASSED ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedInternship(item);
                            const defaultMode = (
                              item.status === INTERNSHIP_STATUS.NOTEBOOK_SUBMITTED ||
                              item.status === INTERNSHIP_STATUS.EMPLOYER_EVALUATED ||
                              item.status === INTERNSHIP_STATUS.GRADED_PASSED ||
                              item.status === INTERNSHIP_STATUS.GRADED_FAILED
                            ) ? 'GRADE' : 'APPROVE';
                            setDecisionModalMode(defaultMode);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#990000] text-white text-[11px] font-black transition cursor-pointer shadow-sm flex items-center gap-1"
                        >
                          <Eye size={13} />
                          <span>İncele & Karar</span>
                        </button>
                        <button
                          onClick={() => handleDownloadMinutesPdf(item)}
                          title="Komisyon Tutanağı İndir"
                          className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decision & Detail Modal */}
      {selectedInternship && decisionModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto font-sans">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-fade-in">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">
                  Komisyon Karar Masası
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedInternship.studentName} — Staj Dosyası İnceleme
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Öğrenci No: {selectedInternship.studentNo} • Bölüm: {selectedInternship.department}
                </p>
              </div>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {decisionError && (
              <div className="mx-6 sm:mx-8 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#990000] shrink-0" />
                <span>{decisionError}</span>
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              
              {/* Detailed Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400">İşletme Bilgileri</span>
                  <h4 className="text-sm font-black text-slate-900">{selectedInternship.companyName}</h4>
                  <p className="text-xs text-slate-600">Sicil No: <b>{selectedInternship.sgkSicilNo}</b></p>
                  <p className="text-xs text-slate-600">Yetkili: {selectedInternship.companyAuthorizedPerson} ({selectedInternship.companyAuthorizedEmail})</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400">Tarih & İş Günü</span>
                  <h4 className="text-sm font-black text-slate-900">{selectedInternship.startDate} — {selectedInternship.endDate}</h4>
                  <p className="text-xs text-emerald-700 font-bold">Toplam {selectedInternship.workDays} Fiilî İş Günü</p>
                  <p className="text-xs text-slate-500">{selectedInternship.includeSaturdays ? 'Cumartesi Dahil (Haftada 6 Gün)' : 'Haftada 5 Gün'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400">5510 / 5-b SGK Durumu</span>
                  <h4 className="text-xs font-black text-slate-900">
                    {selectedInternship.hasFamilyGss ? 'Aile Üzerinden Sağlık Yardımı Alıyor' : 'Sağlık Yardımı Almıyor (GSS Üniversitece Karşılanacak)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Başka İşte Sigortalı Çalışma: {selectedInternship.isEmployedElsewhere ? 'Evet' : 'Hayır'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400">3308 Ücret & Devlet Katkısı</span>
                  <h4 className="text-xs font-black text-slate-900">
                    {selectedInternship.isPaid ? `Ücretli (${selectedInternship.monthlyWage} TL/Ay)` : 'Ücretsiz'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    İşsizlik Fonu Devlet Katkısı: {selectedInternship.hasUnemploymentFundSupport ? 'Talep Ediliyor' : 'Talep Edilmiyor'}
                  </p>
                </div>
              </div>

              {/* Karar Eylemi Seçimi */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                  Komisyon Karar Türü *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionModalMode('APPROVE')}
                    className={`p-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${decisionModalMode === 'APPROVE' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  >
                    <CheckCircle2 size={15} /> Onayla
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionModalMode('REVISE')}
                    className={`p-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${decisionModalMode === 'REVISE' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  >
                    <RotateCcw size={15} /> Revizyon İste
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionModalMode('REJECT')}
                    className={`p-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${decisionModalMode === 'REJECT' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  >
                    <XCircle size={15} /> Reddet
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionModalMode('GRADE')}
                    className={`p-3 rounded-xl border text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${decisionModalMode === 'GRADE' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  >
                    <Award size={15} /> Final Notlandır
                  </button>
                </div>
              </div>

              {/* Karar Notu ve Ek Alanlar */}
              <div className="space-y-4">
                {decisionModalMode === 'GRADE' && (
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                    <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                      Staj Defteri & Mülakat Notlandırması (OBS Entegrasyonu)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Komisyon Mülakat & Defter Notu (0-100) *
                        </label>
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={commissionScore}
                          onChange={e => setCommissionScore(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          İşveren Notu (Gözlem Puanı)
                        </label>
                        <input 
                          type="text"
                          disabled
                          value={`${selectedInternship.employerScore || 90} / 100`}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                    {decisionModalMode === 'REVISE' ? 'Öğrenciye İletilecek Revizyon Notu *' :
                     decisionModalMode === 'REJECT' ? 'Ret Karar Gerekçesi *' :
                     'Komisyon Karar Notu & Açıklama'}
                  </label>
                  <textarea 
                    rows={3}
                    value={decisionNote}
                    onChange={e => setDecisionNote(e.target.value)}
                    placeholder={
                      decisionModalMode === 'REVISE' ? 'Örn: İşletmenin SGK sicil numarasında eksik hane tespit edildi, lütfen güncelleyiniz.' :
                      decisionModalMode === 'REJECT' ? 'Örn: Başvurulan kurumun çalışma alanı bölüm müfredatıyla örtüşmemektedir.' :
                      'Örn: Evraklar ve SGK beyanı uygun bulunmuştur.'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
              <button 
                type="button"
                onClick={() => setSelectedInternship(null)}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold cursor-pointer"
              >
                Vazgeç
              </button>

              <button 
                type="button"
                onClick={handleExecuteDecision}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-black transition flex items-center gap-2 shadow-lg cursor-pointer ${
                  decisionModalMode === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/25' :
                  decisionModalMode === 'REVISE' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-700/25' :
                  decisionModalMode === 'REJECT' ? 'bg-red-600 hover:bg-red-700 shadow-red-700/25' :
                  'bg-purple-600 hover:bg-purple-700 shadow-purple-700/25'
                }`}
              >
                <Check size={16} />
                <span>Kararı Kaydet ve Uygula</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
