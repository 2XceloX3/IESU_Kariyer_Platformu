import React, { useState, useEffect } from 'react';
import PanelHeader from './PanelHeader';
import { 
  UserCheck, Search, Filter, ShieldCheck, ShieldAlert, 
  Clock, CheckCircle, XCircle, AlertTriangle, Eye, Mail, MessageSquare
} from 'lucide-react';

export default function CMSMentorshipPool() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [selectedReq, setSelectedReq] = useState(null);

  useEffect(() => {
    // Load requests from LocalStorage + store
    try {
      const stored = JSON.parse(localStorage.getItem('iesu_mentorship_requests_v1')) || [];
      if (stored.length === 0) {
        // Fallback demo audit data for KGM admin supervision
        setRequests([
          {
            id: 'mreq_1',
            studentId: 'std_101',
            studentName: 'Mert Can',
            studentDept: 'İşletme Fakültesi',
            studentEmail: 'mert.can@esenyurt.edu.tr',
            mentorId: 'mnt_201',
            mentorName: 'Caner Öztürk',
            mentorTitle: 'Kıdemli Yazılım Mimarı @ Trendyol Tech',
            topic: 'CV & Portfolyo İncelemesi',
            mode: 'Online Görüşme',
            note: 'Trendyol Tech staj başvurusunda bulunacağım, hazırladığım yazılım ve proje CV portalımın incelenmesi konusunda mentör desteği rica ediyorum.',
            date: '31 Temmuz 2026 11:30',
            status: 'Beklemede'
          },
          {
            id: 'mreq_2',
            studentId: 'std_102',
            studentName: 'Zeynep Kaya',
            studentDept: 'Bilgisayar Mühendisliği',
            studentEmail: 'zeynep.kaya@esenyurt.edu.tr',
            mentorId: 'mnt_202',
            mentorName: 'Alperen Yılmaz',
            mentorTitle: 'Kıdemli Sistem Mimarı @ Aselsan',
            topic: 'Mülakat Simülasyonu & Hazırlık',
            mode: 'Yüz Yüze Kampüs Görüşmesi',
            note: 'Savunma sanayi mülakat süreçleri ve teknik sistem soruları hakkında simülasyon mülakatı gerçekleştirmek istiyorum.',
            date: '30 Temmuz 2026 14:15',
            status: 'Onaylandı'
          }
        ]);
      } else {
        setRequests(stored);
      }
    } catch (e) {
      setRequests([]);
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setRequests(updated);
    try {
      localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredRequests = requests.filter(req => {
    const matchSearch = !searchQuery || 
      req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.note.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'Tümü' || req.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <PanelHeader 
        title="Mentörlük & Danışmanlık Denetim Havuzu" 
        sub="Öğrencilerin mentörlerden talep ettiği danışmanlık konuları ve güvenlik takibi" 
      />

      {/* Top Filter & Search controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Öğrenci, mentör veya konu ara..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#990000]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Durum:</span>
          {['Tümü', 'Beklemede', 'Onaylandı', 'Reddedildi'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                statusFilter === st 
                  ? 'bg-[#990000] text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-black uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Talep Eden Öğrenci</th>
                <th className="p-4">Hedef Mentör</th>
                <th className="p-4">Mentörlük Konusu & Görüşme</th>
                <th className="p-4">Tarih</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem & İncele</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">
                    Kriterlere uygun kayıtlı mentörlük talebi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{req.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{req.studentDept}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{req.mentorName}</div>
                      <div className="text-[11px] text-[#990000] font-semibold">{req.mentorTitle}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-800 block">{req.topic}</span>
                      <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-1">
                        {req.mode}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-medium whitespace-nowrap">
                      {req.date}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        req.status === 'Onaylandı' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Reddedildi' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedReq(req)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 ml-auto"
                      >
                        <Eye size={14} /> İçeriği İncele
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Audit Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 pt-16 pb-24">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] relative">
            <div className="p-5 bg-gradient-to-r from-slate-900 via-[#990000] to-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400" />
                <h3 className="font-black text-sm text-white">Mentörlük Talebi Denetim Kartı</h3>
              </div>
              <button 
                onClick={() => setSelectedReq(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-slate-700 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Öğrenci</span>
                  <p className="font-extrabold text-xs text-slate-900">{selectedReq.studentName}</p>
                  <p className="text-[11px] text-slate-500">{selectedReq.studentDept}</p>
                  <p className="text-[11px] text-blue-600 font-medium">{selectedReq.studentEmail}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#990000] uppercase">Mentör</span>
                  <p className="font-extrabold text-xs text-slate-900">{selectedReq.mentorName}</p>
                  <p className="text-[11px] text-slate-500">{selectedReq.mentorTitle}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-black text-slate-800 block mb-1">Talep Edilen Konu & Şekil</span>
                <p className="text-xs font-bold text-slate-900 bg-slate-100 p-2.5 rounded-xl">
                  {selectedReq.topic} • ({selectedReq.mode})
                </p>
              </div>

              <div>
                <span className="text-xs font-black text-slate-800 block mb-1">Öğrenci Notu & Detaylı İsteği</span>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedReq.note}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => { updateStatus(selectedReq.id, 'Onaylandı'); setSelectedReq(null); }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                >
                  Talebi Onayla
                </button>
                <button
                  onClick={() => { updateStatus(selectedReq.id, 'Reddedildi'); setSelectedReq(null); }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
                >
                  Talebi Durdur / Reddet
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
