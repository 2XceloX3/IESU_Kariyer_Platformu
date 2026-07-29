import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, CheckCircle2, AlertCircle, Clock, Globe, Database, 
  TrendingUp, FileText, Bell, Briefcase, BookOpen, GraduationCap,
  ExternalLink, Eye, History, ChevronDown, ChevronUp, Zap, 
  Shield, Search, Download, Play, Pause, BarChart2, XCircle
} from 'lucide-react';
import { OFFICIAL_PAGES, runFullSync, syncSinglePage, loadSyncLog, loadVersionHistory } from '../../services/syncEngine';
import useAppStore from '../../store/useAppStore';

const CHANGE_COLORS = {
  NEW: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  UPDATED: 'text-blue-700 bg-blue-50 border-blue-200',
  UNCHANGED: 'text-slate-500 bg-slate-50 border-slate-200',
  ERROR: 'text-red-700 bg-red-50 border-red-200',
};

const CHANGE_LABELS = {
  NEW: '🆕 YENİ',
  UPDATED: '🔄 GÜNCELLENDİ',
  UNCHANGED: '✓ DEĞİŞİKLİK YOK',
  ERROR: '❌ HATA',
};

const TYPE_ICONS = {
  genel: Globe,
  haber: FileText,
  duyuru: Bell,
  etkinlik: TrendingUp,
  kariyer: Briefcase,
  staj: Briefcase,
  egitim: BookOpen,
  akademik: GraduationCap,
  uluslararasi: Globe,
  ogrenci: GraduationCap,
  hizmet: Database,
};

export default function CMSSyncCenter() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [syncLog, setSyncLog] = useState([]);
  const [versionHistory, setVersionHistory] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSyncLog(loadSyncLog());
    setVersionHistory(loadVersionHistory());
  }, []);

  const handleFullSync = useCallback(async () => {
    setIsSyncing(true);
    setProgress(null);
    setResults([]);
    setSummary(null);

    try {
      const result = await runFullSync((prog) => {
        setProgress(prog);
      });
      setResults(result.results);
      setSummary(result.summary);
      setSyncLog(loadSyncLog());
      setVersionHistory(loadVersionHistory());

      // DIRECT STORE INJECTION (Instant UI Update): Update Zustand store so site instantly reflects pulled official items
      try {
        const store = useAppStore.getState();
        const newsItems = [];
        const annItems = [];
        const eventItems = [];

        result.results.forEach(res => {
          if (res.success && res.headings && res.headings.length > 0) {
            res.headings.forEach((heading, idx) => {
              const item = {
                id: `sync_${res.id}_${idx}_${Date.now()}`,
                title: heading,
                category: res.category === 'haber' ? 'Haber' : res.category === 'duyuru' ? 'Duyuru' : res.category === 'etkinlik' ? 'Etkinlik' : 'Genel',
                date: res.dates && res.dates[0] ? res.dates[0] : new Date().toLocaleDateString('tr-TR'),
                description: res.paragraphs && res.paragraphs[idx] ? res.paragraphs[idx] : `${heading} - İstanbul Esenyurt Üniversitesi Resmi Yayını.`,
                content: res.paragraphs ? res.paragraphs.join('\n\n') : `${heading}\n\nDetaylı bilgi için resmi web sitesini ziyaret edebilirsiniz: ${res.url}`,
                imageUrl: res.images && res.images[0] ? res.images[0].src : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60',
                url: res.url,
                isOfficialSynced: true,
                syncedAt: new Date().toLocaleString('tr-TR')
              };

              if (res.category === 'haber') newsItems.push(item);
              else if (res.category === 'duyuru') annItems.push(item);
              else if (res.category === 'etkinlik') eventItems.push(item);
            });
          }
        });

        if (newsItems.length > 0 && store.setNews) {
          store.setNews([...newsItems, ...(store.news || [])].slice(0, 60));
        }
        if (annItems.length > 0 && store.setAnnouncements) {
          store.setAnnouncements([...annItems, ...(store.announcements || [])].slice(0, 60));
        }
        if (eventItems.length > 0 && store.setEvents) {
          store.setEvents([...eventItems, ...(store.events || [])].slice(0, 60));
        }

        if (window.toast) {
          window.toast.success(`🎉 ${result.results.length} Resmî Sayfadan Veriler Çekildi ve Sitenize İşlendi!`);
        }
      } catch (err) {
        console.warn("Direct store sync error:", err);
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
      setProgress(null);
    }
  }, []);

  const handleSingleSync = useCallback(async (pageId) => {
    const result = await syncSinglePage(pageId);
    setResults(prev => {
      const idx = prev.findIndex(r => r.id === pageId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = result;
        return next;
      }
      return [result, ...prev];
    });
    setSyncLog(loadSyncLog());
    setVersionHistory(loadVersionHistory());
  }, []);

  const filteredResults = results.filter(r => {
    if (filter !== 'all' && r.changeType !== filter.toUpperCase()) return false;
    if (searchQuery && !r.label?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const statCards = [
    { label: 'Toplam Sayfa', value: OFFICIAL_PAGES.length, icon: Globe, color: 'text-blue-600 bg-blue-50' },
    { label: 'Başarılı', value: summary?.success ?? '—', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Yeni İçerik', value: summary?.newContent ?? '—', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { label: 'Güncellenen', value: summary?.updated ?? '—', icon: RefreshCw, color: 'text-violet-600 bg-violet-50' },
    { label: 'Hatalı', value: summary?.failed ?? '—', icon: AlertCircle, color: 'text-red-600 bg-red-50' },
    { label: 'Log Kaydı', value: syncLog.length, icon: History, color: 'text-slate-600 bg-slate-50' },
  ];

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Database size={22} /> Resmî Site Senkronizasyon Merkezi
            </h2>
            <p className="text-sm text-red-200 mt-1">
              esenyurt.edu.tr — {OFFICIAL_PAGES.length} sayfa izleniyor
            </p>
          </div>
          <div className="flex items-center gap-3">
            {summary && (
              <span className="text-xs text-red-200 font-semibold bg-white/10 px-3 py-1.5 rounded-xl">
                Son sync: {new Date(summary.syncedAt).toLocaleString('tr-TR')}
              </span>
            )}
            <button
              onClick={handleFullSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-white text-[#990000] font-black text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 disabled:opacity-50 transition shadow-lg cursor-pointer"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Senkronize Ediliyor...' : 'Tam Senkronizasyon Başlat'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isSyncing && progress && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-red-200 mb-1.5 font-semibold">
              <span>🔄 {progress.currentPage}</span>
              <span>{progress.current}/{progress.total} — %{progress.percentage}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center gap-1.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={18} />
              </div>
              <div className="text-lg font-black text-slate-800">{card.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-slate-200 pb-2">
        {[
          { id: 'status', label: '📊 Sayfa Durumları' },
          { id: 'pages', label: '🌐 Tüm Sayfalar' },
          { id: 'log', label: '📋 Sync Log' },
          { id: 'versions', label: '🕰 Versiyon Geçmişi' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#990000] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Sayfa Durumları (Sync Sonuçları) */}
      {activeTab === 'status' && (
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-100">
              <Database size={40} className="mx-auto mb-3 opacity-30" />
              <p>Henüz senkronizasyon başlatılmadı.</p>
              <p className="text-xs mt-1 text-slate-300">Yukarıdaki butona tıklayarak tüm resmi sayfaları çekebilirsiniz.</p>
            </div>
          ) : (
            <>
              {/* Filter Toolbar */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {['all', 'new', 'updated', 'unchanged', 'error'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      filter === f ? 'bg-[#990000] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'all' ? 'Tümü' : CHANGE_LABELS[f.toUpperCase()]}
                  </button>
                ))}
              </div>

              {filteredResults.map((result) => {
                const Icon = TYPE_ICONS[result.category] || Globe;
                const isExpanded = expandedRow === result.id;
                return (
                  <div
                    key={result.id}
                    className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpandedRow(isExpanded ? null : result.id)}>
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0">
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-800 text-sm truncate">{result.label}</div>
                        <div className="text-[11px] text-slate-400 font-medium truncate">{result.url}</div>
                      </div>
                      <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${CHANGE_COLORS[result.changeType] || CHANGE_COLORS.ERROR}`}>
                        {CHANGE_LABELS[result.changeType] || result.changeType}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold shrink-0 hidden sm:block">
                        {result.fetchedAt ? new Date(result.fetchedAt).toLocaleString('tr-TR') : '—'}
                      </div>
                      <a href={result.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-slate-400 hover:text-[#990000] transition shrink-0">
                        <ExternalLink size={14} />
                      </a>
                      <button
                        onClick={e => { e.stopPropagation(); handleSingleSync(result.id); }}
                        className="text-slate-400 hover:text-[#990000] transition shrink-0 cursor-pointer"
                        title="Bu sayfayı yenile"
                      >
                        <RefreshCw size={14} />
                      </button>
                      {isExpanded ? <ChevronUp size={14} className="text-slate-400 shrink-0" /> : <ChevronDown size={14} className="text-slate-400 shrink-0" />}
                    </div>

                    {isExpanded && result.success && (
                      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                          <div><span className="font-black text-slate-500 uppercase tracking-wider block">Sayfa Başlığı</span><span className="font-semibold text-slate-700">{result.title || '—'}</span></div>
                          <div><span className="font-black text-slate-500 uppercase tracking-wider block">İçerik Uzunluğu</span><span className="font-semibold text-slate-700">{result.rawLength ? `${(result.rawLength / 1024).toFixed(1)} KB` : '—'}</span></div>
                          <div><span className="font-black text-slate-500 uppercase tracking-wider block">Görseller</span><span className="font-semibold text-slate-700">{result.images?.length ?? 0}</span></div>
                          <div><span className="font-black text-slate-500 uppercase tracking-wider block">Bağlantılar</span><span className="font-semibold text-slate-700">{result.links?.length ?? 0}</span></div>
                        </div>

                        {result.emails?.length > 0 && (
                          <div className="text-[11px]">
                            <span className="font-black text-slate-500 uppercase tracking-wider block mb-1">E-postalar</span>
                            <div className="flex gap-2 flex-wrap">{result.emails.map(e => <span key={e} className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono text-slate-600">{e}</span>)}</div>
                          </div>
                        )}

                        {result.docs?.length > 0 && (
                          <div className="text-[11px]">
                            <span className="font-black text-slate-500 uppercase tracking-wider block mb-1">İndirilebilir Belgeler</span>
                            <div className="space-y-1">
                              {result.docs.map((d, i) => (
                                <a key={i} href={d.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#990000] hover:underline">
                                  <Download size={12} /> {d.text}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.headings?.length > 0 && (
                          <div className="text-[11px]">
                            <span className="font-black text-slate-500 uppercase tracking-wider block mb-1">Başlıklar</span>
                            <ul className="space-y-0.5 text-slate-600">{result.headings.slice(0, 5).map((h, i) => <li key={i}>• {h}</li>)}</ul>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[10px]">
                          <Shield size={12} className="text-emerald-500" />
                          <span className="font-black text-emerald-600">VERIFIED</span>
                          <span className="text-slate-400">Content Hash: {result.contentHash}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Tab: Tüm Sayfalar */}
      {activeTab === 'pages' && (
        <div className="space-y-2">
          {OFFICIAL_PAGES.map((page) => {
            const Icon = TYPE_ICONS[page.category] || Globe;
            const hist = versionHistory[page.id];
            return (
              <div key={page.id} className="bg-white border border-slate-100 rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-[#990000] flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-sm text-slate-800">{page.label}</div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">{page.url}</div>
                </div>
                {page.priority === 'HIGH' && (
                  <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg">⭐ ÖNCELİKLİ</span>
                )}
                {hist ? (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                    ✓ {hist.versions?.length || 1} versiyon
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">Henüz Sync Edilmedi</span>
                )}
                <a href={page.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#990000] transition">
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => handleSingleSync(page.id)}
                  className="text-slate-400 hover:text-[#990000] transition cursor-pointer"
                  title="Bu sayfayı sync et"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Sync Log */}
      {activeTab === 'log' && (
        <div className="space-y-2">
          {syncLog.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
              <History size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold">Henüz log kaydı yok.</p>
            </div>
          ) : (
            syncLog.slice(0, 50).map((log) => (
              <div key={log.id} className="bg-white border border-slate-100 rounded-xl px-5 py-3 flex items-center gap-4 shadow-sm">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  log.success ? 'bg-emerald-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-700">{log.pageLabel}</div>
                  <div className="text-[10px] text-slate-400">{log.url}</div>
                </div>
                <div className={`text-[10px] font-black px-2 py-0.5 rounded border ${CHANGE_COLORS[log.changeType] || CHANGE_COLORS.ERROR}`}>
                  {CHANGE_LABELS[log.changeType] || log.changeType}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold shrink-0">
                  {new Date(log.timestamp).toLocaleString('tr-TR')}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Versiyon Geçmişi */}
      {activeTab === 'versions' && (
        <div className="space-y-3">
          {Object.keys(versionHistory).length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
              <History size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-semibold">Henüz versiyon geçmişi yok.</p>
            </div>
          ) : (
            Object.entries(versionHistory).map(([pageId, hist]) => {
              const page = OFFICIAL_PAGES.find(p => p.id === pageId);
              return (
                <div key={pageId} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-50">
                    <div className="font-black text-slate-800">{page?.label || pageId}</div>
                    <div className="text-[11px] text-slate-400">Son değişiklik: {new Date(hist.lastChanged).toLocaleString('tr-TR')}</div>
                  </div>
                  <div className="px-5 py-3 space-y-1.5">
                    {(hist.versions || []).map((v, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px]">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black shrink-0 text-[9px]">
                          v{(hist.versions.length - i)}
                        </div>
                        <span className="font-mono text-slate-400 text-[10px]">{v.hash}</span>
                        <span className="text-slate-400">{new Date(v.at).toLocaleString('tr-TR')}</span>
                        {i === 0 && <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">GÜNCEL</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
