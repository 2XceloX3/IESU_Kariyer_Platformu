import React, { useMemo, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import useAppStore from '../store/useAppStore';
import eventBus from '../brain/eventBus';
import {  Briefcase, CheckCircle2, Clock, XCircle, ChevronRight, UserCircle2 , ChevronLeft, Home, Compass, Users, MessageCircle, Bell, Search, Globe } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import Logo from './Logo';
import SafeAvatar from './shared/SafeAvatar';
import SubPanelFloatingDock from './SubPanelFloatingDock';

const NavIcon = ({ icon, label, badge, active, onClick }) => {
  const getClasses = () => {
    switch (label) {
      case 'Akış': return { text: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-500', glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]' };
      case 'Kariyer Ağı': return { text: 'text-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500', glow: 'drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]' };
      case 'İş ve Staj': return { text: 'text-emerald-500', bg: 'bg-emerald-50', badge: 'bg-emerald-500', glow: 'drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]' };
      case 'Topluluklar': return { text: 'text-orange-500', bg: 'bg-teal-50', badge: 'bg-orange-500', glow: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.8)]' };
      default: return { text: 'text-[#990000]', bg: 'bg-red-50', badge: 'bg-[#990000]', glow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]' };
    }
  };
  const theme = getClasses();
  return (
    <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }}  className="relative group cursor-pointer" onClick={onClick} title={label}>
      <div className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-300 ${active ? `${theme.bg} scale-105` : 'hover:bg-gray-100/80 hover:scale-105'}`}>
        <div className={`transition-all duration-300 ${active ? `${theme.text} ${theme.glow}` : 'text-gray-500 group-hover:text-gray-900'}`}>
          {React.cloneElement(icon, { size: active ? 22 : 20, strokeWidth: active ? 2.5 : 2 })}
        </div>
      </div>
      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300 ${active ? `${theme.badge} opacity-100 scale-100` : 'opacity-0 scale-0'}`} />
    </div>
  );
};

export default function ApplicationsPanel({ currentUser, userRole, setView, setSelectedUserId }) {
  const storeCurrentUser = useAppStore(state => state.currentUser);
  const effectiveCurrentUser = currentUser || storeCurrentUser;
  const { applications, setApplications } = useAppStore();
  const activePortalBranch = useAppStore(state => state.activePortalBranch);
  const effectiveRole = activePortalBranch === 'student' ? 'student' :
    activePortalBranch === 'alumni' ? 'alumni' :
    activePortalBranch === 'academic' ? 'academic' :
    activePortalBranch === 'company' ? 'company' :
    activePortalBranch === 'admin' ? 'admin' :
    (userRole || 'student');

  const backTarget = (
    activePortalBranch === 'student' ? 'student' :
    activePortalBranch === 'alumni' ? 'alumni' :
    activePortalBranch === 'academic' ? 'academic' :
    activePortalBranch === 'company' ? 'company' :
    activePortalBranch === 'admin' ? 'admin' :
    (userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student')
  );

  // Clockwork cross-hive synchronizer: Listen to real-time status updates from CompanyATSBoard or Admin
  useEffect(() => {
    if (!eventBus || typeof eventBus.on !== 'function') return;
    const unsub = eventBus.on('application:status', (data) => {
      if (!data) return;
      setApplications(prev => (prev || []).map(app => {
        if (app.id === data.applicationId || (data.applicantName && app.applicantName === data.applicantName)) {
          return { 
            ...app, 
            status: data.status, 
            notes: data.notes || `Aşama "${data.status}" olarak güncellendi (${data.company || 'İESÜ'}).` 
          };
        }
        return app;
      }));
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [setApplications]);

  // If student: show their applications
  // If company: show applications to their jobs

  // Load student/company applications from Firestore (no app_demo_* fallback)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const uid = auth?.currentUser?.uid || effectiveCurrentUser?.uid || effectiveCurrentUser?.id;
      if (!uid) return;
      try {
        const mod = await import('../services/jobsApplicationsFs');
        let remote = [];
        if (effectiveRole === 'student' || effectiveRole === 'alumni') {
          remote = await mod.fetchApplicationsForApplicant(uid);
        } else if (effectiveRole === 'company' || effectiveRole === 'employer') {
          remote = await mod.fetchApplicationsForCompany(uid);
        } else {
          return;
        }
        if (cancelled || !remote.length) return;
        setApplications(prev => {
          const map = new Map((prev || []).map(a => [a.id, a]));
          remote.forEach(a => map.set(a.id, { ...map.get(a.id), ...a }));
          return [...map.values()];
        });
      } catch (e) {
        console.warn('ApplicationsPanel FS load failed', e?.message);
      }
    })();
    return () => { cancelled = true; };
  }, [effectiveRole, effectiveCurrentUser?.id, effectiveCurrentUser?.uid, setApplications]);

  const myApplications = useMemo(() => {
    const uid = auth?.currentUser?.uid || effectiveCurrentUser?.uid || effectiveCurrentUser?.id;
    if (effectiveRole === 'student' || effectiveRole === 'alumni') {
      return (applications || []).filter(app =>
        uid && (app.applicantId === uid || app.userId === uid)
      );
    }
    if (userRole === 'admin' || effectiveCurrentUser?.role === 'admin' || effectiveRole === 'admin') {
      return applications || [];
    }
    // Company: companyId only (F-ATS-008 — no name filter)
    return (applications || []).filter(app => uid && app.companyId === uid);
  }, [applications, effectiveRole, userRole, effectiveCurrentUser]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const { updateApplicationStatusFs } = await import('../services/jobsApplicationsFs');
      await updateApplicationStatusFs(appId, newStatus);
    } catch (e) {
      window.toast?.error?.(e?.message || 'Durum güncellenemedi');
      return;
    }
    setApplications((applications || []).map(app =>
      app.id === appId ? { ...app, status: newStatus } : app
    ));

    if (eventBus && typeof eventBus.emit === 'function') {
      eventBus.emit('application:status', {
        applicationId: appId,
        status: newStatus,
        company: effectiveCurrentUser?.name || 'Firma',
        timestamp: new Date().toISOString()
      });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Onaylandı': case 'Mülakat': return 'bg-green-100 text-green-700 border-green-200';
      case 'Reddedildi': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Onaylandı': case 'Mülakat': return <CheckCircle2 size={16} />;
      case 'Reddedildi': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(backTarget)}
              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 hover:text-[#990000] transition cursor-pointer shrink-0"
              title="Geri Dön"
            >
              <ChevronLeft size={20} />
            </button>
            <div role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } }} className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setView(backTarget)}>
              <Logo className="h-10 w-auto hover:scale-105 transition-transform" color={effectiveRole === 'admin' ? 'amber' : 'red'} />
              <div className="hidden lg:block">
                <h1 className={`text-[13px] font-black tracking-tight leading-none mb-0.5 ${effectiveRole === 'admin' ? 'text-amber-800' : 'text-[#990000]'}`}>İstanbul Esenyurt Üniversitesi</h1>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider">Kariyer Geliştirme Koordinatörlüğü</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NavIcon icon={<Home />} label="Akış" onClick={() => setView(backTarget)} />
            <NavIcon icon={<Compass />} label="Kariyer Ağı" onClick={() => setView('network')} />
            <NavIcon icon={<Briefcase />} label="İş ve Staj" active={true} onClick={() => setView('jobs')} />
            <div className="ml-2">
              <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-[1000px] mx-auto px-4 lg:px-8 pt-24">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${userRole === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
          <Briefcase size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-900">
            {userRole === 'admin' ? 'Tüm Üniversite Başvuru & Aday Havuzu (Süper Yönetici)' : userRole === 'student' ? 'Başvurularım' : 'Gelen Başvurular'}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {userRole === 'admin' ? 'Öğrenci ve mezunların kurumsal firmalara yaptığı tüm başvuruları inceleyin ve durumlarını denetleyin.' : userRole === 'student' ? 'İş ve staj başvurularınızın durumunu takip edin.' : 'İlanlarınıza gelen başvuruları inceleyin ve yönetin.'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {myApplications.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Henüz Başvuru Yok</h3>
            <p className="text-gray-500">
              {userRole === 'student' ? 'Henüz hiçbir ilana başvurmadınız. İlanlar sekmesinden fırsatları inceleyebilirsiniz.' : 'Henüz ilanlarınıza başvuru yapılmadı.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(myApplications || []).map(app => (
              <div key={app.id} className="p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{app.date}</span>
                  </div>
                  
                  {userRole === 'company' && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                      <SafeAvatar name={app.applicantName} size="md" className="shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{app.applicantName}</p>
                        <p className="text-xs text-gray-500">Aday Profili</p>
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{app.jobTitle}</h3>
                  <p className="text-sm text-gray-600 mb-4">{app.company}</p>
                </div>

                {userRole === 'company' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Mülakat')}
                      className={`py-2 rounded-xl text-xs font-bold transition ${app.status === 'Mülakat' ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
                    >
                      Mülakat
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Reddedildi')}
                      className={`py-2 rounded-xl text-xs font-bold transition ${app.status === 'Reddedildi' ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
                    >
                      Reddet
                    </button>
                    <button 
                      onClick={() => handleStatusChange(app.id, 'Beklemede')}
                      className={`py-2 rounded-xl text-xs font-bold transition ${app.status === 'Beklemede' ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}
                    >
                      Beklet
                    </button>
                  </div>
                )}
                
                {effectiveRole === 'student' && (
                  <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => setView('jobs')} 
                      className="text-sm font-bold text-red-600 hover:text-red-800 flex items-center gap-1 transition cursor-pointer"
                    >
                      İlan Detayı <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      </main>

      {/* Floating Dock */}
      {effectiveRole === 'admin' ? null : (
        <SubPanelFloatingDock 
          currentUser={effectiveCurrentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={effectiveRole || 'student'}
          activeTab="jobs"
        />
      )}
    </div>
  );
}



