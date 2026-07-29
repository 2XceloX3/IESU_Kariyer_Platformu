import React from 'react';
import { Globe, Plus, Trash2, Save, RefreshCw, BarChart3, Info } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function InstitutionalStatsManager() {
  const showInstitutionalStats = useAppStore(state => state.showInstitutionalStats);
  const setShowInstitutionalStats = useAppStore(state => state.setShowInstitutionalStats);
  const institutionalStatsData = useAppStore(state => state.institutionalStatsData);
  const setInstitutionalStatsData = useAppStore(state => state.setInstitutionalStatsData);

  const handleUpdateStat = (index, field, value) => {
    const updated = [...(institutionalStatsData || [])];
    updated[index] = { ...updated[index], [field]: value };
    setInstitutionalStatsData(updated);
  };

  const handleAddStat = () => {
    const newItem = {
      id: Date.now(),
      title: 'Yeni Kurumsal İstatistik',
      val: '100+',
      icon: 'ShieldCheck'
    };
    setInstitutionalStatsData([...(institutionalStatsData || []), newItem]);
  };

  const handleRemoveStat = (index) => {
    const updated = (institutionalStatsData || []).filter((_, idx) => idx !== index);
    setInstitutionalStatsData(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#990000] via-red-900 to-[#660000] p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BarChart3 size={140} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md">
              Ana Sayfa Modülü
            </span>
          </div>
          <h2 className="text-3xl font-black mb-3 tracking-tight">Kurumsal İstatistikler Canlı Yönetim Paneli</h2>
          <p className="text-red-100 text-sm leading-relaxed font-medium">
            Bu panel sayesinde ana sayfanızdaki Mezun Sayısı, Akredite Program, Laboratuvar ve Uluslararası Öğrenci gibi rakamsal verileri dilediğiniz an canlı olarak düzenleyebilir veya yayınını durdurabilirsiniz.
          </p>
        </div>
      </div>

      {/* Main Control & Live Switch */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl transition-colors ${showInstitutionalStats ? 'bg-red-50 text-[#990000]' : 'bg-slate-100 text-slate-400'}`}>
            <Globe size={26} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-base">Ana Sayfada Yayınla (Göster / Gizle)</h4>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {showInstitutionalStats 
                ? 'Şu an bu istatistik bandı ana sayfanızda ziyaretçilere AÇIK ve GÖRÜNÜR durumdadır.' 
                : 'Şu an bu istatistik bandı KAPALIDIR. Gerçek veriler hazır olduğunda buradan yayınlayabilirsiniz.'}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowInstitutionalStats(!showInstitutionalStats)}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shrink-0 ${showInstitutionalStats ? 'bg-[#990000]' : 'bg-slate-300'}`}
        >
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md ${showInstitutionalStats ? 'translate-x-9' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Live Data Card Editors */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Canlı Veri Kartları</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Aşağıdaki alanlardan değerleri değiştirdiğiniz anda ana sayfadaki kartlar güncellenir.</p>
          </div>

          <button 
            onClick={handleAddStat}
            className="flex items-center gap-2 bg-[#990000] text-white hover:bg-red-800 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
          >
            <Plus size={16} /> Yeni İstatistik Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(institutionalStatsData || []).map((stat, index) => (
            <div key={stat.id || index} className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl space-y-4 hover:border-red-300 transition-colors shadow-sm relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#990000] bg-red-100/70 px-2.5 py-1 rounded-lg">
                  İstatistik Kartı #{index + 1}
                </span>

                <button 
                  onClick={() => handleRemoveStat(index)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  title="Kartı Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 block mb-1">
                    İstatistik Başlığı (Açıklama Metni)
                  </label>
                  <input 
                    type="text" 
                    value={stat.title || ''} 
                    onChange={(e) => handleUpdateStat(index, 'title', e.target.value)}
                    placeholder="Örn: Topluma Kazandırılan Mezun"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#990000] focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-600 block mb-1">
                    Sayısal Değer / İstatistik Verisi
                  </label>
                  <input 
                    type="text" 
                    value={stat.val || ''} 
                    onChange={(e) => handleUpdateStat(index, 'val', e.target.value)}
                    placeholder="Örn: 65.000+ veya %98"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-black text-[#990000] focus:outline-none focus:border-[#990000] focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
