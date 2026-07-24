import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, Clock, Globe } from 'lucide-react';
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

  return null;
}
