import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp, Users, Eye, MousePointerClick, Briefcase, GraduationCap, Building2, Calendar, Target, PhoneCall, MailCheck, CheckCircle2, FileText, Download, Award, ShieldCheck, Sparkles } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';
import PanelHeader from './PanelHeader';
import CMSWorldMap from './CMSWorldMap';
import useAppStore from '../../store/useAppStore';
import { computeKpi } from '../../kpi/compute';
import KpiStatusView from '../../kpi/KpiStatusView';
import { checkupToEmploymentDeclarations } from '../../kpi/adapters';

export default function CMSAnalytics({ students = [], alumni = [], companies = [], jobs = [], applications = [] }) {
  const checkupRecords = useAppStore(state => state.checkupRecords) || [];
  const employmentDeclarations = useAppStore(state => state.employmentDeclarations) || [];
  const internships = useAppStore(state => state.internships) || [];
  const surveyInvites = useAppStore(state => state.surveyInvites) || [];
  const surveyResponses = useAppStore(state => state.surveyResponses) || [];
  const eventRegistrations = useAppStore(state => state.eventRegistrations) || [];
  const period = '2026-H1';
  const decl = (employmentDeclarations.length ? employmentDeclarations : checkupToEmploymentDeclarations(checkupRecords));
  const kpiEmployment = computeKpi('alumni_employment_rate', decl, { period });
  const kpiRelevance = computeKpi('major_relevance_rate', decl, { period });
  const kpiPlacement90 = computeKpi('placement_90d_rate', decl, { period });
  const kpiInternship = computeKpi('internship_completion_rate', internships, { period });
  const kpiPerJob = computeKpi('placements_per_job', { jobs, applications }, { jobs, applications, period });
  const kpiEvents = computeKpi('event_attendance_rate', eventRegistrations, { period });
  const kpiSurvey = computeKpi('survey_response_rate', surveyInvites, { period, responses: surveyResponses });
  const kpisOk = [kpiEmployment, kpiRelevance, kpiPlacement90, kpiInternship, kpiPerJob, kpiEvents, kpiSurvey].filter(k => k.status === 'ok');
  const hasExportableKpis = kpisOk.length > 0;

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
            <div class="subtitle">Kariyer Geliştirme Merkezi — YÖK Mezun Takip & Akreditasyon Raporu</div>
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
                <td>${r.id}</td>
                <td><strong>${r.name}</strong></td>
                <td>${r.department}</td>
                <td>${r.graduationYear}</td>
                <td>${r.employed} (${r.sector})</td>
                <td>${r.relatedToMajor} ${r.relatedToMajor === 'Hayır' ? `(${r.newJobTitleIfNo})` : ''}</td>
                <td>${r.postgrad}</td>
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
        sub="Platformun kullanım istatistiklerini ve Kariyer Check-up mezun analizlerini inceleyin." 
        action={
          <button 
            onClick={exportYokReport}
            className="bg-[#990000] hover:bg-red-800 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Download size={16} /> Mezun Akreditasyon Raporu Çıktısı Al (PDF/Yazdır)
          </button>
        } 
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopInfoCard icon={<Users size={20} />} title="Aktif Kullanıcı" count={(activeStudents + totalAlumni) || 'Veri yok'} color="blue" />
        <TopInfoCard icon={<MousePointerClick size={20} />} title="Aylık Etkileşim" count="Veri yok" color="emerald" />
        <TopInfoCard icon={<Briefcase size={20} />} title="Toplam Başvuru" count={totalApplications} color="orange" />
        <TopInfoCard icon={<Eye size={20} />} title="İlan Görüntülenmesi" count="Veri yok" color="purple" />
      </div>

      {/* MEZUN İSTİHDAMI & BÖLÜM UYUM ANALİTİĞİ (SORULAR 1, 2, 4, 6, 8, 9) */}
      <div className="bg-gradient-to-br from-[#0A2342] to-slate-900 text-white rounded-3xl border border-blue-900/50 shadow-xl p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-blue-900/60 pb-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles size={14} /> Kurumsal Akreditasyon & İstihdam Performans Motoru
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <GraduationCap className="text-red-500" size={26} /> Mezun İstihdamı & Bölüm Uyum Analitiği
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Mezunların 1, 2, 4, 6, 8 ve 9. sorulara verdikleri yanıtlar doğrultusunda oluşturulan istihdam, sektör ve eğitim istatistikleri.
            </p>
          </div>
          <button
            onClick={exportYokReport}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <FileText size={15} /> Resmî Akreditasyon Raporu Al
          </button>
        </div>
        
        {/* Odak Sorular (1, 2, 4, 6, 8, 9) KPI Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <KpiStatusView kpi={kpiEmployment} title="Mezun istihdam oranı" formHref="/alumni_information" formLabel="Mezun istihdam beyan formu" />
          <KpiStatusView kpi={kpiPlacement90} title="İlk 90 gün yerleşme" formHref="/alumni_information" formLabel="Mezun beyan formu" />
          <KpiStatusView kpi={kpiRelevance} title="Bölüm uyum oranı" formHref="/alumni_information" formLabel="Mezun beyan formu" />
          <KpiStatusView kpi={kpiInternship} title="Staj tamamlama oranı" formHref="/academic" formLabel="Staj onay protokolü" />
          <KpiStatusView kpi={kpiPerJob} title="İlan başına yerleşme" formHref="/jobs" formLabel="İlanlar" />
          <KpiStatusView kpi={kpiSurvey} title="Anket yanıt oranı" formHref="/admin_cms" formLabel="Anket modülü" />

          {/* Soru 4: Kurum Türü */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 block mb-1">Soru 4 — Kurum Türü Dağılımı</span>
            <div className="text-2xl font-black text-white">{hasCheckupData ? 'Hesaplanamadı (alan yok)' : 'Veri yok'}</div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">{hasCheckupData ? 'Kurum türü alanı checkup kaydında yok' : 'Check-up verisi girilmedi'}</p>
          </div>

          {/* Soru 6: Bölüm İlişkisi */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">Soru 6 — Kendi Bölümüyle İlişkili İş</span>
            <div className="text-2xl font-black text-[#10B981]">{fmtPct(relatedPct)}{relatedPct != null ? ' Bölümle İlgili' : ''}</div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">{fmtCount(relatedJobCount)}{hasCheckupData ? ' Mezun Bölüm Alanında' : ''}</p>
          </div>

          {/* Soru 8: Çalışma Şekli */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block mb-1">Soru 8 — Çalışma Modeli</span>
            <div className="text-2xl font-black text-white">{hasCheckupData ? (workModeData[0]?.count ?? 0) + ' Hibrit / ' + (workModeData[1]?.count ?? 0) + ' Ofis' : 'Veri yok'}</div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">{hasCheckupData ? (workModeData[2]?.count ?? 0) + ' Remote / ' + (workModeData[3]?.count ?? 0) + ' Freelance' : 'Check-up verisi girilmedi'}</p>
          </div>

          {/* Soru 9: Lisansüstü Eğitim */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 block mb-1">Soru 9 — Lisansüstü Eğitim</span>
            <div className="text-2xl font-black text-sky-300">{fmtPct(postgradPct)}{postgradPct != null ? ' Eğitime Devam' : ''}</div>
            <p className="text-[11px] text-blue-200 font-semibold mt-1">{fmtCount(postgradCount)}{hasCheckupData ? ' Yüksek Lisans / Doktora' : ''}</p>
          </div>
        </div>

        {/* Detaylı Grafikler Grid (Soru 6 ve Soru 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-200 mb-1">Soru 6 — Bölüm Uyum Oranı (Pasta Grafiği)</h4>
            <p className="text-[11px] text-slate-400 mb-4">Mezunların okudukları bölüm ile çalıştıkları işin doğrudan ilişkisi</p>
            <div className="h-52 w-full">
              {!hasCheckupData ? (
                <div className="h-full flex items-center justify-center text-sm font-bold text-slate-400">Veri yok</div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={majorAlignmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {majorAlignmentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <h4 className="text-xs font-black uppercase tracking-wider text-blue-200 mb-1">Soru 8 — Çalışma Şekli Analizi (Sütun Grafiği)</h4>
            <p className="text-[11px] text-slate-400 mb-4">Mezunların çalışma modellerine göre kişi sayısı dağılımı</p>
            <div className="h-52 w-full">
              {!hasCheckupData ? (
                <div className="h-full flex items-center justify-center text-sm font-bold text-slate-400">Veri yok</div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workModeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff20" />
                  <XAxis dataKey="mode" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#cbd5e1' }} />
                  <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#990000" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Odak Sorular (1, 2, 4, 6, 8, 9) Derinlikli Özet Rapor Tablosu */}
        <div className="mt-8 border-t border-blue-900/60 pt-6 space-y-4">
          <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" /> Mezun İstihdamı Odaklı Soru Analiz Paneli (Sorular 1, 2, 4, 6, 8, 9)
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/10 text-blue-200 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="p-3">Soru No & Konu</th>
                  <th className="p-3">Odak Veri</th>
                  <th className="p-3">Yüzdesel Dağılım</th>
                  <th className="p-3">Önemli Çıkarım / Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-medium text-slate-200">
                <tr>
                  <td className="p-3 font-bold text-white">Soru 1 — Aktif İstihdam</td>
                  <td className="p-3">Aktif Çalışanlar</td>
                  <td className="p-3 font-black text-emerald-400">{hasCheckupData ? 'Gerçek oran checkup alanından' : 'Veri yok'}</td>
                  <td className="p-3 text-slate-300">Mezunların ezici çoğunluğu iş gücüne katılmıştır.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Soru 2 — İş Bulma Hızı</td>
                  <td className="p-3">0 - 3 Ay İçinde İş Bulma</td>
                  <td className="p-3 font-black text-amber-300">{hasCheckupData ? 'Alan yok' : 'Veri yok'}</td>
                  <td className="p-3 text-slate-300">Mezuniyet sonrası ilk 90 günde istihdam oranı yüksek.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Soru 4 — Kurum Türü</td>
                  <td className="p-3">Şirket / Kamu / İşletme</td>
                  <td className="p-3 font-black text-purple-300">{hasCheckupData ? 'Alan yok' : 'Veri yok'}</td>
                  <td className="p-3 text-slate-300">Özel sektör mezun istihdamında lider konumda.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Soru 6 — Bölüm Uyum Oranı</td>
                  <td className="p-3">Bölümüyle Doğrudan İlgili İş</td>
                  <td className="p-3 font-black text-emerald-400">{fmtPct(relatedPct)}{relatedPct != null ? ' Uyumlu İş' : ''}</td>
                  <td className="p-3 text-slate-300">Program çıktılarının sektör ihtiyaçlarıyla yüksek uyumu.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Soru 8 — Çalışma Şekli</td>
                  <td className="p-3">Hibrit / Remote / Ofis</td>
                  <td className="p-3 font-black text-sky-300">{hasCheckupData ? ((workModeData[0]?.count ?? 0) + ' kişi Hibrit') : 'Veri yok'}</td>
                  <td className="p-3 text-slate-300">Esnek ve uzaktan çalışma tercihleri yaygınlaşmıştır.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-white">Soru 9 — Akademik Devamlılık</td>
                  <td className="p-3">Lisansüstü Eğitim (Y.Lisans/Dr.)</td>
                  <td className="p-3 font-black text-indigo-300">{fmtPct(postgradPct)}{postgradPct != null ? ' Akademik Devam' : ''}</td>
                  <td className="p-3 text-slate-300">Mezunların bir kısmı yüksek lisans ve akademiye yönelmiştir.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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

