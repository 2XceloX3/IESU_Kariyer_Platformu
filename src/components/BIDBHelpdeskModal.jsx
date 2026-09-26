import React, { useState } from 'react';
import { HelpCircle, Send, ChevronLeft, CheckCircle } from 'lucide-react';
import TopProfileMenu from './TopProfileMenu';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import useAppStore from '../store/useAppStore';

export default function BIDBHelpdeskModal({ setView, currentUser, userRole, setSelectedUserId }) {
  const addHelpdeskTicket = useAppStore(state => state.addHelpdeskTicket);
  const [form, setForm] = useState({ subject: 'E-Posta / Wi-Fi Şifre Sıfırlama', details: '', email: currentUser?.email || '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.details.trim()) {
      window.toast && window.toast.error("Lütfen sorun detaylarını açıklayın.");
      return;
    }
    const ticketNo = `BIDB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    addHelpdeskTicket({
      id: ticketNo,
      name: currentUser?.name || 'Kullanıcı',
      email: form.email,
      subject: form.subject,
      details: form.details,
      status: 'Açık',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });
    setIsSubmitted(true);
    window.toast && window.toast.success("Destek biletiniz BİDB ekibine iletildi.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans pb-32">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(currentUser ? (userRole === 'admin' ? 'admin' : (userRole === 'employer' || userRole === 'company') ? 'company' : userRole === 'alumni' ? 'alumni' : userRole === 'academic' ? 'academic' : 'student') : 'landing')} 
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#990000] transition cursor-pointer shadow-2xs shrink-0"
            title="Geri Dön"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#990000] border border-red-100 flex items-center justify-center shadow-xs">
              <HelpCircle size={22} />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-base tracking-tight text-slate-900 leading-none">BİDB Teknik Destek (Helpdesk)</h1>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Öğrenci ve Akademik Bilişim Masası</span>
            </div>
          </div>
        </div>
        <TopProfileMenu currentUser={currentUser} userRole={userRole} setView={setView} setSelectedUserId={setSelectedUserId} />
      </header>

      <main className="flex-1 w-full max-w-[700px] mx-auto p-4 lg:p-8 flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-1">Destek Talebi Oluştur</h2>
                <p className="text-xs font-semibold text-slate-500">Siteden ayrılmadan şifre sıfırlama veya bilişim destek biletinizi iletin.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-500 uppercase">Konu</label>
                <select 
                  value={form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#990000]"
                >
                  <option>E-Posta / Wi-Fi Şifre Sıfırlama</option>
                  <option>LMS Ders Erişim Sorunu</option>
                  <option>OBİS Giriş ve Bağlantı Problemi</option>
                  <option>Diğer Teknik Destek</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-500 uppercase">E-Posta Adresiniz</label>
                <input 
                  type="email" 
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#990000]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-slate-500 uppercase">Sorun Detayı</label>
                <textarea 
                  rows="4"
                  value={form.details}
                  onChange={e => setForm({...form, details: e.target.value})}
                  placeholder="Lütfen karşılaştığınız sorunu detaylıca açıklayın..."
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-[#990000] resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-[#990000] hover:bg-red-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Send size={16} /> Destek Biletini Gönder
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Destek Biletiniz Oluşturuldu</h3>
              <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                Bilet Numarası: <span className="font-mono text-[#990000] font-bold">#BIDB-2026-849</span><br/>
                Yanıtınız en geç 2 saat içinde kayıtlı e-posta adresinize iletilecektir.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
              >
                Yeni Bilet Oluştur
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Dock */}
      {setView && (
        <SubPanelFloatingDock 
          currentUser={currentUser} 
          setView={setView} 
          setSelectedUserId={setSelectedUserId}
          userRole={userRole || 'student'}
          activeTab="bidb"
        />
      )}
    </div>
  );
}
