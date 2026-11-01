import React from 'react';
import { X, FileText, User, GraduationCap, BookOpen } from 'lucide-react';

export default function FooterNewsletterModals({
  showKvkkModal,
  setShowKvkkModal,
  setKvkkAgreed,
  showSubscriberModal,
  setShowSubscriberModal,
  form,
  setForm,
  onSubmitSubscriber,
}) {
  return (
    <>
      {/* KVKK MODAL POPUP */}
      {showKvkkModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowKvkkModal(false)}
              aria-label="KVKK penceresini kapat"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2.5 bg-red-50 text-[#990000] rounded-2xl">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">KVKK Aydınlatma Metni</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">İstanbul Esenyurt Üniversitesi</p>
              </div>
            </div>

            <div className="text-xs leading-relaxed text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              <p className="font-medium">
                <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (&apos;KVKK&apos;)</strong> uyarınca, kişisel verileriniz veri sorumlusu sıfatıyla <strong>İstanbul Esenyurt Üniversitesi Kariyer Geliştirme Merkezi</strong> tarafından işlenmektedir.
              </p>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-xs flex items-center gap-1.5 text-[#990000]">
                  1. İşlenme Amacı
                </h4>
                <p className="text-[11px]">
                  Öğrenci ve mezunlarımızın iş/staj olanaklarından faydalanması, kariyer etkinliklerine katılımı ve istatistiksel raporlamalar yapılması.
                </p>

                <h4 className="font-bold text-xs flex items-center gap-1.5 text-[#990000]">
                  2. Verilerin Aktarımı
                </h4>
                <p className="text-[11px]">
                  İzniniz doğrultusunda, işbirliği yapılan kurum ve kuruluşlarla (işverenlerle) staj ve iş başvurularınız kapsamında paylaşılabilir.
                </p>

                <h4 className="font-bold text-xs flex items-center gap-1.5 text-[#990000]">
                  3. Haklarınız
                </h4>
                <p className="text-[11px]">
                  KVKK Madde 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltme talep etme ve silinmesini isteme hakkına sahipsiniz. Başvurularınızı <a href="mailto:kvkk@esenyurt.edu.tr" className="text-[#990000] underline font-bold">kvkk@esenyurt.edu.tr</a> adresine iletebilirsiniz.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setKvkkAgreed?.(true);
                  setShowKvkkModal(false);
                }}
                className="px-5 py-2.5 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition shadow-md"
              >
                Okudum, Anladım
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBSCRIBER REGISTRATION FORM MODAL */}
      {showSubscriberModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white text-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowSubscriberModal(false)}
              aria-label="Kayıt formunu kapat"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2.5 bg-red-50 text-[#990000] rounded-2xl">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-tight">E-Bülten Kayıt Detayı</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Öğrenci & Mezun Profil Bilgisi</p>
              </div>
            </div>

            <form onSubmit={onSubmitSubscriber} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Ad Soyad *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="Adınız ve Soyadınız..."
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Fakülte / Meslek Yüksekokulu</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <select
                    value={form.faculty}
                    onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  >
                    <option value="Mühendislik ve Mimarlık Fakültesi">Mühendislik ve Mimarlık Fakültesi</option>
                    <option value="İktisadi, İdari ve Sosyal Bilimler Fakültesi">İktisadi, İdari ve Sosyal Bilimler Fakültesi</option>
                    <option value="Sanat ve Tasarım Fakültesi">Sanat ve Tasarım Fakültesi</option>
                    <option value="Beden Eğitimi ve Spor Yüksekokulu (BESYO)">BESYO</option>
                    <option value="Meslek Yüksekokulu (MYO)">Meslek Yüksekokulu (MYO)</option>
                    <option value="Sağlık Hizmetleri Meslek Yüksekokulu (SHMYO)">Sağlık Hizmetleri MYO (SHMYO)</option>
                    <option value="Mezun / Diğer">Mezun / Diğer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Bölüm / Program *</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yazılım Mühendisliği, İlk ve Acil Yardım..."
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Sınıf</label>
                  <select
                    value={form.grade}
                    onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  >
                    <option value="Hazırlık">Hazırlık</option>
                    <option value="1. Sınıf">1. Sınıf</option>
                    <option value="2. Sınıf">2. Sınıf</option>
                    <option value="3. Sınıf">3. Sınıf</option>
                    <option value="4. Sınıf">4. Sınıf</option>
                    <option value="Mezun">Mezun</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Doğum Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#990000]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubscriberModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] text-white text-xs font-bold rounded-xl hover:bg-red-800 transition shadow-md"
                >
                  Kaydı Tamamla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
