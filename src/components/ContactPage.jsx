import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import MainHeader from './MainHeader';
import SubPanelFooter from './SubPanelFooter';
import SubPanelFloatingDock from './SubPanelFloatingDock';
import corporateData from '../data/knowledge_base/corporate_hierarchy.json';

export default function ContactPage({ setView, currentUser, userRole, setSelectedUserId }) {
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      if (window.toast?.error) window.toast.error("Lütfen bir mesaj yazın.");
      else alert("Lütfen bir mesaj yazın.");
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('iesu_admin_messages_v1') || '[]');
      const newMsg = {
        id: 'msg_' + Date.now(),
        from: form.name || 'Ziyaretçi',
        email: form.email || 'bilgi@esenyurt.edu.tr',
        subject: 'İletişim Sayfası Mesajı',
        body: form.message,
        date: new Date().toLocaleDateString('tr-TR'),
        read: false,
        source: 'ContactPage'
      };
      localStorage.setItem('iesu_admin_messages_v1', JSON.stringify([newMsg, ...stored]));
    } catch (err) {
      console.warn('Mesaj kaydedilemedi:', err);
    }
    setSent(true);
    if (window.toast?.success) window.toast.success("Mesajınız İletişim Koordinatörlüğüne ulaştırıldı.");
    else alert("Mesajınız İletişim Koordinatörlüğüne ulaştırıldı.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-red-900 flex flex-col font-sans">
      <MainHeader setView={setView} currentUser={currentUser} userRole={userRole} />

      <main className="flex-1 w-full max-w-[1100px] mx-auto p-4 lg:p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-red-950 mb-2">Bizimle İletişime Geçin</h2>
              <p className="text-xs font-semibold text-slate-500">Sorularınız, önerileriniz ve talepleriniz için santralimiz hizmetinizdedir.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-red-600 rounded-2xl shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs text-red-950 uppercase">Santral & Adres</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">{corporateData.contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-100 pt-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs text-red-950 uppercase">Telefon & Çağrı Merkezi</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{corporateData.contact.phone} / {corporateData.contact.callCenter}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-slate-100 pt-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs text-red-950 uppercase">E-Posta</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{corporateData.contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-center">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-red-950 mb-1">İletişim Formu</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Adınız Soyadınız</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">E-Posta Adresiniz</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase">Mesajınız</label>
                  <textarea 
                    rows="4" 
                    value={form.message} 
                    onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="İletmek istediğiniz mesaj..."
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-red-500 resize-none"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-red-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send size={16} /> Formu Gönder
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                  <CheckCircle size={28} />
                </div>
                <h4 className="font-black text-red-950 text-base">Mesajınız Alındı</h4>
                <p className="text-xs font-semibold text-slate-500">Talebiniz ilgili üniversite birimine iletilmiştir.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SubPanelFooter setView={setView} />

      <SubPanelFloatingDock 
        currentUser={currentUser} 
        setView={setView} 
        setSelectedUserId={setSelectedUserId} 
        userRole={userRole || 'student'} 
      />
    </div>
  );
}
