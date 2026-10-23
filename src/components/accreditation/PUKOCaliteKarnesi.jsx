import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, 
  Award, FileText, ChevronRight, Edit3, Filter, Search, Sparkles 
} from 'lucide-react';
import { PUKO_CYCLE_STAGES } from '../../services/accreditationWorkflow';

export default function PUKOCaliteKarnesi({
  scorecards = [],
  onUpdateScorecard,
  period = '2026-H1'
}) {
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptForAction, setSelectedDeptForAction] = useState(null);
  const [customActionText, setCustomActionText] = useState('');

  // Filtrelenmiş Karneler
  const filteredScorecards = useMemo(() => {
    return (scorecards || []).filter(sc => {
      const matchesFaculty = facultyFilter === 'all' || (sc.faculty || '').toLowerCase().includes(facultyFilter.toLowerCase());
      const matchesSearch = !searchQuery || 
        (sc.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sc.faculty || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFaculty && matchesSearch;
    });
  }, [scorecards, facultyFilter, searchQuery]);

  // Özet İstatistikler
  const stats = useMemo(() => {
    const list = scorecards || [];
    const total = list.length;
    if (total === 0) return { closedRatio: 0, avgAlumni: 0, avgEmployer: 0, avgPuko: 0 };
    const closedCount = list.filter(s => s.isClosed || s.pukoStatus === PUKO_CYCLE_STAGES.ACT).length;
    const avgAlumni = (list.reduce((acc, curr) => acc + Number(curr.alumniScore || 0), 0) / total).toFixed(2);
    const avgEmployer = (list.reduce((acc, curr) => acc + Number(curr.employerScore || 0), 0) / total).toFixed(2);
    const avgPuko = Math.round(list.reduce((acc, curr) => acc + Number(curr.pukoIndex || 0), 0) / total);
    return {
      closedCount,
      closedRatio: Math.round((closedCount / total) * 100),
      avgAlumni,
      avgEmployer,
      avgPuko
    };
  }, [scorecards]);

  const handleOpenActionModal = (sc) => {
    setSelectedDeptForAction(sc);
    setCustomActionText(sc.actionDecision || '');
  };

  const handleSaveAction = () => {
    if (!selectedDeptForAction) return;
    const updated = {
      ...selectedDeptForAction,
      actionDecision: customActionText.trim() || 'Kalite komisyonu kararı doğrultusunda PUKÖ döngüsü başarıyla kapatılmıştır.',
      pukoStatus: PUKO_CYCLE_STAGES.ACT,
      isClosed: true,
      updatedAt: new Date().toISOString()
    };
    if (onUpdateScorecard) {
      onUpdateScorecard(updated);
    }
    setSelectedDeptForAction(null);
    setCustomActionText('');
    if (window.toast?.success) {
      window.toast.success(`${updated.department} için PUKÖ kapanış kararı kaydedildi ve döngü kapatıldı.`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase tracking-wider mb-1">
            <ShieldCheck size={16} /> YÖKAK KAP Ölçüt B.2.2 Kalite Güvencesi
          </div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Bölüm Bazlı PUKÖ Kalite Karneleri & Kapanış Döngüsü
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Planla - Uygula - Kontrol Et - Önlem Al (PDCA) çevriminde anket ve istihdam karneleri.
          </p>
        </div>

        {/* Dönem ve Başarı Rozeti */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Kapanış Başarısı: %{stats.closedRatio}</span>
          </div>
        </div>
      </div>

      {/* Üst Özet Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
            Genel PUKÖ Endeksi
          </span>
          <div className="text-2xl font-black text-[#0A2342]">{stats.avgPuko} / 100</div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Üniversite ağırlıklı ortalaması</p>
        </div>

        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200/70">
          <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block mb-1">
            Mezun Memnuniyeti (PÇ)
          </span>
          <div className="text-2xl font-black text-blue-900">{stats.avgAlumni} / 5.00</div>
          <p className="text-[11px] text-blue-700 font-medium mt-0.5">Program çıktısı puanı</p>
        </div>

        <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200/70">
          <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider block mb-1">
            İşveren Memnuniyeti (İÖ)
          </span>
          <div className="text-2xl font-black text-purple-900">{stats.avgEmployer} / 5.00</div>
          <p className="text-[11px] text-purple-700 font-medium mt-0.5">Dış paydaş yetkinlik skoru</p>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70">
          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block mb-1">
            Kapatılan PUKÖ Döngüsü
          </span>
          <div className="text-2xl font-black text-emerald-900">{stats.closedCount} / {scorecards.length} Bölüm</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Önlem Alındı fazında onaylı</p>
        </div>
      </div>

      {/* Arama ve Fakülte Filtre Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Bölüm veya fakülte ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tüm Fakülteler' },
            { id: 'Mühendislik', label: 'Mühendislik' },
            { id: 'İşletme', label: 'İİBF' },
            { id: 'Sağlık', label: 'Sağlık Bilimleri' },
            { id: 'Sosyal', label: 'Sanat & Sosyal' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFacultyFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition cursor-pointer border ${
                facultyFilter === f.id
                  ? 'bg-[#0A2342] text-white border-[#0A2342]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* PUKÖ Karne Tablosu */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-black tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="p-3.5">Fakülte & Lisans Programı</th>
              <th className="p-3.5 text-center">İstihdam Oranı</th>
              <th className="p-3.5 text-center">Alan İçi Uyum</th>
              <th className="p-3.5 text-center">Mezun PÇ (/5)</th>
              <th className="p-3.5 text-center">İşveren İÖ (/5)</th>
              <th className="p-3.5 text-center">PUKÖ Endeksi</th>
              <th className="p-3.5 text-center">Döngü Fazı</th>
              <th className="p-3.5 text-center">Eylem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredScorecards.map((sc) => {
              const isClosed = sc.isClosed || sc.pukoStatus === PUKO_CYCLE_STAGES.ACT;

              return (
                <tr key={sc.department} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="font-black text-slate-900 text-xs">{sc.department}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{sc.faculty}</div>
                    <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1 max-w-xs">
                      {sc.actionDecision}
                    </div>
                  </td>
                  <td className="p-3.5 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${sc.employmentRate >= 80 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      %{sc.employmentRate}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold">
                    <span className="text-slate-900 font-black">%{sc.inFieldRate}</span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-blue-700">
                    {sc.alumniScore}
                  </td>
                  <td className="p-3.5 text-center font-bold text-purple-700">
                    {sc.employerScore}
                  </td>
                  <td className="p-3.5 text-center font-black">
                    <span className="text-sm text-slate-900">{sc.pukoIndex}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{sc.qualityGrade}</span>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                      isClosed 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : sc.pukoStatus === PUKO_CYCLE_STAGES.CHECK
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {isClosed ? <CheckCircle2 size={12} /> : <RefreshCw size={11} className="animate-spin" />}
                      {sc.pukoStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenActionModal(sc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 mx-auto ${
                        isClosed
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-[#990000] hover:bg-red-800 text-white shadow-sm'
                      }`}
                    >
                      <Edit3 size={13} />
                      {isClosed ? 'Kararı İncele' : 'Döngüyü Kapat'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredScorecards.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400 font-bold">
                  Aranan kriterlere uygun bölüm kalite karnesi bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PUKÖ DÖNGÜSÜ KAPANIŞ VE KARAR MODALI */}
      {selectedDeptForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block mb-1">
                  YÖKAK PUKÖ Kapanış Masası (Önlem Al / Act)
                </span>
                <h4 className="text-lg font-black text-slate-900">
                  {selectedDeptForAction.department}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedDeptForAction.faculty} — Akreditasyon ve İyileştirme Kararı
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeptForAction(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Göstergeler Mini Paneli */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">İstihdam Oranı</span>
                <span className="text-sm font-black text-slate-900">%{selectedDeptForAction.employmentRate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Mezun Skoru</span>
                <span className="text-sm font-black text-blue-700">{selectedDeptForAction.alumniScore} / 5</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">İşveren Skoru</span>
                <span className="text-sm font-black text-purple-700">{selectedDeptForAction.employerScore} / 5</span>
              </div>
            </div>

            {/* Komisyon Kararı Girişi */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 block">
                Akreditasyon Komisyonu İyileştirme Kararı / Önlem Notu:
              </label>
              <textarea
                rows="4"
                value={customActionText}
                onChange={(e) => setCustomActionText(e.target.value)}
                placeholder="Örn: Bölüm müfredatında sektörün ihtiyaç duyduğu bulut mimarisi ve yapay zeka dersi eklenmiş, laboratuvar altyapısı güçlendirilerek PUKÖ döngüsü kapatılmıştır..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* Modal Butonları */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedDeptForAction(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveAction}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <CheckCircle2 size={16} /> Kararı Onayla ve Döngüyü Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
