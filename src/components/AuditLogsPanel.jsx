import React, { useState } from 'react';
import { ShieldCheck, Search, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function AuditLogsPanel({ setView, previousView }) {
  const auditLogs = useAppStore(state => state.auditLogs) || [];
  const [filterModule, setFilterModule] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesModule = filterModule === 'Tümü' || log.module === filterModule;
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const getModuleBadgeClass = (module) => {
    switch (module?.toLowerCase()) {
      case 'navigasyon':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'sosyal':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'sistem':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 pb-24">
      <div className="max-w-6xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setView(previousView || 'landing')} 
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-full border border-slate-800 transition"
          >
            <ArrowLeft size={16} /> Geri Dön
          </button>
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={24} />
            <h1 className="text-xl font-black text-slate-100 tracking-tight">SİSTEM AUDIT LOG PANELİ</h1>
          </div>
        </div>

        {/* Hero Alert Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Canlı Takip Aktif
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight mb-2 text-slate-100">Güvenlik ve Sistem Log İzleme</h2>
            <p className="text-slate-400 text-sm">
              Sistemdeki sayfa geçişleri, proje beğenileri, doküman indirmeleri ve diğer tüm kullanıcı hareketleri kripto-güvenli şekilde anlık olarak loglanır.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 shrink-0">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Toplam Log</p>
              <p className="text-3xl font-black text-slate-100">{auditLogs.length}</p>
            </div>
          </div>
        </div>

        {/* Controls: Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Kullanıcı veya işlem ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition text-slate-100 placeholder-slate-500"
            />
          </div>

          {/* Module Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0 pr-2">
              <Layers size={14} /> Filtre:
            </span>
            {['Tümü', 'Navigasyon', 'Sosyal', 'Sistem'].map(mod => (
              <button
                key={mod}
                onClick={() => setFilterModule(mod)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  filterModule === mod 
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        {/* Table wrapper */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="p-4 font-black text-slate-400 uppercase tracking-wider text-xs">Zaman Damgası</th>
                  <th className="p-4 font-black text-slate-400 uppercase tracking-wider text-xs">Kullanıcı / Ajan</th>
                  <th className="p-4 font-black text-slate-400 uppercase tracking-wider text-xs">İşlem / Eylem</th>
                  <th className="p-4 font-black text-slate-400 uppercase tracking-wider text-xs">Modül</th>
                  <th className="p-4 font-black text-slate-400 uppercase tracking-wider text-xs">IP Adresi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                      Aranan kriterlere uygun log kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-900/30 transition">
                      <td className="p-4 font-bold text-emerald-400 font-mono text-xs">{log.timestamp}</td>
                      <td className="p-4 font-bold text-slate-100">{log.user}</td>
                      <td className="p-4 font-medium text-slate-200">{log.action}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getModuleBadgeClass(log.module)}`}>
                          {log.module}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500">{log.ip}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
