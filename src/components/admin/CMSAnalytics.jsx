import React, { useState, useMemo } from 'react';
import { Users, Briefcase, GraduationCap, Building2, Target, Eye, FileText, Download, Sparkles } from 'lucide-react';
import { TopInfoCard } from './AdminCMSLayout';
import PanelHeader from './PanelHeader';
import useAppStore from '../../store/useAppStore';
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
import QSWorldRankingReportCard from '../accreditation/QSWorldRankingReportCard';

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
    const fromSurveys = (Array.isArray(rawSurveys) ? rawSurveys : []).flatMap(s => (Array.isArray(s?.responses) ? s.responses : []).map(r => ({
      ...r,
      surveyId: s.id,
      targetAudience: s.targetAudience
    })));
    return [...(Array.isArray(directSurveyResponses) ? directSurveyResponses : []), ...fromSurveys];
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

  // Gerçek dizi uzunlukları; uydurma telemetri veya sahte metrik yok
  const totalStudents = (students || []).length;
  const activeStudents = (students || []).filter(s => s.status === 'Aktif').length;
  const totalAlumni = (alumni || []).length;
  const totalCompanies = (companies || []).length;
  const activeJobs = (jobs || []).filter(j => j?.status === 'Yayında' || j?.status === 'Aktif').length;
  const totalApplications = (applications || []).length;

  const popularJobs = (jobs || []).slice(0, 4).map(j => ({
    title: j.title,
    company: j.company,
    clicks: j.clicks ?? j.views ?? null,
    applications: j.applicants ?? (applications || []).filter(a => a.jobId === j.id).length
  })).filter(j => j.title);

  const popularCompanies = (companies || []).slice(0, 4).map(c => ({
    name: c.name,
    sector: c.sector,
    activeJobCount: (jobs || []).filter(j => (j.company || '').toLowerCase() === (c.name || '').toLowerCase()).length
  })).filter(c => c.name);

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
        title="Analitik & YÖKAK Raporları" 
        sub="YÖK/YÖKAK mezun istihdam göstergeleri, PUKÖ kalite karneleri ve güncel paydaş istatistikleri" 
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

      {/* Gerçek Canlı Veri KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TopInfoCard icon={<Users size={20} />} title="Kayıtlı Öğrenci & Mezun" count={totalStudents + totalAlumni} color="blue" />
        <TopInfoCard icon={<Building2 size={20} />} title="Kurumsal İşveren" count={totalCompanies} color="emerald" />
        <TopInfoCard icon={<Briefcase size={20} />} title="Yayındaki İş & Staj İlanı" count={activeJobs} color="orange" />
        <TopInfoCard icon={<GraduationCap size={20} />} title="Toplam Başvuru" count={totalApplications} color="purple" />
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
            <button
              type="button"
              data-testid="tab-qs-the-ranking"
              onClick={() => setAccreditationTab('qs_ranking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                accreditationTab === 'qs_ranking' ? 'bg-[#003399] text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              QS & THE Sıralaması
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

        {accreditationTab === 'qs_ranking' && (
          <div className="text-slate-900" data-testid="qs-ranking-content">
            <QSWorldRankingReportCard
              alumni={alumni}
              students={students}
              corporateProtocols={yokakIndicators.corporateProtocols || []}
              employerRatings={computedPukoScorecards || []}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kullanıcı Dağılımı */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-gray-900 flex items-center gap-2 mb-6"><Target size={18} className="text-red-500"/> Paydaş Dağılımı</h3>
            <div className="space-y-1">
              <StatProgress label="Öğrenciler" value={totalStudents} max={Math.max(totalStudents + totalAlumni + totalCompanies, 1)} colorClass="bg-red-500" />
              <StatProgress label="Mezunlar" value={totalAlumni} max={Math.max(totalStudents + totalAlumni + totalCompanies, 1)} colorClass="bg-emerald-500" />
              <StatProgress label="Firmalar" value={totalCompanies} max={Math.max(totalStudents + totalAlumni + totalCompanies, 1)} colorClass="bg-amber-500" />
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
              Öğrenci aktiflik oranı <b>{totalStudents > 0 ? '%' + (activeStudents / totalStudents * 100).toFixed(1) : '%0'}</b>. İESÜ Mezunlar Portalı duyurularıyla mezun katılımını artırabilirsiniz.
            </p>
          </div>
        </div>

        {/* En Çok İlgi Gören İlanlar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2"><Briefcase size={18} className="text-orange-500"/> Güncel İlanlar</h3>
          </div>
          <div className="p-5 space-y-4">
            {popularJobs.length === 0 && (
              <p className="text-sm font-bold text-slate-400 text-center py-6">Henüz yayınlanmış ilan yok</p>
            )}
            {popularJobs.map((job, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-black shrink-0 text-xs">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{job.title}</h4>
                    <p className="text-xs font-medium text-gray-500 truncate">{job.company}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-black text-emerald-600">{job.applications} Başvuru</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Öne Çıkan Kurumsal Firmalar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-black text-gray-900 flex items-center gap-2"><Building2 size={18} className="text-purple-500"/> Kurumsal İşverenler</h3>
          </div>
          <div className="p-5 space-y-4">
            {popularCompanies.length === 0 && (
              <p className="text-sm font-bold text-slate-400 text-center py-6">Kayıtlı firma yok</p>
            )}
            {popularCompanies.map((comp, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black shrink-0">
                    <Building2 size={16} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{comp.name}</h4>
                    <p className="text-xs font-medium text-gray-500 truncate">{comp.sector || 'Sektör'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs font-black text-gray-900">{comp.activeJobCount} İlan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

