import React, { useState } from 'react';
import PanelHeader from './PanelHeader';
import { Card, StatCard, Progress, Tbl, Badge } from './AdminShared';
import { BarChart3, Award, FileText, Search, CheckCircle, XCircle } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function AkademikPanel() {
  const students = useAppStore(state => state.students) || [];
  const avg = students?.length ? ((students || []).reduce((a,s)=>a+parseFloat(s?.gpa||0),0)/students.length).toFixed(2) : "0.00";
  const honor = (students || []).filter(s=>s?.gpa>=3.5).length;
  const withCV = (students || []).filter(s=>s?.cv).length;
  const [search, setSearch] = useState('');
  const filtered = (students || []).filter(s=>s?.name.toLowerCase().includes(search.toLowerCase())||s?.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Akademik Performans" sub="GPA, bölüm dağılımı ve öğrenci özeti" />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={<BarChart3 size={20}/>} label="Ortalama GPA" value={avg} sub="Tüm öğrenciler" color="blue"/>
        <StatCard icon={<Award size={20}/>} label="Yüksek Onur" value={honor} sub="GPA ≥ 3.5" color="green"/>
        <StatCard icon={<FileText size={20}/>} label="CV Yüklemiş" value={withCV} sub={`${(students || []).length-withCV} eksik`} color="orange"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 col-span-1">
          <h3 className="font-black text-gray-900 mb-4">GPA Dağılımı</h3>
          <div className="space-y-3">
            {[
              {label:'3.5 – 4.0 (Yüksek Onur)',val:(students || []).filter(s=>s?.gpa>=3.5).length,color:'green'},
              {label:'3.0 – 3.5 (Onur)',        val:(students || []).filter(s=>s?.gpa>=3.0&&s?.gpa<3.5).length,color:'blue'},
              {label:'2.5 – 3.0 (Geçer)',       val:(students || []).filter(s=>s?.gpa>=2.5&&s?.gpa<3.0).length,color:'orange'},
              {label:'2.0 – 2.5 (Alt Sınır)',   val:(students || []).filter(s=>s?.gpa<2.5).length,color:'red'},
            ].map(g=>(
              <div key={g.label}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                  <span>{g.label}</span><span className="font-black text-gray-900">{g.val}</span>
                </div>
                <Progress value={g.val} max={(students || []).length || 1} color={g.color}/>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Öğrenci Listesi</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ara..." className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-300"/>
            </div>
          </div>
          <Tbl
            headers={['Ad Soyad','Bölüm','Sınıf','GPA','CV','Durum']}
            rows={filtered.map(s=>[
              <span className="font-bold text-gray-900">{s?.name}</span>,
              s?.dept,
              `${s?.year}. Sınıf`,
              <span className={`font-black ${s?.gpa>=3.5?'text-emerald-600':s?.gpa>=3.0?'text-blue-600':'text-orange-600'}`}>{s?.gpa}</span>,
              s?.cv?<CheckCircle size={15} className="text-emerald-500"/>:<XCircle size={15} className="text-gray-400"/>,
              <Badge status={s?.status}/>
            ])}
          />
        </Card>
      </div>
    </div>
  );
}
