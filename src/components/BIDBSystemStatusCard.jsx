import React from 'react';
import { ShieldCheck, Activity, Wifi, Server, CheckCircle2, ChevronLeft } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import unitsData from '../data/knowledge_base/units_services.json';

export default function BIDBSystemStatusCard({ setView, currentUser, userRole, setSelectedUserId }) {
  const status = unitsData.bidb.status;

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
            <Server className="text-indigo-600" size={24} />
            <h1 className="font-black text-slate-900 tracking-tight">BİDB Sistem Durumu</h1>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[900px] mx-auto p-4 lg:p-8 flex flex-col gap-6">
        <div className="bg-slate-950 text-white rounded-3xl p-8 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              <h2 className="text-xl font-black">Tüm Bilişim Altyapısı Operasyonel</h2>
            </div>
            <span className="text-xs font-bold text-slate-400">Son Güncelleme: Anlık</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Wifi className="text-indigo-400" size={20} />
                <span className="font-bold text-sm">Kampüs Wi-Fi Ağları</span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-900/40">{status.wifi}</span>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-400" size={20} />
                <span className="font-bold text-sm">OBİS & İBİS Portal</span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-900/40">{status.ibis_obis}</span>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Activity className="text-indigo-400" size={20} />
                <span className="font-bold text-sm">LMS Uzaktan Eğitim</span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-900/40">{status.lms}</span>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-indigo-400" size={20} />
                <span className="font-bold text-sm">Öğrenci E-Posta Sunucuları</span>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-900/40">{status.email}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
