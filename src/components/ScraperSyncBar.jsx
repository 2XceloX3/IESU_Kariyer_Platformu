import React from 'react';
import { RefreshCw, Clock, Globe } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ScraperSyncBar({ className = '' }) {
  const lastUpdated = useAppStore((state) => state.lastUpdated);
  const source = useAppStore((state) => state.source);
  const status = useAppStore((state) => state.status);
  const isScraperLoading = useAppStore((state) => state.isScraperLoading);
  const refreshScrapedData = useAppStore((state) => state.refreshScrapedData);

  const handleRefresh = async () => {
    try {
      await refreshScrapedData(true);
    } catch (e) {
      console.error("Failed to refresh scraped data:", e);
    }
  };

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString('tr-TR', {
        dateStyle: 'short',
        timeStyle: 'medium'
      })
    : 'Bilinmiyor';

  return (
    <div
      data-testid="scraper-sync-bar"
      className={`bg-slate-900 text-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md border border-slate-800 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span
          data-testid="scraper-source-badge"
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
            source === 'live' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}
        >
          <Globe size={13} />
          {source === 'live' ? 'Canlı Veri Sync' : 'Fallback (Offline)'}
        </span>
        <span data-testid="scraper-status" className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
          Durum: {status || 'aktif'}
        </span>
        <span data-testid="scraper-last-updated" className="text-slate-300 font-medium flex items-center gap-1">
          <Clock size={13} className="text-slate-400" />
          Son Güncelleme: {formattedDate}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          data-testid="scraper-sync-toggle"
          onClick={handleRefresh}
          className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded transition-colors"
          title="Senkronizasyon Modu"
        >
          Auto-Sync Active
        </button>
        <button
          data-testid="scraper-refresh-btn"
          onClick={handleRefresh}
          disabled={isScraperLoading}
          className="bg-red-700 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw size={13} className={isScraperLoading ? 'animate-spin' : ''} />
          {isScraperLoading ? 'Yükleniyor...' : 'esenyurt.edu.tr Canlı Veri Çek'}
        </button>
      </div>
    </div>
  );
}
