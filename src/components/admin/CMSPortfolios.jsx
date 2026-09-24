import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import PanelHeader from './PanelHeader';
import { Card, Badge, Tbl, Progress } from './AdminShared';
import { FileText, Eye, Check, X, Search, Filter, AlertCircle, Sparkles } from 'lucide-react';

export default function CMSPortfolios() {
  const { students = [], logAction } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('Hepsi');
  const [cvPool, setCvPool] = useState([
    { id: 'cv_1', studentId: 'STU-001', name: 'Alperen Şahin', dept: 'Yazılım Mühendisliği', score: 94, status: 'Onaylandı', updated: '2026-07-22 10:15', experience: '1 Yıl / React Stajyer' },
    { id: 'cv_2', studentId: 'STU-002', name: 'Zeynep Kaya', dept: 'Yazılım Mühendisliği', score: 88, status: 'Beklemede', updated: '2026-07-22 12:45', experience: 'Deneyimsiz / Yeni Mezun' },
    { id: 'cv_3', studentId: 'STU-003', name: 'Caner Demir', dept: 'Bilgisayar Programcılığı', score: 76, status: 'Onaylandı', updated: '2026-07-21 15:30', experience: '2 Yıl Freelancer' },
    { id: 'cv_4', studentId: 'STU-004', name: 'Elif Yılmaz', dept: 'Yönetim Bilişim Sistemleri', score: 82, status: 'Beklemede', updated: '2026-07-22 09:12', experience: '1 Staj / Proje Yöneticisi Asistanı' }
  ]);

  const [activeCV, setActiveCV] = useState(null);

  const handleStatus = (id, newStatus) => {
    setCvPool(prev => prev.map(cv => {
      if (cv.id === id) {
        if (logAction) {
          logAction("Süper Admin", `${cv.name} isimli öğrencinin CV portfolyo durumu ${newStatus} yapıldı.`, "Portfolyo");
        }
        return { ...cv, status: newStatus };
      }
      return cv;
    }));
    if (activeCV?.id === id) {
      setActiveCV(prev => ({ ...prev, status: newStatus }));
    }
  };

  const filteredCVs = cvPool.filter(cv => {
    const matchesSearch = cv.name.toLowerCase().includes(searchTerm.toLowerCase()) || cv.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedDegree === 'Hepsi' || cv.status === selectedDegree;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <PanelHeader title="Portfolyo ve CV Yönetimi" sub="Öğrencilerin hazırladığı özgeçmişlerin ve portfolyo onay süreçlerinin kontrolü" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf: Liste ve Filtreleme */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Öğrenci veya bölüm ara..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-100 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select 
                value={selectedDegree}
                onChange={e => setSelectedDegree(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-semibold text-gray-700"
              >
                <option value="Hepsi">Tüm Durumlar</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Reddedildi">Reddedildi</option>
              </select>
            </div>
          </div>

          <Tbl
            headers={['Öğrenci', 'Bölüm', 'ATS Puanı', 'Son Güncelleme', 'Durum', 'İşlemler']}
            rows={filteredCVs.map(cv => [
              <div>
                <p className="font-bold text-gray-900">{cv.name}</p>
                <p className="text-[10px] text-gray-400 font-bold">{cv.experience}</p>
              </div>,
              cv.dept,
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-0.5">
                  <span>ATS Score</span>
                  <span>{cv.score}%</span>
                </div>
                <Progress value={cv.score} max={100} color={cv.score >= 85 ? 'green' : cv.score >= 70 ? 'blue' : 'orange'} />
              </div>,
              <span className="text-xs text-gray-500 font-medium">{cv.updated}</span>,
              <Badge status={cv.status} />,
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveCV(cv)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <Eye size={12} /> Detay
                </button>
              </div>
            ])}
          />
        </Card>

        {/* Sağ Taraf: CV Detay & AI Analiz Kartı */}
        <Card className="p-6">
          {activeCV ? (
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <span className="bg-red-50 text-red-700 text-[10px] font-black tracking-widest uppercase mb-2 inline-block">PORTFOLYO İNCELEME</span>
                <h3 className="text-lg font-black text-gray-900">{activeCV.name}</h3>
                <p className="text-sm font-semibold text-gray-600">{activeCV.dept}</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                  <p className="font-bold text-slate-700">Deneyim & Özet:</p>
                  <p className="text-slate-500 leading-relaxed">{activeCV.experience}</p>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3">
                  <h4 className="text-xs font-black text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-red-600" /> ATS ve Yetkinlik Analiz Raporu
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">ATS Puanı</p>
                      <p className="text-lg font-black text-indigo-900">{activeCV.score}%</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Okunabilirlik</p>
                      <p className="text-lg font-black text-emerald-600">Mükemmel</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleStatus(activeCV.id, 'Onaylandı')}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 duration-200"
                >
                  <Check size={14} /> Onayla
                </button>
                <button 
                  onClick={() => handleStatus(activeCV.id, 'Reddedildi')}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 duration-200"
                >
                  <X size={14} /> Reddet
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500">
              <FileText size={40} className="text-gray-300 mb-2" />
              <p className="text-sm font-bold">Detayları İnceleyin</p>
              <p className="text-xs text-gray-400 max-w-xs mt-1">Sol taraftaki listeden öğrenci kartına tıklayarak yetkinlik puanını ve CV analizini görüntüleyin.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
