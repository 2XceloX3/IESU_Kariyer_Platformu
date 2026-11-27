import useAppStore from '../store/useAppStore';
import React, { useState, useEffect } from 'react';
import AdminOmniDock from './AdminOmniDock';
import { 
  Search, Bell, MessageCircle, Briefcase, Bookmark, Heart, Send, Plus, Users, Compass, 
  UserCircle2, MoreHorizontal, X, CreditCard, CheckCircle, Clock, ShieldCheck, Crown, 
  CheckCircle2, LayoutDashboard, Star, UserCheck, ArrowRight, FileText, Calendar, Wand2, 
  Home, ClipboardList, Target, Globe, ChevronDown, Sparkles, Newspaper, MapPin, Share2, Award,
  Sliders, AlertCircle, BarChart3, Settings, LogOut, Megaphone, Eye, Check, XCircle,
  Scale, Building2, GraduationCap, ChevronRight
} from 'lucide-react';
import JobsAndInternships from './JobsAndInternships';
import MessagingInterface from './MessagingInterface';
import PostComposer from './PostComposer';
import CareerShorts from './CareerShorts';
import { combineFeedItems } from '../utils/feedCombiner';
import PostCard from './PostCard';
import Logo from './Logo';
import TopProfileMenu from './TopProfileMenu';
import CalendarPlanning from './CalendarPlanning';

import NavIcon from './shared/NavIcon';
import AlumniSurveys from './AlumniSurveys';
import ExploreFeed from './ExploreFeed';
import FooterModals from './FooterModals';
import ConnectionSuggestions from './ConnectionSuggestions';
import BranchNewsWidget from './BranchNewsWidget';

export default function AdminFeed({ setView, setSelectedUserId, currentUser, userRole, academicRole, setSelectedGroupId, initialTab, portalMode = 'admin' }) {
  const isStaffPortal = portalMode === 'staff' || userRole === 'staff' || currentUser?.role === 'staff';
  const [footerModal, setFooterModal] = useState(null);
  
  // Zustand Store
  const posts = useAppStore(state => state.posts);
  const setPosts = useAppStore(state => state.setPosts);
  const stories = useAppStore(state => state.stories);
  const setStories = useAppStore(state => state.setStories);
  const notifications = useAppStore(state => state.notifications);
  const setNotifications = useAppStore(state => state.setNotifications);
  const surveys = useAppStore(state => state.surveys);
  const news = useAppStore(state => state.news);
  const events = useAppStore(state => state.events);
  const generalEvents = useAppStore(state => state.generalEvents);
  const careerOpportunities = useAppStore(state => state.careerOpportunities);
  const students = useAppStore(state => state.students);
  const alumni = useAppStore(state => state.alumni);
  const companies = useAppStore(state => state.companies);
  const academicStaff = useAppStore(state => state.academicStaff);
  const announcements = useAppStore(state => state.announcements);
  const mentorships = useAppStore(state => state.mentorships);
  const applications = useAppStore(state => state.applications);
  const setApplications = useAppStore(state => state.setApplications);
  const jobs = useAppStore(state => state.jobs);
  const setJobs = useAppStore(state => state.setJobs);
  const careerFairApplications = useAppStore(state => state.careerFairApplications) || [];
  const setCareerFairApplications = useAppStore(state => state.setCareerFairApplications);
  const groups = useAppStore(state => state.groups);
  const setGroups = useAppStore(state => state.setGroups);
  const featureSurveys = useAppStore(state => state.featureSurveys);
  const adminActiveTab = useAppStore(state => state.adminActiveTab);
  const setAdminActiveTab = useAppStore(state => state.setAdminActiveTab);

  const VALID_FEED_TABS = new Set(['feed', 'create_post', 'search', 'surveys']);
  const normalizeTab = (t) => (VALID_FEED_TABS.has(t) ? t : 'feed');

  const [activeTab, setActiveTabState] = useState(() => normalizeTab(initialTab || adminActiveTab || 'feed'));

  const setActiveTab = (tab) => {
    const safeTab = normalizeTab(tab);
    setActiveTabState(safeTab);
    if (setAdminActiveTab) setAdminActiveTab(safeTab);
  };

  useEffect(() => {
    if (initialTab) {
      const safeTab = normalizeTab(initialTab);
      setActiveTabState(safeTab);
      if (setAdminActiveTab) setAdminActiveTab(safeTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (!initialTab && adminActiveTab && VALID_FEED_TABS.has(adminActiveTab) && adminActiveTab !== activeTab) {
      setActiveTabState(adminActiveTab);
    }
  }, [adminActiveTab, initialTab]);
  const [branchFilter, setBranchFilter] = useState('all'); // 'all' | 'student' | 'alumni' | 'company'
  const [searchQuery] = useState('');

  // Pending items for quick admin moderation
  const pendingJobs = (jobs || []).filter(j => ['Beklemede', 'Onay Bekliyor', 'Pending'].includes(j?.status));
  const pendingFairApps = (careerFairApplications || []).filter(a => a.status === 'Beklemede' || !a.status);

  // Guarantee Admin branch isolation (only set branch, never auto-relogin)
  useEffect(() => {
    const store = useAppStore.getState();
    if (store.setActivePortalBranch) store.setActivePortalBranch('admin');
  }, []);

  const handleApproveJob = (jobId) => {
    if (setJobs) {
      setJobs(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Yayında' } : j));
    }
    window.toast?.success?.("✅ İlan onaylandı ve tüm üniversite portallarında yayına alındı.");
  };

  const handleRejectJob = (jobId) => {
    if (setJobs) {
      setJobs(prev => (prev || []).map(j => j.id === jobId ? { ...j, status: 'Reddedildi' } : j));
    }
    window.toast?.info?.("İlan reddedildi.");
  };

  const handleApproveFairApp = (appId) => {
    if (setCareerFairApplications) {
      setCareerFairApplications((careerFairApplications || []).map(a => a.id === appId ? { ...a, status: 'Onaylandı' } : a));
    }
    window.toast?.success?.("✅ Firma etkinlik / sponsorluk talebi onaylandı.");
  };

  const handleRejectFairApp = (appId) => {
    if (setCareerFairApplications) {
      setCareerFairApplications((careerFairApplications || []).map(a => a.id === appId ? { ...a, status: 'Reddedildi' } : a));
    }
    window.toast?.info?.("Firma talebi reddedildi.");
  };

  // Safety redirect: If cms view is requested, route cleanly to admin_cms branch
  useEffect(() => {
    if (activeTab === 'cms') {
      setActiveTabState('feed');
      if (setView) setView('admin_cms');
    }
  }, [activeTab, setView]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* ─── HYPER-MODERN NAVBAR (Z-40) ─── */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 z-40">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between relative">
          
          {/* LEFT: Logo & University Title */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('create_post')} 
              className={`p-2 rounded-full transition-all flex items-center justify-center hover:bg-amber-50 ${activeTab === 'create_post' ? 'text-amber-600 bg-amber-50' : 'text-slate-600'}`} 
              title="Duyuru & Gönderi Düzenle/Paylaş"
            >
              <Star size={22} strokeWidth={activeTab === 'create_post' ? 2.5 : 2} className={activeTab === 'create_post' ? 'fill-current text-amber-500/20' : ''} />
            </button>
            
            <div 
              role="button" 
              tabIndex={0} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setActiveTab('feed')}
            >
              <Logo className="h-10 w-auto hover:scale-105 transition-transform shrink-0" />
              <div className="hidden sm:block text-left">
                <h1 className="text-[13px] font-black text-slate-900 tracking-tight leading-none mb-0.5">İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-extrabold text-amber-600 tracking-wider">Kariyer Geliştirme Koordinatörlüğü</p>
              </div>
            </div>
          </div>

          {/* CENTER: Portal Badge (Royal Amber for Super Admin | Deep Slate-Navy for Staff) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center pointer-events-none z-20">
            {isStaffPortal ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 shadow-lg shadow-slate-900/25 border-2 border-indigo-300/50 flex items-center gap-2 whitespace-nowrap shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0"></span>
                🏛️ KURUMSAL PERSONEL & KGM ÇALIŞMA PORTALI
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 shadow-lg shadow-amber-500/25 border-2 border-yellow-300/60 flex items-center gap-2 whitespace-nowrap shrink-0">
                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse shrink-0"></span>
                👑 SÜPER YÖNETİCİ & KGM KONTROL PORTALI
              </span>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => setView('notifications')} 
              className="p-2 rounded-full transition-all flex items-center justify-center hover:bg-amber-50 text-amber-700" 
              title="Bildirimler"
            >
              <div className="relative">
                <Bell size={24} strokeWidth={2.5} className="fill-current text-amber-600/10" />
                {((notifications || []).filter(n => !n.read).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </div>
            </button>

            <TopProfileMenu 
              currentUser={currentUser || { id: 'admin_1513', name: 'Kariyer Geliştirme Koordinatörlüğü', role: isStaffPortal ? 'staff' : 'admin', avatar: '/iesu-logo.svg' }} 
              userRole={isStaffPortal ? (currentUser?.role === 'admin' ? 'admin' : 'staff') : 'admin'} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              academicRole={isStaffPortal && currentUser?.role !== 'admin' ? 'staff' : academicRole} 
              currentView={isStaffPortal ? 'staff' : 'admin'} 
            />
          </div>
        </div>
      </nav>

      {/* ─── MAIN PORTAL CONTAINER ─── */}
      <div className="pt-24 max-w-[1320px] mx-auto px-4 flex items-start justify-center gap-6 pb-28 sm:pb-20">
        
        {/* ─── LEFT PANEL: SUPER ADMIN EXECUTIVE PROFILE (270px) ─── */}
        <div className="hidden lg:flex w-[270px] shrink-0 flex-col gap-4.5 sticky top-24 self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5 z-20 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs shrink-0">
            <div className="h-24 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 relative">
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-amber-400 overflow-hidden bg-white shadow-lg p-1">
                  <Logo size="md" className="w-full h-full justify-center" />
                </div>
              </div>
            </div>

            <div className="pt-12 pb-5 px-5 text-center">
              <h2 
                onClick={() => { 
                  const selfId = currentUser?.id || 'admin_1513';
                  if (setSelectedUserId) setSelectedUserId(selfId); 
                  useAppStore.getState().setSelectedUserId?.(selfId); 
                  setView('user_profile'); 
                }} 
                className="text-[17px] font-black text-slate-900 leading-tight mb-0.5 cursor-pointer hover:text-amber-600 transition"
              >
                {currentUser?.name || 'Kariyer Geliştirme Koordinatörlüğü'}
              </h2>
              <p className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider mb-3">
                {isStaffPortal && currentUser?.role !== 'admin'
                  ? (currentUser?.staffTitle || 'KURUMSAL PERSONEL • KGM')
                  : 'SÜPER YÖNETİCİ & KOORDİNASYON MERKEZİ'}
              </p>
              
              <div className="grid grid-cols-4 gap-1 border-y border-slate-100 py-3 text-center">
                <div 
                  onClick={() => { 
                    const store = useAppStore.getState(); 
                    if (store.setActivePortalBranch) store.setActivePortalBranch('admin'); 
                    setView('jobs'); 
                  }} 
                  className="cursor-pointer hover:bg-amber-50 rounded-lg p-1 transition" 
                  title="KGM İlan & Staj Onay Masasına Git"
                >
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">İlan Onay</p>
                  <p className="text-[14px] font-black text-amber-600">{pendingJobs.length}</p>
                </div>
                <div className="border-l border-slate-100">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Öğrenciler</p>
                  <p className="text-[14px] font-black text-[#990000]">{(students || []).length}</p>
                </div>
                <div className="border-l border-slate-100">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Mezunlar</p>
                  <p className="text-[14px] font-black text-emerald-600">{(alumni || []).length}</p>
                </div>
                <div className="border-l border-slate-100">
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Başvuru</p>
                  <p className="text-[14px] font-black text-blue-600">{(applications || []).length}</p>
                </div>
              </div>

              {/* Ecosystem Quick Links */}
              <div className="pt-3 space-y-1 text-left">
                <button
                  onClick={() => setView('operasyon')}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Scale size={15} className="text-amber-600" /> Değerlendirme Masası
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={() => setView('basvuru_havuzu')}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={15} className="text-blue-600" /> ATS Aday Takibi
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
                <button
                  onClick={() => setView('admin_cms')}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-800 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={15} className="text-purple-600" /> Tam CMS Masası
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              </div>

              {/* Portal Geçiş Noktaları */}
              <div className="pt-3 border-t border-slate-100 space-y-1 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1 mb-1">
                  Portal Geçiş Noktaları
                </p>

                {/* 1. Öğrenci Kovanı */}
                <button
                  onClick={() => {
                    const store = useAppStore.getState();
                    if (store.setActivePortalBranch) store.setActivePortalBranch('student');
                    setView('student');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-[#990000] transition cursor-pointer group"
                  title="Öğrenci Portalına Geçiş Yap"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={15} className="text-[#990000] group-hover:scale-110 transition-transform" /> 
                    Öğrenci Portalı
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#990000]">Staj & USP →</span>
                </button>

                {/* 2. Mezun Kovanı */}
                <button
                  onClick={() => {
                    const store = useAppStore.getState();
                    if (store.setActivePortalBranch) store.setActivePortalBranch('alumni');
                    setView('alumni');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition cursor-pointer group"
                  title="Mezun Portalına Geçiş Yap"
                >
                  <span className="flex items-center gap-2">
                    <Award size={15} className="text-emerald-600 group-hover:scale-110 transition-transform" /> 
                    İESÜ Mezunlar Portalı
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-700">MBS & Harita →</span>
                </button>

                {/* 3. Firma Kovanı */}
                <button
                  onClick={() => {
                    const store = useAppStore.getState();
                    if (store.setActivePortalBranch) store.setActivePortalBranch('company');
                    setView('company');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition cursor-pointer group"
                  title="Firma Portalına Geçiş Yap"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={15} className="text-blue-600 group-hover:scale-110 transition-transform" /> 
                    Firma Portalı
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-700">ATS & Protokol →</span>
                </button>
              </div>

              {/* İlan & Fırsat Dağıtım Aksiyonu */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    const store = useAppStore.getState();
                    if (store.setActivePortalBranch) store.setActivePortalBranch('admin');
                    setView('jobs');
                  }}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 hover:from-amber-700 hover:to-orange-600 text-white rounded-xl text-xs font-black transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  title="Tüm Kovanlara Yeni İlan Yayınla"
                >
                  <Plus size={14} /> Yeni İlan & Kovan Dağıtım Masası
                </button>
              </div>
            </div>
          </div>

          {/* Quick Connection Suggestions */}
          <div className="shrink-0">
            <ConnectionSuggestions 
              branch="admin"
              currentUser={currentUser}
              students={students || []} 
              alumni={alumni || []} 
              companies={companies || []} 
              academicStaff={academicStaff || []}
              setSelectedUserId={setSelectedUserId} 
              setView={setView} 
            />
          </div>
        </div>

        {/* ─── CENTER PANEL: EXECUTIVE FEED (600px) ─── */}
        <div className="w-full max-w-[600px] shrink-0 space-y-6">

          {/* Create Post Native View (If activeTab === 'create_post') */}
          {activeTab === 'create_post' && (
            <div className="space-y-5 animate-fade-in mb-6">
              <div className="bg-white dark:bg-[#131c31] rounded-2xl w-full p-5 shadow-xs border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                      <Star className="fill-current" size={18} />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                        Resmî KGM Duyurusu & Gönderisi Paylaş
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Medya, karusel, etkinlik ve ortak yazar ekleyerek tüm portallarda yayınlayın.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('feed')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition cursor-pointer shrink-0"
                  >
                    ← Akışa Dön
                  </button>
                </div>
                <PostComposer
                  currentUser={currentUser}
                  userRole="admin"
                  posts={posts}
                  setPosts={setPosts}
                  defaultExpanded={true}
                  embedded={true}
                />
              </div>

              {/* Recent Published Posts Section on Create Post Screen */}
              {(() => {
                const recentItems = combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities);
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Son Yayınlanan Gönderiler & Duyurular ({recentItems.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('feed')}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        Tüm Akışı Gör →
                      </button>
                    </div>
                    {recentItems.slice(0, 5).map(post => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUser={currentUser}
                        students={students || []}
                        alumni={alumni || []}
                        setPosts={setPosts}
                        setView={setView}
                        setSelectedUserId={setSelectedUserId}
                      />
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Explore Feed (If activeTab === 'search') */}
          {activeTab === 'search' && (
            <ExploreFeed 
              posts={posts} 
              setView={setView} 
              setSelectedUserId={setSelectedUserId} 
              currentUser={currentUser} 
              hideDock={true}
              onBack={() => setActiveTab('feed')}
            />
          )}

          {/* MAIN FEED STREAM */}
          {activeTab === 'feed' && (
            <div className="w-full shrink-0 flex flex-col gap-5 animate-fade-in">
              <PostComposer currentUser={currentUser} userRole="admin" posts={posts} setPosts={setPosts} />
              
              {/* ══════ PORTAL STREAM FILTER TABS ══════ */}
              <div className="bg-white dark:bg-[#131c31] rounded-2xl p-2 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between px-3 pt-1 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <span>Portal Akış Gözlemcisi</span>
                  <span className="text-amber-600 font-bold">Genel Bakış</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-none">
                  {[
                    { id: 'all', label: '👑 Tüm Portallar' },
                    { id: 'student', label: '🎒 Öğrenci & Staj' },
                    { id: 'alumni', label: '🎓 Mezun Portalı' },
                    { id: 'company', label: '🏢 Firma & ATS' },
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBranchFilter(b.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                        branchFilter === b.id
                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 border border-yellow-200/60'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 hover:text-slate-900'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 👑 KGM MASTER TALEP & ONAY MERKEZİ (FİRMA & MEZUN PORTALI DENETİMİ) */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/80 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm">
                
                {/* Header & Sub-Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30">
                      <Crown size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                        KGM Master Talep & Onay Masası
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300">
                          {pendingJobs.length + pendingFairApps.length} Bekleyen
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-600 font-medium">
                        Kurumsal firma ilanlarını ve mezun etkinliği başvurularını tek merkezden yönetin.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setView('yonetim_konsolu')}
                    className="self-start sm:self-auto text-xs font-black text-amber-800 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    <span>Detaylı Konsol</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* CONTENT: Company Demands */}
                <div className="space-y-2">
                    {pendingJobs.length === 0 && pendingFairApps.length === 0 ? (
                      <div className="bg-white/80 p-4 rounded-2xl border border-blue-100 text-center">
                        <p className="text-xs text-slate-500 font-bold">Onay bekleyen firma ilanı veya etkinlik talebi bulunmuyor.</p>
                      </div>
                    ) : (
                      <>
                        {/* Job Postings */}
                        {pendingJobs.slice(0, 2).map(job => (
                          <div key={job.id} className="bg-white p-3.5 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-blue-300 transition">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                                  {job.type || 'İş İlanı'}
                                </span>
                                <span className="text-[11px] font-bold text-slate-400">• {job.companyName || job.company}</span>
                              </div>
                              <p className="text-xs font-black text-slate-900 truncate">{job.title}</p>
                              <p className="text-[11px] text-slate-500 font-medium truncate">{job.location || 'İstanbul'} • {job.department || 'Tüm Bölümler'}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button 
                                onClick={() => handleRejectJob(job.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                              >
                                Reddet
                              </button>
                              <button 
                                onClick={() => handleApproveJob(job.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <Check size={14} /> Onayla
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Fair Applications */}
                        {pendingFairApps.slice(0, 2).map(app => (
                          <div key={app.id} className="bg-white p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-amber-300 transition">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200">
                                  Fuar / Etkinlik Talebi
                                </span>
                                <span className="text-[11px] font-bold text-slate-400">• {app.companyName}</span>
                              </div>
                              <p className="text-xs font-black text-slate-900 truncate">{app.answers?.eventType || 'Kariyer Fuarı Sponsorluğu'}</p>
                              <p className="text-[11px] text-slate-500 font-medium truncate">{app.answers?.boothType || 'Stand Talebi'}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <button 
                                onClick={() => handleRejectFairApp(app.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition cursor-pointer"
                              >
                                Reddet
                              </button>
                              <button 
                                onClick={() => handleApproveFairApp(app.id)}
                                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                              >
                                <Check size={14} /> Onayla
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

              </div>

              {/* POST STREAM WITH BRANCH FILTER */}
              <div className="space-y-5">
                {(() => {
                  const allItems = combineFeedItems(posts, events, news, announcements, jobs, generalEvents, careerOpportunities);

                  // Filter by branch
                  const branchFilteredItems = allItems.filter(item => {
                    if (branchFilter === 'all') return true;
                    
                    if (branchFilter === 'student') {
                      return item.author?.role === 'student' || item.type === 'student_post' || item.authorRole === 'student';
                    }
                    if (branchFilter === 'alumni') {
                      return item.author?.role === 'alumni' || item.authorRole === 'alumni' || item.category === 'Mezun' || item.source === 'alumni' || item.type === 'alumni_post';
                    }
                    if (branchFilter === 'company') {
                      return item.isJob || item.isCareerOpportunity || item.feedType === 'job' || item.feedType === 'career_opp' || item.type === 'job' || item.type === 'internship' || item.author?.role === 'company' || item.author?.role === 'employer' || Boolean(item.companyName);
                    }
                    return true;
                  });

                  const filtered = branchFilteredItems.filter(post => 
                    (post.content || post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                    (post.author?.name || post.authorName || (typeof post.author === 'string' ? post.author : '')).toLowerCase().includes(searchQuery.toLowerCase())
                  );

                  if (filtered.length === 0) {
                    const portalNames = {
                      all: 'Üniversite genelinde',
                      student: 'Öğrenci portalında',
                      alumni: 'Mezun portalında',
                      company: 'Firma & ATS portalında'
                    };
                    return (
                      <div className="p-10 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center min-h-[280px]">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                          <Crown size={32} />
                        </div>
                        <h3 className="text-base font-black text-slate-900 mb-1">
                          {portalNames[branchFilter] || 'Bu portalda'} henüz yeni yayın bulunmuyor.
                        </h3>
                        <p className="text-xs text-slate-500 font-medium max-w-sm mb-4">
                          Yönetim masasından bu portala doğrudan resmî duyuru gönderebilir veya CMS tablosunu inceleyebilirsiniz.
                        </p>
                        <button
                          onClick={() => setActiveTab('create_post')}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          + Resmî Duyuru Gönder
                        </button>
                      </div>
                    );
                  }

                  return filtered.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      currentUser={currentUser} 
                      students={students || []} 
                      alumni={alumni || []} 
                      setPosts={setPosts}
                      setView={setView}
                      setSelectedUserId={setSelectedUserId}
                    />
                  ));
                })()}
              </div>

            </div>
          )}

          {/* SURVEYS TAB (If featureSurveys && activeTab === 'surveys') */}
          {featureSurveys && activeTab === 'surveys' && (
            <div className="w-full shrink-0 animate-fade-in mb-6">
              <AlumniSurveys surveys={surveys} currentUser={currentUser} />
            </div>
          )}

        </div>

        {/* ─── RIGHT PANEL: EXECUTIVE QUICK MANAGEMENT (320px) ─── */}
        <div className="hidden xl:block w-[320px] shrink-0 space-y-5 sticky top-24 self-start max-h-[calc(100vh-6.5rem)] overflow-y-auto overscroll-contain custom-scrollbar pr-1.5 pb-24">
          
          {/* Ultra-Modern Royal Slate & Executive Gold Bento Management Card */}
          <div className="bg-gradient-to-br from-slate-950 via-[#0A2342] to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-amber-500/40 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/30">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm leading-tight">Canlı Ekosistem Özeti</h3>
                  <p className="text-[11px] text-amber-200/80 font-medium">Reaktif Platform Sayaçları</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aktif İş İlanı</p>
                <p className="text-base font-black text-white mt-0.5">{(jobs || []).length}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Kayıtlı Mezun</p>
                <p className="text-base font-black text-emerald-400 mt-0.5">{(alumni || []).length}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Kayıtlı Şirket</p>
                <p className="text-base font-black text-amber-300 mt-0.5">{(companies || []).length}</p>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">İş Başvuruları</p>
                <p className="text-base font-black text-sky-400 mt-0.5">{(applications || []).length}</p>
              </div>
            </div>

            {/* Direct console action buttons */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <button
                onClick={() => setView('yonetim_konsolu')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Scale size={15} /> Yönetim Konsoluna Git
              </button>
              <button
                onClick={() => setView('basvuru_havuzu')}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-white/10 cursor-pointer"
              >
                <Briefcase size={14} /> Başvuru Havuzunu İncele
              </button>
            </div>
          </div>

          {/* Official Announcements & News Widget */}
          <div className="shrink-0">
            <BranchNewsWidget branch={isStaffPortal ? 'staff' : 'admin'} currentUser={currentUser} setView={setView} />
          </div>

          {/* Right Sidebar Footer */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-6 text-[11px] text-slate-400 font-medium px-4 text-center">
            <button onClick={() => setFooterModal('privacy')} className="hover:text-amber-600 transition cursor-pointer">Sözleşme & KVKK</button>
            <button onClick={() => setFooterModal('help')} className="hover:text-amber-600 transition cursor-pointer">Destek</button>
            <button onClick={() => setFooterModal('about')} className="hover:text-amber-600 transition cursor-pointer">Hakkımızda</button>
            <div className="w-full flex items-center justify-center gap-1 mt-2 text-slate-400 font-bold">
              <span>{isStaffPortal ? 'İESÜ Kurumsal Personel Portalı' : 'İESÜ KGM Süper Yönetici Portalı'}</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>

      </div>

      <AdminOmniDock 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId} 
        currentUser={currentUser} 
        theme={isStaffPortal ? 'indigo' : 'amber'} 
        homeView={isStaffPortal ? 'staff' : 'admin'} 
      />

      <FooterModals activeModal={footerModal} onClose={() => setFooterModal(null)} />
    </div>
  );
}
