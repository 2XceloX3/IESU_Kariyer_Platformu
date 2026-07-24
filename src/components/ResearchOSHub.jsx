import React, { useState } from 'react';
import { ChevronLeft, Atom, BookOpen, Search, Building, Users, Calendar, ArrowRight, Download, FileText, CheckCircle2, Sparkles, Filter, FlaskConical } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';

const PAPERS_DATA = [
  {
    id: 'PUB-2026-01',
    title: 'Akıllı Şehirlerde Yapay Zeka Tabanlı Trafik ve Enerji Optimizasyonu',
    authors: 'Prof. Dr. Bahri Şahin, Dr. Öğr. Üyesi Ahmet Yılmaz',
    department: 'Bilgisayar Mühendisliği',
    year: '2026',
    journal: 'IEEE Transactions on Smart Grid (Q1)',
    category: 'Yapay Zeka',
    citations: 42,
    abstract: 'Bu çalışmada derin öğrenme modelleri kullanılarak kentsel altyapı enerji tüketimi %28 oranında azaltılmıştır.'
  },
  {
    id: 'PUB-2026-02',
    title: 'Biyomedikal Sensörlerde Nanoteknoloji Tabanlı Biyo-Uyumlu Kaplamalar',
    authors: 'Doç. Dr. Ayşe Kaya, Arş. Gör. Mert Demir',
    department: 'Biyomedikal Mühendisliği',
    year: '2025',
    journal: 'Nature Biomedical Engineering',
    category: 'Biyomedikal',
    citations: 89,
    abstract: 'İmplante edilebilir medikal cihazların doku uyumunu artıran yenilikçi polimer nanokaplama tekniği sunulmaktadır.'
  },
  {
    id: 'PUB-2026-03',
    title: 'Sürdürülebilir Kampüs Yönetiminde Karbon Ayak İzi Analizi ve Sıfır Atık',
    authors: 'Prof. Dr. Nuri Kuruoğlu, Dr. Zeynep Arslan',
    department: 'Çevre Mühendisliği',
    year: '2026',
    journal: 'Journal of Cleaner Production',
    category: 'Sürdürülebilirlik',
    citations: 15,
    abstract: 'Üniversite yerleşkelerinde yenilenebilir güneş enerjisi ve yağmur suyu hasadı entegrasyon modeli.'
  }
];

const LABS_DATA = [
  {
    id: 'LAB-01',
    name: 'Yapay Zeka & Derin Öğrenme Ar-Ge Lab',
    location: 'J Blok 4. Kat / Lab 402',
    equipment: '8x NVIDIA H100 Tensor Core GPU Sunucu',
    capacity: '25 Araştırmacı',
    status: 'Aktif / Rezervasyona Açık'
  },
  {
    id: 'LAB-02',
    name: 'Otonom Sistemler & İHA Geliştirme Lab',
    location: 'Kuluçka Merkezi A Blok',
    equipment: 'Rüzgar Tüneli & 3D Metal Yazıcılar',
    capacity: '15 Araştırmacı',
    status: 'Aktif / Rezervasyona Açık'
  },
  {
    id: 'LAB-03',
    name: 'Biyomedikal Cihaz & Doku Mühendisliği Lab',
    location: 'C Blok Zemin Kat / Lab 104',
    equipment: 'Hücre Kültür İnkübatörleri & Mikroskoplar',
    capacity: '20 Araştırmacı',
    status: 'Bakımda (Yarın Açık)'
  }
];

const CALLS_DATA = [
  {
    id: 'CALL-101',
    title: 'TÜBİTAK 2209-A: Otonom İHA Kontrol Algoritmaları Bursiyer Çağrısı',
    lead: 'Dr. Öğr. Üyesi Mehmet Can',
    positions: '2 Lisans / 1 Yüksek Lisans Öğrencisi',
    deadline: '15 Mart 2026',
    budget: '75.000 ₺ Destekli'
  },
  {
    id: 'CALL-102',
    title: 'BAP Projesi: Sağlıkta LLM Destekli Tanı Asistanı Araştırmacı Alımı',
    lead: 'Prof. Dr. Bahri Şahin',
    positions: '3 Yazılım Araştırmacısı',
    deadline: '01 Nisan 2026',
    budget: '120.000 ₺ Destekli'
  }
];

export default function ResearchOSHub({ setView, currentUser, userRole, setSelectedUserId }) {
  const [activeTab, setActiveTab] = useState('papers'); // papers, labs, calls
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [bookedLabs, setBookedLabs] = useState([]);
  const [appliedCalls, setAppliedCalls] = useState([]);

  const filteredPapers = PAPERS_DATA.filter(p => {
    const matchesCat = categoryFilter === 'Tümü' || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.authors.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBookLab = (labId, labName) => {
    if (!bookedLabs.includes(labId)) {
      setBookedLabs([...bookedLabs, labId]);
      window.toast && window.toast.success(`"${labName}" laboratuvarı için çalışma saati rezervasyonunuz oluşturuldu.`);
    }
  };

  const handleApplyCall = (callId, callTitle) => {
    if (!appliedCalls.includes(callId)) {
      setAppliedCalls([...appliedCalls, callId]);
      window.toast && window.toast.success(`"${callTitle}" projesine araştırmacı başvurunuz iletildi.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView((currentUser && currentUser.id) ? (userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : userRole === 'admin' ? 'admin' : 'student') : 'landing')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Atom className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight">Research OS & Akademik Ar-Ge Merkezi</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1150px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/70 px-3.5 py-1.5 rounded-full border border-indigo-900/60">
            Enterprise Research OS Layer
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-3 mb-2 tracking-tight">
            Akademik Araştırma, Makale & Ar-Ge Ekosistemi
          </h2>
          <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
            Üniversitemiz bünyesinde yayınlanan uluslararası makaleleri inceleyin, 110+ Ar-Ge laboratuvarından ekipman rezerve edin ve TÜBİTAK/BAP araştırma projelerine başvurun.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-3 mt-6 border-t border-slate-800 pt-6">
            <button 
              onClick={() => setActiveTab('papers')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${activeTab === 'papers' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              <BookOpen size={16} /> Makale & Bildiri İndeksi ({PAPERS_DATA.length})
            </button>
            <button 
              onClick={() => setActiveTab('labs')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${activeTab === 'labs' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              <FlaskConical size={16} /> Ar-Ge Laboratuvar Rezervasyonu ({LABS_DATA.length})
            </button>
            <button 
              onClick={() => setActiveTab('calls')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 ${activeTab === 'calls' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
            >
              <Users size={16} /> Proje & Bursiyer Çağrıları ({CALLS_DATA.length})
            </button>
          </div>
        </div>

        {/* TAB 1: PAPERS INDEX */}
        {activeTab === 'papers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5">
                <Search size={18} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Makale veya yazar ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs font-bold w-full focus:outline-none text-slate-800"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {['Tümü', 'Yapay Zeka', 'Biyomedikal', 'Sürdürülebilirlik'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition ${categoryFilter === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredPapers.map(paper => (
                <div key={paper.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">{paper.category}</span>
                      <span className="text-xs font-bold text-slate-400">{paper.journal}</span>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{paper.citations} Atıf</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900">{paper.title}</h3>
                    <p className="text-xs font-semibold text-slate-500">{paper.authors} • <span className="text-slate-700 font-bold">{paper.department}</span> ({paper.year})</p>
                  </div>

                  <button 
                    onClick={() => setSelectedPaper(paper)}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl transition flex items-center gap-2 shrink-0 shadow-md"
                  >
                    <FileText size={16} /> Özeti Gör & İndir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LAB RESERVATIONS */}
        {activeTab === 'labs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LABS_DATA.map(lab => {
              const isBooked = bookedLabs.includes(lab.id);
              return (
                <div key={lab.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 mb-3 inline-block">{lab.status}</span>
                    <h3 className="text-base font-black text-slate-900 mb-2">{lab.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mb-4">{lab.location}</p>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-medium text-slate-700 space-y-1 mb-6">
                      <div><strong className="font-bold">Donanım:</strong> {lab.equipment}</div>
                      <div><strong className="font-bold">Kapasite:</strong> {lab.capacity}</div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleBookLab(lab.id, lab.name)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 ${isBooked ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}`}
                  >
                    {isBooked ? <CheckCircle2 size={16} /> : <Calendar size={16} />}
                    {isBooked ? 'Lab Rezervasyonu Alındı' : 'Çalışma Saati Rezerve Et'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: PROJECT CALLS */}
        {activeTab === 'calls' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CALLS_DATA.map(call => {
              const isApplied = appliedCalls.includes(call.id);
              return (
                <div key={call.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 mb-3 inline-block">{call.budget}</span>
                    <h3 className="text-base font-black text-slate-900 mb-3">{call.title}</h3>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-600 space-y-1.5 mb-6">
                      <div>Yürütücü: <span className="font-bold text-slate-800">{call.lead}</span></div>
                      <div>Açık Pozisyonlar: <span className="font-bold text-slate-800">{call.positions}</span></div>
                      <div>Son Başvuru: <span className="font-bold text-slate-800">{call.deadline}</span></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApplyCall(call.id, call.title)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 ${isApplied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}`}
                  >
                    {isApplied ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                    {isApplied ? 'Başvurunuz İletildi' : 'Araştırmacı Olarak Başvur'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Abstract Modal */}
        {selectedPaper && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedPaper(null)}>
            <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-100 space-y-4" onClick={e => e.stopPropagation()}>
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">{selectedPaper.category}</span>
              <h3 className="text-lg font-black text-slate-900">{selectedPaper.title}</h3>
              <p className="text-xs font-bold text-slate-500">{selectedPaper.authors} ({selectedPaper.year})</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                <strong className="block mb-1 text-slate-900">Özet (Abstract):</strong>
                {selectedPaper.abstract}
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    window.toast && window.toast.success("Makale PDF indiriliyor...");
                    setSelectedPaper(null);
                  }}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl transition flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Tam Metin PDF İndir
                </button>
                <button 
                  onClick={() => setSelectedPaper(null)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-2xl transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
