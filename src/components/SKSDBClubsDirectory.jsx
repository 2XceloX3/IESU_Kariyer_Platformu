import React, { useState } from 'react';
import { Users, Search, ChevronLeft, Plus, CheckCircle, X } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';

const CLUBS_DATA = [
  { id: 1, name: "Yazılım ve Bilişim Kulübü", category: "Teknoloji", members: 342, lead: "Zeynep Kaya", active: true },
  { id: 2, name: "Girişimcilik ve İnovasyon Topluluğu", category: "Girişimcilik", members: 215, lead: "Mert Can", active: true },
  { id: 3, name: "Tiyatro & Sahne Sanatları Kulübü", category: "Kültür & Sanat", members: 180, lead: "Elif Demir", active: true },
  { id: 4, name: "IEEE İESÜ Öğrenci Kolu", category: "Mühendislik", members: 420, lead: "Burak Şahin", active: true }
];

export default function SKSDBClubsDirectory({ setView, currentUser, userRole, setSelectedUserId }) {
  const [filter, setFilter] = useState('Tümü');
  const [search, setSearch] = useState('');
  const [joinedClubs, setJoinedClubs] = useState([]);

  const filteredClubs = CLUBS_DATA.filter(club => {
    const matchesCategory = filter === 'Tümü' || club.category === filter;
    const matchesSearch = club.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView ? setView(currentUser ? (userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student') : 'landing') : window.history.back()} 
            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 hover:text-[#990000] hover:bg-red-50 hover:border-red-200 border border-slate-200 flex items-center justify-center transition cursor-pointer"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Users className="text-[#990000]" size={22} />
            <h1 className="font-black text-slate-900 tracking-tight text-base sm:text-lg">SKSDB Öğrenci Kulüpleri</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[1100px] mx-auto p-4 lg:p-8 flex flex-col gap-6 pb-28">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
          <div className="w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-2xl flex items-center px-4 py-2.5">
            <Search size={18} className="text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Kulüp ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['Tümü', 'Teknoloji', 'Girişimcilik', 'Kültür & Sanat', 'Mühendislik'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${filter === cat ? 'bg-[#990000] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClubs.map(club => {
            const isJoined = joinedClubs.includes(club.id);
            return (
              <div key={club.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase text-[#990000] bg-red-50 px-2.5 py-1 rounded-md border border-red-100">{club.category}</span>
                    <span className="text-xs font-bold text-slate-700">{club.members} Üye</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-base mb-1">{club.name}</h3>
                  <p className="text-xs font-bold text-slate-600 mb-6">Başkan: {club.lead}</p>
                </div>

                <button 
                  onClick={() => {
                    if (!isJoined) {
                      setJoinedClubs([...joinedClubs, club.id]);
                      if (window.toast) window.toast.success(`${club.name} başvurunuz alındı!`);
                    }
                  }}
                  className={`w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${isJoined ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold' : 'bg-[#990000] hover:bg-red-800 text-white shadow-xs'}`}
                >
                  {isJoined ? <CheckCircle size={16} /> : <Plus size={16} />}
                  {isJoined ? 'Başvuru Alındı' : 'Kulübe Katıl'}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId}
        userRole={userRole}
      />
    </div>
  );
}
