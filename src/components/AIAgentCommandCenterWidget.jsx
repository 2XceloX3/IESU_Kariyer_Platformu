import React, { useState, useEffect } from 'react';
import { Bot, Cpu, Sparkles, CheckCircle2, Play, Activity, Terminal, Shield, Eye, X, Layers, Code2, Palette, RefreshCw, Zap } from 'lucide-react';

export default function AIAgentCommandCenterWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'logs' | 'reports'
  const [isSimulating, setIsSimulating] = useState(false);

  // Subagents state
  const [subagents, setSubagents] = useState([
    {
      id: 'antigravity',
      name: 'Antigravity Leader AI',
      role: 'Ana Lider Ajan',
      type: 'parent',
      status: 'active',
      avatar: '🚀',
      task: 'Alt ajanları koordine ediyor ve kod değişikliklerini yönetiyor.',
      progress: 95,
      tokens: '42.8k',
      color: 'from-amber-500 to-yellow-600',
      borderColor: 'border-amber-400'
    },
    {
      id: 'ui_ux_architect',
      name: 'UI/UX & Estetik Mimarı',
      role: 'Tasarım Sistem Mimarı',
      type: 'subagent',
      status: 'completed',
      avatar: '🎨',
      task: 'Tasarım taramasını tamamladı (Glassmorphism 2.0 & Kinetic Buttons önerildi).',
      progress: 100,
      tokens: '14.2k',
      color: 'from-purple-600 to-indigo-600',
      borderColor: 'border-purple-400'
    },
    {
      id: 'code_auditor',
      name: 'React Kod & Mimarî Denetçisi',
      role: 'Kod Denetim Uzmanı',
      type: 'subagent',
      status: 'running',
      avatar: '🔍',
      task: 'src/components bileşen yapısını ve Zustand store akışlarını denetliyor.',
      progress: 78,
      tokens: '18.5k',
      color: 'from-blue-600 to-cyan-600',
      borderColor: 'border-[#990000]'
    },
    {
      id: 'qa_tester',
      name: 'QA Test & Hata Ayıklama',
      role: 'Hata Yakalama Ajanı',
      type: 'subagent',
      status: 'idle',
      avatar: '🛡️',
      task: 'Çalışma zamanı hatalarını ve eksik import kilitlenmelerini simüle ediyor.',
      progress: 45,
      tokens: '9.1k',
      color: 'from-emerald-600 to-teal-600',
      borderColor: 'border-emerald-400'
    }
  ]);

  // Simulated live logs stream
  const [logs, setLogs] = useState([
    { time: '12:40:04', agent: 'ui_ux_architect', text: '🔍 src/components/AdminDashboard.jsx tasarım taraması başlatıldı.', type: 'info' },
    { time: '12:40:08', agent: 'code_auditor', text: '⚡ Zustand store aksiyonları ve React prop modelleri taranıyor...', type: 'info' },
    { time: '12:40:15', agent: 'ui_ux_architect', text: '✨ Rapor Hazır: Glassmorphism 2.0 ve Kinetic Shimmer Buton önerileri oluşturuldu.', type: 'success' },
    { time: '12:40:22', agent: 'antigravity', text: '🤝 Ajan raporları birleştirildi. Kullanıcıya canlı görsel sunum hazırlandı.', type: 'success' }
  ]);

  // Run new task simulation
  const handleTriggerTask = (agentId, taskName) => {
    setIsSimulating(true);
    const now = new Date().toLocaleTimeString('tr-TR');
    
    setSubagents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'running', progress: 10, task: taskName } : a));
    setLogs(prev => [{ time: now, agent: agentId, text: `▶️ Yeni Görev Başlatıldı: ${taskName}`, type: 'action' }, ...prev]);

    setTimeout(() => {
      setSubagents(prev => prev.map(a => a.id === agentId ? { ...a, progress: 60 } : a));
      setLogs(prev => [{ time: new Date().toLocaleTimeString('tr-TR'), agent: agentId, text: `⚡ Dosya ve kod analizleri tamamlanıyor...`, type: 'info' }, ...prev]);
    }, 1500);

    setTimeout(() => {
      setSubagents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'completed', progress: 100 } : a));
      setLogs(prev => [{ time: new Date().toLocaleTimeString('tr-TR'), agent: agentId, text: `✅ Görev Başarıyla Tamamlandı ve Lider Ajan Antigravity'ye raporlandı.`, type: 'success' }, ...prev]);
      setIsSimulating(false);
      window.toast?.success(`🤖 Ajan ${agentId} görevini başarıyla tamamladı!`);
    }, 3000);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (BOTTOM LEFT) */}
      <div className="fixed bottom-6 left-6 z-[9999] animate-bounce-subtle">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-950 via-[#7A0000] to-slate-900 text-white rounded-full shadow-2xl border-2 border-amber-400/60 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <div className="relative">
            <Bot size={22} className="text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
          </div>

          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">Ajan Ekibi Canlı İzleme</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-full border border-emerald-400/30">4 Aktif</span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium truncate max-w-[170px]">Antigravity + 3 Alt Ajan Çalışıyor</p>
          </div>

          <Sparkles size={16} className="text-amber-300 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* FULL AGENT OPERATIONS MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh] relative">
            
            {/* MODAL HEADER */}
            <div className="p-5 bg-gradient-to-r from-slate-950 via-[#7A0000] to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-black border border-amber-400/30 shadow-inner">
                  <Cpu size={22} className="animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-white tracking-tight">Antigravity AI Ajan Ekibi Komuta Merkezi</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/40">
                      Canlı İş Birliği Sistemi
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Antigravity Ana Ajanı ve 3 Uzman Alt Ajanın Gerçek Zamanlı Çalışma & Analiz Paneli
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* TAB NAVIGATION */}
            <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'pipeline' ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Layers size={14} /> 1. Ajan Ekip Ağı & Boru Hattı
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                    activeTab === 'logs' ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Terminal size={14} /> 2. Canlı Düşünce & Kod Logları
                </button>
              </div>

              <span className="text-[11px] text-amber-300 font-mono flex items-center gap-1.5 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                <Activity size={12} className="animate-pulse text-amber-400" />
                Toplam Token: 84.6k • Aktif Ajan: 4
              </span>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: VISUAL PIPELINE NETWORK */}
              {activeTab === 'pipeline' && (
                <div className="space-y-6">
                  
                  {/* CENTRAL LEADER AI CARD */}
                  <div className="p-5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 rounded-3xl border-2 border-amber-400/50 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30 shrink-0">
                          🚀
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black text-white">Antigravity Leader AI</h4>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 border border-amber-400/30">
                              Ana Orkestra Lideri
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium mt-1">
                            Kullanıcının isteklerini analiz eder, alt ajanları görevlendirir ve kod değişikliklerini uygular.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleTriggerTask('code_auditor', 'Tüm src/components Bileşen Taraması')}
                          disabled={isSimulating}
                          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={14} className={isSimulating ? 'animate-spin' : ''} />
                          Tüm Ajanları Çalıştır
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CONNECTED SUBAGENTS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {subagents.filter(a => a.type === 'subagent').map(agent => (
                      <div key={agent.id} className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 hover:border-slate-600 transition flex flex-col justify-between relative group">
                        
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-2xl">{agent.avatar}</span>
                              <div>
                                <h5 className="font-black text-sm text-white">{agent.name}</h5>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{agent.role}</p>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              agent.status === 'running' ? 'bg-[#990000]/20 text-red-400 border border-red-500/30 animate-pulse' :
                              agent.status === 'completed' ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {agent.status === 'running' ? '⚡ Çalışıyor' : agent.status === 'completed' ? '✓ Tamamlandı' : 'Beklemede'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 font-medium mb-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 min-h-[50px]">
                            {agent.task}
                          </p>

                          {/* Progress bar */}
                          <div className="space-y-1 mb-4">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                              <span>Görev İlerlemesi</span>
                              <span>%{agent.progress}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${agent.color} transition-all duration-500`}
                                style={{ width: `${agent.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono">Token: {agent.tokens}</span>
                          
                          <button
                            onClick={() => handleTriggerTask(agent.id, `${agent.name} Yeniden Analiz`)}
                            disabled={isSimulating}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Play size={12} /> Test Et
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* VISUAL ARCHITECTURE EXPLANATION CARD */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-300 flex items-center justify-center font-bold shrink-0">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-0.5">Ajan Ekibi Nasıl Birlikte Çalışıyor?</p>
                      <p className="text-slate-400 text-[11px]">
                        Sen bir talep verdiğinde Antigravity Ana Ajanı problemi böler; Tasarım Ajanı UI/UX kısımlarını, Kod Denetçi Ajanı React bileşenlerini, QA Ajanı ise hataları eşzamanlı olarak tarayıp ortak kararla kodu günceller.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: LIVE LOGS & THOUGHT STREAM */}
              {activeTab === 'logs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-sm text-white flex items-center gap-2">
                      <Terminal size={16} className="text-amber-400" /> Canlı Ajan Düşünce & İşlem Logları (Real-time Stream)
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Log Adedi: {logs.length}</span>
                  </div>

                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 font-mono text-xs space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar">
                    {logs.map((log, index) => (
                      <div key={index} className="flex items-start gap-3 py-1.5 border-b border-slate-900/80 last:border-0 animate-fade-in">
                        <span className="text-slate-500 text-[10px] shrink-0 pt-0.5">{log.time}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold shrink-0 bg-slate-800 text-amber-300 border border-slate-700">
                          @{log.agent}
                        </span>
                        <p className={`flex-1 text-slate-300 ${log.type === 'success' ? 'text-emerald-400' : log.type === 'action' ? 'text-amber-300' : ''}`}>
                          {log.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-emerald-400" /> Tüm ajanlar Antigravity alt ajan protokolü ile tam senkronize.
              </span>

              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
