/**
 * src/components/global/EuroPassExportModal.jsx
 * İstanbul Esenyurt Üniversitesi (İESÜ) EuroPass & Bologna Diploma Eki İhraç Modalı
 *
 * Kurumsal Kurallar (AGENTS.md):
 * - Resmi Kurum Adı: İstanbul Esenyurt Üniversitesi (İESÜ)
 * - Koordinatörlük: Kariyer Geliştirme Koordinatörlüğü
 * - Mükerrer Buton Yasağı: Eylemler tek ve net eylem çubuğunda
 * - SafeAvatar kullanımı
 */

import React, { useState, useMemo } from 'react';
import { 
  X, Download, FileText, Check, Copy, Globe, ShieldCheck, 
  ExternalLink, Printer, Award, Languages, GraduationCap, CheckCircle2 
} from 'lucide-react';
import SafeAvatar from '../shared/SafeAvatar';
import Logo from '../Logo';
import { 
  generateEuroPassCVJsonLD, 
  generateBolognaDiplomaSupplement, 
  generateErasmusLearningAgreement,
  exportEuroPassHTML,
  exportDocumentToPrintableHTML,
  EUROPASS_STANDARDS
} from '../../services/euroPassWorkflow';
import { useTranslation } from '../../i18n';
import { toast } from '../shared/Toast';

export default function EuroPassExportModal({ isOpen, onClose, studentProfile = {} }) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' | 'ds' | 'erasmus'
  const [exportLang, setExportLang] = useState(language === 'en' ? 'en' : 'tr');
  const [copied, setCopied] = useState(false);

  const isEn = exportLang === 'en';

  const cvJsonLd = useMemo(() => {
    return generateEuroPassCVJsonLD(studentProfile, { language: exportLang });
  }, [studentProfile, exportLang]);

  const diplomaSupplement = useMemo(() => {
    return generateBolognaDiplomaSupplement(studentProfile, { language: exportLang });
  }, [studentProfile, exportLang]);

  const erasmusAgreement = useMemo(() => {
    return generateErasmusLearningAgreement(studentProfile, {}, { language: exportLang });
  }, [studentProfile, exportLang]);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    try {
      const payload = activeTab === 'cv' ? cvJsonLd : activeTab === 'ds' ? diplomaSupplement : erasmusAgreement;
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      toast.success(isEn ? 'JSON-LD copied to clipboard!' : 'JSON-LD panoya kopyalandı!');
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      toast.error('Kopyalama başarısız oldu.');
    }
  };

  const handleDownloadJsonLd = () => {
    try {
      const payload = activeTab === 'cv' ? cvJsonLd : activeTab === 'ds' ? diplomaSupplement : erasmusAgreement;
      const fileName = activeTab === 'cv' 
        ? `EuroPass_CV_${studentProfile.studentNo || 'IESU'}.jsonld`
        : activeTab === 'ds'
          ? `Bologna_Diploma_Supplement_${studentProfile.studentNo || 'IESU'}.json`
          : `Erasmus_Learning_Agreement_${studentProfile.studentNo || 'IESU'}.json`;

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/ld+json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(isEn ? 'File downloaded successfully!' : 'Dosya başarıyla indirildi!');
    } catch (_) {
      toast.error('Dosya indirilemedi.');
    }
  };

  const handlePrintHTML = () => {
    try {
      const payload = activeTab === 'cv' ? cvJsonLd : activeTab === 'ds' ? diplomaSupplement : erasmusAgreement;
      const htmlContent = exportDocumentToPrintableHTML(activeTab, payload, { language: exportLang });
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      }
    } catch (_) {
      toast.error('Yazdırma penceresi açılamadı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="europass-modal-title"
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#003399] via-[#002266] to-[#990000] p-6 text-white relative">
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <ShieldCheck size={14} /> {isEn ? 'EUROPASS & BOLOGNA EHEA' : 'EUROPASS & BOLOGNA EHEA STANDARDI'}
            </span>
            <span className="text-xs text-blue-200 font-mono">
              Erasmus Code: {EUROPASS_STANDARDS.ERASMUS_CODE}
            </span>
          </div>

          <h2 id="europass-modal-title" className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <GraduationCap size={26} className="text-amber-300" />
            {isEn ? 'EuroPass Standard CV & Bologna Diploma Supplement' : 'EuroPass Standartlarında CV & Bologna Diploma Eki'}
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl mt-1">
            {isEn 
              ? 'Institutional credential exported in 100% accordance with European Commission Decision (EU) 2018/646 and EHEA guidelines.'
              : 'Avrupa Komisyonu (EU) 2018/646 ve EHEA yönergelerine %100 uyumlu, resmi kurumsal dijital kimlik ve transkript ihracı.'}
          </p>

          {/* Language Selector in Header */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-bold">{isEn ? 'Document Language:' : 'Belge Dili:'}</span>
              <button
                type="button"
                onClick={() => setExportLang('tr')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  exportLang === 'tr' ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>🇹🇷</span> <span>Türkçe</span>
              </button>
              <button
                type="button"
                onClick={() => setExportLang('en')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  exportLang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>🇬🇧</span> <span>English</span>
              </button>
            </div>

            <span className="text-xs font-mono text-amber-200 hidden sm:inline">
              EQF Level: 6 (Bachelor)
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('cv')}
            className={`pb-3 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'cv'
                ? 'border-[#003399] text-[#003399]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={15} /> {isEn ? 'EuroPass Format CV' : 'EuroPass Format CV'}
          </button>
          <button
            onClick={() => setActiveTab('ds')}
            className={`pb-3 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'ds'
                ? 'border-[#003399] text-[#003399]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={15} /> {isEn ? 'Bologna Diploma Supplement (DS)' : 'Bologna Diploma Eki (DS)'}
          </button>
          <button
            onClick={() => setActiveTab('erasmus')}
            className={`pb-3 px-3 text-xs font-black transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'erasmus'
                ? 'border-[#003399] text-[#003399]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe size={15} /> {isEn ? 'Erasmus+ Traineeship Agreement' : 'Erasmus+ Staj Anlaşması (LAT)'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'cv' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-blue-900 text-sm">
                    {cvJsonLd.person.givenNames} {cvJsonLd.person.familyName}
                  </h4>
                  <p className="text-blue-700 text-xs">
                    {cvJsonLd.educationAndTraining[0]?.title} • {EUROPASS_STANDARDS.INSTITUTION_NAME}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-800">
                    GPA: {cvJsonLd.educationAndTraining[0]?.gpaValue} / 4.00
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <h5 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    {isEn ? 'Work & Internship Experience' : 'Staj ve İş Deneyimleri (3308 SGK)'}
                  </h5>
                  {cvJsonLd.workExperience.map((exp, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                      <p className="font-bold text-slate-900">{exp.jobTitle}</p>
                      <p className="text-slate-600">{exp.employer} ({exp.startDate} - {exp.endDate})</p>
                      <p className="text-slate-500 text-[11px] mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <h5 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Languages size={14} className="text-blue-600" />
                    {isEn ? 'Languages (CEFR Grid)' : 'Diller ve CEFR Düzeyleri'}
                  </h5>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span>{isEn ? 'Mother Tongue:' : 'Ana Dil:'}</span>
                      <span className="text-slate-900 font-mono">Türkçe (Native)</span>
                    </div>
                    {cvJsonLd.otherLanguages.map((ol, idx) => (
                      <div key={idx} className="border-t border-slate-100 pt-1.5 flex justify-between">
                        <span className="font-medium text-slate-800">{ol.languageName}</span>
                        <span className="font-mono font-bold text-blue-700">
                          Listening {ol.proficiency.listening} / Reading {ol.proficiency.reading}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* JSON-LD Preview Accordion */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 text-slate-200 px-4 py-2 font-mono text-[11px] flex items-center justify-between">
                  <span>W3C & EuroPass JSON-LD Payload Preview</span>
                  <span className="text-emerald-400">@context: europa.eu/europass</span>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[10px] max-h-48 overflow-y-auto leading-relaxed">
                  {JSON.stringify(cvJsonLd, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ds' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-900 text-xs uppercase tracking-wider">
                    {diplomaSupplement.section2.qualificationTitle}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-800">
                    DS No: {diplomaSupplement.dsNumber}
                  </span>
                </div>
                <p className="text-amber-800 text-xs mt-1">
                  {diplomaSupplement.section2.awardingInstitutionEn} • {diplomaSupplement.section3.levelOfQualification}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-black text-slate-800 block mb-1">
                    {diplomaSupplement.section3.title}
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    {diplomaSupplement.section3.officialLengthOfProgramme}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-black text-slate-800 block mb-1">
                    {diplomaSupplement.section4.title}
                  </span>
                  <p className="text-slate-600 text-[11px]">
                    GPA: {diplomaSupplement.section4.gpa} / 4.00 • ECTS: {diplomaSupplement.section4.ectsGrade} ({diplomaSupplement.section4.performanceLabel})
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">
                  {diplomaSupplement.section7.title}
                </span>
                <p className="text-slate-600 font-mono text-[11px]">
                  Checksum: {diplomaSupplement.verificationCode}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'erasmus' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-black text-emerald-900 text-xs uppercase tracking-wider">
                    Erasmus+ Learning Agreement for Traineeships (LAT)
                  </h4>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    {erasmusAgreement.academicYear}
                  </span>
                </div>
                <p className="text-emerald-700 text-xs">
                  {erasmusAgreement.receivingOrganisation.name} ({erasmusAgreement.receivingOrganisation.city}, {erasmusAgreement.receivingOrganisation.country})
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-black text-slate-900 text-xs">{erasmusAgreement.tableA.title}</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                  {erasmusAgreement.tableA.detailedProgramme.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50 text-xs space-y-1">
                <span className="font-black text-blue-900">{erasmusAgreement.tableB.title}</span>
                <p className="text-blue-800 text-[11px]">{erasmusAgreement.tableB.insuranceCoverage.accidentInsurance}</p>
                <p className="text-blue-900 font-bold mt-1">ECTS Awarded: {erasmusAgreement.tableB.ectsAwarded} AKTS</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar (Single, non-duplicated action bar at natural end of flow) */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 font-medium">
            {isEn 
              ? 'Compliant with Council of Europe, UNESCO and European Commission DS Guidelines.'
              : 'Avrupa Konseyi, UNESCO ve Avrupa Komisyonu DS Kılavuzlarına uygundur.'}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyJson}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? (isEn ? 'Copied' : 'Kopyalandı') : (isEn ? 'Copy JSON-LD' : 'JSON-LD Kopyala')}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintHTML}
              className="px-3.5 py-2 rounded-xl border border-[#003399]/30 bg-[#003399]/10 hover:bg-[#003399]/20 text-[#003399] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>{isEn ? 'Print / Export HTML' : 'Resmî Çıktı / HTML'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJsonLd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#003399] to-[#002266] hover:from-[#002b80] hover:to-[#001a4d] text-white font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Download size={15} />
              <span>{isEn ? 'Download EuroPass JSON-LD' : 'EuroPass JSON-LD İndir'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
