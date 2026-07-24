import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { Database, Download, Search, Activity, Server, Users, FlaskConical, Ticket, FileText, CheckCircle2, Filter, Layers, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';

export default function CMSDataPoolExport() {
  const [subTab, setSubTab] = useState('bmi'); // bmi, helpdesk, clubs, labs, events, surveys
  const [search, setSearch] = useState('');

  const bmiRecords = useAppStore(state => state.bmiRecords) || [];
  const helpdeskTickets = useAppStore(state => state.helpdeskTickets) || [];
  const clubApplications = useAppStore(state => state.clubApplications) || [];
  const labReservations = useAppStore(state => state.labReservations) || [];
  const eventRegistrations = useAppStore(state => state.eventRegistrations) || [];
  const surveys = useAppStore(state => state.surveys) || [];

  // UTF-8 BOM CSV / Excel Export Engine
  const exportToExcel = (dataArray, filename) => {
    if (!dataArray || dataArray.length === 0) {
      window.toast && window.toast.error("Dışa aktarılacak veri bulunamadı.");
      return;
    }

    const headers = Object.keys(dataArray[0]);
    const csvRows = [];
    
    // Add Headers
    csvRows.push(headers.join(';'));

    // Add Rows
    for (const row of dataArray) {
      const values = headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(';'));
    }

    // Add UTF-8 BOM for Microsoft Excel Turkish character support
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.toast && window.toast.success(`"${filename}" Excel/CSV dosyası başarıyla indirildi.`);
  };

  const totalPoolRecords = bmiRecords.length + helpdeskTickets.length + clubApplications.length + labReservations.length + eventRegistrations.length + surveys.length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Premium Dark Glassmorphism Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-800/60 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider text-indigo-300 mb-3 shadow-inner">
              <Database size={14} className="text-indigo-400" />
              Kurumsal Merkezi Veri Havuzu & Excel Motoru
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Veri Havuzu & Excel
            </h2>
            <p className="text-slate-300 text-xs md:text-sm font-medium mt-1.5 max-w-2xl leading-relaxed">
              Öğrenciler, akademisyenler ve mezunların sisteme gönderdiği tüm verileri canlı havuzda izleyin ve Microsoft Excel formatında indirin.
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Toplam Havuz Kaydı</span>
              <span className="text-xl font-black text-white mt-0.5 block">{totalPoolRecords}</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Aktif Veri Kanalları</span>
              <span className="text-xl font-black text-indigo-400 mt-0.5 block">6 Havuz</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Excel Uyum Formatı</span>
              <span className="text-xs font-black text-emerald-400 mt-1 block">UTF-8 BOM (.csv/.xlsx)</span>
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Navigation Pills */}
        <div className="flex flex-wrap gap-2.5 mt-8 border-t border-slate-800/80 pt-6">
          <button 
            onClick={() => { setSubTab('bmi'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'bmi' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Activity size={15} /> BMI & Sağlık ({bmiRecords.length})
          </button>
          <button 
            onClick={() => { setSubTab('helpdesk'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'helpdesk' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Server size={15} /> BİDB Destek Biletleri ({helpdeskTickets.length})
          </button>
          <button 
            onClick={() => { setSubTab('clubs'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'clubs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Users size={15} /> Kulüp Başvuruları ({clubApplications.length})
          </button>
          <button 
            onClick={() => { setSubTab('labs'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'labs' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FlaskConical size={15} /> Ar-Ge Lab Rezervasyonları ({labReservations.length})
          </button>
          <button 
            onClick={() => { setSubTab('events'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'events' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Ticket size={15} /> Etkinlik Bilet Kayıtları ({eventRegistrations.length})
          </button>
          <button 
            onClick={() => { setSubTab('surveys'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'surveys' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FileText size={15} /> Mezun Memnuniyet Anketleri ({surveys.length})
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">

        {/* SUB-PANEL 1: BMI & HEALTH */}
        {subTab === 'bmi' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Öğrenci adı veya kategori ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(bmiRecords, 'IESU_Ogrenci_BMI_ve_Saglik_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Kayıt No</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">Boy / Kilo</th>
                    <th className="p-3.5">BMI Değeri</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Diyetisyen Randevusu</th>
                    <th className="p-3.5">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {bmiRecords.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())).map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-indigo-600 font-black">{r.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{r.name}</td>
                      <td className="p-3.5 font-medium">{r.height} cm / {r.weight} kg</td>
                      <td className="p-3.5 font-black text-slate-900">{r.bmi} kg/m²</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-emerald-200">{r.category}</span></td>
                      <td className="p-3.5">{r.dietitianRequested ? <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Randevu İstendi</span> : <span className="text-slate-400">Hayır</span>}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL 2: HELPDESK TICKETS */}
        {subTab === 'helpdesk' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Bilet konusu veya kişi ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(helpdeskTickets, 'IESU_BIDB_Teknik_Destek_Biletleri')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Bilet No</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">E-Posta</th>
                    <th className="p-3.5">Konu</th>
                    <th className="p-3.5">Durum</th>
                    <th className="p-3.5">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {helpdeskTickets.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())).map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-indigo-600 font-black">{t.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{t.name}</td>
                      <td className="p-3.5 text-slate-600 font-medium">{t.email}</td>
                      <td className="p-3.5 font-bold text-slate-900">{t.subject}</td>
                      <td className="p-3.5"><span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-indigo-200">{t.status}</span></td>
                      <td className="p-3.5 text-slate-500 font-medium">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL 3: CLUB APPLICATIONS */}
        {subTab === 'clubs' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Kulüp veya öğrenci ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(clubApplications, 'IESU_Kulup_Basvuru_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Başvuru No</th>
                    <th className="p-3.5">Öğrenci Adı</th>
                    <th className="p-3.5">Kulüp Adı</th>
                    <th className="p-3.5">Bölüm</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {clubApplications.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.clubName.toLowerCase().includes(search.toLowerCase())).map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-indigo-600 font-black">{c.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3.5 text-indigo-600 font-bold">{c.clubName}</td>
                      <td className="p-3.5">{c.department}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{c.date}</td>
                      <td className="p-3.5"><span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-amber-200">{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL 4: LAB RESERVATIONS */}
        {subTab === 'labs' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Lab veya araştırmacı ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(labReservations, 'IESU_ArGe_Lab_Rezervasyon_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Rezervasyon No</th>
                    <th className="p-3.5">Araştırmacı</th>
                    <th className="p-3.5">Laboratuvar Adı</th>
                    <th className="p-3.5">Zaman Dilimi</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {labReservations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.labName.toLowerCase().includes(search.toLowerCase())).map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-indigo-600 font-black">{l.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{l.name}</td>
                      <td className="p-3.5 font-bold text-indigo-600">{l.labName}</td>
                      <td className="p-3.5">{l.timeSlot}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{l.date}</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-emerald-200">{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL 5: EVENT REGISTRATIONS */}
        {subTab === 'events' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Etkinlik veya bilet sahibi ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(eventRegistrations, 'IESU_Etkinlik_Bilet_Kayitlari')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Bilet Kodu</th>
                    <th className="p-3.5">Katılımcı Adı</th>
                    <th className="p-3.5">Etkinlik Başlığı</th>
                    <th className="p-3.5">Tarih</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {eventRegistrations.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.eventTitle.toLowerCase().includes(search.toLowerCase())).map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-indigo-600 font-black">{e.ticketCode || e.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{e.name}</td>
                      <td className="p-3.5 font-bold text-slate-900">{e.eventTitle}</td>
                      <td className="p-3.5 text-slate-500 font-medium">{e.date}</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-emerald-200">{e.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-PANEL 6: SURVEYS */}
        {subTab === 'surveys' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Anket başlığı ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(surveys, 'IESU_Mezun_Memnuniyet_Anketleri')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Anket No</th>
                    <th className="p-3.5">Anket Başlığı</th>
                    <th className="p-3.5">Katılım Sayısı</th>
                    <th className="p-3.5">Memnuniyet Skoru</th>
                    <th className="p-3.5">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {surveys.filter(s => s.title.toLowerCase().includes(search.toLowerCase())).map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-indigo-600 font-black">{s.id}</td>
                      <td className="p-3.5 font-bold text-slate-900">{s.title}</td>
                      <td className="p-3.5 font-bold">{s.responsesCount || '142'} Yanıt</td>
                      <td className="p-3.5 font-black text-emerald-600">%94.8 İdeal</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-black text-[10px] uppercase border border-emerald-200">Yayında</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
