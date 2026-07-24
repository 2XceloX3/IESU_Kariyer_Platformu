import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';
import { Sparkles } from 'lucide-react';

const initialData = [
  { name: 'Oca', basvuru: 120, kayit: 80 },
  { name: 'Şub', basvuru: 200, kayit: 150 },
  { name: 'Mar', basvuru: 450, kayit: 280 },
  { name: 'Nis', basvuru: 380, kayit: 310 },
  { name: 'May', basvuru: 520, kayit: 410 },
  { name: 'Haz', basvuru: 600, kayit: 490 },
];

export default function PlatformAnalytics() {
  const [data, setData] = useState(initialData);
  const [isPredicted, setIsPredicted] = useState(false);

  const handlePredict = () => {
    window.toast && window.toast.info("Anka AI: Geçmiş veriler analiz edilerek gelecek çeyrek tahminleri oluşturuluyor...");
    setTimeout(() => {
      setData([
        ...initialData,
        { name: 'Tem', basvuru: 650, kayit: 510, predicted: true },
        { name: 'Ağu', basvuru: 720, kayit: 550, predicted: true },
        { name: 'Eyl', basvuru: 850, kayit: 620, predicted: true },
      ]);
      setIsPredicted(true);
      window.toast && window.toast.success("✅ AI Öngörüsü: Eylüle kadar başvurularda %41 artış bekleniyor.");
    }, 2500);
  };

  return (
    <div className="h-[350px] w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-gray-900 text-[15px]">Platform Etkileşim Trendi (2026)</h3>
        {!isPredicted && (
          <button 
            onClick={handlePredict}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
          >
            <Sparkles size={14} /> AI ile Öngörü Üret
          </button>
        )}
        {isPredicted && (
           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">AI Tahminleri Aktif</span>
        )}
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBasvuru" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#cca26d" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#cca26d" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
            <Tooltip 
              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)'}} 
              itemStyle={{color: '#0A2342', fontWeight: 'bold'}}
            />
            <Area type="monotone" dataKey="basvuru" stroke="#cca26d" strokeWidth={3} fillOpacity={1} fill="url(#colorBasvuru)" />
            {isPredicted && (
              <Area type="monotone" dataKey="basvuru" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" data={data.filter(d => d.predicted || d.name === 'Haz')} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
