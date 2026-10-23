/**
 * src/components/accreditation/QSWorldRankingReportCard.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) QS & THE Dünya Sıralaması İtibar ve İstihdam Rapor Kartı
 *
 * Kurumsal Kurallar (AGENTS.md):
 * - Resmi Kurum Adı: İstanbul Esenyurt Üniversitesi (İESÜ)
 * - Koordinatörlük: Kariyer Geliştirme Koordinatörlüğü
 * - Mükerrer Buton Yasağı: Tüm kontroller tek akış içinde
 */

import React, { useState, useMemo } from 'react';
import { 
  Award, Globe2, TrendingUp, ShieldCheck, Download, 
  ExternalLink, Building2, CheckCircle2, FileText, Printer, Sparkles 
} from 'lucide-react';
import { 
  computeQSMetrics, 
  generateGlobalQSRankingReport, 
  exportQSRankingReportHTML,
  GLOBAL_2000_TARGET_COMPANIES
} from '../../services/qsRankingWorkflow';
import { useTranslation } from '../../i18n';
import { toast } from '../shared/Toast';

export default function QSWorldRankingReportCard({
  alumni = [],
  students = [],
  corporateProtocols = [],
  employerRatings = []
}) {
  const { t, isEn } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const report = useMemo(() => {
    return generateGlobalQSRankingReport({
      alumni,
      students,
      corporateProtocols,
      employerRatings
    });
  }, [alumni, students, corporateProtocols, employerRatings]);

  const metrics = report.metrics;

  const handleExportReport = () => {
    try {
      setDownloading(true);
      const htmlContent = exportQSRankingReportHTML(report);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      }
      toast.success(isEn ? 'QS / THE Audit Dossier Generated!' : 'Resmî QS / THE Denetim Raporu Üretildi!');
    } catch (_) {
      toast.error('Rapor çıktısı alınamadı.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `IESU_QS_THE_Employability_Audit_${new Date().getFullYear()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(isEn ? 'Audit data downloaded!' : 'Denetim verisi indirildi!');
    } catch (_) {
      toast.error('İndirme başarısız.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#003399] uppercase tracking-wider mb-1">
            <Globe2 size={15} /> {t('qsRanking.title')}
          </div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            QS & THE Graduate Employability Rankings Audit Engine
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t('qsRanking.subtitle')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>JSON</span>
          </button>

          <button
            type="button"
            data-testid="export-qs-audit-report-btn"
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#003399] to-[#002266] hover:from-[#002b80] text-white font-black text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Printer size={14} />
            <span>{t('qsRanking.generateAuditReport')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Composite Score */}
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-1">
              {t('qsRanking.compositeScore')}
            </span>
            <div className="text-3xl font-black text-blue-900 font-mono">
              {metrics.compositeQSEmployabilityScore} <span className="text-sm font-normal text-blue-600">/ 100</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-blue-800 bg-white/80 px-2 py-0.5 rounded-lg border border-blue-200 mt-2 inline-block">
            {metrics.projectedRankTier}
          </span>
        </div>

        {/* 6-Month Employment */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
              {t('qsRanking.sixMonthRate')}
            </span>
            <div className="text-3xl font-black text-emerald-900 font-mono">
              %{metrics.graduateEmploymentRate6Months}
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 mt-2 block">
            {t('qsRanking.twelveMonthVerified', { rate: metrics.graduateEmploymentRate12Months })}
          </span>
        </div>

        {/* Fortune 500 Placement */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
              Fortune 500 / Global 2000
            </span>
            <div className="text-3xl font-black text-amber-900 font-mono">
              %{metrics.fortune500Global2000PlacementRate}
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-800 mt-2 block">
            Google, Siemens, Amazon, ASELSAN, Baykar vb.
          </span>
        </div>

        {/* Employer Reputation */}
        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block mb-1">
              {t('qsRanking.reputationScore')}
            </span>
            <div className="text-3xl font-black text-purple-900 font-mono">
              {metrics.employerReputationIndex} <span className="text-sm font-normal text-purple-600">/ 100</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-800 mt-2 block">
            {t('qsRanking.activeProtocolsNote', { count: metrics.activeProtocolCount })}
          </span>
        </div>
      </div>

      {/* Target Companies Strip */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Building2 size={14} className="text-[#003399]" />
            {isEn ? 'Accredited Global 2000 & Fortune 500 Employer Representation' : 'Akredite Global 2000 & Fortune 500 İşveren Temsiliyeti'}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {t('qsRanking.enterpriseScanned', { count: GLOBAL_2000_TARGET_COMPANIES.length })}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {GLOBAL_2000_TARGET_COMPANIES.slice(0, 15).map((comp, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs"
            >
              {comp}
            </span>
          ))}
          <span className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[11px] font-bold text-blue-700">
            {t('qsRanking.moreEnterprises')}
          </span>
        </div>
      </div>

      {/* Audit Indicators Table */}
      <div className="space-y-3">
        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          {t('qsRanking.methodologyAuditTitle')}
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-black tracking-wider">
              <tr>
                <th className="p-3">{t('qsRanking.colIndicator')}</th>
                <th className="p-3">{t('qsRanking.colPillar')}</th>
                <th className="p-3">{t('qsRanking.colObserved')}</th>
                <th className="p-3">{t('qsRanking.colBenchmark')}</th>
                <th className="p-3">{t('qsRanking.colStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.auditIndicators.map((ind, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 font-bold text-slate-900">{ind.indicator}</td>
                  <td className="p-3 text-slate-600">{ind.pillar}</td>
                  <td className="p-3 font-mono font-bold text-[#003399]">{ind.observedValue}</td>
                  <td className="p-3 text-slate-500 font-mono">{ind.benchmarkTarget}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                      <CheckCircle2 size={12} /> {ind.complianceStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Verification Stamp */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{report.reportId}</span>
        </div>
        <div>
          {t('qsRanking.auditVerified')}
        </div>
      </div>
    </div>
  );
}
