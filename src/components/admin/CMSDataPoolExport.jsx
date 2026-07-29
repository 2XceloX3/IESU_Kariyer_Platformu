import React, { useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { Database, Download, Search, Activity, Server, Users, FlaskConical, Ticket, FileText, CheckCircle2, Filter, Layers, ArrowUpRight, Sparkles, RefreshCw } from 'lucide-react';

export default function CMSDataPoolExport() {
  const [subTab, setSubTab] = useState('checkup'); // checkup, newsletter, bmi, helpdesk, clubs, labs, events, surveys
  const [search, setSearch] = useState('');
  const [selectedCheckup, setSelectedCheckup] = useState(null);

  const bmiRecords = useAppStore(state => state.bmiRecords) || [];
  const helpdeskTickets = useAppStore(state => state.helpdeskTickets) || [];
  const clubApplications = useAppStore(state => state.clubApplications) || [];
  const labReservations = useAppStore(state => state.labReservations) || [];
  const eventRegistrations = useAppStore(state => state.eventRegistrations) || [];
  const surveys = useAppStore(state => state.surveys) || [];
  const checkupRecords = useAppStore(state => state.checkupRecords) || [];
  const newsletterSubscribers = useAppStore(state => state.newsletterSubscribers) || [];

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

  const totalPoolRecords = checkupRecords.length + bmiRecords.length + helpdeskTickets.length + clubApplications.length + labReservations.length + eventRegistrations.length + surveys.length + newsletterSubscribers.length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Vibrant Fresh Glassmorphism Hero Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-teal-500/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow-sm">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white">
                <Database size={26} />
              </div>
              Veri Havuzu & Excel
            </h2>
            <p className="text-teal-50 text-xs md:text-sm font-medium mt-2 max-w-2xl leading-relaxed">
              Öğrenciler, akademisyenler ve mezunların sisteme gönderdiği tüm verileri canlı havuzda izleyin ve Microsoft Excel formatında indirin.
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">Toplam Havuz Kaydı</span>
              <span className="text-xl font-black text-white mt-0.5 block">{totalPoolRecords}</span>
            </div>
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">Aktif Veri Kanalları</span>
              <span className="text-xl font-black text-white mt-0.5 block">7 Havuz</span>
            </div>
            <div className="bg-white/15 border border-white/30 backdrop-blur-md p-3.5 rounded-2xl col-span-2 sm:col-span-1 text-white shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-100 block">Excel Uyum Formatı</span>
              <span className="text-xs font-black text-amber-200 mt-1 block">UTF-8 BOM (.csv/.xlsx)</span>
            </div>
          </div>
        </div>

        {/* Inner Sub-Tabs Navigation Pills */}
        <div className="flex flex-wrap gap-2.5 mt-8 border-t border-white/25 pt-6">
          <button 
            onClick={() => { setSubTab('checkup'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'checkup' ? 'bg-[#990000] text-white shadow-lg scale-105 border border-red-500' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}
          >
            <Sparkles size={15} /> 🧭 Kariyer Check-up Havuzu
          </button>
          <button 
            onClick={() => { setSubTab('newsletter'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'newsletter' ? 'bg-white text-teal-900 shadow-lg scale-105' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}
          >
            <Sparkles size={15} /> E-Bülten Abone Havuzu ({newsletterSubscribers.length})
          </button>
          <button 
            onClick={() => { setSubTab('bmi'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'bmi' ? 'bg-white text-teal-900 shadow-lg scale-105' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}
          >
            <Activity size={15} /> BMI & Sağlık ({bmiRecords.length})
          </button>
          <button 
            onClick={() => { setSubTab('labs'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'labs' ? 'bg-white text-teal-900 shadow-lg scale-105' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}
          >
            <FlaskConical size={15} /> Ar-Ge Lab Rezervasyonları ({labReservations.length})
          </button>
          <button 
            onClick={() => { setSubTab('events'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'events' ? 'bg-white text-teal-900 shadow-lg scale-105' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}
          >
            <Ticket size={15} /> Etkinlik Bilet Kayıtları ({eventRegistrations.length})
          </button>
          <button 
            onClick={() => { setSubTab('surveys'); setSearch(''); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${subTab === 'surveys' ? 'bg-white text-teal-900 shadow-lg scale-105' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}
          >
            <FileText size={15} /> Mezun Memnuniyet Anketleri ({surveys.length})
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">

        {/* SUB-PANEL 0: KARİYER CHECK-UP HAVUZU */}
        {subTab === 'checkup' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Mezun adı, bölüm, sektör veya yeni bilgi ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-3 py-1.5 rounded-xl">💡 Satıra tıklayarak 12 sorunun tam detaylı kartını açabilirsiniz</span>
                <button 
                  onClick={() => exportToExcel(checkupRecords, 'IESU_Mezun_Kariyer_Checkup_Havuzu')}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#990000] to-red-800 hover:from-red-700 hover:to-red-900 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Download size={16} /> Kariyer Check-up Excel İndir
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A2342] text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">No / İntikâl</th>
                    <th className="p-3.5">Mezun Ad Soyad</th>
                    <th className="p-3.5">Bölüm / Yıl</th>
                    <th className="p-3.5">İstihdam & Sektör</th>
                    <th className="p-3.5">Soru 6 (Bölümle İlişkili Mi?)</th>
                    <th className="p-3.5">Soru 10 (Tel Güncel Mi?)</th>
                    <th className="p-3.5">Soru 11 (E-Mail Güncel Mi?)</th>
                    <th className="p-3.5">Detay Gör</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {checkupRecords.filter(r => (r.name || '').toLowerCase().includes(search.toLowerCase()) || (r.department || '').toLowerCase().includes(search.toLowerCase()) || (r.sector || '').toLowerCase().includes(search.toLowerCase())).map(r => (
                    <tr 
                      key={r.id} 
                      onClick={() => setSelectedCheckup(r)}
                      className="hover:bg-red-50/50 transition cursor-pointer group"
                    >
                      <td className="p-3.5 font-mono text-[#990000] font-black">{r.id}<br/><span className="text-[10px] text-slate-400 font-normal">{r.date}</span></td>
                      <td className="p-3.5 font-bold text-slate-900 group-hover:text-[#990000] flex items-center gap-1.5">
                        {r.name} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition text-[#990000]" />
                      </td>
                      <td className="p-3.5 font-medium text-slate-600">{r.department} ({r.graduationYear})</td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900">{r.employed}</span> — {r.sector}<br/>
                        <span className="text-[10px] text-slate-500 font-semibold">{r.title} ({r.workMode})</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${r.relatedToMajor === 'Evet' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{r.relatedToMajor}</span>
                        {r.relatedToMajor === 'Hayır' && <div className="text-[11px] font-bold text-red-700 mt-1">Yeni İş: {r.newJobTitleIfNo}</div>}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${r.phoneUpdated === 'Evet' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>{r.phoneUpdated}</span>
                        {r.phoneUpdated === 'Hayır' && <div className="text-[11px] font-bold text-amber-900 mt-1">📞 Yeni Tel: {r.newPhone}</div>}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${r.emailUpdated === 'Evet' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>{r.emailUpdated}</span>
                        {r.emailUpdated === 'Hayır' && <div className="text-[11px] font-bold text-amber-900 mt-1">✉️ Yeni Mail: {r.newEmail}</div>}
                      </td>
                      <td className="p-3.5">
                        <span className="px-3 py-1.5 bg-[#990000] text-white rounded-xl text-[10px] font-black uppercase tracking-wider group-hover:bg-red-800 shadow-sm transition">
                          Aç & İncele
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Modal Panel for Selected Checkup Record */}
        {selectedCheckup && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#990000] bg-red-50 px-3 py-1 rounded-full border border-red-100 inline-block mb-1">
                    🧭 Kariyer Check-up Tam Yanıt Kartı ({selectedCheckup.id})
                  </span>
                  <h3 className="text-xl font-black text-slate-900">{selectedCheckup.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{selectedCheckup.department} — Mezuniyet Yılı: {selectedCheckup.graduationYear}</p>
                </div>
                <button 
                  onClick={() => setSelectedCheckup(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-bold transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 12 Questions Structured View Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">1. Aktif İstihdam</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.employed}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">2. İlk İş Bulma Süresi</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.jobTiming}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">3. Çalıştığı Sektör</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.sector}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">4. Kurum Türü</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.companyType}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">5. Görev / Ünvan</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.title}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">6. Bölümle İlişkili Mi?</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {selectedCheckup.relatedToMajor}
                    {selectedCheckup.relatedToMajor === 'Hayır' && (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-black">
                        Yeni İş: {selectedCheckup.newJobTitleIfNo}
                      </span>
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">7. İl / Ülke</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.city}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">8. Çalışma Şekli</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.workMode}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">9. Lisansüstü Eğitim</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedCheckup.postgrad}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">10. Telefon Güncellendi Mi?</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedCheckup.phoneUpdated} {selectedCheckup.phoneUpdated === 'Hayır' && <span className="text-amber-700 font-black">({selectedCheckup.newPhone})</span>}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-400 text-[10px] uppercase">11. E-Posta Güncellendi Mi?</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedCheckup.emailUpdated} {selectedCheckup.emailUpdated === 'Hayır' && <span className="text-amber-700 font-black">({selectedCheckup.newEmail})</span>}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 md:col-span-2">
                  <span className="font-black text-slate-400 text-[10px] uppercase">12. Görüş & Öneri</span>
                  <p className="font-medium text-slate-800 text-xs leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60 mt-1">
                    "{selectedCheckup.notes}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedCheckup(null)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-PANEL 1: E-BÜLTEN ABONE HAVUZU */}
        {subTab === 'newsletter' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="w-full sm:w-96 bg-white border border-slate-300/80 rounded-2xl flex items-center px-4 py-2.5 shadow-sm">
                <Search size={16} className="text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Abone adı, e-posta veya bölüm ara..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(newsletterSubscribers, 'IESU_EBulten_Abone_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
              >
                <Download size={16} /> Excel / CSV Olarak İndir
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-white uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="p-3.5">Kayıt ID</th>
                    <th className="p-3.5">Ad Soyad</th>
                    <th className="p-3.5">E-Posta</th>
                    <th className="p-3.5">Fakülte / Birim</th>
                    <th className="p-3.5">Bölüm</th>
                    <th className="p-3.5">Sınıf</th>
                    <th className="p-3.5">Doğum Tarihi</th>
                    <th className="p-3.5">KVKK Durumu</th>
                    <th className="p-3.5 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {newsletterSubscribers
                    .filter(s => 
                      !search || 
                      (s.fullName || '').toLowerCase().includes(search.toLowerCase()) || 
                      (s.email || '').toLowerCase().includes(search.toLowerCase()) || 
                      (s.department || '').toLowerCase().includes(search.toLowerCase())
                    )
                    .map(sub => (
                      <tr key={sub.id} className="hover:bg-red-50/50 transition">
                        <td className="p-3.5 font-bold text-[#990000]">{sub.id}</td>
                        <td className="p-3.5 font-black text-slate-900">{sub.fullName || 'Belirtilmedi'}</td>
                        <td className="p-3.5 font-semibold text-indigo-700">{sub.email}</td>
                        <td className="p-3.5">{sub.faculty || 'Mühendislik ve Mimarlık Fakültesi'}</td>
                        <td className="p-3.5 font-bold">{sub.department || 'Yazılım Müh.'}</td>
                        <td className="p-3.5 font-semibold">{sub.grade || '1. Sınıf'}</td>
                        <td className="p-3.5">{sub.birthDate || '2004-01-01'}</td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            <CheckCircle2 size={12} /> {sub.status || 'Onaylı'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => window.alert(`📋 ABONE PROFİL DETAYI:\n-------------------------------\nID: ${sub.id}\nAd Soyad: ${sub.fullName}\nE-Posta: ${sub.email}\nFakülte: ${sub.faculty}\nBölüm: ${sub.department}\nSınıf: ${sub.grade}\nDoğum Tarihi: ${sub.birthDate}\nKayıt Tarihi: ${sub.date}\nKVKK Onayı: ${sub.status}`)}
                            className="px-3 py-1.5 bg-[#990000] hover:bg-red-800 text-white rounded-xl text-[11px] font-bold transition shadow-sm"
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                  className="w-full bg-transparent text-xs font-bold text-red-900 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(bmiRecords, 'IESU_Ogrenci_BMI_ve_Saglik_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
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
                <tbody className="divide-y divide-slate-100 font-medium text-red-900">
                  {bmiRecords.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())).map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-red-600 font-black">{r.id}</td>
                      <td className="p-3.5 font-bold text-red-950">{r.name}</td>
                      <td className="p-3.5 font-medium">{r.height} cm / {r.weight} kg</td>
                      <td className="p-3.5 font-black text-red-950">{r.bmi} kg/m²</td>
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
                  className="w-full bg-transparent text-xs font-bold text-red-900 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(labReservations, 'IESU_ArGe_Lab_Rezervasyon_Havuzu')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
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
                <tbody className="divide-y divide-slate-100 font-medium text-red-900">
                  {labReservations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.labName.toLowerCase().includes(search.toLowerCase())).map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-red-600 font-black">{l.id}</td>
                      <td className="p-3.5 font-bold text-red-950">{l.name}</td>
                      <td className="p-3.5 font-bold text-red-600">{l.labName}</td>
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
                  className="w-full bg-transparent text-xs font-bold text-red-900 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(eventRegistrations, 'IESU_Etkinlik_Bilet_Kayitlari')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
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
                <tbody className="divide-y divide-slate-100 font-medium text-red-900">
                  {eventRegistrations.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.eventTitle.toLowerCase().includes(search.toLowerCase())).map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-red-600 font-black">{e.ticketCode || e.id}</td>
                      <td className="p-3.5 font-bold text-red-950">{e.name}</td>
                      <td className="p-3.5 font-bold text-red-950">{e.eventTitle}</td>
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
                  className="w-full bg-transparent text-xs font-bold text-red-900 focus:outline-none" 
                />
              </div>
              <button 
                onClick={() => exportToExcel(surveys, 'IESU_Mezun_Memnuniyet_Anketleri')}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-orange-500 text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 shrink-0"
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
                <tbody className="divide-y divide-slate-100 font-medium text-red-900">
                  {surveys.filter(s => s.title.toLowerCase().includes(search.toLowerCase())).map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-mono text-red-600 font-black">{s.id}</td>
                      <td className="p-3.5 font-bold text-red-950">{s.title}</td>
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
