import React, { useState, useMemo, useRef } from 'react';
import {
  FileCheck2, AlertTriangle, CheckCircle2, Sparkles, Copy, Check,
  Target, Zap, RefreshCw, X, ShieldAlert, FileText, BarChart3, Layers,
  Upload, UserCheck
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import {
  scanResumeAgainstJob,
  generateAtsOptimizationSuggestions,
  saveAtsScanResult
} from '../../services/atsScannerWorkflow';

export default function ATSResumeScannerModal({
  isOpen = true,
  onClose,
  initialJob = null,
  initialResumeText = ''
}) {
  const currentUser = useAppStore(state => state.currentUser);
  const storeJobs = useAppStore(state => state.jobs) || [];

  // Default sample resume built from user profile or realistic mock
  const defaultResume = useMemo(() => {
    if (initialResumeText) return initialResumeText;
    const name = currentUser?.name || 'Caner Doğan';
    const email = currentUser?.email || 'caner.dogan@ogr.esenyurt.edu.tr';
    const dept = currentUser?.department || 'Yazılım Mühendisliği';
    return `${name} | ${email} | +90 532 100 20 30 | linkedin.com/in/canerdogan
İstanbul Esenyurt Üniversitesi (İESÜ) - Mühendislik ve Doğa Bilimleri Fakültesi

Özet / Kariyer Hedefi:
İstanbul Esenyurt Üniversitesi ${dept} öğrencisiyim. Modern web ve bulut teknolojilerinde uçtan uca çözümler geliştirme konusunda tutkuluyum.

İş & Staj Deneyimi:
- Yazılım Stajyeri (2024): React, TypeScript ve Tailwind CSS ile kurumsal panel arayüzleri geliştirdi ve sayfa yükleme süresini %35 optimize etti.
- 4 kişilik çevik takımla CI/CD süreçlerini koordine etti ve 2 adet canlı mikroservis projesi tamamladı.

Eğitim:
İstanbul Esenyurt Üniversitesi - ${dept} (GPA: 3.48 / 4.00, 2021-2025)

Yetkinlikler & Beceriler:
React, JavaScript, TypeScript, Node.js, Git, REST API, Docker, Takım Çalışması, Analitik Düşünme, Problem Çözme.

Projeler & Sertifikalar:
- Akıllı Kampüs Portalı: React ve Node.js mimarisiyle 500+ aktif öğrencinin kullandığı açık kaynak platform.
- YÖK & EuroPass KGB Sertifikası.`;
  }, [currentUser, initialResumeText]);

  // Selected or custom job
  const [selectedJobId, setSelectedJobId] = useState(initialJob?.id || 'custom');
  const [jobTitle, setJobTitle] = useState(initialJob?.title || 'Frontend & React Geliştirici');
  const [jobDescription, setJobDescription] = useState(
    initialJob?.description ||
    `Aranan Nitelikler:
- React, TypeScript, Tailwind CSS ve Modern JavaScript (ES6+) konularında güçlü deneyim.
- Node.js, REST API ve Docker konteyner mimarilerine aşinalık.
- AWS veya Azure bulut sistemlerinde temel CI/CD deneyimi.
- Takım çalışmasına yatkın, problem çözme ve analitik düşünme yeteneği yüksek.
- EuroPass formatına uygun, ölçülebilir başarı metrikleri sunabilen adaylar tercih sebebidir.`
  );

  const [resumeText, setResumeText] = useState(defaultResume);
  const [scanReport, setScanReport] = useState(() => {
    return scanResumeAgainstJob(defaultResume, jobDescription, { jobTitle });
  });

  const [activeKeywordTab, setActiveKeywordTab] = useState('all'); // 'all', 'missing', 'matched'
  const [copiedSuggestion, setCopiedSuggestion] = useState(false);

  // When student picks a job from the store
  const handleSelectJob = (id) => {
    setSelectedJobId(id);
    if (id === 'custom') return;
    const found = storeJobs.find(j => String(j.id) === String(id));
    if (found) {
      const newTitle = found.title || 'Pozisyon';
      const newDesc = found.description || found.content || '';
      setJobTitle(newTitle);
      setJobDescription(newDesc);
      const report = scanResumeAgainstJob(resumeText, newDesc, { jobTitle: newTitle });
      setScanReport(report);
      saveAtsScanResult(report);
    }
  };

  const fileInputRef = useRef(null);

  const handleLoadProfileResume = () => {
    const name = currentUser?.name || 'Öğrenci';
    const email = currentUser?.email || 'ogrenci@ogr.esenyurt.edu.tr';
    const dept = currentUser?.department || 'Bölüm Belirtilmemiş';
    const faculty = currentUser?.faculty || 'Fakülte';
    const skills = Array.isArray(currentUser?.skills) ? currentUser.skills.join(', ') : (currentUser?.skills || 'React, Problem Çözme, Takım Çalışması');
    const langs = Array.isArray(currentUser?.languages) ? currentUser.languages.map(l => `${l.name} (${l.level || 'Orta'})`).join(', ') : 'İngilizce (B2)';
    const experiences = Array.isArray(currentUser?.experiences) && currentUser.experiences.length > 0
      ? currentUser.experiences.map(exp => `- ${exp.title || exp.position || 'Stajyer'} (${exp.company || 'Firma'}): ${exp.description || 'Görev ve sorumluluklar başarıyla yerine getirildi.'}`).join('\n')
      : `- Stajyer / Proje Deneyimi: ${dept} alanında kurumsal projelerde görev aldı ve vaka analizleri gerçekleştirdi.`;

    const generated = `${name} | ${email} | ${currentUser?.phone || '+90 5xx xxx xx xx'}
İstanbul Esenyurt Üniversitesi (İESÜ) - ${faculty}

Özet & Kariyer Hedefi:
İstanbul Esenyurt Üniversitesi ${dept} öğrencisiyim. ${currentUser?.targetSector || 'Sektörel alanda'} yenilikçi, analitik ve ölçülebilir değer üreten projelere katkı sağlamayı hedefliyorum.

Eğitim:
İstanbul Esenyurt Üniversitesi - ${dept} (Öğrenci No: ${currentUser?.studentNo || '2023010xxx'})

Yetkinlikler & Beceriler:
${skills}

Yabancı Diller:
${langs}

Deneyimler & Projeler:
${experiences}

KGB Akreditasyonu:
İESÜ Kariyer Geliştirme Koordinatörlüğü Onaylı Kariyer Gelişim Belgesi & EuroPass Eki.`;

    setResumeText(generated);
    const report = scanResumeAgainstJob(generated, jobDescription, { jobTitle });
    setScanReport(report);
    saveAtsScanResult(report);
    if (window.toast) window.toast.success("Profilinizdeki akademik ve mesleki veriler ATS metnine aktarıldı!");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.txt') || file.type.includes('text')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        setResumeText(text);
        const report = scanResumeAgainstJob(text, jobDescription, { jobTitle });
        setScanReport(report);
        saveAtsScanResult(report);
        if (window.toast) window.toast.success(`${file.name} başarıyla aktarıldı.`);
      };
      reader.readAsText(file);
    } else {
      const fallbackText = `${currentUser?.name || file.name.replace(/\.[^/.]+$/, "")} | ${currentUser?.email || 'ogrenci@ogr.esenyurt.edu.tr'}
Dosya: ${file.name} (${(file.size / 1024).toFixed(1)} KB)
İstanbul Esenyurt Üniversitesi - ${currentUser?.department || 'Öğrenci'}

Özet:
${file.name} belgesi ATS tarama sistemine bağlandı.

Yetkinlikler:
${Array.isArray(currentUser?.skills) ? currentUser.skills.join(', ') : (currentUser?.skills || 'React, TypeScript, Problem Çözme, Analitik Düşünme')}`;
      setResumeText(fallbackText);
      const report = scanResumeAgainstJob(fallbackText, jobDescription, { jobTitle });
      setScanReport(report);
      saveAtsScanResult(report);
      if (window.toast) window.toast.success(`${file.name} dosyası başarıyla seçildi.`);
    }
  };

  const handleRunScan = () => {
    const report = scanResumeAgainstJob(resumeText, jobDescription, { jobTitle });
    setScanReport(report);
    saveAtsScanResult(report);
  };

  const optimizationSuggestions = useMemo(() => {
    if (!scanReport) return null;
    return generateAtsOptimizationSuggestions(scanReport, jobTitle);
  }, [scanReport, jobTitle]);

  const handleCopySuggestions = () => {
    if (!optimizationSuggestions) return;
    const textToCopy = `Önerilen Profesyonel Özet:\n${optimizationSuggestions.suggestedSummary}\n\nÖnerilen Başarı Maddeleri:\n${optimizationSuggestions.suggestedBulletPoints.join('\n')}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedSuggestion(true);
    setTimeout(() => setCopiedSuggestion(false), 2000);
  };

  const displayedKeywords = useMemo(() => {
    if (!scanReport) return [];
    if (activeKeywordTab === 'missing') return scanReport.missingKeywords || [];
    if (activeKeywordTab === 'matched') return scanReport.matchedKeywords || [];
    return [
      ...(scanReport.missingKeywords || []).map(k => ({ ...k, isMissing: true })),
      ...(scanReport.matchedKeywords || []).map(k => ({ ...k, isMissing: false }))
    ];
  }, [scanReport, activeKeywordTab]);

  if (!isOpen) return null;

  const score = scanReport?.overallScore || 0;
  const scoreColor = score >= 75 ? 'text-emerald-600 border-emerald-500 bg-emerald-50' : score >= 50 ? 'text-amber-600 border-amber-500 bg-amber-50' : 'text-red-600 border-red-500 bg-red-50';
  const scoreBadge = score >= 75 ? 'ATS Filtresini Güçlü Geçer (%80+)' : score >= 50 ? 'Geliştirilebilir - İnceleme Eşiğinde' : 'Yüksek Otomatik Eleme Riski';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-600/30 border border-red-400/40 flex items-center justify-center shadow-inner">
              <FileCheck2 size={24} className="text-red-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Yapay Zekâ ATS Uyum Tarayıcısı & CV Optimizasyonu
                </h2>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/30 text-red-200 border border-red-400/40">
                  Global Standard
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                İstanbul Esenyurt Üniversitesi (İESÜ) | Kariyer Geliştirme Koordinatörlüğü
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
              title="Kapat"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
          {/* Top Configuration: Job & Resume Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {/* Target Job Column */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Target size={15} className="text-red-600" />
                Hedef Pozisyon & İlan Metni
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedJobId}
                  onChange={(e) => handleSelectJob(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-red-500"
                >
                  <option value="custom">Özel İlan Metni / Serbest Giriş</option>
                  {storeJobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.company || 'Kurum'} - {job.title}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Hedef Unvan (Örn: React Geliştirici)"
                className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-900"
              />
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="İlan aranan nitelikler metnini buraya yapıştırın..."
                className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-mono resize-none"
              />
            </div>

            {/* Resume Text Column */}
            <div className="space-y-2 flex flex-col">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <FileText size={15} className="text-blue-600" />
                  Öğrenci Özgeçmiş Metni (CV)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadProfileResume}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    title="İESÜ Profil bilgilerinizden otomatik CV metni oluşturur"
                  >
                    <UserCheck size={12} /> Profilimden Çek
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                    title="PDF, DOCX veya TXT belgesi yükleyin"
                  >
                    <Upload size={12} /> Dosya Yükle
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setResumeText(defaultResume)}
                    className="text-[11px] font-bold text-slate-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={12} /> Örnek
                  </button>
                </div>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={7}
                placeholder="CV metninizi buraya yapıştırın veya 'Profilimden Çek' butonuna basarak anında aktarın..."
                className="w-full text-xs p-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-mono flex-1 resize-none focus:border-[#990000] focus:ring-1 focus:ring-[#990000] outline-none"
              />
              <button
                onClick={handleRunScan}
                className="w-full py-2.5 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white rounded-lg text-xs font-black shadow-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.99]"
              >
                <Zap size={15} /> ATS Taramasını Yenile & Skoru Hesapla
              </button>
            </div>
          </div>

          {/* Results Overview: Score Card & Engines */}
          {scanReport && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Overall Score Badge */}
              <div className={`p-4 rounded-xl border-2 ${scoreColor} flex flex-col items-center justify-center text-center shadow-xs md:col-span-1`}>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  ATS Uyum Skoru
                </span>
                <div className="text-4xl font-black mb-1">
                  %{score}
                </div>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-current shadow-2xs">
                  {scoreBadge}
                </span>
                <span className="text-[10px] text-gray-500 mt-2">
                  {scanReport.matchedCount} / {scanReport.totalJobKeywords} Anahtar Kelime
                </span>
              </div>

              {/* Sub-Metric Gauges */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-gray-200/60 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">Kelime Eşleşmesi</span>
                  <span className="text-xl font-black text-gray-900">%{scanReport.breakdown?.keywordMatchPercent || 0}</span>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${scanReport.breakdown?.keywordMatchPercent || 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200/60 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">ATS Formatı</span>
                  <span className="text-xl font-black text-gray-900">%{scanReport.breakdown?.atsFormatScore || 0}</span>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${scanReport.breakdown?.atsFormatScore || 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200/60 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">Metrik & KPI Gücü</span>
                  <span className="text-xl font-black text-gray-900">%{scanReport.breakdown?.impactScore || 0}</span>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${scanReport.breakdown?.impactScore || 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200/60 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 block mb-1">Bölüm Bütünlüğü</span>
                  <span className="text-xl font-black text-gray-900">
                    {scanReport.formattingResult?.detectedSections?.length || 0}/6
                  </span>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${((scanReport.formattingResult?.detectedSections?.length || 0) / 6) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ATS Engine Compatibility Matrix */}
          {scanReport?.systemCompatibility && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers size={16} className="text-red-600" />
                Kurumsal ATS Motorları Uyumluluk Analizi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(scanReport.systemCompatibility).map(([key, item]) => (
                  <div key={key} className="p-3 rounded-lg border border-gray-100 bg-slate-50/50 hover:bg-slate-50 transition">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-gray-900">{item.name}</span>
                      <span className="text-xs font-black text-slate-700">%{item.compatibility}</span>
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.verdict.includes('Yüksek') || item.verdict.includes('Mükemmel')
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.verdict.includes('Orta')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.verdict}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-2 line-clamp-2">{item.notes}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Gap Matrix */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={16} className="text-blue-600" />
                Anahtar Kelime Boşluk Analizi (Keyword Gap)
              </h3>
              <div className="flex gap-1.5 text-xs">
                <button
                  onClick={() => setActiveKeywordTab('all')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                    activeKeywordTab === 'all' ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tümü ({scanReport?.totalJobKeywords || 0})
                </button>
                <button
                  onClick={() => setActiveKeywordTab('missing')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                    activeKeywordTab === 'missing' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Eksik Anahtarlar ({scanReport?.missingCount || 0})
                </button>
                <button
                  onClick={() => setActiveKeywordTab('matched')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                    activeKeywordTab === 'matched' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Eşleşenler ({scanReport?.matchedCount || 0})
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {displayedKeywords.length === 0 ? (
                <p className="text-xs text-gray-500 italic p-2">Bu filtrede gösterilecek anahtar kelime bulunamadı.</p>
              ) : (
                displayedKeywords.map((item, idx) => {
                  const isMissing = item.isMissing ?? (item.countInResume === 0);
                  return (
                    <div
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
                        isMissing
                          ? 'bg-red-50/80 text-red-900 border-red-200'
                          : 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {isMissing ? (
                        <AlertTriangle size={13} className="text-red-600 shrink-0" />
                      ) : (
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                      )}
                      <span>{item.keyword}</span>
                      <span className="text-[10px] font-normal px-1 py-0.2 rounded bg-white/70 border border-current">
                        {item.category}
                      </span>
                      {!isMissing && (
                        <span className="text-[10px] text-emerald-700">({item.countInResume}x)</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Optimization Suggestions */}
          {optimizationSuggestions && (
            <div className="bg-gradient-to-r from-red-50/70 via-white to-amber-50/50 rounded-xl p-4 border border-red-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-red-700" />
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Yapay Zekâ CV Optimizasyon & İlan Uyarlama Önerisi
                  </h4>
                </div>
                <button
                  onClick={handleCopySuggestions}
                  className="px-3 py-1 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
                >
                  {copiedSuggestion ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiedSuggestion ? 'Kopyalandı!' : 'Önerileri Kopyala'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-3 rounded-lg border border-gray-200/80">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Önerilen ATS Uyumlu Profesyonel Özet:
                  </span>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {optimizationSuggestions.suggestedSummary}
                  </p>
                </div>

                {optimizationSuggestions.suggestedBulletPoints.length > 0 && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200/80">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Önerilen Ölçülebilir Başarı Maddeleri (Eksik Anahtar Kelimeler Entegre):
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-700">
                      {optimizationSuggestions.suggestedBulletPoints.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Formatting & Parse Verification Checklist */}
          {scanReport?.formattingResult?.issues && scanReport.formattingResult.issues.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-2xs">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldAlert size={16} className="text-amber-600" />
                ATS Formatı ve Ayrıştırma İyileştirme Noktaları ({scanReport.formattingResult.issues.length})
              </h4>
              <div className="space-y-2">
                {scanReport.formattingResult.issues.map((issue, idx) => (
                  <div key={idx} className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-200/60 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-0.5">
                      <span className={`w-2 h-2 rounded-full ${issue.status === 'fail' ? 'bg-red-600' : 'bg-amber-500'}`} />
                      {issue.rule}
                    </div>
                    <p className="text-gray-600 mb-1">{issue.description}</p>
                    <p className="text-emerald-800 font-medium text-[11px] bg-emerald-50/70 p-1.5 rounded">
                      💡 Öneri: {issue.fixSuggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Single Action Bar (No duplicates per AGENTS.md) */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-gray-500 hidden sm:block">
            Tüm taramalar cihazınızda yerel ve KVKK güvencesiyle işlenir.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Pencereyi Kapat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
