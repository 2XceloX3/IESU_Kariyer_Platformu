import React, { useState } from 'react';
import { DownloadCloud, CheckCircle2, AlertCircle, Plus, Search, ExternalLink, Image as ImageIcon } from 'lucide-react';
import AdminCMSLayout, { TopInfoCard } from './AdminCMSLayout';

const FETCHED_CONTENT = [
  {
    id: 'FETCH-001',
    type: 'Haber',
    title: 'Kariyer Fuarı 2026 Büyük Bir Coşkuyla Gerçekleşti',
    date: '2026-06-20',
    description: 'İESÜ Kariyer Geliştirme Ofisi Koordinatörlüğü tarafından düzenlenen Kariyer Fuarı, 50\'den fazla firmanın katılımıyla başarıyla tamamlandı.',
    originalImageUrl: 'https://www.esenyurt.edu.tr/uploads/images/kariyer-fuari.jpg',
    source: 'esenyurt.edu.tr',
    imported: false
  },
  {
    id: 'FETCH-002',
    type: 'Duyuru',
    title: '2026-2027 Gönüllü Staj Başvuruları Başladı',
    date: '2026-07-01',
    description: 'Öğrencilerimiz için gönüllü staj programı başvuruları açılmıştır. Detaylar ve başvuru formları için tıklayınız.',
    originalImageUrl: null,
    source: 'esenyurt.edu.tr',
    imported: false
  },
  {
    id: 'FETCH-003',
    type: 'Etkinlik',
    title: 'SEM: Python ile Veri Bilimi Eğitimleri Başlıyor',
    date: '2026-07-10',
    description: 'Sürekli Eğitim Merkezi (SEM) kapsamında düzenlenecek olan Veri Bilimi eğitimleri için ön kayıtlar alınmaya başlandı.',
    originalImageUrl: 'https://sem.esenyurt.edu.tr/uploads/images/python.jpg',
    source: 'sem.esenyurt.edu.tr',
    imported: false
  }
];

export default function OfficialContentImport({ news, setNews, announcements, setAnnouncements, events, setEvents }) {
  const [fetchedData, setFetchedData] = useState(FETCHED_CONTENT);
  const [isImporting, setIsImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleImport = (item) => {
    // Determine target pool
    const newItem = {
      id: `IMP-${Date.now()}`,
      title: item.title,
      date: item.date,
      description: item.description,
      imageUrl: item.originalImageUrl || '',
      status: 'Taslak', // Important: imported as draft by default
      type: item.type,
      createdAt: new Date().toISOString()
    };

    if (item.type === 'Haber') {
      if (setNews) setNews([newItem, ...(news || [])]);
    } else if (item.type === 'Duyuru') {
      if (setAnnouncements) setAnnouncements([newItem, ...(announcements || [])]);
    } else if (item.type === 'Etkinlik') {
      if (setEvents) setEvents([newItem, ...(events || [])]);
    }

    // Mark as imported
    setFetchedData(fetchedData.map(f => f.id === item.id ? { ...f, imported: true } : f));
    window.toast.success(`${item.title} başarıyla Taslak olarak içe aktarıldı. Artık ilgili CMS modülünden düzenleyebilir ve yayınlayabilirsiniz.`);
  };

  const handleImportAll = () => {
    setIsImporting(true);
    setTimeout(() => {
      const pending = fetchedData.filter(f => !f.imported);
      pending.forEach(item => handleImport(item));
      setIsImporting(false);
    }, 1500);
  };

  const filtered = fetchedData.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const pendingCount = fetchedData.filter(f => !f.imported).length;

  return (
    <AdminCMSLayout title="Resmî İçerik İçe Aktarımı" subtitle="esenyurt.edu.tr ve sem.esenyurt.edu.tr üzerinden duyuru ve haberleri çekin.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TopInfoCard icon={<DownloadCloud size={20} />} title="Bekleyen İçerik" value={pendingCount} color="blue" />
        <TopInfoCard icon={<CheckCircle2 size={20} />} title="Aktarılan" value={fetchedData.filter(f => f.imported).length} color="emerald" />
        <TopInfoCard icon={<ExternalLink size={20} />} title="Kaynaklar" value="2 (Ana Site, SEM)" color="purple" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="İçerik başlığında ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setFetchedData(FETCHED_CONTENT.map(f => ({ ...f, imported: false })));
                window.toast.info("Veriler yeniden çekildi (Senkronize edildi).");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
            >
              Yenile
            </button>
            <button 
              onClick={handleImportAll}
              disabled={pendingCount === 0 || isImporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                pendingCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <DownloadCloud size={16} />
              {isImporting ? 'Aktarılıyor...' : 'Tümünü Aktar'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition items-start">
              <div className="w-full md:w-32 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden flex items-center justify-center relative group">
                {item.originalImageUrl ? (
                  <img src={item.originalImageUrl} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={24} className="mb-1" />
                    <span className="text-[10px] font-bold">Görsel Yok</span>
                  </div>
                )}
                <div style={{display: item.originalImageUrl ? 'none' : 'flex'}} className="absolute inset-0 flex-col items-center justify-center text-gray-400 bg-gray-100 hidden">
                    <ImageIcon size={24} className="mb-1" />
                    <span className="text-[10px] font-bold">Görsel Yok</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'Haber' ? 'bg-purple-100 text-purple-700' :
                    item.type === 'Etkinlik' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{item.date}</span>
                  <span className="text-xs text-gray-400 font-medium ml-auto flex items-center gap-1">
                    <ExternalLink size={12} /> {item.source}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                
                {item.originalImageUrl === null && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit font-medium">
                    <AlertCircle size={12} /> Medya Eksik - İnceleme Bekliyor
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-2 md:pt-0 flex flex-col justify-center h-full">
                {item.imported ? (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold px-3 py-2 bg-emerald-50 rounded-lg">
                    <CheckCircle2 size={16} /> Aktarıldı
                  </div>
                ) : (
                  <button onClick={() => handleImport(item)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 text-gray-700 rounded-lg text-xs font-bold transition shadow-sm">
                    <Plus size={16} /> İçe Aktar
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <DownloadCloud className="mx-auto text-gray-300 mb-3" size={32} />
              <p className="text-gray-500 text-sm font-medium">İçe aktarılacak yeni içerik bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </AdminCMSLayout>
  );
}
