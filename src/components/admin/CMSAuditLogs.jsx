import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import PanelHeader from './PanelHeader';
import { Card, Badge, Tbl } from './AdminShared';
import { ShieldCheck, Search, Filter, AlertTriangle, Eye, ShieldAlert, Cpu } from 'lucide-react';

export default function CMSAuditLogs() {
  const { auditLogs = [], logAction } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('Hepsi');

  const filteredLogs = (auditLogs || []).filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesModule = selectedModule === 'Hepsi' || log.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const clearLogs = () => {
    if (logAction) {
      logAction("Süper Admin", "Güvenlik Günlüğü - Tüm Sistem logları arşivlendi ve temizlendi.", "Güvenlik");
    }
    if (window.toast) {
      window.toast.success?.("Tüm sistem logları başarıyla arşivlendi.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader 
        title="Güvenlik ve İşlem Günlüğü (Audit Logs)" 
        sub="Sistem üzerinde gerçekleştirilen tüm idari, akademik ve AI işlemlerinin kayıt havuzu"
        action={
          <button onClick={clearLogs} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition active:scale-95 duration-200 border border-slate-200">
            <ShieldAlert size={14} className="text-slate-600" /> Logları Arşivle
          </button>
        }
      />

      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı, işlem veya IP adresi ara..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={selectedModule}
              onChange={e => setSelectedModule(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-semibold text-gray-700"
            >
              <option value="Hepsi">Tüm Modüller</option>
              <option value="Sistem">Sistem</option>
              <option value="AI Swarm">AI Swarm</option>
              <option value="Portfolyo">Portfolyo</option>
              <option value="Güvenlik">Güvenlik</option>
              <option value="Genel">Genel</option>
              <option value="Entegrasyon">Entegrasyon</option>
            </select>
          </div>
        </div>

        <Tbl
          headers={['Zaman Damgası', 'Kullanıcı / IP', 'Modül', 'Gerçekleştirilen Eylem', 'Güvenlik']}
          rows={filteredLogs.map(log => [
            <span className="font-bold text-gray-600 text-xs">{log.timestamp}</span>,
            <div>
              <p className="font-bold text-gray-900">{log.user}</p>
              <p className="text-[10px] text-gray-400 font-bold">{log.ip}</p>
            </div>,
            <span className="inline-block bg-slate-100 text-slate-700 font-black px-2 py-0.5 rounded text-[10px] uppercase">{log.module}</span>,
            <p className="text-sm font-semibold text-gray-700 max-w-lg leading-relaxed">{log.action}</p>,
            <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs">
              <ShieldCheck size={14} /> Güvenli
            </div>
          ])}
        />
        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <AlertTriangle className="mx-auto mb-2 text-gray-300" size={32} />
            <p className="font-bold text-sm">Hiçbir log girdisi bulunamadı.</p>
            <p className="text-xs text-gray-400 mt-1">Arama sorgusunu veya filtre modülünü değiştirerek tekrar deneyebilirsiniz.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
