import React, { useState } from 'react';
import { Database, Link, RefreshCw, Server, AlertCircle, CheckCircle2 } from 'lucide-react';
import PanelHeader from './PanelHeader';
import { fetchStudentFromOBS, syncAlumniData } from '../../utils/integrationService';

export default function CMSIntegrations() {
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), message: 'Sistem başlatıldı. API servisleri dinleniyor.', type: 'info' }
  ]);
  const [obsLoading, setObsLoading] = useState(false);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [studentNo, setStudentNo] = useState('');

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
      <PanelHeader title="Sistem Entegrasyonları" sub="Dış API ve Veritabanı bağlantılarını yönetin." badge="Gelişmiş" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Integration Controllers */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
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
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                />
                <button 
                  type="submit" 
                  disabled={obsLoading}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition"
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
                Dernek veya dış sistemde kaydedilen yeni mezunları İESÜ Kariyer veritabanına aktarmak için senkronizasyonu başlatın.
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

          <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
            <CheckCircle2 size={32} className="mx-auto text-gray-400 mb-2" />
            <h4 className="font-bold text-gray-700 mb-1">e-Devlet Girişi Aktif</h4>
            <p className="text-xs text-gray-500">SSO (Tekil Oturum Açma) mimarisi başarılı bir şekilde yapılandırıldı. Öğrenciler e-Devlet şifresi ile sisteme girebilir.</p>
          </div>

        </div>

        {/* Right: API Request Logs */}
        <div className="bg-gray-900 rounded-3xl p-6 flex flex-col h-[500px] font-mono shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>
          
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-2 text-white">
              <Server size={18} className="text-green-400" />
              <h3 className="font-bold text-sm">Sistem Logları (Konsol)</h3>
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
                  ${log.type === 'success' ? 'text-green-400' : ''}
                  ${log.type === 'info' ? 'text-blue-300' : ''}
                `}>
                  {log.type === 'error' && <AlertCircle size={12} className="inline mr-1" />}
                  {log.message}
                </span>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-gray-600 text-xs text-center py-4">Bekleyen kayıt yok...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
