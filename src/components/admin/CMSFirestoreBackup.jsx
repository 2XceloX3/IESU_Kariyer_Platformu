/**
 * CMSFirestoreBackup — Firestore Veri Yedekleme Paneli
 * 
 * Mevcut CMSSyncCenter'ın yanında çalışır.
 * Store verilerini Firestore'a yedekler ve durumu gösterir.
 */
import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, Cloud, CloudOff, RefreshCw, Clock, AlertCircle, HardDrive, Upload } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { syncAllToFirestore, listFirestoreBackups } from '../../services/dbSync';

export default function CMSFirestoreBackup() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [backups, setBackups] = useState([]);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    loadBackupStatus();
  }, []);

  const loadBackupStatus = async () => {
    const list = await listFirestoreBackups();
    setBackups(list);
    if (list.length > 0) {
      const last = list.reduce((a, b) => a.lastSynced > b.lastSynced ? a : b);
      setLastSync(last.lastSynced);
    }
  };

  const handleFullBackup = async () => {
    setIsSyncing(true);
    setResult(null);
    setError(null);

    try {
      const state = useAppStore.getState();
      const res = await syncAllToFirestore(state);
      setResult(res);
      
      if (res.success > 0) {
        await loadBackupStatus();
        if (window.toast) {
          window.toast.success(`✅ ${res.success} veri kümesi Firestore'a yedeklendi!`);
        }
      }
      if (res.failed > 0) {
        if (window.toast) {
          window.toast.warning(`⚠️ ${res.failed} veri kümesi yedeklenemedi.`);
        }
      }
    } catch (err) {
      setError(err.message);
      if (window.toast) {
        window.toast.error('❌ Firestore yedekleme hatası');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Cloud size={18} className="text-blue-600" />
            Firestore Veri Yedekleme
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Store verilerini (anket, abone, personel, mesaj) Firestore'a yedekler
          </p>
        </div>
        <button
          onClick={handleFullBackup}
          disabled={isSyncing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition disabled:opacity-50 shadow-md cursor-pointer"
        >
          {isSyncing ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {isSyncing ? 'Yedekleniyor...' : 'Firestore\'a Yedekle'}
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Durum</div>
          <div className="flex items-center gap-1.5 mt-1">
            {lastSync ? (
              <CheckCircle2 size={14} className="text-emerald-600" />
            ) : (
              <CloudOff size={14} className="text-slate-400" />
            )}
            <span className="text-sm font-black text-slate-800">
              {lastSync ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Yedeklenen</div>
          <div className="text-sm font-black text-slate-800 mt-1">
            {backups.length} veri kümesi
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Son Yedekleme</div>
          <div className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
            <Clock size={12} className="text-slate-400" />
            {lastSync ? new Date(lastSync).toLocaleString('tr-TR') : 'Henüz yedeklenmedi'}
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 mb-4">
          <div className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">Yedekleme Sonuçları</div>
          {result.results.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">{r.key}</span>
              {r.status === 'synced' && (
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 size={12} /> Yedeklendi
                </span>
              )}
              {r.status === 'failed' && (
                <span className="flex items-center gap-1 text-red-600 font-semibold" title={r.error}>
                  <XCircle size={12} /> Hata
                </span>
              )}
              {r.status === 'skipped' && (
                <span className="flex items-center gap-1 text-slate-400 font-semibold">
                  <AlertCircle size={12} /> {r.reason}
                </span>
              )}
            </div>
          ))}
          <div className="border-t border-slate-200 pt-2 text-xs font-black text-right">
            {result.success} başarılı / {result.failed} başarısız
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs font-bold text-red-700">
          <AlertCircle size={14} className="inline mr-1" />
          Hata: {error}
        </div>
      )}
    </div>
  );
}
