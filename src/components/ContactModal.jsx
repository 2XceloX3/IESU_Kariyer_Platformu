import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import OfficeInfo from './OfficeInfo';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      if (onClose) onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/60 backdrop-blur-sm animate-fade-in"
      data-testid="contact-modal"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          data-testid="contact-modal-close-btn"
          className="absolute top-6 right-6 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-red-950">İletişim & Bize Ulaşın</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi
          </p>
        </div>

        <OfficeInfo />

        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-lg font-black text-red-950 mb-4">Mesaj Gönderin</h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3" data-testid="contact-success-msg">
              <CheckCircle2 size={24} className="text-emerald-600" />
              <div>
                <h4 className="font-bold text-sm">Mesajınız başarıyla iletildi!</h4>
                <p className="text-xs">Kariyer Ofisi ekibimiz en kısa sürede size dönüş yapacaktır.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#A80016]"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#A80016]"
                    placeholder="ornek@esenyurt.edu.tr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Konu</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#A80016]"
                  placeholder="Kariyer Danışmanlığı / Staj / Genel Bilgi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mesajınız</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#A80016]"
                  placeholder="İletmek istediğiniz mesajı buraya yazabilirsiniz..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#A80016] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-700 transition cursor-pointer"
              >
                <Send size={14} /> Mesajı Gönder
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

