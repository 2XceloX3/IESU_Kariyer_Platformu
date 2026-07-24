import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Utensils, Users, Server, Briefcase, ExternalLink } from 'lucide-react';

const INDEX_DATA = [
  { title: "Günün Yemekhane Menüsü (SKSDB)", type: "Internal", view: "sksdb_lunch", icon: <Utensils size={16} /> },
  { title: "Öğrenci Kulüpleri Dizini", type: "Internal", view: "sksdb_clubs", icon: <Users size={16} /> },
  { title: "BİDB Sistem Durumu & Wi-Fi", type: "Internal", view: "bidb_status", icon: <Server size={16} /> },
  { title: "BİDB Şifre Sıfırlama & Destek Bileti", type: "Internal", view: "bidb_helpdesk", icon: <Server size={16} /> },
  { title: "Staj ve İş İlanları Paneli", type: "Internal", view: "kariyer_board", icon: <Briefcase size={16} /> },
  { title: "OBİS Öğrenci Bilgi Sistemi", type: "External", url: "https://obis.esenyurt.edu.tr", tooltip: "Bu işlem sizi resmi OBİS sistemine yönlendirecektir.", icon: <ExternalLink size={16} /> },
  { title: "e-Devlet Öğrenci Belgesi", type: "External", url: "https://www.turkiye.gov.tr", tooltip: "Bu işlem sizi e-Devlet Kapısına yönlendirecektir.", icon: <ExternalLink size={16} /> }
];

export default function GlobalSearchOverlay({ isOpen, onClose, setView }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = INDEX_DATA.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text"
            autoFocus
            placeholder="Tüm portallarda ara (Yemekhane, Kulüpler, OBİS, İlanlar...)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  if (item.type === 'Internal') {
                    setView(item.view);
                    onClose();
                  } else {
                    window.open(item.url, '_blank');
                  }
                }}
                className="p-3.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition"
                title={item.tooltip || ''}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-red-600 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-red-900">{item.title}</h4>
                    {item.tooltip && <p className="text-[10px] text-amber-600 font-semibold">{item.tooltip}</p>}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${item.type === 'Internal' ? 'bg-indigo-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                  {item.type}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold">Sonuç bulunamadı.</div>
          )}
        </div>
      </div>
    </div>
  );
}
