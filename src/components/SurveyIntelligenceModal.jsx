import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, FileText, CheckCircle2, AlertTriangle, Sparkles, 
  Download, Filter, Layers, PieChart as PieIcon, RefreshCw, X, 
  Send, Award, HelpCircle, UserCheck, TrendingUp, Grid, Flame
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function SurveyIntelligenceModal({ isOpen, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState('likert');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | builder | yok_report

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const surveyMetrics = useMemo(() => {
    // Mock Data representing Survey Intelligence Agent Analytics
    const departmentScores = [
      { name: 'Yazılım Bilişim', satisfaction: 4.6, responseCount: 340, nps: 78 },
      { name: 'İşletme & İİBF', satisfaction: 4.2, responseCount: 280, nps: 65 },
      { name: 'Sağlık Bilimleri', satisfaction: 4.4, responseCount: 410, nps: 72 },
      { name: 'Mühendislik', satisfaction: 4.5, responseCount: 390, nps: 75 },
      { name: 'Sanat & Tasarım', satisfaction: 4.1, responseCount: 190, nps: 60 }
    ];

    const likertDistribution = [
      { rating: '5 - Kesinlikle Katılıyorum', count: 620, fill: '#10B981' },
      { rating: '4 - Katılıyorum', count: 480, fill: '#3B82F6' },
      { rating: '3 - Kararsızım', count: 140, fill: '#F59E0B' },
      { rating: '2 - Katılmıyorum', count: 70, fill: '#EF4444' },
      { rating: '1 - Kesinlikle Katılmıyorum', count: 30, fill: '#990000' }
    ];

    const aiInsights = [
      "🚀 Yazılım ve Mühendislik bölümlerinde staj sonrası işe yerleşme memnuniyeti %92 ile rekor seviyede.",
      "⚠️ İİBF ve Sanat Tasarım öğrencilerinde kampüs dışı firma stant çeşitliliğinin artırılması talebi öne çıkıyor.",
      "🎓 YÖK Kalite Kurulu standartlarına göre 2026 yılı mezun geri bildirim anketi katılım hedefi %85 aşıldı (%89.4)."
    ];

    return { departmentScores, likertDistribution, aiInsights };
  }, [departmentFilter, genderFilter, yearFilter]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#990000] via-[#7A0000] to-[#5C0000] p-6 text-white relative">
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} className="animate-pulse" /> Data Intelligence Office — Survey Intelligence Agent
            </div>
            <h2 className="text-2xl font-black tracking-tight">Dinamik Anket & YÖK Akreditasyon Analiz Zekası</h2>
            <p className="text-red-100/90 text-xs mt-1">
              Çok boyutlu anket kırılımları, Likert/NPS ısı haritaları ve YÖK Kalite Standartlarına uygun otomatik raporlama motoru.
            </p>
          </div>

          {/* Navigation Bar */}
          <div className="flex border-b border-gray-100 bg-gray-50/80 px-6 pt-3 gap-2">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-white text-[#990000] border-t-2 border-[#990000] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart2 size={16} /> Görsel Analitik & Isı Haritası
            </button>
            <button 
              onClick={() => setActiveTab('builder')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'builder' ? 'bg-white text-[#990000] border-t-2 border-[#990000] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers size={16} /> Dinamik Anket Mimarisi
            </button>
            <button 
              onClick={() => setActiveTab('yok_report')}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'yok_report' ? 'bg-white text-[#990000] border-t-2 border-[#990000] shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award size={16} /> YÖK / YÖKAK Akreditasyon Çıktısı
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Fakülte / Bölüm</label>
                    <select 
                      value={departmentFilter} 
                      onChange={e => setDepartmentFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                    >
                      <option value="all">Tüm Bölümler (İESÜ Geneli)</option>
                      <option value="software">Yazılım Mühendisliği</option>
                      <option value="business">İşletme & Yönetim</option>
                      <option value="health">Sağlık Yönetimi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Cinsiyet Kırılımı</label>
                    <select 
                      value={genderFilter} 
                      onChange={e => setGenderFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                    >
                      <option value="all">Tüm Yanıtlar</option>
                      <option value="female">Kadın Öğrenciler</option>
                      <option value="male">Erkek Öğrenciler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Mezuniyet Yılı</label>
                    <select 
                      value={yearFilter} 
                      onChange={e => setYearFilter(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-[#990000] outline-none"
                    >
                      <option value="all">Tüm Yıllar (2022 - 2026)</option>
                      <option value="2026">2026 Mezun Adayları</option>
                      <option value="2025">2025 Mezunları</option>
                      <option value="2024">2024 Mezunları</option>
                    </select>
                  </div>
                </div>

                {/* AI Insights Card */}
                <div className="bg-gradient-to-r from-red-50 via-amber-50/40 to-red-50 border border-red-200/80 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#990000] flex items-center gap-1.5">
                      <Sparkles size={16} /> Yapay Zekâ NLP Özet & Yönetimsel Aksiyon Önerileri
                    </h4>
                    <span className="text-[10px] font-bold bg-[#990000] text-white px-2 py-0.5 rounded-full">CANLI ANALİZ</span>
                  </div>
                  <div className="space-y-2">
                    {surveyMetrics.aiInsights.map((insight, idx) => (
                      <p key={idx} className="text-xs font-medium text-gray-800 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-red-100/60">
                        {insight}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Recharts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Department Satisfaction */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <BarChart2 size={16} className="text-[#990000]" /> Bölüm Bazlı Anket Memnuniyet Puanları (1-5)
                    </h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={surveyMetrics.departmentScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700 }} />
                          <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }} />
                          <Bar dataKey="satisfaction" fill="#990000" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Likert Ratings Distribution */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <PieIcon size={16} className="text-[#990000]" /> Likert Dağılım İstatistiği
                    </h4>
                    <div className="h-60 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={surveyMetrics.likertDistribution} 
                            dataKey="count" 
                            nameKey="rating" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={80} 
                            label={({ rating, percent }) => `${(percent * 100).toFixed(0)}%`}
                          >
                            {surveyMetrics.likertDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'builder' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Dinamik Şablon ve Soru Öneri Motoru</h3>
                  <p className="text-xs text-gray-500">Likert, NPS ve çoktan seçmeli şablonlarla anında anket mimarisi tasarlayın.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setSelectedTemplate('likert')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedTemplate === 'likert' ? 'border-[#990000] bg-red-50/50 ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-black text-[#990000]">5'Lİ LİKERT ÖLÇEĞİ</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">Ders & Eğitmen Memnuniyeti</h4>
                    <p className="text-[11px] text-gray-500 mt-1">1 (Kesinlikle Katılmıyorum) - 5 (Kesinlikle Katılıyorum) derecelendirmesi.</p>
                  </div>

                  <div 
                    onClick={() => setSelectedTemplate('nps')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedTemplate === 'nps' ? 'border-[#990000] bg-red-50/50 ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-black text-[#990000]">NET PROMOTER SCORE (NPS)</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">Tavsiye Etme Skoru (0-10)</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Mezunların ve öğrencilerin üniversiteyi tavsiye etme sadakat skoru.</p>
                  </div>

                  <div 
                    onClick={() => setSelectedTemplate('matrix')}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      selectedTemplate === 'matrix' ? 'border-[#990000] bg-red-50/50 ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs font-black text-[#990000]">ÇOKLU MATRİS</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">Kariyer Fuarı Değerlendirme</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Stant çeşitliliği, etkinlik organizasyonu ve ikram memnuniyeti matrisi.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'yok_report' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-5 text-center py-10">
                <Award size={48} className="mx-auto text-[#990000] animate-bounce" />
                <h3 className="text-lg font-black text-gray-900">YÖK & YÖKAK Akreditasyon Raporlama Motoru</h3>
                <p className="text-xs text-gray-600 max-w-xl mx-auto">
                  İstanbul Esenyurt Üniversitesi Kalite Güvence Komisyonu ve YÖK denetimleri için anket verilerini anında resmi PDF formatında paketler.
                </p>
                <button 
                  onClick={() => { if (window.toast) window.toast.success("YÖK Akreditasyon Anket Raporu (PDF) başarıyla oluşturuldu."); }}
                  className="px-6 py-3 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-2xl text-xs transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <Download size={16} /> YÖK Kalite Standartları PDF Raporunu İndir
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">
              İstanbul Esenyurt Üniversitesi — Survey Intelligence Agent v2.0 (Google Stitch Verified)
            </span>
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
