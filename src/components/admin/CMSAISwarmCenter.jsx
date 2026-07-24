import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import PanelHeader from './PanelHeader';
import { Card, Badge, Tbl, Progress } from './AdminShared';
import { 
  Cpu, Play, Pause, RefreshCw, Radio, Terminal, Settings, 
  CheckCircle, AlertTriangle, ShieldCheck, Zap, Activity
} from 'lucide-react';

export default function CMSAISwarmCenter() {
  const { auditLogs = [], logAction } = useAppStore();
  const [agents, setAgents] = useState([
    { id: 'agt_career', name: 'Kariyer Danışmanı Ajanı (CareerWingman)', type: 'RAG & Chat', status: 'Çalışıyor', version: 'v2.1', memory: '124MB', requests: 1242, latency: '420ms' },
    { id: 'agt_cv', name: 'Yapay Zeka CV Denetçisi (AICVBuilder)', type: 'Parser & Advisor', status: 'Çalışıyor', version: 'v1.8', memory: '98MB', requests: 843, latency: '890ms' },
    { id: 'agt_inter', name: 'Mülakat Simülatörü Ajanı (InterviewSimulator)', type: 'STT & Persona GPT', status: 'Beklemede', version: 'v3.0', memory: '256MB', requests: 432, latency: '1240ms' },
    { id: 'agt_rec', name: 'Akıllı Eşleştirme & Tavsiye Ajanı (Recommender)', type: 'Embedding Search', status: 'Çalışıyor', version: 'v2.0', memory: '110MB', requests: 4312, latency: '120ms' },
    { id: 'agt_guard', name: 'İçerik Denetim & Güvenlik Ajanı (Guardrail)', type: 'Moderation Filter', status: 'Çalışıyor', version: 'v1.2', memory: '45MB', requests: 9482, latency: '45ms' }
  ]);

  const [logs, setLogs] = useState([
    { time: '18:10:45', agent: 'Guardrail', type: 'INFO', message: 'Kullanıcı STU-001 girdisi uygun bulundu.' },
    { time: '18:08:12', agent: 'CareerWingman', type: 'SUCCESS', message: 'React ve Node.js için RAG dokümanları başarıyla taranarak yanıt üretildi.' },
    { time: '18:05:22', agent: 'AICVBuilder', type: 'WARNING', message: 'Kullanıcı Caner D. CV analizinde format uyumsuzluğu otomatik düzeltildi.' }
  ]);

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        const newStatus = a.status === 'Çalışıyor' ? 'Durduruldu' : 'Çalışıyor';
        if (logAction) {
          logAction("Süper Admin", `${a.name} durumu ${newStatus} olarak güncellendi`, "AI Swarm");
        }
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const restartAll = () => {
    setAgents(prev => prev.map(a => ({ ...a, status: 'Çalışıyor' })));
    setLogs(prev => [
      { time: new Date().toLocaleTimeString("tr-TR"), agent: 'SwarmMaster', type: 'INFO', message: 'Tüm AI Swarm ajanları yeniden başlatıldı.' },
      ...prev
    ]);
    if (logAction) {
      logAction("Süper Admin", "Tüm AI Swarm Ajanları yeniden başlatıldı.", "AI Swarm");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="AI Swarm Komuta Merkezi" 
        sub="Platform genelinde çalışan yapay zeka ajanlarının, moderasyon filtrelerinin ve RAG motorlarının yönetimi"
        action={
          <button onClick={restartAll} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition active:scale-95 duration-200">
            <RefreshCw size={14} className="animate-spin" /> Swarm Yeniden Başlat
          </button>
        }
      />

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-emerald-500">
          <p className="text-3xl font-black text-gray-900">{agents.filter(a => a.status === 'Çalışıyor').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Aktif Ajan</p>
        </Card>
        <Card className="p-5 border-l-4 border-amber-500">
          <p className="text-3xl font-black text-gray-900">{agents.filter(a => a.status === 'Beklemede').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Beklemede</p>
        </Card>
        <Card className="p-5 border-l-4 border-red-500">
          <p className="text-3xl font-black text-gray-900">{agents.filter(a => a.status === 'Durduruldu').length}</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Durduruldu</p>
        </Card>
        <Card className="p-5 border-l-4 border-blue-500">
          <p className="text-3xl font-black text-gray-900">45ms - 1240ms</p>
          <p className="text-xs font-bold text-gray-500 uppercase mt-1">Gecikme Penceresi</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ajan Listesi */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-black text-[#A80016] mb-4 flex items-center gap-2">
            <Cpu size={18} className="text-red-600" /> Swarm Ajan Listesi
          </h3>
          <Tbl
            headers={['Ajan Adı', 'Tür', 'Bellek / Gecikme', 'Tüm İstekler', 'Durum', 'İşlem']}
            rows={agents.map(a => [
              <div>
                <p className="font-bold text-gray-900">{a.name}</p>
                <p className="text-[10px] text-gray-400 font-bold">{a.version}</p>
              </div>,
              <Badge status={a.type === 'Moderation Filter' ? 'Onaylı' : 'PART TIME'} />,
              <div className="text-xs text-gray-600">
                <p>{a.memory}</p>
                <p className="text-[10px] text-gray-400 font-bold">{a.latency}</p>
              </div>,
              <span className="font-semibold">{a.requests.toLocaleString('tr-TR')}</span>,
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                a.status === 'Çalışıyor' ? 'bg-emerald-100 text-emerald-700' :
                a.status === 'Beklemede' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              }`}>{a.status}</span>,
              <button 
                onClick={() => toggleAgent(a.id)}
                className={`p-1.5 rounded-lg border transition ${
                  a.status === 'Çalışıyor' ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                }`}
              >
                {a.status === 'Çalışıyor' ? <Pause size={14} /> : <Play size={14} />}
              </button>
            ])}
          />
        </Card>

        {/* Canlı Swarm Logları */}
        <Card className="p-6">
          <h3 className="font-black text-[#A80016] mb-4 flex items-center gap-2">
            <Terminal size={18} className="text-slate-600 animate-pulse" /> Canlı Swarm Log Konsolu
          </h3>
          <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 space-y-3 h-[320px] overflow-y-auto">
            {logs.map((l, idx) => (
              <div key={idx} className="border-b border-slate-800 pb-2 last:border-0">
                <div className="flex justify-between text-slate-500 mb-0.5">
                  <span>[{l.time}] {l.agent}</span>
                  <span className={l.type === 'WARNING' ? 'text-amber-400' : l.type === 'SUCCESS' ? 'text-emerald-300' : 'text-blue-400'}>{l.type}</span>
                </div>
                <p className="text-slate-200">{l.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
