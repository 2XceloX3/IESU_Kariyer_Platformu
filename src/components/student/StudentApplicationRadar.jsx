import React, { useState, useMemo } from 'react';
import {
  Radar, Clock, CheckCircle2, AlertCircle, Sparkles, Building2,
  Calendar, ArrowRight, ExternalLink, Filter, Search, Award,
  ChevronRight, FileText, Video, Eye, ChevronDown, ChevronUp,
  RotateCcw, ShieldCheck, HeartHandshake, UserCheck, Coffee
} from 'lucide-react';
import Logo from '../Logo';
import TopProfileMenu from '../TopProfileMenu';
import SubPanelFloatingDock from '../SubPanelFloatingDock';
import SafeAvatar from '../shared/SafeAvatar';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import { useTranslation } from '../../i18n';
import useAppStore from '../../store/useAppStore';
import AlumniCoffeeChatModal from './AlumniCoffeeChatModal';
import {
  RADAR_STAGES,
  PROTOCOL_VIP_BADGE,
  enrichApplicationWithRadar,
  advanceRadarStage,
  calculateRadarStatistics,
  generateMockRadarApplications
} from '../../services/studentRadarWorkflow';

export default function StudentApplicationRadar({
  currentUser,
  userRole = 'student',
  setView,
  setSelectedUserId,
  previousView = 'feed',
  onOpenCoffeeChat
}) {
  const { t, isEn } = useTranslation();
  const storeCurrentUser = useAppStore((state) => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const storeApplications = useAppStore((state) => state.applications) || [];
  const setStoreApplications = useAppStore((state) => state.setApplications);
  const protocols = useAppStore((state) => state.corporateProtocols) || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, active, shortlisted, interview, feedback, vip
  const [expandedAppId, setExpandedAppId] = useState(null);
  const [internalCoffeeModalOpen, setInternalCoffeeModalOpen] = useState(false);
  const [selectedAlumnusForChat, setSelectedAlumnusForChat] = useState(null);

  const handleCoffeeChatClick = (alumnusData) => {
    if (onOpenCoffeeChat) {
      onOpenCoffeeChat(alumnusData);
    } else {
      setSelectedAlumnusForChat(alumnusData || null);
      setInternalCoffeeModalOpen(true);
    }
  };

  // Initialize applications: merge store applications with realistic mock radar applications if store is empty
  const [radarApps, setRadarApps] = useState(() => {
    if (Array.isArray(storeApplications) && storeApplications.length > 0) {
      return storeApplications.map((a) => enrichApplicationWithRadar(a, protocols));
    }
    return generateMockRadarApplications(effectiveCurrentUser, protocols);
  });

  const stats = useMemo(() => calculateRadarStatistics(radarApps), [radarApps]);

  const filteredApps = useMemo(() => {
    return radarApps.filter((app) => {
      const q = searchQuery.toLocaleLowerCase('tr-TR');
      const matchesSearch =
        !q ||
        (app.jobTitle || '').toLocaleLowerCase('tr-TR').includes(q) ||
        (app.company || '').toLocaleLowerCase('tr-TR').includes(q);

      if (!matchesSearch) return false;

      if (activeFilter === 'active') {
        return (
          app.radarStage === 'SUBMITTED' ||
          app.radarStage === 'HR_VIEWED' ||
          app.radarStage === 'SHORTLISTED_TOP_15'
        );
      }
      if (activeFilter === 'shortlisted') return app.radarStage === 'SHORTLISTED_TOP_15';
      if (activeFilter === 'interview') return app.radarStage === 'INTERVIEW_INVITE';
      if (activeFilter === 'feedback') return app.radarStage === 'DETAILED_FEEDBACK';
      if (activeFilter === 'vip') return Boolean(app.isProtocolVIP);

      return true;
    });
  }, [radarApps, searchQuery, activeFilter]);

  const handleSimulateAdvance = (appId) => {
    setRadarApps((prev) => {
      const updatedList = prev.map((app) => {
        if (app.id !== appId) return app;
        let next = 'HR_VIEWED';
        if (app.radarStage === 'SUBMITTED') next = 'HR_VIEWED';
        else if (app.radarStage === 'HR_VIEWED') next = 'SHORTLISTED_TOP_15';
        else if (app.radarStage === 'SHORTLISTED_TOP_15') next = 'INTERVIEW_INVITE';
        else if (app.radarStage === 'INTERVIEW_INVITE') next = 'DETAILED_FEEDBACK';
        else next = 'SUBMITTED';

        const updated = advanceRadarStage(app, next);
        window.toast?.info?.(
          `Aşama Güncellendi: ${app.company} - ${RADAR_STAGES[next]?.label}`
        );
        return updated;
      });

      if (setStoreApplications) {
        setStoreApplications(updatedList);
      }
      return updatedList;
    });
  };

  const handleBack = () => {
    if (setView) {
      setView(previousView === 'admin' ? 'feed' : previousView || 'feed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-28">
      {/* Institutional Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl text-slate-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
              title="Geri Dön"
            >
              <RotateCcw size={18} />
            </button>
            <Logo className="h-9 w-auto" />
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <h1 className="text-xs font-black text-slate-900 leading-tight">
                {t('common.appName')}
              </h1>
              <p className="text-[10px] font-bold text-red-700 tracking-wide uppercase">
                {t('common.coordinatorTitle')} • {t('radar.title')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200/80 rounded-full text-xs font-black text-[#990000]">
              <Radar size={14} className="animate-spin text-red-600" />
              <span>{isEn ? 'Anti-Black-Hole Transparency Engine' : 'Kara Delik Başvuru Sendromu Önleme Sistemi'}</span>
            </div>
            <LanguageSwitcher variant="pill" />
            <TopProfileMenu
              currentUser={effectiveCurrentUser}
              userRole={userRole}
              setView={setView}
              setSelectedUserId={setSelectedUserId}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-red-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black text-red-200 border border-white/20 uppercase tracking-widest mb-3">
              <Radar size={13} className="text-red-400" /> {isEn ? 'Transparent Application Network' : 'Şeffaf Başvuru Takip Ağı'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              {t('radar.heroTitle')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              {t('radar.heroSubtitle')}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-slate-400 font-bold uppercase">{t('radar.totalApplications')}</p>
              <p className="text-xl font-black text-white mt-1">{stats.totalApplications}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-amber-300 font-bold uppercase">{t('radar.hrViewed')}</p>
              <p className="text-xl font-black text-amber-400 mt-1">{stats.hrViewedCount}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-purple-300 font-bold uppercase">{t('radar.shortlisted')}</p>
              <p className="text-xl font-black text-purple-400 mt-1">{stats.shortlistedCount}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-emerald-300 font-bold uppercase">{t('radar.interview')}</p>
              <p className="text-xl font-black text-emerald-400 mt-1">{stats.interviewCount}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <p className="text-[10px] text-rose-300 font-bold uppercase">{t('radar.feedback')}</p>
              <p className="text-xl font-black text-rose-400 mt-1">{stats.feedbackCount}</p>
            </div>
            <div className="bg-amber-500/20 rounded-2xl p-3 border border-amber-400/30">
              <p className="text-[10px] text-amber-200 font-black uppercase flex items-center gap-1">
                <Sparkles size={11} /> VIP
              </p>
              <p className="text-xl font-black text-amber-300 mt-1">{stats.protocolVIPCount}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Tab Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `${t('radar.filterAll')} (${stats.totalApplications})` },
              { id: 'active', label: `${t('radar.filterActive')} (${stats.activeProcessCount})` },
              { id: 'shortlisted', label: `${t('radar.filterShortlisted')} (${stats.shortlistedCount})` },
              { id: 'interview', label: `${t('radar.filterInterview')} (${stats.interviewCount})` },
              { id: 'feedback', label: `${t('radar.filterFeedback')} (${stats.feedbackCount})` },
              { id: 'vip', label: `${t('radar.filterVip')} (${stats.protocolVIPCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isEn ? "Search company or position..." : "Şirket veya pozisyon ara..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-700/20 focus:border-red-700 transition"
            />
          </div>
        </div>

        {/* Application Cards List */}
        <div className="space-y-5">
          {filteredApps.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
              <Radar size={40} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-black text-slate-900">Kayıtlı Başvuru Bulunamadı</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Filtre kriterlerinize uygun başvuru bulunmamaktadır. İş ve staj ilanlarını inceleyerek yeni başvurular yapabilirsiniz.
              </p>
              <button
                onClick={() => setView('jobs')}
                className="mt-4 px-4 py-2 bg-[#990000] text-white rounded-xl text-xs font-black hover:bg-red-800 transition cursor-pointer"
              >
                İlanlara Göz At
              </button>
            </div>
          ) : (
            filteredApps.map((app) => {
              const isExpanded = expandedAppId === app.id;
              const stage = RADAR_STAGES[app.radarStage] || RADAR_STAGES.SUBMITTED;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                  data-testid={`radar-card-${app.id}`}
                >
                  <div className="p-5 sm:p-7">
                    {/* Top Row: Company, Title, VIP Badge, Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 shadow-xs">
                          <SafeAvatar
                            src={app.companyLogo}
                            name={app.company}
                            size="lg"
                            rounded="rounded-xl"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-black text-slate-900">{app.jobTitle}</h3>
                            {app.isProtocolVIP && (
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide text-amber-900 bg-amber-100 border border-amber-300 flex items-center gap-1 shadow-xs"
                                title="İESÜ Rektörlüğü Kurumsal Sanayi Protokolü"
                              >
                                <Sparkles size={11} className="text-amber-600" />
                                {PROTOCOL_VIP_BADGE.title}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs font-bold text-slate-500">
                            <span className="text-[#990000] font-black">{app.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={13} className="text-slate-400" />
                              {app.appliedDate || 'Yakın Zamanda'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Current Status Pill */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${stage.bgColor} ${stage.textColor} ${stage.borderColor}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${stage.color === 'emerald' ? 'bg-emerald-500' : stage.color === 'amber' ? 'bg-amber-500' : stage.color === 'purple' ? 'bg-purple-500' : stage.color === 'rose' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                          {stage.label}
                        </span>

                        <button
                          onClick={() => handleSimulateAdvance(app.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer flex items-center gap-1"
                          title="Geliştirici & Test Simülasyonu: Bir sonraki aşamaya taşı"
                        >
                          <RotateCcw size={12} /> Test Aşama Geçişi
                        </button>
                      </div>
                    </div>

                    {/* Step Tracker Visual Line */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative">
                        {[
                          { key: 'SUBMITTED', num: 1, label: t('radar.step1') },
                          { key: 'HR_VIEWED', num: 2, label: t('radar.step2') },
                          { key: 'SHORTLISTED_TOP_15', num: 3, label: t('radar.step3') },
                          {
                            key: app.radarStage === 'DETAILED_FEEDBACK' ? 'DETAILED_FEEDBACK' : 'INTERVIEW_INVITE',
                            num: 4,
                            label: app.radarStage === 'DETAILED_FEEDBACK' ? t('radar.step4Feedback') : t('radar.step4Interview')
                          }
                        ].map((step, idx) => {
                          const currentStepNum = stage.stepNumber;
                          const isDone = currentStepNum > step.num || (currentStepNum === step.num && stage.isTerminal);
                          const isCurrent = currentStepNum === step.num && !stage.isTerminal;

                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-2xl border transition-all ${
                                isDone
                                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                                  : isCurrent
                                  ? 'bg-blue-50/80 border-blue-300 text-blue-900 ring-2 ring-blue-500/20'
                                  : 'bg-slate-50/60 border-slate-200 text-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-black uppercase">
                                  {step.label}
                                </span>
                                {isDone ? (
                                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                                ) : isCurrent ? (
                                  <Clock size={14} className="text-blue-600 animate-spin shrink-0" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                                )}
                              </div>
                              <p className="text-[10px] font-medium opacity-80 truncate">
                                {isDone
                                  ? t('radar.stageCompleted')
                                  : isCurrent
                                  ? t('radar.stageActive')
                                  : t('radar.stagePending')}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interview Invitation Card (If stage is INTERVIEW_INVITE) */}
                    {app.radarStage === 'INTERVIEW_INVITE' && app.interviewDetails && (
                      <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
                            <Video size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-emerald-950">
                              {t('radar.interviewInviteBanner')}
                            </h4>
                            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                              {isEn ? 'Date:' : 'Tarih:'} {app.interviewDetails.date} • {isEn ? 'Time:' : 'Saat:'} {app.interviewDetails.time} • {isEn ? 'Platform:' : 'Platform:'} {app.interviewDetails.platform}
                            </p>
                          </div>
                        </div>

                        <a
                          href={app.interviewDetails.link}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
                        >
                          <Video size={14} /> {t('radar.joinInterview')}
                        </a>
                      </div>
                    )}

                    {/* Detailed Feedback Bento Box (If stage is DETAILED_FEEDBACK) */}
                    {app.radarStage === 'DETAILED_FEEDBACK' && app.feedback && (
                      <div className="mt-5 p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={18} className="text-rose-600" />
                          <h4 className="text-sm font-black text-rose-950">
                            {isEn ? 'Constructive HR Evaluation & Growth Route' : 'Gerekçeli İK Değerlendirmesi & Gelişim Rotası'}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Strengths */}
                          <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
                            <h5 className="text-xs font-black text-emerald-800 flex items-center gap-1 mb-2">
                              <CheckCircle2 size={14} className="text-emerald-600" /> {t('radar.strengthsTitle')}
                            </h5>
                            <ul className="text-xs text-slate-700 font-medium space-y-1.5">
                              {app.feedback.strengths?.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Missing / Development Areas */}
                          <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-xs">
                            <h5 className="text-xs font-black text-amber-800 flex items-center gap-1 mb-2">
                              <AlertCircle size={14} className="text-amber-600" /> {t('radar.missingAreasTitle')}
                            </h5>
                            <ul className="text-xs text-slate-700 font-medium space-y-1.5">
                              {app.feedback.missingSkills?.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-600 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Actionable Advice & Smart Recommendations */}
                        <div className="bg-white p-4 rounded-xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-slate-900">
                              🎯 {t('radar.actionableAdvice')}: {app.feedback.actionableAdvice}
                            </p>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {app.feedback.suggestedMentorAction}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {app.feedback.suggestedSemView && (
                              <button
                                onClick={() => setView?.(app.feedback.suggestedSemView)}
                                className="px-3 py-1.5 bg-[#990000] text-white rounded-xl text-xs font-black hover:bg-red-800 transition cursor-pointer"
                              >
                                {t('radar.semCourse')}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleCoffeeChatClick({ company: app.company, topic: 'interview_mock' })}
                              className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                              title={isEn ? "Book a 15-min coffee chat with an alumnus at this company" : "İlgili şirkette çalışan bir mezunla 15 Dk Kahve Sohbeti randevusu al"}
                            >
                              <Coffee size={13} /> {t('radar.coffeeChat')}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeline Collapsible Toggle */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        <span>{isExpanded ? t('radar.hideAuditLog') : t('radar.auditLog')}</span>
                      </button>

                      <div className="text-[11px] text-slate-400 font-medium">
                        {t('radar.candidateRanking')}: <strong>{isEn ? `Top ${app.percentileRank || 15}% Pool` : `İlk %${app.percentileRank || 15} Havuzunda`}</strong>
                      </div>
                    </div>

                    {/* Expanded Audit Log / Timeline */}
                    {isExpanded && (
                      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in">
                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                          Canlı Başvuru & İK İşlem Kütüğü (Audit Feed)
                        </h5>
                        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                          {app.timeline?.map((item, idx) => (
                            <div key={idx} className="relative flex items-start gap-3 pl-8">
                              <div className="absolute left-2 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#990000] -translate-x-1/2" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-black text-slate-900">{item.title}</p>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {item.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5">{item.note}</p>
                                {item.reviewer && (
                                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                                    Yetkili: {item.reviewer}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Floating Subpanel Dock */}
      <SubPanelFloatingDock
        currentRole={userRole || 'student'}
        currentView="radar"
        setView={setView}
      />

      {/* 15 Dk Kahve & Mikro-Mentorluk Modalı */}
      {internalCoffeeModalOpen && (
        <AlumniCoffeeChatModal
          isOpen={internalCoffeeModalOpen}
          onClose={() => {
            setInternalCoffeeModalOpen(false);
            setSelectedAlumnusForChat(null);
          }}
          currentUser={effectiveCurrentUser}
          selectedAlumnus={selectedAlumnusForChat}
        />
      )}
    </div>
  );
}
