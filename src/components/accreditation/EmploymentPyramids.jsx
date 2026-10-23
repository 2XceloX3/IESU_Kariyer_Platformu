import React, { useState } from 'react';
import { DollarSign, Building2, TrendingUp, Briefcase, Award, CheckCircle2, ChevronRight, BarChart3, PieChart as PieIcon } from 'lucide-react';

export default function EmploymentPyramids({
  salaryPyramid = [],
  sectorPyramid = [],
  inFieldRate = 0,
  outOfFieldRate = 0,
  sectoralAlignmentCoefficient = 0,
  totalEmployed = 0,
}) {
  const [activeTab, setActiveTab] = useState('salary'); // 'salary' | 'sector' | 'alignment'

  // Renk ve Seviye Dağılımları
  const pyramidLevels = [
    { level: 5, bg: 'from-rose-500 to-red-600', text: 'text-rose-600', border: 'border-rose-200', tag: 'Kıdemli / Üst Düzey & Global (120.000 ₺+)' },
    { level: 4, bg: 'from-amber-500 to-orange-600', text: 'text-amber-600', border: 'border-amber-200', tag: 'Uzman / Proje Yöneticisi (75.001 ₺ - 120.000 ₺)' },
    { level: 3, bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', border: 'border-emerald-200', tag: 'İleri Düzey Yetkinlik (45.001 ₺ - 75.000 ₺)' },
    { level: 2, bg: 'from-sky-500 to-blue-600', text: 'text-sky-600', border: 'border-sky-200', tag: 'Orta Düzey Giriş (25.001 ₺ - 45.000 ₺)' },
    { level: 1, bg: 'from-slate-400 to-slate-500', text: 'text-slate-600', border: 'border-slate-200', tag: 'Asgari Ücret Skalası (17.002 ₺ - 25.000 ₺)' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#990000] uppercase tracking-wider mb-1">
            <BarChart3 size={15} /> Sektörel İstihdam & Gelir Hiyerarşisi
          </div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Maaş ve Sektör Dağılım Piramitleri
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            İESÜ mezunlarının reel sektör gelir skalaları ve istihdam edildikleri ana endüstri kolları.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/70 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'salary'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign size={13} className="inline mr-1 text-emerald-600" /> Maaş Piramidi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sector')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'sector'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={13} className="inline mr-1 text-blue-600" /> Sektör Dağılımı
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alignment')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'alignment'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award size={13} className="inline mr-1 text-purple-600" /> Alan İçi Uyum
          </button>
        </div>
      </div>

      {/* TAB 1: MAAŞ PİRAMİDİ GÖRÜNÜMÜ */}
      {activeTab === 'salary' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                Toplam İstihdam Örneklemi
              </span>
              <div className="text-2xl font-black text-slate-900">{totalEmployed} Mezun</div>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Gelir beyanında bulunan mezunlar</p>
            </div>
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
                Orta ve İleri Gelir Payı
              </span>
              <div className="text-2xl font-black text-emerald-800">
                %{Math.min(100, Math.round(((salaryPyramid[1]?.count || 0) + (salaryPyramid[2]?.count || 0) + (salaryPyramid[3]?.count || 0) + (salaryPyramid[4]?.count || 0)) / Math.max(1, totalEmployed) * 100)) || 0}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Asgari ücretin üzerinde başlayanlar</p>
            </div>
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block mb-1">
                Kıdemli / Üst Düzey Oranı
              </span>
              <div className="text-2xl font-black text-amber-800">
                %{Math.round(((salaryPyramid[3]?.count || 0) + (salaryPyramid[4]?.count || 0)) / Math.max(1, totalEmployed) * 100) || 0}
              </div>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">75.000 ₺ üzeri maaş seviyesi</p>
            </div>
          </div>

          {/* Piramit Basamakları (Üst Düzeyden Tabana Doğru) */}
          <div className="space-y-3 pt-2">
            {[...salaryPyramid].reverse().map((sb, idx) => {
              const meta = pyramidLevels.find(p => p.level === sb.level) || pyramidLevels[0];
              const pct = sb.percentage || 0;
              // Piramit genişlik etkisi (kademe 5 en dar, kademe 1 en geniş)
              const widthWeight = 50 + (idx * 12);

              return (
                <div key={sb.id} className="relative group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold mb-1.5 px-1">
                    <span className="text-slate-800 flex items-center gap-1.5 font-black">
                      <span className={`w-2.5 h-2.5 rounded-full ${meta.bg.split(' ')[0].replace('from-', 'bg-')}`}></span>
                      {sb.label}
                    </span>
                    <span className="text-slate-500 font-semibold mt-0.5 sm:mt-0">
                      <strong>{sb.count}</strong> mezun <span className="text-slate-400">|</span> <strong className="text-slate-900">%{pct}</strong>
                    </span>
                  </div>

                  {/* Basamak Çubuğu */}
                  <div className="w-full bg-slate-100 rounded-2xl h-8 p-1 overflow-hidden border border-slate-200/70 flex items-center">
                    <div
                      className={`h-full rounded-xl bg-gradient-to-r ${meta.bg} transition-all duration-700 flex items-center px-3 text-[10px] font-black text-white shadow-sm`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    >
                      {pct > 5 && `%${pct}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SEKTÖR DAĞILIMI */}
      {activeTab === 'sector' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorPyramid.slice(0, 6).map((sec, idx) => (
              <div key={sec.sector} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">#{idx + 1} Sıra</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                    %{sec.percentage}
                  </span>
                </div>
                <div className="text-sm font-black text-slate-900 truncate" title={sec.sector}>
                  {sec.sector}
                </div>
                <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${sec.percentage}%`, backgroundColor: sec.color || '#990000' }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex justify-between">
                  <span>Toplam İstihdam:</span>
                  <strong className="text-slate-800">{sec.count} Mezun</strong>
                </div>
              </div>
            ))}
          </div>

          {sectorPyramid.length === 0 && (
            <div className="text-center py-8 text-xs font-bold text-slate-400">
              Henüz sektörel istihdam verisi girilmedi.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALAN İÇİ / ALAN DIŞI UYUM KATSAYISI */}
      {activeTab === 'alignment' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Büyük Katsayı Rozeti */}
            <div className="bg-gradient-to-br from-[#0A2342] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/50 relative overflow-hidden shadow-md">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 mb-2">
                <Award size={14} /> YÖKAK KAP Ölçüt A.1.1 Uyum Katsayısı
              </span>
              <div className="text-5xl font-black text-white tracking-tight">
                {sectoralAlignmentCoefficient}
                <span className="text-xl font-bold text-blue-300 ml-2">/ 1.00</span>
              </div>
              <p className="text-xs text-blue-200 font-medium mt-3 leading-relaxed">
                Mezunların okudukları lisans programının program çıktıları ile çalıştıkları pozisyonun mesleki örtüşme katsayısı.
              </p>
              <div className="mt-4 pt-4 border-t border-blue-900/60 flex items-center justify-between text-xs">
                <span className="text-blue-300">Akreditasyon Yeterliliği:</span>
                <span className="font-black text-emerald-400">
                  {sectoralAlignmentCoefficient >= 0.70 ? 'Yüksek Uyum (Akredite)' : 'İzleme Kapsamında'}
                </span>
              </div>
            </div>

            {/* İkili Karşılaştırma Çubukları */}
            <div className="space-y-5 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
              <div>
                <div className="flex justify-between items-center text-xs font-black mb-1.5">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Alan İçi İstihdam (Kendi Bölümü)
                  </span>
                  <span className="text-slate-900 text-sm">%{inFieldRate}</span>
                </div>
                <div className="w-full bg-slate-200 h-3.5 rounded-xl overflow-hidden p-0.5">
                  <div
                    className="h-full bg-emerald-600 rounded-lg transition-all duration-700"
                    style={{ width: `${inFieldRate}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Yazılım, mühendislik, sağlık, hukuk ve işletme formasyonuna doğrudan uygun roller.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-black mb-1.5">
                  <span className="text-amber-700 flex items-center gap-1.5">
                    <ChevronRight size={15} /> Alan Dışı İstihdam / Farklı Sektör
                  </span>
                  <span className="text-slate-900 text-sm">%{outOfFieldRate}</span>
                </div>
                <div className="w-full bg-slate-200 h-3.5 rounded-xl overflow-hidden p-0.5">
                  <div
                    className="h-full bg-amber-500 rounded-lg transition-all duration-700"
                    style={{ width: `${outOfFieldRate}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Disiplinlerarası geçiş, serbest girişimcilik veya alternatif hizmet sektörü pozisyonları.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
