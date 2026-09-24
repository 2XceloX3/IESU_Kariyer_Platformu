import React, { useState } from 'react';
import { X, Send, Calendar, Clock, Video, Building, Award, ShieldCheck, UserCheck, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from '../shared/Toast';
import useAppStore from '../../store/useAppStore';
import { useAdminStore } from '../../brain/useAdminStore';

export default function MentorRequestModal({ isOpen, onClose, mentor, currentUser }) {
  const [topic, setTopic] = useState('Kariyer Planlama & Hedef Belirleme');
  const [mode, setMode] = useState('Online Görüşme (Google Meet / Zoom)');
  const [timeSlot, setTimeSlot] = useState('Hafta İçi - Öğleden Sonra (13:00 - 17:00)');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !mentor) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!note.trim() || note.trim().length < 10) {
      toast.error('Lütfen mentörünüze hedeflerinizi ve danışmak istediğiniz konuları belirten en az 10 karakterlik bir mesaj yazınız.');
      return;
    }

    setSubmitting(true);

    const newRequest = {
      id: 'mreq_' + Date.now(),
      studentId: currentUser?.id || 'std_' + Date.now(),
      studentName: currentUser?.name || 'Öğrenci',
      studentDept: currentUser?.department || currentUser?.faculty || 'Öğrenci',
      studentEmail: currentUser?.email || 'ogrenci@esenyurt.edu.tr',
      mentorId: mentor.id || 'mnt_' + Date.now(),
      mentorName: mentor.name || 'Onaylı Mentör',
      mentorTitle: mentor.title || mentor.department || 'İESÜ Mentörü',
      topic: topic,
      mode: mode,
      preferredDate: date,
      preferredTime: timeSlot,
      note: note.trim(),
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Beklemede'
    };

    try {
      // 1. Sync to localStorage for CMSMentorshipPool
      const existing = JSON.parse(localStorage.getItem('iesu_mentorship_requests_v1') || '[]');
      const updated = [newRequest, ...existing];
      localStorage.setItem('iesu_mentorship_requests_v1', JSON.stringify(updated));

      // 2. Sync to Zustand Admin & Shared Stores
      try {
        const adminStore = useAdminStore.getState();
        if (adminStore.setMentorships) {
          adminStore.setMentorships(updated);
        }
      } catch (err) {
        console.warn('AdminStore sync note:', err);
      }

      try {
        const appStore = useAppStore.getState();
        if (appStore.setMentorships) {
          appStore.setMentorships(updated);
        }
      } catch (err) {
        console.warn('AppStore sync note:', err);
      }

      toast.success(`Sayın ${mentor.name} için mentörlük talebiniz başarıyla oluşturuldu! Koordinatörlük ve mentör onayından sonra bilgilendirileceksiniz.`);
      setNote('');
      setSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Mentorship request submission error:', err);
      toast.error('Mentörlük talebi iletilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
      setSubmitting(false);
    }
  };

  const TOPIC_OPTIONS = [
    'Kariyer Planlama & Hedef Belirleme',
    'CV & Portfolyo İncelemesi',
    'Mülakat Hazırlığı & Simülasyonu',
    'Staj & İş Fırsatları Değerlendirmesi',
    'Sektörel Teknik Rehberlik & Teknoloji Trendleri',
    'Akademik & Lisansüstü Danışmanlık'
  ];

  const TIME_SLOT_OPTIONS = [
    'Hafta İçi - Sabah (09:00 - 12:00)',
    'Hafta İçi - Öğleden Sonra (13:00 - 17:00)',
    'Hafta İçi - Akşam (17:00 - 19:00)',
    'Hafta Sonu - Esnek Zaman',
    'Fark Etmez / Mentörün Uygunluğuna Göre'
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
              <UserCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Birebir Mentörlük İstek Formu</h3>
              <p className="text-xs text-teal-200 font-medium">Kariyer Geliştirme Koordinatörlüğü Onaylı Mentörlük Masası</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            title="Kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {/* Selected Mentor Card */}
          <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-teal-200 shrink-0 shadow-xs">
              <img
                src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name || 'M')}&background=0F766E&color=fff&size=120`}
                alt={mentor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-extrabold text-slate-900 text-sm">{mentor.name}</h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck size={12} className="text-emerald-700" /> Doğrulanmış Mentör
                </span>
              </div>
              <p className="text-xs font-semibold text-teal-800 mt-0.5 truncate">{mentor.title || mentor.department || 'Onaylı İESÜ Mentörü'}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {mentor.company ? `${mentor.company} • ` : ''}İstanbul Esenyurt Üniversitesi
              </p>
            </div>
          </div>

          {/* Topic Select */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award size={14} className="text-teal-700" /> Mentörlük / Danışmanlık Konusu *
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700 focus:bg-white transition"
              required
            >
              {TOPIC_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Video size={14} className="text-teal-700" /> Tercih Edilen Görüşme Türü *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('Online Görüşme (Google Meet / Zoom)')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  mode === 'Online Görüşme (Google Meet / Zoom)'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${mode.includes('Online') ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Video size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold">Online Görüşme</div>
                  <div className="text-[10px] text-slate-500">Google Meet / Zoom</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('Yüz Yüze Kampüs Görüşmesi')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  mode === 'Yüz Yüze Kampüs Görüşmesi'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${mode.includes('Yüz Yüze') ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Building size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold">Yüz Yüze Kampüs</div>
                  <div className="text-[10px] text-slate-500">KGM Ofis Randevusu</div>
                </div>
              </button>
            </div>
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-teal-700" /> Tercih Edilen Tarih *
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700 focus:bg-white transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock size={14} className="text-teal-700" /> Tercih Edilen Zaman Dilimi *
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700 focus:bg-white transition"
              >
                {TIME_SLOT_OPTIONS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Note */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare size={14} className="text-teal-700" /> Mentörünüze Notunuz & Beklentileriniz *
              </span>
              <span className="text-[10px] text-slate-400 font-normal lowercase">En az 10 karakter</span>
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Örn: Merhabalar, son sınıf öğrencisiyim. İlgili sektörde kariyer başlangıcı yapmak ve hazırladığım CV ile projelerim hakkında görüşlerinizi almak istiyorum..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:bg-white transition"
              required
            />
          </div>

          {/* Info Banner */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-[11px] leading-relaxed">
            <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              Talebiniz Kariyer Geliştirme Koordinatörlüğü denetim havuzuna kaydedilecek ve mentörünüze iletilecektir. Mentörün onay durumuna göre randevu detayları e-posta ve bildirim merkezinden tarafınıza iletilecektir.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition cursor-pointer disabled:opacity-50"
            >
              <Send size={15} />
              <span>{submitting ? 'İletiliyor...' : 'Mentörlük Talebini Gönder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
