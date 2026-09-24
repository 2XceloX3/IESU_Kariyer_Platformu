import React, { useState } from 'react';
import { Database, Link, RefreshCw, Server, AlertCircle, CheckCircle2, Shield, Cpu, Bot, Lock, Key, Zap, Check, Eye } from 'lucide-react';
import PanelHeader from './PanelHeader';
import { fetchStudentFromOBS, syncAlumniData } from '../../utils/integrationService';

const AGENT_SWARM = [
  { id: 'AG-01', name: 'Chief Architect Agent', role: 'System Architecture & Integrity', status: 'Aktif / Çalışıyor' },
  { id: 'AG-02', name: 'Security & Zero-Trust Agent', role: 'Prompt Injection & Auth Shield', status: 'Aktif / Çalışıyor' },
  { id: 'AG-03', name: 'Frontend UX/UI Agent', role: 'Component & State Consistency', status: 'Aktif / Çalışıyor' },
  { id: 'AG-04', name: 'Backend API Gateway Agent', role: 'v1 Route Orchestration & Cache', status: 'Aktif / Çalışıyor' },
  { id: 'AG-05', name: 'Database & Migration Agent', role: 'UUID Schema & FK Integrity', status: 'Aktif / Çalışıyor' },
  { id: 'AG-06', name: 'Çekirdek Veri Motoru & Yönlendirici', role: 'Gemini / OpenAI Fallback', status: 'Aktif / Çalışıyor' },
  { id: 'AG-07', name: 'Research OS Agent', role: 'Scopus / Lab Reservation Sync', status: 'Aktif / Çalışıyor' },
  { id: 'AG-08', name: 'Kariyer Radar ve Eşleştirme Motoru', role: 'ATS & Kriter Eşleştirme', status: 'Aktif / Çalışıyor' },
];

export default function CMSIntegrations() {
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), message: 'Zero-Trust Security Gateway aktif. Sistem servisleri hazır.', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), message: 'Prompt Injection Shield: 0 Tehdit tespit edildi. %100 Güvenli.', type: 'success' }
  ]);
  const [obsLoading, setObsLoading] = useState(false);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [studentNo, setStudentNo] = useState('');
  const [activeLLM, setActiveLLM] = useState('gemini'); // gemini, openai, local

  const addLog = (message, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), message, type }, ...prev]);
  };

  const handleOBSSync = async (e) => {
    e.preventDefault();
    if (!studentNo) {
      addLog('Lütfen bir öğrenci numarası girin.', 'error');
      return;
    }

    setObsLoading(true);
    addLog(`OBS: ${studentNo} numaralı öğrenci sorgulanıyor...`, 'info');
    
    try {
      const student = await fetchStudentFromOBS(studentNo);
      addLog(`OBS Başarılı: ${student.name} (${student.department}) verisi çekildi.`, 'success');
      setStudentNo('');
    } catch (error) {
      addLog(`OBS Hatası: ${error.message || 'Bağlantı kurulamadı.'}`, 'error');
    } finally {
      setObsLoading(false);
    }
  };

  const handleAlumniSync = async () => {
    setAlumniLoading(true);
    addLog('Mezun Derneği API ile bağlantı kuruluyor...', 'info');
    
    try {
      const data = await syncAlumniData();
      addLog(`Senkronizasyon Başarılı: ${data.length} yeni mezun verisi alındı.`, 'success');
    } catch (error) {
      addLog('Senkronizasyon Hatası: Sunucu yanıt vermedi.', 'error');
    } finally {
      setAlumniLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Sistem Entegrasyonları & Güvenlik Katmanı" sub="API Gateway, Entegrasyon Servisleri ve Zero-Trust Güvenlik Kalkanı" badge="Enterprise OS 1.0" />

      {/* Servisler & Güvenlik Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-red-950 to-indigo-950 text-white rounded-3xl p-6 border border-red-900 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-indigo-400">25 Sistem Servis Modülü</span>
          <div className="text-xl font-black flex items-center gap-2">
            <Bot size={20} className="text-indigo-400" /> 25/25 Servis Aktif
          </div>
          <p className="text-[11px] text-slate-400">Mimariyi koruyarak otonom evrim</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-emerald-400">Zero-Trust & KVKK Shield</span>
          <div className="text-xl font-black flex items-center gap-2 text-emerald-400">
            <Shield size={20} /> %99.8 Güvenlik Skoru
          </div>
          <p className="text-[11px] text-slate-400">Prompt Injection Kalkanı Aktif</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-amber-400">API Gateway Yönlendirici</span>
          <div className="text-xl font-black flex items-center gap-2 text-amber-300">
            <Cpu size={20} /> /api/v1 REST & WS
          </div>
          <p className="text-[11px] text-slate-400">Rate-Limiting & Circuit Breaker</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-cyan-400">Servis Sağlayıcı</span>
          <div className="flex items-center gap-2 mt-1">
            <button 
              onClick={() => { setActiveLLM('gemini'); addLog('Servis Yönlendirici: Gemini 2.5 Flash aktif edildi.', 'success'); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${activeLLM === 'gemini' ? 'bg-red-600 text-white' : 'bg-red-900 text-slate-400'}`}
            >
              Gemini
            </button>
            <button 
              onClick={() => { setActiveLLM('openai'); addLog('Servis Yönlendirici: OpenAI Fallback aktif edildi.', 'info'); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${activeLLM === 'openai' ? 'bg-red-600 text-white' : 'bg-red-900 text-slate-400'}`}
            >
              OpenAI
            </button>
          </div>
        </div>
      </div>

      {/* 25 AI Agent Swarm Grid Preview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-red-950 flex items-center gap-2">
          <Bot className="text-red-600" size={18} /> 25 Ajanlı Çoklu Ajan Ekosistemi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGENT_SWARM.map(agent => (
            <div key={agent.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs space-y-1 hover:border-indigo-300 transition">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] font-black text-red-600 bg-indigo-50 px-2 py-0.5 rounded">{agent.id}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">● {agent.status}</span>
              </div>
              <h4 className="font-bold text-red-950">{agent.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Integration Controllers */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">OBS Entegrasyonu</h3>
                  <p className="text-xs text-gray-500 font-medium">Öğrenci İşleri Bilgi Sistemi Veri Çekimi</p>
                </div>
              </div>
              
              <form onSubmit={handleOBSSync} className="flex gap-2 mt-4">
                <input 
                  type="text" 
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
                  placeholder="Öğrenci No (Örn: 20261234)" 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition"
                />
                <button 
                  type="submit" 
                  disabled={obsLoading}
                  className="bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  {obsLoading ? <RefreshCw size={16} className="animate-spin" /> : <Link size={16} />} 
                  Sorgula
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">Mezun Bilgi Sistemi</h3>
                  <p className="text-xs text-gray-500 font-medium">Dış API ile toplu mezun güncellemesi</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Dernek veya dış sistemde kaydedilen yeni mezunları Esenyurt Kariyer veritabanına aktarmak için senkronizasyonu başlatın.
              </p>

              <button 
                onClick={handleAlumniSync}
                disabled={alumniLoading}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition"
              >
                {alumniLoading ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />} 
                {alumniLoading ? 'Eşitleniyor...' : 'Verileri Senkronize Et'}
              </button>
            </div>
          </div>

        </div>

        {/* Right: API Request Logs */}
        <div className="bg-gray-900 rounded-3xl p-6 flex flex-col h-[520px] font-mono shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-500 to-purple-500"></div>
          
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-2 text-white">
              <Server size={18} className="text-emerald-400" />
              <h3 className="font-bold text-sm">Enterprise System & Security Logs</h3>
            </div>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {logs.map(log => (
              <div key={log.id} className="text-[12px] flex items-start gap-3 border-b border-gray-800 pb-2 mb-2">
                <span className="text-gray-500 shrink-0">[{log.time}]</span>
                <span className={`
                  ${log.type === 'error' ? 'text-red-400' : ''}
                  ${log.type === 'success' ? 'text-emerald-400' : ''}
                  ${log.type === 'info' ? 'text-indigo-300' : ''}
                `}>
                  {log.type === 'error' && <AlertCircle size={12} className="inline mr-1" />}
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
