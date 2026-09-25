import React, { useState } from 'react';
import { 
  Calendar, UserCheck, Clock, CheckCircle2, XCircle, Search, MessageSquare, 
  Award, GraduationCap, Star, Edit3, X, FileText, Send, Sparkles, Filter, 
  ChevronRight, Building2, ShieldCheck, User, Check, AlertCircle, ArrowUpRight,
  TrendingUp, Users, CheckCircle
} from 'lucide-react';
import { Card, Badge, Tbl } from './AdminShared';
import useAppStore from '../../store/useAppStore';
import { useAdminStore } from '../../brain/useAdminStore';
import { initialCareerTestSubmissions } from '../../data/mockClubsData';

export default function CMSCareerCounseling() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [selectedTestDetail, setSelectedTestDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState('HEPSİ');
  const [activeSubTab, setActiveSubTab] = useState('appointments'); // 'appointments' | 'evaluations' | 'counselors' | 'career_tests'

  const storeSubmissions = useAdminStore(state => state.careerTestSubmissions);
  const testSubmissions = (storeSubmissions && storeSubmissions.length > 0) ? storeSubmissions : initialCareerTestSubmissions;

  const [evaluationForm, setEvaluationForm] = useState({
    rating: 5,
    evaluationNotes: '',
    actionPlan: '',
    verifiedSkills: 'React, Node.js, İletişim',
    counselorName: 'Zuhal ŞAHİN (KGM Ofis Sorumlusu)'
  });

  const [appointments, setAppointments] = useState([
    { 
      id: 'APPT-101', 
      studentName: 'Alperen Yılmaz', 
      studentId: 'STU-001',
      department: 'Yazılım Mühendisliği', 
      counselor: 'Zuhal ŞAHİN', 
      type: 'Bire Bir CV & Portfolyo İnceleme', 
      date: '2026-08-05 14:00', 
      location: 'KGM Görüşme Odası 2 / Online Zoom', 
      status: 'Onaylandı',
      evaluation: null 
    },
    { 
      id: 'APPT-102', 
      studentName: 'Zeynep Kaya', 
      studentId: 'STU-002',
      department: 'İşletme', 
      counselor: 'Mutlu Gülsev YAĞIZ', 
      type: 'Mülakat Simülasyonu & Prova', 
      date: '2026-08-06 10:30', 
      location: 'KGM Görüşme Odası 1', 
      status: 'Tamamlandı',
      evaluation: {
        counselorName: 'Mutlu Gülsev YAĞIZ',
        rating: 5,
        evaluationNotes: 'Öğrenci mülakat simülasyonunda özgüvenli ve teknik detaylara hakim. CV akreditasyon için onaylandı.',
        actionPlan: 'Aselsan staj başvurusuna yönlendirildi.',
        verifiedSkills: 'Liderlik, Sunum, İngilizce B2',
        evaluatedAt: '2026-08-01 16:30'
      }
    },
    { 
      id: 'APPT-103', 
      studentName: 'Mert Demir', 
      studentId: 'STU-003',
      department: 'Biyomedikal Mühendisliği', 
      counselor: 'Zuhal ŞAHİN', 
      type: 'Kariyer Yönlendirme & Yüksek Lisans', 
      date: '2026-08-06 15:30', 
      location: 'Online Teams', 
      status: 'Beklemede',
      evaluation: null 
    },
    {
      id: 'APPT-104',
      studentName: 'Ayşe Yılmaz',
      studentId: 'STU-004',
      department: 'Elektrik-Elektronik',
      counselor: 'Mutlu Gülsev YAĞIZ',
      type: 'LinkedIn Profil Optimizasyonu',
      date: '2026-08-07 11:00',
      location: 'Online Zoom',
      status: 'Beklemede',
      evaluation: null
    },
    {
      id: 'APPT-105',
      studentName: 'Caner Şahin',
      studentId: 'STU-005',
      department: 'Mimarlık',
      counselor: 'Zuhal ŞAHİN',
      type: 'Yurt Dışı Kariyer Fırsatları',
      date: '2026-08-07 14:30',
      location: 'KGM Görüşme Odası 1',
      status: 'Onaylandı',
      evaluation: null
    },
    {
      id: 'APPT-106',
      studentName: 'Elif Öztürk',
      studentId: 'STU-006',
      department: 'Endüstri Müh.',
      counselor: 'Mutlu Gülsev YAĞIZ',
      type: 'Staj Dönüşüm Stratejisi',
      date: '2026-08-04 09:30',
      location: 'KGM Görüşme Odası 2',
      status: 'Tamamlandı',
      evaluation: {
        counselorName: 'Mutlu Gülsev YAĞIZ',
        rating: 5,
        evaluationNotes: 'Staj performansı ve tam zamanlı teklif alma stratejileri değerlendirildi.',
        actionPlan: 'İnsan kaynakları ile görüşme takvimi planlandı.',
        verifiedSkills: 'Süreç Analizi, Sunum Becerileri',
        evaluatedAt: '2026-08-04 10:30'
      }
    },
    {
      id: 'APPT-107',
      studentName: 'Burak Arslan',
      studentId: 'STU-007',
      department: 'Veri Bilimi',
      counselor: 'Zuhal ŞAHİN',
      type: 'Teknik Mülakat Hazırlığı',
      date: '2026-08-08 16:00',
      location: 'Online Zoom',
      status: 'Beklemede',
      evaluation: null
    },
    {
      id: 'APPT-108',
      studentName: 'Selin Aydın',
      studentId: 'STU-008',
      department: 'Siber Güvenlik',
      counselor: 'Mutlu Gülsev YAĞIZ',
      type: 'Sektör Analizi & Trend Raporu',
      date: '2026-08-03 13:00',
      location: 'KGM Görüşme Odası 1',
      status: 'İptal Edildi',
      evaluation: null
    }
  ]);

  const counselorsList = [
    { name: 'Zuhal ŞAHİN', title: 'KGM Kıdemli Danışman & Ofis Sorumlusu', email: 'zuhal.sahin@iesu.edu.tr', totalAppts: 18, rating: 4.9, avatar: 'ZŞ' },
    { name: 'Mutlu Gülsev YAĞIZ', title: 'Kariyer Geliştirme Uzmanı', email: 'mgulsev@iesu.edu.tr', totalAppts: 22, rating: 5.0, avatar: 'MY' }
  ];

  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    window.toast?.success?.(`Randevu durumu güncellendi: ${newStatus}`);
  };

  const handleOpenEvaluation = (appt) => {
    setSelectedAppt(appt);
    setEvaluationForm({
      rating: appt.evaluation?.rating || 5,
      evaluationNotes: appt.evaluation?.evaluationNotes || '',
      actionPlan: appt.evaluation?.actionPlan || '',
      verifiedSkills: appt.evaluation?.verifiedSkills || 'İletişim, Problem Çözme',
      counselorName: appt.counselor || 'Zuhal ŞAHİN'
    });
  };

  const handleSaveEvaluation = (e) => {
    e.preventDefault();
    if (!selectedAppt) return;

    const newEval = {
      ...evaluationForm,
      evaluatedAt: new Date().toLocaleString('tr-TR')
    };

    setAppointments(prev => prev.map(a => a.id === selectedAppt.id ? { ...a, status: 'Tamamlandı', evaluation: newEval } : a));
    window.toast?.success?.(`✅ ${selectedAppt.studentName} öğrencisine ait görüşme değerlendirmesi başarıyla kaydedildi!`);
    setSelectedAppt(null);
  };

  const filtered = appointments.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.counselor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'HEPSİ' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in space-y-6 font-sans">
      
      {/* ── HEADER BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-red-950/20">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
              <UserCheck size={28} className="text-rose-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  KGM Danışmanlık Yönetimi
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  Canlı Takip
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Kariyer Danışmanlığı & Bire Bir Randevu Havuzu
              </h1>
              <p className="text-xs text-rose-100/80 mt-1 max-w-xl">
                Öğrenci ve mezunların uzmanlardan aldığı randevuları yönetin, görüşme raporlarını işleyin ve yetenek onaylarını tanımlayın.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
            <button 
              onClick={() => setActiveSubTab('appointments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'appointments' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white/80 hover:text-white'}`}
            >
              📅 Randevular
            </button>
            <button 
              onClick={() => setActiveSubTab('evaluations')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'evaluations' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white/80 hover:text-white'}`}
            >
              📝 Raporlar ({appointments.filter(a => a.evaluation).length})
            </button>
            <button 
              onClick={() => setActiveSubTab('counselors')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'counselors' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white/80 hover:text-white'}`}
            >
              👥 Uzmanlar
            </button>
            <button 
              onClick={() => setActiveSubTab('career_tests')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'career_tests' ? 'bg-white text-slate-900 shadow-md font-black' : 'text-white/80 hover:text-white'}`}
            >
              🎯 Kariyer Testleri ({testSubmissions.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Toplam Başvuru</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900">{appointments.length}</h3>
            <span className="text-xs font-bold text-slate-500">Randevu</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-500" /> Aktif dönem talepleri
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group bg-gradient-to-br from-white via-amber-50/30 to-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Onay Bekleyenler</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-amber-600">
              {appointments.filter(a => a.status === 'Beklemede').length}
            </h3>
            <span className="text-xs font-bold text-amber-700/70">Beklemede</span>
          </div>
          <p className="text-[11px] text-amber-700/60 mt-2 flex items-center gap-1">
            <AlertCircle size={12} className="text-amber-500" /> Hızlı işlem gerektirir
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group bg-gradient-to-br from-white via-emerald-50/30 to-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Tamamlanan & Raporlanan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-emerald-600">
              {appointments.filter(a => a.evaluation).length}
            </h3>
            <span className="text-xs font-bold text-emerald-700/70">Görüşme</span>
          </div>
          <p className="text-[11px] text-emerald-700/60 mt-2 flex items-center gap-1">
            <Award size={12} className="text-emerald-500" /> Raporu girildi
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden group bg-gradient-to-br from-white via-purple-50/30 to-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">KGM Danışman Kadrosu</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-purple-600">2 Uzman</h3>
            <span className="text-xs font-bold text-purple-700/70">Görevde</span>
          </div>
          <p className="text-[11px] text-purple-700/60 mt-2 flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" /> Ort. 4.95 Memnuniyet
          </p>
        </div>

      </div>

      {/* ── TAB 1: APPOINTMENTS ── */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-4">
          
          {/* Controls Bar Card (Aydınlık & Ferah Kurumsal Tema) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-gradient-to-r from-white via-rose-50/30 to-white">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-2 rounded-xl bg-rose-100/80 text-[#990000] border border-rose-200/60 shadow-xs">
                  <Calendar size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-base tracking-tight">
                  Randevu Havuzu & Durum Yönetimi
                </h3>
              </div>
              <p className="text-xs text-slate-600 font-semibold pl-10 max-w-xl">
                Öğrenci randevularını yönetin, hızlı onay verin veya uzman değerlendirme raporunu doldurun.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-inner">
                {['HEPSİ', 'Beklemede', 'Onaylandı', 'Tamamlandı', 'İptal Edildi'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === st 
                        ? 'bg-[#990000] text-white shadow-md shadow-rose-950/20 font-black' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Öğrenci veya Danışman ara..." 
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Appointment Rich Cards List */}
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(a => (
              <div 
                key={a.id} 
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 group hover:border-rose-300 relative overflow-hidden"
              >
                {/* Left Accent Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  a.status === 'Beklemede' ? 'bg-amber-500' :
                  a.status === 'Onaylandı' ? 'bg-blue-600' :
                  a.status === 'Tamamlandı' ? 'bg-emerald-500' : 'bg-rose-500'
                }`} />

                {/* Main Info */}
                <div className="flex items-start sm:items-center gap-4 pl-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#990000] via-rose-800 to-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md border border-white/20">
                    {a.studentName.split(' ').map(n=>n[0]).join('')}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 
                        onClick={() => handleOpenEvaluation(a)}
                        className="font-black text-[#990000] text-sm hover:text-rose-700 cursor-pointer transition flex items-center gap-1.5"
                      >
                        {a.studentName}
                        <span className="text-[10px] font-mono text-slate-400 font-normal">({a.studentId})</span>
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200/60">
                        {a.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs flex-wrap">
                      <span className="font-bold text-slate-700">{a.department}</span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        <User size={13} className="text-indigo-500" /> Danışman: {a.counselor}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location & Time */}
                <div className="flex items-center gap-6 pl-2 lg:pl-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Clock size={14} className="text-[#990000]" />
                      <span className="text-slate-900 font-extrabold">{a.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium pl-5">{a.location}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <Badge status={a.status} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-end">
                  {a.status === 'Beklemede' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(a.id, 'Onaylandı')}
                        className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-600 hover:text-white transition text-xs font-black flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 size={14} /> Onayla
                      </button>
                      <button 
                        onClick={() => handleStatusChange(a.id, 'İptal Edildi')}
                        className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle size={14} /> İptal Et
                      </button>
                    </>
                  )}

                  {a.status === 'Onaylandı' && (
                    <button 
                      onClick={() => handleStatusChange(a.id, 'Tamamlandı')}
                      className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-600 hover:text-white transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={14} /> Tamamlandı İşaretle
                    </button>
                  )}

                  <button 
                    onClick={() => handleOpenEvaluation(a)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      a.evaluation 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-950/20' 
                        : 'bg-gradient-to-r from-[#990000] to-rose-800 text-white hover:scale-[1.02] shadow-rose-950/20'
                    }`}
                  >
                    <Edit3 size={14} /> 
                    {a.evaluation ? '✓ Değerlendirme Raporu Var' : '📝 Değerlendirme Yaz'}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ── TAB 2: EVALUATIONS ── */}
      {activeSubTab === 'evaluations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-base">Tamamlanan Değerlendirme Raporları</h3>
            <span className="text-xs text-slate-500">Toplam {appointments.filter(a => a.evaluation).length} onaylı rapor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.filter(a => a.evaluation).map(a => (
              <div key={a.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-[#990000] font-black text-sm flex items-center justify-center border border-rose-200">
                      {a.studentName.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{a.studentName}</h4>
                      <p className="text-xs text-slate-500">{a.department} • {a.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-xs font-black text-amber-700">{a.evaluation.rating}/5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Uzman Notu</p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 italic">
                    "{a.evaluation.evaluationNotes}"
                  </p>
                </div>

                {a.evaluation.actionPlan && (
                  <div>
                    <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Aksiyon Planı</p>
                    <p className="text-xs font-semibold text-emerald-900 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
                      🎯 {a.evaluation.actionPlan}
                    </p>
                  </div>
                )}

                {a.evaluation.verifiedSkills && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {a.evaluation.verifiedSkills.split(',').map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200">
                        ✓ {sk.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                  <span>Danışman: <strong>{a.evaluation.counselorName}</strong></span>
                  <span>{a.evaluation.evaluatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: COUNSELORS ── */}
      {activeSubTab === 'counselors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {counselorsList.map((c, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#990000] to-rose-700 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                {c.avatar}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-base">{c.name}</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">AKTER C-CERT</span>
                </div>
                <p className="text-xs font-medium text-slate-500">{c.title}</p>
                <p className="text-xs text-slate-400">{c.email}</p>

                <div className="flex items-center gap-4 pt-3 mt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Toplam Görüşme</span>
                    <span className="text-sm font-black text-slate-900">{c.totalAppts} Randevu</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Ortalama Puan</span>
                    <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                      <Star size={14} className="fill-amber-500 text-amber-500" /> {c.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 4: CAREER & COMPETENCY TEST SUBMISSIONS ── */}
      {activeSubTab === 'career_tests' && (
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#990000] bg-red-50 px-2.5 py-1 rounded-md inline-block mb-1">
                Yetkinlik & Kariyer Analiz Havuzu
              </span>
              <h3 className="text-xl font-black text-gray-900">Öğrenci Kariyer Testi Değerlendirme Sonuçları</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Öğrencilerin 8 kategorili Kariyer & Kişilik Testi yanıtları, analitik/yaratıcı eğilimleri ve kariyer danışmanlığı eşleşmeleri.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold">
                {testSubmissions.length} Tamamlanan Test
              </span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Öğrenci Bilgisi</th>
                  <th className="py-3.5 px-4">Bölüm</th>
                  <th className="py-3.5 px-4">Belirlenen Persona</th>
                  <th className="py-3.5 px-4">Yetkinlik Dağılımı</th>
                  <th className="py-3.5 px-4">Önerilen Patikalar</th>
                  <th className="py-3.5 px-4">Test Tarihi</th>
                  <th className="py-3.5 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {testSubmissions.map(sub => {
                  const percent = sub.scores?.percent || { logic: 25, creative: 25, social: 25, practical: 25 };
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-sm">{sub.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">No: {sub.studentId} • {sub.studentEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {sub.studentDept}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-gray-900 block text-xs">{sub.personaTitle}</span>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-rose-50 text-[#990000] text-[10px] font-bold rounded-md">
                          {sub.personaBadge}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold" title="Analitik / Mantık">
                            Analitik: %{percent.logic || 0}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold" title="Yaratıcı / Tasarım">
                            Yaratıcı: %{percent.creative || 0}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold" title="Sosyal / İletişim">
                            Sosyal: %{percent.social || 0}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold" title="Saha / Uygulama">
                            Pratik: %{percent.practical || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[11px] text-slate-600 line-clamp-2">
                          {(sub.recommendedPaths || []).join(', ')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(sub.submittedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedTestDetail(sub)}
                          className="px-3.5 py-1.5 bg-[#990000] hover:bg-red-800 text-white font-bold rounded-xl transition text-[11px] flex items-center gap-1 ml-auto shadow-2xs"
                        >
                          <Eye size={13} /> İncele & Danış
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CAREER TEST INSPECTION DETAIL MODAL ── */}
      {selectedTestDetail && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 flex items-center justify-center font-bold border border-white/20">
                  <Award size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-black uppercase rounded">
                      Kariyer & Yetkinlik Analiz Raporu
                    </span>
                    <span className="text-xs text-rose-200 font-mono">ID: {selectedTestDetail.id}</span>
                  </div>
                  <h3 className="font-black text-xl text-white">
                    {selectedTestDetail.studentName} ({selectedTestDetail.studentDept})
                  </h3>
                  <p className="text-xs text-rose-200">
                    Öğrenci No: {selectedTestDetail.studentId} • {selectedTestDetail.studentEmail}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTestDetail(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Persona Showcase */}
              <div className="p-5 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">Belirlenen Kariyer Profili</span>
                  <h4 className="text-lg font-black text-red-950 mt-0.5">{selectedTestDetail.personaTitle}</h4>
                  <p className="text-xs text-red-900 font-medium mt-1">{selectedTestDetail.personaBadge}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium">Test Tarihi</span>
                  <div className="text-sm font-black text-gray-900">
                    {new Date(selectedTestDetail.submittedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Score Breakdown Cards */}
              <div>
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">4 Temel Yetkinlik Dağılımı</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-blue-700 block">Analitik / Mantık</span>
                    <strong className="text-xl font-black text-blue-900">%{selectedTestDetail.scores?.percent?.logic || 0}</strong>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-amber-700 block">Yaratıcı / Vizyoner</span>
                    <strong className="text-xl font-black text-amber-900">%{selectedTestDetail.scores?.percent?.creative || 0}</strong>
                  </div>
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-emerald-700 block">Sosyal / İletişim</span>
                    <strong className="text-xl font-black text-emerald-900">%{selectedTestDetail.scores?.percent?.social || 0}</strong>
                  </div>
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-center">
                    <span className="text-[11px] font-bold text-purple-700 block">Saha / Uygulama</span>
                    <strong className="text-xl font-black text-purple-900">%{selectedTestDetail.scores?.percent?.practical || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Recommended Career Paths */}
              <div>
                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Önerilen Kariyer Patikaları</h5>
                <div className="flex flex-wrap gap-2">
                  {(selectedTestDetail.recommendedPaths || []).map((path, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200">
                      🎯 {path}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Clubs & Mentors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Eşleşen Öğrenci Kulüpleri</h5>
                  <div className="space-y-1 text-xs text-slate-700">
                    {(selectedTestDetail.recommendedClubs || ['İESÜ Yazılım ve İnovasyon Kulübü']).map((clb, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-bold">
                        <CheckCircle size={13} className="text-emerald-600" /> {clb}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h5 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Danışman Değerlendirme Notu</h5>
                  <p className="text-xs text-slate-600 italic">
                    {selectedTestDetail.counselorNotes || 'Öğrencinin yetkinlik analizi tamamlanmış olup KGM bire bir danışmanlık randevusuna uygundur.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedTestDetail(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  toast.success(`${selectedTestDetail.studentName} için KGM Bire Bir Danışmanlık Randevusu oluşturuldu.`);
                  setSelectedTestDetail(null);
                }}
                className="px-5 py-2 bg-[#990000] hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Calendar size={14} /> Bire Bir Randevu Ata
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── STAFF EVALUATION MODAL ── */}
      {selectedAppt && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] relative">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 flex items-center justify-center font-bold border border-white/20">
                  <UserCheck size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Görüşme Değerlendirme & Raporlama</h3>
                  <p className="text-xs text-rose-200/90 font-medium">
                    {selectedAppt.studentName} ({selectedAppt.department}) - {selectedAppt.type}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedAppt(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEvaluation} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Değerlendiren Akademik Uzman / Personel</label>
                <input 
                  type="text" 
                  value={evaluationForm.counselorName} 
                  onChange={e => setEvaluationForm({...evaluationForm, counselorName: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Öğrenci Yetkinlik & Görüşme Puanı (1-5 Yıldız)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setEvaluationForm({...evaluationForm, rating: star})}
                      className="p-1 cursor-pointer transition transform hover:scale-110"
                    >
                      <Star size={24} className={star <= evaluationForm.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                    </button>
                  ))}
                  <span className="text-xs font-black text-amber-600 ml-2">{evaluationForm.rating} / 5 Yıldız</span>
                </div>
              </div>

              {/* Evaluation Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Akademisyen / Uzman Değerlendirme Notu</label>
                <textarea
                  rows={4}
                  value={evaluationForm.evaluationNotes}
                  onChange={e => setEvaluationForm({...evaluationForm, evaluationNotes: e.target.value})}
                  placeholder="Görüşme sonunda öğrencinin güçlü yönleri, CV ve portfolyo durumu hakkındaki uzman görüşünüzü yazın..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#990000] focus:bg-white transition"
                  required
                />
              </div>

              {/* Action Plan */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Aksiyon Planı & Sonraki Adım Önerileri</label>
                <input
                  type="text"
                  value={evaluationForm.actionPlan}
                  onChange={e => setEvaluationForm({...evaluationForm, actionPlan: e.target.value})}
                  placeholder="Örn: Aselsan staj başvurusu yapacak, 1 hafta sonra kontrol edilecek..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Verified Skills */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Onaylanan Yetenekler & Rozetler (Virgülle ayırın)</label>
                <input
                  type="text"
                  value={evaluationForm.verifiedSkills}
                  onChange={e => setEvaluationForm({...evaluationForm, verifiedSkills: e.target.value})}
                  placeholder="Örn: React, Proje Yönetimi, İngilizce B2"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAppt(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#990000] via-rose-900 to-slate-900 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-950/20 hover:scale-[1.02] transition cursor-pointer flex items-center gap-2"
                >
                  <Send size={14} /> Değerlendirmeyi Kaydet
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}
