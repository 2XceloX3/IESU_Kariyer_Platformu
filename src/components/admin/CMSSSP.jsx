import React, { useState } from 'react';
import { Card, Badge } from './AdminShared';
import {
  GraduationCap, Building2, Calendar, BarChart2, Target, Settings,
  FileSpreadsheet, ShieldCheck, Plus, Download, CheckCircle2,
  AlertCircle, BookOpen, Search, Filter, Award, Users, Briefcase,
  TrendingUp, Check, ExternalLink
} from 'lucide-react';
import { toast } from '../shared/Toast';
import useAppStore from '../../store/useAppStore';

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-8 w-14 rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );
}

function CvBar({ pct }) {
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 51 ? 'bg-orange-400' : 'bg-red-500';
  const textColor = pct >= 80 ? 'text-emerald-600' : pct >= 51 ? 'text-orange-500' : 'text-red-600';
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-black ${textColor}`}>{pct}%</span>
    </div>
  );
}

function NetworkBadge({ strength }) {
  const map = {
    'Zayıf': 'bg-red-100 text-red-700',
    'Orta': 'bg-orange-100 text-orange-700',
    'Güçlü': 'bg-teal-100 text-teal-700',
    'Çok Güçlü': 'bg-emerald-100 text-emerald-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${map[strength] || 'bg-gray-100 text-gray-700'}`}>
      {strength}
    </span>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  const colors = {
    red:   'bg-red-50/80 border-red-100 text-red-900',
    teal:  'bg-teal-50/80 border-teal-100 text-teal-900',
    blue:  'bg-blue-50/80 border-blue-100 text-blue-900',
    amber: 'bg-amber-50/80 border-amber-100 text-amber-900',
  };
  return (
    <div className={`rounded-2xl border p-4 flex items-center justify-between shadow-xs ${colors[color] || colors.red}`}>
      <div>
        <span className="block text-2xl font-black">{value}</span>
        <span className="text-xs font-bold text-gray-600">{label}</span>
      </div>
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center text-current shadow-xs">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}

export default function CMSSSP({ sspEnabled, setSspEnabled, sspUsers, setSspUsers }) {
  const kgbStudentRecords = useAppStore(s => s.kgbStudentRecords) || [];
  const kgbAlumniRecords  = useAppStore(s => s.kgbAlumniRecords)  || [];
  const kgbEnabled        = useAppStore(s => s.kgbEnabled);
  const setKgbEnabled     = useAppStore(s => s.setKgbEnabled);

  const [activePool, setActivePool] = useState('ogrenci_dal');

  const [events, setEvents] = useState([
    { id: 'E1', title: 'İleri Seviye React Workshop', date: '2024-04-10', category: 'Teknik Beceri', quota: 30, type: 'Workshop', status: 'Aktif' },
    { id: 'E2', title: 'Sektör Profesyonelleri ile Networking', date: '2024-04-18', category: 'Ağ Kurma', quota: 80, type: 'Panel', status: 'Aktif' },
    { id: 'E3', title: 'Kariyer Günü 2024 & İstihdam Fuarı', date: '2024-05-05', category: 'Mesleki Gelişim', quota: 500, type: 'Kariyer Günü', status: 'Planlama' },
  ]);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate]   = useState('');
  const [evtCat, setEvtCat]     = useState('Mesleki Gelişim');
  const [evtQuota, setEvtQuota] = useState(50);
  const [evtType, setEvtType]   = useState('Workshop');
  const [showEvtForm, setShowEvtForm] = useState(false);

  const departments = ['Tümü', ...Array.from(new Set(kgbStudentRecords.map(r => r.department)))];
  const [deptFilter, setDeptFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = kgbStudentRecords.filter(r => {
    const matchesDept = deptFilter === 'Tümü' || r.department === deptFilter;
    const matchesSearch = searchQuery === '' || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const [minInternship, setMinInternship]   = useState(1);
  const [minCert, setMinCert]               = useState(2);
  const [minWorkshop, setMinWorkshop]       = useState(5);
  const [minCv, setMinCv]                   = useState(70);
  const [minMentoringAlumni, setMinMentoringAlumni] = useState(4);
  const [minEventsAlumni, setMinEventsAlumni]       = useState(2);

  const [kvkkEnabled, setKvkkEnabled]       = useState(true);
  const [showStudentKgb, setShowStudentKgb] = useState(true);
  const [showAlumniKgb, setShowAlumniKgb]   = useState(true);

  const handleExportSPSS = () => {
    toast.info('Veriler SPSS & Excel formatında (CSV) hazırlanıyor...');
    setTimeout(() => {
      const rows = kgbStudentRecords.map(r =>
        `"${r.id}","${r.name}","${r.department}",${r.internships},${r.certifications},${r.workshopsAttended},${r.mentorMeetings},${r.cvCompleteness},"${r.targetSector}"`
      ).join('\n');
      const csvContent = `\uFEFF"Öğrenci No","Ad Soyad","Bölüm","Staj","Sertifika","Workshop","Mentörlük","CV Doluluk","Hedef Sektör"\n${rows}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'iesu_kgb_kariyer_verileri.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('SPSS veri dosyası başarıyla indirildi!');
    }, 1200);
  };

  const navItems = [
    { id: 'ogrenci_dal',     icon: <GraduationCap size={18}/>, label: 'Öğrenci KGB Takibi' },
    { id: 'mezun_dal',       icon: <Building2 size={18}/>,     label: 'Mezun KGB Takibi' },
    { id: 'etkinlik_havuzu', icon: <Calendar size={18}/>,      label: 'Etkinlik & Workshop Havuzu' },
    { id: 'raporlama',       icon: <BarChart2 size={18}/>,     label: 'KGB Raporlama & Çıktı' },
    { id: 'hedef_kriterleri',icon: <Target size={18}/>,        label: 'Kariyer Hedef Kriterleri' },
    { id: 'ayarlar',         icon: <Settings size={18}/>,      label: 'KGB Sistem Ayarları' },
  ];

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-6 max-w-[1400px]">
      
      {/* SOL MENÜ */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="bg-gradient-to-br from-red-950 via-slate-900 to-red-900 rounded-2xl p-5 text-white shadow-lg border border-red-800/30">
          <BookOpen className="text-amber-400 w-10 h-10 mb-3" />
          <h2 className="text-xl font-black leading-tight">KGB Yönetim Merkezi</h2>
          <p className="text-xs text-red-200/80 mt-1">Kariyer Gelişim Belgesi & Yetkinlik Akreditasyonu</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePool(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all text-left ${
                activePool === item.id 
                  ? 'bg-red-50 text-red-700 shadow-xs' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SAĞ İÇERİK ALANI */}
      <div className="flex-1 space-y-6 min-w-0">

        {/* 1. ÖĞRENCİ KARIYER GELİŞİM DALI */}
        {activePool === 'ogrenci_dal' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Aktif Öğrenci Portföyü" value={kgbStudentRecords.length} color="red" icon={GraduationCap} />
              <StatCard 
                label="Ortalama CV Doluluğu" 
                value={`${Math.round(kgbStudentRecords.reduce((a,r)=>a+r.cvCompleteness,0)/Math.max(1,kgbStudentRecords.length))}%`} 
                color="teal" 
                icon={TrendingUp} 
              />
              <StatCard label="Onaylı Staj Deneyimi" value={kgbStudentRecords.reduce((a,r)=>a+r.internships,0)} color="blue" icon={Briefcase} />
              <StatCard label="Tamamlanan Workshop" value={kgbStudentRecords.reduce((a,r)=>a+r.workshopsAttended,0)} color="amber" icon={Award} />
            </div>

            <Card className="p-6">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Öğrenci Kariyer Gelişim Dosyaları</h3>
                  <p className="text-xs text-gray-500">Öğrencilerin doğrulanmış staj, sertifika, workshop ve mentörlük karneleri.</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Öğrenci ara..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <select 
                    value={deptFilter} 
                    onChange={e => setDeptFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-red-500 bg-white"
                  >
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <button 
                    type="button"
                    onClick={handleExportSPSS}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition active:scale-95 shadow-xs"
                  >
                    <FileSpreadsheet size={15}/> SPSS / Excel İndir
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Öğrenci Ad Soyad','Bölüm','Staj','Sertifika','Workshop','Mentörlük','CV Doluluğu','Son İşlem','KGB Belgesi'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredStudents.map(r => (
                      <tr key={r.id} className="hover:bg-red-50/30 transition">
                        <td className="py-3 px-3 font-black text-gray-900 whitespace-nowrap">{r.name}</td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap text-xs">{r.department}</td>
                        <td className="py-3 px-3 text-center font-bold text-red-700">{r.internships}</td>
                        <td className="py-3 px-3 text-center font-bold text-blue-700">{r.certifications}</td>
                        <td className="py-3 px-3 text-center font-bold text-purple-700">{r.workshopsAttended}</td>
                        <td className="py-3 px-3 text-center font-bold text-teal-700">{r.mentorMeetings}</td>
                        <td className="py-3 px-3"><CvBar pct={r.cvCompleteness}/></td>
                        <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">{r.lastActivity}</td>
                        <td className="py-3 px-3">
                          <button 
                            type="button"
                            onClick={() => toast.success(`${r.name} için resmi KGB Kariyer Belgesi hazırlandı!`)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs transition whitespace-nowrap border border-red-100"
                          >
                            <Download size={13}/> Belgeyi Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 2. MEZUN KARIYER KATKI DALI */}
        {activePool === 'mezun_dal' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Aktif Mezun Mentör" value={kgbAlumniRecords.length} color="teal" icon={Users} />
              <StatCard label="Toplam Mentörlük Seansı" value={kgbAlumniRecords.reduce((a,r)=>a+r.mentoringSessions,0)} color="blue" icon={Award} />
              <StatCard label="Paylaşılan Kariyer Fırsatı" value={kgbAlumniRecords.reduce((a,r)=>a+r.jobsShared,0)} color="amber" icon={Briefcase} />
              <StatCard label="Aktif Mezun Kartı" value={kgbAlumniRecords.filter(r=>r.alumniCardActive).length} color="red" icon={ShieldCheck} />
            </div>

            <Card className="p-6">
              <div className="mb-6">
                <h3 className="font-black text-gray-900 text-lg">Mezun Kariyer Katkı & Mentörlük Karnesi</h3>
                <p className="text-xs text-gray-500">Üniversite mezunlarının öğrenci istihdamına ve ekosisteme sağladığı sektörel destekler.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Mezun Adı','Mezuniyet','Bölüm','Mevcut Görev','Şirket','Mentörlük','İş İlanı','Etkinlik','Mentee','Mezun Kartı','Ağ Etki Seviyesi'].map(h => (
                        <th key={h} className="text-left py-3 px-3 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {kgbAlumniRecords.map(r => (
                      <tr key={r.id} className="hover:bg-teal-50/30 transition">
                        <td className="py-3 px-3 font-black text-gray-900 whitespace-nowrap">{r.name}</td>
                        <td className="py-3 px-3 text-gray-600 font-bold">{r.graduationYear}</td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap text-xs">{r.department}</td>
                        <td className="py-3 px-3 text-teal-800 font-bold whitespace-nowrap">{r.currentPosition}</td>
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap text-xs">{r.company}</td>
                        <td className="py-3 px-3 text-center font-black text-blue-700">{r.mentoringSessions}</td>
                        <td className="py-3 px-3 text-center font-black text-purple-700">{r.jobsShared}</td>
                        <td className="py-3 px-3 text-center font-black text-amber-700">{r.eventsAttended}</td>
                        <td className="py-3 px-3 text-center font-black text-red-700">{r.menteeCount}</td>
                        <td className="py-3 px-3 text-center">
                          {r.alumniCardActive ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                              <CheckCircle2 size={16} /> Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-400 font-bold text-xs">
                              <AlertCircle size={16} /> Yok
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3"><NetworkBadge strength={r.networkStrength}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 3. ETKİNLİK VE WORKSHOP HAVUZU */}
        {activePool === 'etkinlik_havuzu' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-6 border-t-4 border-red-500">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">KGB Kredili Etkinlik & Workshop Havuzu</h3>
                  <p className="text-xs text-gray-500">Öğrencilerin kariyer gelişim karnesine doğrudan işlenen akredite etkinlikler.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEvtForm(!showEvtForm)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition"
                >
                  <Plus size={16}/> {showEvtForm ? 'Formu Kapat' : 'Yeni Etkinlik Tanımla'}
                </button>
              </div>

              {showEvtForm && (
                <div className="mb-6 p-5 bg-red-50/60 border border-red-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Etkinlik Başlığı</label>
                    <input 
                      type="text" 
                      value={evtTitle} 
                      onChange={e=>setEvtTitle(e.target.value)} 
                      placeholder="Örn: Python ile Veri Analizi"
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Tarih</label>
                    <input 
                      type="date" 
                      value={evtDate} 
                      onChange={e=>setEvtDate(e.target.value)} 
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">KGB Yetkinlik Kategorisi</label>
                    <select 
                      value={evtCat} 
                      onChange={e=>setEvtCat(e.target.value)} 
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white font-bold"
                    >
                      {['Mesleki Gelişim','Ağ Kurma','Teknik Beceri','Liderlik'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Kontenjan</label>
                    <input 
                      type="number" 
                      value={evtQuota} 
                      onChange={e=>setEvtQuota(Number(e.target.value))} 
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white font-bold" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Etkinlik Türü</label>
                    <select 
                      value={evtType} 
                      onChange={e=>setEvtType(e.target.value)} 
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white font-bold"
                    >
                      {['Workshop','Panel','Kariyer Günü','Staj Fuarı'].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="button"
                      onClick={() => {
                        if (!evtTitle || !evtDate) { toast.error('Başlık ve tarih alanları zorunludur!'); return; }
                        setEvents(prev => [...prev, { id: `E${Date.now()}`, title: evtTitle, date: evtDate, category: evtCat, quota: evtQuota, type: evtType, status: 'Aktif' }]);
                        setEvtTitle(''); setEvtDate(''); setShowEvtForm(false);
                        toast.success('Etkinlik KGB Havuzuna başarıyla eklendi!');
                      }} 
                      className="w-full bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-700 transition"
                    >
                      Kayıt & Yayınla
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Kod','Etkinlik Adı','Tarih','KGB Kategorisi','Format','Kontenjan','Durum'].map(h=>(
                        <th key={h} className="text-left py-3 px-3 text-[11px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3 text-xs font-bold text-gray-400">{e.id}</td>
                        <td className="py-3 px-3 font-black text-gray-900">{e.title}</td>
                        <td className="py-3 px-3 text-gray-600 text-xs">{e.date}</td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-bold border border-red-100">
                            {e.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-600 font-medium">{e.type}</td>
                        <td className="py-3 px-3 text-center font-bold text-gray-700">{e.quota}</td>
                        <td className="py-3 px-3"><Badge status={e.status === 'Aktif' ? 'Aktif' : 'Beklemede'} label={e.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 4. RAPORLAMA VE ÇIKTI */}
        {activePool === 'raporlama' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Kayıtlı Öğrenci Portföyü" value={kgbStudentRecords.length} color="red" icon={GraduationCap} />
              <StatCard label="Mezun Ağı Büyüklüğü" value={kgbAlumniRecords.length} color="teal" icon={Building2} />
              <StatCard label="Aktif Mentörlük Eşleşmesi" value={kgbAlumniRecords.reduce((a,r)=>a+r.menteeCount,0)} color="blue" icon={Users} />
              <StatCard label="Bu Çeyrekteki Etkinlik" value={events.filter(e=>e.status==='Aktif').length} color="amber" icon={Calendar} />
            </div>

            <Card className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <button 
                  type="button"
                  onClick={handleExportSPSS}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-xs"
                >
                  <FileSpreadsheet size={16}/> SPSS / Excel Raporu İndir
                </button>
                <button 
                  type="button"
                  onClick={() => { 
                    toast.info('Resmi YÖK / Kurumsal Akreditasyon PDF raporu oluşturuluyor...'); 
                    setTimeout(()=>toast.success('IESU_KGB_Kariyer_Akreditasyon_Raporu_2024.pdf indirildi!'), 1500); 
                  }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-xs"
                >
                  <Download size={16}/> Resmi PDF Raporu Oluştur
                </button>
              </div>

              <h3 className="font-black text-gray-900 mb-4">Bölümlere Göre İstihdam & Kariyer Aktivite Dağılımı</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Bölüm','Öğrenci Sayısı','Toplam Staj Deneyimi','Kazanılan Sertifika','Ort. CV Doluluğu'].map(h=>(
                        <th key={h} className="text-left py-3 px-3 text-[11px] font-black text-gray-500 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {Array.from(new Set(kgbStudentRecords.map(r=>r.department))).map(dept => {
                      const rows = kgbStudentRecords.filter(r=>r.department===dept);
                      return (
                        <tr key={dept} className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-bold text-gray-900">{dept}</td>
                          <td className="py-3 px-3 text-center font-bold text-gray-700">{rows.length}</td>
                          <td className="py-3 px-3 text-center font-black text-red-700">{rows.reduce((a,r)=>a+r.internships,0)}</td>
                          <td className="py-3 px-3 text-center font-black text-blue-700">{rows.reduce((a,r)=>a+r.certifications,0)}</td>
                          <td className="py-3 px-3"><CvBar pct={Math.round(rows.reduce((a,r)=>a+r.cvCompleteness,0)/rows.length)}/></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* 5. HEDEF VE MEZUNİYET KRİTERLERİ */}
        {activePool === 'hedef_kriterleri' && (
          <div className="space-y-6 animate-fade-in max-w-3xl">
            <Card className="p-6 border-t-4 border-red-500">
              <h3 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
                <GraduationCap size={20} className="text-red-600"/> Öğrenci Mezuniyet & Kariyer Kriterleri
              </h3>
              <p className="text-xs text-gray-500 mb-6">KGB Resmi Kariyer Belgesi hak edişi için asgari öğrenci hedefleri.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Asgari Staj Sayısı',   value: minInternship, setter: setMinInternship },
                  { label: 'Asgari Sertifika',     value: minCert,       setter: setMinCert },
                  { label: 'Asgari Workshop',      value: minWorkshop,   setter: setMinWorkshop },
                ].map(({label,value,setter}) => (
                  <div key={label}>
                    <label className="text-sm font-bold text-gray-700 block mb-2">{label}</label>
                    <input 
                      type="number" 
                      min={0} 
                      value={value} 
                      onChange={e=>setter(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl p-3 font-bold focus:outline-none focus:border-red-500 bg-white" 
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">
                    Asgari CV Doluluğu: <span className="text-red-600 font-black">{minCv}%</span>
                  </label>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={minCv} 
                    onChange={e=>setMinCv(Number(e.target.value))} 
                    className="w-full accent-red-600" 
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-t-4 border-teal-500">
              <h3 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-2">
                <Building2 size={20} className="text-teal-600"/> Mezun Katkı Beklentileri
              </h3>
              <p className="text-xs text-gray-500 mb-6">Aktif Mezun Mentör Kartı için tavsiye edilen yıllık asgari katkılar.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: 'Yıllık Min. Mentörlük Seansı', value: minMentoringAlumni, setter: setMinMentoringAlumni },
                  { label: 'Yıllık Min. Etkinlik Katılımı', value: minEventsAlumni,   setter: setMinEventsAlumni },
                ].map(({label,value,setter}) => (
                  <div key={label}>
                    <label className="text-sm font-bold text-gray-700 block mb-2">{label}</label>
                    <input 
                      type="number" 
                      min={0} 
                      value={value} 
                      onChange={e=>setter(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl p-3 font-bold focus:outline-none focus:border-teal-500 bg-white" 
                    />
                  </div>
                ))}
              </div>
            </Card>

            <button 
              type="button"
              onClick={() => toast.success('Hedef kriterleri başarıyla kaydedildi!')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md"
            >
              Kriterleri Kaydet
            </button>
          </div>
        )}

        {/* 6. SİSTEM AYARLARI */}
        {activePool === 'ayarlar' && (
          <Card className="p-6 animate-fade-in border-t-4 border-slate-700 max-w-2xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={24} className="text-slate-700"/> KGB Sistem & KVKK Ayarları
            </h3>
            {[
              { 
                label: 'KVKK Aydınlatma Metni Eki', 
                desc: 'Etkinlik ve kariyer başvurularında yasal aydınlatma zorunluluğu.', 
                value: kvkkEnabled, 
                setter: setKvkkEnabled 
              },
              { 
                label: 'KGB Sistemi Aktif', 
                desc: 'Kariyer Gelişim Belgesi sistemini tüm platformda etkinleştir veya devre dışı bırak.', 
                value: !!kgbEnabled, 
                setter: (v) => { 
                  setKgbEnabled(v); 
                  if (setSspEnabled) setSspEnabled(v); 
                } 
              },
              { 
                label: 'Öğrenci Akışında KGB Göster', 
                desc: 'Öğrenci akışında ve analitiğinde kişisel KGB profil kartını göster.', 
                value: showStudentKgb, 
                setter: setShowStudentKgb 
              },
              { 
                label: 'Mezun Akışında KGB Göster', 
                desc: 'Mezun akışında sektörel katkı ve mentörlük karnesi widgetını göster.', 
                value: showAlumniKgb, 
                setter: setShowAlumniKgb 
              },
            ].map(({ label, desc, value, setter }) => (
              <div key={label} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                </div>
                <Toggle value={value} onChange={setter} />
              </div>
            ))}
          </Card>
        )}

      </div>
    </div>
  );
}
