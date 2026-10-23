import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Briefcase, GraduationCap, Building2, Calendar, Target, PhoneCall, MailCheck, CheckCircle2, FileText, Download, Award, ShieldCheck, Sparkles, RefreshCw, Layers } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';
import PanelHeader from './PanelHeader';
import CMSWorldMap from './CMSWorldMap';
import useAppStore from '../../store/useAppStore';
import { computeKpi } from '../../kpi/compute';
import KpiStatusView from '../../kpi/KpiStatusView';
import { checkupToEmploymentDeclarations } from '../../kpi/adapters';
import { 
  calculateYokakIndicators, 
  calculatePukoScorecards, 
  exportYokakAuditPdf, 
  downloadYokakAuditCsv, 
  SAMPLE_ACCREDITATION_DECLARATIONS, 
  ACCREDITATION_STANDARDS,
  maskTCKN,
  isEmploymentInField,
  isPlacementUnder6m
} from '../../services/accreditationWorkflow';
import EmploymentPyramids from '../accreditation/EmploymentPyramids';
import PUKOCaliteKarnesi from '../accreditation/PUKOCaliteKarnesi';

export default function CMSAnalytics({ students = [], alumni = [], companies = [], jobs = [], applications = [] }) {
  const [accreditationTab, setAccreditationTab] = useState('pyramids'); // 'pyramids' | 'puko' | 'audit_log'
  const checkupRecords = useAppStore(state => state.checkupRecords) || [];
  const employmentDeclarations = useAppStore(state => state.employmentDeclarations) || [];
  const pukoScorecardsStore = useAppStore(state => state.pukoScorecards) || [];
  const updatePukoScorecard = useAppStore(state => state.updatePukoScorecard);
  const internships = useAppStore(state => state.internships) || [];
  const surveyInvites = useAppStore(state => state.surveyInvites) || [];
  const directSurveyResponses = useAppStore(state => state.surveyResponses) || [];
  const rawSurveys = useAppStore(state => state.surveys) || [];
  const eventRegistrations = useAppStore(state => state.eventRegistrations) || [];
  const period = '2026-H1';

  // Merge direct surveyResponses and responses embedded in survey templates
  const surveyResponses = useMemo(() => {
    const fromSurveys = rawSurveys.flatMap(s => (s.responses || []).map(r => ({
      ...r,
      surveyId: s.id,
      targetAudience: s.targetAudience
    })));
    return [...directSurveyResponses, ...fromSurveys];
  }, [directSurveyResponses, rawSurveys]);

  // Gerçek beyanlar veya örnek akreditasyon havuzu (boş veri çökmesini engeller)
  const effectiveDeclarations = useMemo(() => {
    if (employmentDeclarations && employmentDeclarations.length > 0) return employmentDeclarations;
    if (checkupRecords && checkupRecords.length > 0) return checkupToEmploymentDeclarations(checkupRecords);
    return SAMPLE_ACCREDITATION_DECLARATIONS;
  }, [employmentDeclarations, checkupRecords]);

  // YÖK / YÖKAK Göstergeleri ve Piramitleri
  const yokakIndicators = useMemo(() => {
    return calculateYokakIndicators({
      declarations: effectiveDeclarations,
      checkupRecords,
      period
    });
  }, [effectiveDeclarations, checkupRecords, period]);

  // PUKÖ Kalite Karneleri (Mağduriyet/silinme olmadan birleştirilir)
  const computedPukoScorecards = useMemo(() => {
    const baseCards = calculatePukoScorecards({
      declarations: effectiveDeclarations,
      alumniSurveyResponses: surveyResponses,
      employerSurveyResponses: surveyResponses,
    });
    if (!pukoScorecardsStore || pukoScorecardsStore.length === 0) {
      return baseCards;
    }
    const storeMap = new Map(pukoScorecardsStore.map(c => [c.department, c]));
    return baseCards.map(base => {
      const saved = storeMap.get(base.department);
      return saved ? { ...base, ...saved } : base;
    });
  }, [pukoScorecardsStore, effectiveDeclarations, surveyResponses]);

  const decl = (employmentDeclarations.length ? employmentDeclarations : checkupToEmploymentDeclarations(checkupRecords));
  const kpiEmployment = computeKpi('alumni_employment_rate', decl, { period });
  const kpiRelevance = computeKpi('major_relevance_rate', decl, { period });
  const kpiPlacement90 = computeKpi('placement_90d_rate', decl, { period });
  const kpiInternship = computeKpi('internship_completion_rate', internships, { period });
  const kpiPerJob = computeKpi('placements_per_job', { jobs, applications }, { jobs, applications, period });
  const kpiEvents = computeKpi('event_attendance_rate', eventRegistrations, { period });
  const kpiSurvey = computeKpi('survey_response_rate', surveyInvites, { period, responses: surveyResponses });
  const kpisOk = [kpiEmployment, kpiRelevance, kpiPlacement90, kpiInternship, kpiPerJob, kpiEvents, kpiSurvey].filter(k => k.status === 'ok');
  const hasExportableKpis = kpisOk.length > 0 || (effectiveDeclarations && effectiveDeclarations.length > 0);

  // Legacy checkup charts: only when raw checkup rows exist (non-KPI decorative); never invent % 
  const hasCheckupData = checkupRecords.length > 0;
  const totalCheckup = checkupRecords.length;
  const postgradCount = checkupRecords.filter(r => r.postgrad === 'Evet').length;
  const updatedPhoneCount = checkupRecords.filter(r => r.phoneUpdated === 'Hayır' || r.newPhone).length;
  const updatedEmailCount = checkupRecords.filter(r => r.emailUpdated === 'Hayır' || r.newEmail).length;

  const relatedPct = kpiRelevance.status === 'ok' ? kpiRelevance.value : null;
  const relatedJobCount = kpiRelevance.numerator;
  const postgradPct = hasCheckupData ? Math.round((postgradCount / totalCheckup) * 100) : null;
  const otherSectorPct = hasCheckupData && relatedPct != null ? Math.max(0, 100 - relatedPct) : null;
  const fmtPct = (v) => (v == null ? 'Veri yok' : `%${v}`);
  const fmtCount = (v) => (hasCheckupData ? String(v) : 'Veri yok');

  const majorAlignmentData = hasCheckupData ? [
    { name: 'Kendi Bölümüyle İlgili', value: relatedPct, count: relatedJobCount, fill: '#10B981' },
    { name: 'Farklı Sektörde', value: otherSectorPct, count: Math.max(0, totalCheckup - relatedJobCount), fill: '#F59E0B' },
    { name: 'Lisansüstü Eğitimde', value: postgradPct, count: postgradCount, fill: '#3B82F6' }
  ] : [];

  const workModeData = hasCheckupData ? [
    { mode: 'Hibrit', count: checkupRecords.filter(r => r.workMode === 'Hibrit').length },
    { mode: 'Ofisten', count: checkupRecords.filter(r => r.workMode === 'Ofisten').length },
    { mode: 'Uzaktan', count: checkupRecords.filter(r => r.workMode?.includes('Uzaktan')).length },
    { mode: 'Freelance', count: checkupRecords.filter(r => r.workMode?.includes('Freelance')).length }
  ] : [];

  // Güvenli HTML kaçırma fonksiyonu (Stored XSS Kalkanı)
  const escapeHtml = (val) => {
    if (val == null) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // YÖK Report PDF / Print Export Handler — gerçek veri yoksa dışa aktarım yapılmaz
  const exportYokReport = () => {
    if (!hasExportableKpis) {
      window.toast?.error?.('Raporlanacak KPI yok (status=ok ve n≥minN). Boş/yetersiz veri ile export üretilmez.');
      return;
    }
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      window.toast?.error?.('Tarayıcınız açılır pencereyi engelledi. Lütfen açılır pencerelere izin verin.');
      return;
    }
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>İESÜ YÖK Mezun İstihdam ve Akreditasyon Raporu (2026)</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
          .header { border-bottom: 3px solid #990000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 22px; font-weight: bold; color: #990000; text-transform: uppercase; }
          .subtitle { font-size: 13px; color: #64748b; font-weight: bold; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
          .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; }
          .kpi-val { font-size: 28px; font-weight: bold; color: #0a2342; margin-top: 5px; }
          .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
          th { background: #0a2342; color: white; padding: 10px; text-align: left; text-transform: uppercase; }
          td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
          .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">İSTANBUL ESENYURT ÜNİVERSİTESİ</div>
            <div class="subtitle">Kariyer Geliştirme Koordinatörlüğü — YÖK Mezun Takip & Akreditasyon Raporu</div>
          </div>
          <div><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</div>
        </div>

        <h3>1. YÖK Akreditasyon ve İstihdam Göstergeleri</h3>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Kendi Bölümüyle İlgili Çalışan</div>
            <div class="kpi-val" style="color: #10b981;">${relatedPct == null ? 'Veri yok' : '%' + relatedPct}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Lisansüstü Eğitime Devam Eden</div>
            <div class="kpi-val" style="color: #3b82f6;">${postgradPct == null ? 'Veri yok' : '%' + postgradPct}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Farklı Sektörde Çalışan / Diğer</div>
            <div class="kpi-val" style="color: #f59e0b;">${otherSectorPct == null ? 'Veri yok' : '%' + otherSectorPct}</div>
          </div>
        </div>

        <h3>2. Kariyer Check-up Yanıt ve Veri Havuzu Detayı</h3>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Mezun Adı</th>
              <th>Bölüm</th>
              <th>Mezuniyet</th>
              <th>İstihdam / Sektör</th>
              <th>Bölümle İlişkili Mi?</th>
              <th>Lisansüstü</th>
            </tr>
          </thead>
          <tbody>
            ${checkupRecords.map(r => `
              <tr>
                <td>${escapeHtml(r.id)}</td>
                <td><strong>${escapeHtml(r.name)}</strong></td>
                <td>${escapeHtml(r.department)}</td>
                <td>${escapeHtml(r.graduationYear)}</td>
                <td>${escapeHtml(r.employed)} (${escapeHtml(r.sector)})</td>
                <td>${escapeHtml(r.relatedToMajor)} ${r.relatedToMajor === 'Hayır' ? `(${escapeHtml(r.newJobTitleIfNo)})` : ''}</td>
                <td>${escapeHtml(r.postgrad)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Bu rapor İstanbul Esenyurt Üniversitesi Kariyer Platformu Otomatik YÖK Akreditasyon Servisi tarafından üretilmiştir. © 2026
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    reportWindow.document.write(content);
    reportWindow.document.close();
  };

  // Gerçek dizi uzunlukları; eksikte uydurma KPI yok
  const totalStudents = (students || []).length;
  const activeStudents = (students || []).filter(s => s.status === 'Aktif').length;
  const totalAlumni = (alumni || []).length;
  
  const totalJobs = (jobs || []).length;
  const totalApplications = (applications || []).length;

  const popularJobs = (jobs || []).slice(0, 4).map(j => ({
    title: j.title,
    company: j.company,
    clicks: j.clicks ?? j.views ?? null,
    applications: j.applicants ?? null
  })).filter(j => j.title);

  const popularCompanies = (companies || []).slice(0, 3).map(c => ({
    name: c.name,
    sector: c.sector,
    views: c.views ?? c.profileViews ?? null
  })).filter(c => c.name);

  // Aylık ziyaret için henüz telemetri yok — grafik boş kalır (önizleme uydurma veri yok)
  const monthlyVisits = [];
  const hasVisitTelemetry = monthlyVisits.length > 0;

  const StatProgress = ({ label, value, max, colorClass }) => (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-500">{value} / {max}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Sistem Analitiği" 
        sub="Platformun kullanım istatistiklerini, YÖK/YÖKAK akreditasyon göstergelerini ve PUKÖ karne analizlerini inceleyin." 
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button 
              type="button"
              onClick={() => exportYokakAuditPdf({ indicators: yokakIndicators, pukoScorecards: computedPukoScorecards, period })}
              className="bg-[#990000] hover:bg-red-800 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Download size={15} /> Resmî YÖKAK Raporu Al (PDF/Yazdır)
            </button>
            <button 
              type="button"
              onClick={() => downloadYokakAuditCsv({ indicators: yokakIndicators, pukoScorecards: computedPukoScorecards, period })}
              className="bg-[#0A2342] hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 border border-slate-700"
            >
              <FileText size={15} /> Resmî Excel/CSV İndir
            </button>
          </div>
        } 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopInfoCard icon={<Users size={20} />} title="Aktif Kullanıcı" count={(activeStudents + totalAlumni) || 'Veri yok'} color="blue" />
        <TopInfoCard icon={<MousePointerClick size={20} />} title="Aylık Etkileşim" count="Veri yok" color="emerald" />
        <TopInfoCard icon={<Briefcase size={20} />} title="Toplam Başvuru" count={totalApplications} color="orange" />
        <TopInfoCard icon={<Eye size={20} />} title="İlan Görüntülenmesi" count="Veri yok" color="purple" />
      </div>

      {/* YÖK / YÖKAK AKREDİTASYON, İSTİHDAM VE PUKÖ PERFORMANS MOTORU */}
      <div className="bg-gradient-to-br from-[#0A2342] to-slate-900 text-white rounded-3xl border border-blue-900/50 shadow-xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-blue-900/60 pb-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles size={14} /> Kurumsal Akreditasyon & İstihdam Performans Motoru (YÖKAK KAP A.1.1 & B.2.2)
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <GraduationCap className="text-red-500" size={26} /> Mezun İstihdamı & YÖKAK Akreditasyon Analitiği
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              {ACCREDITATION_STANDARDS.INSTITUTION_NAME} — {ACCREDITATION_STANDARDS.COORDINATOR_UNIT} Resmî Göstergeleri
            </p>
          </div>

          {/* Akreditasyon Alt Sekme Seçici */}
          <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setAccreditationTab('pyramids')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                accreditationTab === 'pyramids' ? 'bg-[#990000] text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              Maaş & Sektör Piramidi
            </button>
            <button
              type="button"
              onClick={() => setAccreditationTab('puko')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                accreditationTab === 'puko' ? 'bg-[#990000] text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              PUKÖ Kalite Karneleri
            </button>
            <button
              type="button"
              onClick={() => setAccreditationTab('audit_log')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                accreditationTab === 'audit_log' ? 'bg-[#990000] text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              Denetim Kütüğü
            </button>
          </div>
        </div>
        
        {/* Resmî YÖKAK Ölçüt A.1.1 İstihdam Gösterge Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
              Genel Mezun İstihdamı (A.1.1.0)
            </span>
            <div className="text-2xl font-black text-emerald-300">
              %{yokakIndicators.generalEmploymentRate ?? '0.0'}
            </div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">
              {yokakIndicators.employedCount} / {yokakIndicators.totalAudited} Mezun İstihdamda
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block mb-1">
              İlk 6 Ayda İstihdam (YÖK A.1.1.1)
            </span>
            <div className="text-2xl font-black text-sky-300">
              %{yokakIndicators.placement6mRate ?? '0.0'}
            </div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">
              {yokakIndicators.placement6mCount} Mezun ilk 180 gün içinde başladı
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 block mb-1">
              İlk 1 Yılda İstihdam (YÖK A.1.1.2)
            </span>
            <div className="text-2xl font-black text-indigo-200">
              %{yokakIndicators.placement1yRate ?? '0.0'}
            </div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">
              {yokakIndicators.placement1yCount} Mezun ilk 365 gün içinde başladı
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
              Sektörel Alan İçi Uyum Katsayısı
            </span>
            <div className="text-2xl font-black text-amber-300">
              {yokakIndicators.sectoralAlignmentCoefficient ?? '0.00'} / 1.00
            </div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">
              %{yokakIndicators.inFieldRate ?? '0.0'} Alan İçi İstihdam
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block mb-1">
              İlk 90 Günde Hızlı Yerleşme
            </span>
            <div className="text-2xl font-black text-purple-300">
              %{yokakIndicators.placement90dRate ?? '0.0'}
            </div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">
              {yokakIndicators.placement90dCount} Mezun ilk çeyrekte yerleşti
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
              Lisansüstü Eğitime Devam
            </span>
            <div className="text-2xl font-black text-rose-300">
              %{yokakIndicators.postgradRate ?? '0.0'}
            </div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">
              {yokakIndicators.postgradCount} Mezun Yüksek Lisans / Doktora
            </p>
          </div>
        </div>

        {/* AKTİF AKREDİTASYON GÖRÜNÜMÜ */}
        {accreditationTab === 'pyramids' && (
          <div className="text-slate-900">
            <EmploymentPyramids
              salaryPyramid={yokakIndicators.salaryPyramid}
              sectorPyramid={yokakIndicators.sectorPyramid}
              inFieldRate={yokakIndicators.inFieldRate}
              outOfFieldRate={yokakIndicators.outOfFieldRate}
              sectoralAlignmentCoefficient={yokakIndicators.sectoralAlignmentCoefficient}
              totalEmployed={yokakIndicators.employedCount}
            />
          </div>
        )}

        {accreditationTab === 'puko' && (
          <div className="text-slate-900">
            <PUKOCaliteKarnesi
              scorecards={computedPukoScorecards}
              onUpdateScorecard={updatePukoScorecard}
              period={period}
            />
          </div>
        )}

        {accreditationTab === 'audit_log' && (
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-black text-slate-900 text-base">
                  Resmî YÖKAK Denetim Mezun İstihdam Kütüğü
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  KVKK 6698 Sayılı Kanun gereğince T.C. Kimlik Numaraları maskelenmiştir.
                </p>
              </div>
              <span className="text-xs font-black bg-slate-100 text-slate-800 px-3 py-1 rounded-xl self-start">
                Toplam Kayıt: {yokakIndicators.records?.length || 0}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-black tracking-wider">
                  <tr>
                    <th className="p-3">Sıra</th>
                    <th className="p-3">Mezun Adı</th>
                    <th className="p-3">Maskeli TCKN</th>
                    <th className="p-3">Bölüm</th>
                    <th className="p-3">Şirket / Kurum</th>
                    <th className="p-3">Pozisyon / Ünvan</th>
                    <th className="p-3">Sektör</th>
                    <th className="p-3 text-center">Alan Uyum</th>
                    <th className="p-3 text-center">İlk 6 Ay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {(yokakIndicators.records || []).slice(0, 15).map((r, i) => (
                    <tr key={r.id || i} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-bold">{i + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{r.name || 'Mezun'}</td>
                      <td className="p-3 font-mono text-[11px]">{maskTCKN(r.tcNo || r.studentId)}</td>
                      <td className="p-3">{r.department || 'Bölüm'}</td>
                      <td className="p-3 font-bold">{r.company || r.companyName || 'Kurumsal Firma'}</td>
                      <td className="p-3">{r.title || 'Uzman'}</td>
                      <td className="p-3 text-slate-500">{r.sector || 'Teknoloji'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${isEmploymentInField(r) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          {isEmploymentInField(r) ? 'Alan İçi' : 'Alan Dışı'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${isPlacementUnder6m(r) ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {isPlacementUnder6m(r) ? 'Evet' : 'Hayır'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-gray-900 flex items-center gap-2"><TrendingUp size={18} className="text-[#0A66C2]"/> Aylık Ziyaretçi Trendi</h3>
              <p className="text-xs text-gray-500 mt-1">Son 6 aydaki tekil giriş sayısı (bin)</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {!hasVisitTelemetry ? (
              <div className="h-full flex items-center justify-center text-sm font-bold text-slate-400">Veri yok — ziyaret telemetrisi bağlı değil</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVisits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0A66C2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0A66C2" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-gray-900 flex items-center gap-2 mb-6"><Target size={18} className="text-red-500"/> Kullanıcı Dağılımı</h3>
            <div className="space-y-1">
              <StatProgress label="Öğrenciler" value={totalStudents} max={Math.max(totalStudents, 1)} colorClass="bg-red-500" />
              <StatProgress label="Mezunlar" value={totalAlumni} max={Math.max(totalAlumni, 1)} colorClass="bg-emerald-500" />
              <StatProgress label="Firmalar" value={(companies || []).length} max={Math.max((companies || []).length, 1)} colorClass="bg-amber-500" />
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Öğrenci aktiflik oranı <b>{totalStudents > 0 ? '%' + (activeStudents / totalStudents * 100).toFixed(1) : 'Veri yok'}</b>. İESÜ Mezunlar Portalı kampanyalarıyla mezun katılımını artırabilirsiniz.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2"><Briefcase size={18} className="text-orange-500"/> En Çok İlgi Gören İlanlar</h3>
          </div>
          <div className="p-5 space-y-4">
            {popularJobs.length === 0 && (
              <p className="text-sm font-bold text-slate-400 text-center py-6">Veri yok</p>
            )}
            {popularJobs.map((job, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-black shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{job.title}</h4>
                    <p className="text-xs font-medium text-gray-500">{job.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-gray-900">{job.clicks ?? '—'} <span className="text-[10px] text-gray-500 font-bold uppercase">Tık</span></div>
                  <div className="text-xs font-bold text-emerald-600">{job.applications ?? '—'} Başvuru</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Companies */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2"><Building2 size={18} className="text-purple-500"/> En Çok İncelenen Firmalar</h3>
          </div>
          <div className="p-5 space-y-4">
            {popularCompanies.length === 0 && (
              <p className="text-sm font-bold text-slate-400 text-center py-6">Veri yok</p>
            )}
            {popularCompanies.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black shrink-0">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{comp.name}</h4>
                    <p className="text-xs font-medium text-gray-500">{comp.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-gray-900">{comp.views ?? '—'}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">Profil Görüntülenmesi</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* World Map Analytics */}
      <CMSWorldMap />
    </div>
  );
}

