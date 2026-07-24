import React, { useState } from 'react';
import { Briefcase, Search, MapPin, Building, ChevronLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';

const JOBS_DATA = [
  { id: 1, title: "Junior Frontend Developer", company: "Trendyol", location: "İstanbul (Hibrit)", type: "Tam Zamanlı", category: "Yazılım", applied: false },
  { id: 2, title: "Yapay Zeka & Veri Analisti Stajyeri", company: "Getir", location: "İstanbul (Uzaktan)", type: "Staj", category: "Yapay Zeka", applied: false },
  { id: 3, title: "Siber Güvenlik Uzman Yardımcısı", company: "Aselsan", location: "Ankara (Yerinde)", type: "Tam Zamanlı", category: "Güvenlik", applied: false },
  { id: 4, title: "UI/UX Tasarım Stajyeri", company: "Ford Otosan", location: "Kocaeli (Hibrit)", type: "Staj", category: "Tasarım", applied: false }
];

export default function KariyerJobBoard({ setView, currentUser, userRole, setSelectedUserId }) {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [appliedJobs, setAppliedJobs] = useState([]);

  const filteredJobs = JOBS_DATA.filter(job => {
    const matchesFilter = filter === 'Tümü' || job.type === filter;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApply = (jobId, jobTitle) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      window.toast && window.toast.success(`"${jobTitle}" ilanına CV'niz başarıyla iletildi.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(currentUser ? (userRole === 'employer' ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student') : 'landing')} 
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Briefcase className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight">Kariyer İş & Staj İlanları</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1100px] mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5">
            <Search size={18} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="İlan veya şirket ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs font-semibold w-full focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            {['Tümü', 'Staj', 'Tam Zamanlı'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition ${filter === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map(job => {
            const isApplied = appliedJobs.includes(job.id);
            return (
              <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">{job.type}</span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">{job.title}</h3>
                  <p className="text-xs font-bold text-slate-500 mb-6 flex items-center gap-1.5"><Building size={14} /> {job.company}</p>
                </div>

                <button 
                  onClick={() => handleApply(job.id, job.title)}
                  className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 ${isApplied ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                  {isApplied ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                  {isApplied ? 'Başvuru Gönderildi' : '1-Tıkla CV Gönder'}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
